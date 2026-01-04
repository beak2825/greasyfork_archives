// ==UserScript==
// @name         YOUR_SCRIPT_NAME
// @namespace    https://greasyfork.org/users/your-id
// @version      0.1.0
// @description  One-line description of what this script does.
// @author       You
// @license      MIT
// @match        https://example.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560907/YOUR_SCRIPT_NAME.user.js
// @updateURL https://update.greasyfork.org/scripts/560907/YOUR_SCRIPT_NAME.meta.js
// ==/UserScript==

/**
 * GreasyFork-friendly guidelines used here:
 * - No obfuscation, no eval/new Function.
 * - Minimal @grant and permissions.
 * - Clear comments + predictable structure.
 * - Safe DOM operations + mutation observer cleanup.
 */
(() => {
  'use strict';

  // -----------------------------
  // Config / Feature flags
  // -----------------------------

  /** Toggle debug logs (default: false). */
  const DEBUG = false;

  /** Namespaced storage key prefix to avoid collisions with other scripts. */
  const STORE_PREFIX = 'your_script_name:';

  /** Simple logger wrapper to avoid noisy console. */
  const log = (...args) => { if (DEBUG) console.log('[YOUR_SCRIPT_NAME]', ...args); };

  // -----------------------------
  // Utilities
  // -----------------------------

  /**
   * Read value from Greasemonkey/Tampermonkey storage.
   * @template T
   * @param {string} key
   * @param {T} fallback
   * @returns {T}
   */
  function getStore(key, fallback) {
    try {
      return /** @type {any} */ (GM_getValue(STORE_PREFIX + key, fallback));
    } catch (e) {
      log('GM_getValue failed:', e);
      return fallback;
    }
  }

  /**
   * Save value to storage.
   * @param {string} key
   * @param {any} value
   */
  function setStore(key, value) {
    try {
      GM_setValue(STORE_PREFIX + key, value);
    } catch (e) {
      log('GM_setValue failed:', e);
    }
  }

  /**
   * Wait for an element to appear, then resolve.
   * Uses polling with timeout to stay simple & robust.
   * @param {string} selector
   * @param {{timeoutMs?: number, intervalMs?: number, root?: ParentNode}} [opts]
   * @returns {Promise<Element>}
   */
  function waitForSelector(selector, opts = {}) {
    const {
      timeoutMs = 10_000,
      intervalMs = 200,
      root = document
    } = opts;

    return new Promise((resolve, reject) => {
      const start = Date.now();

      const timer = setInterval(() => {
        const el = root.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
          return;
        }
        if (Date.now() - start > timeoutMs) {
          clearInterval(timer);
          reject(new Error(`Timeout waiting for selector: ${selector}`));
        }
      }, intervalMs);
    });
  }

  /**
   * Add CSS safely.
   * @param {string} css
   */
  function addCss(css) {
    try {
      GM_addStyle(css);
    } catch {
      // Fallback for environments without GM_addStyle
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  // -----------------------------
  // Core logic (replace with your own)
  // -----------------------------

  /**
   * Perform one-time initialization.
   * Put your main logic here.
   */
  async function main() {
    log('init');

    // Example: inject styles
    addCss(`
      /* YOUR_SCRIPT_NAME styles */
      .ysn-hidden { display: none !important; }
    `);

    // Example: wait for key element
    // (Replace selectors with your real target)
    try {
      const target = await waitForSelector('body');
      log('target ready:', target);

      // Example: apply once
      applyOnce();

      // Example: observe DOM changes if the site is SPA
      startObserver();
    } catch (e) {
      console.warn('[YOUR_SCRIPT_NAME] init failed:', e);
    }
  }

  /**
   * Apply changes once (idempotent).
   * Make sure repeated calls won't duplicate UI or listeners.
   */
  function applyOnce() {
    // Idempotency guard example
    const markerId = 'ysn-marker';
    if (document.getElementById(markerId)) return;

    const marker = document.createElement('div');
    marker.id = markerId;
    marker.style.display = 'none';
    document.documentElement.appendChild(marker);

    // TODO: Your actual one-time modifications
    // - Hide elements
    // - Add buttons
    // - Patch text
    log('applyOnce done');
  }

  /**
   * Mutation observer handler (keep fast!).
   * Avoid heavy querySelectorAll on every mutation.
   * @param {MutationRecord[]} mutations
   */
  function onMutation(mutations) {
    // Example: cheap detection strategy
    for (const m of mutations) {
      if (m.type === 'childList' && (m.addedNodes?.length || m.removedNodes?.length)) {
        // TODO: Your incremental updates
        // Tip: only touch relevant nodes or re-run small idempotent function
        // applyIncremental();
        break;
      }
    }
  }

  /** Keep observer reference for cleanup. */
  let observer = null;

  /** Start observing SPA page updates. */
  function startObserver() {
    if (observer) return;
    observer = new MutationObserver(onMutation);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    log('observer started');
  }

  /** Stop observer if needed. */
  function stopObserver() {
    if (!observer) return;
    observer.disconnect();
    observer = null;
    log('observer stopped');
  }

  // -----------------------------
  // Boot
  // -----------------------------

  // If the site is heavy SPA, document-idle is usually safer.
  // You can also gate by readyState.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main, { once: true });
  } else {
    void main();
  }

  // Optional: cleanup when leaving page (rarely needed in userscripts)
  window.addEventListener('beforeunload', () => {
    stopObserver();
  });
})();
