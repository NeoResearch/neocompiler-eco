function addBlinkToElement(elementName) {
    $(elementName)[0].scrollIntoView();
    $(elementName).addClass('blink_element');

    window.setTimeout(function() {
        $(elementName).removeClass('blink_element');
    }, 5000);
}