// ==UserScript==
// @name         HockeyWeerelt Upcoming
// @namespace    cz.hw.upcoming
// @version      2.3
// @license      MIT
// @author       JV
// @description  Nahrazuje JSON tabulkou se Live Urls
// @match        https://publicaties.hockeyweerelt.nl/mc/competitions/*/matches/upcoming*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549585/HockeyWeerelt%20Upcoming.user.js
// @updateURL https://update.greasyfork.org/scripts/549585/HockeyWeerelt%20Upcoming.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const raw = document.body.innerText.trim();
  if (!raw || (raw[0] !== '{' && raw[0] !== '[')) return;

  const root = safeParseJson(raw);
  if (!root) { console.error("Nejde parsovat JSON"); return; }

  const list = Array.isArray(root) ? root
             : (Array.isArray(root.data) ? root.data : []);

  if (!list.length) return;

  const rows = list.map(mapMatch).filter(Boolean).sort((a,b) => a.startTs - b.startTs);

  const tbl = document.createElement('table');
  tbl.style.cssText = `
    border-collapse: collapse;
    font-family: sans-serif;
    font-size: 14px;
    margin: 20px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,.08);
    table-layout: auto;
  `;
  tbl.innerHTML = `
    <thead>
      <tr style="background:#f8fafc;">
        <th align="left">Datum</th>
        <th align="left">Home</th>
        <th align="left">Away</th>
        <th align="left">Link</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map(r => `
        <tr>
          <td style="white-space:nowrap;padding:6px 10px;">${esc(r.date)}</td>
          <td style="padding:6px 10px;">${esc(r.home)}</td>
          <td style="padding:6px 10px;">${esc(r.away)}</td>
          <td style="padding:6px 10px;">
            <a href="https://publicaties.hockeyweerelt.nl/mc/matches/${r.id}" target="_blank">Zápas</a>
          </td>
        </tr>`).join('')}
    </tbody>
  `;

  // nahradíme JSON tabulkou
  document.body.innerHTML = '';
  document.body.appendChild(tbl);

  function mapMatch(m){
    const id = String(m.id || '').trim();
    if (!id) return null;
    const home = m.home_team?.name || '-';
    const away = m.away_team?.name || '-';
    const dt   = parseDateDefault(m.datetime || '');
    return { id, home, away, date:dt.date, startTs:dt.ts };
  }

  // převod na lokální datum (CET/CEST dle prohlížeče), bez času
  function parseDateDefault(s){
    const d = new Date(s);
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const yyyy = d.getFullYear();
    return { ts: d.getTime(), date: dd+'.'+mm+'.'+yyyy };
  }

  function esc(s){
    return String(s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }

  // bezpečné parsování JSONu i když je za ním další text
  function safeParseJson(txt){
    let s = txt.replace(/^\uFEFF/, '').trim(); // odstraň BOM
    try { return JSON.parse(s); }
    catch (e1) {
      const last = s[0] === '[' ? s.lastIndexOf(']') : s.lastIndexOf('}');
      if (last > 0) {
        const cut = s.slice(0, last + 1);
        try { return JSON.parse(cut); } catch(e2){ return null; }
      }
      return null;
    }
  }
})();
