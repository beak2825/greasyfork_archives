// ==UserScript==
// @name         Torn NPO Faction OC Item Handling
// @namespace    https://torn.com/
// @version      1.1.2
// @description  Scrapes Torion OC pages and adds action buttons + logs on /item.php
// @author       Canixe [3753120]
// @match        https://www.torn.com/item.php*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      torion.npowned.net
// @downloadURL https://update.greasyfork.org/scripts/548570/Torn%20NPO%20Faction%20OC%20Item%20Handling.user.js
// @updateURL https://update.greasyfork.org/scripts/548570/Torn%20NPO%20Faction%20OC%20Item%20Handling.meta.js
// ==/UserScript==

(() => {
  "use strict";

  //////////////////////////////////////////////////////////////////////////////
  // 1) CONFIG (edit these)
  //////////////////////////////////////////////////////////////////////////////
  const MSG_REUSABLE   = "For upcoming OC, return when OC completed";
  const MSG_CONSUMABLE = "For upcoming OC";
  const MSG_DEFAULT    = "For upcoming OC";

  const PANELS = [
    { id: "Strength",   url: "https://torion.npowned.net/members/strength/organized-crimes" },
    { id: "Prosperity", url: "https://torion.npowned.net/members/prosperity/organized-crimes" },
    { id: "Endurance",  url: "https://torion.npowned.net/members/endurance/organized-crimes" },
    { id: "Valour",     url: "https://torion.npowned.net/members/valour/organized-crimes" },
    { id: "Serenity",   url: "https://torion.npowned.net/members/serenity/organized-crimes" },
    { id: "Peace",      url: "https://torion.npowned.net/members/peace/organized-crimes" },
  ];

  const REUSABLE_ITEMS = new Set([
    "Billfold", "Binoculars", "Bolt Cutters", "Construction Helmet",
    "Dental Mirror", "DSLR Camera", "Hand Drill", "Jemmy",
    "Lockpicks", "Net", "Police Badge", "RF Detector",
    "Wire Cutters", "Wireless Dongle",
  ]);
  const CONSUMABLE_ITEMS = new Set([
    "ATM Key", "Blood Bag : Irradiated", "C4 Explosive", "Chloroform",
    "Core Drill", "Dog Treats", "Firewalk Virus", "Flash Grenade",
    "Gasoline", "ID Badge", "PCP", "Shaped Charge",
    "Smoke Grenade", "Spray Paint : Black", "Stealth Virus", "Syringe",
    "Zip Ties", "Tunneling Virus",
  ]);

  //////////////////////////////////////////////////////////////////////////////
  // 2) CONSTANTS
  //////////////////////////////////////////////////////////////////////////////
  const SECTION_ID = "tf-oc-item-handling";
  const TITLE_TEXT = "NPO OC Item Handling";

  //////////////////////////////////////////////////////////////////////////////
  // 3) STYLES
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

    /* grid of cards */
    #${SECTION_ID} .tf-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
      gap:5px;
    }

    /* card */
    #${SECTION_ID} .card{
      border:1px solid var(--default-panel-divider-outer-side-color);
      border-radius:6px;
      background: var(--default-bg-panel-color);
      padding:8px; min-height:110px; display:flex; flex-direction:column;
    }
    #${SECTION_ID} .card h4{
      margin:0 0 6px; font-weight:700; font-size:13px;
      display:flex; gap:8px; align-items:center;
    }
    #${SECTION_ID} .card a.small{ font-size:11px; text-decoration:underline; color:var(--default-blue-color); }

    /* list + row buttons */
    #${SECTION_ID} .card ul{ list-style:none; margin:0; padding-left:0; }
    #${SECTION_ID} .card li{ display:flex; align-items:flex-start; gap:6px; line-height:1.35; }
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
    #${SECTION_ID} .tf-deadline{ margin-left:6px; font-size:11px; opacity:.8; }
    #${SECTION_ID} .tf-deadline.overdue{ color:#b00020; opacity:1; font-weight:600; }
    #${SECTION_ID} .tf-icon { width:14px; height:14px; display:inline-block; vertical-align:-2px; }
    #${SECTION_ID} .tf-rowbtn svg.tf-icon { width:12px; height:12px; }
    @media (pointer:coarse){
      #${SECTION_ID} .tf-rowbtn { width:22px; height:22px; }       /* bigger tap target on mobile */
      #${SECTION_ID} .tf-rowbtn svg.tf-icon { width:16px; height:16px; }
    }
  `;

  //////////////////////////////////////////////////////////////////////////////
  // 4) UTILITIES
  //////////////////////////////////////////////////////////////////////////////
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const normalize = s => (s||"").replace(/\s+/g," ").trim().toLowerCase();

  function getMessageForItem(item){
    if (REUSABLE_ITEMS.has(item))   return MSG_REUSABLE;
    if (CONSUMABLE_ITEMS.has(item)) return MSG_CONSUMABLE;
    return MSG_DEFAULT;
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

  //////////////////////////////////////////////////////////////////////////////
  // 5) STORAGE / MENU
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
  // 6) DOM
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

  //////////////////////////////////////////////////////////////////////////////
  // 7) NETWORKING
  //////////////////////////////////////////////////////////////////////////////
  const httpGet = (url) => {
    const fn = (typeof GM !== "undefined" && GM.xmlHttpRequest) ? GM.xmlHttpRequest : GM_xmlhttpRequest;
    return new Promise((resolve,reject) => {
      fn({
        method:"GET", url, headers:{Accept:"text/html,application/xhtml+xml"},
        onload:res => (res.status>=200 && res.status<300) ? resolve(res.responseText) : reject(new Error(`HTTP ${res.status}`)),
        onerror:() => reject(new Error("Network error")),
        ontimeout:() => reject(new Error("Request timed out")), timeout:20000
      });
    });
  };

  //////////////////////////////////////////////////////////////////////////////
  // 8) DATA BUILDERS
  //////////////////////////////////////////////////////////////////////////////
  function parseMissingItems(html){
    const doc = new DOMParser().parseFromString(html, "text/html");
    const alert = doc.querySelector('div[role="alert"]');
    if(!alert) return [];
    return Array.from(alert.querySelectorAll("ul li")).map(li => li.textContent.trim()).filter(Boolean);
  }

  function parseLineInfo(line){
    const m = line.match(/^\s*(.+?)\s*\[(\d+)\]\s*\((.+?)\)\s*$/);
    return m ? { raw:line, playerName:m[1].trim(), playerId:m[2].trim(), itemName:m[3].trim() } : { raw:line, playerName:"", playerId:"", itemName:line };
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
  // 9) ACTIONS
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
    let btn = await waitFor(() => findVisibleSendButtonByName(itemName), 30, 80);
    if(btn){ clickEl(btn); return true; }

    const row = findItemLiByName(itemName);
    if(row){
      const thumb = row.querySelector('.thumbnail-wrap, .thumbnail') || row;
      ["mouseenter","mouseover","mousemove"].forEach(t => thumb.dispatchEvent(new MouseEvent(t,{bubbles:true})));
      await delay(80);
      btn = findVisibleSendButtonByName(itemName);
      if(btn){ clickEl(btn); return true; }
    }
    return false;
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

  function addLogEntry({ itemName, playerName, message, amount = 1 }) {
    const wrap = document.getElementById(`${SECTION_ID}-logwrap`);
    const ul   = document.getElementById(`${SECTION_ID}-loglist`);
    if (!wrap || !ul) return;

    const msg = message && message.trim() ? message.trim() : "";

    const uncountables = [
      "pcp", "chloroform", "gasoline"
    ];
    function formatItem(amount, name) {
      if (amount > 1) return `${amount}x ${name}`;
      const lower = name.toLowerCase();
      if (uncountables.includes(lower)) return `some ${name}`;
      if (lower.endsWith("s")) return `some ${name}`;
      if (/^[aeiou]/i.test(name)) return `an ${name}`;
      return `a ${name}`;
    }
    const itemLabel = formatItem(amount, itemName);

    let line = `${getServerTimeFormatted()} You sent ${itemLabel} to ${playerName}`;
    if (msg) line += ` with the message: ${msg}`;

    const li = document.createElement("li");
    li.textContent = line;
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
  // 10) PANELS
  //////////////////////////////////////////////////////////////////////////////
  function makePanelCard({ id, url }){
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>
        <span>${id}</span>
        <span class="spinner" aria-live="polite">loading…</span>
      </h4>
      <div class="content muted">Fetching…</div>
    `;
    return card;
  }

  async function loadCardFromAPI(card, url){
    const spinner = card.querySelector(".spinner");
    const content = card.querySelector(".content");
    try{
      spinner.textContent = "loading…";
      const html    = await httpGet(url);
      const entries = parseMissingItems(html);
      let missingIds = "";

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

      entries.sort((a, b) => {
        const A = (typeof a.readyAt === "number") ? a.readyAt : Infinity;
        const B = (typeof b.readyAt === "number") ? b.readyAt : Infinity;
        return A - B;
      });

      let warningHtml = "";
      if (missingIds.length){
        warningHtml = `<div class="error" style="margin-bottom:6px;">
          Missing item mappings for IDs: ${missingIds.join(", ")}.
          Please add them to REUSABLE_ITEMS or CONSUMABLE_ITEMS.
        </div>`;
      }

      if(!entries.length){
        content.innerHTML = `${warningHtml}<div class="muted">No missing item requirements found.</div>`;
      }else{
        const ul = document.createElement("ul");
        const frag = document.createDocumentFragment();

        entries.forEach(line => {
          const li = document.createElement("li");
          const info = parseLineInfo(line);

          attachMultiActionButton(li, [
            { label: ICONS.search, title: "Search item", run: async () => {
              const s = await waitFor(() => document.getElementById("items_search"), 20, 100);
              setInputValue(s, info.itemName || line); if(s) s.focus();
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
              setInputValue(m, getMessageForItem(info.itemName)); if(m) m.focus();
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

              // Log using the confirm-step snapshot if available,
              // otherwise fall back to the final message or to our known info.
              if (info.playerName) {
                addLogEntry({ itemName: info.itemName, playerName: info.playerName, message: getMessageForItem(info.itemName)  });
              } else if (pending && pending.itemName && pending.playerName) {
                addLogEntry(pending);
              } else {
                const conf = await waitFor(() => scrapeSendConfirmation(), 40, 120);
                if (conf) addLogEntry(conf);
                else addLogEntry({ itemName: info.itemName, playerName: info.playerName, message: getMessageForName(info.itemName) });
              }

              btn.innerHTML = ICONS.check;
              btn.classList.add("tf-done"); btn.disabled = true;
            }},
          ], line);

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

        content.innerHTML = "";
        ul.appendChild(frag);
        content.appendChild(ul);
      }
    }catch(err){
      content.innerHTML = `<div class="error">Failed to load: ${err?.message || err}</div>`;
    }finally{
      spinner.textContent = "";
      content.classList.remove("muted");
    }
  }

  // ================================
  // QUICK SEND (Spreadsheet deep link)
  // ================================

  /**
   * Entrypoint — parses URL params and renders the Quick Send card.
   * Inert unless: NPO_User + (NPO_Items or NPO_Item+NPO_Qty).
   */
  function tryRenderQuickSendFromURL() {
    const params = new URLSearchParams(location.search);
    const preMsg = (params.get("NPO_Msg")  || "").trim();

    // A) Existing single-recipient mode
    const user  = (params.get("NPO_User") || "").trim();
    const pairs = parseNPOItems(params); // [{ item, qty }, ...]

    // B) New multi-recipient mode (single item to many users)
    const fixedItem = (params.get("NPO_Item") || "").trim();
    const distro    = parseNPORecipients(params); // [{ user, qty }, ...]

    // Inert unless one of the two modes has all inputs
    const isSingle = !!(user && pairs.length);
    const isMulti  = !!(fixedItem && distro.length);
    if (!isSingle && !isMulti) return;

    const wrap      = document.getElementById(SECTION_ID);
    const contentEl = document.getElementById(`${SECTION_ID}-content`);
    const grid      = document.getElementById(`${SECTION_ID}-grid`);
    const ph        = document.getElementById(`${SECTION_ID}-placeholder`);
    if (!wrap || !contentEl || !grid) return;
    if (document.getElementById(`${SECTION_ID}-qs-card`)) return;

    if (ph) ph.style.display = "none";
    contentEl.hidden = false;
    const toggleBtn = document.getElementById(`${SECTION_ID}-toggle`);
    if (toggleBtn?.getAttribute("aria-expanded") === "false") toggleBtn.click();

    const { card, ul, msgBox } = buildQuickSendCard(preMsg);
    ensureQuickSendGridStyles();
    grid.parentElement.insertBefore(card, grid);

    const renderers = [];

    if (isSingle) {
      // one user, many items (existing behavior)
      for (const { item, qty } of pairs) {
        const li = document.createElement("li");
        ul.appendChild(li);
        const render = makeRowRenderer({
          li, item, qty, user,
          getMsg: () => (msgBox.value || "").trim()
        });
        render(true);
        renderers.push(render);
      }
    } else {
      // one item, many users (new behavior)
      for (const { user: u, qty } of distro) {
        const li = document.createElement("li");
        ul.appendChild(li);
        const render = makeRowRenderer({
          li, item: fixedItem, qty, user: u,
          getMsg: () => (msgBox.value || "").trim()
        });
        render(true);
        renderers.push(render);
      }
    }
    applyQuickSendLayout(ul);

    msgBox.addEventListener("input", () => renderers.forEach(r => r()));

    const clear = card.querySelector(`#${SECTION_ID}-qs-clear`);
    if (clear && !clear.dataset.bound) {
      clear.dataset.bound = "1";
      clear.addEventListener("click", (e) => {
        e.preventDefault();
        history.replaceState(null, "", location.pathname);
        card.remove();
      });
    }
  }

  function ensureQuickSendGridStyles() {
    if (document.getElementById(`${SECTION_ID}-qs-grid-style`)) return;
    const css = `
    #${SECTION_ID}-qs-card ul.qs-grid {
      display: grid;
      grid-template-columns: repeat(var(--qs-cols, 1), minmax(260px, 1fr));
      gap: 8px 12px;
      align-items: start;
      list-style: none;
      padding-left: 0;
      margin: 0;
    }
    /* Keep it readable on small screens */
    @media (max-width: 900px) {
      #${SECTION_ID}-qs-card ul.qs-grid {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }
    }
  `;
    const style = document.createElement("style");
    style.id = `${SECTION_ID}-qs-grid-style`;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function applyQuickSendLayout(ul) {
    if (!ul) return;
    const count = ul.children.length;
    const cols = count > 30 ? 3 : (count > 10 ? 2 : 1);
    ul.classList.add("qs-grid");
    ul.style.setProperty("--qs-cols", cols);
  }

  /**
   * Parse item list from URL.
   * Preferred: NPO_Items="Name:Qty,Name:Qty,..."
   * Fallback:  NPO_Item + NPO_Qty
   */
  function parseNPOItems(params) {
    const listStr = (params.get("NPO_Items") || "").trim();
    const pairs = [];

    if (listStr) {
      // Split on commas (simple names assumed; if you ever need commas in names we can extend this)
      for (const raw of listStr.split(/,\s*/)) {
        if (!raw) continue;
        const [namePart, qtyPart] = raw.split("->");
        const name = (namePart || "").trim();
        const qty  = parseInt((qtyPart || "1").trim(), 10);
        if (name && Number.isFinite(qty) && qty > 0) pairs.push({ item: name, qty });
      }
    }

    if (pairs.length) return pairs;

    // Fallback single
    const singleItem = (params.get("NPO_Item") || "").trim();
    const singleQty  = parseInt((params.get("NPO_Qty") || "1").trim(), 10);
    if (singleItem && Number.isFinite(singleQty) && singleQty > 0) {
      return [{ item: singleItem, qty: singleQty }];
    }

    return [];
  }
  function parseNPORecipients(params){
    const listStr = (params.get("NPO_Distribute") || "").trim();
    const out = [];
    if (listStr) {
      for (const raw of listStr.split(/,\s*/)) {
        const idx = raw.lastIndexOf("->");
        if (idx < 0) continue;
        const name = raw.slice(0, idx).trim();
        const qty  = parseInt(raw.slice(idx + 2).trim(), 10);
        if (name && Number.isFinite(qty) && qty > 0) out.push({ user: name, qty });
      }
    }
    return out;
  }

  /**
   * Build the Quick Send card DOM.
   */
  function buildQuickSendCard(preMsg) {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `${SECTION_ID}-qs-card`;
    card.innerHTML = `
    <h4 class="flex-between">
      <span>Quick Send</span>
      <a class="small" href="#" id="${SECTION_ID}-qs-clear">clear</a>
    </h4>
    <div class="content">
      <div class="m-bottom10">
        <label class="small block m-bottom5">Message to include (optional)</label>
        <input id="${SECTION_ID}-qs-message" type="text" class="tf-input" maxlength="200" placeholder="e.g., OC Supplies 7/22" />
      </div>
      <ul id="${SECTION_ID}-qs-list"></ul>
    </div>
  `;

    const ul     = card.querySelector(`#${SECTION_ID}-qs-list`);
    const msgBox = card.querySelector(`#${SECTION_ID}-qs-message`);
    if (preMsg) msgBox.value = preMsg;

    return { card, ul, msgBox };
  }

  /**
   * Build a row renderer — rebuilds the stepper when the message presence changes.
   * Omits “message” steps entirely when empty (no dead clicks).
   */
  function makeRowRenderer({ li, item, qty, user, getMsg }) {
    let lastHasMsg = null;

    return function render(force = false) {
      const msgVal = getMsg();
      const hasMsg = !!msgVal;
      if (!force && hasMsg === lastHasMsg) return;
      lastHasMsg = hasMsg;

      // Rebuild row
      li.innerHTML = "";

      const steps = [
        {
          label: ICONS.search,
          title: "Search item",
          run: async () => {
            const s = await waitFor(() => document.getElementById("items_search"), 20, 100);
            setInputValue(s, item);
            if (s) s.focus();
          }
        },
        {
          label: ICONS.send,
          title: "Open Send",
          run: async () => {
            const ok = await actionSendItemByName(item);
            if (!ok) console.warn("Send button not found/visible for:", item);
          }
        },
        {
          label: ICONS.user,
          title: "Set recipient",
          run: async () => {
            const u = await waitFor(() => document.querySelector('input.ac-search[name="userID"]'), 40, 100);
            setInputValue(u, user);
            if (u) u.focus();
          }
        },
        {
          label: ICONS.hash,
          title: `Set quantity (${qty})`,
          run: async () => {
            const visible = await waitFor(
              () => document.querySelector('.amount-wrap .input-money-group input.input-money[type="text"]'),
              40, 100
            );
            const hidden = await waitFor(
              () => document.querySelector('.amount-wrap .input-money-group input.input-money[type="hidden"][name="amount"]'),
              40, 100
            );
            if (!visible || !hidden) { console.warn("Amount inputs not found"); return; }
            setInputValue(visible, String(qty));
            setInputValue(hidden,  String(qty));
            visible.dispatchEvent(new Event('input',  { bubbles: true }));
            visible.dispatchEvent(new Event('change', { bubbles: true }));
            hidden .dispatchEvent(new Event('input',  { bubbles: true }));
            hidden .dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      ];

      if (hasMsg) {
        steps.push(
          {
            label: ICONS.comment,
            title: "Toggle message",
            run: async () => {
              let ok = clickMessageToggle();
              if (!ok) { await delay(120); clickMessageToggle(); }
            }
          },
          {
            label: ICONS.pen,
            title: "Write message",
            run: async () => {
              const m = await waitFor(
                () => document.querySelector('form[action*="sendAction"] input.message[name="tag"]'),
                50, 120
              );
              if (!m) { console.warn("Message input not found"); return; }
              m.value = msgVal;
              m.dispatchEvent(new Event('input',  { bubbles: true }));
              m.dispatchEvent(new Event('change', { bubbles: true }));
              await delay(60);
              if (m.value !== msgVal) {
                const m2 = document.querySelector('form[action*="sendAction"] input.message[name="tag"]');
                if (m2) {
                  m2.value = msgVal;
                  m2.dispatchEvent(new Event('input',  { bubbles: true }));
                  m2.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }
              m.focus();
            }
          }
        );
      }

      steps.push(
        {
          label: ICONS.arrowRight,
          title: "Submit",
          run: async () => {
            const send = await waitFor(
              () => document.querySelector('input.torn-btn[type="submit"][value="SEND"]'),
              50, 100
            );
            if (!send) return console.warn("SEND submit not found");
            clickEl(send);
          }
        },
        {
          label: ICONS.check,
          title: "Confirm & log",
          run: async (btn) => {
            const yes = await waitFor(
              () => document.querySelector('a.next-act.t-blue, a.yes, .confirm-action a.t-blue'),
              50, 120
            );
            if (yes) clickEl(yes); else console.warn("Yes confirm not found");

            const msgNow = getMsg();
            addLogEntry({ itemName: item, playerName: user, message: msgNow || undefined, amount: qty });

            btn.innerHTML = ICONS.check;
            btn.classList.add("tf-done");
            btn.disabled = true;
          }
        }
      );

      attachMultiActionButton(li, steps, `${item} × ${qty} → ${user}`);
    };
  }

  //////////////////////////////////////////////////////////////////////////////
  // 11) BOOT
  //////////////////////////////////////////////////////////////////////////////
  async function refreshAll(){
    const grid = document.getElementById(`${SECTION_ID}-grid`);
    const ph   = document.getElementById(`${SECTION_ID}-placeholder`);
    if(ph) ph.style.display = "none";
    grid.style.display = "";
    grid.innerHTML = "";
    const cards = PANELS.map(p => { const c = makePanelCard(p); grid.appendChild(c); return { p, c }; });
    await Promise.all(cards.map(({ p, c }) => loadCardFromAPI(c, p.url)));
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
  tryRenderQuickSendFromURL();
  observe();
})();