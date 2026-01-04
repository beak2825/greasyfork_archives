// ==UserScript==
// @name         nohiddenlobbies.arras.js
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Expose hidden lobbies in the main menu
// @author       Eclipsia discord@cz_eclipsia
// @match        *://*.arras.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arras.io
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556801/nohiddenlobbiesarrasjs.user.js
// @updateURL https://update.greasyfork.org/scripts/556801/nohiddenlobbiesarrasjs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const windowFetch = window.fetch;
    
    window.fetch = async (req, options) => {
        const res = await windowFetch(req, options);

        if (res.url.endsWith("/status")) {
            const json = await (res.clone().json());
            for (const key of Object.keys(json.status)) {
                json.status[key].hidden = false;
            }
            res.json = async () => json;
        }
        return res;
    };
})();