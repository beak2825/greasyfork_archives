// ==UserScript==
// @name         Torn Dump Market Value
// @namespace    https://torn.com
// @version      1.10
// @description  Shows the market value of items found in the dump
// @author       ANITABURN
// @match        https://www.torn.com/dump.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558973/Torn%20Dump%20Market%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/558973/Torn%20Dump%20Market%20Value.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'tornDumpApiKey';

    GM_addStyle(`
        .dump-mv-btn {
            background: #e168ff;
            border: none;
            border-radius: 3px;
            color: white;
            padding: 2px 8px;
            cursor: pointer;
            font-size: 11px;
            font-family: Arial, sans-serif;
            line-height: 18px;
        }

        .dump-mv-btn-secondary {
            background: #68acff;
        }

        #dump-api-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }

        #dump-api-popup .popup-content {
            background: #3a3a3a;
            border: 2px solid #68ebff;
            border-radius: 8px;
            padding: 20px;
            min-width: 300px;
            color: #ddd;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        #dump-api-popup h3 {
            margin: 0 0 15px 0;
            color: #68ebff;
        }

        #dump-api-popup p {
            margin: 0 0 10px 0;
            font-size: 12px;
            color: #aaa;
        }

        #dump-api-popup input {
            width: 100%;
            padding: 6px;
            margin-bottom: 15px;
            background: #333;
            border: 1px solid #666;
            border-radius: 3px;
            color: #ddd;
            box-sizing: border-box;
            font-size: 12px;
        }

        #dump-api-popup input:focus {
            outline: none;
            border-color: #68ebff;
        }

        #dump-market-value {
            color: #68ebff;
            font-size: 16px;
            font-weight: bold;
            margin-top: 5px;
            clear: both;
        }

        #dump-api-popup .button-row {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
    `);

    function getApiKey() {
        return GM_getValue(STORAGE_KEY, '');
    }

    function setApiKey(key) {
        GM_setValue(STORAGE_KEY, key);
    }

    function showApiKeyPopup() {
        const existingPopup = document.getElementById('dump-api-popup');
        if (existingPopup) existingPopup.remove();

        const overlay = document.createElement('div');
        overlay.id = 'dump-api-popup';

        const currentKey = getApiKey();
        overlay.innerHTML = `
            <div class="popup-content">
                <h3>API Key Settings</h3>
                <p>Enter your Public or Limited API key:</p>
                <input type="text" id="dump-api-input" value="${currentKey}" placeholder="Enter API key...">
                <div class="button-row">
                    <button id="dump-api-cancel" class="dump-mv-btn dump-mv-btn-secondary">Cancel</button>
                    <button id="dump-api-save" class="dump-mv-btn">Save</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('dump-api-cancel').addEventListener('click', () => overlay.remove());
        document.getElementById('dump-api-save').addEventListener('click', () => {
            const newKey = document.getElementById('dump-api-input').value.trim();
            setApiKey(newKey);
            overlay.remove();
            checkForItem();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    function addApiKeyButton() {
        const header = document.querySelector('.search-block-header');
        if (!header || document.getElementById('dump-api-key-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'dump-api-key-btn';
        btn.className = 'dump-mv-btn';
        btn.textContent = 'API KEY';
        btn.style.cssText = 'float: right; margin-right: 10px; margin-top: 3px;';
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showApiKeyPopup();
        });

        header.appendChild(btn);
    }

    function addMarketValueDisplay(price) {
        const existingDisplay = document.getElementById('dump-market-value');
        if (existingDisplay) existingDisplay.remove();

        const searchInfo = document.querySelector('.search-info');
        if (!searchInfo) return;

        const valueDiv = document.createElement('div');
        valueDiv.id = 'dump-market-value';
        valueDiv.textContent = `MARKET VALUE: $${Math.round(price).toLocaleString()}`;

        const searchResult = searchInfo.querySelector('.search-result');
        if (searchResult) {
            searchResult.after(valueDiv);
        } else {
            searchInfo.appendChild(valueDiv);
        }
    }

    function removeMarketValueDisplay() {
        const existingDisplay = document.getElementById('dump-market-value');
        if (existingDisplay) existingDisplay.remove();
    }

    async function fetchMarketValue(itemId) {
        const apiKey = getApiKey();
        if (!apiKey) {
            console.log('Dump Market Value: No API key set');
            return null;
        }

        try {
            const response = await fetch(`https://api.torn.com/v2/market/${itemId}/itemmarket?key=${apiKey}`);
            const data = await response.json();

            if (data.error) {
                console.error('Dump Market Value: API Error', data.error);
                return null;
            }

            if (data.itemmarket && data.itemmarket.item) {
                return data.itemmarket.item.average_price;
            }
        } catch (error) {
            console.error('Dump Market Value: Fetch error', error);
        }

        return null;
    }

    function getItemIdFromPage() {
        const searcherImg = document.querySelector('.searcher-wrapper .searcher img.torn-item');
        if (!searcherImg) return null;

        const src = searcherImg.getAttribute('src');
        if (!src) return null;

        const match = src.match(/images\/items\/(\d+)\//);
        return match ? match[1] : null;
    }

    function isItemFound() {
        const searcher = document.querySelector('.searcher-wrapper .searcher');
        const searchResult = document.querySelector('.search-result');
        return searcher &&
               searcher.classList.contains('item-found') &&
               searchResult &&
               searchResult.style.display !== 'none';
    }

    async function checkForItem() {
        if (!isItemFound()) {
            removeMarketValueDisplay();
            return;
        }

        const itemId = getItemIdFromPage();
        if (!itemId) return;

        const price = await fetchMarketValue(itemId);
        if (price !== null) {
            addMarketValueDisplay(price);
        }
    }

    function init() {
        addApiKeyButton();
        checkForItem();

        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    shouldCheck = true;
                    break;
                }
            }
            if (shouldCheck) {
                addApiKeyButton();
                checkForItem();
            }
        });

        const dumpContainer = document.querySelector('.dump-main-page') || document.body;
        observer.observe(dumpContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();