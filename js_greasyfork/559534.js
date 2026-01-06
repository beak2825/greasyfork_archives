// ==UserScript==
// @name         ✈️ Travel Points Maker (Halo Armory Style)
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Halo armory style travel points tracker with plane emoji toggle
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559534/%E2%9C%88%EF%B8%8F%20Travel%20Points%20Maker%20%28Halo%20Armory%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559534/%E2%9C%88%EF%B8%8F%20Travel%20Points%20Maker%20%28Halo%20Armory%20Style%29.meta.js
// ==/UserScript==

(function () {
'use strict';

/* ================= CONFIG ================= */
const PANEL_ID = 'travel_pts_halo';
const TOGGLE_ID = 'travel_toggle';
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

/* ================= HALO ARMORY STYLE ================= */
GM_addStyle(`
/* Toggle Button */
#${TOGGLE_ID} {
 position: fixed;
 right: 8px;
 top: 84px;
 width: 40px;
 height: 40px;
 background: linear-gradient(135deg, #1a1f2e 0%, #0c1b2e 100%);
 border: 1px solid rgba(135, 206, 235, 0.4);
 border-radius: 6px;
 color: #87ceeb;
 font-size: 22px;
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 z-index: 1000000;
 box-shadow: 
  0 2px 10px rgba(0, 0, 0, 0.5),
  0 0 20px rgba(70, 130, 180, 0.3);
 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 user-select: none;
 backdrop-filter: blur(5px);
}

#${TOGGLE_ID}:hover {
 background: linear-gradient(135deg, #2a2f3e 0%, #1c2b3e 100%);
 border-color: rgba(155, 226, 255, 0.6);
 color: #a7deff;
 box-shadow: 
  0 4px 15px rgba(0, 0, 0, 0.6),
  0 0 30px rgba(100, 150, 255, 0.4);
 transform: scale(1.05);
}

#${TOGGLE_ID}:active {
 transform: scale(0.95);
 transition: transform 0.1s;
}

/* Panel Container - Halo Armory Style */
#${PANEL_ID} {
 position: fixed;
 right: 8px;
 top: 84px;
 width: 0;
 height: 70vh;
 background: linear-gradient(135deg, rgba(10, 15, 25, 0.98) 0%, rgba(5, 10, 20, 0.95) 100%);
 color: #e6f7ff;
 font: 10.5px 'Segoe UI', system-ui, sans-serif;
 border: 1px solid rgba(135, 206, 235, 0.3);
 border-radius: 12px 0 0 12px;
 z-index: 999999;
 max-height: 70vh;
 display: flex;
 flex-direction: column;
 box-shadow: 
  inset 0 0 50px rgba(70, 130, 180, 0.1),
  0 0 40px rgba(0, 0, 0, 0.7);
 backdrop-filter: blur(10px);
 overflow: hidden;
 transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
 opacity: 0;
 border-right: none;
}

#${PANEL_ID}.open {
 width: 280px;
 opacity: 1;
 border-right: 1px solid rgba(135, 206, 235, 0.3);
 border-radius: 12px;
}

/* Panel interior with tech grid background */
#${PANEL_ID}::before {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background-image: 
   linear-gradient(rgba(70, 130, 180, 0.05) 1px, transparent 1px),
   linear-gradient(90deg, rgba(70, 130, 180, 0.05) 1px, transparent 1px);
 background-size: 20px 20px;
 mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
 z-index: 0;
}

/* Glowing edge effect */
#${PANEL_ID}::after {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 border: 1px solid transparent;
 border-image: linear-gradient(45deg, #87ceeb, #4682b4, #87ceeb) 1;
 border-radius: 12px;
 box-shadow: 
  0 0 30px rgba(70, 130, 180, 0.3),
  inset 0 0 30px rgba(70, 130, 180, 0.1);
 pointer-events: none;
 z-index: 1;
}

/* Header */
#${PANEL_ID} .h {
 padding: 10px 14px;
 font-weight: 700;
 background: linear-gradient(90deg, rgba(70, 130, 180, 0.4), rgba(135, 206, 235, 0.2));
 color: #ffffff;
 text-shadow: 0 0 10px rgba(135, 206, 235, 0.8);
 border-bottom: 1px solid rgba(135, 206, 235, 0.3);
 display: flex;
 align-items: center;
 gap: 8px;
 position: relative;
 z-index: 2;
 font-size: 11px;
 letter-spacing: 0.5px;
}

#${PANEL_ID} .h::before {
 content: '✈️';
 font-size: 14px;
 filter: drop-shadow(0 0 3px rgba(135, 206, 235, 0.8));
}

/* Summary section */
#${PANEL_ID} .s {
 padding: 8px 14px;
 background: rgba(20, 30, 48, 0.8);
 font-weight: 700;
 color: #87ceeb;
 text-align: center;
 border-bottom: 1px solid rgba(135, 206, 235, 0.2);
 position: relative;
 z-index: 2;
 text-shadow: 0 0 5px rgba(135, 206, 235, 0.5);
 font-size: 11px;
 backdrop-filter: blur(5px);
}

/* Body container */
#${PANEL_ID} .b {
 overflow: auto;
 position: relative;
 z-index: 2;
 background: rgba(10, 15, 25, 0.7);
 flex: 1;
 scrollbar-width: thin;
 scrollbar-color: #4682b4 rgba(20, 30, 48, 0.3);
}

/* Scrollbar styling */
#${PANEL_ID} .b::-webkit-scrollbar {
 width: 6px;
}

#${PANEL_ID} .b::-webkit-scrollbar-track {
 background: rgba(20, 30, 48, 0.3);
 border-radius: 3px;
}

#${PANEL_ID} .b::-webkit-scrollbar-thumb {
 background: linear-gradient(180deg, #4a90e2, #87ceeb);
 border-radius: 3px;
}

#${PANEL_ID} .b::-webkit-scrollbar-thumb:hover {
 background: linear-gradient(180deg, #5ca0f2, #97deff);
}

/* Warning alerts */
#${PANEL_ID} .a {
 background: linear-gradient(90deg, rgba(255, 77, 77, 0.15), rgba(255, 100, 100, 0.1));
 border-left: 3px solid #ff6b6b;
 margin: 6px 10px;
 padding: 6px 10px;
 font-weight: 700;
 border-radius: 4px;
 color: #ffcccc;
 text-shadow: 0 0 5px rgba(255, 100, 100, 0.5);
 position: relative;
 overflow: hidden;
 font-size: 10px;
}

#${PANEL_ID} .a::before {
 content: '⚠️';
 position: absolute;
 left: 6px;
 top: 50%;
 transform: translateY(-50%);
 opacity: 0.8;
}

/* Category titles */
#${PANEL_ID} .t {
 padding: 8px 14px;
 background: linear-gradient(90deg, rgba(70, 130, 180, 0.3), transparent);
 color: #87cefa;
 font-weight: 700;
 border-top: 1px solid rgba(135, 206, 235, 0.2);
 border-bottom: 1px solid rgba(135, 206, 235, 0.1);
 position: relative;
 text-shadow: 0 0 5px rgba(135, 206, 235, 0.5);
 font-size: 10.5px;
 letter-spacing: 0.3px;
}

#${PANEL_ID} .t::after {
 content: '';
 position: absolute;
 right: 14px;
 top: 50%;
 transform: translateY(-50%);
 width: 12px;
 height: 12px;
 background: rgba(135, 206, 235, 0.1);
 border-radius: 2px;
}

/* Row styling */
#${PANEL_ID} .r {
 padding: 6px 14px;
 line-height: 1.3;
 display: flex;
 justify-content: space-between;
 align-items: center;
 transition: all 0.2s ease;
 position: relative;
 font-size: 10.5px;
}

#${PANEL_ID} .r:hover {
 background: rgba(135, 206, 235, 0.08);
}

#${PANEL_ID} .r:nth-child(even) {
 background: rgba(20, 40, 60, 0.2);
}

#${PANEL_ID} .r span {
 white-space: nowrap;
 padding: 2px 6px;
 border-radius: 3px;
}

/* Column specific styling */
#${PANEL_ID} .r span:nth-child(1) {
 color: #e6f7ff;
 font-weight: 600;
 min-width: 45px;
}

#${PANEL_ID} .r span:nth-child(2) {
 color: #90ee90;
 background: rgba(144, 238, 144, 0.12);
 padding: 2px 8px;
 border-radius: 4px;
 font-weight: 700;
 font-family: 'Consolas', monospace;
}

#${PANEL_ID} .r span:nth-child(3) {
 color: #ffb6c1;
 background: rgba(255, 182, 193, 0.12);
 padding: 2px 8px;
 border-radius: 4px;
 font-family: 'Consolas', monospace;
}

#${PANEL_ID} .r span:nth-child(4) {
 color: #87ceeb;
 font-weight: 600;
 font-size: 10px;
}

/* Scroll synchronization */
.scrolling {
 transition: transform 0.2s ease-out !important;
}
`);

/* ================= CREATE ELEMENTS ================= */
// Create toggle button
const toggle = document.createElement('div');
toggle.id = TOGGLE_ID;
toggle.innerHTML = '✈️';
toggle.title = 'Travel Points Tracker';

// Create panel
const panel = document.createElement('div');
panel.id = PANEL_ID;
panel.innerHTML = `
<div class="h">✈️ TRAVEL POINTS TRACKER</div>
<div class="s"></div>
<div class="b"></div>
`;

// Add to page
document.body.appendChild(toggle);
document.body.appendChild(panel);

const sum = panel.querySelector('.s');
const body = panel.querySelector('.b');
let isPanelOpen = false;

/* ================= TOGGLE FUNCTIONALITY ================= */
toggle.onclick = () => {
    isPanelOpen = !isPanelOpen;
    panel.classList.toggle('open', isPanelOpen);
    
    // Animate toggle button
    toggle.style.transform = isPanelOpen ? 'translateX(-272px)' : 'translateX(0)';
    
    // Update toggle title
    toggle.title = isPanelOpen ? 'Close Travel Tracker' : 'Open Travel Tracker';
};

/* ================= SCROLL SYNC FUNCTIONALITY ================= */
let lastScrollY = window.scrollY;
let isScrolling = false;
let scrollTimer;

function handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    // Add scrolling class for smooth transition
    if (!isScrolling) {
        toggle.classList.add('scrolling');
        panel.classList.add('scrolling');
        isScrolling = true;
    }
    
    // Clear existing timer
    clearTimeout(scrollTimer);
    
    // Update position based on scroll direction
    const newTop = 84 + scrollDelta;
    toggle.style.top = `${Math.max(8, Math.min(newTop, window.innerHeight - 48))}px`;
    panel.style.top = `${Math.max(8, Math.min(newTop, window.innerHeight - 48))}px`;
    
    // Update last scroll position
    lastScrollY = currentScrollY;
    
    // Remove scrolling class after settling
    scrollTimer = setTimeout(() => {
        toggle.classList.remove('scrolling');
        panel.classList.remove('scrolling');
        isScrolling = false;
    }, 200);
}

// Throttle scroll events for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null;
    }, 16); // ~60fps
});

// Initial position update
handleScroll();

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
        const groupTitle = firstItem.includes('Plushie') ? 'PLUSHIES' : firstItem.includes('Point') ? 'PREHISTORIC' : 'FLOWERS';
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
    <div class="t">METEORITE</div>
    <div class="r">
        <span>Meteor</span>
        <span>${meteorite}</span>
        <span>${abroad["Meteorite Fragment"] || 0}</span>
        <span>AR 🇦🇷</span>
    </div>
    <div class="t">FOSSIL</div>
    <div class="r">
        <span>Fossil</span>
        <span>${fossil}</span>
        <span>${abroad["Patagonian Fossil"] || 0}</span>
        <span>AR 🇦🇷</span>
    </div>`;
    
    // Update display
    sum.textContent = `✈️ SETS: ${totalSets} • ${totalPoints} PTS`;
    body.innerHTML = html;
    
    // Add subtle animation to summary
    sum.style.animation = 'none';
    setTimeout(() => {
        sum.style.animation = 'pulse 1s ease';
    }, 10);
}

/* ================= MAIN LOOP ================= */
(async function mainLoop() {
    await render();
    setTimeout(mainLoop, POLL);
})();
})();