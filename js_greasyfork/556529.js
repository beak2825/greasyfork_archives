// ==UserScript==
// @name         Pants
// @namespace    plum.husky
// @version      1.1
// @description  Deletes Shorts from YouTube *search* results only
// @license      MIT
// @match        https://www.youtube.com/results*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556529/Pants.user.js
// @updateURL https://update.greasyfork.org/scripts/556529/Pants.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeShorts() {
        const videos = document.querySelectorAll("ytd-video-renderer");

        videos.forEach(v => {
            const link = v.querySelector("a#thumbnail, a#video-title");
            if (!link) return;

            const href = link.getAttribute("href") || "";

            // Shorts always use /shorts/ID
            if (href.startsWith("/shorts/")) {
                v.remove();
            }
        });
    }

    // initial run
    removeShorts();

    // dynamic page updates (YouTube SPA behavior)
    const obs = new MutationObserver(removeShorts);
    obs.observe(document.body, { childList: true, subtree: true });
})();
