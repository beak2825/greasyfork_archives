// ==UserScript==
// @name         Torn Bazaar Helper
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Meowy meow
// @author       Meow
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/558608/Torn%20Bazaar%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558608/Torn%20Bazaar%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hash !== '#/add') {
      return;
    }

    GM_addStyle(`
        :root {
            --default-color: #333;
            --default-bg-panel-color: #f2f2f2;
            --default-panel-border-color: #cccccc;
            --input-background-color: #fff;
            --input-color: #000;
            --input-border-color: #ccc;
            --btn-background: linear-gradient(180deg, #DEDEDE 0%, #F7F7F7 25%, #CFCFCF 60%, #E7E7E7 78%, #D9D9D9 100%);
            --btn-border: 1px solid #aaa;
            --btn-color: #555;
            --title-black-gradient: linear-gradient(180deg, #555555 0%, #333333 100%);
            --title-color: #FFF;
        }

        .dark-mode {
            --default-color: #ddd;
            --default-bg-panel-color: #333;
            --default-panel-border-color: #444;
            --input-background-color: #444;
            --input-color: #ddd;
            --input-border-color: #555;
            --btn-background: linear-gradient(180deg, #444 0%, #555 100%);
            --btn-border: 1px solid #222;
            --btn-color: #ccc;
            --title-black-gradient: linear-gradient(180deg, #444 0%, #222 100%);
            --title-color: #ddd;
        }

        .bazaar-helper-btn {
            cursor: pointer;
            margin-right: 10px;
            display: flex;
            align-items: center;
            font-weight: bold;
            color: var(--default-color);
        }
        .bazaar-helper-btn:hover {
            opacity: 0.8;
        }

        #bh-modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99999;
            display: none;
            justify-content: center;
            align-items: center;
        }

        #bh-modal-box {
            background: var(--default-bg-panel-color);
            color: var(--default-color);
            border: 1px solid var(--default-panel-border-color);
            border-radius: 5px;
            width: 400px;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            font-family: Arial, sans-serif;
            overflow: hidden;
        }

        #bh-modal-header {
            background: var(--title-black-gradient);
            color: var(--title-color);
            font-size: 14px;
            font-weight: bold;
            padding: 8px 10px;
            border-bottom: 1px solid var(--default-panel-border-color);
            display: flex;
            align-items: center;
        }

        .bh-modal-content {
            padding: 15px;
        }

        #bh-apikey {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
            background: var(--input-background-color);
            color: var(--input-color);
            border: 1px solid var(--input-border-color);
            border-radius: 3px;
            margin-bottom: 10px;
            font-family: monospace;
        }

        #bh-textarea {
            width: 100%;
            height: 200px;
            resize: vertical;
            padding: 8px;
            box-sizing: border-box;
            background: var(--input-background-color);
            color: var(--input-color);
            border: 1px solid var(--input-border-color);
            border-radius: 3px;
            margin-bottom: 15px;
            font-family: monospace;
        }

        .bh-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .bh-btn {
            padding: 6px 15px;
            background: var(--btn-background);
            border: var(--btn-border);
            color: var(--btn-color);
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
        }

        .bh-btn:hover {
            filter: brightness(1.1);
        }

        .bh-btn-run {
            background: linear-gradient(to bottom, #8fce00 0%, #6da203 100%);
            color: white;
            border: 1px solid #568203;
            text-shadow: 0 1px 0 #333;
        }
    `);

    function setReactInput(element, value) {
        if (!element) return;
        const lastValue = element.value;
        element.value = value;
        const event = new Event('input', { bubbles: true });
        const tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);
    }

    function init() {
        const manageLink = document.querySelector('a[href="#/manage"]');

        if (!manageLink) {
            setTimeout(init, 500);
            return;
        }

        const linkContainer = manageLink.parentNode;

        if (document.getElementById('bazaar-helper-btn')) return;

        const btn = document.createElement('a');
        btn.id = 'bazaar-helper-btn';
        btn.className = manageLink.className;
        btn.innerHTML = `
            <span class="iconWrapper___x3ZLe iconWrapper___COKJD svgIcon___IwbJV">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4L9 9L15 9L20 4V14L12 21L4 14V4Z" />
                    <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none"/>
                    <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none"/>
                </svg>
            </span>
            <span class="linkTitle____NPyM">Bazaar Helper</span>
        `;

        btn.style.cursor = 'pointer';
        btn.style.order = "-1";

        btn.addEventListener('click', toggleModal);

        linkContainer.insertBefore(btn, linkContainer.firstChild);

        createModal();
    }

    function createModal() {
        const overlay = document.createElement('div');
        overlay.id = 'bh-modal-overlay';
        overlay.innerHTML = `
            <div id="bh-modal-box">
                <div id="bh-modal-header">Bazaar Helper</div>
                <div class="bh-modal-content">
                    <div style="font-size:12px; margin-bottom:5px; opacity:0.8;">Torn API Key:</div>
                    <input type="text" id="bh-apikey" placeholder="Enter API Key" />
                    <div style="font-size:12px; margin-bottom:5px; opacity:0.8;">Enter item names (one per line):</div>
                    <textarea id="bh-textarea" placeholder="Bag of Chocolate Kisses\nHPCPU\n..."></textarea>
                    <div class="bh-actions">
                        <button id="bh-close" class="bh-btn">Close</button>
                        <button id="bh-save" class="bh-btn">Save</button>
                        <button id="bh-run" class="bh-btn bh-btn-run">Run</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('bh-close').addEventListener('click', toggleModal);
        document.getElementById('bh-modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'bh-modal-overlay') toggleModal();
        });
        document.getElementById('bh-save').addEventListener('click', saveList);
        document.getElementById('bh-run').addEventListener('click', runScript);

        document.getElementById('bh-textarea').value = GM_getValue('bh_item_list', '');
        document.getElementById('bh-apikey').value = GM_getValue('bh_api_key', '');
    }

    function toggleModal() {
        const el = document.getElementById('bh-modal-overlay');
        el.style.display = el.style.display === 'flex' ? 'none' : 'flex';
    }

    function saveList() {
        const text = document.getElementById('bh-textarea').value;
        const key = document.getElementById('bh-apikey').value;
        GM_setValue('bh_item_list', text);
        GM_setValue('bh_api_key', key);
        const btn = document.getElementById('bh-save');
        const originalText = btn.innerText;
        btn.innerText = "Saved!";
        setTimeout(() => btn.innerText = originalText, 1000);
    }

    async function runScript() {
        saveList();

        const apiKey = GM_getValue('bh_api_key', '').trim();
        if (!apiKey) {
            alert('Bazaar Helper: Please enter your Torn API Key.');
            return;
        }

        const rawList = document.getElementById('bh-textarea').value;
        const wantedItems = rawList.split('\n')
            .map(s => s.trim().toLowerCase())
            .filter(s => s.length > 0);

        if (wantedItems.length === 0) {
            alert('Bazaar Helper: No items in list.');
            return;
        }

        const btnRun = document.getElementById('bh-run');
        const originalText = btnRun.innerText;
        btnRun.innerText = "Fetching...";
        btnRun.disabled = true;

        try {
            const response = await fetch('https://api.torn.com/v2/user?selections=bazaar', {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'ApiKey ' + apiKey
                }
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const data = await response.json();
            const currentBazaarItems = data.bazaar || [];
            const existingItemNames = new Set(currentBazaarItems.map(item => item.name.toLowerCase()));

            const itemsToProcess = wantedItems.filter(item => !existingItemNames.has(item));

            toggleModal();

            if (itemsToProcess.length === 0) {
                console.log('Bazaar Helper: All items in list are already in the bazaar.');
            }

            const itemRows = document.querySelectorAll('ul.items-cont > li');
            let processedCount = 0;

            itemRows.forEach(row => {
                const nameEl = row.querySelector('.name-wrap .t-overflow');
                if (!nameEl) return;

                const itemName = nameEl.textContent.trim().toLowerCase();

                if (itemsToProcess.includes(itemName)) {

                    const qtyInput = row.querySelector('input[name="amount"]');

                    if (qtyInput && qtyInput.type === 'checkbox') {
                        if (!qtyInput.checked) {
                            qtyInput.click();
                            processedCount++;
                        }
                    } else if (qtyInput && qtyInput.type === 'text') {
                        const qtyDisplay = row.querySelector('.thumbnail .qty');
                        if (qtyDisplay) {
                            const maxQty = qtyDisplay.textContent.replace(/,/g, '').trim();
                            if (qtyInput.value !== maxQty) {
                                setReactInput(qtyInput, 1);
                                processedCount++;
                            }
                        }
                    }

                    const priceInputs = row.querySelectorAll('input.input-money');
                    let priceInput = null;
                    priceInputs.forEach(inp => {
                        if (inp.type === 'text' && inp.placeholder === 'Price') priceInput = inp;
                    });

                    if (priceInput) {
                        setReactInput(priceInput, "1");
                    }
                }
            });

            console.log(`Bazaar Helper: Processed ${processedCount} items.`);

        } catch (error) {
            console.error(error);
            alert('Bazaar Helper: Error fetching API data. Check Key or Console.');
        } finally {
            btnRun.innerText = originalText;
            btnRun.disabled = false;
        }
    }

    init();

})();