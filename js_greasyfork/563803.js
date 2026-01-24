// ==UserScript==
// @name         Weapon & Armor UID + Trade Helper
// @namespace    https://torn.report/userscripts/
// @version      0.7
// @description  Displays weapon and armor UID, tracks loaned gear.
// @author       Skeletron [318855] & Updated by Hwa
// @match        https://www.torn.com/item.php
// @match        https://www.torn.com/trade.php*
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/563803/Weapon%20%20Armor%20UID%20%2B%20Trade%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/563803/Weapon%20%20Armor%20UID%20%2B%20Trade%20Helper.meta.js
// ==/UserScript==

const STORAGE_KEY = "loanedGearTracker";

const ALLOWED_BONUSES = new Set([
    "Achilles","Assassinate","Backstab","Berserk","Bleed","Blindside","Bloodlust",
    "Comeback","Conserve","Cripple","Crusher","Cupid","Deadeye","Deadly","Disarm",
    "Double-edged","Double Tap","Empower","Eviscerate","Execute","Expose","Finale",
    "Focus","Frenzy","Fury","Grace","Home Run","Irradiate","Motivation","Paralyze",
    "Parry","Penetrate","Plunder","Powerful","Proficience","Puncture","Quicken","Rage",
    "Revitalize","Roshambo","Slow","Smurf","Specialist","Stricken","Stun","Suppress",
    "Sure Shot","Throttle","Warlord","Weaken","Wind-up","Wither","Impregnable",
    "Assault","Impenetrable","Insurmountable","Invulnerable","Imperviable","Sentinel",
    "Immutable","Irrepressible","Impassable"
]);

function loadGear() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
function saveGear(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
let loanedGear = loadGear();

// --------------------------
// LOANED GEAR UI
// --------------------------
function addGearUI() {
    if (document.querySelector("#loaned-gear-controls")) return;

    const wrap = document.createElement("div");
    wrap.id = "loaned-gear-controls";
    wrap.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 250px;
        padding: 10px;
        border: 1px solid #666;
        background: #111;
        color: #ddd;
        z-index: 9999;
        pointer-events: auto;
        font-size: 13px;
    `;

    wrap.innerHTML = `
    <div style="display:flex; align-items:center; justify-content: space-between;">
        <strong>Loaned Gear Tracker</strong>
        <button id="toggle-log"
            style="background-color: #006bad; color: #000; border-radius:5px;">
            Collapse
        </button>
    </div><br/>
    <div id="loaned-gear-content">
        <div style="display:flex; align-items:center; justify-content: space-between;">
            <button id="add-loaned" class="torn-btn">Add Gear</button>
            <button id="clear-loaned" class="torn-btn">Clear Person's Gear</button>
        </div>
        <br/>
        <div style="display:flex; align-items:center; justify-content: space-between;">
            <button id="manual-add" class="torn-btn">Manual Add</button>
            <button id="clear-all" class="torn-btn">Clear All</button>
        </div>
        <pre id="loaned-gear-log" style="white-space:pre-wrap;max-height:150px;overflow:auto;margin-top:5px;background:#000;padding:5px;border:1px solid #333;"></pre>
    </div>
    `;

    document.body.appendChild(wrap);

    // Attach listeners
    document.querySelector("#add-loaned").addEventListener("click", addLoanedFromTrade);
    document.querySelector("#clear-loaned").addEventListener("click", clearLoanedFromTrade);
    document.querySelector("#manual-add").addEventListener("click", manualAddPrompt);
    document.querySelector("#clear-all").addEventListener("click", () => {
        if (!confirm("Are you sure you want to clear ALL loaned gear? This cannot be undone.")) return;

        loanedGear = {};
        saveGear(loanedGear);
        updateLog();
    });

    document.querySelector("#toggle-log").addEventListener("click", () => {
        const content = document.querySelector("#loaned-gear-content");
        const btn = document.querySelector("#toggle-log");
        if (!content || !btn) return;

        if (content.style.display === "none") {
            content.style.display = "block";
            btn.textContent = "Collapse";
        } else {
            content.style.display = "none";
            btn.textContent = "Expand";
        }
    });

    updateLog();
}

function updateLog() {
    const log = document.querySelector("#loaned-gear-log");
    if (!log) return;

    log.innerHTML = Object.entries(loanedGear)
        .map(([username, items]) => {
        if (!Array.isArray(items) || items.length === 0) return `${username}: [no items]`;

        const itemLines = items.map(item => {
            // if we have uid & name (other stats)
            if (item.uid && item.name) return `- ${item.name}: ${item.uid}</span>`;
            // if we have just uid (from manual add)
            if (item.uid) return `- ${item.uid}</span>`;

            // otherwise, if we just have stats from trade
            let stats = [];
            if (item.quality) stats.push(`Q: ${item.quality}`);
            if (item.bonuses && Array.isArray(item.bonuses) && item.bonuses.length > 0) {
                const bonusText = item.bonuses
                .map(b => `Bonus: ${b.bonusName}`)
                .join(", ");
                stats.push(`${bonusText}`);
            }
            if (item.dmg) stats.push(`Dmg: ${item.dmg}`);
            if (item.acc) stats.push(`Acc: ${item.acc}`);
            if (item.armor) stats.push(`Armor: ${item.armor}`);

            return `- ${item.name} <span style="font-size:0.6em;color:#ccc">| ${stats.join(",  ")}</span>`;
        });

        return `<strong>${username}:</strong><br>${itemLines.join("<br>")}`;
    })
        .join("<br><br>") || "No gear tracked.";
}

function addLoanedFromTrade() {
    const parsedData = getTradePartnerData();
    if (!parsedData || !parsedData.username) return;

    const name = parsedData.username;

    if (!loanedGear[name]) loanedGear[name] = [];

    const itemsToAdd = Array.isArray(parsedData.items) ? parsedData.items : [parsedData.items];

    itemsToAdd.forEach(item => {
        // Only add item if at least one bonus is allowed
        const hasAllowedBonus = item.bonuses?.some(b => ALLOWED_BONUSES.has(b.bonusName))
        || (item.bonusName && ALLOWED_BONUSES.has(item.bonusName));
        if (!hasAllowedBonus) return;

        const exists = loanedGear[name].some(i => {
            // Check UID first
            if (i.uid && item.uid) return i.uid === item.uid;

            // Compare other stats and bonuses if UID is missing
            const bonusesMatch = (() => {
                if (i.bonuses && item.bonuses) {
                    if (i.bonuses.length !== item.bonuses.length) return false;
                    return i.bonuses.every((b, idx) =>
                                           b.bonusName === item.bonuses[idx].bonusName &&
                                           b.bonusDesc === item.bonuses[idx].bonusDesc
                                          );
                } else {
                    return i.bonusName === item.bonusName && i.bonusDesc === item.bonusDesc;
                }
            })();

            return (
                i.name === item.name &&
                Number(i.quality || 0) === Number(item.quality || 0) &&
                Number(i.dmg || 0) === Number(item.dmg || 0) &&
                Number(i.acc || 0) === Number(item.acc || 0) &&
                Number(i.armor || 0) === Number(item.armor || 0) &&
                bonusesMatch
            );
        });

        if (!exists) {
            loanedGear[name].push(item);
        }
    });

    saveGear(loanedGear);
    updateLog();
}


function getTradePartnerName() {
    // Look for the trade partner container
    const userRight = document.querySelector(".user.right");
    if (!userRight) return null;

    // The username is the text content of the first child node of .title-black
    const titleDiv = userRight.querySelector(".title-black");
    if (!titleDiv) return null;

    // Only grab the text node, ignoring the "Hide item values" label
    const username = Array.from(titleDiv.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent.trim())
    .join("")
    .trim();

    return username || null;
}

function clearLoanedFromTrade() {
    const partnerName = getTradePartnerName();
    delete loanedGear[partnerName];
    saveGear(loanedGear);
    updateLog();
}

function manualAddPrompt() {
    const name = prompt("Enter player name:");
    if (!name) return;
    const uid = prompt("Enter UID of item:");
    if (!uid) return;
    if (!loanedGear[name]) loanedGear[name] = [];
    loanedGear[name].push({"uid": uid});
    saveGear(loanedGear);
    updateLog();
}

function getTradePartnerData() {
    const userRight = document.querySelector(".user.right");
    if (!userRight) return null;

    const data = {};

    // Username
    const titleDiv = userRight.querySelector(".title-black");
    data.username = titleDiv ? titleDiv.childNodes[0].textContent.split("'")[0].trim() : null;

    // Items
    data.items = [];
    const itemLis = userRight.querySelectorAll("ul.cont > li:not(.empty) ul.desc > li");

    itemLis.forEach(li => {
        const item = {};

        const nameDiv = li.querySelector(".name.left");
        if (nameDiv) {
            // get only the text before the <i> tag
            const raw = nameDiv.childNodes[0]?.textContent || "";

            // remove trailing "x1", "x123", "×1", etc.
            const cleaned = raw.replace(/\s*[x]\d+\s*$/, "").trim();

            item.name = cleaned;

            const tooltipIcon = nameDiv.querySelector(".networth-info-icon");
            if (tooltipIcon) {
                Object.assign(item, parseTooltip(tooltipIcon.getAttribute("title")));
            }
        }

        data.items.push(item);
    });

    return data;
}

function parseTooltip(titleHtml) {
    if (!titleHtml) return {};

    const div = document.createElement("div");
    div.innerHTML = titleHtml;

    const tOverflow = div.querySelector(".t-overflow");
    if (!tOverflow) return {};

    // Collect all bonuses
    const bonuses = [];
    tOverflow.querySelectorAll("b").forEach(b => {
        const bonusName = b.textContent.trim();
        let bonusDesc = "";

        // Next sibling text node after <b><br/>
        let node = b.nextSibling;
        while (node && node.nodeType !== Node.TEXT_NODE) {
            node = node.nextSibling;
        }
        if (node) bonusDesc = node.textContent.trim();

        bonuses.push({ bonusName, bonusDesc });
    });

    // Damage / Accuracy / Armor / Quality (same as before)
    const dmg = parseFloat(div.querySelector(".bonus-attachment-item-damage-bonus + span")?.textContent) || null;
    const acc = parseFloat(div.querySelector(".bonus-attachment-item-accuracy-bonus + span")?.textContent) || null;
    const armor = parseFloat(div.querySelector(".bonus-attachment-item-defence-bonus + span")?.textContent) || null;
    const rarityStr = div.querySelector(".bonus-attachment-item-rarity-bonus + span")?.textContent || "";
    const quality = parseFloat(rarityStr) || null;

    return { bonuses, dmg, acc, armor, quality };
}

// --------------------------
// UID DISPLAY LOGIC
// --------------------------
function addUIDsToInventory() {
    const targetNodes = document.querySelectorAll("ul#primary-items, ul#secondary-items, ul#melee-items, ul#armour-items");
    const config = { childList: true };

    const callbackInventory = (mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type !== "childList") return;
            Array.from(mutation.target.children).forEach(listing => {
                const UID = listing.getAttribute("data-armoryid");
                const nameEl = listing.querySelector(".name");
                const img = listing.querySelector("span.image-wrap > img");

                // if UID exists on item & has not already been UID-ed
                if (UID && nameEl && !nameEl.classList.contains("uid-added")) {
                    const hasGlow = Array.from(img.parentElement.classList).some(c => c.startsWith("glow-"));

                    // if is RW gear
                    if (hasGlow) {
                        // go through owners for loaned gear
                        updateLoanedItemsFromInventory(listing);

                        let ownerName = null;
                        for (const [user, items] of Object.entries(loanedGear)) {
                            if (Array.isArray(items) && items.some(i => i.uid === UID)) {
                                ownerName = user;
                                break;
                            }
                        }

                        // Display UID and owner (if found)
                        nameEl.textContent = ownerName
                            ? `${img.alt.split(" ").slice(1).join(" ")} [${UID}] - ${ownerName}`
                        : `${img.alt.split(" ").slice(1).join(" ")} [${UID}]`;

                        nameEl.classList.add("uid-added");
                    }
                }
            });
        });
    };

    targetNodes.forEach(targetNode => new MutationObserver(callbackInventory).observe(targetNode, config));
}

function updateLoanedItemsFromInventory(listing) {
    const itemData = parseInventoryItem(listing);
    if (!itemData) return;

    // Loop through all users in loanedGear
    for (const username in loanedGear) {
        if (!Array.isArray(loanedGear[username])) continue;

        loanedGear[username].forEach(loanedItem => {
            // if UID matches & no other details, fill missing details
            if (itemData.uid && loanedItem.uid === itemData.uid && loanedItem.name == null) {
                loanedItem.uid = loanedItem.uid || itemData.uid;
                loanedItem.name = loanedItem.name || itemData.name;
                loanedItem.dmg = loanedItem.dmg ?? itemData.dmg;
                loanedItem.acc = loanedItem.acc ?? itemData.acc;
                loanedItem.armor = loanedItem.armor ?? itemData.armor;
                loanedItem.quality = loanedItem.quality ?? itemData.quality;
                loanedItem.bonusName = loanedItem.bonusName || itemData.bonusName;
                loanedItem.bonusDesc = loanedItem.bonusDesc || itemData.bonusDesc;

                // add owner in HTML
                const nameEl = listing.querySelector(".name");
                if (nameEl && !nameEl.textContent.includes(username)) {
                    nameEl.textContent += ` (${username})`;
                }
            } else {
                // If stats match but loan has no UID, add UID
                const statsMatch = !loanedItem.uid &&
                      loanedItem.name === itemData.name &&
                      loanedItem.dmg == itemData.dmg &&
                      loanedItem.acc == itemData.acc &&
                      loanedItem.armor == itemData.armor &&
                      loanedItem.bonusName === itemData.bonusName;

                if (statsMatch && itemData.uid) {
                    loanedItem.uid = itemData.uid;

                    // add owner in HTML
                    const nameEl = listing.querySelector(".name");
                    if (nameEl && !nameEl.textContent.includes(username)) {
                        nameEl.textContent += ` (${username})`;
                    }
                }
            }

        });
    }

    saveGear(loanedGear);
    updateLog();
}

function parseInventoryItem(listing) {
    const item = {};

    // Item name
    const nameEl = listing.querySelector(".name");
    const fullText = nameEl?.textContent || "";
    const split = fullText.split("[");
    item.name = split[0].trim();

    // UID
    const UIDMatch = nameEl?.textContent.match(/\[(\d+)\]/);
    item.uid = listing.getAttribute("data-armoryid") || (UIDMatch ? UIDMatch[1] : null);

    // Initialize bonuses array
    item.bonuses = [];

    // Bonuses
    const bonusLis = listing.querySelectorAll(".bonuses-wrap li");
    bonusLis.forEach(li => {
        const defEl = li.querySelector(".bonus-attachment-item-defence-bonus + span");
        if (defEl) item.armor = parseFloat(defEl.textContent);
        const dmgEl = li.querySelector(".bonus-attachment-item-damage-bonus + span");
        if (dmgEl) item.dmg = parseFloat(dmgEl.textContent);
        const accEl = li.querySelector(".bonus-attachment-item-accuracy-bonus + span");
        if (accEl) item.acc = parseFloat(accEl.textContent);

        // Multiple bonuses in the <li>
        const bonusEls = li.querySelectorAll("i[title]");
        bonusEls.forEach(bonusEl => {
            const title = bonusEl.getAttribute("title");
            if (!title) return;

            const parser = new DOMParser();
            const doc = parser.parseFromString(title, "text/html");

            const bonusName = doc.querySelector("b")?.textContent?.trim() || null;

            // Take text after <b> as bonusDesc
            let bonusDesc = null;
            const br = doc.querySelector("b + br");
            if (br) {
                let node = br.nextSibling;
                while (node && node.nodeType !== Node.TEXT_NODE) {
                    node = node.nextSibling;
                }
                bonusDesc = node?.textContent?.trim() || null;
            }

            if (bonusName) {
                item.bonuses.push({
                    bonusName,
                    bonusDesc
                });
            }
        });
    });

    return item;
}



// --------------------------
// TRADE PAGE OBSERVER
// --------------------------
function setupTradePage() {
    const observer = new MutationObserver(() => {
        const container = document.querySelector("#trade-container");
        if (!container) return;

        // Only add UI once
        if (!document.querySelector("#loaned-gear-controls")) {
            addGearUI();
        }
    });

    // Watch the body for the trade container being added
    observer.observe(document.body, { childList: true, subtree: true });

    // Also try immediately in case it's already loaded
    const container = document.querySelector("#trade-container");
    if (container) addGearUI();
}

// --------------------------
// FACTION ARMORY PAGE LOGIC
// --------------------------
function setupFactionArmory() {
    if (window.location.pathname !== "/factions.php") return;

    const armory = "#faction-armoury";
    const parent = document.querySelector(armory);
    if (!parent) return;

    const weaponsNode = parent.querySelector("#armoury-weapons > ul.item-list");
    const armourNode = parent.querySelector("#armoury-armour > ul.item-list");

    function processItems() {
        const factionItems = document.querySelectorAll("#armoury-weapons li, #armoury-armour li");
        factionItems.forEach(li => {
            const img = li.querySelector("img.torn-item.medium");
            if (!img) return;
            const hasGlow = Array.from(img.classList).some(c => c.startsWith("glow-"));
            if (hasGlow) {
                processFactionItem(li, loanedGear);
            }
        });
    }

    // Initial processing
    processItems();

    // Also watch for dynamically added items
    const observer = new MutationObserver(() => {
        processItems();
    });
    observer.observe(parent, { childList: true, subtree: true });
}

function parseFactionItem(listing) {
    const item = {};

    // UID
    const imgWrap = listing.querySelector("div.img-wrap");
    item.uid = imgWrap?.getAttribute("data-armoryid") || null;

    // Name
    const nameEl = listing.querySelector("div.name");
    if (nameEl) {
        item.name = nameEl.textContent.replace(/\[.*\]/, "").split(" - ")[0].trim();
    }

    // Initialize bonuses array
    item.bonuses = [];

    // Bonuses list
    const bonusLis = listing.querySelectorAll("ul.bonuses li");

    bonusLis.forEach(li => {
        const dmgEl = li.querySelector(".bonus-attachment-item-damage-bonus + span");
        if (dmgEl) item.dmg = parseFloat(dmgEl.textContent);
        const accEl = li.querySelector(".bonus-attachment-item-accuracy-bonus + span");
        if (accEl) item.acc = parseFloat(accEl.textContent);
        const armorEl = li.querySelector(".bonus-attachment-item-defence-bonus + span");
        if (armorEl) item.armor = parseFloat(armorEl.textContent);
        const qualityEl = li.querySelector(".bonus-attachment-item-rarity-bonus + span");
        if (qualityEl) {
            const match = qualityEl.textContent.match(/([\d.]+)/);
            if (match) item.quality = parseFloat(match[1]);
        }

        // Multiple special bonuses in this li
        const specialBonuses = li.querySelectorAll("i[title]");
        specialBonuses.forEach(specialBonus => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(specialBonus.getAttribute("title"), "text/html");

            const bonusName = doc.querySelector("b")?.textContent?.trim();
            if (!bonusName) return;

            // Description: text after <b> and <br>, first line only
            let bonusDesc = null;
            const br = doc.querySelector("b + br");
            if (br) {
                let node = br.nextSibling;
                while (node && node.nodeType !== Node.TEXT_NODE) {
                    node = node.nextSibling;
                }
                bonusDesc = node?.textContent?.trim() || null;
            }

            item.bonuses.push({
                bonusName,
                bonusDesc
            });
        });
    });

    return item;
}


function processFactionItem(listing, loanedGear) {
    const item = parseFactionItem(listing);
    const UID = item.uid;

    // Iterate through all users in loanedGear
    for (const [username, items] of Object.entries(loanedGear)) {
        items.forEach(loanedItem => {
            // if UID matches and loan is missing details, fill them in
            if (UID && loanedItem.uid === UID) {
                if (!loanedItem.name) loanedItem.name = item.name;
                if (!loanedItem.dmg) loanedItem.dmg = item.dmg;
                if (!loanedItem.acc) loanedItem.acc = item.acc;
                if (!loanedItem.armor) loanedItem.armor = item.armor;
                if (!loanedItem.bonusName) loanedItem.bonusName = item.bonusName;
                if (!loanedItem.bonusDesc) loanedItem.bonusDesc = item.bonusDesc;
            } else {
                // if stats match a loan but UID is missing, assign it
                const statsMatch = loanedItem.name === item.name &&
                      loanedItem.dmg == item.dmg &&
                      loanedItem.acc == item.acc &&
                      loanedItem.armor == item.armor &&
                      loanedItem.bonusName === item.bonusName &&
                      !loanedItem.uid;
                if (statsMatch) {
                    loanedItem.uid = UID;
                }

            }

        });
    }

    // Optionally, update the display in the faction page
    const nameEl = listing.querySelector("div.name");
    if (nameEl && UID) {
        if (!nameEl.textContent.includes(UID)) {
            // Find the owner of this UID
            let owner = null;
            for (const [username, items] of Object.entries(loanedGear)) {
                if (items.some(i => i.uid === UID)) {
                    owner = username;
                    break;
                }
            }
            nameEl.innerHTML = owner ? `${item.name} <span style="font-size: 0.8em;"> [${UID}] ${owner}</span>`: `${item.name} [${UID}]`;
            nameEl.classList.add("uid-added");
        }
    }

    saveGear(loanedGear);
    updateLog();
}

// --------------------------
// INIT
// --------------------------
(function() {
    if (window.location.pathname === "/item.php") {
        addUIDsToInventory();
    }
    else if (window.location.pathname === "/trade.php") {
        setupTradePage();
        const tradeContainer = document.querySelector("#trade-container");
        if (!tradeContainer) return;

        const inventory = tradeContainer.querySelector("#inventory-container") || tradeContainer;

        const updateTradeGlowItems = () => {
            const images = inventory.querySelectorAll('div.image-wrap > img[data-reactid]');
            images.forEach(img => {
                const glowWrap = img.closest("div.image-wrap");
                const hasGlow = Array.from(glowWrap.classList).some(c => c.startsWith("glow-"));
                if (!hasGlow) return;

                const name = img.alt;
                const reactid = img.getAttribute("data-reactid");
                const UIDMatch = reactid.match(/\$(\d+)\./);
                const UID = UIDMatch ? UIDMatch[1] : null;
                if (!UID) return;

                const nameWrap = glowWrap.nextElementSibling;
                if (nameWrap && nameWrap.classList.contains("name-wrap")) {
                    const span = nameWrap.querySelector("span.t-overflow");
                    if (!span) return;

                    // Check loanedGear for this UID or matching stats
                    let ownerName = null;
                    Object.entries(loanedGear).some(([username, items]) => {
                        return items.some(item => {
                            // Match on UID
                            const uidMatch = UID && item.uid === UID;
                            if (uidMatch) {
                                ownerName = username;
                                return true;
                            }
                            return false;
                        });
                    });

                    // Append UID (and owner name if found)
                    if (!span.textContent.includes(UID)) {
                        span.textContent = ownerName
                            ? `${name} [${UID}] - ${ownerName}`
                        : `${name} [${UID}]`;
                    }
                }
            });
        };

        // Initial run
        updateTradeGlowItems();

        // Observe inventory changes
        const observerTrade = new MutationObserver(updateTradeGlowItems);
        observerTrade.observe(inventory, { childList: true, subtree: true });
    }
    else if (window.location.pathname === "/factions.php") {
        setupFactionArmory();
    }
})();

