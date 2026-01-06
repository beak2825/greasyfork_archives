// ==UserScript==
// @name         HALO Armory Tracker Pro (Alien UI) - V2 Enhanced
// @namespace    http://tampermonkey.net/
// @version      HALO.5.2
// @description  Faction armory tracker with V2 countdown scheduler and alien UI
// @author       Nova
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/560935/HALO%20Armory%20Tracker%20Pro%20%28Alien%20UI%29%20-%20V2%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/560935/HALO%20Armory%20Tracker%20Pro%20%28Alien%20UI%29%20-%20V2%20Enhanced.meta.js
// ==/UserScript==

(function(){
"use strict";

/* ---------- CONFIG ---------- */
const factionIds = ["48418"];
const REFRESH_MS = 45000; // V1: 45 seconds
const V2_INTERVAL_MS = 6 * 60 * 60 * 1000; // V2: 6 hours
const PRICE_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const PROCESSED_LOGS_PRUNE_DAYS = 7;
const V2_MARKERS_PRUNE_DAYS = 3;
const MAX_V2_PAGES = 20;

/* ---------- FACTION RULES ---------- */
const FREE_ITEMS = [
    "chocolate kisses", "beer", "chocolate bars", 
    "lollipop", "sweet hearts", "blood bag", "empty blood bag"
];

const MEDICAL_ITEMS = [
    "first aid", "small first aid", "morphine", "ipecac",
    "neumune tablet", "antidote"
];

const STANDARD_DEPOSIT_RATE = 0.90;
const XANAX_DEPOSIT_RATE = 0.9375;
const STANDARD_USE_RATE = 0.95;
const MEDICAL_EXCESS_RATE = 1.00;
const BLOOD_BAG_FILL_CREDIT = 200;
const DAILY_MEDICAL_LIMIT = 100000;
const LOAN_DISCOUNT_RATE = 0.50;

/* ---------- ENHANCED STORAGE ---------- */
let factionKey = GM_getValue("FACTION_API_KEY","");
let marketKey  = GM_getValue("MARKET_API_KEY","");

let usedItems     = GM_getValue("usedItems", {});
let deposits      = GM_getValue("deposits", {});
let processedLogs = GM_getValue("processedLogs", {});
let medWindows    = GM_getValue("medWindows", {});
let beerWindows   = GM_getValue("beerWindows", {});

// V2 Scheduling system
let v2Stats = GM_getValue("v2Stats", { 
    recovered: 0, 
    lastRun: 0, 
    totalPages: 0, 
    truncated: false,
    totalRuns: 0
});

let v2Schedule = GM_getValue("v2Schedule", { 
    lastFetch: 0,
    nextScheduled: 0,
    overdueCount: 0,
    lastCheck: 0
});

// Item and price caching
let itemCache     = GM_getValue("itemCache", {});
let priceCache    = GM_getValue("priceCache", {});
let itemsMapCache = null;
let nameToIdCache = {};

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
function formatTime(ts){
    if(!ts) return "";
    const d = new Date(ts*1000);
    return d.toLocaleString();
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

/* ---------- ENHANCED ITEM RESOLUTION ---------- */
async function fetchAllItems(){
    if(itemsMapCache) return itemsMapCache;
    if(!marketKey) return {};
    
    try {
        const r = await fetch(`https://api.torn.com/v2/torn/items?cat=All&sort=ASC&key=${marketKey}`);
        const d = await r.json();
        itemsMapCache = d.items || {};
        
        Object.values(itemsMapCache).forEach(it => {
            const itemId = it.id;
            const itemName = it.name;
            
            if(!itemCache[itemId] || itemCache[itemId].name !== itemName) {
                itemCache[itemId] = {
                    name: itemName,
                    lastSeen: Date.now()
                };
            }
            
            nameToIdCache[normalize(itemName)] = itemId;
        });
        
        GM_setValue("itemCache", itemCache);
        return itemsMapCache;
    } catch (error) {
        console.error("HALO: Error fetching items:", error);
        return {};
    }
}

async function resolveItemId(itemName){
    const norm = normalize(itemName);
    
    if(nameToIdCache[norm]) {
        return nameToIdCache[norm];
    }
    
    for(const [itemId, data] of Object.entries(itemCache)) {
        if(normalize(data.name) === norm) {
            nameToIdCache[norm] = itemId;
            return itemId;
        }
    }
    
    await fetchAllItems();
    
    if(nameToIdCache[norm]) {
        return nameToIdCache[norm];
    }
    
    console.warn(`HALO: Could not resolve item ID for: ${itemName}`);
    return null;
}

async function resolvePriceWithCache(itemId, itemName){
    const now = Date.now();
    
    if(priceCache[itemId] && (now - priceCache[itemId].timestamp) < PRICE_CACHE_TTL) {
        return priceCache[itemId].price;
    }
    
    try {
        const r = await fetch(`https://api.torn.com/v2/market/${itemId}/itemmarket?key=${marketKey}`);
        const d = await r.json();
        const listings = d?.itemmarket?.listings || [];
        
        if(!listings.length) {
            console.warn(`HALO: No market listings for item ${itemId} (${itemName})`);
            return null;
        }
        
        listings.sort((a,b)=> (a.price||a.cost||0)-(b.price||b.cost||0));
        const price = Math.round(listings[0].price || listings[0].cost);
        
        if(price > 0) {
            priceCache[itemId] = {
                price: price,
                timestamp: now
            };
            GM_setValue("priceCache", priceCache);
        }
        
        return price;
    } catch (error) {
        console.error(`HALO: Error fetching price for ${itemId}:`, error);
        return null;
    }
}

function cleanupPriceCache() {
    const cutoff = Date.now() - (PRICE_CACHE_TTL * 2);
    let cleaned = 0;
    
    for(const itemId in priceCache) {
        if(priceCache[itemId].timestamp < cutoff) {
            delete priceCache[itemId];
            cleaned++;
        }
    }
    
    if(cleaned > 0) {
        GM_setValue("priceCache", priceCache);
        console.log(`HALO: Cleaned ${cleaned} expired price cache entries`);
    }
}

/* ---------- WINDOWS ---------- */
function processMedicalUse(user, value, ts){
    const day = dayFromLog(ts);
    medWindows[user] ??= {};
    medWindows[user][day] ??= 0;
    medWindows[user][day] += value;
    GM_setValue("medWindows", medWindows);
    return medWindows[user][day] > DAILY_MEDICAL_LIMIT;
}

/* ---------- NET VALUE ---------- */
function getNetValue(user){
    let dep = 0, use = 0;
    for(const k in deposits[user]||{}) dep += deposits[user][k].price * deposits[user][k].count;
    for(const k in usedItems[user]||{}) use += usedItems[user][k].price * usedItems[user][k].count;
    return Math.round(dep - use);
}

/* ---------- V1 LOGS FETCH ---------- */
async function fetchFactionLogsV1(id){
    try {
        const r = await fetch(`https://api.torn.com/faction/${id}?selections=armorynews&key=${factionKey}`);
        const d = await r.json();
        return d.armorynews || {};
    } catch (error) {
        console.error("HALO: Error fetching V1 logs:", error);
        return {};
    }
}

/* ---------- V2 LOGS FETCH ---------- */
async function fetchV2LogsPage(url){
    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("HALO: V2 fetch error:", error);
        return { news: [], _metadata: { links: {} } };
    }
}

async function fetchAllV2Logs(sinceTimestamp = 0){
    if(!factionKey) return { logs: [], recovered: 0, truncated: false, pages: 0 };
    
    let allLogs = [];
    let recovered = 0;
    let pageCount = 0;
    let truncated = false;
    
    let baseUrl = `https://api.torn.com/v2/faction/news` +
                 `?cat=armoryAction&cat=armoryDeposit` +
                 `&stripTags=true&sort=desc` +
                 `&key=${factionKey}`;
    
    if(sinceTimestamp > 0){
        baseUrl += `&from=${sinceTimestamp}`;
    } else {
        baseUrl += `&from=${Math.floor(Date.now() / 1000) - 86400}`;
    }
    
    let nextUrl = baseUrl;
    
    console.log(`HALO: V2 fetching since ${new Date(sinceTimestamp * 1000).toLocaleString()}`);
    
    while(nextUrl && pageCount < MAX_V2_PAGES){
        const data = await fetchV2LogsPage(nextUrl);
        
        if(!data.news || !Array.isArray(data.news)){
            break;
        }
        
        for(const log of data.news){
            if(!processedLogs[log.id]){
                allLogs.push(log);
                recovered++;
            }
        }
        
        nextUrl = data._metadata?.links?.next || null;
        pageCount++;
        
        await new Promise(resolve => setTimeout(resolve, 100 + (pageCount * 50)));
    }
    
    if(pageCount >= MAX_V2_PAGES && nextUrl){
        truncated = true;
        console.warn(`HALO: V2 fetch truncated at ${MAX_V2_PAGES} pages. More logs may exist.`);
        showWarning(`V2 recovery truncated at ${MAX_V2_PAGES} pages. Some historical logs may be missing.`);
    }
    
    console.log(`HALO: V2 fetched ${pageCount} pages, recovered ${recovered} new logs${truncated ? ' (TRUNCATED)' : ''}`);
    
    return { logs: allLogs, recovered, truncated, pages: pageCount };
}

/* ---------- LOG PROCESSING ---------- */
async function processLogEntry(logId, entry, source = 'v1'){
    if(processedLogs[logId]) return null;
    
    let text = '';
    let timestamp = 0;
    
    if(source === 'v1'){
        text = stripTags(entry.news);
        timestamp = entry.timestamp || entry.time || 0;
    } else {
        text = entry.text || '';
        timestamp = entry.timestamp || 0;
    }
    
    if(!text || !timestamp) return null;
    
    text = text.replace(/\s+/g," ").trim();
    
    const dep = text.match(/^(.+?) deposited (?:(\d+)\s*[x×]?\s*)?(.+?)\.?$/i);
    const use = text.match(/^(.+?) used (?:one of the faction's |a |)(.+?) items?\.?$/i)
             || text.match(/^(.+?) used (.+?)\.?$/i);
    const filled = text.match(/^(.+?) filled one of the faction's (.+?) items?\.?$/i);
    const loan = text.match(/^(.+?) loaned (\d+)\s*[x×]?\s*(.+?) to themselves from the faction armory$/i);
    
    let result = null;
    
    if(dep){
        const user = dep[1].trim();
        const count = dep[2] ? parseInt(dep[2],10) : 1;
        const itemName = normalize(dep[3]);
        
        if(isFillingBloodBag(text, itemName)){
            result = {
                type: 'deposit',
                user: user,
                action: 'filled',
                itemName: itemName,
                count: count,
                isBloodBagFill: true,
                source: source
            };
        } else {
            result = {
                type: 'deposit',
                user: user,
                action: 'deposit',
                itemName: itemName,
                count: count,
                source: source
            };
        }
    }
    else if(use){
        const user = use[1].trim();
        const itemName = normalize(use[2]);
        
        if(isFree(itemName)){
            return null;
        }
        
        result = {
            type: 'use',
            user: user,
            action: 'use',
            itemName: itemName,
            count: 1,
            source: source
        };
    }
    else if(filled){
        const user = filled[1].trim();
        const itemName = normalize(filled[2]);
        
        if(isFillingBloodBag(text, itemName)){
            result = {
                type: 'deposit',
                user: user,
                action: 'filled',
                itemName: itemName,
                count: 1,
                isBloodBagFill: true,
                source: source
            };
        }
    }
    else if(loan){
        const user = loan[1].trim();
        const count = parseInt(loan[2],10) || 1;
        const itemName = normalize(loan[3]);
        
        if(isFree(itemName)){
            return null;
        }
        
        result = {
            type: 'use',
            user: user,
            action: 'loan',
            itemName: itemName,
            count: count,
            isHalfPrice: true,
            source: source
        };
    }
    
    if(result){
        result.logId = logId;
        result.timestamp = timestamp;
    }
    
    return result;
}

async function processParsedResult(result){
    if(!result) return;
    
    const { user, action, itemName, count, logId, timestamp, source, isHalfPrice, isBloodBagFill } = result;
    
    const itemId = await resolveItemId(itemName);
    if(!itemId) {
        console.warn(`HALO: Could not process log ${logId} - unknown item: ${itemName}`);
        return;
    }
    
    const displayName = itemCache[itemId]?.name || itemName;
    
    let price = null;
    
    if(isBloodBagFill){
        price = BLOOD_BAG_FILL_CREDIT;
    } else {
        const marketPrice = await resolvePriceWithCache(itemId, displayName);
        if(!marketPrice) {
            console.warn(`HALO: No price for item ${itemId} (${displayName})`);
            return;
        }
        
        let adjustedPrice = marketPrice;
        
        if(action === 'deposit' || action === 'filled'){
            adjustedPrice *= isXanax(displayName) ? XANAX_DEPOSIT_RATE : STANDARD_DEPOSIT_RATE;
        } else if(action === 'use' || action === 'loan'){
            adjustedPrice *= STANDARD_USE_RATE;
            
            if(isHalfPrice){
                adjustedPrice *= LOAN_DISCOUNT_RATE;
            }
            
            if(isMedical(displayName)){
                if(!processMedicalUse(user, marketPrice, timestamp)){
                    return;
                }
                adjustedPrice = Math.round(marketPrice * MEDICAL_EXCESS_RATE);
            }
        }
        
        price = Math.round(adjustedPrice);
    }
    
    const key = `item:${itemId}`;
    
    if(action === 'deposit' || action === 'filled'){
        deposits[user] ??= {};
        deposits[user][key] ??= { 
            count: 0, 
            price: price, 
            last: timestamp,
            itemId: itemId,
            itemName: displayName,
            source: source,
            isHalfPrice: isHalfPrice || false
        };
        deposits[user][key].count += count;
        deposits[user][key].last = timestamp;
    } else {
        usedItems[user] ??= {};
        usedItems[user][key] ??= { 
            count: 0, 
            price: price, 
            last: timestamp,
            itemId: itemId,
            itemName: displayName,
            source: source,
            isHalfPrice: isHalfPrice || false
        };
        usedItems[user][key].count += count;
        usedItems[user][key].last = timestamp;
    }
    
    processedLogs[logId] = {
        source: source,
        timestamp: timestamp
    };
    
    if(source === 'v2'){
        v2Stats.recovered++;
        v2Stats.lastRun = Date.now();
        GM_setValue("v2Stats", v2Stats);
    }
}

/* ---------- V2 COUNTDOWN SCHEDULER ---------- */
async function runV2CatchUp(){
    if(!factionKey) return;
    
    console.log("HALO: Running V2 catch-up...");
    
    // Update schedule BEFORE running (in case of crash)
    v2Schedule.lastFetch = Date.now();
    v2Schedule.nextScheduled = v2Schedule.lastFetch + V2_INTERVAL_MS;
    v2Schedule.lastCheck = Date.now();
    GM_setValue("v2Schedule", v2Schedule);
    
    // Get last V2 fetch timestamp
    let sinceTime = v2Stats.lastRun ? Math.floor(v2Stats.lastRun / 1000) : 0;
    
    // If first run or very old, go back 24 hours
    if(sinceTime === 0 || (Date.now() - v2Stats.lastRun) > 86400000) {
        sinceTime = Math.floor(Date.now() / 1000) - 86400;
        console.log(`HALO: First V2 run or large gap, fetching from ${new Date(sinceTime * 1000).toLocaleString()}`);
    }
    
    const result = await fetchAllV2Logs(sinceTime);
    
    if(result.logs.length > 0){
        for(const log of result.logs){
            const parsed = await processLogEntry(log.id, log, 'v2');
            if(parsed){
                await processParsedResult(parsed);
            }
        }
        
        // Update stats
        v2Stats.lastRun = Date.now();
        v2Stats.totalPages += result.pages;
        v2Stats.truncated = v2Stats.truncated || result.truncated;
        v2Stats.totalRuns = (v2Stats.totalRuns || 0) + 1;
        
        GM_setValue("v2Stats", v2Stats);
        GM_setValue("usedItems", usedItems);
        GM_setValue("deposits", deposits);
        GM_setValue("processedLogs", processedLogs);
        
        console.log(`HALO: V2 completed. Recovered ${result.recovered} logs.`);
    } else {
        console.log("HALO: No new logs via V2");
    }
    
    // Update schedule AFTER successful completion
    v2Schedule.lastFetch = Date.now();
    v2Schedule.nextScheduled = v2Schedule.lastFetch + V2_INTERVAL_MS;
    v2Schedule.overdueCount = 0;
    v2Schedule.lastCheck = Date.now();
    GM_setValue("v2Schedule", v2Schedule);
    
    // Run maintenance
    pruneProcessedLogs();
    cleanupPriceCache();
    
    // Update UI
    renderPanel();
}

function initializeV2Scheduler(){
    const now = Date.now();
    
    // Initialize schedule if first time
    if(v2Schedule.lastFetch === 0) {
        v2Schedule.lastFetch = now - V2_INTERVAL_MS; // Pretend it ran 6 hours ago
        v2Schedule.nextScheduled = now; // Schedule for now
        v2Schedule.overdueCount = 0;
        v2Schedule.lastCheck = now;
        GM_setValue("v2Schedule", v2Schedule);
        
        console.log("HALO: Initialized V2 scheduler");
    }
    
    // Check if overdue and run immediately if needed
    checkV2Schedule();
    
    // Start monitoring
    monitorV2Schedule();
}

function checkV2Schedule(){
    const now = Date.now();
    const overdue = now - v2Schedule.nextScheduled;
    
    v2Schedule.lastCheck = now;
    GM_setValue("v2Schedule", v2Schedule);
    
    if(overdue > 0) {
        // We're overdue!
        const overdueMinutes = Math.round(overdue / 60000);
        console.log(`HALO: V2 overdue by ${overdueMinutes} minutes`);
        
        v2Schedule.overdueCount++;
        v2Schedule.nextScheduled = now + V2_INTERVAL_MS;
        GM_setValue("v2Schedule", v2Schedule);
        
        // Show warning if severely overdue
        if(overdueMinutes > 30) {
            showWarning(`V2 overdue by ${overdueMinutes} minutes! Running catch-up...`, 15000);
        }
        
        // Run V2
        setTimeout(() => runV2CatchUp(), 1000);
        
        return true;
    }
    
    return false;
}

function monitorV2Schedule(){
    const now = Date.now();
    const timeUntilNext = v2Schedule.nextScheduled - now;
    
    if(timeUntilNext <= 0) {
        // Time's up - check and run
        checkV2Schedule();
        // Check again in 1 minute
        setTimeout(monitorV2Schedule, 60000);
    } else {
        // Schedule check for when it's due (or 1 minute as safety)
        const checkTime = Math.min(timeUntilNext, 60000);
        setTimeout(monitorV2Schedule, checkTime);
    }
}

/* ---------- DATA MANAGEMENT ---------- */
function pruneProcessedLogs(){
    const pruneTime = Date.now() - (PROCESSED_LOGS_PRUNE_DAYS * 24 * 60 * 60 * 1000);
    let pruned = 0;
    
    Object.keys(processedLogs).forEach(logId => {
        if(processedLogs[logId].timestamp * 1000 < pruneTime) {
            delete processedLogs[logId];
            pruned++;
        }
    });
    
    const v2MarkerPruneTime = Date.now() - (V2_MARKERS_PRUNE_DAYS * 24 * 60 * 60 * 1000);
    
    for(const user in deposits){
        for(const itemKey in deposits[user]){
            const entry = deposits[user][itemKey];
            if(entry.source === 'v2' && entry.last * 1000 < v2MarkerPruneTime){
                delete deposits[user][itemKey].source;
            }
        }
    }
    
    for(const user in usedItems){
        for(const itemKey in usedItems[user]){
            const entry = usedItems[user][itemKey];
            if(entry.source === 'v2' && entry.last * 1000 < v2MarkerPruneTime){
                delete usedItems[user][itemKey].source;
            }
        }
    }
    
    if(pruned > 0){
        GM_setValue("processedLogs", processedLogs);
        GM_setValue("deposits", deposits);
        GM_setValue("usedItems", usedItems);
        console.log(`HALO: Pruned ${pruned} old processed logs`);
    }
}

/* ---------- MAIN LOG PROCESSING ---------- */
async function loadLogs(){
    if(!factionKey || !marketKey) return;
    
    // Update last check time
    v2Schedule.lastCheck = Date.now();
    GM_setValue("v2Schedule", v2Schedule);
    
    // Process V1 logs
    let v1Logs = {};
    for(const id of factionIds){
        Object.assign(v1Logs, await fetchFactionLogsV1(id));
    }
    
    const arr = Object.entries(v1Logs)
        .map(([k,v])=>({ logId:k, entry:v, t:v.timestamp||v.time||0 }))
        .sort((a,b)=> a.t - b.t || a.logId.localeCompare(b.logId));
    
    for(const item of arr){
        const { logId, entry } = item;
        
        if(processedLogs[logId]) continue;
        
        const parsed = await processLogEntry(logId, entry, 'v1');
        if(parsed){
            await processParsedResult(parsed);
        }
    }
    
    GM_setValue("usedItems", usedItems);
    GM_setValue("deposits", deposits);
    GM_setValue("processedLogs", processedLogs);
    
    renderPanel();
}

/* ---------- UI ---------- */
GM_addStyle(`
/* Main Panel - Smaller and more compact */
#armoryPanel {
    position: fixed;
    bottom: 0;
    right: 15px;
    width: 300px;
    height: 85vh;
    background: 
        radial-gradient(circle at 20% 80%, rgba(0, 40, 60, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(60, 0, 80, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, rgba(5, 5, 15, 0.95) 0%, rgba(15, 5, 25, 0.95) 100%);
    color: #00ffea;
    font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
    border-radius: 8px 8px 0 0;
    padding: 0;
    overflow: hidden;
    box-shadow: 
        0 0 30px rgba(0, 255, 234, 0.4),
        0 0 60px rgba(138, 43, 226, 0.3),
        inset 0 0 20px rgba(0, 255, 234, 0.15);
    display: none;
    z-index: 9999;
    border: 1px solid rgba(0, 255, 234, 0.4);
    border-bottom: none;
    backdrop-filter: blur(8px);
    font-size: 10px;
}

#armoryPanel::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
        rgba(0, 255, 234, 0.4), 
        rgba(138, 43, 226, 0.4), 
        rgba(0, 255, 234, 0.4));
    border-radius: 10px;
    z-index: -1;
    animation: hologram 3s linear infinite;
    opacity: 0.8;
}

@keyframes hologram {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

/* Minimized Header */
.panel-header {
    background: linear-gradient(90deg, 
        rgba(10, 20, 30, 0.9) 0%, 
        rgba(30, 10, 40, 0.9) 100%);
    padding: 8px 12px;
    border-bottom: 1px solid rgba(0, 255, 234, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    backdrop-filter: blur(4px);
    min-height: 35px;
}

.panel-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    right: 5%;
    height: 1px;
    background: linear-gradient(90deg, 
        transparent, 
        rgba(0, 255, 234, 0.8), 
        transparent);
    animation: scanline 2s linear infinite;
}

@keyframes scanline {
    0% { left: 5%; right: 5%; }
    50% { left: 10%; right: 10%; }
    100% { left: 5%; right: 5%; }
}

.panel-header h1 {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #00ffea;
    display: flex;
    align-items: center;
    gap: 6px;
    text-shadow: 
        0 0 8px rgba(0, 255, 234, 0.7),
        0 0 15px rgba(0, 255, 234, 0.3);
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: 'Orbitron', 'Courier New', monospace;
}

.panel-header h1:before {
    content: "🛸";
    font-size: 16px;
    filter: drop-shadow(0 0 6px #00ffea);
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-2px) rotate(5deg); }
}

.header-controls {
    display: flex;
    gap: 6px;
}

.header-btn {
    background: rgba(0, 255, 234, 0.15);
    border: 1px solid rgba(0, 255, 234, 0.4);
    color: #00ffea;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 11px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-shadow: 0 0 6px rgba(0, 255, 234, 0.7);
    position: relative;
    overflow: hidden;
}

.header-btn:hover {
    background: rgba(0, 255, 234, 0.3);
    transform: scale(1.1);
    box-shadow: 
        0 0 15px rgba(0, 255, 234, 0.6),
        0 0 30px rgba(0, 255, 234, 0.3);
}

.header-btn::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 255, 234, 0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.header-btn:hover::before {
    opacity: 1;
}

.panel-content {
    padding: 12px;
    height: calc(100% - 35px);
    overflow-y: auto;
    background: rgba(0, 5, 10, 0.7);
}

/* Stats - Smaller and more compact */
.stats-slim {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 12px;
    background: rgba(0, 255, 234, 0.08);
    border-radius: 8px;
    padding: 10px;
    border: 1px solid rgba(0, 255, 234, 0.3);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(5px);
}

.stats-slim::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
        transparent, 
        rgba(0, 255, 234, 0.15), 
        transparent);
    animation: datascan 4s linear infinite;
}

@keyframes datascan {
    0% { left: -100%; }
    100% { left: 100%; }
}

.stat-slim {
    text-align: center;
    position: relative;
    z-index: 1;
}

.stat-slim-number {
    font-size: 14px;
    font-weight: 800;
    color: #00ffea;
    text-shadow: 
        0 0 8px rgba(0, 255, 234, 0.8),
        0 0 15px rgba(0, 255, 234, 0.4);
    font-family: 'Orbitron', monospace;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
}

.stat-slim-label {
    font-size: 8px;
    color: #8af5ff;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 1px;
    opacity: 0.8;
    font-weight: 600;
}

.v2-stat {
    background: linear-gradient(135deg, 
        rgba(255, 153, 0, 0.15) 0%, 
        rgba(255, 153, 0, 0.05) 100%) !important;
    border: 1px solid rgba(255, 153, 0, 0.3) !important;
}

.v2-stat .stat-slim-number {
    color: #ff9900 !important;
    text-shadow: 0 0 6px rgba(255, 153, 0, 0.5) !important;
}

/* V2 Countdown Display - Removed */
.v2-countdown-display {
    display: none;
}

.v2-last-run {
    font-size: 8px;
    color: rgba(255, 153, 0, 0.8);
    text-align: center;
    margin-top: 5px;
    font-family: 'Courier New', monospace;
}

.api-toggle {
    background: rgba(0, 255, 234, 0.1);
    border: 1px solid rgba(0, 255, 234, 0.3);
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 10px;
    color: #00ffea;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.api-toggle:hover {
    background: rgba(0, 255, 234, 0.2);
    box-shadow: 0 0 15px rgba(0, 255, 234, 0.3);
}

.api-toggle::after {
    content: "▼";
    font-size: 9px;
    transition: transform 0.3s ease;
}

.api-toggle.expanded::after {
    transform: rotate(180deg);
}

.api-fields {
    display: none;
    margin-top: 10px;
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.api-input-slim {
    background: rgba(0, 10, 20, 0.8);
    border: 1px solid rgba(0, 255, 234, 0.4);
    border-radius: 5px;
    padding: 8px 10px;
    color: #00ffea;
    font-size: 10px;
    width: 100%;
    margin-bottom: 8px;
    box-sizing: border-box;
    font-family: 'Courier New', monospace;
    transition: all 0.3s ease;
    text-shadow: 0 0 5px rgba(0, 255, 234, 0.5);
}

.api-input-slim:focus {
    outline: none;
    border-color: #00ffea;
    box-shadow: 
        0 0 12px rgba(0, 255, 234, 0.5),
        inset 0 0 8px rgba(0, 255, 234, 0.1);
}

.sort-select-slim {
    background: rgba(0, 10, 20, 0.8);
    border: 1px solid rgba(0, 255, 234, 0.4);
    border-radius: 5px;
    padding: 8px 30px 8px 10px;
    color: #00ffea;
    font-size: 10px;
    width: 100%;
    margin-bottom: 12px;
    cursor: pointer;
    appearance: none;
    font-family: 'Courier New', monospace;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%2300ffea' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 10px;
    transition: all 0.3s ease;
}

.sort-select-slim:hover {
    background-color: rgba(0, 255, 234, 0.1);
    box-shadow: 0 0 10px rgba(0, 255, 234, 0.3);
}

.sort-select-slim:focus {
    outline: none;
    border-color: #00ffea;
    box-shadow: 
        0 0 12px rgba(0, 255, 234, 0.5),
        inset 0 0 8px rgba(0, 255, 234, 0.1);
}

.users-slim {
    background: rgba(0, 5, 10, 0.5);
    border-radius: 6px;
    padding: 4px;
    border: 1px solid rgba(0, 255, 234, 0.2);
}

.user-slim {
    background: linear-gradient(135deg, 
        rgba(0, 20, 40, 0.7) 0%, 
        rgba(20, 0, 40, 0.7) 100%);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 6px;
    border: 1px solid rgba(0, 255, 234, 0.2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.user-slim:hover {
    border-color: rgba(0, 255, 234, 0.4);
    box-shadow: 0 0 12px rgba(0, 255, 234, 0.2);
}

.user-slim::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
        transparent, 
        rgba(0, 255, 234, 0.5), 
        transparent);
}

.user-header-slim {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 2px 0;
}

.user-name-slim {
    font-size: 11px;
    font-weight: 600;
    color: #8af5ff;
    max-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-shadow: 0 0 5px rgba(138, 245, 255, 0.5);
    font-family: 'Orbitron', monospace;
    letter-spacing: 0.5px;
}

.user-balance-slim {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 4px;
    min-width: 60px;
    text-align: center;
    font-family: 'Orbitron', monospace;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.balance-positive-slim {
    background: linear-gradient(135deg, 
        rgba(16, 185, 129, 0.2) 0%, 
        rgba(16, 185, 129, 0.1) 100%);
    color: #10f5c9;
    border: 1px solid rgba(16, 185, 129, 0.4);
    text-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
}

.balance-positive-slim:hover {
    background: linear-gradient(135deg, 
        rgba(16, 185, 129, 0.3) 0%, 
        rgba(16, 185, 129, 0.2) 100%);
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
}

.balance-negative-slim {
    background: linear-gradient(135deg, 
        rgba(255, 65, 108, 0.2) 0%, 
        rgba(255, 65, 108, 0.1) 100%);
    color: #ff416c;
    border: 1px solid rgba(255, 65, 108, 0.4);
    text-shadow: 0 0 6px rgba(255, 65, 108, 0.5);
}

.balance-negative-slim:hover {
    background: linear-gradient(135deg, 
        rgba(255, 65, 108, 0.3) 0%, 
        rgba(255, 65, 108, 0.2) 100%);
    box-shadow: 0 0 12px rgba(255, 65, 108, 0.3);
}

.user-details-slim {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(0, 255, 234, 0.2);
    display: none;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.items-slim {
    margin-bottom: 8px;
}

.item-row-slim {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 6px;
    background: rgba(0, 10, 20, 0.6);
    border-radius: 3px;
    margin-bottom: 4px;
    font-size: 9px;
    border: 1px solid rgba(0, 255, 234, 0.1);
    transition: all 0.2s ease;
}

.item-row-slim:hover {
    background: rgba(0, 255, 234, 0.1);
    border-color: rgba(0, 255, 234, 0.3);
    transform: translateX(3px);
}

.item-info-slim {
    display: flex;
    align-items: center;
    gap: 6px;
}

.item-name-slim {
    color: #b8f5ff;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
    text-shadow: 0 0 3px rgba(184, 245, 255, 0.5);
}

.item-count-slim {
    color: #00ffea;
    font-weight: 700;
    font-size: 9px;
    font-family: 'Orbitron', monospace;
}

.item-price-slim {
    font-weight: 700;
    font-size: 9px;
    color: #10f5c9;
    font-family: 'Orbitron', monospace;
    text-shadow: 0 0 5px rgba(16, 245, 201, 0.5);
}

.item-used-slim .item-price-slim {
    color: #ff416c;
    text-shadow: 0 0 5px rgba(255, 65, 108, 0.5);
}

.item-v2 {
    background: rgba(255, 153, 0, 0.08) !important;
    border-left: 3px solid rgba(255, 153, 0, 0.4) !important;
}

.v2-indicator {
    color: #ff9900 !important;
    margin-left: 3px;
    font-size: 9px;
    vertical-align: super;
}

.loan-indicator {
    color: #ffcc00 !important;
    margin-left: 3px;
    font-size: 9px;
    vertical-align: super;
}

.item-time-slim {
    color: #8af5ff;
    font-size: 8px;
    margin-left: 5px;
    min-width: 45px;
    text-align: right;
    opacity: 0.8;
    font-family: 'Courier New', monospace;
}

.user-actions-slim {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
}

.action-btn-slim {
    background: linear-gradient(135deg, 
        #ff416c 0%, 
        #ff4b2b 100%);
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: 'Orbitron', monospace;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.action-btn-slim:before {
    content: "✧";
    font-size: 9px;
    margin-right: 3px;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.action-btn-slim:hover {
    transform: scale(1.05);
    box-shadow: 
        0 0 15px rgba(255, 65, 108, 0.6),
        0 0 30px rgba(255, 65, 108, 0.3);
}

.empty-state-slim {
    text-align: center;
    padding: 25px 12px;
    color: rgba(138, 245, 255, 0.6);
    font-size: 10px;
    font-family: 'Orbitron', monospace;
}

.empty-state-slim:before {
    content: "🛰️";
    font-size: 28px;
    display: block;
    margin-bottom: 8px;
    opacity: 0.7;
    filter: drop-shadow(0 0 6px rgba(0, 255, 234, 0.5));
    animation: spin 10s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

#bubbleBtn {
    position: fixed;
    bottom: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, 
        rgba(0, 40, 60, 0.9) 0%, 
        rgba(60, 0, 80, 0.9) 100%);
    color: #00ffea;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10000;
    font-size: 20px;
    box-shadow: 
        0 0 20px rgba(0, 255, 234, 0.5),
        0 0 40px rgba(138, 43, 226, 0.3);
    border: 1px solid rgba(0, 255, 234, 0.5);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: floatBtn 3s ease-in-out infinite;
}

@keyframes floatBtn {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(10deg); }
}

#bubbleBtn:hover {
    transform: scale(1.2) rotate(20deg);
    box-shadow: 
        0 0 40px rgba(0, 255, 234, 0.8),
        0 0 80px rgba(138, 43, 226, 0.5);
}

#bubbleBtn:before {
    content: "👽";
    filter: drop-shadow(0 0 8px #00ffea);
}

.panel-content::-webkit-scrollbar {
    width: 5px;
}

.panel-content::-webkit-scrollbar-track {
    background: rgba(0, 255, 234, 0.05);
    border-radius: 2px;
}

.panel-content::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, 
        rgba(0, 255, 234, 0.5) 0%, 
        rgba(138, 43, 226, 0.5) 100%);
    border-radius: 2px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, 
        rgba(0, 255, 234, 0.7) 0%, 
        rgba(138, 43, 226, 0.7) 100%);
}

.loading {
    position: relative;
}

.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid rgba(0, 255, 234, 0.3);
    border-top-color: #00ffea;
    border-radius: 50%;
    animation: loading 1s linear infinite;
}

@keyframes loading {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Remove overdue warning */
.v2-overdue-warning {
    display: none !important;
}
`);

function showWarning(message, duration = 30000){
    const warning = document.createElement("div");
    warning.className = "halo-warning";
    warning.innerHTML = `⚠️ ${message}`;
    warning.style.cursor = "pointer";
    warning.onclick = () => warning.remove();
    
    const panelContent = document.querySelector(".panel-content");
    if(panelContent) {
        const existingWarnings = panelContent.querySelectorAll('.halo-warning');
        existingWarnings.forEach(w => w.remove());
        
        panelContent.insertBefore(warning, panelContent.firstChild);
        
        if(duration > 0) {
            setTimeout(() => {
                if(warning.parentNode) warning.remove();
            }, duration);
        }
    }
}

/* ---------- RENDER FUNCTIONS ---------- */
function renderItemListCompact(items, isUsed = false) {
    if (!items || Object.keys(items).length === 0) {
        return '<div class="empty-state-slim" style="font-size: 9px; padding: 6px;">NO ITEMS</div>';
    }
    
    const entries = Object.entries(items);
    
    return entries.map(([k, v]) => {
        const shortName = v.itemName ? v.itemName.split(' ').pop() : k.replace('item:', '');
        const timeDate = v.last ? formatTimeDate(v.last) : "";
        
        let itemClass = "item-row-slim";
        if (isUsed) itemClass += " item-used-slim";
        if (v.source === 'v2') itemClass += " item-v2";
        
        let indicators = '';
        if (v.source === 'v2') {
            indicators += '<span class="v2-indicator" title="Recovered via V2 backup">🔄</span>';
        }
        if (v.isHalfPrice) {
            indicators += '<span class="loan-indicator" title="Loan (50% price)">📜</span>';
        }
        
        return `
            <div class="${itemClass}">
                <div class="item-info-slim">
                    <span class="item-name-slim" title="${v.itemName || k}">${shortName}</span>
                    <span class="item-count-slim">x${v.count}</span>
                    <span class="item-price-slim">$${v.price.toLocaleString()}</span>
                    ${indicators}
                </div>
                <div class="item-time-slim">${timeDate}</div>
            </div>
        `;
    }).join("");
}

function updateStats() {
    const activeUsers = [...new Set([...Object.keys(usedItems), ...Object.keys(deposits)])].filter(u => getNetValue(u) !== 0).length;
    const totalProcessed = Object.keys(processedLogs).length;
    const cachedPrices = Object.keys(priceCache).length;
    
    document.getElementById("statUsers").textContent = activeUsers;
    document.getElementById("statLogs").textContent = totalProcessed;
    document.getElementById("statCache").textContent = cachedPrices;
    
    const v2Recovered = v2Stats.recovered || 0;
    const v2Element = document.getElementById("statV2");
    if(v2Element){
        v2Element.innerHTML = `
            <div class="stat-slim-number">${v2Recovered}</div>
            <div class="stat-slim-label">V2 RECOVERED</div>
        `;
    }
    
    const lastRunElement = document.getElementById("v2LastRun");
    if(lastRunElement){
        if(v2Stats.lastRun > 0){
            const lastRun = new Date(v2Stats.lastRun);
            const hours = String(lastRun.getHours()).padStart(2, '0');
            const minutes = String(lastRun.getMinutes()).padStart(2, '0');
            const truncated = v2Stats.truncated ? ' ⚠️' : '';
            lastRunElement.textContent = `Last V2: ${hours}:${minutes}${truncated}`;
            lastRunElement.title = v2Stats.truncated ? "V2 recovery was truncated - some logs may be missing" : "";
        } else {
            lastRunElement.textContent = "V2: Never run";
        }
    }
}

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

function renderPanel() {
    const div = document.getElementById("debtLog");
    let users = [...new Set([...Object.keys(usedItems), ...Object.keys(deposits)])];
    
    users = users.filter(u => getNetValue(u) !== 0);
    
    if (users.length === 0) {
        div.innerHTML = `
            <div class="empty-state-slim">
                <div>NO ACTIVE BALANCES</div>
                <div style="margin-top: 5px; font-size: 9px;">CONFIGURE API KEYS ABOVE</div>
            </div>
        `;
        updateStats();
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
                        <button class="action-btn-slim" data-user="${u}">CLEAR</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

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
            if (confirm(`CLEAR BALANCE FOR ${user}?`)) {
                delete usedItems[user];
                delete deposits[user];
                GM_setValue("usedItems", usedItems);
                GM_setValue("deposits", deposits);
                renderPanel();
            }
        };
    });

    updateStats();
}

/* ---------- UI CREATION ---------- */
const panel = document.createElement("div");
panel.id = "armoryPanel";
panel.innerHTML = `
<div class="panel-header">
    <h1>HALO ARMORY V2</h1>
    <div class="header-controls">
        <button class="header-btn" id="refreshBtn" title="Refresh">⟳</button>
        <button class="header-btn" id="v2NowBtn" title="Run V2 Now" style="color: #ff9900;">V2</button>
        <button class="header-btn" id="closeBtn" title="Close">✕</button>
    </div>
</div>
<div class="panel-content">
    <div class="stats-slim">
        <div class="stat-slim">
            <div class="stat-slim-number" id="statUsers">0</div>
            <div class="stat-slim-label">ACTIVE USERS</div>
        </div>
        <div class="stat-slim">
            <div class="stat-slim-number" id="statLogs">0</div>
            <div class="stat-slim-label">LOGS PROCESSED</div>
        </div>
        <div class="stat-slim">
            <div class="stat-slim-number" id="statCache">0</div>
            <div class="stat-slim-label">PRICE CACHE</div>
        </div>
        <div class="stat-slim v2-stat">
            <div class="stat-slim-number" id="statV2">0</div>
            <div class="stat-slim-label">V2 RECOVERED</div>
        </div>
    </div>
    
    <div class="v2-last-run" id="v2LastRun"></div>

    <div class="api-toggle" id="apiToggle">
        API CONFIGURATION
    </div>
    <div class="api-fields" id="apiFields">
        <input type="password" id="factionKeyInput" class="api-input-slim" placeholder="FACTION API KEY" value="${factionKey}">
        <input type="password" id="marketKeyInput" class="api-input-slim" placeholder="MARKET API KEY" value="${marketKey}">
    </div>

    <select id="sortUsers" class="sort-select-slim">
        <option value="debt">▼ HIGHEST DEBT</option>
        <option value="credit">▲ HIGHEST CREDIT</option>
        <option value="alphabetical">🔤 A-Z</option>
    </select>

    <div class="users-slim" id="debtLog"></div>
</div>`;

document.body.appendChild(panel);

const bubble = document.createElement("div");
bubble.id = "bubbleBtn";
document.body.appendChild(bubble);

let minimized = true;
let apiExpanded = false;

/* ---------- UI INTERACTIONS ---------- */
bubble.onclick = () => {
    minimized = !minimized;
    panel.style.display = minimized ? "none" : "block";
    if(!minimized) {
        updateStats();
    }
};

document.getElementById("closeBtn").onclick = () => {
    panel.style.display = "none";
    minimized = true;
};

document.getElementById("refreshBtn").onclick = () => {
    loadLogs();
};

document.getElementById("v2NowBtn").onclick = () => {
    runV2CatchUp();
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

document.getElementById("sortUsers").onchange = renderPanel;

/* ---------- INITIALIZATION ---------- */
// Auto-show panel if no API keys are set
if (!factionKey || !marketKey) {
    panel.style.display = "block";
    minimized = false;
    apiExpanded = true;
    document.getElementById("apiToggle").classList.add("expanded");
    document.getElementById("apiFields").style.display = "block";
}

/* ---------- START SYSTEMS ---------- */
// Initialize V2 scheduler
setTimeout(initializeV2Scheduler, 2000);

// Start V1 interval (45 seconds)
setInterval(loadLogs, REFRESH_MS);

// Run maintenance every hour
setInterval(() => {
    cleanupPriceCache();
    pruneProcessedLogs();
}, 60 * 60 * 1000);

// Initial load
loadLogs();

// Emergency check: if V2 hasn't run in over 7 hours, run it now
setTimeout(() => {
    const now = Date.now();
    if(v2Stats.lastRun && (now - v2Stats.lastRun) > (7 * 60 * 60 * 1000)) {
        console.warn("HALO: Emergency - V2 hasn't run in over 7 hours!");
        showWarning("V2 hasn't run in over 7 hours! Running emergency catch-up...", 15000);
        setTimeout(runV2CatchUp, 3000);
    }
}, 5000);

})();