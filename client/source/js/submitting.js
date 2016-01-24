//get data from form
export function getData(target) {
    var form_data = {};
    var form = $(target).parent();
    var text_inputs = form.find('input[type="text"], input[type="password"], textarea');
    var radio_inputs = form.find('input[type="radio"]:checked');
    var checkboxes = form.find('input[type="checkbox"]:checked');
    for (var i = 0; i < text_inputs.length; i++) {
        if(text_inputs[i].dataset.req && !text_inputs[i].value) {
            return false;
        }
        form_data[text_inputs[i].name] = text_inputs[i].value;
    }
    for (var i = 0; i < radio_inputs.length; i++) {
        form_data[radio_inputs[i].name] = radio_inputs[i].value;
    }
    for (var i = 0; i < checkboxes.length; i++) {
        form_data[checkboxes[i].name] = true;
    }
    return form_data;
};

//submitting data to server
export function submitting(data, url, type, success, error, complete) {
    var emptyFunction = function(){};
    success = success || emptyFunction;
    error = error || emptyFunction;
    complete = complete || emptyFunction;
    data = data || {};
    if(data) {
        $.ajax({
            url,
            type,
            data,
            error,
            success,
            complete
        });
    }
    else {
        toast("Required fields are empty!");
    }
};