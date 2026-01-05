// ==UserScript==
// @name        george_script.js
// @description  george_plus
// @namespace   akash-ted-allen/george_plus
// @version     1
// @match       http://www.student.cs.uwaterloo.ca/~se212/george-1/ask-george/george.cgi
// @match       https://www.student.cs.uwaterloo.ca/~se212/george-1/ask-george/george.cgi
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/6603/george_scriptjs.user.js
// @updateURL https://update.greasyfork.org/scripts/6603/george_scriptjs.meta.js
// ==/UserScript==


/**
 * Created by Akash Sant, Ted Ying, Allen Wang on 14-11-21.
 */
GM_addStyle('.ace_editor{height:300px;} textarea[name=input_script] {height:0px;width:0px;left:-100px;top:-100px;position:absolute;}');

function contentEval(source) {
    // Check for function input.
    if ('function' == typeof source) {
        // Execute this function with no arguments, by adding parentheses.
        // One set around the function, required for valid syntax, and a
        // second empty set calls the surrounded function.
        source = '(' + source + ')();'
    }

    // Create a script node holding this  source code.
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;

    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.
    document.body.appendChild(script);
    document.body.removeChild(script);
}
contentEval(function() {
    function loadScript(src, cb) {
        var scr = document.createElement('script');
        scr.src = src;
        scr.onload = cb;
        document.body.appendChild(scr);
    }
    var inputs = document.getElementsByTagName('input');
    var input_script = document.getElementsByName('input_script')[0];
    var getCurrentValue = function() {};
    for (var i = 0; i < inputs.length; ++i)
        inputs[i].addEventListener('click', function() {
            input_script.value = getCurrentValue();
        });
    var base = 'https://csclub.uwaterloo.ca/~t2ying/build/src/';
    var urls = [
        base + 'ace.js',
        base + 'ext-language_tools.js',
    ], loaded = 0;
    urls.map(function(url) {
        loadScript(url, function() {
            if (++loaded == urls.length)
                initialize();
        });
    });
    function initialize() {
        var textarea = document.createElement('textarea');
        textarea.innerHTML = input_script.innerHTML;
        input_script.parentNode.insertBefore(textarea, input_script);
        textarea.setAttribute('id', 'editor');
        var editor = ace.edit('editor');
        window.editor = editor;
        editor.setTheme('ace/theme/chrome');
        editor.setBehavioursEnabled(true);
        editor.getSession().setMode('ace/mode/george');
        getCurrentValue = function() {
            return editor.getValue();
        };
        editor.setOptions({
            enableBasicAutocompletion : true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

        var headingPlus = document.createElement('font');
        headingPlus.textContent = '\t+';
        headingPlus.style.fontFaceName = 'fantasy';
        headingPlus.style.color = '#000060';
        var parentHeading = document.getElementsByClassName('title')[0];
        parentHeading.appendChild(headingPlus);

        var loadFileButton = document.createElement('button');
        var deleteFileButton = document.createElement('button');
        loadFileButton.textContent = 'Load File';
        deleteFileButton.textContent = 'Delete File';
        //document.body.appendChild(loadFileButton);
        var parentGuest = document.getElementsByName('download_file_name')[0];
        document.getElementsByName('clear')[0].addEventListener('click', onClear);
        if (parentGuest.nextSibling) {
            parentGuest.parentNode.insertBefore(loadFileButton, parentGuest.nextSibling);
        } else {
            parentGuest.parentNode.appendChild(loadFileButton);
        }
        loadFileButton.addEventListener('click', onLoadSaved);
        parentGuest = document.getElementsByName('filename')[0];
        if (parentGuest.nextSibling) {
            parentGuest.parentNode.insertBefore(deleteFileButton, parentGuest.nextSibling);
        } else {
            parentGuest.parentNode.appendChild(deleteFileButton);
        }
        deleteFileButton.addEventListener('click', delete_saved);
        function save_george_progress () {
            if(typeof (Storage) !== "undefined") {
                localStorage.setItem(document.getElementsByName('download_file_name')[0].value,
                    editor.getValue());
            }
        }
        function getKey(){
            return document.getElementsByName("download_file_name")[0].value;
        }
        function delete_saved (e) {
            if (e && e.preventDefault)
                e.preventDefault();
            input_script.value = localStorage.getItem(getKey());
            localStorage.removeItem(getKey());

        }
        function onLoadSaved(e) {
            if (e && e.preventDefault)
                e.preventDefault();
            var code = localStorage.getItem(getKey());
            if (code !== null)
                setCode(code);
        }
        function onClear (e) {
            if (e && e.preventDefault)
                e.preventDefault();
            setCode('#u X\n\n#a X\n\n#q X\n\n');
        }
        function setCode(code) {
            input_script.value = code;
            editor.setValue(code);
        }
        document.getElementsByName('check')[0].addEventListener("click", save_george_progress);

    };
});