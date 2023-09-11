var tutorialDisabled = 0;
var atualelement = '';
var compilerTabSteps = [];
var currentStep = 0;

compilerTabSteps.push(["#compilerNav", 'Compiler tab', 'Here you can compile and verify opcodes, abi, errors, among others...']);
compilerTabSteps.push(["#compilebtn", 'Compile button', 'Click here to submit code to compiler.']);
compilerTabSteps.push(["#codewarnerr", 'Compiler output', 'Output from compiler is displayed here.']);

function call_fncts(elementBlock2, title, text) {
    if (tutorialDisabled == 0) {
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

    if (currentStep >= compilerTabSteps.length) {
        removetutorial();
        return;
    }

    call_fncts(compilerTabSteps[currentStep][0], compilerTabSteps[currentStep][1], compilerTabSteps[currentStep][2]);

    currentStep = currentStep + 1;
}

function removetutorial() {
    tutorialDisabled = 1;
    $("#hidetutorial").css("display", "none");
    $("#closetutorial").css("display", "none");
    $("#nexttutorial").css("display", "none");
    $(atualelement).popover('hide');
    $(atualelement).popover('dispose');
    $(".container").css("opacity", "1");
    $("header").css("opacity", "1");
    setLocalStorage("disabledTutoral", "1");
}