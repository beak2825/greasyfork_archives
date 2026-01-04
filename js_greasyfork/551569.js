// ==UserScript==
// @name         Keep Perplexity model as Claude Sonnet 4.5 + Reasoning
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Enforce Claude Sonnet 4.5 + Reasoning as the model
// @author       Steve Chambers
// @license      MIT
// @match        https://www.perplexity.ai/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551569/Keep%20Perplexity%20model%20as%20Claude%20Sonnet%2045%20%2B%20Reasoning.user.js
// @updateURL https://update.greasyfork.org/scripts/551569/Keep%20Perplexity%20model%20as%20Claude%20Sonnet%2045%20%2B%20Reasoning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'pplx.local-user-settings.preferredSearchModels';
    const PREFERRED_MODEL = 'claude45sonnetthinking';
    let hasRun = false;

    // Always set localStorage at the earliest opportunity.
    setLocalStoragePreference();

    function setLocalStoragePreference() {
        try {
            const currentValue = localStorage.getItem(STORAGE_KEY);
            const parsed = currentValue ? JSON.parse(currentValue) : {};
            if (parsed.search !== PREFERRED_MODEL) {
                parsed.search = PREFERRED_MODEL;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                // For debugging:
                // console.log('[Model Keeper] localStorage set');
            }
        } catch {}
    }

    async function fixUIIfNecessary() {
        if (hasRun) return;
        hasRun = true;
        const modelButton = Array.from(document.querySelectorAll('button')).find(b => b.innerHTML.includes('pplx-icon-cpu'));
        if (!modelButton) return;

        // Open menu if not open
        if (!document.querySelector('div[role="menu"]')) {
            modelButton.click();
            await new Promise(resolve => setTimeout(resolve, 400));
        }

        const menuItems = Array.from(document.querySelectorAll('div[role="menuitem"]'));
        const claudeItem = menuItems.find(item => item.textContent.includes('Claude Sonnet 4.5'));
        if (claudeItem) {
            const checkIcon = claudeItem.querySelector('svg use[xlink\\:href="#pplx-icon-check"]');
            const isSelected = checkIcon && checkIcon.closest('svg').classList.contains('opacity-100');
            if (!isSelected) {
                const clickableDiv = claudeItem.querySelector('div.cursor-pointer');
                if (clickableDiv) clickableDiv.click();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        const reasoningItem = menuItems.find(item => item.textContent.includes('With reasoning'));
        if (reasoningItem) {
            const toggleButton = reasoningItem.querySelector('button');
            if (toggleButton && toggleButton.getAttribute('data-state') !== 'checked') {
                toggleButton.click();
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        if (document.querySelector('div[role="menu"]')) {
            modelButton.click();
        }
    }

    // MutationObserver to trigger the fix exactly when the model controls hit the DOM.
    function observeModelButton() {
        const observer = new MutationObserver(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerHTML.includes('pplx-icon-cpu'));
            if (btn) {
                observer.disconnect();
                fixUIIfNecessary();
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});
    }

    // Always set storage immediately
    setLocalStoragePreference();

    // On initial page load and tab activation, attach observer
    window.addEventListener('load', observeModelButton);
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) observeModelButton();
    });

})();
