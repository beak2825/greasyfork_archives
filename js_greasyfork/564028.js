// ==UserScript==
// @name         R4G3RUNN3R's Recruitment Agency
// @namespace    r4g3runn3r.recruitment.agency
// @version      1.8.7
// @description  Architecture Locked: Persistent Mode, Inline Switcher, and Debounced Authority Gate.
// @author       R4G3RUNN3R[3877028]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564171/R4G3RUNN3R%27s%20Recruitment%20Agency.user.js
// @updateURL https://update.greasyfork.org/scripts/564171/R4G3RUNN3R%27s%20Recruitment%20Agency.meta.js
// ==/UserScript==

(() => {
    "use strict";

    /* -----------------------------
       CONFIG & STATE
    ----------------------------- */
    const DB_NAME = "tornWorkerDB";
    const REQUIRED_DB_VERSION = 4;
    const API_BASE = "https://api.torn.com/v2";

    let db = null;
    let dbReady = false; 
    let scanRunning = false;
    let recruitmentMode = null; 
    let activeThreadId = null;
    let raUIState = "minimized";

    /* -----------------------------
       UI PERSISTENCE HELPERS
    ----------------------------- */
    async function saveGlobalSettings(update) {
        const m = await idb.get("meta", "global") || { settings: {}, syncHistory: {} };
        m.settings = { ...m.settings, ...update };
        await idb.put("meta", m);
    }

    /* -----------------------------
       SURVIVABILITY & DEBOUNCED GATES
    ----------------------------- */
    async function ensureUI() {
        // AUTHORITY GATE: Load state from DB before any UI exists
        if (!dbReady) {
            db = await openDBSmart();
            const m = await idb.get("meta", "global") || { settings: {} };
            recruitmentMode = m.settings?.activeMode || null;
            raUIState = m.settings?.uiState || "minimized";
            dbReady = true;
        }

        if (!recruitmentMode) {
            if (!document.getElementById("ra-launcher")) injectLauncher();
            return;
        }

        // Cleanup and render authorized state
        if (document.getElementById("ra-launcher")) document.getElementById("ra-launcher").remove();
        if (!document.getElementById("ra-panel")) injectPanel();
        if (!document.getElementById("ra-float-wrap")) ensureFloatingButton();
        
        document.body.setAttribute('data-ra-mode', recruitmentMode);
        applyUIState();
    }

    // Performance Debounce: Prevents IndexedDB hammering during navigation
    let uiTick = null;
    const observer = new MutationObserver(() => {
        if (uiTick) return;
        uiTick = setTimeout(() => {
            uiTick = null;
            ensureUI();
        }, 50);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    /* -----------------------------
       THE SWITCHER (Inline Lens Toggle)
    ----------------------------- */
    async function switchMode(newMode) {
        recruitmentMode = newMode;
        await saveGlobalSettings({ activeMode: newMode });
        document.body.setAttribute('data-ra-mode', newMode);
        
        const m = await idb.get("meta", "global");
        activeThreadId = m.syncHistory?.[newMode]?.lastThreadId || (newMode === 'company' ? 15907925 : "");
        
        const targetInput = document.getElementById("ra-target-id");
        if (targetInput) targetInput.value = activeThreadId;
        
        console.log(`[RA] Switched to ${newMode} mode.`);
        runSearch(); // Instant lens refresh
    }

    /* -----------------------------
       UI PANELS
    ----------------------------- */
    function injectPanel() {
        if (document.getElementById("ra-panel")) return;
        injectStyles();
        const p = document.createElement("div");
        p.id = "ra-panel";
        p.style.display = "none"; // Safe boot
        p.innerHTML = `
            <div class="ra-header" id="ra-drag">
                <div style="font-weight:900;">🏷️ RECRUITMENT AGENCY</div>
                <div><button class="ra-btn" id="ra-close-p">✕</button></div>
            </div>
            <div class="ra-inner">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <select id="ra-mode-switcher" class="ra-btn" style="background:var(--ra-bg-soft); border-color:var(--ra-accent);">
                        <option value="company">🏢 Company Mode</option>
                        <option value="faction">🛡️ Faction Mode</option>
                    </select>
                    <button id="ra-gear" class="ra-btn">⚙ Config</button>
                </div>
                <div id="ra-status" style="font-size:11px; color:var(--ra-accent);">Ready.</div>
                <div id="ra-results" style="margin-top:15px;"></div>
            </div>`;
        document.body.appendChild(p);

        const switcher = document.getElementById("ra-mode-switcher");
        switcher.value = recruitmentMode;
        switcher.onchange = (e) => switchMode(e.target.value);

        document.getElementById("ra-close-p").onclick = () => { 
            raUIState = "minimized"; 
            saveGlobalSettings({ uiState: "minimized" }); 
            applyUIState(); 
        };
        makeDraggable(p, p.querySelector("#ra-drag"));
    }

    async function startApp(mode) {
        recruitmentMode = mode;
        await saveGlobalSettings({ activeMode: mode, uiState: "open" });
        raUIState = "open";
        ensureUI();
    }

    function injectLauncher() {
        if (document.getElementById("ra-launcher")) return;
        injectStyles();
        const l = document.createElement("div");
        l.id = "ra-launcher";
        l.innerHTML = `
            <div class="ra-launcher-box">
                <div class="ra-header" style="cursor:move; margin:-30px -30px 20px -30px; border-radius:10px 10px 0 0;"><div style="font-weight:900;">🏷️ Recruitment Agency</div></div>
                <p style="font-size:11px; color:#9ca3af; margin-bottom:20px;">Context required. One-time selection.</p>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <button class="ra-btn ra-primary" id="ra-init-company">Company Recruitment</button>
                    <button class="ra-btn ra-primary" id="ra-init-faction">Faction Recruitment</button>
                </div>
            </div>`;
        document.body.appendChild(l);
        makeDraggable(l, l.querySelector(".ra-header"));
        document.getElementById("ra-init-company").onclick = () => startApp('company');
        document.getElementById("ra-init-faction").onclick = () => startApp('faction');
    }

    /* -----------------------------
       UI STATE MACHINE
    ----------------------------- */
    function applyUIState() {
        const p = document.getElementById("ra-panel"), f = document.getElementById("ra-float-wrap");
        if (!p || !f) return;

        if (raUIState === "open") {
            p.style.display = "block";
            p.classList.add("ra-visible");
            f.style.display = "none";
        } else {
            p.style.display = "none";
            p.classList.remove("ra-visible");
            f.style.display = "block";
        }
    }

    /* -----------------------------
       SHARED CORE (DB Helpers)
    ----------------------------- */
    async function openDBSmart() {
        return new Promise(res => {
            const r = indexedDB.open(DB_NAME, REQUIRED_DB_VERSION);
            r.onupgradeneeded = e => { const d = e.target.result; if(!d.objectStoreNames.contains("users")) d.createObjectStore("users", { keyPath: "userId" }); if(!d.objectStoreNames.contains("meta")) d.createObjectStore("meta", { keyPath: "key" }); };
            r.onsuccess = () => res(r.result);
        });
    }

    const idb = {
        get: (s, k) => new Promise(res => { if(!db) {res(null); return;} const tx = db.transaction(s, "readonly"); tx.objectStore(s).get(k).onsuccess = e => res(e.target.result); }),
        put: (s, v) => new Promise(res => { if(!db) {res(false); return;} const tx = db.transaction(s, "readwrite"); tx.objectStore(s).put(v).onsuccess = () => res(true); })
    };

    function makeDraggable(p, h) {
        let d = false, sx, sy, sl, st;
        h.onmousedown = e => { d = true; sx = e.clientX; sy = e.clientY; sl = p.offsetLeft; st = p.offsetTop; e.preventDefault(); };
        window.onmousemove = e => { if (!d) return; p.style.left = (sl + (e.clientX - sx)) + "px"; p.style.top = (st + (e.clientY - sy)) + "px"; };
        window.onmouseup = () => d = false;
    }

    ensureUI();
})();