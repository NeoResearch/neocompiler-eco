$(document).ready(function () {
    $('.selectclass').select2();
});

$(window).on('load', function () {

    setTimeout(function () {
        $('.preloader').remove();
    }, 1000)

});
