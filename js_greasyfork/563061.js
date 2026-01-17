// ==UserScript==
// @name         Amazon Dark Pattern Blocker
// @namespace    August4067
// @version      0.0.1-alpha
// @description  Remove dark patterns from Amazon: Prime upsells, credit card offers, and other manipulative UI across product pages, cart, and checkout
// @author       August4067
// @license      MIT
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.com.au/*
// @match        https://www.amazon.in/*
// @match        https://www.amazon.com.br/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.pl/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @icon         https://www.amazon.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/563061/Amazon%20Dark%20Pattern%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/563061/Amazon%20Dark%20Pattern%20Blocker.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* eslint-env es2017 */

(function () {
  "use strict";

  // ============================================
  // CONFIGURATION
  // ============================================

  const CONFIG = {
    // Elements to remove from DOM
    selectors: {
      primeUpsells: {
        homepageHeroBanner: '#desktop-banner',
        productPagePrimeUpsell: '#primeDPUpsellStaticContainerNPA',
        productPagePrimeUpsellAlt: '#primeDPUpsellStaticContainer',
        deliveryPrimeUpsell: '#mir-layout-DELIVERY_BLOCK-slot-SECONDARY_DELIVERY_MESSAGE_LARGE',
        navBarJoinPrime: '#nav-join-prime',
        cartPrimeUpsell: '#sc-primeupsell-widget',
        checkoutPrimeUpsell: '#osu-prime-recommendations',
        checkoutPrimeStripe: '#prime-spc-stripe-recommendations',
        checkoutPrimeIsoa: '.isoa-wrapper-radio',
        searchPagePrimeUpsell: '.udm-primary-delivery-message:has(.prime-signup-ingress)',
      },
      urgencyTactics: {
        // e.g., lowStock: '.low-stock-message',
      },
      subscribeAndSave: {
        // e.g., snsAccordion: '#sns-accordion',
      },
      sponsoredProducts: {
        // e.g., sponsoredResult: '[data-component-type="sp-sponsored-result"]',
      },
      creditCardUpsells: {
        cartCreditCardBanner: '#sc-new-upsell',
        productPageCreditCardBanner: '#issuancePriceblockAmabot_feature_div',
      },
      aiUpsells: {
        navRufus: '#nav-rufus-disco',
        productPageRufus: '#nile-inline_feature_div',
      },
      amazonMusicPromos: {
        productPageMusicShoveler: '[cel_widget_id^="kahuna-music"]',
      },
    },

    // Buttons/links to click (dismiss modals, "No thanks" buttons)
    clickTargets: {
      primeModals: {
        checkoutPrimeDecline: '#prime-decline-button',
      },
      generalDismiss: {
        // e.g., noThanks: '[data-action="no-thanks"]',
      },
    },

    // Elements to modify text content (remove Prime upsell text while keeping useful info)
    textReplacements: {
      cartFreeShippingMessage: {
        selector: '.sc-sss-box .sc-sss',
        pattern: /Add\s+(\$[\d.]+)\s+of eligible items or.*?to get FREE delivery/s,
        replacement: 'Add $1 of eligible items to get FREE delivery',
      },
      cartFlyoutFreeShippingMessage: {
        selector: '.ewc-compact-actions .sc-sss, #sw-threshold-message .sc-sss',
        pattern: /Add\s+(\$[\d.]+)\s+of eligible items or.*?to get FREE delivery[^.]*\./s,
        replacement: 'Add $1 of eligible items to get FREE delivery on eligible items with no order minimum.',
      },
      searchPageSecondaryDelivery: {
        selector: '.udm-secondary-delivery-message',
        pattern: /^\s*Or\s+/i,
        replacement: '',
      },
    },

    // Checkboxes to uncheck (pre-selected add-ons, protection plans)
    uncheckTargets: {
      checkout: {
        // e.g., protectionPlan: '#add-protection-plan-checkbox',
      },
      subscribeAndSave: {
        // e.g., snsCheckbox: '#sns-checkbox',
      },
    },

    // Page detection patterns
    pages: {
      product: /\/dp\/|\/gp\/product\//,
      cart: /\/cart|\/gp\/cart/,
      checkoutPrimeInterstitial: /\/checkout\/.*\/pip/,
      checkout: /\/checkout\//,
      search: /\/s\?|\/s\/|\/b\?/,
      homepage: /^\/($|\?)/,
    },

    pollInterval: 2000,
    throttleDelay: 100,
    debug: false,
  };

  // Settings configuration
  const SETTINGS_CONFIG = {
    removePrimeUpsells: {
      displayName: "Remove Prime upsells",
      default: true,
    },
    removeUrgencyTactics: {
      displayName: "Remove urgency tactics",
      default: true,
    },
    removeSubscribeNudges: {
      displayName: "Remove Subscribe & Save nudges",
      default: true,
    },
    removeSponsoredProducts: {
      displayName: "Remove sponsored products",
      default: true,
    },
    removeCreditCardUpsells: {
      displayName: "Remove credit card upsells",
      default: true,
    },
    removeAIUpsells: {
      displayName: "Remove Rufus AI",
      default: true,
    },
    removeAmazonMusicPromos: {
      displayName: "Remove Amazon Music promos",
      default: true,
    },
  };

  // ============================================
  // SETTINGS
  // ============================================

  class Setting {
    constructor(name, config) {
      this.name = name;
      this.displayName = config.displayName;
      this.default = config.default;
    }

    get value() {
      return GM_getValue(this.name, this.default);
    }

    set value(val) {
      GM_setValue(this.name, val);
    }

    toggle() {
      this.value = !this.value;
    }
  }

  const Settings = Object.fromEntries(
    Object.entries(SETTINGS_CONFIG).map(([name, config]) => [
      name,
      new Setting(name, config),
    ])
  );

  // ============================================
  // UTILITIES
  // ============================================

  function debug(message, ...args) {
    if (CONFIG.debug) {
      console.log(`[Amazon Dark Pattern Blocker] ${message}`, ...args);
    }
  }

  function getPageType() {
    const path = window.location.pathname + window.location.search;
    for (const [pageType, pattern] of Object.entries(CONFIG.pages)) {
      if (pattern.test(path)) {
        return pageType;
      }
    }
    return "other";
  }

  // ============================================
  // DECLUTTERER
  // ============================================

  const Declutterer = {
    /**
     * Remove elements matching selectors in a category
     */
    removeByCategory(categoryKey, settingKey) {
      if (!Settings[settingKey].value) return 0;

      const selectors = CONFIG.selectors[categoryKey];
      if (!selectors) return 0;

      let count = 0;

      for (const [name, selector] of Object.entries(selectors)) {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            el.remove();
            count++;
            debug(`Removed ${name}`);
          });
        } catch (e) {
          debug(`Invalid selector for ${name}: ${selector}`, e);
        }
      }

      return count;
    },

    /**
     * Click elements in a category (for dismissing modals, etc.)
     */
    clickByCategory(categoryKey) {
      const targets = CONFIG.clickTargets[categoryKey];
      if (!targets) return 0;

      let count = 0;

      for (const [name, selector] of Object.entries(targets)) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          el.click();
          count++;
          debug(`Clicked ${name}`);
        });
      }

      return count;
    },

    /**
     * Uncheck pre-selected checkboxes in a category
     */
    uncheckByCategory(categoryKey) {
      const targets = CONFIG.uncheckTargets[categoryKey];
      if (!targets) return 0;

      let count = 0;

      for (const [name, selector] of Object.entries(targets)) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (el.checked) {
            el.checked = false;
            el.dispatchEvent(new Event("change", { bubbles: true }));
            count++;
            debug(`Unchecked ${name}`);
          }
        });
      }

      return count;
    },

    // Category processors
    processPrimeUpsells() {
      this.removeByCategory("primeUpsells", "removePrimeUpsells");
    },

    processUrgencyTactics() {
      this.removeByCategory("urgencyTactics", "removeUrgencyTactics");
    },

    processSubscribeNudges() {
      this.removeByCategory("subscribeAndSave", "removeSubscribeNudges");
    },

    processSponsoredProducts() {
      this.removeByCategory("sponsoredProducts", "removeSponsoredProducts");
    },

    processPrimeModals() {
      this.clickByCategory("primeModals");
    },

    processGeneralDismiss() {
      this.clickByCategory("generalDismiss");
    },

    processCheckoutUnchecks() {
      this.uncheckByCategory("checkout");
    },

    processSubscribeUnchecks() {
      this.uncheckByCategory("subscribeAndSave");
    },

    processCreditCardUpsells() {
      this.removeByCategory("creditCardUpsells", "removeCreditCardUpsells");
    },

    processAIUpsells() {
      this.removeByCategory("aiUpsells", "removeAIUpsells");
    },

    processAmazonMusicPromos() {
      this.removeByCategory("amazonMusicPromos", "removeAmazonMusicPromos");
    },

    /**
     * Handle the Prime interstitial page that hijacks checkout
     * Replaces content with a message and auto-clicks decline
     */
    processPrimeInterstitial() {
      if (!Settings.removePrimeUpsells.value) return;

      const container = document.querySelector('#updp-prime-recommendations');
      const declineButton = document.querySelector('#prime-decline-button');

      if (container && declineButton && !container.dataset.dpbProcessed) {
        container.dataset.dpbProcessed = 'true';

        // Get the decline URL before we do anything
        const declineUrl = declineButton.href;

        // Replace the container content with a simple message
        container.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; 
                      min-height: 200px; font-size: 18px; color: #0F1111;">
            <p>Skipping Prime upsell page...</p>
          </div>
        `;

        debug('Replaced Prime interstitial content, redirecting...');

        // Navigate to the decline URL
        if (declineUrl) {
          window.location.href = declineUrl;
        }
      }
    },

    /**
     * Replace text content in elements (for removing inline Prime upsells while keeping useful text)
     */
    processTextReplacements() {
      if (!Settings.removePrimeUpsells.value) return 0;

      const replacements = CONFIG.textReplacements;
      if (!replacements) return 0;

      let count = 0;

      for (const [name, config] of Object.entries(replacements)) {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach((el) => {
          // Check if already processed
          if (el.dataset.dpbProcessed) return;

          const originalText = el.textContent;
          if (config.pattern.test(originalText)) {
            // Remove all child elements (scripts, links, etc.) and replace with clean text
            const newText = originalText.replace(config.pattern, config.replacement);
            el.textContent = newText;
            el.dataset.dpbProcessed = 'true';
            count++;
            debug(`Replaced text in ${name}`);
          }
        });
      }

      return count;
    },
  };

  // ============================================
  // PAGE HANDLERS
  // ============================================

  const PageHandlers = {
    product() {
      Declutterer.processPrimeUpsells();
      Declutterer.processAIUpsells();
      Declutterer.processCreditCardUpsells();
      Declutterer.processAmazonMusicPromos();
      Declutterer.processUrgencyTactics();
      Declutterer.processSubscribeNudges();
      Declutterer.processSubscribeUnchecks();
      Declutterer.processTextReplacements();
      Declutterer.processPrimeModals();
      Declutterer.processGeneralDismiss();
    },

    cart() {
      Declutterer.processPrimeUpsells();
      Declutterer.processAIUpsells();
      Declutterer.processCreditCardUpsells();
      Declutterer.processTextReplacements();
      Declutterer.processPrimeModals();
      Declutterer.processGeneralDismiss();
    },

    checkoutPrimeInterstitial() {
      // This is the Prime upsell interstitial page that hijacks checkout
      // Replace the content with a message and auto-click decline
      Declutterer.processPrimeInterstitial();
    },

    checkout() {
      Declutterer.processPrimeUpsells();
      Declutterer.processAIUpsells();
      Declutterer.processCheckoutUnchecks();
      Declutterer.processPrimeModals();
      Declutterer.processGeneralDismiss();
    },

    search() {
      Declutterer.processPrimeUpsells();
      Declutterer.processAIUpsells();
      Declutterer.processSponsoredProducts();
      Declutterer.processTextReplacements();
      Declutterer.processPrimeModals();
      Declutterer.processGeneralDismiss();
    },

    homepage() {
      Declutterer.processPrimeUpsells();
      Declutterer.processAIUpsells();
      Declutterer.processPrimeModals();
      Declutterer.processGeneralDismiss();
    },

    other() {
      // Fallback: run shared patterns
      Declutterer.processPrimeUpsells();
      Declutterer.processAIUpsells();
      Declutterer.processPrimeModals();
      Declutterer.processGeneralDismiss();
    },
  };

  function processPage() {
    try {
      const pageType = getPageType();
      const handler = PageHandlers[pageType] || PageHandlers.other;
      debug(`Processing page type: ${pageType}`);
      handler();
    } catch (error) {
      debug("Error during processing:", error);
    }
  }

  // ============================================
  // MENU
  // ============================================

  function setupMenu() {
    for (const [key, setting] of Object.entries(Settings)) {
      GM_registerMenuCommand(
        `${setting.value ? "\u2713" : "\u2717"} ${setting.displayName}`,
        () => {
          setting.toggle();
          const state = setting.value ? "enabled" : "disabled";
          alert(`${setting.displayName} ${state}. Refresh the page to apply.`);
        }
      );
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function setupMutationObserver() {
    let timeoutId = null;
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          shouldProcess = true;
          break;
        }
      }

      if (shouldProcess) {
        if (!timeoutId) {
          timeoutId = setTimeout(() => {
            processPage();
            timeoutId = null;
          }, CONFIG.throttleDelay);
        }
      }
    });

    const target = document.documentElement || document.body;
    if (target) {
      observer.observe(target, {
        childList: true,
        subtree: true,
      });
      debug("MutationObserver setup");
    }
  }

  function init() {
    debug("Initializing...");

    setupMenu();
    setupMutationObserver();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", processPage);
    } else {
      processPage();
    }

    debug("Ready");
  }

  function safeInit() {
    try {
      init();
    } catch (error) {
      console.error("[Amazon Dark Pattern Blocker] Initialization failed:", error);
    }
  }

  // Initialize immediately
  safeInit();

  // Continuous polling for dynamic content + SPA navigation detection
  let lastUrl = location.href;
  setInterval(() => {
    processPage();

    if (location.href !== lastUrl) {
      debug(`Navigation detected: ${lastUrl} -> ${location.href}`);
      lastUrl = location.href;
    }
  }, CONFIG.pollInterval);
})();
