// ==UserScript==
// @name         HALO Armory Tracker Pro (Alien UI) - V2 Enhanced - FIXED
// @namespace    http://tampermonkey.net/
// @version      HALO.5.9
// @description  Faction armory tracker with V2 countdown scheduler and alien UI - Fixed medical items, V2 mutex, price protection
// @author       Nova
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/560935/HALO%20Armory%20Tracker%20Pro%20%28Alien%20UI%29%20-%20V2%20Enhanced%20-%20FIXED.user.js
// @updateURL https://update.greasyfork.org/scripts/560935/HALO%20Armory%20Tracker%20Pro%20%28Alien%20UI%29%20-%20V2%20Enhanced%20-%20FIXED.meta.js
// ==/UserScript==

(function(){
"use strict";

/* ---------- DEBUG MODE ---------- */
const DEBUG_MODE = false; // Set to true for troubleshooting

/* ---------- CONFIG ---------- */
const factionIds = ["48418"];
const REFRESH_MS = 45000; // V1: 45 seconds
const V2_INTERVAL_MS = 6 * 60 * 60 * 1000; // V2: 6 hours
const PRICE_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const PROCESSED_LOGS_PRUNE_DAYS = 7;
const V2_MARKERS_PRUNE_DAYS = 3;
const MAX_V2_PAGES = 20;
const ZERO_BALANCE_ARCHIVE_DAYS = 30; // Archive users after 30 days inactive

/* ---------- FACTION RULES ---------- */
const FREE_ITEMS = [
    "chocolate kisses", "beer", "chocolate bars", 
    "lollipop", "sweet hearts", "blood bag", "empty blood bag"
];

// UPDATED: Correct Torn item names
const MEDICAL_ITEMS = [
    "first aid kit",        // Torn: "First Aid Kit"
    "small first aid kit",  // Torn: "Small First Aid Kit"
    "morphine",             // Torn: "Morphine"
    "ipecac syrup",         // Torn: "Ipecac Syrup"
    "neumune tablet",       // Torn: "Neumune Tablet"
    "antidote"              // Torn: "Antidote"
];

const STANDARD_DEPOSIT_RATE = 0.90;
const XANAX_DEPOSIT_RATE = 0.9375;
const STANDARD_USE_RATE = 0.95;
const MEDICAL_EXCESS_RATE = 1.00;
const BLOOD_BAG_FILL_CREDIT = 200;
const DAILY_MEDICAL_LIMIT = 100000;
const LOAN_DISCOUNT_RATE = 0.50;

// XANAX BASELINE PRICE - For USE only
const XANAX_BASELINE_PRICE = 815000;

/* ---------- V2 MUTEX ---------- */
let v2Lock = { active: false, expires: 0 };

/* ---------- ENHANCED STORAGE ---------- */
let factionKey = GM_getValue("FACTION_API_KEY","");
let marketKey  = GM_getValue("MARKET_API_KEY","");

let usedItems     = GM_getValue("usedItems", {});
let deposits      = GM_getValue("deposits", {});
let processedLogs = GM_getValue("processedLogs", {});
let medWindows    = GM_getValue("medWindows", {});
let beerWindows   = GM_getValue("beerWindows", {});

// Archive for zero-balance users
let archivedUsers = GM_getValue("archivedUsers", {});

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

/* ---------- DEBUG LOGGING ---------- */
function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log("HALO DEBUG:", ...args);
    }
}

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

// FIXED: All string comparisons now case-insensitive
function isFree(itemName){
    const lowerName = itemName.toLowerCase();
    return FREE_ITEMS.some(freeItem => lowerName.includes(freeItem));
}

function isMedical(itemName){
    const lowerName = itemName.toLowerCase();
    return MEDICAL_ITEMS.some(medItem => lowerName.includes(medItem));
}

function isXanax(itemName){
    return itemName.toLowerCase().includes("xanax");
}

function isFillingBloodBag(text, itemName){
    return text.toLowerCase().includes("filled") && 
           itemName.toLowerCase().includes("empty blood bag");
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

// FIXED: Median of lowest 3 listings for price manipulation protection
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
        
        // Filter out single-item listings (troll protection)
        const validListings = listings.filter(l => l.quantity > 1);
        const listingsToUse = validListings.length > 0 ? validListings : listings;
        
        // Sort by price
        listingsToUse.sort((a,b)=> (a.price||a.cost||0)-(b.price||b.cost||0));
        
        let price;
        
        // Take median of lowest 3 listings for manipulation protection
        if(listingsToUse.length >= 3) {
            const lowestThree = listingsToUse.slice(0, 3);
            lowestThree.sort((a,b) => (a.price||a.cost||0) - (b.price||b.cost||0));
            price = lowestThree[1].price || lowestThree[1].cost; // Median (middle of 3)
            debugLog(`Price median: ${itemName} - prices:`, lowestThree.map(l => l.price || l.cost), `selected: ${price}`);
        } else {
            price = listingsToUse[0].price || listingsToUse[0].cost;
        }
        
        price = Math.round(price);
        
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
// FIXED: Medical tracking logic - returns true if OVER limit
function processMedicalUse(user, value, ts){
    const day = dayFromLog(ts);
    medWindows[user] ??= {};
    medWindows[user][day] ??= 0;
    medWindows[user][day] += value;
    GM_setValue("medWindows", medWindows);
    
    const isOverLimit = medWindows[user][day] > DAILY_MEDICAL_LIMIT;
    debugLog(`Medical window: ${user} on ${day} = $${medWindows[user][day]}, over limit: ${isOverLimit}`);
    return isOverLimit; // Returns TRUE if OVER the limit
}

/* ---------- NET VALUE ---------- */
function getNetValue(user){
    let dep = 0, use = 0;
    for(const k in deposits[user]||{}) dep += deposits[user][k].price * deposits[user][k].count;
    for(const k in usedItems[user]||{}) use += usedItems[user][k].price * usedItems[user][k].count;
    return Math.round(dep - use);
}

/* ---------- ARCHIVE SYSTEM ---------- */
function getUserLastActivity(user){
    let lastActivity = 0;
    
    // Check deposits
    for(const k in deposits[user] || {}) {
        const entry = deposits[user][k];
        if(entry.last && entry.last > lastActivity) {
            lastActivity = entry.last;
        }
    }
    
    // Check used items
    for(const k in usedItems[user] || {}) {
        const entry = usedItems[user][k];
        if(entry.last && entry.last > lastActivity) {
            lastActivity = entry.last;
        }
    }
    
    return lastActivity * 1000; // Convert to milliseconds
}

function archiveZeroBalanceUsers(){
    const now = Date.now();
    let archived = 0;
    
    const users = [...new Set([...Object.keys(usedItems), ...Object.keys(deposits)])];
    
    for(const user of users) {
        const net = getNetValue(user);
        const lastActivity = getUserLastActivity(user);
        const daysInactive = (now - lastActivity) / (24 * 60 * 60 * 1000);
        
        if(net === 0 && daysInactive > ZERO_BALANCE_ARCHIVE_DAYS) {
            // Archive user data
            archivedUsers[user] = {
                deposits: deposits[user] || {},
                usedItems: usedItems[user] || {},
                archivedAt: now,
                lastActivity: lastActivity
            };
            
            // Remove from active storage
            delete deposits[user];
            delete usedItems[user];
            archived++;
            
            debugLog(`Archived zero-balance user: ${user} (inactive ${Math.round(daysInactive)} days)`);
        }
    }
    
    if(archived > 0) {
        GM_setValue("deposits", deposits);
        GM_setValue("usedItems", usedItems);
        GM_setValue("archivedUsers", archivedUsers);
        console.log(`HALO: Archived ${archived} zero-balance users`);
    }
    
    return archived;
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
            // FIXED: Namespace log IDs to prevent collisions
            const namespacedId = `v2:${log.id}`;
            if(!processedLogs[namespacedId]){
                allLogs.push({...log, namespacedId});
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
    // FIXED: Namespace processed log IDs
    const namespacedId = source === 'v1' ? `v1:${logId}` : `v2:${logId}`;
    
    if(processedLogs[namespacedId]) {
        debugLog(`Skipping already processed log: ${namespacedId}`);
        return null;
    }
    
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
            debugLog(`Skipping free item: ${itemName} for ${user}`);
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
            debugLog(`Skipping free loan item: ${itemName} for ${user}`);
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
        result.logId = namespacedId; // Use namespaced ID
        result.timestamp = timestamp;
        debugLog(`Parsed ${source} log:`, result);
    }
    
    return result;
}

async function processParsedResult(result){
    if(!result) return;
    
    const { user, action, itemName, count, logId, timestamp, source, isHalfPrice, isBloodBagFill } = result;
    
    debugLog(`Processing: ${user} ${action} ${count}x ${itemName}`);
    
    const itemId = await resolveItemId(itemName);
    if(!itemId) {
        console.warn(`HALO: Could not process log ${logId} - unknown item: ${itemName}`);
        return;
    }
    
    const displayName = itemCache[itemId]?.name || itemName;
    debugLog(`Resolved item: ${itemName} -> ${displayName} (ID: ${itemId})`);
    
    let price = null;
    
    if(isBloodBagFill){
        price = BLOOD_BAG_FILL_CREDIT;
        debugLog(`Blood bag fill: fixed price $${price}`);
    } else {
        const marketPrice = await resolvePriceWithCache(itemId, displayName);
        if(!marketPrice) {
            console.warn(`HALO: No price for item ${itemId} (${displayName})`);
            return;
        }
        
        debugLog(`Market price for ${displayName}: $${marketPrice}`);
        
        let adjustedPrice = marketPrice;
        
        // FIXED: Medical logic - track all medical items, only charge if over limit
        if(isMedical(displayName)){
            debugLog(`Medical item detected: ${displayName}`);
            const isOverMedicalLimit = processMedicalUse(user, marketPrice, timestamp);
            
            if(isOverMedicalLimit){
                // Over limit - charge at 100%
                adjustedPrice = Math.round(marketPrice * MEDICAL_EXCESS_RATE);
                debugLog(`Medical OVER limit: charging $${adjustedPrice}`);
            } else {
                // Under limit - FREE
                adjustedPrice = 0;
                debugLog(`Medical UNDER limit: FREE (daily total: $${medWindows[user]?.[dayFromLog(timestamp)] || 0})`);
            }
        }
        // Apply Xanax baseline for USE only (after use rate)
        else if(action === 'use' && isXanax(displayName)){
            adjustedPrice *= STANDARD_USE_RATE;
            if(adjustedPrice < XANAX_BASELINE_PRICE) {
                adjustedPrice = XANAX_BASELINE_PRICE;
                debugLog(`Xanax price floor applied: $${adjustedPrice}`);
            }
        } else if(action === 'deposit' || action === 'filled'){
            adjustedPrice *= isXanax(displayName) ? XANAX_DEPOSIT_RATE : STANDARD_DEPOSIT_RATE;
            debugLog(`Deposit rate applied: $${adjustedPrice}`);
        } else if(action === 'use' || action === 'loan'){
            adjustedPrice *= STANDARD_USE_RATE;
            
            if(isHalfPrice){
                adjustedPrice *= LOAN_DISCOUNT_RATE;
                debugLog(`Loan discount applied: $${adjustedPrice}`);
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
        debugLog(`Added deposit: ${user} +${count}x ${displayName} @ $${price}`);
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
        debugLog(`Added use: ${user} -${count}x ${displayName} @ $${price}`);
    }
    
    processedLogs[logId] = {
        source: source,
        timestamp: timestamp
    };
    
    if(source === 'v2'){
        v2Stats.recovered++;
        v2Stats.lastRun = Date.now();
        GM_setValue("v2Stats", v2Stats);
        debugLog(`V2 recovered log: ${logId}`);
    }
}

/* ---------- V2 COUNTDOWN SCHEDULER ---------- */
async function runV2CatchUp(){
    // FIXED: V2 mutex to prevent overlapping runs
    const now = Date.now();
    if (v2Lock.active && now < v2Lock.expires) {
        console.log("HALO: V2 already running, skipping");
        return;
    }
    
    // Set mutex lock (expires in 10 minutes in case of crash)
    v2Lock = { active: true, expires: now + (10 * 60 * 1000) };
    
    try {
        if(!factionKey) return;
        
        console.log("HALO: Running V2 catch-up...");
        
        // Update schedule BEFORE running (in case of crash)
        v2Schedule.lastFetch = now;
        v2Schedule.nextScheduled = v2Schedule.lastFetch + V2_INTERVAL_MS;
        v2Schedule.lastCheck = now;
        GM_setValue("v2Schedule", v2Schedule);
        
        // Get last V2 fetch timestamp
        let sinceTime = v2Stats.lastRun ? Math.floor(v2Stats.lastRun / 1000) : 0;
        
        // If first run or very old, go back 24 hours
        if(sinceTime === 0 || (now - v2Stats.lastRun) > 86400000) {
            sinceTime = Math.floor(now / 1000) - 86400;
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
        archiveZeroBalanceUsers();
        
        // Update UI
        renderPanel();
    } catch (error) {
        console.error("HALO: V2 catch-up error:", error);
    } finally {
        // Always release mutex
        v2Lock = { active: false, expires: 0 };
    }
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
/* Compact Panel with Better Size */
#armoryPanel {
    position: fixed;
    bottom: 0;
    right: 15px;
    width: 250px;
    height: 80vh;
    background: 
        radial-gradient(circle at 20% 80%, rgba(0, 40, 60, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(60, 0, 80, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, rgba(5, 5, 15, 0.97) 0%, rgba(15, 5, 25, 0.97) 100%);
    color: #00ffea;
    font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
    border-radius: 8px 8px 0 0;
    padding: 0;
    overflow: hidden;
    box-shadow: 
        0 0 25px rgba(0, 255, 234, 0.4),
        0 0 50px rgba(138, 43, 226, 0.3),
        inset 0 0 15px rgba(0, 255, 234, 0.15);
    display: none;
    z-index: 9999;
    border: 1px solid rgba(0, 255, 234, 0.4);
    border-bottom: none;
    backdrop-filter: blur(8px);
    font-size: 11px;
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
    opacity: 0.7;
}

@keyframes hologram {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

/* Minimal Header - Smaller heading */
.panel-header {
    background: linear-gradient(90deg, 
        rgba(10, 20, 30, 0.95) 0%, 
        rgba(30, 10, 40, 0.95) 100%);
    padding: 6px 10px;
    border-bottom: 1px solid rgba(0, 255, 234, 0.3);
    position: relative;
    backdrop-filter: blur(4px);
    min-height: 28px;
    text-align: center;
}

.panel-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, 
        transparent, 
        rgba(0, 255, 234, 0.8), 
        transparent);
    animation: scanline 2s linear infinite;
}

@keyframes scanline {
    0% { left: 10%; right: 10%; }
    50% { left: 15%; right: 15%; }
    100% { left: 10%; right: 10%; }
}

.panel-header h1 {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    color: #00ffea;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    text-shadow: 
        0 0 6px rgba(0, 255, 234, 0.7),
        0 0 12px rgba(0, 255, 234, 0.3);
    letter-spacing: 0.8px;
    text-transform: uppercase;
    font-family: 'Orbitron', 'Courier New', monospace;
}

.panel-header h1:before {
    content: "🛸";
    font-size: 14px;
    filter: drop-shadow(0 0 4px #00ffea);
}

/* No header buttons at all */
.header-controls {
    display: none;
}

.panel-content {
    padding: 12px;
    height: calc(100% - 28px);
    overflow-y: auto;
    background: rgba(0, 5, 10, 0.8);
}

/* Compact Stats Grid - 4 columns */
.stats-slim {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 12px;
    background: rgba(0, 255, 234, 0.08);
    border-radius: 8px;
    padding: 12px 10px;
    border: 1px solid rgba(0, 255, 234, 0.3);
    position: relative;
    overflow: hidden;
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
    font-size: 16px;
    font-weight: 800;
    color: #00ffea;
    text-shadow: 
        0 0 8px rgba(0, 255, 234, 0.8),
        0 0 16px rgba(0, 255, 234, 0.4);
    font-family: 'Orbitron', monospace;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
}

.stat-slim-label {
    font-size: 9px;
    color: #8af5ff;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 2px;
    opacity: 0.9;
    font-weight: 600;
    line-height: 1.1;
}

/* Rec Data - Orange style - UPDATED LABEL */
.rec-data-stat {
    background: linear-gradient(135deg, 
        rgba(255, 153, 0, 0.15) 0%, 
        rgba(255, 153, 0, 0.05) 100%) !important;
    border: 1px solid rgba(255, 153, 0, 0.3) !important;
}

.rec-data-stat .stat-slim-number {
    color: #ff9900 !important;
    text-shadow: 0 0 6px rgba(255, 153, 0, 0.5) !important;
}

.rec-data-stat .stat-slim-label {
    color: #ffcc88 !important;
}

/* V2 last run info */
.v2-last-run {
    font-size: 9px;
    color: rgba(255, 153, 0, 0.8);
    text-align: center;
    margin-top: 5px;
    font-family: 'Courier New', monospace;
}

/* V2 indicators */
.v2-indicator {
    color: #ff9900 !important;
    margin-left: 4px;
    font-size: 10px;
    vertical-align: super;
}

.loan-indicator {
    color: #ffcc00 !important;
    margin-left: 4px;
    font-size: 10px;
    vertical-align: super;
}

/* V2 item background */
.item-v2 {
    background: rgba(255, 153, 0, 0.08) !important;
    border-left: 2px solid rgba(255, 153, 0, 0.4) !important;
}

/* API Toggle - simple */
.api-toggle {
    background: rgba(0, 255, 234, 0.1);
    border: 1px solid rgba(0, 255, 234, 0.25);
    border-radius: 6px;
    padding: 8px 10px;
    margin-bottom: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 10px;
    color: #00ffea;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.api-toggle:hover {
    background: rgba(0, 255, 234, 0.15);
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
    margin-top: 8px;
    animation: slideDown 0.2s ease;
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
}

.api-input-slim {
    background: rgba(0, 10, 20, 0.9);
    border: 1px solid rgba(0, 255, 234, 0.3);
    border-radius: 5px;
    padding: 8px 10px;
    color: #00ffea;
    font-size: 10px;
    width: 100%;
    margin-bottom: 8px;
    box-sizing: border-box;
    font-family: 'Courier New', monospace;
    transition: all 0.3s ease;
}

.api-input-slim:focus {
    outline: none;
    border-color: #00ffea;
    box-shadow: 
        0 0 10px rgba(0, 255, 234, 0.5),
        inset 0 0 8px rgba(0, 255, 234, 0.1);
}

/* Users List */
.users-slim {
    background: rgba(0, 5, 10, 0.6);
    border-radius: 6px;
    padding: 5px;
    border: 1px solid rgba(0, 255, 234, 0.2);
}

.user-slim {
    background: linear-gradient(135deg, 
        rgba(0, 20, 40, 0.8) 0%, 
        rgba(20, 0, 40, 0.8) 100%);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 6px;
    border: 1px solid rgba(0, 255, 234, 0.2);
    transition: all 0.2s ease;
}

.user-slim:hover {
    border-color: rgba(0, 255, 234, 0.3);
    box-shadow: 0 0 10px rgba(0, 255, 234, 0.15);
}

.user-header-slim {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.user-name-slim {
    font-size: 12px;
    font-weight: 600;
    color: #8af5ff;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-shadow: 0 0 5px rgba(138, 245, 255, 0.5);
    font-family: 'Orbitron', monospace;
}

.user-balance-slim {
    font-size: 12px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 4px;
    min-width: 60px;
    text-align: center;
    font-family: 'Orbitron', monospace;
}

.balance-positive-slim {
    background: linear-gradient(135deg, 
        rgba(16, 185, 129, 0.2) 0%, 
        rgba(16, 185, 129, 0.1) 100%);
    color: #10f5c9;
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.balance-negative-slim {
    background: linear-gradient(135deg, 
        rgba(255, 65, 108, 0.2) 0%, 
        rgba(255, 65, 108, 0.1) 100%);
    color: #ff416c;
    border: 1px solid rgba(255, 65, 108, 0.3);
}

.user-details-slim {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(0, 255, 234, 0.2);
    display: none;
}

.items-slim {
    margin-bottom: 8px;
}

.item-row-slim {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    background: rgba(0, 10, 20, 0.7);
    border-radius: 4px;
    margin-bottom: 4px;
    font-size: 10px;
    border: 1px solid rgba(0, 255, 234, 0.1);
}

.item-info-slim {
    display: flex;
    align-items: center;
    gap: 6px;
}

.item-name-slim {
    color: #b8f5ff;
    max-width: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
}

.item-count-slim {
    color: #00ffea;
    font-weight: 700;
    font-size: 10px;
    font-family: 'Orbitron', monospace;
}

.item-price-slim {
    font-weight: 700;
    font-size: 10px;
    color: #10f5c9;
    font-family: 'Orbitron', monospace;
}

.item-used-slim .item-price-slim {
    color: #ff416c;
}

.item-time-slim {
    color: #8af5ff;
    font-size: 9px;
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
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: 'Orbitron', monospace;
    transition: all 0.2s ease;
}

.action-btn-slim:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(255, 65, 108, 0.6);
}

.empty-state-slim {
    text-align: center;
    padding: 30px 15px;
    color: rgba(138, 245, 255, 0.6);
    font-size: 11px;
    font-family: 'Orbitron', monospace;
}

.empty-state-slim:before {
    content: "🛰️";
    font-size: 24px;
    display: block;
    margin-bottom: 8px;
    opacity: 0.7;
    filter: drop-shadow(0 0 5px rgba(0, 255, 234, 0.5));
    animation: spin 10s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Debug toggle */
.debug-toggle {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 8px;
    color: rgba(255, 153, 0, 0.6);
    cursor: pointer;
    z-index: 100;
}

/* Bubble Button */
#bubbleBtn {
    position: fixed;
    bottom: 15px;
    right: 15px;
    width: 45px;
    height: 45px;
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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: floatBtn 3s ease-in-out infinite;
}

@keyframes floatBtn {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(8deg); }
}

#bubbleBtn:hover {
    transform: scale(1.2) rotate(15deg);
    box-shadow: 
        0 0 30px rgba(0, 255, 234, 0.8),
        0 0 60px rgba(138, 43, 226, 0.5);
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
    border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, 
        rgba(0, 255, 234, 0.5) 0%, 
        rgba(138, 43, 226, 0.5) 100%);
    border-radius: 3px;
}

/* Warning messages */
.halo-warning {
    background: linear-gradient(135deg, 
        rgba(255, 100, 0, 0.2) 0%, 
        rgba(255, 50, 0, 0.1) 100%);
    border: 1px solid rgba(255, 100, 0, 0.4);
    border-radius: 6px;
    padding: 8px 10px;
    margin-bottom: 10px;
    font-size: 10px;
    color: #ff9900;
    text-align: center;
    font-family: 'Courier New', monospace;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
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
        return '<div class="empty-state-slim" style="font-size: 10px; padding: 6px;">NO ITEMS</div>';
    }
    
    const entries = Object.entries(items);
    
    return entries.map(([k, v]) => {
        const shortName = v.itemName ? v.itemName.split(' ').pop() : k.replace('item:', '');
        const timeDate = v.last ? formatTimeDate(v.last) : "";
        
        let itemClass = "item-row-slim";
        if (isUsed) itemClass += " item-used-slim";
        if (v.source === 'v2') itemClass += " item-v2";
        
        // Build indicators like in HALO.5
        let indicators = '';
        if (v.source === 'v2') {
            indicators += '<span class="v2-indicator" title="Recovered via V2 backup">↻</span>';
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
    const v2Recovered = v2Stats.recovered || 0;
    
    document.getElementById("statUsers").textContent = activeUsers;
    document.getElementById("statLogs").textContent = totalProcessed;
    document.getElementById("statCache").textContent = cachedPrices;
    // UPDATED: Changed label from "RECOVERED" to "V2 LOGS"
    document.getElementById("statRecData").textContent = v2Recovered;
    
    // Update V2 last run time
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

function sortUsers(users) {
    // Always sort by highest debt (negative values first, then positive)
    return users.sort((a, b) => {
        const netA = getNetValue(a);
        const netB = getNetValue(b);
        
        if (netA < 0 && netB < 0) return netA - netB; // Both negative, lowest first
        if (netA < 0) return -1; // A negative, B positive
        if (netB < 0) return 1;  // A positive, B negative
        return netB - netA; // Both positive, highest first
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
                <div style="margin-top: 5px; font-size: 9px;">SET API KEYS</div>
            </div>
        `;
        updateStats();
        return;
    }
    
    // Always sort by highest debt
    users = sortUsers(users);

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
    <h1>HALO ARMORY V2.9</h1>
    ${DEBUG_MODE ? '<div class="debug-toggle" title="Debug Mode Active">DEBUG</div>' : ''}
</div>
<div class="panel-content">
    <div class="stats-slim">
        <div class="stat-slim">
            <div class="stat-slim-number" id="statUsers">0</div>
            <div class="stat-slim-label">USERS</div>
        </div>
        <div class="stat-slim">
            <div class="stat-slim-number" id="statLogs">0</div>
            <div class="stat-slim-label">LOGS</div>
        </div>
        <div class="stat-slim">
            <div class="stat-slim-number" id="statCache">0</div>
            <div class="stat-slim-label">CACHE</div>
        </div>
        <div class="stat-slim rec-data-stat">
            <div class="stat-slim-number" id="statRecData">0</div>
            <div class="stat-slim-label">V2 LOGS</div> <!-- UPDATED LABEL -->
        </div>
    </div>
    <div class="v2-last-run" id="v2LastRun"></div>

    <div class="api-toggle" id="apiToggle">
        API CONFIG
    </div>
    <div class="api-fields" id="apiFields">
        <input type="password" id="factionKeyInput" class="api-input-slim" placeholder="FACTION API KEY" value="${factionKey}">
        <input type="password" id="marketKeyInput" class="api-input-slim" placeholder="MARKET API KEY" value="${marketKey}">
    </div>

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
    archiveZeroBalanceUsers();
}, 60 * 60 * 1000);

// Initial load
loadLogs();

// Emergency check: if V2 hasn't run in over 7 hours, run it now
setTimeout(() => {
    const now = Date.now();
    if(v2Stats.lastRun && (now - v2Stats.lastRun) > (7 * 60 * 60 * 1000)) {
        console.warn("HALO: Emergency - V2 hasn't run in over 7 hours!");
        setTimeout(runV2CatchUp, 3000);
    }
}, 5000);

})();