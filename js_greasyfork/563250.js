// ==UserScript==
// @name         LMArena Chat Full Width
// @name:zh-TW   LMArena 全寬度聊天訊息
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Remove max-width constraints from LMArena chat containers for a full-width reading experience. Works across all chat modes.
// @description:zh-TW  讓 LMArena 的聊天訊息延展至全螢幕寬度，獲得更舒適的閱讀體驗。
// @author       Community
// @match        https://arena.ai/*
// @match        https://beta.lmarena.ai/*
// @icon         https://arena.ai/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563250/LMArena%20Chat%20Full%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/563250/LMArena%20Chat%20Full%20Width.meta.js
// ==/UserScript==

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  LMArena Chat Full Width                                                  ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  DESIGN PHILOSOPHY:                                                       ║
 * ║  • CSS-first approach for performance and instant application             ║
 * ║  • JavaScript fallback for edge cases (inline styles, dynamic content)    ║
 * ║  • Minimal runtime overhead with smart debouncing                         ║
 * ║  • Comprehensive selector coverage based on real DOM analysis             ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════════
   * CONFIGURATION
   * ═══════════════════════════════════════════════════════════════════════════ */

  const CONFIG = Object.freeze({
    // Maximum ancestor levels to traverse when clearing max-width
    MAX_ANCESTOR_DEPTH: 12,

    // Debounce interval for mutation handling (ms) — roughly 1 frame at 60fps
    DEBOUNCE_MS: 16,

    // Selectors for Sentry-instrumented message components
    MESSAGE_COMPONENTS: [
      '[data-sentry-component="UserMessage"]',
      '[data-sentry-component="BotMessage"]',
      '[data-sentry-component="AIMessage"]',
      '[data-sentry-component="ParallelMessageGroup"]',
    ],

    // Additional structural selectors observed in LMArena DOM
    STRUCTURAL_SELECTORS: [
      '#chat-area',
      'main',
      'main ol',
      'main ol > li',
      'main ol > div',
    ],
  });

  /* ═══════════════════════════════════════════════════════════════════════════
   * CSS STYLES
   * Injected at document-start to prevent FOUC (Flash of Unstyled Content)
   * ═══════════════════════════════════════════════════════════════════════════ */

  const CSS = /* css */ `
/*******************************************************************************
 * LMArena Chat Full Width — Injected Styles
 * Priority: !important ensures override of Tailwind/inline styles
 ******************************************************************************/

/* ═══════════════════════════════════════════════════════════════════════════
   Layer 1: Primary Layout Containers
   ═══════════════════════════════════════════════════════════════════════════ */

#chat-area,
main,
main > div {
  max-width: none !important;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Layer 2: Sentry-Instrumented Message Components
   These are the core chat message wrappers identified via data attributes
   ═══════════════════════════════════════════════════════════════════════════ */

[data-sentry-component="UserMessage"],
[data-sentry-component="BotMessage"],
[data-sentry-component="AIMessage"],
[data-sentry-component="ParallelMessageGroup"] {
  max-width: none !important;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Layer 3: Parent Container Targeting via :has()
   Removes constraints from wrapper divs that contain message components
   ═══════════════════════════════════════════════════════════════════════════ */

/* Direct parent */
div:has(> [data-sentry-component="UserMessage"]),
div:has(> [data-sentry-component="BotMessage"]),
div:has(> [data-sentry-component="AIMessage"]),
div:has(> [data-sentry-component="ParallelMessageGroup"]) {
  max-width: none !important;
}

/* Grandparent (handles nested wrapper patterns) */
div:has(> div > [data-sentry-component="UserMessage"]),
div:has(> div > [data-sentry-component="BotMessage"]),
div:has(> div > [data-sentry-component="AIMessage"]),
div:has(> div > [data-sentry-component="ParallelMessageGroup"]) {
  max-width: none !important;
}

/* Great-grandparent (deep nesting edge cases) */
div:has(> div > div > [data-sentry-component]) {
  max-width: none !important;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Layer 4: Tailwind CSS Utility Class Override
   Catches max-w-sm, max-w-md, max-w-lg, max-w-xl, max-w-2xl, etc.
   ═══════════════════════════════════════════════════════════════════════════ */

main [class*="max-w-"],
#chat-area [class*="max-w-"],
div[class*="max-w-"]:has([data-sentry-component]) {
  max-width: none !important;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Layer 5: Chat List Structures
   Common patterns observed in LMArena's chat layout
   ═══════════════════════════════════════════════════════════════════════════ */

/* Ordered list used for message history */
main ol[class*="flex-col"],
main ol[class*="flex-col-reverse"] {
  max-width: none !important;
}

/* List items and dividers */
main ol > li,
main ol > div {
  max-width: none !important;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Layer 6: Flex Container Overrides
   Ensures flex children can expand fully
   ═══════════════════════════════════════════════════════════════════════════ */

main [class*="flex"][class*="w-full"] {
  max-width: none !important;
}

/* Message content areas */
[data-sentry-component] [class*="prose"],
[data-sentry-component] [class*="markdown"] {
  max-width: none !important;
}
`;

  /* ═══════════════════════════════════════════════════════════════════════════
   * UTILITY FUNCTIONS
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Injects CSS into the document using the most reliable method available.
   * @param {string} cssText - The CSS rules to inject
   */
  function injectStyles(cssText) {
    // Prefer GM_addStyle for proper userscript style management
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(cssText);
      return;
    }

    // Fallback: Create and inject a <style> element
    const style = document.createElement('style');
    style.setAttribute('data-injected-by', 'lmarena-fullwidth');
    style.textContent = cssText;

    // Insert at the earliest possible point
    const target = document.head || document.documentElement;
    if (target.firstChild) {
      target.insertBefore(style, target.firstChild);
    } else {
      target.appendChild(style);
    }
  }

  /**
   * Creates a debounced version of a function.
   * Uses requestAnimationFrame for optimal performance.
   * @param {Function} fn - The function to debounce
   * @returns {Function} - The debounced function
   */
  function rafDebounce(fn) {
    let frameId = null;

    return function debounced(...args) {
      if (frameId !== null) return;

      frameId = requestAnimationFrame(() => {
        fn.apply(this, args);
        frameId = null;
      });
    };
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * RUNTIME MAX-WIDTH ENFORCEMENT
   * JavaScript fallback for cases CSS cannot handle (e.g., inline styles,
   * dynamically computed styles, or deeply nested structures)
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Traverses the DOM upward from message components, forcibly removing
   * any max-width constraints encountered.
   */
  function enforceMaxWidthRemoval() {
    const selector = CONFIG.MESSAGE_COMPONENTS.join(',');
    const messageNodes = document.querySelectorAll(selector);

    if (messageNodes.length === 0) return;

    messageNodes.forEach((node) => {
      traverseAndClearMaxWidth(node);
    });
  }

  /**
   * Walks up the DOM tree from a starting node, clearing max-width on each ancestor.
   * @param {Element} startNode - The node to start from
   */
  function traverseAndClearMaxWidth(startNode) {
    let current = startNode;
    let depth = 0;

    while (current && current !== document.body && depth < CONFIG.MAX_ANCESTOR_DEPTH) {
      clearMaxWidthIfConstrained(current);
      current = current.parentElement;
      depth++;
    }
  }

  /**
   * Clears max-width on an element if it has a constraining value.
   * @param {Element} element - The element to check and potentially modify
   */
  function clearMaxWidthIfConstrained(element) {
    // Skip if already processed
    if (element.dataset.fullwidthProcessed === 'true') return;

    const computedStyle = getComputedStyle(element);
    const maxWidth = computedStyle.maxWidth;

    // Check if there's an actual constraint to remove
    const isConstrained = maxWidth &&
                          maxWidth !== 'none' &&
                          maxWidth !== '0px' &&
                          !maxWidth.startsWith('0');

    if (isConstrained) {
      element.style.setProperty('max-width', 'none', 'important');
      element.dataset.fullwidthProcessed = 'true';
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * DOM MUTATION OBSERVER
   * Monitors for dynamically added/modified chat messages
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Creates and configures a MutationObserver to watch for DOM changes.
   * @returns {MutationObserver} - The configured observer
   */
  function createMutationObserver() {
    const debouncedEnforce = rafDebounce(enforceMaxWidthRemoval);

    return new MutationObserver((mutations) => {
      // Quick check: only process if mutations might be relevant
      const hasRelevantMutation = mutations.some((mutation) =>
        mutation.type === 'childList' && mutation.addedNodes.length > 0
      );

      if (hasRelevantMutation) {
        debouncedEnforce();
      }
    });
  }

  /**
   * Starts observing the most appropriate container for DOM changes.
   * @param {MutationObserver} observer - The observer to start
   */
  function startObserving(observer) {
    // Prefer the most specific container to reduce noise
    const observationTarget =
      document.querySelector('#chat-area') ||
      document.querySelector('main') ||
      document.body;

    observer.observe(observationTarget, {
      childList: true,
      subtree: true,
      // attributes: false — we don't need to watch attribute changes
      // characterData: false — we don't need to watch text content changes
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * INITIALIZATION
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Main initialization function.
   * Orchestrates style injection and observer setup.
   */
  function initialize() {
    // ─────────────────────────────────────────────────────────────────────────
    // Phase 1: Immediate CSS Injection
    // Runs at document-start, before any content renders
    // ─────────────────────────────────────────────────────────────────────────
    injectStyles(CSS);

    // ─────────────────────────────────────────────────────────────────────────
    // Phase 2: DOM-Ready Actions
    // Set up observer and run initial enforcement once DOM is available
    // ─────────────────────────────────────────────────────────────────────────
    const observer = createMutationObserver();

    const onDomReady = () => {
      enforceMaxWidthRemoval();
      startObserving(observer);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onDomReady, { once: true });
    } else {
      // DOM already available (e.g., script loaded late)
      onDomReady();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Phase 3: Post-Load Sweep
    // Catches any late-loading content or async-rendered components
    // ─────────────────────────────────────────────────────────────────────────
    window.addEventListener('load', enforceMaxWidthRemoval, { once: true });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * SCRIPT ENTRY POINT
   * ═══════════════════════════════════════════════════════════════════════════ */

  initialize();

})();