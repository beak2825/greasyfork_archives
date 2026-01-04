// ==UserScript==
// @name         Google AI Studio - Non-Blocking Audio Recorder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Moves the audio recording dialog to the bottom right, removes the backdrop blur, and enables scrolling of the main content.
// @author       Carter Prince
// @license      MIT
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556702/Google%20AI%20Studio%20-%20Non-Blocking%20Audio%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/556702/Google%20AI%20Studio%20-%20Non-Blocking%20Audio%20Recorder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* 1. RE-ENABLE SCROLLING */
        /* Angular Material adds this class to the HTML tag to lock scroll. We override it. */
        html.cdk-global-scrollblock {
            position: static !important;
            width: auto !important;
            overflow: auto !important;
            top: auto !important;
        }

        /* 2. HIDE THE BACKDROP (BLUR) */
        /* Only hide backdrop if it contains the mic dialog, so we don't break other modals */
        .cdk-overlay-container:has(ms-mic-audio-dialog) .cdk-overlay-backdrop {
            display: none !important;
            pointer-events: none !important;
        }

        /* 3. POSITION THE MODAL */
        /* Target the pane specifically containing the mic dialog */
        .cdk-overlay-pane:has(ms-mic-audio-dialog) {
            position: fixed !important;
            top: auto !important;
            left: auto !important;
            bottom: 20px !important; /* Distance from bottom */
            right: 20px !important;  /* Distance from right */
            transform: none !important; /* Remove default centering transform */
            margin: 0 !important;

            /* Add a shadow since it floats over content now */
            box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
            border: 1px solid var(--color-v3-outline-var, #444) !important;
            border-radius: 12px !important;
            overflow: hidden !important;
        }

        /* 4. ENSURE CLICK-THROUGH */
        /* Make sure the container doesn't block clicks to the page */
        .cdk-overlay-container {
            pointer-events: none !important;
        }
        /* But allow clicks on the actual dialog */
        .cdk-overlay-pane {
            pointer-events: auto !important;
        }
    `;

    // Inject the CSS
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

})();