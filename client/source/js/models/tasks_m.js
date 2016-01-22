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
        var users = '';
        if(this.state.room && this.state.users) {
            this.state.users.forEach(function(elem) {
                users.push(<label>{elem[1]}<input type="radio" name="performer" value={elem[0]}/></label>);
            });
            users.unshift(<label>Me<input type="radio" name="performer" value={false}/></label>)
        }
        var t_groups = '';
        if(this.state.t_groups) {
            this.state.t_groups.map(function(elem) {
                return <label>{elem[1]}<input type="radio" name="performer" value={elem[0]}/></label>;
            });
            users.unshift(<label>Me<input type="radio" name="performer" value={false}/></label>)
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
            </article>
        </section>;
    }
});