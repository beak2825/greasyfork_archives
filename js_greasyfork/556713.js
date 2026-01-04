// ==UserScript==
// @name         xGhosted
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  Highlight and manage problem posts on X.com with a resizable, draggable panel
// @author       Tahzeeb
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @require      https://unpkg.com/preact@10.26.4/dist/preact.min.js
// @require      https://unpkg.com/preact@10.26.4/hooks/dist/hooks.umd.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/js/all.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556713/xGhosted.user.js
// @updateURL https://update.greasyfork.org/scripts/556713/xGhosted.meta.js
// ==/UserScript==

(function () {
  ('use strict');

  // Centralized configuration object
  const CONFIG = {
    timing: {
      debounceDelay: 500,
      throttleDelay: 1000,
      tabCheckThrottle: 5000,
      exportThrottle: 5000,
      rateLimitPause: 20000,
      pollInterval: 500,
      scrollInterval: 1500,
      isPostScanningEnabledOnStartup: false,
      userRequestedAutoScrollOnStartup: false,
      checkPostMaxTries: 30,
    },
    showSplash: true,
    logTarget: 'tampermonkey',
    persistProcessedPosts: false,
    linkPrefix: 'https://x.com',
    debug: false,
    smoothScrolling: true,
    scrollPercentage: 1.5,
    decoratePostsContainer: false,
  };

  // Event constants for consistent event naming across components
  const EVENTS = {
    INIT_COMPONENTS: 'xghosted:init-components',
    POST_REGISTERED: 'xghosted:post-registered',
    POST_REQUESTED: 'xghosted:post-requested',
    POST_RETRIEVED: 'xghosted:post-retrieved',
    REQUEST_POST_CHECK: 'xghosted:request-post-check',
    CLEAR_POSTS: 'xghosted:clear-posts',
    CLEAR_POSTS_UI: 'xghosted:clear-posts-ui',
    POSTS_CLEARED: 'xghosted:posts-cleared',
    POSTS_CLEARED_CONFIRMED: 'xghosted:posts-cleared-confirmed',
    REQUEST_POSTS: 'xghosted:request-posts',
    POSTS_RETRIEVED: 'xghosted:posts-retrieved',
    CSV_IMPORTED: 'xghosted:csv-imported',
    REQUEST_IMPORT_CSV: 'xghosted:request-import-csv',
    EXPORT_CSV: 'xghosted:export-csv',
    CSV_EXPORTED: 'xghosted:csv-exported',
    SET_SCANNING: 'xghosted:set-scanning',
    SCANNING_STATE_UPDATED: 'xghosted:scanning-state-updated',
    SET_AUTO_SCROLLING: 'xghosted:set-auto-scrolling',
    AUTO_SCROLLING_TOGGLED: 'xghosted:auto-scrolling-toggled',
    RATE_LIMIT_DETECTED: 'xghosted:rate-limit-detected',
    USER_PROFILE_UPDATED: 'xghosted:user-profile-updated',
    INIT: 'xghosted:init',
    STATE_UPDATED: 'xghosted:state-updated',
    OPEN_ABOUT: 'xghosted:open-about',
    TOGGLE_PANEL_VISIBILITY: 'xghosted:toggle-panel-visibility',
    COPY_LINKS: 'xghosted:copy-links',
    REQUEST_METRICS: 'xghosted:request-metrics',
    METRICS_RETRIEVED: 'xghosted:metrics-retrieved',
    EXPORT_METRICS: 'xghosted:export-metrics',
    METRICS_UPDATED: 'xghosted:metrics-updated',
    RECORD_POLL: 'xghosted:record-poll',
    RECORD_SCROLL: 'xghosted:record-scroll',
    RECORD_SCAN: 'xghosted:record-scan',
    RECORD_TAB_CHECK: 'xghosted:record-tab-check',
    SET_INITIAL_WAIT_TIME: 'xghosted:set-initial-wait-time',
    SET_POST_DENSITY: 'xghosted:set-post-density',
    SAVE_METRICS: 'xghosted:save-metrics',
    AUTO_DELETE_TOGGLE_REQUEST: 'xghosted:auto-delete-toggle-request',
    AUTO_DELETE_STATUS: 'xghosted:auto-delete-status',
  };
  const EVENT_CONTRACTS = {
    'xghosted:init-components': {
      config: 'object',
    },
    'xghosted:post-registered': {
      href: 'string',
      data: 'object',
    },
    'xghosted:post-requested': {
      href: 'string',
    },
    'xghosted:post-retrieved': {
      href: 'string',
      post: 'object|null',
    },
    'xghosted:request-post-check': {
      href: 'string',
    },
    'xghosted:clear-posts': {},
    'xghosted:clear-posts-ui': {},
    'xghosted:posts-cleared': {},
    'xghosted:posts-cleared-confirmed': {},
    'xghosted:request-posts': {},
    'xghosted:posts-retrieved': {
      posts: 'array',
    },
    'xghosted:csv-imported': {
      importedCount: 'number',
    },
    'xghosted:request-import-csv': {
      csvText: 'string',
    },
    'xghosted:export-csv': {},
    'xghosted:csv-exported': {
      csvData: 'string',
    },
    'xghosted:set-scanning': {
      enabled: 'boolean',
    },
    'xghosted:scanning-state-updated': {
      isPostScanningEnabled: 'boolean',
    },
    'xghosted:set-auto-scrolling': {
      enabled: 'boolean',
    },
    'xghosted:auto-scrolling-toggled': {
      userRequestedAutoScrolling: 'boolean',
    },
    'xghosted:rate-limit-detected': {
      pauseDuration: 'number',
    },
    'xghosted:user-profile-updated': {
      userProfileName: 'string|null',
    },
    'xghosted:init': {
      config: 'object',
    },
    'xghosted:state-updated': {
      isRateLimited: 'boolean',
    },
    'xghosted:open-about': {},
    'xghosted:toggle-panel-visibility': {
      isPanelVisible: 'boolean',
    },
    'xghosted:copy-links': {},
    'xghosted:request-metrics': {},
    'xghosted:metrics-retrieved': {
      timingHistory: 'array',
    },
    'xghosted:export-metrics': {},
    'xghosted:metrics-updated': {
      metrics: 'object',
    },
    'xghosted:record-poll': {
      postsProcessed: 'number',
      wasSkipped: 'boolean',
      containerFound: 'boolean',
      containerAttempted: 'boolean',
      pageType: 'string',
      isScanningStarted: 'boolean',
      isScanningStopped: 'boolean',
      cellInnerDivCount: 'number',
    },
    'xghosted:record-scroll': {
      bottomReached: 'boolean',
    },
    'xghosted:record-scan': {
      duration: 'number',
      postsProcessed: 'number',
      wasSkipped: 'boolean',
      interval: 'number',
      isAutoScrolling: 'boolean',
    },
    'xghosted:record-tab-check': {
      duration: 'number',
      success: 'boolean',
      rateLimited: 'boolean',
      attempts: 'number',
    },
    'xghosted:set-initial-wait-time': {
      time: 'number',
    },
    'xghosted:set-post-density': {
      count: 'number',
    },
    'xghosted:save-metrics': {},
    'xghosted:auto-delete-toggle-request': {
      enabled: 'boolean',
    },
    'xghosted:auto-delete-status': {
      running: 'boolean',
      deleting: 'boolean',
      deletedCount: 'number',
      username: 'string|null',
      canRun: 'boolean',
      message: 'string',
    },
  };

  // --- Inject Shared Utilities ---
  window.XGhostedUtils = (function () {
    // src/events.ts
    var EVENTS = {
      INIT_COMPONENTS: 'xghosted:init-components',
      POST_REGISTERED: 'xghosted:post-registered',
      POST_REQUESTED: 'xghosted:post-requested',
      POST_RETRIEVED: 'xghosted:post-retrieved',
      REQUEST_POST_CHECK: 'xghosted:request-post-check',
      CLEAR_POSTS: 'xghosted:clear-posts',
      CLEAR_POSTS_UI: 'xghosted:clear-posts-ui',
      POSTS_CLEARED: 'xghosted:posts-cleared',
      POSTS_CLEARED_CONFIRMED: 'xghosted:posts-cleared-confirmed',
      REQUEST_POSTS: 'xghosted:request-posts',
      POSTS_RETRIEVED: 'xghosted:posts-retrieved',
      CSV_IMPORTED: 'xghosted:csv-imported',
      REQUEST_IMPORT_CSV: 'xghosted:request-import-csv',
      EXPORT_CSV: 'xghosted:export-csv',
      CSV_EXPORTED: 'xghosted:csv-exported',
      SET_SCANNING: 'xghosted:set-scanning',
      SCANNING_STATE_UPDATED: 'xghosted:scanning-state-updated',
      SET_AUTO_SCROLLING: 'xghosted:set-auto-scrolling',
      AUTO_SCROLLING_TOGGLED: 'xghosted:auto-scrolling-toggled',
      RATE_LIMIT_DETECTED: 'xghosted:rate-limit-detected',
      USER_PROFILE_UPDATED: 'xghosted:user-profile-updated',
      INIT: 'xghosted:init',
      STATE_UPDATED: 'xghosted:state-updated',
      OPEN_ABOUT: 'xghosted:open-about',
      TOGGLE_PANEL_VISIBILITY: 'xghosted:toggle-panel-visibility',
      COPY_LINKS: 'xghosted:copy-links',
      REQUEST_METRICS: 'xghosted:request-metrics',
      METRICS_RETRIEVED: 'xghosted:metrics-retrieved',
      EXPORT_METRICS: 'xghosted:export-metrics',
      METRICS_UPDATED: 'xghosted:metrics-updated',
      RECORD_POLL: 'xghosted:record-poll',
      RECORD_SCROLL: 'xghosted:record-scroll',
      RECORD_SCAN: 'xghosted:record-scan',
      RECORD_TAB_CHECK: 'xghosted:record-tab-check',
      SET_INITIAL_WAIT_TIME: 'xghosted:set-initial-wait-time',
      SET_POST_DENSITY: 'xghosted:set-post-density',
      SAVE_METRICS: 'xghosted:save-metrics',
      AUTO_DELETE_TOGGLE_REQUEST: 'xghosted:auto-delete-toggle-request',
      AUTO_DELETE_STATUS: 'xghosted:auto-delete-status',
    };
    var EVENT_CONTRACTS = {
      [EVENTS.INIT_COMPONENTS]: { config: 'object' },
      [EVENTS.POST_REGISTERED]: { href: 'string', data: 'object' },
      [EVENTS.POST_REQUESTED]: { href: 'string' },
      [EVENTS.POST_RETRIEVED]: { href: 'string', post: 'object|null' },
      [EVENTS.REQUEST_POST_CHECK]: { href: 'string' },
      [EVENTS.CLEAR_POSTS]: {},
      [EVENTS.CLEAR_POSTS_UI]: {},
      [EVENTS.POSTS_CLEARED]: {},
      [EVENTS.POSTS_CLEARED_CONFIRMED]: {},
      [EVENTS.REQUEST_POSTS]: {},
      [EVENTS.POSTS_RETRIEVED]: { posts: 'array' },
      [EVENTS.CSV_IMPORTED]: { importedCount: 'number' },
      [EVENTS.REQUEST_IMPORT_CSV]: { csvText: 'string' },
      [EVENTS.EXPORT_CSV]: {},
      [EVENTS.CSV_EXPORTED]: { csvData: 'string' },
      [EVENTS.SET_SCANNING]: { enabled: 'boolean' },
      [EVENTS.SCANNING_STATE_UPDATED]: { isPostScanningEnabled: 'boolean' },
      [EVENTS.SET_AUTO_SCROLLING]: { enabled: 'boolean' },
      [EVENTS.AUTO_SCROLLING_TOGGLED]: {
        userRequestedAutoScrolling: 'boolean',
      },
      [EVENTS.RATE_LIMIT_DETECTED]: { pauseDuration: 'number' },
      [EVENTS.USER_PROFILE_UPDATED]: { userProfileName: 'string|null' },
      [EVENTS.INIT]: { config: 'object' },
      [EVENTS.STATE_UPDATED]: { isRateLimited: 'boolean' },
      [EVENTS.OPEN_ABOUT]: {},
      [EVENTS.TOGGLE_PANEL_VISIBILITY]: { isPanelVisible: 'boolean' },
      [EVENTS.COPY_LINKS]: {},
      [EVENTS.REQUEST_METRICS]: {},
      [EVENTS.METRICS_RETRIEVED]: { timingHistory: 'array' },
      [EVENTS.EXPORT_METRICS]: {},
      [EVENTS.METRICS_UPDATED]: { metrics: 'object' },
      [EVENTS.RECORD_POLL]: {
        postsProcessed: 'number',
        wasSkipped: 'boolean',
        containerFound: 'boolean',
        containerAttempted: 'boolean',
        pageType: 'string',
        isScanningStarted: 'boolean',
        isScanningStopped: 'boolean',
        cellInnerDivCount: 'number',
      },
      [EVENTS.RECORD_SCROLL]: { bottomReached: 'boolean' },
      [EVENTS.RECORD_SCAN]: {
        duration: 'number',
        postsProcessed: 'number',
        wasSkipped: 'boolean',
        interval: 'number',
        isAutoScrolling: 'boolean',
      },
      [EVENTS.RECORD_TAB_CHECK]: {
        duration: 'number',
        success: 'boolean',
        rateLimited: 'boolean',
        attempts: 'number',
      },
      [EVENTS.SET_INITIAL_WAIT_TIME]: { time: 'number' },
      [EVENTS.SET_POST_DENSITY]: { count: 'number' },
      [EVENTS.SAVE_METRICS]: {},
      [EVENTS.AUTO_DELETE_TOGGLE_REQUEST]: { enabled: 'boolean' },
      [EVENTS.AUTO_DELETE_STATUS]: {
        running: 'boolean',
        deleting: 'boolean',
        deletedCount: 'number',
        username: 'string|null',
        canRun: 'boolean',
        message: 'string',
      },
    };

    // src/utils/AutoDeleteManager.js
    var FLAGGED_SELECTOR = "div[data-testid='cellInnerDiv'][data-ghosted]";
    var ARTICLE_SELECTOR = "article[data-testid='tweet']";
    var CARET_SELECTORS = [
      "button[aria-label='More']",
      "div[aria-label='More']",
      "button[data-testid='caret']",
      "div[data-testid='caret']",
    ];
    var MENUITEM_SELECTOR = "[role='menuitem']";
    var CONFIRM_SELECTOR = "button[data-testid='confirmationSheetConfirm']";
    var PROBLEM_MARKERS = [
      'postquality.problem',
      'postquality.problem-adjacent',
      'postquality.potential-problem',
    ];
    var DEFAULT_CONFIG = {
      WAIT_BETWEEN_STEPS: 200,
      WAIT_AFTER_DELETE: 150,
      SCAN_INTERVAL: 400,
      MENU_ATTEMPTS: 3,
      CONFIRM_ATTEMPTS: 3,
    };
    if (typeof window !== 'undefined') {
      window.__xghostedPauseScroll = false;
    }
    var AutoDeleteManager = class {
      constructor({
        document: document2,
        window: window2,
        log,
        domUtils: domUtils2,
        emit,
        getUsername,
        isWithReplies,
        config = {},
      }) {
        this.document = document2;
        this.window = window2;
        this.log = log || (() => {});
        this.domUtils = domUtils2;
        this.emit = emit;
        this.getUsername = getUsername;
        this.isWithReplies = isWithReplies;
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.state = {
          running: false,
          deleting: false,
          deletedCount: 0,
          lastError: null,
        };
        this.loopHandle = null;
      }
      handleToggle(enabled) {
        if (enabled) {
          this.start();
        } else {
          this.stop();
        }
      }
      start() {
        if (this.state.running) {
          return;
        }
        if (!this.canOperate()) {
          this.state.lastError = this.getUnavailableReason();
          this.emitStatus();
          return;
        }
        this.state.running = true;
        this.state.deletedCount = 0;
        this.state.lastError = null;
        this.log(`[AutoDelete] Started for @${this.getNormalizedUsername()}`);
        this.ensureLoop();
        this.emitStatus();
        void this.runCycle();
      }
      stop(reason) {
        if (!this.state.running) {
          this.state.lastError = reason || this.state.lastError;
          this.emitStatus();
          return;
        }
        this.state.running = false;
        if (reason) {
          this.state.lastError = reason;
        }
        this.clearLoop();
        this.log('[AutoDelete] Stopped');
        this.emitStatus();
      }
      destroy() {
        this.clearLoop();
      }
      handleContextChange() {
        if (this.state.running && !this.canOperate()) {
          this.stop(this.getUnavailableReason());
          return;
        }
        this.emitStatus();
      }
      ensureLoop() {
        if (this.loopHandle) {
          return;
        }
        this.loopHandle = this.window.setInterval(() => {
          void this.runCycle();
        }, this.config.SCAN_INTERVAL);
      }
      clearLoop() {
        if (this.loopHandle) {
          this.window.clearInterval(this.loopHandle);
          this.loopHandle = null;
        }
      }
      async runCycle() {
        if (!this.state.running || this.state.deleting) {
          return;
        }
        if (!this.canOperate()) {
          this.stop(this.getUnavailableReason());
          return;
        }
        const article = this.findFirstFlaggedArticle();
        if (!article) {
          return;
        }
        this.window.__xghostedPauseScroll = true;
        this.state.deleting = true;
        this.emitStatus();
        try {
          const deleted = await this.deleteArticle(article);
          if (deleted) {
            this.state.deletedCount += 1;
            this.log(
              `[AutoDelete] Deleted flagged post #${this.state.deletedCount}`
            );
          }
        } catch (error) {
          this.log(
            `[AutoDelete] Error deleting post: ${error?.message || error}`
          );
          this.state.lastError = error?.message || String(error);
        } finally {
          this.state.deleting = false;
          this.emitStatus();
          this.window.__xghostedPauseScroll = false;
        }
      }
      async deleteArticle(article) {
        const caret = await this.findCaretWithRetry(article);
        if (!caret) {
          this.log('[AutoDelete] Caret button not found');
          return false;
        }
        caret.click();
        await this.delay(this.config.WAIT_BETWEEN_STEPS);
        const deleteClicked = await this.tryClickDeleteMenuItem();
        if (!deleteClicked) {
          this.log('[AutoDelete] Delete menu item not clicked');
          return false;
        }
        const confirmed = await this.tryConfirmDelete();
        if (!confirmed) {
          this.log('[AutoDelete] Confirm delete button not found');
          return false;
        }
        await this.delay(this.config.WAIT_AFTER_DELETE);
        return true;
      }
      findFirstFlaggedArticle() {
        const flaggedCells = this.getAllFlaggedCells();
        for (const cell of flaggedCells) {
          const article = this.getTargetArticleFromCell(cell);
          if (article) {
            return article;
          }
        }
        return null;
      }
      getAllFlaggedCells() {
        const nodes = Array.from(
          this.document.querySelectorAll(FLAGGED_SELECTOR)
        );
        return nodes.filter((node) => {
          const ghost = (node.getAttribute('data-ghosted') || '').toLowerCase();
          return PROBLEM_MARKERS.some((marker) => ghost.includes(marker));
        });
      }
      getTargetArticleFromCell(cell) {
        const articles = Array.from(cell.querySelectorAll(ARTICLE_SELECTOR));
        return articles.find((article) => this.isTweetByUser(article)) || null;
      }
      isTweetByUser(article) {
        const username = this.getNormalizedUsername();
        if (!article || !username) {
          return false;
        }
        const links = Array.from(article.querySelectorAll("a[href^='/']"));
        for (const link of links) {
          const href = (link.getAttribute('href') || '').toLowerCase();
          if (!href.startsWith('/')) {
            continue;
          }
          if (href === `/${username}` || href.startsWith(`/${username}/`)) {
            const repostMarker = article.querySelector(
              "button[data-testid='unretweet']"
            );
            if (repostMarker) {
              return false;
            }
            return true;
          }
        }
        return false;
      }
      async findCaretWithRetry(article, maxRetries = 5, delayMs = 250) {
        for (let i = 0; i < maxRetries; i++) {
          const caret = CARET_SELECTORS.map((selector) =>
            article.querySelector(selector)
          ).find((el) => this.isVisible(el));
          if (caret) {
            return caret;
          }
          await this.delay(delayMs);
        }
        return null;
      }
      async tryClickDeleteMenuItem() {
        for (let attempt = 0; attempt < this.config.MENU_ATTEMPTS; attempt++) {
          await this.delay(this.config.WAIT_BETWEEN_STEPS * (attempt + 1));
          const menuItems = this.document.querySelectorAll(MENUITEM_SELECTOR);
          for (const item of menuItems) {
            const label = (item.innerText || '').toLowerCase();
            if (label.includes('delete')) {
              item.click();
              return true;
            }
          }
        }
        return false;
      }
      async tryConfirmDelete() {
        for (
          let attempt = 0;
          attempt < this.config.CONFIRM_ATTEMPTS;
          attempt++
        ) {
          await this.delay(this.config.WAIT_BETWEEN_STEPS * (attempt + 1));
          const confirmBtn = this.document.querySelector(CONFIRM_SELECTOR);
          if (this.isVisible(confirmBtn)) {
            confirmBtn.click();
            return true;
          }
        }
        return false;
      }
      canOperate() {
        return Boolean(this.getNormalizedUsername()) && this.isOnRepliesPage();
      }
      isOnRepliesPage() {
        const username = this.getNormalizedUsername();
        if (!username) {
          return false;
        }
        const pathname = this.window.location.pathname.toLowerCase();
        return (
          this.isWithReplies() &&
          pathname.startsWith(`/${username}`) &&
          pathname.endsWith('/with_replies')
        );
      }
      getUnavailableReason() {
        if (!this.getNormalizedUsername()) {
          return "Open your profile's /with_replies page to capture the username.";
        }
        if (!this.isWithReplies()) {
          return 'Auto delete is only available on the /with_replies view.';
        }
        return 'Navigate to your own /with_replies page to enable auto delete.';
      }
      emitStatus() {
        const detail = {
          running: this.state.running,
          deleting: this.state.deleting,
          deletedCount: this.state.deletedCount,
          username: this.getNormalizedUsername() || null,
          canRun: this.canOperate(),
          message: this.state.lastError || this.composeMessage(),
        };
        this.emit(EVENTS.AUTO_DELETE_STATUS, detail);
      }
      composeMessage() {
        if (!this.getNormalizedUsername()) {
          return 'Open a /with_replies page to detect your username.';
        }
        if (!this.isWithReplies()) {
          return 'Auto delete becomes available on /with_replies.';
        }
        if (this.state.deleting) {
          return 'Deleting a flagged reply...';
        }
        if (this.state.running) {
          return 'Scanning flagged replies...';
        }
        return 'Ready to delete flagged replies.';
      }
      getNormalizedUsername() {
        const raw = (this.getUsername?.() || '').trim().replace(/^@/, '');
        return raw.toLowerCase();
      }
      isVisible(el) {
        return Boolean(
          el &&
            (el.offsetWidth || el.offsetHeight || el.getClientRects().length)
        );
      }
      delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
    };

    // src/utils/clipboardUtils.js
    function copyTextToClipboard(text, log) {
      return navigator.clipboard
        .writeText(text)
        .then(() => log('Text copied to clipboard'))
        .catch((err) => log(`Clipboard copy failed: ${err}`));
    }
    function exportToCSV(data, filename, doc, log) {
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = doc.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      log(`Exported CSV: ${filename}`);
    }

    // src/utils/debounce.js
    function debounce(func, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        return new Promise((resolve, reject) => {
          timeout = setTimeout(() => {
            try {
              const result = func(...args);
              if (result && typeof result.then === 'function') {
                result.then(resolve).catch(reject);
              } else {
                resolve(result);
              }
            } catch (error) {
              reject(error);
            }
          }, wait);
        });
      };
    }

    // src/utils/postQuality.js
    var postQuality = Object.freeze({
      UNDEFINED: Object.freeze({ name: 'Undefined Container', value: 0 }),
      DIVIDER: Object.freeze({ name: 'Invisible Divider', value: 1 }),
      PROBLEM: Object.freeze({ name: 'Problem', value: 2 }),
      PROBLEM_ADJACENT: Object.freeze({
        name: 'Problem by Association',
        value: 3,
      }),
      POTENTIAL_PROBLEM: Object.freeze({ name: 'Potential Problem', value: 4 }),
      GOOD: Object.freeze({ name: 'Good', value: 5 }),
    });

    // src/utils/summarizeRatedPosts.js
    function summarizeRatedPosts(analyses) {
      const summary = {
        [postQuality.UNDEFINED.name]: 0,
        [postQuality.DIVIDER.name]: 0,
        [postQuality.PROBLEM.name]: 0,
        [postQuality.PROBLEM_ADJACENT.name]: 0,
        [postQuality.POTENTIAL_PROBLEM.name]: 0,
        [postQuality.GOOD.name]: 0,
      };
      if (!Array.isArray(analyses)) {
        return summary;
      }
      analyses.forEach((analysis) => {
        if (analysis && analysis.quality && analysis.quality.name) {
          summary[analysis.quality.name]++;
        }
      });
      return summary;
    }

    // src/utils/postConnector.js
    var postConnector = Object.freeze({
      DIVIDES: Object.freeze({ name: 'Invisibly Dividing', value: 0 }),
      INDEPENDENT: Object.freeze({ name: 'Standing Alone', value: 1 }),
      STARTS: Object.freeze({ name: 'Starting', value: 2 }),
      CONTINUES: Object.freeze({ name: 'Continuing', value: 3 }),
      DANGLES: Object.freeze({ name: 'Dangling', value: 4 }),
    });

    // src/utils/summarizeConnectedPosts.js
    function summarizeConnectedPosts(analyses) {
      const summary = {
        [postConnector.DIVIDES.name]: 0,
        [postConnector.INDEPENDENT.name]: 0,
        [postConnector.STARTS.name]: 0,
        [postConnector.CONTINUES.name]: 0,
        [postConnector.DANGLES.name]: 0,
      };
      if (!Array.isArray(analyses)) {
        return summary;
      }
      analyses.forEach((analysis) => {
        if (analysis && analysis.connector && analysis.connector.name) {
          summary[analysis.connector.name]++;
        }
      });
      return summary;
    }

    // src/utils/describeSampleAnalyses.js
    function describeSampleAnalyses(document2, analyses) {
      const {
        GOOD,
        PROBLEM,
        PROBLEM_ADJACENT,
        POTENTIAL_PROBLEM,
        DIVIDER,
        UNDEFINED,
      } = postQuality;
      const { DIVIDES, INDEPENDENT, STARTS, CONTINUES, DANGLES } =
        postConnector;
      const totalPosts = document2.querySelectorAll(
        'div[data-testid="cellInnerDiv"]'
      ).length;
      const totalArticles = document2.querySelectorAll(
        'article:not(article article)'
      ).length;
      const totalNestedArticles =
        document2.querySelectorAll('article article').length;
      const postQualitySummary = summarizeRatedPosts(analyses);
      const postConnectorSummary = summarizeConnectedPosts(analyses);
      const $padding = 2;
      const totalGood = postQualitySummary[GOOD.name];
      const totalPotentialProblems = postQualitySummary[POTENTIAL_PROBLEM.name];
      const totalProblems = postQualitySummary[PROBLEM.name];
      const totalAdjacentProblems = postQualitySummary[PROBLEM_ADJACENT.name];
      const totalDividers = postQualitySummary[DIVIDER.name];
      const totalUndefined = postQualitySummary[UNDEFINED.name];
      const totalDivides = postConnectorSummary[DIVIDES.name];
      const totalINDEPENDENT = postConnectorSummary[INDEPENDENT.name];
      const totalStarts = postConnectorSummary[STARTS.name];
      const totalContinues = postConnectorSummary[CONTINUES.name];
      const totalDangles = postConnectorSummary[DANGLES.name];
      return [
        `Structure Summary Totals:`,
        `  ${`${totalPosts}`.padStart($padding, ' ')} Posts`,
        `  ${`${totalArticles}`.padStart($padding, ' ')} Articles`,
        `  ${`${totalNestedArticles}`.padStart($padding, ' ')} Nested Articles`,
        ``,
        `Rated Post Quality Totals:`,
        `  ${`${totalGood}`.padStart($padding, ' ')} ${GOOD.name}`,
        `  ${`${totalPotentialProblems}`.padStart($padding, ' ')} ${POTENTIAL_PROBLEM.name}`,
        `  ${`${totalProblems}`.padStart($padding, ' ')} ${PROBLEM.name}`,
        `  ${`${totalAdjacentProblems}`.padStart($padding, ' ')} ${PROBLEM_ADJACENT.name}`,
        `  ${`${totalDividers}`.padStart($padding, ' ')} ${DIVIDER.name}`,
        `  ${`${totalUndefined}`.padStart($padding, ' ')} ${UNDEFINED.name}`,
        ``,
        `Post Connections Totals:`,
        `  ${`${totalDivides}`.padStart($padding, ' ')} ${DIVIDES.name}`,
        `  ${`${totalINDEPENDENT}`.padStart($padding, ' ')} ${INDEPENDENT.name}`,
        `  ${`${totalStarts}`.padStart($padding, ' ')} ${STARTS.name}`,
        `  ${`${totalContinues}`.padStart($padding, ' ')} ${CONTINUES.name}`,
        `  ${`${totalDangles}`.padStart($padding, ' ')} ${DANGLES.name}`,
      ].join('\n');
    }

    // src/utils/getPostEngagement.js
    function getPostEngagement(post) {
      const engagementContainer = post.querySelector('[role="group"]');
      if (engagementContainer) {
        const replyCount =
          engagementContainer.querySelector('[data-testid="reply"] span')
            ?.textContent || '0';
        const likeCount =
          engagementContainer.querySelector(
            '[data-testid="like"] span, [data-testid="unlike"] span'
          )?.textContent || '0';
        const repostCount =
          engagementContainer.querySelector('[data-testid="retweet"] span')
            ?.textContent || '0';
        const impressionElement = engagementContainer.querySelector(
          '[href*="/analytics"] [data-testid="app-text-transition-container"] span'
        );
        let impressionCount = impressionElement?.textContent || '0';
        impressionCount = parseImpressionCount(impressionCount);
        return {
          replyCount: parseInt(replyCount) || 0,
          likeCount: parseInt(likeCount) || 0,
          repostCount: parseInt(repostCount) || 0,
          impressionCount,
        };
      }
      return {
        replyCount: 0,
        likeCount: 0,
        repostCount: 0,
        impressionCount: 0,
      };
    }
    function parseImpressionCount(impressionText) {
      if (!impressionText || typeof impressionText !== 'string') return 0;
      impressionText = impressionText.trim().toLowerCase();
      if (impressionText.endsWith('k')) {
        const num = parseFloat(impressionText.replace('k', ''));
        return isNaN(num) ? 0 : Math.round(num * 1e3);
      } else if (impressionText.endsWith('m')) {
        const num = parseFloat(impressionText.replace('m', ''));
        return isNaN(num) ? 0 : Math.round(num * 1e6);
      } else {
        const num = parseInt(impressionText);
        return isNaN(num) ? 0 : num;
      }
    }

    // src/utils/Logger.js
    var Logger = class {
      constructor({ logTarget = 'tampermonkey' }) {
        this.logTarget = logTarget;
      }
      log(...args) {
        if (this.logTarget === 'console') {
          console.log(...args);
        } else {
          GM_log(...args);
        }
      }
    };
    window.Logger = Logger;

    // src/config.js
    var CONFIG = {
      timing: {
        debounceDelay: 500,
        throttleDelay: 1e3,
        tabCheckThrottle: 5e3,
        exportThrottle: 5e3,
        rateLimitPause: 20 * 1e3,
        pollInterval: 500,
        scrollInterval: 1500,
        isPostScanningEnabledOnStartup: false,
        // We'll send an event to change to true on the first heartbeat poll
        userRequestedAutoScrollOnStartup: false,
        checkPostMaxTries: 30,
      },
      showSplash: true,
      logTarget: 'tampermonkey',
      persistProcessedPosts: false,
      linkPrefix: 'https://x.com',
      debug: false,
      smoothScrolling: true,
      scrollPercentage: 1.5,
      decoratePostsContainer: false,
    };

    // src/utils/PollingManager.js
    var PollingManager = class {
      constructor({ document: document2, xGhosted, timing, log, domService }) {
        this.document = document2;
        this.xGhosted = xGhosted;
        this.timing = { ...CONFIG.timing, ...timing };
        this.log = log || console.log.bind(console);
        this.domService = domService;
        this.state = {
          isPostScanningEnabled: CONFIG.timing.isPostScanningEnabledOnStartup,
          userRequestedAutoScrolling:
            CONFIG.timing.userRequestedAutoScrollOnStartup,
          noPostsFoundCount: 0,
          lastCellInnerDivCount: 0,
          idleCycleCount: 0,
          scrolls: 0,
          lastScrollY: 0,
        };
        this.pollTimer = null;
        this.detectAndHandleUrlChangeDebounced = debounce(
          (url) => this.xGhosted.detectAndHandleUrlChange(url),
          100
        );
        this.initEventListeners();
      }
      initEventListeners() {
        this.document.addEventListener(
          EVENTS.SET_SCANNING,
          ({ detail: { enabled } }) => {
            this.setPostScanning(enabled);
          }
        );
        this.document.addEventListener(
          EVENTS.SET_AUTO_SCROLLING,
          ({ detail: { enabled } }) => {
            this.setAutoScrolling(enabled);
          }
        );
      }
      setPostScanning(enabled) {
        this.state.isPostScanningEnabled = enabled;
        this.log(
          `Post Scanning ${enabled ? 'enabled' : 'disabled'}, state: isPostScanningEnabled=${this.state.isPostScanningEnabled}`
        );
        this.domService.emit(EVENTS.SCANNING_STATE_UPDATED, {
          isPostScanningEnabled: this.state.isPostScanningEnabled,
        });
        if (!this.pollTimer && enabled) {
          this.startPolling();
        }
      }
      initializePostScanning() {
        this.log('Initializing post scanning...');
        this.setPostScanning(true);
      }
      setAutoScrolling(enabled) {
        this.state.userRequestedAutoScrolling = enabled;
        this.state.idleCycleCount = enabled ? 0 : this.state.idleCycleCount;
        this.log(
          `Auto-scrolling set to: ${enabled}, state: userRequestedAutoScrolling=${this.state.userRequestedAutoScrolling}`
        );
        this.domService.emit(EVENTS.AUTO_SCROLLING_TOGGLED, {
          userRequestedAutoScrolling: this.state.userRequestedAutoScrolling,
        });
      }
      checkDocumentReadiness() {
        if (!this.document.body) {
          this.log('No document body, retrying...');
          return false;
        }
        return true;
      }
      async handleUrlChange() {
        return await this.detectAndHandleUrlChangeDebounced(
          window.location.href
        );
      }
      updatePostCount(urlChanged) {
        let cellInnerDivCount = urlChanged
          ? 0
          : this.xGhosted.getCellInnerDivCount();
        if (cellInnerDivCount !== this.state.lastCellInnerDivCount) {
          if (CONFIG.debug) {
            this.log(`cellInnerDivCount: ${cellInnerDivCount}`);
          }
        }
        return cellInnerDivCount;
      }
      tryTagContainer(cellInnerDivCount) {
        let containerAttempted = false;
        if (!this.xGhosted.state.containerFound) {
          containerAttempted = true;
          if (this.xGhosted.tryTagPostsContainer()) {
            this.log('Container found, setting post density');
            cellInnerDivCount = this.xGhosted.getCellInnerDivCount();
            this.domService.emit(EVENTS.SET_POST_DENSITY, {
              count: cellInnerDivCount,
            });
          } else if (CONFIG.debug) {
            this.log(
              this.state.noPostsFoundCount === 0
                ? 'No post container found, trying to find it...'
                : 'Container still not found, skipping highlighting'
            );
          }
          this.state.noPostsFoundCount++;
        }
        return { containerAttempted, cellInnerDivCount };
      }
      async processUnprocessedPosts(cellInnerDivCount) {
        let postsProcessed = 0;
        if (
          this.state.isPostScanningEnabled &&
          !this.xGhosted.state.isHighlighting
        ) {
          const unprocessedPosts = this.xGhosted.getUnprocessedPosts();
          const start = performance.now();
          if (unprocessedPosts.length > 0) {
            postsProcessed = unprocessedPosts.length;
            await this.xGhosted.processUnprocessedPosts(
              unprocessedPosts,
              this.xGhosted.state.isWithReplies,
              CONFIG.debug,
              this.log,
              this.domService.emit.bind(this.domService)
            );
            this.state.noPostsFoundCount = 0;
            this.state.idleCycleCount = 0;
          } else if (this.xGhosted.state.containerFound) {
            this.state.noPostsFoundCount = 0;
            this.state.idleCycleCount = 0;
            await this.xGhosted.processUnprocessedPosts(
              [],
              this.xGhosted.state.isWithReplies,
              CONFIG.debug,
              this.log,
              this.domService.emit.bind(this.domService)
            );
          } else {
            this.state.idleCycleCount++;
          }
          const duration = performance.now() - start;
          const interval = this.state.userRequestedAutoScrolling
            ? this.timing.scrollInterval
            : this.timing.pollInterval;
          if (this.state.userRequestedAutoScrolling || postsProcessed > 0) {
            this.domService.emit(EVENTS.RECORD_SCAN, {
              duration,
              postsProcessed,
              wasSkipped: postsProcessed === 0,
              interval,
              isAutoScrolling: this.state.userRequestedAutoScrolling,
            });
          }
        } else if (
          cellInnerDivCount !== this.state.lastCellInnerDivCount &&
          CONFIG.debug
        ) {
          this.log(
            `cellInnerDivCount changed from ${this.state.lastCellInnerDivCount} to ${cellInnerDivCount}, but polling is disabled or highlighting active`
          );
        }
        return postsProcessed;
      }
      performAutoScroll(cellInnerDivCount, previousPostCount) {
        if (window.__xghostedPauseScroll) {
          this.log('Auto-scroll paused: auto-delete in progress');
          return previousPostCount;
        }
        if (
          this.state.isPostScanningEnabled &&
          this.state.userRequestedAutoScrolling
        ) {
          this.log(
            `Polling in auto-scrolling mode, interval: ${this.timing.scrollInterval}ms`
          );
          const beforeScrollY = this.domService.getScrollY();
          this.log('Performing smooth scroll down...');
          this.state.scrolls++;
          this.log('Scroll count: ' + this.state.scrolls);
          const scrollAmount =
            this.state.idleCycleCount >= 3
              ? this.domService.getInnerHeight()
              : this.domService.getInnerHeight() * CONFIG.scrollPercentage;
          this.domService.scrollBy({
            top: scrollAmount,
            behavior: CONFIG.smoothScrolling ? 'smooth' : 'auto',
          });
          if (CONFIG.debug) {
            const afterScrollY = this.domService.getScrollY();
            if (afterScrollY === beforeScrollY) {
              this.log('Scroll attempt failed: scrollY unchanged');
            } else {
              this.log(`Scrolled from ${beforeScrollY}px to ${afterScrollY}px`);
            }
            this.state.lastScrollY = afterScrollY;
          }
          const bottomReached =
            this.domService.getScrollY() + this.domService.getInnerHeight() >=
            this.domService.getScrollHeight();
          const newPostCount = this.xGhosted.getCellInnerDivCount();
          this.domService.emit(EVENTS.RECORD_SCROLL, { bottomReached });
          if (bottomReached || this.state.idleCycleCount >= 3) {
            this.log(
              `Stopping post scanning: ${bottomReached ? 'reached page bottom' : '3 idle cycles'}`
            );
            this.setPostScanning(false);
          }
          return newPostCount;
        } else {
          if (this.state.userRequestedAutoScrolling && CONFIG.debug) {
            this.log('Auto-scrolling skipped: polling disabled');
          }
          return previousPostCount;
        }
      }
      scheduleNextCycle() {
        const interval =
          this.state.isPostScanningEnabled &&
          this.state.userRequestedAutoScrolling
            ? this.timing.scrollInterval
            : this.timing.pollInterval;
        this.pollTimer = setTimeout(() => this.runPollingCycle(), interval);
      }
      async runPollingCycle() {
        if (!this.checkDocumentReadiness()) {
          this.pollTimer = setTimeout(
            () => this.runPollingCycle(),
            this.timing.pollInterval
          );
          return;
        }
        const urlChanged = await this.handleUrlChange();
        let cellInnerDivCount = this.updatePostCount(urlChanged);
        const { containerAttempted, cellInnerDivCount: updatedCount } =
          this.tryTagContainer(cellInnerDivCount);
        cellInnerDivCount = updatedCount;
        const postsProcessed =
          await this.processUnprocessedPosts(cellInnerDivCount);
        const previousPostCount = cellInnerDivCount;
        const newPostCount = this.performAutoScroll(
          cellInnerDivCount,
          previousPostCount
        );
        cellInnerDivCount = newPostCount;
        this.domService.emit(EVENTS.RECORD_POLL, {
          postsProcessed,
          wasSkipped: !this.state.isPostScanningEnabled,
          containerFound: this.xGhosted.state.containerFound,
          containerAttempted,
          pageType: this.xGhosted.state.isWithReplies
            ? 'with_replies'
            : this.xGhosted.state.userProfileName
              ? 'profile'
              : 'timeline',
          isScanningStarted: false,
          isScanningStopped: false,
          cellInnerDivCount,
        });
        this.state.lastCellInnerDivCount = cellInnerDivCount;
        this.scheduleNextCycle();
      }
      startPolling() {
        if (this.pollTimer) {
          this.log('Polling already active, updating state only');
          return;
        }
        let containerAttempted = false;
        let postsProcessed = 0;
        this.log(
          `Starting polling with interval ${this.timing.pollInterval}ms...`
        );
        this.pollTimer = setTimeout(
          () => this.runPollingCycle(),
          this.timing.pollInterval
        );
        this.initializePostScanning();
      }
    };

    // src/utils/postConnectorNameGetter.js
    function postConnectorNameGetter(connector) {
      if (!connector) return 'none';
      if (connector === postConnector.DIVIDES) return 'DIVIDES';
      if (connector === postConnector.INDEPENDENT) return 'INDEPENDENT';
      if (connector === postConnector.STARTS) return 'STARTS';
      if (connector === postConnector.CONTINUES) return 'CONTINUES';
      if (connector === postConnector.DANGLES) return 'DANGLES';
      return 'unknown';
    }

    // src/utils/postQualityNameGetter.js
    function postQualityNameGetter(quality) {
      if (!quality) return 'none';
      if (quality === postQuality.UNDEFINED) return 'UNDEFINED';
      if (quality === postQuality.DIVIDER) return 'DIVIDER';
      if (quality === postQuality.PROBLEM) return 'PROBLEM';
      if (quality === postQuality.PROBLEM_ADJACENT) return 'PROBLEM_ADJACENT';
      if (quality === postQuality.POTENTIAL_PROBLEM) return 'POTENTIAL_PROBLEM';
      if (quality === postQuality.GOOD) return 'GOOD';
      return 'unknown';
    }
    function postQualityClassNameGetter(quality) {
      return postQualityNameGetter(quality).toLowerCase().replace('_', '-');
    }

    // src/utils/postQualityReasons.js
    var postQualityReasons = Object.freeze({
      NOTICE: Object.freeze({ name: 'Found notice', value: 1 }),
      COMMUNITY: Object.freeze({ name: 'Found community', value: 2 }),
      DIVIDER: Object.freeze({
        name: 'Invisible Divider Between Post Collections',
        value: 3,
      }),
      NO_ARTICLE: Object.freeze({ name: 'No article found', value: 4 }),
      UNDEFINED: Object.freeze({ name: 'Nothing to measure', value: 5 }),
      GOOD: Object.freeze({ name: 'Looks good', value: 5 }),
    });

    // src/dom/DomService.js
    var DomService = class {
      constructor({
        document: document2,
        window: window2,
        domUtils: domUtils2,
      }) {
        this.document = document2;
        this.window = window2;
        this.domUtils = domUtils2;
      }
      getScrollY() {
        return this.domUtils.getScrollY(this.window);
      }
      getInnerHeight() {
        return this.domUtils.getInnerHeight(this.window);
      }
      scrollBy(options) {
        this.domUtils.scrollBy(options, this.window);
      }
      getScrollHeight() {
        return this.document.body.scrollHeight;
      }
      emit(eventName, data) {
        this.domUtils.dispatchEvent(
          this.document,
          new CustomEvent(eventName, { detail: data })
        );
      }
      getPostContainer() {
        return this.domUtils.querySelector(
          this.domUtils.POST_CONTAINER_SELECTOR,
          this.document
        );
      }
      getCellInnerDivCount() {
        return this.domUtils.querySelectorAll(
          this.domUtils.POSTS_IN_CONTAINER_SELECTOR,
          this.document
        ).length;
      }
      getUnprocessedPosts() {
        return this.domUtils.querySelectorAll(
          this.domUtils.UNPROCESSED_POSTS_SELECTOR,
          this.document
        );
      }
    };

    // src/dom/domUtils.js
    var domUtils = {
      querySelector(selector, doc = document) {
        return doc.querySelector(selector);
      },
      querySelectorAll(selector, doc = document) {
        return doc.querySelectorAll(selector);
      },
      createElement(tag, doc = document) {
        return doc.createElement(tag);
      },
      addEventListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
      },
      dispatchEvent(element, event) {
        element.dispatchEvent(event);
      },
      removeEventListener(element, event, handler, options = {}) {
        element.removeEventListener(event, handler, options);
      },
      closest(element, selector) {
        let current = element;
        while (current && !current.matches(selector)) {
          current = current.parentElement;
        }
        return current;
      },
      scrollBy(options, win = window) {
        win.scrollBy(options);
      },
      getScrollY(win = window) {
        return win.scrollY;
      },
      getInnerHeight(win = window) {
        return win.innerHeight;
      },
      POSTS_IN_DOC_SELECTOR: `div:not([aria-label="Timeline: Messages"]) > div > div[data-testid="cellInnerDiv"]`,
      POST_CONTAINER_SELECTOR: 'div[data-ghosted="posts-container"]',
      POSTS_IN_CONTAINER_SELECTOR: `div[data-ghosted="posts-container"] > div > div[data-testid="cellInnerDiv"]`,
      UNPROCESSED_POSTS_SELECTOR: `div[data-ghosted="posts-container"] > div > div[data-testid="cellInnerDiv"]:not([data-ghostedid])`,
    };

    // src/dom/extractUserFromLink.js
    function extractUserFromLink(link) {
      if (!link) return null;
      const match = link.match(/^\/([^/]+)/);
      return match ? match[1] : null;
    }

    // src/dom/findReplyingToWithDepth.js
    function findReplyingToWithDepth(article) {
      function getInnerHTMLWithoutAttributes(element) {
        const clone = element.cloneNode(true);
        clone.querySelectorAll('*').forEach((el) => {
          while (el.attributes.length > 0) {
            el.removeAttribute(el.attributes[0].name);
          }
        });
        return clone.innerHTML;
      }
      function findDivs(element, depth) {
        if (element.tagName === 'DIV') {
          if (element.innerHTML.startsWith('Replying to')) {
            result.push({
              depth,
              innerHTML: getInnerHTMLWithoutAttributes(element).replace(
                /<\/?(div|span)>/gi,
                ''
              ),
            });
          }
        }
        Array.from(element.children).forEach((child) =>
          findDivs(child, depth + 1)
        );
      }
      const result = [];
      findDivs(article, 0);
      return result;
    }

    // src/dom/getRelativeLinkToPost.js
    function getRelativeLinkToPost(element) {
      const link = domUtils
        .querySelector('a:has(time)', element)
        ?.getAttribute('href');
      return link || false;
    }

    // src/dom/getTweetText.js
    function getTweetText(post) {
      let visibleText = '';
      if (post.matches('div[data-testid="cellInnerDiv"]')) {
        const tweetDiv = post.querySelector('div[data-testid="tweetText"]');
        if (tweetDiv) {
          const walker = document.createTreeWalker(
            tweetDiv,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: (node2) => {
                return node2.parentNode.tagName === 'A'
                  ? NodeFilter.FILTER_REJECT
                  : NodeFilter.FILTER_ACCEPT;
              },
            },
            false
          );
          let node;
          while ((node = walker.nextNode())) {
            visibleText += node.textContent.trim() + ' ';
          }
        }
      }
      return visibleText.trim();
    }

    // src/dom/postHasProblemCommunity.js
    function postHasProblemCommunity(article) {
      const communityIds = ['1889908654133911912'];
      const aTags = Array.from(domUtils.querySelectorAll('a', article));
      for (const aTag of aTags) {
        for (const id of communityIds) {
          if (aTag.href.endsWith(`/i/communities/${id}`)) {
            return id;
          }
        }
      }
      return false;
    }

    // src/dom/postHasProblemSystemNotice.js
    function postHasProblemSystemNotice(article) {
      const targetNotices = [
        'unavailable',
        'content warning',
        'this post is unavailable',
        'this post violated the x rules',
        'this post was deleted by the post author',
        'this post is from an account that no longer exists',
        "this post may violate x's rules against hateful conduct",
        'this media has been disabled in response to a report by the copyright owner',
        "you're unable to view this post",
      ];
      function normalizedTextContent(textContent) {
        return textContent.replace(/[‘’]/g, "'").toLowerCase();
      }
      const spans = Array.from(domUtils.querySelectorAll('span', article));
      for (const span of spans) {
        const textContent = normalizedTextContent(span.textContent);
        for (const notice of targetNotices) {
          if (textContent.startsWith(notice)) {
            return notice;
          }
        }
      }
      return false;
    }

    // src/dom/isPostDivider.js
    function isPostDivider(post) {
      const children = post.children;
      if (children.length !== 1) {
        return false;
      }
      const child = children[0];
      if (child.tagName !== 'DIV') {
        return false;
      }
      return child.children.length === 0;
    }

    // src/dom/identifyPost.js
    function identifyPost(post, checkReplies = true, logger = console.log) {
      const isDivider = isPostDivider(post);
      if (isDivider) {
        return {
          quality: postQuality.DIVIDER,
          reason: postQualityReasons.DIVIDER.name,
          link: false,
        };
      }
      const article = domUtils.querySelector('article', post);
      if (!article) {
        return {
          quality: postQuality.UNDEFINED,
          reason: postQualityReasons.NO_ARTICLE.name,
          link: false,
        };
      }
      const noticeFound = postHasProblemSystemNotice(article);
      if (noticeFound) {
        return {
          quality: postQuality.PROBLEM,
          reason: `${postQualityReasons.NOTICE.name}: ${noticeFound}`,
          link: getRelativeLinkToPost(post),
        };
      }
      const communityFound = postHasProblemCommunity(article);
      if (communityFound) {
        return {
          quality: postQuality.PROBLEM,
          reason: `${postQualityReasons.COMMUNITY.name}: ${communityFound}`,
          link: getRelativeLinkToPost(post),
        };
      }
      if (checkReplies) {
        const replyingToDepths = findReplyingToWithDepth(article);
        if (Array.isArray(replyingToDepths) && replyingToDepths.length > 0) {
          const replyingTo = replyingToDepths.find(
            (object) => object.depth < 10
          );
          if (replyingTo) {
            return {
              quality: postQuality.POTENTIAL_PROBLEM,
              reason: `Found: '${replyingTo.innerHTML}' at a depth of ${replyingTo.depth}`,
              link: getRelativeLinkToPost(post),
            };
          } else {
          }
        } else {
        }
      }
      const link = getRelativeLinkToPost(post);
      if (link) {
        return {
          quality: postQuality.GOOD,
          reason: postQualityReasons.GOOD.name,
          link,
        };
      }
      return {
        quality: postQuality.UNDEFINED,
        reason: postQualityReasons.UNDEFINED.name,
        link: false,
      };
    }

    // src/dom/identifyPostConnectors.js
    var SELECTORS = {
      VERTICAL_LINE: '.r-m5arl1',
      REPLY_INDICATOR: '.r-18kxxzh.r-1wron08.r-onrtq4.r-15zivkp',
      COMMUNITY_CONTEXT: '.r-q3we1, a[href*="/i/communities/"]',
      CONTAINER: '.r-18u37iz',
      INDENTATION: '.r-15zivkp',
      REPLYING_TO: '.r-4qtqp9.r-zl2h9q',
    };
    function identifyPostConnectors(
      post,
      quality,
      containsSystemNotice = false,
      previousPostConnector = false,
      logger = console.log
    ) {
      logger(
        `identifyPostConnectors received: quality=${quality.name}, containsSystemNotice=${containsSystemNotice}, previousPostConnector=${postConnectorNameGetter(previousPostConnector)}`
      );
      logger(JSON.stringify(previousPostConnector));
      if (quality === postQuality.DIVIDER) {
        logger('Returning DIVIDES: post is a divider');
        return postConnector.DIVIDES;
      }
      if (hasVerticalLine(post)) {
        return classifyVerticalLinePost(post, quality, logger);
      }
      const hasCommunityContext =
        domUtils.querySelector(SELECTORS.COMMUNITY_CONTEXT, post) !== null;
      const hasIndent = hasIndentation(post, hasCommunityContext);
      if (containsSystemNotice) {
        return classifyPlaceholderPost(
          previousPostConnector,
          hasIndent,
          logger
        );
      }
      if (isReplyingTo(post)) {
        logger('Returning DANGLES: post is a reply');
        return postConnector.DANGLES;
      }
      logger('Returning INDEPENDENT: default case');
      return postConnector.INDEPENDENT;
    }
    function hasVerticalLine(post) {
      return domUtils.querySelector(SELECTORS.VERTICAL_LINE, post) !== null;
    }
    function hasIndentation(post, hasCommunityContext) {
      const container = domUtils.querySelector(SELECTORS.CONTAINER, post);
      return (
        container?.querySelector(SELECTORS.INDENTATION) && !hasCommunityContext
      );
    }
    function isReplyingTo(post) {
      return domUtils.querySelector(SELECTORS.REPLYING_TO, post) !== null;
    }
    function classifyVerticalLinePost(post, quality, logger) {
      const isReply =
        domUtils.querySelector(SELECTORS.REPLY_INDICATOR, post) !== null;
      if (isReply || quality === postQuality.UNDEFINED) {
        logger(
          'Returning CONTINUES: has vertical lines with reply indicator or undefined quality'
        );
        return postConnector.CONTINUES;
      }
      logger('Returning STARTS: has vertical lines without reply indicator');
      return postConnector.STARTS;
    }
    function classifyPlaceholderPost(previousPostConnector, hasIndent, logger) {
      if (
        !hasIndent &&
        (!previousPostConnector ||
          previousPostConnector === postConnector.DIVIDES)
      ) {
        logger(
          'Returning STARTS: placeholder with no indent and no/divider previous connector'
        );
        return postConnector.STARTS;
      }
      logger('Returning INDEPENDENT: placeholder default');
      return postConnector.INDEPENDENT;
    }

    // src/dom/identifyPostWithConnectors.js
    function identifyPostWithConnectors(
      post,
      checkReplies = true,
      previousPostQuality,
      previousPostConnector,
      debug,
      logger = console.log
    ) {
      const postAnalysis = identifyPost(
        post,
        checkReplies,
        debug ? logger : () => {}
      );
      const hasProblemSystemNotice = postAnalysis.reason.startsWith(
        postQualityReasons.NOTICE.name
      );
      if (debug) {
        logger(`Calling identifyPostConnectors for: ${postAnalysis.link}`);
      }
      const connector = identifyPostConnectors(
        post,
        postAnalysis.quality,
        hasProblemSystemNotice,
        previousPostConnector,
        debug ? logger : () => {}
      );
      if (
        postAnalysis.quality === postQuality.GOOD &&
        connector === postConnector.CONTINUES &&
        previousPostQuality &&
        [postQuality.PROBLEM, postQuality.PROBLEM_ADJACENT].includes(
          previousPostQuality
        )
      ) {
        if (debug) {
          logger(
            `Problem Adjacent Post Found: ${postQualityNameGetter(postAnalysis.quality)}`
          );
        }
        postAnalysis.quality = postQuality.PROBLEM_ADJACENT;
        postAnalysis.reason = 'Problem upstream in converation thread';
        if (debug) {
          logger(`New Quality: ${postQualityNameGetter(postAnalysis.quality)}`);
        }
      }
      return {
        connector,
        quality: postAnalysis.quality,
        reason: postAnalysis.reason,
        link: postAnalysis.link,
      };
    }

    // src/dom/identifyPosts.js
    function identifyPosts(
      document2,
      selector = 'div[data-testid="cellInnerDiv"]',
      checkReplies = true,
      previousPostQuality = null,
      previousPostConnector = null,
      logger = () => {}
    ) {
      const connectedPostsAnalyses = [];
      document2.querySelectorAll(selector).forEach((post) => {
        const connectedPostAnalysis = identifyPostWithConnectors(
          post,
          checkReplies,
          previousPostQuality,
          previousPostConnector,
          true,
          logger
        );
        previousPostConnector = connectedPostAnalysis.connector;
        previousPostQuality = connectedPostAnalysis.quality;
        connectedPostsAnalyses.push({
          connector: connectedPostAnalysis.connector,
          quality: connectedPostAnalysis.quality,
          reason: connectedPostAnalysis.reason,
          link: connectedPostAnalysis.link,
          text: getTweetText(post),
        });
      });
      return connectedPostsAnalyses;
    }

    // src/dom/parseUrl.js
    function parseUrl(url) {
      const reservedPaths = [
        'i',
        'notifications',
        'home',
        'explore',
        'messages',
        'compose',
        'settings',
      ];
      const regex = /^https:\/\/x\.com\/([^/]+)(?:\/(with_replies))?/;
      const match = url.match(regex);
      if (match && !reservedPaths.includes(match[1])) {
        return {
          isWithReplies: !!match[2],
          userProfileName: match[1],
        };
      }
      return {
        isWithReplies: false,
        userProfileName: null,
      };
    }

    // src/dom/tryTagPostsContainer.js
    function findFirstPost(doc, log = () => {}) {
      const post = domUtils.querySelector(domUtils.POSTS_IN_DOC_SELECTOR, doc);
      if (!post) {
        log('No posts found in document');
        return null;
      }
      log('First post found');
      return post;
    }
    function selectContainerDiv(post, log = () => {}) {
      if (!post || !(post instanceof Element)) {
        log('Invalid post element; cannot select container');
        return null;
      }
      const parent = post.parentElement;
      if (!parent || parent.tagName.toLowerCase() !== 'div') {
        log('No parent div element found for the post');
        return null;
      }
      const grandparent = parent.parentElement;
      if (parent.hasAttribute('aria-label')) {
        log('Parent div has aria-label; selecting it');
        return parent;
      }
      if (grandparent && grandparent.tagName.toLowerCase() === 'div') {
        if (grandparent.hasAttribute('aria-label')) {
          log('Grandparent div has aria-label; selecting it');
          return grandparent;
        }
        log('No aria-label found; selecting grandparent');
        return grandparent;
      }
      log('No aria-label found and no grandparent div; selecting parent');
      return parent;
    }
    function tagContainerDiv(div, log = () => {}) {
      if (!div || !(div instanceof Element)) {
        log('Invalid div element; cannot tag');
        return false;
      }
      div.setAttribute('data-ghosted', 'posts-container');
      div.classList.add('ghosted-posts-container');
      log("Div tagged with data-ghosted='posts-container'");
      if (div.hasAttribute('aria-label')) {
        const ariaLabel = div.getAttribute('aria-label');
        log(`Tagged div has aria-label: "${ariaLabel}"`);
      }
      return true;
    }
    function tryTagPostsContainer(doc, log = () => {}) {
      if (domUtils.querySelector(domUtils.POST_CONTAINER_SELECTOR, doc)) {
        log(
          `Posts container already tagged with data-ghosted='posts-container'`
        );
        return true;
      }
      const post = findFirstPost(doc, log);
      if (!post) {
        return false;
      }
      const containerDiv = selectContainerDiv(post, log);
      if (!containerDiv) {
        return false;
      }
      return tagContainerDiv(containerDiv, log);
    }
    return {
      AutoDeleteManager,
      CONFIG,
      DomService,
      EVENTS,
      EVENT_CONTRACTS,
      Logger,
      PollingManager,
      copyTextToClipboard,
      debounce,
      describeSampleAnalyses,
      domUtils,
      exportToCSV,
      extractUserFromLink,
      findFirstPost,
      findReplyingToWithDepth,
      getPostEngagement,
      getRelativeLinkToPost,
      getTweetText,
      identifyPost,
      identifyPostConnectors,
      identifyPostWithConnectors,
      identifyPosts,
      isPostDivider,
      parseUrl,
      postConnector,
      postConnectorNameGetter,
      postHasProblemCommunity,
      postHasProblemSystemNotice,
      postQuality,
      postQualityClassNameGetter,
      postQualityNameGetter,
      postQualityReasons,
      selectContainerDiv,
      summarizeConnectedPosts,
      summarizeRatedPosts,
      tagContainerDiv,
      tryTagPostsContainer,
    };
  })();

  // Safety check: Ensure Logger is defined
  if (!window.Logger || typeof window.Logger !== 'function') {
    console.error('xGhosted: Logger utility not found or not a constructor');
    return;
  }

  // Safety check: Ensure we're on X.com with a valid document
  const log = new window.Logger({ logTarget: CONFIG.logTarget }).log.bind(
    window.Logger
  );
  CONFIG.log = log;
  if (!window.location.href.startsWith('https://x.com/') || !document.body) {
    log('xGhosted: Aborting - invalid environment');
    return;
  }

  // Log startup
  log('xGhosted v0.6.2 starting - Manual mode on');

  // --- Inject Modules ---
  window.XGhosted = (function () {
    const {
      postQuality,
      debounce,
      tryTagPostsContainer,
      identifyPostWithConnectors,
      postQualityClassNameGetter,
      parseUrl,
      CONFIG,
      PollingManager,
      domUtils,
      DomService,
      AutoDeleteManager,
    } = window.XGhostedUtils;
    // src/xGhosted.js
    // src/events.ts
    var EVENTS = {
      INIT_COMPONENTS: 'xghosted:init-components',
      POST_REGISTERED: 'xghosted:post-registered',
      POST_REQUESTED: 'xghosted:post-requested',
      POST_RETRIEVED: 'xghosted:post-retrieved',
      REQUEST_POST_CHECK: 'xghosted:request-post-check',
      CLEAR_POSTS: 'xghosted:clear-posts',
      CLEAR_POSTS_UI: 'xghosted:clear-posts-ui',
      POSTS_CLEARED: 'xghosted:posts-cleared',
      POSTS_CLEARED_CONFIRMED: 'xghosted:posts-cleared-confirmed',
      REQUEST_POSTS: 'xghosted:request-posts',
      POSTS_RETRIEVED: 'xghosted:posts-retrieved',
      CSV_IMPORTED: 'xghosted:csv-imported',
      REQUEST_IMPORT_CSV: 'xghosted:request-import-csv',
      EXPORT_CSV: 'xghosted:export-csv',
      CSV_EXPORTED: 'xghosted:csv-exported',
      SET_SCANNING: 'xghosted:set-scanning',
      SCANNING_STATE_UPDATED: 'xghosted:scanning-state-updated',
      SET_AUTO_SCROLLING: 'xghosted:set-auto-scrolling',
      AUTO_SCROLLING_TOGGLED: 'xghosted:auto-scrolling-toggled',
      RATE_LIMIT_DETECTED: 'xghosted:rate-limit-detected',
      USER_PROFILE_UPDATED: 'xghosted:user-profile-updated',
      INIT: 'xghosted:init',
      STATE_UPDATED: 'xghosted:state-updated',
      OPEN_ABOUT: 'xghosted:open-about',
      TOGGLE_PANEL_VISIBILITY: 'xghosted:toggle-panel-visibility',
      COPY_LINKS: 'xghosted:copy-links',
      REQUEST_METRICS: 'xghosted:request-metrics',
      METRICS_RETRIEVED: 'xghosted:metrics-retrieved',
      EXPORT_METRICS: 'xghosted:export-metrics',
      METRICS_UPDATED: 'xghosted:metrics-updated',
      RECORD_POLL: 'xghosted:record-poll',
      RECORD_SCROLL: 'xghosted:record-scroll',
      RECORD_SCAN: 'xghosted:record-scan',
      RECORD_TAB_CHECK: 'xghosted:record-tab-check',
      SET_INITIAL_WAIT_TIME: 'xghosted:set-initial-wait-time',
      SET_POST_DENSITY: 'xghosted:set-post-density',
      SAVE_METRICS: 'xghosted:save-metrics',
      AUTO_DELETE_TOGGLE_REQUEST: 'xghosted:auto-delete-toggle-request',
      AUTO_DELETE_STATUS: 'xghosted:auto-delete-status',
    };
    var EVENT_CONTRACTS = {
      [EVENTS.INIT_COMPONENTS]: { config: 'object' },
      [EVENTS.POST_REGISTERED]: { href: 'string', data: 'object' },
      [EVENTS.POST_REQUESTED]: { href: 'string' },
      [EVENTS.POST_RETRIEVED]: { href: 'string', post: 'object|null' },
      [EVENTS.REQUEST_POST_CHECK]: { href: 'string' },
      [EVENTS.CLEAR_POSTS]: {},
      [EVENTS.CLEAR_POSTS_UI]: {},
      [EVENTS.POSTS_CLEARED]: {},
      [EVENTS.POSTS_CLEARED_CONFIRMED]: {},
      [EVENTS.REQUEST_POSTS]: {},
      [EVENTS.POSTS_RETRIEVED]: { posts: 'array' },
      [EVENTS.CSV_IMPORTED]: { importedCount: 'number' },
      [EVENTS.REQUEST_IMPORT_CSV]: { csvText: 'string' },
      [EVENTS.EXPORT_CSV]: {},
      [EVENTS.CSV_EXPORTED]: { csvData: 'string' },
      [EVENTS.SET_SCANNING]: { enabled: 'boolean' },
      [EVENTS.SCANNING_STATE_UPDATED]: { isPostScanningEnabled: 'boolean' },
      [EVENTS.SET_AUTO_SCROLLING]: { enabled: 'boolean' },
      [EVENTS.AUTO_SCROLLING_TOGGLED]: {
        userRequestedAutoScrolling: 'boolean',
      },
      [EVENTS.RATE_LIMIT_DETECTED]: { pauseDuration: 'number' },
      [EVENTS.USER_PROFILE_UPDATED]: { userProfileName: 'string|null' },
      [EVENTS.INIT]: { config: 'object' },
      [EVENTS.STATE_UPDATED]: { isRateLimited: 'boolean' },
      [EVENTS.OPEN_ABOUT]: {},
      [EVENTS.TOGGLE_PANEL_VISIBILITY]: { isPanelVisible: 'boolean' },
      [EVENTS.COPY_LINKS]: {},
      [EVENTS.REQUEST_METRICS]: {},
      [EVENTS.METRICS_RETRIEVED]: { timingHistory: 'array' },
      [EVENTS.EXPORT_METRICS]: {},
      [EVENTS.METRICS_UPDATED]: { metrics: 'object' },
      [EVENTS.RECORD_POLL]: {
        postsProcessed: 'number',
        wasSkipped: 'boolean',
        containerFound: 'boolean',
        containerAttempted: 'boolean',
        pageType: 'string',
        isScanningStarted: 'boolean',
        isScanningStopped: 'boolean',
        cellInnerDivCount: 'number',
      },
      [EVENTS.RECORD_SCROLL]: { bottomReached: 'boolean' },
      [EVENTS.RECORD_SCAN]: {
        duration: 'number',
        postsProcessed: 'number',
        wasSkipped: 'boolean',
        interval: 'number',
        isAutoScrolling: 'boolean',
      },
      [EVENTS.RECORD_TAB_CHECK]: {
        duration: 'number',
        success: 'boolean',
        rateLimited: 'boolean',
        attempts: 'number',
      },
      [EVENTS.SET_INITIAL_WAIT_TIME]: { time: 'number' },
      [EVENTS.SET_POST_DENSITY]: { count: 'number' },
      [EVENTS.SAVE_METRICS]: {},
      [EVENTS.AUTO_DELETE_TOGGLE_REQUEST]: { enabled: 'boolean' },
      [EVENTS.AUTO_DELETE_STATUS]: {
        running: 'boolean',
        deleting: 'boolean',
        deletedCount: 'number',
        username: 'string|null',
        canRun: 'boolean',
        message: 'string',
      },
    };

    // src/xGhosted.js
    var XGhosted = class {
      constructor({ document: document2, window, config = {} }) {
        this.timing = { ...CONFIG.timing, ...config.timing };
        this.document = document2;
        this.window = window;
        this.log = config.log;
        this.linkPrefix = config.linkPrefix || CONFIG.linkPrefix;
        const urlFullPath =
          document2.location.origin + document2.location.pathname;
        const { isWithReplies, userProfileName } = parseUrl(urlFullPath);
        this.state = {
          domPostContainer: null,
          lastUrlFullPath: urlFullPath,
          isWithReplies,
          isRateLimited: false,
          isHighlighting: false,
          userProfileName,
          containerFound: false,
        };
        this.checkPostInNewTabThrottled = debounce((href) => {
          return this.checkPostInNewTab(href);
        }, this.timing.tabCheckThrottle);
        this.processUnprocessedPostsDebounced = debounce((posts) => {
          this.processUnprocessedPosts(
            posts,
            this.state.isWithReplies,
            CONFIG.debug,
            this.log,
            this.emit.bind(this)
          );
        }, 500);
        this.domService = new DomService({
          document: document2,
          window,
          domUtils,
        });
        this.pollingManager = new PollingManager({
          document: this.document,
          xGhosted: this,
          timing: this.timing,
          log: this.log,
          domService: this.domService,
        });
        this.autoDeleteManager = new AutoDeleteManager({
          document: this.document,
          window: this.window,
          log: this.log,
          domUtils,
          emit: (eventName, detail) => this.emit(eventName, detail),
          getUsername: () => this.state.userProfileName,
          isWithReplies: () => this.state.isWithReplies,
        });
      }
      emit(eventName, data) {
        this.domService.emit(eventName, data);
      }
      waitForClearConfirmation() {
        return new Promise((resolve) => {
          const handler = () => {
            domUtils.removeEventListener(
              this.document,
              EVENTS.POSTS_CLEARED_CONFIRMED,
              handler
            );
            resolve();
          };
          domUtils.addEventListener(
            this.document,
            EVENTS.POSTS_CLEARED_CONFIRMED,
            handler
          );
        });
      }
      waitForPostRetrieved(href) {
        return new Promise((resolve) => {
          let resolved = false;
          const handler = (e) => {
            if (e.detail.href === href && !resolved) {
              resolved = true;
              this.log(
                `Received ${EVENTS.POST_RETRIEVED} for ${href}: post=${e.detail.post ? 'found' : 'null'}`
              );
              domUtils.removeEventListener(
                this.document,
                EVENTS.POST_RETRIEVED,
                handler
              );
              resolve(e.detail.post);
            }
          };
          domUtils.addEventListener(
            this.document,
            EVENTS.POST_RETRIEVED,
            handler
          );
          this.emit(EVENTS.POST_REQUESTED, { href });
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              this.log(
                `waitForPostRetrieved timed out for ${href}, resolving with null`
              );
              domUtils.removeEventListener(
                this.document,
                EVENTS.POST_RETRIEVED,
                handler
              );
              resolve(null);
            }
          }, 1e3);
        });
      }
      async userRequestedPostCheck(href) {
        this.log(`User requested check for ${href}`);
        this.emit(EVENTS.SET_SCANNING, { enabled: false });
        const cached = await this.waitForPostRetrieved(href);
        this.log(
          `Cached post for ${href}: quality=${cached?.analysis?.quality?.name || 'none'}, checked=${cached?.checked || false}`
        );
        if (!cached) {
          this.log(`Post not found in cache for ${href}, skipping check`);
          return;
        }
        this.log(`Manual check starting for ${href}`);
        const isProblem = await this.checkPostInNewTab(href);
        this.log(
          `Manual check result for ${href}: ${isProblem === void 0 ? 'timeout' : isProblem ? 'problem' : 'good'}`
        );
        if (isProblem === void 0) {
          this.log(
            `Check failed for ${href}: timeout, preserving POTENTIAL_PROBLEM`
          );
          return;
        }
        const currentPost = domUtils.querySelector(
          `[data-ghostedid="${href}"]`,
          this.document
        );
        if (!currentPost) {
          this.log(
            `Post with href ${href} no longer exists in the DOM, skipping DOM update`
          );
        } else {
          currentPost.classList.remove(
            'ghosted-problem-adjacent',
            'ghosted-potential-problem',
            'ghosted-good',
            'ghosted-problem'
          );
          currentPost.classList.add(
            isProblem ? 'ghosted-problem-adjacent' : 'ghosted-good'
          );
          currentPost.setAttribute(
            'data-ghosted',
            `postquality.${isProblem ? 'problem_adjacent' : 'good'}`
          );
          const eyeballContainer = domUtils.querySelector(
            '.ghosted-eyeball',
            currentPost
          );
          if (eyeballContainer) {
            eyeballContainer.classList.remove('ghosted-eyeball');
          } else {
            this.log(`Eyeball container not found for post with href: ${href}`);
          }
        }
        cached.analysis.quality = isProblem
          ? postQuality.PROBLEM_ADJACENT
          : postQuality.GOOD;
        cached.checked = true;
        this.emit(EVENTS.POST_REGISTERED, { href, data: cached });
        this.emit(EVENTS.STATE_UPDATED, { ...this.state });
        this.log(`User requested post check completed for ${href}`);
      }
      async handleUrlChange(urlFullPath) {
        if (CONFIG.debug) {
          this.log(`Handling URL change to ${urlFullPath}`);
        }
        const { isWithReplies, userProfileName } = parseUrl(urlFullPath);
        this.state.isWithReplies = isWithReplies;
        if (this.state.userProfileName !== userProfileName) {
          this.state.userProfileName = userProfileName;
          this.emit(EVENTS.USER_PROFILE_UPDATED, {
            userProfileName: this.state.userProfileName,
          });
          this.autoDeleteManager.handleContextChange();
        }
        this.emit(EVENTS.CLEAR_POSTS, {});
        await this.waitForClearConfirmation();
        this.state.containerFound = false;
        this.emit(EVENTS.POSTS_CLEARED, {});
        this.autoDeleteManager.handleContextChange();
        this.log(`URL change completed`);
      }
      async detectAndHandleUrlChange(url) {
        const { urlFullPath, oldUrlFullPath } =
          this.getUrlFullPathIfChanged(url);
        if (urlFullPath) {
          this.log(
            `URL has changed from (${oldUrlFullPath}) to (${urlFullPath})`
          );
          await this.handleUrlChange(urlFullPath);
          return true;
        }
        return false;
      }
      getUrlFullPathIfChanged(url) {
        const urlParts = new URL(url);
        const urlFullPath = urlParts.origin + urlParts.pathname;
        if (this.state.lastUrlFullPath === urlFullPath) {
          return {};
        }
        const oldUrlFullPath = this.state.lastUrlFullPath;
        this.state.lastUrlFullPath = urlFullPath;
        return { urlFullPath, oldUrlFullPath };
      }
      getPostContainer() {
        return this.domService.getPostContainer();
      }
      tryTagPostsContainer() {
        const container = tryTagPostsContainer(this.document, this.log);
        if (container) {
          this.state.containerFound = true;
          return true;
        }
        return false;
      }
      getCellInnerDivCount() {
        return this.domService.getCellInnerDivCount();
      }
      getUnprocessedPosts() {
        return this.domService.getUnprocessedPosts();
      }
      async checkPostInNewTab(href) {
        this.log(`Checking post in new tab: ${href}`);
        const fullUrl = `${this.linkPrefix}${href}`;
        this.log(`Opened new window for ${fullUrl}`);
        const newWindow = this.window.open(fullUrl, '_blank');
        let attempts = 0;
        const maxAttempts = CONFIG.checkPostMaxTries;
        const start = performance.now();
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            attempts++;
            if (newWindow && newWindow.document.readyState === 'complete') {
              const doc = newWindow.document;
              if (doc.body.textContent.includes('Rate limit exceeded')) {
                clearInterval(checkInterval);
                this.log(
                  'Rate limit detected, pausing operations for 5 minutes'
                );
                this.state.isRateLimited = true;
                this.emit(EVENTS.SET_SCANNING, { enabled: false });
                newWindow.close();
                this.emit(EVENTS.RATE_LIMIT_DETECTED, { pauseDuration: 3e5 });
                const duration = performance.now() - start;
                this.emit(EVENTS.RECORD_TAB_CHECK, {
                  duration,
                  success: false,
                  rateLimited: true,
                  attempts,
                });
                setTimeout(() => {
                  this.log('Resuming after rate limit pause');
                  this.state.isRateLimited = false;
                  resolve(false);
                }, 3e5);
                return;
              }
              const cellInnerDivCount = doc.querySelectorAll(
                '[data-testid="cellInnerDiv"]'
              ).length;
              const ghostedIdCount =
                doc.querySelectorAll('[data-ghostedid]').length;
              const validCount = Array.from(
                doc.querySelectorAll('[data-ghostedid]')
              ).filter(
                (post) =>
                  !['postquality.undefined', 'postquality.divider'].includes(
                    post.getAttribute('data-ghosted')
                  )
              ).length;
              this.log(
                `Polling for post processing, attempt ${attempts}, cellInnerDivCount: ${cellInnerDivCount}, ghostedIdCount: ${ghostedIdCount}, validCount: ${validCount}`
              );
              if (
                cellInnerDivCount === ghostedIdCount &&
                cellInnerDivCount > 0
              ) {
                clearInterval(checkInterval);
                const targetPost = domUtils.querySelector(
                  `[data-ghostedid="${href}"]`,
                  doc
                );
                if (!targetPost) {
                  this.log(`No target post found for ${href}`);
                  newWindow.close();
                  this.emit(EVENTS.RECORD_TAB_CHECK, {
                    duration: performance.now() - start,
                    success: false,
                    rateLimited: false,
                    attempts,
                  });
                  resolve(void 0);
                  return;
                }
                let hasProblem;
                if (validCount === 1) {
                  hasProblem = true;
                  this.log(
                    `Single valid post found for ${href}, assuming problem`
                  );
                } else {
                  hasProblem =
                    domUtils.querySelector(
                      '[data-ghosted="postquality.problem"]',
                      doc
                    ) !== null;
                  this.log(
                    `Multiple valid posts found for ${href}, hasProblem: ${hasProblem}`
                  );
                }
                newWindow.close();
                const duration = performance.now() - start;
                this.emit(EVENTS.RECORD_TAB_CHECK, {
                  duration,
                  success: true,
                  rateLimited: false,
                  attempts,
                });
                this.log(
                  `Post check completed for ${href}, hasProblem: ${hasProblem}, cellInnerDivCount: ${cellInnerDivCount}, ghostedIdCount: ${ghostedIdCount}, validCount: ${validCount}`
                );
                resolve(hasProblem);
                return;
              }
              if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                if (newWindow) newWindow.close();
                const duration = performance.now() - start;
                this.log(
                  `Timeout: failed to process ${href} after ${maxAttempts} attempts, cellInnerDivCount: ${cellInnerDivCount}, ghostedIdCount: ${ghostedIdCount}, validCount: ${validCount}, contentLength: ${doc.body.textContent.length}`
                );
                this.emit(EVENTS.RECORD_TAB_CHECK, {
                  duration,
                  success: false,
                  rateLimited: false,
                  attempts,
                });
                resolve(void 0);
              }
            }
          }, 500);
        });
      }
      expandArticle(article) {
        if (article) {
          article.style.height = 'auto';
          article.style.overflow = 'visible';
          article.style.margin = 'auto';
          article.style.padding = 'auto';
        }
      }
      processUnprocessedPosts(posts, checkReplies, debug, log, emit) {
        const start = performance.now();
        this.state.isHighlighting = true;
        const results = [];
        const postsToProcess = posts || this.getUnprocessedPosts();
        const processedIds = /* @__PURE__ */ new Set();
        if (debug) {
          log(
            `Processing ${postsToProcess.length} posts, checkReplies: ${checkReplies}`
          );
        }
        let previousPostQuality = null;
        let previousPostConnector = null;
        for (const post of postsToProcess) {
          const { analysis, updatedQuality, updatedConnector } =
            this.processPost(
              post,
              checkReplies,
              previousPostQuality,
              previousPostConnector,
              processedIds,
              debug,
              log,
              emit
            );
          previousPostQuality = updatedQuality;
          previousPostConnector = updatedConnector;
          results.push(analysis);
        }
        const postsProcessed = processedIds.size;
        if (postsProcessed > 0) {
          emit(EVENTS.SAVE_METRICS, {});
          emit(EVENTS.STATE_UPDATED, { ...this.state });
          log(`Highlighted ${postsProcessed} new posts, state-updated emitted`);
        }
        this.state.isHighlighting = false;
        return { results, postsProcessed };
      }
      processPost(
        post,
        checkReplies,
        previousPostQuality,
        previousPostConnector,
        processedIds,
        debug,
        log,
        emit
      ) {
        const connectedPostAnalysis = identifyPostWithConnectors(
          post,
          checkReplies,
          previousPostQuality,
          previousPostConnector,
          debug,
          log
        );
        if (!(post instanceof this.window.Element)) {
          if (debug) {
            log('Skipping invalid DOM element:', post);
          }
          return {
            analysis: connectedPostAnalysis,
            updatedQuality: connectedPostAnalysis.quality,
            updatedConnector: connectedPostAnalysis.connector,
          };
        }
        const id = connectedPostAnalysis.link;
        const qualityName = postQualityClassNameGetter(
          connectedPostAnalysis.quality
        );
        post.setAttribute('data-ghosted', `postquality.${qualityName}`);
        post.setAttribute('data-ghostedid', id && id !== 'false' ? id : '');
        post.classList.add(`ghosted-${qualityName}`);
        if (connectedPostAnalysis.quality === postQuality.PROBLEM) {
          log('Marked PROBLEM post');
        } else if (connectedPostAnalysis.quality === postQuality.DIVIDER) {
          log('Marked DIVIDER post');
        } else if (!id || id === 'false') {
          if (debug) {
            log(`Marked post with invalid href: ${id}`);
          }
        } else {
          log(
            `Highlighted post ${id}: quality=${connectedPostAnalysis.quality.name}`
          );
        }
        if (connectedPostAnalysis.quality === postQuality.POTENTIAL_PROBLEM) {
          const shareButtonContainer = domUtils.querySelector(
            'button[aria-label="Share post"]',
            post
          )?.parentElement;
          if (shareButtonContainer) {
            shareButtonContainer.classList.add('ghosted-eyeball');
          } else if (debug) {
            log(`No share button container found for post with href: ${id}`);
          }
        }
        if (id && id !== 'false' && !processedIds.has(id)) {
          processedIds.add(id);
          if (debug) {
            log(
              `Emitting POST_REGISTERED for id: ${id}, processedIds:`,
              Array.from(processedIds)
            );
          }
          emit(EVENTS.POST_REGISTERED, {
            href: id,
            data: { analysis: connectedPostAnalysis, checked: false },
          });
        } else if (debug && id && id !== 'false') {
          const snippet = post.textContent.slice(0, 50).replace(/\n/g, ' ');
          log(`Duplicate post skipped: ${id} (snippet: "${snippet}")`);
        }
        return {
          analysis: connectedPostAnalysis,
          updatedQuality: connectedPostAnalysis.quality,
          updatedConnector: connectedPostAnalysis.connector,
        };
      }
      initEventListeners() {
        domUtils.addEventListener(
          this.document,
          EVENTS.REQUEST_POST_CHECK,
          ({ detail: { href } }) => {
            this.log(`Received ${EVENTS.REQUEST_POST_CHECK} for href=${href}`);
            this.userRequestedPostCheck(href);
          }
        );
        domUtils.addEventListener(
          this.document,
          'click',
          (e) => {
            const eyeball =
              e.target.closest('.ghosted-eyeball') ||
              (e.target.classList.contains('ghosted-eyeball')
                ? e.target
                : null);
            if (eyeball) {
              e.preventDefault();
              e.stopPropagation();
              this.log('Eyeball clicked! Digging in...');
              const clickedPost = eyeball.closest('div[data-ghostedid]');
              const href = clickedPost?.getAttribute('data-ghostedid');
              if (!href) {
                this.log('No href found for clicked eyeball');
                return;
              }
              this.log(`Processing eyeball click for: ${href}`);
              if (this.state.isRateLimited) {
                this.log(`Eyeball click skipped for ${href} due to rate limit`);
                return;
              }
              this.emit(EVENTS.REQUEST_POST_CHECK, { href });
            }
          },
          { capture: true }
        );
        domUtils.addEventListener(
          this.document,
          EVENTS.AUTO_DELETE_TOGGLE_REQUEST,
          ({ detail }) => {
            const enabled = detail?.enabled ?? false;
            this.log(`Auto delete toggle requested: ${enabled}`);
            this.autoDeleteManager.handleToggle(Boolean(enabled));
          }
        );
      }
      init() {
        this.log('Initializing XGhosted...');
        const startTime = performance.now();
        this.initEventListeners();
        this.emit(EVENTS.USER_PROFILE_UPDATED, {
          userProfileName: this.state.userProfileName,
        });
        this.emit(EVENTS.INIT, {
          config: {
            pollInterval: this.timing.pollInterval,
            scrollInterval: this.timing.scrollInterval,
          },
        });
        this.emit(EVENTS.STATE_UPDATED, {
          isRateLimited: this.state.isRateLimited,
        });
        this.autoDeleteManager.handleContextChange();
        const styleSheet = domUtils.createElement('style', this.document);
        styleSheet.textContent = `
    .ghosted-good { border: 2px solid green; background: rgba(0, 255, 0, 0.15); }
    .ghosted-problem { border: 2px solid red; background: rgba(255, 0, 0, 0.15); }
    .ghosted-undefined { border: 2px solid gray; background: rgba(128, 128, 128, 0.25); }
    .ghosted-potential-problem { border: 2px solid yellow; background: rgba(255, 255, 0, 0.25); }
    .ghosted-problem-adjacent { border: 2px solid coral; background: rgba(255, 127, 80, 0.25); }
    .ghosted-collapsed { height: 0px; overflow: hidden; margin: 0; padding: 0; }
    .ghosted-eyeball::after {
      content: '\u{1F440}';
      color: rgb(29, 155, 240);
      padding: 8px;
      cursor: pointer;
      text-decoration: none;
    }
    ${CONFIG.decoratePostsContainer ? `.ghosted-posts-container { border: 4px solid #00FFFF; }` : ''}
  `;
        this.document.head.appendChild(styleSheet);
        const startPolling = () => {
          this.log('DOM ready, starting polling');
          const waitTime = performance.now() - startTime;
          this.log(`Initial wait time set: ${waitTime}ms`);
          this.emit(EVENTS.SET_INITIAL_WAIT_TIME, { time: waitTime });
          this.pollingManager.startPolling();
        };
        if (
          document.readyState === 'complete' ||
          document.readyState === 'interactive'
        ) {
          startPolling();
        } else {
          domUtils.addEventListener(
            this.document,
            'DOMContentLoaded',
            startPolling,
            { once: true }
          );
        }
      }
    };
    return XGhosted;
  })();
  window.PanelManager = (function () {
    // src/ui/Panel.jsx
    function Panel({
      state,
      config,
      currentMode,
      linkPrefix,
      toggleThemeMode,
      onCopyLinks,
      startDrag,
      onEyeballClick,
      flagged,
      totalPosts,
      isScanning,
      isScrolling,
      userProfileName,
      onToggleVisibility,
      onToggleTools,
      onToggleScanning,
      onToggleAutoScrolling,
      onExportCsv,
      onOpenModal,
      onCloseModal,
      onSubmitCsv,
      onClearPosts,
      onOpenAbout,
      onToggleDropdown,
      autoDeleteStatus,
      onToggleAutoDelete,
    }) {
      const themeOptions = ['dark', 'dim', 'light'].filter(
        (option) => option !== currentMode
      );
      const autoDelete = autoDeleteStatus || {};
      const autoDeleteButtonLabel = autoDelete.running
        ? 'Stop Auto Delete'
        : 'Start Auto Delete';
      const autoDeleteStatusLabel = autoDelete.deleting
        ? 'Deleting\u2026'
        : autoDelete.running
          ? 'Running'
          : autoDelete.canRun
            ? 'Ready'
            : 'Unavailable';
      const autoDeleteUsernameLabel = autoDelete.username
        ? `@${autoDelete.username}`
        : 'Username not detected';
      const autoDeleteCountLabel = `Deleted ${autoDelete.deletedCount || 0}`;
      const autoDeleteDisabled = !autoDelete.running && !autoDelete.canRun;
      const autoDeleteIcon = autoDelete.running
        ? 'fa-solid fa-stop'
        : 'fa-solid fa-play';
      const toolbarButtonStyle = { flex: '1 1 120px', minWidth: '100px' };
      return window.preact.h(
        'div',
        null,
        window.preact.h(
          'div',
          {
            id: 'ghosted-panel',
            style: {
              background: config.THEMES[currentMode].bg,
              border: `2px solid ${isScanning ? config.THEMES[currentMode].border : '#FFA500'}`,
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              color: config.THEMES[currentMode].text,
              fontFamily: config.PANEL.FONT,
              maxHeight: state.isPanelVisible
                ? config.PANEL.MAX_HEIGHT
                : '48px',
              minWidth: state.isPanelVisible ? '250px' : '60px',
              padding: state.isPanelVisible ? '8px 8px 12px 8px' : '4px',
              transition: 'width 0.2s ease, max-height 0.2s ease',
              width: state.isPanelVisible ? config.PANEL.WIDTH : 'auto',
            },
          },
          state.isPanelVisible
            ? window.preact.h(
                window.preact.Fragment,
                null,
                window.preact.h(
                  'div',
                  {
                    className: 'toolbar',
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                    },
                  },
                  window.preact.h(
                    'button',
                    {
                      key: state.isToolsExpanded
                        ? 'tools-expanded'
                        : 'tools-collapsed',
                      className: 'panel-button',
                      onClick: onToggleTools,
                      'aria-label': 'Toggle Tools Section',
                      style: toolbarButtonStyle,
                    },
                    window.preact.h('i', {
                      className: state.isToolsExpanded
                        ? 'fas fa-chevron-up'
                        : 'fas fa-chevron-down',
                      style: { marginRight: '12px' },
                    }),
                    'Tools'
                  ),
                  window.preact.h(
                    'button',
                    {
                      key: isScanning ? 'scanning-stop' : 'scanning-start',
                      className: `panel-button ${isScanning ? '' : 'scanning-stopped'}`,
                      onClick: onToggleScanning,
                      'aria-label': isScanning
                        ? 'Stop Scanning'
                        : 'Start Scanning',
                      style: toolbarButtonStyle,
                    },
                    window.preact.h('i', {
                      className: isScanning
                        ? 'fa-solid fa-stop'
                        : 'fa-solid fa-play',
                      style: { marginRight: '12px' },
                    }),
                    'Scan'
                  ),
                  window.preact.h(
                    'button',
                    {
                      key: isScrolling ? 'scroll-stop' : 'scroll-start',
                      className: 'panel-button',
                      onClick: onToggleAutoScrolling,
                      'aria-label': isScrolling
                        ? 'Stop Auto-Scroll'
                        : 'Start Auto-Scroll',
                      style: toolbarButtonStyle,
                    },
                    window.preact.h('i', {
                      className: isScrolling
                        ? 'fa-solid fa-stop'
                        : 'fa-solid fa-play',
                      style: { marginRight: '12px' },
                    }),
                    'Scroll'
                  ),
                  window.preact.h(
                    'button',
                    {
                      key: autoDelete.running
                        ? 'autodelete-stop'
                        : 'autodelete-start',
                      className: 'panel-button',
                      onClick: onToggleAutoDelete,
                      'aria-label': autoDeleteButtonLabel,
                      title: autoDeleteStatusLabel,
                      disabled: autoDeleteDisabled,
                      style: {
                        ...toolbarButtonStyle,
                        ...(autoDeleteDisabled
                          ? { opacity: 0.5, cursor: 'not-allowed' }
                          : {}),
                      },
                    },
                    window.preact.h('i', {
                      className: autoDeleteIcon,
                      style: { marginRight: '12px' },
                    }),
                    'Delete'
                  ),
                  window.preact.h(
                    'button',
                    {
                      className: 'panel-button',
                      onClick: onToggleVisibility,
                      'aria-label': 'Hide Panel',
                      style: toolbarButtonStyle,
                    },
                    window.preact.h('i', {
                      className: 'fas fa-eye-slash',
                      style: { marginRight: '12px' },
                    }),
                    'Hide'
                  )
                ),
                window.preact.h(
                  'div',
                  {
                    style: {
                      borderTop: `1px solid ${config.THEMES[currentMode].border}`,
                      marginTop: '8px',
                      paddingTop: '10px',
                    },
                  },
                  window.preact.h(
                    'div',
                    {
                      style: {
                        alignItems: 'center',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        rowGap: '4px',
                      },
                    },
                    window.preact.h(
                      'span',
                      { style: { fontWeight: 600 } },
                      'Auto Delete'
                    ),
                    window.preact.h(
                      'span',
                      { style: { fontSize: '12px', opacity: 0.85 } },
                      autoDeleteStatusLabel
                    )
                  ),
                  window.preact.h(
                    'div',
                    { style: { fontSize: '12px', opacity: 0.85 } },
                    autoDeleteUsernameLabel
                  ),
                  window.preact.h(
                    'div',
                    { style: { fontSize: '12px', opacity: 0.85 } },
                    autoDeleteCountLabel
                  ),
                  autoDelete.message
                    ? window.preact.h(
                        'div',
                        { style: { fontSize: '12px', opacity: 0.85 } },
                        autoDelete.message
                      )
                    : null,
                  window.preact.h(
                    'div',
                    { style: { fontSize: '12px', opacity: 0.75 } },
                    'Use the Auto Delete button above to start or stop.'
                  )
                ),
                window.preact.h(
                  'div',
                  {
                    className: 'tools-section',
                    style: {
                      background: config.THEMES[currentMode].bg,
                      borderBottom: `1px solid ${config.THEMES[currentMode].border}`,
                      borderRadius: '8px',
                      boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
                      display: state.isToolsExpanded ? 'block' : 'none',
                      marginBottom: '8px',
                      padding: '12px',
                    },
                  },
                  window.preact.h(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '15px',
                      },
                    },
                    window.preact.h(
                      'div',
                      {
                        style: {
                          borderBottom: '1px solid var(--border-color)',
                          paddingBottom: '12px',
                        },
                      },
                      window.preact.h(
                        'div',
                        { className: 'custom-dropdown' },
                        window.preact.h(
                          'button',
                          {
                            className: 'panel-button dropdown-button',
                            onClick: onToggleDropdown,
                            'aria-expanded': state.isDropdownOpen,
                            'aria-label': 'Select Theme',
                          },
                          currentMode.charAt(0).toUpperCase() +
                            currentMode.slice(1),
                          window.preact.h('i', {
                            className: state.isDropdownOpen
                              ? 'fas fa-chevron-up'
                              : 'fas fa-chevron-down',
                            style: { marginLeft: '8px' },
                          })
                        ),
                        state.isDropdownOpen &&
                          window.preact.h(
                            'div',
                            { className: 'dropdown-menu' },
                            themeOptions.map((option) =>
                              window.preact.h(
                                'div',
                                {
                                  key: option,
                                  className: 'dropdown-item',
                                  onClick: () => {
                                    toggleThemeMode(option);
                                    onToggleDropdown();
                                  },
                                  role: 'option',
                                  'aria-selected': currentMode === option,
                                },
                                option.charAt(0).toUpperCase() + option.slice(1)
                              )
                            )
                          )
                      )
                    ),
                    window.preact.h(
                      'div',
                      {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          marginBottom: '8px',
                        },
                      },
                      window.preact.h(
                        'button',
                        {
                          className: 'panel-button',
                          onClick: onCopyLinks,
                          'aria-label': 'Copy Problem Links',
                        },
                        window.preact.h('i', {
                          className: 'fas fa-copy',
                          style: { marginRight: '8px' },
                        }),
                        'Copy'
                      ),
                      window.preact.h(
                        'button',
                        {
                          className: 'panel-button',
                          onClick: onExportCsv,
                          'aria-label': 'Export Posts to CSV',
                        },
                        window.preact.h('i', {
                          className: 'fas fa-file-export',
                          style: { marginRight: '8px' },
                        }),
                        'Export CSV'
                      ),
                      window.preact.h(
                        'button',
                        {
                          className: 'panel-button',
                          onClick: onOpenModal,
                          'aria-label': 'Import Posts from CSV',
                        },
                        window.preact.h('i', {
                          className: 'fas fa-file-import',
                          style: { marginRight: '8px' },
                        }),
                        'Import CSV'
                      ),
                      window.preact.h(
                        'button',
                        {
                          className: 'panel-button',
                          onClick: onClearPosts,
                          'aria-label': 'Clear Processed Posts',
                        },
                        window.preact.h('i', {
                          className: 'fas fa-trash',
                          style: { marginRight: '8px' },
                        }),
                        'Clear'
                      ),
                      window.preact.h(
                        'button',
                        {
                          className: 'panel-button',
                          onClick: () => {
                            document.dispatchEvent(
                              new CustomEvent('xghosted:export-metrics')
                            );
                          },
                          'aria-label': 'Export Timing Metrics',
                        },
                        window.preact.h('i', {
                          className: 'fas fa-download',
                          style: { marginRight: '8px' },
                        }),
                        'Export Metrics'
                      ),
                      window.preact.h(
                        'button',
                        {
                          className: 'panel-button',
                          onClick: onOpenAbout,
                          'aria-label': 'Show About Screen',
                        },
                        window.preact.h('i', {
                          className: 'fas fa-info-circle',
                          style: { marginRight: '8px' },
                        }),
                        'About'
                      ),
                      null
                    )
                  )
                ),
                window.preact.h(
                  'div',
                  {
                    className: 'problem-posts-header',
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  },
                  window.preact.h(
                    'span',
                    { className: 'header-text-group' },
                    'Processed Posts (',
                    totalPosts,
                    ') Concerns (',
                    flagged.length,
                    '):',
                    window.preact.h(
                      'span',
                      {
                        style: {
                          cursor: 'pointer',
                          fontSize: '14px',
                          verticalAlign: 'middle',
                        },
                        onClick: onCopyLinks,
                        'aria-label': 'Copy Concerns to Clipboard',
                        title: 'Copy Concerns to Clipboard',
                      },
                      window.preact.h('i', { className: 'fas fa-copy' })
                    )
                  ),
                  window.preact.h(
                    'span',
                    {
                      className: 'drag-handle',
                      onMouseDown: startDrag,
                      'aria-label': 'Drag Panel',
                      title: 'Drag Panel',
                    },
                    window.preact.h('i', {
                      className: 'fas fa-up-down-left-right',
                    })
                  )
                ),
                window.preact.h(
                  'div',
                  { className: 'problem-links-wrapper' },
                  flagged.length > 0
                    ? flagged.map(([href, { analysis }]) =>
                        window.preact.h(
                          'div',
                          { className: 'link-row', key: href },
                          analysis.quality.name === 'Potential Problem'
                            ? window.preact.h(
                                'span',
                                {
                                  className: 'status-eyeball',
                                  onClick: () =>
                                    onEyeballClick && onEyeballClick(href),
                                  'aria-label': 'Check post details',
                                },
                                '\u{1F440}'
                              )
                            : window.preact.h('span', {
                                className: `status-dot ${analysis.quality.name === 'Problem' ? 'status-problem' : 'status-problem-adjacent'}`,
                                'aria-label':
                                  analysis.quality.name === 'Problem'
                                    ? 'Problem post'
                                    : 'Problem adjacent post',
                              }),
                          window.preact.h(
                            'span',
                            { className: 'link-item' },
                            window.preact.h(
                              'a',
                              {
                                href: `${linkPrefix}${href}`,
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                'aria-label': `Open post ${href} in new tab`,
                              },
                              href
                            )
                          )
                        )
                      )
                    : window.preact.h(
                        'span',
                        { className: 'status-label' },
                        'No concerns found.'
                      )
                )
              )
            : window.preact.h(
                'div',
                {
                  style: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '0',
                    margin: '0',
                  },
                },
                window.preact.h(
                  'button',
                  {
                    className: 'panel-button',
                    onClick: onToggleVisibility,
                    'aria-label': 'Show Panel',
                  },
                  window.preact.h('i', {
                    className: 'fas fa-eye',
                    style: { marginRight: '6px' },
                  }),
                  'Show'
                )
              )
        ),
        state.isModalOpen &&
          window.preact.h(window.Modal, {
            isOpen: state.isModalOpen,
            onClose: onCloseModal,
            onSubmit: onSubmitCsv,
            mode: currentMode,
            config,
          })
      );
    }
    window.Panel = Panel;

    // src/ui/Modal.jsx
    function Modal({ isOpen, onClose, onSubmit, mode, config }) {
      const [csvText, setCsvText] = window.preactHooks.useState('');
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.name.endsWith('.csv')) {
          alert('Please select a CSV file.');
          e.target.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          setCsvText(text);
        };
        reader.onerror = () => {
          alert('Error reading the file.');
          e.target.value = '';
        };
        reader.readAsText(file);
      };
      return window.preact.h(
        'div',
        null,
        window.preact.h(
          'div',
          {
            className: 'modal',
            style: {
              display: isOpen ? 'block' : 'none',
              '--modal-bg': config.THEMES[mode].bg,
              '--modal-text': config.THEMES[mode].text,
              '--modal-button-bg': config.THEMES[mode].button,
              '--modal-button-text': config.THEMES[mode].buttonText,
              '--modal-hover-bg': config.THEMES[mode].hover,
              '--modal-border': config.THEMES[mode].border,
            },
          },
          window.preact.h(
            'div',
            { className: 'modal-file-input-container' },
            window.preact.h('input', {
              type: 'file',
              className: 'modal-file-input',
              accept: '.csv',
              onChange: handleFileChange,
              'aria-label': 'Select CSV file to import',
            })
          ),
          window.preact.h('textarea', {
            className: 'modal-textarea',
            value: csvText,
            onInput: (e) => setCsvText(e.target.value),
            placeholder:
              'Paste CSV content (e.g. Link Quality Reason Checked) or select a file above',
            'aria-label': 'CSV content input',
          }),
          window.preact.h(
            'div',
            { className: 'modal-button-container' },
            window.preact.h(
              'button',
              {
                className: 'modal-button',
                onClick: () => onSubmit(csvText),
                'aria-label': 'Submit CSV content',
              },
              window.preact.h('i', {
                className: 'fas fa-check',
                style: { marginRight: '6px' },
              }),
              'Submit'
            ),
            window.preact.h(
              'button',
              {
                className: 'modal-button',
                onClick: () => {
                  setCsvText('');
                  onClose();
                },
                'aria-label': 'Close modal and clear input',
              },
              window.preact.h('i', {
                className: 'fas fa-times',
                style: { marginRight: '6px' },
              }),
              'Close'
            )
          )
        )
      );
    }
    window.Modal = Modal;

    // src/ui/SplashPanel.jsx
    function SplashPanel({
      version,
      userProfileName,
      pollInterval,
      scrollInterval,
      onClose,
      onDragStart,
      mode,
      config,
      isDragging,
      currentTop,
      currentLeft,
    }) {
      return window.preact.h(
        'div',
        {
          id: 'ghosted-splash',
          className: 'splash-panel',
          onMouseDown: onDragStart,
          style: {
            position: 'fixed',
            top: currentTop != null ? `${currentTop}px` : '50%',
            left: currentLeft != null ? `${currentLeft}px` : '50%',
            transform:
              currentTop != null && currentLeft != null
                ? 'none'
                : 'translate(-50%, -50%)',
            background: config.THEMES[mode].bg,
            color: config.THEMES[mode].text,
            border: `2px solid ${config.THEMES[mode].border}`,
            borderRadius: '12px',
            padding: '20px',
            zIndex: 10001,
            fontFamily: config.PANEL.FONT,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            cursor: 'move',
            transition: isDragging ? 'none' : 'top 0.1s ease, left 0.1s ease',
          },
        },
        window.preact.h(
          'h2',
          {
            style: {
              margin: '0 0 10px 0',
              fontSize: '24px',
              display: 'block',
            },
          },
          'xGhosted: \u{1D54F} Post Analyzer!'
        ),
        window.preact.h(
          'p',
          {
            style: {
              margin: '5px 0',
              fontSize: '16px',
              display: 'block',
            },
          },
          `Tampermonkey Version: ${version}`
        ),
        userProfileName &&
          window.preact.h(
            'p',
            {
              style: {
                margin: '5px 0',
                fontSize: '16px',
                display: 'block',
              },
            },
            `Profile: ${userProfileName}`
          ),
        window.preact.h(
          'p',
          {
            style: {
              margin: '5px 0',
              fontSize: '16px',
              display: 'block',
            },
          },
          `Poll Interval: ${pollInterval} ms`
        ),
        window.preact.h(
          'p',
          {
            style: {
              margin: '5px 0',
              fontSize: '16px',
              display: 'block',
            },
          },
          `Scroll Interval: ${scrollInterval} ms`
        ),
        window.preact.h(
          'button',
          {
            onClick: onClose,
            style: {
              padding: '8px 16px',
              background: config.THEMES[mode].button,
              color: config.THEMES[mode].buttonText,
              border: `2px solid ${config.THEMES[mode].border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'inline-block',
            },
            'aria-label': 'Close splash screen',
          },
          'Close'
        )
      );
    }
    window.SplashPanel = SplashPanel;

    // src/config.js
    var CONFIG = {
      timing: {
        debounceDelay: 500,
        throttleDelay: 1e3,
        tabCheckThrottle: 5e3,
        exportThrottle: 5e3,
        rateLimitPause: 20 * 1e3,
        pollInterval: 500,
        scrollInterval: 1500,
        isPostScanningEnabledOnStartup: false,
        // We'll send an event to change to true on the first heartbeat poll
        userRequestedAutoScrollOnStartup: false,
        checkPostMaxTries: 30,
      },
      showSplash: true,
      logTarget: 'tampermonkey',
      persistProcessedPosts: false,
      linkPrefix: 'https://x.com',
      debug: false,
      smoothScrolling: true,
      scrollPercentage: 1.5,
      decoratePostsContainer: false,
    };

    // src/events.ts
    var EVENTS = {
      INIT_COMPONENTS: 'xghosted:init-components',
      POST_REGISTERED: 'xghosted:post-registered',
      POST_REQUESTED: 'xghosted:post-requested',
      POST_RETRIEVED: 'xghosted:post-retrieved',
      REQUEST_POST_CHECK: 'xghosted:request-post-check',
      CLEAR_POSTS: 'xghosted:clear-posts',
      CLEAR_POSTS_UI: 'xghosted:clear-posts-ui',
      POSTS_CLEARED: 'xghosted:posts-cleared',
      POSTS_CLEARED_CONFIRMED: 'xghosted:posts-cleared-confirmed',
      REQUEST_POSTS: 'xghosted:request-posts',
      POSTS_RETRIEVED: 'xghosted:posts-retrieved',
      CSV_IMPORTED: 'xghosted:csv-imported',
      REQUEST_IMPORT_CSV: 'xghosted:request-import-csv',
      EXPORT_CSV: 'xghosted:export-csv',
      CSV_EXPORTED: 'xghosted:csv-exported',
      SET_SCANNING: 'xghosted:set-scanning',
      SCANNING_STATE_UPDATED: 'xghosted:scanning-state-updated',
      SET_AUTO_SCROLLING: 'xghosted:set-auto-scrolling',
      AUTO_SCROLLING_TOGGLED: 'xghosted:auto-scrolling-toggled',
      RATE_LIMIT_DETECTED: 'xghosted:rate-limit-detected',
      USER_PROFILE_UPDATED: 'xghosted:user-profile-updated',
      INIT: 'xghosted:init',
      STATE_UPDATED: 'xghosted:state-updated',
      OPEN_ABOUT: 'xghosted:open-about',
      TOGGLE_PANEL_VISIBILITY: 'xghosted:toggle-panel-visibility',
      COPY_LINKS: 'xghosted:copy-links',
      REQUEST_METRICS: 'xghosted:request-metrics',
      METRICS_RETRIEVED: 'xghosted:metrics-retrieved',
      EXPORT_METRICS: 'xghosted:export-metrics',
      METRICS_UPDATED: 'xghosted:metrics-updated',
      RECORD_POLL: 'xghosted:record-poll',
      RECORD_SCROLL: 'xghosted:record-scroll',
      RECORD_SCAN: 'xghosted:record-scan',
      RECORD_TAB_CHECK: 'xghosted:record-tab-check',
      SET_INITIAL_WAIT_TIME: 'xghosted:set-initial-wait-time',
      SET_POST_DENSITY: 'xghosted:set-post-density',
      SAVE_METRICS: 'xghosted:save-metrics',
      AUTO_DELETE_TOGGLE_REQUEST: 'xghosted:auto-delete-toggle-request',
      AUTO_DELETE_STATUS: 'xghosted:auto-delete-status',
    };
    var EVENT_CONTRACTS = {
      [EVENTS.INIT_COMPONENTS]: { config: 'object' },
      [EVENTS.POST_REGISTERED]: { href: 'string', data: 'object' },
      [EVENTS.POST_REQUESTED]: { href: 'string' },
      [EVENTS.POST_RETRIEVED]: { href: 'string', post: 'object|null' },
      [EVENTS.REQUEST_POST_CHECK]: { href: 'string' },
      [EVENTS.CLEAR_POSTS]: {},
      [EVENTS.CLEAR_POSTS_UI]: {},
      [EVENTS.POSTS_CLEARED]: {},
      [EVENTS.POSTS_CLEARED_CONFIRMED]: {},
      [EVENTS.REQUEST_POSTS]: {},
      [EVENTS.POSTS_RETRIEVED]: { posts: 'array' },
      [EVENTS.CSV_IMPORTED]: { importedCount: 'number' },
      [EVENTS.REQUEST_IMPORT_CSV]: { csvText: 'string' },
      [EVENTS.EXPORT_CSV]: {},
      [EVENTS.CSV_EXPORTED]: { csvData: 'string' },
      [EVENTS.SET_SCANNING]: { enabled: 'boolean' },
      [EVENTS.SCANNING_STATE_UPDATED]: { isPostScanningEnabled: 'boolean' },
      [EVENTS.SET_AUTO_SCROLLING]: { enabled: 'boolean' },
      [EVENTS.AUTO_SCROLLING_TOGGLED]: {
        userRequestedAutoScrolling: 'boolean',
      },
      [EVENTS.RATE_LIMIT_DETECTED]: { pauseDuration: 'number' },
      [EVENTS.USER_PROFILE_UPDATED]: { userProfileName: 'string|null' },
      [EVENTS.INIT]: { config: 'object' },
      [EVENTS.STATE_UPDATED]: { isRateLimited: 'boolean' },
      [EVENTS.OPEN_ABOUT]: {},
      [EVENTS.TOGGLE_PANEL_VISIBILITY]: { isPanelVisible: 'boolean' },
      [EVENTS.COPY_LINKS]: {},
      [EVENTS.REQUEST_METRICS]: {},
      [EVENTS.METRICS_RETRIEVED]: { timingHistory: 'array' },
      [EVENTS.EXPORT_METRICS]: {},
      [EVENTS.METRICS_UPDATED]: { metrics: 'object' },
      [EVENTS.RECORD_POLL]: {
        postsProcessed: 'number',
        wasSkipped: 'boolean',
        containerFound: 'boolean',
        containerAttempted: 'boolean',
        pageType: 'string',
        isScanningStarted: 'boolean',
        isScanningStopped: 'boolean',
        cellInnerDivCount: 'number',
      },
      [EVENTS.RECORD_SCROLL]: { bottomReached: 'boolean' },
      [EVENTS.RECORD_SCAN]: {
        duration: 'number',
        postsProcessed: 'number',
        wasSkipped: 'boolean',
        interval: 'number',
        isAutoScrolling: 'boolean',
      },
      [EVENTS.RECORD_TAB_CHECK]: {
        duration: 'number',
        success: 'boolean',
        rateLimited: 'boolean',
        attempts: 'number',
      },
      [EVENTS.SET_INITIAL_WAIT_TIME]: { time: 'number' },
      [EVENTS.SET_POST_DENSITY]: { count: 'number' },
      [EVENTS.SAVE_METRICS]: {},
      [EVENTS.AUTO_DELETE_TOGGLE_REQUEST]: { enabled: 'boolean' },
      [EVENTS.AUTO_DELETE_STATUS]: {
        running: 'boolean',
        deleting: 'boolean',
        deletedCount: 'number',
        username: 'string|null',
        canRun: 'boolean',
        message: 'string',
      },
    };

    // src/ui/PanelManager.js
    window.PanelManager = function (
      doc,
      version = 'unknown',
      themeMode = 'light',
      linkPrefix,
      storage,
      log
    ) {
      this.document = doc;
      this.linkPrefix = linkPrefix || CONFIG.linkPrefix;
      this.storage = storage || { get: () => {}, set: () => {} };
      this.log = log;
      const validThemes = ['light', 'dim', 'dark'];
      this.state = {
        version,
        panelPosition: { right: '10px', top: '60px' },
        isPanelVisible: true,
        isRateLimited: false,
        isManualCheckEnabled: false,
        isPostScanningEnabled: CONFIG.timing.isPostScanningEnabledOnStartup,
        userRequestedAutoScrolling:
          CONFIG.timing.userRequestedAutoScrollOnStartup,
        themeMode: validThemes.includes(themeMode) ? themeMode : 'light',
        hasSeenSplash: false,
        isSplashOpen: false,
        userProfileName: null,
        pollInterval: 'Unknown',
        scrollInterval: 'Unknown',
        flagged: [],
        totalPosts: 0,
        isToolsExpanded: false,
        isModalOpen: false,
        isDropdownOpen: false,
        pendingImportCount: null,
        isSplashDragging: false,
        splashPosition: { top: null, left: null },
        autoDeleteStatus: {
          running: false,
          deleting: false,
          deletedCount: 0,
          username: null,
          canRun: false,
          message: 'Open your /with_replies page to enable auto delete.',
        },
      };
      this.log(
        `PanelManager initialized with themeMode: ${this.state.themeMode}`
      );
      this.uiElements = {
        config: {
          PANEL: {
            WIDTH: '400px',
            MAX_HEIGHT: 'calc(100vh - 70px)',
            TOP: '60px',
            RIGHT: '10px',
            Z_INDEX: '9999',
            FONT: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          },
          THEMES: {
            light: {
              bg: '#FFFFFF',
              text: '#292F33',
              buttonText: '#000000',
              border: '#B0BEC5',
              button: '#3A4A5B',
              hover: '#90A4AE',
              scroll: '#CCD6DD',
              placeholder: '#666666',
              problem: 'red',
              potentialProblem: 'yellow',
              eyeballColor: 'rgb(29, 155, 240)',
            },
            dim: {
              bg: '#15202B',
              text: '#D9D9D9',
              buttonText: '#FFFFFF',
              border: '#8292A2',
              button: '#3A4A5B',
              hover: '#8292A2',
              scroll: '#4A5C6D',
              placeholder: '#A0A0A0',
              problem: 'red',
              potentialProblem: 'yellow',
              eyeballColor: 'rgb(29, 155, 240)',
            },
            dark: {
              bg: '#000000',
              text: '#D9D9D9',
              buttonText: '#FFFFFF',
              border: '#888888',
              button: '#3A4A5B',
              hover: '#888888',
              scroll: '#666666',
              placeholder: '#A0A0A0',
              problem: 'red',
              potentialProblem: 'yellow',
              eyeballColor: 'rgb(29, 155, 240)',
            },
          },
        },
        panel: null,
        panelContainer: null,
        splashContainer: null,
      };
      this.styleElement = null;
      this.dragState = {
        isDragging: false,
        startX: 0,
        startY: 0,
        initialRight: 0,
        initialTop: 0,
      };
      this.init();
    };
    window.PanelManager.prototype.init = function () {
      this.loadState();
      this.uiElements.panelContainer = this.document.createElement('div');
      this.uiElements.panelContainer.id = 'ghosted-panel-container';
      this.uiElements.panel = this.document.createElement('div');
      this.uiElements.panel.id = 'ghosted-panel';
      this.uiElements.panelContainer.appendChild(this.uiElements.panel);
      this.uiElements.splashContainer = this.document.createElement('div');
      this.uiElements.splashContainer.id = 'ghosted-splash-container';
      this.uiElements.splashContainer.style.zIndex = '10001';
      this.uiElements.splashContainer.style.width = '400px';
      this.uiElements.splashContainer.style.height = '200px';
      this.document.body.appendChild(this.uiElements.panelContainer);
      this.document.body.appendChild(this.uiElements.splashContainer);
      if (window.xGhostedStyles) {
        if (window.xGhostedStyles.modal) {
          const modalStyleSheet = this.document.createElement('style');
          modalStyleSheet.textContent = window.xGhostedStyles.modal;
          this.document.head.appendChild(modalStyleSheet);
          this.log('Loaded xGhostedStyles.modal:', window.xGhostedStyles.modal);
        }
        if (window.xGhostedStyles.panel) {
          const panelStyleSheet = this.document.createElement('style');
          panelStyleSheet.textContent = window.xGhostedStyles.panel;
          this.document.head.appendChild(panelStyleSheet);
          this.log('Loaded xGhostedStyles.panel:', window.xGhostedStyles.panel);
        }
        if (window.xGhostedStyles.splash) {
          const splashStyleSheet = this.document.createElement('style');
          splashStyleSheet.textContent = window.xGhostedStyles.splash;
          this.document.head.appendChild(splashStyleSheet);
          this.log(
            'Loaded xGhostedStyles.splash:',
            window.xGhostedStyles.splash
          );
        }
      }
      if (!this.state.hasSeenSplash) {
        this.showSplashPage();
        this.state.hasSeenSplash = true;
        this.saveState();
      }
      this.uiElements.panelContainer.style.right =
        this.state.panelPosition.right;
      this.uiElements.panelContainer.style.top = this.state.panelPosition.top;
      this.uiElements.panelContainer.style.left = 'auto';
      this.styleElement = this.document.createElement('style');
      this.document.head.appendChild(this.styleElement);
      this.applyPanelStyles();
      const handleStateUpdated = (e) => {
        this.state.isRateLimited = e.detail.isRateLimited;
        this.renderPanelDebounced();
      };
      const handleScanningStateUpdated = (e) => {
        this.state.isPostScanningEnabled = e.detail.isPostScanningEnabled;
        this.applyPanelStyles();
        this.renderPanel();
      };
      const handleAutoScrollingToggled = (e) => {
        this.state.userRequestedAutoScrolling =
          e.detail.userRequestedAutoScrolling;
        this.renderPanel();
      };
      const handleInit = (e) => {
        const config = e.detail?.config || {};
        this.state.pollInterval = config.pollInterval || 'Unknown';
        this.state.scrollInterval = config.scrollInterval || 'Unknown';
        this.log('Received xghosted:init with config:', config);
        this.renderPanelDebounced();
      };
      const handleUserProfileUpdated = (e) => {
        const { userProfileName } = e.detail || {};
        this.state.userProfileName = userProfileName;
        this.log(
          'Received xghosted:user-profile-updated with userProfileName:',
          userProfileName
        );
        this.renderPanelDebounced();
      };
      const handleToggleVisibility = (e) => {
        const { isPanelVisible } = e.detail;
        this.setVisibility(isPanelVisible);
        this.renderPanel();
      };
      const handleOpenAbout = () => {
        this.showSplashPage();
        this.renderPanel();
      };
      const handlePostRegistered = (e) => {
        const { href, data } = e.detail || {};
        if (href && data?.analysis?.quality?.name) {
          const qualityName = data.analysis.quality.name;
          if (
            ['Problem', 'Potential Problem', 'Problem by Association'].includes(
              qualityName
            )
          ) {
            this.state.flagged = [
              ...this.state.flagged.filter(
                ([existingHref]) => existingHref !== href
              ),
              [href, data],
            ];
          } else {
            this.state.flagged = this.state.flagged.filter(
              ([existingHref]) => existingHref !== href
            );
          }
          this.state.totalPosts += 1;
          if (
            ['Problem', 'Potential Problem', 'Problem by Association'].includes(
              qualityName
            )
          ) {
            this.renderPanelDebounced();
          }
        }
      };
      const handlePostRegisteredConfirmed = (e) => {
        const { href, data } = e.detail || {};
        if (href && data?.analysis?.quality?.name) {
          this.log(
            'PanelManager: Processing xghosted:post-registered-confirmed for:',
            href
          );
          this.renderPanelDebounced();
        }
      };
      const handlePostsCleared = () => {
        this.log('PanelManager: Handling xghosted:posts-cleared');
        this.state.flagged = [];
        this.state.totalPosts = 0;
        this.renderPanel();
      };
      const handleCsvImported = (e) => {
        const { importedCount } = e.detail || {};
        this.log(
          `PanelManager: CSV import completed with ${importedCount} posts`
        );
        if (importedCount > 0) {
          this.log('PanelManager: CSV imported, requesting posts');
          this.state.flagged = [];
          this.state.totalPosts = 0;
          this.state.pendingImportCount = importedCount;
          this.document.dispatchEvent(new CustomEvent(EVENTS.REQUEST_POSTS));
          this.renderPanel();
        } else {
          alert(
            'No posts were imported. Please check the CSV format and try again.'
          );
        }
      };
      const handlePostsRetrieved = (e) => {
        const { posts } = e.detail || {};
        this.log(
          'PanelManager: Received xghosted:posts-retrieved with posts:',
          posts
        );
        if (this.pendingCopyLinks) {
          this.copyLinks(posts);
          this.pendingCopyLinks = false;
        }
        if (this.pendingExportCsv) {
          this.handleCsvExported({ detail: { csvData: posts } });
          this.pendingExportCsv = false;
        }
        if (posts) {
          posts.forEach(([href, data]) => {
            const isProblem = [
              'Problem',
              'Problem by Association',
              'Potential Problem',
            ].includes(data.analysis.quality.name);
            if (isProblem) {
              this.state.flagged.push([href, data]);
            }
            this.state.totalPosts += 1;
          });
          this.log(
            `PanelManager: Processed posts, flagged=${this.state.flagged.length}, total=${this.state.totalPosts}`
          );
          this.renderPanelDebounced();
          if (this.state.pendingImportCount) {
            alert(
              `Successfully imported ${this.state.pendingImportCount} posts!`
            );
            this.state.pendingImportCount = null;
            this.saveState();
          }
        }
      };
      const handleExportMetrics = () => {
        this.log('PanelManager: Export metrics requested');
        this.document.dispatchEvent(new CustomEvent(EVENTS.REQUEST_METRICS));
        this.renderPanel();
      };
      const handleMetricsRetrieved = ({ detail: { timingHistory } }) => {
        this.log(
          'PanelManager: Received xghosted:metrics-retrieved with entries:',
          timingHistory.length
        );
      };
      const handleCsvExported = ({ detail: { csvData } }) => {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = this.document.createElement('a');
        a.href = url;
        a.download = 'processed_posts.csv';
        a.click();
        URL.revokeObjectURL(url);
        this.log(`Exported CSV: processed_posts.csv`);
      };
      const handleAutoDeleteStatus = (e) => {
        const detail = e.detail || {};
        this.state.autoDeleteStatus = {
          running: Boolean(detail.running),
          deleting: Boolean(detail.deleting),
          deletedCount: detail.deletedCount ?? 0,
          username: detail.username || null,
          canRun: Boolean(detail.canRun),
          message: detail.message || '',
        };
        this.renderPanelDebounced();
      };
      this.document.addEventListener(
        EVENTS.INIT_COMPONENTS,
        ({ detail: { config } }) => {
          this.linkPrefix = config.linkPrefix || this.linkPrefix;
          this.log('PanelManager initialized with config:', config);
        }
      );
      this.document.addEventListener(EVENTS.STATE_UPDATED, handleStateUpdated);
      this.document.addEventListener(
        EVENTS.SCANNING_STATE_UPDATED,
        handleScanningStateUpdated
      );
      this.document.addEventListener(
        EVENTS.AUTO_SCROLLING_TOGGLED,
        handleAutoScrollingToggled
      );
      this.document.addEventListener(EVENTS.INIT, handleInit);
      this.document.addEventListener(
        EVENTS.USER_PROFILE_UPDATED,
        handleUserProfileUpdated
      );
      this.document.addEventListener(
        EVENTS.TOGGLE_PANEL_VISIBILITY,
        handleToggleVisibility
      );
      this.document.addEventListener(EVENTS.OPEN_ABOUT, handleOpenAbout);
      this.document.addEventListener(
        EVENTS.POST_REGISTERED,
        handlePostRegistered
      );
      this.document.addEventListener(
        EVENTS.POST_REGISTERED_CONFIRMED,
        handlePostRegisteredConfirmed
      );
      this.document.addEventListener(EVENTS.POSTS_CLEARED, handlePostsCleared);
      this.document.addEventListener(EVENTS.CSV_IMPORTED, handleCsvImported);
      this.document.addEventListener(
        EVENTS.POSTS_RETRIEVED,
        handlePostsRetrieved
      );
      this.document.addEventListener(
        EVENTS.EXPORT_METRICS,
        handleExportMetrics
      );
      this.document.addEventListener(
        EVENTS.METRICS_RETRIEVED,
        handleMetricsRetrieved
      );
      this.document.addEventListener(EVENTS.CSV_EXPORTED, handleCsvExported);
      this.document.addEventListener(
        EVENTS.AUTO_DELETE_STATUS,
        handleAutoDeleteStatus
      );
      this.cleanup = () => {
        this.document.removeEventListener(
          EVENTS.STATE_UPDATED,
          handleStateUpdated
        );
        this.document.removeEventListener(
          EVENTS.SCANNING_STATE_UPDATED,
          handleScanningStateUpdated
        );
        this.document.removeEventListener(
          EVENTS.AUTO_SCROLLING_TOGGLED,
          handleAutoScrollingToggled
        );
        this.document.removeEventListener(EVENTS.INIT, handleInit);
        this.document.removeEventListener(
          EVENTS.USER_PROFILE_UPDATED,
          handleUserProfileUpdated
        );
        this.document.removeEventListener(
          EVENTS.TOGGLE_PANEL_VISIBILITY,
          handleToggleVisibility
        );
        this.document.removeEventListener(EVENTS.OPEN_ABOUT, handleOpenAbout);
        this.document.removeEventListener(
          EVENTS.POST_REGISTERED,
          handlePostRegistered
        );
        this.document.removeEventListener(
          EVENTS.POST_REGISTERED_CONFIRMED,
          handlePostRegisteredConfirmed
        );
        this.document.removeEventListener(
          EVENTS.POSTS_CLEARED,
          handlePostsCleared
        );
        this.document.removeEventListener(
          EVENTS.CSV_IMPORTED,
          handleCsvImported
        );
        this.document.removeEventListener(
          EVENTS.POSTS_RETRIEVED,
          handlePostsRetrieved
        );
        this.document.removeEventListener(
          EVENTS.EXPORT_METRICS,
          handleExportMetrics
        );
        this.document.removeEventListener(
          EVENTS.METRICS_RETRIEVED,
          handleMetricsRetrieved
        );
        this.document.removeEventListener(
          EVENTS.CSV_EXPORTED,
          handleCsvExported
        );
        this.document.removeEventListener(
          EVENTS.AUTO_DELETE_STATUS,
          handleAutoDeleteStatus
        );
      };
      this.renderPanelDebounced = this.debounce(() => this.renderPanel(), 500);
      if (window.preact && window.preact.h) {
        this.renderPanel();
      } else {
        this.log('Preact h not available, skipping panel render');
      }
    };
    window.PanelManager.prototype.debounce = function (func, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    };
    window.PanelManager.prototype.saveState = function () {
      const updatedState = {
        panel: {
          isPanelVisible: this.state.isPanelVisible,
          panelPosition: { ...this.state.panelPosition },
          themeMode: this.state.themeMode,
          hasSeenSplash: this.state.hasSeenSplash,
          isToolsExpanded: this.state.isToolsExpanded,
          isModalOpen: this.state.isModalOpen,
          isDropdownOpen: this.state.isDropdownOpen,
          isSplashOpen: this.state.isSplashOpen,
          pendingImportCount: this.state.pendingImportCount,
          isSplashDragging: this.state.isSplashDragging,
          splashPosition: { ...this.state.splashPosition },
        },
      };
      this.log('Saving state with isPanelVisible:', this.state.isPanelVisible);
      this.storage.set('xGhostedState', updatedState);
    };
    window.PanelManager.prototype.loadState = function () {
      const savedState = this.storage.get('xGhostedState', {});
      this.log('Loaded state from storage:', savedState);
      const panelState = savedState.panel || {};
      this.state.isPanelVisible = panelState.isPanelVisible ?? true;
      this.state.themeMode = ['light', 'dim', 'dark'].includes(
        panelState.themeMode
      )
        ? panelState.themeMode
        : this.state.themeMode;
      this.state.hasSeenSplash = panelState.hasSeenSplash ?? false;
      this.state.isToolsExpanded = panelState.isToolsExpanded ?? false;
      this.state.isModalOpen = panelState.isModalOpen ?? false;
      this.state.isDropdownOpen = panelState.isDropdownOpen ?? false;
      this.state.pendingImportCount = panelState.pendingImportCount ?? null;
      this.state.isSplashDragging = panelState.isSplashDragging ?? false;
      this.state.splashPosition = panelState.splashPosition ?? {
        top: null,
        left: null,
      };
      if (
        panelState.panelPosition &&
        panelState.panelPosition.right &&
        panelState.panelPosition.top
      ) {
        const panelWidth = 350;
        const panelHeight = 48;
        const windowWidth = this.document.defaultView.innerWidth;
        const windowHeight = this.document.defaultView.innerHeight;
        let right = '10px';
        if (
          typeof panelState.panelPosition.right === 'string' &&
          panelState.panelPosition.right.endsWith('px')
        ) {
          const parsedRight = parseFloat(panelState.panelPosition.right);
          if (!isNaN(parsedRight)) {
            right = `${Math.max(0, Math.min(parsedRight, windowWidth - panelWidth))}px`;
          } else {
            this.log(
              `Invalid stored right position: ${panelState.panelPosition.right}, defaulting to 10px`
            );
          }
        } else {
          this.log(
            `Invalid or missing stored right position: ${panelState.panelPosition.right}, defaulting to 10px`
          );
        }
        let top = '60px';
        if (
          typeof panelState.panelPosition.top === 'string' &&
          panelState.panelPosition.top.endsWith('px')
        ) {
          const parsedTop = parseFloat(panelState.panelPosition.top);
          if (!isNaN(parsedTop)) {
            top = `${Math.max(0, Math.min(parsedTop, windowHeight - panelHeight))}px`;
          } else {
            this.log(
              `Invalid stored top position: ${panelState.panelPosition.top}, defaulting to 60px`
            );
          }
        } else {
          this.log(
            `Invalid or missing stored top position: ${panelState.panelPosition.top}, defaulting to 60px`
          );
        }
        this.state.panelPosition.right = right;
        this.state.panelPosition.top = top;
      }
      this.log(
        `Loaded panel state: isPanelVisible=${this.state.isPanelVisible}, themeMode=${this.state.themeMode}, hasSeenSplash=${this.state.hasSeenSplash}, right=${this.state.panelPosition.right}, top=${this.state.panelPosition.top}, isToolsExpanded=${this.state.isToolsExpanded}, isModalOpen=${this.state.isModalOpen}, isDropdownOpen=${this.state.isDropdownOpen}, isSplashOpen=${this.state.isSplashOpen}, pendingImportCount=${this.state.pendingImportCount}, isSplashDragging=${this.state.isSplashDragging}, splashPosition=${JSON.stringify(this.state.splashPosition)}`
      );
    };
    window.PanelManager.prototype.applyPanelStyles = function () {
      const position = this.state.panelPosition || {
        right: '10px',
        top: '60px',
      };
      this.styleElement.textContent = `
    button:active { transform: scale(0.95); }
    #ghosted-panel-container {
      position: fixed;
      right: ${position.right};
      top: ${position.top};
      z-index: ${this.uiElements.config.PANEL.Z_INDEX};
      border-radius: 12px;
    }
  `;
    };
    window.PanelManager.prototype.setVisibility = function (isVisible) {
      this.state.isPanelVisible =
        typeof isVisible === 'boolean' ? isVisible : this.state.isPanelVisible;
      this.saveState();
      this.log(`Set panel visibility: ${this.state.isPanelVisible}`);
    };
    window.PanelManager.prototype.toggleVisibility = function (newVisibility) {
      this.state.isPanelVisible =
        typeof newVisibility === 'boolean'
          ? newVisibility
          : !this.state.isPanelVisible;
      this.saveState();
      this.document.dispatchEvent(
        new CustomEvent(EVENTS.TOGGLE_PANEL_VISIBILITY, {
          detail: { isPanelVisible: this.state.isPanelVisible },
        })
      );
    };
    window.PanelManager.prototype.setPanelPosition = function (position) {
      this.state.panelPosition = { ...position };
      this.saveState();
      this.log(
        `Updated panel position: right=${position.right}, top=${position.top}`
      );
    };
    window.PanelManager.prototype.onEyeballClick = function (href) {
      this.log(`PanelManager: Eyeball clicked for href=${href}`);
      this.document.dispatchEvent(
        new CustomEvent(EVENTS.REQUEST_POST_CHECK, {
          detail: { href },
        })
      );
    };
    window.PanelManager.prototype.showSplashPage = function () {
      this.state.isSplashOpen = true;
      this.state.isSplashDragging = false;
      this.state.splashPosition = { top: null, left: null };
      this.saveState();
      this.renderPanel();
      if (this.uiElements.splashContainer) {
        this.uiElements.splashContainer.style.top = '50%';
        this.uiElements.splashContainer.style.left = '50%';
        this.uiElements.splashContainer.style.width = '400px';
        this.uiElements.splashContainer.style.height = '200px';
        this.uiElements.splashContainer.offsetWidth;
      }
      this.log('Splash screen opened');
    };
    window.PanelManager.prototype.closeSplash = function () {
      this.state.isSplashOpen = false;
      this.state.isSplashDragging = false;
      this.state.splashPosition = { top: null, left: null };
      this.saveState();
      this.renderPanel();
      this.log('Splash screen closed');
    };
    window.PanelManager.prototype.renderPanel = function () {
      if (!this.uiElements.panel) {
        this.log('renderPanel: panel element not initialized, skipping render');
        return;
      }
      this.log(
        `renderPanel: themeMode=${this.state.themeMode}, config.THEMES=`,
        this.uiElements.config.THEMES
      );
      window.preact.render(
        window.preact.h(window.Panel, {
          state: this.state,
          config: this.uiElements.config,
          linkPrefix: this.linkPrefix,
          currentMode: this.state.themeMode,
          toggleThemeMode: (newMode) => this.handleModeChange(newMode),
          onCopyLinks: () => this.copyLinks(),
          setPanelPosition: (position) => this.setPanelPosition(position),
          startDrag: (e) => this.startDrag(e),
          onEyeballClick: (href) => this.onEyeballClick(href),
          flagged: this.state.flagged || [],
          totalPosts: this.state.totalPosts || 0,
          isScanning: this.state.isPostScanningEnabled,
          isScrolling: this.state.userRequestedAutoScrolling,
          userProfileName: this.state.userProfileName,
          onToggleVisibility: () => this.toggleVisibility(),
          onToggleTools: () => this.toggleTools(),
          onToggleScanning: () => this.toggleScanning(),
          onToggleAutoScrolling: () => this.toggleAutoScrolling(),
          onExportCsv: () => this.exportCsv(),
          onOpenModal: () => this.openModal(),
          onCloseModal: () => this.closeModal(),
          onSubmitCsv: (csvText) => this.submitCsv(csvText),
          onClearPosts: () => this.clearPosts(),
          onOpenAbout: () => this.openAbout(),
          onToggleDropdown: () => this.toggleDropdown(),
          autoDeleteStatus: this.state.autoDeleteStatus,
          onToggleAutoDelete: () => this.toggleAutoDelete(),
        }),
        this.uiElements.panel
      );
      if (this.state.isSplashOpen) {
        window.preact.render(
          window.preact.h(window.SplashPanel, {
            version: this.state.version,
            userProfileName: this.state.userProfileName,
            pollInterval: this.state.pollInterval,
            scrollInterval: this.state.scrollInterval,
            onClose: () => this.closeSplash(),
            onDragStart: (e) => this.startSplashDrag(e),
            mode: this.state.themeMode,
            config: this.uiElements.config,
            isDragging: this.state.isSplashDragging,
            currentTop: this.state.splashPosition.top,
            currentLeft: this.state.splashPosition.left,
          }),
          this.uiElements.splashContainer
        );
      } else {
        window.preact.render(null, this.uiElements.splashContainer);
      }
    };
    window.PanelManager.prototype.startDrag = function (e) {
      const draggedContainer = this.uiElements.panelContainer;
      if (!draggedContainer) return;
      draggedContainer.classList.add('dragging');
      const computedStyle = window.getComputedStyle(draggedContainer);
      let currentRight =
        parseFloat(computedStyle.right) ||
        parseFloat(this.state.panelPosition.right) ||
        10;
      let currentTop =
        parseFloat(computedStyle.top) ||
        parseFloat(this.state.panelPosition.top) ||
        60;
      let initialX = e.clientX + currentRight;
      let initialY = e.clientY - currentTop;
      let right = currentRight;
      let top = currentTop;
      let lastUpdate = 0;
      const throttleDelay = 16;
      const onMouseMove = (e2) => {
        const now = Date.now();
        if (now - lastUpdate < throttleDelay) return;
        lastUpdate = now;
        right = initialX - e2.clientX;
        top = e2.clientY - initialY;
        right = Math.max(
          0,
          Math.min(right, window.innerWidth - draggedContainer.offsetWidth)
        );
        top = Math.max(
          0,
          Math.min(top, window.innerHeight - draggedContainer.offsetHeight)
        );
        draggedContainer.style.right = `${right}px`;
        draggedContainer.style.top = `${top}px`;
      };
      const onMouseUp = () => {
        try {
          draggedContainer.classList.remove('dragging');
          if (this.setPanelPosition) {
            this.setPanelPosition({
              right: `${right}px`,
              top: `${top}px`,
            });
          }
        } catch (error) {
          this.log(`Error in onMouseUp: ${error}`);
        } finally {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
    window.PanelManager.prototype.startSplashDrag = function (e) {
      if (e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      const draggedContainer = this.uiElements.splashContainer;
      if (!draggedContainer) return;
      this.state.isSplashDragging = true;
      draggedContainer.classList.add('dragging');
      const computedStyle = window.getComputedStyle(draggedContainer);
      const initialTransform = computedStyle.transform;
      const initialComputedTop = computedStyle.top;
      const initialComputedLeft = computedStyle.left;
      const panelZIndex = window.getComputedStyle(
        this.uiElements.panelContainer
      ).zIndex;
      const splashZIndex = computedStyle.zIndex;
      draggedContainer.style.transform = 'none';
      draggedContainer.offsetWidth;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const rect = draggedContainer.getBoundingClientRect();
          let rectWidth =
            rect.width > 0 && rect.width <= window.innerWidth
              ? rect.width
              : 400;
          let rectHeight =
            rect.height > 0 && rect.height <= window.innerHeight
              ? rect.height
              : 200;
          if (rect.width <= 0 || rect.width > window.innerWidth) {
            this.log(
              `Warning: Invalid rectWidth=${rect.width}, using fallback 400`
            );
            rectWidth = 400;
          }
          if (rect.height <= 0 || rect.height > window.innerHeight) {
            this.log(
              `Warning: Invalid rectHeight=${rect.height}, using fallback 200`
            );
            rectHeight = 200;
          }
          const isCentered =
            this.state.splashPosition.top == null &&
            this.state.splashPosition.left == null;
          let offsetX, offsetY, initialLeft, initialTop;
          if (isCentered) {
            initialLeft = window.innerWidth / 2 - rectWidth / 2;
            initialTop = window.innerHeight / 2 - rectHeight / 2;
            offsetX = e.clientX - initialLeft;
            offsetY = e.clientY - initialTop;
          } else {
            initialLeft = rect.left;
            initialTop = rect.top;
            offsetX = e.clientX - initialLeft;
            offsetY = e.clientY - initialTop;
          }
          draggedContainer.style.position = 'fixed';
          draggedContainer.style.top = `${initialTop}px`;
          draggedContainer.style.left = `${initialLeft}px`;
          this.state.splashPosition = { top: initialTop, left: initialLeft };
          this.renderPanel();
          let lastUpdate = 0;
          const throttleDelay = 16;
          const onMouseMove = (e2) => {
            const now = Date.now();
            if (now - lastUpdate < throttleDelay) return;
            lastUpdate = now;
            let newTop = e2.clientY - offsetY;
            let newLeft = e2.clientX - offsetX;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            newTop = Math.max(0, Math.min(newTop, windowHeight - rectHeight));
            newLeft = Math.max(0, Math.min(newLeft, windowWidth - rectWidth));
            this.state.splashPosition = { top: newTop, left: newLeft };
            draggedContainer.style.top = `${newTop}px`;
            draggedContainer.style.left = `${newLeft}px`;
            this.renderPanel();
            const currentComputedStyle =
              window.getComputedStyle(draggedContainer);
            this.log(
              `Dragging SplashPanel: clientX=${e2.clientX}, clientY=${e2.clientY}, offsetX=${offsetX}, offsetY=${offsetY}, initialLeft=${initialLeft}, initialTop=${initialTop}, rectLeft=${rect.left}, rectTop=${rect.top}, newTop=${newTop}px, newLeft=${newLeft}px, windowWidth=${windowWidth}, rectWidth=${rectWidth}, initialTransform=${initialTransform}, initialComputedTop=${initialComputedTop}, initialComputedLeft=${initialComputedLeft}, currentComputedTop=${currentComputedStyle.top}, currentComputedLeft=${currentComputedStyle.left}, panelZIndex=${panelZIndex}, splashZIndex=${splashZIndex}`
            );
          };
          const onMouseUp = () => {
            draggedContainer.classList.remove('dragging');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            this.saveState();
            this.renderPanel();
            this.log('Stopped dragging SplashPanel');
          };
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
          this.log('Started dragging SplashPanel');
        });
      });
    };
    window.PanelManager.prototype.toggleTools = function () {
      this.state.isToolsExpanded = !this.state.isToolsExpanded;
      this.saveState();
      this.renderPanel();
      this.log(`Toggled tools section: ${this.state.isToolsExpanded}`);
    };
    window.PanelManager.prototype.openModal = function () {
      this.state.isModalOpen = true;
      this.saveState();
      this.renderPanel();
      this.log('Opened CSV import modal');
    };
    window.PanelManager.prototype.closeModal = function () {
      this.state.isModalOpen = false;
      this.saveState();
      this.renderPanel();
      this.log('Closed CSV import modal');
    };
    window.PanelManager.prototype.toggleDropdown = function () {
      this.state.isDropdownOpen = !this.state.isDropdownOpen;
      this.saveState();
      this.renderPanel();
      this.log(`Toggled theme dropdown: ${this.state.isDropdownOpen}`);
    };
    window.PanelManager.prototype.toggleScanning = function () {
      this.document.dispatchEvent(
        new CustomEvent(EVENTS.SET_SCANNING, {
          detail: { enabled: !this.state.isPostScanningEnabled },
        })
      );
      this.saveState();
      this.renderPanel();
      this.log(`Toggled scanning: ${!this.state.isPostScanningEnabled}`);
    };
    window.PanelManager.prototype.toggleAutoScrolling = function () {
      this.document.dispatchEvent(
        new CustomEvent(EVENTS.SET_AUTO_SCROLLING, {
          detail: { enabled: !this.state.userRequestedAutoScrolling },
        })
      );
      this.saveState();
      this.renderPanel();
      this.log(
        `Toggled auto-scrolling: ${!this.state.userRequestedAutoScrolling}`
      );
    };
    window.PanelManager.prototype.toggleAutoDelete = function () {
      const running = Boolean(this.state.autoDeleteStatus?.running);
      const nextState = !running;
      this.log(
        `PanelManager: Auto delete toggle requested -> ${nextState ? 'start' : 'stop'}`
      );
      this.document.dispatchEvent(
        new CustomEvent(EVENTS.AUTO_DELETE_TOGGLE_REQUEST, {
          detail: { enabled: nextState },
        })
      );
    };
    window.PanelManager.prototype.exportCsv = function () {
      this.pendingExportCsv = true;
      this.document.dispatchEvent(new CustomEvent(EVENTS.EXPORT_CSV));
      this.renderPanel();
      this.log('Dispatched export CSV event');
    };
    window.PanelManager.prototype.clearPosts = function () {
      this.document.dispatchEvent(new CustomEvent(EVENTS.CLEAR_POSTS_UI));
      this.renderPanel();
      this.log('Dispatched clear posts event');
    };
    window.PanelManager.prototype.openAbout = function () {
      this.document.dispatchEvent(new CustomEvent(EVENTS.OPEN_ABOUT));
      this.renderPanel();
      this.log('Dispatched open about event');
    };
    window.PanelManager.prototype.submitCsv = function (csvText) {
      this.log(
        `PanelManager: Dispatching REQUEST_IMPORT_CSV with csvText length: ${csvText?.length || 0}`
      );
      this.document.dispatchEvent(
        new CustomEvent(EVENTS.REQUEST_IMPORT_CSV, {
          detail: { csvText },
        })
      );
      this.closeModal();
    };
    window.PanelManager.prototype.updateTheme = function (newMode) {
      this.state.themeMode = newMode;
      this.renderPanel();
    };
    window.PanelManager.prototype.handleModeChange = function (newMode) {
      this.state.themeMode = newMode;
      const currentState = this.storage.get('xGhostedState', {});
      const updatedState = {
        ...currentState,
        panel: {
          ...currentState.panel,
          themeMode: newMode,
        },
      };
      this.storage.set('xGhostedState', updatedState);
      this.log(`Saved themeMode: ${newMode}`);
      this.renderPanel();
    };
    window.PanelManager.prototype.copyLinks = function (posts) {
      if (!posts) {
        this.pendingCopyLinks = true;
        this.document.dispatchEvent(new CustomEvent(EVENTS.REQUEST_POSTS));
        return;
      }
      const linksText = this.state.flagged
        .map(([href]) => `${this.linkPrefix}${href}`)
        .join('\n');
      navigator.clipboard
        .writeText(linksText)
        .then(() => {
          this.log('Problem links copied to clipboard');
          alert('Problem links copied to clipboard!');
        })
        .catch((err) => {
          this.log(`Failed to copy problem links: ${err}`);
          alert('Failed to copy problem links.');
        });
      this.renderPanel();
    };
    window.PanelManager.prototype.updatePosts = function ({ post, isProblem }) {
      if (post) {
        const { href, data } = post;
        if (isProblem) {
          this.state.flagged = [
            ...this.state.flagged.filter(
              ([existingHref]) => existingHref !== href
            ),
            [href, data],
          ];
        } else {
          this.state.flagged = this.state.flagged.filter(
            ([existingHref]) => existingHref !== href
          );
        }
        this.state.totalPosts += 1;
        if (isProblem) {
          this.renderPanelDebounced();
        }
      }
    };
    return PanelManager;
  })();
  window.ProcessedPostsManager = (function () {
    // src/utils/postQuality.js
    var postQuality = Object.freeze({
      UNDEFINED: Object.freeze({ name: 'Undefined Container', value: 0 }),
      DIVIDER: Object.freeze({ name: 'Invisible Divider', value: 1 }),
      PROBLEM: Object.freeze({ name: 'Problem', value: 2 }),
      PROBLEM_ADJACENT: Object.freeze({
        name: 'Problem by Association',
        value: 3,
      }),
      POTENTIAL_PROBLEM: Object.freeze({ name: 'Potential Problem', value: 4 }),
      GOOD: Object.freeze({ name: 'Good', value: 5 }),
    });

    // src/config.js
    var CONFIG = {
      timing: {
        debounceDelay: 500,
        throttleDelay: 1e3,
        tabCheckThrottle: 5e3,
        exportThrottle: 5e3,
        rateLimitPause: 20 * 1e3,
        pollInterval: 500,
        scrollInterval: 1500,
        isPostScanningEnabledOnStartup: false,
        // We'll send an event to change to true on the first heartbeat poll
        userRequestedAutoScrollOnStartup: false,
        checkPostMaxTries: 30,
      },
      showSplash: true,
      logTarget: 'tampermonkey',
      persistProcessedPosts: false,
      linkPrefix: 'https://x.com',
      debug: false,
      smoothScrolling: true,
      scrollPercentage: 1.5,
      decoratePostsContainer: false,
    };

    // src/events.ts
    var EVENTS = {
      INIT_COMPONENTS: 'xghosted:init-components',
      POST_REGISTERED: 'xghosted:post-registered',
      POST_REQUESTED: 'xghosted:post-requested',
      POST_RETRIEVED: 'xghosted:post-retrieved',
      REQUEST_POST_CHECK: 'xghosted:request-post-check',
      CLEAR_POSTS: 'xghosted:clear-posts',
      CLEAR_POSTS_UI: 'xghosted:clear-posts-ui',
      POSTS_CLEARED: 'xghosted:posts-cleared',
      POSTS_CLEARED_CONFIRMED: 'xghosted:posts-cleared-confirmed',
      REQUEST_POSTS: 'xghosted:request-posts',
      POSTS_RETRIEVED: 'xghosted:posts-retrieved',
      CSV_IMPORTED: 'xghosted:csv-imported',
      REQUEST_IMPORT_CSV: 'xghosted:request-import-csv',
      EXPORT_CSV: 'xghosted:export-csv',
      CSV_EXPORTED: 'xghosted:csv-exported',
      SET_SCANNING: 'xghosted:set-scanning',
      SCANNING_STATE_UPDATED: 'xghosted:scanning-state-updated',
      SET_AUTO_SCROLLING: 'xghosted:set-auto-scrolling',
      AUTO_SCROLLING_TOGGLED: 'xghosted:auto-scrolling-toggled',
      RATE_LIMIT_DETECTED: 'xghosted:rate-limit-detected',
      USER_PROFILE_UPDATED: 'xghosted:user-profile-updated',
      INIT: 'xghosted:init',
      STATE_UPDATED: 'xghosted:state-updated',
      OPEN_ABOUT: 'xghosted:open-about',
      TOGGLE_PANEL_VISIBILITY: 'xghosted:toggle-panel-visibility',
      COPY_LINKS: 'xghosted:copy-links',
      REQUEST_METRICS: 'xghosted:request-metrics',
      METRICS_RETRIEVED: 'xghosted:metrics-retrieved',
      EXPORT_METRICS: 'xghosted:export-metrics',
      METRICS_UPDATED: 'xghosted:metrics-updated',
      RECORD_POLL: 'xghosted:record-poll',
      RECORD_SCROLL: 'xghosted:record-scroll',
      RECORD_SCAN: 'xghosted:record-scan',
      RECORD_TAB_CHECK: 'xghosted:record-tab-check',
      SET_INITIAL_WAIT_TIME: 'xghosted:set-initial-wait-time',
      SET_POST_DENSITY: 'xghosted:set-post-density',
      SAVE_METRICS: 'xghosted:save-metrics',
      AUTO_DELETE_TOGGLE_REQUEST: 'xghosted:auto-delete-toggle-request',
      AUTO_DELETE_STATUS: 'xghosted:auto-delete-status',
    };
    var EVENT_CONTRACTS = {
      [EVENTS.INIT_COMPONENTS]: { config: 'object' },
      [EVENTS.POST_REGISTERED]: { href: 'string', data: 'object' },
      [EVENTS.POST_REQUESTED]: { href: 'string' },
      [EVENTS.POST_RETRIEVED]: { href: 'string', post: 'object|null' },
      [EVENTS.REQUEST_POST_CHECK]: { href: 'string' },
      [EVENTS.CLEAR_POSTS]: {},
      [EVENTS.CLEAR_POSTS_UI]: {},
      [EVENTS.POSTS_CLEARED]: {},
      [EVENTS.POSTS_CLEARED_CONFIRMED]: {},
      [EVENTS.REQUEST_POSTS]: {},
      [EVENTS.POSTS_RETRIEVED]: { posts: 'array' },
      [EVENTS.CSV_IMPORTED]: { importedCount: 'number' },
      [EVENTS.REQUEST_IMPORT_CSV]: { csvText: 'string' },
      [EVENTS.EXPORT_CSV]: {},
      [EVENTS.CSV_EXPORTED]: { csvData: 'string' },
      [EVENTS.SET_SCANNING]: { enabled: 'boolean' },
      [EVENTS.SCANNING_STATE_UPDATED]: { isPostScanningEnabled: 'boolean' },
      [EVENTS.SET_AUTO_SCROLLING]: { enabled: 'boolean' },
      [EVENTS.AUTO_SCROLLING_TOGGLED]: {
        userRequestedAutoScrolling: 'boolean',
      },
      [EVENTS.RATE_LIMIT_DETECTED]: { pauseDuration: 'number' },
      [EVENTS.USER_PROFILE_UPDATED]: { userProfileName: 'string|null' },
      [EVENTS.INIT]: { config: 'object' },
      [EVENTS.STATE_UPDATED]: { isRateLimited: 'boolean' },
      [EVENTS.OPEN_ABOUT]: {},
      [EVENTS.TOGGLE_PANEL_VISIBILITY]: { isPanelVisible: 'boolean' },
      [EVENTS.COPY_LINKS]: {},
      [EVENTS.REQUEST_METRICS]: {},
      [EVENTS.METRICS_RETRIEVED]: { timingHistory: 'array' },
      [EVENTS.EXPORT_METRICS]: {},
      [EVENTS.METRICS_UPDATED]: { metrics: 'object' },
      [EVENTS.RECORD_POLL]: {
        postsProcessed: 'number',
        wasSkipped: 'boolean',
        containerFound: 'boolean',
        containerAttempted: 'boolean',
        pageType: 'string',
        isScanningStarted: 'boolean',
        isScanningStopped: 'boolean',
        cellInnerDivCount: 'number',
      },
      [EVENTS.RECORD_SCROLL]: { bottomReached: 'boolean' },
      [EVENTS.RECORD_SCAN]: {
        duration: 'number',
        postsProcessed: 'number',
        wasSkipped: 'boolean',
        interval: 'number',
        isAutoScrolling: 'boolean',
      },
      [EVENTS.RECORD_TAB_CHECK]: {
        duration: 'number',
        success: 'boolean',
        rateLimited: 'boolean',
        attempts: 'number',
      },
      [EVENTS.SET_INITIAL_WAIT_TIME]: { time: 'number' },
      [EVENTS.SET_POST_DENSITY]: { count: 'number' },
      [EVENTS.SAVE_METRICS]: {},
      [EVENTS.AUTO_DELETE_TOGGLE_REQUEST]: { enabled: 'boolean' },
      [EVENTS.AUTO_DELETE_STATUS]: {
        running: 'boolean',
        deleting: 'boolean',
        deletedCount: 'number',
        username: 'string|null',
        canRun: 'boolean',
        message: 'string',
      },
    };

    // src/dom/domUtils.js
    var domUtils = {
      querySelector(selector, doc = document) {
        return doc.querySelector(selector);
      },
      querySelectorAll(selector, doc = document) {
        return doc.querySelectorAll(selector);
      },
      createElement(tag, doc = document) {
        return doc.createElement(tag);
      },
      addEventListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
      },
      dispatchEvent(element, event) {
        element.dispatchEvent(event);
      },
      removeEventListener(element, event, handler, options = {}) {
        element.removeEventListener(event, handler, options);
      },
      closest(element, selector) {
        let current = element;
        while (current && !current.matches(selector)) {
          current = current.parentElement;
        }
        return current;
      },
      scrollBy(options, win = window) {
        win.scrollBy(options);
      },
      getScrollY(win = window) {
        return win.scrollY;
      },
      getInnerHeight(win = window) {
        return win.innerHeight;
      },
      POSTS_IN_DOC_SELECTOR: `div:not([aria-label="Timeline: Messages"]) > div > div[data-testid="cellInnerDiv"]`,
      POST_CONTAINER_SELECTOR: 'div[data-ghosted="posts-container"]',
      POSTS_IN_CONTAINER_SELECTOR: `div[data-ghosted="posts-container"] > div > div[data-testid="cellInnerDiv"]`,
      UNPROCESSED_POSTS_SELECTOR: `div[data-ghosted="posts-container"] > div > div[data-testid="cellInnerDiv"]:not([data-ghostedid])`,
    };

    // src/utils/ProcessedPostsManager.js
    var ProcessedPostsManager = class {
      constructor({
        storage,
        log,
        linkPrefix,
        persistProcessedPosts,
        document: document2,
      }) {
        this.storage = storage || { get: () => {}, set: () => {} };
        this.log = log || console.log.bind(console);
        this.linkPrefix = linkPrefix || CONFIG.linkPrefix;
        this.persistProcessedPosts =
          persistProcessedPosts ?? CONFIG.persistProcessedPosts;
        this.posts = {};
        this.document = document2;
        if (this.persistProcessedPosts) {
          this.load();
        }
        this.initEventListeners();
      }
      initEventListeners() {
        domUtils.addEventListener(
          this.document,
          EVENTS.INIT_COMPONENTS,
          ({ detail: { config } }) => {
            this.linkPrefix = config.linkPrefix || this.linkPrefix;
            this.persistProcessedPosts =
              config.persistProcessedPosts ?? this.persistProcessedPosts;
            if (this.persistProcessedPosts) {
              this.load();
            }
          }
        );
        domUtils.addEventListener(
          this.document,
          EVENTS.POST_REGISTERED,
          ({ detail: { href, data } }) => {
            if (!data?.analysis?.quality) {
              this.log(
                `Skipping post registration: no quality data for href=${href}`
              );
              return;
            }
            if (!href || href === 'false') {
              this.log(
                `Skipping post with invalid href: ${href}${data.analysis.quality.name === 'Problem' ? ' (PROBLEM)' : ''}`
              );
              return;
            }
            this.registerPost(href, data);
            this.log(`Registered post: ${href}`);
            domUtils.dispatchEvent(
              this.document,
              new CustomEvent(EVENTS.POST_REGISTERED_CONFIRMED, {
                detail: { href, data },
              })
            );
          }
        );
        domUtils.addEventListener(
          this.document,
          EVENTS.POST_REQUESTED,
          ({ detail: { href } }) => {
            const post = this.getPost(href);
            domUtils.dispatchEvent(
              this.document,
              new CustomEvent(EVENTS.POST_RETRIEVED, {
                detail: { href, post },
              })
            );
            this.log(`Retrieved post: ${href}`);
          }
        );
        domUtils.addEventListener(
          this.document,
          EVENTS.CLEAR_POSTS,
          async () => {
            await this.clearPosts();
            domUtils.dispatchEvent(
              this.document,
              new CustomEvent(EVENTS.POSTS_CLEARED_CONFIRMED, {
                detail: {},
              })
            );
            domUtils.dispatchEvent(
              this.document,
              new CustomEvent(EVENTS.POSTS_CLEARED, {
                detail: {},
              })
            );
            this.log('Cleared all posts');
          }
        );
        domUtils.addEventListener(
          this.document,
          EVENTS.CLEAR_POSTS_UI,
          async () => {
            if (confirm('Clear all processed posts?')) {
              await this.clearPosts();
              domUtils.dispatchEvent(
                this.document,
                new CustomEvent(EVENTS.POSTS_CLEARED_CONFIRMED, {
                  detail: {},
                })
              );
              domUtils.dispatchEvent(
                this.document,
                new CustomEvent(EVENTS.POSTS_CLEARED, {
                  detail: {},
                })
              );
              this.log('Cleared all posts via UI');
            }
          }
        );
        domUtils.addEventListener(this.document, EVENTS.REQUEST_POSTS, () => {
          const posts = this.getAllPosts();
          domUtils.dispatchEvent(
            this.document,
            new CustomEvent(EVENTS.POSTS_RETRIEVED, {
              detail: { posts },
            })
          );
          this.log('Dispatched xghosted:posts-retrieved with posts:', posts);
        });
        domUtils.addEventListener(
          this.document,
          EVENTS.REQUEST_IMPORT_CSV,
          ({ detail: { csvText } }) => {
            const importedCount = this.importPosts(csvText);
            domUtils.dispatchEvent(
              this.document,
              new CustomEvent(EVENTS.CSV_IMPORTED, {
                detail: { importedCount },
              })
            );
            this.log(
              'Dispatched xghosted:csv-imported with count:',
              importedCount
            );
          }
        );
        domUtils.addEventListener(this.document, EVENTS.EXPORT_CSV, () => {
          const csvData = this.exportPostsToCSV();
          domUtils.dispatchEvent(
            this.document,
            new CustomEvent(EVENTS.CSV_EXPORTED, {
              detail: { csvData },
            })
          );
          this.log('Dispatched xghosted:csv-exported');
        });
      }
      load() {
        if (!this.persistProcessedPosts) {
          this.log('Persistence disabled, skipping load');
          return;
        }
        const state = this.storage.get('xGhostedState', {});
        this.posts = {};
        const savedPosts = state.processedPosts || {};
        for (const [id, { analysis, checked }] of Object.entries(savedPosts)) {
          this.posts[id] = {
            analysis: { ...analysis },
            checked,
          };
        }
        this.log(`Loaded ${Object.keys(this.posts).length} posts from storage`);
      }
      save() {
        if (!this.persistProcessedPosts) {
          this.log('Persistence disabled, skipping save');
          return;
        }
        const state = this.storage.get('xGhostedState', {});
        state.processedPosts = {};
        for (const [id, { analysis, checked }] of Object.entries(this.posts)) {
          state.processedPosts[id] = { analysis: { ...analysis }, checked };
        }
        this.storage.set('xGhostedState', state);
        this.log('Saved posts to storage');
      }
      registerPost(id, data) {
        if (!id || !data?.analysis?.quality) {
          this.log(
            `Skipping post registration: invalid id or data for id=${id}`
          );
          return;
        }
        this.posts[id] = {
          analysis: { ...data.analysis },
          checked: data.checked || false,
        };
        this.log(`Registered post: ${id}`);
        if (this.persistProcessedPosts) {
          this.save();
        }
      }
      getPost(id) {
        return this.posts[id] || null;
      }
      getAllPosts() {
        return Object.entries(this.posts);
      }
      clearPosts() {
        this.posts = {};
        if (this.persistProcessedPosts) {
          this.save();
        }
        this.log('Cleared all posts');
      }
      importPosts(csvText) {
        if (!csvText) {
          this.log('No CSV text provided, skipping import');
          return 0;
        }
        this.log(`Processing CSV text with length: ${csvText.length}`);
        const lines = csvText.trim().split(/\r?\n/);
        this.log(`Parsed ${lines.length} lines from CSV`);
        if (lines.length === 0) {
          this.log('No lines found in CSV, skipping import');
          return 0;
        }
        const headers = lines[0].split(',').map((h) => h.trim());
        const expectedHeaders = ['Link', 'Quality', 'Reason', 'Checked'];
        if (!expectedHeaders.every((h, i) => headers[i] === h)) {
          this.log(
            `Invalid CSV format, expected headers: ${expectedHeaders.join(',')}, got: ${headers.join(',')}`
          );
          return 0;
        }
        if (lines.length === 1) {
          this.log('No data rows found in CSV, only headers');
          return 0;
        }
        let importedCount = 0;
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].trim();
          if (!row) {
            this.log(`Skipping empty row at index ${i}`);
            continue;
          }
          const columns = row.split(',').map((c) => c.trim());
          if (columns.length !== expectedHeaders.length) {
            this.log(
              `Skipping row ${i} with invalid column count: ${columns.length}, expected: ${expectedHeaders.length}, row: ${row}`
            );
            continue;
          }
          const [link, quality, reason, checked] = columns;
          this.log(
            `Processing row ${i}: link=${link}, quality=${quality}, reason=${reason}, checked=${checked}`
          );
          const id = link.startsWith(this.linkPrefix)
            ? link.slice(this.linkPrefix.length)
            : link;
          const qualityObj = Object.values(postQuality).find(
            (q) => q.name === quality
          );
          if (!qualityObj) {
            this.log(
              `Skipping invalid quality for post: ${link}, quality: ${quality}`
            );
            continue;
          }
          this.posts[id] = {
            analysis: {
              quality: qualityObj,
              reason: reason || '',
            },
            checked: checked === 'true',
          };
          importedCount++;
        }
        if (importedCount > 0) {
          this.log(`Imported ${importedCount} posts from CSV`);
          if (this.persistProcessedPosts) {
            this.save();
          }
        } else {
          this.log('No posts imported from CSV');
        }
        return importedCount;
      }
      exportPostsToCSV() {
        const headers = ['Link', 'Quality', 'Reason', 'Checked'];
        const rows = Object.entries(this.posts).map(
          ([id, { analysis, checked }]) => {
            return [
              `${this.linkPrefix}${id}`,
              analysis.quality.name,
              analysis.reason,
              checked ? 'true' : 'false',
            ].join(',');
          }
        );
        return [headers.join(','), ...rows].join('\n');
      }
    };
    return ProcessedPostsManager;
  })();
  window.MetricsMonitor = (function () {
    // src/config.js
    var CONFIG = {
      timing: {
        debounceDelay: 500,
        throttleDelay: 1e3,
        tabCheckThrottle: 5e3,
        exportThrottle: 5e3,
        rateLimitPause: 20 * 1e3,
        pollInterval: 500,
        scrollInterval: 1500,
        isPostScanningEnabledOnStartup: false,
        // We'll send an event to change to true on the first heartbeat poll
        userRequestedAutoScrollOnStartup: false,
        checkPostMaxTries: 30,
      },
      showSplash: true,
      logTarget: 'tampermonkey',
      persistProcessedPosts: false,
      linkPrefix: 'https://x.com',
      debug: false,
      smoothScrolling: true,
      scrollPercentage: 1.5,
      decoratePostsContainer: false,
    };

    // src/events.ts
    var EVENTS = {
      INIT_COMPONENTS: 'xghosted:init-components',
      POST_REGISTERED: 'xghosted:post-registered',
      POST_REQUESTED: 'xghosted:post-requested',
      POST_RETRIEVED: 'xghosted:post-retrieved',
      REQUEST_POST_CHECK: 'xghosted:request-post-check',
      CLEAR_POSTS: 'xghosted:clear-posts',
      CLEAR_POSTS_UI: 'xghosted:clear-posts-ui',
      POSTS_CLEARED: 'xghosted:posts-cleared',
      POSTS_CLEARED_CONFIRMED: 'xghosted:posts-cleared-confirmed',
      REQUEST_POSTS: 'xghosted:request-posts',
      POSTS_RETRIEVED: 'xghosted:posts-retrieved',
      CSV_IMPORTED: 'xghosted:csv-imported',
      REQUEST_IMPORT_CSV: 'xghosted:request-import-csv',
      EXPORT_CSV: 'xghosted:export-csv',
      CSV_EXPORTED: 'xghosted:csv-exported',
      SET_SCANNING: 'xghosted:set-scanning',
      SCANNING_STATE_UPDATED: 'xghosted:scanning-state-updated',
      SET_AUTO_SCROLLING: 'xghosted:set-auto-scrolling',
      AUTO_SCROLLING_TOGGLED: 'xghosted:auto-scrolling-toggled',
      RATE_LIMIT_DETECTED: 'xghosted:rate-limit-detected',
      USER_PROFILE_UPDATED: 'xghosted:user-profile-updated',
      INIT: 'xghosted:init',
      STATE_UPDATED: 'xghosted:state-updated',
      OPEN_ABOUT: 'xghosted:open-about',
      TOGGLE_PANEL_VISIBILITY: 'xghosted:toggle-panel-visibility',
      COPY_LINKS: 'xghosted:copy-links',
      REQUEST_METRICS: 'xghosted:request-metrics',
      METRICS_RETRIEVED: 'xghosted:metrics-retrieved',
      EXPORT_METRICS: 'xghosted:export-metrics',
      METRICS_UPDATED: 'xghosted:metrics-updated',
      RECORD_POLL: 'xghosted:record-poll',
      RECORD_SCROLL: 'xghosted:record-scroll',
      RECORD_SCAN: 'xghosted:record-scan',
      RECORD_TAB_CHECK: 'xghosted:record-tab-check',
      SET_INITIAL_WAIT_TIME: 'xghosted:set-initial-wait-time',
      SET_POST_DENSITY: 'xghosted:set-post-density',
      SAVE_METRICS: 'xghosted:save-metrics',
      AUTO_DELETE_TOGGLE_REQUEST: 'xghosted:auto-delete-toggle-request',
      AUTO_DELETE_STATUS: 'xghosted:auto-delete-status',
    };
    var EVENT_CONTRACTS = {
      [EVENTS.INIT_COMPONENTS]: { config: 'object' },
      [EVENTS.POST_REGISTERED]: { href: 'string', data: 'object' },
      [EVENTS.POST_REQUESTED]: { href: 'string' },
      [EVENTS.POST_RETRIEVED]: { href: 'string', post: 'object|null' },
      [EVENTS.REQUEST_POST_CHECK]: { href: 'string' },
      [EVENTS.CLEAR_POSTS]: {},
      [EVENTS.CLEAR_POSTS_UI]: {},
      [EVENTS.POSTS_CLEARED]: {},
      [EVENTS.POSTS_CLEARED_CONFIRMED]: {},
      [EVENTS.REQUEST_POSTS]: {},
      [EVENTS.POSTS_RETRIEVED]: { posts: 'array' },
      [EVENTS.CSV_IMPORTED]: { importedCount: 'number' },
      [EVENTS.REQUEST_IMPORT_CSV]: { csvText: 'string' },
      [EVENTS.EXPORT_CSV]: {},
      [EVENTS.CSV_EXPORTED]: { csvData: 'string' },
      [EVENTS.SET_SCANNING]: { enabled: 'boolean' },
      [EVENTS.SCANNING_STATE_UPDATED]: { isPostScanningEnabled: 'boolean' },
      [EVENTS.SET_AUTO_SCROLLING]: { enabled: 'boolean' },
      [EVENTS.AUTO_SCROLLING_TOGGLED]: {
        userRequestedAutoScrolling: 'boolean',
      },
      [EVENTS.RATE_LIMIT_DETECTED]: { pauseDuration: 'number' },
      [EVENTS.USER_PROFILE_UPDATED]: { userProfileName: 'string|null' },
      [EVENTS.INIT]: { config: 'object' },
      [EVENTS.STATE_UPDATED]: { isRateLimited: 'boolean' },
      [EVENTS.OPEN_ABOUT]: {},
      [EVENTS.TOGGLE_PANEL_VISIBILITY]: { isPanelVisible: 'boolean' },
      [EVENTS.COPY_LINKS]: {},
      [EVENTS.REQUEST_METRICS]: {},
      [EVENTS.METRICS_RETRIEVED]: { timingHistory: 'array' },
      [EVENTS.EXPORT_METRICS]: {},
      [EVENTS.METRICS_UPDATED]: { metrics: 'object' },
      [EVENTS.RECORD_POLL]: {
        postsProcessed: 'number',
        wasSkipped: 'boolean',
        containerFound: 'boolean',
        containerAttempted: 'boolean',
        pageType: 'string',
        isScanningStarted: 'boolean',
        isScanningStopped: 'boolean',
        cellInnerDivCount: 'number',
      },
      [EVENTS.RECORD_SCROLL]: { bottomReached: 'boolean' },
      [EVENTS.RECORD_SCAN]: {
        duration: 'number',
        postsProcessed: 'number',
        wasSkipped: 'boolean',
        interval: 'number',
        isAutoScrolling: 'boolean',
      },
      [EVENTS.RECORD_TAB_CHECK]: {
        duration: 'number',
        success: 'boolean',
        rateLimited: 'boolean',
        attempts: 'number',
      },
      [EVENTS.SET_INITIAL_WAIT_TIME]: { time: 'number' },
      [EVENTS.SET_POST_DENSITY]: { count: 'number' },
      [EVENTS.SAVE_METRICS]: {},
      [EVENTS.AUTO_DELETE_TOGGLE_REQUEST]: { enabled: 'boolean' },
      [EVENTS.AUTO_DELETE_STATUS]: {
        running: 'boolean',
        deleting: 'boolean',
        deletedCount: 'number',
        username: 'string|null',
        canRun: 'boolean',
        message: 'string',
      },
    };

    // src/dom/domUtils.js
    var domUtils = {
      querySelector(selector, doc = document) {
        return doc.querySelector(selector);
      },
      querySelectorAll(selector, doc = document) {
        return doc.querySelectorAll(selector);
      },
      createElement(tag, doc = document) {
        return doc.createElement(tag);
      },
      addEventListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
      },
      dispatchEvent(element, event) {
        element.dispatchEvent(event);
      },
      removeEventListener(element, event, handler, options = {}) {
        element.removeEventListener(event, handler, options);
      },
      closest(element, selector) {
        let current = element;
        while (current && !current.matches(selector)) {
          current = current.parentElement;
        }
        return current;
      },
      scrollBy(options, win = window) {
        win.scrollBy(options);
      },
      getScrollY(win = window) {
        return win.scrollY;
      },
      getInnerHeight(win = window) {
        return win.innerHeight;
      },
      POSTS_IN_DOC_SELECTOR: `div:not([aria-label="Timeline: Messages"]) > div > div[data-testid="cellInnerDiv"]`,
      POST_CONTAINER_SELECTOR: 'div[data-ghosted="posts-container"]',
      POSTS_IN_CONTAINER_SELECTOR: `div[data-ghosted="posts-container"] > div > div[data-testid="cellInnerDiv"]`,
      UNPROCESSED_POSTS_SELECTOR: `div[data-ghosted="posts-container"] > div > div[data-testid="cellInnerDiv"]:not([data-ghostedid])`,
    };

    // src/utils/MetricsMonitor.js
    var MetricsMonitor = class {
      constructor({ timing, log, storage, document: document2 }) {
        this.timing = { ...CONFIG.timing, ...timing };
        this.log = log || console.log.bind(console);
        this.storage = storage || { get: () => {}, set: () => {} };
        this.document = document2;
        this.startTime = performance.now();
        this.metrics = {
          totalPolls: 0,
          totalSkips: 0,
          totalPostsProcessed: 0,
          postsProcessedCount: 0,
          avgPostsProcessed: 0,
          totalScrolls: 0,
          bottomReachedCount: 0,
          totalScans: 0,
          totalScansManual: 0,
          totalScansAuto: 0,
          scanDurationSum: 0,
          scanDurationSumManual: 0,
          scanDurationSumAuto: 0,
          avgScanDuration: 0,
          avgScanDurationManual: 0,
          avgScanDurationAuto: 0,
          maxScanDuration: 0,
          totalTabChecks: 0,
          tabCheckDurationSum: 0,
          avgTabCheckDuration: 0,
          rateLimitCount: 0,
          cellInnerDivCount: 0,
          containerFinds: 0,
          containerDetectionAttempts: 0,
          containerFoundTimestamp: null,
          initialWaitTime: null,
          postDensity: 0,
          pageType: 'unknown',
          sessionStarts: 0,
          sessionStops: 0,
          sessionDurationSum: 0,
          avgSessionDuration: 0,
          currentSessionStart: null,
        };
        this.isPostScanningEnabled =
          CONFIG.timing.isPostScanningEnabledOnStartup;
        this.lastScanningState = null;
        this.initialWaitTimeSet = false;
        this.hasSetDensity = false;
        this.metricsHistory = [];
        this.pollWindow = [];
        this.scanWindowManual = [];
        this.scanWindowAuto = [];
        this.tabCheckWindow = [];
        this.AGGREGATION_THRESHOLD = 100;
        this.log('MetricsMonitor initialized');
        this.initEventListeners();
      }
      initEventListeners() {
        domUtils.addEventListener(
          this.document,
          EVENTS.INIT_COMPONENTS,
          ({ detail: { config } }) => {
            this.timing = { ...this.timing, ...config.timing };
          }
        );
        domUtils.addEventListener(
          this.document,
          EVENTS.RECORD_POLL,
          ({ detail }) => {
            this.recordPoll(detail);
          }
        );
        domUtils.addEventListener(
          this.document,
          EVENTS.RECORD_SCROLL,
          ({ detail }) => {
            this.recordScroll(detail);
          }
        );
        domUtils.addEventListener(
          this.document,
          EVENTS.RECORD_SCAN,
          ({ detail }) => {
            this.recordScan(detail);
          }
        );
        domUtils.addEventListener(
          this.document,
          EVENTS.RECORD_TAB_CHECK,
          ({ detail }) => {
            this.recordTabCheck(detail);
          }
        );
        domUtils.addEventListener(
          this.document,
          EVENTS.SET_INITIAL_WAIT_TIME,
          ({ detail }) => {
            this.setInitialWaitTime(detail.time);
          }
        );
        domUtils.addEventListener(
          this.document,
          EVENTS.SET_POST_DENSITY,
          ({ detail }) => {
            this.setPostDensity(detail.count);
          }
        );
        domUtils.addEventListener(this.document, EVENTS.REQUEST_METRICS, () => {
          domUtils.dispatchEvent(
            this.document,
            new CustomEvent(EVENTS.METRICS_RETRIEVED, {
              detail: { timingHistory: this.metricsHistory },
            })
          );
          this.log(
            'Dispatched xghosted:metrics-retrieved with entries:',
            this.metricsHistory.length
          );
        });
        domUtils.addEventListener(this.document, EVENTS.EXPORT_METRICS, () => {
          const nonAggregatedRecords = {
            polls: [...this.pollWindow],
            scansManual: [...this.scanWindowManual],
            scansAuto: [...this.scanWindowAuto],
            tabChecks: [...this.tabCheckWindow],
          };
          this.aggregateMetrics();
          const exportData = {
            aggregatedHistory: this.metricsHistory,
            nonAggregatedRecords,
          };
          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
          });
          const url = URL.createObjectURL(blob);
          const a = domUtils.createElement('a', this.document);
          a.href = url;
          a.download = 'xGhosted_timing_history.json';
          a.click();
          URL.revokeObjectURL(url);
          this.log('Exported timing history as JSON');
        });
        domUtils.addEventListener(
          this.document,
          EVENTS.SCANNING_STATE_UPDATED,
          ({ detail: { isPostScanningEnabled } }) => {
            this.isPostScanningEnabled = isPostScanningEnabled;
            if (CONFIG.debug) {
              this.log(
                `MetricsMonitor: Scanning state updated to ${isPostScanningEnabled}`
              );
            }
          }
        );
      }
      recordPoll({
        postsProcessed,
        wasSkipped,
        containerFound,
        containerAttempted,
        pageType,
        cellInnerDivCount,
      }) {
        if (!this.isPostScanningEnabled) {
          if (CONFIG.debug) {
            this.log('Skipping RECORD_POLL: Post scanning is disabled');
          }
          return;
        }
        if (this.lastScanningState === null) {
          this.lastScanningState = this.isPostScanningEnabled;
        } else if (this.isPostScanningEnabled !== this.lastScanningState) {
          if (this.isPostScanningEnabled) {
            this.metrics.sessionStarts++;
            this.metrics.currentSessionStart = performance.now();
            this.log(
              `Polling session started (count: ${this.metrics.sessionStarts})`
            );
          } else {
            if (this.metrics.currentSessionStart !== null) {
              this.metrics.sessionStops++;
              const duration =
                performance.now() - this.metrics.currentSessionStart;
              this.metrics.sessionDurationSum += duration;
              this.metrics.avgSessionDuration = this.metrics.sessionStops
                ? this.metrics.sessionDurationSum / this.metrics.sessionStops
                : 0;
              this.log(
                `Polling session stopped (duration: ${duration.toFixed(2)}ms)`
              );
              this.metrics.currentSessionStart = null;
            }
          }
          this.lastScanningState = this.isPostScanningEnabled;
        }
        this.metrics.totalPolls++;
        if (wasSkipped) this.metrics.totalSkips++;
        if (containerFound) {
          this.metrics.containerFinds++;
          if (!this.metrics.containerFoundTimestamp) {
            this.metrics.containerFoundTimestamp =
              performance.now() - this.startTime;
          }
        }
        if (containerAttempted) this.metrics.containerDetectionAttempts++;
        if (postsProcessed !== void 0) {
          this.metrics.totalPostsProcessed += postsProcessed;
          this.metrics.postsProcessedCount += postsProcessed > 0 ? 1 : 0;
          this.metrics.avgPostsProcessed = this.metrics.postsProcessedCount
            ? this.metrics.totalPostsProcessed /
              this.metrics.postsProcessedCount
            : 0;
        }
        this.metrics.pageType = pageType;
        this.metrics.cellInnerDivCount = cellInnerDivCount || 0;
        this.pollWindow.push({
          totalPolls: this.metrics.totalPolls,
          totalSkips: this.metrics.totalSkips,
          totalPostsProcessed: this.metrics.totalPostsProcessed,
          avgPostsProcessed: this.metrics.avgPostsProcessed,
          cellInnerDivCount: this.metrics.cellInnerDivCount,
          pageType: this.metrics.pageType,
          timestamp: performance.now(),
          skipped: false,
        });
        if (this.pollWindow.length >= this.AGGREGATION_THRESHOLD) {
          this.aggregateMetrics();
        }
        this.log(
          'Emitting xghosted:metrics-updated with totalPolls:',
          this.metrics.totalPolls
        );
        domUtils.dispatchEvent(
          this.document,
          new CustomEvent(EVENTS.METRICS_UPDATED, {
            detail: { metrics: this.metrics },
          })
        );
        this.logMetrics();
      }
      recordScroll({ bottomReached }) {
        if (!this.isPostScanningEnabled) {
          if (CONFIG.debug) {
            this.log('Skipping RECORD_SCROLL: Post scanning is disabled');
          }
          return;
        }
        this.metrics.totalScrolls++;
        if (bottomReached) this.metrics.bottomReachedCount++;
      }
      recordScan({
        duration,
        postsProcessed,
        wasSkipped,
        interval,
        isAutoScrolling,
      }) {
        if (!this.isPostScanningEnabled) {
          if (CONFIG.debug) {
            this.log('Skipping RECORD_SCAN: Post scanning is disabled');
          }
          return;
        }
        if (!isAutoScrolling && postsProcessed === 0) {
          if (CONFIG.debug) {
            this.log('Skipping RECORD_SCAN: no posts processed in manual mode');
          }
          return;
        }
        this.metrics.totalScans++;
        this.metrics.scanDurationSum += duration;
        this.metrics.avgScanDuration = this.metrics.totalScans
          ? this.metrics.scanDurationSum / this.metrics.totalScans
          : 0;
        this.metrics.maxScanDuration = Math.max(
          this.metrics.maxScanDuration,
          duration
        );
        if (isAutoScrolling) {
          this.metrics.totalScansAuto++;
          this.metrics.scanDurationSumAuto += duration;
          this.metrics.avgScanDurationAuto = this.metrics.totalScansAuto
            ? this.metrics.scanDurationSumAuto / this.metrics.totalScansAuto
            : 0;
          this.scanWindowAuto.push({ duration, interval });
        } else {
          this.metrics.totalScansManual++;
          this.metrics.scanDurationSumManual += duration;
          this.metrics.avgScanDurationManual = this.metrics.totalScansManual
            ? this.metrics.scanDurationSumManual / this.metrics.totalScansManual
            : 0;
          this.scanWindowManual.push({ duration, interval });
        }
        if (CONFIG.debug) {
          this.log(
            `Scan duration: ${duration.toFixed(2)}ms, interval: ${interval}ms`
          );
        }
        domUtils.dispatchEvent(
          this.document,
          new CustomEvent(EVENTS.METRICS_UPDATED, {
            detail: { metrics: this.metrics },
          })
        );
        this.logMetrics();
      }
      recordTabCheck({ duration, success, rateLimited, attempts }) {
        this.metrics.totalTabChecks++;
        this.metrics.tabCheckDurationSum += duration;
        this.metrics.avgTabCheckDuration = this.metrics.totalTabChecks
          ? this.metrics.tabCheckDurationSum / this.metrics.totalTabChecks
          : 0;
        if (rateLimited) this.metrics.rateLimitCount++;
        if (CONFIG.debug) {
          this.log(
            `Tab check duration: ${duration.toFixed(2)}ms, success: ${success}, rateLimited: ${rateLimited}, attempts: ${attempts}`
          );
        }
        this.tabCheckWindow.push({
          duration,
          success,
          rateLimited,
          attempts,
          timestamp: performance.now(),
        });
        domUtils.dispatchEvent(
          this.document,
          new CustomEvent(EVENTS.METRICS_UPDATED, {
            detail: { metrics: this.metrics },
          })
        );
        this.logMetrics();
      }
      aggregateMetrics() {
        const pollCount = this.pollWindow.length;
        if (pollCount === 0) return;
        const latestPoll = this.pollWindow[pollCount - 1];
        const avgPostsProcessed = this.metrics.postsProcessedCount
          ? this.metrics.totalPostsProcessed / this.metrics.postsProcessedCount
          : 0;
        const avgScanDurationManual =
          this.scanWindowManual.length > 0
            ? this.scanWindowManual.reduce(
                (sum, entry) => sum + entry.duration,
                0
              ) / this.scanWindowManual.length
            : 0;
        const avgScanIntervalManual =
          this.scanWindowManual.length > 0
            ? this.scanWindowManual.reduce(
                (sum, entry) => sum + entry.interval,
                0
              ) / this.scanWindowManual.length
            : 0;
        const avgScanDurationAuto =
          this.scanWindowAuto.length > 0
            ? this.scanWindowAuto.reduce(
                (sum, entry) => sum + entry.duration,
                0
              ) / this.scanWindowAuto.length
            : 0;
        const avgScanIntervalAuto =
          this.scanWindowAuto.length > 0
            ? this.scanWindowAuto.reduce(
                (sum, entry) => sum + entry.interval,
                0
              ) / this.scanWindowAuto.length
            : 0;
        const avgTabCheckDuration =
          this.tabCheckWindow.length > 0
            ? this.tabCheckWindow.reduce(
                (sum, entry) => sum + entry.duration,
                0
              ) / this.tabCheckWindow.length
            : 0;
        const rateLimitedCount = this.tabCheckWindow.filter(
          (entry) => entry.rateLimited
        ).length;
        this.metricsHistory.push({
          totalPolls: this.metrics.totalPolls,
          totalSkips: this.metrics.totalSkips,
          totalPostsProcessed: this.metrics.totalPostsProcessed,
          avgPostsProcessed,
          totalScrolls: this.metrics.totalScrolls,
          bottomReachedCount: this.metrics.bottomReachedCount,
          totalScans: this.metrics.totalScans,
          totalScansManual: this.metrics.totalScansManual,
          totalScansAuto: this.metrics.totalScansAuto,
          scanDurationSum: this.metrics.scanDurationSum,
          scanDurationSumManual: this.metrics.scanDurationSumManual,
          scanDurationSumAuto: this.metrics.scanDurationSumAuto,
          avgScanDuration: this.metrics.avgScanDuration,
          avgScanDurationManual,
          avgScanDurationAuto,
          avgScanIntervalManual,
          avgScanIntervalAuto,
          maxScanDuration: this.metrics.maxScanDuration,
          totalTabChecks: this.metrics.totalTabChecks,
          tabCheckDurationSum: this.metrics.tabCheckDurationSum,
          avgTabCheckDuration,
          rateLimitCount: rateLimitedCount,
          cellInnerDivCount: latestPoll.cellInnerDivCount,
          postDensity: this.metrics.postDensity,
          initialWaitTime: this.metrics.initialWaitTime,
          sessionStarts: this.metrics.sessionStarts,
          sessionStops: this.metrics.sessionStops,
          avgSessionDuration: this.metrics.avgSessionDuration,
          pageType: latestPoll.pageType,
          timestamp: performance.now(),
          pollCount,
          scanCountManual: this.scanWindowManual.length,
          scanCountAuto: this.scanWindowAuto.length,
          tabCheckCount: this.tabCheckWindow.length,
        });
        if (this.metricsHistory.length > 100) {
          this.metricsHistory.shift();
        }
        this.pollWindow = [];
        this.scanWindowManual = [];
        this.scanWindowAuto = [];
        this.tabCheckWindow = [];
      }
      logMetrics() {}
      setInitialWaitTime(time) {
        if (!this.initialWaitTimeSet) {
          this.metrics.initialWaitTime = time;
          this.initialWaitTimeSet = true;
          this.log(`Initial wait time set: ${time}ms`);
        }
      }
      setPostDensity(count) {
        if (!this.hasSetDensity) {
          this.metrics.postDensity = count;
          this.hasSetDensity = true;
          this.log(`Post density set: ${count}`);
        }
      }
    };
    return MetricsMonitor;
  })();

  // --- Inject Styles ---

  window.xGhostedStyles = window.xGhostedStyles || {};
  window.xGhostedStyles.modal = `.modal * {
  box-sizing: border-box;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  max-height: calc(100vh - 100px);
  background: var(--modal-bg);
  color: var(--modal-text);
  border: 2px solid var(--modal-border);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 255, 255, 0.2);
  padding: 12px;
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow-x: hidden;
}

.modal-file-input-container {
  width: 100%;
  max-width: 426px;
}

.modal-file-input {
  width: 100%;
  max-width: 100%;
  padding: 8px 12px;
  margin-bottom: 12px;
  background: var(--modal-button-bg);
  color: var(--modal-button-text);
  border: 2px solid var(--modal-border);
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 255, 255, 0.2);
}

.modal-textarea {
  width: 100%;
  max-width: 426px;
  height: 150px;
  padding: 8px 12px;
  margin-bottom: 12px;
  background: var(--modal-button-bg);
  color: var(--modal-button-text);
  border: 2px solid var(--modal-border);
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 255, 255, 0.2);
}

.modal-textarea::placeholder {
  color: var(--placeholder);
  opacity: 1;
}

.modal-button-container {
  display: flex;
  justify-content: flex-end;
}

.modal-button-container > button:not(:last-child) {
  margin-right: 10px;
}

.modal-button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--modal-button-bg);
  color: var(--modal-button-text);
  border: 2px solid var(--modal-border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 255, 255, 0.2);
  transition: background 0.2s ease;
}

.modal-button:hover {
  background: var(--modal-hover-bg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 255, 255, 0.3);
}

.modal-button:active {
  transform: scale(0.95);
}`;
  window.xGhostedStyles.panel = `.toolbar {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 8px;
}

.toolbar > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin-left: 12px;
}

.toolbar > div > button:not(:last-child) {
  margin-right: 12px;
}

.tools-section {
  /* No opacity to prevent affecting children */
}

.tools-section > div > div:first-child {
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

.manual-check-separator {
  border-bottom: 2px solid var(--border-color);
  margin: 8px 0;
}

.manual-check-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
}

.content-wrapper {
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  padding-right: 4px;
  padding-left: 8px;
  padding-top: 0;
}

.panel-button {
  background: linear-gradient(
    to bottom,
    var(--button-bg),
    color-mix(in srgb, var(--button-bg) 70%, #000000)
  );
  color: var(--button-text);
  border: 2px solid var(--border-color);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition:
    background 0.2s ease,
    transform 0.1s ease;
  display: flex;
  align-items: center;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.2),
    0 0 8px rgba(255, 255, 255, 0.2);
  max-width: 160px;
  text-align: center;
}

.panel-button:hover {
  background: var(--hover-bg);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.2),
    0 0 8px rgba(255, 255, 255, 0.3);
}

.panel-button:active {
  transform: scale(0.95);
}

.scanning-stopped {
  border: 2px solid #ffa500;
}

.custom-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-button {
  width: 100%;
  justify-content: space-between;
  font-size: 14px;
  padding: 8px 12px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--button-bg, #3a4a5b);
  color: var(--button-text);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.2),
    0 0 8px rgba(255, 255, 255, 0.2);
  z-index: 1000;
  margin-top: 4px;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  /* Bolder text for better readability */
  background-color: var(--button-bg, #3a4a5b);
  color: var(--button-text);
}

.dropdown-item:hover {
  background-color: var(--hover-bg);
  color: var(--button-text);
}

.status-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-color);
}

.link-row {
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  column-gap: 8px;
  /* Adds a consistent gap between columns */
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  justify-self: center;
}

.status-eyeball {
  font-size: 16px;
  color: rgb(29, 155, 240);
  cursor: pointer;
  line-height: 20px;
  justify-self: center;
  /* Centers the eyeball in the column */
}

.status-problem {
  background-color: red;
}

.status-problem-adjacent {
  background-color: coral;
}

.problem-links-wrapper {
  padding: 0 8px;
  max-height: 300px; /* Added to limit vertical growth */
  overflow-y: auto; /* Ensure scrollbar appears when content exceeds max-height */
}

.problem-links-wrapper::-webkit-scrollbar {
  width: 6px;
}

.problem-links-wrapper::-webkit-scrollbar-thumb {
  background: var(--scroll-color);
  border-radius: 3px;
}

.problem-links-wrapper::-webkit-scrollbar-track {
  background: var(--bg-color);
}

.link-item {
  padding: 2px 0;
  overflow-wrap: break-word;
  word-break: break-all;
}

.link-item a {
  color: var(--text-color);
  text-decoration: none;
}

.link-item a:hover {
  text-decoration: underline;
  color: var(--hover-bg);
}

.problem-posts-header {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 8px;
}

.panel-button i {
  font-size: 16px;
  line-height: 1;
}

.drag-handle {
  cursor: move;
  font-size: 14px;
  vertical-align: middle;
}

.header-text-group {
  display: flex;
  align-items: center;
  gap: 12px;
}`;
  window.xGhostedStyles.splash = `.splash-panel * {
  box-sizing: border-box;
}

.splash-panel {
  cursor: move;
}

.splash-panel button {
  cursor: pointer;
}

.splash-panel.dragging {
  user-select: none;
}`;

  // Initialize core components with document and configuration
  const postsManager = new window.ProcessedPostsManager({
    document,
    storage: { get: GM_getValue, set: GM_setValue },
    log,
    linkPrefix: CONFIG.linkPrefix,
    persistProcessedPosts: CONFIG.persistProcessedPosts,
  });
  const metricsMonitor = new window.MetricsMonitor({
    document,
    timing: CONFIG.timing,
    log,
    storage: { get: GM_getValue, set: GM_setValue },
  });
  const xGhosted = new window.XGhosted({
    document,
    window,
    config: { ...CONFIG, log },
  });

  // Emit INIT_COMPONENTS event for loose coupling
  document.dispatchEvent(
    new CustomEvent(EVENTS.INIT_COMPONENTS, { detail: { config: CONFIG } })
  );

  // Optionally initialize PanelManager if Preact is available
  let panelManager;
  try {
    if (window.preact && window.preact.h) {
      panelManager = new window.PanelManager(
        document,
        '0.6.2',
        'dim',
        CONFIG.linkPrefix,
        { get: GM_getValue, set: GM_setValue },
        log
      );
      log('GUI Panel initialized successfully');
    } else {
      log('Preact not available, running without UI');
    }
  } catch (error) {
    log(
      `Failed to initialize GUI Panel: ${error.message}. Continuing without panel.`
    );
  }

  // Log Font Awesome status
  if (typeof window.FontAwesome === 'undefined') {
    log(
      'xGhosted: Font Awesome failed to load, icons may not display correctly'
    );
  }

  // Start the core functionality
  xGhosted.init();
})();