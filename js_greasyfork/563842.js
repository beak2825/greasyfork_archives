// ==UserScript==
// @name         Auction House Weapon Bunker Bucks Max Bid Helper
// @namespace    https://torn.com/
// @version      01.23.2026.12.02
// @description  Shows a global pricing label in the header and a per-item max bid under current bid for Auction House weapons based on Manual BB or Small Arms Cache / 20. Click Max to copy.
// @author       KillerCleat [2842410]
// @match        https://www.torn.com/amarket.php*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563842/Auction%20House%20Weapon%20Bunker%20Bucks%20Max%20Bid%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/563842/Auction%20House%20Weapon%20Bunker%20Bucks%20Max%20Bid%20Helper.meta.js
// ==/UserScript==

/*
NOTES & REQUIREMENTS
Version: 01.23.2026.12.02
Author: KillerCleat [2842410]

Locked:
- Small Arms Cache = 20 BB
- Cache mode BB price = floor(cachePrice / 20)
- Round down to whole dollars (default)

UI:
- Global pricing info is shown once, to the right of the "UPLOAD" buttons:
  (Manual BB) BB: $X
  or
  (Cache/20) BB: $Y
- Per row: only "Max: $Z" is shown under the current bid.
- Max is green if current bid < max, red if current bid >= max.

Copy:
- Click Max copies digits only (example: 57998990)
- Shift + Click Max copies formatted (example: $57,998,990)

Safety:
- No auto bidding, no clicks, no API calls.
- Updates only when tab is visible and focused.
- Event-driven updates only.

Formatting:
- Never use more than 2 consecutive spaces in this script.
*/

(function () {
  "use strict";

  const LS_BB = "bunkerBuckPrice";
  const LS_MODE = "kc_bb_pricingMode";
  const LS_SAC = "kc_smallArmsCachePrice";
  const SAC_TO_BB = 20;

  const UI_CLASS_MAX = "kc-bb-maxbid";
  const UI_CLASS_HEADER = "kc-bb-headerpricing";

  const bunkerBucks = {
    "Pistol": ["4", "12", "18", "36", "54"],
    "SMG": ["4", "12", "18", "36", "54"],
    "Clubbing": ["6", "18", "27", "54", "81"],
    "Piercing": ["6", "18", "27", "54", "81"],
    "Slashing": ["6", "18", "27", "54", "81"],
    "Shotgun": ["10", "30", "45", "90", "135"],
    "Rifle": ["10", "30", "45", "90", "135"],
    "Machine Gun": ["14", "42", "63", "126", "189"],
    "Heavy Artillery": ["14", "42", "63", "126", "189"]
  };

  const weapons = {
    "9mm Uzi": "SMG",
        "AK-47": "Rifle",
        "AK74U": "SMG",
        "ArmaLite M-15A4": "Rifle",
        "Benelli M1 Tactical": "Shotgun",
        "Benelli M4 Super": "Shotgun",
        "Bushmaster Carbon 15": "SMG",
        "Dual Bushmasters": "SMG",
        "Dual MP5s": "SMG",
        "Dual P90s": "SMG",
        "Dual TMPs": "SMG",
        "Dual Uzis": "SMG",
        "Egg Propelled Launcher": "Heavy Artillery",
        "Enfield SA-80": "Rifle",
        "Gold Plated AK-47": "Rifle",
        "Heckler & Koch SL8": "Rifle",
        "Ithaca 37": "Shotgun",
        "Jackhammer": "Shotgun",
        "M16 A2 Rifle": "Rifle",
        "M249 SAW": "Machine Gun",
        "M4A1 Colt Carbine": "Rifle",
        "Mag 7": "Shotgun",
        "Minigun": "Machine Gun",
        "MP 40": "SMG",
        "MP5 Navy": "SMG",
        "Negev NG-5": "Machine Gun",
        "Neutrilux 2000": "Machine Gun",
        "Nock Gun": "Shotgun",
        "P90": "SMG",
        "PKM": "Machine Gun",
        "Prototype": "Machine Gun",
        "Rheinmetall MG 3": "Machine Gun",
        "Sawed-Off Shotgun": "Shotgun",
        "SIG 550": "Rifle",
        "SIG 552": "Rifle",
        "SKS Carbine": "Rifle",
        "Snow Cannon": "Heavy Artillery",
        "Steyr AUG": "Rifle",
        "Stoner 96": "Machine Gun",
        "Tavor TAR-21": "Rifle",
        "Thompson": "SMG",
        "Vektor CR-21": "Rifle",
        "XM8 Rifle": "Rifle",
        "Type 98 Anti Tank": "Heavy Artillery",
        "Beretta 92FS": "Pistol",
        "Beretta M9": "Pistol",
        "Beretta Pico": "Pistol",
        "Blowgun": "Piercing",
        "Blunderbuss": "Shotgun",
        "BT MP9": "SMG",
        "China Lake": "Heavy Artillery",
        "Cobra Derringer": "Pistol",
        "Crossbow": "Piercing",
        "Desert Eagle": "Pistol",
        "Dual 92G Berettas": "Pistol",
        "Fiveseven": "Pistol",
        "Flamethrower": "Heavy Artillery",
        "Flare Gun": "Pistol",
        "Glock 17": "Pistol",
        "Harpoon": "Piercing",
        "Homemade Pocket Shotgun": "Shotgun",
        "Lorcin 380": "Pistol",
        "Luger": "Pistol",
        "Magnum": "Pistol",
        "Milkor MGL": "Heavy Artillery",
        "MP5k": "SMG",
        "Pink Mac-10": "SMG",
        "Qsz-92": "Pistol",
        "Raven MP25": "Pistol",
        "RPG Launcher": "Heavy Artillery",
        "Ruger 57": "Pistol",
        "S&W M29": "Pistol",
        "S&W Revolver": "Pistol",
        "Skorpion": "SMG",
        "Slingshot": "Clubbing",
        "SMAW Launcher": "Heavy Artillery",
        "Springfield 1911": "Pistol",
        "Taser": "Mechanical",
        "Taurus": "Pistol",
        "TMP": "SMG",
        "Tranquilizer Gun": "Piercing",
        "USP": "Pistol",
        "Axe": "Clubbing",
        "Baseball Bat": "Clubbing",
        "Blood Spattered Sickle": "Slashing",
        "Bone Saw": "Slashing",
        "Bo Staff": "Clubbing",
        "Bread Knife": "Slashing",
        "Bug Swatter": "Slashing",
        "Butterfly Knife": "Piercing",
        "Cattle Prod": "Mechanical",
        "Chain Whip": "Slashing",
        "Chainsaw": "Mechanical",
        "Claymore Sword": "Slashing",
        "Cleaver": "Slashing",
        "Cricket Bat": "Clubbing",
        "Crowbar": "Clubbing",
        "Dagger": "Piercing",
        "Devil's Pitchfork": "Piercing",
        "Diamond Bladed Knife": "Piercing",
        "Diamond Icicle": "Piercing",
        "Dual Axes": "Clubbing",
        "Dual Hammers": "Clubbing",
        "Dual Samurai Swords": "Slashing",
        "Dual Scimitars": "Slashing",
        "Duke's Hammer": "Clubbing",
        "Fine Chisel": "Piercing",
        "Flail": "Clubbing",
        "Frying Pan": "Clubbing",
        "Golden Broomstick": "Clubbing",
        "Golf Club": "Clubbing",
        "Guandao": "Slashing",
        "Hammer": "Clubbing",
        "Handbag": "Clubbing",
        "Ice Pick": "Piercing",
        "Ivory Walking Cane": "Clubbing",
        "Kama": "Slashing",
        "Katana": "Slashing",
        "Kitchen Knife": "Piercing",
        "Knuckle Dusters": "Clubbing",
        "Kodachi": "Slashing",
        "Lead Pipe": "Clubbing",
        "Leather Bullwhip": "Slashing",
        "Macana": "Piercing",
        "Madball": "Clubbing",
        "Mag 7": "Shotgun",
        "Meat Hook": "Piercing",
        "Metal Nunchakus": "Clubbing",
        "Naval Cutlass": "Slashing",
        "Ninja Claws": "Piercing",
        "Pair of High Heels": "Piercing",
        "Pair of Ice Skates": "Slashing",
        "Pen Knife": "Piercing",
        "Penelope": "Clubbing",
        "Petrified Humerus": "Clubbing",
        "Pillow": "Clubbing",
        "Plastic Sword": "Clubbing",
        "Poison Umbrella": "Piercing",
        "Riding Crop": "Slashing",
        "Rusty Sword": "Slashing",
        "Sai": "Piercing",
        "Samurai Sword": "Slashing",
        "Scalpel": "Piercing",
        "Scimitar": "Slashing",
        "Sledgehammer": "Clubbing",
        "Spear": "Piercing",
        "Swiss Army Knife": "Piercing",
        "Twin Tiger Hooks": "Piercing",
        "Wand of Destruction": "Piercing",
        "Wooden Nunchaku": "Clubbing",
        "Metal Nunchaku": "Clubbing",
        "Wushu Double Axes": "Clubbing",
        "Yasukuni Sword": "Slashing"
  };

  function isSafeToRunNow() {
    if (document.visibilityState !== "visible") return false;
    if (!document.hasFocus()) return false;
    return true;
  }

  function normalizeNumberInput(text) {
    const cleaned = String(text || "").replace(/[^0-9]/g, "");
    const n = parseInt(cleaned || "0", 10);
    if (!Number.isFinite(n)) return 0;
    return n;
  }

  function parseMoneyFromText(text) {
    return normalizeNumberInput(text);
  }

  function formatCurrency(value) {
    const n = Number.isFinite(value) ? value : 0;
    return "$" + Math.max(0, Math.floor(n)).toLocaleString();
  }

  function getPricingMode() {
    const raw = String(localStorage.getItem(LS_MODE) || "").toLowerCase();
    if (raw === "sac") return "sac";
    return "manual";
  }

  function setPricingMode(mode) {
    const m = mode === "sac" ? "sac" : "manual";
    localStorage.setItem(LS_MODE, m);
  }

  function readManualBBPrice() {
    return normalizeNumberInput(localStorage.getItem(LS_BB));
  }

  function readSmallArmsCachePrice() {
    return normalizeNumberInput(localStorage.getItem(LS_SAC));
  }

  function getEffectiveBBPrice() {
    const mode = getPricingMode();
    if (mode === "sac") {
      const cachePrice = readSmallArmsCachePrice();
      if (!cachePrice) return 0;
      return Math.floor(cachePrice / SAC_TO_BB);
    }
    return readManualBBPrice();
  }

  function getModeLabelText() {
    const mode = getPricingMode();
    return mode === "sac" ? "(Cache/20)" : "(Manual BB)";
  }

  function getGlobalHeaderText() {
    const bb = getEffectiveBBPrice();
    const modeText = getModeLabelText();
    if (!bb) return modeText + " BB: Not set";
    return modeText + " BB: " + formatCurrency(bb);
  }

  function getUnsetMaxText() {
    const mode = getPricingMode();
    return mode === "sac" ? "Max: Set cache price" : "Max: Set BB price";
  }

  function setManualBBPrice() {
    const current = readManualBBPrice();
    const input = prompt("Enter the Bunker Buck price (manual mode):", String(current || ""));
    const n = normalizeNumberInput(input);
    if (n > 0) {
      localStorage.setItem(LS_BB, String(n));
      alert("Bunker Buck price updated to " + n);
      scheduleUpdate();
      return;
    }
    alert("Invalid price. Please enter a positive number.");
  }

  function setSmallArmsCachePrice() {
    const current = readSmallArmsCachePrice();
    const input = prompt("Enter the Small Arms Cache price (BB = floor(price / 20)):", String(current || ""));
    const n = normalizeNumberInput(input);
    if (n > 0) {
      localStorage.setItem(LS_SAC, String(n));
      alert("Small Arms Cache price updated to " + n);
      scheduleUpdate();
      return;
    }
    alert("Invalid price. Please enter a positive number.");
  }

  function setModeMenu() {
    const mode = getPricingMode();
    const msg =
      "Select Pricing Mode:\n" +
      "1 = Manual Bunker Buck price\n" +
      "2 = Small Arms Cache price / 20\n\n" +
      "Current: " +
      (mode === "sac" ? "2" : "1");
    const input = prompt(msg, mode === "sac" ? "2" : "1");
    const v = String(input || "").trim();
    if (v === "2") {
      setPricingMode("sac");
      alert("Pricing mode set to Small Arms Cache / 20");
      scheduleUpdate();
      return;
    }
    if (v === "1") {
      setPricingMode("manual");
      alert("Pricing mode set to Manual Bunker Buck price");
      scheduleUpdate();
      return;
    }
    alert("No changes made.");
  }

  GM_registerMenuCommand("Set Pricing Mode (Manual or Small Arms Cache)", setModeMenu);
  GM_registerMenuCommand("Set Bunker Buck Price (Manual)", setManualBBPrice);
  GM_registerMenuCommand("Set Small Arms Cache Price (Market)", setSmallArmsCachePrice);

  function getWeaponListRoot() {
    const weaponsTab = document.querySelector("#types-tab-1");
    if (!weaponsTab) return null;
    return weaponsTab.querySelector("ul.items-list");
  }

  function getTierIndexFromRow(row) {
    const wrap = row.querySelector(".item-cont-wrap");
    if (!wrap) return null;

    const cls = wrap.className || "";
    const effectCount = row.querySelectorAll(".iconsbonuses .bonus-attachment-icons").length;

    const isYellow = cls.includes("glow-yellow-style");
    const isOrange = cls.includes("glow-orange-style");
    const isRed = cls.includes("glow-red-style");

    if (isYellow) return 0;
    if (isOrange) return effectCount >= 2 ? 2 : 1;
    if (isRed) return effectCount >= 2 ? 4 : 3;

    return null;
  }

  function computeMaxBid(weaponName, tierIndex) {
    const weaponType = weapons[weaponName];
    if (!weaponType) return null;

    const values = bunkerBucks[weaponType];
    if (!values) return null;

    const bbCount = parseInt(values[tierIndex] || "0", 10);
    if (!Number.isFinite(bbCount) || bbCount <= 0) return null;

    const pricePerBB = getEffectiveBBPrice();
    if (!pricePerBB || pricePerBB <= 0) return 0;

    return bbCount * pricePerBB;
  }

  async function copyToClipboard(text) {
    const val = String(text || "");
    if (!val) return false;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(val);
        return true;
      }
    } catch (e) {
      // Fall through
    }

    try {
      const ta = document.createElement("textarea");
      ta.value = val;
      ta.setAttribute("readonly", "readonly");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return Boolean(ok);
    } catch (e2) {
      return false;
    }
  }

  function bindMaxCopyHandler(maxLine) {
    if (!maxLine || maxLine.dataset.kcCopyBound === "1") return;
    maxLine.dataset.kcCopyBound = "1";

    maxLine.addEventListener("click", async (e) => {
      if (!isSafeToRunNow()) return;

      const raw = String(maxLine.dataset.kcMaxRaw || "");
      const pretty = String(maxLine.dataset.kcMaxPretty || "");
      const canCopy = raw && raw !== "0";
      if (!canCopy) return;

      const toCopy = e.shiftKey ? (pretty || raw) : raw;
      const ok = await copyToClipboard(toCopy);

      const baseText = String(maxLine.dataset.kcBaseText || maxLine.textContent || "");
      maxLine.textContent = ok ? baseText + " (Copied)" : baseText + " (Copy failed)";

      window.setTimeout(() => {
        maxLine.textContent = String(maxLine.dataset.kcBaseText || baseText);
      }, 900);
    });
  }

  function ensureMaxLine(bidCell) {
    let maxLine = bidCell.querySelector("." + UI_CLASS_MAX);
    if (!maxLine) {
      maxLine = document.createElement("div");
      maxLine.className = UI_CLASS_MAX;
      maxLine.style.marginTop = "2px";
      maxLine.style.fontSize = "12px";
      maxLine.style.lineHeight = "1.2";
      maxLine.style.whiteSpace = "nowrap";
      bidCell.appendChild(maxLine);
    }

    bindMaxCopyHandler(maxLine);
    return maxLine;
  }

  function getCurrentBidFromCell(bidCell) {
    if (!bidCell) return 0;

    const nodes = Array.from(bidCell.childNodes || []);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.nodeType !== 3) continue;
      const t = String(n.textContent || "").trim();
      if (!t) continue;
      const m = t.match(/\$[\d,]+/);
      if (m && m[0]) return parseMoneyFromText(m[0]);
    }

    const fallback = String(bidCell.textContent || "");
    const mf = fallback.match(/\$[\d,]+/);
    if (mf && mf[0]) return parseMoneyFromText(mf[0]);

    return 0;
  }

  function setMaxCopyState(maxLine, raw, pretty, enabled, helpText) {
    maxLine.dataset.kcMaxRaw = raw ? String(raw) : "";
    maxLine.dataset.kcMaxPretty = pretty ? String(pretty) : "";
    maxLine.dataset.kcBaseText = String(maxLine.textContent || "");

    if (enabled) {
      maxLine.style.cursor = "pointer";
      maxLine.title = helpText || "Click to copy. Shift + Click copies formatted.";
    } else {
      maxLine.style.cursor = "default";
      maxLine.title = "";
    }
  }

  function updateRow(row) {
    if (!row || row.nodeType !== 1) return;

    const weaponEl = row.querySelector(".item-name");
    if (!weaponEl) return;

    const weaponName = weaponEl.textContent.trim();
    if (!weaponName) return;

    const tierIndex = getTierIndexFromRow(row);
    if (tierIndex === null) return;

    const bidCell = row.querySelector(".c-bid-wrap");
    if (!bidCell) return;

    const maxLine = ensureMaxLine(bidCell);

    const currentBid = getCurrentBidFromCell(bidCell);
    const maxBid = computeMaxBid(weaponName, tierIndex);

    if (maxBid === null) {
      maxLine.textContent = "Max: N/A";
      maxLine.style.color = "#777";
      maxLine.style.fontWeight = "600";
      setMaxCopyState(maxLine, "", "", false, "");
      return;
    }

    if (maxBid === 0) {
      maxLine.textContent = getUnsetMaxText();
      maxLine.style.color = "#777";
      maxLine.style.fontWeight = "600";
      setMaxCopyState(maxLine, "", "", false, "");
      return;
    }

    const atOrOver = currentBid >= maxBid;
    const prettyMoney = formatCurrency(maxBid);
    const rawDigits = String(Math.max(0, Math.floor(maxBid)));

    maxLine.textContent = "Max: " + prettyMoney;
    maxLine.style.color = atOrOver ? "#b00000" : "#0a6b0a";
    maxLine.style.fontWeight = atOrOver ? "700" : "600";

    setMaxCopyState(
      maxLine,
      rawDigits,
      prettyMoney,
      true,
      "Click copies digits. Shift + Click copies formatted."
    );
  }

  function updateAll() {
    if (!isSafeToRunNow()) return;

    upsertHeaderPricingLabel();

    const root = getWeaponListRoot();
    if (!root) return;

    const rows = root.querySelectorAll("li[id]");
    rows.forEach((row) => updateRow(row));
  }

  function findUploadButtonsBar() {
    const buttons = Array.from(document.querySelectorAll("button, a, span")).filter((el) => {
      const t = String(el.textContent || "").trim().toUpperCase();
      return t === "UPLOAD ALL IN CURRENT PAGE" || t === "UPLOAD SELECTED IN CURRENT PAGE";
    });

    if (buttons.length < 1) return null;

    const container = buttons[0].parentElement;
    if (!container) return null;

    return container;
  }

  function upsertHeaderPricingLabel() {
    const bar = findUploadButtonsBar();
    if (!bar) return;

    const barStyle = window.getComputedStyle(bar);
    const isFlex = barStyle.display.includes("flex");

    if (!isFlex) {
      bar.style.display = "flex";
      bar.style.alignItems = "center";
      bar.style.gap = "6px";
      bar.style.flexWrap = "wrap";
    }

    let label = bar.querySelector("." + UI_CLASS_HEADER);
    if (!label) {
      label = document.createElement("div");
      label.className = UI_CLASS_HEADER;
      label.style.marginLeft = "auto";
      label.style.fontSize = "12px";
      label.style.lineHeight = "1.2";
      label.style.whiteSpace = "nowrap";
      label.style.fontWeight = "600";
      label.style.color = "#555";
      bar.appendChild(label);
    }

    label.textContent = getGlobalHeaderText();
  }

  let rafToken = 0;
  function scheduleUpdate() {
    if (!isSafeToRunNow()) return;
    if (rafToken) return;
    rafToken = window.requestAnimationFrame(() => {
      rafToken = 0;
      hookObserversIfNeeded();
      updateAll();
    });
  }

  window.addEventListener("hashchange", scheduleUpdate);
  document.addEventListener("visibilitychange", scheduleUpdate);
  window.addEventListener("focus", scheduleUpdate);

  let currentListRoot = null;
  let listObserver = null;
  const bodyObserver = new MutationObserver(() => {
    scheduleUpdate();
  });

  function startBodyObserver() {
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  }

  function hookObserversIfNeeded() {
    const newRoot = getWeaponListRoot();
    if (!newRoot) {
      currentListRoot = null;
      if (listObserver) {
        listObserver.disconnect();
        listObserver = null;
      }
      return;
    }

    if (currentListRoot === newRoot) return;

    currentListRoot = newRoot;

    if (listObserver) listObserver.disconnect();
    listObserver = new MutationObserver(() => {
      scheduleUpdate();
    });
    listObserver.observe(currentListRoot, { childList: true, subtree: true });
  }

  document.addEventListener("click", (e) => {
    if (!isSafeToRunNow()) return;
    const t = e.target;
    if (!t) return;

    const pager = t.closest && t.closest(".pagination");
    if (!pager) return;

    window.setTimeout(() => {
      scheduleUpdate();
    }, 50);
    window.setTimeout(() => {
      scheduleUpdate();
    }, 250);
  }, true);

  startBodyObserver();
  hookObserversIfNeeded();
  scheduleUpdate();
})();
