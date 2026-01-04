// ==UserScript==
// @name         Ups Auction Estimator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Help to find great deals in auction.
// @author       Upsilon[3212478]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/550563/Ups%20Auction%20Estimator.user.js
// @updateURL https://update.greasyfork.org/scripts/550563/Ups%20Auction%20Estimator.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const apiKey = "npOAUcChFetkTZJC";
    const csvLink = "https://pub-e8ca0dd94cf8446b9d07669042f4ec4c.r2.dev/auction_data.csv";
    let csvData = [];

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
                            const timeAddedStr = clean(raw["Time Added"]);
                            let created_date = null;

                            if (dateAddedStr && timeAddedStr) {
                                const [day, month, year] = dateAddedStr.split('/').map(Number);
                                const [hour, minute] = timeAddedStr.split(':').map(Number);
                                created_date = new Date(year, month - 1, day, hour, minute);
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
                                created_date: created_date
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

    function htmlDecode(input) {
        const doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent || '';
    }

    function parseBonuses(li) {
        const bonuses = {};
        const icons = li.querySelectorAll('.iconsbonuses .bonus-attachment-icons');
        let idx = 1;

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

    function parseItem(li) {
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

    function addButtons() {
        document.querySelectorAll('ul.items-list li').forEach(li => {
            const sellerWrap = li.querySelector('.seller-wrap');
            if (sellerWrap && !sellerWrap.querySelector('.tm-extract-btn')) {
                addButtonToContainer(sellerWrap, li, false);
            }

            const mobWrap = li.querySelector('.mob-wrap');
            if (mobWrap && !mobWrap.querySelector('.tm-extract-btn')) {
                addButtonToContainer(mobWrap, li, true);
            }
        });
    }

    function addButtonToContainer(container, li, mobile) {
        container.style.position = container.style.position || 'relative';

        let btnWrap = document.createElement('div');

        if (mobile) {
            btnWrap.style.position = 'absolute';
            btnWrap.style.top = '-50px';
            btnWrap.style.right = '70px';
            btnWrap.style.zIndex = '10';
        } else {
            btnWrap.style.position = 'absolute';
            btnWrap.style.top = '50%';
            btnWrap.style.right = '10px';
            btnWrap.style.transform = 'translateY(-50%)';
            btnWrap.style.zIndex = '10';
        }

        const btn = document.createElement('button');
        btn.className = 'tm-extract-btn';
        btn.type = 'button';
        btn.textContent = 'Extract';

        btn.style.padding = '6px 12px';
        btn.style.fontSize = '13px';
        btn.style.fontWeight = '600';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.backgroundColor = '#f39c12';
        btn.style.color = '#000';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        btn.style.transition = 'all 0.2s ease';

        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = '#e67e22';
            btn.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = '#f39c12';
            btn.style.transform = 'scale(1)';
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const data = parseItem(li);
            callback(data);
        });

        if (mobile) {
            btnWrap.appendChild(btn);
            container.appendChild(btnWrap);
        } else {
            btnWrap.appendChild(btn);
            container.appendChild(btnWrap);
        }
    }

    function specialSort(items, bonusRef) {
        if (!bonusRef || !bonusRef.type || bonusRef.value == null) {
            return items;
        }

        const refValue = bonusRef.value;

        return items.slice().sort((a, b) => {
            const getItemBonusValue = (item) => {
                const b = Object.values(item.bonuses || {}).find(b => b.type === bonusRef.type);
                return b ? b.value : null;
            };

            const valA = getItemBonusValue(a);
            const valB = getItemBonusValue(b);

            const aSameBonus = valA != null && valA === refValue;
const bSameBonus = valB != null && valB === refValue;

if (aSameBonus && !bSameBonus) return -1;
if (!aSameBonus && bSameBonus) return 1;

return (a.price || Infinity) - (b.price || Infinity);
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
                const url = `https://api.torn.com/v2/market/${itemId}/itemmarket?bonus=${bonus}&offset=${currentOffset}&key=${apiKey}`;

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
        if (targetRarity === 'all') return specialSort(listings.map(l => normalizeListing(itemName, l, itemId)), bonus);
        return specialSort(listings.map(l => normalizeListing(itemName, l, itemId)).filter(l => l.rarity === targetRarity), bonus);
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
                const bonusCount = bonuses.length;

                if (bonus.type === "double") {
                    return bonusCount === 2;
                } else if (bonus.type) {
                    return (
                        bonusCount === 1 &&
                        bonuses[0].type.toLowerCase() === bonus.type.toLowerCase()
                    );
                }

                return true;
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
        if (!item || !item.rarity || item.quality == null) return null;

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

            if (keys.length > 1) return "double";

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
                const b = Object.values(item.bonuses).find(b => b.type === this.selectedBonus.type);
                return b && b.value === this.selectedBonus.value;
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
                return !exactMatch.some(exact =>
                    exact.name === item.name &&
                    Number(exact.damage) === Number(this.thisItem.damage) &&
                    Number(exact.accuracy) === Number(this.thisItem.accuracy) &&
                    JSON.stringify(exact.bonuses) === JSON.stringify(item.bonuses)
                );
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
                            ${it.bonuses.bonus1?.type || ""} ${it.bonuses.bonus1?.value ? it.bonuses.bonus1.value + '%' : ""}
                            ${it.bonuses.bonus2?.type ? "& " + it.bonuses.bonus2?.type : ""} ${it.bonuses.bonus2?.value ? it.bonuses.bonus2?.value + '%' : ""}
                            ${getQualitySign(it)}
                        </span>
                        <span class="item-price" style="margin-left:auto; font-weight:bold;">
                            $${formatPriceShort(it.price)}
                        </span>
                    </div>
                    <div class="item-details" style="display:none; font-size:12px; color:#ccc; margin-top:5px; padding-left:10px;">
                        Damage: ${it.damage || "-"} • Accuracy: ${it.accuracy || "-"} • Quality: ${it.quality || "-"}
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
                });
            });

            document.querySelectorAll(".torn-rarity-tag").forEach(tag => {
                tag.addEventListener("click", async () => {
                    document.querySelectorAll(".torn-rarity-tag").forEach(t => t.classList.remove("active"));
                    tag.classList.add("active");
                    this.selectedRarity = tag.dataset.rarity;
                    await this.loadMarket();
                    await this.renderKingsData();
                });
            });
        }

        async open() {
            this.renderModal();
            await this.loadMarket();
            await this.renderKingsData();
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

    const observer = new MutationObserver(() => {
        addButtons();
    });
    observer.observe(document.body, {childList: true, subtree: true});
    csvData = await getCSVData();
})();