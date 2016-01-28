import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {submitting, getData} from '../submitting.js';
import {Waiting, Error, Menu} from './templates.js';
import toast from '../toaster.js';
import datepick from '../datepicker.js';

//responses
var actions_r = ['Success!', 'Server error' , 'Required fields are empty', 'Incorrect date'];
var deleting_r = ['Success!', 'Server error'];

var Creating = React.createClass({
    getInitialState() {
        return {
            received: false,
            room: false,
            users: false,
            t_groups: false,
            u_groups: false
        };
    },
    componentDidMount() {
        setTimeout(datepick, 100);
    },
    receive() {
        var all_data = this.props.data;
        var status = this.props.status;
        this.setState({
            received: true,
            room: status.room,
            users: all_data.body.users,
            t_groups: all_data.body.t_groups,
            u_groups: all_data.body.u_groups
        });
    },
    submit(elem) {
        var ajax_data = getData(elem.target);
        var exp_date = $(elem.target).find('input#time').val();
        if(exp_date && new Date() > new Date(exp_date)) {
            toast(actions_r[3]);
        }
        else if(!ajax_data) {
            toast(actions_r[2]);
        }
        else {
            submitting(ajax_data, '/api/tasks/create', 'POST', function(data) {
                console.log(data);
                var response_status = +data;
                if(isNaN(response_status)) {
                    response_status = 1;
                }
                if(response_status == 0) {
                    toast(actions_r[0]);
                    $(elem.target).parent().find('textarea, input[type="text"]').val('');
                }
            }, function(err) {
                toast("Server error");
            });
        }
    },
    switching() {
        $('.taskCreatingBody').slideToggle();
    },
    priorityChange(elem) {
        var target = elem.target;
        $('[name="priority"]').parent().removeClass('active_elem');
        $(target).parent().addClass('active_elem');
        $('.priority_scale article').hide();
        for(var i = 1; i <= target.value; i++) {
            $('.priority_scale_' + i).show();
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
        //performers list
        var users = [];
        if(this.state.room && this.state.users) {
            this.state.users.forEach(function(elem) {
                users.push(<label>{elem[1]}<input type="radio" name="performer" onChange={self.selectBoxes} value={elem[0]}/></label>);
            });
            users.unshift(<label className="active_elem">Me<input type="radio" name="performer" value={false} onChange={self.selectBoxes} defaultChecked /></label>)
        }
        //tasks groups list
        var t_groups = [];
        if(this.state.t_groups) {
            this.state.t_groups.map(function(elem) {
                t_groups.push(<label>{elem[1]}<input type="radio" name="t_group" onChange={self.selectBoxes} value={elem[0]}/></label>);
            });
            t_groups.unshift(<label className="active_elem">No group<input type="radio" name="t_group" onChange={self.selectBoxes} value={false} defaultChecked/></label>)
        }
        //users groups list
        var u_groups = [];
        if(this.state.room && this.state.u_groups) {
            this.state.u_groups.forEach(function(elem) {
                u_groups.push(<label>{elem[1]}<input type="radio" name="u_group" onChange={self.selectBoxes} value={elem[0]}/></label>);
            });
            u_groups.unshift(<label className="active_elem">No group<input type="radio" name="u_group" onChange={self.selectBoxes} value={false} defaultChecked /></label>)
        }
        //personal or company items
        var u_groups_item = '';
        var performers_item = '';
        if(this.state.room) {
            performers_item = <article className="select_main">
                <h3>Performer</h3>
                <article className="select_box">{users}</article>
            </article>;
            u_groups_item = <article className="select_main">
                <h3>Users group</h3>
                <article className="select_box">{u_groups}</article>
            </article>;
        }
        //data not received
        if(!this.state.received) {
            this.receive();
            return <Waiting />;
        }
        else {
            return <section className="taskCreating">
                <article className="taskCreatingHead" onClick={this.switching}>Creating</article>
                <article className="taskCreatingBody">
                    <article className="taskCreatingData">
                        <input type="text" name="name" placeholder="Task name" data-req="true"/><br/>
                        <textarea name="description" placeholder="Task description" data-req="true"></textarea><br/>
                        <article className="priority">
                            <article className="priority_scale">
                                <article className="priority_scale_3 hidden" ></article>
                                <article className="priority_scale_2 hidden" ></article>
                                <article className="priority_scale_1"></article>
                            </article>
                            <article className="priority_control">
                                <label>High<input type="radio" name="priority" value="3" onChange={this.priorityChange}/></label>
                                <label>Middle<input type="radio" name="priority" value="2" onChange={this.priorityChange}/></label>
                                <label className="active_elem">Low<input type="radio" name="priority" value="1" onChange={this.priorityChange} defaultChecked/></label>
                            </article>
                        </article>
                        <br/>
                        <input type="text" name="expiration" placeholder="Expiration time" className="time_field"/><br/>
                    </article>
                    {performers_item}
                    <article className="select_main">
                        <h3>Tasks group</h3>
                        <article className="select_box">{t_groups}</article>
                    </article>
                    {u_groups_item}<br/>
                    <button className="sub" onClick={this.submit}>Create</button>
                </article>
            </section>;
        }
    }
});

var Task = React.createClass({
    getInitialState() {
        var data = this.props.data;
        var status = this.props.status;
        return {
            name: data.name,
            description: data.description,
            t_group_num: data.t_group,
            t_group_name: data.tasks_group.name,
            u_group_num: data.u_group,
            u_group_name: data.users_group.nam,
            color: data.tasks_group.color,
            performer_num: data.performer,
            performer_name: data.user.name,
            priority: data.priority,
            created: data.createdAt,
            expiration: data.expiration,
            rights: {
                editing: status.editing || false,
                reassignment: status.reassignment || false,
                deleting: status.deleting || false
            }
        }
    },
    render() {
        //
    }
});

var TasksPage = React.createClass({
    getInitialState() {
        return {
            loaded: false,
            failed: false,
            status: false,
            data: false
        }
    },
    loading() {
        var self = this;
        submitting(null, '/api/account/status', 'GET', function(status) {
            if (typeof status == 'string') {
                status = JSON.parse(status);
            }
            submitting(null, '/api/data_viewing/all', 'GET', function(data) {
                if (typeof data == 'string') {
                    data = JSON.parse(data);
                }
                self.setState({
                    loaded: true,
                    status,
                    data
                });
            }, function(err) {
                self.setState({
                    failed: true
                });
            });
        }, function(err) {
            self.setState({
                failed: true
            });
        });
    },
    render() {
        if(!this.state.loaded && !this.state.failed) {
            this.loading();
            return <Waiting />;
        }
        else if(!this.state.loaded && this.state.failed) {
            return <Error />;
        }
        else {
            //page formation
            var page = [];
            if(this.state.status.creating) {
                page.push(<Creating status={this.state.status} data={this.state.data} />);
            }
            //render
            return <article className="tasks_page_inner">
                <Menu active="tasks" data={this.state.status} />
                {page}
            </article>;
        }
    }
});

$(document).ready(function() {
    if (document.location.pathname == '/tasks') {
        ReactDOM.render(<TasksPage />, document.getElementsByClassName('content_inner')[0]);
    }
});