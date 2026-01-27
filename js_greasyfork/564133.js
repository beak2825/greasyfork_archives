// ==UserScript==
// @name         WaniKani Level Filter
// @namespace    wanikani-level-filter
// @description  Filter reviews by level during active review sessions
// @version      1.0.2
// @author       doutatsu
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564133/WaniKani%20Level%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/564133/WaniKani%20Level%20Filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ============================================
  // SECTION 1: CONSTANTS & CONFIGURATION
  // ============================================
  const STORAGE_KEY = 'wk-level-filter-selection';
  const HEADER_CHECK_INTERVAL = 100; // ms
  const HEADER_TIMEOUT = 5000; // ms
  const EMPTY_QUEUE_CLASS = 'level-filter-empty-queue';

  const UI_IDS = {
    container: 'level-filter-container',
    dropdown: 'level-filter-dropdown',
    noItemsMessage: 'level-filter-no-items-message'
  };

  const STYLES = {
    dropdown: `
      margin: 0;
      padding: 3px 6px;
      font-size: 11px;
      border: 1px solid #999;
      border-radius: 3px;
      background: white;
      cursor: pointer;
      min-width: 100px;
    `,
    containerBase: `
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 4px;
    `,
    containerAbsolute: `
      position: absolute;
      top: 50px;
      left: 10px;
      z-index: 1000;
    `,
    containerFixed: `
      position: fixed;
      top: 50px;
      left: 10px;
      z-index: 10000;
    `,
    label: `
      color: white;
      font-size: 12px;
      font-weight: 500;
    `,
    noItemsMessage: `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid #ffc107;
      padding: 30px;
      border-radius: 10px;
      z-index: 100000;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    `,
    notification: `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translate(-50%, 0);
      background: #4a90e2;
      color: white;
      padding: 12px 24px;
      border-radius: 5px;
      z-index: 100000;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      animation: wkLevelFilterSlideDown 0.3s ease;
    `
  };

  const EMPTY_QUEUE_CSS = `
    /* Hide quiz interface when no items are available */
    body.${EMPTY_QUEUE_CLASS} .quiz {
      display: none !important;
    }

    /* Hide the completion/wrap-up screens when filtering */
    body.${EMPTY_QUEUE_CLASS} turbo-frame#quiz {
      display: none !important;
    }

    /* Ensure the message is visible */
    body.${EMPTY_QUEUE_CLASS} #${UI_IDS.noItemsMessage} {
      display: block !important;
    }

    @keyframes wkLevelFilterSlideDown {
      from { opacity: 0; transform: translate(-50%, -10px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }

    @keyframes wkLevelFilterSlideUp {
      from { opacity: 1; transform: translate(-50%, 0); }
      to { opacity: 0; transform: translate(-50%, -10px); }
    }
  `;

  // ============================================
  // SECTION 2: GLOBAL STATE
  // ============================================
  const state = {
    subjectLevelMap: {},
    availableLevels: [], // Array of level numbers
    levelCounts: {}, // Object mapping level -> count
    dropdown: null,
    initialized: false,
    // Track levels with items in current queue (updated on each filter call)
    currentQueueLevels: new Set(),
    currentQueueLevelCounts: {},
    // Track if user intentionally clicked home button
    userClickedHome: false,
    // Avoid registering multiple filters on turbo navigation
    queueFilterOwner: null,
    queueFilterRegistered: false
  };

  // ============================================
  // SECTION 3: WKOF CHECK
  // ============================================
  if (typeof wkof === 'undefined') {
    return;
  }

  // ============================================
  // SECTION 3.5: CSS INJECTION
  // ============================================

  /**
   * Inject CSS styles for the filter
   */
  function injectCSS() {
    const style = document.createElement('style');
    style.textContent = EMPTY_QUEUE_CSS;
    document.head.appendChild(style);
  }

  // Inject CSS immediately
  injectCSS();

  // Setup home button tracking and navigation interceptor early
  setupHomeButtonTracking();
  setupNavigationInterceptor();

  // ============================================
  // SECTION 4: DATA LOADING FUNCTIONS
  // ============================================

  /**
   * Load all items from WaniKani and build the level mapping
   * @returns {Promise<Object>} Object with level counts
   */
  function loadItemDataWithLevels() {
    state.subjectLevelMap = {};
    state.availableLevels = [];
    state.levelCounts = {};

    const config = {
      wk_items: {
        options: {
          assignments: true
        },
        filters: {} // Get all items
      }
    };

    return wkof.ItemData.get_items(config)
      .then(items => {
        buildSubjectLevelMap(items);
        const counts = extractAvailableLevels(items);
        state.levelCounts = counts; // Store globally
        return counts;
      })
      .catch(error => {
        // Swallow error logging to keep console clean.
        alert('Level Filter: Failed to load level data. The filter will not work this session.');
        // Fallback: return empty counts
        return {};
      });
  }

  /**
   * Build a map of subject_id -> level for fast lookups
   * @param {Array} items - Items from ItemData
   */
  function buildSubjectLevelMap(items) {
    state.subjectLevelMap = {};
    items.forEach(item => {
      if (!item || !item.data || !Number.isFinite(item.data.level)) {
        return;
      }

      state.subjectLevelMap[item.id] = item.data.level;
    });
  }

  /**
   * Extract levels with available reviews and count items per level
   * @param {Array} items - Items from ItemData
   * @returns {Object} Object mapping level -> count of available items
   */
  function extractAvailableLevels(items) {
    const levelCounts = {};
    const now = new Date();

    items.forEach(item => {
      // Check if item has an assignment and is available for review
      if (!item.assignments) {
        return;
      }

      const assignment = item.assignments;

      // Item is available for review if:
      // 1. It has been started (srs_stage > 0 means it's been through lessons)
      // 2. It's available_at time has passed
      // 3. It's not burned (srs_stage < 9)
      if (assignment.srs_stage > 0 &&
        assignment.srs_stage < 9 &&
        assignment.available_at) {

        const availableAt = new Date(assignment.available_at);

        // Only count if available_at is in the past (available for review now)
        if (availableAt <= now) {
          const level = item.data.level;
          levelCounts[level] = (levelCounts[level] || 0) + 1;
        }
      }
    });

    // Convert to sorted array of levels
    state.availableLevels = Object.keys(levelCounts)
      .map(Number)
      .sort((a, b) => a - b);

    return levelCounts;
  }

  // ============================================
  // SECTION 5: UI FUNCTIONS
  // ============================================

  /**
   * Create a DOM element with common attributes
   * @param {string} tag - The element tag name
   * @param {Object} options - Element options
   * @returns {HTMLElement} The created element
   */
  function createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.id) {
      element.id = options.id;
    }
    if (options.text !== undefined) {
      element.textContent = options.text;
    }
    if (options.html !== undefined) {
      element.innerHTML = options.html;
    }
    if (options.cssText) {
      element.style.cssText = options.cssText;
    }
    if (options.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    return element;
  }

  /**
   * Create the container for the dropdown UI
   * @param {HTMLSelectElement} dropdown - The dropdown to insert
   * @param {string} positionCss - Positioning CSS for the container
   * @returns {HTMLDivElement} The container element
   */
  function createDropdownContainer(dropdown, positionCss) {
    const container = createElement('div', {
      id: UI_IDS.container,
      cssText: STYLES.containerBase + positionCss
    });

    const label = createElement('label', {
      text: 'Level:',
      cssText: STYLES.label,
      attrs: { for: UI_IDS.dropdown }
    });

    container.appendChild(label);
    container.appendChild(dropdown);
    return container;
  }

  /**
   * Remove empty-queue UI and styling
   */
  function clearEmptyQueueUI() {
    const message = document.getElementById(UI_IDS.noItemsMessage);
    if (message) {
      message.remove();
    }
    if (document.body) {
      document.body.classList.remove(EMPTY_QUEUE_CLASS);
    }
  }

  /**
   * Create the level filter dropdown element
   * @param {Object} counts - Object mapping level -> count
   * @returns {HTMLSelectElement} The dropdown element
   */
  function createLevelDropdown(counts) {
    const dropdown = document.createElement('select');
    dropdown.id = UI_IDS.dropdown;
    dropdown.style.cssText = STYLES.dropdown;
    dropdown.setAttribute('aria-label', 'Filter by level');

    // Add "All Levels" option with total count
    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = `All Levels (${totalCount})`;
    dropdown.appendChild(allOption);

    // Add individual level options with counts
    // Only show levels that have items available
    const levelsToShow = state.availableLevels.length > 0
      ? state.availableLevels
      : Object.keys(counts).map(Number).sort((a, b) => a - b);

    levelsToShow.forEach(level => {
      const count = counts[level] || 0;
      if (count > 0) {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = `Level ${level} (${count})`;
        dropdown.appendChild(option);
      }
    });

    // Restore saved selection
    const savedLevel = getSelectedLevel();
    if (savedLevel) {
      dropdown.value = savedLevel;
    }

    // Save selection on change
    dropdown.addEventListener('change', (e) => {
      const selected = e.target.value;
      saveSelectedLevel(selected);
      // Remove empty queue message and class
      clearEmptyQueueUI();

      // Trigger queue refresh if wkQueue is available
      if (window.wkQueue && window.wkQueue.refresh) {
        window.wkQueue.refresh();
      }
    });

    return dropdown;
  }

  /**
   * Update the dropdown options based on current queue state
   * Called after filtering to reflect actual remaining items
   */
  function updateDropdownOptions() {
    if (!state.dropdown) return;

    const counts = state.currentQueueLevelCounts;
    const currentValue = state.dropdown.value;

    // Clear existing options
    state.dropdown.innerHTML = '';

    // Add "All Levels" option with total count
    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = `All Levels (${totalCount})`;
    state.dropdown.appendChild(allOption);

    // Add individual level options with counts (sorted)
    const sortedLevels = Object.keys(counts)
      .map(Number)
      .filter(level => counts[level] > 0)
      .sort((a, b) => a - b);

    sortedLevels.forEach(level => {
      const count = counts[level];
      const option = document.createElement('option');
      option.value = level;
      option.textContent = `Level ${level} (${count})`;
      state.dropdown.appendChild(option);
    });

    // Restore selection if it still exists, otherwise keep current
    const parsedValue = Number.parseInt(currentValue, 10);
    if (currentValue === 'all' || (Number.isFinite(parsedValue) && counts[parsedValue] > 0)) {
      state.dropdown.value = currentValue;
    } else {
      // Current level no longer has items, this shouldn't happen
      // as we switch levels before this, but just in case
      state.dropdown.value = 'all';
    }
  }

  /**
   * Insert the dropdown into the review page header
   * @param {HTMLSelectElement} dropdown - The dropdown to insert
   */
  function insertDropdownIntoPage(dropdown) {
    let attempts = 0;
    const maxAttempts = HEADER_TIMEOUT / HEADER_CHECK_INTERVAL;

    const waitForHeader = setInterval(() => {
      attempts++;

      // Look for the home button or header area
      const homeButton = document.querySelector('.wk-icon--home') ||
                        document.querySelector('[href="/"]');
      const header = homeButton ? homeButton.closest('header') : document.querySelector('header');

      if (homeButton || header) {
        clearInterval(waitForHeader);

        const container = createDropdownContainer(dropdown, STYLES.containerAbsolute);

        // Insert into the header or body
        if (header) {
          header.style.position = 'relative'; // Ensure header is positioned
          header.appendChild(container);
        } else {
          document.body.appendChild(container);
        }

      } else if (attempts >= maxAttempts) {
        clearInterval(waitForHeader);

        // Fallback: insert at top-left corner
        if (document.body) {
          const container = createDropdownContainer(dropdown, STYLES.containerFixed);
          document.body.appendChild(container);
        }
      }
    }, HEADER_CHECK_INTERVAL);
  }

  /**
   * Setup the UI by creating and inserting the dropdown
   */
  function setupUI() {
    if (document.getElementById(UI_IDS.container)) {
      return;
    }

    const counts = Object.keys(state.levelCounts).length > 0
      ? state.levelCounts
      : state.currentQueueLevelCounts;

    if (Object.keys(counts).length === 0) {
      return;
    }

    state.dropdown = createLevelDropdown(counts);
    insertDropdownIntoPage(state.dropdown);
  }

  // ============================================
  // SECTION 6: FILTERING LOGIC
  // ============================================

  /**
   * Setup queue manipulation using wkQueue
   */
  function setupQueueFilter() {
    if (!window.wkQueue || !window.wkQueue.addTotalChange) {
      return;
    }

    if (state.queueFilterOwner === window.wkQueue && state.queueFilterRegistered) {
      return;
    }

    // Register our filter callback
    window.wkQueue.addTotalChange(filterQueueByLevel, {
      openFramework: true,
      openFrameworkGetItemsConfig: 'assignments'
    });

    state.queueFilterOwner = window.wkQueue;
    state.queueFilterRegistered = true;
  }

  /**
   * Filter the queue to only include items from the selected level
   * This function is called by wkQueue whenever the queue changes
   */
  function filterQueueByLevel(queue) {
    const selectedLevel = getSelectedLevel();

    // Remove empty queue styling first
    clearEmptyQueueUI();

    // Track what levels are available in the current queue
    state.currentQueueLevels.clear();
    state.currentQueueLevelCounts = {};
    for (const queueItem of queue) {
      const itemLevel = getQueueItemLevel(queueItem);
      if (itemLevel !== null) {
        state.currentQueueLevels.add(itemLevel);
        state.currentQueueLevelCounts[itemLevel] = (state.currentQueueLevelCounts[itemLevel] || 0) + 1;
      }
    }

    // Ensure UI exists and update dropdown to reflect current queue state
    if (!state.dropdown) {
      setupUI();
    }
    updateDropdownOptions();

    // If "all" or no selection, return original queue
    if (!selectedLevel || selectedLevel === 'all') {
      return queue;
    }

    const selectedLevelNum = Number.parseInt(selectedLevel, 10);
    if (!Number.isFinite(selectedLevelNum)) {
      return queue;
    }

    // Filter queue items based on level
    const filteredQueue = queue.filter(queueItem => {
      const itemLevel = getQueueItemLevel(queueItem);
      return itemLevel === selectedLevelNum;
    });

    // If no items match, find the closest level with items in the current queue
    if (filteredQueue.length === 0) {
      const closestLevel = findClosestLevelWithItems(queue, selectedLevelNum);

      if (closestLevel !== null) {
        // Filter for the new level
        const newLevelQueue = queue.filter(queueItem => {
          const itemLevel = getQueueItemLevel(queueItem);
          return itemLevel === closestLevel;
        });

        // Show notification to user with accurate count
        showLevelSwitchNotification(selectedLevelNum, closestLevel, newLevelQueue.length);

        // Update the saved level
        saveSelectedLevel(closestLevel.toString());

        // Update the dropdown UI
        if (state.dropdown) {
          state.dropdown.value = closestLevel.toString();
        }

        return newLevelQueue;
      } else {
        // No levels have items at all - show message
        document.body.classList.add(EMPTY_QUEUE_CLASS);
        showNoItemsMessage();
        return queue; // Return original queue to prevent redirect
      }
    }

    return filteredQueue;
  }

  /**
   * Find the closest level that has available items in the current queue
   * @param {Array} queue - The current review queue
   * @param {number} targetLevel - The level to find closest match for
   * @returns {number|null} Closest level with items, or null if none
   */
  function findClosestLevelWithItems(queue, targetLevel) {
    // Build a set of levels that actually have items in the current queue
    const levelsWithItems = new Set();
    for (const queueItem of queue) {
      const itemLevel = getQueueItemLevel(queueItem);
      if (itemLevel !== null && itemLevel !== targetLevel) {
        levelsWithItems.add(itemLevel);
      }
    }

    if (levelsWithItems.size === 0) {
      return null;
    }

    // Find the level with minimum distance
    let closestLevel = null;
    let minDistance = Infinity;

    for (const level of levelsWithItems) {
      const distance = Math.abs(level - targetLevel);

      // If distance is smaller, or same distance but lower level (prefer lower)
      if (distance < minDistance || (distance === minDistance && level < closestLevel)) {
        minDistance = distance;
        closestLevel = level;
      }
    }

    return closestLevel;
  }

  // ============================================
  // SECTION 7: STORAGE FUNCTIONS
  // ============================================

  /**
   * Normalize a stored level value to 'all' or a numeric string
   * @param {string|number|null|undefined} value - Stored or incoming value
   * @returns {string} Normalized level value
   */
  function normalizeSelectedLevel(value) {
    if (value === null || value === undefined || value === 'all') {
      return 'all';
    }

    const stringValue = String(value).trim();
    if (!/^\d+$/.test(stringValue)) {
      return 'all';
    }

    const parsed = Number.parseInt(stringValue, 10);
    return parsed > 0 ? String(parsed) : 'all';
  }

  /**
   * Get the currently selected level from localStorage
   * @returns {string} The selected level or 'all'
   */
  function getSelectedLevel() {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    const normalized = normalizeSelectedLevel(storedValue);

    if (normalized === 'all' && storedValue !== null) {
      localStorage.removeItem(STORAGE_KEY);
    }

    return normalized;
  }

  /**
   * Save the selected level to localStorage
   * @param {string|number} level - The level to save
   */
  function saveSelectedLevel(level) {
    const normalized = normalizeSelectedLevel(level);
    if (normalized === 'all') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, normalized);
    }
  }

  // ============================================
  // SECTION 8: EMPTY QUEUE UI
  // ============================================

  /**
   * Show a message when there are no items from the selected level
   */
  function showNoItemsMessage() {
    // Remove existing message if any
    const existing = document.getElementById(UI_IDS.noItemsMessage);
    if (existing) {
      return; // Message already showing
    }

    const selectedLevel = getSelectedLevel();
    const message = createElement('div', {
      id: UI_IDS.noItemsMessage,
      cssText: STYLES.noItemsMessage,
      html: `
      <h2 style="margin-top: 0; color: #333;">No Items Available</h2>
      <p style="font-size: 16px; color: #666;">
        There are no review items available for <strong>Level ${selectedLevel}</strong> in the current session.
      </p>
      <p style="font-size: 14px; color: #888;">
        Try selecting a different level from the dropdown above, or select "All Levels" to review everything.
      </p>
    `
    });

    document.body.appendChild(message);
  }

  /**
   * Show a brief notification when auto-switching levels
   * @param {number} fromLevel - The level we're switching from
   * @param {number} toLevel - The level we're switching to
   * @param {number} itemCount - Number of items in the new level
   */
  function showLevelSwitchNotification(fromLevel, toLevel, itemCount) {
    const notification = createElement('div', {
      cssText: STYLES.notification
    });

    notification.textContent = `Level ${fromLevel} complete! Switched to Level ${toLevel} (${itemCount} items)`;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'wkLevelFilterSlideUp 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ============================================
  // SECTION 9: NAVIGATION INTERCEPTOR
  // ============================================

  /**
   * Track clicks on the home button to distinguish user navigation from automatic redirects
   */
  function setupHomeButtonTracking() {
    document.addEventListener('click', (e) => {
      // Check if user clicked on home link or home icon
      const homeLink = e.target.closest('a[href="/"], a[href="/dashboard"], .wk-icon--home');
      if (homeLink) {
        state.userClickedHome = true;
        // Reset after a short delay in case navigation doesn't happen
        setTimeout(() => { state.userClickedHome = false; }, 1000);
      }
    }, true); // Capture phase to catch before navigation
  }

  /**
   * Setup interceptor to prevent redirect when switching levels
   * This catches the redirect that wkQueue/WaniKani triggers when queue is empty
   */
  function setupNavigationInterceptor() {
    document.addEventListener('turbo:before-visit', (event) => {
      // Only intercept if we're on a review page
      if (!isReviewPage()) return;

      // Check if navigating to dashboard/home
      const targetUrl = event.detail.url;
      const isHomeRedirect = targetUrl.endsWith('/') ||
                             targetUrl.includes('/dashboard') ||
                             targetUrl.match(/wanikani\.com\/?$/) ||
                             targetUrl.match(/wanikani\.com\/dashboard/);

      if (!isHomeRedirect) return;

      // If user clicked home button, allow navigation
      if (state.userClickedHome) {
        state.userClickedHome = false;
        return;
      }

      // Check if we have a level filter active
      const selectedLevel = getSelectedLevel();
      if (!selectedLevel || selectedLevel === 'all') return;

      const selectedLevelNum = Number.parseInt(selectedLevel, 10);
      if (!Number.isFinite(selectedLevelNum)) return;

      // Check if there are other levels with items in the current queue
      const otherLevels = [...state.currentQueueLevels].filter(l => l !== selectedLevelNum);

      if (otherLevels.length === 0) return; // No other levels, allow redirect

      // Find closest level
      let closestLevel = null;
      let minDistance = Infinity;

      for (const level of otherLevels) {
        const distance = Math.abs(level - selectedLevelNum);
        if (distance < minDistance || (distance === minDistance && level < closestLevel)) {
          minDistance = distance;
          closestLevel = level;
        }
      }

      if (closestLevel !== null) {
        // Prevent the redirect
        event.preventDefault();

        // Switch to the new level
        saveSelectedLevel(closestLevel.toString());
        if (state.dropdown) {
          state.dropdown.value = closestLevel.toString();
        }

        // Show notification
        const itemCount = state.currentQueueLevelCounts[closestLevel] || 0;
        showLevelSwitchNotification(selectedLevelNum, closestLevel, itemCount);

        // Refresh the queue to load the new level's items
        if (window.wkQueue && window.wkQueue.refresh) {
          window.wkQueue.refresh();
        }
      }
    }, true); // Use capture phase to intercept before other handlers
  }

  // ============================================
  // SECTION 10: UTILITY FUNCTIONS
  // ============================================

  /**
   * Get the level for a queue item, with a fallback to the item data
   * @param {Object} queueItem - Queue item from wkQueue
   * @returns {number|null} Level number, or null if unavailable
   */
  function getQueueItemLevel(queueItem) {
    if (!queueItem || !queueItem.item) {
      return null;
    }

    const item = queueItem.item;
    const subjectId = item.id;
    let level = state.subjectLevelMap[subjectId];

    if (!Number.isFinite(level) && item.data && Number.isFinite(item.data.level)) {
      level = item.data.level;
      state.subjectLevelMap[subjectId] = level;
    }

    return Number.isFinite(level) ? level : null;
  }

  /**
   * Check if the current page is a review page
   * @returns {boolean} True if on review page
   */
  function isReviewPage() {
    return window.location.pathname.includes('/review') ||
           window.location.pathname.includes('/extra_study');
  }

  // ============================================
  // SECTION 11: INITIALIZATION
  // ============================================

  /**
   * Initialize the level filter system
   */
  function initializeLevelFilter() {
    // Only run on review pages
    if (!isReviewPage()) {
      return;
    }

    // Prevent double initialization
    if (state.initialized) {
      return;
    }

    state.initialized = true;

    // Include ItemData module
    wkof.include('ItemData');

    // Wait for module to be ready
    wkof.ready('ItemData')
      .then(() => {
        // Load all items and build level map
        return loadItemDataWithLevels();
      })
      .then((levels) => {
        // Setup queue filter using wkQueue
        setupQueueFilter();

        // Create and insert UI
        setupUI();
      })
      .catch(error => {
        state.initialized = false; // Allow retry on error
      });
  }

  /**
   * Handle turbo navigation events
   */
  function handleTurboLoad() {
    // Remove UI if not on review page
    if (!isReviewPage()) {
      cleanupUI();
      state.initialized = false; // Allow re-initialization if we return to review page
      return;
    }

    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      initializeLevelFilter();
    }, 0);
  }

  /**
   * Clean up the filter UI when leaving review page
   */
  function cleanupUI() {
    // Remove the dropdown container
    const container = document.getElementById(UI_IDS.container);
    if (container) {
      container.remove();
    }

    // Remove empty queue styling
    clearEmptyQueueUI();

    // Reset dropdown reference
    state.dropdown = null;
  }

  // ============================================
  // SECTION 12: STARTUP
  // ============================================

  // Initial load
  if (isReviewPage()) {
    initializeLevelFilter();
  } else {
    cleanupUI(); // Clean up any leftover UI from previous session
  }

  // Handle turbo page transitions
  addEventListener('turbo:load', handleTurboLoad);
  addEventListener('turbo:render', handleTurboLoad);

})();
