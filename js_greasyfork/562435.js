// ==UserScript==
// @name         Torn Market Watch
// @namespace    https://www.torn.com/
// @version      1.0.1
// @description  Multi-item market watcher
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.torn.com
// @connect      weav3r.dev
// @icon         https://i.ibb.co/5WP9JNYn/item-market-icon.png
// @license      GNU GPLv3
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

    /** Is the current page the ItemMarket page? */
    function onItemMarketPage() {
        const href = location.href;
        return href.includes("/page.php?sid=ItemMarket");
    }

    /*** k/m/b formatting + parsing ***/
    function formatShort(n) {
        if (!Number.isFinite(n)) return "";
        const abs = Math.abs(n);
        const sign = n < 0 ? "-" : "";
        let value, suffix;
        if (abs >= 1_000_000_000) { value = abs / 1_000_000_000; suffix = "b"; }
        else if (abs >= 1_000_000) { value = abs / 1_000_000; suffix = "m"; }
        else if (abs >= 1_000) { value = abs / 1_000; suffix = "k"; }
        else {
            // For small numbers, show with thousand separators
            return sign + abs.toLocaleString("en-US");
        }
        // Keep up to 2 decimals, trim trailing .0s
        let str = (value >= 100)
            ? Math.round(value).toString()
            : (value >= 10 ? (Math.round(value * 10) / 10).toString()
            : (Math.round(value * 100) / 100).toString());
        str = str.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
        return sign + str + suffix;
    }
    function parseShort(str) {
        if (typeof str !== "string") return NaN;
        let s = str.replace(/,/g, "").trim().toLowerCase();
        if (!s) return NaN;
        const m = s.match(/^(-?\d+(?:\.\d+)?)([kmb])?$/);
        if (!m) {
            // If it's a plain number (possibly scientific), try Number()
            const num = Number(s);
            return Number.isFinite(num) ? num : NaN;
        }
        const num = parseFloat(m[1]);
        const suf = m[2];
        const mult = suf === "b" ? 1_000_000_000 : suf === "m" ? 1_000_000 : suf === "k" ? 1_000 : 1;
        // Use integer cents to avoid float errors then round back
        return Math.round(num * mult);
    }
    /** Attach live k/m/b formatting to an <input> (limit input) */
    function attachLiveShortFormatting(input) {
        // Keep the last parsed numeric value in data-value for reliable reads
        const setValue = (n) => {
            if (!Number.isFinite(n)) return;
            input.dataset.value = String(n);
            input.value = formatShort(n);
            input.title = n.toLocaleString("en-US"); // tooltip shows full comma-separated
        };
        // Initialize if it has a value
        if (input.value) {
            const n0 = parseShort(input.value);
            if (Number.isFinite(n0)) setValue(n0);
        }
        input.addEventListener("input", (e) => {
            const val = input.value;
            const n = parseShort(val);
            if (Number.isFinite(n)) {
                // Live reformat
                setValue(n);
                // Place cursor at end (simple approach for mobile/desktop)
                if (input.setSelectionRange) {
                    const len = input.value.length;
                    input.setSelectionRange(len, len);
                }
            } else {
                // Keep user's typing if not parseable yet
                input.removeAttribute("data-value");
                input.title = "";
            }
        });
        input.addEventListener("blur", () => {
            const n = parseShort(input.value);
            if (Number.isFinite(n)) setValue(n);
        });
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
            touch-action: none;
        }
        .tw-row { display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
        .tw-row > div { flex: 1 1 160px; min-width: 160px; }
        .tw-input, .tw-num {
            width: 100%;
            padding: 6px 8px;
            border-radius: 6px;
            border: 1px solid #374151;
            background: #1f2937;
            color: #fff;
            font-size: 13px;
            box-sizing: border-box;
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
            gap: 8px;
        }
        .tw-item > div:first-child {
            flex: 1 1 auto;
        }
        .tw-item-limit {
            width: 120px;
            text-align: right;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        /* Dialog window */
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
            max-width: 95vw;
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
        .tw-error-code {
            font-family: monospace;
            background: #0b1220;
            border: 1px solid #253056;
            padding: 2px 6px;
            border-radius: 4px;
        }
        @media (max-width: 480px) {
            .tw-panel { left: 2.5vw; right: auto; }
        }
    `);

    /***********************************
     * ERROR CODES + DIALOG
     ***********************************/
    const TORN_API_ERROR_MAP = {
        0:  "Unknown error : Unhandled error, should not occur.",
        1:  "Key is empty : Private key is empty in current request.",
        2:  "Incorrect Key : Private key is wrong/incorrect format.",
        3:  "Wrong type : Requesting an incorrect basic type.",
        4:  "Wrong fields : Requesting incorrect selection fields.",
        5:  "Too many requests : Requests are blocked for a small period of time because of too many requests per user (max 100 per minute).",
        6:  "Incorrect ID : Wrong ID value.",
        7:  "Incorrect ID-entity relation : A requested selection is private (e.g., personal data of another user/faction).",
        8:  "IP block : Current IP is banned for a small period of time because of abuse.",
        9:  "API disabled : Api system is currently disabled.",
        10: "Key owner is in federal jail : Current key can't be used because owner is in federal jail.",
        11: "Key change error : You can only change your API key once every 60 seconds.",
        12: "Key read error : Error reading key from Database.",
        13: "The key is temporarily disabled due to owner inactivity : The key owner hasn't been online for more than 7 days.",
        14: "Daily read limit reached : Too many records have been pulled today by this user from our cloud services.",
        15: "Temporary error : Testing-only code without dedicated meaning.",
        16: "Access level of this key is not high enough : Selection requires higher permission level.",
        17: "Backend error occurred, please try again.",
        18: "API key has been paused by the owner.",
        19: "Must be migrated to crimes 2.0.",
        20: "Race not yet finished.",
        21: "Incorrect category : Wrong cat value.",
        22: "This selection is only available in API v1.",
        23: "This selection is only available in API v2.",
        24: "Closed temporarily."
    };

    function showErrorDialog(title, details, actions = []) {
        const existing = document.querySelector(".tw-alert.tw-error");
        if (existing) existing.remove();

        const box = document.createElement("div");
        box.className = "tw-alert tw-error";

        let actionsHtml = "";
        for (const a of actions) {
            actionsHtml += `<button class="tw-btn ${a.primary ? "tw-btn-primary" : "tw-btn-ghost"} tw-act" data-key="${a.key || ""}">${a.label}</button>`;
        }
        if (!actionsHtml) {
            actionsHtml = `<button class="tw-btn tw-btn-ghost tw-close">Close</button>`;
        }

        box.innerHTML = `
            <div class="tw-alert-head">
                <span>${title}</span>
                <button class="tw-btn tw-btn-ghost tw-close">✕</button>
            </div>
            <div class="tw-alert-body">
                ${details}
            </div>
            <div class="tw-alert-actions">
                ${actionsHtml}
            </div>
        `;

        box.querySelector(".tw-close").onclick = () => box.remove();
        [...box.querySelectorAll(".tw-act")].forEach(btn => {
            btn.onclick = () => {
                const key = btn.dataset.key;
                if (key === "open-settings") {
                    const panel = document.querySelector(".tw-panel");
                    if (panel) panel.style.display = "block";
                }
                box.remove();
            };
        });

        document.body.appendChild(box);
    }

    function explainTornError(code, message) {
        const mapped = TORN_API_ERROR_MAP[code];
        const text = mapped ? mapped : (message || "Unknown Torn API error.");
        return `
            <div style="display:flex;flex-direction:column;gap:8px;">
                <div><strong>Torn API Error</strong></div>
                <div>Code: <span class="tw-error-code">${String(code)}</span></div>
                <div>${text}</div>
            </div>
        `;
    }

    function explainNetworkError(source, err) {
        return `
            <div style="display:flex;flex-direction:column;gap:8px;">
                <div><strong>${source} request failed</strong></div>
                <div>${(err && err.message) ? err.message : "A network or CORS error occurred."}</div>
            </div>
        `;
    }

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
                onerror: err => reject(err),
                ontimeout: err => reject(err)
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

            // If Torn API returns an error object, surface it
            if (data && data.error && typeof data.error.code === "number") {
                const code = data.error.code;
                const details = explainTornError(code, data.error.error || data.error.message);
                showErrorDialog(
                    "API Error (Torn)",
                    details,
                    [
                        { label: "Open Settings", primary: true, key: "open-settings" },
                        { label: "Close", primary: false }
                    ]
                );
                return null;
            }

            const name = data?.itemmarket?.item?.name;
            if (name) setName(item.id, name);

            const price = data?.itemmarket?.listings?.[0]?.price;
            if (typeof price === "number" && price < item.limit) {
                return { id: item.id, name: name || getName(item.id) || "Item", price, src: "Item Market" };
            }
        } catch (err) {
            const details = explainNetworkError("Torn API", err);
            showErrorDialog("Network Error (Torn)", details, [{ label: "Close", primary: false }]);
        }
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
            localStorage.setItem(LS_WV_CHECK_PREFIX + item.id, String(now));

            const price = data?.listings?.[0]?.price;
            if (typeof price === "number") {
                localStorage.setItem(LS_WV_PRICE_PREFIX + item.id, String(price));
                if (price < item.limit) {
                    return { id: item.id, name: getName(item.id) || "Item", price, src: "Bazaar" };
                }
            }
        } catch (err) {
            const details = explainNetworkError("Bazaar (weav3r.dev)", err);
            showErrorDialog("Network Error (Bazaar)", details, [{ label: "Close", primary: false }]);
        }
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
        const existing = document.querySelector(".tw-alert.tw-deals");
        if (existing) existing.remove();

        const box = document.createElement("div");
        box.className = "tw-alert tw-deals";

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

        // Mouse support
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

        // Touch support
        handle.addEventListener("touchstart", e => {
            const t = e.touches[0];
            dragging = true;
            offsetX = t.clientX - panel.offsetLeft;
            offsetY = t.clientY - panel.offsetTop;
            e.preventDefault();
        }, { passive: false });
        document.addEventListener("touchmove", e => {
            if (!dragging) return;
            const t = e.touches[0];
            panel.style.left = t.clientX - offsetX + "px";
            panel.style.top = t.clientY - offsetY + "px";
            e.preventDefault();
        }, { passive: false });
        document.addEventListener("touchend", () => (dragging = false));
    }

    /***********************************
     * SETTINGS PANEL INJECTION
     ***********************************/
    function injectSettingsPanel(settings) {
        if (!onItemMarketPage()) return;

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
                <input class="tw-num tw-add-id" placeholder="Item ID">
                <input class="tw-num tw-add-lim" placeholder="Limit (e.g., 400k, 12.5m, 1b)">
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

        /* LIVE k/m/b formatting on Limit input */
        attachLiveShortFormatting(panel.querySelector(".tw-add-lim"));

        /* RENDER ITEMS */
        function renderItems() {
            const box = panel.querySelector(".tw-itemlist");
            let html = "";
            for (let i = 0; i < settings.items.length; i++) {
                const it = settings.items[i];
                const nm = getName(it.id) || "Item";
                const formatted = formatShort(it.limit);
                const full = Number(it.limit).toLocaleString("en-US");
                html += `
                    <div class="tw-item">
                        <div>${nm}</div>
                        <div class="tw-item-limit" title="${full}">${formatted}</div>
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
            const limInput = panel.querySelector(".tw-add-lim");
            const limParsed = limInput.dataset.value ? Number(limInput.dataset.value) : parseShort(limInput.value);

            if (!id || !Number.isFinite(limParsed) || limParsed <= 0) {
                showToast("Enter a valid ID and limit (use k/m/b e.g., 400k, 12.5m)");
                return;
            }

            // Fetch name immediately from Torn API
            try {
                const data = await getJSON(tornURL(id, settings.apiKey));
                if (data && data.error && typeof data.error.code === "number") {
                    const details = explainTornError(data.error.code, data.error.error || data.error.message);
                    showErrorDialog("API Error (Torn)", details, [{ label: "Close", primary: false }]);
                } else {
                    const nm = data?.itemmarket?.item?.name;
                    if (nm) setName(id, nm);
                }
            } catch (err) {
                const details = explainNetworkError("Torn API", err);
                showErrorDialog("Network Error (Torn)", details, [{ label: "Close", primary: false }]);
            }
            settings.items.push({ id, limit: limParsed });
            saveSettings(settings);

            panel.querySelector(".tw-add-id").value = "";
            limInput.value = "";
            limInput.removeAttribute("data-value");
            limInput.title = "";
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

    /* Initial run */
    main();

    window.addEventListener("hashchange", () => {
        if (onItemMarketPage()) {
            if (!document.querySelector(".tw-settings-btn")) {
                injectSettingsPanel(loadSettings());
            }
        } else {
            // Optional clean-up when leaving ItemMarket (prevents stale UI)
            document.querySelector(".tw-panel")?.remove();
            document.querySelector(".tw-settings-btn")?.remove();
        }
    });
})();
