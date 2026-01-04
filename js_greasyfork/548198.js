// ==UserScript==
// @name         S3 Schedules (ICEHL + Metal Ligaen)
// @namespace    cz.hockey.table.froms3
// @version      3.3
// @license      MIT
// @author       JV
// @description  Vloží nahoře tabulku s live urls (API + ofiko + xG) pro ICEHL i Metal Ligaen.
// @match        https://ice.hockey/*/schedule/*
// @match        https://www.ice.hockey/*/schedule/*
// @match        https://metalligaen.dk/kampe/
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      s3-eu-west-1.amazonaws.com
// @connect      s3.eu-west-1.amazonaws.com
// @downloadURL https://update.greasyfork.org/scripts/548198/S3%20Schedules%20%28ICEHL%20%2B%20Metal%20Ligaen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548198/S3%20Schedules%20%28ICEHL%20%2B%20Metal%20Ligaen%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let jsonUrl, apiBase, detailBase, xgBase, wrapId, leagueTitle;

  if (location.hostname.includes('ice.hockey')) {
    jsonUrl    = 'https://s3-eu-west-1.amazonaws.com/icehl.hokejovyzapis.cz/league-matches/2025/1.json';
    apiBase    = 'https://s3.eu-west-1.amazonaws.com/icehl.hokejovyzapis.cz/widget/esports/match/';
    detailBase = 'https://www.ice.hockey/en/stats/gamestats?gameId=';
    xgBase     = 'https://icestats.at/visualization/deserve2win/';
    wrapId     = 'icehl-s3-topblock';
    leagueTitle= 'ICEHL (S3)';
  }
  else if (location.hostname.includes('metalligaen.dk')) {
    jsonUrl    = 'https://s3-eu-west-1.amazonaws.com/den.hokejovyzapis.cz/league-matches/2025/1.json';
    apiBase    = 'https://s3.eu-west-1.amazonaws.com/den.hokejovyzapis.cz/widget/esports/match/';
    detailBase = 'https://metalligaen.dk/kampe/detalje?gameId=';
    wrapId     = 'den-s3-topblock';
    leagueTitle= 'Metal Ligaen (S3)';
  } else {
    return;
  }

  if (document.getElementById(wrapId)) return;

  addStyle(`
    #${wrapId}{ margin:12px auto; max-width:1100px; font:15px/1.4 ui-sans-serif,system-ui,Segoe UI,Roboto,Arial; }
    #${wrapId} .head{
      background:#2563eb; color:#fff; padding:8px 12px;
      border-radius:6px 6px 0 0; display:flex; align-items:center; justify-content:space-between;
      font:600 15px/1.4 ui-sans-serif,system-ui,Segoe UI,Roboto,Arial; letter-spacing:.2px;
    }
    #${wrapId} .title{ color:#fff; text-shadow:0 1px 1px rgba(0,0,0,.25); }
    #${wrapId} .toggle{
      cursor:pointer; padding:6px 12px; border:none; border-radius:8px;
      background:#fff; color:#2563eb;
      font:700 15px/1 ui-sans-serif,system-ui,Segoe UI,Roboto,Arial;
      box-shadow:0 2px 6px rgba(0,0,0,.15);
    }
    #${wrapId} table{ border-collapse:collapse; width:100%; table-layout:auto; font-size:15px; }
    #${wrapId} thead tr{ background:#bfdbfe; }
    #${wrapId} th{ text-align:left; padding:6px 8px; }
    #${wrapId} td{ padding:4px 8px; }
    #${wrapId} tbody tr.live{ background:#fef9c3; font-weight:600; }
    #${wrapId} a{ color:#2563eb; text-decoration:none; }
    #${wrapId} a:hover{ text-decoration:underline; }
  `);

  const wrap = document.createElement('div');
  wrap.id = wrapId;
  wrap.innerHTML = `
    <div class="head">
      <strong class="title">${leagueTitle} — přehled zápasů</strong>
      <button id="${wrapId}-toggle" class="toggle">skrýt / zobrazit</button>
    </div>
    <div id="${wrapId}-content"
         style="background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;box-shadow:0 2px 8px rgba(0,0,0,.08);overflow:auto;">
      <div style="padding:10px;color:#6b7280;font-size:15px;">Načítám…</div>
    </div>
  `;
  document.body.insertBefore(wrap, document.body.firstChild);

  document.getElementById(`${wrapId}-toggle`).onclick = () => {
    const c = document.getElementById(`${wrapId}-content`);
    c.style.display = c.style.display === 'none' ? '' : 'none';
  };

  getJSON(jsonUrl).then(data => {
    const list = Array.isArray(data?.matches) ? data.matches : [];
    if (!list.length) return setErr('Prázdný seznam zápasů.');

    const now = Date.now();

    const rows = list.map(m => {
      const when = m.start_date || m.real_start_date || '';
      const ts = +new Date(when);
      const st = normStatus(m.status);
      return { raw: m, ts, status: st };
    }).filter(r => isFinite(r.ts));

    const visible = rows.filter(r => !isFinished(r.status));
    const live   = visible.filter(r => isLive(r.status)).sort((a,b)=>a.ts - b.ts);
    const future = visible.filter(r => r.ts > now && !isLive(r.status)).sort((a,b)=>a.ts - b.ts);

    const ordered = [...live, ...future].map(x => toRow(x.raw));

    const html = ordered.length ? renderTable(ordered) : `<div style="padding:10px;font-size:15px;">Žádné budoucí ani LIVE zápasy.</div>`;
    setContent(html);
  }).catch(err => setErr('Chyba načtení: ' + (err?.message || String(err))));

  // ---- helpers ----
  function addStyle(css){ const s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); }
  function getJSON(url){
    return new Promise((resolve,reject)=>{
      if (typeof GM_xmlhttpRequest === 'function'){
        GM_xmlhttpRequest({
          method:'GET', url, headers:{'Accept':'application/json'},
          onload: r => { try { resolve(JSON.parse(r.responseText)); } catch(e){ reject(new Error('Chybný JSON')); } },
          onerror: () => reject(new Error('Síťová chyba')),
          ontimeout: () => reject(new Error('Timeout'))
        });
      } else {
        fetch(url,{cache:'no-store'}).then(r=>{ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
          .then(resolve).catch(reject);
      }
    });
  }

  function normStatus(s){ return String(s || '').toLowerCase().replace(/[_-]+/g,' ').trim(); }
  function isFinished(st){ return ['finished','after match','aftermatch','final','ended','complete'].includes(st); }
  function isLive(st){ return ['live','in progress','inprogress','running','ongoing','playing'].includes(st); }

  function toRow(m){
    const id = m?.id || '';
    const d = new Date(m.start_date || m.real_start_date || '');
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const yyyy = d.getFullYear();
    const HH = String(d.getHours()).padStart(2,'0');
    const MM = String(d.getMinutes()).padStart(2,'0');
    const status = normStatus(m.status);
    const scoreH = m?.results?.score?.final?.score_home;
    const scoreG = m?.results?.score?.final?.score_guest;
    const score = (isFinite(scoreH) && isFinite(scoreG)) ? `${scoreH}:${scoreG}` : '-';
    return {
      id,
      isLive: isLive(status),
      date: `${dd}.${mm}.${yyyy}`,
      time: `${HH}:${MM}`,
      home: m?.home?.name || '-',
      away: m?.guest?.name || '-',
      status,
      score,
      apiUrl: apiBase + id + '.json',
      detailUrl: detailBase + id,
      xgUrl: xgBase + id
    };
  }

  function renderTable(rows){
    return `
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Čas</th>
            <th>Home</th>
            <th>Away</th>
            <th>Skóre</th>
            <th>Status</th>
            <th>API</th>
            <th>Detail</th>
            <th>xG</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr class="${r.isLive ? 'live' : ''}">
              <td>${esc(r.date)}</td>
              <td>${esc(r.time)}</td>
              <td>${esc(r.home)}</td>
              <td>${esc(r.away)}</td>
              <td>${esc(r.score)}</td>
              <td>${esc(r.status)}</td>
              <td><a href="${r.apiUrl}" target="_blank">JSON</a></td>
              <td><a href="${r.detailUrl}" target="_blank">Detail</a></td>
              <td><a href="${r.xgUrl}" target="_blank">xG</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function setContent(html){ document.getElementById(`${wrapId}-content`).innerHTML = html; }
  function setErr(msg){ setContent(`<div style="padding:10px;color:#b91c1c;font-size:15px;">${esc(msg)}</div>`); }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
})();