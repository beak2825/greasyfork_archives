// ==UserScript==
// @name         Neutralize Headlines
// @namespace    https://fanis.dev/userscripts
// @author       Fanis Hatzidakis
// @license      PolyForm-Internal-Use-1.0.0; https://polyformproject.org/licenses/internal-use/1.0.0/
// @version      2.2.0
// @description  Tone down sensationalist titles via OpenAI API. Auto-detect + manual selectors, exclusions, per-domain configs, domain allow/deny, caching, Android-safe storage.
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
// @downloadURL https://update.greasyfork.org/scripts/554992/Neutralize%20Headlines.user.js
// @updateURL https://update.greasyfork.org/scripts/554992/Neutralize%20Headlines.meta.js
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
   * Configuration constants and settings
   */

  const CFG = {
    model: 'gpt-4.1-nano-priority',  // Default model (can be changed via settings)
    temperature: 0.2,
    maxBatch: 24,
    DEBUG: false,

    highlight: true,
    highlightMs: 900,
    highlightColor: '#fff4a3',

    visibleOnly: true,
    rootMargin: '1000px 0px',
    threshold: 0,
    flushDelayMs: 180,

    autoDetect: true,
    minLen: 8,
    maxLen: 180,
    sanityCheckLen: 500, // Warn user if manual selector matches text > 500 chars

    // smarter headline scoring
    minWords: 3,
    maxWords: 35,
    scoreThreshold: 75,
    topKPerCard: 1,
    kickerFilterStrict: true,

    DEBUG_SCORES: false,
    showOriginalOnHover: true,

    // cache controls
    cacheLimit: 1500,       // max entries
    cacheTrimTo: 1100,      // when trimming, keep last N
  };

  const UI_ATTR = 'data-neutralizer-ui';

  // Available models with pricing
  // Pricing source: https://openai.com/api/pricing/ (verified 2026-01)
  // Note: Priority tier (service_tier: 'priority') provides faster processing at no additional cost
  const MODEL_OPTIONS = {
    'gpt-5-nano': {
      name: 'GPT-5 Nano',
      apiModel: 'gpt-5-nano',
      description: 'Ultra-affordable latest generation - Best value',
      inputPer1M: 0.05,
      outputPer1M: 0.40,
      recommended: false,
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
      description: 'Fast processing, affordable - Best for headlines',
      inputPer1M: 0.10,
      outputPer1M: 0.40,
      recommended: true,
      priority: true
    },
    'gpt-5-mini-priority': {
      name: 'GPT-5 Mini Priority',
      apiModel: 'gpt-5-mini',
      description: 'Better quality + faster processing',
      inputPer1M: 0.25,
      outputPer1M: 2.00,
      recommended: false,
      priority: true
    },
    'gpt-5.2-priority': {
      name: 'GPT-5.2 Priority',
      apiModel: 'gpt-5.2',
      description: 'Premium quality + fastest processing (most expensive)',
      inputPer1M: 1.75,
      outputPer1M: 14.00,
      recommended: false,
      priority: true
    }
  };

  // Temperature levels mapping
  const TEMPERATURE_LEVELS = {
    'Minimal': 0.0,
    'Light': 0.1,
    'Moderate': 0.2,
    'Strong': 0.35,
    'Maximum': 0.5
  };

  const TEMPERATURE_ORDER = ['Minimal', 'Light', 'Moderate', 'Strong', 'Maximum'];

  // Storage keys
  const STORAGE_KEYS = {
    SELECTORS: 'neutralizer_selectors_v1',
    EXCLUDES: 'neutralizer_excludes_v1',
    DOMAIN_SELECTORS: 'neutralizer_domain_selectors_v2',
    DOMAIN_EXCLUDES: 'neutralizer_domain_excludes_v2',
    LONG_HEADLINE_EXCEPTIONS: 'neutralizer_long_exceptions_v1',
    DOMAINS_MODE: 'neutralizer_domains_mode_v1',
    DOMAINS_DENY: 'neutralizer_domains_excluded_v1',
    DOMAINS_ALLOW: 'neutralizer_domains_enabled_v1',
    DEBUG: 'neutralizer_debug_v1',
    AUTO_DETECT: 'neutralizer_autodetect_v1',
    SHOW_ORIG: 'neutralizer_showorig_v1',
    SHOW_BADGE: 'neutralizer_showbadge_v1',
    BADGE_COLLAPSED: 'neutralizer_badge_collapsed_v1',
    BADGE_POS: 'neutralizer_badge_pos_v1',
    TEMPERATURE: 'neutralizer_temperature_v1',
    FIRST_INSTALL: 'neutralizer_installed_v1',
    API_TOKENS: 'neutralizer_api_tokens_v1',
    PRICING: 'neutralizer_pricing_v1',
    CACHE: 'neutralizer_cache_v1',
    MODEL: 'neutralizer_model_v1',
    OPENAI_KEY: 'OPENAI_KEY'
  };

  // Default selectors
  const DEFAULT_SELECTORS = [
    'h1', 'h2', 'h3', '.lead', '[itemprop="headline"]',
    '[role="heading"]', '.title', '.title a', '.summary',
    '.hn__title-container h2 a', '.article-title'
  ];

  // Default excludes
  const DEFAULT_EXCLUDES = {
    self: [],
    ancestors: ['footer', 'nav', 'aside', '[role="navigation"]', '.breadcrumbs', '[aria-label*="breadcrumb" i]']
  };

  // Default API pricing (gpt-4.1-nano-priority, verified January 2026)
  const DEFAULT_PRICING = {
    model: 'GPT-4.1 Nano Priority',
    inputPer1M: 0.10,    // USD per 1M input tokens
    outputPer1M: 0.40,   // USD per 1M output tokens
    lastUpdated: '2026-01-23',
    source: 'https://openai.com/api/pricing/'
  };

  // Heuristic selectors and patterns
  const CARD_SELECTOR = 'article, [itemtype*="NewsArticle"], .card, .post, .entry, .teaser, .tile, .story, [data-testid*="card" i]';

  const KICKER_CLASS = /(kicker|eyebrow|label|badge|chip|pill|tag|topic|category|section|watch|brief|update|live|breaking)/i;
  const KICKER_ID = /(kicker|eyebrow|label|badge|chip|pill|tag|topic|category|section|watch|brief|update|live|breaking)/i;

  const UI_LABELS = /\b(comments?|repl(?:y|ies)|share|watch|play|read(?:\s*more)?|more|menu|subscribe|login|sign ?in|sign ?up|search|next|previous|prev|back|trending|latest|live|open|close|expand|collapse|video|audio|podcast|gallery|photos?)\b/i;

  const UI_CONTAINERS = '.meta, .metadata, .byline, .tools, .actions, .card__meta, .card__footer, .post__meta, [data-testid*="tools" i], [role="toolbar"]';

  // Log prefix
  const LOG_PREFIX = '[neutralizer-ai]';

  /**
   * Utility functions
   */


  // Logging
  function log(...args) {
    if (!CFG.DEBUG) return;
    console.log(LOG_PREFIX, ...args);
  }

  // Text processing
  const normalizeSpace = (s) => s.replace(/\s+/g, ' ').trim();
  const textTrim = (n) => normalizeSpace(n.textContent || '');
  const words = (s) => normalizeSpace(s).split(' ').filter(Boolean);
  const withinLen = (t) => { const L = t.length; return L >= CFG.minLen && L <= CFG.maxLen; };
  const hasPunct = (s) => /[.?!:;—–-]/.test(s);
  const hasDigit = (s) => /\d/.test(s);

  // DOM checks
  const isVisible = (el) => el.offsetParent !== null;

  // Text analysis
  const lowerRatio = (s) => {
    const letters = s.match(/[A-Za-zΑ-Ωα-ωΆ-Ώά-ώ]/g) || [];
    if (!letters.length) return 0;
    const lowers = s.match(/[a-zα-ωά-ώ]/g) || [];
    return lowers.length / letters.length;
  };

  const isAllCapsish = (s) => {
    const ls = s.replace(/[^A-Za-zΑ-Ωα-ωΆ-Ώ]/g, '');
    if (ls.length < 2) return false;
    const uppers = s.match(/[A-ZΑ-ΩΆ-Ώ]/g) || [];
    return uppers.length / ls.length >= 0.85;
  };

  // Quote protection (preserve quoted text verbatim)
  function quoteProtect(original, rewritten) {
    const quotes = [];
    const rx = /["""«»](.*?)["""«»]/g;
    let m;
    while ((m = rx.exec(original)) !== null) {
      quotes.push(m[0]);
    }
    let out = rewritten;
    for (const q of quotes) {
      out = out.replace(/(["""«»]).*?(["""«»])/g, q);
    }
    return out;
  }

  // HTML escaping
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  // Viewport and positioning utilities
  function parseRootMarginPxY() {
    const m = (CFG.rootMargin || '0px').trim().split(/\s+/);
    const top = m[0] || '0px';
    const val = parseFloat(top);
    return isNaN(val) ? 0 : val;
  }

  function isInViewportWithMargin(el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const m = parseRootMarginPxY();
    return rect.bottom >= -m && rect.top <= vh + m;
  }

  // Line parsing for dialogs
  function parseLines(s) {
    return s.split(/[\n,;]+/).map(x => x.trim()).filter(Boolean);
  }

  /**
   * Storage module with GM → localStorage → memory fallback
   * Handles userscript storage across different environments
   */

  class Storage {
    constructor() {
      this.memory = new Map();
      this.namespace = '__neutralizer__';
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
   * Cache module for headline neutralization
   * Handles LRU caching with automatic trimming and persistence
   */

  class HeadlineCache {
    constructor(storage, config, log) {
      this.storage = storage;
      this.config = config;
      this.log = log;
      this.cache = {};
      this.dirty = false;
      this.storageKey = 'neutralizer_cache_v1';
      this.hostname = '';
    }

    /**
     * Initialize cache with hostname and load from storage
     */
    async init(hostname) {
      this.hostname = hostname;
      const stored = await this.storage.get(this.storageKey, '{}');
      try {
        this.cache = JSON.parse(stored);
        this.log('cache loaded:', Object.keys(this.cache).length, 'entries');
      } catch (e) {
        this.log('cache parse error, resetting');
        this.cache = {};
      }
    }

    /**
     * Generate cache key from hostname and text
     */
    cacheKey(text) {
      return this.hostname + '|' + text;
    }

    /**
     * Get cached neutralized text
     */
    get(text) {
      const entry = this.cache[this.cacheKey(text)];
      if (!entry) return null;

      // Update timestamp for LRU
      entry.t = Date.now();
      this.dirty = true;

      return entry.r;
    }

    /**
     * Set cached neutralized text with LRU trimming
     */
    set(text, neutralized) {
      this.cache[this.cacheKey(text)] = {
        r: neutralized,
        t: Date.now()
      };
      this.dirty = true;

      const size = Object.keys(this.cache).length;
      if (size > this.config.cacheLimit) {
        // Lazy trim in microtask
        queueMicrotask(() => {
          const keys = Object.keys(this.cache);
          if (keys.length <= this.config.cacheLimit) return;

          // Sort by timestamp (oldest first)
          keys.sort((a, b) => this.cache[a].t - this.cache[b].t);

          // Drop oldest entries
          const toDrop = Math.max(0, keys.length - this.config.cacheTrimTo);
          for (let i = 0; i < toDrop; i++) {
            delete this.cache[keys[i]];
          }

          this.persistCache();
          this.log('cache trimmed:', keys.length, '→', Object.keys(this.cache).length);
        });
      } else if (this.dirty) {
        // Debounced write
        clearTimeout(this._persistTimer);
        this._persistTimer = setTimeout(() => this.persistCache(), 250);
      }
    }

    /**
     * Persist cache to storage
     */
    async persistCache() {
      await this.storage.set(this.storageKey, JSON.stringify(this.cache));
      this.dirty = false;
    }

    /**
     * Clear all cache entries
     */
    async clear() {
      this.cache = {};
      await this.storage.set(this.storageKey, JSON.stringify(this.cache));
    }

    /**
     * Get cache size
     */
    size() {
      return Object.keys(this.cache).length;
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
    return selectors.join(',');
  }

  /**
   * OpenAI API integration and token tracking
   */


  /**
   * API token usage tracking (persistent across sessions)
   */
  let API_TOKENS = {
    headlines: { input: 0, output: 0, calls: 0 }
  };

  /**
   * API Pricing configuration (user-editable)
   */
  let PRICING = { ...DEFAULT_PRICING };

  /**
   * Initialize API tokens and pricing from storage
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
  }

  /**
   * Update API token usage
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

    // Debounced save to avoid excessive writes
    clearTimeout(updateApiTokens._timer);
    updateApiTokens._timer = setTimeout(() => {
      storage.set(STORAGE_KEYS.API_TOKENS, JSON.stringify(API_TOKENS));
      log('API tokens updated and saved:', API_TOKENS);
    }, 1000);
  }

  /**
   * Reset API token statistics
   */
  async function resetApiTokens(storage) {
    API_TOKENS = {
      headlines: { input: 0, output: 0, calls: 0 }
    };
    await storage.set(STORAGE_KEYS.API_TOKENS, JSON.stringify(API_TOKENS));
    log('API token stats reset');
  }

  /**
   * Calculate total API cost based on current pricing
   */
  function calculateApiCost() {
    const inputCost = API_TOKENS.headlines.input * PRICING.inputPer1M / 1_000_000;
    const outputCost = API_TOKENS.headlines.output * PRICING.outputPer1M / 1_000_000;
    return inputCost + outputCost;
  }

  /**
   * Update pricing configuration
   */
  async function updatePricing(storage, newPricing) {
    PRICING = {
      ...PRICING,
      ...newPricing,
      lastUpdated: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    await storage.set(STORAGE_KEYS.PRICING, JSON.stringify(PRICING));
    log('Pricing updated:', PRICING);
  }

  /**
   * API request headers
   */
  function apiHeaders(key) {
    return {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
  }

  /**
   * XHR POST request
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
        timeout: 30000,
        ontimeout: () => { const err = new Error('Request timeout'); err.status = 0; reject(err); },
      });
    });
  }

  /**
   * XHR GET request
   */
  function xhrGet(url, headers = {}) {
    return new Promise((resolve, reject) => {
      const api = (typeof GM !== 'undefined' && GM.xmlHttpRequest) ? GM.xmlHttpRequest : GM_xmlhttpRequest;
      api({
        method: 'GET',
        url,
        headers,
        onload: (r) => (r.status >= 200 && r.status < 300) ? resolve(r.responseText) : reject(Object.assign(new Error(`HTTP ${r.status}`), { status: r.status, body: r.responseText })),
        onerror: (e) => reject(Object.assign(new Error((e && e.error) || 'Network error'), { status: 0 })),
        timeout: 20000,
        ontimeout: () => reject(Object.assign(new Error('Request timeout'), { status: 0 })),
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
   * Rewrite batch of headlines via OpenAI API
   */
  async function rewriteBatch(storage, texts) {
    const KEY = await storage.get(STORAGE_KEYS.OPENAI_KEY, '');
    if (!KEY) {
      throw Object.assign(new Error('API key missing'), { status: 401 });
    }

    const safeInputs = texts.map(t => t.replace(/[\u2028\u2029]/g, ' '));
    const instructions =
      'You will receive INPUT as a JSON array of headlines.' +
      ' Rewrite each headline neutrally in the SAME language as input.' +
      ' Preserve factual meaning and named entities. Remove sensationalism and excess punctuation.' +
      ' If the headline contains a direct quote inside quotation marks (English "…", Greek «…»), keep that quoted text verbatim.' +
      ' Aim ≤ 110 characters when possible. Return ONLY a JSON array of strings, same order as input.';

    // Get model config (apiModel and priority flag)
    const modelConfig = MODEL_OPTIONS[CFG.model] || MODEL_OPTIONS['gpt-4.1-nano-priority'];
    const apiModel = modelConfig.apiModel;

    const bodyObj = {
      model: apiModel,
      max_output_tokens: 1000,
      instructions,
      input: JSON.stringify(safeInputs)
    };

    // GPT-5 models are reasoning models - use minimal reasoning instead of temperature
    if (apiModel.startsWith('gpt-5')) {
      bodyObj.reasoning = { effort: 'minimal' };
    } else {
      bodyObj.temperature = CFG.temperature;
    }

    // Add service_tier for priority models
    if (modelConfig.priority) {
      bodyObj.service_tier = 'priority';
    }

    const body = JSON.stringify(bodyObj);

    const resText = await xhrPost('https://api.openai.com/v1/responses', body, apiHeaders(KEY));
    const payload = JSON.parse(resText);

    // Track token usage
    if (payload.usage) {
      updateApiTokens(storage, 'headlines', payload.usage);
    }

    const outStr = extractOutputText(payload);
    log('API response payload:', JSON.stringify(payload).substring(0, 500));
    log('Extracted output:', outStr ? outStr.substring(0, 200) : 'null');

    if (!outStr) throw Object.assign(new Error('No output_text/content from API'), { status: 400 });

    // Strip markdown code fences if present
    const cleaned = outStr.replace(/^```json\s*|\s*```$/g, '').trim();

    // Try to parse as JSON array
    let arr;
    try {
      arr = JSON.parse(cleaned);
    } catch (e) {
      log('JSON parse failed, raw output:', cleaned.substring(0, 300));
      throw Object.assign(new Error(`Failed to parse API response as JSON: ${e.message}`), { status: 400 });
    }

    if (!Array.isArray(arr)) throw Object.assign(new Error('API did not return a JSON array'), { status: 400 });
    return arr;
  }

  var api = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get API_TOKENS () { return API_TOKENS; },
    get PRICING () { return PRICING; },
    apiHeaders: apiHeaders,
    calculateApiCost: calculateApiCost,
    extractOutputText: extractOutputText,
    initApiTracking: initApiTracking,
    resetApiTokens: resetApiTokens,
    rewriteBatch: rewriteBatch,
    updateApiTokens: updateApiTokens,
    updatePricing: updatePricing,
    xhrGet: xhrGet,
    xhrPost: xhrPost
  });

  /**
   * Headline scoring and filtering logic
   */


  /**
   * Check if element is likely a kicker/label (should be excluded)
   */
  function isLikelyKicker(el, t) {
    const w = words(t);
    const fewWords = w.length <= 4;
    const noEndPunct = !/[.?!]$/.test(t);
    const capsy = isAllCapsish(t);
    const looksLikeLabel = (el.className && KICKER_CLASS.test(el.className)) ||
                          (el.id && KICKER_ID.test(el.id));
    return ((CFG.kickerFilterStrict && (capsy && fewWords && noEndPunct)) || looksLikeLabel);
  }

  /**
   * Score element by tag type
   */
  function tagScore(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'h1') return 100;
    if (tag === 'h2') return 90;
    if (tag === 'h3') return 80;
    if (tag === 'h4') return 65;
    if (tag === 'a') return 60;
    if (el.hasAttribute('role') && el.getAttribute('role') === 'heading') return 75;
    if (el.hasAttribute('itemprop') && /headline/i.test(el.getAttribute('itemprop'))) return 85;
    return 50;
  }

  /**
   * Score element by CSS properties (font size, weight)
   */
  function cssScore(el) {
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize) || 0;
    const fw = parseInt(cs.fontWeight, 10) || 400;
    let s = 0;
    if (fs) {
      s += Math.min(40, (fs - 12) * 2);
      if (fs < 14) s -= 30;
    }
    if (fw >= 700) s += 12;
    else if (fw >= 600) s += 8;
    else if (fw >= 500) s += 4;
    return s;
  }

  /**
   * Score element by content characteristics
   */
  function contentScore(t) {
    const w = words(t);
    if (w.length < CFG.minWords) return -40;
    if (w.length > CFG.maxWords) return -20;
    let s = 0;
    if (hasPunct(t)) s += 8;
    if (hasDigit(t)) s += 4;
    const lr = lowerRatio(t);
    if (lr < 0.2) s -= 25;
    if (/["""«»]/.test(t)) s += 2;
    return s;
  }

  /**
   * Compute overall candidate score
   */
  function computeCandidateScore(el, t) {
    let s = 0;
    s += tagScore(el);
    s += cssScore(el);
    s += contentScore(t);
    if (el.closest(CARD_SELECTOR)) s += 10;
    if (isLikelyKicker(el, t)) s -= 50;
    if (el.tagName.toLowerCase() === 'a' && words(t).length <= 3 && !hasPunct(t)) s -= 24;
    return s;
  }

  /**
   * Hard reject certain text patterns (UI labels, etc.)
   */
  function isHardRejectText(el, t) {
    const w = words(t).length;
    if (el.closest?.(UI_CONTAINERS)) return true;
    if (UI_LABELS.test(t)) return true;
    const href = el.tagName?.toLowerCase?.() === 'a' ? (el.getAttribute('href') || '') : '';
    if (/#/.test(href) || /comment/i.test(href)) return true;
    if (w <= 2 && !hasPunct(t) && t.length < 18) return true;
    if (isAllCapsish(t) && w <= 4 && !hasPunct(t)) return true;
    return false;
  }

  /**
   * DOM manipulation, headline detection, and element replacement
   */


  /**
   * Ensure highlight CSS is injected
   */
  function ensureHighlightCSS() {
    if (document.getElementById('neutralizer-ai-style')) return;
    const style = document.createElement('style');
    style.id = 'neutralizer-ai-style';
    style.textContent = `
    .neutralizer-ai-flash { animation: neutralizerFlash var(--neutralizer-duration, 900ms) ease-out; }
    @keyframes neutralizerFlash {
      0% { background-color: var(--neutralizer-color, #fff4a3);
           box-shadow: 0 0 0 2px rgba(0,0,0,.03), 0 0 12px rgba(0,0,0,.12); }
      100% { background-color: transparent; box-shadow: none; }
    }
    .neutralizer-badge { position: fixed !important; z-index: 2147483646;
      font: 12px/1.4 system-ui, sans-serif !important; color: #0b3d2c !important;
      background: rgba(255,255,255,0.95) !important;
      border: 1px solid #79d4b0 !important; padding: 0 !important; border-radius: 10px !important;
      box-shadow: 0 6px 22px rgba(0,0,0,.18) !important;
      display: flex !important; flex-direction: column !important; gap: 0 !important;
      box-sizing: border-box !important; width: max-content !important; min-width: 120px !important;
      margin: 0 !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      user-select: none !important; }
    .neutralizer-badge.collapsed { right: 0 !important; left: auto !important;
      transform: translateX(100%) !important; border-right: none !important;
      border-radius: 10px 0 0 10px !important; box-shadow: -4px 0 22px rgba(0,0,0,.18) !important; }
    .neutralizer-badge.dragging { transition: none !important; cursor: grabbing !important; }
    .neutralizer-badge .badge-handle { position: absolute !important; left: -28px !important; top: 50% !important;
      transform: translateY(-50%) !important; width: 28px !important; height: 56px !important;
      background: linear-gradient(90deg, #d4f8e8 0%, #c9f6e1 100%) !important; border: 1px solid #79d4b0 !important; border-right: none !important;
      border-radius: 8px 0 0 8px !important; cursor: pointer !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      font-size: 14px !important; color: #0b3d2c !important; user-select: none !important;
      box-shadow: -3px 0 12px rgba(0,0,0,.12) !important; transition: all 0.2s ease !important; }
    .neutralizer-badge .badge-handle:hover { left: -30px !important; box-shadow: -4px 0 16px rgba(0,0,0,.18) !important; }
    .neutralizer-badge .badge-header { background: linear-gradient(135deg, #2d6a54 0%, #0b3d2c 100%) !important;
      color: #fff !important; padding: 6px 10px !important; font-size: 10px !important;
      font-weight: 600 !important; text-align: center !important; cursor: grab !important;
      user-select: none !important; border-radius: 9px 9px 0 0 !important;
      letter-spacing: 0.3px !important; }
    .neutralizer-badge .badge-header:active { cursor: grabbing !important; }
    .neutralizer-badge .badge-content { display: flex !important; flex-direction: column !important;
      gap: 6px !important; padding: 8px 10px !important; }
    .neutralizer-badge * { box-sizing: border-box !important; }
    .neutralizer-badge .row { display: flex !important; gap: 8px !important; align-items: center !important;
      justify-content: center !important; margin: 0 !important; padding: 0 !important; width: 100%; }
    .neutralizer-badge .btn { cursor: pointer !important; padding: 6px 10px !important; border-radius: 8px !important;
      border: 1px solid #79d4b0 !important; background: #fff !important; box-sizing: border-box !important;
      white-space: nowrap !important; font-family: system-ui, sans-serif !important;
      font-size: 12px !important; line-height: 1.2 !important; color: #0b3d2c !important;
      margin: 0 !important; min-width: 0 !important; width: auto !important; }
    .neutralizer-badge .btn.primary { background: #0b3d2c !important; color: #fff !important;
      border-color: #0b3d2c !important; }
    .neutralizer-badge .btn:disabled { opacity: 0.6 !important; cursor: not-allowed !important; }
    .neutralizer-badge .small { font-size: 11px !important; opacity: .9 !important; }
  `;
    document.head.appendChild(style);
  }

  /**
   * Check if element should be excluded
   */
  function isExcluded(el, EXCLUDE) {
    if (el.closest?.(`[${UI_ATTR}]`)) return true;
    if (el.closest('input, textarea, [contenteditable=""], [contenteditable="true"]')) return true;
    if (EXCLUDE.self.length && el.matches?.(EXCLUDE.self.join(','))) return true;
    if (EXCLUDE.ancestors.length && el.closest?.(EXCLUDE.ancestors.join(','))) return true;
    return false;
  }

  /**
   * Find the best text-containing child element
   */
  function findTextHost(el) {
    const p = el.querySelector(':scope > p');
    if (p && withinLen(textTrim(p))) return p;
    const a = el.querySelector(':scope > a');
    if (a && withinLen(textTrim(a))) return a;
    const kids = Array.from(el.children);
    if (kids.length === 1 && textTrim(kids[0]) === textTrim(el)) return kids[0];
    let best = null, bestLen = 0;
    for (const c of kids) {
      const L = textTrim(c).length;
      if (L > bestLen) { best = c; bestLen = L; }
    }
    return best && bestLen ? best : el;
  }

  /**
   * Get manually matched elements via selectors
   */
  function getManualMatches(root, SELECTORS) {
    if (!SELECTORS.length) return [];
    try {
      return [...root.querySelectorAll(compiledSelectors(SELECTORS))];
    } catch (e) {
      log('manual selector error:', e.message || e, 'selectors=', SELECTORS);
      return [];
    }
  }

  /**
   * Discover headline candidates using heuristics
   */
  function discoverCandidates(root, EXCLUDE) {
    if (!CFG.autoDetect) return [];
    const seedSets = [
      root.querySelectorAll('h1, h2, h3, h4, [role="heading"], [aria-level], [itemprop="headline"]'),
      root.querySelectorAll('.lead, .deck, .standfirst, .subhead, .kicker, .teaser, .title, .headline'),
      root.querySelectorAll(`${CARD_SELECTOR} h1, ${CARD_SELECTOR} h2, ${CARD_SELECTOR} h3, ${CARD_SELECTOR} a`)
    ];
    const candEls = [];
    const seen = new Set();
    for (const list of seedSets) {
      for (const el of list) {
        if (!el || seen.has(el) || !isVisible(el) || isExcluded(el, EXCLUDE)) continue;
        seen.add(el);
        candEls.push(el);
      }
    }

    const scored = [];
    for (const el of candEls) {
      const host = findTextHost(el);
      if (!host || isExcluded(host, EXCLUDE)) continue;
      const t = normalizeSpace(host.textContent || '');
      if (!withinLen(t)) continue;
      if (isHardRejectText(host, t)) continue;
      const score = computeCandidateScore(host, t);
      if (score >= CFG.scoreThreshold) {
        scored.push({ host, text: t, score, card: host.closest(CARD_SELECTOR) });
      }
    }

    const byCard = new Map();
    for (const row of scored) {
      const key = row.card || document;
      if (!byCard.has(key)) byCard.set(key, []);
      byCard.get(key).push(row);
    }
    const winners = [];
    for (const [, arr] of byCard) {
      arr.sort((a, b) => b.score - a.score);
      winners.push(...arr.slice(0, CFG.topKPerCard));
    }

    const bestByText = new Map();
    for (const w of winners) {
      const k = w.text;
      if (!bestByText.has(k) || w.score > bestByText.get(k).score) bestByText.set(k, w);
    }

    if (CFG.DEBUG_SCORES) {
      const top = [...bestByText.values()].sort((a, b) => b.score - a.score).slice(0, 20);
      log('top candidates:', top.map(x => ({ score: x.score, text: x.text.slice(0, 120) })));
    }

    return [...bestByText.values()].map(x => x.host);
  }

  /**
   * Get all candidate elements (manual + auto)
   */
  function getCandidateElements(root, SELECTORS, EXCLUDE) {
    const manual = getManualMatches(root, SELECTORS).map(el => ({ el: findTextHost(el), mode: 'manual' }));
    const auto = discoverCandidates(root, EXCLUDE).map(el => ({ el, mode: 'auto' }));
    const uniq = [];
    const seen = new Set();
    for (const rec of [...manual, ...auto]) {
      const el = rec.el;
      if (!el || isExcluded(el, EXCLUDE)) continue;
      if (seen.has(el)) continue;
      seen.add(el);
      uniq.push(rec);
    }
    return uniq;
  }

  /**
   * Apply rewrites to elements
   */
  function applyRewrites(map, originals, rewrites, source, STATS, CHANGES, seenEl, updateBadgeCounts) {
    let changedBatch = 0;
    const localChanges = [];
    for (let i = 0; i < originals.length; i++) {
      const from = originals[i];
      let to = (rewrites[i] ?? '').trim();
      if (!to || to === from) continue;
      to = quoteProtect(from, to);

      const els = map.get(from) || [];
      let changedCount = 0;

      for (const host of els) {
        if (seenEl.has(host)) continue;
        const before = textTrim(host);
        if (!before) continue;

        if (!host.hasAttribute('data-neutralizer-original')) {
          host.setAttribute('data-neutralizer-original', before);
        }
        if (CFG.showOriginalOnHover && !host.hasAttribute('title')) {
          host.setAttribute('title', before);
        }

        host.textContent = to;
        host.setAttribute('data-neutralizer-changed', '1');
        seenEl.add(host);
        changedCount++;
        changedBatch++;

        if (CFG.highlight) {
          host.style.setProperty('--neutralizer-color', CFG.highlightColor);
          host.style.setProperty('--neutralizer-duration', `${CFG.highlightMs}ms`);
          host.classList.add('neutralizer-ai-flash');
          setTimeout(() => host.classList.remove('neutralizer-ai-flash'), CFG.highlightMs + 120);
        }
      }
      if (changedCount) {
        const mode = (els[0]?.getAttribute?.('data-neutralizer-mode')) || 'auto';
        log(`[${source}] (${mode}) "${from}" → "${to}" on ${changedCount} element(s)`);
        localChanges.push({ from, to, count: changedCount, source, mode });
      }
    }
    if (changedBatch) {
      if (source === 'live') STATS.live += changedBatch;
      else if (source === 'cache') STATS.cache += changedBatch;
      STATS.total = STATS.live + STATS.cache;
      CHANGES.push(...localChanges);
    }
    return changedBatch;
  }

  /**
   * Restore original text
   */
  function restoreOriginals() {
    const els = document.querySelectorAll('[data-neutralizer-changed="1"][data-neutralizer-original]');
    let n = 0;
    els.forEach(el => {
      const orig = el.getAttribute('data-neutralizer-original');
      if (typeof orig === 'string') { el.textContent = orig; n++; }
    });
    log('restored originals on', n, 'elements');
  }

  /**
   * Settings dialogs and management
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
    .actions .save{background:#1a73e8;color:#fff;border-color:#1a73e8}
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
    openEditor({ title: 'Neutralizer', mode: 'info', initial: message, hint: 'Press Enter or Escape to close.' });
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
      title: 'OpenAI API key',
      mode: 'secret',
      initial: '',
      hint: 'Stored locally (GM → localStorage → memory). Validate sends GET /v1/models.',
      onSave: async (val) => {
        const ok = await storage.set(STORAGE_KEYS.OPENAI_KEY, val);
        const verify = await storage.get(STORAGE_KEYS.OPENAI_KEY, '');
        console.log('API key saved:', ok, verify ? `••••${verify.slice(-4)}` : '(empty)');
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
  function openWelcomeDialog(storage, openEditor, openInfo) {
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
    .modal .steps a{color:#1a73e8;text-decoration:none}
    .modal .steps a:hover{text-decoration:underline}
    .actions{display:flex;gap:12px;justify-content:flex-end;margin-top:20px}
    .btn{padding:10px 20px;border-radius:8px;border:none;font:600 14px system-ui,sans-serif;
         cursor:pointer;transition:all 0.15s ease}
    .btn.primary{background:#1a73e8;color:#fff}
    .btn.primary:hover{background:#1557b0}
    .btn.secondary{background:#e8eaed;color:#1a1a1a}
    .btn.secondary:hover{background:#dadce0}
  `;
    const wrap = document.createElement('div');
    wrap.className = 'wrap';

    wrap.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Welcome">
      <h2>Welcome to Neutralize Headlines!</h2>
      <p>This userscript helps you browse the web with calmer, more informative headlines by neutralizing sensationalist language.</p>
      <p>To get started, you'll need an OpenAI API key:</p>
      <div class="steps">
        <ol>
          <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI API Keys</a></li>
          <li>Sign in or create an account</li>
          <li>Click "Create new secret key"</li>
          <li>Copy the key and paste it in the next dialog</li>
        </ol>
      </div>
      <p style="font-size:13px;color:#666;margin-top:16px"><strong>Domain control:</strong> By default, all websites are disabled. After setup, you can enable websites one by one via the menu, or toggle to "All domains with Denylist" mode to enable everywhere.</p>
      <p style="font-size:13px;color:#666">The script uses GPT-4.1 Nano Priority by default (fast processing for headlines). You can change the model anytime via the menu. Your key is stored locally and never shared.</p>
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
   * Show temperature selection dialog
   */
  function openTemperatureDialog(storage, TEMPERATURE_LEVEL, setTemperature) {
    const host = document.createElement('div');
    host.setAttribute(UI_ATTR, '');
    const shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
    .wrap{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.45);
          display:flex;align-items:center;justify-content:center}
    .modal{background:#fff;max-width:520px;width:92%;border-radius:10px;
           box-shadow:0 10px 40px rgba(0,0,0,.35);padding:20px;box-sizing:border-box}
    .modal h3{margin:0 0 16px;font:600 16px/1.2 system-ui,sans-serif}
    .options{display:flex;flex-direction:column;gap:10px}
    .option-btn{padding:14px 16px;border-radius:8px;border:2px solid #d0d0d0;background:#fff;
                cursor:pointer;text-align:left;font:14px/1.4 system-ui,sans-serif;
                transition:all 0.15s ease;display:flex;justify-content:space-between;align-items:center}
    .option-btn:hover{background:#f8f9fa;border-color:#1a73e8}
    .option-btn.selected{background:#e8f0fe;border-color:#1a73e8;font-weight:600}
    .option-btn .label{flex:1}
    .option-btn .value{color:#666;font-size:12px;margin-left:8px}
    .option-btn .checkmark{color:#1a73e8;margin-left:8px;font-weight:bold}
    .hint{margin:16px 0 0;color:#666;font:12px/1.4 system-ui,sans-serif;text-align:center}
  `;
    const wrap = document.createElement('div');
    wrap.className = 'wrap';

    const optionsHTML = TEMPERATURE_ORDER.map(level => {
      const isSelected = level === TEMPERATURE_LEVEL;
      const value = TEMPERATURE_LEVELS[level];
      return `<button class="option-btn ${isSelected ? 'selected' : ''}" data-level="${level}">
      <span class="label">${level}</span>
      <span class="value">${value}</span>
      ${isSelected ? '<span class="checkmark">✓</span>' : ''}
    </button>`;
    }).join('');

    wrap.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Neutralization Strength">
      <h3>Neutralization Strength</h3>
      <div class="options">
        ${optionsHTML}
      </div>
      <p class="hint">Select how aggressively to neutralize headlines. Lower values preserve more of the original meaning.</p>
    </div>`;

    shadow.append(style, wrap);
    document.body.appendChild(host);
    const close = () => host.remove();

    shadow.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const level = btn.getAttribute('data-level');
        await setTemperature(level);
      });
    });

    wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
    shadow.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); close(); } });
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
    .option:hover{border-color:#1a73e8;background:#f8f9ff}
    .option.selected{border-color:#1a73e8;background:#1a73e8;color:#fff}
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
    .btn-save{background:#1a73e8;color:#fff}
    .btn-save:hover{background:#1557b0}
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
        <div class="option-pricing">$${model.inputPer1M.toFixed(2)}/1M input - $${model.outputPer1M.toFixed(2)}/1M output</div>
      </div>
    `;
    }).join('');

    wrap.innerHTML = `
    <div class="modal">
      <h3>AI Model Selection</h3>
      <p class="subtitle">Choose the OpenAI model for headline neutralization. Higher-tier models cost more but may produce better results.</p>
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
   * Show long headline warning dialog
   */
  function showLongHeadlineDialog(elements, HOST, CFG) {
    return new Promise((resolve) => {
      const host = document.createElement('div');
      host.setAttribute(UI_ATTR, '');
      const shadow = host.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = `
      .wrap { position: fixed; inset: 0; z-index: 2147483647; background: rgba(0,0,0,.55);
              display: flex; align-items: center; justify-content: center; }
      .modal { background: #fff; max-width: 600px; width: 92%; border-radius: 12px;
               box-shadow: 0 10px 40px rgba(0,0,0,.4); padding: 20px; box-sizing: border-box; }
      .modal h3 { margin: 0 0 16px; font: 700 18px/1.3 system-ui, sans-serif; color: #1a1a1a; }
      .modal p { margin: 0 0 12px; font: 14px/1.6 system-ui, sans-serif; color: #444; }
      .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px;
                 margin: 16px 0; border-radius: 4px; }
      .warning-icon { font-size: 20px; margin-right: 8px; }
      .element-list { background: #f8f9fa; padding: 12px; border-radius: 6px; margin: 12px 0;
                      max-height: 200px; overflow-y: auto; }
      .element-item { font: 12px/1.5 ui-monospace, Consolas, monospace; color: #666;
                      margin: 6px 0; padding: 6px; background: #fff; border-radius: 4px; }
      .element-length { color: #d32f2f; font-weight: 600; }
      .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }
      .btn { padding: 10px 20px; border-radius: 8px; border: none;
             font: 600 14px system-ui, sans-serif; cursor: pointer; transition: all 0.15s ease; }
      .btn.primary { background: #1a73e8; color: #fff; }
      .btn.primary:hover { background: #1557b0; }
      .btn.success { background: #34a853; color: #fff; }
      .btn.success:hover { background: #2d8e47; }
      .btn.secondary { background: #e8eaed; color: #1a1a1a; }
      .btn.secondary:hover { background: #dadce0; }
    `;

      const wrap = document.createElement('div');
      wrap.className = 'wrap';

      const elementListHTML = elements.slice(0, 5).map(({ text, length }) => `
      <div class="element-item">
        <span class="element-length">${length} chars:</span> ${escapeHtml(text.substring(0, 80))}${text.length > 80 ? '...' : ''}
      </div>
    `).join('');

      const moreText = elements.length > 5 ? `<p style="text-align:center; font-size:12px; color:#666; margin-top:8px;">...and ${elements.length - 5} more</p>` : '';

      wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="Long Headlines Detected">
        <h3>⚠️ Excessively Long Headlines Detected</h3>

        <div class="warning">
          <span class="warning-icon">⚠️</span>
          <strong>Your manual selectors matched ${elements.length} element(s) with text longer than ${CFG.sanityCheckLen} characters.</strong>
        </div>

        <p>These might be entire paragraphs, navigation menus, or article bodies rather than headlines. Processing them will consume unnecessary API tokens.</p>

        <div class="element-list">
          ${elementListHTML}
          ${moreText}
        </div>

        <p><strong>Would you like to process these anyway?</strong></p>

        <div class="actions">
          <button class="btn secondary skip">Skip These</button>
          <button class="btn primary process-once">Process Once</button>
          <button class="btn success remember">Process & Remember for ${HOST}</button>
        </div>
      </div>
    `;

      shadow.append(style, wrap);
      document.body.appendChild(host);

      const close = (result) => {
        host.remove();
        resolve(result);
      };

      shadow.querySelector('.skip').addEventListener('click', () => close(false));
      shadow.querySelector('.process-once').addEventListener('click', () => close('once'));
      shadow.querySelector('.remember').addEventListener('click', () => close(true));

      wrap.addEventListener('click', e => { if (e.target === wrap) close(false); });
      shadow.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); close(false); } });

      wrap.setAttribute('tabindex', '-1');
      wrap.focus();
    });
  }

  /**
   * Show diff audit (stats and changes)
   */
  function showDiffAudit(STATS, CHANGES, CACHE, API_TOKENS, PRICING, calculateApiCost, escapeHtml, UI_ATTR) {
    const host = document.createElement('div');
    host.setAttribute(UI_ATTR, '');
    const shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
    .wrap { position:fixed; inset:0; z-index:2147483647; background:rgba(0,0,0,.45);
            display:flex; align-items:center; justify-content:center; }
    .modal { background:#fff; max-width:900px; width:94%; border-radius:10px;
             box-shadow:0 10px 40px rgba(0,0,0,.4); padding:14px; box-sizing:border-box; }
    h3, h4 { margin:0 0 8px; font:600 16px/1.2 system-ui,sans-serif; }
    h4 { font-size:14px; }
    .list { max-height:70vh; overflow:auto; }
    .row { border-top:1px solid #eee; padding:8px 2px; }
    .from { color:#666; }
    .to { color:#111; font-weight:600; }
    .meta { color:#888; font-size:11px; }
    .btn { padding:10px 16px; border-radius:6px; border:none;
           font:600 13px system-ui,sans-serif; cursor:pointer;
           background:#e8eaed; color:#1a1a1a; }
    .btn:hover { background:#dadce0; }
  `;
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    const modal = document.createElement('div');
    modal.className = 'modal';
    const list = document.createElement('div');
    list.className = 'list';

    const headlineCacheSize = Object.keys(CACHE).length;
    const totalInput = API_TOKENS.headlines.input;
    const totalOutput = API_TOKENS.headlines.output;
    const totalTokens = totalInput + totalOutput;
    const totalCalls = API_TOKENS.headlines.calls;
    const estimatedCost = calculateApiCost();

    modal.innerHTML = `
    <h3>Stats & Changes (this page)</h3>
    <div style="background:#f5f5f5;padding:10px;border-radius:6px;margin-bottom:12px;font-size:13px;">
      <strong>Cache Stats:</strong><br>
      Headlines cached: ${headlineCacheSize} entries<br>
    </div>
    <div style="background:#e8f4fd;padding:10px;border-radius:6px;margin-bottom:12px;font-size:13px;border-left:3px solid #1a73e8;">
      <strong>API Usage (since install):</strong><br>
      Total API calls: ${totalCalls.toLocaleString()}<br>
      Total tokens: ${totalTokens.toLocaleString()} (${totalInput.toLocaleString()} input, ${totalOutput.toLocaleString()} output)<br>
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid #ccc;color:#1557b0;font-weight:600">
        Estimated cost: ~$${estimatedCost.toFixed(4)}
      </div>
      <div style="margin-top:6px;font-size:11px;color:#666">
        Pricing: $${PRICING.inputPer1M} input / $${PRICING.outputPer1M} output per 1M tokens (${PRICING.model}, updated ${PRICING.lastUpdated})
      </div>
    </div>
    <h4 style="margin:0 0 8px">Headlines Changed</h4>
  `;

    if (!CHANGES.length) {
      const p = document.createElement('p');
      p.textContent = 'No recorded changes yet.';
      modal.appendChild(p);
    } else {
      CHANGES.forEach((ch, idx) => {
        const row = document.createElement('div');
        row.className = 'row';
        row.innerHTML = `
        <div class="meta">#${idx + 1} • ${ch.source} • ${ch.mode} • on ${ch.count} element(s)</div>
        <div class="from">– ${escapeHtml(ch.from)}</div>
        <div class="to">+ ${escapeHtml(ch.to)}</div>`;
        list.appendChild(row);
      });
      modal.appendChild(list);
    }
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;margin-top:8px;';
    const btnClose = document.createElement('button');
    btnClose.textContent = 'Close';
    btnClose.className = 'btn';
    actions.appendChild(btnClose);
    modal.appendChild(actions);
    wrap.appendChild(modal);
    shadow.append(style, wrap);
    document.body.appendChild(host);
    const close = () => host.remove();
    wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
    btnClose.addEventListener('click', () => close());
    shadow.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } });
    wrap.setAttribute('tabindex', '-1');
    wrap.focus();
  }

  /**
   * Badge UI creation and management
   */


  let badge = null;
  let badgeState = 'calmed'; // 'calmed' or 'originals'
  let isBadgeDragging = false;
  let badgeDragOffset = { x: 0, y: 0 };
  let boundOnBadgeDrag = null;
  let boundStopBadgeDrag = null;

  /**
   * Ensure badge exists and is rendered
   */
  function ensureBadge(DOMAIN_DISABLED, OPTED_OUT, SHOW_BADGE, BADGE_COLLAPSED, BADGE_POS, storage, enterInspectionMode, restoreOriginalsCallback, reapplyCallback) {
    if ((DOMAIN_DISABLED || OPTED_OUT) || !SHOW_BADGE) return;

    if (badge && badge.isConnected) return;

    badge = document.createElement('div');
    badge.className = 'neutralizer-badge';
    if (BADGE_COLLAPSED.value) badge.classList.add('collapsed');
    badge.setAttribute(UI_ATTR, '');

    const maxY = window.innerHeight - 200;
    BADGE_POS.y = Math.max(0, Math.min(BADGE_POS.y, maxY));

    badge.style.top = `${BADGE_POS.y}px`;
    badge.style.right = '0px';

    badge.innerHTML = `
    <div class="badge-handle" title="${BADGE_COLLAPSED.value ? 'Open' : 'Close'}">${BADGE_COLLAPSED.value ? '◀' : '▶'}</div>
    <div class="badge-header">NEUTRALIZE HEADLINES</div>
    <div class="badge-content">
      <div class="row">
        <button class="btn primary action">H: neutral</button>
      </div>
      <div class="row">
        <button class="btn inspect">Inspect</button>
      </div>
    </div>
  `;
    document.body.appendChild(badge);

    const header = badge.querySelector('.badge-header');
    const handle = badge.querySelector('.badge-handle');

    header.addEventListener('mousedown', (e) => startBadgeDrag(e, BADGE_COLLAPSED, BADGE_POS, storage));
    handle.addEventListener('click', () => toggleBadgeCollapse(storage, BADGE_COLLAPSED, BADGE_POS, badge));

    badge.querySelector('.action').addEventListener('click', () => onBadgeAction(restoreOriginalsCallback, reapplyCallback));
    badge.querySelector('.inspect').addEventListener('click', enterInspectionMode);
  }

  /**
   * Start dragging badge
   */
  function startBadgeDrag(e, BADGE_COLLAPSED, BADGE_POS, storage) {
    if (BADGE_COLLAPSED.value) return;

    isBadgeDragging = true;
    badge.classList.add('dragging');

    const rect = badge.getBoundingClientRect();
    badgeDragOffset.x = e.clientX - rect.left;
    badgeDragOffset.y = e.clientY - rect.top;

    boundOnBadgeDrag = (e) => onBadgeDrag(e, BADGE_POS);
    boundStopBadgeDrag = () => stopBadgeDrag(storage, BADGE_POS);

    document.addEventListener('mousemove', boundOnBadgeDrag);
    document.addEventListener('mouseup', boundStopBadgeDrag);

    e.preventDefault();
  }

  /**
   * Handle badge dragging
   */
  function onBadgeDrag(e, BADGE_POS) {
    if (!isBadgeDragging) return;

    let newX = e.clientX - badgeDragOffset.x;
    let newY = e.clientY - badgeDragOffset.y;

    const maxX = window.innerWidth - badge.offsetWidth;
    const maxY = window.innerHeight - badge.offsetHeight;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    badge.style.left = `${newX}px`;
    badge.style.top = `${newY}px`;

    BADGE_POS.x = newX;
    BADGE_POS.y = newY;
  }

  /**
   * Stop dragging badge
   */
  function stopBadgeDrag(storage, BADGE_POS) {
    if (!isBadgeDragging) return;

    isBadgeDragging = false;
    badge.classList.remove('dragging');

    if (boundOnBadgeDrag) {
      document.removeEventListener('mousemove', boundOnBadgeDrag);
      boundOnBadgeDrag = null;
    }
    if (boundStopBadgeDrag) {
      document.removeEventListener('mouseup', boundStopBadgeDrag);
      boundStopBadgeDrag = null;
    }

    storage.set(STORAGE_KEYS.BADGE_POS, JSON.stringify(BADGE_POS));
  }

  /**
   * Toggle badge collapsed state
   */
  async function toggleBadgeCollapse(storage, BADGE_COLLAPSED, BADGE_POS, badge) {
    BADGE_COLLAPSED.value = !BADGE_COLLAPSED.value;
    await storage.set(STORAGE_KEYS.BADGE_COLLAPSED, String(BADGE_COLLAPSED.value));

    const currentY = parseInt(badge.style.top) || BADGE_POS.y;

    if (BADGE_COLLAPSED.value) {
      badge.classList.add('collapsed');
      badge.style.left = '';
      badge.style.right = '0px';
      badge.style.top = `${currentY}px`;
    } else {
      badge.classList.remove('collapsed');
      badge.style.left = '';
      badge.style.right = '0px';
      badge.style.top = `${currentY}px`;

      BADGE_POS.x = 0;
      BADGE_POS.y = currentY;
      storage.set(STORAGE_KEYS.BADGE_POS, JSON.stringify(BADGE_POS));
    }

    const handle = badge.querySelector('.badge-handle');
    if (handle) {
      handle.title = BADGE_COLLAPSED.value ? 'Open' : 'Close';
      handle.textContent = BADGE_COLLAPSED.value ? '◀' : '▶';
    }
  }

  /**
   * Handle badge action button (toggle between neutral/original)
   */
  function onBadgeAction(restoreOriginals, reapplyFromCache) {
    if (badgeState === 'calmed') {
      restoreOriginals();
      badgeState = 'originals';
      badge.querySelector('.action').textContent = 'H: original';
    } else {
      reapplyFromCache();
      badgeState = 'calmed';
      badge.querySelector('.action').textContent = 'H: neutral';
    }
  }

  /**
   * Update badge counts (placeholder for future use)
   */
  function updateBadgeCounts() {
    // Counts display removed from badge
  }

  /**
   * Reapply cached rewrites to all elements
   */
  function reapplyFromCache(textToElements, cacheGet, buildMap, applyRewrites) {
    const freshSeenEl = new WeakSet();
    for (const [text, set] of textToElements.entries()) {
      const cached = cacheGet(text);
      if (cached) {
        applyRewrites(buildMap([text]), [text], [cached], 'cache', freshSeenEl);
      }
    }
  }

  /**
   * Inspection mode functionality for debugging headline detection
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
      const hasMeaningfulAttrs = el.hasAttribute('title') || el.hasAttribute('alt') ||
        el.hasAttribute('data-neutralizer-original');

      const isContentElement = /^(H[1-6]|P|SPAN|A|DIV)$/i.test(el.tagName);
      const hasTextContent = el.textContent.trim().length > 0;

      if (hasDirectText || matchesSelector || hasMeaningfulAttrs ||
        (isContentElement && hasTextContent && el.children.length === 0)) {
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
    background: #1a73e8; color: white; padding: 12px 24px;
    border-radius: 8px; font-size: 14px; font-weight: 600;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 2147483646;
    pointer-events: none;
  `;
    message.textContent = '🔍 Inspection Mode - Click any element to analyze. ESC to exit.';

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
        currentHighlight.style.outline = '2px dashed #1a73e8';
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
   * Diagnose element for headline detection
   */
  function diagnoseElement(el, SELECTORS_GLOBAL, SELECTORS_DOMAIN, EXCLUDE_GLOBAL, EXCLUDE_DOMAIN, EXCLUDE) {
    const text = textTrim(el);
    const selector = generateCSSSelector(el);

    const autoDetect = {
      matched: false,
      reasons: []
    };

    if (el.closest(`[${UI_ATTR}]`)) {
      autoDetect.reasons.push('Part of script\'s own UI');
    } else if (el.closest('input, textarea, [contenteditable=""], [contenteditable="true"]')) {
      autoDetect.reasons.push('Editable element (input/textarea)');
    } else {
      const cardParent = el.closest(CARD_SELECTOR);
      if (cardParent) autoDetect.reasons.push('✓ Inside card/article container');

      const tag = el.tagName.toLowerCase();
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'].includes(tag)) {
        autoDetect.reasons.push(`✓ Headline tag: <${tag}>`);
      }

      if (withinLen(text)) {
        autoDetect.reasons.push(`✓ Length OK (${text.length} chars)`);
      } else {
        autoDetect.reasons.push(`✗ Length ${text.length} chars (need ${CFG.minLen}-${CFG.maxLen})`);
      }

      if (isLikelyKicker(el, text)) {
        autoDetect.reasons.push('✗ Detected as kicker/label (excluded)');
      }

      if (el.closest(UI_CONTAINERS)) {
        autoDetect.reasons.push('✗ Inside UI container (meta/byline/tools)');
      }

      autoDetect.matched = cardParent && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'].includes(tag) &&
        withinLen(text) && !isLikelyKicker(el, text) && !el.closest(UI_CONTAINERS);
    }

    const globalSelectors = findMatchingSelectors(el, SELECTORS_GLOBAL);
    const domainSelectors = findMatchingSelectors(el, SELECTORS_DOMAIN);
    const globalExclusions = findMatchingExclusions(el, EXCLUDE_GLOBAL);
    const domainExclusions = findMatchingExclusions(el, EXCLUDE_DOMAIN);

    const hasOptOut = document.querySelector('meta[name="neutralizer"][content="opt-out"]') !== null;
    const isProcessed = !isExcluded(el, EXCLUDE) && (autoDetect.matched || globalSelectors.length > 0 || domainSelectors.length > 0);

    return {
      element: el,
      selector,
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      tag: el.tagName.toLowerCase(),
      classes: Array.from(el.classList).join(' '),
      id: el.id,
      autoDetect,
      globalSelectors,
      domainSelectors,
      globalExclusions,
      domainExclusions,
      hasOptOut,
      isExcluded: isExcluded(el, EXCLUDE),
      isProcessed
    };
  }

  /**
   * Find matching selectors
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
   * Find matching exclusions
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
   * Generate CSS selector for element
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
    .btn.primary { background: #1a73e8; color: #fff; }
    .btn.primary:hover { background: #1557b0; }
    .btn.secondary { background: #e8eaed; color: #1a1a1a; }
    .btn.secondary:hover { background: #dadce0; }
    .btn.success { background: #34a853; color: #fff; }
    .btn.success:hover { background: #2d8e47; }
    .btn.danger { background: #ea4335; color: #fff; }
    .btn.danger:hover { background: #d33426; }
  `;

    const wrap = document.createElement('div');
    wrap.className = 'wrap';

    let statusClass, statusText;
    if (diag.isExcluded) {
      statusClass = 'excluded';
      statusText = '⚠️ EXCLUDED - Not being processed';
    } else if (diag.isProcessed) {
      statusClass = 'processed';
      statusText = '✅ MATCHED - Being processed';
    } else {
      statusClass = 'not-processed';
      statusText = '❌ NOT MATCHED - Not being processed';
    }

    const autoDetectHTML = diag.autoDetect.reasons.length > 0 ?
      `<ul class="list">${diag.autoDetect.reasons.map(r => `<li class="${r.startsWith('✓') ? 'match' : 'no-match'}">${r}</li>`).join('')}</ul>` :
      '<p class="info-row">No auto-detection analysis available.</p>';

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
      <h3>🔍 Element Inspection</h3>

      <div class="section">
        <div class="section-title">Element Information</div>
        <div class="info-row"><span class="info-label">Tag:</span> &lt;${diag.tag}&gt;</div>
        <div class="info-row"><span class="info-label">ID:</span> ${diag.id || '(none)'}</div>
        <div class="info-row"><span class="info-label">Classes:</span> ${diag.classes || '(none)'}</div>
        <div class="info-row"><span class="info-label">Text:</span> "${escapeHtml(diag.text)}"</div>
        <div class="info-row"><span class="info-label">CSS Selector:</span> <span class="code">${escapeHtml(diag.selector)}</span></div>
      </div>

      <div class="status ${statusClass}">${statusText}</div>

      <div class="section">
        <div class="section-title">Auto-Detection Analysis</div>
        ${autoDetectHTML}
      </div>

      <div class="section">
        <div class="section-title">Global Selectors</div>
        ${globalSelectorsHTML}
      </div>

      <div class="section">
        <div class="section-title">Domain Selectors (${HOST})</div>
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

      ${diag.hasOptOut ? '<div class="section"><div class="section-title">⚠️ Publisher Opt-Out Detected</div><p class="info-row">This page has requested to opt-out from neutralization.</p></div>' : ''}

      <div class="actions">
        ${buildActionButtons(diag)}
        <button class="btn secondary copy-selector">📋 Copy Selector</button>
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

    if (diag.globalExclusions.self.length > 0) {
      diag.globalExclusions.self.forEach(sel => {
        buttons.push(`<button class="btn danger remove-global-excl-self" data-selector="${escapeHtml(sel)}">Remove Global Exclusion: ${escapeHtml(sel)}</button>`);
      });
    }
    if (diag.globalExclusions.ancestors.length > 0) {
      diag.globalExclusions.ancestors.forEach(sel => {
        buttons.push(`<button class="btn danger remove-global-excl-anc" data-selector="${escapeHtml(sel)}">Remove Global Ancestor Exclusion: ${escapeHtml(sel)}</button>`);
      });
    }

    if (diag.domainExclusions.self?.length > 0) {
      diag.domainExclusions.self.forEach(sel => {
        buttons.push(`<button class="btn danger remove-domain-excl-self" data-selector="${escapeHtml(sel)}">Remove Domain Exclusion: ${escapeHtml(sel)}</button>`);
      });
    }
    if (diag.domainExclusions.ancestors?.length > 0) {
      diag.domainExclusions.ancestors.forEach(sel => {
        buttons.push(`<button class="btn danger remove-domain-excl-anc" data-selector="${escapeHtml(sel)}">Remove Domain Ancestor Exclusion: ${escapeHtml(sel)}</button>`);
      });
    }

    if (!diag.isProcessed && !diag.isExcluded) {
      buttons.push(`<button class="btn success add-global-sel">Add as Global Selector</button>`);
      buttons.push(`<button class="btn success add-domain-sel">Add as Domain Selector</button>`);
    }

    return buttons.join('');
  }

  /**
   * Attach action handlers for diagnostic dialog
   */
  function attachActionHandlers(shadow, diag, closeDialog, storage, DOMAIN_SELECTORS, DOMAIN_EXCLUDES, HOST, SELECTORS_GLOBAL, EXCLUDE_GLOBAL, openInfo) {
    // Remove global exclusions
    shadow.querySelectorAll('.remove-global-excl-self').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sel = btn.getAttribute('data-selector');
        EXCLUDE_GLOBAL.self = EXCLUDE_GLOBAL.self.filter(s => s !== sel);
        await storage.set(STORAGE_KEYS.EXCLUDES, JSON.stringify(EXCLUDE_GLOBAL));
        openInfo(`Removed global exclusion: ${sel}\nReload the page to see changes.`);
        closeDialog();
      });
    });

    shadow.querySelectorAll('.remove-global-excl-anc').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sel = btn.getAttribute('data-selector');
        EXCLUDE_GLOBAL.ancestors = EXCLUDE_GLOBAL.ancestors.filter(s => s !== sel);
        await storage.set(STORAGE_KEYS.EXCLUDES, JSON.stringify(EXCLUDE_GLOBAL));
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
        openInfo(`Removed domain exclusion: ${sel}\nReload the page to see changes.`);
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
        openInfo(`Removed domain ancestor exclusion: ${sel}\nReload the page to see changes.`);
        closeDialog();
      });
    });

    shadow.querySelectorAll('.add-global-sel').forEach(btn => {
      btn.addEventListener('click', async () => {
        SELECTORS_GLOBAL.push(diag.selector);
        await storage.set(STORAGE_KEYS.SELECTORS, JSON.stringify(SELECTORS_GLOBAL));
        openInfo(`Added global selector: ${diag.selector}\nReload the page to see changes.`);
        closeDialog();
      });
    });

    shadow.querySelectorAll('.add-domain-sel').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!DOMAIN_SELECTORS[HOST]) DOMAIN_SELECTORS[HOST] = [];
        DOMAIN_SELECTORS[HOST].push(diag.selector);
        await storage.set(STORAGE_KEYS.DOMAIN_SELECTORS, JSON.stringify(DOMAIN_SELECTORS));
        openInfo(`Added domain selector: ${diag.selector}\nReload the page to see changes.`);
        closeDialog();
      });
    });
  }

  // ==UserScript==
  // @name         Neutralize Headlines
  // @namespace    https://fanis.dev/userscripts
  // @author       Fanis Hatzidakis
  // @license      PolyForm-Internal-Use-1.0.0; https://polyformproject.org/licenses/internal-use/1.0.0/
  // @version      2.2.0
  // @description  Tone down sensationalist titles via OpenAI API. Auto-detect + manual selectors, exclusions, per-domain configs, domain allow/deny, caching, Android-safe storage.
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
  // ==/UserScript==


  (async () => {
    
    // Only run in top-level window, not in iframes
    if (window.self !== window.top) {
        return;
    }  

    const HOST = location.hostname;
    const storage = new Storage();

    // Stats tracking
    const STATS = { total: 0, live: 0, cache: 0, batches: 0 };
    const CHANGES = [];

    // Prevent multiple API key dialogs
    let apiKeyDialogShown = { value: false };

    // Initialize API tracking
    await initApiTracking(storage);

    // Load toggles
    try { const v = await storage.get(STORAGE_KEYS.DEBUG, ''); if (v !== '') CFG.DEBUG = (v === true || v === 'true'); } catch {}
    try { const v = await storage.get(STORAGE_KEYS.AUTO_DETECT, ''); if (v !== '') CFG.autoDetect = (v === true || v === 'true'); } catch {}
    try { const v = await storage.get(STORAGE_KEYS.SHOW_ORIG, ''); if (v !== '') CFG.showOriginalOnHover = (v === true || v === 'true'); } catch {}

    let SHOW_BADGE = true;
    try { const v = await storage.get(STORAGE_KEYS.SHOW_BADGE, ''); if (v !== '') SHOW_BADGE = (v === true || v === 'true'); } catch {}

    let BADGE_COLLAPSED = { value: false };
    try { const v = await storage.get(STORAGE_KEYS.BADGE_COLLAPSED, ''); if (v !== '') BADGE_COLLAPSED.value = (v === true || v === 'true'); } catch {}

    let BADGE_POS = { x: window.innerWidth - 220, y: window.innerHeight - 200 };
    try { const v = await storage.get(STORAGE_KEYS.BADGE_POS, ''); if (v) BADGE_POS = JSON.parse(v); } catch {}

    // Load temperature setting
    let TEMPERATURE_LEVEL = 'Moderate';
    try {
      const v = await storage.get(STORAGE_KEYS.TEMPERATURE, '');
      if (v !== '' && TEMPERATURE_LEVELS[v] !== undefined) {
        TEMPERATURE_LEVEL = v;
        CFG.temperature = TEMPERATURE_LEVELS[v];
      }
    } catch {}

    // Load model setting
    try {
      const v = await storage.get(STORAGE_KEYS.MODEL, '');
      if (v !== '' && MODEL_OPTIONS[v]) {
        CFG.model = v;
      }
    } catch {}

    // Settings functions
    async function setDebug(on) { CFG.DEBUG = !!on; await storage.set(STORAGE_KEYS.DEBUG, String(CFG.DEBUG)); location.reload(); }
    async function setAutoDetect(on) { CFG.autoDetect = !!on; await storage.set(STORAGE_KEYS.AUTO_DETECT, String(CFG.autoDetect)); location.reload(); }
    async function setShowBadge(on) { SHOW_BADGE = !!on; await storage.set(STORAGE_KEYS.SHOW_BADGE, String(SHOW_BADGE)); location.reload(); }
    async function setTemperature(level) {
      if (TEMPERATURE_LEVELS[level] === undefined) return;
      TEMPERATURE_LEVEL = level;
      CFG.temperature = TEMPERATURE_LEVELS[level];
      await storage.set(STORAGE_KEYS.TEMPERATURE, level);
      location.reload();
    }
    async function setModel(modelId) {
      if (!MODEL_OPTIONS[modelId]) return;
      CFG.model = modelId;
      await storage.set(STORAGE_KEYS.MODEL, modelId);
      // Update pricing to match selected model
      const modelConfig = MODEL_OPTIONS[modelId];
      await updatePricing(storage, {
        model: modelConfig.name,
        inputPer1M: modelConfig.inputPer1M,
        outputPer1M: modelConfig.outputPer1M
      });
      // Clear cache when model changes
      await cache.clear();
    }

    // Domain mode + lists
    let DOMAINS_MODE = 'deny';
    let DOMAIN_DENY = [];
    let DOMAIN_ALLOW = [];

    // Load persisted data
    let SELECTORS_GLOBAL = DEFAULT_SELECTORS.slice();
    let EXCLUDE_GLOBAL = { ...DEFAULT_EXCLUDES, ancestors: [...DEFAULT_EXCLUDES.ancestors] };
    let DOMAIN_SELECTORS = {};
    let DOMAIN_EXCLUDES = {};
    let LONG_HEADLINE_EXCEPTIONS = {};

    try { SELECTORS_GLOBAL = JSON.parse(await storage.get(STORAGE_KEYS.SELECTORS, JSON.stringify(DEFAULT_SELECTORS))); } catch {}
    try { EXCLUDE_GLOBAL = JSON.parse(await storage.get(STORAGE_KEYS.EXCLUDES, JSON.stringify(DEFAULT_EXCLUDES))); } catch {}
    try { DOMAIN_SELECTORS = JSON.parse(await storage.get(STORAGE_KEYS.DOMAIN_SELECTORS, '{}')); } catch {}
    try { DOMAIN_EXCLUDES = JSON.parse(await storage.get(STORAGE_KEYS.DOMAIN_EXCLUDES, '{}')); } catch {}
    try { LONG_HEADLINE_EXCEPTIONS = JSON.parse(await storage.get(STORAGE_KEYS.LONG_HEADLINE_EXCEPTIONS, '{}')); } catch {}

    // Load domain-specific settings for current host
    let SELECTORS_DOMAIN = DOMAIN_SELECTORS[HOST] || [];
    let EXCLUDE_DOMAIN = DOMAIN_EXCLUDES[HOST] || { self: [], ancestors: [] };

    // Merge global + domain-specific
    let SELECTORS = [...new Set([...SELECTORS_GLOBAL, ...SELECTORS_DOMAIN])];
    let EXCLUDE = {
      self: [...new Set([...EXCLUDE_GLOBAL.self, ...EXCLUDE_DOMAIN.self])],
      ancestors: [...new Set([...EXCLUDE_GLOBAL.ancestors, ...EXCLUDE_DOMAIN.ancestors])]
    };

    if (SELECTORS_DOMAIN.length > 0 || EXCLUDE_DOMAIN.self.length > 0 || EXCLUDE_DOMAIN.ancestors.length > 0) {
      log('domain-specific additions for', HOST, ':', { selectors: SELECTORS_DOMAIN, excludes: EXCLUDE_DOMAIN });
    }

    try { DOMAINS_MODE = await storage.get(STORAGE_KEYS.DOMAINS_MODE, 'deny'); } catch {}
    try { DOMAIN_DENY = JSON.parse(await storage.get(STORAGE_KEYS.DOMAINS_DENY, JSON.stringify(DOMAIN_DENY))); } catch {}
    try { DOMAIN_ALLOW = JSON.parse(await storage.get(STORAGE_KEYS.DOMAINS_ALLOW, JSON.stringify(DOMAIN_ALLOW))); } catch {}

    // Initialize cache
    const cache = new HeadlineCache(storage, CFG, log);
    await cache.init(HOST);

    // Publisher opt-out
    function publisherOptOut() {
      const m1 = document.querySelector('meta[name="neutralizer"][content="no-transform" i]');
      const m2 = document.querySelector('meta[http-equiv="X-Content-Transform"][content="none" i]');
      return !!(m1 || m2);
    }
    const OPTED_OUT = publisherOptOut();
    if (OPTED_OUT) log('publisher opt-out detected; disabling.');

    // Domain matching
    function computeDomainDisabled(host) {
      if (DOMAINS_MODE === 'allow') return !listMatchesHost(DOMAIN_ALLOW, host);
      return listMatchesHost(DOMAIN_DENY, host);
    }
    let DOMAIN_DISABLED = computeDomainDisabled(HOST);
    if (DOMAIN_DISABLED) log('domain disabled by list:', HOST, 'mode=', DOMAINS_MODE);

    // Data structures
    let seenEl = new WeakSet();
    const textToElements = new Map();
    let IO = null;
    const pending = new Set();
    let flushTimer = null;
    let longHeadlineCheckPending = false;

    function ensureObserver() {
      if (IO || !CFG.visibleOnly) return;
      IO = new IntersectionObserver(onIntersect, { root: null, rootMargin: CFG.rootMargin, threshold: CFG.threshold });
    }
    function observerObserve(el) { if (CFG.visibleOnly) { ensureObserver(); IO.observe(el); } }

    function onIntersect(entries) {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        IO.unobserve(el);
        if (isExcluded(el, EXCLUDE)) continue;
        const text = textTrim(el);

        const cached = cache.get(text);
        if (cached) { applyRewrites(buildMap([text]), [text], [cached], 'cache', STATS, CHANGES, seenEl); continue; }
        if (!pending.has(text)) pending.add(text);
      }
      scheduleFlush();
    }

    function scheduleFlush() { if (!flushTimer) flushTimer = setTimeout(flushPending, CFG.flushDelayMs); }

    function buildMap(texts) {
      const map = new Map();
      for (const t of texts) { const set = textToElements.get(t); if (set && set.size) map.set(t, [...set]); }
      return map;
    }

    async function flushPending() {
      const toSend = [];
      for (const t of pending) { if (!cache.get(t)) toSend.push(t); pending.delete(t); if (toSend.length === CFG.maxBatch) break; }
      flushTimer = null;
      if (!toSend.length) return;

      try {
        log('calling OpenAI for visible batch size', toSend.length);
        const rewrites = await rewriteBatch(storage, toSend);
        for (let i = 0; i < toSend.length; i++) cache.set(toSend[i], rewrites[i] ?? toSend[i]);
        applyRewrites(buildMap(toSend), toSend, rewrites, 'live', STATS, CHANGES, seenEl, updateBadgeCounts);
        STATS.batches++;
        log(`[stats] batches=${STATS.batches} total=${STATS.total} (live=${STATS.live}, cache=${STATS.cache})`);
      } catch (e) {
        console.error('error:', e);
        friendlyApiError(e);
      }
      if (pending.size) scheduleFlush();
    }

    function friendlyApiError(err) {
      const s = err?.status || 0;
      if (s === 401) { openKeyDialog(storage, 'Unauthorized (401). Please enter a valid OpenAI key.', apiKeyDialogShown); return; }
      if (s === 429) { openInfo('Rate limited by API (429). Try again in a minute. You can also lower maxBatch or enable visible-only to reduce burst.'); return; }
      if (s === 400) { openInfo('Bad request (400). The page may contain text the API could not parse. Try again, or disable auto-detect for this site and use narrower selectors.'); return; }
      openInfo(`Unknown error${s ? ' (' + s + ')' : ''}. Check your network or try again.`);
    }

    // Attach targets
    async function attachTargets(root = document) {
      const candidates = getCandidateElements(root, SELECTORS, EXCLUDE)
        .map(({ el, mode }) => ({ el: findTextHost(el), mode }))
        .filter(({ el, mode }) => {
          if (!el || seenEl.has(el) || isExcluded(el, EXCLUDE)) return false;
          if (mode === 'auto' && !withinLen(textTrim(el))) return false;
          return true;
        });

      const excessivelyLong = [];
      const hostsToAttach = [];

      for (const { el: host, mode } of candidates) {
        const text = textTrim(host);

        if (mode === 'manual' && text.length > CFG.sanityCheckLen && !LONG_HEADLINE_EXCEPTIONS[HOST]) {
          excessivelyLong.push({ host, text, length: text.length });
        } else {
          hostsToAttach.push({ host, mode, text });
        }
      }

      if (excessivelyLong.length > 0 && !longHeadlineCheckPending) {
        longHeadlineCheckPending = true;
        const result = await showLongHeadlineDialog(excessivelyLong, HOST, CFG);
        longHeadlineCheckPending = false;

        if (result) {
          for (const { host, text } of excessivelyLong) {
            hostsToAttach.push({ host, mode: 'manual', text });
          }

          if (result === true) {
            LONG_HEADLINE_EXCEPTIONS[HOST] = true;
            await storage.set(STORAGE_KEYS.LONG_HEADLINE_EXCEPTIONS, JSON.stringify(LONG_HEADLINE_EXCEPTIONS));
          }
        }
      }

      for (const { host, mode, text } of hostsToAttach) {
        host.setAttribute('data-neutralizer-mode', mode);
        let set = textToElements.get(text);
        if (!set) { set = new Set(); textToElements.set(text, set); }
        set.add(host);
        observerObserve(host);
      }
    }

    function processVisibleNow() {
      for (const [text, set] of textToElements.entries()) {
        if (cache.get(text)) continue;
        const el = set.values().next().value;
        if (!el) continue;
        if (CFG.visibleOnly ? isInViewportWithMargin(el) : true) pending.add(text);
      }
      scheduleFlush();
    }

    function resetAndReindex() {
      pending.clear(); if (flushTimer) clearTimeout(flushTimer); flushTimer = null;
      textToElements.clear(); seenEl = new WeakSet();
      if (IO) { IO.disconnect(); IO = null; }
      if (!(DOMAIN_DISABLED || OPTED_OUT)) { ensureObserver(); attachTargets(document); }
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
    GM_registerMenuCommand?.(`AI model (${MODEL_OPTIONS[CFG.model]?.name || CFG.model})`, () => openModelSelectionDialog(storage, CFG.model, setModel));

    GM_registerMenuCommand?.('Edit GLOBAL target selectors', () => {
      openEditor({
        title: 'Global target selectors (all domains)',
        mode: 'list',
        initial: SELECTORS_GLOBAL,
        hint: 'One CSS selector per line (e.g., h1, h2, h3, .lead). Applied to all domains.',
        onSave: async (lines) => {
          const clean = lines.filter(Boolean).map(s => s.trim()).filter(Boolean);
          SELECTORS_GLOBAL = clean.length ? clean : DEFAULT_SELECTORS.slice();
          await storage.set(STORAGE_KEYS.SELECTORS, JSON.stringify(SELECTORS_GLOBAL));
          location.reload();
        }
      });
    });

    GM_registerMenuCommand?.('Edit GLOBAL excludes: elements (self)', () => {
      openEditor({
        title: 'Global excluded elements (all domains)',
        mode: 'list',
        initial: EXCLUDE_GLOBAL.self || [],
        hint: 'One CSS selector per line (e.g., .sponsored, .ad-title). Applied to all domains.',
        onSave: async (lines) => {
          EXCLUDE_GLOBAL.self = lines;
          await storage.set(STORAGE_KEYS.EXCLUDES, JSON.stringify(EXCLUDE_GLOBAL));
          location.reload();
        }
      });
    });

    GM_registerMenuCommand?.('Edit GLOBAL excludes: containers (ancestors)', () => {
      openEditor({
        title: 'Global excluded containers (all domains)',
        mode: 'list',
        initial: EXCLUDE_GLOBAL.ancestors || [],
        hint: 'One per line (e.g., header, footer, nav, aside). Applied to all domains.',
        onSave: async (lines) => {
          EXCLUDE_GLOBAL.ancestors = lines;
          await storage.set(STORAGE_KEYS.EXCLUDES, JSON.stringify(EXCLUDE_GLOBAL));
          location.reload();
        }
      });
    });

    GM_registerMenuCommand?.(`Edit DOMAIN additions: target selectors (${HOST})`, () => {
      openEditor({
        title: `Domain-specific target selectors for ${HOST}`,
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

    GM_registerMenuCommand?.(`Edit DOMAIN additions: excludes elements (${HOST})`, () => {
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

    GM_registerMenuCommand?.(`Edit DOMAIN additions: excludes containers (${HOST})`, () => {
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

    GM_registerMenuCommand?.('--- Toggles ---', () => {});
    GM_registerMenuCommand?.(`Neutralization strength (${TEMPERATURE_LEVEL})`, () => openTemperatureDialog(storage, TEMPERATURE_LEVEL, setTemperature));
    GM_registerMenuCommand?.(`Toggle auto-detect (${CFG.autoDetect ? 'ON' : 'OFF'})`, async () => { await setAutoDetect(!CFG.autoDetect); });
    GM_registerMenuCommand?.(`Toggle DEBUG logs (${CFG.DEBUG ? 'ON' : 'OFF'})`, async () => { await setDebug(!CFG.DEBUG); });
    GM_registerMenuCommand?.(`Toggle badge (${SHOW_BADGE ? 'ON' : 'OFF'})`, async () => { await setShowBadge(!SHOW_BADGE); });

    GM_registerMenuCommand?.('--- Actions ---', () => {});
    GM_registerMenuCommand?.('Show stats & changes (diff audit)', () => showDiffAudit(STATS, CHANGES, cache.cache, API_TOKENS, PRICING, calculateApiCost, escapeHtml, UI_ATTR));
    GM_registerMenuCommand?.('Process visible now', () => { processVisibleNow(); });
    GM_registerMenuCommand?.('Flush headline cache & rerun', async () => { await cache.clear(); resetAndReindex(); processVisibleNow(); });
    if (LONG_HEADLINE_EXCEPTIONS[HOST]) {
      GM_registerMenuCommand?.(`Clear long headline exception (${HOST})`, async () => {
        if (confirm(`Clear the long headline exception for ${HOST}?\n\nYou'll be prompted again if selectors match text longer than ${CFG.sanityCheckLen} characters.`)) {
          delete LONG_HEADLINE_EXCEPTIONS[HOST];
          await storage.set(STORAGE_KEYS.LONG_HEADLINE_EXCEPTIONS, JSON.stringify(LONG_HEADLINE_EXCEPTIONS));
          openInfo(`Cleared long headline exception for ${HOST}.\n\nReload the page to see changes.`);
        }
      });
    }
    GM_registerMenuCommand?.('Reset stats counters', () => { STATS.total = STATS.live = STATS.cache = STATS.batches = 0; CHANGES.length = 0; });
    GM_registerMenuCommand?.('Reset API usage stats', async () => { await resetApiTokens(storage); openInfo('API usage stats reset. Token counters and cost tracking cleared.'); });

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
        openWelcomeDialog(storage, openEditor, openInfo);
      }, 500);
      return;
    }

    if (!hasApiKey) {
      log('No API key configured. Script inactive. Set API key via menu.');
      return;
    }

    if (DOMAIN_DISABLED || OPTED_OUT) {
      log('inactive:', OPTED_OUT ? 'publisher opt-out' : 'domain disabled');
      return;
    }

    ensureHighlightCSS();
    ensureBadge(
      DOMAIN_DISABLED,
      OPTED_OUT,
      SHOW_BADGE,
      BADGE_COLLAPSED,
      BADGE_POS,
      storage,
      () => enterInspectionMode(SELECTORS, HOST, SELECTORS_GLOBAL, SELECTORS_DOMAIN, EXCLUDE_GLOBAL, EXCLUDE_DOMAIN, EXCLUDE, storage, DOMAIN_SELECTORS, DOMAIN_EXCLUDES, openInfo),
      restoreOriginals,
      () => reapplyFromCache(
        textToElements,
        (t) => cache.get(t),
        buildMap,
        (map, originals, rewrites, source, freshSeenEl) => applyRewrites(map, originals, rewrites, source, STATS, CHANGES, freshSeenEl)
      )
    );
    attachTargets(document);
    ensureObserver();

    const mo = new MutationObserver((muts) => {
      ensureBadge(
        DOMAIN_DISABLED,
        OPTED_OUT,
        SHOW_BADGE,
        BADGE_COLLAPSED,
        BADGE_POS,
        storage,
        () => enterInspectionMode(SELECTORS, HOST, SELECTORS_GLOBAL, SELECTORS_DOMAIN, EXCLUDE_GLOBAL, EXCLUDE_DOMAIN, EXCLUDE, storage, DOMAIN_SELECTORS, DOMAIN_EXCLUDES, openInfo),
        restoreOriginals,
        () => reapplyFromCache(
          textToElements,
          (t) => cache.get(t),
          buildMap,
          (map, originals, rewrites, source, freshSeenEl) => applyRewrites(map, originals, rewrites, source, STATS, CHANGES, freshSeenEl)
        )
      );
      for (const m of muts) {
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1) attachTargets(n);
          });
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    processVisibleNow();
  })();

})();
