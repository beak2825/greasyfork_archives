// ==UserScript==
// @name         PapaNads PF Hybrid PC — Plushies / Flowers / Drugs)
// @namespace    http://tampermonkey.net/
// @version      2.3-hybrid-final-pc-tweak6-neon
// @description  Hybrid PDA with neon menus (plush/flower/drugs), Bits & Bobs shop price+stock for Teddy/Cat/Sheep, global & per-item calculators, JSON editor and HOW IT WORKS link (clickable). Keeps YATA preference and Torn API usage. (Neon UI + shop fallback).
// @author       PapaNads
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @connect      yata.yt
// @connect      torn.com
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558062/PapaNads%20PF%20Hybrid%20PC%20%E2%80%94%20Plushies%20%20Flowers%20%20Drugs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558062/PapaNads%20PF%20Hybrid%20PC%20%E2%80%94%20Plushies%20%20Flowers%20%20Drugs%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ============================
     Config / Storage keys
     ============================ */
  const VERSION = '2.2-hybrid-final-pc-tweak6-neon';
  const K = {
    API_TORN: 'pfn_api_torn',
    API_YATA: 'pfn_api_yata',
    MARKET_CACHE: 'pfn_market_cache',
    DRUG_CACHE: 'pfn_drug_cache',
    PLUSH_CACHE: 'pfn_plush_cache',
    FLOWER_CACHE: 'pfn_flower_cache',
    GOAL_PLUSH: 'pfn_goal_plush',
    GOAL_FLOWER: 'pfn_goal_flower',
    DRUG_HOLD_PREFIX: 'pfn_drug_hold_',
    DRUG_GOAL_PREFIX: 'pfn_drug_goal_',
    POS_X: 'pfn_pos_x',
    POS_Y: 'pfn_pos_y',
    MARKET_BACKUP: 'pfn_market_backup'
  };

  const REFRESH_INTERVAL_MS = 20_000; // 20s

  const COUNTRIES = [
    {name:'Mexico', code:'mex'},
    {name:'Cayman Islands', code:'cay'},
    {name:'Canada', code:'can'},
    {name:'Hawaii', code:'haw'},
    {name:'United Kingdom', code:'uni'},
    {name:'Argentina', code:'arg'},
    {name:'Switzerland', code:'swi'},
    {name:'Japan', code:'jap'},
    {name:'China', code:'chi'},
    {name:'UAE', code:'uae'},
    {name:'South Africa', code:'sou'}
  ];

  /* ============================
     Data definitions (kept from earlier)
     ============================ */
  const PLUSHIES = [
    {id:187,name:'Teddy Bear', type:'shop'}, // Bits & Bobs shop
    {id:384,name:'Camel', type:'travel'},
    {id:273,name:'Chamois', type:'travel'},
    {id:258,name:'Jaguar', type:'travel'},
    {id:215,name:'Stuffed Cat', type:'shop'}, // Bits & Bobs shop
    {id:281,name:'Lion', type:'travel'},
    {id:269,name:'Monkey', type:'travel'},
    {id:266,name:'Nessie', type:'travel'},
    {id:274,name:'Panda', type:'travel'},
    {id:268,name:'Red Fox', type:'travel'},
    {id:186,name:'Stuffed Sheep', type:'shop'}, // Bits & Bobs shop
    {id:618,name:'Stingray', type:'travel'},
    {id:261,name:'Wolverine', type:'travel'}
  ];

  const FLOWERS = [
    {id:260,name:'Dahlia'},{id:264,name:'Orchid'},{id:282,name:'African Violet'},{id:277,name:'Cherry Blossom'},
    {id:276,name:'Peony'},{id:271,name:'Ceibo Flower'},{id:272,name:'Edelweiss'},{id:263,name:'Crocus'},
    {id:267,name:'Heather'},{id:385,name:'Tribulus Omanense'},{id:617,name:'Banana Orchid'}
  ];

  const DRUGS = [
    {name:'Cannabis', id:196},
    {name:'Ecstasy', id:197},
    {name:'Ketamine', id:198},
    {name:'LSD', id:199},
    {name:'Opium', id:200},
    {name:'PCP', id:201},
    {name:'Shrooms', id:203},
    {name:'Speed', id:204},
    {name:'Vicodin', id:205},
    {name:'Xanax', id:206}
  ];

  const DRUG_NAMES = DRUGS.map(d => d.name);
  const DRUG_ID_MAP = {}; DRUGS.forEach(d => { if (d.id) DRUG_ID_MAP[d.id] = d.name; });
  const PLUSH_SET = new Set(PLUSHIES.map(p => p.id));
  const FLOWER_SET = new Set(FLOWERS.map(f => f.id));
  const DRUG_ID_SET = new Set(DRUGS.map(d => d.id));
  const SHOP_PLUSH_IDS = new Set([187,215,186]); // Teddy, Stuffed Cat, Stuffed Sheep

  /* ============================
     State
     ============================ */
  let apiTorn = GM_getValue(K.API_TORN,'') || '';
  let apiYata = GM_getValue(K.API_YATA,'') || '';
  let marketCache = GM_getValue(K.MARKET_CACHE, {}) || {};
  let drugCache = GM_getValue(K.DRUG_CACHE, {}) || {};
  let plushCache = GM_getValue(K.PLUSH_CACHE, {}) || {};
  let flowerCache = GM_getValue(K.FLOWER_CACHE, {}) || {};
  let plushCounts = {}; // inventory + display + page
  let flowerCounts = {};
  let drugCounts = {};
  let currentTab = 'plush';
  let menuOpen = false;
  let autoInterval = null;

  /* ============================
     Neon styles (distinct color per tab)
     ============================ */
  function addStyles() {
    const css = `
:root{
  --neon-plush: rgba(255,62,176,0.95);   /* magenta */
  --neon-flower: rgba(0,232,255,0.95);   /* cyan */
  --neon-drug: rgba(152,255,88,0.95);    /* lime */
  --panel-bg: rgba(8,8,8,0.98);
}

#pfn_toggle {
  position: style.left;
  left: 18px; bottom: 40px;
  z-index:999999; width:84px; height:56px; border-radius:14px;
  background: linear-gradient(180deg,#0b0b0b,#151515);
  cursor:pointer; display:flex;align-items:center;justify-content:center;
  border:2px solid rgba(255,255,255,0.04);
  box-shadow: 0 0 28px rgba(255,62,176,0.12), 0 0 80px rgba(0,232,255,0.06);
}
#pfn_toggle .sym { font-size:26px; font-weight:900; color:#fff; text-shadow:0 0 12px var(--neon-plush); }

/* wrapper & panel */
#pfn_wrap { left:18px; bottom:150px; position: style.left; z-index:999998; width:560px; max-height:82vh; pointer-events:none; opacity:0; transition:opacity .12s; }
#pfn_wrap.open { pointer-events:auto; opacity:1; }
#pfn_panel_wrapper { background:var(--panel-bg); padding:12px; border-radius:12px; box-shadow:0 18px 64px rgba(0,0,0,0.9); }

/* header */
#pfn_header { display:flex; justify-content:space-between; align-items:center; gap:8px; }
#pfn_title { font-weight:900; color:#ffdede; text-shadow:0 0 14px var(--neon-plush); }

/* tabs */
#pfn_tabs { display:flex; gap:8px; margin-top:8px; }
.pfn_tab { flex:1; padding:10px; border-radius:10px; text-align:center; cursor:pointer; font-weight:900; color:#fff; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.03); }
.pfn_tab.active { transform:translateY(-4px); box-shadow:0 12px 46px rgba(0,0,0,0.6); }

/* panels (distinct neon border glows) */
.pfn_panel { border-radius:10px; padding:12px; margin-top:8px; min-height:160px; max-height:70vh; overflow:auto; }
.pfn_panel.plush { border:2px solid rgba(255,62,176,0.22); box-shadow:0 0 40px rgba(255,62,176,0.06); background: linear-gradient(180deg, rgba(12,4,8,0.98), rgba(6,4,6,0.98)); }
.pfn_panel.flower { border:2px solid rgba(0,232,255,0.22); box-shadow:0 0 40px rgba(0,232,255,0.06); background: linear-gradient(180deg, rgba(3,8,12,0.98), rgba(4,6,10,0.98)); }
.pfn_panel.drugs { border:2px solid rgba(152,255,88,0.22); box-shadow:0 0 40px rgba(152,255,88,0.06); background: linear-gradient(180deg, rgba(4,8,4,0.98), rgba(6,10,6,0.98)); }
.pfn_panel.settings { border:2px solid rgba(255,80,80,0.16); box-shadow:0 0 36px rgba(255,80,80,0.04); background: linear-gradient(180deg, rgba(12,6,6,0.98), rgba(10,6,6,0.98)); }

/* buttons & inputs */
.pfn_btn { padding:8px 12px; border-radius:10px; font-weight:900; color:#fff; background:linear-gradient(180deg,#ff7ba9,#ff3b82); border:1px solid rgba(255,255,255,0.04); text-shadow:0 0 10px rgba(255,120,120,0.9); cursor:pointer; }
.pfn_btn.alt { background:linear-gradient(180deg,#8bff8b,#2dbf2d); text-shadow:0 0 10px rgba(120,255,150,0.9); }
.pfn_small { font-size:13px; color:#f0f0f0; }
.pfn_hold_input, .pfn_goal_input, .pfn_goal_input_item { padding:8px;border-radius:8px;background:#0b0b0b;color:#fff;border:1px solid rgba(255,255,255,0.04); }

/* country chips */
.pfn_country_list { margin-top:10px; display:flex; flex-wrap:wrap; gap:8px; }
.pfn_country_chip { padding:8px 10px; border-radius:10px; border:1px solid rgba(255,255,255,0.03); background:rgba(255,255,255,0.02); font-size:12px; box-shadow:0 0 10px rgba(255,62,176,0.06); }

/* modal & info */
#pfn_modal_overlay, #pfn_info_modal { position:fixed; left:0; top:0; right:0; bottom:0; display:none; align-items:center; justify-content:center; z-index:1000000; background:rgba(0,0,0,0.65); }
#pfn_modal { width:760px; max-width:96vw; background:#070707; border-radius:12px; padding:14px; border:2px solid rgba(255,62,176,0.12); box-shadow:0 18px 56px rgba(0,0,0,0.8); color:#fff; }
#pfn_info_modal #pfn_modal_info { width:720px; max-width:94vw; background:#060606; padding:12px; border-radius:10px; color:#ffdede; }
#pfn_modal textarea { width:100%; height:320px; background:#090909; color:#fff; border-radius:8px; padding:8px; }

/* settings red glow */
#pfn_panel .settings .pfn_small, #pfn_panel .settings .pfn_btn { text-shadow:0 0 12px rgba(255,80,80,0.95); color:#ffdede; }

@media(max-width:480px){
  #pfn_wrap { left:4vw; bottom:120px; width:92vw; }
  #pfn_toggle { left:20px; bottom:20px; }
}
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ============================
     Build UI & Modals
     ============================ */
  function buildUI() {
    // toggle
    const toggle = document.createElement('div');
    toggle.id = 'pfn_toggle';
    toggle.innerHTML = '<div class="sym">₿</div>';
    document.body.appendChild(toggle);
      toggle.style.position = 'fixed';
toggle.style.left = '20px'; // starting position if no saved position
toggle.style.top = '20px';
toggle.style.zIndex = '9999';
toggle.style.cursor = 'pointer';
toggle.style.width = '40px'; // adjust as needed
toggle.style.height = '40px';
toggle.style.display = 'flex';
toggle.style.alignItems = 'center';
toggle.style.justifyContent = 'center';
toggle.style.background = '#222'; // or neon color
toggle.style.border = '2px solid #ff0000'; // optional neon border
toggle.style.borderRadius = '8px';
toggle.style.boxShadow = '0 0 10px #ff0000, 0 0 20px #ff0000';

// Load saved position
const savedPos = JSON.parse(localStorage.getItem('pfn_toggle_pos') || '{}');
if (savedPos.left && savedPos.top) {
    toggle.style.left = savedPos.left + 'px';
    toggle.style.top = savedPos.top + 'px';

    const wrap = document.getElementById('pfn_wrap');
    if (wrap) {
        wrap.style.left = savedPos.left + 50 + 'px'; // adjust offset
        wrap.style.top = savedPos.top + 'px';
    }
}

let isDraggingToggle = false;
let toggleOffsetX, toggleOffsetY;

toggle.addEventListener('mousedown', (e) => {
    isDraggingToggle = true;
    toggleOffsetX = e.clientX - toggle.getBoundingClientRect().left;
    toggleOffsetY = e.clientY - toggle.getBoundingClientRect().top;
    toggle.style.cursor = 'move';
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingToggle) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const wrap = document.getElementById('pfn_wrap');

        // Calculate new position with boundaries
        let newLeft = e.clientX - toggleOffsetX;
        let newTop = e.clientY - toggleOffsetY;

        // Keep toggle on screen
        newLeft = Math.max(0, Math.min(newLeft, windowWidth - toggle.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, windowHeight - toggle.offsetHeight));

        // Move toggle
        toggle.style.left = newLeft + 'px';
        toggle.style.top = newTop + 'px';
        toggle.style.position = 'fixed';

        // Move menu panel along with toggle
        if (wrap) {
            wrap.style.left = newLeft + 50 + 'px'; // offset
            wrap.style.top = newTop + 'px';
            wrap.style.position = 'fixed';
        }
    }
});

document.addEventListener('mouseup', () => {
    if (isDraggingToggle) {
        // Save position
        localStorage.setItem('pfn_toggle_pos', JSON.stringify({
            left: parseInt(toggle.style.left),
            top: parseInt(toggle.style.top)
        }));
    }
    isDraggingToggle = false;
    toggle.style.cursor = 'pointer';
});

    // wrapper
    const wrap = document.createElement('div');
    wrap.id = 'pfn_wrap';
    wrap.innerHTML = `
      <div id="pfn_panel_wrapper">
        <div id="pfn_header">
          <div id="pfn_title">P A P A N A D</div>
          <div style="font-size:12px;color:#ffdede">v${VERSION}</div>
        </div>

        <div id="pfn_tabs">
          <div id="tab_plush" class="pfn_tab active">🧸 Plushies</div>
          <div id="tab_flower" class="pfn_tab">🌸 Flowers</div>
          <div id="tab_drugs" class="pfn_tab">💊 Drugs</div>
          <div id="tab_settings" class="pfn_tab">⚙ Settings</div>
        </div>

        <div id="pfn_panel" class="pfn_panel plush">
          <div id="pfn_content" class="pfn_small">Loading…</div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    // modal overlay for JSON editor
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'pfn_modal_overlay';
    modalOverlay.innerHTML = `
      <div id="pfn_modal" role="dialog" aria-modal="true">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div id="pfn_modal_title" style="font-weight:900;color:#ffdede">Edit per-country JSON</div>
          <div>
            <button id="pfn_modal_save" class="pfn_btn">Save</button>
            <button id="pfn_modal_close" class="pfn_btn">Close</button>
          </div>
        </div>
        <div style="margin-top:8px" class="pfn_small">This JSON is per-item mapping: {"Country Name":{"price":123,"stock":5}}</div>
        <textarea id="pfn_modal_textarea" rows="12"></textarea>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    // info modal (HOW IT WORKS)
    const infoModal = document.createElement('div');
    infoModal.id = 'pfn_info_modal';
    infoModal.innerHTML = `
      <div id="pfn_modal_info" role="dialog" aria-modal="true">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="font-weight:900;color:#ffdede">How it works</div>
          <div>
            <button id="pfn_info_close" class="pfn_btn">Close</button>
          </div>
        </div>
        <div id="pfn_info_text" style="margin-top:8px" class="pfn_small"></div>
      </div>
    `;
    document.body.appendChild(infoModal);

    // events
    toggle.addEventListener('click', () => { menuOpen = !menuOpen; setOpen(menuOpen); });

    document.getElementById('tab_plush').addEventListener('click', ()=>{ currentTab='plush'; updateTabs(); render(); });
    document.getElementById('tab_flower').addEventListener('click', ()=>{ currentTab='flower'; updateTabs(); render(); });
    document.getElementById('tab_drugs').addEventListener('click', ()=>{ currentTab='drugs'; updateTabs(); render(); });
    document.getElementById('tab_settings').addEventListener('click', ()=>{ currentTab='settings'; updateTabs(); render(); });

    document.getElementById('pfn_modal_close').addEventListener('click', closeModal);
    document.getElementById('pfn_modal_save').addEventListener('click', saveModalJson);
    document.getElementById('pfn_info_close').addEventListener('click', ()=>{ document.getElementById('pfn_info_modal').style.display='none'; });

    // position
    const savedX = GM_getValue(K.POS_X, 18);
    const savedBottom = GM_getValue(K.POS_Y, 150);
    const wrapEl = document.getElementById('pfn_wrap');
    wrapEl.style.left = savedX + 'px';
    wrapEl.style.bottom = savedBottom + 'px';
    const toggleEl = document.getElementById('pfn_toggle');
    toggleEl.style.left = savedX + 'px';
    toggleEl.style.bottom = '20px';

    updateTabs();
    setOpen(false);
  }

  function setOpen(v) {
    const wrap = document.getElementById('pfn_wrap');
    if (!wrap) return;
    menuOpen = !!v;
    if (menuOpen) wrap.classList.add('open'); else wrap.classList.remove('open');
  }

  function updateTabs() {
    document.querySelectorAll('.pfn_tab').forEach(t => t.classList.remove('active'));
    if (currentTab === 'plush') document.getElementById('tab_plush').classList.add('active');
    if (currentTab === 'flower') document.getElementById('tab_flower').classList.add('active');
    if (currentTab === 'drugs') document.getElementById('tab_drugs').classList.add('active');
    if (currentTab === 'settings') document.getElementById('tab_settings').classList.add('active');
    const panel = document.getElementById('pfn_panel');
    panel.className = 'pfn_panel ' + (currentTab === 'plush' ? 'plush' : currentTab === 'flower' ? 'flower' : currentTab === 'drugs' ? 'drugs' : 'settings');
  }


  /* ============================
     Modal helpers
     ============================ */
  let currentModalItem = null;
  let currentModalType = null;
  function openModalForItem(type, name) {
    currentModalType = type; currentModalItem = name;
    const overlay = document.getElementById('pfn_modal_overlay');
    const ta = document.getElementById('pfn_modal_textarea');
    const title = document.getElementById('pfn_modal_title');
    title.textContent = `Edit per-country JSON — ${type.toUpperCase()}: ${name}`;
    const store = (type === 'drug') ? drugCache : (type === 'plush') ? plushCache : flowerCache;
    const json = (store && store[name] && store[name].countryPrices) ? store[name].countryPrices : {};
    ta.value = JSON.stringify(json, null, 2);
    overlay.style.display = 'flex';
  }
  function closeModal() { currentModalItem = null; currentModalType = null; document.getElementById('pfn_modal_overlay').style.display='none'; }
  function saveModalJson() {
    if (!currentModalType || !currentModalItem) return alert('No item selected.');
    const ta = document.getElementById('pfn_modal_textarea');
    try {
      const obj = JSON.parse(ta.value || '{}');
      if (currentModalType === 'drug') {
        drugCache[currentModalItem] = drugCache[currentModalItem] || { countryPrices:{}, updatedAt:0 };
        drugCache[currentModalItem].countryPrices = obj;
        drugCache[currentModalItem].updatedAt = Date.now();
        GM_setValue(K.DRUG_CACHE, drugCache);
      } else if (currentModalType === 'plush') {
        plushCache[currentModalItem] = plushCache[currentModalItem] || { countryPrices:{}, updatedAt:0 };
        plushCache[currentModalItem].countryPrices = obj;
        plushCache[currentModalItem].updatedAt = Date.now();
        GM_setValue(K.PLUSH_CACHE, plushCache);
      } else {
        flowerCache[currentModalItem] = flowerCache[currentModalItem] || { countryPrices:{}, updatedAt:0 };
        flowerCache[currentModalItem].countryPrices = obj;
        flowerCache[currentModalItem].updatedAt = Date.now();
        GM_setValue(K.FLOWER_CACHE, flowerCache);
      }
      closeModal();
      toast('Saved JSON for ' + currentModalItem);
      render();
    } catch (e) {
      alert('Invalid JSON — fix and try again.');
    }
  }

  function toast(msg, short=true) {
    const wrap = document.getElementById('pfn_panel_wrapper');
    if (!wrap) return;
    let el = document.getElementById('pfn_toast');
    if (!el) {
      el = document.createElement('div'); el.id='pfn_toast';
      el.style.position='absolute'; el.style.left='12px'; el.style.top='48px';
      el.style.padding='6px 8px'; el.style.background='rgba(0,0,0,0.6)';
      el.style.border='1px solid rgba(255,255,255,0.04)'; el.style.borderRadius='6px'; el.style.color='#fff';
      el.style.zIndex='1000001'; el.style.opacity='0';
      wrap.appendChild(el);
    }
    el.textContent = msg; el.style.opacity = '1';
    setTimeout(()=>{ if (el) el.style.opacity = '0'; }, (short?1600:3200));
  }

  /* ============================
     Utilities
     ============================ */
  function timeAgo(ts) {
    if (!ts) return 'never';
    const s = Math.floor((Date.now() - ts)/1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return `${Math.floor(s/86400)}d ago`;
  }
  function calcMarketTotal(bucket) {
    const ids = Object.keys(bucket || {});
    let sum = 0;
    for (const idStr of ids) {
      const id = Number(idStr);
      const qty = bucket[id] || 0;
      const price = marketCache[id] || 0;
      if (price && qty) sum += price * qty;
    }
    return sum;
  }
  function fmtMoney(n) { return (n === null || n === undefined) ? '—' : '$' + Number(n).toLocaleString(); }

  /* ============================
     Market / YATA / Bits & Bobs fetching
     ============================ */
  function updateMarket() {
    if (!apiTorn) { toast('Set Limited API key to update market values', true); return; }
    GM_xmlhttpRequest({
      method:'GET',
      url: `https://api.torn.com/torn/?selections=items&key=${encodeURIComponent(apiTorn)}`,
      timeout:12000,
      onload(res) {
        try {
          const data = JSON.parse(res.responseText);
          if (data.error) { toast('Market update error'); render(); return; }
          const items = data.items || {};
          const wanted = new Set([...PLUSHIES.map(p=>p.id), ...FLOWERS.map(f=>f.id)]);
          const newMarket = {};
          Object.keys(items).forEach(idStr => {
            const id = Number(idStr);
            if (!wanted.has(id)) return;
            newMarket[id] = items[idStr].market_value || 0;
          });
          newMarket._updated = Date.now();
          marketCache = newMarket;
          GM_setValue(K.MARKET_CACHE, marketCache);
          render();
        } catch (e) { toast('Market parse failed'); render(); }
      },
      onerror(){ toast('Market request failed'); render(); },
      ontimeout(){ toast('Market request timed out'); render(); }
    });
  }

  // YATA export parsing (preferred where available)
  async function fetchYataExport() {
    try {
      const url = `https://yata.yt/api/v1/travel/export/`;
      const respText = await new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({
          method:'GET', url, timeout:20000,
          onload(res){ if(res.status>=200 && res.status<400) resolve(res.responseText); else reject('bad status'); },
          onerror(){ reject('error'); }, ontimeout(){ reject('timeout'); }
        });
      });
      const parsed = JSON.parse(respText);
      if (parsed && parsed.stocks) {
        const stocks = parsed.stocks;
        for (const [countryCode, info] of Object.entries(stocks)) {
          const idx = COUNTRIES.findIndex(c => countryCode === c.code);
          const countryName = idx >= 0 ? COUNTRIES[idx].name : countryCode;
          const itemsArray = info.stocks || [];
          for (const it of itemsArray) {
            const itemName = (it.name||'').trim();
            const cost = Number(it.cost) || null;
            const qty = Number(it.quantity) || null;
            // drugs
            for (const drug of DRUGS) {
              if (itemName.toLowerCase().includes(drug.name.toLowerCase())) {
                drugCache[drug.name] = drugCache[drug.name] || { countryPrices:{}, updatedAt:0 };
                drugCache[drug.name].countryPrices[countryName] = { price:cost, stock:qty, ts:Date.now() };
                drugCache[drug.name].updatedAt = Date.now();
              }
            }
            // plushes
            for (const p of PLUSHIES) {
              if (itemName.toLowerCase().includes(p.name.toLowerCase())) {
                plushCache[p.name] = plushCache[p.name] || { countryPrices:{}, updatedAt:0 };
                plushCache[p.name].countryPrices[countryName] = { price:cost, stock:qty, ts:Date.now() };
                plushCache[p.name].updatedAt = Date.now();
              }
            }
            // flowers
            for (const f of FLOWERS) {
              if (itemName.toLowerCase().includes(f.name.toLowerCase())) {
                flowerCache[f.name] = flowerCache[f.name] || { countryPrices:{}, updatedAt:0 };
                flowerCache[f.name].countryPrices[countryName] = { price:cost, stock:qty, ts:Date.now() };
                flowerCache[f.name].updatedAt = Date.now();
              }
            }
          }
        }
        // parse parsed.shops for shop data (Bits & Bobs)
        if (parsed.shops) {
          for (const [shopId, shopInfo] of Object.entries(parsed.shops)) {
            const shopName = (shopInfo.name||'').toLowerCase();
            if (!shopName) continue;
            if (shopName.includes('bits') || shopName.includes('bobs')) {
              const shopStocks = shopInfo.stocks || [];
              for (const it of shopStocks) {
                const itemName = (it.name||'').trim();
                const cost = Number(it.cost) || null;
                const qty = Number(it.quantity) || null;
                for (const p of PLUSHIES) {
                  if (itemName.toLowerCase().includes(p.name.toLowerCase())) {
                    plushCache[p.name] = plushCache[p.name] || { countryPrices:{}, updatedAt:0 };
                    plushCache[p.name].countryPrices['Torn (Bits & Bobs)'] = { price:cost, stock:qty, ts:Date.now() };
                    plushCache[p.name].updatedAt = Date.now();
                  }
                }
              }
            }
          }
        }
        GM_setValue(K.DRUG_CACHE, drugCache);
        GM_setValue(K.PLUSH_CACHE, plushCache);
        GM_setValue(K.FLOWER_CACHE, flowerCache);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  // Torn scrape fallback to find shop data for Bits & Bobs for a given item (best-effort)
  function fetchBitsAndBobsByScrapeFor(pName, pId) {
    return new Promise((resolve) => {
      const urls = [
        `https://www.torn.com/market.php?step=1&itemid=${pId}`,
        `https://www.torn.com/market.php?step=2&itemid=${pId}`,
        `https://www.torn.com/shops.php`,
        `https://www.torn.com/market.php`
      ];
      let i=0;
      (function next(){
        if (i>=urls.length) { resolve(false); return; }
        const url = urls[i++];
        GM_xmlhttpRequest({
          method:'GET', url, timeout:12000,
          onload(res){
            try {
              const text = res.responseText || '';
              const idx = text.search(new RegExp(pName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
              if (idx >= 0) {
                const slice = text.slice(Math.max(0, idx-600), idx+600);
                const priceMatch = slice.match(/\$[\d,]+/);
                const stockMatch = slice.match(/stock[^0-9]*([0-9,]+)/i);
                if (priceMatch) {
                  const price = Number(priceMatch[0].replace(/[$,]/g,''));
                  const stock = stockMatch ? Number(stockMatch[1].replace(/[,]/g,'')) : null;
                  plushCache[pName] = plushCache[pName] || { countryPrices:{}, updatedAt:0 };
                  plushCache[pName].countryPrices['Torn (Bits & Bobs)'] = { price:price, stock: stock || 0, ts:Date.now() };
                  plushCache[pName].updatedAt = Date.now();
                  GM_setValue(K.PLUSH_CACHE, plushCache);
                  resolve(true); return;
                }
              }
            } catch(e){}
            setTimeout(next,200);
          },
          onerror(){ setTimeout(next,200); },
          ontimeout(){ setTimeout(next,200); }
        });
      })();
    });
  }

  // Ensure Bits & Bobs shop plushies have a shop price entry (YATA preferred, else scrape)
  async function fetchShopPlushes(manual=false) {
    const yataOk = await fetchYataExport().catch(()=>false);
    const promises = [];
    for (const p of PLUSHIES) {
      if (SHOP_PLUSH_IDS.has(p.id)) {
        const hasShopEntry = plushCache[p.name] && plushCache[p.name].countryPrices && plushCache[p.name].countryPrices['Torn (Bits & Bobs)'];
        if (!hasShopEntry) promises.push(fetchBitsAndBobsByScrapeFor(p.name, p.id));
      }
    }
    await Promise.all(promises);
    if (manual) toast('Bits & Bobs shop data updated (best-effort).');
    GM_setValue(K.PLUSH_CACHE, plushCache);
    return yataOk || promises.length>0;
  }

  /* ============================
     Page-scrape merge for inventory/display fallback
     ============================ */
  function mergePageInventory(plushBucket, flowerBucket, drugBucket) {
    try {
      const nodes = document.querySelectorAll('[data-item],[data-id],li.item,div.item');
      if (!nodes || !nodes.length) return;
      nodes.forEach(node => {
        let id = node.getAttribute('data-item') || node.getAttribute('data-id') || (node.dataset && (node.dataset.item || node.dataset.id));
        if (!id) return;
        const num = Number(id);
        if (!num) return;
        let qty = 1;
        const qn = node.querySelector('[data-amount], .amount, .qty, .quantity, .stck-amount');
        if (qn) {
          const txt = qn.textContent || qn.getAttribute('data-amount') || '';
          const m = (txt||'').match(/\d+/);
          if (m) qty = Number(m[0]);
        }
        if (PLUSH_SET.has(num)) plushBucket[num] = (plushBucket[num]||0) + qty;
        if (FLOWER_SET.has(num)) flowerBucket[num] = (flowerBucket[num]||0) + qty;
        if (DRUG_ID_SET.has(num)) {
          const drugName = DRUG_ID_MAP[num];
          if (drugName) drugBucket[drugName] = (drugBucket[drugName] || 0) + qty;
        }
      });
    } catch (e){}
  }

  /* ============================
     Fetch items (Torn API) - inventory + display
     ============================ */
  function fetchItems() {
    plushCounts = {}; flowerCounts = {}; Object.keys(drugCounts||{}).forEach(k=>delete drugCounts[k]);
    if (!apiTorn) {
      mergePageInventory(plushCounts, flowerCounts, drugCounts);
      render();
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method:'GET',
        url: `https://api.torn.com/user/?selections=inventory,display&key=${encodeURIComponent(apiTorn)}`,
        timeout:10000,
        onload(res){
          try {
            const data = JSON.parse(res.responseText);
            if (data.error) { mergePageInventory(plushCounts, flowerCounts, drugCounts); render(); resolve(); return; }
            if (data.inventory) Object.values(data.inventory).forEach(it => addIt(it));
            if (data.display) Object.values(data.display).forEach(it => addIt(it));
            function addIt(it){
              if (!it) return;
              const id = Number(it.ID || it.id);
              const qty = Number(it.quantity || it.qty || 1);
              if (!id) return;
              if (PLUSH_SET.has(id)) plushCounts[id] = (plushCounts[id]||0) + qty;
              else if (FLOWER_SET.has(id)) flowerCounts[id] = (flowerCounts[id]||0) + qty;
              else if (DRUG_ID_SET.has(id)) {
                const drugName = DRUG_ID_MAP[id];
                if (drugName) drugCounts[drugName] = (drugCounts[drugName] || 0) + qty;
              }
            }
            mergePageInventory(plushCounts, flowerCounts, drugCounts);
            render(); resolve();
          } catch (e) { mergePageInventory(plushCounts, flowerCounts, drugCounts); render(); resolve(); }
        },
        onerror(){ mergePageInventory(plushCounts, flowerCounts, drugCounts); render(); resolve(); },
        ontimeout(){ mergePageInventory(plushCounts, flowerCounts, drugCounts); render(); resolve(); }
      });
    });
  }

  /* ============================
     Cheap-finding helpers (plush: consider Torn (Bits & Bobs) shop entry)
     ============================ */
  function findCheapestForItem(type, itemName) {
    const store = (type === 'plush') ? plushCache : (type === 'flower') ? flowerCache : null;
    if (!store || !store[itemName] || !store[itemName].countryPrices) {
      // If shop-only and no cache: return null
      return null;
    }
    const dc = store[itemName].countryPrices;
    let cheapest = null;
    for (const [country, obj] of Object.entries(dc)) {
      if (!obj || typeof obj.price !== 'number') continue;
      if (!cheapest || obj.price < cheapest.price) cheapest = { country, price: obj.price, stock: obj.stock||0, ts: obj.ts||null };
    }
    // If we didn't find any country price but we have a Torn (Bits & Bobs) entry, use it
    if (!cheapest && store[itemName].countryPrices['Torn (Bits & Bobs)']) {
      const o = store[itemName].countryPrices['Torn (Bits & Bobs)'];
      if (o && typeof o.price === 'number') return { country: 'Torn (Bits & Bobs)', price: o.price, stock: o.stock||0, ts: o.ts||null };
    }
    // still maybe market price exists (for travel items)
    const pObj = PLUSHIES.find(p=>p.name===itemName);
    if (!cheapest && pObj && marketCache[pObj.id]) {
      return { country: 'Market', price: marketCache[pObj.id], stock: null, ts: marketCache._updated||null };
    }
    return cheapest;
  }

  function findCheapestForDrug(drugName) {
    const dc = (drugCache[drugName] && drugCache[drugName].countryPrices) ? drugCache[drugName].countryPrices : {};
    let cheapest = null;
    for (const [country, obj] of Object.entries(dc)) {
      if (!obj || typeof obj.price !== 'number') continue;
      if (!cheapest || obj.price < cheapest.price) cheapest = { country, price: obj.price, stock: obj.stock||0, ts: obj.ts||null };
    }
    return cheapest;
  }

  /* ============================
     Renderers
     ============================ */
  function render() {
    const content = document.getElementById('pfn_content');
    if (!content) return;
    mergePageInventory(plushCounts, flowerCounts, drugCounts);
    if (currentTab === 'plush') renderPlush(content);
    else if (currentTab === 'flower') renderFlower(content);
    else if (currentTab === 'drugs') renderDrugs(content);
    else renderSettings(content);
  }

  function renderPlush(container) {
  // ensure entries in cache
  PLUSHIES.forEach(p => { if (!plushCache[p.name]) plushCache[p.name] = { countryPrices:{}, updatedAt:0 }; });

  const countsArr = PLUSHIES.map(p => plushCounts[p.id] || 0);
  const sets = countsArr.length ? Math.min(...countsArr) : 0;
  const total = countsArr.reduce((a,b)=>a+b,0);
  const goal = Number(GM_getValue(K.GOAL_PLUSH,0));
  const marketTotal = calcMarketTotal(plushCounts);

  // Top-level goal input
  const topHtml = `
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <div style="font-weight:900">
        Plushies — Sets: ${sets} • Goal:
        <input id="pfn_plush_goal" type="number" min="0" value="${goal || ''}" style="width:80px;padding:4px;border-radius:4px;background:#070707;color:#fff;border:1px solid rgba(255,255,255,0.03)">
        <button id="pfn_plush_goal_lock" class="pfn_btn" style="background:linear-gradient(180deg,#00e0ff,#00b8ff);padding:4px 8px;font-size:12px">Lock</button>
      </div>
      <div style="margin-left:auto" class="pfn_small">
        Market est total: <span style="font-weight:900;color:#ffdede">${fmtMoney(marketTotal)}</span>
      </div>
    </div>

    <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
      <div class="pfn_small">Global calc (per-item cheapest):</div>
      <input id="pfn_plush_global_qty" type="number" min="0" value="0" style="width:80px;padding:6px;border-radius:6px;background:#070707;color:#fff;border:1px solid rgba(255,255,255,0.03)">
      <button id="pfn_plush_global_calc" class="pfn_btn">Calculate cost for X each</button>
      <button id="pfn_plush_update_shops" class="pfn_btn alt" style="margin-left:8px">Update Bits & Bobs shop data</button>
      <div style="margin-left:auto" class="pfn_small">Total plush: <span style="font-weight:900;color:#ffdede">${total}</span></div>
    </div>

    <div id="pfn_plush_list" style="margin-top:12px"></div>
  `;
  container.innerHTML = topHtml;

  // Top-level goal listener
  document.getElementById('pfn_plush_goal_lock').addEventListener('click', ()=>{
    const n = Math.max(0, parseInt(document.getElementById('pfn_plush_goal').value||0,10));
    if(n>0){
      GM_setValue(K.GOAL_PLUSH, n);
      toast('Saved plush sets goal: ' + n);
      render();
    } else toast('Enter a positive number to lock as goal', true);
  });

  // Global cost calculation
  document.getElementById('pfn_plush_global_calc').addEventListener('click', ()=>{
    const q = Math.max(0, parseInt(document.getElementById('pfn_plush_global_qty').value||0,10));
    let totalCost = 0;
    PLUSHIES.forEach(p=>{
      const cheapest = findCheapestForItem('plush', p.name);
      if(cheapest && typeof cheapest.price === 'number') totalCost += cheapest.price*q;
    });
    toast(`Plush total for ${q} each: ${fmtMoney(totalCost)}`, false);
  });

  // Update shop data
  document.getElementById('pfn_plush_update_shops').addEventListener('click', async ()=>{
    toast('Updating Bits & Bobs (best-effort)...');
    await fetchShopPlushes(true);
    render();
  });

  // Rows (per-plush) — no per-plush goal anymore
  const rowsHtml = PLUSHIES.map(p=>{
    const have = plushCounts[p.id] || 0;
    const cache = plushCache[p.name] || { countryPrices:{}, updatedAt:0 };
    const cheapest = findCheapestForItem('plush', p.name);
    const cheapestText = cheapest ? `${cheapest.country} • ${fmtMoney(cheapest.price)} (stk ${cheapest.stock||0})` : 'No data';
    const marketVal = (marketCache[p.id] || 0) * have;

    let countryChips = '';
    const cp = cache.countryPrices || {};
    const entries = Object.entries(cp);
    if(entries.length){
      countryChips = '<div class="pfn_country_list">';
      for(const [country,obj] of entries){
        const priceText = (obj && typeof obj.price === 'number') ? fmtMoney(obj.price) : '—';
        const stockText = (obj && obj.stock!==undefined && obj.stock!==null) ? `stk ${obj.stock}` : '';
        countryChips += `<div class="pfn_country_chip">${country}<br><small>${priceText} ${stockText}</small></div>`;
      }
      countryChips += '</div>';
    }

    const shopEntry = (cache.countryPrices && cache.countryPrices['Torn (Bits & Bobs)']) ? cache.countryPrices['Torn (Bits & Bobs)'] : null;
    const shopLine = shopEntry ? `<div style="margin-top:6px;color:#ffdede;font-weight:900">Shop price: ${fmtMoney(shopEntry.price)} • stock: ${shopEntry.stock||0}</div>` : '';

    return `
      <div style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.02);margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="font-weight:900">${p.name} — you have ${have}</div>
          <div style="font-size:12px;color:#ddd">Updated: ${cache.updatedAt?timeAgo(cache.updatedAt):'never'}</div>
        </div>

        <div style="margin-top:8px;font-size:13px">Cheapest: <span style="color:var(--neon-plush);font-weight:900">${cheapestText}</span></div>
        ${shopLine}

        <div style="margin-top:10px;display:flex;gap:12px;align-items:center">
          <div style="flex:1">
            <div class="pfn_small">Market value (owned):</div>
            <div style="font-weight:900;color:#ffb86b">${fmtMoney(marketVal)}</div>
            <div style="font-size:12px;color:#ddd;margin-top:6px">Market price (per): ${fmtMoney(marketCache[p.id]||0)}</div>
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
            <button data-item="${p.name}" class="pfn_btn pfn_open_json_item" data-type="plush">Edit JSON</button>
            <button data-item="${p.name}" class="pfn_btn pfn_calc_item" data-type="plush">Calc for X</button>
            ${ SHOP_PLUSH_IDS.has(p.id) ? `<button data-id="${p.id}" data-item="${p.name}" class="pfn_btn alt pfn_fetch_shop" data-type="plush">Fetch shop price</button>` : '' }
          </div>
        </div>

        ${countryChips}
      </div>
    `;
  }).join('');
  document.getElementById('pfn_plush_list').innerHTML = rowsHtml;

  // listeners
  document.querySelectorAll('.pfn_open_json_item').forEach(btn=>btn.addEventListener('click', ()=>openModalForItem(btn.dataset.type, btn.dataset.item)));
  document.querySelectorAll('.pfn_calc_item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.dataset.item;
      const type = btn.dataset.type;
      const q = prompt(`Enter quantity to calculate total cost for ${key}:`, '1');
      if (q === null) return;
      const qty = Math.max(0, parseInt(q,10) || 0);
      const cheapest = findCheapestForItem(type, key);
      if (!cheapest || typeof cheapest.price !== 'number') {
        alert('No price data for ' + key + '. Try updating shop data or YATA.');
        return;
      }
      const cost = cheapest.price * qty;
      alert(`Estimated cost for ${qty} ${key}: ${fmtMoney(cost)} (cheapest: ${cheapest.country} at ${fmtMoney(cheapest.price)})`);
    });
  });
  document.querySelectorAll('.pfn_fetch_shop').forEach(btn=>btn.addEventListener('click', async ()=>{
    const id = Number(btn.dataset.id);
    const name = btn.dataset.item;
    toast('Fetching Bits & Bobs (best-effort)...');
    const ok = await fetchBitsAndBobsByScrapeFor(name, id);
    if (ok) toast('Shop data fetched for ' + name);
    else toast('Shop data not found (best-effort)', true);
    render();
  }));
}


 function renderFlower(container) {
  // Initialize flower cache if missing
  FLOWERS.forEach(f => {
    if (!flowerCache[f.name]) flowerCache[f.name] = { countryPrices: {}, updatedAt: 0 };
  });

  const countsArr = FLOWERS.map(p => flowerCounts[p.id] || 0);
  const sets = countsArr.length ? Math.min(...countsArr) : 0;
  const total = countsArr.reduce((a, b) => a + b, 0);
  const goal = Number(GM_getValue(K.GOAL_FLOWER, 0));
  const marketTotal = calcMarketTotal(flowerCounts);

  // Top section with global goal input
  const topHtml = `
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <div style="font-weight:900">
        Flowers — Sets: ${sets} • Goal:
        <input id="pfn_flower_goal" type="number" min="0" value="${goal || ''}" style="width:80px;padding:4px;border-radius:4px;background:#070707;color:#fff;border:1px solid rgba(255,255,255,0.03)">
        <button id="pfn_flower_goal_lock" class="pfn_btn" style="background:linear-gradient(180deg,#00e0ff,#00b8ff);padding:4px 8px;font-size:12px">Lock</button>
      </div>
      <div style="margin-left:auto" class="pfn_small">
        Market est total: <span style="font-weight:900;color:#ffdede">${fmtMoney(marketTotal)}</span>
      </div>
    </div>

    <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
      <div class="pfn_small">Global calc (per-item cheapest):</div>
      <input id="pfn_flower_global_qty" type="number" min="0" value="0" style="width:80px;padding:6px;border-radius:6px;background:#070707;color:#fff;border:1px solid rgba(255,255,255,0.03)">
      <button id="pfn_flower_global_calc" class="pfn_btn" style="background:linear-gradient(180deg,#00e0ff,#00b8ff)">Calculate cost for X each</button>
      <div style="margin-left:auto" class="pfn_small">Total flowers: <span style="font-weight:900;color:#ffdede">${total}</span></div>
    </div>

    <div id="pfn_flower_list" style="margin-top:12px"></div>
  `;
  container.innerHTML = topHtml;

  // Listener for top-level goal lock
  document.getElementById('pfn_flower_goal_lock').addEventListener('click', () => {
    const n = Math.max(0, parseInt(document.getElementById('pfn_flower_goal').value || 0, 10));
    if (n > 0) {
      GM_setValue(K.GOAL_FLOWER, n);
      toast('Saved flower sets goal: ' + n);
      render(); // update display
    } else {
      toast('Enter a positive number to lock as goal', true);
    }
  });

  // Listener for global cost calculator
  document.getElementById('pfn_flower_global_calc').addEventListener('click', () => {
    const q = Math.max(0, parseInt(document.getElementById('pfn_flower_global_qty').value || 0, 10));
    let totalCost = 0;
    FLOWERS.forEach(p => {
      const cheapest = findCheapestForItem('flower', p.name);
      if (cheapest && typeof cheapest.price === 'number') totalCost += cheapest.price * q;
    });
    toast(`Flowers total for ${q} each: ${fmtMoney(totalCost)}`, false);
  });

  // Generate per-flower rows (without goal input)
  const rowsHtml = FLOWERS.map(p => {
    const have = flowerCounts[p.id] || 0;
    const cache = flowerCache[p.name] || { countryPrices: {}, updatedAt: 0 };
    const cheapest = findCheapestForItem('flower', p.name);
    const cheapestText = cheapest ? `${cheapest.country} • ${fmtMoney(cheapest.price)} (stk ${cheapest.stock || 0})` : 'No data';
    const marketVal = (marketCache[p.id] || 0) * have;

    // Country chips
    let countryChips = '';
    const cp = cache.countryPrices || {};
    const entries = Object.entries(cp);
    if (entries.length) {
      countryChips = '<div class="pfn_country_list">';
      for (const [country, obj] of entries) {
        const priceText = (obj && typeof obj.price === 'number') ? fmtMoney(obj.price) : '—';
        const stockText = (obj && (obj.stock !== undefined && obj.stock !== null)) ? `stk ${obj.stock}` : '';
        countryChips += `<div class="pfn_country_chip">${country}<br><small>${priceText} ${stockText}</small></div>`;
      }
      countryChips += '</div>';
    }

    return `
      <div style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.02);margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="font-weight:900">${p.name} — you have ${have}</div>
          <div style="font-size:12px;color:#ddd">Updated: ${cache.updatedAt ? timeAgo(cache.updatedAt) : 'never'}</div>
        </div>

        <div style="margin-top:8px;font-size:13px">Cheapest: <span style="color:var(--neon-flower);font-weight:900">${cheapestText}</span></div>

        <div style="margin-top:10px;display:flex;gap:12px;align-items:center">
          <div style="flex:1">
            <div class="pfn_small">Market value (owned):</div>
            <div style="font-weight:900;color:#ffb86b">${fmtMoney(marketVal)}</div>
            <div style="font-size:12px;color:#ddd;margin-top:6px">Market price (per): ${fmtMoney(marketCache[p.id] || 0)}</div>
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
            <button data-item="${p.name}" class="pfn_btn pfn_open_json_item" data-type="flower" style="background:linear-gradient(180deg,#00e0ff,#00b8ff)">Edit JSON</button>
            <button data-item="${p.name}" class="pfn_btn pfn_calc_item" data-type="flower" style="background:linear-gradient(180deg,#00e0ff,#00b8ff)">Calc for X</button>
          </div>
        </div>

        ${countryChips}
      </div>
    `;
  }).join('');

  document.getElementById('pfn_flower_list').innerHTML = rowsHtml;

  // Listeners for per-flower buttons
  document.querySelectorAll('.pfn_open_json_item').forEach(btn => btn.addEventListener('click', () => openModalForItem(btn.dataset.type, btn.dataset.item)));
  document.querySelectorAll('.pfn_calc_item').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.item;
      const q = prompt(`Enter quantity to calculate total cost for ${key}:`, '1');
      if (q === null) return;
      const qty = Math.max(0, parseInt(q, 10) || 0);
      const cheapest = findCheapestForItem('flower', key);
      if (!cheapest || typeof cheapest.price !== 'number') { alert('No price data for ' + key); return; }
      alert(`Estimated cost for ${qty} ${key}: ${fmtMoney(cheapest.price * qty)} (cheapest: ${cheapest.country} at ${fmtMoney(cheapest.price)})`);
    });
  });
}

  function renderDrugs(container) {
    DRUG_NAMES.forEach(d => { if(!drugCache[d]) drugCache[d] = { countryPrices:{}, updatedAt:0 }; });
    const topHtml = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-weight:900">Drugs — Cheapest country & estimated totals</div>
        <div class="pfn_small">Sort: <select id="pfn_drug_sort"><option value="name">Name</option><option value="price">Cheapest price</option></select></div>
      </div>

      <div style="margin-top:6px;display:flex;gap:8px;align-items:center">
        <button id="pfn_update_drugs" class="pfn_btn" style="background:linear-gradient(180deg,#99ff60,#7bf000)">Update drug prices (Yata / scrape)</button>
        <button id="pfn_clear_drugcache" class="pfn_btn">Clear drug cache</button>
        <div style="margin-left:auto" class="pfn_small">Auto-update every 20s • Manual JSON edits show a confirmation</div>
      </div>

      <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
        <div class="pfn_small">Global calc (enter quantity per drug):</div>
        <input id="pfn_global_qty" type="number" min="0" value="0" style="width:80px;padding:6px;border-radius:6px;background:#070707;color:#fff;border:1px solid rgba(255,255,255,0.03)">
        <button id="pfn_global_calc" class="pfn_btn">Calculate cost for X each</button>
        <div id="pfn_global_total" style="margin-left:auto;font-weight:900"></div>
      </div>

      <div id="pfn_drug_list" style="margin-top:10px"></div>
    `;
    container.innerHTML = topHtml;

    document.getElementById('pfn_update_drugs').addEventListener('click', ()=>fetchDrugData(true));
    document.getElementById('pfn_clear_drugcache').addEventListener('click', ()=>{ drugCache = {}; GM_setValue(K.DRUG_CACHE, drugCache); render(); });
    document.getElementById('pfn_global_calc').addEventListener('click', ()=>{
      const q = Math.max(0, parseInt(document.getElementById('pfn_global_qty').value||0,10));
      let total = 0;
      DRUG_NAMES.forEach(d=>{
        const cheapest = findCheapestForDrug(d);
        if (cheapest && typeof cheapest.price === 'number') total += cheapest.price * q;
      });
      document.getElementById('pfn_global_total').textContent = `Total: ${fmtMoney(total)}`;
    });

    renderDrugRows();
    document.getElementById('pfn_drug_sort').addEventListener('change', renderDrugRows);
  }

  function renderDrugRows() {
    const list = document.getElementById('pfn_drug_list'); if (!list) return;
    const dataArr = DRUG_NAMES.map(d=>{
      const drugObj = DRUGS.find(x=>x.name===d); const id = drugObj?drugObj.id:null;
      const cache = drugCache[d] || { countryPrices:{}, updatedAt:0 };
      const cheapest = findCheapestForDrug(d);
      const holdFromCounts = Number(drugCounts[d] || 0);
      const savedHold = Number(GM_getValue(K.DRUG_HOLD_PREFIX + d, 0));
      const hold = holdFromCounts > 0 ? holdFromCounts : savedHold;
      const goal = Number(GM_getValue(K.DRUG_GOAL_PREFIX + d, 0));
      const progressPct = goal > 0 ? Math.min(100, Math.round((hold/goal)*100)) : 0;
      const marketOwned = id ? ((marketCache[id] || 0) * hold) : 0;
      return { name:d, id, cache, cheapest, hold, goal, progressPct, marketOwned };
    });

    const sortMode = document.getElementById('pfn_drug_sort') ? document.getElementById('pfn_drug_sort').value : 'name';
    if (sortMode === 'price') {
      dataArr.sort((a,b)=> {
        const pa = a.cheapest && a.cheapest.price ? a.cheapest.price : Number.MAX_SAFE_INTEGER;
        const pb = b.cheapest && b.cheapest.price ? b.cheapest.price : Number.MAX_SAFE_INTEGER;
        return pa - pb;
      });
    } else dataArr.sort((a,b)=>a.name.localeCompare(b.name));

    const rowsHtml = dataArr.map(item=>{
      const cheapestText = item.cheapest ? `${item.cheapest.country} • ${fmtMoney(item.cheapest.price)} (stk ${item.cheapest.stock||0})` : 'No data';
      const updatedAgo = item.cache.updatedAt ? timeAgo(item.cache.updatedAt) : 'never';
      const goalVal = item.goal || 0; const holdVal = item.hold || 0; const progressPct = item.progressPct || 0;
      return `
        <div style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.02);margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-weight:900">${item.name}</div>
            <div style="font-size:12px;color:#ddd">Updated: ${updatedAgo}</div>
          </div>

          <div style="margin-top:8px;font-size:13px">Cheapest: <span style="color:var(--neon-drug);font-weight:900">${cheapestText}</span></div>

          <div style="margin-top:10px;display:flex;gap:12px;align-items:center">
            <div style="display:flex;flex-direction:column">
              <div class="pfn_small">Hold (auto)</div>
              <input data-drug="${item.name}" class="pfn_hold_input" type="number" readonly value="${holdVal}">
            </div>

            <div style="flex:1">
              <div class="pfn_small">Est total (cheapest)</div>
              <div style="font-weight:900;color:#b7ff6a">${fmtMoney((item.cheapest && item.cheapest.price)?(item.cheapest.price*holdVal):0)}</div>
              <div style="font-size:12px;color:#ddd;margin-top:6px">Market value (owned): <span style="font-weight:900;color:#ffb86b">${fmtMoney(item.marketOwned||0)}</span></div>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
              <button data-drug="${item.name}" class="pfn_btn pfn_open_json" data-type="drug" style="background:linear-gradient(180deg,#99ff60,#7bf000)">Edit JSON</button>
              <button data-drug="${item.name}" class="pfn_btn pfn_calc_btn" data-type="drug" style="background:linear-gradient(180deg,#99ff60,#7bf000)">Calc for X</button>
            </div>
          </div>

          <div style="margin-top:12px;display:flex;gap:10px;align-items:center">
            ${ goalVal > 0
              ? `<div style="flex:1"><div class="pfn_small">Goal: <b>${goalVal}</b></div><div class="pfn_progwrap"><div class="pfn_prog" style="width:${progressPct}%;"></div></div></div><button data-drug="${item.name}" class="pfn_btn pfn_unlock_goal">Unlock</button>`
              : `<div style="flex:1;display:flex;gap:8px;align-items:center"><div class="pfn_small">Set goal:</div><input data-drug="${item.name}" class="pfn_goal_input" type="number" min="0" value="${goalVal||''}" style="width:100px;padding:6px;border-radius:6px;background:#070707;color:#fff;border:1px solid rgba(255,255,255,0.03)"></div><button data-drug="${item.name}" class="pfn_btn pfn_lock_goal">Lock</button>`
            }
          </div>
        </div>
      `;
    }).join('');
    list.innerHTML = rowsHtml;

    // listeners
    document.querySelectorAll('.pfn_open_json').forEach(btn=>btn.addEventListener('click', e=>openModalForItem('drug', btn.dataset.drug)));
    document.querySelectorAll('.pfn_calc_btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const key = btn.dataset.drug;
        const q = prompt(`Enter quantity to calculate total cost for ${key}:`, '1');
        if (q === null) return;
        const qty = Math.max(0, parseInt(q,10)||0);
        const cheapest = findCheapestForDrug(key);
        if (!cheapest || typeof cheapest.price !== 'number') { alert('No data for cheapest price for ' + key); return; }
        alert(`Estimated cost for ${qty} ${key}: ${fmtMoney(cheapest.price*qty)} (cheapest: ${cheapest.country} at ${fmtMoney(cheapest.price)})`);
      });
    });
    document.querySelectorAll('.pfn_lock_goal').forEach(btn=>btn.addEventListener('click', e=>{
      const key = btn.dataset.drug; const input = document.querySelector(`input.pfn_goal_input[data-drug="${key}"]`);
      const n = Math.max(0, parseInt(input.value||0,10)); GM_setValue(K.DRUG_GOAL_PREFIX + key, n); render();
    }));
    document.querySelectorAll('.pfn_unlock_goal').forEach(btn=>btn.addEventListener('click', e=>{
      const key = btn.dataset.drug; GM_setValue(K.DRUG_GOAL_PREFIX + key, 0); render();
    }));
  }

  function renderSettings(container) {
    container.innerHTML = `
      <div style="font-weight:900">Papanads PFD ADV MENU — v${VERSION}</div>
      <div style="margin-top:8px">
        <div class="pfn_small">Limited API Key (items/market):</div>
        <input id="pfn_torn_api" style="width:70%;padding:8px;border-radius:8px;background:#070707;color:#ffdede;border:1px solid rgba(255,255,255,0.03)" value="${apiTorn||''}">
        <button id="pfn_save_torn" class="pfn_btn">Save</button>
      </div>
      <div style="margin-top:8px">
        <div class="pfn_small">Yata API (optional - improves country prices):</div>
        <input id="pfn_yata_api" style="width:70%;padding:8px;border-radius:8px;background:#070707;color:#ffdede;border:1px solid rgba(255,255,255,0.03)" value="${apiYata||''}">
        <button id="pfn_save_yata" class="pfn_btn">Save</button>
      </div>

      <div style="margin-top:8px;display:flex;gap:8px">
        <button id="pfn_test_apis" class="pfn_btn">Test APIs</button>
        <button id="pfn_update_all" class="pfn_btn">Update everything</button>
        <button id="pfn_backup_market" class="pfn_btn">Backup market & data</button>
        <button id="pfn_restore_market" class="pfn_btn">Restore backup</button>
        <button id="pfn_how_it" class="pfn_btn">HOW IT WORKS</button>
      </div>

      <div style="margin-top:8px" class="pfn_small">Donate: <span style="color:#b7ff6a">feel free to donate a xanax to Papanad[3928917]</span></div>
      <div style="margin-top:8px" class="pfn_small">Last market update: ${marketCache._updated ? timeAgo(marketCache._updated) : 'never'}</div>
    `;

    document.getElementById('pfn_save_torn').addEventListener('click', ()=>{
      const v = document.getElementById('pfn_torn_api').value.trim();
      apiTorn = v; GM_setValue(K.API_TORN, apiTorn); toast('Saved Limited API key');
    });
    document.getElementById('pfn_save_yata').addEventListener('click', ()=>{
      const v = document.getElementById('pfn_yata_api').value.trim();
      apiYata = v; GM_setValue(K.API_YATA, apiYata); toast('Saved Yata API key');
    });

    document.getElementById('pfn_test_apis').addEventListener('click', async ()=>{
      let out = '';
      if (apiTorn) { try { const ok = await testTornApi(); out += `Torn API: ${ok ? 'OK' : 'Failed'}\n`; } catch(e){ out += 'Torn API: Failed\n'; } } else out += 'Torn API: (not set)\n';
      if (apiYata) { try { const ok = await testYataApi(); out += `Yata API: ${ok ? 'OK' : 'Failed'}\n`; } catch(e){ out += 'Yata API: Failed\n'; } } else out += 'Yata API: (not set)\n';
      alert(out);
    });

    document.getElementById('pfn_update_all').addEventListener('click', ()=>{
      fetchItems(); updateMarket(); fetchDrugData(true); fetchShopPlushes(true);
    });

    document.getElementById('pfn_backup_market').addEventListener('click', ()=>{
      const dump = { marketCache, drugCache, plushCache, flowerCache, when: Date.now() };
      GM_setValue(K.MARKET_BACKUP, dump);
      toast('Backup saved');
    });
    document.getElementById('pfn_restore_market').addEventListener('click', ()=>{
      const dump = GM_getValue(K.MARKET_BACKUP, null);
      if (!dump) { toast('No backup found'); return; }
      marketCache = dump.marketCache || marketCache;
      drugCache = dump.drugCache || drugCache;
      plushCache = dump.plushCache || plushCache;
      flowerCache = dump.flowerCache || flowerCache;
      GM_setValue(K.MARKET_CACHE, marketCache);
      GM_setValue(K.DRUG_CACHE, drugCache);
      GM_setValue(K.PLUSH_CACHE, plushCache);
      GM_setValue(K.FLOWER_CACHE, flowerCache);
      toast('Restored backup');
      render();
    });

    document.getElementById('pfn_how_it').addEventListener('click', ()=>{
      const html = `
        <div style="padding:8px; line-height:1.4; color:#ffdede">
          Hey tradesmen and tradeswomen — I hope my script helps you out!<br><br>
          It works with <strong>YATA</strong>. Get it here:<br>
          <a href="https://yata.yt/" target="_blank" rel="noreferrer">https://yata.yt/</a>
          <br><br>
          For best results for item tracking, put items in your display case. Torn removed the feature that allows tracking inventory reliably via API when changed; the script scans for changes and will auto-update.<br><br>
          If you are in your inventory it may add items in order; in your display case it will add them wherever. Enjoy :)
        </div>
      `;
      showInfoModal(html);
    });
  }

  function showInfoModal(html) {
    const infoText = document.getElementById('pfn_info_text');
    infoText.innerHTML = html;
    document.getElementById('pfn_info_modal').style.display = 'flex';
  }

  /* ============================
     Fetch / Test APIs
     ============================ */
  function testTornApi() {
    return new Promise((res, rej) => {
      GM_xmlhttpRequest({
        method:'GET',
        url: `https://api.torn.com/user/?selections=basic&key=${encodeURIComponent(apiTorn)}`,
        timeout:10000,
        onload(resp){ try { const json = JSON.parse(resp.responseText); if (json.error) res(false); else res(true); } catch(e){ res(false); } },
        onerror(){ res(false); }, ontimeout(){ res(false); }
      });
    });
  }
  function testYataApi() {
    return new Promise((res, rej) => {
      GM_xmlhttpRequest({
        method:'GET', url:'https://yata.yt/api/v1/travel/export/', timeout:10000,
        onload(resp){ try { const j = JSON.parse(resp.responseText); res(!!j); } catch(e){ res(false); } },
        onerror(){ res(false); }, ontimeout(){ res(false); }
      });
    });
  }

  /* ============================
     fetchDrugData(manual)
     ============================ */
  async function fetchDrugData(manual=false) {
    const yataOk = await fetchYataExport().catch(()=>false);
    if (!yataOk) {
      // fallback travel page scrapes
      for (const c of COUNTRIES) {
        try {
          const urlVariants = [
            `https://www.torn.com/travelagency.php?destination=${encodeURIComponent(c.name)}`,
            `https://www.torn.com/travelagency.php?country=${encodeURIComponent(c.name)}`,
            `https://www.torn.com/travelagency.php?destination=${encodeURIComponent(c.name)}&a=ajax`,
            `https://www.torn.com/travelagency.php`
          ];
          let text = null;
          for (const u of urlVariants) {
            try {
              text = await new Promise((resolve,reject)=>{
                GM_xmlhttpRequest({
                  method:'GET', url:u, timeout:12000,
                  onload(res){ if (res.status>=200 && res.status<400) resolve(res.responseText); else reject('bad'); },
                  onerror(){ reject('err') }, ontimeout(){ reject('timeout'); }
                });
              });
              if (text) break;
            } catch(e){ continue; }
          }
          if (!text) continue;
          const doc = new DOMParser().parseFromString(text,'text/html');
          const nodes = doc.querySelectorAll('.users-list li, .users-list > li, .users-list .user, .users-list > div, .item, li.item');
          for (const node of nodes) {
            try {
              const nameNode = node.querySelector('.item-info-wrap .item-name, .item-info-wrap .i-name, .item-info-wrap .item-name a') || node.querySelector('.item-name, .i-name, a, h3');
              const priceNode = node.querySelector('.item-info-wrap .cost .c-price, .cost .c-price, .c-price') || node.querySelector('.cost, .price');
              const stockNode = node.querySelector('.item-info-wrap .stock .stck-amount, .stock .stck-amount') || node.querySelector('.stock, .stck-amount');
              const name = nameNode ? (nameNode.textContent||nameNode.innerText).trim() : null;
              const price = priceNode ? Number((priceNode.textContent||priceNode.innerText).replace(/[$,\s]/g,'')) : null;
              const stock = stockNode ? Number((stockNode.textContent||stockNode.innerText).replace(/[,\s]/g,'')) : null;
              if (!name) continue;
              for (const drug of DRUGS) {
                if (name.toLowerCase().includes(drug.name.toLowerCase())) {
                  drugCache[drug.name] = drugCache[drug.name] || { countryPrices:{}, updatedAt:0 };
                  drugCache[drug.name].countryPrices[c.name] = { price:price||null, stock:stock||null, ts:Date.now() };
                  drugCache[drug.name].updatedAt = Date.now();
                }
              }
              for (const p of PLUSHIES) {
                if (name.toLowerCase().includes(p.name.toLowerCase())) {
                  plushCache[p.name] = plushCache[p.name] || { countryPrices:{}, updatedAt:0 };
                  plushCache[p.name].countryPrices[c.name] = { price:price||null, stock:stock||null, ts:Date.now() };
                  plushCache[p.name].updatedAt = Date.now();
                }
              }
              for (const f of FLOWERS) {
                if (name.toLowerCase().includes(f.name.toLowerCase())) {
                  flowerCache[f.name] = flowerCache[f.name] || { countryPrices:{}, updatedAt:0 };
                  flowerCache[f.name].countryPrices[c.name] = { price:price||null, stock:stock||null, ts:Date.now() };
                  flowerCache[f.name].updatedAt = Date.now();
                }
              }
            } catch(e){}
          }
        } catch(e){}
      }
      GM_setValue(K.DRUG_CACHE, drugCache);
      GM_setValue(K.PLUSH_CACHE, plushCache);
      GM_setValue(K.FLOWER_CACHE, flowerCache);
    }
    // ensure shop-only plushes have shop entries
    await fetchShopPlushes(manual);
    if (manual) toast('Item data updated (manual).');
    render();
  }

  /* ============================
     Init & periodic refresh
     ============================ */
  function init() {
    addStyles();
    buildUI();
    marketCache = GM_getValue(K.MARKET_CACHE, marketCache) || marketCache;
    drugCache = GM_getValue(K.DRUG_CACHE, drugCache) || drugCache;
    plushCache = GM_getValue(K.PLUSH_CACHE, plushCache) || plushCache;
    flowerCache = GM_getValue(K.FLOWER_CACHE, flowerCache) || flowerCache;
    apiTorn = GM_getValue(K.API_TORN, apiTorn) || apiTorn;
    apiYata = GM_getValue(K.API_YATA, apiYata) || apiYata;

    fetchItems().then(()=> {
      if (apiTorn) updateMarket();
      fetchDrugData(false); // silent
    });

    if (autoInterval) clearInterval(autoInterval);
    autoInterval = setInterval(()=> {
      fetchItems();
      fetchDrugData(false);
      if (apiTorn) updateMarket();
    }, REFRESH_INTERVAL_MS);
  }

  if (document.body) init();
  else {
    new MutationObserver((m,o)=>{ if (document.body) { o.disconnect(); init(); } }).observe(document.documentElement, { childList:true });
  }

  /* ============================
     Expose helpers for debugging
     ============================ */
  window.PFNH = {
    fetchItems, updateMarket, fetchDrugData, fetchShopPlushes,
    getState: ()=>({ apiTorn, apiYata, marketCache, drugCache, plushCache, flowerCache, plushCounts, flowerCounts, drugCounts })
  };

})();
