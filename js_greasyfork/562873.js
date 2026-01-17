// ==UserScript==
// @name         SharePoint Audio Resizer (Permanent)
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  Resizes audio tags to 100% of parent and keeps them always visible
// @author       You
// @match        https://*.sharepoint.com/*
// @match        https://*.officeapps.live.com/*
// @match        https://*.office.com/*
// @match        https://*.onedrive.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/562873/SharePoint%20Audio%20Resizer%20%28Permanent%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562873/SharePoint%20Audio%20Resizer%20%28Permanent%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

//     // 1. CSS: Structural layout only (No hiding/hover effects)
//     const css = `
//         audio {
//             /* Positioning: Sit directly on top of the icon */
//             position: absolute !important;
//             top: 0 !important;
//             left: 0 !important;

//             /* Sizing: Fill the container exactly */
//             width: 100% !important;
//             height: 100% !important;

//             /* Interaction: Ensure it is clickable */
//             z-index: 2147483647 !important;
//             cursor: pointer !important;
//             pointer-events: auto !important;

//             /* Visuals: Center the controls */
//             display: flex !important;
//             align-items: center !important;
//             justify-content: center !important;

//             /* Ensure it is visible immediately */
//             opacity: 1 !important;
//             visibility: visible !important;
//             background: rgba(255, 255, 255, 0.8); /* Optional: Slight background to cover the icon below */
//         }

//         /* Ensure the browser renders the controls */
//         audio[controls] {
//             display: flex !important;
//         }
//     `;

//     if (typeof GM_addStyle !== "undefined") {
//         GM_addStyle(css);
//     } else {
//         const style = document.createElement('style');
//         style.textContent = css;
//         document.head.appendChild(style);
//     }

    // 2. JS: Apply attributes and fix parent positioning
    function resizeAudio(audio) {
        if (audio.dataset.spFixed === "true") return;
        audio.dataset.spFixed = "true";

        // Force native controls
        audio.setAttribute('controls', 'controls');
        audio.setAttribute('controlsList', 'nodownload'); // Optional clean up

        audio.style.width = "92px";

        console.log('[Audio Fix] Permanently resized:', audio);
    }

    // 3. Continuous Scan
    setInterval(() => {
        document.querySelectorAll('audio').forEach(resizeAudio);
    }, 1000);

})();