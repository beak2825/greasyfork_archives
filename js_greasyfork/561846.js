// ==UserScript==
// @name         🌺 🐫 Points Exporter (Above PDA)
// @namespace    http://tampermonkey.net/
// @version      3.3.2
// @description  Travel page tracker: appears above PDA navigation, reads display + inventory, calculates sets, shows remaining & need, color-codes progress, low-on hints.
// @author       Nova
// @match        https://www.torn.com/page.php?sid=travel*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/561846/%F0%9F%8C%BA%20%F0%9F%90%AB%20Points%20Exporter%20%28Above%20PDA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561846/%F0%9F%8C%BA%20%F0%9F%90%AB%20Points%20Exporter%20%28Above%20PDA%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (!/page\.php\?sid=travel/.test(location.href)) return;

  const FLOWERS = {
    "Dahlia": { short: "Dahlia", loc: "MX 🇲🇽", country: "Mexico" },
    "Orchid": { short: "Orchid", loc: "HW 🏝️", country: "Hawaii" },
    "African Violet": { short: "Violet", loc: "SA 🇿🇦", country: "South Africa" },
    "Cherry Blossom": { short: "Cherry", loc: "JP 🇯🇵", country: "Japan" },
    "Peony": { short: "Peony", loc: "CN 🇨🇳", country: "China" },
    "Ceibo Flower": { short: "Ceibo", loc: "AR 🇦🇷", country: "Argentina" },
    "Edelweiss": { short: "Edelweiss", loc: "CH 🇨🇭", country: "Switzerland" },
    "Crocus": { short: "Crocus", loc: "CA 🇨🇦", country: "Canada" },
    "Heather": { short: "Heather", loc: "UK 🇬🇧", country: "United Kingdom" },
    "Tribulus Omanense": { short: "Tribulus", loc: "AE 🇦🇪", country: "UAE" },
    "Banana Orchid": { short: "Banana", loc: "KY 🇰🇾", country: "Cayman Islands" }
  };

  const PLUSHIES = {
    "Sheep Plushie": { short: "Sheep", loc: "B.B 🏪", country: "Torn City" },
    "Teddy Bear Plushie": { short: "Teddy", loc: "B.B 🏪", country: "Torn City" },
    "Kitten Plushie": { short: "Kitten", loc: "B.B 🏪", country: "Torn City" },
    "Jaguar Plushie": { short: "Jaguar", loc: "MX 🇲🇽", country: "Mexico" },
    "Wolverine Plushie": { short: "Wolverine", loc: "CA 🇨🇦", country: "Canada" },
    "Nessie Plushie": { short: "Nessie", loc: "UK 🇬🇧", country: "United Kingdom" },
    "Red Fox Plushie": { short: "Fox", loc: "UK 🇬🇧", country: "United Kingdom" },
    "Monkey Plushie": { short: "Monkey", loc: "AR 🇦🇷", country: "Argentina" },
    "Chamois Plushie": { short: "Chamois", loc: "CH 🇨🇭", country: "Switzerland" },
    "Panda Plushie": { short: "Panda", loc: "CN 🇨🇳", country: "China" },
    "Lion Plushie": { short: "Lion", loc: "SA 🇿🇦", country: "South Africa" },
    "Camel Plushie": { short: "Camel", loc: "AE 🇦🇪", country: "UAE" },
    "Stingray Plushie": { short: "Stingray", loc: "KY 🇰🇾", country: "Cayman Islands" }
  };

  function getPDANavHeight() {
    const nav = document.querySelector('#pda-nav') || document.querySelector('.pda');
    return nav ? nav.offsetHeight : 40; // fallback to 40px
  }

  GM_addStyle(`
    #setTrackerPanel {
      position: fixed;
      top: ${getPDANavHeight()}px;
      left: 18px;
      width: 250px;
      background: #0b0b0b;
      color: #eaeaea;
      font-family: "DejaVu Sans Mono", monospace;
      font-size: 9px;
      border: 1px solid #444;
      border-radius: 6px;
      z-index: 999999;
      box-shadow: 0 6px 16px rgba(0,0,0,0.5);
      max-height: 65vh;
      overflow-y: auto;
      line-height: 1.1;
    }
    #setTrackerHeader {
      background: #121212;
      padding: 4px 6px;
      cursor: pointer;
      font-weight:700;
      font-size:10px;
      border-bottom:1px solid #333;
      user-select:none;
    }
    #setTrackerContent { padding:6px; display:none; }
    .controls { margin-bottom:6px; }
    #setTrackerPanel button {
      margin: 2px 4px 6px 0;
      font-size:9px;
      padding:2px 6px;
      background:#171717;
      color:#eaeaea;
      border:1px solid #333;
      border-radius:3px;
      cursor:pointer;
    }
    #setTrackerPanel button:hover { background:#222; }
    .summary-line { font-weight:700; margin-bottom:6px; font-size:10px; color:#dfe7ff; }
    .low-line { color:#ff4d4d; font-weight:700; margin-bottom:6px; font-size:10px; }
    .group-title { font-weight:700; margin-top:6px; margin-bottom:4px; font-size:9.5px; }
    ul.item-list { margin:0 0 6px 0; padding:0; list-style:none; }
    li.item-row { display:flex; align-items:center; gap:6px; padding:2px 0; white-space:nowrap; }
    .item-name { flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; }
    .item-total { flex:0 0 40px; text-align:right; color:#cfe8c6; }
    .item-need { flex:0 0 60px; text-align:right; color:#f7b3b3; }
    .item-loc { flex:0 0 56px; text-align:right; color:#bcbcbc; font-size:8.5px; }
    #tc_status { font-size:9px; color:#bdbdbd; margin-bottom:6px; }
  `);

  const panel = document.createElement('div');
  panel.id = 'setTrackerPanel';
  panel.innerHTML = `
    <div id="setTrackerHeader">▶ 🌺 🐫 Points Exporter</div>
    <div id="setTrackerContent">
      <div class="controls">
        <button id="tc_refresh">Refresh</button>
        <button id="tc_setkey">Set API Key</button>
        <button id="tc_resetkey">Reset Key</button>
      </div>
      <div id="tc_status" class="summary-line">Waiting for API key...</div>
      <div id="tc_summary"></div>
      <div id="tc_content"></div>
    </div>
  `;
  document.body.appendChild(panel);

  const headerEl = panel.querySelector('#setTrackerHeader');
  const contentBox = panel.querySelector('#setTrackerContent');
  const statusEl = panel.querySelector('#tc_status');
  const summaryEl = panel.querySelector('#tc_summary');
  const contentEl = panel.querySelector('#tc_content');

  headerEl.addEventListener('click', () => {
    const open = contentBox.style.display === 'block';
    contentBox.style.display = open ? 'none' : 'block';
    headerEl.textContent = (open ? '▶' : '▼') + ' 🌺 🐫 Points Exporter';
  });

  panel.querySelector('#tc_refresh').addEventListener('click', () => loadData());
  panel.querySelector('#tc_setkey').addEventListener('click', () => askKey(true));
  panel.querySelector('#tc_resetkey').addEventListener('click', () => {
    GM_setValue('tornAPIKey', null);
    apiKey = null;
    statusEl.textContent = 'Key cleared. Click Set API Key.';
    summaryEl.innerHTML = '';
    contentEl.innerHTML = '';
    stopPolling();
  });

  let apiKey = GM_getValue('tornAPIKey', null);
  const POLL_INTERVAL_MS = 45 * 1000;
  let pollHandle = null;

  async function askKey(force) {
    if (!apiKey || force) {
      const k = prompt('Enter your Torn API key (needs display + inventory permissions):', apiKey || '');
      if (k) {
        apiKey = k.trim();
        GM_setValue('tornAPIKey', apiKey);
      }
    }
    if (apiKey) {
      startPolling();
      await loadData();
    }
  }

  function startPolling() {
    if (pollHandle) return;
    pollHandle = setInterval(loadData, POLL_INTERVAL_MS);
  }
  function stopPolling() {
    if (!pollHandle) return;
    clearInterval(pollHandle);
    pollHandle = null;
  }

  function aggregateFromApiResponse(data) {
    const items = {};
    const pushSrc = (src) => {
      if (!src) return;
      const entries = Array.isArray(src) ? src : Object.values(src);
      for (const e of entries) {
        if (!e) continue;
        const name = e.name || e.item_name || e.title || e.item || null;
        if (!name) continue;
        const qty = Number(e.quantity ?? e.qty ?? e.amount ?? 1) || 0;
        items[name] = (items[name] || 0) + qty;
      }
    };
    pushSrc(data.display);
    pushSrc(data.inventory);
    return items;
  }

  function buildRequiredList(mapObj) {
    const fullNames = Object.keys(mapObj);
    const shortNames = fullNames.map(fn => mapObj[fn].short);
    const locByShort = {};
    const countryByShort = {};
    fullNames.forEach(fn => {
      const s = mapObj[fn].short;
      locByShort[s] = mapObj[fn].loc;
      countryByShort[s] = mapObj[fn].country;
    });
    return { fullNames, shortNames, locByShort, countryByShort };
  }

  const flowersReq = buildRequiredList(FLOWERS);
  const plushReq = buildRequiredList(PLUSHIES);

  function countsForReq(itemsAgg, req, mapObj) {
    const counts = {};
    req.shortNames.forEach(s => counts[s] = 0);
    req.fullNames.forEach(fn => {
      const short = mapObj[fn].short;
      const q = itemsAgg[fn] || 0;
      counts[short] = (counts[short] || 0) + q;
    });
    return counts;
  }

  function calcSetsAndRemainderFromCounts(counts, shortNames) {
    const countsArr = shortNames.map(n => counts[n] || 0);
    const sets = countsArr.length ? Math.min(...countsArr) : 0;
    const remainder = {};
    shortNames.forEach(n => remainder[n] = Math.max(0, (counts[n] || 0) - sets));
    return { sets, remainder };
  }

  function findLowest(remainder, locMap, countryMap) {
    const keys = Object.keys(remainder);
    if (!keys.length) return null;
    let min = Infinity;
    keys.forEach(k => { if (remainder[k] < min) min = remainder[k]; });
    const allEqual = keys.every(k => remainder[k] === min);
    if (allEqual) return null;
    const key = keys.find(k => remainder[k] === min);
    return { short: key, rem: min, loc: locMap[key] || '', country: countryMap[key] || '' };
  }

  function colorForPercent(value, max) {
    if (!max || max === 0) return '#bdbdbd';
    const pct = (value / max) * 100;
    if (pct >= 75) return '#00c853';
    if (pct >= 40) return '#3399ff';
    return '#ff1744';
  }

  function renderUI(itemsAgg) {
    const flowerTotals = countsForReq(itemsAgg, flowersReq, FLOWERS);
    const plushTotals  = countsForReq(itemsAgg, plushReq, PLUSHIES);

    const fCalc = calcSetsAndRemainderFromCounts(flowerTotals, flowersReq.shortNames);
    const pCalc = calcSetsAndRemainderFromCounts(plushTotals, plushReq.shortNames);

    const totalSets = fCalc.sets + pCalc.sets;
    const totalPoints = totalSets * 10;
    summaryEl.innerHTML = `<div class="summary-line">Total sets: ${totalSets} | Points: ${totalPoints}</div>`;

    const fMax = Math.max(...Object.values(flowerTotals), 0);
    const pMax = Math.max(...Object.values(plushTotals), 0);

    const lowFlower = findLowest(fCalc.remainder, flowersReq.locByShort, flowersReq.countryByShort);
    const lowPlush  = findLowest(pCalc.remainder, plushReq.locByShort, plushReq.countryByShort);

    let html = '';

    if (lowFlower) {
      html += `<div class="low-line">🛫 Low on ${lowFlower.short} — travel to ${lowFlower.country} ${lowFlower.loc} and import 🛬</div>`;
    }

    html += `<div class="group-title">Flowers — sets: ${fCalc.sets} | pts: ${fCalc.sets * 10}</div>`;
    html += `<ul class="item-list">`;
    flowersReq.shortNames.forEach(name => {
      const total = flowerTotals[name] ?? 0;
      const rem = fCalc.remainder[name] ?? 0;
      const need = Math.max(0, fMax - total);
      const col = colorForPercent(total, fMax);
      html += `<li class="item-row" style="color:${col}">
        <span class="item-name">${name}</span>
        <span class="item-total">${rem}</span>
        <span class="item-need">(${need} need)</span>
        <span class="item-loc">${flowersReq.locByShort[name] || ''}</span>
      </li>`;
    });
    html += `</ul>`;

    if (lowPlush) {
      html += `<div class="low-line">🛫 Low on ${lowPlush.short} — travel to ${lowPlush.country} ${lowPlush.loc} and import 🛬</div>`;
    }

    html += `<div class="group-title">Plushies — sets: ${pCalc.sets} | pts: ${pCalc.sets * 10}</div>`;
    html += `<ul class="item-list">`;
    plushReq.shortNames.forEach(name => {
      const total = plushTotals[name] ?? 0;
      const rem = pCalc.remainder[name] ?? 0;
      const need = Math.max(0, pMax - total);
      const col = colorForPercent(total, pMax);
      html += `<li class="item-row" style="color:${col}">
        <span class="item-name">${name}</span>
        <span class="item-total">${rem}</span>
        <span class="item-need">(${need} need)</span>
        <span class="item-loc">${plushReq.locByShort[name] || ''}</span>
      </li>`;
    });
    html += `</ul>`;

    contentEl.innerHTML = html;
  }

  async function loadData() {
    summaryEl.innerHTML = '';
    contentEl.innerHTML = '';
    if (!apiKey) { statusEl.textContent = 'No API key set. Prompting...'; await askKey(false); if (!apiKey) return; }
    statusEl.textContent = 'Fetching display + inventory via API...';
    try {
      const url = `https://api.torn.com/user/?selections=display,inventory&key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) {
        statusEl.textContent = `API error: ${data.error.error} (code ${data.error.code})`;
        return;
      }
      const itemsAgg = aggregateFromApiResponse(data);
      renderUI(itemsAgg);
      statusEl.textContent = 'Loaded.';
    } catch (err) {
      statusEl.textContent = 'Fetch failed.';
      contentEl.innerHTML = `<div style="color:#f88;">${err.message || err}</div>`;
    }
  }

  if (apiKey) { startPolling(); loadData(); }
  else { setTimeout(() => askKey(false), 300); }
  window.addEventListener('beforeunload', () => stopPolling());

})();