// ==UserScript==
// @name         S7FlightClub
// @namespace    http://tampermonkey.net/
// @version      2025-12-05
// @description  Flight Club helper script for Torn
// @author       S7upidity [3567556] based off code written by Silverdark [3503183], neth [3564828]
// @match        https://www.torn.com/item.php*

// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      wiki.tornflight.club/
// @downloadURL https://update.greasyfork.org/scripts/558023/S7FlightClub.user.js
// @updateURL https://update.greasyfork.org/scripts/558023/S7FlightClub.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    /* -----------------------------------------
       Item → Recipient mapping (human-editable)
       Keep grouped for ease of updates
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
    };

    // Recipients per group
    const RECIPIENT_MIA = "MIA[131289]";
    const RECIPIENT_GALLO = "GalloInfligo[2133394]";

    /* -----------------------------------------
       Build master recipient map and allowed set
       ----------------------------------------- */
    const recipientByItemId = new Map();
    Object.keys(MIA_ITEMS).forEach(id => recipientByItemId.set(String(id), RECIPIENT_MIA));
    Object.keys(GALLO_ITEMS).forEach(id => recipientByItemId.set(String(id), RECIPIENT_GALLO));
    const allowedItemIds = new Set(recipientByItemId.keys());

    /* Data storage / config */
    const travelWebsiteUrl = "https://wiki.tornflight.club/";
    const dataKey_flightClub = "flightClubData";
    const supportedFlightClubDataVersion = "2.0";
    const flightClubCacheTimeInSeconds = 120;

    const listeners = {};
    const remainingByItemId = new Map();

    /* Event listeners */
    on('flight-club-itemrow-changed', row => {
        setupFlightButton(row); // Add send button if missing
        updateStatusFlightClubItemRow(row); // Update remaining count badge
    });

    on('flight-club-data-changed', async () => {
        const itemRows = await getItemRows();
        itemRows.forEach(updateStatusFlightClubItemRow); // Refresh all badges
    });

    init(); // Main initialization

    /* ------------------------------------------------
       Initialization functions
       ------------------------------------------------ */
    function init() {
        initFlightClubData(); // Load cached or fetch data
        initItemRowObserver(); // Observe DOM for new item rows
    }

    async function initItemRowObserver() {
        const wrapper = await waitForElm(document.body, "#category-wrap");

        const observer = new MutationObserver(muts => {
            for (const m of muts) {
                const node = m.target.closest?.("li[data-item]") || null;
                if (node && allowedItemIds.has(node.dataset.item)) {
                    emit('flight-club-itemrow-changed', node); // Trigger for new/updated rows
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

    /* ------------------------------------------------
       Insert Flight Button into item rows
       ------------------------------------------------ */
    function setupFlightButton(itemRow) {
        const actions = itemRow.querySelector(".actions-wrap");
        if (!actions) return;

        const sendContainer = actions.children[3];
        const originalSendButton = actions.children[1];

        // Avoid adding button multiple times
        if (!sendContainer || sendContainer.classList.contains("flight-added")) return;
        sendContainer.classList.add("flight-added");

        const btn = createFlightButton();
        btn.addEventListener('click', evt => {
            evt.stopPropagation();
            originalSendButton.click(); // Open send popup

            const popup = evt.target.closest(".cont-wrap");
            if (!popup) return;

            waitForElm(popup, ".user-id-label").then(() => {
                fillSendPopup(popup); // Autofill recipient and amount
            });
        });

        sendContainer.appendChild(btn);
    }

    function createFlightButton() {
        const wrap = document.createElement("span");
        wrap.className = "icon-h";
        wrap.title = "Send to Flight Club";

        const btn = document.createElement("button");
        btn.className = "wai-btn";
        btn.style.width = "34px";

        const img = document.createElement("img");
        img.src = "https://wiki.tornflight.club/img/airplane.svg";
        img.alt = "Flight Club";
        img.style.width = "18px";
        img.style.height = "18px";
        img.style.verticalAlign = "middle";
        img.style.horizontalAlign = "middle";

        const label = document.createElement("span");
        label.className = "opt-name";
        label.textContent = "Flight";

        btn.appendChild(img);
        wrap.appendChild(btn);
        wrap.appendChild(label);
        return wrap;
    }

    /* ------------------------------------------------
       Autofill send popup with recipient and max amount
       ------------------------------------------------ */
    function fillSendPopup(popup) {
        const itemRow = popup.closest("li[data-item]");
        if (!itemRow) return;

        const itemId = itemRow.dataset.item;
        const qtyHidden = popup.querySelector("input[type=hidden].amount");
        const qtyVisible = popup.querySelector("input[type=text].amount");
        const userField = popup.querySelector("input[type=text].user-id");

        qtyHidden.value = qtyVisible.dataset.max;
        qtyVisible.value = qtyVisible.dataset.max;

        // Lookup recipient from map, fallback to default
        userField.value = recipientByItemId.get(itemId) || "No ID";
    }

    /* ------------------------------------------------
       Remaining status badge for each item row
       ------------------------------------------------ */
    async function initFlightClubData() {
        let data = await GM_getValue(dataKey_flightClub, null);
        const now = Date.now();

        // Refresh data if outdated or version mismatch
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

    async function fetchRemaining() {
        const res = await gmFetch(`${travelWebsiteUrl}api/items/remaining`, 'GET');
        return JSON.parse(res.responseText);
    }

    function updateStatusFlightClubItemRow(itemRow) {
        const id = itemRow.dataset.item;
        const remaining = remainingByItemId.get(id);
        const nameWrap = itemRow.querySelector(".name-wrap");
        if (!nameWrap) return;

        let badge = nameWrap.querySelector(".flight-club-status");

        if (remaining === undefined) {
            if (badge) badge.remove();
            return;
        }

        if (!badge) {
            badge = document.createElement("span");
            badge.className = "qty flight-club-status";
            nameWrap.appendChild(badge);
        }

        const text = remaining === 0 ? "done" : remaining;
        badge.textContent = `(${text})`;
        badge.style.color = remaining < 0 ? "red" : "green";
    }

    /* ------------------------------------------------
       Utilities: wait for element and GM fetch
       ------------------------------------------------ */
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
