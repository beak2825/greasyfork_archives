// ==UserScript==
// @name         Torn Bazaar Quick Pricer + Smart Bazaar Pricing Panel
// @namespace    http://tampermonkey.net/
// @version      3.2.3
// @description  Bazaar quick pricer with market/bazaar pricing modes, % or $ undercut, NPC warnings, manage-bazaar repricing, ignore-low-bazaar option, and console-only diagnostics
// @author       R4G3RUNN3R [3877028] based on Zedtrooper [3028329] + Community Extensions
// @license      MIT
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563971/Torn%20Bazaar%20Quick%20Pricer%20%2B%20Smart%20Bazaar%20Pricing%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/563971/Torn%20Bazaar%20Quick%20Pricer%20%2B%20Smart%20Bazaar%20Pricing%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       CONSOLE DIAGNOSTICS
    ========================= */
    console.log(
        '%c[BQP] Loaded v3.2.3',
        'color:#4CAF50;font-weight:bold'
    );
    window.__BQP_LOADED__ = true;

    /* =========================
       CONFIG
    ========================= */
    const CONFIG = {
        defaultDiscount: GM_getValue('discountPercent', 0),
        apiKey: GM_getValue('tornApiKey', ''),

        pricingMode: GM_getValue('pricingMode', 'market'), // market | bazaar | bazaar-undercut
        undercutType: GM_getValue('undercutType', 'percent'), // percent | flat
        undercutValue: GM_getValue('undercutValue', 10),
        warnBelowNpc: GM_getValue('warnBelowNpc', true),

        // NEW OPTION (kept)
        ignoreLowBazaar: GM_getValue('ignoreLowBazaar', true),
        ignoreBelowPrice: GM_getValue('ignoreBelowPrice', 1),

        priceCache: GM_getValue('priceCache', {}),
        bazaarCache: GM_getValue('bazaarCache', {}),

        cacheTimeout: 5 * 60 * 1000,
        bazaarTimeout: 2 * 60 * 1000
    };

    function saveConfig() {
        GM_setValue('discountPercent', CONFIG.defaultDiscount);
        GM_setValue('tornApiKey', CONFIG.apiKey);
        GM_setValue('pricingMode', CONFIG.pricingMode);
        GM_setValue('undercutType', CONFIG.undercutType);
        GM_setValue('undercutValue', CONFIG.undercutValue);
        GM_setValue('warnBelowNpc', CONFIG.warnBelowNpc);
        GM_setValue('ignoreLowBazaar', CONFIG.ignoreLowBazaar);
        GM_setValue('ignoreBelowPrice', CONFIG.ignoreBelowPrice);
        GM_setValue('priceCache', CONFIG.priceCache);
        GM_setValue('bazaarCache', CONFIG.bazaarCache);
    }

    if (!CONFIG.apiKey) {
        console.warn('[BQP] API key not set. Script loaded, pricing disabled until key is provided.');
    }

    /* =========================
       UTILITIES
    ========================= */
    function showNpcWarning(finalPrice, sellPrice) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position:fixed;
            bottom:20px;
            right:20px;
            background:#2b2b2b;
            color:#fff;
            padding:12px 16px;
            border-left:4px solid #ff9800;
            z-index:2147483647;
            font-size:13px;
            max-width:340px;
            border-radius:4px;
            box-shadow:0 2px 8px rgba(0,0,0,0.4);
        `;
        toast.innerHTML = `
            <strong>⚠ Below NPC Value</strong><br>
            NPC sell: $${sellPrice.toLocaleString()}<br>
            Your price: $${finalPrice.toLocaleString()}<br>
            <span style="font-size:12px;color:#bbb">Warning only. Listing NOT blocked.</span>
        `;
        document.documentElement.appendChild(toast);
        setTimeout(() => toast.remove(), 6500);
    }

    function getItemIdFromImage(img) {
        if (!img || !img.src) return null;
        const m = img.src.match(/\/(\d+)\//);
        return m ? parseInt(m[1], 10) : null;
    }

    /* =========================
       API – ITEM INFO (QUEUED)
    ========================= */
    const requestQueue = [];
    let processing = false;

    function processQueue() {
        if (processing || requestQueue.length === 0) return;
        processing = true;

        const { itemId, cb } = requestQueue.shift();

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/torn/${itemId}?selections=items&key=${CONFIG.apiKey}`,
            onload(res) {
                try {
                    const data = JSON.parse(res.responseText);
                    const item = data.items?.[itemId];
                    if (!item) throw 'No item';

                    CONFIG.priceCache[itemId] = {
                        marketValue: item.market_value || 0,
                        sellPrice: item.sell_price || 0,
                        ts: Date.now()
                    };
                    saveConfig();

                    cb({
                        marketValue: item.market_value || 0,
                        sellPrice: item.sell_price || 0
                    });
                } catch {
                    cb(null);
                }
                processing = false;
                setTimeout(processQueue, 250);
            },
            onerror() {
                cb(null);
                processing = false;
                setTimeout(processQueue, 250);
            }
        });
    }

    function fetchItemData(itemId, cb) {
        const c = CONFIG.priceCache[itemId];
        if (c && Date.now() - c.ts < CONFIG.cacheTimeout) {
            return cb({ marketValue: c.marketValue, sellPrice: c.sellPrice });
        }
        requestQueue.push({ itemId, cb });
        processQueue();
    }

    /* =========================
       API – LOWEST BAZAAR PRICE
    ========================= */
    function fetchLowestBazaarPrice(itemId) {
        return new Promise(resolve => {
            const c = CONFIG.bazaarCache[itemId];
            if (c && Date.now() - c.ts < CONFIG.bazaarTimeout) {
                return resolve(c.price);
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/market/${itemId}?selections=itemmarket&key=${CONFIG.apiKey}`,
                onload(res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        let prices = Object.values(data.itemmarket || {})
                            .map(l => l.price)
                            .filter(p => p > 0);

                        if (CONFIG.ignoreLowBazaar) {
                            prices = prices.filter(p => p > CONFIG.ignoreBelowPrice);
                        }

                        const lowest = prices.length ? Math.min(...prices) : 0;
                        CONFIG.bazaarCache[itemId] = { price: lowest, ts: Date.now() };
                        saveConfig();
                        resolve(lowest);
                    } catch {
                        resolve(0);
                    }
                },
                onerror() { resolve(0); }
            });
        });
    }

    /* =========================
       PRICING ENGINE
    ========================= */
    function resolveFinalPrice({ marketValue, bazaarPrice, sellPrice }) {
        let price = 0;

        switch (CONFIG.pricingMode) {
            case 'bazaar':
                price = bazaarPrice;
                break;

            case 'bazaar-undercut':
                if (!bazaarPrice) return null;
                price = CONFIG.undercutType === 'percent'
                    ? Math.round(bazaarPrice * (1 - CONFIG.undercutValue / 100))
                    : Math.round(bazaarPrice - CONFIG.undercutValue);
                break;

            default:
                price = Math.round(marketValue * (1 - CONFIG.defaultDiscount / 100));
        }

        if (!price || price <= 0) return null;

        if (CONFIG.warnBelowNpc && sellPrice > 0 && price < sellPrice) {
            showNpcWarning(price, sellPrice);
        }

        return Math.max(1, price);
    }

    /* =========================
       MANAGE BAZAAR REPRICING
    ========================= */
    function isManagePage() {
        return document.querySelector('h2')?.textContent.includes('Manage your Bazaar');
    }

    function fillManageRow(row) {
        const img = row.querySelector('img');
        const priceInput = row.querySelector('td:last-child input[type="text"]');

        if (!img || !priceInput) return;

        const id = getItemIdFromImage(img);
        if (!id) return;

        fetchItemData(id, data => {
            if (!data) return;

            fetchLowestBazaarPrice(id).then(bazaarPrice => {
                const finalPrice = resolveFinalPrice({
                    marketValue: data.marketValue,
                    bazaarPrice,
                    sellPrice: data.sellPrice
                });

                if (!finalPrice) {
                    console.warn('[BQP] Skipping item – no valid price', id);
                    return;
                }

                priceInput.value = finalPrice;
                priceInput.dispatchEvent(new Event('input', { bubbles: true }));
                priceInput.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });
    }

    /* =========================
       FLOATING QUICK REPRICE BUTTON
    ========================= */
    function injectButton() {
        if (document.getElementById('bqpQuickReprice')) return;

        const btn = document.createElement('div');
        btn.id = 'bqpQuickReprice';
        btn.textContent = 'Quick Reprice';

        btn.style.cssText = `
            position:fixed;
            left:20px;
            top:50%;
            transform:translateY(-50%);
            background:#C62828;
            color:#fff;
            padding:12px 16px;
            border-radius:6px;
            cursor:pointer;
            font-weight:bold;
            z-index:2147483647;
        `;

        btn.onclick = () => {
            if (!isManagePage()) {
                console.warn('[BQP] Quick Reprice clicked, but not on Manage page');
                return;
            }
            const rows = document.querySelectorAll('table tbody tr');
            console.log('[BQP] Repricing Manage Bazaar rows:', rows.length);
            rows.forEach(fillManageRow);
        };

        document.documentElement.appendChild(btn);
    }

    function init() {
        injectButton();
    }

    init();
    window.addEventListener('hashchange', () => setTimeout(init, 400));

})();
