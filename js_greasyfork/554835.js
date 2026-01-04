// ==UserScript==
// @name         Instagram Content Filter Pro - Enterprise Edition
// @namespace    https://github.com/rowhanm
// @version      1.0.0
// @description  Advanced content filtering system for Instagram with robust detection, performance optimization, and comprehensive logging
// @author       Rohan M (Enhanced Edition)
// @match        https://www.instagram.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554835/Instagram%20Content%20Filter%20Pro%20-%20Enterprise%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/554835/Instagram%20Content%20Filter%20Pro%20-%20Enterprise%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // CONFIGURATION MODULE
    // ============================================================================
    const CONFIG = {
        // Feature flags
        VERBOSE_LOGGING: true,           // Enable detailed console logging
        PERFORMANCE_MONITORING: true,    // Track execution metrics
        DEBUG_MODE: false,               // Additional debug information
        VISUAL_INDICATORS: false,        // Show visual indicators on filtered posts

        // UI Configuration
        UI: {
            ENABLED: true,               // Show floating status widget
            POSITION: 'top-right',       // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
            COMPACT_MODE: true,          // Start in compact mode
            DRAGGABLE: true,             // Allow user to drag the widget
            OPACITY: 0.95,               // Widget opacity (0.0 - 1.0)
            AUTO_HIDE_DELAY: 0,          // Auto-hide after N seconds (0 = never)
            SHOW_TOAST_NOTIFICATIONS: true, // Show toast when posts are filtered
        },

        // Auto-scroll configuration
        AUTO_SCROLL: {
            ENABLED: false,              // Auto-scroll past filtered content
            SPEED: 'smooth',             // 'smooth' or 'instant'
            DELAY: 500,                  // Delay before scrolling (ms)
        },

        // Whitelist functionality
        WHITELIST: {
            ENABLED: true,               // Enable whitelist for specific accounts
            ACCOUNTS: [],                // Array of usernames to never filter (e.g., ['username1', 'username2'])
        },

        // Filter specific content types
        CONTENT_TYPES: {
            FILTER_REELS: false,         // Also filter Reels with these patterns
            FILTER_STORIES: false,       // Also filter Stories (experimental)
            FILTER_EXPLORE: true,        // Filter in Explore page
        },

        // Detection patterns (case-insensitive, with internationalization support)
        FILTER_PATTERNS: {
            // Exact match patterns
            EXACT_MATCH: [
                'follow',
                'sponsored',
                'patrocinado',              // Spanish
                'sponsorisé',               // French
                'gesponsert',               // German
                'スポンサー',                // Japanese
                '赞助',                      // Chinese
            ],
            // Partial match patterns
            PARTIAL_MATCH: [
                'suggested for you',
                'suggested posts',
                'recomendado para ti',      // Spanish
                'suggéré pour vous',        // French
                'vorgeschlagen für dich',   // German
                'おすすめ',                 // Japanese
                '为你推荐',                 // Chinese
            ]
        },

        // Selectors (Instagram may change these)
        SELECTORS: {
            POST_ARTICLE: 'article[role="presentation"], article',
            POST_CONTAINER: 'div[role="presentation"]',
            MAIN_FEED: 'main[role="main"], main',
            TEXT_ELEMENTS: 'span, div, section, h2, h3, a, button',
        },

        // Performance tuning
        DEBOUNCE_DELAY: 150,              // ms to wait before processing mutations
        BATCH_SIZE: 10,                   // Process posts in batches
        MAX_RETRY_ATTEMPTS: 3,            // Retry failed operations
        OBSERVER_THROTTLE: 100,           // Throttle observer callbacks
        CACHE_DURATION: 5000,             // Cache post analysis results (ms)

        // Safety thresholds
        MAX_POSTS_PER_SCAN: 100,          // Prevent runaway processing
        MAX_TEXT_LENGTH: 10000,           // Skip posts with excessive text
        WATCHDOG_TIMEOUT: 30000,          // Reset if no activity (ms)
    };

    // ============================================================================
    // LOGGING MODULE
    // ============================================================================
    class Logger {
        constructor(moduleName) {
            this.moduleName = moduleName;
            this.logHistory = [];
            this.maxHistorySize = 1000;
            this.startTime = performance.now();
            this.stats = {
                postsProcessed: 0,
                postsFiltered: 0,
                errors: 0,
                warnings: 0,
                observerCallbacks: 0,
                cacheHits: 0,
                cacheMisses: 0,
            };
        }

        _formatMessage(level, message, data = null) {
            const timestamp = new Date().toISOString();
            const elapsed = ((performance.now() - this.startTime) / 1000).toFixed(3);
            const prefix = `[IG-Filter][${level}][${this.moduleName}][${elapsed}s]`;

            return { prefix, message, data, timestamp, level };
        }

        _log(level, message, data = null, color = '') {
            if (!CONFIG.VERBOSE_LOGGING && level === 'DEBUG') return;
            if (!CONFIG.DEBUG_MODE && level === 'TRACE') return;

            const formatted = this._formatMessage(level, message, data);
            const logEntry = `${formatted.prefix} ${formatted.message}`;

            // Store in history
            this.logHistory.push({ ...formatted, elapsed: performance.now() - this.startTime });
            if (this.logHistory.length > this.maxHistorySize) {
                this.logHistory.shift();
            }

            // Console output with color
            if (data) {
                console.log(`%c${logEntry}`, `color: ${color}`, data);
            } else {
                console.log(`%c${logEntry}`, `color: ${color}`);
            }
        }

        info(message, data = null) {
            this._log('INFO', message, data, '#2196F3');
        }

        success(message, data = null) {
            this._log('SUCCESS', message, data, '#4CAF50');
        }

        warn(message, data = null) {
            this.stats.warnings++;
            this._log('WARN', message, data, '#FF9800');
        }

        error(message, data = null) {
            this.stats.errors++;
            this._log('ERROR', message, data, '#F44336');
        }

        debug(message, data = null) {
            this._log('DEBUG', message, data, '#9E9E9E');
        }

        trace(message, data = null) {
            this._log('TRACE', message, data, '#607D8B');
        }

        getStats() {
            return { ...this.stats, uptime: ((performance.now() - this.startTime) / 1000).toFixed(2) };
        }

        printStats() {
            const stats = this.getStats();
            console.group('%c📊 Instagram Filter Statistics', 'color: #9C27B0; font-weight: bold; font-size: 14px;');
            console.table(stats);
            console.log(`Efficiency: ${((stats.postsFiltered / stats.postsProcessed) * 100 || 0).toFixed(2)}% filtered`);
            console.groupEnd();
        }

        exportLogs() {
            return JSON.stringify(this.logHistory, null, 2);
        }
    }

    const logger = new Logger('Core');

    // ============================================================================
    // UTILITY MODULE
    // ============================================================================
    const Utils = {
        /**
         * Debounce function execution
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle function execution
         */
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Normalize text for comparison (lowercase, trim, normalize unicode)
         */
        normalizeText(text) {
            if (!text || typeof text !== 'string') return '';
            return text
                .trim()
                .toLowerCase()
                .normalize('NFKC')  // Normalize unicode characters
                .replace(/\s+/g, ' '); // Normalize whitespace
        },

        /**
         * Generate unique identifier for elements
         */
        generateElementId(element) {
            try {
                const rect = element.getBoundingClientRect();
                const hash = `${element.tagName}-${rect.top.toFixed(0)}-${rect.left.toFixed(0)}-${element.childElementCount}`;
                return hash;
            } catch (e) {
                return `fallback-${Math.random().toString(36).substr(2, 9)}`;
            }
        },

        /**
         * Safely get text content from element
         */
        getTextContent(element) {
            try {
                if (!element) return '';
                const text = element.innerText || element.textContent || '';
                return text.length > CONFIG.MAX_TEXT_LENGTH ? '' : text;
            } catch (e) {
                logger.debug('Failed to get text content', e.message);
                return '';
            }
        },

        /**
         * Check if element is visible
         */
        isElementVisible(element) {
            try {
                if (!element) return false;
                const style = window.getComputedStyle(element);
                return style.display !== 'none' &&
                       style.visibility !== 'hidden' &&
                       style.opacity !== '0';
            } catch (e) {
                return false;
            }
        },

        /**
         * Sleep/delay utility
         */
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    // ============================================================================
    // CACHE MODULE
    // ============================================================================
    class PostCache {
        constructor() {
            this.cache = new Map();
            this.logger = new Logger('Cache');
        }

        set(key, value) {
            this.cache.set(key, {
                value,
                timestamp: Date.now()
            });
            this.logger.trace(`Cache set: ${key}`);
        }

        get(key) {
            const entry = this.cache.get(key);
            if (!entry) {
                logger.stats.cacheMisses++;
                return null;
            }

            // Check if expired
            if (Date.now() - entry.timestamp > CONFIG.CACHE_DURATION) {
                this.cache.delete(key);
                logger.stats.cacheMisses++;
                return null;
            }

            logger.stats.cacheHits++;
            return entry.value;
        }

        has(key) {
            return this.get(key) !== null;
        }

        clear() {
            const size = this.cache.size;
            this.cache.clear();
            this.logger.info(`Cache cleared: ${size} entries`);
        }

        prune() {
            const now = Date.now();
            let pruned = 0;
            for (const [key, entry] of this.cache.entries()) {
                if (now - entry.timestamp > CONFIG.CACHE_DURATION) {
                    this.cache.delete(key);
                    pruned++;
                }
            }
            if (pruned > 0) {
                this.logger.debug(`Pruned ${pruned} expired cache entries`);
            }
        }

        getSize() {
            return this.cache.size;
        }
    }

    const postCache = new PostCache();

    // ============================================================================
    // TOAST NOTIFICATION MODULE
    // ============================================================================
    class ToastNotification {
        constructor() {
            this.logger = new Logger('Toast');
            this.queue = [];
            this.isShowing = false;
        }

        show(message, type = 'info', duration = 3000) {
            if (!CONFIG.UI.SHOW_TOAST_NOTIFICATIONS) return;

            this.queue.push({ message, type, duration });
            if (!this.isShowing) {
                this.showNext();
            }
        }

        showNext() {
            if (this.queue.length === 0) {
                this.isShowing = false;
                return;
            }

            this.isShowing = true;
            const { message, type, duration } = this.queue.shift();

            const toast = document.createElement('div');
            toast.className = 'ig-filter-toast';
            toast.setAttribute('data-type', type);

            const icons = {
                success: '✅',
                info: 'ℹ️',
                warning: '⚠️',
                error: '❌',
                filter: '🛡️'
            };

            toast.innerHTML = `
                <style>
                    .ig-filter-toast {
                        position: fixed;
                        bottom: 30px;
                        right: 30px;
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        font-size: 13px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        z-index: 999998;
                        animation: ig-toast-slide-in 0.3s ease;
                        backdrop-filter: blur(10px);
                        border-left: 3px solid #2196F3;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        max-width: 300px;
                    }

                    .ig-filter-toast[data-type="success"] {
                        border-left-color: #4CAF50;
                    }

                    .ig-filter-toast[data-type="warning"] {
                        border-left-color: #FF9800;
                    }

                    .ig-filter-toast[data-type="error"] {
                        border-left-color: #F44336;
                    }

                    .ig-filter-toast[data-type="filter"] {
                        border-left-color: #9C27B0;
                    }

                    @keyframes ig-toast-slide-in {
                        from {
                            transform: translateX(400px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }

                    @keyframes ig-toast-slide-out {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(400px);
                            opacity: 0;
                        }
                    }

                    .ig-filter-toast.hiding {
                        animation: ig-toast-slide-out 0.3s ease forwards;
                    }
                </style>
                <span class="ig-toast-icon">${icons[type] || icons.info}</span>
                <span class="ig-toast-message">${message}</span>
            `;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('hiding');
                setTimeout(() => {
                    toast.remove();
                    this.showNext();
                }, 300);
            }, duration);
        }

        success(message, duration) {
            this.show(message, 'success', duration);
        }

        info(message, duration) {
            this.show(message, 'info', duration);
        }

        warning(message, duration) {
            this.show(message, 'warning', duration);
        }

        error(message, duration) {
            this.show(message, 'error', duration);
        }

        filter(count) {
            this.show(`Filtered ${count} post${count !== 1 ? 's' : ''}`, 'filter', 2000);
        }
    }

    const toast = new ToastNotification();

    // ============================================================================
    // WHITELIST MODULE
    // ============================================================================
    class Whitelist {
        constructor() {
            this.logger = new Logger('Whitelist');
            this.accounts = new Set(CONFIG.WHITELIST.ACCOUNTS.map(a => a.toLowerCase()));
        }

        isWhitelisted(postElement) {
            if (!CONFIG.WHITELIST.ENABLED || this.accounts.size === 0) {
                return false;
            }

            try {
                // Look for username links in the post
                const links = postElement.querySelectorAll('a[href*="/"]');
                for (const link of links) {
                    const href = link.getAttribute('href');
                    if (href) {
                        // Extract username from href (e.g., /username/)
                        const match = href.match(/^\/([^\/\?]+)\/?/);
                        if (match && match[1]) {
                            const username = match[1].toLowerCase();
                            if (this.accounts.has(username)) {
                                this.logger.debug(`Post whitelisted for user: ${username}`);
                                return true;
                            }
                        }
                    }
                }
            } catch (error) {
                this.logger.error('Whitelist check failed', error);
            }

            return false;
        }

        add(username) {
            const normalized = username.toLowerCase().replace('@', '');
            this.accounts.add(normalized);
            CONFIG.WHITELIST.ACCOUNTS.push(normalized);
            this.logger.success(`Added to whitelist: ${normalized}`);

            // Clear cache and rescan
            postCache.clear();
            filter.reset();
            toast.success(`@${normalized} whitelisted`);
        }

        remove(username) {
            const normalized = username.toLowerCase().replace('@', '');
            this.accounts.delete(normalized);
            CONFIG.WHITELIST.ACCOUNTS = CONFIG.WHITELIST.ACCOUNTS.filter(
                a => a.toLowerCase() !== normalized
            );
            this.logger.info(`Removed from whitelist: ${normalized}`);
            toast.info(`@${normalized} removed from whitelist`);
        }

        list() {
            return Array.from(this.accounts);
        }

        clear() {
            this.accounts.clear();
            CONFIG.WHITELIST.ACCOUNTS = [];
            this.logger.info('Whitelist cleared');
            toast.info('Whitelist cleared');
        }
    }

    const whitelist = new Whitelist();

    // ============================================================================
    // CONTENT ANALYZER MODULE
    // ============================================================================
    class ContentAnalyzer {
        constructor() {
            this.logger = new Logger('Analyzer');
            this.patterns = this._compilePatterns();
        }

        _compilePatterns() {
            const patterns = {
                exact: CONFIG.FILTER_PATTERNS.EXACT_MATCH.map(p =>
                    Utils.normalizeText(p)
                ),
                partial: CONFIG.FILTER_PATTERNS.PARTIAL_MATCH.map(p =>
                    Utils.normalizeText(p)
                )
            };
            this.logger.debug('Patterns compiled', patterns);
            return patterns;
        }

        /**
         * Analyze post content and determine if it should be filtered
         */
        analyzePost(postElement) {
            const startTime = performance.now();
            const elementId = Utils.generateElementId(postElement);

            try {
                // Check cache first
                if (postCache.has(elementId)) {
                    this.logger.trace(`Cache hit for post ${elementId}`);
                    return postCache.get(elementId);
                }

                // Extract all text content
                const textElements = postElement.querySelectorAll(CONFIG.SELECTORS.TEXT_ELEMENTS);
                const textContents = [];

                for (const element of textElements) {
                    const text = Utils.getTextContent(element);
                    if (text) {
                        textContents.push({
                            text: text,
                            normalized: Utils.normalizeText(text),
                            element: element
                        });
                    }
                }

                // Perform pattern matching
                const result = this._matchPatterns(textContents, postElement);

                // Cache the result
                postCache.set(elementId, result);

                const duration = (performance.now() - startTime).toFixed(2);
                if (result.shouldFilter) {
                    this.logger.success(
                        `Post filtered in ${duration}ms: ${result.reason}`,
                        { matchedText: result.matchedText, element: postElement }
                    );
                } else {
                    this.logger.trace(`Post analyzed in ${duration}ms: Clean`);
                }

                return result;

            } catch (error) {
                this.logger.error('Analysis failed', { error: error.message, elementId });
                // Fail open - don't filter if analysis fails
                return { shouldFilter: false, reason: 'analysis_error', error: error.message };
            }
        }

        _matchPatterns(textContents, postElement) {
            // Check exact matches first (more efficient)
            for (const content of textContents) {
                for (const pattern of this.patterns.exact) {
                    if (content.normalized === pattern) {
                        return {
                            shouldFilter: true,
                            reason: 'exact_match',
                            pattern: pattern,
                            matchedText: content.text,
                            matchedElement: content.element
                        };
                    }
                }
            }

            // Check partial matches
            for (const content of textContents) {
                for (const pattern of this.patterns.partial) {
                    if (content.normalized.includes(pattern)) {
                        return {
                            shouldFilter: true,
                            reason: 'partial_match',
                            pattern: pattern,
                            matchedText: content.text,
                            matchedElement: content.element
                        };
                    }
                }
            }

            return { shouldFilter: false, reason: 'no_match' };
        }

        /**
         * Update patterns dynamically
         */
        updatePatterns(newPatterns) {
            if (newPatterns.EXACT_MATCH) {
                CONFIG.FILTER_PATTERNS.EXACT_MATCH = newPatterns.EXACT_MATCH;
            }
            if (newPatterns.PARTIAL_MATCH) {
                CONFIG.FILTER_PATTERNS.PARTIAL_MATCH = newPatterns.PARTIAL_MATCH;
            }
            this.patterns = this._compilePatterns();
            postCache.clear();
            this.logger.info('Patterns updated and cache cleared');
        }
    }

    const analyzer = new ContentAnalyzer();

    // ============================================================================
    // POST FILTER MODULE
    // ============================================================================
    class PostFilter {
        constructor() {
            this.logger = new Logger('Filter');
            this.processedPosts = new WeakSet();
            this.filteredPosts = new WeakSet();
        }

        /**
         * Filter a single post
         */
        filterPost(postElement) {
            if (!postElement || !(postElement instanceof Element)) {
                this.logger.warn('Invalid post element provided');
                return false;
            }

            // Skip if already processed
            if (this.processedPosts.has(postElement)) {
                this.logger.trace('Post already processed, skipping');
                return false;
            }

            this.processedPosts.add(postElement);
            logger.stats.postsProcessed++;

            // Check whitelist first
            if (whitelist.isWhitelisted(postElement)) {
                this.logger.debug('Post whitelisted, skipping filter');
                return false;
            }

            // Analyze the post
            const analysis = analyzer.analyzePost(postElement);

            if (analysis.shouldFilter) {
                this._hidePost(postElement, analysis);
                this.filteredPosts.add(postElement);
                logger.stats.postsFiltered++;

                // Auto-scroll if enabled
                if (CONFIG.AUTO_SCROLL.ENABLED) {
                    this._autoScroll(postElement);
                }

                return true;
            }

            return false;
        }

        /**
         * Hide a post with various techniques
         */
        _hidePost(postElement, analysis) {
            try {
                // Primary hiding method
                postElement.style.cssText = `
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    overflow: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    position: absolute !important;
                    z-index: -9999 !important;
                `;

                // Add data attribute for debugging
                postElement.setAttribute('data-ig-filtered', 'true');
                postElement.setAttribute('data-ig-reason', analysis.reason);
                postElement.setAttribute('data-ig-pattern', analysis.pattern || '');

                // Visual indicator (if enabled)
                if (CONFIG.VISUAL_INDICATORS) {
                    this._addVisualIndicator(postElement, analysis);
                }

                this.logger.debug('Post hidden successfully', {
                    reason: analysis.reason,
                    pattern: analysis.pattern
                });

            } catch (error) {
                this.logger.error('Failed to hide post', error);
                // Fallback method
                try {
                    postElement.remove();
                    this.logger.warn('Used fallback method: element removed');
                } catch (e) {
                    this.logger.error('All hiding methods failed', e);
                }
            }
        }

        _addVisualIndicator(postElement, analysis) {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(255, 0, 0, 0.1);
                color: red;
                padding: 5px;
                font-size: 12px;
                z-index: 10000;
            `;
            indicator.textContent = `[FILTERED: ${analysis.reason}]`;
            postElement.style.position = 'relative';
            postElement.insertBefore(indicator, postElement.firstChild);
        }

        _autoScroll(postElement) {
            try {
                setTimeout(() => {
                    const rect = postElement.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;

                    // If post takes up significant viewport space, scroll past it
                    if (rect.height > viewportHeight * 0.3) {
                        window.scrollBy({
                            top: rect.height,
                            behavior: CONFIG.AUTO_SCROLL.SPEED
                        });
                        this.logger.debug('Auto-scrolled past filtered post');
                    }
                }, CONFIG.AUTO_SCROLL.DELAY);
            } catch (error) {
                this.logger.error('Auto-scroll failed', error);
            }
        }

        /**
         * Process multiple posts in batches
         */
        async filterPostsBatch(posts) {
            const postsArray = Array.from(posts);
            this.logger.info(`Processing batch of ${postsArray.length} posts`);

            let filtered = 0;
            const batchSize = CONFIG.BATCH_SIZE;

            for (let i = 0; i < postsArray.length; i += batchSize) {
                const batch = postsArray.slice(i, i + batchSize);

                for (const post of batch) {
                    if (this.filterPost(post)) {
                        filtered++;
                    }
                }

                // Yield to browser between batches
                if (i + batchSize < postsArray.length) {
                    await Utils.sleep(0);
                }
            }

            this.logger.info(`Batch complete: ${filtered}/${postsArray.length} filtered`);

            // Show toast for batch if any were filtered
            if (filtered > 0 && CONFIG.UI.SHOW_TOAST_NOTIFICATIONS) {
                toast.filter(filtered);
            }

            return filtered;
        }

        /**
         * Scan and filter all posts in the feed
         */
        async scanFeed() {
            const startTime = performance.now();
            this.logger.info('Starting feed scan...');

            try {
                const posts = document.querySelectorAll(CONFIG.SELECTORS.POST_ARTICLE);

                if (posts.length === 0) {
                    this.logger.warn('No posts found in feed');
                    return 0;
                }

                if (posts.length > CONFIG.MAX_POSTS_PER_SCAN) {
                    this.logger.warn(`Post count exceeds maximum (${posts.length}), limiting to ${CONFIG.MAX_POSTS_PER_SCAN}`);
                }

                const postsToProcess = Array.from(posts).slice(0, CONFIG.MAX_POSTS_PER_SCAN);
                const filtered = await this.filterPostsBatch(postsToProcess);

                const duration = ((performance.now() - startTime) / 1000).toFixed(2);
                this.logger.success(`Feed scan complete in ${duration}s: ${filtered} posts filtered`);

                return filtered;

            } catch (error) {
                this.logger.error('Feed scan failed', error);
                return 0;
            }
        }

        isFiltered(postElement) {
            return this.filteredPosts.has(postElement);
        }

        reset() {
            this.processedPosts = new WeakSet();
            this.filteredPosts = new WeakSet();
            postCache.clear();
            this.logger.info('Filter state reset');
        }
    }

    const filter = new PostFilter();

    // ============================================================================
    // MUTATION OBSERVER MODULE
    // ============================================================================
    class FeedObserver {
        constructor() {
            this.logger = new Logger('Observer');
            this.observer = null;
            this.isObserving = false;
            this.mutationQueue = [];
            this.processingQueue = false;
            this.lastActivity = Date.now();

            // Create throttled and debounced handlers
            this.throttledHandler = Utils.throttle(
                () => this.processMutations(),
                CONFIG.OBSERVER_THROTTLE
            );

            this.debouncedHandler = Utils.debounce(
                () => this.processMutations(),
                CONFIG.DEBOUNCE_DELAY
            );
        }

        /**
         * Initialize and start observing
         */
        start() {
            if (this.isObserving) {
                this.logger.warn('Observer already running');
                return;
            }

            const mainFeed = this._findMainFeed();
            if (!mainFeed) {
                this.logger.error('Main feed element not found, retrying in 2s...');
                setTimeout(() => this.start(), 2000);
                return;
            }

            this._createObserver();
            this.observer.observe(mainFeed, {
                childList: true,
                subtree: true,
                attributes: false, // Don't observe attributes for performance
            });

            this.isObserving = true;
            this.logger.success('Observer started successfully', mainFeed);

            // Start watchdog timer
            this._startWatchdog();
        }

        _findMainFeed() {
            const selectors = CONFIG.SELECTORS.MAIN_FEED.split(',').map(s => s.trim());

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    this.logger.debug(`Main feed found with selector: ${selector}`);
                    return element;
                }
            }

            // Fallback: try to find by role
            const roleMain = document.querySelector('[role="main"]');
            if (roleMain) {
                this.logger.debug('Main feed found by role attribute');
                return roleMain;
            }

            return null;
        }

        _createObserver() {
            this.observer = new MutationObserver((mutations) => {
                logger.stats.observerCallbacks++;
                this.lastActivity = Date.now();

                // Add mutations to queue
                this.mutationQueue.push(...mutations);

                // Use both throttle and debounce
                this.throttledHandler();
                this.debouncedHandler();
            });
        }

        async processMutations() {
            if (this.processingQueue || this.mutationQueue.length === 0) {
                return;
            }

            this.processingQueue = true;
            const mutations = [...this.mutationQueue];
            this.mutationQueue = [];

            try {
                const addedPosts = new Set();

                // Extract all added article nodes
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if node itself is an article
                            if (this._isPostElement(node)) {
                                addedPosts.add(node);
                            }
                            // Check children
                            const childPosts = node.querySelectorAll?.(CONFIG.SELECTORS.POST_ARTICLE);
                            if (childPosts) {
                                childPosts.forEach(post => addedPosts.add(post));
                            }
                        }
                    }
                }

                if (addedPosts.size > 0) {
                    this.logger.info(`Detected ${addedPosts.size} new posts`);
                    const filtered = await filter.filterPostsBatch(Array.from(addedPosts));

                    // Toast already shown in filterPostsBatch
                }

            } catch (error) {
                this.logger.error('Error processing mutations', error);
            } finally {
                this.processingQueue = false;
            }
        }

        _isPostElement(node) {
            return node.tagName === 'ARTICLE' ||
                   node.getAttribute?.('role') === 'presentation';
        }

        _startWatchdog() {
            setInterval(() => {
                const timeSinceActivity = Date.now() - this.lastActivity;

                if (timeSinceActivity > CONFIG.WATCHDOG_TIMEOUT) {
                    this.logger.warn(`No activity for ${(timeSinceActivity/1000).toFixed(0)}s, checking feed...`);
                    filter.scanFeed();
                    this.lastActivity = Date.now();
                }

                // Periodic cache pruning
                postCache.prune();

            }, CONFIG.WATCHDOG_TIMEOUT);
        }

        stop() {
            if (this.observer) {
                this.observer.disconnect();
                this.isObserving = false;
                this.logger.info('Observer stopped');
            }
        }

        restart() {
            this.logger.info('Restarting observer...');
            this.stop();
            setTimeout(() => this.start(), 1000);
        }
    }

    const feedObserver = new FeedObserver();

    // ============================================================================
    // STATUS WIDGET UI MODULE
    // ============================================================================
    class StatusWidget {
        constructor() {
            this.logger = new Logger('Widget');
            this.container = null;
            this.isExpanded = false;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.updateInterval = null;
            this.isEnabled = false;

            if (CONFIG.UI.ENABLED) {
                this.create();
            }
        }

        create() {
            // Create container
            this.container = document.createElement('div');
            this.container.id = 'ig-filter-widget';
            this.container.setAttribute('data-ig-widget', 'true');

            // Apply initial styles
            this.applyStyles();

            // Build widget content
            this.buildWidget();

            // Append to body
            document.body.appendChild(this.container);

            // Setup event listeners
            this.setupEventListeners();

            // Start update cycle
            this.startUpdateCycle();

            this.logger.success('Status widget created');
        }

        applyStyles() {
            const positions = {
                'top-right': { top: '20px', right: '20px' },
                'top-left': { top: '20px', left: '20px' },
                'bottom-right': { bottom: '20px', right: '20px' },
                'bottom-left': { bottom: '20px', left: '20px' }
            };

            const pos = positions[CONFIG.UI.POSITION] || positions['top-right'];

            this.container.style.cssText = `
                position: fixed;
                ${Object.entries(pos).map(([k, v]) => `${k}: ${v}`).join('; ')};
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 12px;
                opacity: ${CONFIG.UI.OPACITY};
                transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                ${CONFIG.UI.DRAGGABLE ? 'cursor: move;' : ''}
                user-select: none;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            `;
        }

        buildWidget() {
            this.container.innerHTML = `
                <style>
                    #ig-filter-widget {
                        animation: ig-widget-slide-in 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
                    }

                    @keyframes ig-widget-slide-in {
                        from {
                            transform: translateY(-20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: ${CONFIG.UI.OPACITY};
                        }
                    }

                    .ig-widget-inner {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 12px;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                        border: 1px solid rgba(255, 255, 255, 0.18);
                        overflow: hidden;
                        transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                    }

                    .ig-widget-inner:hover {
                        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
                        transform: translateY(-2px);
                    }

                    .ig-widget-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 10px 14px;
                        background: rgba(0, 0, 0, 0.2);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        gap: 10px;
                    }

                    .ig-widget-title {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        color: #ffffff;
                        font-weight: 600;
                        font-size: 13px;
                        letter-spacing: 0.3px;
                    }

                    .ig-widget-status-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #4CAF50;
                        animation: ig-pulse 2s infinite;
                        box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
                    }

                    .ig-widget-status-dot.disabled {
                        background: #F44336;
                        animation: none;
                        box-shadow: 0 0 8px rgba(244, 67, 54, 0.6);
                    }

                    @keyframes ig-pulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.6; transform: scale(1.1); }
                    }

                    .ig-widget-controls {
                        display: flex;
                        gap: 6px;
                    }

                    .ig-widget-btn {
                        width: 24px;
                        height: 24px;
                        border: none;
                        border-radius: 6px;
                        background: rgba(255, 255, 255, 0.15);
                        color: #ffffff;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                        font-size: 14px;
                        padding: 0;
                    }

                    .ig-widget-btn:hover {
                        background: rgba(255, 255, 255, 0.25);
                        transform: scale(1.05);
                    }

                    .ig-widget-btn:active {
                        transform: scale(0.95);
                    }

                    .ig-widget-btn.active {
                        background: rgba(76, 175, 80, 0.3);
                    }

                    .ig-widget-content {
                        padding: 12px 14px;
                        color: #ffffff;
                        max-height: 0;
                        opacity: 0;
                        overflow: hidden;
                        transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                    }

                    .ig-widget-content.expanded {
                        max-height: 500px;
                        opacity: 1;
                        padding: 12px 14px;
                    }

                    .ig-widget-stat {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 6px 0;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .ig-widget-stat:last-child {
                        border-bottom: none;
                    }

                    .ig-widget-stat-label {
                        font-size: 11px;
                        opacity: 0.8;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .ig-widget-stat-value {
                        font-weight: 700;
                        font-size: 14px;
                        color: #fff;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                    }

                    .ig-widget-stat-value.positive {
                        color: #4CAF50;
                    }

                    .ig-widget-stat-value.warning {
                        color: #FF9800;
                    }

                    .ig-widget-stat-value.error {
                        color: #F44336;
                    }

                    .ig-widget-compact-stats {
                        display: flex;
                        gap: 12px;
                        font-size: 11px;
                        color: rgba(255, 255, 255, 0.9);
                    }

                    .ig-widget-compact-stat {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    }

                    .ig-widget-compact-stat-icon {
                        font-size: 10px;
                    }

                    .ig-widget-compact-stat-value {
                        font-weight: 600;
                    }

                    .ig-widget-actions {
                        display: flex;
                        gap: 6px;
                        margin-top: 12px;
                        padding-top: 12px;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .ig-widget-action-btn {
                        flex: 1;
                        padding: 8px 12px;
                        border: none;
                        border-radius: 6px;
                        background: rgba(255, 255, 255, 0.15);
                        color: #ffffff;
                        font-size: 11px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .ig-widget-action-btn:hover {
                        background: rgba(255, 255, 255, 0.25);
                        transform: translateY(-1px);
                    }

                    .ig-widget-action-btn:active {
                        transform: translateY(0);
                    }

                    .ig-widget-dragging {
                        cursor: grabbing !important;
                        opacity: 0.8 !important;
                    }
                </style>

                <div class="ig-widget-inner">
                    <div class="ig-widget-header">
                        <div class="ig-widget-title">
                            <div class="ig-widget-status-dot" id="ig-status-dot"></div>
                            <span>IG Filter</span>
                        </div>
                        <div class="ig-widget-compact-stats" id="ig-compact-stats">
                            <div class="ig-widget-compact-stat">
                                <span class="ig-widget-compact-stat-icon">🛡️</span>
                                <span class="ig-widget-compact-stat-value" id="ig-compact-filtered">0</span>
                            </div>
                            <div class="ig-widget-compact-stat">
                                <span class="ig-widget-compact-stat-icon">📊</span>
                                <span class="ig-widget-compact-stat-value" id="ig-compact-processed">0</span>
                            </div>
                        </div>
                        <div class="ig-widget-controls">
                            <button class="ig-widget-btn" id="ig-widget-toggle" title="Enable/Disable Filter">
                                <span id="ig-toggle-icon">⏸️</span>
                            </button>
                            <button class="ig-widget-btn" id="ig-widget-expand" title="Expand Details">
                                <span>📊</span>
                            </button>
                            <button class="ig-widget-btn" id="ig-widget-close" title="Close Widget">
                                <span>✕</span>
                            </button>
                        </div>
                    </div>
                    <div class="ig-widget-content" id="ig-widget-content">
                        <div class="ig-widget-stat">
                            <span class="ig-widget-stat-label">Posts Filtered</span>
                            <span class="ig-widget-stat-value positive" id="ig-stat-filtered">0</span>
                        </div>
                        <div class="ig-widget-stat">
                            <span class="ig-widget-stat-label">Posts Processed</span>
                            <span class="ig-widget-stat-value" id="ig-stat-processed">0</span>
                        </div>
                        <div class="ig-widget-stat">
                            <span class="ig-widget-stat-label">Filter Rate</span>
                            <span class="ig-widget-stat-value" id="ig-stat-rate">0%</span>
                        </div>
                        <div class="ig-widget-stat">
                            <span class="ig-widget-stat-label">Cache Size</span>
                            <span class="ig-widget-stat-value" id="ig-stat-cache">0</span>
                        </div>
                        <div class="ig-widget-stat">
                            <span class="ig-widget-stat-label">Uptime</span>
                            <span class="ig-widget-stat-value" id="ig-stat-uptime">0s</span>
                        </div>
                        <div class="ig-widget-stat">
                            <span class="ig-widget-stat-label">Observer Status</span>
                            <span class="ig-widget-stat-value" id="ig-stat-observer">Active</span>
                        </div>
                        <div class="ig-widget-stat">
                            <span class="ig-widget-stat-label">Cache Hit Rate</span>
                            <span class="ig-widget-stat-value" id="ig-stat-cache-rate">0%</span>
                        </div>
                        <div class="ig-widget-actions">
                            <button class="ig-widget-action-btn" id="ig-action-scan">🔄 Scan</button>
                            <button class="ig-widget-action-btn" id="ig-action-clear">🗑️ Clear</button>
                        </div>
                    </div>
                </div>
            `;

            // Set initial state
            if (!CONFIG.UI.COMPACT_MODE) {
                this.expand();
            }
        }

        setupEventListeners() {
            // Toggle filter on/off
            const toggleBtn = document.getElementById('ig-widget-toggle');
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFilter();
            });

            // Expand/collapse
            const expandBtn = document.getElementById('ig-widget-expand');
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleExpand();
            });

            // Close widget
            const closeBtn = document.getElementById('ig-widget-close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hide();
            });

            // Action buttons
            const scanBtn = document.getElementById('ig-action-scan');
            scanBtn?.addEventListener('click', () => {
                this.logger.info('Manual scan triggered from widget');
                filter.scanFeed();
            });

            const clearBtn = document.getElementById('ig-action-clear');
            clearBtn?.addEventListener('click', () => {
                this.logger.info('Clear cache triggered from widget');
                filter.reset();
                postCache.clear();
            });

            // Dragging functionality
            if (CONFIG.UI.DRAGGABLE) {
                this.container.addEventListener('mousedown', (e) => this.startDrag(e));
                document.addEventListener('mousemove', (e) => this.drag(e));
                document.addEventListener('mouseup', () => this.stopDrag());
            }

            // Prevent clicks from propagating to Instagram
            this.container.addEventListener('click', (e) => e.stopPropagation());
        }

        startDrag(e) {
            if (e.target.closest('.ig-widget-btn, .ig-widget-action-btn')) {
                return; // Don't drag when clicking buttons
            }

            this.isDragging = true;
            this.container.classList.add('ig-widget-dragging');

            const rect = this.container.getBoundingClientRect();
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        drag(e) {
            if (!this.isDragging) return;

            // Remove position styles
            this.container.style.top = 'auto';
            this.container.style.right = 'auto';
            this.container.style.bottom = 'auto';
            this.container.style.left = 'auto';

            // Set new position
            const x = e.clientX - this.dragOffset.x;
            const y = e.clientY - this.dragOffset.y;

            // Keep within viewport
            const maxX = window.innerWidth - this.container.offsetWidth;
            const maxY = window.innerHeight - this.container.offsetHeight;

            this.container.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
            this.container.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
        }

        stopDrag() {
            this.isDragging = false;
            this.container.classList.remove('ig-widget-dragging');
        }

        toggleFilter() {
            this.isEnabled = !this.isEnabled;

            const statusDot = document.getElementById('ig-status-dot');
            const toggleIcon = document.getElementById('ig-toggle-icon');

            if (this.isEnabled) {
                statusDot.classList.remove('disabled');
                toggleIcon.textContent = '▶️';
                feedObserver.start();
                filter.scanFeed();
                this.logger.success('Filter enabled via widget');
            } else {
                statusDot.classList.add('disabled');
                toggleIcon.textContent = '⏸️';
                feedObserver.stop();
                this.logger.info('Filter disabled via widget');
            }
        }

        toggleExpand() {
            if (this.isExpanded) {
                this.collapse();
            } else {
                this.expand();
            }
        }

        expand() {
            this.isExpanded = true;
            const content = document.getElementById('ig-widget-content');
            content.classList.add('expanded');

            const compactStats = document.getElementById('ig-compact-stats');
            compactStats.style.display = 'none';

            this.logger.debug('Widget expanded');
        }

        collapse() {
            this.isExpanded = false;
            const content = document.getElementById('ig-widget-content');
            content.classList.remove('expanded');

            const compactStats = document.getElementById('ig-compact-stats');
            compactStats.style.display = 'flex';

            this.logger.debug('Widget collapsed');
        }

        startUpdateCycle() {
            this.updateStats();
            this.updateInterval = setInterval(() => {
                this.updateStats();
            }, 1000); // Update every second
        }

        updateStats() {
            if (!this.container || !document.body.contains(this.container)) {
                if (this.updateInterval) {
                    clearInterval(this.updateInterval);
                }
                return;
            }

            const stats = logger.getStats();

            // Compact stats
            const compactFiltered = document.getElementById('ig-compact-filtered');
            const compactProcessed = document.getElementById('ig-compact-processed');
            if (compactFiltered) compactFiltered.textContent = stats.postsFiltered;
            if (compactProcessed) compactProcessed.textContent = stats.postsProcessed;

            // Expanded stats
            if (this.isExpanded) {
                const filtered = document.getElementById('ig-stat-filtered');
                const processed = document.getElementById('ig-stat-processed');
                const rate = document.getElementById('ig-stat-rate');
                const cache = document.getElementById('ig-stat-cache');
                const uptime = document.getElementById('ig-stat-uptime');
                const observer = document.getElementById('ig-stat-observer');
                const cacheRate = document.getElementById('ig-stat-cache-rate');

                if (filtered) filtered.textContent = stats.postsFiltered;
                if (processed) processed.textContent = stats.postsProcessed;

                if (rate) {
                    const filterRate = stats.postsProcessed > 0
                        ? ((stats.postsFiltered / stats.postsProcessed) * 100).toFixed(1)
                        : 0;
                    rate.textContent = `${filterRate}%`;

                    // Color code based on rate
                    rate.className = 'ig-widget-stat-value';
                    if (filterRate > 50) rate.classList.add('warning');
                    else if (filterRate > 75) rate.classList.add('error');
                }

                if (cache) cache.textContent = postCache.getSize();
                if (uptime) uptime.textContent = `${stats.uptime}s`;

                if (observer) {
                    observer.textContent = feedObserver.isObserving ? 'Active' : 'Inactive';
                    observer.className = 'ig-widget-stat-value';
                    if (!feedObserver.isObserving) observer.classList.add('error');
                }

                if (cacheRate) {
                    const totalCalls = stats.cacheHits + stats.cacheMisses;
                    const hitRate = totalCalls > 0
                        ? ((stats.cacheHits / totalCalls) * 100).toFixed(1)
                        : 0;
                    cacheRate.textContent = `${hitRate}%`;
                }
            }
        }

        hide() {
            if (this.container) {
                this.container.style.opacity = '0';
                this.container.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (this.container) {
                        this.container.style.display = 'none';
                    }
                }, 300);
                this.logger.info('Widget hidden');
            }
        }

        show() {
            if (this.container) {
                this.container.style.display = 'block';
                setTimeout(() => {
                    this.container.style.opacity = CONFIG.UI.OPACITY;
                    this.container.style.transform = 'translateY(0)';
                }, 10);
                this.logger.info('Widget shown');
            }
        }

        destroy() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            if (this.container && document.body.contains(this.container)) {
                this.container.remove();
            }
            this.logger.info('Widget destroyed');
        }
    }

    const statusWidget = CONFIG.UI.ENABLED ? new StatusWidget() : null;

    // ============================================================================
    // INITIALIZATION MODULE
    // ============================================================================
    class InstagramFilterApp {
        constructor() {
            this.logger = new Logger('App');
            this.initialized = false;
            this.startTime = Date.now();
        }

        async initialize() {
            if (this.initialized) {
                this.logger.warn('App already initialized');
                return;
            }

            this.logger.info('🚀 Instagram Content Filter Pro initializing...', {
                version: '1.0.0',
                config: CONFIG
            });

            try {
                // Wait for DOM to be ready
                await this._waitForDOM();

                // Initial feed scan
                await filter.scanFeed();

                // Start observing for new content
                feedObserver.start();

                // Setup global controls
                this._setupGlobalControls();

                // Register periodic tasks
                this._startPeriodicTasks();

                this.initialized = true;
                const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
                this.logger.success(`✅ Initialization complete in ${duration}s`);

                // Print initial stats
                if (CONFIG.VERBOSE_LOGGING) {
                    setTimeout(() => logger.printStats(), 2000);
                }

            } catch (error) {
                this.logger.error('Initialization failed', error);
                // Retry initialization
                setTimeout(() => this.initialize(), 5000);
            }
        }

        async _waitForDOM() {
            if (document.readyState === 'loading') {
                this.logger.debug('Waiting for DOM...');
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                });
            }

            // Additional wait for Instagram to render
            let attempts = 0;
            while (attempts < 10) {
                const mainFeed = document.querySelector(CONFIG.SELECTORS.MAIN_FEED);
                if (mainFeed) {
                    this.logger.debug('Main feed detected');
                    return;
                }
                await Utils.sleep(500);
                attempts++;
            }

            this.logger.warn('Main feed not detected after 5s, proceeding anyway');
        }

        _setupGlobalControls() {
            // Expose controls to window object for user interaction
            window.IGFilter = {
                // Configuration
                config: CONFIG,

                // Control methods
                enable: () => {
                    filter.reset();
                    feedObserver.start();
                    filter.scanFeed();
                    this.logger.info('Filter enabled');
                },

                disable: () => {
                    feedObserver.stop();
                    this.logger.info('Filter disabled');
                },

                restart: () => {
                    feedObserver.restart();
                    filter.reset();
                    filter.scanFeed();
                    this.logger.info('Filter restarted');
                },

                // Utility methods
                scan: () => filter.scanFeed(),
                stats: () => logger.printStats(),
                clear: () => {
                    filter.reset();
                    this.logger.info('Cache and state cleared');
                },

                // Configuration methods
                setVerbose: (enabled) => {
                    CONFIG.VERBOSE_LOGGING = enabled;
                    this.logger.info(`Verbose logging ${enabled ? 'enabled' : 'disabled'}`);
                },

                setDebug: (enabled) => {
                    CONFIG.DEBUG_MODE = enabled;
                    this.logger.info(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
                },

                addPattern: (pattern, type = 'partial') => {
                    if (type === 'exact') {
                        CONFIG.FILTER_PATTERNS.EXACT_MATCH.push(pattern);
                    } else {
                        CONFIG.FILTER_PATTERNS.PARTIAL_MATCH.push(pattern);
                    }
                    analyzer.updatePatterns(CONFIG.FILTER_PATTERNS);
                    this.logger.info(`Pattern added: "${pattern}" (${type})`);
                },

                removePattern: (pattern) => {
                    CONFIG.FILTER_PATTERNS.EXACT_MATCH =
                        CONFIG.FILTER_PATTERNS.EXACT_MATCH.filter(p => p !== pattern);
                    CONFIG.FILTER_PATTERNS.PARTIAL_MATCH =
                        CONFIG.FILTER_PATTERNS.PARTIAL_MATCH.filter(p => p !== pattern);
                    analyzer.updatePatterns(CONFIG.FILTER_PATTERNS);
                    this.logger.info(`Pattern removed: "${pattern}"`);
                },

                listPatterns: () => {
                    console.group('🎯 Filter Patterns');
                    console.log('Exact Match:', CONFIG.FILTER_PATTERNS.EXACT_MATCH);
                    console.log('Partial Match:', CONFIG.FILTER_PATTERNS.PARTIAL_MATCH);
                    console.groupEnd();
                },

                // Export/Import
                exportConfig: () => {
                    return JSON.stringify(CONFIG, null, 2);
                },

                exportLogs: () => {
                    return logger.exportLogs();
                },

                // Widget controls
                widget: {
                    show: () => statusWidget?.show(),
                    hide: () => statusWidget?.hide(),
                    expand: () => statusWidget?.expand(),
                    collapse: () => statusWidget?.collapse(),
                    toggle: () => statusWidget?.toggleFilter(),
                },

                // Whitelist management
                whitelist: {
                    add: (username) => whitelist.add(username),
                    remove: (username) => whitelist.remove(username),
                    list: () => whitelist.list(),
                    clear: () => whitelist.clear(),
                    check: (username) => whitelist.accounts.has(username.toLowerCase().replace('@', '')),
                },

                // Toast notifications
                toast: {
                    show: (msg, type, duration) => toast.show(msg, type, duration),
                    success: (msg) => toast.success(msg),
                    info: (msg) => toast.info(msg),
                    warning: (msg) => toast.warning(msg),
                    error: (msg) => toast.error(msg),
                    test: () => {
                        toast.success('✅ Toast system working!');
                        setTimeout(() => toast.info('ℹ️ This is an info toast'), 500);
                        setTimeout(() => toast.warning('⚠️ This is a warning'), 1000);
                        setTimeout(() => toast.filter(5), 1500);
                    }
                },

                // Quick settings
                settings: {
                    autoScroll: (enabled) => {
                        CONFIG.AUTO_SCROLL.ENABLED = enabled;
                        this.logger.info(`Auto-scroll ${enabled ? 'enabled' : 'disabled'}`);
                    },
                    toasts: (enabled) => {
                        CONFIG.UI.SHOW_TOAST_NOTIFICATIONS = enabled;
                        this.logger.info(`Toast notifications ${enabled ? 'enabled' : 'disabled'}`);
                    },
                    filterReels: (enabled) => {
                        CONFIG.CONTENT_TYPES.FILTER_REELS = enabled;
                        this.logger.info(`Reel filtering ${enabled ? 'enabled' : 'disabled'}`);
                    },
                },

                // Status
                status: () => {
                    const stats = logger.getStats();
                    console.group('📊 Instagram Filter Status');
                    console.log('Initialized:', this.initialized);
                    console.log('Observer Active:', feedObserver.isObserving);
                    console.log('Cache Size:', postCache.getSize());
                    console.log('Statistics:', stats);
                    console.groupEnd();
                },

                // Help
                help: () => {
                    console.log(`
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
%c  Instagram Content Filter Pro - Command Reference
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

%cControl Commands:%c
  IGFilter.enable()          - Enable the filter
  IGFilter.disable()         - Disable the filter
  IGFilter.restart()         - Restart the filter
  IGFilter.scan()            - Manually scan feed now

%cInformation Commands:%c
  IGFilter.stats()           - Show statistics
  IGFilter.status()          - Show system status
  IGFilter.listPatterns()    - List all filter patterns
  IGFilter.help()            - Show this help

%cConfiguration Commands:%c
  IGFilter.setVerbose(bool)  - Toggle verbose logging
  IGFilter.setDebug(bool)    - Toggle debug mode
  IGFilter.addPattern(str)   - Add a filter pattern
  IGFilter.removePattern(str) - Remove a filter pattern

%cWidget Commands:%c
  IGFilter.widget.show()     - Show widget
  IGFilter.widget.hide()     - Hide widget
  IGFilter.widget.expand()   - Expand widget
  IGFilter.widget.collapse() - Collapse widget

%cWhitelist Commands:%c
  IGFilter.whitelist.add('user') - Whitelist a user
  IGFilter.whitelist.remove('user') - Remove from whitelist
  IGFilter.whitelist.list()  - List whitelisted users
  IGFilter.whitelist.clear() - Clear whitelist

%cSettings Commands:%c
  IGFilter.settings.autoScroll(bool) - Toggle auto-scroll
  IGFilter.settings.toasts(bool) - Toggle notifications
  IGFilter.settings.filterReels(bool) - Toggle reel filtering

%cMaintenance Commands:%c
  IGFilter.clear()           - Clear cache and state
  IGFilter.exportConfig()    - Export configuration
  IGFilter.exportLogs()      - Export log history

%cExamples:%c
  IGFilter.addPattern('reels', 'partial')
  IGFilter.whitelist.add('mybestfriend')
  IGFilter.settings.autoScroll(true)
  IGFilter.setVerbose(false)
  IGFilter.scan()

%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
                    'color: #9C27B0',
                    'color: #2196F3; font-weight: bold; font-size: 16px',
                    'color: #9C27B0',
                    'color: #4CAF50; font-weight: bold',
                    'color: inherit',
                    'color: #2196F3; font-weight: bold',
                    'color: inherit',
                    'color: #FF9800; font-weight: bold',
                    'color: inherit',
                    'color: #00BCD4; font-weight: bold',
                    'color: inherit',
                    'color: #E91E63; font-weight: bold',
                    'color: inherit',
                    'color: #8BC34A; font-weight: bold',
                    'color: inherit',
                    'color: #F44336; font-weight: bold',
                    'color: inherit',
                    'color: #9E9E9E; font-weight: bold',
                    'color: inherit',
                    'color: #9C27B0'
                    );
                }
            };

            // Log that controls are available
            this.logger.success('Global controls available: window.IGFilter or IGFilter');
            this.logger.info('Type IGFilter.help() for command reference');
        }

        _startPeriodicTasks() {
            // Periodic statistics logging (every 5 minutes)
            if (CONFIG.PERFORMANCE_MONITORING) {
                setInterval(() => {
                    if (CONFIG.VERBOSE_LOGGING) {
                        logger.printStats();
                    }
                }, 5 * 60 * 1000);
            }

            // Periodic full scan (every 30 seconds) as backup
            setInterval(() => {
                const stats = logger.getStats();
                // Only scan if we haven't processed anything recently
                if (stats.postsProcessed === this.lastProcessedCount) {
                    this.logger.debug('No recent activity, performing maintenance scan');
                    filter.scanFeed();
                }
                this.lastProcessedCount = stats.postsProcessed;
            }, 30000);

            // Memory cleanup (every 2 minutes)
            setInterval(() => {
                postCache.prune();
                this.logger.debug('Periodic cache cleanup completed');
            }, 2 * 60 * 1000);
        }

        shutdown() {
            this.logger.info('Shutting down Instagram Filter...');
            feedObserver.stop();
            postCache.clear();
            logger.printStats();
            this.logger.success('Shutdown complete');
        }
    }

    // ============================================================================
    // ERROR BOUNDARY & GLOBAL ERROR HANDLING
    // ============================================================================
    class ErrorBoundary {
        constructor() {
            this.logger = new Logger('ErrorBoundary');
            this.errorCount = 0;
            this.maxErrors = 50;
            this.setupHandlers();
        }

        setupHandlers() {
            // Global error handler
            window.addEventListener('error', (event) => {
                this.handleError(event.error, 'Global Error');
            });

            // Unhandled promise rejection handler
            window.addEventListener('unhandledrejection', (event) => {
                this.handleError(event.reason, 'Unhandled Promise Rejection');
            });
        }

        handleError(error, context = 'Unknown') {
            this.errorCount++;

            if (this.errorCount > this.maxErrors) {
                this.logger.error('Maximum error threshold reached, entering safe mode');
                if (window.IGFilterApp) {
                    window.IGFilterApp.shutdown();
                }
                return;
            }

            this.logger.error(`${context}: ${error?.message || error}`, {
                stack: error?.stack,
                errorCount: this.errorCount
            });

            // Attempt recovery for critical errors
            if (this.errorCount % 10 === 0) {
                this.logger.warn('Multiple errors detected, attempting recovery...');
                if (window.IGFilterApp) {
                    feedObserver.restart();
                    filter.reset();
                }
            }
        }
    }

    // ============================================================================
    // PAGE VISIBILITY HANDLER
    // ============================================================================
    class VisibilityHandler {
        constructor() {
            this.logger = new Logger('Visibility');
            this.setupVisibilityHandler();
        }

        setupVisibilityHandler() {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.logger.debug('Page hidden, pausing non-critical operations');
                } else {
                    this.logger.debug('Page visible, resuming operations');
                    // Perform a quick scan when page becomes visible again
                    setTimeout(() => {
                        filter.scanFeed();
                    }, 1000);
                }
            });
        }
    }

    // ============================================================================
    // URL CHANGE DETECTION (for SPA navigation)
    // ============================================================================
    class NavigationHandler {
        constructor() {
            this.logger = new Logger('Navigation');
            this.currentPath = window.location.pathname;
            this.setupNavigationHandling();
        }

        setupNavigationHandling() {
            // Monitor for URL changes (Instagram is an SPA)
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = (...args) => {
                originalPushState.apply(history, args);
                this.handleNavigation();
            };

            history.replaceState = (...args) => {
                originalReplaceState.apply(history, args);
                this.handleNavigation();
            };

            window.addEventListener('popstate', () => {
                this.handleNavigation();
            });
        }

        handleNavigation() {
            const newPath = window.location.pathname;

            if (newPath !== this.currentPath) {
                this.logger.info(`Navigation detected: ${this.currentPath} → ${newPath}`);
                this.currentPath = newPath;

                // Clear cache and rescan on navigation
                postCache.clear();
                filter.reset();

                // Wait for new content to load
                setTimeout(() => {
                    filter.scanFeed();
                }, 1500);
            }
        }
    }

    // ============================================================================
    // PERFORMANCE MONITOR
    // ============================================================================
    class PerformanceMonitor {
        constructor() {
            this.logger = new Logger('Performance');
            this.metrics = {
                fps: [],
                memory: [],
                cpuTime: []
            };

            if (CONFIG.PERFORMANCE_MONITORING) {
                this.startMonitoring();
            }
        }

        startMonitoring() {
            // FPS monitoring
            let lastTime = performance.now();
            let frames = 0;

            const measureFPS = () => {
                frames++;
                const currentTime = performance.now();

                if (currentTime >= lastTime + 1000) {
                    const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                    this.metrics.fps.push(fps);

                    if (fps < 30) {
                        this.logger.warn(`Low FPS detected: ${fps}`);
                    }

                    frames = 0;
                    lastTime = currentTime;
                }

                requestAnimationFrame(measureFPS);
            };

            requestAnimationFrame(measureFPS);

            // Memory monitoring (if available)
            if (performance.memory) {
                setInterval(() => {
                    const memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024);
                    this.metrics.memory.push(memoryUsage.toFixed(2));

                    if (memoryUsage > 100) {
                        this.logger.warn(`High memory usage: ${memoryUsage.toFixed(2)} MB`);
                    }
                }, 30000);
            }
        }

        getReport() {
            const avgFPS = this.metrics.fps.length > 0
                ? (this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length).toFixed(2)
                : 'N/A';

            const currentMemory = performance.memory
                ? (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)
                : 'N/A';

            return {
                averageFPS: avgFPS,
                currentMemoryMB: currentMemory,
                sampleCount: this.metrics.fps.length
            };
        }
    }

    // ============================================================================
    // MAIN EXECUTION
    // ============================================================================

    // Create error boundary first
    const errorBoundary = new ErrorBoundary();

    // Create and expose app instance globally
    const app = new InstagramFilterApp();
    window.IGFilterApp = app;

    // Initialize other handlers
    const visibilityHandler = new VisibilityHandler();
    const navigationHandler = new NavigationHandler();
    const performanceMonitor = new PerformanceMonitor();

    // Start the application
    (async () => {
        try {
            // Small delay to ensure Instagram's initial render
            await Utils.sleep(1000);

            await app.initialize();

            // Periodic health check
            setInterval(() => {
                if (!feedObserver.isObserving) {
                    logger.warn('Observer not running, attempting restart...');
                    feedObserver.start();
                }
            }, 60000);

            // Welcome message
            console.log(`
%c╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🛡️  INSTAGRAM CONTENT FILTER PRO - v1.0.0  🛡️        ║
║                                                           ║
║              Enterprise-Grade Content Filtering           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

%c✅ Status: Active & Monitoring
%c🎯 Patterns Loaded: ${CONFIG.FILTER_PATTERNS.EXACT_MATCH.length + CONFIG.FILTER_PATTERNS.PARTIAL_MATCH.length}
%c📊 Type 'IGFilter.help()' for commands
%c🔧 Type 'IGFilter.status()' for system info

%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
                'color: #9C27B0; font-weight: bold; font-size: 14px',
                'color: #4CAF50; font-weight: bold',
                'color: #2196F3',
                'color: #FF9800',
                'color: #9E9E9E',
                'color: #9C27B0'
            );

        } catch (error) {
            logger.error('Fatal initialization error', error);
            console.error('Instagram Filter failed to start:', error);
        }
    })();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        app.shutdown();
    });

    // Expose version info
    window.IGFilterVersion = '1.0.0';

})();