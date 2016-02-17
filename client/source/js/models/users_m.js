import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {submitting, getData} from '../submitting.js';
import {Waiting, Error, Empty, Menu, Forbidden} from './templates.js';
import toast from '../toaster.js';

//responses
var actions_r = ['Success!', 'Server error' , 'Required fields are empty'];

//refresh groups list
var refresh;

var Creating = React.createClass({
    getInitialState() {
        return {
            groups: null
        };
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
            submitting(ajax_data, '/api/user_manage/new', 'POST', function(data) {
                var response_status = +data;
                if(isNaN(response_status)) {
                    response_status = 1;
                }
                if(response_status == 0) {
                    toast(actions_r[0]);
                    $(elem.target).parent().find('input[type="text"]').val('');
                    refresh();
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
        if(this.state.room && this.state.u_groups) {
            this.state.u_groups.forEach(function (elem) {
                u_groups.push(<label>{elem[1]}<input type="radio" name="u_group" onChange={self.selectBoxes}
                                                     value={elem[0]}/></label>);
            });
            u_groups.unshift(<label className="active_elem">Master<input type="radio" name="u_group"
                             onChange={self.selectBoxes} value='' defaultChecked/></label>);
        }
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
        return {
            id: data.id,
            name: data.name,
            mail: data.mail,
            group_id: data.users_group.id,
            group_name: data.users_group.name,
            active: data.active,
            created: data.createdAt.toString().slice(0, -15)
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
            ajax_data.user_id = self.state.id;
            if(ajax_data) {
                submitting(ajax_data, '/api/users/' + type, 'POST', function (data) {
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
        groups_list.push(<label className='active_elem'>No group<input type="radio" name="u_group"
                                                                       defaultChecked onChange={self.selectBoxes} value=''/></label>);
        this.props.all_groups.forEach(function(group) {
            if(group.id != self.state.id) {
                groups_list.push(<label>{group.name}<input type="radio" name="u_group"
                                                           onChange={self.selectBoxes} value={group.id}/></label>);
            }
        });
        var group_list_block = <article className="select_box">
            {groups_list}
        </article>;
        //buttons
        var user_buttons = [];
        user_buttons.push(<button onClick={this.actions('change')} className="solve_but">Edit</button>);
        if(this.state.active) {
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
                {user_group_buttons}
                <article className="user_action user_change hidden">
                    <form>
                        <input type="text" name="name" placeholder="Name" defaultValue={this.state.name}/><br/>
                        <input type="text" name="mail" placeholder="Mail" defaultValue={this.state.mail}/><br/>
                        {group_list_block}
                    </form>
                    <button onClick={this.submit('edit')}>Edit</button>
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

$(document).ready(function() {
    if (document.location.pathname == '/users') {
        ReactDOM.render(<Creating />, document.getElementsByClassName('content_inner')[0]);
    }
});