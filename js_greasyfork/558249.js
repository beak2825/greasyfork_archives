// ==UserScript==
// @name         Torn: Block 1m & 10m Slots Bets
// @namespace    whiskey_jack.torn 
// @version      1.0
// @description  Blocks the 1,000,000 and 10,000,000 bet buttons on the Torn slots page.
// @author       Whiskey_Jack [1994581]
// @match        https://www.torn.com/page.php?sid=slots*
// @match        https://www.torn.com/loader.php?sid=slots*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558249/Torn%3A%20Block%201m%20%2010m%20Slots%20Bets.user.js
// @updateURL https://update.greasyfork.org/scripts/558249/Torn%3A%20Block%201m%20%2010m%20Slots%20Bets.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_PREFIX = '[SlotsBlocker]';

    // Style: visually dim + make unclickable
    const STYLE = `
        .betbtn.btn-1m,
        .betbtn.btn-10m {
            pointer-events: none !important;
            opacity: 0.4 !important;
            cursor: not-allowed !important;
            filter: grayscale(1);
        }
    `;

    function injectStyle() {
        try {
            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(STYLE);
            } else {
                const style = document.createElement('style');
                style.textContent = STYLE;
                document.head.appendChild(style);
            }
            console.log(LOG_PREFIX, 'CSS injected – 1m & 10m buttons visually disabled.');
        } catch (e) {
            console.warn(LOG_PREFIX, 'Failed to inject CSS:', e);
        }
    }

    function blockButtons(root = document) {
        const buttons = root.querySelectorAll('.betbtn.btn-1m, .betbtn.btn-10m');
        if (!buttons.length) return;

        buttons.forEach(btn => {
            // Prevent duplicate handlers
            if (btn.dataset.slotsBlockerAttached === '1') return;

            btn.dataset.slotsBlockerAttached = '1';
            btn.setAttribute('title', 'Blocked by userscript');

            btn.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
                console.log(LOG_PREFIX, 'Blocked click on', btn.className, 'data-bet=', btn.getAttribute('data-bet'));
            }, true);
        });
    }

    function setupObserver() {
        if (!document.body) {
            // Fallback: wait until body exists
            const interval = setInterval(() => {
                if (document.body) {
                    clearInterval(interval);
                    setupObserver();
                }
            }, 50);
            return;
        }

        // Initial pass
        blockButtons(document);

        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (!m.addedNodes || !m.addedNodes.length) continue;
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return; // ELEMENT_NODE
                    if (node.matches && (node.matches('.betbtn.btn-1m, .betbtn.btn-10m'))) {
                        blockButtons(node.parentNode || node);
                    } else if (node.querySelector) {
                        blockButtons(node);
                    }
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log(LOG_PREFIX, 'MutationObserver attached.');
    }

    // Run ASAP
    injectStyle();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupObserver();
        });
    } else {
        setupObserver();
    }
})();
