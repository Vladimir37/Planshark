import React from 'react';
import ReactDOM from 'react-dom';

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
                t_groups: Boolean(data.t_manage || !self.state.room),
                u_groups: Boolean(data.u_manage),
                users: Boolean(data.group == 0 && data.room)
            });
        }
    },
    exit() {
        submitting(null, '/api/account/exit', 'POST', false, false, function() {
            document.location.pathname = '/';
        });
    },
    render() {
        if(this.state.received) {
            var tasks = <a href="/tasks">
                <nav>Tasks</nav>
            </a>;
            var t_groups = this.state.t_group ? <a href="/tasks_groups">
                <nav>Tasks groups</nav>
            </a> : '';
            var u_groups = this.state.u_group ? <a href="/users_groups">
                <nav>Users groups</nav>
            </a> : '';
            var users = this.state.t_group ? <a href="/users">
                <nav>Users</nav>
            </a> : '';
            var exit_but = <nav onClick={this.exit}>Exit</nav>;
            return <article className="menu_inner">
                {tasks}
                {t_groups}
                {u_groups}
                {users}
                {exit_but}
            </article>;
        }
        else {
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