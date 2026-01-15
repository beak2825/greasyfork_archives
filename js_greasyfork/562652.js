// ==UserScript==
// @name         HALO Market Log Tracker (Alien UI) - FIXED
// @namespace    http://tampermonkey.net/
// @version      HALO.7.1
// @description  Market log tracker with color-coded parsing and Alien UI - FIXED PARSING
// @author       Nova
// @match        https://www.torn.com/*
// @match        https://torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/562652/HALO%20Market%20Log%20Tracker%20%28Alien%20UI%29%20-%20FIXED.user.js
// @updateURL https://update.greasyfork.org/scripts/562652/HALO%20Market%20Log%20Tracker%20%28Alien%20UI%29%20-%20FIXED.meta.js
// ==/UserScript==

(function(){
"use strict";

/* ---------- DEBUG MODE ---------- */
const DEBUG_MODE = true; // Set to true for debugging

/* ---------- CONFIG ---------- */
const SCAN_INTERVAL = 5000;
const REFRESH_MS = 30000;

/* ---------- STORAGE KEYS ---------- */
const STORAGE_KEYS = {
    PROCESSED_LOGS: "haloMarketProcessedLogs",
    MARKET_LOGS: "haloMarketLogs",
    USER_STATS: "haloUserStats",
    SETTINGS: "haloSettings"
};

/* ---------- STORAGE ---------- */
let marketLogs = GM_getValue(STORAGE_KEYS.MARKET_LOGS, {});
let processedLogs = GM_getValue(STORAGE_KEYS.PROCESSED_LOGS, {});
let userStats = GM_getValue(STORAGE_KEYS.USER_STATS, {});
let settings = GM_getValue(STORAGE_KEYS.SETTINGS, {
    autoScan: true,
    showNotifications: true,
    colorBlindMode: false,
    compactView: false
});

/* ---------- LOG PARSING - FIXED VERSION ---------- */
function extractLogsFromPage() {
    const logs = [];
    const seen = new Set();
    
    console.log("HALO: Starting log extraction...");
    
    // Method 1: Look for tables with specific patterns
    const tables = document.querySelectorAll('table');
    console.log(`HALO: Found ${tables.length} tables`);
    
    for (const table of tables) {
        const rows = table.querySelectorAll('tr');
        console.log(`HALO: Table has ${rows.length} rows`);
        
        for (const row of rows) {
            const rowText = row.textContent.trim();
            
            // Check if row contains log-like content
            if (rowText.includes('deposited') || rowText.includes('used') || rowText.includes('filled')) {
                console.log("HALO: Found log row:", rowText.substring(0, 100));
                
                // Try to parse the entire row text
                const parsed = parseLogFromText(rowText);
                if (parsed) {
                    const logKey = `${parsed.username}_${parsed.action}_${parsed.item}_${parsed.time}_${parsed.date}`;
                    if (!seen.has(logKey)) {
                        seen.add(logKey);
                        logs.push(parsed);
                        console.log("HALO: Successfully parsed:", parsed);
                    }
                }
            }
        }
    }
    
    // Method 2: Look for log entries in divs with time stamps
    const allElements = document.querySelectorAll('div, span, td');
    
    for (const element of allElements) {
        const text = element.textContent.trim();
        
        // Look for time pattern first (HH:MM:SS)
        if (/^\d{1,2}:\d{2}:\d{2}$/.test(text)) {
            // Found a time element, check previous siblings for log content
            let logText = '';
            let dateText = '';
            
            // Check previous element for date (DD/MM/YY)
            if (element.previousElementSibling) {
                const prevText = element.previousElementSibling.textContent.trim();
                if (/^\d{2}\/\d{2}\/\d{2}$/.test(prevText)) {
                    dateText = prevText;
                    
                    // Check element before that for log content
                    if (element.previousElementSibling.previousElementSibling) {
                        logText = element.previousElementSibling.previousElementSibling.textContent.trim();
                    }
                }
            }
            
            if (logText && dateText && (logText.includes('deposited') || logText.includes('used') || logText.includes('filled'))) {
                const fullText = `${logText} ${text} ${dateText}`;
                const parsed = parseLogFromText(fullText);
                
                if (parsed) {
                    const logKey = `${parsed.username}_${parsed.action}_${parsed.item}_${parsed.time}_${parsed.date}`;
                    if (!seen.has(logKey)) {
                        seen.add(logKey);
                        logs.push(parsed);
                        console.log("HALO: Found via time element:", parsed);
                    }
                }
            }
        }
    }
    
    // Method 3: Direct text parsing (fallback)
    if (logs.length === 0) {
        console.log("HALO: Trying direct text parsing...");
        const bodyText = document.body.textContent;
        
        // Look for patterns in the entire page text
        const logPatterns = [
            // Pattern: Username deposited XX x Item HH:MM:SS DD/MM/YY
            /([A-Za-z0-9_]+) deposited (\d+) x (.+?) (\d{1,2}:\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{2})/g,
            
            // Pattern: Username used one of the faction's Item items HH:MM:SS DD/MM/YY
            /([A-Za-z0-9_]+) used one of the faction's (.+?) items? (\d{1,2}:\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{2})/g,
            
            // Pattern: Username filled one of the faction's Item items HH:MM:SS DD/MM/YY
            /([A-Za-z0-9_]+) filled one of the faction's (.+?) items? (\d{1,2}:\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{2})/g,
            
            // Pattern: Username used Item HH:MM:SS DD/MM/YY (simplified)
            /([A-Za-z0-9_]+) used (.+?) (\d{1,2}:\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{2})/g
        ];
        
        for (const pattern of logPatterns) {
            let match;
            while ((match = pattern.exec(bodyText)) !== null) {
                const parsed = {
                    username: match[1],
                    action: match[0].includes('deposited') ? 'deposited' : 
                           match[0].includes('filled') ? 'filled' : 'used',
                    quantity: match[0].includes('deposited') ? parseInt(match[2], 10) : 1,
                    item: match[0].includes('deposited') ? match[3].trim() : match[2].trim(),
                    time: match[4] || match[3],
                    date: match[5] || match[4],
                    timestamp: Date.now()
                };
                
                const logKey = `${parsed.username}_${parsed.action}_${parsed.item}_${parsed.time}_${parsed.date}`;
                if (!seen.has(logKey)) {
                    seen.add(logKey);
                    logs.push(parsed);
                    console.log("HALO: Found via regex:", parsed);
                }
            }
        }
    }
    
    console.log(`HALO: Extracted ${logs.length} logs from page`);
    return logs;
}

function parseLogFromText(text) {
    // Clean up the text
    text = text.replace(/CopySave/g, '').trim();
    
    console.log("HALO: Parsing text:", text);
    
    // Try different patterns
    const patterns = [
        // Pattern 1: Username deposited XX x Item Time Date
        {
            regex: /^([A-Za-z0-9_]+) deposited (\d+) x (.+?) (\d{1,2}:\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{2})$/,
            processor: (match) => ({
                username: match[1],
                action: 'deposited',
                quantity: parseInt(match[2], 10),
                item: match[3].trim(),
                time: match[4],
                date: match[5]
            })
        },
        
        // Pattern 2: Username used one of the faction's Item items Time Date
        {
            regex: /^([A-Za-z0-9_]+) used one of the faction's (.+?) items? (\d{1,2}:\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{2})$/,
            processor: (match) => ({
                username: match[1],
                action: 'used',
                quantity: 1,
                item: match[2].trim(),
                time: match[3],
                date: match[4]
            })
        },
        
        // Pattern 3: Username filled one of the faction's Item items Time Date
        {
            regex: /^([A-Za-z0-9_]+) filled one of the faction's (.+?) items? (\d{1,2}:\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{2})$/,
            processor: (match) => ({
                username: match[1],
                action: 'filled',
                quantity: 1,
                item: match[2].trim(),
                time: match[3],
                date: match[4]
            })
        },
        
        // Pattern 4: Simple pattern (Username Action Item Time Date)
        {
            regex: /^([A-Za-z0-9_]+) (deposited|used|filled) (.+?) (\d{1,2}:\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{2})$/,
            processor: (match) => ({
                username: match[1],
                action: match[2],
                quantity: match[2] === 'deposited' ? 1 : 1, // Default quantity
                item: match[3].trim(),
                time: match[4],
                date: match[5]
            })
        }
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern.regex);
        if (match) {
            const result = pattern.processor(match);
            result.timestamp = parseDateTime(result.date, result.time);
            console.log("HALO: Matched pattern:", pattern.regex.toString(), "Result:", result);
            return result;
        }
    }
    
    console.log("HALO: No pattern matched for text:", text);
    return null;
}

function parseDateTime(dateStr, timeStr) {
    try {
        // dateStr format: DD/MM/YY
        // timeStr format: HH:MM:SS
        const [day, month, year] = dateStr.split('/').map(Number);
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        
        // Convert 2-digit year to 4-digit (assuming 2000s)
        const fullYear = 2000 + year;
        
        return new Date(fullYear, month - 1, day, hours, minutes, seconds).getTime();
    } catch (error) {
        console.error("HALO: Error parsing date/time:", error);
        return Date.now();
    }
}

/* ---------- LOG PROCESSING ---------- */
async function processLogs(logs) {
    let newLogsCount = 0;
    
    console.log(`HALO: Processing ${logs.length} logs...`);
    
    for (const log of logs) {
        const logKey = `${log.username}_${log.action}_${log.item}_${log.time}_${log.date}`;
        
        if (!processedLogs[logKey]) {
            // Process the log
            processLogEntry(log);
            
            processedLogs[logKey] = {
                timestamp: log.timestamp,
                processedAt: Date.now()
            };
            
            newLogsCount++;
            
            // Show notification if enabled
            if (settings.showNotifications) {
                showBadge(`${getActionEmoji(log.action)} ${log.username} ${log.action} ${log.item}`);
            }
            
            console.log("HALO: New log processed:", log);
        } else {
            console.log("HALO: Log already processed:", logKey);
        }
    }
    
    if (newLogsCount > 0) {
        GM_setValue(STORAGE_KEYS.PROCESSED_LOGS, processedLogs);
        GM_setValue(STORAGE_KEYS.MARKET_LOGS, marketLogs);
        GM_setValue(STORAGE_KEYS.USER_STATS, userStats);
        
        console.log(`HALO: Processed ${newLogsCount} new logs. Total: ${Object.keys(processedLogs).length}`);
        renderPanel();
    } else {
        console.log("HALO: No new logs found");
    }
    
    return newLogsCount;
}

function processLogEntry(log) {
    const { username, action, item, quantity } = log;
    
    // Initialize user stats if needed
    if (!userStats[username]) {
        userStats[username] = {
            totalDeposits: 0,
            totalUses: 0,
            netValue: 0,
            lastSeen: log.timestamp,
            items: {}
        };
    }
    
    // Update last seen
    userStats[username].lastSeen = log.timestamp;
    
    // For demo purposes, use dummy prices
    // In a real implementation, you'd fetch prices from an API
    const price = getDummyPrice(item);
    const value = price * quantity;
    
    // Update user stats based on action
    if (action === 'deposited' || action === 'filled') {
        userStats[username].totalDeposits += value;
        userStats[username].netValue += value;
    } else if (action === 'used') {
        userStats[username].totalUses += value;
        userStats[username].netValue -= value;
    }
    
    // Track individual items
    const itemKey = item.toLowerCase();
    if (!userStats[username].items[itemKey]) {
        userStats[username].items[itemKey] = {
            name: item,
            deposits: 0,
            uses: 0,
            lastActivity: log.timestamp
        };
    }
    
    if (action === 'deposited' || action === 'filled') {
        userStats[username].items[itemKey].deposits += quantity;
    } else if (action === 'used') {
        userStats[username].items[itemKey].uses += quantity;
    }
    
    userStats[username].items[itemKey].lastActivity = log.timestamp;
    
    // Store in market logs
    if (!marketLogs[username]) {
        marketLogs[username] = [];
    }
    
    marketLogs[username].push({
        ...log,
        price: price,
        value: value,
        processedAt: Date.now()
    });
}

function getDummyPrice(itemName) {
    // Dummy prices for demo
    const priceMap = {
        'blood bag': 50000,
        'lollipop': 1000,
        'beer': 500,
        'chocolate bars': 800,
        'first aid kit': 150000,
        'xanax': 800000,
        'empty blood bag': 0
    };
    
    const lowerName = itemName.toLowerCase();
    
    for (const [key, price] of Object.entries(priceMap)) {
        if (lowerName.includes(key)) {
            return price;
        }
    }
    
    // Default price based on item length (for demo)
    return itemName.length * 1000;
}

/* ---------- UTILITIES ---------- */
function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log("HALO MARKET:", ...args);
    }
}

function getActionEmoji(action) {
    switch (action) {
        case 'deposited': return '📥';
        case 'used': return '📤';
        case 'filled': return '🔄';
        default: return '📝';
    }
}

function formatNumber(num) {
    if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toLocaleString()}`;
}

function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

/* ---------- BADGE SYSTEM ---------- */
let badgeEl = null;
let badgeTimer = null;

function showBadge(text) {
    if (!badgeEl) {
        badgeEl = document.createElement("div");
        badgeEl.style.cssText = `
            position: fixed;
            right: 10px;
            bottom: 10px;
            z-index: 999999;
            padding: 8px 10px;
            border-radius: 10px;
            font-size: 12px;
            font-family: 'Courier New', monospace;
            white-space: pre-line;
            box-shadow: 0 8px 20px rgba(0,0,0,0.35);
            background: linear-gradient(135deg, #0066cc, #0099ff);
            color: white;
            display: none;
            max-width: 300px;
            word-break: break-word;
            border: 1px solid rgba(0, 255, 234, 0.5);
        `;
        document.body.appendChild(badgeEl);
    }
    
    if (badgeTimer) clearTimeout(badgeTimer);
    badgeEl.textContent = text;
    badgeEl.style.display = "block";
    badgeTimer = setTimeout(() => {
        badgeEl.style.display = "none";
    }, 2500);
}

/* ---------- UI STYLES ---------- */
GM_addStyle(`
#haloMarketPanel {
    position: fixed;
    bottom: 0;
    right: 15px;
    width: 350px;
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

#haloMarketPanel::before {
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

.halo-market-header {
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

.halo-market-header::after {
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

.halo-market-header h1 {
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

.halo-market-header h1:before {
    content: "🛸";
    font-size: 14px;
    filter: drop-shadow(0 0 4px #00ffea);
}

.halo-market-content {
    padding: 12px;
    height: calc(100% - 28px);
    overflow-y: auto;
    background: rgba(0, 5, 10, 0.8);
}

.halo-stats-grid {
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

.halo-stats-grid::before {
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

.halo-stat {
    text-align: center;
    position: relative;
    z-index: 1;
}

.halo-stat-number {
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

.halo-stat-label {
    font-size: 9px;
    color: #8af5ff;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 2px;
    opacity: 0.9;
    font-weight: 600;
    line-height: 1.1;
}

.halo-controls {
    background: rgba(0, 20, 40, 0.3);
    border: 1px solid rgba(0, 255, 234, 0.2);
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 12px;
}

.halo-control-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.halo-control-label {
    color: #8af5ff;
    font-size: 11px;
    font-weight: 600;
}

.halo-toggle {
    position: relative;
    width: 40px;
    height: 20px;
}

.halo-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.halo-toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #1a1a1a;
    border: 1px solid rgba(0, 255, 234, 0.3);
    transition: .4s;
    border-radius: 34px;
}

.halo-toggle-slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 3px;
    bottom: 3px;
    background-color: #00ffea;
    transition: .4s;
    border-radius: 50%;
}

.halo-toggle input:checked + .halo-toggle-slider {
    background-color: rgba(0, 255, 234, 0.2);
    border-color: #00ffea;
}

.halo-toggle input:checked + .halo-toggle-slider:before {
    transform: translateX(20px);
}

.halo-users-container {
    background: rgba(0, 5, 10, 0.6);
    border-radius: 6px;
    padding: 5px;
    border: 1px solid rgba(0, 255, 234, 0.2);
}

.halo-user-card {
    background: linear-gradient(135deg, 
        rgba(0, 20, 40, 0.8) 0%, 
        rgba(20, 0, 40, 0.8) 100%);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 6px;
    border: 1px solid rgba(0, 255, 234, 0.2);
    transition: all 0.2s ease;
}

.halo-user-card:hover {
    border-color: rgba(0, 255, 234, 0.3);
    box-shadow: 0 0 10px rgba(0, 255, 234, 0.15);
}

.halo-user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.halo-user-name {
    font-size: 12px;
    font-weight: 600;
    color: #8af5ff;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-shadow: 0 0 5px rgba(138, 245, 255, 0.5);
    font-family: 'Orbitron', monospace;
}

.halo-user-balance {
    font-size: 12px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 4px;
    min-width: 70px;
    text-align: center;
    font-family: 'Orbitron', monospace;
}

.halo-balance-positive {
    background: linear-gradient(135deg, 
        rgba(0, 255, 136, 0.2) 0%, 
        rgba(0, 255, 136, 0.1) 100%);
    color: #00ff88;
    border: 1px solid rgba(0, 255, 136, 0.3);
}

.halo-balance-negative {
    background: linear-gradient(135deg, 
        rgba(255, 68, 68, 0.2) 0%, 
        rgba(255, 68, 68, 0.1) 100%);
    color: #ff4444;
    border: 1px solid rgba(255, 68, 68, 0.3);
}

.halo-user-details {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(0, 255, 234, 0.2);
    display: none;
}

.halo-items-list {
    margin-bottom: 8px;
}

.halo-item-row {
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

.halo-item-info {
    display: flex;
    align-items: center;
    gap: 6px;
}

.halo-item-name {
    color: #b8f5ff;
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
}

.halo-item-count {
    color: #00ffea;
    font-weight: 700;
    font-size: 10px;
    font-family: 'Orbitron', monospace;
}

.halo-item-value {
    font-weight: 700;
    font-size: 10px;
    font-family: 'Orbitron', monospace;
}

.halo-item-deposit .halo-item-value {
    color: #00ff88;
}

.halo-item-use .halo-item-value {
    color: #ff4444;
}

.halo-item-fill .halo-item-value {
    color: #ffaa00;
}

.halo-item-time {
    color: #8af5ff;
    font-size: 9px;
    min-width: 45px;
    text-align: right;
    opacity: 0.8;
    font-family: 'Courier New', monospace;
}

.halo-user-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
}

.halo-action-btn {
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

.halo-action-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(255, 65, 108, 0.6);
}

.halo-empty-state {
    text-align: center;
    padding: 30px 15px;
    color: rgba(138, 245, 255, 0.6);
    font-size: 11px;
    font-family: 'Orbitron', monospace;
}

.halo-empty-state:before {
    content: "📊";
    font-size: 24px;
    display: block;
    margin-bottom: 8px;
    opacity: 0.7;
    filter: drop-shadow(0 0 5px rgba(0, 255, 234, 0.5));
}

#haloMarketBubble {
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

#haloMarketBubble:hover {
    transform: scale(1.2) rotate(15deg);
    box-shadow: 
        0 0 30px rgba(0, 255, 234, 0.8),
        0 0 60px rgba(138, 43, 226, 0.5);
}

#haloMarketBubble:before {
    content: "👽";
    filter: drop-shadow(0 0 8px #00ffea);
}

.halo-market-content::-webkit-scrollbar {
    width: 5px;
}

.halo-market-content::-webkit-scrollbar-track {
    background: rgba(0, 255, 234, 0.05);
    border-radius: 3px;
}

.halo-market-content::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, 
        rgba(0, 255, 234, 0.5) 0%, 
        rgba(138, 43, 226, 0.5) 100%);
    border-radius: 3px;
}

.halo-scan-btn {
    background: linear-gradient(135deg, 
        #00ffea 0%, 
        #00ccaa 100%);
    color: black;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: 'Orbitron', monospace;
    transition: all 0.2s ease;
    width: 100%;
    margin-bottom: 8px;
}

.halo-scan-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(0, 255, 234, 0.6);
}

.halo-debug-info {
    background: rgba(255, 100, 0, 0.1);
    border: 1px solid rgba(255, 100, 0, 0.3);
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 10px;
    font-size: 10px;
    color: #ff9900;
    font-family: 'Courier New', monospace;
}

.halo-debug-info pre {
    margin: 0;
    font-size: 9px;
    overflow: auto;
    max-height: 100px;
}
`);

/* ---------- UI CREATION ---------- */
function createUI() {
    // Remove existing UI
    const existingPanel = document.getElementById("haloMarketPanel");
    if (existingPanel) existingPanel.remove();
    
    const existingBubble = document.getElementById("haloMarketBubble");
    if (existingBubble) existingBubble.remove();
    
    // Create panel
    const panel = document.createElement("div");
    panel.id = "haloMarketPanel";
    panel.innerHTML = `
        <div class="halo-market-header">
            <h1>👽 HALO MARKET v7.1</h1>
        </div>
        <div class="halo-market-content">
            <div class="halo-stats-grid">
                <div class="halo-stat">
                    <div class="halo-stat-number" id="haloTotalUsers">0</div>
                    <div class="halo-stat-label">USERS</div>
                </div>
                <div class="halo-stat">
                    <div class="halo-stat-number" id="haloTotalLogs">0</div>
                    <div class="halo-stat-label">LOGS</div>
                </div>
                <div class="halo-stat">
                    <div class="halo-stat-number" id="haloDeposits">0</div>
                    <div class="halo-stat-label">DEPOSITS</div>
                </div>
                <div class="halo-stat">
                    <div class="halo-stat-number" id="haloUses">0</div>
                    <div class="halo-stat-label">USES</div>
                </div>
            </div>
            
            <div class="halo-controls">
                <button class="halo-scan-btn" id="haloScanNow">🔍 SCAN PAGE NOW</button>
                ${DEBUG_MODE ? '<button class="halo-action-btn" id="haloDebugScan" style="width: 100%; margin-bottom: 8px;">🐛 DEBUG SCAN</button>' : ''}
                
                <div class="halo-control-row">
                    <span class="halo-control-label">Auto-scan</span>
                    <label class="halo-toggle">
                        <input type="checkbox" id="haloAutoScan" ${settings.autoScan ? 'checked' : ''}>
                        <span class="halo-toggle-slider"></span>
                    </label>
                </div>
                
                <div class="halo-control-row">
                    <span class="halo-control-label">Notifications</span>
                    <label class="halo-toggle">
                        <input type="checkbox" id="haloNotifications" ${settings.showNotifications ? 'checked' : ''}>
                        <span class="halo-toggle-slider"></span>
                    </label>
                </div>
                
                <div class="halo-control-row">
                    <span class="halo-control-label">Color-blind mode</span>
                    <label class="halo-toggle">
                        <input type="checkbox" id="haloColorBlind" ${settings.colorBlindMode ? 'checked' : ''}>
                        <span class="halo-toggle-slider"></span>
                    </label>
                </div>
                
                <div class="halo-control-row">
                    <span class="halo-control-label">Compact view</span>
                    <label class="halo-toggle">
                        <input type="checkbox" id="haloCompactView" ${settings.compactView ? 'checked' : ''}>
                        <span class="halo-toggle-slider"></span>
                    </label>
                </div>
                
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button class="halo-action-btn" style="flex: 1;" id="haloExportData">📤 EXPORT</button>
                    <button class="halo-action-btn" style="flex: 1;" id="haloClearData">🗑️ CLEAR</button>
                </div>
            </div>
            
            <div id="haloDebugInfo" style="display: none;"></div>
            
            <div class="halo-users-container" id="haloUsersList"></div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Create bubble button
    const bubble = document.createElement("div");
    bubble.id = "haloMarketBubble";
    document.body.appendChild(bubble);
    
    // Add event listeners
    document.getElementById("haloScanNow").onclick = () => {
        const logs = extractLogsFromPage();
        const processed = processLogs(logs);
        showBadge(`🔍 Found ${logs.length} logs, ${processed} new`);
    };
    
    if (DEBUG_MODE) {
        document.getElementById("haloDebugScan").onclick = () => {
            const logs = extractLogsFromPage();
            const debugInfo = document.getElementById("haloDebugInfo");
            debugInfo.innerHTML = `
                <div class="halo-debug-info">
                    <strong>Debug Info:</strong><br>
                    Found ${logs.length} logs<br>
                    <pre>${JSON.stringify(logs.slice(0, 5), null, 2)}</pre>
                    <button onclick="document.getElementById('haloDebugInfo').style.display='none'">Hide</button>
                </div>
            `;
            debugInfo.style.display = "block";
        };
    }
    
    document.getElementById("haloAutoScan").onchange = (e) => {
        settings.autoScan = e.target.checked;
        GM_setValue(STORAGE_KEYS.SETTINGS, settings);
    };
    
    document.getElementById("haloNotifications").onchange = (e) => {
        settings.showNotifications = e.target.checked;
        GM_setValue(STORAGE_KEYS.SETTINGS, settings);
    };
    
    document.getElementById("haloColorBlind").onchange = (e) => {
        settings.colorBlindMode = e.target.checked;
        GM_setValue(STORAGE_KEYS.SETTINGS, settings);
        renderPanel();
    };
    
    document.getElementById("haloCompactView").onchange = (e) => {
        settings.compactView = e.target.checked;
        GM_setValue(STORAGE_KEYS.SETTINGS, settings);
        renderPanel();
    };
    
    document.getElementById("haloExportData").onclick = () => {
        const data = {
            marketLogs: marketLogs,
            userStats: userStats,
            processedLogs: processedLogs,
            timestamp: Date.now()
        };
        
        console.log("=== HALO MARKET DATA ===");
        console.log(JSON.stringify(data, null, 2));
        
        navigator.clipboard.writeText(JSON.stringify(data, null, 2))
            .then(() => showBadge("📋 Data exported to console & clipboard"))
            .catch(() => showBadge("📊 Data exported to console (F12)"));
    };
    
    document.getElementById("haloClearData").onclick = () => {
        if (confirm("Clear ALL market log data? This cannot be undone!")) {
            marketLogs = {};
            processedLogs = {};
            userStats = {};
            
            GM_setValue(STORAGE_KEYS.MARKET_LOGS, {});
            GM_setValue(STORAGE_KEYS.PROCESSED_LOGS, {});
            GM_setValue(STORAGE_KEYS.USER_STATS, {});
            
            showBadge("🗑️ All data cleared");
            renderPanel();
        }
    };
    
    bubble.onclick = () => {
        const panel = document.getElementById("haloMarketPanel");
        panel.style.display = panel.style.display === "none" ? "block" : "none";
        if (panel.style.display === "block") {
            renderPanel();
        }
    };
    
    return { panel, bubble };
}

/* ---------- PANEL RENDERING ---------- */
function renderPanel() {
    updateStats();
    renderUsersList();
}

function updateStats() {
    const users = Object.keys(userStats);
    const totalLogs = Object.keys(processedLogs).length;
    
    let totalDeposits = 0;
    let totalUses = 0;
    
    users.forEach(username => {
        const stats = userStats[username];
        totalDeposits += stats.totalDeposits;
        totalUses += stats.totalUses;
    });
    
    document.getElementById("haloTotalUsers").textContent = users.length;
    document.getElementById("haloTotalLogs").textContent = totalLogs;
    document.getElementById("haloDeposits").textContent = formatNumber(totalDeposits);
    document.getElementById("haloUses").textContent = formatNumber(totalUses);
}

function renderUsersList() {
    const usersList = document.getElementById("haloUsersList");
    const users = Object.keys(userStats).sort((a, b) => {
        const netA = userStats[a].netValue;
        const netB = userStats[b].netValue;
        
        // Sort negative balances first (debtors), then by magnitude
        if (netA < 0 && netB < 0) return netA - netB;
        if (netA < 0) return -1;
        if (netB < 0) return 1;
        return netB - netA;
    });
    
    if (users.length === 0) {
        usersList.innerHTML = `
            <div class="halo-empty-state">
                <div>NO MARKET DATA</div>
                <div style="margin-top: 5px; font-size: 9px;">SCAN A PAGE WITH LOGS</div>
            </div>
        `;
        return;
    }
    
    usersList.innerHTML = users.map(username => {
        const stats = userStats[username];
        const netValue = stats.netValue;
        const isPositive = netValue >= 0;
        const balanceClass = isPositive ? 'halo-balance-positive' : 'halo-balance-negative';
        const balanceText = isPositive ? 
            `+${formatNumber(Math.abs(netValue))}` : 
            `-${formatNumber(Math.abs(netValue))}`;
        
        const items = Object.values(stats.items || {});
        const depositItems = items.filter(item => item.deposits > 0);
        const useItems = items.filter(item => item.uses > 0);
        
        return `
            <div class="halo-user-card">
                <div class="halo-user-header">
                    <div class="halo-user-name" title="${username}">${username}</div>
                    <div class="halo-user-balance ${balanceClass}">
                        ${balanceText}
                    </div>
                </div>
                <div class="halo-user-details">
                    <div class="halo-items-list">
                        ${depositItems.map(item => renderItemRow(item, 'deposited')).join('')}
                        ${useItems.map(item => renderItemRow(item, 'used')).join('')}
                    </div>
                    <div class="halo-user-actions">
                        <button class="halo-action-btn" data-user="${username}">RESET USER</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
    
    // Add event listeners
    document.querySelectorAll(".halo-user-header").forEach(header => {
        header.onclick = (e) => {
            if (!e.target.closest('.halo-action-btn')) {
                const content = header.nextElementSibling;
                content.style.display = content.style.display === "none" ? "block" : "none";
            }
        };
    });
    
    document.querySelectorAll(".halo-action-btn[data-user]").forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const username = btn.dataset.user;
            if (confirm(`Reset all data for ${username}?`)) {
                delete userStats[username];
                delete marketLogs[username];
                
                // Also remove processed logs for this user
                Object.keys(processedLogs).forEach(key => {
                    if (key.includes(username)) {
                        delete processedLogs[key];
                    }
                });
                
                GM_setValue(STORAGE_KEYS.USER_STATS, userStats);
                GM_setValue(STORAGE_KEYS.MARKET_LOGS, marketLogs);
                GM_setValue(STORAGE_KEYS.PROCESSED_LOGS, processedLogs);
                
                showBadge(`🗑️ Reset data for ${username}`);
                renderPanel();
            }
        };
    });
}

function renderItemRow(item, action) {
    const count = action === 'deposited' ? item.deposits : item.uses;
    const itemClass = `halo-item-row halo-item-${action}`;
    const value = count * getDummyPrice(item.name);
    
    return `
        <div class="${itemClass}">
            <div class="halo-item-info">
                <span class="halo-item-name" title="${item.name}">${item.name}</span>
                <span class="halo-item-count">x${count}</span>
                <span class="halo-item-value">${formatNumber(value)}</span>
            </div>
            <div class="halo-item-time">${formatTimeAgo(item.lastActivity)}</div>
        </div>
    `;
}

/* ---------- MAIN SCANNING ---------- */
function startAutoScan() {
    if (!settings.autoScan) return;
    
    const logs = extractLogsFromPage();
    if (logs.length > 0) {
        processLogs(logs);
    }
}

/* ---------- INITIALIZATION ---------- */
function initialize() {
    console.log("HALO Market Tracker initializing...");
    
    // Create UI
    createUI();
    
    // Start auto-scanning
    if (settings.autoScan) {
        console.log("HALO: Starting auto-scan...");
        startAutoScan();
        setInterval(startAutoScan, SCAN_INTERVAL);
    }
    
    // Regular refresh
    setInterval(() => {
        renderPanel();
    }, REFRESH_MS);
    
    console.log("HALO Market Tracker initialized!");
    
    // Show initial state
    renderPanel();
}

/* ---------- START SCRIPT ---------- */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

})();