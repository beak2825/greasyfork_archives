// ==UserScript==
// @name         Torn Display Case Market Share Calculator
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Calculate market share for any item in your Torn display case
// @author       Systoned
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553922/Torn%20Display%20Case%20Market%20Share%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/553922/Torn%20Display%20Case%20Market%20Share%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY_STORAGE = 'torn_api_key';

    // ===== Storage =====
    function getApiKey() { return localStorage.getItem(API_KEY_STORAGE); }
    function setApiKey(key) { localStorage.setItem(API_KEY_STORAGE, key); }

    // ===== Modal =====
    function createModal(title, htmlContent) {
        document.getElementById('display-modal')?.remove();
        const modal = document.createElement('div');
        modal.id = 'display-modal';
        modal.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                        background:rgba(0,0,0,0.6);z-index:10000;display:flex;
                        align-items:center;justify-content:center;">
                <div style="background:#1a1a1a;color:white;padding:20px;
                            border-radius:6px;min-width:340px;max-width:520px;">
                    <h3 style="margin-top:0;margin-bottom:10px;">${title}</h3>
                    <div id="modal-content" style="max-height:70vh;overflow:auto;">
                        ${htmlContent}
                    </div>
                    <div style="margin-top:15px;text-align:right;">
                        <button id="modal-close"
                            style="padding:6px 14px;background:#2a2a2a;color:white;
                                   border:1px solid #444;border-radius:4px;cursor:pointer;">
                            Close
                        </button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);
        document.getElementById('modal-close').onclick = () => modal.remove();
    }

    function showApiKeyModal() {
        const html = `
            <p>Enter your Torn API key (Full or "Display" access):</p>
            <input id="api-key-input" placeholder="Your Torn API Key"
                   style="width:100%;padding:8px;margin:8px 0;background:#2a2a2a;
                          color:white;border:1px solid #444;border-radius:4px;">
            <button id="save-api-key"
                    style="padding:6px 14px;margin-right:8px;background:#2a2a2a;
                           color:white;border:1px solid #444;border-radius:4px;cursor:pointer;">
                Save
            </button>
            <button id="cancel-api-key"
                    style="padding:6px 14px;background:#2a2a2a;color:white;
                           border:1px solid #444;border-radius:4px;cursor:pointer;">
                Cancel
            </button>`;
        createModal('Enter API Key', html);
        document.getElementById('save-api-key').onclick = () => {
            const key = document.getElementById('api-key-input').value.trim();
            if (key) { setApiKey(key); document.getElementById('display-modal').remove(); fetchDisplayItems(); }
        };
        document.getElementById('cancel-api-key').onclick = () => document.getElementById('display-modal').remove();
    }

    // ===== Milestones =====
    function milestones(qty, circ, price) {
        const steps = [1,5,20,50,70,80,100];
        let out = `<div style="margin-top:20px;border-top:1px solid #444;padding-top:10px;"><h4>Milestones</h4>`;
        for (const pct of steps) {
            const tgt = Math.ceil(circ * pct / 100);
            const remain = tgt - qty;
            if (remain > 0) {
                const progress = (qty / tgt * 100).toFixed(2);
                out += `<p style="margin:8px 0;background:#2a2a2a;padding:8px;border-radius:3px;">
                    <strong>${pct}%:</strong> Need ${remain.toLocaleString()} (${progress}% done)
                    <br><span style="font-size:0.9em;color:#aaa;">Cost: $${(remain*price).toLocaleString()}</span>
                </p>`;
            } else {
                out += `<p style="margin:8px 0;background:#2a4a2a;padding:8px;border-radius:3px;">
                        <strong>${pct}%:</strong> ✓ Achieved</p>`;
            }
        }
        return out + '</div>';
    }

    // ===== API logic =====
    async function fetchDisplayItems() {
        const key = getApiKey();
        if (!key) return showApiKeyModal();

        try {
            const res = await fetch(`https://api.torn.com/v2/user?selections=display&key=${key}`);
            const data = await res.json();
            if (data.error) return createModal('API Error', `<p>${data.error.error}</p>`);
            const items = (data.display || []).sort((a,b)=>a.name.localeCompare(b.name));
            if (!items.length) return createModal('Empty Display', '<p>Your display case has no items.</p>');
            const options = items.map(i=>`<option value="${i.ID}">${i.name} (x${i.quantity})</option>`).join('');
            const html = `
                <label>Select an item:</label>
                <select id="item-select"
                        style="width:100%;padding:8px;margin-top:8px;background:#2a2a2a;
                               color:white;border:1px solid #444;border-radius:4px;">
                    <option value="">-- choose an item --</option>${options}
                </select>
                <div style="margin-top:15px;text-align:right;">
                    <button id="calc-item"
                            style="padding:6px 14px;background:#2a2a2a;color:white;
                                   border:1px solid #444;border-radius:4px;cursor:pointer;">
                        Calculate
                    </button>
                </div>`;
            createModal('Display Case Items', html);
            document.getElementById('calc-item').onclick = () => {
                const id = parseInt(document.getElementById('item-select').value);
                const item = items.find(i=>i.ID===id);
                if (item) showItemStats(item);
            };
        } catch (e) {
            createModal('Error', `<p>${e.message}</p>`);
        }
    }

    function showItemStats(item) {
        const pct = (item.quantity / item.circulation * 100).toFixed(4);
        const val = item.quantity * item.market_price;
        const remain = item.circulation - item.quantity;
        const cost = remain * item.market_price;
        const html = `
            <p><strong>Item:</strong> ${item.name}</p>
            <p><strong>Your Quantity:</strong> ${item.quantity.toLocaleString()}</p>
            <p><strong>Total Circulation:</strong> ${item.circulation.toLocaleString()}</p>
            <p><strong>Market Share:</strong> ${pct}%</p>
            <hr style="border-color:#444;">
            <p><strong>Your Value:</strong> $${val.toLocaleString()}</p>
            <p><strong>Cost to Buy All:</strong> $${cost.toLocaleString()} (${remain.toLocaleString()} items)</p>
            ${milestones(item.quantity,item.circulation,item.market_price)}
            <div style="margin-top:15px;text-align:right;">
                <button id="back-btn"
                        style="padding:6px 14px;background:#2a2a2a;color:white;
                               border:1px solid #444;border-radius:4px;cursor:pointer;">
                    Back
                </button>
            </div>`;
        createModal(`${item.name} Market Share`, html);
        document.getElementById('back-btn').onclick = fetchDisplayItems;
    }

    // ===== Button Injection (robust) =====
    function injectButtons() {
        if (document.getElementById('display-share-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'display-share-btn';
        btn.textContent = 'Display Share';
        btn.style.cssText = 'position:fixed;top:100px;right:20px;z-index:9999;padding:10px 15px;background:#2a2a2a;color:white;border:none;border-radius:5px;cursor:pointer;';
        btn.onclick = fetchDisplayItems;
        document.body.appendChild(btn);

        const gear = document.createElement('button');
        gear.id = 'display-share-gear';
        gear.textContent = '⚙️';
        gear.style.cssText = 'position:fixed;top:100px;right:150px;z-index:9999;padding:10px 15px;background:#2a2a2a;color:white;border:none;border-radius:5px;cursor:pointer;';
        gear.onclick = showApiKeyModal;
        document.body.appendChild(gear);
    }

    // Works on Torn's dynamically loaded pages
    const observer = new MutationObserver(() => {
        if (document.querySelector('#topHeader, #nav, body')) {
            injectButtons();
        }
    });
    observer.observe(document, { childList: true, subtree: true });

})();
