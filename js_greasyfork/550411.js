// ==UserScript==
// @name         CyPwn → LiveContainer Installer (iOS, modal-aware)
// @namespace    sharmanhall
// @version      0.3
// @description  Rewrite TrollStore installer links inside dynamic #modal_ts_* popups on ipa.cypwn.xyz to LiveContainer install scheme (continuous, SPA-safe).
// @author       sharmanhall
// @match        https://ipa.cypwn.xyz/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/550411/CyPwn%20%E2%86%92%20LiveContainer%20Installer%20%28iOS%2C%20modal-aware%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550411/CyPwn%20%E2%86%92%20LiveContainer%20Installer%20%28iOS%2C%20modal-aware%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- prefs ----
  const VERBOSE = true;                    // console logs
  const POLL_MS = 600;                     // periodic rescan interval
  const RENAME_BUTTON = true;              // change "TrollStore Direct" → "LiveContainer Install"
  const PATCH_GLOBAL_NAV = true;           // intercept window.open / location.assign / replace (safety net)
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (!isIOS) return;

  function log(...args){ if (VERBOSE) console.log('[LC-CyPwn]', ...args); }

  // apple-magnifier://install?url=https://ipa.cypwn.xyz/serve/get.php?md5=...
  //   → livecontainer://install?url=<percent-encoded IPA URL>
  function toLcInstallFromAppleMagnifier(urlLike) {
    try {
      const u = (urlLike instanceof URL) ? urlLike : new URL(urlLike);
      if (u.protocol !== 'apple-magnifier:' || u.pathname.replace(/^\//,'') !== 'install') return null;
      const ipaUrl = u.searchParams.get('url');
      if (!ipaUrl) return null;
      return `livecontainer://install?url=${encodeURIComponent(ipaUrl)}`;
    } catch {
      const s = String(urlLike || '');
      const m = s.match(/^apple-magnifier:\/\/install\?url=(.+)$/i);
      if (!m) return null;
      try {
        return `livecontainer://install?url=${encodeURIComponent(decodeURIComponent(m[1]))}`;
      } catch {
        return `livecontainer://install?url=${encodeURIComponent(m[1])}`;
      }
    }
  }

  // Core rewriter for a single <a>
  function rewriteAnchorToLC(a) {
    if (!a || a.dataset.lcCypwn === '1') return false;
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('apple-magnifier://install')) return false;
    const lc = toLcInstallFromAppleMagnifier(href);
    if (!lc) return false;

    a.setAttribute('href', lc);
    a.dataset.lcCypwn = '1';

    // Optional: rename visible label for clarity
    if (RENAME_BUTTON) {
      try {
        const icon = a.querySelector('iconify-icon');
        a.textContent = '';            // clear label
        if (icon) a.appendChild(icon); // keep the icon if present
        const label = document.createTextNode(' LiveContainer Install');
        a.appendChild(label);
      } catch {}
    }

    // Safety: capture click to force LC even if something toggles href back
    const handler = (e) => {
      try {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        location.replace(lc);
      } catch (err) {
        log('click handler error:', err);
      }
    };
    a.addEventListener('click', handler, { capture: true, passive: false });

    log('Rewrote TrollStore → LiveContainer:', lc, a);
    return true;
  }

  // Scan a container (modal or document) for any TrollStore installer anchor
  function scanContainer(root=document) {
    // Prefer anchors inside visible modals first
    const modals = root.querySelectorAll('div[id^="modal_ts_"]');
    modals.forEach(modal => {
      modal.querySelectorAll('a[href^="apple-magnifier://install"]').forEach(rewriteAnchorToLC);
    });
    // Also catch any stray anchors elsewhere (fallback)
    root.querySelectorAll('a[href^="apple-magnifier://install"]').forEach(rewriteAnchorToLC);
  }

  // When a modal toggle button is clicked, the modal content is shown shortly after.
  // We hook the click and rescan the target modal after a tick.
  function setupModalOpenDelegation() {
    const onOpen = (e) => {
      const btn = e.target?.closest?.('[data-modal-target],[data-modal-toggle]');
      if (!btn) return;
      const id = btn.getAttribute('data-modal-target') || btn.getAttribute('data-modal-toggle');
      if (!id) return;
      // Let the UI open, then rewrite inside the modal
      setTimeout(() => {
        const modal = document.getElementById(id);
        if (modal) {
          scanContainer(modal);
        }
      }, 50);
    };
    document.addEventListener('click', onOpen, { capture: true, passive: true });
  }

  // Observe DOM changes (children + attributes) to catch SPA updates and href mutations
  function startObservers() {
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'childList') {
          for (const node of m.addedNodes) {
            if (node.nodeType !== 1) continue;
            // If a new modal subtree appeared, scan it
            if (node.id && node.id.startsWith('modal_ts_')) {
              scanContainer(node);
            } else {
              // New content inside existing modal or page
              node.querySelectorAll?.('a[href^="apple-magnifier://install"]').forEach(rewriteAnchorToLC);
            }
          }
        } else if (m.type === 'attributes') {
          if (m.attributeName === 'href' && m.target?.matches?.('a')) {
            rewriteAnchorToLC(m.target);
          }
        }
      }
    });

    mo.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['href']
    });

    log('MutationObserver started');
  }

  // Short polling safety net (in case a framework mutates after microtasks)
  function startPoller() {
    setInterval(() => {
      try { scanContainer(document); } catch (e) { log('poll error:', e); }
    }, POLL_MS);
    log('Polling every', POLL_MS, 'ms');
  }

  // History hooks for SPA navigations (rescan after route changes)
  function hookHistory() {
    const notify = () => { try { scanContainer(document); } catch {} };
    const _push = history.pushState;
    const _replace = history.replaceState;
    history.pushState = function(...args){ const r = _push.apply(this, args); notify(); return r; };
    history.replaceState = function(...args){ const r = _replace.apply(this, args); notify(); return r; };
    addEventListener('popstate', notify, true);
  }

  // Optional: intercept programmatic launches of apple-magnifier
  function patchGlobalNav() {
    if (!PATCH_GLOBAL_NAV) return;

    const _open = window.open;
    window.open = function(url, ...rest) {
      try {
        if (typeof url === 'string' && url.startsWith('apple-magnifier://install')) {
          const lc = toLcInstallFromAppleMagnifier(url);
          if (lc) { location.replace(lc); return null; }
        }
      } catch (e) { log('window.open patch error:', e); }
      return _open.apply(this, [url, ...rest]);
    };

    const _assign = Location.prototype.assign;
    const _replace = Location.prototype.replace;

    Location.prototype.assign = function(url) {
      try {
        if (typeof url === 'string' && url.startsWith('apple-magnifier://install')) {
          const lc = toLcInstallFromAppleMagnifier(url);
          if (lc) return _replace.call(this, lc);
        }
      } catch (e) { log('location.assign patch error:', e); }
      return _assign.call(this, url);
    };

    Location.prototype.replace = function(url) {
      try {
        if (typeof url === 'string' && url.startsWith('apple-magnifier://install')) {
          const lc = toLcInstallFromAppleMagnifier(url);
          if (lc) return _replace.call(this, lc);
        }
      } catch (e) { log('location.replace patch error:', e); }
      return _replace.call(this, url);
    };
  }

  // Boot
  setupModalOpenDelegation();
  startObservers();
  startPoller();
  hookHistory();
  patchGlobalNav();

  // Initial sweep (covers already-opened modal or prerendered DOM)
  scanContainer(document);
})();
