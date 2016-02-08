import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {submitting, getData} from '../submitting.js';
import {Waiting, Error, Empty, Menu} from './templates.js';
import toast from '../toaster.js';
import {colorpick} from '../picker.js';

//responses
var actions_r = ['Success!', 'Server error' , 'Required fields are empty', 'Incorrect color'];

//RegExp
var re_color = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");

//refresh groups list
var refresh;

var Creating = React.createClass({
    getInitialState() {
        return null
    },
    componentDidMount() {
        setTimeout(colorpick, 100);
    },
    submit(elem) {
        var ajax_data = getData(elem.target);
        if(!ajax_data) {
            toast(actions_r[2]);
        }
        else if(!re_color.test(ajax_data.color)) {
            toast(actions_r[3]);
            $(elem.target).parent().find('input[name="color"]').val('');
        }
        else {
            submitting(ajax_data, '/api/task_manage/create', 'POST', function(data) {
                var response_status = +data;
                if(isNaN(response_status)) {
                    response_status = 1;
                }
                if(response_status == 0) {
                    toast(actions_r[0]);
                    $(elem.target).parent().find('input[type="text"]').val('');
                    //refresh();
                }
                else {
                    toast(actions_r[response_status]);
                }
            }, function(err) {
                toast(actions_r[1]);
            });
        }
    },
    switching() {
        $('.creatingFormBody').slideToggle();
    },
    render() {
        return <section className="creatingForm">
            <article className="creatingFormHead" onClick={this.switching}>Creating</article>
            <article className="creatingFormBody">
                <input type="text" name="name" placeholder="Name" data-req="true" />
                <input type="text" name="color" placeholder="Color" className="color_field" data-req="true" />
                <button className="sub" onClick={this.submit}>Create</button>
            </article>
        </section>;
    }
});

var TasksGroup = React.createClass({
    getInitialState() {
        var data = this.props.data;
        return {
            id: data.id,
            name: data.name,
            color: data.color,
            tasks: data.tasks,
            tasks_count: data.tasks.length,
            created: data.createdAt
        }
    },
    expand(elem) {
        var target = $(elem.target).closest('.task');
        target.find('.task_additional').slideToggle();
    },
    actions(type) {
        return function(elem) {
            var target = $(elem.target).closest('.task');
            target.find('.task_action:not(.task_' + type + ')').hide();
            target.find('.task_' + type).slideToggle();
        }
    },
    submitting(type) {
        var self = this;
        return function(elem) {
            var target = elem.target;
            var ajax_data = {};
            ajax_data = getData(target);
            ajax_data.id = self.state.id;
            if(ajax_data) {
                submitting(ajax_data, '/api/task_manage/' + type, 'POST', function (data) {
                    var response_status = +data;
                    if (isNaN(response_status)) {
                        response_status = 1;
                    }
                    toast(actions_r[response_status]);
                    //refresh();
                }, function (err) {
                    toast(actions_r[1]);
                });
            }
            else if(!re_color.test(ajax_data.color)) {
                toast(actions_r[3]);
                $(elem.target).parent().find('input[name="color"]').val('');
            }
            else {
                toast(actions_r[2]);
            }
        }
    },
    selectBoxes(elem) {
        var target = $(elem.target);
        var elemParent = target.closest('.select_box');
        elemParent.find('label').removeClass('active_elem');
        target.parent().addClass('active_elem');
    },
    render() {
        var self = this;
        var group_classes = 'task task_group_color task_group_color_' + this.state.id;
        //all tasks in groups
        var tasks_list = [];
        this.state.tasks.forEach(function(task) {
            tasks_list.push(<article className="item_list">{task.name}</article>);
        });
        //all groups
        var groups_list = [];
        groups_list.push(<label className='active_elem'>No group<input type="radio" name="t_group"
                        defaultChecked onChange={self.selectBoxes} value=''/></label>);
        this.props.all_groups.forEach(function(group) {
            if(group.id != self.state.id) {
                groups_list.push(<label>{group.name}<input type="radio" name="t_group"
                                 onChange={self.selectBoxes} value={group.id}/></label>);
            }
        });
        var group_list_block = <article className="select_box">
            {groups_list}
        </article>;
        return <article className={group_classes}>
            <article className="task_top">
                <article className="task_head">
                    <span className="task_name">{this.state.name}</span><br/>
                    <span className="task_group">Tasks: {this.state.tasks_count}</span>
                </article>
                <article className="task_expand" onClick={this.expand}></article>
            </article>
            <article className="task_additional">
                <h3>Tasks</h3>
                <article className="select_box">
                    {tasks_list}
                </article>
                <article className="task_bottom">
                    <button className="solve_but" onClick={this.actions('edit')}>Edit</button>
                    <button onClick={this.actions('delete')}>Delete</button>
                </article>
                <article className="task_action task_edit hidden">
                    <form>
                        <input type="text" name="name" placeholder="Name" data-req="true" defaultValue={this.state.name} /><br/>
                        <input type="text" name="color" placeholder="Color" defaultValue={this.state.color}
                               className="color_field" data-req="true" /><br/>
                    </form>
                    <button onClick={this.submitting('edit')}>Edit</button>
                </article>
                <article className="task_action task_delete hidden">
                    <form>
                        <h3>All tasks in {this.state.name} to other group?</h3>
                        {group_list_block}
                        Are you sure you want to delete "{this.state.name}" tasks group?
                    </form>
                    <button onClick={this.submitting('deleting')}>Edit</button>
                </article>
            </article>
        </article>;
    }
});

var TasksGroupsList = React.createClass({
    getInitialState() {
        return {
            received: false,
            error: false,
            status: null,
            groups: null
        }
    },
    receive() {
        var self = this;
        submitting(null, '/api/account/status', 'GET', function(status) {
            if (typeof status == 'string') {
                status = JSON.parse(status);
            }
            submitting(null, '/api/manage_data/tasks_group', 'GET', function (data) {
                if (typeof data == 'string') {
                    data = JSON.parse(data);
                }
                if(data.status == 0) {
                    data.body.reverse();
                    self.setState({
                        received: true,
                        error: false,
                        status,
                        groups: data.body
                    });
                }
                else {
                    self.setState({
                        error: true
                    });
                }
            }, function (err) {
                self.setState({
                    error: true
                });
            });
        }, function(err) {
            self.setState({
                error: true
            });
        });
    },
    render() {
        var self = this;
        //first load
        if(!this.state.received && !this.state.error) {
            this.receive();
            return <Waiting />;
        }
        else if(!this.state.received && this.state.error) {
            return <Error />;
        }
        //render
        else {
            var groups = [];
            if(!this.state.groups.length) {
                groups = <Empty />;
            }
            else {
                this.state.groups.forEach(function(group) {
                    groups.push(<TasksGroup key={group.id} data={group} all_groups={self.state.groups} />);
                });
            }
            return <article className="task_group_page_inner">
                <Menu active="t_groups" data={this.state.status} />
                <Creating />
                {groups}
            </article>;
        }
    }
});

$(document).ready(function() {
    if (document.location.pathname == '/tasks_groups') {
        ReactDOM.render(<TasksGroupsList />, document.getElementsByClassName('content_inner')[0]);
    }
});