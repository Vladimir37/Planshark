//serializing returned data
function serializing(status, data) {
    data = data || false;
    var result = {
        status,
        body: data
    };
    return JSON.stringify(result);
};

module.exports = serializing;