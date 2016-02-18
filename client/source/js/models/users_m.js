import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {submitting, getData} from '../submitting.js';
import {Waiting, Error, Empty, Menu, Forbidden} from './templates.js';
import toast from '../toaster.js';

//responses
var actions_r = ['Success!', 'Server error' , 'Required fields are empty'];
var creating_r = ['Success!', 'Server error', 'Name is exist!', 'Mail is exist!'];

//refresh groups list
var refresh;

var Creating = React.createClass({
    getInitialState() {
        return null;
    },
    submit(elem) {
        var ajax_data = getData(elem.target);
        if(!ajax_data) {
            toast(actions_r[2]);
        }
        else {
            submitting(ajax_data, '/api/user_manage/new', 'POST', function(data) {
                var response_status = +data;
                if(isNaN(response_status)) {
                    response_status = 1;
                }
                if(response_status == 0) {
                    toast(creating_r[0]);
                    $(elem.target).parent().find('input[type="text"]').val('');
                    refresh();
                }
                else {
                    toast(creating_r[response_status]);
                }
            }, function(err) {
                toast(creating_r[1]);
            });
        }
    },
    switching() {
        $('.creatingFormBody').slideToggle();
    },
    selectBoxes(elem) {
        var target = $(elem.target);
        var elemParent = target.closest('.select_box');
        elemParent.find('label').removeClass('active_elem');
        target.parent().addClass('active_elem');
    },
    render() {
        var self = this;
        //users groups list
        var u_groups = [];
        this.props.groups.forEach(function (group) {
            u_groups.push(<label>{group.name}<input type="radio" name="u_group" onChange={self.selectBoxes}
                         value={group.id}/></label>);
        });
        u_groups.unshift(<label className="active_elem">Master<input type="radio" name="u_group"
                         onChange={self.selectBoxes} value='' defaultChecked/></label>);
        var u_groups_item = <article className="select_main">
            <h3>Users group</h3>
            <form>
                <article className="select_box">{u_groups}</article>
            </form>
        </article>;
        return <section className="creatingForm">
            <article className="creatingFormHead" onClick={this.switching}>Creating user</article>
            <article className="creatingFormBody">
                <article className="creatingFormTop">
                    <article className="column_half">
                        <h3>User data</h3>
                        <input type="text" name="name" placeholder="Name" data-req="true" /><br/>
                        <input type="text" name="pass" placeholder="Password" data-req="true" /><br/>
                        <input type="text" name="mail" placeholder="E-Mail" data-req="true" /><br/>
                    </article>
                    <article className="column_half">
                        {u_groups_item}
                    </article>
                </article>
                <button className="sub" onClick={this.submit}>Create</button>
            </article>
        </section>;
    }
});

var User = React.createClass({
    getInitialState() {
        var data = this.props.data;
        data.users_group = data.users_group || {
                id: 0,
                name: 'Masters'
            };
        return {
            id: data.id,
            name: data.name,
            mail: data.mail,
            group_id: data.users_group.id,
            group_name: data.users_group.name,
            active: data.active,
            created: data.createdAt.toString().slice(0, -14)
        };
    },
    expand(elem) {
        var target = $(elem.target).closest('.user');
        target.find('.user_additional').slideToggle();
    },
    actions(type) {
        return function(elem) {
            var target = $(elem.target).closest('.user');
            target.find('.user_action:not(.user_' + type + ')').hide();
            target.find('.user_' + type).slideToggle();
        }
    },
    submit(type) {
        var self = this;
        return function(elem) {
            var target = elem.target;
            var ajax_data = {};
            ajax_data = getData(target);
            ajax_data.id = self.state.id;
            console.log(ajax_data);
            if(ajax_data) {
                submitting(ajax_data, '/api/user_manage/' + type, 'POST', function (data) {
                    var response_status = +data;
                    if (isNaN(response_status)) {
                        response_status = 1;
                    }
                    toast(actions_r[response_status]);
                    refresh();
                }, function (err) {
                    toast(actions_r[1]);
                });
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
        var group_classes = 'user user_group_color user_group_color_' + this.state.group_id;
        //all groups
        var groups_list = [];
        var master_c = self.state.group_id == 0 ? 'active_elem' : '';
        groups_list.push(<label className={master_c}>Master<input type="radio" name="u_group"
                        defaultChecked={self.state.group_id == 0} onChange={self.selectBoxes} value='0'/></label>);
        this.props.all_groups.forEach(function(group) {
            var group_c = self.state.group_id == group.id ? 'active_elem' : '';
            groups_list.push(<label className={group_c}>{group.name}<input type="radio" name="u_group"
                            onChange={self.selectBoxes} defaultChecked={self.state.group_id == group.id} value={group.id}/></label>);
        });
        var group_list_block = <article className="select_box">
            {groups_list}
        </article>;
        //buttons
        var user_buttons = [];
        if(this.state.active) {
            user_buttons.push(<button onClick={this.actions('change')} className="solve_but">Edit</button>);
            user_buttons.push(<button onClick={this.actions('block')}>Block</button>);
        }
        else {
            user_buttons.push(<button onClick={this.actions('unblock')}>Unblock</button>);
        }
        var user_group_buttons = <article className="user_bottom">
            {user_buttons}
        </article>;
        //render
        return <article className={group_classes}>
            <article className="user_top">
                <article className="user_head">
                    <span className="user_name">{this.state.name}</span><br/>
                    <span className="user_group">{this.state.group_name}</span>
                </article>
                <article className="user_expand" onClick={this.expand}></article>
            </article>
            <article className="user_additional">
                <article className="user_middle">
                    <article className="task_info">
                        <span className="task_info_elem"><b>Mail: </b>{this.state.mail}</span>
                        <span className="task_info_elem"><b>Created: </b>{this.state.created}</span>
                    </article>
                </article>
                <article className="clearfix"></article>
                <article className="user_bottom">
                    {user_group_buttons}
                </article>
                <article className="user_action user_change hidden">
                    <form>
                        <article className="column">
                            <h3>Data</h3>
                            <input type="text" name="name" placeholder="Name" defaultValue={this.state.name}/><br/>
                            <input type="text" name="mail" placeholder="Mail" defaultValue={this.state.mail}/><br/>
                        </article>
                        <article className="column">
                            <h3>Group</h3>
                            {group_list_block}
                        </article>
                    </form>
                    <button onClick={this.submit('change')}>Edit</button>
                </article>
                <article className="user_action user_block hidden">
                    <h3>Are you sure you want to block {this.state.name}?</h3>
                    <button onClick={this.submit('block')}>Block</button>
                </article>
                <article className="user_action user_unblock hidden">
                    <h3>Are you sure you want to unblock {this.state.name}?</h3>
                    <button onClick={this.submit('unblock')}>Unblock</button>
                </article>
            </article>
        </article>;
    }
});

var UserList = React.createClass({
    getInitialState() {
        var condition = this.props.condition;
        return {
            active: condition.active,
            inactive: condition.inactive
        };
    },
    switching(type) {
        var self = this;
        return function() {
            if(!self.state[type]) {
                self.props.switch(type);
                self.setState({
                    active: !self.state.active,
                    inactive: !self.state.inactive
                })
            }
        }
    },
    render() {
        //filter buttons
        var active_c = this.state.active ? 'panel_elem active_elem_panel' : 'panel_elem';
        var inactive_c = this.state.inactive ? 'panel_elem active_elem_panel' : 'panel_elem';
        //creating user panels
        var users = this.props.users;
        var groups = this.props.groups;
        var users_list = [];
        users.forEach(function(user) {
            users_list.push(<User key={user.id} data={user} all_groups={groups} />);
        });
        return <article className="users_list_inner">
            <article className="panel_users_type">
                <button className={active_c} onClick={this.switching('active')}>Active</button>
                <button className={inactive_c} onClick={this.switching('inactive')}>Inactive</button>
            </article>
            {users_list}
        </article>;
    }
});

var UserPage = React.createClass({
    getInitialState() {
        return {
            active: true,
            inactive: false,
            status: null,
            users: null,
            groups: null,
            received: false,
            error: false
        };
    },
    all_receive() {
        var users_type = this.state.active ? 'active' : 'inactive';
        var self = this;
        submitting(null, '/api/account/status', 'GET', function(status) {
            if (typeof status == 'string') {
                status = JSON.parse(status);
            }
            submitting(null, '/api/manage_data/users_group', 'GET', function (groups) {
                if (typeof groups == 'string') {
                    groups = JSON.parse(groups);
                }
                submitting(null, '/api/manage_data/' + users_type + '_users', 'GET', function (users) {
                    if (typeof users == 'string') {
                        users = JSON.parse(users);
                    }
                    if (users.status == 0 && groups.status == 0) {
                        self.setState({
                            users: users.body,
                            status,
                            groups: groups.body,
                            received: true,
                            error: false
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
    users_receive() {
        var self = this;
        var users_type = this.state.active ? 'active' : 'inactive';
        submitting(null, '/api/manage_data/' + users_type + '_users', 'GET', function (users) {
            if (typeof users == 'string') {
                users = JSON.parse(users);
            }
            if (users.status == 0) {
                self.setState({
                    users: users.body
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
    },
    switching(type) {
        this.setState({
            active: false,
            inactive: false,
            [type]: true
        }, function() {
            this.users_receive();
        });
    },
    render() {
        var self = this;
        refresh = this.users_receive;
        //first load
        if(!this.state.received && !this.state.error) {
            this.all_receive();
            return <Waiting />;
        }
        else if(!this.state.received && this.state.error) {
            return <Error />;
        }
        else if(!Boolean(this.state.status.u_manage || this.state.status.room)) {
            return <Forbidden />;
        }
        //render
        else {
            var condition = {
                active: this.state.active,
                inactive: this.state.inactive
            };
            return <article className="task_group_page_inner">
                <Menu active="users" data={this.state.status} />
                <Creating groups={this.state.groups} />
                <UserList condition={condition} users={this.state.users} groups={this.state.groups} switch={this.switching} />
            </article>;
        }
    }
});

export default UserPage;