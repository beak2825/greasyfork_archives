// ==UserScript==
// @name         Printables Bambu Studio Button
// @namespace    http://wol.ph/
// @version      2025-10-03
// @description  Adds a "Bambu Studio" button and replaces PrusaSlicer buttons on Printables.
// @author       wolph
// @match        https://www.printables.com/model/*
// @run-at       document-idle
// @icon         https://icons.duckduckgo.com/ip2/printables.com.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551493/Printables%20Bambu%20Studio%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/551493/Printables%20Bambu%20Studio%20Button.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ------------------------------
  // Config / constants
  // ------------------------------
  const BAMBULAB_ICON = 'https://icons.duckduckgo.com/ip2/bambulab.com.ico';
  const SLICE_SELECTOR = '.btn.slicer-download, button.slicer-download, .slicer-download';

  // Track which buttons we've already patched
  const seen = new WeakSet();

  // ------------------------------
  // Utilities
  // ------------------------------
  /** @param {Element} el */
  const $closestCard = (el) => el.closest('.download-item');

  /** Replace the icon(s) inside a Slice button with the Bambu favicon (don’t touch the text). */
  function swapIcon(btn) {
    const imgs = btn.querySelectorAll('img');
    if (imgs.length) {
      imgs.forEach((img) => {
        img.src = BAMBULAB_ICON;
        img.alt = 'Bambu Studio';
        img.width = 14;
        img.height = 14;
        img.classList.add('bambu-icon');
        img.style.borderRadius = '2px';
      });
    } else {
      // If there is no <img>, prepend one without changing text
      const img = document.createElement('img');
      img.src = BAMBULAB_ICON;
      img.alt = 'Bambu Studio';
      img.width = 14;
      img.height = 14;
      img.style.marginRight = '0.35rem';
      img.style.verticalAlign = 'text-bottom';
      img.className = 'bambu-icon';
      btn.prepend(img);
    }
    // Tooltip only; do NOT modify visible text (prevents "Slice Slice")
    btn.title = 'Open in Bambu Studio';
  }

  /** Remove duplicate "Slice" text nodes (some themes render two). Keep the first, blank out the rest. */
  function dedupeSliceLabel(btn) {
    const textNodes = Array.from(btn.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .filter((n) => /\bSlice\b/i.test(n.textContent || ''));

    for (let i = 1; i < textNodes.length; i++) {
      textNodes[i].textContent = ''; // blank out extras
    }
  }

  /** Patch one Slice button: swap icon + de-dupe label (idempotent). */
  function patchSliceButton(btn) {
    if (seen.has(btn)) return;
    seen.add(btn);
    swapIcon(btn);
    dedupeSliceLabel(btn);
  }

  /** Scan current DOM for Slice buttons. */
  function scan() {
    document.querySelectorAll(SLICE_SELECTOR).forEach((btn) => {
      if (!(btn instanceof HTMLElement)) return;
      // Only touch buttons that live inside a download-item card to avoid false positives
      if (!$closestCard(btn)) return;
      patchSliceButton(btn);
    });
  }

  // ------------------------------
  // Protocol / navigation rewriting
  // ------------------------------

  /**
   * Rewrite any Prusa custom-protocol navigation to Bambu Studio.
   * - prusaslicer://open?file=...  -> bambustudio://open?file=...
   * - prusa://open?url=...         -> bambustudio://open?file=...
   * Falls back to returning the original URL if it’s not a Prusa link.
   * @param {string|URL} raw
   * @returns {string|URL}
   */
  function rewritePrusaToBambu(raw) {
    try {
      if (raw == null) return raw;
      let s = String(raw);

      // Only handle prusa*/ custom schemes
      const m = s.match(/^prusa(?:slicer)?:\/\/([^#?\/]+)(.*)$/i);
      if (!m) return raw;

      // Normalize path to 'open'
      const path = (m[1] || 'open').toLowerCase() === 'slice' ? 'open' : 'open';

      // Extract query (if present)
      let qs = '';
      const qIndex = s.indexOf('?');
      if (qIndex >= 0) qs = s.slice(qIndex + 1);

      // Map common param names to "file"
      const params = new URLSearchParams(qs);
      const knownKeys = ['file', 'url', 'path', 'u'];
      let fileUrl = '';
      for (const k of knownKeys) {
        if (params.has(k)) { fileUrl = params.get(k) || ''; break; }
      }
      // If still empty, attempt raw decode of the entire query
      if (!fileUrl && qs) fileUrl = qs;

      // Build bambustudio deep link
      const out = `bambustudio://open?file=${encodeURIComponent(fileUrl)}`;
      return out;
    } catch {
      return raw;
    }
  }

  // Intercept <a> clicks to prusa*:// and rewrite to bambu
  document.addEventListener('click', (ev) => {
    const target = /** @type {HTMLElement|null} */ (ev.target instanceof Element ? ev.target : null);
    const anchor = target?.closest?.('a[href^="prusaslicer://"], a[href^="prusa://"]');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href) {
        ev.preventDefault();
        ev.stopPropagation();
        const rewritten = rewritePrusaToBambu(href);
        // Open via location to trigger protocol handler
        window.location.href = String(rewritten);
      }
    }
  }, true);

  // Intercept programmatic window.open("prusaslicer://...")
  (function patchWindowOpen() {
    const original = window.open;
    window.open = function patchedOpen(url, name, specs, replace) {
      const rewritten = rewritePrusaToBambu(url);
      return original.call(this, rewritten, name, specs, replace);
    };
  })();

  // Intercept programmatic anchor.click() commonly used by sites to trigger downloads
  (function patchAnchorClick() {
    const OriginalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function patchedAnchorClick() {
      try {
        const href = this.getAttribute('href') || this.href || '';
        // If site tries to open Prusa directly, rewrite to Bambu
        if (/^prusa(?:slicer)?:\/\//i.test(href)) {
          const rewritten = rewritePrusaToBambu(href);
          // Prefer navigating instead of default click to avoid duplicate handlers
          window.location.href = String(rewritten);
          return;
        }
        // If a direct model file (.3mf) is being "clicked" programmatically, use Bambu Studio
        if (/\.(?:3mf)(?:$|\?)/i.test(href) || /\/download\b/i.test(href)) {
          const deep = `bambustudio://open?file=${encodeURIComponent(href)}`;
          window.location.href = deep;
          return;
        }
      } catch {
        // ignore and fall through
      }
      return OriginalClick.call(this);
    };
  })();

  // Some frameworks use location.assign/replace — intercept those as well
  (function patchLocationMethods() {
    const proto = /** @type {Location} */ (window.location).__proto__ || Location.prototype;
    const origAssign = proto.assign;
    const origReplace = proto.replace;

    proto.assign = function patchedAssign(url) {
      const rewritten = rewritePrusaToBambu(url);
      return origAssign.call(this, rewritten);
    };
    proto.replace = function patchedReplace(url) {
      const rewritten = rewritePrusaToBambu(url);
      return origReplace.call(this, rewritten);
    };
  })();

  // ------------------------------
  // Observe dynamic content
  // ------------------------------
  const mo = new MutationObserver(() => scan());
  mo.observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
