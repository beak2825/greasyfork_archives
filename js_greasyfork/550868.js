// ==UserScript==
// @name         CleanGram
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Hides Instagram posts that are suggested, sponsored, or prompt for "Follow" using a flexible configuration.
// @author       JJJ
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550868/CleanGram.user.js
// @updateURL https://update.greasyfork.org/scripts/550868/CleanGram.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== Configuration ====================
    const CONFIG = {
        timing: {
            clickDelay: 100,        // Reduced from 300ms - faster response to clicks
            scrollInterval: 250,    // Reduced from 500ms - more frequent scans during scroll
            scrollDebounce: 400,    // Reduced from 800ms - faster post-scroll cleanup
            periodicScan: 2000      // Reduced from 3000ms - more frequent fallback scans
        },
        selectors: {
            // Elements to scan (ARTICLE is typical Instagram post container)
            targetElements: 'ARTICLE',
            // Attribute used to mark hidden elements
            hiddenMarker: 'data-cleangram-hidden',
            // Common ad label spans (Instagram class names can vary; include a fallback)
            adSpans: 'span.x1fhwpqd, span[class*="x1fhwpqd"]',
            // Sponsored indicator (data attribute used by Instagram for some ads)
            sponsored: '[data-ad-preview="message"]',
            // Selector candidates for the "Suggested for you" label seen in the DOM
            // We intentionally include a few class combinations observed in the site HTML
            suggested: 'span.x193iq5w.xeuugli.x1fj9vlw, span.x1fhwpqd, span.xt0psk2'
        },
        patterns: {
            sponsored: 'sponsored',
            suggested: 'suggested for you',
            adLabel: ['Ad', 'Sponsored']
        }
    };

    // ==================== Logger Utility ====================
    const Logger = (() => {
        const styles = {
            info: 'color: #2196F3; font-weight: bold',
            warning: 'color: #FFC107; font-weight: bold',
            success: 'color: #4CAF50; font-weight: bold',
            error: 'color: #F44336; font-weight: bold'
        };
        const prefix = '[CleanGram]';
        const getTimestamp = () => new Date().toISOString().split('T')[1].slice(0, -1);
        const log = (level, msg) => {
            const method = level === 'error' ? console.error : level === 'warning' ? console.warn : console.log;
            method(`%c${prefix} ${getTimestamp()} - ${msg}`, styles[level]);
        };

        return {
            info: (msg) => log('info', msg),
            warning: (msg) => log('warning', msg),
            success: (msg) => log('success', msg),
            error: (msg) => log('error', msg)
        };
    })();

    // ==================== State Management ====================
    const State = {
        scanTimer: null,
        scrollTimer: null,
        isScrolling: false,
        observer: null
    };

    // ==================== Content Detection ====================
    const ContentDetector = {
        /**
         * Check if element text contains banned patterns
         * @param {string} text - Element text content
         * @returns {string|null} - Pattern found or null
         */
        checkTextPatterns(text) {
            if (text.length < 10) return null;

            const textLower = text.toLowerCase();

            if (textLower.includes(CONFIG.patterns.sponsored)) {
                return 'sponsored text';
            }

            if (textLower.includes(CONFIG.patterns.suggested)) {
                return 'suggested text';
            }

            return null;
        },

        /**
         * Check for ad label spans
         * @param {Element} element
         * @returns {boolean}
         */
        hasAdLabel(element) {
            const adSpans = element.querySelectorAll(CONFIG.selectors.adSpans);
            for (const span of adSpans) {
                const spanText = span.textContent.trim();
                if (CONFIG.patterns.adLabel.includes(spanText)) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Check for sponsored content via selectors
         * @param {Element} element
         * @returns {boolean}
         */
        hasSponsoredSelector(element) {
            return !!element.querySelector(CONFIG.selectors.sponsored);
        },

        /**
         * Check for suggested header
         * @param {Element} element
         * @returns {boolean}
         */
        hasSuggestedHeader(element) {
            const header = element.querySelector(CONFIG.selectors.suggested);
            if (header) {
                const headerText = header.textContent.trim().toLowerCase();
                return headerText === CONFIG.patterns.suggested;
            }
            return false;
        },

        /**
         * Main detection method - determines if element should be hidden
         * @param {Element} element
         * @returns {boolean}
         */
        isBannedContent(element) {
            // Fast text-based checks first (no DOM queries)
            const textPattern = this.checkTextPatterns(element.textContent);
            if (textPattern) {
                Logger.warning(`Found ${textPattern}`);
                return true;
            }

            // Check for ad label
            if (this.hasAdLabel(element)) {
                Logger.warning('Found ad label');
                return true;
            }

            // Expensive DOM queries last
            if (this.hasSponsoredSelector(element)) {
                Logger.warning('Found sponsored selector');
                return true;
            }

            if (this.hasSuggestedHeader(element)) {
                Logger.warning('Found suggested header');
                return true;
            }

            return false;
        }
    };

    // ==================== Element Management ====================
    const ElementManager = {
        /**
         * Check if element is already hidden
         * @param {Element} element
         * @returns {boolean}
         */
        isHidden(element) {
            return element.dataset.cleangramHidden === 'true';
        },

        /**
         * Hide element non-destructively to not breake Instagram scroll detection
         * OPTIMIZED: Apply class first for instant CSS hide, then set attributes
         * @param {Element} element
         */
        hide(element) {
            if (this.isHidden(element)) return;

            // SPEED: Apply class first - CSS takes effect immediately
            element.classList.add('cleangram-hidden');
            element.dataset.cleangramHidden = 'true';

            // Apply inline styles as backup (in case CSS is removed)
            element.style.cssText = 'visibility:hidden!important;height:0!important;min-height:0!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important';

            // Remove element from accessibility tree
            element.setAttribute('aria-hidden', 'true');
        },

        /**
         * Re-hide element if Instagram tries to show it again
         * @param {Element} element
         */
        ensureHidden(element) {
            if (this.isHidden(element)) {
                // Re-apply hiding styles if they were removed
                const visibility = element.style.getPropertyValue('visibility');
                if (visibility !== 'hidden') {
                    element.style.setProperty('visibility', 'hidden', 'important');
                    element.style.setProperty('height', '0', 'important');
                    element.style.setProperty('overflow', 'hidden', 'important');
                }
            }
        },

        /**
         * Get all unprocessed target elements
         * @returns {NodeList}
         */
        getUnprocessedElements() {
            return document.querySelectorAll(
                `${CONFIG.selectors.targetElements}:not([${CONFIG.selectors.hiddenMarker}="true"])`
            );
        },

        /**
         * Process and hide elements if they contain banned content
         * OPTIMIZED: Batch operations for better performance
         * @returns {number} - Count of hidden elements
         */
        processElements() {
            const elements = this.getUnprocessedElements();
            let hiddenCount = 0;

            // Process in batches for better performance with many elements
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (ContentDetector.isBannedContent(element)) {
                    this.hide(element);
                    hiddenCount++;
                }
            }

            return hiddenCount;
        },

        /**
         * Check and re-hide all marked elements (in case Instagram re-shows them)
         */
        reinforceHidden() {
            const hiddenElements = document.querySelectorAll(`[${CONFIG.selectors.hiddenMarker}="true"]`);
            hiddenElements.forEach(element => this.ensureHidden(element));
        }
    };

    // ==================== Scan Management ====================
    const ScanManager = {
        /**
         * Run cleanup scan
         */
        scan() {
            // First, reinforce already hidden elements
            ElementManager.reinforceHidden();

            // Then process new elements
            const hiddenCount = ElementManager.processElements();
            if (hiddenCount > 0) {
                Logger.success(`Hidden ${hiddenCount} element(s)`);
            }
        },

        /**
         * Start continuous scanning during scroll
         */
        startContinuous() {
            if (State.scanTimer) return;
            State.scanTimer = setInterval(
                () => this.scan(),
                CONFIG.timing.scrollInterval
            );
        },

        /**
         * Stop continuous scanning
         */
        stopContinuous() {
            if (State.scanTimer) {
                clearInterval(State.scanTimer);
                State.scanTimer = null;
            }
        },

        /**
         * Handle scroll events with debouncing
         */
        handleScroll() {
            if (!State.isScrolling) {
                State.isScrolling = true;
                this.startContinuous();
            }

            clearTimeout(State.scrollTimer);
            State.scrollTimer = setTimeout(() => {
                State.isScrolling = false;
                this.stopContinuous();
                this.scan(); // Final cleanup after scroll stops
            }, CONFIG.timing.scrollDebounce);
        }
    };

    // ==================== Observer Management ====================
    const ObserverManager = {
        /**
         * Process added nodes from mutations
         * @param {Node} node
         * @returns {number} - Count of hidden elements
         */
        processNode(node) {
            if (node.nodeType !== Node.ELEMENT_NODE) return 0;

            let hiddenCount = 0;

            // Check if node itself is a target element
            if (node.tagName === CONFIG.selectors.targetElements && !ElementManager.isHidden(node)) {
                if (ContentDetector.isBannedContent(node)) {
                    ElementManager.hide(node);
                    hiddenCount++;
                }
            }

            // Check child elements
            const children = node.querySelectorAll(
                `${CONFIG.selectors.targetElements}:not([${CONFIG.selectors.hiddenMarker}="true"])`
            );

            children.forEach(child => {
                if (ContentDetector.isBannedContent(child)) {
                    ElementManager.hide(child);
                    hiddenCount++;
                }
            });

            return hiddenCount;
        },

        /**
         * MutationObserver callback
         * OPTIMIZED: Faster iteration
         * @param {MutationRecord[]} mutations
         */
        callback(mutations) {
            let totalHidden = 0;

            // Use for loop instead of forEach for speed
            for (let i = 0; i < mutations.length; i++) {
                const mutation = mutations[i];

                // Handle new nodes being added
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    for (let j = 0; j < mutation.addedNodes.length; j++) {
                        totalHidden += this.processNode(mutation.addedNodes[j]);
                    }
                }

                // Handle attribute changes (Instagram trying to re-show elements)
                else if (mutation.type === 'attributes' && mutation.target && ElementManager.isHidden(mutation.target)) {
                    ElementManager.ensureHidden(mutation.target);
                }
            }

            if (totalHidden > 0) {
                Logger.success(`Observer hidden ${totalHidden} element(s)`);
            }
        },

        /**
         * Initialize MutationObserver
         */
        initialize() {
            const targetNode = document.querySelector('main') || document.body;
            State.observer = new MutationObserver((mutations) => this.callback(mutations));
            // Watch for childList changes AND attribute changes (to catch style modifications)
            State.observer.observe(targetNode, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
            Logger.success('Observer activated');
        }
    };

    // ==================== Event Handlers ====================
    const EventHandlers = {
        /**
         * Handle click events
         */
        onClick() {
            setTimeout(() => ScanManager.scan(), CONFIG.timing.clickDelay);
        },

        /**
         * Handle scroll events
         */
        onScroll() {
            ScanManager.handleScroll();
        },

        /**
         * Handle page load
         */
        onLoad() {
            ScanManager.scan();
        },

        /**
         * Register all event listeners
         */
        register() {
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
            document.addEventListener('click', () => this.onClick());
            window.addEventListener('load', () => this.onLoad());
            Logger.success('Event listeners registered');
        }
    };

    // ==================== Style Injection ====================
    const StyleManager = {
        /**
         * Inject CSS to ensure hidden elements stay hidden
         * Uses v0.0.2 gentle approach (no display:none) to preserve infinite scroll
         */
        injectStyles() {
            const style = document.createElement('style');
            style.id = 'cleangram-styles';
            style.textContent = `
                /* Force hide elements marked by CleanGram (v0.0.2 approach) */
                /* NOTE: We avoid display:none to keep infinite scroll working */
                [data-cleangram-hidden="true"],
                .cleangram-hidden {
                    visibility: hidden !important;
                    height: 0 !important;
                    min-height: 0 !important;
                    max-height: 0 !important;
                    overflow: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            `;
            document.head.appendChild(style);
            Logger.success('Styles injected');
        }
    };

    // ==================== Application ====================
    const App = {
        /**
         * Initialize the application
         */
        initialize() {
            Logger.info('CleanGram initializing...');

            // Inject CSS styles first
            StyleManager.injectStyles();

            // Initial cleanup
            ScanManager.scan();

            // Setup MutationObserver
            ObserverManager.initialize();

            // Register event handlers
            EventHandlers.register();

            // Periodic fallback scan
            setInterval(() => ScanManager.scan(), CONFIG.timing.periodicScan);

            Logger.success('CleanGram fully initialized');
        },

        /**
         * Start the application when DOM is ready
         */
        start() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                this.initialize();
            }
        }
    };

    // ==================== Entry Point ====================
    App.start();
})();