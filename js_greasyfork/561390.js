// ==UserScript==
// @name         Torn Stock Vault (API) v5.1 (Smart Shares)
// @namespace    TheALFA.torn.stocks
// @version      5.1
// @description  Secure stock vault using the Torn API. Mobile optimized. Smart ROI Advisor included.
// @author       TheALFA [2869953]
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561390/Torn%20Stock%20Vault%20%28API%29%20v51%20%28Smart%20Shares%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561390/Torn%20Stock%20Vault%20%28API%29%20v51%20%28Smart%20Shares%29.meta.js
// ==/UserScript==

// --- CONFIGURATION ---
const DEFAULT_PRESETS = ["50k", "250k", "1m", "5m", "10m", "25m"];

const STOCK_DATA = {
    "ASS": { base: 1_000_000, type: "A" }, "BAG": { base: 3_000_000, type: "A" },
    "CNC": { base: 7_500_000, type: "A" }, "EWM": { base: 1_000_000, type: "A" },
    "ELT": { base: 5_000_000, type: "P" }, "EVL": { base: 100_000,    type: "A" },
    "FHG": { base: 2_000_000, type: "A" }, "GRN": { base: 500_000,    type: "A" },
    "CBD": { base: 350_000,    type: "A" }, "HRG": { base: 10_000_000,type: "A" },
    "IIL": { base: 1_000_000, type: "P" }, "IOU": { base: 3_000_000, type: "A" },
    "IST": { base: 100_000,    type: "P" }, "LAG": { base: 750_000,    type: "A" },
    "LOS": { base: 7_500_000, type: "P" }, "LSC": { base: 500_000,    type: "A" },
    "MCS": { base: 350_000,    type: "A" }, "MSG": { base: 300_000,    type: "P" },
    "MUN": { base: 5_000_000, type: "A" }, "PRN": { base: 1_000_000, type: "A" },
    "PTS": { base: 10_000_000,type: "A" }, "SYM": { base: 500_000,    type: "A" },
    "SYS": { base: 3_000_000, type: "P" }, "TCP": { base: 1_000_000, type: "P" },
    "TMI": { base: 6_000_000, type: "A" }, "TGP": { base: 2_500_000, type: "P" },
    "TCT": { base: 100_000,    type: "A" }, "TSB": { base: 3_000_000, type: "A" },
    "TCC": { base: 7_500_000, type: "A" }, "THS": { base: 150_000,    type: "A" },
    "TCI": { base: 1_500_000, type: "P" }, "TCM": { base: 1_000_000, type: "P" },
    "WSU": { base: 1_000_000, type: "P" }, "WLT": { base: 9_000_000, type: "P" },
    "YAZ": { base: 1_000_000, type: "P" }
};

// --- ADVISOR CONSTANTS ---
const ADVISOR_ITEMS = {
    364: "Box of Grenades", 365: "Box of Medical Supplies", 366: "Erotic DVD",
    367: "Feathery Hotel Coupon", 368: "Lawyer's Business Card", 369: "Lottery Voucher",
    370: "Drug Pack", 817: "Six-Pack of Alcohol", 818: "Six-Pack of Energy Drink",
    1057: "Gentleman's Cache", 1112: "Elegant Cache", 1113: "Naughty Cache",
    1114: "Elderly Cache", 1115: "Denim Cache", 1116: "Wannabe Cache", 1117: "Cutesy Cache"
};
const TCC_CACHE_IDS = [1057, 1112, 1113, 1114, 1115, 1116, 1117];

const ADVISOR_DATA = {
    "MUN": { type: "item", id: 818, freq: 7 }, "ASS": { type: "item", id: 817, freq: 7 },
    "HRG": { type: "manual", label: "Avg Property Value", freq: 31 },
    "LSC": { type: "item", id: 369, freq: 7 }, "LAG": { type: "item", id: 368, freq: 7 },
    "FHG": { type: "item", id: 367, freq: 7 }, "PRN": { type: "item", id: 366, freq: 7 },
    "SYM": { type: "item", id: 370, freq: 7 }, "TCC": { type: "average", ids: TCC_CACHE_IDS, freq: 31 },
    "THS": { type: "item", id: 365, freq: 7 }, "EWM": { type: "item", id: 364, freq: 7 },
    "BAG": { type: "passive" }, "CNC": { type: "cash", val: 80_000_000, freq: 31 },
    "TSB": { type: "cash", val: 50_000_000, freq: 31 }, "TMI": { type: "cash", val: 25_000_000, freq: 31 },
    "IOU": { type: "cash", val: 12_000_000, freq: 31 }, "GRN": { type: "cash", val: 4_000_000, freq: 31 },
    "TCT": { type: "cash", val: 1_000_000, freq: 31 }
};

let lastNwCache = null; // Stores the last known networth data
let lastSync = 0;
let itemPrices = {};
try { itemPrices = JSON.parse(localStorage.getItem("alfa_advisor_prices")) || {}; } catch(e) { itemPrices = {}; }

let networthSettings = { sources: { inventory: false, points: true, stocks: true }, excludedStocks: [], excludeMode: "all" };
try {
    let savedNW = JSON.parse(localStorage.getItem("alfa_advisor_networth"));
    if(savedNW) { networthSettings = savedNW; if(!networthSettings.excludeMode) networthSettings.excludeMode = "all"; }
} catch(e) {}

const BANK_BASE_RATES = { "1w": 0.7917, "2w": 1.7833, "1m": 4.3, "2m": 9.8, "3m": 16.5 };
let bankSettings = { roi_1w: 0, roi_2w: 0, roi_1m: 0, roi_2m: 0, roi_3m: 0, active_period: "2w" };
try { let savedBank = JSON.parse(localStorage.getItem("alfa_advisor_bank")); if(savedBank) bankSettings = savedBank; } catch(e) {}

let stocks = {}, stockId = {}, stockRows = {}, localShareCache = {};

// --- UTILITIES ---
function createModal(title, contentHtml) {
    $("#alfa-modal-overlay").remove();
    let modal = `<div id="alfa-modal-overlay" class="alfa-modal-overlay">
        <div class="alfa-modal"><div class="alfa-modal-header"><h3>${title}</h3><span id="alfa-modal-close" class="alfa-modal-close">&times;</span></div>
        <div class="alfa-modal-body">${contentHtml}</div></div></div>`;
    $("body").append(modal);
    $("#alfa-modal-close").on("click", function() { $("#alfa-modal-overlay").remove(); });
    $("#alfa-modal-overlay").on("click", function(e) { if(e.target.id === "alfa-modal-overlay") $("#alfa-modal-overlay").remove(); });
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
function getRFC() { var c = document.cookie.match(/rfc_v=([^;]+)/); return c ? c[1] : ""; }

function getBenefitTier(sym, shares) {
    let data = STOCK_DATA[sym];
    if (!data) return { tier: 0, next: 0, label: "Unknown" };
    if (data.type === "P") return (shares >= data.base) ? { tier: 1, next: data.base } : { tier: 0, next: data.base };
    let multiplier = 1;
    while (shares >= data.base * (multiplier * 2)) { multiplier *= 2; }
    return (shares < data.base) ? { tier: 0 } : { tier: multiplier, next: data.base * multiplier * 2 };
}

// 1. Force API Sync
async function syncWallet(silent = false) {
    let key = localStorage.getItem("alfa_vault_apikey");
    if (!key) return 0;
    if (Date.now() - lastSync < 2000) return 0;
    lastSync = Date.now();
    if (!silent) $("#responseStock").html("Syncing...").css("color", "orange");
    try {
        const response = await fetch(`https://api.torn.com/user/?selections=money&key=${key}&ts=${Date.now()}`);
        const data = await response.json();
        if (data.money_onhand !== undefined) {
            let money = data.money_onhand;
            if ($("#user-money").length > 0) $("#user-money").attr("data-money", money).text("$" + money.toLocaleString());
            if (!silent) $("#responseStock").html(`Synced: $${money.toLocaleString()}`).css("color", "green");
            return money;
        }
    } catch (e) { if (!silent) $("#responseStock").html("Sync Failed").css("color", "red"); }
    return 0;
}

// 2. Read Money from Screen
function getMoneyFast() {
    let dataMoney = $("#user-money").attr("data-money");
    if (dataMoney) return parseFloat(dataMoney);
    let textMoney = $("#user-money").text();
    return textMoney ? parseTornNumber(textMoney) : 0;
}

// --- INITIALIZATION ---
function insert() {
    let current = localStorage.alfa_vault_target;
    let savedKey = localStorage.getItem("alfa_vault_apikey") || "";
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

    let container = `
    <div class="alfa-container">
        <div class="alfa-header">
            <input type="password" id="alfa-apikey" class="alfa-input" style="flex-grow:1; text-align:center; letter-spacing:2px;" placeholder="Paste API Key Here" value="${savedKey}">
            <span id="alfa-advisor-btn" class="alfa-advisor-btn">★ Advisor</span>
        </div>
        <div class="alfa-row">
            <label class="alfa-label">Target:</label>
            <select id="stockid" class="alfa-select"><option value="">Select Stock...</option>`;
    for (let sy of symbols) container += `<option value="${sy}" ${current==sy?"selected":""}>${sy}</option>`;
    container += `</select><span id="alfa-owned-display" style="margin-left:10px; font-size:11px; color:#888;">Owned: -</span></div>
    <div class="alfa-divider"></div>
    <div class="alfa-row">
        <button id="vaultall" class="alfa-main-btn">Vault Max</button>
        <label class="alfa-small-label"><input type="checkbox" id="alfa-use-api" ${localStorage.getItem("alfa_vault_use_api")==="true"?"checked":""}> API Mode</label>
        <div class="alfa-group" style="margin-left: auto;">
            <input type="text" placeholder="Keep Amt" id="keepval" class="alfa-input" style="width:100px;" value="${localStorage.getItem("alfa_vault_keepVal")||""}">
            <button id="vaultexcept" class="alfa-main-btn">Vault (Keep)</button>
        </div>
    </div>
    <div class="alfa-row">
        <div class="alfa-group">
            <input type="text" placeholder="Withdraw Amt" id="sellval" class="alfa-input" value="${localStorage.getItem("alfa_vault_sellVal")||""}">
            <button id="sellamt" class="alfa-main-btn">Withdraw</button>
        </div>
        <div style="display: flex; align-items: center; margin-left: auto;">
            <button id="sellall-init" class="alfa-main-btn" style="color:#aaa; border-color:#444;">Withdraw All</button>
            <div id="sellall-confirm" style="display:none; gap:5px;">
                <button id="sellall-yes" class="alfa-main-btn" style="color:#8bc34a; border-color:#8bc34a;">Yes</button>
                <button id="sellall-no" class="alfa-main-btn" style="color:#ef5350; border-color:#ef5350;">No</button>
            </div>
        </div>
    </div>
    <div class="alfa-toolbar">
        <div style="display:flex; gap:15px;">
            <label class="alfa-small-label"><input type="checkbox" id="alfa-instant-toggle" ${localStorage.getItem("alfa_vault_instant")==="true"?"checked":""}> Instant</label>
            <label class="alfa-small-label"><input type="checkbox" id="alfa-lock-toggle" ${localStorage.getItem("alfa_vault_lock")==="true"?"checked":""}> Lock Benefits</label>
        </div>
        <span id="alfa-edit-trigger" class="alfa-link" style="font-size:11px;">Edit Buttons</span>
    </div>
    <div id="alfa-preset-row" class="alfa-preset-row"></div>
    <div class="alfa-row" style="margin-top:10px;"><span id="responseStock"></span></div>
    </div>`;

    $("#stockmarketroot").prepend(container);
    $("#alfa-advisor-btn").on("click", openAdvisorMain);
    $("#stockid").change(updateStock);
    $("#vaultall").on("click", vault);
    $("#vaultexcept").on("click", vaultExcept);
    $("#sellamt").on("click", () => withdraw());
    $("#alfa-apikey").on("keyup change", function() { localStorage.setItem("alfa_vault_apikey", $(this).val().trim()); });
    $("#alfa-instant-toggle").on("change", function() { localStorage.setItem("alfa_vault_instant", $(this).is(":checked")); });
    $("#alfa-lock-toggle").on("change", function() { localStorage.setItem("alfa_vault_lock", $(this).is(":checked")); });
    $("#alfa-use-api").on("change", function() { localStorage.setItem("alfa_vault_use_api", $(this).is(":checked")); });
    $("#sellval").on("keyup", function() { handleInputUpdate(this, "alfa_vault_sellVal"); });
    $("#keepval").on("keyup", function() { handleInputUpdate(this, "alfa_vault_keepVal"); });
    $("#alfa-edit-trigger").on("click", renderEditMode);
    $("#sellall-init").on("click", function() { $(this).hide(); $("#sellall-confirm").css("display", "flex"); });
    $("#sellall-no").on("click", function() { $("#sellall-confirm").hide(); $("#sellall-init").show(); });
    $("#sellall-yes").on("click", function() { withdrawAll(); $("#sellall-confirm").hide(); $("#sellall-init").show(); });

    renderPresets();
    updateStock();
}

// --- CORE FUNCTIONS ---
function getOwnedShares(id) {
    if (localShareCache[id] !== undefined) return localShareCache[id];
    let row = stockRows[id];
    if (!row) return 0;
    let mobileEl = row.find("p[class^='count']");
    if(mobileEl.length > 0) return parseFloat(mobileEl.text().replace(/,/g, '')) || 0;
    let cols = row.children("div");
    if(cols.length >= 5) return parseFloat($(cols[4]).text().replace(/,/g, '')) || 0;
    return 0;
}

function updateStock() {
    let symb = $("#stockid").val();
    localStorage.alfa_vault_target = symb;
    if(symb) {
        let owned = getOwnedShares(symb);
        $("#alfa-owned-display").html(`Owned: <strong style="color:${owned>0?'#609b9b':'#666'}">${owned.toLocaleString()}</strong>`);
    } else $("#alfa-owned-display").text("Owned: -");
}

function updateLocalCache(sym, amt) {
    let current = getOwnedShares(sym);
    localShareCache[sym] = Math.max(0, current + amt);
    updateStock();
}

function getPrice(id) { if (!stocks[id]) return 0; return parseFloat($(stocks[id]).text().replace(/,/g, '')); }
function handleInputUpdate(el, key) {
    let raw = $(el).val(), num = parseTornNumber(raw);
    if(!isNaN(num) && (raw.endsWith("k")||raw.endsWith("m")||raw.endsWith("b"))) { $(el).val(num); localStorage.setItem(key, num); }
    else localStorage.setItem(key, raw);
}

// --- ADVISOR UI ---
function openAdvisorMain() {
    let html = `
    <div class="alfa-dashboard">
        <div class="alfa-hero" id="adv-hero-trigger">
            <div class="alfa-hero-label">Current Daily Income <span class="alfa-caret">▼</span></div>
            <div id="adv-daily-income" class="alfa-hero-val">--</div>
            <div id="adv-daily-detail" class="alfa-hero-sub">Calculating...</div>
            <div id="adv-income-breakdown" class="alfa-breakdown"></div>
        </div>
        <div class="alfa-grid-section">
            <div class="alfa-card" id="adv-card-target">
                <div class="alfa-card-head"><span class="alfa-card-title">Target (Best ROI) <span class="alfa-caret">▼</span></span><span id="adv-next-roi" class="alfa-card-roi">--%</span></div>
                <div class="alfa-card-body">
                    <div id="adv-next-name" class="alfa-stock-name">--</div>
                    <div id="adv-next-cost" class="alfa-stock-cost">Cost: --</div>
                    <div id="adv-next-gain" class="alfa-stock-gain">Gain: --</div>
                    <div id="adv-target-details" class="alfa-card-details"></div>
                </div>
            </div>
            <div class="alfa-card" id="adv-card-afford" style="border-color: #609b9b;">
                <div class="alfa-card-head"><span class="alfa-card-title" style="color:#609b9b;">Best Affordable <span class="alfa-caret">▼</span></span><span id="adv-afford-roi" class="alfa-card-roi">--%</span></div>
                <div class="alfa-card-body">
                    <div id="adv-afford-name" class="alfa-stock-name">--</div>
                    <div id="adv-afford-cost" class="alfa-stock-cost">Cost: --</div>
                    <div id="adv-afford-gain" class="alfa-stock-gain">Gain: --</div>
                    <div id="adv-afford-details" class="alfa-card-details"></div>
                </div>
            </div>
        </div>
        <div class="alfa-actions"><button id="adv-btn-items" class="alfa-btn-main">Set Item Values</button><button id="adv-btn-networth" class="alfa-btn-main">Networth Settings</button></div>
        <div id="adv-debug-log" style="text-align:center; font-size:15px; color:#609b9b; margin-top:-10px;"></div>
    </div>`;
    createModal("Financial Advisor", html);
    $("#adv-btn-items").on("click", openItemSettings);
    $("#adv-btn-networth").on("click", openNetworthSettings);
    $("#adv-card-target .alfa-card-head").on("click", function() { $("#adv-target-details").slideToggle(150); $(this).find(".alfa-caret").toggleClass("rotated"); });
    $("#adv-card-afford .alfa-card-head").on("click", function() { $("#adv-afford-details").slideToggle(150); });
    $("#adv-hero-trigger").on("click", function() { $("#adv-income-breakdown").slideToggle(200); $(this).toggleClass("alfa-expanded"); });

    // SMART BUTTON LISTENERS (Updated for Shares)
    $("body").off("click", ".alfa-action-sell").on("click", ".alfa-action-sell", function(e) {
        e.stopPropagation();
        let sym = $(this).data("sym");
        let shares = parseInt($(this).data("shares"));
        sellSmart(sym, shares);
    });
    $("body").off("click", ".alfa-action-buy").on("click", ".alfa-action-buy", function(e) {
        e.stopPropagation();
        let sym = $(this).data("sym");
        let shares = parseInt($(this).data("shares"));
        buySmart(sym, shares);
    });

    runAdvisorLogic(false); // Default: API Sync ON
}

// --- ADVISOR LOGIC ---
function getDailyYield(sym) {
    let b = ADVISOR_DATA[sym]; if (!b) return 0;
    let val = 0;
    if (b.type === "cash") val = b.val;
    else if (b.type === "item") val = itemPrices[b.id] || 0;
    else if (b.type === "manual") val = itemPrices["HRG_AVG"] || 0;
    else if (b.type === "average") { let t=0,c=0; for (let cid of b.ids) { let p=itemPrices[cid]||0; if(p>0){t+=p;c++;} } val=c>0?t/c:0; }
    return (val > 0 && b.freq) ? val / b.freq : 0;
}

async function getLiquidNetworth(fastMode = false) {
    // If fast mode is requested and we have data, return it immediately (skips slow API)
    if (fastMode && lastNwCache) return lastNwCache;

    let key = localStorage.getItem("alfa_vault_apikey");
    if (!key) return { liquid: 0, pureCash: 0, dailyBank: 0, bankActive: false, bankPrincipal: 0 };

    try {
        const res = await fetch(`https://api.torn.com/v2/user/money?key=${key}`);
        const data = await res.json();

        if (!data.money) return lastNwCache || { liquid: 0, pureCash: 0, dailyBank: 0, bankActive: false, bankPrincipal: 0 };

        let m = data.money, dailyBank=0, bankActive=false, bankPrincipal=0;
        if (m.city_bank && m.city_bank.amount>0) {
            bankPrincipal=m.city_bank.amount;
            if (m.city_bank.profit>0 && m.city_bank.duration>0) dailyBank=m.city_bank.profit/m.city_bank.duration;
            bankActive=true;
        }

        let pureCash = m.wallet || 0;
        if (networthSettings.sources.points && m.points>0) pureCash += (m.points * (itemPrices["points"]||45000));

        // Save to cache
        lastNwCache = { liquid: 0, pureCash: pureCash, dailyBank: dailyBank, bankActive: bankActive, bankPrincipal: bankPrincipal };

        // Calculate Liquid Total (This logic is usually done in Advisor, but we store the base here)
        // Note: The specific stock calculation happens in runAdvisorLogic, so 'liquid' here is just a placeholder or base

        return lastNwCache;
    } catch (e) {
        console.error("NW Error", e);
        return lastNwCache || { liquid: 0, pureCash: 0, dailyBank: 0, bankActive: false, bankPrincipal: 0 };
    }
}

async function runAdvisorLogic(skipApiSync = false) {
    if(!skipApiSync) $("#adv-debug-log").text("Syncing Portfolio...");
    $("#adv-daily-income").text("...");
    try {
        if(!skipApiSync) await fetchUserPortfolio();
        let nwData = await getLiquidNetworth(skipApiSync);
        let liquidCash = nwData.liquid; let pureCash = nwData.pureCash; let dailyBank = nwData.dailyBank; let bankPrincipal = nwData.bankPrincipal;
        let currentDailyIncome = 0; let liquidAssets = []; let ownedBlocks = []; let candidates = []; let symbols = Object.keys(STOCK_DATA);

        for (let sym of symbols) {
            let stockData = STOCK_DATA[sym]; let sharePrice = getPrice(sym); if (sharePrice === 0) continue;
            let owned = getOwnedShares(sym); let increment = stockData.base; let dailyYield = getDailyYield(sym);
            let currentLevel = (owned > 0) ? Math.floor(Math.log2((owned / increment) + 1)) : 0;
            let sharesForNextBlock = increment * Math.pow(2, currentLevel);
            let marginalBlockCost = sharesForNextBlock * sharePrice;
            let marginalRoi = (marginalBlockCost > 0) ? ((dailyYield * 365) / marginalBlockCost) * 100 : 0;
            let currentTotalValue = owned * sharePrice;
            let currentYieldTotal = (currentLevel * dailyYield);
            let currentRoi = (currentTotalValue > 0) ? ((currentYieldTotal * 365) / currentTotalValue) * 100 : 0;

            // --- LIQUIDITY TRACKING ---
            if (owned > 0) {
                let lockedShares = 0;
                if(currentLevel > 0) {
                    if(stockData.type === "P") lockedShares = increment;
                    else lockedShares = increment * (Math.pow(2, currentLevel) - 1);
                }

                let looseShares = Math.max(0, owned - lockedShares);
                let looseVal = looseShares * sharePrice;
                let lockedVal = lockedShares * sharePrice;

                // 1. Loose Shares (0% ROI - Always Liquid)
                if (looseVal > 0) {
                    liquidAssets.push({ name: sym, sym: sym, val: looseVal, price: sharePrice, currentRoi: 0 });
                }
                // 2. Locked Blocks (Real ROI - Liquid only if Target is better)
                if (lockedVal > 0) {
                    liquidAssets.push({ name: sym + " (Block)", sym: sym, val: lockedVal, price: sharePrice, currentRoi: currentRoi, isBlock: true });
                }
            }

            // Owned Blocks Tracking
            if (currentYieldTotal > 0) {
                currentDailyIncome += currentYieldTotal;
                ownedBlocks.push({ name: sym, tier: currentLevel, totalIncome: currentYieldTotal, invested: currentTotalValue, currentRoi: currentRoi });
            }

            // Candidates (FIXED LOGIC)
            let benefitData = ADVISOR_DATA[sym];
            if (benefitData && benefitData.type !== "passive") {
                let candName = sym; let targetTotalShares = 0;

                // Determine Target
                if (owned >= increment) {
                    // Targeting Tier 2, 3, etc.
                    targetTotalShares = increment * (Math.pow(2, currentLevel + 1) - 1);
                    candName = sym + ` (Tier ${currentLevel+1})`;
                } else {
                    // Targeting Tier 1 (Base)
                    targetTotalShares = increment;
                    candName = sym;
                }

                // Calculate COST based on what is MISSING
                let sharesNeeded = Math.max(0, targetTotalShares - owned);
                let costToUpgrade = sharesNeeded * sharePrice;

                candidates.push({
                    name: candName,
                    sym: sym,
                    roi: marginalRoi,
                    cost: costToUpgrade,
                    sharesNeeded: sharesNeeded,
                    dailyYield: dailyYield,
                    totalVal: targetTotalShares * sharePrice
                });
            }
        }

        // Logic
        let floorROI = 0; if (ownedBlocks.length > 0) floorROI = Math.min(...ownedBlocks.map(b => b.currentRoi));
        let validCandidates = candidates.filter(c => c.roi > floorROI); validCandidates.sort((a, b) => b.roi - a.roi);

        let totalDaily = currentDailyIncome + dailyBank;
        $("#adv-daily-income").text(formatMoney(Math.floor(totalDaily)) + " / day");
        $("#adv-daily-detail").text(`Stocks: ${formatMoney(Math.floor(currentDailyIncome))} | Bank: ${formatMoney(Math.floor(dailyBank))}`);
        $("#adv-debug-log").html(`Free Cash: ${formatMoney(pureCash)}<br><span style='color:#fff; font-size:12px;/span>`);

        function calculateLiquidity(target) {
            let owned = getOwnedShares(target.sym);
            let price = getPrice(target.sym);
            let alreadyOwnedValue = owned * price;
            let goal = target.totalVal;

            let startingAssets = pureCash + alreadyOwnedValue;
            let gap = goal - startingAssets;

            let available = pureCash;
            let sources = [];
            let totalLiquid = pureCash;

            liquidAssets.sort((a,b) => a.currentRoi - b.currentRoi);

            for (let asset of liquidAssets) {
                if (asset.sym === target.sym) continue;

                totalLiquid += asset.val;

                if (gap > 0 && asset.currentRoi < target.roi) {
                    gap -= asset.val;
                    available += asset.val;
                    sources.push(asset);
                }
            }

            let totalResources = pureCash + alreadyOwnedValue + sources.reduce((acc, s) => acc + s.val, 0);
            let finalMissing = Math.max(0, goal - totalResources);

            return { available: available, missing: finalMissing, sources, totalLiquid };
        }

        function buildLiquidityHtml(target, plan) {
            let html = `<div class="alfa-detail-row"><span>Target Price:</span> <span>${formatMoney(target.totalVal)}</span></div>`;

            let owned = getOwnedShares(target.sym);
            let price = getPrice(target.sym);
            let ownedVal = owned * price;
            if (owned > 0) {
                 html += `<div class="alfa-detail-row alfa-detail-sub"><span>- Already Owned</span> <span>${formatMoney(ownedVal)}</span></div>`;
            }

            if (pureCash > 0) html += `<div class="alfa-detail-row alfa-detail-sub"><span>- Free Cash</span> <span>${formatMoney(pureCash)}</span></div>`;

            if (plan.sources.length > 0) {
                 let gap = target.totalVal - (pureCash + ownedVal);
                 for (let src of plan.sources) {
                    let sellVal = (gap > 0) ? Math.min(src.val, gap) : 0;
                    if (sellVal <= 0) continue;

                    gap -= sellVal;
                    let sellShares = Math.ceil(sellVal / src.price);

                    html += `<div class="alfa-detail-row alfa-detail-sub" style="align-items:center;">
                        <span style="display:flex; flex-direction:column; line-height:1.2;">
                            <span>- Sell ${src.name}</span>
                            <span style="font-size:9px; color:#555;">(Avail: ${formatMoney(src.val)})</span>
                        </span>
                        <button class="alfa-mini-btn alfa-action-sell" data-sym="${src.sym}" data-shares="${sellShares}">Sell ~${formatMoney(sellVal)}</button>
                    </div>`;
                }
            }

            if (plan.missing > 0) {
                 html += `<div class="alfa-detail-row alfa-detail-miss"><span>Still Missing:</span> <span>${formatMoney(plan.missing)}</span></div>`;
            } else {
                 html += `<div class="alfa-detail-row alfa-detail-total"><span>Ready to Buy</span></div>`;
            }

            if (pureCash > 0) {
                 html += `<button class="alfa-invest-btn alfa-action-buy" data-sym="${target.sym}" data-shares="${target.sharesNeeded}">Invest Now</button>`;
            }

            return html;
        }

        // Box 1: Target
        let nextBest = null;
        if (validCandidates.length > 0) {
            nextBest = validCandidates[0];
            $("#adv-next-roi").text(nextBest.roi.toFixed(2) + "%"); $("#adv-next-name").text(nextBest.name);
            let targetLiq = calculateLiquidity(nextBest);
            $("#adv-target-details").html(buildLiquidityHtml(nextBest, targetLiq));
            if (targetLiq.missing <= 0) {
                if (targetLiq.sources.length === 0) { $("#adv-next-cost").text(formatMoney(nextBest.cost)); $("#adv-next-gain").text("Buy with Cash"); }
                else { $("#adv-next-cost").text("Sell " + targetLiq.sources.length + " lower ROI"); $("#adv-next-gain").text("to buy this"); }
            } else {
                $("#adv-next-cost").html(`<span class="alfa-shortage">Missing ${formatMoney(targetLiq.missing)}</span>`);
                $("#adv-next-gain").text(`Cost: ${formatMoney(nextBest.cost)}`);
            }
        } else { $("#adv-next-name").text("Maxed Out!"); $("#adv-target-details").html(""); }

        // Box 2: Best Affordable / Parking
        let bestOption = null; let bestOptionLiq = null;
        let totalLiquidPower = pureCash + liquidAssets.reduce((acc, asset) => acc + asset.val, 0);

        let affordableCandidates = validCandidates.filter(c => {
            let selfLiquidity = liquidAssets.filter(a => a.sym === c.sym).reduce((acc, a) => acc + a.val, 0);
            return c.cost <= (totalLiquidPower - selfLiquidity);
        });

        affordableCandidates.sort((a, b) => b.roi - a.roi);

        if (affordableCandidates.length > 0) {
            bestOption = affordableCandidates[0];
            bestOptionLiq = calculateLiquidity(bestOption);
        } else {
            let cheapCandidates = candidates.filter(c => {
                let selfLiquidity = liquidAssets.filter(a => a.sym === c.sym).reduce((acc, a) => acc + a.val, 0);
                return c.cost <= (totalLiquidPower - selfLiquidity);
            });
            cheapCandidates.sort((a, b) => b.roi - a.roi);
             if (cheapCandidates.length > 0) {
                bestOption = cheapCandidates[0];
                bestOptionLiq = calculateLiquidity(bestOption);
             }
        }

        if (bestOption) {
            let color = "#609b9b"; if (nextBest && bestOption.roi < nextBest.roi) color = "#eebb44";
            $("#adv-afford-roi").text(bestOption.roi.toFixed(2) + "%").css("color", color);
            $("#adv-afford-name").text(bestOption.name);
            let rawGap = bestOption.cost - pureCash;
            if (bestOptionLiq.missing > 0) $("#adv-afford-cost").html(`<span class="alfa-shortage">Missing: ${formatMoney(bestOptionLiq.missing)}</span>`);
            else if (rawGap > 0) $("#adv-afford-cost").text("Sell " + bestOptionLiq.sources.length + " items");
            else $("#adv-afford-cost").text("Ready to Buy").css("color", "#8bc34a");

            $("#adv-afford-gain").text("Cost: " + formatMoney(bestOption.totalVal));

            let html = buildLiquidityHtml(bestOption, bestOptionLiq);
            if (color === "#eebb44") html += `<div style="margin-top:5px; font-style:italic; color:#888;">ROI better than wallet (0%).</div>`;
            $("#adv-afford-details").html(html);
        } else { $("#adv-afford-name").text("Portfolio Optimized"); $("#adv-afford-roi").text("-"); $("#adv-afford-cost").text("-"); $("#adv-afford-gain").text("-"); }

        // Breakdown (Unchanged)
        let breakdownHtml = "";
        if (dailyBank > 0) {
            let bankAnnual = (dailyBank * 365); let bankRoi = (bankPrincipal > 0) ? (bankAnnual / bankPrincipal) * 100 : 0;
            breakdownHtml += `<div class="alfa-break-row"><div style="display:flex; justify-content:space-between; width:100%;"><span>City Bank Investment</span><span class="alfa-break-val">${formatMoney(Math.floor(dailyBank))}</span></div><div style="display:flex; justify-content:space-between; width:100%; font-size:10px; color:#888; margin-top:2px;"><span>Val: ${formatMoney(bankPrincipal)}</span><span>ROI: ${bankRoi.toFixed(2)}%</span></div></div>`;
        }
        ownedBlocks.sort((a,b) => b.totalIncome - a.totalIncome);
        for (let block of ownedBlocks) {
            breakdownHtml += `<div class="alfa-break-row"><div style="display:flex; justify-content:space-between; width:100%;"><span>${block.name} <span style="color:#666; font-size:10px;">(Tier ${block.tier})</span></span><span class="alfa-break-val">${formatMoney(Math.floor(block.totalIncome))}</span></div><div style="display:flex; justify-content:space-between; width:100%; font-size:10px; color:#888; margin-top:2px;"><span>Val: ${formatMoney(block.invested)}</span><span>ROI: ${block.currentRoi.toFixed(2)}%</span></div></div>`;
        }
        if (breakdownHtml === "") breakdownHtml = "<div style='text-align:center; padding:10px; color:#666;'>No active passive income</div>";
        $("#adv-income-breakdown").html(breakdownHtml);
    } catch (e) { console.error("Advisor Crash:", e); }
}

async function fetchUserPortfolio() {
    let key = localStorage.getItem("alfa_vault_apikey"); if (!key) return;
    $("#adv-debug-log").text("Syncing Portfolio...");
    try {
        const res = await fetch(`https://api.torn.com/user/?selections=stocks&key=${key}&ts=${Date.now()}`);
        const data = await res.json();
        if (data.stocks) {
            let idToSym = {};
            for (let [sym, domId] of Object.entries(stockId)) { idToSym[domId.replace("stock_", "")] = sym; }
            for (let [sID, sData] of Object.entries(data.stocks)) { let sym = idToSym[sID]; if (sym) localShareCache[sym] = sData.total_shares || 0; }

            // REFRESH FIX: Overwrite API data with HTML data (Screen is always correct)
            // This fixes the issue where API returns old data after a refresh
            for (let sym of Object.keys(stockRows)) {
                let onScreen = getOwnedShares(sym);
                if (onScreen > 0 || localShareCache[sym] !== onScreen) {
                    // Trust the screen if it shows data
                    localShareCache[sym] = onScreen;
                }
            }

            $("#adv-debug-log").text("Portfolio Synced.");
        }
    } catch (e) { console.error("Portfolio Sync Error", e); }
}

// --- SMART TRADING (SHARE BASED) ---
async function sellSmart(sym, shares) {
    let price = getPrice(sym);
    if (price <= 0) { alert("Price error."); return; }

    let confirmMsg = "";
    // Check for benefit lock
    if ($("#alfa-lock-toggle").is(":checked")) {
        let owned = getOwnedShares(sym);
        let future = getBenefitTier(sym, owned - shares);
        let current = getBenefitTier(sym, owned);
        if (future.tier < current.tier) {
            confirmMsg = `WARNING: Selling this will drop your Benefit Tier!\n\n`;
        }
    }

    let totalCash = formatMoney(shares * price);
    confirmMsg += `Sell ${shares.toLocaleString()} shares of ${sym} for approx ${totalCash}?`;

    if(confirm(confirmMsg)) {
        await postTrade(sym, shares, "sellShares", `Sold`);
        setTimeout(() => runAdvisorLogic(true), 1000);
    }
}

async function buySmart(sym, targetShares) {
    let money = await syncWallet(true);
    let price = getPrice(sym);
    if (price <= 0) { alert("Price error."); return; }

    // Calculate max we can actually afford
    let maxAffordable = Math.floor(money / price);
    let sharesToBuy = Math.min(maxAffordable, targetShares);

    if (sharesToBuy <= 0) { alert("Not enough cash!"); return; }

    let totalCost = formatMoney(sharesToBuy * price);
    if(confirm(`Invest ${totalCost} to buy ${sharesToBuy.toLocaleString()} shares of ${sym}?`)) {
        await postTrade(sym, sharesToBuy, "buyShares", `Invested`);
        setTimeout(() => runAdvisorLogic(true), 1000);
    }
}

// --- STANDARD VAULT FUNCTIONS ---
async function vault() {
    let symb = localStorage.alfa_vault_target; if(!symb) { alert("Select a stock first!"); return; }
    let money = ($("#alfa-use-api").is(":checked")) ? await syncWallet(false) : getMoneyFast();
    if (money === 0 && !$("#alfa-use-api").is(":checked")) money = await syncWallet(false);
    if (money === 0) return;
    let price = getPrice(symb); let amt = Math.floor(money / price);
    postTrade(symb, amt, "buyShares", `Vaulted ${formatMoney(amt*price)}`);
}

async function vaultExcept() {
    let symb = localStorage.alfa_vault_target; if(!symb) { alert("Select a stock first!"); return; }
    let money = ($("#alfa-use-api").is(":checked")) ? await syncWallet(false) : getMoneyFast();
    if (money === 0 && !$("#alfa-use-api").is(":checked")) money = await syncWallet(false);
    if (money === 0) return;
    let keepAmt = parseTornNumber($("#keepval").val()) || 0;
    let available = money - keepAmt;
    if (available <= 0) { $("#responseStock").html("Not enough money!").css("color", "red"); return; }
    let price = getPrice(symb); let amt = Math.floor(available / price);
    postTrade(symb, amt, "buyShares", `Vaulted ${formatMoney(amt*price)} (Kept ${$("#keepval").val()})`);
}

function withdraw() {
    let symb = localStorage.alfa_vault_target; if(!symb) { alert("Select a stock first!"); return; }
    let val = parseTornNumber($("#sellval").val()); let price = getPrice(symb); let shares = Math.ceil((val / 0.999) / price);
    if ($("#alfa-lock-toggle").is(":checked")) {
        let owned = getOwnedShares(symb);
        if(owned===0 && !confirm("Script reads 0 shares. Continue?")) return;
        let future = getBenefitTier(symb, owned - shares); let current = getBenefitTier(symb, owned);
        if (future.tier < current.tier) { $("#responseStock").html(`Blocked: Need shares for benefit`).css("color", "red"); return; }
    }
    postTrade(symb, shares, "sellShares", `Withdrawn approx ${formatMoney(val)}`);
}

function withdrawAll() {
    let symb = localStorage.alfa_vault_target; if(!symb) { alert("Select a stock first!"); return; }
    let owned = getOwnedShares(symb); if (owned <= 0) { $("#responseStock").html("You have no shares.").css("color", "red"); return; }
    let sellAmt = owned;
    if ($("#alfa-lock-toggle").is(":checked")) {
        let data = STOCK_DATA[symb];
        if (data) {
            let keep = (data.type==="P") ? (owned>=data.base?data.base:0) : (Math.floor(owned/data.base)*data.base);
            sellAmt = owned - keep;
            if (sellAmt <= 0) { $("#responseStock").html(`Locked for benefit.`).css("color", "orange"); return; }
        }
    }
    postTrade(symb, sellAmt, "sellShares", `Sold All Available`);
}

function postTrade(symb, amt, step, msg) {
    $.post(`https://www.torn.com/page.php?sid=StockMarket&step=${step}&rfcv=${getRFC()}`, { stockId: stockId[symb], amount: amt })
    .done(function(r) {
        try { if(typeof r==="string") r=JSON.parse(r);
            if(r.success) {
                $("#responseStock").html(`${msg} (${amt} shares)`).css("color", "green");

                // 1. Update Shares Cache
                updateLocalCache(symb, step==="buyShares"?amt:-amt);

                // 2. Update Money Cache Manually (Fixes "Not Updating" bug)
                if (lastNwCache) {
                    let price = getPrice(symb);
                    let transactionValue = amt * price;
                    if (step === "sellShares") {
                        lastNwCache.pureCash += transactionValue;
                    } else {
                        lastNwCache.pureCash -= transactionValue;
                    }
                }

                // 3. Update Advisor immediately using cached data
                runAdvisorLogic(true);
            }
            else $("#responseStock").html(r.text||"Failed").css("color","red");
        } catch(e){ $("#responseStock").html("Request Sent").css("color","blue"); }
    });
    $("#responseStock").html("Processing...").css("color", "orange");
}

function renderPresets() {
    let presets = JSON.parse(localStorage.getItem("alfa_vault_presets")) || DEFAULT_PRESETS;
    let html = ""; presets.forEach(p => html += `<button class="torn-btn alfa-preset-btn" data-amt="${p}">${p}</button>`);
    $("#alfa-preset-row").html(html);
    $(".alfa-preset-btn").on("click", function(e) { e.preventDefault(); let v = parseTornNumber($(this).attr("data-amt")); $("#sellval").val(v).attr("value",v); localStorage.setItem("alfa_vault_sellVal",v); if($("#alfa-instant-toggle").is(":checked")) withdraw(); });
}
function renderEditMode() {
    let presets = JSON.parse(localStorage.getItem("alfa_vault_presets")) || DEFAULT_PRESETS;
    $("#alfa-preset-row").html(`<div class="alfa-edit-ui"><input type="text" id="alfa-preset-input" class="alfa-input" style="width:100%" value="${presets.join(", ")}"><div class="alfa-edit-actions"><button id="savep" class="alfa-action-btn alfa-save">Save</button><button id="canp" class="alfa-action-btn alfa-cancel">Cancel</button></div></div>`);
    $("#alfa-edit-trigger").hide();
    $("#savep").click(()=>{ localStorage.setItem("alfa_vault_presets", JSON.stringify($("#alfa-preset-input").val().split(",").map(s=>s.trim()).filter(s=>s))); renderPresets(); $("#alfa-edit-trigger").show(); });
    $("#canp").click(()=>{ renderPresets(); $("#alfa-edit-trigger").show(); });
}
function openItemSettings() {
    let rows = `<tr><td style="color:#8bc34a">Points</td><td><input id="item-input-points" class="alfa-tbl-input" value="${(itemPrices["points"]||0).toLocaleString()}"></td></tr>`;
    rows += `<tr><td style="color:#609b9b">HRG Avg</td><td><input id="item-input-HRG_AVG" class="alfa-tbl-input" value="${(itemPrices["HRG_AVG"]||0).toLocaleString()}"></td></tr>`;
    for(let [id,n] of Object.entries(ADVISOR_ITEMS)) rows+=`<tr><td>${n}</td><td><input class="alfa-tbl-input item-price-input" data-id="${id}" value="${(itemPrices[id]||0).toLocaleString()}"></td></tr>`;
    createModal("Item Values", `<button id="adv-fetch-api" class="alfa-btn-main" style="width:100%; margin-bottom:10px;">Fetch Prices (API)</button><div style="height:300px; overflow-y:auto"><table class="alfa-table">${rows}</table></div><button id="adv-save-items" class="alfa-btn-main" style="width:100%; margin-top:10px;">Save</button><div id="adv-fetch-status" style="text-align:center; font-size:10px; margin-top:5px;"></div>`);
    $("#adv-save-items").click(()=>{
        itemPrices["points"]=parseTornNumber($("#item-input-points").val()); itemPrices["HRG_AVG"]=parseTornNumber($("#item-input-HRG_AVG").val());
        $(".item-price-input").each(function(){ itemPrices[$(this).data("id")]=parseTornNumber($(this).val()); });
        localStorage.setItem("alfa_advisor_prices", JSON.stringify(itemPrices)); $("#alfa-modal-overlay").remove(); openAdvisorMain();
    });
    $("#adv-fetch-api").click(fetchMarketPrices);
}
async function fetchMarketPrices() {
    let key = localStorage.getItem("alfa_vault_apikey"); if(!key) return;
    $("#adv-fetch-status").text("Fetching...");
    try {
        let r = await fetch(`https://api.torn.com/market/?selections=pointsmarket&key=${key}`); let d = await r.json();
        if(d.pointsmarket) { let v = Object.values(d.pointsmarket).sort((a,b)=>a.cost-b.cost)[0].cost; $("#item-input-points").val(v.toLocaleString()); }
        for(let id of Object.keys(ADVISOR_ITEMS)) {
            let r2=await fetch(`https://api.torn.com/v2/torn/${id}/items?sort=ASC&key=${key}`); let d2=await r2.json();
            let p=0; if(d2.value) p=d2.value.market_price; else if(d2.items && d2.items[0]) p=d2.items[0].value.market_price;
            if(p>0) $(`.item-price-input[data-id="${id}"]`).val(p.toLocaleString());
            await new Promise(r=>setTimeout(r,100));
        }
        $("#adv-fetch-status").text("Done!");
    } catch(e) { $("#adv-fetch-status").text("Error"); }
}



async function fetchBankRates() {
    let key = localStorage.getItem("alfa_vault_apikey");
    if (!key) { alert("API Key missing"); return; }

    $("#adv-fetch-bank").text("Fetching...");

    try {
        // 1. Get Base Rates (Torn v2 - Accurate APRs)
        const resRates = await fetch(`https://api.torn.com/v2/torn?selections=bank&key=${key}`);
        const dataRates = await resRates.json();

        // 2. Get User Perks (User v1 - Array of Strings)
        const resPerks = await fetch(`https://api.torn.com/user/?selections=perks&key=${key}`);
        const dataPerks = await resPerks.json();

        if (dataRates.error) throw new Error(dataRates.error.error);
        if (dataPerks.error) throw new Error(dataPerks.error.error);

        // Helper function to parse strings like "+ 50% bank interest rate"
        const parseInterest = (list) => {
            if (!list || !Array.isArray(list)) return 0;
            let bonus = 0;
            list.forEach(str => {
                if (str.toLowerCase().includes("bank interest")) {
                    let match = str.match(/(\d+(?:\.\d+)?)%/);
                    if (match) bonus += parseFloat(match[1]);
                }
            });
            return bonus;
        };

        // --- Calculate Bonuses ---
        let totalBonus = 0;

        // Sum up all perks
        totalBonus += parseInterest(dataPerks.merit_perks);
        totalBonus += parseInterest(dataPerks.faction_perks);
        totalBonus += parseInterest(dataPerks.job_perks);
        totalBonus += parseInterest(dataPerks.property_perks);
        totalBonus += parseInterest(dataPerks.stock_perks);
        totalBonus += parseInterest(dataPerks.education_perks);
        totalBonus += parseInterest(dataPerks.book_perks);

        // Calculate Multiplier (e.g. 1 + 0.50 + 0.10 = 1.6)
        let multi = 1 + (totalBonus / 100);

        // --- Update UI ---
        let bankData = dataRates.bank;
        if(bankData) {
            ["1w", "2w", "1m", "2m", "3m"].forEach(term => {
                if(bankData[term]) {
                    let baseApr = parseFloat(bankData[term]);
                    let finalApr = baseApr * multi;
                    $(`#bank-${term}`).val(finalApr.toFixed(2));
                }
            });
             $("#adv-fetch-bank").text("Updated!");
        } else {
             $("#adv-fetch-bank").text("No Data");
        }

    } catch(e) {
        console.error("Bank Fetch Error:", e);
        $("#adv-fetch-bank").text("Error");
    }
    setTimeout(() => $("#adv-fetch-bank").text("Fetch Rates (API)"), 2000);
}

// --- UPDATED SETTINGS MENU (Merged Blocks) ---
function openNetworthSettings() {
    let s = networthSettings.sources;

    // 1. General Settings (Top Left)
    let generalHtml = `
    <div class="alfa-card">
        <div class="alfa-card-head"><span class="alfa-card-title">General Settings</span></div>
        <div style="padding:10px; display:flex; flex-direction:column; gap:10px;">

            <div>
                <div style="font-size:10px; color:#888; margin-bottom:5px; text-transform:uppercase; font-weight:bold;">Networth Sources</div>
                <div style="display:flex; gap:10px;">
                    <label style="font-size:11px; cursor:pointer;"><input type="checkbox" id="nw-src-inv" ${s.inventory?"checked":""}> Inv</label>
                    <label style="font-size:11px; cursor:pointer;"><input type="checkbox" id="nw-src-pts" ${s.points?"checked":""}> Points</label>
                    <label style="font-size:11px; cursor:pointer;"><input type="checkbox" id="nw-src-stocks" ${s.stocks?"checked":""}> Stocks</label>
                </div>
            </div>

            <div style="border-top:1px dashed #444; margin:5px 0;"></div>

            <div>
                <div style="font-size:10px; color:#888; margin-bottom:5px; text-transform:uppercase; font-weight:bold;">Stock Value Logic</div>
                <select id="nw-exclude-mode" class="alfa-select" style="width:100%; margin-bottom:5px;">
                    <option value="all" ${networthSettings.excludeMode==="all"?"selected":""}>Count Entire Value</option>
                    <option value="active" ${networthSettings.excludeMode==="active"?"selected":""}>Exclude Active Blocks</option>
                </select>
                <div style="font-size:10px; color:#666; line-height:1.2;">
                    "Exclude Active Blocks" removes the value of completed benefit tiers from your liquid networth.
                </div>
            </div>
        </div>
    </div>`;

    // 2. Bank ROI Card (Top Right)
    let bankInputs = ["1w","2w","1m","2m","3m"].map(t =>
        `<div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:11px; color:#aaa; font-weight:bold; width:25px;">${t}</span>
            <input id="bank-${t}" class="alfa-tbl-input" style="width:60px;" value="${bankSettings["roi_"+t]||0}">
         </div>`
    ).join("");

    let bankHtml = `
    <div class="alfa-card">
        <div class="alfa-card-head"><span class="alfa-card-title">Bank ROI % (APR)</span></div>
        <div style="padding:12px;">
            <div style="display:flex; flex-direction:column; gap:6px;">
                ${bankInputs}
            </div>
            <button id="adv-fetch-bank" class="alfa-mini-btn" style="width:100%; margin:12px 0 0 0; padding:6px; border-color:#609b9b; color:#609b9b;">Fetch Rates (API)</button>
        </div>
    </div>`;

    // 3. Excluded Stocks List (Bottom Full Width)
    let excludedHtml = `
    <div class="alfa-card" style="grid-column: span 2;">
        <div class="alfa-card-head"><span class="alfa-card-title">Manually Excluded Stocks</span></div>
        <div class="alfa-check-list" style="height:120px; display:grid; grid-template-columns: repeat(3, 1fr); gap:5px;">
            ${Object.keys(STOCK_DATA).sort().map(sym =>
                `<label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" class="nw-exclude-stock" value="${sym}" ${networthSettings.excludedStocks.includes(sym)?"checked":""}> ${sym}</label>`
            ).join("")}
        </div>
    </div>`;

    let html = `
    <div class="alfa-settings-grid" style="grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
        ${generalHtml}
        ${bankHtml}
        ${excludedHtml}
    </div>
    <button id="adv-save-nw" class="alfa-btn-main" style="width:100%; padding:10px;">Save Configuration</button>`;

    createModal("Networth Settings", html);

    $("#adv-save-nw").click(()=>{
        networthSettings.sources.inventory = $("#nw-src-inv").is(":checked");
        networthSettings.sources.points = $("#nw-src-pts").is(":checked");
        networthSettings.sources.stocks = $("#nw-src-stocks").is(":checked");
        networthSettings.excludeMode = $("#nw-exclude-mode").val();

        let ex = []; $(".nw-exclude-stock:checked").each(function(){ ex.push($(this).val()) });
        networthSettings.excludedStocks = ex;

        ["1w", "2w", "1m", "2m", "3m"].forEach(t => { bankSettings["roi_"+t] = parseFloat($(`#bank-${t}`).val()) || 0; });

        localStorage.setItem("alfa_advisor_networth", JSON.stringify(networthSettings));
        localStorage.setItem("alfa_advisor_bank", JSON.stringify(bankSettings));

        $("#alfa-modal-overlay").remove();
        openAdvisorMain();
    });

    $("#adv-fetch-bank").click(fetchBankRates);
}
insert();

//CSS
const style = `
.alfa-card-head { cursor: pointer; user-select: none; } .alfa-card-head:hover .alfa-card-title { color: #fff; }
.alfa-card-details { display: none; margin-top: 10px; padding-top: 8px; border-top: 1px dashed #444; font-size: 11px; color: #ccc; }
.alfa-detail-row { display: flex; justify-content: space-between; padding: 2px 0; }
.alfa-detail-sub { color: #888; padding-left: 8px; }
.alfa-detail-total { border-top: 1px solid #333; margin-top: 4px; padding-top: 4px; font-weight: bold; color: #8bc34a; }
.alfa-detail-miss { border-top: 1px solid #333; margin-top: 4px; padding-top: 4px; font-weight: bold; color: #ef5350; }
.alfa-hero { cursor: pointer; transition: background 0.2s; background: linear-gradient(135deg, #2a2a2a 0%, #222 100%); border: 1px solid #333; border-radius: 8px; padding: 20px; text-align: center; position: relative; }
.alfa-hero:hover { border-color: #609b9b; }
.alfa-breakdown { display: none; margin-top: 15px; border-top: 1px solid #444; padding-top: 10px; text-align: left; }
.alfa-break-row { display: flex; flex-direction: column; font-size: 11px; padding: 6px 0; border-bottom: 1px solid #222; color: #ccc; }
.alfa-break-row:last-child { border-bottom: none; }
.alfa-break-val { color: #8bc34a; font-weight: bold; }
.alfa-caret { float: right; transition: transform 0.3s; font-size: 10px; color: #666; }
.alfa-expanded .alfa-caret { transform: rotate(180deg); }
.alfa-header { display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 10px; }
.alfa-toolbar { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 5px; font-size: 11px; color: #888; }
.alfa-small-label { display: flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; } .alfa-small-label:hover { color: #fff; }
.alfa-advisor-btn { background: #2a4040; border: 1px solid #609b9b; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; text-decoration: none; }
.alfa-advisor-btn:hover { background: #609b9b; }
.alfa-container { background: #111; padding: 12px; border: 1px solid #333; border-radius: 8px; margin-bottom: 15px; color: #ccc; font-family: Arial, sans-serif; font-size: 12px; }
.alfa-row { margin-bottom: 10px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.alfa-divider { border-top: 1px solid #333; padding-top: 10px; width: 100%; }
.alfa-group { display: flex; gap: 5px; flex-grow: 1; }
.alfa-label { width: 50px; font-weight: bold; color: #999; }
.alfa-input, .alfa-select { background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 4px 8px; height: 28px; box-sizing: border-box; }
.alfa-input { width: 130px; } .alfa-select { width: 150px; } .alfa-input:focus, .alfa-select:focus { border-color: #609b9b; outline: none; }
.alfa-link { cursor: pointer; color: #609b9b; text-decoration: underline; margin-left: auto; } .alfa-link:hover { color: #fff; }
.alfa-preset-row { display: flex; flex-wrap: wrap; gap: 5px; width: 100%; margin-top:5px; }
.alfa-preset-btn { padding: 3px 10px !important; font-size: 11px !important; height: 26px !important; line-height: 18px !important; background: #444 !important; border: 1px solid #555 !important; border-radius: 4px !important; color: #ddd !important; }
.alfa-preset-btn:hover { background: #555 !important; color: #fff !important; }
.alfa-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 99999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
.alfa-modal { background: #1e1e1e; width: 600px; max-width: 95%; border: 1px solid #333; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.9); display: flex; flex-direction: column; overflow: hidden; animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.alfa-modal-header { background: #252525; padding: 15px 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
.alfa-modal-header h3 { margin: 0; font-size: 16px; font-weight: 600; color: #fff; letter-spacing: 0.5px; }
.alfa-modal-close { cursor: pointer; font-size: 24px; color: #666; transition: color 0.2s; } .alfa-modal-close:hover { color: #fff; }
.alfa-modal-body { padding: 20px; color: #ccc; overflow-y: auto; max-height: 80vh; }
.alfa-dashboard { display: flex; flex-direction: column; gap: 20px; }
.alfa-hero-label { font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 5px; }
.alfa-hero-val { font-size: 28px; font-weight: 700; color: #8bc34a; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
.alfa-hero-sub { font-size: 12px; color: #666; margin-top: 5px; }
.alfa-grid-section { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.alfa-card { background: #252525; border: 1px solid #333; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; transition: transform 0.2s; } .alfa-card:hover { border-color: #444; transform: translateY(-2px); }
.alfa-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 8px; }
.alfa-card-title { font-size: 11px; font-weight: bold; color: #aaa; text-transform: uppercase; }
.alfa-card-roi { font-size: 18px; font-weight: bold; color: #609b9b; }
.alfa-card-body { flex-grow: 1; display: flex; flex-direction: column; gap: 4px; }
.alfa-stock-name { font-size: 14px; font-weight: bold; color: #fff; }
.alfa-stock-cost { font-size: 12px; color: #888; }
.alfa-stock-gain { font-size: 12px; color: #8bc34a; margin-top: auto; padding-top: 10px; display: flex; align-items: center; gap: 5px; } .alfa-stock-gain::before { content: "▲"; font-size: 8px; margin-right: 4px; }
.alfa-actions { display: flex; gap: 10px; border-top: 1px solid #333; padding-top: 20px; margin-top: 10px; }
.alfa-btn-main { flex: 1; background: #333; color: #fff; border: 1px solid #444; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.2s; text-align: center; } .alfa-btn-main:hover { background: #444; border-color: #609b9b; }
.alfa-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.alfa-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 12px; }
.alfa-table th { text-align: left; padding: 8px; color: #888; border-bottom: 1px solid #444; }
.alfa-table td { padding: 8px; border-bottom: 1px solid #333; }
.alfa-check-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; max-height: 200px; overflow-y: auto; background: #151515; padding: 10px; border-radius: 6px; border: 1px solid #333; }
.alfa-check-label { display: flex; align-items: center; gap: 8px; color: #ccc; cursor: pointer; font-size: 11px; } .alfa-check-label:hover { color: #fff; }
.alfa-tbl-input { width: 100%; background: #222; border: 1px solid #444; color: #fff; padding: 4px; text-align: right; border-radius: 4px; box-sizing: border-box; }
.alfa-edit-ui { width: 100%; display: flex; flex-direction: column; gap: 5px; }
.alfa-edit-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 5px; }
.alfa-action-btn { padding: 3px 12px !important; font-size: 11px !important; height: 24px !important; border-radius: 4px !important; font-weight: bold !important; background: transparent !important; cursor: pointer; }
.alfa-save { border: 1px solid #609b9b !important; color: #609b9b !important; } .alfa-save:hover { background: #609b9b !important; color: #111 !important; }
.alfa-cancel { border: 1px solid #d32f2f !important; color: #d32f2f !important; } .alfa-cancel:hover { background: #d32f2f !important; color: #fff !important; }
.alfa-shortage { color: #ef5350; font-weight: bold; }
.alfa-main-btn { background: #333; color: #ddd; border: 1px solid #555; border-radius: 4px; padding: 0 15px; height: 28px; font-size: 12px; font-weight: bold; cursor: pointer; transition: all 0.2s; } .alfa-main-btn:hover { background: #444; border-color: #609b9b; color: #fff; }
.alfa-mini-btn { background: transparent; border: 1px solid #ef5350; color: #ef5350; font-size: 9px; padding: 1px 6px; border-radius: 3px; cursor: pointer; margin-left: 8px; text-transform: uppercase; }
.alfa-mini-btn:hover { background: #ef5350; color: #fff; }
.alfa-invest-btn { width: 100%; background: #2a4040; border: 1px solid #609b9b; color: #fff; padding: 6px; margin-top: 8px; font-size: 11px; font-weight: bold; cursor: pointer; border-radius: 4px; }
.alfa-invest-btn:hover { background: #609b9b; }
`;
const styleSheet = document.createElement("style");
styleSheet.textContent = style;
(document.head || document.documentElement).appendChild(styleSheet);