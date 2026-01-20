// ==UserScript==
// @name         Summarize The Web
// @namespace    https://fanis.dev/userscripts
// @author       Fanis Hatzidakis
// @license      PolyForm-Internal-Use-1.0.0; https://polyformproject.org/licenses/internal-use/1.0.0/
// @version      1.6.0
// @description  Summarize web articles via OpenAI API. Modular architecture with configurable selectors and inspection mode.
// @match        *://*/*
// @exclude      about:*
// @exclude      moz-extension:*
// @run-at       document-end
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @connect      api.openai.com
// @downloadURL https://update.greasyfork.org/scripts/559276/Summarize%20The%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/559276/Summarize%20The%20Web.meta.js
// ==/UserScript==

// SPDX-License-Identifier: PolyForm-Internal-Use-1.0.0
// Copyright (c) 2025 Fanis Hatzidakis
// License: PolyForm Internal Use License 1.0.0
// Summary: Free for personal and internal business use. No redistribution, resale,
// or offering as a service without a separate commercial license from the author.
// Full text: https://polyformproject.org/licenses/internal-use/1.0.0/


(function () {
    'use strict';

    /**
     * Configuration constants and settings for Summarize The Web
     */

    const CFG = {
        model: 'gpt-5-nano',
        DEBUG: false,
    };

    const UI_ATTR = 'data-digest-ui';
    const LOG_PREFIX = '[summarize-the-web]';

    // Available models with pricing
    // Pricing source: https://openai.com/api/pricing/ (as of 2025-12-18)
    const MODEL_OPTIONS = {
        'gpt-5-nano': {
            name: 'GPT-5 Nano',
            apiModel: 'gpt-5-nano',
            description: 'Ultra-affordable latest generation - Best value for most articles',
            inputPer1M: 0.05,
            outputPer1M: 0.40,
            recommended: true,
            priority: false
        },
        'gpt-5-mini': {
            name: 'GPT-5 Mini',
            apiModel: 'gpt-5-mini',
            description: 'Better quality, still very affordable',
            inputPer1M: 0.25,
            outputPer1M: 2.00,
            recommended: false,
            priority: false
        },
        'gpt-4.1-nano-priority': {
            name: 'GPT-4.1 Nano Priority',
            apiModel: 'gpt-4.1-nano',
            description: 'Faster processing - Cheaper than regular GPT-5 Mini',
            inputPer1M: 0.20,
            outputPer1M: 0.80,
            recommended: false,
            priority: true
        },
        'gpt-5-mini-priority': {
            name: 'GPT-5 Mini Priority',
            apiModel: 'gpt-5-mini',
            description: 'Better quality + faster processing',
            inputPer1M: 0.45,
            outputPer1M: 3.60,
            recommended: false,
            priority: true
        },
        'gpt-5.2-priority': {
            name: 'GPT-5.2 Priority',
            apiModel: 'gpt-5.2',
            description: 'Premium quality + fastest processing (most expensive)',
            inputPer1M: 2.50,
            outputPer1M: 20.00,
            recommended: false,
            priority: true
        }
    };

    // Storage keys
    const STORAGE_KEYS = {
        OPENAI_KEY: 'OPENAI_KEY',
        DOMAINS_MODE: 'digest_domains_mode_v1',
        DOMAINS_DENY: 'digest_domains_excluded_v1',
        DOMAINS_ALLOW: 'digest_domains_enabled_v1',
        DEBUG: 'digest_debug_v1',
        SIMPLIFICATION_STRENGTH: 'digest_simplification_v1',
        AUTO_SIMPLIFY: 'digest_auto_simplify_v1',
        CUSTOM_PROMPT: 'digest_custom_prompt_v1',
        OVERLAY_POS: 'digest_overlay_pos_v1',
        OVERLAY_COLLAPSED: 'digest_overlay_collapsed_v1',
        FIRST_INSTALL: 'digest_installed_v1',
        API_TOKENS: 'digest_api_tokens_v1',
        PRICING: 'digest_pricing_v1',
        CACHE: 'digest_cache_v1',
        MODEL: 'digest_model_v1',
        // Article extraction selectors
        SELECTORS_GLOBAL: 'digest_selectors_v1',
        EXCLUDES_GLOBAL: 'digest_excludes_v1',
        DOMAIN_SELECTORS: 'digest_domain_selectors_v1',
        DOMAIN_EXCLUDES: 'digest_domain_excludes_v1',
        MIN_TEXT_LENGTH: 'digest_min_text_length_v1',
    };

    // Minimum text length for extraction (in characters)
    const DEFAULT_MIN_TEXT_LENGTH = 100;

    // Default prompts
    const DEFAULT_PROMPTS = {
        summary_large: 'You will receive INPUT as article text. Summarize and simplify the content to approximately 50% of the original length. Make the language clearer and more direct while staying in the SAME language as input. CRITICAL: Do NOT change facts, numbers, names, quotes, or the actual meaning/details of the content. If the text contains direct quotes inside quotation marks, keep that quoted text VERBATIM. Preserve all factual information, statistics, proper nouns, and direct quotes exactly as they appear. Maintain paragraph structure where appropriate. Return ONLY the simplified text without any formatting, code blocks, or JSON.',
        summary_small: 'You will receive INPUT as article text. Create a concise summary at approximately 20% of the original length while staying in the SAME language as input. Focus on the most important points and key facts. CRITICAL: Do NOT change facts, numbers, names, or core meaning. Preserve important quotes, statistics, and proper nouns exactly as they appear. Condense the content aggressively to achieve the 20% length target while maintaining readability. Return ONLY the summary text without any formatting, code blocks, or JSON.'
    };

    // Simplification style levels
    const SIMPLIFICATION_LEVELS = ['Conservative', 'Balanced', 'Aggressive'];

    // Style instructions appended to prompts
    const STYLE_INSTRUCTIONS = {
        'Conservative': ' Minimize rephrasing. Preserve original wording and sentence structure where possible.',
        'Balanced': '',
        'Aggressive': ' Maximize simplification. Use simpler vocabulary and shorter sentences.'
    };

    // Default article container selectors (ordered by specificity)
    const DEFAULT_SELECTORS = [
        '[itemprop="articleBody"]',
        'article[itemtype*="Article"]',
        '.article-body',
        '.post-content',
        '.entry-content',
        '[class*="article-content"]',
        ':is(div, section, article)[class*="post-body"]',
        // Greek news sites
        '[class*="articleContainer"] .cnt',
        '[class*="articleContainer"]',
        '.story-content',
        '.story-body',
        // Generic fallbacks
        'article',
        'main',
        '[role="main"]'
    ];

    // Default exclusions (elements to skip when extracting text)
    const DEFAULT_EXCLUDES = {
        self: [],
        ancestors: [
            '.comment', '.comments', '.sidebar', '.navigation', '.menu',
            '.footer', '.header', 'nav', 'aside', '.related', '.recommended',
            '.advertisement', '.ad', '.social-share', '.author-bio'
        ]
    };

    // Default API pricing
    const DEFAULT_PRICING = {
        model: 'gpt-5-nano',
        inputPer1M: 0.05,
        outputPer1M: 0.40,
        lastUpdated: '2025-12-18',
        source: 'https://openai.com/api/pricing/'
    };

    // Cache settings
    const CACHE_LIMIT = 50;
    const CACHE_TRIM_TO = 30;

    // Max output tokens per summary mode
    const MAX_OUTPUT_TOKENS = {
        large: 4000,
        small: 2000
    };

    /**
     * Utility functions for Summarize The Web
     */


    /**
     * Debug logging
     */
    function log(...args) {
        if (!CFG.DEBUG) return;
        console.log(LOG_PREFIX, ...args);
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, m => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m]));
    }

    /**
     * Parse lines from textarea input
     */
    function parseLines(s) {
        return s.split(/[\n,;]+/).map(x => x.trim()).filter(Boolean);
    }

    /**
     * Normalize whitespace in text
     */
    function normalizeSpace(s) {
        return s.replace(/\s+/g, ' ').trim();
    }

    /**
     * Get trimmed text content from element
     */
    function textTrim(el) {
        return normalizeSpace(el.textContent || '');
    }

    /**
     * Storage module with GM → localStorage → memory fallback
     * Handles userscript storage across different environments
     */

    class Storage {
        constructor() {
            this.memory = new Map();
            this.namespace = '__webdigest__';
        }

        /**
         * Get value from storage with fallback chain
         * @param {string} key - Storage key
         * @param {any} defaultValue - Default value if not found
         * @returns {Promise<any>}
         */
        async get(key, defaultValue = '') {
            // Try GM.getValue (async)
            try {
                if (typeof GM?.getValue === 'function') {
                    const value = await GM.getValue(key);
                    if (value != null) return value;
                }
            } catch {}

            // Try GM_getValue (sync, legacy)
            try {
                if (typeof GM_getValue === 'function') {
                    const value = GM_getValue(key);
                    if (value != null) return value;
                }
            } catch {}

            // Try localStorage
            try {
                const bag = JSON.parse(localStorage.getItem(this.namespace) || '{}');
                if (key in bag) return bag[key];
            } catch {}

            // Try memory fallback
            if (this.memory.has(key)) {
                return this.memory.get(key);
            }

            return defaultValue;
        }

        /**
         * Set value in storage with fallback chain
         * @param {string} key - Storage key
         * @param {any} value - Value to store
         * @returns {Promise<boolean>} - Success status
         */
        async set(key, value) {
            let success = false;

            // Try GM.setValue (async)
            try {
                if (typeof GM?.setValue === 'function') {
                    await GM.setValue(key, value);
                    success = true;
                }
            } catch {}

            // Try GM_setValue (sync, legacy)
            if (!success) {
                try {
                    if (typeof GM_setValue === 'function') {
                        GM_setValue(key, value);
                        success = true;
                    }
                } catch {}
            }

            // Try localStorage
            if (!success) {
                try {
                    const bag = JSON.parse(localStorage.getItem(this.namespace) || '{}');
                    bag[key] = value;
                    localStorage.setItem(this.namespace, JSON.stringify(bag));
                    success = true;
                } catch {}
            }

            // Fallback to memory
            if (!success) {
                this.memory.set(key, value);
            }

            return success;
        }

        /**
         * Delete value from storage
         * @param {string} key - Storage key
         * @returns {Promise<boolean>} - Success status
         */
        async delete(key) {
            let success = false;

            // Try GM.deleteValue (async)
            try {
                if (typeof GM?.deleteValue === 'function') {
                    await GM.deleteValue(key);
                    success = true;
                }
            } catch {}

            // Try GM_deleteValue (sync, legacy)
            try {
                if (typeof GM_deleteValue === 'function') {
                    GM_deleteValue(key);
                    success = true;
                }
            } catch {}

            // Try localStorage
            try {
                const bag = JSON.parse(localStorage.getItem(this.namespace) || '{}');
                if (key in bag) {
                    delete bag[key];
                    localStorage.setItem(this.namespace, JSON.stringify(bag));
                    success = true;
                }
            } catch {}

            // Always delete from memory
            this.memory.delete(key);

            return success;
        }
    }

    /**
     * Selector and domain matching utilities
     */

    /**
     * Convert glob pattern to RegExp
     * @param {string} glob - Glob pattern (e.g., "*.example.com")
     * @returns {RegExp}
     */
    function globToRegExp(glob) {
        const esc = s => s.replace(/[.+^${}()|[\]\\*?]/g, '\\$&');
        const g = esc(glob).replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
        return new RegExp(`^${g}$`, 'i');
    }

    /**
     * Convert domain pattern to regex, handling wildcards and regex literals
     * @param {string} pattern - Domain pattern
     * @returns {RegExp|null}
     */
    function domainPatternToRegex(pattern) {
        pattern = pattern.trim();
        if (!pattern) return null;

        // Handle regex literal: /pattern/
        if (pattern.startsWith('/') && pattern.endsWith('/')) {
            try {
                return new RegExp(pattern.slice(1, -1), 'i');
            } catch {
                return null;
            }
        }

        // Handle glob patterns with wildcards
        if (pattern.includes('*') || pattern.includes('?')) {
            return globToRegExp(pattern.replace(/^\.*\*?\./, '*.'));
        }

        // Exact match with subdomain support
        const esc = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`(^|\\.)${esc}$`, 'i');
    }

    /**
     * Check if hostname matches any pattern in list
     * @param {string[]} list - List of domain patterns
     * @param {string} hostname - Hostname to check
     * @returns {boolean}
     */
    function listMatchesHost(list, hostname) {
        for (const pattern of list) {
            const regex = domainPatternToRegex(pattern);
            if (regex && regex.test(hostname)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Compile selector list into CSS selector string
     * @param {string[]} selectors - Array of CSS selectors
     * @returns {string} - Comma-separated selector string
     */
    function compiledSelectors(selectors) {
        return selectors.filter(Boolean).join(',');
    }

    /**
     * Check if element matches any selector in list
     * @param {Element} el - Element to check
     * @param {string[]} selectorList - List of CSS selectors
     * @returns {string[]} - Matching selectors
     */
    function findMatchingSelectors(el, selectorList) {
        const matches = [];
        for (const sel of selectorList) {
            try {
                if (el.matches(sel)) {
                    matches.push(sel);
                }
            } catch (e) {
                // Invalid selector, skip
            }
        }
        return matches;
    }

    /**
     * Check if element matches any exclusion pattern
     * @param {Element} el - Element to check
     * @param {Object} excludeObj - Object with self and ancestors arrays
     * @returns {Object} - Matching exclusions
     */
    function findMatchingExclusions(el, excludeObj) {
        const matches = { self: [], ancestors: [] };

        if (excludeObj.self) {
            for (const sel of excludeObj.self) {
                try {
                    if (el.matches(sel)) {
                        matches.self.push(sel);
                    }
                } catch (e) {
                    // Invalid selector, skip
                }
            }
        }

        if (excludeObj.ancestors) {
            for (const sel of excludeObj.ancestors) {
                try {
                    if (el.closest(sel)) {
                        matches.ancestors.push(sel);
                    }
                } catch (e) {
                    // Invalid selector, skip
                }
            }
        }

        return matches;
    }

    /**
     * Generate a CSS selector for an element
     * @param {Element} el - Element to generate selector for
     * @returns {string} - CSS selector
     */
    function generateCSSSelector(el) {
        if (el.id) {
            return `#${CSS.escape(el.id)}`;
        }

        if (el.classList.length > 0) {
            const classes = Array.from(el.classList).map(c => `.${CSS.escape(c)}`).join('');
            return `${el.tagName.toLowerCase()}${classes}`;
        }

        let path = [];
        let current = el;
        while (current && current !== document.body) {
            let selector = current.tagName.toLowerCase();

            if (current.id) {
                selector = `#${CSS.escape(current.id)}`;
                path.unshift(selector);
                break;
            }

            let sibling = current;
            let nth = 1;
            while (sibling.previousElementSibling) {
                sibling = sibling.previousElementSibling;
                if (sibling.tagName === current.tagName) nth++;
            }

            if (nth > 1 || current.nextElementSibling) {
                selector += `:nth-child(${nth})`;
            }

            path.unshift(selector);
            current = current.parentElement;

            if (path.length > 3) break;
        }

        return path.join(' > ');
    }

    /**
     * OpenAI API functions for Summarize The Web
     */


    // API token usage tracking
    let API_TOKENS = {
        digest: { input: 0, output: 0, calls: 0 }
    };

    // API Pricing configuration
    let PRICING = { ...DEFAULT_PRICING };

    /**
     * Initialize API tracking from storage
     */
    async function initApiTracking(storage) {
        try {
            const stored = await storage.get(STORAGE_KEYS.API_TOKENS, '');
            if (stored) API_TOKENS = JSON.parse(stored);
        } catch {}

        try {
            const stored = await storage.get(STORAGE_KEYS.PRICING, '');
            if (stored) PRICING = JSON.parse(stored);
        } catch {}

        // Load saved model preference
        try {
            const stored = await storage.get(STORAGE_KEYS.MODEL, '');
            if (stored && MODEL_OPTIONS[stored]) {
                CFG.model = stored;
                PRICING.model = stored;
                PRICING.inputPer1M = MODEL_OPTIONS[stored].inputPer1M;
                PRICING.outputPer1M = MODEL_OPTIONS[stored].outputPer1M;
            }
        } catch {}
    }

    /**
     * Build API headers
     */
    function apiHeaders(key) {
        return {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
    }

    /**
     * Make XHR POST request (for userscript cross-origin)
     */
    function xhrPost(url, data, headers = {}) {
        return new Promise((resolve, reject) => {
            const api = (typeof GM !== 'undefined' && GM.xmlHttpRequest) ? GM.xmlHttpRequest : GM_xmlhttpRequest;
            api({
                method: 'POST',
                url,
                data,
                headers,
                onload: (r) => {
                    if (r.status >= 200 && r.status < 300) return resolve(r.responseText);
                    const err = new Error(`HTTP ${r.status}`);
                    err.status = r.status;
                    err.body = r.responseText || '';
                    reject(err);
                },
                onerror: (e) => { const err = new Error((e && e.error) || 'Network error'); err.status = 0; reject(err); },
                timeout: 60000,
                ontimeout: () => { const err = new Error('Request timeout'); err.status = 0; reject(err); },
            });
        });
    }

    /**
     * Make XHR GET request
     */
    function xhrGet(url, headers = {}) {
        return new Promise((resolve, reject) => {
            const api = (typeof GM !== 'undefined' && GM.xmlHttpRequest) ? GM.xmlHttpRequest : GM_xmlhttpRequest;
            api({
                method: 'GET',
                url,
                headers,
                onload: (r) => {
                    if (r.status >= 200 && r.status < 300) return resolve(r.responseText);
                    const err = new Error(`HTTP ${r.status}`);
                    err.status = r.status;
                    err.body = r.responseText || '';
                    reject(err);
                },
                onerror: (e) => { const err = new Error((e && e.error) || 'Network error'); err.status = 0; reject(err); },
                timeout: 30000,
                ontimeout: () => { const err = new Error('Request timeout'); err.status = 0; reject(err); },
            });
        });
    }

    /**
     * Extract output text from API response
     */
    function extractOutputText(data) {
        if (typeof data.output_text === 'string') return data.output_text;
        if (Array.isArray(data.output)) {
            const parts = [];
            for (const msg of data.output) {
                if (Array.isArray(msg.content)) {
                    for (const c of msg.content) {
                        if (typeof c.text === 'string') parts.push(c.text);
                        else if (c.type === 'output_text' && typeof c.text === 'string') parts.push(c.text);
                    }
                }
            }
            if (parts.length) return parts.join('');
        }
        if (Array.isArray(data.choices)) return data.choices.map((ch) => ch.message?.content || '').join('\n');
        return '';
    }

    /**
     * Update API token usage stats
     */
    function updateApiTokens(storage, type, usage) {
        if (!usage) return;

        const inputTokens = usage.input_tokens || usage.prompt_tokens || 0;
        const outputTokens = usage.output_tokens || usage.completion_tokens || 0;

        if (inputTokens === 0 && outputTokens === 0) {
            log('WARNING: No token data found in usage object:', usage);
            return;
        }

        API_TOKENS[type].input += inputTokens;
        API_TOKENS[type].output += outputTokens;
        API_TOKENS[type].calls += 1;

        log(`${type} tokens: +${inputTokens} input, +${outputTokens} output (total: ${API_TOKENS[type].input + API_TOKENS[type].output})`);

        clearTimeout(updateApiTokens._timer);
        updateApiTokens._timer = setTimeout(() => {
            storage.set(STORAGE_KEYS.API_TOKENS, JSON.stringify(API_TOKENS));
            log('API tokens updated and saved:', API_TOKENS);
        }, 1000);
    }

    /**
     * Reset API token stats
     */
    async function resetApiTokens(storage) {
        API_TOKENS = {
            digest: { input: 0, output: 0, calls: 0 }
        };
        await storage.set(STORAGE_KEYS.API_TOKENS, JSON.stringify(API_TOKENS));
        log('API token stats reset');
    }

    /**
     * Calculate estimated API cost
     */
    function calculateApiCost() {
        const inputCost = API_TOKENS.digest.input * PRICING.inputPer1M / 1_000_000;
        const outputCost = API_TOKENS.digest.output * PRICING.outputPer1M / 1_000_000;
        return inputCost + outputCost;
    }

    /**
     * Call OpenAI API to digest text
     */
    async function digestText(storage, text, mode, prompt, styleLevel, cacheGet, cacheSet, openKeyDialog, openInfo) {
        const KEY = await storage.get(STORAGE_KEYS.OPENAI_KEY, '');
        if (!KEY) {
            openKeyDialog('OpenAI API key missing.');
            throw Object.assign(new Error('API key missing'), { status: 401 });
        }

        // Check cache first
        const cached = cacheGet(text, mode);
        if (cached) {
            log(`Using cached summary for ${mode} mode`);
            return cached.result;
        }

        const safeInput = text.replace(/[\u2028\u2029]/g, ' ');

        // Get the actual API model name (not the UI identifier)
        const apiModelName = MODEL_OPTIONS[CFG.model]?.apiModel || CFG.model;

        // Append style instructions to prompt
        const styleInstruction = STYLE_INSTRUCTIONS[styleLevel] || '';
        const fullPrompt = prompt + styleInstruction;

        const requestBody = {
            model: apiModelName,
            max_output_tokens: mode.includes('small') ? MAX_OUTPUT_TOKENS.small : MAX_OUTPUT_TOKENS.large,
            instructions: fullPrompt,
            input: safeInput
        };

        // GPT-5 models are reasoning models - minimize reasoning for summarization
        if (apiModelName.startsWith('gpt-5')) {
            requestBody.reasoning = { effort: 'minimal' };
        }

        // Add service_tier for priority models
        if (MODEL_OPTIONS[CFG.model]?.priority) {
            requestBody.service_tier = 'priority';
        }

        const body = JSON.stringify(requestBody);

        const resText = await xhrPost('https://api.openai.com/v1/responses', body, apiHeaders(KEY));
        const payload = JSON.parse(resText);
        log('API response status:', payload.status, 'usage:', payload.usage);

        if (payload.usage) {
            updateApiTokens(storage, 'digest', payload.usage);
        }

        // Check for incomplete response
        if (payload.status === 'incomplete') {
            const reason = payload.incomplete_details?.reason || 'unknown';
            let errorMsg = 'API response incomplete';
            if (reason === 'max_output_tokens') {
                const reasoningTokens = payload.usage?.output_tokens_details?.reasoning_tokens || 0;
                if (reasoningTokens > 0) {
                    errorMsg = `Model used all tokens on reasoning (${reasoningTokens} tokens). Try a different model or increase max_output_tokens in config.js`;
                } else {
                    errorMsg = 'Response exceeded max_output_tokens limit. Try selecting less text or increase the limit in config.js';
                }
            }
            throw Object.assign(new Error(errorMsg), { status: 400, isIncomplete: true });
        }

        const outStr = extractOutputText(payload);
        log('Extracted output:', outStr ? outStr.substring(0, 100) + '...' : 'null');
        if (!outStr) throw Object.assign(new Error('No output from API. The model returned an empty response.'), { status: 400 });

        // Strip markdown code fences if present
        const cleaned = outStr.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();

        // Try to parse as JSON (API might return array or plain text)
        let result;
        try {
            const parsed = JSON.parse(cleaned);
            if (Array.isArray(parsed)) {
                result = parsed.join('\n\n');
            } else if (typeof parsed === 'string') {
                result = parsed;
            } else {
                result = cleaned;
            }
        } catch (e) {
            result = cleaned;
        }

        await cacheSet(text, mode, result);
        return result;
    }

    /**
     * Handle API errors with friendly messages
     */
    function friendlyApiError(err, openKeyDialog, openInfo) {
        log('API error:', err?.status, err?.message);
        const s = err?.status || 0;
        if (s === 401) { openKeyDialog('Unauthorized (401). Please enter a valid OpenAI key.'); return; }
        if (s === 429) { openInfo('Rate limited by API (429). Try again in a minute.'); return; }
        if (err.isIncomplete) { openInfo(err.message); return; }
        if (s === 400) { openInfo(err.message || 'Bad request (400). The API could not parse the text. Try selecting less text.'); return; }
        openInfo(`Unknown error${s ? ' (' + s + ')' : ''}. Check your network or try again.`);
    }

    var api = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get API_TOKENS () { return API_TOKENS; },
        get PRICING () { return PRICING; },
        apiHeaders: apiHeaders,
        calculateApiCost: calculateApiCost,
        digestText: digestText,
        extractOutputText: extractOutputText,
        friendlyApiError: friendlyApiError,
        initApiTracking: initApiTracking,
        resetApiTokens: resetApiTokens,
        updateApiTokens: updateApiTokens,
        xhrGet: xhrGet,
        xhrPost: xhrPost
    });

    /**
     * Cache management for Summarize The Web
     */


    class DigestCache {
        constructor(storage) {
            this.storage = storage;
            this.cache = {};
            this.dirty = false;
        }

        /**
         * Initialize cache from storage
         */
        async init() {
            try {
                const stored = await this.storage.get(STORAGE_KEYS.CACHE, '{}');
                this.cache = JSON.parse(stored);
            } catch {
                this.cache = {};
            }

            // Start periodic save
            setInterval(() => this.save(), 5000);
        }

        /**
         * Generate cache key
         */
        key(text, mode) {
            return `${mode}:${text}`;
        }

        /**
         * Get cached result
         */
        get(text, mode) {
            const key = this.key(text, mode);
            return this.cache[key];
        }

        /**
         * Set cached result
         */
        async set(text, mode, result) {
            const key = this.key(text, mode);
            this.cache[key] = { result, timestamp: Date.now() };
            this.dirty = true;

            // Trim cache if needed
            const keys = Object.keys(this.cache);
            if (keys.length > CACHE_LIMIT) {
                const sorted = keys
                    .map(k => ({ key: k, time: this.cache[k].timestamp || 0 }))
                    .sort((a, b) => b.time - a.time);
                const keep = sorted.slice(0, CACHE_TRIM_TO).map(x => x.key);
                const newCache = {};
                keep.forEach(k => { newCache[k] = this.cache[k]; });
                this.cache = newCache;
            }

            await this.save();
        }

        /**
         * Clear entire cache
         */
        async clear() {
            this.cache = {};
            await this.storage.delete(STORAGE_KEYS.CACHE);
            log('cache cleared');
        }

        /**
         * Save cache to storage
         */
        async save() {
            if (!this.dirty) return;
            this.dirty = false;
            await this.storage.set(STORAGE_KEYS.CACHE, JSON.stringify(this.cache));
        }

        /**
         * Get cache size
         */
        get size() {
            return Object.keys(this.cache).length;
        }
    }

    /**
     * Settings dialogs and management for Summarize The Web
     */


    /**
     * Polymorphic editor for lists, secrets, domains, and info display
     */
    function openEditor({ title, hint = 'One item per line', mode = 'list', initial = [], globalItems = [], onSave, onValidate }) {
        const host = document.createElement('div');
        host.setAttribute(UI_ATTR, '');
        const shadow = host.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
        .wrap{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.45);
              display:flex;align-items:center;justify-content:center}
        .modal{background:#fff;max-width:680px;width:92%;border-radius:10px;
               box-shadow:0 10px 40px rgba(0,0,0,.35);padding:16px 16px 12px;box-sizing:border-box}
        .modal h3{margin:0 0 8px;font:600 16px/1.2 system-ui,sans-serif}
        .section-label{font:600 13px/1.2 system-ui,sans-serif;margin:8px 0 4px;color:#444}
        textarea{width:100%;height:220px;resize:vertical;padding:10px;box-sizing:border-box;
                 font:13px/1.4 ui-monospace,Consolas,monospace;border:1px solid #ccc;border-radius:4px}
        textarea.readonly{background:#f5f5f5;color:#666;height:120px}
        textarea.editable{height:180px}
        .row{display:flex;gap:8px;align-items:center}
        input[type=password],input[type=text]{flex:1;padding:10px;border-radius:8px;border:1px solid #ccc;
                 font:14px/1.3 ui-monospace,Consolas,monospace;box-sizing:border-box}
        .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:10px}
        .actions button{padding:8px 12px;border-radius:8px;border:1px solid #d0d0d0;background:#f6f6f6;cursor:pointer}
        .actions .save{background:#667eea;color:#fff;border-color:#667eea}
        .actions .test{background:#34a853;color:#fff;border-color:#34a853}
        .hint{margin:8px 0 0;color:#666;font:12px/1.2 system-ui,sans-serif}
    `;
        const wrap = document.createElement('div');
        wrap.className = 'wrap';
        const bodyList = `<textarea spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off">${
        Array.isArray(initial) ? initial.join('\n') : ''
    }</textarea>`;
        const bodyDomain = `
        <div class="section-label">Global settings (read-only):</div>
        <textarea class="readonly" readonly spellcheck="false">${Array.isArray(globalItems) ? globalItems.join('\n') : ''}</textarea>
        <div class="section-label">Domain-specific additions (editable):</div>
        <textarea class="editable" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off">${Array.isArray(initial) ? initial.join('\n') : ''}</textarea>
    `;
        const bodySecret = `
        <div class="row">
            <input id="sec" type="password" placeholder="sk-..." autocomplete="off" />
            <button id="toggle" title="Show/Hide">👁</button>
        </div>`;
        const bodyInfo = `<textarea class="readonly" readonly spellcheck="false" style="height:auto;min-height:60px;max-height:300px;">${
        Array.isArray(initial) ? initial.join('\n') : String(initial)
    }</textarea>`;

        let bodyContent, actionsContent;
        if (mode === 'info') {
            bodyContent = bodyInfo;
            actionsContent = '<button class="cancel">Close</button>';
        } else if (mode === 'secret') {
            bodyContent = bodySecret;
            actionsContent = (onValidate ? '<button class="test">Validate</button>' : '') + '<button class="save">Save</button><button class="cancel">Cancel</button>';
        } else if (mode === 'domain') {
            bodyContent = bodyDomain;
            actionsContent = '<button class="save">Save</button><button class="cancel">Cancel</button>';
        } else {
            bodyContent = bodyList;
            actionsContent = '<button class="save">Save</button><button class="cancel">Cancel</button>';
        }

        wrap.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
            <h3>${title}</h3>
            ${bodyContent}
            <div class="actions">
                ${actionsContent}
            </div>
            <p class="hint">${hint}</p>
        </div>`;
        shadow.append(style, wrap);
        document.body.appendChild(host);
        const close = () => host.remove();

        if (mode === 'info') {
            const btnClose = shadow.querySelector('.cancel');
            btnClose.addEventListener('click', close);
            wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
            shadow.addEventListener('keydown', e => {
                if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); close(); }
            });
            wrap.setAttribute('tabindex', '-1');
            wrap.focus();
        } else if (mode === 'secret') {
            const inp = shadow.querySelector('#sec');
            const btnSave = shadow.querySelector('.save');
            const btnCancel = shadow.querySelector('.cancel');
            const btnToggle = shadow.querySelector('#toggle');
            const btnTest = shadow.querySelector('.test');
            if (typeof initial === 'string' && initial) inp.value = initial;
            btnToggle.addEventListener('click', () => { inp.type = (inp.type === 'password') ? 'text' : 'password'; inp.focus(); });
            btnSave.addEventListener('click', async () => {
                const v = inp.value.trim();
                if (!v) return;
                await onSave?.(v);
                btnSave.textContent = 'Saved';
                btnSave.style.background = '#34a853';
                btnSave.style.borderColor = '#34a853';
                setTimeout(close, 1000);
            });
            btnCancel.addEventListener('click', close);
            btnTest?.addEventListener('click', async () => { await onValidate?.(inp.value.trim()); });
            wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
            shadow.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); close(); } if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); btnSave.click(); } });
            inp.focus();
        } else if (mode === 'domain') {
            const ta = shadow.querySelector('textarea.editable');
            const btnSave = shadow.querySelector('.save');
            const btnCancel = shadow.querySelector('.cancel');
            btnSave.addEventListener('click', async () => { const lines = parseLines(ta.value); await onSave?.(lines); close(); });
            btnCancel.addEventListener('click', close);
            wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
            shadow.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); close(); } if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); btnSave.click(); } });
            ta.focus();
            ta.selectionStart = ta.selectionEnd = ta.value.length;
        } else {
            const ta = shadow.querySelector('textarea');
            const btnSave = shadow.querySelector('.save');
            const btnCancel = shadow.querySelector('.cancel');
            btnSave.addEventListener('click', async () => { const lines = parseLines(ta.value); await onSave?.(lines); close(); });
            btnCancel.addEventListener('click', close);
            wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
            shadow.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); close(); } if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); btnSave.click(); } });
            ta.focus();
            ta.selectionStart = ta.selectionEnd = ta.value.length;
        }
    }

    /**
     * Show info dialog
     */
    function openInfo(message) {
        openEditor({ title: 'Summarize The Web', mode: 'info', initial: message, hint: 'Press Enter or Escape to close.' });
    }

    /**
     * Show API key dialog
     */
    function openKeyDialog(storage, extra, apiKeyDialogShown) {
        if (apiKeyDialogShown.value) {
            return;
        }
        apiKeyDialogShown.value = true;

        openEditor({
            title: extra || 'OpenAI API key',
            mode: 'secret',
            initial: '',
            hint: 'Stored locally (GM → localStorage → memory). Validate sends GET /v1/models.',
            onSave: async (val) => {
                await storage.set(STORAGE_KEYS.OPENAI_KEY, val);
                apiKeyDialogShown.value = false;
            },
            onValidate: async (val) => {
                const key = val || await storage.get(STORAGE_KEYS.OPENAI_KEY, '');
                if (!key) { openInfo('No key to test'); return; }
                try {
                    await xhrGet('https://api.openai.com/v1/models', { Authorization: `Bearer ${key}` });
                    openInfo('Validation OK (HTTP 200)');
                } catch (e) {
                    openInfo(`Validation failed: ${e.message || e}`);
                }
            }
        });
    }

    /**
     * Show welcome dialog (first install)
     */
    function openWelcomeDialog(storage) {
        const host = document.createElement('div');
        host.setAttribute(UI_ATTR, '');
        const shadow = host.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
        .wrap{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.55);
              display:flex;align-items:center;justify-content:center}
        .modal{background:#fff;max-width:580px;width:94%;border-radius:12px;
               box-shadow:0 10px 40px rgba(0,0,0,.4);padding:24px;box-sizing:border-box}
        .modal h2{margin:0 0 16px;font:700 20px/1.3 system-ui,sans-serif;color:#1a1a1a}
        .modal p{margin:0 0 12px;font:14px/1.6 system-ui,sans-serif;color:#444}
        .modal .steps{background:#f8f9fa;padding:16px;border-radius:8px;margin:16px 0;
                       font:13px/1.5 system-ui,sans-serif}
        .modal .steps ol{margin:8px 0 0;padding-left:20px}
        .modal .steps li{margin:6px 0}
        .modal .steps a{color:#667eea;text-decoration:none}
        .modal .steps a:hover{text-decoration:underline}
        .actions{display:flex;gap:12px;justify-content:flex-end;margin-top:20px}
        .btn{padding:10px 20px;border-radius:8px;border:none;font:600 14px system-ui,sans-serif;
             cursor:pointer;transition:all 0.15s ease}
        .btn.primary{background:#667eea;color:#fff}
        .btn.primary:hover{background:#5568d3}
        .btn.secondary{background:#e8eaed;color:#1a1a1a}
        .btn.secondary:hover{background:#dadce0}
    `;
        const wrap = document.createElement('div');
        wrap.className = 'wrap';

        wrap.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-label="Welcome">
            <h2>Welcome to Summarize The Web!</h2>
            <p>This userscript helps you summarize and simplify web articles using AI.</p>
            <p>To get started, you'll need an OpenAI API key:</p>
            <div class="steps">
                <ol>
                    <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI API Keys</a></li>
                    <li>Sign in or create an account</li>
                    <li>Click "Create new secret key"</li>
                    <li>Copy the key and paste it in the next dialog</li>
                </ol>
            </div>
            <p style="font-size:13px;color:#666;margin-top:16px"><strong>Domain control:</strong> By default, all websites are disabled. After setup, you can enable websites one by one via the menu.</p>
            <p style="font-size:13px;color:#666">The script uses GPT-5 Nano (cost-effective). Your key is stored locally and never shared.</p>
            <div class="actions">
                <button class="btn secondary cancel">Maybe Later</button>
                <button class="btn primary continue">Set Up API Key</button>
            </div>
        </div>`;

        shadow.append(style, wrap);
        document.body.appendChild(host);

        const btnContinue = shadow.querySelector('.continue');
        const btnCancel = shadow.querySelector('.cancel');

        btnContinue.addEventListener('click', async () => {
            host.remove();
            openEditor({
                title: 'OpenAI API key',
                mode: 'secret',
                initial: '',
                hint: 'Paste your API key here. Click Validate to test it, then Save.',
                onSave: async (val) => {
                    await storage.set(STORAGE_KEYS.OPENAI_KEY, val);
                    await storage.set(STORAGE_KEYS.DOMAINS_MODE, 'deny');
                    await storage.set(STORAGE_KEYS.FIRST_INSTALL, 'true');
                    openInfo('API key saved! The script will now work on all websites. Reload any page to see it in action.');
                },
                onValidate: async (val) => {
                    const key = val || await storage.get(STORAGE_KEYS.OPENAI_KEY, '');
                    if (!key) { openInfo('Please enter your API key first'); return; }
                    try {
                        await xhrGet('https://api.openai.com/v1/models', { Authorization: `Bearer ${key}` });
                        openInfo('Validation OK! Click Save to continue.');
                    } catch (e) {
                        openInfo(`Validation failed: ${e.message || e}`);
                    }
                }
            });
        });

        btnCancel.addEventListener('click', async () => {
            host.remove();
            await storage.set(STORAGE_KEYS.FIRST_INSTALL, 'true');
            openInfo('You can set up your API key anytime via the userscript menu:\n"Set / Validate OpenAI API key"');
        });

        wrap.addEventListener('click', (e) => { if (e.target === wrap) btnCancel.click(); });
        shadow.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); btnCancel.click(); } });
        wrap.setAttribute('tabindex', '-1');
        wrap.focus();
    }

    /**
     * Show simplification style dialog
     */
    function openSimplificationStyleDialog(storage, currentLevel, setSimplification) {
        const host = document.createElement('div');
        host.setAttribute(UI_ATTR, '');
        const shadow = host.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
        .wrap{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.5);
              display:flex;align-items:center;justify-content:center}
        .modal{background:#fff;max-width:520px;width:90%;border-radius:12px;
               box-shadow:0 10px 40px rgba(0,0,0,.3);padding:24px;box-sizing:border-box}
        h3{margin:0 0 8px;font:600 18px/1.2 system-ui,sans-serif;color:#1a1a1a}
        .subtitle{margin:0 0 20px;font:13px/1.4 system-ui,sans-serif;color:#666}
        .option{padding:14px;margin:10px 0;border:2px solid #e0e0e0;border-radius:8px;
                cursor:pointer;transition:all 0.2s}
        .option:hover{border-color:#667eea;background:#f8f9ff}
        .option.selected{border-color:#667eea;background:#667eea;color:#fff}
        .option-title{font:600 15px/1.2 system-ui,sans-serif;margin-bottom:6px}
        .option-desc{font:13px/1.4 system-ui,sans-serif;opacity:0.85}
        .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:20px}
        .btn{padding:10px 20px;border-radius:8px;border:none;cursor:pointer;
             font:600 14px system-ui,sans-serif}
        .btn-save{background:#667eea;color:#fff}
        .btn-save:hover{background:#5568d3}
        .btn-cancel{background:#e0e0e0;color:#333}
        .btn-cancel:hover{background:#d0d0d0}
    `;

        const descriptions = {
            'Conservative': 'Minimal rephrasing - preserves original style and structure',
            'Balanced': 'Moderate simplification - good balance of clarity and faithfulness (Recommended)',
            'Aggressive': 'Maximum simplification - more creative rephrasing for easier reading'
        };

        const wrap = document.createElement('div');
        wrap.className = 'wrap';

        const optionsHtml = SIMPLIFICATION_LEVELS.map(level => `
        <div class="option ${level === currentLevel ? 'selected' : ''}" data-level="${level}">
            <div class="option-title">${level}</div>
            <div class="option-desc">${descriptions[level]}</div>
        </div>
    `).join('');

        wrap.innerHTML = `
        <div class="modal">
            <h3>Simplification Style</h3>
            <p class="subtitle">Controls how the AI simplifies language. Large/Small buttons control the target length.</p>
            ${optionsHtml}
            <div class="actions">
                <button class="btn btn-cancel">Cancel</button>
                <button class="btn btn-save">Save & Clear Cache</button>
            </div>
        </div>
    `;
        shadow.append(style, wrap);
        document.body.appendChild(host);

        let selectedLevel = currentLevel;

        const options = shadow.querySelectorAll('.option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selectedLevel = opt.dataset.level;
            });
        });

        const btnSave = shadow.querySelector('.btn-save');
        const btnCancel = shadow.querySelector('.btn-cancel');

        const close = () => host.remove();

        btnSave.addEventListener('click', async () => {
            if (!SIMPLIFICATION_LEVELS.includes(selectedLevel)) return;
            await setSimplification(selectedLevel);
            btnSave.textContent = 'Saved!';
            btnSave.style.background = '#34a853';
            setTimeout(close, 800);
        });

        btnCancel.addEventListener('click', close);
        wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
        shadow.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

        wrap.setAttribute('tabindex', '-1');
        wrap.focus();
    }

    /**
     * Show model selection dialog
     */
    function openModelSelectionDialog(storage, currentModel, onSelect) {
        const host = document.createElement('div');
        host.setAttribute(UI_ATTR, '');
        const shadow = host.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
        .wrap{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.5);
              display:flex;align-items:center;justify-content:center}
        .modal{background:#fff;max-width:600px;width:90%;border-radius:12px;
               box-shadow:0 10px 40px rgba(0,0,0,.3);padding:24px;box-sizing:border-box}
        h3{margin:0 0 8px;font:600 18px/1.2 system-ui,sans-serif;color:#1a1a1a}
        .subtitle{margin:0 0 20px;font:13px/1.4 system-ui,sans-serif;color:#666}
        .option{padding:16px;margin:10px 0;border:2px solid #e0e0e0;border-radius:8px;
                cursor:pointer;transition:all 0.2s;position:relative}
        .option:hover{border-color:#667eea;background:#f8f9ff}
        .option.selected{border-color:#667eea;background:#667eea;color:#fff}
        .option-header{display:flex;justify-content:space-between;align-items:start;margin-bottom:8px}
        .option-title{font:600 16px/1.2 system-ui,sans-serif}
        .option-badge{font:600 10px/1.2 system-ui,sans-serif;padding:4px 8px;
                      border-radius:4px;background:#34a853;color:#fff;text-transform:uppercase}
        .option.selected .option-badge{background:rgba(255,255,255,0.3)}
        .option-desc{font:13px/1.5 system-ui,sans-serif;opacity:0.85;margin-bottom:8px}
        .option-pricing{font:12px/1.3 system-ui,sans-serif;opacity:0.7;font-family:ui-monospace,monospace}
        .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:20px}
        .btn{padding:10px 20px;border-radius:8px;border:none;cursor:pointer;
             font:600 14px system-ui,sans-serif}
        .btn-save{background:#667eea;color:#fff}
        .btn-save:hover{background:#5568d3}
        .btn-cancel{background:#e0e0e0;color:#333}
        .btn-cancel:hover{background:#d0d0d0}
    `;

        const wrap = document.createElement('div');
        wrap.className = 'wrap';

        const optionsHtml = Object.keys(MODEL_OPTIONS).map(modelId => {
            const model = MODEL_OPTIONS[modelId];
            const isSelected = modelId === currentModel;
            const badge = model.recommended ? '<span class="option-badge">Recommended</span>' : '';
            return `
            <div class="option ${isSelected ? 'selected' : ''}" data-model="${modelId}">
                <div class="option-header">
                    <div class="option-title">${model.name}</div>
                    ${badge}
                </div>
                <div class="option-desc">${model.description}</div>
                <div class="option-pricing">$${model.inputPer1M.toFixed(2)}/1M input • $${model.outputPer1M.toFixed(2)}/1M output</div>
            </div>
        `;
        }).join('');

        wrap.innerHTML = `
        <div class="modal">
            <h3>AI Model Selection</h3>
            <p class="subtitle">Choose the OpenAI model for summarization. Higher-tier models provide better quality but cost more.</p>
            ${optionsHtml}
            <div class="actions">
                <button class="btn btn-cancel">Cancel</button>
                <button class="btn btn-save">Save & Reload</button>
            </div>
        </div>
    `;
        shadow.append(style, wrap);
        document.body.appendChild(host);

        let selectedModel = currentModel;

        const options = shadow.querySelectorAll('.option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selectedModel = opt.dataset.model;
            });
        });

        const btnSave = shadow.querySelector('.btn-save');
        const btnCancel = shadow.querySelector('.btn-cancel');

        const close = () => host.remove();

        btnSave.addEventListener('click', async () => {
            if (!MODEL_OPTIONS[selectedModel]) return;
            await onSelect(selectedModel);
            btnSave.textContent = 'Saved! Reloading...';
            btnSave.style.background = '#34a853';
            setTimeout(() => location.reload(), 800);
        });

        btnCancel.addEventListener('click', close);
        wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
        shadow.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

        wrap.setAttribute('tabindex', '-1');
        wrap.focus();
    }

    /**
     * Show custom prompts dialog
     */
    function openCustomPromptDialog(storage, currentPrompts, onSave) {
        const host = document.createElement('div');
        host.setAttribute(UI_ATTR, '');
        const shadow = host.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
        .wrap{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.5);
              display:flex;align-items:center;justify-content:center;overflow-y:auto}
        .modal{background:#fff;max-width:700px;width:94%;border-radius:12px;
               box-shadow:0 10px 40px rgba(0,0,0,.3);padding:24px;box-sizing:border-box;
               margin:20px;max-height:90vh;overflow-y:auto}
        h3{margin:0 0 16px;font:600 18px/1.2 system-ui,sans-serif;color:#1a1a1a}
        .section{margin:16px 0}
        .section-label{font:600 12px/1.2 system-ui,sans-serif;margin:0 0 6px;color:#555;
                       text-transform:uppercase;letter-spacing:0.5px}
        textarea{width:100%;height:100px;resize:vertical;padding:10px;box-sizing:border-box;
                 font:12px/1.4 ui-monospace,Consolas,monospace;border:2px solid #e0e0e0;
                 border-radius:8px}
        textarea:focus{outline:none;border-color:#667eea}
        .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:20px;
                 position:sticky;bottom:0;background:#fff;padding-top:12px}
        .btn{padding:10px 20px;border-radius:8px;border:none;cursor:pointer;
             font:600 14px system-ui,sans-serif}
        .btn-save{background:#667eea;color:#fff}
        .btn-save:hover{background:#5568d3}
        .btn-reset{background:#ff6b6b;color:#fff}
        .btn-reset:hover{background:#ee5a52}
        .btn-cancel{background:#e0e0e0;color:#333}
        .btn-cancel:hover{background:#d0d0d0}
        .hint{margin:6px 0 0;color:#999;font:11px/1.3 system-ui,sans-serif}
    `;

        const wrap = document.createElement('div');
        wrap.className = 'wrap';
        wrap.innerHTML = `
        <div class="modal">
            <h3>Custom Summary Prompts</h3>
            <div class="section">
                <div class="section-label">Large Summary (50%)</div>
                <textarea id="summary-large-prompt">${currentPrompts.summary_large || DEFAULT_PROMPTS.summary_large}</textarea>
                <p class="hint">Summarizes content to approximately 50% of original length</p>
            </div>
            <div class="section">
                <div class="section-label">Small Summary (20%)</div>
                <textarea id="summary-small-prompt">${currentPrompts.summary_small || DEFAULT_PROMPTS.summary_small}</textarea>
                <p class="hint">Creates a concise summary at approximately 20% of original length</p>
            </div>
            <div class="actions">
                <button class="btn btn-reset">Reset to Default</button>
                <button class="btn btn-cancel">Cancel</button>
                <button class="btn btn-save">Save & Clear Cache</button>
            </div>
        </div>
    `;
        shadow.append(style, wrap);
        document.body.appendChild(host);

        const summaryLarge = shadow.querySelector('#summary-large-prompt');
        const summarySmall = shadow.querySelector('#summary-small-prompt');
        const btnSave = shadow.querySelector('.btn-save');
        const btnReset = shadow.querySelector('.btn-reset');
        const btnCancel = shadow.querySelector('.btn-cancel');

        const close = () => host.remove();

        btnSave.addEventListener('click', async () => {
            const prompts = {
                summary_large: summaryLarge.value.trim() || DEFAULT_PROMPTS.summary_large,
                summary_small: summarySmall.value.trim() || DEFAULT_PROMPTS.summary_small
            };
            await onSave(prompts);
            btnSave.textContent = 'Saved!';
            btnSave.style.background = '#34a853';
            setTimeout(close, 1000);
        });

        btnReset.addEventListener('click', async () => {
            summaryLarge.value = DEFAULT_PROMPTS.summary_large;
            summarySmall.value = DEFAULT_PROMPTS.summary_small;
            btnReset.textContent = 'Reset!';
            setTimeout(() => { btnReset.textContent = 'Reset to Default'; }, 1000);
        });

        btnCancel.addEventListener('click', close);
        wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
        shadow.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

        wrap.setAttribute('tabindex', '-1');
        wrap.focus();
    }

    /**
     * Show usage statistics dialog
     */
    function showStats(cacheSize) {
        const host = document.createElement('div');
        host.setAttribute(UI_ATTR, '');
        const shadow = host.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
        .wrap{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.45);
             display:flex;align-items:center;justify-content:center}
        .modal{background:#fff;max-width:600px;width:92%;border-radius:12px;
               box-shadow:0 10px 40px rgba(0,0,0,.4);padding:20px;box-sizing:border-box;
               max-height:80vh;overflow-y:auto}
        h3{margin:0 0 16px;font:600 18px/1.2 system-ui,sans-serif;color:#1a1a1a}
        .section{background:#f8f9fa;padding:14px;border-radius:8px;margin:12px 0;
                 border-left:3px solid #667eea}
        .section h4{margin:0 0 10px;font:600 15px/1.2 system-ui,sans-serif;color:#667eea}
        .stat-row{display:flex;justify-content:space-between;padding:6px 0;
                  font:13px/1.4 system-ui,sans-serif;border-bottom:1px solid #e9ecef}
        .stat-row:last-child{border-bottom:none}
        .stat-label{color:#495057;font-weight:500}
        .stat-value{color:#212529;font-weight:600}
        .cost-highlight{background:#e8f4fd;padding:12px;border-radius:6px;margin:12px 0;
                        border-left:3px solid #667eea}
        .cost-label{font:13px/1.2 system-ui,sans-serif;color:#666;margin-bottom:4px}
        .cost-value{font:24px/1.2 system-ui,sans-serif;font-weight:700;color:#667eea}
        .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}
        .btn{padding:10px 20px;border-radius:8px;border:none;cursor:pointer;
             font:600 14px system-ui,sans-serif}
        .btn-close{background:#667eea;color:#fff}
        .btn-close:hover{background:#5568d3}
        .note{font:11px/1.4 system-ui,sans-serif;color:#6c757d;margin-top:12px;
              padding:8px;background:#fff3cd;border-radius:4px;border-left:3px solid #ffc107}
    `;

        const totalTokens = API_TOKENS.digest.input + API_TOKENS.digest.output;
        const totalCalls = API_TOKENS.digest.calls;
        const estimatedCost = calculateApiCost();

        const wrap = document.createElement('div');
        wrap.className = 'wrap';
        wrap.innerHTML = `
        <div class="modal">
            <h3>Usage Statistics</h3>

            <div class="cost-highlight">
                <div class="cost-label">Estimated Total Cost</div>
                <div class="cost-value">$${estimatedCost.toFixed(4)}</div>
            </div>

            <div class="section">
                <h4>API Usage (All Time)</h4>
                <div class="stat-row">
                    <span class="stat-label">Total API Calls</span>
                    <span class="stat-value">${totalCalls.toLocaleString()}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Total Tokens</span>
                    <span class="stat-value">${totalTokens.toLocaleString()}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Input Tokens</span>
                    <span class="stat-value">${API_TOKENS.digest.input.toLocaleString()}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Output Tokens</span>
                    <span class="stat-value">${API_TOKENS.digest.output.toLocaleString()}</span>
                </div>
            </div>

            <div class="section">
                <h4>Cache Statistics</h4>
                <div class="stat-row">
                    <span class="stat-label">Cached Digests</span>
                    <span class="stat-value">${cacheSize} entries</span>
                </div>
            </div>

            <div class="section">
                <h4>Current Model Configuration</h4>
                <div class="stat-row">
                    <span class="stat-label">Model</span>
                    <span class="stat-value">${MODEL_OPTIONS[PRICING.model]?.name || PRICING.model}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Input Cost</span>
                    <span class="stat-value">$${PRICING.inputPer1M.toFixed(2)} / 1M tokens</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Output Cost</span>
                    <span class="stat-value">$${PRICING.outputPer1M.toFixed(2)} / 1M tokens</span>
                </div>
            </div>

            <div class="note">
                Usage stats persist across page loads. Use "Reset API usage stats" from the menu to clear counters.
            </div>

            <div class="actions">
                <button class="btn btn-close">Close</button>
            </div>
        </div>
    `;
        shadow.append(style, wrap);
        document.body.appendChild(host);

        const close = () => host.remove();
        const btnClose = shadow.querySelector('.btn-close');
        btnClose.addEventListener('click', close);
        wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
        shadow.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); close(); } });

        wrap.setAttribute('tabindex', '-1');
        wrap.focus();
    }

    /**
     * Show domain list editor dialog
     */
    function openDomainEditor(storage, mode, DOMAIN_ALLOW, DOMAIN_DENY) {
        const host = document.createElement('div');
        host.setAttribute(UI_ATTR, '');
        const shadow = host.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
        .wrap{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.5);
              display:flex;align-items:center;justify-content:center}
        .modal{background:#fff;max-width:600px;width:90%;border-radius:12px;
               box-shadow:0 10px 40px rgba(0,0,0,.3);padding:20px;box-sizing:border-box}
        h3{margin:0 0 12px;font:600 18px/1.2 system-ui,sans-serif}
        textarea{width:100%;height:240px;resize:vertical;padding:12px;box-sizing:border-box;
                 font:13px/1.4 ui-monospace,Consolas,monospace;border:2px solid #e0e0e0;
                 border-radius:8px}
        textarea:focus{outline:none;border-color:#667eea}
        .hint{margin:12px 0;color:#666;font:12px/1.4 system-ui,sans-serif}
        .actions{display:flex;gap:8px;justify-content:flex-end}
        .btn{padding:10px 20px;border-radius:8px;border:none;cursor:pointer;
             font:600 14px system-ui,sans-serif}
        .btn-save{background:#667eea;color:#fff}
        .btn-save:hover{background:#5568d3}
        .btn-cancel{background:#e0e0e0;color:#333}
        .btn-cancel:hover{background:#d0d0d0}
    `;

        const list = mode === 'allow' ? DOMAIN_ALLOW : DOMAIN_DENY;
        const title = mode === 'allow' ? 'Allowlist (Enabled Domains)' : 'Denylist (Disabled Domains)';
        const hint = mode === 'allow'
            ? 'In ALLOW mode, the script only runs on these domains. One pattern per line. Supports wildcards (*.example.com) and regex (/pattern/).'
            : 'In DENY mode, the script is disabled on these domains. One pattern per line. Supports wildcards (*.example.com) and regex (/pattern/).';

        const wrap = document.createElement('div');
        wrap.className = 'wrap';
        wrap.innerHTML = `
        <div class="modal">
            <h3>${title}</h3>
            <textarea>${list.join('\n')}</textarea>
            <p class="hint">${hint}</p>
            <div class="actions">
                <button class="btn btn-cancel">Cancel</button>
                <button class="btn btn-save">Save & Reload</button>
            </div>
        </div>
    `;
        shadow.append(style, wrap);
        document.body.appendChild(host);

        const textarea = shadow.querySelector('textarea');
        const btnSave = shadow.querySelector('.btn-save');
        const btnCancel = shadow.querySelector('.btn-cancel');

        const close = () => host.remove();

        btnSave.addEventListener('click', async () => {
            const lines = textarea.value.split('\n').map(l => l.trim()).filter(Boolean);
            if (mode === 'allow') {
                await storage.set(STORAGE_KEYS.DOMAINS_ALLOW, JSON.stringify(lines));
            } else {
                await storage.set(STORAGE_KEYS.DOMAINS_DENY, JSON.stringify(lines));
            }
            location.reload();
        });

        btnCancel.addEventListener('click', close);
        wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
        shadow.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

        wrap.setAttribute('tabindex', '-1');
        wrap.focus();
    }

    /**
     * Inspection mode functionality for debugging article container detection
     */


    let inspectionOverlay = null;
    let inspectedElement = null;

    /**
     * Find the most specific/deepest meaningful element at coordinates
     */
    function findMostSpecificElement(x, y, SELECTORS) {
        const elements = document.elementsFromPoint(x, y);
        const filtered = elements.filter(el => !el.closest(`[${UI_ATTR}]`));
        if (!filtered.length) return null;

        const selectors = compiledSelectors(SELECTORS);

        for (const el of filtered) {
            const hasDirectText = Array.from(el.childNodes).some(
                node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
            );

            const matchesSelector = selectors && el.matches?.(selectors);
            const isContentElement = /^(DIV|ARTICLE|SECTION|MAIN|P|SPAN)$/i.test(el.tagName);
            const hasTextContent = el.textContent.trim().length > 0;

            if (hasDirectText || matchesSelector || (isContentElement && hasTextContent)) {
                return el;
            }
        }

        for (const el of filtered) {
            if (el.textContent.trim().length > 0) {
                return el;
            }
        }

        return filtered[0];
    }

    /**
     * Enter inspection mode
     */
    function enterInspectionMode(SELECTORS, HOST, SELECTORS_GLOBAL, SELECTORS_DOMAIN, EXCLUDE_GLOBAL, EXCLUDE_DOMAIN, EXCLUDE, storage, DOMAIN_SELECTORS, DOMAIN_EXCLUDES, openInfo) {
        if (inspectionOverlay) return;

        const overlay = document.createElement('div');
        overlay.setAttribute(UI_ATTR, '');
        overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 2147483645;
        background: rgba(0, 0, 0, 0.3);
        font-family: system-ui, sans-serif;
        pointer-events: none;
    `;

        const message = document.createElement('div');
        message.setAttribute(UI_ATTR, '');
        message.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px;
        border-radius: 8px; font-size: 14px; font-weight: 600;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 2147483646;
        pointer-events: none;
    `;
        message.textContent = 'Inspection Mode - Click any element to analyze. ESC to exit.';

        const originalCursor = document.body.style.cursor;
        document.body.style.cursor = 'crosshair';

        document.body.appendChild(overlay);
        document.body.appendChild(message);
        inspectionOverlay = { overlay, message, originalCursor };

        let currentHighlight = null;
        const onMouseMove = (e) => {
            const target = findMostSpecificElement(e.clientX, e.clientY, SELECTORS);
            if (!target) return;

            if (currentHighlight && currentHighlight !== target) {
                currentHighlight.style.outline = currentHighlight._origOutline || '';
                currentHighlight.style.outlineOffset = currentHighlight._origOutlineOffset || '';
                delete currentHighlight._origOutline;
                delete currentHighlight._origOutlineOffset;
            }

            if (currentHighlight !== target) {
                currentHighlight = target;
                currentHighlight._origOutline = currentHighlight.style.outline;
                currentHighlight._origOutlineOffset = currentHighlight.style.outlineOffset;
                currentHighlight.style.outline = '2px dashed #667eea';
                currentHighlight.style.outlineOffset = '2px';
            }
        };

        const onClick = (e) => {
            const target = findMostSpecificElement(e.clientX, e.clientY, SELECTORS);
            if (!target) return;

            e.preventDefault();
            e.stopPropagation();

            inspectedElement = target;

            if (currentHighlight) {
                currentHighlight.style.outline = currentHighlight._origOutline || '';
                currentHighlight.style.outlineOffset = currentHighlight._origOutlineOffset || '';
                delete currentHighlight._origOutline;
                delete currentHighlight._origOutlineOffset;
            }

            inspectedElement._origOutline = inspectedElement.style.outline;
            inspectedElement._origOutlineOffset = inspectedElement.style.outlineOffset;
            inspectedElement.style.outline = '3px solid #ea4335';
            inspectedElement.style.outlineOffset = '2px';

            exitInspectionMode();
            showDiagnosticDialog(inspectedElement, HOST, SELECTORS_GLOBAL, SELECTORS_DOMAIN, EXCLUDE_GLOBAL, EXCLUDE_DOMAIN, EXCLUDE, storage, DOMAIN_SELECTORS, DOMAIN_EXCLUDES, openInfo);
        };

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                exitInspectionMode();
            }
        };

        document.body.addEventListener('mousemove', onMouseMove, true);
        document.addEventListener('click', onClick, true);
        document.addEventListener('keydown', onKeyDown);

        inspectionOverlay.onMouseMove = onMouseMove;
        inspectionOverlay.onClick = onClick;
        inspectionOverlay.onKeyDown = onKeyDown;
        inspectionOverlay.currentHighlight = () => currentHighlight;
    }

    /**
     * Exit inspection mode
     */
    function exitInspectionMode() {
        if (!inspectionOverlay) return;

        const { overlay, message, onMouseMove, onClick, onKeyDown, currentHighlight, originalCursor } = inspectionOverlay;

        const el = currentHighlight?.();
        if (el) {
            el.style.outline = el._origOutline || '';
            el.style.outlineOffset = el._origOutlineOffset || '';
            delete el._origOutline;
            delete el._origOutlineOffset;
        }

        document.body.style.cursor = originalCursor;

        document.body.removeEventListener('mousemove', onMouseMove, true);
        document.removeEventListener('click', onClick, true);
        document.removeEventListener('keydown', onKeyDown);

        overlay.remove();
        message.remove();

        inspectionOverlay = null;
    }

    /**
     * Diagnose element for article container detection
     */
    function diagnoseElement(el, SELECTORS_GLOBAL, SELECTORS_DOMAIN, EXCLUDE_GLOBAL, EXCLUDE_DOMAIN, EXCLUDE) {
        const text = textTrim(el);
        const selector = generateCSSSelector(el);

        const globalSelectors = findMatchingSelectors(el, SELECTORS_GLOBAL);
        const domainSelectors = findMatchingSelectors(el, SELECTORS_DOMAIN);
        const globalExclusions = findMatchingExclusions(el, EXCLUDE_GLOBAL);
        const domainExclusions = findMatchingExclusions(el, EXCLUDE_DOMAIN);

        // Check if element is excluded
        let isExcluded = false;
        if (EXCLUDE.self) {
            for (const sel of EXCLUDE.self) {
                try { if (el.matches(sel)) { isExcluded = true; break; } } catch {}
            }
        }
        if (!isExcluded && EXCLUDE.ancestors) {
            for (const sel of EXCLUDE.ancestors) {
                try { if (el.closest(sel)) { isExcluded = true; break; } } catch {}
            }
        }

        const isMatched = globalSelectors.length > 0 || domainSelectors.length > 0;
        const isProcessed = isMatched && !isExcluded;

        // Count text-containing children
        const textElements = el.querySelectorAll('p, li, blockquote, figcaption, dd, dt');
        const filteredTextElements = Array.from(textElements).filter(e => e.textContent.trim().length >= 40);

        return {
            element: el,
            selector,
            text: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
            fullTextLength: text.length,
            tag: el.tagName.toLowerCase(),
            classes: Array.from(el.classList).join(' '),
            id: el.id,
            globalSelectors,
            domainSelectors,
            globalExclusions,
            domainExclusions,
            isExcluded,
            isMatched,
            isProcessed,
            textElementCount: filteredTextElements.length
        };
    }

    /**
     * Show diagnostic dialog
     */
    function showDiagnosticDialog(el, HOST, SELECTORS_GLOBAL, SELECTORS_DOMAIN, EXCLUDE_GLOBAL, EXCLUDE_DOMAIN, EXCLUDE, storage, DOMAIN_SELECTORS, DOMAIN_EXCLUDES, openInfo) {
        const diag = diagnoseElement(el, SELECTORS_GLOBAL, SELECTORS_DOMAIN, EXCLUDE_GLOBAL, EXCLUDE_DOMAIN, EXCLUDE);

        const host = document.createElement('div');
        host.setAttribute(UI_ATTR, '');
        const shadow = host.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
        .wrap { position: fixed; inset: 0; z-index: 2147483647; background: rgba(0,0,0,.55);
                display: flex; align-items: center; justify-content: center; }
        .modal { background: #fff; max-width: 700px; width: 94%; max-height: 90vh;
                 overflow-y: auto; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,.4);
                 padding: 20px; box-sizing: border-box; }
        .modal h3 { margin: 0 0 16px; font: 700 18px/1.3 system-ui, sans-serif; color: #1a1a1a; }
        .section { margin: 16px 0; padding: 12px; background: #f8f9fa; border-radius: 8px; }
        .section-title { font: 600 14px system-ui, sans-serif; margin: 0 0 8px; color: #444; }
        .info-row { margin: 4px 0; font: 13px/1.5 ui-monospace, Consolas, monospace; color: #666; }
        .info-label { font-weight: 600; color: #333; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 6px; font: 600 13px system-ui, sans-serif;
                  margin: 8px 0; }
        .status.processed { background: #d4edda; color: #155724; }
        .status.not-processed { background: #f8d7da; color: #721c24; }
        .status.excluded { background: #fff3cd; color: #856404; }
        .list { margin: 8px 0; padding-left: 20px; }
        .list li { margin: 4px 0; font: 13px/1.5 system-ui, sans-serif; }
        .list li.match { color: #155724; }
        .list li.no-match { color: #666; }
        .list li.problem { color: #721c24; font-weight: 600; }
        .code { background: #f1f3f4; padding: 2px 6px; border-radius: 4px;
                font: 12px ui-monospace, Consolas, monospace; color: #333; }
        .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; }
        .btn { padding: 10px 16px; border-radius: 8px; border: none;
               font: 600 13px system-ui, sans-serif; cursor: pointer; transition: all 0.15s ease; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn.primary { background: #667eea; color: #fff; }
        .btn.primary:hover:not(:disabled) { background: #5568d3; }
        .btn.secondary { background: #e8eaed; color: #1a1a1a; }
        .btn.secondary:hover:not(:disabled) { background: #dadce0; }
        .btn.success { background: #34a853; color: #fff; }
        .btn.success:hover:not(:disabled) { background: #2d8e47; }
        .btn.danger { background: #ea4335; color: #fff; }
        .btn.danger:hover:not(:disabled) { background: #d33426; }
    `;

        const wrap = document.createElement('div');
        wrap.className = 'wrap';

        let statusClass, statusText;
        if (diag.isExcluded) {
            statusClass = 'excluded';
            statusText = 'EXCLUDED - Element or ancestor matches an exclusion pattern';
        } else if (diag.isProcessed) {
            statusClass = 'processed';
            statusText = 'MATCHED - This element matches article container selectors';
        } else {
            statusClass = 'not-processed';
            statusText = 'NOT MATCHED - No selectors match this element';
        }

        const globalSelectorsHTML = diag.globalSelectors.length > 0 ?
            `<ul class="list">${diag.globalSelectors.map(s => `<li class="match">✓ <span class="code">${escapeHtml(s)}</span></li>`).join('')}</ul>` :
            '<p class="info-row no-match">No global selectors match this element.</p>';

        const domainSelectorsHTML = diag.domainSelectors.length > 0 ?
            `<ul class="list">${diag.domainSelectors.map(s => `<li class="match">✓ <span class="code">${escapeHtml(s)}</span></li>`).join('')}</ul>` :
            '<p class="info-row no-match">No domain selectors configured or matched.</p>';

        const globalExclusionsHTML = (diag.globalExclusions.self.length > 0 || diag.globalExclusions.ancestors.length > 0) ?
            `<ul class="list">
            ${diag.globalExclusions.self.map(s => `<li class="problem">✗ Element matches: <span class="code">${escapeHtml(s)}</span></li>`).join('')}
            ${diag.globalExclusions.ancestors.map(s => `<li class="problem">✗ Ancestor matches: <span class="code">${escapeHtml(s)}</span></li>`).join('')}
        </ul>` :
            '<p class="info-row no-match">No global exclusions affect this element.</p>';

        const domainExclusionsHTML = (diag.domainExclusions.self?.length > 0 || diag.domainExclusions.ancestors?.length > 0) ?
            `<ul class="list">
            ${(diag.domainExclusions.self || []).map(s => `<li class="problem">✗ Element matches: <span class="code">${escapeHtml(s)}</span></li>`).join('')}
            ${(diag.domainExclusions.ancestors || []).map(s => `<li class="problem">✗ Ancestor matches: <span class="code">${escapeHtml(s)}</span></li>`).join('')}
        </ul>` :
            '<p class="info-row no-match">No domain exclusions configured or affect this element.</p>';

        wrap.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-label="Element Inspection">
            <h3>Element Inspection</h3>

            <div class="section">
                <div class="section-title">Element Information</div>
                <div class="info-row"><span class="info-label">Tag:</span> &lt;${diag.tag}&gt;</div>
                <div class="info-row"><span class="info-label">ID:</span> ${diag.id || '(none)'}</div>
                <div class="info-row"><span class="info-label">Classes:</span> ${diag.classes || '(none)'}</div>
                <div class="info-row"><span class="info-label">Text length:</span> ${diag.fullTextLength} characters</div>
                <div class="info-row"><span class="info-label">Text elements (p, li, etc.):</span> ${diag.textElementCount} with 40+ chars</div>
                <div class="info-row"><span class="info-label">CSS Selector:</span> <span class="code">${escapeHtml(diag.selector)}</span></div>
                <div class="info-row"><span class="info-label">Preview:</span> "${escapeHtml(diag.text)}"</div>
            </div>

            <div class="status ${statusClass}">${statusText}</div>

            <div class="section">
                <div class="section-title">Global Container Selectors</div>
                ${globalSelectorsHTML}
            </div>

            <div class="section">
                <div class="section-title">Domain Container Selectors (${HOST})</div>
                ${domainSelectorsHTML}
            </div>

            <div class="section">
                <div class="section-title">Global Exclusions</div>
                ${globalExclusionsHTML}
            </div>

            <div class="section">
                <div class="section-title">Domain Exclusions (${HOST})</div>
                ${domainExclusionsHTML}
            </div>

            <div class="actions">
                ${buildActionButtons(diag)}
                <button class="btn secondary copy-selector">Copy Selector</button>
                <button class="btn secondary close">Close</button>
            </div>
        </div>
    `;

        shadow.append(style, wrap);
        document.body.appendChild(host);

        const close = () => {
            if (inspectedElement) {
                inspectedElement.style.outline = inspectedElement._origOutline || '';
                inspectedElement.style.outlineOffset = inspectedElement._origOutlineOffset || '';
                delete inspectedElement._origOutline;
                delete inspectedElement._origOutlineOffset;
                inspectedElement = null;
            }
            host.remove();
        };

        shadow.querySelector('.close').addEventListener('click', close);
        wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
        shadow.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); close(); } });

        shadow.querySelector('.copy-selector').addEventListener('click', () => {
            navigator.clipboard.writeText(diag.selector).then(() => {
                const btn = shadow.querySelector('.copy-selector');
                const orig = btn.textContent;
                btn.textContent = '✓ Copied!';
                setTimeout(() => btn.textContent = orig, 2000);
            });
        });

        attachActionHandlers(shadow, diag, close, storage, DOMAIN_SELECTORS, DOMAIN_EXCLUDES, HOST, SELECTORS_GLOBAL, EXCLUDE_GLOBAL, openInfo);

        wrap.setAttribute('tabindex', '-1');
        wrap.focus();
    }

    /**
     * Build action buttons for diagnostic dialog
     */
    function buildActionButtons(diag, HOST) {
        const buttons = [];

        // Global Inclusions: Remove if matched, Add if not
        if (diag.globalSelectors.length > 0) {
            diag.globalSelectors.forEach(sel => {
                buttons.push(`<button class="btn secondary remove-global-sel" data-selector="${escapeHtml(sel)}">Remove Global Inclusion: ${escapeHtml(sel)}</button>`);
            });
        } else {
            buttons.push(`<button class="btn success add-global-sel">Add to Global Inclusions</button>`);
        }

        // Local Inclusions: Remove if matched, Add if not
        if (diag.domainSelectors.length > 0) {
            diag.domainSelectors.forEach(sel => {
                buttons.push(`<button class="btn secondary remove-domain-sel" data-selector="${escapeHtml(sel)}">Remove Local Inclusion: ${escapeHtml(sel)}</button>`);
            });
        } else {
            buttons.push(`<button class="btn success add-domain-sel">Add to Local Inclusions</button>`);
        }

        // Global Exclusions: Remove if matched, Add if not
        const hasGlobalExclusion = diag.globalExclusions.self.length > 0 || diag.globalExclusions.ancestors.length > 0;
        if (hasGlobalExclusion) {
            diag.globalExclusions.self.forEach(sel => {
                buttons.push(`<button class="btn secondary remove-global-excl-self" data-selector="${escapeHtml(sel)}">Remove Global Exclusion: ${escapeHtml(sel)}</button>`);
            });
            diag.globalExclusions.ancestors.forEach(sel => {
                buttons.push(`<button class="btn secondary remove-global-excl-anc" data-selector="${escapeHtml(sel)}">Remove Global Ancestor Exclusion: ${escapeHtml(sel)}</button>`);
            });
        } else {
            buttons.push(`<button class="btn danger add-global-excl">Add to Global Exclusions</button>`);
        }

        // Local Exclusions: Remove if matched, Add if not
        const hasLocalExclusion = (diag.domainExclusions.self?.length > 0) || (diag.domainExclusions.ancestors?.length > 0);
        if (hasLocalExclusion) {
            (diag.domainExclusions.self || []).forEach(sel => {
                buttons.push(`<button class="btn secondary remove-domain-excl-self" data-selector="${escapeHtml(sel)}">Remove Local Exclusion: ${escapeHtml(sel)}</button>`);
            });
            (diag.domainExclusions.ancestors || []).forEach(sel => {
                buttons.push(`<button class="btn secondary remove-domain-excl-anc" data-selector="${escapeHtml(sel)}">Remove Local Ancestor Exclusion: ${escapeHtml(sel)}</button>`);
            });
        } else {
            buttons.push(`<button class="btn danger add-domain-excl">Add to Local Exclusions</button>`);
        }

        return buttons.join('');
    }

    /**
     * Attach action handlers for diagnostic dialog
     */
    function attachActionHandlers(shadow, diag, closeDialog, storage, DOMAIN_SELECTORS, DOMAIN_EXCLUDES, HOST, SELECTORS_GLOBAL, EXCLUDE_GLOBAL, openInfo) {
        // Remove global inclusions
        shadow.querySelectorAll('.remove-global-sel').forEach(btn => {
            btn.addEventListener('click', async () => {
                const sel = btn.getAttribute('data-selector');
                const idx = SELECTORS_GLOBAL.indexOf(sel);
                if (idx > -1) SELECTORS_GLOBAL.splice(idx, 1);
                await storage.set(STORAGE_KEYS.SELECTORS_GLOBAL, JSON.stringify(SELECTORS_GLOBAL));
                openInfo(`Removed global inclusion: ${sel}\nReload the page to see changes.`);
                closeDialog();
            });
        });

        // Remove domain inclusions
        shadow.querySelectorAll('.remove-domain-sel').forEach(btn => {
            btn.addEventListener('click', async () => {
                const sel = btn.getAttribute('data-selector');
                if (DOMAIN_SELECTORS[HOST]) {
                    const idx = DOMAIN_SELECTORS[HOST].indexOf(sel);
                    if (idx > -1) DOMAIN_SELECTORS[HOST].splice(idx, 1);
                    await storage.set(STORAGE_KEYS.DOMAIN_SELECTORS, JSON.stringify(DOMAIN_SELECTORS));
                }
                openInfo(`Removed local inclusion: ${sel}\nReload the page to see changes.`);
                closeDialog();
            });
        });

        // Remove global exclusions
        shadow.querySelectorAll('.remove-global-excl-self').forEach(btn => {
            btn.addEventListener('click', async () => {
                const sel = btn.getAttribute('data-selector');
                EXCLUDE_GLOBAL.self = (EXCLUDE_GLOBAL.self || []).filter(s => s !== sel);
                await storage.set(STORAGE_KEYS.EXCLUDES_GLOBAL, JSON.stringify(EXCLUDE_GLOBAL));
                openInfo(`Removed global exclusion: ${sel}\nReload the page to see changes.`);
                closeDialog();
            });
        });

        shadow.querySelectorAll('.remove-global-excl-anc').forEach(btn => {
            btn.addEventListener('click', async () => {
                const sel = btn.getAttribute('data-selector');
                EXCLUDE_GLOBAL.ancestors = (EXCLUDE_GLOBAL.ancestors || []).filter(s => s !== sel);
                await storage.set(STORAGE_KEYS.EXCLUDES_GLOBAL, JSON.stringify(EXCLUDE_GLOBAL));
                openInfo(`Removed global ancestor exclusion: ${sel}\nReload the page to see changes.`);
                closeDialog();
            });
        });

        shadow.querySelectorAll('.remove-domain-excl-self').forEach(btn => {
            btn.addEventListener('click', async () => {
                const sel = btn.getAttribute('data-selector');
                if (DOMAIN_EXCLUDES[HOST]) {
                    DOMAIN_EXCLUDES[HOST].self = (DOMAIN_EXCLUDES[HOST].self || []).filter(s => s !== sel);
                    await storage.set(STORAGE_KEYS.DOMAIN_EXCLUDES, JSON.stringify(DOMAIN_EXCLUDES));
                }
                openInfo(`Removed local exclusion: ${sel}\nReload the page to see changes.`);
                closeDialog();
            });
        });

        shadow.querySelectorAll('.remove-domain-excl-anc').forEach(btn => {
            btn.addEventListener('click', async () => {
                const sel = btn.getAttribute('data-selector');
                if (DOMAIN_EXCLUDES[HOST]) {
                    DOMAIN_EXCLUDES[HOST].ancestors = (DOMAIN_EXCLUDES[HOST].ancestors || []).filter(s => s !== sel);
                    await storage.set(STORAGE_KEYS.DOMAIN_EXCLUDES, JSON.stringify(DOMAIN_EXCLUDES));
                }
                openInfo(`Removed local ancestor exclusion: ${sel}\nReload the page to see changes.`);
                closeDialog();
            });
        });

        // Add as global selector
        shadow.querySelectorAll('.add-global-sel').forEach(btn => {
            btn.addEventListener('click', async () => {
                SELECTORS_GLOBAL.push(diag.selector);
                await storage.set(STORAGE_KEYS.SELECTORS_GLOBAL, JSON.stringify(SELECTORS_GLOBAL));
                openInfo(`Added global inclusion: ${diag.selector}\nReload the page to see changes.`);
                closeDialog();
            });
        });

        // Add as domain selector
        shadow.querySelectorAll('.add-domain-sel').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!DOMAIN_SELECTORS[HOST]) DOMAIN_SELECTORS[HOST] = [];
                DOMAIN_SELECTORS[HOST].push(diag.selector);
                await storage.set(STORAGE_KEYS.DOMAIN_SELECTORS, JSON.stringify(DOMAIN_SELECTORS));
                openInfo(`Added local inclusion: ${diag.selector}\nReload the page to see changes.`);
                closeDialog();
            });
        });

        // Add to global exclusions
        shadow.querySelectorAll('.add-global-excl').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!EXCLUDE_GLOBAL.self) EXCLUDE_GLOBAL.self = [];
                EXCLUDE_GLOBAL.self.push(diag.selector);
                await storage.set(STORAGE_KEYS.EXCLUDES_GLOBAL, JSON.stringify(EXCLUDE_GLOBAL));
                openInfo(`Added to global exclusions: ${diag.selector}\nReload the page to see changes.`);
                closeDialog();
            });
        });

        // Add to domain exclusions
        shadow.querySelectorAll('.add-domain-excl').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!DOMAIN_EXCLUDES[HOST]) DOMAIN_EXCLUDES[HOST] = { self: [], ancestors: [] };
                if (!DOMAIN_EXCLUDES[HOST].self) DOMAIN_EXCLUDES[HOST].self = [];
                DOMAIN_EXCLUDES[HOST].self.push(diag.selector);
                await storage.set(STORAGE_KEYS.DOMAIN_EXCLUDES, JSON.stringify(DOMAIN_EXCLUDES));
                openInfo(`Added local exclusion: ${diag.selector}\nReload the page to see changes.`);
                closeDialog();
            });
        });
    }

    /**
     * Article extraction logic for Summarize The Web
     */


    /**
     * Get selected text from the page
     * @param {number} minLength - Minimum text length required
     * @returns {Object|null} - { text } or { error, actualLength } or null if no selection
     */
    function getSelectedText(minLength = 100) {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (!text) {
            return null;
        }
        if (text.length < minLength) {
            return { error: 'selection_too_short', actualLength: text.length, minLength };
        }
        return { text };
    }

    /**
     * Clean container text by removing UI and excluded elements
     * @param {Element} container - Container element
     * @param {Object} EXCLUDE - Exclusion rules
     * @returns {string} - Cleaned text
     */
    function cleanContainerText(container, EXCLUDE) {
        const clone = container.cloneNode(true);

        // Remove UI elements
        clone.querySelectorAll(`[${UI_ATTR}]`).forEach(el => el.remove());

        // Remove excluded elements (self)
        if (EXCLUDE.self) {
            for (const sel of EXCLUDE.self) {
                try {
                    clone.querySelectorAll(sel).forEach(el => el.remove());
                } catch {}
            }
        }

        // Remove excluded containers (ancestors)
        if (EXCLUDE.ancestors) {
            for (const sel of EXCLUDE.ancestors) {
                try {
                    clone.querySelectorAll(sel).forEach(el => el.remove());
                } catch {}
            }
        }

        return (clone.innerText ?? clone.textContent ?? '').trim();
    }

    /**
     * Extract article body using configured selectors
     * @param {string[]} SELECTORS - CSS selectors to find container
     * @param {Object} EXCLUDE - Exclusion rules
     * @param {number} minLength - Minimum text length required
     * @returns {Object|null} - { text, container, title } or { error, ... } or null
     */
    function extractArticleBody(SELECTORS, EXCLUDE, minLength = 100) {
        let container = null;

        // Get total page text for comparison
        const bodyText = (document.body.innerText ?? document.body.textContent ?? '').trim();
        const bodyLength = bodyText.length || 1; // Avoid division by zero

        // Collect all matching candidates with their text stats
        const candidates = [];
        for (const selector of SELECTORS) {
            try {
                const candidate = document.querySelector(selector);
                if (!candidate) continue;

                const rawText = (candidate.innerText ?? candidate.textContent ?? '').trim();
                const percent = Math.round((rawText.length / bodyLength) * 100);

                candidates.push({ candidate, selector, text: rawText, length: rawText.length, percent });
            } catch (e) {
                // Invalid selector, skip
            }
        }

        if (candidates.length === 0) {
            log('No article container found');
            return { error: 'no_container' };
        }

        // Sort by text length descending
        candidates.sort((a, b) => b.length - a.length);

        // Log top candidates for debugging
        const topCandidates = candidates.slice(0, 5).filter(c => c.length > 0);
        if (topCandidates.length > 1) {
            log('Container candidates:', topCandidates.map(c => `${c.selector} (${c.percent}%)`).join(', '));
        }

        const best = candidates[0];

        // Check if one container is dominant (>70% of page, and next best is <50% of best)
        const dominated = best.percent > 70 && (candidates.length < 2 || candidates[1].percent < best.percent * 0.5);

        if (dominated) {
            container = best.candidate;
            log('Selected container:', best.selector, '(dominant, ' + best.percent + '% of page)');
        } else {
            // Multiple significant containers - combine non-nested ones
            const significant = candidates.filter(c => c.percent >= 15 && c.length > minLength);

            // Filter out nested containers (keep only if not ancestor/descendant of another)
            const nonNested = significant.filter((c, i) =>
                !significant.some((other, j) => i !== j &&
                    (other.candidate.contains(c.candidate) || c.candidate.contains(other.candidate))
                )
            );

            if (nonNested.length > 1) {
                // Combine cleaned text from multiple containers
                const combinedTexts = nonNested.map(c => cleanContainerText(c.candidate, EXCLUDE));
                const combinedText = combinedTexts.join('\n\n');
                log('Combined', nonNested.length, 'containers:', nonNested.map(c => c.selector).join(', '));

                if (combinedText.length < minLength) {
                    log(`Combined text too short: ${combinedText.length} < ${minLength}`);
                    return { error: 'article_too_short', actualLength: combinedText.length, minLength };
                }

                log(`Extracted ${combinedText.length} characters from combined containers`);
                return { text: combinedText, elements: null, container: nonNested[0].candidate, title: null };
            }

            container = best.candidate;
            log('Selected container:', best.selector, 'with', best.length, 'chars', `(${best.percent}% of page)`);
        }

        if (!container) {
            log('No article container found');
            return { error: 'no_container' };
        }

        // Try to find article title
        let title = null;
        const titleSelectors = [
            '[itemprop="headline"]',
            'h1',
            'h2',
            '.article-title',
            '.post-title',
            '.entry-title',
            '[class*="article-title"]',
            '[class*="post-title"]'
        ];

        for (const selector of titleSelectors) {
            const el = container.querySelector(selector);
            if (el && el.textContent.trim().length > 10 && el.textContent.trim().length < 300) {
                title = el;
                break;
            }
        }

        // Get cleaned text from container
        const text = cleanContainerText(container, EXCLUDE);

        if (!text) {
            log('No text found in container');
            return { error: 'no_text' };
        }

        if (text.length < minLength) {
            log(`Text too short: ${text.length} < ${minLength}`);
            return { error: 'article_too_short', actualLength: text.length, minLength };
        }

        log(`Extracted ${text.length} characters from container`);

        return {
            text: text,
            elements: null,
            container: container,
            title: title
        };
    }

    /**
     * Get text to digest (selection or article body)
     * @param {string[]} SELECTORS - CSS selectors to find container
     * @param {Object} EXCLUDE - Exclusion rules
     * @param {number} minLength - Minimum text length required
     * @returns {Object} - { text, source, ... } or { error, ... }
     */
    function getTextToDigest(SELECTORS, EXCLUDE, minLength = 100) {
        // First check if user has selected text
        const selected = getSelectedText(minLength);
        if (selected) {
            if (selected.error) {
                return { error: selected.error, actualLength: selected.actualLength, minLength, source: 'selection' };
            }
            return { text: selected.text, elements: null, source: 'selection' };
        }

        // Otherwise extract article body
        const article = extractArticleBody(SELECTORS, EXCLUDE, minLength);
        if (article.error) {
            return { error: article.error, actualLength: article.actualLength, minLength, source: 'article' };
        }

        return { text: article.text, elements: article.elements, source: 'article', container: article.container };
    }

    /**
     * UI overlay components for Summarize The Web
     */


    let overlay = null;
    let summaryOverlay = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let autoCollapsedOverlay = false;
    let autoCollapsedState = null;

    const BADGE_WIDTH = 150;

    /** Viewport width excluding scrollbar */
    function viewportWidth() {
        return document.documentElement.clientWidth;
    }

    /**
     * Ensure CSS is loaded
     */
    function ensureCSS() {
        if (document.getElementById('digest-style')) return;
        const style = document.createElement('style');
        style.id = 'digest-style';
        style.textContent = `
        .digest-overlay {
            position: fixed !important;
            z-index: 2147483646 !important;
            font: 13px/1.4 system-ui, sans-serif !important;
            color: #1a1a1a !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: 2px solid #5568d3 !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,.3) !important;
            display: flex !important;
            flex-direction: column !important;
            box-sizing: border-box !important;
            width: 150px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            user-select: none !important;
        }
        .digest-overlay.collapsed {
            right: -150px !important;
            border-right: none !important;
            border-radius: 12px 0 0 12px !important;
            box-shadow: none !important;
        }
        .digest-overlay.dragging {
            transition: none !important;
            cursor: grabbing !important;
        }
        .digest-slide-handle {
            position: absolute !important;
            left: -28px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 28px !important;
            height: 56px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: 2px solid #5568d3 !important;
            border-right: none !important;
            border-radius: 8px 0 0 8px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 14px !important;
            color: #fff !important;
            box-shadow: -3px 0 12px rgba(0,0,0,.2) !important;
            transition: all 0.2s ease !important;
        }
        .digest-slide-handle:hover {
            left: -30px !important;
            box-shadow: -4px 0 16px rgba(0,0,0,.3) !important;
        }
        .digest-handle {
            background: rgba(255,255,255,0.2) !important;
            padding: 10px 12px !important;
            cursor: grab !important;
            border-radius: 10px 10px 0 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-bottom: 1px solid rgba(255,255,255,0.3) !important;
        }
        .digest-handle:active {
            cursor: grabbing !important;
        }
        .digest-title {
            font-weight: 600 !important;
            font-size: 14px !important;
            color: #fff !important;
            margin: 0 !important;
            text-align: center !important;
        }
        .digest-content {
            padding: 12px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            background: rgba(255,255,255,0.95) !important;
            border-radius: 0 0 0 10px !important;
        }
        .digest-section {
            margin: 0 !important;
            padding: 0 !important;
        }
        .digest-section-title {
            font-size: 11px !important;
            font-weight: 600 !important;
            color: #667eea !important;
            margin: 0 0 6px 0 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
        }
        .digest-buttons {
            display: flex !important;
            gap: 6px !important;
            flex-wrap: wrap !important;
        }
        .digest-btn {
            flex: 1 !important;
            min-width: 0 !important;
            padding: 8px 4px !important;
            border: 1px solid #667eea !important;
            background: #fff !important;
            color: #667eea !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            transition: all 0.2s !important;
            white-space: nowrap !important;
        }
        .digest-btn:hover {
            background: #667eea !important;
            color: #fff !important;
        }
        .digest-btn:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
        }
        .digest-btn.active {
            background: #667eea !important;
            color: #fff !important;
            font-weight: 600 !important;
        }
        .digest-btn.inspect-btn {
            background: #f0f0f0 !important;
            border-color: #999 !important;
            color: #666 !important;
            font-size: 11px !important;
            padding: 6px 4px !important;
        }
        .digest-btn.inspect-btn:hover {
            background: #999 !important;
            color: #fff !important;
        }
        .digest-status {
            font-size: 10px !important;
            color: #666 !important;
            text-align: center !important;
            padding: 4px !important;
            margin: 0 !important;
        }
        .digest-branding {
            font-size: 8px !important;
            color: rgba(255,255,255,0.6) !important;
            text-align: center !important;
            padding: 2px 0 0 0 !important;
            margin: 0 !important;
            letter-spacing: 0.3px !important;
        }

        /* Summary Overlay Styles */
        .digest-summary-overlay {
            position: fixed !important;
            top: 12px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 2147483645 !important;
            background: linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%) !important;
            border: 3px solid #667eea !important;
            border-radius: 16px !important;
            width: 96% !important;
            max-width: 1200px !important;
            max-height: 90vh !important;
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.35), 0 0 0 9999px rgba(0, 0, 0, 0.4) !important;
            animation: digest-summary-fadein 0.3s ease !important;
        }

        @keyframes digest-summary-fadein {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }

        .digest-summary-container {
            padding: 0 !important;
            box-sizing: border-box !important;
        }

        .digest-summary-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            padding: 16px 20px !important;
            border-radius: 13px 13px 0 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
        }

        .digest-summary-badge {
            font: 600 16px/1.2 system-ui, sans-serif !important;
            color: #fff !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .digest-summary-close {
            background: rgba(255, 255, 255, 0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: #fff !important;
            font-size: 20px !important;
            font-weight: 600 !important;
            width: 32px !important;
            height: 32px !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s !important;
            padding: 0 !important;
            line-height: 1 !important;
        }

        .digest-summary-close:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: scale(1.05) !important;
        }

        .digest-summary-content {
            padding: 20px 24px !important;
            font: 16px/1.7 system-ui, -apple-system, sans-serif !important;
            color: #2d3748 !important;
            max-height: calc(90vh - 180px) !important;
            overflow-y: auto !important;
        }

        .digest-summary-content p {
            margin: 0 0 16px 0 !important;
            text-align: left !important;
        }

        .digest-summary-content p:last-child {
            margin-bottom: 0 !important;
        }

        .digest-summary-footer {
            padding: 16px 20px !important;
            background: rgba(102, 126, 234, 0.05) !important;
            border-top: 1px solid rgba(102, 126, 234, 0.15) !important;
            border-radius: 0 0 13px 13px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .digest-summary-footer-text {
            font: 400 11px/1.2 system-ui, sans-serif !important;
            color: #999 !important;
            letter-spacing: 0.3px !important;
        }

        .digest-summary-restore,
        .digest-summary-close-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: #fff !important;
            border: none !important;
            padding: 12px 32px !important;
            border-radius: 8px !important;
            font: 600 14px/1.2 system-ui, sans-serif !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
        }

        .digest-summary-restore:hover,
        .digest-summary-close-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4) !important;
        }
    `;
        document.head.appendChild(style);
    }

    /**
     * Create the main overlay
     */
    function createOverlay(OVERLAY_COLLAPSED, OVERLAY_POS, storage, onDigest, onInspect) {
        if (overlay && overlay.isConnected) return overlay;

        ensureCSS();

        overlay = document.createElement('div');
        overlay.className = OVERLAY_COLLAPSED.value ? 'digest-overlay collapsed' : 'digest-overlay';
        overlay.setAttribute(UI_ATTR, '');

        // Set initial position
        const maxX = viewportWidth() - BADGE_WIDTH;
        const maxY = window.innerHeight - 200;
        OVERLAY_POS.x = Math.max(0, Math.min(OVERLAY_POS.x, maxX));
        OVERLAY_POS.y = Math.max(0, Math.min(OVERLAY_POS.y, maxY));

        overlay.style.top = `${OVERLAY_POS.y}px`;

        if (!OVERLAY_COLLAPSED.value) {
            overlay.style.left = `${OVERLAY_POS.x}px`;
        }

        overlay.innerHTML = `
        <div class="digest-slide-handle" title="${OVERLAY_COLLAPSED.value ? 'Open' : 'Close'}">
            ${OVERLAY_COLLAPSED.value ? '◀' : '▶'}
        </div>
        <div class="digest-handle">
            <div class="digest-title">Summarize</div>
            <div class="digest-branding">The Web</div>
        </div>
        <div class="digest-content">
            <div class="digest-buttons">
                <button class="digest-btn" data-size="large">Large</button>
                <button class="digest-btn" data-size="small">Small</button>
            </div>
            <button class="digest-btn inspect-btn">Inspect</button>
            <div class="digest-status">Ready</div>
        </div>
    `;

        document.body.appendChild(overlay);

        // Attach event listeners
        const slideHandle = overlay.querySelector('.digest-slide-handle');
        const dragHandle = overlay.querySelector('.digest-handle');
        const digestBtns = overlay.querySelectorAll('.digest-btn[data-size]');
        const inspectBtn = overlay.querySelector('.inspect-btn');

        slideHandle.addEventListener('click', (e) => toggleSlide(e, OVERLAY_COLLAPSED, OVERLAY_POS, storage));
        dragHandle.addEventListener('mousedown', (e) => startDrag(e, OVERLAY_COLLAPSED, OVERLAY_POS, storage));
        dragHandle.addEventListener('touchstart', (e) => startDrag(e, OVERLAY_COLLAPSED, OVERLAY_POS, storage));

        digestBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const size = btn.dataset.size;
                onDigest(size);
            });
        });

        inspectBtn.addEventListener('click', onInspect);

        return overlay;
    }

    /**
     * Toggle overlay slide state
     */
    async function toggleSlide(e, OVERLAY_COLLAPSED, OVERLAY_POS, storage) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        OVERLAY_COLLAPSED.value = !OVERLAY_COLLAPSED.value;
        await storage.set(STORAGE_KEYS.OVERLAY_COLLAPSED, String(OVERLAY_COLLAPSED.value));

        if (OVERLAY_COLLAPSED.value) {
            overlay.classList.add('collapsed');
            overlay.style.left = '';
            overlay.style.right = '';
            overlay.style.transform = '';
        } else {
            overlay.classList.remove('collapsed');
            const currentY = parseInt(overlay.style.top) || OVERLAY_POS.y;
            const rightEdgeX = viewportWidth() - BADGE_WIDTH;

            overlay.style.right = '';
            overlay.style.transform = '';
            overlay.style.left = `${rightEdgeX}px`;
            overlay.style.top = `${currentY}px`;

            OVERLAY_POS.x = rightEdgeX;
            OVERLAY_POS.y = currentY;
            storage.set(STORAGE_KEYS.OVERLAY_POS, JSON.stringify(OVERLAY_POS));
        }

        const handle = overlay.querySelector('.digest-slide-handle');
        if (handle) {
            handle.textContent = OVERLAY_COLLAPSED.value ? '◀' : '▶';
            handle.title = OVERLAY_COLLAPSED.value ? 'Open' : 'Close';
        }
    }

    /**
     * Start dragging the overlay
     */
    function startDrag(e, OVERLAY_COLLAPSED, OVERLAY_POS, storage) {
        if (OVERLAY_COLLAPSED.value) return;

        isDragging = true;
        overlay.classList.add('dragging');

        const rect = overlay.getBoundingClientRect();
        const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
        const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
        dragOffset.x = clientX - rect.left;
        dragOffset.y = clientY - rect.top;

        const onDrag = (e) => {
            if (!isDragging) return;

            const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
            const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;

            let newX = clientX - dragOffset.x;
            let newY = clientY - dragOffset.y;

            const maxX = viewportWidth() - overlay.offsetWidth;
            const maxY = window.innerHeight - overlay.offsetHeight;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            overlay.style.left = `${newX}px`;
            overlay.style.top = `${newY}px`;

            OVERLAY_POS.x = newX;
            OVERLAY_POS.y = newY;

            e.preventDefault();
        };

        const stopDrag = () => {
            if (!isDragging) return;

            isDragging = false;
            overlay.classList.remove('dragging');

            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('touchend', stopDrag);

            storage.set(STORAGE_KEYS.OVERLAY_POS, JSON.stringify(OVERLAY_POS));
        };

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);

        e.preventDefault();
    }

    /**
     * Update overlay status text
     */
    function updateOverlayStatus(status, mode = null, fromCache = false) {
        if (!overlay) return;

        const statusEl = overlay.querySelector('.digest-status');
        const digestBtns = overlay.querySelectorAll('.digest-btn[data-size]');

        digestBtns.forEach(btn => btn.classList.remove('active'));

        if (status === 'ready') {
            statusEl.textContent = 'Ready';
            digestBtns.forEach(btn => btn.disabled = false);
        } else if (status === 'processing') {
            const size = mode ? mode.split('_')[1] : '';
            const sizeLabel = size === 'large' ? 'Large' : 'Small';
            statusEl.textContent = fromCache ? `Applying ${sizeLabel}...` : `Processing ${sizeLabel}...`;
            digestBtns.forEach(btn => btn.disabled = true);
        } else if (status === 'digested') {
            const size = mode ? mode.split('_')[1] : '';
            const sizeLabel = size === 'large' ? 'Large' : 'Small';
            statusEl.textContent = `${sizeLabel} summary applied`;
            digestBtns.forEach(btn => btn.disabled = false);

            const activeBtn = overlay.querySelector(`[data-size="${size}"]`);
            if (activeBtn) activeBtn.classList.add('active');
        }
    }

    /**
     * Show summary overlay
     */
    function showSummaryOverlay(summaryText, mode, container, OVERLAY_COLLAPSED, onRestore) {
        removeSummaryOverlay();

        // Auto-collapse actions overlay on mobile to prevent overlap
        if (overlay && !OVERLAY_COLLAPSED.value) {
            autoCollapsedOverlay = true;
            autoCollapsedState = OVERLAY_COLLAPSED;
            collapseOverlay(OVERLAY_COLLAPSED);
        }

        summaryOverlay = document.createElement('div');
        summaryOverlay.className = 'digest-summary-overlay';
        summaryOverlay.setAttribute(UI_ATTR, '');

        const sizeLabel = mode.includes('large') ? 'Large' : 'Small';
        const isSelectedText = !container;

        summaryOverlay.innerHTML = `
        <div class="digest-summary-container">
            <div class="digest-summary-header">
                <div class="digest-summary-badge">${escapeHtml(sizeLabel)} Summary${isSelectedText ? ' (Selected Text)' : ''}</div>
                <button class="digest-summary-close" title="Close">✕</button>
            </div>
            <div class="digest-summary-content">
                ${summaryText.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')}
            </div>
            <div class="digest-summary-footer">
                <div class="digest-summary-footer-text">Summarize The Web</div>
                <button class="digest-summary-close-btn">Close</button>
            </div>
        </div>
    `;

        document.body.appendChild(summaryOverlay);

        const closeBtn = summaryOverlay.querySelector('.digest-summary-close');
        const closeBtnFooter = summaryOverlay.querySelector('.digest-summary-close-btn');

        const closeHandler = () => {
            removeSummaryOverlay();
            if (!isSelectedText) onRestore();
        };

        if (isSelectedText) {
            closeBtn.addEventListener('click', removeSummaryOverlay);
            closeBtnFooter.addEventListener('click', removeSummaryOverlay);
        } else {
            closeBtn.addEventListener('click', closeHandler);
            closeBtnFooter.addEventListener('click', closeHandler);
        }

        summaryOverlay.addEventListener('click', (e) => {
            if (e.target === summaryOverlay) {
                if (isSelectedText) {
                    removeSummaryOverlay();
                } else {
                    closeHandler();
                }
            }
        });

        const escHandler = (e) => {
            if (e.key === 'Escape') {
                if (isSelectedText) {
                    removeSummaryOverlay();
                } else {
                    closeHandler();
                }
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    /**
     * Remove summary overlay
     */
    function removeSummaryOverlay() {
        if (summaryOverlay && summaryOverlay.isConnected) {
            summaryOverlay.remove();
        }
        summaryOverlay = null;

        if (autoCollapsedOverlay) {
            autoCollapsedOverlay = false;
            expandOverlay();
        }
    }

    /**
     * Collapse overlay (temporary)
     */
    function collapseOverlay(OVERLAY_COLLAPSED) {
        if (!overlay || OVERLAY_COLLAPSED.value) return;
        OVERLAY_COLLAPSED.value = true;
        overlay.classList.add('collapsed');
        overlay.style.left = '';
        overlay.style.right = '';
        overlay.style.transform = '';
        const handle = overlay.querySelector('.digest-slide-handle');
        if (handle) {
            handle.textContent = '◀';
            handle.title = 'Open';
        }
    }

    /**
     * Expand overlay (restore after auto-collapse)
     */
    function expandOverlay() {
        if (!overlay) return;
        if (autoCollapsedState) {
            autoCollapsedState.value = false;
            autoCollapsedState = null;
        }
        overlay.classList.remove('collapsed');
        const rightEdgeX = viewportWidth() - BADGE_WIDTH;
        overlay.style.right = '';
        overlay.style.transform = '';
        overlay.style.left = `${rightEdgeX}px`;
        const handle = overlay.querySelector('.digest-slide-handle');
        if (handle) {
            handle.textContent = '▶';
            handle.title = 'Close';
        }
    }

    /**
     * Ensure overlay exists (recreate if removed)
     */
    function ensureOverlay(OVERLAY_COLLAPSED, OVERLAY_POS, storage, onDigest, onInspect) {
        if (!overlay || !overlay.isConnected) {
            createOverlay(OVERLAY_COLLAPSED, OVERLAY_POS, storage, onDigest, onInspect);
        }
    }

    (async () => {

        // Only run in top-level window, not in iframes
        if (window.self !== window.top) {
            return;
        }

        const HOST = location.hostname;
        const storage = new Storage();

        // Prevent multiple API key dialogs
        let apiKeyDialogShown = { value: false };

        // Initialize API tracking
        await initApiTracking(storage);

        // Load toggles
        try { const v = await storage.get(STORAGE_KEYS.DEBUG, ''); if (v !== '') CFG.DEBUG = (v === true || v === 'true'); } catch {}

        // Domain mode + lists
        let DOMAINS_MODE = 'allow';
        let DOMAIN_DENY = [];
        let DOMAIN_ALLOW = [];

        // Load persisted data
        let SELECTORS_GLOBAL = [...DEFAULT_SELECTORS];
        let EXCLUDE_GLOBAL = { ...DEFAULT_EXCLUDES, ancestors: [...DEFAULT_EXCLUDES.ancestors] };
        let DOMAIN_SELECTORS = {};
        let DOMAIN_EXCLUDES = {};

        try { SELECTORS_GLOBAL = JSON.parse(await storage.get(STORAGE_KEYS.SELECTORS_GLOBAL, JSON.stringify(DEFAULT_SELECTORS))); } catch {}
        try { EXCLUDE_GLOBAL = JSON.parse(await storage.get(STORAGE_KEYS.EXCLUDES_GLOBAL, JSON.stringify(DEFAULT_EXCLUDES))); } catch {}
        try { DOMAIN_SELECTORS = JSON.parse(await storage.get(STORAGE_KEYS.DOMAIN_SELECTORS, '{}')); } catch {}
        try { DOMAIN_EXCLUDES = JSON.parse(await storage.get(STORAGE_KEYS.DOMAIN_EXCLUDES, '{}')); } catch {}

        // Load domain-specific settings for current host
        let SELECTORS_DOMAIN = DOMAIN_SELECTORS[HOST] || [];
        let EXCLUDE_DOMAIN = DOMAIN_EXCLUDES[HOST] || { self: [], ancestors: [] };

        // Merge global + domain-specific
        let SELECTORS = [...new Set([...SELECTORS_GLOBAL, ...SELECTORS_DOMAIN])];
        let EXCLUDE = {
            self: [...new Set([...(EXCLUDE_GLOBAL.self || []), ...(EXCLUDE_DOMAIN.self || [])])],
            ancestors: [...new Set([...(EXCLUDE_GLOBAL.ancestors || []), ...(EXCLUDE_DOMAIN.ancestors || [])])]
        };

        if (SELECTORS_DOMAIN.length > 0 || (EXCLUDE_DOMAIN.self && EXCLUDE_DOMAIN.self.length > 0) || (EXCLUDE_DOMAIN.ancestors && EXCLUDE_DOMAIN.ancestors.length > 0)) {
            log('domain-specific additions for', HOST, ':', { selectors: SELECTORS_DOMAIN, excludes: EXCLUDE_DOMAIN });
        }

        try { DOMAINS_MODE = await storage.get(STORAGE_KEYS.DOMAINS_MODE, 'allow'); } catch {}
        try { DOMAIN_DENY = JSON.parse(await storage.get(STORAGE_KEYS.DOMAINS_DENY, '[]')); } catch {}
        try { DOMAIN_ALLOW = JSON.parse(await storage.get(STORAGE_KEYS.DOMAINS_ALLOW, '[]')); } catch {}

        // Load prompts
        let CUSTOM_PROMPTS = { ...DEFAULT_PROMPTS };
        try { const v = await storage.get(STORAGE_KEYS.CUSTOM_PROMPT, ''); if (v) CUSTOM_PROMPTS = JSON.parse(v); } catch {}

        // Load simplification style
        let SIMPLIFICATION_LEVEL = 'Balanced';
        try {
            const v = await storage.get(STORAGE_KEYS.SIMPLIFICATION_STRENGTH, '');
            log('Loaded simplification style from storage:', v, 'valid:', SIMPLIFICATION_LEVELS.includes(v));
            if (v && SIMPLIFICATION_LEVELS.includes(v)) {
                SIMPLIFICATION_LEVEL = v;
            }
        } catch {}
        log('Using simplification level:', SIMPLIFICATION_LEVEL);

        // Overlay state
        let OVERLAY_COLLAPSED = { value: false };
        try { const v = await storage.get(STORAGE_KEYS.OVERLAY_COLLAPSED, ''); if (v !== '') OVERLAY_COLLAPSED.value = (v === true || v === 'true'); } catch {}

        let OVERLAY_POS = { x: document.documentElement.clientWidth - BADGE_WIDTH, y: window.innerHeight * 0.7 };
        try { const v = await storage.get(STORAGE_KEYS.OVERLAY_POS, ''); if (v) OVERLAY_POS = JSON.parse(v); } catch {}

        // Auto-simplify setting
        let AUTO_SIMPLIFY = false;
        try { const v = await storage.get(STORAGE_KEYS.AUTO_SIMPLIFY, ''); if (v !== '') AUTO_SIMPLIFY = (v === true || v === 'true'); } catch {}

        // Minimum text length for extraction
        let MIN_TEXT_LENGTH = DEFAULT_MIN_TEXT_LENGTH;
        try {
            const v = await storage.get(STORAGE_KEYS.MIN_TEXT_LENGTH, '');
            if (v !== '') {
                const parsed = parseInt(v, 10);
                if (!isNaN(parsed) && parsed >= 0) MIN_TEXT_LENGTH = parsed;
            }
        } catch {}

        // Initialize cache
        const cache = new DigestCache(storage);
        await cache.init();

        // Domain matching
        function computeDomainDisabled(host) {
            if (DOMAINS_MODE === 'allow') return !listMatchesHost(DOMAIN_ALLOW, host);
            return listMatchesHost(DOMAIN_DENY, host);
        }

        let DOMAIN_DISABLED = computeDomainDisabled(HOST);
        log('domain check:', HOST, 'mode=', DOMAINS_MODE, 'disabled=', DOMAIN_DISABLED);

        // Register Domain Controls menu BEFORE early return so users can enable disabled domains
        GM_registerMenuCommand?.('--- Domain Controls ---', () => {});

        GM_registerMenuCommand?.(
            DOMAINS_MODE === 'allow' ? 'Domain mode: Allowlist only' : 'Domain mode: All domains with Denylist',
            async () => {
                DOMAINS_MODE = (DOMAINS_MODE === 'allow') ? 'deny' : 'allow';
                await storage.set(STORAGE_KEYS.DOMAINS_MODE, DOMAINS_MODE);
                location.reload();
            }
        );

        GM_registerMenuCommand?.(
            computeDomainDisabled(HOST) ? `Current page: DISABLED (click to enable)` : `Current page: ENABLED (click to disable)`,
            async () => {
                if (DOMAINS_MODE === 'allow') {
                    if (listMatchesHost(DOMAIN_ALLOW, HOST)) {
                        DOMAIN_ALLOW = DOMAIN_ALLOW.filter(p => !domainPatternToRegex(p)?.test(HOST));
                    } else {
                        DOMAIN_ALLOW.push(HOST);
                    }
                    await storage.set(STORAGE_KEYS.DOMAINS_ALLOW, JSON.stringify(DOMAIN_ALLOW));
                } else {
                    if (computeDomainDisabled(HOST)) {
                        DOMAIN_DENY = DOMAIN_DENY.filter(p => !domainPatternToRegex(p)?.test(HOST));
                    } else {
                        if (!DOMAIN_DENY.includes(HOST)) DOMAIN_DENY.push(HOST);
                    }
                    await storage.set(STORAGE_KEYS.DOMAINS_DENY, JSON.stringify(DOMAIN_DENY));
                }
                location.reload();
            }
        );

        GM_registerMenuCommand?.('Edit domain allowlist', () => {
            openDomainEditor(storage, 'allow', DOMAIN_ALLOW, DOMAIN_DENY);
        });

        GM_registerMenuCommand?.('Edit domain denylist', () => {
            openDomainEditor(storage, 'deny', DOMAIN_ALLOW, DOMAIN_DENY);
        });

        // Original article content (for restore functionality)
        let originalContent = null;
        let lastSummarizedContainer = null;

        // Digest handler
        async function handleDigest(size) {
            const mode = `summary_${size}`;
            updateOverlayStatus('processing', mode, false);

            try {
                const textData = getTextToDigest(SELECTORS, EXCLUDE, MIN_TEXT_LENGTH);

                // Handle extraction errors
                if (textData.error) {
                    let msg;
                    switch (textData.error) {
                        case 'selection_too_short':
                            msg = `Selected text is too short (${textData.actualLength} chars). Minimum is ${textData.minLength} chars.`;
                            break;
                        case 'article_too_short':
                            msg = `Article text is too short (${textData.actualLength} chars). Minimum is ${textData.minLength} chars.\nTry selecting text manually or adjust the minimum length in settings.`;
                            break;
                        case 'no_container':
                            msg = 'No article container found. Try selecting text manually or add a custom selector for this site.';
                            break;
                        case 'no_text':
                            msg = 'Container found but no text inside. Try selecting text manually.';
                            break;
                        default:
                            msg = 'No text found to summarize. Try selecting text or visit an article page.';
                    }
                    openInfo(msg);
                    updateOverlayStatus('ready');
                    return;
                }

                const { text, elements, source, container } = textData;

                // Store original content for restore
                if (source === 'article' && container && !originalContent) {
                    originalContent = container.innerHTML;
                    lastSummarizedContainer = container;
                }

                log(`Digesting ${text.length} chars from ${source}`);

                const prompt = CUSTOM_PROMPTS[mode] || DEFAULT_PROMPTS[mode];

                const result = await digestText(
                    storage,
                    text,
                    mode,
                    prompt,
                    SIMPLIFICATION_LEVEL,
                    (t, m) => cache.get(t, m),
                    async (t, m, r) => await cache.set(t, m, r),
                    (msg) => openKeyDialog(storage, msg, apiKeyDialogShown),
                    openInfo
                );

                updateOverlayStatus('digested', mode);
                showSummaryOverlay(result, mode, container, OVERLAY_COLLAPSED, restoreOriginal);

            } catch (err) {
                console.error('Digest error:', err);
                friendlyApiError(err, (msg) => openKeyDialog(storage, msg, apiKeyDialogShown), openInfo);
                updateOverlayStatus('ready');
            }
        }

        // Restore original article content
        function restoreOriginal() {
            if (originalContent && lastSummarizedContainer) {
                lastSummarizedContainer.innerHTML = originalContent;
                originalContent = null;
                lastSummarizedContainer = null;
            }
            updateOverlayStatus('ready');
            removeSummaryOverlay();
        }

        // Inspection mode handler
        function handleInspection() {
            enterInspectionMode(
                SELECTORS, HOST, SELECTORS_GLOBAL, SELECTORS_DOMAIN,
                EXCLUDE_GLOBAL, EXCLUDE_DOMAIN, EXCLUDE,
                storage, DOMAIN_SELECTORS, DOMAIN_EXCLUDES, openInfo
            );
        }

        // Settings functions
        async function setSimplification(level) {
            if (!SIMPLIFICATION_LEVELS.includes(level)) return;
            SIMPLIFICATION_LEVEL = level;
            await storage.set(STORAGE_KEYS.SIMPLIFICATION_STRENGTH, level);
            await cache.clear();
            location.reload();
        }

        async function setModel(modelId) {
            if (!MODEL_OPTIONS[modelId]) return;
            CFG.model = modelId;
            PRICING.model = modelId;
            PRICING.inputPer1M = MODEL_OPTIONS[modelId].inputPer1M;
            PRICING.outputPer1M = MODEL_OPTIONS[modelId].outputPer1M;
            await storage.set(STORAGE_KEYS.MODEL, modelId);
            await storage.set(STORAGE_KEYS.PRICING, JSON.stringify(PRICING));
        }

        async function setCustomPrompts(prompts) {
            CUSTOM_PROMPTS = prompts;
            await storage.set(STORAGE_KEYS.CUSTOM_PROMPT, JSON.stringify(prompts));
            await cache.clear();
        }

        async function setAutoSimplify(on) {
            AUTO_SIMPLIFY = !!on;
            await storage.set(STORAGE_KEYS.AUTO_SIMPLIFY, String(AUTO_SIMPLIFY));
            location.reload();
        }

        // Menu commands
        GM_registerMenuCommand?.('--- Configuration ---', () => {});

        GM_registerMenuCommand?.('Set / Validate OpenAI API key', async () => {
            const current = await storage.get(STORAGE_KEYS.OPENAI_KEY, '');
            openEditor({
                title: 'OpenAI API key',
                mode: 'secret',
                initial: current,
                hint: 'Stored locally (GM → localStorage → memory). Validate sends GET /v1/models.',
                onSave: async (val) => { await storage.set(STORAGE_KEYS.OPENAI_KEY, val); },
                onValidate: async (val) => {
                    const { xhrGet } = await Promise.resolve().then(function () { return api; });
                    const key = val || await storage.get(STORAGE_KEYS.OPENAI_KEY, '');
                    if (!key) { openInfo('No key to test'); return; }
                    try { await xhrGet('https://api.openai.com/v1/models', { Authorization: `Bearer ${key}` }); openInfo('Validation OK (HTTP 200)'); }
                    catch (e) { openInfo(`Validation failed: ${e.message || e}`); }
                }
            });
        });

        GM_registerMenuCommand?.(`Select AI Model (${MODEL_OPTIONS[CFG.model]?.name || CFG.model})`, () => {
            openModelSelectionDialog(storage, CFG.model, setModel);
        });

        GM_registerMenuCommand?.(`Simplification style (${SIMPLIFICATION_LEVEL})`, () => {
            openSimplificationStyleDialog(storage, SIMPLIFICATION_LEVEL, setSimplification);
        });

        GM_registerMenuCommand?.('Custom prompts', () => {
            openCustomPromptDialog(storage, CUSTOM_PROMPTS, setCustomPrompts);
        });

        GM_registerMenuCommand?.(`Minimum text length (${MIN_TEXT_LENGTH} chars)`, () => {
            const input = prompt(`Minimum text length for extraction (current: ${MIN_TEXT_LENGTH} chars):`, MIN_TEXT_LENGTH);
            if (input === null) return;
            const val = parseInt(input, 10);
            if (isNaN(val) || val < 0) {
                openInfo('Invalid value. Please enter a non-negative number.');
                return;
            }
            storage.set(STORAGE_KEYS.MIN_TEXT_LENGTH, String(val)).then(() => {
                MIN_TEXT_LENGTH = val;
                openInfo(`Minimum text length set to ${val} characters.`);
            });
        });

        // Selector configuration menu commands
        GM_registerMenuCommand?.('--- Container Selectors ---', () => {});

        GM_registerMenuCommand?.('Edit GLOBAL container selectors', () => {
            openEditor({
                title: 'Global container selectors (all domains)',
                mode: 'list',
                initial: SELECTORS_GLOBAL,
                hint: 'CSS selectors for finding article containers. One per line. Applied to all domains.',
                onSave: async (lines) => {
                    const clean = lines.filter(Boolean).map(s => s.trim()).filter(Boolean);
                    SELECTORS_GLOBAL = clean.length ? clean : [...DEFAULT_SELECTORS];
                    await storage.set(STORAGE_KEYS.SELECTORS_GLOBAL, JSON.stringify(SELECTORS_GLOBAL));
                    location.reload();
                }
            });
        });

        GM_registerMenuCommand?.('Edit GLOBAL exclusions: elements (self)', () => {
            openEditor({
                title: 'Global excluded elements (all domains)',
                mode: 'list',
                initial: EXCLUDE_GLOBAL.self || [],
                hint: 'Elements matching these selectors will be excluded. One per line.',
                onSave: async (lines) => {
                    EXCLUDE_GLOBAL.self = lines;
                    await storage.set(STORAGE_KEYS.EXCLUDES_GLOBAL, JSON.stringify(EXCLUDE_GLOBAL));
                    location.reload();
                }
            });
        });

        GM_registerMenuCommand?.('Edit GLOBAL exclusions: containers (ancestors)', () => {
            openEditor({
                title: 'Global excluded containers (all domains)',
                mode: 'list',
                initial: EXCLUDE_GLOBAL.ancestors || [],
                hint: 'Text inside these containers will be excluded. One per line (e.g., .sidebar, nav, footer).',
                onSave: async (lines) => {
                    EXCLUDE_GLOBAL.ancestors = lines;
                    await storage.set(STORAGE_KEYS.EXCLUDES_GLOBAL, JSON.stringify(EXCLUDE_GLOBAL));
                    location.reload();
                }
            });
        });

        GM_registerMenuCommand?.(`Edit DOMAIN additions: container selectors (${HOST})`, () => {
            openEditor({
                title: `Domain-specific container selectors for ${HOST}`,
                mode: 'domain',
                initial: SELECTORS_DOMAIN,
                globalItems: SELECTORS_GLOBAL,
                hint: 'Domain-specific selectors are added to global ones. Edit only the bottom section.',
                onSave: async (lines) => {
                    DOMAIN_SELECTORS[HOST] = lines;
                    await storage.set(STORAGE_KEYS.DOMAIN_SELECTORS, JSON.stringify(DOMAIN_SELECTORS));
                    location.reload();
                }
            });
        });

        GM_registerMenuCommand?.(`Edit DOMAIN additions: exclusions elements (${HOST})`, () => {
            openEditor({
                title: `Domain-specific excluded elements for ${HOST}`,
                mode: 'domain',
                initial: EXCLUDE_DOMAIN.self || [],
                globalItems: EXCLUDE_GLOBAL.self || [],
                hint: 'Domain-specific excludes are added to global ones. Edit only the bottom section.',
                onSave: async (lines) => {
                    if (!DOMAIN_EXCLUDES[HOST]) DOMAIN_EXCLUDES[HOST] = { self: [], ancestors: [] };
                    DOMAIN_EXCLUDES[HOST].self = lines;
                    await storage.set(STORAGE_KEYS.DOMAIN_EXCLUDES, JSON.stringify(DOMAIN_EXCLUDES));
                    location.reload();
                }
            });
        });

        GM_registerMenuCommand?.(`Edit DOMAIN additions: exclusions containers (${HOST})`, () => {
            openEditor({
                title: `Domain-specific excluded containers for ${HOST}`,
                mode: 'domain',
                initial: EXCLUDE_DOMAIN.ancestors || [],
                globalItems: EXCLUDE_GLOBAL.ancestors || [],
                hint: 'Domain-specific excludes are added to global ones. Edit only the bottom section.',
                onSave: async (lines) => {
                    if (!DOMAIN_EXCLUDES[HOST]) DOMAIN_EXCLUDES[HOST] = { self: [], ancestors: [] };
                    DOMAIN_EXCLUDES[HOST].ancestors = lines;
                    await storage.set(STORAGE_KEYS.DOMAIN_EXCLUDES, JSON.stringify(DOMAIN_EXCLUDES));
                    location.reload();
                }
            });
        });

        // Toggles
        GM_registerMenuCommand?.('--- Toggles ---', () => {});

        GM_registerMenuCommand?.(`Toggle DEBUG logs (${CFG.DEBUG ? 'ON' : 'OFF'})`, async () => {
            CFG.DEBUG = !CFG.DEBUG;
            await storage.set(STORAGE_KEYS.DEBUG, String(CFG.DEBUG));
            location.reload();
        });

        GM_registerMenuCommand?.(`Toggle auto-simplify (${AUTO_SIMPLIFY ? 'ON' : 'OFF'})`, async () => {
            await setAutoSimplify(!AUTO_SIMPLIFY);
        });

        // Actions
        GM_registerMenuCommand?.('--- Actions ---', () => {});

        GM_registerMenuCommand?.('Show usage statistics', () => {
            showStats(cache.size);
        });

        GM_registerMenuCommand?.('Flush cache & reload', async () => {
            await cache.clear();
            location.reload();
        });

        GM_registerMenuCommand?.('Reset API usage stats', async () => {
            await resetApiTokens(storage);
            openInfo('API usage stats reset. Token counters and cost tracking cleared.');
        });

        GM_registerMenuCommand?.('Inspect element', handleInspection);

        // Bootstrap
        const isFirstInstall = await storage.get(STORAGE_KEYS.FIRST_INSTALL, '') === '';
        const hasApiKey = (await storage.get(STORAGE_KEYS.OPENAI_KEY, '')) !== '';

        if (isFirstInstall) {
            log('First install detected');
            if (DOMAINS_MODE === 'deny') {
                await storage.set(STORAGE_KEYS.DOMAINS_MODE, 'allow');
                DOMAINS_MODE = 'allow';
                log('Set domain mode to allowlist (disabled by default)');
            }

            setTimeout(() => {
                openWelcomeDialog(storage);
            }, 500);
            return;
        }

        if (!hasApiKey) {
            log('No API key configured. Script inactive. Set API key via menu.');
            return;
        }

        if (DOMAIN_DISABLED) {
            log('Domain disabled, skipping overlay:', HOST);
            return;
        }

        // Create overlay
        createOverlay(OVERLAY_COLLAPSED, OVERLAY_POS, storage, handleDigest, handleInspection);

        // Auto-simplify if enabled
        if (AUTO_SIMPLIFY) {
            setTimeout(() => {
                const textData = getTextToDigest(SELECTORS, EXCLUDE, MIN_TEXT_LENGTH);
                if (!textData.error && textData.source === 'article') {
                    log('Auto-simplify enabled, applying large summary...');
                    handleDigest('large');
                }
            }, 1000);
        }

        // Observe DOM changes to ensure overlay persists
        const mo = new MutationObserver(() => {
            ensureOverlay(OVERLAY_COLLAPSED, OVERLAY_POS, storage, handleDigest, handleInspection);
        });
        mo.observe(document.body, { childList: true, subtree: false });

        log('Script initialized for', HOST);
    })();

})();
