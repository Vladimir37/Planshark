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
    render() {
        //
    }
});

$(document).ready(function() {
    if (document.location.pathname == '/users_groups') {
        ReactDOM.render(<Creating />, document.getElementsByClassName('content_inner')[0]);
    }
});