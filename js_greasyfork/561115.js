// ==UserScript==
// @name         TikTok Live Auto Like and Comment
// @namespace    http://tampermonkey.net/
// @version      2026-01-02-1
// @description  Automatically clicks the like button.
// @author       Maya329
// @match        *://*.tiktok.com/*/live*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561115/TikTok%20Live%20Auto%20Like%20and%20Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/561115/TikTok%20Live%20Auto%20Like%20and%20Comment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const totalClicks = 500; // Total number of likes to send
    const clickInterval = 50; // Interval between clicks in milliseconds
    const cooldownTime = 15000; // Cooldown time in milliseconds (15 seconds)
    const params = new URLSearchParams(window.location.search); // Get the URL
    const tapto = params.get('tapto'); // Get the taptop query string

    let currentClicks = 0; // Track the number of likes clicked

    function clickLikeButton() {
        // Selector for the like button with escaped brackets

        const likeButton = document.querySelector('.w-\\[38px\\].h-\\[38px\\].rounded-full.flex.justify-center.items-center.bg-UIShapeNeutral4.cursor-pointer');

        if (likeButton && currentClicks < totalClicks) {
            likeButton.click();
            console.log('liked!');
            currentClicks++;

            // Continue clicking until total clicks are reached
            setTimeout(clickLikeButton, clickInterval);
        } else if (currentClicks >= totalClicks) {
            console.log("Reached 500 likes, cooling down for 15 seconds...");
            setTimeout(() => {
                currentClicks = 0; // Reset click count after cooldown
                const likeNumber = getLikeNumber();
                if (likeNumber >= tapto) {
                    console.log('Threshold reached (>= '+tapto+'). Not tapping like anymore...');
                } else {
                    clickLikeButton(); // Start clicking again
                }
            }, cooldownTime);
        } else {
            console.log("Like button not found.");
        }
    }

    function getLikeNumber() {
        const likesAmountSelector = '#tiktok-live-main-container-id > div.bg-UIPageFlat1.tiktok-q76ycn.eayczbk0 > div.tiktok-i9gxme.eayczbk1 > div > div.css-112zjc7.relative.overflow-x-hidden.overflow-auto.p-12 > div.min-h-\\[540px\\].overflow-hidden.flex.flex-col.rounded-2xl > div:nth-child(1) > div > div.relative.h-\\[36px\\].bg-UIImageOverlayBlackA25.hover\\:bg-UIShapeNeutral4.pe-\\[4px\\].rounded-\\[40px\\] > div > div > div.flex.flex-col.overflow-hidden > div.flex.items-center.h-\\[14px\\] > div > p';
        const el = document.querySelector(likesAmountSelector);

        if (!el) {
            console.warn('Element not found');
            return;
        } else {
            const text = el.innerHTML.trim();
            const number = parseAbbreviatedNumber(text);

            console.log(`[${new Date().toLocaleTimeString()}] Number:`, number);
            return number;
        }
    }

    function parseAbbreviatedNumber(value) {
        if (!value) return 0;
        const str = value.toString().trim().toLowerCase();

        // remove commas
        const clean = str.replace(/,/g, '');

        // match number + optional suffix
        const match = clean.match(/^([\d.]+)([km])?$/);

        if (!match) return NaN;

        const number = parseFloat(match[1]);
        const suffix = match[2];

        if (suffix === 'k') return Math.round(number * 1_000);
        if (suffix === 'm') return Math.round(number * 1_000_000);

        return Math.round(number);
    }

    // Start the like button clicking and comment loops after a short delay to allow the page to load
    setTimeout(() => {
        const likeNumber = getLikeNumber();
        if (likeNumber >= tapto) {
            console.log('Threshold reached (>= '+tapto+'). Not tapping like anymore...');
        } else {
            clickLikeButton();
        }
    }, 5000); // Wait 5 seconds before starting
})();