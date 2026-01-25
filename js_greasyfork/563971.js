// ==UserScript==
// @name         Torn Bazaar Quick Pricer + Smart Bazaar Pricing Panel
// @namespace    http://tampermonkey.net/
// @version      3.0.3
// @description  Bazaar pricing tool with UI panel, bazaar-based pricing logic, % or $ undercut, NPC warnings, and API key onboarding
// @author       R4G3RUNN3R [3877028] based on the script originally created by Zedtrooper [3028329]
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

    console.log('[BQP] v3.0.3 loaded');

    /* ================= CONFIG ================= */
    const CONFIG = {
        apiKey: GM_getValue('tornApiKey', ''),
        pricingMode: GM_getValue('pricingMode', 'market'), // market | bazaar | bazaar-undercut
        undercutType: GM_getValue('undercutType', 'percent'), // percent | flat
        undercutValue: GM_getValue('undercutValue', 10),
        warnBelowNpc: GM_getValue('warnBelowNpc', true),
    };

    function saveConfig() {
        GM_setValue('tornApiKey', CONFIG.apiKey);
        GM_setValue('pricingMode', CONFIG.pricingMode);
        GM_setValue('undercutType', CONFIG.undercutType);
        GM_setValue('undercutValue', CONFIG.undercutValue);
        GM_setValue('warnBelowNpc', CONFIG.warnBelowNpc);
    }

    /* ================= API KEY PROMPT ================= */
    function showApiKeyPrompt() {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;display:flex;align-items:center;justify-content:center';
        overlay.innerHTML = `
            <div style="background:#222;color:#fff;padding:20px;border-radius:8px;width:420px">
                <h2>Bazaar Quick Pricer – Setup</h2>
                <p>Enter your <strong>Torn Public API key</strong>.</p>
                <input id="bqpApiKey" type="text"
                    style="width:100%;padding:10px;background:#111;color:#fff;border:1px solid #555;border-radius:4px">
                <div style="margin-top:15px;text-align:right">
                    <button id="bqpSaveKey">Save</button>
                </div>
                <p style="font-size:11px;color:#aaa;margin-top:10px">
                    Stored locally. Used only for api.torn.com.
                </p>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('bqpSaveKey').onclick = () => {
            const key = document.getElementById('bqpApiKey').value.trim();
            if (!key) {
                alert('Please enter a valid API key');
                return;
            }
            CONFIG.apiKey = key;
            saveConfig();
            location.reload();
        };
    }

    /* ================= SETTINGS PANEL ================= */
    function showSettingsPanel() {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;display:flex;align-items:center;justify-content:center';
        overlay.innerHTML = `
            <div style="background:#222;color:#fff;padding:20px;border-radius:8px;width:440px">
                <h2>Pricing Settings</h2>

                <label>Pricing Mode</label>
                <select id="bqpMode" style="width:100%">
                    <option value="market">Market Value</option>
                    <option value="bazaar">Lowest Bazaar</option>
                    <option value="bazaar-undercut">Lowest Bazaar – Undercut</option>
                </select>

                <div style="margin-top:10px">
                    <label>Undercut Type</label><br>
                    <label><input type="radio" name="bqpUnderType" value="percent"> %</label>
                    <label style="margin-left:10px"><input type="radio" name="bqpUnderType" value="flat"> $</label>
                    <input id="bqpUnderValue" type="number" style="width:80px;margin-left:10px">
                </div>

                <label style="display:block;margin-top:10px">
                    <input type="checkbox" id="bqpWarnNpc"> Warn when below NPC value
                </label>

                <div style="margin-top:15px;text-align:right">
                    <button id="bqpSave">Save</button>
                    <button id="bqpClose">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('bqpMode').value = CONFIG.pricingMode;
        document.getElementById('bqpUnderValue').value = CONFIG.undercutValue;
        document.getElementById('bqpWarnNpc').checked = CONFIG.warnBelowNpc;
        document.querySelector(`input[name="bqpUnderType"][value="${CONFIG.undercutType}"]`).checked = true;

        document.getElementById('bqpSave').onclick = () => {
            CONFIG.pricingMode = document.getElementById('bqpMode').value;
            CONFIG.undercutType = document.querySelector('input[name="bqpUnderType"]:checked').value;
            CONFIG.undercutValue = parseFloat(document.getElementById('bqpUnderValue').value);
            CONFIG.warnBelowNpc = document.getElementById('bqpWarnNpc').checked;
            saveConfig();
            overlay.remove();
        };
        document.getElementById('bqpClose').onclick = () => overlay.remove();
    }

    /* ================= UI INJECTION ================= */
    function injectSettingsAboveBazaarStatus() {
        if (document.getElementById('bqpSettingsContainer')) return;

        const nodes = document.querySelectorAll('div, p, span');
        for (const el of nodes) {
            if (el.textContent && el.textContent.includes('Your bazaar is now Open.')) {
                const container = document.createElement('div');
                container.id = 'bqpSettingsContainer';
                container.style.cssText = 'margin-bottom:10px';

                const btn = document.createElement('button');
                btn.textContent = 'Pricing Settings';
                btn.style.cssText = 'background:#5F5F5F;color:white;padding:8px 14px;border:none;border-radius:4px;cursor:pointer;font-size:13px';
                btn.addEventListener('mouseenter', () => btn.style.background = '#4F4F4F');
                btn.addEventListener('mouseleave', () => btn.style.background = '#5F5F5F');
                btn.onclick = showSettingsPanel;

                container.appendChild(btn);
                el.parentNode.insertBefore(container, el);
                console.log('[BQP] Settings button injected');
                return;
            }
        }
    }

    const observer = new MutationObserver(injectSettingsAboveBazaarStatus);

    /* ================= INIT ================= */
    function init() {
        if (!CONFIG.apiKey) {
            showApiKeyPrompt();
            return;
        }

        injectSettingsAboveBazaarStatus();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();