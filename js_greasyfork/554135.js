// ==UserScript==
// @name         Press "L" to show ms Again.
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  Press "L" To show ms / latency again.
// @author       Voyager
// @match        *://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554135/Press%20%22L%22%20to%20show%20ms%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/554135/Press%20%22L%22%20to%20show%20ms%20Again.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let debugInfoEnabled = true;

    // !!!
    function toggleDebugInfo() {
        debugInfoEnabled = !debugInfoEnabled;
        input.set_convar("ren_latency", debugInfoEnabled);
    }

    // Here you can change the key to hide the updgrades. By default is the key "L". (Change the two event.key)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'l' || event.key === 'L') {
            toggleDebugInfo();
        }
    });
})();