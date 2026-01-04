// ==UserScript==
// @name         GGn - Centered Add Torrent Link
// @version      1.0
// @description  Adds a horizontally centered "Add torrent" link in the Game Title row
// @author       stormlight
// @match        https://gazellegames.net/torrents.php?id=*
// @grant        none
// @run-at       document-end
// @namespace https://github.com/yourusername/tampermonkey-scripts
// @downloadURL https://update.greasyfork.org/scripts/555576/GGn%20-%20Centered%20Add%20Torrent%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/555576/GGn%20-%20Centered%20Add%20Torrent%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getGroupIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    function addTorrentLink() {
        const displayNameElement = document.getElementById('display_name');

        if (!displayNameElement) return;

        if (displayNameElement.querySelector('a[href*="upload.php?groupid="]')) return;

        const groupId = getGroupIdFromUrl();
        if (!groupId) return;

        const addTorrentLink = document.createElement('a');
        addTorrentLink.href = `upload.php?groupid=${groupId}`;
        addTorrentLink.textContent = '[Add torrent]';

        // **Only** positioning styles and site color variable
        addTorrentLink.style.position = 'absolute';
        addTorrentLink.style.left = '50%';
        addTorrentLink.style.transform = 'translateX(-50%)';
        addTorrentLink.style.fontSize = 'inherit';
        addTorrentLink.style.color = 'var(--lightBlue)';
        addTorrentLink.style.textDecoration = 'inherit';

        // Ensure h2 is a positioning container
        const currentPosition = window.getComputedStyle(displayNameElement).position;
        if (currentPosition === 'static') {
            displayNameElement.style.position = 'relative';
        }

        displayNameElement.appendChild(addTorrentLink);
    }

    function waitForElement() {
        if (document.getElementById('display_name')) {
            addTorrentLink();
        } else {
            setTimeout(waitForElement, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElement);
    } else {
        waitForElement();
    }
})();