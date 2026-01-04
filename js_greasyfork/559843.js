// ==UserScript==
// @name        SankakuTagFormatter
// @namespace   SankakuTagFormatter
// @description Converts tags to lowercase in the sidebar and autocomplete on Sankaku Complex
// @author      Dramorian
// @match       http*://chan.sankakucomplex.com/*posts/*
// @match       https://chan.sankakucomplex.com/en/?tags=*
// @match       http*://idol.sankakucomplex.com/*posts/*
// @match       http*://beta.sankakucomplex.com/*posts/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @run-at      document-end
// @version     1.0.0
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/559843/SankakuTagFormatter.user.js
// @updateURL https://update.greasyfork.org/scripts/559843/SankakuTagFormatter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /**
   * Configuration and utility constants
   */
  const CONFIG = {
    DEBUG: false,
    SELECTORS: {
      SIDEBAR: '#tag-sidebar',
      SIDEBAR_LINKS: 'ul > li a',
      AUTOCOMPLETE: '#autocomplete',
      AUTOCOMPLETE_TAGS: 'a b, a span'
    },
    DEBOUNCE_MS: 50
  };

  /**
   * Logging utilities
   */
  const logger = {
    log: (...args) => CONFIG.DEBUG && console.log('[SankakuTagFormatter]', ...args),
    error: (...args) => CONFIG.DEBUG && console.error('[SankakuTagFormatter]', ...args)
  };

  /**
   * Creates a debounced version of a function
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(fn, delay) {
    let timeoutId = null;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Converts text content to lowercase for a single element
   * @param {HTMLElement} element - Element to convert
   */
  function lowercaseElement(element) {
    if (element?.textContent) {
      const originalText = element.textContent;
      const lowercasedText = originalText.toLowerCase();
      
      if (originalText !== lowercasedText) {
        element.textContent = lowercasedText;
      }
    }
  }

  /**
   * Converts text content to lowercase for text nodes
   * @param {Text} textNode - Text node to convert
   */
  function lowercaseTextNode(textNode) {
    const parent = textNode.parentNode;
    if (!parent || !textNode.nodeValue) return;
    
    // Only process if parent is a tag element within an anchor
    if ((parent.tagName === 'B' || parent.tagName === 'SPAN') && parent.closest('a')) {
      const originalValue = textNode.nodeValue;
      const lowercasedValue = originalValue.toLowerCase();
      
      if (originalValue !== lowercasedValue) {
        textNode.nodeValue = lowercasedValue;
      }
    }
  }

  /**
   * Sidebar tag converter
   */
  class SidebarConverter {
    convert() {
      const sidebar = document.querySelector(CONFIG.SELECTORS.SIDEBAR);
      
      if (!sidebar) {
        logger.error('Sidebar not found');
        return false;
      }

      const links = sidebar.querySelectorAll(CONFIG.SELECTORS.SIDEBAR_LINKS);
      logger.log(`Converting ${links.length} sidebar tags`);
      
      links.forEach(lowercaseElement);
      return true;
    }
  }

  /**
   * Autocomplete tag converter with observer
   */
  class AutocompleteConverter {
    #observer = null;
    #autocompleteElement = null;
    #processMutations = null;

    constructor() {
      // Create debounced mutation processor
      this.#processMutations = debounce(this.#handleMutations.bind(this), CONFIG.DEBOUNCE_MS);
    }

    /**
     * Processes mutations and converts tags to lowercase
     * @param {MutationRecord[]} mutations - Array of mutation records
     */
    #handleMutations(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Handle added nodes
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const tags = node.querySelectorAll(CONFIG.SELECTORS.AUTOCOMPLETE_TAGS);
              tags.forEach(lowercaseElement);
            }
          }
        } else if (mutation.type === 'characterData') {
          // Handle text content changes
          lowercaseTextNode(mutation.target);
        }
      }
    }

    /**
     * Sets up observer for autocomplete element
     * @param {HTMLElement} element - Autocomplete element
     */
    #setupObserver(element) {
      this.#autocompleteElement = element;
      logger.log('Setting up autocomplete observer');

      // Convert any existing content first
      const existingTags = element.querySelectorAll(CONFIG.SELECTORS.AUTOCOMPLETE_TAGS);
      existingTags.forEach(lowercaseElement);

      // Create and start observer
      this.#observer = new MutationObserver(this.#processMutations);
      this.#observer.observe(element, {
        childList: true,
        subtree: true,
        characterData: true
      });

      logger.log('Autocomplete observer active');
    }

    /**
     * Waits for autocomplete element to appear in DOM
     * @returns {Promise<boolean>} Success status
     */
    async waitForAutocomplete() {
      return new Promise((resolve) => {
        // Check if already exists
        const existing = document.querySelector(CONFIG.SELECTORS.AUTOCOMPLETE);
        if (existing) {
          this.#setupObserver(existing);
          resolve(true);
          return;
        }

        // Set up observer to wait for it
        const bodyObserver = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              const autocomplete = document.querySelector(CONFIG.SELECTORS.AUTOCOMPLETE);
              if (autocomplete) {
                logger.log('Autocomplete element detected');
                this.#setupObserver(autocomplete);
                bodyObserver.disconnect();
                resolve(true);
                return;
              }
            }
          }
        });

        bodyObserver.observe(document.body, {
          childList: true,
          subtree: true
        });

        logger.log('Waiting for autocomplete element...');
      });
    }

    /**
     * Cleanup method to disconnect observer
     */
    destroy() {
      if (this.#observer) {
        this.#observer.disconnect();
        this.#observer = null;
        logger.log('Autocomplete observer disconnected');
      }
    }
  }

  /**
   * Main application controller
   */
  class SankakuTagFormatter {
    #sidebarConverter = null;
    #autocompleteConverter = null;

    async init() {
      logger.log('Initializing SankakuTagFormatter v2.0.0');

      try {
        // Convert sidebar tags
        this.#sidebarConverter = new SidebarConverter();
        const sidebarSuccess = this.#sidebarConverter.convert();
        
        if (sidebarSuccess) {
          logger.log('Sidebar conversion completed');
        }

        // Set up autocomplete monitoring
        this.#autocompleteConverter = new AutocompleteConverter();
        await this.#autocompleteConverter.waitForAutocomplete();

        logger.log('Initialization complete');
      } catch (error) {
        logger.error('Initialization error:', error);
        console.error('[SankakuTagFormatter] Fatal error:', error);
      }
    }

    destroy() {
      this.#autocompleteConverter?.destroy();
      logger.log('Formatter destroyed');
    }
  }

  /**
   * Bootstrap the script
   */
  function bootstrap() {
    const formatter = new SankakuTagFormatter();
    
    formatter.init().catch((error) => {
      console.error('[SankakuTagFormatter] Startup failed:', error);
    });

    // Cleanup on page unload (good practice)
    window.addEventListener('beforeunload', () => formatter.destroy());
  }

  // Start when DOM is ready
  if (['complete', 'loaded', 'interactive'].includes(document.readyState)) {
    bootstrap();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrap);
  }

})();