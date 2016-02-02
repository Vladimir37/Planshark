import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {submitting, getData} from '../submitting.js';
import {Waiting, Error, Empty, Menu} from './templates.js';
import toast from '../toaster.js';
import datepick from '../datepicker.js';

//responses
var actions_r = ['Success!', 'Server error' , 'Required fields are empty', 'Incorrect date'];
var deleting_r = ['Success!', 'Server error'];

//Time left
function time(date_one, date_two) {
    date_one = new Date(date_one);
    date_two = new Date(date_two);
    var result = {
        negative: false,
        unit: null,
        num: null
    };
    var ms =  date_one - date_two;
    if(ms < 0) {
        result.negative = true;
        ms = date_two - date_one;
    }
    result.unit = 'Days ';
    result.num = Math.floor((ms)/(86400000));
    if(result.num == 0) {
        result.unit = 'Hours ';
        result.num = Math.floor((ms)/(3600000));
    }
    if(result.num == 0) {
        result.unit = 'Minutes ';
        result.num = Math.floor((ms)/(60000));
    }
    return result;
};

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
                var response_status = +data;
                if(isNaN(response_status)) {
                    response_status = 1;
                }
                if(response_status == 0) {
                    toast(actions_r[0]);
                    $(elem.target).parent().find('textarea, input[type="text"]').val('');
                }
                else {
                    toast(actions_r[response_status]);
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
            this.state.users.forEach(function (elem) {
                users.push(<label>{elem[1]}<input type="radio" name="performer" onChange={self.selectBoxes}
                                                  value={elem[0]}/></label>);
            });
            users.unshift(<label className="active_elem">Me<input type="radio" name="performer" value=''
                                                                  onChange={self.selectBoxes} defaultChecked/></label>)
        }
        //tasks groups list
        var t_groups = [];
        if(this.state.t_groups) {
            this.state.t_groups.map(function (elem) {
                t_groups.push(<label>{elem[1]}<input type="radio" name="t_group" onChange={self.selectBoxes}
                                                     value={elem[0]}/></label>);
            });
            t_groups.unshift(<label className="active_elem">No group<input type="radio" name="t_group"
                                                                           onChange={self.selectBoxes} value=''
                                                                           defaultChecked/></label>)
        }
        //users groups list
        var u_groups = [];
        if(this.state.room && this.state.u_groups) {
            this.state.u_groups.forEach(function (elem) {
                u_groups.push(<label>{elem[1]}<input type="radio" name="u_group" onChange={self.selectBoxes}
                                                     value={elem[0]}/></label>);
            });
            u_groups.unshift(<label className="active_elem">No group<input type="radio" name="u_group"
                                                                           onChange={self.selectBoxes} value=''
                                                                           defaultChecked/></label>)
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
        data.users_group = data.users_group || {};
        data.tasks_group = data.tasks_group || {};
        data.performer_data = data.performer_data || {};
        data.author_data = data.author_data || {};
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            t_group_num: data.t_group,
            t_group_name: data.tasks_group.name || null,
            u_group_num: data.u_group,
            u_group_name: data.users_group.name || null,
            color: data.tasks_group.color,
            performer_num: data.performer,
            performer_name: data.performer_data.name || null,
            priority: data.priority,
            author: data.author_data.name || null,
            created: new Date(data.createdAt).toString().slice(0, -15),
            expiration: data.expiration,
            rights: {
                editing: status.editing || !status.room || false,
                reassignment: status.reassignment || false,
                deleting: status.deleting || !status.room || false
            }
        }
    },
    expand(elem) {
        var target = $(elem.target).closest('.task');
        target.find('.task_additional').slideToggle();
    },
    editing(elem) {
        var target = $(elem.target).closest('.task');
        target.find('.task_action:not(.task_edit)').hide();
        target.find('.task_edit').slideToggle();
    },
    reassignment(elem) {
        var target = $(elem.target).closest('.task');
        target.find('.task_action:not(.task_reassign)').hide();
        target.find('.task_reassign').slideToggle();
    },
    deleting(elem) {
        var target = $(elem.target).closest('.task');
        target.find('.task_action:not(.task_delete)').hide();
        target.find('.task_delete').slideToggle();
    },
    solve(elem) {
        var target = $(elem.target).closest('.task');
        target.find('.task_action:not(.task_solve)').hide();
        target.find('.task_solve').slideToggle();
    },
    submit(type) {
        var self = this;
        return function(elem) {
            var target = elem.target;
            var ajax_data = {};
            switch(type) {
                case 'edit':
                    ajax_data = getData(target);
                    ajax_data.task_id = self.state.id;
                    submitting(ajax_data, '/api/tasks/edit', 'POST', function(data) {
                        var response_status = +data;
                        if(isNaN(response_status)) {
                            response_status = 1;
                        }
                        toast(actions_r[response_status]);
                    }, function(err) {
                        toast(actions_r[1]);
                    });
                    break;
                case 'solve':
                    ajax_data = getData(target);
                    ajax_data.task_id = self.state.id;
                    submitting(ajax_data, '/api/tasks/close', 'POST', function(data) {
                        var response_status = +data;
                        if(isNaN(response_status)) {
                            response_status = 1;
                        }
                        toast(actions_r[response_status]);
                    }, function(err) {
                        toast(actions_r[1]);
                    });
                    break;
                case 'delete':
                    ajax_data.task_id = self.state.id;
                    submitting(ajax_data, '/api/tasks/delete', 'POST', function(data) {
                        var response_status = +data;
                        if(isNaN(response_status)) {
                            response_status = 1;
                        }
                        toast(actions_r[response_status]);
                    }, function(err) {
                        toast(actions_r[1]);
                    });
                    break;
                case 'reassign':
                    ajax_data = getData(target);
                    ajax_data.task_id = self.state.id;
                    submitting(ajax_data, '/api/tasks/reassign', 'POST', function(data) {
                        var response_status = +data;
                        if(isNaN(response_status)) {
                            response_status = 1;
                        }
                        toast(actions_r[response_status]);
                    }, function(err) {
                        toast(actions_r[1]);
                    });
                    break;
                default:
                    console.log('Incorrect action');
            };
        }
    },
    selectBoxes(elem) {
        var target = $(elem.target);
        var elemParent = target.closest('.select_box');
        elemParent.find('label').removeClass('active_elem');
        target.parent().addClass('active_elem');
    },
    priorityChange(elem) {
        var target = elem.target;
        $('[name="priority"]').parent().removeClass('active_elem');
        $(target).parent().addClass('active_elem');
        return true;
    },
    render() {
        var self = this;
        // bottom buttons
        var task_bottom = [];
        task_bottom.push(<button className="solve_but" onClick={this.solve}>Solve</button>);
        var state = this.state;
        var rights = this.state.rights;
        for(let key in rights) {
            if(rights[key]) {
                var but_name = key.charAt(0).toUpperCase() + key.slice(1);
                task_bottom.push(<button onClick={this[key]}>{but_name}</button>);
            }
        }
        //calculating days
        var expiration_result = '';
        var expiration_date = 'none';
        if(state.expiration) {
            var expiration_time = time(new Date(state.expiration), new Date());
            var expiration_type = expiration_time.negative ? 'ago' : 'left';
            var expiration_message = expiration_time.negative ? '(expired)' : '';
            expiration_result = <span className="task_expiration"><b>{expiration_time.unit + expiration_type}: </b>
                {expiration_time.num} <span className="expiration_message">{expiration_message}</span></span>;
            expiration_date = new Date(state.expiration).toString().slice(0, -15);
        }
        //priority blocks
        var priority_color;
        switch(+state.priority) {
            case 1:
                priority_color = 'color_l';
                break;
            case 2:
                priority_color = 'color_m';
                break;
            case 3:
                priority_color = 'color_h';
                break;
            default:
                priority_color = 'color_l';
                break;
        }
        var priority_blocks = [];
        for(var i = 0; i < 3; i++) {
            if(i < state.priority) {
                priority_blocks.push(<article className={"task_priority_scale " + priority_color}></article>);
            }
            else {
                priority_blocks.unshift(<article className={"task_priority_scale hide_block"}></article>);
            }
        }
        //date for edit
        var string_date = '';
        if(state.expiration) {
            var full_date = new Date(state.expiration);
            string_date = full_date.getMonth() + 1 + '/' + full_date.getDate() + '/' + full_date.getFullYear();
        }
        //props data and status
        var status = this.props.status;
        var group_data = this.props.group_data;
        var room = status.room;
        var users_list = group_data.body.users;
        var t_groups_list = group_data.body.t_groups;
        var u_groups_list = group_data.body.u_groups;
        //default priority
        var pt_default = '';
        var pt_class_1 = '', pt_class_2 = '', pt_class_3 = '';
        switch(+state.priority) {
            case 1:
                pt_default = '1';
                pt_class_1 = 'active_elem';
                break;
            case 2:
                pt_default = '2';
                pt_class_2 = 'active_elem';
                break;
            case 3:
                pt_default = '3';
                pt_class_3 = 'active_elem';
                break;
            default:
                console.log('Incorrect priority');
        };
        //performers list
        var users = [];
        if(room && users_list) {
            users.push(<input type="radio" name="performer" value={state.performer_num}/>);
            users_list.forEach(function (elem) {
                var local_class = elem[0] == state.performer_num ? 'active_elem' : '';
                users.push(<label className={local_class}>{elem[1]}<input type="radio" name="performer" onChange={self.selectBoxes}
                                                  value={elem[0]}/></label>);
            });
            if(!state.performer_num) {
                users.unshift(<label className='active_elem'>Me<input type="radio" name="performer" value=''
                                                                    onChange={self.selectBoxes}/></label>)
            }
        }
        //tasks groups list
        var t_groups = [];
        if(t_groups_list) {
            t_groups.push(<input type="radio" name="t_group" value={state.t_group_num} defaultChecked />);
            t_groups_list.forEach(function (elem) {
                var local_class = elem[0] == state.t_group_num ? 'active_elem' : '';
                t_groups.push(<label className={local_class}>{elem[1]}<input type="radio" name="t_group" onChange={self.selectBoxes}
                                                     value={elem[0]}/></label>);
            });
            var no_select = !state.t_group_num ? 'active_elem' : '';
            t_groups.unshift(<label className={no_select}>No group<input type="radio" name="t_group"
                                                                           onChange={self.selectBoxes} value=''/></label>)
        }
        //users groups list
        var u_groups = [];
        if(status.room && u_groups_list) {
            u_groups.push(<input type="radio" name="u_group" value={state.u_group_num} defaultChecked />);
            u_groups_list.forEach(function (elem) {
                var local_class = elem[0] == state.u_group_num ? 'active_elem' : '';
                u_groups.push(<label className={local_class}>{elem[1]}<input type="radio" name="u_group" onChange={self.selectBoxes}
                                                     value={elem[0]}/></label>);
            });
            if(!state.u_group_num) {
                u_groups.unshift(<label className='active_elem'>No group<input type="radio" name="u_group"
                                                                             onChange={self.selectBoxes}
                                                                             value=''/></label>)
            }
        }
        //personal or company items
        var u_groups_item = '';
        var performers_item = '';
        if(status.room) {
            performers_item = <article className="select_main">
                <h3>Performer</h3>
                <article className="select_box">{users}</article>
            </article>;
            u_groups_item = <article className="select_main">
                <h3>Users group</h3>
                <article className="select_box">{u_groups}</article>
            </article>;
        }
        //render
        return <article className="task">
            <article className="task_top">
                <article className="task_head">
                    <span className="task_name">{state.name}</span><br/>
                    <span className="task_group">{state.t_group_name}</span>
                </article>
                <article className="task_info">
                    <span className="task_info_elem"><b>Performer: </b>{state.performer_name}</span>
                </article>
                <article className="task_priority">
                    {priority_blocks}
                </article>
                <article className="task_expand" onClick={this.expand}></article>
                <article className="task_time">
                    {expiration_result}
                </article>
            </article>
            <article className="task_additional">
                <article className="task_middle">
                    <article className="task_desc">
                        <b>Description:</b>
                        <article className="task_desc_text">{state.description}</article>
                    </article>
                    <article className="task_info">
                        <span className="task_info_elem"><b>Creation date: </b>{state.created}</span>
                        <span className="task_info_elem"><b>Expiration date: </b>{expiration_date}</span>
                        <span className="task_info_elem"><b>Performer user: </b>{state.performer_name}</span>
                        <span className="task_info_elem"><b>Performer group: </b>{state.u_group_name}</span>
                        <span className="task_info_elem"><b>Author: </b>{state.author}</span>
                    </article>
                    <div className="clearfix"></div>
                </article>
                <article className="task_bottom">{task_bottom}</article>
                <article className="task_action task_solve hidden">
                    <article className="column_sizeless">
                        <textarea name="answer" placeholder="Answer"></textarea>
                        <button onClick={this.submit('solve')}>Solve</button>
                    </article>
                </article>
                <article className="task_action task_edit hidden">
                    <article className="column column_text">
                        <input type="text" name="name" placeholder="name" defaultValue={state.name} data-req="true" /><br/>
                        <textarea name="description" placeholder="Task description" defaultValue={state.description} data-req="true"></textarea><br/>
                        <input type="text" name="expiration" placeholder="Expiration time" className="time_field" defaultValue={string_date} /><br/>
                        <input type="radio" name="priority" value={pt_default} defaultChecked />
                        <label className={pt_class_3}><input type="radio" name="priority" value="3" onChange={this.priorityChange} />High</label>
                        <label className={pt_class_2}><input type="radio" name="priority" value="2" onChange={this.priorityChange} />Middle</label>
                        <label className={pt_class_1}><input type="radio" name="priority" value="1" onChange={this.priorityChange} />Low</label>
                    </article>
                    <article className="column">
                        <article className="select_main">
                            <h3>Tasks group</h3>
                            <article className="select_box">{t_groups}</article>
                        </article>
                    </article>
                    <button onClick={this.submit('edit')}>Edit</button>
                </article>
                <article className="task_action task_reassign hidden">
                    <article className="column">{performers_item}</article>
                    <article className="column">{u_groups_item}</article>
                    <button onClick={this.submit('reassign')}>Reassign</button>
                </article>
                <article className="task_action task_delete hidden">
                    Are you sure you want to delete "{state.name}" task?
                    <button onClick={this.submit('delete')}>Delete task</button>
                </article>
            </article>
        </article>;
    }
});

var TaskList = React.createClass({
    getInitialState() {
        return {
            active: true,
            inactive: false,
            expired: false,
            all_active: false,
            all_inactive: false,
            data: {
                received: false,
                error: false,
                tasks: null
            }
        }
    },
    switching(name, all) {
        var self = this;
        if(!this.state[name]) {
            return function () {
                self.setState({
                    active: false,
                    inactive: false,
                    expired: false,
                    all: Boolean(all),
                    [name]: true,
                    data: {
                        received: false,
                        error: false,
                        tasks: null
                    }
                });
            }
        }
    },
    receive() {
        var self = this;
        var tasks_type;
        if(this.state.inactive) {
            tasks_type = 'inactive';
        }
        else {
            tasks_type = 'active';
        }
        var all_tasks_type = '';
        if(this.state.all) {
            all_tasks_type = '_all';
        }
        submitting(null, '/api/get_tasks/' + tasks_type + all_tasks_type, 'GET', function(data) {
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            if(data.status == 1) {
                self.setState({
                    data: {
                        error: true
                    }
                });
            }
            else {
                //active and inactive
                if(!self.state.expired) {
                    self.setState({
                        data: {
                            received: true,
                            tasks: data.body
                        }
                    });
                }
                //expired
                else {
                    var expired_tasks = [];
                    data.body.forEach(function(task) {
                        var today = new Date();
                        if(task.expiration && today > new Date(task.expiration)) {
                            expired_tasks.push(task);
                        }
                    });
                    self.setState({
                        data: {
                            received: true,
                            tasks: expired_tasks
                        }
                    });
                }
            }
        }, function(err) {
            self.setState({
                data: {
                    error: true
                }
            });
        });
    },
    sort(direction, type) {
        var self = this;
        return function() {
            var all_tasks = self.state.data.tasks;
            self.setState({
                data: {
                    received: true,
                    error: false,
                    tasks: []
                }
            });
            function sorting(a, b) {
                var result;
                var today = new Date();
                switch(type) {
                    case 'date':
                        result = new Date(a.createdAt) - new Date(b.createdAt);
                        return result;
                        break;
                    case 'priority':
                        result = a.priority - b.priority;
                        return result;
                        break;
                    case 'time':
                        if(!a.expiration && !b.expiration) {
                            return 0;
                        }
                        else if(!a.expiration) {
                            return -1;
                        }
                        else if(!b.expiration) {
                            return 1;
                        }
                        else {
                            var time_one = new Date(a.expiration) - today;
                            var time_two = new Date(b.expiration) - today;
                            result = time_one - time_two;
                            return result;
                        }
                        break;
                    default:
                        return 0;
                }
            }
            all_tasks.sort(sorting);
            if(direction) {
                all_tasks.reverse();
            }
            self.setState({
                data: {
                    received: true,
                    error: false,
                    tasks: all_tasks
                }
            });
        }
    },
    render() {
        //state
        var data = this.state.data;
        var status = this.props.status;
        //classes determination
        var active_c = this.state.active && !this.state.all ? ' active_elem' : '';
        var inactive_c = this.state.inactive && !this.state.all ? ' active_elem' : '';
        var expired_c = this.state.expired && !this.state.all ? ' active_elem' : '';
        var all_active_c = this.state.active && this.state.all ? ' active_elem' : '';
        var all_inactive_c = this.state.active && this.state.all ? ' active_elem' : '';
        var all_expired_c = this.state.active && this.state.all ? ' active_elem' : '';
        //button panel (type)
        var room_master_buttons = [];
        if(status.room && (!status.group || status.viewing)) {
            room_master_buttons.push(<button className={"panel_elem" + all_active_c} onClick={this.switching('active', true)}>
                All active</button>);
            room_master_buttons.push(<button className={"panel_elem" + all_inactive_c} onClick={this.switching('inactive', true)}>
                All inactive</button>);
            room_master_buttons.push(<button className={"panel_elem" + all_expired_c} onClick={this.switching('expired', true)}>
                All expired</button>);
        }
        var tasks_buttons_type = <article className="panel_tasks_type">
            <button className={"panel_elem" + active_c} onClick={this.switching('active')}>Active</button>
            <button className={"panel_elem" + inactive_c} onClick={this.switching('inactive')}>Inactive</button>
            <button className={"panel_elem" + expired_c} onClick={this.switching('expired')}>Expired</button>
        </article>;
        //button panel (sort)
        var tasks_buttons_sort = <article className="panel_tasks_sort">
            <article className="sorting_point">
                <button className="panel_elem" onClick={this.sort(false, 'date')}>Increase date</button>
                <button className="panel_elem" onClick={this.sort(true, 'date')}>Decrease date</button>
            </article>
            <article className="sorting_point">
                <button className="panel_elem" onClick={this.sort(false, 'priority')}>Increase priority</button>
                <button className="panel_elem" onClick={this.sort(true, 'priority')}>Decrease priority</button>
            </article>
            <article className="sorting_point">
                <button className="panel_elem" onClick={this.sort(false, 'time')}>Increase time</button>
                <button className="panel_elem" onClick={this.sort(true, 'time')}>Decrease time</button>
            </article>
        </article>;
        //first load
        if(!data.received && !data.error) {
            this.receive();
            return <article className="task_list">
                {tasks_buttons_type}
                {tasks_buttons_sort}
                <Waiting />
            </article>;
        }
        //error
        else if(!data.received && data.error) {
            return <article className="task_list">
                {tasks_buttons_type}
                {tasks_buttons_sort}
                <Error />
            </article>;
        }
        //render tasks
        else {
            var all_tasks = [];
            var list_tasks = data.tasks;
            var group_data = this.props.group_data;
            list_tasks.reverse();
            list_tasks.forEach(function(task) {
                all_tasks.push(<Task status={status} data={task} key={task.id} group_data={group_data} />);
            });
            return <article className="task_list">
                {tasks_buttons_type}
                {tasks_buttons_sort}
                {all_tasks}
            </article>;
        }
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
            var page = [<TaskList status={this.state.status} group_data={this.state.data} key='TasksList' />];
            if(this.state.status.creating || !this.state.status.room) {
                page.unshift(<Creating status={this.state.status} data={this.state.data} />);
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