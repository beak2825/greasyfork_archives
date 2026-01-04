// ==UserScript==
// @name        Plushie & Flower Profit Calculator PC/PDA
// @namespace   https://tornexchange.com/
// @version     1.5.1
// @description A profit calculator that displays a full table with real-time market values from Torn API.
// @author      WTV [3281931]
// @match       https://www.torn.com/*
// @grant       GM.addStyle
// @grant       GM.xmlHttpRequest
// @grant       GM.getValue
// @grant       GM.setValue
// @run-at      document-idle
// @connect     api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/549875/Plushie%20%20Flower%20Profit%20Calculator%20PCPDA.user.js
// @updateURL https://update.greasyfork.org/scripts/549875/Plushie%20%20Flower%20Profit%20Calculator%20PCPDA.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let apiKey;
    const TORN_API_MARKET_ENDPOINT = 'https://api.torn.com/v2/market/';
    let itemsWithPrices = [];

    const PLUSHIES = [
        { name: 'Sheep', id: '186' },
        { name: 'Teddy Bear', id: '187' },
        { name: 'Kitten', id: '215' },
        { name: 'Jaguar', id: '258' },
        { name: 'Wolverine', id: '261' },
        { name: 'Nessie', id: '266' },
        { name: 'Red Fox', id: '268' },
        { name: 'Monkey', id: '269' },
        { name: 'Chamois', id: '273' },
        { name: 'Panda', id: '274' },
        { name: 'Lion', id: '281' },
        { name: 'Camel', id: '384' },
        { name: 'Stingray', id: '618' }
    ];

    const FLOWERS = [
        { name: 'Dahlia', id: '260' },
        { name: 'Orchid', id: '264' },
        { name: 'African Violet', id: '282' },
        { name: 'Cherry Blossom', id: '277' },
        { name: 'Peony', id: '276' },
        { name: 'Ceibo Flower', id: '271' },
        { name: 'Edelweiss', id: '272' },
        { name: 'Crocus', id: '263' },
        { name: 'Heather', id: '267' },
        { name: 'Tribulus', id: '385' },
        { name: 'Banana', id: '617' }
    ];

    GM.addStyle(`
        #profit-toggle-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px;
            font-weight: bold;
            cursor: pointer;
            z-index: 100000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        #profit-calculator-modal, #consent-modal, #api-key-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            /* background-color: rgba(0, 0, 0, 0.8); */
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 100001;
            padding: 10px;
            pointer-events: none; /* Allows clicks to pass through */
        }
        #profit-calculator-window, #consent-window, #api-key-window {
            background-color: #2f2f2f;
            color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
            position: relative;
            pointer-events: auto; /* Re-enables clicks for the window itself */
        }
        #profit-calculator-modal {
            justify-content: flex-end;
        }
        #profit-calculator-window {
            margin-right: 20px;
            max-width: 400px;
        }
        #consent-window, #api-key-window {
            text-align: center;
            margin: auto;
        }
        #consent-window h2, #api-key-window h2 {
            margin-top: 0;
            color: #007bff;
        }
        #consent-window p, #api-key-window p {
            line-height: 1.5;
        }
        #consent-window button, #api-key-window button {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 15px;
        }
        #api-key-window input {
            width: 90%;
            padding: 8px;
            margin-top: 10px;
            border-radius: 4px;
            border: none;
            background-color: #444;
            color: #fff;
        }
        #api-key-window .button-group {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
        }
        #api-key-window #save-key-btn {
            background-color: #28a745;
        }
        #api-key-window #cancel-key-btn {
            background-color: #6c757d;
        }
        #profit-calculator-window .header {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #profit-calculator-window .close-btn {
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
        }
        .input-container {
            margin-bottom: 10px;
        }
        .category-buttons {
            display: flex;
            justify-content: center;
            gap: 5px;
            margin-bottom: 10px;
        }
        .category-buttons button {
            flex: 1;
            background-color: #444;
            color: #fff;
            border: none;
            padding: 5px;
            border-radius: 4px;
            cursor: pointer;
        }
        .category-buttons button.active {
            background-color: #007bff;
        }
        #profit-calculator-window input {
            width: 100px;
            padding: 5px;
            border-radius: 4px;
            border: none;
            background-color: #444;
            color: #fff;
        }
        #profit-calculator-window table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        #profit-calculator-window th,
        #profit-calculator-window td {
            color: #fff;
            padding: 5px;
            text-align: left;
            border-bottom: 1px solid #444;
            white-space: nowrap;
        }
        #profit-calculator-window th {
            background-color: #1a1a1a;
        }
        #profit-calculator-window a {
            color: #007bff;
            text-decoration: none;
        }
        #profit-calculator-window a:hover {
            text-decoration: underline;
        }
        #profit-calculator-window .profit-positive {
            color: #4CAF50;
        }
        #profit-calculator-window .profit-negative {
            color: #F44336;
        }
        #fetch-all-prices-btn {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }
        #profit-calculator-window h3 {
            margin: 0;
            margin-top: 10px;
            font-size: 14px;
        }
        #profit-calculator-window .total-price-display {
            font-weight: bold;
            text-align: center;
            padding: 5px;
            border-bottom: 1px solid #444;
        }
        #remove-api-key-btn {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
        }
        .hidden {
            display: none !important;
        }
    `);

    async function getLowestBazaarPrice(itemId) {
        return new Promise((resolve, reject) => {
            if (!apiKey) {
                resolve(null);
                return;
            }

            GM.xmlHttpRequest({
                method: "GET",
                url: `${TORN_API_MARKET_ENDPOINT}${itemId}/itemmarket?key=${apiKey}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            console.error("Torn API Error:", data.error.error);
                            alert("API Error: " + data.error.error);
                            resolve(null);
                        } else if (data && data.itemmarket && data.itemmarket.listings && data.itemmarket.listings.length > 0) {
                            const lowestListing = data.itemmarket.listings[0];
                            resolve(lowestListing.price);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        console.error("Failed to parse API response:", e);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error("Network error fetching prices:", error);
                    resolve(null);
                }
            });
        });
    }

    function buildTable(container, itemList, title, pointPrice, tableId, isHidden) {
        let sectionDiv = document.getElementById(tableId);
        if (!sectionDiv) {
            sectionDiv = document.createElement('div');
            sectionDiv.id = tableId;
            container.appendChild(sectionDiv);
        }
        if (isHidden) {
            sectionDiv.classList.add('hidden');
        } else {
            sectionDiv.classList.remove('hidden');
        }

        sectionDiv.innerHTML = '';

        const sectionHeader = document.createElement('h3');
        sectionHeader.textContent = title;
        sectionDiv.appendChild(sectionHeader);

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        thead.innerHTML = `
            <tr>
                <th>Item</th>
                <th>MV</th>
            </tr>
        `;
        table.appendChild(thead);
        table.appendChild(tbody);

        let totalSetValue = 0;

        itemList.forEach(item => {
            const tr = document.createElement('tr');
            let bazaarPriceDisplay = 'N/A';

            const itemData = itemsWithPrices.find(i => i.id === item.id);
            if (itemData && itemData.bazaarPrice !== null) {
                bazaarPriceDisplay = `$${itemData.bazaarPrice.toLocaleString()}`;
                totalSetValue += itemData.bazaarPrice;
            }

            tr.innerHTML = `
                <td><a href="https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${item.id}" target="_blank">${item.name}</a></td>
                <td>${bazaarPriceDisplay}</td>
            `;
            tbody.appendChild(tr);
        });

        const totalPointValue = pointPrice * 10;
        const totalProfit = totalPointValue - totalSetValue;
        let totalProfitPercentage = 0;
        if (totalSetValue > 0) {
            totalProfitPercentage = (totalProfit / totalSetValue) * 100;
        }

        const totalValueRow = document.createElement('div');
        totalValueRow.className = 'total-price-display';
        totalValueRow.innerHTML = `
            <div>Total Set Value: $${totalSetValue.toLocaleString()}</div>
            <div>Total Points Value: $${totalPointValue.toLocaleString()}</div>
        `;
        sectionDiv.appendChild(totalValueRow);

        const totalProfitRow = document.createElement('div');
        totalProfitRow.className = 'total-price-display';
        const totalProfitClass = totalProfit >= 0 ? 'profit-positive' : 'profit-negative';
        totalProfitRow.innerHTML = `
            Total Profit: <span class="${totalProfitClass}">$${totalProfit.toLocaleString()}</span>
            <span class="${totalProfitClass}">(${totalProfitPercentage.toFixed(2)}%)</span>
        `;
        sectionDiv.appendChild(totalProfitRow);

        sectionDiv.appendChild(table);
    }

    function initializeUI() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'profit-toggle-button';
        toggleBtn.textContent = 'Profit';
        document.body.appendChild(toggleBtn);

        const modal = document.createElement('div');
        modal.id = 'profit-calculator-modal';
        document.body.appendChild(modal);

        const windowDiv = document.createElement('div');
        windowDiv.id = 'profit-calculator-window';
        modal.appendChild(windowDiv);

        const titleHeader = document.createElement('div');
        titleHeader.className = 'header';
        titleHeader.innerHTML = `
            <span>Price Tracker</span>
            <button class="close-btn">&times;</button>
        `;
        windowDiv.appendChild(titleHeader);

        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        inputContainer.innerHTML = `
            <span>Point Price:</span>
            <input type="number" id="point-price-input" value="30000">
        `;
        windowDiv.appendChild(inputContainer);

        const categoryButtons = document.createElement('div');
        categoryButtons.className = 'category-buttons';
        categoryButtons.innerHTML = `
            <button id="plushies-btn" class="active">Plushies</button>
            <button id="flowers-btn">Flowers</button>
        `;
        windowDiv.appendChild(categoryButtons);

        const fetchBtn = document.createElement('button');
        fetchBtn.id = 'fetch-all-prices-btn';
        fetchBtn.textContent = 'Fetch All Prices';
        windowDiv.appendChild(fetchBtn);

        const tablesContainer = document.createElement('div');
        tablesContainer.className = 'tables-container';
        windowDiv.appendChild(tablesContainer);

        const removeKeyBtn = document.createElement('button');
        removeKeyBtn.id = 'remove-api-key-btn';
        removeKeyBtn.textContent = 'Remove API Key';
        windowDiv.appendChild(removeKeyBtn);

        const closeBtn = windowDiv.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        toggleBtn.addEventListener('click', async () => {
            await checkAndPromptApiKey();
            if (apiKey) {
                modal.style.display = 'flex';
                if (itemsWithPrices.length === 0) {
                    await fetchAndRenderTables();
                }
            }
        });

        removeKeyBtn.addEventListener('click', async () => {
            await removeApiKey();
        });

        const plushiesBtn = document.getElementById('plushies-btn');
        const flowersBtn = document.getElementById('flowers-btn');
        const pointPriceInput = document.getElementById('point-price-input');

        const renderTables = () => {
            const pointPrice = parseInt(pointPriceInput.value) || 0;
            buildTable(tablesContainer, PLUSHIES, 'Plushies', pointPrice, 'plushies-table', false);
            buildTable(tablesContainer, FLOWERS, 'Flowers', pointPrice, 'flowers-table', true);
        };

        const toggleCategory = (category) => {
            const plushiesTable = document.getElementById('plushies-table');
            const flowersTable = document.getElementById('flowers-table');

            if (!plushiesTable || !flowersTable) {
                return;
            }

            if (category === 'plushies') {
                plushiesTable.classList.remove('hidden');
                flowersTable.classList.add('hidden');
                plushiesBtn.classList.add('active');
                flowersBtn.classList.remove('active');
            } else if (category === 'flowers') {
                plushiesTable.classList.add('hidden');
                flowersTable.classList.remove('hidden');
                plushiesBtn.classList.remove('active');
                flowersBtn.classList.add('active');
            }
        };

        plushiesBtn.addEventListener('click', () => toggleCategory('plushies'));
        flowersBtn.addEventListener('click', () => toggleCategory('flowers'));
        pointPriceInput.addEventListener('input', renderTables);

        const fetchAndRenderTables = async () => {
            if (!apiKey) {
                tablesContainer.innerHTML = '<p style="color: red; text-align: center;">An API key is required to fetch prices.</p>';
                return;
            }

            fetchBtn.textContent = 'Fetching...';
            fetchBtn.disabled = true;
            tablesContainer.innerHTML = '<p style="text-align: center;">Fetching prices, please wait...</p>';

            const allItems = [...PLUSHIES, ...FLOWERS];
            const fetchPromises = allItems.map(async item => {
                const bazaarPrice = await getLowestBazaarPrice(item.id);
                return {
                    ...item,
                    bazaarPrice: bazaarPrice
                };
            });

            itemsWithPrices = await Promise.all(fetchPromises);

            tablesContainer.innerHTML = '';
            renderTables();
            toggleCategory('plushies');

            fetchBtn.textContent = 'Fetch All Prices';
            fetchBtn.disabled = false;
        };

        fetchBtn.addEventListener('click', fetchAndRenderTables);
    }

    async function showConsentModal() {
        return new Promise(resolve => {
            const consentModal = document.createElement('div');
            consentModal.id = 'consent-modal';
            document.body.appendChild(consentModal);

            const consentWindow = document.createElement('div');
            consentWindow.id = 'consent-window';
            consentWindow.innerHTML = `
                <h2>Museum Profit Calculator API Key Usage</h2>
                <p>This script requires a <strong>public</strong> Torn City API key to fetch real-time market prices.</p>
                <p><strong>Disclaimer:</strong> Your API key is stored locally in your browser and is only used to fetch item prices for this calculator. It is not shared with anyone.</p>
                <p>You can find your key on your <a href="https://www.torn.com/preferences.php#tab=api" target="_blank">Torn API Access page</a>.</p>
                <button id="consent-ok-btn">Acknowledge & Continue</button>
            `;
            consentModal.appendChild(consentWindow);
            consentModal.style.display = 'flex';

            document.getElementById('consent-ok-btn').addEventListener('click', () => {
                consentModal.remove();
                GM.setValue('tornApiConsent', true).then(resolve);
            });
        });
    }

    async function showApiKeyModal() {
        return new Promise(resolve => {
            const modal = document.createElement('div');
            modal.id = 'api-key-modal';
            document.body.appendChild(modal);

            const modalWindow = document.createElement('div');
            modalWindow.id = 'api-key-window';
            modalWindow.innerHTML = `
                <h2>Enter Torn City API Key</h2>
                <p>A public key is needed to pull market values.</p>
                <p><strong>Disclaimer:</strong> This key is stored locally and is not shared. It is only used for this script to fetch real-time prices.</p>
                <p>You can find your key on your <a href="https://www.torn.com/preferences.php#tab=api" target="_blank">Torn API Access page</a>.</p>
                <input type="text" id="api-key-input" placeholder="Enter your API key here">
                <div class="button-group">
                    <button id="save-key-btn">Save</button>
                    <button id="cancel-key-btn">Cancel</button>
                </div>
            `;
            modal.appendChild(modalWindow);
            modal.style.display = 'flex';

            const saveBtn = document.getElementById('save-key-btn');
            const cancelBtn = document.getElementById('cancel-key-btn');
            const keyInput = document.getElementById('api-key-input');

            saveBtn.addEventListener('click', () => {
                const enteredKey = keyInput.value.trim();
                modal.remove();
                resolve(enteredKey);
            });

            cancelBtn.addEventListener('click', () => {
                modal.remove();
                resolve(null);
            });
        });
    }

    async function checkAndPromptApiKey() {
        const consentGiven = await GM.getValue('tornApiConsent', false);
        if (!consentGiven) {
            await showConsentModal();
        }

        apiKey = await GM.getValue('tornApiKey', null);
        if (!apiKey) {
            const enteredKey = await showApiKeyModal();
            if (enteredKey) {
                await GM.setValue('tornApiKey', enteredKey);
                apiKey = enteredKey;
            } else {
                alert("API key is required to use this script.");
            }
        }
    }

    async function removeApiKey() {
        const confirmation = window.confirm("Are you sure you want to remove your stored API key? You will need to re-enter it next time you use the calculator.");
        if (confirmation) {
            await GM.setValue('tornApiKey', null);
            apiKey = null;
            alert("API key has been removed. The calculator will now prompt you for a new key.");
        }
    }

    initializeUI();
})();