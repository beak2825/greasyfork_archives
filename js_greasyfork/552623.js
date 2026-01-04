// ==UserScript==
// @name        YouTube Classic Live Chat Position
// @namespace   https://github.com/Amadeus-AI
// @description Bring back old layout of YouTube Live Chat
// @icon        https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @version     1.0.1
// @author      AmadeusAI
// @match       *://*.youtube.com/*
// @run-at      document-start
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/552623/YouTube%20Classic%20Live%20Chat%20Position.user.js
// @updateURL https://update.greasyfork.org/scripts/552623/YouTube%20Classic%20Live%20Chat%20Position.meta.js
// ==/UserScript==

(function() {
    let tries = 0;
    const maxTries = 10;
    const intervalTime = 42; // ms

    const tryRestore = () => {
        if (window.yt?.config_?.EXPERIMENT_FLAGS) {
            const flags = window.yt.config_.EXPERIMENT_FLAGS;
            flags.web_watch_enable_fs_squeezeback_panels = false
            flags.web_watch_theater_chat = false
        }
        if (++tries >= maxTries) clearInterval(timer);
    };

    const timer = setInterval(tryRestore, intervalTime);
})();