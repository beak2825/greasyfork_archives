// ==UserScript==
// @name         Flatline Cloak (Midwest Safe Mode)
// @namespace    https://flatline.local
// @version      2.0.0
// @description  Privacy-focused on-page redaction (Midwest region) with console-only logs + safe defaults that avoid breaking sites like Google.
// @author       Flatline
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561926/Flatline%20Cloak%20%28Midwest%20Safe%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561926/Flatline%20Cloak%20%28Midwest%20Safe%20Mode%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /**
   * GOAL:
   * - Redact *visible* location-ish text on pages (Illinois / Indiana / Ohio / Kentucky / Missouri / Arkansas),
   * - Avoid breaking the internet (no aggressive URL rewriting, no nuking inputs, no messing with href/src),
   * - Console-only logs (old-school),
   * - Fast + safe: scrub only text nodes, and only new nodes via MutationObserver.
   */

  // -----------------------
  // CONFIG (safe defaults)
  // -----------------------
  const CFG = {
    enabled: true,
    debug: true,             // console logs
    token: '[REDACTED]',
    maxLogs: 200,

    // Safe mode: do NOT touch inputs / textareas / contenteditable (avoids breaking Google, editors, etc.)
    skipEditable: true,

    // Don’t touch these elements (helps avoid breaking code blocks, scripts, styles, and rich editors)
    skipTags: new Set([
      'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'KBD', 'SAMP'
    ]),

    // Debounce mutation bursts (pages like Google update DOM constantly)
    mutationDebounceMs: 120,

    // Hotkey toggle: Alt+L
    hotkey: { altKey: true, key: 'l' },

    // Region focus:
    // Include state names + common abbreviations + a few major cities as "high signal"
    // (You can add/remove without changing logic.)
    regionTerms: [
      // States (full)
      'illinois', 'indiana', 'ohio', 'kentucky', 'missouri', 'arkansas',

      // Common abbreviations (word-boundary safe)
      'il', 'in', 'oh', 'ky', 'mo', 'ar',

      // A few bigger cities in your footprint (optional, remove if too aggressive)
      'chicago', 'springfield', 'peoria', 'rockford',
      'indianapolis', 'fort wayne', 'evansville',
      'columbus', 'cincinnati', 'cleveland', 'dayton',
      'louisville', 'lexington', 'bowling green',
      'st louis', 'kansas city', 'springfield mo',
      'little rock', 'fayetteville', 'fort smith',

      // Typical “location labels”
      'zip code', 'zipcode', 'postal', 'postcode',
      'area code', 'hometown', 'based in', 'your location'
    ],

    // Optional “non-regional” leak-ish tokens (kept conservative)
    // Note: We are NOT touching actual IPs/coords by default to avoid false positives on technical sites.
    // If you want those later, I can add an optional strict mode toggle.
    genericLeakTerms: [
      'geoip', 'geolocation', 'gps', 'timezone'
    ]
  };

  // -----------------------
  // Logging
  // -----------------------
  const LOGS = [];
  function log(type, msg, data) {
    if (!CFG.debug) return;
    const line = `[FlatlineCloak] ${type}: ${msg}`;
    LOGS.push({ t: Date.now(), type, msg, data });
    if (LOGS.length > CFG.maxLogs) LOGS.shift();
    // “Old school console logs”
    console.log(line, data ?? '');
  }

  // -----------------------
  // Regex build (safe word boundaries)
  // -----------------------
  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Build a single combined regex for speed:
  // - Sort by length so "springfield mo" matches before "mo"
  // - Use boundaries that work with phrases
  const allTerms = [...new Set([...CFG.regionTerms, ...CFG.genericLeakTerms])]
    .filter(Boolean)
    .map(s => s.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  // Word boundary strategy:
  // - For pure alpha abbreviations like "il", we still use \bIL\b
  // - For phrases with spaces, \b at ends is fine.
  const termPattern = allTerms.map(t => `\\b${escapeRegExp(t)}\\b`).join('|');
  const TERMS_RE = new RegExp(termPattern, 'gi');

  // -----------------------
  // “Should we touch this node?”
  // -----------------------
  function isInsideSkippedElement(node) {
    let el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    while (el) {
      if (CFG.skipTags.has(el.tagName)) return true;

      if (CFG.skipEditable) {
        // contenteditable or rich editors
        if (el.isContentEditable) return true;
        // Google / editors often use role=textbox
        const role = el.getAttribute?.('role');
        if (role && role.toLowerCase() === 'textbox') return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  // -----------------------
  // Redaction
  // -----------------------
  function redactText(text) {
    if (!text) return { out: text, changed: false, hits: [] };

    TERMS_RE.lastIndex = 0;
    const hits = [];
    let match;
    while ((match = TERMS_RE.exec(text)) !== null) {
      hits.push(match[0]);
      // prevent runaway on weird engines
      if (hits.length > 50) break;
    }
    if (hits.length === 0) return { out: text, changed: false, hits: [] };

    TERMS_RE.lastIndex = 0;
    const out = text.replace(TERMS_RE, CFG.token);
    return { out, changed: out !== text, hits };
  }

  function scrubTextNode(textNode) {
    if (!CFG.enabled) return;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
    if (!textNode.textContent) return;
    if (isInsideSkippedElement(textNode)) return;

    const before = textNode.textContent;
    const { out, changed, hits } = redactText(before);
    if (!changed) return;

    textNode.textContent = out;
    log('REDACT', 'Text node redacted', { hits: [...new Set(hits)].slice(0, 12) });
  }

  // Scan a subtree efficiently (TreeWalker for text nodes)
  function scrubSubtree(root) {
    if (!CFG.enabled) return;
    if (!root) return;

    // If root itself is a text node, just scrub it
    if (root.nodeType === Node.TEXT_NODE) {
      scrubTextNode(root);
      return;
    }

    // Skip entire subtree if inside skipped element
    if (root.nodeType === Node.ELEMENT_NODE && CFG.skipTags.has(root.tagName)) return;
    if (isInsideSkippedElement(root)) return;

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (n) => {
          if (!n.textContent || !n.textContent.trim()) return NodeFilter.FILTER_REJECT;
          if (isInsideSkippedElement(n)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      scrubTextNode(node);
    }
  }

  // -----------------------
  // MutationObserver (debounced)
  // -----------------------
  let pending = [];
  let t = null;

  function flush() {
    const nodes = pending;
    pending = [];
    t = null;

    for (const n of nodes) scrubSubtree(n);
  }

  const observer = new MutationObserver((mutations) => {
    if (!CFG.enabled) return;

    for (const m of mutations) {
      if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(n => {
          // Only queue element/text nodes
          if (n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE) pending.push(n);
        });
      } else if (m.type === 'characterData' && m.target) {
        pending.push(m.target);
      }
    }

    if (!t) t = setTimeout(flush, CFG.mutationDebounceMs);
  });

  // -----------------------
  // Hotkey toggle (Alt+L)
  // -----------------------
  window.addEventListener('keydown', (e) => {
    if (e.altKey !== CFG.hotkey.altKey) return;
    if ((e.key || '').toLowerCase() !== CFG.hotkey.key) return;

    CFG.enabled = !CFG.enabled;
    log('TOGGLE', `enabled=${CFG.enabled}`);
    if (CFG.enabled) scrubSubtree(document.body);
  });

  // -----------------------
  // Init
  // -----------------------
  function start() {
    if (!document.body) {
      setTimeout(start, 50);
      return;
    }

    // Initial pass (one-time)
    scrubSubtree(document.body);

    // Observe changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    log('INFO', 'Started (Midwest Safe Mode). Alt+L toggles redaction.');
    log('INFO', 'Safe defaults: no input/contenteditable/URL/href scrubbing.');
  }

  start();
})();  