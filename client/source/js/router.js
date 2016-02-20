import React from "react";
import {Router, Route, browserHistory} from "react-router";
import ReactDOM from "react-dom";

import account from "./models/account_m.js";
import tasks from "./models/tasks_m.js";
import users from "./models/users_m.js";
import task_groups from "./models/t_groups_m.js";
import user_groups from "./models/u_groups_m.js"
import personal from "./models/personal_m.js"

$(document).ready(function() {
    $('.content .wrapper').css('min-height', window.innerHeight - 160 + 'px');
    ReactDOM.render((
        <Router history={browserHistory}>
            <Route path="/" component={account}></Route>
            <Route path="/tasks" component={tasks}></Route>
            <Route path="/users_groups" component={user_groups}></Route>
            <Route path="/tasks_groups" component={task_groups}></Route>
            <Route path="/users" component={users}></Route>
            <Route path="/personal" component={personal}></Route>
        </Router>
    ), document.getElementsByClassName('content_inner')[0]);
});