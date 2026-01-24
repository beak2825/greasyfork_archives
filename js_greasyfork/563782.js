// ==UserScript==
// @name         Axis - Ultimate Patient Form Tool (v10.2)
// @namespace    http://tampermonkey.net/
// @version      10.2
// @description  Shift + Right Click for Settings
// @author       Gemini
// @match        https://axis.thejoint.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      C3GPS
// @downloadURL https://update.greasyfork.org/scripts/563782/Axis%20-%20Ultimate%20Patient%20Form%20Tool%20%28v102%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563782/Axis%20-%20Ultimate%20Patient%20Form%20Tool%20%28v102%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = "tm-google-form-button";
    const TARGET_URL_START = "https://axis.thejoint.com/#Contacts/";

    const SAMPLE_MAPPING = {
        "SAMPLE Patient Type": "entry.1793894942",
        "SAMPLE Marketing": "entry.1958122725",
        "SAMPLE Promotion Used": "entry.967111666"
    };

    const safeParse = (key, fallback) => {
        try {
            let val = GM_getValue(key);
            return val ? JSON.parse(val) : JSON.parse(fallback);
        } catch (e) {
            return JSON.parse(fallback);
        }
    };

    const getCrmGuid = () => window.location.href.split('/').pop() || "";
    function formatWellnessName(name) { if (!name || name.toLowerCase() === "user menu") return ""; return name.split(/[._]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '); }
    function formatToISODate(dateStr) { if (!dateStr) return ""; let match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/); if (match) return `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`; return dateStr; }

    function smartFormat(val, label) {
        if (!val || val.toLowerCase() === "user menu") return "";
        val = val.trim();
        if (label === "Wellness Coordinator") return formatWellnessName(val);
        let map = safeParse("valueMap", "{}");
        if (map[val]) return map[val];
        if (label.toLowerCase().includes('date') || val.includes('/')) return formatToISODate(val);
        return val;
    }

    function getValueFromSelector(label, selector) {
        if (selector === "CRM_GUID") return getCrmGuid();
        if (!selector) return "";
        let el = document.querySelector(selector);
        if (!el) return "";
        if (label === "Wellness Coordinator") {
            let attrVal = el.getAttribute('aria-label') || el.getAttribute('data-bs-original-title') || el.getAttribute('title');
            if (attrVal) return attrVal.trim();
        }
        return (el.innerText || el.value || el.getAttribute('title') || "").trim();
    }

    function updateLiveMonitor() {
        let monitorBody = document.getElementById('monitorBody');
        if (!monitorBody) return;
        try {
            let selectors = JSON.parse(document.getElementById('crmSelectors').value || "{}");
            let constants = JSON.parse(document.getElementById('crmConstants').value || "{}");
            let html = "";
            for (let label in selectors) {
                let rawVal = getValueFromSelector(label, selectors[label]);
                let finalVal = constants[label] || smartFormat(rawVal, label);
                let status = (finalVal && finalVal.toLowerCase() !== "user menu") ? "✅" : "❌";
                html += `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><b>${label}</b></td><td style="text-align:center; border-bottom:1px solid #eee;">${status}</td><td style="color:gray; font-size:10px; border-bottom:1px solid #eee; padding-left:8px;">${finalVal}</td></tr>`;
            }
            monitorBody.innerHTML = html;
        } catch(e) {}
    }

    function openSettings() {
        if (document.getElementById("tm-overlay")) return;
        let overlay = document.createElement('div');
        overlay.id = "tm-overlay";
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:999999; display:flex; align-items:center; justify-content:center; padding: 10px;";

        let modal = document.createElement('div');
        modal.style = "background:white; padding:20px; border-radius:10px; width:1100px; max-width:95%; max-height:95vh; overflow-y:auto; font-family:sans-serif; z-index:1000000; display: flex; flex-direction: column; box-shadow: 0 15px 40px rgba(0,0,0,0.4);";

        let currentMapping = GM_getValue("mapping");
        let displayMapping = currentMapping && currentMapping !== "{}" ? currentMapping : JSON.stringify(SAMPLE_MAPPING, null, 2);

        modal.innerHTML = `
            <h2 style="margin-top:0; color:#333; border-bottom:2px solid #eee; padding-bottom:8px; font-size: 1.2em;">Workbench v10.2</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto 200px 140px; gap: 15px; margin-top: 10px;">
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div>
                        <label style="font-size:0.9em;"><b>Box 1: Google Form URL</b></label>
                        <input type="text" id="formUrl" style="width:100%; padding:6px; border:1px solid #ccc; box-sizing:border-box;" value="${GM_getValue("formUrl","")}">
                    </div>
                    <div style="background:#f9f9f9; padding:15px; border:1px solid #ddd; border-radius:5px; font-size: 0.85em; color: #555;">
                        <b>Pro Tip:</b><br>
                        Hold <b>Shift + Right Click</b> on the button to open these settings later.
                    </div>
                </div>
                <div style="background:#f0f7ff; padding:10px; border-radius:8px; border:1px solid #b3d7ff;">
                    <b style="font-size:0.9em;">Live Data Preview</b>
                    <div style="max-height:120px; overflow-y:auto; background:white; border:1px solid #d0e1f9; margin-top:4px;">
                        <table style="width:100%; font-size:10px; border-collapse:collapse;" id="monitorBody"></table>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column;"><label style="font-size:0.9em;"><b>Box 3: CRM Selectors</b></label>
                    <textarea id="crmSelectors" style="width:100%; flex-grow:1; font-family:monospace; border:1px solid #ccc; padding:8px; font-size:11px;">${GM_getValue("selectors","{}")}</textarea>
                </div>
                <div style="display:flex; flex-direction:column;"><label style="font-size:0.9em;"><b>Box 5: Resulting Mapping</b></label>
                    <textarea id="fieldMapping" style="width:100%; flex-grow:1; font-family:monospace; background:#fffef5; border:1px solid #ccc; padding:8px; font-size:11px;">${displayMapping}</textarea>
                </div>
                <div style="display:flex; flex-direction:column;"><label style="font-size:0.9em;"><b>Box 4: Constants</b></label>
                    <textarea id="crmConstants" style="width:100%; flex-grow:1; font-family:monospace; border:1px solid #ccc; padding:8px; font-size:11px;">${GM_getValue("constants","{}")}</textarea>
                </div>
                <div style="display:flex; flex-direction:column;"><label style="font-size:0.9em;"><b>Box 6: Value Mapper</b></label>
                    <textarea id="valueMap" style="width:100%; flex-grow:1; font-family:monospace; background:#f5fff5; border:1px solid #ccc; padding:8px; font-size:11px;">${GM_getValue("valueMap","{}")}</textarea>
                </div>
            </div>
            <div style="text-align:right; margin-top:15px; border-top:1px solid #eee; padding-top:10px;">
                <button id="closeSettings" style="padding:8px 20px; margin-right:10px; cursor:pointer; background:#eee; border:1px solid #ccc;">Cancel</button>
                <button id="saveSettings" style="padding:10px 40px; background:#28a745; color:white; border:none; cursor:pointer; font-weight:bold; border-radius:4px;">Save & Apply</button>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.appendChild(modal);
        setInterval(updateLiveMonitor, 2000);

        document.getElementById('saveSettings').onclick = () => {
            GM_setValue("formUrl", document.getElementById('formUrl').value);
            GM_setValue("mapping", document.getElementById('fieldMapping').value);
            GM_setValue("selectors", document.getElementById('crmSelectors').value);
            GM_setValue("constants", document.getElementById('crmConstants').value);
            GM_setValue("valueMap", document.getElementById('valueMap').value);
            overlay.remove();
            location.reload();
        };
        document.getElementById('closeSettings').onclick = () => overlay.remove();
    }

    function openPrefilledForm() {
        let baseUrl = GM_getValue("formUrl", "");
        if (!baseUrl) { openSettings(); return; }
        let mapping = safeParse("mapping", "{}");
        let selectors = safeParse("selectors", "{}");
        let constants = safeParse("constants", "{}");
        let params = Object.keys(mapping).map(label => {
            let val = constants[label] || smartFormat(getValueFromSelector(label, selectors[label]), label);
            return val ? `${mapping[label]}=${encodeURIComponent(val)}` : null;
        }).filter(p => p);
        window.open(baseUrl + (baseUrl.includes("?") ? "&" : "?") + params.join("&"), '_blank');
    }

    function injectButton() {
        if (!window.location.href.includes(TARGET_URL_START) || document.getElementById(BUTTON_ID)) return;

        let btn = document.createElement('button');
        btn.id = BUTTON_ID; btn.innerText = 'New Patient Google Form';
        Object.assign(btn.style, { position: 'fixed', top: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: '9999', padding: '12px 24px', backgroundColor: '#d32f2f', color: '#fff', border: '2px solid #fff', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' });

        btn.onclick = openPrefilledForm;

        // Settings Lock: Only opens with Shift + Right Click
        btn.oncontextmenu = (e) => {
            if (e.shiftKey) {
                e.preventDefault();
                openSettings();
            } else {
                // Prevent normal right-click from doing anything on this specific button
                e.preventDefault();
            }
        };

        document.body.appendChild(btn);

        // Auto-open on first run
        if (!GM_getValue("formUrl")) {
            openSettings();
        }
    }
    setInterval(injectButton, 1000);
})();