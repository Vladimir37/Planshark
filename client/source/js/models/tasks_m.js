//responses
var actions_r = ['Success!', 'Server error' , 'Required fields are empty', 'Incorrect date'];
var deleting_r = ['Success!', 'Server error'];

var Creating = React.createClass({
    getInitialState() {
        return {
            room: false,
            users: false,
            t_groups: false,
            u_groups: false
        };
    },
    submit(elem) {
        var ajax_data = getData(elem.target);
        var exp_date = $(elem.target).find('input#time').val();
        if(exp_date && new Date() > new Date(exp_date)) {
            toast(actions_r[3]);
        }
        else {
            submitting(ajax_data, '/api/tasks/create', 'POST', function(data) {
                var response_status = +data;
                if(isNaN(response_status)) {
                    response_status = 1;
                }
                toast(registration_r[response_status]);
                if(response_status == 0) {
                    toast(actions_r[0]);
                    $(elem.target).find('textarea, input[type="text"]').val('');
                }
            }, function(err) {
                toast("Server error");
            });
        }
    },
    render() {
        //performers list
        var users = [];
        if(this.state.room && this.state.users) {
            this.state.users.forEach(function(elem) {
                users.push(<label>{elem[1]}<input type="radio" name="performer" value={elem[0]}/></label>);
            });
            users.unshift(<label>Me<input type="radio" name="performer" value={false} checked /></label>)
        }
        //tasks groups list
        var t_groups = [];
        if(this.state.t_groups) {
            this.state.t_groups.map(function(elem) {
                t_groups.push(<label>{elem[1]}<input type="radio" name="t_group" value={elem[0]}/></label>);
            });
            t_groups.unshift(<label>No group<input type="radio" name="t_group" value={false} checked/></label>)
        }
        //users groups list
        var u_groups = [];
        if(this.state.room && this.state.u_groups) {
            this.state.u_groups.forEach(function(elem) {
                u_groups.push(<label>{elem[1]}<input type="radio" name="u_group" value={elem[0]}/></label>);
            });
            u_groups.unshift(<label>No group<input type="radio" name="u_group" value={false} checked /></label>)
        }
        //personal or company items
        var u_groups_item = '';
        var performers_item = '';
        if(this.state.room) {
            performers_item = <article className="perform_select_main">
                <h3>Performer</h3>
                <article className="users_select">{users}</article>
            </article>;
            u_groups_item = <article className="u_group_select_main">
                <h3>Users group</h3>
                <article className="u_group_select">{u_groups}</article>
            </article>;
        }
        return <section className="taskCreating">
            <article className="taskCreatingHead">Creating</article>
            <article className="taskCreatingBody">
                <input type="text" name="name" placeholder="Task name" data-req="true"/><br/>
                <textarea name="description" placeholder="Task description" data-req="true"></textarea><br/>
                <article className="priority">
                    <article className="priority_scale">
                        <article className="priority_scale_1"></article>
                        <article className="priority_scale_2"></article>
                        <article className="priority_scale_3"></article>
                    </article>
                    <article className="priority_control">
                        <label>Low<input type="radio" name="priority" value="0" defaultChecked/></label>
                        <label>Middle<input type="radio" name="priority" value="1"/></label>
                        <label>High<input type="radio" name="priority" value="2"/></label>
                    </article>
                </article>
                {performers_item}
                <article className="t_group_select_main">
                <h3>Tasks group</h3>
                    <article className="t_group_select">{t_groups}</article>
                </article>
                {u_groups_item}
                <input type="text" name="expiration" placeholder="Expiration time" id="time"/><br/>
                <button className="sub" onClick={this.submit}>Create</button>
            </article>
        </section>;
    }
});

var TasksPage = React.createClass({
    getInitialState() {
        return {
            loaded: false,
            failed: false,
            data: false
        }
    },
    loading() {
        var self = this;
        submitting(null, '/api/account/status', 'GET', function(data) {
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            self.setState({
                loaded: true,
                data: data
            })
        }, function(err) {
            self.setState({
                failed: true
            });
        });
    },
    render() {
        if(!this.state.loaded && !this.state.failed) {
            //
        }
    }
});

$(document).ready(function() {
    $('input#time').datepicker();
});