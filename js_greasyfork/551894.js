// ==UserScript==
// @name         ZedTools BetterMarket
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Fetches top 3 market offers for selected items on Zed.City with a consistent UI design
// @match        https://www.zed.city/market-listings*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551894/ZedTools%20BetterMarket.user.js
// @updateURL https://update.greasyfork.org/scripts/551894/ZedTools%20BetterMarket.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[ZedTools Market++] script starting...');

    const STORAGE_KEY = 'ZedToolsMarketConfig';
    const defaultConfig = { uiVisible: true };

    let config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    config = { ...defaultConfig, ...config };

    // --- Utilities ---
    async function fetchJson(url, options = {}, timeoutMs = 15000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const resp = await fetch(url, { ...options, credentials: 'include', signal: controller.signal });
            clearTimeout(id);
            const text = await resp.text();
            if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText} - ${text}`);
            try { return JSON.parse(text); } catch { return text; }
        } catch (err) {
            clearTimeout(id);
            throw err;
        }
    }

    async function fetchCsrfToken(retries = 3) {
        for (let i = 1; i <= retries; i++) {
            try {
                console.log(`[ZedTools Market++] fetching CSRF token attempt ${i}`);
                const data = await fetchJson('https://api.zed.city/csrfToken');
                if (data && data.token) return data.token;
                throw new Error('No token in response');
            } catch (err) {
                console.warn('[ZedTools Market++] CSRF fetch failed:', err.message || err);
                if (i < retries) await new Promise(r => setTimeout(r, 1000));
            }
        }
        throw new Error('Failed to get CSRF token');
    }

    async function fetchOffersWithCsrf(codename, retries = 3) {
        for (let i = 1; i <= retries; i++) {
            try {
                const token = await fetchCsrfToken();
                console.log(`[ZedTools Market++] fetching offers for ${codename} attempt ${i}`);
                const res = await fetchJson(`https://api.zed.city/getOffers?item=${encodeURIComponent(codename)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-csrf-token': token },
                    body: JSON.stringify({})
                }, 10000);

                if (res && res.error && /csrf/i.test(res.error)) throw new Error('CSRF mismatch');
                return res;
            } catch (err) {
                console.warn(`[ZedTools Market++] attempt ${i} failed for ${codename}:`, err.message || err);
                if (i === retries) throw err;
                await new Promise(r => setTimeout(r, 800 + i * 200));
            }
        }
        throw new Error('Unreachable');
    }
function buildOffersTable(offers) {
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'separate';
    table.style.borderSpacing = '0';
    table.style.fontSize = '0.9em';
    table.style.color = '#f0f0f0';
    table.style.background = '#202327';
    table.style.overflow = 'hidden';

    const header = document.createElement('tr');
    ['User', 'Qty', 'Price', 'Total'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        Object.assign(th.style, {
            padding: '6px 10px',
            textAlign: 'left',
            background: '#202327',
            borderBottom: '1px solid #444'
        });
        header.appendChild(th);
    });
    table.appendChild(header);

    // Number formatter for currency
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });

    offers.forEach((offer, i) => {
        const row = document.createElement('tr');
        row.style.background = i % 2 === 0 ? '#202327' : '#202327';

        const userCell = document.createElement('td');
        userCell.textContent = (offer.user && offer.user.username) ? offer.user.username : (offer.seller || 'Unknown');
        userCell.style.padding = '4px 10px';
        row.appendChild(userCell);

        const qtyCell = document.createElement('td');
        const qtyValue = offer.quantity ?? 0;
        qtyCell.textContent = qtyValue;
        qtyCell.style.padding = '4px 10px';
        row.appendChild(qtyCell);

        const priceCell = document.createElement('td');
        const priceValue = offer.market_price ?? offer.price ?? offer.unit_price ?? 0;
        priceCell.textContent = formatter.format(priceValue);
        priceCell.style.padding = '4px 10px';
        row.appendChild(priceCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = formatter.format(priceValue * qtyValue);
        totalCell.style.padding = '4px 10px';
        row.appendChild(totalCell);

        table.appendChild(row);
    });

    return table;
}




    async function fetchMarketPrice(codename, itemName, container) {
        try {
            container.textContent = 'Loading price...';
            const res = await fetchOffersWithCsrf(codename, 3);

            let offers = [];
            if (Array.isArray(res)) offers = res;
            else if (res && Array.isArray(res.offers)) offers = res.offers;
            else if (res && Array.isArray(res.data)) offers = res.data;
            else if (res && Array.isArray(res.items)) offers = res.items;

            if (!offers.length) {
                container.textContent = 'No offers found';
                return;
            }

            offers.sort((a,b) => (a.market_price ?? a.price ?? a.unit_price ?? Number.MAX_SAFE_INTEGER) - (b.market_price ?? b.price ?? b.unit_price ?? Number.MAX_SAFE_INTEGER));
            const top3 = offers.slice(0,3);

            container.textContent = '';
            container.appendChild(buildOffersTable(top3));
        } catch (err) {
            console.error('[ZedTools Market++] fetch error:', err);
            container.textContent = 'Error fetching price';
        }
    }

    function processCreateOfferButton(button) {
        try {
            const leftPanel = button.closest('.col-xs-12.col-md-5');
            if (!leftPanel) return;
            const rightPanel = leftPanel.nextElementSibling;
            if (!rightPanel) return;
            const itemInfo = rightPanel.querySelector('.item-info');
            if (!itemInfo) return;

            const nameDiv = itemInfo.querySelector('.text-h5');
            if (!nameDiv) return;

            const itemName = nameDiv.textContent.trim();
            const codename = itemName.toLowerCase().replace(/\s+/g,'_');

            if (itemInfo.querySelector('.market-price')) return;

            const container = document.createElement('div');
            container.className = 'market-price';
            Object.assign(container.style, {
                fontWeight: 'normal',
                color: '#eee',
                background: '#202327',
                'border-top': '1px solid #000',
                padding: '5px',
                marginTop: '5px'
            });

            itemInfo.parentNode.insertBefore(container, itemInfo.nextSibling);

            fetchMarketPrice(codename, itemName, container);

        } catch (err) {
            console.error('[ZedTools Market++] process button error', err);
        }
    }

    function initObserver() {
        const checkApp = () => {
            const app = document.querySelector('#q-app');
            if (!app) return setTimeout(checkApp, 1000);

            const observer = new MutationObserver(muts => {
                muts.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (!(node instanceof HTMLElement)) return;
                        if (node.matches && node.matches('button[data-cy="market-add-offer"]')) processCreateOfferButton(node);
                        node.querySelectorAll && node.querySelectorAll('button[data-cy="market-add-offer"]').forEach(processCreateOfferButton);
                    });
                });
            });
            observer.observe(app, { childList:true, subtree:true });
            console.log('[ZedTools Market++] observer initialized');
        };
        checkApp();
    }

    try {
        initObserver();
    } catch(e) {
        console.error('[ZedTools Market++] initialization error', e);
    }

})();
