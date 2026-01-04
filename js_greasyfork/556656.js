// ==UserScript==
// @name         Torn Ghost Trade Money Helper - Torn Control Center - 6NJM
// @namespace    https://6njm.dev/torn/ghosttrade
// @version      1.1.2
// @description  QoL helper for Torn ghost trades: auto-max deposit, add & subtract rows, compact mode, reinjection, color-coded UI, live wallet sync, hotkeys. Stays on Add Money page, EXCEPT when you click "Back to Trade" (one-time bypass).
// @author       6NJM
// @license      MIT
// @match        https://www.torn.com/trade.php*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/556656/Torn%20Ghost%20Trade%20Money%20Helper%20-%20Torn%20Control%20Center%20-%206NJM.user.js
// @updateURL https://update.greasyfork.org/scripts/556656/Torn%20Ghost%20Trade%20Money%20Helper%20-%20Torn%20Control%20Center%20-%206NJM.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== REDIRECT PATCH WITH BYPASS =====
  (function enforceAddMoney() {
    let bypassOnce = false;

    function shouldFix() {
      if (bypassOnce) {
        bypassOnce = false; // consume the bypass
        return false;
      }
      return true;
    }

    // Initial fix if we landed on view
    if (location.hash.includes('step=view') && shouldFix()) {
      location.replace(location.href.replace(/step=view/g, 'step=addmoney'));
    }

    // Helper function
    const fixUrl = (url) => {
      if (typeof url === 'string' && url.includes('step=view') && shouldFix()) {
        return url.replace(/step=view/g, 'step=addmoney');
      }
      return url;
    };

    // Patch history methods
    const origPush = history.pushState;
    history.pushState = function (state, title, url) {
      return origPush.apply(this, [state, title, fixUrl(url)]);
    };

    const origReplace = history.replaceState;
    history.replaceState = function (state, title, url) {
      return origReplace.apply(this, [state, title, fixUrl(url)]);
    };

    // Hashchange listener
    window.addEventListener('hashchange', () => {
      if (location.hash.includes('step=view') && shouldFix()) {
        location.replace(location.href.replace(/step=view/g, 'step=addmoney'));
      }
    });

    // Back to Trade button → allow one bypass
    document.addEventListener(
      'click',
      (e) => {
        const backBtn = e.target.closest('a[href*="trade.php#step=view"]');
        if (backBtn) {
          console.log('[GhostTradeHelper] Back to Trade clicked – allowing one bypass');
          bypassOnce = true;
        }
      },
      true
    );
  })();

  // ===== CONFIG =====
  const DEFAULT_PRESETS = [
    100_000,
    250_000,
    500_000,
    1_000_000,
    2_500_000,
    5_000_000,
    10_000_000,
    25_000_000,
    50_000_000,
    100_000_000,
  ];
  const DEFAULT_KEEP_ON_HAND = 0;

  // ===== STYLING =====
  const STYLE = `
    .gth-row { display:flex; flex-wrap:wrap; gap:8px; margin-top:6px; align-items:center; }
    .gth-btn { padding:4px 8px; border-radius:6px; cursor:pointer; border:1px solid transparent; font-size:12px; }
    .gth-btn.add { background:#103; color:#0f0; border-color:#0f0; }
    .gth-btn.sub { background:#300; color:#f44; border-color:#f44; }
    .gth-btn.util { background:#003; color:#4af; border-color:#4af; }
    .gth-btn.max { background:#030; color:#0f0; border-color:#0f0; }
    .gth-btn.clear { background:#222; color:#eee; border-color:#888; }
    .gth-btn:hover { opacity:0.8; }
    .gth-note { opacity:0.7; font-size:11px; margin-left:6px; }
    .gth-link { text-decoration:underline; cursor:pointer; margin-left:6px; }
    .gth-lock-pill { display:inline-flex; align-items:center; gap:6px; padding:2px 8px; margin-left:8px; border-radius:999px; font-size:11px; background:#063; color:#cfc; border:1px solid #0a5; }
  `;

  // ===== UTILITIES =====
  function injectStyles(css) {
    const s = document.createElement('style');
    s.textContent = css;
    document.documentElement.appendChild(s);
  }

  function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else if (k === 'class') e.className = v;
      else e.setAttribute(k, v);
    });
    (children || []).forEach((c) => e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return e;
  }

  function parseHumanNumber(s) {
    if (!s) return 0;
    s = String(s).trim().toLowerCase();
    let mult = 1;
    if (s.endsWith('b')) { mult = 1e9; s = s.slice(0, -1); }
    else if (s.endsWith('m')) { mult = 1e6; s = s.slice(0, -1); }
    else if (s.endsWith('k')) { mult = 1e3; s = s.slice(0, -1); }
    s = s.replace(/[^0-9.]/g, '');
    const val = parseFloat(s);
    return isNaN(val) ? 0 : Math.floor(val * mult);
  }

  const fmt = (n) => (Number.isFinite(n) ? n.toLocaleString('en-US') : '0');

  function trigger(input) {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function findTradeMoneyElements() {
    const section = [...document.querySelectorAll('section,div,form,article')].find((n) =>
      /you have\s*\$/i.test(n.textContent || '')
    );
    if (!section) return null;
    const wallet = [...section.querySelectorAll('p,div,span')].find((n) => /you have\s*\$/i.test(n.textContent || ''));
    const input = section.querySelector('input[type="text"],input[type="number"]');
    return wallet && input ? { walletNode: wallet, input } : null;
  }

  function getWallet(node) {
    const m = (node.textContent || '').match(/\$\s*([\d,\.]+)/);
    return m ? parseHumanNumber(m[1]) : 0;
  }

  const getVal = (i) => parseHumanNumber(i.value);
  const setVal = (i, v) => {
    i.value = fmt(Math.max(0, Math.floor(v)));
    trigger(i);
  };

  const loadCfg = () => ({
    presets: GM_getValue('presets', DEFAULT_PRESETS),
    keep: GM_getValue('keep_on_hand', DEFAULT_KEEP_ON_HAND),
  });

  const saveCfg = (p, k) => {
    GM_setValue('presets', p);
    GM_setValue('keep_on_hand', k);
  };

  // ===== UI =====
  function buildUI(ctx) {
    const { walletNode, input } = ctx;
    const { presets, keep } = loadCfg();
    const container = el('div', { class: 'gth-container' });

    const addRow = el('div', { class: 'gth-row' }, presets.map((a) => {
      const b = el('button', { class: 'gth-btn add' }, ['+' + fmt(a)]);
      b.onclick = () => setVal(input, getVal(input) + a);
      return b;
    }));

    const subRow = el('div', { class: 'gth-row' }, presets.map((a) => {
      const b = el('button', { class: 'gth-btn sub' }, ['-' + fmt(a)]);
      b.onclick = () => setVal(input, Math.max(0, getVal(input) - a));
      return b;
    }));

    const maxBtn = el('button', { class: 'gth-btn max' }, ['Max']);
    maxBtn.onclick = () => setVal(input, getVal(input) + Math.max(0, getWallet(walletNode) - keep));

    const clearBtn = el('button', { class: 'gth-btn clear' }, ['Clear']);
    clearBtn.onclick = () => setVal(input, 0);

    const customBtn = el('button', { class: 'gth-btn util' }, ['Custom']);
    customBtn.onclick = () => {
      const amt = parseHumanNumber(prompt('Subtract how much?', ''));
      if (amt > 0) setVal(input, Math.max(0, getVal(input) - amt));
    };

    const pasteBtn = el('button', { class: 'gth-btn util' }, ['Paste']);
    pasteBtn.onclick = async () => {
      try {
        const t = await navigator.clipboard.readText();
        setVal(input, parseHumanNumber(t));
      } catch { alert('Clipboard read failed'); }
    };

    const settings = el('span', { class: 'gth-link' }, ['⚙ Settings']);
    settings.onclick = () => {
      const presetInput = prompt('Presets (comma sep, supports k/m/b):', presets.join(','));
      if (presetInput !== null) {
        const newP = presetInput.split(',').map(parseHumanNumber).filter((x) => x > 0);
        if (newP.length) saveCfg(newP, keep);
      }
      const keepInput = prompt('Keep on hand amount:', keep);
      if (keepInput !== null) saveCfg(presets, parseHumanNumber(keepInput));
      alert('Settings saved. Reload trade to apply.');
    };

    const note = el('span', { class: 'gth-note' }, ['QoL only – still click Torn’s own buttons.']);
    const lockPill = el('span', { class: 'gth-lock-pill' }, ['🔒 Locked on Add Money']);

    const utilRow = el('div', { class: 'gth-row' }, [
      maxBtn, clearBtn, customBtn, pasteBtn, settings, lockPill, note
    ]);

    container.appendChild(addRow);
    container.appendChild(subRow);
    container.appendChild(utilRow);
    input.parentElement.appendChild(container);
    input.focus();
    console.log('[GhostTradeHelper] UI injected');
  }

  // ===== STARTUP =====
  function initUI() {
    injectStyles(STYLE);
    let uiInjected = false;
    let lastInput = null;
    function maybe() {
      const ctx = findTradeMoneyElements();
      if (!ctx) { uiInjected = false; lastInput = null; return; }
      if (uiInjected && ctx.input === lastInput) return;
      buildUI(ctx); uiInjected = true; lastInput = ctx.input;
    }
    maybe();
    const target = document.querySelector('#mainContainer') || document.body;
    new MutationObserver(maybe).observe(target, { childList: true, subtree: true });
    setInterval(maybe, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI, { once: true });
  } else { initUI(); }
})();
