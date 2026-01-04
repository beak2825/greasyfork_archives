// ==UserScript==
// @name         flipper - a/b vote getter
// @namespace    local.scripts
// @version      1.5.4 // Nova versão de correção
// @description  makes getting a/b tests with gemini 3.0 more convenient. press run, wait N sec, stop; wait M sec; repeat until a/b vote appears. ui controls, safe auto-delete, and system notification on a/b. for bug reports and support dm @fixbymeasure on x
// @match        https://aistudio.google.com/*
// @run-at       document-idle
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553812/flipper%20-%20ab%20vote%20getter.user.js
// @updateURL https://update.greasyfork.org/scripts/553812/flipper%20-%20ab%20vote%20getter.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // --- persistence ---
  const LS_KEY_CFG = 'flipper.config.v3';
  const defaults = { runSec: 1, gapSec: 2.0, autoDelete: true, notifyAB: true };
  let cfg = loadCfg();

  function loadCfg() {
    try {
      const raw = localStorage.getItem(LS_KEY_CFG);
      if (!raw) return { ...defaults };
      const d = JSON.parse(raw);
      return {
        runSec: Number.isFinite(+d.runSec) ? +d.runSec : defaults.runSec,
        gapSec: Number.isFinite(+d.gapSec) ? +d.gapSec : defaults.gapSec,
        autoDelete: typeof d.autoDelete === 'boolean' ? d.autoDelete : defaults.autoDelete,
        notifyAB: typeof d.notifyAB === 'boolean' ? d.notifyAB : defaults.notifyAB,
      };
    } catch { return { ...defaults }; }
  }
  function saveCfg() { try { localStorage.setItem(LS_KEY_CFG, JSON.stringify(cfg)); } catch {} }

  // --- state ---
  let running = false;
  let loopActive = false;
  let cycles = 0;
  let abNotified = false;

  // --- helpers ---
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const byId = (id) => document.getElementById(id);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const getRunMs = () => Math.max(0, Math.round(cfg.runSec * 1000));
  const getGapMs = () => Math.max(0, Math.round(cfg.gapSec * 1000));

  const RUN_BTN_SELECTOR = 'ms-run-button button.run-button';
  const MODEL_TURN_SELECTOR = 'ms-chat-session ms-chat-turn .model-prompt-container[data-turn-role="Model"]';

  function getCandidateButtons() {
    return Array.from(document.querySelectorAll(RUN_BTN_SELECTOR));
  }
  function isVisible(el) {
    if (!el) return false;
    const hiddenAncestor = el.closest('[hidden],[aria-hidden="true"]');
    return hiddenAncestor ? false : !!(el.offsetParent || el.getClientRects().length);
  }
  function isEnabled(btn) {
    if (!btn) return false;
    if (btn.disabled) return false;
    if (btn.getAttribute('aria-disabled') === 'true') return false;
    return !btn.classList.contains('disabled');
  }
  function getRunButton() {
    const btns = getCandidateButtons().filter(isVisible);
    return btns.length ? btns[btns.length - 1] : null;
  }
  function abVoteVisible() { return !!document.querySelector('ms-inline-preference-vote-middleware'); }

  async function waitFor(predicate, timeoutMs = 10_000, pollMs = 100) {
    const end = Date.now() + timeoutMs;
    while (Date.now() < end) {
      if (predicate()) return true;
      await sleep(pollMs);
    }
    return predicate();
  }

  // --- notifications ---
  function canNotify() { return 'Notification' in window && Notification.permission === 'granted'; }
  async function ensureNotifyPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const res = await Notification.requestPermission().catch(() => 'denied');
    return res === 'granted';
  }
  async function notifyABVote() {
    if (!cfg.notifyAB) return;
    if (!canNotify()) {
      // try once to get permission on-demand
      const ok = await ensureNotifyPermission();
      if (!ok) return;
    }
    try {
      const n = new Notification('a/b vote detected', {
        body: 'flipper stopped — an a/b vote is present.',
        tag: 'flipper-abvote',
        renotify: true,
      });
      // auto-close after a few seconds so it doesn’t linger forever
      setTimeout(() => n.close?.(), 6000);
    } catch {}
  }

  // --- model-turn helpers (ui-first deletion) ---
  function getModelTurns() {
    return Array.from(document.querySelectorAll(MODEL_TURN_SELECTOR))
      .map((el) => el.closest('ms-chat-turn'))
      .filter(Boolean);
  }
  function countModelTurns() { return getModelTurns().length; }

  function findInlineDeleteButton(turn) {
    const btns = Array.from(turn.querySelectorAll('button, [role="button"]'));
    return btns.find(b => {
      const t = (b.textContent || '').toLowerCase();
      const ar = (b.getAttribute('aria-label') || '').toLowerCase();
      const nm = (b.getAttribute('name') || '').toLowerCase();
      return /delete|remove|discard|trash/.test(t + ' ' + ar + ' ' + nm);
    }) || null;
  }

  async function openTurnMenu(turn) {
    const trigger = turn.querySelector('ms-chat-turn-options .mat-mdc-menu-trigger');
    if (!trigger) return false;
    trigger.click();
    const ok = await waitFor(() =>
      document.querySelector('.cdk-overlay-container .mat-mdc-menu-panel, .mat-mdc-menu-panel'), 1500, 50
    );
    return !!ok;
  }

  function findMenuItem(regex) {
    const items = Array.from(document.querySelectorAll(
      '.cdk-overlay-container .mat-mdc-menu-item, .mat-mdc-menu-item'
    ));
    return items.find(i => regex.test((i.textContent || '').trim().toLowerCase())) || null;
  }

  async function uiDeleteTurn(turn) {
    const inline = findInlineDeleteButton(turn);
    if (inline) {
      inline.click();
    } else {
      const opened = await openTurnMenu(turn);
      if (!opened) return false;
      await sleep(50);
      const item = findMenuItem(/delete|remove|discard|trash/);
      if (!item) return false;
      item.click();
    }
    const removed = await waitFor(() => !document.documentElement.contains(turn), 3000, 50);
    return removed;
  }

  function hardRemoveTurn(turn) { if (!turn) return false; turn.remove(); return true; }

  async function nudgeUiForRunButton() {
    const ta = document.querySelector('ms-autosize-textarea textarea, textarea[placeholder="Start typing a prompt"]');
    if (ta) {
      const orig = ta.value || '';
      ta.focus(); ta.value = orig + ' '; ta.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(0);
      ta.value = orig; ta.dispatchEvent(new Event('input', { bubbles: true })); ta.blur();
    }
    const rb = getRunButton(); if (rb) { rb.blur(); await sleep(0); rb.focus(); rb.blur(); }
    await waitFor(() => { const b = getRunButton(); return b && isEnabled(b); }, 2000, 50);
  }

  // --- actions ---
  async function clickStart() {
    let btn = getRunButton();
    if (!btn) return false;
    if (!isEnabled(btn)) {
      setStatus('waiting for run button…');
      const ok = await waitFor(() => { const b = getRunButton(); return b && isEnabled(b); }, 30_000, 100);
      if (!ok) return false;
      btn = getRunButton(); if (!btn) return false;
    }
    setStatus('click: run'); btn.click(); return true;
  }

  async function clickStop() {
    const btn = getRunButton(); if (!btn) return false;
    setStatus('click: stop'); btn.click(); return true;
  }

  async function maybeDeleteNewReply(snapCount) {
    if (!cfg.autoDelete) return false;
    if (abVoteVisible()) return false;

    const appeared = await waitFor(
      () => countModelTurns() > snapCount || abVoteVisible(), 2000, 100
    );
    if (!appeared || abVoteVisible()) return false;
    if (countModelTurns() <= snapCount) return false;

    const turns = getModelTurns();
    const last = turns[turns.length - 1];

    let ok = await uiDeleteTurn(last);
    if (!ok) ok = hardRemoveTurn(last);

    await nudgeUiForRunButton();

    if (ok) setStatus('deleted last model reply');
    return ok;
  }

  async function cycleOnce() {
    const beforeCount = countModelTurns();

    const started = await clickStart();
    if (!started) { setStatus('could not start, retrying…'); await sleep(500); return; }

    await sleep(getRunMs());

    await clickStop();

    await maybeDeleteNewReply(beforeCount);

    cycles += 1; updateCounters();

    await sleep(getGapMs());
  }

  async function mainLoop() {
    if (loopActive) return;
    loopActive = true; setStatus('flipper running…'); abNotified = false;

    try {
      while (running && !abVoteVisible()) {
        await cycleOnce();
        if (abVoteVisible()) break;
      }
    } finally {
      running = false; loopActive = false;
      if (abVoteVisible()) {
        setStatus('a/b vote detected — stopping');
        if (!abNotified) { abNotified = true; notifyABVote(); }
      } else {
        setStatus('stopped');
      }
      updateButtons();
    }
  }

  // --- ui (FINALMENTE CORRIGIDO: 100% createElement/textContent) ---
  function ensurePanel() {
    if (byId('flipper-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'flipper-panel';
    panel.style.cssText = [
      'position:fixed','right:12px','bottom:12px','z-index:2147483646',
      'font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif',
      'font-size:12px','color:#fff','background:rgba(20,20,24,.95)',
      'border:1px solid #3a3a45','border-radius:10px','padding:10px',
      'box-shadow:0 6px 24px rgba(0,0,0,.35)','min-width:260px'
    ].join(';');

    // --- 1. Header ---
    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = 'display:flex;align-items:center;gap:8px;justify-content:space-between;';
    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = 'font-weight:600;';
    titleDiv.textContent = 'flipper';
    const statusDiv = document.createElement('div');
    statusDiv.id = 'flipper-status';
    statusDiv.style.cssText = 'opacity:.9';
    statusDiv.textContent = 'idle';
    headerDiv.appendChild(titleDiv);
    headerDiv.appendChild(statusDiv);
    panel.appendChild(headerDiv);

    // --- 2. Inputs Grid ---
    const inputsGrid = document.createElement('div');
    inputsGrid.style.cssText = 'margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px;';

    // Run Seconds Input
    const runLabel = document.createElement('label');
    runLabel.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
    const runSpan = document.createElement('span');
    runSpan.style.opacity = '.85'; runSpan.textContent = 'run (s)';
    const runIn = document.createElement('input');
    runIn.id = 'flipper-run'; runIn.type = 'number'; runIn.min = '0'; runIn.step = '0.1';
    runIn.style.cssText = 'border:1px solid #4a4a57;background:#1f1f26;color:#fff;border-radius:8px;padding:6px 8px;';
    runLabel.appendChild(runSpan); runLabel.appendChild(runIn); inputsGrid.appendChild(runLabel);

    // Gap Seconds Input
    const gapLabel = document.createElement('label');
    gapLabel.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
    const gapSpan = document.createElement('span');
    gapSpan.style.opacity = '.85'; gapSpan.textContent = 'gap (s)';
    const gapIn = document.createElement('input');
    gapIn.id = 'flipper-gap'; gapIn.type = 'number'; gapIn.min = '0'; gapIn.step = '0.1';
    gapIn.style.cssText = 'border:1px solid #4a4a57;background:#1f1f26;color:#fff;border-radius:8px;padding:6px 8px;';
    gapLabel.appendChild(gapSpan); gapLabel.appendChild(gapIn); inputsGrid.appendChild(gapLabel);

    panel.appendChild(inputsGrid);

    // --- 3. Checkboxes ---
    // Auto-Delete Checkbox
    const delLabel = document.createElement('label');
    delLabel.style.cssText = 'margin-top:8px;display:flex;align-items:center;gap:8px;opacity:.95;';
    const delCb = document.createElement('input');
    delCb.id = 'flipper-autodel'; delCb.type = 'checkbox';
    const delSpan = document.createElement('span');
    delSpan.textContent = 'auto-delete non-a/b replies made during last cycle';
    delLabel.appendChild(delCb); delLabel.appendChild(delSpan);
    panel.appendChild(delLabel);

    // Notify Checkbox & Button
    const notifyLabel = document.createElement('label');
    notifyLabel.style.cssText = 'margin-top:4px;display:flex;align-items:center;gap:8px;opacity:.95;';
    const notifyCb = document.createElement('input');
    notifyCb.id = 'flipper-notify'; notifyCb.type = 'checkbox';
    const notifySpan = document.createElement('span');
    notifySpan.textContent = 'system notification when a/b appears (needs permission)';
    const notifyBtn = document.createElement('button');
    notifyBtn.id = 'flipper-notify-enable';
    notifyBtn.type = 'button';
    notifyBtn.style.cssText = 'margin-left:auto;cursor:pointer;border:1px solid #3a3a45;background:#19191f;color:#bbb;border-radius:6px;padding:3px 6px;';
    notifyBtn.textContent = 'allow';
    notifyLabel.appendChild(notifyCb); notifyLabel.appendChild(notifySpan); notifyLabel.appendChild(notifyBtn);
    panel.appendChild(notifyLabel);

    // --- 4. Control Buttons ---
    const btnDiv = document.createElement('div');
    btnDiv.style.cssText = 'margin-top:8px;display:flex;gap:8px;';
    const startBtn = document.createElement('button');
    startBtn.id = 'flipper-start';
    startBtn.type = 'button';
    startBtn.style.cssText = 'flex:1;cursor:pointer;border:1px solid #4a4a57;background:#2b2b34;color:#fff;border-radius:8px;padding:6px 10px;';
    startBtn.textContent = 'start';
    const stopBtn = document.createElement('button');
    stopBtn.id = 'flipper-stop';
    stopBtn.type = 'button';
    stopBtn.style.cssText = 'flex:1;cursor:pointer;border:1px solid #4a4a57;background:#1e1e24;color:#bbb;border-radius:8px;padding:6px 10px;';
    stopBtn.textContent = 'stop';
    btnDiv.appendChild(startBtn); btnDiv.appendChild(stopBtn);
    panel.appendChild(btnDiv);

    // --- 5. Cycle Counter & Reset (CORRIGIDO PARA NÃO USAR innerHTML) ---
    const cyclesDiv = document.createElement('div');
    cyclesDiv.style.cssText = 'margin-top:8px;opacity:.85;';
    const cyclesSpan = document.createElement('span');
    cyclesSpan.id = 'flipper-cycles';
    cyclesSpan.textContent = '0';
    cyclesDiv.appendChild(document.createTextNode('cycles: '));
    cyclesDiv.appendChild(cyclesSpan);
    panel.appendChild(cyclesDiv);

    const resetDiv = document.createElement('div');
    resetDiv.style.cssText = 'margin-top:6px;display:flex;justify-content:space-between;align-items:center;opacity:.8;';
    const resetBtn = document.createElement('button');
    resetBtn.id = 'flipper-reset';
    resetBtn.type = 'button';
    resetBtn.style.cssText = 'cursor:pointer;border:1px solid #3a3a45;background:#19191f;color:#bbb;border-radius:6px;padding:4px 8px;';
    resetBtn.textContent = 'reset defaults';
    const infoSpan = document.createElement('span');
    infoSpan.style.fontSize = '11px'; infoSpan.textContent = 'auto-stops when a/b vote appears';
    resetDiv.appendChild(resetBtn); resetDiv.appendChild(infoSpan);
    panel.appendChild(resetDiv);

    document.body.appendChild(panel);

    // --- Event Listeners (Configuração) ---

    runIn.value = String(cfg.runSec);
    gapIn.value = String(cfg.gapSec);
    delCb.checked = !!cfg.autoDelete;
    notifyCb.checked = !!cfg.notifyAB;

    const onInput = () => {
      const r = clamp(parseFloat(runIn.value), 0, 3600) || 0;
      const g = clamp(parseFloat(gapIn.value), 0, 3600) || 0;
      cfg.runSec = r; cfg.gapSec = g; saveCfg();
      flashInput(runIn); flashInput(gapIn);
    };
    runIn.addEventListener('input', onInput);
    gapIn.addEventListener('input', onInput);

    delCb.addEventListener('change', () => { cfg.autoDelete = !!delCb.checked; saveCfg(); });

    notifyCb.addEventListener('change', async () => {
      cfg.notifyAB = !!notifyCb.checked; saveCfg();
      if (cfg.notifyAB && !canNotify()) {
        const ok = await ensureNotifyPermission();
        if (!ok) {
          setStatus('notifications blocked by browser');
          cfg.notifyAB = false; notifyCb.checked = false; saveCfg();
        }
      }
    });

    notifyBtn.addEventListener('click', async () => {
      const ok = await ensureNotifyPermission();
      if (ok) setStatus('notifications enabled');
      else setStatus('notifications blocked by browser');
    });

    byId('flipper-reset').addEventListener('click', () => {
      cfg = { ...defaults }; saveCfg();
      runIn.value = String(cfg.runSec);
      gapIn.value = String(cfg.gapSec);
      delCb.checked = !!cfg.autoDelete;
      notifyCb.checked = !!cfg.notifyAB;
      flashInput(runIn); flashInput(gapIn);
    });

    byId('flipper-start').addEventListener('click', () => {
      if (running) return;
      running = true; updateButtons();
      abNotified = false;
      mainLoop().catch((e) => {
        console.error('[flipper] loop error:', e);
        setStatus('error, stopped');
        running = false; loopActive = false; updateButtons();
      });
    });

    byId('flipper-stop').addEventListener('click', () => {
      running = false; setStatus('stop requested…'); updateButtons();
    });

    makeDraggable(panel);
  }

  function flashInput(el) { const orig = el.style.borderColor; el.style.borderColor = '#6aa0ff'; setTimeout(() => { el.style.borderColor = orig || '#4a4a57'; }, 250); }
  function setStatus(txt) { const el = byId('flipper-status'); if (el) el.textContent = txt; }
  function updateCounters() { const c = byId('flipper-cycles'); if (c) c.textContent = String(cycles); }
  function updateButtons() {
    const startBtn = byId('flipper-start'); const stopBtn = byId('flipper-stop');
    if (!startBtn || !stopBtn) return;
    startBtn.style.opacity = running ? '.5' : '1';
    startBtn.style.pointerEvents = running ? 'none' : 'auto';
    stopBtn.style.opacity = running ? '1' : '.6';
    stopBtn.style.pointerEvents = running ? 'auto' : 'none';
  }
  function makeDraggable(box) {
    let dragging = false, sx = 0, sy = 0, bx = 0, by = 0;
    const header = box.firstElementChild; header.style.cursor = 'move';
    const onDown = (e) => {
      dragging = true;
      sx = (e.touches ? e.touches[0].clientX : e.clientX);
      sy = (e.touches ? e.touches[0].clientY : e.clientY);
      const rect = box.getBoundingClientRect();
      bx = rect.right; by = rect.bottom;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, {passive:false});
      document.addEventListener('touchend', onUp);
    };
    const onMove = (e) => {
      if (!dragging) return; e.preventDefault?.();
      const cx = (e.touches ? e.touches[0].clientX : e.clientX);
      const cy = (e.touches ? e.touches[0].clientY : e.clientY);
      const dx = cx - sx; const dy = cy - sy;
      box.style.right = Math.max(4, window.innerWidth - (bx + dx)) + 'px';
      box.style.bottom = Math.max(4, window.innerHeight - (by + dy)) + 'px';
    };
    const onUp = () => {
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
    header.addEventListener('mousedown', onDown);
    header.addEventListener('touchstart', onDown, {passive:true});
  }

  // --- boot ---
  (async () => {
    await sleep(500);
    ensurePanel();
    updateButtons();

    // global watcher: stop + notify as soon as a/b vote appears
    const mo = new MutationObserver(async () => {
      if (abVoteVisible()) {
        if (running) { setStatus('a/b vote detected — stopping'); running = false; updateButtons(); }
        if (!abNotified) { abNotified = true; await notifyABVote(); }
      }
    });
    mo.observe(document.documentElement, {subtree:true, childList:true});
  })();
})();
