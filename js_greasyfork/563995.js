// ==UserScript==
// @name         Torn Vault Manager v3.2 (Mobile Bottom Optimized)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Withdraw buttons & Deposit controls moved to the BOTTOM of the Deposit block for optimal mobile reach.
// @author       You
// @match        https://www.torn.com/properties.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563995/Torn%20Vault%20Manager%20v32%20%28Mobile%20Bottom%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563995/Torn%20Vault%20Manager%20v32%20%28Mobile%20Bottom%20Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & Storage Keys ---
    const STORAGE_KEY_AMOUNTS = 'torn_vault_custom_amounts';
    const STORAGE_KEY_MAGIC = 'torn_vault_magic_target';
    const STORAGE_KEY_KEEP = 'torn_vault_keep_amount';
    const STORAGE_KEY_AUTO_MAX = 'torn_vault_automax_enabled';

    // Defaults
    const DEFAULT_AMOUNTS = [1000000, 5000000, 10000000, 50000000];
    const DEFAULT_MAGIC_TARGET = 70000000;

    // --- CSS Styles ---
    GM_addStyle(`
        .custom-vault-wrapper {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 20px; /* Space from Deposit button */
            padding: 10px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            align-items: center;
        }
        .vault-row {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            justify-content: center;
            align-items: center;
            width: 100%;
        }
        .vault-divider {
            width: 100%;
            height: 1px;
            background: #333;
            margin: 4px 0;
        }
        .vault-btn {
            background: linear-gradient(180deg, #3c3c3c 0%, #1f1f1f 100%);
            color: #fff;
            border: 1px solid #555;
            padding: 8px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 13px;
            text-shadow: 0 1px 2px black;
            transition: all 0.2s;
            min-width: 50px;
            text-align: center;
            flex-grow: 1;
            max-width: 100px;
        }
        .vault-btn:hover {
            border-color: #00ff00;
            box-shadow: 0 0 8px rgba(0, 255, 0, 0.4);
            color: #00ff00;
            transform: translateY(-1px);
        }
        .vault-btn.magic-btn {
            border-color: #8a2be2;
            color: #d8b4fe;
        }
        .vault-btn.magic-btn:hover {
            border-color: #d000ff;
            box-shadow: 0 0 8px rgba(208, 0, 255, 0.6);
            color: #fff;
        }
        .vault-btn.deposit-btn {
            border-color: #e67e22;
            color: #f39c12;
            max-width: none;
        }
        .vault-btn.deposit-btn:hover {
            border-color: #d35400;
            box-shadow: 0 0 8px rgba(230, 126, 34, 0.6);
            color: #fff;
        }
        .vault-edit-btn {
            background: transparent;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 18px;
            padding: 0 10px;
        }
        .vault-edit-btn:hover { color: #fff; }

        .vault-small-input {
            background: #222;
            color: #fff;
            border: 1px solid #444;
            padding: 8px;
            border-radius: 4px;
            font-family: monospace;
            width: 80px;
            text-align: center;
            font-size: 13px;
        }
        .vault-small-input:focus { outline: none; border-color: #00ff00; }

        .vault-edit-container { display: flex; flex-direction: column; width: 100%; gap: 10px; }
        .vault-edit-row { display: flex; align-items: center; gap: 10px; }
        .vault-label { color: #ccc; font-size: 11px; width: 80px; text-align: right; }
        .vault-full-input { flex-grow: 1; background: #222; color: #00ff00; border: 1px solid #444; padding: 8px; border-radius: 4px; }
        
        .vault-toggle-label { color: #ccc; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px;}
        .vault-toggle-input { cursor: pointer; transform: scale(1.3); }
    `);

    // --- Main Logic ---

    let isEditMode = false;
    let autoMaxHasRun = false;

    const observer = new MutationObserver((mutations) => {
        if (window.location.href.includes("tab=vault")) {
            // Target the Deposit Form (Right side, usually bottom on mobile)
            const depositForm = document.querySelector('form.right');
            
            // Check if we need to inject controls
            if (depositForm && !document.getElementById('custom-vault-controls')) {
                initControls(depositForm);
            }

            // Auto-Max Logic (also on Deposit Form)
            const depositInput = depositForm ? depositForm.querySelector('.input-money-group input.input-money') : null;
            if (depositInput && !autoMaxHasRun) {
                 const { autoMaxEnabled } = getStoredData();
                 if (autoMaxEnabled && depositInput.value === "") {
                     autoMaxDeposit();
                     autoMaxHasRun = true; 
                 }
            }
        } else {
            autoMaxHasRun = false;
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function initControls(parentForm) {
        const container = document.createElement('div');
        container.id = 'custom-vault-controls';
        container.className = 'custom-vault-wrapper';

        // Append to bottom of Deposit Form
        parentForm.appendChild(container);

        renderPanel(container);
    }

    // --- Storage Helpers ---
    function getStoredData() {
        return {
            amounts: JSON.parse(GM_getValue(STORAGE_KEY_AMOUNTS) || JSON.stringify(DEFAULT_AMOUNTS)),
            magicTarget: parseInt(GM_getValue(STORAGE_KEY_MAGIC) || DEFAULT_MAGIC_TARGET),
            keepAmount: GM_getValue(STORAGE_KEY_KEEP) || "0",
            autoMaxEnabled: GM_getValue(STORAGE_KEY_AUTO_MAX, true)
        };
    }

    function saveData(key, value) {
        GM_setValue(key, value);
    }

    // --- Parsing ---
    function parseMoneyString(str) {
        str = str.toString().toLowerCase().trim();
        if(!str) return 0;
        const multipliers = { 'k': 1e3, 'm': 1e6, 'b': 1e9, 't': 1e12 };
        const suffix = str.slice(-1);
        if (multipliers.hasOwnProperty(suffix)) {
            return Math.floor(parseFloat(str.slice(0, -1)) * multipliers[suffix]);
        }
        return parseInt(str.replace(/,/g, '')) || 0;
    }

    function formatMoney(num) {
        if (isNaN(num)) return "0";
        if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return num.toString();
    }

    // --- Rendering ---

    function renderPanel(container) {
        container.innerHTML = '';
        const data = getStoredData();

        if (isEditMode) {
            renderEditMode(container, data);
        } else {
            renderViewMode(container, data);
        }
    }

    function renderViewMode(container, data) {
        // -- Row 1: Withdraw Buttons --
        const row1 = document.createElement('div');
        row1.className = 'vault-row';

        data.amounts.forEach(amt => {
            const btn = document.createElement('button');
            btn.innerText = formatMoney(amt);
            btn.className = 'vault-btn';
            btn.title = `Withdraw ${formatMoney(amt)}`;
            btn.onclick = (e) => { e.preventDefault(); performWithdraw(amt); };
            row1.appendChild(btn);
        });

        // Magic Button
        const magicBtn = document.createElement('button');
        magicBtn.innerText = '✨ Magic';
        magicBtn.className = 'vault-btn magic-btn';
        magicBtn.title = `Target on hand: ${formatMoney(data.magicTarget)}`;
        magicBtn.onclick = (e) => { e.preventDefault(); performMagicWithdraw(data.magicTarget); };
        row1.appendChild(magicBtn);

        // Edit Button (Gear)
        const editBtn = document.createElement('button');
        editBtn.innerText = '⚙️';
        editBtn.className = 'vault-edit-btn';
        editBtn.onclick = (e) => { e.preventDefault(); isEditMode = true; renderPanel(container); };
        row1.appendChild(editBtn);

        container.appendChild(row1);

        // -- Divider --
        const divider = document.createElement('div');
        divider.className = 'vault-divider';
        container.appendChild(divider);

        // -- Row 2: Deposit Controls --
        const row2 = document.createElement('div');
        row2.className = 'vault-row';

        // Keep Input label
        const keepLabel = document.createElement('span');
        keepLabel.innerText = "Keep:";
        keepLabel.style.color = "#aaa";
        keepLabel.style.fontSize = "12px";
        row2.appendChild(keepLabel);

        // Keep Input
        const keepInput = document.createElement('input');
        keepInput.type = 'text';
        keepInput.className = 'vault-small-input';
        keepInput.value = data.keepAmount === "0" ? "" : data.keepAmount;
        keepInput.placeholder = "0";
        keepInput.onchange = (e) => {
            saveData(STORAGE_KEY_KEEP, e.target.value);
        };
        row2.appendChild(keepInput);

        // Vault Keep Button
        const keepBtn = document.createElement('button');
        keepBtn.innerText = 'Vault Keep';
        keepBtn.className = 'vault-btn deposit-btn';
        keepBtn.title = 'Deposits everything EXCEPT the Keep amount';
        keepBtn.onclick = (e) => {
            e.preventDefault();
            const val = parseMoneyString(keepInput.value);
            performVaultKeep(val);
        };
        row2.appendChild(keepBtn);

        container.appendChild(row2);
    }

    function renderEditMode(container, data) {
        const editContainer = document.createElement('div');
        editContainer.className = 'vault-edit-container';

        // Row A: Buttons
        const rowA = document.createElement('div');
        rowA.className = 'vault-edit-row';
        rowA.innerHTML = '<span class="vault-label">Buttons:</span>';
        const inputAmounts = document.createElement('input');
        inputAmounts.className = 'vault-full-input';
        inputAmounts.value = data.amounts.map(formatMoney).join(', ');
        rowA.appendChild(inputAmounts);
        editContainer.appendChild(rowA);

        // Row B: Magic Target
        const rowB = document.createElement('div');
        rowB.className = 'vault-edit-row';
        rowB.innerHTML = '<span class="vault-label">Magic Target:</span>';
        const inputMagic = document.createElement('input');
        inputMagic.className = 'vault-full-input';
        inputMagic.value = formatMoney(data.magicTarget);
        rowB.appendChild(inputMagic);
        editContainer.appendChild(rowB);

        // Row C: Auto Max Toggle
        const rowC = document.createElement('div');
        rowC.className = 'vault-edit-row';
        const labelToggle = document.createElement('label');
        labelToggle.className = 'vault-toggle-label';
        const checkAuto = document.createElement('input');
        checkAuto.type = 'checkbox';
        checkAuto.className = 'vault-toggle-input';
        checkAuto.checked = data.autoMaxEnabled;
        labelToggle.appendChild(checkAuto);
        labelToggle.appendChild(document.createTextNode(" Enable Auto-Max Deposit"));
        rowC.appendChild(labelToggle);
        
        // Save Button
        const saveBtn = document.createElement('button');
        saveBtn.innerText = '💾 Save & Close';
        saveBtn.className = 'vault-btn';
        saveBtn.style.marginLeft = 'auto';
        saveBtn.onclick = (e) => {
            e.preventDefault();
            const newAmounts = inputAmounts.value.split(',').map(s => parseMoneyString(s)).filter(n => n > 0);
            const newMagic = parseMoneyString(inputMagic.value);

            saveData(STORAGE_KEY_AMOUNTS, JSON.stringify(newAmounts));
            saveData(STORAGE_KEY_MAGIC, newMagic);
            saveData(STORAGE_KEY_AUTO_MAX, checkAuto.checked);

            isEditMode = false;
            renderPanel(container);
        };
        rowC.appendChild(saveBtn);
        editContainer.appendChild(rowC);

        container.appendChild(editContainer);
    }

    // --- Actions ---

    function getMoneyOnHand() {
        let el = document.querySelector("[class^='user-info-value'] [data-money]") ||
                 document.querySelector("#user-money") ||
                 document.querySelector("[class^='value_'][data-money]");
        return el ? parseInt(el.getAttribute("data-money")) : 0;
    }

    function performWithdraw(amount) {
        const form = document.querySelector('form.left');
        const input = form.querySelector('.input-money-group input.input-money');
        const btn = form.querySelector('input[type="submit"]');
        if (input && btn) {
            input.value = amount;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            setTimeout(() => btn.click(), 100);
        }
    }

    function performMagicWithdraw(target) {
        const current = getMoneyOnHand();
        if (current < target) {
            performWithdraw(target - current);
        } else {
            alert(`You have $${formatMoney(current)}. Target is $${formatMoney(target)}.`);
        }
    }

    function performVaultKeep(keepAmount) {
        const form = document.querySelector('form.right');
        if (!form) return;
        
        const input = form.querySelector('.input-money-group input.input-money');
        const btn = form.querySelector('input[type="submit"]');
        const current = getMoneyOnHand();

        const depositAmount = current - keepAmount;

        if (depositAmount > 0) {
            input.value = depositAmount;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('disabled');
                setTimeout(() => btn.click(), 100);
            }
        } else {
            alert(`You don't have enough money to keep $${formatMoney(keepAmount)}.`);
        }
    }

    function autoMaxDeposit() {
        const form = document.querySelector('form.right');
        if (!form) return;
        const input = form.querySelector('.input-money-group input.input-money');
        const btn = form.querySelector('input[type="submit"]');
        const current = getMoneyOnHand();

        if (current > 0 && input) {
            input.value = current;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('disabled');
            }
        }
    }

})();