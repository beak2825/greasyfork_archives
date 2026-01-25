// ==UserScript==
// @name        Mistral Chat PWA
// @description Install Mistral Chat as a standalone app
// @version     1.0.1
// @match       https://chat.mistral.ai/chat*
// @namespace   https://breat.fr
// @homepageURL https://usercssjs.breat.fr/m/mistral-chat
// @supportURL  https://discord.gg/Q8KSHzdBxs
// @author      BreatFR
// @copyright   2025, BreatFR (https://breat.fr)
// @icon        https://breat.fr/static/images/userscripts-et-userstyles/m/mistral-chat/icon.png
// @license     AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/562207/Mistral%20Chat%20PWA.user.js
// @updateURL https://update.greasyfork.org/scripts/562207/Mistral%20Chat%20PWA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace title
    function replaceTitle() {
        if  (window.matchMedia('(display-mode: standalone)').matches) {
            document.title  =  "Mistral AI";
        }
    }

    // Add manifest
    const manifestLink = document.createElement('link');
    manifestLink.crossorigin = 'anonymous';
    manifestLink.href = 'https://code.breat.fr/m/mistral-chat/json/manifest.json';
    manifestLink.rel = 'manifest';

    manifestLink.onerror = function() {
        console.error("Failed to load the manifest file.");
    };

    document.head.appendChild(manifestLink);
    window.addEventListener('load', replaceTitle);

    setInterval(replaceTitle, 100);

    console.log("Manifest added and title replaced!");
})();
