var Crypt = require('easy-encryption');

var config = require('../../config/crypt');

// crypt object
var crypt = new Crypt(config);

// encrypt
function encrypt(text) {
    try {
        return crypt.encrypt(text)
    }
    catch(err) {
        return false;
    }
};

// decrypt
function decrypt(text) {
    try {
        return crypt.decrypt(text)
    }
    catch(err) {
        return false;
    }
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;