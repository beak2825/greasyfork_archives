// ==UserScript==
// @name         Torn Stock Vault (API) v4.1
// @namespace    TheALFA.torn.stocks
// @version      4.1
// @description  Secure stock vault using the Torn API. Mobile optimized.
// @author       TheALFA [2869953]
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561390/Torn%20Stock%20Vault%20%28API%29%20v41.user.js
// @updateURL https://update.greasyfork.org/scripts/561390/Torn%20Stock%20Vault%20%28API%29%20v41.meta.js
// ==/UserScript==

// --- CONFIGURATION ---
const DEFAULT_PRESETS = ["50k", "250k", "1m", "5m", "10m", "25m"];

const STOCK_DATA = {
    "ASS": { base: 1_000_000, type: "A" }, "BAG": { base: 3_000_000, type: "A" },
    "CNC": { base: 7_500_000, type: "A" }, "EWM": { base: 1_000_000, type: "A" },
    "ELT": { base: 5_000_000, type: "P" }, "EVL": { base: 100_000,   type: "A" },
    "FHG": { base: 2_000_000, type: "A" }, "GRN": { base: 500_000,   type: "A" },
    "CBD": { base: 350_000,   type: "A" }, "HRG": { base: 10_000_000,type: "A" },
    "IIL": { base: 1_000_000, type: "P" }, "IOU": { base: 3_000_000, type: "A" },
    "IST": { base: 100_000,   type: "P" }, "LAG": { base: 750_000,   type: "A" },
    "LOS": { base: 7_500_000, type: "P" }, "LSC": { base: 500_000,   type: "A" },
    "MCS": { base: 350_000,   type: "A" }, "MSG": { base: 300_000,   type: "P" },
    "MUN": { base: 5_000_000, type: "A" }, "PRN": { base: 1_000_000, type: "A" },
    "PTS": { base: 10_000_000,type: "A" }, "SYM": { base: 500_000,   type: "A" },
    "SYS": { base: 3_000_000, type: "P" }, "TCP": { base: 1_000_000, type: "P" },
    "TMI": { base: 6_000_000, type: "A" }, "TGP": { base: 2_500_000, type: "P" },
    "TCT": { base: 100_000,   type: "A" }, "TSB": { base: 3_000_000, type: "A" },
    "TCC": { base: 7_500_000, type: "A" }, "THS": { base: 150_000,   type: "A" },
    "TCI": { base: 1_500_000, type: "P" }, "TCM": { base: 1_000_000, type: "P" },
    "WSU": { base: 1_000_000, type: "P" }, "WLT": { base: 9_000_000, type: "P" },
    "YAZ": { base: 1_000_000, type: "P" }
};

// --- ADVISOR CONSTANTS ---

// Items needed for pricing (ID: Name)
const ADVISOR_ITEMS = {
    364: "Box of Grenades",
    365: "Box of Medical Supplies",
    366: "Erotic DVD",
    367: "Feathery Hotel Coupon",
    368: "Lawyer's Business Card",
    369: "Lottery Voucher",
    370: "Drug Pack",
    817: "Six-Pack of Alcohol",
    818: "Six-Pack of Energy Drink",
    // TCC Cache Pool
    1057: "Gentleman's Cache",
    1112: "Elegant Cache",
    1113: "Naughty Cache",
    1114: "Elderly Cache",
    1115: "Denim Cache",
    1116: "Wannabe Cache",
    1117: "Cutesy Cache"
};

// IDs used for TCC Average Calculation
const TCC_CACHE_IDS = [1057, 1112, 1113, 1114, 1115, 1116, 1117];

// Detailed Benefit Mapping
// type: "item", "cash", "passive", "average"
// freq: Days to receive reward
// id: Item ID (if type is item)
const ADVISOR_DATA = {
    "MUN": { type: "item", id: 818, freq: 7 },
    "ASS": { type: "item", id: 817, freq: 7 },
    "HRG": { type: "manual", label: "Avg Property Value", freq: 31 }, // Manual Input
    "LSC": { type: "item", id: 369, freq: 7 },
    "LAG": { type: "item", id: 368, freq: 7 },
    "FHG": { type: "item", id: 367, freq: 7 },
    "PRN": { type: "item", id: 366, freq: 7 },
    "SYM": { type: "item", id: 370, freq: 7 },
    "TCC": { type: "average", ids: TCC_CACHE_IDS, freq: 31 }, // Special Average Logic
    "THS": { type: "item", id: 365, freq: 7 },
    "EWM": { type: "item", id: 364, freq: 7 },
    "BAG": { type: "passive" }, // Excluded from ROI
    "CNC": { type: "cash", val: 80_000_000, freq: 31 },
    "TSB": { type: "cash", val: 50_000_000, freq: 31 },
    "TMI": { type: "cash", val: 25_000_000, freq: 31 },
    "IOU": { type: "cash", val: 12_000_000, freq: 31 },
    "GRN": { type: "cash", val: 4_000_000, freq: 31 },
    "TCT": { type: "cash", val: 1_000_000, freq: 31 }
};

let lastSync = 0; // Tracks the last time we auto-synced

// Storage for prices
let itemPrices = {};
try {
    itemPrices = JSON.parse(localStorage.getItem("alfa_advisor_prices")) || {};
} catch(e) { itemPrices = {}; }

// Storage for Networth Logic
let networthSettings = {
    sources: { inventory: false, points: true, stocks: true },
    excludedStocks: [],
    excludeMode: "all" // New Option: "all" or "active"
};
try {
    let savedNW = JSON.parse(localStorage.getItem("alfa_advisor_networth"));
    if(savedNW) {
        networthSettings = savedNW;
        // Ensure new property exists if loading old save
        if(!networthSettings.excludeMode) networthSettings.excludeMode = "all";
    }
} catch(e) {}

// Base Bank Rates (Torn Defaults)
const BANK_BASE_RATES = {
    "1w": 0.7917, "2w": 1.7833, "1m": 4.3, "2m": 9.8, "3m": 16.5
    // Note: These are rough base % approximations before perks
};


// Storage for Bank Settings
let bankSettings = {
    roi_1w: 0, roi_2w: 0, roi_1m: 0, roi_2m: 0, roi_3m: 0,
    active_period: "2w" // Default comparison
};
try {
    let savedBank = JSON.parse(localStorage.getItem("alfa_advisor_bank"));
    if(savedBank) bankSettings = savedBank;
} catch(e) {}

let stocks = {};
let stockId = {};
let stockRows = {};
// NEW: Local cache to track shares between page loads
let localShareCache = {};

// --- UTILITIES ---

function createModal(title, contentHtml) {
    // Remove existing
    $("#alfa-modal-overlay").remove();

    let modal = `
    <div id="alfa-modal-overlay" class="alfa-modal-overlay">
        <div class="alfa-modal">
            <div class="alfa-modal-header">
                <h3>${title}</h3>
                <span id="alfa-modal-close" class="alfa-modal-close">&times;</span>
            </div>
            <div class="alfa-modal-body">
                ${contentHtml}
            </div>
        </div>
    </div>`;

    $("body").append(modal);
    $("#alfa-modal-close").on("click", function() { $("#alfa-modal-overlay").remove(); });

    // Close on click outside
    $("#alfa-modal-overlay").on("click", function(e) {
        if(e.target.id === "alfa-modal-overlay") $("#alfa-modal-overlay").remove();
    });
}

function parseTornNumber(val) {
    if (typeof val !== "string") return 0;
    val = val.trim().toLowerCase();
    if (!val) return 0;
    if (val.endsWith("k")) return parseFloat(val.replace("k", "")) * 1_000;
    if (val.endsWith("m")) return parseFloat(val.replace("m", "")) * 1_000_000;
    if (val.endsWith("b")) return parseFloat(val.replace("b", "")) * 1_000_000_000;
    return parseFloat(val.replace(/,/g, ""));
}

function formatMoney(amount) { return "$" + amount.toLocaleString('en-US'); }

function getRFC() {
    var rfc = $.cookie("rfc_v");
    if (!rfc) {
        var cookies = document.cookie.split("; ");
        for (var i in cookies) {
            var cookie = cookies[i].split("=");
            if (cookie[0] == "rfc_v") return cookie[1];
        }
    }
    return rfc;
}

function getBenefitTier(sym, shares) {
    let data = STOCK_DATA[sym];
    if (!data) return { tier: 0, next: 0, label: "Unknown" };
    if (data.type === "P") {
        if (shares >= data.base) return { tier: 1, next: data.base, label: "Passive Active" };
        return { tier: 0, next: data.base, label: "None" };
    } else {
        if (shares < data.base) return { tier: 0, next: data.base, label: "None" };
        let multiplier = 1;
        while (shares >= data.base * (multiplier * 2)) { multiplier *= 2; }
        return { tier: multiplier, next: data.base * multiplier * 2, label: multiplier + "x Reward" };
    }
}

async function getMoneyFromAPI() {
    let key = localStorage.getItem("alfa_vault_apikey");
    if (!key || key.length < 16) { alert("Please enter a valid API Key first!"); throw new Error("No API Key"); }
    $("#responseStock").html("Checking Wallet (API)...").css("color", "orange");
    try {
        const response = await fetch(`https://api.torn.com/user/?selections=money&key=${key}&ts=${Date.now()}`);
        const data = await response.json();
        if (data.error) { $("#responseStock").html("API Error: " + data.error.error).css("color", "red"); throw new Error(data.error.error); }
        return data.money_onhand;
    } catch (e) { console.error(e); $("#responseStock").html("API Failed Check Log").css("color", "red"); return 0; }
}

// 1. Force API Sync (Updates DOM & Returns Money)
async function syncWallet(silent = false) {
    let key = localStorage.getItem("alfa_vault_apikey");
    if (!key) return 0;

    // Throttle: Don't sync more than once every 2 seconds to prevent spam
    if (Date.now() - lastSync < 2000) return 0;
    lastSync = Date.now();

    if (!silent) $("#responseStock").html("Syncing...").css("color", "orange");

    try {
        // Timestamp (&ts) prevents caching so you get fresh RR winnings
        const response = await fetch(`https://api.torn.com/user/?selections=money&key=${key}&ts=${Date.now()}`);
        const data = await response.json();

        if (data.money_onhand !== undefined) {
            let money = data.money_onhand;
            let formatted = "$" + money.toLocaleString();

            // Update UI (Sidebar & Mobile)
            if ($("#user-money").length > 0) $("#user-money").attr("data-money", money).text(formatted);
            let mobileMoney = $("[class^='money-value_']");
            if (mobileMoney.length > 0) mobileMoney.text(formatted);

            if (!silent) $("#responseStock").html(`Synced: ${formatted}`).css("color", "green");
            return money;
        }
    } catch (e) {
        if (!silent) $("#responseStock").html("Sync Failed").css("color", "red");
    }
    return 0;
}

// 2. Read Money from Screen (Instant)
function getMoneyFast() {
    let dataMoney = $("#user-money").attr("data-money");
    if (dataMoney) return parseFloat(dataMoney);
    let textMoney = $("#user-money").text();
    if (textMoney) return parseTornNumber(textMoney);
    return 0;
}

// --- INITIALIZATION ---
function insert() {
    // 1. Load Settings
    let current = localStorage.alfa_vault_target;
    let savedKeep = localStorage.getItem("alfa_vault_keepVal") || "";
    let savedSell = localStorage.getItem("alfa_vault_sellVal") || "";
    let savedKey = localStorage.getItem("alfa_vault_apikey") || "";
    let instantOn = localStorage.getItem("alfa_vault_instant") === "true";
    let lockOn = localStorage.getItem("alfa_vault_lock") === "true";
    let useApiOn = localStorage.getItem("alfa_vault_use_api") === "true";

    // 2. Wait for Stock List
    if ($("ul[class^='stock_']").length == 0) { setTimeout(insert, 500); return; }

    let symbols = [];
    $("ul[class^='stock_']").each(function() {
        let sym = $("img", $(this)).attr("src").split("logos/")[1].split(".svg")[0];
        symbols.push(sym);
        stockId[sym] = $(this).attr("id");
        stocks[sym] = $("div[class^='price_']", $(this));
        stockRows[sym] = $(this);
    });
    symbols.sort();

    // 3. Build New Layout
    let container = `
    <div class="alfa-container">
        <div class="alfa-header">
            <input type="password" id="alfa-apikey" class="alfa-input" style="flex-grow:1; text-align:center; letter-spacing:2px;" placeholder="Paste API Key Here" value="${savedKey}">
            <span id="alfa-advisor-btn" class="alfa-advisor-btn">★ Advisor</span>
        </div>

        <div class="alfa-row">
            <label class="alfa-label">Target:</label>
            <select id="stockid" class="alfa-select"><option value="">Select Stock...</option>`;

    for (let sy of symbols) {
        let selected = (current && current == sy) ? "selected='selected'" : "";
        container += `<option value="${sy}" ${selected}>${sy}</option>`;
    }

    container += `</select>
            <span id="alfa-owned-display" style="margin-left:10px; font-size:11px; color:#888;">Owned: -</span>
        </div>

        <div class="alfa-divider"></div>

        <div class="alfa-row">
            <button id="vaultall" class="alfa-main-btn">Vault Max</button>

            <label class="alfa-small-label" title="Fetch fresh data from API before vaulting (Slower but safer)">
                <input type="checkbox" id="alfa-use-api" ${useApiOn ? "checked" : ""}> API Mode
            </label>

            <div class="alfa-group" style="margin-left: auto;">
                <input type="text" placeholder="Keep Amt" id="keepval" class="alfa-input" style="width:100px;" value="${savedKeep}">
                <button id="vaultexcept" class="alfa-main-btn">Vault (Keep)</button>
            </div>
        </div>

        <div class="alfa-row">
            <div class="alfa-group">
                <input type="text" placeholder="Withdraw Amt" id="sellval" class="alfa-input" value="${savedSell}">
                <button id="sellamt" class="alfa-main-btn">Withdraw</button>
            </div>

            <div style="display: flex; align-items: center; margin-left: auto;">
                <button id="sellall-init" class="alfa-main-btn" style="color:#aaa; border-color:#444;">Withdraw All</button>
                <div id="sellall-confirm" style="display:none; gap:5px;">
                    <span style="font-size:10px; color:#888; margin-right:5px;">Sure?</span>
                    <button id="sellall-yes" class="alfa-main-btn" style="color:#8bc34a; border-color:#8bc34a; padding:0 12px;">Yes</button>
                    <button id="sellall-no" class="alfa-main-btn" style="color:#ef5350; border-color:#ef5350; padding:0 12px;">No</button>
                </div>
            </div>
        </div>

        <div class="alfa-toolbar">
            <div style="display:flex; gap:15px;">
                <label class="alfa-small-label" title="Skip API check for withdrawals (Fastest)">
                    <input type="checkbox" id="alfa-instant-toggle" ${instantOn ? "checked" : ""}> Instant Withdraw
                </label>
                <label class="alfa-small-label" title="Prevent selling shares required for passive bonuses">
                    <input type="checkbox" id="alfa-lock-toggle" ${lockOn ? "checked" : ""}> Lock Benefits
                </label>
            </div>
            <span id="alfa-edit-trigger" class="alfa-link" style="font-size:11px;">Edit Buttons</span>
        </div>

        <div id="alfa-preset-row" class="alfa-preset-row"></div>

        <div class="alfa-row" style="margin-top:10px;"><span id="responseStock"></span></div>
    </div>`;

    // 4. Inject & Attach Listeners
    $("#stockmarketroot").prepend(container);

    $("#alfa-advisor-btn").on("click", openAdvisorMain);
    $("#stockid").change(updateStock);
    $("#vaultall").on("click", vault);
    $("#vaultexcept").on("click", vaultExcept);
    $("#sellamt").on("click", () => withdraw());

    // Checkbox Listeners
    $("#alfa-apikey").on("keyup change", function() { localStorage.setItem("alfa_vault_apikey", $(this).val().trim()); });
    $("#alfa-instant-toggle").on("change", function() { localStorage.setItem("alfa_vault_instant", $(this).is(":checked")); });
    $("#alfa-lock-toggle").on("change", function() { localStorage.setItem("alfa_vault_lock", $(this).is(":checked")); });
    $("#alfa-use-api").on("change", function() { localStorage.setItem("alfa_vault_use_api", $(this).is(":checked")); });

    $("#sellval").on("keyup", function() { handleInputUpdate(this, "alfa_vault_sellVal"); });
    $("#keepval").on("keyup", function() { handleInputUpdate(this, "alfa_vault_keepVal"); });
    $("#alfa-edit-trigger").on("click", renderEditMode);

    // Withdraw All Logic
    $("#sellall-init").on("click", function() { $(this).hide(); $("#sellall-confirm").css("display", "flex"); });
    $("#sellall-no").on("click", function() { $("#sellall-confirm").hide(); $("#sellall-init").show(); });
    $("#sellall-yes").on("click", function() { withdrawAll(); $("#sellall-confirm").hide(); $("#sellall-init").show(); });

    renderPresets();
    updateStock();
}

function getSavedPresets() { let saved = localStorage.getItem("alfa_vault_presets"); return saved ? JSON.parse(saved) : DEFAULT_PRESETS; }
function renderPresets() {
    let presets = getSavedPresets();
    let html = ``;
    presets.forEach(preset => { html += `<button class="torn-btn alfa-preset-btn" data-amt="${preset}">${preset}</button>`; });
    $("#alfa-preset-row").html(html);
    $("#alfa-edit-trigger").show();
    $(".alfa-preset-btn").on("click", function(e) {
        e.preventDefault();
        let raw = $(this).attr("data-amt");
        let val = parseTornNumber(raw);
        $("#sellval").val(val).attr("value", val);
        localStorage.setItem("alfa_vault_sellVal", val);
        if ($("#alfa-instant-toggle").is(":checked")) { withdraw(); }
    });
}
function renderEditMode() {
    $("#alfa-edit-trigger").hide();
    let presets = getSavedPresets();
    let valString = presets.join(", ");
    let html = `
        <div class="alfa-edit-ui">
            <input type="text" id="alfa-preset-input" class="alfa-input alfa-long-input" value="${valString}">
            <div class="alfa-edit-actions">
                <button id="alfa-save-presets" class="alfa-action-btn alfa-save">Save</button>
                <button id="alfa-cancel-presets" class="alfa-action-btn alfa-cancel">Cancel</button>
            </div>
        </div>`;
    $("#alfa-preset-row").html(html);
    $("#alfa-save-presets").on("click", function() {
        let raw = $("#alfa-preset-input").val();
        let newPresets = raw.split(",").map(s => s.trim()).filter(s => s.length > 0);
        localStorage.setItem("alfa_vault_presets", JSON.stringify(newPresets));
        renderPresets();
    });
    $("#alfa-cancel-presets").on("click", renderPresets);
}

// --- OWNED SHARES LOGIC (CACHED) ---
function getOwnedShares(id) {
    // 1. Check if we have a manually updated value for this session
    if (localShareCache[id] !== undefined) {
        return localShareCache[id];
    }

    // 2. Otherwise read from DOM
    let row = stockRows[id];
    if (!row) return 0;

    // Mobile Method
    let mobileEl = row.find("p[class^='count']");
    if(mobileEl.length > 0) {
        let text = mobileEl.text().trim();
        let num = parseFloat(text.replace(/,/g, ''));
        if(!isNaN(num)) return num;
    }
    // Desktop Method
    let cols = row.children("div");
    if(cols.length >= 5) {
        let text = $(cols[4]).text().trim();
        let num = parseFloat(text.replace(/,/g, ''));
        if(!isNaN(num)) return num;
    }
    return 0;
}

function updateStock() {
    let symb = $("#stockid").val();
    localStorage.alfa_vault_target = symb;
    if(symb) {
        let owned = getOwnedShares(symb);
        let displayHtml = `Owned: <strong style="color:#fff">${owned.toLocaleString()}</strong>`;
        $("#alfa-owned-display").html(displayHtml);

        if(owned === 0) $("#alfa-owned-display").css("color", "#666");
        else $("#alfa-owned-display").css("color", "#609b9b");
    } else {
        $("#alfa-owned-display").text("Owned: -");
    }
}

function updateLocalCache(sym, changeAmount) {
    let current = getOwnedShares(sym);
    let newVal = current + changeAmount;
    if (newVal < 0) newVal = 0;

    // Save to local cache so next check uses this number
    localShareCache[sym] = newVal;

    // Update visual display
    updateStock();
}

function getPrice(id) { if (!stocks[id]) return 0; return parseFloat($(stocks[id]).text().replace(/,/g, '')); }
function handleInputUpdate(el, storageKey) {
    let raw = $(el).val();
    let valToSave = raw;
    if (raw.endsWith("k") || raw.endsWith("m") || raw.endsWith("b")) {
        let num = parseTornNumber(raw);
        if(!isNaN(num)) { $(el).val(num).attr("value", num); valToSave = num; }
    } else { $(el).attr("value", raw); }
    localStorage.setItem(storageKey, valToSave);
}

function openAdvisorMain() {
    let html = `
    <div class="alfa-dashboard">
        <div class="alfa-hero">
            <div class="alfa-hero-label">Current Daily Income</div>
            <div id="adv-daily-income" class="alfa-hero-val">--</div>
            <div id="adv-daily-detail" class="alfa-hero-sub">Calculating...</div>
        </div>

        <div class="alfa-grid-section">
            <div class="alfa-card">
                <div class="alfa-card-head">
                    <span class="alfa-card-title">Target (Best ROI)</span>
                    <span id="adv-next-roi" class="alfa-card-roi">--%</span>
                </div>
                <div class="alfa-card-body">
                    <div id="adv-next-name" class="alfa-stock-name">--</div>
                    <div id="adv-next-cost" class="alfa-stock-cost">Cost: --</div>
                    <div id="adv-next-gain" class="alfa-stock-gain">Gain: --</div>
                </div>
            </div>

            <div class="alfa-card" style="border-color: #609b9b;">
                <div class="alfa-card-head">
                    <span class="alfa-card-title" style="color:#609b9b;">Best Affordable</span>
                    <span id="adv-afford-roi" class="alfa-card-roi">--%</span>
                </div>
                <div class="alfa-card-body">
                    <div id="adv-afford-name" class="alfa-stock-name">--</div>
                    <div id="adv-afford-cost" class="alfa-stock-cost">Cost: --</div>
                    <div id="adv-afford-gain" class="alfa-stock-gain">Gain: --</div>
                </div>
            </div>
        </div>

        <div class="alfa-actions">
            <button id="adv-btn-items" class="alfa-btn-main">Set Item Values</button>
            <button id="adv-btn-networth" class="alfa-btn-main">Networth Settings</button>
        </div>

        <div id="adv-debug-log" style="text-align:center; font-size:15px; color:#609b9b; margin-top:-10px;"></div>
        <div id="adv-debug-num" style="text-align:center; font-size:15px; color:#ffffff; margin-top:-10px;"></div>
    </div>`;

    createModal("Financial Advisor", html);

    $("#adv-btn-items").on("click", openItemSettings);
    $("#adv-btn-networth").on("click", openNetworthSettings);

    runAdvisorLogic();
}

function openItemSettings() {
    let rows = "";

    // Points
    let ptVal = itemPrices["points"] || 0;
    rows += `<tr>
        <td style="color:#8bc34a; font-weight:bold;">Points (Market)</td>
        <td><input type="text" class="alfa-tbl-input" id="item-input-points" value="${ptVal.toLocaleString()}"></td>
    </tr>`;

    // HRG
    let hrgVal = itemPrices["HRG_AVG"] || 0;
    rows += `<tr>
        <td style="color:#609b9b">HRG: Avg Property</td>
        <td><input type="text" class="alfa-tbl-input" id="item-input-HRG_AVG" value="${hrgVal.toLocaleString()}"></td>
    </tr>`;

    // Items
    for (let [id, name] of Object.entries(ADVISOR_ITEMS)) {
        let val = itemPrices[id] || 0;
        rows += `<tr>
            <td>${name}</td>
            <td><input type="text" class="alfa-tbl-input item-price-input" data-id="${id}" value="${val.toLocaleString()}"></td>
        </tr>`;
    }

    let html = `
    <div style="margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
        <span id="adv-fetch-status" style="font-size:11px; color:orange; font-style:italic;"></span>
        <div style="display:flex; gap:10px;">
             <button id="adv-fetch-api" class="alfa-btn-main" style="padding:6px 12px; font-size:11px;">Fetch Prices (API)</button>
             <button id="adv-save-items" class="alfa-btn-main" style="padding:6px 12px; font-size:11px;">Save Values</button>
        </div>
    </div>
    <div style="max-height: 400px; overflow-y:auto; border:1px solid #333; border-radius:6px;">
        <table class="alfa-table">
            <thead><tr><th>Item Name</th><th style="width:100px;">Value ($)</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    </div>
    <div class="alfa-actions">
         <button id="adv-back-main" class="alfa-btn-main">Back to Dashboard</button>
    </div>`;

    createModal("Set Item Values", html);

    $("#adv-back-main").on("click", openAdvisorMain);
    $("#adv-save-items").on("click", saveItemValues);
    $("#adv-fetch-api").on("click", fetchMarketPrices);
}

function saveItemValues() {
    // Save Points
    itemPrices["points"] = parseTornNumber($("#item-input-points").val());
    // Save HRG
    itemPrices["HRG_AVG"] = parseTornNumber($("#item-input-HRG_AVG").val());

    // Save Items
    $(".item-price-input").each(function() {
        let id = $(this).attr("data-id");
        let val = parseTornNumber($(this).val());
        itemPrices[id] = val;
    });

    localStorage.setItem("alfa_advisor_prices", JSON.stringify(itemPrices));

    // Animate Save button to show success
    let btn = $("#adv-save-items");
    let orig = btn.text();
    btn.text("Saved!").css("color", "green");
    setTimeout(() => { btn.text(orig).css("color", ""); }, 1500);
}


async function fetchMarketPrices() {
    let key = localStorage.getItem("alfa_vault_apikey");
    if (!key || key.length < 16) { alert("Invalid API Key"); return; }

    $("#adv-fetch-status").show();
    $("#adv-fetch-api").prop("disabled", true);

    try {
        // --- 1. Fetch Points ---
        $("#adv-fetch-status").text("Fetching Points...");
        try {
            const ptRes = await fetch(`https://api.torn.com/market/?selections=pointsmarket&key=${key}`);
            const ptData = await ptRes.json();

            if(ptData.pointsmarket) {
                let entries = Object.values(ptData.pointsmarket);
                entries.sort((a,b) => a.cost - b.cost);
                if(entries.length > 0) {
                    let bestPrice = entries[0].cost;
                    let $ptInput = $("#item-input-points");
                    $ptInput.val(bestPrice.toLocaleString());

                    // Add Flash Class
                    $ptInput.addClass("alfa-flash");
                    setTimeout(() => $ptInput.removeClass("alfa-flash"), 600);
                }
            }
        } catch(e) { console.error("Points fetch failed", e); }

        // --- 2. Fetch Items (V2) ---
        let ids = Object.keys(ADVISOR_ITEMS);
        let total = ids.length;
        let count = 0;

        for(let id of ids) {
            count++;
            let itemName = ADVISOR_ITEMS[id];
            $("#adv-fetch-status").text(`Fetching ${count}/${total}: ${itemName}...`);

            try {
                const response = await fetch(`https://api.torn.com/v2/torn/${id}/items?sort=ASC&key=${key}`);
                const itemData = await response.json();

                let price = 0;
                if (itemData && itemData.value && itemData.value.market_price) {
                    price = itemData.value.market_price;
                } else if (itemData.items && itemData.items[0] && itemData.items[0].value) {
                     price = itemData.items[0].value.market_price;
                }

                if(price > 0) {
                    let $input = $(`.item-price-input[data-id="${id}"]`);
                    if($input.length > 0) {
                        $input.val(price.toLocaleString());
                        $input.addClass("alfa-flash");
                        setTimeout(() => $input.removeClass("alfa-flash"), 600);
                    }
                }
            } catch (innerErr) { }
            await new Promise(r => setTimeout(r, 200));
        }

        $("#adv-fetch-status").text("Done!").css("color", "green");

    } catch(e) {
        $("#adv-fetch-status").text("Error (Check Console)").css("color", "red");
    }

    $("#adv-fetch-api").prop("disabled", false);
    setTimeout(() => {
        $("#adv-fetch-status").hide().text("Fetching...").css("color", "orange");
    }, 4000);
}

function openNetworthSettings() {
    let s = networthSettings.sources;

    let html = `
    <div class="alfa-settings-grid">
        <div class="alfa-card">
            <div class="alfa-card-head">
                <span class="alfa-card-title">Bank Interest Rates</span>
                <span class="alfa-link" id="adv-fetch-bank" style="margin:0; font-size:10px;">Fetch</span>
            </div>
            <table class="alfa-table">
                <tr><td>1 Week</td><td><input id="bank-1w" class="alfa-tbl-input" value="${bankSettings.roi_1w}"></td></tr>
                <tr><td>2 Weeks</td><td><input id="bank-2w" class="alfa-tbl-input" value="${bankSettings.roi_2w}"></td></tr>
                <tr><td>1 Month</td><td><input id="bank-1m" class="alfa-tbl-input" value="${bankSettings.roi_1m}"></td></tr>
                <tr><td>3 Months</td><td><input id="bank-3m" class="alfa-tbl-input" value="${bankSettings.roi_3m}"></td></tr>
            </table>
            <div id="bank-fetch-status" style="font-size:10px; color:orange; margin-top:5px; height:12px;"></div>
        </div>

        <div class="alfa-card">
            <div class="alfa-card-head"><span class="alfa-card-title">Liquid Sources</span></div>
            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:15px;">
                <label class="alfa-check-label"><input type="checkbox" id="nw-src-inv" ${s.inventory ? "checked" : ""}> Inventory</label>
                <label class="alfa-check-label"><input type="checkbox" id="nw-src-pts" ${s.points ? "checked" : ""}> Points</label>
                <label class="alfa-check-label"><input type="checkbox" id="nw-src-stocks" ${s.stocks ? "checked" : ""}> Stocks</label>
            </div>

            <div class="alfa-divider"></div>

            <div class="alfa-card-head" style="border:none; padding-bottom:0;"><span class="alfa-card-title">Exclusion Mode</span></div>
            <select id="nw-exclude-mode" class="alfa-select" style="width:100%; margin-top:5px;">
                <option value="all" ${networthSettings.excludeMode === "all" ? "selected" : ""}>Exclude Entire Stock</option>
                <option value="active" ${networthSettings.excludeMode === "active" ? "selected" : ""}>Exclude Only Active Blocks</option>
            </select>
            <div style="font-size:10px; color:#666; margin-top:4px; font-style:italic;">
                "Active Blocks" keeps leftover shares as liquid.
            </div>
        </div>
    </div>

    <div class="alfa-card" style="margin-top:15px;">
        <div class="alfa-card-head"><span class="alfa-card-title">Excluded Stocks</span></div>
        <div class="alfa-check-list">
            ${Object.keys(STOCK_DATA).sort().map(sym =>
                `<label class="alfa-check-label"><input type="checkbox" class="nw-exclude-stock" value="${sym}" ${networthSettings.excludedStocks.includes(sym) ? "checked" : ""}> ${sym}</label>`
            ).join("")}
        </div>
    </div>

    <div class="alfa-actions">
        <button id="adv-cancel-nw" class="alfa-btn-main" style="background:transparent; border:1px solid #444;">Cancel</button>
        <button id="adv-save-nw" class="alfa-btn-main">Save Settings</button>
    </div>`;

    createModal("Networth Settings", html);
    $("#adv-fetch-bank").on("click", fetchBankRates);
    $("#adv-save-nw").on("click", saveNetworthSettings);
    $("#adv-cancel-nw").on("click", function(){ $("#alfa-modal-overlay").remove(); openAdvisorMain(); });
}

async function fetchBankRates() {
    let key = localStorage.getItem("alfa_vault_apikey");
    if (!key) { alert("API Key missing"); return; }

    $("#bank-fetch-status").show();

    try {
        // Fetch User Perks to find "Bank interest"
        const response = await fetch(`https://api.torn.com/user/?selections=perks&key=${key}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error.error);

        // Find the modifier. Default is 0% bonus (multiplier 1.0?? No, perks usually give +50% etc)
        // Torn API 'perks' returns strings like: "bank_interest": 50 (meaning +50%)
        let bonusPercent = 0;
        if (data.job_perks && data.job_perks.bank_interest) bonusPercent += parseInt(data.job_perks.bank_interest);
        if (data.property_perks && data.property_perks.bank_interest) bonusPercent += parseInt(data.property_perks.bank_interest);
        if (data.stock_perks && data.stock_perks.bank_interest) bonusPercent += parseInt(data.stock_perks.bank_interest);
        if (data.faction_perks && data.faction_perks.bank_interest) bonusPercent += parseInt(data.faction_perks.bank_interest);
        if (data.merit_perks && data.merit_perks.bank_interest) bonusPercent += parseInt(data.merit_perks.bank_interest);
        if (data.education_perks && data.education_perks.bank_interest) bonusPercent += parseInt(data.education_perks.bank_interest);
        if (data.book_perks && data.book_perks.bank_interest) bonusPercent += parseInt(data.book_perks.bank_interest);

        // Formula: Base Rate * (1 + Bonus/100)
        let multi = 1 + (bonusPercent / 100);

        // Update Inputs
        $("#bank-1w").val( (BANK_BASE_RATES["1w"] * multi).toFixed(2) );
        $("#bank-2w").val( (BANK_BASE_RATES["2w"] * multi).toFixed(2) );
        $("#bank-1m").val( (BANK_BASE_RATES["1m"] * multi).toFixed(2) );
        $("#bank-2m").val( (BANK_BASE_RATES["2m"] * multi).toFixed(2) );
        $("#bank-3m").val( (BANK_BASE_RATES["3m"] * multi).toFixed(2) );

        $("#bank-fetch-status").text("Updated!").css("color", "green");

    } catch(e) {
        console.error(e);
        $("#bank-fetch-status").text("Error Fetching").css("color", "red");
    }
    setTimeout(() => $("#bank-fetch-status").hide(), 3000);
}

function saveNetworthSettings() {
    // 1. Save Bank
    bankSettings.roi_1w = parseFloat($("#bank-1w").val()) || 0;
    bankSettings.roi_2w = parseFloat($("#bank-2w").val()) || 0;
    bankSettings.roi_1m = parseFloat($("#bank-1m").val()) || 0;
    bankSettings.roi_2m = parseFloat($("#bank-2m").val()) || 0;
    bankSettings.roi_3m = parseFloat($("#bank-3m").val()) || 0;
    localStorage.setItem("alfa_advisor_bank", JSON.stringify(bankSettings));

    // 2. Save Sources
    networthSettings.sources.inventory = $("#nw-src-inv").is(":checked");
    networthSettings.sources.points = $("#nw-src-pts").is(":checked");
    networthSettings.sources.stocks = $("#nw-src-stocks").is(":checked");

    // 3. Save Exclusions
    let ex = [];
    $(".nw-exclude-stock:checked").each(function() { ex.push($(this).val()); });
    networthSettings.excludedStocks = ex;
    networthSettings.excludeMode = $("#nw-exclude-mode").val(); // Save mode
    localStorage.setItem("alfa_advisor_networth", JSON.stringify(networthSettings));

    // Close and go back to main
    $("#alfa-modal-overlay").remove();
    openAdvisorMain();
}

async function runAdvisorLogic() {
    $("#adv-debug-log").text("Syncing Portfolio...");
    $("#adv-daily-income").text("...");

    try {
        await fetchUserPortfolio(); // Now fetches fresh data
        let nwData = await getLiquidNetworth();
        let liquidCash = nwData.liquid; // Pure cash/points (not stocks)
        let dailyBank = nwData.dailyBank;
        let isBankActive = nwData.bankActive;

        let currentDailyIncome = 0;
        let ownedBlocks = []; // Stocks we HAVE (Candidates to sell)
        let candidates = [];  // Stocks we WANT (Candidates to buy)
        let symbols = Object.keys(STOCK_DATA);

        // --- 1. ANALYZE ALL STOCKS ---
        for (let sym of symbols) {
            let stockData = STOCK_DATA[sym];
            let benefitData = ADVISOR_DATA[sym];
            if (!benefitData || benefitData.type === "passive") continue;

            let dailyYield = getDailyYield(sym);
            let sharePrice = getPrice(sym);
            let increment = stockData.base;

            if (sharePrice === 0) continue;

            // --- CORRECTED INCREMENT LOGIC (Wiki Standard) ---
            let owned = getOwnedShares(sym);
            
            // 1. Calculate Current Level using Log2
            // Formula: Total = Base * (2^L - 1)  =>  L = log2((Total/Base) + 1)
            let currentLevel = 0;
            if (owned > 0) {
                currentLevel = Math.floor(Math.log2((owned / increment) + 1));
            }

            // 2. Calculate Cost of the NEXT Increment
            // Next increment requires: Base * 2^(CurrentLevel) shares
            // Example FHG (Base 2m):
            // Lvl 0->1: 2m * 2^0 = 2m shares.
            // Lvl 1->2: 2m * 2^1 = 4m shares.
            // Lvl 2->3: 2m * 2^2 = 8m shares.
            let sharesForNextBlock = increment * Math.pow(2, currentLevel);
            
            // 3. Calculate ROI for that specific next block
            let blockCost = sharesForNextBlock * sharePrice;
            let annualReturn = dailyYield * 365; // Yield is always 1 unit per block
            let roi = (annualReturn / blockCost) * 100;

            // 4. Calculate Actual "Missing" Cost
            // Target Total = Base * (2^(L+1) - 1)
            let targetTotalShares = increment * (Math.pow(2, currentLevel + 1) - 1);
            let missingShares = targetTotalShares - owned;
            let costToUpgrade = missingShares * sharePrice;

            if (owned >= increment) {
                // WE OWN AT LEAST 1 BLOCK
                let blocksOwned = currentLevel; // We strictly count full completed blocks
                currentDailyIncome += (blocksOwned * dailyYield);
                
                // Add to "Owned" list to calculate liquidity potential
                // We value it at the "Sell Value" of the current holdings
                ownedBlocks.push({
                    name: sym,
                    roi: roi, // Marginal ROI of the NEXT step (for upgrade decisions)
                    val: owned * sharePrice, // Total value locked
                    yield: dailyYield
                });
                
                // Add as a candidate for the NEXT level
                candidates.push({
                    name: sym + ` (Tier ${currentLevel+1})`,
                    roi: roi,
                    cost: costToUpgrade, // Cost to reach next tier
                    dailyYield: dailyYield,
                    type: 'stock'
                });
            } else {
                // WE DONT OWN THIS
                candidates.push({
                    name: sym,
                    roi: roi,
                    cost: blockCost,
                    dailyYield: dailyYield,
                    type: 'stock'
                });
            }
        }

        // --- 2. CALCULATE "ROI FLOOR" ---
        // Rule: Don't suggest stocks worse than what we currently hold.
        // Example: If I have a 35% stock, don't tell me to buy a 25% stock.
        let floorROI = 0;
        if (ownedBlocks.length > 0) {
            // Find the lowest ROI we are currently tolerating in our portfolio
            floorROI = Math.min(...ownedBlocks.map(b => b.roi));
        }

        // Filter candidates: Only show upgrades (ROI > Floor) or absolute bests
        // If we have NO stocks, floor is 0, so all are valid.
        let validCandidates = candidates.filter(c => c.roi > floorROI);

        // Fallback: If we have run out of "Better" stocks, show whatever is left
        if (validCandidates.length === 0) validCandidates = candidates;

        // Sort by ROI (Best first)
        validCandidates.sort((a, b) => b.roi - a.roi);

        // --- 3. UI UPDATES ---
        let totalDaily = currentDailyIncome + dailyBank;
        $("#adv-daily-income").text(formatMoney(Math.floor(totalDaily)) + " / day");
        $("#adv-daily-detail").text(`Stocks: ${formatMoney(Math.floor(currentDailyIncome))} | Bank: ${formatMoney(Math.floor(dailyBank))}`);

        if (validCandidates.length === 0) {
            $("#adv-next-name").text("All Stocks Owned!");
            $("#adv-next-cost").text("-");
            $("#adv-next-gain").text("-");
            $("#adv-afford-name").text("-");
            return;
        }

        let nextBest = validCandidates[0]; // The Dream Target (Highest ROI)

        // Find "Best Affordable" in the filtered list
        // We look for the best ROI that we can buy with just CASH
        let bestAffordable = null;
        for (let c of validCandidates) {
            if (c.cost <= liquidCash) {
                bestAffordable = c;
                break; // Since list is sorted by ROI, first affordable is best affordable
            }
        }

        // --- HELPER: LIQUIDITY CALCULATOR ---
        // Calculates if we can afford 'target' by selling worse stocks
        function calculateLiquidity(target) {
            let available = liquidCash;
            let sources = [];

            // We can sell any stock that has LOWER ROI than the target
            // (Because we are upgrading efficiency)
            for (let block of ownedBlocks) {
                if (block.roi < target.roi) {
                    available += block.val;
                    sources.push(block.name);
                }
            }

            let missing = target.cost - available;
            return { available, missing, sources };
        }

        // --- BOX 1: TARGET (Highest ROI) ---
        $("#adv-next-roi").text(nextBest.roi.toFixed(2) + "%");
        $("#adv-next-name").text(nextBest.name);

        let targetLiq = calculateLiquidity(nextBest);

        if (targetLiq.missing <= 0) {
            // We can afford it (maybe by selling stuff)
            if (liquidCash >= nextBest.cost) {
                $("#adv-next-cost").text(formatMoney(nextBest.cost));
                $("#adv-next-gain").text("Buy with Cash");
            } else {
                $("#adv-next-cost").text("Sell " + targetLiq.sources.join("+"));
                $("#adv-next-gain").text("to buy this");
            }
        } else {
            $("#adv-next-cost").html(`<span class="alfa-shortage">Missing ${formatMoney(targetLiq.missing)}</span>`);
            $("#adv-next-gain").text(`Cost: ${formatMoney(nextBest.cost)}`);
        }

        // --- BOX 2: NEXT CHEAPEST UPGRADE ---
        // If we can't afford anything with cash, show the cheapest VALID upgrade
        // and tell us what to sell to get it.

        if (bestAffordable) {
            // We have cash for this
            $("#adv-afford-roi").text(bestAffordable.roi.toFixed(2) + "%");
            $("#adv-afford-roi").css("color", "#609b9b");
            $("#adv-afford-name").text(bestAffordable.name);
            $("#adv-afford-cost").text(formatMoney(bestAffordable.cost));
            $("#adv-afford-gain").text(`+ ${formatMoney(Math.floor(bestAffordable.dailyYield))} / day`);
        } else {
            // We are broke. Find CHEAPEST valid upgrade.
            // Sort by Cost (Low to High)
            let cheapestOption = [...validCandidates].sort((a,b) => a.cost - b.cost)[0];

            if (cheapestOption) {
                $("#adv-afford-roi").text(cheapestOption.roi.toFixed(2) + "%");
                $("#adv-afford-roi").css("color", "#aaa");
                $("#adv-afford-name").text("Target: " + cheapestOption.name);

                let cheapLiq = calculateLiquidity(cheapestOption);

                if (cheapLiq.missing <= 0) {
                    // accessible by selling
                    $("#adv-afford-cost").text("Sell " + cheapLiq.sources[0] + (cheapLiq.sources.length>1 ? "..." : ""));
                    $("#adv-afford-gain").text("to buy this");
                } else {
                    // Detailed missing breakdown
                    // Example: "32m(Stock2) + 3m missing"
                    let msg = "";
                    if (cheapLiq.sources.length > 0) {
                        let firstSource = ownedBlocks.find(b => b.name === cheapLiq.sources[0]);
                        msg = `${formatMoney(firstSource.val)} in ${firstSource.name}`;
                        if (cheapLiq.sources.length > 1) msg += " + ...";
                    }

                    $("#adv-afford-cost").html(`<span class="alfa-shortage">Missing ${formatMoney(cheapLiq.missing)}</span>`);
                    if(msg) $("#adv-afford-gain").html(`<span style="font-size:9px; color:#888">(${msg})</span>`);
                    else $("#adv-afford-gain").text("Save more cash");
                }
            } else {
                $("#adv-afford-name").text("No Upgrades");
            }
        }

        $("#adv-debug-log").text(`Liquid Cash: ${formatMoney(liquidCash)}`);

    } catch (e) {
        console.error("Advisor Crash:", e);
    }
}


async function vault() {
    let symb = localStorage.alfa_vault_target;
    if(!symb) { alert("Select a stock first!"); return; }

    let money = 0;
    // Check if "Use API" checkbox is ON
    if ($("#alfa-use-api").is(":checked")) {
        money = await syncWallet(false); // Force API
    } else {
        money = getMoneyFast(); // Instant DOM read
        // Fallback if DOM is empty
        if (money === 0) money = await syncWallet(false);
    }

    if (money === 0) return;

    let price = getPrice(symb);
    let amt = Math.floor(money / price);
    let totalCost = amt * price;
    postTrade(symb, amt, "buyShares", `Vaulted ${formatMoney(totalCost)}`);
}

async function vaultExcept() {
    let symb = localStorage.alfa_vault_target;
    if(!symb) { alert("Select a stock first!"); return; }

    let money = 0;
    if ($("#alfa-use-api").is(":checked")) {
        money = await syncWallet(false);
    } else {
        money = getMoneyFast();
        if (money === 0) money = await syncWallet(false);
    }

    if (money === 0) return;

    let keepRaw = $("#keepval").val();
    let keepAmt = parseTornNumber(keepRaw);
    if (isNaN(keepAmt)) keepAmt = 0;

    let availableToVault = money - keepAmt;
    if (availableToVault <= 0) { $("#responseStock").html("Not enough money!").css("color", "red"); return; }

    let price = getPrice(symb);
    let amt = Math.floor(availableToVault / price);
    if (amt <= 0) { $("#responseStock").html("Amount too low.").css("color", "red"); return; }

    let totalCost = amt * price;
    postTrade(symb, amt, "buyShares", `Vaulted ${formatMoney(totalCost)} (Kept ${keepRaw})`);
}


function withdraw() {
    let symb = localStorage.alfa_vault_target;
    if(!symb) { alert("Select a stock first!"); return; }
    let val = parseTornNumber($("#sellval").val());
    let targetValue = val / 0.999;
    let price = getPrice(symb);
    let sharesToSell = Math.ceil(targetValue / price);

    if ($("#alfa-lock-toggle").is(":checked")) {
        let currentOwned = getOwnedShares(symb);
        // Safety Check for 0 reading
        if (currentOwned === 0) {
            if (!confirm("WARNING: Script reads 0 shares. Lock won't work. Continue?")) {
                $("#responseStock").html("Aborted").css("color", "orange");
                return;
            }
        }
        let remaining = currentOwned - sharesToSell;
        let currentTier = getBenefitTier(symb, currentOwned);
        let futureTier = getBenefitTier(symb, remaining);

        // BLOCK logic
        if (futureTier.tier < currentTier.tier) {
            let data = STOCK_DATA[symb];
            let required = (data.type === "P") ? data.base : (data.base * currentTier.tier);
            $("#responseStock").html(`Blocked: Need ${required.toLocaleString()} shares for benefit`).css("color", "red");
            return;
        }
    }
    postTrade(symb, sharesToSell, "sellShares", `Withdrawn approx ${formatMoney(val)}`);
}

function withdrawAll() {
    let symb = localStorage.alfa_vault_target;
    if(!symb) { alert("Select a stock first!"); return; }

    let owned = getOwnedShares(symb);
    if (owned <= 0) { $("#responseStock").html("You have no shares.").css("color", "red"); return; }

    let amountToSell = owned; // Default: Sell everything

    // --- LOCK BENEFIT LOGIC ---
    if ($("#alfa-lock-toggle").is(":checked")) {
        let data = STOCK_DATA[symb];

        if (data) {
            let requiredToKeep = 0;

            if (data.type === "P") {
                // Passive: Keep exactly the base amount (e.g., 1,000,000)
                if (owned >= data.base) requiredToKeep = data.base;
            } else {
                // Active/Stackable: Keep the highest full block
                // e.g., Base 500k. Owned 1.2m. Keep 1.0m (2 blocks). Sell 200k.
                let blocks = Math.floor(owned / data.base);
                requiredToKeep = blocks * data.base;
            }

            amountToSell = owned - requiredToKeep;

            if (amountToSell <= 0) {
                 $("#responseStock").html(`Locked: All ${owned.toLocaleString()} shares are needed for benefit.`).css("color", "orange");
                 return;
            }
        }
    }

    // Execute Trade
    let price = getPrice(symb);
    let totalValue = amountToSell * price;
    postTrade(symb, amountToSell, "sellShares", `Sold All Available (${formatMoney(totalValue)})`);
}


function postTrade(symb, amt, step, successMsg) {
    // 1. SEND REQUEST FIRST (0ms delay)
    // We fire the network request immediately.
    let request = $.post(`https://www.torn.com/page.php?sid=StockMarket&step=${step}&rfcv=${getRFC()}`, {
        stockId: stockId[symb],
        amount: amt
    });

    // 2. UPDATE UI (Non-blocking)
    // While the request is flying to the server, we update the text.
    $("#responseStock").html("Processing Trade...").css("color", "orange");

    // 3. HANDLE RESPONSE (When server replies)
    request.done(function(response) {
        try {
            if(typeof response === "string") response = JSON.parse(response);

            if(response.success) {
                $("#responseStock").html(successMsg + " (" + amt + " shares)").css("color", "green");

                // Update Local Cache
                if (step === "buyShares") updateLocalCache(symb, amt);
                if (step === "sellShares") updateLocalCache(symb, -amt);
            } else {
                $("#responseStock").html(response.text || "Failed").css("color", "red");
            }
        } catch(e) {
            $("#responseStock").html("Request Sent (Check Trade)").css("color", "blue");
        }
    });
}

// --- ADVISOR LOGIC ---

// 1. Calculate Daily Income ($) for a specific stock
function getDailyYield(sym) {
    let benefit = ADVISOR_DATA[sym];
    if (!benefit) return 0;

    let value = 0;

    // A. Cash Rewards (e.g., CNC)
    if (benefit.type === "cash") {
        value = benefit.val;
    }
    // B. Item Rewards (e.g., MUN)
    else if (benefit.type === "item") {
        value = itemPrices[benefit.id] || 0;
    }
    // C. HRG (Manual)
    else if (benefit.type === "manual") {
        value = itemPrices["HRG_AVG"] || 0;
    }
    // D. TCC (Average of Cache Set)
    else if (benefit.type === "average") {
        let total = 0;
        let count = 0;
        for (let cid of benefit.ids) {
            let p = itemPrices[cid] || 0;
            if (p > 0) { total += p; count++; }
        }
        value = (count > 0) ? (total / count) : 0;
    }

    if (value === 0 || !benefit.freq) return 0;
    return value / benefit.freq; // Daily Income
}

async function getLiquidNetworth() {
    let key = localStorage.getItem("alfa_vault_apikey");
    if (!key) return { liquid: 0, dailyBank: 0, bankActive: false };

    try {
        const res = await fetch(`https://api.torn.com/v2/user/money?key=${key}`);
        const data = await res.json();

        if (!data.money) return { liquid: 0, dailyBank: 0, bankActive: false };

        let m = data.money;

        // Check Bank Status
        let dailyBank = 0;
        let bankActive = false;

        // If profit > 0, it means an investment is active
        if (m.city_bank && m.city_bank.profit > 0) {
            dailyBank = m.city_bank.profit / m.city_bank.duration;
            bankActive = true;
        }

        // Calculate Liquid Assets
        let liquidTotal = m.wallet || 0;
        if (networthSettings.sources.points && m.points > 0) {
            let pointPrice = itemPrices["points"] || 45000;
            liquidTotal += (m.points * pointPrice);
        }

        // Stocks
        if (networthSettings.sources.stocks) {
            let symbols = Object.keys(STOCK_DATA);
            for (let sym of symbols) {
                let shares = localShareCache[sym] || 0;
                let price = getPrice(sym);
                let stockData = STOCK_DATA[sym];

                if (shares <= 0 || price <= 0 || !stockData) continue;

                let valueToAdd = shares * price;

                // Exclusion Logic
                if (networthSettings.excludedStocks && networthSettings.excludedStocks.includes(sym)) {
                    if (networthSettings.excludeMode === "active") {
                        let increment = stockData.base;
                        let blocks = Math.floor(shares / increment);
                        let excludedValue = blocks * increment * price;
                        valueToAdd -= excludedValue;
                    } else {
                        valueToAdd = 0;
                    }
                }
                liquidTotal += valueToAdd;
            }
        }

        return { liquid: liquidTotal, dailyBank: dailyBank, bankActive: bankActive };

    } catch (e) {
        console.error("NW Error", e);
        return { liquid: 0, dailyBank: 0, bankActive: false };
    }
}

async function fetchUserPortfolio() {
    let key = localStorage.getItem("alfa_vault_apikey");
    if (!key) return;

    $("#adv-debug-log").text("Syncing Portfolio...");

    try {
        const res = await fetch(`https://api.torn.com/user/?selections=stocks&key=${key}&ts=${Date.now()}`);
        const data = await res.json();

        if (data.stocks) {
            // Create a temporary map of ID -> Acronym from our existing stockId object
            // stockId looks like: { "HRG": "stock_123", "MUN": "stock_456" }
            let idToSym = {};
            for (let [sym, domId] of Object.entries(stockId)) {
                // Extract numeric ID from "stock_123"
                let cleanId = domId.replace("stock_", "");
                idToSym[cleanId] = sym;
            }

            // Loop through API results
            for (let [sID, sData] of Object.entries(data.stocks)) {
                let sym = idToSym[sID];
                if (sym) {
                    let totalShares = sData.total_shares || 0;
                    localShareCache[sym] = totalShares; // Update Cache
                }
            }
            $("#adv-debug-log").text("Portfolio Synced.");
        }
    } catch (e) {
        console.error("Portfolio Sync Error", e);
    }
}

insert();
//CSS
const style = `

/* --- LAYOUT UTILS --- */
.alfa-header { display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 10px; }
.alfa-toolbar { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 5px; font-size: 11px; color: #888; }
.alfa-small-label { display: flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; }
.alfa-small-label:hover { color: #fff; }

/* ADVISOR BUTTON (Distinct Style) */
.alfa-advisor-btn {
    background: #2a4040;
    border: 1px solid #609b9b;
    color: #fff;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
}
.alfa-advisor-btn:hover { background: #609b9b; }
/* --- MAIN VAULT UI (Restored to Original Clean Look) --- */
.alfa-container { background: #111; padding: 12px; border: 1px solid #333; border-radius: 8px; margin-bottom: 15px; color: #ccc; font-family: Arial, sans-serif; font-size: 12px; }
.alfa-row { margin-bottom: 10px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.alfa-divider { border-top: 1px solid #333; padding-top: 10px; width: 100%; }
.alfa-group { display: flex; gap: 5px; flex-grow: 1; }
.alfa-label { width: 50px; font-weight: bold; color: #999; }

/* Native-like Inputs */
.alfa-input, .alfa-select { background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 4px 8px; height: 28px; box-sizing: border-box; }
.alfa-input { width: 130px; }
.alfa-select { width: 150px; }
.alfa-input:focus, .alfa-select:focus { border-color: #609b9b; outline: none; }

/* Links */
.alfa-link { cursor: pointer; color: #609b9b; text-decoration: underline; margin-left: auto; }
.alfa-link:hover { color: #fff; }

/* PRESET BUTTONS (Restored Original Style) */
.alfa-preset-row { display: flex; flex-wrap: wrap; gap: 5px; width: 100%; margin-top:5px; }
.alfa-preset-btn {
    padding: 3px 10px !important;
    font-size: 11px !important;
    height: 26px !important;
    line-height: 18px !important;
    background: #444 !important;
    border: 1px solid #555 !important;
    border-radius: 4px !important;
    color: #ddd !important;
}
.alfa-preset-btn:hover { background: #555 !important; color: #fff !important; }

/* --- ADVISOR MODAL (YOUR NEW STYLE) --- */
.alfa-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 99999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
.alfa-modal { background: #1e1e1e; width: 600px; max-width: 95%; border: 1px solid #333; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.9); display: flex; flex-direction: column; overflow: hidden; animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.alfa-modal-header { background: #252525; padding: 15px 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
.alfa-modal-header h3 { margin: 0; font-size: 16px; font-weight: 600; color: #fff; letter-spacing: 0.5px; }
.alfa-modal-close { cursor: pointer; font-size: 24px; color: #666; transition: color 0.2s; }
.alfa-modal-close:hover { color: #fff; }
.alfa-modal-body { padding: 20px; color: #ccc; overflow-y: auto; max-height: 80vh; }

/* Dashboard Layout */
.alfa-dashboard { display: flex; flex-direction: column; gap: 20px; }

/* Hero Section (Income) */
.alfa-hero { background: linear-gradient(135deg, #2a2a2a 0%, #222 100%); border: 1px solid #333; border-radius: 8px; padding: 20px; text-align: center; position: relative; }
.alfa-hero-label { font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 5px; }
.alfa-hero-val { font-size: 28px; font-weight: 700; color: #8bc34a; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
.alfa-hero-sub { font-size: 12px; color: #666; margin-top: 5px; }

/* Grid & Cards */
.alfa-grid-section { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.alfa-card { background: #252525; border: 1px solid #333; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; transition: transform 0.2s; }
.alfa-card:hover { border-color: #444; transform: translateY(-2px); }

.alfa-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 8px; }
.alfa-card-title { font-size: 11px; font-weight: bold; color: #aaa; text-transform: uppercase; }
.alfa-card-roi { font-size: 18px; font-weight: bold; color: #609b9b; }

.alfa-card-body { flex-grow: 1; display: flex; flex-direction: column; gap: 4px; }
.alfa-stock-name { font-size: 14px; font-weight: bold; color: #fff; }
.alfa-stock-cost { font-size: 12px; color: #888; }
.alfa-stock-gain { font-size: 12px; color: #8bc34a; margin-top: auto; padding-top: 10px; display: flex; align-items: center; gap: 5px; }
.alfa-stock-gain::before { content: "▲"; font-size: 8px; margin-right: 4px; }

/* Footer Buttons */
.alfa-actions { display: flex; gap: 10px; border-top: 1px solid #333; padding-top: 20px; margin-top: 10px; }
.alfa-btn-main { flex: 1; background: #333; color: #fff; border: 1px solid #444; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.2s; text-align: center; }
.alfa-btn-main:hover { background: #444; border-color: #609b9b; }

/* Settings */
.alfa-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.alfa-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 12px; }
.alfa-table th { text-align: left; padding: 8px; color: #888; border-bottom: 1px solid #444; }
.alfa-table td { padding: 8px; border-bottom: 1px solid #333; }
.alfa-check-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; max-height: 200px; overflow-y: auto; background: #151515; padding: 10px; border-radius: 6px; border: 1px solid #333; }
.alfa-check-label { display: flex; align-items: center; gap: 8px; color: #ccc; cursor: pointer; font-size: 11px; }
.alfa-check-label:hover { color: #fff; }
.alfa-tbl-input { width: 100%; background: #222; border: 1px solid #444; color: #fff; padding: 4px; text-align: right; border-radius: 4px; box-sizing: border-box; }
/* EDIT MODE BUTTONS (Restored) */
.alfa-edit-ui { width: 100%; display: flex; flex-direction: column; gap: 5px; }
.alfa-edit-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 5px; }
.alfa-action-btn {
    padding: 3px 12px !important;
    font-size: 11px !important;
    height: 24px !important;
    border-radius: 4px !important;
    font-weight: bold !important;
    background: transparent !important;
    cursor: pointer;
}
.alfa-save { border: 1px solid #609b9b !important; color: #609b9b !important; }
.alfa-save:hover { background: #609b9b !important; color: #111 !important; }
.alfa-cancel { border: 1px solid #d32f2f !important; color: #d32f2f !important; }
.alfa-cancel:hover { background: #d32f2f !important; color: #fff !important; }
.alfa-shortage { color: #ef5350; font-weight: bold; }
/* MAIN ACTION BUTTONS (Vault/Withdraw) */
.alfa-main-btn {
    background: #333;
    color: #ddd;
    border: 1px solid #555;
    border-radius: 4px;
    padding: 0 15px;
    height: 28px; /* Matches input height */
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}
.alfa-main-btn:hover {
    background: #444;
    border-color: #609b9b;
    color: #fff;
}
`;
const styleSheet = document.createElement("style");
styleSheet.textContent = style;
(document.head || document.documentElement).appendChild(styleSheet);