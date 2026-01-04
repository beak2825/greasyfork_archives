// ==UserScript==
// @name         NEIR Portal Enhancer
// @namespace    https://gist.github.com/origamiofficial/c57d327e4b7b04d0d7f4c1024228a600
// @version      1.3
// @description  Enhances NEIR portal: Calculates missing IMEI digit, adds check link, and autofills de-registration form.
// @author       OrigamiOfficial
// @match        https://neir.btrc.gov.bd/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561063/NEIR%20Portal%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/561063/NEIR%20Portal%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. CSS STYLING ---
    GM_addStyle(`
        /* IMEI Calculator Styles */
        .tm-calculated-digit { color: #00ACC1; font-weight: bold; }
        .tm-info-icon { margin-left: 8px; color: #00ACC1; cursor: pointer; font-size: 1rem; vertical-align: middle; transition: color 0.2s ease, transform 0.2s ease; }
        .tm-info-icon:hover { color: #00838F; transform: scale(1.1); }

        /* Autofill Button Style (Matches .action-btn) */
        .tm-autofill-btn {
            margin-top: 1rem;
            width: max-content;
            padding: 0.425rem 1.25rem;
            border: 1px solid #DEE0E3;
            border-radius: 0.75rem;
            color: #9E9E9E;
            cursor: pointer;
            background: transparent;
            font-family: inherit;
            font-size: inherit;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .tm-autofill-btn:hover {
            background-color: #F1F3F4;
            color: #00ACC1;
            border-color: #00ACC1;
        }

        /* Config Modal Styles */
        .tm-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
        }
        .tm-modal {
            background: white; padding: 2rem; border-radius: 1rem;
            width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-family: 'Poppins', sans-serif;
        }
        .tm-modal h2 { margin-top: 0; color: #00ACC1; font-size: 1.25rem; margin-bottom: 1.5rem; }
        .tm-form-group { margin-bottom: 1rem; }
        .tm-form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #666; }
        .tm-form-group input {
            width: 100%; padding: 0.75rem; border: 1px solid #DEE0E3;
            border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box;
        }
        .tm-form-group input:focus { outline: none; border-color: #00ACC1; }
        .tm-modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
        .tm-btn { padding: 0.5rem 1.5rem; border-radius: 0.5rem; cursor: pointer; border: none; font-weight: 500; }
        .tm-btn-cancel { background: #f1f3f4; color: #666; }
        .tm-btn-save { background: #00ACC1; color: white; }
    `);

    // --- 2. HELPERS: CONFIG STORAGE ---
    const CONFIG_KEY = 'neir_autofill_config';
    function getConfig() {
        return GM_getValue(CONFIG_KEY, {
            msisdn: '',
            docDigits: '',
            nextMsisdn: '01300000000'
        });
    }
    function saveConfig(config) {
        GM_setValue(CONFIG_KEY, config);
    }

    // --- 3. LUHN ALGORITHM (IMEI Calc) ---
    function getLuhnCheckDigit(imei14) {
        if (!/^\d{14}$/.test(imei14)) return null;
        let sum = 0;
        for (let i = 0; i < 14; i++) {
            let digit = parseInt(imei14.charAt(i), 10);
            if (i % 2 !== 0) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
        }
        return (10 - (sum % 10)) % 10;
    }

    // --- 4. FEATURE: IMEI TABLE ENHANCER ---
    function processTable() {
        const rows = document.querySelectorAll('tr.ng-star-inserted');
        rows.forEach(row => {
            if (row.dataset.tmProcessed) return;
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const imeiCell = cells[1];
                let imeiText = imeiCell.textContent.trim();
                let fullImei = imeiText;
                let displayHtml = imeiText;

                if (imeiText.length === 14) {
                    const checkDigit = getLuhnCheckDigit(imeiText);
                    if (checkDigit !== null) {
                        fullImei = imeiText + checkDigit;
                        displayHtml = `${imeiText}<span class="tm-calculated-digit">${checkDigit}</span>`;
                    }
                }

                if (fullImei.length === 15) {
                    const icon = document.createElement('i');
                    icon.className = 'pi pi-info-circle tm-info-icon';
                    icon.title = 'Check on IMEI.info';
                    icon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        window.open(`https://www.imei.info/?imei=${fullImei}`, '_blank');
                    });
                    imeiCell.innerHTML = '';
                    imeiCell.insertAdjacentHTML('afterbegin', displayHtml);
                    imeiCell.appendChild(icon);
                }
                row.dataset.tmProcessed = "true";
            }
        });
    }

    // --- 5. FEATURE: AUTOFILL CONFIG MODAL ---
    function showConfigModal() {
        if (document.getElementById('tm-config-modal')) return;

        const config = getConfig();
        const modalHtml = `
            <div id="tm-config-modal" class="tm-modal-overlay">
                <div class="tm-modal">
                    <h2>Autofill Settings</h2>
                    <div class="tm-form-group">
                        <label>Your Mobile Number (11 Digits)</label>
                        <input type="text" id="tm-msisdn" value="${config.msisdn}" maxlength="11" placeholder="01XXXXXXXXX">
                    </div>
                    <div class="tm-form-group">
                        <label>Last 4 Digits of Doc ID (4 Digits)</label>
                        <input type="text" id="tm-docDigits" value="${config.docDigits}" maxlength="4" placeholder="XXXX">
                    </div>
                    <div class="tm-form-group">
                        <label>Next Mobile Number (11 Digits)</label>
                        <input type="text" id="tm-nextMsisdn" value="${config.nextMsisdn}" maxlength="11" placeholder="01300000000">
                    </div>
                    <div class="tm-modal-actions">
                        <button class="tm-btn tm-btn-cancel" id="tm-btn-cancel">Cancel</button>
                        <button class="tm-btn tm-btn-save" id="tm-btn-save">Save</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Validation & Save
        document.getElementById('tm-btn-save').onclick = () => {
            const msisdn = document.getElementById('tm-msisdn').value.replace(/\D/g, '');
            const docDigits = document.getElementById('tm-docDigits').value.replace(/\D/g, '');
            const nextMsisdn = document.getElementById('tm-nextMsisdn').value.replace(/\D/g, '');

            if (msisdn.length !== 11) return alert('Your Mobile Number must be exactly 11 digits.');
            if (docDigits.length !== 4) return alert('Doc ID must be exactly 4 digits.');
            if (nextMsisdn.length !== 11) return alert('Next Mobile Number must be exactly 11 digits.');

            saveConfig({ msisdn, docDigits, nextMsisdn });
            document.getElementById('tm-config-modal').remove();
            alert('Autofill settings saved!');
        };

        document.getElementById('tm-btn-cancel').onclick = () => {
            document.getElementById('tm-config-modal').remove();
        };
    }

    function injectAutofillButton() {
        // Find the user info card (left sidebar)
        const userCard = document.querySelector('.basic-card-1');
        // Prevent double injection
        if (userCard && !userCard.querySelector('.tm-autofill-btn')) {
            const btn = document.createElement('button');
            btn.className = 'tm-autofill-btn';
            btn.innerHTML = `Autofill <i class="pi pi-cog"></i>`;
            btn.onclick = showConfigModal;

            // Append to the card container
            userCard.appendChild(btn);
        }
    }

    // --- 6. FEATURE: FORM AUTOFILLING ---
    function triggerInputEvent(element, value) {
        // Helper to trigger Angular change detection
        if(!element) return;
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function autofillDeRegisterForm() {
        const form = document.querySelector('app-de-register-form');
        if (!form || form.dataset.tmAutofilled) return;

        const config = getConfig();
        if (!config.msisdn || !config.docDigits) return; // Don't fill if not configured

        // Find inputs by formControlName
        const msisdnInput = form.querySelector('input[formcontrolname="msisdn"]');
        const docInput = form.querySelector('input[formcontrolname="docDigits"]');
        const nextInput = form.querySelector('input[formcontrolname="nextMsisdn"]');

        if (msisdnInput && docInput && nextInput) {
            triggerInputEvent(msisdnInput, config.msisdn);
            triggerInputEvent(docInput, config.docDigits);
            triggerInputEvent(nextInput, config.nextMsisdn);

            form.dataset.tmAutofilled = "true";
        }
    }

    // --- 7. MAIN OBSERVER ---
    const observer = new MutationObserver((mutations) => {
        let shouldProcessTable = false;
        let shouldProcessUi = false;

        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                shouldProcessTable = true;
                shouldProcessUi = true;
            }
        });

        if (shouldProcessTable) processTable();

        if (shouldProcessUi) {
            injectAutofillButton();
            autofillDeRegisterForm();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial checks
    setTimeout(() => {
        processTable();
        injectAutofillButton();
    }, 1000);

})();