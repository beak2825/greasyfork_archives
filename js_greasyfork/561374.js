// ==UserScript==
// @name         HALO Armory Tracker Pro (V2 API) - Production Ready
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Faction armory tracker with exact HALO rules - Real-time prices only
// @author       Nova
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      api.torn.com
// @connect      www.tornstats.com
// @downloadURL https://update.greasyfork.org/scripts/561374/HALO%20Armory%20Tracker%20Pro%20%28V2%20API%29%20-%20Production%20Ready.user.js
// @updateURL https://update.greasyfork.org/scripts/561374/HALO%20Armory%20Tracker%20Pro%20%28V2%20API%29%20-%20Production%20Ready.meta.js
// ==/UserScript==

(function(){
"use strict";

/* ---------- CONFIG ---------- */
const factionIds = ["48418"];
const REFRESH_MS = 45000;
const FACTION_API_INTERVAL = 3 * 60 * 60 * 1000;
const PRUNE_DAYS = 7;
const MAX_ITEM_DISPLAY = 3;
const MAX_PRICE_RETRIES = 3;
const PRICE_RETRY_DELAY = 1000;

/* ---------- STORAGE ---------- */
let factionKey = GM_getValue("FACTION_API_KEY","");
let marketKey  = GM_getValue("MARKET_API_KEY","");

let usedItems     = GM_getValue("usedItems", {});
let deposits      = GM_getValue("deposits", {});
let processedLogs = GM_getValue("processedLogs", {});
let medWindows    = GM_getValue("medWindows", {});

// Price cache only for successful API prices
let priceCache    = GM_getValue("priceCache", {});
let itemIdCache   = GM_getValue("itemIdCache", {});
let tornstatsData = GM_getValue("tornstatsData", null);

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours for prices
const ID_CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days for IDs

let lastFactionAPITime = GM_getValue("lastFactionAPITime", 0);
let lastProcessedTime = GM_getValue("lastProcessedTime", 0);

/* ---------- FACTION RULES ---------- */
const FREE_ITEMS = [
    "chocolate kisses", "beer", "chocolate bars", 
    "lollipop", "sweet hearts", "blood bag", "empty blood bag"
];

const MEDICAL_ITEMS = [
    "first aid kit", "morphine", "ipecac syrup", 
    "neumune tablet", "antidote"
];

const STANDARD_DEPOSIT_RATE = 0.90;
const XANAX_DEPOSIT_RATE = 0.9375;
const STANDARD_USE_RATE = 0.95;
const MEDICAL_EXCESS_RATE = 1.00;
const BLOOD_BAG_FILL_CREDIT = 200;
const DAILY_MEDICAL_LIMIT = 100000;

/* ---------- HELPER FUNCTIONS ---------- */
function stripTags(str){ return str ? str.replace(/<[^>]*>/g,"").trim() : ""; }

function normalize(name){
    if(!name) return "";
    return name.toLowerCase()
        .replace(/[\u2018\u2019\u201c\u201d]/g,"'")
        .replace(/[^\w\s:+-]/g,"")
        .replace(/\s+/g," ")
        .trim();
}

function dayFromLog(ts){
    const d = new Date(ts * 1000);
    return d.getUTCFullYear() + "-" +
           String(d.getUTCMonth()+1).padStart(2,"0") + "-" +
           String(d.getUTCDate()).padStart(2,"0");
}

function formatTimeDate(ts){
    if(!ts) return "";
    const d = new Date(ts*1000);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = d.getDate();
    const month = d.getMonth() + 1;
    return `${hours}:${minutes}, ${day}.${month}`;
}

function isFree(itemName){
    return FREE_ITEMS.some(freeItem => itemName.includes(freeItem));
}

function isMedical(itemName){
    return MEDICAL_ITEMS.some(medItem => itemName.includes(medItem));
}

function isXanax(itemName){
    return itemName.includes("xanax");
}

function isFillingBloodBag(text, itemName){
    return text.includes("filled") && itemName.includes("empty blood bag");
}

/* ---------- CLEAN PRICE RESOLUTION (NO HARCODED PRICES) ---------- */
async function getItemPrice(itemName){
    const norm = normalize(itemName);
    const now = Date.now();
    
    // Check cache first
    if (priceCache[norm] && (now - priceCache[norm].timestamp) < CACHE_TTL) {
        return { 
            price: priceCache[norm].price, 
            itemId: priceCache[norm].itemId,
            source: priceCache[norm].source || 'cache'
        };
    }
    
    // Step 1: Get item ID
    const itemId = await getItemId(itemName);
    if (!itemId) {
        console.warn(`No item ID found for "${itemName}"`);
        return null;
    }
    
    // Step 2: Try Torn API market price
    if (marketKey) {
        for (let attempt = 1; attempt <= MAX_PRICE_RETRIES; attempt++) {
            try {
                const result = await getTornMarketPrice(itemId, itemName);
                if (result && result.price > 0) {
                    // Cache successful price
                    priceCache[norm] = {
                        price: result.price,
                        itemId: itemId,
                        timestamp: now,
                        source: 'torn_api'
                    };
                    GM_setValue("priceCache", priceCache);
                    
                    console.log(`[Torn API] Price for "${itemName}": $${result.price}`);
                    return { ...result, source: 'torn_api' };
                }
            } catch (error) {
                console.warn(`[Torn API] Attempt ${attempt} failed:`, error);
                if (attempt < MAX_PRICE_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, PRICE_RETRY_DELAY * attempt));
                }
            }
        }
    }
    
    // Step 3: Try TornStats as fallback
    console.log(`[Fallback] Trying TornStats for "${itemName}"`);
    const tornstatsResult = await getTornstatsPrice(itemId, itemName);
    if (tornstatsResult && tornstatsResult.price > 0) {
        // Cache with shorter TTL
        priceCache[norm] = {
            price: tornstatsResult.price,
            itemId: itemId,
            timestamp: now,
            source: 'tornstats'
        };
        GM_setValue("priceCache", priceCache);
        
        console.log(`[TornStats] Price for "${itemName}": $${tornstatsResult.price}`);
        return { ...tornstatsResult, source: 'tornstats' };
    }
    
    console.error(`[ERROR] All price sources failed for "${itemName}"`);
    return null;
}

/* ---------- ITEM ID RESOLUTION ---------- */
async function getItemId(itemName){
    const norm = normalize(itemName);
    const now = Date.now();
    
    // Check ID cache
    if (itemIdCache[norm] && (now - itemIdCache[norm].timestamp) < ID_CACHE_TTL) {
        return itemIdCache[norm].id;
    }
    
    // Method 1: Torn API items list
    if (marketKey) {
        try {
            const items = await fetchTornItems();
            const match = findItemMatch(items, norm, itemName);
            if (match) {
                itemIdCache[norm] = {
                    id: match.id,
                    name: match.name,
                    timestamp: now,
                    source: 'torn_api'
                };
                GM_setValue("itemIdCache", itemIdCache);
                return match.id;
            }
        } catch (error) {
            console.warn("[Item ID] Torn API failed:", error);
        }
    }
    
    // Method 2: TornStats items database
    try {
        if (!tornstatsData) {
            await loadTornstatsData();
        }
        
        if (tornstatsData && tornstatsData.items) {
            const match = findItemMatch(tornstatsData.items, norm, itemName);
            if (match) {
                itemIdCache[norm] = {
                    id: match.id,
                    name: match.name,
                    timestamp: now,
                    source: 'tornstats'
                };
                GM_setValue("itemIdCache", itemIdCache);
                return match.id;
            }
        }
    } catch (error) {
        console.warn("[Item ID] TornStats failed:", error);
    }
    
    console.warn(`[Item ID] Could not find ID for "${itemName}"`);
    return null;
}

function findItemMatch(items, normName, originalName){
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [id, item] of Object.entries(items)) {
        if (!item || !item.name) continue;
        
        const itemNorm = normalize(item.name);
        let score = 0;
        
        // Exact match
        if (itemNorm === normName) {
            return { id, name: item.name, score: 100 };
        }
        
        // Contains match
        if (itemNorm.includes(normName) || normName.includes(itemNorm)) {
            const lengthRatio = Math.min(itemNorm.length, normName.length) / Math.max(itemNorm.length, normName.length);
            score = 70 + (lengthRatio * 30);
        }
        
        // Word overlap
        const itemWords = new Set(itemNorm.split(' ').filter(w => w.length > 2));
        const searchWords = new Set(normName.split(' ').filter(w => w.length > 2));
        const overlap = [...searchWords].filter(word => itemWords.has(word)).length;
        
        if (overlap > 0) {
            const wordScore = (overlap / Math.max(itemWords.size, searchWords.size)) * 60;
            score = Math.max(score, wordScore);
        }
        
        if (score > bestScore && score >= 50) {
            bestScore = score;
            bestMatch = { id, name: item.name, score };
        }
    }
    
    return bestMatch;
}

/* ---------- TORN API FUNCTIONS ---------- */
async function fetchTornItems(){
    if (!marketKey) return {};
    
    try {
        const response = await fetch(`https://api.torn.com/v2/torn/items?cat=All&sort=ASC&key=${marketKey}`);
        const data = await response.json();
        
        if (data.error) {
            console.error("Torn API error:", data.error);
            return {};
        }
        
        return data.items || {};
    } catch (error) {
        console.error("Failed to fetch Torn items:", error);
        return {};
    }
}

async function getTornMarketPrice(itemId, itemName){
    if (!marketKey) return null;
    
    try {
        const response = await fetch(`https://api.torn.com/v2/market/${itemId}/itemmarket?key=${marketKey}`);
        const data = await response.json();
        
        if (!data.itemmarket || !data.itemmarket.listings || data.itemmarket.listings.length === 0) {
            console.warn(`[Torn API] No market listings for ${itemName} (ID: ${itemId})`);
            return null;
        }
        
        // Sort by price (lowest first)
        const listings = data.itemmarket.listings.sort((a, b) => 
            (a.price || a.cost || 0) - (b.price || b.cost || 0)
        );
        
        const cheapest = listings[0];
        const price = Math.round(cheapest.price || cheapest.cost);
        
        // Validate
        if (price <= 0 || price > 1000000000) {
            console.warn(`[Torn API] Invalid price ${price} for ${itemName}`);
            return null;
        }
        
        return {
            price: price,
            itemId: itemId,
            seller: cheapest.seller_name || "Unknown",
            quantity: cheapest.quantity || 1,
            listings: listings.length
        };
        
    } catch (error) {
        console.error(`[Torn API] Market error for ${itemId}:`, error);
        throw error;
    }
}

/* ---------- TORNSTATS FUNCTIONS ---------- */
async function loadTornstatsData(){
    try {
        console.log("[TornStats] Loading data...");
        
        // Try JSON endpoint first
        const response = await fetch("https://www.tornstats.com/api/items", {
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && Object.keys(data).length > 0) {
            tornstatsData = {
                items: data,
                timestamp: Date.now()
            };
            GM_setValue("tornstatsData", tornstatsData);
            console.log(`[TornStats] Loaded ${Object.keys(data).length} items`);
            return true;
        }
        
        throw new Error("No data received");
        
    } catch (error) {
        console.error("[TornStats] Failed to load:", error);
        tornstatsData = null;
        return false;
    }
}

async function getTornstatsPrice(itemId, itemName){
    if (!tornstatsData) {
        await loadTornstatsData();
    }
    
    if (!tornstatsData || !tornstatsData.items) {
        return null;
    }
    
    const item = tornstatsData.items[itemId];
    if (!item) {
        console.warn(`[TornStats] Item ${itemId} not found`);
        return null;
    }
    
    // Try to get current market price if available
    let price = item.market_price || item.price || item.avg_price;
    
    if (!price || price <= 0) {
        console.warn(`[TornStats] No valid price for ${itemName}`);
        return null;
    }
    
    return {
        price: Math.round(price),
        itemId: itemId,
        name: item.name
    };
}

/* ---------- NET VALUE ---------- */
function getNetValue(user){
    let dep = 0, use = 0;
    for(const k in deposits[user]||{}) dep += deposits[user][k].price * deposits[user][k].count;
    for(const k in usedItems[user]||{}) use += usedItems[user][k].price * usedItems[user][k].count;
    return Math.round(dep - use);
}

/* ---------- FACTION API ---------- */
async function fetchFactionLogs(){
    if(!factionKey) return {};
    
    const now = Date.now();
    const timeSinceLastCall = now - lastFactionAPITime;
    
    // Only fetch every 3 hours
    if (timeSinceLastCall < FACTION_API_INTERVAL && lastFactionAPITime > 0) {
        return {};
    }
    
    try {
        const logs = {};
        
        // Action Logs
        const actionUrl = `https://api.torn.com/v2/faction/news?cat=armoryAction&limit=200&sort=DESC&stripTags=true&key=${factionKey}`;
        const actionRes = await fetch(actionUrl);
        const actionData = await actionRes.json();
        
        if(actionData.news && actionData.news.length > 0) {
            actionData.news.forEach(log => {
                logs[`action:${log.id}`] = {
                    time: log.timestamp,
                    news: log.text,
                    _type: 'action',
                    fetched: Math.floor(Date.now() / 1000)
                };
            });
        }
        
        // Deposit Logs
        const depositUrl = `https://api.torn.com/v2/faction/news?cat=armoryDeposit&limit=200&sort=DESC&stripTags=true&key=${factionKey}`;
        const depositRes = await fetch(depositUrl);
        const depositData = await depositRes.json();
        
        if(depositData.news && depositData.news.length > 0) {
            depositData.news.forEach(log => {
                logs[`deposit:${log.id}`] = {
                    time: log.timestamp,
                    news: log.text,
                    _type: 'deposit',
                    fetched: Math.floor(Date.now() / 1000)
                };
            });
        }
        
        lastFactionAPITime = now;
        GM_setValue("lastFactionAPITime", lastFactionAPITime);
        
        console.log(`Faction API: Fetched ${Object.keys(logs).length} logs`);
        return logs;
        
    } catch (e) {
        console.error("Faction API Error:", e);
        return {};
    }
}

/* ---------- PRUNING ---------- */
function pruneOldData() {
    const now = Math.floor(Date.now() / 1000);
    const pruneCutoff = now - (PRUNE_DAYS * 24 * 60 * 60);
    
    let pruned = false;
    
    // Prune processed logs
    for (const logId in processedLogs) {
        if (processedLogs[logId]?.fetched < pruneCutoff) {
            delete processedLogs[logId];
            pruned = true;
        }
    }
    
    // Prune old price cache
    const priceCutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
    for (const key in priceCache) {
        if (priceCache[key].timestamp < priceCutoff) {
            delete priceCache[key];
            pruned = true;
        }
    }
    
    // Prune old user data (60 days)
    const userCutoff = now - (60 * 24 * 60 * 60);
    for (const user in usedItems) {
        let hasRecent = false;
        for (const key in usedItems[user]) {
            if (usedItems[user][key].last > userCutoff) {
                hasRecent = true;
                break;
            }
        }
        if (!hasRecent) {
            delete usedItems[user];
            delete deposits[user];
            pruned = true;
        }
    }
    
    if (pruned) {
        GM_setValue("processedLogs", processedLogs);
        GM_setValue("usedItems", usedItems);
        GM_setValue("deposits", deposits);
        GM_setValue("priceCache", priceCache);
    }
    
    return pruned;
}

/* ---------- LOG PARSING ---------- */
function parseLogEntry(text) {
    text = text.trim();
    
    // Deposit pattern
    const dep = text.match(/^(.+?) deposited (?:(\d+)\s*[x×]?\s*)?(.+?)\.?$/i);
    if (dep) return { type: 'deposit', user: dep[1].trim(), count: dep[2] ? parseInt(dep[2],10) : 1, item: dep[3] };
    
    // Use patterns
    const usePatterns = [
        /^(.+?) used (?:one of the faction's|the faction's|a |)(.+?) items?\.?$/i,
        /^(.+?) used (.+?)\.?$/i,
        /^(.+?) used some of the faction's (.+?) items?\.?$/i
    ];
    
    for (const pattern of usePatterns) {
        const use = text.match(pattern);
        if (use) return { type: 'use', user: use[1].trim(), item: use[2] };
    }
    
    // Filled pattern
    const filled = text.match(/^(.+?) filled one of the faction's (.+?) items?\.?$/i);
    if (filled) return { type: 'filled', user: filled[1].trim(), item: filled[2] };
    
    return null;
}

/* ---------- CORE PROCESSING ---------- */
async function loadLogs(){
    if(!factionKey || !marketKey) {
        renderPanel();
        return;
    }

    pruneOldData();

    const logs = await fetchFactionLogs();
    if (Object.keys(logs).length === 0) {
        renderPanel();
        return;
    }

    const arr = Object.entries(logs)
        .map(([logId, entry])=>({ logId, entry, t: entry.time || 0 }))
        .sort((a,b)=> a.t - b.t);

    medWindows ??= {};

    for(const item of arr){
        const { logId, entry, t } = item;
        
        if (processedLogs[logId]) continue;

        const parsed = parseLogEntry(stripTags(entry.news));
        if (!parsed) {
            processedLogs[logId] = entry;
            continue;
        }

        const { type, user, item: rawItem, count = 1 } = parsed;
        const itemName = normalize(rawItem);

        if (type === 'deposit' || type === 'filled') {
            const priceInfo = await getItemPrice(itemName);
            if (!priceInfo) {
                processedLogs[logId] = entry;
                continue;
            }
            
            let creditedPrice;
            if (type === 'filled' && isFillingBloodBag(rawItem, itemName)) {
                creditedPrice = BLOOD_BAG_FILL_CREDIT;
            } else {
                const depositRate = isXanax(itemName) ? XANAX_DEPOSIT_RATE : STANDARD_DEPOSIT_RATE;
                creditedPrice = Math.round(priceInfo.price * depositRate);
            }
            
            const key = `${itemName}|${priceInfo.itemId}`;
            deposits[user] ??= {};
            if (!deposits[user][key]) {
                deposits[user][key] = { 
                    count: 0, 
                    price: creditedPrice, 
                    last: t, 
                    fullName: itemName,
                    itemId: priceInfo.itemId,
                    source: priceInfo.source
                };
            }
            deposits[user][key].count += count;
            deposits[user][key].last = t;
            
        } else if (type === 'use') {
            if (isFree(itemName)) {
                processedLogs[logId] = entry;
                continue;
            }

            const priceInfo = await getItemPrice(itemName);
            if (!priceInfo) {
                processedLogs[logId] = entry;
                continue;
            }

            const fullPrice = priceInfo.price;
            const day = dayFromLog(t);
            medWindows[user] ??= {};
            medWindows[user][day] ??= 0;

            let charge = 0;
            let isMedicalExcess = false;

            if (isMedical(itemName)) {
                if (medWindows[user][day] < DAILY_MEDICAL_LIMIT) {
                    medWindows[user][day] += fullPrice;

                    if (medWindows[user][day] <= DAILY_MEDICAL_LIMIT) {
                        processedLogs[logId] = entry;
                        continue;
                    }

                    isMedicalExcess = true;
                    charge = Math.round(fullPrice * MEDICAL_EXCESS_RATE);
                } else {
                    isMedicalExcess = true;
                    charge = Math.round(fullPrice * MEDICAL_EXCESS_RATE);
                }
            } else {
                charge = Math.round(fullPrice * STANDARD_USE_RATE);
            }
            
            const key = `${itemName}|${priceInfo.itemId}`;
            usedItems[user] ??= {};
            if (!usedItems[user][key]) {
                usedItems[user][key] = { 
                    count: 0, 
                    price: charge, 
                    last: t, 
                    fullName: itemName,
                    fullPrice: fullPrice,
                    itemId: priceInfo.itemId,
                    isMedicalExcess: isMedicalExcess,
                    source: priceInfo.source
                };
            }
            usedItems[user][key].count++;
            usedItems[user][key].last = t;
        }

        processedLogs[logId] = entry;
    }

    lastProcessedTime = Math.floor(Date.now() / 1000);
    GM_setValue("lastProcessedTime", lastProcessedTime);

    GM_setValue("usedItems", usedItems);
    GM_setValue("deposits", deposits);
    GM_setValue("processedLogs", processedLogs);
    GM_setValue("medWindows", medWindows);

    renderPanel();
}

/* ---------- UI STYLES ---------- */
GM_addStyle(`
#armoryPanel {
    position: fixed;
    bottom: 0;
    right: 10px;
    width: 250px;
    height: 75vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
    color: #e6e6e6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    border-radius: 8px 8px 0 0;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.3);
    display: none;
    z-index: 9999;
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 11px;
}

.panel-header {
    background: rgba(15, 52, 96, 0.7);
    padding: 8px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header h1 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: #4cc9f0;
    display: flex;
    align-items: center;
    gap: 6px;
}

.panel-header h1:before {
    content: "⚕️";
    font-size: 14px;
}

.header-controls {
    display: flex;
    gap: 4px;
}

.header-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #a8d0ff;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 10px;
    transition: all 0.2s ease;
}

.header-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.panel-content {
    padding: 8px;
    height: calc(100% - 36px);
    overflow-y: auto;
}

.stats-slim {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    padding: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-slim {
    text-align: center;
}

.stat-slim-number {
    font-size: 12px;
    font-weight: 700;
    color: #4cc9f0;
}

.stat-slim-label {
    font-size: 8px;
    color: #8b8b9a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 1px;
}

.api-toggle {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 6px 8px;
    margin-bottom: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 10px;
    color: #a8d0ff;
}

.api-toggle:hover {
    background: rgba(255, 255, 255, 0.08);
}

.api-toggle:after {
    content: "▼";
    font-size: 9px;
}

.api-toggle.expanded:after {
    transform: rotate(180deg);
}

.api-fields {
    display: none;
    margin-top: 6px;
}

.api-input-slim {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    padding: 6px 8px;
    color: white;
    font-size: 10px;
    width: 100%;
    margin-bottom: 5px;
    box-sizing: border-box;
}

.api-input-slim:focus {
    outline: none;
    border-color: #4cc9f0;
}

.sort-select-slim {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    padding: 6px 8px;
    color: white;
    font-size: 10px;
    width: 100%;
    margin-bottom: 8px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 10px;
    padding-right: 22px;
}

.users-slim {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 6px;
    padding: 3px;
}

.user-slim {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 5px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.user-header-slim {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.user-name-slim {
    font-size: 11px;
    font-weight: 500;
    color: white;
    max-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.user-balance-slim {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 3px;
    min-width: 60px;
    text-align: center;
}

.balance-positive-slim {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.balance-negative-slim {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.user-details-slim {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: none;
}

.items-slim {
    margin-bottom: 6px;
}

.item-row-slim {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 4px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
    margin-bottom: 3px;
    font-size: 9px;
}

.item-info-slim {
    display: flex;
    align-items: center;
    gap: 5px;
}

.item-name-slim {
    color: #b8b8d1;
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-name-slim[title*="(API)"] {
    color: #4cc9f0;
}

.item-name-slim[title*="(TornStats)"] {
    color: #f59e0b;
}

.item-count-slim {
    color: #4cc9f0;
    font-weight: 600;
    font-size: 9px;
}

.item-price-slim {
    font-weight: 600;
    font-size: 9px;
    color: #10b981;
}

.item-used-slim .item-price-slim {
    color: #ef4444;
}

.item-time-slim {
    color: #8b8b9a;
    font-size: 8px;
    margin-left: 5px;
    min-width: 45px;
    text-align: right;
}

.more-items {
    font-size: 8px;
    color: #8b8b9a;
    text-align: center;
    padding: 2px;
    font-style: italic;
}

.user-actions-slim {
    display: flex;
    justify-content: flex-end;
    margin-top: 6px;
}

.action-btn-slim {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 9px;
    font-weight: 600;
    cursor: pointer;
}

.action-btn-slim:before {
    content: "✓";
    font-size: 9px;
    margin-right: 2px;
}

.empty-state-slim {
    text-align: center;
    padding: 15px 8px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 10px;
}

.empty-state-slim:before {
    content: "📊";
    font-size: 20px;
    display: block;
    margin-bottom: 5px;
    opacity: 0.5;
}

#bubbleBtn {
    position: fixed;
    bottom: 15px;
    right: 15px;
    width: 35px;
    height: 35px;
    background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
    color: #4cc9f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10000;
    font-size: 18px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

#bubbleBtn:hover {
    transform: scale(1.1);
}

.panel-content::-webkit-scrollbar {
    width: 3px;
}

.panel-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}

.panel-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
}
`);

/* ---------- UI CREATION ---------- */
const panel = document.createElement("div");
panel.id = "armoryPanel";
panel.innerHTML = `
<div class="panel-header">
    <h1>HALO Armory</h1>
    <div class="header-controls">
        <button class="header-btn" id="refreshBtn" title="Refresh">↻</button>
        <button class="header-btn" id="closeBtn" title="Close">×</button>
    </div>
</div>
<div class="panel-content">
    <div class="stats-slim">
        <div class="stat-slim">
            <div class="stat-slim-number" id="statUsers">0</div>
            <div class="stat-slim-label">Active</div>
        </div>
        <div class="stat-slim">
            <div class="stat-slim-number" id="statLogs">0</div>
            <div class="stat-slim-label">Logs</div>
        </div>
        <div class="stat-slim">
            <div class="stat-slim-number" id="statCache">0</div>
            <div class="stat-slim-label">Prices</div>
        </div>
        <div class="stat-slim">
            <div class="stat-slim-number" id="statPending">0</div>
            <div class="stat-slim-label">Pending</div>
        </div>
    </div>

    <div class="api-toggle" id="apiToggle">
        API Settings
    </div>
    <div class="api-fields" id="apiFields">
        <input type="password" id="factionKeyInput" class="api-input-slim" placeholder="Faction Key" value="${factionKey}" autocomplete="off">
        <input type="password" id="marketKeyInput" class="api-input-slim" placeholder="Market Key" value="${marketKey}" autocomplete="off">
    </div>

    <select id="sortUsers" class="sort-select-slim">
        <option value="debt">Highest Debt</option>
        <option value="credit">Highest Credit</option>
        <option value="alphabetical">A-Z</option>
    </select>

    <div class="users-slim" id="debtLog"></div>
</div>`;

document.body.appendChild(panel);

const bubble = document.createElement("div");
bubble.id = "bubbleBtn";
bubble.innerHTML = "⚕️";
document.body.appendChild(bubble);

let minimized = true;
let apiExpanded = false;

/* ---------- UI INTERACTIONS ---------- */
bubble.onclick = () => {
    minimized = !minimized;
    panel.style.display = minimized ? "none" : "block";
};

document.getElementById("closeBtn").onclick = () => {
    panel.style.display = "none";
    minimized = true;
};

document.getElementById("refreshBtn").onclick = () => {
    lastFactionAPITime = 0;
    GM_setValue("lastFactionAPITime", 0);
    loadLogs();
};

document.getElementById("apiToggle").onclick = () => {
    apiExpanded = !apiExpanded;
    const apiToggle = document.getElementById("apiToggle");
    const apiFields = document.getElementById("apiFields");
    
    apiToggle.classList.toggle("expanded", apiExpanded);
    apiFields.style.display = apiExpanded ? "block" : "none";
};

document.getElementById("factionKeyInput").onchange = e => {
    factionKey = e.target.value.trim();
    GM_setValue("FACTION_API_KEY", factionKey);
    loadLogs();
};

document.getElementById("marketKeyInput").onchange = e => {
    marketKey = e.target.value.trim();
    GM_setValue("MARKET_API_KEY", marketKey);
    loadLogs();
};

/* ---------- SORTING ---------- */
function sortUsers(users, sortType) {
    return users.sort((a, b) => {
        const netA = getNetValue(a);
        const netB = getNetValue(b);
        
        if (sortType === "debt") {
            if (netA < 0 && netB < 0) return netA - netB;
            if (netA < 0) return -1;
            if (netB < 0) return 1;
            return netB - netA;
        }
        
        if (sortType === "credit") {
            if (netA > 0 && netB > 0) return netB - netA;
            if (netA > 0) return -1;
            if (netB > 0) return 1;
            return netA - netB;
        }
        
        return a.localeCompare(b);
    });
}

/* ---------- RENDER FUNCTIONS ---------- */
function updateStats() {
    const activeUsers = [...new Set([...Object.keys(usedItems), ...Object.keys(deposits)])].filter(u => getNetValue(u) !== 0).length;
    const totalProcessed = Object.keys(processedLogs).length;
    const cachedPrices = Object.keys(priceCache).length;
    const pendingItems = Object.keys(processedLogs).filter(logId => {
        const entry = processedLogs[logId];
        const parsed = parseLogEntry(stripTags(entry.news));
        return parsed && !usedItems[parsed.user] && !deposits[parsed.user];
    }).length;
    
    document.getElementById("statUsers").textContent = activeUsers;
    document.getElementById("statLogs").textContent = totalProcessed;
    document.getElementById("statCache").textContent = cachedPrices;
    document.getElementById("statPending").textContent = pendingItems;
}

function renderItemListCompact(items, isUsed = false) {
    if (!items || Object.keys(items).length === 0) {
        return '<div class="empty-state-slim" style="font-size: 9px; padding: 4px;">None</div>';
    }
    
    const entries = Object.entries(items);
    const displayEntries = entries.slice(0, MAX_ITEM_DISPLAY);
    const hiddenCount = entries.length - MAX_ITEM_DISPLAY;
    
    let html = displayEntries.map(([k, v]) => {
        const shortName = v.fullName ? v.fullName.split(' ').pop() : k.split('|')[0];
        const timeDate = v.last ? formatTimeDate(v.last) : "";
        const source = v.source ? `(${v.source === 'torn_api' ? 'API' : 'TS'})` : '';
        const title = `${v.fullName || k} ${source}`;
        
        return `
            <div class="item-row-slim ${isUsed ? 'item-used-slim' : ''}">
                <div class="item-info-slim">
                    <span class="item-name-slim" title="${title}">${shortName}</span>
                    <span class="item-count-slim">x${v.count}</span>
                    <span class="item-price-slim">$${v.price.toLocaleString()}</span>
                </div>
                <div class="item-time-slim">${timeDate}</div>
            </div>
        `;
    }).join("");
    
    if (hiddenCount > 0) {
        html += `<div class="more-items">+ ${hiddenCount} more item${hiddenCount > 1 ? 's' : ''}</div>`;
    }
    
    return html;
}

function renderPanel() {
    updateStats();
    
    const div = document.getElementById("debtLog");
    let users = [...new Set([...Object.keys(usedItems), ...Object.keys(deposits)])];
    
    users = users.filter(u => getNetValue(u) !== 0);
    
    if (users.length === 0) {
        div.innerHTML = `
            <div class="empty-state-slim">
                <div>No balances</div>
                <div style="margin-top: 3px; font-size: 8px;">Add API keys</div>
            </div>
        `;
        return;
    }
    
    const sort = document.getElementById("sortUsers")?.value || "debt";
    users = sortUsers(users, sort);

    div.innerHTML = users.map(u => {
        const net = getNetValue(u);
        const isPositive = net >= 0;
        const balanceClass = isPositive ? 'balance-positive-slim' : 'balance-negative-slim';
        const balanceText = isPositive ? `+$${Math.abs(net).toLocaleString()}` : `-$${Math.abs(net).toLocaleString()}`;
        
        return `
            <div class="user-slim">
                <div class="user-header-slim">
                    <div class="user-name-slim" title="${u}">${u}</div>
                    <div class="user-balance-slim ${balanceClass}">
                        ${balanceText}
                    </div>
                </div>
                <div class="user-details-slim">
                    <div class="items-slim">
                        ${renderItemListCompact(usedItems[u], true)}
                        ${renderItemListCompact(deposits[u])}
                    </div>
                    <div class="user-actions-slim">
                        <button class="action-btn-slim" data-user="${u}">Clear</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    // Add event listeners
    div.querySelectorAll(".user-header-slim").forEach(header => {
        header.onclick = (e) => {
            if (!e.target.closest('.action-btn-slim')) {
                const content = header.nextElementSibling;
                content.style.display = content.style.display === "none" ? "block" : "none";
            }
        };
    });

    div.querySelectorAll(".action-btn-slim").forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const user = btn.dataset.user;
            if (confirm(`Clear balance for ${user}?`)) {
                delete usedItems[user];
                delete deposits[user];
                GM_setValue("usedItems", usedItems);
                GM_setValue("deposits", deposits);
                renderPanel();
            }
        };
    });
}

/* ---------- INITIALIZATION ---------- */
document.getElementById("sortUsers").onchange = renderPanel;

// Auto-show panel if no API keys are set
if (!factionKey || !marketKey) {
    panel.style.display = "block";
    minimized = false;
    apiExpanded = true;
    document.getElementById("apiToggle").classList.add("expanded");
    document.getElementById("apiFields").style.display = "block";
}

// Initial cleanup
pruneOldData();

/* ---------- MAIN LOOP ---------- */
setInterval(() => {
    updateStats();
    renderPanel();
}, REFRESH_MS);

setInterval(loadLogs, FACTION_API_INTERVAL);

// Initial load
loadLogs();

})();