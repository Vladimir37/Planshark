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
    submit() {
        //
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