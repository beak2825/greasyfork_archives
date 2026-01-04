// ==UserScript==
// @name         HALO Armory Tracker Pro (Alien UI)
// @namespace    http://tampermonkey.net/
// @version      HALO.3
// @description  Faction armory tracker with futuristic alien UI
// @author       Nova
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/560935/HALO%20Armory%20Tracker%20Pro%20%28Alien%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560935/HALO%20Armory%20Tracker%20Pro%20%28Alien%20UI%29.meta.js
// ==/UserScript==

(function(){
"use strict";

/* ---------- CONFIG ---------- */
const factionIds = ["48418"];
const REFRESH_MS = 45000;

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

/* ---------- STORAGE ---------- */
let factionKey = GM_getValue("FACTION_API_KEY","");
let marketKey  = GM_getValue("MARKET_API_KEY","");

let usedItems     = GM_getValue("usedItems", {});
let deposits      = GM_getValue("deposits", {});
let processedLogs = GM_getValue("processedLogs", {});
let medWindows    = GM_getValue("medWindows", {});
let beerWindows   = GM_getValue("beerWindows", {});

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

/* ---------- MARKET ---------- */
let itemsMapCache = null;
let nameToIdCache = {};

async function fetchAllItems(){
    if(itemsMapCache) return itemsMapCache;
    if(!marketKey) return {};
    const r = await fetch(`https://api.torn.com/v2/torn/items?cat=All&sort=ASC&key=${marketKey}`);
    const d = await r.json();
    itemsMapCache = d.items || {};
    Object.values(itemsMapCache).forEach(it=>{
        nameToIdCache[normalize(it.name)] = it.id;
    });
    return itemsMapCache;
}

async function resolvePriceForName(rawName){
    const norm = normalize(rawName);
    await fetchAllItems();
    let id = nameToIdCache[norm];
    if(!id){
        for(const it of Object.values(itemsMapCache||{})){
            const n = normalize(it.name);
            if(n===norm || n.includes(norm) || norm.includes(n)){
                id = it.id;
                break;
            }
        }
    }
    if(!id) return null;
    const r = await fetch(`https://api.torn.com/v2/market/${id}/itemmarket?key=${marketKey}`);
    const d = await r.json();
    const listings = d?.itemmarket?.listings || [];
    if(!listings.length) return null;
    listings.sort((a,b)=> (a.price||a.cost||0)-(b.price||b.cost||0));
    return Math.round(listings[0].price || listings[0].cost);
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

/* ---------- FETCH LOGS ---------- */
async function fetchFactionLogs(id){
    const r = await fetch(`https://api.torn.com/faction/${id}?selections=armorynews&key=${factionKey}`);
    const d = await r.json();
    return d.armorynews || {};
}

/* ---------- CORE ---------- */
async function loadLogs(){
    if(!factionKey || !marketKey) return;

    let logs = {};
    for(const id of factionIds){
        Object.assign(logs, await fetchFactionLogs(id));
    }

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
        const filled = text.match(/^(.+?) filled one of the faction's (.+?) items?\.?$/i);

        if(dep){
            const user = dep[1].trim();
            const count = dep[2] ? parseInt(dep[2],10) : 1;
            const itemName = normalize(dep[3]);
            
            if(isFillingBloodBag(text, itemName)){
                const key = `id:blood_bag_fill`;
                deposits[user] ??= {};
                deposits[user][key] ??= { 
                    count:0, 
                    price:BLOOD_BAG_FILL_CREDIT, 
                    last:t,
                    fullName: "Blood Bag Fill"
                };
                deposits[user][key].count += count;
                deposits[user][key].last = t;
            } else {
                let price = await resolvePriceForName(itemName);
                if(price){
                    const depositRate = isXanax(itemName) ? XANAX_DEPOSIT_RATE : STANDARD_DEPOSIT_RATE;
                    const creditedPrice = Math.round(price * depositRate);
                    const key = `id:${itemName}`;
                    deposits[user] ??= {};
                    deposits[user][key] ??= { 
                        count:0, 
                        price:creditedPrice, 
                        last:t,
                        fullName: itemName
                    };
                    deposits[user][key].count += count;
                    deposits[user][key].last = t;
                }
            }
        }
        else if(use){
            const user = use[1].trim();
            const itemName = normalize(use[2]);
            
            if(isFree(itemName)){
                processedLogs[logId]=true; 
                continue;
            }

            const price = await resolvePriceForName(itemName);
            if(!price){ 
                processedLogs[logId]=true; 
                continue;
            }

            let charge = 0;
            let isMedicalExcess = false;
            
            if(isMedical(itemName)){
                if(processMedicalUse(user, price, t)){
                    isMedicalExcess = true;
                    charge = Math.round(price * MEDICAL_EXCESS_RATE);
                } else {
                    processedLogs[logId]=true;
                    continue;
                }
            }
            else{
                charge = Math.round(price * STANDARD_USE_RATE);
            }

            const key = `id:${itemName}`;
            usedItems[user] ??= {};
            usedItems[user][key] ??= { 
                count:0, 
                price:charge, 
                last:t,
                fullName: itemName,
                isMedicalExcess: isMedicalExcess
            };
            usedItems[user][key].count++;
            usedItems[user][key].last = t;
        }
        else if(filled){
            const user = filled[1].trim();
            const itemName = normalize(filled[2]);
            
            if(isFillingBloodBag(text, itemName)){
                const key = `id:blood_bag_fill`;
                deposits[user] ??= {};
                deposits[user][key] ??= { 
                    count:0, 
                    price:BLOOD_BAG_FILL_CREDIT, 
                    last:t,
                    fullName: "Blood Bag Fill"
                };
                deposits[user][key].count++;
                deposits[user][key].last = t;
            }
        }

        processedLogs[logId] = true;
    }

    GM_setValue("usedItems", usedItems);
    GM_setValue("deposits", deposits);
    GM_setValue("processedLogs", processedLogs);
    renderPanel();
}

/* ---------- FUTURISTIC ALIEN UI ---------- */
GM_addStyle(`
/* Main Panel */
#armoryPanel {
    position: fixed;
    bottom: 0;
    right: 15px;
    width: 320px;
    height: 85vh;
    background: 
        radial-gradient(circle at 20% 80%, rgba(0, 40, 60, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(60, 0, 80, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, rgba(5, 5, 15, 0.95) 0%, rgba(15, 5, 25, 0.95) 100%);
    color: #00ffea;
    font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
    border-radius: 12px 12px 0 0;
    padding: 0;
    overflow: hidden;
    box-shadow: 
        0 0 40px rgba(0, 255, 234, 0.4),
        0 0 80px rgba(138, 43, 226, 0.3),
        inset 0 0 30px rgba(0, 255, 234, 0.15);
    display: none;
    z-index: 9999;
    border: 2px solid rgba(0, 255, 234, 0.4);
    border-bottom: none;
    backdrop-filter: blur(10px);
    font-size: 11px;
}

/* Hologram effect border */
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
    border-radius: 14px;
    z-index: -1;
    animation: hologram 3s linear infinite;
    opacity: 0.8;
}

@keyframes hologram {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

/* Panel Header */
.panel-header {
    background: linear-gradient(90deg, 
        rgba(10, 20, 30, 0.9) 0%, 
        rgba(30, 10, 40, 0.9) 100%);
    padding: 15px 20px;
    border-bottom: 1px solid rgba(0, 255, 234, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    backdrop-filter: blur(5px);
}

/* Header scan line */
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
    font-size: 16px;
    font-weight: 700;
    color: #00ffea;
    display: flex;
    align-items: center;
    gap: 10px;
    text-shadow: 
        0 0 10px rgba(0, 255, 234, 0.7),
        0 0 20px rgba(0, 255, 234, 0.3);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: 'Orbitron', 'Courier New', monospace;
}

/* Alien icon with glow */
.panel-header h1:before {
    content: "🛸";
    font-size: 20px;
    filter: drop-shadow(0 0 8px #00ffea);
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-3px) rotate(5deg); }
}

/* Header buttons */
.header-controls {
    display: flex;
    gap: 8px;
}

.header-btn {
    background: rgba(0, 255, 234, 0.15);
    border: 1px solid rgba(0, 255, 234, 0.4);
    color: #00ffea;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-shadow: 0 0 8px rgba(0, 255, 234, 0.7);
    position: relative;
    overflow: hidden;
}

.header-btn:hover {
    background: rgba(0, 255, 234, 0.3);
    transform: scale(1.15);
    box-shadow: 
        0 0 20px rgba(0, 255, 234, 0.6),
        0 0 40px rgba(0, 255, 234, 0.3);
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

/* Panel Content */
.panel-content {
    padding: 15px;
    height: calc(100% - 50px);
    overflow-y: auto;
    background: rgba(0, 5, 10, 0.7);
}

/* Stats Panel */
.stats-slim {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
    background: rgba(0, 255, 234, 0.08);
    border-radius: 10px;
    padding: 15px;
    border: 1px solid rgba(0, 255, 234, 0.3);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(5px);
}

/* Scanning effect */
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

/* Individual Stats */
.stat-slim {
    text-align: center;
    position: relative;
    z-index: 1;
}

.stat-slim-number {
    font-size: 18px;
    font-weight: 800;
    color: #00ffea;
    text-shadow: 
        0 0 10px rgba(0, 255, 234, 0.8),
        0 0 20px rgba(0, 255, 234, 0.4);
    font-family: 'Orbitron', monospace;
    letter-spacing: 1px;
    margin-bottom: 3px;
}

.stat-slim-label {
    font-size: 9px;
    color: #8af5ff;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 2px;
    opacity: 0.8;
    font-weight: 600;
}

/* API Toggle */
.api-toggle {
    background: rgba(0, 255, 234, 0.1);
    border: 1px solid rgba(0, 255, 234, 0.3);
    border-radius: 8px;
    padding: 10px 15px;
    margin-bottom: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    color: #00ffea;
    text-transform: uppercase;
    letter-spacing: 1px;
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
    font-size: 10px;
    transition: transform 0.3s ease;
}

.api-toggle.expanded::after {
    transform: rotate(180deg);
}

/* API Fields */
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
    border-radius: 6px;
    padding: 10px 12px;
    color: #00ffea;
    font-size: 11px;
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
        0 0 15px rgba(0, 255, 234, 0.5),
        inset 0 0 10px rgba(0, 255, 234, 0.1);
}

/* Sort Select */
.sort-select-slim {
    background: rgba(0, 10, 20, 0.8);
    border: 1px solid rgba(0, 255, 234, 0.4);
    border-radius: 6px;
    padding: 10px 35px 10px 12px;
    color: #00ffea;
    font-size: 11px;
    width: 100%;
    margin-bottom: 15px;
    cursor: pointer;
    appearance: none;
    font-family: 'Courier New', monospace;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2300ffea' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px;
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
        0 0 15px rgba(0, 255, 234, 0.5),
        inset 0 0 10px rgba(0, 255, 234, 0.1);
}

/* Users Container */
.users-slim {
    background: rgba(0, 5, 10, 0.5);
    border-radius: 8px;
    padding: 5px;
    border: 1px solid rgba(0, 255, 234, 0.2);
}

/* Individual User Card */
.user-slim {
    background: linear-gradient(135deg, 
        rgba(0, 20, 40, 0.7) 0%, 
        rgba(20, 0, 40, 0.7) 100%);
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 8px;
    border: 1px solid rgba(0, 255, 234, 0.2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.user-slim:hover {
    border-color: rgba(0, 255, 234, 0.4);
    box-shadow: 0 0 15px rgba(0, 255, 234, 0.2);
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

/* User Header */
.user-header-slim {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 2px 0;
}

.user-name-slim {
    font-size: 12px;
    font-weight: 600;
    color: #8af5ff;
    max-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-shadow: 0 0 5px rgba(138, 245, 255, 0.5);
    font-family: 'Orbitron', monospace;
    letter-spacing: 0.5px;
}

/* Balance Display */
.user-balance-slim {
    font-size: 12px;
    font-weight: 700;
    padding: 5px 10px;
    border-radius: 4px;
    min-width: 70px;
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
    text-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.balance-positive-slim:hover {
    background: linear-gradient(135deg, 
        rgba(16, 185, 129, 0.3) 0%, 
        rgba(16, 185, 129, 0.2) 100%);
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
}

.balance-negative-slim {
    background: linear-gradient(135deg, 
        rgba(255, 65, 108, 0.2) 0%, 
        rgba(255, 65, 108, 0.1) 100%);
    color: #ff416c;
    border: 1px solid rgba(255, 65, 108, 0.4);
    text-shadow: 0 0 8px rgba(255, 65, 108, 0.5);
}

.balance-negative-slim:hover {
    background: linear-gradient(135deg, 
        rgba(255, 65, 108, 0.3) 0%, 
        rgba(255, 65, 108, 0.2) 100%);
    box-shadow: 0 0 15px rgba(255, 65, 108, 0.3);
}

/* User Details */
.user-details-slim {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(0, 255, 234, 0.2);
    display: none;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Items Container */
.items-slim {
    margin-bottom: 10px;
}

/* Item Row */
.item-row-slim {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    background: rgba(0, 10, 20, 0.6);
    border-radius: 4px;
    margin-bottom: 5px;
    font-size: 10px;
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
    gap: 8px;
}

.item-name-slim {
    color: #b8f5ff;
    max-width: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
    text-shadow: 0 0 3px rgba(184, 245, 255, 0.5);
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
    text-shadow: 0 0 5px rgba(16, 245, 201, 0.5);
}

.item-used-slim .item-price-slim {
    color: #ff416c;
    text-shadow: 0 0 5px rgba(255, 65, 108, 0.5);
}

.item-time-slim {
    color: #8af5ff;
    font-size: 9px;
    margin-left: 5px;
    min-width: 50px;
    text-align: right;
    opacity: 0.8;
    font-family: 'Courier New', monospace;
}

/* More Items Indicator */
.more-items {
    font-size: 9px;
    color: #8af5ff;
    text-align: center;
    padding: 5px;
    font-style: italic;
    opacity: 0.7;
    border-top: 1px dashed rgba(0, 255, 234, 0.2);
    margin-top: 5px;
}

/* User Actions */
.user-actions-slim {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.action-btn-slim {
    background: linear-gradient(135deg, 
        #ff416c 0%, 
        #ff4b2b 100%);
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 10px;
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
    font-size: 10px;
    margin-right: 4px;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.action-btn-slim:hover {
    transform: scale(1.05);
    box-shadow: 
        0 0 20px rgba(255, 65, 108, 0.6),
        0 0 40px rgba(255, 65, 108, 0.3);
}

/* Empty State */
.empty-state-slim {
    text-align: center;
    padding: 30px 15px;
    color: rgba(138, 245, 255, 0.6);
    font-size: 11px;
    font-family: 'Orbitron', monospace;
}

.empty-state-slim:before {
    content: "🛰️";
    font-size: 32px;
    display: block;
    margin-bottom: 10px;
    opacity: 0.7;
    filter: drop-shadow(0 0 8px rgba(0, 255, 234, 0.5));
    animation: spin 10s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Bubble Button */
#bubbleBtn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
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
    font-size: 24px;
    box-shadow: 
        0 0 30px rgba(0, 255, 234, 0.5),
        0 0 60px rgba(138, 43, 226, 0.3);
    border: 2px solid rgba(0, 255, 234, 0.5);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: floatBtn 3s ease-in-out infinite;
}

@keyframes floatBtn {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(10deg); }
}

#bubbleBtn:hover {
    transform: scale(1.2) rotate(20deg);
    box-shadow: 
        0 0 50px rgba(0, 255, 234, 0.8),
        0 0 100px rgba(138, 43, 226, 0.5);
}

#bubbleBtn:before {
    content: "👽";
    filter: drop-shadow(0 0 10px #00ffea);
}

/* Scrollbar Styling */
.panel-content::-webkit-scrollbar {
    width: 6px;
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

.panel-content::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, 
        rgba(0, 255, 234, 0.7) 0%, 
        rgba(138, 43, 226, 0.7) 100%);
}

/* Loading Animation */
@keyframes loading {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading {
    position: relative;
}

.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid rgba(0, 255, 234, 0.3);
    border-top-color: #00ffea;
    border-radius: 50%;
    animation: loading 1s linear infinite;
}
`);

/* ---------- UI CREATION ---------- */
const panel = document.createElement("div");
panel.id = "armoryPanel";
panel.innerHTML = `
<div class="panel-header">
    <h1>HALO ARMORY</h1>
    <div class="header-controls">
        <button class="header-btn" id="refreshBtn" title="Refresh">⟳</button>
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
    </div>

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
};

document.getElementById("closeBtn").onclick = () => {
    panel.style.display = "none";
    minimized = true;
};

document.getElementById("refreshBtn").onclick = () => {
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

// Auto-show panel if no API keys are set
if (!factionKey || !marketKey) {
    panel.style.display = "block";
    minimized = false;
    apiExpanded = true;
    document.getElementById("apiToggle").classList.add("expanded");
    document.getElementById("apiFields").style.display = "block";
}

/* ---------- FIXED: Better Sorting ---------- */
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

/* ---------- Statistics ---------- */
function updateStats() {
    const activeUsers = [...new Set([...Object.keys(usedItems), ...Object.keys(deposits)])].filter(u => getNetValue(u) !== 0).length;
    const totalProcessed = Object.keys(processedLogs).length;
    const cachedPrices = Object.keys(nameToIdCache).length;
    
    document.getElementById("statUsers").textContent = activeUsers;
    document.getElementById("statLogs").textContent = totalProcessed;
    document.getElementById("statCache").textContent = cachedPrices;
}

/* ---------- RENDER FUNCTIONS ---------- */
const MAX_ITEM_DISPLAY = 3;

function renderItemListCompact(items, isUsed = false) {
    if (!items || Object.keys(items).length === 0) {
        return '<div class="empty-state-slim" style="font-size: 10px; padding: 8px;">NO ITEMS</div>';
    }
    
    const entries = Object.entries(items);
    const displayEntries = entries.slice(0, MAX_ITEM_DISPLAY);
    const hiddenCount = entries.length - MAX_ITEM_DISPLAY;
    
    let html = displayEntries.map(([k, v]) => {
        const shortName = v.fullName ? v.fullName.split(' ').pop() : k.replace('id:', '');
        const timeDate = v.last ? formatTimeDate(v.last) : "";
        
        return `
            <div class="item-row-slim ${isUsed ? 'item-used-slim' : ''}">
                <div class="item-info-slim">
                    <span class="item-name-slim" title="${v.fullName || k}">${shortName}</span>
                    <span class="item-count-slim">x${v.count}</span>
                    <span class="item-price-slim">$${v.price.toLocaleString()}</span>
                </div>
                <div class="item-time-slim">${timeDate}</div>
            </div>
        `;
    }).join("");
    
    if (hiddenCount > 0) {
        html += `<div class="more-items">+${hiddenCount} MORE ITEMS</div>`;
    }
    
    return html;
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

/* ---------- INITIALIZATION ---------- */
document.getElementById("sortUsers").onchange = renderPanel;

/* ---------- MAIN LOOP ---------- */
setInterval(loadLogs, REFRESH_MS);
loadLogs();

})();