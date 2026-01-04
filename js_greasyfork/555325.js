// ==UserScript==
// @name         Google Site Restrictor (SS64/Microsoft/VMware)
// @namespace    https://github.com/SeppeHeyvaert
// @version      2.0.0
// @description  Alleen resultaten van ss64.com, microsoft.com en vmware.com tonen (met toggle).
// @author       SeppeHeyvaert
// @match        https://www.google.com/*
// @match        https://www.google.*/*
// @match        https://google.com/*
// @match        https://google.be/*
// @match        https://www.google.be/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/555325/Google%20Site%20Restrictor%20%28SS64MicrosoftVMware%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555325/Google%20Site%20Restrictor%20%28SS64MicrosoftVMware%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ---------- Config ---------- */
  const DOMAINS = ['ss64.com', 'microsoft.com', 'vmware.com'];
  const FILTER_STRING = '(site:ss64.com OR site:microsoft.com OR site:vmware.com)';
  const STATE_KEY = 'gsr_enabled';

  /* ---------- State & Menu ---------- */
  let enabled = GM_getValue(STATE_KEY, true);

  function updateMenu() {
    GM_registerMenuCommand(
      `Google Site Restrictor: ${enabled ? 'UIT' : 'AAN'} zetten`,
      () => {
        enabled = !enabled;
        GM_setValue(STATE_KEY, enabled);
        console.log('[GSR] Enabled =', enabled);
        // Bij togglen: herfilter DOM, maar query niet herschrijven om flikkeren te beperken
        filterResults();
        markActive();
      },
      { id: 'gsrToggle', autoReload: false }
    );
  }

  updateMenu();

  /* ---------- Helpers ---------- */
  const hasOurFilter = (q) => {
    if (!q) return false;
    const lc = q.toLowerCase();
    return lc.includes('site:ss64.com') ||
           lc.includes('site:microsoft.com') ||
           lc.includes('site:vmware.com');
  };

  function addFilter(q) {
    q = (q || '').trim();
    if (hasOurFilter(q)) return q;
    return q.length ? `${q} ${FILTER_STRING}` : FILTER_STRING;
  }

  function isAllowedHost(host) {
    return DOMAINS.some(d => host === d || host.endsWith('.' + d));
  }

  function realHref(href) {
    try {
      if (href.startsWith('/url?')) {
        const sp = new URLSearchParams(href.slice(5));
        return sp.get('q') || sp.get('url') || href;
      }
      return href;
    } catch {
      return href;
    }
  }

  function hostFrom(href) {
    try {
      return new URL(href, location.origin).hostname || '';
    } catch {
      return '';
    }
  }

  function markActive() {
    document.documentElement.setAttribute('data-gsr-active', enabled ? '1' : '0');
  }

  function injectStyle() {
    if (document.getElementById('gsr-style')) return;
    const st = document.createElement('style');
    st.id = 'gsr-style';
    st.textContent = `
      html[data-gsr-active="1"] .gsr-hide { display: none !important; }
    `;
    document.documentElement.appendChild(st);
  }

  /* ---------- Query Restrict ---------- */
  function restrictQueryIfNeeded() {
    if (!enabled) return;
    try {
      const url = new URL(location.href);
      if (!url.pathname.startsWith('/search')) return;
      const q = url.searchParams.get('q') || '';
      if (!hasOurFilter(q)) {
        url.searchParams.set('q', addFilter(q));
        // echte navigatie zodat Google de filter gebruikt
        location.replace(url.toString());
      }
    } catch {}
  }

  /* ---------- DOM Filtering ---------- */
  function resultCards() {
    // H3 elementen binnen links zijn stabiel genoeg
    const h3s = [...document.querySelectorAll('#search h3, #rso h3')];
    return h3s.map(h3 => h3.closest('a[href]')).filter(Boolean);
  }

  function filterResults() {
    const links = resultCards();
    for (const a of links) {
      const href = realHref(a.getAttribute('href') || '');
      const host = hostFrom(href);
      const card =
        a.closest('div.g') ||
        a.closest('div.MjjYud') ||
        a.closest('div.yuRUbf') ||
        a.closest('div[data-hveid]') ||
        a.closest('div[jsname]') ||
        a.closest('div');

      if (!card) continue;

      if (enabled) {
        if (!isAllowedHost(host)) {
          card.classList.add('gsr-hide');
        } else {
          card.classList.remove('gsr-hide');
        }
      } else {
        card.classList.remove('gsr-hide');
      }
    }
  }

  /* ---------- Form Hook ---------- */
  function hookForms() {
    document.addEventListener('submit', e => {
      if (!enabled) return;
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      const action = form.getAttribute('action') || '';
      if (!/\/search/i.test(action)) return;
      const qInput = form.querySelector('input[name="q"], textarea[name="q"]');
      if (qInput) {
        qInput.value = addFilter(qInput.value);
      }
    }, true);
  }

  /* ---------- History Hook (SPA navigaties) ---------- */
  function hookHistory() {
    const wrap = m => {
      const orig = history[m];
      return function () {
        const r = orig.apply(this, arguments);
        queueMicrotask(() => {
          restrictQueryIfNeeded();
          filterResults();
        });
        return r;
      };
    };
    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');
    window.addEventListener('popstate', () => {
      restrictQueryIfNeeded();
      filterResults();
    });
  }

  /* ---------- Mutation Observer ---------- */
  function observe() {
    const mo = new MutationObserver(filterResults);
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  /* ---------- Init ---------- */
  function init() {
    injectStyle();
    markActive();
    restrictQueryIfNeeded();
    filterResults();
  }

  hookForms();
  hookHistory();
  observe();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();