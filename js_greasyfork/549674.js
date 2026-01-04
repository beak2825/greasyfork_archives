// ==UserScript==
// @name         Portfolio Manager
// @namespace    Stock-Portfolio-Manager
// @version      1.4.2
// @description  Vault & planner (buy/sell) for torn.com stocks
// @author       mightyMONTY
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549674/Portfolio%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/549674/Portfolio%20Manager.meta.js
// ==/UserScript==


(() => {
  'use strict';

  /* ----------------------------- tiny utilities ----------------------------- */
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const visible = (e) => !!e && e.offsetParent !== null;
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const FEE = 0.999; // assume 0.1% taken on sell

  const parsePrice = (t) => {
    const n = parseFloat(String(t || '').replace(/[^0-9.]/g, ''));
    return isFinite(n) ? n : NaN;
  };
  const parseKMB = (raw) => {
    if (raw == null) return NaN;
    let v = String(raw).trim().toLowerCase();
    if (!v) return NaN;
    const map = { k: 1e3, m: 1e6, b: 1e9 };
    const last = v.slice(-1);
    if (map[last]) {
      const n = parseFloat(v.slice(0, -1));
      return isNaN(n) ? NaN : n * map[last];
    }
    const n = parseFloat(v.replace(/,/g, ''));
    return isNaN(n) ? NaN : n;
  };
  const fmtInt = (n) => isFinite(n) ? Math.floor(n).toLocaleString() : '—';

  /* ------------------------------ selectors -------------------------------- */
  const SEL = {
    STOCK_UL: "ul[class^='stock_']",
    PRICE: "div[class^='price_']",

    // Try to find a qty input within a given scope (row or modal)
    findQtyInput(scope) {
      const inputs = qsa("input[type='number'], input[type='text'], input[name*='mount'], input[class*='mount']", scope)
        .filter(visible);
      if (inputs.length) return inputs[0];

      // Some UIs use contenteditable
      const ce = qsa("[contenteditable='true'], [role='textbox']", scope).filter(visible);
      return ce[0] || null;
    },

    // Find any visible modal/sheet/dialog
    findActiveModal() {
      const nodes = [
        ...qsa("[role='dialog']"),
        ...qsa(".modal, .popup, .dialog, div[class*='modal'], div[class*='Dialog'], div[class*='popup'], div[class*='drawer'], div[class*='sheet']")
      ].filter(visible);
      return nodes[nodes.length - 1] || null;
    },
  };

  /* ------------------------------ scan stocks ------------------------------- */
  const rows = Object.create(null); // SYM -> { ul, priceEl }

  function scan() {
    rows._symbols = [];
    for (const ul of qsa(SEL.STOCK_UL)) {
      const img = ul.querySelector('img');
      if (!img) continue;
      const src = img.getAttribute('src') || '';
      const m = src.match(/logos\/([^/.]+)\.svg/i);
      if (!m) continue;
      const sym = m[1];
      rows[sym] = { ul, priceEl: ul.querySelector(SEL.PRICE) };
      rows._symbols.push(sym);
    }
    rows._symbols.sort();
    return rows._symbols;
  }

  function getPrice(sym) {
    const el = rows[sym]?.priceEl;
    return el ? parsePrice(el.textContent) : NaN;
  }

  /* --------------------------------- UI ------------------------------------ */
  function injectStyles() {
    const st = document.createElement('style');
    st.textContent = `
      :root{
        --sv-bg: rgba(18,24,28,.82);
        --sv-bd: #334b57;
        --sv-tx: #e7f0f4;
        --sv-sub:#a9c1cc;
        --sv-ac:#66c0c0;
        --sv-bad:#ff6b81;
        --sv-good:#57d38c;
      }
      @media (prefers-color-scheme: light){
        :root{ --sv-bg: rgba(255,255,255,.92); --sv-bd:#c9d9df; --sv-tx:#0f1a20; --sv-sub:#3c5966; --sv-ac:#0a7b7b; }
      }
      #sv-mini{ position:sticky; top:8px; z-index:999; }
      #sv-mini .box{ margin:10px 0; padding:12px; border:1px solid var(--sv-bd);
        border-radius:12px; background:var(--sv-bg); color:var(--sv-tx); backdrop-filter: blur(6px); }
      #sv-mini .row{ display:flex; gap:.5rem; align-items:center; flex-wrap:wrap; margin:.35rem 0; }
      #sv-mini label{ color:var(--sv-sub); font-weight:600; }
      #sv-sym, #sv-buy-amt, #sv-sell-amt{ color:var(--sv-tx); border:1px solid var(--sv-bd); background:transparent;
        border-radius:8px; padding:6px 10px; }
      #sv-buy-amt:focus, #sv-sell-amt:focus, #sv-sym:focus{ outline:none; box-shadow:0 0 0 2px rgba(102,192,192,.35); }
      .btn{ padding:.35rem .6rem; border:1px solid var(--sv-ac); color:var(--sv-ac); border-radius:8px; background:transparent; cursor:pointer; }
      .btn:hover{ filter:brightness(1.08); }
      .muted{ color:var(--sv-sub); font-size:12px; }
      .ok{ color:var(--sv-good); font-weight:600; }
      .err{ color:var(--sv-bad); font-weight:600; }
      .mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    `;
    (document.head || document.documentElement).appendChild(st);
  }

  function buildUI(symbols) {
    const wrap = document.createElement('div');
    wrap.id = 'sv-mini';
    wrap.innerHTML = `
      <div class="box">
        <div class="row">
          <label for="sv-sym">Stock:</label>
          <select id="sv-sym"><option value="">—</option>${symbols.map(s => `<option value="${s}">${s}</option>`).join('')}</select>
          <span class="muted">Price: <span id="sv-price" class="mono">—</span></span>
        </div>
        <div class="row">
          <label for="sv-buy-amt">Buy $:</label>
          <input id="sv-buy-amt" type="text" inputmode="decimal" placeholder="e.g. 250m / 1.5b / 500000" />
          <span class="muted">≈ Shares: <span id="sv-buy-sh" class="mono">—</span></span>
          <button id="sv-buy-copy" class="btn">Copy</button>
          <button id="sv-buy-fill" class="btn">Prefill qty</button>
        </div>
        <div class="row">
          <label for="sv-sell-amt">Sell $:</label>
          <input id="sv-sell-amt" type="text" inputmode="decimal" placeholder="e.g. 100m / 2b" />
          <span class="muted">≈ Shares: <span id="sv-sell-sh" class="mono">—</span></span>
          <button id="sv-sell-copy" class="btn">Copy</button>
          <button id="sv-sell-fill" class="btn">Prefill qty</button>
        </div>
        <div class="row">
          <span id="sv-msg" class="muted">Pick a stock, enter $ — I’ll convert to shares. Then use Torn’s own Buy/Sell buttons.</span>
        </div>
      </div>
    `;
    (qs('#stockmarketroot') || document.body).prepend(wrap);

    const $sym = qs('#sv-sym'), $price = qs('#sv-price');
    const $buyAmt = qs('#sv-buy-amt'), $buySh = qs('#sv-buy-sh');
    const $sellAmt = qs('#sv-sell-amt'), $sellSh = qs('#sv-sell-sh');
    const $msg = qs('#sv-msg');

    function currentSym() { return $sym.value || ''; }
    function currentPrice() {
      const s = currentSym();
      const p = getPrice(s);
      return isFinite(p) ? p : NaN;
    }
    function updatePrice() {
      const p = currentPrice();
      $price.textContent = isFinite(p) ? p.toLocaleString() : '—';
      updateCalcs();
    }

    function updateCalcs() {
      const p = currentPrice();
      if (!isFinite(p) || p <= 0) {
        $buySh.textContent = '—';
        $sellSh.textContent = '—';
        return;
      }
      const buy$ = parseKMB($buyAmt.value);
      const sell$ = parseKMB($sellAmt.value);
      const buyShares = isFinite(buy$) && buy$ > 0 ? Math.floor(buy$ / p) : NaN;
      const sellShares = isFinite(sell$) && sell$ > 0 ? Math.ceil(sell$ / (p * FEE)) : NaN;
      $buySh.textContent = isFinite(buyShares) ? fmtInt(buyShares) : '—';
      $sellSh.textContent = isFinite(sellShares) ? fmtInt(sellShares) : '—';
    }

    function toast(ok, text) {
      $msg.classList.remove('ok', 'err');
      $msg.classList.add(ok ? 'ok' : 'err');
      $msg.textContent = text;
      setTimeout(() => { $msg.classList.remove('ok', 'err'); $msg.textContent = text; }, 1800);
    }

    async function copyShares(which) {
      const shText = which === 'buy' ? $buySh.textContent : $sellSh.textContent;
      if (!shText || shText === '—') return toast(false, 'Nothing to copy');
      try {
        await navigator.clipboard.writeText(shText.replace(/,/g, ''));
        toast(true, `Copied ${shText} shares`);
      } catch {
        toast(false, 'Clipboard blocked — select & copy manually');
      }
    }

    // Find a qty field either in an open modal mentioning the symbol OR inside the row.
    function findQtyFieldFor(sym) {
      // 1) Prefer an active modal/sheet that looks related
      const modal = SEL.findActiveModal();
      if (modal) {
        const txt = (modal.textContent || '').toLowerCase();
        const hasSym = txt.includes(String(sym).toLowerCase()) ||
          !!modal.querySelector(`img[src*="logos/${sym}.svg" i]`);
        if (hasSym) {
          const mi = SEL.findQtyInput(modal);
          if (mi) return mi;
        }
      }
      // 2) Fall back to the row (expanded UIs often put input there)
      const ul = rows[sym]?.ul;
      if (ul) {
        const ri = SEL.findQtyInput(ul);
        if (ri) return ri;
      }
      return null;
    }

    function prefill(which) {
      const sym = currentSym();
      if (!sym) return toast(false, 'Pick a stock first');
      const p = currentPrice();
      if (!isFinite(p) || p <= 0) return toast(false, 'No price detected');
      const amt = which === 'buy' ? parseKMB($buyAmt.value) : parseKMB($sellAmt.value);
      if (!isFinite(amt) || amt <= 0) return toast(false, 'Enter a valid $ amount');

      const shares = which === 'buy'
        ? Math.floor(amt / p)
        : Math.ceil(amt / (p * FEE));

      if (!shares || shares <= 0) return toast(false, 'Share count computed as 0');

      // Try to set into a visible qty field
      const field = findQtyFieldFor(sym);
      if (!field) {
        return toast(false, 'Open the stock’s trade panel/modal, then click Prefill again');
      }

      // Set value (input or contenteditable)
      if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
        field.focus();
        field.value = String(shares);
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        field.focus();
        try {
          const sel = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(field);
          sel.removeAllRanges(); sel.addRange(range);
          document.execCommand('delete');
        } catch {}
        field.textContent = String(shares);
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }

      toast(true, `Prefilled ${shares.toLocaleString()} shares — now click Buy/Sell yourself`);
      try { field.scrollIntoView({ block: 'center' }); } catch {}
    }

    // events
    $sym.addEventListener('change', updatePrice);
    $buyAmt.addEventListener('input', updateCalcs);
    $sellAmt.addEventListener('input', updateCalcs);
    qs('#sv-buy-copy').addEventListener('click', () => copyShares('buy'));
    qs('#sv-sell-copy').addEventListener('click', () => copyShares('sell'));
    qs('#sv-buy-fill').addEventListener('click', () => prefill('buy'));
    qs('#sv-sell-fill').addEventListener('click', () => prefill('sell'));

    updatePrice();
  }

  /* ------------------------------- bootstrap -------------------------------- */
  async function waitForStocks(timeoutMs = 6000) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeoutMs) {
      if (document.querySelector(SEL.STOCK_UL)) return true;
      await sleep(150);
    }
    return !!document.querySelector(SEL.STOCK_UL);
  }

  (async function init() {
    injectStyles();
    const ok = await waitForStocks();
    if (!ok) return; // nothing to do if stocks list not present
    for (let i = 0; i < 10; i++) {
      const symbols = scan();
      if (symbols.length) { buildUI(symbols); return; }
      await sleep(250);
    }
    // final attempt
    const symbols = scan();
    if (symbols.length) buildUI(symbols);
  })();

})();