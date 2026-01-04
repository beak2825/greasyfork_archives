// ==UserScript==
// @name         Torn - Disable Booster Tab
// @namespace    gin4
// @version      1.1
// @description  Makes the Booster tab appear and behave as disabled on the item page.
// @match        https://www.torn.com/item.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554763/Torn%20-%20Disable%20Booster%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/554763/Torn%20-%20Disable%20Booster%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const disableBoosterTab = (tab) => {
        if (!tab || tab.classList.contains('ui-state-disabled')) return;

        // Add Torn's disabled classes
        tab.classList.add('ui-state-disabled', 'no-items');
        tab.setAttribute('aria-disabled', 'true');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');

        // Remove active/selected state if present
        tab.classList.remove('ui-tabs-active', 'ui-state-active');
        tab.removeAttribute('aria-controls');

        // Disable its link
        const link = tab.querySelector('a');
        if (link) {
            link.removeAttribute('href');
            link.removeAttribute('tabindex');
            link.style.pointerEvents = 'none';
            link.title = 'Disabled';
        }
    };

    // Observe the DOM since Torn loads tabs dynamically
    const observer = new MutationObserver(() => {
        const boosterTab = document.querySelector('li#categoriesItem[data-type="Booster"]');
        if (boosterTab) {
            disableBoosterTab(boosterTab);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
