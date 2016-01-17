var Buttons = React.createClass({
    getInitialState() {
        return {
            log: true,
            reg: false
        };
    },
    switching() {
        this.state.log = !this.state.log;
        this.state.reg = !this.state.reg;
    },
    render() {
        return <article className="index_but_main">
            <article className="index_but login active">Login</article>
            <article className="index_but register">Registration</article>
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
                <label>Personal<input type="radio" name="type" value="personal" checked/></label>
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