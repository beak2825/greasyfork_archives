// ==UserScript==
// @name         HALO Armory Log Tester (V2 Format)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Test Torn v2 API using correct format
// @author       Nova
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/561099/HALO%20Armory%20Log%20Tester%20%28V2%20Format%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561099/HALO%20Armory%20Log%20Tester%20%28V2%20Format%29.meta.js
// ==/UserScript==

(function(){
"use strict";

/* ---------- CONFIG ---------- */
let factionKey = GM_getValue("FACTION_API_KEY","");

/* ---------- HELPERS ---------- */
function formatTime(ts){
    if(!ts) return "";
    const d = new Date(ts*1000);
    return d.toLocaleString();
}

/* ---------- FETCH LOGS (V2 API - Your Format) ---------- */
async function fetchCategory(cat, limit = 200, sort = "ASC") {
    const url = `https://api.torn.com/v2/faction/news?limit=${limit}&sort=${sort}&stripTags=true&cat=${cat}&key=${factionKey}`;
    console.log(`Fetching ${cat} from:`, url);
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(`${cat} response:`, data);
        
        if (data && Array.isArray(data.news)) {
            console.log(`Found ${data.news.length} ${cat} logs`);
            return data.news.map(log => ({
                ...log,
                type: cat
            }));
        }
        return [];
    } catch (e) {
        console.error(`Failed to fetch ${cat}:`, e);
        return [];
    }
}

async function fetchAllLogs() {
    if(!factionKey) {
        factionKey = prompt("Enter your Faction API Key:");
        if (factionKey) {
            GM_setValue("FACTION_API_KEY", factionKey);
        } else {
            return;
        }
    }
    
    console.log("=== V2 API LOG TEST (Your Format) ===");
    
    try {
        // Fetch ASC (oldest first) to see historical range
        console.log("\n--- FETCHING OLDEST LOGS (ASC) ---");
        const [oldActions, oldDeposits] = await Promise.all([
            fetchCategory("armoryAction", 50, "ASC"),  // Get oldest 50
            fetchCategory("armoryDeposit", 50, "ASC")  // Get oldest 50
        ]);
        
        // Fetch DESC (newest first) to see current logs
        console.log("\n--- FETCHING NEWEST LOGS (DESC) ---");
        const [newActions, newDeposits] = await Promise.all([
            fetchCategory("armoryAction", 50, "DESC"),  // Get newest 50
            fetchCategory("armoryDeposit", 50, "DESC")  // Get newest 50
        ]);
        
        const allLogs = [...oldActions, ...oldDeposits, ...newActions, ...newDeposits];
        
        // Remove duplicates by ID
        const uniqueLogs = [];
        const seenIds = new Set();
        allLogs.forEach(log => {
            if (log.id && !seenIds.has(log.id)) {
                seenIds.add(log.id);
                uniqueLogs.push(log);
            }
        });
        
        console.log("\n=== SUMMARY ===");
        console.log(`Total unique logs: ${uniqueLogs.length}`);
        
        if (uniqueLogs.length > 0) {
            // Sort by timestamp
            uniqueLogs.sort((a, b) => a.timestamp - b.timestamp);
            
            const oldest = uniqueLogs[0];
            const newest = uniqueLogs[uniqueLogs.length - 1];
            
            console.log(`\nOldest log (${oldest.type}):`);
            console.log(`  Time: ${formatTime(oldest.timestamp)} (${oldest.timestamp})`);
            console.log(`  Text: ${oldest.text}`);
            
            console.log(`\nNewest log (${newest.type}):`);
            console.log(`  Time: ${formatTime(newest.timestamp)} (${newest.timestamp})`);
            console.log(`  Text: ${newest.text}`);
            
            // Calculate date range
            const oldestDate = new Date(oldest.timestamp * 1000);
            const newestDate = new Date(newest.timestamp * 1000);
            const daysDiff = Math.round((newestDate - oldestDate) / (1000 * 60 * 60 * 24));
            
            console.log(`\nDate range: ${daysDiff} days`);
            console.log(`From: ${oldestDate.toISOString().split('T')[0]}`);
            console.log(`To: ${newestDate.toISOString().split('T')[0]}`);
            
            // Count by month
            const byMonth = {};
            uniqueLogs.forEach(log => {
                const date = new Date(log.timestamp * 1000);
                const month = date.toISOString().slice(0, 7); // YYYY-MM
                byMonth[month] = (byMonth[month] || 0) + 1;
            });
            
            console.log("\nLogs by month:");
            Object.keys(byMonth).sort().forEach(month => {
                console.log(`  ${month}: ${byMonth[month]} logs`);
            });
            
            // Test if we can fetch very old logs
            console.log("\n--- TESTING HISTORICAL LIMITS ---");
            
            // Try to fetch with from parameter
            const testOldUrl = `https://api.torn.com/v2/faction/news?limit=10&sort=ASC&stripTags=true&cat=armoryAction&from=0&key=${factionKey}`;
            console.log("Testing from=0:", testOldUrl);
            
            try {
                const testRes = await fetch(testOldUrl);
                const testData = await testRes.json();
                if (testData.news && testData.news.length > 0) {
                    console.log("Oldest available log with from=0:", formatTime(testData.news[0].timestamp));
                }
            } catch (e) {
                console.log("from=0 test failed:", e.message);
            }
        }
        
        displayLogs(uniqueLogs);
        
    } catch (e) {
        console.error("Error in fetchAllLogs:", e);
        alert("Error: " + e.message);
    }
}

/* ---------- UI ---------- */
GM_addStyle(`
#logTesterPanel {
    position: fixed;
    top: 50px;
    right: 20px;
    width: 45%;
    height: 80%;
    background: white;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 10px;
    overflow-y: auto;
    z-index: 9999;
    font-family: monospace;
    font-size: 11px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
.logEntry {
    margin: 4px 0;
    padding: 4px;
    border-left: 3px solid #ccc;
}
.armoryActionLog {
    border-left-color: #f44336;
    background-color: #ffebee;
}
.armoryDepositLog {
    border-left-color: #4CAF50;
    background-color: #e8f5e8;
}
.logTimestamp {
    color: #666;
    font-size: 10px;
}
.logType {
    font-weight: bold;
    padding: 1px 4px;
    border-radius: 3px;
    margin-right: 5px;
    font-size: 10px;
}
.actionType {
    background: #f44336;
    color: white;
}
.depositType {
    background: #4CAF50;
    color: white;
}
.logStats {
    background: #e3f2fd;
    padding: 8px;
    margin: 8px 0;
    border-radius: 4px;
    font-size: 11px;
}
`);

function displayLogs(logs) {
    let panel = document.getElementById('logTesterPanel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'logTesterPanel';
        document.body.appendChild(panel);
    }
    
    // Sort logs newest first for display
    const displayLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);
    
    let html = `
        <h3 style="margin-top:0;">V2 API Log Tester</h3>
        <div class="logStats">
            <strong>Statistics:</strong><br>
            Total Logs: ${logs.length}<br>
    `;
    
    if (logs.length > 0) {
        const oldest = logs[0]; // Already sorted oldest first in fetchAllLogs
        const newest = logs[logs.length - 1];
        const oldestDate = new Date(oldest.timestamp * 1000);
        const newestDate = new Date(newest.timestamp * 1000);
        const daysDiff = Math.round((newestDate - oldestDate) / (1000 * 60 * 60 * 24));
        
        html += `
            Date Range: ${daysDiff} days<br>
            Oldest: ${oldestDate.toLocaleDateString()}<br>
            Newest: ${newestDate.toLocaleDateString()}<br>
        `;
        
        // Count by type
        const actionCount = logs.filter(l => l.type === 'armoryAction').length;
        const depositCount = logs.filter(l => l.type === 'armoryDeposit').length;
        html += `Actions: ${actionCount} | Deposits: ${depositCount}`;
    }
    
    html += `
        </div>
        <div style="margin: 8px 0;">
            <button onclick="fetchAllLogs()" style="padding: 4px 8px; margin-right: 5px;">Refresh</button>
            <button onclick="document.getElementById('logTesterPanel').remove()" style="padding: 4px 8px;">Close</button>
        </div>
        <div id="logList">
    `;
    
    displayLogs.forEach(log => {
        const time = formatTime(log.timestamp);
        const typeClass = log.type === 'armoryAction' ? 'actionType' : 'depositType';
        const typeText = log.type === 'armoryAction' ? 'USE' : 'DEP';
        
        html += `
            <div class="logEntry ${log.type}Log">
                <span class="logType ${typeClass}">${typeText}</span>
                <span class="logTimestamp">${time}</span><br>
                ${log.text}<br>
                <small style="color:#888;">ID: ${log.id}</small>
            </div>
        `;
    });
    
    html += `</div>`;
    panel.innerHTML = html;
}

/* ---------- INITIALIZATION ---------- */
// Add test button to page
const testButton = document.createElement('button');
testButton.textContent = 'Test V2 Logs';
testButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 10000;
    font-family: sans-serif;
    font-weight: bold;
`;
testButton.onclick = fetchAllLogs;
document.body.appendChild(testButton);

// Add key status indicator
const keyStatus = document.createElement('div');
keyStatus.textContent = factionKey ? '✓ API Key Set' : '✗ No API Key';
keyStatus.style.cssText = `
    position: fixed;
    top: 20px;
    right: 140px;
    padding: 8px;
    background: ${factionKey ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10000;
`;
document.body.appendChild(keyStatus);

console.log('HALO V2 Log Tester loaded. Click the blue button to test.');

})();