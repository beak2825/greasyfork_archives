// ==UserScript==
// @name         YouTube live chat move poll window to the top
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Moves the poll window to the top so the recent chat is visible
// @author       yclee126
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562838/YouTube%20live%20chat%20move%20poll%20window%20to%20the%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/562838/YouTube%20live%20chat%20move%20poll%20window%20to%20the%20top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const movePoll = () => {
        const actionPanel = document.querySelector('#action-panel.yt-live-chat-renderer');

        if (actionPanel) {
            // move chat window to the top
            actionPanel.style.setProperty('bottom', 'auto');
            actionPanel.style.setProperty('top', '0');
            actionPanel.style.setProperty('padding-top', '8px');

            // remove the white background
            actionPanel.style.setProperty('background', 'none');
            actionPanel.style.setProperty('background-color', 'transparent');
        }
    };

    // Use MutationObserver to handle dynamic loading of the chat interface
    const observer = new MutationObserver((mutations) => {
        movePoll();
    });

    // Start observing the body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial call
    movePoll();
})();