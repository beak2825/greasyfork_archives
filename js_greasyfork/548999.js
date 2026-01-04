// ==UserScript==
// @name         Hide Watched Videos on Xhamster
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides watched videos on xHamster and adds a toggle button to turn this feature on/off. Saves state to cookies.
// @author       Your Name
// @match        *://*.xhamster.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548999/Hide%20Watched%20Videos%20on%20Xhamster.user.js
// @updateURL https://update.greasyfork.org/scripts/548999/Hide%20Watched%20Videos%20on%20Xhamster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create floating toggle button
    const button = document.createElement('button');
    button.textContent = 'Watched On';
    button.style.position = 'fixed';
    button.style.top = '60px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#FF5722';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    document.body.appendChild(button);

    // Helper functions for working with cookies
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) return value;
        }
        return null;
    }

    // Initialize state from cookies or default
    let hideWatched = getCookie('hideWatched') === 'true';

    // Update button text based on state
    function updateButtonText() {
        button.textContent = hideWatched ? 'Watched On' : 'Watched Off';
    }

    // Function to hide/show watched videos
    function toggleWatchedVideos() {
        const videoCards = document.querySelectorAll('div.thumb-list__item.video-thumb.video-thumb--type-video');
        videoCards.forEach((card) => {
            const watchedBadge = card.querySelector('div.thumb-image-container__watched');
            const liveBadge = card.querySelector('div.live-badge');
            if (watchedBadge || liveBadge) {
                card.style.display = hideWatched ? '' : 'none';
            }

            const premiumBadge = card.querySelector('div.badge.badge_premium');
            if (premiumBadge) {
                card.style.display = 'none';
            }
        });

        //const liveCards = document.querySelectorAll('div.SdR-nLqiwcam-thumb SdR-nLqiwcam-thumb--lv-red SdR-nLqiwcam-thumb__look-like-item video-thumb');
        //liveCards.forEach((card) => {
        //    const liveBadge = card.querySelector('div.live-badge');
        //    if (liveBadge) {
        //        card.style.display = hideWatched ? '' : 'none';
        //    }
        //})

        const liveBlock = document.querySelector('div.SdR-nLqiwright-rectangle SdR-nLqiwright-rectangle--video SdR-nLqiw SdR-nLqiwno-ts-init');
        if (liveBlock) {
            liveBlock.style.display = hideWatched ? '' : 'none';
            liveBlock.style.height = hideWatched ? '' : 0;
        }
    }

    // Add click event to the button
    button.addEventListener('click', () => {
        hideWatched = !hideWatched;
        setCookie('hideWatched', hideWatched, 30); // Save state for 30 days
        updateButtonText();
        toggleWatchedVideos();
    });

    // Initial setup
    updateButtonText();
    toggleWatchedVideos();

    // Observe changes to dynamically loaded content
    const observer = new MutationObserver(() => {
        toggleWatchedVideos();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
