// ==UserScript==
// @name         YouTube Music Remove from Playlist with D
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Press "D" to open 3-dot menu and click "Remove from playlist" on YouTube Music
// @author       You
// @match        https://music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549776/YouTube%20Music%20Remove%20from%20Playlist%20with%20D.user.js
// @updateURL https://update.greasyfork.org/scripts/549776/YouTube%20Music%20Remove%20from%20Playlist%20with%20D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function openAndRemove() {
        // Find and click the Action menu button in the player bar
        const menuButton = document.querySelector(
            'ytmusic-player-bar ytmusic-menu-renderer button[aria-label="Action menu"]'
        );

        if (!menuButton) {
            console.log("Menu button not found.");
            return;
        }

        console.log("Opening Action menu...");
        menuButton.click();

        // Wait a bit for the popup menu to render, then click "Remove from playlist"
        setTimeout(() => {
            const items = document.querySelectorAll("ytmusic-menu-service-item-renderer");
            let removed = false;
            items.forEach(item => {
                if (item.innerText.trim().toLowerCase() === "remove from playlist") {
                    console.log("Clicking 'Remove from playlist'...");
                    item.click();
                    removed = true;
                }
            });
            if (!removed) {
                console.log("'Remove from playlist' not found.");
            }
        }, 300); // delay to allow the menu to appear
    }

    document.addEventListener("keydown", function(e) {
        // Trigger on "D" key (not while typing in input/textarea)
        if (e.key.toLowerCase() === "d" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
            e.preventDefault();
            openAndRemove();
        }
    });
})();
