// ==UserScript==
// @name         FMP More Player Info - More (Top Panel Layout)
// @description  Inserts Player Info + Position Ratings right under the charts (before #ScoutsBoard). Compact cards + color by strength.
// @version      3.3
// @match        https://footballmanagerproject.com/Team/Player?id=*
// @match        https://footballmanagerproject.com/Team/Player/?id=*
// @match        https://www.footballmanagerproject.com/Team/Player?id=*
// @match        https://www.footballmanagerproject.com/Team/Player/?id=*
// @grant        none
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/552842/FMP%20More%20Player%20Info%20-%20More%20%28Top%20Panel%20Layout%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552842/FMP%20More%20Player%20Info%20-%20More%20%28Top%20Panel%20Layout%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ------------------------------ Compact CSS ------------------------------ */
  addStyle(`
    /* Shorter charts */
    .apexcharts-canvas, .apexcharts-svg { height: 240px !important; }

    /* Panel container just under charts */
    #fmpx-panel {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 10px;
      align-items: start;
      margin: 10px 0 6px 0;
      width: 100%;
    }

    /* Cards — compact */
    .fmpx-card {
      background: #1f1f1f;
      border: 1px solid #333;
      border-radius: 10px;
      color: #eaeaea;
      box-shadow: 0 3px 12px rgba(0,0,0,0.35);
    }
    .fmpx-title {
      background: #2a2a2a;
      border-bottom: 1px solid #3a3a3a;
      padding: 8px 10px;
      font-weight: 700;
      font-size: 13px;
      text-align: center;
      color: #fff;
    }
    .fmpx-body { padding: 10px; font-size: 12px; }

    /* Info rows */
    .fmpx-row {
      display:flex; justify-content:space-between; align-items:center;
      background:#242424; border-left:3px solid #3d8bff;
      padding:6px 8px; margin-bottom:6px; border-radius:7px;
    }
    .fmpx-row .l { color:#bdbdbd; font-weight:600 }
    .fmpx-row .v { font-weight:700 }

    /* Ratings grid – extra compact */
    .fmpx-grid { display:grid; grid-template-columns:repeat(2,minmax(180px,1fr)); gap:6px }
    @media (min-width: 1100px){ .fmpx-grid { grid-template-columns:repeat(3,minmax(180px,1fr)); } }

    .fmpx-chip {
      background:#222; border:2px solid #3b3b3b; border-radius:8px;
      text-align:center; padding:5px 0 6px;
      line-height:1.1;
    }
    .fmpx-chip .pos { color:#bdbdbd; font-size:10px; margin-bottom:2px; letter-spacing:.2px }
    .fmpx-chip .val { font-size:15px; font-weight:800 }

    /* emphasis */
    .fmpx-chip.best { outline: 2px solid rgba(0,255,0,.25); }
    .fmpx-chip.main { box-shadow: inset 0 0 0 2px #ffdb00; }

    /* color scale (text + border) */
    .c-elite  { --col:#00ff88; }
    .c-great  { --col:#00d5ff; }
    .c-good   { --col:#ffc300; }
    .c-avg    { --col:#ff7a00; }
    .c-poor   { --col:#ff3b3b; }
    .fmpx-chip[class*="c-"] { border-color: var(--col); }
    .fmpx-chip[class*="c-"] .val { color: var(--col); }
  `);

  /* ------------------------------ Helpers ------------------------------ */
  function addStyle(css){ const s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); }
  const playerId = new URL(location.href).searchParams.get('id');
  const toNum = v => v==null ? NaN : Number(String(v).replace(/[,\s]/g,''));
  const fmtInt = n => String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const fmt = (v,d=1) => (isFinite(v) ? Number(v).toFixed(d) : '-');

  /* -------------------------- Fixed Placement -------------------------- */
  function ensurePanel() {
    const row = document.querySelector('.d-flex.flex-row.flex-wrap');
    const scouts = document.getElementById('ScoutsBoard');
    let panel = document.getElementById('fmpx-panel');
    if (panel) panel.remove();
    panel = document.createElement('div');
    panel.id = 'fmpx-panel';

    if (row && scouts && scouts.parentNode === row) {
      row.insertBefore(panel, scouts);            // just under the two charts
    } else if (row) {
      const form = document.getElementById('form-graph-div');
      if (form && form.parentNode === row) row.insertBefore(panel, form.nextSibling);
      else row.appendChild(panel);
    } else {
      document.body.appendChild(panel);           // last resort
    }
    return panel;
  }

  /* ------------------------------ Data fetch ------------------------------ */
  async function fetchPlayer() {
    const endpoints = [
      `/Team/Player?handler=PlayerData&playerId=${playerId}`,
      `/Team/Player?handler=PlayerData&id=${playerId}`
    ];
    for (const url of endpoints) {
      try {
        const r = await fetch(url, { headers: { 'Accept': 'application/json' }});
        if (!r.ok) continue;
        const j = await r.json();
        return j.player || j;
      } catch (_) {}
    }
    return null;
  }

  async function fetchMarket() {
    const out = {};
    try {
      const mv = await $.get('/Players/GetPlayerMarketValue', { playerid: playerId });
      if (mv && mv.marketValue != null) {
        out.marketValue = mv.marketValue;
        out.recycleValue = mv.marketValue / 2;
      }
    } catch (_) {}
    try {
      const bid = await fetch('/Players/GetDirectBidInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerid: playerId })
      }).then(r=>r.json());
      if (bid && bid.player) {
        out.isBotTeam = !!bid.player.isBotTeam;
        out.maxBid = bid.player.maxBid;
        out.minBid = bid.player.minimumBid;
      }
    } catch (_) {}
    return out;
  }

  /* ------------------------------ Parsing ------------------------------ */
  function parsePosCode(pObj) {
    const fp = (pObj.fp || pObj.fpf || pObj.position || '').toString().trim().toUpperCase();
    const map = { GK:0, DC:4, DL:5, DR:6, DMC:8, DML:9, DMR:10, MC:16, ML:17, MR:18, OMC:32, OML:33, OMR:34, FC:64 };
    return map[fp] ?? -1;
  }

  function decodeSkills(encoded, posCode) {
    if (!encoded || typeof encoded !== 'string') return null;
    try {
      const a = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
      const k = {};
      if (posCode === 0) {
        const names = ['Han','One','Ref','Aer','Ele','Jum','Kic','Thr','Pos','Sta','Pac','For'];
        for (let i=0;i<names.length;i++) k[names[i]] = a[i]/10;
        k.Rou = (a[12]*256 + a[13]) / 100;
      } else {
        const names = ['Mar','Tak','Tec','Pas','Cro','Fin','Hea','Lon','Pos','Sta','Pac','For'];
        for (let i=0;i<names.length;i++) k[names[i]] = a[i]/10;
        k.Rou = (a[12]*256 + a[13]) / 100;
      }
      return Object.values(k).every(v => isFinite(v)) ? k : null;
    } catch (_) { return null; }
  }

  const RatingRate = {
    0:[1.0,0.8,1.0,0.6,0.6,0.5,0.5,0.5,0.7,0.5,0.6],
    4:[1.0,1.0,0.5,0.5,0.3,0.2,1.0,0.6,0.9,0.8,0.5],
    5:[0.6,1.0,0.6,0.6,1.0,0.4,0.6,0.6,0.6,0.8,0.5],
    6:[0.6,1.0,0.6,0.6,1.0,0.4,0.6,0.6,0.6,0.8,0.5],
    8:[0.7,0.9,0.6,0.7,0.3,0.4,0.9,0.7,0.8,0.8,0.5],
    9:[0.5,1.0,0.6,0.7,1.0,0.4,0.6,0.6,0.6,0.8,0.5],
    10:[0.8,0.5,0.5,1.0,0.6,0.6,0.6,1.0,0.6,0.4,0.6],
    16:[0.5,0.7,0.8,1.0,0.4,0.5,0.6,0.7,0.8,0.8,0.5],
    17:[0.4,0.6,0.6,0.8,1.0,0.6,0.6,0.7,0.7,0.8,0.5],
    18:[0.4,0.6,0.6,0.8,1.0,0.6,0.6,0.7,0.7,0.8,0.5],
    32:[0.3,0.3,0.7,1.0,0.4,0.9,0.7,1.0,0.7,0.8,0.5],
    33:[0.3,0.5,0.7,0.8,1.0,0.6,0.6,0.7,0.8,0.8,0.5],
    34:[0.3,0.5,0.7,0.8,1.0,0.6,0.6,0.7,0.8,0.8,0.5],
    64:[0.2,0.5,0.7,0.7,0.4,1.0,1.0,0.8,0.7,0.8,0.5]
  };
  const posLabels = {4:'DC',5:'DL/DR',8:'DMC',9:'DML/DMR',16:'MC',17:'ML/MR',32:'OMC',33:'OML/OMR',64:'FC'};

  function getPosRating(s, pos) {
    if (pos === 0) {
      const vals = [s.Han,s.One,s.Ref,s.Aer,s.Ele,s.Jum,s.Kic,s.Thr,s.Pos,s.Sta,s.Pac];
      const w = RatingRate[0], sum = w.reduce((a,c)=>a+c,0);
      return vals.reduce((t,v,i)=>t+(v||0)*w[i],0)/sum;
    }
    const vals = [s.Mar,s.Tak,s.Tec,s.Pas,s.Cro,s.Fin,s.Hea,s.Lon,s.Pos,s.Sta,s.Pac];
    const w = RatingRate[pos] || RatingRate[16], sum = w.reduce((a,c)=>a+c,0);
    return vals.reduce((t,v,i)=>t+(v||0)*w[i],0)/sum;
  }

  /* ----------- color scale for value (same روح الألوان اللي بتحبها) ----------- */
  function colorClass(v){
    if (!isFinite(v)) return '';
    if (v >= 22) return 'c-elite';
    if (v >= 20) return 'c-great';
    if (v >= 17) return 'c-good';
    if (v >= 14) return 'c-avg';
    return 'c-poor';
  }

  /* ------------------------------- UI builders ------------------------------- */
  function row(label, value, color){
    const d = document.createElement('div'); d.className = 'fmpx-row';
    if (color) d.style.borderLeftColor = color;
    d.innerHTML = `<span class="l">${label}</span><span class="v" style="color:${color || '#fff'}">${value}</span>`;
    return d;
  }

  function buildInfoCard(root, info){
    const card = document.createElement('div'); card.className = 'fmpx-card';
    card.innerHTML = `<div class="fmpx-title">Player Info</div><div class="fmpx-body"></div>`;
    const body = card.querySelector('.fmpx-body');

    if (isFinite(info.marketValue)) body.appendChild(row('Market Value:', fmtInt(info.marketValue), '#4CAF50'));
    if (isFinite(info.recycleValue)) body.appendChild(row('Recycle Value:', fmtInt(info.recycleValue), '#FF9800'));
    if (isFinite(info.minBid))      body.appendChild(row('Minimum Bid:', fmtInt(info.minBid), '#2196F3'));
    if (isFinite(info.maxBid) && !info.isBotTeam) body.appendChild(row('Maximum Bid:', fmtInt(info.maxBid), '#9C27B0'));
    if (isFinite(info.rating))      body.appendChild(row('Rating:', (info.rating/10).toFixed(1), '#00d5ff'));
    if (isFinite(info.gi))          body.appendChild(row('Last GI:', String(info.gi), '#7fff00'));

    root.appendChild(card);
  }

  function buildRatingsCard(root, skills, posCode, marketRating){
    if (!skills || !isFinite(posCode) || posCode < 0 || !isFinite(marketRating)) return;

    const card = document.createElement('div'); card.className = 'fmpx-card';
    card.innerHTML = `<div class="fmpx-title">Position Ratings</div><div class="fmpx-body"><div class="fmpx-grid"></div></div>`;
    const grid = card.querySelector('.fmpx-grid');

    const base = getPosRating(skills, posCode === 0 ? 16 : posCode);
    const bonus = base ? (marketRating/10)/base : NaN;

    let bestKey=null, bestVal=-1;
    [4,5,8,9,16,17,32,33,64].forEach(p=>{
      const raw = getPosRating(skills, p);
      const pred = isFinite(bonus) ? raw*bonus : NaN;

      const chip = document.createElement('div');
      chip.className = `fmpx-chip ${colorClass(pred)} ${p===posCode?'main':''}`;
      chip.innerHTML = `<div class="pos">${posLabels[p]}</div><div class="val">${fmt(pred,1)}</div>`;

      if (pred > bestVal) { bestVal = pred; bestKey = p; }
      grid.appendChild(chip);
    });

    // highlight the best predicted slot
    if (bestKey != null) {
      const idx = [4,5,8,9,16,17,32,33,64].indexOf(bestKey);
      if (idx >= 0) grid.children[idx].classList.add('best');
    }

    root.appendChild(card);
  }

  /* --------------------------------- Init --------------------------------- */
  async function run() {
    const panel = ensurePanel();

    // base player
    const p = await fetchPlayer();
    if (!p) return;

    const posCode  = parsePosCode(p);
    const skills   = decodeSkills(p.skills || p.skillsEncoded || p.skill, posCode);
    const rating   = toNum((p.marketInfo && p.marketInfo.rating) || p.rating);
    const gi       = toNum(p.gi || p.growthIndex);

    // market endpoints
    const market = await fetchMarket();

    buildInfoCard(panel, {
      marketValue: toNum(market.marketValue),
      recycleValue: toNum(market.recycleValue),
      minBid: toNum(market.minBid),
      maxBid: toNum(market.maxBid),
      isBotTeam: market.isBotTeam,
      rating,
      gi
    });

    buildRatingsCard(panel, skills, posCode, rating);
  }

  /* -------------------------- Boot when page is ready -------------------------- */
  const observer = new MutationObserver(() => {
    const rowReady = document.querySelector('.d-flex.flex-row.flex-wrap');
    const growth   = document.getElementById('growth-graph');
    const form     = document.getElementById('form-graph-div');
    const scouts   = document.getElementById('ScoutsBoard');
    if (rowReady && (growth || form) && scouts) {
      observer.disconnect();
      run();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();
