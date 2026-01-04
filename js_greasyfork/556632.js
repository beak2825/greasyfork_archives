// ==UserScript==
// @name         Reddit Auto RTL (posts & comments)
// @namespace    https://github.com/aboda7m/reddit-auto-rtl
// @version      1.1.1
// @description  Auto-detect RTL text on reddit and set direction/text-align for those blocks (posts, comments, inputs). Works on new.reddit.com and old.reddit.com. Uses MutationObserver for live content.
// @author       Aboda7m (Abdulrahman Alnotefi)
// @match        https://*.reddit.com/*
// @match        https://reddit.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @homepageURL  https://github.com/aboda7m/reddit-auto-rtl
// @supportURL   https://github.com/aboda7m/reddit-auto-rtl/issues
// @downloadURL https://update.greasyfork.org/scripts/556632/Reddit%20Auto%20RTL%20%28posts%20%20comments%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556632/Reddit%20Auto%20RTL%20%28posts%20%20comments%29.meta.js
// ==/UserScript==




(function () {
  'use strict';

  // RTL unicode ranges (trimmed to the important blocks)
  const RTL_RANGES = [
    [0x0590, 0x05FF], // Hebrew
    [0x0600, 0x06FF], // Arabic
    [0x0750, 0x077F], // Arabic Supplement
    [0x08A0, 0x08FF], // Arabic Extended-A
    [0x0700, 0x074F], // Syriac
    [0x0780, 0x07BF], // Thaana
    [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
    [0xFE70, 0xFEFF], // Arabic Presentation Forms-B
    [0x1EE00, 0x1EEFF] // Arabic Mathematical Alphabets etc
  ];

  function isRtlChar(cp) {
    for (let r of RTL_RANGES) if (cp >= r[0] && cp <= r[1]) return true;
    return false;
  }

  function textIsRTL(text) {
    if (!text) return false;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      // skip whitespace and common punctuation quickly
      if (code <= 32 || (code >= 33 && code <= 47)) continue;
      if (isRtlChar(code)) return true;
      // if we see strong LTR latin letter early, prefer LTR
      if ((code >= 0x0041 && code <= 0x007A) || (code >= 0x00C0 && code <= 0x024F)) return false;
    }
    return false;
  }

  // Narrow selectors focused on post/comment content. Avoid generic selectors that hit nav/menus.
  const TARGET_SELECTORS = [
    // new reddit
    'div[data-test-id="post-content"]',
    '.Post div[data-click-id="text"]',     // post rich text container
    '.Post .RichTextJSON-root',            // post richtext root
    '.Post h1, .Post h2, .Post h3',        // post titles in Post scope
    // comment containers (new reddit)
    '.Comment .RichTextJSON-root',
    '.Comment .md',                        // comment markdown inside Comment scope
    // elements with id patterns reddit uses for rtjson content (t3_ = post, t1_ = comment)
    'div[id^="t3_"][id$="-post-rtjson-content"]',
    'div[id^="t1_"][id$="-comment-rtjson-content"]',
    // legacy or shadow wrappers that hold post text
    'shreddit-post-text-body',
    // inputs inside comment/post composer areas (we still restrict to visible inputs)
    'textarea[name], input[type="text"], input[type="search"]'
  ];

  // keep track of nodes already processed
  const processed = new WeakSet();

  function getTextForNode(node) {
    if (!node) return '';
    let t = node.textContent || '';
    // collapse whitespace and trim
    t = t.replace(/\s+/g, ' ').trim();
    if (t.length > 5000) t = t.slice(0, 5000);
    return t;
  }

  function elementHasExplicitDirOrIsUi(el) {
    try {
      if (!el || el.nodeType !== 1) return false;
      // explicit dir attribute means site already decided direction; don't override
      if (el.hasAttribute('dir')) return true;
      // if computed style already rtl this is likely intentional: skip
      const cs = window.getComputedStyle(el);
      if (cs && cs.direction === 'rtl') return true;
    } catch (e) {}
    return false;
  }

  // determine whether node is really a post or comment body area by checking closest ancestors
  function isPostOrCommentScope(el) {
    if (!el || el.nodeType !== 1) return false;
    try {
      // check for explicit wrappers that indicate post/comment scope
      const scope = el.closest(
        'article.Post, .Post, .Comment, [data-test-id="post-content"], shreddit-post-text-body, [id^="t3_"], [id^="t1_"]'
      );
      if (!scope) return false;

      // extra safeguard: avoid applying inside common chrome regions
      // if the scope is inside header/nav/aside or topbar, treat as not a content scope
      if (scope.closest('header, nav, aside, .side, .TopNav, #header, [role="navigation"], .nav, .navbar')) return false;

      // if scope has classes that look like UI chrome (e.g., tooltips, menus), skip
      const className = scope.className || '';
      if (typeof className === 'string' && /(menu|tooltip|dropdown|popover|modal|banner|nav|header|footer|side|sidebar)/i.test(className)) {
        // but don't reject if it's clearly Post or Comment
        if (!/Post|Comment|post|comment/i.test(className)) return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  function applyRtlToElement(el) {
    if (!el || processed.has(el)) return;
    // never touch <body> or html roots
    if (el === document.documentElement || el === document.body) { processed.add(el); return; }

    // if any ancestor set dir explicitly, do not override
    for (let a = el; a && a.nodeType === 1; a = a.parentNode) {
      if (a.hasAttribute && a.hasAttribute('dir')) { processed.add(el); return; }
    }

    const text = getTextForNode(el);
    if (!text) { processed.add(el); return; }

    if (!textIsRTL(text)) { processed.add(el); return; }

    // only apply if this element is within a post or comment scope
    if (!isPostOrCommentScope(el)) { processed.add(el); return; }

    try {
      // prefer native attribute first
      el.setAttribute('dir', 'rtl');
      // inline style fallback to win against strong site css where necessary
      el.style.textAlign = 'right';
      el.style.unicodeBidi = 'plaintext';

      // ensure code/pre inside remain LTR for readability
      const codeBlocks = el.querySelectorAll && el.querySelectorAll('code, pre');
      if (codeBlocks && codeBlocks.length) {
        for (let i = 0; i < codeBlocks.length; i++) {
          const cb = codeBlocks[i];
          cb.setAttribute('dir', 'ltr');
          cb.style.textAlign = 'left';
          cb.style.unicodeBidi = 'embed';
        }
      }
    } catch (e) {
      // ignore and mark processed
      console.error('applyRtlToElement error', e);
    } finally {
      processed.add(el);
    }
  }

  function scanRoot(root = document) {
    try {
      for (const sel of TARGET_SELECTORS) {
        let list = [];
        try {
          list = root.querySelectorAll ? root.querySelectorAll(sel) : [];
        } catch (e) {
          // selector might fail on some roots (shadow/other). skip.
          continue;
        }
        for (let i = 0; i < list.length; i++) {
          const el = list[i];
          // skip UI / chrome obvious nodes quickly
          if (elementHasExplicitDirOrIsUi(el)) { processed.add(el); continue; }
          // for inputs handle separately
          if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && /(text|search)/i.test(el.type))) {
            // attach input listener (handled elsewhere) but do an initial check
            try {
              if (textIsRTL(el.value || el.textContent || '')) {
                if (isPostOrCommentScope(el)) {
                  el.setAttribute('dir', 'rtl');
                  el.style.textAlign = 'right';
                  el.style.unicodeBidi = 'plaintext';
                }
              }
            } catch (e) {}
            processed.add(el);
            continue;
          }
          applyRtlToElement(el);
        }
      }
    } catch (e) {
      console.error('scanRoot error', e);
    }
  }

  function attachInputListeners(root = document) {
    try {
      const inputs = root.querySelectorAll ? root.querySelectorAll('textarea, input[type="text"], input[type="search"]') : [];
      for (let i = 0; i < inputs.length; i++) {
        const el = inputs[i];
        if (el._rtl_listener) continue;
        const fn = () => {
          try {
            if (textIsRTL(el.value || el.textContent || '')) {
              if (isPostOrCommentScope(el)) {
                el.setAttribute('dir', 'rtl');
                el.style.textAlign = 'right';
                el.style.unicodeBidi = 'plaintext';
              }
            } else {
              // If not RTL, only remove attributes we set; don't touch other attributes
              if (el.getAttribute('dir') === 'rtl') el.removeAttribute('dir');
              // clear inline style properties we used, but preserve other inline styles by only touching these props
              el.style.textAlign = '';
              el.style.unicodeBidi = '';
            }
          } catch (e) {}
        };
        el.addEventListener('input', fn);
        el._rtl_listener = true;
        fn(); // initial
      }
    } catch (e) {}
  }

  function observeDom() {
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.addedNodes && r.addedNodes.length) {
          for (let i = 0; i < r.addedNodes.length; i++) {
            const n = r.addedNodes[i];
            if (!n) continue;
            if (n.nodeType === Node.ELEMENT_NODE) {
              // scan subtree element for our targeted selectors
              scanRoot(n);
              attachInputListeners(n);
              // handle potential open shadow roots
              try {
                if (n.shadowRoot) { scanRoot(n.shadowRoot); attachInputListeners(n.shadowRoot); }
                const kids = n.querySelectorAll && n.querySelectorAll('*');
                if (kids) {
                  for (let j = 0; j < kids.length; j++) {
                    const k = kids[j];
                    if (k.shadowRoot) { scanRoot(k.shadowRoot); attachInputListeners(k.shadowRoot); }
                  }
                }
              } catch (e) {}
            } else if (n.nodeType === Node.TEXT_NODE) {
              const p = n.parentNode;
              if (p) applyRtlToElement(p);
            }
          }
        }
        if (r.type === 'characterData') {
          const p = r.target && r.target.parentNode;
          if (p) applyRtlToElement(p);
        }
      }
    });

    mo.observe(document, { childList: true, subtree: true, characterData: true });
  }

  // initial run
  scanRoot();
  attachInputListeners();
  observeDom();

  // periodic fallback scan for rare cases; clear after 2 minutes
  const intervalId = setInterval(() => {
    scanRoot();
    attachInputListeners();
  }, 3000);
  setTimeout(() => clearInterval(intervalId), 2 * 60 * 1000);

})();
