// ==UserScript==
// @name        Hide follow items on facebook
// @namespace   Violentmonkey Scripts
// @match       https://www.facebook.com/
// @match       https://m.facebook.com/
// @grant       none
// @version     1.2.1
// @author      roYal
// @license     MIT
// @description 16/11/2025, 20:05:44
// @downloadURL https://update.greasyfork.org/scripts/555955/Hide%20follow%20items%20on%20facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/555955/Hide%20follow%20items%20on%20facebook.meta.js
// ==/UserScript==
(function () {
    // ===== CONFIG =====
	  const FOLLOW_WORDS = ["Join", "Follow", "Följ", "Gå med", "Förslag för dig", "Reels"];

    // Desktop card selector
    const DESKTOP_CARD_SELECTOR = ".x1lliihq";

    // Mobile card selector
    const MOBILE_CARD_SELECTOR = 'div[data-mcomponent="MContainer"][data-type="container"].m';

    // Selector for "Open App" bottom bar (mobile)
    const MOBILE_OPEN_APP_SELECTOR = 'div.m.fixed-container.bottom[data-mcomponent="MContainer"]';

    // ===== DEVICE DETECTION =====
    const isMobile = window.innerWidth < 700; // Facebook mobile layout threshold
    const CARD_SELECTOR = isMobile ? MOBILE_CARD_SELECTOR : DESKTOP_CARD_SELECTOR;


    // ===== FUNCTIONS =====
    function shouldHideByFollowText(card) {
        const spans = card.querySelectorAll("span");
        for (const span of spans) {
            if (FOLLOW_WORDS.includes(span.textContent.trim())) {
                return true;
            }
        }
        return false;
    }

    function hideCard(card) {
        if (!card || card.dataset.fbFiltered === "true") return;

        if (shouldHideByFollowText(card)) {
            card.style.display = "none";
            card.dataset.fbFiltered = "true";
        }
    }

    function removeOpenAppBar() {
        const bar = document.querySelector(MOBILE_OPEN_APP_SELECTOR);
        if (bar) bar.remove();
    }


    // ===== OBSERVER =====
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                // ===== Desktop or Mobile Card =====
                if (node.matches && node.matches(CARD_SELECTOR)) {
                    hideCard(node);
                }

                // Nested cards
                const cards = node.querySelectorAll ? node.querySelectorAll(CARD_SELECTOR) : [];
                cards.forEach(hideCard);

                // ===== Mobile: remove open app bar =====
                if (isMobile) removeOpenAppBar();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });


    // ===== INITIAL SCAN =====
    document.querySelectorAll(CARD_SELECTOR).forEach(hideCard);
    if (isMobile) removeOpenAppBar();
})();