// ==UserScript==
// @name         Scribd Bypass (domain switch only)
// @description  Adds a toolbar button that rewrites Scribd URL to scribd.vdownloaders.com and navigates there.
// @author       573dave
// @version      2.7
// @license      MIT
// @match        *://*.scribd.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @noframes
// @namespace https://greasyfork.org/users/1294930
// @downloadURL https://update.greasyfork.org/scripts/552066/Scribd%20Bypass%20%28domain%20switch%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552066/Scribd%20Bypass%20%28domain%20switch%20only%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ----- Styles -----
  GM_addStyle(`
    .sb-bar{position:fixed;top:0;left:50%;transform:translateX(-50%);
      display:flex;gap:6px;z-index:2147483646;background:rgba(255,255,255,.92);
      padding:6px 10px;border-radius:0 0 6px 6px;box-shadow:0 2px 6px rgba(0,0,0,.2);
      backdrop-filter:saturate(120%) blur(4px)}
    .sb-btn{font:12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
      padding:6px 10px;background:#FFC017;color:#111;border:none;border-radius:6px;
      cursor:pointer;transition:filter .2s}
    .sb-btn:hover{filter:brightness(.95)}
  `);

  // ----- Helpers -----
  const byId = (id) => document.getElementById(id);
  const create = (tag, props = {}, kids = []) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    for (const kid of kids) el.appendChild(kid);
    return el;
  };
  const waitDOM = () =>
    new Promise((r) => (document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', r, { once: true })
      : r()));

  // Build the toolbar if on a document-like page
  function mountBar() {
    if (byId('sb-bar')) return;

    // Only show on typical doc-like routes to avoid cluttering account/home pages
    const path = location.pathname;
    const looksDoc = /(\/(doc|document|presentation|book|read)\/\d+\/?)|(^\/read\/\d+)/i.test(path);
    if (!looksDoc) return;

    const bar = create('div', { id: 'sb-bar', class: 'sb-bar' });
    const dlBtn = create('button', {
      class: 'sb-btn',
      text: 'Download (switch domain)',
      onclick: () => {
        // Rewrite: https://www.scribd.com/<path>  ->  https://scribd.vdownloaders.com/<path>
        // Leave path & query intact; the downloader usually accepts the same structure.
        const u = new URL(location.href);
        u.protocol = 'https:'; // normalize
        u.hostname = 'scribd.vdownloaders.com';
        // Optional: remove marketing params if any (kept minimal)
        // u.searchParams.delete('utm_source'); u.searchParams.delete('utm_medium'); u.searchParams.delete('utm_campaign');

        location.assign(u.toString());
      },
    });

    bar.append(dlBtn);
    document.documentElement.appendChild(bar);
  }

  // Re-run when SPA navigation occurs
  function onURLChange(cb) {
    let last = location.href;
    const fire = () => {
      const now = location.href;
      if (now !== last) { last = now; cb(); }
    };
    const wrap = (prop) => {
      const orig = history[prop];
      return function () {
        const ret = orig.apply(this, arguments);
        fire();
        return ret;
      };
    };
    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');
    window.addEventListener('popstate', fire);
    // Lightweight observer as a fallback for dynamic DOM/router changes
    const mo = new MutationObserver(() => fire());
    mo.observe(document, { subtree: true, childList: true });
  }

  // Init
  (async () => {
    await waitDOM();
    mountBar();
    onURLChange(() => {
      // Remove prior bar if we left a doc page, then (re)mount if needed
      const old = byId('sb-bar'); if (old) old.remove();
      mountBar();
    });
  })();
})();
