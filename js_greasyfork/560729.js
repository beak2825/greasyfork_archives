// ==UserScript==
// @name         Auto-fill Manager
// @namespace    local.autofill.darkpicker
// @license MIT
// @version      6.0.3
// @description  gurt
// @match        *://*/*
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/560729/Auto-fill%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/560729/Auto-fill%20Manager.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const STORAGE_KEY = "autofill_manager_data";
    const PASSKEY_KEY = "autofill_manager_passkey";
    const siteKey = location.origin;
    const store = GM_getValue(STORAGE_KEY, {});
    store[siteKey] ??= {
        fields: [],
        clicks: []
    };

    /* ===== UTILS ===== */
    function waitFor(selector) {
        return new Promise(resolve => {
            const t = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(t);
                    resolve(el);
                }
            }, 50);
        });
    }

    function getSelector(el) {
        if (el.id) return `#${el.id}`;
        if (el.name) return `${el.tagName.toLowerCase()}[name="${el.name}"]`;
        return el.tagName.toLowerCase();
    }

    function simpleHash(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = ((h << 5) - h) + str.charCodeAt(i);
            h |= 0;
        }
        return h.toString();
    }

    /* ===== AUTOFILL + AUTOCLICK ===== */
    async function autofill() {
        for (const f of store[siteKey].fields) {
            try {
                const el = await waitFor(f.selector);
                el.value = f.value;
                el.dispatchEvent(new Event("input", {
                    bubbles: true
                }));
                el.dispatchEvent(new Event("change", {
                    bubbles: true
                }));
            } catch {}
        }
    }
    async function autoclick() {
        for (const c of store[siteKey].clicks) {
            try {
                const el = await waitFor(c.selector);
                setTimeout(() => el.click(), c.delay || 0);
            } catch {}
        }
    }
    if (store[siteKey]?.enabled !== false) {
        autofill().then(autoclick);
    }

    /* ===== SHADOW DOM PORTAL ===== */
    const portal = document.createElement("div");
    portal.id = "afm-portal";
    portal.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none;";
    document.documentElement.appendChild(portal);

    const shadow = portal.attachShadow({
        mode: "open"
    });
    shadow.innerHTML = `<style>
    * { box-sizing: border-box; font-family: sans-serif; }
    .afm-toast-container{position:fixed;bottom:20px;right:20px;display:flex;flex-direction:column;gap:8px;pointer-events:none;}
    .afm-toast{background:#111;color:#eee;padding:12px 18px;border-radius:8px;
        box-shadow:0 0 15px rgba(0,0,0,0.7);font-size:14px;pointer-events:auto;}
    .afm-editor{
        position:fixed;top:30px;right:30px;width:700px;height:80%;background:#121212;color:#eee;
        border-radius:10px;box-shadow:0 0 25px rgba(0,0,0,0.9);padding:20px;overflow:auto;
        display:none;flex-direction:column;pointer-events:auto;
    }
    .afm-editor h2{
        margin-top:0;margin-bottom:12px;font-size:20px;display:flex;justify-content:space-between;align-items:center;
    }
    .afm-editor .top-bar{display:flex;gap:10px;margin-bottom:15px;align-items:center;flex-wrap:wrap;}
    .afm-editor .site{background:#1a1a1a;padding:12px;border-radius:8px;margin-bottom:15px;}
    .afm-editor .site.current{border:2px solid #4CAF50;}
    .afm-editor .site .status{font-size:12px;color:#999;margin-left:6px;}
    .afm-editor .field,.afm-editor .click{display:flex;gap:6px;align-items:center;margin:8px 0;}
    .afm-editor input{flex:1;padding:6px;border-radius:5px;border:none;background:#222;color:#eee;}
    .afm-editor button{padding:6px 10px;border-radius:5px;border:none;background:#333;color:#eee;cursor:pointer;transition:0.2s;}
    .afm-editor button:hover{background:#4CAF50;color:#fff;}
    .afm-editor button.del{background:#e74c3c;color:#fff;}
    .afm-editor button.add{background:#2196F3;color:#fff;}
    .afm-editor button.reset-all{background:#e74c3c;color:#fff;margin-top:10px;}
    .afm-editor button.close-ui{background:#555;color:#fff;margin-left:10px;font-weight:bold;}
    .afm-editor .scrollable{overflow-y:auto;max-height:calc(100% - 100px);}
    .afm-logout-message{text-align:center;color:#e74c3c;margin-top:50%;font-size:16px;}
</style>
<div class="afm-toast-container"></div>
<div class="afm-editor">
    <h2>
        Autofill Manager
        <button class="close-ui">✖</button>
    </h2>
    <div class="top-bar">
        <span>Current site: <b>${siteKey}</b></span>
        <button class="toggle-site"></button>
    </div>
    <div class="scrollable">
        <div class="sites-container"></div>
    </div>
    <button class="reset-all">Reset Passkey & Data</button>
</div>`;


    const toastContainer = shadow.querySelector(".afm-toast-container");
    const editor = shadow.querySelector(".afm-editor");
    const container = shadow.querySelector(".sites-container");
    const toggleBtn = shadow.querySelector(".toggle-site");
    const resetBtn = shadow.querySelector(".reset-all");
    const closeBtn = shadow.querySelector(".close-ui");

    function showToast(msg, duration = 3000) {
        const t = document.createElement("div");
        t.className = "afm-toast";
        t.textContent = msg;
        toastContainer.appendChild(t);
        setTimeout(() => t.remove(), duration);
        return t;
    }

    /* ===== MODAL SYSTEM ===== */
    function showModal(title, selector, type, callback) {
        portal.style.pointerEvents = "auto";
        const overlay = document.createElement("div");
        overlay.className = "afm-overlay";
        const modal = document.createElement("div");
        modal.className = "afm-modal";
        modal.innerHTML = `
            <h2>${title}</h2>
            <p>Selector: <b>${selector}</b></p>
            <div style="display:flex;align-items:center;">
                <input type="${type==='field'?'text':'number'}" id="afm-input">
                ${type==='field'?'<button id="afm-eye">👁️</button>':''}
                <button class="cancel">Cancel</button>
                <button class="save">Save</button>
            </div>
        `;
        overlay.appendChild(modal);
        shadow.appendChild(overlay);

        const input = modal.querySelector("#afm-input");
        const eye = modal.querySelector("#afm-eye");
        if (eye) {
            let visible = false;
            eye.addEventListener("click", () => {
                visible = !visible;
                input.type = visible ? "text" : "password";
            });
        }

        modal.querySelector(".cancel").addEventListener("click", () => {
            overlay.remove();
            portal.style.pointerEvents = "none";
        });
        modal.querySelector(".save").addEventListener("click", () => {
            const val = input.value;
            overlay.remove();
            portal.style.pointerEvents = "none";
            callback(val);
        });
    }

    /* ===== PICKER ===== */
    function picker(type) {
        const toast = showToast(type === 'field' ? 'Click a field to save' : 'Click a button to save', 5000);

        function onClick(e) {
            e.preventDefault();
            e.stopPropagation();
            const el = e.target;
            if (type === 'field' && !(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;
            if (type === 'click' && !(el instanceof HTMLElement)) return;
            toast.remove();
            document.removeEventListener("click", onClick, true);
            showModal(type === 'field' ? 'Save Field' : 'Save Click', getSelector(el), type, val => {
                if (type === 'field') store[siteKey].fields.push({
                    selector: getSelector(el),
                    value: val
                });
                else store[siteKey].clicks.push({
                    selector: getSelector(el),
                    delay: Number(val) || 0
                });
                GM_setValue(STORAGE_KEY, store);
                showToast(type === 'click' ? `Saved! Delay: ${val} ms` : "Saved!", 1500);
                renderEditor();
                resetInactivityTimer();
            });
        }
        document.addEventListener("click", onClick, true);
    }

    /* ===== EDITOR FUNCTIONS ===== */
    function requirePasskey() {
        let stored = GM_getValue(PASSKEY_KEY);
        if (!stored) {
            const pk = prompt("Set a passkey for Autofill Editor:");
            if (!pk) return false;
            GM_setValue(PASSKEY_KEY, simpleHash(pk));
            return true;
        }
        const input = prompt("Enter passkey:");
        return input && simpleHash(input) === stored;
    }

    function resetPasskey() {
        if (confirm("⚠️ Reset passkey and all data?")) {
            GM_setValue(PASSKEY_KEY, null);
            GM_setValue(STORAGE_KEY, {});
            logoutEditor();
            showToast("Passkey & data reset.");
        }
    }

    function logoutEditor() {
        container.innerHTML = "";
        editor.innerHTML = `<div class="afm-logout-message">
            Logged out due to inactivity.<br>Reopen the UI to continue.
        </div>`;
    }

    function normalizeSite(site) {
        store[site] ??= {};
        store[site].enabled ??= true;
        store[site].fields ??= [];
        store[site].clicks ??= [];
    }

    function createFieldRow(site, index) {
        const f = store[site].fields[index];
        const row = document.createElement("div");
        row.className = "field";
        const selInput = document.createElement("input");
        selInput.value = f.selector;
        const valInput = document.createElement("input");
        valInput.value = f.value;
        const delBtn = document.createElement("button");
        delBtn.className = "del";
        delBtn.textContent = "❌";
        row.append(selInput, valInput, delBtn);

        selInput.addEventListener("input", () => {
            f.selector = selInput.value;
            saveEditor();
            resetInactivityTimer();
        });
        valInput.addEventListener("input", () => {
            f.value = valInput.value;
            saveEditor();
            resetInactivityTimer();
        });
        delBtn.addEventListener("click", () => {
            store[site].fields.splice(index, 1);
            saveEditor();
            resetInactivityTimer();
        });
        return row;
    }

    function createClickRow(site, index) {
        const c = store[site].clicks[index];
        const row = document.createElement("div");
        row.className = "click";
        const selInput = document.createElement("input");
        selInput.value = c.selector;
        const delayInput = document.createElement("input");
        delayInput.value = c.delay;
        const label = document.createElement("span");
        label.textContent = 'ms';
        const delBtn = document.createElement("button");
        delBtn.className = 'del';
        delBtn.textContent = '❌';
        row.append(selInput, delayInput, label, delBtn);

        selInput.addEventListener("input", () => {
            c.selector = selInput.value;
            saveEditor();
            resetInactivityTimer();
        });
        delayInput.addEventListener("input", () => {
            c.delay = parseInt(delayInput.value) || 0;
            saveEditor();
            resetInactivityTimer();
        });
        delBtn.addEventListener("click", () => {
            store[site].clicks.splice(index, 1);
            saveEditor();
            resetInactivityTimer();
        });
        return row;
    }

    function renderEditor() {
        container.innerHTML = "";
        normalizeSite(siteKey);
        toggleBtn.textContent = store[siteKey].enabled ? 'Site Enabled ✅' : 'Site Disabled ❌';

        for (const [site, data] of Object.entries(store)) {
            normalizeSite(site);
            const div = document.createElement("div");
            div.className = "site";
            if (site === siteKey) div.classList.add("current");
            div.innerHTML = `<h3>${site} <span class="status">[${data.enabled?'Enabled':'Disabled'}]</span></h3>`;

            // Fields
            const fieldHeader = document.createElement("h4");
            fieldHeader.textContent = 'Fields';
            div.appendChild(fieldHeader);
            const fieldContainer = document.createElement("div");
            div.appendChild(fieldContainer);
            data.fields.forEach((f, i) => fieldContainer.appendChild(createFieldRow(site, i)));
            const addFieldBtn = document.createElement("button");
            addFieldBtn.className = 'add';
            addFieldBtn.textContent = '➕ Add Field';
            addFieldBtn.addEventListener("click", () => {
                data.fields.push({
                    selector: '',
                    value: ''
                });
                fieldContainer.appendChild(createFieldRow(site, data.fields.length - 1));
                saveEditor();
                resetInactivityTimer();
            });
            div.appendChild(addFieldBtn);

            // Clicks
            const clickHeader = document.createElement("h4");
            clickHeader.textContent = 'Clicks';
            div.appendChild(clickHeader);
            const clickContainer = document.createElement("div");
            div.appendChild(clickContainer);
            data.clicks.forEach((c, i) => clickContainer.appendChild(createClickRow(site, i)));
            const addClickBtn = document.createElement("button");
            addClickBtn.className = 'add';
            addClickBtn.textContent = '➕ Add Click';
            addClickBtn.addEventListener("click", () => {
                data.clicks.push({
                    selector: '',
                    delay: 0
                });
                clickContainer.appendChild(createClickRow(site, data.clicks.length - 1));
                saveEditor();
                resetInactivityTimer();
            });
            div.appendChild(addClickBtn);

            container.appendChild(div);
        }
    }

    function saveEditor() {
        GM_setValue(STORAGE_KEY, store);
        renderEditor();
    }

    toggleBtn.addEventListener("click", () => {
        store[siteKey].enabled = !store[siteKey].enabled;
        saveEditor();
        resetInactivityTimer();
    });

    resetBtn.addEventListener("click", resetPasskey);
    closeBtn.addEventListener("click", () => {
        editor.style.display = "none";
    });

    function openEditor() {
        if (!requirePasskey()) return;
        editor.style.display = "flex";
        renderEditor();
        resetInactivityTimer();
    }

    /* ===== INACTIVITY LOGOUT ===== */
    let lastActivity = Date.now();
    const inactivityLimit = 3 * 60 * 1000; // 3 minutes
    function resetInactivityTimer() {
        lastActivity = Date.now();
    }
    document.addEventListener("mousemove", resetInactivityTimer);
    document.addEventListener("keydown", resetInactivityTimer);
    setInterval(() => {
        if (editor.style.display === "flex" && Date.now() - lastActivity > inactivityLimit) {
            logoutEditor();
        }
    }, 5000);

    /* ===== MENU ===== */
    GM_registerMenuCommand("➕ Add Autofill Field (Picker)", () => picker('field'));
    GM_registerMenuCommand("🖱️ Add Auto-Click (Picker)", () => picker('click'));
    GM_registerMenuCommand("🔐 Open Autofill Editor", openEditor);
    GM_registerMenuCommand("⚠️ Reset Passkey & Data", resetPasskey);

})();