//render jade file without addition variables
function render_jade(file) {
    return function(req, res, next) {
        res.render(file);
    };
};