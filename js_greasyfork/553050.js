// ==UserScript==
// @name         Fab.com – Sort by Discount % + Min % Filter (live, React-safe)
// @namespace    https://yourscripts.example
// @version      2.0
// @description  Sort by discount and hide items below a threshold; applies to infinite scroll without breaking React.
// @match        https://www.fab.com/search*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553050/Fabcom%20%E2%80%93%20Sort%20by%20Discount%20%25%20%2B%20Min%20%25%20Filter%20%28live%2C%20React-safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553050/Fabcom%20%E2%80%93%20Sort%20by%20Discount%20%25%20%2B%20Min%20%25%20Filter%20%28live%2C%20React-safe%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Robust selectors ---
  const BADGE_SELECTOR = '.fabkit-Badge-label';                 // "-30%"
  const PRICE_NOW_SEL  = '.fabkit-Typography--intent-primary';  // current price
  const PRICE_OLD_SEL  = 'del, s';                              // compare-at
  const THUMB_SEL      = '.fabkit-Thumbnail-root, img';

  // --- tiny helpers ---
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const $  = (sel, root=document) => root.querySelector(sel);

  const parsePercent = (t) => {
    if (!t) return NaN;
    const m = (t+'').match(/-?\s*([\d.,]+)/);
    if (!m) return NaN;
    return Number(m[1].replace(/\./g,'').replace(',', '.'));
  };
  const parsePrice = (text) => {
    if (!text) return NaN;
    let s = (text+'').replace(/[^0-9.,\-]/g,'').trim();
    const c = s.includes(','), d = s.includes('.');
    if (c && d) {
      const lc = s.lastIndexOf(','), ld = s.lastIndexOf('.');
      s = lc > ld ? s.replace(/\./g,'').replace(',', '.') : s.replace(/,/g,'');
    } else if (c && !d) {
      const [a,b] = s.split(',');
      s = (b && b.length<=2) ? a.replace(/\./g,'') + '.' + b : s.replace(/,/g,'');
    } else {
      s = s.replace(/,/g,'');
    }
    const n = parseFloat(s);
    return isNaN(n) ? NaN : n;
  };

  // Walk up from a node (badge/price) to a stable card
  function cardFrom(node) {
    let el = node;
    for (let i=0; i<8 && el && el !== document.body; i++) {
      const hasBadge = el.querySelector?.(BADGE_SELECTOR);
      const hasPrice = el.querySelector?.(PRICE_NOW_SEL) || el.querySelector?.(PRICE_OLD_SEL);
      const hasThumb = el.querySelector?.(THUMB_SEL);
      if ((hasBadge || hasPrice) && hasThumb) return el;
      el = el.parentElement;
    }
    return node.closest?.('div, article, li') || node.parentElement;
  }

  function getAllCards() {
    const set = new Set();
    $$(BADGE_SELECTOR).forEach(b => set.add(cardFrom(b)));
    // include price-only cards
    $$(PRICE_NOW_SEL).forEach(p => set.add(cardFrom(p)));
    return Array.from(set).filter(Boolean);
  }

  function computeDiscount(card) {
    // 1) trust badge
    const badge = $(BADGE_SELECTOR, card);
    if (badge) {
      const pct = parsePercent(badge.textContent);
      if (!isNaN(pct)) return pct;
    }
    // 2) derive from prices
    const now = parsePrice($(PRICE_NOW_SEL, card)?.textContent || '');
    const old = parsePrice($(PRICE_OLD_SEL, card)?.textContent || '');
    if (!isNaN(now) && !isNaN(old) && old>0 && now<=old) {
      return Math.round(((old - now) / old) * 1000) / 10;
    }
    return NaN;
  }

  function annotate(cards) {
    cards.forEach((c, i) => {
      if (!c.hasAttribute('data-orig-index')) c.setAttribute('data-orig-index', String(i));
      const d = computeDiscount(c);
      if (!isNaN(d)) c.setAttribute('data-discount', String(d));
      else c.removeAttribute('data-discount');
    });
  }

  // --- State (persisted) ---
  const LS_KEY = 'fab_disc_settings_v16';
  const state = loadState() || { sort: 'none', minPct: 0, hideUnknown: false };
  function loadState() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || ''); } catch { return null; }
  }
  function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
  }

  // --- Visibility filtering ---
  function applyVisibilityToParent(parent) {
    const cards = getAllCards().filter(c => c.parentElement === parent);
    if (!cards.length) return;

    annotate(cards);

    cards.forEach(c => {
      const dAttr = c.getAttribute('data-discount');
      const d = dAttr == null ? NaN : Number(dAttr);
      const isUnknown = isNaN(d);
      const hide =
        (state.minPct > 0 && (isUnknown ? state.hideUnknown : d < state.minPct)) ||
        (state.minPct === 0 && state.hideUnknown && isUnknown);

      // Use visibility rather than display to be gentler with layout observers.
      // If you prefer full removal from flow, switch to display:none.
      c.style.display = hide ? 'none' : '';
    });
  }

  function applyVisibilityAll() {
    const parents = new Set(getAllCards().map(c => c.parentElement).filter(Boolean));
    parents.forEach(p => applyVisibilityToParent(p));
  }

  // --- Parent-scoped sorting (React-safe) ---
  function sortParent(parent, dir) {
    const cards = getAllCards().filter(c => c.parentElement === parent && c.style.display !== 'none');
    if (cards.length < 2) return;
    annotate(cards);

    const withDisc = cards
      .map(c => ({ c, d: Number(c.getAttribute('data-discount')) }))
      .filter(o => !isNaN(o.d));

    if (!withDisc.length) return;

    withDisc.sort((a,b) => dir==='asc' ? a.d - b.d : b.d - a.d);

    // Reinsert within the same parent (don’t disturb other siblings)
    for (let i = withDisc.length - 1; i >= 0; i--) {
      parent.insertBefore(withDisc[i].c, parent.firstChild);
    }
  }

  function sortAllParents(dir) {
    const parents = new Set(getAllCards().map(c => c.parentElement).filter(Boolean));
    parents.forEach(p => sortParent(p, dir));
  }

  function resetAllParents() {
    const parents = new Set(getAllCards().map(c => c.parentElement).filter(Boolean));
    parents.forEach(parent => {
      const cards = getAllCards().filter(c => c.parentElement === parent);
      const ordered = cards
        .map(c => ({ c, i: Number(c.getAttribute('data-orig-index')) }))
        .filter(o => !isNaN(o.i))
        .sort((a,b)=>a.i-b.i)
        .map(o=>o.c);
      ordered.forEach(c => parent.appendChild(c));
    });
  }

  // --- Floating UI ---
  let autoDot, minInput, hideChk, hideUnknownChk;
  function setMode(mode) {
    state.sort = mode; // 'none' | 'asc' | 'desc'
    if (autoDot) {
      autoDot.textContent = mode === 'none' ? 'Auto: off' : `Auto: ${mode === 'desc' ? 'high→low' : 'low→high'}`;
      autoDot.style.opacity = mode === 'none' ? '0.6' : '1';
    }
    saveState();
  }

  function reapplyAll() {
    applyVisibilityAll();
    if (state.sort !== 'none') sortAllParents(state.sort);
  }

  function makeToolbar() {
    if (document.querySelector('.__fabdisc_toolbar')) return;
    const bar = document.createElement('div');
    bar.className = '__fabdisc_toolbar';
    Object.assign(bar.style, {
      position: 'fixed', top: '88px', right: '16px',
      display: 'flex', gap: '8px', padding: '8px 10px',
      background: 'rgba(30,30,30,0.85)', color: '#fff',
      borderRadius: '12px', zIndex: 99999, boxShadow: '0 6px 20px rgba(0,0,0,.25)',
      alignItems: 'center', flexWrap: 'wrap'
    });
    const mkBtn = (t) => {
      const b = document.createElement('button');
      b.textContent = t;
      Object.assign(b.style, {
        cursor: 'pointer', padding: '6px 10px',
        borderRadius: '999px', border: '1px solid rgba(255,255,255,0.25)',
        background: 'transparent', color: '#fff', fontWeight: 700
      });
      b.onmouseenter = () => b.style.background = 'rgba(255,255,255,0.08)';
      b.onmouseleave = () => b.style.background = 'transparent';
      return b;
    };
    const bHi = mkBtn('Discount % ↓');
    const bLo = mkBtn('↑');
    const bReset = mkBtn('reset');

    autoDot = document.createElement('span');
    autoDot.style.fontSize = '12px';
    autoDot.style.opacity = '0.6';
    autoDot.textContent = 'Auto: off';

    // Min % filter controls
    const box = document.createElement('span');
    Object.assign(box.style, { display: 'inline-flex', gap: '6px', alignItems: 'center', marginLeft: '6px' });
    const lbl = document.createElement('label');
    lbl.textContent = 'Min %';
    lbl.style.fontSize = '12px';

    minInput = document.createElement('input');
    minInput.type = 'number';
    minInput.min = '0';
    minInput.max = '100';
    minInput.step = '1';
    minInput.value = String(state.minPct || 0);
    Object.assign(minInput.style, {
      width: '64px', padding: '4px 6px', borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.25)', background: 'transparent', color: '#fff'
    });

    hideChk = document.createElement('input');
    hideChk.type = 'checkbox';
    hideChk.checked = (state.minPct || 0) > 0;

    const hideLbl = document.createElement('label');
    hideLbl.textContent = 'Hide < X%';
    hideLbl.style.fontSize = '12px';

    hideUnknownChk = document.createElement('input');
    hideUnknownChk.type = 'checkbox';
    hideUnknownChk.checked = !!state.hideUnknown;

    const unkLbl = document.createElement('label');
    unkLbl.textContent = 'Hide “unknown”';
    unkLbl.style.fontSize = '12px';

    // Wire up actions
    bHi.onclick    = () => { setMode('desc'); sortAllParents('desc'); applyVisibilityAll(); };
    bLo.onclick    = () => { setMode('asc');  sortAllParents('asc');  applyVisibilityAll(); };
    bReset.onclick = () => {
      setMode('none');
      state.minPct = 0; minInput.value = '0'; hideChk.checked = false;
      state.hideUnknown = false; hideUnknownChk.checked = false;
      saveState();
      resetAllParents();
      applyVisibilityAll(); // clears any hiding
    };

    hideChk.onchange = () => {
      state.minPct = hideChk.checked ? Math.max(0, Math.min(100, Number(minInput.value || 0))) : 0;
      saveState(); reapplyAll();
    };
    minInput.onchange = () => {
      const v = Math.max(0, Math.min(100, Number(minInput.value || 0)));
      minInput.value = String(v);
      if (hideChk.checked || v === 0) {
        state.minPct = hideChk.checked ? v : 0;
        saveState(); reapplyAll();
      }
    };
    hideUnknownChk.onchange = () => {
      state.hideUnknown = !!hideUnknownChk.checked;
      saveState(); reapplyAll();
    };

    box.append(lbl, minInput, hideChk, hideLbl, hideUnknownChk, unkLbl);

    bar.append(bHi, bLo, bReset, autoDot, box);
    document.body.appendChild(bar);

    // initialize indicator from saved state
    setMode(state.sort);
    if (state.sort !== 'none') sortAllParents(state.sort);
    applyVisibilityAll();
  }

  // --- Live re-apply as new nodes mount ---
  const mo = new MutationObserver((muts) => {
    // When new items mount, always (1) annotate, (2) hide by filter, and (3) if sorting is on, sort within that parent.
    const parents = new Set();
    for (const m of muts) {
      m.addedNodes && m.addedNodes.forEach(n => {
        if (!(n instanceof HTMLElement)) return;
        const candidate = n.matches?.(BADGE_SELECTOR+','+PRICE_NOW_SEL) ? n : n.querySelector?.(BADGE_SELECTOR+','+PRICE_NOW_SEL);
        if (candidate) {
          const card = cardFrom(candidate);
          if (card && card.parentElement) parents.add(card.parentElement);
        }
        if (n.querySelector?.(BADGE_SELECTOR+','+PRICE_NOW_SEL)) {
          const cards = getAllCards().filter(c => c.parentElement);
          cards.forEach(c => parents.add(c.parentElement));
        }
      });
    }
    if (!parents.size) return;
    clearTimeout(mo._t);
    mo._t = setTimeout(() => {
      parents.forEach(p => {
        applyVisibilityToParent(p);
        if (state.sort !== 'none') sortParent(p, state.sort);
      });
    }, 60);
  });

  function start() {
    makeToolbar();
    annotate(getAllCards());  // primes data-discount
    applyVisibilityAll();
    if (state.sort !== 'none') sortAllParents(state.sort);
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
