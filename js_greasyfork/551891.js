// ==UserScript==
// @name         FMP Player Position Ratings – Compact Row
// @namespace    https://greasyfork.org/users/you
// @version      1.2.4
// @description  Show per-position ratings (0–21) in one compact row under the abilities on /Team/Player. Pulls allRatings from LineupData; fallback estimates from Talents. Includes a ⚙ to set Team ID.
// @match        https://footballmanagerproject.com/Team/Player*
// @match        https://www.footballmanagerproject.com/Team/Player*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551891/FMP%20Player%20Position%20Ratings%20%E2%80%93%20Compact%20Row.user.js
// @updateURL https://update.greasyfork.org/scripts/551891/FMP%20Player%20Position%20Ratings%20%E2%80%93%20Compact%20Row.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const POS_ORDER = ["GK","DC","DL","DR","DMC","DML","DMR","MC","ML","MR","OMC","OML","OMR","FC"];
  const LS_TEAM   = 'FMP_TEAM_ID_PLAYER_PAGE';

  // Fallback weights (only used if API not available / player not found)
  const W = {
    GK:{Pos:1.2,Tac:0.8,Mar:0.8,Hea:0.4,Sta:0.5,Pac:0.4,Acc:0.4,Tec:0.3,Pas:0.3,Lon:0.2,Fin:0.0,Cro:0.0},
    DC:{Pos:2.0,Tac:2.0,Mar:2.0,Hea:1.4,Sta:1.0,Pac:0.6,Acc:0.6,Tec:0.5,Pas:0.3,Lon:0.3,Fin:0.1,Cro:0.0},
    DL:{Pos:1.2,Tac:1.3,Mar:1.2,Pac:1.4,Acc:1.2,Sta:1.0,Cro:1.1,Tec:0.6,Pas:0.6,Hea:0.4,Lon:0.3,Fin:0.0},
    DR:{Pos:1.2,Tac:1.3,Mar:1.2,Pac:1.4,Acc:1.2,Sta:1.0,Cro:1.1,Tec:0.6,Pas:0.6,Hea:0.4,Lon:0.3,Fin:0.0},
    DMC:{Pos:1.6,Tac:1.6,Mar:1.3,Sta:1.1,Pas:1.1,Tec:0.9,Pac:0.6,Acc:0.6,Hea:0.7,Lon:0.5,Fin:0.0,Cro:0.0},
    DML:{Pos:1.0,Tac:1.0,Pac:1.4,Acc:1.2,Sta:1.0,Cro:1.2,Pas:0.8,Tec:0.9,Lon:0.4,Hea:0.3,Fin:0.2,Mar:0.6},
    DMR:{Pos:1.0,Tac:1.0,Pac:1.4,Acc:1.2,Sta:1.0,Cro:1.2,Pas:0.8,Tec:0.9,Lon:0.4,Hea:0.3,Fin:0.2,Mar:0.6},
    MC:{Pos:1.3,Tac:1.0,Mar:0.8,Sta:1.2,Pas:1.6,Tec:1.2,Pac:0.6,Acc:0.6,Lon:0.8,Hea:0.3,Fin:0.3,Cro:0.0},
    ML:{Pos:0.9,Tac:0.7,Mar:0.6,Pac:1.5,Acc:1.3,Sta:1.0,Cro:1.2,Pas:1.0,Tec:1.0,Lon:0.5,Fin:0.3,Hea:0.3},
    MR:{Pos:0.9,Tac:0.7,Mar:0.6,Pac:1.5,Acc:1.3,Sta:1.0,Cro:1.2,Pas:1.0,Tec:1.0,Lon:0.5,Fin:0.3,Hea:0.3},
    OMC:{Pos:1.0,Tac:0.4,Mar:0.3,Sta:0.9,Pas:1.6,Tec:1.5,Pac:0.9,Acc:0.9,Lon:1.0,Fin:0.8,Hea:0.2,Cro:0.2},
    OML:{Pos:0.8,Tac:0.4,Mar:0.3,Sta:0.9,Pas:1.1,Tec:1.2,Pac:1.4,Acc:1.3,Lon:0.7,Fin:0.7,Hea:0.2,Cro:1.0},
    OMR:{Pos:0.8,Tac:0.4,Mar:0.3,Sta:0.9,Pas:1.1,Tec:1.2,Pac:1.4,Acc:1.3,Lon:0.7,Fin:0.7,Hea:0.2,Cro:1.0},
    FC:{Pos:0.8,Tac:0.2,Mar:0.2,Sta:0.9,Pas:0.7,Tec:1.0,Pac:1.2,Acc:1.2,Lon:0.9,Fin:2.0,Hea:1.0,Cro:0.0}
  };

  const PID = new URLSearchParams(location.search).get('id');

  ready(run);

  async function run() {
    const anchor = findBlockByTitle(['Growth Index','مؤشر النمو']); // place just before it
    const box = makeBox();
    placeBoxBefore(box, anchor);

    let teamId = getTeamIdFromLinks() || localStorage.getItem(LS_TEAM) || '';
    let map = null;

    if (teamId) {
      map = await fetchAllRatings(teamId, PID);
      if (!map) {
        const backup = getTeamIdFromLinks(true);
        if (backup && backup !== teamId) map = await fetchAllRatings(backup, PID);
        if (map) teamId = backup;
      }
    }

    if (map) {
      box.querySelector('.fmp-sub').textContent = `from LineupData (team ${teamId})`;
      localStorage.setItem(LS_TEAM, teamId);
    } else {
      const talents = scrapeTalents();
      if (talents) {
        map = estimateFromTalents(talents);
        box.querySelector('.fmp-sub').textContent = 'estimated from Talents';
      } else {
        box.querySelector('.fmp-sub').textContent = 'no ratings found — click ⚙ to set Team ID';
      }
    }

    renderRow(box, map);

    // settings
    box.querySelector('[data-action="set-team"]').addEventListener('click', async () => {
      const input = prompt('Enter your Team ID (digits only):', teamId || '');
      if (input && /^\d+$/.test(input)) {
        localStorage.setItem(LS_TEAM, input);
        const r = await fetchAllRatings(input, PID);
        if (r) { box.querySelector('.fmp-sub').textContent = `from LineupData (team ${input})`; renderRow(box, r); }
        else    alert('Could not fetch ratings for this Team ID (player may not be in that squad).');
      }
    });
  }

  // -------- UI (compact) --------
  function makeBox(){
    const box = document.createElement('div');
    box.id = 'posRatingsBox';
    box.style.cssText = 'margin:6px 0;background:#0f2a0f;border:1px solid #355a35;border-radius:8px;padding:6px 8px;color:#d6f5d6;';
    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="font-weight:700">Position Ratings (0–21)</div>
        <button data-action="set-team" title="Set Team ID"
          style="cursor:pointer;background:#173f17;border:1px solid #355a35;color:#d6f5d6;padding:0 6px;border-radius:6px;height:22px;line-height:22px">⚙</button>
        <div class="fmp-sub" style="opacity:.8;font-size:12px;white-space:nowrap;"></div>
      </div>
      <div class="pos-row" style="display:flex;align-items:center;gap:4px;overflow-x:auto;white-space:nowrap;margin-top:4px;"></div>
    `;
    return box;
  }

  function renderRow(box, ratingsMap){
    const row = box.querySelector('.pos-row');
    row.innerHTML = '';
    if (!ratingsMap) return;

    const items = POS_ORDER
      .filter(p => ratingsMap[p] != null)
      .map(p => ({ pos:p, raw:Number(ratingsMap[p]) }))
      .map(x => ({...x, v21: Number((x.raw/10).toFixed(1))}))
      .sort((a,b)=> b.v21 - a.v21);

    const top3 = new Set(items.slice(0,3).map(i=>i.pos));

    for (const it of items){
      const cell = document.createElement('div');
      cell.style.cssText =
        'display:inline-flex;flex-direction:column;justify-content:center;gap:0;min-width:52px;padding:2px 6px;border:1px solid #355a35;border-radius:6px;background:#143614;text-align:center;height:34px;';
      if (top3.has(it.pos)) cell.style.boxShadow = '0 0 0 2px #4CAF50 inset';
      cell.innerHTML = `<div style="font-size:10px;opacity:.9;line-height:12px">${it.pos}</div>
                        <div style="font-weight:700;line-height:16px">${it.v21.toFixed(1)}</div>`;
      cell.title = `${it.pos}: raw ${it.raw} → ${it.v21}/21`;
      row.appendChild(cell);
    }
  }

  // -------- Placement --------
  function placeBoxBefore(box, anchor){
    if (anchor?.parentNode) anchor.parentNode.insertBefore(box, anchor);
    else (document.getElementById('mainBoard')||document.body).insertBefore(box,(document.getElementById('mainBoard')||document.body).firstChild);
  }
  function findBlockByTitle(titles){
    const blocks = document.querySelectorAll('.board, .box');
    for (const b of blocks){
      const t = b.querySelector('.title .main');
      const txt = t?.textContent?.trim();
      if (txt && titles.some(x => txt.includes(x))) return b;
    }
    return null;
  }

  // -------- Data --------
  async function fetchAllRatings(teamId, playerId){
    try{
      const res = await fetch(`/Team/Lineup?handler=LineupData&id=${teamId}`, {credentials:'same-origin'});
      if (!res.ok) return null;
      const data = await res.json();
      const players = [...(data.field||[]), ...(data.reserves||[]), ...(data.tribune||[])];
      const me = players.find(p => String(p.info?.id) === String(playerId));
      return me?.info?.allRatings || null;
    } catch { return null; }
  }
  function getTeamIdFromLinks(lenient=false){
    const anchors = Array.from(document.querySelectorAll('a[href*="/Team/"], a[href*="/Team?"]'));
    const prefer  = /Main|Lineup|Team|Squad|Club|Overview|Main Team|الفريق|الخطة/i;
    let candidate = null;
    for (const a of anchors){
      const url = new URL(a.href, location.origin);
      const id  = url.searchParams.get('id');
      if (id && /^\d+$/.test(id)) {
        if (!lenient && (prefer.test(a.textContent) || /Lineup|Team/.test(url.pathname))) return id;
        if (lenient && !candidate) candidate = id;
      }
    }
    return candidate;
  }

  // -------- Fallback from Talents --------
  function scrapeTalents(){
    const wanted = ["Sta","Pac","Acc","Mar","Tac","Pos","Pas","Cro","Tec","Hea","Fin","Lon"];
    const map = {};
    document.querySelectorAll('td, span, div').forEach(el=>{
      const m = el.textContent && el.textContent.trim().match(/^([A-Z][a-z]{1,2})\s*(\d{1,3})$/);
      if (m && wanted.includes(m[1])) map[m[1]] = Number(m[2]);
    });
    if (Object.keys(map).length < 6){
      document.querySelectorAll('tr').forEach(r=>{
        const tds = r.querySelectorAll('td');
        if (tds.length>=2){
          const k = tds[0].textContent.trim();
          const v = Number(tds[1].textContent.trim());
          if (wanted.includes(k) && !Number.isNaN(v)) map[k]=v;
        }
      });
    }
    return Object.keys(map).length ? map : null;
  }
  function estimateFromTalents(tal){
    const out = {};
    for (const pos of POS_ORDER){
      const w = W[pos] || {};
      let sum=0, val=0;
      for (const k in w){ if (tal[k]!=null){ val += tal[k]*w[k]; sum += w[k]; } }
      const score100 = sum ? (val/sum) : 0;
      out[pos] = Math.round(score100); // raw ~0..100 → UI divides by /10
    }
    return out;
  }

  // -------- Utils --------
  function ready(cb){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cb);
    else cb();
  }
})();
