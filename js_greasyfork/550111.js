// ==UserScript==
// @name         Ups Auction Estimator
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Help to find great deals in auction.
// @author       Upsilon[3212478]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/550111/Ups%20Auction%20Estimator.user.js
// @updateURL https://update.greasyfork.org/scripts/550111/Ups%20Auction%20Estimator.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    //
    // PARAMETERS
    //
    const apiKey = "###PDA-APIKEY###";
    const csvLink = ""; // your csv link
    const mugBotLink = ""; // your mug bot link
    const ROUTE_FLAGS = {
        inventory: true,
        displayCabinet: true,
        bazaar: true,
        auction: true,
        bazaarAdd: true,
        pageAddListing: true,
        pageViewListing: true,
    };
    const CACHE_TTL_MS = 1000 * 60 * 300;
    const CACHE_VERSION = 1
    const isPda = /tornpda/i.test(navigator.userAgent);

    //
    // CONFIGURATION
    //
    const path = window.location.pathname;
    const hash = window.location.hash;
    let csvData = [];
    let mugBotData = [];
    const ROUTES = [
        {match: (path, hash) => path.includes("item.php"), init: initInventoryMode}, // checked
        {match: (path, hash) => path.includes("displaycase.php"), init: initDisplayCabinetMode}, // checked
        {
            match: (path, hash) => path.includes("bazaar.php") && hash.includes("/manage"),
            init: initShowListingBazaarMode
        }, // mobile not working because no way of identifying one item over another
        {match: (path, hash) => path.includes("bazaar.php") && hash.includes("/add"), init: initAddListingBazaarMode}, // mobile version check
        {match: (path, hash) => path.includes("bazaar.php"), init: initBazaarMode}, // checked
        {match: (path, hash) => path.includes("amarket.php"), init: initAuctionMode}, // checked
        {
            match: (path, hash) => path.includes("page.php") && hash.includes("/addListing"),
            init: initAddListingMarketMode
        }, // checked
        {
            match: (path, hash) => path.includes("page.php") && hash.includes("/viewListing"),
            init: initShowListingMarketMode
        }, // checked
    ];

    if (path.includes("bazaar.php") && hash.includes("/manage")) {
        if (!unsafeWindow.BazaarShowListingData) unsafeWindow.BazaarShowListingData = [];
        const original = (typeof unsafeWindow !== 'undefined' && unsafeWindow.fetch) ? unsafeWindow.fetch : null;
        try {
            const newFetch = async function (...args) {
                const resource = args[0];
                const url = typeof resource === 'string' ? resource : (resource && resource.url ? resource.url : '');
                const isBazaar = url.includes('bazaar.php') && url.includes('sid=bazaarData') && url.includes('step=getBazaarItems');
                const resp = await (original ? original.apply(this, args) : window.fetch.apply(this, args));
                if (isBazaar) {
                    try {
                        const clone = resp.clone();
                        const data = await clone.json();

                        const formatted = data.list.map(item => {
                            const bonuses = {};
                            if (item.currentBonuses) {
                                let idx = 1;
                                for (const b of Object.values(item.currentBonuses)) {
                                    const type = b.title || "Unknown";
                                    const value = typeof b.value === "number" ? b.value : null;
                                    bonuses[`bonus${idx}`] = {type, value};
                                    idx++;
                                }
                            }

                            const damage = item.damage ?? null;
                            const accuracy = item.accuracy ?? null;
                            const rarity = item.glowClass ? item.glowClass.replace(/^glow-/, "") : "common";
                            const price = Number(item.price) || 0;
                            const itemId = item.ID;

                            return {
                                itemId: item.ID,
                                name: item.name || "Unknown",
                                price,
                                rarity,
                                damage,
                                accuracy,
                                bonuses
                            };
                        });
                        unsafeWindow.BazaarShowListingData.push(...formatted);
                    } catch (e) {
                        console.warn("[unsafeWindow] bazaar parse fail", e);
                    }
                }
                return resp;
            };

            if (typeof unsafeWindow !== 'undefined') {
                unsafeWindow.fetch = newFetch;
            } else {
                console.warn('unsafeWindow not available, cannot override fetch');
            }
        } catch (err) {
            console.error('Error overriding unsafeWindow.fetch', err);
        }
    }

    const style = document.createElement("style");
    style.textContent = `
        #tornModal {
            position: fixed;
            top: 50%;
            right: 0;
            width: 650px;
            height: 90%;
            z-index: 9999;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            background: #1c1c1c;
            color: #fff;
            box-shadow: -5px 0 15px rgba(0,0,0,0.5);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        #tornModal.show {
            transform: translateX(0) translateY(-50%);
        }

        .torn-modal-overlay {
            display: none;
        }

        .torn-modal-window {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px;
            overflow-y: auto;
        }

        @media (max-width: 768px) {
            #tornModal {
                right: 0;
                width: 100%;
                box-shadow: none;
                border-radius: 0;
            }
            #tornModal.show {
                transform: translateX(0) translateY(-50%);
            }
            .torn-modal-window {
                padding: 15px;
                height: 100%;
                overflow-y: auto;
            }
        }

        .torn-modal-header {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            border-bottom: 1px solid #444;
            padding-bottom: 15px;
        }

        .torn-modal-body h2 {
            margin: 0!important;
        }

        .torn-modal-body h3 {
            margin: 10px 0!important;
        }

        .torn-modal-body h4 {
            margin: 0!important;
        }

        .torn-close-btn {
            position: absolute;
            right: 0;
            background: none;
            border: none;
            font-size: 24px;
            color: #aaa;
            cursor: pointer;
        }
        .torn-close-btn:hover { color: #fff; }

        .torn-modal-body {
            gap: 20px;
        }

        .torn-modal-body hr {
            margin: 10px 0!important;
        }

        .torn-close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #aaa;
          cursor: pointer;
        }
        .torn-close-btn:hover { color: #fff; }
        .torn-modal-body {
          gap: 20px;
        }
        .torn-card {
          background: #2a2a2a;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        .torn-card h4 {
          font-size: 16px;
          border-bottom: 1px solid #444;
          padding-bottom: 5px;
        }
        .torn-list-container {
          max-height: 140px; /* environ 5 lignes */
          overflow-y: auto;
        }

        .torn-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .torn-list li {
          padding: 6px 10px;
          border-bottom: 1px solid #333;
          font-size: 14px;
          display: block;
        }

        .torn-list li:nth-child(odd) {
          background: #252525;
        }

        .torn-list li:nth-child(even) {
          background: #2d2d2d;
        }

        .torn-list li.torn-highlight {
          color: #0f0;
          font-weight: bold;
        }

        .torn-details {
          margin-top: 15px;
          padding: 10px;
          background: #222;
          border-radius: 6px;
          font-size: 14px;
        }

        .torn-details h4 {
          margin: 0 0 10px 0;
          font-size: 16px;
          border-bottom: 1px solid #444;
          padding-bottom: 5px;
          padding-top: 5px;
        }

        .torn-details p {
          margin: 5px 0;
        }

        .torn-section {
          background: #2a2a2a;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }

        .torn-section h3 {
          margin-top: 0;
          font-size: 16px;
          border-bottom: 1px solid #444;
          padding-bottom: 5px;
        }

        .torn-details {
          margin-top: 15px;
          padding: 10px;
          background: #222;
          border-radius: 6px;
          font-size: 14px;
          line-height: 1.5;
        }

        .torn-market-meta {
          margin-top: 15px;
          padding: 10px;
          background: #222;
          border-radius: 6px;
          font-size: 14px;
          color: #ccc;
          line-height: 1.5;
        }

        .torn-bonus-tag,
        .torn-rarity-tag {
            display: inline-block;
            margin: 2px 4px;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            background-color: #444;
            color: #fff;
            user-select: none;
            transition: background-color 0.2s, color 0.2s;
        }

        .torn-bonus-tag.active,
        .torn-rarity-tag.active {
            background-color: #f39c12; /* couleur d’accent */
            color: #000;
        }

        .torn-bonus-tag:hover,
        .torn-rarity-tag:hover {
            background-color: #555;
        }

        .torn-details div {
            margin-top: 5px;
        }

        .torn-rarity-tags {
            margin-top: 5px;
        }
        `;
    document.head.appendChild(style);

    async function getCSVData(itemId = null) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: csvLink,
                onload: function (response) {
                    if (response.status !== 200) {
                        reject(new Error("Erreur HTTP " + response.status));
                        return;
                    }

                    try {
                        const text = response.responseText.trim();

                        function parseCSV(text) {
                            const rows = [];
                            const lines = text.split(/\r?\n/);
                            for (const line of lines) {
                                const row = [];
                                let cur = '';
                                let inQuotes = false;
                                for (let i = 0; i < line.length; i++) {
                                    const char = line[i];
                                    if (char === '"' && line[i - 1] !== '\\') {
                                        inQuotes = !inQuotes;
                                    } else if (char === ',' && !inQuotes) {
                                        row.push(cur);
                                        cur = '';
                                    } else {
                                        cur += char;
                                    }
                                }
                                row.push(cur);
                                rows.push(row);
                            }
                            return rows;
                        }

                        const lines = parseCSV(text);
                        const headers = lines[0];
                        const data = lines.slice(1).map(row => {
                            let raw = {};
                            row.forEach((val, i) => {
                                raw[headers[i]] = val;
                            });

                            const clean = (val) => {
                                if (!val) return null;
                                return String(val).trim().replace(/^"|"$/g, '').replace(/\r$/, '');
                            };

                            const bonuses = {};
                            let bonusIdx = 1;
                            while (raw[`Bonus ${bonusIdx}`]) {
                                const bonusValue = clean(raw[`Bonus ${bonusIdx} Value`]);
                                bonuses[`bonus${bonusIdx}`] = {
                                    type: clean(raw[`Bonus ${bonusIdx}`]),
                                    value: bonusValue ? parseFloat(bonusValue) : null
                                };
                                bonusIdx++;
                            }

                            const dateAddedStr = clean(raw["Date Added"]);
                            let created_date = null;

                            if (dateAddedStr) {
                                const [day, month, year] = dateAddedStr.split('/').map(Number);
                                created_date = `${year}-${month}-${day}`
                            }

                            const priceStr = clean(raw["Price"]);
                            const qualityStr = clean(raw["Quality"]);
                            const damageStr = clean(raw["Damage"]);
                            const accuracyStr = clean(raw["Accuracy"]);

                            return {
                                liId: null,
                                armouryId: null,
                                itemId: itemId,
                                name: clean(raw[""] || raw["Name"]),
                                bonuses,
                                quality: qualityStr ? parseFloat(qualityStr) : null,
                                damage: damageStr ? parseFloat(damageStr) : null,
                                accuracy: accuracyStr ? parseFloat(accuracyStr) : null,
                                price: priceStr ? parseInt(priceStr.replace(/,/g, '')) : null,
                                rarity: clean(raw["Color"]) || null,
                                date_sold: created_date
                            };
                        });

                        resolve(data);
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    }

    async function getMugBotData(itemId = null) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: mugBotLink,
                onload: function (response) {
                    if (response.status !== 200) {
                        reject(new Error("Erreur HTTP " + response.status));
                        return;
                    }

                    try {
                        const text = response.responseText.trim();

                        function parseCSV(text) {
                            const rows = [];
                            const lines = text.split(/\r?\n/);
                            for (const line of lines) {
                                const row = [];
                                let cur = "";
                                let inQuotes = false;
                                for (let i = 0; i < line.length; i++) {
                                    const char = line[i];
                                    if (char === '"' && line[i - 1] !== "\\") {
                                        inQuotes = !inQuotes;
                                    } else if (char === "," && !inQuotes) {
                                        row.push(cur);
                                        cur = "";
                                    } else {
                                        cur += char;
                                    }
                                }
                                row.push(cur);
                                rows.push(row);
                            }
                            return rows;
                        }

                        const clean = (val) => {
                            if (val === undefined || val === null) return null;
                            const s = String(val).trim().replace(/^"|"$/g, "").replace(/\r$/, "");
                            return s === "" ? null : s;
                        };

                        const toFloat = (val) => {
                            const s = clean(val);
                            if (!s) return null;
                            const n = parseFloat(s.replace("%", "").replace(/,/g, ""));
                            return Number.isFinite(n) ? n : null;
                        };

                        const toInt = (val) => {
                            const s = clean(val);
                            if (!s) return null;
                            const n = parseInt(s.replace(/,/g, ""), 10);
                            return Number.isFinite(n) ? n : null;
                        };

                        const toPrice = (val) => {
                            const s = clean(val);
                            if (!s) return null;

                            const cleaned = s.replace(/[^\d-]/g, "");
                            if (!cleaned) return null;

                            const n = parseInt(cleaned, 10);
                            return Number.isFinite(n) ? n : null;
                        };

                        const parseISODateOnly = (val) => {
                            const s = clean(val);
                            if (!s) return null;
                            return s.split("T")[0];
                        };


                        const lines = parseCSV(text);
                        const headers = lines[0].map(h => clean(h) ?? "");
                        const data = lines.slice(1).map((row) => {

                            let raw = {};
                            row.forEach((val, i) => {
                                raw[headers[i]] = val;
                            });

                            const get = (k) => clean(raw[k]);

                            const bonuses = {};
                            let bonusIdx = 1;
                            while (true) {
                                const typeKey = bonusIdx === 1 ? "Bonus" : `Bonus ${bonusIdx}`;
                                const valueKey = bonusIdx === 1 ? "Bonus %" : `Bonus ${bonusIdx} %`;
                                const type = get(typeKey);
                                if (!type) break;
                                bonuses[`bonus${bonusIdx}`] = {
                                    type,
                                    value: toFloat(get(valueKey))
                                };

                                bonusIdx++;
                            }

                            Object.keys(bonuses).forEach((k) => {
                                const b = bonuses[k];
                                if (!b.type && b.value === null) delete bonuses[k];
                            });

                            return {
                                liId: null,
                                armouryId: toInt(get("ArmouryID")),
                                itemId: itemId,
                                name: get("Item Name"),
                                bonuses,
                                quality: toFloat(get("Quality")),
                                damage: toFloat(get("Damage")),
                                accuracy: toFloat(get("Accuracy")),
                                price: toPrice(get("Price")),
                                rarity: null,
                                date_sold: parseISODateOnly(get("Date sold")),
                                seller: get("Seller")
                            };
                        });

                        resolve(data);
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    }

    async function cacheGet(key) {
        const payload = await GM.getValue(key, null);
        if (!payload || payload.v !== CACHE_VERSION) return null;
        if (!payload.t || (Date.now() - payload.t) > CACHE_TTL_MS) return null;
        return payload.data ?? null;
    }

    async function cacheSet(key, data) {
        await GM.setValue(key, { v: CACHE_VERSION, t: Date.now(), data });
    }

    async function cacheDel(key) {
        await GM.deleteValue(key);
    }

    async function getCSVDataCached() {
        const cacheKey = "UpsAuctionEstimator:csvData";
        if (!isPda) {
            const cached = await cacheGet(cacheKey);
            if (cached) return cached;
        }
        const fresh = await getCSVData();
        if (!isPda) {
            await cacheSet(cacheKey, fresh);
        }
        return fresh;
    }

    async function getMugBotDataCached() {
        const cacheKey = "UpsAuctionEstimator:mugBotData";
        if (!isPda) {
            const cached = await cacheGet(cacheKey);
            if (cached) return cached;
        }
        const fresh = await getMugBotData();
        if (!isPda) {
            await cacheSet(cacheKey, fresh);
        }
        return fresh;
    }

    function createButton(label = "Extract", onClick) {
        const btn = document.createElement("button");
        btn.className = "tm-extract-btn";
        btn.type = "button";
        btn.textContent = label;

        Object.assign(btn.style, {
            padding: "4px 8px",
            fontSize: "12px",
            fontWeight: "600",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#f39c12",
            color: "#000",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
            transition: "all 0.2s ease",
        });

        btn.addEventListener("mouseenter", () => (btn.style.backgroundColor = "#e67e22"));
        btn.addEventListener("mouseleave", () => (btn.style.backgroundColor = "#f39c12"));
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (onClick) onClick(e);
        });

        return btn;
    }

    function fetchItemData(uid, price = null) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/torn/${uid}?key=${apiKey}&selections=itemdetails`,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) throw new Error(data.error.error);
                        if (!data.itemdetails) throw new Error("No item details found");

                        const item = data.itemdetails;

                        const bonuses = {};
                        if (item.bonuses) {
                            let idx = 1;
                            for (const b of Object.values(item.bonuses)) {
                                const type = b.bonus || "Unknown";
                                const value = (typeof b.value === "number") ? b.value : null;
                                bonuses[`bonus${idx}`] = {type, value};
                                idx++;
                            }
                        }

                        const damage = (item.damage !== undefined && item.damage !== null)
                            ? item.damage
                            : null;
                        const accuracy = (item.accuracy !== undefined && item.accuracy !== null)
                            ? item.accuracy
                            : null;

                        const rarity = item.rarity || "common";

                        const result = {
                            itemId: item.ID,
                            name: item.name || "Unknown",
                            price: Number(price) || 0,
                            rarity,
                            damage,
                            accuracy,
                            bonuses
                        };

                        resolve(result);
                    } catch (err) {
                        console.error("Erreur API Torn:", err);
                        reject(err);
                    }
                },
                onerror: function (err) {
                    console.error("Erreur réseau GM_xmlhttpRequest:", err);
                    reject(err);
                }
            });
        });
    }

    function parseBonusFromTitle(rawTitle) {
        const temp = document.createElement("div");
        temp.innerHTML = rawTitle;
        const type = temp.querySelector("b")?.textContent.trim() || "Unknown";
        const description = temp.textContent.replace(/\s+/g, " ").trim();
        const valueMatch = description.match(/(\d+(?:\.\d+)?)%?/);
        const value = valueMatch ? parseFloat(valueMatch[1]) : null;
        return {type, value};
    }

    function parseBonusFromAttributes(icon) {
        const type = icon.getAttribute("data-bonus-attachment-title") || "Unknown";
        const description = icon.getAttribute("data-bonus-attachment-description") || "";
        const valueMatch = description.match(/(\d+(?:\.\d+)?)%?/);
        const value = valueMatch ? parseFloat(valueMatch[1]) : null;
        return {type, value};
    }

    function parseBonuses(li) {
        const bonuses = {};

        const icons = li.querySelectorAll(
            '.iconsbonuses .bonus-attachment-icons, ul.bonuses-wrap i[title]'
        );
        let idx = 1;

        const htmlDecode = str => {
            const txt = document.createElement("textarea");
            txt.innerHTML = str;
            return txt.value;
        };

        icons.forEach(icon => {
            const rawTitle = icon.getAttribute('title') || '';
            if (!rawTitle) return;

            const decoded = htmlDecode(rawTitle).replace(/\u00A0/g, ' ');

            let type = null;
            try {
                const tmp = new DOMParser().parseFromString(rawTitle, 'text/html');
                const b = tmp.querySelector('b');
                if (b && b.textContent) type = b.textContent.trim();
            } catch (e) {
            }

            if (!type) {
                const firstLine = decoded.split('\n')[0].trim();
                type = firstLine || null;
            }

            const pctMatch = decoded.match(/(\d+(?:\.\d+)?%)/);
            const numMatch = decoded.match(/(\d+(?:\.\d+)?)/);
            let value = pctMatch ? parseFloat(pctMatch[1].replace('%', ''))
                : (numMatch ? parseFloat(numMatch[1]) : null);

            bonuses['bonus' + idx] = {
                type: type || null,
                value: value || null
            };
            idx++;
        });

        return bonuses;
    }

    function initAuctionMode() {
        document.querySelectorAll("ul.items-list li").forEach(li => {
            const sellerWrap = li.querySelector(".seller-wrap");
            const mobWrap = li.querySelector(".mob-wrap");

            if (sellerWrap && !sellerWrap.querySelector(".tm-extract-btn")) {
                addAuctionButtonContainer(sellerWrap, li, false);
            }

            if (mobWrap && !mobWrap.querySelector(".tm-extract-btn")) {
                addAuctionButtonContainer(mobWrap, li, true);
            }
        });
    }

    function addAuctionButtonContainer(container, li, mobile) {
        container.style.position = container.style.position || "relative";

        const btnWrap = document.createElement("div");
        Object.assign(btnWrap.style, {
            position: "absolute",
            zIndex: "10",
            ...(mobile
                ? {top: "-50px", right: "70px"}
                : {top: "50%", right: "10px", transform: "translateY(-50%)"})
        });

        const btn = createButton("Extract", () => {
            const data = parseAuctionItem(li);
            callback(data);
        });

        btnWrap.appendChild(btn);
        container.appendChild(btnWrap);
    }

    function parseAuctionItem(li) {
        const liId = li.id || null;

        const name = li.querySelector('.title')?.children[0].textContent;

        const armouryId = li.querySelector('.item-hover')?.getAttribute('armoury') || null;

        const imgSrc = li.querySelector('img.torn-item')?.getAttribute('src') || '';
        const itemId = (imgSrc.match(/\/images\/items\/(\d+)\//) || [])[1] || null;

        const bonuses = parseBonuses(li);

        const damage = li.querySelector('i.bonus-attachment-item-damage-bonus')?.parentElement?.querySelector('.label-value')?.textContent.trim() || null;
        const accuracy = li.querySelector('i.bonus-attachment-item-accuracy-bonus')?.parentElement?.querySelector('.label-value')?.textContent.trim() || null;

        const priceText = li.querySelector('.c-bid-wrap')?.textContent.trim().replace(/[^\d]/g, '') || null;
        const price = priceText ? parseInt(priceText, 10) : null;

        let rarity = null;
        const plate = li.querySelector('.item-plate');
        if (plate) {
            const cls = plate.className;
            if (cls.includes('glow-yellow')) rarity = 'yellow';
            else if (cls.includes('glow-red')) rarity = 'red';
            else if (cls.includes('glow-orange')) rarity = 'orange';
            else rarity = 'common';
        }

        return {
            liId,
            armouryId,
            itemId,
            name,
            price,
            rarity,
            bonuses,
            damage,
            accuracy
        };
    }


    function initInventoryMode() {
        document.querySelectorAll("ul.itemsList li[data-armoryid]").forEach(li => {
            if (li.querySelector(".tm-extract-btn")) return;

            const plate = li.querySelector(".item-plate");
            if (!plate || !/(glow-(yellow|orange|red))/.test(plate.className)) return;

            const nameSpan = li.querySelector(".title-wrap .name-wrap .name");
            if (!nameSpan) return;

            const btn = createButton("Extract", () => callback(parseInventoryItem(li)));
            btn.style.marginLeft = "20px";
            nameSpan.insertAdjacentElement("afterend", btn);
        });
    }

    function parseInventoryItem(li) {
        const armouryId = li.getAttribute("data-armoryid");
        const itemId = li.getAttribute("data-item");
        const name = li.querySelector(".title-wrap .name")?.textContent.trim() || "Unknown";

        let rarity = "common";
        const plate = li.querySelector(".item-plate");
        if (plate) {
            if (plate.classList.contains("glow-yellow")) rarity = "yellow";
            else if (plate.classList.contains("glow-orange")) rarity = "orange";
            else if (plate.classList.contains("glow-red")) rarity = "red";
        }

        const damage = parseFloat(li.querySelector(".bonus-attachment-item-damage-bonus")?.parentElement?.querySelector("span")?.textContent?.trim() || "0");
        const accuracy = parseFloat(li.querySelector(".bonus-attachment-item-accuracy-bonus")?.parentElement?.querySelector("span")?.textContent?.trim() || "0");
        const priceText = li.querySelector(".tt-item-price span")?.textContent?.replace(/[^\d]/g, "") || null;
        const price = priceText ? parseInt(priceText, 10) : 0;

        const bonuses = {};
        const bonusLis = li.querySelectorAll("li.bonus.left:not([data-attachments-itemid])");
        let idx = 1;

        bonusLis.forEach(b => {
            const icons = b.querySelectorAll("i[title][data-bonusid]");
            icons.forEach(icon => {
                const bonusId = icon.getAttribute("data-bonusid");
                if (!bonusId) return;

                const raw = icon.getAttribute("title");
                if (!raw) return;

                const temp = document.createElement("div");
                temp.innerHTML = raw;

                const type = temp.querySelector("b")?.textContent.trim() || "Unknown";
                const description = temp.textContent.replace(/\s+/g, " ").trim();
                const valueMatch = description.match(/(\d+(?:\.\d+)?)%?/);
                const value = valueMatch ? parseFloat(valueMatch[1]) : null;

                bonuses["bonus" + idx] = {type, value};
                idx++;
            });
        });

        return {
            liId: li.id,
            armouryId,
            itemId,
            name,
            price,
            rarity,
            bonuses,
            damage,
            accuracy,
        };
    }

    function initDisplayCabinetMode() {
        document.querySelectorAll("ul.display-cabinet li.torn-divider").forEach(li => {
            if (li.querySelector(".tm-extract-btn")) return;

            const plate = li.querySelector(".item-plate");
            if (!plate || !/(glow-(yellow|orange|red))/.test(plate.className)) return;

            const amountDiv = li.querySelector(".b-item-amount");
            if (!amountDiv) return;
            amountDiv.style.width = "70%";

            const btn = createButton("Extract", () => callback(parseDisplayCabinetItem(li)));
            li.style.position = "relative";
            btn.style.position = "absolute";
            btn.style.right = "8px";
            btn.style.bottom = "6px";
            li.appendChild(btn);
        });
    }

    function parseDisplayCabinetItem(li) {
        const itemHover = li.querySelector(".item-hover");
        const armouryId = itemHover?.getAttribute("armouryid") || null;
        const itemId = itemHover?.getAttribute("itemid") || null;

        const name = li.querySelector(".b-item-name span:not(.hide)")?.textContent.trim() || "Unknown";

        let rarity = "common";
        const plate = li.querySelector(".item-plate");
        if (plate) {
            if (plate.classList.contains("glow-yellow")) rarity = "yellow";
            else if (plate.classList.contains("glow-orange")) rarity = "orange";
            else if (plate.classList.contains("glow-red")) rarity = "red";
        } else {
            const rarityIcon = li.querySelector(".b-item-rarity i");
            if (rarityIcon) {
                if (rarityIcon.classList.contains("very-common-rarity-icon")) rarity = "very-common";
                else if (rarityIcon.classList.contains("uncommon-rarity-icon")) rarity = "uncommon";
                else if (rarityIcon.classList.contains("rare-rarity-icon")) rarity = "rare";
            }
        }

        const damage = li.querySelector(".bonus-attachment-item-damage-bonus + .label-value")?.textContent.trim() || null;
        const accuracy = li.querySelector(".bonus-attachment-item-accuracy-bonus + .label-value")?.textContent.trim() || null;

        const bonuses = {};
        let idx = 1;
        li.querySelectorAll(".iconsbonuses [title]").forEach(span => {
            const raw = span.getAttribute("title");
            if (!raw) return;

            const temp = document.createElement("div");
            temp.innerHTML = raw;

            const type = temp.querySelector("b")?.textContent.trim() || "Unknown";
            const description = temp.textContent.replace(/\s+/g, " ").trim();
            const valueMatch = description.match(/(\d+(?:\.\d+)?)%?/);
            const value = valueMatch ? parseFloat(valueMatch[1]) : null;

            bonuses["bonus" + idx] = {type, value};
            idx++;
        });

        return {liId: li.id, armouryId, itemId, name, rarity, bonuses, damage, accuracy};
    }

    function initBazaarMode() {
        document.querySelectorAll(".itemDescription___j4EfE").forEach(item => {
            if (item.querySelector(".tm-extract-btn")) return;

            const hasBonus = item.querySelector(".iconBonuses____iFjZ i[data-bonus-attachment-title]");
            const plate = item.querySelector(".item-plate");
            if (!hasBonus && !(plate && /(glow-(yellow|orange|red))/.test(plate.className))) return;

            const descBlock = item.querySelector(".description___Y2Nrl");
            if (!descBlock) return;

            const btn = createButton("Extract", () => callback(parseBazaarItem(item)));
            Object.assign(btn.style, {position: "absolute", right: "10px", top: "75%", transform: "translateY(-50%)"});
            descBlock.style.position = "relative";
            descBlock.appendChild(btn);
        });
    }

    function parseBazaarItem(item) {
        const name = item.querySelector(".name___B0RW3")?.textContent.trim() || "Unknown";

        const priceText = item.querySelector(".price___dJqda")?.textContent?.replace(/[^\d]/g, "");
        const price = priceText ? parseInt(priceText, 10) : 0;

        const qtyText = item.querySelector(".amountValue___cSVqO")?.textContent?.trim() || "1";
        const quantity = parseInt(qtyText, 10);

        let rarity = "common";
        const plate = item.querySelector(".item-plate");
        if (plate) {
            if (plate.classList.contains("glow-yellow")) rarity = "yellow";
            else if (plate.classList.contains("glow-orange")) rarity = "orange";
            else if (plate.classList.contains("glow-red")) rarity = "red";
        }

        const img = item.querySelector("img");
        let id = null;

        if (img) {
            const src = img.getAttribute("src");
            const match = src.match(/\/images\/items\/(\d+)\//);
            if (match) id = parseInt(match[1], 10);
        }

        const bonuses = {};
        let idx = 1;

        item.querySelectorAll(".iconBonuses____iFjZ i[data-bonus-attachment-title]").forEach(icon => {
            const type = icon.getAttribute("data-bonus-attachment-title") || "Unknown";
            const description = icon.getAttribute("data-bonus-attachment-description") || "";

            const valueMatch = description.match(/(\d+(?:\.\d+)?)%?/);
            const value = valueMatch ? parseFloat(valueMatch[1]) : null;

            bonuses[`bonus${idx}`] = {type, value};
            idx++;
        });

        const damage = item.querySelector(".bonus-attachment-item-damage-bonus")?.nextElementSibling?.textContent?.trim() || null;
        const accuracy = item.querySelector(".bonus-attachment-item-accuracy-bonus")?.nextElementSibling?.textContent?.trim() || null;

        return {
            itemId: id,
            name,
            price,
            quantity,
            rarity,
            damage,
            accuracy,
            bonuses
        };
    }

    function initAddListingMarketMode() {
        document.querySelectorAll(".virtualListing___jl0JE").forEach(div => {
            if (div.querySelector(".tm-extract-btn")) return;

            const imageWrapper = div.querySelector(".imageWrapper___y3aj7");
            if (!imageWrapper) return;
            if (!/(glow-(yellow|orange|red))/.test(imageWrapper.className)) return;

            const infoBtn = div.querySelector("button.viewInfoButton___jOjRg");
            if (!infoBtn) return;
            const aria = infoBtn.getAttribute("aria-controls");
            const uidMatch = aria?.match(/(\d+)$/);
            if (!uidMatch) return;
            const uid = uidMatch[1];

            const priceText = div.querySelector(".price___nNUAv span:first-child")?.textContent?.replace(/[^\d]/g, "") || "";
            const price = priceText ? parseInt(priceText, 10) : 0;

            const nameContainer = div.querySelector(".name___XmQWk");
            const imgContainer = div.querySelector(".imageWrapper___y3aj7");
            const priceContainer = div.querySelector(".price___nNUAv");
            if (!nameContainer || !imgContainer || !priceContainer) return;

            const btn = createButton("Extract", async () => {
                try {
                    const obj = await fetchItemData(uid, price);
                    callback(obj);
                } catch (e) {
                    console.error("Error extracting item:", e);
                }
            });
            btn.classList.add("tm-extract-btn");
            btn.style.fontSize = "11px";
            btn.style.padding = "4px 8px";
            btn.style.borderRadius = "4px";
            btn.style.color = "#fff";
            btn.style.cursor = "pointer";
            btn.style.border = "1px solid #555";

            const applyLayout = () => {
                if (window.innerWidth <= 784) {
                    btn.addEventListener("mouseleave", () => (btn.style.backgroundColor = "transparent"));
                    btn.style.color = "#fff";
                    btn.style.backgroundColor = "transparent";
                    btn.style.position = "absolute";
                    btn.style.bottom = "5px";
                    btn.style.right = "2px";
                    btn.style.marginLeft = "0";
                    nameContainer.style.display = "";
                    imgContainer.style.position = "relative";
                    if (!imgContainer.contains(btn)) imgContainer.appendChild(btn);
                } else {
                    btn.style.color = "#000";
                    btn.style.backgroundColor = "#f39c12";
                    btn.style.position = "static";
                    btn.style.marginLeft = "0";
                    nameContainer.style.display = "inline-flex";
                    nameContainer.style.alignItems = "center";

                    if (!priceContainer.contains(btn)) {
                        priceContainer.innerHTML = "";
                        priceContainer.appendChild(btn);
                    }
                }
            };

            applyLayout();
            window.addEventListener("resize", applyLayout);
        });
    }

    function initShowListingMarketMode() {
        document.querySelectorAll(".itemRowWrapper___cFs4O").forEach(div => {
            if (div.querySelector(".tm-extract-btn")) return;

            const imageWrapper = div.querySelector(".imageWrapper___y3aj7");
            if (!imageWrapper) return;
            if (!/(glow-(yellow|orange|red))/.test(imageWrapper.className)) return;

            const checkbox = div.querySelector('input[id^="itemRow-incognitoCheckbox-"]');
            if (!checkbox) return;
            const idMatch = checkbox.id.match(/(\d+)$/);
            if (!idMatch) return;
            const uid = idMatch[1];

            let price = 0;
            const hiddenPriceInput = div.querySelector('.priceInputWrapper___TBFHl .input-money-group input.input-money[type="hidden"]');
            if (hiddenPriceInput) {
                const raw = hiddenPriceInput.value?.toString().trim() || "";
                const num = Number(raw.replace(/[^\d.-]/g, ""));
                price = Number.isFinite(num) ? num : 0;
            } else {
                const priceText = div.querySelector(".price___nNUAv span:first-child")?.textContent?.replace(/[^\d]/g, "") || "";
                price = priceText ? parseInt(priceText, 10) : 0;
            }

            const nameContainer = div.querySelector(".name___XmQWk");
            const imgContainer = div.querySelector(".imageWrapper___y3aj7");
            const priceContainer = div.querySelector(".price___nNUAv");
            if (!nameContainer || !imgContainer || !priceContainer) return;

            const btn = createButton("Extract", async () => {
                try {
                    const obj = await fetchItemData(uid, price);
                    callback(obj);
                } catch (e) {
                    console.error("Error extracting item:", e);
                }
            });
            btn.classList.add("tm-extract-btn");
            btn.style.fontSize = "11px";
            btn.style.padding = "4px 8px";
            btn.style.borderRadius = "4px";
            btn.style.cursor = "pointer";
            btn.style.border = "1px solid #555";

            const applyLayout = () => {
                if (window.innerWidth <= 784) {
                    btn.addEventListener("mouseleave", () => (btn.style.backgroundColor = "transparent"));
                    btn.style.color = "#fff";
                    btn.style.backgroundColor = "transparent";
                    btn.style.position = "absolute";
                    btn.style.bottom = "5px";
                    btn.style.right = "2px";
                    btn.style.marginLeft = "0";
                    nameContainer.style.display = "";
                    imgContainer.style.position = "relative";
                    if (!imgContainer.contains(btn)) imgContainer.appendChild(btn);
                } else {
                    btn.style.color = "#000";
                    btn.style.backgroundColor = "#f39c12";
                    btn.style.position = "static";
                    btn.style.marginLeft = "0";
                    nameContainer.style.display = "inline-flex";
                    nameContainer.style.alignItems = "center";
                    if (!priceContainer.contains(btn)) {
                        priceContainer.innerHTML = "";
                        priceContainer.appendChild(btn);
                    }
                }
            };

            applyLayout();
            window.addEventListener("resize", applyLayout);
        });
    }

    function findBazaarShowListingItem(name, damage, accuracy) {
        if (!Array.isArray(BazaarShowListingData) || BazaarShowListingData.length === 0) {
            console.warn("BazaarShowListingData is empty or undefined");
            return null;
        }

        const match = BazaarShowListingData.find(item =>
            item.name === name &&
            Number(item.damage) === Number(damage) &&
            Number(item.accuracy) === Number(accuracy)
        );

        return match || null;
    }

    function initShowListingBazaarMode() {
        document.querySelectorAll('.item___jLJcf').forEach(div => {
            if (div.querySelector('.tm-extract-btn')) return;

            const imgContainer = div.querySelector('.imgContainer___tEZeE');
            if (!imgContainer) return;
            if (!/(glow-(yellow|orange|red))/.test(imgContainer.className)) return;

            const name = div.getAttribute('aria-label') || 'Unknown item';

            const dataTestId = div.getAttribute('data-testid');
            const uid = dataTestId ? dataTestId.replace('item-', '') : name;

            let price = 0;
            const hiddenPriceInput = div.querySelector('.price___DoKP7 .input-money-group input.input-money[type="hidden"]');
            if (hiddenPriceInput) {
                const raw = hiddenPriceInput.value?.toString().trim() || "";
                const num = Number(raw.replace(/[^\d.-]/g, ""));
                price = Number.isFinite(num) ? num : 0;
            }

            const damageDiv = div.querySelector('.damageBonusIcon___MSlMm');
            const accuracyDiv = div.querySelector('.accuracyBonusIcon___p4tfD');

            let damage = null;
            let accuracy = null;

            if (damageDiv) {
                const val = damageDiv.closest('.bonus___W7sO3')?.querySelector('.bonusValue____jVoc')?.textContent?.trim();
                damage = val ? parseFloat(val) : null;
            }

            if (accuracyDiv) {
                const val = accuracyDiv.closest('.bonus___W7sO3')?.querySelector('.bonusValue____jVoc')?.textContent?.trim();
                accuracy = val ? parseFloat(val) : null;
            }

            const descContainer = div.querySelector('.desc___VJSNQ');
            const priceContainer = div.querySelector('.rrp___aiQg2');
            if (!descContainer) return;

            const btn = createButton('Extract', async () => {
                callback(findBazaarShowListingItem(name, damage, accuracy));
            });
            btn.classList.add('tm-extract-btn');
            btn.style.fontSize = '11px';
            btn.style.padding = "4px 8px";
            btn.style.borderRadius = '4px';
            btn.style.color = '#000';
            btn.style.cursor = 'pointer';
            btn.style.border = '1px solid #555';
            btn.style.marginLeft = '8px';

            if (window.innerWidth <= 784) {
                descContainer.style.display = 'inline-flex';
                descContainer.style.alignItems = 'center';
                //if (!descContainer.contains(btn)) descContainer.appendChild(btn);
            } else {
                priceContainer.innerHTML = '';
                priceContainer.appendChild(btn);
            }
        });
    }

    function initAddListingBazaarMode() {
        document.querySelectorAll('.items-cont li.clearfix').forEach(li => {
            if (li.querySelector('.tm-extract-btn')) return;

            if (window.innerWidth <= 784) {
                const checkbox = li.querySelector('input[type="checkbox"][id^="undefined-"]');
                let uid = null;

                if (checkbox) {
                    const idMatch = checkbox.id.match(/(\d+)$/);
                    if (idMatch) uid = idMatch[1];
                }

                if (!uid) {
                    const match = li.getAttribute("data-reactid")?.match(/\$(\d+)/);
                    if (match) uid = match[1];
                }
                if (!uid) return;

                const imageWrap = li.querySelector('.image-wrap');
                if (!imageWrap) return;

                const glowMatch = imageWrap.className.match(/glow-(\w+)/);
                if (!glowMatch) return;

                const titleContainer = li.querySelector('.title-wrap');
                if (!titleContainer) return;

                const btn = createButton("Extract", async () => {
                    try {
                        const obj = await fetchItemData(uid);
                        callback(obj);
                    } catch (e) {
                        console.error("Error extracting item:", e);
                    }
                });
                btn.classList.add("tm-extract-btn");
                btn.style.padding = "4px 8px";
                btn.style.fontSize = "11px";
                btn.style.fontWeight = "600";
                btn.style.border = "1px solid #555";
                btn.style.borderRadius = "4px";
                btn.addEventListener("mouseleave", () => (btn.style.backgroundColor = "transparent"));
                btn.style.color = "#fff";
                btn.style.backgroundColor = "transparent";
                btn.style.cursor = "pointer";
                btn.style.boxShadow = "0 1px 4px rgba(0,0,0,0.4)";
                btn.style.transition = "0.2s";
                btn.style.position = "absolute";
                btn.style.bottom = "5px";
                btn.style.left = "2px";
                titleContainer.style.position = "relative";

                titleContainer.appendChild(btn);
                return;
            }


            const imageWrap = li.querySelector('.image-wrap');
            if (!imageWrap) return;

            const glowMatch = imageWrap.className.match(/glow-(\w+)/);
            if (!glowMatch) return;
            const rarity = glowMatch[1];

            const checkbox = li.querySelector('input[type="checkbox"][id^="undefined-"]');
            if (!checkbox) return;
            const idMatch = checkbox.id.match(/(\d+)$/);
            if (!idMatch) return;
            const uid = idMatch[1];

            const img = li.querySelector('.image-wrap img');
            let itemId = null;
            if (img) {
                const match = img.src.match(/\/images\/items\/(\d+)\//);
                if (match) itemId = match[1];
            }

            let price = 0;
            const hiddenInput = li.querySelector('.input-money-group input.input-money[type="hidden"]');
            if (hiddenInput) {
                const raw = hiddenInput.value?.trim() || "";
                const num = Number(raw.replace(/[^\d.-]/g, ""));
                price = Number.isFinite(num) ? num : 0;
            }

            const nameContainer = li.querySelector('.name-wrap');
            const imgContainer = li.querySelector('.image-wrap');
            const name = nameContainer?.textContent?.trim() || 'Unknown';
            if (!nameContainer || !imgContainer) return;

            const btn = createButton("Extract", async () => {
                try {
                    const obj = {
                        id: uid,
                        itemId: itemId,
                        name,
                        price,
                        rarity,
                        damage: parseFloat(li.querySelector('.bonus-attachment-item-damage-bonus + span')?.textContent || "0"),
                        accuracy: parseFloat(li.querySelector('.bonus-attachment-item-accuracy-bonus + span')?.textContent || "0"),
                        bonuses: parseBonuses(li)
                    };
                    callback(obj);
                } catch (e) {
                    console.error("Error extracting item:", e);
                }
            });
            btn.classList.add("tm-extract-btn");
            btn.style.fontSize = "11px";
            btn.style.padding = "4px 8px";
            btn.style.borderRadius = "4px";
            btn.style.color = "#000";
            btn.style.cursor = "pointer";
            btn.style.border = "1px solid #555";

            const applyLayout = () => {
                btn.style.position = "static";
                btn.style.marginLeft = "8px";
                nameContainer.style.display = "inline-flex";
                nameContainer.style.alignItems = "center";
                if (!nameContainer.contains(btn)) nameContainer.appendChild(btn);
            };

            applyLayout();
            window.addEventListener("resize", applyLayout);
        });
    }

    function parseYMD(dateStr) {
        if (!dateStr) return null;
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d); // mois = 0-based
    }

    function indexItems(items) {
        for (const it of items) {
            const map = Object.create(null);
            for (const b of Object.values(it.bonuses || {})) {
                if (b?.type != null) map[b.type] = b.value;
            }

            it._bonusMap = map;
            it._soldTs = it.date_sold ? (parseYMD(it.date_sold)?.getTime() ?? null) : null;
            it._createdTs = it.created_date ? (parseYMD(it.created_date)?.getTime() ?? null) : null;
            it._priceNum = Number(it.price) || 0;
        }
    }

    function specialSort(items, bonusRef) {
        if (!bonusRef || !bonusRef.type || bonusRef.value == null) return items;

        const refType = bonusRef.type;
        const refValue = bonusRef.value;

        return items.slice().sort((a, b) => {
            const va = a._bonusMap?.[refType];
            const vb = b._bonusMap?.[refType];

            const distA = va != null ? Math.abs(va - refValue) : Infinity;
            const distB = vb != null ? Math.abs(vb - refValue) : Infinity;
            if (distA !== distB) return distA - distB;

            if (a._soldTs != null || b._soldTs != null) {
                if (a._soldTs == null) return 1;
                if (b._soldTs == null) return -1;
                if (a._soldTs !== b._soldTs) return b._soldTs - a._soldTs;
            }

            if (a._createdTs != null || b._createdTs != null) {
                if (a._createdTs == null) return 1;
                if (b._createdTs == null) return -1;
                if (a._createdTs !== b._createdTs) return b._createdTs - a._createdTs;
            }

            return a._priceNum - b._priceNum;
        });
    }

    function normalizeListing(name, listing, itemId) {
        const bonuses = {};
        if (listing.item_details?.bonuses?.length) {
            listing.item_details.bonuses.forEach((b, idx) => {
                bonuses['bonus' + (idx + 1)] = {
                    type: b.title,
                    value: b.value
                };
            });
        }

        return {
            liId: null,
            armouryId: listing.item_details?.uid || null,
            itemId: itemId,
            name: name,
            bonuses,
            quality: listing.item_details?.stats?.quality || null,
            damage: listing.item_details?.stats?.damage || null,
            accuracy: listing.item_details?.stats?.accuracy || null,
            price: listing.price,
            rarity: listing.item_details?.rarity || null
        };
    }

    function requestItemMarket(itemId, bonus) {
        return new Promise((resolve, reject) => {
            let allListings = [];
            let offset = 0;

            function fetchPage(currentOffset) {
                const url = `https://api.torn.com/v2/market/${itemId}/itemmarket?bonus=${bonus === "double" ? "Double" : bonus}&offset=${currentOffset}&key=${apiKey}`;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function (response) {
                        if (response.status !== 200) {
                            reject(new Error(`HTTP ${response.status}`));
                            return;
                        }

                        try {
                            const data = JSON.parse(response.responseText);

                            if (data.itemmarket?.listings?.length) {
                                allListings = allListings.concat(data.itemmarket.listings);
                            }

                            const nextLink = data._metadata?.links?.next;
                            if (nextLink) {
                                const match = nextLink.match(/offset=(\d+)/);
                                if (match) {
                                    const nextOffset = parseInt(match[1], 10);
                                    fetchPage(nextOffset);
                                    return;
                                }
                            }

                            resolve(allListings);

                        } catch (err) {
                            reject(err);
                        }
                    },
                    onerror: function (err) {
                        reject(err);
                    }
                });
            }

            fetchPage(offset);
        });
    }

    async function requestItemMarketNormalized(itemId, itemName, targetRarity, bonus) {
        const listings = await requestItemMarket(itemId, bonus.type);
        if (targetRarity === 'all') return listings.map(l => normalizeListing(itemName, l, itemId));
        return listings.map(l => normalizeListing(itemName, l, itemId)).filter(l => l.rarity === targetRarity);
    }

    function requestItemCSVNormalized(name = "", bonus = {}, targetRarity = "all") {
        if (!csvData || !Array.isArray(csvData)) return [];

        const filtered = csvData.filter(item => {
            try {
                if (targetRarity !== "all" && item.rarity.toLowerCase() !== targetRarity.toLowerCase()) {
                    return false;
                }

                if (name && item.name.toLowerCase() !== name.toLowerCase()) {
                    return false;
                }

                const bonuses = Object.values(item.bonuses || {});

                if (bonus.type === "double" && bonuses.length !== 2) {
                    return false;
                } else if (bonus.type === "double" && bonuses.length === 2) {
                    return true;
                } else {
                    if (bonuses.length !== 1) return false;
                    return bonuses[0].type.toLowerCase() === bonus.type.toLowerCase();
                }
            } catch (error) {
                return false;
            }
        });

        return specialSort(filtered, bonus);
    }

    function requestMugBotCSVNormalized(name = "", bonus = {}, targetRarity = "all") {
        if (!mugBotData || !Array.isArray(mugBotData)) return [];

        const filtered = mugBotData.filter(item => {
            try {
                if (targetRarity !== "all" && item.rarity.toLowerCase() !== targetRarity.toLowerCase()) {
                    return false;
                }

                if (name && item.name.toLowerCase() !== name.toLowerCase()) {
                    return false;
                }

                const bonuses = Object.values(item.bonuses || {});

                if (bonus.type === "double" && bonuses.length !== 2) {
                    return false;
                } else if (bonus.type === "double" && bonuses.length === 2) {
                    return true;
                } else {
                    if (bonuses.length !== 1) return false;
                    return bonuses[0].type.toLowerCase() === bonus.type.toLowerCase();
                }
            } catch (error) {
                return false;
            }
        });

        return specialSort(filtered, bonus);
    }

    function formatPriceShort(num) {
        if (num == null || isNaN(num)) return "-";
        const abs = Math.abs(num);

        if (abs >= 1e12) return (num / 1e12).toFixed(2) + "T";
        if (abs >= 1e9) return (num / 1e9).toFixed(2) + "B";
        if (abs >= 1e6) return (num / 1e6).toFixed(2) + "M";
        if (abs >= 1e3) return (num / 1e3).toFixed(2) + "K";

        return num.toFixed(2);
    }

    function getQualitySign(item) {
        if (!item || !item.rarity || item.quality == null) return "";

        const quality = item.quality;

        switch (item.rarity.toLowerCase()) {
            case "yellow":
                if (quality < 100) return "-";
                if (quality > 130) return "+";
                break;
            case "orange":
                if (quality < 160) return "-";
                if (quality > 190) return "+";
                break;
            case "red":
                if (quality < 230) return "-";
                if (quality > 280) return "+";
                break;
            default:
                return "";
        }

        return "";
    }

    class WeaponRanker {
        constructor(thisItem) {
            this.thisItem = thisItem;
            this.selectedBonus = this.getDefaultBonus();
            this.selectedRarity = thisItem.rarity.toLowerCase();
            this.sameWeaponList = [];
        }

        getDefaultBonus() {
            const bonuses = this.thisItem.bonuses || {};
            const keys = Object.keys(bonuses);

            if (keys.length === 1) {
                const b = bonuses[keys[0]];
                return {type: b.type, value: b.value};
            }

            if (keys.length > 1) return {type: "double", value: 1};

            return "none";
        }

        async loadMarket() {
            this.sameWeaponList = await requestItemMarketNormalized(
                this.thisItem.itemId,
                this.thisItem.name,
                this.selectedRarity,
                this.selectedBonus
            );
            this.renderMarketSection();
        }

        async renderKingsData() {
            const container = document.querySelector("#kings-data-section");
            if (!container) return;

            const sameWeaponSameBonus = await requestItemCSVNormalized(
                this.thisItem.name,
                this.selectedBonus,
                this.selectedRarity
            );

            const exactMatch = sameWeaponSameBonus.filter(item => {
                const bonusesA = Object.values(item.bonuses);
                const bonusesB = Object.values(this.thisItem.bonuses);

                if (bonusesA.length !== bonusesB.length) return false;

                return bonusesA.every(b1 =>
                    bonusesB.some(b2 => {
                        if (this.selectedBonus?.type === "double") {
                            return b1.type === b2.type;
                        }
                        return b1.type === b2.type && b1.value === b2.value;
                    })
                );
            });


            const sameWeaponDiffValue = sameWeaponSameBonus.filter(item => {
                const b = Object.values(item.bonuses).find(b => b.type === this.selectedBonus.type);
                return b && b.value !== this.selectedBonus.value;
            });

            let sameBonusOnly = await requestItemCSVNormalized(
                "",
                this.selectedBonus,
                this.selectedRarity
            );

            sameBonusOnly = sameBonusOnly.filter(item => {
                const isInExactMatch = exactMatch.some(exact => {
                    return exact.name === item.name &&
                        Number(exact.damage) === Number(this.thisItem.damage) &&
                        Number(exact.accuracy) === Number(this.thisItem.accuracy) &&
                        JSON.stringify(exact.bonuses) === JSON.stringify(item.bonuses);
                });

                if (this.selectedBonus.type === "double") {
                    const itemBonuses = Object.values(item.bonuses);
                    const thisBonuses = Object.values(this.thisItem.bonuses);

                    const bonusTypesMatch = itemBonuses.length === thisBonuses.length &&
                        itemBonuses.every(b1 => thisBonuses.some(b2 => b1.type === b2.type));

                    return !isInExactMatch && bonusTypesMatch;
                }

                return !isInExactMatch;
            });

            container.innerHTML = `
        <div class="torn-card" style="margin-bottom: 8px">
                        <h4>Exact match</h4>
                        <div>${this.formatList(exactMatch, true)}</div>
                    </div>
            <div style="display:flex; gap:20px; flex-wrap:wrap;">
                <div class="torn-card" style="flex:1;">
                    <h4>Same Weapon + Same Bonus</h4>
                    ${this.formatList(sameWeaponDiffValue)}
                </div>
                <div class="torn-card" style="flex:1;">
                    <h4>Same Bonus</h4>
                    ${this.formatList(sameBonusOnly)}
                </div>
            </div>
        `;
            let priceColor = "";
            if (exactMatch.length && this.thisItem.price != null) {
                const prices = exactMatch.map(it => it.price).filter(p => typeof p === "number" && p > 0);
                if (prices.length) {
                    const sorted = prices.slice().sort((a, b) => a - b);
                    const mid = Math.floor(sorted.length / 2);
                    const median = (sorted.length % 2 === 0) ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
                    const minPrice = sorted[0];

                    if (this.thisItem.price < minPrice) priceColor = "green";
                    else if (this.thisItem.price <= median) priceColor = "yellow";
                    else priceColor = "red";
                }
            }

            const current_price = document.querySelector("#tornModal .torn-auction-current-price");
            if (current_price) {
                current_price.style.color = priceColor;
            }

            container.querySelectorAll(".torn-list li .item-main").forEach(row => {
                row.addEventListener("click", () => {
                    const detailsDiv = row.nextElementSibling;
                    if (detailsDiv) {
                        detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
                    }
                });
            });
        }

        async renderMugBotData() {
            const container = document.querySelector("#mugbot-data-section");
            if (!container) return;

            const sameWeaponSameBonus = await requestMugBotCSVNormalized(
                this.thisItem.name,
                this.selectedBonus,
                "all"
            );

            const exactMatch = sameWeaponSameBonus.filter(item => {
                const bonusesA = Object.values(item.bonuses);
                const bonusesB = Object.values(this.thisItem.bonuses);

                if (bonusesA.length !== bonusesB.length) return false;

                return bonusesA.every(b1 =>
                    bonusesB.some(b2 => {
                        if (this.selectedBonus?.type === "double") {
                            return b1.type === b2.type;
                        }
                        return b1.type === b2.type && b1.value === b2.value;
                    })
                );
            });


            const sameWeaponDiffValue = sameWeaponSameBonus.filter(item => {
                const b = Object.values(item.bonuses).find(b => b.type === this.selectedBonus.type);
                return b && b.value !== this.selectedBonus.value;
            });

            let sameBonusOnly = await requestMugBotCSVNormalized(
                "",
                this.selectedBonus,
                "all"
            );
            sameBonusOnly = sameBonusOnly.filter((e) => e.name != this.thisItem.name);

            sameBonusOnly = sameBonusOnly.filter(item => {
                const isInExactMatch = exactMatch.some(exact => {
                    return exact.name === item.name &&
                        Number(exact.damage) === Number(this.thisItem.damage) &&
                        Number(exact.accuracy) === Number(this.thisItem.accuracy) &&
                        JSON.stringify(exact.bonuses) === JSON.stringify(item.bonuses);
                });

                if (this.selectedBonus.type === "double") {
                    const itemBonuses = Object.values(item.bonuses);
                    const thisBonuses = Object.values(this.thisItem.bonuses);

                    const bonusTypesMatch = itemBonuses.length === thisBonuses.length &&
                        itemBonuses.every(b1 => thisBonuses.some(b2 => b1.type === b2.type));

                    return !isInExactMatch && bonusTypesMatch;
                }

                return !isInExactMatch;
            });

            container.innerHTML = `
        <div class="torn-card" style="margin-bottom: 8px">
                        <h4>Exact match</h4>
                        <div>${this.formatList(exactMatch, true)}</div>
                    </div>
            <div style="display:flex; gap:20px; flex-wrap:wrap;">
                <div class="torn-card" style="flex:1;">
                    <h4>Same Weapon + Same Bonus</h4>
                    ${this.formatList(sameWeaponDiffValue)}
                </div>
                <div class="torn-card" style="flex:1;">
                    <h4>Same Bonus</h4>
                    ${this.formatList(sameBonusOnly)}
                </div>
            </div>
        `;
            let priceColor = "";
            if (exactMatch.length && this.thisItem.price != null) {
                const prices = exactMatch.map(it => it.price).filter(p => typeof p === "number" && p > 0);
                if (prices.length) {
                    const sorted = prices.slice().sort((a, b) => a - b);
                    const mid = Math.floor(sorted.length / 2);
                    const median = (sorted.length % 2 === 0) ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
                    const minPrice = sorted[0];

                    if (this.thisItem.price < minPrice) priceColor = "green";
                    else if (this.thisItem.price <= median) priceColor = "yellow";
                    else priceColor = "red";
                }
            }

            container.querySelectorAll(".torn-list li .item-main").forEach(row => {
                row.addEventListener("click", () => {
                    const detailsDiv = row.nextElementSibling;
                    if (detailsDiv) {
                        detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
                    }
                });
            });
        }

        renderMarketSection() {
            const list = this.sameWeaponList;
            const prices = list.map(it => it.price).filter(p => typeof p === "number" && p > 0);
            const mean = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
            const min = prices.length ? Math.min(...prices) : 0;
            const max = prices.length ? Math.max(...prices) : 0;
            let median = 0;
            if (prices.length) {
                const sorted = prices.slice().sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                median = (sorted.length % 2 === 0) ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
            }

            const container = document.querySelector("#market-section");
            if (container) {
                container.innerHTML = `
                    <div class="torn-market-meta" style="display:flex; gap:20px; flex-wrap:wrap;">
                        <p><b>Mean Price:</b> $${formatPriceShort(mean)}</p>
                        <p><b>Median Price:</b> $${formatPriceShort(median)}</p>
                        <p><b>Range:</b> $${formatPriceShort(min)} - $${formatPriceShort(max)}</p>
                    </div>
                    <div class="torn-card">
                        <h4>Weapon Ranking</h4>
                        <div id="weapon-ranking">${this.formatList(list)}</div>
                    </div>
                `;

                container.querySelectorAll(".torn-list li .item-main").forEach(row => {
                    row.addEventListener("click", () => {
                        const detailsDiv = row.nextElementSibling;
                        if (detailsDiv) {
                            detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
                        }
                    });
                });
            }
        }

        formatList(list, exact = false) {
            return `
            <div class="torn-list-container">
                <ul class="torn-list">
                    ${list.map((it, i) => {
                let isDuplicate = false;
                if (exact) {
                    isDuplicate =
                        it.name === this.thisItem.name &&
                        Number(it.damage) === Number(this.thisItem.damage) &&
                        Number(it.accuracy) === Number(this.thisItem.accuracy) &&
                        JSON.stringify(it.bonuses) === JSON.stringify(this.thisItem.bonuses);
                }

                return `
                        <li class="${it.armouryId === this.thisItem.armouryId ? "torn-highlight" : ""}">
                            <div class="item-main" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                                <span class="item-title" style="color:${isDuplicate ? "orange" : "inherit"}">
                                    #${i + 1} ${it.name || "Unknown"} •
                                    ${it.bonuses?.bonus1?.type || ""} ${it.bonuses?.bonus1?.value ? it.bonuses?.bonus1.value + '%' : ""}
                                    ${it.bonuses?.bonus2?.type ? "& " + it.bonuses?.bonus2?.type : ""} ${it.bonuses?.bonus2?.value ? it.bonuses?.bonus2?.value + '%' : ""}
                                    ${getQualitySign(it)}
                                </span>
                                <span class="item-price" style="margin-left:auto; font-weight:bold;">
                                    $${formatPriceShort(it.price)}
                                </span>
                            </div>
                            <div class="item-details" style="display:none; font-size:12px; color:#ccc; margin-top:5px; padding-left:10px;">
                                Damage: ${it.damage || "-"} • Accuracy: ${it.accuracy || "-"} • Quality: ${it.quality || "-"} ${it.date_sold ? `• Date Sold: ${it.date_sold}`: ""} ${it.seller ? `• Seller: ${it.seller}`: ""}
                            </div>
                        </li>
                        `;
            }).join("")}
                </ul>
            </div>
            `;
        }

        renderModal() {
            const bonusKeys = Object.keys(this.thisItem.bonuses);
            let bonusTags = "";
            if (bonusKeys.length === 1) {
                const b = this.thisItem.bonuses[bonusKeys[0]];
                bonusTags = `<span class="torn-bonus-tag active" data-bonus="${b.type}" data-bonus-value="${b.value}">${b.type}: ${b.value}%</span>`;
            } else if (bonusKeys.length > 1) {
                const bonusItems = bonusKeys.map(key => {
                    const b = this.thisItem.bonuses[key];
                    return `<span class="torn-bonus-tag" data-bonus="${b.type}" data-bonus-value="${b.value}">${b.type}: ${b.value}</span>`;
                }).join(" ");
                bonusTags = bonusItems + ` <span class="torn-bonus-tag active" data-bonus="double" data-bonus-value="1">Double</span>`;
            }

            const rarityTags = ['Yellow', 'Orange', 'Red', 'All'].map(r => {
                const isActive = r.toLowerCase() === this.selectedRarity;
                return `<span class="torn-rarity-tag ${isActive ? 'active' : ''}" data-rarity="${r.toLowerCase()}">${r}</span>`;
            }).join(" ");

            const content = `
                    <h3>Item Details</h3>
                    <div class="torn-details">
                        ${this.thisItem.name} • Damage: ${this.thisItem.damage} • Accuracy: ${this.thisItem.accuracy} • <span class="torn-auction-current-price">Price: $${formatPriceShort(this.thisItem.price)}</span>
                        <div style="margin:5px 0; font-size:13px; color:#ccc;">
                            Select the bonus: ${bonusTags}<br>
                            Select the rarity: ${rarityTags}
                        </div>
                    </div>
                    <hr>
                    <h3>Market Overview</h3>
                    <div id="market-section"></div>
                    <hr>
                    <h3 style="margin-bottom: 10px">King's Data</h3>
                    <div id="kings-data-section"></div>
                    <hr>
                    <h3 style="margin-bottom: 10px">MugBot's Data</h3>
                    <div id="mugbot-data-section"></div>
                `;

            createModal(content);

            document.querySelectorAll(".torn-bonus-tag").forEach(tag => {
                tag.addEventListener("click", async () => {
                    document.querySelectorAll(".torn-bonus-tag").forEach(t => t.classList.remove("active"));
                    tag.classList.add("active");
                    this.selectedBonus = {
                        type: tag.dataset.bonus,
                        value: parseFloat(tag.dataset.bonusValue)
                    };
                    await this.loadMarket();
                    await this.renderKingsData();
                    await this.renderMugBotData();
                });
            });

            document.querySelectorAll(".torn-rarity-tag").forEach(tag => {
                tag.addEventListener("click", async () => {
                    document.querySelectorAll(".torn-rarity-tag").forEach(t => t.classList.remove("active"));
                    tag.classList.add("active");
                    this.selectedRarity = tag.dataset.rarity;
                    await this.loadMarket();
                    await this.renderKingsData();
                    await this.renderMugBotData();
                });
            });
        }

        async open() {
            this.renderModal();
            await this.loadMarket();
            await this.renderKingsData();
            await this.renderMugBotData();
        }
    }

    function createModal(contentHtml) {
        const old = document.querySelector("#tornModal");
        if (old) old.remove();

        const modal = document.createElement("div");
        modal.id = "tornModal";
        modal.innerHTML = `
                <div class="torn-modal-window">
                    <div class="torn-modal-header">
                        <h2>Weapon Ranker</h2>
                        <button class="torn-close-btn">&times;</button>
                    </div>
                    <div class="torn-modal-body">
                        ${contentHtml}
                    </div>
                </div>
            `;
        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add("show"), 10);

        const closeModal = () => modal.remove();

        modal.querySelector(".torn-close-btn").onclick = closeModal;

        const escHandler = (e) => {
            if (e.key === "Escape") closeModal();
        };
        document.addEventListener("keydown", escHandler);

        const observer = new MutationObserver(() => {
            if (!document.body.contains(modal)) {
                document.removeEventListener("keydown", escHandler);
                observer.disconnect();
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});
    }

    async function callback(itemData) {
        if (itemData.price === null) itemData.price = 0;
        const ranker = new WeaponRanker(itemData);
        await ranker.open();
    }

    function debounce(fn, delay = 300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    function router() {
        for (const route of ROUTES) {
            if (ROUTE_FLAGS[route.key]) continue;

            if (route.match(path, hash)) {
                route.init();
                return;
            }
        }
    }

    const observer = new MutationObserver(debounce(router, 100));
    observer.observe(document.body, {childList: true, subtree: true});
    window.addEventListener("hashchange", router);
    window.addEventListener("popstate", router);
    router();
    csvData = await getCSVDataCached();
    indexItems(csvData);
    mugBotData = await getMugBotDataCached();
    indexItems(mugBotData);
})();