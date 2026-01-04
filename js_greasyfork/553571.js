// ==UserScript==
// @name         TornTools Stacking Mode
// @namespace    https://torn.tools/
// @version      1.1.0
// @description  Standalone Stacking Mode: blocks attacking/reviving/hunting/gym actions across Torn pages, replicating TornTools' stacking feature, with a toggle in the settings menu.
// @author       you
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553571/TornTools%20Stacking%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/553571/TornTools%20Stacking%20Mode.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // ---------- Config / State ----------
    const STORAGE_KEY = "tt_stacking_mode_enabled";
    let stackingEnabled = GM_getValue(STORAGE_KEY, false);
    let hiddenDivs = new Set();
    let blockedElements = new Set();
    let urlObserverAttached = false;
    let domObserver = null;

    // ---------- Utilities ----------
    async function requireElement(selector, { parent = document, timeout = 10000 } = {}) {
        const start = Date.now();
        let el = parent.querySelector(selector);
        while (!el) {
            if (Date.now() - start > timeout) throw new Error(`Timeout waiting for ${selector}`);
            await new Promise((r) => requestAnimationFrame(r));
            el = parent.querySelector(selector);
        }
        return el;
    }

    Document.prototype.findAll ||= function (sel) { return Array.from(this.querySelectorAll(sel)); };
    Element.prototype.findAll ||= function (sel) { return Array.from(this.querySelectorAll(sel)); };
    Document.prototype.find ||= function (sel) { return this.querySelector(sel); };
    Element.prototype.find ||= function (sel) { return this.querySelector(sel); };
    Document.prototype.newElement ||= function ({ type = "div", class: cls, text, children, attrs } = {}) {
        const el = document.createElement(type);
        if (cls) el.className = cls;
        if (text != null) el.textContent = text;
        if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        if (children) children.forEach((c) => el.appendChild(c));
        return el;
    };

    function crossSvg() {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.classList.add("tt-cross");
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z");
        svg.appendChild(path);
        return svg;
    }

    function stackBlockSvg(customClass) {
        const svg = crossSvg();
        svg.classList.add("tt-stacking");
        if (customClass) svg.classList.add(customClass);
        return svg;
    }

    function addMouseBlock(el, cls) {
        if (!el || el.classList.contains("tt-mouse-block")) return;
        el.classList.add("tt-mouse-block");
        if (cls) el.classList.add(cls);
        el.appendChild(stackBlockSvg(cls));
        blockedElements.add(el);
    }

    function removeMouseBlock(el) {
        if (!el) return;
        el.classList.remove("tt-mouse-block", "tt-attack-block", "tt-revive-block");
        el.querySelectorAll(".tt-cross, .tt-stacking").forEach((x) => x.remove());
    }

    function createStackNotice() {
        return document.newElement({
            type: "div",
            class: "tt-stack-block",
            children: [
                document.newElement({
                    type: "span",
                    text: "TornTools - You've enabled stacking mode.",
                }),
            ],
        });
    }

    function hideSection(section) {
        if (!section || section.classList.contains("tt-hidden")) return;
        section.classList.add("tt-hidden");
        hiddenDivs.add(section);
        section.insertAdjacentElement("beforebegin", createStackNotice());
    }

    function unhideAll() {
        hiddenDivs.forEach((x) => x.classList.remove("tt-hidden"));
        hiddenDivs.clear();
        document.querySelectorAll(".tt-stack-block").forEach((x) => x.remove());
    }

    function unblockAll() {
        blockedElements.forEach((el) => removeMouseBlock(el));
        blockedElements.clear();
    }

    function getPage() {
        const p = location.pathname.toLowerCase();
        const q = location.search.toLowerCase();
        if (p.includes("/profiles.php")) return "profiles";
        if (p.includes("/hospital.php")) return "hospital";
        if (p.includes("/hospitalview.php")) return "hospital";
        if (p.includes("/gym.php")) return "gym";
        if (p.includes("/attack.php")) return "attack";
        if (p.includes("/dump.php")) return "dump";
        if (p.includes("/index.php") || p === "/" || p.includes("/home.php")) return "home";
        if (p.includes("/city.php") && (q.includes("hunting") || document.querySelector("#nav-hunting"))) return "hunting";
        if (p.includes("/abroad.php") || q.includes("sid=abroadpeople")) return "abroad-people";
        return "unknown";
    }

    async function applyStacking() {
        if (!stackingEnabled) return;
        const currentPage = getPage();

        if (currentPage === "gym") {
            const section = await safeRequire("#gymroot");
            if (section) hideSection(section);
        } else if (currentPage === "hunting") {
            const section = await safeRequire(".hunt");
            if (section) hideSection(section);
        } else if (currentPage === "attack") {
            const section = await safeRequire("[class*='coreWrap__']");
            if (section) hideSection(section);
        } else if (currentPage === "dump") {
            const section = await safeRequire(".dump-main-page");
            if (section) hideSection(section);
        } else if (currentPage === "profiles") {
            const attackBtn = await safeRequire("#profileroot .profile-button-attack");
            if (attackBtn) addMouseBlock(attackBtn, "tt-attack-block");
            const revBtn = await safeRequire("#profileroot .profile-button-revive");
            if (revBtn) addMouseBlock(revBtn, "tt-revive-block");
        } else if (currentPage === "hospital") {
            await disableRevivingOnHospital();
        } else if (currentPage === "abroad-people") {
            await disableAttackingOnAbroadPeople();
        }

        await handleMiniProfile();
    }

    async function disableRevivingOnHospital() {
        await waitForDocumentInteractive();
        document.findAll("a.revive:not(.reviveNotAvailable)").forEach((btn) => addMouseBlock(btn, "tt-revive-block"));
    }

    async function disableAttackingOnAbroadPeople() {
        await waitForDocumentInteractive();
        document.findAll(".users-list > li .attack").forEach((btn) => addMouseBlock(btn, "tt-attack-block"));
    }

    async function handleMiniProfile() {
        const mini = document.querySelector("#profile-mini-root .mini-profile-wrapper");
        if (!mini) return;
        const attackButton = mini.querySelector(".profile-button-attack");
        if (attackButton) addMouseBlock(attackButton, "tt-attack-block");
        const profileContainer = mini.querySelector(".profile-container");
        if (profileContainer?.classList.contains("hospital")) {
            const reviveButton = mini.querySelector(".profile-button-revive");
            if (reviveButton) addMouseBlock(reviveButton, "tt-revive-block");
        }
    }

    async function safeRequire(selector, opts) {
        try { return await requireElement(selector, opts); } catch { return null; }
    }

    async function waitForDocumentInteractive() {
        if (document.readyState === "complete" || document.readyState === "interactive") return;
        await new Promise((r) => document.addEventListener("DOMContentLoaded", r, { once: true }));
    }

    async function enableStacking() {
        GM_setValue(STORAGE_KEY, true);
        stackingEnabled = true;
        attachDomObserver();
        await applyStacking();
        updateSettingsToggleUI();
        showToast("Stacking Mode: ENABLED");
    }

    async function disableStacking() {
        GM_setValue(STORAGE_KEY, false);
        stackingEnabled = false;
        unhideAll();
        unblockAll();
        updateSettingsToggleUI();
        showToast("Stacking Mode: DISABLED");
    }

    function attachUrlObserver() {
        if (urlObserverAttached) return;
        urlObserverAttached = true;
        const _pushState = history.pushState;
        const _replaceState = history.replaceState;
        const onUrlChange = () => {
            setTimeout(() => {
                if (stackingEnabled) {
                    unhideAll();
                    unblockAll();
                    applyStacking();
                }
                // menus may re-render across sections
                ensureSettingsToggleExists();
            }, 50);
        };
        history.pushState = function () { const r = _pushState.apply(this, arguments); onUrlChange(); return r; };
        history.replaceState = function () { const r = _replaceState.apply(this, arguments); onUrlChange(); return r; };
        window.addEventListener("popstate", onUrlChange);
    }

    function attachDomObserver() {
        if (domObserver) return;
        domObserver = new MutationObserver((muts) => {
            let relevant = muts.some(m => m.addedNodes?.length || m.type === "attributes");
            if (relevant) {
                if (stackingEnabled) {
                    handleMiniProfile();
                    if (getPage() === "hospital") disableRevivingOnHospital();
                    if (getPage() === "abroad-people") disableAttackingOnAbroadPeople();
                }
                // the settings dropdown is dynamic—keep the toggle present/synced
                ensureSettingsToggleExists();
            }
        });
        domObserver.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
    }

    // ---------- Settings menu integration ----------
    const TOGGLE_INPUT_ID = "stacking-mode-state";
    const TOGGLE_LI_CLASS = "setting stacking-mode";

    function ensureSettingsToggleExists() {
        const menus = document.querySelectorAll("ul.settings-menu");
        menus.forEach((menu) => {
            // already inserted?
            if (menu.querySelector(`#${TOGGLE_INPUT_ID}`)) {
                updateSettingsToggleUI(menu);
                return;
            }
            // Find a reference item to insert near (place after "Dark Mode" if present, else append)
            const after = menu.querySelector("li.setting.dark-mode") || menu.lastElementChild;
            const li = buildSettingsToggleItem();
            if (after && after.nextSibling) {
                menu.insertBefore(li, after.nextSibling);
            } else {
                menu.appendChild(li);
            }
        });
    }

    function buildSettingsToggleItem() {
        const li = document.createElement("li");
        li.className = TOGGLE_LI_CLASS;

        const label = document.createElement("label");
        label.className = "setting-container";
        label.setAttribute("for", TOGGLE_INPUT_ID);

        // icon wrapper: simple crossed icon to hint "block"
        const iconWrap = document.createElement("div");
        iconWrap.className = "icon-wrapper";
        iconWrap.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="-6 -4 28 28" aria-hidden="true">
            <path d="M13.88,12.06c-2.29-.52-4.43-1-3.39-2.94C13.63,3.18,11.32,0,8,0S2.36,3.3,5.51,9.12c1.07,2-1.15,2.43-3.39,2.94C.13,12.52,0,13.49,0,15.17V16H16v-.83C16,13.49,15.87,12.52,13.88,12.06Z"></path>
          </svg>
        `;

        const name = document.createElement("span");
        name.className = "setting-name";
        name.textContent = "Stacking Mode";

        const choice = document.createElement("div");
        choice.className = "choice-container";

        const input = document.createElement("input");
        input.id = TOGGLE_INPUT_ID;
        input.className = "checkbox-css dark-bg";
        input.type = "checkbox";
        input.checked = !!stackingEnabled;

        const marker = document.createElement("label");
        marker.className = "marker-css";
        marker.setAttribute("for", TOGGLE_INPUT_ID);

        choice.appendChild(input);
        choice.appendChild(marker);

        label.appendChild(iconWrap);
        label.appendChild(name);
        label.appendChild(choice);
        li.appendChild(label);

        // events
        input.addEventListener("change", async (e) => {
            if (e.target.checked) await enableStacking();
            else await disableStacking();
        });

        return li;
    }

    function updateSettingsToggleUI(ctx = document) {
        const input = ctx.querySelector(`#${TOGGLE_INPUT_ID}`);
        if (input) input.checked = !!stackingEnabled;
    }

    // ---------- Styles ----------
    GM_addStyle(`
        /* Original TornTools stacking CSS */
        .tt-stack-block {
          width: 100%;
          text-align: center;
          height: 30vh;
          line-height: 30vh;
          font-size: 26px;
        }

        .tt-mouse-block { pointer-events: none; }

        .tt-stacking.tt-cross { transform: translate(5px, -43px); }

        #profile-mini-root .tt-stacking.tt-cross { margin-top: 1px; }

        .tt-stacking.tt-revive-block { transform: translateY(-24px); }

        .tt-stacking.tt-attack-block {
          position: absolute;
          margin-left: -2.3%;
          transform: none;
        }

        /* Tiny toast for feedback */
        .tt-toast {
          position: fixed;
          z-index: 2147483647;
          right: 16px;
          bottom: 16px;
          padding: 10px 12px;
          border-radius: 8px;
          background: rgba(33,33,33,0.92);
          color: #fff;
          font-size: 13px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.3);
          pointer-events: none;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity .15s ease, transform .15s ease;
        }
        .tt-toast.show { opacity: 1; transform: translateY(0); }
      `);

    function showToast(text, ms = 1200) {
        const el = document.createElement("div");
        el.className = "tt-toast";
        el.textContent = text;
        document.documentElement.appendChild(el);
        void el.offsetHeight;
        el.classList.add("show");
        setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 200); }, ms);
    }

    // ---------- Fetch patch for mini-profile ----------
    (function patchFetch() {
        const _fetch = window.fetch;
        if (!_fetch) return;
        window.fetch = async function (...args) {
            const res = await _fetch.apply(this, args);
            try {
                const url = String(args[0]?.url || args[0] || "");
                if (stackingEnabled && /getUserNameContextMenu/i.test(url)) {
                    Promise.resolve().then(() => setTimeout(handleMiniProfile, 50));
                }
            } catch {}
            return res;
        };
    })();

    // ---------- Boot ----------
    (async function init() {
        attachUrlObserver();
        attachDomObserver();
        await waitForDocumentInteractive();
        ensureSettingsToggleExists();
        if (stackingEnabled) await applyStacking();
    })();
})();

