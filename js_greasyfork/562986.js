// ==UserScript==
// @name         GeoGuessr Party Presets — Pinpointing / NM / NMPZ
// @namespace    gg-presets
// @version      1.5
// @author       you
// @description  3 Presets in GeoGuessr Parties
// @license MIT
// @match        https://www.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562986/GeoGuessr%20Party%20Presets%20%E2%80%94%20Pinpointing%20%20NM%20%20NMPZ.user.js
// @updateURL https://update.greasyfork.org/scripts/562986/GeoGuessr%20Party%20Presets%20%E2%80%94%20Pinpointing%20%20NM%20%20NMPZ.meta.js
// ==/UserScript==

(function () {
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  const onParty = () => location.pathname.startsWith('/party');
  const log = (...a) => console.log('[GG Presets]', ...a);
  const ok  = (m) => log('✓', m);
  const warn= (m) => log('⚠', m);

  // ---------------- React-safe input commit ----------------
  function setReactInputValue(input, value) {
    const desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    desc?.set?.call(input, String(value));
    input.dispatchEvent(new Event('input',  { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // ---------------- Game Mode ----------------
  async function setGameMode(label) {
    const target = Array.from(document.querySelectorAll('label'))
      .find(l => (l.textContent || '').trim().toLowerCase() === label.toLowerCase());
    if (!target) return warn(`Game Mode option not found: ${label}`);
    ['pointerdown','mousedown','mouseup','pointerup','click'].forEach(t =>
      target.dispatchEvent(new MouseEvent(t, { bubbles: true }))
    );
    ok(`Game Mode → ${label}`);
    await wait(60);
  }

  // ---------------- Max Round time ----------------
  function findMaxRoundWrapper() {
    const label = Array.from(document.querySelectorAll('div'))
      .find(d => d.className?.startsWith?.('slider-option_label') && d.textContent.trim() === 'Max Round time');
    return label ? label.closest('div[class^="slider-option_wrapper"]') : null;
  }

  async function setRoundTimeSeconds(seconds) {
    const wrap = findMaxRoundWrapper();
    if (!wrap) return warn('Max Round time wrapper not found');
    const input = wrap.querySelector('input[placeholder="Seconds"], input[class^="slider-option_input"]');
    if (!input) return warn('Round time input not found');

    input.focus();
    input.select?.();
    setReactInputValue(input, seconds);
    // many components finalize on Enter/blur
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', bubbles: true }));
    input.blur();
    ok(`Max Round time → ${seconds === 0 ? 'No time limit (0)' : seconds + 's'}`);
    await wait(120);
  }

  // ---------------- Numeric steppers (verified clicks) ----------------
  function findNumericWrapper(labelText) {
    const label = Array.from(document.querySelectorAll('div'))
      .find(d => d.className?.startsWith?.('numeric-option_label') &&
                 d.textContent.trim().toLowerCase() === labelText.toLowerCase());
    return label ? label.closest('div[class^="numeric-option_wrapper"]') : null;
  }

  function readNumericValue(wrap) {
    const valNode = wrap.querySelector('div[class^="numeric-option_value"]');
    const raw = (valNode?.textContent || '').trim();
    const n = Number(raw.replace(/[^\d.,-]/g, '').replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  }

  function fireClick(btn) {
    ['pointerdown','mousedown','mouseup','pointerup','click'].forEach(t =>
      btn.dispatchEvent(new MouseEvent(t, { bubbles: true }))
    );
  }

  async function waitForValueChange(wrap, prev, timeout = 450) {
    const start = performance.now();
    while (performance.now() - start < timeout) {
      const cur = readNumericValue(wrap);
      if (cur !== prev) return cur;
      await wait(25);
    }
    return readNumericValue(wrap);
  }

  async function clickOnceAndVerify(btn, wrap, expectedStepSign) {
    btn.scrollIntoView({ block: 'center' });
    btn.focus?.();
    const before = readNumericValue(wrap);
    fireClick(btn);
    let after = await waitForValueChange(wrap, before, 350);

    // Retry once if swallowed
    if (after === before) {
      await wait(140);
      fireClick(btn);
      after = await waitForValueChange(wrap, before, 450);
    }

    // If wrong direction (rare), try to revert
    if (expectedStepSign !== 0 && Math.sign(after - before) !== expectedStepSign) {
      const minus = wrap.querySelector('button[data-qa="numeric-decrease"]') ||
                    Array.from(wrap.querySelectorAll('button')).find(b => (b.textContent||'').trim() === '-');
      const plus  = Array.from(wrap.querySelectorAll('button')).find(b => (b.textContent||'').trim() === '+');
      fireClick(expectedStepSign > 0 ? minus : plus);
      await wait(120);
      return readNumericValue(wrap);
    }
    return after;
  }

  async function floorToZero(wrap) {
    const minus = wrap.querySelector('button[data-qa="numeric-decrease"]') ||
                  Array.from(wrap.querySelectorAll('button')).find(b => (b.textContent||'').trim() === '-');
    if (!minus) throw new Error('minus not found');

    let before = readNumericValue(wrap);
    for (let guard = 0; guard < 20; guard++) {
      const after = await clickOnceAndVerify(minus, wrap, -1);
      if (after === before || after <= 0) break;
      before = after;
      await wait(70);
    }
  }

  async function stepUp(wrap, steps) {
    const plus = Array.from(wrap.querySelectorAll('button')).find(b => (b.textContent||'').trim() === '+');
    if (!plus) throw new Error('plus not found');
    for (let i = 0; i < steps; i++) {
      await clickOnceAndVerify(plus, wrap, +1);
      await wait(80); // slightly slower → fewer misses
    }
  }

  async function setNumericDeterministic(labelText, plusClicksAfterFloor) {
    const wrap = findNumericWrapper(labelText);
    if (!wrap) { warn(`Row not found: ${labelText}`); return; }
    await floorToZero(wrap);
    if (plusClicksAfterFloor > 0) await stepUp(wrap, plusClicksAfterFloor);
    ok(`${labelText} → floor(0) + ${plusClicksAfterFloor}× +`);
  }

  async function setInitialHealth(value) {
    const wrap = findNumericWrapper('Initial Health');
    if (!wrap) return warn('Initial Health row not found');
    const input = wrap.querySelector('input[type="number"], input');
    if (input) {
      input.focus();
      input.select?.();
      setReactInputValue(input, value);
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', bubbles: true }));
      input.blur();
      ok(`Initial Health → ${value} (input)`);
      await wait(140);
      return;
    }
    // Fallback to stepper if needed (can be slow for huge values)
    const minus = wrap.querySelector('button[data-qa="numeric-decrease"]') ||
                  Array.from(wrap.querySelectorAll('button')).find(b => (b.textContent||'').trim() === '-');
    const plus  = Array.from(wrap.querySelectorAll('button')).find(b => (b.textContent||'').trim() === '+');
    if (!minus || !plus) return warn('Initial Health controls not found');
    await floorToZero(wrap);
    for (let i = 0; i < 200; i++) { fireClick(plus); await wait(5); }
    ok(`Initial Health → ${value} (stepper best-effort)`);
  }

  // ---------------- Presets ----------------
  async function apply_Pinpointing() {
    await setGameMode('Moving');
    await setRoundTimeSeconds(90);
    await setInitialHealth(1000000);
    await setNumericDeterministic('Multiplier Increase', 0);
    await setNumericDeterministic('Rounds Without Multiplier', 0);
  }

  async function apply_NM() {
    await setGameMode('No Move');
    await setRoundTimeSeconds(60);
    await setInitialHealth(4000);
    await setNumericDeterministic('Multiplier Increase', 2);
    await setNumericDeterministic('Rounds Without Multiplier', 1);
  }

  async function apply_NMPZ() {
    await setGameMode('NMPZ');
    await setRoundTimeSeconds(60);
    await setInitialHealth(4000);
    await setNumericDeterministic('Multiplier Increase', 2);
    await setNumericDeterministic('Rounds Without Multiplier', 1);
  }

  // ---------------- UI: buttons on /party ----------------
  function ensureButtons() {
    if (!onParty()) return removeButtons();
    if (document.getElementById('gg-preset-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'gg-preset-bar';
    Object.assign(bar.style, {
      position: 'fixed', right: '24px', bottom: '24px',
      display: 'flex', gap: '8px', zIndex: 99999,
      background: 'rgba(20,20,28,.85)', border: '1px solid rgba(255,255,255,.15)',
      borderRadius: '12px', padding: '10px', backdropFilter: 'blur(6px)'
    });

    const mk = (label, fn) => {
      const b = document.createElement('button');
      b.textContent = label;
      Object.assign(b.style, {
        cursor:'pointer', padding:'8px 12px', borderRadius:'10px',
        border:'1px solid rgba(255,255,255,.2)', color:'#fff',
        background:'rgba(120,82,255,.15)', fontWeight:600
      });
      b.onclick = async () => {
        b.disabled = true; const old = b.textContent; b.textContent = old + '…';
        try { await fn(); } finally { b.disabled = false; b.textContent = old; }
      };
      return b;
    };

    bar.appendChild(mk('Pinpointing', apply_Pinpointing));
    bar.appendChild(mk('NM',          apply_NM));
    bar.appendChild(mk('NMPZ',        apply_NMPZ));
    document.body.appendChild(bar);
    ok('Preset bar added');
  }

  function removeButtons() { document.getElementById('gg-preset-bar')?.remove(); }

  const mo = new MutationObserver(() => ensureButtons());
  mo.observe(document.documentElement, { childList: true, subtree: true });
  ensureButtons();

  const _push = history.pushState;
  history.pushState = function () { _push.apply(this, arguments); setTimeout(ensureButtons, 60); };
  window.addEventListener('popstate', () => setTimeout(ensureButtons, 60));
})();
