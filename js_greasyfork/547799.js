// ==UserScript==
// @name         Torn – Hide Notes Button (site-wide)
// @namespace    ASTA-MK
// @version      1.0
// @license      MIT
// @description  Hides the Notes button across all Torn pages, including dynamic loads and shadow roots.
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547799/Torn%20%E2%80%93%20Hide%20Notes%20Button%20%28site-wide%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547799/Torn%20%E2%80%93%20Hide%20Notes%20Button%20%28site-wide%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Hide via CSS as early as possible (works if not inside a shadow root)
  try {
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(`#notes_panel_button{display:none !important;}`);
    } else {
      const style = document.createElement('style');
      style.textContent = `#notes_panel_button{display:none !important;}`;
      document.documentElement.appendChild(style);
    }
  } catch {}

  // Helper: hide an element robustly
  function hideEl(el) {
    if (!el) return;
    el.setAttribute('hidden', 'true');
    el.setAttribute('aria-hidden', 'true');
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('pointer-events', 'none', 'important');
  }

  // Search a root (document or shadowRoot) for matches
  function hideInRoot(root) {
    if (!root || !root.querySelectorAll) return;
    // Primary target by ID, plus a safe fallback by title (in case ID changes)
    const candidates = root.querySelectorAll(
      '#notes_panel_button, button#notes_panel_button, button[title="Notes"]#notes_panel_button, button[title="Notes"]'
    );
    candidates.forEach(hideEl);
  }

  // Recursively observe document + any shadow roots
  function observeRoot(root) {
    if (!root) return;

    // Initial pass
    hideInRoot(root);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        // Check added nodes directly
        m.addedNodes && m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return; // ELEMENT_NODE
          // If this node is the button or contains it, hide it
          if (
            node.id === 'notes_panel_button' ||
            (node.matches && node.matches('button[title="Notes"]')) ||
            (node.querySelectorAll && node.querySelectorAll('#notes_panel_button, button[title="Notes"]').length)
          ) {
            hideInRoot(node.ownerDocument || document);
            hideInRoot(node.shadowRoot || node);
          }
          // If this node has a shadow root, observe inside it too
          if (node.shadowRoot) observeRoot(node.shadowRoot);
        });
      }
    });

    mo.observe(root, { childList: true, subtree: true });

    // Also hook into any existing shadow roots under this root
    if (root.querySelectorAll) {
      root.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) observeRoot(el.shadowRoot);
      });
    }
  }

  // Start observing as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => observeRoot(document));
  } else {
    observeRoot(document);
  }

  // Extra: catch late-created top-level shadow roots (rare, but cheap)
  new MutationObserver(() => {
    document.querySelectorAll('*').forEach((el) => {
      if (el.shadowRoot && !el.shadowRoot.__tornNotesObserved) {
        el.shadowRoot.__tornNotesObserved = true;
        observeRoot(el.shadowRoot);
      }
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
