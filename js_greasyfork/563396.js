// ==UserScript==
// @name         Torn Item formatter
// @namespace    torn.com
// @version      1.0.3
// @description  ItemMarket helper panel
// @author       SuperGogu [3580072]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563396/Torn%20Item%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/563396/Torn%20Item%20formatter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const KEY_VISIBLE = 'tif_visible_v1';
  const KEY_POS = 'tif_pos_v1';

  const BASE_WEPS = {
    '9mm Uzi': { dmg0: 36.43511095018879, acc0: 24.253866445973205 },
  };

  GM_addStyle(`
    #tif-panel {
      position: fixed;
      z-index: 2147483647;
      width: 420px;
      max-width: calc(100vw - 24px);
      background: #1f1f1f;
      border: 2px solid #00ff4c;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.55);
      color: #eaeaea;
      font-family: Arial, sans-serif;
      overflow: hidden;
      user-select: none;
    }
    #tif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 10px;
      background: #151515;
      cursor: move;
      border-bottom: 1px solid rgba(0,255,76,0.35);
    }
    #tif-title {
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.2px;
      opacity: 0.95;
    }
    #tif-close {
      width: 26px;
      height: 26px;
      border-radius: 8px;
      border: 1px solid rgba(0,255,76,0.55);
      background: #101010;
      color: #00ff4c;
      cursor: pointer;
      display: grid;
      place-items: center;
      font-weight: 800;
      line-height: 1;
    }
    #tif-close:hover { filter: brightness(1.15); }
    #tif-body { padding: 10px; user-select: text; }
    #tif-out {
      background: #131313;
      border: 1px solid rgba(0,255,76,0.25);
      border-radius: 10px;
      padding: 10px;
      min-height: 70px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 12px;
      line-height: 1.35;
      white-space: pre-wrap;
      word-break: break-word;
    }

    li.tif-injectedWrapper {
      list-style: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .tif-injectedRow {
      margin: 6px 0 0 0;
      padding: 8px 10px;
      background: rgba(16,16,16,0.55);
      border: 1px dashed rgba(0,255,76,0.35);
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .tif-injectedBtn {
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid rgba(0,255,76,0.65);
      background: #101010;
      color: #00ff4c;
      cursor: pointer;
      font-weight: 700;
      font-size: 12px;
    }
    .tif-injectedBtn:hover { filter: brightness(1.15); }
  `);

  const state = {
    visible: String(GM_getValue(KEY_VISIBLE, '1')) === '1',
    pos: (() => {
      try {
        const raw = GM_getValue(KEY_POS, '');
        if (!raw) return null;
        const p = JSON.parse(raw);
        if (typeof p?.x === 'number' && typeof p?.y === 'number') return p;
      } catch {}
      return null;
    })(),
  };

  const panel = document.createElement('div');
  panel.id = 'tif-panel';

  const header = document.createElement('div');
  header.id = 'tif-header';

  const title = document.createElement('div');
  title.id = 'tif-title';
  title.textContent = 'ItemMarket Panel';

  const closeBtn = document.createElement('button');
  closeBtn.id = 'tif-close';
  closeBtn.type = 'button';
  closeBtn.textContent = 'X';

  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  body.id = 'tif-body';

  const outBox = document.createElement('div');
  outBox.id = 'tif-out';
  outBox.textContent = '';

  body.appendChild(outBox);
  panel.appendChild(header);
  panel.appendChild(body);
  document.body.appendChild(panel);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const applyPos = (x, y) => {
    const pad = 8;
    const rect = panel.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - pad;
    const maxY = window.innerHeight - rect.height - pad;
    const cx = clamp(x, pad, Math.max(pad, maxX));
    const cy = clamp(y, pad, Math.max(pad, maxY));
    panel.style.left = `${cx}px`;
    panel.style.top = `${cy}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    GM_setValue(KEY_POS, JSON.stringify({ x: cx, y: cy }));
  };

  if (state.pos) applyPos(state.pos.x, state.pos.y);
  else {
    panel.style.right = '12px';
    panel.style.top = '120px';
  }

  const setVisible = (v) => {
    state.visible = !!v;
    panel.style.display = state.visible ? 'block' : 'none';
    GM_setValue(KEY_VISIBLE, state.visible ? '1' : '0');
  };

  closeBtn.addEventListener('click', () => setVisible(false));
  GM_registerMenuCommand('Toggle Item formatter panel', () => setVisible(!state.visible));
  setVisible(state.visible);

  let dragging = false;
  let dragOX = 0;
  let dragOY = 0;

  header.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    const rect = panel.getBoundingClientRect();
    dragOX = e.clientX - rect.left;
    dragOY = e.clientY - rect.top;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    applyPos(e.clientX - dragOX, e.clientY - dragOY);
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
  });

  const isSellerListWrapper = (li) => {
    if (!li || li.tagName !== 'LI') return false;
    const cls = li.className || '';
    return cls.includes('sellerListWrapper');
  };

  const numFrom = (s) => {
    const m = String(s || '').match(/[\d.]+/g);
    if (!m) return null;
    const v = parseFloat(m.join(''));
    return Number.isFinite(v) ? v : null;
  };

  const digitsFrom = (s) => {
    const d = String(s || '').replace(/[^\d]/g, '');
    return d ? d : null;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return !!ok;
    } catch {}
    return false;
  };

  const buildRwWatch = (btnEl) => {
    const injectedLi = btnEl.closest('li.tif-injectedWrapper');
    if (!injectedLi) return null;

    let itemLi = injectedLi.previousElementSibling;
    while (itemLi && itemLi.tagName === 'LI' && !itemLi.querySelector?.('div[class*="itemTile"]')) {
      itemLi = itemLi.previousElementSibling;
    }

    let sellerLi = injectedLi.nextElementSibling;
    while (sellerLi && sellerLi.tagName === 'LI' && !isSellerListWrapper(sellerLi)) {
      sellerLi = sellerLi.nextElementSibling;
    }

    if (!itemLi) return null;

    const wep = (itemLi.querySelector('.name___ukdHN')?.textContent || '').trim() || 'Unknown';

    const dmgEl = Array.from(itemLi.querySelectorAll('span.value___cwqHv[aria-label]')).find(x => (x.getAttribute('aria-label') || '').toLowerCase().includes('damage'));
    const accEl = Array.from(itemLi.querySelectorAll('span.value___cwqHv[aria-label]')).find(x => (x.getAttribute('aria-label') || '').toLowerCase().includes('accuracy'));

    const dmg = dmgEl ? numFrom(dmgEl.getAttribute('aria-label')) : null;
    const acc = accEl ? numFrom(accEl.getAttribute('aria-label')) : null;

    let price = null;
    const priceTxt = itemLi.querySelector('.priceAndTotal___eEVS7 span')?.textContent;
    if (priceTxt) price = digitsFrom(priceTxt);
    if (!price) {
      const buyBtn = Array.from(itemLi.querySelectorAll('button[aria-label]')).find(b => (b.getAttribute('aria-label') || '').startsWith('Buy item '));
      const al = buyBtn?.getAttribute('aria-label') || '';
      const m = al.match(/\$([\d,]+)/);
      if (m) price = digitsFrom(m[1]);
    }

    let sellerId = null;
    if (sellerLi) {
      const a = sellerLi.querySelector('a[href*="/profiles.php?XID="]');
      const href = a?.getAttribute('href') || '';
      const m = href.match(/XID=(\d+)/);
      if (m) sellerId = m[1];
    }

    const bonusIcons = Array.from(itemLi.querySelectorAll('.bonuses___a8gmz i[aria-label]'));
    const parsed = bonusIcons.map(i => {
      const al = i.getAttribute('aria-label') || '';
      const mm = al.match(/^(.+?)\s+bonus\s+(\d+(?:\.\d+)?)%/i);
      if (!mm) return { name: 'none', val: 0 };
      return { name: String(mm[1] || '').trim() || 'none', val: Math.round(parseFloat(mm[2] || '0')) || 0 };
    });

    const b1 = parsed[0] || { name: 'none', val: 0 };
    const b2 = parsed[1] || { name: 'none', val: 0 };

    if (!Number.isFinite(dmg) || !Number.isFinite(acc) || !price || !sellerId) return null;

    return `/rw-watch wep:${wep} bonus1:${b1.name} value1:${b1.val} bonus2:${b2.name} value2:${b2.val} dmg:${dmg.toFixed(2)} acc:${acc.toFixed(2)} price:${price} seller-id:${sellerId}`;
  };

  const ensureInjectedAbove = (sellerLi) => {
    if (!sellerLi?.parentElement) return;
    const prev = sellerLi.previousElementSibling;
    if (prev && prev.classList && prev.classList.contains('tif-injectedWrapper')) return;

    const li = document.createElement('li');
    li.className = 'tif-injectedWrapper';

    const row = document.createElement('div');
    row.className = 'tif-injectedRow';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tif-injectedBtn';
    btn.textContent = 'Get item info';

    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      setVisible(true);

      const line = buildRwWatch(btn);
      if (!line) {
        outBox.textContent = 'Could not read item info.';
        return;
      }

      outBox.textContent = line;
      await copyToClipboard(line);
    });

    row.appendChild(btn);
    li.appendChild(row);
    sellerLi.parentElement.insertBefore(li, sellerLi);
  };

  const cleanupOrphans = () => {
    const injected = document.querySelectorAll('li.tif-injectedWrapper');
    for (const li of injected) {
      const next = li.nextElementSibling;
      if (!isSellerListWrapper(next)) li.remove();
    }
  };

  const scanAndInject = () => {
    const sellers = document.querySelectorAll('li[class*="sellerListWrapper"]');
    for (const s of sellers) ensureInjectedAbove(s);
    cleanupOrphans();
  };

  scanAndInject();

  const mo = new MutationObserver((mutations) => {
    let touched = false;

    for (const m of mutations) {
      if (m.type !== 'childList') continue;

      for (const n of m.addedNodes) {
        if (n?.nodeType !== 1) continue;
        if (n.tagName === 'LI' && isSellerListWrapper(n)) {
          ensureInjectedAbove(n);
          touched = true;
        } else {
          const inner = n.querySelector?.('li[class*="sellerListWrapper"]');
          if (inner) {
            ensureInjectedAbove(inner);
            touched = true;
          }
        }
      }

      for (const n of m.removedNodes) {
        if (n?.nodeType !== 1) continue;
        if (n.tagName === 'LI' && (n.className || '').includes('sellerListWrapper')) touched = true;
        else if (n.querySelector?.('li[class*="sellerListWrapper"]')) touched = true;
      }
    }

    if (touched) cleanupOrphans();
  });

  mo.observe(document.body, { childList: true, subtree: true });
})();
