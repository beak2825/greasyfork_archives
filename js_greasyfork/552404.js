// ==UserScript==
// @name         Twitch Auto Theatre Mode
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Automatically enables theatre mode on twitch.tv when opening any channel
// @author       Khalil Rodriguez
// @license      MIT
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552404/Twitch%20Auto%20Theatre%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/552404/Twitch%20Auto%20Theatre%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selector = 'button[aria-label="Theatre Mode (alt+t)"]';
    let lastChannel = null;

    // Returns the channel name if on a channel's stream page, or null otherwise
    function getChannelName() {
        const match = location.pathname.match(/^\/([^\/]+)$/);
        return match ? match[1].toLowerCase() : null;
    }

    // Checks if theatre mode is currently active
    function isTheatreModeActive() {
        return document.body.classList.contains('theatre-mode');
    }

    // Enables theatre mode if not already enabled
    function enableTheatreMode() {
        if (!isTheatreModeActive()) {
            const btn = document.querySelector(selector);
            if (btn) btn.click();
        }
    }

    // Handles navigation: enables theatre mode on new channel, resets state on non-channel pages
    function handleRouteChange() {
        const channel = getChannelName();
        if (channel) {
            // If this is a new channel, enable theatre mode
            if (channel !== lastChannel) {
                lastChannel = channel;
                setTimeout(enableTheatreMode, 600);
            }
        } else {
            // If navigated to a non-channel page, reset lastChannel
            lastChannel = null;
        }
    }

    // SPA navigation: track any URL changes
    let oldHref = location.href;
    setInterval(() => {
        if (location.href !== oldHref) {
            oldHref = location.href;
            handleRouteChange();
        }
    }, 300);

    // Initial run on page load
    window.addEventListener('load', handleRouteChange);
})();
