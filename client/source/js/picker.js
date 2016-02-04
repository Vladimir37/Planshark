export function datepick() {
    $('.time_field').datepicker({
        minDate: new Date()
    });
};

export function colorpick() {
    $('.color_field').colorpicker({
        defaultPalette: 'web'
    });
};