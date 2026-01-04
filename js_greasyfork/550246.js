// ==UserScript==
// @name         Auto-RTL
// @namespace    https://greasyfork.org/en/users/1374110-momo21798
// @version      0.4.3
// @description  Content-only RTL: p/li/blockquote + spans in content areas. First alphabetic char decides. Ultra-light (IO/MO/RAF). Per-domain toggle (OFF by default). Ctrl+Alt+R hotkey. Tiny, transparent edge toggle near scrollbar.
// @author       Momo
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550246/Auto-RTL.user.js
// @updateURL https://update.greasyfork.org/scripts/550246/Auto-RTL.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---------- Config ----------
  const RTL_CLASS = 'rtl-first-alpha-ar';
  const UI_ID = 'rtl-first-alpha-toggle';
  const STYLE_ID = 'rtl-first-alpha-style';
  const DOMAIN_KEY = (host) => `rtl-first-alpha:domain:${host}`; // per-domain state
  const host = location.hostname;

  // Content containers (safe defaults; extend as needed)
  const CONTENT_SELECTORS = [
    'main', 'article', '[role="main"]', '[role="article"]',
    '.content', '.post', '.entry', '.article', '.story', '.note', '.prose', '.markdown-body',
    '#content', '#main',
    // Substack helpers (harmless elsewhere)
    '.feedCommentBody-UWho7S', '[class*="feedCommentBody-"]', '[data-testid="note-body"]'
  ];

  // Elements to target inside content
  const TARGET_TAGS = new Set(['P', 'LI', 'BLOCKQUOTE', 'SPAN']);

  // Skip inside these (avoid nav/buttons/labels/inputs/etc.)
  const SKIP_ANCESTOR = 'a, button, [role="button"], [role="link"], nav, header, footer, aside, [contenteditable="true"], input, textarea, select, label';

  // ---------- Persistence ----------
  const getDomainState = () => localStorage.getItem(DOMAIN_KEY(host)) ?? 'off'; // default OFF globally
  const setDomainState = (state) => localStorage.setItem(DOMAIN_KEY(host), state);
  const isOn = () => getDomainState() === 'on';

  // ---------- Styles (toggle is tiny, elegant, transparent) ----------
  const STYLES = `
.${RTL_CLASS} {
  direction: rtl !important;
  unicode-bidi: plaintext !important;
  text-align: justify !important;
  text-align-last: right;
}
.${RTL_CLASS} * {
  direction: inherit !important;
  unicode-bidi: inherit !important;
  text-align: inherit !important;
}

/* tiny pill toggle near scrollbar, mid-right */
#${UI_ID} {
  position: fixed;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  z-index: 2147483646;
  width: 38px;
  height: 20px;
  border-radius: 999px;
  background: rgba(20,20,20,.25);
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  display: inline-flex;
  align-items: center;
  padding: 2px;
  cursor: pointer;
  opacity: .22;
  transition: opacity .18s ease, background .18s ease, box-shadow .18s ease, transform .18s ease;
  outline: none;
}
#${UI_ID}:hover { opacity: .95; background: rgba(20,20,20,.65); }
#${UI_ID}:active { transform: translateY(-50%) scale(0.98); }
#${UI_ID}.on { background: rgba(9,140,110,.55); }
#${UI_ID}.on:hover { background: rgba(9,140,110,.75); }

#${UI_ID} .knob {
  width: 16px; height: 16px; border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.4);
  transform: translateX(0);
  transition: transform .18s ease;
}
#${UI_ID}.on .knob { transform: translateX(18px); }

/* Focus ring for keyboard users */
#${UI_ID}:focus-visible {
  box-shadow: 0 0 0 2px rgba(255,255,255,.9), 0 0 0 5px rgba(20,20,20,.6);
  opacity: .98;
}

/* Keep clear of notches / overlay scrollbars */
@supports (env(safe-area-inset-right: 0)) {
  #${UI_ID} { right: calc(6px + env(safe-area-inset-right)); }
}

/* optional: avoid hover opacity bump on small touch devices */
@media (hover: none) and (pointer: coarse) {
  #${UI_ID} { opacity: .6; }
}
`;

  // ---------- Unicode helpers ----------
  let LETTER_RE, ARABIC_LETTER_RE;
  try {
    LETTER_RE = /\p{L}/u;                 // any Unicode letter
    ARABIC_LETTER_RE = /^\p{Script=Arabic}$/u; // Arabic-script letter
  } catch {
    LETTER_RE = /[A-Za-z\u00C0-\u02AF\u0370-\u03FF\u0400-\u052F\u0531-\u058F\u10A0-\u10FF\u1E00-\u1EFF\u2C00-\u2C7F\uA720-\uA7FF\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    ARABIC_LETTER_RE = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]$/;
  }
  const stripInvisibles = (s) => s.replace(/[\u200E\u200F\u061C\u200B-\u200D\u2066-\u2069]/g, '');
  const firstAlphabetic = (s) => {
    if (!s) return '';
    const t = stripInvisibles(s).normalize('NFC');
    const m = t.match(LETTER_RE);
    return m ? m[0] : '';
  };
  const shouldBeRTL = (el) => {
    const t = el.textContent || '';
    const ch = firstAlphabetic(t);
    return ch ? ARABIC_LETTER_RE.test(ch) : false;
  };

  // ---------- Utilities ----------
  const debounce = (fn, ms = 120) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; };
  const isInContentContainer = (el) => !!el.closest(CONTENT_SELECTORS.join(','));
  const shouldSkipEl = (el) => {
    if (!TARGET_TAGS.has(el.tagName)) return true;
    if (el.closest(SKIP_ANCESTOR)) return true;
    if (el.closest('pre, code, [data-code-block], .code, .hljs')) return true;
    if (!isInContentContainer(el)) return true;
    return false;
  };

  // ---------- Observers + Work Queue ----------
  const seen = new WeakSet();
  const queue = new Set();
  let rafId = 0;

  const processEl = (el) => {
    if (!el.isConnected) return;
    if (!isOn()) { el.classList.remove(RTL_CLASS); return; }
    if (!seen.has(el)) {
      seen.add(el);
      if (shouldBeRTL(el)) el.classList.add(RTL_CLASS);
      else el.classList.remove(RTL_CLASS);
    }
  };

  const kickWork = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      let count = 0, MAX = 250;
      for (const el of queue) {
        queue.delete(el);
        processEl(el);
        if (++count >= MAX) break;
      }
      if (queue.size) kickWork();
    });
  };

  // Viewport observer (preloads ~600px ahead)
  const io = new IntersectionObserver((entries) => {
    if (!isOn()) return;
    for (const e of entries) if (e.isIntersecting) queue.add(e.target);
    kickWork();
  }, { root: null, rootMargin: '600px 0px', threshold: 0 });

  const observeEl = (el) => { if (!shouldSkipEl(el)) io.observe(el); };
  const observeExisting = () => {
    const rootSel = CONTENT_SELECTORS.join(',');
    document.querySelectorAll(rootSel).forEach(root => {
      root.querySelectorAll('p, li, blockquote, span').forEach(observeEl);
    });
  };

  const mo = new MutationObserver((muts) => {
    let touched = false;
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(n => {
          if (n.nodeType !== 1) return;
          if (n.matches?.(CONTENT_SELECTORS.join(','))) {
            n.querySelectorAll('p, li, blockquote, span').forEach(observeEl);
            touched = true;
          }
          n.querySelectorAll?.('p, li, blockquote, span').forEach((el) => {
            if (!shouldSkipEl(el)) { observeEl(el); touched = true; }
          });
          if (n.matches?.('p, li, blockquote, span') && !shouldSkipEl(n)) { observeEl(n); touched = true; }
        });
      } else if (m.type === 'characterData') {
        const el = m.target.parentElement?.closest?.('p, li, blockquote, span');
        if (el && !shouldSkipEl(el)) { seen.delete(el); observeEl(el); queue.add(el); touched = true; }
      }
    }
    if (touched) kickWork();
  });

  // ---------- UI (tiny pill toggle) ----------
  const ensureStyle = () => {
    if (!document.getElementById(STYLE_ID)) {
      const st = document.createElement('style');
      st.id = STYLE_ID;
      st.textContent = STYLES;
      document.head.appendChild(st);
    }
  };

  const updateUIButton = (btn) => {
    const on = isOn();
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-checked', String(on));
    btn.setAttribute('title', `RTL auto-detect is ${on ? 'ON' : 'OFF'} — Ctrl+Alt+R`);
  };

  const ensureUI = () => {
    if (document.getElementById(UI_ID)) return;
    const btn = document.createElement('button');
    btn.id = UI_ID;
    btn.type = 'button';
    btn.setAttribute('role', 'switch');
    btn.setAttribute('aria-label', 'Toggle Arabic/Persian RTL auto-detect for this domain');
    btn.innerHTML = '<span class="knob" aria-hidden="true"></span>';

    updateUIButton(btn);

    const toggle = () => {
      const state = isOn() ? 'off' : 'on';
      setDomainState(state);
      updateUIButton(btn);
      if (state === 'on') refreshAll(); else clearAll();
    };

    btn.addEventListener('click', (e) => { e.preventDefault(); toggle(); });
    btn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
    });

    document.documentElement.appendChild(btn);
  };

  // ---------- Controls ----------
  const clearAll = () => {
    queue.clear();
    document.querySelectorAll(`.${RTL_CLASS}`).forEach(el => el.classList.remove(RTL_CLASS));
  };

  const refreshAll = () => {
    queue.clear();
    observeExisting();
    kickWork();
  };

  const hookHistory = () => {
    const wrap = (fn) => function () { const r = fn.apply(this, arguments); onNav(); return r; };
    const onNav = debounce(() => { if (isOn()) refreshAll(); }, 80);
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', onNav);
  };

  const onHotkey = (e) => {
    if (e.ctrlKey && e.altKey && (e.key === 'r' || e.key === 'R')) {
      e.preventDefault();
      const state = isOn() ? 'off' : 'on';
      setDomainState(state);
      const btn = document.getElementById(UI_ID);
      if (btn) updateUIButton(btn);
      if (state === 'on') refreshAll(); else clearAll();
    }
  };

  // ---------- Init ----------
  const init = () => {
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init, { once: true }); return; }
    ensureStyle();
    ensureUI();
    observeExisting();
    mo.observe(document.body || document.documentElement, { childList: true, subtree: true, characterData: true });
    hookHistory();
    if (isOn()) kickWork();
    window.addEventListener('keydown', onHotkey, true);
  };

  init();
})();
