// ==UserScript==
// @name         Torn Stock Vault (API)
// @namespace    TheALFA.torn.stocks
// @version      1
// @description  Secure stock vault using the Torn API. Mobile optimized.
// @author       TheALFA [2869953]
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561390/Torn%20Stock%20Vault%20%28API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561390/Torn%20Stock%20Vault%20%28API%29.meta.js
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

let stocks = {};
let stockId = {};
let stockRows = {}; 

// --- UTILITIES ---
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

// --- INITIALIZATION ---
function insert() {
  let current = localStorage.alfa_vault_target;
  let savedKeep = localStorage.getItem("alfa_vault_keepVal") || "";
  let savedSell = localStorage.getItem("alfa_vault_sellVal") || "";
  let savedKey = localStorage.getItem("alfa_vault_apikey") || "";
  let instantOn = localStorage.getItem("alfa_vault_instant") === "true";
  let lockOn = localStorage.getItem("alfa_vault_lock") === "true";

  let symbols = [];
  if ($("ul[class^='stock_']").length == 0) { setTimeout(insert, 500); return; }

  // Scrape Logic
  $("ul[class^='stock_']").each(function() {
    let sym = $("img", $(this)).attr("src").split("logos/")[1].split(".svg")[0];
    symbols.push(sym);
    stockId[sym] = $(this).attr("id");
    stocks[sym] = $("div[class^='price_']", $(this));
    stockRows[sym] = $(this); 
  });
  symbols.sort();

  // HTML UI
  let container = `<div class="alfa-container">
        <div class="alfa-row" style="margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px;">
             <input type="password" id="alfa-apikey" class="alfa-input alfa-long-input" placeholder="Paste API Key Here" value="${savedKey}" style="text-align:center; letter-spacing: 2px;">
        </div>
        <div class="alfa-row">
            <label class="alfa-label">Target:</label>
            <select name="stock" id="stockid" class="alfa-select"><option value="">Select Stock...</option>`;
  for (let sy of symbols) {
    let selected = (current && current == sy) ? "selected='selected'" : "";
    container += `<option value="${sy}" ${selected}>${sy}</option>`;
  }
  container += `</select>
            <span id="alfa-owned-display" style="margin-left:10px; font-size:11px; color:#888;">Owned: -</span>
        </div>
        
        <div class="alfa-row alfa-divider">
            <button id="vaultall" class="torn-btn">Vault Max</button>
            <div class="alfa-group">
                <input type="text" placeholder="Keep Amt" id="keepval" class="alfa-input" value="${savedKeep}">
                <button id="vaultexcept" class="torn-btn">Vault (Keep)</button>
            </div>
        </div>
        
        <div class="alfa-row alfa-divider">
             <div class="alfa-group">
                <input type="text" placeholder="Withdraw Amt" id="sellval" class="alfa-input" value="${savedSell}">
                <button id="sellamt" class="torn-btn">Withdraw</button>
             </div>
        </div>
        
        <div class="alfa-row alfa-presets-container">
             <div class="alfa-controls">
                <label class="alfa-checkbox-label"><input type="checkbox" id="alfa-instant-toggle" ${instantOn ? "checked" : ""}> Instant Withdraw</label>
                <label class="alfa-checkbox-label" title="Prevent withdrawal if it breaks passive benefit"><input type="checkbox" id="alfa-lock-toggle" ${lockOn ? "checked" : ""}> Lock Benefits</label>
                <span id="alfa-edit-trigger" class="alfa-link">Edit Buttons</span>
             </div>
             <div id="alfa-preset-row" class="alfa-preset-row"></div>
        </div>
        <div class="alfa-row"><span id="responseStock"></span></div></div>`;

  $("#stockmarketroot").prepend(container);
  
  // Listeners
  $("#stockid").change(updateStock);
  $("#vaultall").on("click", vault);
  $("#vaultexcept").on("click", vaultExcept);
  $("#sellamt").on("click", () => withdraw());
  $("#sellval").on("keyup", function() { handleInputUpdate(this, "alfa_vault_sellVal"); });
  $("#keepval").on("keyup", function() { handleInputUpdate(this, "alfa_vault_keepVal"); });
  $("#alfa-apikey").on("keyup change", function() { localStorage.setItem("alfa_vault_apikey", $(this).val().trim()); });
  $("#alfa-instant-toggle").on("change", function() { localStorage.setItem("alfa_vault_instant", $(this).is(":checked")); });
  $("#alfa-lock-toggle").on("change", function() { localStorage.setItem("alfa_vault_lock", $(this).is(":checked")); });
  $("#alfa-edit-trigger").on("click", renderEditMode);
  
  renderPresets();
  updateStock(); // Initial check
}

// --- PRESETS ---
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

// --- NEW SHARE FINDER LOGIC ---
function getOwnedShares(id) {
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
        
        // CLEAN DISPLAY: Just the number
        let displayHtml = `Owned: <strong style="color:#fff">${owned.toLocaleString()}</strong>`;
        
        $("#alfa-owned-display").html(displayHtml);
        
        if(owned === 0) $("#alfa-owned-display").css("color", "#666");
        else $("#alfa-owned-display").css("color", "#609b9b");
    } else { 
        $("#alfa-owned-display").text("Owned: -"); 
    }
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

async function vault() {
  let symb = localStorage.alfa_vault_target;
  if(!symb) { alert("Select a stock first!"); return; }
  let money = await getMoneyFromAPI();
  if (money === 0) return;
  let price = getPrice(symb);
  let amt = Math.floor(money / price);
  let totalCost = amt * price;
  postTrade(symb, amt, "buyShares", `Vaulted ${formatMoney(totalCost)}`);
}

async function vaultExcept() {
    let symb = localStorage.alfa_vault_target;
    if(!symb) { alert("Select a stock first!"); return; }
    let money = await getMoneyFromAPI();
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
          if (!confirm("WARNING: Script reads 0 shares. The lock might be inaccurate. Continue?")) {
              $("#responseStock").html("Aborted").css("color", "orange");
              return;
          }
      }
      let remaining = currentOwned - sharesToSell;
      let currentTier = getBenefitTier(symb, currentOwned);
      let futureTier = getBenefitTier(symb, remaining);

      // BLOCK logic
      if (futureTier.tier < currentTier.tier) {
          // Calculate the required amount to maintain the tier
          // Current tier multiplier * base = minimum needed
          let data = STOCK_DATA[symb];
          let required = (data.type === "P") ? data.base : (data.base * currentTier.tier);
          
          $("#responseStock").html(`Blocked: Need ${required.toLocaleString()} shares for benefit`).css("color", "red");
          return;
      }
  }
  postTrade(symb, sharesToSell, "sellShares", `Withdrawn approx ${formatMoney(val)}`);
}

function postTrade(symb, amt, step, successMsg) {
    $("#responseStock").html("Processing Trade...").css("color", "orange");
    $.post(`https://www.torn.com/page.php?sid=StockMarket&step=${step}&rfcv=${getRFC()}`, { stockId: stockId[symb], amount: amt },
    function(response) {
       try {
           if(typeof response === "string") response = JSON.parse(response);
           if(response.success) {
               $("#responseStock").html(successMsg + " (" + amt + " shares)").css("color", "green");
               setTimeout(updateStock, 1000); 
           } else { $("#responseStock").html(response.text || "Failed").css("color", "red"); }
       } catch(e) { $("#responseStock").html("Request Sent (Check Trade)").css("color", "blue"); }
    });
}

insert();

// --- CSS ---
const style = `
.alfa-container { background: #111; padding: 12px; border: 1px solid #333; border-radius: 8px; margin-bottom: 15px; color: #ccc; font-family: Arial, sans-serif; font-size: 12px; }
.alfa-row { margin-bottom: 10px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.alfa-divider { border-top: 1px solid #333; padding-top: 10px; }
.alfa-group { display: flex; gap: 5px; flex-grow: 1; }
.alfa-label { width: 50px; font-weight: bold; color: #999; }
.alfa-input, .alfa-select { background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 4px 8px; height: 28px; box-sizing: border-box; }
.alfa-input { width: 130px; }
.alfa-long-input { width: 100%; margin-bottom: 5px; }
.alfa-select { width: 150px; }
.alfa-input:focus, .alfa-select:focus { border-color: #609b9b; outline: none; }
.alfa-controls { display: flex; justify-content: space-between; width: 100%; margin-bottom: 5px; font-size: 11px; }
.alfa-checkbox-label { display: flex; align-items: center; cursor: pointer; color: #999; margin-right: 15px; }
.alfa-checkbox-label input { margin-right: 5px; }
.alfa-link { cursor: pointer; color: #609b9b; text-decoration: underline; margin-left: auto; }
.alfa-link:hover { color: #fff; }
.alfa-presets-container { flex-direction: column; align-items: flex-start; border-top: 1px solid #333; padding-top: 5px; }
.alfa-preset-row { display: flex; flex-wrap: wrap; gap: 5px; width: 100%; }
.alfa-preset-btn { padding: 3px 10px !important; font-size: 11px !important; height: 26px !important; line-height: 18px !important; background: #444 !important; border: 1px solid #555 !important; border-radius: 4px !important; }
.alfa-preset-btn:hover { background: #555 !important; color: #fff !important; }
.alfa-edit-ui { width: 100%; display: flex; flex-direction: column; }
.alfa-edit-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 2px; }
.alfa-action-btn { padding: 3px 12px !important; font-size: 11px !important; height: 24px !important; border-radius: 4px !important; text-shadow: none !important; font-weight: bold !important; background: transparent !important; transition: all 0.2s ease; cursor: pointer; }
.alfa-save { border: 1px solid #609b9b !important; color: #609b9b !important; }
.alfa-save:hover { background: #609b9b !important; color: #111 !important; }
.alfa-cancel { border: 1px solid #d32f2f !important; color: #d32f2f !important; }
.alfa-cancel:hover { background: #d32f2f !important; color: #fff !important; }
#responseStock { font-weight: bold; margin-left: 5px; }
`;
const styleSheet = document.createElement("style");
styleSheet.textContent = style;
(document.head || document.documentElement).appendChild(styleSheet);
