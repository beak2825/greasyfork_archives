// ==UserScript==
// @name         Torn Poker: Disable "Sit out" Button
// @namespace    https://torn.tools/quill
// @version      1.0.0
// @description  Prevent accidental "Sit out" on Torn poker by disabling and blocking the button (including when "Check" flips to "Sit out").
// @author       Qfiffle
// @match        https://www.torn.com/page.php?sid=holdem*
// @run-at       document-idle
// @license  MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563544/Torn%20Poker%3A%20Disable%20%22Sit%20out%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/563544/Torn%20Poker%3A%20Disable%20%22Sit%20out%22%20Button.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---- Config --------------------------------------------------------------
  const STORAGE_KEY = 'tornPokerSitOutBlockerEnabled';
  const DEFAULT_ENABLED = true;

  // Optional: restrict to URLs that look like poker/hold’em tables.
  // Leave broad but inert: script only acts on buttons that look like poker actions.
  const urlLooksLikePoker = () => {
    const u = location.href.toLowerCase();
    return u.includes('poker') || u.includes('hold') || u.includes('texas') || u.includes('casino');
  };

  // We also try to heuristically detect the action bar container to reduce false positives:
  const ACTION_KEYWORDS = ['check', 'call', 'bet', 'raise', 'fold'];

  // ---- State ---------------------------------------------------------------
  const getEnabled = () => {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === null ? DEFAULT_ENABLED : v === '1';
  };
  const setEnabled = (on) => localStorage.setItem(STORAGE_KEY, on ? '1' : '0');

  let enabled = getEnabled();

  // ---- Utilities -----------------------------------------------------------
  const normText = (el) => (el?.textContent || '').trim().toLowerCase();

  const isLikelyActionButton = (el) => {
    if (!el || !(el instanceof Element)) return false;
    const role = el.getAttribute('role');
    const isBtn = el.tagName === 'BUTTON' || role === 'button' || el.className.toLowerCase().includes('button');
    if (!isBtn) return false;
    // Avoid generic site buttons unless they're in an action area
    const t = normText(el);
    return t.length <= 20; // poker action labels are short
  };

  const hasActionSiblings = (btn) => {
    // If the container holds other action words, we’re probably in the poker action bar.
    const container = btn.closest('div,section,footer,main,[role="toolbar"]');
    if (!container) return false;
    const text = normText(container);
    return ACTION_KEYWORDS.some(k => text.includes(k));
  };

  const isSitOutButton = (el) => {
    if (!isLikelyActionButton(el)) return false;
    const t = normText(el);
    if (/^\s*sit\s*out\s*$/i.test(el.textContent || '') || t.includes('sit out')) return true;

    // Attribute hints some UIs use (best-effort):
    const dataAction = (el.getAttribute('data-action') || '').toLowerCase();
    const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
    const nameAttr  = (el.getAttribute('name') || '').toLowerCase();
    const idAttr    = (el.getAttribute('id') || '').toLowerCase();
    const cls       = (el.getAttribute('class') || '').toLowerCase();

    if ([dataAction, ariaLabel, nameAttr, idAttr, cls].some(s => /sit[-_\s]?out/.test(s))) return true;

    // Reduce false positives: prefer cases in action bar context
    return hasActionSiblings(el) && (t.includes('sit') && t.includes('out'));
  };

  const disableButton = (btn) => {
    if (!btn || btn.dataset.__sitout_blocked === '1') return;
    btn.dataset.__sitout_blocked = '1';

    // Full block: disable, block pointer events, and mark clearly.
    try { btn.disabled = true; } catch {}
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.55';
    btn.style.filter = 'grayscale(0.2)';
    btn.style.cursor = 'not-allowed';

    // Clarify visually without changing layout much.
    const t = normText(btn);
    if (!/disabled/i.test(t)) {
      // Don’t blow out ARIA: add title and small suffix visually.
      btn.title = 'Disabled by userscript to prevent accidental Sit out';
      // Non-destructive: wrap text if simple text node
      const labelSpan = document.createElement('span');
      labelSpan.textContent = btn.textContent.trim();
      btn.textContent = '';
      btn.appendChild(labelSpan);
      const suffix = document.createElement('span');
      suffix.textContent = ' (disabled)';
      suffix.style.fontSize = '0.9em';
      suffix.style.opacity = '0.9';
      btn.appendChild(suffix);
    }
  };

  const enableButton = (btn) => {
    if (!btn || btn.dataset.__sitout_blocked !== '1') return;
    delete btn.dataset.__sitout_blocked;
    try { btn.disabled = false; } catch {}
    btn.style.pointerEvents = '';
    btn.style.opacity = '';
    btn.style.filter = '';
    btn.style.cursor = '';
    // Remove our "(disabled)" suffix if present
    const spans = btn.querySelectorAll('span');
    if (spans.length >= 2 && /\(disabled\)/i.test(spans[1].textContent || '')) {
      btn.textContent = spans[0].textContent || 'Sit out';
    }
    if (btn.title && /disabled by userscript/i.test(btn.title)) btn.title = '';
  };

  const processButton = (btn) => {
    if (!enabled) { enableButton(btn); return; }
    if (isSitOutButton(btn)) disableButton(btn);
  };

  const scan = (root = document) => {
    root.querySelectorAll('button, [role="button"], .button, .btn').forEach(processButton);
  };

  // Capture-phase click blocker (extra safety if the site flips labels on the fly)
  const clickBlocker = (e) => {
    if (!enabled) return;
    // Walk up from target to see if a sit-out-like button was hit.
    let el = e.target;
    for (let i = 0; i < 6 && el; i++, el = el.parentElement) {
      if (isSitOutButton(el)) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
    }
  };

  // ---- Shadow DOM support --------------------------------------------------
  // Observe any newly created shadow roots and scan them too.
  const origAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const shadow = origAttachShadow.call(this, init);
    setupObserver(shadow);
    // Initial scan
    queueMicrotask(() => scan(shadow));
    return shadow;
  };

  // ---- Observers -----------------------------------------------------------
  const setupObserver = (root) => {
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            if (n.nodeType !== 1) return; // ELEMENT_NODE
            if (isSitOutButton(n)) processButton(n);
            // Scan within new subtrees
            scan(n);
            // If this node has a shadowRoot, scan it too
            if (n.shadowRoot) scan(n.shadowRoot);
          });
        } else if (m.type === 'attributes' && (m.target.tagName === 'BUTTON' || m.target.getAttribute('role') === 'button')) {
          // If label flips to "Sit out", catch it
          processButton(m.target);
        }
      }
    });
    obs.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-label', 'data-action', 'name', 'id'] });
  };

  // ---- UI Toggle -----------------------------------------------------------
  const addToggle = () => {
    const el = document.createElement('div');
    el.textContent = enabled ? 'Sit-out Block: ON' : 'Sit-out Block: OFF';
    Object.assign(el.style, {
      position: 'fixed',
      zIndex: 999999,
      right: '12px',
      bottom: '12px',
      padding: '8px 10px',
      background: enabled ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)', // green/red-ish
      color: '#fff',
      fontSize: '12px',
      lineHeight: '14px',
      borderRadius: '9999px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
      cursor: 'pointer',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    });
    el.title = 'Click to toggle sit-out blocker for this site';
    el.addEventListener('click', () => {
      enabled = !enabled;
      setEnabled(enabled);
      el.textContent = enabled ? 'Sit-out Block: ON' : 'Sit-out Block: OFF';
      el.style.background = enabled ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)';
      // Re-process any known buttons
      scan(document);
    });
    document.body.appendChild(el);
  };

  // ---- Init ---------------------------------------------------------------
  const init = () => {
    // Only act when likely on or near poker; keeps things quiet elsewhere.
    if (!urlLooksLikePoker()) {
      // Still add a very cheap listener so if a poker widget mounts dynamically, we catch it.
      // Do nothing else until we detect an action-bar shape.
    }
    // Global capture blocker
    window.addEventListener('click', clickBlocker, { capture: true, passive: false });

    // Observe main document
    setupObserver(document);

    // Initial scan
    scan(document);

    // Late UI hook
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      addToggle();
    } else {
      window.addEventListener('DOMContentLoaded', addToggle, { once: true });
    }
  };

  // Kick off
  init();
})();
