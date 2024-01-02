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
    editor.setFontSize(18);
    editor.commands.addCommand({
        name: "showKeyboardShortcuts",
        bindKey: {
            win: "Ctrl-Alt-h",
            mac: "Command-Alt-h"
        },
        exec: function (editor) {
            ace.config.loadModule("ace/ext/keybinding_menu", function (module) {
                module.init(editor);
                //editor.showKeyboardShortcuts() just shows when tigger the hotkey
            })
        }
    })
    return editor
}

function removeBoldFromCurrentTabs() {
    $("#mainTabAceEditor")[0].style.fontWeight = 'normal';
    /*
    for (t = 0; t < Editor.tabs; t++) {
        var nameToClick = "#textChildAce" + t;
        $(nameToClick)[0].style.fontWeight = 'normal';
    }*/
    for (var [key, value] of openedSessions)
        if (key != -1) {
            var nameToClick = "#textChildAce" + key;
            $(nameToClick)[0].style.fontWeight = 'normal';
        }
}

function cleanAllSessionsInsteadOfMain(){
    for (var [key, value] of openedSessions)
    if (key != -1) {
        var iElementToDeleteName = "#tabElementAce" + key;
        Editor.deleteTab($(iElementToDeleteName)[0]);
        openedSessions.delete(key);
    }
    Editor.tabs = 0;
    goToACEMainTab();
}

function goToACEMainTab() {
    aceEditor.setSession(openedSessions.get(-1));

    //Mark current as bold
    removeBoldFromCurrentTabs();
    $("#mainTabAceEditor")[0].style.fontWeight = 'bold';
}

var Editor = Editor || {};

Editor = {
    tabs: 0,
    addNewTab: function (text = "") {
        var modeToSet = "ace/mode/csharp";
        var self = this;
        var addTab = document.getElementById('addTabIcon');
        var liElement = document.createElement('LI');
        liElement.setAttribute('role', 'presentation');

        // Delete element
        var iElement = document.createElement('SPAN');
        iElement.className = 'fa fa-times';
        iElement.id = "tabElementAce" + this.tabs;
        iElement.name = this.tabs;
        iElement.addEventListener('click', function (event) {
            openedSessions.delete(Number(iElement.name));
            self.deleteTab(iElement);
            goToACEMainTab();
        }, false);
        // Delete element finished

        var anchorElement = document.createElement('A');
        // commented because it was changing tab
        //anchorElement.href = "#nav-compilers/";
        anchorElement.appendChild(iElement);
        anchorElement.href = "#nav-compilers/";
        var textChild = document.createElement('SPAN');
        var fileType = ".cs";
        if ($("#codesend_selected_compiler")[0].value === "Python") {
            fileType = ".py"
            modeToSet = "ace/mode/python"
        }

        if (text === "")
            textChild.innerHTML = 'Code' + this.tabs + fileType + ' ';
        else
            textChild.innerHTML = text;
        textChild.setAttribute('contenteditable', "true");
        textChild.id = "textChildAce" + this.tabs;
        textChild.addEventListener('click', function (event) {
            aceEditor.setSession(openedSessions.get(Number(iElement.name)));

            //Mark current as bold
            removeBoldFromCurrentTabs();
            $(this)[0].style.fontWeight = 'bold';
        }, false);
        jQuery(textChild).bind('dragover drop', function (event) {
            event.preventDefault();
            return false;
        });
        // Do not allow input value for tab name
        textChild.addEventListener("input", function () {
            if ($(this).text() === "")
                $(this)[0].innerHTML = "Not.Empty";
        }, false);

        this.tabs++;
        anchorElement.insertBefore(textChild, iElement);
        liElement.appendChild(anchorElement);
        addTab.parentNode.insertBefore(liElement, addTab);

        var initialCode = textChild.innerHTML;
        if (text != "")
            initialCode = '';
        var newAceSession = new ace.EditSession(initialCode);
        newAceSession.setMode(modeToSet);
        openedSessions.set(Number(iElement.name), newAceSession);
    },
    deleteTab: function (tab) {
        while (tab.nodeName != 'LI') {
            tab = tab.parentNode;
        }
        tab.parentNode.removeChild(tab);
    }
};

/*
$("span[contenteditable='true']").on("blur", function () {
    var value = $(this).text();
    console.log(value)
    var depth = $(this).parents("ul").length;
});*/

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




/*
var js = new ace.EditSession(`function foo(items) {
    var x = "All this is syntax highlighted";
    return x;
}`);
js.setMode('ace/mode/javascript');
var css = new ace.EditSession(`.blue {
  color: blue;
}`);
css.setMode('ace/mode/css');
var template = new ace.EditSession(`{{#each records as |record|}}
{{/each}}`);
template.setMode('ace/mode/handlebars');

aceEditor.setTheme("ace/theme/dracula");
aceEditor.setSession(js);
*/


/*
const codeTab = document.getElementById('edit-js');
const cssTab = document.getElementById('edit-css');
const handlebarsTab = document.getElementById('edit-handlebars');

const selectTab = function(tabId) {
    const lastSelectedTab = document.getElementsByClassName('editor-tab--active');
    for (let i = 0; i < lastSelectedTab.length; i += 1) {
        lastSelectedTab[i].classList.remove('editor-tab--active');
    }
    const tab = document.getElementById(tabId);
    tab.classList.add('editor-tab--active');
}*/

/*
codeTab.addEventListener('click', () => {
    selectTab('edit-js');
    aceEditor.setSession(js);
});
cssTab.addEventListener('click', () => {
    selectTab('edit-css');
    aceEditor.setSession(css);
});
handlebarsTab.addEventListener('click', () => {
    selectTab('edit-handlebars');
    aceEditor.setSession(template);
});*/