// ==UserScript==
// @name         Gemini Chat Title as Tab Name
// @namespace    https://greasyfork.org/users/1520384-constansino
// @version      0.1.0
// @description  Syncs the browser tab title with the current Gemini chat title.
// @author       constansino
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563274/Gemini%20Chat%20Title%20as%20Tab%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/563274/Gemini%20Chat%20Title%20as%20Tab%20Name.meta.js
// ==/UserScript==


(function() {
  'use strict';

  console.log('[Gemini Title] Script loaded');

  // =========================================================================
  // CONFIGURATION
  // =========================================================================

  const CONFIG = {
    // Title format options
    titleFormat: '{topic} - Gemini',        // Format: {topic} will be replaced
    defaultTitle: 'New Chat - Gemini',      // Default for new/untitled chats
    loadingTitle: 'Loading... - Gemini',    // While page loads
    maxTitleLength: 60,                     // Max characters for title

    // Selectors to find conversation title (try in order)
    titleSelectors: [
      '.conversation-title-container',      // Main title container
      '[class*="conversation-title"]',      // Any class containing "conversation-title"
      '.top-bar-actions h1',                // Header h1
      '.side-nav-action-button[aria-selected="true"]', // Active sidebar item
      'mat-toolbar .conversation-title',    // Material toolbar
      '[class*="chat-title"]',              // Any chat title class
    ],

    // Update triggers
    updateDelay: 300,                       // Debounce delay (ms)
    checkInterval: 2000,                    // Fallback check interval (ms)
  };

  // =========================================================================
  // STATE
  // =========================================================================

  let currentTitle = '';
  let updateTimer = null;
  let checkTimer = null;
  let observer = null;

  // =========================================================================
  // CORE FUNCTIONS
  // =========================================================================

  /**
   * Extract conversation title from the page
   * @returns {string} The extracted title or empty string
   */
  function extractConversationTitle() {
    // Try each selector in order
    for (const selector of CONFIG.titleSelectors) {
      try {
        const elements = document.querySelectorAll(selector);

        for (const element of elements) {
          // Skip hidden elements
          if (element.offsetParent === null) continue;

          // Get text content
          let text = element.textContent || element.innerText || '';
          text = text.trim();

          // Skip if empty or too short
          if (!text || text.length < 2) continue;

          // Skip if it's just "Gemini" or "Google Gemini"
          if (text === 'Gemini' || text === 'Google Gemini') continue;

          // Skip if it looks like a date/time
          if (/^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(text)) continue;

          // Found a valid title
          console.log('[Gemini Title] Found title via selector:', selector, '→', text);
          return text;
        }
      } catch (e) {
        // Selector failed, try next
        continue;
      }
    }

    // Fallback: Try to extract from URL
    const urlTitle = extractTitleFromURL();
    if (urlTitle) {
      console.log('[Gemini Title] Extracted from URL:', urlTitle);
      return urlTitle;
    }

    // Fallback: Try to extract from first user message
    const firstMessage = extractFirstMessage();
    if (firstMessage) {
      console.log('[Gemini Title] Using first message:', firstMessage);
      return firstMessage;
    }

    return '';
  }

  /**
   * Extract title hint from URL parameters
   * @returns {string} Title from URL or empty string
   */
  function extractTitleFromURL() {
    try {
      const url = new URL(window.location.href);
      const chatId = url.pathname.split('/').pop();

      // If it's not "app" (new chat), there might be a chat ID
      if (chatId && chatId !== 'app' && chatId.length > 10) {
        // Return a shortened version
        return `Chat ${chatId.substring(0, 8)}...`;
      }
    } catch (e) {
      // URL parsing failed
    }

    return '';
  }

  /**
   * Extract first user message as title fallback
   * @returns {string} First message or empty string
   */
  function extractFirstMessage() {
    try {
      // Look for user message containers
      const messageSelectors = [
        '.query-container',
        '[class*="user-message"]',
        '[class*="query"]',
        '.message-content'
      ];

      for (const selector of messageSelectors) {
        const messages = document.querySelectorAll(selector);

        for (const msg of messages) {
          let text = msg.textContent || msg.innerText || '';
          text = text.trim();

          // Skip if empty
          if (!text || text.length < 5) continue;

          // Take first 50 characters
          if (text.length > 50) {
            text = text.substring(0, 50) + '...';
          }

          return text;
        }
      }
    } catch (e) {
      // Failed to extract
    }

    return '';
  }

  /**
   * Format the title according to configuration
   * @param {string} topic - The conversation topic
   * @returns {string} Formatted title
   */
  function formatTitle(topic) {
    if (!topic || topic.trim() === '') {
      return CONFIG.defaultTitle;
    }

    // Truncate if too long
    if (topic.length > CONFIG.maxTitleLength) {
      topic = topic.substring(0, CONFIG.maxTitleLength - 3) + '...';
    }

    // Apply format
    return CONFIG.titleFormat.replace('{topic}', topic);
  }

  /**
   * Update the page title
   * @param {boolean} force - Force update even if title hasn't changed
   */
  function updatePageTitle(force = false) {
    const topic = extractConversationTitle();
    const newTitle = formatTitle(topic);

    // Skip if title hasn't changed (unless forced)
    if (!force && newTitle === currentTitle) {
      return;
    }

    // Update title
    document.title = newTitle;
    currentTitle = newTitle;

    console.log('[Gemini Title] Title updated:', newTitle);
  }

  /**
   * Debounced title update
   * Prevents excessive updates during rapid DOM changes
   */
  function debouncedUpdate() {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
      updatePageTitle();
    }, CONFIG.updateDelay);
  }

  // =========================================================================
  // OBSERVERS & LISTENERS
  // =========================================================================

  /**
   * Set up MutationObserver to watch for DOM changes
   */
  function setupObserver() {
    // Stop existing observer
    if (observer) {
      observer.disconnect();
    }

    // Create new observer
    observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      for (const mutation of mutations) {
        // Check if added nodes contain title-related elements
        if (mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if this element or its children might contain the title
              const classList = node.classList ? Array.from(node.classList) : [];
              const hasRelevantClass = classList.some(cls =>
                cls.includes('conversation') ||
                cls.includes('title') ||
                cls.includes('chat') ||
                cls.includes('message')
              );

              if (hasRelevantClass || node.querySelector('[class*="title"]')) {
                shouldUpdate = true;
                break;
              }
            }
          }
        }

        // Check if text content changed in existing elements
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
          const target = mutation.target;
          if (target.nodeType === Node.ELEMENT_NODE) {
            const classList = target.classList ? Array.from(target.classList) : [];
            const hasRelevantClass = classList.some(cls =>
              cls.includes('conversation') ||
              cls.includes('title') ||
              cls.includes('chat')
            );

            if (hasRelevantClass) {
              shouldUpdate = true;
            }
          }
        }

        if (shouldUpdate) break;
      }

      if (shouldUpdate) {
        debouncedUpdate();
      }
    });

    // Start observing
    const observeConfig = {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: false,
      attributes: false  // Don't watch attributes for performance
    };

    if (document.body) {
      observer.observe(document.body, observeConfig);
      console.log('[Gemini Title] MutationObserver started');
    } else {
      // Wait for body
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, observeConfig);
        console.log('[Gemini Title] MutationObserver started (deferred)');
      });
    }
  }

  /**
   * Set up fallback interval checker
   * In case MutationObserver misses some updates
   */
  function setupFallbackChecker() {
    checkTimer = setInterval(() => {
      updatePageTitle();
    }, CONFIG.checkInterval);

    console.log('[Gemini Title] Fallback checker started');
  }

  /**
   * Listen for URL changes (SPA navigation)
   */
  function setupNavigationListener() {
    let lastUrl = location.href;

    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        console.log('[Gemini Title] Navigation detected:', url);

        // Reset title and update after delay
        currentTitle = '';
        setTimeout(() => {
          updatePageTitle(true);
        }, 500);
      }
    }).observe(document, {
      subtree: true,
      childList: true
    });

    console.log('[Gemini Title] Navigation listener started');
  }

  /**
   * Listen for visibility changes
   * Update title when tab becomes visible
   */
  function setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('[Gemini Title] Tab became visible, checking title');
        updatePageTitle();
      }
    });

    console.log('[Gemini Title] Visibility listener started');
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  /**
   * Initialize the script
   */
  function init() {
    console.log('[Gemini Title] Initializing...');

    // Set loading title
    document.title = CONFIG.loadingTitle;

    // Wait for page to be somewhat ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAfterLoad);
    } else {
      initializeAfterLoad();
    }
  }

  /**
   * Initialize after DOM is ready
   */
  function initializeAfterLoad() {
    // Set up observers and listeners
    setupObserver();
    setupFallbackChecker();
    setupNavigationListener();
    setupVisibilityListener();

    // Initial title update (after short delay to let page render)
    setTimeout(() => {
      updatePageTitle(true);
    }, 1000);

    // Another update after longer delay (for slow-loading content)
    setTimeout(() => {
      updatePageTitle(true);
    }, 3000);

    console.log('[Gemini Title] Initialization complete');
  }

  // =========================================================================
  // CLEANUP
  // =========================================================================

  /**
   * Clean up on page unload
   */
  function cleanup() {
    if (observer) {
      observer.disconnect();
    }

    if (updateTimer) {
      clearTimeout(updateTimer);
    }

    if (checkTimer) {
      clearInterval(checkTimer);
    }

    console.log('[Gemini Title] Cleaned up');
  }

  window.addEventListener('beforeunload', cleanup);

  // =========================================================================
  // EXPOSE DEBUG INTERFACE
  // =========================================================================

  // Expose functions to window for debugging
  window.geminiDynamicTitle = {
    version: '1.0.0',
    update: () => updatePageTitle(true),
    getCurrentTitle: () => currentTitle,
    extractTitle: extractConversationTitle,
    config: CONFIG
  };

  // =========================================================================
  // START
  // =========================================================================

  init();

})();
