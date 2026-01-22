// ==UserScript==
// @name         z-library - Copy book title
// @namespace    vm.zlibrary.sk.copytitle
// @version      1.0.6
// @description  Copy book title to clipboard in FF by right-clicking the title on list pages (not individual book pages).
// @match        *://z-library.sk/*
// @match        *://*.z-library.sk/*
// @match        https://z-library.ec/*
// @match        http://z-library.ec/*
// @grant        GM.setClipboard
// @grant        GM_setClipboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1lib.sk
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563458/z-library%20-%20Copy%20book%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/563458/z-library%20-%20Copy%20book%20title.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const TARGET_SELECTOR =
    'a.title, z-bookcard [slot="title"], .book-note-toggle, .book-note-toggle .text, z-cover[title], .tile .book-info .title';
  const TOAST_ID = 'vm-copytitle-toast';

  const style = document.createElement('style');
  style.textContent = `
    #${TOAST_ID}{
      position:fixed; left:12px; bottom:12px; z-index:2147483647;
      max-width:calc(100vw - 24px);
      background:rgba(0,0,0,.88); color:#fff;
      padding:8px 10px; border-radius:8px;
      font:15px/1.3 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
      pointer-events:none;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      opacity:0; transform:translateY(6px);
      transition:opacity 120ms ease, transform 120ms ease;
    }
    #${TOAST_ID}.vm-show{ opacity:1; transform:translateY(0); }
    a.title, z-bookcard [slot="title"], .book-note-toggle, .book-note-toggle .text, z-cover[title], .tile .book-info .title{ cursor: copy !important; }
  `;
  document.documentElement.appendChild(style);

  let toastEl = null;
  let toastTimer = null;

  function norm(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = TOAST_ID;
      document.documentElement.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('vm-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl && toastEl.classList.remove('vm-show'), 1400);
  }

  function slugToTitle(href) {
    const m = (href || '').match(/\/([^\/?#]+)\.html(?:[?#].*)?$/i);
    if (!m) return '';
    let s = decodeURIComponent(m[1]).replace(/[-_]+/g, ' ').trim();
    s = s.replace(/\b([ivxlcdm]+)\b/gi, (x) => x.toUpperCase());
    return s;
  }

  function getTitleFromZBookcard(card) {
    if (!card) return '';
    const slotTitle = card.querySelector('[slot="title"]');
    const t1 = norm(slotTitle && (slotTitle.innerText || slotTitle.textContent));
    if (t1) return t1;

    const t2 = norm(card.getAttribute('title'));
    if (t2) return t2;

    const t3 = slugToTitle(card.getAttribute('href') || '');
    return norm(t3);
  }

  function getTitleFromTileOrLink(a) {
    const tile = a.closest('.tile');

    if (tile) {
      const z = tile.querySelector('z-cover[title]');
      const t1 = norm(z && z.getAttribute('title'));
      if (t1) return t1;

      const anyTitleAttr = tile.querySelector('[title]');
      const t2 = norm(anyTitleAttr && anyTitleAttr.getAttribute('title'));
      if (t2) return t2;
    }

    const t3 = norm(a.getAttribute && (a.getAttribute('aria-label') || a.getAttribute('title')));
    if (t3) return t3;

    const t4 = norm(a.innerText || a.textContent);
    if (t4) return t4;

    const t5 = slugToTitle(a.getAttribute ? (a.getAttribute('href') || '') : '');
    return norm(t5);
  }

  async function copyTextForce(text) {
    const t = norm(text);
    if (!t) return { ok: false, why: 'empty' };

    try {
      if (typeof GM !== 'undefined' && GM && typeof GM.setClipboard === 'function') {
        await GM.setClipboard(t, 'text');
        return { ok: true, via: 'GM.setClipboard', text: t };
      }
    } catch (_) {}

    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(t, 'text');
        return { ok: true, via: 'GM_setClipboard', text: t };
      }
    } catch (_) {}

    try {
      const ta = document.createElement('textarea');
      ta.value = t;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) return { ok: true, via: 'execCommand', text: t };
    } catch (_) {}

    try {
      window.prompt('Copy title:', t);
      return { ok: true, via: 'prompt', text: t };
    } catch (_) {}

    return { ok: false, why: 'all methods failed' };
  }

  function getPathFromEvent(e) {
    return (typeof e.composedPath === 'function') ? e.composedPath() : null;
  }

  function closestFromEvent(e, selector) {
    const path = getPathFromEvent(e);
    if (path && path.length) {
      for (const n of path) {
        if (!n || n.nodeType !== 1) continue;
        if (n.matches && n.matches(selector)) return n;
        if (n.closest) {
          const c = n.closest(selector);
          if (c) return c;
        }
      }
    }
    const t = e.target;
    if (t && t.closest) return t.closest(selector);
    return null;
  }

  function extractTitleFromTile(tile) {
    if (!tile) return '';

    const z = tile.querySelector('z-cover[title]');
    const tz = norm(z && z.getAttribute('title'));
    if (tz) return tz;

    const noteText = tile.querySelector('.book-note-toggle .text');
    const nt = norm(noteText && (noteText.innerText || noteText.textContent));
    if (nt) return nt;

    const hrefA = tile.querySelector('a.planelink[href], a[href*="/book/"][href]');
    const ht = slugToTitle(hrefA ? hrefA.getAttribute('href') : '');
    return norm(ht);
  }

  function extractTitleFromElement(el) {
    if (!el) return '';

    const bookNote = el.closest && el.closest('.book-note');
    if (bookNote) {
      const noteTitle = bookNote.querySelector('.book-note-toggle .text');
      const nt = norm(noteTitle && (noteTitle.innerText || noteTitle.textContent));
      if (nt) return nt;
    }

    const noteToggle = (el.matches && el.matches('.book-note-toggle')) ? el : (el.closest && el.closest('.book-note-toggle'));
    if (noteToggle) {
      const noteText = noteToggle.querySelector('.text');
      const t0 = norm(noteText && (noteText.innerText || noteText.textContent));
      if (t0) return t0;
    }

    const zc = (el.matches && el.matches('z-cover[title]')) ? el : (el.closest && el.closest('z-cover[title]'));
    if (zc) {
      const t1 = norm(zc.getAttribute('title'));
      if (t1) return t1;
    }

    const tile = el.closest && el.closest('.tile');
    if (tile) {
      const tTile = extractTitleFromTile(tile);
      if (tTile) return tTile;
    }

    const card = el.closest && el.closest('z-bookcard');
    if (card) {
      const t2 = getTitleFromZBookcard(card);
      if (t2) return t2;
    }

    if (el.matches && el.matches('a.title')) return getTitleFromTileOrLink(el);

    const a = el.closest && el.closest('a.title');
    if (a) return getTitleFromTileOrLink(a);

    return norm(el.innerText || el.textContent);
  }

  document.addEventListener('contextmenu', async (e) => {
    const isBooklist = /^\/booklist\//i.test(location.pathname);

    // booklist/*: right-click usually targets elements that do NOT match the earlier selectors.
    // Copy title if the click happened anywhere inside a tile.
    if (isBooklist) {
      const tile = closestFromEvent(e, '.tile');
      if (!tile) return;

      if (e.shiftKey) {
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        else e.stopPropagation();
      }

      const title = extractTitleFromTile(tile);
      const res = await copyTextForce(title);

      if (res.ok) showToast(`Copied (${res.via}): ${res.text}`);
      else showToast(`Copy failed: ${res.why || 'unknown'}`);
      return;
    }

    // Existing behaviour for other pages
    const el = closestFromEvent(e, TARGET_SELECTOR);
    if (!el) return;

    if (e.shiftKey) {
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      else e.stopPropagation();
    }

    const title = extractTitleFromElement(el);
    const res = await copyTextForce(title);

    if (res.ok) showToast(`Copied (${res.via}): ${res.text}`);
    else showToast(`Copy failed: ${res.why || 'unknown'}`);
  }, true);
})();
