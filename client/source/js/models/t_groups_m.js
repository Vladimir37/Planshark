import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {submitting, getData} from '../submitting.js';
import {Waiting, Error, Empty, Menu} from './templates.js';
import toast from '../toaster.js';
import {colorpick} from '../picker.js';

//responses
var actions_r = ['Success!', 'Server error' , 'Required fields are empty'];

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
    render() {
        var group_classes = 'task task_group_color task_group_color_' + this.state.id;
        var tasks_list = [];
        this.state.tasks.forEach(function(task) {
            tasks_list.push(<article className="item_list">{task.name}</article>);
        });
        return <article className={group_classes}>
            <article className="task_top">
                <article className="task_head">
                    <span className="task_name">{this.state.name}</span><br/>
                    <span className="task_group">Tasks: {this.state.tasks_count}</span>
                </article>
                <article className="task_expand" onClick={this.expand}></article>
            </article>
            <article className="task_additional">
                <article className="select_box">
                    {tasks_list}
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
                    groups.push(<TasksGroup data={group} />);
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