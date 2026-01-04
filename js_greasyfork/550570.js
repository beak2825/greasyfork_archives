// ==UserScript==
// @name         CircleFTP Fix Tab And Movie Titles
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Update tab and movie titles correctly on CircleFTP
// @author       BlazeFTL
// @license      MIT
// @match        *://new.circleftp.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/550570/CircleFTP%20Fix%20Tab%20And%20Movie%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/550570/CircleFTP%20Fix%20Tab%20And%20Movie%20Titles.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Style Fix ---
    const styleFix = `
    .SinglePost_singlePost_text__TQn9G {
        position: static !important;
        opacity: 1 !important;
        visibility: visible !important;
        background: transparent !important;
        display: block !important;
        pointer-events: auto !important;
        margin-top: 10px !important;
    }

    .SinglePost_singlePost_card__MLfCk .overflow-hidden {
        flex-direction: column !important;
        align-items: center !important;
    }
    `;
    if (typeof GM_addStyle !== "undefined") GM_addStyle(styleFix);
    else document.head.appendChild(Object.assign(document.createElement('style'), { textContent: styleFix }));

    // --- Update Titles ---
    function updateTitles() {
        // --- Tab title ---
        let pageTitle = '';
        const h2 = document.querySelector('h2.text-white.text-bolder'); // single movie page
        if (h2 && h2.textContent.trim()) pageTitle = h2.textContent.trim();

        const searchH1 = document.querySelector('main h1.text-light.text-center.my-3.bg-dark.py-1'); // search page
        if (searchH1 && searchH1.textContent.trim()) pageTitle = searchH1.textContent.trim();

        if (pageTitle && document.title !== pageTitle) document.title = pageTitle;

        // --- Replace all visible card titles with full title attribute ---
        document.querySelectorAll('.SinglePost_singlePost_card__MLfCk').forEach(card => {
            if (card.dataset.titleUpdated) return;
            const fullTitle = card.getAttribute('title');
            if (!fullTitle) return;
            const textDiv = card.querySelector('.SinglePost_singlePost_text__TQn9G h3');
            if (textDiv) textDiv.textContent = fullTitle.trim();
            card.dataset.titleUpdated = 'true';
        });
    }

    // --- Run after load and on DOM changes (debounced) ---
    window.addEventListener('load', updateTitles);

    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateTitles, 250);
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();