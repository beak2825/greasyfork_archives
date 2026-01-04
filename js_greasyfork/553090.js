// ==UserScript==
// @name         Universal iOS Userscript — Aggressive Ad & Popup Blocker (Userscripts/Tampermonkey friendly)
// @namespace    https://github.com/Khalil-Mensouri
// @version      1.0
// @description  Aggressive userscript that hides common ad containers, removes ad iframes/scripts, blocks popup-redirectors and click-redirectors. Designed for use with iOS Userscripts or Tampermonkey (Safari). Use with caution: aggressive rules may break some sites. See runtime API at window.__uAd for tweaks/whitelisting.
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553090/Universal%20iOS%20Userscript%20%E2%80%94%20Aggressive%20Ad%20%20Popup%20Blocker%20%28UserscriptsTampermonkey%20friendly%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553090/Universal%20iOS%20Userscript%20%E2%80%94%20Aggressive%20Ad%20%20Popup%20Blocker%20%28UserscriptsTampermonkey%20friendly%29.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 Khalil-Mensouri

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
Full text: https://opensource.org/licenses/MIT
Replace "<Your Name>" if you wish.
*/

(function () {
  'use strict';

  // ------------------------
  // Quick notes:
  // - This script is intentionally aggressive. It hides many ad containers and removes iframes/scripts
  //   that match known ad/redirect hosts or common ad keywords. This can break site features (logins,
  //   paywalls, embeds). Use the runtime API to whitelist domains you trust.
  // - For the most comprehensive blocking on iOS, consider a native content blocker (AdGuard/Wipr/1Blocker).
  // ------------------------

  // Known ad/redirect host substrings and keywords (tune as needed)
  const BLOCK_KEYWORDS = [
    'ads', 'doubleclick', 'googlesyndication', 'adservice', 'adservice.google', 'adroll', 'criteo',
    'taboola', 'outbrain', 'revcontent', 'clickserve', 'sklnk', 'wiwrutck', 'amxv', 'ojsgudgre',
    'bunkr', 'reddrecit', 'push', 'tracking', 'redirect', 'adserver', 'adsystem', 'sovrn', 'adform'
  ];

  // Build regex for hosts/urls
  const BLOCK_KEY_RE = new RegExp(BLOCK_KEYWORDS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'), 'i');

  // Aggressive CSS selectors to hide common ad containers (applied only when globalCssEnabled is true)
  const GLOBAL_HIDE_SELECTORS = [
    '[id^="ad-"]', '[class*=" ad"]', '[class*="ads"]', '.adsbygoogle', '.adunit', '.advert',
    '.ad-banner', '.ad-slot', '.ad-container', '.ad-wrapper', '.cookie-consent', '.cookie-banner',
    '.consent-banner', '.site-overlay', '.modal-backdrop', '.subscribe-modal', '.newsletter-modal',
    '.paywall', 'iframe[src*="ads"]', 'iframe[src*="doubleclick"]', '.popup', '.pop-up', '.sticky-ad',
    '.floating-ad', '.ad-panel', '.adframe', '.sponsored', '.sponsor', '.top-ad', '.bottom-ad'
  ];

  // Runtime options (change via window.__uAd.setOption)
  let opts = {
    globalCssEnabled: false, // set true to inject broad CSS hides (may break some sites)
    aggressiveRemoveInlineScripts: false, // remove inline scripts that mention keywords
    suspendOnAttachmentClickMs: 2800, // suspend sanitization briefly on attachment click
    whitelist: [] // domains to ignore (exact hostname matches)
  };

  // Utilities
  function hostOf(href) {
    try { return new URL(href, location.href).hostname || ''; } catch (e) { return ''; }
  }

  function isWhitelisted(host) {
    if (!host) return false;
    return opts.whitelist.some(d => d && host === d);
  }

  function containsBlockedKeyword(s) {
    if (!s) return false;
    return BLOCK_KEY_RE.test(s);
  }

  function isBlockedUrl(href) {
    if (!href) return false;
    try {
      const u = new URL(href, location.href);
      if (isWhitelisted(u.hostname)) return false;
      return BLOCK_KEY_RE.test(u.hostname) || BLOCK_KEY_RE.test(u.href) || /\/sklnk\//i.test(href);
    } catch (e) {
      return BLOCK_KEY_RE.test(href) || /\/sklnk\//i.test(href);
    }
  }

  // Attachment-safe helpers: try not to interfere with gallery/attachment links
  function anchorLooksLikeAttachment(a) {
    try {
      if (!a || a.tagName !== 'A') return false;
      const href = a.getAttribute('href') || '';
      if (/\/attachments?\//i.test(href)) return true;
      if (/\.(jpe?g|png|webp|gif|bmp|svg)(?:$|\?)/i.test(href)) return true;
      if (a.querySelector && a.querySelector('img')) return true;
      const attrs = ['data-lightbox','data-src','data-full','data-attachment','data-xf-init','data-full-src','data-zoom','data-image'];
      for (const at of attrs) if (a.hasAttribute && a.hasAttribute(at)) return true;
      return false;
    } catch (e) { return false; }
  }

  // Suspension mechanism to avoid breaking image viewers on mobile Safari
  let suspendUntil = 0;
  function suspendShortly() { suspendUntil = Date.now() + (opts.suspendOnAttachmentClickMs || 2800); }
  function isSuspended() { return Date.now() < suspendUntil; }

  // Inject global CSS hide rules (if enabled)
  function injectGlobalCss() {
    try {
      if (!opts.globalCssEnabled) return;
      if (document.getElementById('__uad_global_css')) return;
      const s = document.createElement('style');
      s.id = '__uad_global_css';
      s.textContent = GLOBAL_HIDE_SELECTORS.join(',') + '{display:none!important;visibility:hidden!important;height:0!important;width:0!important;opacity:0!important;pointer-events:none!important}';
      document.documentElement && document.documentElement.appendChild(s);
      console.debug('[uAd] injected global CSS');
    } catch (e) {}
  }

  // Kill element (try remove, fallback to hide)
  function kill(el) {
    if (!el || !el.parentNode) return;
    try { el.remove(); } catch (e) { try { el.style.display='none'; el.hidden = true; } catch (e2) {} }
  }

  // Sanitize node: remove iframe/script/link/embed that match blocked hosts/keywords
  function sanitizeNode(root) {
    if (!root || root.nodeType !== 1) return;
    if (isSuspended()) return;
    try {
      // remove suspicious iframes/scripts/embeds
      const elems = root.querySelectorAll && root.querySelectorAll('iframe,script,embed,object,link');
      if (elems && elems.length) {
        elems.forEach(el => {
          try {
            // skip if inside an attachment-like area (to avoid breaking viewers)
            let cur = el;
            let insideAttachment = false;
            while (cur && cur !== document) {
              if (cur.id && /attach|attachment|gallery|lightbox|viewer/i.test(cur.id)) { insideAttachment = true; break; }
              if (cur.className && typeof cur.className === 'string' && /attach|attachment|gallery|lightbox|viewer/i.test(cur.className)) { insideAttachment = true; break; }
              cur = cur.parentNode;
            }
            if (insideAttachment) return;

            const src = el.src || (el.getAttribute && (el.getAttribute('src') || el.getAttribute('data-src') || '')) || '';
            if (isBlockedUrl(src)) { kill(el); return; }

            // optional: if inline script mentions keywords and aggressive option enabled
            if (opts.aggressiveRemoveInlineScripts && el.tagName === 'SCRIPT' && el.textContent && containsBlockedKeyword(el.textContent)) { kill(el); return; }
          } catch (e) {}
        });
      }
    } catch (e) {}
  }

  // Intercept clicks to stop click-redirectors and allow attachments
  document.addEventListener('click', function (ev) {
    try {
      let node = ev.target;
      while (node && node !== document) {
        if (node.tagName === 'A' && node.getAttribute) {
          if (anchorLooksLikeAttachment(node)) { suspendShortly(); return; }
          const href = node.getAttribute('href') || '';
          if (!href) { node = node.parentNode; continue; }
          if (isBlockedUrl(href)) {
            // try to extract encoded original target from query params if present
            const m = href.match(/(?:[?&](?:url|u|link|redir|r|to|target)=)([^&]+)/i);
            if (m && m[1]) {
              try {
                const dec = decodeURIComponent(m[1]);
                if (/^https?:\/\//i.test(dec)) { ev.preventDefault(); ev.stopImmediatePropagation(); try { location.assign(dec); } catch (e) { window.open(dec, '_self'); } return; }
              } catch (e) {}
            }
            ev.preventDefault(); ev.stopImmediatePropagation();
            console.debug('[uAd] blocked click to', href);
            return;
          } else {
            // rewrite anchors that contain encoded original target for convenience
            const m2 = href.match(/(?:[?&](?:url|u|link|redir|r|to|target)=)([^&]+)/i);
            if (m2 && m2[1]) {
              try { const dec = decodeURIComponent(m2[1]); if (/^https?:\/\//i.test(dec) && !isBlockedUrl(dec)) { node.setAttribute('href', dec); node.removeAttribute('target'); } } catch (e) {}
            }
          }
        }
        node = node.parentNode;
      }
    } catch (e) {}
  }, true);

  // Override window.open/location.assign/replace to block known redirect targets (non-destructive for other uses)
  (function () {
    try {
      const nativeOpen = window.open;
      window.open = function (url, ...args) {
        try { if (isBlockedUrl(url)) { console.debug('[uAd] blocked window.open to', url); return null; } } catch (e) {}
        return nativeOpen.apply(this, [url, ...args]);
      };
    } catch (e) {}
    try {
      const nativeAssign = window.location.assign;
      window.location.assign = function (url) {
        try { if (isBlockedUrl(url)) { console.debug('[uAd] blocked location.assign to', url); return; } } catch (e) {}
        return nativeAssign.apply(this, [url]);
      };
    } catch (e) {}
    try {
      const nativeReplace = window.location.replace;
      window.location.replace = function (url) {
        try { if (isBlockedUrl(url)) { console.debug('[uAd] blocked location.replace to', url); return; } } catch (e) {}
        return nativeReplace.apply(this, [url]);
      };
    } catch (e) {}
  })();

  // Mutation observer to sanitize dynamically-inserted nodes
  const mo = new MutationObserver(muts => {
    if (isSuspended()) return;
    muts.forEach(m => {
      m.addedNodes && m.addedNodes.forEach(n => { try { if (n.nodeType === 1) sanitizeNode(n); } catch (e) {} });
      try { if (m.target && m.target.nodeType === 1) sanitizeNode(m.target); } catch (e) {}
    });
  });

  try { mo.observe(document.documentElement || document, { childList: true, subtree: true }); } catch (e) {}

  // Periodic cleanup (defensive)
  try {
    setInterval(() => {
      if (isSuspended()) return;
      try { sanitizeNode(document.documentElement || document); } catch (e) {}
      if (opts.globalCssEnabled) injectGlobalCss();
    }, 2000);
  } catch (e) {}

  // Small helper to remove inline onclick handlers that reference blocked keywords
  document.addEventListener('mousedown', function (ev) {
    try {
      if (isSuspended()) return;
      let node = ev.target;
      while (node && node !== document) {
        const onclick = node.getAttribute && node.getAttribute('onclick');
        if (onclick && containsBlockedKeyword(onclick)) {
          try { node.removeAttribute && node.removeAttribute('onclick'); node.dataset.__uad_removed = '1'; } catch (e) {}
        }
        node = node.parentNode;
      }
    } catch (e) {}
  }, true);

  // Runtime API (exposed via console)
  window.__uAd = {
    setOption: function (k, v) { if (k in opts) opts[k] = v; if (k === 'globalCssEnabled' && v) injectGlobalCss(); return opts; },
    addWhitelist: function (host) { if (host && !opts.whitelist.includes(host)) opts.whitelist.push(host); return opts.whitelist; },
    removeWhitelist: function (host) { opts.whitelist = opts.whitelist.filter(h => h !== host); return opts.whitelist; },
    listOptions: function () { return JSON.parse(JSON.stringify(opts)); },
    isBlockedUrl: isBlockedUrl,
    suspendShortly: suspendShortly,
    version: '1.0'
  };

  console.debug('[uAd] Universal Userscript AdBlocker v1.0 active');
})();