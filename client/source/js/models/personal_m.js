import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {submitting, getData} from '../submitting.js';
import {Waiting, Error} from './templates.js';
import toast from '../toaster.js';

//responses
var actions_r = ['Success!', 'Server error' , 'Required fields are empty',
    'Incorrect login or old password', 'Passwords are nor equal'];

var RemindPassword = React.createClass({
    getInitialState() {
        return null;
    },
    submit(elem) {
        var target = elem.target;
        var ajax_data = {};
        ajax_data = getData(target);
        if(ajax_data) {
            submitting(ajax_data, '/api/account/reminder', 'POST', function (data) {
                var response_status = +data;
                if (isNaN(response_status)) {
                    response_status = 1;
                }
                toast(actions_r[response_status]);
                if(response_status == 0) {
                    $(target).parent().find('input[type="text"], textarea').val('');
                }
            }, function (err) {
                toast(actions_r[1]);
            });
        }
        else {
            toast(actions_r[2]);
        }
    },
    switching(elem) {
        $(elem.target).next('.creatingFormBody').slideToggle();
    },
    render() {
        return <article className="creatingForm">
            <article className="creatingFormHead" onClick={this.switching}>Remind password</article>
            <article className="creatingFormBody">
                <input type="text" placeholder="Your mail" name="mail" data-req="true"/>
                <br/>
                <button onClick={this.submit}>Remind</button>
            </article>
        </article>;
    }
});

var ChangePass = React.createClass({
    getInitialState() {
        return null;
    },
    submit(elem) {
        var target = elem.target;
        var ajax_data = {};
        ajax_data = getData(target);
        if(ajax_data) {
            submitting(ajax_data, '/api/account/change', 'POST', function (data) {
                console.log(data);
                var response_status = +data;
                if (isNaN(response_status)) {
                    response_status = 1;
                }
                toast(actions_r[response_status]);
                if(response_status == 0) {
                    $(target).parent().find('input[type="text"], textarea').val('');
                }
            }, function (err) {
                toast(actions_r[1]);
            });
        }
        else {
            toast(actions_r[2]);
        }
    },
    switching(elem) {
        $(elem.target).next('.creatingFormBody').slideToggle();
    },
    render() {
        return <article className="creatingForm">
            <article className="creatingFormHead" onClick={this.switching}>Change password</article>
            <article className="creatingFormBody">
                <input type="text" placeholder="Your mail" name="mail" data-req="true"/>
                <br/>
                <input type="text" placeholder="Old password" name="old_pass" data-req="true"/>
                <br/>
                <input type="password" placeholder="New password" name="new_pass_one" data-req="true"/>
                <br/>
                <input type="password" placeholder="New password again" name="new_pass_two" data-req="true"/>
                <br/>
                <button onClick={this.submit}>Change</button>
            </article>
        </article>;
    }
});

var AppealToSupport = React.createClass({
    getInitialState() {
        return null;
    },
    submit(elem) {
        var target = elem.target;
        var ajax_data = {};
        ajax_data = getData(target);
        if(ajax_data) {
            submitting(ajax_data, '/api/account/appeal', 'POST', function (data) {
                var response_status = +data;
                if (isNaN(response_status)) {
                    response_status = 1;
                }
                toast(actions_r[response_status]);
                if(response_status == 0) {
                    $(target).parent().find('input[type="text"], textarea').val('');
                }
            }, function (err) {
                toast(actions_r[1]);
            });
        }
        else {
            toast(actions_r[2]);
        }
    },
    switching(elem) {
        $(elem.target).next('.creatingFormBody').slideToggle();
    },
    render() {
        return <article className="creatingForm">
            <article className="creatingFormHead" onClick={this.switching}>Appeal to support</article>
            <article className="creatingFormBody">
                <input type="text" placeholder="Your mail" name="mail" data-req="true"/>
                <br/>
                <textarea name="text" placeholder="Your text" data-req="true"></textarea>
                <br/>
                <button onClick={this.submit}>Submit</button>
            </article>
        </article>;
    }
});

var PersonalPage = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="account_forms">
            <RemindPassword />
            <ChangePass />
            <AppealToSupport />
        </article>;
    }
});

export default PersonalPage;