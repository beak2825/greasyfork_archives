// ==UserScript==
// @name         Emote Spam P Toggle
// @namespace    http://tampermonkey.net/
// @version      10
// @description  Emote spam toggle with P key
// @author       Skibidi Tosion
// @match        https://evoworld.io/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551452/Emote%20Spam%20P%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/551452/Emote%20Spam%20P%20Toggle.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function waitForServer() {
        if (typeof game !== 'undefined' && game.canvas) {
            initEmoteSpamToggleKey();
        } else {
            setTimeout(waitForServer, 500);
        }
    }

    function initEmoteSpamToggleKey() {
        let emoteSpamEnabled = false;
        let emoteSpamInterval;

        function startEmoteSpam() {
            emoteSpamInterval = setInterval(() => {
                if (typeof gameServer !== 'undefined' && !imDead && joinedGame) {
                    const randomEmoteId = Math.floor(Math.random() * 13) + 1;
                    sendEmote(randomEmoteId);
                }
            }, 1000);
        }

        function stopEmoteSpam() {
            clearInterval(emoteSpamInterval);
        }

        // Listen for P key press
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'p') {
                emoteSpamEnabled = !emoteSpamEnabled;
                if (emoteSpamEnabled) {
                    startEmoteSpam();
                    console.log("Emote spam: ON");
                } else {
                    stopEmoteSpam();
                    console.log("Emote spam: OFF");
                }
            }
        });
    }

    waitForServer();
})();