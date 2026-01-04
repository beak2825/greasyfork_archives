// ==UserScript==
// @name         Torn Item Market - BUY ALL
// @namespace    https://www.torn.com/
// @version      1.0
// @description  Adds a compact BUY ALL button for Torn item market. Desktop flow unchanged, mobile flow handled separately.
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553666/Torn%20Item%20Market%20-%20BUY%20ALL.user.js
// @updateURL https://update.greasyfork.org/scripts/553666/Torn%20Item%20Market%20-%20BUY%20ALL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Selectors ---
    const SELECTORS = {
        desktop: {
            quantityCol: 'div.available___xegv_',
            maxButton: 'span.input-money-symbol input.wai-btn',
            buyButton: 'button.buyButton___Flkhg',
            confirmButton: 'button.confirmButton___WoFpj'
        },
        mobile: {
            showBuyControls: 'button.showBuyControlsButton___K8f72',
            maxButton: 'span.input-money-symbol input.wai-btn',
            buyButton: 'div.title___uDZTJ',
            confirmButton: 'button.confirmButton___WoFpj',
            quantityCol: 'div.available___jtANf'
        }
    };

    // --- Utility to wait for an element ---
    function waitForElement(selector, root = document, timeout = 7000) {
        return new Promise((resolve, reject) => {
            const el = root.querySelector(selector);
            if (el) return resolve(el);
            const obs = new MutationObserver(() => {
                const el = root.querySelector(selector);
                if (el) { obs.disconnect(); resolve(el); }
            });
            obs.observe(root, { childList: true, subtree: true });
            setTimeout(() => { obs.disconnect(); reject(); }, timeout);
        });
    }

    // --- Desktop BUY ALL flow ---
    async function desktopBuyAll(row) {
        try {
            const maxBtn = row.querySelector(SELECTORS.desktop.maxButton);
            if (maxBtn) maxBtn.click();

            const buyBtn = row.querySelector(SELECTORS.desktop.buyButton);
            if (buyBtn) buyBtn.click();

            const confirmBtn = await waitForElement(SELECTORS.desktop.confirmButton, document, 7000);
            confirmBtn.click();
        } catch (err) {
            console.warn('Desktop BUY ALL failed', err);
        }
    }

    // --- Mobile BUY ALL flow ---
    async function mobileBuyAll(row) {
        try {
            const showBtn = row.querySelector(SELECTORS.mobile.showBuyControls);
            if (showBtn) showBtn.click();

            const maxBtn = await waitForElement(SELECTORS.mobile.maxButton, row, 3000);
            maxBtn.click();

            const buyBtn = await waitForElement(SELECTORS.mobile.buyButton, row, 3000);
            buyBtn.click();

            const confirmBtn = await waitForElement(SELECTORS.mobile.confirmButton, document, 7000);
            confirmBtn.click();
        } catch (err) {
            console.warn('Mobile BUY ALL failed', err);
        }
    }

    // --- Add BUY ALL buttons ---
    function addBuyAllButtons() {
        // Desktop
        document.querySelectorAll(SELECTORS.desktop.quantityCol).forEach(quantityDiv => {
            const row = quantityDiv.closest('[class*="row"], [class*="item"], [class*="listing"]');
            if (!row || row.querySelector('.buy-all-btn')) return;

            const buyAll = document.createElement('div');
            buyAll.textContent = 'BUY ALL';
            buyAll.className = 'buy-all-btn';
            buyAll.style.cssText = `
                display: inline-block;
                margin-left: 6px;
                font-size: 0.75em;
                font-weight: 600;
                background-color: #2d8f2d;
                color: #fff;
                border-radius: 6px;
                padding: 3px 6px;
                cursor: pointer;
                user-select: none;
                white-space: nowrap;
                text-align: center;
                transition: background-color 0.15s;
            `;
            buyAll.addEventListener('mouseenter', () => buyAll.style.backgroundColor = '#36a136');
            buyAll.addEventListener('mouseleave', () => buyAll.style.backgroundColor = '#2d8f2d');
            buyAll.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await desktopBuyAll(row);
            });

            quantityDiv.insertAdjacentElement('afterend', buyAll);
        });

        // Mobile
        document.querySelectorAll(SELECTORS.mobile.showBuyControls).forEach(showBtn => {
            const row = showBtn.closest('[class*="row"], [class*="item"], [class*="listing"]');
            if (!row || row.querySelector('.buy-all-btn')) return;

            const buyAll = document.createElement('div');
            buyAll.textContent = 'BUY ALL';
            buyAll.className = 'buy-all-btn';
            buyAll.style.cssText = `
                display: inline-block;
                margin-top: 4px;
                font-size: 0.7em;
                font-weight: 600;
                background-color: #2d8f2d;
                color: #fff;
                border-radius: 6px;
                padding: 2px 5px;
                cursor: pointer;
                user-select: none;
                text-align: center;
                transition: background-color 0.15s;
                align-self: flex-start;
            `;
            buyAll.addEventListener('mouseenter', () => buyAll.style.backgroundColor = '#36a136');
            buyAll.addEventListener('mouseleave', () => buyAll.style.backgroundColor = '#2d8f2d');
            buyAll.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await mobileBuyAll(row);
            });

            showBtn.insertAdjacentElement('afterend', buyAll);
        });
    }

    // --- Observe for dynamic content ---
    const observer = new MutationObserver(addBuyAllButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    addBuyAllButtons();

    // --- Align mobile headers to first row widths ---
function alignMobileHeaders() {
    try {
        // Only run if the list exists
        const sellerList = document.querySelector('.sellerList___e4C9_');
        if (!sellerList) return;

        const mappings = [
            { header: '.userInfoHead___LXxjB', data: '.userInfoWrapper___B2a2P' }, // Owner
            { header: '.priceHead___Yo8ku', data: '.price___v8rRx' },               // Cost
            { header: '.availableHead___BkcpB', data: '.available___jtANf' },      // Qty
            { header: '.showBuyControlsHead___SczEn', data: '.showBuyControlsButton___K8f72' } // Buy
        ];

        mappings.forEach(({ header: hSel, data: dSel }) => {
            const header = document.querySelector(hSel);
            const data = document.querySelector(dSel);
            if (header && data) {
                let width = data.getBoundingClientRect().width;

                // Include BUY ALL button width for Buy column
                if (hSel.includes('showBuyControlsHead')) {
                    const btn = document.querySelector('.buy-all-btn');
                    if (btn) width += btn.getBoundingClientRect().width + 4;
                }

                header.style.width = `${width}px`;
                header.style.minWidth = `${width}px`;
                header.style.maxWidth = `${width}px`;
            }
        });
    } catch (err) {
        console.warn('Failed to align mobile headers', err);
    }
}





// --- Call after buttons are inserted ---
addBuyAllButtons(); // your existing function
alignMobileHeaders();

// --- Optional: re-align on window resize ---
window.addEventListener('resize', alignMobileHeaders);

// Use a different name to avoid conflict
const headerObserver = new MutationObserver(alignMobileHeaders);
headerObserver.observe(document.body, { childList: true, subtree: true });



})();
