$(document).ready(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square',
        radioClass: 'iradio_minimal-green',

        // increaseArea: '20%' // optional
    });
});

$(document).ready(function () {
    $('.selectclass').select2();
});

$(window).on('load', function () {

    setTimeout(function () {
        $('.preloader').remove();
    }, 1000)

});
