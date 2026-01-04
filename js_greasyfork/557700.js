// ==UserScript==
// @name         Highlight JS
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Loads the ace code editor when going to a .js file
// @author       pooiod7
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @match        *://*/*.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557700/Highlight%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/557700/Highlight%20JS.meta.js
// ==/UserScript==

(function() {
    if (!document.body) return;
    fetch(window.location.href).then(r => r.text()).then(t => {
        let trimmed = t.trim().toLowerCase();
        if (trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html')) return;
        document.body.style.margin = '0';
        document.body.innerHTML = '<div id="editor" style="height:100vh;width:100vw;"></div>';
        let script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.15.2/ace.js';
        script.onload = () => {
            let editor = ace.edit("editor");
            editor.session.setMode("ace/mode/javascript");
            editor.setShowPrintMargin(false);
            editor.setHighlightActiveLine(false);
            let darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            editor.setTheme(darkMode ? "ace/theme/monokai" : "ace/theme/tomorrow");
            editor.setValue(t, -1);
        };
        document.body.appendChild(script);
    });
})();
