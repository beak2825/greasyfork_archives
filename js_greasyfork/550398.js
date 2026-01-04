// ==UserScript==
// @name         CB Tipping Spree
// @author       aravvn
// @namespace    aravvn.tools
// @version      1.8.1
// @description  Inline Gatling tipping spree inside Chaturbate's tip popup. Pattern tipping, pause/resume, progress bar, optional color cycle, and fast scheduling
// @match        https://chaturbate.com/*
// @match        https://*.chaturbate.com/*
// @match        https://www.testbed.cb.dev/*
// @exclude      https://chaturbate.com/
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://chaturbate.com/favicon.ico
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/550398/CB%20Tipping%20Spree.user.js
// @updateURL https://update.greasyfork.org/scripts/550398/CB%20Tipping%20Spree.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /** ---------- Utils ---------- */
  const API_BASE = location.origin; // same-origin always

  const $ = (sel, root = document) => root.querySelector(sel);
  const cr = (tag, props = {}, children = []) => {
    const el = Object.assign(document.createElement(tag), props);
    if (!Array.isArray(children)) children = [children];
    for (const c of children) el.append(c);
    return el;
  };

  const getCookie = (name) =>
    document.cookie.split('; ').map(v => v.split('=')).find(([k]) => k === name)?.[1] || '';

  const getCSRF = () => {
    const c = getCookie('csrftoken');
    if (c) return decodeURIComponent(c);
    const i = document.querySelector('input[name="csrfmiddlewaretoken"]');
    if (i?.value) return i.value;
    const m = document.querySelector('meta[name="csrf-token"], meta[name="csrf"]');
    if (m?.content) return m.content;
    return '';
  };

  // Locales handled as subdomains (de.chaturbate.com) and as optional first path segment (fallback).
  const LOCALES = new Set([
    'en','de','fr','es','it','pt','ru','tr','nl','pl','sv','da','no','fi','cs','sk','hu',
    'ro','bg','el','uk','sr','hr','he','ar','fa','hi','th','id','ms','vi','ja','ko','zh'
  ]);
  function getRoomSlug() {
    // If hostname is like de.chaturbate.com, strip the locale subdomain and read first path segment.
    const partsHost = location.hostname.split('.');
    const isChaturbateBase = partsHost.slice(-2).join('.') === 'chaturbate.com';
    if (isChaturbateBase && partsHost.length > 2) {
      const maybeLocale = partsHost[0];
      if (LOCALES.has(maybeLocale)) {
        const seg = location.pathname.split('/').filter(Boolean)[0];
        return seg || null;
      }
    }
    // Fallback: check path-based locale (/de/room)
    const partsPath = location.pathname.split('/').filter(Boolean);
    if (partsPath.length >= 2 && LOCALES.has(partsPath[0])) return partsPath[1] || null;
    return partsPath[0] || null;
  }

  const hasPattern = (perTip) => (perTip || '').includes(';');
  const dynMinInterval = (perTip, colorCycle) => (hasPattern(perTip) || colorCycle ? 0.1 : 0.001);
  const clampInterval = (interval, perTip, colorCycle) =>
    Math.max(dynMinInterval(perTip, colorCycle), +interval || 0);

  /** ---------- Color Cycle ---------- */
  const FIXED_COLORS = ['lightpurple', 'darkpurple', 'darkblue', 'lightblue'];
  let colorIdx = 0;
  const nextColor = () => {
    const c = FIXED_COLORS[colorIdx % FIXED_COLORS.length];
    colorIdx = (colorIdx + 1) % FIXED_COLORS.length;
    return c;
  };

  async function postViewerChatSettings(room, colorOverride) {
    const csrf = getCSRF();
    const url  = `${API_BASE}/api/viewerchatsettings/${room}/`;
    const payload = new URLSearchParams({
      font_size: '10pt',
      show_emoticons: 'true',
      emoticon_autocomplete_delay: '0',
      sort_users_key: 't',
      room_entry_for: 'none',
      room_leave_for: 'none',
      c2c_notify_limit: '300',
      silence_broadcasters: 'false',
      allowed_chat: 'all',
      collapse_notices: 'true',
      highest_token_color: colorOverride || '',
      mod_expire: '1',
      max_pm_age: '720',
      font_family: 'Arial, Helvetica',
      font_color: '',
      tip_volume: '0',
      csrfmiddlewaretoken: csrf
    });
    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-CSRFToken': csrf, 'X-Requested-With': 'XMLHttpRequest' },
        body: payload
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /** ---------- Send Tip ---------- */
  function makeTipForm(room, amount, anonymous, message) {
    const csrf = getCSRF();
    const body = new URLSearchParams({
      csrfmiddlewaretoken: csrf,
      tip_amount: String(amount),
      tip_type: anonymous ? 'anonymous' : 'public',
      message: message || ''
    });
    const url = `${API_BASE}/tipping/send_tip/${encodeURIComponent(room)}/`;
    return { url, body };
  }

  async function sendTipFetch(room, amount, anonymous, message, keepalive = false) {
    const { url, body } = makeTipForm(room, amount, anonymous, message);
    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-CSRFToken': getCSRF(), 'X-Requested-With': 'XMLHttpRequest' },
        body,
        keepalive
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /** ---------- Settings ---------- */
  const KEY = 'gatling.v2.inline.settings';
  const defaults = {
    perTip: '',
    numTimes: 10,
    interval: 5,
    colorCycle: false,
    anon: false,
    advBurst: 100,
    advConc: 6,
    advKeepalive: true
  };
  const load = () => Object.assign({}, defaults, GM_getValue(KEY, {}));
  const save = (s) => GM_setValue(KEY, s);

  const parsePattern = (perTip, numTimes) => {
    if (hasPattern(perTip)) {
      return perTip.split(';').map(v => +v).filter(n => Number.isFinite(n) && n > 0);
    }
    const v = +perTip;
    const n = Math.max(1, +numTimes || 1);
    return Number.isFinite(v) && v > 0 ? Array(n).fill(v) : [];
  };

  /** ---------- Controller ---------- */
  const controller = (() => {
    let running = false, paused = false, stopped = false;
    let queue = [], total = 0, nextIndex = 0, doneCount = 0, room = null;
    let ui = null, rafId = 0, inFlight = 0, startTime = 0;

    const setUIRef = (ref) => { ui = ref; };
    const getNote = () => document.querySelector('.tipMessageInput')?.value || '';

    function setProgress(done, total) {
      if (!ui) return;
      const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
      ui.bar.style.width = `${pct}%`;
      ui.metaDone.textContent = `${done} / ${total} done`;
    }

    function state(phase) {
      if (!ui) return;
      if (phase === 'idle' || phase === 'done') {
        ui.start.disabled = false; ui.pause.disabled = true; ui.stop.disabled = true;
        ui.pause.textContent = 'Pause';
      } else if (phase === 'running') {
        ui.start.disabled = true; ui.pause.disabled = false; ui.stop.disabled = false;
        ui.pause.textContent = paused ? 'Resume' : 'Pause';
      } else if (phase === 'paused') {
        ui.start.disabled = true; ui.pause.disabled = false; ui.stop.disabled = false;
        ui.pause.textContent = 'Resume';
      }
    }

    async function dispatchOneAt(index, s) {
      const amount = queue[index];
      if (s.colorCycle) {
        const color = nextColor();
        await postViewerChatSettings(room, color);
      }
      await sendTipFetch(room, amount, s.anon, getNote(), s.advKeepalive && !s.colorCycle);
      doneCount++;
      setProgress(doneCount, total);
    }

    function fastPump() {
      if (!running || stopped) return;
      const s = load();
      if (paused) { rafId = requestAnimationFrame(fastPump); return; }

      const interval = clampInterval(s.interval, s.perTip, s.colorCycle);
      const ultraFast = interval < 0.01 && !hasPattern(s.perTip) && !s.colorCycle;

      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const targetScheduled = interval <= 0 ? total : Math.floor(elapsed / interval);

      const toSchedule = Math.max(0, Math.min(total - nextIndex, targetScheduled - nextIndex));
      const conf = load();
      const MAX_CONC  = ultraFast ? Math.max(1, Math.min(32, (conf.advConc|0) || 1)) : 1;
      const MAX_BURST = ultraFast ? Math.max(1, Math.min(500, (conf.advBurst|0) || 1)) : 5;

      let launched = 0;
      while (
        launched < Math.min(MAX_BURST, toSchedule) &&
        inFlight < MAX_CONC &&
        nextIndex < total &&
        running && !paused
      ) {
        const myIndex = nextIndex++;
        inFlight++; launched++;
        Promise.resolve(dispatchOneAt(myIndex, s)).finally(() => { inFlight--; });
      }

      if (doneCount >= total) { running = false; state('done'); return; }
      rafId = requestAnimationFrame(fastPump);
    }

    async function normalStep() {
      if (!running || stopped) return;
      const s = load();
      if (paused) { setTimeout(normalStep, 50); state('paused'); return; }
      state('running');

      if (doneCount >= total) { running = false; state('done'); return; }
      if (nextIndex < total) {
        const myIndex = nextIndex++;
        await dispatchOneAt(myIndex, s);
      }

      if (doneCount < total) {
        const waitSec = clampInterval(s.interval, s.perTip, s.colorCycle);
        setTimeout(normalStep, waitSec * 1000);
      } else {
        running = false; state('done');
      }
    }

    function start() {
      const slug = getRoomSlug();
      if (!slug) { alert('No room detected.'); return; }
      const s = load();
      queue = parsePattern(s.perTip, s.numTimes);
      if (!queue.length) { alert('Invalid amount/pattern. Example: "10" or "5;10;15"'); return; }

      room = slug;
      total = queue.length;
      nextIndex = 0;
      doneCount = 0;
      inFlight = 0;
      running = true; paused = false; stopped = false;

      setProgress(0, total);
      state('running');

      const interval = clampInterval(s.interval, s.perTip, s.colorCycle);
      startTime = performance.now();

      if (interval < 0.01 && !hasPattern(s.perTip) && !s.colorCycle) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(fastPump);
      } else {
        normalStep();
      }
    }

    function stop() {
      stopped = true; running = false; paused = false;
      try { cancelAnimationFrame(rafId); } catch {}
      state('done');
    }

    function togglePause() {
      if (!running) return;
      paused = !paused;
      state(paused ? 'paused' : 'running');
    }

    function updateTotalsPreview() {
      if (!ui) return;
      const s = load();
      const pattern = parsePattern(s.perTip, s.numTimes);
      const minI = dynMinInterval(s.perTip, s.colorCycle);
      const effI = Math.max(minI, +s.interval || 0);
      const totalN = pattern.length;
      const sum = pattern.reduce((a,b)=>a+b,0);
      const duration = totalN * effI;
      ui.metaDone.textContent = `0 / ${totalN} done`;
      ui.metaTotals.textContent = `Total: ${sum} | Duration: ${duration.toFixed(3)}s`;
      ui.bar.style.width = '0%';
    }

    return { setUIRef, start, stop, togglePause, updateTotalsPreview };
  })();

  /** ---------- Inline UI (compact + Advanced) ---------- */
  function buildInlineUI(container) {
    if ($('#gatling-inline', container)) return;

    const s = load();

    // Anchor somewhere stable inside the callout; prefer the row with "Toggle this window"
    const flexRow = [...container.querySelectorAll('div')]
      .find(d => getComputedStyle(d).display.includes('flex') && d.textContent.includes('Toggle this window'));
    const anchor = flexRow ? flexRow : container.lastElementChild;

    const wrap = cr('div', { id: 'gatling-inline', style: `
      margin: 6px; padding: 6px; border: 1px solid #2b2f36; border-radius: 6px;
      background: #101317; color: #e7e7ea; box-sizing: border-box; font-size: 12px;
    `});

    const grid = cr('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:4px;align-items:end;' });

    const label = (t)=>cr('label',{
      style:'font-size:10px;color:#aab0bb;display:block;margin-bottom:2px;', textContent:t
    });

    const inputStyle = [
      'max-width:120px','width:auto','padding:3px 5px',
      'border:1px solid #2c323a','border-radius:4px',
      'background:#0d1014','color:#e7e7ea','font-size:11px','line-height:1.1'
    ].join(';');

    const mkInput = (type, val) => cr('input',{type, value:val, style:inputStyle});

    const inPer   = mkInput('text', s.perTip); inPer.placeholder = 'e.g., 5;10;15';
    const inNum   = mkInput('number', String(s.numTimes)); inNum.min='1'; inNum.step='1';
    const inInt   = mkInput('number', String(s.interval)); inInt.step='0.001';
    const chkAnon = cr('input',{type:'checkbox',checked:!!s.anon, style:'transform:scale(0.85);'});
    const chkCol  = cr('input',{type:'checkbox',checked:!!s.colorCycle, style:'transform:scale(0.85);'});

    // Advanced section
    const advToggle = cr('a', { href:'#', textContent:'Advanced', style:'font-size:10px;margin-left:8px;color:#9cc2ff;text-decoration:underline;cursor:pointer;' });
    const advBox = cr('div', { style:'display:none;margin-top:6px;gap:6px;align-items:end;' });

    const smallInput = (val, min, max) => {
      const el = mkInput('number', String(val));
      el.style.maxWidth = '90px';
      el.step = '1';
      el.min = String(min); el.max = String(max);
      return el;
    };

    const inBurst = smallInput(s.advBurst, 1, 500);
    const inConc  = smallInput(s.advConc, 1, 32);
    const chkKeep = cr('input',{type:'checkbox',checked:!!s.advKeepalive, style:'transform:scale(0.85);'});

    advBox.append(
      cr('div', {}, [label('Burst/frame'), inBurst]),
      cr('div', {}, [label('Concurrency'), inConc]),
      cr('div', { style:'display:flex;align-items:center;gap:4px;' }, [
        chkKeep, cr('span',{style:'font-size:11px;', textContent:'keepalive (fetch)'})
      ])
    );

    grid.append(
      cr('div', {}, [label('Amount / Pattern'), inPer]),
      cr('div', {}, [label('Count (if no pattern)'), inNum]),
      cr('div', {}, [label('Interval (sec)'), inInt]),
      cr('div', { style:'display:flex;align-items:center;gap:4px;' }, [
        chkAnon, cr('span',{style:'font-size:11px;', textContent:'Anonymous'}), advToggle
      ]),
      cr('div', { style:'display:flex;align-items:center;gap:4px;' }, [
        chkCol,  cr('span',{style:'font-size:11px;', textContent:'Color Cycle'})
      ])
    );

    const hr = cr('div', { style: 'height:1px;background:#20242b;margin:6px 0;' });

    const btnStyle = (bg) => [
      'flex:1','padding:8px 10px','border-radius:8px','border:1px solid #2f3640',
      `background:${bg}`,'color:#fff','font-weight:700','cursor:pointer',
      'text-align:center','font-size:12px','line-height:1.1'
    ].join(';');

    const btnStart = cr('button', { textContent:'Start', style: btnStyle('#1a7f37') });
    const btnPause = cr('button', { textContent:'Pause', style: btnStyle('#25303a') });
    const btnStop  = cr('button', { textContent:'Stop',  style: btnStyle('#cc3232') });

    const btnRow = cr('div', { style:'display:flex;gap:6px;flex-wrap:wrap;' }, [btnStart, btnPause, btnStop]);

    const progress = cr('div', { style:'width:100%;height:6px;background:#0c0f12;border:1px solid #2a2f37;border-radius:999px;overflow:hidden;margin-top:6px;' },
      [cr('div', { className:'bar', style:'height:100%;width:0%;background:linear-gradient(90deg,#22c55e,#06b6d4,#6366f1);transition:width .2s;' })]
    );
    const meta = cr('div', { style:'display:flex;justify-content:space-between;font-size:11px;color:#aab0bb;margin-top:4px;' }, [
      cr('span', { className:'done', textContent:'0 / 0 done' }),
      cr('span', { className:'totals', textContent:'Total: 0 | Duration: 0s' })
    ]);

    wrap.append(grid, advBox, hr, btnRow, progress, meta);
    anchor?.parentElement?.insertBefore(wrap, anchor);

    // Wire UI to controller
    controller.setUIRef({
      start: btnStart, pause: btnPause, stop: btnStop,
      bar: progress.firstElementChild,
      metaDone: meta.firstElementChild,
      metaTotals: meta.lastElementChild
    });

    // Buttons
    btnPause.disabled = true; btnStop.disabled = true;
    btnStart.addEventListener('click', () => {
      controller.start();
      btnStart.disabled = true; btnPause.disabled = false; btnStop.disabled = false;
    });
    btnPause.addEventListener('click', () => controller.togglePause());
    btnStop.addEventListener('click',  () => { controller.stop(); btnStart.disabled=false; btnPause.disabled=true; btnStop.disabled=true; });

    // Advanced toggle
    advToggle.addEventListener('click', (e) => {
      e.preventDefault();
      advBox.style.display = advBox.style.display === 'none' ? 'grid' : 'none';
      advBox.style.gridTemplateColumns = '1fr 1fr';
    });

    // Dynamic interval min + persistence
    const syncIntervalMin = () => {
      const min = dynMinInterval(inPer.value, chkCol.checked);
      inInt.min = String(min);
      const cur = parseFloat(inInt.value || '0');
      if (Number.isFinite(cur) && cur < min) inInt.value = String(min);
    };

    const persist = () => {
      const s2 = {
        perTip: inPer.value.trim(),
        numTimes: Math.max(1, parseInt(inNum.value || '1', 10)),
        interval: parseFloat(inInt.value || '0'),
        colorCycle: !!chkCol.checked,
        anon: !!chkAnon.checked,
        advBurst: Math.max(1, Math.min(500, parseInt(inBurst.value || '100', 10))),
        advConc:  Math.max(1, Math.min(32,  parseInt(inConc.value  || '6',   10))),
        advKeepalive: !!chkKeep.checked
      };
      s2.interval = clampInterval(s2.interval, s2.perTip, s2.colorCycle);
      save(s2);
      controller.updateTotalsPreview();
    };

    [inPer, chkCol].forEach(el => el.addEventListener('input', () => { syncIntervalMin(); persist(); }));
    [inNum, inInt, inBurst, inConc].forEach(el => el.addEventListener('input', persist));
    [chkAnon, chkKeep].forEach(el => el.addEventListener('change', persist));

    // initial
    syncIntervalMin();
    controller.updateTotalsPreview();
  }

  /** ---------- Observe callout & inject ---------- */
  function isVisible(el) {
    if (!el) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  }

  function hookCalloutOnce() {
    const callout = $('#SplitModeTipCallout');
    if (!callout) return false;
    if (!$('#gatling-inline', callout)) buildInlineUI(callout);
    return true;
  }

  function startObservers() {
    const bodyObs = new MutationObserver(() => {
      const callout = $('#SplitModeTipCallout');
      if (callout && isVisible(callout) && !$('#gatling-inline', callout))
        buildInlineUI(callout);
    });
    bodyObs.observe(document.body, { childList: true, subtree: true });

    const visObs = new MutationObserver(() => {
      const callout = $('#SplitModeTipCallout');
      if (callout && isVisible(callout) && !$('#gatling-inline', callout))
        buildInlineUI(callout);
    });
    const tryAttachVisObs = () => {
      const c = $('#SplitModeTipCallout');
      if (c) visObs.observe(c, { attributes: true, attributeFilter: ['style','class'] });
    };

    let tries = 0;
    const t = setInterval(() => {
      if (hookCalloutOnce()) { tryAttachVisObs(); clearInterval(t); }
      if (++tries > 30) clearInterval(t);
    }, 300);
  }

  /** ---------- Bootstrap ---------- */
  (function init() {
    startObservers();
    setTimeout(hookCalloutOnce, 200); // if already open
  })();

})();