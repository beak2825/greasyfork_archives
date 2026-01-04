// ==UserScript==
// @name         YouTube always show Transcript
// @description  Always show the Transcript in YouTube.
// @author       denis hebert
// @license      GNU AGPL-3.0-or-later
// @version      2025-09-28.5
// @namespace    denisHebert.uTube
// @match        https://*.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/550936/YouTube%20always%20show%20Transcript.user.js
// @updateURL https://update.greasyfork.org/scripts/550936/YouTube%20always%20show%20Transcript.meta.js
// ==/UserScript==
(() => {
    'use strict';
     new MutationObserver( e =>
        ( e = document.querySelector('[target-id="engagement-panel-searchable-transcript"]') )
        && e.visibility === "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"
        && (e.visibility = "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED")
    ).observe( document.body, {childList: true, subtree: true} );
 })();