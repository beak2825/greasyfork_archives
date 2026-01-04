// ==UserScript==
// @name         CS - Sort Pets by Dimensions + Ctrl Multi-Select + Drag Select
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Sort pets by dimensions + Ctrl click range selection (accumulative) + drag-to-select + update log + helper text
// @author       lissajo
// @match        https://www.chickensmoothie.com/accounts/viewgroup.php*
// @grant        none
// @license      MIT


// @downloadURL https://update.greasyfork.org/scripts/555950/CS%20-%20Sort%20Pets%20by%20Dimensions%20%2B%20Ctrl%20Multi-Select%20%2B%20Drag%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/555950/CS%20-%20Sort%20Pets%20by%20Dimensions%20%2B%20Ctrl%20Multi-Select%20%2B%20Drag%20Select.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const ENABLE_KEY = "cs_sort_pets_enabled";
    const MODE_KEY = "cs_sort_pets_mode";
    const PANEL_KEY_X = "cs_sort_pets_panel_x";
    const PANEL_KEY_Y = "cs_sort_pets_panel_y";

    let sortingEnabled = localStorage.getItem(ENABLE_KEY) === "true";
    let mode = localStorage.getItem(MODE_KEY) || "area";

    const style = document.createElement("style");
    style.textContent = `
        .cs-sort-box {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 999999;
            background: rgba(0,0,0,0.65);
            padding: 12px;
            border-radius: 10px;
            width: 190px;
            color: white;
            font-family: Arial, sans-serif;
            cursor: move;
            user-select: none;
        }
        .cs-sort-box h3 { margin: 0 0 8px 0; font-size: 14px; text-align: center; pointer-events: none; }
        .cs-sort-box button { width: 100%; padding: 6px; margin: 4px 0; font-size: 13px; border: none; border-radius: 6px; cursor: pointer; }
        .cs-onoff { background: #4caf50; color: white; }
        .cs-off { background: #b33a3a; color: white; }
        .cs-mode-btn { background: #666; color: white; }
        .cs-mode-btn.active { background: #2196f3; }
        .cs-helper { font-size: 11px; opacity: 0.85; text-align: center; margin-top: 4px; line-height: 1.2em; }
        .cs-update-link { text-align: center; margin-top: 8px; }
        .cs-update-link a { color: #ffcc00; font-size: 12px; text-decoration: none; }
        .drag-select-box { position: absolute; border: 2px dashed #00aaff; background: rgba(0,170,255,0.15); pointer-events: none; z-index: 9999999; }
    `;
    document.head.appendChild(style);

    function createTogglePanel() {
        const panel = document.createElement("div");
        panel.className = "cs-sort-box";

        const lastX = localStorage.getItem(PANEL_KEY_X);
        const lastY = localStorage.getItem(PANEL_KEY_Y);
        if (lastX && lastY) { panel.style.left = lastX + "px"; panel.style.top = lastY + "px"; }

        panel.innerHTML = `
            <h3>Sort Pets</h3>
            <button id="cs-enable-btn" class="${sortingEnabled ? "cs-onoff" : "cs-off"}">
                ${sortingEnabled ? "Enabled" : "Disabled"}
            </button>
            <button class="cs-mode-btn ${mode === "area" ? "active" : ""}" data-mode="area">Area</button>
            <button class="cs-mode-btn ${mode === "width" ? "active" : ""}" data-mode="width">Width</button>
            <button class="cs-mode-btn ${mode === "height" ? "active" : ""}" data-mode="height">Height</button>
            <div class="cs-helper">Ctrl + Click<br>to select multiple pets in a row<br>(will not select last pet clicked)<hr>Click & drag to<br>select multiple pets</div>
            <div class="cs-update-link">
                <a href="https://www.chickensmoothie.com/Forum/viewtopic.php?f=20&t=5091368" target="_blank">update log</a>
            </div>
        `;
        document.body.appendChild(panel);

        let offsetX = 0, offsetY = 0, dragging = false;
        panel.addEventListener("mousedown", e => {
            if (e.target.tagName === "BUTTON" || e.target.tagName === "A") return;
            dragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        });
        document.addEventListener("mousemove", e => {
            if (!dragging) return;
            panel.style.left = (e.clientX - offsetX) + "px";
            panel.style.top = (e.clientY - offsetY) + "px";
        });
        document.addEventListener("mouseup", () => {
            if (!dragging) return;
            dragging = false;
            localStorage.setItem(PANEL_KEY_X, parseInt(panel.style.left));
            localStorage.setItem(PANEL_KEY_Y, parseInt(panel.style.top));
        });

        document.querySelector("#cs-enable-btn").addEventListener("click", () => {
            sortingEnabled = !sortingEnabled;
            localStorage.setItem(ENABLE_KEY, sortingEnabled);
            const btn = document.querySelector("#cs-enable-btn");
            btn.textContent = sortingEnabled ? "Enabled" : "Disabled";
            btn.className = sortingEnabled ? "cs-onoff" : "cs-off";
            if (sortingEnabled) sortPets();
        });

        document.querySelectorAll(".cs-mode-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                mode = btn.dataset.mode;
                localStorage.setItem(MODE_KEY, mode);
                document.querySelectorAll(".cs-mode-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                if (sortingEnabled) sortPets();
            });
        });
    }

    async function sortPets() {
        if (!sortingEnabled) return;
        await new Promise(res => setTimeout(res, 500));
        const pets = Array.from(document.querySelectorAll("dl.pet"));
        if (!pets.length) return;
        const container = pets[0].parentElement;
        const petData = [];
        for (let dl of pets) {
            const img = dl.querySelector("img");
            if (!img) continue;
            if (!img.complete) await new Promise(res => { img.onload = img.onerror = res; });
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            petData.push({ dl, width: w, height: h, area: w * h });
        }
        petData.sort((a, b) => a[mode] - b[mode]);
        for (const p of petData) container.appendChild(p.dl);
    }

    function getPetContainer() {
        const first = document.querySelector("dl.pet");
        return first ? first.parentElement : null;
    }
    function getVisibleCheckboxes() {
        const container = getPetContainer();
        if (!container) return [];
        return Array.from(container.querySelectorAll("dl.pet input[type='checkbox']"));
    }

    /* ================= CTRL MULTI-SELECT ACCUMULATIVE ================= */
    (function enableCtrlSelect() {
        let lastAnchor = null;

        document.addEventListener("click", function(e) {
            if (!e.target.matches('dl.pet input[type="checkbox"]')) return;
            const checkboxes = getVisibleCheckboxes();
            const clicked = e.target;
            const idxClicked = checkboxes.indexOf(clicked);

            if (e.ctrlKey && lastAnchor) {
                e.preventDefault(); // stop default toggle
                e.stopPropagation();
                const idxAnchor = checkboxes.indexOf(lastAnchor);
                if (idxAnchor >= 0 && idxClicked >= 0) {
                    const start = Math.min(idxAnchor, idxClicked);
                    const end = Math.max(idxAnchor, idxClicked);
                    for (let i = start; i <= end; i++) checkboxes[i].checked = true; // include last checkbox
                }
            }
            lastAnchor = clicked; // always update last anchor
        }, true);
    })();

    /* ================= DRAG SELECT ================= */
    (function enableDragSelect() {
        let selecting = false;
        let startX = 0, startY = 0;
        let box = null;

        document.addEventListener("mousedown", function(e) {
            if (e.target.closest(".cs-sort-box")) return;
            if (e.target.closest("dl.pet")) return;
            selecting = true;
            startX = e.pageX;
            startY = e.pageY;
            box = document.createElement("div");
            box.className = "drag-select-box";
            document.body.appendChild(box);
        });

        document.addEventListener("mousemove", function(e) {
            if (!selecting || !box) return;
            const x = Math.min(e.pageX, startX);
            const y = Math.min(e.pageY, startY);
            const w = Math.abs(e.pageX - startX);
            const h = Math.abs(e.pageY - startY);
            box.style.left = x + "px";
            box.style.top = y + "px";
            box.style.width = w + "px";
            box.style.height = h + "px";
        });

        document.addEventListener("mouseup", function() {
            if (!selecting) return;
            selecting = false;
            const rect = box.getBoundingClientRect();
            const checkboxes = getVisibleCheckboxes();
            for (let cb of checkboxes) {
                const dl = cb.closest("dl.pet");
                if (!dl) continue;
                const dlRect = dl.getBoundingClientRect();
                const overlap = !(dlRect.right < rect.left || dlRect.left > rect.right || dlRect.bottom < rect.top || dlRect.top > rect.bottom);
                if (overlap) cb.checked = true;
            }
            box.remove();
            box = null;
        });
    })();

    function init() {
        createTogglePanel();
        if (sortingEnabled) sortPets();
    }
    window.addEventListener("load", init);

})();
