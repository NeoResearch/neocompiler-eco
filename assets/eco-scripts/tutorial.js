var tutorialshow = 0;
var atualelement = '';
var steps = 1;


function call_fncts(elementBlock2, title, text) {

    if (tutorialshow == 0) {
        $("#hidetutorial").css("display", "none");
        $(atualelement).popover('hide');
        $(atualelement).popover('dispose');

        $("#hidetutorial").css("display", "block");
        $("#closetutorial").css("display", "block");
        $("#nexttutorial").css("display", "block");
        //$("body").css("overflow-y", "hidden");
        $(".container").css("opacity", "0.5");
        $("header").css("opacity", "0.5");


        //  $("" + elementBlock + "").css("z-index", "10000000000");

        //  $("#" + elementBlock2 + "").css("background", "#00AF92");

        $(elementBlock2).popover({
            animation: true,
            title: title,
            content: text

        });

        atualelement = elementBlock2;
        $(elementBlock2).popover('show');

    }

}


function nextTutorial() {
    $(".container").css("opacity", "1");

    if (steps == 1) {
        call_fncts("#compilerNav", 'Compiler tab', 'Here you can compile and verify opcodes, abi, errors, among others...');
    }

    if (steps == 2) {
        removetutorial();
    }

    steps = steps + 1;
}

function removetutorial() {
    tutorialshow = 1;
    $("#hidetutorial").css("display", "none");
    $("#closetutorial").css("display", "none");
    $("#nexttutorial").css("display", "none");
    $(atualelement).popover('hide');
    $(atualelement).popover('dispose');
    $(".container").css("opacity", "1");
    $("header").css("opacity", "1");
}

nextTutorial();