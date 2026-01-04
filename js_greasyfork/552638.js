// ==UserScript==
// @name         Torn Enemy HP% + Execute UI
// @namespace    
// @version      1.4.2
// @description  Enemy HP% with EXECUTE indicator; PDA-friendly; draggable/minimizable HUD
// @author       flc
// @match        https://www.torn.com/loader.php?sid=attack*
// @match        https://www.torn.com/loader.php?*sid=attack*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552638/Torn%20Enemy%20HP%25%20%2B%20Execute%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/552638/Torn%20Enemy%20HP%25%20%2B%20Execute%20UI.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const HUD_ID = 'executeHud';

  // Single-instance guard (prevents duplicate HUD / observers)
  if (window.__tornExecRunning) return;
  window.__tornExecRunning = true;

  const LS = {
    THRESH:  'torn_exec_threshold_percent_v5',
    YOURMAX: 'torn_exec_your_maxhp_v5',
    ENEMYMAX:'torn_exec_enemy_maxhp_v5',
    POS:     'torn_exec_hud_pos_v3',
    MIN:     'torn_exec_hud_minimized_v3'
  };

  const DEFAULTS = { THRESH: 20, YOURMAX: '', ENEMYMAX: '', POS: { top: 12, left: null }, MIN: false };

  const POLL_FALLBACK_MS = 500;   // backup poll
  const MIN_SCAN_INTERVAL = 200;  // throttle scans
  const FIXED_MIN_MAX = 300;      // ignore X/Y where Y < 300 (ammo, cooldowns, etc.)

  const getLS = (k, d) => { const v = localStorage.getItem(k); if (v === null) return d; try { return JSON.parse(v); } catch { return v; } };
  const setLS = (k, v) => localStorage.setItem(k, (typeof v === 'string' ? v : JSON.stringify(v)));
  const $ = (s, r = document) => r.querySelector(s);
  const visible = el => el && el.offsetParent !== null;
  const toInt = s => parseInt(String(s || '').replace(/,/g, '').trim(), 10);
  const pctStr = n => Number.isFinite(n) ? n.toFixed(1) + '%' : '—';
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  // ------------- execute% detect -------------
  function autoDetectExecutePercent() {
    const el = document.querySelector('[data-bonus-attachment-description*="below"][data-bonus-attachment-description*="life"]');
    if (!el) return null;
    const txt = el.getAttribute('data-bonus-attachment-description') || el.textContent || '';
    const m = txt.match(/below\s+(\d+)\s*%\s*life/i);
    return m ? parseInt(m[1], 10) : null;
  }

  // ------------- scan for X / Y life strings -------------
  function findHpCandidates() {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const t = node.nodeValue;
        if (!t || t.length > 64) return NodeFilter.FILTER_SKIP;
        if (!/\d[\d,]*\s*\/\s*\d[\d,]*/.test(t)) return NodeFilter.FILTER_SKIP;
        const el = node.parentElement;
        if (!el || !visible(el)) return NodeFilter.FILTER_SKIP;
        if (el.closest('#' + CSS.escape(HUD_ID))) return NodeFilter.FILTER_SKIP; // ignore our HUD
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let n;
    while ((n = walker.nextNode())) {
      const el = n.parentElement;
      const m = n.nodeValue.match(/(\d[\d,]*)\s*\/\s*(\d[\d,]*)/);
      if (!m) continue;
      const current = toInt(m[1]);
      const max = toInt(m[2]);
      if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 0) continue;
      if (max < FIXED_MIN_MAX) continue;

      const container = el.closest('[class],[id]') || el;
      out.push({ current, max, el, container, y: (container.getBoundingClientRect().top + window.scrollY) });
    }

    const map = new Map();
    for (const c of out) {
      const key = `${c.current}/${c.max}`;
      if (!map.has(key) || c.y < map.get(key).y) map.set(key, c);
    }
    return Array.from(map.values());
  }

  
  function ensureCSS() {
    if ($('#execHudStyles4o')) return;
    const style = document.createElement('style');
    style.id = 'execHudStyles4o';
    style.textContent = `
      #${HUD_ID}{position:fixed;z-index:999999;min-width:220px;background:rgba(0,0,0,.6);color:#fff;border-radius:12px;padding:10px 12px;
        font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.2;box-shadow:0 6px 18px rgba(0,0,0,.25);backdrop-filter:blur(2px);touch-action:none}
      #${HUD_ID} .row{display:flex;align-items:center;gap:8px}
      #${HUD_ID} input,#${HUD_ID} button{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:8px;padding:4px 6px;outline:none}
      #${HUD_ID} .badge{margin-left:auto;padding:2px 6px;border-radius:8px;font-size:12px;font-weight:700;background:#7a0000;opacity:.9}
      #${HUD_ID} .chip{display:inline-block;padding:3px 6px;border-radius:8px;border:1px solid rgba(255,255,255,.25);margin:2px;cursor:pointer;font-size:12px}
      #${HUD_ID} .hdr{display:flex;align-items:center;gap:8px;margin-bottom:8px;cursor:move}
      #${HUD_ID} .title{font-weight:700}
      #${HUD_ID} .minbtn{margin-left:auto;border-radius:8px;padding:2px 6px;font-weight:700;cursor:pointer}
      #${HUD_ID}.minimized{min-width:unset;padding:6px 8px}
      #${HUD_ID}.minimized .body{display:none}
      #${HUD_ID}.minimized .badge{margin-left:6px}
      @keyframes execPulse{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(0,255,160,.6)}70%{transform:scale(1.05);box-shadow:0 0 0 10px rgba(0,255,160,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(0,255,160,0)}}
    `;
    document.head.appendChild(style);
  }

  function buildHUD(pos, minimized) {
    // remove any stray duplicates

    document.querySelectorAll('#' + CSS.escape(HUD_ID)).forEach((el, i) => { if (i > 0) el.remove(); });

    ensureCSS();
    let hud = $('#' + HUD_ID);
    if (!hud) {
      hud = document.createElement('div');
      hud.id = HUD_ID;
      hud.innerHTML = `
        <div class="hdr" id="hud-drag">
          <div class="title">Enemy HP</div>
          <div id="hud-ready" class="badge">EXECUTE NOT READY</div>
          <button id="hud-min" class="minbtn" title="Minimize/Expand">▾</button>
        </div>
        <div class="body">
          <div id="hud-line" style="font-size:14px;margin-bottom:6px;">— / — (—%)</div>

          <div class="row" style="gap:6px;margin-bottom:6px;">
            <label style="font-size:12px;opacity:.9;">Execute%</label>
            <input id="hud-thresh" type="number" min="1" max="100" style="width:64px;">
            <button id="hud-apply">Set</button>
            <button id="hud-refresh" title="Rescan HP">↻</button>
          </div>

          <div class="row" style="gap:6px;margin-bottom:6px;">
            <label style="font-size:12px;opacity:.9;">Your max HP</label>
            <input id="hud-yourmax" type="number" min="1" style="width:96px;">
            <button id="hud-saveyou" title="Save">Save</button>
          </div>

          <div id="hud-picks" style="font-size:11px;opacity:.9;display:none;">
            Tap enemy HP if detection is wrong:
            <div id="hud-chipwrap"></div>
          </div>

          <div style="margin-top:4px;font-size:11px;opacity:.7;">enter execute% and HP manually +save , update as needed!</div>
        </div>
      `;
      document.body.appendChild(hud);
    }

    // position
    const setPos = p => {
      const vw = window.innerWidth, vh = window.innerHeight;
      let top = p.top, left = p.left;
      top = clamp(top ?? 12, 4, vh - 60);
      if (left == null) { hud.style.right = '12px'; hud.style.left = 'auto'; }
      else { hud.style.left = clamp(left, 4, vw - 120) + 'px'; hud.style.right = 'auto'; }
      hud.style.top = top + 'px';
    };
    setPos(pos);

    // minimize toggle
    function applyMin(min) {
      if (min) { hud.classList.add('minimized'); $('#hud-min', hud).textContent = '▴'; }
      else { hud.classList.remove('minimized'); $('#hud-min', hud).textContent = '▾'; }
      setLS(LS.MIN, min ? 'true' : 'false');
    }
    applyMin(minimized);
    $('#hud-min', hud).addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); applyMin(!hud.classList.contains('minimized')); });

    // drag (don’t start drag from minimize button)
    let dragging = false, startX=0, startY=0, startTop=0, startLeft=null, anchoredRight=(pos.left==null);
    const dragEl = $('#hud-drag', hud);
    const onStart = e => {
      if (e.target && (e.target.id === 'hud-min' || e.target.closest?.('#hud-min'))) return;
      dragging = true;
      const pt = (e.touches && e.touches[0]) || e;
      startX=pt.clientX; startY=pt.clientY;
      const rect = hud.getBoundingClientRect();
      startTop = rect.top;
      if (anchoredRight) { startLeft = rect.left; anchoredRight=false; hud.style.left = startLeft + 'px'; hud.style.right = 'auto'; } else startLeft = rect.left;
      e.preventDefault();
    };
    const onMove = e => {
      if (!dragging) return;
      const pt = (e.touches && e.touches[0]) || e;
      const dx = pt.clientX - startX, dy = pt.clientY - startY;
      const vw = window.innerWidth, vh = window.innerHeight;
      hud.style.top = clamp(startTop + dy, 4, vh - 60) + 'px';
      hud.style.left = clamp(startLeft + dx, 4, vw - 120) + 'px';
    };
    const onEnd = () => {
      if (!dragging) return; dragging=false;
      const rect = hud.getBoundingClientRect();
      setLS(LS.POS, { top: rect.top, left: rect.left });
    };
    dragEl.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    dragEl.addEventListener('touchstart', onStart, { passive:false });
    window.addEventListener('touchmove', onMove, { passive:false });
    window.addEventListener('touchend', onEnd);

    return hud;
  }


  function start() {
    const sid = new URLSearchParams(location.search).get('sid') || '';
    if (!sid.startsWith('attack')) return;

    const savedPos = getLS(LS.POS, DEFAULTS.POS);
    const savedMin = (getLS(LS.MIN, DEFAULTS.MIN) === 'true');
    const hud = buildHUD(savedPos, savedMin);

    const line = $('#hud-line', hud);
    const badge = $('#hud-ready', hud);
    const inputThresh = $('#hud-thresh', hud);
    const btnApply = $('#hud-apply', hud);
    const btnRefresh = $('#hud-refresh', hud);
    const inputYourMax = $('#hud-yourmax', hud);
    const btnSaveYou = $('#hud-saveyou', hud);
    const picks = $('#hud-picks', hud);
    const chipwrap = $('#hud-chipwrap', hud);

    let threshold = parseInt(getLS(LS.THRESH, DEFAULTS.THRESH), 10);
    let yourMax = getLS(LS.YOURMAX, DEFAULTS.YOURMAX);
    let enemyMaxLock = getLS(LS.ENEMYMAX, DEFAULTS.ENEMYMAX);

    // const auto = autoDetectExecutePercent();
   // if (Number.isFinite(auto)) threshold = auto;

    inputThresh.value = String(threshold);
    inputYourMax.value = String(yourMax);

    const setReady = on => {
      if (on) { badge.textContent = 'EXECUTE READY'; badge.style.background = '#0b6'; badge.style.animation='execPulse 1s infinite'; }
      else { badge.textContent = 'EXECUTE NOT READY'; badge.style.background = '#7a0000'; badge.style.animation='none'; }
    };

    btnApply.addEventListener('click', () => {
      const v = parseInt(inputThresh.value, 10);
      if (Number.isFinite(v) && v > 0 && v <= 100) { threshold = v; setLS(LS.THRESH, v); }
      else inputThresh.value = String(threshold);
      scheduleScan(true);
    });

    btnSaveYou.addEventListener('click', () => {
      const v = parseInt(inputYourMax.value, 10);
      if (Number.isFinite(v) && v > 0) {
        yourMax = v; setLS(LS.YOURMAX, v);
        if (String(enemyMaxLock) === String(yourMax)) { enemyMaxLock = ''; setLS(LS.ENEMYMAX, ''); }
        scheduleScan(true);
      }
    });

    btnRefresh.addEventListener('click', () => scheduleScan(true));

    function renderChips(cands) {
      chipwrap.innerHTML = '';
      const filtered = cands.filter(c => String(c.max) !== String(yourMax));
      if (filtered.length <= 1) { picks.style.display = 'none'; return; }
      picks.style.display = 'block';
      for (const c of filtered) {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = `${c.current.toLocaleString()}/${c.max.toLocaleString()}`;
        if (String(c.max) === String(enemyMaxLock)) chip.style.borderColor = '#0b6';
        chip.addEventListener('click', () => {
          enemyMaxLock = c.max; setLS(LS.ENEMYMAX, enemyMaxLock); scheduleScan(true);
        });
        chipwrap.appendChild(chip);
      }
    }

    function chooseEnemy(cands) {
      let candidates = cands.filter(c => String(c.max) !== String(yourMax));
      if (enemyMaxLock) {
        const locked = candidates.find(c => String(c.max) === String(enemyMaxLock));
        if (locked) return locked;
      }
      if (candidates.length) candidates = candidates.sort((a,b) => b.max - a.max);
      return candidates[0] || null;
    }

    function updateHUD(enemy) {
      if (!enemy) { line.textContent = '— / — (—%)'; setReady(false); return; }
      const pct = (enemy.current / enemy.max) * 100;
      line.textContent = `${enemy.current.toLocaleString()} / ${enemy.max.toLocaleString()} (${pctStr(pct)})`;
      setReady(pct <= threshold);
    }

    let mo, scanning = false, lastScanTs = 0, scheduled = null;

    function doScan(force = false) {
      if (scanning) return;
      const now = performance.now();
      if (!force && (now - lastScanTs) < MIN_SCAN_INTERVAL) {
        if (!scheduled) scheduled = setTimeout(() => { scheduled = null; doScan(true); }, MIN_SCAN_INTERVAL - (now - lastScanTs));
        return;
      }
      scanning = true;
      if (mo) mo.disconnect();

      const cands = findHpCandidates();
      renderChips(cands);
      const enemy = chooseEnemy(cands);
      updateHUD(enemy);

      lastScanTs = performance.now();
      scanning = false;
      if (mo) mo.observe(document.body, { subtree: true, childList: true, characterData: true });
    }
    const scheduleScan = (force=false) => doScan(force);

    function onMutations(records) {
      for (const rec of records) {
        const t = rec.target;
        if (t && t.closest && t.closest('#' + CSS.escape(HUD_ID))) continue; // ignore HUD changes
        scheduleScan(false);
        break;
      }
    }

    mo = new MutationObserver(onMutations);
    mo.observe(document.body, { subtree: true, childList: true, characterData: true });
    setInterval(() => scheduleScan(false), POLL_FALLBACK_MS);

    // initial
    scheduleScan(true);

    // keep position sane on rotate / resize
    window.addEventListener('resize', () => {
      const rect = $('#' + HUD_ID).getBoundingClientRect();
      const newTop = clamp(rect.top, 4, window.innerHeight - 60);
      const newLeft = rect.left;
      const el = $('#' + HUD_ID);
      el.style.top = newTop + 'px';
      if (el.style.right !== '12px') el.style.left = clamp(newLeft, 4, window.innerWidth - 120) + 'px';
      setLS(LS.POS, { top: newTop, left: (el.style.right === '12px' ? null : parseInt(el.style.left, 10)) });
    });
  }

  // SPA-ready
  const ready = () => {
    const sid = new URLSearchParams(location.search).get('sid') || '';
    if (sid.startsWith('attack')) start(); else setTimeout(ready, 400);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();

})();