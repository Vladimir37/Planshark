var nodemailer = require('nodemailer');
var jade = require('jade');

var config = require('../../config/mail');

//Connection data
var transporter = nodemailer.createTransport({
    service: config.service,
    auth: {
        user: config.login,
        pass: config.pass
    }
});

//Функция отправки
function send(name, address, subject, text, obj) {
    obj = obj || {};
    //read letter
    jade.renderFile('client/view/mail/' + name + '.jade', obj, function(err, result) {
        if(err) {
            console.log(err);
        }
        else {
            //Send data
            var mailOptions = {
                from: config.from,
                to: address,
                subject: subject,
                html: text
            };
            //Send result
            transporter.sendMail(mailOptions, function(error, info){
                if(error) {
                    console.log('Send error: ' + error);
                }
                else {
                    console.log('Success send: ' + info.response);
                }
            });
        }
    });
};

module.exports = send;