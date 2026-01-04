// ==UserScript==
// @name         Volvo's NBS Stage 1 ++
// @namespace    none
// @version      1.18
// @description  NBS memo page helper with 9–10s auto-click and divide/custom UI
// @match        https://*.tribalwars.net/game.php?*screen=memo*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552156/Volvo%27s%20NBS%20Stage%201%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/552156/Volvo%27s%20NBS%20Stage%201%20%2B%2B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const K = (id, sfx) => `Volvo[${id}]${sfx}`;
  const S = {
    get: (id, s) => localStorage.getItem(K(id, s)),
    set: (id, s, v) => localStorage.setItem(K(id, s), v),
    remove: (id, s) => localStorage.removeItem(K(id, s))
  };

  // HH:MM:SS(.fff) 지원
  const t2s = (s) => {
    if (!s) return null;
    const m = String(s).trim().match(/^(\d{1,2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/);
    if (!m) return null;
    const sec = (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]);
    const ms = m[4] ? +m[4] : 0;
    return sec + ms / 1000;
  };

  const CLICKED = new Set();
  const THRESH = new Map();

  (function injectStyle() {
    if (document.getElementById('nbs-ui-style')) return;
    const style = document.createElement('style');
    style.id = 'nbs-ui-style';
    style.textContent = `
      .nbs-divide-wrap{display:inline-flex;gap:8px;align-items:center;justify-content:center;margin-left:8px}
      .nbs-inputs{display:inline-flex;flex-wrap:wrap;gap:4px;max-width:180px;justify-content:center}
      .nbs-input{width:32px;text-align:center;padding:2px 4px;font-size:12px;border:1px solid #c7c7c7;border-radius:3px}
      .nbs-input::-webkit-outer-spin-button,.nbs-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
      .nbs-input[type=number]{-moz-appearance:textfield}
      #nbsSnipeAutoCloseBtn{margin-left:8px}
      .nbs-btn-active{background:linear-gradient(to bottom,#0bac00 0%,#0e7a1e 100%)!important;color:#fff!important;border-color:#006712!important}
    `;
    document.head.appendChild(style);
  })();

  function percentDefaults(n) {
    const base = Math.floor(100 / n), rem = 100 - base * n;
    return Array.from({ length: n }, (_, i) => String(base + (i < rem ? 1 : 0)));
  }

  function buildPercentInputs(wrapEl, wrap, count, reset) {
    let vals = reset ? percentDefaults(count) : JSON.parse(wrapEl.dataset.nbsValues || '[]');
    if (!Array.isArray(vals) || vals.length !== count) vals = percentDefaults(count);
    wrapEl.dataset.nbsValues = JSON.stringify(vals);
    wrap.textContent = '';
    vals.forEach((val, idx) => {
      const input = document.createElement('input');
      input.type = 'number'; input.min = '0'; input.max = '100'; input.step = '1';
      input.className = 'nbs-input'; input.value = val;
      const commit = () => {
        vals[idx] = String(input.value || '0');
        wrapEl.dataset.nbsValues = JSON.stringify(vals);
      };
      input.addEventListener('input', commit);
      input.addEventListener('blur', commit);
      wrap.appendChild(input);
    });
  }

  function buildCustomInputs(wrapEl, wrap, initDefaults) {
    const val = initDefaults ? '1000' : (JSON.parse(wrapEl.dataset.nbsValues || '["1000"]')[0] || '1000');
    wrapEl.dataset.nbsValues = JSON.stringify([val]);
    wrap.textContent = '';
    const input = document.createElement('input');
    input.type = 'number'; input.step = '1'; input.min = '1';
    input.className = 'nbs-input'; input.style.width = '52px'; input.value = val;
    const commit = () => { wrapEl.dataset.nbsValues = JSON.stringify([String(input.value || '1000')]); };
    input.addEventListener('input', commit);
    input.addEventListener('blur', commit);
    wrap.appendChild(input);
  }

  function addDivideCustomToLink(a) {
    if (a.nextElementSibling && a.nextElementSibling.classList.contains('nbs-divide-wrap')) return;
    const isSupport = a.innerText.trim() === 'Support';
    const wrap = document.createElement('span');
    wrap.className = 'nbs-divide-wrap';
    const btn = document.createElement('a');
    btn.href = 'javascript:void(0)';
    btn.className = 'btn nbs-divide';
    btn.textContent = 'Divide: 1';
    btn.title = isSupport ? '1→Custom→1' : '1→2→3→4→Custom→1';
    const inputs = document.createElement('span');
    inputs.className = 'nbs-inputs';
    wrap.dataset.nbsMode = 'percent';
    wrap.dataset.nbsDivideN = '1';
    buildPercentInputs(wrap, inputs, 1, true);
    btn.addEventListener('click', () => {
      const mode = wrap.dataset.nbsMode;
      let n = parseInt(wrap.dataset.nbsDivideN || '1', 10);
      if (mode === 'percent') {
        if (isSupport) {
          wrap.dataset.nbsMode = 'custom';
          btn.textContent = 'Custom';
          buildCustomInputs(wrap, inputs, true);
        } else {
          if (n < 4) {
            n++;
            wrap.dataset.nbsDivideN = String(n);
            btn.textContent = `Divide: ${n}`;
            buildPercentInputs(wrap, inputs, n, true);
          } else {
            wrap.dataset.nbsMode = 'custom';
            btn.textContent = 'Custom';
            buildCustomInputs(wrap, inputs, true);
          }
        }
      } else {
        wrap.dataset.nbsMode = 'percent';
        wrap.dataset.nbsDivideN = '1';
        btn.textContent = 'Divide: 1';
        buildPercentInputs(wrap, inputs, 1, true);
      }
    });
    wrap.appendChild(btn);
    wrap.appendChild(inputs);
    a.insertAdjacentElement('afterend', wrap);
  }

  function addSnipeAutoCloseButton() {
    if (document.getElementById('nbsSnipeAutoCloseBtn')) return;
    const btn = document.createElement('a');
    btn.href = 'javascript:void(0)';
    btn.id = 'nbsSnipeAutoCloseBtn';
    btn.className = 'btn';
    btn.textContent = 'Snipe Tab Auto Close';
    let state = localStorage.getItem('VolvoSnipeTabAutoClose');
    if (state === null) {
      state = 'Off';
      localStorage.setItem('VolvoSnipeTabAutoClose', state);
    }
    if (state === 'On') btn.classList.add('nbs-btn-active');
    btn.addEventListener('click', () => {
      const cur = localStorage.getItem('VolvoSnipeTabAutoClose') || 'Off';
      const ns = cur === 'On' ? 'Off' : 'On';
      localStorage.setItem('VolvoSnipeTabAutoClose', ns);
      btn.classList.toggle('nbs-btn-active', ns === 'On');
    });
    const rename = document.querySelector('a.rename_link');
    if (rename) rename.insertAdjacentElement('afterend', btn);
    else (document.getElementById('content_value') || document.body).appendChild(btn);
  }

  function patchMemoUI() {
    const showTd = document.querySelector('.show_row td[colspan="2"]');
    if (!showTd) return;
    showTd.querySelectorAll('a[href*="screen=place&target="]').forEach(addDivideCustomToLink);
    addSnipeAutoCloseButton();
  }

  function getVillageIdFromLink(a) {
    try { return new URL(a.href, location.origin).searchParams.get('village'); }
    catch { const m = a.href.match(/village=(\d+)/); return m ? m[1] : null; }
  }

  function parseTimesFromLine(lineText) {
    // 두 타임스탬프. 밀리초는 선택.
    const times = lineText.match(/\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}(?:\.\d{3})?/g);
    if (!times || times.length < 2) return { launchTime: null, landingTime: null };
    const lm = times[0].match(/\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2}:\d{2}(?:\.\d{3})?)/);
    const am = times[1].match(/\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2}:\d{2}(?:\.\d{3})?)/);
    return { launchTime: lm ? lm[1] : null, landingTime: am ? am[1] : null };
  }

  function getUnitFromLine(lineText) {
    const units = ['spear', 'sword', 'axe', 'spy', 'light', 'heavy', 'ram', 'catapult', 'snob'];
    for (const unit of units) if (lineText.includes(unit)) return unit;
    return null;
  }

  function getLineText(a) {
    let node = a.previousSibling, text = '';
    while (node) {
      if (node.nodeType === 3) text = node.textContent + text;
      else if (node.tagName === 'B') text = node.textContent + text;
      else if (node.tagName === 'SPAN' || node.tagName === 'A') text = node.innerText + text;
      node = node.previousSibling;
    }
    return text.trim();
  }

  function getDivideConfig(a) {
    const divideWrap = a.nextElementSibling;
    if (!divideWrap || !divideWrap.classList.contains('nbs-divide-wrap')) {
      return { mode: 'percent', count: '1', '#1': '100' };
    }
    const mode = divideWrap.dataset.nbsMode || 'percent';
    const count = mode === 'percent' ? String(parseInt(divideWrap.dataset.nbsDivideN || '1', 10)) : '1';
    const vals = JSON.parse(divideWrap.dataset.nbsValues || '["100"]');
    const obj = { mode, count };
    for (let i = 1; i <= parseInt(count, 10); i++) obj['#' + i] = vals[i - 1] || '100';
    return obj;
  }

  function saveDataAndClick(a) {
    const id = getVillageIdFromLink(a);
    if (!id) return;
    const lineText = getLineText(a);
    const { launchTime, landingTime } = parseTimesFromLine(lineText);
    const unit = getUnitFromLine(lineText);
    const type = a.innerText.trim();
    const divideConfig = getDivideConfig(a);
    const url = a.href;

    if (launchTime) S.set(id, 'LaunchTime', launchTime);
    if (landingTime) S.set(id, 'LandingTime', landingTime);
    if (type && unit) S.set(id, 'Send', JSON.stringify({ type, unit }));
    S.set(id, 'Divide', JSON.stringify(divideConfig));
    S.set(id, 'URL', url);

    a.click();
  }

  // 서버 시각을 DOM에서 직접 읽음
  function getServerSec() {
    const el = document.getElementById('serverTime');
    if (!el) return null;
    return t2s((el.textContent || '').trim());
  }

  function autoClickLoop() {
    const serverSec = getServerSec();
    if (serverSec == null) return;

    const showTd = document.querySelector('.show_row td[colspan="2"]');
    if (!showTd) return;

    let best = { a: null, key: null, diff: 1e9 };

    showTd.querySelectorAll('a[href*="screen=place&target="]').forEach(a => {
      const id = getVillageIdFromLink(a);
      if (!id) return;

      const lineText = getLineText(a);
      const { launchTime } = parseTimesFromLine(lineText) || {};
      if (!launchTime) return;

      const url = a.href;
      const key = `${id}|${launchTime}|${url}`;
      if (CLICKED.has(key)) return;

      const launchSec = t2s(launchTime);
      if (launchSec == null) return;

      let diff = launchSec - serverSec;
      if (diff < -43200) diff += 86400; // 자정 보정

      if (diff > 0 && diff < best.diff) best = { a, key, diff };
    });

    if (!best.a) return;

    if (!THRESH.has(best.key)) THRESH.set(best.key, 9 + Math.random());

    if (best.diff <= THRESH.get(best.key)) {
      CLICKED.add(best.key);
      saveDataAndClick(best.a);
    }
  }

  function start() {
    const params = new URLSearchParams(location.search);
    if (params.get('screen') !== 'memo') return;

    patchMemoUI();
    const mo = new MutationObserver(() => patchMemoUI());
    mo.observe(document.body, { childList: true, subtree: true });

    // updateServerTime, autoCloseAndCleanup 호출 제거
    setInterval(autoClickLoop, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
