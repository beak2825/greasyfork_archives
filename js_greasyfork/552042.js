// ==UserScript==
// @name    Restore Muscle Memory
// @namespace   Violentmonkey Scripts
// @match   *://*.youtube.com/*
// @license mit
// @version     1.0
// @author      Bently21
// @description  Removes the MiniPlayer Button from youtube's right click menu on a video
// @downloadURL https://update.greasyfork.org/scripts/552042/Restore%20Muscle%20Memory.user.js
// @updateURL https://update.greasyfork.org/scripts/552042/Restore%20Muscle%20Memory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideMiniplayer() {
        const items = document.querySelectorAll('.ytp-menuitem');
        items.forEach(item => {
            const label = item.querySelector('.ytp-menuitem-label');
            if (label && label.textContent.includes('Miniplayer')) {
                item.style.display = 'none';
            }
        });
    }
    hideMiniplayer();
    const observer = new MutationObserver(hideMiniplayer);
    observer.observe(document.body, { childList: true, subtree: true });
})();