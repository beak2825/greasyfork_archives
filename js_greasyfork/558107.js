// ==UserScript==
// @name         YouTube - Hide Upcoming (Premiere) Videos in Subscriptions
// @namespace    https://github.com/yourname/youtube-hide-upcoming
// @version      1.2
// @description  Hides upcoming/premiere videos on YouTube's subscription feed
// @author       Grok
// @match        https://www.youtube.com/feed/subscriptions*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558107/YouTube%20-%20Hide%20Upcoming%20%28Premiere%29%20Videos%20in%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/558107/YouTube%20-%20Hide%20Upcoming%20%28Premiere%29%20Videos%20in%20Subscriptions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // The exact text inside the upcoming badge
    const UPCOMING_TEXT = 'Upcoming';

    // Selector for the badge that contains "Upcoming"
    const badgeSelector = `div.yt-badge-shape__text:contains("${UPCOMING_TEXT}")`;

    // More reliable way using MutationObserver (YouTube is a SPA and loads content dynamically)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer').forEach(item => {
                // Look inside this video thumbnail/item for the Upcoming badge
                if (item.querySelector(`div.badge-shape-wiz__text:contains("${UPCOMING_TEXT}")`) ||
                    item.querySelector(`yt-badge-shape-wiz span.yt-core-attributed-string:contains("${UPCOMING_TEXT}")`) ||
                    item.querySelector(`div.yt-badge-shape__text:contains("${UPCOMING_TEXT}")`)) {

                    // Hide the entire video card
                    item.style.display = 'none';

                    // Optional: completely remove from DOM (uncomment if you prefer)
                    // item.remove();
                }
            });
        });
    });

    // Start observing after the page is loaded enough
    function startObserving() {
        const target = document.querySelector('ytd-page-manager') || document.body;
        if (target) {
            observer.observe(target, {
                childList: true,
                subtree: true
            });

            // Also run once immediately in case content is already there
            setTimeout(() => {
                document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer').forEach(item => {
                    if (item.textContent.includes(UPCOMING_TEXT) &&
                        (item.querySelector('div.badge-shape-wiz__text') ||
                         item.querySelector('yt-badge-shape-wiz') ||
                         item.querySelector('div.yt-badge-shape__text'))) {
                        item.style.display = 'none';
                    }
                });
            }, 1000);
        } else {
            setTimeout(startObserving, 500);
        }
    }

    startObserving();

    // Clean up on navigation (YouTube uses history API)
    window.addEventListener('yt-navigate-finish', () => {
        // Run again after navigation
        setTimeout(() => {
            document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer').forEach(item => {
                if (item.textContent.includes(UPCOMING_TEXT)) {
                    item.style.display = 'none';
                }
            });
        }, 800);
    });

})();