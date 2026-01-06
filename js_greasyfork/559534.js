// ==UserScript==
// @name         ✈️ Travel Points Maker (Inventory-Correct + Abroad Info) - Heavenly UI
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Correct Torn travel points tracker with heavenly clouds and rain animation
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559534/%E2%9C%88%EF%B8%8F%20Travel%20Points%20Maker%20%28Inventory-Correct%20%2B%20Abroad%20Info%29%20-%20Heavenly%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/559534/%E2%9C%88%EF%B8%8F%20Travel%20Points%20Maker%20%28Inventory-Correct%20%2B%20Abroad%20Info%29%20-%20Heavenly%20UI.meta.js
// ==/UserScript==

(function () {
'use strict';

/* ================= CONFIG ================= */
const PANEL_ID = 'travel_pts_heavenly';
const POLL = 45000;
const PRE_PTS=25, FLO_PTS=10, PLU_PTS=10, MET_PTS=15, FOS_PTS=20;
const YATA_URL='https://yata.yt/api/v1/travel/export/';
const PROM_URL='https://api.prombot.co.uk/api/travel';

/* ================= DATA ================= */
const GROUPS = {
 Prehistoric:{
  pts:PRE_PTS,
  items:{
   "Quartz Point":{s:"Quartz",loc:"CA 🇨🇦"},
   "Chalcedony Point":{s:"Chalcedony",loc:"AR 🇦🇷"},
   "Basalt Point":{s:"Basalt",loc:"HW 🏝️"},
   "Quartzite Point":{s:"Quartzite",loc:"SA 🇿🇦"},
   "Chert Point":{s:"Chert",loc:"UK 🇬🇧"},
   "Obsidian Point":{s:"Obsidian",loc:"MX 🇲🇽"}
  }
 },
 Flowers:{
  pts:FLO_PTS,
  items:{
   "Dahlia":{s:"Dahlia",loc:"MX 🇲🇽"},
   "Orchid":{s:"Orchid",loc:"HW 🏝️"},
   "African Violet":{s:"Violet",loc:"SA 🇿🇦"},
   "Cherry Blossom":{s:"Cherry",loc:"JP 🇯🇵"},
   "Peony":{s:"Peony",loc:"CN 🇨🇳"},
   "Ceibo Flower":{s:"Ceibo",loc:"AR 🇦🇷"},
   "Edelweiss":{s:"Edel",loc:"CH 🇨🇭"},
   "Crocus":{s:"Crocus",loc:"CA 🇨🇦"},
   "Heather":{s:"Heather",loc:"UK 🇬🇧"},
   "Tribulus Omanense":{s:"Tribulus",loc:"AE 🇦🇪"},
   "Banana Orchid":{s:"Banana",loc:"KY 🇰🇾"}
  }
 },
 Plushies:{
  pts:PLU_PTS,
  items:{
   "Sheep Plushie":{s:"Sheep",loc:"B.B"},
   "Teddy Bear Plushie":{s:"Teddy",loc:"B.B"},
   "Kitten Plushie":{s:"Kitten",loc:"B.B"},
   "Jaguar Plushie":{s:"Jaguar",loc:"MX 🇲🇽"},
   "Wolverine Plushie":{s:"Wolv",loc:"CA 🇨🇦"},
   "Nessie Plushie":{s:"Nessie",loc:"UK 🇬🇧"},
   "Red Fox Plushie":{s:"Fox",loc:"UK 🇬🇧"},
   "Monkey Plushie":{s:"Monkey",loc:"AR 🇦🇷"},
   "Chamois Plushie":{s:"Chamois",loc:"CH 🇨🇭"},
   "Panda Plushie":{s:"Panda",loc:"CN 🇨🇳"},
   "Lion Plushie":{s:"Lion",loc:"SA 🇿🇦"},
   "Camel Plushie":{s:"Camel",loc:"AE 🇦🇪"},
   "Stingray Plushie":{s:"Stingray",loc:"KY 🇰🇾"}
  }
 }
};

/* ================= HEAVENLY STYLE ================= */
GM_addStyle(`
/* Panel Container */
#${PANEL_ID}{
 position:fixed;top:84px;right:8px;width:260px;
 background: linear-gradient(135deg, #1a1f2e 0%, #0c1b2e 50%, #051324 100%);
 color:#e6f7ff;
 font:10.5px 'Segoe UI', system-ui, sans-serif;
 border:1px solid rgba(135, 206, 235, 0.3);
 border-radius:12px;
 z-index:999999;
 max-height:70vh;
 display:flex;
 flex-direction:column;
 box-shadow: 
  0 0 30px rgba(135, 206, 235, 0.2),
  0 0 60px rgba(70, 130, 180, 0.1),
  inset 0 1px 0 rgba(255,255,255,0.1);
 backdrop-filter: blur(5px);
 overflow:hidden;
}

/* Cloud animations container */
#${PANEL_ID}::before {
 content: '';
 position: absolute;
 top: -50px;
 left: -50px;
 right: -50px;
 bottom: -50px;
 background: 
   radial-gradient(circle at 20% 20%, rgba(255,255,255,0.05) 1px, transparent 1px),
   radial-gradient(circle at 80% 40%, rgba(255,255,255,0.04) 1px, transparent 1px),
   radial-gradient(circle at 40% 80%, rgba(255,255,255,0.03) 1px, transparent 1px);
 background-size: 100px 100px;
 animation: cloudFloat 60s infinite linear;
 pointer-events: none;
 z-index: 0;
}

@keyframes cloudFloat {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-100px, 100px); }
}

/* Rain animation */
#${PANEL_ID}::after {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background: 
   linear-gradient(180deg, 
     transparent 0%, 
     rgba(135, 206, 235, 0.1) 10%, 
     transparent 20%,
     rgba(135, 206, 235, 0.1) 30%,
     transparent 40%,
     rgba(135, 206, 235, 0.1) 50%,
     transparent 60%,
     rgba(135, 206, 235, 0.1) 70%,
     transparent 80%,
     rgba(135, 206, 235, 0.1) 90%,
     transparent 100%);
 background-size: 2px 100px;
 animation: rainFall 1s infinite linear;
 pointer-events: none;
 z-index: 0;
 opacity: 0.3;
}

@keyframes rainFall {
  0% { background-position: 0 0; }
  100% { background-position: 0 100px; }
}

/* Header with heavenly glow */
#${PANEL_ID} .h{
 padding:8px 12px;
 font-weight:700;
 cursor:pointer;
 background: linear-gradient(135deg, rgba(70, 130, 180, 0.4), rgba(135, 206, 235, 0.3));
 color: #ffffff;
 text-shadow: 0 0 10px rgba(135, 206, 235, 0.8);
 border-bottom:1px solid rgba(135, 206, 235, 0.2);
 display:flex;
 align-items:center;
 gap:8px;
 position:relative;
 z-index:1;
 transition: all 0.3s ease;
}

#${PANEL_ID} .h:hover {
 background: linear-gradient(135deg, rgba(100, 150, 200, 0.5), rgba(155, 226, 255, 0.4));
 text-shadow: 0 0 15px rgba(155, 226, 255, 1);
}

#${PANEL_ID} .h::before {
 content: '☁️';
 font-size: 14px;
 filter: drop-shadow(0 0 5px rgba(255,255,255,0.5));
}

/* Summary section */
#${PANEL_ID} .s{
 padding:6px 12px;
 background: rgba(20, 30, 48, 0.7);
 font-weight:700;
 color: #87ceeb;
 text-align:center;
 border-bottom:1px solid rgba(135, 206, 235, 0.2);
 position:relative;
 z-index:1;
 text-shadow: 0 0 5px rgba(135, 206, 235, 0.5);
}

/* Body container */
#${PANEL_ID} .b{
 overflow:auto;
 position:relative;
 z-index:1;
 background: rgba(10, 20, 35, 0.8);
}

/* Warning alerts */
#${PANEL_ID} .a{
 background: linear-gradient(135deg, rgba(255, 77, 77, 0.15), rgba(255, 100, 100, 0.1));
 border-left:3px solid #ff6b6b;
 margin:4px 8px;
 padding:4px 8px;
 font-weight:700;
 border-radius:6px;
 color: #ffcccc;
 text-shadow: 0 0 5px rgba(255, 100, 100, 0.5);
 position:relative;
 overflow:hidden;
}

#${PANEL_ID} .a::before {
 content: '⚠️';
 position: absolute;
 left: 4px;
 top: 50%;
 transform: translateY(-50%);
 opacity: 0.7;
}

/* Category titles */
#${PANEL_ID} .t{
 padding:6px 12px;
 background: linear-gradient(90deg, rgba(70, 130, 180, 0.2), transparent);
 color:#87cefa;
 font-weight:700;
 border-top:1px solid rgba(135, 206, 235, 0.1);
 border-bottom:1px solid rgba(135, 206, 235, 0.1);
 position:relative;
 text-shadow: 0 0 5px rgba(135, 206, 235, 0.5);
}

#${PANEL_ID} .t::after {
 content: '';
 position: absolute;
 right: 12px;
 top: 50%;
 transform: translateY(-50%);
 width: 16px;
 height: 16px;
 background: rgba(135, 206, 235, 0.1);
 border-radius: 50%;
}

/* Row styling */
#${PANEL_ID} .r{
 padding:3px 12px;
 line-height:1.2;
 display:flex;
 justify-content:space-between;
 align-items:center;
 transition: all 0.2s ease;
 position:relative;
}

#${PANEL_ID} .r:hover {
 background: rgba(135, 206, 235, 0.05);
}

#${PANEL_ID} .r:nth-child(even) {
 background: rgba(20, 40, 60, 0.3);
}

#${PANEL_ID} .r span{
 white-space:nowrap;
 padding:1px 4px;
 border-radius:3px;
}

/* Column specific styling */
#${PANEL_ID} .r span:nth-child(1) { /* Item name */
 color: #e6f7ff;
 font-weight:600;
 min-width:40px;
}

#${PANEL_ID} .r span:nth-child(2) { /* Inventory count */
 color: #90ee90;
 background: rgba(144, 238, 144, 0.1);
 padding:1px 6px;
 border-radius:4px;
 font-weight:700;
}

#${PANEL_ID} .r span:nth-child(3) { /* Abroad count */
 color: #ffb6c1;
 background: rgba(255, 182, 193, 0.1);
 padding:1px 6px;
 border-radius:4px;
}

#${PANEL_ID} .r span:nth-child(4) { /* Location */
 color: #87ceeb;
 font-weight:600;
}

/* Scrollbar styling */
#${PANEL_ID} .b::-webkit-scrollbar {
 width:6px;
}

#${PANEL_ID} .b::-webkit-scrollbar-track {
 background:rgba(20, 30, 48, 0.3);
 border-radius:3px;
}

#${PANEL_ID} .b::-webkit-scrollbar-thumb {
 background:linear-gradient(180deg, #4a90e2, #87ceeb);
 border-radius:3px;
}

#${PANEL_ID} .b::-webkit-scrollbar-thumb:hover {
 background:linear-gradient(180deg, #5ca0f2, #97deff);
}

/* Additional floating cloud elements */
#${PANEL_ID} .cloud {
 position: absolute;
 background: rgba(255, 255, 255, 0.05);
 border-radius: 50%;
 pointer-events: none;
 z-index: 0;
 animation: float 20s infinite linear;
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, 5px) rotate(90deg); }
  50% { transform: translate(0, 10px) rotate(180deg); }
  75% { transform: translate(-10px, 5px) rotate(270deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
}
`);

/* ================= PANEL CREATION ================= */
const panel = document.createElement('div');
panel.id = PANEL_ID;
panel.innerHTML = `
<div class="h">✈️ Travel Points - Heavenly Tracker</div>
<div class="s"></div>
<div class="b"></div>
`;

// Add floating clouds
const cloudCount = 3;
for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    const size = 20 + Math.random() * 40;
    cloud.style.width = `${size}px`;
    cloud.style.height = `${size}px`;
    cloud.style.top = `${20 + Math.random() * 60}%`;
    cloud.style.left = `${Math.random() * 100}%`;
    cloud.style.animationDelay = `${Math.random() * 20}s`;
    cloud.style.animationDuration = `${15 + Math.random() * 25}s`;
    panel.appendChild(cloud);
}

document.body.appendChild(panel);

const sum = panel.querySelector('.s');
const body = panel.querySelector('.b');
body.style.display = sum.style.display = 'none';

panel.querySelector('.h').onclick = () => {
    const isCollapsed = body.style.display === 'none';
    body.style.display = sum.style.display = isCollapsed ? 'block' : 'none';
    
    // Add subtle animation on toggle
    if (isCollapsed) {
        panel.style.animation = 'none';
        setTimeout(() => {
            panel.style.animation = 'cloudFloat 60s infinite linear';
        }, 10);
    }
};

/* ================= FETCH FUNCTIONS ================= */
async function localItems() {
    const key = GM_getValue('tornAPIKey');
    if (!key) return {};
    const response = await fetch(`https://api.torn.com/user/?selections=display,inventory&key=${key}`).then(r => r.json());
    const items = {};
    [...(response.display || []), ...(response.inventory || [])].forEach(item => {
        items[item.name] = (items[item.name] || 0) + item.quantity;
    });
    return items;
}

function gmJSON(url) {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: r => {
                try {
                    resolve(JSON.parse(r.responseText));
                } catch {
                    resolve({});
                }
            },
            onerror: () => resolve({})
        });
    });
}

async function abroadItems() {
    const [yataData, promData] = await Promise.all([
        gmJSON(YATA_URL),
        gmJSON(PROM_URL)
    ]);
    
    const abroadMap = {};
    
    // Process YATA data
    [yataData?.stocks, yataData].forEach(source => {
        Object.values(source || {}).forEach(country => {
            (country?.stocks || []).forEach(item => {
                abroadMap[item.name] = (abroadMap[item.name] || 0) + (item.quantity || item.qty || 0);
            });
        });
    });
    
    return abroadMap;
}

/* ================= CALCULATION LOGIC ================= */
function calcSet(inventory, items) {
    const values = Object.keys(items).map(key => inventory[key] || 0);
    const sets = values.length ? Math.min(...values) : 0;
    const remaining = {};
    Object.keys(items).forEach(key => {
        remaining[items[key].s] = (inventory[key] || 0) - sets;
    });
    return { sets, remaining };
}

function lowest(remaining, items) {
    const min = Math.min(...Object.values(remaining));
    const key = Object.keys(remaining).find(k => remaining[k] === min);
    const item = Object.values(items).find(i => i.s === key);
    return min >= 0 && item ? `Low ${key} → Fly ${item.loc}` : null;
}

/* ================= RENDER FUNCTION ================= */
async function render() {
    const inventory = await localItems();
    const abroad = await abroadItems();
    
    let totalSets = 0;
    let totalPoints = 0;
    let html = '';
    
    // Process each group
    for (const group of Object.values(GROUPS)) {
        const { sets, remaining } = calcSet(inventory, group.items);
        totalSets += sets;
        totalPoints += sets * group.pts;
        
        const warning = lowest(remaining, group.items);
        if (warning) {
            html += `<div class="a">${warning}</div>`;
        }
        
        // Add group title
        const firstItem = Object.keys(group.items)[0];
        const groupTitle = firstItem.includes('Plushie') ? 'Plushies' : firstItem.includes('Point') ? 'Prehistoric' : 'Flowers';
        html += `<div class="t">${groupTitle}</div>`;
        
        // Add items
        Object.entries(group.items).forEach(([name, data]) => {
            html += `
            <div class="r">
                <span>${data.s}</span>
                <span>${inventory[name] || 0}</span>
                <span>${abroad[name] || 0}</span>
                <span>${data.loc}</span>
            </div>`;
        });
    }
    
    // Add meteorite and fossil
    const meteorite = inventory["Meteorite Fragment"] || 0;
    const fossil = inventory["Patagonian Fossil"] || 0;
    totalPoints += meteorite * MET_PTS + fossil * FOS_PTS;
    
    html += `
    <div class="t">Meteorite</div>
    <div class="r">
        <span>Meteor</span>
        <span>${meteorite}</span>
        <span>${abroad["Meteorite Fragment"] || 0}</span>
        <span>AR 🇦🇷</span>
    </div>
    <div class="t">Fossil</div>
    <div class="r">
        <span>Fossil</span>
        <span>${fossil}</span>
        <span>${abroad["Patagonian Fossil"] || 0}</span>
        <span>AR 🇦🇷</span>
    </div>`;
    
    // Update display
    sum.textContent = `☁️ Sets: ${totalSets} • ${totalPoints} pts ✨`;
    body.innerHTML = html;
    
    // Add subtle color pulse to summary on update
    sum.style.animation = 'none';
    setTimeout(() => {
        sum.style.animation = 'pulse 2s ease';
    }, 10);
}

/* ================= MAIN LOOP ================= */
(async function mainLoop() {
    await render();
    setTimeout(mainLoop, POLL);
})();
})();