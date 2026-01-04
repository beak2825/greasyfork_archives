// ==UserScript==
// @name         Maru Companion Sidebar
// @namespace    https://marumori.io/
// @version      1.3.0
// @description  Sidebar companion with dark/light detection, per-goal scheduling, focused-time counter and automatic completion detection.
// @author       Matskye
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @match        https://marumori.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/552289/Maru%20Companion%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/552289/Maru%20Companion%20Sidebar.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /********************
   * Color utilities
   ********************/
  function parseColor(input) {
    if (!input) return { r: 255, g: 255, b: 255, a: 1 };
    input = input.trim().toLowerCase();

    if (input.startsWith('rgb')) {
      const nums = input.match(/[\d.]+/g) || [];
      const r = Number(nums[0] || 255);
      const g = Number(nums[1] || 255);
      const b = Number(nums[2] || 255);
      const a = nums.length > 3 ? Number(nums[3]) : 1;
      return { r, g, b, a: isNaN(a) ? 1 : a };
    }

    if (input.startsWith('#')) {
      const hex = input.slice(1);
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return { r, g, b, a: 1 };
      }
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return { r, g, b, a: 1 };
      }
      if (hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = parseInt(hex.slice(6, 8), 16) / 255;
        return { r, g, b, a };
      }
    }

    if (input.startsWith('hsl')) {
      const nums = input.match(/[\d.]+/g) || [];
      let h = Number(nums[0] || 0);
      let s = Number(nums[1] || 0) / 100;
      let l = Number(nums[2] || 0) / 100;
      const a = nums.length > 3 ? Number(nums[3]) : 1;

      function h2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = h2rgb(p, q, (h / 360) + 1/3);
        g = h2rgb(p, q, (h / 360));
        b = h2rgb(p, q, (h / 360) - 1/3);
      }
      return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), a: isNaN(a) ? 1 : a };
    }

    return { r: 255, g: 255, b: 255, a: 1 };
  }

  function compositeRGBA(fg, bg) {
    const a = fg.a + bg.a * (1 - fg.a);
    const r = Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / (a || 1));
    const g = Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / (a || 1));
    const b = Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / (a || 1));
    return { r, g, b, a };
  }

  function brightnessYIQ({ r, g, b }) {
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  async function waitForThemeReady(maxMs = 1200) {
    const start = performance.now();
    return new Promise((resolve) => {
      const tick = () => {
        const cs = getComputedStyle(document.body || document.documentElement);
        const bg = cs.getPropertyValue('--background') || cs.backgroundColor;
        if (bg || (performance.now() - start) > maxMs) resolve();
        else setTimeout(tick, 50);
      };
      tick();
    });
  }

  function detectMode() {
    const cs = getComputedStyle(document.body);
    const varBgStr = cs.getPropertyValue('--background')?.trim() || '';
    const bodyBgStr = cs.backgroundColor || 'rgb(255,255,255)';
    const varBg = varBgStr ? parseColor(varBgStr) : null;
    const bodyBg = parseColor(bodyBgStr);
    const displayedBg = varBg ? (varBg.a < 1 ? compositeRGBA(varBg, bodyBg) : varBg) : bodyBg;
    const b = brightnessYIQ(displayedBg);
    const isDark = b < 128;
    return {
      isDark,
      panelBg: isDark ? 'rgba(20,20,20,0.95)' : 'rgba(255,255,255,0.98)',
      text:   isDark ? '#ffffff' : '#111111',
      accent: isDark ? '#ff8585' : '#ff6b6b'
    };
  }

  /********************
   * Data & helpers
   ********************/
    function getLocalDateString(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
    }
    let TODAY = getLocalDateString();
    const GOALS = [
    ['srsReviews', 'SRS Reviews'],
    ['srsGrammarReviews', 'SRS Grammar Reviews'],
    ['grammarLesson', 'Grammar Lesson'],
    ['mockExam', 'Mock Exam'],
    ['kanaGame', 'Kana Game'],
    ['conjugation', 'Conjugation Trainer'],
    ['transitivity', 'Transitivity Trainer'],
    ['wordle4', 'Wordle (4-letters)'],
    ['wordle5', 'Wordle (5-letters)'],
    ['crosswords', 'Crosswords'],
    ['kanjiImposters', 'Kanji Imposters'],
  ];

    const DEFAULT_SETTINGS = {
        collapsed: true,
        reviewGoal: 0, // 0 = disabled
        goals: Object.fromEntries(GOALS.map(([k]) => [k, { enabled: true, schedule: { mode: 'daily', every: 1 } }]))
    };


  /********************
   * Safe GM storage + BroadcastChannel sync (optimized + heartbeat)
   ********************/
  const STORAGE_CHANNEL = 'maru_companion_sync';
  let lastKnownCache = {};
  let bc = null;
  try { bc = new BroadcastChannel(STORAGE_CHANNEL); } catch { bc = null; }

  // Debounce buffer for outgoing messages
  const pendingBroadcasts = new Map();
  let broadcastTimer = null;

  function scheduleBroadcast() {
    if (broadcastTimer) return;
    broadcastTimer = setTimeout(() => {
      broadcastTimer = null;
      if (!bc || pendingBroadcasts.size === 0) return;
      const payload = Array.from(pendingBroadcasts.entries()).map(([key, value]) => ({ key, value }));
      pendingBroadcasts.clear();
      bc.postMessage({ batch: payload });
    }, 250); // Batch updates within 250 ms
  }

  if (bc) {
    bc.onmessage = (ev) => {
      const data = ev.data || {};
      const updates = data.batch || [data];
      for (const { key, value } of updates) {
        if (!key) continue;
        lastKnownCache[key] = value;

        // Auto-refresh UI when key affects sidebar
        if (key === 'settings' && typeof renderChecklist === 'function') renderChecklist();
        if (key === 'settings' && typeof renderReviewProgress === 'function') renderReviewProgress();
      }
    };
  }

  function GM_Get(k) {
    try {
      if (k in lastKnownCache) return lastKnownCache[k];
      const v = GM_getValue(k);
      lastKnownCache[k] = v;
      return v;
    } catch {
      return null;
    }
  }

  function GM_Set(k, v) {
    try {
      GM_setValue(k, v);
      lastKnownCache[k] = v;

      // Queue batched broadcast
      if (bc) {
        pendingBroadcasts.set(k, v);
        scheduleBroadcast();
      }
    } catch (err) {
      console.warn('GM_Set failed', err);
    }
  }

  // --- LocalStorage fallback sync (for environments without BroadcastChannel) ---
  window.addEventListener('storage', (ev) => {
    if (!ev.key || !ev.newValue) return;
    try {
      const value = JSON.parse(ev.newValue);
      lastKnownCache[ev.key] = value;
    } catch {}
  });

  /********************
   * Heartbeat Sync (every 30s)
   * Detects silent desync after sleep or background state.
   ********************/
  const HEARTBEAT_INTERVAL = 30000; // 30s
  setInterval(() => {
    try {
      const keysToCheck = Object.keys(lastKnownCache);
      let hasChanged = false;

      for (const k of keysToCheck) {
        const fresh = GM_getValue(k);
        const cached = lastKnownCache[k];
        // Simple deep equality check via JSON (safe since all stored values are objects or primitives)
        if (JSON.stringify(fresh) !== JSON.stringify(cached)) {
          lastKnownCache[k] = fresh;
          hasChanged = true;
        }
      }

      // If anything changed (e.g., due to background save elsewhere), rerender
      if (hasChanged) {
        if (typeof renderChecklist === 'function') renderChecklist();
        if (typeof renderReviewProgress === 'function') renderReviewProgress();
      }
    } catch (err) {
      console.warn('Heartbeat sync failed', err);
    }
  }, HEARTBEAT_INTERVAL);
  function deepMerge(target, source) {
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        target[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  function getSettings() {
    const saved = GM_Get('settings') || {};
    return deepMerge(structuredClone(DEFAULT_SETTINGS), saved);
  }

  function saveSettings(s) {
    const clean = structuredClone(DEFAULT_SETTINGS);
    const merged = deepMerge(clean, s);
    GM_Set('settings', merged);
  }
  function getDayState(date = TODAY) { const all = GM_Get('dayState') || {}; return all[date] || {}; }
  function setDayState(date, state) { const all = GM_Get('dayState') || {}; all[date] = state; GM_Set('dayState', all); }
  function getGoalLog() { return GM_Get('goalLog') || {}; }
  function saveGoalLog(log) { GM_Set('goalLog', log); }

  const daysBetween = (aStr, bStr) => {
    const a = new Date(`${aStr}T00:00:00`), b = new Date(`${bStr}T00:00:00`);
    return Math.round((b - a) / 86400000);
  };
  const isWeekend = (dStr) => {
    const d = new Date(`${dStr}T00:00:00`);
    return d.getDay() === 0 || d.getDay() === 6;
  };
  const isWeekday = (dStr) => !isWeekend(dStr);

  /********************
   * Scheduling logic
   ********************/
  function goalVisibleToday(key, goalCfg) {
    const s = goalCfg.schedule || { mode: 'daily', every: 1 };
    const log = getGoalLog();
    const last = log[key];

    switch (s.mode) {
      case 'daily':
        return true;
      case 'weekdays':
        return isWeekday(TODAY);
      case 'weekends':
        return isWeekend(TODAY);
      case 'everyX': {
        if (!last) return true;
        const diff = daysBetween(last, TODAY);
        return diff >= Math.max(1, s.every || 1);
      }
      default:
        return true;
    }
  }

  function markGoalDone(key) {
    const log = getGoalLog();
    log[key] = TODAY;          // record last completion
    saveGoalLog(log);

    const state = getDayState();
    state[key] = true;         // mark today done
    setDayState(TODAY, state);

    renderChecklist && renderChecklist();
  }

  function markGoalUndoneToday(key) {
    const state = getDayState();
    state[key] = false;
    setDayState(TODAY, state);
    renderChecklist && renderChecklist();
  }

  /********************
   * Auto-detection (SPA-aware)
   ********************/
  let srsInProgress = false;
  let srsGrammarInProgress = false;
  let markListenerBound = false;

  const URL_TESTS = {
    // flow starts
    srsStart: () => location.pathname === '/study-lists/reviews' && !location.search.includes('grammar=true'),
    srsGrammarStart: () => location.pathname === '/study-lists/reviews' && location.search.includes('grammar=true'),

    // flow ends (results pages)
    srsEnd: () => location.pathname === '/study-lists/results' && location.search.includes('reviews=true'),
    srsGrammarEnd: () => location.pathname === '/study-lists/results' && location.search.includes('grammar=true'),

    // visits/tools
    mockExam: () => /^\/tools\/mock-exams\/N[1-5]$/.test(location.pathname),
    kanaGame: () => location.pathname === '/tools/kana' || location.pathname === '/mini-games/kana',
    conjugation: () => location.pathname === '/tools/conjugation',
    wordle4: () => location.pathname === '/tools/wordle/game' && /[?&]difficulty=4(\b|&|$)/.test(location.search),
    wordle5: () => location.pathname === '/tools/wordle/game' && /[?&]difficulty=5(\b|&|$)/.test(location.search),
    kanjiImposters: () => location.pathname === '/mini-games/kanji-imposters',
    crosswords: () => location.pathname.startsWith('/tools/crosswords'),
    transitivity: () => location.pathname.startsWith('/tools/transitivity'),


    // grammar lesson pages
    isAdventureLesson: () => location.pathname.startsWith('/adventure/'),
  };

  function handleRoute() {
    const settings = getSettings();

    // mark starts
    if (URL_TESTS.srsStart()) srsInProgress = true;
    if (URL_TESTS.srsGrammarStart()) srsGrammarInProgress = true;

    // ends → look for "Correct(N)" / "Incorrect(N)"
if (URL_TESTS.srsEnd() && srsInProgress) {
  waitForResultsCounts().then(({ correct, incorrect }) => {
    const total = (correct || 0) + (incorrect || 0);
    if (total > 0) {
      markGoalDone('srsReviews');

      // --- Track daily review count (local date) ---
      const rcLog = GM_Get('reviewCountLog') || {};
      rcLog[TODAY] = (rcLog[TODAY] || 0) + total;
      GM_Set('reviewCountLog', rcLog);
    }
    srsInProgress = false;
    // Update UI if present
    if (typeof renderReviewProgress === 'function') renderReviewProgress();
  });
}

    if (URL_TESTS.srsGrammarEnd() && srsGrammarInProgress) {
      waitForResultsCounts().then(({ correct, incorrect }) => {
        if ((correct || 0) > 0 || (incorrect || 0) > 0) markGoalDone('srsGrammarReviews');
        srsGrammarInProgress = false;
      });
    }

    // visit-based goals (respect enabled toggles, but still record if visited)
    if (settings.goals.mockExam?.enabled && URL_TESTS.mockExam()) markGoalDone('mockExam');
    if (settings.goals.kanaGame?.enabled && URL_TESTS.kanaGame()) markGoalDone('kanaGame');
    if (settings.goals.conjugation?.enabled && URL_TESTS.conjugation()) markGoalDone('conjugation');
    if (settings.goals.transitivity?.enabled && URL_TESTS.transitivity()) markGoalDone('transitivity');
    if (settings.goals.wordle4?.enabled && URL_TESTS.wordle4()) markGoalDone('wordle4');
    if (settings.goals.wordle5?.enabled && URL_TESTS.wordle5()) markGoalDone('wordle5');
    if (settings.goals.crosswords?.enabled && URL_TESTS.crosswords()) markGoalDone('crosswords');
    if (settings.goals.kanjiImposters?.enabled && URL_TESTS.kanjiImposters()) markGoalDone('kanjiImposters');

    // grammar lesson: watch for "Mark as done"
    if (URL_TESTS.isAdventureLesson()) bindMarkAsDoneListener();
  }

  function waitForResultsCounts(timeoutMs = 10000) {
    return new Promise((resolve) => {
      let resolved = false;
      let obs;

      const parseCounts = () => {
        const h3s = Array.from(document.querySelectorAll('h3'));
        let correct = null, incorrect = null;
        for (const h of h3s) {
          const text = (h.textContent || '').trim();
          if (/^Correct\s*\(\d+\)$/i.test(text)) correct = parseInt(text.match(/\d+/)[0], 10);
          if (/^Incorrect\s*\(\d+\)$/i.test(text)) incorrect = parseInt(text.match(/\d+/)[0], 10);
        }
        if (correct !== null || incorrect !== null) {
          resolved = true;
          obs && obs.disconnect();
          resolve({ correct, incorrect });
          return true;
        }
        return false;
      };

      if (parseCounts()) return;
      obs = new MutationObserver(() => parseCounts());
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        if (!resolved) {
          obs.disconnect();
          resolve({ correct: 0, incorrect: 0 });
        }
      }, timeoutMs);
    });
  }

  function bindMarkAsDoneListener() {
    if (markListenerBound) return;
    markListenerBound = true;
    document.addEventListener('click', (e) => {
      const el = findNearestWithText(e.target, 'Mark as done');
      if (el) markGoalDone('grammarLesson');
    }, true);
  }

  function findNearestWithText(startEl, exactText) {
    const MAX_UP = 5;
    let el = startEl;
    for (let i = 0; i < MAX_UP && el; i++, el = el.parentElement) {
      if (typeof el.innerText === 'string' && el.innerText.trim() === exactText) return el;
      const match = el.querySelector && Array.from(el.querySelectorAll('*'))
        .find(n => (n.innerText || '').trim() === exactText);
      if (match) return match;
    }
    return null;
  }

  function patchHistory() {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function () {
      const ret = pushState.apply(this, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };
    history.replaceState = function () {
      const ret = replaceState.apply(this, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };
    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('locationchange'));
    });
    window.addEventListener('locationchange', () => {
      setTimeout(handleRoute, 50);
    });
  }

  /********************
   * Shadow DOM UI
   ********************/
  let shadowRoot, styleEl, palette;
  let renderChecklist; // assigned in buildUI
  let renderReviewProgress;   // expose globally so route handlers can trigger it

  function applyStyles() {
    if (!styleEl) return;
    styleEl.textContent = `
      :host { font-family: system-ui,-apple-system,Segoe UI,Roboto,sans-serif!important; color:${palette.text}!important; }
      .toggle { width:44px;height:44px;border-radius:999px;background:${palette.panelBg};color:${palette.text}!important;
        border:1px solid ${palette.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'};
        box-shadow:0 8px 24px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center;
        cursor:pointer;user-select:none; }
      .sidebar { width:280px;background:${palette.panelBg};border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.12);
        border:1px solid ${palette.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'};color:${palette.text}!important; }
      .header { display:flex;justify-content:space-between;align-items:center;
        padding:10px 12px;border-bottom:1px solid ${palette.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}; }
      .progress { height:4px;background:${palette.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}; }
      .bar { height:100%;background:${palette.accent};width:0%;transition:width .3s; }
      .goal { display:flex;justify-content:space-between;align-items:center;
        padding:6px 10px;margin:4px 8px;border-radius:10px;background:${palette.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'}; }
      .btn { background:none;border:none;cursor:pointer;color:${palette.text}!important; }
      .btn:hover { color:${palette.accent}!important; }
      .timebox { border-top:1px solid ${palette.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'};margin-top:6px;
        padding:8px 12px 12px;font-size:12px; }
      .modalBg {position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:9999999;}
      .modal {background:${palette.panelBg};color:${palette.text};padding:16px 20px;border-radius:12px;
        box-shadow:0 8px 24px rgba(0,0,0,.2);width:400px;max-height:80vh;overflow:auto;}
      .row {display:flex;align-items:center;justify-content:space-between;margin:6px 0;gap:6px;}
      .timebox > div strong { display:block;margin-bottom:2px; }
    `;
  }
function openSettings() {
  const s = getSettings();
  const modal = document.createElement('div');
  modal.className = 'modalBg';
  modal.innerHTML = `
    <div class="modal">
      <h3>Maru Companion Settings</h3>
      <div id="rows"></div>
      <div style="text-align:right;margin-top:8px;">
        <button class="btn" id="close">Close</button>
      </div>
    </div>`;
  shadowRoot.appendChild(modal);

  const rows = modal.querySelector('#rows');

  // --- Daily review goal setting ---
  const reviewRow = document.createElement('div');
  reviewRow.className = 'row';
  reviewRow.innerHTML = `
    <label style="flex:1;">Daily review goal</label>
    <input type="number" id="reviewGoal" min="0" value="${Number(s.reviewGoal || 0)}" style="width:100px;">
    <span style="font-size:12px;opacity:.8;">(0 to disable)</span>
  `;
  rows.appendChild(reviewRow);

  reviewRow.querySelector('#reviewGoal').addEventListener('change', e => {
    const val = Math.max(0, parseInt(e.target.value || '0', 10));
    const cur = getSettings();
    cur.reviewGoal = val;
    saveSettings(cur);
    if (typeof renderReviewProgress === 'function') renderReviewProgress();
  });

  // --- Goal toggles below ---
  GOALS.forEach(([k, name]) => {
    const g = s.goals[k] || (s.goals[k] = { enabled: true, schedule: { mode: 'daily', every: 1 } });
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <span class="name"><label><input type="checkbox" data-goal="${k}" ${g.enabled ? 'checked' : ''}/> ${name}</label></span>
      <select data-type="${k}">
        <option value="daily" ${g.schedule.mode === 'daily' ? 'selected' : ''}>Every day</option>
        <option value="everyX" ${g.schedule.mode === 'everyX' ? 'selected' : ''}>Every X days</option>
        <option value="weekdays" ${g.schedule.mode === 'weekdays' ? 'selected' : ''}>Weekdays</option>
        <option value="weekends" ${g.schedule.mode === 'weekends' ? 'selected' : ''}>Weekends</option>
      </select>
      <span data-xwrap="${k}" ${g.schedule.mode === 'everyX' ? '' : 'style="display:none"'}>X=<input type="number" min="1" value="${g.schedule.every || 1}" data-x="${k}" style="width:56px"></span>
    `;
    rows.appendChild(row);
  });

  rows.querySelectorAll('input[data-goal]').forEach(sw => {
    sw.addEventListener('change', e => {
      const key = e.target.dataset.goal;
      s.goals[key].enabled = e.target.checked;
      saveSettings(s);
      renderChecklist();
    });
  });

  rows.querySelectorAll('select[data-type]').forEach(sel => {
    sel.addEventListener('change', e => {
      const key = e.target.dataset.type;
      const mode = e.target.value;
      s.goals[key].schedule = s.goals[key].schedule || { mode: 'daily', every: 1 };
      s.goals[key].schedule.mode = mode;
      const span = rows.querySelector(`span[data-xwrap="${key}"]`);
      if (mode === 'everyX') {
        s.goals[key].schedule.every = Math.max(1, s.goals[key].schedule.every || 2);
        span.style.display = '';
      } else {
        span.style.display = 'none';
      }
      saveSettings(s);
      renderChecklist();
    });
  });

  rows.querySelectorAll('input[data-x]').forEach(inp => {
    inp.addEventListener('change', e => {
      const key = e.target.dataset.x;
      const val = Math.max(1, parseInt(e.target.value || '1', 10));
      s.goals[key].schedule = s.goals[key].schedule || { mode: 'everyX', every: val };
      s.goals[key].schedule.every = val;
      saveSettings(s);
      renderChecklist();
    });
  });

  modal.querySelector('#close').onclick = () => modal.remove();
  modal.addEventListener('click', ev => { if (ev.target === modal) modal.remove(); });
}

  function buildUI() {
    // track focus/visibility for time logging
  let focusActive = document.hasFocus();
  let visibleActive = document.visibilityState === 'visible';
  let tickStart = null;
    const host = document.createElement('aside');
    host.style.position = 'fixed';
    host.style.right = '16px';
    host.style.top = '80px';
    host.style.zIndex = '999999';
    host.style.display = 'flex';
    host.style.flexDirection = 'column';
    host.style.alignItems = 'flex-end';
    document.body.appendChild(host);

    shadowRoot = host.attachShadow({ mode: 'open' });
    styleEl = document.createElement('style');
    shadowRoot.appendChild(styleEl);

    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'toggle';
    toggleBtn.innerHTML = `<img src="https://raw.githubusercontent.com/matskye/maru-image-repository/b6f508252aa67249a8fea8c3385441d3469191bb/maru_happy.webp"
    alt="Maru" style="width: 32px; height: 32px; border-radius: 50%;">`;
    shadowRoot.appendChild(toggleBtn);

    const panelWrap = document.createElement('div');
    panelWrap.style.marginTop = '8px';
    shadowRoot.appendChild(panelWrap);

    const panel = document.createElement('div');
    panel.className = 'sidebar';
    panel.innerHTML = `
      <div class="header">
        <strong>Maru</strong>
        <div>
          <button class="btn" id="settings">⚙️</button>
          <button class="btn" id="clearToday">🗑️</button>
        </div>
      </div>
      <div class="progress"><div class="bar" id="bar"></div></div>
      <div id="list"></div>
<div class="timebox" style="display:flex;gap:8px;padding-right:4px;" id="statsContainer">
  <div style="flex:1;" id="maruTime"></div>
  <div style="flex:1;" id="reviewProgress"></div>
</div>
    `;
    panelWrap.appendChild(panel);

    applyStyles();

    const s = getSettings();
    panelWrap.style.display = s.collapsed ? 'none' : 'block';
    toggleBtn.onclick = () => {
      const collapsed = panelWrap.style.display !== 'none';
      s.collapsed = collapsed;
      saveSettings(s);
      panelWrap.style.display = collapsed ? 'none' : 'block';
    };

    const elList = panel.querySelector('#list');
    const elBar = panel.querySelector('#bar');
    const btnClear = panel.querySelector('#clearToday');
    const btnSettings = panel.querySelector('#settings');

    renderChecklist = function () {
      const s = getSettings();
      const d = getDayState();
      const items = GOALS
        .filter(([k]) => s.goals[k]?.enabled && goalVisibleToday(k, s.goals[k]))
        .map(([k, name]) => ({ key: k, name, done: !!d[k] }));
      const doneCount = items.filter(it => it.done).length;
      elBar.style.width = `${(doneCount / (items.length || 1)) * 100}%`;
      elList.innerHTML = items.map(it => `
        <div class="goal">
          <label><input type="checkbox" data-goal="${it.key}" ${it.done ? 'checked' : ''}/> ${it.name}</label>
          ${it.done ? '✅' : '⬜️'}
        </div>`).join('');
      elList.querySelectorAll('input').forEach(cb => {
        const key = cb.dataset.goal;
        cb.onchange = e => e.target.checked ? markGoalDone(key) : markGoalUndoneToday(key);
      });
      renderTime();
      renderReviewProgress();
    };

setInterval(() => {
  const el = shadowRoot.getElementById('maruTime');
  if (!el) return;

  const log = GM_Get('timeLog') || {};
  const todayMs = log[TODAY] || 0;
  const active = document.hasFocus() && document.visibilityState === 'visible' && tickStart != null;
  const msNow = active ? todayMs + (Date.now() - tickStart) : todayMs;

  const fmt = (ms) =>
    `${Math.floor(ms / 3600000)}h ${String(Math.floor((ms / 60000) % 60)).padStart(2, '0')}m`;

  const todayLine = el.querySelector('#todayTime');
  if (todayLine) todayLine.textContent = `Today: ${fmt(msNow)}`;
}, 10000);


function renderTime() {
  const el = shadowRoot.getElementById('maruTime');
  if (!el) return;

  const log = GM_Get('timeLog') || {};
  const sum = (fn) => Object.entries(log).reduce((acc, [d, ms]) => acc + (fn(d) ? ms : 0), 0);

  const todayMs = sum(d => d === TODAY);
  const weekMs  = sum(d => daysBetween(d, TODAY) <= 6 && daysBetween(d, TODAY) >= 0);
  const monthMs = sum(d => d.slice(0,7) === TODAY.slice(0,7));
  const allMs   = sum(() => true);

  const fmt = (ms) =>
    `${Math.floor(ms / 3600000)}h ${String(Math.floor((ms / 60000) % 60)).padStart(2, '0')}m`;

  el.innerHTML = `<div><strong>Time</strong></div>
    <div id="todayTime">Today: ${fmt(todayMs)}</div>
    <div>Week: ${fmt(weekMs)}</div>
    <div>Month: ${fmt(monthMs)}</div>
    <div>All: ${fmt(allMs)}</div>`;
}

renderReviewProgress = function () {
  const el = shadowRoot.getElementById('reviewProgress');
  if (!el) return;

  const s = getSettings();
  const goal = Number(s.reviewGoal || 0);
  const log = GM_Get('reviewCountLog') || {};

  const days = Object.keys(log);
  if (days.length === 0 && goal === 0) {
    el.innerHTML = '';
    return;
  }

  const todayCount = log[TODAY] || 0;
  const weekCount  = days.reduce(
    (a, d) => a + ((daysBetween(d, TODAY) <= 6 && daysBetween(d, TODAY) >= 0) ? log[d] : 0), 0);
  const monthCount = days.reduce(
    (a, d) => a + (d.slice(0,7) === TODAY.slice(0,7) ? log[d] : 0), 0);
  const allCount   = days.reduce((a, d) => a + log[d], 0);

  let progressBar = '';
  if (goal > 0) {
    const pct = Math.min(100, (todayCount / goal) * 100);
    const pctText = Number.isFinite(pct) ? `${pct.toFixed(0)}%` : '0%';
    const done = todayCount >= goal ? ' ✅' : '';
    progressBar = `
      <div style="margin-top:4px;height:4px;background:${
        palette.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'
      };border-radius:2px;overflow:hidden;">
        <div style="height:100%;width:${pct}%;background:${palette.accent};transition:width .3s;"></div>
      </div>
      <div style="font-size:11px;text-align:right;opacity:0.8;margin-top:2px;">
        ${todayCount} / ${goal} (${pctText})${done}
      </div>`;
  }

  el.innerHTML = `
    <div><strong>Reviews</strong></div>
    <div>Today: ${todayCount}</div>
    <div>Week: ${weekCount}</div>
    <div>Month: ${monthCount}</div>
    <div>All: ${allCount}</div>
    ${progressBar}`;
};

btnClear.onclick = () => {
  const all = GM_Get('dayState') || {};
  all[TODAY] = {};
  GM_Set('dayState', all);

  const rcLog = GM_Get('reviewCountLog') || {};
  rcLog[TODAY] = 0;
  GM_Set('reviewCountLog', rcLog);

  renderChecklist();
  if (typeof renderReviewProgress === 'function') renderReviewProgress();
};

    btnSettings.onclick = openSettings;
    renderChecklist();

    // Focused time tracking
    const maybeStart = () => { if (focusActive && visibleActive && tickStart == null) tickStart = Date.now(); };
    const maybeStop = () => {
      if (tickStart != null) {
        const ms = Date.now() - tickStart; tickStart = null;
        const log = GM_Get('timeLog') || {};
        log[TODAY] = (log[TODAY] || 0) + ms; GM_Set('timeLog', log);
        // update time box only
        const el = shadowRoot && shadowRoot.getElementById('maruTime');
        if (el) {
          const sum = (fn) => Object.entries(log).reduce((acc, [d, ms]) => acc + (fn(d) ? ms : 0), 0);
          const todayMs = sum(d => d === TODAY);
          const weekMs  = sum(d => daysBetween(d, TODAY) <= 6 && daysBetween(d, TODAY) >= 0);
          const monthMs = sum(d => d.slice(0,7) === TODAY.slice(0,7));
          const allMs   = sum(() => true);
          const fmt = (ms) => `${Math.floor(ms / 3600000)}h ${String(Math.floor((ms / 60000) % 60)).padStart(2, '0')}m`;
          el.innerHTML = `<div><strong>Time</strong></div>
            <div>Today: ${fmt(todayMs)}</div>
            <div>Week: ${fmt(weekMs)}</div>
            <div>Month: ${fmt(monthMs)}</div>
            <div>All: ${fmt(allMs)}</div>`;
        }
      }
    };
    window.addEventListener('focus', () => { focusActive = true; maybeStart(); });
    window.addEventListener('blur',  () => { focusActive = false; maybeStop(); });
    document.addEventListener('visibilitychange', () => { visibleActive = document.visibilityState === 'visible'; visibleActive ? maybeStart() : maybeStop(); });
    window.addEventListener('beforeunload', maybeStop);
  }

  // --- Auto-reset visuals when local date flips ---
(function setupLocalMidnightWatcher() {
  let currentDate = TODAY;
  setInterval(() => {
    const now = getLocalDateString();
    if (now !== currentDate) {
      currentDate = now;
      TODAY = now;
      if (typeof renderChecklist === 'function') renderChecklist();
      if (typeof renderReviewProgress === 'function') renderReviewProgress();
    }
  }, 60 * 1000);
})();

  /********************
   * Boot
   ********************/
  (async () => {
    await waitForThemeReady();
    palette = detectMode();
    buildUI();

    // observe theme changes
    const obs = new MutationObserver(() => {
      const next = detectMode();
      const changed = next.isDark !== palette.isDark || next.panelBg !== palette.panelBg;
      palette = next;
      if (changed) applyStyles();
    });
    obs.observe(document.documentElement, { attributes: true, subtree: true });

    // SPA routing & auto-detection
    patchHistory();
    handleRoute(); // initial
  })();

})();