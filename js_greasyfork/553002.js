// ==UserScript==
// @name         SimpBlocker — Robust Redirect & Global Ad Blocker (v4.1)
// @namespace    https://greasyfork.org/users/Khalil-Mensouri
// @version      4.1
// @description  Blocks popup-redirect domains (wiwrutck, amxvtyhhyciw, ojsgudgre, amxv*, reddrecit, etc.), sanitizes embeds, protects attachments/viewers, and optionally applies broad ad/hide-rules site-wide (GLOBAL_BLOCK). Targets sklnk redirect paths and common embed injections.
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/Khalil-Mensouri/simpcity-blocker
// @source       https://github.com/Khalil-Mensouri/simpcity-blocker/blob/main/simpcity-blocker.user.js
// @downloadURL https://update.greasyfork.org/scripts/553002/SimpBlocker%20%E2%80%94%20Robust%20Redirect%20%20Global%20Ad%20Blocker%20%28v41%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553002/SimpBlocker%20%E2%80%94%20Robust%20Redirect%20%20Global%20Ad%20Blocker%20%28v41%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ------------------------
  // Config: add known redirectors / ad hosts here
  // ------------------------
  const BLOCK_DOMAINS = [
    'wiwrutck.com',
    'amxvtyhhyciw.com',
    'ojsgudgre.com',
    'amxvtyhhyciw.net',
    'amxvtyhhyciw.org',
    'amxvtyhhyciw.xyz',
    'reddrecit.com',
    'bunkr.si'
  ];

  const BLOCK_PATTERNS = [
    'wiwrutck',
    'amxvtyhhyciw',
    'ojsgudgre',
    'reddrecit',
    'sklnk',
    'amxv',
    'clickpush',
    'clkredirect',
    'trackingdomain',
    'redirector',
    'bunkr'
  ].map(s => new RegExp(s, 'i'));

  // GLOBAL_BLOCK: when true, apply broad CSS hides and removals.
  let GLOBAL_BLOCK = false;

  const GLOBAL_HIDE_SELECTORS = [
    '[id^="ad-"]', '[class*=" ad"]', '[class*="ads"]', '.adsbygoogle',
    '.adunit', '.advert', '.ad-banner', '.ad-slot', '.ad-container', '.ad-wrapper',
    '.cookie-consent', '.cookie-banner', '.consent-banner', '.site-overlay', '.modal-backdrop',
    '.subscribe-modal', '.newsletter-modal', '.paywall', 'iframe[src*="ads"]', 'iframe[src*="doubleclick"]',
    '.popup', '.pop-up', '.sticky-ad', '.cookieNotice', '.adblock-message', '.top-ad', '.floating-ad'
  ];

  const ENCODED_PARAMS_RE = /(?:[?&](?:url|u|link|redir|r|to|target)=)([^&]+)/i;
  const CLEAN_INTERVAL = 2000;
  let AGGRESSIVE_REMOVE_INLINE_SCRIPTS = false;

  // Suspend sanitization briefly when user intentionally opens attachments/viewers (avoid mobile freeze)
  const SUSPEND_MS_AFTER_ATTACHMENT_CLICK = 3000;
  let suspendUntil = 0;
  function suspendShortly() { suspendUntil = Date.now() + SUSPEND_MS_AFTER_ATTACHMENT_CLICK; try { console.debug('[SimpBlocker] suspended until', new Date(suspendUntil).toISOString()); } catch (e) {} }
  function isSuspended() { return Date.now() < suspendUntil; }

  // ------------------------
  // Helpers
  // ------------------------
  function isSameOriginHref(href) {
    if (!href) return false;
    try { const u = new URL(href, location.href); return u.hostname === location.hostname; } catch (e) { return href.startsWith('/') || !/^[a-zA-Z0-9-_.]+:/.test(href); }
  }

  function ancestorMatches(node, rx) {
    try {
      let cur = node;
      while (cur && cur !== document) {
        if (cur.id && rx.test(cur.id)) return true;
        if (cur.className && typeof cur.className === 'string' && rx.test(cur.className)) return true;
        cur = cur.parentNode;
      }
    } catch (e) {}
    return false;
  }

  function isInsideAttachmentArea(node) {
    if (!node) return false;
    return ancestorMatches(node, /(attach|attachment|attachments|gallery|lightbox|xf-attachment|message-attachment|ipsAttachment|attachments_list|post-content|bb-image|viewer|gallery|image-popup)/i);
  }

  function anchorLooksLikeAttachment(a) {
    try {
      if (!a || a.tagName !== 'A') return false;
      const href = a.getAttribute('href') || '';
      if (/\/attachments?\//i.test(href)) return true;
      if (/\/attachment/i.test(href)) return true;
      if (/\.(jpe?g|png|webp|gif|bmp|svg)(?:$|\?)/i.test(href)) return true;
      if (a.querySelector && a.querySelector('img')) return true;
      const attrs = ['data-lightbox','data-src','data-full','data-attachment','data-xf-init','data-full-src','data-zoom','data-image'];
      for (const at of attrs) if (a.hasAttribute && a.hasAttribute(at)) return true;
      if (isSameOriginHref(href) && href.length < 200 && /\/[a-z0-9\-_]{1,50}\./i.test(href)) return true;
      if (isInsideAttachmentArea(a)) return true;
    } catch (e) {}
    return false;
  }

  function log(...args) { try { console.debug('[SimpBlocker]', ...args); } catch (e) {} }

  function isBlockedUrlString(href) {
    if (!href || typeof href !== 'string') return false;
    try {
      const url = new URL(href, location.href);
      const host = url.hostname || '';
      if (BLOCK_DOMAINS.some(d => host === d || href.includes(d))) return true;
      if (BLOCK_PATTERNS.some(rx => rx.test(host) || rx.test(href))) return true;
      // also block known sklnk patterns inside path
      if (/\/sklnk\//i.test(href)) return true;
      return false;
    } catch (e) {
      if (BLOCK_PATTERNS.some(rx => rx.test(href))) return true;
      if (/\/sklnk\//i.test(href)) return true;
      return false;
    }
  }

  function extractEncodedTarget(href) {
    if (!href || typeof href !== 'string') return null;
    try {
      const m = href.match(ENCODED_PARAMS_RE);
      if (m && m[1]) {
        try { const dec = decodeURIComponent(m[1]); if (/^https?:\/\//i.test(dec)) return dec; } catch (e) {}
      }
      const parts = href.split('/');
      if (parts.length > 3) {
        const tail = parts.slice(3).join('/');
        try { const dec = decodeURIComponent(tail); if (/^https?:\/\//i.test(dec)) return dec; } catch (e) {}
      }
    } catch (e) {}
    return null;
  }

  // ------------------------
  // Click interception: respect attachments and suspend sanitization briefly
  // ------------------------
  document.addEventListener('click', function (ev) {
    try {
      let node = ev.target;
      while (node && node !== document) {
        if (node.tagName === 'A' && node.getAttribute) {
          if (anchorLooksLikeAttachment(node) || isInsideAttachmentArea(node)) { suspendShortly(); return; }
          const rawHref = node.getAttribute('href') || '';
          if (!rawHref) { node = node.parentNode; continue; }
          if (isBlockedUrlString(rawHref)) {
            const real = extractEncodedTarget(rawHref);
            if (real) {
              ev.preventDefault(); ev.stopImmediatePropagation();
              try { location.assign(real); } catch (e) { window.open(real, '_self'); }
              log('Rewrote redirector link to:', real);
              return;
            } else {
              ev.preventDefault(); ev.stopImmediatePropagation();
              log('Blocked redirector click (no decodable target):', rawHref);
              return;
            }
          } else {
            const maybe = extractEncodedTarget(rawHref);
            if (maybe && !isBlockedUrlString(maybe)) {
              try { node.setAttribute('href', maybe); node.removeAttribute('target'); log('Rewrote encoded link to:', maybe); } catch (e) {}
              return;
            }
          }
        }
        node = node.parentNode;
      }
    } catch (e) {}
  }, true);

  // ------------------------
  // Override window open/assign/replace to block known redirectors
  // ------------------------
  (function overrideOpenAssignReplace() {
    try {
      const nativeOpen = window.open;
      window.open = function (url, ...args) {
        try { if (isBlockedUrlString(url)) { log('Blocked window.open to', url); return null; } } catch (e) {}
        return nativeOpen.apply(this, [url, ...args]);
      };
    } catch (e) {}
    try {
      const nativeAssign = window.location.assign;
      window.location.assign = function (url) {
        try { if (isBlockedUrlString(url)) { log('Blocked location.assign to', url); return; } } catch (e) {}
        return nativeAssign.apply(this, [url]);
      };
    } catch (e) {}
    try {
      const nativeReplace = window.location.replace;
      window.location.replace = function (url) {
        try { if (isBlockedUrlString(url)) { log('Blocked location.replace to', url); return; } } catch (e) {}
        return nativeReplace.apply(this, [url]);
      };
    } catch (e) {}
  })();

  // ------------------------
  // Sanitize nodes: remove iframes/scripts linking to blocked hosts unless inside attachment/viewer area
  // ------------------------
  function sanitizeNode(root) {
    if (!root || root.nodeType !== 1) return;
    if (isSuspended()) return;
    try {
      const elems = root.querySelectorAll && root.querySelectorAll('iframe,script,embed,object,link');
      if (elems && elems.length) {
        elems.forEach(el => {
          try {
            if (isInsideAttachmentArea(el)) return;
            const src = el.src || el.getAttribute && (el.getAttribute('src') || el.getAttribute('data-src') || '') || '';
            const html = (el.innerHTML || '') + (el.textContent || '');
            if (src && isBlockedUrlString(src)) {
              try { el.remove(); log('Removed element with blocked src:', src); } catch (e) { try { el.style.display='none'; } catch (e2) {} }
            } else if (html && BLOCK_PATTERNS.some(rx => rx.test(html))) {
              if (AGGRESSIVE_REMOVE_INLINE_SCRIPTS) { try { el.remove(); log('Removed inline script mentioning blocked domain'); } catch (e) {} }
            }
          } catch (e) {}
        });
      }

      const embeds = root.querySelectorAll && root.querySelectorAll('iframe[src], [data-src], .embed, .embedded, .iframe-wrap, .video-embed, .frame, .embed-container, .embed-panel, .ad-panel');
      if (embeds && embeds.length) {
        embeds.forEach(e => {
          try {
            if (isInsideAttachmentArea(e)) return;
            const s = e.src || e.getAttribute && (e.getAttribute('src') || e.getAttribute('data-src') || '') || '';
            if (s && isBlockedUrlString(s)) {
              try { e.remove(); log('Removed embed with blocked src:', s); } catch (e) { try { e.style.display='none'; } catch (e2) {} }
              return;
            }
            const links = e.querySelectorAll && e.querySelectorAll('a[href]');
            if (links && links.length) {
              links.forEach(a => { try { const hh = a.getAttribute('href') || ''; if (isBlockedUrlString(hh)) { a.remove(); log('Removed inner embed link to blocked domain'); } } catch (e) {} });
            }
          } catch (e) {}
        });
      }

      if (GLOBAL_BLOCK) {
        try {
          GLOBAL_HIDE_SELECTORS.forEach(sel => {
            try { root.querySelectorAll && root.querySelectorAll(sel).forEach(n => { try { n.remove(); } catch (e){ try { n.style.display='none'; } catch(e2){} } }); } catch(e){}
          });
        } catch (e) {}
      }
    } catch (e) {}
  }

  // initial sanitize
  try { sanitizeNode(document.documentElement || document); } catch (e) {}

  // Mutation observer
  const mo = new MutationObserver(mutations => {
    if (isSuspended()) return;
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(node => { try { if (node.nodeType === 1) sanitizeNode(node); } catch (e) {} });
      }
      try { if (m.target && m.target.nodeType === 1) sanitizeNode(m.target); } catch (e) {}
    }
  });

  try { mo.observe(document.documentElement || document, { childList: true, subtree: true, attributes: false }); } catch (e) {}

  // Periodic cleanup + global CSS injection
  try {
    setInterval(() => {
      if (isSuspended()) return;
      try { sanitizeNode(document.documentElement || document); } catch (e) {}
      if (GLOBAL_BLOCK) injectGlobalHideCSS();
    }, CLEAN_INTERVAL);
  } catch (e) {}

  // Remove inline onclick handlers that call blocked hosts (safely)
  document.addEventListener('mousedown', function (ev) {
    try {
      if (isSuspended()) return;
      let node = ev.target;
      while (node && node !== document) {
        const onclick = node.getAttribute && node.getAttribute('onclick');
        if (onclick && BLOCK_PATTERNS.some(rx => rx.test(onclick))) {
          try { node.removeAttribute && node.removeAttribute('onclick'); node.dataset.__simp_onclick_removed = '1'; log('Removed malicious onclick'); } catch (e) {}
        }
        node = node.parentNode;
      }
    } catch (e) {}
  }, true);

  // ------------------------
  // Global CSS injector (used when GLOBAL_BLOCK is enabled)
  // ------------------------
  function injectGlobalHideCSS() {
    try {
      const styleId = '__simpblocker_global_hide_css';
      if (document.getElementById(styleId)) return;
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = GLOBAL_HIDE_SELECTORS.join(',') + '{display:none!important;visibility:hidden!important;height:0!important;width:0!important;opacity:0!important;pointer-events:none!important}';
      document.documentElement && document.documentElement.appendChild(style);
      log('Injected global hide CSS');
    } catch (e) {}
  }

  // ------------------------
  // Public runtime API
  // ------------------------
  window.__simpblocker = {
    isBlockedUrlString,
    extractEncodedTarget,
    addDomain: function (d) { try { if (d && !BLOCK_DOMAINS.includes(d)) BLOCK_DOMAINS.push(d); return BLOCK_DOMAINS.slice(); } catch (e) { return null; } },
    addPattern: function (p) { try { BLOCK_PATTERNS.push(new RegExp(p, 'i')); return BLOCK_PATTERNS.map(r=>r.toString()); } catch (e) { return null; } },
    listBlocked: function () { return { domains: BLOCK_DOMAINS.slice(), patterns: BLOCK_PATTERNS.map(r => r.toString()) }; },
    suspendShortly,
    enableAggressiveInlineRemoval: function () { AGGRESSIVE_REMOVE_INLINE_SCRIPTS = true; return 'enabled'; },
    disableAggressiveInlineRemoval: function () { AGGRESSIVE_REMOVE_INLINE_SCRIPTS = false; return 'disabled'; },
    setGlobalBlock: function (v) { GLOBAL_BLOCK = !!v; if (GLOBAL_BLOCK) injectGlobalHideCSS(); return GLOBAL_BLOCK; },
    getGlobalBlock: function () { return !!GLOBAL_BLOCK; }
  };

  log('SimpBlocker v4.1 active — ojsgudgre added; tighter sklnk handling');
})();