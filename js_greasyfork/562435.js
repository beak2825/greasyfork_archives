// ==UserScript==
// @name         Torn Market Watch
// @namespace    https://www.torn.com/
// @version      1.0
// @description  Multi-item market watcher
// @license      GPL v3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.torn.com
// @connect      weav3r.dev
// @downloadURL https://update.greasyfork.org/scripts/562435/Torn%20Market%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/562435/Torn%20Market%20Watch.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /***********************************
     * STORAGE KEYS
     ***********************************/
    const LS_SETTINGS = "tw_settings_final_v4";
    const LS_NAME_PREFIX = "tw_item_name_";
    const LS_WV_CHECK_PREFIX = "tw_weav_check_";
    const LS_WV_PRICE_PREFIX = "tw_weav_price_";

    /***********************************
     * DEFAULT SETTINGS
     ***********************************/
    const DEFAULTS = {
        apiKey: "",
        defaultSnooze: 15,
        weav3rThrottle: 5,
        snoozeUntil: 0,
        items: [] // { id, limit }
    };

    /***********************************
     * SETTINGS HELPERS
     ***********************************/
    function loadSettings() {
        try {
            const raw = localStorage.getItem(LS_SETTINGS);
            if (!raw) return structuredClone(DEFAULTS);
            const parsed = JSON.parse(raw);
            return { ...DEFAULTS, ...parsed, items: Array.isArray(parsed.items) ? parsed.items : [] };
        } catch {
            return structuredClone(DEFAULTS);
        }
    }

    function saveSettings(s) {
        localStorage.setItem(LS_SETTINGS, JSON.stringify(s));
    }

    function snoozed(s) {
        return Date.now() < s.snoozeUntil;
    }

    function snooze(s, min) {
        const m = Math.max(1, Number(min || s.defaultSnooze));
        s.snoozeUntil = Date.now() + m * 60000;
        saveSettings(s);
        showToast(`Snoozed for ${m} min`);
    }

    /***********************************
     * NAME CACHE
     ***********************************/
    function getName(id) {
        return localStorage.getItem(LS_NAME_PREFIX + id) || "";
    }

    function setName(id, name) {
        if (name && typeof name === "string") {
            localStorage.setItem(LS_NAME_PREFIX + id, name);
        }
    }

    /***********************************
     * UTILITIES
     ***********************************/
    function money(n) {
        return "$" + n.toLocaleString("en-US");
    }

    function showToast(msg) {
        let el = document.getElementById("tw-toast");
        if (!el) {
            el = document.createElement("div");
            el.id = "tw-toast";
            el.className = "tw-toast";
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.style.display = "block";
        setTimeout(() => (el.style.display = "none"), 3000);
    }

    /***********************************
     * CSS
     ***********************************/
    GM_addStyle(`
        .tw-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #111827;
            color: #fff;
            padding: 6px 10px;
            border-radius: 6px;
            border: 1px solid #374151;
            z-index: 999999;
            display: none;
            font-size: 13px;
        }
        /* Settings button */
        .tw-settings-btn {
            position: absolute;
            top: 8px;
            right: 12px;
            background: #2563eb;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 12px;
            z-index: 999999;
        }
        /* Draggable settings panel */
        .tw-panel {
            position: fixed;
            top: 120px;
            right: 120px;
            width: 380px;
            background: #111827;
            color: #fff;
            border: 1px solid #374151;
            border-radius: 10px;
            padding: 12px;
            z-index: 999998;
            display: none;
            box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }
        .tw-panel-header {
            font-weight: bold;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #374151;
            cursor: move;
        }
        .tw-row { display: flex; gap: 8px; margin-bottom: 10px; }
        .tw-input, .tw-num {
            width: 100%;
            padding: 6px 8px;
            border-radius: 6px;
            border: 1px solid #374151;
            background: #1f2937;
            color: #fff;
            font-size: 13px;
        }
        .tw-btn {
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            border: none;
            font-size: 13px;
        }
        .tw-btn-primary { background: #2563eb; color: #fff; }
        .tw-btn-ghost { background: #1f2937; color:#fff; border: 1px solid #374151; }

        /* Item rows */
        .tw-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
            border-bottom: 1px dashed #374151;
        }
        .tw-item-limit {
            width: 90px;
            text-align: right;
        }

        /* Deals dialog (TOP RIGHT) */
        .tw-alert {
            position: fixed;
            top: 70px;
            right: 20px;
            background: #1f2937;
            border: 1px solid #374151;
            border-radius: 10px;
            color: #fff;
            z-index: 999999;
            width: 360px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }
        .tw-alert-head {
            padding: 10px;
            background: #111827;
            display: flex;
            justify-content: space-between;
            font-weight: bold;
        }
        .tw-alert-body {
            padding: 10px;
            font-size: 14px;
        }
        .tw-alert-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            gap: 6px;
        }
        .tw-alert-actions {
            padding: 10px;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }
    `);

    /***********************************
     * NETWORK
     ***********************************/
    function getJSON(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                responseType: "json",
                onload: res => resolve(res.response),
                onerror: reject,
                ontimeout: reject
            });
        });
    }

    function tornURL(id, key) {
        return `https://api.torn.com/v2/market/${id}/itemmarket?limit=1&offset=0&key=${key}`;
    }
    function weavURL(id) {
        return `https://weav3r.dev/api/marketplace/${id}`;
    }
    function itemLink(id) {
        return `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${id}`;
    }

    /***********************************
     * API CHECKS
     ***********************************/
    async function checkTorn(settings, item) {
        if (!settings.apiKey) return null;

        try {
            const data = await getJSON(tornURL(item.id, settings.apiKey));
            const name = data?.itemmarket?.item?.name;
            if (name) setName(item.id, name);

            const price = data?.itemmarket?.listings?.[0]?.price;
            if (typeof price === "number" && price < item.limit) {
                return { id: item.id, name: name || getName(item.id) || "Item", price, src: "Item Market" };
            }
        } catch { }

        return null;
    }

    async function checkWeav(settings, item) {
        const now = Date.now();
        const lastCheck = Number(localStorage.getItem(LS_WV_CHECK_PREFIX + item.id) || 0);
        const throttle = settings.weav3rThrottle * 60000;

        if (now - lastCheck < throttle) {
            const cached = Number(localStorage.getItem(LS_WV_PRICE_PREFIX + item.id) || NaN);
            if (!isNaN(cached) && cached < item.limit) {
                return { id: item.id, name: getName(item.id) || "Item", price: cached, src: "Bazaar" };
            }
            return null;
        }

        try {
            const data = await getJSON(weavURL(item.id));
            localStorage.setItem(LS_WV_CHECK_PREFIX + item.id, now);

            const price = data?.listings?.[0]?.price;
            if (typeof price === "number") {
                localStorage.setItem(LS_WV_PRICE_PREFIX + item.id, price);
                if (price < item.limit) {
                    return { id: item.id, name: getName(item.id) || "Item", price, src: "Bazaar" };
                }
            }
        } catch { }

        return null;
    }

    async function checkItem(settings, item) {
        const [t, w] = await Promise.all([checkTorn(settings, item), checkWeav(settings, item)]);
        if (t && w) return t.price <= w.price ? t : w;
        return t || w;
    }

    /***********************************
     * DEAL ALERT DIALOG
     ***********************************/
    function showDeals(deals, settings) {
        const existing = document.querySelector(".tw-alert");
        if (existing) existing.remove();

        const box = document.createElement("div");
        box.className = "tw-alert";

        let lines = "";
        for (const d of deals) {
            lines += `
                <div class="tw-alert-line">
                    <div>${d.name} — ${money(d.price)} — ${d.src}</div>
                    <button class="tw-btn tw-btn-ghost tw-open" data-id="${d.id}">Open</button>
                </div>
            `;
        }

        box.innerHTML = `
            <div class="tw-alert-head">
                <span>${deals.length === 1 ? "Deal detected" : deals.length + " deals detected"}</span>
                <button class="tw-btn tw-btn-ghost tw-close">✕</button>
            </div>
            <div class="tw-alert-body">${lines}</div>
            <div class="tw-alert-actions">
                <button class="tw-btn tw-btn-primary tw-snooze">Snooze</button>
                <button class="tw-btn tw-btn-ghost tw-close2">Close</button>
            </div>
        `;

        box.querySelector(".tw-close").onclick = () => box.remove();
        box.querySelector(".tw-close2").onclick = () => box.remove();

        [...box.querySelectorAll(".tw-open")].forEach(btn => {
            btn.onclick = () => {
                window.open(itemLink(btn.dataset.id), "_blank", "noopener,noreferrer");
            };
        });

        box.querySelector(".tw-snooze").onclick = () => {
            const mins = prompt("Snooze for how many minutes?", settings.defaultSnooze);
            if (mins && !isNaN(Number(mins))) snooze(settings, Number(mins));
            box.remove();
        };

        document.body.appendChild(box);
    }

    /***********************************
     * SETTINGS PANEL + DRAGGING
     ***********************************/
    function makeDraggable(panel, handle) {
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handle.addEventListener("mousedown", e => {
            dragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            e.preventDefault();
        });

        document.addEventListener("mousemove", e => {
            if (!dragging) return;
            panel.style.left = e.clientX - offsetX + "px";
            panel.style.top = e.clientY - offsetY + "px";
        });

        document.addEventListener("mouseup", () => (dragging = false));
    }

    /***********************************
     * SETTINGS PANEL INJECTION
     ***********************************/
    function injectSettingsPanel(settings) {
        const container = document.querySelector(".content.responsive-sidebar-container.logged-in");
        if (!container) return;

        /* SETTINGS BUTTON */
        const btn = document.createElement("button");
        btn.className = "tw-settings-btn";
        btn.textContent = "Market Watch Settings";
        container.appendChild(btn);

        /* PANEL ELEMENT */
        const panel = document.createElement("div");
        panel.className = "tw-panel";
        panel.innerHTML = `
            <div class="tw-panel-header">Market Watch Settings</div>

            <div class="tw-row">
                <div style="flex:1;">
                    <label>API key</label>
                    <input class="tw-input tw-api" value="${settings.apiKey}">
                </div>
            </div>

            <div class="tw-row">
                <div style="flex:1;">
                    <label>Snooze minutes</label>
                    <input class="tw-num tw-snooze" value="${settings.defaultSnooze}">
                </div>
                <div style="flex:1;">
                    <label>Weav3r throttle</label>
                    <input class="tw-num tw-wv" value="${settings.weav3rThrottle}">
                </div>
            </div>

            <label>Items</label>
            <div class="tw-itemlist"></div>

            <div class="tw-row">
                <input class="tw-num tw-add-id" placeholder="ID">
                <input class="tw-num tw-add-lim" placeholder="Limit">
                <button class="tw-btn tw-btn-ghost tw-add-btn">Add</button>
            </div>

            <div class="tw-row" style="justify-content:flex-end;">
                <button class="tw-btn tw-btn-primary tw-save">Save</button>
                <button class="tw-btn tw-btn-ghost tw-clear">Clear Snooze</button>
                <button class="tw-btn tw-btn-ghost tw-closep">Close</button>
            </div>
        `;

        document.body.appendChild(panel);

        /* DRAG ENABLE */
        makeDraggable(panel, panel.querySelector(".tw-panel-header"));

        /* SHOW/HIDE PANEL */
        btn.onclick = () => {
            panel.style.display = panel.style.display === "block" ? "none" : "block";
        };

        panel.querySelector(".tw-closep").onclick = () => (panel.style.display = "none");

        /* RENDER ITEMS */
        function renderItems() {
            const box = panel.querySelector(".tw-itemlist");
            let html = "";
            for (let i = 0; i < settings.items.length; i++) {
                const it = settings.items[i];
                const nm = getName(it.id) || "Item";
                html += `
                    <div class="tw-item">
                        <div>${nm}</div>
                        <div class="tw-item-limit">${it.limit}</div>
                        <button class="tw-btn tw-btn-ghost tw-rem" data-i="${i}">Remove</button>
                    </div>
                `;
            }
            box.innerHTML = html || "<div style='color:#aaa;'>No items yet.</div>";

            [...box.querySelectorAll(".tw-rem")].forEach(b => {
                b.onclick = () => {
                    const idx = Number(b.dataset.i);
                    settings.items.splice(idx, 1);
                    saveSettings(settings);
                    renderItems();
                };
            });
        }
        renderItems();

        /* ADD ITEM */
        panel.querySelector(".tw-add-btn").onclick = async () => {
            const id = Number(panel.querySelector(".tw-add-id").value);
            const lim = Number(panel.querySelector(".tw-add-lim").value);

            if (!id || !lim) {
                showToast("Enter ID and limit");
                return;
            }

            // Fetch name immediately from Torn API
            try {
                const data = await getJSON(tornURL(id, settings.apiKey));
                const nm = data?.itemmarket?.item?.name;
                if (nm) setName(id, nm);
            } catch { }

            settings.items.push({ id, limit: lim });
            saveSettings(settings);

            panel.querySelector(".tw-add-id").value = "";
            panel.querySelector(".tw-add-lim").value = "";
            renderItems();
        };

        /* SAVE SETTINGS */
        panel.querySelector(".tw-save").onclick = () => {
            settings.apiKey = panel.querySelector(".tw-api").value.trim();
            settings.defaultSnooze = Number(panel.querySelector(".tw-snooze").value);
            settings.weav3rThrottle = Number(panel.querySelector(".tw-wv").value);

            saveSettings(settings);
            showToast("Saved");
        };

        panel.querySelector(".tw-clear").onclick = () => {
            settings.snoozeUntil = 0;
            saveSettings(settings);
            showToast("Snooze cleared");
        };
    }

    /***********************************
     * MAIN EXECUTION
     ***********************************/
    async function main() {
        const settings = loadSettings();

        /* Inject settings panel */
        injectSettingsPanel(settings);

        /* Skip checks during snooze */
        if (snoozed(settings)) return;

        /* No items configured */
        if (!settings.items.length) return;

        const results = [];

        for (const it of settings.items) {
            /* eslint-disable no-await-in-loop */
            const r = await checkItem(settings, it);
            /* eslint-enable no-await-in-loop */
            if (r) results.push(r);
        }

        if (results.length) showDeals(results, settings);
    }

    main();
})();
