// ==UserScript==
// @name         NOX — OC Flight Guard (PC + TornPDA)
// @namespace    nox.oc.guard
// @version      1.0.6
// @description  Blocks Travel “CONTINUE” if round-trips risk missing the OC window. Adds a ⚙ OC button (PC + TornPDA), fast warning, Test Mode, and auto-revert to your saved timings.
// @author       Noxious (Nox)
// @license      LicenseRef-All-Rights-Reserved
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/548351/NOX%20%E2%80%94%20OC%20Flight%20Guard%20%28PC%20%2B%20TornPDA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548351/NOX%20%E2%80%94%20OC%20Flight%20Guard%20%28PC%20%2B%20TornPDA%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /******** CONSTANTS & HELPERS ********/
  const DEFAULTS = {
    enabled: true,
    apiKey: '',
    groundMinutes: 10,
    ocMarginMinutes: 5,
    ocPollMs: 20000,
    ocMaxMinutesCap: 240,
    testMode: false,
  };
  const TEST_CAP = 5000;
  const TEST_MARGIN = 4500;

  const clamp = (v, min, max) => {
    const n = parseInt(v, 10);
    return Math.max(min, Math.min(max, Number.isFinite(n) ? n : 0));
  };
  const get = (k, d) => {
    try { if (typeof GM_getValue === 'function') { const v = GM_getValue(k, undefined); if (v !== undefined) return v; } } catch {}
    try { const v = localStorage.getItem('ocfg:' + k); return v !== null ? JSON.parse(v) : d; } catch {}
    return d;
  };
  const save = (k, v) => {
    try { if (typeof GM_setValue === 'function') GM_setValue(k, v); } catch {}
    try { localStorage.setItem('ocfg:' + k, JSON.stringify(v)); } catch {}
  };
  const savePrev = (k, v) => save('prev:' + k, v);
  const getPrev  = (k, d) => get('prev:' + k, d);
  const clearPrev = (k) => { try { localStorage.removeItem('ocfg:prev:' + k); } catch {} };

  // migrate older fields once
  (function migrateOld() {
    const oldDest = Number(get('bufferAtDestination', NaN));
    const oldTurn = Number(get('bufferBetweenFlights', NaN));
    const oldEarly = Number(get('bufferBeforeOC', NaN));
    const hadOld = Number.isFinite(oldDest) || Number.isFinite(oldTurn) || Number.isFinite(oldEarly);
    const hasNew = Number.isFinite(Number(get('groundMinutes', NaN))) || Number.isFinite(Number(get('ocMarginMinutes', NaN)));
    if (hadOld && !hasNew) {
      const ground = (Number.isFinite(oldDest) ? oldDest : 0) + (Number.isFinite(oldTurn) ? oldTurn : 0);
      const margin = Number.isFinite(oldEarly) ? oldEarly : DEFAULTS.ocMarginMinutes;
      save('groundMinutes', ground || DEFAULTS.groundMinutes);
      save('ocMarginMinutes', margin);
    }
  })();

  /******** STATE ********/
  const S = {
    enabled: get('enabled', DEFAULTS.enabled),
    apiKey: get('apiKey', DEFAULTS.apiKey),
    groundMin: get('groundMinutes', DEFAULTS.groundMinutes),
    ocMarginMin: get('ocMarginMinutes', DEFAULTS.ocMarginMinutes),
    ocPollMs: DEFAULTS.ocPollMs,
    ocStartTs: null,
    lastOCPoll: 0,
    ocMaxMinutesCap: get('ocMaxMinutesCap', DEFAULTS.ocMaxMinutesCap),
    testMode: get('testMode', DEFAULTS.testMode),
    lastRiskKey: '',
    autoDisableTestPending: false,
    warningActive: false,
  };
  const getOcMaxMinutes = () =>
    (S.testMode ? TEST_CAP :
      Math.min(Math.max(5, S.ocMaxMinutesCap || DEFAULTS.ocMaxMinutesCap), DEFAULTS.ocMaxMinutesCap));

  /******** GM MENU (desktop) ********/
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Set API key', () => {
      const k = prompt('Enter your Torn API key (stored locally only):', get('apiKey','') || '');
      if (k != null) { S.apiKey = k.trim(); save('apiKey', S.apiKey); alert('Saved.'); }
    });

    GM_registerMenuCommand('Set timing (minutes)', () => {
      const baseCap = Math.min(Math.max(5, get('ocMaxMinutesCap', DEFAULTS.ocMaxMinutesCap) || DEFAULTS.ocMaxMinutesCap), DEFAULTS.ocMaxMinutesCap);
      const baseGround = Number(get('groundMinutes', DEFAULTS.groundMinutes));
      const baseMargin = Number(get('ocMarginMinutes', DEFAULTS.ocMarginMinutes));
      const a = prompt(`Time on ground (includes turnaround) — minutes (0–${baseCap})`, baseGround);
      const b = prompt(`Required margin BEFORE OC — minutes (0–${baseCap})`, baseMargin);
      if (a != null && b != null) {
        const newGround = clamp(a, 0, baseCap);
        const newMargin = clamp(b, 0, baseCap);
        save('groundMinutes', newGround);
        save('ocMarginMinutes', newMargin);
        S.groundMin = newGround;
        S.ocMarginMin = S.testMode ? TEST_MARGIN : newMargin;
        alert(`Saved: ground=${newGround}m, margin=${newMargin}m`);
      }
    });

    GM_registerMenuCommand(`${S.testMode ? 'Disable' : 'Enable'} TEST SCRIPT`, () => {
      toggleTestMode(!S.testMode);
      alert(`TEST SCRIPT ${S.testMode ? 'ENABLED' : 'DISABLED'}.`);
    });
  }

  /******** PAGE CONTEXT HELPERS ********/
  const isPDA = () => /TornPDA/i.test(navigator.userAgent);
  const isLikelyMobile = () =>
    /TornPDA|Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 900;

  function isTravelViewNow() {
    const p = (location.pathname || '').toLowerCase();
    if (p.includes('travelagency.php') || p.includes('travel.php') || p.includes('airstrip')) return true;
    if (p.includes('loader.php') || p.includes('index.php') || p === '/' || p === '') {
      const t = (document.body?.innerText || '').toLowerCase();
      return /please choose a destination|airstrip flights|are you sure you want to travel|flight time|earliest return/.test(t);
    }
    return false;
  }

  /******** TRAVEL COG — host finding + keep-alive ********/
  function findHeaderLinksStrip() {
    let el = document.querySelector('div.appHeaderWrapper___uyPti div.topSection___U7sVi div.linksContainer___LiOTN');
    if (el) return el;

    const appHeader = document.querySelector('div[class*="appHeaderWrapper"]');
    if (appHeader) {
      const top = appHeader.querySelector('div[class*="topSection"]') || appHeader;
      const links = top.querySelector('div[class*="linksContainer"]');
      if (links) return links;
    }

    el = document.querySelector('div[class*="appHeader___"]');
    if (el) return el;

    return document.querySelector('.titleContainer___QrlWP, h4.title___rhtB4, h4.heading___') || null;
  }

  function makeCogButton() {
    const btn = document.createElement('button');
    btn.id = 'ocfg-cog-btn';
    btn.type = 'button';
    btn.title = 'OC Flight Guard settings';
    btn.textContent = '⚙ OC';
    Object.assign(btn.style, {
      background: 'var(--input-money-error-border-color)',
      color: 'var(--btn-color)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      border: 'none',
      padding: '4px 8px',
      marginLeft: '8px',
      lineHeight: '1',
      fontSize: '12px',
      userSelect: 'none'
    });
    btn.addEventListener('click', openSettingsModal, { passive: true });
    return btn;
  }

  function ensureCog() {
    const host = findHeaderLinksStrip();
    if (!host) return;
    let btn = document.getElementById('ocfg-cog-btn');
    if (!btn) {
      btn = makeCogButton();
      if (/^(DIV|SPAN)$/i.test(host.tagName)) host.appendChild(btn);
      else host.insertAdjacentElement('afterend', btn);
    } else if (!host.contains(btn)) {
      if (/^(DIV|SPAN)$/i.test(host.tagName)) host.appendChild(btn);
      else host.insertAdjacentElement('afterend', btn);
    }
  }

  function refreshTravelCog() {
    ensureCog();
  }

  /******** SETTINGS MODAL ********/
  function openSettingsModal() {
    if (document.getElementById('ocfg-settings-modal')) return;

    const baseCap = Math.min(Math.max(5, get('ocMaxMinutesCap', DEFAULTS.ocMaxMinutesCap) || DEFAULTS.ocMaxMinutesCap), DEFAULTS.ocMaxMinutesCap);
    const savedGround = Number(get('groundMinutes', DEFAULTS.groundMinutes));
    const savedMargin = Number(get('ocMarginMinutes', DEFAULTS.ocMarginMinutes));

    const wrap = document.createElement('div');
    wrap.id = 'ocfg-settings-modal';
    wrap.innerHTML = `
      <div class="ocfg__ovl"></div>
      <div class="ocfg__dlg" role="dialog" aria-modal="true">
        <div class="ocfg__hdr">OC Flight Guard — Settings</div>
        <div class="ocfg__body">
          <label>API Key
            <input type="password" id="ocfg-key" placeholder="paste your key" value="${get('apiKey','') || ''}">
          </label>
          <label>Time on ground (min, ≤ ${baseCap})
            <input type="number" id="ocfg-ground" min="0" max="${baseCap}" value="${savedGround}">
          </label>
          <label>Margin before OC (min, ≤ ${baseCap})
            <input type="number" id="ocfg-margin" min="0" max="${baseCap}" value="${savedMargin}">
          </label>

          <section class="ocfg__test">
            <label class="ocfg__switch">
              <input type="checkbox" id="ocfg-test" ${S.testMode ? 'checked' : ''}>
              <span class="ocfg__switch-ui" aria-hidden="true"></span>
              <span class="ocfg__switch-label">TEST MODE</span>
            </label>
            <div class="ocfg__test-copy">
              <div class="ocfg__test-title">Try the blocker even without a near OC.</div>
              <div class="ocfg__test-desc">When ON, risky round trips will always trigger the warning so you can test your setup.</div>
            </div>
          </section>

          <div class="ocfg__credit">
            Script by
            <a href="https://www.torn.com/profiles.php?XID=3471936" target="_blank" rel="noopener">Noxious [3471936]</a>
          </div>
        </div>
        <div class="ocfg__row">
          <button id="ocfg-save">Save</button>
          <button id="ocfg-cancel" class="ocfg__muted">Cancel</button>
        </div>
      </div>
    `;
    const css = document.createElement('style');
    css.textContent = `
      #ocfg-settings-modal .ocfg__ovl { position:fixed; inset:0; background:rgba(0,0,0,.65); z-index:2147483646; }
      #ocfg-settings-modal .ocfg__dlg { position:fixed; z-index:2147483647; left:50%; top:50%; transform:translate(-50%,-50%);
        width:min(460px,92vw); background:#141414; color:#fff; border:2px solid #ff3b30; border-radius:14px; box-shadow:0 16px 50px rgba(0,0,0,.6);
        font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif; overflow:hidden; }
      .ocfg__hdr { padding:14px 16px; font-weight:900; background:linear-gradient(90deg,#ff3b30,#b00020); }
      .ocfg__body { padding:14px 16px; display:grid; gap:12px; }
      .ocfg__body label { display:grid; gap:6px; font-size:14px; }
      .ocfg__body input { padding:8px 10px; border-radius:8px; border:1px solid #333; background:#0e0e0e; color:#fff; }

      .ocfg__test { display:grid; gap:10px; padding:12px; border-radius:12px; background:#101214; border:1px solid #2a2b2f; }
      .ocfg__switch { display:grid; grid-template-columns:auto 1fr; align-items:center; gap:10px; position:relative; }
      .ocfg__switch input { appearance:none; -webkit-appearance:none; width:0; height:0; position:absolute; opacity:0; pointer-events:none; }
      .ocfg__switch-label { font-weight:900; letter-spacing:.3px; }
      .ocfg__switch-ui { width:44px; height:24px; border-radius:999px; background:#333; position:relative; display:inline-block; }
      .ocfg__switch-ui::after { content:""; position:absolute; width:18px; height:18px; border-radius:50%; top:3px; left:3px; background:#bbb; transition:transform .18s ease; }
      #ocfg-test:checked + .ocfg__switch-ui { background:#22c55e; }
      #ocfg-test:checked + .ocfg__switch-ui::after { transform:translateX(20px); background:#fff; }
      .ocfg__test-title { font-weight:800; }
      .ocfg__test-desc { opacity:.95; }

      .ocfg__credit { margin-top:6px; font-size:13px; opacity:.95; }
      .ocfg__credit a { color:#7dd3fc; text-decoration:underline; }
      .ocfg__row { display:flex; gap:10px; justify-content:flex-end; padding:12px 16px; background:#0d0d0d; }
      #ocfg-save { background:#15db6e; color:#000; font-weight:800; border:none; padding:8px 14px; border-radius:8px; cursor:pointer; }
      #ocfg-cancel { background:#2b2b2b; color:#fff; font-weight:700; border:none; padding:8px 14px; border-radius:8px; cursor:pointer; }
      .ocfg__muted { opacity:.9; }
    `;
    wrap.appendChild(css);
    document.documentElement.appendChild(wrap);

    wrap.querySelector('#ocfg-cancel')?.addEventListener('click', () => wrap.remove(), { once: true });
    wrap.querySelector('#ocfg-save')?.addEventListener('click', () => {
      const baseCapNow = Math.min(Math.max(5, get('ocMaxMinutesCap', DEFAULTS.ocMaxMinutesCap) || DEFAULTS.ocMaxMinutesCap), DEFAULTS.ocMaxMinutesCap);
      const newAPI = String(wrap.querySelector('#ocfg-key').value || '').trim();
      const newGround = clamp(wrap.querySelector('#ocfg-ground').value, 0, baseCapNow);
      const newMargin = clamp(wrap.querySelector('#ocfg-margin').value, 0, baseCapNow);
      save('apiKey', newAPI);
      save('groundMinutes', newGround);
      save('ocMarginMinutes', newMargin);

      S.apiKey = get('apiKey', '');
      S.groundMin = get('groundMinutes', DEFAULTS.groundMinutes);
      S.ocMarginMin = get('ocMarginMinutes', DEFAULTS.ocMarginMinutes);
      S.ocMaxMinutesCap = get('ocMaxMinutesCap', DEFAULTS.ocMaxMinutesCap);

      const wantTest = !!wrap.querySelector('#ocfg-test').checked;
      toggleTestMode(wantTest);

      wrap.remove();
    }, { once: true });
  }

  function toggleTestMode(on) {
    if (on) {
      save('testMode', true);
      S.testMode = true;
      S.ocMaxMinutesCap = TEST_CAP;
      S.ocMarginMin = TEST_MARGIN;
    } else {
      save('testMode', false);
      S.testMode = false;
      S.ocMaxMinutesCap = get('ocMaxMinutesCap', DEFAULTS.ocMaxMinutesCap);
      S.ocMarginMin = get('ocMarginMinutes', DEFAULTS.ocMarginMinutes);
      S.groundMin = get('groundMinutes', DEFAULTS.groundMinutes);
    }
  }

  /******** OC API (v2) ********/
  async function fetchOCStartTs() {
    if (!S.apiKey) return null;
    const now = Date.now();
    if (S.ocStartTs && (now - S.lastOCPoll) < S.ocPollMs) return S.ocStartTs;

    const urls = [
      `https://api.torn.com/v2/user?selections=organizedcrime&key=${encodeURIComponent(S.apiKey)}`,
      `https://api.torn.com/v2/user/organizedcrime?key=${encodeURIComponent(S.apiKey)}`
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: 'no-store', credentials: 'omit' });
        if (!res.ok) continue;
        const json = await res.json();
        if (!json || json.error) continue;
        const oc = json.organizedCrime || json.organizedcrime || json.organisedCrime || json.organisedcrime;
        if (!oc || typeof oc !== 'object') continue;

        const nowMs = Date.now();
        const exec  = normTs(oc.executed_at);
        const ready = normTs(oc.ready_at);
        S.ocStartTs = (exec && exec > nowMs) ? exec : (ready && ready > nowMs ? ready : null);
        S.lastOCPoll = now;
        return S.ocStartTs;
      } catch {}
    }
    return null;
  }
  const normTs = (v) => {
    if (v == null) return null;
    const n = typeof v === 'string' ? +v : v;
    if (!Number.isFinite(n)) return null;
    return n < 1e12 ? n * 1000 : n;
  };

  let ocTicker = null;
  function startOcPolling() {
    if (ocTicker) return;
    const tick = async () => { try { await fetchOCStartTs(); } catch {} };
    tick();
    ocTicker = setInterval(tick, Math.max(6000, S.ocPollMs));
  }
  function stopOcPolling() { if (ocTicker) { clearInterval(ocTicker); ocTicker = null; } }

  /******** TRAVEL PARSE ********/
  function parseVisibleTravelInfo() {
    const text = (document.body?.innerText || '');
    let minutes = null;

    let m = /It will take\s*(\d+)\s*hours?\s*(?:and\s*(\d+)\s*minutes?)?/i.exec(text);
    if (m) minutes = (+m[1] * 60) + (+m[2] || 0);
    if (minutes == null) { m = /Flight time\s*[-:]\s*(\d{1,2}):(\d{2})/i.exec(text); if (m) minutes = (+m[1] * 60) + (+m[2]); }
    if (minutes == null) { m = /Flight time\s*:\s*(\d+)\s*h(?:\s*(\d+)\s*m)?/i.exec(text); if (m) minutes = (+m[1] * 60) + (+m[2] || 0); }

    const flightTimeMs = minutes != null ? minutes * 60000 : null;

    const m2 = /Earliest return:\s*([0-2]?\d):([0-5]\d)(?:\s*(today|tomorrow))?/i.exec(text);
    let earliestReturnTs = null;
    if (m2) {
      const now = new Date();
      const t = new Date(now);
      t.setHours(+m2[1], +m2[2], 0, 0);
      const forcedTomorrow = (m2[3] && /tomorrow/i.test(m2[3])) || t.getTime() <= now.getTime();
      if (forcedTomorrow) t.setDate(t.getDate() + 1);
      earliestReturnTs = t.getTime();
    }

    return { flightTimeMs, earliestReturnTs };
  }

  /******** RISK ********/
  function evaluateRisk(info, ocStart) {
    const now = Date.now();
    const out = info.flightTimeMs, back = info.flightTimeMs;
    const ground = S.groundMin * 60000;
    const margin = S.ocMarginMin * 60000;

    const landingTs = now + out;
    let departBack = landingTs + ground;
    if (info.earliestReturnTs) departBack = Math.max(departBack, info.earliestReturnTs);

    const backInTornTs = departBack + back;
    const mustBeBackBy = ocStart - margin;

    return { risky: backInTornTs > mustBeBackBy, backInTornTs, mustBeBackBy };
  }

  // IMPORTANT: In Test Mode, simulate an imminent OC so the blocker always triggers
  async function getRiskContext() {
    const info = parseVisibleTravelInfo();
    if (!info.flightTimeMs) return { risky: false };

    if (S.testMode) {
      const now = Date.now();
      const out = info.flightTimeMs, back = info.flightTimeMs;
      const ground = S.groundMin * 60000;
      const departBack = (now + out) + ground;
      const backInTornTs = departBack + back;
      // Make "must be back by" effectively now, so any trip is late.
      const mustBeBackBy = now;
      return { risky: true, backInTornTs, mustBeBackBy };
    }

    const ocStart = S.ocStartTs || await fetchOCStartTs();
    if (!ocStart) return { risky: false };
    return evaluateRisk(info, ocStart);
  }

  /******** CONTINUE CONTROL + WARNING ********/
  function findConfirmRoot() {
    const nodes = Array.from(document.querySelectorAll('div,section,form'));
    for (const el of nodes) {
      const txt = (el.textContent || '').toLowerCase();
      if (txt.includes('are you sure you want to travel') ||
          txt.includes('you make your way over to the airstrip') ||
          txt.includes('flight time')) return el;
    }
    return document.body;
  }

  function swallow(e) { e.preventDefault(); e.stopImmediatePropagation(); }

  function disableContinueButtons() {
    const root = findConfirmRoot();
    const btns = Array.from(root.querySelectorAll('button, a, input[type="submit"], input[type="button"]'));
    btns.forEach(el => {
      const label = (el.textContent || el.value || '').trim().toLowerCase();
      const aria = (el.getAttribute && (el.getAttribute('aria-label') || '').toLowerCase()) || '';
      const isContinue = /continue/.test(label) || /continue/.test(aria);
      if (!isContinue) return;
      if ('disabled' in el) el.disabled = true;
      el.setAttribute('aria-disabled', 'true');
      el.style.pointerEvents = 'none';
      el.style.opacity = '0.55';
      el.style.filter = 'grayscale(1)';
      el.style.cursor = 'not-allowed';
      el.title = 'Blocked by OC Flight Guard';
      ['click','pointerdown','touchstart'].forEach(ev => el.addEventListener(ev, swallow, { capture: true }));
    });
  }
  function enableContinueButtons() {
    const root = findConfirmRoot();
    const btns = Array.from(root.querySelectorAll('button, a, input[type="submit"], input[type="button"]'));
    btns.forEach(el => {
      const label = (el.textContent || el.value || '').trim().toLowerCase();
      const aria = (el.getAttribute && (el.getAttribute('aria-label') || '').toLowerCase()) || '';
      const isContinue = /continue/.test(label) || /continue/.test(aria);
      if (!isContinue) return;
      if ('disabled' in el) el.disabled = false;
      el.removeAttribute('aria-disabled');
      el.style.pointerEvents = '';
      el.style.opacity = '';
      el.style.filter = '';
      el.style.cursor = '';
      el.title = '';
      ['click','pointerdown','touchstart'].forEach(ev => el.removeEventListener(ev, swallow, { capture: true }));
    });
  }

  const fmtTime = ts => {
    if (!ts) return '—';
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  function tryClickBackish() {
    const root = findConfirmRoot();
    const els = Array.from(root.querySelectorAll('button,a,input'));
    for (const el of els) {
      const txt  = ((el.textContent || el.value || '') + '').trim().toLowerCase();
      const aria = (el.getAttribute && (el.getAttribute('aria-label') || '').toLowerCase()) || '';
      if (/(^|\s)(cancel|back|close)(\s|$)/.test(txt) || /(cancel|back|close)/.test(aria)) {
        el.addEventListener('click', e => e.stopImmediatePropagation(), { capture: true, once: true });
        el.click();
        return true;
      }
    }
    return false;
  }

  const removeWarning = () => document.getElementById('oc-flight-guard-warning')?.remove();

  function exitAfterWarning() {
    S.warningActive = false;
    removeWarning();

    if (S.testMode && S.autoDisableTestPending) {
      S.autoDisableTestPending = false;
      toggleTestMode(false);
    }

    if (tryClickCancelOnConfirm() || tryClickBackish()) return;

    if (isPDA()) {
      try { window.location.assign('/loader.php?sid=city#/'); } catch {}
      setTimeout(() => { try { window.location.assign('/city.php'); } catch {} }, 200);
      return;
    }

    try { history.back(); } catch {}
    setTimeout(() => { try { window.location.assign('/travelagency.php'); } catch {} }, 120);
  }

  function showBigWarning(ctx) {
    const key = `${S.groundMin}|${S.ocMarginMin}|${S.enabled}|${S.testMode}`;
    if (S.lastRiskKey === key && document.getElementById('oc-flight-guard-warning')) return;
    S.lastRiskKey = key;

    if (S.testMode) S.autoDisableTestPending = true;

    removeWarning();
    const div = document.createElement('div');
    div.id = 'oc-flight-guard-warning';
    div.innerHTML = `
      <div class="ocfg__backdrop"></div>
      <div class="ocfg__panel" role="alert" aria-live="assertive">
        <div class="ocfg__title">
          <span class="ocfg__icon">✋</span>
          <span>Flight Blocked: Upcoming OC</span>
        </div>
        <div class="ocfg__body">
          <p class="ocfg__lead">Your current plan would get you back <b>too late</b> given your safety buffers.</p>
          <div class="ocfg__cards">
            <div class="ocfg__card">
              <div class="ocfg__cardlabel">Earliest return</div>
              <div class="ocfg__cardtime">${fmtTime(ctx?.backInTornTs)}</div>
            </div>
            <div class="ocfg__card">
              <div class="ocfg__cardlabel">Must be back by</div>
              <div class="ocfg__cardtime">${fmtTime(ctx?.mustBeBackBy)}</div>
            </div>
          </div>
          <div class="ocfg__chips">
            <span class="ocfg__chip">Ground: <b>${S.groundMin}m</b></span>
            <span class="ocfg__chip">OC margin: <b>${S.ocMarginMin}m</b></span>
            ${S.testMode ? '<span class="ocfg__chip ocfg__chip--test">TEST MODE</span>' : ''}
          </div>
          <p class="ocfg__hint">Adjust timings with the <b>⚙ OC</b> button on this page, or wait until your OC timing changes.</p>
        </div>
        <button class="ocfg__close" aria-label="Close">OK</button>
      </div>
    `;
    const css = document.createElement('style');
    css.textContent = `
      #oc-flight-guard-warning .ocfg__backdrop { position:fixed; inset:0; background:rgba(0,0,0,.70); z-index:2147483646; backdrop-filter:blur(1px); }
      #oc-flight-guard-warning .ocfg__panel { position:fixed; z-index:2147483647; left:50%; top:50%; transform:translate(-50%,-50%);
        width:min(560px,92vw); background:#0f0f10; color:#fff; border:2px solid #ff3b30; border-radius:18px; box-shadow:0 18px 60px rgba(0,0,0,.65);
        font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif; overflow:hidden; }
      .ocfg__title { display:flex; align-items:center; gap:10px; padding:16px 18px; font-size:22px; font-weight:900;
        background:linear-gradient(90deg,#ff3b30,#b00020); }
      .ocfg__icon { font-size:22px; }
      .ocfg__body { padding:16px 18px; }
      .ocfg__lead { font-size:16px; line-height:1.6; margin:0 0 10px; }
      .ocfg__cards { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:10px 0 12px; }
      .ocfg__card { background:#141518; border:1px solid #2a2b2f; border-radius:12px; padding:10px 12px; }
      .ocfg__cardlabel { font-size:12px; opacity:.85; margin-bottom:4px; }
      .ocfg__cardtime { font-size:20px; font-weight:900; letter-spacing:.4px; }
      .ocfg__chips { display:flex; flex-wrap:wrap; gap:8px; margin:6px 0 4px; }
      .ocfg__chip { background:#1a1c1f; border:1px solid #2a2b2f; border-radius:999px; padding:6px 10px; font-size:12px; }
      .ocfg__chip--test { color:#fff; background:#3b82f6; border-color:#2563eb; }
      .ocfg__hint { font-size:13px; opacity:.95; margin-top:10px; }
      .ocfg__close { margin:14px 18px 18px; background:#ff3b30; color:#fff; border:none; border-radius:12px; padding:12px 16px;
        font-size:16px; font-weight:900; cursor:pointer; width:calc(100% - 36px); }
      .ocfg__close:active { transform:translateY(1px); }
      @media (max-width: 460px) { .ocfg__cards { grid-template-columns:1fr; } }
    `;
    div.appendChild(css);
    document.documentElement.appendChild(div);

    S.warningActive = true;

    div.querySelector('.ocfg__close')?.addEventListener('click', exitAfterWarning, { once: true });
  }

  function tryClickCancelOnConfirm() {
    const root = findConfirmRoot();
    const btn = Array.from(root.querySelectorAll('button, a, input')).find(el =>
      /cancel/i.test((el.textContent || el.value || '').trim())
    );
    if (btn) {
      btn.addEventListener('click', e => e.stopImmediatePropagation(), { capture: true, once: true });
      btn.click();
      return true;
    }
    return false;
  }

  /******** OBSERVERS + INSTANT INTERCEPT ********/
  async function checkAndBlock() {
    refreshTravelCog();

    const inTravel = isTravelViewNow();
    if (!inTravel) {
      stopOcPolling();
      if (!S.warningActive) enableContinueButtons();
      if (!S.warningActive) removeWarning();
      return;
    }
    startOcPolling();

    const ctx = await getRiskContext();
    if (ctx.risky) {
      disableContinueButtons();
      showBigWarning(ctx);
    } else {
      if (!S.warningActive) {
        enableContinueButtons();
        removeWarning();
      }
    }
  }

  function installObserver() {
    let moTimer = 0;
    const mo = new MutationObserver(() => {
      if (moTimer) return;
      moTimer = setTimeout(() => { moTimer = 0; checkAndBlock(); }, 80);
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    setInterval(ensureCog, 1000);

    let lastHref = location.href, t = 0;
    const tick = () => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        clearTimeout(t);
        t = setTimeout(checkAndBlock, 120);
      }
    };
    setInterval(tick, 350);
    window.addEventListener('popstate', () => { clearTimeout(t); t = setTimeout(checkAndBlock, 120); }, { passive: true });
    window.addEventListener('hashchange', () => { clearTimeout(t); t = setTimeout(checkAndBlock, 120); }, { passive: true });
  }

  function interceptClicks(e) {
    (async () => {
      const target = e.target?.closest?.('a,button,input[type="submit"],input[type="button"],[role="button"]');
      if (!target) return;

      if (!isTravelViewNow()) return;

      const label = (target.textContent || target.value || '').toLowerCase();
      const href = (target.getAttribute && (target.getAttribute('href')) || '');
      const looksLikeTravel =
        /continue|travel|book|fly|board|purchase/.test(label) ||
        /travelagency|travel\.php|step=book|step=confirm|airstrip/.test(href);
      if (!looksLikeTravel) return;

      const ctx = await getRiskContext();
      if (ctx.risky) {
        e.preventDefault(); e.stopImmediatePropagation();
        disableContinueButtons();
        showBigWarning(ctx);
      }
    })();
  }

  /******** INIT ********/
  function init() {
    ensureCog();
    installObserver();

    // Always start polling so OC time is cached before any travel taps
    startOcPolling();

    // Non-passive so preventDefault() works on touch/click (Chrome guidance). :contentReference[oaicite:2]{index=2}
    if (isPDA()) {
      document.addEventListener('click', interceptClicks, { capture: true, passive: false });
    } else {
      document.addEventListener('click',       interceptClicks, { capture: true, passive: false });
      document.addEventListener('pointerdown', interceptClicks, { capture: true, passive: false });
      document.addEventListener('touchstart',  interceptClicks, { capture: true, passive: false });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
