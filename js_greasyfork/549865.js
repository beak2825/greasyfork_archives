// ==UserScript==
// @name         Bar-I Invoice Helper (SPA-safe universal loader)
// @namespace    https://greasyfork.org/users/your-username
// @version      4.0.0
// @description  Enhanced invoice helper with progress indicators, optimized performance, better error handling, and improved lazy loading
// @author       Nicolai Mihaic
// @match        https://app.bar-i.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bar-i.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549847/Bar-I%20Invoice%20Helper%20%28SPA-safe%20universal%20loader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549847/Bar-I%20Invoice%20Helper%20%28SPA-safe%20universal%20loader%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** ===============================
   * Configuration & Constants
   * =============================== */
  const CONFIG = {
    ROUTE_RE: /^https?:\/\/app\.bar-i\.com\/barI\/analysis-workflow\/add-invoice\/?/i,
    POLLING_INTERVAL: 300, // Reduced from 200ms for better performance
    LAZY_SCROLL_DELAY: 350, // Optimized from 450ms
    STABILITY_CHECKS: 3,
    MAX_LAZY_LOAD_TIME: 60000,
    BATCH_FILL_DELAY: 8, // Reduced from 10ms
    ERROR_RETRY_ATTEMPTS: 3,
    DEBOUNCE_DELAY: 80 // Increased from 60ms
  };

  const SELECTORS = {
    qty: "input[id^='quantity_fo']",
    extrasQty: "input[id^='extra_quantity_fo']",
    enterTotal: "#enter_total",
    tabLabel: "label",
    vesselTab: () => findTabByText('Vessel'),
    extrasTab: () => findTabByText('Extras')
  };

  /** ===============================
   * Enhanced State Management
   * =============================== */
  const State = {
    started: false,
    urlPoll: null,
    domObs: null,
    buttons: [],
    lazyScrolling: false,
    lastUrl: '',
    retryCount: 0,
    isProcessing: false,

    reset() {
      this.started = false;
      this.lazyScrolling = false;
      this.retryCount = 0;
      this.isProcessing = false;
    }
  };

  /** ===============================
   * Utility Functions
   * =============================== */
  const Utils = {
    sleep: (ms) => new Promise(r => setTimeout(r, ms)),

    onTarget: () => CONFIG.ROUTE_RE.test(location.href),

    debounce: (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    },

    async waitForElement(selector, timeout = 15000, retries = CONFIG.ERROR_RETRY_ATTEMPTS) {
      for (let attempt = 0; attempt < retries; attempt++) {
        const startTime = performance.now();

        while (performance.now() - startTime < timeout) {
          try {
            const element = document.querySelector(selector);
            if (element) return element;
          } catch (error) {
            console.warn(`[Invoice Helper] Error finding element ${selector}:`, error);
          }
          await this.sleep(200);
        }

        if (attempt < retries - 1) {
          console.warn(`[Invoice Helper] Attempt ${attempt + 1} failed for ${selector}, retrying...`);
          await this.sleep(1000);
        }
      }
      return null;
    },

    createProgressIndicator(text, color = '#007bff') {
      const indicator = document.createElement('div');
      indicator.style.cssText = `
        position: fixed;
        top: 100px;
        left: 10px;
        z-index: 2147483647;
        padding: 8px 16px;
        background: ${color};
        color: white;
        border-radius: 6px;
        font: 12px/1.4 system-ui, -apple-system, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        pointer-events: none;
        opacity: 0.9;
      `;
      indicator.textContent = text;
      document.body.appendChild(indicator);
      return indicator;
    },

    removeProgressIndicator(indicator) {
      if (indicator && indicator.parentNode) {
        indicator.style.transition = 'opacity 0.3s';
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 300);
      }
    }
  };

  function findTabByText(txt) {
    try {
      return Array.from(document.querySelectorAll(SELECTORS.tabLabel))
        .find(l => (l.textContent || '').trim().toLowerCase() === txt.toLowerCase());
    } catch (error) {
      console.warn('[Invoice Helper] Error finding tab:', error);
      return null;
    }
  }

  /** ===============================
   * Enhanced Input Handling
   * =============================== */
  function fireAngularEvents(input, value) {
    try {
      input.focus();
      input.value = value;

      // Enhanced event firing for better Angular compatibility
      ['focus', 'keydown', 'input', 'keyup', 'change', 'blur'].forEach(eventType => {
        const event = eventType === 'input'
          ? new InputEvent(eventType, { bubbles: true, cancelable: true })
          : eventType.startsWith('key')
          ? new KeyboardEvent(eventType, { key: value, bubbles: true, cancelable: true })
          : new Event(eventType, { bubbles: true, cancelable: true });

        input.dispatchEvent(event);
      });
    } catch (error) {
      console.warn('[Invoice Helper] Error firing events:', error);
    }
  }

  async function fillInputWithFeedback(input, value = '0') {
    try {
      fireAngularEvents(input, value);
      await Utils.sleep(CONFIG.BATCH_FILL_DELAY);
      return true;
    } catch (error) {
      console.error('[Invoice Helper] Error filling input:', error);
      return false;
    }
  }

  /** ===============================
   * Enhanced Lazy Loading
   * =============================== */
  async function performLazyScroll(maxMs = CONFIG.MAX_LAZY_LOAD_TIME) {
    if (State.lazyScrolling) {
      console.log('[Invoice Helper] Lazy scroll already in progress');
      return false;
    }

    State.lazyScrolling = true;
    const progressIndicator = Utils.createProgressIndicator('Loading all products...', '#28a745');

    try {
      const startTime = performance.now();
      let lastHeight = 0;
      let stableCount = 0;
      let scrollAttempts = 0;
      const maxScrollAttempts = Math.floor(maxMs / CONFIG.LAZY_SCROLL_DELAY);

      const scroller = document.scrollingElement || document.documentElement;

      while (performance.now() - startTime < maxMs && scrollAttempts < maxScrollAttempts) {
        scroller.scrollTop = scroller.scrollHeight;
        await Utils.sleep(CONFIG.LAZY_SCROLL_DELAY);

        const currentHeight = scroller.scrollHeight;
        const progress = Math.min(100, (scrollAttempts / maxScrollAttempts) * 100);

        progressIndicator.textContent = `Loading products... ${Math.round(progress)}%`;

        if (currentHeight === lastHeight) {
          stableCount++;
        } else {
          stableCount = 0;
          lastHeight = currentHeight;
        }

        if (stableCount >= CONFIG.STABILITY_CHECKS) {
          console.log(`[Invoice Helper] Page stable after ${scrollAttempts} attempts`);
          break;
        }

        scrollAttempts++;
      }

      // Smooth return to top
      scroller.scrollTop = 0;
      await Utils.sleep(200);

      progressIndicator.textContent = '✓ All products loaded!';
      progressIndicator.style.background = '#28a745';

      return true;
    } catch (error) {
      console.error('[Invoice Helper] Lazy scroll error:', error);
      progressIndicator.textContent = '⚠ Loading incomplete';
      progressIndicator.style.background = '#dc3545';
      return false;
    } finally {
      setTimeout(() => Utils.removeProgressIndicator(progressIndicator), 2000);
      State.lazyScrolling = false;
    }
  }

  /** ===============================
   * Enhanced Fill Script
   * =============================== */
  async function runEnhancedFillScript() {
    if (State.isProcessing) {
      console.warn('[Invoice Helper] Fill operation already in progress');
      return;
    }

    State.isProcessing = true;
    const progressIndicator = Utils.createProgressIndicator('Preparing to fill inputs...', '#007bff');

    try {
      // Ensure we're on vessel tab
      const vesselTab = SELECTORS.vesselTab();
      if (vesselTab) {
        vesselTab.click();
        await Utils.sleep(500);
      }

      // Enhanced lazy loading first
      progressIndicator.textContent = 'Loading all products...';
      const loadSuccess = await performLazyScroll();

      if (!loadSuccess) {
        progressIndicator.textContent = '⚠ Loading may be incomplete, continuing...';
        progressIndicator.style.background = '#ffc107';
        await Utils.sleep(2000);
      }

      // Fill vessel inputs
      progressIndicator.textContent = 'Filling quantity inputs...';
      progressIndicator.style.background = '#17a2b8';

      const inputs = Array.from(document.querySelectorAll(SELECTORS.qty));
      let filledCount = 0;

      for (const input of inputs) {
        const success = await fillInputWithFeedback(input, '0');
        if (success) filledCount++;

        // Update progress
        const progress = Math.round((filledCount / inputs.length) * 100);
        progressIndicator.textContent = `Filling inputs... ${progress}% (${filledCount}/${inputs.length})`;
      }

      // Fill total input
      const totalInput = document.querySelector(SELECTORS.enterTotal);
      if (totalInput) {
        await fillInputWithFeedback(totalInput, '0');
        filledCount++;
      }

      // Handle extras tab
      const extrasTab = SELECTORS.extrasTab();
      if (extrasTab) {
        progressIndicator.textContent = 'Processing extras tab...';
        extrasTab.click();
        await Utils.sleep(500);

        const extrasInputs = Array.from(document.querySelectorAll(SELECTORS.extrasQty));
        for (const input of extrasInputs) {
          const success = await fillInputWithFeedback(input, '0');
          if (success) filledCount++;
        }
      }

      // Return to vessel tab
      if (vesselTab) {
        vesselTab.click();
        await Utils.sleep(200);
      }

      // Success feedback
      progressIndicator.textContent = `✓ Completed! Filled ${filledCount} inputs`;
      progressIndicator.style.background = '#28a745';

      // Show safety alert (kept as requested)
      setTimeout(() => {
        alert(`All quantity inputs have been filled with 0! (${filledCount} inputs processed)`);
      }, 1000);

    } catch (error) {
      console.error('[Invoice Helper] Fill script error:', error);
      progressIndicator.textContent = '✗ Error occurred during fill operation';
      progressIndicator.style.background = '#dc3545';

      alert('An error occurred while filling inputs. Please check the console for details.');
    } finally {
      setTimeout(() => Utils.removeProgressIndicator(progressIndicator), 3000);
      State.isProcessing = false;
    }
  }

  /** ===============================
   * Enhanced UI Management
   * =============================== */
  function createEnhancedButtons() {
    if (document.getElementById('IH_btnFillScript')) return;

    // Enhanced ZERO button with better styling
    const btnFill = document.createElement('button');
    btnFill.id = 'IH_btnFillScript';
    btnFill.innerHTML = '🔢 ZERO out invoice';
    Object.assign(btnFill.style, {
      position: 'fixed',
      top: '20px',
      left: '10px',
      zIndex: '2147483646',
      padding: '8px 16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      boxShadow: '0 6px 20px rgba(0,0,0,.15)',
      font: 'bold 13px/1.3 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
      transition: 'all 0.2s ease',
      userSelect: 'none'
    });

    // Enhanced button interactions
    btnFill.addEventListener('mouseenter', () => {
      btnFill.style.backgroundColor = '#0056b3';
      btnFill.style.transform = 'translateY(-1px)';
    });
    btnFill.addEventListener('mouseleave', () => {
      btnFill.style.backgroundColor = '#007bff';
      btnFill.style.transform = 'translateY(0)';
    });

    btnFill.addEventListener('click', async () => {
      if (State.isProcessing) {
        alert('Fill operation already in progress. Please wait...');
        return;
      }

      // Enhanced safety confirmation
      const confirmMsg = 'Are you sure you want to fill ALL quantity inputs with 0?\n\n' +
                        'This action will:\n' +
                        '• Load all products (may take time)\n' +
                        '• Fill all quantity fields with 0\n' +
                        '• Process both Vessel and Extras tabs\n\n' +
                        'Click OK to proceed or Cancel to abort.';

      if (!confirm(confirmMsg)) return;

      btnFill.style.opacity = '0.6';
      btnFill.style.cursor = 'not-allowed';

      try {
        await runEnhancedFillScript();
      } finally {
        btnFill.style.opacity = '1';
        btnFill.style.cursor = 'pointer';
      }
    });

    document.body.appendChild(btnFill);
    State.buttons.push(btnFill);

    // Enhanced LOAD ALL button
    const btnScroll = document.createElement('button');
    btnScroll.id = 'IH_btnLazyScroll';
    btnScroll.innerHTML = '📦 Load all products';
    Object.assign(btnScroll.style, {
      position: 'fixed',
      top: '68px',
      left: '10px',
      zIndex: '2147483646',
      padding: '8px 16px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      boxShadow: '0 6px 20px rgba(0,0,0,.15)',
      font: 'bold 13px/1.3 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
      transition: 'all 0.2s ease',
      userSelect: 'none'
    });

    btnScroll.addEventListener('mouseenter', () => {
      btnScroll.style.backgroundColor = '#1e7e34';
      btnScroll.style.transform = 'translateY(-1px)';
    });
    btnScroll.addEventListener('mouseleave', () => {
      btnScroll.style.backgroundColor = '#28a745';
      btnScroll.style.transform = 'translateY(0)';
    });

    btnScroll.addEventListener('click', async () => {
      if (State.lazyScrolling) {
        alert('Load operation already in progress. Please wait...');
        return;
      }

      btnScroll.style.opacity = '0.6';
      btnScroll.style.cursor = 'not-allowed';

      try {
        await performLazyScroll();
      } finally {
        btnScroll.style.opacity = '1';
        btnScroll.style.cursor = 'pointer';
      }
    });

    document.body.appendChild(btnScroll);
    State.buttons.push(btnScroll);
  }

  function removeAllButtons() {
    State.buttons.forEach(btn => {
      if (btn && btn.parentNode) {
        btn.style.transition = 'opacity 0.3s';
        btn.style.opacity = '0';
        setTimeout(() => btn.remove(), 300);
      }
    });
    State.buttons = [];
  }

  /** ===============================
   * Enhanced Core Logic
   * =============================== */
  const debouncedEvaluate = Utils.debounce(async () => {
    if (!Utils.onTarget()) {
      removeAllButtons();
      return;
    }

    try {
      const qtyInput = await Utils.waitForElement(SELECTORS.qty, 8000);
      if (qtyInput) {
        createEnhancedButtons();
      }
    } catch (error) {
      console.warn('[Invoice Helper] Error during evaluation:', error);
    }
  }, CONFIG.DEBOUNCE_DELAY);

  function startEnhanced() {
    if (State.started) return;
    State.started = true;

    console.log('[Invoice Helper] Enhanced version started');

    // Consolidated mutation observer
    State.domObs = new MutationObserver(() => {
      if (!State.domObs._debouncing) {
        State.domObs._debouncing = true;
        setTimeout(() => {
          State.domObs._debouncing = false;
          debouncedEvaluate();
        }, CONFIG.DEBOUNCE_DELAY);
      }
    });

    State.domObs.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: false // Reduced scope for better performance
    });

    debouncedEvaluate();
  }

  function stopEnhanced() {
    if (State.domObs) {
      State.domObs.disconnect();
      State.domObs = null;
    }
    removeAllButtons();
    State.reset();
    console.log('[Invoice Helper] Enhanced version stopped');
  }

  /** ===============================
   * Enhanced URL Management
   * =============================== */
  function setupEnhancedUrlWatcher() {
    State.lastUrl = location.href;

    const checkUrl = () => {
      const currentUrl = location.href;
      if (currentUrl !== State.lastUrl) {
        State.lastUrl = currentUrl;
        if (Utils.onTarget()) {
          startEnhanced();
        } else {
          stopEnhanced();
        }
      } else if (Utils.onTarget()) {
        debouncedEvaluate();
      }
    };

    if (State.urlPoll) clearInterval(State.urlPoll);
    State.urlPoll = setInterval(checkUrl, CONFIG.POLLING_INTERVAL);

    ['popstate', 'hashchange'].forEach(event => {
      window.addEventListener(event, checkUrl);
    });

    // Initial check
    if (Utils.onTarget()) {
      startEnhanced();
    } else {
      stopEnhanced();
    }
  }

  /** ===============================
   * Enhanced Initialization
   * =============================== */
  function initializeEnhanced() {
    console.log('[Invoice Helper] Enhanced version v4.0.0 initializing...');

    // Cleanup any existing instances
    if (State.urlPoll) clearInterval(State.urlPoll);
    stopEnhanced();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupEnhancedUrlWatcher, { once: true });
    } else {
      setupEnhancedUrlWatcher();
    }
  }

  // Initialize the enhanced script
  initializeEnhanced();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    stopEnhanced();
    if (State.urlPoll) clearInterval(State.urlPoll);
  });

})();