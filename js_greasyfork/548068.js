// ==UserScript==
// @name         TorrentBD - Focus Shoutbox on Keypress
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Focuses on the shoutbox input field as soon as you start typing anywhere on the page.
// @author       SameCourage
// @match        https://www.torrentbd.net/*
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @copyright    2025, SameCourage
// @downloadURL https://update.greasyfork.org/scripts/548068/TorrentBD%20-%20Focus%20Shoutbox%20on%20Keypress.user.js
// @updateURL https://update.greasyfork.org/scripts/548068/TorrentBD%20-%20Focus%20Shoutbox%20on%20Keypress.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The ID of the input field you want to focus on.
    const targetInputId = 'shout_text';

    // This function finds the input field and sets focus to it.
    function setFocus() {
        const shoutboxInput = document.getElementById(targetInputId);
        // We only try to focus if the element exists and isn't already the active element.
        if (shoutboxInput && document.activeElement !== shoutboxInput) {
            shoutboxInput.focus();
        }
    }

    // --- Main Logic: Focus on any keypress ---
    document.addEventListener('keydown', () => {
        const activeEl = document.activeElement;

        // If the user is NOT currently typing in another input or textarea...
        if (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA') {
            // ... then focus the shoutbox instantly.
            setFocus();
        }
    });

})();

