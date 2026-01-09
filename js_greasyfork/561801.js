// ==UserScript==
// @name         Bazaar Market Under-cutter
// @namespace    http://torn.com/
// @author       srsbsns
// @version      3.1
// @description  Restricts undercut to 0 or higher
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561801/Bazaar%20Market%20Under-cutter.user.js
// @updateURL https://update.greasyfork.org/scripts/561801/Bazaar%20Market%20Under-cutter.meta.js
// ==/UserScript==

(() => {
    GM_addStyle(`
        .undercut-container {
            display: inline-flex !important;
            align-items: center !important;
            background: #11113B !important;
            border: 1px solid #000 !important;
            border-radius: 4px !important;
            overflow: hidden !important;
            margin-left: 5px !important;
            height: 24px !important;
        }
        .undercut-action-btn {
            padding: 0 5px !important;
            color: #fff !important;
            cursor: pointer !important;
            font-size: 11px !important;
            font-weight: bold !important;
            line-height: 24px !important;
            user-select: none !important;
        }
        .undercut-amount-input {
            width: 45px !important;
            height: 20px !important;
            border: none !important;
            background: #fff !important;
            color: #000 !important;
            font-size: 11px !important;
            text-align: center !important;
            margin: 0 2px !important;
            padding: 0 !important;
            border-radius: 2px !important;
        }
    `);

    async function performUndercut(row, input, actionBtn) {
        const key = GM_getValue('torn.apiKey', '');
        const amountInput = actionBtn.parentElement.querySelector('.undercut-amount-input');

        // Ensure discount is at least 0
        let discount = parseInt(amountInput.value) || 0;
        if (discount < 0) {
            discount = 0;
            amountInput.value = 0;
        }

        if (!key) return alert("API Key missing in Damorale's settings!");

        GM_setValue('global_undercut', discount);

        const img = row.querySelector('img[src*="/items/"]');
        let itemId = img ? img.src.match(/\/items\/(\d+)\//)?.[1] : null;

        if (!itemId) {
            const cat = JSON.parse(GM_getValue('torn.items.catalog', '{}'));
            const nameEl = row.querySelector('div[class*="desc___"] b, b');
            const rawName = nameEl ? nameEl.textContent.split(' x')[0].trim().toLowerCase() : '';
            itemId = cat.byName?.[rawName]?.id;
        }

        if (!itemId) return alert("Could not find Item ID.");

        const originalText = actionBtn.textContent;
        actionBtn.textContent = '...';

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/v2/market/${itemId}?selections=itemmarket&key=${key}`,
            onload: (res) => {
                actionBtn.textContent = originalText;
                try {
                    const j = JSON.parse(res.responseText);
                    const listings = j.itemmarket?.listings || j.itemmarket;
                    const cheapest = listings?.[0]?.price || listings?.[0]?.cost;

                    if (cheapest) {
                        const newValue = Math.max(1, cheapest - discount);
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        setter.call(input, newValue);
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                } catch (e) { console.error("API Error", e); }
            }
        });
    }

    function inject() {
        const savedAmount = GM_getValue('global_undercut', 1);
        const containers = document.querySelectorAll('div[class*="bonuses___pTH_L"]');

        containers.forEach(container => {
            if (container.querySelector('.undercut-container')) return;

            const row = container.closest('li, [class*="row"]');
            const priceInput = row?.querySelector('input[data-testid="legacy-money-input"], input.input-money');
            if (!priceInput) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'undercut-container';

            const actionBtn = document.createElement('div');
            actionBtn.className = 'undercut-action-btn';
            actionBtn.textContent = '-$';

            const amountInput = document.createElement('input');
            amountInput.className = 'undercut-amount-input';
            amountInput.type = 'number';
            amountInput.min = '0'; // Disallows negative numbers in the browser UI
            amountInput.value = savedAmount;

            // Extra safety: Reset to 0 if they manually type a negative
            amountInput.oninput = () => {
                if (amountInput.value < 0) amountInput.value = 0;
                GM_setValue('global_undercut', parseInt(amountInput.value) || 0);
            };

            actionBtn.onclick = (e) => {
                e.preventDefault();
                performUndercut(row, priceInput, actionBtn);
            };

            wrapper.appendChild(actionBtn);
            wrapper.appendChild(amountInput);
            container.appendChild(wrapper);
        });
    }

    setInterval(inject, 1000);
})();