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
var openedSessions = new Map();
openedSessions.set(-1, new ace.EditSession("mainSession"));
aceEditor.setSession(openedSessions.get(-1));

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

var Editor = Editor || {};

Editor = {
    tabs: 0,
    addNewTab: function() {
        var self = this;
        var addTab = document.getElementById('addTabIcon');
        var liElement = document.createElement('LI');
        liElement.setAttribute('role', 'presentation');

        // Delete element
        var iElement = document.createElement('SPAN');
        iElement.className = 'fa fa-times';
        iElement.id = this.tabs;
        iElement.addEventListener('click', function(event) {
            openedSessions.delete(iElement.id);
            self.deleteTab(iElement);
        }, false);
        // Delete element finished

        var anchorElement = document.createElement('A');
        anchorElement.href = "#";
        this.tabs++;
        anchorElement.appendChild(iElement);
        var textChild = document.createElement('SPAN');
        textChild.innerHTML = 'Code [' + this.tabs + ']&nbsp;&nbsp;';
        textChild.setAttribute('contenteditable', "true");
        textChild.addEventListener('click', function(event) {
            //console.log(openSessions);
            //console.log(iElement.id);
            aceEditor.setSession(openedSessions.get(iElement.id));
        }, false);

        anchorElement.insertBefore(textChild, iElement);
        liElement.appendChild(anchorElement);
        addTab.parentNode.insertBefore(liElement, addTab);

        openedSessions.set(iElement.id, new ace.EditSession(textChild.innerHTML));
    },
    deleteTab: function(tab) {
        while (tab.nodeName != 'LI') {
            tab = tab.parentNode;
        }
        tab.parentNode.removeChild(tab);
    }
};

$("span[contenteditable='true']").on("blur", function() {
    console.log("Teste");
    var value = $(this).text();
    var depth = $(this).parents("ul").length;

    console.log(depth, value);
});

function goToMainTab() {
    aceEditor.setSession(openedSessions.get(-1));
}