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