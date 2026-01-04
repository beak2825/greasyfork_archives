// ==UserScript==
// @name         Torn: Time → TCT
// @namespace    Njoric
// @version      1.6.6
// @description  Time Converter widget (bottom-left): TCT & your timezone clocks + Any→TCT and TCT→YourTZ converters. Clean corners, compact, themed.
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/luxon/3.4.4/luxon.min.js
// @downloadURL https://update.greasyfork.org/scripts/549758/Torn%3A%20Time%20%E2%86%92%20TCT.user.js
// @updateURL https://update.greasyfork.org/scripts/549758/Torn%3A%20Time%20%E2%86%92%20TCT.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const { DateTime } = luxon;

  const KEY = 'tctWidget.settings.v1';
  const defaults = { myTZ: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', collapsed: false };
  const load = () => { try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY)||'{}')); } catch { return {...defaults}; } };
  const save = (s) => localStorage.setItem(KEY, JSON.stringify(s));
  let S = load();

  GM_addStyle(`
    .tctw-wrap, .tctw-wrap * { box-sizing: border-box; }
    .tctw-wrap{
      position:fixed; left:10px; bottom:10px; z-index:99999; width:300px;
      background:#191919; border:1px solid #bf542f; border-radius:10px; color:#48711e;
      font:12px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
      box-shadow:0 10px 24px rgba(0,0,0,.45);
      overflow:hidden; /* Fix: clip inner content to rounded edges */
    }
    .tctw-hdr{
      display:flex; align-items:center; justify-content:space-between;
      padding:8px 10px; border-bottom:1px solid #bf542f; background:#191919;
      border-top-left-radius:10px;  /* Fix: match container curve */
      border-top-right-radius:10px; /* Fix: match container curve */
    }
    .tctw-title{ font-weight:700; letter-spacing:.2px }
    .tctw-btn{
      cursor:pointer; user-select:none; padding:3px 8px; font-size:11px;
      background:#333333; border:1px solid #bf542f; border-radius:6px; color:#48711e;
      display:inline-block; line-height:1;
    }
    .tctw-btn:hover{ background:#2b2b2b }
    .tctw-btn:focus,
    .tctw-sel:focus,
    .tctw-input:focus { outline:none; }

    .tctw-body{ padding:10px }
    .tctw-grid{ display:grid; grid-template-columns:1fr; gap:8px }

    .tctw-box{
      background:#333333; border:1px solid #bf542f; border-radius:8px; padding:8px;
      overflow:hidden;
    }
    .tctw-label{ opacity:.9; font-weight:600; font-size:11px; text-transform:uppercase; margin:0 0 4px 0 }
    .tctw-time{ font-variant-numeric:tabular-nums; font-weight:700; font-size:16px; margin:0 }
    .tctw-sub{ opacity:.7; font-size:11px; margin-top:2px }

    .tctw-sel,.tctw-input,.tctw-out{
      display:block; width:100%; margin:0;
      border-radius:6px; border:1px solid #bf542f;
      background:#191919; color:#48711e; font-size:12px;
    }
    .tctw-sel,.tctw-input{ padding:5px 8px; }
    .tctw-out{ padding:6px 8px; border-style:dashed; margin-top:4px; word-break:break-word; font-variant-numeric:tabular-nums }
    .tctw-sel:focus,.tctw-input:focus{
      border-color:#61d0d7; box-shadow:0 0 0 2px rgba(84,161,230,.15)
    }

    .tctw-help{ opacity:.7; font-size:11px; margin-top:4px }
    .tctw-collapsed .tctw-body{ display:none }
  `);

  const root = document.createElement('div');
  root.className = 'tctw-wrap' + (S.collapsed ? ' tctw-collapsed':'');
  root.innerHTML = `
    <div class="tctw-hdr">
      <div class="tctw-title">Time Converter</div>
      <div><span class="tctw-btn" id="tctw-collapse">${S.collapsed ? 'Expand' : 'Collapse'}</span></div>
    </div>
    <div class="tctw-body">
      <div class="tctw-grid">
        <div class="tctw-box">
          <div class="tctw-label">TCT now</div>
          <div class="tctw-time" id="tctw-tct-now">--:--:--</div>
          <div class="tctw-sub" id="tctw-tct-date">--/--/--</div>
        </div>
        <div class="tctw-box">
          <div class="tctw-label">My timezone</div>
          <select class="tctw-sel" id="tctw-tz"></select>
          <div class="tctw-time" id="tctw-local-now">--:--:--</div>
          <div class="tctw-sub" id="tctw-local-date">--/--/--</div>
        </div>
        <div class="tctw-box">
          <div class="tctw-label">Any → TCT</div>
          <input class="tctw-input" id="tctw-any" placeholder="e.g. 10:00 CST | 1000 CST | 7am PST | 2025-09-16 08:00 CEST">
          <div class="tctw-help">If date is omitted, today (in the source TZ) is assumed.</div>
          <div class="tctw-out" id="tctw-any-out"></div>
        </div>
        <div class="tctw-box">
          <div class="tctw-label">TCT → My TZ</div>
          <input class="tctw-input" id="tctw-tct-in" placeholder="TCT time, e.g. 11:00 or 2025-09-16 11:00">
          <div class="tctw-help">Enter TCT (UTC+0). If date is omitted, today (UTC) is used.</div>
          <div class="tctw-out" id="tctw-tct-out"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  const el = {
    collapse: root.querySelector('#tctw-collapse'),
    tz: root.querySelector('#tctw-tz'),
    tctNow: root.querySelector('#tctw-tct-now'),
    tctDate: root.querySelector('#tctw-tct-date'),
    localNow: root.querySelector('#tctw-local-now'),
    localDate: root.querySelector('#tctw-local-date'),
    anyIn: root.querySelector('#tctw-any'),
    anyOut: root.querySelector('#tctw-any-out'),
    tctIn: root.querySelector('#tctw-tct-in'),
    tctOut: root.querySelector('#tctw-tct-out')
  };

  const COMMON_TZS = [
    'UTC','Europe/London','Europe/Berlin','Europe/Helsinki',
    'America/New_York','America/Chicago','America/Denver','America/Los_Angeles',
    'America/Phoenix','America/Anchorage','Pacific/Honolulu',
    'Asia/Kolkata','Asia/Singapore','Asia/Hong_Kong','Asia/Tokyo','Asia/Seoul',
    'Australia/Sydney','Australia/Adelaide','Australia/Perth','Pacific/Auckland'
  ];
  const uniq = (a) => Array.from(new Set(a));
  const tzOptions = uniq([S.myTZ, Intl.DateTimeFormat().resolvedOptions().timeZone, ...COMMON_TZS]).filter(Boolean);
  el.tz.innerHTML = tzOptions.map(z => `<option value="${z}">${z}</option>`).join('');
  el.tz.value = S.myTZ;

  const fmtTCT = (dt) => dt.setZone('UTC').toFormat('HH:mm:ss');
  const fmtDateTCT = (dt) => dt.setZone('UTC').toFormat('EEE dd/MM/yy');
  const fmtLocal = (dt,z) => dt.setZone(z).toFormat('HH:mm:ss');
  const fmtDateLocal = (dt,z) => dt.setZone(z).toFormat('EEE dd/MM/yy');

  function tick(){
    const now = DateTime.now();
    el.tctNow.textContent = fmtTCT(now);
    el.tctDate.textContent = fmtDateTCT(now);
    el.localNow.textContent = fmtLocal(now, S.myTZ);
    el.localDate.textContent = fmtDateLocal(now, S.myTZ);
  }
  tick();
  setInterval(tick, 1000);

  el.collapse.addEventListener('click', () => {
    S.collapsed = !S.collapsed;
    root.classList.toggle('tctw-collapsed', S.collapsed);
    el.collapse.textContent = S.collapsed ? 'Expand' : 'Collapse';
    save(S);
  });

  // --- Timezone abbreviations ---
  const TZ_ABBR = { UTC:'UTC', GMT:'UTC', EST:'America/New_York', EDT:'America/New_York',
    CST:'America/Chicago', CDT:'America/Chicago', MST:'America/Denver', MDT:'America/Denver',
    PST:'America/Los_Angeles', PDT:'America/Los_Angeles', AKST:'America/Anchorage',
    AKDT:'America/Anchorage', HST:'Pacific/Honolulu', CET:'Europe/Berlin', CEST:'Europe/Berlin',
    EET:'Europe/Helsinki', EEST:'Europe/Helsinki', BST:'Europe/London', IST:'Asia/Kolkata',
    SGT:'Asia/Singapore', HKT:'Asia/Hong_Kong', JST:'Asia/Tokyo', KST:'Asia/Seoul',
    AEST:'Australia/Sydney', AEDT:'Australia/Sydney', ACST:'Australia/Adelaide',
    ACDT:'Australia/Adelaide', AWST:'Australia/Perth', NZST:'Pacific/Auckland',
    NZDT:'Pacific/Auckland', SAST:'Africa/Johannesburg', AZT:'America/Phoenix' };
  const resolveTZ = (t) => { if (!t) return null; const k=t.toUpperCase(); if (TZ_ABBR[k]) return TZ_ABBR[k]; if (/^[A-Za-z]+\/[A-Za-z_]+$/.test(t)) return t; return null; };

  function parseAnyToUTC(query) {
    const raw = (query || '').trim().replace(/\s+/g, ' ');
    if (!raw) return { ok:false, err:'Type a time and timezone (e.g., "10:00 CST", "1000 CST")' };

    const parts = raw.split(' ');
    let tzToken = parts[parts.length - 1];
    let tz = resolveTZ(tzToken);
    let rest = parts.slice(0, parts.length - 1).join(' ');

    if (!tz) {
      const iana = parts.find(p => p.includes('/'));
      if (iana) { tz = iana; rest = parts.filter(p => p !== iana).join(' '); }
    }
    if (!tz) return { ok:false, err:`Could not recognize timezone in "${raw}".` };

    let dateStr = null;
    let timeStr = rest.trim();
    const m = timeStr.match(/^(\d{4}[-/]\d{2}[-/]\d{2})\s+(.+)$/);
    if (m) { dateStr = m[1].replace(/\//g, '-'); timeStr = m[2]; }

    timeStr = timeStr.replace(/(\d)(am|pm)$/i, '$1 $2');
    if (/^\d{3,4}$/.test(timeStr)) {
      const s = timeStr.padStart(4, '0');
      const hh = parseInt(s.slice(0, -2), 10), mm = parseInt(s.slice(-2), 10);
      if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) timeStr = `${hh}:${String(mm).padStart(2,'0')}`;
    }
    if (/^\d{1,2}(\s*[ap]m)?$/i.test(timeStr)) timeStr = timeStr.replace(/^(\d{1,2})(?:\s*([ap]m))?$/i, '$1:00$2');

    const formats = ['H:mm','h:mm a','H','h a','H:mm:ss','h:mm:ss a'];
    const base = dateStr ? DateTime.fromISO(dateStr, { zone: tz }) : DateTime.now().setZone(tz);

    let parsed = null;
    for (const f of formats) {
      const t = DateTime.fromFormat(timeStr, f, { zone: tz });
      if (t.isValid) { parsed = base.set({ hour: t.hour, minute: t.minute, second: t.second }); break; }
    }
    if (!parsed) {
      const t = DateTime.fromISO(timeStr, { zone: tz });
      if (t.isValid) parsed = t;
    }
    if (!parsed || !parsed.isValid) return { ok:false, err:`Could not parse the time part "${timeStr}".` };

    const dtUTC = parsed.setZone('UTC');
    return { ok:true, dtUTC };
  }

  function parseTCTtoMyTZ(query, myTZ) {
    const raw = (query || '').trim();
    if (!raw) return { ok:false, err:'Enter a TCT time like "11:00" or "2025-09-16 11:00"' };

    const nowUTC = DateTime.now().setZone('UTC');
    let parsed = DateTime.fromFormat(raw, 'H:mm', { zone:'UTC' });
    if (!parsed.isValid) parsed = DateTime.fromFormat(raw, 'H:mm:ss', { zone:'UTC' });
    if (!parsed.isValid) parsed = DateTime.fromISO(raw, { zone:'UTC' });
    if (!parsed.isValid) return { ok:false, err:'Use "HH:mm", "HH:mm:ss", or "YYYY-MM-DD HH:mm".' };

    if (!/^\d{4}-\d{2}-\d{2}/.test(raw)) {
      parsed = nowUTC.set({ hour: parsed.hour, minute: parsed.minute, second: parsed.second });
    }
    const local = parsed.setZone(myTZ);
    return { ok:true, local };
  }

  const runAnyToTCT = () => {
    const q = el.anyIn.value;
    if (!q) { el.anyOut.textContent = ''; return; }
    const res = parseAnyToUTC(q);
    el.anyOut.textContent = res.ok ? `TCT: ${res.dtUTC.toFormat("EEE HH:mm - dd/MM/yy")}` : res.err;
  };
  const runTCTtoMyTZ = () => {
    const q = el.tctIn.value;
    if (!q) { el.tctOut.textContent = ''; return; }
    const res = parseTCTtoMyTZ(q, S.myTZ);
    el.tctOut.textContent = res.ok ? res.local.toFormat(`EEE HH:mm - dd/MM/yy '(${S.myTZ})'`) : res.err;
  };

  el.tz.addEventListener('change', () => { S.myTZ = el.tz.value; save(S); tick(); runTCTtoMyTZ(); });
  el.anyIn.addEventListener('input', runAnyToTCT);
  el.tctIn.addEventListener('input', runTCTtoMyTZ);

  document.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 't' || e.key === 'T')) {
      if (S.collapsed) {
        S.collapsed = false; root.classList.remove('tctw-collapsed'); el.collapse.textContent = 'Collapse'; save(S);
        setTimeout(()=> el.anyIn.focus(), 0);
      } else {
        el.anyIn.focus();
      }
    }
  });
})();
