// ==UserScript==
// @name         LW Scripts
// @namespace    https://github.com/Arassas1
// @version      1.1.1
// @description  Allocation filters + Item Sum filters (Between & Equals) + AUTO FULL every 10s + auto-sort.
// @match        https://www.linnworks.net/*
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/555727/LW%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/555727/LW%20Scripts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ----------------------------------------------------
    // CONFIG
    // ----------------------------------------------------
    const AUTO_KEY = "lw_auto_loop_enabled";
    const DEFAULT_LOOP_ENABLED = false; // auto FULL enabled by default?
    const LOOP_INTERVAL = 10000;

    const VIEW_ITEM_RULES = {
        "ajs monkey view (5)": 5,
        "ajs monkey view (7)": 7,
    };

    const onOrdersBeta = () => location.hash.startsWith("#/app/OrdersBeta");

    const META = GM_info?.scriptMetaStr || "";
    const IS_LIVE = /greasyfork/i.test(META);
    const TOOLKIT_TITLE = IS_LIVE ? "Nikura Toolkit" : "Nikura Toolkit – Sandbox";

    const getLoopEnabled = () => {
        const v = localStorage.getItem(AUTO_KEY);
        return v === null ? DEFAULT_LOOP_ENABLED : v === "1";
    };
    const setLoopEnabled = v => localStorage.setItem(AUTO_KEY, v ? "1" : "0");

    // ----------------------------------------------------
    // LOGGING
    // ----------------------------------------------------
    const log = (...msg) => {
        console.log("[LW Scripts]", ...msg);
        const box = document.getElementById("ajs-status-line");
        if (box) box.textContent = msg.join(" ");
    };

    // ----------------------------------------------------
    // REAL CLICK
    // ----------------------------------------------------
    function forceClick(el) {
        ["pointerdown", "mousedown", "mouseup", "click"].forEach(type =>
            el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }))
        );
    }

    // ----------------------------------------------------
    // CLOSE FILTER POPUP
    // ----------------------------------------------------
    function closeFilterPopup() {
        const menu = document.querySelector(".ag-menu, .ag-popup");
        if (!menu) return;
        const tab = menu.querySelector('.ag-tab.ag-tab-selected[aria-label="filter"]');
        if (tab) forceClick(tab);
    }

    // ----------------------------------------------------
    // VIEW HELPERS
    // ----------------------------------------------------
    function getCurrentLWView() {
        return document.querySelector('.navigation-item.active .primary')
            ?.textContent.trim().toLowerCase() || "";
    }

    function getItemQuantityForView() {
        const cur = getCurrentLWView();
        for (const [key, qty] of Object.entries(VIEW_ITEM_RULES)) {
            if (cur.includes(key)) return qty;
        }
        return null;
    }

    // ----------------------------------------------------
    // SORT BY ITEM SUM QUANTITY
    // ----------------------------------------------------
    function sortByItemSumQuantity() {
        // Find the Items Sum Quantity header
        const headerLabel = [...document.querySelectorAll(".ag-header-cell-label")]
            .find(h => h.textContent.trim().toLowerCase().includes("items sum quantity"));

        if (!headerLabel) {
            log("❌ Items Sum Quantity header not found");
            return;
        }

        // Detect if ASCENDING sort icon is currently visible (active)
        const ascIconActive = headerLabel.querySelector(
            '.ag-sort-ascending-icon:not(.ag-hidden) .ag-icon.ag-icon-asc'
        );

        if (ascIconActive) {
            log("✔ Items Sum already sorted ASC — skipping click");
            return;
        }

        // Not ASC → click to move sorting toward ASC
        forceClick(headerLabel);
        log("✔ Clicked Items Sum header to sort ASC");
    }

    // ----------------------------------------------------
    // STOCK ALLOCATION FILTERS
    // ----------------------------------------------------
    async function openStockAllocationMenu() {
        const input = document.querySelector('input[aria-label="Stock Allocation Filter Input"]');
        if (!input) return log("❌ Stock Allocation input not found");

        const wrap = input.closest(".ag-text-field");
        if (!wrap) return log("❌ Wrapper not found");

        wrap.click();
        await new Promise(r => setTimeout(r, 150));
    }

    async function applyCheckboxFilter(wantedLabels = []) {
        const items = [...document.querySelectorAll(".ag-set-filter-item")];
        items.forEach(item => {
            const label = item.querySelector(".ag-checkbox-label")?.textContent.trim();
            const input = item.querySelector("input");
            if (!label || !input || label === "(Select All)") return;
            const should = wantedLabels.includes(label);
            if (should && !input.checked) input.click();
            if (!should && input.checked) input.click();
        });
    }

    async function runFilter(labels) {
        await openStockAllocationMenu();
        await applyCheckboxFilter(labels);
        closeFilterPopup();
        log(`✔ Applied: ${labels.join(", ")}`);
    }

    // ----------------------------------------------------
    // ≤ SIMPLE FILTER
    // ----------------------------------------------------
    function applyItemsLessThanFilter(maxVal) {
        const input = document.querySelector('input[aria-label="Items Sum Quantity Filter Input"]');
        if (!input) return log("❌ Items input not found");

        input.value = maxVal;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));

        closeFilterPopup();
        log(`✔ Items <= ${maxVal} applied`);
    }

    function clearItemsFilter() {
        const input = document.querySelector('input[aria-label="Items Sum Quantity Filter Input"]');
        if (!input) return;

        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));

        closeFilterPopup();
        log("✔ Items filter cleared");
    }

    // ----------------------------------------------------
    // OPEN ITEM SUM POPUP
    // ----------------------------------------------------
    function openItemSumFilterPopup() {
        const header = [...document.querySelectorAll(".ag-header-cell.ag-floating-filter")]
            .find(c => c.querySelector('input[aria-label="Items Sum Quantity Filter Input"]'));

        if (!header) return log("❌ Item Sum header not found");
        const btn = header.querySelector(".ag-floating-filter-button button");
        if (!btn) return log("❌ Popup button missing");

        forceClick(btn);
    }

    // ----------------------------------------------------
    // OPERATOR PICKER
    // ----------------------------------------------------
    async function openOperatorDropdown() {
        let field = null;
        for (let i = 0; i < 50; i++) {
            field = document.querySelector(".ag-simple-filter-body-wrapper .ag-picker-field-wrapper");
            if (field) break;
            await new Promise(r => setTimeout(r, 25));
        }
        if (!field) return log("❌ Operator field not found");
        forceClick(field);
    }

    async function selectOperator(op) {
        let list = null;
        for (let i = 0; i < 60; i++) {
            list = document.querySelector('.ag-select-list.ag-popup-child[role="listbox"]');
            if (list && list.offsetParent !== null) break;
            await new Promise(r => setTimeout(r, 25));
        }
        if (!list) return log("❌ Operator dropdown list missing");

        const match = [...list.querySelectorAll(".ag-list-item span")]
            .find(el => el.textContent.trim().toLowerCase() === op.toLowerCase());

        if (!match) return log(`❌ Cannot find operator '${op}'`);
        forceClick(match);
    }

    // ----------------------------------------------------
    // BETWEEN
    // ----------------------------------------------------
    async function fillBetweenValues(minVal, maxVal) {
        let from = null, to = null;
        for (let i = 0; i < 60; i++) {
            from = document.querySelector('input[placeholder="From"]');
            to   = document.querySelector('input[placeholder="To"]');
            if (from && to) break;
            await new Promise(r => setTimeout(r, 20));
        }

        from.value = minVal;
        from.dispatchEvent(new Event("input", { bubbles: true }));
        from.dispatchEvent(new Event("change", { bubbles: true }));

        to.value = maxVal;
        to.dispatchEvent(new Event("input", { bubbles: true }));
        to.dispatchEvent(new Event("change", { bubbles: true }));
    }

    async function applyBetweenRange(minVal, maxVal) {
        openItemSumFilterPopup();
        await openOperatorDropdown();
        await selectOperator("between");
        await fillBetweenValues(minVal, maxVal);
        closeFilterPopup();
        setTimeout(sortByItemSumQuantity, 150);
    }

    // ----------------------------------------------------
    // EQUALS = 5
    // ----------------------------------------------------
    async function applyEqualsFive() {
        openItemSumFilterPopup();
        await openOperatorDropdown();
        await selectOperator("equals");

        let input = null;
        for (let i = 0; i < 60; i++) {
            input = document.querySelector('.ag-filter-from input[placeholder="Filter..."]');
            if (input) break;
            await new Promise(r => setTimeout(r, 20));
        }
        if (!input) return log("❌ Equals input missing");

        input.value = 5;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));

        closeFilterPopup();
        setTimeout(sortByItemSumQuantity, 150);
    }

    // ----------------------------------------------------
    // AUTO FULL LOOP
    // ----------------------------------------------------
    let loopHandle = null;

    function isFullAlreadyActive() {
        const el = document.querySelector('[aria-label="Stock Allocation Filter Input"]');
        if (!el) return false;
        return el.value.trim().toLowerCase().includes("full");
    }

    function startLoop() {
        stopLoop();
        loopHandle = setInterval(() => {
            if (!onOrdersBeta()) return;
            if (isFullAlreadyActive()) return;
            runFilter(["Full"]);
        }, LOOP_INTERVAL);
    }

    function stopLoop() {
        if (loopHandle) clearInterval(loopHandle);
        loopHandle = null;
    }

    // ----------------------------------------------------
    // UI PANEL
    // ----------------------------------------------------
    function addUI() {
        if (document.getElementById("ajs-floating-panel")) return;

        const panel = document.createElement("div");
        panel.id = "ajs-floating-panel";
        panel.style.cssText = `
            position:fixed; top:80px; right:500px; z-index:999999;
            width:260px; padding:14px; background:#2b2d42; color:white;
            border-radius:8px; box-shadow:0 3px 12px rgba(0,0,0,.35);
        `;

        panel.innerHTML = `
            <div id="ajs-header" style="font-weight:bold; text-align:center; margin-bottom:20px; cursor:move;">
                ${TOOLKIT_TITLE}
            </div>

            <div>Allocation Filters</div>
            <button class="ajs-btn" id="btn-full">Show Fully Allocated</button>
            <button class="ajs-btn" id="btn-partna">Show Partial + NA + Insufficient</button>
            <button class="ajs-btn" id="btn-all">Clear Allocation Filters</button>

            <div style="margin-top:18px;">Item Sum Filters</div>
            <button class="ajs-btn" id="btn-1-4">1 – 4</button>
            <button class="ajs-btn" id="btn-eq5">5</button>
            <button class="ajs-btn" id="btn-6-7">6 – 7</button>
            <button class="ajs-btn" id="btn-8-16">8 – 16</button>
            <button class="ajs-btn" id="btn-clear-items">Clear Qty Filters</button>

            <label style="display:flex; gap:8px; margin-top:14px;">
                <input type="checkbox" id="chk-loop" ${getLoopEnabled() ? "checked" : ""}>
                Auto Apply 'Show Fully Allocatyed'
            </label>

            <div id="ajs-status-line" style="margin-top:15px; padding:8px; border-radius:6px; text-align:center; font-size:13px;">
                Ready.
            </div>
        `;

        document.body.appendChild(panel);

        document.querySelectorAll(".ajs-btn").forEach(btn => {
            btn.style.cssText = `
                width:100%; padding:8px; margin-top:10px;
                background:#4a63e7; border:none; border-radius:6px;
                color:white; font-weight:bold; cursor:pointer;
            `;
        });

        // Allocation
        document.getElementById("btn-full").onclick   = () => runFilter(["Full"]);
        document.getElementById("btn-partna").onclick = () => runFilter(["Partial", "Not Allocated", "Insufficient"]);
        document.getElementById("btn-all").onclick    = () => runFilter(["Full","Partial","Not Allocated","Insufficient"]);

        // Item Sum
        document.getElementById("btn-1-4").onclick  = () => applyBetweenRange(0,5);
        document.getElementById("btn-eq5").onclick  = () => applyEqualsFive();
        document.getElementById("btn-6-7").onclick  = () => applyBetweenRange(5,8);
        document.getElementById("btn-8-16").onclick = () => applyBetweenRange(7,17);

        document.getElementById("btn-clear-items").onclick = clearItemsFilter;

        // Auto FULL toggle
        const chk = document.getElementById("chk-loop");
        chk.onchange = () => {
            if (chk.checked) {
                setLoopEnabled(true);
                runFilter(["Full"]);
                startLoop();
            } else {
                setLoopEnabled(false);
                stopLoop();
            }
        };

        if (getLoopEnabled()) startLoop();

        // Draggable
        let mx=0, my=0;
        document.getElementById("ajs-header").onmousedown = e => {
            mx=e.clientX; my=e.clientY;
            document.onmousemove = ev => {
                panel.style.top  = (panel.offsetTop -(my-ev.clientY))+"px";
                panel.style.left = (panel.offsetLeft-(mx-ev.clientX))+"px";
                mx=ev.clientX; my=ev.clientY;
            };
            document.onmouseup = () => document.onmousemove=null;
        };
    }

    // ----------------------------------------------------
    // URL WATCHER
    // ----------------------------------------------------
    let lastHash = "";
    setInterval(() => {
        const h = location.hash;
        if (h !== lastHash) {
            lastHash = h;
            stopLoop();
            if (onOrdersBeta()) setTimeout(addUI, 500);
            else document.getElementById("ajs-floating-panel")?.remove();
        }
    }, 300);

    if (onOrdersBeta()) setTimeout(addUI, 700);

})();