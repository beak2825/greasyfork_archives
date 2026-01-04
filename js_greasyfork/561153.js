// ==UserScript==
// @name         Torn Museum Collection Market Values
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Display market value vs points value for all museum collections 
// @author       ANITABURN
// @match        https://www.torn.com/museum.php*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/561153/Torn%20Museum%20Collection%20Market%20Values.user.js
// @updateURL https://update.greasyfork.org/scripts/561153/Torn%20Museum%20Collection%20Market%20Values.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'torn_museum_api_key';
    const TAX_SETTING_KEY = 'torn_museum_show_after_tax';

    const ITEM_QUANTITIES = {
        460: 5,
        461: 5
    };

    function getApiKey() {
        return localStorage.getItem(STORAGE_KEY);
    }

    function saveApiKey(key) {
        localStorage.setItem(STORAGE_KEY, key);
    }

    function removeApiKey() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function getShowAfterTax() {
        return localStorage.getItem(TAX_SETTING_KEY) === 'true';
    }

    function setShowAfterTax(value) {
        localStorage.setItem(TAX_SETTING_KEY, value);
    }

    function applyTax(price) {
        return Math.floor(price * 0.95);
    }

    const COLLECTIONS = {
        plushie: {
            selector: '#plushie',
            pointsPerSet: 10
        },
        flower: {
            selector: '#flower',
            pointsPerSet: 10
        },
        meteorite: {
            selector: '#meteorite',
            pointsPerSet: 15
        },
        fossil: {
            selector: '#fossil',
            pointsPerSet: 20
        },
        arrowhead: {
            selector: '#arrowhead',
            pointsPerSet: 25
        },
        coin: {
            selector: '#coin',
            pointsPerSet: 100
        },
        buddha: {
            selector: '#buddha',
            pointsPerSet: 100
        },
        ganesha: {
            selector: '#ganesha',
            pointsPerSet: 250
        },
        shabti: {
            selector: '#shabti',
            pointsPerSet: 500
        },
        scripts: {
            selector: '#scripts',
            pointsPerSet: 1000
        },
        game: {
            selector: '#game',
            pointsPerSet: 2000
        },
        amulet: {
            selector: '#amulet',
            pointsPerSet: 10000
        }
    };

    const collectionData = {};

    function showSettingsModal() {
        const existingModal = document.querySelector('.settings-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const currentKey = getApiKey() || '';
        const showAfterTax = getShowAfterTax();

        const modal = document.createElement('div');
        modal.className = 'settings-modal';
        modal.innerHTML = `
            <div class="settings-modal-content">
                <h3 style="margin-top: 0; color: #e168ff;">Museum Settings</h3>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; color: #fff;">API Key:</label>
                    <input type="text" id="settings-apikey-input" placeholder="Your API Key" value="${currentKey}" style="width: 100%; padding: 8px; background: #1a1a1a; border: 1px solid #555; color: #fff; font-size: 14px; box-sizing: border-box; border-radius: 3px;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; color: #fff; cursor: pointer;">
                        <input type="checkbox" id="settings-tax-checkbox" ${showAfterTax ? 'checked' : ''} style="margin-right: 8px; cursor: pointer;">
                        Show prices after 5% tax deduction
                    </label>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="settings-clear" style="padding: 8px 15px; background: #d9534f; color: #fff; border: 1px solid #c9302c; cursor: pointer; border-radius: 3px;">Clear API Key</button>
                    <button id="settings-cancel" style="padding: 8px 15px; background: #444; color: #fff; border: 1px solid #666; cursor: pointer; border-radius: 3px;">Cancel</button>
                    <button id="settings-save" style="padding: 8px 15px; background: #5cb85c; color: #fff; border: 1px solid #4cae4c; cursor: pointer; border-radius: 3px;">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('settings-save').addEventListener('click', () => {
            const key = document.getElementById('settings-apikey-input').value.trim();
            const taxChecked = document.getElementById('settings-tax-checkbox').checked;

            if (key) {
                saveApiKey(key);
            }
            setShowAfterTax(taxChecked);

            modal.remove();
            location.reload();
        });

        document.getElementById('settings-clear').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your API key?')) {
                removeApiKey();
                document.getElementById('settings-apikey-input').value = '';
            }
        });

        document.getElementById('settings-cancel').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    function addSettingsButton() {
        setTimeout(() => {
            const titleBlack = document.querySelector('.title-black');
            if (!titleBlack) return;

            const existingButton = document.querySelector('.settings-config-btn');
            if (existingButton) {
                existingButton.remove();
            }

            const button = document.createElement('span');
            button.className = 'settings-config-btn';
            button.innerHTML = '⚙️';
            button.title = 'Museum Settings';
            button.style.cssText = 'cursor: pointer; font-size: 16px; margin-right: 10px;';

            button.addEventListener('click', showSettingsModal);
            titleBlack.insertBefore(button, titleBlack.firstChild);
        }, 100);
    }

    function addPointsMarketHeader(pointsPrice) {
        setTimeout(() => {
            const titleBlack = document.querySelector('.title-black');
            if (!titleBlack) return;

            const existingHeader = titleBlack.querySelector('.points-market-header');
            if (existingHeader) {
                existingHeader.remove();
            }

            const showAfterTax = getShowAfterTax();
            const displayPrice = showAfterTax ? applyTax(pointsPrice) : pointsPrice;

            const headerSpan = document.createElement('span');
            headerSpan.className = 'points-market-header';
            headerSpan.textContent = `Points Market: ${formatCurrency(displayPrice)}`;
            headerSpan.style.cssText = 'float: right; color: #e168ff; font-size: 12px; font-weight: bold; margin-right: 10px;';

            titleBlack.appendChild(headerSpan);
        }, 100);
    }

    async function fetchItemPrice(apiKey, itemId) {
        const API_URL = `https://api.torn.com/v2/market/${itemId}/itemmarket?limit=1&offset=0&key=${apiKey}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: API_URL,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            if (data.error.code === 2) {
                                removeApiKey();
                                alert('Invalid API key. Please set a valid key.');
                            }
                            reject(data.error);
                        } else {
                            const price = data.itemmarket.listings && data.itemmarket.listings.length > 0
                                ? data.itemmarket.listings[0].price
                                : 0;
                            resolve(price);
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    async function fetchPointsPrice(apiKey) {
        const API_URL = `https://api.torn.com/v2/market?selections=pointsmarket&limit=1&sort=ASC&key=${apiKey}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: API_URL,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            reject(data.error);
                        } else {
                            const pointsmarket = data.pointsmarket;
                            const firstListing = Object.values(pointsmarket)[0];
                            resolve(firstListing ? firstListing.cost : 0);
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function formatCurrency(amount) {
        return '$' + amount.toLocaleString();
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .market-value-label {
                text-align: center;
                color: #68acff !important;
                font-size: 13px;
                font-weight: bold;
                margin-top: 10px;
                margin-bottom: 15px;
                padding: 5px 0;
                line-height: 1.2;
                text-shadow: 0 0 3px rgba(104, 172, 255, 0.5);
                position: relative;
                z-index: 10;
            }
            #plushie .item-wrapper,
            #flower .item-wrapper,
            #meteorite .item-wrapper,
            #fossil .item-wrapper,
            #arrowhead .item-wrapper,
            #coin .item-wrapper,
            #buddha .item-wrapper,
            #ganesha .item-wrapper,
            #shabti .item-wrapper,
            #scripts .item-wrapper,
            #game .item-wrapper,
            #amulet .item-wrapper {
                margin-bottom: 20px !important;
                min-height: 120px !important;
            }
            #plushie .item-wrapper .item-cont-wrap,
            #flower .item-wrapper .item-cont-wrap,
            #meteorite .item-wrapper .item-cont-wrap,
            #fossil .item-wrapper .item-cont-wrap,
            #arrowhead .item-wrapper .item-cont-wrap,
            #coin .item-wrapper .item-cont-wrap,
            #buddha .item-wrapper .item-cont-wrap,
            #ganesha .item-wrapper .item-cont-wrap,
            #shabti .item-wrapper .item-cont-wrap,
            #scripts .item-wrapper .item-cont-wrap,
            #game .item-wrapper .item-cont-wrap,
            #amulet .item-wrapper .item-cont-wrap {
                padding-bottom: 20px !important;
            }
            #plushie .item-wrapper .coll-item-header,
            #flower .item-wrapper .coll-item-header,
            #meteorite .item-wrapper .coll-item-header,
            #fossil .item-wrapper .coll-item-header,
            #arrowhead .item-wrapper .coll-item-header,
            #coin .item-wrapper .coll-item-header,
            #buddha .item-wrapper .coll-item-header,
            #ganesha .item-wrapper .coll-item-header,
            #shabti .item-wrapper .coll-item-header,
            #scripts .item-wrapper .coll-item-header,
            #game .item-wrapper .coll-item-header,
            #amulet .item-wrapper .coll-item-header {
                margin-bottom: 5px !important;
            }
            .collection-totals {
                text-align: center;
                margin-top: 25px;
                padding: 15px;
                font-size: 14px;
            }
            .collection-totals .points-exchange {
                color: #e168ff;
                font-weight: bold;
                margin-bottom: 8px;
            }
            .collection-totals .market-total {
                color: #68acff;
                font-weight: bold;
            }
            .settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
            }
            .settings-modal-content {
                background: #2e2e2e;
                padding: 25px;
                border-radius: 5px;
                color: #fff;
                min-width: 400px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            }
            .settings-modal-content button {
                transition: opacity 0.2s;
            }
            .settings-modal-content button:hover {
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
    }

    async function addMarketValuesForCollection(collectionKey) {
        const apiKey = getApiKey();
        if (!apiKey) return;

        const config = COLLECTIONS[collectionKey];
        if (!config) return;

        try {
            const itemWrappers = document.querySelectorAll(`${config.selector} .item-wrapper`);
            const itemIds = [];

            itemWrappers.forEach(wrapper => {
                const itemId = wrapper.getAttribute('itemid');
                if (itemId) {
                    itemIds.push(itemId);
                }
            });

            const pointsPrice = await fetchPointsPrice(apiKey);

            const pricePromises = itemIds.map(itemId => fetchItemPrice(apiKey, itemId));
            const prices = await Promise.all(pricePromises);

            const priceMap = {};
            itemIds.forEach((itemId, index) => {
                priceMap[itemId] = prices[index];
            });

            const showAfterTax = getShowAfterTax();
            let totalMarketValue = 0;

            itemWrappers.forEach(wrapper => {
                const itemId = wrapper.getAttribute('itemid');

                if (itemId && priceMap[itemId] !== undefined) {
                    const existingLabel = wrapper.querySelector('.market-value-label');
                    if (existingLabel) {
                        existingLabel.remove();
                    }

                    let marketPrice = priceMap[itemId];
                    if (showAfterTax) {
                        marketPrice = applyTax(marketPrice);
                    }

                    const quantity = ITEM_QUANTITIES[itemId] || 1;
                    const totalItemPrice = marketPrice * quantity;

                    totalMarketValue += totalItemPrice;

                    const priceLabel = document.createElement('div');
                    priceLabel.className = 'market-value-label';
                    priceLabel.textContent = formatCurrency(totalItemPrice);

                    const imgWrapper = wrapper.querySelector('.img-wrapper');
                    if (imgWrapper) {
                        imgWrapper.parentNode.insertBefore(priceLabel, imgWrapper.nextSibling);
                    }
                }
            });

            collectionData[collectionKey] = {
                totalMarketValue: totalMarketValue,
                pointsPrice: pointsPrice,
                pointsPerSet: config.pointsPerSet
            };

            addPointsMarketHeader(pointsPrice);
            updateTotalsSection(collectionKey);
            setupInputListener(collectionKey);

        } catch (error) {
            console.error(`Error loading ${collectionKey} market values:`, error);
        }
    }

    function updateTotalsSection(collectionKey, multiplier = 1) {
        const config = COLLECTIONS[collectionKey];
        if (!config) return;

        const data = collectionData[collectionKey];
        if (!data) return;

        const collectionTab = document.querySelector(config.selector);
        if (!collectionTab) return;

        const existingTotals = collectionTab.querySelector('.collection-totals');
        if (existingTotals) {
            existingTotals.remove();
        }

        const showAfterTax = getShowAfterTax();
        let pointsPrice = data.pointsPrice;
        if (showAfterTax) {
            pointsPrice = applyTax(pointsPrice);
        }

        const pointsExchangeValue = pointsPrice * data.pointsPerSet * multiplier;
        const totalMarketValue = data.totalMarketValue * multiplier;

        const totalsDiv = document.createElement('div');
        totalsDiv.className = 'collection-totals';
        totalsDiv.innerHTML = `
            <div class="points-exchange">Points Exchange Value:<br>${formatCurrency(pointsExchangeValue)}</div>
            <div class="market-total">Market Value:<br>${formatCurrency(totalMarketValue)}</div>
        `;

        const setElements = collectionTab.querySelector('.set-elements');
        if (setElements) {
            setElements.appendChild(totalsDiv);
        }
    }

    function setupInputListener(collectionKey) {
        const config = COLLECTIONS[collectionKey];
        if (!config) return;

        const collectionTab = document.querySelector(config.selector);
        if (!collectionTab) return;

        const input = collectionTab.querySelector('.sets-amount[type="tel"]');
        if (!input) return;

        const existingListener = input.getAttribute('data-listener-added');
        if (existingListener) return;

        input.setAttribute('data-listener-added', 'true');

        input.addEventListener('input', () => {
            const value = parseInt(input.value) || 1;
            const multiplier = value > 0 ? value : 1;
            updateTotalsSection(collectionKey, multiplier);
        });

        const observer = new MutationObserver(() => {
            const value = parseInt(input.value) || 1;
            const multiplier = value > 0 ? value : 1;
            updateTotalsSection(collectionKey, multiplier);
        });

        observer.observe(input, {
            attributes: true,
            attributeFilter: ['value']
        });
    }

    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            Object.keys(COLLECTIONS).forEach(collectionKey => {
                const config = COLLECTIONS[collectionKey];
                const collectionTab = document.querySelector(`${config.selector} .set-elements`);
                if (collectionTab && collectionTab.getAttribute('loaded') === '1') {
                    const hasValues = collectionTab.querySelector('.market-value-label');
                    if (!hasValues) {
                        addMarketValuesForCollection(collectionKey);
                    }
                }
            });
        });

        const museumContainer = document.querySelector('#tabs');
        if (museumContainer) {
            observer.observe(museumContainer, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['loaded']
            });
        }
    }

    function init() {
        addStyles();
        addSettingsButton();

        setTimeout(() => {
            Object.keys(COLLECTIONS).forEach(collectionKey => {
                const config = COLLECTIONS[collectionKey];
                const collectionTab = document.querySelector(`${config.selector} .set-elements`);
                if (collectionTab && collectionTab.getAttribute('loaded') === '1') {
                    addMarketValuesForCollection(collectionKey);
                }
            });
        }, 2000);

        setupObserver();

        document.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('li.box');
            if (clickedTab) {
                Object.keys(COLLECTIONS).forEach(collectionKey => {
                    if (clickedTab.classList.contains(collectionKey)) {
                        setTimeout(() => {
                            addMarketValuesForCollection(collectionKey);
                            addSettingsButton();
                        }, 1500);
                    }
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoading', init);
    } else {
        init();
    }
})();