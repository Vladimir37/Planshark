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
    submit() {
        //
    },
    render() {
        return <article className="form index_form login_form" data-addr="/api/account/login">
                <input type="text" name="name" placeholder="Name" data-req="true"/><br/>
                <input type="password" name="pass" placeholder="Password" data-req="true"/><br/>
                <label>Remember me<input type="checkbox" name="remember"/></label><br/>
                <button className="sub">Login</button>
            </article>;
    }
});

var Registration = React.createClass({
    getInitialState() {
        return null;
    },
    submit() {
        //
    },
    render() {
        return <article className="form index_form register_form hidden" data-addr="/api/account/registration">
                <input type="text" name="mail" placeholder="E-mail" data-req="true"/><br/>
                <input type="text" name="name" placeholder="Name" data-req="true"/><br/>
                <input type="password" name="pass" placeholder="Password" data-req="true"/><br/>
                <label>Personal<input type="radio" name="type" value="personal" defaultChecked/></label>
                <label>Company<input type="radio" name="type" value="company"/></label><br/>
                <button className="sub">Registration</button>
            </article>;
    }
});

//checking cookie and render start forms
var StartAccount = React.createClass({
    getInitialState() {
        //ToDo Checking
        return null;
    },
    statusSwitching() {
        //
    },
    render() {
        return <article className="index_form_inner">
            <Buttons />
            <Login/>
            <Registration />
        </article>;
    }
});

ReactDOM.render(<StartAccount />, document.getElementsByClassName('index_forms')[0]);