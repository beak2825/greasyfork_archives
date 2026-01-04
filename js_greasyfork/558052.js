// ==UserScript==
// @name         FlightClub
// @namespace    http://tampermonkey.net/
// @version      2025-12-07.1
// @description  Flight Club helper script for Torn
// @author       S7upidity [3567556] based off code written by Silverdark [3503183], neth [3564828]
// @match        https://www.torn.com/item.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      wiki.tornflight.club/
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/558052/FlightClub.user.js
// @updateURL https://update.greasyfork.org/scripts/558052/FlightClub.meta.js
// ==/UserScript==
 
(async function () {
    'use strict';
 
    /* -----------------------------------------
       Item → Recipient mapping (human-editable)
       ----------------------------------------- */
    const MIA_ITEMS = {
        282: "African Violet",
        617: "Banana Orchid",
        271: "Ceibo",
        277: "Cherry Blossom",
        263: "Crocus",
        260: "Dahlia",
        272: "Edelweiss",
        267: "Heather",
        264: "Orchid",
        276: "Peony",
        385: "Tribulus Omanens",
        384: "Camel",
        273: "Chamois",
        258: "Jaguar",
        215: "Kitten",
        281: "Lion",
        269: "Monkey",
        266: "Nessie",
        274: "Panda",
        268: "Red Fox",
        186: "Sheep",
        618: "Stingray",
        187: "Teddy Bear",
        261: "Wolverine",
    };
 
    const GALLO_ITEMS = {
        196: "Cannabis",
        197: "Ecstasy",
        206: "Xanax",
        203: "Shrooms",
        199: "LSD",
        204: "Speed",
        198: "Ketamine",
        205: "Vicodin",
        201: "PCP",
        870: "Love Juice",
        200: "Opium",
        394: "Brick",
        616: "Trout",
        219: "Concussion Grenade",
        246: "Fireworks",
        573: "Wrench",
        742: "Molotov Cocktail",
        220: "Grenade",
        190: "Semtex",
        229: "Stick Grenade",
        257: "Throwing Knife",
        814: "Tyrosine",
        464: "Melatonin",
        226: "Smoke Grenade",
        229: "Claymore Mine",
        611: "Snowball",
        847: "Nerve Gas",
        463: "Epinephrine",
        222: "Flash Grenade",
        840: "Nail Bomb",
        871: "Glitter Bomb",
        224: "Party Popper",
        256: "Tear Gas",
        465: "Serotonin",
        242: "HEG",
        239: "Ninja Star",
        392: "Pepper Spray"
    };
 
    const RECIPIENT_MIA = "MIA[131289]";
    const RECIPIENT_GALLO = "GalloInfligo[2133394]";
 
    /* -----------------------------------------
       Master recipient map and allowed set
       ----------------------------------------- */
    const recipientByItemId = new Map();
    Object.keys(MIA_ITEMS).forEach(id => recipientByItemId.set(String(id), RECIPIENT_MIA));
    Object.keys(GALLO_ITEMS).forEach(id => recipientByItemId.set(String(id), RECIPIENT_GALLO));
    const allowedItemIds = new Set(recipientByItemId.keys());
 
    const travelWebsiteUrl = "https://wiki.tornflight.club/";
    const dataKey_flightClub = "flightClubData";
    const supportedFlightClubDataVersion = "2.0";
    const flightClubCacheTimeInSeconds = 120;
 
    const listeners = {};
    const remainingByItemId = new Map();
 
    /* -----------------------------------------
       Event listeners
       ----------------------------------------- */
    on('flight-club-itemrow-changed', row => {
        setupFlightButton(row);
        updateStatusFlightClubItemRow(row);
    });
 
    on('flight-club-data-changed', async () => {
        const itemRows = await getItemRows();
        itemRows.forEach(updateStatusFlightClubItemRow);
    });
 
    init();
 
    /* -----------------------------------------
       Initialization functions
       ----------------------------------------- */
    function init() {
        initFlightClubData();
        initItemRowObserver();
    }
 
    async function initItemRowObserver() {
        const wrapper = await waitForElm(document.body, "#category-wrap");
 
        const observer = new MutationObserver(muts => {
            for (const m of muts) {
                const node = m.target.closest?.("li[data-item]") || null;
                if (node && allowedItemIds.has(node.dataset.item)) {
                    emit('flight-club-itemrow-changed', node);
                }
            }
        });
 
        observer.observe(wrapper, { subtree: true, attributes: true, childList: true });
    }
 
    async function getItemRows() {
        await waitForElm(document.body, "#category-wrap");
        return [...document.querySelectorAll("#category-wrap li[data-item]")]
            .filter(row => allowedItemIds.has(row.dataset.item));
    }
 
    /* -----------------------------------------
       Insert Flight Button into item rows
       ----------------------------------------- */
    function setupFlightButton(itemRow) {
        const actions = itemRow.querySelector(".actions-wrap");
        if (!actions) return;
 
        const originalSendButton = actions.children[1]; // Send button
 
        // Avoid adding button multiple times
        if (actions.querySelector(".flight-added")) return;
 
        // Create new button container
        const planeSlot = document.createElement("span");
        planeSlot.className = "flight-added";
 
        const btn = document.createElement("button");
        btn.className = "wai-btn";
        btn.style.width = "34px";
 
        btn.title = "Send to Flight Club";
 
        // Use airplane image + label
        const img = document.createElement("img");
        img.src = "https://wiki.tornflight.club/img/airplane.svg";
        img.alt = "FlightClub";
        img.style.width = "18px";
        img.style.height = "18px";
        img.style.verticalAlign = "middle";
 
        const label = document.createElement("span");
       // label.textContent = "FlightClub";
        label.style.marginLeft = "4px";
 
        btn.appendChild(img);
        btn.appendChild(label);
 
        btn.addEventListener('click', evt => {
            evt.stopPropagation();
            originalSendButton.click();
 
            const popup = evt.target.closest(".cont-wrap");
            if (!popup) return;
 
            waitForElm(popup, ".user-id-label").then(() => {
                fillSendPopup(popup);
            });
        });
 
        planeSlot.appendChild(btn);
 
        // Insert in slot 3 (index 2)
        if (actions.children.length >= 3) {
            actions.insertBefore(planeSlot, actions.children[2]);
        } else {
            actions.appendChild(planeSlot);
        }
 
        // Remove extra slot 4 if it exists
        if (actions.children.length > 3) {
            actions.removeChild(actions.children[4]);
        }
    }
 
    /* -----------------------------------------
       Autofill send popup with recipient and max amount
       ----------------------------------------- */
    function fillSendPopup(popup) {
        const itemRow = popup.closest("li[data-item]");
        if (!itemRow) return;
 
        const itemId = itemRow.dataset.item;
        const qtyHidden = popup.querySelector("input[type=hidden].amount");
        const qtyVisible = popup.querySelector("input[type=text].amount");
        const userField = popup.querySelector("input[type=text].user-id");
 
        qtyHidden.value = qtyVisible.dataset.max;
        qtyVisible.value = qtyVisible.dataset.max;
        userField.value = recipientByItemId.get(itemId) || "No ID";
    }
 
    /* -----------------------------------------
       Remaining status badge
       ----------------------------------------- */
    async function initFlightClubData() {
        let data = await GM_getValue(dataKey_flightClub, null);
        const now = Date.now();
 
        if (!data || data.version !== supportedFlightClubDataVersion || now > data.lastUpdate + flightClubCacheTimeInSeconds * 1000) {
            await GM_deleteValue(dataKey_flightClub);
 
            const raw = await fetchRemaining();
            data = { version: supportedFlightClubDataVersion, lastUpdate: now, rawRemainingByItemId: raw };
            await GM_setValue(dataKey_flightClub, data);
        }
 
        remainingByItemId.clear();
        Object.entries(data.rawRemainingByItemId).forEach(([id, val]) => remainingByItemId.set(id, val));
 
        emit('flight-club-data-changed');
    }
 
     
    /* -----------------------------------------
       Utilities
       ----------------------------------------- */
    function waitForElm(parent, selector) {
        return new Promise(resolve => {
            if (parent.querySelector(selector)) return resolve(parent.querySelector(selector));
 
            const obs = new MutationObserver(() => {
                const found = parent.querySelector(selector);
                if (found) {
                    obs.disconnect();
                    resolve(found);
                }
            });
 
            obs.observe(document.body, { childList: true, subtree: true });
        });
    }
 
    function gmFetch(url, method, headers = {}, data = '') {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({ method, url, headers, data, onload: resolve, onerror: reject });
        });
    }
 
    function on(event, cb) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(cb);
    }
 
    function emit(event, data) {
        (listeners[event] || []).forEach(fn => fn(data));
    }
})();