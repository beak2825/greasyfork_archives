// ==UserScript==
// @name         OnlyFans Free Subscriptions Filter (All Free Types)
// @namespace    https://onlyfans.com/
// @version      1.4.2
// @description  Hide all non-free subscription cards on OnlyFans expired subscriptions page, keeping any type of "free" cards
// @author       Gemini 3 Pro (previously ChatGPT 5.2 Thinking)
// @icon         https://static2.onlyfans.com/static/prod/f/202512181451-75a62e2193/icons/favicon-32x32.png
// @match        https://onlyfans.com/my/collections/user-lists/subscriptions/expired?paid=0
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549066/OnlyFans%20Free%20Subscriptions%20Filter%20%28All%20Free%20Types%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549066/OnlyFans%20Free%20Subscriptions%20Filter%20%28All%20Free%20Types%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if a button contains the word "free" (any case)
    function isFreeCard(btn) {
        if (!btn) return false;
        const textSpans = btn.querySelectorAll('span');
        for (const span of textSpans) {
            if (span.textContent.toLowerCase().includes('free')) return true;
        }
        return false;
    }

    // Hide card if it is not a free card
    function filterCard(card) {
        const btn = card.querySelector('div.m-rounded.m-flex.m-space-between.m-lg.g-btn[role="button"]');
        if (!isFreeCard(btn)) {
            card.style.display = 'none';
        } else {
            card.style.display = '';
        }
    }

    // Filter all cards on the page
    function filterAllCards() {
        document.querySelectorAll('.b-users__item.m-subscriptions.m-model-card, .b-offer-join__btn').forEach(filterCard);
    }

    // Run immediately on script load
    filterAllCards();

    // Observe dynamically loaded cards in the scrollable list
    const scroller = document.querySelector('.vue-recycle-scroller');
    if (scroller) {
        const observer = new MutationObserver(() => filterAllCards());
        observer.observe(scroller, { childList: true, subtree: true });
    }

    // Extra check for dynamically loaded content every 2 seconds
    setInterval(filterAllCards, 2000);
})();