// ==UserScript==
// @name         quickbuy bazaar
// @namespace    torn
// @version      3.5
// @description  1 click bazaar
// @author       aquagloop
// @grant        GM_addStyle
// @match        https://www.torn.com/bazaar.php*
// @run-at       document-start
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/557697/quickbuy%20bazaar.user.js
// @updateURL https://update.greasyfork.org/scripts/557697/quickbuy%20bazaar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let markedItems = JSON.parse(localStorage.getItem('tornBazaarMarked') || '{}');
    let panelVisible = true;
    let bazaarIdMap = {};
    let rfcvToken = null;
    let currentBazaarOwnerId = null;
    let dataLoadAttempted = false;

    function extractRFCV() {
        const scriptTags = document.querySelectorAll('script');
        for (const script of scriptTags) {
            const match = script.textContent.match(/rfcv[=:][\s]*["']([a-f0-9]+)["']/i);
            if (match) {
                rfcvToken = match[1];
                return rfcvToken;
            }
        }
        const allElements = document.querySelectorAll('a[href*="rfcv="], script, [data-rfcv]');
        for (const el of allElements) {
            const text = el.href || el.textContent || el.dataset.rfcv || '';
            const match = text.match(/rfcv=([a-f0-9]+)/i);
            if (match) {
                rfcvToken = match[1];
                return rfcvToken;
            }
        }
        return null;
    }

    async function loadBazaarData() {
        if (dataLoadAttempted) return;
        dataLoadAttempted = true;

        const urlMatch = window.location.search.match(/[?&](?:userId|ID)=(\d+)/i) ||
                         window.location.hash.match(/userId[=/](\d+)/i);

        if (!urlMatch) return;

        currentBazaarOwnerId = urlMatch[1];

        let attempts = 0;
        while (!rfcvToken && attempts < 20) {
            extractRFCV();
            if (!rfcvToken) {
                await new Promise(resolve => setTimeout(resolve, 200));
                attempts++;
            }
        }

        if (!rfcvToken) return;

        try {
            const url = `https://www.torn.com/bazaar.php?sid=bazaarData&step=getBazaarItems&start=0&ID=${currentBazaarOwnerId}&order=default&by=asc&categorised=0&limit=100&searchname=&rfcv=${rfcvToken}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const data = await response.json();

            if (data.list && Array.isArray(data.list)) {
                processBazaarItemsResponse(data);
            }
        } catch (error) {}
    }

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const [url] = args;
        const urlString = typeof url === 'string' ? url : (url?.url || '');

        if (urlString && !rfcvToken) {
            const match = urlString.match(/rfcv=([a-f0-9]+)/i);
            if (match) rfcvToken = match[1];
        }

        if (urlString && urlString.includes('getBazaarItems')) {
            const response = await originalFetch.apply(this, args);
            const clonedResponse = response.clone();
            clonedResponse.json().then(data => processBazaarItemsResponse(data)).catch(() => {});
            return response;
        }

        if (urlString && urlString.includes('getBazaarContent')) {
            const response = await originalFetch.apply(this, args);
            const clonedResponse = response.clone();
            clonedResponse.json().then(data => {
                if (data.owner?.userId) currentBazaarOwnerId = data.owner.userId;
            }).catch(() => {});
            return response;
        }

        return originalFetch.apply(this, args);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        if (!rfcvToken && url) {
            const match = url.match(/rfcv=([a-f0-9]+)/i);
            if (match) rfcvToken = match[1];
        }
        return originalOpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(data) {
        if (this._url && this._url.includes('getBazaarItems')) {
            this.addEventListener('load', function() {
                try {
                    const response = JSON.parse(this.responseText);
                    processBazaarItemsResponse(response);
                } catch (e) {}
            });
        }
        if (this._url && this._url.includes('getBazaarContent')) {
            this.addEventListener('load', function() {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response.owner?.userId) currentBazaarOwnerId = response.owner.userId;
                } catch (e) {}
            });
        }
        return originalSend.apply(this, arguments);
    };

    function processBazaarItemsResponse(data) {
        if (!data.list || !Array.isArray(data.list)) return;

        data.list.forEach(item => {
            const mapKey = `${item.ID}_${item.price}`;
            bazaarIdMap[mapKey] = {
                bazaarID: item.bazaarID,
                timestamp: item.timestamp || Math.floor(Date.now() / 1000),
                amount: item.amount
            };

            const fullKey = `${item.ID}_${item.price}_${item.name.replace(/\s/g, '')}`;
            if (markedItems[fullKey]) {
                markedItems[fullKey].bazaarID = item.bazaarID;
                markedItems[fullKey].timestamp = item.timestamp;
                markedItems[fullKey].amount = item.amount;
                localStorage.setItem('tornBazaarMarked', JSON.stringify(markedItems));
            }
        });

        setTimeout(() => {
            addMarkButtons();
            if (!$('.qb-amount-input:focus').length) {
                updateQuickBuyList();
            }
        }, 100);
    }

    GM_addStyle(`
        :root {
            --qb-bg: #222;
            --qb-header: #333;
            --qb-text: #ddd;
            --qb-border: #444;
            --qb-accent: #85c742;
            --qb-danger: #e74c3c;
            --qb-warn: #f39c12;
            --qb-item-bg: #2a2a2a;
        }
        .quick-buy-container {
            position: fixed;
            top: 50px;
            right: 10px;
            width: 340px;
            max-height: 85vh;
            overflow-y: auto;
            background: var(--qb-bg);
            border: 1px solid var(--qb-border);
            border-radius: 8px;
            padding: 0;
            z-index: 99999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            font-family: 'Arial', sans-serif;
            color: var(--qb-text);
            display: flex;
            flex-direction: column;
        }
        .quick-buy-header {
            background: var(--qb-header);
            padding: 10px 15px;
            border-bottom: 1px solid var(--qb-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .header-title-area {
            display: flex;
            flex-direction: column;
        }
        .header-title {
            font-weight: 700;
            font-size: 14px;
            color: #fff;
        }
        .header-total {
            font-size: 11px;
            color: var(--qb-accent);
            font-weight: bold;
        }
        .header-controls {
            display: flex;
            gap: 5px;
        }
        .btn-mini {
            border: none;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            transition: opacity 0.2s;
            text-transform: uppercase;
        }
        .btn-mini:hover { opacity: 0.8; }
        .btn-mini:active { transform: translateY(1px); }
        .btn-danger { background: var(--qb-danger); color: white; }
        .btn-success { background: var(--qb-accent); color: #222; }
        .status-bar {
            padding: 5px 15px;
            font-size: 11px;
            color: #888;
            background: #1a1a1a;
            border-bottom: 1px solid var(--qb-border);
            display: flex;
            justify-content: space-between;
        }
        .status-active { color: var(--qb-accent); }
        .status-warn { color: var(--qb-warn); }
        #quick-buy-list {
            padding: 10px;
            flex-grow: 1;
        }
        .quick-buy-item {
            background: var(--qb-item-bg);
            margin-bottom: 8px;
            border-radius: 6px;
            border: 1px solid #333;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            transition: transform 0.1s, border-color 0.2s;
            position: relative;
        }
        .quick-buy-item:hover {
            border-color: #555;
            transform: translateY(-1px);
        }
        .quick-buy-item.buying {
            opacity: 0.7;
            pointer-events: none;
            border-color: var(--qb-warn);
        }
        .item-row-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .item-name {
            font-weight: bold;
            font-size: 13px;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 200px;
        }
        .item-remove {
            background: transparent;
            color: #666;
            border: none;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            padding: 0 4px;
        }
        .item-remove:hover { color: var(--qb-danger); }
        .item-row-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }
        .price-tag {
            font-size: 11px;
            color: #aaa;
        }
        .buy-controls {
            display: flex;
            gap: 5px;
            align-items: center;
        }
        .qb-amount-input {
            width: 60px;
            background: #111;
            border: 1px solid #444;
            color: #fff;
            padding: 4px;
            border-radius: 4px;
            font-size: 12px;
            text-align: center;
        }
        .qb-amount-input:focus {
            outline: none;
            border-color: var(--qb-accent);
        }
        .btn-buy {
            background: var(--qb-accent);
            color: #222;
            border: none;
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
        }
        .btn-buy:hover { background: #96d654; }
        .buy-result {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.85);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            font-size: 12px;
            z-index: 5;
            text-align: center;
            padding: 5px;
        }
        .buy-result.success { color: var(--qb-accent); }
        .buy-result.error { color: var(--qb-danger); }
        .toggle-panel {
            position: fixed;
            top: 50px;
            right: 0;
            z-index: 100000;
            background: var(--qb-header);
            color: #fff;
            padding: 8px 10px;
            border-radius: 6px 0 0 6px;
            cursor: pointer;
            box-shadow: -2px 2px 5px rgba(0,0,0,0.3);
            writing-mode: vertical-rl;
            text-orientation: mixed;
            font-size: 11px;
            border: 1px solid var(--qb-border);
            border-right: none;
        }
        .bazaar-item-marker {
            position: absolute;
            top: 4px; right: 4px;
            background: var(--qb-accent);
            color: #222;
            border: none;
            border-radius: 4px;
            padding: 3px 8px;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            z-index: 100;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .bazaar-item-marker.marked { background: var(--qb-warn); color: #fff; }
        .bazaar-item-marker.loading { background: #555; color: #aaa; cursor: wait; }
    `);

    function createQuickBuyPanel() {
        if ($('.quick-buy-container').length) return;

        const panel = $(`
            <div class="quick-buy-container" style="display: ${panelVisible ? 'flex' : 'none'}">
                <div class="quick-buy-header">
                    <div class="header-title-area">
                        <span class="header-title">Basket</span>
                        <span class="header-total" id="qb-basket-total">Total: $0</span>
                    </div>
                    <div class="header-controls">
                        <button class="btn-mini btn-danger" id="clear-all-marked" title="Clear All">Clear</button>
                        <button class="btn-mini btn-success" id="buy-next-btn" title="Buy Next Item">BUY NEXT</button>
                    </div>
                </div>
                <div class="status-bar">
                    <span class="rfcv-status">Init...</span>
                    <span class="data-status">Waiting...</span>
                </div>
                <div id="quick-buy-list"></div>
            </div>
        `);

        const toggle = $(`<div class="toggle-panel">Quick Buy</div>`);

        $('body').append(toggle);
        $('body').append(panel);

        toggle.on('click', function() {
            panelVisible = !panelVisible;
            panel.toggle();
        });

        $('#clear-all-marked').on('click', function() {
            markedItems = {};
            localStorage.setItem('tornBazaarMarked', JSON.stringify(markedItems));
            updateQuickBuyList();
            $('.bazaar-item-marker').removeClass('marked').text('Mark');
        });

        $('#buy-next-btn').on('click', function() {
            const $btn = $(this);
            if ($btn.prop('disabled')) return;

            const $nextItem = $('.quick-buy-item').not('.buying').first();
            if ($nextItem.length) {
                $btn.prop('disabled', true).css('opacity', '0.5');
                $nextItem.find('.btn-buy').click();
                setTimeout(() => {
                    $btn.prop('disabled', false).css('opacity', '1');
                }, 500);
            }
        });

        updateQuickBuyList();

        setInterval(() => {
            const rfcvEl = $('.rfcv-status');
            if (rfcvToken) {
                rfcvEl.text('✓ RFCV').removeClass('status-warn').addClass('status-active');
            } else {
                rfcvEl.text('⚠ No RFCV').removeClass('status-active').addClass('status-warn');
            }

            const dataEl = $('.data-status');
            const loadedCount = Object.keys(bazaarIdMap).length;
            if (loadedCount > 0) {
                dataEl.text(`✓ ${loadedCount} items loaded`).removeClass('status-warn').addClass('status-active');
            } else {
                dataEl.text('⚠ No Data').removeClass('status-active').addClass('status-warn');
            }
        }, 1000);
    }

    function calculateTotal() {
        let total = 0;
        $('.quick-buy-item').each(function() {
            const price = parseInt($(this).data('price')) || 0;
            const qty = parseInt($(this).find('.qb-amount-input').val()) || 0;
            if (!$(this).hasClass('buying')) {
                total += price * qty;
            }
        });
        $('#qb-basket-total').text(`Total: $${total.toLocaleString()}`);
    }

    function updateQuickBuyList() {
        const list = $('#quick-buy-list');
        const currentInputs = {};

        $('.quick-buy-item').each(function() {
            const key = $(this).data('key');
            const val = $(this).find('.qb-amount-input').val();
            if (key && val) currentInputs[key] = val;
        });

        list.empty();

        if (Object.keys(markedItems).length === 0) {
            list.html('<div style="text-align: center; color: #666; padding: 20px; font-size: 12px;">Empty basket.</div>');
            calculateTotal();
            return;
        }

        const money = parseInt($('span[id*="user-money"]').attr('data-money') || 0);

        for (const [key, item] of Object.entries(markedItems)) {
            const mapKey = `${item.itemID}_${item.price}`;
            const liveData = bazaarIdMap[mapKey];
            const hasId = liveData && liveData.bazaarID;
            const maxAmount = liveData ? liveData.amount : item.amount;
            const maxAffordable = Math.floor(money / item.price);
            const defaultQty = Math.min(maxAmount, maxAffordable > 0 ? maxAffordable : maxAmount);
            const inputValue = currentInputs[key] || defaultQty;

            const itemDiv = $(`
                <div class="quick-buy-item" data-key="${key}" data-price="${item.price}">
                    <div class="item-row-top">
                        <span class="item-name" title="${item.name}">${item.name}</span>
                        <button class="item-remove" title="Remove">×</button>
                    </div>
                    <div class="item-row-bottom">
                        <span class="price-tag">$${parseInt(item.price).toLocaleString()} <span style="color:#666">x${maxAmount}</span></span>
                        <div class="buy-controls">
                            <input type="number" class="qb-amount-input" min="1" max="${maxAmount}" value="${inputValue}">
                            <button class="btn-buy">BUY</button>
                        </div>
                    </div>
                    ${!hasId ? '<div style="font-size:10px; color: orange; text-align:center;">⚠ Loading ID...</div>' : ''}
                </div>
            `);

            const inputEl = itemDiv.find('.qb-amount-input');
            inputEl.on('click', e => e.stopPropagation());
            inputEl.on('input', calculateTotal);

            itemDiv.find('.item-remove').on('click', function(e) {
                e.stopPropagation();
                delete markedItems[key];
                localStorage.setItem('tornBazaarMarked', JSON.stringify(markedItems));
                updateQuickBuyList();
            });

            itemDiv.find('.btn-buy').on('click', function(e) {
                e.stopPropagation();
                if ($(this).closest('.quick-buy-item').hasClass('buying')) return;
                buyMarkedItem(key, item, $(this).closest('.quick-buy-item'));
            });

            list.append(itemDiv);
        }

        calculateTotal();
    }

    function buyMarkedItem(key, item, element) {
        if (!rfcvToken) {
            showBuyResult(element, 'No RFCV', false);
            return;
        }

        const inputVal = parseInt(element.find('.qb-amount-input').val());
        if (isNaN(inputVal) || inputVal <= 0) {
            showBuyResult(element, 'Invalid Qty', false);
            return;
        }

        const mapKey = `${item.itemID}_${item.price}`;
        const currentItemData = bazaarIdMap[mapKey];

        if (!currentItemData && !item.bazaarID) {
            showBuyResult(element, 'No ID', false);
            dataLoadAttempted = false;
            loadBazaarData();
            return;
        }

        element.addClass('buying');
        calculateTotal();

        const bazaarID = currentItemData ? currentItemData.bazaarID : item.bazaarID;
        const userId = item.userId || currentBazaarOwnerId || '';
        const totalPrice = item.price * inputVal;

        const data = new FormData();
        data.append('userID', userId);
        data.append('id', bazaarID);
        data.append('itemID', item.itemID);
        data.append('amount', inputVal);
        data.append('price', item.price);
        data.append('beforeval', totalPrice);

        const XHR = new XMLHttpRequest();
        XHR.addEventListener('load', function() {
            try {
                const response = JSON.parse(this.responseText);
                if (response.success) {
                    showBuyResult(element, `Bought ${inputVal}!`, true);

                    if (currentItemData) currentItemData.amount -= inputVal;
                    item.amount -= inputVal;

                    if (item.amount <= 0) {
                        setTimeout(() => {
                            delete markedItems[key];
                            localStorage.setItem('tornBazaarMarked', JSON.stringify(markedItems));
                            element.fadeOut(300, () => updateQuickBuyList());
                        }, 1000);
                    } else {
                        markedItems[key] = item;
                        localStorage.setItem('tornBazaarMarked', JSON.stringify(markedItems));
                        setTimeout(() => element.removeClass('buying'), 1000);
                    }
                } else {
                    showBuyResult(element, response.text || 'Failed', false);
                    if (response.text && response.text.includes('price')) {
                        dataLoadAttempted = false;
                        loadBazaarData();
                    }
                    setTimeout(() => {
                        element.removeClass('buying');
                        calculateTotal();
                    }, 2000);
                }
            } catch (e) {
                showBuyResult(element, 'Error', false);
                element.removeClass('buying');
            }
        });

        XHR.open('POST', `https://www.torn.com/bazaar.php?sid=bazaarData&step=buyItem&rfcv=${rfcvToken}`);
        XHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        XHR.send(data);
    }

    function showBuyResult(element, message, success) {
        const resultDiv = $(`<div class="buy-result ${success ? 'success' : 'error'}">${message}</div>`);
        element.find('.buy-result').remove();
        element.append(resultDiv);
        if (!success) {
            setTimeout(() => resultDiv.fadeOut(() => resultDiv.remove()), 2000);
        }
    }

    function addMarkButtons() {
        const items = $('[data-testid="item"]');
        items.each(function() {
            if ($(this).find('.bazaar-item-marker').length) return;

            const nameEl = $(this).find('[data-testid="name"]');
            const priceEl = $(this).find('[data-testid="price"]');
            const amountEl = $(this).find('[data-testid="amount-value"]');
            const imgEl = $(this).find('img[alt]');

            if (!nameEl.length || !priceEl.length || !amountEl.length) return;

            const name = nameEl.text().trim();
            const priceText = priceEl.contents().first().text().trim();
            const price = parseInt(priceText.replace(/[$,]/g, ''));
            const amount = parseInt(amountEl.text());
            const imgSrc = imgEl.attr('src') || imgEl.attr('srcset')?.split(' ')[0] || '';
            const itemID = imgSrc.match(/\/items\/(\d+)\//)?.[1] || 'unknown';

            const mapKey = `${itemID}_${price}`;
            const itemData = bazaarIdMap[mapKey];
            const bazaarID = itemData?.bazaarID || null;

            const key = `${itemID}_${price}_${name.replace(/\s/g, '')}`;
            const isMarked = markedItems.hasOwnProperty(key);
            const isLoading = !bazaarID && Object.keys(bazaarIdMap).length === 0;

            const marker = $(`
                <button class="bazaar-item-marker ${isMarked ? 'marked' : ''} ${isLoading ? 'loading' : ''}">
                    ${isMarked ? 'Unmark' : (isLoading ? '...' : 'Mark')}
                </button>
            `);

            marker.on('click', function(e) {
                e.preventDefault(); e.stopPropagation();

                const freshData = bazaarIdMap[`${itemID}_${price}`];
                const freshID = freshData?.bazaarID || null;

                if (!freshID) {
                    dataLoadAttempted = false;
                    loadBazaarData();
                    return;
                }

                if (markedItems.hasOwnProperty(key)) {
                    delete markedItems[key];
                    $(this).removeClass('marked').text('Mark');
                } else {
                    markedItems[key] = {
                        name, price, amount, itemID,
                        bazaarID: freshID,
                        timestamp: freshData.timestamp,
                        userId: currentBazaarOwnerId
                    };
                    $(this).addClass('marked').text('Unmark');
                }
                localStorage.setItem('tornBazaarMarked', JSON.stringify(markedItems));
                updateQuickBuyList();
            });

            const container = $(this).find('[data-testid="control-panel"]').parent();
            if (container.length) {
                container.css('position', 'relative').prepend(marker);
            }
        });
    }

    function init() {
        extractRFCV();
        const urlMatch = window.location.search.match(/[?&](?:userId|ID)=(\d+)/i) ||
                         window.location.hash.match(/userId[=/](\d+)/i);
        if (urlMatch) currentBazaarOwnerId = urlMatch[1];

        setTimeout(() => {
            createQuickBuyPanel();
            loadBazaarData();

            const observer = new MutationObserver(() => addMarkButtons());
            const targetNode = document.querySelector('[data-testid="items-container"]') || document.body;
            observer.observe(targetNode, { childList: true, subtree: true });

            addMarkButtons();
            setInterval(addMarkButtons, 2000);
            setInterval(() => { if (!rfcvToken) extractRFCV(); }, 1000);
        }, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('load', () => { if (!$('.quick-buy-container').length) init(); });

})();