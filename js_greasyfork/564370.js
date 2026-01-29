// ==UserScript==
// @name         Hasoth's disable for sell
// @namespace    torn.shop.manager
// @version      1.3.3
// @description  Shop Manager that will disable selected items for sell in shops/market/bazar
// @author       Hasoth [4042954]
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @require      https://www.torn.com/js/script/lib/jquery-1.8.2.js
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/564370/Hasoth%27s%20disable%20for%20sell.user.js
// @updateURL https://update.greasyfork.org/scripts/564370/Hasoth%27s%20disable%20for%20sell.meta.js
// ==/UserScript==

(function() {
'use strict';

/* ================= STATE & SETTINGS ================= */
let WidgetPos = localStorage.getItem('tsm-widget-pos') || '3'; // Default Top-Right
let CustomPos = JSON.parse(localStorage.getItem('tsm-widget-custom') || '{"top": "20%", "left": "80%"}');

let TORN_API_KEY = GM_getValue('tsm_apikey', '');
let EXCLUDED_ITEMS = JSON.parse(GM_getValue('tsm_excluded', '[]'));
let ITEMS_CACHE = JSON.parse(GM_getValue('tsm_items_cache', 'null'));

/* ================= ENVIRONMENT DETECTION ================= */
function detectEnvironment() {
    const ua = navigator.userAgent.toLowerCase();
    const isMobileWidth = window.innerWidth <= 768;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (/tornpda|dart|flutter/i.test(ua)) return 'pda';
    if (isMobileWidth && hasTouch) return 'mobile';
    return 'desktop';
}

const ENV = detectEnvironment();
const isMobile = ENV === 'mobile' || ENV === 'pda';

/* ================= ICONS ================= */
const gear_icon_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#888"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.04.64.09.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`;
const cart_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#555"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>`;

/* ================= CORE LOGIC: SCANNER ================= */
function isRelevantPage() {
    const url = window.location.href.toLowerCase();
    const keywords = ['bazaar', 'bazar', 'market', 'shop', 'itemmarket', 'sid=itemmarket', 'bigal', 'pharmacy', 'post', 'recycling', 'superstore'];
    return keywords.some(k => url.includes(k));
}

function scanForItems() {
    if (EXCLUDED_ITEMS.length === 0) return;
    const excludedIds = new Set(EXCLUDED_ITEMS.map(i => i.id));

    // 1. Data Attributes
    excludedIds.forEach(id => {
        const els = document.querySelectorAll(`li[data-item="${id}"], div[data-item="${id}"], tr[data-item="${id}"]`);
        els.forEach(el => disableElement(el, id));
    });

    // 2. Images Fallback
    const images = document.querySelectorAll('img[src*="items/"]');
    images.forEach(img => {
        const match = img.src.match(/items\/(\d+)[/.]/);
        if (!match) return;
        const itemId = parseInt(match[1]);

        if (excludedIds.has(itemId)) {
            let wrapper = img.closest('[class*="itemRowWrapper"]');
            if (!wrapper) wrapper = img.closest('li');
            if (!wrapper) wrapper = img.closest('tr');
            if (!wrapper) wrapper = img.closest('div[class*="item-"]');
            if (wrapper) disableElement(wrapper, itemId);
        }
    });
}

function disableElement(el, id) {
    if (el.classList.contains('tsm-disabled')) return;
    el.classList.add('tsm-disabled');
    el.dataset.tsmId = id;

    // Visuals
    el.style.setProperty('opacity', '0.3', 'important');
    el.style.setProperty('filter', 'grayscale(100%)', 'important');
    el.style.setProperty('pointer-events', 'none', 'important');

    // Inputs
    const inputs = el.querySelectorAll('input, button, select, textarea');
    inputs.forEach(i => { i.disabled = true; if(i.type==='checkbox') i.checked=false; });
}

function restoreItem(id) {
    const els = document.querySelectorAll(`.tsm-disabled[data-tsm-id="${id}"]`);
    els.forEach(el => {
        el.classList.remove('tsm-disabled');
        el.style.removeProperty('opacity');
        el.style.removeProperty('filter');
        el.style.removeProperty('pointer-events');
        el.querySelectorAll('input, button').forEach(i => i.disabled = false);
    });
}

/* ================= UI LOGIC ================= */
// Watchdog for URL changes & DOM updates
setInterval(() => {
    if (isRelevantPage()) {
        if (!document.getElementById('tsmFloat')) insertFloat();
        scanForItems();
    } else {
        const btn = document.getElementById('tsmFloat');
        if (btn) btn.style.display = 'none';
    }
}, 1000);

const observer = new MutationObserver(() => {
    if (isRelevantPage()) scanForItems();
});
// Start Observer
const startObs = setInterval(() => {
    if (document.body) {
        clearInterval(startObs);
        observer.observe(document.body, { childList: true, subtree: true });
        if(isRelevantPage()) insertFloat();
    }
}, 500);


/* ================= WIDGET BUILDER ================= */
function insertFloat() {
    if(document.getElementById('tsmFloat')) {
        document.getElementById('tsmFloat').style.display = 'flex';
        return;
    }

    // Using Prayer Script structure
    const widgetHTML = `
        <div id="tsmFloat" class="tsm-float ${isMobile ? 'tsm-compact' : ''}">
            <span class="tsm-icon">${cart_svg}</span>
            <div class="tsm-info">
                <span class="tsm-text">SHOP MANAGER</span>
                <span class="tsm-status">${EXCLUDED_ITEMS.length} Excluded</span>
            </div>
            <div class="tsm-gear" id="tsmGear">${gear_icon_svg}</div>
            <div class="tsm-drag-label">drag</div>
        </div>
    `;

    $('body').append(widgetHTML);
    setFloatPosition();
    insertStyle();
    createSettingsModal();

    const btn = document.getElementById('tsmFloat');
    setupDrag(btn);

    // Click on main body opens modal too, unless dragging
    btn.addEventListener('click', (e) => {
        if (!btn.classList.contains('is-dragging')) openSettingsModal(e);
    });
}

function setupDrag(el) {
    let isDragging = false;
    let startX, startY;

    const start = (cx, cy) => { isDragging = false; startX = cx; startY = cy; };
    const move = (cx, cy, e) => {
        if (Math.abs(cx - startX) > 5 || Math.abs(cy - startY) > 5) {
            isDragging = true;
            el.classList.add('is-dragging');
            if(e) e.preventDefault();
            el.style.left = (cx - el.offsetWidth/2) + 'px';
            el.style.top = (cy - el.offsetHeight/2) + 'px';
            el.classList.remove('tsm-top','tsm-bottom','tsm-left','tsm-right');
        }
    };
    const end = () => {
        if (isDragging) {
            const lp = (parseInt(el.style.left)/window.innerWidth*100).toFixed(1)+'%';
            const tp = (parseInt(el.style.top)/window.innerHeight*100).toFixed(1)+'%';
            CustomPos = {top:tp, left:lp};
            localStorage.setItem('tsm-widget-custom', JSON.stringify(CustomPos));
            WidgetPos = 'custom';
            localStorage.setItem('tsm-widget-pos', 'custom');
            setTimeout(() => { isDragging = false; el.classList.remove('is-dragging'); }, 50);
        }
    };

    el.addEventListener('mousedown', e => { if(e.button===0) {
        start(e.clientX, e.clientY);
        const mm = ev => move(ev.clientX, ev.clientY, ev);
        const mu = () => { end(); document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); };
        document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
    }});

    el.addEventListener('touchstart', e => start(e.touches[0].clientX, e.touches[0].clientY), {passive:false});
    el.addEventListener('touchmove', e => move(e.touches[0].clientX, e.touches[0].clientY, e), {passive:false});
    el.addEventListener('touchend', end);
}

/* ================= SETTINGS MODAL ================= */
function createSettingsModal() {
    if(document.getElementById('tsmSettingsModal')) return;
    const modalHTML = `
        <div id="tsmSettingsModal" class="tsm-modal" style="display:none;">
            <div class="tsm-modal-content">
                <span id="tsmCloseModal" class="tsm-close">&times;</span>
                <h3>Shop Manager</h3>

                <!-- API -->
                <div class="tsm-group">
                    <label>API Key:</label>
                    <input type="text" id="tsmApiKey" placeholder="Public API Key" value="${TORN_API_KEY}" />
                    <button id="tsmSaveKey" class="tsm-btn tsm-btn-green" style="width:100%; margin-top:5px;">Save Key</button>
                </div>

                <!-- ADD ITEM -->
                <div class="tsm-group">
                    <label>Add Item:</label>
                    <input type="text" id="tsmSearch" placeholder="Search item name..." disabled />
                    <div id="tsmResults">Save API Key to search</div>

                    <div style="display:flex; gap:5px; margin-top:5px;">
                        <input type="number" id="tsmManualId" placeholder="ID" style="width:70px;" />
                        <button id="tsmAddManual" class="tsm-btn">Add ID</button>
                    </div>
                </div>

                <!-- LIST -->
                <div class="tsm-group">
                    <label>Excluded Items:</label>
                    <div id="tsmList"></div>
                </div>

                <div class="tsm-footer">
                   <button id="tsmCloseBtn" class="tsm-btn">Close</button>
                   <div style="margin-top: 10px; font-size: 10px; color: #666;">
                      Founded by generous <p style="font-size: 12px;">megalomaniacal</p>
                   </div>
                </div>

            </div>
        </div>
    `;
    $('body').append(modalHTML);

    // Events
    $('#tsmCloseModal, #tsmCloseBtn').click(() => $('#tsmSettingsModal').fadeOut(200));
    $('#tsmSaveKey').click(async () => {
        const k = $('#tsmApiKey').val().trim();
        if(await verifyKey(k)) {
            TORN_API_KEY = k; GM_setValue('tsm_apikey', k);
            alert('Saved!'); enableSearch(); loadItems();
        } else alert('Invalid Key');
    });

    $('#tsmSearch').on('input', (e) => handleSearch(e.target.value));

    // Add Manual
    $('#tsmAddManual').click(() => {
        const id = parseInt($('#tsmManualId').val());
        if(id) addItem(id, `Item ${id}`);
    });

    // Result Click
    $(document).on('click', '.tsm-res-row', function() {
        addItem($(this).data('id'), $(this).data('name'));
    });

    // Remove Click
    $(document).on('click', '.tsm-del-btn', function(e) {
        e.stopPropagation();
        delItem($(this).data('id'));
    });

    if(TORN_API_KEY) { enableSearch(); if(!ITEMS_CACHE) loadItems(); }
    renderList();
}

function openSettingsModal(e) {
    if(e) { e.stopPropagation(); e.preventDefault(); }
    $('#tsmSettingsModal').fadeIn(200);
}

/* ================= DATA HELPERS ================= */
async function verifyKey(k) {
    try { const r = await fetch(`https://api.torn.com/user/?selections=basic&key=${k}`); return !(await r.json()).error; } catch{return false;}
}

async function loadItems() {
    if(ITEMS_CACHE && (Date.now() - ITEMS_CACHE.ts < 24*60*60*1000)) return;
    try {
        const r = await fetch(`https://api.torn.com/v2/torn/items?key=${TORN_API_KEY}`);
        const d = await r.json();
        if(d.items) {
            ITEMS_CACHE = { ts: Date.now(), data: d.items.map(i=>({id:i.id, name:i.name})) };
            GM_setValue('tsm_items_cache', JSON.stringify(ITEMS_CACHE));
            $('#tsmResults').html('<span style="color:green">Items Loaded</span>');
        }
    } catch(e){}
}

function handleSearch(q) {
    if(!q || q.length<2 || !ITEMS_CACHE) { $('#tsmResults').empty(); return; }
    const res = ITEMS_CACHE.data.filter(i=>i.name.toLowerCase().includes(q.toLowerCase())).slice(0,10);
    let h='';
    res.forEach(i => {
        h += `<div class="tsm-res-row" data-id="${i.id}" data-name="${i.name.replace(/"/g,'&quot;')}"><b>[${i.id}]</b> ${i.name}</div>`;
    });
    $('#tsmResults').html(h || 'No match');
}

function addItem(id, name) {
    if(EXCLUDED_ITEMS.some(i=>i.id===id)) return;
    EXCLUDED_ITEMS.push({id,name});
    GM_setValue('tsm_excluded', JSON.stringify(EXCLUDED_ITEMS));
    renderList(); scanForItems();
    $('.tsm-status').text(`${EXCLUDED_ITEMS.length} Excluded`);
}

function delItem(id) {
    EXCLUDED_ITEMS = EXCLUDED_ITEMS.filter(i=>i.id!==id);
    GM_setValue('tsm_excluded', JSON.stringify(EXCLUDED_ITEMS));
    renderList(); restoreItem(id);
    $('.tsm-status').text(`${EXCLUDED_ITEMS.length} Excluded`);
}

function renderList() {
    let h='';
    EXCLUDED_ITEMS.forEach(i=>{
        h+=`<div class="tsm-list-row"><span><b>[${i.id}]</b> ${i.name}</span> <span class="tsm-del-btn" data-id="${i.id}">X</span></div>`;
    });
    $('#tsmList').html(h||'<i>None</i>');
}


function enableSearch() { $('#tsmSearch').prop('disabled', false); }

/* ================= STYLE & POSITION ================= */
function setFloatPosition() {
    const btn = document.getElementById('tsmFloat');
    if (!btn) return;
    btn.classList.remove('tsm-top', 'tsm-bottom', 'tsm-left', 'tsm-right');
    btn.style.top=''; btn.style.left='';

    if(WidgetPos === 'custom') {
        btn.style.top = CustomPos.top;
        btn.style.left = CustomPos.left;
    } else {
        btn.classList.add('tsm-top', 'tsm-right');
    }
}

function insertStyle() {
    GM_addStyle(`
    /* Remove arrows from number inputs */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type=number] {
    -moz-appearance: textfield;
}

/* ... existing #tsmFloat styles start here ... */
        #tsmFloat {
            z-index: 2147483647; position: fixed; font-family: Arial, sans-serif; font-size: 12px;
            cursor: pointer; background: #f2f2f2; color: #333;
            border: 1px solid #999; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            user-select: none; touch-action: none;
            display: flex; align-items: center;
        }
        /* Desktop Mode */
        #tsmFloat:not(.tsm-compact) { padding: 8px 12px; gap: 10px; }
        #tsmFloat:not(.tsm-compact) .tsm-icon svg { width: 24px; height: 24px; }
        #tsmFloat:not(.tsm-compact) .tsm-info { display: flex; flex-direction: column; }
        #tsmFloat:not(.tsm-compact) .tsm-text { font-weight: bold; }
        #tsmFloat:not(.tsm-compact) .tsm-status { font-size: 10px; color: #666; }
        #tsmFloat:not(.tsm-compact) .tsm-gear { opacity: 0.3; margin-left: auto; width: 20px; }
        #tsmFloat:not(.tsm-compact) .tsm-drag-label {
             position: absolute; top: -8px; left: 50%; transform: translateX(-50%);
             font-size: 8px; background: #fff; border: 1px solid #ccc; padding: 0 4px; border-radius: 3px;
        }

        /* Mobile/Compact Mode */
        #tsmFloat.tsm-compact { width: 42px; height: 42px; justify-content: center; border-radius: 50%; padding:0; }
        #tsmFloat.tsm-compact .tsm-info, #tsmFloat.tsm-compact .tsm-text, #tsmFloat.tsm-compact .tsm-status { display: none; }
        #tsmFloat.tsm-compact .tsm-icon svg { width: 24px; height: 24px; }
        #tsmFloat.tsm-compact .tsm-gear { position: absolute; bottom: -5px; right: -5px; width: 16px; background:#fff; border-radius:50%; border:1px solid #999; }
        #tsmFloat.tsm-compact .tsm-drag-label { position: absolute; top: -8px; left: 0; font-size: 8px; background: #fff; padding: 0 4px; border:1px solid #ccc; }

        .tsm-top { top: 15%; } .tsm-right { right: 5%; }

        /* Modal */
        .tsm-modal { position: fixed; z-index: 2147483647; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); }
        .tsm-modal-content { background: #222; color: #eee; margin: 15% auto; padding: 20px; width: 90%; max-width: 320px; border-radius: 8px; font-family: Arial; }
        .tsm-close { float: right; font-size: 24px; cursor: pointer; color: #aaa; }
        .tsm-group { margin-bottom: 15px; }
        .tsm-group label { display: block; font-weight: bold; margin-bottom: 5px; color: #aaa; font-size: 11px; }
        .tsm-group input { width: 100%; padding: 8px; background: #333; border: 1px solid #555; color: #fff; box-sizing: border-box; }
        .tsm-btn { padding: 8px 12px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .tsm-btn-green { background: #4CAF50; }

        #tsmResults { max-height: 100px; overflow-y: auto; background: #111; margin-top: 5px; }
        .tsm-res-row { padding: 6px; border-bottom: 1px solid #333; cursor: pointer; font-size: 12px; }
        .tsm-res-row:hover { background: #333; }

        #tsmList { max-height: 120px; overflow-y: auto; background: #111; padding: 5px; border: 1px solid #333; }
        .tsm-list-row { display: flex; justify-content: space-between; padding: 4px; border-bottom: 1px solid #333; font-size: 12px; }
        .tsm-del-btn { color: red; cursor: pointer; font-weight: bold; padding: 0 5px; }

        .tsm-footer { text-align: right; margin-top: 10px; border-top: 1px solid #444; padding-top: 10px; }
    `);
}

})();
