// ==UserScript==
// @name         Steam Greenlight
// @name:sq      Steam Greenlight
// @description:sq Hiq modalin që tregon se Greenlight është tërhequr nga funksioni.
// @namespace    http://tampermonkey.net/
// @version      2025-10-23
// @description  Remove modal showing Greenlight retired
// @author       Marko2155
// @match        https://steamcommunity.com/greenlight/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=partner.steamgames.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553406/Steam%20Greenlight.user.js
// @updateURL https://update.greasyfork.org/scripts/553406/Steam%20Greenlight.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Helper function to remove the banner
    function removeBanner() {
        document.querySelectorAll('#greenlight_retired_modal, .greenlight_notice, .newmodal_background').forEach(el => {
           el.remove();
        });
    }

    // Observe changes and remove the banner the moment it appears
    const observer = new MutationObserver(() => removeBanner());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Also attempt removal on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', removeBanner);
})();