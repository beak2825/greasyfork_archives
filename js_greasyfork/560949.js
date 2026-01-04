// ==UserScript==
// @name         Force Double-Click to Close (No Exceptions)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Closes tab on ANY double-click, overriding all selection and input behaviors
// @author       Jerry
// @match        *://*/*
// @exclude     http://192.168.1.2:1030/*
// @grant        window.close
// @run-at       document-start
// @homepage    https://greasyfork.org/en/scripts/560949

// @downloadURL https://update.greasyfork.org/scripts/560949/Force%20Double-Click%20to%20Close%20%28No%20Exceptions%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560949/Force%20Double-Click%20to%20Close%20%28No%20Exceptions%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('dblclick', function(e) {
        // 1. BLOCK EVERYTHING ELSE
        // Stop the browser from selecting text, zooming, or triggering button actions
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // 2. CLOSE IMMEDIATELY
        console.log("Force Close Triggered");
        window.close();
        
    }, true); // Capture phase (true) ensures we catch it before the page does

})();