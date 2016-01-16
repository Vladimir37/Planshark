//submitting form on press button
function submitting(success, error, process, done) {
    var form_data = {};
    var form = $(this).parent();
    var addr = form.data('addr');
    var request_type = form.data('type');
    var text_inputs = form.find('input[type="text"], input[type="password"], textarea');
    var radio_inputs = form.find('input[type="radio"]:checked');
    var checkboxes = form.find('input[type="checkbox"]:checked');
    for (var i = 0; i < text_inputs.length; i++) {
        form_data[text_inputs[i].name] = text_inputs[i].value;
    }
    for (var i = 0; i < radio_inputs.length; i++) {
        form_data[radio_inputs[i].name] = radio_inputs[i].value;
    }
    for (var i = 0; i < checkboxes.length; i++) {
        form_data[checkboxes[i].name] = true;
    }
    console.log(form_data);
};