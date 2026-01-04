// ==UserScript==
// @name         Torn OC Item Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlights OC items (Enhancers, Tools, Materials, Drugs, Equipment) on the Armoury deposit page
// @author       DieselBlade [1701621]
// @license     MIT
// @match        https://www.torn.com/factions.php?step=your*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553191/Torn%20OC%20Item%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/553191/Torn%20OC%20Item%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ocItems = [
        'ATM Key',
        'Binoculars',
        'Bolt Cutters',
        'C4 Explosive',
        'Chloroform',
        'Construction Helmet',
        'Core Drill',
        'Dental Mirror',
        'Dog Treats',
        'DSLR Camera',
        'Firewalk Virus',
        'Flash Grenade',
        'Gasoline',
        'Hand Drill',
        'ID Badge',
        'Jemmy',
        'Lockpicks',
        'Net',
        'PCP',
        'Police Badge',
        'Polymorphic Virus',
        'RF Detector',
        'Shaped Charge',
        'Smoke Grenade',
        'Spray Paint : Black',
        'Stealth Virus',
        'Tunneling Virus',
        'Wire Cutters',
        'Wireless Dongle',
        'Zip Ties',
    ];

    // Styles
    (function injectStyles() {
        if (document.getElementById('oc-highlighter-styles')) return;
        const style = document.createElement('style');
        style.id = 'oc-highlighter-styles';
        style.textContent = `
            .oc-highlight {
                background-color: rgba(144, 238, 144, 0.25) !important;
                box-shadow: inset 0 0 6px rgba(0, 128, 0, 0.4);
            }
        `;
        document.head.appendChild(style);
    })();

    // Wait for an element to exist
    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const start = performance.now();
            (function check() {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                if (performance.now() - start > timeout) {
                    return reject(new Error('timeout'));
                }
                requestAnimationFrame(check);
            })();
        });
    }

    // Highlight logic
    function highlightOCItems() {
        const container = document.querySelector('#inventory-container');
        if (!container) return;

        const items = container.querySelectorAll('li.clearfix, #inventory-container li');
        items.forEach((li) => {
            const nameEl =
                li.querySelector('.title-wrap .name-wrap .t-overflow') ||
                li.querySelector('.name-wrap .t-overflow') ||
                li.querySelector('.t-overflow');

            if (!nameEl) return;

            const itemName = nameEl.textContent.trim();
            const isMatch = ocItems.some((oc) => itemName.toLowerCase() === oc.toLowerCase());
            li.classList.toggle('oc-highlight', isMatch);
        });
    }

    // Observe inventory changes after container exists
    async function start() {
        try {
            await waitForElement('#inventory-container', 15000);
        } catch (_) {
            // If timeout, still try a pass (SPA may render later)
        }
        highlightOCItems();

        const container = document.querySelector('#inventory-container');
        if (container) {
            const observer = new MutationObserver(() => highlightOCItems());
            observer.observe(container, { childList: true, subtree: true });
        }

        // Safety reruns to catch late renders
        setTimeout(highlightOCItems, 1000);
        setTimeout(highlightOCItems, 3000);
    }

    // Minimal SPA hook (hash/pushState/replaceState)
    function hookNavigation() {
        window.addEventListener('hashchange', () => setTimeout(highlightOCItems, 300));
        const _push = history.pushState;
        history.pushState = function () { _push.apply(this, arguments); setTimeout(highlightOCItems, 300); };
        const _replace = history.replaceState;
        history.replaceState = function () { _replace.apply(this, arguments); setTimeout(highlightOCItems, 300); };
    }

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { hookNavigation(); start(); });
    } else {
        hookNavigation();
        start();
    }
})();