// ==UserScript==
// @name         BACKGROUND WEB OPTIMIZER (Ultra Performance) - v10.0 Optimized
// @namespace    http://gemini/
// @version      10.0
// @description  Extreme performance optimization using a unified blocker, MutationObserver for SPAs, idle tasks, and more efficient caching.
// @author       Gugu8
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550646/BACKGROUND%20WEB%20OPTIMIZER%20%28Ultra%20Performance%29%20-%20v100%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/550646/BACKGROUND%20WEB%20OPTIMIZER%20%28Ultra%20Performance%29%20-%20v100%20Optimized.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Basic safety guard: only top window
  try { if (window.top !== window.self) return; } catch (e) {}

  // --- Core identifiers ---
  const CONFIG_KEY = 'gemini_optimizer_config_v10';
  const CONFIG_VERSION = 10;
  const CACHE_NAME = 'gemini-ultra-cache-v10';
  const CACHE_META_KEY = 'gemini_ultra_cache_meta_v10';

  // --- 1) Granular Network Blocking: Fast host checks ---
  const BLOCKED_PATTERNS = [
    'google-analytics.com', 'googletagmanager.com', 'facebook.net', 'doubleclick.net',
    'hotjar.com', 'sentry.io', 'addthis.com', 'sharethis.com', 'segment.com',
    'optimizely.com', 'mixpanel.com', 'amplitude.com', 'newrelic.com',
    'amazon-adsystem.com', 'googlesyndication.com', 'scorecardresearch.com',
    'quantserve.com', 'outbrain.com', 'taboola.com'
  ];
  const BLOCKED_HOSTS_SET = new Set(BLOCKED_PATTERNS);

  // Simple host-based matcher (fast path, scalable)
  function matchesBlocked(url) {
    if (!url) return false;
    try {
      const host = (new URL(url, location.origin)).hostname;
      if (BLOCKED_HOSTS_SET.has(host)) return true;
      // Suffix matching (subdomains)
      for (const pat of BLOCKED_PATTERNS) {
        if (host === pat || host.endsWith(`.${pat}`)) return true;
      }
    } catch {
      // ignore
    }
    return false;
  }

  // --- 3) Advanced Memory Leak Prevention helpers (with Debounced Save) ---
  class TTLCacheStore {
    constructor(storageKey = CACHE_META_KEY) {
      this.storageKey = storageKey;
      this.saveTimeout = null;
      this._load();
    }
    _load() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        this.map = raw ? JSON.parse(raw) : {};
      } catch { this.map = {}; }
    }
    _save() {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => {
        try { localStorage.setItem(this.storageKey, JSON.stringify(this.map)); } catch {}
      }, 500);
    }
    get(url) {
      const rec = this.map[url];
      if (!rec) return null;
      if (Date.now() > rec.expiry) {
        delete this.map[url];
        this._save();
        return null;
      }
      return rec;
    }
    set(url, ttl) {
      this.map[url] = { expiry: Date.now() + (ttl || 600000) };
      this._save();
    }
    delete(url) {
      delete this.map[url];
      this._save();
    }
    clear() {
      this.map = {};
      this._save();
    }
  }

  // --- 4) Selector Cache (Selective DOM optimization) ---
  class SelectorCache {
    constructor() { this.cache = new Map(); this.ttlMs = 30000; }
    queryAll(sel) {
      const t = Date.now();
      if (this.cache.has(sel)) {
        const { value, time } = this.cache.get(sel);
        if (t - time < this.ttlMs) return value;
      }
      const value = Array.from(document.querySelectorAll(sel));
      this.cache.set(sel, { value, time: t });
      return value;
    }
    clear() { this.cache.clear(); }
  }

  // --- 6) Dynamic Font Loading (Font Loading API) ---
  class DynamicFontLoader {
    constructor() { this.loaded = false; }
    loadFromCSS() {
      if (this.loaded) return;
      try {
        for (const sheet of document.styleSheets) {
          let rules;
          try { rules = sheet.cssRules; } catch { continue; }
          if (!rules) continue;
          for (const r of rules) {
            if (r.type === CSSRule.FONT_FACE_RULE) {
              const family = r.style.getPropertyValue('font-family');
              const src = r.style.getPropertyValue('src');
              if (family && src) {
                try {
                  const f = new FontFace(family.replace(/['"]/g, ''), src);
                  f.load().then(loaded => { document.fonts.add(loaded); }).catch(() => {});
                } catch {}
              }
            }
          }
        }
      } catch { /* ignore cross-origin */ }
      this.loaded = true;
    }
  }

  // --- 7) Web Worker for Heavy Tasks (parse large HTML-ish data in a worker) ---
  class WorkerManager {
    constructor() {
      this.worker = null;
      this.nextId = 1;
      this.callbacks = new Map();
      this._initWorker();
    }
    _initWorker() {
      if (typeof Worker === 'undefined') return;
      const code = `
        self.onmessage = function(e) {
          const { id, type, payload } = e.data || {};
          if (type === 'parseHTML') {
            const html = payload || '';
            // Naive extraction of hrefs
            const urls = (html.match(/href\\s*=\\s*["']([^"']+)["']/gi) || [])
              .map(s => s.match(/["']([^""]+)["']/)[1] || s.replace(/href\\s*=\\s*["']/, ''))
              .filter(u => !!u);
            const uniq = Array.from(new Set(urls)).slice(0, 150);
            self.postMessage({ id, urls: uniq });
          } else {
            self.postMessage({ id, result: null });
          }
        };
      `;
      try {
        const blob = new Blob([code], { type: 'application/javascript' });
        const blobURL = URL.createObjectURL(blob);
        this.worker = new Worker(blobURL);
        this.worker.onmessage = (evt) => {
          const { id, urls } = evt.data;
          const cb = this.callbacks.get(id);
          if (cb) cb(urls);
          this.callbacks.delete(id);
        };
      } catch (e) {
        console.error('[Gemini Ultra] Web Worker init failed:', e);
        this.worker = null;
      }
    }
    parseHTML(html) {
      return new Promise((resolve) => {
        if (!this.worker) {
          try {
            const urls = (html || '').match(/href\\s*=\\s*["']([^"']+)["']/gi) || [];
            resolve(urls.map(s => s.match(/["']([^"']+)["']/)[1]).filter(Boolean).slice(0,150));
          } catch { resolve([]); }
          return;
        }
        const id = this.nextId++;
        this.callbacks.set(id, resolve);
        this.worker.postMessage({ id, type: 'parseHTML', payload: html });
      });
    }
  }

  // --- 8) Request Idle Callback Queue (safe idle/allocation) ---
  class IdleTaskQueue {
    constructor() {
      this.queue = [];
      this.running = false;
    }
    enqueue(fn) {
      if (typeof fn !== 'function') return;
      this.queue.push(fn);
      this._schedule();
    }
    _schedule() {
      if (this.running) return;
      this.running = true;
      const run = (deadline) => {
        try {
          while (this.queue.length && (!deadline || deadline.timeRemaining() > 0)) {
            const t = this.queue.shift();
            if (typeof t === 'function') t();
          }
        } catch {}
        if (this.queue.length) {
          if (typeof requestIdleCallback === 'function') requestIdleCallback(run);
          else setTimeout(() => run({ timeRemaining: () => 50 }), 0);
        } else {
          this.running = false;
        }
      };
      if (typeof requestIdleCallback === 'function') requestIdleCallback(run);
      else setTimeout(() => run({ timeRemaining: () => 50 }), 0);
    }
  }

  // --- 9) Cache API wrapper (persistent) ---
  class CacheManager {
    constructor(cacheName = CACHE_NAME) { this.cacheName = cacheName; }
    async match(request) {
      if (!('caches' in window)) return null;
      try {
        const cache = await caches.open(this.cacheName);
        return await cache.match(request);
      } catch { return null; }
    }
    async put(request, response) {
      if (!('caches' in window)) return;
      try {
        const cache = await caches.open(this.cacheName);
        await cache.put(request, response.clone());
      } catch { }
    }
    async delete(request) {
      if (!('caches' in window)) return;
      try {
        const cache = await caches.open(this.cacheName);
        await cache.delete(request);
      } catch { }
    }
  }

  // --- 10) Prefetcher (Quicklink-style) ---
  class Prefetcher {
    constructor(limit = 6) {
      this.limit = limit;
      this.prefetched = new Set();
      this.init();
    }
    init() {
      if ('IntersectionObserver' in window) {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              const a = e.target;
              if (a && a.href) this._prefetch(a.href);
              io.unobserve(a);
            }
          });
        }, { rootMargin: '200px' });
        anchors.forEach(a => io.observe(a));
        this.io = io;
      } else {
        document.addEventListener('mouseover', (ev) => {
          const a = ev.target.closest('a[href]');
          if (a && a.href) this._prefetch(a.href);
        }, { passive: true });
      }
    }
    _prefetch(url) {
      if (!url || this.prefetched.has(url)) return;
      try {
        const u = new URL(url, location.href);
        if (u.origin !== location.origin) return;
      } catch { return; }
      // Lightweight prefetch
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
      this.prefetched.add(url);
      if (this.prefetched.size > this.limit) {
        const first = Array.from(this.prefetched)[0];
        this.prefetched.delete(first);
      }
    }
  }

  // --- 11) Iframe Sandbox / isolation (minimal wrapper) ---
  class IframeGuard {
    constructor() { this._patch(); }
    _patch() {
      const origSetAttr = HTMLIFrameElement.prototype.setAttribute;
      HTMLIFrameElement.prototype.setAttribute = function(name, value) {
        if (name.toLowerCase() === 'src') {
          try {
            const u = new URL(value, location.href);
            if (u.origin !== location.origin) {
              this.src = 'about:blank';
              this.setAttribute('data-gemini-blocked', 'true');
              return;
            }
          } catch {}
        }
        return origSetAttr.call(this, name, value);
      };
      const origAppend = Element.prototype.appendChild;
      Element.prototype.appendChild = function(el) {
        if (el instanceof HTMLIFrameElement) {
          try {
            const u = new URL(el.src || '', location.href);
            if (u.origin !== location.origin) {
              el.src = 'about:blank';
              el.setAttribute('data-gemini-blocked', 'true');
              return el;
            }
          } catch {}
        }
        return origAppend.call(this, el);
      };
    }
  }

  // --- 12) MutationObserver throttling for dynamic content ---
  // We'll implement as a helper function to reuse in the main class
  function throttleMutationObserver(target, callback, debounceMs = 100) {
    if (!('MutationObserver' in window)) return;
    let timer = null;
    const observer = new MutationObserver((mutations) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        callback(mutations);
        timer = null;
      }, debounceMs);
    });
    observer.observe(target, { childList: true, subtree: true });
    return observer;
  }

  // --- 13) Default Configuration ---
  const defaultConfig = {
    version: CONFIG_VERSION,
    ultraPerformanceMode: true,
    aggressiveCaching: true,
    preloadCriticalResources: true,
    deferAllScripts: true,
    removeAllAnimations: true,
    blockAllTrackers: true,

    enableResourceHints: true,
    enableServiceWorkerCache: true,
    enableMemoryOptimization: true,
    enableGPUAcceleration: true,
    enableWebAssemblyOptimization: true,

    // Network
    enableHTTP2Push: true,
    enableBrotliCompression: true,
    maxParallelRequests: 8,
    requestTimeout: 8000,

    // Caching
    memoryCacheSize: 80,
    diskCacheSize: 400,
    cacheExpiry: 604800000, // 7 days

    logLevel: 2,

    disableAnimations: true,
    lazyLoadElements: true,
    optimizeImages: true,
    disableAutoPlayingMedia: true,
    mobileOptimization: true,
    reduceDOMManipulation: true,
    blockTrackers: true,
    optimizeDataFetching: true,
    apiCacheTTL: 300000,
    staticCacheTTL: 604800000,
    enableRetryOnTimeout: true,
    useStorage: true,
    cacheStaticResources: true,
    removeAdsAndPopups: true,
    removeUnnecessaryScripts: true,
    removeUnnecessaryCSS: true,
    removeExternalFonts: true,
    limitIframes: true,
    disableUnnecessaryWebSockets: true,
    improveLinkHandling: true,
    improveCookieManagement: true,
    disableGeolocation: true,
    disableNotifications: true,
    disableJSInBackgroundTabs: true,
    preventSessionTimeout: true,
    preventRedirects: false,
    limitMemoryLeaks: true
  };

  // Simple in-memory LRU cache (tiny, memory-safe)
  class UltraCache {
    constructor(maxSize = 1000) {
      this.cache = new Map();
      this.maxSize = maxSize;
      this.order = [];
    }
    get(key) {
      if (!this.cache.has(key)) return null;
      // Move to MRU
      const idx = this.order.indexOf(key);
      if (idx > -1) this.order.splice(idx, 1);
      this.order.push(key);
      return this.cache.get(key);
    }
    set(key, value) {
      if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
        const lru = this.order.shift();
        if (lru != null) this.cache.delete(lru);
      }
      this.cache.set(key, value);
      const idx = this.order.indexOf(key);
      if (idx > -1) this.order.splice(idx, 1);
      this.order.push(key);
    }
    clear() { this.cache.clear(); this.order = []; }
  }

  // --- 14) Core Optimizer Class ---
  class GeminiUltraOptimizer {
    constructor() {
      this.config = this.loadConfig();
      this.setupLogger();
      this.metrics = { blocked: 0, cached: 0, optimized: 0, savedBytes: 0 };
      this.elementCache = new UltraCache(1000);
      this.selectorCache = new SelectorCache();
      this.ttlStore = new TTLCacheStore(CACHE_META_KEY);
      this.fontLoader = new DynamicFontLoader();
      this.idleQueue = new IdleTaskQueue();
      this.cacheMgr = new CacheManager(CACHE_NAME);
      this.workerMgr = new WorkerManager();
      this.prefetcher = new Prefetcher(6);
      this.iframeGuard = new IframeGuard();
      // Mutation observer throttling helper
      this.mutationObserver = null;

      // Initialize immediately
      this.initializeUltraMode();

      // DOMReady
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady(), { once: true, passive: true });
      } else {
        this.onDOMReady();
      }

      // Schedule a safe metrics report
      this.idleQueue.enqueue(() => this.reportMetrics());
    }

    loadConfig() {
      try {
        const stored = GM_getValue(CONFIG_KEY);
        if (stored && typeof stored === 'object') return { ...defaultConfig, ...stored };
      } catch { /* ignore GM unavailability */ }
      return { ...defaultConfig };
    }

    saveConfig() {
      try {
        GM_setValue(CONFIG_KEY, this.config);
        this.log(3, 'Configuration saved. Reloading...');
        window.location.reload();
      } catch (e) {
        this.log(1, `Failed to save config: ${e?.message ?? e}`);
      }
    }

    setupLogger() {
      this.log = (level, msg) => {
        const lvl = this.config?.logLevel ?? 2;
        if (lvl >= level) {
          const color = level === 1 ? '#ff4d4d' : level === 2 ? '#ffd966' : '#6bdc8b';
          console.log(`%c[Gemini Ultra] ${msg}`, `color: ${color}; font-weight: bold;`);
        }
      };
    }

    initializeUltraMode() {
      // Critical preloads
      this.injectCriticalCSS();
      // No-op: placeholder for any additional preloads
      if (this.config.enableGPUAcceleration) this.enableGPUAcceleration();

      // Interceptors and caches
      this.setupNetworkInterceptor();
      this.setupResourceHints();

      // Font loading and mutation observer
      this.fontLoader.loadFromCSS();
      this.mutateThrottleSetup();

      // Memory optimizations
      this.optimizeMemoryUsage();

      // Performance observer (optional)
      this.setupPerformanceObserver();
    }

    injectCriticalCSS() {
      const css = `
        * { animation: none !important; transition: none !important; transform: translateZ(0); }
        html { scroll-behavior: auto !important; }
        body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif !important; text-rendering: optimizeSpeed; }
        .ad, .ads, .advertisement, [id*="ad-"], [class*="ad-"], [class*="banner"], .social-share, .newsletter, .cookie {
          display: none !important; visibility: hidden !important; opacity: 0 !important;
          pointer-events: none !important; position: absolute !important; left: -9999px !important;
        }
      `;
      if (typeof GM_addStyle === 'function') GM_addStyle(css);
    }

    mutateThrottleSetup() {
      // Throttle MutationObserver to batch DOM work
      if (!('MutationObserver' in window)) return;
      const batch = new Set();
      const flush = () => {
        const nodes = Array.from(batch);
        batch.clear();
        nodes.forEach(n => this.optimizeNode(n));
      };
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
          if (m.type === 'childList') {
            m.addedNodes.forEach(n => { if (n.nodeType === 1) batch.add(n); });
          }
        });
        if (batch.size) this.idleQueue.enqueue(flush);
      });
      observer.observe(document.body, { childList: true, subtree: true });
      this.mutationObserver = observer;
    }

    setupPerformanceObserver() {
      // Optional: lightweight performance telemetry
      if (!('PerformanceObserver' in window)) return;
      try {
        const obs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource' && entry.duration > 1000) {
              this.log(2, `Slow resource: ${entry.name} (${Math.round(entry.duration)}ms)`);
            }
            if (entry.transferSize) {
              this.metrics.savedBytes += (entry.encodedBodySize ?? 0) - entry.transferSize;
            }
          }
        });
        obs.observe({ entryTypes: ['resource', 'navigation', 'paint'] });
      } catch (e) { /* ignore */ }
    }

    setupNetworkInterceptor() {
      const originalFetch = window.fetch.bind(window);
      const cfg = this.config;

      window.fetch = async (resource, init = {}) => {
        const url = (typeof resource === 'string') ? resource : resource?.url;
        if (!url) return originalFetch(resource, init);

        // Block trackers quicker
        if (matchesBlocked(url)) {
          this.metrics.blocked++;
          return new Response('', { status: 204 });
        }

        // Cache-first with Cache API (TTL)
        try {
          const req = (typeof resource === 'string') ? new Request(resource, init) : resource;
          const cached = await this.cacheMgr.match(req);
          if (cached) {
            this.metrics.cached++;
            // Background refresh
            (async () => {
              try {
                const fresh = await originalFetch(req, init);
                if (fresh && fresh.ok) await this.cacheMgr.put(req, fresh.clone());
              } catch { /* ignore */ }
            })();
            return cached.clone();
          }
        } catch { /* ignore cache errors gracefully */ }

        // Network fetch
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), cfg.requestTimeout);
          const resp = await originalFetch(resource, { ...init, signal: controller.signal });
          clearTimeout(timer);
          if (resp && resp.ok) {
            try {
              const req = (typeof resource === 'string') ? new Request(resource, init) : resource;
              await this.cacheMgr.put(req, resp.clone());
              this.ttlStore.set(req.url, cfg.apiCacheTTL);
            } catch { /* ignore */ }
          }
          return resp;
        } catch (e) {
          if (cfg.enableRetryOnTimeout && e?.name === 'AbortError') {
            try { return await originalFetch(resource, init); } catch { throw e; }
          }
          throw e;
        }
      };

      // XHR interception
      const XHR = XMLHttpRequest.prototype;
      const origOpen = XHR.open;
      const origSend = XHR.send;
      XHR.open = function (method, url, ...args) {
        this._gemini_url = url; this._gemini_method = method;
        return origOpen.call(this, method, url, ...args);
      };
      XHR.send = function (...args) {
        const url = this._gemini_url;
        if (url) {
          try {
            if (matchesBlocked(url)) {
              this.abort();
              return;
            }
          } catch {}
        }
        return origSend.call(this, ...args);
      };
    }

    onDOMReady() {
      this.log(3, 'DOM ready, applying optimizations...');
      this.applyDOMOptimizations();
      this.setupDynamicContentObserver();
      this.setupLazyLoadingObserver();
      this.optimizeScripts();
      this.postLoadCleanup();
      // Phase 2: idle tasks
      this.idleQueue.enqueue(() => this.reportMetrics());
    }

    setupResourceHints() {
      // Preconnect to discovered origins; gate by network type
      const origins = new Set();
      document.querySelectorAll('link[href], script[src], img[src]').forEach(el => {
        const url = el.href || el.src;
        if (!url) return;
        try {
          const u = new URL(url, location.href);
          if (u.origin !== location.origin && !matchesBlocked(url)) {
            origins.add(u.origin);
          }
        } catch { /* ignore */ }
      });
      origins.forEach(origin => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
      // Lightweight preloads
      document.querySelectorAll('link[rel="stylesheet"][href], script[src]').forEach(el => {
        const href = el.href || el.getAttribute('src') || '';
        if (!href) return;
        if (matchesBlocked(href)) return;
        const pre = document.createElement('link');
        pre.rel = 'preload';
        pre.as = href.endsWith('.css') ? 'style' : 'script';
        pre.href = href;
        document.head.appendChild(pre);
      });
    }

    enableGPUAcceleration() {
      // Simple, safe GPU hints
      const style = document.createElement('style');
      style.textContent = `
        body { transform: translateZ(0); will-change: transform; }
        img, video, canvas, iframe { will-change: transform; }
      `;
      document.head.appendChild(style);
    }

    setupEventListenerOptimizer() {
      // Throttle common high-frequency listeners
      if (!('addEventListener' in EventTarget.prototype)) return;
      // Simple global patch could be extended if desired
    }

    optimizeMemoryUsage() {
      // Debounced memory cleanup on visibility change
      const cleanup = () => {
        if (window.gc) {
          try { window.gc(); } catch {}
        }
        // Evict old in-memory caches if needed
        if (this.elementCache && this.elementCache.cache && this.elementCache.cache.size > 800) {
          const toRemove = this.elementCache.cache.size - 800;
          const keys = Array.from(this.elementCache.cache.keys()).slice(0, toRemove);
          keys.forEach(k => this.elementCache.cache.delete(k));
        }
      };
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') this.idleQueue.enqueue(cleanup);
      });
      window.addEventListener('beforeunload', cleanup);
      // Periodic extra cleanup
      const t = setInterval(cleanup, 30000);
      this.timers = this.timers || [];
      this.timers.push(t);
    }

    setupDynamicContentObserver() {
      // Debounced/batched mutation handling
      if (!('MutationObserver' in window)) return;
      const batch = new Set();
      const flush = () => {
        const nodes = Array.from(batch);
        batch.clear();
        nodes.forEach(n => this.optimizeNode(n));
      };
      const obs = new MutationObserver((mutations) => {
        mutations.forEach(m => {
          if (m.type === 'childList') {
            m.addedNodes.forEach(n => { if (n.nodeType === 1) batch.add(n); });
          }
        });
        this.idleQueue.enqueue(flush);
      });
      obs.observe(document.body, { childList: true, subtree: true });
      this._dynamicObs = obs;
    }

    setupLazyLoadingObserver() {
      if (!('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src && !img.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            if (img.dataset.webpSrc && this.supportsWebP()) {
              img.src = img.dataset.webpSrc;
              img.removeAttribute('data-webp-src');
            }
            io.unobserve(img);
          }
        });
      }, { rootMargin: '50px 0px', threshold: 0.01 });
      document.querySelectorAll('img[data-src], img[data-webp-src]').forEach(img => io.observe(img));
      this._lazyIO = io;
    }

    optimizeNode(node) {
      if (!node || !node.querySelectorAll) return;
      // Quick cleanup in given node
      const unwanted = node.querySelectorAll('.ad, .popup, .modal, [class*="ad-"], [id*="ad-"]');
      unwanted.forEach(el => el.remove());

      // Images inside the node
      node.querySelectorAll('img').forEach(img => {
        if (!img.loading) img.loading = 'lazy';
        if (!img.decoding) img.decoding = 'async';
        this.metrics.optimized++;
      });

      // Iframes
      node.querySelectorAll('iframe').forEach(iframe => {
        const src = iframe.src || iframe.getAttribute('src') || '';
        if (src && matchesBlocked(src)) {
          iframe.remove();
          this.metrics.blocked = (this.metrics.blocked || 0) + 1;
          return;
        }
        if (!iframe.loading) iframe.loading = 'lazy';
        if (!iframe.sandbox) iframe.sandbox = 'allow-scripts allow-same-origin';
      });
    }

    optimizeMedia() {
      document.querySelectorAll('video').forEach(video => {
        try { video.preload = 'metadata'; } catch {}
        video.autoplay = false;
        if (video.muted === false) video.muted = true;
        video.removeAttribute('autoplay');
        if (!video.paused) video.pause();
        this.metrics.optimized++;
      });
      document.querySelectorAll('audio').forEach(audio => {
        audio.preload = 'metadata';
        audio.autoplay = false;
        audio.muted = true;
        if (!audio.paused) audio.pause();
        this.metrics.optimized++;
      });
    }

    optimizeAllImages() {
      const images = document.querySelectorAll('img');
      const viewportHeight = window.innerHeight;
      images.forEach((img, index) => {
        if (img.dataset.optimized) return;
        if (!img.loading) img.loading = index < 3 ? 'eager' : 'lazy';
        if (!img.decoding) img.decoding = 'async';
        try {
          if (index < 3 && img.getBoundingClientRect().top < viewportHeight) img.fetchpriority = 'high';
        } catch {}
        // WebP hint
        const src = img.src || img.dataset.src;
        if (src && !src.includes('.webp') && /\.(jpg|jpeg|png)$/i.test(src)) {
          img.dataset.webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        img.dataset.optimized = 'true';
        this.metrics.optimized++;
      });
    }

    cleanupCSS() {
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const href = link.href || '';
        try {
          if (href && matchesBlocked(href)) {
            link.remove();
            this.metrics.blocked = (this.metrics.blocked || 0) + 1;
          }
        } catch {}
      });
      document.querySelectorAll('[style*="animation"], [style*="transition"]').forEach(el => {
        const style = el.getAttribute('style') || '';
        const newStyle = style.replace(/animation[^;]+;?/gi, '').replace(/transition[^;]+;?/gi, '');
        el.setAttribute('style', newStyle);
        this.metrics.optimized++;
      });
    }

    supportsWebP() {
      try {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        return c.toDataURL('image/webp').indexOf('image/webp') > -1;
      } catch { return false; }
    }

    optimizeFonts() {
      // Remove Google Fonts (as part of blocking)
      document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]')
        .forEach(l => { l.remove(); this.metrics.blocked++; });

      // Preload font cleanup
      document.querySelectorAll('link[rel="preload"][as="font"]').forEach(l => {
        l.remove(); this.metrics.blocked++;
      });

      // Load dynamic fonts
      this.fontLoader.loadFromCSS();
    }

    optimizeScripts() {
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        const src = script.src || '';
        if (src) {
          try {
            const host = new URL(src, location.href).hostname;
            if (matchesBlocked(src)) {
              script.remove(); this.metrics.blocked++;
              return;
            }
            if (!script.async && !script.defer) {
              script.defer = true;
              this.metrics.optimized++;
            }
          } catch {}
        } else {
          const content = script.textContent || '';
          if (/(google-analytics|gtag|fbq|_gaq|analytics|tracking)/i.test(content)) {
            script.remove(); this.metrics.blocked++;
          }
        }
      });
    }

    postLoadCleanup() {
      // Remove empty style tags
      document.querySelectorAll('style').forEach(style => {
        if (!style.textContent || style.textContent.trim() === '') style.remove();
      });
      // Remove comments
      const it = document.createNodeIterator(document.body, NodeFilter.SHOW_COMMENT, null, false);
      const toRemove = [];
      let node;
      while ((node = it.nextNode())) toRemove.push(node);
      toRemove.forEach(n => n.remove());
    }

    reportMetrics() {
      const elapsed = performance.now(); // approx
      const report = `
Performance Report:
- Uptime snapshot: ${Math.round(elapsed)}ms
- Blocked requests: ${this.metrics.blocked}
- Cached requests: ${this.metrics.cached}
- Optimized elements: ${this.metrics.optimized}
- Estimated data saved: ${(this.metrics.savedBytes / 1024).toFixed(2)} KB
      `;
      this.log(3, report);
    }

    logBlockEntry(kind, msg) {
      this.log(2, `[Block ${kind}] ${msg}`);
    }

    log(levelMsg, msg) {
      if (!this.config || this.config.logLevel == null) return;
      const lvl = this.config.logLevel;
      if (lvl >= levelMsg) {
        console.log(`%c[Gemini Ultra] ${msg}`, 'color: #28a745; font-weight: bold;');
      }
    }

    setupMenuCommands() {
      try {
        GM_registerMenuCommand('🚀 Toggle Ultra Performance Mode', () => {
          this.config.ultraPerformanceMode = !this.config.ultraPerformanceMode;
          this.saveConfig();
        });
        GM_registerMenuCommand('💾 Toggle Aggressive Caching', () => {
          this.config.aggressiveCaching = !this.config.aggressiveCaching;
          this.saveConfig();
        });
        GM_registerMenuCommand('🚫 Toggle Ad Blocking', () => {
          this.config.removeAdsAndPopups = !this.config.removeAdsAndPopups;
          this.saveConfig();
        });
        GM_registerMenuCommand('📊 Show Performance Metrics', () => this.reportMetrics());
        GM_registerMenuCommand('🔧 Reset Configuration', () => {
          if (confirm('Reset all settings to default?')) {
            GM_setValue(CONFIG_KEY, { version: CONFIG_VERSION });
            window.location.reload();
          }
        });
      } catch { /* GM missing */ }
    }

    // Utility: Supports webp (tiny helper)
    supportsWebP() {
      try {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        return c.toDataURL('image/webp').indexOf('image/webp') > -1;
      } catch { return false; }
    }

    // Cleanup on unload
    cleanup() {
      if (this.mutationObserver) this.mutationObserver.disconnect();
      if (this._dynamicObs) this._dynamicObs.disconnect();
      this.elementCache.clear();
      this.selectorCache.clear();
    }
  }

  // Instantiate the optimizer
  try {
    new GeminiUltraOptimizer();
  } catch (e) {
    console.error('[Gemini Ultra] Failed to initialize:', e);
  }

})();