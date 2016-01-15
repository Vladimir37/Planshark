$(document).ready(function() {
    $('.content').on('click', '.index_but:not(.active)', function() {
        console.log(12);
        $('.index_but').toggleClass('active');
        var visible_form = $('.index_form:visible');
        var hidden_form = $('.index_form:hidden');
        visible_form.hide();
        hidden_form.fadeIn();
    });
});