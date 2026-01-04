// ==UserScript==
// @name         Amazon Rufus Remover
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Completely removes Amazon's Rufus AI (sidebar, tooltips, product cards, errors, whitespace) – December 2025 edition
// @author       Talion
// @match        https://www.amazon.com/*
// @match        https://smile.amazon.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @supportURL   https://greasyfork.org/en/scripts/556942-amazon-rufus-remover/discuss
// @homepageURL  https://greasyfork.org/en/scripts/556942-amazon-rufus-remover
// @downloadURL https://update.greasyfork.org/scripts/556942/Amazon%20Rufus%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/556942/Amazon%20Rufus%20Remover.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const DEBUG = true;
    const log = (...args) => DEBUG && console.log('[RufusRemover v2.6]', ...args);

    const EXPLICIT = [
        '#nav-flyout-rufus','.rufus-panel-container','.rufus-view-filler',
        '.rufus-conversation-container','.rufus-container-peek-view',
        '.nav-rufus-content','.rufus-panel-closed-to-peek',
        '.overflow-menu-option-container-webapp',
        '#rufus-overflow-menu-option-container-auto-minimize',
        '#rufus-overflow-menu-option-container-faq',
        '.conversation-turn-container.rufus-initial-stream-container',
        '.rufus-teaser-cx-nav-tooltip','.rufus-sections-container',
        '#nav-rufus-disc-txt','.rufus-error-container-inner',
        '.rufus-error-text','.rufus-conversation-branding-update',
        '.rufus-container','.rufus-container-default-text-style',
        '#rufus-container','.rufus-container-main-view',
        '.rufus-error-container','#rufus-error-container',
        '.rufus-asin-faceout-footer','.rufus-loading-message-template',
        '.rufus-text-subsections-with-avatar-branding-update',
        '.rufus-loading-messages','.rufus-fade-in',
        '.rufus-visibility-hidden','.rufus-remove-section'
    ];

    const CATCH_ALL = '[class*="rufus"],[id*="rufus"],[data-csa-c-content-id*="rufus"],[data-csa-c-slot-id*="rufus"]';

    const removeRufus = () => {
        const selector = [...EXPLICIT, CATCH_ALL].join(', ');
        const els = document.querySelectorAll(selector);
        let removed = 0;
        els.forEach(el => {
            if (el && el.parentNode) {
                el.style.setProperty('display', 'none', 'important');
                el.remove();
                removed++;
            }
        });

        document.querySelectorAll('#search, .s-desktop-content, .s-main-slot, #mainResults, #resultsCol')
            .forEach(m => { if (m) { m.style.marginRight='0'; m.style.maxWidth='none'; m.style.width='100%'; } });

        if (removed) log(`Removed ${removed} Rufus elements`);
    };

    removeRufus();

    const observer = new MutationObserver(() => removeRufus());
    observer.observe(document, { childList: true, subtree: true, attributes: true, characterData: true });

    setInterval(removeRufus, 1000);

    log('Amazon Rufus Remover v2.6 loaded – Rufus is dead');
})();