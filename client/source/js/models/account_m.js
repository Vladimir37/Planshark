import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {submitting, getData} from '../submitting.js';
import {Waiting, Error} from './templates.js';
import toast from '../toaster.js';

//responses
var registration_r = ['Success!', 'Name is busy', 'Mail is busy', 'Required fields are empty', 'Server error'];
var login_r = ['Success!', 'Incorrect login or password', 'Server error'];

var Buttons = React.createClass({
    getInitialState() {
        return {
            log: true,
            reg: false
        };
    },
    switching(name) {
        var self = this;
        return () => {
            if (!self.state[name]) {
                self.setState({
                    log: !self.state.log,
                    reg: !self.state.reg
                });
                var visible_form = $('.index_form:visible');
                var hidden_form = $('.index_form:hidden');
                visible_form.hide();
                hidden_form.fadeIn();
            }
        }
    },
    render() {
        var log_classes = "index_but " + (this.state.log ? 'active' : '');
        var reg_classes = "index_but " + (this.state.reg ? 'active' : '');
        return <article className="index_but_main">
            <article className={log_classes} onClick={this.switching('log')}>Login</article>
            <article className={reg_classes} onClick={this.switching('reg')}>Registration</article>
        </article>;
    }
});

var Login = React.createClass({
    getInitialState() {
        return null;
    },
    submit(elem) {
        var ajax_data = getData(elem.target);
        var self = this;
        submitting(ajax_data, '/api/account/login', 'POST', function(data) {
            var response_status = +data;
            if(isNaN(response_status)) {
                response_status = 2;
            }
            toast(login_r[response_status]);
            if(response_status == 0) {
                self.props.request();
            }
            else {
                $(elem.target).parent().find('[name="pass"]').val('');
            }
        }, function(err) {
            console.log(err);
            toast("Server error");
        });
    },
    render() {
        return <article className="form index_form login_form">
                <input type="text" name="name" placeholder="Name" data-req="true"/><br/>
                <input type="password" name="pass" placeholder="Password" data-req="true"/><br/>
                <label>Remember me<input type="checkbox" name="remember"/></label><br/>
                <button className="sub" onClick={this.submit}>Login</button><br/>
                <a href="/personal" className="forgotten">Forgot your password?</a>
            </article>;
    }
});

var Registration = React.createClass({
    getInitialState() {
        return null;
    },
    submit(elem) {
        var ajax_data = getData(elem.target);
        var self = this;
        submitting(ajax_data, '/api/account/registration', 'POST', function(data) {
            var response_status = +data;
            if(isNaN(response_status)) {
                response_status = 4;
            }
            toast(registration_r[response_status]);
            if(response_status == 0) {
                self.props.request();
            }
        }, function(err) {
            toast(registration_r[4]);
        });
    },
    render() {
        return <article className="form index_form register_form hidden" data-addr="/api/account/registration">
                <input type="text" name="mail" placeholder="E-mail" data-req="true"/><br/>
                <input type="text" name="name" placeholder="Name" data-req="true"/><br/>
                <input type="text" name="pass" placeholder="Password" data-req="true"/><br/>
                <label>Personal<input type="radio" name="type" value="personal" defaultChecked/></label>
                <label>Company<input type="radio" name="type" value="company"/></label><br/>
                <button className="sub" onClick={this.submit}>Registration</button>
            </article>;
    }
});

//after registration
var After = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="after_reg">
            The letter with login and password was send to your mail. You now are able to log in to the Planshark.
        </article>;
    }
});

//panel for authorized users
var Panel = React.createClass({
    getInitialState() {
        return {
            loaded: true,
            fail: false,
            name: false,
            tasks: false,
            t_groups: false,
            u_groups: false,
            users: false
        };
    },
    receptionData() {
        var data = this.props.user_data;
        var self = this;
        this.setState({
            loaded: false,
            name: data.name,
            tasks: true,
            t_groups: Boolean(data.t_manage || !self.state.room),
            u_groups: Boolean(data.u_manage),
            users: Boolean(data.group == 0 && data.room)
        });
    },
    render() {
        if(this.state.loaded && !this.state.fail) {
            this.receptionData();
            return <Waiting />;
        }
        else if(!this.state.loaded && this.state.fail) {
            return <Error />;
        }
        else {
            var name = <article className="index_panel_name">{this.state.name}</article>;
            var tasks = <a href="/tasks">
                <article className="index_panel_elem">Tasks</article>
            </a>;
            var t_groups = this.state.t_groups ? <a href="/tasks_groups">
                <article className="index_panel_elem">Tasks groups</article>
            </a> : '';
            var u_groups = this.state.u_groups ? <a href="/users_groups">
                <article className="index_panel_elem">Users groups</article>
            </a> : '';
            var users = this.state.users ? <a href="/users">
                <article className="index_panel_elem">Users</article>
            </a> : '';
            var personal = <a href="/personal">
                <article className="index_panel_elem">Personal</article>
            </a>;
            var exit = <article className="index_panel_elem" onClick={this.props.exit}>
                Exit
            </article>;
            return <article className="index_panel">
                {name}
                {tasks}
                {t_groups}
                {u_groups}
                {users}
                {personal}
                {exit}
            </article>;
        }
    }
});

//checking cookie and render start forms
var StartAccount = React.createClass({
    getInitialState() {
        return {
            logged: false,
            registration: false,
            data: false
        };
    },
    checking() {
        var self = this;
        submitting(null, '/api/account/status', 'GET', function(data) {
            if(typeof data == 'string') {
                data = JSON.parse(data);
            }
            if(data && !self.state.logged) {
                self.setState({
                    logged: true,
                    data
                });
            }
            else if(!data && self.state.logged) {
                self.setState({
                    logged: false,
                    data: false
                });
            }
        }, function(err) {
            console.log(err);
        });
    },
    registration() {
        this.setState({
            registration: true
        });
        $('.login_form').show();
    },
    login() {
        this.checking();
    },
    exit() {
        var self = this;
        submitting(null, '/api/account/exit', 'POST', false, false, function() {
            self.checking();
        });
    },
    render() {
        this.checking();
        //first visit
        if(!this.state.logged && !this.state.registration) {
            return <article className="index_form_inner">
                <Buttons />
                <Login request={this.login} />
                <Registration request={this.registration} />
            </article>;
        }
        //after registration
        else if(!this.state.logged && this.state.registration) {
            return <article className="index_form_inner">
                <After />
                <Login request={this.login} />
            </article>;
        }
        //after login
        else {
            return <article className="index_form_inner">
                <Panel exit={this.exit} user_data={this.state.data} />
            </article>;
        }
    }
});

export default StartAccount;