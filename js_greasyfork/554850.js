// ==UserScript==
// @name         Bunker Buck Collector
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Highlights Weapons and Armor below set BB limit for BB exchange + cache selling profit.
// @author       Allenone [2033011]
// @contributor  RyukTheKami [2995048]
// @license MIT
// @match        https://www.torn.com/amarket.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554850/Bunker%20Buck%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/554850/Bunker%20Buck%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURABLE SETTINGS
    const CONFIG_STORAGE_KEY = 'BBC_CONFIG';
    const DEFAULT_CONFIG = { API_KEY: '', PDA_APIKey: "###PDA-APIKEY###", BB_Margin: 0.05, BB_Value_Override: false, BB_VALUE: 5000000 };
    function loadConfig(){
        try { const raw = localStorage.getItem(CONFIG_STORAGE_KEY); if (raw) { const obj = JSON.parse(raw); return Object.assign({}, DEFAULT_CONFIG, obj); } }
        catch(e) {}
        return { ...DEFAULT_CONFIG };
    }
    function applyConfig(cfg){
        API_KEY = cfg.API_KEY;
        PDA_APIKey = cfg.PDA_APIKey;
        BB_Margin = cfg.BB_Margin;
        BB_Value_Override = cfg.BB_Value_Override;
        BB_VALUE = cfg.BB_VALUE;
    }
    function saveConfig(updates){ CONFIG = Object.assign({}, CONFIG, updates||{}); localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(CONFIG)); applyConfig(CONFIG); }
    let CONFIG = loadConfig();
    let API_KEY, PDA_APIKey, BB_Margin, BB_Value_Override, BB_VALUE;
    applyConfig(CONFIG);

    const CACHE_PREFIX = 'BBC_'; // ;)
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Define a map of weapon names to weapon types
    const weaponTypeMap = {
        // Melee Weapons
        "Axe": "Clubbing",
        "Baseball Bat": "Clubbing",
        "Bo Staff": "Clubbing",
        "Butterfly Knife": "Piercing",
        "Chain Whip": "Slashing",
        "Claymore Sword": "Slashing",
        "Cricket Bat": "Clubbing",
        "Crowbar": "Clubbing",
        "Dagger": "Piercing",
        "Diamond Bladed Knife": "Piercing",
        "Flail": "Clubbing",
        "Frying Pan": "Clubbing",
        "Guandao": "Slashing",
        "Hammer": "Clubbing",
        "Kama": "Slashing",
        "Katana": "Slashing",
        "Kodachi": "Slashing",
        "Kitchen Knife": "Piercing",
        "Knuckle Dusters": "Clubbing",
        "Leather Bullwhip": "Slashing",
        "Macana": "Piercing",
        "Metal Nunchakus": "Clubbing",
        "Naval Cutlass": "Slashing",
        "Ninja Claws": "Piercing",
        "Pen Knife": "Piercing",
        "Sai": "Piercing",
        "Samurai Sword": "Slashing",
        "Scimitar": "Slashing",
        "Spear": "Piercing",
        "Swiss Army Knife": "Piercing",
        "Wooden Nunchakus": "Clubbing",
        "Yasukuni Sword": "Slashing",
        "Metal Nunchaku": "Clubbing",
        "Wooden Nunchaku": "Clubbing",

        // Pistols
        "Beretta 92FS": "Pistol",
        "Beretta M9": "Pistol",
        "Cobra Derringer": "Pistol",
        "Desert Eagle": "Pistol",
        "Fiveseven": "Pistol",
        "Glock 17": "Pistol",
        "Lorcin 380": "Pistol",
        "Luger": "Pistol",
        "Magnum": "Pistol",
        "Qsz-92": "Pistol",
        "Raven MP25": "Pistol",
        "Ruger 57": "Pistol",
        "S&W Revolver": "Pistol",
        "Springfield 1911-A1": "Pistol",
        "Taurus": "Pistol",
        "USP": "Pistol",
        "Springfield 1911": "Pistol",

        // SMGs
        "9mm Uzi": "SMG",
        "AK74U": "SMG",
        "BT MP9": "SMG",
        "Bushmaster Carbon 15": "SMG",
        "MP 40": "SMG",
        "MP5 Navy": "SMG",
        "MP5k": "SMG",
        "P90": "SMG",
        "Skorpion": "SMG",
        "Thompson": "SMG",
        "TMP": "SMG",

        // Rifles
        "AK-47": "Rifle",
        "ArmaLite M-15A4 Rifle": "Rifle",
        "Enfield SA-80": "Rifle",
        "Heckler & Koch SL8": "Rifle",
        "M16 A2 Rifle": "Rifle",
        "M4A1 Colt Carbine": "Rifle",
        "SIG 552": "Rifle",
        "SKS Carbine": "Rifle",
        "Steyr AUG": "Rifle",
        "Tavor TAR-21": "Rifle",
        "Vektor CR-21": "Rifle",
        "XM8 Rifle": "Rifle",
        "ArmaLite M-15A4": "Rifle",

        // Shotguns
        "Benelli M1 Tactical": "Shotgun",
        "Benelli M4 Super": "Shotgun",
        "Blunderbuss": "Shotgun",
        "Ithaca 37": "Shotgun",
        "Jackhammer": "Shotgun",
        "Mag 7": "Shotgun",
        "Sawed-Off Shotgun": "Shotgun",

        // Machine Guns
        "M249 SAW": "Machine gun",
        "Minigun": "Machine gun",
        "Negev NG-5": "Machine gun",
        "PKM": "Machine gun",
        "Stoner 96": "Machine gun",

        // Heavy Artillery
        "China Lake": "Heavy Artillery",
        "Milkor MGL": "Heavy Artillery",
        "RPG Launcher": "Heavy Artillery",
        "SMAW Launcher": "Heavy Artillery",
        "Type 98 Anti Tank": "Heavy Artillery",

        // Special
        "Bread Knife": "Bread Knife",
        "Poison Umbrella": "Poison Umbrella",
        "Sledgehammer": "Sledgehammer",
        "Nock Gun": "Nock Gun",
        "Rheinmetall MG 3": "Rheinmetall MG 3",
        "Snow Cannon": "Snow Cannon",
        "Hazmat Suit": "Hazmat Suit",
        "Handbag": "Handbag",
        "Pink Mac-10": "Pink Mac-10",
        "Dual TMPs": "Dual TMPs",
        "Dual Bushmasters": "Dual Bushmasters",
        "Dual MP5s": "Dual MP5s",
        "Dual P90s": "Dual P90s",
        "Dual Uzis": "Dual Uzis",
        "Gold Plated AK-47": "Gold Plated AK-47",

        // Riot Armor
        "Riot Gloves": "Armor",
        "Riot Body": "Armor",
        "Riot Pants": "Armor",
        "Riot Boots": "Armor",
        "Riot Helmet": "Armor",

        // Assault Armor
        "Assault Gloves": "Armor",
        "Assault Body": "Armor",
        "Assault Pants": "Armor",
        "Assault Boots": "Armor",
        "Assault Helmet": "Armor",

        // Dune Armor
        "Dune Gloves": "Armor",
        "Dune Vest": "Armor",
        "Dune Pants": "Armor",
        "Dune Boots": "Armor",
        "Dune Helmet": "Armor",

        // Marauder Armor
        "Marauder Gloves": "Armor",
        "Marauder Body": "Armor",
        "Marauder Pants": "Armor",
        "Marauder Boots": "Armor",
        "Marauder Face Mask": "Armor",

        // Vanguard Armor
        "Vanguard Gloves": "Armor",
        "Vanguard Body": "Armor",
        "Vanguard Pants": "Armor",
        "Vanguard Boots": "Armor",
        "Vanguard Helmet": "Armor",

        // Delta Armor
        "Delta Gloves": "Armor",
        "Delta Body": "Armor",
        "Delta Pants": "Armor",
        "Delta Boots": "Armor",
        "Delta Helmet": "Armor",

        // Sentinel Armor
        "Sentinel Gloves": "Armor",
        "Sentinel Body": "Armor",
        "Sentinel Pants": "Armor",
        "Sentinel Boots": "Armor",
        "Sentinel Helmet": "Armor",

        // EOD Armor
        "EOD Gloves": "Armor",
        "EOD Apron": "Armor",
        "EOD Pants": "Armor",
        "EOD Boots": "Armor",
        "EOD Helmet": "Armor",
    };

    // quality multipliers
    const qualityMultipliers = {
        Yellow: 1,
        Orange: 3,
        OrangeTwoEffects: 4.5,
        Red: 9,
        RedTwoEffects: 13.5,
    };

    const weaponValueMap = {
        "Clubbing": 6,
        "Piercing": 6,
        "Slashing": 6,
        "Pistol": 4,
        "SMG": 4,
        "Rifle": 10,
        "Shotgun": 10,
        "Heavy Artillery": 14,
        "Machine gun": 14,
        "Armor": 12,
        "Bread Knife": 6,
        "Poison Umbrella": 6,
        "Sledgehammer": 6,
        "Nock Gun": 10,
        "Rheinmetall MG 3": 14,
        "Snow Cannon": 14,
        "Hazmat Suit": 50,
        "Handbag": 100,
        "Pink Mac-10": 150,
        "Dual TMPs": 200,
        "Dual Bushmasters": 200,
        "Dual MP5s": 200,
        "Dual P90s": 200,
        "Dual Uzis": 200,
        "Gold Plated AK-47": 200,
    };

    const cacheBBValue = {
        "Armor Cache": 60,
        "Melee Cache": 30,
        "Small Arms Cache": 20,
        "Medium Arms Cache": 50,
        "Heavy Arms Cache": 70
    }

    function injectStyles() {
        if (document.getElementById('bbc-style')) return;
        const style = document.createElement('style');
        style.id = 'bbc-style';
        style.textContent = `
            .bbc-value{white-space:nowrap;display:inline-block;margin-left:6px;font-size:11px;color:#fff;opacity:.95;vertical-align:baseline}
            .bbc-config-btn{margin-left:8px;padding:2px 8px;font-size:12px;line-height:20px;border-radius:4px;background:#2b8a3e;color:#fff;border:0;cursor:pointer}
            .bbc-config-btn:hover{background:#256f34}
            .bbc-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9998;display:flex;align-items:center;justify-content:center}
            .bbc-modal{background:#222;border:1px solid #444;border-radius:6px;padding:12px 16px;min-width:320px;color:#ddd}
            .bbc-modal h3{margin:0 0 8px;font-size:16px;color:#fff}
            .bbc-form-row{display:flex;align-items:center;justify-content:space-between;margin:6px 0}
            .bbc-form-row input[type="text"],.bbc-form-row input[type="number"]{width:60%;padding:4px 6px;background:#111;color:#eee;border:1px solid #555;border-radius:4px}
            .bbc-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:10px}
            .bbc-actions button{padding:6px 10px;border-radius:4px;border:0;cursor:pointer}
            .bbc-actions .save{background:#2b8a3e;color:#fff}
            .bbc-actions .close{background:#555;color:#fff}
        `;
        document.head.appendChild(style);
    }

    function openConfigModal(){
        if (document.querySelector('.bbc-modal-backdrop')) return;
        injectStyles();
        const backdrop = document.createElement('div');
        backdrop.className = 'bbc-modal-backdrop';
        const modal = document.createElement('div');
        modal.className = 'bbc-modal';
        modal.innerHTML = `
            <h3>Bunker Buck Collector</h3>
            <div class="bbc-form-row"><label>Torn API Key</label><input id="bbc-api" type="text" value="${API_KEY||''}"></div>
            <div class="bbc-form-row"><label>TornPDA API Key</label><input id="bbc-pda" type="text" value="${PDA_APIKey||''}"></div>
            <div class="bbc-form-row"><label>BB Margin (e.g. 0.06)</label><input id="bbc-margin" type="number" step="0.001" min="0" value="${BB_Margin}"></div>
            <div class="bbc-form-row"><label>Use BB Override</label><input id="bbc-override" type="checkbox" ${BB_Value_Override?'checked':''}></div>
            <div class="bbc-form-row"><label>Static BB Value</label><input id="bbc-bb" type="number" step="1" min="0" value="${BB_VALUE}"></div>
            <div class="bbc-actions"><button class="close">Close</button><button class="save">Save</button></div>
        `;
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', (e)=>{ if(e.target===backdrop || e.target.classList.contains('close')) backdrop.remove(); });
        modal.querySelector('.save').addEventListener('click', ()=>{
            const updates = {
                API_KEY: modal.querySelector('#bbc-api').value.trim(),
                PDA_APIKey: modal.querySelector('#bbc-pda').value.trim(),
                BB_Margin: parseFloat(modal.querySelector('#bbc-margin').value)||0,
                BB_Value_Override: modal.querySelector('#bbc-override').checked,
                BB_VALUE: parseInt(modal.querySelector('#bbc-bb').value,10)||BB_VALUE,
            };
            saveConfig(updates);
            backdrop.remove();
            refreshItems();
        });
    }

    function injectConfigButton(){
        if (document.getElementById('bbc-config-btn')) return;
        const container = document.querySelector('#mainContainer > div.content-wrapper.autumn > div.content-title.m-bottom10');
        if (!container) return;
        const btn = document.createElement('button');
        btn.id = 'bbc-config-btn';
        btn.className = 'bbc-config-btn';
        btn.type = 'button';
        btn.textContent = 'Configure BBC';
        btn.addEventListener('click', openConfigModal);
        container.appendChild(btn);
    }

    function determineQualityMultiplier(itemClass, itemElement) {
        const quality = determineQualityFromClass(itemClass);
        const bonusCount = countItemBonuses(itemElement);
        let multiplier;

        switch (quality) {
            case 'Yellow':
                multiplier = qualityMultipliers.Yellow;
                break;
            case 'Orange':
                multiplier = bonusCount > 1 ? qualityMultipliers.OrangeTwoEffects : qualityMultipliers.Orange;
                break;
            case 'Red':
                multiplier = bonusCount > 1 ? qualityMultipliers.RedTwoEffects : qualityMultipliers.Red;
                break;
            default:
                console.warn(`Unknown quality class: ${itemClass}. Defaulting to Yellow multiplier.`);
                multiplier = qualityMultipliers.Yellow;
        }

        return multiplier;
    }

    function countItemBonuses(itemElement) {
        const bonusIcons = itemElement.querySelectorAll('.bonus-attachment-icons');
        return bonusIcons.length;
    }

    function determineQualityFromClass(itemClass) {
        if (itemClass.includes('glow-yellow')) return 'Yellow';
        if (itemClass.includes('glow-orange')) return 'Orange';
        if (itemClass.includes('glow-red')) return 'Red';
        return 'Yellow'; // Default to Yellow if no class matches ( Bread Knife/Umbrella, etc )
    }

    function processItems() {
        const tabContainers = document.querySelectorAll('.tabContainer #types-tab-1, .tabContainer #types-tab-2');

        tabContainers.forEach((tabContainer) => {
            const listItems = tabContainer.querySelectorAll('.items-list.t-blue-cont.h > li');

            listItems.forEach((li) => {
                if (!li.textContent.trim() || li.classList.contains('clear') || li.classList.contains('processed') || !li.offsetParent) return;

                const weaponNameElement = li.querySelector('.title .item-name');
                const itemClass = li.querySelector('.item-plate')?.className || '';

                if (weaponNameElement && weaponNameElement.textContent.trim()) {
                    const weaponName = weaponNameElement.textContent.trim();
                    const weaponType = weaponTypeMap[weaponName];
                    if (weaponType) {
                        const baseValue = weaponValueMap[weaponType];
                        const trueBBValue = determineQualityMultiplier(itemClass, li) * baseValue;
                        const formattedValue = (Math.round((trueBBValue * BB_VALUE) * (1 - BB_Margin))).toLocaleString();

                        injectStyles();
                        const valueSpan = document.createElement('span');
                        valueSpan.textContent = ` [BB: ${trueBBValue} Value: ${formattedValue}]`;
                        valueSpan.className = 'bbc-value';
                        weaponNameElement.appendChild(valueSpan);

                        const bidElement = li.querySelector('.c-bid-wrap');
                        if (bidElement) {
                            const bidPriceText = bidElement.textContent.trim();
                            const bidPrice = parseInt(bidPriceText.replace(/[^0-9.-]+/g, ''), 10);
                            const threshold = Math.round((BB_VALUE * trueBBValue) * (1 - BB_Margin));

                            // Require the next minimum bid (1% over current) to still be under our threshold
                            const nextMinBid = Math.ceil(bidPrice * 1.01);
                            if (nextMinBid <= threshold) {
                                li.style.backgroundColor = 'darkgreen';
                            }
                        }

                        li.classList.add('processed');
                    } else {
                        console.warn(`No type found for weapon: ${weaponName}`);
                    }
                }
            });
        });
    }

    function refreshItems(){
        // Remove previous annotations and highlights
        document.querySelectorAll('.items-list.t-blue-cont.h > li.processed').forEach(li=>{
            const span = li.querySelector('.bbc-value');
            if (span) span.remove();
            li.style.backgroundColor = '';
            li.classList.remove('processed');
        });
        processItems();
    }

    const targetElement = document.body;
    const observer = new MutationObserver(() => {
        const auctionHouseTabs = document.querySelector('#auction-house-tabs');
        const itemsList = document.querySelector('.items-list.t-blue-cont.h');

        if (auctionHouseTabs && itemsList) {
            injectConfigButton();
            processItems();
        }
    });

    observer.observe(targetElement, {
        childList: true,
        subtree: true,
    });

    function setCachedData(itemID, value) {
        const cacheEntry = {
            data: value,
            timestamp: Date.now()
        };
        localStorage.setItem(`${CACHE_PREFIX}${itemID}`, JSON.stringify(cacheEntry));
    }

    function getCachedData(itemID) {
        const cached = localStorage.getItem(`${CACHE_PREFIX}${itemID}`);
        if (!cached) return null;

        const cacheEntry = JSON.parse(cached);
        const now = Date.now();

        if (now - cacheEntry.timestamp > CACHE_DURATION) {
            localStorage.removeItem(`${CACHE_PREFIX}${itemID}`);
            return null;
        }

        return cacheEntry.data;
    }

    //boolean logic functions
    function isPDA() {
        const PDATestRegex = !/^(###).+(###)$/.test(PDA_APIKey);
        return PDATestRegex;
    }

    const request = (typeof GM_xmlhttpRequest !== 'undefined') ? GM_xmlhttpRequest : (typeof GM !== 'undefined' ? (GM.xmlHttpRequest || GM.xmlhttpRequest) : null);

    async function CacheMarketValue() {
        if (!BB_Value_Override) {
            try {
                const cachedBBValue = getCachedData('BB_VALUE');
                if (cachedBBValue) {
                    BB_VALUE = cachedBBValue;
                    saveConfig({ BB_VALUE });
                    return BB_VALUE;
                }

                let api_key = isPDA() ? PDA_APIKey : API_KEY;
                const response = await new Promise((resolve, reject) => {
                    request && request({
                        method: 'GET',
                        url: `https://api.torn.com/v2/torn/1118,1119,1120,1121,1122/items?key=${api_key}`,
                        onload: (response) => {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve({ json: () => Promise.resolve(data) });
                            } catch (err) {
                                reject(new Error('Failed to parse response: ' + err.message));
                            }
                        },
                        onerror: (err) => reject(new Error('Request failed: ' + err.message))
                    });
                });

                const data = await response.json();
                if (data.items) {
                    let highestBBValue = 0;

                    data.items.forEach(item => {
                        const cacheValue = cacheBBValue[item.name];

                        if (cacheValue && item.value?.market_price) {
                            const bbValue = Math.round(item.value.market_price / cacheValue);

                            highestBBValue = Math.max(highestBBValue, bbValue);

                            setCachedData(item.id, {
                                market_price: item.value.market_price,
                                bb_value: bbValue
                            });
                        }
                    });

                    BB_VALUE = highestBBValue;
                    setCachedData('BB_VALUE', BB_VALUE);
                    saveConfig({ BB_VALUE });
                    return BB_VALUE;
                }
            } catch (err) {
                console.error(`Error fetching market values: `, err);
                return null;
            }
        }

    }

    CacheMarketValue();

})();
