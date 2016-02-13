import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {submitting, getData} from '../submitting.js';
import {Waiting, Error, Empty, Menu, Forbidden} from './templates.js';
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
        return null;
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
            submitting(ajax_data, '/api/user_manage/create', 'POST', function(data) {
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
    render() {
        return <section className="creatingForm">
            <article className="creatingFormHead" onClick={this.switching}>Creating user group</article>
            <article className="creatingFormBody">
                <article className="creatingFormTop">
                    <input type="text" name="name" placeholder="Name" data-req="true" />
                    <input type="text" name="color" placeholder="Color" className="color_field" data-req="true" />
                </article>
                <article className="creatingFormMiddle">
                    <table>
                        <tr>
                            <td><label>Creating tasks<input type="checkbox" name="creating" value="1" /></label></td>
                            <td><label>Editing tasks<input type="checkbox" name="editing" value="1" /></label></td>
                        </tr>
                        <tr>
                            <td><label>Reassignment tasks<input type="checkbox" name="reassignment" value="1" /></label></td>
                            <td><label>Deleting tasks<input type="checkbox" name="deleting" value="1" /></label></td>
                        </tr>
                        <tr>
                            <td><label>Users control<input type="checkbox" name="user_manage" value="1" /></label></td>
                            <td><label>Tasks control<input type="checkbox" name="task_manage" value="1" /></label></td>
                        </tr>
                    </table>
                </article>
                <button className="sub" onClick={this.submit}>Create</button>
            </article>
        </section>;
    }
});

var UserGroup = React.createClass({
    getInitialState() {
        var data = this.props.data;
        return {
            id: data.id,
            name: data.name,
            color: data.color,
            creating: data.creating,
            editing: data.editing,
            reassignment: data.reassignment,
            deleting: data.deleting,
            task_manage: data.t_group_manage,
            user_manage: data.u_group_manage,
            users_count: data.users.length,
            users: data.users
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
    submit(type) {
        return function(elem) {
            var target = elem.target;
            var ajax_data = {};
            ajax_data = getData(target);
            ajax_data.id = self.state.id;
            if(ajax_data) {
                submitting(ajax_data, '/api/user_manage/' + type, 'POST', function (data) {
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
        var group_classes = 'user user_group_color user_group_color_' + this.state.id;
        //all users in groups
        var users_list = [];
        this.state.users.forEach(function(task) {
            users_list.push(<article className="item_list">{task.name}</article>);
        });
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
        //classes
        var create_c = this.state.creating ? 'active_elem' : 'inactive_elem';
        var edit_c = this.state.editing ? 'active_elem' : 'inactive_elem';
        var reassign_c = this.state.reassignment ? 'active_elem' : 'inactive_elem';
        var delete_c = this.state.deleting ? 'active_elem' : 'inactive_elem';
        var users_c = this.state.user_manage ? 'active_elem' : 'inactive_elem';
        var tasks_c = this.state.task_manage ? 'active_elem' : 'inactive_elem';
        return <article className={group_classes}>
            <article className="user_top">
                <article className="user_head">
                    <span className="user_name">{this.state.name}</span><br/>
                    <span className="user_group">Users: {this.state.users_count}</span>
                </article>
                <article className="user_expand" onClick={this.expand}></article>
            </article>
            <article className="user_additional">
                <article className="user_middle">
                    <article className={create_c}>Creating</article>
                    <article className={edit_c}>Editing</article>
                    <br/>
                    <article className={reassign_c}>Reassignment</article>
                    <article className={delete_c}>Deleting</article>
                    <br/>
                    <article className={users_c}>Users manage</article>
                    <article className={tasks_c}>Tasks manage</article>
                </article>
                <article className="user_bottom">
                    <button onClick={this.actions('edit')} className="solve_but">Edit</button>
                    <button onClick={this.actions('delete')}>Delete</button>
                </article>
                <article className="user_action user_edit hidden">
                    <form>
                        <input type="text" name="name" placeholder="Name" defaultValue={this.state.name}/><br/>
                        <input type="text" name="color" placeholder="Color" defaultValue={this.state.color}
                               className="color_field"/><br/>
                        <label>Creating<input type="checkbox" name="creating" defaultChecked={this.state.creating}/></label>
                        <label>Editing<input type="checkbox" name="editing" defaultChecked={this.state.editing}/></label><br/>
                        <label>Reassignment<input type="checkbox" name="reassignment" defaultChecked={this.state.reassignment}/></label>
                        <label>Deleting<input type="checkbox" name="deleting" defaultChecked={this.state.deleting}/></label><br/>
                        <label>Users manage<input type="checkbox" name="user_manage" defaultChecked={this.state.user_manage}/></label>
                        <label>Tasks manage<input type="checkbox" name="task_manage" defaultChecked={this.state.task_manage}/></label><br/>
                    </form>
                    <button onClick={this.submit('edit')}>Edit</button>
                </article>
                <article className="user_action user_delete hidden">
                    <h3>Move all users in {this.state.name} to other group?</h3>
                    <form>
                        {group_list_block}
                    </form>
                    <button onClick={this.submit('deleting')}>Delete</button>
                </article>
            </article>
        </article>;
    }
});


$(document).ready(function() {
    if (document.location.pathname == '/users_groups') {
        ReactDOM.render(<Creating />, document.getElementsByClassName('content_inner')[0]);
    }
});