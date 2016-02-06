import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {submitting, getData} from '../submitting.js';
import {Waiting, Error, Empty, Menu} from './templates.js';
import toast from '../toaster.js';
import {colorpick} from '../picker.js';

//responses
var actions_r = ['Success!', 'Server error' , 'Required fields are empty'];

//refresh groups list
var refresh;

var Creating = React.createClass({
    getInitialState() {
        return null
    },
    componentDidMount() {
        setTimeout(colorpick, 100);
    },
    submit(elem) {
        var ajax_data = getData(elem.target);
        if(!ajax_data) {
            toast(actions_r[2]);
        }
        else {
            submitting(ajax_data, '/api/task_manage/create', 'POST', function(data) {
                var response_status = +data;
                if(isNaN(response_status)) {
                    response_status = 1;
                }
                if(response_status == 0) {
                    toast(actions_r[0]);
                    $(elem.target).parent().find('input[type="text"]').val('');
                    //refresh();
                }
                else {
                    toast(actions_r[response_status]);
                }
            }, function(err) {
                toast(actions_r[1]);
            });
        }
    },
    switching() {
        $('.creatingFormBody').slideToggle();
    },
    render() {
        return <section className="creatingForm">
            <article className="creatingFormHead" onClick={this.switching}>Creating</article>
            <article className="creatingFormBody">
                <input type="text" name="name" placeholder="Name" data-req="true" />
                <input type="text" name="color" placeholder="Color" className="color_field" data-req="true" />
                <button className="sub" onClick={this.submit}>Create</button>
            </article>
        </section>;
    }
});

$(document).ready(function() {
    if (document.location.pathname == '/tasks_groups') {
        ReactDOM.render(<Creating />, document.getElementsByClassName('content_inner')[0]);
    }
});