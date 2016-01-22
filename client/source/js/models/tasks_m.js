//responses
var actions_r = ['Success!', 'Required fields are empty', 'Incorrect date', 'Server error'];
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
    creating() {
        //
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
                <textarea name="description" placeholder="Task description"></textarea><br/>
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
            </article>
        </section>;
    }
});

$(document).ready(function() {
    $('input#qw').datepicker();
})