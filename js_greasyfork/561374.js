// ==UserScript==
// @name         HALO Armory Tracker Pro (V2)
// @namespace    http://tampermonkey.net/
// @version      HALO.2.1
// @description  Faction armory tracker: V2 API, beer free, 3-hour rate limit
// @author       Nova
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/561374/HALO%20Armory%20Tracker%20Pro%20%28V2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561374/HALO%20Armory%20Tracker%20Pro%20%28V2%29.meta.js
// ==/UserScript==

(function(){
"use strict";

/* ---------- CONFIG ---------- */
const factionIds = ["48418"];
const REFRESH_MS = 45000; // UI refresh only
const FACTION_API_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours for faction logs
const PRICE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
const MEDICAL_DAILY_LIMIT = 100000;

/* ---------- STORAGE ---------- */
let factionKey = GM_getValue("FACTION_API_KEY","");
let marketKey  = GM_getValue("MARKET_API_KEY","");

let usedItems     = GM_getValue("usedItems", {});
let deposits      = GM_getValue("deposits", {});
let processedLogs = GM_getValue("processedLogs", {});
let medWindows    = GM_getValue("medWindows", {});

// Price caching
let priceCache    = GM_getValue("priceCache", {});
let itemIdCache   = GM_getValue("itemIdCache", {});
let lastFactionAPITime = GM_getValue("lastFactionAPITime", 0);

/* ---------- HELPERS ---------- */
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
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = d.getDate();
    const month = d.getMonth() + 1;
    return `${hours}:${minutes}, ${day}.${month}`;
}

/* ---------- FREE + MEDICAL ---------- */
const FREE_ITEMS = ["sweetheart","lollipop","chocolate kisses","blood bag","empty blood bag","beer"];
const MEDICAL_ITEMS = ["first aid","small first aid","morphine","ipecac"];

function isFree(n){ return FREE_ITEMS.some(f=>n.includes(f)); }
function isMedical(n){ return MEDICAL_ITEMS.some(m=>n.includes(m)); }

/* ---------- MARKET PRICES (NO HARCODED) ---------- */
async function getItemPrice(itemName){
    const norm = normalize(itemName);
    const now = Date.now();
    
    // Check cache first
    if (priceCache[norm] && (now - priceCache[norm].timestamp) < PRICE_CACHE_TTL) {
        return priceCache[norm].price;
    }
    
    // Get item ID
    const itemId = await getItemId(itemName);
    if (!itemId || !marketKey) return null;
    
    // Fetch fresh market price
    try {
        const r = await fetch(`https://api.torn.com/v2/market/${itemId}/itemmarket?key=${marketKey}`);
        const d = await r.json();
        const listings = d?.itemmarket?.listings || [];
        if(!listings.length) return null;
        
        listings.sort((a,b)=> (a.price||a.cost||0)-(b.price||b.cost||0));
        const price = Math.round(listings[0].price || listings[0].cost);
        
        // Cache the price
        priceCache[norm] = {
            price: price,
            timestamp: now
        };
        GM_setValue("priceCache", priceCache);
        
        return price;
    } catch (error) {
        console.error("Price fetch error:", error);
        return null;
    }
}

async function getItemId(itemName){
    const norm = normalize(itemName);
    
    // Check cache
    if (itemIdCache[norm]) {
        return itemIdCache[norm];
    }
    
    // Fetch from Torn API
    if (!marketKey) return null;
    
    try {
        const r = await fetch(`https://api.torn.com/v2/torn/items?cat=All&sort=ASC&key=${marketKey}`);
        const d = await r.json();
        const items = d.items || {};
        
        // Search for item
        for(const it of Object.values(items)){
            const n = normalize(it.name);
            if(n === norm || n.includes(norm) || norm.includes(n)){
                itemIdCache[norm] = it.id;
                GM_setValue("itemIdCache", itemIdCache);
                return it.id;
            }
        }
    } catch (error) {
        console.error("Item ID fetch error:", error);
    }
    
    return null;
}

/* ---------- WINDOWS ---------- */
function processMedicalUse(user, value, ts){
    const day = dayFromLog(ts);
    medWindows[user] ??= {};
    medWindows[user][day] ??= { total:0 };
    medWindows[user][day].total += value;
    GM_setValue("medWindows", medWindows);
    return medWindows[user][day].total >= MEDICAL_DAILY_LIMIT;
}

/* ---------- NET ---------- */
function getNetValue(user){
    let dep = 0, use = 0;
    for(const k in deposits[user]||{}) dep += deposits[user][k].price * deposits[user][k].count;
    for(const k in usedItems[user]||{}) use += usedItems[user][k].price * usedItems[user][k].count;
    return Math.round(dep - use);
}

/* ---------- FETCH LOGS (V2 API with 3-hour limit) ---------- */
async function fetchFactionLogs(){
    if(!factionKey) return {};
    
    const now = Date.now();
    const timeSinceLastCall = now - lastFactionAPITime;
    
    // STRICT 3-HOUR RATE LIMIT
    if (timeSinceLastCall < FACTION_API_INTERVAL && lastFactionAPITime > 0) {
        console.log(`[V2 API] Next fetch in ${Math.ceil((FACTION_API_INTERVAL - timeSinceLastCall) / (60 * 60 * 1000))} hours`);
        return {};
    }
    
    console.log(`[V2 API] Fetching faction logs at ${new Date().toLocaleTimeString()}`);
    
    try {
        const logs = {};
        
        // Fetch Action Logs
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
        
        // Fetch Deposit Logs
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
        
        // Update last fetch time
        lastFactionAPITime = now;
        GM_setValue("lastFactionAPITime", lastFactionAPITime);
        
        console.log(`[V2 API] Fetched ${Object.keys(logs).length} logs`);
        return logs;
        
    } catch (e) {
        console.error("[V2 API] Error:", e);
        return {};
    }
}

/* ---------- CORE ---------- */
async function loadLogs(){
    if(!factionKey || !marketKey) {
        renderPanel();
        return;
    }

    const logs = await fetchFactionLogs();
    
    const arr = Object.entries(logs)
        .map(([k,v])=>({ logId:k, entry:v, t:v.time||0 }))
        .sort((a,b)=> a.t - b.t || parseInt(a.logId) - parseInt(b.logId));

    for(const item of arr){
        const { logId, entry, t } = item;
        if(processedLogs[logId]) continue;

        const text = stripTags(entry.news).replace(/\s+/g," ").trim();

        const dep = text.match(/^(.+?) deposited (?:(\d+)\s*[x×]?\s*)?(.+?)\.?$/i);
        const use = text.match(/^(.+?) used (?:one of the faction's |a |)(.+?) items?\.?$/i)
                 || text.match(/^(.+?) used (.+?)\.?$/i);

        if(dep){
            const user = dep[1].trim();
            const count = dep[2] ? parseInt(dep[2],10) : 1;
            const itemName = normalize(dep[3]);
            
            // NO HARCODED PRICE - fetch real price
            const price = await getItemPrice(itemName);
            if(price){
                const key = `id:${itemName}`;
                deposits[user] ??= {};
                deposits[user][key] ??= { count:0, price:0, last:t };
                
                // Apply correct deposit rate
                let depositRate = 0.90; // Standard 90%
                if(itemName.includes("xanax")) {
                    depositRate = 0.9375; // Xanax gets 93.75%
                }
                
                deposits[user][key].price = Math.round(price * depositRate);
                deposits[user][key].count += count;
                deposits[user][key].last = t;
            }
        }
        else if(use){
            const user = use[1].trim();
            const itemName = normalize(use[2]);
            
            // BEER IS 100% FREE - skip processing
            if(isFree(itemName)){ 
                processedLogs[logId]=true; 
                continue; 
            }

            const price = await getItemPrice(itemName);
            if(!price){ processedLogs[logId]=true; continue; }

            let charge = 0;
            if(isMedical(itemName)){
                if(!processMedicalUse(user, price, t)){ 
                    processedLogs[logId]=true; 
                    continue; 
                }
                charge = Math.round(price * 0.95033333);
            }
            else{
                charge = Math.round(price * 0.97);
            }

            const key = `id:${itemName}`;
            usedItems[user] ??= {};
            usedItems[user][key] ??= { count:0, price:0, last:t };
            usedItems[user][key].price = charge;
            usedItems[user][key].count++;
            usedItems[user][key].last = t;
        }

        processedLogs[logId] = true;
    }

    GM_setValue("usedItems", usedItems);
    GM_setValue("deposits", deposits);
    GM_setValue("processedLogs", processedLogs);
    renderPanel();
}

/* ---------- UI ---------- */
GM_addStyle(`
#armoryPanel{
    position:fixed;
    bottom:0;
    right:0;
    width:20%;
    height:70%;
    background:#fff;
    color:#000;
    font-family:monospace;
    border:1px solid #444;
    border-radius:8px 8px 0 0;
    padding:8px;
    overflow:auto;
    resize:both;
    display:none;
    z-index:9999;
}
.itemLine{
    font-size:8px;
    margin-left:8px;
}
.itemLine.used{
    color:red;
}
.itemLine.deposited{
    color:green;
}
.userBlock{
    margin-bottom:9px;
    border-bottom:1px dashed #ccc;
    padding-bottom:6px;
}
.userName{
    font-weight:bold;
    cursor:pointer;
}
.userLine{
    display:flex;
    justify-content:space-between;
    margin-top:4px;
}
.resetBtn{
    font-size:11px;
    cursor:pointer;
}
#bubbleBtn{
    position:fixed;
    bottom:20px;
    right:20px;
    width:36px;
    height:36px;
    background:#222;
    color:#fff;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    z-index:10000;
}
.itemLine:hover{
    text-decoration: underline;
    cursor: help;
}
`);

const panel = document.createElement("div");
panel.id = "armoryPanel";
panel.innerHTML = `
<b>HALO Armory V2</b>
<div style="font-size:10px;color:#666;">Faction logs: 3h interval</div>
<select id="sortUsers">
    <option value="debt">Sort: Debt</option>
    <option value="credit">Sort: Credit</option>
    <option value="alphabetical">Sort: A-Z</option>
</select>
<input type="password" id="factionKeyInput" placeholder="Faction API Key" value="${factionKey}">
<input type="password" id="marketKeyInput" placeholder="Market API Key" value="${marketKey}">
<div id="debtLog"></div>`;
document.body.appendChild(panel);

const bubble = document.createElement("div");
bubble.id = "bubbleBtn";
bubble.textContent = "⚕️";
document.body.appendChild(bubble);

let minimized = true;
bubble.onclick = ()=>{ minimized=!minimized; panel.style.display=minimized?"none":"block"; };

document.getElementById("factionKeyInput").onchange = e=>{
    factionKey = e.target.value.trim();
    GM_setValue("FACTION_API_KEY", factionKey);
    loadLogs();
};
document.getElementById("marketKeyInput").onchange = e=>{
    marketKey = e.target.value.trim();
    GM_setValue("MARKET_API_KEY", marketKey);
    loadLogs();
};

function renderItemList(obj, type){
    if(!obj) return "";
    return Object.entries(obj).map(([k,v])=>{
        const full = k.replace("id:","");
        const parts = full.split(" ");
        const short = parts[parts.length-1];
        const date = v.last ? formatTime(v.last) : "";
        return `<div class="itemLine ${type}" title="Full: ${full}, Unit Price: $${v.price}, Time: ${date}">• ${short} x ${v.count} (${date})</div>`;
    }).join("");
}

function renderPanel(){
    const div = document.getElementById("debtLog");
    div.innerHTML = "";
    let users = [...new Set([...Object.keys(usedItems), ...Object.keys(deposits)])];

    // Sorting
    const sort = document.getElementById("sortUsers")?.value;
    users.sort((a,b)=>{
        const netA = getNetValue(a), netB = getNetValue(b);
        if(sort==="debt") return netA - netB; // Most negative first
        if(sort==="credit") return netB - netA; // Most positive first
        return a.localeCompare(b);
    });

    users.forEach(u=>{
        const net = getNetValue(u);
        if(net===0) return;
        const b = document.createElement("div");
        b.className = "userBlock";
        b.innerHTML = `
<div class="userName">${u}</div>
<div class="userContent" style="display:none;">
${renderItemList(usedItems[u],"used")}
${renderItemList(deposits[u],"deposited")}
<div class="userLine" style="color:${net<0?'darkred':'darkgreen'}">
${net<0?'Debt':'Credit'}: $${Math.abs(net).toLocaleString()}
<button class="resetBtn">✓</button></div>
</div>`;
        const nameDiv = b.querySelector(".userName");
        const contentDiv = b.querySelector(".userContent");
        nameDiv.onclick = ()=>{ contentDiv.style.display = contentDiv.style.display==="none"?"block":"none"; };
        b.querySelector(".resetBtn").onclick = ()=>{
            delete usedItems[u];
            delete deposits[u];
            GM_setValue("usedItems", usedItems);
            GM_setValue("deposits", deposits);
            renderPanel();
        };
        div.appendChild(b);
    });
}

document.getElementById("sortUsers").onchange = renderPanel;

/* ---------- LOOP ---------- */
// Note: loadLogs() has internal 3-hour rate limiting
// This interval just checks periodically, won't spam API
setInterval(loadLogs, REFRESH_MS);
loadLogs();

})();