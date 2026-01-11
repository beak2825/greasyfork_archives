// ==UserScript==
// @name        Mistral PWA
// @description Mistral PWA app
// @namespace   https://gitlab.com/breatfr
// @match       https://chat.mistral.ai/chat*
// @version     1.0.0
// @homepageURL https://gitlab.com/breatfr/mistral
// @supportURL  https://discord.gg/Q8KSHzdBxs
// @author      BreatFR
// @copyright   2025, BreatFR (https://breat.fr)
// @grant       none
// @icon        https://gitlab.com/uploads/-/system/project/avatar/65782442/mistral.png
// @license     AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/562207/Mistral%20PWA.user.js
// @updateURL https://update.greasyfork.org/scripts/562207/Mistral%20PWA.meta.js
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
    manifestLink.href = 'https://corsproxy.io/?url=https://gitlab.com/breatfr/mistral/-/raw/main/json/manifest.json';
    manifestLink.rel = 'manifest';

    manifestLink.onerror = function() {
        console.error("Failed to load the manifest file.");
    };

    document.head.appendChild(manifestLink);
    window.addEventListener('load', replaceTitle);

    setInterval(replaceTitle, 100);

    console.log("Manifest added and title replaced!");
})();
