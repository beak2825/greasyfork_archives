// ==UserScript==
// @name         Torn Faction OC Item Handling
// @namespace    https://torn.com/
// @version      1.1.1
// @description  Uses Torn API to list missing OC item requirements for your faction and adds quick-send helpers on /item.php
// @author       Canixe [3753120]
// @match        https://www.torn.com/item.php*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.registerMenuCommand
// @grant        GM_registerMenuCommand
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/549057/Torn%20Faction%20OC%20Item%20Handling.user.js
// @updateURL https://update.greasyfork.org/scripts/549057/Torn%20Faction%20OC%20Item%20Handling.meta.js
// ==/UserScript==

(() => {
  "use strict";

  //////////////////////////////////////////////////////////////////////////////
  // CONSTANTS
  //////////////////////////////////////////////////////////////////////////////
  const SECTION_ID  = "tf-oc-item-handling";
  const TITLE_TEXT  = "Faction OC Item Handling";
  const API_COMMENT = "TF-OC-Item-Handling";
  const API_URL     = "https://api.torn.com/v2/faction/crimes";
  const ITEMS_URL   = "https://api.torn.com/v2/torn/items";
  const ITEMS_CACHE_KEY = "itemsCatalogV1";
  const ITEMS_TTL_MS    = 24 * 60 * 60 * 1000; // 24 hours cache

  const FILTER_STATUS_KEY = "filterOcStatus";
  const FILTER_TYPE_KEY   = "filterItemType";
  const DEFAULT_STATUS = "Recruiting,Planning";
  const DEFAULT_TYPES  = "Consumables,Reusables";
  const ALLOWED_STATUS = ["Recruiting", "Planning"];
  const ALLOWED_TYPES  = ["Consumables", "Reusables"];

  const DEFAULT_MSG_REUSABLE   = "For upcoming OC, return when OC completed";
  const DEFAULT_MSG_CONSUMABLE = "For upcoming OC";
  const KEY_MSG_REUSABLE   = `${SECTION_ID}:msg:reusable`;
  const KEY_MSG_CONSUMABLE = `${SECTION_ID}:msg:consumable`;

  const SHOW_THANKS = false;
  const TEST_MODE = false;

  const TEST_FIXTURE = {
    crimes: [{
      id: 999999,
      name: "Dummy Organized Crime",
      status: "Planning",
      ready_at: 1757942576,
      slots: [{
        user: { id: 3753120, name: null },
        item_requirement: { id: 201, is_reusable: false, is_available: false }
      }]
    }, {
      id: 999999,
      name: "Dummy Organized Crime",
      status: "Planning",
      ready_at: 1757942576,
      slots: [{
        user: { id: 3753120, name: null },
        item_requirement: { id: 1431, is_reusable: false, is_available: false }
      }]
    }, {
      id: 999999,
      name: "Dummy Organized Crime",
      status: "Planning",
      ready_at: 1757942576,
      slots: [{
        user: { id: 3753120, name: null },
        item_requirement: { id: 1429, is_reusable: false, is_available: false }
      }]
    }, {
      id: 999999,
      name: "Dummy Organized Crime",
      status: "Planning",
      ready_at: 1757942576,
      slots: [{
        user: { id: 3753120, name: null },
        item_requirement: { id: 1203, is_reusable: true, is_available: false }
      }]
    }]
  };

  //////////////////////////////////////////////////////////////////////////////
  // STYLES
  //////////////////////////////////////////////////////////////////////////////
  const ICONS = {
    refresh:     '<svg class="tf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M21 13a8 8 0 1 1-3-6.74L21 8"/></svg>',
    search:      '<svg class="tf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    send:        '<svg class="tf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9 22 2"/></svg>',
    user:        '<svg class="tf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
    comment:     '<svg class="tf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    pen:         '<svg class="tf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    arrowRight:  '<svg class="tf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    check:       '<svg class="tf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  };

  const style = `
    #${SECTION_ID} { margin-bottom:14px; }
    #${SECTION_ID} .tf-refresh{
      display:inline-flex; align-items:center; gap:6px;
      color:#fff; font-weight:600; cursor:pointer; user-select:none;
      padding:0 4px; text-decoration:none;
    }
    #${SECTION_ID} .tf-refresh:hover{ text-decoration:underline; }
    #${SECTION_ID}-content{
      padding:5px;
      background: var(--default-bg-panel-color);
      border-radius: 0 0 6px 6px;
    }
    #${SECTION_ID} .tf-muted{ opacity:.75; font-style:italic; padding:4px 2px; }

    /* grid: main content dominates, thanks card slim on the right (wide screens) */
    #${SECTION_ID} .tf-grid{
      display:grid; gap:8px; align-items:start;
      grid-template-columns: 1fr;
    }
    @media (min-width: 980px){
      #${SECTION_ID} .tf-grid{ grid-template-columns: minmax(340px, 1fr) 220px; }
    }
    @media (min-width: 980px){
      #${SECTION_ID} .tf-grid.no-thanks{ grid-template-columns: minmax(340px, 1fr); }
    }

    /* card */
    #${SECTION_ID} .card{
      border:1px solid var(--default-panel-divider-outer-side-color);
      border-radius:6px;
      background: var(--default-bg-panel-color);
      padding:8px; display:flex; flex-direction:column;
    }
    #${SECTION_ID} .card h4{
      margin:0 0 6px; font-weight:700; font-size:13px;
      display:flex; gap:8px; align-items:center; justify-content:space-between;
    }
    #${SECTION_ID} .card a.small{ font-size:11px; text-decoration:underline; color:var(--default-blue-color); }

    /* list + row buttons */
    #${SECTION_ID} .card ul{ list-style:none; margin:0; padding-left:0; }
    #${SECTION_ID} .card li{ display:flex; align-items:flex-start; gap:6px; line-height:1.35; padding:2px 0; }
    #${SECTION_ID} .tf-rowbtn{
      display:inline-flex; align-items:center; justify-content:center;
      width:16px; height:16px; margin-top:1px; flex:0 0 auto; padding:0;
      border:1px solid var(--default-panel-divider-outer-side-color);
      border-radius:3px; cursor:pointer; font-size:11px; line-height:1;
      background: var(--default-bg-panel-active-color);
    }
    #${SECTION_ID} .tf-rowbtn:hover{ filter:brightness(1.06); }
    #${SECTION_ID} .tf-rowbtn.tf-done{ opacity:.65; cursor:default; }

    /* misc */
    #${SECTION_ID} .spinner{ font-size:12px; opacity:.7; }
    #${SECTION_ID} .error{ color:#b00020; }
    #${SECTION_ID} .hint{ font-size:12px; opacity:.8; }

    /* log */
    #${SECTION_ID} .tf-log h4{ margin:0 0 6px; font-weight:700; font-size:13px; }
    #${SECTION_ID} .tf-log ul{ margin:0; padding-left:18px; }
    #${SECTION_ID} .tf-log-head{
      display:flex; align-items:center; justify-content:space-between;
      margin:0 0 6px; font-weight:700; font-size:13px;
    }
    #${SECTION_ID} .tf-copy{
      font-size:12px; padding:2px 8px; cursor:pointer; border-radius:4px;
      border:1px solid var(--default-panel-divider-outer-side-color);
      background: var(--default-bg-panel-active-color);
    }
    #${SECTION_ID} .tf-copy:hover{ filter:brightness(1.06); }

    /* settings area */
    #${SECTION_ID} .pill { display:inline-block; border:1px solid var(--default-panel-divider-outer-side-color); border-radius:999px; padding:2px 8px; font-size:11px; margin-right:6px; background:var(--default-bg-panel-active-color); }
    #${SECTION_ID} .pill a { color:var(--default-blue-color); text-decoration:underline; }
    #${SECTION_ID} .tf-tip { font-size:11px; opacity:.75; }

    /* thanks card — extra small and subtle */
    #${SECTION_ID} .card--thanks{
      font-size:11px; opacity:.7; padding:6px;
    }
    #${SECTION_ID} .card--thanks h4{ font-size:12px; margin-bottom:4px; }
    #${SECTION_ID} .card--thanks p{ margin:0; line-height:1.3; }
    #${SECTION_ID} .card--thanks a{ color:var(--default-blue-color); text-decoration:underline; }
    #${SECTION_ID} .tf-deadline{ margin-left:6px; font-size:11px; opacity:.8; }
    #${SECTION_ID} .tf-deadline.overdue{ color:#b00020; opacity:1; font-weight:600; }
    #${SECTION_ID} .tf-icon { width:14px; height:14px; display:inline-block; vertical-align:-2px; }
    #${SECTION_ID} .tf-rowbtn svg.tf-icon { width:12px; height:12px; }
    @media (pointer:coarse){
      #${SECTION_ID} .tf-rowbtn { width:22px; height:22px; }       /* bigger tap target on mobile */
      #${SECTION_ID} .tf-rowbtn svg.tf-icon { width:16px; height:16px; }
    }
    #${SECTION_ID} .tf-buy {
      margin-left: 8px;
      font-size: 11px;
      padding: 2px 6px;
      border: 1px solid var(--default-panel-divider-outer-side-color);
      border-radius: 4px;
      background: var(--default-bg-panel-active-color);
      color: var(--default-blue-color);
      text-decoration: underline;
    }
    .tf-popover{
      position: fixed;
      z-index: 2147483647;
      min-width:220px; max-width:280px; padding:8px;
      border:1px solid var(--default-panel-divider-outer-side-color);
      border-radius:6px; background:var(--default-bg-panel-color);
      box-shadow:0 8px 20px rgba(0,0,0,.25);
      max-height: calc(100vh - 24px);
      overflow: auto;
    }
    .tf-popover-backdrop{
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      background: transparent;       /* keep it invisible */
    }
    .tf-popover .hd{ font-weight:700; margin:0 0 6px; display:flex; justify-content:space-between; align-items:center; }
    .tf-popover .bd label{ display:flex; align-items:center; gap:6px; margin:3px 0; }
    .tf-popover .ft{ margin-top:8px; display:flex; gap:6px; justify-content:flex-end; }
    .tf-btn{
      font-size:12px; padding:3px 8px; border-radius:4px; cursor:pointer;
      border:1px solid var(--default-panel-divider-outer-side-color);
      background:var(--default-bg-panel-active-color);
    }
    .tf-btn:hover{ filter:brightness(1.06); }
    .tf-popover .bd textarea{
      width:100%; min-height:48px; resize:vertical;
      background:var(--default-bg-panel-active-color);
      border:1px solid var(--default-panel-divider-outer-side-color);
      border-radius:6px; padding:6px; font:inherit;
    }
    .tf-popover .hd .tf-close{
      text-decoration:none; line-height:1; padding:0 6px;
    }
  `;

  //////////////////////////////////////////////////////////////////////////////
  // UTILITIES
  //////////////////////////////////////////////////////////////////////////////
  let ID_TO_NAME = new Map();
  let ID_TO_TYPE = new Map();
  let NAME_TO_ID = new Map();

  let MSG_REUSABLE_CUR   = DEFAULT_MSG_REUSABLE;
  let MSG_CONSUMABLE_CUR = DEFAULT_MSG_CONSUMABLE;

  const delay = ms => new Promise(r => setTimeout(r, ms));
  const normalize = s => (s||"").replace(/\s+/g," ").trim().toLowerCase();

  async function loadMessageTemplates(){
    MSG_REUSABLE_CUR   = await getSetting(KEY_MSG_REUSABLE,   DEFAULT_MSG_REUSABLE);
    MSG_CONSUMABLE_CUR = await getSetting(KEY_MSG_CONSUMABLE, DEFAULT_MSG_CONSUMABLE);
  }

  function getMessageByType(isReusable){
    return isReusable ? MSG_REUSABLE_CUR : MSG_CONSUMABLE_CUR;
  }

  function setInputValue(el, value){
    if(!el) return;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter ? setter.call(el, value) : (el.value = value);
    el.dispatchEvent(new Event("input",  { bubbles:true }));
    el.dispatchEvent(new Event("change", { bubbles:true }));
    el.dispatchEvent(new KeyboardEvent("keyup", { bubbles:true, key:"Enter" }));
  }
  async function waitFor(fn, tries=30, ms=100){
    for(let i=0;i<tries;i++){ const v = fn(); if(v) return v; await delay(ms); }
    return null;
  }
  function clickEl(el){ if(!el) return false; el.dispatchEvent(new MouseEvent("mousedown",{bubbles:true})); el.dispatchEvent(new MouseEvent("mouseup",{bubbles:true})); el.click(); return true; }
  function isVisible(el){
    if(!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return cs.display!=="none" && cs.visibility!=="hidden" && r.width>0 && r.height>0;
  }
  function getServerEpochSec(){
    const el = document.querySelector(".tc-clock .server-date-time");
    if (el) {
      const m = el.textContent.trim().match(/^[A-Za-z]{3}\s+(\d{2}):(\d{2}):(\d{2})\s*-\s*(\d{2})\/(\d{2})\/(\d{2})$/);
      if (m) {
        const hh = +m[1], mm = +m[2], ss = +m[3];
        const DD = +m[4], MM = +m[5], YY = +m[6];

        return Math.floor(Date.UTC(2000 + YY, MM - 1, DD, hh, mm, ss) / 1000);
      }
    }
    return Math.floor(Date.now() / 1000);
  }
  function getServerTimeFormatted(){
    const epoch = getServerEpochSec();
    const d = new Date(epoch * 1000);
    const p = n => String(n).padStart(2, "0");

    return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} - ${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)}/${String(d.getUTCFullYear()).slice(-2)}`;
  }

  function buildMarketUrlByName(itemName) {
    const base = "https://www.torn.com/page.php?sid=ItemMarket#/market/view=search";
    const id = NAME_TO_ID.get(normalize(itemName));
    if (!id) return `${base}&itemName=${encodeURIComponent(itemName)}`;

    const type = ID_TO_TYPE.get(id);
    const typeParam = type ? `&itemType=${encodeURIComponent(type)}` : "";
    return `${base}&itemID=${id}&itemName=${encodeURIComponent(itemName)}${typeParam}`;
  }

  function parseMulti(str, allowed) {
    const set = new Set(
      String(str || "")
      .split(",")
      .map(s => s.trim())
      .filter(v => allowed.includes(v))
    );
    return set.size ? set : new Set(allowed);
  }

  function prettyList(setOrArr) {
    return Array.from(setOrArr).join(", ");
  }

  function showCheckboxPopover(anchorEl, { title, options, selected, onSave }) {
    const sel = new Set(selected || []);

    const pop = document.createElement("div");
    pop.className = "tf-popover";
    pop.innerHTML = `
      <div class="hd">
        <span>${title}</span>
        <button type="button" class="tf-btn tf-close">×</button>
      </div>
      <div class="bd"></div>
      <div class="ft">
        <button type="button" class="tf-btn tf-cancel">Cancel</button>
        <button type="button" class="tf-btn tf-save">Save</button>
      </div>
    `;

    const bd = pop.querySelector(".bd");
    options.forEach(opt => {
      const id = `tfopt-${title.replace(/\s+/g,'-')}-${opt.value}`;
      const row = document.createElement("label");
      row.innerHTML = `
      <input type="checkbox" id="${id}" value="${opt.value}">
      <span>${opt.label}</span>
    `;
      const cb = row.querySelector("input");
      cb.checked = sel.has(opt.value);
      cb.addEventListener("change", () => {
        if (cb.checked) sel.add(opt.value); else sel.delete(opt.value);
      });
      bd.appendChild(row);
    });

    // Backdrop + attach
    const backdrop = document.createElement('div');
    backdrop.className = 'tf-popover-backdrop';
    document.body.appendChild(backdrop);
    document.body.appendChild(pop);

    // Initial placement + keep in view on resize/scroll
    const place = () => clampPopoverToViewport(pop, anchorEl, 8);
    place();
    const onReflow = () => place();
    window.addEventListener('resize', onReflow, { passive: true });
    window.addEventListener('scroll', onReflow, { passive: true });

    // Close helpers
    const close = () => {
      window.removeEventListener('resize', onReflow);
      window.removeEventListener('scroll', onReflow);
      backdrop.remove();
      pop.remove();
      document.removeEventListener('keydown', onKey);
    };

    const onKey = (e) => { if (e.key === 'Escape') close(); };

    // Wire buttons + outside click
    pop.querySelector(".tf-close")  .addEventListener("click", close);
    pop.querySelector(".tf-cancel") .addEventListener("click", close);
    pop.querySelector(".tf-save")   .addEventListener("click", () => {
      if (sel.size === 0) return; // require at least one
      onSave(Array.from(sel));
      close();
    });
    backdrop.addEventListener('mousedown', close, { once: true });
    document.addEventListener('keydown', onKey);

  }

  function openMessagesPopover(anchorEl){
    document.querySelectorAll('.tf-popover, .tf-popover-backdrop').forEach(n => n.remove());

    const backdrop = document.createElement('div');
    backdrop.className = 'tf-popover-backdrop';

    const pop = document.createElement('div');
    pop.className = 'tf-popover';
    pop.innerHTML = `
    <div class="hd">
      <span>OC Send Messages</span>
      <a href="#" class="tf-btn tf-close" data-act="cancel" aria-label="Close">×</a>
    </div>
    <div class="bd">
      <label>
        <strong style="min-width:84px; display:inline-block;">Reusable</strong>
        <textarea id="${SECTION_ID}-msg-reusable" placeholder="${DEFAULT_MSG_REUSABLE}">${MSG_REUSABLE_CUR}</textarea>
      </label>
      <label>
        <strong style="min-width:84px; display:inline-block;">Consumable</strong>
        <textarea id="${SECTION_ID}-msg-consumable" placeholder="${DEFAULT_MSG_CONSUMABLE}">${MSG_CONSUMABLE_CUR}</textarea>
      </label>
    </div>
    <div class="ft">
      <button class="tf-btn" data-act="cancel">Cancel</button>
      <button class="tf-btn" data-act="save">Save</button>
    </div>
  `;

    document.body.appendChild(backdrop);
    document.body.appendChild(pop);

    const place = () => {
      const pad = 8;
      const r = anchorEl.getBoundingClientRect();
      const w = pop.offsetWidth || 280;
      const h = pop.offsetHeight || 120;
      let left = Math.max(pad, Math.min(r.left, window.innerWidth - w - pad));
      let top  = Math.max(pad, Math.min(r.bottom + 6, window.innerHeight - h - pad));
      pop.style.left = left + 'px';
      pop.style.top  = top  + 'px';
    };
    place();

    const ro = () => place();
    window.addEventListener('resize', ro, { passive:true });
    window.addEventListener('scroll', ro, { passive:true });

    const cleanup = () => {
      window.removeEventListener('resize', ro);
      window.removeEventListener('scroll', ro);
      backdrop.remove();
      pop.remove();
    };

    backdrop.addEventListener('mousedown', cleanup, { once:true });
    pop.addEventListener('click', async (e) => {
      const act = e.target?.dataset?.act;
      if(!act) return;
      e.preventDefault();
      if(act === 'cancel'){ cleanup(); return; }
      if(act === 'save'){
        const r = pop.querySelector(`#${SECTION_ID}-msg-reusable`)?.value ?? MSG_REUSABLE_CUR;
        const c = pop.querySelector(`#${SECTION_ID}-msg-consumable`)?.value ?? MSG_CONSUMABLE_CUR;
        await setSetting(KEY_MSG_REUSABLE, r.trim());
        await setSetting(KEY_MSG_CONSUMABLE, c.trim());
        await loadMessageTemplates();
        cleanup();
      }
    });
  }

  function clampPopoverToViewport(panelEl, triggerEl, offset = 8){
    if (!panelEl || !triggerEl) return;

    panelEl.style.position = 'fixed';
    panelEl.style.visibility = 'hidden';
    panelEl.style.display = 'block';

    const r = triggerEl.getBoundingClientRect();
    const w = panelEl.offsetWidth;
    const h = panelEl.offsetHeight;

    let top  = r.bottom + offset;
    let left = r.left;

    if (top + h > window.innerHeight - offset) {
      const above = r.top - h - offset;
      top = (above > offset) ? above : Math.max(offset, window.innerHeight - h - offset);
    }

    if (left + w > window.innerWidth - offset) left = Math.max(offset, window.innerWidth - w - offset);
    if (left < offset) left = offset;

    panelEl.style.top = `${top}px`;
    panelEl.style.left = `${left}px`;
    panelEl.style.visibility = '';
  }

  //////////////////////////////////////////////////////////////////////////////
  // STORAGE / MENU
  //////////////////////////////////////////////////////////////////////////////
  async function getSetting(key, def=""){
    try{
      if(typeof GM !== "undefined" && GM.getValue) return await GM.getValue(key, def);
      if(typeof GM_getValue !== "undefined"){
        const v = GM_getValue(key);
        return v == null ? def : v;
      }
    }catch{}
    return def;
  }
  async function setSetting(key, val){
    try{
      if(typeof GM !== "undefined" && GM.setValue) return await GM.setValue(key, val);
      if(typeof GM_setValue !== "undefined") return GM_setValue(key, val);
    }catch{}
  }
  function registerMenus(){
    const reg = (label, fn) => {
      if(typeof GM !== "undefined" && GM.registerMenuCommand) GM.registerMenuCommand(label, fn);
      else if(typeof GM_registerMenuCommand !== "undefined") GM_registerMenuCommand(label, fn);
    };
    reg("Set Torn API key", async () => {
      const cur = await getSetting("apiKey", "");
      const v = prompt("Enter your Torn API key (requires Minimal Access):", cur || "");
      if(v !== null) await setSetting("apiKey", v.trim());
      showSettingsHint();
    });
  }

  //////////////////////////////////////////////////////////////////////////////
  // DOM
  //////////////////////////////////////////////////////////////////////////////
  function injectStyle(){
    if(document.getElementById(`${SECTION_ID}-style`)) return;
    const s=document.createElement("style"); s.id=`${SECTION_ID}-style`; s.textContent=style; document.head.appendChild(s);
  }

  function makeSection(){
    if(document.getElementById(SECTION_ID)) return document.getElementById(SECTION_ID);

    const CLS = { wrap:"equipped-items-wrap", main:"main___QuzF7", header:"header___f_BFs", title:"title___nIMRx", icons:"icons___VmEI4", btn:"button___MO5cW", caretBtn:"iconParentButton___POutJ", caretFill:"grayFill___tkuer", content:"content___Gb8DR" };
    const OPEN_SVG     = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" class="${CLS.caretFill}"><path d="M1302,21l-5,5V16Z" transform="translate(-1294 -13)"></path></svg>`;
    const COLLAPSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="11" viewBox="0 0 16 11" class="${CLS.caretFill}"><path d="M1302,21l-5,5V16Z" transform="translate(29 -1294) rotate(90)"></path></svg>`;

    const wrap = document.createElement("div");
    wrap.id = SECTION_ID;
    wrap.className = CLS.wrap;
    wrap.innerHTML = `
      <div class="${CLS.main}">
        <header class="${CLS.header}">
          <p class="${CLS.title}" role="heading" aria-level="2">${TITLE_TEXT}</p>
          <nav class="${CLS.icons}">
            <div id="${SECTION_ID}-refresh" class="tf-refresh">${ICONS.refresh} Refresh</div>
            <button type="button" class="${CLS.btn} ${CLS.caretBtn}" id="${SECTION_ID}-toggle" aria-label="Open" aria-expanded="false">${OPEN_SVG}</button>
          </nav>
        </header>
        <div class="${CLS.content}" id="${SECTION_ID}-content" hidden>
          <div id="${SECTION_ID}-placeholder" class="tf-muted">Click Refresh to display information.</div>
          <div id="${SECTION_ID}-settings" class="hint" style="padding:4px 0 6px;"></div>
          <div class="tf-grid" id="${SECTION_ID}-grid" style="display:none"></div>
          <div id="${SECTION_ID}-logwrap" class="card tf-log" style="display:none">
            <h4 class="tf-log-head"><span>LOG</span><button type="button" id="${SECTION_ID}-copylog" class="tf-copy">Copy</button></h4>
            <ul id="${SECTION_ID}-loglist"></ul>
          </div>
        </div>
      </div>
    `;

    const contentEl = wrap.querySelector(`#${SECTION_ID}-content`);
    const toggleBtn = wrap.querySelector(`#${SECTION_ID}-toggle`);
    const setExpanded = (on) => {
      contentEl.hidden = !on;
      toggleBtn.setAttribute("aria-expanded", String(on));
      toggleBtn.setAttribute("aria-label", on ? "Collapse" : "Open");
      toggleBtn.innerHTML = on ? COLLAPSE_SVG : OPEN_SVG;
    };
    setExpanded(false);
    toggleBtn.addEventListener("click", e => { e.preventDefault(); setExpanded(toggleBtn.getAttribute("aria-expanded")==="false"); });

    return wrap;
  }

  function insertSection(){
    const section = makeSection();
    if(!section) return;
    const quickItems   = document.querySelector("#quickItems");
    const loadoutsRoot = document.querySelector("#loadoutsRoot");
    if(quickItems && loadoutsRoot)        loadoutsRoot.parentElement.insertBefore(section, loadoutsRoot);
    else if(quickItems)                   quickItems.insertAdjacentElement("afterend", section);
    else if(loadoutsRoot)                 loadoutsRoot.parentElement.insertBefore(section, loadoutsRoot);
    else { (document.querySelector(".main-items-cont-wrap") || document.body).prepend(section); }
  }

  async function showSettingsHint(){
    const el = document.getElementById(`${SECTION_ID}-settings`);
    if(!el) return;

    const testTag = TEST_MODE ? `<span class="pill" title="Using dummy data instead of the live API">TEST MODE</span>` : "";

    const key = await getSetting("apiKey","");
    const keyBadge = key
      ? `<span class="pill">API key: <em>set</em> · <a href="#" id="${SECTION_ID}-setkey">edit</a></span>`
      : `<span class="pill">API key: <strong>not set</strong> · <a href="#" id="${SECTION_ID}-setkey">set</a></span>`;
    const tip = key ? "" : `<span class="tf-tip">Requires <em>Minimal Access</em>.</span>`;

    const msgsPill = `<span class="pill"><a href="#" id="${SECTION_ID}-editmsgs">Messages</a></span>`;

    const statusSel = parseMulti(await getSetting(FILTER_STATUS_KEY, DEFAULT_STATUS), ALLOWED_STATUS);
    const typesSel  = parseMulti(await getSetting(FILTER_TYPE_KEY,   DEFAULT_TYPES),  ALLOWED_TYPES);

    const statusBadge = `<span class="pill">OC status: <em>${prettyList(statusSel)}</em> · <a href="#" id="${SECTION_ID}-setstatus">edit</a></span>`;
    const typeBadge   = `<span class="pill">Item type: <em>${prettyList(typesSel)}</em> · <a href="#" id="${SECTION_ID}-settype">edit</a></span>`;

    el.innerHTML = `${testTag} ${keyBadge}${tip ? " " + tip : ""} ${msgsPill} ${statusBadge} ${typeBadge}`;

    el.querySelector(`#${SECTION_ID}-setkey`)?.addEventListener("click", async (e)=>{
      e.preventDefault();
      const cur=await getSetting("apiKey","");
      const v=prompt("Enter your Torn API key (requires Minimal Access):", cur||"");
      if(v!==null){ await setSetting("apiKey", v.trim()); showSettingsHint(); }
    });

    el.querySelector(`#${SECTION_ID}-setstatus`)?.addEventListener("click", async (e)=>{
      e.preventDefault();

      const current = parseMulti(await getSetting(FILTER_STATUS_KEY, DEFAULT_STATUS), ALLOWED_STATUS);
      showCheckboxPopover(e.currentTarget, {
        title: "OC status",
        options: [
          { value: "Recruiting", label: "Recruiting" },
          { value: "Planning",   label: "Planning"   },
        ],
        selected: current,
        onSave: async (vals) => {
          await setSetting(FILTER_STATUS_KEY, vals.join(","));
          await showSettingsHint();            // refresh pills text
          await refreshAll();                  // reload data with new filter
        }
      });
    });

    el.querySelector(`#${SECTION_ID}-settype`)?.addEventListener("click", async (e)=>{
      e.preventDefault();

      const current = parseMulti(await getSetting(FILTER_TYPE_KEY, DEFAULT_TYPES), ALLOWED_TYPES);
      showCheckboxPopover(e.currentTarget, {
        title: "Item type",
        options: [
          { value: "Consumables", label: "Consumables" },
          { value: "Reusables",   label: "Reusables"   },
        ],
        selected: current,
        onSave: async (vals) => {
          await setSetting(FILTER_TYPE_KEY, vals.join(","));
          await showSettingsHint();
          await refreshAll();
        }
      });
    });

    el.querySelector(`#${SECTION_ID}-editmsgs`)?.addEventListener('click', (e) => {
      e.preventDefault();
      openMessagesPopover(e.currentTarget);
    });

    await loadMessageTemplates();
  }

  //////////////////////////////////////////////////////////////////////////////
  // NETWORKING
  //////////////////////////////////////////////////////////////////////////////
  const httpGetJSON = (url) => {
    const fn = (typeof GM !== "undefined" && GM.xmlHttpRequest) ? GM.xmlHttpRequest : GM_xmlhttpRequest;
    return new Promise((resolve,reject) => {
      fn({
        method:"GET", url, headers:{Accept:"application/json"},
        onload:res => {
          if(!(res.status>=200 && res.status<300)) return reject(new Error(`HTTP ${res.status}`));
          try{
            const data = JSON.parse(res.responseText);
            if(data && (data.error || data.code)){
              const code = data.error?.code ?? data.code ?? "unknown";
              const msg  = data.error?.error ?? data.error?.message ?? "API error";
              const nice =
                    (code === 5 || code === 17) ? "Rate limited: please try again in ~30s" :
                    (code === 7) ? "Incorrect ID-entity relation — this key lacks Faction API Access (ask your faction to grant it)." :
                    msg;
              reject(new Error(`Torn API error ${code}: ${nice}`));
            }else{
              resolve(data);
            }
          }catch(e){ reject(new Error("Invalid JSON response")); }
        },
        onerror:() => reject(new Error("Network error")),
        ontimeout:() => reject(new Error("Request timed out")),
        timeout:25000
      });
    });
  };

  async function fetchCrimesForCat(cat) {
    const key = await getSetting("apiKey","");
    if(!key) throw new Error("No Torn API key set. Use the menu or the 'set' link above.");
    const u = new URL(API_URL);
    u.searchParams.set("comment", API_COMMENT);
    u.searchParams.set("key", key.trim());
    u.searchParams.set("cat", String(cat).toLowerCase());
    return await httpGetJSON(u.toString());
  }

  async function fetchCrimesFromTorn(cats) {
    if (TEST_MODE) return TEST_FIXTURE;

    const list = (Array.isArray(cats) && cats.length) ? cats : ALLOWED_STATUS;
    const results = await Promise.allSettled(list.map(c => fetchCrimesForCat(c)));

    let crimes = [];
    let firstErr = null;

    for (const r of results) {
      if (r.status === "fulfilled" && r.value && r.value.crimes) {
        const arr = Array.isArray(r.value.crimes) ? r.value.crimes : Object.values(r.value.crimes);
        crimes = crimes.concat(arr);
      } else if (!firstErr && r.status === "rejected") {
        firstErr = r.reason;
      }
    }

    if (!crimes.length && firstErr) throw firstErr;
    return { crimes };
  }


  function parseItemsPayload(json){
    const raw = json?.items || json?.result?.items || json || {};
    let entries = Array.isArray(raw) ? raw
    : raw && typeof raw === "object" ? Object.entries(raw).map(([id, v]) => ({ id: Number(id), ...v }))
    : [];

    const byIdName = new Map();
    const byIdType = new Map();
    for (const it of entries) {
      const id = Number(it?.id);
      const nm = String(it?.name || "").trim();
      if (!Number.isFinite(id) || !nm) continue;
      byIdName.set(id, nm);
      if (it?.type) byIdType.set(id, String(it.type));
    }
    return { byIdName, byIdType };
  }

  function mergeCatalogMaps({ byIdName, byIdType }){
    ID_TO_NAME = byIdName || new Map();
    ID_TO_TYPE = byIdType || new Map();
    NAME_TO_ID = new Map([...ID_TO_NAME].map(([id, nm]) => [normalize(nm), id]));
  }

  async function ensureItemsCatalog(){
    const cached = await getSetting(ITEMS_CACHE_KEY, "");
    if (cached) {
      try {
        const { ts, items } = JSON.parse(cached);
        if (ts && (Date.now() - ts) < ITEMS_TTL_MS && items) {
          mergeCatalogMaps(parseItemsPayload(items));
          return;
        }
      } catch {}
    }

    const key = await getSetting("apiKey", "");
    if (!key) return;

    const u = new URL(ITEMS_URL);
    u.searchParams.set("comment", API_COMMENT);
    u.searchParams.set("key", key.trim());

    const data = await httpGetJSON(u.toString());
    await setSetting(ITEMS_CACHE_KEY, JSON.stringify({ ts: Date.now(), items: data }));
    mergeCatalogMaps(parseItemsPayload(data));
  }

  //////////////////////////////////////////////////////////////////////////////
  // DATA BUILDERS
  //////////////////////////////////////////////////////////////////////////////
  function buildMissingEntriesFromAPI(json){
    const entries = [];
    const missingIds = new Set();

    const crimes = Array.isArray(json?.crimes) ? json.crimes : (json?.crimes ? Object.values(json.crimes) : []);
    for (const crime of crimes){
      const readyAt = crime?.ready_at ?? null;
      const slots = Array.isArray(crime?.slots) ? crime.slots : [];
      for (const slot of slots){
        const user = slot?.user;
        const req  = slot?.item_requirement;
        if (user && req && req.is_available === false){
          const uname = user.name || "";
          const uid   = user.id ?? user.user_id ?? "";
          const itemId = req.id ?? req.item_id ?? null;

          const nameFromAPI   = req.name || null;
          const nameFromItems = (itemId != null) ? ID_TO_NAME.get(Number(itemId)) : null;
          const friendly      = nameFromAPI || nameFromItems;

          if (!friendly){
            if (itemId != null) missingIds.add(Number(itemId));
            continue;
          }

          entries.push({
            playerName: uname,
            playerId: String(uid),
            itemName: friendly,
            itemId: Number(itemId) || null,
            isReusable: !!req.is_reusable,
            readyAt: (typeof readyAt === "number" ? readyAt : null),
            line: `${uname} [${uid}] (${friendly})`
          });
        }
      }
    }
    return { entries, missingIds: Array.from(missingIds) };
  }

  function scrapeSendConfirmation(){
    const wrap = document.querySelector('.action-wrap.send-act.msg-active');
    if(!wrap) return null;
    const p = wrap.querySelector('p');
    if(!p) return null;

    const itemEl     = p.querySelector('b');
    const userEl     = p.querySelector('a[href*="/profiles.php"]');
    const itemName   = itemEl?.textContent?.trim();
    const playerName = userEl?.textContent?.trim();

    const txt = p.textContent || "";
    const m = txt.match(/with the message:\s*(.+)$/i);
    const message = m ? m[1].trim() : "";

    if(!itemName || !playerName) return null;
    return { itemName, playerName, message };
  }

  function scrapePendingConfirm(){
    const form = document.querySelector('.action-wrap.send-act.msg-active form[data-confirm="1"]');
    if(!form) return null;

    const p = form.querySelector('p');
    const bTags = p ? p.querySelectorAll('b') : [];
    const itemName   = bTags[0]?.textContent?.trim() || "";
    const playerName = bTags[1]?.textContent?.trim() || "";

    let message = "";
    const tagInput = form.querySelector('input[name="tag"]');
    if(tagInput) {
      message = String(tagInput.value || "").trim();
    } else {
      const txt = p?.textContent || "";
      const m = txt.match(/message:\s*(.+?)\?$/i);
      message = m ? m[1].trim() : "";
    }

    if(!itemName || !playerName) return null;
    return { itemName, playerName, message };
  }

  //////////////////////////////////////////////////////////////////////////////
  // ACTIONS
  //////////////////////////////////////////////////////////////////////////////
  function findItemLiByName(itemName){
    const target = normalize(itemName);
    if(!target) return null;
    const rows = document.querySelectorAll('li[data-item][data-category]');
    for(const row of rows){
      const n = normalize((row.querySelector('.title-wrap .name-wrap .name') || row.querySelector('.name'))?.textContent);
      if(n === target) return row;
    }
    return null;
  }
  function clickMessageToggle(){
    const a = document.querySelector("a.action-message.left");
    return a ? (clickEl(a), true) : false;
  }
  function findVisibleSendButtonByName(itemName){
    const sel = `button.option-send[aria-label="Send ${CSS.escape(itemName)}"]`;
    const list = document.querySelectorAll(sel);
    for(const n of list){ if(isVisible(n)) return n; }
    return null;
  }
  async function actionSendItemByName(itemName){
    await delay(120);

    const row = findItemLiByName(itemName);
    if (!row) return false;

    const cont = row.querySelector('.cont-wrap[role="tabpanel"]');
    const header = row.querySelector('.title-wrap.ui-accordion-header');
    const isAccordion = !!header || document.querySelector('#items-search-tab.ui-accordion');

    if (isAccordion && cont && (cont.style.display === 'none' || cont.getAttribute('aria-expanded') === 'false')) {
      header?.click();
      await waitFor(() => cont.getAttribute('aria-expanded') === 'true', 15, 50);
    }

    let btn = await waitFor(() => findVisibleSendButtonByName(itemName), 30, 80);
    if(btn){ clickEl(btn); return true; }

    const thumb = row.querySelector('.thumbnail-wrap, .thumbnail') || row;
    ["mouseenter","mouseover","mousemove"].forEach(t => thumb.dispatchEvent(new MouseEvent(t,{bubbles:true})));
    await delay(80);
    btn = findVisibleSendButtonByName(itemName);
    if(btn){ clickEl(btn); return true; }
  }

  function attachMultiActionButton(li, actions, lineText){
    let state = 0;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tf-rowbtn";
    const setBtnUI = () => {
      const next = actions[state];
      btn.title = next?.title || "Next action";
      btn.innerHTML = next?.label ?? "•";
    };
    setBtnUI();

    const textNode = document.createTextNode(lineText);
    btn.addEventListener("click", async () => {
      const act = actions[state];
      if(act?.run){ try { await act.run(btn, state, lineText); } catch(e){ console.error("Row action error:", e); } }
      state = (state + 1) % actions.length;
      setBtnUI();
    });
    li.append(btn, textNode);
  }

  function addLogEntry({ itemName, playerName, message }){
    const wrap = document.getElementById(`${SECTION_ID}-logwrap`);
    const ul   = document.getElementById(`${SECTION_ID}-loglist`);
    if(!wrap || !ul) return;
    const li = document.createElement("li");
    li.textContent = `${getServerTimeFormatted()} You sent a ${itemName} to ${playerName} with the message: ${message}`;
    ul.appendChild(li);
    wrap.style.display = "";
  }

  async function copyLogsToClipboard(){
    const ul = document.getElementById(`${SECTION_ID}-loglist`);
    if(!ul) return false;
    const text = Array.from(ul.querySelectorAll("li"))
    .map(li => li.textContent.trim())
    .filter(Boolean)
    .join("\n");
    if(!text) return false;
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position="fixed"; ta.style.opacity="0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy"); document.body.removeChild(ta);
      return ok;
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // PANELS
  //////////////////////////////////////////////////////////////////////////////
  function makePanelCard(){
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>
        <span>Missing Items</span>
        <span class="spinner" aria-live="polite">loading…</span>
      </h4>
      <div class="content muted">Fetching…</div>
    `;
    return card;
  }

  function makeThanksCard(){
    const card = document.createElement("div");
    card.className = "card card--thanks";
    card.innerHTML = `
      <h4><span>Thanks</span></h4>
      <div class="content">
        <p>Free by <strong>Canixe</strong> · <a href="https://www.torn.com/bazaar.php?userId=3753120#/" target="_blank" rel="noopener">bazaar</a></p>
      </div>
    `;
    return card;
  }

  async function loadCardFromAPI(card){
    const spinner = card.querySelector(".spinner");
    const content = card.querySelector(".content");
    try{
      spinner.textContent = "loading…";
      const statusSel = parseMulti(await getSetting(FILTER_STATUS_KEY, DEFAULT_STATUS), ALLOWED_STATUS);
      const data = await fetchCrimesFromTorn(Array.from(statusSel));

      const { entries, missingIds } = buildMissingEntriesFromAPI(data);

      const typeSel = parseMulti(await getSetting(FILTER_TYPE_KEY, DEFAULT_TYPES), ALLOWED_TYPES);
      const allowReus = typeSel.has("Reusables");
      const allowCons = typeSel.has("Consumables");
      let filtered = entries.filter(e => (e.isReusable && allowReus) || (!e.isReusable && allowCons));
      filtered.sort((a, b) => {
        const A = (typeof a.readyAt === "number") ? a.readyAt : Infinity;
        const B = (typeof b.readyAt === "number") ? b.readyAt : Infinity;
        return A - B;
      });

      const serverNowSec = getServerEpochSec();

      const fmtDue = (readyAt) => {
        if (typeof readyAt !== "number" || !isFinite(readyAt)) return "";
        let dsec = readyAt - serverNowSec;
        const past = dsec < 0; dsec = Math.abs(dsec);
        const d = Math.floor(dsec / 86400); dsec %= 86400;
        const h = Math.floor(dsec / 3600);  dsec %= 3600;
        const m = Math.floor(dsec / 60);
        let txt = d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`;
        return past ? `${txt} ago` : `in ${txt}`;
      };

      let warningHtml = "";
      if (missingIds.length){
        warningHtml = `<div class="error" style="margin-bottom:6px;">
            Unknown item IDs (not found in Items catalog): ${missingIds.join(", ")}.
            Try Refresh (the Items list is cached ~24h).
          </div>`;
      }

      if(!filtered.length){
        content.innerHTML = `${warningHtml}<div class="muted">No missing item requirements found.</div>`;
      }else{
        const ul = document.createElement("ul");
        const frag = document.createDocumentFragment();

        filtered.forEach(info => {
          const li = document.createElement("li");

          attachMultiActionButton(li, [
            { label: ICONS.search, title: "Search item", run: async (btn) => {
              const s = await waitFor(() => document.getElementById("items_search"), 40, 120);
              setInputValue(s, info.itemName);
              if (s) s.focus();

              await waitFor(() => document.querySelector('#items-search-tab'), 60, 150);

              const status = await waitFor(() => {
                const tab = document.querySelector('#items-search-tab');
                if (!tab) return null;

                const qAttr = tab.getAttribute('data-query') || "";
                if (qAttr && normalize(qAttr) !== normalize(info.itemName)) {
                  return null;
                }

                if (tab.querySelector('li[data-item]')) return { kind: 'found' };
                const msg = tab.querySelector('.item-cont .info-msg, .info-msg');
                if (msg && /no items matching/i.test(msg.textContent)) {
                  return { kind: 'empty', el: msg };
                }
                return null;
              }, 80, 150);

              if (status && status.kind === 'empty') {
                btn.disabled = true;
                btn.classList.add('tf-done');
                btn.title = "Item not in your inventory";

                const li = btn.closest('li');
                if (li && !li.querySelector('.tf-buy')) {
                  const url = buildMarketUrlByName(info.itemName);
                  if (url) {
                    const a = document.createElement('a');
                    a.className = 'tf-buy';
                    a.href = url;
                    a.target = '_blank';
                    a.rel = 'noopener';
                    a.textContent = 'Buy on Market';
                    li.appendChild(a);
                  }
                }
              }
            }},
            { label: ICONS.send, title: "Open Send", run: async () => {
              const ok = await actionSendItemByName(info.itemName);
              if(!ok) console.warn("Send button not found/visible for:", info.itemName);
            }},
            { label: ICONS.user, title: "Set recipient", run: async () => {
              const u = await waitFor(() => document.querySelector('input.ac-search[name="userID"]'), 40, 100);
              setInputValue(u, info.playerName || info.playerId || ""); if(u) u.focus();
            }},
            { label: ICONS.comment, title: "Toggle message", run: async () => {
              let ok = clickMessageToggle(); if(!ok){ await delay(120); clickMessageToggle(); }
            }},
            { label: ICONS.pen, title: "Write message", run: async () => {
              const m = await waitFor(() => document.querySelector('input.message[name="tag"]'), 40, 100);
              setInputValue(m, getMessageByType(info.isReusable)); if(m) m.focus();
            }},
            { label: ICONS.arrowRight, title: "Submit", run: async () => {
              const send = await waitFor(() => document.querySelector('input.torn-btn[type="submit"][value="SEND"]'), 50, 100);
              if(!send) return console.warn("SEND submit not found");
              clickEl(send);
            }},
            { label: ICONS.check, title: "Confirm & log", run: async (btn) => {
              const form = await waitFor(
                () => document.querySelector('.action-wrap.send-act.msg-active form[data-confirm="1"]'),
                50, 120
              );
              const pending = form ? scrapePendingConfirm() : null;
              const yes = form
              ? form.querySelector('a.next-act.t-blue')
              : await waitFor(() => {
                const a = document.querySelector("a.next-act.t-blue");
                return a && /yes/i.test(a.textContent) ? a : null;
              }, 50, 120);

              if (yes) clickEl(yes);
              else console.warn("Yes confirm not found");

              if (pending && pending.itemName && pending.playerName) {
                addLogEntry(pending);
              } else {
                const conf = await waitFor(() => scrapeSendConfirmation(), 40, 120);
                if (conf) addLogEntry(conf);
                else addLogEntry({ itemName: info.itemName, playerName: info.playerName, message: getMessageByType(info.isReusable) });
              }

              btn.innerHTML = ICONS.check;
              btn.classList.add("tf-done"); btn.disabled = true;
            }},
          ], info.line);

          // append a small "due …" note if we have a deadline
          if (typeof info.readyAt === "number" && isFinite(info.readyAt)) {
            const due = document.createElement("span");
            due.className = "tf-deadline";
            due.textContent = `· due ${fmtDue(info.readyAt)}`;
            {
              const pad = n => String(n).padStart(2, "0");
              const dt  = new Date(info.readyAt * 1000);
              const tct = `${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}:${pad(dt.getUTCSeconds())} - ${pad(dt.getUTCDate())}/${pad(dt.getUTCMonth()+1)}/${String(dt.getUTCFullYear()).slice(2)} TCT`;
              const parts = Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(dt);
              const shortName = parts.find(p => p.type === "timeZoneName")?.value;

              const offsetMin = -dt.getTimezoneOffset(); // minutes east of UTC
              const sign = offsetMin >= 0 ? "+" : "-";
              const hhOff = pad(Math.floor(Math.abs(offsetMin) / 60));
              const mmOff = pad(Math.abs(offsetMin) % 60);
              const tzLabel = shortName || `UTC${sign}${hhOff}:${mmOff}`;
              const loc = `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())} - ${pad(dt.getDate())}/${pad(dt.getMonth()+1)}/${String(dt.getFullYear()).slice(2)} ${tzLabel}`;

              due.title = `Deadline:\u00A0${tct}<br/>Local:\u00A0${loc}`;
            }

            li.appendChild(due);
          }

          frag.appendChild(li);
        });

        content.innerHTML = warningHtml;
        ul.appendChild(frag);
        content.appendChild(ul);
      }
    }catch(err){
      content.innerHTML = `<div class="error">Failed to load: ${err?.message || err}</div>
                           <div class="hint">Tip: set your Torn API key (Minimal Access) via the button above.</div>`;
    }finally{
      spinner.textContent = "";
      content.classList.remove("muted");
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // BOOT
  //////////////////////////////////////////////////////////////////////////////
  async function refreshAll(){
    await showSettingsHint();
    const grid = document.getElementById(`${SECTION_ID}-grid`);
    const ph   = document.getElementById(`${SECTION_ID}-placeholder`);
    if(ph) ph.style.display = "none";
    grid.style.display = "";
    grid.innerHTML = "";

    const mainCard = makePanelCard();
    grid.appendChild(mainCard);

    if (SHOW_THANKS) {
      grid.classList.remove('no-thanks');
      grid.appendChild(makeThanksCard());
    } else {
      grid.classList.add('no-thanks');
    }

    await ensureItemsCatalog();
    await loadCardFromAPI(mainCard);
  }

  function wireUp(){
    const refreshBtn = document.getElementById(`${SECTION_ID}-refresh`);
    if(refreshBtn && !refreshBtn.dataset.bound){
      refreshBtn.dataset.bound = "1";
      refreshBtn.addEventListener("click", async e => {
        e.preventDefault();
        if (refreshBtn.dataset.loading === "1") return;
        refreshBtn.dataset.loading = "1";

        const toggleBtn = document.getElementById(`${SECTION_ID}-toggle`);
        if(toggleBtn?.getAttribute("aria-expanded")==="false") toggleBtn.click();

        try { await refreshAll(); }
        finally { delete refreshBtn.dataset.loading; }
      });
    }
    const copyBtn = document.getElementById(`${SECTION_ID}-copylog`);
    if(copyBtn && !copyBtn.dataset.bound){
      copyBtn.dataset.bound = "1";
      copyBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const ok = await copyLogsToClipboard();
        const prev = copyBtn.textContent;
        copyBtn.textContent = ok ? "Copied!" : "No logs";
        setTimeout(() => copyBtn.textContent = prev, 1200);
      });
    }
  }

  function observe(){
    const obs = new MutationObserver(() => {
      if(!location.pathname.includes("/item.php")) return;
      const el = document.getElementById(SECTION_ID);
      if(!el || !el.isConnected){ insertSection(); wireUp(); }
    });
    obs.observe(document.documentElement, { childList:true, subtree:true });
  }

  // init
  injectStyle();
  insertSection();
  wireUp();
  observe();
  registerMenus();
  showSettingsHint();
})();