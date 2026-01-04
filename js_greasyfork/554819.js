// ==UserScript==
// @name         AutoPager — Universal (English, Heuristic, Cool UI)
// @namespace    https://archangel.tools/autopager-universal
// @version      1.0.2
// @description  Heuristic infinite-scroll autopager with a compact control panel. Works on most sites via rel=next/link/button detection. Includes per-site toggle, pause, and custom rules. No external CDNs. Firefox + Tampermonkey.
// @author       Archangel+GPT
// @match        *://*/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554819/AutoPager%20%E2%80%94%20Universal%20%28English%2C%20Heuristic%2C%20Cool%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554819/AutoPager%20%E2%80%94%20Universal%20%28English%2C%20Heuristic%2C%20Cool%20UI%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ------------------------------
  // Utilities
  // ------------------------------
  const HOST = location.hostname;
  const KEY = (suffix) => `APU__${HOST}__${suffix}`;
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const qs = (sel, root=document) => root.querySelector(sel);
  const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el.addEventListener(ev, fn, opts);
  const off = (el, ev, fn, opts) => el.removeEventListener(ev, fn, opts);
  const log = (...args) => console.log('%c[AutoPager-Universal]', 'color:#7dd3fc;font-weight:700;', ...args);

  // Persist helpers
  const store = {
    get(k, d){ try { const v = GM_getValue(k); return (v===undefined?d:v); } catch{ return d; } },
    set(k, v){ try { GM_setValue(k, v); } catch{} }
  };

  const state = {
    enabled: store.get(KEY('enabled'), true),
    paused:  false,
    page:    1,
    busy:    false,
    nextURL: null,
    mode:    'auto', // 'auto' | 'link' | 'button'
    bottomThreshold: store.get(KEY('threshold'), 2000),
    lastAppendSel: null,
  };

  // Optional user custom rules (edit here if you want site-specific selectors).
  // Example:
  // { host: /example\.com$/, pager: { nextL: 'a[rel=next]', pageE: '.post', replaceE: '.pagination' } }
  const CUSTOM_RULES = [
    // { host: /example\.com$/, pager: { nextL: 'a[rel=next]', pageE: 'article.post', replaceE: '.pagination' } },
  ];

  // ------------------------------
  // UI
  // ------------------------------
  const ui = {
    el: null,
    count: null,
    toggle: null,
    pause: null,
    mode: null,
    thresholdInput: null,
  };

  GM_addStyle(`
    .apu-wrap {
      position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
      background: rgba(18, 18, 18, .92); color: #e5e7eb; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial;
      border: 1px solid rgba(255,255,255,.08); border-radius: 12px; padding: 10px 12px; box-shadow: 0 10px 30px rgba(0,0,0,.35);
      min-width: 240px; max-width: 320px; backdrop-filter: blur(4px);
    }
    .apu-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .apu-title { font-weight: 700; letter-spacing:.2px; font-size: 13px; color: #93c5fd; }
    .apu-badge { font-size: 12px; padding: 2px 8px; border-radius: 999px; background: #0b1220; border: 1px solid #1f2937; color: #93c5fd; }
    .apu-btn {
      cursor: pointer; user-select: none; border: 1px solid #374151; background: #111827; color: #e5e7eb; padding: 6px 10px;
      border-radius: 8px; font-size: 12px; line-height: 1; transition: .15s transform, .15s background;
    }
    .apu-btn:hover { background: #0f172a; transform: translateY(-1px); }
    .apu-btn[aria-pressed="true"] { background: #0b3b1c; border-color: #14532d; color: #d1fae5; }
    .apu-row + .apu-row { margin-top: 8px; }
    .apu-input { width: 72px; background: #0b1220; border: 1px solid #1f2937; border-radius: 6px; color: #e5e7eb; padding: 4px 6px; font-size: 12px; }
    .apu-mode { display: inline-flex; gap: 4px; }
    .apu-link { color: #93c5fd; text-decoration: underline; cursor: pointer; }
  `);

  function makeUI() {
    const el = document.createElement('div');
    el.className = 'apu-wrap';
    el.innerHTML = `
      <div class="apu-row">
        <div class="apu-title">AutoPager — Universal</div>
        <div class="apu-badge" id="apuCount">Page ${state.page}</div>
      </div>
      <div class="apu-row">
        <button class="apu-btn" id="apuToggle" aria-pressed="${state.enabled}">${state.enabled ? 'Enabled' : 'Disabled'}</button>
        <button class="apu-btn" id="apuPause" aria-pressed="${state.paused}">${state.paused ? 'Resume' : 'Pause'}</button>
        <div class="apu-mode">
          <button class="apu-btn" data-mode="auto">Auto</button>
          <button class="apu-btn" data-mode="link">Link</button>
          <button class="apu-btn" data-mode="button">Button</button>
        </div>
      </div>
      <div class="apu-row">
        <span>Trigger:</span>
        <input class="apu-input" id="apuThresh" type="number" min="200" step="200" value="${state.bottomThreshold}"/>
        <span>px to bottom</span>
      </div>
      <div class="apu-row" style="opacity:.8;font-size:12px;">
        <span class="apu-link" id="apuForceLoad">Force next</span>
        <span>&nbsp;·&nbsp;</span>
        <span class="apu-link" id="apuWhere">What will load?</span>
      </div>
    `;
    document.documentElement.appendChild(el);
    ui.el = el;
    ui.count = qs('#apuCount', el);
    ui.toggle = qs('#apuToggle', el);
    ui.pause = qs('#apuPause', el);
    ui.mode = qsa('.apu-mode .apu-btn', el);
    ui.thresholdInput = qs('#apuThresh', el);

    on(ui.toggle, 'click', () => {
      state.enabled = !state.enabled;
      store.set(KEY('enabled'), state.enabled);
      ui.toggle.setAttribute('aria-pressed', String(state.enabled));
      ui.toggle.textContent = state.enabled ? 'Enabled' : 'Disabled';
      if (state.enabled) maybeKickoff();
    });

    on(ui.pause, 'click', () => {
      state.paused = !state.paused;
      ui.pause.setAttribute('aria-pressed', String(state.paused));
      ui.pause.textContent = state.paused ? 'Resume' : 'Pause';
    });

    ui.mode.forEach(btn => {
      if (btn.dataset.mode === state.mode) btn.setAttribute('aria-pressed','true');
      on(btn, 'click', () => {
        state.mode = btn.dataset.mode;
        ui.mode.forEach(b => b.removeAttribute('aria-pressed'));
        btn.setAttribute('aria-pressed','true');
      });
    });

    on(ui.thresholdInput, 'change', () => {
      let v = parseInt(ui.thresholdInput.value, 10);
      if (Number.isNaN(v) || v < 200) v = 200;
      state.bottomThreshold = v;
      store.set(KEY('threshold'), v);
    });

    on(qs('#apuForceLoad', el), 'click', () => tryLoad());
    on(qs('#apuWhere', el), 'click', explainDetection);
  }

  function updateCount() {
    ui.count.textContent = `Page ${state.page}`;
  }

  // ------------------------------
  // Detection & Rules
  // ------------------------------

  function matchCustomRule() {
    for (const rule of CUSTOM_RULES) {
      const hostOk = (typeof rule.host === 'string' ? location.hostname.endsWith(rule.host) : rule.host.test(location.hostname));
      if (hostOk) return rule;
    }
    return null;
  }

  function detectNextLink(doc = document) {
    // 1) rel=next (link or a)
    let linkRel = qs('link[rel=next i]', doc)?.href || qs('a[rel=next i]', doc)?.href;
    if (linkRel) return new URL(linkRel, location.href).href;

    // 2) pagination anchors that look like "Next"/">"
    const NEXT_TEXT = [
      'next','older','more','load more','show more','更多','下一页','下页','次へ','suivant','weiter','siguiente','próximo'
    ];
    const anchors = qsa('a[href]', doc);
    for (const a of anchors) {
      const t = (a.innerText || a.title || '').trim().toLowerCase();
      if (!t) continue;
      if (NEXT_TEXT.some(x => t === x || t.startsWith(x))) {
        return new URL(a.href, location.href).href;
      }
      // arrows or »
      if (/[>»]|→/.test(t) && a.closest('.pagination, .pager, nav[role="navigation"], .page-nav, .pagenavi')) {
        return new URL(a.href, location.href).href;
      }
    }
    return null;
  }

  function detectLoadMoreButton(doc = document) {
    const BTN_SEL = [
      '.load-more','.load_more','#load-more','#load_more','[id^="loadmore"]',
      '.show-more','.show_more','button[aria-label*="Load more" i]','button:is([data-load-more],[data-action="load-more"])',
      'button:has(+ .loading)', 'button:has(span:matches-css-before(content: "more"))'
    ].join(',');
    const candidates = qsa(BTN_SEL, doc).filter(b => b.offsetWidth > 0 && b.offsetHeight > 0);
    return candidates[0] || null;
  }

  function detectContentContainer(doc = document) {
    // Prefer semantic containers first
    const PREF = [
      'main','#main','#content','[role="main"]','.content','.contents','.container .content','.container main',
      '.posts','.post-list','.results','.search-results','.articles','.article-list','.items','.item-list',
      'ul.posts','ul.results','ul.items','ol.items','.infinite-scroll','section[aria-label*="results" i]'
    ];
    // pick the one with most children & significant height
    let best = null; let bestScore = -1;
    for (const sel of PREF) {
      const el = qs(sel, doc);
      if (!el) continue;
      const children = [...el.children].filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE');
      const score = Math.min(children.length, 200) + Math.min(el.clientHeight / 100, 100);
      if (children.length >= 3 && el.clientHeight > 200 && score > bestScore) {
        best = el; bestScore = score; state.lastAppendSel = sel;
      }
    }
    // Fallback: largest list/grid
    if (!best) {
      const candidates = qsa('main, #main, #content, [role="main"], .content, .posts, .results, .list, .grid, .container');
      for (const el of candidates) {
        if (!el) continue;
        const c = [...el.children].filter(n => n.tagName !== 'SCRIPT' && n.tagName !== 'STYLE');
        if (c.length >= 3 && el.clientHeight > 200) { best = el; state.lastAppendSel = guessSelector(el); break; }
      }
    }
    return best || document.body;
  }

  function guessSelector(el) {
    if (!el) return null;
    if (el.id) return `#${CSS.escape(el.id)}`;
    const cls = (el.className || '').toString().trim().split(/\s+/).filter(Boolean);
    if (cls.length) return '.' + cls.map(c => CSS.escape(c)).join('.');
    return el.tagName.toLowerCase();
  }

  function fixLazyImages(root) {
    const imgs = qsa('img', root);
    for (const img of imgs) {
      const src = img.getAttribute('data-src') || img.getAttribute('data-lazy') || img.getAttribute('data-original');
      if (src && !img.src) img.src = src;
      // common attribute permutations
      for (const k of ['data-srcset','data-sizes']) {
        const v = img.getAttribute(k);
        if (v) img.setAttribute(k.replace('data-',''), v);
      }
      // remove loading=lazy to avoid deferring forever
      img.removeAttribute('loading');
    }
  }

  // ------------------------------
  // Core loading
  // ------------------------------
  async function tryLoad() {
    if (!state.enabled || state.paused || state.busy) return;
    state.busy = true;
    try {
      const rule = matchCustomRule();
      if (rule?.pager?.nextL) {
        // explicit rule path (link mode only)
        if (!state.nextURL) {
          state.nextURL = resolveNext(rule.pager.nextL, document);
        }
        if (!state.nextURL) return log('No next URL (custom rule).');
        await loadByLink(state.nextURL, rule.pager.pageE);
      } else if (state.mode === 'button') {
        const btn = detectLoadMoreButton();
        if (!btn) return log('Button mode: no visible load-more button.');
        btn.click();
        state.page += 1; updateCount();
      } else {
        // auto/link hybrid
        const btn = detectLoadMoreButton();
        if (btn && state.mode !== 'link') {
          btn.click(); // some sites auto-insert; easy path
          state.page += 1; updateCount();
        } else {
          if (!state.nextURL) state.nextURL = detectNextLink();
          if (!state.nextURL) return log('No next URL detected.');
          await loadByLink(state.nextURL);
        }
      }
    } catch (e) {
      console.error('[AutoPager-Universal] load error:', e);
    } finally {
      state.busy = false;
    }
  }

  function resolveNext(selOrXPath, doc) {
    if (selOrXPath.startsWith('//')) {
      try {
        const r = doc.evaluate(selOrXPath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const a = r.singleNodeValue; if (!a) return null;
        return new URL(a.href || a.getAttribute('href'), location.href).href;
      } catch { return null; }
    } else {
      const el = qs(selOrXPath, doc);
      if (!el) return null;
      const href = el.href || el.getAttribute('href');
      return href ? new URL(href, location.href).href : null;
    }
  }

  async function loadByLink(nextURL, explicitPageSel = null) {
    log('Fetching next page:', nextURL);
    const html = await fetchHTML(nextURL);
    if (!html) { log('No HTML fetched.'); return; }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    // compute new-next for subsequent loads
    state.nextURL = detectNextLink(doc);

    const hostContainer = detectContentContainer(document);
    const newContainer = explicitPageSel ? (explicitPageSel.startsWith('//')
        ? (doc.evaluate(explicitPageSel, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue || detectContentContainer(doc))
        : (qs(explicitPageSel, doc) || detectContentContainer(doc))) : detectContentContainer(doc);

    const items = [...newContainer.children].filter(n => n.tagName !== 'SCRIPT' && n.tagName !== 'STYLE');
    if (!items.length) { log('No items detected to append; appending raw main content.'); }

    const fragment = document.createDocumentFragment();
    for (const node of (items.length ? items : [...newContainer.childNodes])) {
      fragment.appendChild(node.cloneNode(true));
    }

    fixLazyImages(fragment);
    hostContainer.appendChild(fragment);

    state.page += 1;
    updateCount();

    // Update history (best effort)
    try { history.pushState({}, '', nextURL); document.title = document.title.replace(/\s*\(\d+\)\s*$/, '') + ` (${state.page})`; } catch {}

    log('Appended items:', items.length, 'Next URL:', state.nextURL || 'none');
  }

  function fetchHTML(url) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { 'Accept': 'text/html,*/*;q=0.8' },
        timeout: 15000,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve(res.responseText);
          else resolve(null);
        },
        onerror: () => resolve(null),
        ontimeout: () => resolve(null),
      });
    });
  }

  // ------------------------------
  // Scroll observer
  // ------------------------------
  let io;
  function setupObserver() {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'height:1px;width:1px;';
    document.body.appendChild(sentinel);

    io = new IntersectionObserver(async (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const dist = (document.documentElement.scrollHeight - (window.scrollY + window.innerHeight));
        if (dist <= state.bottomThreshold) {
          await tryLoad();
        }
      }
    }, { root: null, rootMargin: '0px 0px 0px 0px', threshold: 0 });

    io.observe(sentinel);
  }

  function maybeKickoff() {
    if (!state.enabled) return;
    // pre-warm next URL (cheap detection)
    state.nextURL = detectNextLink();
  }

  function explainDetection() {
    const btn = detectLoadMoreButton() ? 'Yes' : 'No';
    const next = state.nextURL || detectNextLink() || 'None detected';
    const cont = state.lastAppendSel || guessSelector(detectContentContainer()) || '(auto)';
    alert(
`AutoPager — What will load?

Load-more button present: ${btn}
Next URL (detected): ${next}
Append into: ${cont}

Mode: ${state.mode.toUpperCase()}
Threshold: ${state.bottomThreshold}px
Custom rules: ${CUSTOM_RULES.length ? 'Yes' : 'No'}

Tip: Switch mode to "Button" if a visible Load More exists; use "Link" if pages have rel=next; leave "Auto" to let me decide.`);
  }

  // ------------------------------
  // Init
  // ------------------------------
  function init() {
    makeUI();
    setupObserver();
    maybeKickoff();
    log('Initialized on', HOST, '— mode:', state.mode, '| threshold:', state.bottomThreshold);
  }

  // Run
  init();
})();
