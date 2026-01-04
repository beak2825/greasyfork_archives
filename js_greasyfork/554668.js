// ==UserScript==
// @name         PCGamingWiki — Table of Contents
// @namespace    https://www.pcgamingwiki.com/
// @version      1.0
// @description  Adds a table of contents (TOC) to PCGamingWiki articles, Wikipedia style (collapsible, anchored links, highlighting of the active section).
// @author       ChatGPT
// @match        https://www.pcgamingwiki.com/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554668/PCGamingWiki%20%E2%80%94%20Table%20of%20Contents.user.js
// @updateURL https://update.greasyfork.org/scripts/554668/PCGamingWiki%20%E2%80%94%20Table%20of%20Contents.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Config ----------
  const MIN_HEADINGS = 2;
  const TOC_ID = 'pcgw-toc';
  const TOC_BTN_ID = 'pcgw-toc-btn';
  const STORAGE_KEY = 'pcgw_toc_open_v1'; // global state persistence
  const MOBILE_BREAKPOINT = 920;
  const TOC_FONT_PX = 14;
  const TOC_WIDTH_PX = 300;
  const TOP_GAP_PX = 56;
  const SELECTOR_CANDIDATES = [
    '#mw-content-text',
    '.mw-parser-output',
    '#content',
    '.page-content',
    '#bodyContent'
  ];
  // ------------------------------

  // Find the main content node
  function findContentNode() {
    for (const s of SELECTOR_CANDIDATES) {
      const el = document.querySelector(s);
      if (el) return el;
    }
    return document.body;
  }

  // Retrieve titles (without “edit”)
  function collectHeadings(root) {
    const all = Array.from(root.querySelectorAll('h2,h3,h4,h5,h6'));
    return all
      .filter(h => h.textContent && h.textContent.trim().length > 0)
      .map(h => {
        const level = parseInt(h.tagName.slice(1), 10);
        const clone = h.cloneNode(true);
        clone.querySelectorAll('.mw-editsection, .editsection, .mw-editsection-like').forEach(e => e.remove());
        const inner = clone.querySelector('.mw-headline');
        const text = (inner ? inner.textContent : clone.textContent).trim();
        return { el: h, level, text };
      })
      .filter(h => h.level >= 2 && h.level <= 6 && h.text.length > 0);
  }

  // Ensure unique IDs
  function ensureIds(headings) {
    const used = new Set();
    function slugify(t) {
      let s = (t && t.normalize) ? t.normalize('NFKD').replace(/[\u0300-\u036f]/g, '') : String(t || '');
      s = s.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
      if (!s) s = 'section';
      let base = s, i = 1;
      while (used.has(s) || document.getElementById(s)) {
        s = base + '-' + i++;
      }
      used.add(s);
      return s;
    }
    headings.forEach(h => {
      const inner = h.el.querySelector('.mw-headline');
      if (inner && inner.id) {
        h.el.id = inner.id;
      }
      if (!h.el.id) {
        h.el.id = slugify(h.text);
      } else {
        h.el.id = h.el.id.trim().replace(/\s+/g, '-');
        if (used.has(h.el.id)) h.el.id = slugify(h.text);
        else used.add(h.el.id);
      }
      h.id = h.el.id;
    });
  }

  // Build TOC with +/- buttons for sublists
  function buildTOC(headings) {
    const nav = document.createElement('nav');
    nav.id = TOC_ID;
    nav.setAttribute('aria-label', 'Table of contents');

    // header inside TOC (title + close icon for mobile)
    const header = document.createElement('div');
    header.className = 'pcgw-toc-header';

    const title = document.createElement('div');
    title.className = 'pcgw-toc-title';
    title.textContent = 'Table of contents';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'pcgw-toc-close';
    closeBtn.title = 'Fermer';
    closeBtn.innerHTML = '✕';

    header.appendChild(title);
    header.appendChild(closeBtn);
    nav.appendChild(header);

    const ol = document.createElement('ol');
    ol.className = 'pcgw-toc-list';
    nav.appendChild(ol);

    // Construire des listes imbriquées avec une pile
    const stack = [{ level: 1, node: ol }];
    headings.forEach((h, idx) => {
      const effective = Math.min(4, Math.max(2, h.level)); // 2..4
      while (stack.length && stack[stack.length - 1].level >= effective) stack.pop();
      const parent = stack[stack.length - 1].node;
      const li = document.createElement('li');
      li.className = 'pcgw-toc-item pcgw-level-' + (effective - 1);
      li.dataset.index = (idx + 1);

      const wrapper = document.createElement('div');
      wrapper.className = 'pcgw-item-wrapper';

      // placeholder for collapse button if sublist exists — we'll add after building children
      const link = document.createElement('a');
      link.href = '#' + h.id;
      link.textContent = h.text;
      link.className = 'pcgw-toc-link';
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(h.id);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 18;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        // IMPORTANT: do not close the TOC automatically (requested behavior)

      });

      wrapper.appendChild(link);
      li.appendChild(wrapper);
      parent.appendChild(li);

      const sub = document.createElement('ol');
      sub.className = 'pcgw-toc-sublist';
      li.appendChild(sub);

      stack.push({ level: effective, node: sub });
    });

    // After construction: add +/- toggles to elements that have non-empty sublists
    Array.from(nav.querySelectorAll('.pcgw-toc-item')).forEach(li => {
      const sub = li.querySelector('.pcgw-toc-sublist');
      const wrapper = li.querySelector('.pcgw-item-wrapper');
      // if the sublist is not empty (may be empty if there are no children), add toggle
      if (sub && sub.children.length > 0) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pcgw-subtoggle';
        btn.setAttribute('aria-expanded', 'true'); // unfolded by default
        btn.title = 'Unfold / fold';
        btn.innerHTML = '−'; // minus for expanded
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = btn.getAttribute('aria-expanded') === 'true';
          if (isOpen) {
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '+';
            li.classList.add('pcgw-sub-collapsed');
          } else {
            btn.setAttribute('aria-expanded', 'true');
            btn.innerHTML = '−';
            li.classList.remove('pcgw-sub-collapsed');
          }
        });
        // Prepend button before link
        wrapper.insertBefore(btn, wrapper.firstChild);
      }
    });

    // closeBtn behavior (close only via button --> persists)
    closeBtn.addEventListener('click', () => {
      setStoredOpen(false);
      toggleTOC(false);
      updateTopButton(false);
    });

    return nav;
  }

  // Top button
  function ensureTopButton() {
    if (document.getElementById(TOC_BTN_ID)) return document.getElementById(TOC_BTN_ID);
    const btn = document.createElement('button');
    btn.id = TOC_BTN_ID;
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.title = 'Show / hide table of contents';
    btn.innerHTML = `<span class="pcgw-btn-icon" aria-hidden="true">📑</span><span class="pcgw-btn-label">Table of contents ▾</span>`;
    btn.addEventListener('click', () => {
      const open = !document.body.classList.contains('pcgw-toc-open');
      setStoredOpen(open);
      toggleTOC(open);
      btn.setAttribute('aria-expanded', String(open));
      const lbl = btn.querySelector('.pcgw-btn-label');
      if (lbl) lbl.textContent = open ? 'Table of contents ▴' : 'Table of contents ▾';
    });
    document.body.appendChild(btn);
    return btn;
  }

  // Persistence
  function setStoredOpen(open) {
    try { localStorage.setItem(STORAGE_KEY, open ? '1' : '0'); } catch (e) {}
  }
  function getStoredOpen(defaultOpen = true) {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === '1') return true;
      if (v === '0') return false;
      return defaultOpen;
    } catch (e) { return defaultOpen; }
  }

  function updateTopButton(open) {
    const btn = document.getElementById(TOC_BTN_ID);
    if (!btn) return;
    btn.setAttribute('aria-expanded', String(open));
    const lbl = btn.querySelector('.pcgw-btn-label');
    if (lbl) lbl.textContent = open ? 'Table of contents ▴' : 'Table of contents ▾';
  }

  function toggleTOC(open) {
    if (open) document.body.classList.add('pcgw-toc-open');
    else document.body.classList.remove('pcgw-toc-open');
  }

  // Insert TOC and initialize state (open by default but persistent)
  function insertTOC(toc) {
    const old = document.getElementById(TOC_ID);
    if (old) old.remove();
    document.body.appendChild(toc);
    ensureTopButton();

    const stored = getStoredOpen(true);
    toggleTOC(stored);
    updateTopButton(stored);

    // IMPORTANT: Remove the click closure outside the panel and ESC — closure only via the button / closeBtn
    // => No global click/keydown handler to close the TOC is added.
  }
  // Styles (including +/- buttons, hanging numbers, responsive)
  function styleTOC() {
    if (document.getElementById('pcgw-toc-style')) return;
    const css = `
:root {
  --pcgw-toc-font: ${TOC_FONT_PX}px;
  --pcgw-toc-width: ${TOC_WIDTH_PX}px;
  --pcgw-top-gap: ${TOP_GAP_PX}px;
}

/* Top button (neutral) */
#${TOC_BTN_ID} {
  position: fixed;
  top: 0;
  left: 0;
  height: 36px;
  line-height: 36px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98));
  color: #222;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-right: 1px solid rgba(0,0,0,0.06);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  z-index: 120000;
  border-radius: 0 0 6px 0;
}
#${TOC_BTN_ID}:hover { background: linear-gradient(180deg,#fff,#fbfdff); }

/* TOC panel */
#${TOC_ID} {
  position: fixed;
  left: 8px;
  top: var(--pcgw-top-gap);
  width: var(--pcgw-toc-width);
  max-height: calc(100vh - (var(--pcgw-top-gap) + 16px));
  overflow: auto;
  background: #ffffffdd;
  border: 1px solid rgba(0,0,0,0.06);
  padding: 12px 14px;
  border-radius: 8px;
  box-shadow: 0 8px 28px rgba(3,10,25,0.06);
  z-index: 110000;
  font-size: var(--pcgw-toc-font);
  line-height: 1.45;
}

/* header inside */
.pcgw-toc-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.pcgw-toc-title { font-weight:700; color:#111; font-size:1em; }
.pcgw-toc-close { display:none; border:none; background:transparent; font-size:16px; cursor:pointer; }

/* Hanging numbers via counters */
#${TOC_ID} .pcgw-toc-list,
#${TOC_ID} .pcgw-toc-sublist {
  counter-reset: item;
  margin: 0;
  padding: 0;
  list-style: none;
}
#${TOC_ID} li {
  position: relative;
  display: block;
  margin: 0.28em 0;
  padding-left: 2.6em;
  min-height: 1.2em;
  box-sizing: border-box;
  word-break: break-word;
  white-space: normal;
}
#${TOC_ID} li::before {
  counter-increment: item;
  content: counter(item) ".";
  position: absolute;
  left: 0;
  top: 0;
  width: 2.2em;
  text-align: right;
  font-weight: 600;
  color: rgba(0,0,0,0.65);
  line-height: 1.45;
  padding-right: 0.35em;
  box-sizing: border-box;
  overflow: visible;
}
#${TOC_ID} .pcgw-level-2 { padding-left: 2.6em; }
#${TOC_ID} .pcgw-level-3 { padding-left: 3.4em; }
#${TOC_ID} .pcgw-level-4 { padding-left: 4.2em; }

/* link + wrapper */
.pcgw-item-wrapper { display: inline-flex; align-items: center; gap: 8px; }
.pcgw-subtoggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.9);
  border-radius: 3px;
  font-weight: 700;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
}
.pcgw-subtoggle:focus { outline: 2px solid rgba(0,0,0,0.12); }

/* collapsed sublist */
.pcgw-sub-collapsed > .pcgw-toc-sublist { display: none; }

/* links */
#${TOC_ID} a {
  color: inherit;
  text-decoration: none;
  display: inline-block;
  max-width: calc(var(--pcgw-toc-width) - 70px);
}
#${TOC_ID} a:hover { text-decoration: underline; color: #0645ad; }
#${TOC_ID} a.pcgw-toc-active { font-weight:700; text-decoration: underline; color: #003bb5; }

/* responsive: mobile slide-in */
@media (max-width: ${MOBILE_BREAKPOINT}px) {
  #${TOC_BTN_ID} { left: 6px; top: 6px; height: 40px; line-height: 40px; z-index:120000; }
  #${TOC_ID} {
    left: -120%;
    top: 0;
    width: 86%;
    height: 100vh;
    max-height: none;
    border-radius: 0;
    transition: left 260ms cubic-bezier(.2,.8,.2,1);
    padding-top: 18px;
  }
  body.pcgw-toc-open #${TOC_ID} { left: 0; }
  .pcgw-toc-close { display:inline-block; }
}

/* default: hide panel when closed (visibility controlled only by button or closeBtn) */
body:not(.pcgw-toc-open) #${TOC_ID} { display: none; }

/* tiny screens tweak */
@media (max-width: 420px) {
  :root { --pcgw-toc-font: 14px; }
  #${TOC_BTN_ID} { padding: 0 10px; font-size: 13px; }
}
`;
    const s = document.createElement('style');
    s.id = 'pcgw-toc-style';
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }

  // Highlighting the active section
  function activateOnScroll(headings) {
    const links = {};
    headings.forEach(h => {
      const a = document.querySelector(`#${TOC_ID} a[href="#${CSS.escape(h.id)}"]`);
      if (a) links[h.id] = a;
    });
    let last = null;
    function onScroll() {
      let current = null;
      const threshold = Math.max(100, Math.round(window.innerHeight * 0.12));
      for (let i = headings.length - 1; i >= 0; i--) {
        const h = headings[i];
        const rect = h.el.getBoundingClientRect();
        if (rect.top <= threshold) { current = h.id; break; }
      }
      if (!current && window.scrollY > 5 && headings.length) current = headings[0].id;
      if (current !== last) {
        if (last && links[last]) links[last].classList.remove('pcgw-toc-active');
        if (current && links[current]) links[current].classList.add('pcgw-toc-active');
        last = current;
      }
    }
    window.removeEventListener('scroll', window.__pcgw_toc_scroll_fn || onScroll);
    window.__pcgw_toc_scroll_fn = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(onScroll, 200);
  }

  // Build + observe
  function observeAndRun() {
    const content = findContentNode();
    if (!content) return;

    function attemptBuild() {
      const headings = collectHeadings(content);
      if (headings.length < MIN_HEADINGS) return null;
      ensureIds(headings);
      styleTOC();
      const toc = buildTOC(headings);
      insertTOC(toc);
      activateOnScroll(headings);
      return toc;
    }

    let tocNode = attemptBuild();

    const mo = new MutationObserver(() => {
      const current = collectHeadings(content);
      const need = current.length >= MIN_HEADINGS && (!document.getElementById(TOC_ID) || (tocNode && current.length !== tocNode.querySelectorAll('li').length));
      if (need) tocNode = attemptBuild();
    });
    mo.observe(content, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observeAndRun);
  else observeAndRun();

})();
