// ==UserScript==
// @name         FMP Stadiums → CSV (IDs scanner)
// @namespace    fmp.tools
// @version      1.1
// @description  يجمع بيانات الإستاد من صفحات /Team/Board?id=.. لمدى IDs ويصدّرها CSV
// @match        https://footballmanagerproject.com/*
// @match        https://www.footballmanagerproject.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/553328/FMP%20Stadiums%20%E2%86%92%20CSV%20%28IDs%20scanner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553328/FMP%20Stadiums%20%E2%86%92%20CSV%20%28IDs%20scanner%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ORIGIN = location.origin.includes('footballmanagerproject.com')
    ? location.origin
    : 'https://footballmanagerproject.com';

  const SKEY = 'FMP_STADIUM_SCRAPER_STATE_V1';

  // UI صغير للتقدم
  let overlay;
  function showOverlay(msg) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;right:12px;bottom:12px;z-index:999999;
        background:#111;color:#fff;border:1px solid #444;border-radius:8px;
        padding:10px 12px;font:14px/1.4 sans-serif;max-width:50vw;
        box-shadow:0 4px 12px rgba(0,0,0,.35)
      `;
      document.body.appendChild(overlay);
    }
    overlay.textContent = msg;
  }
  function hideOverlay() { if (overlay) overlay.remove(); overlay = null; }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const cleanNum = (x) => {
    if (!x) return '';
    const s = String(x).replace(/[^\d]/g, '');
    return s ? Number(s) : '';
  };
  const csvCell = (v) => {
    v = (v ?? '').toString();
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  };

  function extractTwo(text, label) {
    // يرجّع [count, seasonTickets]
    const m = text.match(new RegExp(label + '\\s*([\\d.,]+)\\s*([\\d.,]+)', 'i'));
    if (!m) return ['', ''];
    return [cleanNum(m[1]), cleanNum(m[2])];
  }

  async function fetchBoard(teamId) {
    const url = `${ORIGIN}/Team/Board?id=${teamId}`;
    const res = await fetch(url, { credentials: 'include' });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // اسم الفريق (متعدد احتمالات)
    const teamNameEl =
      doc.querySelector('#mainBoard .title .main') ||
      doc.querySelector('.board .title .main') ||
      doc.querySelector('.team-name') ||
      doc.querySelector('.sidebar-logo.team-name') ||
      doc.querySelector('h1,h2');
    const teamName = (teamNameEl?.textContent || `Team #${teamId}`).trim().replace(/\s+/g, ' ');

    // نحاول نلاقي بوكس الإستاد
    const boxes = [...doc.querySelectorAll('.box, .board.box, .fmpx.board.box, #mainBoard .box, .board')];
    const stadiumBox = boxes.find(b => /Stadium Name/i.test(b.textContent) && /Vip Seats/i.test(b.textContent));
    const txt = (stadiumBox ? stadiumBox.innerText : doc.body.innerText).replace(/\s+/g, ' ').trim();

    // اسم الإستاد
    let stadiumName = '';
    const mName = txt.match(/Stadium Name\s*([^]+?)\s*(Total|Maintenance|Type)/i);
    if (mName) stadiumName = mName[1].trim();

    // الإجمالي والصيانة
    const totalSeats = cleanNum(txt.match(/Total\s+Available\s+Seats:\s*([\d.,]+)/i)?.[1]);
    const maintenance = cleanNum(txt.match(/Maintenance\s+Costs.*?€\s*([\d.,]+)/i)?.[1]);

    // الأنواع + تذاكر موسمية
    const [vipCount, vipSeas]         = extractTwo(txt, 'Vip\\s*Seats');
    const [covCount, covSeas]         = extractTwo(txt, 'Covered\\s*Seats');
    const [othCount, othSeas]         = extractTwo(txt, 'Other\\s*Seats');
    const [standCount, standSeas]     = extractTwo(txt, 'Standing');

    return {
      id: teamId,
      team: teamName,
      stadium: stadiumName,
      total: totalSeats,
      maint: maintenance,
      vipc: vipCount, vips: vipSeas,
      covc: covCount, covs: covSeas,
      othc: othCount, oths: othSeas,
      stc: standCount, sts: standSeas,
      url
    };
  }

  async function runRange(fromId, toId) {
    const rows = [];
    for (let id = fromId; id <= toId; id++) {
      try {
        showOverlay(`Scanning #${id} … (${id - fromId + 1}/${toId - fromId + 1})`);
        const rec = await fetchBoard(id);
        rows.push(rec);
      } catch (e) {
        rows.push({ id, team: `Team #${id}`, stadium: '', total: '', maint: '', vipc: '', vips: '', covc: '', covs: '', othc: '', oths: '', stc: '', sts: '', url: `${ORIGIN}/Team/Board?id=${id}` });
      }
      // تهدئة بين الطلبات
      await sleep(350 + Math.random() * 300);
    }

    const header = [
      'team_id','team_name','stadium_name','total_seats','maintenance_eur_week',
      'vip_count','vip_season_tkts','covered_count','covered_season_tkts',
      'other_count','other_season_tkts','standing_count','standing_season_tkts','url'
    ];
    const csv = [header.join(',')].concat(
      rows.map(r => [
        r.id, r.team, r.stadium, r.total, r.maint,
        r.vipc, r.vips, r.covc, r.covs, r.othc, r.oths, r.stc, r.sts, r.url
      ].map(csvCell).join(','))
    ).join('\n');

    try {
      if (typeof GM_download === 'function') {
        GM_download({ url: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), name: `FMP-stadiums-${fromId}-${toId}.csv`, saveAs: true });
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
        a.download = `FMP-stadiums-${fromId}-${toId}.csv`;
        document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 1500);
      }
    } finally {
      hideOverlay();
    }
  }

  function start() {
    const from = parseInt(prompt('ابدأ من Team ID (مثال: 1)', GM_getValue(SKEY + ':from', '1')), 10);
    if (!from) return;
    const to = parseInt(prompt('انتهي عند Team ID (مثال: 500)', GM_getValue(SKEY + ':to', '500')), 10);
    if (!to || to < from) return;

    GM_setValue(SKEY + ':from', String(from));
    GM_setValue(SKEY + ':to', String(to));
    runRange(from, to);
  }

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Export Stadiums (IDs → CSV)', start);
  } else {
    // لو مافيش قائمة (متصفح قديم)، شغّل تلقائيًا:
    start();
  }
})();