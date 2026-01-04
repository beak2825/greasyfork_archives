// ==UserScript==
// @name         Enable Copy Paste and Right Click
// @namespace    https://greasyfork.org/en/users/1461725-scriptninja
// @version      1.0.0
// @description  This script forcefully removes all JavaScript restrictions to enable text selection, copy-paste (Ctrl+C, Ctrl+V), and right-click (context menu) on restrictive websites.
// @author       ScriptNinja
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554609/Enable%20Copy%20Paste%20and%20Right%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/554609/Enable%20Copy%20Paste%20and%20Right%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Function to clear event listeners and attributes
    function clearEventListeners() {
        // Clear common event handlers on document
        document.oncontextmenu = null;
        document.oncopy = null;
        document.oncut = null;
        document.onpaste = null;
        document.onselectstart = null;
        document.onkeydown = null;

        // Clear event handlers on body (if body exists)
        if (document.body) {
            document.body.oncontextmenu = null;
            document.body.oncopy = null;
            document.body.oncut = null;
            document.body.onpaste = null;
            document.body.onselectstart = null;
            document.body.removeAttribute('oncopy');
            document.body.removeAttribute('onselectstart');
            document.body.removeAttribute('oncontextmenu');
        }

        // 2. Force default action (allow) on events during the Capturing Phase
        var allowAction = function(e){
            e.stopImmediatePropagation();
            return true;
        };

        // Add event listeners to override restrictions
        document.addEventListener('contextmenu', allowAction, true);
        document.addEventListener('copy', allowAction, true);
        document.addEventListener('paste', allowAction, true);
        document.addEventListener('cut', allowAction, true);
        document.addEventListener('selectstart', allowAction, true);
        document.addEventListener('keydown', allowAction, true);

        // 3. Override CSS property `user-select: none` using !important
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '* { -webkit-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important; user-select: text !important; }';
        if (document.head) {
            document.head.appendChild(style);
        }
    }

    // Run immediately before the page loads any other scripts (@run-at document-start)
    clearEventListeners();

    // Run again after the page loads and multiple times with a delay to catch late-loading scripts
    window.addEventListener('load', clearEventListeners);
    setTimeout(clearEventListeners, 1000);
    setTimeout(clearEventListeners, 3000);
    setTimeout(clearEventListeners, 5000);
})();