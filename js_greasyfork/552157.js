// ==UserScript==
// @name         Volvo's NBS 1.0
// @namespace    none
// @version      1.1
// @description  Combined New Bot Snipe and Stage 2 - Auto click memo links and handle place screen with date-aware diff
// @match        https://*.tribalwars.net/game.php?*
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const screen = params.get('screen');

  /* =========================
     MEMO 화면
     ========================= */
  if (screen === 'memo') {
    const K = (id, sfx) => `Volvo[${id}]${sfx}`;
    const S = {
      get: (id, s) => localStorage.getItem(K(id, s)),
      set: (id, s, v) => localStorage.setItem(K(id, s), v),
      remove: (id, s) => localStorage.removeItem(K(id, s))
    };

    const t2s = str => {
      const m = String(str || '').trim().match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
      return m ? (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) : 0;
    };

    const dt2s = str => {
      const m = String(str || '').trim().match(/^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})$/);
      if (!m) return 0;
      const date = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
      return Math.floor(date.getTime() / 1000);
    };

    const CLICKED = new Set();
    const THRESH = new Map();

    // UI 스타일
    (function injectStyle() {
      if (document.getElementById('nbs-ui-style')) return;
      const style = document.createElement('style');
      style.id = 'nbs-ui-style';
      style.textContent = `
        .nbs-divide-wrap{display:inline-flex;gap:8px;align-items:center;justify-content:center;margin-left:8px}
        .nbs-inputs{display:inline-flex;flex-wrap:wrap;gap:4px;max-width:180px;justify-content:center}
        .nbs-input{width:32px;text-align:center;padding:2px 4px;font-size:12px;border:1px solid #c7c7c7;border-radius:3px}
        .nbs-input::-webkit-outer-spin-button,
        .nbs-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
        .nbs-input[type=number]{-moz-appearance:textfield}
        #nbsTabAutoCloseBtn{margin-left:8px}
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
        const commit = () => { vals[idx] = String(input.value || '0'); wrapEl.dataset.nbsValues = JSON.stringify(vals); };
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

    function addTabAutoCloseButton() {
      if (document.getElementById('nbsTabAutoCloseBtn')) return;
      const btn = document.createElement('a');
      btn.href = 'javascript:void(0)';
      btn.id = 'nbsTabAutoCloseBtn';
      btn.className = 'btn';
      btn.textContent = 'Tab Auto Close';
      let state = localStorage.getItem('VolvoTabAutoClose');
      if (state === null) { state = 'Off'; localStorage.setItem('VolvoTabAutoClose', state); }
      if (state === 'On') btn.classList.add('nbs-btn-active');
      btn.addEventListener('click', () => {
        const cur = localStorage.getItem('VolvoTabAutoClose') || 'Off';
        const ns = cur === 'On' ? 'Off' : 'On';
        localStorage.setItem('VolvoTabAutoClose', ns);
        btn.classList.toggle('nbs-btn-active', ns === 'On');
      });
      const rename = document.querySelector('a.rename_link');
      if (rename) rename.insertAdjacentElement('afterend', btn);
      else (document.getElementById('content_value') || document.body).appendChild(btn);
    }

    function addMassControl() {
      if (document.getElementById('nbsMassControl')) return;
      const massWrap = document.createElement('span');
      massWrap.id = 'nbsMassControl';
      massWrap.className = 'nbs-divide-wrap';
      massWrap.style.marginLeft = '8px';
      const btn = document.createElement('a');
      btn.href = 'javascript:void(0)';
      btn.className = 'btn nbs-divide';
      btn.textContent = 'Divide: 1';
      btn.title = 'Mass: 1→2→3→4→Custom→1';
      const inputs = document.createElement('span');
      inputs.className = 'nbs-inputs';
      massWrap.dataset.nbsMode = 'percent';
      massWrap.dataset.nbsDivideN = '1';
      buildPercentInputs(massWrap, inputs, 1, true);
      btn.addEventListener('click', () => {
        const mode = massWrap.dataset.nbsMode;
        let n = parseInt(massWrap.dataset.nbsDivideN || '1', 10);
        if (mode === 'percent') {
          if (n < 4) {
            n++;
            massWrap.dataset.nbsDivideN = String(n);
            btn.textContent = `Divide: ${n}`;
            buildPercentInputs(massWrap, inputs, n, true);
          } else {
            massWrap.dataset.nbsMode = 'custom';
            btn.textContent = 'Custom';
            buildCustomInputs(massWrap, inputs, true);
          }
        } else {
          massWrap.dataset.nbsMode = 'percent';
          massWrap.dataset.nbsDivideN = '1';
          btn.textContent = 'Divide: 1';
          buildPercentInputs(massWrap, inputs, 1, true);
        }
        applyMassControl(massWrap);
      });
      massWrap.addEventListener('input', () => applyMassControl(massWrap));
      massWrap.addEventListener('blur', () => applyMassControl(massWrap), true);
      massWrap.appendChild(btn);
      massWrap.appendChild(inputs);

      const autoCloseBtn = document.getElementById('nbsTabAutoCloseBtn');
      if (autoCloseBtn) autoCloseBtn.insertAdjacentElement('afterend', massWrap);
      else (document.getElementById('content_value') || document.body).appendChild(massWrap);
    }

    function applyMassControl(massWrap) {
      const showTd = document.querySelector('.show_row td[colspan="2"]');
      if (!showTd) return;
      const attacks = showTd.querySelectorAll('a[href*="screen=place&target="]');
      const massMode = massWrap.dataset.nbsMode;
      const massN = massWrap.dataset.nbsDivideN;
      const massVals = JSON.parse(massWrap.dataset.nbsValues || '[]');
      attacks.forEach(a => {
        const divideWrap = a.nextElementSibling;
        if (divideWrap && divideWrap.classList.contains('nbs-divide-wrap')) {
          divideWrap.dataset.nbsMode = massMode;
          divideWrap.dataset.nbsDivideN = massN;
          const btn = divideWrap.querySelector('.nbs-divide');
          if (btn) btn.textContent = massMode === 'custom' ? 'Custom' : `Divide: ${massN}`;
          const inputs = divideWrap.querySelector('.nbs-inputs');
          if (inputs) {
            if (massMode === 'custom') buildCustomInputs(divideWrap, inputs, false);
            else buildPercentInputs(divideWrap, inputs, parseInt(massN, 10), false);
          }
          divideWrap.dataset.nbsValues = JSON.stringify(massVals);
        }
      });
    }

    function patchMemoUI() {
      const showTd = document.querySelector('.show_row td[colspan="2"]');
      if (!showTd) return;
      const attacks = showTd.querySelectorAll('a[href*="screen=place&target="]');
      attacks.forEach(a => addDivideCustomToLink(a));
      addTabAutoCloseButton();
      addMassControl();
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

    function getCurrentServerTime() {
      const serverTimeRaw = localStorage.getItem('VolvoServerTime');
      if (!serverTimeRaw) return null;

      const fullMatch = serverTimeRaw.match(/(\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2})/);
      if (fullMatch) return fullMatch[1];

      const timeMatch = serverTimeRaw.match(/^(\d{1,2}:\d{2}:\d{2})$/);
      if (timeMatch) {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${timeMatch[1]}`;
      }
      return null;
    }

    function readServerTime() {
      const el = document.getElementById('serverTime');
      if (!el) {
        const dateEl = document.getElementById('serverDate');
        if (dateEl) {
          const text = (dateEl.textContent || '').trim();
          const match = text.match(/(\d{1,2}:\d{2}:\d{2})/);
          if (match) return match[1];
        }
        return null;
      }
      const text = (el.textContent || el.innerText || '').trim();
      const match = text.match(/(\d{1,2}:\d{2}:\d{2})/);
      return match ? match[1] : null;
    }

    function updateServerTime() {
      const serverTime = readServerTime();
      if (serverTime && /^\d{1,2}:\d{2}:\d{2}$/.test(serverTime)) {
        const dateEl = document.getElementById('serverDate');
        if (dateEl) {
          const dateText = (dateEl.textContent || '').trim();
          const dateMatch = dateText.match(/(\d{2})\/(\d{2})\/(\d{4})/);
          if (dateMatch) {
            const [, mm, dd, yyyy] = dateMatch;
            const formattedDateTime = `${yyyy}-${mm}-${dd} ${serverTime}`;
            localStorage.setItem('VolvoServerTime', formattedDateTime);
            return;
          }
        }
        localStorage.setItem('VolvoServerTime', serverTime);
      }
    }

    function autoOpen() {
      const serverDateTime = getCurrentServerTime();
      if (!serverDateTime) return;

      const serverSec = dt2s(serverDateTime);
      const showTd = document.querySelector('.show_row td[colspan="2"]');
      if (!showTd) return;

      const candidates = [];
      const lines = showTd.innerHTML.split(/<br\s*\/?>/i);
      const unitKeywords = ['spear', 'sword', 'axe', 'spy', 'light', 'heavy', 'ram', 'catapult', 'snob'];

      lines.forEach(line => {
        const match = line.match(/(\d{4}-\d{2}-\d{2})\s*<b>(\d{1,2}:\d{2}:\d{2}\.\d{3})<\/b>\s*\|\s*(\d{4}-\d{2}-\d{2}\s+\d{1,2}:\d{2}:\d{2}\.\d{3})\s*\|[\s\S]*?(<a[^>]*href="([^"]+screen=place[^"]+)"[^>]*>(Attack|Support)<\/a>)/);
        if (!match) return;

        const launchDate = match[1];
        const launchTime = match[2];
        const landingTimeStr = match[3];
        const attackLinkHTML = match[4];
        const attackLink = match[5];
        const sendType = match[6];

        let unit = null;
        for (const keyword of unitKeywords) {
          if (line.toLowerCase().includes(keyword)) { unit = keyword; break; }
        }
        if (!unit) return;

        const launchDateTime = `${launchDate} ${launchTime.split('.')[0]}`;
        const launchSec = dt2s(launchDateTime);
        const diff = launchSec - serverSec;

        if (diff > 0) {
          const key = `${launchDate}|${launchTime}|${attackLink}`;
          if (!CLICKED.has(key)) {
            const landingMatch = landingTimeStr.match(/(\d{1,2}):(\d{2}):(\d{2})\.(\d{3})/);
            const landingTime = landingMatch ? `${landingMatch[1]}:${landingMatch[2]}:${landingMatch[3]}:${landingMatch[4]}` : null;
            candidates.push({
              diff, key, unit,
              launchDateTime, launchTime: launchTime.split('.')[0],
              landingTime, attackLink, attackLinkHTML, sendType
            });
          }
        }
      });

      if (candidates.length === 0) return;
      candidates.sort((a, b) => a.diff - b.diff);

      candidates.forEach(candidate => {
        if (CLICKED.has(candidate.key)) return;
        if (!THRESH.has(candidate.key)) THRESH.set(candidate.key, 9 + Math.random());
        if (candidate.diff <= THRESH.get(candidate.key)) {
          CLICKED.add(candidate.key);
          const villageMatch = candidate.attackLink.match(/village=(\d+)/);
          if (villageMatch) {
            const id = villageMatch[1];
            S.set(id, 'LaunchTime', candidate.launchTime);
            if (candidate.landingTime) S.set(id, 'LandingTime', candidate.landingTime);
            S.set(id, 'Send', JSON.stringify({ type: candidate.sendType, unit: candidate.unit }));
            S.set(id, 'URL', candidate.attackLink);

            const temp = document.createElement("div");
            temp.innerHTML = candidate.attackLinkHTML;
            const attackAnchor = temp.querySelector("a");
            if (attackAnchor) {
              const realLink = showTd.querySelector(`a[href*="village=${id}"][href*="target="]`);
              if (realLink) {
                const divideConfig = getDivideConfig(realLink);
                S.set(id, 'Divide', JSON.stringify(divideConfig));
              }
              attackAnchor.click();
            } else {
              window.location.href = candidate.attackLink;
            }
          }
        }
      });
    }

    // 초기화
    function patchMemoUIOnce() { patchMemoUI(); }
    patchMemoUIOnce();
    const mo = new MutationObserver(() => patchMemoUI());
    mo.observe(document.body, { childList: true, subtree: true });

    setInterval(updateServerTime, 500);
    setInterval(autoOpen, 500);
  }

  /* =========================
     PLACE 화면
     ========================= */
  if (screen === 'place') {
    const K = (id, sfx) => `Volvo[${id}]${sfx}`;
    const randDelay  = () => 200 + Math.floor(Math.random() * 201);
    const shortDelay = () => 20  + Math.floor(Math.random() * 21);

    const UNIT_MAP = {
      spear:    ['spear', 'spy', 'heavy'],
      sword:    ['spear', 'sword', 'spy', 'heavy'],
      axe:      ['axe', 'spy', 'light'],
      light:    ['light'],
      heavy:    ['heavy'],
      ram:      ['spear', 'sword', 'axe', 'spy', 'light', 'heavy', 'ram', 'catapult'],
      catapult: ['spear', 'sword', 'axe', 'spy', 'light', 'heavy', 'ram', 'catapult'],
      snob:     ['snob', 'spear', 'sword', 'axe', 'spy', 'light', 'heavy', 'ram', 'catapult'],
    };

    function getAllUnitInputs() {
      return {
        spear:    document.getElementById('unit_input_spear'),
        sword:    document.getElementById('unit_input_sword'),
        axe:      document.getElementById('unit_input_axe'),
        spy:      document.getElementById('unit_input_spy'),
        light:    document.getElementById('unit_input_light'),
        heavy:    document.getElementById('unit_input_heavy'),
        ram:      document.getElementById('unit_input_ram'),
        catapult: document.getElementById('unit_input_catapult'),
        snob:     document.getElementById('unit_input_snob'),
      };
    }

    function readAllCounts(unitInputs) {
      const counts = {};
      for (const [unit, input] of Object.entries(unitInputs)) {
        if (!input) continue;
        const allCount = input.getAttribute('data-all-count');
        counts[unit] = parseInt(allCount || '0', 10) || 0;
      }
      return counts;
    }

    function setAmount(input, value) {
      if (!input) return;
      input.value = value > 0 ? String(value) : '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function applyDivideMode(unitType, percent, unitCounts, unitInputs) {
      const group = UNIT_MAP[unitType] || (unitInputs[unitType] ? [unitType] : []);
      if (!group.length) return;
      const p = Math.max(0, Math.min(100, percent));
      for (const u of group) {
        if (unitType === 'snob' && u === 'snob') setAmount(unitInputs[u], 1);
        else setAmount(unitInputs[u], Math.floor((unitCounts[u] || 0) * p / 100));
      }
    }

    function applyMultiAttackMode(unitType, attackCount, percent, unitCounts, unitInputs) {
      const group = UNIT_MAP[unitType] || (unitInputs[unitType] ? [unitType] : []);
      if (!group.length) return;
      const hasRam = (unitCounts.ram || 0) > 0;
      const hasCat = (unitCounts.catapult || 0) > 0;
      const reserve = attackCount - 1;
      const p = Math.max(0, Math.min(100, percent));

      for (const t of group) {
        const n = unitCounts[t] || 0;
        const inp = unitInputs[t];
        if (!inp) continue;
        let cnt = 0;

        if (t === 'ram' || t === 'catapult') {
          if (unitType === 'snob') {
            if (t === 'ram') cnt = hasRam ? Math.max(n - reserve, 0) : 0;
            else if (t === 'catapult') cnt = (!hasRam && hasCat) ? Math.max(n - reserve, 0) : 0;
          } else if (unitType === 'ram') {
            if (t === 'ram' && hasRam) cnt = Math.max(n - reserve, 0);
            else if (t === 'catapult' && hasRam) cnt = n;
            else if (t === 'catapult' && !hasRam) cnt = Math.max(n - reserve, 0);
          } else if (unitType === 'catapult') {
            if (t === 'catapult') cnt = Math.max(n - reserve, 0);
            else if (t === 'ram') cnt = n;
          }
        } else if (t === 'snob') {
          cnt = unitType === 'snob' ? 1 : 0;
        } else {
          cnt = Math.floor(n * p / 100);
        }
        setAmount(inp, cnt);
      }
    }

    function applyCustomMode(unitType, customTotal, unitCounts, unitInputs) {
      const cap = Math.max(0, customTotal | 0);
      const group = (UNIT_MAP[unitType] || (unitInputs[unitType] ? [unitType] : []))
        .map(u => ({ unit: u, input: unitInputs[u], available: unitCounts[u] || 0 }))
        .filter(e => e.input);
      const total = group.reduce((s, e) => s + e.available, 0);
      if (total <= 0) { group.forEach(e => setAmount(e.input, 0)); return; }
      if (cap >= total) { group.forEach(e => setAmount(e.input, e.available)); return; }

      const scale = cap / total;
      let floorSum = 0;
      const dist = group.map(e => {
        const exact = e.available * scale;
        const base = Math.floor(exact);
        floorSum += base;
        return { ...e, base, fraction: exact - base };
      });
      let rem = cap - floorSum;
      dist.sort((a, b) => b.fraction - a.fraction);
      for (let i = 0; i < dist.length && rem > 0; i++) {
        if (dist[i].base < dist[i].available) { dist[i].base++; rem--; }
      }
      for (const d of dist) setAmount(d.input, d.base);
    }

    function setTrainValue(rowIdx, unitKey, val) {
      const inp = document.querySelector(`input[type="number"][name="train[${rowIdx}][${unitKey}]"]`);
      if (!inp) return;
      inp.value = val > 0 ? String(val) : '';
      inp.setAttribute('value', inp.value);
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function getTrainRows() {
      const rows = new Set();
      document.querySelectorAll('input[type="number"][name^="train["]').forEach(el => {
        const m = el.name.match(/^train\[(\d+)\]\[/);
        if (m) rows.add(parseInt(m[1], 10));
      });
      return Array.from(rows).sort((a, b) => a - b);
    }

    function handleTimedClick(submitBtn, villageId) {
      const landingTime = localStorage.getItem(K(villageId, 'LandingTime'));
      if (!landingTime || landingTime.trim() === '') { submitBtn.click(); return; }

      const parts = landingTime.split(':');
      if (parts.length < 3) { submitBtn.click(); return; }

      const [hh, mm, ss, ms] = parts;
      const targetHms = `${hh}:${mm}:${ss}`;
      const targetMs  = parseInt(ms || '0', 10);
      const relativeTimeEl = document.querySelector('.relative_time');
      if (!relativeTimeEl) { submitBtn.click(); return; }

      const readTime = () => {
        const text = relativeTimeEl.textContent || relativeTimeEl.innerText || '';
        const match = text.match(/\d{2}:\d{2}:\d{2}/);
        return match ? match[0] : null;
      };

      const parseHMS = (hms) => {
        if (!hms) return null;
        const [h, m, s] = hms.split(':').map(Number);
        return h * 3600 + m * 60 + s;
      };

      const currentTime = readTime();
      const currentSec  = parseHMS(currentTime);
      const targetSec   = parseHMS(targetHms);
      if (currentSec !== null && targetSec !== null && currentSec > targetSec) {
        submitBtn.click();
        return;
      }

      const interval = setInterval(() => {
        if (readTime() === targetHms) {
          setTimeout(() => submitBtn.click(), targetMs);
          clearInterval(interval);
        }
      }, 5);
    }

    async function handleConfirmScreen() {
      const qs = new URLSearchParams(location.search);
      const villageId = qs.get('village');
      if (!villageId) return;

      const sendRaw = localStorage.getItem(K(villageId, 'Send'));
      const divideRaw = localStorage.getItem(K(villageId, 'Divide')) || localStorage.getItem(K(villageId, 'Divde'));
      const unitCountRaw = localStorage.getItem(K(villageId, 'UnitCount'));
      if (!sendRaw || !divideRaw || !unitCountRaw) return;

      const sendConfig  = JSON.parse(sendRaw);
      const divideConfig = JSON.parse(divideRaw);
      const unitCounts  = JSON.parse(unitCountRaw);
      const unitType    = sendConfig.unit;
      const attackCount = parseInt(String(divideConfig.count || '1'), 10);

      if (attackCount <= 1) {
        await new Promise(r => setTimeout(r, randDelay()));
        const submitBtn = document.querySelector('.troop_confirm_go, #troop_confirm_submit');
        if (!submitBtn) return;
        const flagKey = K(villageId, 'ConfirmClicked');
        if (sessionStorage.getItem(flagKey) === '1') return;
        sessionStorage.setItem(flagKey, '1');
        // cleanupStorage 제거. 타이밍 클릭 전에 값 유지
        handleTimedClick(submitBtn, villageId);
        return;
      }

      const trainBtn = document.getElementById('troop_confirm_train');
      if (!trainBtn) return;

      const toAdd = attackCount - 1;
      for (let i = 0; i < toAdd; i++) {
        if (i === 0) await new Promise(r => setTimeout(r, shortDelay()));
        trainBtn.click();
        await new Promise(r => setTimeout(r, shortDelay()));
      }

      await new Promise(r => setTimeout(r, shortDelay()));

      const rows = getTrainRows();
      if (rows.length === 0) return;

      const allUnits = ['spear','sword','axe','spy','light','heavy','ram','catapult','snob'];
      rows.forEach(rowIdx => { allUnits.forEach(unit => setTrainValue(rowIdx, unit, 0)); });

      await new Promise(r => setTimeout(r, shortDelay()));

      const group = UNIT_MAP[unitType] || [unitType];
      rows.forEach(rowIdx => {
        const percent = parseInt(String(divideConfig[`#${rowIdx}`] || '0'), 10);
        group.forEach(unit => {
          let amount = 0;
          if ((unitType === 'snob' && unit === 'snob') ||
              (unitType === 'ram' && unit === 'ram') ||
              (unitType === 'catapult' && unit === 'catapult')) {
            amount = 1;
          } else if (unit !== 'ram' && unit !== 'catapult' && unit !== 'snob') {
            amount = Math.floor((unitCounts[unit] || 0) * percent / 100);
          }
          setTrainValue(rowIdx, unit, amount);
        });
      });

      await new Promise(r => setTimeout(r, randDelay()));

      const submitBtn = document.querySelector('.troop_confirm_go, #troop_confirm_submit');
      if (!submitBtn) return;
      const flagKey = K(villageId, 'ConfirmClicked');
      if (sessionStorage.getItem(flagKey) === '1') return;
      sessionStorage.setItem(flagKey, '1');
      // cleanupStorage 제거
      handleTimedClick(submitBtn, villageId);
    }

    function handlePlaceScreen() {
      const qs = new URLSearchParams(location.search);
      const villageId = qs.get('village');
      if (!villageId) return;

      const hasSend   = !!localStorage.getItem(K(villageId, 'Send'));
      const hasDivide = !!localStorage.getItem(K(villageId, 'Divide')) || !!localStorage.getItem(K(villageId, 'Divde'));
      const hasCustom = !!localStorage.getItem(K(villageId, 'Custom'));
      if (!hasSend && !hasDivide && !hasCustom) return;

      const isReady = () => {
        const any = document.querySelector(
          '#unit_input_spear, #unit_input_sword, #unit_input_axe,' +
          ' #unit_input_spy, #unit_input_light, #unit_input_heavy,' +
          ' #unit_input_ram, #unit_input_catapult, #unit_input_snob'
        );
        return !!(any && any.getAttribute('data-all-count') !== null);
      };

      function parseSend() {
        let sendType = null, unitType = null;
        const raw = localStorage.getItem(K(villageId, 'Send'));
        if (raw) {
          try {
            const j = JSON.parse(raw);
            if (j && typeof j === 'object') {
              if (j.type === 'Attack' || j.type === 'Support') sendType = j.type;
              if (typeof j.unit === 'string' && j.unit) unitType = j.unit;
            }
          } catch {}
        }
        if (!unitType) {
          const order = ['snob','catapult','ram','axe','light','heavy','spear','sword'];
          for (const u of order) {
            const v = qs.get(u);
            if (v && parseInt(v, 10) > 0) { unitType = u; break; }
          }
        }
        return { sendType, unitType };
      }

      function parseDivide() {
        let raw = localStorage.getItem(K(villageId, 'Divide'));
        if (!raw) raw = localStorage.getItem(K(villageId, 'Divde'));
        if (raw) {
          try {
            const j = JSON.parse(raw);
            if (j && typeof j === 'object') return j;
          } catch {}
        }
        return null;
      }

      const fillTroops = () => {
        const unitInputs = getAllUnitInputs();
        const unitCounts = readAllCounts(unitInputs);
        localStorage.setItem(K(villageId, 'UnitCount'), JSON.stringify(unitCounts));

        const { sendType, unitType } = parseSend();
        if (!unitType) return;

        const divideConfig = parseDivide();

        if (divideConfig && divideConfig.mode === 'custom' && divideConfig['#1']) {
          const customTotal = parseInt(String(divideConfig['#1']), 10);
          if (!isNaN(customTotal) && customTotal > 0) {
            applyCustomMode(unitType, customTotal, unitCounts, unitInputs);
            return sendType;
          }
        }

        const customRaw = localStorage.getItem(K(villageId, 'Custom'));
        if (customRaw && customRaw.trim() !== '') {
          const customTotal = parseInt(customRaw, 10);
          if (!isNaN(customTotal) && customTotal > 0) {
            applyCustomMode(unitType, customTotal, unitCounts, unitInputs);
            return sendType;
          }
        }

        if (divideConfig && parseInt(String(divideConfig.count || '1'), 10) > 1 &&
            (unitType === 'ram' || unitType === 'catapult' || unitType === 'snob')) {
          const percent = parseInt(String(divideConfig['#1'] || '100'), 10);
          applyMultiAttackMode(unitType, parseInt(String(divideConfig.count), 10), percent, unitCounts, unitInputs);
          return sendType;
        }

        if (divideConfig && divideConfig.mode === 'percent' && divideConfig['#1']) {
          const percent = parseInt(String(divideConfig['#1']), 10);
          if (!isNaN(percent)) {
            applyDivideMode(unitType, percent, unitCounts, unitInputs);
            return sendType;
          }
        }

        const legacyPercent = parseInt(localStorage.getItem(K(villageId, 'Divide#1')) || '100', 10);
        applyDivideMode(unitType, legacyPercent, unitCounts, unitInputs);
        return sendType;
      };

      const clickButton = (sendType) => {
        const flagKey = K(villageId, 'PlaceClicked');
        if (sessionStorage.getItem(flagKey) === '1') return;
        const btn = sendType === 'Attack' ? document.getElementById('target_attack')
                  : sendType === 'Support' ? document.getElementById('target_support') : null;
        if (!btn) return;
        sessionStorage.setItem(flagKey, '1');
        setTimeout(() => {
          const form = btn.closest('form');
          if (form && form.requestSubmit) form.requestSubmit(btn);
          else btn.click();
        }, randDelay());
      };

      const execute = () => {
        setTimeout(() => {
          const sendType = fillTroops();
          setTimeout(() => clickButton(sendType), randDelay());
        }, shortDelay());
      };

      let executed = false;
      const tryExecute = () => {
        if (executed) return;
        if (isReady()) {
          executed = true;
          observer.disconnect();
          clearInterval(poll);
          clearTimeout(hard);
          execute();
        }
      };

      const observer = new MutationObserver(tryExecute);
      observer.observe(document.body, { childList: true, subtree: true });
      const poll = setInterval(tryExecute, 20);
      const hard = setTimeout(() => {
        if (!executed) {
          executed = true;
          observer.disconnect();
          clearInterval(poll);
          execute();
        }
      }, 1200);
    }

    const qs = new URLSearchParams(location.search);
    if (location.pathname.includes('/game.php') && qs.get('screen') === 'place') {
      if (qs.get('try') === 'confirm') {
        const checkReady = () => !!document.getElementById('troop_confirm_train');
        let executed = false;
        const tryExecute = () => {
          if (executed) return;
          if (checkReady()) {
            executed = true;
            observer.disconnect();
            clearInterval(poll);
            clearTimeout(hard);
            handleConfirmScreen();
          }
        };
        const observer = new MutationObserver(tryExecute);
        observer.observe(document.body, { childList: true, subtree: true });
        const poll = setInterval(tryExecute, 20);
        const hard = setTimeout(() => {
          if (!executed) {
            executed = true;
            observer.disconnect();
            clearInterval(poll);
            handleConfirmScreen();
          }
        }, 1500);
      } else if (qs.get('target')) {
        handlePlaceScreen();
      } else {
        // Auto close for stray place tabs
        const autoClose = localStorage.getItem('VolvoTabAutoClose');
        if (autoClose === 'On') {
          const randomDelay = Math.floor(Math.random() * 1000) + 2000;
          setTimeout(() => { try { window.close(); } catch {} }, randomDelay);
        }
      }
    }
  }

  // SPA 내비게이션 대응
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      const qs = new URLSearchParams(location.search);
      if (location.pathname.includes('/game.php') &&
          qs.get('screen') === 'place' &&
          qs.get('try') === 'confirm') {
        setTimeout(() => {
          if (document.getElementById('troop_confirm_train')) {
            // 최신 handleConfirmScreen 호출
            (function() {
              const params2 = new URLSearchParams(location.search);
              if (params2.get('screen') === 'place' && params2.get('try') === 'confirm') {
                // place 블록 안의 함수 접근
                // 전역 스코프에서 재호출
              }
            })();
          }
        }, 500);
      }
    }
  }).observe(document, { subtree: true, childList: true });

})();
