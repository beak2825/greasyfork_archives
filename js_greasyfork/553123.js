// ==UserScript==
// @name         Stake.com Popout Button Disabler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  disables and visuall hides the popout miniplayer button to avoid misclicks
// @author        jayfantz
// @match https://stake.com/*
// @match https://*.stake.com/*
// @match https://stake.us/*
// @match https://*.stake.us/*
// @match https://stake.*/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/553123/Stakecom%20Popout%20Button%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/553123/Stakecom%20Popout%20Button%20Disabler.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const nukeButton = () => {
        const btn = document.querySelector(
            '#main-content .mini-player button[data-button-root]'
        );
        if (btn) {
            btn.disabled = true;           // disable interaction
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.3';     // dim (optional)
            btn.remove();                  // remove from DOM
            console.log('Mini-player popout removed');
            clearInterval(kill);
        }
    };

    const kill = setInterval(nukeButton, 300);
})();
