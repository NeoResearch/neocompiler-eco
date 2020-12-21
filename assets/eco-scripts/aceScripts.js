function createEditor(name, mode) {
    var editor = ace.edit(name);
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode(mode);
    editor.setAutoScrollEditorIntoView(true);
    // the next commands requires package ext-language_tools.js
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false,
    });
    editor.commands.addCommand({
        name: "showKeyboardShortcuts",
        bindKey: {
            win: "Ctrl-Alt-h",
            mac: "Command-Alt-h"
        },
        exec: function(editor) {
            ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
                module.init(editor);
                //editor.showKeyboardShortcuts() just shows when tigger the hotkey
            })
        }
    })
    return editor
}

function setExample(language, selected_index) {
    //console.log("Selecting example: " + selected_index + " for Compiler: " + language);
    aceEditor.getSession().setValue("");
    getfile(language, selected_index, 0);

    // cleaning file to Save name
    //$("#cbx_example_name")[0].value = "";
}

function getfile(language, selected_index, index = 0) {
    var vExamples = cSharpFiles;

    var numfiles = vExamples[selected_index].length;
    if (index < numfiles) {
        var file = vExamples[selected_index][index];
        //console.log("getting example file: " + file);
        $.get(file, function(data) {
            aceEditor.getSession().setValue(aceEditor.getSession().getValue() + data);
            getfile(language, selected_index, index + 1);
        });
    }
}

function addOptionToSelectionBox(textToOption, valueToOption, walletSelectionBox) {
    var option = document.createElement("option");
    option.text = textToOption;
    option.value = valueToOption;
    var select = document.getElementById(walletSelectionBox);
    select.appendChild(option);
}

function updateCompilersSelectionBox(compilerType) {
    $.get(BASE_PATH_COMPILERS + '/getcompilers',
        function(data) {
            compilerSelectionBoxID = "compilers_versions-selection-box";
            compilerSelectionBoxObj = document.getElementById(compilerSelectionBoxID);
            compilerSelectionBoxObj.options.length = 0;

            indexToSelect = 0;
            for (c = 0; c < data.length; c++) {
                if (data[c].compiler == compilerType) {
                    addOptionToSelectionBox(data[c].version, compilerType + ":" + data[c].version, compilerSelectionBoxID);
                    if (data[c].version === "latest")
                        indexToSelect = compilerSelectionBoxObj.length - 1;
                }
            }
            $("#compilebtn")[0].disabled = false;
            //Select the latest as default
            compilerSelectionBoxObj.selectedIndex = indexToSelect;
        },
        "json" // The format the response should be in
    );
}

function setCompiler(language) {
    var vExamples;
    SELECTED_COMPILER = language;
    if (language === "csharp") {
        aceEditor.getSession().setMode("ace/mode/csharp");
        updateCompilersSelectionBox("docker-mono-neo-compiler");
        vExamples = cSharpFiles;
        //$("#cbx_example_name")[0].placeholder = "myexample.cs";
    }

    var exampleListUl = document.getElementById("ExampleList");

    exampleListUl.innerHTML = ""
    for (var e = 0; e < vExamples.length; e++) {
        var exampleToAdd = document.createElement("option");
        exampleToAdd.setAttribute('value', e);
        var onClickFunction = 'setExample("' + language + '","' + e + '");';
        exampleToAdd.setAttribute('onClick', onClickFunction)
        exampleToAdd.setAttribute('id', "loadedExample" + e);
        var cutSize = "/assets/sc_examples/" + language + "/";
        var exampleName = vExamples[e][0].slice(cutSize.length);
        exampleToAdd.appendChild(document.createTextNode(exampleName));
        exampleListUl.add(exampleToAdd);
    }

    //Checking all cookies
    USER_EXAMPLES.forEach(function(value, key) {
        addCSContractFromLocalMap(value, key, language);
    });
    if (USER_EXAMPLES.size == 0) {
        setExample(language, 0);
    } else {
        var firstMapKey = USER_EXAMPLES.entries().next().value[0];
        SetExampleFromCookies(firstMapKey);
    }
};

/*
 var dragging = false;
 var wpoffset = 0;    
 $('#dragbar').mousedown(function (e) {
     e.preventDefault();
     window.dragging = true;
     var smyles_editor = $('#aceEditor');
     var top_offset = smyles_editor.offset().top - wpoffset;
     // Set editor opacity to 0 to make transparent so our wrapper div shows
     smyles_editor.css('opacity', 0);
     // handle mouse movement
     $(document).mousemove(function (e) {
         var actualY = e.pageY - wpoffset;
         // editor height
         var eheight = actualY - top_offset;
         // Set wrapper height
         $('#smyles_editor_wrap').css('height', eheight);
         // Set dragbar opacity while dragging (set to 0 to not show)
         $('#dragbar').css('opacity', 0.15);
     });
 });

 $(document).mouseup(function (e) {
     if (window.dragging) {
         var smyles_editor = $('#aceEditor');
         var actualY = e.pageY - wpoffset;
         var top_offset = smyles_editor.offset().top - wpoffset;
         var eheight = actualY - top_offset;
         $(document).unbind('mousemove');
         // Set dragbar opacity back to 1
         $('#dragbar').css('opacity', 1);
         // Set height on actual editor element, and opacity back to 1
         smyles_editor.css('height', eheight).css('opacity', 1);
         // Trigger ace editor resize()
         aceEditor.resize();
         window.dragging = false;
     }
 });
 */

var aceEditor = createEditor("aceEditor", "ace/mode/csharp");
setCompiler("csharp");