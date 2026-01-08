// ==UserScript==
// @name         Image-Search-Direct-View
// @namespace    https://github.com/p65536
// @version      1.0.1
// @license      MIT
// @description  Adds a "View Image" button to Image Search results. [Supported sites: Bing / DuckDuckGo / Google]
// @icon         https://raw.githubusercontent.com/p65536/p65536/main/images/isdv.svg
// @author       p65536
// @match        https://*.bing.com/images/search*
// @match        https://duckduckgo.com/*
// @match        https://*.google.com/search*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM.xmlHttpRequest
// @grant        GM.openInTab
// @connect      *
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/561330/Image-Search-Direct-View.user.js
// @updateURL https://update.greasyfork.org/scripts/561330/Image-Search-Direct-View.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =================================================================================
    // SECTION: Platform-Specific Definitions
    // =================================================================================

    const OWNERID = 'p65536';
    const APPID = 'isdv';
    const APPNAME = 'Image Search Direct View';
    const LOG_PREFIX = `[${APPID.toUpperCase()}]`;

    // =================================================================================
    // SECTION: Configuration Definitions
    // =================================================================================

    const CONSTANTS = {
        CONFIG_KEY: `${APPID}_config`,
        TOAST_DURATION: 3000,
        TOAST_FADE_OUT_DURATION: 300,
        NETWORK_TIMEOUT: 20000, // 20 seconds
        WAIT_FOR_VALID_URL_TIMEOUT: 500,
        MODAL: {
            WIDTH: 400,
            Z_INDEX: 100,
        },
        REFERRER_POLICY: {
            NO_REFERRER: 'no-referrer',
            ORIGIN: 'origin',
            UNSAFE_URL: 'unsafe-url',
        },
        FETCH_STRATEGY: {
            AUTO: 'auto',
            BLOB: 'blob',
            DIRECT: 'direct',
        },
        TIMEOUTS: {
            FETCH_ORIGINAL: 3000,
            DOM_POLLING: 100,
            SCROLL_CLAMP: 500,
            UI_DELAY: 100,
            POST_NAVIGATION_DOM_SETTLE: 500,
        },
        ICONS: {
            IMAGE: {
                tag: 'svg',
                props: { viewBox: '0 0 24 24', width: '18px', height: '18px', fill: 'currentColor' },
                children: [{ tag: 'path', props: { d: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' } }],
            },
            GLOBE: {
                tag: 'svg',
                props: { viewBox: '0 0 24 24', width: '18px', height: '18px', fill: 'currentColor' },
                children: [
                    {
                        tag: 'path',
                        props: {
                            d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
                        },
                    },
                ],
            },
        },
        LOG_TAGS: {
            ORIGINAL: 'ORIGINAL',
            THUMBNAIL: 'THUMBNAIL',
        },
    };

    const SITE_STYLES = {
        google: {
            // For Modal & Common Settings (Dark mode support via CSS vars)
            bg: 'var(--background-color, Canvas)',
            text: 'var(--primary-text-color, CanvasText)',
            border: 'var(--border-color, ButtonBorder)',
            header_bg: 'var(--header-bg-color, var(--background-color, Canvas))',
            btn_bg: 'var(--background-color, Canvas)',
            btn_text: 'var(--primary-text-color, CanvasText)',
            btn_border: 'var(--border-color, ButtonBorder)',
            // Adjusted fallback to be visible in both Light (darken) and Dark (lighten via var) modes
            btn_hover_bg: 'var(--hover-bg-color, rgb(0 0 0 / 0.08))',
            input_bg: 'var(--textfield-surface, Field)',
            input_text: 'var(--textfield-primary, FieldText)',
            input_border: 'var(--border-color, FieldBorder)',
            accent: '#4285F4', // Google Blue
            text_secondary: 'var(--secondary-text-color, GrayText)',

            // Variable mapping specific to Button UI
            vars: {
                '--isdv-bg': 'var(--background-color, Canvas)',
                '--isdv-text': 'var(--primary-text-color, CanvasText)',
                '--isdv-border': 'var(--border-color, ButtonBorder)',
                // Hover bg: Solid color (Google Light Gray) instead of transparent
                '--isdv-hover-bg': 'var(--hover-bg-color, rgb(241 243 244))',
                '--isdv-accent': '#4285F4',
                // Alert Colors (Light Mode Default)
                '--isdv-unsafe': '#d93025',
                '--isdv-noref': '#1a0dab', // Google Link Blue
            },
            // Override settings for Dark Mode (Supplementing incomplete CSS vars)
            css_overrides: `
                @media (prefers-color-scheme: dark) {
                    :root {
                        /* Hover bg: Solid color (Google Dark Gray) */
                        --isdv-hover-bg: rgb(48 49 52);
                        --isdv-unsafe: #e06055; /* Bright red for dark mode */
                        --isdv-noref: #8ab4f8;  /* Bright blue for dark mode */
                    }
                }
            `,
            overrides: '', // No layout override needed for Google
        },
        bing: {
            // Bing Colors (Use as is, since CSS vars are complete)
            bg: 'var(--c-w-1, Canvas)',
            text: 'var(--c-t-1, CanvasText)',
            border: 'var(--c-s-1, ButtonBorder)',
            header_bg: 'var(--c-w-1, Canvas)',
            btn_bg: 'var(--c-w-1, ButtonFace)',
            btn_text: 'var(--c-t-1, ButtonText)',
            btn_border: 'var(--c-s-1, ButtonBorder)',
            btn_hover_bg: 'var(--c-s-2, Highlight)',
            input_bg: 'var(--c-w-1, Field)',
            input_text: 'var(--c-t-1, FieldText)',
            input_border: 'var(--c-s-1, FieldBorder)',
            accent: '#0078d4', // Bing Blue
            text_secondary: 'var(--c-t-2, GrayText)',

            // Variable mapping specific to Button UI
            vars: {
                '--isdv-bg': 'var(--c-w-1)',
                '--isdv-text': 'var(--c-t-1)',
                '--isdv-border': 'var(--c-s-1)',
                '--isdv-hover-bg': 'var(--c-s-2)',
                '--isdv-accent': '#0078d4',
                '--isdv-unsafe': '#d93025',
                '--isdv-noref': 'var(--c-h-1)', // Bing link color
            },
            // No override needed as Bing variables switch automatically
            css_overrides: '',
            // Ensure buttons are visible (z-index: 1)
            overrides: `
                .${APPID}-icon-btn {
                    left: 8px;
                    right: auto;
                    z-index: 1 !important;
                }
                .${APPID}-icon-btn:hover {
                    z-index: 2 !important;
                }
            `,
        },
        duckduckgo: {
            // DuckDuckGo Colors (Using their native CSS variables)
            bg: 'var(--color-bg-main, #fff)',
            text: 'var(--color-text-primary, #333)',
            border: 'var(--color-border-main, #ccc)',
            header_bg: 'var(--color-bg-main, #fff)',
            btn_bg: 'var(--color-bg-main, #fff)',
            btn_text: 'var(--color-text-primary, #333)',
            btn_border: 'var(--color-border-main, #ccc)',
            btn_hover_bg: 'var(--color-bg-dim, #f0f0f0)',
            input_bg: 'var(--color-bg-input, #fff)',
            input_text: 'var(--color-text-primary, #333)',
            input_border: 'var(--color-border-main, #ccc)',
            accent: '#de5833', // DDG Orange/Red
            text_secondary: 'var(--color-text-secondary, #666)',

            // Variable mapping specific to Button UI
            vars: {
                '--isdv-bg': 'var(--color-bg-main, #fff)',
                '--isdv-text': 'var(--color-text-primary, #333)',
                '--isdv-border': 'var(--color-border-main, rgb(0 0 0 / 0.1))',
                '--isdv-hover-bg': 'var(--color-bg-dim, #f0f0f0)',
                '--isdv-accent': '#de5833',
                '--isdv-unsafe': '#d93025',
                '--isdv-noref': '#4096ff',
            },
            css_overrides: '',
            // Position: Default (Top-Right)
            // 1. Set ISDV button z-index to 1 to ensure it sits above the image.
            // 2. Force DDG's menu button to z-index 100 to ensure it sits above ISDV button.
            overrides: `
                .${APPID}-icon-btn {
                    z-index: 1 !important;
                }
                .${APPID}-icon-btn:hover {
                    z-index: 2 !important;
                }
                /* Force DDG menu button above ISDV buttons */
                figure button[aria-label="menu"] {
                    z-index: 100 !important;
                }
            `,
        },
    };

    const DEFAULT_CONFIG = {
        common: {
            showOnlyOnHover: false, // Default to false so users see buttons immediately
            showVisitPageButton: true, // Show the "Visit Page" button by default
            referrerPolicy: CONSTANTS.REFERRER_POLICY.ORIGIN, // Default: Send origin only
            retryOnFailure: false, // Default: Do not retry automatically
            fetchStrategy: CONSTANTS.FETCH_STRATEGY.AUTO, // Default: Auto Detect
            blobRevokeTimeout: 600000, // Default: 10 minutes (600,000 ms)
        },
        developer: {
            logger_level: 'log',
        },
    };

    const EVENTS = {
        CONFIG_UPDATED: `${APPID}:configUpdated`,
        NAVIGATION: `${APPID}:navigation`,
    };

    const UI_STYLES = {
        BASE: `
            /* Button Style (Icon Button) - CSS Variable Support */
            .${APPID}-icon-btn {
                position: absolute;
                right: 8px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: var(--isdv-bg, rgb(255 255 255));
                border: 1px solid var(--isdv-border, rgb(0 0 0 / 0.1));
                /* Increased shadow opacity for better visibility */
                box-shadow: 0 2px 5px rgb(0 0 0 / 0.3);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--isdv-text, rgb(95 99 104));
                transition: transform 0.1s, background-color 0.1s, opacity 0.2s ease-in-out;
                z-index: 10;
            }
            .${APPID}-icon-btn:hover {
                background-color: var(--isdv-hover-bg, rgb(241 243 244));
                color: var(--isdv-text, rgb(32 33 36));
                transform: scale(1.1);
                box-shadow: 0 4px 10px rgb(0 0 0 / 0.4);
                z-index: 11;
            }
            .${APPID}-icon-btn:active {
                transform: scale(0.95);
            }
            
            /* Policy Colors - Controlled via CSS Variables */
            
            /* Origin (Default) - Use standard text color (Native look) */
            body[data-${APPID}-referrer-policy="${CONSTANTS.REFERRER_POLICY.ORIGIN}"] .${APPID}-icon-btn { color: var(--isdv-text) !important; }
            body[data-${APPID}-referrer-policy="${CONSTANTS.REFERRER_POLICY.ORIGIN}"] .${APPID}-icon-btn:hover { color: var(--isdv-text) !important; }

            /* Unsafe URL - Red (Alert) */
            body[data-${APPID}-referrer-policy="${CONSTANTS.REFERRER_POLICY.UNSAFE_URL}"] .${APPID}-icon-btn { color: var(--isdv-unsafe) !important; }
            body[data-${APPID}-referrer-policy="${CONSTANTS.REFERRER_POLICY.UNSAFE_URL}"] .${APPID}-icon-btn:hover { color: var(--isdv-unsafe) !important; }

            /* No Referrer - Blue (Custom/Link Color) */
            body[data-${APPID}-referrer-policy="${CONSTANTS.REFERRER_POLICY.NO_REFERRER}"] .${APPID}-icon-btn { color: var(--isdv-noref) !important; }
            body[data-${APPID}-referrer-policy="${CONSTANTS.REFERRER_POLICY.NO_REFERRER}"] .${APPID}-icon-btn:hover { color: var(--isdv-noref) !important; }
            
            /* Container Style */
            .${APPID}-container {
                position: relative;
            }

            /* Default Positions */
            .${APPID}-btn-view-image {
                top: 8px;
            }
            .${APPID}-btn-visit-page {
                top: 48px; /* 8px (top) + 32px (btn) + 8px (gap) */
            }

            /* Toast */
            .${APPID}-toast-container {
                position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
                z-index: 2147483647; display: flex; flex-direction: column; gap: 8px;
            }
            .${APPID}-toast {
                padding: 10px 20px; border-radius: 24px; color: white;
                font-family: Roboto, Arial, sans-serif; font-size: 14px;
                box-shadow: 0 4px 12px rgb(0 0 0 / 0.3);
                animation: ${APPID}-fade-in 0.3s ease-out;
            }
            .${APPID}-toast-info { background-color: #333; }
            .${APPID}-toast-warn { background-color: #FBBC04; color: #202124; }
            .${APPID}-toast-error { background-color: #d93025; }
            @keyframes ${APPID}-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `,
        HOVER_ENABLE: `
            .${APPID}-icon-btn {
                opacity: 0;
                pointer-events: none;
            }
            .${APPID}-container:hover .${APPID}-icon-btn {
                opacity: 1;
                pointer-events: auto;
            }
        `,
        HOVER_DISABLE: `
            .${APPID}-icon-btn {
                opacity: 1;
                pointer-events: auto;
            }
        `,
    };

    // =================================================================================
    // SECTION: Logging Utility
    // Description: Centralized logging interface for consistent log output across modules.
    //              Handles log level control, message formatting, and console API wrapping.
    // =================================================================================

    class Logger {
        /** @property {object} levels - Defines the numerical hierarchy of log levels. */
        static levels = {
            error: 0,
            warn: 1,
            info: 2,
            log: 3,
            debug: 4,
        };
        /** @property {string} level - The current active log level. */
        static level = 'log'; // Default level

        /**
         * Defines the available badge styles.
         * @property {object} styles
         */
        static styles = {
            BASE: 'color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
            RED: 'background: #dc3545;',
            YELLOW: 'background: #ffc107; color: black;',
            GREEN: 'background: #28a745;',
            BLUE: 'background: #007bff;',
            GRAY: 'background: #6c757d;',
            ORANGE: 'background: #fd7e14;',
            PINK: 'background: #e83e8c;',
            PURPLE: 'background: #6f42c1;',
            CYAN: 'background: #17a2b8; color: black;',
            TEAL: 'background: #20c997; color: black;',
        };

        /**
         * Maps log levels to default badge styles.
         * @private
         */
        static _defaultStyles = {
            error: this.styles.RED,
            warn: this.styles.YELLOW,
            info: this.styles.BLUE,
            log: this.styles.GREEN,
            debug: this.styles.GRAY,
        };

        /**
         * Sets the current log level.
         * @param {string} level The new log level. Must be one of 'error', 'warn', 'info', 'log', 'debug'.
         */
        static setLevel(level) {
            if (Object.prototype.hasOwnProperty.call(this.levels, level)) {
                this.level = level;
            } else {
                // Use default style (empty string) for the badge
                this._out('warn', 'INVALID LEVEL', '', `Invalid log level "${level}". Valid levels are: ${Object.keys(this.levels).join(', ')}. Level not changed.`);
            }
        }

        /**
         * Internal method to output logs if the level permits.
         * @private
         * @param {string} level - The log level ('error', 'warn', 'info', 'log', 'debug').
         * @param {string} badgeText - The text inside the badge. If empty, no badge is shown.
         * @param {string} badgeStyle - The background-color style (from Logger.styles). If empty, uses default.
         * @param {...any} args - The messages to log.
         */
        static _out(level, badgeText, badgeStyle, ...args) {
            if (this.levels[this.level] >= this.levels[level]) {
                const consoleMethod = console[level] || console.log;

                if (badgeText !== '') {
                    // Badge mode: Use %c formatting
                    let style = badgeStyle;
                    if (style === '') {
                        style = this._defaultStyles[level] || this.styles.GRAY;
                    }
                    const combinedStyle = `${this.styles.BASE} ${style}`;

                    consoleMethod(
                        `%c${LOG_PREFIX}%c %c${badgeText}%c`,
                        'font-weight: bold;', // Style for the prefix
                        'color: inherit;', // Reset for space
                        combinedStyle, // Style for the badge
                        'color: inherit;', // Reset for the rest of the message
                        ...args
                    );
                } else {
                    // No badge mode: Direct output for better object inspection
                    consoleMethod(LOG_PREFIX, ...args);
                }
            }
        }

        /**
         * Internal method to start a log group if the level permits (debug or higher).
         * @private
         * @param {'group'|'groupCollapsed'} method - The console method to use.
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static _groupOut(method, badgeText, badgeStyle, ...args) {
            if (this.levels[this.level] >= this.levels.debug) {
                const consoleMethod = console[method];

                if (badgeText !== '') {
                    let style = badgeStyle;
                    if (style === '') {
                        style = this.styles.GRAY;
                    }
                    const combinedStyle = `${this.styles.BASE} ${style}`;

                    consoleMethod(`%c${LOG_PREFIX}%c %c${badgeText}%c`, 'font-weight: bold;', 'color: inherit;', combinedStyle, 'color: inherit;', ...args);
                } else {
                    consoleMethod(LOG_PREFIX, ...args);
                }
            }
        }

        /**
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static error(badgeText, badgeStyle, ...args) {
            this._out('error', badgeText, badgeStyle, ...args);
        }

        /**
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static warn(badgeText, badgeStyle, ...args) {
            this._out('warn', badgeText, badgeStyle, ...args);
        }

        /**
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static info(badgeText, badgeStyle, ...args) {
            this._out('info', badgeText, badgeStyle, ...args);
        }

        /**
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static log(badgeText, badgeStyle, ...args) {
            this._out('log', badgeText, badgeStyle, ...args);
        }

        /**
         * Logs messages for debugging. Only active in 'debug' level.
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args
         */
        static debug(badgeText, badgeStyle, ...args) {
            this._out('debug', badgeText, badgeStyle, ...args);
        }

        /**
         * Starts a timer for performance measurement. Only active in 'debug' level.
         * @param {string} label The label for the timer.
         */
        static time(label) {
            if (this.levels[this.level] >= this.levels.debug) {
                console.time(`${LOG_PREFIX} ${label}`);
            }
        }

        /**
         * Ends a timer and logs the elapsed time. Only active in 'debug' level.
         * @param {string} label The label for the timer, must match the one used in time().
         */
        static timeEnd(label) {
            if (this.levels[this.level] >= this.levels.debug) {
                console.timeEnd(`${LOG_PREFIX} ${label}`);
            }
        }

        /**
         * Starts a log group. Only active in 'debug' level.
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args The title for the log group.
         */
        static group(badgeText, badgeStyle, ...args) {
            this._groupOut('group', badgeText, badgeStyle, ...args);
        }

        /**
         * Starts a collapsed log group. Only active in 'debug' level.
         * @param {string} badgeText
         * @param {string} badgeStyle
         * @param {...any} args The title for the log group.
         */
        static groupCollapsed(badgeText, badgeStyle, ...args) {
            this._groupOut('groupCollapsed', badgeText, badgeStyle, ...args);
        }

        /**
         * Closes the current log group. Only active in 'debug' level.
         * @returns {void}
         */
        static groupEnd() {
            if (this.levels[this.level] >= this.levels.debug) {
                console.groupEnd();
            }
        }
    }

    // Alias for ease of use
    const LOG_STYLES = Logger.styles;

    // =================================================================================
    // SECTION: Execution Guard
    // Description: Prevents the script from being executed multiple times per page.
    // =================================================================================

    class ExecutionGuard {
        // A shared key for all scripts from the same author to avoid polluting the window object.
        static #GUARD_KEY = `__${OWNERID}_guard__`;
        // A specific key for this particular script.
        static #APP_KEY = `${APPID}_executed`;

        /**
         * Checks if the script has already been executed on the page.
         * @returns {boolean} True if the script has run, otherwise false.
         */
        static hasExecuted() {
            return window[this.#GUARD_KEY]?.[this.#APP_KEY] || false;
        }

        /**
         * Sets the flag indicating the script has now been executed.
         */
        static setExecuted() {
            window[this.#GUARD_KEY] = window[this.#GUARD_KEY] || {};
            window[this.#GUARD_KEY][this.#APP_KEY] = true;
        }
    }

    // =================================================================================
    // SECTION: General Utilities
    // =================================================================================

    /**
     * Schedules a function to run when the browser is idle.
     * Returns a cancel function to abort the scheduled task.
     * In environments without `requestIdleCallback`, this runs asynchronously immediately (1ms delay) to prevent blocking,
     * effectively ignoring the `timeout` constraint by satisfying it instantly.
     * @param {(deadline: IdleDeadline) => void} callback The function to execute.
     * @param {number} timeout The maximum time to wait for idle before forcing execution.
     * @returns {() => void} A function to cancel the scheduled task.
     */
    function runWhenIdle(callback, timeout) {
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(callback, { timeout });
            return () => window.cancelIdleCallback(id);
        } else {
            // Fallback: Execute almost immediately (1ms) to avoid blocking.
            // This satisfies the "run by timeout" contract trivially since 1ms < timeout.
            const id = setTimeout(() => {
                // Provide a minimal IdleDeadline-like object.
                // timeRemaining() returns 50ms to simulate a fresh frame.
                callback({
                    didTimeout: false,
                    timeRemaining: () => 50,
                });
            }, 1);

            return () => clearTimeout(id);
        }
    }

    /**
     * @param {Function} func
     * @param {number} delay
     * @param {boolean} useIdle
     * @returns {((...args: any[]) => void) & { cancel: () => void }}
     */
    function debounce(func, delay, useIdle) {
        let timerId = null;
        let cancelIdle = null;

        const cancel = () => {
            if (timerId !== null) {
                clearTimeout(timerId);
                timerId = null;
            }
            if (cancelIdle) {
                cancelIdle();
                cancelIdle = null;
            }
        };

        const debounced = function (...args) {
            cancel();
            timerId = setTimeout(() => {
                timerId = null; // Timer finished
                if (useIdle) {
                    // Calculate idle timeout based on delay: clamp(delay * 4, 200, 2000)
                    // This ensures short delays don't wait too long, while long delays are capped.
                    const idleTimeout = Math.min(Math.max(delay * 4, 200), 2000);

                    // Schedule idle callback and store the cancel function
                    // Explicitly receive 'deadline' to match runWhenIdle signature
                    cancelIdle = runWhenIdle((deadline) => {
                        cancelIdle = null; // Idle callback finished
                        func.apply(this, args);
                    }, idleTimeout);
                } else {
                    func.apply(this, args);
                }
            }, delay);
        };

        debounced.cancel = cancel;
        return debounced;
    }

    /**
     * Helper function to check if an item is a non-array object.
     * @param {unknown} item The item to check.
     * @returns {item is Record<string, any>}
     */
    function isObject(item) {
        return !!(item && typeof item === 'object' && !Array.isArray(item));
    }

    /**
     * Creates a deep copy of a JSON-serializable object.
     * @template T
     * @param {T} obj The object to clone.
     * @returns {T} The deep copy of the object.
     */
    function deepClone(obj) {
        try {
            return structuredClone(obj);
        } catch (e) {
            Logger.error('CLONE FAILED', '', 'deepClone failed. Data contains non-clonable items.', e);
            throw e;
        }
    }

    /**
     * Recursively resolves the configuration by overlaying source properties onto the target object.
     * The target object is mutated. This handles recursive updates for nested objects but overwrites arrays/primitives.
     *
     * [MERGE BEHAVIOR]
     * Keys present in 'source' but missing in 'target' are ignored.
     * The 'target' object acts as a schema; it must contain all valid keys.
     *
     * @param {object} target The target object (e.g., a deep copy of default config).
     * @param {object} source The source object (e.g., user config).
     * @returns {object} The mutated target object.
     */
    function resolveConfig(target, source) {
        for (const key in source) {
            // Security: Prevent prototype pollution
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                continue;
            }

            if (Object.prototype.hasOwnProperty.call(source, key)) {
                // Strict check: Ignore keys that do not exist in the target (default config).
                if (!Object.prototype.hasOwnProperty.call(target, key)) {
                    continue;
                }

                const sourceVal = source[key];
                const targetVal = target[key];

                if (isObject(sourceVal) && isObject(targetVal)) {
                    // If both are objects, recurse
                    resolveConfig(targetVal, sourceVal);
                } else if (typeof sourceVal !== 'undefined') {
                    // Otherwise, overwrite or set the value from the source
                    target[key] = sourceVal;
                }
            }
        }
        return target;
    }

    /**
     * @typedef {Node|string|number|boolean|null|undefined} HChild
     */
    /**
     * Creates a DOM element using a hyperscript-style syntax.
     * @param {string} tag - Tag name with optional ID/class (e.g., "div#app.container", "my-element").
     * @param {object | HChild | HChild[]} [propsOrChildren] - Attributes object or children.
     * @param {HChild | HChild[]} [children] - Children (if props are specified).
     * @returns {HTMLElement | SVGElement} The created DOM element.
     */
    function h(tag, propsOrChildren, children) {
        const SVG_NS = 'http://www.w3.org/2000/svg';
        const match = tag.match(/^([a-z0-9-]+)(#[\w-]+)?((\.[\w-]+)*)$/i);
        if (!match) throw new Error(`Invalid tag syntax: ${tag}`);

        const [, tagName, id, classList] = match;
        const isSVG = ['svg', 'circle', 'rect', 'path', 'g', 'line', 'text', 'use', 'defs', 'clipPath'].includes(tagName);
        const el = isSVG ? document.createElementNS(SVG_NS, tagName) : document.createElement(tagName);

        if (id) el.id = id.slice(1);
        if (classList) {
            const classes = classList.replace(/\./g, ' ').trim();
            if (classes) {
                el.classList.add(...classes.split(/\s+/));
            }
        }

        let props = {};
        let childrenArray;
        if (propsOrChildren && Object.prototype.toString.call(propsOrChildren) === '[object Object]') {
            props = propsOrChildren;
            childrenArray = children;
        } else {
            childrenArray = propsOrChildren;
        }

        // --- Start of Attribute/Property Handling ---
        const directProperties = new Set(['value', 'checked', 'selected', 'readOnly', 'disabled', 'multiple', 'textContent']);
        const urlAttributes = new Set(['href', 'src', 'action', 'formaction']);
        const safeProtocols = new Set(['https:', 'http:', 'mailto:', 'tel:', 'blob:', 'data:']);

        for (const [key, value] of Object.entries(props)) {
            // 0. Handle `ref` callback (highest priority after props parsing).
            if (key === 'ref' && typeof value === 'function') {
                value(el);
            }
            // 1. Security check for URL attributes.
            else if (urlAttributes.has(key)) {
                const url = String(value);
                try {
                    const parsedUrl = new URL(url); // Throws if not an absolute URL.
                    if (safeProtocols.has(parsedUrl.protocol)) {
                        el.setAttribute(key, url);
                    } else {
                        el.setAttribute(key, '#');
                        Logger.warn('UNSAFE URL', LOG_STYLES.YELLOW, `Blocked potentially unsafe protocol "${parsedUrl.protocol}" in attribute "${key}":`, url);
                    }
                } catch {
                    el.setAttribute(key, '#');
                    Logger.warn('INVALID URL', LOG_STYLES.YELLOW, `Blocked invalid or relative URL in attribute "${key}":`, url);
                }
            }
            // 2. Direct property assignments.
            else if (directProperties.has(key)) {
                el[key] = value;
            }
            // 3. Other specialized handlers.
            else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else if (key === 'dataset' && typeof value === 'object') {
                for (const [dataKey, dataVal] of Object.entries(value)) {
                    el.dataset[dataKey] = dataVal;
                }
            } else if (key.startsWith('on')) {
                if (typeof value === 'function') {
                    el.addEventListener(key.slice(2).toLowerCase(), value);
                }
            } else if (key === 'className') {
                const classes = String(value).trim();
                if (classes) {
                    el.classList.add(...classes.split(/\s+/));
                }
            } else if (key.startsWith('aria-')) {
                el.setAttribute(key, String(value));
            }
            // 4. Default attribute handling.
            else if (value !== false && value !== null && typeof value !== 'undefined') {
                el.setAttribute(key, value === true ? '' : String(value));
            }
        }
        // --- End of Attribute/Property Handling ---

        const fragment = document.createDocumentFragment();
        /**
         * Appends a child node or text to the document fragment.
         * @param {HChild} child - The child to append.
         */
        function append(child) {
            if (child === null || child === false || typeof child === 'undefined') return;
            if (typeof child === 'string' || typeof child === 'number') {
                fragment.appendChild(document.createTextNode(String(child)));
            } else if (Array.isArray(child)) {
                child.forEach(append);
            } else if (child instanceof Node) {
                fragment.appendChild(child);
            } else {
                throw new Error('Unsupported child type');
            }
        }
        append(childrenArray);

        el.appendChild(fragment);

        if (el instanceof HTMLElement || el instanceof SVGElement) {
            return el;
        }
        throw new Error('Created element is not a valid HTMLElement or SVGElement');
    }

    /**
     * Recursively builds a DOM element from a definition object using the h() function.
     * @param {object} def The definition object for the element.
     * @returns {HTMLElement | SVGElement | null} The created DOM element.
     */
    function createIconFromDef(def) {
        if (!def) return null;
        const children = def.children ? def.children.map((child) => createIconFromDef(child)) : [];
        return h(def.tag, def.props, children);
    }

    // =================================================================================
    // SECTION: Event-Driven Architecture (Pub/Sub)
    // Description: A event bus for decoupled communication between classes.
    // =================================================================================

    const EventBus = {
        events: {},
        uiWorkQueue: [],
        isUiWorkScheduled: false,
        _logAggregation: {},
        // prettier-ignore
        _aggregatedEvents: new Set([
        ]),
        _aggregationDelay: 500, // ms

        /**
         * Subscribes a listener to an event using a unique key.
         * If a subscription with the same event and key already exists, it will be overwritten.
         * @param {string} event The event name.
         * @param {Function} listener The callback function.
         * @param {string} key A unique key for this subscription (e.g., 'ClassName.methodName').
         */
        subscribe(event, listener, key) {
            if (!key) {
                Logger.error('', '', 'EventBus.subscribe requires a unique key.');
                return;
            }
            if (!this.events[event]) {
                this.events[event] = new Map();
            }
            this.events[event].set(key, listener);
        },
        /**
         * Subscribes a listener that will be automatically unsubscribed after one execution.
         * @param {string} event The event name.
         * @param {Function} listener The callback function.
         * @param {string} key A unique key for this subscription.
         */
        once(event, listener, key) {
            if (!key) {
                Logger.error('', '', 'EventBus.once requires a unique key.');
                return;
            }
            const onceListener = (...args) => {
                this.unsubscribe(event, key);
                listener(...args);
            };
            this.subscribe(event, onceListener, key);
        },
        /**
         * Unsubscribes a listener from an event using its unique key.
         * @param {string} event The event name.
         * @param {string} key The unique key used during subscription.
         */
        unsubscribe(event, key) {
            if (!this.events[event] || !key) {
                return;
            }
            this.events[event].delete(key);
            if (this.events[event].size === 0) {
                delete this.events[event];
            }
        },
        /**
         * Publishes an event, calling all subscribed listeners with the provided data.
         * @param {string} event The event name.
         * @param {...any} args The data to pass to the listeners.
         */
        publish(event, ...args) {
            if (!this.events[event]) {
                return;
            }

            if (Logger.levels[Logger.level] >= Logger.levels.debug) {
                // --- Aggregation logic START ---
                if (this._aggregatedEvents.has(event)) {
                    if (!this._logAggregation[event]) {
                        this._logAggregation[event] = { timer: null, count: 0 };
                    }
                    const aggregation = this._logAggregation[event];
                    aggregation.count++;

                    clearTimeout(aggregation.timer);
                    aggregation.timer = setTimeout(() => {
                        const finalCount = this._logAggregation[event]?.count || 0;
                        if (finalCount > 0) {
                            Logger.debug('EventBus', LOG_STYLES.PURPLE, `Event Published: ${event} (x${finalCount})`);
                        }
                        delete this._logAggregation[event];
                    }, this._aggregationDelay);

                    // Execute subscribers for the aggregated event, but without the verbose individual logs.
                    [...this.events[event].values()].forEach((listener) => {
                        try {
                            listener(...args);
                        } catch (e) {
                            Logger.error('', '', `EventBus error in listener for event "${event}":`, e);
                        }
                    });
                    return; // End execution here for aggregated events in debug mode.
                }
                // --- Aggregation logic END ---

                // In debug mode, provide detailed logging for NON-aggregated events.
                const subscriberKeys = [...this.events[event].keys()];

                Logger.groupCollapsed('EventBus', LOG_STYLES.PURPLE, `Event Published: ${event}`);

                if (args.length > 0) {
                    console.log('  - Payload:', ...args);
                } else {
                    console.log('  - Payload: (No data)');
                }

                // Displaying subscribers helps in understanding the event's impact.
                if (subscriberKeys.length > 0) {
                    console.log('  - Subscribers:\n' + subscriberKeys.map((key) => `    > ${key}`).join('\n'));
                } else {
                    console.log('  - Subscribers: (None)');
                }

                // Iterate with keys for better logging
                this.events[event].forEach((listener, key) => {
                    try {
                        // Log which specific subscriber is being executed
                        Logger.debug('', LOG_STYLES.PURPLE, `-> Executing: ${key}`);
                        listener(...args);
                    } catch (e) {
                        // Enhance error logging with the specific subscriber key
                        Logger.error('LISTENER ERROR', LOG_STYLES.RED, `Listener "${key}" failed for event "${event}":`, e);
                    }
                });

                Logger.groupEnd();
            } else {
                // Iterate over a copy of the values in case a listener unsubscribes itself.
                [...this.events[event].values()].forEach((listener) => {
                    try {
                        listener(...args);
                    } catch (e) {
                        Logger.error('LISTENER ERROR', LOG_STYLES.RED, `Listener failed for event "${event}":`, e);
                    }
                });
            }
        },

        /**
         * Queues a function to be executed on the next animation frame.
         * Batches multiple UI updates into a single repaint cycle.
         * @param {Function} workFunction The function to execute.
         */
        queueUIWork(workFunction) {
            this.uiWorkQueue.push(workFunction);
            if (!this.isUiWorkScheduled) {
                this.isUiWorkScheduled = true;
                requestAnimationFrame(this._processUIWorkQueue.bind(this));
            }
        },

        /**
         * @private
         * Processes all functions in the UI work queue.
         */
        _processUIWorkQueue() {
            // Prevent modifications to the queue while processing.
            const queueToProcess = [...this.uiWorkQueue];
            this.uiWorkQueue.length = 0;

            for (const work of queueToProcess) {
                try {
                    work();
                } catch (e) {
                    Logger.error('UI QUEUE ERROR', LOG_STYLES.RED, 'Error in queued UI work:', e);
                }
            }
            this.isUiWorkScheduled = false;
        },
    };

    /**
     * Creates a unique, consistent event subscription key for EventBus.
     * @param {object} context The `this` context of the subscribing class instance.
     * @param {string} eventName The full event name from the EVENTS constant.
     * @returns {string} A key in the format 'ClassName.purpose'.
     */
    function createEventKey(context, eventName) {
        // Extract a meaningful 'purpose' from the event name
        const parts = eventName.split(':');
        const purpose = parts.length > 1 ? parts.slice(1).join('_') : parts[0];

        let contextName = 'UnknownContext';
        if (context && context.constructor && context.constructor.name) {
            contextName = context.constructor.name;
        }
        return `${contextName}.${purpose}`;
    }

    // =================================================================================
    // SECTION: Configuration Management
    // =================================================================================

    class ConfigManager {
        constructor() {
            this.config = null;
        }
        async load() {
            const raw = await GM.getValue(CONSTANTS.CONFIG_KEY, null);
            this.config = resolveConfig(deepClone(DEFAULT_CONFIG), raw ? JSON.parse(raw) : {});
            Logger.setLevel(this.config.developer.logger_level);
        }
        async save(newConfig) {
            this.config = resolveConfig(deepClone(DEFAULT_CONFIG), newConfig);
            await GM.setValue(CONSTANTS.CONFIG_KEY, JSON.stringify(this.config));
            EventBus.publish(EVENTS.CONFIG_UPDATED, this.config);
        }
        get() {
            return this.config || deepClone(DEFAULT_CONFIG);
        }
    }

    // =================================================================================
    // SECTION: Settings Modal
    // =================================================================================

    class SettingsModal {
        /**
         * @param {ConfigManager} configManager
         * @param {object} siteStyles - The style definition object.
         */
        constructor(configManager, siteStyles) {
            this.configManager = configManager;
            this.siteStyles = siteStyles;
            this.overlay = null;
            // Bind the keydown handler once to ensure consistent reference for add/removeEventListener
            this._boundHandleKeyDown = this._handleKeyDown.bind(this);
        }

        /**
         * Opens the settings modal.
         */
        open() {
            if (this.overlay) return;

            // Inject styles dynamically using the provided siteStyles
            this._injectStyles();

            const config = this.configManager.get();

            // --- Helper: Dynamic Description Maps ---

            // Referrer Policy Descriptions
            const referrerDescMap = {
                [CONSTANTS.REFERRER_POLICY.NO_REFERRER]: {
                    text: 'No referrer information is sent. Maximum privacy, but many images or pages may fail to load due to anti-hotlink protection.',
                    color: 'inherit',
                },
                [CONSTANTS.REFERRER_POLICY.ORIGIN]: {
                    text: 'Only the domain name is sent. Balances privacy and functionality, though some strict sites may still block access.',
                    color: '#81c995',
                },
                [CONSTANTS.REFERRER_POLICY.UNSAFE_URL]: {
                    text: 'The full URL including search queries is sent. Highest compatibility, but exposes your search data to the site.',
                    color: '#ff8a80',
                },
            };

            const createReferrerDesc = (val) => {
                const info = referrerDescMap[val] || referrerDescMap[CONSTANTS.REFERRER_POLICY.ORIGIN];
                return h(`div#${APPID}-referrer-desc`, { style: { marginTop: '4px', color: info.color } }, info.text);
            };

            // Fetch Strategy Descriptions
            const strategyDescMap = {
                [CONSTANTS.FETCH_STRATEGY.AUTO]: 'Checks headers first. Uses Blob mode (hidden URL) if forced download is detected. Adds slight delay.',
                [CONSTANTS.FETCH_STRATEGY.BLOB]: "Loads images as 'blob:' URLs. Fast, but the original URL is hidden (visible only in Console). Consumes memory.",
                [CONSTANTS.FETCH_STRATEGY.DIRECT]: 'Opens the URL directly. Zero overhead, but may trigger forced downloads.',
            };

            const createStrategyDesc = (val) => {
                const text = strategyDescMap[val] || strategyDescMap[CONSTANTS.FETCH_STRATEGY.AUTO];
                return h(`div#${APPID}-strategy-desc`, { style: { marginTop: '4px', color: '#9aa0a6' } }, text);
            };

            // --- Helper: Interaction Logic ---

            const updateRetryState = (strategy) => {
                const retryWrapper = document.getElementById(`${APPID}-retry-wrapper`);
                const retryInput = document.getElementById(`${APPID}-input-retry`);
                const retryDesc = document.getElementById(`${APPID}-retry-desc`);

                if (!retryWrapper || !retryInput) return;

                const isDisabled = strategy === CONSTANTS.FETCH_STRATEGY.DIRECT;
                const opacity = isDisabled ? '0.5' : '1';

                retryInput.disabled = isDisabled;
                retryWrapper.style.opacity = opacity;
                retryWrapper.style.pointerEvents = isDisabled ? 'none' : 'auto';

                if (retryDesc) {
                    retryDesc.style.opacity = opacity;
                }
            };

            // --- Modal Construction ---

            this.overlay = h(
                `div.${APPID}-modal-overlay`,
                {
                    onclick: (e) => {
                        if (e.target === this.overlay) this.close();
                    },
                },
                [
                    h(`div.${APPID}-modal-box`, [
                        // Header
                        h(`div.${APPID}-modal-header`, [h('span', `${APPNAME} Settings`)]),

                        // Content
                        h(`div.${APPID}-modal-content`, [
                            // Group 1: Appearance
                            this._createFormGroup('Appearance', '', [
                                h(
                                    `label.${APPID}-checkbox-wrapper`,
                                    {
                                        title: 'Reduces visual clutter by hiding buttons until you hover over an image result.',
                                    },
                                    [
                                        h(`input#${APPID}-input-hover`, {
                                            type: 'checkbox',
                                            checked: config.common.showOnlyOnHover,
                                        }),
                                        h('span', 'Show buttons only on hover'),
                                    ]
                                ),
                                h(
                                    `label.${APPID}-checkbox-wrapper`,
                                    {
                                        title: 'Displays the globe button that takes you directly to the webpage hosting the image.',
                                    },
                                    [
                                        h(`input#${APPID}-input-page-btn`, {
                                            type: 'checkbox',
                                            checked: config.common.showVisitPageButton,
                                        }),
                                        h('span', 'Show "Visit Page" button'),
                                    ]
                                ),
                            ]),

                            h('hr', { style: { border: '0', borderTop: '1px solid #5f6368', margin: '8px 0 16px 0' } }),

                            // Group 2: Network & Privacy
                            this._createFormGroup('Network & Privacy', '', [
                                // 1. Fetch Strategy
                                h(
                                    `label.${APPID}-form-label`,
                                    {
                                        style: { fontWeight: 'normal', marginBottom: '4px' },
                                        title: 'Controls how images are fetched and opened.',
                                    },
                                    'Fetch Strategy'
                                ),
                                h(
                                    `select#${APPID}-input-strategy.${APPID}-form-select`,
                                    {
                                        onchange: (e) => {
                                            const val = e.target.value;
                                            const descEl = document.getElementById(`${APPID}-strategy-desc`);
                                            if (descEl) {
                                                descEl.textContent = strategyDescMap[val] || strategyDescMap[CONSTANTS.FETCH_STRATEGY.AUTO];
                                            }
                                            updateRetryState(val);
                                        },
                                        title: 'Select the strategy for fetching and opening images.',
                                    },
                                    [
                                        h('option', { value: CONSTANTS.FETCH_STRATEGY.AUTO, selected: config.common.fetchStrategy === CONSTANTS.FETCH_STRATEGY.AUTO }, 'Auto Detect (Default)'),
                                        h('option', { value: CONSTANTS.FETCH_STRATEGY.BLOB, selected: config.common.fetchStrategy === CONSTANTS.FETCH_STRATEGY.BLOB }, 'Always Blob (Fast)'),
                                        h('option', { value: CONSTANTS.FETCH_STRATEGY.DIRECT, selected: config.common.fetchStrategy === CONSTANTS.FETCH_STRATEGY.DIRECT }, 'Always Direct'),
                                    ]
                                ),
                                createStrategyDesc(config.common.fetchStrategy || CONSTANTS.FETCH_STRATEGY.AUTO),

                                // 2. Referrer Policy
                                h(
                                    `label.${APPID}-form-label`,
                                    {
                                        style: { fontWeight: 'normal', marginBottom: '4px', marginTop: '16px' },
                                        title: 'Controls referrer data sent to the destination. Balances privacy with image loading success.',
                                    },
                                    'Referrer Policy'
                                ),
                                h(
                                    `select#${APPID}-input-referrer.${APPID}-form-select`,
                                    {
                                        onchange: (e) => {
                                            const descEl = document.getElementById(`${APPID}-referrer-desc`);
                                            if (descEl) {
                                                const info = referrerDescMap[e.target.value] || referrerDescMap[CONSTANTS.REFERRER_POLICY.ORIGIN];
                                                descEl.textContent = info.text;
                                                descEl.style.color = info.color;
                                            }
                                        },
                                        title: 'Controls what information is sent to the destination site.',
                                    },
                                    [
                                        h('option', { value: CONSTANTS.REFERRER_POLICY.NO_REFERRER, selected: config.common.referrerPolicy === CONSTANTS.REFERRER_POLICY.NO_REFERRER }, 'No Referrer'),
                                        h('option', { value: CONSTANTS.REFERRER_POLICY.ORIGIN, selected: config.common.referrerPolicy === CONSTANTS.REFERRER_POLICY.ORIGIN || !config.common.referrerPolicy }, 'Origin Only (Default)'),
                                        h('option', { value: CONSTANTS.REFERRER_POLICY.UNSAFE_URL, selected: config.common.referrerPolicy === CONSTANTS.REFERRER_POLICY.UNSAFE_URL }, 'Full URL'),
                                    ]
                                ),
                                createReferrerDesc(config.common.referrerPolicy || CONSTANTS.REFERRER_POLICY.ORIGIN),

                                // 3. Retry on failure
                                h('div', { style: { marginTop: '16px' } }, [
                                    h(
                                        `label#${APPID}-retry-wrapper.${APPID}-checkbox-wrapper`,
                                        {
                                            title: 'Automatically retries with an alternative referrer policy if the initial attempt fails.',
                                            style: { transition: 'opacity 0.2s' },
                                        },
                                        [
                                            h(`input#${APPID}-input-retry`, {
                                                type: 'checkbox',
                                                checked: config.common.retryOnFailure,
                                            }),
                                            h('span', 'Retry on failure'),
                                        ]
                                    ),
                                    h(`div#${APPID}-retry-desc.${APPID}-form-desc`, { style: { marginLeft: '24px', transition: 'opacity 0.2s' } }, 'Automatically retries with an alternative referrer policy if the initial attempt fails.'),
                                ]),
                            ]),

                            h('hr', { style: { border: '0', borderTop: '1px solid #5f6368', margin: '8px 0 16px 0' } }),

                            // Group 3: Advanced Settings
                            this._createFormGroup('Advanced Settings', '', [
                                h(
                                    `label.${APPID}-form-label`,
                                    {
                                        style: { fontWeight: 'normal', marginBottom: '4px' },
                                        title: 'Determines how long the image data is kept in memory.',
                                    },
                                    'Blob URL Revoke Time'
                                ),
                                h(
                                    `select#${APPID}-input-revoke-time.${APPID}-form-select`,
                                    {
                                        title: 'Determines how long the image data is kept in memory.',
                                    },
                                    [
                                        h('option', { value: 60000, selected: Number(config.common.blobRevokeTimeout) === 60000 }, '1 Minute (Low Memory)'),
                                        h('option', { value: 300000, selected: Number(config.common.blobRevokeTimeout) === 300000 }, '5 Minutes'),
                                        h('option', { value: 600000, selected: Number(config.common.blobRevokeTimeout) === 600000 || !config.common.blobRevokeTimeout }, '10 Minutes (Default)'),
                                        h('option', { value: 1800000, selected: Number(config.common.blobRevokeTimeout) === 1800000 }, '30 Minutes'),
                                        h('option', { value: 3600000, selected: Number(config.common.blobRevokeTimeout) === 3600000 }, '1 Hour (High Memory)'),
                                    ]
                                ),
                                h(`div.${APPID}-form-desc`, { style: { marginTop: '4px' } }, 'Time to hold image data in memory. Increase this if images fail to load when viewing background tabs after a delay.'),
                            ]),
                        ]),

                        // Footer
                        h(`div.${APPID}-modal-footer`, [
                            // Left: Restore Defaults
                            h(`button.${APPID}-ui-btn.${APPID}-btn-secondary`, { onclick: () => this._restoreDefaults() }, 'Restore Defaults'),
                            // Right: Actions
                            h(`div.${APPID}-footer-actions`, [
                                h(`button.${APPID}-ui-btn.${APPID}-btn-secondary`, { onclick: () => this.close() }, 'Cancel'),
                                h(`button.${APPID}-ui-btn.${APPID}-btn-primary`, { onclick: () => this.save() }, 'Save'),
                            ]),
                        ]),
                    ]),
                ]
            );

            document.body.appendChild(this.overlay);

            // Initialize Retry state based on current strategy
            updateRetryState(config.common.fetchStrategy || CONSTANTS.FETCH_STRATEGY.AUTO);

            // Add global key listener for ESC
            document.addEventListener('keydown', this._boundHandleKeyDown);
        }

        /**
         * Closes the settings modal.
         */
        close() {
            if (this.overlay) {
                // Remove global key listener
                document.removeEventListener('keydown', this._boundHandleKeyDown);

                this.overlay.remove();
                this.overlay = null;
            }
        }

        /**
         * Saves the current settings from the form.
         */
        async save() {
            const newConfig = this.configManager.get();

            // Collect values from DOM
            newConfig.common.showOnlyOnHover = document.getElementById(`${APPID}-input-hover`).checked;
            newConfig.common.showVisitPageButton = document.getElementById(`${APPID}-input-page-btn`).checked;
            newConfig.common.fetchStrategy = document.getElementById(`${APPID}-input-strategy`).value;
            newConfig.common.referrerPolicy = document.getElementById(`${APPID}-input-referrer`).value;
            newConfig.common.retryOnFailure = document.getElementById(`${APPID}-input-retry`).checked;
            newConfig.common.blobRevokeTimeout = Number(document.getElementById(`${APPID}-input-revoke-time`).value);

            await this.configManager.save(newConfig);
            this.close();
        }

        /**
         * Restores default settings to the form inputs.
         * @private
         */
        _restoreDefaults() {
            // Restore Checkboxes
            document.getElementById(`${APPID}-input-hover`).checked = DEFAULT_CONFIG.common.showOnlyOnHover;
            document.getElementById(`${APPID}-input-page-btn`).checked = DEFAULT_CONFIG.common.showVisitPageButton;

            // Strategy (Triggers Retry state update via change event)
            const strategyInput = document.getElementById(`${APPID}-input-strategy`);
            strategyInput.value = DEFAULT_CONFIG.common.fetchStrategy;
            strategyInput.dispatchEvent(new Event('change'));

            // Referrer (Triggers description update)
            const referrerInput = document.getElementById(`${APPID}-input-referrer`);
            referrerInput.value = DEFAULT_CONFIG.common.referrerPolicy;
            referrerInput.dispatchEvent(new Event('change'));

            // Retry
            document.getElementById(`${APPID}-input-retry`).checked = DEFAULT_CONFIG.common.retryOnFailure;

            // Advanced
            document.getElementById(`${APPID}-input-revoke-time`).value = DEFAULT_CONFIG.common.blobRevokeTimeout;
        }

        /**
         * Handles global keydown events.
         * @private
         */
        _handleKeyDown(e) {
            if (e.key === 'Escape') {
                this.close();
            }
        }

        /**
         * Helper to create a labeled form group with indented content.
         * @private
         */
        _createFormGroup(label, desc, control) {
            return h(`div.${APPID}-form-group`, [h(`label.${APPID}-form-label`, label), h(`div.${APPID}-indent-content`, [control, desc ? h(`div.${APPID}-form-desc`, desc) : null])]);
        }

        /**
         * Injects the modal styles dynamically.
         * Enforces a fixed Dark Mode theme as requested.
         * @private
         */
        _injectStyles() {
            const id = `${APPID}-modal-dynamic-styles`;
            if (document.getElementById(id)) return;

            // Fixed Dark Mode Palette (Google-like Dark Theme)
            const css = `
                .${APPID}-modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgb(0 0 0 / 0.6);
                    z-index: ${CONSTANTS.MODAL.Z_INDEX};
                    display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(2px);
                }
                .${APPID}-modal-box {
                    background: #202124;
                    color: #e8eaed;
                    width: ${CONSTANTS.MODAL.WIDTH}px;
                    max-width: 90vw;
                    max-height: 90vh; /* Limit height to viewport */
                    border: 1px solid #5f6368;
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgb(0 0 0 / 0.5);
                    display: flex; flex-direction: column;
                    font-family: Roboto, Arial, sans-serif; font-size: 14px;
                    color-scheme: dark;
                }
                .${APPID}-modal-header {
                    padding: 12px 16px;
                    font-size: 1.1em; font-weight: bold;
                    border-bottom: 1px solid #5f6368;
                    display: flex; justify-content: space-between; align-items: center;
                    background: #202124;
                    border-radius: 8px 8px 0 0;
                    flex-shrink: 0; /* Prevent shrinking */
                }
                .${APPID}-modal-content {
                    padding: 16px;
                    overflow-y: auto;
                    flex: 1; /* Fill remaining space */
                    min-height: 0; /* Enable scrolling inside flex item */
                }
                .${APPID}-modal-footer {
                    padding: 12px 16px;
                    border-top: 1px solid #5f6368;
                    display: flex; justify-content: space-between;
                    align-items: center;
                    background: #202124;
                    border-radius: 0 0 8px 8px;
                    flex-shrink: 0; /* Prevent shrinking */
                }
                .${APPID}-footer-actions {
                    display: flex; gap: 8px;
                }
                .${APPID}-form-group {
                    margin-bottom: 16px;
                }
                .${APPID}-form-label {
                    display: block; margin-bottom: 8px; font-weight: 600; color: #e8eaed;
                }
                .${APPID}-indent-content {
                    margin-left: 12px;
                    display: flex; flex-direction: column;
                    gap: 8px;
                }
                .${APPID}-form-desc {
                    color: #9aa0a6; margin-bottom: 6px; line-height: 1.4;
                }
                .${APPID}-form-input {
                    width: 100%; padding: 6px 8px;
                    background: #303134; border: 1px solid #5f6368; border-radius: 4px;
                    color: #e8eaed; box-sizing: border-box;
                }
                .${APPID}-form-input:focus {
                    border-color: #8ab4f8; outline: 1px solid #8ab4f8;
                }
                .${APPID}-form-select {
                    width: 100%; padding: 6px 8px;
                    background: #303134; border: 1px solid #5f6368; border-radius: 4px;
                    color: #e8eaed; box-sizing: border-box;
                    cursor: pointer;
                }
                .${APPID}-form-select:focus {
                    border-color: #8ab4f8; outline: 1px solid #8ab4f8;
                }
                .${APPID}-checkbox-wrapper {
                    display: flex; align-items: center; gap: 8px; color: #e8eaed;
                }
                .${APPID}-ui-btn {
                    padding: 6px 16px; border-radius: 4px; border: 1px solid #5f6368;
                    cursor: pointer; font-size: 13px; font-weight: 500;
                    transition: background 0.1s;
                    white-space: nowrap;
                }
                .${APPID}-btn-primary {
                    background: #8ab4f8; color: #202124; border: 1px solid #8ab4f8;
                }
                .${APPID}-btn-primary:hover {
                    opacity: 0.9;
                }
                .${APPID}-btn-secondary {
                    background: #303134; color: #e8eaed;
                }
                .${APPID}-btn-secondary:hover {
                    background: #3c4043;
                }
                
                /* Mobile Responsive */
                @media (max-width: 480px) {
                    .${APPID}-modal-box {
                        width: 95vw;
                        max-height: 95vh;
                    }
                }
            `;

            const style = h('style', { id }, css);
            // Add nonce if available
            const nonce = document.querySelector('script[nonce]')?.nonce;
            if (nonce) style.setAttribute('nonce', nonce);

            document.head.appendChild(style);
        }
    }

    // =================================================================================
    // SECTION: UI Manager
    // =================================================================================

    class UIManager {
        /**
         * @param {ConfigManager} configManager
         */
        constructor(configManager) {
            this.configManager = configManager;
            this.toastContainer = null;
            this.subscriptions = [];
            this.imageBtnTemplate = null;
            this.pageBtnTemplate = null;
            this.urlFetcher = null;

            /**
             * Stores state associated with button elements without polluting the DOM.
             * Key: Button Element
             * Value: { sentinel: HTMLElement, isFetching: boolean, activeBlobUrl: string|null, activeRevokeTimer: number|null, hostSource: string|null }
             * @type {WeakMap<HTMLElement, object>}
             */
            this.btnState = new WeakMap();

            // Pre-bind event handlers to avoid closure creation per button
            this.handleImageClick = this._handleImageClick.bind(this);
            this.handlePageClick = this._handlePageClick.bind(this);
            this.handleHoverOrFocus = this._handleHoverOrFocus.bind(this);
            this.handleMouseDown = this._handleMouseDown.bind(this);
            this.stopProp = this._stopProp.bind(this);

            this._subscribe(EVENTS.CONFIG_UPDATED, () => this.updateStyles());
        }

        /**
         * Helper to subscribe to EventBus events with automatic key management.
         * @param {string} event - The event name to subscribe to.
         * @param {Function} listener - The callback function.
         * @private
         */
        _subscribe(event, listener) {
            const key = createEventKey(this, event);
            EventBus.subscribe(event, listener.bind(this), key);
            this.subscriptions.push({ event, key });
        }

        /**
         * Initializes the UI Manager with platform-specific styles.
         * @param {object} platformStyles - The style configuration for the current platform.
         */
        init(platformStyles) {
            this._injectStyles(platformStyles);
            this.updateStyles();
            this._createToastContainer();

            // Prepare the button templates once for performance (cloneNode usage)
            const commonProps = {
                target: '_blank',
                rel: 'noopener noreferrer',
                referrerpolicy: 'no-referrer',
                // Reset text decoration and force color to avoid "visited" link style issues
                style: { textDecoration: 'none' }, // Color assignment delegated to CSS class
                draggable: 'false',
            };

            // 1. Image Button Template
            this.imageBtnTemplate = h(`a.${APPID}-icon-btn.${APPID}-btn-view-image`, { ...commonProps, title: 'View Image' }, [createIconFromDef(CONSTANTS.ICONS.IMAGE)]);
            this.imageBtnTemplate.setAttribute('href', '#');

            // 2. Page Button Template
            this.pageBtnTemplate = h(`a.${APPID}-icon-btn.${APPID}-btn-visit-page`, { ...commonProps, title: 'Visit Page' }, [createIconFromDef(CONSTANTS.ICONS.GLOBE)]);
            this.pageBtnTemplate.setAttribute('href', '#');
        }

        /**
         * Registers the function used to extract URLs from a container.
         * @param {Function} fetcherFn - Function that takes a container element and returns { imageUrl, hostUrl, hostUrlSource }.
         */
        setUrlFetcher(fetcherFn) {
            this.urlFetcher = fetcherFn;
        }

        /**
         * Registers the function used to asynchronously fetch original image URLs.
         * @param {Function} fetcherFn - Async function that takes a sentinel element and returns a Promise resolving to the URL.
         */
        setOriginalImageFetcher(fetcherFn) {
            this.originalImageFetcher = fetcherFn;
        }

        /**
         * Injects base styles and platform-specific CSS variables.
         * @param {object} platformStyles
         */
        _injectStyles(platformStyles) {
            const id = `${APPID}-styles`;
            if (document.getElementById(id)) return;

            // 1. Generate CSS Variables from platformStyles.vars
            let varDef = ':root {\n';
            if (platformStyles && platformStyles.vars) {
                for (const [key, val] of Object.entries(platformStyles.vars)) {
                    varDef += `  ${key}: ${val};\n`;
                }
            }
            varDef += '}\n';

            // 2. Add Dark Mode Overrides if present
            if (platformStyles && platformStyles.css_overrides) {
                varDef += platformStyles.css_overrides;
            }

            const cssContent = varDef + UI_STYLES.BASE;

            const style = h('style', { id }, cssContent);
            // Add nonce if available (CSP fix)
            const nonce = document.querySelector('script[nonce]')?.nonce;
            if (nonce) style.setAttribute('nonce', nonce);

            document.head.appendChild(style);
        }

        updateStyles() {
            const config = this.configManager.get();
            const id = `${APPID}-dynamic-styles`;

            // Update global state on body for CSS-based color control
            // dataset uses camelCase: data-gidv-referrer-policy -> gidvReferrerPolicy
            // We namespace it to avoid conflicts
            const datasetKey = `${APPID}ReferrerPolicy`;
            document.body.dataset[datasetKey] = config.common.referrerPolicy;

            // Remove existing dynamic styles to re-apply
            let styleEl = document.getElementById(id);
            if (!styleEl) {
                styleEl = h('style', { id: id, type: 'text/css' });
                // Add nonce if available
                const nonce = document.querySelector('script[nonce]')?.nonce;
                if (nonce) styleEl.setAttribute('nonce', nonce);
                document.head.appendChild(styleEl);
            }

            let css = '';

            // 1. Hover Logic
            css += config.common.showOnlyOnHover ? UI_STYLES.HOVER_ENABLE : UI_STYLES.HOVER_DISABLE;

            // 2. Visit Page Button Visibility
            if (!config.common.showVisitPageButton) {
                css += `.${APPID}-btn-visit-page { display: none !important; }`;
            }

            styleEl.textContent = css;
        }

        _createToastContainer() {
            this.toastContainer = h(`div.${APPID}-toast-container`);
            document.body.appendChild(this.toastContainer);
        }

        showToast(message, type = 'info') {
            if (!this.toastContainer) return;
            const toast = h(`div.${APPID}-toast.${APPID}-toast-${type}`, message);
            this.toastContainer.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), CONSTANTS.TOAST_FADE_OUT_DURATION);
            }, CONSTANTS.TOAST_DURATION);
        }

        /**
         * Attaches the buttons to the target container.
         * @param {HTMLElement} sentinelElement - The element detected by Sentinel (used for duplicate check and data source).
         * @param {HTMLElement} targetContainer - The element where buttons will be inserted.
         */
        attachButtons(sentinelElement, targetContainer) {
            // Prevent duplicates using a specific processed class on the sentinel
            const processedClass = `${APPID}-processed`;
            // NOTE: Even if the class exists, we might need to re-attach buttons if they were removed by the host.
            // But if the class exists AND buttons exist, we typically skip.
            // However, with the :not() selector strategy, this method is called only when the class is MISSING.
            // So we can proceed to add the class and manage buttons.

            if (sentinelElement.classList.contains(processedClass)) {
                // If the class is present, checks if buttons are actually there (Paranoid check)
                const hasImgBtn = targetContainer.querySelector(`.${APPID}-btn-view-image`);
                const hasPageBtn = targetContainer.querySelector(`.${APPID}-btn-visit-page`);
                if (hasImgBtn && hasPageBtn) return;
            }

            // Mark the specific element as processed
            sentinelElement.classList.add(processedClass);

            // Add the class used for hover effects to the container that holds the button.
            targetContainer.classList.add(`${APPID}-container`);

            // Create buttons from template
            const imgBtn = this.imageBtnTemplate.cloneNode(true);
            const pageBtn = this.pageBtnTemplate.cloneNode(true);

            // Initialize state in WeakMap
            const initialState = {
                sentinel: sentinelElement,
                isFetching: false,
                activeBlobUrl: null,
                activeRevokeTimer: null,
                activeThumbnailUrl: null,
                hostSource: null,
            };

            this.btnState.set(imgBtn, { ...initialState });
            this.btnState.set(pageBtn, { ...initialState });

            // Bind events for Image Button
            imgBtn.addEventListener('mouseenter', this.handleHoverOrFocus);
            imgBtn.addEventListener('focus', this.handleHoverOrFocus);
            imgBtn.addEventListener('mousedown', this.handleMouseDown);
            imgBtn.addEventListener('mouseup', this.stopProp);
            imgBtn.addEventListener('click', this.handleImageClick);
            imgBtn.addEventListener('auxclick', this.handleImageClick);

            // Bind events for Page Button
            pageBtn.addEventListener('mouseenter', this.handleHoverOrFocus);
            pageBtn.addEventListener('focus', this.handleHoverOrFocus);
            pageBtn.addEventListener('mousedown', this.handleMouseDown);
            pageBtn.addEventListener('mouseup', this.stopProp);
            pageBtn.addEventListener('click', this.handlePageClick);
            pageBtn.addEventListener('auxclick', this.handlePageClick);

            // [Resilience] Smart Attach: Replace existing buttons if they exist to prevent flickering, otherwise append.
            const mountButton = (newBtn, btnClass) => {
                const existingBtn = targetContainer.querySelector(`.${btnClass}`);
                if (existingBtn) {
                    existingBtn.replaceWith(newBtn);
                } else {
                    targetContainer.appendChild(newBtn);
                }
            };

            mountButton(imgBtn, `${APPID}-btn-view-image`);
            mountButton(pageBtn, `${APPID}-btn-visit-page`);
        }

        /**
         * Handles mouseenter and focus events.
         * Updates the URL but DOES NOT stop propagation, allowing the host site's scripts to detect the user.
         * @param {Event} e
         */
        _handleHoverOrFocus(e) {
            const btn = e.currentTarget;
            if (btn instanceof HTMLAnchorElement) {
                this._updateButtonHref(btn);
            }
        }

        /**
         * Handles mousedown event.
         * Updates the URL without stopping propagation to allow host site scripts to execute.
         * @param {Event} e
         */
        _handleMouseDown(e) {
            const btn = e.currentTarget;
            if (btn instanceof HTMLAnchorElement) {
                this._updateButtonHref(btn);
            }
        }

        /**
         * Waits for the URL to be injected by the host site's scripts.
         * Uses MutationObserver to detect changes in the anchor tag's href attribute.
         * @param {HTMLElement} btn
         * @returns {Promise<void>}
         */
        _waitForValidUrl(btn) {
            return new Promise((resolve) => {
                const state = this.btnState.get(btn);
                if (!state || !state.sentinel) {
                    resolve();
                    return;
                }

                // Identify the anchor tag that receives the URL (sentinel is usually inside it or related)
                const link = state.sentinel.closest('a');
                if (!link) {
                    resolve();
                    return;
                }

                const observer = new MutationObserver(() => {
                    this._updateButtonHref(btn);
                    if (btn.getAttribute('href')) {
                        observer.disconnect();
                        resolve();
                    }
                });

                observer.observe(link, { attributes: true, attributeFilter: ['href', 'data-href', 'jsaction'] });

                // Timeout safety
                setTimeout(() => {
                    observer.disconnect();
                    resolve();
                }, CONSTANTS.WAIT_FOR_VALID_URL_TIMEOUT); // 500ms max wait
            });
        }

        /**
         * Stops event propagation.
         * @param {Event} e
         */
        _stopProp(e) {
            e.stopPropagation();
        }

        /**
         * Updates the href and title of the button based on current DOM state.
         * @param {HTMLAnchorElement} btn
         */
        _updateButtonHref(btn) {
            const state = this.btnState.get(btn);
            if (!this.urlFetcher || !state || !state.sentinel) return;

            // Fetch URLs on-demand from the current state of the DOM
            const { imageUrl, hostUrl, hostUrlSource, thumbnailUrl } = this.urlFetcher(state.sentinel);
            const config = this.configManager.get();
            const currentPolicy = config.common.referrerPolicy;
            let policyChanged = false;

            // Update attributes only if policy has changed (Performance Optimization)
            if (btn.getAttribute('referrerpolicy') !== currentPolicy) {
                btn.setAttribute('referrerpolicy', currentPolicy);
                const relValue = currentPolicy === CONSTANTS.REFERRER_POLICY.NO_REFERRER ? 'noopener noreferrer' : 'noopener';
                btn.setAttribute('rel', relValue);
                policyChanged = true;
            }

            const isImageBtn = btn.classList.contains(`${APPID}-btn-view-image`);

            if (isImageBtn) {
                if (imageUrl) {
                    if (btn.getAttribute('href') !== imageUrl || policyChanged) {
                        btn.href = imageUrl;
                        btn.title = 'View Image';
                    }
                    // Store thumbnail URL in state for fallback
                    state.activeThumbnailUrl = thumbnailUrl;
                } else {
                    // Handling for Async Fetchers (Google/DDG)
                    // If an async fetcher is registered, we assume the URL might be found later via interaction.
                    // We keep the thumbnail URL for potential fallback usage.
                    if (this.originalImageFetcher) {
                        btn.removeAttribute('href');
                        btn.title = 'View Image'; // Suppress "(Not found)" for async contexts
                        state.activeThumbnailUrl = thumbnailUrl;
                    } else {
                        btn.removeAttribute('href');
                        btn.title = 'View Image (Not found)';
                        state.activeThumbnailUrl = null;
                    }
                }
            } else {
                // Page Button
                if (hostUrl) {
                    if (btn.getAttribute('href') !== hostUrl || policyChanged) {
                        btn.href = hostUrl;
                        btn.title = 'Visit Page';
                        state.hostSource = hostUrlSource; // Store for logging
                    }
                } else {
                    btn.removeAttribute('href');
                    btn.title = 'Visit Page (Not found)';
                }
            }
        }

        /**
         * Handles clicking the Image button.
         * Supports both Left Click and Middle Click (auxclick).
         * @param {MouseEvent} e
         */
        async _handleImageClick(e) {
            // Only handle Left Click (0) or Middle Click (1)
            if (e.button !== 0 && e.button !== 1) return;

            // Determine activation behavior based on click type
            // Left Click (without modifiers) -> Active (Foreground)
            // Middle Click OR Ctrl/Meta + Click -> Inactive (Background)
            const isActive = e.button === 0 && !e.ctrlKey && !e.metaKey;

            this._stopProp(e);
            e.preventDefault(); // Always prevent default to control opening behavior

            const btn = e.currentTarget;
            if (!(btn instanceof HTMLAnchorElement)) return;

            const state = this.btnState.get(btn);
            if (!state) return;

            if (state.isFetching) return;
            state.isFetching = true;

            // Visual feedback
            btn.style.opacity = '0.6';
            btn.style.cursor = 'wait';

            const config = this.configManager.get();
            const fetchStrategy = config.common.fetchStrategy || CONSTANTS.FETCH_STRATEGY.AUTO;

            // Notify user that fetch is in progress (since we don't open a tab immediately)
            this.showToast('Fetching image info...', 'info');

            let targetUrl = null;

            try {
                this._updateButtonHref(btn);

                // 1. Fetch URL (Async for DDG/Google)
                if (this.originalImageFetcher) {
                    Logger.info('ASYNC FETCH', LOG_STYLES.PURPLE, 'Fetching original URL via adapter...');
                    targetUrl = await this.originalImageFetcher(state.sentinel);

                    if (targetUrl) {
                        Logger.info('ASYNC SUCCESS', LOG_STYLES.GREEN, `URL: ${targetUrl}`);
                    } else {
                        Logger.warn('ASYNC FAIL', '', 'Fetcher returned null.');
                    }
                }

                // Fallback / Default URL
                if (!targetUrl) {
                    if (!btn.getAttribute('href')) {
                        await this._waitForValidUrl(btn);
                    }
                    targetUrl = btn.href;
                }

                if (!targetUrl || targetUrl === window.location.href) {
                    throw new Error('Image URL not found');
                }

                // Cleanup previous resources
                if (state.activeRevokeTimer) {
                    clearTimeout(state.activeRevokeTimer);
                    state.activeRevokeTimer = null;
                }
                if (state.activeBlobUrl) {
                    URL.revokeObjectURL(state.activeBlobUrl);
                    state.activeBlobUrl = null;
                }

                Logger.info('CHECK START', LOG_STYLES.GRAY, targetUrl);

                // 2. Determine Mode (Blob vs Direct)
                let useBlob = false;

                switch (fetchStrategy) {
                    case CONSTANTS.FETCH_STRATEGY.BLOB:
                        Logger.info('DECISION', LOG_STYLES.PURPLE, 'Strategy="Always Blob"');
                        useBlob = true;
                        break;
                    case CONSTANTS.FETCH_STRATEGY.DIRECT:
                        Logger.info('DECISION', LOG_STYLES.PURPLE, 'Strategy="Always Direct"');
                        useBlob = false;
                        break;
                    case CONSTANTS.FETCH_STRATEGY.AUTO:
                    default:
                        // Default behavior: Check headers
                        useBlob = await NetworkHelper.shouldFetchAsBlob(targetUrl, config.common.referrerPolicy);
                        break;
                }

                // 3. Execute Opening
                if (useBlob) {
                    Logger.info('DECISION', LOG_STYLES.BLUE, `Mode="Blob", Policy="${config.common.referrerPolicy}"`);

                    const blob = await NetworkHelper.fetchImageAsBlob(targetUrl, config.common.referrerPolicy, config.common.retryOnFailure, CONSTANTS.LOG_TAGS.ORIGINAL);
                    const blobUrl = URL.createObjectURL(blob);
                    state.activeBlobUrl = blobUrl;

                    Logger.info('OPENING', LOG_STYLES.GREEN, `Opening Blob URL: "${blobUrl}"`);

                    // Use Anchor Tag Click for Blob URLs
                    // GM.openInTab often fails with blob: URLs due to security restrictions.
                    // We use a standard anchor click which browsers handle correctly for local resources.
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => a.remove(), CONSTANTS.TIMEOUTS.UI_DELAY);

                    // Schedule cleanup
                    const revokeTime = config.common.blobRevokeTimeout || 600000;
                    Logger.info('BLOB', LOG_STYLES.GRAY, `Revoke scheduled in ${revokeTime / 60000} min`);
                    state.activeRevokeTimer = setTimeout(() => {
                        URL.revokeObjectURL(blobUrl);
                        if (state.activeBlobUrl === blobUrl) {
                            state.activeBlobUrl = null;
                            state.activeRevokeTimer = null;
                        }
                    }, revokeTime);
                } else {
                    Logger.info('DECISION', LOG_STYLES.GREEN, `Mode="Direct"`);
                    Logger.info('OPENING', LOG_STYLES.GREEN, `Opening Direct URL: "${targetUrl}" (Active: ${isActive})`);

                    // Use GM.openInTab for Direct URLs to support background opening preference
                    GM.openInTab(targetUrl, { active: isActive, insert: true });
                }
            } catch (err) {
                // Error handling (Thumbnail fallback etc.)
                if (state.activeThumbnailUrl) {
                    this.showToast('Original image failed. Opening preview...', 'warn');
                    Logger.warn('FALLBACK', '', `Original failed: ${err.message}`);

                    try {
                        const blob = await NetworkHelper.fetchImageAsBlob(state.activeThumbnailUrl, config.common.referrerPolicy, false, CONSTANTS.LOG_TAGS.THUMBNAIL);
                        const blobUrl = URL.createObjectURL(blob);
                        state.activeBlobUrl = blobUrl;

                        // Use anchor for fallback blob as well
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => a.remove(), CONSTANTS.TIMEOUTS.UI_DELAY);

                        this.showToast('Preview image loaded (Original unavailable).', 'info');
                        // Cleanup logic...
                        const revokeTime = config.common.blobRevokeTimeout || 600000;
                        state.activeRevokeTimer = setTimeout(() => {
                            URL.revokeObjectURL(blobUrl);
                            if (state.activeBlobUrl === blobUrl) {
                                state.activeBlobUrl = null;
                                state.activeRevokeTimer = null;
                            }
                        }, revokeTime);
                        return;
                    } catch (e) {
                        /* ignore thumbnail fail */
                    }
                }

                // Final Fallback: Direct Link
                const fallbackUrl = targetUrl || (btn.href && btn.href !== window.location.href ? btn.href : null);
                if (fallbackUrl) {
                    Logger.warn('FALLBACK', '', `Reverting to direct navigation.`);
                    GM.openInTab(fallbackUrl, { active: isActive, insert: true });
                    this.showToast('Fetch failed. Opening direct link...', 'warn');
                } else {
                    this.showToast('Image URL not found', 'error');
                }
            } finally {
                state.isFetching = false;
                btn.style.opacity = '';
                btn.style.cursor = '';
            }
        }

        /**
         * Handles clicking the Page button.
         * Supports both Left Click and Middle Click (auxclick).
         * @param {MouseEvent} e
         */
        _handlePageClick(e) {
            // Only handle Left Click (0) or Middle Click (1)
            if (e.button !== 0 && e.button !== 1) return;

            this._stopProp(e);
            const btn = e.currentTarget;

            if (!(btn instanceof HTMLAnchorElement)) return;

            // Ensure URL is up-to-date.
            this._updateButtonHref(btn);

            if (btn.href && btn.href !== window.location.href) {
                const state = this.btnState.get(btn);
                const source = state ? state.hostSource : 'UNKNOWN';
                Logger.info('NAVIGATING', LOG_STYLES.GREEN, `Host URL: "${btn.href}" (Source: ${source})`);

                // For Page Button, we just let the browser handle the link navigation normally.
                // Middle click will open in new tab (default behavior).
                // Left click will open in new tab (target="_blank").
            } else {
                e.preventDefault();
                this.showToast('Host page URL not found.', 'warn');
            }
        }
    }

    // =================================================================================
    // SECTION: Data & Logic Adapters
    // =================================================================================

    /**
     * @class NetworkHelper
     * @description Handles network requests and binary data processing.
     */
    class NetworkHelper {
        /**
         * Determines if the URL should be fetched as a Blob or opened directly.
         * Uses a HEAD request to check for forced download headers.
         * @param {string} url
         * @param {string} referrerPolicy - The referrer policy to use for the request.
         * @returns {Promise<boolean>} True if Blob fetch is recommended, False if direct navigation is safe.
         */
        static async shouldFetchAsBlob(url, referrerPolicy) {
            return new Promise((resolve) => {
                GM.xmlHttpRequest({
                    method: 'HEAD',
                    url: url,
                    timeout: CONSTANTS.NETWORK_TIMEOUT,
                    headers: this._getHeaders(referrerPolicy),
                    onload: (response) => {
                        // If HEAD fails (e.g. 405 Method Not Allowed), default to Blob strategy to be safe.
                        if (response.status < 200 || response.status >= 300) {
                            resolve(true);
                            return;
                        }

                        const headers = (response.responseHeaders || '').toLowerCase();

                        // Parse Content-Disposition to check for 'attachment'
                        // regex matches: content-disposition: ... attachment ...
                        if (/content-disposition:.*attachment/.test(headers)) {
                            resolve(true);
                            return;
                        }

                        // Parse Content-Type
                        const typeMatch = headers.match(/content-type:\s*([^;\r\n]+)/);
                        const contentType = typeMatch ? typeMatch[1].trim() : '';

                        // If it's explicitly an image, safe to open directly.
                        // Otherwise (octet-stream, unknown, etc.), use Blob.
                        if (contentType.startsWith('image/')) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    },
                    onerror: () => {
                        // Network error on HEAD. Try Blob flow (GET) as it might have better error handling or succeed.
                        resolve(true);
                    },
                    ontimeout: () => resolve(true),
                });
            });
        }

        /**
         * Fetches an image URL and returns it as a Blob.
         * Detects the correct MIME type from binary headers to prevent forced downloads.
         * Implements automatic retry logic if shouldRetry is true.
         * Handles Data URIs directly without network requests.
         * @param {string} url - The image URL to fetch.
         * @param {string} referrerPolicy - The referrer policy to use for the request.
         * @param {boolean} shouldRetry - Whether to attempt one retry with a different policy on failure.
         * @param {string} logTag - Tag for logging purposes (e.g., 'ORIGINAL', 'THUMBNAIL').
         * @returns {Promise<Blob>} The image data as a Blob.
         */
        static async fetchImageAsBlob(url, referrerPolicy, shouldRetry, logTag) {
            // 1. Handle Data URI Scheme directly
            if (url.startsWith('data:')) {
                Logger.info(`FETCH (${logTag})`, LOG_STYLES.BLUE, `Processing Data URI...`);
                try {
                    const blob = this._base64ToBlob(url);
                    Logger.info(`FETCH OK (${logTag})`, LOG_STYLES.GREEN, `Type="${blob.type}", Size=${(blob.size / 1024).toFixed(2)}KB`);
                    return blob;
                } catch (error) {
                    Logger.error(`FETCH ERROR (${logTag})`, '', `Data URI parsing failed: ${error.message}`);
                    throw error;
                }
            }

            // 2. Handle HTTP/HTTPS URLs
            Logger.info(`FETCH (${logTag})`, LOG_STYLES.BLUE, `Executing... Policy="${referrerPolicy}"`);

            const attemptFetch = (policy) => {
                return new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: url,
                        timeout: CONSTANTS.NETWORK_TIMEOUT,
                        responseType: 'arraybuffer',
                        headers: this._getHeaders(policy),
                        onload: (response) => {
                            if (response.status >= 200 && response.status < 300) {
                                const buffer = response.response;
                                // Detect MIME type from binary signature
                                let mimeType = this._detectMimeType(buffer);

                                // Fallback: Check Content-Type header if magic bytes detection failed
                                // Only accept specific types (e.g., SVG) to avoid processing HTML as image
                                if (!mimeType) {
                                    const headers = (response.responseHeaders || '').toLowerCase();
                                    const typeMatch = headers.match(/content-type:\s*([^;\r\n]+)/);
                                    const contentType = typeMatch ? typeMatch[1].trim() : '';

                                    if (contentType === 'image/svg+xml') {
                                        mimeType = contentType;
                                    }
                                }

                                if (mimeType) {
                                    Logger.info(`FETCH OK (${logTag})`, LOG_STYLES.GREEN, `Type="${mimeType}", Size=${(buffer.byteLength / 1024).toFixed(2)}KB`);
                                    const blob = new Blob([buffer], { type: mimeType });
                                    resolve(blob);
                                } else {
                                    // Reject non-image data (HTML, Video, etc.) to trigger fallback
                                    reject(new Error('Unsupported file type'));
                                }
                            } else {
                                reject(new Error(`HTTP error ${response.status}`));
                            }
                        },
                        onerror: (err) => {
                            reject(new Error('Network request failed'));
                        },
                        ontimeout: () => {
                            reject(new Error('Request timed out'));
                        },
                    });
                });
            };

            try {
                return await attemptFetch(referrerPolicy);
            } catch (error) {
                Logger.error(`FETCH ERROR (${logTag})`, '', `Policy="${referrerPolicy}", Reason="${error.message}"`);

                if (shouldRetry) {
                    // Determine alternative policy based on system-defined strategy
                    let nextPolicy = CONSTANTS.REFERRER_POLICY.ORIGIN; // Default fallback

                    if (referrerPolicy === CONSTANTS.REFERRER_POLICY.NO_REFERRER) {
                        nextPolicy = CONSTANTS.REFERRER_POLICY.ORIGIN; // If hidden failed, try showing origin
                    } else if (referrerPolicy === CONSTANTS.REFERRER_POLICY.ORIGIN || referrerPolicy === CONSTANTS.REFERRER_POLICY.UNSAFE_URL) {
                        nextPolicy = CONSTANTS.REFERRER_POLICY.NO_REFERRER; // If origin/unsafe failed, try hiding
                    }

                    // Prevent redundant retry if nextPolicy is same as current (edge case)
                    if (nextPolicy !== referrerPolicy) {
                        Logger.warn('RETRY', '', `Switching "${referrerPolicy}" -> "${nextPolicy}"`);
                        // Explicitly pass false to ensure max 1 retry
                        return await this.fetchImageAsBlob(url, nextPolicy, false, logTag);
                    }
                }
                throw error;
            }
        }

        /**
         * Converts a Base64 Data URI string to a Blob object.
         * @private
         * @param {string} dataUrl - The Data URI string (e.g., "data:image/jpeg;base64,...").
         * @returns {Blob} The created Blob object.
         */
        static _base64ToBlob(dataUrl) {
            if (!dataUrl.startsWith('data:')) {
                throw new Error('Invalid Data URI: Missing "data:" prefix');
            }

            const commaIndex = dataUrl.indexOf(',');
            if (commaIndex === -1) {
                throw new Error('Invalid Data URI: Missing comma separator');
            }

            const metadata = dataUrl.slice(0, commaIndex);
            const data = dataUrl.slice(commaIndex + 1);

            // Parse metadata: data:[<mediatype>][;base64]
            const mimeMatch = metadata.match(/:(.*?)(;|$)/);
            const mime = mimeMatch ? mimeMatch[1] : 'text/plain';

            const isBase64 = metadata.includes(';base64');

            if (isBase64) {
                try {
                    const bstr = atob(data);
                    let n = bstr.length;
                    const u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    return new Blob([u8arr], { type: mime });
                } catch (e) {
                    throw new Error(`Base64 decoding failed: ${e.message}`);
                }
            } else {
                // Non-base64 (URL-encoded) data is not fully implemented yet
                // Throw error to trigger fallback mechanism
                throw new Error('Unsupported Data URI encoding: Non-base64');
            }
        }

        /**
         * Generates headers for GM.xmlHttpRequest based on the referrer policy.
         * @private
         * @param {string} policy
         * @returns {object} Headers object
         */
        static _getHeaders(policy) {
            const headers = {};
            switch (policy) {
                case CONSTANTS.REFERRER_POLICY.NO_REFERRER:
                    // Explicitly set empty string to suppress referrer
                    headers['Referer'] = '';
                    break;
                case CONSTANTS.REFERRER_POLICY.UNSAFE_URL:
                    headers['Referer'] = window.location.href;
                    break;
                case CONSTANTS.REFERRER_POLICY.ORIGIN:
                default:
                    headers['Referer'] = window.location.origin;
                    break;
            }
            return headers;
        }

        /**
         * Detects MIME type from the first few bytes (Magic Numbers).
         * @private
         * @param {ArrayBuffer} buffer
         * @returns {string|null} Detected MIME type or null.
         */
        static _detectMimeType(buffer) {
            if (!buffer || buffer.byteLength < 4) return null;

            const arr = new Uint8Array(buffer).subarray(0, 12);
            // Convert bytes to hex string for easy comparison
            const header = Array.from(arr)
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('')
                .toUpperCase();

            // JPEG: FF D8 FF
            if (header.startsWith('FFD8FF')) return 'image/jpeg';
            // PNG: 89 50 4E 47
            if (header.startsWith('89504E47')) return 'image/png';
            // GIF: 47 49 46 38
            if (header.startsWith('47494638')) return 'image/gif';
            // WebP: RIFF....WEBP (RIFF at 0, WEBP at 8)
            // 'RIFF' in hex is 52 49 46 46, 'WEBP' is 57 45 42 50
            if (header.startsWith('52494646') && header.slice(16, 24) === '57454250') return 'image/webp';
            // BMP: 42 4D
            if (header.startsWith('424D')) return 'image/bmp';
            // ICO: 00 00 01 00
            if (header.startsWith('00000100')) return 'image/x-icon';
            // AVIF: ....ftypavif (ftyp at offset 4, avif at offset 8)
            // Offset 4-7 (ftyp): 66 74 79 70 -> Index 8-16
            // Offset 8-11 (avif): 61 76 69 66 -> Index 16-24
            if (header.slice(8, 16) === '66747970' && header.slice(16, 24) === '61766966') return 'image/avif';

            return null;
        }
    }

    /**
     * @class BaseAdapter
     * @abstract
     * @description Base class for platform-specific adapters.
     */
    class BaseAdapter {
        /**
         * @param {UIManager} uiManager
         */
        constructor(uiManager) {
            this.uiManager = uiManager;
            /** @type {boolean} */
            this.hasSmokeTested = false;
        }

        /**
         * Unique identifier for the platform.
         * @returns {string}
         */
        static get id() {
            return 'base';
        }

        /**
         * Checks if this adapter should run on the current page.
         * @returns {boolean}
         */
        static isApplicable() {
            return false;
        }

        /**
         * Returns the CSS selector for the sentinel element.
         * @returns {string|null}
         */
        getSentinelSelector() {
            return null;
        }

        /**
         * Called when a new result element is detected.
         * @param {HTMLElement} element
         */
        onResultFound(element) {
            // To be implemented by subclasses
        }

        /**
         * Extracts the high-resolution image URL and the host page URL from Bing's metadata.
         *
         * Extraction Strategy:
         * Bing stores metadata as a JSON string in the `m` attribute of the `a.iusc` element.
         *
         * JSON Keys:
         * - `murl`: Media URL (The direct link to the high-res image).
         * - `purl`: Page URL (The link to the website hosting the image).
         * - `turl`: Thumbnail URL (Not used here, but available).
         *
         * @param {HTMLElement} element - The `a.iusc` element containing the `m` attribute.
         * @returns {{imageUrl: string|null, hostUrl: string|null, hostUrlSource: string|null, thumbnailUrl: string|null}}
         */
        extractUrls(element) {
            let imageUrl = null;
            let hostUrl = null;
            let hostUrlSource = null;
            let thumbnailUrl = null;

            try {
                // Bing stores metadata in the 'm' attribute as a JSON string.
                // Example: m='{"murl":"...","purl":"...","turl":"..."}'
                const mAttr = element.getAttribute('m');
                if (mAttr) {
                    const data = JSON.parse(mAttr);

                    // 'murl': Media URL (Direct link to the high-res image)
                    if (data.murl) {
                        imageUrl = data.murl;
                    } else {
                        Logger.error('EXTRACTION_FAIL', '', 'Bing: "murl" missing in metadata.', data);
                    }

                    // 'purl': Page URL (Link to the hosting webpage)
                    if (data.purl) {
                        hostUrl = data.purl;
                        hostUrlSource = 'M-ATTR';
                    }

                    // 'turl': Thumbnail URL (Fallback)
                    if (data.turl) {
                        thumbnailUrl = data.turl;
                    }
                } else {
                    Logger.error('EXTRACTION_FAIL', '', 'Bing: "m" attribute missing on sentinel.');
                }
            } catch (e) {
                Logger.error('EXTRACTION_FAIL', '', 'Bing: JSON parse error or structure change.', e);
                // JSON parse error or structure change.
                // We silently fail here as other elements might not have valid JSON.
            }

            return { imageUrl, hostUrl, hostUrlSource, thumbnailUrl };
        }

        /**
         * Asynchronously fetches the original image URL by interacting with the DOM.
         * Used when the high-res URL is not present in the initial DOM (e.g., DuckDuckGo).
         * @param {HTMLElement} sentinel - The sentinel element.
         * @returns {Promise<string|null>} The original image URL or null if not found.
         */
        async fetchOriginalImageUrl(sentinel) {
            return null;
        }
    }

    /**
     * @class BingAdapter
     * @extends BaseAdapter
     * @description Adapter for Bing Image Search.
     * Handles DOM interactions specific to Bing's search results page.
     */
    class BingAdapter extends BaseAdapter {
        constructor(uiManager) {
            super(uiManager);
            this.uiManager.setUrlFetcher((element) => this.extractUrls(element));
        }

        static get id() {
            return 'bing';
        }

        /**
         * Checks if the current page is a supported Bing Image Search page.
         * @returns {boolean}
         */
        static isApplicable() {
            // prettier-ignore
            return (
                // Match *.bing.com (e.g., www, cn, global) to align with @match
                /(^|\.)bing\.com$/.test(window.location.hostname) &&
                window.location.pathname.startsWith('/images/search')
            );
        }

        /**
         * Returns the CSS selector for the sentinel element.
         * In Bing, `a.iusc` (Image URL Source Container?) is the interactive element holding metadata.
         * @returns {string}
         */
        getSentinelSelector() {
            return 'a.iusc';
        }

        /**
         * Called when a new result element is detected.
         * Attaches buttons to the parent container (usually `div.img_cont`) to overlay correctly on the image.
         * @param {HTMLElement} element - The detected `a.iusc` element.
         */
        onResultFound(element) {
            const targetContainer = element.parentElement;
            if (targetContainer) {
                this.uiManager.attachButtons(element, targetContainer);
            }
        }

        /**
         * Extracts the high-resolution image URL and the host page URL from Bing's metadata.
         *
         * Extraction Strategy:
         * Bing stores metadata as a JSON string in the `m` attribute of the `a.iusc` element.
         *
         * JSON Keys:
         * - `murl`: Media URL (The direct link to the high-res image).
         * - `purl`: Page URL (The link to the website hosting the image).
         * - `turl`: Thumbnail URL (Not used here, but available).
         *
         * @param {HTMLElement} element - The `a.iusc` element containing the `m` attribute.
         * @returns {{imageUrl: string|null, hostUrl: string|null, hostUrlSource: string|null, thumbnailUrl: string|null}}
         */
        extractUrls(element) {
            let imageUrl = null;
            let hostUrl = null;
            let hostUrlSource = null;
            let thumbnailUrl = null;

            try {
                // Bing stores metadata in the 'm' attribute as a JSON string.
                // Example: m='{"murl":"...","purl":"...","turl":"..."}'
                const mAttr = element.getAttribute('m');
                if (mAttr) {
                    const data = JSON.parse(mAttr);

                    // 'murl': Media URL (Direct link to the high-res image)
                    if (data.murl) {
                        imageUrl = data.murl;
                    }

                    // 'purl': Page URL (Link to the hosting webpage)
                    if (data.purl) {
                        hostUrl = data.purl;
                        hostUrlSource = 'M-ATTR';
                    }

                    // 'turl': Thumbnail URL (Fallback)
                    if (data.turl) {
                        thumbnailUrl = data.turl;
                    }
                }
            } catch (e) {
                // JSON parse error or structure change.
                // We silently fail here as other elements might not have valid JSON.
            }

            return { imageUrl, hostUrl, hostUrlSource, thumbnailUrl };
        }
    }

    /**
     * @class DuckDuckGoAdapter
     * @extends BaseAdapter
     * @description Adapter for DuckDuckGo Image Search.
     */
    class DuckDuckGoAdapter extends BaseAdapter {
        constructor(uiManager) {
            super(uiManager);
            this.uiManager.setUrlFetcher((element) => this.extractUrls(element));
        }

        static get id() {
            return 'duckduckgo';
        }

        static isApplicable() {
            if (!/(^|\.)duckduckgo\.com$/.test(window.location.hostname)) return false;

            const params = new URLSearchParams(window.location.search);
            // Check for any parameter starting with 'ia' (e.g., ia, iax, iar) with value 'images'
            for (const [key, value] of params.entries()) {
                if (key.startsWith('ia') && value === 'images') {
                    return true;
                }
            }
            return false;
        }

        /**
         * Returns the CSS selector for the sentinel element.
         * Updated to use tag name 'figure' as DDG now uses obfuscated class names.
         * @returns {string}
         */
        getSentinelSelector() {
            // Target 'figure' elements which are the containers for image cards in the new React layout
            // Use :not() selector to re-trigger Sentinel if the processed class is removed by the host
            return 'figure:not(.isdv-processed)';
        }

        /**
         * Called when a new result element is detected.
         * @param {HTMLElement} element - The detected sentinel element.
         */
        onResultFound(element) {
            // Verify if this figure contains the expected image search structure
            // It should have an anchor tag and an image
            if (element.querySelector('a') && element.querySelector('img')) {
                this.uiManager.attachButtons(element, element);
            }
        }

        /**
         * Extracts URLs from DuckDuckGo result element.
         *
         * [LIMITATION & DESIGN DECISION]
         * 1. Cached URL Only: The URL obtained here is typically a cached version (via Bing/DDG proxy), NOT the direct original source URL.
         * 2. DOM Limitation: The true high-resolution original URL is NOT present in the card's DOM. It is only injected after clicking the card to open the detail panel.
         * 3. Strategy: We intentionally use this cached URL (extracted from the 'u' param) to enable immediate access from the grid view.
         * This accepts a trade-off: slightly lower resolution in exchange for significantly better UX (0-click access).
         *
         * @param {HTMLElement} element - The sentinel element (figure).
         * @returns {{imageUrl: string|null, hostUrl: string|null, hostUrlSource: string|null, thumbnailUrl: string|null}}
         */
        extractUrls(element) {
            let imageUrl = null;
            let hostUrl = null;
            let hostUrlSource = null;
            let thumbnailUrl = null;

            // 1. Get Host URL from the anchor tag
            const link = element.querySelector('a');
            if (link && link.href) {
                // STRICTLY use the href as is.
                // Do NOT decode or strip any redirect parameters (e.g. duckduckgo.com/l/?uddg=...).
                // We must respect DDG's privacy protections (redirects/referrer hiding) if present.
                hostUrl = link.href;
                hostUrlSource = 'HREF';
            } else {
                // Validation: If it looks like an image card (has img) but no link, it's a structure error.
                if (element.querySelector('img')) {
                    Logger.error('EXTRACTION_FAIL', '', 'DDG: Host URL (anchor) missing in image card.');
                }
            }

            // 2. Get Image URL & Thumbnail URL
            const img = element.querySelector('img');
            if (img && img.src) {
                // Use the proxy URL as the thumbnail
                thumbnailUrl = img.src;

                // Extract the cached image URL from the 'u' parameter of the proxy URL.
                // NOTE: This is NOT the original source URL but a cached version used by DDG/Bing.
                // We use this because the original URL is not available in the card view DOM.
                try {
                    const urlObj = new URL(img.src);
                    const originalParam = urlObj.searchParams.get('u');
                    if (originalParam) {
                        imageUrl = decodeURIComponent(originalParam);
                    } else {
                        // Fallback: Use proxy URL if 'u' parameter is missing
                        imageUrl = img.src;
                    }
                } catch (e) {
                    // Fallback: Use proxy URL on parse error
                    imageUrl = img.src;
                }
            }

            return { imageUrl, hostUrl, hostUrlSource, thumbnailUrl };
        }

        /**
         * Asynchronously fetches the original image URL by opening the detail panel.
         * Verifies the panel content matches the clicked item using the Page URL.
         * Scopes extraction to the visible container to avoid grabbing preloaded/hidden links.
         * @param {HTMLElement} sentinel - The sentinel element.
         * @returns {Promise<string|null>} The original image URL or null.
         */
        async fetchOriginalImageUrl(sentinel) {
            return new Promise((resolve) => {
                // 1. Get the expected Page URL to verify the panel content later
                const anchor = sentinel.querySelector('a');
                if (!anchor || !anchor.href) {
                    Logger.warn('ASYNC_FAIL', '', 'DDG: Trigger anchor missing.');
                    resolve(null);
                    return;
                }
                const expectedPageUrl = anchor.href;

                // Helper to normalize URL for loose comparison (remove trailing slash)
                const normalizeUrl = (u) => (u ? u.replace(/\/$/, '') : '');

                // 2. Trigger click to open detail panel
                // Click the image (img) to open panel without navigation.
                const trigger = sentinel.querySelector('img');
                if (!trigger) {
                    Logger.warn('ASYNC_FAIL', '', 'DDG: Trigger image missing.');
                    resolve(null);
                    return;
                }

                // Smart Scroll Clamping & Stealth Mode
                // 1. Clamp: Locks scroll position to prevent jumping.
                // 2. Stealth: Hides the detail panel (aside) via direct style injection to the specific element.

                const savedScrollY = window.scrollY;
                let isClamping = true;
                const userEvents = ['wheel', 'touchmove', 'keydown', 'mousedown'];

                // Handler to break the clamp on user interaction
                const stopClamping = () => {
                    isClamping = false;
                };

                // Attach listeners to detect user intent (capture phase)
                // Use explicit boolean 'true' for capture to ensure removeEventListener works reliably across browsers.
                userEvents.forEach((evt) => window.addEventListener(evt, stopClamping, true));

                // Stealth Logic: Use MutationObserver to hide the specific panel as soon as it appears.
                let targetAside = null;
                const originalStyles = { opacity: '', pointerEvents: '' };

                const hideElement = (el) => {
                    if (el && el.style && !targetAside) {
                        // Backup original inline styles to allow safe restoration
                        originalStyles.opacity = el.style.opacity;
                        originalStyles.pointerEvents = el.style.pointerEvents;

                        el.style.setProperty('opacity', '0', 'important');
                        el.style.setProperty('pointer-events', 'none', 'important');
                        targetAside = el; // Keep reference for cleanup

                        // Optimization: Disconnect observer once the target is found and hidden
                        observer.disconnect();
                    }
                };

                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeName === 'ASIDE') {
                                    hideElement(node);
                                }
                            });
                        }
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });

                // Start clamping loop
                const start = Date.now();
                const clampDuration = CONSTANTS.TIMEOUTS.SCROLL_CLAMP;
                const maintainScroll = () => {
                    if (isClamping) {
                        window.scrollTo(0, savedScrollY);
                        if (Date.now() - start < clampDuration) {
                            requestAnimationFrame(maintainScroll);
                        }
                    }
                };
                requestAnimationFrame(maintainScroll);

                // Helper to clean up listeners, styles, and ensure final state
                const finalize = () => {
                    // Stop observing (if not already stopped)
                    observer.disconnect();

                    // Cleanup styles if the panel still exists (restore visibility safely)
                    if (targetAside) {
                        if (originalStyles.opacity) {
                            targetAside.style.opacity = originalStyles.opacity;
                        } else {
                            targetAside.style.removeProperty('opacity');
                        }

                        if (originalStyles.pointerEvents) {
                            targetAside.style.pointerEvents = originalStyles.pointerEvents;
                        } else {
                            targetAside.style.removeProperty('pointer-events');
                        }
                    }

                    // Stop clamping
                    isClamping = false;
                    userEvents.forEach((evt) => window.removeEventListener(evt, stopClamping, true));

                    // Final position restoration after layout settles
                    window.scrollTo(0, savedScrollY);
                    setTimeout(() => window.scrollTo(0, savedScrollY), CONSTANTS.TIMEOUTS.UI_DELAY);
                };

                // Use standard click() to prevent 'MouseEvent constructor' error
                trigger.click();

                // 3. Wait for the detail panel (<aside>) to appear AND match the expected URL
                const MAX_ATTEMPTS = Math.ceil(CONSTANTS.TIMEOUTS.FETCH_ORIGINAL / CONSTANTS.TIMEOUTS.DOM_POLLING);
                let attempts = 0;

                const checkPanel = () => {
                    attempts++;
                    const aside = document.querySelector('aside');

                    if (aside) {
                        // Fail-safe: Ensure style is applied if Observer missed it (e.g. reused DOM)
                        if (!targetAside) {
                            hideElement(aside);
                        }

                        // Target ONLY the visible container within aside to avoid hidden/preloaded slides.
                        // DDG uses aria-hidden="false" for the active slide.
                        // Fallback to aside itself if structure changes/not found (though unlikely).
                        const activeContainer = aside.querySelector('[aria-hidden="false"]') || aside;

                        // VERIFICATION: Check if this visible container belongs to the clicked image.
                        const linksInPanel = activeContainer.querySelectorAll('a');
                        let isMatch = false;
                        const targetUrlNorm = normalizeUrl(expectedPageUrl);

                        for (const link of linksInPanel) {
                            if (normalizeUrl(link.href) === targetUrlNorm) {
                                isMatch = true;
                                break;
                            }
                        }

                        if (isMatch) {
                            // Found the correct panel content. Proceed to extract from THIS container.
                            processPanel(aside, activeContainer);
                            return;
                        }
                    }

                    if (attempts >= MAX_ATTEMPTS) {
                        Logger.warn('ASYNC_FAIL', '', 'DDG: Panel detection timed out.');
                        finalize();
                        resolve(null);
                    } else {
                        setTimeout(checkPanel, CONSTANTS.TIMEOUTS.DOM_POLLING);
                    }
                };

                const processPanel = (aside, container) => {
                    let foundUrl = null;

                    // Strategy: Find 'a' tags with target="_blank" inside the ACTIVE container
                    const links = container.querySelectorAll('a[target="_blank"]');

                    // Priority 1: Link ending with common image extensions
                    for (const link of links) {
                        const href = link.href;
                        if (/\.(jpg|jpeg|png|webp|gif|bmp|svg)(\?.*)?$/i.test(href)) {
                            foundUrl = href;
                            break;
                        }
                    }

                    // Priority 2: Fallback to the last external link found in the active container
                    if (!foundUrl && links.length > 0) {
                        foundUrl = links[links.length - 1].href;
                    }

                    if (!foundUrl) {
                        Logger.warn('ASYNC_FAIL', '', 'DDG: Target image URL not found in panel.');
                    }

                    // 4. Close the panel immediately
                    const closeBtn = aside.querySelector('.ddgsi-close');
                    if (closeBtn) {
                        const btn = closeBtn.closest('button') || closeBtn;
                        btn.click();
                    } else {
                        // Fallback: Send Escape key
                        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                    }

                    finalize();
                    resolve(foundUrl);
                };

                // Start polling
                checkPanel();
            });
        }
    }

    /**
     * @class GoogleAdapter
     * @extends BaseAdapter
     * @description Adapter for Google Image Search.
     * Handles DOM interactions specific to Google's search results page.
     */
    class GoogleAdapter extends BaseAdapter {
        constructor(uiManager) {
            super(uiManager);
            this.uiManager.setUrlFetcher((element) => this.extractUrls(element));
        }

        static get id() {
            return 'google';
        }

        /**
         * Checks if the current page is a supported Google Image Search page.
         * Supported contexts:
         * 1. Standard Web Search with "Images" tab selected (`udm=2`).
         * 2. Dedicated Image Search page (`tbm=isch`).
         * @returns {boolean}
         */
        static isApplicable() {
            // prettier-ignore
            return (
                // Match *.google.com to align with @match
                /(^|\.)google\.com$/.test(window.location.hostname) &&
                (
                    // 'udm=2': Indicates the "Images" tab in standard Web Search (new interface)
                    new URL(window.location.href).searchParams.get('udm') === '2' ||
                    // 'tbm=isch': Indicates the dedicated Image Search mode (classic interface)
                    new URL(window.location.href).searchParams.get('tbm') === 'isch'
                )
            );
        }

        /**
         * Returns the CSS selector for the sentinel element.
         * Targets the container with 'data-lpage' and 'data-docid' which represents a single result card.
         * @returns {string}
         */
        getSentinelSelector() {
            return 'div[data-lpage][data-docid]';
        }

        /**
         * Called when a new result element is detected.
         * Finds the anchor tag and the appropriate container to inject buttons.
         * @param {HTMLElement} element - The detected sentinel element.
         */
        onResultFound(element) {
            // Check if the element is inside the detailed viewer panel.
            // Google displays similar images inside the side panel, which causes duplication.
            // We use 'data-lhcontainer' or 'data-viewer-type' which are characteristic of the viewer structure.
            const isInsidePanel = element.closest('[data-lhcontainer], [data-viewer-type]');
            if (isInsidePanel) {
                return;
            }

            const link = element.querySelector('a');
            if (!link) return;

            // Attach buttons to the parent of the link to ensure they overlay the image correctly.
            const targetContainer = link.parentElement;
            if (targetContainer) {
                this.uiManager.attachButtons(element, targetContainer);
            }
        }

        /**
         * Extracts URLs from a Google result element.
         *
         * Strategy:
         * 1. **Image URL**: Returns null to force the Async Fetcher (`fetchOriginalImageUrl`) to run.
         * 2. **Host URL**: Extracted directly from the `data-lpage` attribute of the sentinel.
         * 3. **Thumbnail URL**: Extracted from the `img` tag inside the card.
         *
         * @param {HTMLElement} element - The sentinel element.
         * @returns {{imageUrl: string|null, hostUrl: string|null, hostUrlSource: string|null, thumbnailUrl: string|null}}
         */
        extractUrls(element) {
            let imageUrl = null;
            let hostUrl = null;
            let hostUrlSource = null;
            let thumbnailUrl = null;

            // 1. Extract Host Page URL from 'data-lpage' attribute
            if (element.dataset.lpage) {
                hostUrl = element.dataset.lpage;
                hostUrlSource = 'DATA-ATTR';
            } else {
                Logger.error('EXTRACTION_FAIL', '', 'Google: "data-lpage" attribute missing.');
            }

            // 2. Extract Thumbnail URL
            const imgEl = element.querySelector('img');
            if (imgEl) {
                thumbnailUrl = imgEl.getAttribute('data-src') || imgEl.getAttribute('src');
            }

            // Image URL is intentionally null to trigger async fetch
            return { imageUrl, hostUrl, hostUrlSource, thumbnailUrl };
        }

        /**
         * Asynchronously fetches the original image URL by interacting with the detailed panel.
         *
         * Flow:
         * 1. Triggers a click on the card to open the detailed panel (side panel).
         * 2. Uses CSS injection to keep the panel invisible (Stealth Mode).
         * 3. Observes the DOM for the specific panel creation and image src update using MutationObserver.
         * 4. Extracts the high-res URL from the panel's image element once loaded.
         * 5. Closes the panel to restore state.
         *
         * @param {HTMLElement} sentinel - The sentinel element.
         * @returns {Promise<string|null>} The original image URL or null.
         */
        async fetchOriginalImageUrl(sentinel) {
            return new Promise((resolve) => {
                const docId = sentinel.dataset.docid;
                const lpage = sentinel.dataset.lpage;

                if (!docId) {
                    Logger.warn('ASYNC_FAIL', '', 'Google: "data-docid" missing on sentinel.');
                    resolve(null);
                    return;
                }

                // Identify the trigger button (div[role="button"]) inside the sentinel
                const trigger = sentinel.querySelector('div[role="button"]');
                if (!trigger) {
                    Logger.warn('ASYNC_FAIL', '', 'Google: Trigger button missing.');
                    resolve(null);
                    return;
                }

                // Inject Stealth Styles (Hide the detailed panel container by data-id)
                const stealthStyle = document.createElement('style');
                stealthStyle.textContent = `
                    div[data-id="${docId}"] {
                        opacity: 0 !important;
                        pointer-events: none !important;
                    }
                `;
                document.head.appendChild(stealthStyle);

                let observer = null;
                let timeoutId = null;
                let lastKnownSrc = null; // Keep track of the best available URL (including Base64/Thumbnail)

                const cleanup = () => {
                    if (observer) observer.disconnect();
                    if (timeoutId) clearTimeout(timeoutId);
                    stealthStyle.remove();
                };

                const closePanel = (panel) => {
                    // Strategy: Find the close button by its specific SVG path content
                    // This is robust against class name/jsname changes.
                    const closeIconPath = 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z';

                    // Search for path elements within the panel
                    const paths = panel.querySelectorAll('svg path');
                    let closeBtn = null;

                    for (const path of paths) {
                        if (path.getAttribute('d') === closeIconPath) {
                            // Found the path, find the nearest button ancestor
                            closeBtn = path.closest('button');
                            break;
                        }
                    }

                    if (closeBtn) {
                        closeBtn.click();
                    } else {
                        // Fallback: Escape key
                        Logger.warn('CLOSE FALLBACK', '', 'Close button (SVG) not found. Sending Escape key.');
                        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                    }
                };

                // Setup Observer to watch for panel appearance and image src change
                observer = new MutationObserver(() => {
                    // 1. Find the panel that matches the clicked docId
                    const panel = document.querySelector(`div[data-id="${docId}"]`);
                    if (panel) {
                        // Ensure the panel is inside an active container (aria-hidden="false")
                        const activeContainer = panel.closest('div[data-sci][aria-hidden="false"]');
                        if (!activeContainer) return;

                        // Find the image linked to the Landing Page (lpage)
                        let targetImg = null;

                        if (lpage) {
                            // Try exact match first, specifically targeting the main image link
                            targetImg = panel.querySelector(`a[href="${lpage}"][role="link"] img`);
                        }

                        // Fallback: Look for any link with role="link" which typically denotes the main image
                        if (!targetImg) {
                            targetImg = panel.querySelector('a[role="link"] > img');
                        }

                        if (targetImg && targetImg.src) {
                            lastKnownSrc = targetImg.src; // Update candidate

                            // 3. Check if src is a high-quality URL.
                            // We filter out known thumbnail/preview domains to wait for the original image.
                            const isLowRes = /encrypted-tbn|gstatic\.com|favicon/.test(targetImg.src);

                            if (targetImg.src.startsWith('http') && !isLowRes) {
                                cleanup();
                                closePanel(panel);
                                resolve(targetImg.src);
                            }
                        }
                    }
                });

                // Start observing the body for subtree changes (panel insertion & attribute changes)
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['src', 'aria-hidden'],
                });

                // Trigger Click with a slight delay to ensure observer is ready and browser has painted
                requestAnimationFrame(() => {
                    trigger.click();
                });

                // Timeout Safety
                // If the image remains a thumbnail (e.g. Instagram logic), we return the thumbnail as fallback.
                timeoutId = setTimeout(() => {
                    // Try to find the panel to close it properly even on timeout
                    const panel = document.querySelector(`div[data-id="${docId}"]`);

                    cleanup();

                    if (panel) {
                        closePanel(panel);
                    } else {
                        // Fallback if panel ref is lost or not found
                        Logger.warn('ASYNC_FAIL', '', 'Google: Panel not found or timed out.');
                        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                    }

                    resolve(lastKnownSrc);
                }, CONSTANTS.TIMEOUTS.FETCH_ORIGINAL);
            });
        }
    }

    // =================================================================================
    // SECTION: Sentinel (DOM Observer)
    // =================================================================================

    /**
     * @class Sentinel
     * @description Detects DOM node insertion using a shared, prefixed CSS animation trick.
     * @property {Map<string, Array<(element: Element) => void>>} listeners
     * @property {Set<string>} rules
     * @property {HTMLElement | null} styleElement
     * @property {CSSStyleSheet | null} sheet
     * @property {string[]} pendingRules
     * @property {WeakMap<CSSRule, string>} ruleSelectors
     */
    class Sentinel {
        /**
         * @param {string} prefix - A unique identifier for this Sentinel instance to avoid CSS conflicts. Required.
         */
        constructor(prefix) {
            if (!prefix) {
                throw new Error('[Sentinel] "prefix" argument is required to avoid CSS conflicts.');
            }

            /** @type {any} */
            const globalScope = window;
            globalScope.__global_sentinel_instances__ = globalScope.__global_sentinel_instances__ || {};
            if (globalScope.__global_sentinel_instances__[prefix]) {
                return globalScope.__global_sentinel_instances__[prefix];
            }

            // Use a unique, prefixed animation name shared by all scripts in a project.
            this.animationName = `${prefix}-global-sentinel-animation`;
            this.styleId = `${prefix}-sentinel-global-rules`; // A single, unified style element
            this.listeners = new Map();
            this.rules = new Set(); // Tracks all active selectors
            this.styleElement = null; // Holds the reference to the single style element
            this.sheet = null; // Cache the CSSStyleSheet reference
            this.pendingRules = []; // Queue for rules requested before sheet is ready
            /** @type {WeakMap<CSSRule, string>} */
            this.ruleSelectors = new WeakMap(); // Tracks selector strings associated with CSSRule objects

            this._injectStyleElement();
            document.addEventListener('animationstart', this._handleAnimationStart.bind(this), true);

            globalScope.__global_sentinel_instances__[prefix] = this;
        }

        _injectStyleElement() {
            // Ensure the style element is injected only once per project prefix.
            this.styleElement = document.getElementById(this.styleId);

            if (this.styleElement instanceof HTMLStyleElement) {
                this.sheet = this.styleElement.sheet;
                return;
            }

            // Create empty style element
            this.styleElement = h('style', {
                id: this.styleId,
            });

            // CSP Fix: Try to fetch a valid nonce from existing scripts/styles
            // "nonce" property exists on HTMLScriptElement/HTMLStyleElement, not basic Element.
            let nonce;
            const script = document.querySelector('script[nonce]');
            const style = document.querySelector('style[nonce]');

            if (script instanceof HTMLScriptElement) {
                nonce = script.nonce;
            } else if (style instanceof HTMLStyleElement) {
                nonce = style.nonce;
            }

            if (nonce) {
                this.styleElement.setAttribute('nonce', nonce);
            }

            // Try to inject immediately. If the document is not yet ready (e.g. extremely early document-start), wait for the root element.
            const target = document.head || document.documentElement;

            const initSheet = () => {
                if (this.styleElement instanceof HTMLStyleElement) {
                    this.sheet = this.styleElement.sheet;
                    // Insert the shared keyframes rule at index 0.
                    try {
                        const keyframes = `@keyframes ${this.animationName} { from { transform: none; } to { transform: none; } }`;
                        this.sheet.insertRule(keyframes, 0);
                    } catch (e) {
                        Logger.error('SENTINEL', LOG_STYLES.RED, 'Failed to insert keyframes rule:', e);
                    }
                    this._flushPendingRules();
                }
            };

            if (target) {
                target.appendChild(this.styleElement);
                initSheet();
            } else {
                const observer = new MutationObserver(() => {
                    const retryTarget = document.head || document.documentElement;
                    if (retryTarget) {
                        observer.disconnect();
                        retryTarget.appendChild(this.styleElement);
                        initSheet();
                    }
                });
                observer.observe(document, { childList: true });
            }
        }

        _flushPendingRules() {
            if (!this.sheet || this.pendingRules.length === 0) return;

            const rulesToInsert = [...this.pendingRules];
            this.pendingRules = [];

            rulesToInsert.forEach((selector) => {
                this._insertRule(selector);
            });
        }

        /**
         * Helper to insert a single rule into the stylesheet
         * @param {string} selector
         */
        _insertRule(selector) {
            try {
                const index = this.sheet.cssRules.length;
                const ruleText = `${selector} { animation-duration: 0.001s; animation-name: ${this.animationName}; }`;
                this.sheet.insertRule(ruleText, index);

                // Associate the inserted rule with the selector via WeakMap for safer removal later.
                // This mimics sentinel.js behavior to handle index shifts and selector normalization.
                const insertedRule = this.sheet.cssRules[index];
                if (insertedRule) {
                    this.ruleSelectors.set(insertedRule, selector);
                }
            } catch (e) {
                Logger.error('SENTINEL', LOG_STYLES.RED, `Failed to insert rule for selector "${selector}":`, e);
            }
        }

        _handleAnimationStart(event) {
            // Check if the animation is the one we're listening for.
            if (event.animationName !== this.animationName) return;

            const target = event.target;
            if (!(target instanceof Element)) {
                return;
            }

            // Check if the target element matches any of this instance's selectors.
            for (const [selector, callbacks] of this.listeners.entries()) {
                if (target.matches(selector)) {
                    // Use a copy of the callbacks array in case a callback removes itself.
                    [...callbacks].forEach((cb) => cb(target));
                }
            }
        }

        /**
         * @param {string} selector
         * @param {(element: Element) => void} callback
         */
        on(selector, callback) {
            // Add callback to listeners
            if (!this.listeners.has(selector)) {
                this.listeners.set(selector, []);
            }
            this.listeners.get(selector).push(callback);

            // If selector is already registered in rules, do nothing
            if (this.rules.has(selector)) return;

            this.rules.add(selector);

            // Apply rule
            if (this.sheet) {
                this._insertRule(selector);
            } else {
                this.pendingRules.push(selector);
            }
        }

        /**
         * @param {string} selector
         * @param {(element: Element) => void} callback
         */
        off(selector, callback) {
            const callbacks = this.listeners.get(selector);
            if (!callbacks) return;

            const newCallbacks = callbacks.filter((cb) => cb !== callback);

            if (newCallbacks.length === callbacks.length) {
                return; // Callback not found, do nothing.
            }

            if (newCallbacks.length === 0) {
                // Remove listener and rule
                this.listeners.delete(selector);
                this.rules.delete(selector);

                if (this.sheet) {
                    // Iterate backwards to avoid index shifting issues during deletion
                    for (let i = this.sheet.cssRules.length - 1; i >= 0; i--) {
                        const rule = this.sheet.cssRules[i];
                        // Check for recorded selector via WeakMap or fallback to selectorText match
                        const recordedSelector = this.ruleSelectors.get(rule);

                        if (recordedSelector === selector || (rule instanceof CSSStyleRule && rule.selectorText === selector)) {
                            this.sheet.deleteRule(i);
                            // We assume one rule per selector, so we can break after deletion
                            break;
                        }
                    }
                }
            } else {
                this.listeners.set(selector, newCallbacks);
            }
        }

        suspend() {
            if (this.styleElement instanceof HTMLStyleElement) {
                this.styleElement.disabled = true;
            }
            Logger.debug('SENTINEL', LOG_STYLES.CYAN, 'Suspended.');
        }

        resume() {
            if (this.styleElement instanceof HTMLStyleElement) {
                this.styleElement.disabled = false;
            }
            Logger.debug('SENTINEL', LOG_STYLES.CYAN, 'Resumed.');
        }
    }

    // =================================================================================
    // SECTION: Navigation Monitor
    // Description: Centralizes URL change detection via history API hooks and popstate events.
    // =================================================================================

    class NavigationMonitor {
        constructor() {
            this.originalHistoryMethods = { pushState: null, replaceState: null };
            this._historyWrappers = {};
            this.isInitialized = false;
            this.lastPath = null;
            this._handlePopState = this._handlePopState.bind(this);
            // Debounce the navigation event to allow the DOM to settle and prevent duplicate events
            this.debouncedNavigation = debounce(
                () => {
                    EventBus.publish(EVENTS.NAVIGATION);
                },
                CONSTANTS.TIMEOUTS.POST_NAVIGATION_DOM_SETTLE,
                false
            );
        }

        init() {
            if (this.isInitialized) return;
            this.isInitialized = true;
            // Capture initial path
            this.lastPath = location.pathname + location.search;
            this._hookHistory();
            window.addEventListener('popstate', this._handlePopState);
        }

        destroy() {
            if (!this.isInitialized) return;
            this._restoreHistory();
            window.removeEventListener('popstate', this._handlePopState);
            if (this.debouncedNavigation.cancel) {
                this.debouncedNavigation.cancel();
            }
            this.isInitialized = false;
        }

        _hookHistory() {
            // Capture the instance for use in the wrapper
            const instance = this;
            for (const m of ['pushState', 'replaceState']) {
                const orig = history[m];
                this.originalHistoryMethods[m] = orig;

                const wrapper = function (...args) {
                    const result = orig.apply(this, args);
                    instance._onUrlChange();
                    return result;
                };

                this._historyWrappers[m] = wrapper;
                history[m] = wrapper;
            }
        }

        _restoreHistory() {
            for (const m of ['pushState', 'replaceState']) {
                if (this.originalHistoryMethods[m]) {
                    if (history[m] === this._historyWrappers[m]) {
                        history[m] = this.originalHistoryMethods[m];
                    } else {
                        Logger.warn('HISTORY HOOK', '', `history.${m} has been wrapped by another script. Skipping restoration to prevent breaking the chain.`);
                    }
                    this.originalHistoryMethods[m] = null;
                }
            }
            this._historyWrappers = {};
        }

        _handlePopState() {
            this._onUrlChange();
        }

        _onUrlChange() {
            const currentPath = location.pathname + location.search;
            // Prevent re-triggers if the path hasn't actually changed
            if (currentPath === this.lastPath) {
                return;
            }
            this.lastPath = currentPath;
            this.debouncedNavigation();
        }
    }

    // =================================================================================
    // SECTION: Main Application Controller
    // =================================================================================

    class AppController {
        constructor() {
            /** @type {ConfigManager} */
            this.configManager = new ConfigManager();
            /** @type {UIManager} */
            this.uiManager = new UIManager(this.configManager);
            /** @type {Sentinel} */
            this.sentinel = new Sentinel(OWNERID);
            /** @type {SettingsModal} */
            this.settingsModal = null;
            /** @type {NavigationMonitor} */
            this.navMonitor = new NavigationMonitor();

            // State
            /** @type {BaseAdapter} */
            this.adapter = null;
            /** @type {string|null} */
            this.activeSentinelSelector = null;
            /** @type {Function|null} */
            this.boundResultHandler = null;
        }

        /**
         * Initializes the script.
         */
        async init() {
            // 1. Load configuration asynchronously
            await this.configManager.load();

            // 2. Initialize Navigation Monitor (SPA Support)
            this.navMonitor.init();
            EventBus.subscribe(EVENTS.NAVIGATION, this._reconcileAdapter.bind(this), createEventKey(this, EVENTS.NAVIGATION));

            // 3. Initial Adapter Reconciliation
            await this._reconcileAdapter();

            // 4. Register Menu Command (Global)
            // Note: Settings modal is lazy-loaded with platform styles when needed, or default styles if no adapter is active.
            GM.registerMenuCommand('Open Settings', () => {
                this._openSettings();
            });
        }

        /**
         * Checks the current URL and mounts/unmounts the appropriate adapter.
         */
        async _reconcileAdapter() {
            const adapters = [GoogleAdapter, BingAdapter, DuckDuckGoAdapter];
            const currentUrl = window.location.href;

            // Check if current adapter is still applicable
            if (this.adapter) {
                if (this.adapter.constructor.isApplicable()) {
                    Logger.debug('DEBUG', '', 'Current adapter is still applicable. Forcing rescan for content updates.');
                    this._forceRescan();
                    return;
                }
                // Current adapter is no longer valid
                Logger.info('NAV', '', 'Current adapter no longer applicable. Unmounting...');
                this._unmountAdapter();
            }

            // Find new applicable adapter
            const AdapterClass = adapters.find((a) => a.isApplicable());

            if (AdapterClass) {
                Logger.info('NAV', LOG_STYLES.GREEN, `Switching to adapter: ${AdapterClass.id.toUpperCase()}`);
                await this._mountAdapter(AdapterClass);
            } else {
                Logger.info('NAV', LOG_STYLES.GRAY, `No applicable adapter found for: ${currentUrl}`);
            }
        }

        /**
         * Forces a rescan of the DOM to handle dynamic content updates (SPA navigation).
         * Removes processed flags and manually triggers handlers for existing elements.
         */
        _forceRescan() {
            if (!this.adapter || !this.activeSentinelSelector) return;

            Logger.info('RESCAN', LOG_STYLES.BLUE, 'Rescanning DOM for new content...');

            // 1. Reset processed flags to allow re-detection
            const processedElements = document.querySelectorAll(`.${APPID}-processed`);
            processedElements.forEach((el) => el.classList.remove(`${APPID}-processed`));

            // 2. Manually query matches using the sentinel selector
            // Since we removed the exclusion class, the selector will match all valid items again.
            const targets = document.querySelectorAll(this.activeSentinelSelector);

            Logger.debug('DEBUG', '', `Manual rescan found ${targets.length} candidates.`);

            targets.forEach((el) => {
                this.adapter.onResultFound(el);
            });
        }

        /**
         * Mounts the specified adapter and starts observation.
         * @param {typeof BaseAdapter} AdapterClass
         */
        async _mountAdapter(AdapterClass) {
            // Get Platform Styles
            const platformStyles = SITE_STYLES[AdapterClass.id];

            // Inject Platform-Specific Overrides (Layout)
            if (platformStyles.overrides) {
                const style = document.createElement('style');
                style.id = `${APPID}-platform-overrides`;
                style.textContent = platformStyles.overrides;
                const nonce = document.querySelector('script[nonce]')?.nonce;
                if (nonce) style.setAttribute('nonce', nonce);
                document.head.appendChild(style);
            }

            // Initialize UI Manager with platform styles
            this.uiManager.init(platformStyles);

            // Instantiate Adapter
            this.adapter = new AdapterClass(this.uiManager);

            // Register async fetcher if supported
            if (typeof this.adapter.fetchOriginalImageUrl === 'function' && this.adapter.fetchOriginalImageUrl !== BaseAdapter.prototype.fetchOriginalImageUrl) {
                this.uiManager.setOriginalImageFetcher(this.adapter.fetchOriginalImageUrl.bind(this.adapter));
            } else {
                // Reset fetcher if previous adapter had one but this one doesn't
                this.uiManager.setOriginalImageFetcher(null);
            }

            Logger.log('INIT', LOG_STYLES.GREEN, `Mounted ${AdapterClass.id.toUpperCase()}`);

            // Start Sentinel Observation
            const selector = this.adapter.getSentinelSelector();
            if (selector) {
                this.activeSentinelSelector = selector;
                // Bind handler to maintain "this" context and allow removal
                this.boundResultHandler = (el) => {
                    if (this.adapter) {
                        this.adapter.onResultFound(el);

                        // Smoke Test: Validate extraction on the first result found.
                        // Triggers validation logic inside extractUrls.
                        if (!this.adapter.hasSmokeTested) {
                            this.adapter.hasSmokeTested = true;
                            this.adapter.extractUrls(el);
                        }
                    }
                };
                Logger.info('SENTINEL', LOG_STYLES.BLUE, `Observing: "${selector}"`);
                this.sentinel.on(selector, this.boundResultHandler);
            } else {
                Logger.warn('INIT WARN', '', 'No sentinel selector defined for this adapter.');
            }
        }

        /**
         * Unmounts the current adapter and stops observation.
         */
        _unmountAdapter() {
            if (!this.adapter) return;

            // Stop Sentinel Observation
            if (this.activeSentinelSelector && this.boundResultHandler) {
                this.sentinel.off(this.activeSentinelSelector, this.boundResultHandler);
                this.activeSentinelSelector = null;
                this.boundResultHandler = null;
            }

            // Remove Platform Overrides
            const style = document.getElementById(`${APPID}-platform-overrides`);
            if (style) style.remove();

            // Clear reference
            this.adapter = null;
            Logger.info('TERM', LOG_STYLES.GRAY, 'Adapter unmounted.');
        }

        /**
         * Opens settings modal with appropriate styles.
         */
        _openSettings() {
            // Determine styles: use active adapter's styles or fallback to Google's (as generic dark theme)
            let styles = SITE_STYLES.google;
            if (this.adapter) {
                styles = SITE_STYLES[this.adapter.constructor.id];
            }

            if (!this.settingsModal) {
                this.settingsModal = new SettingsModal(this.configManager, styles);
            } else {
                // Update styles if reused (though we typically recreate logic if needed, simple prop update is tricky here)
                // For simplicity, we just create a new instance if styles differ, or let the modal handle it.
                // Given the modal implementation, it's safer to recreate if we want to switch themes dynamically.
                // But typically users don't switch sites while settings is open.
                // We'll pass the current styles to a new instance to be safe.
                this.settingsModal = new SettingsModal(this.configManager, styles);
            }
            this.settingsModal.open();
        }
    }

    // =================================================================================
    // SECTION: Entry Point
    // =================================================================================

    if (ExecutionGuard.hasExecuted()) return;
    ExecutionGuard.setExecuted();

    // 1. Instantiate controller immediately.
    const app = new AppController();

    // 2. Initialize the app immediately.
    // The init method checks isApplicable() internally.
    app.init().catch((e) => {
        Logger.error('INIT ERROR', '', 'Failed to initialize app:', e);
    });
})();
