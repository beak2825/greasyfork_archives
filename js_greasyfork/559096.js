// ==UserScript==
// @name         Hide Spotify Premium and Install Buttons
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Hides the "Explore Premium" and "Install App" buttons on the Spotify web player.
// @author       Ai
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559096/Hide%20Spotify%20Premium%20and%20Install%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/559096/Hide%20Spotify%20Premium%20and%20Install%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideUnwantedButtons() {
        const premiumButton = document.querySelector('[data-testid="upgrade-button"]');
        if (premiumButton) {
            premiumButton.style.display = 'none';
        }

        const installButton = document.querySelector('a[href="/download"]');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }

    const observer = new MutationObserver(() => {
        hideUnwantedButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    hideUnwantedButtons();
})();
