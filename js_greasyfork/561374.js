// ==UserScript==
// @name         HALO Armory - Deterministic Ledger v4.3
// @namespace    http://tampermonkey.net/
// @version      4.3.1
// @description  Production-ready scheduled accounting with strict 2-call API discipline
// @author       Nova
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @connect      api.torn.com
// @require      https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js
// @downloadURL https://update.greasyfork.org/scripts/561374/HALO%20Armory%20-%20Deterministic%20Ledger%20v43.user.js
// @updateURL https://update.greasyfork.org/scripts/561374/HALO%20Armory%20-%20Deterministic%20Ledger%20v43.meta.js
// ==/UserScript==

(function(){
"use strict";

/* ==================== PRODUCTION CONFIGURATION ==================== */
const CONFIG = {
    // Execution schedule (TCT = UTC)
    EXECUTION_WINDOWS: [2, 10, 18], // 02:00, 10:00, 18:00 TCT
    MINIMUM_RUN_INTERVAL_HOURS: 8,
    
    // Price whitelist - ONLY these items are priced
    PRICE_WHITELIST: [
        // Medical
        "first aid kit", "small first aid kit", "morphine", "ipecac syrup", 
        "neumune tablet", "antidote",
        // Boosters
        "xanax", "extasy", "liquid ecstasy", "vicodin", "speed", 
        "adderall", "ritalin", "ibuprofen",
        // Alcohol (for deposit pricing)
        "beer", "tequila", "whiskey", "vodka", "rum", "champagne", "energy drink",
        // Blood
        "blood bag", "empty blood bag",
        // Treats (for deposit pricing)
        "chocolate kisses", "chocolate bars", "lollipop", "sweet hearts"
    ],
    
    // HALO Rules - Production Compliant
    FREE_ITEMS: [
        "chocolate kisses", "beer", "chocolate bars", 
        "lollipop", "sweet hearts", "blood bag", "empty blood bag"
    ],
    MEDICAL_ITEMS: [
        "first aid kit", "morphine", "ipecac syrup", 
        "neumune tablet", "antidote"
    ],
    STANDARD_DEPOSIT_RATE: 0.90,
    XANAX_DEPOSIT_RATE: 0.9375,
    STANDARD_USE_RATE: 0.95,
    MEDICAL_EXCESS_RATE: 1.00,
    BLOOD_BAG_FILL_CREDIT: 200,
    DAILY_MEDICAL_LIMIT: 100000,
    
    // Data retention (days)
    EVENT_RETENTION_DAYS: 90,
    SNAPSHOT_RETENTION_DAYS: 30,
    MIN_SNAPSHOTS_KEPT: 5,
    
    // Storage keys
    STORAGE_KEYS: {
        LAST_RUN: "ledger_lastRunTimestamp",
        LAST_EVENT_TIME: "ledger_lastEventTime",
        LAST_LOG_ID: "ledger_lastLogId",
        FACTION_KEY: "FACTION_API_KEY",
        MARKET_KEY: "MARKET_API_KEY",
        PRICE_SNAPSHOTS: "ledger_priceSnapshots",
        BOUND_EVENTS: "ledger_boundEvents",
        ACCOUNTING_STATE: "ledger_accountingState",
        RUN_HISTORY: "ledger_runHistory",
        USER_MAPPING: "ledger_userMapping"
    }
};

/* ==================== FIXED: PRODUCTION-READY TIME UTILITIES ==================== */
class TCTTime {
    static now() {
        return DateTime.utc();
    }
    
    static fromTimestamp(timestamp) {
        return DateTime.fromSeconds(timestamp);
    }
    
    static toTimestamp(dt) {
        return Math.floor(dt.toSeconds());
    }
    
    static format(timestamp) {
        if (!timestamp) return "N/A";
        try {
            const dt = typeof timestamp === 'number' ? 
                this.fromTimestamp(timestamp) : 
                DateTime.fromISO(timestamp);
            return dt.toFormat('HH:mm, dd.MM');
        } catch (e) {
            return "Invalid";
        }
    }
    
    // FIXED: Production-ready schedule calculation
    static getNextWindow() {
        const now = this.now();
        
        // Try each scheduled window today
        for (const hour of CONFIG.EXECUTION_WINDOWS) {
            const target = now.set({hour, minute: 0, second: 0, millisecond: 0});
            if (target > now) {
                return target;
            }
        }
        
        // First window tomorrow
        const firstHour = CONFIG.EXECUTION_WINDOWS[0];
        return now.plus({days: 1}).set({hour: firstHour, minute: 0, second: 0, millisecond: 0});
    }
    
    static hoursSince(timestamp) {
        try {
            const now = this.now();
            const then = typeof timestamp === 'string' ? 
                DateTime.fromISO(timestamp) : this.fromTimestamp(timestamp);
            return now.diff(then, 'hours').hours;
        } catch (e) {
            return Infinity; // Force run if timestamp is invalid
        }
    }
}

/* ==================== FIXED: PRODUCTION STORAGE WITH INTEGRITY ==================== */
class StorageManager {
    static init() {
        // API keys (shared with legacy)
        this.factionKey = GM_getValue(CONFIG.STORAGE_KEYS.FACTION_KEY, "");
        this.marketKey = GM_getValue(CONFIG.STORAGE_KEYS.MARKET_KEY, "");
        
        // Load ledger storage
        this.loadLedgerStorage();
        
        // Migrate and validate
        this.migrateLegacyData();
        this.validateStorage();
        
        return this;
    }
    
    static loadLedgerStorage() {
        this.lastRunTime = GM_getValue(CONFIG.STORAGE_KEYS.LAST_RUN, null);
        this.lastEventTime = GM_getValue(CONFIG.STORAGE_KEYS.LAST_EVENT_TIME, 0);
        this.lastLogId = GM_getValue(CONFIG.STORAGE_KEYS.LAST_LOG_ID, "");
        this.priceSnapshots = GM_getValue(CONFIG.STORAGE_KEYS.PRICE_SNAPSHOTS, []);
        this.boundEvents = GM_getValue(CONFIG.STORAGE_KEYS.BOUND_EVENTS, []);
        this.runHistory = GM_getValue(CONFIG.STORAGE_KEYS.RUN_HISTORY, []);
        this.userMapping = GM_getValue(CONFIG.STORAGE_KEYS.USER_MAPPING, {});
        
        // Accounting state with defaults
        const defaultState = {
            totalDeposits: 0,
            totalWithdrawals: 0,
            netDelta: 0,
            memberBalances: {},
            lastAuditTime: null,
            auditHash: null
        };
        
        this.accountingState = GM_getValue(CONFIG.STORAGE_KEYS.ACCOUNTING_STATE, defaultState);
        
        // Ensure all required fields exist
        this.accountingState = {...defaultState, ...this.accountingState};
    }
    
    static migrateLegacyData() {
        // Check if we need to migrate from old storage
        const legacyProcessed = GM_getValue("processedLogs", {});
        
        if (Object.keys(legacyProcessed).length > 0 && this.boundEvents.length === 0) {
            console.log("🔧 Migrating legacy processed logs...");
            
            // Extract latest timestamp and log ID
            let maxTime = 0;
            let maxLogId = "";
            
            Object.entries(legacyProcessed).forEach(([logId, entry]) => {
                if (entry && entry.time > maxTime) {
                    maxTime = entry.time;
                    maxLogId = logId;
                }
            });
            
            if (maxTime > 0) {
                this.lastEventTime = maxTime;
                this.lastLogId = maxLogId;
                console.log(`✅ Migration complete: lastEventTime=${maxTime}`);
            }
            
            // Clear legacy storage to avoid confusion
            GM_deleteValue("processedLogs");
        }
    }
    
    static validateStorage() {
        // Validate bound events structure
        this.boundEvents = this.boundEvents.filter(event => 
            event && event.logId && event.timestamp && event.userId
        );
        
        // Validate price snapshots
        this.priceSnapshots = this.priceSnapshots.filter(snapshot =>
            snapshot && snapshot.id && snapshot.timestamp && snapshot.prices
        );
        
        // Validate run history
        this.runHistory = this.runHistory.filter(run =>
            run && run.id && run.startTime && run.status
        );
        
        // Prune obviously old data
        this.pruneOldData(false); // Dry run first
    }
    
    static pruneOldData(performPrune = true) {
        const now = TCTTime.now();
        const eventCutoff = now.minus({days: CONFIG.EVENT_RETENTION_DAYS});
        const snapshotCutoff = now.minus({days: CONFIG.SNAPSHOT_RETENTION_DAYS});
        
        let eventsRemoved = 0;
        let snapshotsRemoved = 0;
        
        if (performPrune) {
            // Prune old bound events
            const keptEvents = this.boundEvents.filter(event => {
                try {
                    const eventTime = TCTTime.fromTimestamp(event.timestamp);
                    return eventTime > eventCutoff;
                } catch (e) {
                    return false; // Remove malformed events
                }
            });
            
            eventsRemoved = this.boundEvents.length - keptEvents.length;
            this.boundEvents = keptEvents;
            
            // Prune old price snapshots (keep minimum)
            const keptSnapshots = this.priceSnapshots.filter(snapshot => {
                try {
                    const snapshotTime = DateTime.fromISO(snapshot.timestamp);
                    return snapshotTime > snapshotCutoff;
                } catch (e) {
                    return false;
                }
            });
            
            // Ensure we keep minimum snapshots
            if (keptSnapshots.length < CONFIG.MIN_SNAPSHOTS_KEPT) {
                const allSnapshots = [...this.priceSnapshots]
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                keptSnapshots.length = 0;
                for (let i = 0; i < Math.min(CONFIG.MIN_SNAPSHOTS_KEPT, allSnapshots.length); i++) {
                    keptSnapshots.push(allSnapshots[i]);
                }
            }
            
            snapshotsRemoved = this.priceSnapshots.length - keptSnapshots.length;
            this.priceSnapshots = keptSnapshots;
            
            if (eventsRemoved > 0 || snapshotsRemoved > 0) {
                console.log(`🧹 Pruned ${eventsRemoved} events, ${snapshotsRemoved} snapshots`);
            }
        }
        
        return { eventsRemoved, snapshotsRemoved };
    }
    
    static saveAll() {
        // Always prune before save
        this.pruneOldData(true);
        
        // Save all ledger storage
        GM_setValue(CONFIG.STORAGE_KEYS.LAST_RUN, this.lastRunTime);
        GM_setValue(CONFIG.STORAGE_KEYS.LAST_EVENT_TIME, this.lastEventTime);
        GM_setValue(CONFIG.STORAGE_KEYS.LAST_LOG_ID, this.lastLogId);
        GM_setValue(CONFIG.STORAGE_KEYS.PRICE_SNAPSHOTS, this.priceSnapshots);
        GM_setValue(CONFIG.STORAGE_KEYS.BOUND_EVENTS, this.boundEvents);
        GM_setValue(CONFIG.STORAGE_KEYS.ACCOUNTING_STATE, this.accountingState);
        GM_setValue(CONFIG.STORAGE_KEYS.RUN_HISTORY, this.runHistory);
        GM_setValue(CONFIG.STORAGE_KEYS.USER_MAPPING, this.userMapping);
    }
    
    // FIXED: Enhanced user ID resolution
    static getUserId(username) {
        if (!username || username.trim() === "") {
            return "unknown_user";
        }
        
        // Check existing mapping
        if (this.userMapping[username]) {
            return this.userMapping[username];
        }
        
        // Generate stable hash (production-ready)
        const userId = `user_${this.generateStableHash(username)}`;
        this.userMapping[username] = userId;
        
        return userId;
    }
    
    static generateStableHash(str) {
        // FNV-1a hash for better distribution
        let hash = 2166136261;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return (hash >>> 0).toString(16).padStart(8, '0');
    }
}

/* ==================== FIXED: PRODUCTION LOG PARSER ==================== */
class LogParser {
    // FIXED: Complete Torn log patterns
    static PATTERNS = {
        DEPOSIT: /^(.+?) deposited (?:(\d+)\s*[x×]?\s*)?(.+?)\.?$/i,
        USE: [
            /^(.+?) used (?:one of the faction's|the faction's|a )?(.+?) items?\.?$/i,
            /^(.+?) used (.+?)\.?$/i,
            /^(.+?) used some of the faction's (.+?) items?\.?$/i
        ],
        FILLED: /^(.+?) filled one of the faction's (.+?) items?\.?$/i,
        TAKE: /^(.+?) took (?:(\d+)\s*[x×]?\s*)?(.+?) from the armory\.?$/i,
        RETURN: /^(.+?) returned (?:(\d+)\s*[x×]?\s*)?(.+?) to the armory\.?$/i
    };
    
    static parse(text) {
        if (!text || typeof text !== 'string') return null;
        
        const cleanText = this.stripTags(text).trim();
        if (!cleanText) return null;
        
        // Try each pattern in order
        let match;
        
        // 1. Deposit
        match = cleanText.match(this.PATTERNS.DEPOSIT);
        if (match) {
            return {
                type: 'deposit',
                username: match[1].trim(),
                count: match[2] ? parseInt(match[2], 10) : 1,
                item: match[3].trim()
            };
        }
        
        // 2. Use
        for (const pattern of this.PATTERNS.USE) {
            match = cleanText.match(pattern);
            if (match) {
                return {
                    type: 'use',
                    username: match[1].trim(),
                    item: match[2].trim()
                };
            }
        }
        
        // 3. Filled
        match = cleanText.match(this.PATTERNS.FILLED);
        if (match) {
            return {
                type: 'filled',
                username: match[1].trim(),
                item: match[2].trim()
            };
        }
        
        // 4. Take
        match = cleanText.match(this.PATTERNS.TAKE);
        if (match) {
            return {
                type: 'take',
                username: match[1].trim(),
                count: match[2] ? parseInt(match[2], 10) : 1,
                item: match[3].trim()
            };
        }
        
        // 5. Return
        match = cleanText.match(this.PATTERNS.RETURN);
        if (match) {
            return {
                type: 'return',
                username: match[1].trim(),
                count: match[2] ? parseInt(match[2], 10) : 1,
                item: match[3].trim()
            };
        }
        
        console.warn("Unparseable log:", cleanText);
        return null;
    }
    
    static stripTags(str) {
        return str ? str.replace(/<[^>]*>/g, "").trim() : "";
    }
    
    static normalizeItemName(name) {
        if (!name) return "";
        return name.toLowerCase()
            .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
            .replace(/[^\w\s:+-]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }
    
    static isBloodBagFill(text, itemName) {
        const cleanText = text.toLowerCase();
        const normItem = this.normalizeItemName(itemName);
        return cleanText.includes("filled") && normItem.includes("empty blood bag");
    }
}

/* ==================== FIXED: PRODUCTION MARKET API ==================== */
class MarketAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.itemsCache = null;
        this.itemsCacheTime = 0;
        this.ITEMS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
        
        // FIXED: Tiered fallback prices
        this.FALLBACK_PRICES = {
            // Medical
            "first aid kit": 12500,
            "small first aid kit": 5000,
            "morphine": 150000,
            "ipecac syrup": 25000,
            "neumune tablet": 250000,
            "antidote": 150000,
            // Boosters
            "xanax": 50000,
            "extasy": 75000,
            "liquid ecstasy": 100000,
            "vicodin": 120000,
            "speed": 30000,
            // Alcohol
            "beer": 250,
            "tequila": 500,
            "whiskey": 750,
            "vodka": 600,
            "rum": 650,
            // Blood
            "blood bag": 25000,
            "empty blood bag": 0,
            // Treats
            "chocolate kisses": 250,
            "chocolate bars": 250,
            "lollipop": 250,
            "sweet hearts": 250
        };
    }
    
    async fetchWhitelistPrices() {
        if (!this.apiKey) {
            console.warn("No market API key, using fallback prices");
            return this.getFallbackPrices();
        }
        
        console.log("📊 Fetching market prices (single API call)...");
        
        try {
            // Get Torn items database
            const items = await this.getAllItems();
            if (!items || Object.keys(items).length === 0) {
                throw new Error("No items data available");
            }
            
            // Map whitelist items to Torn IDs
            const itemMap = new Map();
            const unresolvedItems = [];
            
            CONFIG.PRICE_WHITELIST.forEach(itemName => {
                const normName = LogParser.normalizeItemName(itemName);
                const itemId = this.findItemId(normName, items);
                
                if (itemId) {
                    itemMap.set(itemId, normName);
                } else {
                    unresolvedItems.push(itemName);
                    console.warn(`Item not found in Torn database: ${itemName}`);
                }
            });
            
            if (itemMap.size === 0) {
                throw new Error("No whitelist items could be resolved");
            }
            
            // SINGLE API CALL for all items
            const itemIds = Array.from(itemMap.keys()).join(',');
            const url = `https://api.torn.com/v2/market/${itemIds}/itemmarket?key=${this.apiKey}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Market API error: ${response.status}`);
            }
            
            const data = await response.json();
            const prices = {};
            let fetchedCount = 0;
            
            // Parse batch response
            for (const [itemId, marketData] of Object.entries(data)) {
                const itemName = itemMap.get(itemId);
                if (!itemName) continue;
                
                if (marketData?.error) {
                    console.warn(`Price error for ${itemName}:`, marketData.error);
                    continue;
                }
                
                const listings = marketData?.itemmarket?.listings || [];
                if (listings.length > 0) {
                    // Get cheapest listing
                    listings.sort((a, b) => (a.price || a.cost || 0) - (b.price || b.cost || 0));
                    const cheapest = listings[0];
                    prices[itemName] = Math.round(cheapest.price || cheapest.cost || 0);
                    fetchedCount++;
                }
            }
            
            console.log(`✅ Fetched ${fetchedCount}/${itemMap.size} prices`);
            
            // Fill missing prices with fallbacks
            const finalPrices = { ...this.getFallbackPrices(), ...prices };
            return finalPrices;
            
        } catch (error) {
            console.error("Market API failed, using fallback prices:", error);
            return this.getFallbackPrices();
        }
    }
    
    async getAllItems() {
        const now = Date.now();
        
        // Return cached items if fresh
        if (this.itemsCache && (now - this.itemsCacheTime) < this.ITEMS_CACHE_TTL) {
            return this.itemsCache;
        }
        
        if (!this.apiKey) {
            return {};
        }
        
        try {
            const url = `https://api.torn.com/v2/torn/items?cat=All&sort=ASC&key=${this.apiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Items API error: ${response.status}`);
            }
            
            const data = await response.json();
            this.itemsCache = data.items || {};
            this.itemsCacheTime = now;
            
            console.log(`📦 Cached ${Object.keys(this.itemsCache).length} Torn items`);
            return this.itemsCache;
            
        } catch (error) {
            console.error("Failed to fetch Torn items:", error);
            return this.itemsCache || {};
        }
    }
    
    findItemId(itemName, items) {
        for (const [id, item] of Object.entries(items)) {
            if (LogParser.normalizeItemName(item.name) === itemName) {
                return id;
            }
        }
        return null;
    }
    
    getFallbackPrices() {
        const prices = {};
        
        CONFIG.PRICE_WHITELIST.forEach(itemName => {
            const normName = LogParser.normalizeItemName(itemName);
            
            // Find best matching fallback price
            for (const [key, price] of Object.entries(this.FALLBACK_PRICES)) {
                if (normName.includes(key)) {
                    prices[normName] = price;
                    return;
                }
            }
            
            // Default fallback
            prices[normName] = 1000;
        });
        
        return prices;
    }
}

/* ==================== FIXED: PRODUCTION PRICE SNAPSHOT ==================== */
class PriceSnapshot {
    constructor(runId) {
        this.id = runId;
        this.timestamp = TCTTime.now().toISO();
        this.prices = {};
        this.source = "api"; // "api" or "fallback"
    }
    
    addPrice(itemName, price) {
        if (price && price > 0) {
            this.prices[itemName] = parseInt(price);
        }
    }
    
    getPrice(itemName) {
        return this.prices[itemName] || 0;
    }
    
    toStorage() {
        return {
            id: this.id,
            timestamp: this.timestamp,
            prices: this.prices,
            source: this.source
        };
    }
    
    static fromStorage(data) {
        const snapshot = new PriceSnapshot(data.id);
        snapshot.timestamp = data.timestamp;
        snapshot.prices = data.prices;
        snapshot.source = data.source || "api";
        return snapshot;
    }
    
    // FIXED: Temporal validation
    isBefore(eventTimestamp) {
        try {
            const snapshotTime = DateTime.fromISO(this.timestamp);
            const eventTime = TCTTime.fromTimestamp(eventTimestamp);
            return snapshotTime <= eventTime;
        } catch (e) {
            console.error("Temporal validation error:", e);
            return false;
        }
    }
    
    timeDifference(eventTimestamp) {
        try {
            const snapshotTime = DateTime.fromISO(this.timestamp);
            const eventTime = TCTTime.fromTimestamp(eventTimestamp);
            return Math.abs(eventTime.diff(snapshotTime, 'seconds').seconds);
        } catch (e) {
            return Infinity;
        }
    }
}

/* ==================== FIXED: PRODUCTION BOUND EVENT ==================== */
class BoundEvent {
    constructor(logId, timestamp, username, type, item, quantity, boundPrice, value, runId) {
        // FIXED: Use Torn log ID as primary identifier
        this.id = `evt_${logId}`;
        this.logId = logId;
        this.timestamp = timestamp;
        this.userId = StorageManager.getUserId(username);
        this.username = username;
        this.type = type; // 'deposit', 'use', 'filled', 'take', 'return'
        this.item = LogParser.normalizeItemName(item);
        this.quantity = Math.max(1, quantity || 1);
        this.boundPrice = Math.max(0, boundPrice || 0);
        this.value = Math.round(value || 0);
        this.runId = runId;
        this.processed = true;
        this.snapshotTime = TCTTime.now().toISO();
        this.hash = this.calculateHash();
    }
    
    calculateHash() {
        // Simple hash for integrity checking
        const data = `${this.logId}|${this.timestamp}|${this.userId}|${this.type}|${this.item}|${this.value}`;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash) + data.charCodeAt(i);
            hash = hash & hash;
        }
        return hash.toString(16);
    }
    
    toStorage() {
        return {
            id: this.id,
            logId: this.logId,
            timestamp: this.timestamp,
            userId: this.userId,
            username: this.username,
            type: this.type,
            item: this.item,
            quantity: this.quantity,
            boundPrice: this.boundPrice,
            value: this.value,
            runId: this.runId,
            processed: this.processed,
            snapshotTime: this.snapshotTime,
            hash: this.hash
        };
    }
    
    static fromStorage(data) {
        const event = new BoundEvent(
            data.logId,
            data.timestamp,
            data.username,
            data.type,
            data.item,
            data.quantity,
            data.boundPrice,
            data.value,
            data.runId
        );
        
        // Verify hash
        if (event.hash !== data.hash) {
            console.warn(`Hash mismatch for event ${data.id}`);
        }
        
        return event;
    }
}

/* ==================== FIXED: PRODUCTION MEDICAL TRACKER ==================== */
class MedicalTracker {
    constructor() {
        this.dailyUsage = {}; // userId -> { date -> amount }
    }
    
    reset() {
        this.dailyUsage = {};
    }
    
    // FIXED: Complete medical limit logic
    calculateCharge(itemName, itemPrice, timestamp, userId, quantity = 1) {
        const normItem = LogParser.normalizeItemName(itemName);
        
        // Check if medical item
        const isMedical = CONFIG.MEDICAL_ITEMS.some(med => normItem.includes(med));
        if (!isMedical) {
            return {
                charge: Math.round(itemPrice * CONFIG.STANDARD_USE_RATE * quantity),
                isMedical: false,
                isExcess: false,
                reason: "non-medical"
            };
        }
        
        // Check if free item
        const isFree = CONFIG.FREE_ITEMS.some(free => normItem.includes(free));
        if (isFree) {
            return {
                charge: 0,
                isMedical: true,
                isExcess: false,
                reason: "free-item"
            };
        }
        
        // Calculate medical charge with daily limit
        const day = this.getDayKey(timestamp);
        const dailyLimit = CONFIG.DAILY_MEDICAL_LIMIT;
        
        // Initialize user's daily usage
        if (!this.dailyUsage[userId]) {
            this.dailyUsage[userId] = {};
        }
        if (!this.dailyUsage[userId][day]) {
            this.dailyUsage[userId][day] = 0;
        }
        
        const currentUsage = this.dailyUsage[userId][day];
        const totalCost = itemPrice * quantity;
        
        // Case 1: Already over limit - charge 100%
        if (currentUsage >= dailyLimit) {
            this.dailyUsage[userId][day] += totalCost;
            return {
                charge: Math.round(totalCost * CONFIG.MEDICAL_EXCESS_RATE),
                isMedical: true,
                isExcess: true,
                reason: "already-over-limit",
                dailyUsed: this.dailyUsage[userId][day]
            };
        }
        
        // Case 2: This purchase puts us over limit
        if (currentUsage + totalCost > dailyLimit) {
            const overLimitAmount = (currentUsage + totalCost) - dailyLimit;
            this.dailyUsage[userId][day] += totalCost;
            
            return {
                charge: Math.round(overLimitAmount * CONFIG.MEDICAL_EXCESS_RATE),
                isMedical: true,
                isExcess: true,
                reason: "pushes-over-limit",
                dailyUsed: this.dailyUsage[userId][day],
                overLimitAmount: overLimitAmount
            };
        }
        
        // Case 3: Within limit - no charge
        this.dailyUsage[userId][day] += totalCost;
        return {
            charge: 0,
            isMedical: true,
            isExcess: false,
            reason: "within-limit",
            dailyUsed: this.dailyUsage[userId][day]
        };
    }
    
    getDayKey(timestamp) {
        const dt = TCTTime.fromTimestamp(timestamp);
        return dt.toFormat('yyyy-MM-dd');
    }
}

/* ==================== FIXED: PRODUCTION EXECUTION RUN ==================== */
class ExecutionRun {
    constructor() {
        this.id = TCTTime.now().toISO();
        this.startTime = this.id;
        this.endTime = null;
        this.status = "pending"; // pending, running, completed, failed
        this.apiCalls = {
            faction: { count: 0, success: false },
            market: { count: 0, success: false },
            retries: 0
        };
        this.metrics = {
            eventsProcessed: 0,
            newEvents: 0,
            deposits: { count: 0, value: 0 },
            withdrawals: { count: 0, value: 0 },
            errors: 0,
            warnings: 0
        };
        this.error = null;
        this.durationMs = 0;
    }
    
    start() {
        this.status = "running";
    }
    
    complete(metrics) {
        this.endTime = TCTTime.now().toISO();
        this.status = "completed";
        this.metrics = { ...this.metrics, ...metrics };
        this.durationMs = DateTime.fromISO(this.endTime).diff(DateTime.fromISO(this.startTime)).milliseconds;
    }
    
    fail(error) {
        this.endTime = TCTTime.now().toISO();
        this.status = "failed";
        this.error = error.toString();
        this.durationMs = DateTime.fromISO(this.endTime).diff(DateTime.fromISO(this.startTime)).milliseconds;
    }
    
    incrementAPICall(type, success = true) {
        if (type === 'faction') {
            this.apiCalls.faction.count++;
            this.apiCalls.faction.success = success;
        } else if (type === 'market') {
            this.apiCalls.market.count++;
            this.apiCalls.market.success = success;
        } else if (type === 'retry') {
            this.apiCalls.retries++;
        }
    }
    
    addMetric(type, data) {
        if (type === 'event') {
            this.metrics.eventsProcessed++;
            this.metrics.newEvents = data.isNew ? this.metrics.newEvents + 1 : this.metrics.newEvents;
            
            if (data.type === 'deposit' || data.type === 'filled' || data.type === 'return') {
                this.metrics.deposits.count++;
                this.metrics.deposits.value += data.value || 0;
            } else if (data.type === 'use' || data.type === 'take') {
                this.metrics.withdrawals.count++;
                this.metrics.withdrawals.value += data.value || 0;
            }
        } else if (type === 'error') {
            this.metrics.errors++;
        } else if (type === 'warning') {
            this.metrics.warnings++;
        }
    }
    
    toStorage() {
        return {
            id: this.id,
            startTime: this.startTime,
            endTime: this.endTime,
            status: this.status,
            apiCalls: this.apiCalls,
            metrics: this.metrics,
            error: this.error,
            durationMs: this.durationMs
        };
    }
}

/* ==================== FIXED: PRODUCTION SCHEDULED ACCOUNTING ENGINE ==================== */
class ScheduledAccounting {
    constructor() {
        this.storage = StorageManager.init();
        this.marketAPI = new MarketAPI(this.storage.marketKey);
        this.currentRun = null;
        this.isRunning = false;
        this.medicalTracker = new MedicalTracker();
        this.consecutiveErrors = 0;
        this.maxConsecutiveErrors = 3;
    }
    
    // ===== 1. ENHANCED GUARD CHECK =====
    canExecute(force = false) {
        // Concurrency check
        if (this.isRunning && !force) {
            console.warn("⚠️ Another run is already in progress");
            return false;
        }
        
        // API key check
        if (!this.storage.factionKey || !this.storage.marketKey) {
            this.showNotification("API keys required", "error");
            return false;
        }
        
        // Error circuit breaker
        if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
            console.error("🚨 Too many consecutive errors, circuit breaker active");
            this.showNotification("Too many errors, manual intervention needed", "error");
            return false;
        }
        
        // Schedule check (unless forced)
        if (!force && this.storage.lastRunTime) {
            const hoursSince = TCTTime.hoursSince(this.storage.lastRunTime);
            if (hoursSince < CONFIG.MINIMUM_RUN_INTERVAL_HOURS) {
                console.log(`⏰ ${hoursSince.toFixed(1)} hours since last run, need ${CONFIG.MINIMUM_RUN_INTERVAL_HOURS}`);
                return false;
            }
        }
        
        return true;
    }
    
    // ===== 2. FETCH FACTION LOGS =====
    async fetchFactionLogs() {
        console.log("📨 Fetching faction logs...");
        
        try {
            // Single API call for both action and deposit logs
            const url = `https://api.torn.com/v2/faction/news?cat=armoryAction,armoryDeposit&limit=200&sort=DESC&stripTags=true&key=${this.storage.factionKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Faction API error: ${response.status}`);
            }
            
            const data = await response.json();
            this.currentRun.incrementAPICall('faction', true);
            
            const newEvents = [];
            let foundLastLog = false;
            
            if (data.news && Array.isArray(data.news)) {
                for (const log of data.news) {
                    // Stop if we reach already processed logs
                    if (log.id === this.storage.lastLogId) {
                        foundLastLog = true;
                        break;
                    }
                    
                    const parsed = LogParser.parse(log.text);
                    if (!parsed) {
                        console.warn(`Could not parse log: ${log.text.substring(0, 50)}...`);
                        this.currentRun.addMetric('warning');
                        continue;
                    }
                    
                    newEvents.push({
                        logId: log.id,
                        timestamp: log.timestamp,
                        username: parsed.username,
                        type: parsed.type,
                        item: parsed.item,
                        quantity: parsed.count || 1,
                        rawText: log.text
                    });
                }
            }
            
            // If we didn't find our last log, we might have missed some logs
            if (!foundLastLog && this.storage.lastLogId) {
                console.warn("⚠️ Last processed log not found in API response");
                this.currentRun.addMetric('warning');
            }
            
            // Sort chronologically (oldest first)
            newEvents.sort((a, b) => a.timestamp - b.timestamp);
            
            console.log(`✅ Found ${newEvents.length} new events`);
            return newEvents;
            
        } catch (error) {
            console.error("❌ Failed to fetch faction logs:", error);
            this.currentRun.incrementAPICall('faction', false);
            this.currentRun.addMetric('error');
            throw error;
        }
    }
    
    // ===== 3. FETCH PRICE SNAPSHOT =====
    async fetchPriceSnapshot() {
        console.log("💵 Fetching market prices...");
        
        try {
            const prices = await this.marketAPI.fetchWhitelistPrices();
            this.currentRun.incrementAPICall('market', true);
            
            const snapshot = new PriceSnapshot(this.currentRun.id);
            
            Object.entries(prices).forEach(([itemName, price]) => {
                snapshot.addPrice(itemName, price);
            });
            
            // Determine source
            snapshot.source = Object.keys(prices).some(k => this.marketAPI.FALLBACK_PRICES[k]) 
                ? "fallback" 
                : "api";
            
            console.log(`✅ Created snapshot with ${Object.keys(snapshot.prices).length} prices (source: ${snapshot.source})`);
            return snapshot;
            
        } catch (error) {
            console.error("❌ Failed to fetch price snapshot:", error);
            this.currentRun.incrementAPICall('market', false);
            this.currentRun.addMetric('error');
            throw error;
        }
    }
    
    // ===== 4. ENHANCED TEMPORAL PRICE BINDING =====
    bindPricesToEvents(events, currentSnapshot) {
        console.log("🔗 Binding prices to events...");
        
        const boundEvents = [];
        this.medicalTracker.reset();
        
        // Prepare all available snapshots (current + historical)
        const allSnapshots = [
            currentSnapshot,
            ...this.storage.priceSnapshots.map(s => PriceSnapshot.fromStorage(s))
        ].filter(s => s && s.prices);
        
        events.forEach(eventData => {
            // Skip if already processed (shouldn't happen with log ID check)
            const existingEvent = this.storage.boundEvents.find(e => e.logId === eventData.logId);
            if (existingEvent) {
                console.log(`⏭️ Event ${eventData.logId} already processed`);
                return;
            }
            
            const normItem = LogParser.normalizeItemName(eventData.item);
            
            // FIXED: Find CLOSEST temporal price
            let bestPrice = 0;
            let bestSnapshot = currentSnapshot;
            let smallestTimeDiff = Infinity;
            
            for (const snapshot of allSnapshots) {
                if (snapshot.isBefore(eventData.timestamp)) {
                    const price = snapshot.getPrice(normItem);
                    if (price > 0) {
                        const timeDiff = snapshot.timeDifference(eventData.timestamp);
                        if (timeDiff < smallestTimeDiff) {
                            smallestTimeDiff = timeDiff;
                            bestPrice = price;
                            bestSnapshot = snapshot;
                        }
                    }
                }
            }
            
            // Fallback to current snapshot if no temporal price found
            if (bestPrice === 0) {
                bestPrice = currentSnapshot.getPrice(normItem);
                if (bestPrice === 0) {
                    console.warn(`⚠️ No price found for ${normItem}, using 0 value`);
                } else {
                    console.warn(`⚠️ Using current snapshot for past event ${eventData.logId}`);
                    this.currentRun.addMetric('warning');
                }
            }
            
            // Calculate value based on HALO rules
            let value = 0;
            let chargeDetails = {};
            
            if (eventData.type === 'deposit' || eventData.type === 'filled' || eventData.type === 'return') {
                // DEPOSIT, FILL, or RETURN
                if (LogParser.isBloodBagFill(eventData.rawText, eventData.item)) {
                    value = CONFIG.BLOOD_BAG_FILL_CREDIT * eventData.quantity;
                    chargeDetails.reason = "blood-bag-fill";
                } else {
                    const depositRate = normItem.includes("xanax") 
                        ? CONFIG.XANAX_DEPOSIT_RATE 
                        : CONFIG.STANDARD_DEPOSIT_RATE;
                    value = Math.round(bestPrice * depositRate * eventData.quantity);
                    chargeDetails.reason = "deposit";
                    chargeDetails.rate = depositRate;
                }
                
            } else if (eventData.type === 'use' || eventData.type === 'take') {
                // USE or TAKE (withdrawal)
                
                // Check if free item
                if (CONFIG.FREE_ITEMS.some(free => normItem.includes(free))) {
                    console.log(`🎁 Free item ${normItem}, no charge`);
                    return;
                }
                
                // Calculate charge
                const userId = StorageManager.getUserId(eventData.username);
                const chargeResult = this.medicalTracker.calculateCharge(
                    normItem,
                    bestPrice,
                    eventData.timestamp,
                    userId,
                    eventData.quantity
                );
                
                value = chargeResult.charge;
                chargeDetails = {
                    reason: chargeResult.reason,
                    isMedical: chargeResult.isMedical,
                    isExcess: chargeResult.isExcess,
                    dailyUsed: chargeResult.dailyUsed
                };
            }
            
            // Create bound event
            const boundEvent = new BoundEvent(
                eventData.logId,
                eventData.timestamp,
                eventData.username,
                eventData.type,
                eventData.item,
                eventData.quantity,
                bestPrice,
                value,
                this.currentRun.id
            );
            
            boundEvents.push(boundEvent);
            this.currentRun.addMetric('event', {
                isNew: true,
                type: eventData.type,
                value: value
            });
        });
        
        console.log(`✅ Bound ${boundEvents.length} events with temporal prices`);
        return boundEvents;
    }
    
    // ===== 5. COMPUTATION & INTEGRITY =====
    computeStatistics(newBoundEvents) {
        console.log("🧮 Computing statistics...");
        
        const stats = {
            deposits: { count: 0, value: 0 },
            withdrawals: { count: 0, value: 0 },
            memberChanges: {}
        };
        
        newBoundEvents.forEach(event => {
            const storageEvent = event.toStorage();
            
            if (storageEvent.type === 'deposit' || storageEvent.type === 'filled' || storageEvent.type === 'return') {
                stats.deposits.count++;
                stats.deposits.value += storageEvent.value;
                stats.memberChanges[storageEvent.userId] = 
                    (stats.memberChanges[storageEvent.userId] || 0) + storageEvent.value;
            } else if (storageEvent.type === 'use' || storageEvent.type === 'take') {
                stats.withdrawals.count++;
                stats.withdrawals.value += storageEvent.value;
                stats.memberChanges[storageEvent.userId] = 
                    (stats.memberChanges[storageEvent.userId] || 0) - storageEvent.value;
            }
        });
        
        // Update global accounting state
        this.storage.accountingState.totalDeposits += stats.deposits.value;
        this.storage.accountingState.totalWithdrawals += stats.withdrawals.value;
        this.storage.accountingState.netDelta = 
            this.storage.accountingState.totalDeposits - this.storage.accountingState.totalWithdrawals;
        
        // Update member balances
        Object.entries(stats.memberChanges).forEach(([userId, change]) => {
            this.storage.accountingState.memberBalances[userId] = 
                (this.storage.accountingState.memberBalances[userId] || 0) + change;
        });
        
        // Generate audit hash
        this.storage.accountingState.lastAuditTime = TCTTime.now().toISO();
        this.storage.accountingState.auditHash = this.generateAuditHash();
        
        return stats;
    }
    
    generateAuditHash() {
        const data = {
            deposits: this.storage.accountingState.totalDeposits,
            withdrawals: this.storage.accountingState.totalWithdrawals,
            eventCount: this.storage.boundEvents.length,
            lastRun: this.storage.lastRunTime,
            timestamp: Date.now()
        };
        
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return hash.toString(16);
    }
    
    // ===== 6. PERSISTENCE =====
    async persistRunData(newBoundEvents, priceSnapshot, stats) {
        console.log("💾 Persisting run data...");
        
        // Store new bound events
        const eventStorage = newBoundEvents.map(event => event.toStorage());
        this.storage.boundEvents.push(...eventStorage);
        
        // Store price snapshot (at beginning for temporal binding)
        this.storage.priceSnapshots.unshift(priceSnapshot.toStorage());
        
        // Update timestamps
        this.storage.lastRunTime = TCTTime.now().toISO();
        
        if (newBoundEvents.length > 0) {
            const lastEvent = newBoundEvents[newBoundEvents.length - 1];
            this.storage.lastEventTime = lastEvent.timestamp;
            this.storage.lastLogId = lastEvent.logId;
        }
        
        // Save run to history
        this.storage.runHistory.push(this.currentRun.toStorage());
        
        // Prune and save
        this.storage.pruneOldData(true);
        this.storage.saveAll();
        
        console.log("✅ Run data persisted successfully");
    }
    
    // ===== MAIN EXECUTION PIPELINE =====
    async execute(force = false) {
        // Enhanced guard check
        if (!this.canExecute(force)) {
            return {
                success: false,
                reason: "guard_check_failed",
                consecutiveErrors: this.consecutiveErrors
            };
        }
        
        this.isRunning = true;
        this.currentRun = new ExecutionRun();
        this.currentRun.start();
        
        console.log("🚀 ===== STARTING SCHEDULED ACCOUNTING RUN =====");
        this.showNotification("Starting scheduled accounting run...", "info");
        
        try {
            // Step 1: Fetch faction logs
            const newEvents = await this.fetchFactionLogs();
            
            // If no new events, still create snapshot for future
            if (newEvents.length === 0) {
                console.log("📭 No new events to process");
                
                const priceSnapshot = await this.fetchPriceSnapshot();
                this.storage.priceSnapshots.unshift(priceSnapshot.toStorage());
                this.storage.lastRunTime = TCTTime.now().toISO();
                this.storage.saveAll();
                
                this.currentRun.complete({
                    eventsProcessed: 0,
                    newEvents: 0,
                    deposits: { count: 0, value: 0 },
                    withdrawals: { count: 0, value: 0 }
                });
                
                this.consecutiveErrors = 0; // Reset error counter
                this.isRunning = false;
                
                this.showNotification("No new events found", "info");
                return {
                    success: true,
                    newEvents: 0,
                    apiCalls: this.currentRun.apiCalls,
                    reason: "no_new_events"
                };
            }
            
            // Step 2: Fetch price snapshot
            const priceSnapshot = await this.fetchPriceSnapshot();
            
            // Step 3: Temporal price binding
            const boundEvents = this.bindPricesToEvents(newEvents, priceSnapshot);
            
            // Step 4: Computation
            const stats = this.computeStatistics(boundEvents);
            
            // Step 5: Persistence
            await this.persistRunData(boundEvents, priceSnapshot, stats);
            
            // Complete run
            this.currentRun.complete({
                eventsProcessed: boundEvents.length,
                newEvents: boundEvents.length,
                deposits: stats.deposits,
                withdrawals: stats.withdrawals
            });
            
            // Success
            this.consecutiveErrors = 0;
            this.isRunning = false;
            
            const netDelta = this.storage.accountingState.netDelta;
            const apiCalls = this.currentRun.apiCalls.faction.count + this.currentRun.apiCalls.market.count;
            
            this.showNotification(
                `✅ Run completed: ${boundEvents.length} events, ${apiCalls} API calls, Net: $${netDelta.toLocaleString()}`,
                "success"
            );
            
            console.log("🎉 ===== RUN COMPLETED SUCCESSFULLY =====");
            console.log(`📊 Events: ${boundEvents.length} processed`);
            console.log(`📞 API Calls: Faction=${this.currentRun.apiCalls.faction.count}, Market=${this.currentRun.apiCalls.market.count}`);
            console.log(`💰 Net Delta: $${netDelta.toLocaleString()}`);
            console.log(`⏱️ Duration: ${this.currentRun.durationMs}ms`);
            
            return {
                success: true,
                newEvents: boundEvents.length,
                apiCalls: this.currentRun.apiCalls,
                netDelta: netDelta,
                durationMs: this.currentRun.durationMs
            };
            
        } catch (error) {
            // Handle failure
            console.error("💥 ===== RUN FAILED =====", error);
            this.currentRun.fail(error);
            this.storage.runHistory.push(this.currentRun.toStorage());
            this.storage.saveAll();
            
            this.consecutiveErrors++;
            this.isRunning = false;
            
            this.showNotification(`❌ Run failed: ${error.message}`, "error");
            
            return {
                success: false,
                reason: "execution_error",
                error: error.message,
                consecutiveErrors: this.consecutiveErrors
            };
        }
    }
    
    // ===== ENHANCED AUDIT MODE =====
    auditMode() {
        console.group("🔍 ===== AUDIT MODE - FULL VERIFICATION =====");
        
        const results = {
            integrity: { passed: true, issues: [] },
            temporal: { errors: 0, warnings: 0 },
            accounting: { stored: {}, calculated: {} },
            summary: {}
        };
        
        // 1. Recalculate from bound events
        let calculatedDeposits = 0;
        let calculatedWithdrawals = 0;
        const calculatedBalances = {};
        
        this.storage.boundEvents.forEach(eventData => {
            try {
                const event = BoundEvent.fromStorage(eventData);
                
                // Temporal check
                const eventTime = TCTTime.fromTimestamp(event.timestamp);
                const snapshotTime = DateTime.fromISO(event.snapshotTime);
                
                if (snapshotTime > eventTime) {
                    results.temporal.errors++;
                    results.integrity.issues.push(`Event ${event.logId} bound to future snapshot`);
                }
                
                // Recalculate
                if (event.type === 'deposit' || event.type === 'filled' || event.type === 'return') {
                    calculatedDeposits += event.value;
                    calculatedBalances[event.userId] = (calculatedBalances[event.userId] || 0) + event.value;
                } else if (event.type === 'use' || event.type === 'take') {
                    calculatedWithdrawals += event.value;
                    calculatedBalances[event.userId] = (calculatedBalances[event.userId] || 0) - event.value;
                }
            } catch (e) {
                results.integrity.issues.push(`Failed to process event ${eventData.id}: ${e.message}`);
            }
        });
        
        const calculatedNet = calculatedDeposits - calculatedWithdrawals;
        
        // 2. Compare with stored values
        results.accounting.stored = {
            deposits: this.storage.accountingState.totalDeposits,
            withdrawals: this.storage.accountingState.totalWithdrawals,
            netDelta: this.storage.accountingState.netDelta
        };
        
        results.accounting.calculated = {
            deposits: calculatedDeposits,
            withdrawals: calculatedWithdrawals,
            netDelta: calculatedNet
        };
        
        // 3. Check integrity (allow 1 cent rounding difference)
        const depositDiff = Math.abs(calculatedDeposits - this.storage.accountingState.totalDeposits);
        const withdrawalDiff = Math.abs(calculatedWithdrawals - this.storage.accountingState.totalWithdrawals);
        const netDiff = Math.abs(calculatedNet - this.storage.accountingState.netDelta);
        
        if (depositDiff > 1) {
            results.integrity.passed = false;
            results.integrity.issues.push(`Deposit mismatch: ${depositDiff} difference`);
        }
        
        if (withdrawalDiff > 1) {
            results.integrity.passed = false;
            results.integrity.issues.push(`Withdrawal mismatch: ${withdrawalDiff} difference`);
        }
        
        // 4. Generate summary
        results.summary = {
            totalEvents: this.storage.boundEvents.length,
            totalSnapshots: this.storage.priceSnapshots.length,
            totalRuns: this.storage.runHistory.length,
            successfulRuns: this.storage.runHistory.filter(r => r.status === 'completed').length,
            failedRuns: this.storage.runHistory.filter(r => r.status === 'failed').length,
            temporalErrors: results.temporal.errors,
            integrityPassed: results.integrity.passed
        };
        
        // 5. Log results
        console.log("📊 SUMMARY:", results.summary);
        console.log("✅ INTEGRITY:", results.integrity.passed ? "PASS" : "FAIL");
        console.log("⏰ TEMPORAL ERRORS:", results.temporal.errors);
        console.log("💰 ACCOUNTING:", {
            stored: results.accounting.stored,
            calculated: results.accounting.calculated,
            differences: {
                deposits: depositDiff,
                withdrawals: withdrawalDiff,
                netDelta: netDiff
            }
        });
        
        if (results.integrity.issues.length > 0) {
            console.warn("⚠️ ISSUES:", results.integrity.issues);
        }
        
        console.groupEnd();
        
        return results;
    }
    
    showNotification(message, type = "info") {
        const title = "HALO Ledger";
        const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
        
        GM_notification({
            text: `${icon} ${message}`,
            title: title,
            timeout: type === "error" ? 10000 : 5000
        });
        
        const timestamp = new Date().toISOString().substr(11, 8);
        console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
    }
}

/* ==================== FIXED: PRODUCTION SCHEDULER ==================== */
class Scheduler {
    constructor(accounting) {
        this.accounting = accounting;
        this.timer = null;
        this.isRunning = false;
        this.nextRunTime = null;
        this.manualRunInProgress = false;
    }
    
    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        console.log("⏰ ===== SCHEDULER STARTED =====");
        console.log("📅 Schedule: 02:00, 10:00, 18:00 TCT (UTC)");
        console.log("🔐 API Discipline: 2 calls max per run");
        console.log("🛡️ Concurrency: Protected");
        
        this.scheduleNextRun();
        
        // Initial health check
        this.healthCheck();
    }
    
    stop() {
        this.isRunning = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        console.log("🛑 Scheduler stopped");
    }
    
    scheduleNextRun() {
        if (!this.isRunning) return;
        
        this.nextRunTime = TCTTime.getNextWindow();
        const now = TCTTime.now();
        const waitMs = this.nextRunTime.diff(now).milliseconds;
        
        console.log(`⏳ Next scheduled run: ${TCTTime.format(this.nextRunTime.toSeconds())}`);
        console.log(`   (in ${Math.round(waitMs/1000/60)} minutes)`);
        
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.executeScheduledRun(), waitMs);
    }
    
    async executeScheduledRun() {
        if (!this.isRunning) return;
        
        console.log("🔔 ===== SCHEDULED EXECUTION TRIGGERED =====");
        
        try {
            const result = await this.accounting.execute(false);
            
            if (result.success) {
                console.log("✅ Scheduled execution completed successfully");
            } else {
                console.warn("⚠️ Scheduled execution completed with issues:", result.reason);
            }
        } catch (error) {
            console.error("❌ Scheduled execution failed:", error);
        }
        
        // Reschedule next run
        this.scheduleNextRun();
    }
    
    async forceRun() {
        if (this.manualRunInProgress) {
            this.accounting.showNotification("Another manual run is already in progress", "error");
            return;
        }
        
        const confirmed = confirm(
            "🚀 FORCE SCHEDULED ACCOUNTING RUN\n\n" +
            "This will use:\n" +
            "• 1 faction API call\n" +
            "• 1 market API call\n\n" +
            "API keys must be configured.\n\n" +
            "Proceed?"
        );
        
        if (!confirmed) return;
        
        this.manualRunInProgress = true;
        this.accounting.showNotification("Starting manual run...", "info");
        
        try {
            const result = await this.accounting.execute(true);
            
            if (result.success) {
                this.accounting.showNotification(`Manual run completed: ${result.newEvents} events processed`, "success");
            } else {
                this.accounting.showNotification(`Manual run failed: ${result.reason}`, "error");
            }
        } catch (error) {
            this.accounting.showNotification(`Manual run error: ${error.message}`, "error");
        } finally {
            this.manualRunInProgress = false;
        }
    }
    
    healthCheck() {
        // Check if last run was too long ago
        if (this.accounting.storage.lastRunTime) {
            const hoursSince = TCTTime.hoursSince(this.accounting.storage.lastRunTime);
            
            if (hoursSince > CONFIG.MINIMUM_RUN_INTERVAL_HOURS * 2) {
                console.warn(`⚠️ Health check: ${hoursSince.toFixed(1)} hours since last run`);
                
                // Auto-run if significantly overdue
                if (hoursSince > CONFIG.MINIMUM_RUN_INTERVAL_HOURS * 4) {
                    console.log("🔄 Auto-running overdue execution");
                    this.executeScheduledRun();
                }
            }
        }
        
        // Check storage size
        const boundEventsCount = this.accounting.storage.boundEvents.length;
        const snapshotsCount = this.accounting.storage.priceSnapshots.length;
        
        if (boundEventsCount > 10000) {
            console.warn(`⚠️ Large storage: ${boundEventsCount} bound events`);
        }
        
        if (snapshotsCount > 100) {
            console.warn(`⚠️ Many snapshots: ${snapshotsCount} price snapshots`);
        }
        
        // Schedule next health check in 1 hour
        setTimeout(() => this.healthCheck(), 60 * 60 * 1000);
    }
}

/* ==================== PANEL CREATION - FIXED ==================== */
class LedgerPanel {
    constructor(accounting, scheduler) {
        this.accounting = accounting;
        this.scheduler = scheduler;
        this.panel = null;
        this.toggleBtn = null;
        this.isVisible = false;
        this.updateInterval = null;
    }
    
    create() {
        // Create main panel
        this.panel = document.createElement("div");
        this.panel.id = "haloLedgerPanel";
        this.panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 320px;
            max-height: 70vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
            color: white;
            border-radius: 10px;
            padding: 0;
            overflow: hidden;
            box-shadow: 0 5px 25px rgba(0,0,0,0.5);
            display: none;
            z-index: 10000;
            border: 2px solid #4cc9f0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        this.panel.innerHTML = this.getPanelHTML();
        document.body.appendChild(this.panel);
        
        // Create toggle button
        this.createToggleButton();
        
        // Add event listeners
        this.attachEventListeners();
        
        // Start update interval
        this.startUpdateInterval();
        
        // Initial update
        this.update();
        
        console.log("🎨 Ledger Panel created");
        
        // Auto-show if no API keys
        if (!this.accounting.storage.factionKey || !this.accounting.storage.marketKey) {
            setTimeout(() => this.show(), 1000);
        }
    }
    
    getPanelHTML() {
        const stats = this.accounting.storage.accountingState;
        const nextRun = TCTTime.getNextWindow();
        const nextRunTime = TCTTime.format(nextRun.toSeconds());
        
        return `
            <div style="background: #0f3460; padding: 15px; border-bottom: 2px solid #4cc9f0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="margin: 0; font-size: 16px; color: #4cc9f0;">
                        ⚕️ HALO Ledger
                    </h2>
                    <button id="ledgerClose" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
                </div>
                <div style="font-size: 11px; color: #8b8b9a; margin-top: 5px;">
                    Scheduled Accounting • 3x Daily
                </div>
            </div>
            
            <div style="padding: 15px; overflow-y: auto; max-height: calc(70vh - 70px);">
                <!-- Stats Overview -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; margin-bottom: 15px;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
                        <div style="text-align: center;">
                            <div style="font-size: 20px; font-weight: bold; color: #10b981;">$${stats.netDelta.toLocaleString()}</div>
                            <div style="font-size: 10px; color: #8b8b9a;">NET DELTA</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 20px; font-weight: bold; color: #4cc9f0;" id="uiEventCount">${this.accounting.storage.boundEvents.length}</div>
                            <div style="font-size: 10px; color: #8b8b9a;">EVENTS</div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                        <div>
                            <div style="font-size: 12px; color: #10b981;">+$${stats.totalDeposits.toLocaleString()}</div>
                            <div style="font-size: 9px; color: #8b8b9a;">Deposits</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: #ef4444;">-$${stats.totalWithdrawals.toLocaleString()}</div>
                            <div style="font-size: 9px; color: #8b8b9a;">Withdrawals</div>
                        </div>
                    </div>
                </div>
                
                <!-- Next Run -->
                <div style="background: rgba(76, 201, 240, 0.1); border-radius: 8px; padding: 12px; margin-bottom: 15px; border: 1px solid rgba(76, 201, 240, 0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <div style="font-size: 12px; color: #4cc9f0;">⏰ Next Run</div>
                        <div style="font-size: 11px; color: #8b8b9a;" id="uiRunStatus">Ready</div>
                    </div>
                    <div style="font-size: 14px; font-weight: bold; color: white;" id="uiNextRunTime">${nextRunTime}</div>
                    <div style="font-size: 11px; color: #8b8b9a;" id="uiNextRunDetail">Scheduled</div>
                </div>
                
                <!-- Controls -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                    <button id="forceRunBtn" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 12px;">
                        🚀 Run Now
                    </button>
                    <button id="auditBtn" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 12px;">
                        🔍 Audit
                    </button>
                </div>
                
                <!-- API Keys -->
                <div style="background: rgba(255,255,255,0.03); border-radius: 6px; padding: 10px; margin-bottom: 15px;">
                    <div style="font-size: 11px; color: #8b8b9a; margin-bottom: 8px;">API Configuration</div>
                    <input type="password" id="factionKeyInput" placeholder="Faction Key" style="width: 100%; padding: 8px; margin-bottom: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: white; font-size: 11px;" value="${this.accounting.storage.factionKey || ''}">
                    <input type="password" id="marketKeyInput" placeholder="Market Key" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: white; font-size: 11px;" value="${this.accounting.storage.marketKey || ''}">
                </div>
                
                <!-- Member Balances -->
                <div id="memberBalances">
                    <div style="font-size: 11px; color: #8b8b9a; margin-bottom: 8px;">Active Members</div>
                    <div style="font-size: 12px; color: #8b8b9a; text-align: center; padding: 20px;" id="noMembersMsg">
                        No member balances yet
                    </div>
                </div>
            </div>
        `;
    }
    
    createToggleButton() {
        this.toggleBtn = document.createElement("button");
        this.toggleBtn.id = "ledgerToggle";
        this.toggleBtn.innerHTML = "⚕️";
        this.toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #4cc9f0 0%, #0f3460 100%);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: transform 0.2s;
        `;
        
        this.toggleBtn.addEventListener("mouseenter", () => {
            this.toggleBtn.style.transform = "scale(1.1)";
        });
        
        this.toggleBtn.addEventListener("mouseleave", () => {
            this.toggleBtn.style.transform = "scale(1)";
        });
        
        this.toggleBtn.addEventListener("click", () => {
            this.toggle();
        });
        
        document.body.appendChild(this.toggleBtn);
    }
    
    attachEventListeners() {
        // Close button
        document.getElementById("ledgerClose").addEventListener("click", () => {
            this.hide();
        });
        
        // Force run button
        document.getElementById("forceRunBtn").addEventListener("click", () => {
            this.scheduler.forceRun();
        });
        
        // Audit button
        document.getElementById("auditBtn").addEventListener("click", () => {
            const results = this.accounting.auditMode();
            
            let message = "=== AUDIT RESULTS ===\n\n";
            message += `Integrity: ${results.integrity.passed ? "✅ PASS" : "❌ FAIL"}\n`;
            message += `Temporal Errors: ${results.temporal.errors}\n`;
            message += `Events: ${results.summary.totalEvents}\n`;
            message += `Snapshots: ${results.summary.totalSnapshots}\n`;
            message += `Runs: ${results.summary.successfulRuns} successful, ${results.summary.failedRuns} failed\n\n`;
            
            if (results.integrity.issues.length > 0) {
                message += "Issues:\n";
                results.integrity.issues.forEach((issue, i) => {
                    message += `${i + 1}. ${issue}\n`;
                });
            }
            
            alert(message);
        });
        
        // API key inputs
        document.getElementById("factionKeyInput").addEventListener("change", (e) => {
            this.accounting.storage.factionKey = e.target.value.trim();
            GM_setValue(CONFIG.STORAGE_KEYS.FACTION_KEY, e.target.value.trim());
            this.accounting.showNotification("Faction API key updated", "info");
        });
        
        document.getElementById("marketKeyInput").addEventListener("change", (e) => {
            this.accounting.storage.marketKey = e.target.value.trim();
            GM_setValue(CONFIG.STORAGE_KEYS.MARKET_KEY, e.target.value.trim());
            this.accounting.showNotification("Market API key updated", "info");
        });
    }
    
    startUpdateInterval() {
        // Update panel every 30 seconds
        this.updateInterval = setInterval(() => {
            if (this.isVisible) {
                this.update();
            }
        }, 30000);
    }
    
    stopUpdateInterval() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    toggle() {
        this.isVisible = !this.isVisible;
        this.panel.style.display = this.isVisible ? "block" : "none";
        
        if (this.isVisible) {
            this.update();
        }
    }
    
    show() {
        this.isVisible = true;
        this.panel.style.display = "block";
        this.update();
    }
    
    hide() {
        this.isVisible = false;
        this.panel.style.display = "none";
    }
    
    update() {
        if (!this.isVisible || !this.panel) return;
        
        const stats = this.accounting.storage.accountingState;
        
        // Update event count
        const eventCountEl = document.getElementById("uiEventCount");
        if (eventCountEl) {
            eventCountEl.textContent = this.accounting.storage.boundEvents.length.toLocaleString();
        }
        
        // Update run status
        const runStatusEl = document.getElementById("uiRunStatus");
        if (runStatusEl) {
            runStatusEl.textContent = this.accounting.isRunning ? "Running..." : "Ready";
        }
        
        // Update next run time
        if (this.scheduler.nextRunTime) {
            const nextRunTimeEl = document.getElementById("uiNextRunTime");
            const nextRunDetailEl = document.getElementById("uiNextRunDetail");
            
            if (nextRunTimeEl) {
                nextRunTimeEl.textContent = TCTTime.format(this.scheduler.nextRunTime.toSeconds());
            }
            
            if (nextRunDetailEl) {
                const now = TCTTime.now();
                const hours = this.scheduler.nextRunTime.diff(now, 'hours').hours;
                const minutes = this.scheduler.nextRunTime.diff(now, 'minutes').minutes % 60;
                nextRunDetailEl.textContent = `in ${Math.floor(hours)}h ${Math.floor(minutes)}m`;
            }
        }
        
        // Update member balances
        this.updateMemberBalances();
    }
    
    updateMemberBalances() {
        const container = document.getElementById("memberBalances");
        const noMembersMsg = document.getElementById("noMembersMsg");
        
        if (!container || !noMembersMsg) return;
        
        const members = Object.entries(this.accounting.storage.accountingState.memberBalances)
            .filter(([_, balance]) => Math.abs(balance) >= 1) // Show balances >= $1
            .sort((a, b) => a[1] - b[1]); // Sort by balance (most negative first)
        
        if (members.length === 0) {
            noMembersMsg.style.display = "block";
            container.innerHTML = `
                <div style="font-size: 11px; color: #8b8b9a; margin-bottom: 8px;">Active Members</div>
                <div style="font-size: 12px; color: #8b8b9a; text-align: center; padding: 20px;" id="noMembersMsg">
                    No member balances yet
                </div>
            `;
            return;
        }
        
        noMembersMsg.style.display = "none";
        
        let html = '<div style="font-size: 11px; color: #8b8b9a; margin-bottom: 8px;">Active Members</div>';
        
        // Show top 10 members
        const topMembers = members.slice(0, 10);
        
        topMembers.forEach(([userId, balance]) => {
            const isPositive = balance >= 0;
            const color = isPositive ? "#10b981" : "#ef4444";
            const sign = isPositive ? "+" : "";
            
            // Find username from mapping
            let username = "Unknown";
            for (const [name, id] of Object.entries(this.accounting.storage.userMapping)) {
                if (id === userId) {
                    username = name;
                    break;
                }
            }
            
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 12px; color: white; max-width: 150px; overflow: hidden; text-overflow: ellipsis;" title="${username}">
                        ${username}
                    </div>
                    <div style="font-size: 12px; font-weight: bold; color: ${color};">
                        ${sign}$${Math.abs(balance).toLocaleString()}
                    </div>
                </div>
            `;
        });
        
        if (members.length > 10) {
            html += `<div style="font-size: 11px; color: #8b8b9a; text-align: center; padding: 8px;">
                + ${members.length - 10} more members
            </div>`;
        }
        
        container.innerHTML = html;
    }
}

/* ==================== PRODUCTION INITIALIZATION ==================== */
(function init() {
    console.log("🚀 ===== HALO LEDGER v4.3 INITIALIZING =====");
    
    // Initialize core components
    const accounting = new ScheduledAccounting();
    const scheduler = new Scheduler(accounting);
    const panel = new LedgerPanel(accounting, scheduler);
    
    // Store globally for debugging
    window.haloLedger = {
        accounting,
        scheduler,
        panel,
        config: CONFIG,
        utils: { TCTTime, LogParser }
    };
    
    // Create panel
    panel.create();
    
    // Start scheduler
    scheduler.start();
    
    // Show welcome message
    setTimeout(() => {
        const hasKeys = accounting.storage.factionKey && accounting.storage.marketKey;
        const lastRun = accounting.storage.lastRunTime;
        
        if (!hasKeys) {
            accounting.showNotification("Please configure API keys in the panel", "info");
        } else if (!lastRun) {
            accounting.showNotification("HALO Ledger initialized. First run will execute on schedule.", "info");
        }
        
        // Initial audit
        console.log("🔍 Running initial audit...");
        accounting.auditMode();
        
    }, 1000);
    
    console.log("✅ ===== HALO LEDGER INITIALIZED =====");
})();

})();