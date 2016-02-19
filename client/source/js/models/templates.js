import React from 'react';
import ReactDOM from 'react-dom';
import {submitting} from '../submitting.js';

export var Menu = React.createClass({
    getInitialState() {
        return {
            received: false,
            t_groups: false,
            u_groups: false,
            users: false
        }
    },
    dataHandling() {
        var data = this.props.data;
        if(data && !this.state.received) {
            this.setState({
                received: true,
                t_groups: Boolean(data.t_manage || !data.room),
                u_groups: Boolean(data.u_manage),
                users: Boolean(data.group == 0 && data.room)
            });
        }
    },
    transition(addr) {
        return function() {
            if(document.location.pathname != addr) {
                document.location.pathname = addr;
            }
        }
    },
    exit() {
        submitting(null, '/api/account/exit', 'POST', false, false, function() {
            document.location.pathname = '/';
        });
    },
    render() {
        if(this.state.received) {
            //active definition
            var active_name = this.props.active;
            var tasks_c = active_name == 'tasks' ? 'active_menu_elem' : '';
            var t_groups_c = active_name == 't_groups' ? 'active_menu_elem' : '';
            var u_groups_c = active_name == 'u_groups' ? 'active_menu_elem' : '';
            var users_c = active_name == 'users' ? 'active_menu_elem' : '';
            //menu formation
            var tasks = <nav onClick={this.transition('/tasks')} className={tasks_c}>Tasks</nav>;
            var t_groups = this.state.t_groups ?
                <nav onClick={this.transition('/tasks_groups')} className={t_groups_c}>Tasks groups</nav> : '';
            var u_groups = this.state.u_groups ?
                <nav onClick={this.transition('/users_groups')} className={u_groups_c}>Users groups</nav> : '';
            var users = this.state.users ?
                <nav onClick={this.transition('/users')} className={users_c}>Users</nav> : '';
            var personal = <nav onClick={this.transition('/personal')} className={users_c}>Personal</nav>;
            var exit_but = <nav onClick={this.exit}>Exit</nav>;
            return <article className="menu_inner">
                {tasks}
                {t_groups}
                {u_groups}
                {users}
                {personal}
                {exit_but}
            </article>;
        }
        else {
            this.dataHandling();
            return null;
        }
    }
});

export var Waiting = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="waiting">
            <p className="message">Please wait...</p>
        </article>;
    }
});

export var Error = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="waiting">
            <p className="message">Server error! Try again later.</p>
        </article>;
    }
});

export var Empty = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="waiting">
            <p className="message">List is empty.</p>
        </article>;
    }
});

export var Forbidden = React.createClass({
    getInitialState() {
        return null;
    },
    render() {
        return <article className="waiting">
            <p className="message">You can not see it.</p>
        </article>;
    }
});