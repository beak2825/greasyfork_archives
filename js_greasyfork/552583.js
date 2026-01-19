// ==UserScript==
// @name            FC2PPVDB Enhanced
// @name:en         FC2PPVDB Enhanced
// @namespace       https://greasyfork.org/zh-CN/scripts/552583-fc2ppvdb-enhanced
// @version         2.0.1
// @author          Icarusle
// @description     提供极速磁力搜索、高清预览、连拍图集、跨端历史同步与自定义过滤，重塑卡片布局丰富交互体验。极致性能，优雅动效。
// @description:en  Magnet search, HD preview, multi-shot gallery, sync history, and more. Modern UI with smooth animations.
// @license         MIT
// @icon            https://fc2ppvdb.com/favicon.ico
// @match           https://fc2ppvdb.com/*
// @match           https://fd2ppv.cc/*
// @match           https://supjav.com/*
// @match           https://missav.ws/*
// @match           https://missav.ai/*
// @match           https://javdb.com/*
// @match           https://javdb565.com/*
// @require         https://unpkg.com/dexie@3.2.4/dist/dexie.js
// @connect         sukebei.nyaa.si
// @connect         wumaobi.com
// @connect         fourhoi.com
// @connect         fd2ppv.cc
// @connect         supabase.co
// @connect         0cili.eu
// @grant           GM_addStyle
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_info
// @grant           GM_registerMenuCommand
// @grant           GM_setClipboard
// @grant           GM_setValue
// @grant           GM_unregisterMenuCommand
// @grant           GM_xmlhttpRequest
// @grant           unsafeWindow
// @run-at          document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552583/FC2PPVDB%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/552583/FC2PPVDB%20Enhanced.meta.js
// ==/UserScript==

(function (Dexie) {
  'use strict';

  const SCRIPT_INFO = {
    NAME: "FC2PPVDB Enhanced",
    VERSION: typeof GM_info !== "undefined" ? GM_info.script.version : "2.0.1",
    NAMESPACE: "https://greasyfork.org/zh-CN/scripts/552583-fc2ppvdb-enhanced",
    GREASYFORK_URL: "https://greasyfork.org/scripts/552583"
  };
  const STORAGE_KEYS = {
    SETTINGS: "settings_v1",
    CACHE: "magnet_cache_v1",
    HISTORY: "history_v1",
    SUPABASE_URL: "supabase_url",
    SUPABASE_KEY: "supabase_key",
    SUPABASE_JWT: "supabase_jwt",
    SUPABASE_REFRESH: "supabase_refresh_token",
    SYNC_USER_ID: "sync_user_id",
    CURRENT_USER_EMAIL: "current_user_email",
    LAST_SYNC_TS: "last_sync_ts",
    LAST_AUTO_SYNC_TS: "last_auto_sync_ts",
    WEBDAV_URL: "webdav_url",
    WEBDAV_USER: "webdav_user",
    WEBDAV_PASS: "webdav_pass",
    WEBDAV_PATH: "webdav_path",
    WEBDAV_LAST_ETAG: "webdav_last_etag",
    WEBDAV_SYNC_LOCK: "webdav_sync_lock",
    SYNC_MODE: "sync_mode",
    LANGUAGE: "language",
    USER_GRID_COLUMNS: "user_grid_columns_preference"
  };
  const TIMING = {
    DEBOUNCE_MS: 300,
    THROTTLE_MS: 200,
    RETRY_DELAY_MS: 1e3,
    MAGNET_BASE_DELAY_MS: 800,
    MAGNET_RANDOM_DELAY_MS: 3e3,
    CLOUDFLARE_BACKOFF_MS: 6e4,
    RATE_LIMIT_BACKOFF_MS: 6e4,
    OCILI_DELAY_MS: 2e3,
    OCILI_RANDOM_DELAY_MS: 2e3,
    ACTRESS_BASE_DELAY_MS: 1500,
    ACTRESS_RANDOM_DELAY_MS: 1500,
    POLITE_DELAY_MS: 500,
    MAGNET_JITTER_MS: 3e3
  };
  const UI_CONSTANTS = {
    FONT_FAMILY: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    Z_INDEX_MAX: 2147483647,
    Z_INDEX_OVERLAY: 2147483648,
    Z_INDEX_TOOLTIP: 999999,
    DEFAULT_TIMESTAMP: "1970-01-01T00:00:00.000Z",
    DEFAULT_SYNC_FILENAME: "fc2_enhanced_sync.json",
    TIME_ZONE: "Asia/Shanghai"
  };
  const UI_TOKENS = {
    COLORS: {
      SUCCESS: "#10b981",
      SUCCESS_LIGHT: "rgba(16, 185, 129, 0.1)",
      ERROR: "#ef4444",
      ERROR_LIGHT: "rgba(239, 68, 68, 0.1)",
      WARN: "#f59e0b",
      WARN_LIGHT: "rgba(245, 158, 11, 0.1)",
      INFO: "#3b82f6",
      DEBUG: "#71717a",
      TEXT_DIM: "#9ca3af",
      TEXT_MUTED: "#6b7280",
      WHITE: "#ffffff",
      BORDER: "rgba(255, 255, 255, 0.1)",
      BORDER_LIGHT: "rgba(255, 255, 255, 0.05)"
    },
    BACKDROP: {
      COLOR: "rgba(20, 20, 25, 0.95)",
      BLUR: "12px",
      SHADOW: "0 8px 16px rgba(0,0,0,0.4)"
    },
    SPACING: {
      XS: "4px",
      SM: "8px",
      MD: "12px",
      LG: "16px",
      XL: "20px",
      GUTTER: "15px"
    },
    RADIUS: {
      MD: "8px"
    }
  };
  const SYSTEM_KEYS = {
    DEBUG_KEY: "fc2_enhanced_debug",
    MESSAGING_CHANNEL: "fc2-enhanced-sync",
    MAX_LOGS: 500,
    LOG_PREFIX: "[FC2 Enhanced]"
  };
  const MAGNET_CONFIG = {
    MAX_CONCURRENCY: 4,
    MAX_RETRIES: 2,
    RETRY_DELAY: 1e3,
    PREDICTIVE_LIMIT: 12,
    DEFAULT_TYPE: "fc2",
    SEARCH_TIMEOUT_MS: 1e4
  };
  const SYNC_STATUS = {
    IDLE: "idle",
    SYNCING: "syncing",
    SUCCESS: "success",
    ERROR: "error",
    CONFLICT: "conflict"
  };
  const DOM_IDS = {
    SETTINGS_HOST: "fc2-enh-settings-host",
    SETTINGS_CONTAINER: "fc2-enh-settings-container",
    TAB_CONTENT: "tab-content-container",
    LOG_LIST: "debug-log-list"
  };
  const NETWORK = {
    CHUNK_SIZE: 12
  };
  const CACHE = {
    MEMORY_MAX_SIZE: 1e3,
    MEMORY_EXPIRATION_MS: 5 * 60 * 1e3,
EXPIRATION_MS: 14 * 24 * 60 * 60 * 1e3
};
  const DATABASE = {
    NAME: "fc2_enhanced_db",
    VERSION: 5
  };
  const VALIDATION = {
    ACTRESS_NAME_MAX_LENGTH: 50,
    ACTRESS_NAME_MIN_LENGTH: 2,
    USERNAME_MIN_LENGTH: 3,
    PASSWORD_MIN_LENGTH: 6,
    INPUT_MAX_LENGTH: 1e3,
    FC2_ID_REGEX: /^\d{5,10}$/,
    JAV_ID_REGEX: /^[A-Z]{1,10}-?\d{2,8}$/i,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  };
  const PREVIEW_BLACKLIST = ["moechat_ads.jpg", "mc.yandex.ru"];
  const STUDIOS = [];
  const STUDIO_ID_MAP = {};
  const EXTERNAL_URLS = {
    SUPJAV: "https://supjav.com/zh/?s={id}",
    MISSAV_FC2: "https://missav.ws/cn/fc2-ppv-{id}",
    MISSAV: "https://missav.ws/cn/{id}",
    JAVDB: "https://javdb.com/search?q={id}&f=all",
    FC2DB: "https://fc2ppvdb.com/articles/{id}",
    FD2: "https://fd2ppv.cc/articles/{id}",
    SUKEBEI: "https://sukebei.nyaa.si/?f=0&c=0_0&q={id}"
  };
  const SCRAPER_CONFIG = {
    MAX_CONCURRENT_BATCHES: 4
  };
  const SCRAPER_URLS = {
    SUKEBEI_SEARCH: "https://sukebei.nyaa.si/?f=0&c=0_0&q={query}&s=seeders&o=desc",
    OCILI_SEARCH: "https://0cili.eu/search?q={query}",
    WUMAOBI_DETAIL: "https://wumaobi.com/fc2daily/detail/FC2-PPV-{id}",
    WUMAOBI_BASE: "https://wumaobi.com"
  };
  const PREVIEW_SLUG_MAP = {};
  const JAV_PREFIX_BLACKLIST = ["FC2", "PPV"];
  const ACTRESS_BLACKLIST = [
    /首页/,
    /分类/,
    /我的/,
    /搜索/,
    /排行榜/,
    /导航/,
    /菜单/,
    /更多/,
    /全部/,
    /^[\d\s]+$/
  ];
  const CLOUDFLARE_INDICATORS = [
    "Just a moment...",
    "Checking your browser",
    "Attention Required!",
    "Cloudflare"
  ];
  const scriptRel = (function detectScriptRel() {
    const relList = typeof document !== "undefined" && document.createElement("link").relList;
    return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
  })();
  const assetsURL = function(dep) {
    return "/" + dep;
  };
  const seen = {};
  const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    if (deps && deps.length > 0) {
      let allSettled2 = function(promises) {
        return Promise.all(
          promises.map(
            (p) => Promise.resolve(p).then(
              (value) => ({ status: "fulfilled", value }),
              (reason) => ({ status: "rejected", reason })
            )
          )
        );
      };
      document.getElementsByTagName("link");
      const cspNonceMeta = document.querySelector(
        "meta[property=csp-nonce]"
      );
      const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
      promise = allSettled2(
        deps.map((dep) => {
          dep = assetsURL(dep);
          if (dep in seen) return;
          seen[dep] = true;
          const isCss = dep.endsWith(".css");
          const cssSelector = isCss ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
            return;
          }
          const link = document.createElement("link");
          link.rel = isCss ? "stylesheet" : scriptRel;
          if (!isCss) {
            link.as = "script";
          }
          link.crossOrigin = "";
          link.href = dep;
          if (cspNonce) {
            link.setAttribute("nonce", cspNonce);
          }
          document.head.appendChild(link);
          if (isCss) {
            return new Promise((res, rej) => {
              link.addEventListener("load", res);
              link.addEventListener(
                "error",
                () => rej(new Error(`Unable to preload CSS for ${dep}`))
              );
            });
          }
        })
      );
    }
    function handlePreloadError(err) {
      const e = new Event("vite:preloadError", {
        cancelable: true
      });
      e.payload = err;
      window.dispatchEvent(e);
      if (!e.defaultPrevented) {
        throw err;
      }
    }
    return promise.then((res) => {
      for (const item of res || []) {
        if (item.status !== "rejected") continue;
        handlePreloadError(item.reason);
      }
      return baseModule().catch(handlePreloadError);
    });
  };
  const DEBUG_KEY = SYSTEM_KEYS.DEBUG_KEY;
  const MAX_LOGS = SYSTEM_KEYS.MAX_LOGS;
  const LOG_PREFIX = SYSTEM_KEYS.LOG_PREFIX;
  const Logger$1 = {
    history: [],
    _addHistory(level, module, message, data) {
      const entry = {
        timestamp: ( new Date()).toLocaleTimeString(),
        level,
        module,
        message,
        data
      };
      this.history.push(entry);
      if (this.history.length > MAX_LOGS) {
        this.history.shift();
      }
    },
init() {
      if (this.enabled) {
        console.log(
          `%c ${SCRIPT_INFO.NAME} %c v${SCRIPT_INFO.VERSION} %c
%c ${SCRIPT_INFO.GREASYFORK_URL} `,
          `background: ${UI_TOKENS.COLORS.INFO}; color: white; padding: 2px 4px; border-radius: 3px 0 0 3px; font-weight: bold;`,
          "background: #353535; color: white; padding: 2px 4px; border-radius: 0 3px 3px 0;",
          "",
          `color: ${UI_TOKENS.COLORS.TEXT_DIM}; font-size: 11px; margin-top: 4px;`
        );
      }
    },
get enabled() {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(DEBUG_KEY) === "true";
      }
      return false;
    },
enable() {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(DEBUG_KEY, "true");
        console.log("[FC2 Enhanced] 🐛 Debug mode enabled");
      }
    },
disable() {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(DEBUG_KEY);
        console.log("[FC2 Enhanced] Debug mode disabled");
      }
    },
debug(module, message, data) {
      this._addHistory("debug", module, message, data);
      if (this.enabled) {
        const timestamp = ( new Date()).toLocaleTimeString();
        console.debug(`%c${LOG_PREFIX} %c[${timestamp}] [${module}] ⚙️`, `color: ${UI_TOKENS.COLORS.DEBUG}; font-weight: bold;`, `color: ${UI_TOKENS.COLORS.TEXT_DIM};`, message, data || "");
      }
    },
log(module, message, data) {
      this._addHistory("log", module, message, data);
      if (this.enabled) {
        const timestamp = ( new Date()).toLocaleTimeString();
        console.log(`%c${LOG_PREFIX} %c[${timestamp}] [${module}]`, `color: ${UI_TOKENS.COLORS.INFO}; font-weight: bold;`, `color: ${UI_TOKENS.COLORS.TEXT_DIM};`, message, data || "");
      }
    },
info(module, message, data) {
      this._addHistory("info", module, message, data);
      if (this.enabled) {
        const timestamp = ( new Date()).toLocaleTimeString();
        console.info(`%c${LOG_PREFIX} %c[${timestamp}] [${module}] ℹ️`, `color: ${UI_TOKENS.COLORS.INFO}; font-weight: bold;`, `color: ${UI_TOKENS.COLORS.TEXT_DIM};`, message, data || "");
      }
    },
success(module, message, data) {
      this._addHistory("success", module, message, data);
      if (this.enabled) {
        const timestamp = ( new Date()).toLocaleTimeString();
        console.log(`%c${LOG_PREFIX} %c[${timestamp}] [${module}] ✅`, `color: ${UI_TOKENS.COLORS.SUCCESS}; font-weight: bold;`, `color: ${UI_TOKENS.COLORS.TEXT_DIM};`, message, data || "");
      }
    },
warn(module, message, data) {
      this._addHistory("warn", module, message, data);
      if (this.enabled) {
        const timestamp = ( new Date()).toLocaleTimeString();
        console.warn(`%c${LOG_PREFIX} %c[${timestamp}] [${module}] ⚠️`, `color: ${UI_TOKENS.COLORS.WARN}; font-weight: bold;`, `color: ${UI_TOKENS.COLORS.TEXT_DIM};`, message, data || "");
      }
    },
error(module, message, error) {
      this._addHistory("error", module, message, error);
      const timestamp = ( new Date()).toLocaleTimeString();
      console.error(`%c${LOG_PREFIX} %c[${timestamp}] [${module}] ❌`, `color: ${UI_TOKENS.COLORS.ERROR}; font-weight: bold;`, `color: ${UI_TOKENS.COLORS.TEXT_DIM};`, message, error || "");
    },
time(label) {
      if (this.enabled) {
        console.time(`${LOG_PREFIX} ${label}`);
      }
    },
timeEnd(label) {
      if (this.enabled) {
        console.timeEnd(`[FC2 Enhanced] ${label}`);
      }
    },
group(module, title) {
      if (this.enabled) {
        console.group(`[FC2 Enhanced][${module}] ${title}`);
      }
    },
groupEnd() {
      if (this.enabled) {
        console.groupEnd();
      }
    },
table(module, data) {
      if (this.enabled) {
        console.log(`[FC2 Enhanced][${module}]`);
        console.table(data);
      }
    }
  };
  if (typeof window !== "undefined") {
    window.FC2Debug = {
      enable: () => Logger$1.enable(),
      disable: () => Logger$1.disable(),
      status: () => console.log(`Debug mode: ${Logger$1.enabled ? "ON" : "OFF"}`)
    };
  }
  class FC2Database extends Dexie {
    constructor() {
      super(DATABASE.NAME);
      this.version(5).stores({
        history: "&id, timestamp, status, updated_at, is_deleted, sync_dirty, [is_deleted+timestamp], [sync_dirty+updated_at], [status+is_deleted]",
        cache: "&id, timestamp",
        itemDetails: "&id, lastAccessed"
      });
      this.version(4).stores({
        history: "&id, timestamp, status, updated_at, is_deleted, sync_dirty, [is_deleted+timestamp], [sync_dirty+updated_at], [status+is_deleted]",
        cache: "&id, timestamp",
        itemDetails: "&id, lastAccessed"
      }).upgrade(async (tx) => {
        Logger$1.info("Database", "Upgrading to version 4 - Adding status field");
        return tx.table("history").toCollection().modify({ status: "watched" });
      });
      Logger$1.info("Database", `FC2EnhancedDB initialized (v${DATABASE.VERSION})`);
    }
  }
  const db = new FC2Database();
  class QueryCache {
    constructor() {
      this.cache = new Map();
      this.version = 0;
    }
    get(key) {
      const entry = this.cache.get(key);
      return entry && entry.version === this.version ? entry.data : null;
    }
    set(key, data) {
      this.cache.set(key, { data, version: this.version });
    }
    invalidate() {
      this.version++;
      Logger$1.log("Database", `Query cache invalidated, new version: ${this.version}`);
    }
  }
  class MemoryCache {
    constructor() {
      this.cache = new Map();
      this.maxSize = CACHE.MEMORY_MAX_SIZE;
    }
    get(id, expirationMs) {
      const item = this.cache.get(id);
      if (item && Date.now() - item.timestamp < expirationMs) {
        return item.value;
      }
      if (item) this.cache.delete(id);
      return null;
    }
    set(id, value) {
      if (this.cache.size >= this.maxSize) {
        const firstKey = this.cache.keys().next().value;
        if (firstKey) this.cache.delete(firstKey);
      }
      this.cache.set(id, { value, timestamp: Date.now() });
    }
    clear() {
      this.cache.clear();
    }
  }
  const qCache = new QueryCache();
  const mCache = new MemoryCache();
  const Repository = {
    db,
    history: {
      async add(id, status = "watched") {
        Logger$1.time("History.add");
        const now = ( new Date()).toISOString();
        const item = {
          id: String(id),
          timestamp: Date.now(),
          status,
          updated_at: now,
          is_deleted: 0,
          sync_dirty: 1
        };
        await db.history.put(item);
        qCache.invalidate();
        Logger$1.success("History", `Added: ${id} as ${status}`, item);
        Logger$1.timeEnd("History.add");
      },
      async getAll() {
        const cached = qCache.get("all");
        if (cached) {
          Logger$1.log("History", "Query cache hit: getAll");
          return cached;
        }
        Logger$1.time("History.getAll");
        const items = await db.history.where("is_deleted").equals(0).toArray();
        qCache.set("all", items);
        Logger$1.info("History", `Retrieved ${items.length} active items from DB`);
        Logger$1.timeEnd("History.getAll");
        return items;
      },
      async getByStatus(status) {
        const cached = qCache.get(`status_${status}`);
        if (cached) return cached;
        Logger$1.time(`History.getByStatus(${status})`);
        const items = await db.history.where({ status, is_deleted: 0 }).toArray();
        qCache.set(`status_${status}`, items);
        Logger$1.info("History", `Retrieved ${items.length} ${status} items from DB`);
        Logger$1.timeEnd(`History.getByStatus(${status})`);
        return items;
      },
      async getKeys() {
        const cached = qCache.get("keys");
        if (cached) {
          Logger$1.log("History", "Query cache hit: getKeys");
          return cached;
        }
        Logger$1.time("History.getKeys");
        const keys = await db.history.where("is_deleted").equals(0).primaryKeys();
        qCache.set("keys", keys);
        Logger$1.info("History", `Retrieved ${keys.length} active keys from DB`);
        Logger$1.timeEnd("History.getKeys");
        return keys;
      },
      async remove(id) {
        Logger$1.time("History.remove");
        const now = ( new Date()).toISOString();
        const update = {
          is_deleted: 1,
          updated_at: now,
          sync_dirty: 1
        };
        await db.history.update(String(id), update);
        qCache.invalidate();
        Logger$1.warn("History", `Soft deleted: ${id}`, update);
        Logger$1.timeEnd("History.remove");
      },
      async has(id) {
        const cachedKeys = qCache.get("keys");
        if (cachedKeys) {
          return cachedKeys.includes(String(id));
        }
        const item = await db.history.get(String(id));
        const exists = !!(item && item.is_deleted === 0);
        return exists;
      },
      async clear() {
        Logger$1.time("History.clear");
        const now = ( new Date()).toISOString();
        const update = {
          is_deleted: 1,
          updated_at: now,
          sync_dirty: 1
        };
        await db.history.toCollection().modify(update);
        qCache.invalidate();
        Logger$1.warn("History", "All items soft deleted", update);
        Logger$1.timeEnd("History.clear");
      }
    },
    cache: {
      async get(id) {
        const exp = CACHE.MEMORY_EXPIRATION_MS;
        const memValue = mCache.get(id, exp);
        if (memValue !== null) {
          Logger$1.log("Cache", `Memory hit: ${id}`);
          return memValue;
        }
        const row = await db.cache.get(id);
        const now = Date.now();
        if (row && now - row.timestamp < exp) {
          mCache.set(id, row.value);
          Logger$1.success("Cache", `DB hit: ${id}`, { age: Math.floor((now - row.timestamp) / 1e3) + "s" });
          return row.value;
        }
        Logger$1.warn("Cache", `Miss: ${id}`);
        return null;
      },
      async getBulk(ids) {
        Logger$1.time("Cache.getBulk");
        const now = Date.now(), exp = CACHE.MEMORY_EXPIRATION_MS;
        const res = new Map();
        const missingIds = [];
        ids.forEach((id) => {
          const val = mCache.get(id, exp);
          if (val !== null) res.set(id, val);
          else missingIds.push(String(id));
        });
        if (missingIds.length > 0) {
          const dbItems = await db.cache.bulkGet(missingIds);
          dbItems.forEach((item, i) => {
            if (item && now - item.timestamp < exp) {
              res.set(missingIds[i], item.value);
              mCache.set(missingIds[i], item.value);
            }
          });
        }
        Logger$1.info(
          "Cache",
          `Bulk get: ${res.size}/${ids.length} hits (Memory: ${ids.length - missingIds.length})`
        );
        Logger$1.timeEnd("Cache.getBulk");
        return res;
      },
      async set(id, value) {
        const timestamp = Date.now();
        await db.cache.put({ id: String(id), value, timestamp });
        mCache.set(id, value);
        Logger$1.success("Cache", `Set: ${id}`);
      },
      async clear() {
        await db.cache.clear();
        mCache.clear();
        Logger$1.warn("Cache", "All cache cleared");
      }
    },
    runGC: async () => {
      Logger$1.group("GC", "Running garbage collection");
      const now = Date.now(), cacheExp = CACHE.EXPIRATION_MS;
      const deletedCache = await db.cache.where("timestamp").below(now - cacheExp).delete();
      if (deletedCache > 0) Logger$1.info("GC", `Deleted ${deletedCache} expired cache items`);
      const dCount = await db.itemDetails.count();
      if (dCount > 5e3) {
        const deleted = await db.itemDetails.orderBy("lastAccessed").limit(dCount - 5e3).delete();
        Logger$1.info("GC", `Deleted ${deleted} old detail items`);
      }
      mCache.clear();
      Logger$1.groupEnd();
    }
  };
  const CacheManager = Repository.cache;
  const Config = {
    EXTERNAL_URLS,
    SCRAPER_URLS,
    SCRAPER_CONFIG,
    STORAGE_KEYS,
    TIMEOUTS: { API: 2e4, VIDEO_LOAD: 5e3, SYNC_DEBOUNCE: 2e3 },
    CLASSES: {
      cardRebuilt: "card-rebuilt",
      processedCard: "processed-card",
      hideNoMagnet: "hide-no-magnet",
      videoPreviewContainer: "video-preview-container",
      staticPreview: "static-preview",
      previewElement: "preview-element",
      hidden: "hidden",
      infoArea: "info-area",
      customTitle: "custom-card-title",
      fc2IdBadge: "fc2-id-badge",
      badgeCopied: "copied",
      preservedIconsContainer: "preserved-icons-container",
      resourceLinksContainer: "resource-links-container",
      resourceBtn: "resource-btn",
      btnLoading: "is-loading",
      btnMagnet: "magnet",
      tooltip: "tooltip",
      buttonText: "button-text",
      extraPreviewContainer: "preview-container",
      extraPreviewTitle: "preview-title",
      extraPreviewGrid: "preview-grid",
      isCensored: "is-censored",
      hideCensored: "hide-censored",
      isViewed: "is-viewed",
      hideViewed: "hide-viewed",
      isWanted: "is-wanted",
      isDownloaded: "is-downloaded",
      isBlocked: "is-blocked",
      hideBlocked: "hide-blocked"
    },
    CACHE_EXPIRATION_DAYS: 14,
    COPIED_BADGE_DURATION: 1500
  };
  const Storage = {
    get: (key, def) => typeof GM_getValue !== "undefined" ? GM_getValue(key, def) : def,
    set: (key, val) => {
      if (typeof GM_setValue !== "undefined") GM_setValue(key, val);
    },
    delete: (key) => {
      if (typeof GM_deleteValue !== "undefined") GM_deleteValue(key);
    }
  };
  const Utils = {
    debounce: (func, delay) => {
      let t2;
      return (...a) => {
        if (t2) clearTimeout(t2);
        t2 = setTimeout(() => func(...a), delay);
      };
    },
    chunk: (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size)),
    sleep: (ms) => new Promise((res) => setTimeout(res, ms)),
    copyToClipboard: (text) => {
      if (typeof GM_setClipboard !== "undefined") GM_setClipboard(text);
    },
    extractFC2Id: (url) => url?.match(/(?:articles\/|fc2-ppv-|fc2-)(\d+)/i)?.[1] ?? null,
    parseVideoId: (text, url = "") => {
      const input = (text + " " + url).replace(/[+\s_]/g, "-").toUpperCase();
      const fc2Prefix = input.match(/(?:FC2[^\d]*PPV[^\d]*|FC2-)(\d{5,8})/i);
      if (fc2Prefix) return { id: fc2Prefix[1], type: "fc2" };
      const fc2FromUrl = Utils.extractFC2Id(url);
      if (fc2FromUrl) return { id: fc2FromUrl, type: "fc2" };
      const dateMatch = input.match(/(\d{6,8})-(\d{1,4})/);
      if (dateMatch) {
        const studios = STUDIOS;
        const studioKey = studios.find((x) => input.includes(x));
        if (studioKey) {
          const datePart = dateMatch[1];
          const seqPart = dateMatch[2];
          const studioIdMap = STUDIO_ID_MAP;
          const sid = studioIdMap[studioKey] || studioKey;
          const slugMap = PREVIEW_SLUG_MAP;
          const previewSlug = slugMap[sid] ? `${slugMap[sid]}-${datePart}_${seqPart}` : null;
          return { id: `${datePart}-${seqPart}-${sid}`, type: "jav", previewSlug };
        }
        return { id: `${dateMatch[1]}-${dateMatch[2]}`, type: "jav" };
      }
      const jav = input.match(/([A-Z]{2,10})-?(\d{2,8})/);
      if (jav) {
        const prefix = jav[1];
        const lowerUrl = url.toLowerCase();
        const lowerInput = input.toLowerCase();
        if (prefix === "DM" && (lowerUrl.includes("/dm") || lowerInput.includes("/dm"))) return null;
        if (["PAGE", "LIST", "NEW", "BEST"].includes(prefix)) return null;
        const blacklist = JAV_PREFIX_BLACKLIST;
        if (!blacklist.includes(prefix)) {
          return { id: `${prefix}-${jav[2]}`, type: "jav" };
        }
      }
      const fc2Raw = input.match(/(?:^|[^A-Z0-9])(\d{5,10})(?:$|[^A-Z0-9])/);
      if (fc2Raw) return { id: fc2Raw[1], type: "fc2" };
      return null;
    },
    cleanActressName: (name) => {
      if (!name) return null;
      const n = name.trim();
      const blacklist = ACTRESS_BLACKLIST;
      if (blacklist.some((reg) => reg.test(n))) return null;
      if (n.length > VALIDATION.ACTRESS_NAME_MAX_LENGTH || n.length < VALIDATION.ACTRESS_NAME_MIN_LENGTH) return null;
      return n;
    },
    formatDate: (dateStr) => {
      if (!dateStr) return "";
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString(void 0, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        });
      } catch (e) {
        return dateStr;
      }
    },
    cleanImageUrl: (url) => {
      if (!url) return url;
      return url.replace(/!\d+x\d+\.(jpg|jpeg|png|webp)/gi, "");
    }
  };
  var AppEvents = ((AppEvents2) => {
    AppEvents2["BOOTSTRAP"] = "app:bootstrap";
    AppEvents2["SERVICES_READY"] = "app:services-ready";
    AppEvents2["UI_READY"] = "app:ui-ready";
    AppEvents2["STATE_CHANGED"] = "app:state-changed";
    AppEvents2["THEME_CHANGED"] = "ui:theme-changed";
    AppEvents2["LANGUAGE_CHANGED"] = "ui:language-changed";
    AppEvents2["GRID_CHANGED"] = "ui:grid-changed";
    AppEvents2["SYNC_STATUS_CHANGED"] = "sync:status-changed";
    AppEvents2["HISTORY_LOADED"] = "history:loaded";
    return AppEvents2;
  })(AppEvents || {});
  const CoreEvents = (() => {
    const handlers = new Map();
    return {
on(event, handler) {
        if (!handlers.has(event)) {
          handlers.set(event, new Set());
        }
        handlers.get(event).add(handler);
        return () => this.off(event, handler);
      },
off(event, handler) {
        const handlersSet = handlers.get(event);
        if (handlersSet) {
          handlersSet.delete(handler);
        }
      },
emit(event, data) {
        Logger$1.debug("CoreEvents", `Emit: ${event}`, data);
        const handlersSet = handlers.get(event);
        if (handlersSet) {
          handlersSet.forEach((handler) => {
            try {
              handler(data);
            } catch (e) {
              Logger$1.error("CoreEvents", `Error in handler for ${event}`, e);
            }
          });
        }
      }
    };
  })();
  const State = (() => {
    const defaults = {
      previewMode: "static",
      hideNoMagnet: false,
      hideCensored: false,
      enableHistory: true,
      hideViewed: false,
      enableFollows: false,
      loadExtraPreviews: false,
      enableQuickBar: true,
      enableMagnets: true,
      enableExternalLinks: true,
      enableActressName: true,
hideBlocked: true,
language: Storage.get("language", "auto") || "auto",
      lastSyncTs: UI_CONSTANTS.DEFAULT_TIMESTAMP,
      supabaseUrl: Storage.get("supabase_url", "") || "",
      supabaseKey: Storage.get("supabase_key", "") || "",
      webdavUrl: Storage.get("webdav_url", "") || "",
      webdavUser: Storage.get("webdav_user", "") || "",
      webdavPass: Storage.get("webdav_pass", "") || "",
      webdavPath: Storage.get("webdav_path", UI_CONSTANTS.DEFAULT_SYNC_FILENAME) || UI_CONSTANTS.DEFAULT_SYNC_FILENAME,
      syncMode: Storage.get("sync_mode", "none") || "none",
      syncStatus: "idle",
      syncInterval: 5,
      replaceFc2Covers: false
    };
    const stored = Storage.get(Config.STORAGE_KEYS.SETTINGS, {}) || {};
    if (stored.previewMode && !["static", "hover"].includes(stored.previewMode)) {
      stored.previewMode = defaults.previewMode;
    }
    const boolKeys = [
      "hideNoMagnet",
      "hideCensored",
      "enableHistory",
      "hideViewed",
      "enableFollows",
      "loadExtraPreviews",
      "enableQuickBar",
      "enableMagnets",
      "enableExternalLinks",
      "enableActressName",
      "hideBlocked",
      "replaceFc2Covers"
    ];
    boolKeys.forEach((key) => {
      if (stored[key] !== void 0 && typeof stored[key] !== "boolean") {
        stored[key] = Boolean(stored[key]);
      }
    });
    const rawState = { ...defaults, ...stored };
    let skipBroadcast = false;
    const saveState = (data) => {
      const { syncStatus: _syncStatus, ...toSave } = data;
      Storage.set(Config.STORAGE_KEYS.SETTINGS, toSave);
    };
    const store = new Proxy(rawState, {
      set(target, prop, value) {
        if (target[prop] === value) return true;
        target[prop] = value;
        if (prop !== "syncStatus") {
          saveState(target);
          if (!skipBroadcast) {
            __vitePreload(async () => {
              const { MessagingService: MessagingService2, MessageType: MessageType2 } = await Promise.resolve().then(() => MessagingService$1);
              return { MessagingService: MessagingService2, MessageType: MessageType2 };
            }, void 0 ).then(({ MessagingService: MessagingService2, MessageType: MessageType2 }) => {
              MessagingService2.broadcast(MessageType2.SETTING_UPDATE, { prop, value });
            });
          }
        }
        CoreEvents.emit(AppEvents.STATE_CHANGED, { prop, value });
        if (prop === "language") CoreEvents.emit(AppEvents.LANGUAGE_CHANGED, value);
        return true;
      }
    });
    __vitePreload(async () => {
      const { MessagingService: MessagingService2, MessageType: MessageType2 } = await Promise.resolve().then(() => MessagingService$1);
      return { MessagingService: MessagingService2, MessageType: MessageType2 };
    }, void 0 ).then(({ MessagingService: MessagingService2, MessageType: MessageType2 }) => {
      MessagingService2.onMessage((msg) => {
        if (msg.type === MessageType2.SETTING_UPDATE) {
          const { prop, value } = msg.payload;
          if (store[prop] !== value) {
            Logger$1.info("State", `Syncing setting ${prop} from other tab`);
            skipBroadcast = true;
            store[prop] = value;
            skipBroadcast = false;
          }
        }
      });
    });
    return {
      proxy: store,
on: (cb) => {
        return CoreEvents.on(AppEvents.STATE_CHANGED, ({ prop, value }) => cb(prop, value));
      }
    };
  })();
  const translations = {
    zh: {
      settingsTitle: SCRIPT_INFO.NAME,
      tabSettings: "偏好设置",
      tabStatistics: "统计与分析",
      tabData: "数据管理",
      tabAbout: "关于",
      tabDebug: "运行日志",
      tabDmca: "免责声明",
      groupFilters: "内容过滤",
      optionHideNoMagnet: "过滤无磁力资源",
      optionHideCensored: "过滤有码作品",
      optionHideViewed: "过滤已阅作品",
      optionHideBlocked: "隐藏已屏蔽内容",
      groupAppearance: "界面与交互",
      labelPreviewMode: "预览模式",
      previewModeStatic: "静态封面",
      previewModeHover: "悬停/点击播放",
      labelGridColumns: "网格布局",
      labelDefault: "默认",
      labelLanguage: "界面语言",
      langAuto: "自动跟随系统",
      langZh: "简体中文",
      langEn: "English",
      groupDataHistory: "功能增强",
      optionEnableHistory: "记录浏览历史",
      optionLoadExtraPreviews: "自动加载详情页预览",
      optionEnableQuickBar: "显示悬浮快捷球 (FAB)",
      optionEnableMagnets: "启用磁力链接搜索",
      optionEnableExternalLinks: "显示外部资源跳转按钮",
      optionEnableActressName: "显示演员名称",
      optionReplaceFc2Covers: "替换 FC2PPVDB 封面",
      labelCacheManagement: "存储维护",
      btnClearCache: "清空磁力缓存",
      labelHistoryManagement: "历史记录",
      btnClearHistory: "清空浏览历史",
      btnSaveAndApply: "保存设置",
      alertSettingsSaved: "设置已保存并生效",
      alertCacheCleared: "磁力缓存已释放",
      alertHistoryCleared: "浏览历史已清空",
      alertMarkedWanted: "已加入收藏",
      alertMarkedBlocked: "已屏蔽作品",
      menuOpenSettings: "⚙️ 脚本设置",
      tooltipCopyMagnet: "复制磁力",
      tooltipCopied: "已复制",
      tooltipLoading: "搜索中...",
      extraPreviewTitle: "预览画廊",
      alertNoPreview: "暂无预览资源",
      labelExternalLinks: "外部传送门",
      groupDataManagement: "数据备份",
      btnExportData: "导出备份",
      btnImportData: "恢复备份",
      btnResetDatabase: "重置所有数据",
      alertExportSuccess: "备份文件下载已开始",
      alertImportSuccess: "数据恢复成功，页面将刷新",
      alertImportError: "恢复失败：文件格式错误",
      tooltipMarkAsViewed: "标为已阅",
      tooltipMarkAsUnviewed: "标为未阅",
      tooltipMarkAsWanted: "收藏作品",
      tooltipMarkAsUnwanted: "取消收藏",
      tooltipMarkAsBlocked: "屏蔽作品",
      tooltipMarkAsUnblocked: "解除屏蔽",
      confirmResetDatabase: "危险操作：将清除所有历史和设置。确认重置？",
      alertDatabaseReset: "重置完成，即将刷新",
      groupWebDAV: "WebDAV 云同步",
      labelWebDAVUrl: "服务器地址",
      labelWebDAVUser: "账户",
      labelWebDAVPass: "密码/Token",
      labelWebDAVPath: "同步文件名",
      btnWebDAVTest: "连接测试",
      btnWebDAVSync: "手动同步",
      alertWebDAVSuccess: "连接成功",
      alertWebDAVError: "连接失败，请检查配置",
      alertWebDAVSyncSuccess: "云同步完成",
      alertWebDAVSyncError: "同步失败：",
      syncStatus: "同步状态",
      labelSyncMode: "同步策略",
      syncModeNone: "关闭",
      syncModeSupabase: "Supabase (高级)",
      syncModeWebDAV: "WebDAV (推荐)",
      labelLastSync: "上次同步",
      labelNever: "从未",
      labelSyncing: "正在同步...",
      alertSyncConflict: "发现云端数据更新",
      alertSyncLockActive: "其他标签页正在同步，请稍候",
      labelSyncInterval: "自动同步间隔",
      syncInterval0: "实时 (无限制)",
      syncInterval2: "2 分钟",
      syncInterval5: "5 分钟 (推荐)",
      syncInterval10: "10 分钟",
      syncInterval30: "30 分钟",
      syncIntervalManual: "仅手动",
      labelConflictTitle: "数据版本冲突",
      labelConflictDesc: "云端文件比本地更新。请选择合并策略：",
      btnMergeSync: "智能合并",
      btnForceLocal: "覆盖本地",
      confirmOverwriteLocal: "警告：将丢失本地未同步的历史。确定覆盖？",
      labelAdvancedConfig: "开发者配置",
      labelAuthEmail: "邮箱",
      labelAuthPass: "密码",
      btnConnectAndSync: "登录",
      btnForcePull: "强制拉取",
      btnLogout: "注销",
      alertLoginRequired: "请填写完整登录信息",
      alertSbUrlRequired: "缺少 Supabase URL",
      alertSyncAccountConnected: "账户已关联",
      alertPushAllQuery: "将本地所有数据推送到云端？",
      statusOn: "已开启",
      statusOff: "已关闭",
      labelSupabaseSync: "Supabase 同步",
      labelUser: "当前用户",
      labelNotLoggedIn: "未配置",
      labelConfigError: "配置无效",
      aboutDescription: "极致的 FC2/JAVDB 增强套件。极速磁力聚合、沉浸式画廊、跨端历史同步。",
      aboutHelpTitle: "核心特性",
      aboutHelpContent: "• <b>极速磁力</b>：实时聚合 Sukebei 与 0cili，智能去重，一点即达。\n• <b>沉浸画廊</b>：详情页重构，支持键盘翻页 (←/→) 与空间导航。\n• <b>秒级预览</b>：鼠标悬停即享高清视频预览，所见即所得。\n• <b>云端同步</b>：支持 WebDAV 协议 (坚果云/InfiniCLOUD)，多设备无缝接力。",
      aboutLinks: "友情链接",
      aboutVersion: "当前版本",
      navExtraPreviews: "画廊",
      labelTechnicalLogs: "运行日志",
      btnCopy: "复制",
      btnCopyAll: "复制全部",
      btnClearLogs: "清空",
      alertLogsCopied: "日志已复制到剪贴板",
      labelLogFilters: "筛选",
      tooltipClickToCopy: "点击复制",
      btnCancel: "取消",
      btnSave: "保存更改",
      btnBackToTop: "顶部",
      labelDebugMode: "调试模式",
      statusDebugOn: "已开启",
      statusDebugOff: "已关闭",
      alertDebugOn: "已开启调试模式 (可在运行日志查看)",
      alertDebugOff: "已关闭调试模式",
      groupExternalImport: "外部数据导入",
      btnImportFromJavDB: "从 JavDB 导入历史",
      alertImportingJavDB: "正在从 JavDB 抓取存量数据 (已看/想看)，请稍候...",
      alertMarkedViewed: "已标记",
      tooltipCopyId: "复制番号",
      verifyCF: "点击验证 CF",
      dmcaContent: "本脚本仅为辅助工具，<b>不存储任何视频或图片文件</b>。所有内容（包括图片、磁力链接等）均来自第三方公开网站。使用者需自行承担因使用本工具产生的一切法律后果。如果本工具展示的内容侵犯了您的权利，请直接联系内容来源网站进行删除。",
      confirmReloadSettings: "部分设置需要刷新页面才能生效,是否立即刷新?",
      errorWebDAVUrl: "URL 必须以 http:// 或 https:// 开头",
      btnPushPull: "同步 (Push/Pull)",
      btnLogData: "数据详情",
      labelLogData: "日志数据",
      labelDisclaimer: "免责条款",
      labelGreasyFork: "脚本主页",
      labelHidden: "隐藏",
      labelVisible: "显示",
      shortcutFocusSearch: "聚焦搜索",
      shortcutOpenSettings: "打开设置",
      shortcutToggleViewed: "切换隐藏已看",
      shortcutToggleMagnet: "切换隐藏无磁力",
      shortcutToggleCensored: "切换隐藏有码",
      shortcutReload: "刷新页面",
      shortcutHelp: "显示快捷键帮助",
      shortcutCloseModal: "关闭模态窗口",
      labelShortcutsTitle: "键盘快捷键",
      labelShortcutKey: "快捷键",
      labelShortcutAction: "功能",
      statusViewed: "已看内容",
      statusNoMagnet: "无磁力内容",
      statusCensored: "有码内容",
      labelLoading: "加载中...",
      alertLoggedOut: "已退出登录",
      alertUserIdMissing: "同步失败：缺少用户 ID，请重新登录"
    },
    en: {
      settingsTitle: SCRIPT_INFO.NAME,
      tabSettings: "Preferences",
      tabStatistics: "Analytics",
      tabData: "Data & Sync",
      tabAbout: "About",
      tabDebug: "Technical Logs",
      tabDmca: "Disclaimer",
      groupFilters: "Filters",
      optionHideNoMagnet: "Filter No-Magnet",
      optionHideCensored: "Filter Censored",
      optionHideViewed: "Filter Viewed",
      optionHideBlocked: "Filter Blocked",
      groupAppearance: "Appearance",
      labelPreviewMode: "Preview Mode",
      previewModeStatic: "Static Cover",
      previewModeHover: "Hover/Click Play",
      labelGridColumns: "Grid Columns",
      labelDefault: "Default",
      labelLanguage: "Language",
      langAuto: "Auto",
      langZh: "Chinese",
      langEn: "English",
      groupDataHistory: "Enhancements",
      optionEnableHistory: "Track History",
      optionLoadExtraPreviews: "Preload Gallery",
      optionEnableQuickBar: "Show Quick FAB",
      optionEnableMagnets: "Enable Magnet Search",
      optionEnableExternalLinks: "Show External Links",
      optionEnableActressName: "Show Actress Name",
      optionReplaceFc2Covers: "Replace FC2PPVDB Covers",
      labelCacheManagement: "Storage",
      btnClearCache: "Clear Magnet Cache",
      labelHistoryManagement: "History",
      btnClearHistory: "Clear History",
      btnSaveAndApply: "Save Changes",
      alertSettingsSaved: "Settings saved",
      alertCacheCleared: "Cache cleared",
      alertHistoryCleared: "History cleared",
      menuOpenSettings: "⚙️ Settings",
      tooltipCopyMagnet: "Magnet",
      tooltipCopied: "Copied",
      tooltipLoading: "Searching...",
      extraPreviewTitle: "Gallery",
      alertNoPreview: "No Previews",
      labelExternalLinks: "Links",
      groupDataManagement: "Backup",
      btnExportData: "Export Backup",
      btnImportData: "Restore Backup",
      btnResetDatabase: "Reset All",
      alertExportSuccess: "Backup started",
      alertImportSuccess: "Restore successful, refreshing...",
      alertImportError: "Restore failed: Invalid file",
      tooltipMarkAsViewed: "Mark viewed",
      tooltipMarkAsUnviewed: "Unmark viewed",
      tooltipMarkAsWanted: "Add to Wanted",
      tooltipMarkAsUnwanted: "Remove from Wanted",
      tooltipMarkAsBlocked: "Block this",
      tooltipMarkAsUnblocked: "Unblock this",
      confirmResetDatabase: "Danger: Delete ALL data and settings?",
      alertDatabaseReset: "Reset complete",
      groupWebDAV: "WebDAV Sync",
      labelWebDAVUrl: "Server URL",
      labelWebDAVUser: "Username",
      labelWebDAVPass: "Password/Token",
      labelWebDAVPath: "Filename",
      btnWebDAVTest: "Test",
      btnWebDAVSync: "Sync Now",
      alertWebDAVSuccess: "Connected",
      alertWebDAVError: "Connection failed",
      alertWebDAVSyncSuccess: "Sync Complete",
      alertWebDAVSyncError: "Sync Failed: ",
      syncStatus: "Status",
      labelSyncMode: "Strategy",
      syncModeNone: "Off",
      syncModeSupabase: "Supabase (Adv)",
      syncModeWebDAV: "WebDAV (Rec)",
      labelLastSync: "Last Sync",
      labelNever: "Never",
      labelSyncing: "Syncing...",
      alertSyncConflict: "Remote Update Detected",
      alertSyncLockActive: "Sync in progress in another tab...",
      labelSyncInterval: "Auto-Sync Interval",
      syncInterval0: "Real-time (No limit)",
      syncInterval2: "2 minutes",
      syncInterval5: "5 minutes (Recommended)",
      syncInterval10: "10 minutes",
      syncInterval30: "30 minutes",
      syncIntervalManual: "Manual only",
      labelConflictTitle: "Conflict",
      labelConflictDesc: "Remote data is newer. Strategy:",
      btnMergeSync: "Merge",
      btnForceLocal: "Overwrite",
      confirmOverwriteLocal: "Overwrite local history from remote?",
      labelAdvancedConfig: "Dev Config",
      labelAuthEmail: "Email",
      labelAuthPass: "Password",
      btnConnectAndSync: "Login",
      btnForcePull: "Force Pull",
      btnLogout: "Logout",
      alertLoginRequired: "Credentials missing",
      alertSbUrlRequired: "URL missing",
      alertSyncAccountConnected: "Connected",
      alertPushAllQuery: "Push all local data?",
      statusOn: "ON",
      statusOff: "OFF",
      labelSupabaseSync: "Supabase",
      labelUser: "User",
      labelNotLoggedIn: "Not Configured",
      labelConfigError: "Config Error",
      aboutDescription: "The ultimate enhancement suite for FC2 & JAVDB. Blazing fast magnets, HD previews, and immersive layout.",
      aboutHelpTitle: "Features",
      aboutHelpContent: "• <b>Fast Magnets</b>: Aggregated Sukebei & 0cili search, instant results.\n• <b>Immersive Gallery</b>: Refined layout with keyboard navigation (←/→).\n• <b>Instant Preview</b>: HD video on hover, zero delay.\n• <b>Cloud Sync</b>: Seamless history sync via WebDAV (InfiniCLOUD supported).",
      aboutLinks: "Links",
      aboutVersion: "Version",
      navExtraPreviews: "Gallery",
      labelTechnicalLogs: "Technical Logs",
      btnCopy: "Copy",
      btnCopyAll: "Copy All",
      btnClearLogs: "Clear",
      alertLogsCopied: "Logs copied to clipboard",
      labelLogFilters: "Filters",
      tooltipClickToCopy: "Copy",
      btnCancel: "Cancel",
      btnSave: "Save",
      btnBackToTop: "Top",
      labelDebugMode: "Debug",
      statusDebugOn: "Debug ON",
      statusDebugOff: "Normal",
      alertDebugOn: "Debug Enabled",
      alertDebugOff: "Debug Disabled",
      groupExternalImport: "External Import",
      btnImportFromJavDB: "Import from JavDB",
      alertImportingJavDB: "Importing stocks from JavDB (Watched/Wanted), please wait...",
      alertMarkedViewed: "Marked",
      tooltipCopyId: "Copy ID",
      verifyCF: "Verify CF",
      dmcaContent: "This script is a utility tool and <b>does NOT host any video or image files</b>. All content (including images, magnet links) is provided by third-party public public websites. Users assume full responsibility for using this tool. If content displayed by this tool infringes your rights, please contact the source website directly for removal.",
      confirmReloadSettings: "Some settings require a reload to take effect. Reload now?",
      errorWebDAVUrl: "URL must start with http:// or https://",
      btnPushPull: "Push/Pull",
      btnLogData: "Data",
      labelLogData: "Log Data",
      labelDisclaimer: "Disclaimer",
      labelGreasyFork: "Greasy Fork",
      labelHidden: "Hidden",
      labelVisible: "Visible",
      shortcutFocusSearch: "Focus Search",
      shortcutOpenSettings: "Open Settings",
      shortcutToggleViewed: "Toggle Viewed",
      shortcutToggleMagnet: "Toggle No-Magnet",
      shortcutToggleCensored: "Toggle Censored",
      shortcutReload: "Reload Page",
      shortcutHelp: "Show Shortcuts Help",
      shortcutCloseModal: "Close Modal",
      labelShortcutsTitle: "Keyboard Shortcuts",
      labelShortcutKey: "Shortcut",
      labelShortcutAction: "Action",
      statusViewed: "Viewed Content",
      statusNoMagnet: "No-Magnet Content",
      statusCensored: "Censored Content",
      labelLoading: "Loading...",
      alertLoggedOut: "Logged out",
      alertUserIdMissing: "Sync failed: User ID missing. Please login again."
    }
  };
  const Localization = {
    _translations: translations,
t(key, params) {
      const lang = State.proxy.language === "auto" ? navigator.language.startsWith("zh") ? "zh" : "en" : State.proxy.language;
      const set = this._translations[lang] || this._translations.en;
      let value = this.resolvePath(set, key) || this.resolvePath(this._translations.en, key) || key;
      if (params && typeof value === "string") {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(new RegExp(`{${k}}`, "g"), String(v));
        });
      }
      return value;
    },
resolvePath(obj, path) {
      try {
        return path.split(".").reduce((prev, curr) => prev?.[curr], obj) ?? null;
      } catch {
        return null;
      }
    },
register(lang, newTranslations) {
      if (!this._translations[lang]) this._translations[lang] = {};
      this.deepMerge(this._translations[lang], newTranslations);
    },
    deepMerge(target, source) {
      for (const key in source) {
        if (source[key] instanceof Object && key in target) {
          Object.assign(source[key], this.deepMerge(target[key], source[key]));
        }
      }
      Object.assign(target || {}, source);
      return target;
    }
  };
  const t = (key, params) => Localization.t(key, params);
  const h = (tag, props = {}, ...children) => {
    const el = document.createElement(tag);
    for (const [key, val] of Object.entries(props)) {
      if (key === "className") el.className = val;
      else if (key === "style" && typeof val === "object") Object.assign(el.style, val);
      else if (key === "dataset" && typeof val === "object") Object.assign(el.dataset, val);
      else if (key.startsWith("on") && typeof val === "function") {
        const eventName = key.toLowerCase().substring(2);
        el.addEventListener(eventName, val);
      } else if (key === "innerHTML") el.innerHTML = val;
      else if (val !== null && val !== void 0 && val !== false) {
        if (key in el) el[key] = val;
        else el.setAttribute(key, String(val));
      }
    }
    children.flat().forEach((child) => {
      if (child === null || child === void 0 || child === false) return;
      el.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return el;
  };
  const IconArrowUp = '<svg viewBox="0 0 384 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>';
  const IconGear = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M495.9 166.6c3.2 8.7.5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4l-55.6 17.8c-8.8 2.8-18.6.3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4c-1.1-8.4-1.7-16.9-1.7-25.5s.6-17.1 1.7-25.4l-43.3-39.4c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160a80 80 0 1 0 0 160"/></svg>';
  const IconBan = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5m45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5zM0 256a256 256 0 1 1 512 0a256 256 0 1 1-512 0"/></svg>';
  const IconMagnet = '<svg viewBox="0 0 448 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M0 160v96c0 123.7 100.3 224 224 224s224-100.3 224-224v-96H320v96c0 53-43 96-96 96s-96-43-96-96v-96zm0-32h128V64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64zm320 0h128V64c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32z"/></svg>';
  const IconEyeSlash = '<svg viewBox="0 0 640 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2s-6.3 25.5 4.1 33.7l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-105.2-82.4c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8zm184.3 144.4c25.5-23.3 59.6-37.5 96.9-37.5c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9.5-13.6 1.4-20.2l-94.3-74.3c-22.8 29.7-39.1 59.3-48.6 82.2c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1c47 43.8 111.7 80.6 192.5 80.6c47.8 0 89.9-12.9 126.2-32.5z"/></svg>';
  const IconRotate = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5S38.9 198 44.8 181.4c10.8-30.7 28.4-59.4 52.8-83.8c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2S496 62.3 496 72v128c0 13.3-10.7 24-24 24H344c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24h128c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440V312.1z"/></svg>';
  const IconPlus = '<svg viewBox="0 0 448 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256z"/></svg>';
  const IconImages = '<svg viewBox="0 0 576 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M160 32c-35.3 0-64 28.7-64 64v224c0 35.3 28.7 64 64 64h352c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm236 106.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320H200c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6l56-84c4.5-6.6 12-10.6 20-10.6s15.5 4 20 10.7M192 128a32 32 0 1 1 64 0a32 32 0 1 1-64 0m-144-8c0-13.3-10.7-24-24-24S0 106.7 0 120v224c0 75.1 60.9 136 136 136h320c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88z"/></svg>';
  const IconSpinner = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M304 48a48 48 0 1 0-96 0a48 48 0 1 0 96 0m0 416a48 48 0 1 0-96 0a48 48 0 1 0 96 0M48 304a48 48 0 1 0 0-96a48 48 0 1 0 0 96m464-48a48 48 0 1 0-96 0a48 48 0 1 0 96 0M142.9 437A48 48 0 1 0 75 369.1a48 48 0 1 0 67.9 67.9m0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437a48 48 0 1 0 67.9-67.9a48 48 0 1 0-67.9 67.9"/></svg>';
  const IconCircleCheck = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M256 512a256 256 0 1 0 0-512a256 256 0 1 0 0 512m113-303L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';
  const IconCircleXmark = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M256 512a256 256 0 1 0 0-512a256 256 0 1 0 0 512m-81-337c9.4-9.4 24.6-9.4 33.9 0l47 47l47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47l47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47l-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47l-47-47c-9.4-9.4-9.4-24.6 0-33.9"/></svg>';
  const IconTriangleExclamation = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7.2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8.2-40.1l216-368C228.7 39.5 241.8 32 256 32m0 128c-13.3 0-24 10.7-24 24v112c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24m32 224a32 32 0 1 0-64 0a32 32 0 1 0 64 0"/></svg>';
  const IconCircleInfo = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M256 512a256 256 0 1 0 0-512a256 256 0 1 0 0 512m-40-176h24v-64h-24c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-80c-13.3 0-24-10.7-24-24s10.7-24 24-24m40-208a32 32 0 1 1 0 64a32 32 0 1 1 0-64"/></svg>';
  const IconXmark = '<svg viewBox="0 0 384 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7L86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256L41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256z"/></svg>';
  const IconSliders = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M0 416c0 17.7 14.3 32 32 32h54.7c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H233.3c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48H32c-17.7 0-32 14.3-32 32m128 0a32 32 0 1 1 64 0a32 32 0 1 1-64 0m192-160a32 32 0 1 1 64 0a32 32 0 1 1-64 0m32-80c-32.8 0-61 19.7-73.3 48H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h246.7c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48H480c17.7 0 32-14.3 32-32s-14.3-32-32-32h-54.7c-12.3-28.3-40.5-48-73.3-48m-160-48a32 32 0 1 1 0-64a32 32 0 1 1 0 64m73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48H32C14.3 64 0 78.3 0 96s14.3 32 32 32h86.7c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48H480c17.7 0 32-14.3 32-32s-14.3-32-32-32z"/></svg>';
  const IconDatabase = '<svg viewBox="0 0 448 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0s224 35.8 224 80m-54.8 134.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3M0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432z"/></svg>';
  const IconFilter = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M3.9 54.9C10.5 40.9 24.5 32 40 32h432c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6v-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9"/></svg>';
  const IconPalette = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M512 256v2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4.4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5.1-7 .2-10.6.2C114.6 512 0 397.4 0 256S114.6 0 256 0s256 114.6 256 256m-384 32a32 32 0 1 0-64 0a32 32 0 1 0 64 0m0-96a32 32 0 1 0 0-64a32 32 0 1 0 0 64m160-96a32 32 0 1 0-64 0a32 32 0 1 0 64 0m96 96a32 32 0 1 0 0-64a32 32 0 1 0 0 64"/></svg>';
  const IconClockRotateLeft = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24h110.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75m181 53c-13.3 0-24 10.7-24 24v104c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z"/></svg>';
  const IconFileExport = '<svg viewBox="0 0 576 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M0 64C0 28.7 28.7 0 64 0h160v128c0 17.7 14.3 32 32 32h128v128H216c-13.3 0-24 10.7-24 24s10.7 24 24 24h168v112c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64zm384 272v-48h110.1l-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39zm0-208H256V0z"/></svg>';
  const IconFileImport = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M128 64c0-35.3 28.7-64 64-64h160v128c0 17.7 14.3 32 32 32h128v288c0 35.3-28.7 64-64 64H192c-35.3 0-64-28.7-64-64V336h174.1l-39 39c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l39 39l-174.1.1zm0 224v48H24c-13.3 0-24-10.7-24-24s10.7-24 24-24zm384-160H384V0z"/></svg>';
  const IconChevronLeft = '<svg viewBox="0 0 320 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256L246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>';
  const IconChevronRight = '<svg viewBox="0 0 320 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256L73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>';
  const IconEye = '<svg viewBox="0 0 576 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32M144 256a144 144 0 1 1 288 0a144 144 0 1 1-288 0m144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3"/></svg>';
  const IconLink = '<svg viewBox="0 0 640 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5l112.2-112.3c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0z"/></svg>';
  const IconCaretDown = '<svg viewBox="0 0 320 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301 191.9 288 191.9L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>';
  const IconBolt = '<svg viewBox="0 0 448 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288h111.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5z"/></svg>';
  const IconPlayCircle = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M0 256a256 256 0 1 1 512 0a256 256 0 1 1-512 0m188.3-108.9c-7.6 4.2-12.3 12.3-12.3 20.9v176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>';
  const IconListUl = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M64 144a48 48 0 1 0 0-96a48 48 0 1 0 0 96m128-80c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32zM64 464a48 48 0 1 0 0-96a48 48 0 1 0 0 96m48-208a48 48 0 1 0-96 0a48 48 0 1 0 96 0"/></svg>';
  const IconServer = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96v64c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm280 72a24 24 0 1 1 0 48a24 24 0 1 1 0-48m48 24a24 24 0 1 1 48 0a24 24 0 1 1-48 0M64 288c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64v-64c0-35.3-28.7-64-64-64zm280 72a24 24 0 1 1 0 48a24 24 0 1 1 0-48m56 24a24 24 0 1 1 48 0a24 24 0 1 1-48 0"/></svg>';
  const IconMagnifyingGlass = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7l126.6 126.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208M208 352a144 144 0 1 0 0-288a144 144 0 1 0 0 288"/></svg>';
  const IconStar = '<svg viewBox="0 0 576 512" width="1.2em" height="1.2em" fill="currentColor"><path fill="currentColor" d="M316.9 18L256 126.3L195.1 18c-11.7-20.7-41.5-20.7-53.2 0l-57.8 102.3l-114.7 16c-23.7 3.3-33.2 32.4-16 49.3L42 278.4l-22.1 128.8c-4 23.3 20.6 41.2 41.6 30.2L160 374l98.5 63.3c20.9 11 45.6-7 41.6-30.2L278 278.4l88.7-92.8c17.2-16.9 7.7-46-16-49.3l-114.7-16L178.2 18c-11.7-20.7-41.5-20.7-53.2 0z"/></svg>';
  const UIUtils = {
    h,
    icon: (svgContent, className = "") => {
      return h("span", { className: `fc2-icon ${className}`.trim(), innerHTML: svgContent });
    },
    copyButtonBehavior: (btn, textToCopy, i18nCopied) => {
      if (btn.dataset.copied === "true") return;
      Utils.copyToClipboard(textToCopy);
      const originalText = btn.textContent;
      btn.textContent = i18nCopied;
      btn.dataset.copied = "true";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.dataset.copied = "false";
      }, 1500);
    },
    markByStatus: (id, status, el, applyVisibility) => {
      if (!State.proxy.enableHistory) return;
      HistoryManager.add(id, status);
      const c = el.closest(`.${Config.CLASSES.processedCard}`) || el;
      if (c) {
        if (status === "blocked") {
          c.classList.add(Config.CLASSES.isBlocked);
        } else if (status === "wanted") {
          c.classList.add(Config.CLASSES.isWanted);
        } else if (status === "downloaded") {
          c.classList.add(Config.CLASSES.isDownloaded);
        } else {
          c.classList.add(Config.CLASSES.isViewed);
        }
        const vBtn = c.querySelector(".btn-toggle-view");
        if (vBtn && status === "watched") vBtn.classList.add("is-viewed");
        const oc = c.classList.contains(Config.CLASSES.cardRebuilt) ? c : c.closest(`.${Config.CLASSES.cardRebuilt}`);
        if (oc) {
          applyVisibility(oc);
        }
      }
    },
    toggleLoading: (cont, show, btnCreator) => {
      if (!cont?.isConnected) return;
      const spinner = cont.querySelector(`.${Config.CLASSES.btnLoading}`);
      if (show) {
        if (!spinner) {
          const btn = btnCreator(IconSpinner, "Loading...", "#");
          btn.classList.add(Config.CLASSES.btnLoading);
          cont.appendChild(btn);
        }
        cont.classList.add("fc2-skeleton");
      } else {
        if (spinner) spinner.remove();
        cont.classList.remove("fc2-skeleton");
      }
    },
    applyCardVisibility: (c, hasM) => c?.classList.toggle(Config.CLASSES.hideNoMagnet, State.proxy.hideNoMagnet && !hasM),
    applyCensoredFilter: (c) => {
      const isSupjav = location.hostname.includes("supjav");
      c?.classList.toggle(
        Config.CLASSES.hideCensored,
        isSupjav && State.proxy.hideCensored && c.classList.contains(Config.CLASSES.isCensored)
      );
    },
    applyHistoryVisibility: (c) => {
      if (!c) return;
      const isSearchPage = location.pathname.includes("/search") || location.search.includes("search") || location.search.includes("q=") || location.pathname.includes("/cn/search") || location.pathname.includes("/en/search") || location.pathname.includes("/ja/search");
      c.classList.toggle(
        Config.CLASSES.hideViewed,
        !isSearchPage && State.proxy.hideViewed && c.classList.contains(Config.CLASSES.isViewed)
      );
      c.classList.toggle(
        Config.CLASSES.hideBlocked,
        c.classList.contains(Config.CLASSES.isBlocked)
      );
    }
  };
  const Toast$1 = {
    container: null,
    toasts: new Set(),
    init() {
      if (this.container) return;
      this.container = h("div", { className: "fc2-toast-container" });
      document.body.appendChild(this.container);
    },
    show(message, type = "info", options = {}) {
      this.init();
      const duration = options.duration === 0 ? 0 : options.duration || 3e3;
      const showClose = options.showClose ?? true;
      const iconSvg = type === "success" ? IconCircleCheck : type === "error" ? IconCircleXmark : type === "warn" ? IconTriangleExclamation : IconCircleInfo;
      const colorMap = {
        success: UI_TOKENS.COLORS.SUCCESS,
        error: UI_TOKENS.COLORS.ERROR,
        warn: UI_TOKENS.COLORS.WARN,
        info: UI_TOKENS.COLORS.INFO
      };
      const color = colorMap[type];
      const progress = duration > 0 ? h("div", {
        className: "fc2-toast-progress",
        style: {
          position: "absolute",
          bottom: "0",
          left: "0",
          height: "3px",
          width: "100%",
          background: color,
          transformOrigin: "left",
          animation: `fc2-toast-shrink ${duration}ms linear forwards`
        }
      }) : null;
      const closeIcon = UIUtils.icon(IconXmark);
      const closeBtn = showClose ? h("button", {
        className: "fc2-toast-close",
        "aria-label": "关闭",
        style: {
          background: "none",
          border: "none",
          color: UI_TOKENS.COLORS.TEXT_DIM,
          cursor: "pointer",
          padding: `0 ${UI_TOKENS.SPACING.XS}`,
          fontSize: "14px",
          marginLeft: UI_TOKENS.SPACING.SM,
          transition: "color 0.2s",
          display: "flex",
          alignItems: "center"
        },
        onclick: (e) => {
          e.stopPropagation();
          this.remove(el);
        },
        onmouseenter: (e) => e.target.style.color = UI_TOKENS.COLORS.WHITE,
        onmouseleave: (e) => e.target.style.color = UI_TOKENS.COLORS.TEXT_DIM
      }, closeIcon) : null;
      const mainIconContainer = UIUtils.icon(iconSvg);
      Object.assign(mainIconContainer.style, {
        color,
        fontSize: "18px",
        marginRight: UI_TOKENS.SPACING.MD,
        flexShrink: "0"
      });
      const el = h(
        "div",
        {
          className: `fc2-toast-item toast-${type}`,
          style: {
            borderLeft: `4px solid ${color}`,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            padding: `${UI_TOKENS.SPACING.MD} ${UI_TOKENS.SPACING.LG}`,
            marginBottom: UI_TOKENS.SPACING.SM,
            borderRadius: UI_TOKENS.RADIUS.MD,
            background: UI_TOKENS.BACKDROP.COLOR,
            backdropFilter: `blur(${UI_TOKENS.BACKDROP.BLUR})`,
            boxShadow: UI_TOKENS.BACKDROP.SHADOW,
            color: UI_TOKENS.COLORS.WHITE,
            transform: "translateX(100%)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            opacity: "0",
            pointerEvents: "auto",
            minWidth: "200px",
            maxWidth: "350px"
          },
          onclick: options.onClick
        },
        mainIconContainer,
        h("span", { style: { flexGrow: "1", fontSize: "14px", lineHeight: "1.4" } }, message),
        closeBtn,
        progress
      );
      this.container.appendChild(el);
      this.toasts.add(el);
      requestAnimationFrame(() => {
        el.style.transform = "translateX(0)";
        el.style.opacity = "1";
      });
      if (duration > 0) {
        setTimeout(() => this.remove(el), duration);
      }
      return el;
    },
    remove(el) {
      if (!this.toasts.has(el)) return;
      el.style.transform = "translateX(120%)";
      el.style.opacity = "0";
      setTimeout(() => {
        el.remove();
        this.toasts.delete(el);
      }, 400);
    }
  };
  const http = (url, options = {}) => {
    const respType = options.responseType || options.type || "json";
    let data = options.data || options.body;
    if (data && typeof data === "object") data = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method || "GET",
        url,
        headers: { "Content-Type": "application/json", ...options.headers },
        data,
        timeout: Config.TIMEOUTS.API,
        responseType: respType === "json" ? "json" : "text",
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            if (respType === "json") {
              try {
                resolve(res.response || JSON.parse(res.responseText));
              } catch (_e) {
                resolve(res.responseText);
              }
            } else {
              resolve(res.responseText || res.response);
            }
          } else {
            reject({ status: res.status, statusText: res.statusText, response: res.responseText });
          }
        },
        onerror: (err) => reject({ status: 0, statusText: "Network Error", error: err }),
        ontimeout: () => reject({ status: 408, statusText: "Timeout" })
      });
    });
  };
  const SupabaseProvider = (() => {
    let isSyncing = false;
    let needsRetry = false;
    let _onProgress = null;
    const _getSupabaseConfig = () => {
      const url = GM_getValue(STORAGE_KEYS.SUPABASE_URL) || "";
      const key = GM_getValue(STORAGE_KEYS.SUPABASE_KEY) || "";
      return { url, key };
    };
    const _request = async (endpoint, method, body = null, headers = {}) => {
      const { url, key } = _getSupabaseConfig();
      if (!url || !key) return Promise.reject("No Supabase config");
      if (!url.startsWith("http")) {
        return Promise.reject(`Invalid Supabase URL: ${url}. Please ensure it starts with https://`);
      }
      return http(`${url}${endpoint}`, {
        method,
        headers: { apikey: key, "Content-Type": "application/json", ...headers },
        data: body
      });
    };
    const _getAuthHeader = async () => {
      const { url, key } = _getSupabaseConfig();
      if (!url || !key) return null;
      const jwt = GM_getValue(STORAGE_KEYS.SUPABASE_JWT);
      if (jwt) {
        try {
          if (JSON.parse(atob(jwt.split(".")[1])).exp * 1e3 > Date.now() + 6e4) return `Bearer ${jwt}`;
        } catch (e) {
        }
      }
      const refresh = GM_getValue(STORAGE_KEYS.SUPABASE_REFRESH);
      if (!refresh) return null;
      try {
        const data = await _request("/auth/v1/token?grant_type=refresh_token", "POST", { refresh_token: refresh });
        if (data && data.access_token) {
          GM_setValue(STORAGE_KEYS.SYNC_USER_ID, data.user.id);
          GM_setValue(STORAGE_KEYS.SUPABASE_JWT, data.access_token);
          GM_setValue(STORAGE_KEYS.SUPABASE_REFRESH, data.refresh_token);
          GM_setValue(STORAGE_KEYS.CURRENT_USER_EMAIL, data.user.email);
          return `Bearer ${data.access_token}`;
        }
      } catch (e) {
        Logger$1.error("Supabase", "Token refresh failed", e);
        logout(true);
      }
      return null;
    };
    const logout = (silent = false) => {
      [STORAGE_KEYS.SYNC_USER_ID, STORAGE_KEYS.SUPABASE_JWT, STORAGE_KEYS.SUPABASE_REFRESH, STORAGE_KEYS.CURRENT_USER_EMAIL, STORAGE_KEYS.LAST_SYNC_TS].forEach(
        (k) => GM_deleteValue(k)
      );
      if (!silent) {
        Toast$1.show(t("alertLoggedOut"), "success");
        setTimeout(() => location.reload(), 800);
      }
    };
    return {
      name: "supabase",
      set onProgress(val) {
        _onProgress = val;
      },
      get onProgress() {
        return _onProgress;
      },
      async login(email, password) {
        Logger$1.info("Supabase", `Attempting login for: ${email}`);
        const data = await _request("/auth/v1/token?grant_type=password", "POST", { email, password });
        if (data && data.access_token) {
          GM_setValue(STORAGE_KEYS.SYNC_USER_ID, data.user.id);
          GM_setValue(STORAGE_KEYS.SUPABASE_JWT, data.access_token);
          GM_setValue(STORAGE_KEYS.SUPABASE_REFRESH, data.refresh_token);
          GM_setValue(STORAGE_KEYS.CURRENT_USER_EMAIL, data.user.email);
          GM_setValue(STORAGE_KEYS.LAST_SYNC_TS, UI_CONSTANTS.DEFAULT_TIMESTAMP);
          Logger$1.success("Supabase", `Login successful: ${email}`);
          return data.user;
        }
        throw new Error("Login failed");
      },
      async signup(email, password) {
        return await _request("/auth/v1/signup", "POST", { email, password });
      },
      logout,
      async performSync(isManual = false) {
        if (isSyncing) {
          needsRetry = true;
          return;
        }
        const runSync = async () => {
          Logger$1.group("Supabase", "🔄 Starting Supabase sync");
          Logger$1.time("Supabase.sync");
          isSyncing = true;
          if (isManual) Toast$1.show(t("labelSyncing"), "info");
          try {
            State.proxy.syncStatus = SYNC_STATUS.SYNCING;
            const auth = await _getAuthHeader();
            if (!auth) {
              Logger$1.error("Supabase", "No valid JWT token");
              if (isManual) Toast$1.show(t("alertLoginRequired"), "error");
              State.proxy.syncStatus = SYNC_STATUS.ERROR;
              Logger$1.groupEnd();
              return;
            }
            let lastSync = GM_getValue(STORAGE_KEYS.LAST_SYNC_TS, UI_CONSTANTS.DEFAULT_TIMESTAMP);
            const syncStartedAt = ( new Date()).toISOString();
            const dirtyRecords = await Repository.db.history.where("sync_dirty").equals(1).limit(200).toArray();
            if (dirtyRecords.length > 0) {
              Logger$1.info("Supabase", `Pushing ${dirtyRecords.length} dirty records`);
              const userId = GM_getValue(STORAGE_KEYS.SYNC_USER_ID);
              if (!userId) {
                Logger$1.error("Supabase", "User ID missing");
                if (isManual) Toast$1.show(t("alertUserIdMissing"), "error");
                State.proxy.syncStatus = SYNC_STATUS.ERROR;
                Logger$1.groupEnd();
                return;
              }
              if (_onProgress) _onProgress({ phase: "Pushing local data", percent: 30 });
              const payload = dirtyRecords.map((r) => ({
                fc2_id: isNaN(Number(r.id)) ? r.id : parseInt(r.id, 10),
                last_watched_at: new Date(r.timestamp).toISOString(),
                status: r.status || "watched",
                is_deleted: !!r.is_deleted,
                user_id: userId
              }));
              await _request("/rest/v1/user_history", "POST", payload, {
                Authorization: auth,
                Prefer: "resolution=merge-duplicates"
              });
              Logger$1.success("Supabase", `Pushed ${dirtyRecords.length} records`);
              const cleanedIds = dirtyRecords.map((r) => r.id);
              await Repository.db.history.where("id").anyOf(cleanedIds).modify({ sync_dirty: 0 });
              if (dirtyRecords.length === 200) needsRetry = true;
            }
            if (_onProgress) _onProgress({ phase: "Fetching remote data", percent: 60 });
            let page = 0;
            let hasMore = true;
            const pageSize = 1e3;
            let maxTs = lastSync;
            let pulledCount = 0;
            while (hasMore) {
              const rangeStart = page * pageSize;
              const rangeEnd = (page + 1) * pageSize - 1;
              const remoteData = await _request(
                `/rest/v1/user_history?updated_at=gte.${encodeURIComponent(
                lastSync
              )}&select=fc2_id,last_watched_at,is_deleted,updated_at,status&order=updated_at.asc`,
                "GET",
                null,
                {
                  Authorization: auth,
                  Range: `${rangeStart}-${rangeEnd}`
                }
              );
              if (Array.isArray(remoteData) && remoteData.length > 0) {
                const toUpdateByArray = [];
                const toDeleteIds = [];
                remoteData.forEach((item) => {
                  if (item.is_deleted) toDeleteIds.push(item.fc2_id);
                  else {
                    toUpdateByArray.push({
                      id: String(item.fc2_id),
                      timestamp: new Date(item.last_watched_at).getTime(),
                      status: item.status || "watched",
                      updated_at: item.updated_at,
                      is_deleted: 0,
                      sync_dirty: 0
                    });
                  }
                });
                await Repository.db.transaction("rw", Repository.db.history, async () => {
                  if (toUpdateByArray.length) await Repository.db.history.bulkPut(toUpdateByArray);
                  if (toDeleteIds.length)
                    await Repository.db.history.where("id").anyOf(toDeleteIds.map(String)).modify({ is_deleted: 1, sync_dirty: 0 });
                });
                pulledCount += remoteData.length;
                maxTs = remoteData[remoteData.length - 1].updated_at;
                if (remoteData.length < pageSize) hasMore = false;
                else page++;
              } else hasMore = false;
            }
            await HistoryManager.load();
            GM_setValue(STORAGE_KEYS.LAST_SYNC_TS, syncStartedAt);
            State.proxy.lastSyncTs = syncStartedAt;
            State.proxy.syncStatus = SYNC_STATUS.SUCCESS;
            if (pulledCount > 0 || dirtyRecords.length > 0) {
              Logger$1.success(
                "Supabase",
                `Sync complete - Pulled: ${pulledCount}, Pushed: ${dirtyRecords.length}`
              );
              if (isManual) Toast$1.show(t("alertWebDAVSyncSuccess"), "success");
            } else if (isManual) {
              Logger$1.info("Supabase", "Already up to date");
              Toast$1.show(t("alertAlreadyUpToDate"), "info");
            }
            Logger$1.timeEnd("Supabase.sync");
            Logger$1.groupEnd();
          } catch (error) {
            Logger$1.error("Supabase", "Sync failed", error);
            State.proxy.syncStatus = SYNC_STATUS.ERROR;
            if (isManual) Toast$1.show(t("alertWebDAVSyncError") + (error instanceof Error ? error.message : String(error)), "error");
            Logger$1.timeEnd("Supabase.sync");
            Logger$1.groupEnd();
          } finally {
            isSyncing = false;
            if (needsRetry) {
              needsRetry = false;
              this.performSync(false);
            }
          }
        };
        if (navigator.locks) {
          await navigator.locks.request("fc2_enh_sync_lock", { ifAvailable: true }, async (lock) => {
            if (lock) await runSync();
            else if (isManual) Toast$1.show("Sync already running in another tab.", "info");
          });
        } else {
          await runSync();
        }
      }
    };
  })();
  const _RetryManager = class _RetryManager {
static async executeWithRetry(operation, config = {}) {
      const finalConfig = { ...this.defaultConfig, ...config };
      let lastError;
      for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
        try {
          if (typeof Logger !== "undefined") {
            Logger.log("Retry", `Attempt ${attempt + 1}/${finalConfig.maxRetries + 1}`);
          }
          return await operation();
        } catch (error) {
          lastError = error;
          if (attempt === finalConfig.maxRetries) {
            if (typeof Logger !== "undefined") {
              Logger.error("Retry", "All retries exhausted", error);
            }
            throw error;
          }
          if (finalConfig.shouldRetry && !finalConfig.shouldRetry(error)) {
            if (typeof Logger !== "undefined") {
              Logger.warn("Retry", "Error not retryable", error);
            }
            throw error;
          }
          finalConfig.onRetry?.(error, attempt + 1);
          const delay = finalConfig.backoffMs[attempt] || finalConfig.backoffMs[finalConfig.backoffMs.length - 1];
          if (typeof Logger !== "undefined") {
            Logger.warn("Retry", `Retry in ${delay}ms`, { attempt: attempt + 1, error });
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
      throw lastError;
    }
  };
  _RetryManager.defaultConfig = {
    maxRetries: 3,
    backoffMs: [1e3, 3e3, 5e3],
    shouldRetry: (error) => {
      return error.status === 0 || error.status >= 500 && error.status < 600;
    }
  };
  _RetryManager.configs = {
    network: {
      maxRetries: 3,
      backoffMs: [1e3, 3e3, 5e3],
      shouldRetry: (error) => {
        return error.status === 0 || error.status === 408 || error.status >= 500 && error.status < 600;
      },
      onRetry: (_error, attempt) => {
        if (typeof Toast !== "undefined") {
          Toast.show(`网络错误,正在重试 (${attempt}/3)...`, "warn");
        }
      }
    },
    sync: {
      maxRetries: 2,
      backoffMs: [2e3, 5e3],
      shouldRetry: (error) => {
        return error.status !== 401 && error.status !== 403;
      },
      onRetry: (_error, attempt) => {
        if (typeof Logger !== "undefined") {
          Logger.info("Sync", `Retrying sync (${attempt}/2)`);
        }
      }
    },
    magnet: {
      maxRetries: 2,
      backoffMs: [1500, 3e3],
      shouldRetry: (error) => {
        return error.status !== 429;
      }
    }
  };
  let RetryManager = _RetryManager;
  const WebDAVProvider = (() => {
    let isSyncing = false;
    const getAuthHeader = () => {
      const { webdavUser, webdavPass } = State.proxy;
      return "Basic " + btoa(`${webdavUser}:${webdavPass}`);
    };
    const request = async (method, url, body = null, headers = {}, timeout = 3e4) => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method,
          url,
          headers: { Authorization: getAuthHeader(), ...headers },
          data: body,
          responseType: "text",
          timeout,
          onload: resolve,
          onerror: reject,
          ontimeout: () => reject(new Error("Request Timeout"))
        });
      });
    };
    const ensureDirectory = async (baseUrl, fullPath) => {
      const parts = fullPath.split("/").filter((p) => p && !p.includes("."));
      let currentPath = baseUrl.replace(/\/$/, "");
      for (const part of parts) {
        currentPath += "/" + part;
        try {
          const res = await request("PROPFIND", currentPath, null, { Depth: "0" });
          if (res.status === 404) {
            Logger$1.info("WebDAV", `Creating directory: ${currentPath}`);
            const mkres = await request("MKCOL", currentPath);
            if (mkres.status !== 201 && mkres.status !== 405) {
              throw new Error(`MKCOL failed: ${mkres.status}`);
            }
          }
        } catch (e) {
          Logger$1.error("WebDAV", `EnsureDirectory failed for ${currentPath}`, e);
        }
      }
    };
    const validatePayload = (data) => {
      if (!data || typeof data !== "object") return false;
      if (!Array.isArray(data.history)) return false;
      return true;
    };
    const fetchFull = async () => {
      const { webdavUrl, webdavPath } = State.proxy;
      const url = webdavUrl.replace(/\/$/, "") + "/" + webdavPath;
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          headers: { Authorization: getAuthHeader() },
          onload: (res) => {
            if (res.status === 200) {
              const etag = res.responseHeaders.match(/etag:\s*(.*)/i)?.[1]?.replace(/"/g, "").trim();
              try {
                const parsed = JSON.parse(res.responseText);
                if (!validatePayload(parsed)) throw new Error("Invalid schema");
                resolve({ data: parsed, etag });
              } catch (e) {
                Logger$1.error("WebDAV", "Failed to parse remote data", e);
                reject(new Error("Remote data corrupted"));
              }
            } else if (res.status === 404) {
              resolve(null);
            } else {
              reject(res);
            }
          },
          onerror: reject
        });
      });
    };
    const runSync = async (isManual = false, forceRefresh = false, retryOnConflict = true) => {
      if (isSyncing) return;
      const lastLock = GM_getValue(STORAGE_KEYS.WEBDAV_SYNC_LOCK, 0);
      const now = Date.now();
      if (now - lastLock < 1e4) {
        Logger$1.warn("WebDAV", "Sync is already in progress (locked)");
        if (isManual) Toast$1.show(t("alertSyncLockActive"), "warn");
        return;
      }
      GM_setValue(STORAGE_KEYS.WEBDAV_SYNC_LOCK, now);
      const { webdavUrl, webdavPath } = State.proxy;
      if (!webdavUrl || !webdavPath) return;
      Logger$1.group("WebDAV", "🔄 Starting WebDAV sync");
      Logger$1.time("WebDAV.sync");
      isSyncing = true;
      State.proxy.syncStatus = SYNC_STATUS.SYNCING;
      if (isManual) Toast$1.show(t("labelSyncing"), "info");
      try {
        await ensureDirectory(webdavUrl, webdavPath);
        const remote = await fetchFull();
        const remoteData = remote?.data;
        const remoteETag = remote?.etag;
        const lastEtag = GM_getValue(STORAGE_KEYS.WEBDAV_LAST_ETAG);
        if (!forceRefresh && lastEtag && remoteETag && lastEtag !== remoteETag) {
          if (retryOnConflict) {
            Logger$1.info("WebDAV", "Conflict detected, attempting auto re-merge...");
            State.proxy.syncStatus = SYNC_STATUS.SYNCING;
          } else {
            Logger$1.warn("WebDAV", "ETag conflict detected", { lastEtag, remoteETag });
            State.proxy.syncStatus = SYNC_STATUS.CONFLICT;
            if (isManual) Toast$1.show(t("alertSyncConflict"), "error");
            isSyncing = false;
            Logger$1.groupEnd();
            return;
          }
        }
        const localRecords = await Repository.db.history.toArray();
        const finalMap = new Map();
        let addedCount = 0;
        let updatedCount = 0;
        if (remoteData?.history) {
          remoteData.history.forEach((r) => finalMap.set(r.id, r));
        }
        localRecords.forEach((l) => {
          const r = finalMap.get(l.id);
          if (!r) {
            finalMap.set(l.id, { id: l.id, timestamp: l.timestamp, is_deleted: l.is_deleted });
            addedCount++;
          } else if (l.timestamp > r.timestamp) {
            finalMap.set(l.id, { id: l.id, timestamp: l.timestamp, is_deleted: l.is_deleted });
            updatedCount++;
          }
        });
        const payload = {
          version: 2,
          updated_at: ( new Date()).toISOString(),
          history: Array.from(finalMap.values())
        };
        Logger$1.info(
          "WebDAV",
          `Merge stats: ${addedCount} added, ${updatedCount} updated. Total: ${payload.history.length}`
        );
        const url = webdavUrl.replace(/\/$/, "") + "/" + webdavPath;
        const putHeaders = { "Content-Type": "application/json" };
        if (remoteETag) putHeaders["If-Match"] = remoteETag.includes('"') ? remoteETag : `"${remoteETag}"`;
        const res = await request("PUT", url, JSON.stringify(payload, null, 2), putHeaders);
        if (res.status >= 200 && res.status < 300) {
          const newEtag = res.responseHeaders.match(/etag:\s*(.*)/i)?.[1]?.replace(/"/g, "").trim() || remoteETag;
          if (newEtag) GM_setValue(STORAGE_KEYS.WEBDAV_LAST_ETAG, newEtag);
          await Repository.db.transaction("rw", Repository.db.history, async () => {
            await Repository.db.history.bulkPut(payload.history.map((h2) => ({ ...h2, sync_dirty: 0 })));
          });
          await HistoryManager.load();
          State.proxy.syncStatus = SYNC_STATUS.SUCCESS;
          State.proxy.lastSyncTime = ( new Date()).toISOString();
          Logger$1.success("WebDAV", `Sync complete - ${payload.history.length} items synced`);
          Logger$1.timeEnd("WebDAV.sync");
          Logger$1.groupEnd();
          if (isManual) Toast$1.show(t("alertWebDAVSyncSuccess"), "success");
        } else if (res.status === 412) {
          if (retryOnConflict) {
            Logger$1.warn("WebDAV", "Conflict (412) during PUT, retrying once...");
            isSyncing = false;
            return runSync(isManual, true, false);
          }
          State.proxy.syncStatus = SYNC_STATUS.CONFLICT;
          if (isManual) Toast$1.show(t("alertSyncConflict"), "error");
        } else {
          throw new Error(`WebDAV Error: ${res.status}`);
        }
      } catch (e) {
        Logger$1.error("WebDAV", "Sync failed", e);
        State.proxy.syncStatus = SYNC_STATUS.ERROR;
        const msg = e.statusText || e.message || (e.status ? `Status ${e.status}` : "Network Error");
        if (isManual) Toast$1.show(t("alertWebDAVSyncError") + msg, "error");
        Logger$1.timeEnd("WebDAV.sync");
        Logger$1.groupEnd();
        throw e;
      } finally {
        isSyncing = false;
        GM_setValue(STORAGE_KEYS.WEBDAV_SYNC_LOCK, 0);
      }
    };
    return {
      name: "webdav",
      async test() {
        Logger$1.info("WebDAV", "Testing connection...");
        const { webdavUrl } = State.proxy;
        if (!webdavUrl) throw new Error("URL is empty");
        const res = await request("PROPFIND", webdavUrl.replace(/\/$/, "") + "/", null, { Depth: "0" });
        if (res.status < 200 || res.status >= 300) throw res;
        Logger$1.success("WebDAV", "Connection test successful");
        return res;
      },
      async logout() {
        [STORAGE_KEYS.WEBDAV_URL, STORAGE_KEYS.WEBDAV_USER, STORAGE_KEYS.WEBDAV_PASS, STORAGE_KEYS.WEBDAV_PATH, STORAGE_KEYS.WEBDAV_LAST_ETAG].forEach(
          (k) => GM_deleteValue(k)
        );
        Logger$1.info("WebDAV", "Logged out and cleared credentials");
      },
      async performSync(isManual = false) {
        return await RetryManager.executeWithRetry(
          () => runSync(isManual),
          RetryManager.configs.sync
        );
      }
    };
  })();
  const SyncManager = (() => {
    let syncTimer = null;
    const getProvider = () => {
      const mode = State.proxy.syncMode;
      if (mode === "webdav") return WebDAVProvider;
      if (mode === "supabase") return SupabaseProvider;
      return null;
    };
    return {
      init() {
        CoreEvents.on(AppEvents.BOOTSTRAP, () => {
          Logger$1.info("SyncManager", "Bootstrap event received, starting auto-sync");
          this.performSync(false).catch(() => {
          });
        });
      },
      set onProgress(val) {
        SupabaseProvider.onProgress = val;
      },
async login(email, password) {
        return await SupabaseProvider.login(email, password);
      },
      async signup(email, password) {
        return await SupabaseProvider.signup(email, password);
      },
      async logout(silent = false) {
        const provider = getProvider();
        if (provider) {
          await provider.logout();
        } else {
          SupabaseProvider.logout(silent);
        }
        State.proxy.syncMode = "none";
        State.proxy.syncStatus = SYNC_STATUS.IDLE;
        GM_setValue(STORAGE_KEYS.LAST_SYNC_TS, UI_CONSTANTS.DEFAULT_TIMESTAMP);
      },
      async testWebDAV() {
        return await WebDAVProvider.test();
      },
      requestSync: () => {
        const interval = State.proxy.syncInterval;
        const mode = State.proxy.syncMode;
        if (interval === -1 || mode === "none") {
          return;
        }
        if (interval === 0) {
          Logger$1.info("SyncManager", "Sync requested (real-time mode), will execute in 2s");
          if (syncTimer) clearTimeout(syncTimer);
          syncTimer = setTimeout(() => SyncManager.performSync(), 2e3);
          return;
        }
        const lastAutoSync = GM_getValue(STORAGE_KEYS.LAST_AUTO_SYNC_TS, 0);
        const now = Date.now();
        const minInterval = interval * 60 * 1e3;
        if (now - lastAutoSync < minInterval) {
          return;
        }
        Logger$1.info("SyncManager", `Sync requested (interval: ${interval}min), will execute in 2s`);
        if (syncTimer) clearTimeout(syncTimer);
        syncTimer = setTimeout(() => {
          GM_setValue(STORAGE_KEYS.LAST_AUTO_SYNC_TS, Date.now());
          SyncManager.performSync();
        }, 2e3);
      },
      async performSync(isManual = false) {
        try {
          const provider = getProvider();
          if (!provider) return;
          await provider.performSync(isManual);
        } catch (error) {
          Logger$1.error("SyncManager", "Sync failed", error);
          State.proxy.syncStatus = SYNC_STATUS.ERROR;
        }
      },
      async forceFullSync() {
        if (!confirm(t("alertPushAllQuery"))) return;
        await Repository.db.history.toCollection().modify({ sync_dirty: 1 });
        GM_setValue(STORAGE_KEYS.LAST_SYNC_TS, UI_CONSTANTS.DEFAULT_TIMESTAMP);
        return await this.performSync(true);
      }
    };
  })();
  class EventBus {
    constructor() {
      this.listeners = new Map();
      this.onceListeners = new Map();
    }
on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(callback);
      Logger$1.log("EventBus", `Subscribed to: ${event}`);
      return () => this.off(event, callback);
    }
once(event, callback) {
      if (!this.onceListeners.has(event)) {
        this.onceListeners.set(event, new Set());
      }
      this.onceListeners.get(event).add(callback);
      Logger$1.log("EventBus", `Subscribed once to: ${event}`);
      return () => this.onceListeners.get(event)?.delete(callback);
    }
off(event, callback) {
      this.listeners.get(event)?.delete(callback);
      this.onceListeners.get(event)?.delete(callback);
      Logger$1.log("EventBus", `Unsubscribed from: ${event}`);
    }
emit(event, ...args) {
      Logger$1.log("EventBus", `Emitting: ${event}`, args);
      this.listeners.get(event)?.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          Logger$1.error("EventBus", `Error in ${event} handler`, error);
        }
      });
      const onceListeners = this.onceListeners.get(event);
      if (onceListeners) {
        onceListeners.forEach((callback) => {
          try {
            callback(...args);
          } catch (error) {
            Logger$1.error("EventBus", `Error in ${event} once handler`, error);
          }
        });
        onceListeners.clear();
      }
    }
clear() {
      this.listeners.clear();
      this.onceListeners.clear();
      Logger$1.warn("EventBus", "All listeners cleared");
    }
getStats() {
      const stats = new Map();
      this.listeners.forEach((listeners, event) => {
        stats.set(event, listeners.size);
      });
      return stats;
    }
  }
  const eventBus = new EventBus();
  const Events = {
HISTORY_ADDED: "history:added",
    HISTORY_REMOVED: "history:removed",
    HISTORY_CLEARED: "history:cleared",
    HISTORY_LOADED: "history:loaded",
SYNC_STARTED: "sync:started",
    SYNC_COMPLETED: "sync:completed",
    SYNC_FAILED: "sync:failed",
    SYNC_CONFLICT: "sync:conflict",
NETWORK_ONLINE: "network:online",
    NETWORK_OFFLINE: "network:offline",
SETTINGS_OPENED: "settings:opened",
    SETTINGS_CLOSED: "settings:closed",
    SETTINGS_CHANGED: "settings:changed",
DATA_EXPORTED: "data:exported",
    DATA_IMPORTED: "data:imported"
  };
  const HistoryManager = (() => {
    const historyCache = new Map();
    return {
      init() {
        CoreEvents.on(AppEvents.BOOTSTRAP, async () => {
          Logger$1.info("HistoryManager", "Bootstrap event received, loading history");
          await this.load();
        });
      },
      async load() {
        Logger$1.time("HistoryManager.load");
        if (!State.proxy.enableHistory) {
          historyCache.clear();
          Logger$1.warn("HistoryManager", "History disabled, cache cleared");
          return;
        }
        try {
          const items = await Repository.history.getAll();
          items.forEach((item) => historyCache.set(item.id, item.status || "watched"));
          eventBus.emit(Events.HISTORY_LOADED, items.length);
          Logger$1.success("HistoryManager", `Loaded ${items.length} history items`);
        } catch (e) {
          Logger$1.error("HistoryManager", "Failed to load history", e);
          historyCache.clear();
        }
        Logger$1.timeEnd("HistoryManager.load");
      },
      async add(id, status = "watched", remote = false) {
        if (!State.proxy.enableHistory || !id) return;
        const idStr = String(id);
        if (historyCache.get(idStr) === status && !remote) return;
        historyCache.set(idStr, status);
        if (!remote) {
          await Repository.history.add(id, status);
          __vitePreload(async () => {
            const { MessagingService: MessagingService2, MessageType: MessageType2 } = await Promise.resolve().then(() => MessagingService$1);
            return { MessagingService: MessagingService2, MessageType: MessageType2 };
          }, void 0 ).then(({ MessagingService: MessagingService2, MessageType: MessageType2 }) => {
            MessagingService2.broadcast(MessageType2.HISTORY_UPDATE, { action: "add", id: idStr, status });
          });
        }
        eventBus.emit(Events.HISTORY_ADDED, { id, status });
        Logger$1.info("HistoryManager", `${remote ? "Remote" : "Local"} Added: ${id} as ${status}`);
        if (!remote) SyncManager.requestSync();
      },
      async remove(id, remote = false) {
        if (!State.proxy.enableHistory || !id) return;
        const idStr = String(id);
        const prevStatus = historyCache.get(idStr);
        historyCache.delete(idStr);
        if (!remote) {
          await Repository.history.remove(id);
          __vitePreload(async () => {
            const { MessagingService: MessagingService2, MessageType: MessageType2 } = await Promise.resolve().then(() => MessagingService$1);
            return { MessagingService: MessagingService2, MessageType: MessageType2 };
          }, void 0 ).then(({ MessagingService: MessagingService2, MessageType: MessageType2 }) => {
            MessagingService2.broadcast(MessageType2.HISTORY_UPDATE, { action: "remove", id: idStr });
          });
        }
        eventBus.emit(Events.HISTORY_REMOVED, { id, prevStatus });
        Logger$1.info("HistoryManager", `${remote ? "Remote" : "Local"} Removed: ${id}`);
        if (!remote) SyncManager.requestSync();
      },
      async clear(remote = false) {
        const count = historyCache.size;
        historyCache.clear();
        if (!remote) {
          await Repository.history.clear();
          __vitePreload(async () => {
            const { MessagingService: MessagingService2, MessageType: MessageType2 } = await Promise.resolve().then(() => MessagingService$1);
            return { MessagingService: MessagingService2, MessageType: MessageType2 };
          }, void 0 ).then(({ MessagingService: MessagingService2, MessageType: MessageType2 }) => {
            MessagingService2.broadcast(MessageType2.HISTORY_UPDATE, { action: "clear" });
          });
        }
        eventBus.emit(Events.HISTORY_CLEARED, count);
        Logger$1.warn("HistoryManager", `${remote ? "Remote" : "Local"} Cleared ${count} items`);
        if (!remote) SyncManager.requestSync();
      },
      has(id, status) {
        if (!State.proxy.enableHistory) return false;
        if (status) return historyCache.get(String(id)) === status;
        return historyCache.has(String(id)) && historyCache.get(String(id)) !== "blocked";
      },
      getStatus(id) {
        return historyCache.get(String(id)) || null;
      }
    };
  })();
  __vitePreload(async () => {
    const { MessagingService: MessagingService2, MessageType: MessageType2 } = await Promise.resolve().then(() => MessagingService$1);
    return { MessagingService: MessagingService2, MessageType: MessageType2 };
  }, void 0 ).then(({ MessagingService: MessagingService2, MessageType: MessageType2 }) => {
    MessagingService2.onMessage((msg) => {
      if (msg.type === MessageType2.HISTORY_UPDATE) {
        const { action, id, status } = msg.payload;
        if (action === "add") HistoryManager.add(id, status, true);
        else if (action === "remove") HistoryManager.remove(id, true);
        else if (action === "clear") HistoryManager.clear(true);
      }
    });
  });
  const tokens = `
    /* ============================================================
       DESIGN TOKENS & DESIGN SYSTEM
       ============================================================ */

    :root {
        /* Colors */
        --fc2-bg: #050505;
        --fc2-surface: rgba(18, 18, 20, 0.9);
        --fc2-text: #f0f0f0;
        --fc2-text-dim: #a1a1aa;
        --fc2-border: rgba(255, 255, 255, 0.1);
        --fc2-primary: #ffffff;
        --fc2-primary-rgb: 255, 255, 255;
        --fc2-success: #4ade80;
        --fc2-danger: #f87171;
        --fc2-accent: #e4e4e7;
        
        /* Gradients */
        --fc2-accent-grad: linear-gradient(135deg, #3f3f46, #18181b);
        --fc2-magnet-grad: linear-gradient(135deg, #52525b, #27272a);
        
        /* Layout & Spacing */
        --fc2-radius: 16px;
        --fc2-btn-radius: 10px;
        --fc2-blur: blur(20px);
        --fc2-shadow: 0 12px 48px rgba(0, 0, 0, 0.8);
        --fc2-font: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;

        /* Z-Index Scale */
        --fc2-z-toast: 10000;
        --fc2-z-fab: 20000;
        --fc2-z-modal: 2147483647;
        --fc2-z-overlay: 2147483640;
        
        /* Scrollbar Colors */
        --fc2-scrollbar-thumb: rgba(255, 255, 255, 0.1);
        --fc2-scrollbar-hover: rgba(255, 255, 255, 0.2);

        /* Aliases for settings panel (Legacy Compatibility) */
        --fc2-enh-bg: rgba(26, 27, 38, 0.95);
        --fc2-enh-bg-secondary: rgba(18, 18, 20, 0.9);
        --fc2-enh-text: #f0f0f0;
        --fc2-enh-border: rgba(255, 255, 255, 0.1);
    }

    /* ============================================================
       LIGHT THEME OVERRIDES
       ============================================================ */

    :root.fc2-light-theme {
        --fc2-bg: #f8f9fa;
        --fc2-surface: rgba(255, 255, 255, 0.8);
        --fc2-text: #1a1a1a;
        --fc2-text-dim: #52525b; /* Darkened from #71717a for better contrast */
        --fc2-border: rgba(0, 0, 0, 0.08);
        --fc2-primary: #111111;
        --fc2-success: #16a34a;
        --fc2-danger: #dc2626;
        --fc2-accent: #3f3f46;
        
        --fc2-accent-grad: linear-gradient(135deg, #e4e4e7, #f4f4f5);
        --fc2-magnet-grad: linear-gradient(135deg, #d4d4d8, #e4e4e7);
        
        --fc2-scrollbar-thumb: rgba(0, 0, 0, 0.15);
        --fc2-scrollbar-hover: rgba(0, 0, 0, 0.25);
        
        --fc2-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    }
`;
  const animations = `
    /* ============================================================
       GLOBAL ANIMATIONS
       ============================================================ */

    /* Generic Fade & Slide In */
    @keyframes fc2-fade-in {
        from {
            opacity: 0;
            transform: translateY(15px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Core Spinner */
    @keyframes fc2-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* Loading Shimmer (Skeletons) */
    @keyframes fc2-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }

    /* Pulse Effects */
    @keyframes fc2-pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
    }

    @keyframes fc2-pulse-sync {
        0% {
            transform: scale(0.8);
            opacity: 0.6;
        }
        50% {
            transform: scale(1.1);
            opacity: 1;
        }
        100% {
            transform: scale(0.8);
            opacity: 0.6;
        }
    }

    @keyframes fc2-pulse-once {
        0% { transform: scale(1); }
        50% {
            transform: scale(1.15);
            background: var(--fc2-primary);
            color: #111;
        }
        100% { transform: scale(1); }
    }

    /* UI Logic Specific */
    @keyframes fc2-copy-success {
        0% { transform: scale(1); }
        50% {
            transform: scale(1.1);
            background: var(--fc2-success);
        }
        100% { transform: scale(1); }
    }

    @keyframes fc2-magnet-in {
        0% {
            transform: scale(0.5);
            opacity: 0;
        }
        70% { transform: scale(1.1); }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes fc2-pop-in {
        from {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.96);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }

    @keyframes fc2-dropdown-in {
        from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes fc2-tab-slide {
        from {
            opacity: 0;
            transform: translateY(12px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Enhancement Layer Animations */
    @keyframes fc2-pulse-ring {
        0% {
            transform: scale(0.8);
            opacity: 1;
        }
        100% {
            transform: scale(1.2);
            opacity: 0;
        }
    }

    @keyframes fc2-fade-in-scale {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes fc2-shake {
        0%, 100% { transform: translate(-50%, -50%) translateX(0); }
        25% { transform: translate(-50%, -50%) translateX(-10px); }
        75% { transform: translate(-50%, -50%) translateX(10px); }
    }

    @keyframes fc2-fade-simple {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fc2-fade-out {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes fc2-slide-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fc2-slide-down-out {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }

    @keyframes fc2-toast-shrink {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
    }

    /* Helper Classes */
    .pulse-once {
        animation: fc2-pulse-once 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
`;
  const getBaseStyles = (C) => `
    /* ============================================================
       CSS RESET & GLOBAL OVERRIDES
       ============================================================ */

    .fc2-enh-settings-panel,
    .fc2-enh-modal-overlay,
    .enh-modal-panel,
    .fc2-fab-container {
        all: revert;
    }

    .fc2-enh-settings-panel *:not(svg):not(path):not(circle):not(rect):not(line):not(polyline):not(polygon),
    .fc2-enh-modal-overlay *:not(svg):not(path):not(circle):not(rect):not(line):not(polyline):not(polygon),
    .enh-modal-panel *:not(svg):not(path):not(circle):not(rect):not(line):not(polyline):not(polygon),
    .fc2-fab-container *:not(svg):not(path):not(circle):not(rect):not(line):not(polyline):not(polygon) {
        box-sizing: border-box;
        font-family: var(--fc2-font) !important;
        font-size: 14px !important;
        font-weight: normal !important;
        font-style: normal !important;
        line-height: 1.5 !important;
        letter-spacing: normal !important;
        text-transform: none !important;
    }

    /* Icons Visibility Fix */
    .fc2-enh-settings-panel svg,
    .fc2-enh-settings-panel .fc2-icon {
        display: inline-block !important;
        vertical-align: middle !important;
    }

    /* Headings */
    .fc2-enh-settings-panel h2,
    .fc2-enh-settings-panel h3,
    .fc2-enh-settings-panel h4 {
        margin: 0 !important;
        padding: 0 !important;
        font-weight: 600 !important;
    }

    .fc2-enh-settings-panel h2 { font-size: 20px !important; }
    .fc2-enh-settings-panel h3 { font-size: 16px !important; }
    .fc2-enh-settings-panel h4 { font-size: 14px !important; }

    /* Forms & Controls */
    .fc2-enh-settings-panel label,
    .fc2-enh-settings-panel input,
    .fc2-enh-settings-panel select,
    .fc2-enh-settings-panel button {
        font-size: 14px !important;
        line-height: 1.5 !important;
    }

    /* ============================================================
       SELECT DROPDOWN STYLES
       ============================================================ */

    .fc2-enh-settings-panel select,
    .fc2-enh-settings-panel .fc2-select {
        display: inline-block !important;
        padding: 6px 32px 6px 12px !important;
        background: var(--fc2-enh-bg-secondary) !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath fill='%23cdd6f4' d='M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z'/%3E%3C/svg%3E") !important;
        background-repeat: no-repeat !important;
        background-position: right 8px center !important;
        background-size: 12px !important;
        color: var(--fc2-enh-text) !important;
        border: 1px solid var(--fc2-enh-border) !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        appearance: none !important;
        -webkit-appearance: none !important;
        color-scheme: dark !important;
        filter: invert(0) !important;
        transition: border-color 0.2s;
    }

    .fc2-enh-settings-panel select:hover {
        border-color: var(--fc2-primary) !important;
    }

    .fc2-enh-settings-panel select:focus {
        outline: none !important;
        border-color: var(--fc2-primary) !important;
        box-shadow: 0 0 0 2px rgba(var(--fc2-primary-rgb), 0.2) !important;
    }

    .fc2-enh-settings-panel select option {
        padding: 6px 12px !important;
        background: #1e1e1e !important;
        color: var(--fc2-enh-text) !important;
    }

    .fc2-enh-settings-panel select option:checked,
    .fc2-enh-settings-panel select option:hover {
        background: var(--fc2-primary) !important;
        color: #fff !important;
    }

    /* ============================================================
       SCROLLBAR & UTILITIES
       ============================================================ */

    /* Global Scrollbar */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--fc2-scrollbar-thumb) !important;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--fc2-scrollbar-hover) !important;
    }

    /* Skeleton Loading Base */
    .fc2-skeleton {
        background: linear-gradient(
            90deg, 
            rgba(255, 255, 255, 0.03) 25%, 
            rgba(255, 255, 255, 0.08) 50%, 
            rgba(255, 255, 255, 0.03) 75%
        );
        background-size: 200% 100%;
        border-radius: 4px;
        animation: fc2-shimmer 1.5s infinite linear;
    }

    /* Functional Hide Classes */
    .${C.hideNoMagnet}, 
    .${C.hideCensored}, 
    .${C.hideViewed} {
        display: none !important;
    }
`;
  const getComponentStyles = (C) => `
    /* ============================================================
       BASE COMPONENTS & RESET
       ============================================================ */

    *, ::before, ::after {
        box-sizing: border-box;
    }

    .fc2-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1em;
        height: 1em;
        vertical-align: -0.125em;
    }

    .fc2-icon svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
    }

    /* ============================================================
       TOAST NOTIFICATIONS
       ============================================================ */

    .fc2-toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: var(--fc2-z-toast);
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
    }

    .fc2-toast-item {
        display: flex;
        align-items: center;
        padding: 10px 16px;
        background: var(--fc2-surface);
        color: #fff;
        border-radius: 8px;
        border-left: 3px solid var(--fc2-primary);
        box-shadow: var(--fc2-shadow);
        font-size: 13px;
        backdrop-filter: blur(8px);
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        opacity: 0;
        pointer-events: auto;
    }

    .fc2-toast-item.show {
        transform: translateX(0);
        opacity: 1;
    }

    /* ============================================================
       ELEGANT FAB (UNIFIED)
       ============================================================ */

    .fc2-fab-container {
        position: fixed;
        bottom: 40px;
        right: 40px;
        z-index: var(--fc2-z-fab);
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 12px;
        pointer-events: none;
    }

    .fc2-fab-trigger, 
    .fc2-fab-actions {
        pointer-events: auto;
    }

    .fc2-fab-trigger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background: var(--fc2-accent-grad);
        color: #fff;
        border: none;
        border-radius: 50%;
        box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        touch-action: none;
        -webkit-tap-highlight-color: transparent;
        will-change: transform;
    }

    .fc2-fab-trigger:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
    }

    .fc2-fab-trigger:active {
        transform: scale(0.95);
    }

    .fc2-fab-trigger.active {
        transform: rotate(135deg);
        background: #eee;
        color: #111;
    }

    .fc2-fab-trigger.active:hover {
        transform: scale(1.1) rotate(135deg);
    }

    .fc2-fab-actions {
        display: flex;
        flex-direction: column-reverse;
        gap: 12px;
        opacity: 0;
        transform: translateY(20px) scale(0.8);
        pointer-events: none;
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .fc2-fab-actions.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
    }

    .fc2-fab-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: var(--fc2-surface);
        color: var(--fc2-text-dim);
        border: 1px solid var(--fc2-border);
        border-radius: 50%;
        backdrop-filter: var(--fc2-blur);
        font-size: 16px;
        box-shadow: var(--fc2-shadow);
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        -webkit-tap-highlight-color: transparent;
        will-change: transform;
    }

    .fc2-fab-btn:hover {
        background: var(--fc2-primary);
        color: #111;
        border-color: transparent;
        transform: translateY(-2px) scale(1.1);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
    }

    .fc2-fab-btn:active {
        transform: scale(0.95);
    }

    .fc2-fab-btn.active {
        background: var(--fc2-primary);
        color: #111;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
    }

    .fc2-fab-btn::before {
        content: attr(data-title);
        position: absolute;
        right: 52px;
        top: 50%;
        visibility: hidden;
        padding: 5px 10px;
        background: rgba(0,0,0,0.85);
        color: #fff;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        backdrop-filter: blur(4px);
        transform: translateY(-50%) translateX(5px);
        transition: all 0.2s;
        pointer-events: none;
    }

    .fc2-fab-btn:hover::before {
        visibility: visible;
        opacity: 1;
        transform: translateY(-50%) translateX(0);
    }

    .fc2-sync-dot {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 10px;
        height: 10px;
        background: #666;
        border: 2px solid var(--fc2-bg);
        border-radius: 50%;
        transition: all 0.3s;
    }

    .fc2-sync-dot.syncing {
        background: #89b4fa;
        animation: fc2-pulse-sync 1.5s infinite;
    }

    .fc2-sync-dot.success { background: #a6e3a1; }
    .fc2-sync-dot.error { background: #f38ba8; }
    .fc2-sync-dot.conflict { background: #fab387; }

    /* ============================================================
       CARD SYSTEM
       ============================================================ */

    .${C.cardRebuilt} {
        position: relative;
        background: var(--fc2-surface);
        border: 1px solid var(--fc2-border);
        border-radius: var(--fc2-radius);
        backdrop-filter: var(--fc2-blur);
        -webkit-backdrop-filter: var(--fc2-blur);
        transform: translateZ(0);
        will-change: transform;
        animation: fc2-fade-in 0.4s ease-out backwards;
        container-type: inline-size;
        container-name: card;
    }

    .${C.cardRebuilt}.has-active-dropdown {
        z-index: 100 !important;
    }

    body.searching .${C.cardRebuilt}:not(.search-match) {
        display: none !important;
    }

    .${C.processedCard} {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--fc2-surface);
        border: 1px solid var(--fc2-border);
        border-radius: var(--fc2-radius);
        overflow: visible;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
    }

    .${C.processedCard}:hover {
        transform: translateY(-4px);
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow: var(--fc2-shadow);
        z-index: 5;
    }

    .${C.processedCard}.has-active-dropdown,
    .${C.cardRebuilt}.has-active-dropdown {
        z-index: 100 !important;
        overflow: visible !important;
    }

    .${C.processedCard}.${C.isViewed} {
        border-color: var(--fc2-accent);
    }

    /* Detail Page Poster Style (Vertical) */
    .${C.processedCard}.is-detail {
        width: 100% !important;
        max-width: none !important;
        height: auto !important;
    }

    .${C.processedCard}.is-detail .${C.videoPreviewContainer} {
        aspect-ratio: auto !important;
        height: auto !important;
        background: transparent !important;
    }

    .${C.processedCard}.is-detail .${C.videoPreviewContainer} img {
        position: static !important;
        display: block !important;
        width: 100% !important;
        height: auto !important;
    }

    .${C.processedCard}.is-detail .${C.infoArea} {
        padding: 10px 12px !important;
        margin-top: 0 !important;
    }

    .${C.processedCard}.is-detail .${C.resourceLinksContainer} {
        margin-top: 0 !important;
    }

    .${C.videoPreviewContainer} {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        background: #0f1015;
        border-top-left-radius: var(--fc2-radius);
        border-top-right-radius: var(--fc2-radius);
        overflow: hidden;
    }

    .${C.videoPreviewContainer} video, 
    .${C.videoPreviewContainer} img.${C.staticPreview} {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease;
    }

    .${C.processedCard}:hover .${C.videoPreviewContainer} video, 
    .${C.processedCard}:hover .${C.videoPreviewContainer} img.${C.staticPreview} {
        transform: scale(1.05);
    }

    .${C.previewElement} {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 1;
        transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .${C.previewElement}.${C.hidden} {
        opacity: 0;
        pointer-events: none;
    }

    /* ============================================================
       UNIFIED BUTTON SYSTEM
       ============================================================ */

    .card-top-right-controls {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 10;
        display: flex;
        gap: 4px;
        align-items: center;
    }

    .${C.resourceBtn}, 
    .card-top-right-controls > *, 
    .verify-cf-btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.25);
        color: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: var(--fc2-btn-radius);
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        will-change: transform;
    }
    
    .${C.resourceBtn},
    .card-top-right-controls > *,
    .fc2-fab-btn,
    .fc2-fab-trigger,
    .fc2-enh-tab-btn,
    .enh-modal-close {
        cursor: pointer !important;
    }

    .${C.resourceBtn} *, 
    .fc2-fab-btn *, 
    .fc2-fab-trigger *, 
    .close-btn *, 
    .verify-cf-btn * {
        pointer-events: none !important;
    }

    .${C.resourceBtn}:hover, 
    .card-top-right-controls > *:hover {
        background: var(--fc2-magnet-grad);
        color: #fff;
        border-color: transparent;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255,255,255,0.1);
    }

    .${C.resourceBtn}:active, 
    .card-top-right-controls > *:active {
        transform: translateY(0) scale(0.98);
    }

    .verify-cf-btn {
        margin: 4px auto;
        padding: 4px 12px;
        color: #fab387 !important;
        border-color: rgba(250, 179, 135, 0.3) !important;
    }

    .verify-cf-btn:hover {
        background: rgba(250, 179, 135, 0.2) !important;
        color: #fff !important;
        border-color: #fab387 !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(250, 179, 135, 0.2) !important;
    }

    /* Responsive Size Classes */
    .card-top-right-controls > * {
        height: 24px;
        padding: 0 6px;
        font-size: 10px;
    }

    .card-top-right-controls .fc2-icon {
        font-size: 0.9em;
    }

    .${C.resourceBtn} {
        height: 32px; /* Increased from 28px for better accessibility */
        padding: 0 12px;
        font-size: 13px;
    }
    
    .${C.resourceBtn} .fc2-icon {
        font-size: 1.1em;
    }

    @container (max-width: 250px) {
        .card-top-right-controls > * {
            height: 20px;
            padding: 0 4px;
            font-size: 9px;
        }
        .card-top-right-controls { top: 6px; right: 6px; gap: 3px; }
        .${C.resourceBtn} { height: 24px; padding: 0 6px; font-size: 10px; }
        .card-left-actions { gap: 4px; }
    }

    @container (min-width: 350px) {
        .card-top-right-controls > * { height: 26px; padding: 0 8px; font-size: 11px; }
        .${C.resourceBtn} { height: 30px; padding: 0 12px; font-size: 13px; }
    }

    /* Specialized Buttons */
    .${C.resourceBtn}.${C.btnMagnet} {
        font-weight: 600;
        margin-left: auto;
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.15);
        animation: fc2-magnet-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .${C.resourceBtn}.${C.btnMagnet}:hover {
        background: var(--fc2-magnet-grad);
        color: #fff;
        border-color: transparent;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255,255,255,0.1);
    }

    .btn-toggle-view.is-viewed {
        color: var(--fc2-primary);
        border-color: var(--fc2-primary);
    }

    .btn-toggle-view .icon-viewed { display: none; }
    .btn-toggle-view.is-viewed .icon-viewed { display: inline-block; }
    .btn-toggle-view.is-viewed .icon-unviewed { display: none; }

    .btn-toggle-wanted.is-wanted {
        background: rgba(241, 196, 15, 0.1) !important;
        color: #f1c40f;
        border-color: rgba(241, 196, 15, 0.4);
        text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
    }

    .btn-toggle-blocked.is-blocked {
        background: rgba(243, 139, 168, 0.1) !important;
        color: #f38ba8;
        border-color: rgba(243, 139, 168, 0.4);
    }

    .card-top-right-controls .btn-toggle-wanted:hover { background: rgba(241, 196, 15, 0.3) !important; color: #fff; }
    .card-top-right-controls .btn-toggle-blocked:hover { background: rgba(243, 139, 168, 0.3) !important; color: #fff; }

    .btn-actress {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 4px auto;
        padding: 4px 12px;
        background: rgba(0, 0, 0, 0.25);
        color: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: var(--fc2-btn-radius);
        font-weight: 500;
        line-height: normal;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .btn-actress:hover {
        background: var(--fc2-magnet-grad);
        color: #fff;
        border-color: transparent;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255,255,255,0.1);
    }

    .${C.fc2IdBadge} {
        background: rgba(0, 0, 0, 0.5) !important;
        color: #ffffff !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: var(--fc2-btn-radius);
        font-weight: 700 !important;
        letter-spacing: 0.5px;
        backdrop-filter: var(--fc2-blur) !important;
        -webkit-backdrop-filter: var(--fc2-blur) !important;
    }

    .${C.fc2IdBadge}.${C.badgeCopied} {
        background: var(--fc2-success) !important;
        color: #111 !important;
        border-color: var(--fc2-success);
        animation: fc2-copy-success 0.4s ease;
    }

    /* ============================================================
       INFO AREA
       ============================================================ */

    .${C.infoArea} {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        flex-grow: 1;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-top: 1px solid var(--fc2-border);
        border-bottom-left-radius: var(--fc2-radius);
        border-bottom-right-radius: var(--fc2-radius);
    }

    .${C.customTitle} {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 38px;
        margin: 0 0 10px;
        color: var(--fc2-text) !important;
        font-size: 13px;
        font-weight: 600 !important;
        line-height: 1.5;
        text-decoration: none !important;
        text-shadow: none;
        overflow: hidden;
        transition: color 0.2s;
    }

    .${C.customTitle}:hover {
        color: var(--fc2-primary) !important;
    }

    .card-left-actions {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 6px;
        margin-top: auto;
    }

    .${C.resourceLinksContainer} {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
        margin-left: auto;
    }

    /* ============================================================
       DROPDOWN & TOOLTIP
       ============================================================ */

    .enh-dropdown {
        position: relative;
        display: inline-flex;
    }

    .enh-dropdown-content {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        z-index: 1000;
        display: none;
        flex-direction: column;
        gap: 6px;
        min-width: 140px;
        padding: 8px;
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        z-index: 1001;
        animation: fc2-dropdown-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .enh-dropdown.active .enh-dropdown-content {
        display: flex;
    }

    .enh-dropdown-content .${C.resourceBtn} {
        width: 100%;
        height: 36px;
        padding: 0 10px;
        justify-content: flex-start;
    }

    .enh-dropdown-content .${C.resourceBtn} .${C.buttonText} {
        display: inline-block;
        margin-left: 8px;
    }

    .${C.buttonText} {
        display: none;
    }

    .${C.resourceBtn}.${C.btnLoading} {
        cursor: wait;
        opacity: 0.5;
    }

    .${C.resourceBtn} .${C.tooltip} {
        position: absolute;
        bottom: 125%;
        left: 50%;
        z-index: 10000;
        visibility: hidden;
        padding: 5px 8px;
        background: rgba(0, 0, 0, 0.85);
        color: #fff;
        border-radius: 6px;
        font-size: 11px;
        white-space: nowrap;
        opacity: 0;
        backdrop-filter: blur(4px);
        transform: translateX(-50%) scale(0.9);
        transition: opacity 0.2s;
        pointer-events: none;
    }

    .${C.resourceBtn}:hover .${C.tooltip} {
        visibility: visible;
        opacity: 1;
        transform: translateX(-50%) scale(1);
    }

    /* ============================================================
       DETAIL TOOLBAR
       ============================================================ */

    .enh-toolbar {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        height: 52px !important;
        min-height: 52px !important;
        margin: 15px 0 !important;
        padding: 0 !important;
        background: var(--fc2-surface) !important;
        border: 1px solid var(--fc2-border) !important;
        border-radius: var(--fc2-radius) !important;
        box-shadow: var(--fc2-shadow);
        backdrop-filter: var(--fc2-blur) !important;
        -webkit-backdrop-filter: var(--fc2-blur) !important;
        overflow: visible !important;
    }

    .enh-toolbar .info-area {
        display: grid !important;
        grid-template-columns: 1fr auto 1fr !important;
        align-items: center !important;
        width: 100% !important;
        height: 100% !important;
        padding: 0 12px !important;
        margin: 0 !important;
        background: transparent !important;
        border: none !important;
        overflow: visible !important;
    }

    .enh-toolbar .card-top-right-controls {
        position: static !important;
        display: flex !important;
        justify-content: flex-start !important;
        gap: 6px !important;
    }

    .enh-toolbar .btn-actress {
        grid-column: 2 !important;
        justify-self: center !important;
        margin: 0 !important;
    }

    .enh-toolbar .resource-links-container {
        grid-column: 3 !important;
        justify-self: flex-end !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        margin: 0 !important;
        overflow: visible !important;
    }

    .enh-toolbar .${C.resourceBtn}, 
    .enh-toolbar .card-top-right-controls > * {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        height: 34px !important;
        padding: 0 15px !important;
        font-size: 13px !important;
        line-height: normal !important;
    }

    .enh-toolbar .resource-links-container .${C.resourceBtn} {
        width: 34px !important;
        padding: 0 !important;
        flex-shrink: 0 !important;
    }

    /* Dropdown in Toolbar */
    .enh-toolbar .enh-dropdown {
        position: static !important;
    }

    .enh-toolbar .enh-dropdown-trigger {
        width: 34px !important;
    }

    .enh-toolbar .enh-dropdown-content {
        position: fixed !important;
        top: auto !important;
        right: auto !important;
        transform: translateY(8px);
    }

    .enh-toolbar .enh-dropdown-content .${C.resourceBtn} {
        width: 100% !important;
        padding: 0 10px !important;
        justify-content: flex-start !important;
    }

    .enh-toolbar .enh-dropdown-content .${C.resourceBtn} .${C.buttonText} {
        display: inline-block !important;
    }

    /* ============================================================
       MODAL & SETTINGS PANEL
       ============================================================ */

    .enh-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: var(--fc2-z-overlay);
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        transition: all 0.3s;
    }

    .enh-modal-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: var(--fc2-z-modal);
        display: flex;
        flex-direction: column;
        background: rgba(26, 27, 38, 0.85);
        color: #a9b1d6;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        box-shadow: 0 40px 80px rgba(0,0,0,0.6);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        overflow: hidden;
        animation: fc2-pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        transform: translate(-50%, -50%);
    }

    .fc2-enh-settings-panel {
        width: min(95%, 800px);
        max-height: 92vh;
    }

    .fc2-enh-settings-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.25rem 1.5rem;
        background: rgba(0,0,0,0.2);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .fc2-enh-settings-header h2 {
        margin: 0;
        color: #fff;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.02em;
    }

    .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: none;
        color: #565f89;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .close-btn:hover {
        background: rgba(255,255,255,0.05);
        color: #fff;
    }

    .fc2-enh-settings-tabs {
        display: flex;
        padding: 0 1rem;
        background: rgba(0,0,0,0.2);
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .fc2-enh-tab-btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 1rem 1.5rem;
        background: none;
        color: #565f89;
        border: none;
        border-bottom: 2px solid transparent;
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .fc2-enh-tab-btn:hover {
        background: rgba(255,255,255,0.02);
        color: #cfc9c2;
    }

    .fc2-enh-tab-btn.active {
        background: rgba(122,162,247,0.05);
        color: var(--fc2-primary);
        border-bottom-color: var(--fc2-primary);
    }

    .fc2-enh-settings-content {
        position: relative;
        flex-grow: 1;
        min-height: 350px;
        padding: 1.5rem;
        overflow-y: auto;
        background: transparent;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.1) transparent;
    }

    .fc2-enh-settings-content::-webkit-scrollbar {
        width: 6px;
    }

    .fc2-enh-settings-content::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
    }

    .fc2-tab-content-wrapper {
        animation: fc2-tab-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .fc2-enh-settings-group {
        margin-bottom: 1rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        transition: all 0.2s ease;
    }

    .fc2-enh-settings-group:hover {
        background: rgba(255, 255, 255, 0.03);
        border-color: rgba(255, 255, 255, 0.08);
    }

    .fc2-enh-settings-group:last-child {
        margin-bottom: 0;
    }

    .fc2-enh-settings-group h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 0;
        margin-bottom: 1rem;
        padding-bottom: 0.8rem;
        color: #7aa2f7;
        border-bottom: 1px solid rgba(122, 162, 247, 0.15);
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .fc2-enh-form-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.75rem;
    }

    .fc2-enh-form-row:last-child {
        margin-bottom: 0;
    }

    .fc2-enh-form-row.checkbox {
        justify-content: flex-start;
        gap: 0.75rem;
        padding: 0.4rem 0.5rem;
        margin-bottom: 0.25rem;
        border-radius: 8px;
        transition: background 0.15s ease;
        cursor: pointer;
    }

    .fc2-enh-form-row.checkbox:hover {
        background: rgba(255, 255, 255, 0.03);
    }

    .fc2-enh-form-row label {
        display: flex;
        align-items: center;
        color: #c0caf5;
        font-size: 0.95rem;
        font-weight: 400;
        line-height: 1.6;
        cursor: inherit;
    }

    .fc2-enh-form-row select, 
    .fc2-enh-form-row input[type="text"], 
    .fc2-enh-form-row input[type="password"] {
        width: 100%;
        max-width: 300px;
        padding: 0.6rem 1rem;
        background: rgba(255, 255, 255, 0.03);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        font-size: 0.9rem;
        outline: none;
        transition: all 0.2s;
    }

    .fc2-enh-form-row select:hover, 
    .fc2-enh-form-row input:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.15);
    }

    .fc2-enh-form-row select:focus, 
    .fc2-enh-form-row input:focus {
        border-color: var(--fc2-primary);
        box-shadow: 0 0 0 2px rgba(122,162,247,0.2);
    }

    input[type="checkbox"] {
        position: relative;
        appearance: none;
        -webkit-appearance: none;
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.8rem;
        background: #16161e;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    input[type="checkbox"]:checked {
        background: var(--fc2-primary);
        border-color: var(--fc2-primary);
    }

    input[type="checkbox"]:checked::after {
        content: "✔";
        position: absolute;
        top: 50%;
        left: 50%;
        color: #111;
        font-size: 0.8rem;
        font-weight: bold;
        transform: translate(-50%, -50%);
    }

    .fc2-enh-settings-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        background: rgba(0, 0, 0, 0.2);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .fc2-enh-btn, 
    .fc2-btn {
        padding: 0.6rem 1.2rem;
        background: rgba(255, 255, 255, 0.03);
        color: #cfc9c2;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        font-family: var(--fc2-font);
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .fc2-enh-btn:hover, 
    .fc2-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
        border-color: rgba(255,255,255,0.15);
    }

    .fc2-enh-btn.primary, 
    .fc2-btn.primary {
        background: var(--fc2-primary);
        color: #111;
        border: none;
        font-weight: 600;
    }

    .fc2-enh-btn.primary:hover, 
    .fc2-btn.primary:hover {
        background: #89b4fa;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(122,162,247,0.3);
    }

    .fc2-enh-btn.danger, 
    .fc2-btn.danger {
        color: #f38ba8;
        border-color: rgba(243, 139, 168, 0.2);
    }

    .fc2-enh-btn.danger:hover, 
    .fc2-btn.danger:hover {
        background: rgba(243, 139, 168, 0.1);
        border-color: #f38ba8;
    }

    /* ============================================================
       MISC INTERACTION COMPONENTS
       ============================================================ */

    /* Preview Loading State */
    .preview-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .preview-spinner {
        animation: fc2-spin 0.8s linear infinite;
    }

    .preview-progress {
        font-weight: 500;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .preview-error {
        animation: fc2-shake 0.5s;
    }

    /* Smart Tooltip */
    .smart-tooltip {
        position: relative;
        letter-spacing: 0.3px;
    }

    .smart-tooltip::before {
        content: '';
        position: absolute;
        bottom: 100%;
        left: 50%;
        border: 6px solid transparent;
        border-bottom-color: rgba(0, 0, 0, 0.9);
        transform: translateX(-50%);
    }

    /* Context Menu */
    .context-menu {
        z-index: 2000;
        background: var(--fc2-surface);
        border: 1px solid var(--fc2-border);
        border-radius: 8px;
        box-shadow: var(--fc2-shadow);
        backdrop-filter: var(--fc2-blur);
        animation: fc2-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .context-menu-item {
        padding: 8px 12px;
        color: var(--fc2-text);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .context-menu-item:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateX(4px);
    }

    /* ============================================================
       GALLERY & VIEWER
       ============================================================ */

    .enh-gallery-panel {
        width: 95vw;
        height: 90vh;
        max-width: 1200px;
        padding: 0;
    }

    .enh-gallery-content {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .enh-gallery-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .enh-gallery-body {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: center;
        gap: 10px;
        padding: 15px;
        overflow-y: auto;
    }

    .enh-gallery-body img, 
    .enh-gallery-body video {
        max-width: calc(33% - 10px);
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
    }

    .enh-gallery-body img:hover {
        transform: scale(1.02);
    }

    .enh-viewer-backdrop {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.95);
        animation: fc2-fade-simple 0.2s ease;
    }

    .enh-viewer-stage {
        position: relative;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .enh-viewer-stage img, 
    .enh-viewer-stage video {
        display: block;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        border-radius: 4px;
        box-shadow: 0 0 40px rgba(0,0,0,0.5);
        object-fit: contain;
    }

    .enh-viewer-nav {
        position: absolute;
        top: 0;
        bottom: 0;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15%;
        color: rgba(255,255,255,0.3);
        font-size: 50px;
        user-select: none;
        cursor: pointer;
        transition: all 0.2s;
    }

    .enh-viewer-nav:hover {
        background: rgba(255,255,255,0.05);
        color: #fff;
    }

    .enh-viewer-nav.prev { left: 0; }
    .enh-viewer-nav.next { right: 0; }

    .enh-viewer-close {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        background: rgba(255,255,255,0.1);
        color: #fff;
        border-radius: 50%;
        font-size: 30px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .enh-viewer-close:hover {
        background: rgba(255,255,255,0.2);
        transform: rotate(90deg);
    }

    .enh-viewer-counter {
        position: absolute;
        bottom: 20px;
        left: 50%;
        z-index: 10002;
        padding: 6px 16px;
        background: rgba(0,0,0,0.6);
        color: #fff;
        border-radius: 20px;
        font-size: 14px;
        backdrop-filter: blur(10px);
        transform: translateX(-50%);
    }

    @keyframes fc2-toast-shrink {
        from { width: 100%; }
        to { width: 0%; }
    }
`;
  const getMobileStyles = (C) => `
    /* ============================================================
       MOBILE TOUCH OPTIMIZATIONS
       ============================================================ */

    @media (max-width: 768px) {
        * {
            /* Prevent double-tap zoom on mobile */
            touch-action: manipulation;
        }
        
        body {
            /* Smooth scrolling on mobile */
            -webkit-overflow-scrolling: touch;
            overflow-x: hidden !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        html {
            overflow-x: hidden !important;
            width: 100% !important;
        }

        /* Hardware Acceleration for Mobile */
        .${C.processedCard},
        .${C.cardRebuilt},
        .${C.resourceBtn},
        .fc2-fab-btn,
        .fc2-fab-trigger {
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            will-change: transform;
        }
        
        /* Disable hover effects on touch devices to prevent "sticky" hover */
        @media (hover: none) {
            .${C.resourceBtn}:hover,
            .card-top-right-controls > *:hover,
            .fc2-fab-btn:hover,
            .fc2-fab-trigger:hover,
            .${C.processedCard}:hover {
                transform: none !important;
                box-shadow: none !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
            }
        }
        
        /* Sharper animations for mobile performance */
        * {
            animation-duration: 0.2s !important;
            transition-duration: 0.2s !important;
        }

        /* ============================================================
           SETTINGS PANEL MOBILE
           ============================================================ */

        .fc2-enh-settings-panel { 
            width: 98% !important; 
            max-height: 95vh !important; 
            max-height: 95svh !important; 
            border-radius: 12px !important; 
        }

        .fc2-enh-settings-content {
            padding: 1rem !important;
        }

        .fc2-enh-settings-tabs {
            flex-wrap: wrap !important;
        }

        .fc2-enh-tab-btn {
            display: flex;
            flex: 1;
            justify-content: center;
            padding: 0.75rem 0.5rem !important;
            font-size: 0.85rem !important;
        }
        
        .fc2-enh-form-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
        }

        .fc2-enh-form-row select, 
        .fc2-enh-form-row input {
            max-width: 100% !important;
        }

        .fc2-enh-form-row.checkbox {
            flex-direction: row !important;
            align-items: center !important;
        }

        /* ============================================================
           GRID & CARD LAYOUT MOBILE
           ============================================================ */

        /* Force single column layout on common containers */
        div.grid, 
        div.posts, 
        div.flex-wrap, 
        .movie-list, 
        .work-list, 
        .tile-images { 
            display: grid !important; 
            grid-template-columns: 1fr !important; 
            gap: 12px !important; 
            width: 100% !important;
            max-width: 100% !important;
            padding: 10px !important;
            box-sizing: border-box !important;
            margin: 0 !important;
        }

        .container, 
        .main-content, 
        #main, 
        #content {
            width: 100% !important;
            max-width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }
        
        .${C.cardRebuilt} {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
        }
        
        /* Larger Touch Targets for Mobile */
        .card-top-right-controls { 
            top: 12px !important; 
            right: 12px !important; 
            gap: 10px !important; 
        }

        .card-top-right-controls > * { 
            min-height: 44px;
            min-width: 44px;
            height: 36px !important; 
            padding: 0 12px !important; 
            font-size: 14px !important; 
        }

        .${C.resourceBtn} { 
            min-height: 44px;
            height: 44px !important; 
            padding: 0 16px !important; 
            font-size: 14px !important; 
        }

        .btn-actress { 
            width: 90% !important; 
            margin: 8px auto !important; 
            padding: 8px 16px !important; 
            font-size: 15px !important; 
        }

        .fc2-fab-trigger { 
            width: 56px !important; 
            height: 56px !important; 
            font-size: 24px !important; 
        }

        .fc2-fab-btn { 
            width: 48px !important; 
            height: 48px !important; 
            font-size: 20px !important; 
        }
        
        /* ============================================================
           TOOLBAR & MODAL MOBILE
           ============================================================ */

        .enh-toolbar { 
            display: flex !important;
            flex-direction: column !important;
            height: auto !important; 
            min-height: 60px !important; 
            margin: 10px 0 !important; 
            border-radius: 12px !important; 
        }

        .enh-toolbar .info-area { 
            display: flex !important; 
            flex-direction: column !important; 
            gap: 12px !important;
            width: 100% !important;
            height: auto !important; 
            padding: 12px !important; 
        }

        .enh-toolbar .card-top-right-controls,
        .enh-toolbar .btn-actress,
        .enh-toolbar .resource-links-container { 
            display: flex !important;
            justify-content: center !important; 
            width: 100% !important; 
            margin: 0 !important;
        }

        .enh-toolbar .resource-links-container { 
            flex-wrap: wrap !important; 
            gap: 10px !important; 
        }

        .enh-toolbar .resource-links-container .${C.resourceBtn} { 
            flex: 1 !important; 
            width: auto !important; 
            min-width: 80px !important; 
        }
        
        .enh-dropdown-content {
            min-width: 160px !important;
            max-width: 90vw !important;
        }

        .enh-dropdown-content .${C.resourceBtn} {
            height: 44px !important;
            font-size: 14px !important;
        }
        
        .enh-viewer-nav { 
            width: 25% !important; 
            font-size: 36px !important; 
        }

        .enh-viewer-close { 
            top: 15px !important; 
            right: 15px !important; 
            width: 44px !important; 
            height: 44px !important; 
        }
        
        .enh-modal-panel {
            width: 95% !important;
            max-width: 95% !important;
            max-height: 90vh !important;
        }

        /* Mobile Context Menu Adjustment */
        .context-menu {
            position: fixed !important;
            bottom: 20px !important;
            top: auto !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 90% !important;
            max-width: 300px !important;
        }
        
        /* FAB Container - safely above bottom bar */
        .fc2-fab-container {
            bottom: 80px !important;
            right: 20px !important;
        }
    }
`;
  const enhancementStyles = `
    /* ============================================================
       GLOBAL STATE & UTILITIES
       ============================================================ */

    /* Content Visibility for Performance */
    .fc2-processed-card:nth-child(n+51) {
        content-visibility: auto;
        contain-intrinsic-size: 320px 280px;
    }

    /* Shaded State for Missing Magnets */
    .no-magnet {
        filter: grayscale(0.8) opacity(0.5);
        transition: all 0.5s ease;
    }

    .no-magnet:hover {
        filter: grayscale(0.4) opacity(0.8);
    }

    /* GPU Acceleration Layer */
    .resource-btn,
    .fc2-fab-btn,
    .processed-card {
        will-change: transform;
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
    }

    /* ============================================================
       SKELETON SCREENS
       ============================================================ */

    .skeleton-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .skeleton-card {
        padding: 16px;
        background: var(--fc2-surface);
        border-radius: var(--fc2-radius);
        overflow: hidden;
        contain: layout style paint;
    }

    .skeleton-image {
        width: 100%;
        height: 150px;
        margin-bottom: 12px;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 100%
        );
        background-size: 1000px 100%;
        border-radius: calc(var(--fc2-radius) / 2);
        animation: fc2-shimmer 2s infinite;
    }

    .skeleton-text {
        height: 16px;
        margin-bottom: 8px;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 100%
        );
        background-size: 1000px 100%;
        border-radius: 4px;
        animation: fc2-shimmer 2s infinite;
    }

    .skeleton-text.short {
        width: 60%;
    }

    /* ============================================================
       PROGRESS & LOADING INDICATORS
       ============================================================ */

    .progress-bar {
        position: relative;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
        contain: layout style paint;
    }

    .progress-fill {
        position: relative;
        height: 100%;
        background: linear-gradient(
            90deg,
            var(--fc2-primary) 0%,
            var(--fc2-accent) 100%
        );
        transition: width 0.3s ease;
    }

    .progress-fill::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.3) 50%, 
            transparent 100%
        );
        animation: fc2-shimmer 2s infinite;
    }

    .btn-loading {
        position: relative;
        pointer-events: none;
        opacity: 0.7;
    }

    .btn-loading::before {
        content: '';
        position: absolute;
        inset: -4px;
        border: 2px solid currentColor;
        border-radius: inherit;
        animation: fc2-pulse-ring 1.5s ease-out infinite;
    }

    /* ============================================================
       ANIMATION HELPERS (LEGACY COMPAT)
       ============================================================ */

    .fade-in { animation: fc2-fade-simple 0.3s ease-out; }
    .fade-out { animation: fc2-fade-out 0.3s ease-out; }
    .slide-in-up { animation: fc2-slide-up 0.3s ease-out; }
    .slide-out-down { animation: fc2-slide-down-out 0.3s ease-out; }
`;
  const getConsolidatedCss = () => {
    const C = Config.CLASSES;
    const performanceFix = location.hostname.includes("missav") || location.hostname.includes("supjav") || location.hostname.includes("javdb") ? `
        .${C.processedCard}:nth-child(n+51) { content-visibility: auto; contain-intrinsic-size: 320px 280px; }
    ` : "";
    const siteSpecificFix = location.hostname.includes("fd2ppv") ? `
        .artist-card.card-rebuilt,
        .work-card.card-rebuilt,
        .work-list > div,
        .artist-list > div { overflow: visible !important; }
    ` : "";
    return `
        ${tokens}
        ${animations}
        ${getBaseStyles(C)}
        ${getComponentStyles(C)}
        ${performanceFix}
        ${siteSpecificFix}
        ${getMobileStyles(C)}
        ${enhancementStyles}
    `;
  };
  const StyleManager = (() => {
    let sharedSheet = null;
    const getCss = () => {
      return getConsolidatedCss();
    };
    return {
      init() {
        if (sharedSheet) return;
        let lastUpdate = 0;
        const detectTheme = () => {
          const now = Date.now();
          if (now - lastUpdate < 500) return;
          lastUpdate = now;
          const bodyBg = window.getComputedStyle(document.body).backgroundColor;
          if (!bodyBg || bodyBg === "rgba(0, 0, 0, 0)" || bodyBg === "transparent") return;
          const rgb = bodyBg.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0]), g = parseInt(rgb[1]), b = parseInt(rgb[2]);
            const isLight = r * 0.299 + g * 0.587 + b * 0.114 > 180;
            const hasClass = document.documentElement.classList.contains("fc2-light-theme");
            if (isLight && !hasClass) {
              document.documentElement.classList.add("fc2-light-theme");
            } else if (!isLight && hasClass) {
              document.documentElement.classList.remove("fc2-light-theme");
            }
          }
        };
        const css = getCss();
        if (typeof GM_addStyle !== "undefined") {
          GM_addStyle(css);
        } else {
          const style = document.createElement("style");
          style.textContent = css;
          document.head.appendChild(style);
        }
        try {
          sharedSheet = new CSSStyleSheet();
          sharedSheet.replaceSync(css);
          document.adoptedStyleSheets = [...document.adoptedStyleSheets, sharedSheet];
        } catch (_e) {
        }
        if (document.body) detectTheme();
        else document.addEventListener("DOMContentLoaded", detectTheme);
        const themeObserver = new MutationObserver(() => detectTheme());
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        themeObserver.observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });
      },
      getCss
    };
  })();
  const GridManager = (() => {
    let styleEl;
    return {
      init() {
        CoreEvents.on(AppEvents.GRID_CHANGED, (cols) => this.apply(cols));
        const savedCols = typeof GM_getValue !== "undefined" ? GM_getValue(STORAGE_KEYS.USER_GRID_COLUMNS, 0) : 0;
        if (savedCols > 0) {
          this.apply(savedCols);
        }
      },
      apply(cols) {
        const hn = location.hostname;
        if (hn.includes("missav")) {
          const path = location.pathname;
          if (/\/(cn\/|en\/|ja\/)?(fc2-ppv-|[a-z]{2,5}-)\d+/i.test(path)) return;
        }
        if (!styleEl) {
          styleEl = document.createElement("style");
          document.head.appendChild(styleEl);
        }
        const sel = hn.includes("fc2ppvdb.com") ? { cont: "[data-enh-grid-container], .flex.flex-wrap.-m-4.py-4, .container > .flex.flex-wrap, #actress-articles .flex.flex-wrap, section > div > .flex.flex-wrap", card: `> .${Config.CLASSES.cardRebuilt}` } : hn.includes("fd2ppv.cc") ? {
          cont: ".flex.flex-wrap, .work-list, .container .grid, .other-works-grid",
          card: `> .${Config.CLASSES.cardRebuilt}`
        } : hn.includes("supjav.com") ? { cont: ".posts.clearfix:not(:has(.swiper-wrapper))", card: `> .${Config.CLASSES.cardRebuilt}` } : hn.includes("missav.ws") ? { cont: 'div.grid[class*="grid-cols-"]', card: `> .${Config.CLASSES.cardRebuilt}` } : hn.includes("javdb") ? { cont: ".movie-list, .tile-images.tile-small", card: `> .${Config.CLASSES.cardRebuilt}` } : null;
        if (!sel || cols <= 0) {
          styleEl.innerHTML = "";
          return;
        }
        const containerList = sel.cont.split(",").map((s) => s.trim());
        const cardRules = containerList.map((s) => `${s} ${sel.card}`).join(", ");
        const baseGridCss = `
                display: grid !important; 
                grid-template-columns: repeat(${cols === 2 ? 2 : 1}, 1fr) !important; 
                gap: 1rem !important; 
                margin: 0 !important; 
                padding: 1rem 10px !important; 
                width: 100% !important; 
                max-width: none !important; 
                box-sizing: border-box !important;
            `;
        const cardCss = sel.card ? `${cardRules} { padding: 0 !important; margin: 0 !important; width: 100% !important; box-sizing: border-box !important; }` : "";
        styleEl.innerHTML = `
                ${sel.cont} { ${baseGridCss} }
                ${cardCss}
                ${sel.cont} .inner { padding: 0 !important; }
                @media (min-width: 768px) {
                    ${sel.cont} { grid-template-columns: repeat(${cols}, 1fr) !important; padding: 1rem 0 !important; }
                }
            `;
      }
    };
  })();
  const ScraperService = (() => {
    let previewChain = Promise.resolve();
    let backoffUntil = 0;
    let activeRequests = 0;
    const MAX_CONCURRENT_BATCHES = Config.SCRAPER_CONFIG.MAX_CONCURRENT_BATCHES;
    const requestQueue = [];
    return {
      async fetchMagnets(items, onResult) {
        if (!items?.length) return;
        const grouped = new Map();
        items.forEach((item) => {
          const key = item.type || "fc2";
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key).push(item);
        });
        for (const [type, itemList] of grouped) {
          const ids = itemList.map((i) => i.id);
          for (const chunk of Utils.chunk(ids, NETWORK.CHUNK_SIZE)) {
            this._enqueueRequest(async () => {
              const now = Date.now();
              if (now < backoffUntil) await Utils.sleep(backoffUntil - now);
              const delay = TIMING.MAGNET_BASE_DELAY_MS + Math.random() * TIMING.MAGNET_RANDOM_DELAY_MS;
              await Utils.sleep(delay);
              const foundIds = await this._fetchFromSukebei(chunk, type, onResult);
              const failedIds = chunk.filter((id) => !foundIds.has(id));
              if (failedIds.length > 0) {
                this._fetchFrom0cili(failedIds, type, onResult).catch(() => {
                });
              }
            });
          }
        }
      },
      _enqueueRequest(task) {
        requestQueue.push(task);
        this._runNext();
      },
      async _runNext() {
        if (activeRequests >= MAX_CONCURRENT_BATCHES || requestQueue.length === 0) return;
        activeRequests++;
        const task = requestQueue.shift();
        try {
          await task();
        } finally {
          activeRequests--;
          this._runNext();
        }
      },
      async _fetchFromSukebei(chunk, type, onResult) {
        const query = type === "fc2" ? chunk.join("|") : chunk.flatMap((id) => [id, id.replace(/-/g, "_")]).join("|");
        const url = Config.SCRAPER_URLS.SUKEBEI_SEARCH.replace("{query}", encodeURIComponent(query));
        try {
          const rawHtml = await http(url, { type: "text" });
          const doc = new DOMParser().parseFromString(rawHtml, "text/html");
          if (doc.title && (doc.title.includes("Cloudflare") || doc.title.includes("Attention Required"))) {
            Logger$1.warn("Scraper", "Cloudflare blocked, backing off 60s");
            backoffUntil = Date.now() + TIMING.CLOUDFLARE_BACKOFF_MS;
            return new Set();
          }
          const rows = doc.querySelectorAll("table.torrent-list tbody tr");
          const foundIds = new Set();
          const regexes = chunk.map((id) => ({
            id,
            regex: new RegExp(id.toUpperCase().replace(/[-_\s]/g, "[-_\\s]"), "i"),
            searchId: id.toUpperCase()
          }));
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const magnetAnchor = row.querySelector("a[href^='magnet:?']");
            const linkAnchor = row.querySelector('a[href*="/view/"]') || row.querySelector("td:nth-child(2) a");
            if (magnetAnchor && linkAnchor) {
              const title = linkAnchor.textContent?.trim().toUpperCase() || "";
              const magnet = magnetAnchor.href;
              for (const { id, regex, searchId } of regexes) {
                if (foundIds.has(id)) continue;
                const match = title.match(regex);
                if (match) {
                  const idx = match.index;
                  const matchedStr = match[0];
                  const before = title[idx - 1], after = title[idx + matchedStr.length];
                  const isDigit = (c) => c >= "0" && c <= "9";
                  if (isDigit(searchId[0]) && before && isDigit(before)) continue;
                  if (isDigit(searchId[searchId.length - 1]) && after && isDigit(after)) continue;
                  onResult(id, magnet);
                  foundIds.add(id);
                }
              }
            }
          }
          Logger$1.success("Scraper", `Sukebei: ${foundIds.size}/${chunk.length} magnets found`);
          return foundIds;
        } catch (e) {
          if (e.status === 429) {
            Logger$1.warn("Scraper", "429 Too Many Requests, backing off 60s");
            backoffUntil = Date.now() + TIMING.RATE_LIMIT_BACKOFF_MS;
          } else {
            Logger$1.error("Scraper", "Sukebei fetch error", e);
          }
          return new Set();
        }
      },
      async _fetchFrom0cili(ids, type, onResult) {
        for (const id of ids) {
          try {
            const searchQuery = type === "fc2" ? id : id.replace(/-/g, " ");
            const url = Config.SCRAPER_URLS.OCILI_SEARCH.replace("{query}", encodeURIComponent(searchQuery));
            const rawHtml = await http(url, { type: "text" });
            const doc = new DOMParser().parseFromString(rawHtml, "text/html");
            const rows = doc.querySelectorAll("table tbody tr, .torrent-list tr");
            let found = false;
            const searchId = id.toUpperCase();
            const regex = new RegExp(searchId.replace(/[-_\s]/g, "[-_\\s]"), "i");
            for (const row of Array.from(rows)) {
              const magnetAnchor = row.querySelector("a[href^='magnet:?']");
              const titleElement = row.querySelector("a[title], td:nth-child(2) a, .name a");
              if (magnetAnchor && titleElement) {
                const title = (titleElement.getAttribute("title") || titleElement.textContent || "").trim().toUpperCase();
                if (regex.test(title)) {
                  onResult(id, magnetAnchor.href);
                  found = true;
                  Logger$1.success("Scraper", `0cili: Found magnet for ${id}`);
                  break;
                }
              }
            }
            if (!found) {
              onResult(id, null);
              Logger$1.warn("Scraper", `0cili: No magnet found for ${id}`);
            }
            await Utils.sleep(TIMING.OCILI_DELAY_MS + Math.random() * TIMING.OCILI_RANDOM_DELAY_MS);
          } catch (e) {
            Logger$1.error("Scraper", `0cili fetch error for ${id}`, e);
            onResult(id, null);
          }
        }
      },
      async fetchActressFromFD2(id) {
        const cacheKey = `actress_${id}`;
        const cached = await CacheManager.get(cacheKey);
        if (cached) {
          Logger$1.success("Scraper", `Actress cache hit: ${id} = ${cached}`);
          return cached;
        }
        const now = Date.now();
        const lastFetch = Number(Storage.get("last_actress_fetch", 0));
        const waitTime = Math.max(
          0,
          lastFetch + TIMING.ACTRESS_BASE_DELAY_MS + Math.random() * TIMING.ACTRESS_RANDOM_DELAY_MS - now
        );
        if (waitTime > 0) await Utils.sleep(waitTime);
        Storage.set("last_actress_fetch", Date.now());
        try {
          const url = EXTERNAL_URLS.FD2.replace("{id}", id);
          const html = await http(url, { type: "text" });
          const doc = new DOMParser().parseFromString(html, "text/html");
          const actressLinks = Array.from(
            doc.querySelectorAll('.artist-name a, a[href*="/artist/"], a[href*="/star/"]')
          );
          let actress = null;
          for (const link of actressLinks) {
            const cleaned = Utils.cleanActressName(link.textContent);
            if (cleaned) {
              actress = cleaned;
              break;
            }
          }
          if (actress) {
            await CacheManager.set(cacheKey, actress);
            Logger$1.success("Scraper", `Fetched actress: ${id} = ${actress}`);
          }
          return actress;
        } catch (e) {
          Logger$1.error("Scraper", `Failed to fetch actress: ${id}`, e);
          return "VERIFY_CF_SHIELD";
        }
      },
      async fetchExtraPreviews(fc2Id) {
        try {
          const url = Config.SCRAPER_URLS.WUMAOBI_DETAIL.replace("{id}", fc2Id);
          const rawHtml = await http(url, {
            type: "text"
          });
          const doc = new DOMParser().parseFromString(rawHtml, "text/html");
          const results = [];
          const blacklist = PREVIEW_BLACKLIST;
          doc.querySelectorAll("img").forEach((img) => {
            let src = img.getAttribute("src");
            if (src) {
              const lowSrc = src.toLowerCase();
              const isBad = blacklist.some((key) => lowSrc.includes(key));
              if (!isBad) {
                if (src.startsWith("/")) src = Config.SCRAPER_URLS.WUMAOBI_BASE + src;
                results.push({ type: "image", src });
              }
            }
          });
          doc.querySelectorAll("video").forEach((video) => {
            let src = video.getAttribute("src") || video.querySelector("source")?.getAttribute("src");
            if (src) {
              if (src.startsWith("/")) src = Config.SCRAPER_URLS.WUMAOBI_BASE + src;
              results.push({ type: "video", src });
            }
          });
          return results;
        } catch (e) {
          Logger$1.warn("Scraper", `Failed to fetch extra previews: ${fc2Id}`);
          return [];
        }
      },
      async checkPreviewExists(fc2Id) {
        const cacheKey = `has_previews_${fc2Id}`;
        const cached = await CacheManager.get(cacheKey);
        if (cached !== null) return cached === true;
        const task = async () => {
          const now = Date.now();
          if (now < backoffUntil) await Utils.sleep(backoffUntil - now);
          await Utils.sleep(TIMING.POLITE_DELAY_MS);
          const results = await this.fetchExtraPreviews(fc2Id);
          const exists = results.length > 0;
          await CacheManager.set(cacheKey, exists);
          return exists;
        };
        previewChain = previewChain.then(task).catch(() => false);
        return previewChain;
      }
    };
  })();
  const UIButtons = {
    btn: (iconSvg, tip, href, onClick, className = "") => {
      const children = [];
      if (iconSvg) {
        children.push(UIUtils.icon(iconSvg));
      }
      children.push(
        h("span", { className: Config.CLASSES.buttonText }, tip),
        h("span", { className: Config.CLASSES.tooltip }, tip)
      );
      const b = h(
        "a",
        {
          href: href || "javascript:void(0);",
          className: `${Config.CLASSES.resourceBtn} ${className}`.trim(),
          onclick: onClick,
          ontouchend: (e) => {
            if (onClick && "ontouchstart" in window) {
              e.preventDefault();
              onClick(e);
            }
          }
        },
        ...children
      );
      return b;
    },
    addPreviewButton: async (cont, id, openGallery) => {
      if (!cont || !id || cont.querySelector(".btn-gallery")) return;
      const exists = await ScraperService.checkPreviewExists(id);
      if (!exists) return;
      const previewBtn = UIButtons.btn(IconImages, t("extraPreviewTitle"), "javascript:;", async (e) => {
        const btn = e.currentTarget;
        if (btn.classList.contains(Config.CLASSES.btnLoading)) return;
        btn.classList.add(Config.CLASSES.btnLoading);
        try {
          const res = await ScraperService.fetchExtraPreviews(id);
          if (res?.length) openGallery(id, res);
          else Toast$1.show(t("alertNoPreview"), "info");
        } finally {
          btn.classList.remove(Config.CLASSES.btnLoading);
        }
      });
      previewBtn.classList.add("btn-gallery");
      const magnetBtn = cont.querySelector(`.${Config.CLASSES.btnMagnet}`);
      if (magnetBtn) cont.insertBefore(previewBtn, magnetBtn);
      else cont.appendChild(previewBtn);
    },
    addActressButton: (cont, actress) => {
      if (!cont || !actress || cont.querySelector(".btn-actress")) return;
      const actBtn = h(
        "button",
        {
          className: `${Config.CLASSES.resourceBtn} btn-actress`,
          onclick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            Utils.copyToClipboard(actress);
            const originalText = actBtn.textContent;
            actBtn.textContent = t("tooltipCopied");
            setTimeout(() => {
              actBtn.textContent = originalText;
            }, 1500);
          }
        },
        actress
      );
      const leftActions = cont.querySelector(".card-left-actions");
      const links = cont.querySelector(`.${Config.CLASSES.resourceLinksContainer}`);
      if (leftActions) cont.insertBefore(actBtn, leftActions);
      else if (links) cont.insertBefore(actBtn, links);
      else cont.appendChild(actBtn);
    },
    addMagnetButton: (cont, url) => {
      if (cont && !cont.querySelector(`.${Config.CLASSES.btnMagnet}`)) {
        const btn = UIButtons.btn(IconMagnet, t("tooltipCopyMagnet"), "javascript:void(0);", (e) => {
          e.preventDefault();
          Utils.copyToClipboard(url);
          const tt = btn.querySelector(`.${Config.CLASSES.tooltip}`);
          if (tt) tt.textContent = t("tooltipCopied");
        });
        btn.classList.add(Config.CLASSES.btnMagnet);
        cont.appendChild(btn);
      }
    }
  };
  const UIGallery = {
    createExtraPreviewsGrid: (previews) => {
      if (!previews?.length) return null;
      return h(
        "div",
        { className: Config.CLASSES.extraPreviewContainer },
        h("h2", { className: Config.CLASSES.extraPreviewTitle }, t("extraPreviewTitle")),
        h(
          "div",
          { className: Config.CLASSES.extraPreviewGrid },
          ...previews.map(
            (p) => p.type === "image" ? h("img", { src: p.src, loading: "lazy" }) : h("video", { src: p.src, autoplay: true, loop: true, muted: true, controls: true })
          )
        )
      );
    },
    openGallery: (_id, previews) => {
      previews.forEach((p) => {
        if (p.type === "image") {
          const img = new Image();
          img.src = p.src;
        } else if (p.type === "video") {
          const v = document.createElement("video");
          v.preload = "auto";
          v.src = p.src;
        }
      });
      let index = 0;
      let isZoomed = false;
      const container = h("div", { className: "enh-viewer-backdrop" });
      const render = () => {
        const item = previews[index];
        container.replaceChildren();
        const closeBtn = h(
          "div",
          { className: "enh-viewer-close", onclick: () => container.remove() },
          h("span", { className: "fc2-icon", style: { fontSize: "24px" }, innerHTML: IconXmark })
        );
        const counter = h("div", { className: "enh-viewer-counter" }, `${index + 1} / ${previews.length}`);
        const stage = h("div", {
          className: "enh-viewer-stage",
          style: isZoomed ? "overflow: auto; align-items: flex-start; justify-content: flex-start;" : "",
          onclick: (e) => {
            if (e.target === stage) container.remove();
          }
        });
        const media = item.type === "image" ? h("img", {
          src: item.src,
          onclick: (e) => {
            e.stopPropagation();
            isZoomed = !isZoomed;
            render();
          },
          style: isZoomed ? "cursor: zoom-out; max-width: none; max-height: none; width: auto; height: auto; margin: auto;" : "cursor: zoom-in; width: 100%; height: 100%; object-fit: contain;"
        }) : h("video", {
          src: item.src,
          controls: true,
          autoplay: true,
          loop: true,
          onclick: (e) => e.stopPropagation(),
          style: "width: 100%; height: 100%; object-fit: contain;"
        });
        stage.appendChild(media);
        if (previews.length > 1) {
          const prev = h(
            "div",
            {
              className: "enh-viewer-nav prev",
              onclick: (e) => {
                e.stopPropagation();
                isZoomed = false;
                index = (index - 1 + previews.length) % previews.length;
                render();
              }
            },
            h("span", { className: "fc2-icon", style: { fontSize: "40px" }, innerHTML: IconChevronLeft })
          );
          const next = h(
            "div",
            {
              className: "enh-viewer-nav next",
              onclick: (e) => {
                e.stopPropagation();
                isZoomed = false;
                index = (index + 1) % previews.length;
                render();
              }
            },
            h("span", { className: "fc2-icon", style: { fontSize: "40px" }, innerHTML: IconChevronRight })
          );
          container.append(prev, next);
        }
        container.append(stage, closeBtn, counter);
      };
      const keyHandler = ((e) => {
        if (!container.isConnected) {
          window.removeEventListener("keydown", keyHandler);
          return;
        }
        if (e.key === "ArrowLeft") {
          isZoomed = false;
          index = (index - 1 + previews.length) % previews.length;
          render();
        } else if (e.key === "ArrowRight" || e.key === " ") {
          e.preventDefault();
          isZoomed = false;
          index = (index + 1) % previews.length;
          render();
        } else if (e.key === "Escape") {
          container.remove();
        }
      });
      window.addEventListener("keydown", keyHandler);
      let touchStartX = 0;
      let touchStartY = 0;
      let lastTapTime = 0;
      container.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });
      container.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const now = Date.now();
        if (now - lastTapTime < 300 && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
          if (previews[index].type === "image") {
            e.preventDefault();
            isZoomed = !isZoomed;
            render();
          }
        }
        lastTapTime = now;
        if (!isZoomed) {
          if (diffY > 100 && Math.abs(diffX) < 50) {
            container.remove();
            return;
          }
          if (Math.abs(diffX) > 50 && Math.abs(diffY) < 50) {
            if (diffX > 0) index = (index - 1 + previews.length) % previews.length;
            else index = (index + 1) % previews.length;
            render();
          }
        }
      }, { passive: false });
      render();
      document.body.appendChild(container);
    }
  };
  const UICard = {
    createEnhancedCard: (data, markViewed) => {
      const C = Config.CLASSES;
      const {
        id,
        type,
        title,
        primaryImageUrl,
        fallbackImageUrl,
        articleUrl,
        preservedIconsHTML,
        customClass,
        actress,
        previewSlug
      } = data;
      const ctrls = h("div", { className: "card-top-right-controls" });
      if (State.proxy.enableHistory) {
        const status = HistoryManager.getStatus(id);
        const isViewed = status === "watched";
        const isWanted = status === "wanted";
        const isBlocked = status === "blocked";
        const vBtn = h(
          "span",
          {
            className: `resource-btn btn-toggle-view ${isViewed ? "is-viewed" : ""}`,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              const c = vBtn.closest(`.${C.processedCard}`), oc = c?.closest(`.${C.cardRebuilt}`);
              if (!c) return;
              const newState = !c.classList.contains(C.isViewed);
              if (newState) HistoryManager.add(id, "watched");
              else HistoryManager.remove(id);
              c.classList.toggle(C.isViewed, newState);
              vBtn.classList.toggle("is-viewed", newState);
              const tt = vBtn.querySelector(`.${C.tooltip}`);
              if (tt) tt.textContent = newState ? t("tooltipMarkAsUnviewed") : t("tooltipMarkAsViewed");
              if (oc) {
                oc.classList.toggle(C.isViewed, newState);
                UIUtils.applyHistoryVisibility(oc);
              }
            }
          },
          UIUtils.icon(IconEye, "icon-viewed"),
          UIUtils.icon(IconEyeSlash, "icon-unviewed"),
          h("span", { className: C.tooltip }, isViewed ? t("tooltipMarkAsUnviewed") : t("tooltipMarkAsViewed"))
        );
        const wBtn = h(
          "span",
          {
            className: `resource-btn btn-toggle-wanted ${isWanted ? "is-wanted" : ""}`,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              const c = wBtn.closest(`.${C.processedCard}`), oc = c?.closest(`.${C.cardRebuilt}`);
              if (!c) return;
              const newState = !c.classList.contains(C.isWanted);
              if (newState) HistoryManager.add(id, "wanted");
              else HistoryManager.remove(id);
              c.classList.toggle(C.isWanted, newState);
              wBtn.classList.toggle("is-wanted", newState);
              if (oc) oc.classList.toggle(C.isWanted, newState);
            }
          },
          UIUtils.icon(IconStar, "icon-wanted"),
          h("span", { className: C.tooltip }, isWanted ? t("tooltipMarkAsUnwanted") : t("tooltipMarkAsWanted"))
        );
        const bBtn = h(
          "span",
          {
            className: `resource-btn btn-toggle-blocked ${isBlocked ? "is-blocked" : ""}`,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              const c = bBtn.closest(`.${C.processedCard}`), oc = c?.closest(`.${C.cardRebuilt}`);
              if (!c) return;
              const newState = !c.classList.contains(C.isBlocked);
              if (newState) HistoryManager.add(id, "blocked");
              else HistoryManager.remove(id);
              c.classList.toggle(C.isBlocked, newState);
              bBtn.classList.toggle("is-blocked", newState);
              if (oc) {
                oc.classList.toggle(C.isBlocked, newState);
                UIUtils.applyHistoryVisibility(oc);
              }
            }
          },
          UIUtils.icon(IconBan, "icon-blocked"),
          h("span", { className: C.tooltip }, isBlocked ? t("tooltipMarkAsUnblocked") : t("tooltipMarkAsBlocked"))
        );
        ctrls.append(vBtn);
      }
      const leftActions = h("div", { className: "card-left-actions" });
      if (State.proxy.enableHistory) {
        const status = HistoryManager.getStatus(id);
        const isWanted = status === "wanted";
        const isBlocked = status === "blocked";
        const wBtn = h(
          "span",
          {
            className: `resource-btn btn-toggle-wanted ${isWanted ? "is-wanted" : ""}`,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              const c = wBtn.closest(`.${C.processedCard}`), oc = c?.closest(`.${C.cardRebuilt}`);
              if (!c) return;
              const newState = !c.classList.contains(C.isWanted);
              if (newState) HistoryManager.add(id, "wanted");
              else HistoryManager.remove(id);
              c.classList.toggle(C.isWanted, newState);
              wBtn.classList.toggle("is-wanted", newState);
              if (oc) oc.classList.toggle(C.isWanted, newState);
            }
          },
          UIUtils.icon(IconStar, "icon-wanted"),
          h("span", { className: C.tooltip }, isWanted ? t("tooltipMarkAsUnwanted") : t("tooltipMarkAsWanted"))
        );
        const bBtn = h(
          "span",
          {
            className: `resource-btn btn-toggle-blocked ${isBlocked ? "is-blocked" : ""}`,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              const c = bBtn.closest(`.${C.processedCard}`), oc = c?.closest(`.${C.cardRebuilt}`);
              if (!c) return;
              const newState = !c.classList.contains(C.isBlocked);
              if (newState) HistoryManager.add(id, "blocked");
              else HistoryManager.remove(id);
              c.classList.toggle(C.isBlocked, newState);
              bBtn.classList.toggle("is-blocked", newState);
              if (oc) {
                oc.classList.toggle(C.isBlocked, newState);
                UIUtils.applyHistoryVisibility(oc);
              }
            }
          },
          UIUtils.icon(IconBan, "icon-blocked"),
          h("span", { className: C.tooltip }, isBlocked ? t("tooltipMarkAsUnblocked") : t("tooltipMarkAsBlocked"))
        );
        leftActions.append(wBtn, bBtn);
      }
      const badge = h(
        "div",
        {
          className: `${C.fc2IdBadge} ${C.resourceBtn}`,
          title: t("tooltipClickToCopy"),
          onclick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            UIUtils.copyButtonBehavior(badge, id, "COPIED");
            badge.classList.add("pulse-once");
            setTimeout(() => badge.classList.remove("pulse-once"), 1200);
          }
        },
        id
      );
      ctrls.appendChild(badge);
      const img = h("img", {
        src: primaryImageUrl || data.imageUrl,
        className: `${C.staticPreview} ${C.previewElement}`,
        loading: "lazy",
        decoding: "async",
        onerror: function() {
          if (fallbackImageUrl && !this.dataset.fallbackTried) {
            this.dataset.fallbackTried = "true";
            this.src = fallbackImageUrl;
          }
        }
      });
      const previewLink = h(
        "a",
        {
          className: C.videoPreviewContainer,
          href: articleUrl || "javascript:void(0);",
          target: "_blank",
          rel: "noopener noreferrer",
          onclick: (e) => {
            if (e.target.closest(".card-top-right-controls")) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              markViewed(id, e.currentTarget);
            }
          }
        },
        img,
        ctrls
      );
      if (preservedIconsHTML) {
        const iconCont = h("div", { className: C.preservedIconsContainer, innerHTML: preservedIconsHTML });
        previewLink.appendChild(iconCont);
      }
      const links = h("div", { className: C.resourceLinksContainer });
      if (State.proxy.enableExternalLinks) {
        const dropdown = h("div", { className: "enh-dropdown" });
        const dropdownContent = h("div", { className: "enh-dropdown-content" });
        const trigger = UIButtons.btn(IconLink, t("labelExternalLinks"), "javascript:;", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isActive = dropdown.classList.contains("active");
          document.querySelectorAll(".enh-dropdown.active").forEach((d) => d.classList.remove("active"));
          if (!isActive) {
            dropdown.classList.add("active");
            card.classList.add("has-active-dropdown");
            const outer = card.closest(".card-rebuilt");
            if (outer) outer.classList.add("has-active-dropdown");
          } else {
            card.classList.remove("has-active-dropdown");
            const outer = card.closest(".card-rebuilt");
            if (outer) outer.classList.remove("has-active-dropdown");
          }
        });
        trigger.classList.add("enh-dropdown-trigger");
        trigger.appendChild(h("span", { className: "fc2-icon", innerHTML: IconCaretDown, style: { marginLeft: "4px", opacity: "0.6", fontSize: "10px" } }));
        const hn = location.hostname;
        const { EXTERNAL_URLS: EXTERNAL_URLS2 } = Config;
        [
          { n: "Supjav", i: IconBolt, u: EXTERNAL_URLS2.SUPJAV.replace("{id}", id), s: !hn.includes("supjav") },
          { n: "MissAV", i: IconPlayCircle, u: type === "fc2" ? EXTERNAL_URLS2.MISSAV_FC2.replace("{id}", id) : EXTERNAL_URLS2.MISSAV.replace("{id}", id), s: !hn.includes("missav") },
          { n: "JavDB", i: IconDatabase, u: EXTERNAL_URLS2.JAVDB.replace("{id}", id), s: !hn.includes("javdb") },
          { n: "FC2DB", i: IconListUl, u: EXTERNAL_URLS2.FC2DB.replace("{id}", id), s: type === "fc2" && !hn.includes("fc2ppvdb") },
          { n: "FD2", i: IconServer, u: EXTERNAL_URLS2.FD2.replace("{id}", id), s: type === "fc2" && !hn.includes("fd2ppv") },
          { n: "Sukebei", i: IconMagnifyingGlass, u: EXTERNAL_URLS2.SUKEBEI.replace("{id}", id), s: true }
        ].filter((x) => x.s).forEach((x) => {
          dropdownContent.appendChild(UIButtons.btn(x.i, x.n, x.u));
        });
        dropdown.append(trigger, dropdownContent);
        links.appendChild(dropdown);
      }
      if (!window._dropdownHandlerSet) {
        const closeDropdowns = (e) => {
          if (e.target.closest(".enh-dropdown-trigger")) return;
          document.querySelectorAll(".enh-dropdown.active").forEach((d) => d.classList.remove("active"));
          document.querySelectorAll(".has-active-dropdown").forEach((c) => c.classList.remove("has-active-dropdown"));
        };
        document.addEventListener("click", closeDropdowns);
        document.addEventListener("touchstart", closeDropdowns, { passive: true });
        window._dropdownHandlerSet = true;
      }
      const titleEl = title ? h(
        "a",
        {
          className: C.customTitle,
          href: articleUrl || "javascript:;",
          target: "_blank",
          style: { textDecoration: "none", color: "var(--fc2-enh-text)", display: "block" },
          onclick: (e) => markViewed(id, e.currentTarget)
        },
        title
      ) : null;
      const info = h("div", { className: C.infoArea });
      if (titleEl) info.appendChild(titleEl);
      if (actress && State.proxy.enableActressName) {
        if (actress === "VERIFY_CF_SHIELD") {
          info.appendChild(UIButtons.btn("", t("verifyCF"), `https://fd2ppv.cc/articles/${id}`, (e) => {
          }, "verify-cf-btn"));
        } else {
          UIButtons.addActressButton(leftActions, actress);
        }
      }
      leftActions.appendChild(links);
      info.appendChild(leftActions);
      const card = h(
        "div",
        {
          className: `${C.processedCard} ${type}-card ${customClass || ""}`,
          dataset: { id, type, previewSlug: previewSlug || "" }
        },
        previewLink,
        info
      );
      if (preservedIconsHTML && preservedIconsHTML.includes("icon-mosaic_free color_free0")) card.classList.add(C.isCensored);
      if (State.proxy.enableHistory && HistoryManager.has(id)) card.classList.add(C.isViewed);
      return { finalElement: card, linksContainer: links, newCard: card };
    }
  };
  const UIToolbar = {
    createDetailToolbar: (data, markViewed, addPreviewButton) => {
      const { id, type, actress } = data;
      const C = Config.CLASSES;
      const toolbar = h("div", { className: "enh-toolbar" });
      const infoArea = h("div", { className: `${C.infoArea} info-area` });
      const ctrls = h("div", { className: "card-top-right-controls" });
      if (State.proxy.enableHistory) {
        const status = HistoryManager.getStatus(id);
        const isViewed = status === "watched";
        const vBtn = h(
          "a",
          {
            href: "javascript:;",
            className: `resource-btn btn-toggle-view ${isViewed ? "is-viewed" : ""}`,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              const newState = !vBtn.classList.contains("is-viewed");
              if (newState) HistoryManager.add(id, "watched");
              else HistoryManager.remove(id);
              vBtn.classList.toggle("is-viewed", newState);
              const tt = vBtn.querySelector(`.${C.tooltip}`);
              if (tt) tt.textContent = newState ? t("tooltipMarkAsUnviewed") : t("tooltipMarkAsViewed");
            }
          },
          UIUtils.icon(IconEye, "icon-viewed"),
          UIUtils.icon(IconEyeSlash, "icon-unviewed"),
          h("span", { className: C.tooltip }, isViewed ? t("tooltipMarkAsUnviewed") : t("tooltipMarkAsViewed"))
        );
        ctrls.appendChild(vBtn);
      }
      const badge = h(
        "div",
        {
          className: `${C.fc2IdBadge} ${C.resourceBtn}`,
          title: t("tooltipClickToCopy"),
          onclick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            UIUtils.copyButtonBehavior(badge, id, "COPIED");
          }
        },
        id
      );
      ctrls.appendChild(badge);
      const links = h("div", { className: `${C.resourceLinksContainer} resource-links-container` });
      if (State.proxy.enableHistory) {
        const status = HistoryManager.getStatus(id);
        const isWanted = status === "wanted";
        const isBlocked = status === "blocked";
        const wBtn = h(
          "a",
          {
            href: "javascript:;",
            className: `resource-btn btn-toggle-wanted ${isWanted ? "is-wanted" : ""}`,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              const newState = !wBtn.classList.contains("is-wanted");
              if (newState) HistoryManager.add(id, "wanted");
              else HistoryManager.remove(id);
              wBtn.classList.toggle("is-wanted", newState);
            }
          },
          UIUtils.icon(IconStar, "icon-wanted"),
          h("span", { className: C.tooltip }, isWanted ? t("tooltipMarkAsUnwanted") : t("tooltipMarkAsWanted"))
        );
        const bBtn = h(
          "a",
          {
            href: "javascript:;",
            className: `resource-btn btn-toggle-blocked ${isBlocked ? "is-blocked" : ""}`,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              const newState = !bBtn.classList.contains("is-blocked");
              if (newState) HistoryManager.add(id, "blocked");
              else HistoryManager.remove(id);
              bBtn.classList.toggle("is-blocked", newState);
            }
          },
          UIUtils.icon(IconBan, "icon-blocked"),
          h("span", { className: C.tooltip }, isBlocked ? t("tooltipMarkAsUnblocked") : t("tooltipMarkAsBlocked"))
        );
        links.append(wBtn, bBtn);
      }
      if (State.proxy.enableExternalLinks) {
        const dropdown = h("div", { className: "enh-dropdown" });
        const dropdownContent = h("div", { className: "enh-dropdown-content" });
        const trigger = UIButtons.btn(IconLink, t("labelExternalLinks"), "javascript:;", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isActive = dropdown.classList.contains("active");
          document.querySelectorAll(".enh-dropdown.active").forEach((d) => d.classList.remove("active"));
          if (!isActive) dropdown.classList.add("active");
        });
        trigger.classList.add("enh-dropdown-trigger");
        trigger.appendChild(h("span", { className: "fc2-icon", innerHTML: IconCaretDown, style: { marginLeft: "4px", opacity: "0.6", fontSize: "10px" } }));
        const hn = location.hostname;
        const { EXTERNAL_URLS: EXTERNAL_URLS2 } = Config;
        [
          { n: "Supjav", i: IconBolt, u: EXTERNAL_URLS2.SUPJAV.replace("{id}", id), s: !hn.includes("supjav") },
          { n: "MissAV", i: IconPlayCircle, u: type === "fc2" ? EXTERNAL_URLS2.MISSAV_FC2.replace("{id}", id) : EXTERNAL_URLS2.MISSAV.replace("{id}", id), s: !hn.includes("missav") },
          { n: "JavDB", i: IconDatabase, u: EXTERNAL_URLS2.JAVDB.replace("{id}", id), s: !hn.includes("javdb") },
          { n: "FC2DB", i: IconListUl, u: EXTERNAL_URLS2.FC2DB.replace("{id}", id), s: type === "fc2" && !hn.includes("fc2ppvdb") },
          { n: "FD2", i: IconServer, u: EXTERNAL_URLS2.FD2.replace("{id}", id), s: type === "fc2" && !hn.includes("fd2ppv") },
          { n: "Sukebei", i: IconMagnifyingGlass, u: EXTERNAL_URLS2.SUKEBEI.replace("{id}", id), s: true }
        ].filter((x) => x.s).forEach((x) => {
          dropdownContent.appendChild(UIButtons.btn(x.i, x.n, x.u));
        });
        dropdown.append(trigger, dropdownContent);
        links.appendChild(dropdown);
      }
      infoArea.appendChild(ctrls);
      if (actress) UIButtons.addActressButton(infoArea, actress);
      infoArea.appendChild(links);
      toolbar.appendChild(infoArea);
      ScraperService.fetchMagnets([{ id, type }], async (_, url) => {
        await CacheManager.set(id, url);
        if (url) UIButtons.addMagnetButton(links, url);
      });
      if (type === "fc2") addPreviewButton(links, id);
      return toolbar;
    }
  };
  const UIBuilder = {
    createElement: UIUtils.h,
    markViewed: (id, el) => UIUtils.markByStatus(id, "watched", el, UIUtils.applyHistoryVisibility),
    markByStatus: (id, status, el) => UIUtils.markByStatus(id, status, el, UIUtils.applyHistoryVisibility),
    btn: UIButtons.btn,
    createEnhancedCard: (data) => UICard.createEnhancedCard(data, UIBuilder.markViewed),
    createExtraPreviewsGrid: UIGallery.createExtraPreviewsGrid,
    openGallery: UIGallery.openGallery,
    addPreviewButton: (cont, id) => UIButtons.addPreviewButton(cont, id, UIGallery.openGallery),
    addActressButton: UIButtons.addActressButton,
    toggleLoading: (cont, show) => UIUtils.toggleLoading(cont, show, UIButtons.btn),
    addMagnetButton: UIButtons.addMagnetButton,
    applyCardVisibility: UIUtils.applyCardVisibility,
    applyCensoredFilter: UIUtils.applyCensoredFilter,
    applyHistoryVisibility: UIUtils.applyHistoryVisibility,
    createDetailToolbar: (id, type, title, actress, previewSlug) => UIToolbar.createDetailToolbar({ id, type, title, actress, previewSlug }, UIBuilder.markViewed, UIBuilder.addPreviewButton)
  };
  const EnhancedPreviewManager = {
cache: new Map(),
    maxCacheSize: 5,

preloadQueue: new Set(),
    isPreloading: false,
_loadVideoProgressive(card) {
      const cont = card.querySelector(`.${Config.CLASSES.videoPreviewContainer}`);
      const img = cont?.querySelector(`img.${Config.CLASSES.staticPreview}`);
      if (!cont || !img) return;
      const { id, type, previewSlug } = card.dataset;
      const url = this._getPreviewUrl(id, type, previewSlug);
      const cached = this.cache.get(id);
      if (cached && cached.element instanceof HTMLVideoElement) {
        const video2 = cached.element;
        if (video2.parentNode !== cont) {
          if (video2.parentNode) video2.remove();
          cont.appendChild(video2);
        }
        video2.classList.remove(Config.CLASSES.hidden);
        img.classList.add(Config.CLASSES.hidden);
        video2.play().catch(() => {
        });
        cached.timestamp = Date.now();
        if (!("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
          this._attachWarmCleanup(card, video2, img, cont);
        }
        return;
      }
      if (cont.querySelector("video")) return;
      this._showLoadingIndicator(cont);
      const video = this._createVideoElement(url);
      cont.appendChild(video);
      let isStillHovered = true;
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (!isTouch) {
        this._attachWarmCleanup(card, video, img, cont, () => {
          isStillHovered = false;
        });
      }
      this._attachLoadingEventsWithCheck(video, cont, img, () => isStillHovered, id);
      Logger$1.log("PreviewManager", `Loading preview for ${id}`);
    },
_attachWarmCleanup(card, video, img, cont, onCleanup) {
      const cleanup = () => {
        if (onCleanup) onCleanup();
        if (video.isConnected) {
          video.pause();
          video.classList.add(Config.CLASSES.hidden);
        }
        img.classList.remove(Config.CLASSES.hidden);
        this._hideLoadingIndicator(cont);
        const id = card.dataset.id;
        if (id) this._cachePreview(id, video);
      };
      card.addEventListener("mouseleave", cleanup, { once: true });
    },
_createVideoElement(url) {
      const video = h("video", {
        src: url,
        autoplay: true,
        loop: true,
        muted: true,
        playsInline: true,
        preload: "auto",
        className: `${Config.CLASSES.previewElement} ${Config.CLASSES.hidden}`,
        style: "transition: opacity 0.3s ease"
      });
      return video;
    },
_attachLoadingEventsWithCheck(video, cont, img, checkHover, id) {
      video.addEventListener("progress", () => {
        if (video.buffered.length > 0 && checkHover()) {
          const percent = video.buffered.end(0) / video.duration * 100;
          this._updateLoadingProgress(cont, percent);
        }
      });
      video.addEventListener("playing", () => {
        if (!checkHover()) {
          video.pause();
          this._cachePreview(id, video);
          return;
        }
        requestAnimationFrame(() => {
          if (checkHover()) {
            video.classList.remove(Config.CLASSES.hidden);
            img.classList.add(Config.CLASSES.hidden);
            this._hideLoadingIndicator(cont);
          } else {
            video.pause();
            this._cachePreview(id, video);
          }
        });
      }, { once: true });
      video.play().catch((_err) => {
      });
      video.addEventListener("error", () => {
        if (checkHover()) {
          this._hideLoadingIndicator(cont);
          this._showErrorIndicator(cont);
        }
      });
    },
_showLoadingIndicator(cont) {
      const existing = cont.querySelector(".preview-loading");
      if (existing) return;
      const loader = h(
        "div",
        {
          className: "preview-loading",
          style: `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10;
            `
        },
        h("div", {
          className: "preview-spinner",
          style: `
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                `
        }),
        h("div", {
          className: "preview-progress",
          style: `
                    margin-top: 10px;
                    color: #fff;
                    font-size: 12px;
                    text-align: center;
                `
        }, "加载中...")
      );
      cont.appendChild(loader);
    },
_updateLoadingProgress(cont, percent) {
      const progress = cont.querySelector(".preview-progress");
      if (progress) {
        progress.textContent = `${Math.round(percent)}%`;
      }
    },
_hideLoadingIndicator(cont) {
      const loader = cont.querySelector(".preview-loading");
      if (loader) {
        loader.remove();
      }
    },
_showErrorIndicator(cont) {
      const error = h(
        "div",
        {
          className: "preview-error",
          style: `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #f87171;
                font-size: 12px;
                text-align: center;
                z-index: 10;
            `
        },
        h("span", { className: "fc2-icon", innerHTML: IconTriangleExclamation, style: "font-size: 24px; margin-bottom: 5px; display: inline-block;" }),
        h("div", {}, "预览加载失败")
      );
      cont.appendChild(error);
      setTimeout(() => error.remove(), 3e3);
    },
_getPreviewUrl(id, type, previewSlug) {
      if (previewSlug) {
        return `https://fourhoi.com/${previewSlug.toLowerCase()}/preview.mp4`;
      }
      if (type === "fc2") {
        return `https://fourhoi.com/fc2-ppv-${id}/preview.mp4`;
      }
      return `https://fourhoi.com/${id.toLowerCase()}/preview.mp4`;
    },
async _smartPreload(currentCard) {
      const cards = Array.from(document.querySelectorAll(`.${Config.CLASSES.processedCard}`));
      const currentIndex = cards.indexOf(currentCard);
      if (currentIndex === -1) return;
      const toPreload = [
        cards[currentIndex + 1],
        cards[currentIndex - 1]
      ].filter(Boolean);
      for (const card of toPreload) {
        const { id } = card.dataset;
        if (id && !this.preloadQueue.has(id)) {
          if (this.preloadQueue.size >= 30) {
            const first = this.preloadQueue.values().next().value;
            if (first) this.preloadQueue.delete(first);
          }
          this.preloadQueue.add(id);
          this._preloadVideo(card);
        }
      }
    },
_preloadVideo(card) {
      if (card.querySelector("video")) return;
      const { id, type, previewSlug } = card.dataset;
      const url = this._getPreviewUrl(id, type, previewSlug);
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = url;
      document.head.appendChild(link);
      setTimeout(() => {
        if (link.parentNode) link.remove();
      }, 6e4);
      Logger$1.log("PreviewManager", `Preloading ${id}`);
    },
_cachePreview(id, element) {
      if (this.cache.has(id)) {
        this.cache.get(id).timestamp = Date.now();
        return;
      }
      if (this.cache.size >= this.maxCacheSize) {
        const entries = Array.from(this.cache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        const oldestId = entries[0][0];
        const oldestItem = entries[0][1];
        if (oldestItem.element instanceof HTMLVideoElement) {
          oldestItem.element.pause();
          oldestItem.element.src = "";
          oldestItem.element.load();
          oldestItem.element.remove();
        }
        this.cache.delete(oldestId);
      }
      this.cache.set(id, {
        url: element.src,
        element,
        timestamp: Date.now()
      });
    },
clearCache() {
      this.cache.forEach((item) => {
        if (item.element instanceof HTMLVideoElement) {
          item.element.pause();
          item.element.src = "";
          item.element.load();
          item.element.remove();
        }
      });
      this.cache.clear();
      Logger$1.info("PreviewManager", "Cache cleared");
    },
init(container, selector) {
      const mode = State.proxy.previewMode;
      if (mode === "static") return;
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (isTouch) {
        container.addEventListener(
          "click",
          (e) => {
            const imgEl = e.target.closest(`img.${Config.CLASSES.staticPreview}`);
            if (imgEl) {
              const card = imgEl.closest(selector);
              if (card && !card.querySelector("video")) {
                e.preventDefault();
                e.stopPropagation();
                this._loadVideoProgressive(card);
              }
            }
          },
          true
        );
      } else if (mode === "hover") {
        container.addEventListener(
          "mouseenter",
          (e) => {
            const card = e.target.closest(selector);
            if (card) {
              this._loadVideoProgressive(card);
              this._smartPreload(card);
            }
          },
          true
        );
      }
      window.addEventListener("beforeunload", () => {
        this.clearCache();
      });
      Logger$1.info("PreviewManager", "Enhanced preview manager initialized");
    }
  };
  const PreviewManager = EnhancedPreviewManager;
  const CACHE_NO_MAGNET = "@@NO_MAGNET@@";
  const EnhancedMagnetManager = {
queue: new Map(),
activeSearches: new Set(),
maxConcurrency: MAGNET_CONFIG.MAX_CONCURRENCY,
onProgress: null,
flushTimer: null,
async fetchMagnet(id, type) {
      const cached = await CacheManager.get(id);
      if (cached) {
        if (cached === CACHE_NO_MAGNET) return null;
        return cached;
      }
      if (this.queue.has(id)) {
        const task = this.queue.get(id);
        return new Promise((resolve) => {
          const originalResolve = task.resolve;
          task.resolve = (url) => {
            originalResolve(url);
            resolve(url);
          };
        });
      }
      return new Promise((resolve) => {
        const task = {
          id,
          type: type || MAGNET_CONFIG.DEFAULT_TYPE,
          resolve,
          retryCount: 0,
          status: "pending",
          startTime: Date.now()
        };
        this.queue.set(id, task);
        setTimeout(() => {
          if (this.queue.has(id)) {
            const t2 = this.queue.get(id);
            if (t2 === task && t2.status !== "found" && t2.status !== "failed") {
              this._onTimeout(t2);
            }
          }
        }, MAGNET_CONFIG.SEARCH_TIMEOUT_MS);
        this._requestProcess();
      });
    },
_onTimeout(task) {
      Logger$1.warn("MagnetManager", `Search timed out for ${task.id}`);
      this._notifyUI(task.id, "failed");
      task.resolve(null);
    },
_requestProcess() {
      if (this.flushTimer) clearTimeout(this.flushTimer);
      this.flushTimer = setTimeout(() => {
        this._processQueue();
        this.flushTimer = null;
      }, 100);
    },
async _processQueue() {
      if (this.activeSearches.size >= this.maxConcurrency) return;
      const pending = Array.from(this.queue.values()).filter((t2) => t2.status === "pending").sort((a, b) => a.startTime - b.startTime);
      if (pending.length === 0) return;
      const batchSize = NETWORK.CHUNK_SIZE;
      const batch = pending.slice(0, batchSize);
      batch.forEach((task) => {
        task.status = "searching";
        this.activeSearches.add(task.id);
      });
      this._updateStatus();
      try {
        await this._executeSearchBatch(batch);
      } catch (error) {
        Logger$1.error("MagnetManager", "Batch search error", error);
      } finally {
        batch.forEach((task) => this.activeSearches.delete(task.id));
        this._requestProcess();
      }
    },
async _executeSearchBatch(batch) {
      const ids = batch.map((t2) => t2.id);
      Logger$1.info("MagnetManager", `Searching batch of ${ids.length} items`);
      await ScraperService.fetchMagnets(
        batch.map((t2) => ({ id: t2.id, type: t2.type })),
        (id, url) => {
          const task = this.queue.get(id);
          if (!task) return;
          if (url) {
            this._onTaskSuccess(task, url);
          } else {
            this._onTaskFailed(task, true);
          }
        }
      );
    },
async _onTaskSuccess(task, url) {
      await CacheManager.set(task.id, url);
      task.status = "found";
      task.resolve(url);
      this.queue.delete(task.id);
      this._updateStatus();
      this._notifyUI(task.id, "found", url);
    },
async _onTaskFailed(task, forceFail = false) {
      const maxRetries = MAGNET_CONFIG.MAX_RETRIES;
      if (!forceFail && task.retryCount < maxRetries) {
        task.retryCount++;
        task.status = "pending";
        task.startTime = Date.now() + Math.pow(2, task.retryCount) * MAGNET_CONFIG.RETRY_DELAY;
        Logger$1.warn("MagnetManager", `Retrying ${task.id} (${task.retryCount}/${maxRetries})`);
      } else {
        task.status = "failed";
        task.resolve(null);
        this.queue.delete(task.id);
        this._notifyUI(task.id, "failed");
        await CacheManager.set(task.id, CACHE_NO_MAGNET);
      }
      this._updateStatus();
    },
_notifyUI(id, status, url) {
      const cards = document.querySelectorAll(`[data-id="${id}"]`);
      cards.forEach((card) => {
        const container = card.querySelector(`.${Config.CLASSES.resourceLinksContainer}`);
        const rebuiltCard = card.closest(`.${Config.CLASSES.cardRebuilt}`);
        if (container) {
          if (status === "found" && url) {
            UIBuilder.addMagnetButton(container, url);
            card.classList.remove("no-magnet");
            if (rebuiltCard) {
              UIBuilder.applyCardVisibility(rebuiltCard, true);
            }
          } else if (status === "failed") {
            card.classList.add("no-magnet");
            if (rebuiltCard) {
              UIBuilder.applyCardVisibility(rebuiltCard, false);
            }
          }
        }
      });
    },
_updateStatus() {
      if (!this.onProgress) return;
      const all = Array.from(this.queue.values());
      this.onProgress({
        total: this.queue.size,
        active: this.activeSearches.size,
        found: 0,
failed: all.filter((t2) => t2.status === "failed").length
      });
    },
predictiveSearch(card) {
      const { id, type } = card.dataset;
      if (id && type && !this.queue.has(id)) {
        if (this.queue.size < MAGNET_CONFIG.PREDICTIVE_LIMIT) {
          this.fetchMagnet(id, type);
        }
      }
    },
init() {
      CoreEvents.on(AppEvents.UI_READY, () => {
        Logger$1.info("MagnetManager", "Enhanced Magnet Manager Initialized via UI_READY");
      });
    }
  };
  const MagnetManager = EnhancedMagnetManager;
  var PageContext = ((PageContext2) => {
    PageContext2["Unknown"] = "unknown";
    PageContext2["List"] = "list";
    PageContext2["Detail"] = "detail";
    PageContext2["User"] = "user";
    PageContext2["Search"] = "search";
    return PageContext2;
  })(PageContext || {});
  class BaseSite {
    constructor(config) {
      this.observers = [];
      this.activeContext = PageContext.Unknown;
      this.config = config;
    }
async init() {
      try {
        Logger$1.info("Site", `Initializing ${this.config.name}...`);
        if (this.config.onBeforeInit) await this.config.onBeforeInit();
        PreviewManager.init(document.body, `.${Config.CLASSES.processedCard}`);
        eventBus.on(Events.HISTORY_LOADED, () => {
          const count = document.querySelectorAll(`.${Config.CLASSES.processedCard}`).length;
          if (count > 0) {
            Logger$1.info("Site", `History loaded, refreshing ${count} cards`);
            document.querySelectorAll(`.${Config.CLASSES.processedCard}`).forEach((c) => {
              const id = c.dataset.id;
              if (!id) return;
              const status = HistoryManager.getStatus(id);
              if (status) {
                UIBuilder.markByStatus(id, status, c);
              }
            });
          }
        });
        this.activeContext = this.detectContext();
        if (this.config.list) this.initListMode();
        if (this.config.detail && this.activeContext === PageContext.Detail) {
          this.initDetailMode();
        }
        if (this.config.customInit) this.config.customInit();
        if (this.config.onInit) await this.config.onInit();
        if (this.config.onAfterInit) await this.config.onAfterInit();
        State.on((prop, value) => {
          if (["hideNoMagnet", "enableMagnets", "hideCensored", "hideViewed", "hideBlocked"].includes(prop)) {
            this.refreshVisibility();
          }
        });
      } catch (error) {
        Logger$1.error("Site", `Initialization failed for ${this.config.name}`, error);
      }
    }
refreshVisibility() {
      const enableMagnets = State.proxy.enableMagnets;
      const cards = document.querySelectorAll(`.${Config.CLASSES.cardRebuilt}`);
      cards.forEach((c) => {
        const card = c;
        const hasMagnetBtn = !!card.querySelector(`.${Config.CLASSES.btnMagnet}`);
        const effectiveHasMagnet = !enableMagnets ? true : hasMagnetBtn;
        UIBuilder.applyCardVisibility(card, effectiveHasMagnet);
        UIBuilder.applyCensoredFilter(card);
        UIBuilder.applyHistoryVisibility(card);
      });
    }
initListMode() {
      if (!this.config.list) return;
      const list = this.config.list;
      const process = (nodes) => {
        if (nodes.length > 0) Logger$1.debug("Site", `Found ${nodes.length} potential cards via ${list.cardSelector}`);
        nodes.forEach((c) => {
          if (list.containerSelector && !c.closest(list.containerSelector)) {
            Logger$1.debug("Site", "Card skipped: not in container", c);
            return;
          }
          if (c.parentElement && !c.parentElement.hasAttribute("data-enh-grid-container")) {
            c.parentElement.setAttribute("data-enh-grid-container", "true");
          }
          if (!c.classList.contains(Config.CLASSES.cardRebuilt)) {
            c.setAttribute("data-enh-rebuilding", "true");
            this.processCard(c);
          }
        });
      };
      process(Array.from(document.querySelectorAll(list.cardSelector)));
      const obs = new MutationObserver((muts) => {
        const added = [];
        for (const m of muts) {
          Array.from(m.addedNodes).forEach((n) => {
            if (n.nodeType !== 1) return;
            const el = n;
            if (el.matches(list.cardSelector)) added.push(el);
            else el.querySelectorAll(list.cardSelector).forEach((c) => added.push(c));
          });
        }
        if (added.length) process(added);
      });
      obs.observe(document.body, { childList: true, subtree: true });
      this.observers.push(obs);
    }
initDetailMode() {
      if (!this.config.detail) return;
      const detail = this.config.detail;
      const check = () => {
        const target = document.querySelector(detail.triggerSelector || detail.mainImageSelector || "");
        if (target && !target.hasAttribute("data-enh-processed")) {
          target.setAttribute("data-enh-processed", "true");
          if (detail.customDetailAction) {
            Promise.resolve(detail.customDetailAction(target, obs)).catch((err) => {
              Logger$1.error("Site", "Detail action failed", err);
              target.removeAttribute("data-enh-processed");
            });
          }
        }
      };
      const obs = new MutationObserver(check);
      check();
      obs.observe(document.body, { childList: true, subtree: true });
      this.observers.push(obs);
    }
async processCard(card) {
      if (!this.config.list) return;
      const list = this.config.list;
      try {
        let data = list.extractor(card);
        if (data instanceof Promise) data = await data;
        if (!data) {
          Logger$1.warn("Site", "Extractor failed for card", card);
          card.removeAttribute("data-enh-rebuilding");
          return;
        }
        card.setAttribute("data-enh-processed", "true");
        const extraUi = list.getExtraUi ? list.getExtraUi(card) : {};
        const { finalElement, linksContainer, newCard } = UIBuilder.createEnhancedCard({
          ...data,
          ...extraUi
        });
        if (list.postProcess) list.postProcess(card, finalElement, newCard, data);
        card.replaceChildren(finalElement);
        card.classList.add(Config.CLASSES.cardRebuilt);
        card.removeAttribute("data-enh-rebuilding");
        if (newCard.classList.contains(Config.CLASSES.isCensored)) card.classList.add(Config.CLASSES.isCensored);
        if (newCard.classList.contains(Config.CLASSES.isViewed)) card.classList.add(Config.CLASSES.isViewed);
        UIBuilder.applyCensoredFilter(card);
        UIBuilder.applyHistoryVisibility(card);
        await this.handleMagnet(data.id, data.type, linksContainer);
      } catch (error) {
        Logger$1.error("Site", "Process card failed", error);
      }
    }
async handleMagnet(id, type, container) {
      if (!State.proxy.enableMagnets) {
        UIBuilder.applyCardVisibility(container.closest(`.${Config.CLASSES.cardRebuilt}`), true);
        return;
      }
      const cached = await CacheManager.get(id);
      if (cached) {
        UIBuilder.addMagnetButton(container, cached);
        UIBuilder.applyCardVisibility(container.closest(`.${Config.CLASSES.cardRebuilt}`), true);
        return;
      }
      try {
        const url = await MagnetManager.fetchMagnet(id, type);
        if (url) UIBuilder.addMagnetButton(container, url);
        UIBuilder.applyCardVisibility(container.closest(`.${Config.CLASSES.cardRebuilt}`), !!url);
      } catch (e) {
        Logger$1.warn("Site", `Magnet fetch failed for ${id}`);
        UIBuilder.applyCardVisibility(container.closest(`.${Config.CLASSES.cardRebuilt}`), false);
      }
    }
cleanup() {
      this.observers.forEach((o) => o.disconnect());
      this.observers = [];
      if (this.config.onCleanup) this.config.onCleanup();
    }
  }
  class GenericSite extends BaseSite {
    detectContext() {
      if (this.config.detectContext) {
        return this.config.detectContext();
      }
      const path = window.location.pathname;
      const host = window.location.hostname;
      if (path.includes("/search/") || window.location.search.includes("keyword=")) {
        return PageContext.Search;
      }
      if (host.includes("missav")) {
        const segments = path.split("/").filter(Boolean);
        const lastSegment = (segments[segments.length - 1] || "").toLowerCase();
        const isDetailPattern = /^(fc2-ppv-|[a-z]{2,10}-)\d+/i.test(lastSegment) || /^[a-z0-9]{15,}$/.test(lastSegment);
        if (isDetailPattern && segments.length <= 3) {
          return PageContext.Detail;
        }
        const listBlacklist = ["search", "new", "actress", "maker", "dm", "genres", "series", "tags", "makers"];
        if (segments.some((s) => listBlacklist.some((b) => s.toLowerCase().startsWith(b)))) return PageContext.List;
        if (segments.length === 1 && !listBlacklist.includes(lastSegment)) {
          return PageContext.Detail;
        }
      }
      if (path.includes("/v/") || path.includes("/detail/") || path.includes("/movie/") || path.endsWith(".html")) {
        return PageContext.Detail;
      }
      return PageContext.List;
    }
  }
  const _SiteManager = class _SiteManager {
static register(config) {
      this.registry.set(config.name, config);
    }
static registerAll(configs) {
      Object.entries(configs).forEach(([name, config]) => {
        config.name = name;
        this.register(config);
      });
    }
static async bootstrap() {
      const hostname = location.hostname;
      let matchedConfig = null;
      for (const config of this.registry.values()) {
        const matches = config.hostnames.some(
          (hn) => typeof hn === "string" ? hostname.includes(hn) : hn.test(hostname)
        );
        if (matches) {
          matchedConfig = config;
          break;
        }
      }
      if (matchedConfig) {
        Logger$1.success("SiteManager", `Matched site: ${matchedConfig.name}`);
        this.activeSite = new GenericSite(matchedConfig);
        await this.activeSite.init();
        this.initUrlWatcher();
      } else {
        Logger$1.warn("SiteManager", `No site config matched for ${hostname}`);
      }
    }
static initUrlWatcher() {
      const check = () => {
        if (location.href !== this.currentUrl) {
          this.currentUrl;
          this.currentUrl = location.href;
          Logger$1.info("SiteManager", "URL changed detected");
          if (this.activeSite) {
            this.activeSite.init();
          }
        }
      };
      const wrap = (name) => {
        const orig = history[name];
        return function() {
          const res = orig.apply(this, arguments);
          check();
          return res;
        };
      };
      history.pushState = wrap("pushState");
      history.replaceState = wrap("replaceState");
      window.addEventListener("popstate", check);
    }
static getActiveSite() {
      return this.activeSite;
    }
  };
  _SiteManager.registry = new Map();
  _SiteManager.activeSite = null;
  _SiteManager.currentUrl = location.href;
  let SiteManager = _SiteManager;
  const fc2ppvdb = {
    name: "FC2PPVDB",
    hostnames: ["fc2ppvdb.com"],
    detectContext: () => {
      const path = location.pathname;
      if (/^\/articles\/\d+/.test(path)) return PageContext.Detail;
      return PageContext.List;
    },
    list: {
      containerSelector: "#actress-articles .flex.flex-wrap, .container .flex.flex-wrap, .max-w-screen-xl .flex.flex-wrap",
      cardSelector: 'div[class*="p-4"]:not(.card-rebuilt)',
      extractor: (card) => {
        const anchor = card.querySelector('a[href*="/articles/"]');
        const id = Utils.extractFC2Id(anchor?.href || card.querySelector("span.absolute")?.textContent || "");
        if (!id) return null;
        const img = card.querySelector("img");
        const imageUrl = img?.dataset.src || img?.src;
        const writer = card.querySelector('a[href^="/writers/"]')?.textContent?.trim();
        return {
          id,
          type: "fc2",
          title: card.querySelector("a.title-font, div.mt-1 a.text-white")?.textContent?.trim() || `FC2-PPV-${id}`,
          primaryImageUrl: State.proxy.replaceFc2Covers ? `https://wumaobi.com/fc2daily/data/FC2-PPV-${id}/cover.jpg` : imageUrl,
          imageUrl,
articleUrl: `/articles/${id}`,
          actressName: writer
};
      },
      getExtraUi: (card) => ({
        preservedIconsHTML: Array.from(card.querySelectorAll(".float .icon, .badges span")).map((n) => n.outerHTML).join("")
      })
    },
    detail: {
      mainImageSelector: "div.lg\\:w-2\\/5",
      customDetailAction: (cont) => {
        const id = Utils.extractFC2Id(location.href);
        if (!id) return;
        const actress = Utils.cleanActressName(document.querySelector('a[href^="/actresses/"]')?.textContent);
        if (actress) CacheManager.set(`actress_${id}`, actress);
        const { finalElement, linksContainer } = UIBuilder.createEnhancedCard({
          id,
          type: "fc2",
          primaryImageUrl: State.proxy.replaceFc2Covers ? `https://wumaobi.com/fc2daily/data/FC2-PPV-${id}/cover.jpg` : void 0
        });
        finalElement.classList.add("is-detail");
        cont.replaceChildren(finalElement);
        ScraperService.fetchMagnets([{ id, type: "fc2" }], async (_, url) => {
          await CacheManager.set(id, url);
          if (url) UIBuilder.addMagnetButton(linksContainer, url);
        });
        UIBuilder.addPreviewButton(linksContainer, id);
      }
    }
  };
  const fd2ppv = {
    name: "FD2PPV",
    hostnames: ["fd2ppv.cc"],
    detectContext: () => {
      const path = window.location.pathname;
      if (path.includes("/articles/")) return PageContext.Detail;
      return PageContext.List;
    },
    list: {
      containerSelector: ".artist-list, .work-list, .flex.flex-wrap, .container .grid, .other-works-grid",
      cardSelector: ".artist-card:not(.card-rebuilt)",
      extractor: (card) => {
        const link = card.querySelector(
          'a[href*="/articles/"], .other-work-title a, a.block'
        );
        const id = Utils.extractFC2Id(link?.href || "");
        const img = card.querySelector("img");
        const actress = Utils.cleanActressName(card.querySelector(".artist-avatar-container img")?.getAttribute("alt"));
        return id ? {
          id,
          type: "fc2",
          title: (card.querySelector("p")?.textContent || card.querySelector(".other-work-title, .work-title, h3, .mt-1")?.textContent || `FC2-PPV-${id}`).trim(),
          actress: actress ?? void 0,
          primaryImageUrl: img?.dataset?.src || img?.src,
          articleUrl: link?.href || `/articles/${id}`
        } : null;
      },
      postProcess: (card, _el, newCard) => {
        const stats = card.querySelector(".stats");
        if (stats) {
          const infoArea = newCard.querySelector(`.${Config.CLASSES.infoArea}`);
          if (infoArea) {
            infoArea.insertBefore(stats.cloneNode(true), infoArea.querySelector(".card-left-actions"));
          }
        }
      },
      getExtraUi: (card) => {
        const preservedIconsHTML = Array.from(card.querySelectorAll(".float i, .badges span")).map((n) => n.outerHTML).join("");
        if (preservedIconsHTML && preservedIconsHTML.includes("icon-mosaic_free color_free0")) card.classList.add(Config.CLASSES.isCensored);
        return { preservedIconsHTML };
      }
    },
    detail: {
      mainImageSelector: ".work-image-large",
      customDetailAction: (cont) => {
        const id = Utils.extractFC2Id(location.href) || Utils.extractFC2Id(document.querySelector(".work-title")?.textContent || "") || Utils.extractFC2Id(document.querySelector('.work-meta-value a[href*="article"]')?.getAttribute("href") || "");
        if (!id) return;
        const actressRaw = document.querySelector(".artist-info-card .artist-name a")?.textContent || document.querySelector(".artist-name a")?.textContent || Array.from(document.querySelectorAll(".work-meta-label")).find((el) => el.textContent?.trim() === "賣家")?.nextElementSibling?.querySelector("a")?.textContent;
        const actress = Utils.cleanActressName(actressRaw);
        if (actress) CacheManager.set(`actress_${id}`, actress);
        const img = cont.querySelector("img");
        const primaryImageUrl = img?.src || img?.dataset.src || `https://wumaobi.com/fc2daily/data/FC2-PPV-${id}/cover.jpg`;
        const { finalElement, linksContainer } = UIBuilder.createEnhancedCard({
          id,
          type: "fc2",
          actress: actress ?? void 0,
          primaryImageUrl
        });
        finalElement.classList.add("is-detail");
        cont.style.padding = "0";
        cont.style.background = "transparent";
        cont.style.height = "auto";
        cont.replaceChildren(finalElement);
        ScraperService.fetchMagnets([{ id, type: "fc2" }], async (_, url) => {
          await CacheManager.set(id, url);
          if (url) UIBuilder.addMagnetButton(linksContainer, url);
        });
        UIBuilder.addPreviewButton(linksContainer, id);
      }
    }
  };
  const supjav = {
    name: "Supjav",
    hostnames: ["supjav.com"],
    list: {
      containerSelector: ".posts.clearfix:not(:has(.swiper-wrapper)), .posts:not(:has(.swiper-wrapper))",
      cardSelector: ".post:not(.card-rebuilt)",
      extractor: (card) => {
        const tLink = card.querySelector('h3 a, a[rel="bookmark"]');
        const img = card.querySelector("img.thumb, img");
        const text = tLink?.title || tLink?.textContent || img?.alt || "";
        const info = Utils.parseVideoId(text, tLink?.href || "");
        if (!info) return null;
        return {
          ...info,
          title: text.trim(),
          imageUrl: Utils.cleanImageUrl(img?.dataset?.original || img?.getAttribute("data-original") || img?.src),
          articleUrl: tLink?.href,
          previewSlug: info.previewSlug || null
        };
      },
      postProcess: (card, _el, newCard, data) => {
        const C = Config.CLASSES;
        if (data.title.includes("[有]") || card.innerText.includes("有码")) {
          card.classList.add(C.isCensored);
          newCard.classList.add(C.isCensored);
        }
        const meta = card.querySelector(".meta");
        if (meta) {
          const infoArea = newCard.querySelector(`.${C.infoArea}`);
          if (infoArea)
            infoArea.insertBefore(
              meta.cloneNode(true),
              infoArea.querySelector(".card-left-actions")
            );
        }
      }
    },
    detail: {
      triggerSelector: ".archive-title h1, h1.entry-title, .post-title h1",
      customDetailAction: async (titleEl) => {
        const video = document.querySelector("#dz_video, .video-container, .entry-content .video-player");
        const info = Utils.parseVideoId(titleEl.textContent || "", location.href);
        if (!info) return;
        let actress = null;
        if (info.type === "jav") {
          const actresses = Array.from(document.querySelectorAll('div.post-meta a[href*="/star/"], .post-meta a[href*="/star/"]')).map(
            (a) => Utils.cleanActressName(a.textContent)
          );
          actress = actresses.find((a) => !!a) || null;
        }
        const toolbar = UIBuilder.createDetailToolbar(
          info.id,
          info.type,
          titleEl.textContent?.trim() || "",
          actress ?? void 0,
          info.previewSlug ?? void 0
        );
        if (video) {
          video.after(toolbar);
        } else {
          titleEl.after(toolbar);
        }
        if (info.type === "fc2") {
          actress = await ScraperService.fetchActressFromFD2(info.id);
          if (actress) {
            const infoArea = toolbar.querySelector(`.${Config.CLASSES.infoArea}`);
            if (infoArea) UIBuilder.addActressButton(infoArea, actress);
          }
        }
      }
    }
  };
  const missav = {
    name: "MissAV",
    hostnames: ["missav.ws", "missav.ai"],
    list: {
      containerSelector: "main, .grid, .sm\\:container, div.posts, #main",
      cardSelector: 'div.grid[class*="grid-cols-"] > div:not(.card-rebuilt), div.thumbnail:not(.card-rebuilt)',
      extractor: (card) => {
        const tLink = card.querySelector([
          "a.text-secondary",
          "a.hover\\:text-primary",
          "div.my-2 a",
          "div.mt-1 a",
          ".video-title a",
          ".thumbnail + div a"
        ].join(","));
        const img = card.querySelector("img");
        const video = card.querySelector("video");
        const anyLink = tLink || card.querySelector('a[href*="/fc2-ppv-"], a[href*="/en/"], a[href*="/ja/"], a[href*="/cn/"]');
        if (!anyLink || !anyLink.getAttribute("href") || anyLink.getAttribute("href") === "#")
          return null;
        const info = Utils.parseVideoId(anyLink.textContent || "", anyLink.href || "");
        if (!info) return null;
        if (info.id.length < 5 && info.type === "fc2") return null;
        const previewSlug = video?.dataset.src?.match(/fourhoi\.com\/([^/]+)\/preview\.mp4/)?.[1] || video?.src?.match(/fourhoi\.com\/([^/]+)\/preview\.mp4/)?.[1] || info.previewSlug || null;
        return {
          ...info,
          title: anyLink.textContent?.trim() || "",
          imageUrl: img?.dataset.src || img?.getAttribute("data-src") || img?.src,
          articleUrl: anyLink.href,
          previewSlug
        };
      },
      postProcess: (card) => {
        card.removeAttribute("x-data");
        card.addEventListener("mouseenter", (e) => e.stopPropagation(), true);
      }
    },
    detail: {
      triggerSelector: 'div[x-data*="player"], div.player-container, h1.text-base, div.mt-4',
      customDetailAction: async (el, obs) => {
        const title = document.querySelector("h1.text-base")?.textContent || document.title;
        const info = Utils.parseVideoId(title, location.href);
        if (!info) return;
        let actress = null;
        if (info.type === "jav") {
          const contentArea = document.querySelector("div.mt-4, div.text-secondary, main");
          const actresses = Array.from(
            (contentArea || document).querySelectorAll('a[href*="/actresses/"]')
          ).map((a) => Utils.cleanActressName(a.textContent));
          actress = actresses.find((a) => !!a) || null;
        }
        const toolbar = UIBuilder.createDetailToolbar(
          info.id,
          info.type,
          title,
          actress ?? void 0,
          info.previewSlug ?? void 0
        );
        const target = document.querySelector("h1.text-base") || el;
        target.insertAdjacentElement("afterend", toolbar);
        if (info.type === "fc2") {
          actress = await ScraperService.fetchActressFromFD2(info.id);
          if (actress) {
            const infoArea = toolbar.querySelector(`.${Config.CLASSES.infoArea}`);
            if (infoArea) UIBuilder.addActressButton(infoArea, actress);
          }
        }
        obs?.disconnect();
      }
    }
  };
  const javdb = {
    name: "JavDB",
    hostnames: ["javdb.com", "javdb565.com"],
    list: {
      containerSelector: ".movie-list, .tile-images:not(.preview-images)",
      cardSelector: ".item:not(.card-rebuilt), .tile-item:not(.card-rebuilt)",
      extractor: (card) => {
        const link = card.matches('a.box, a.tile-item, a[href^="/v/"]') ? card : card.querySelector('a.box, a.tile-item, a[href^="/v/"]');
        if (!link) return null;
        const idStrong = card.querySelector(".video-title strong, .video-number");
        const text = idStrong ? idStrong.textContent : link.title || link.innerText;
        const img = card.querySelector("img");
        const info = Utils.parseVideoId(text || "", link.href);
        return info ? {
          ...info,
          title: link.title || (card.querySelector(".video-title")?.textContent || text || "").trim(),
          imageUrl: img?.dataset?.src || img?.src,
          articleUrl: link.href,
          previewSlug: info.previewSlug || null
        } : null;
      },
      postProcess: (card, _el, newCard, _data) => {
        const score = card.querySelector(".score");
        const meta = card.querySelector(".meta");
        const infoArea = newCard.querySelector(`.${Config.CLASSES.infoArea}`);
        if (infoArea) {
          if (score)
            infoArea.insertBefore(
              score.cloneNode(true),
              infoArea.querySelector(".card-left-actions")
            );
          if (meta)
            infoArea.insertBefore(
              meta.cloneNode(true),
              infoArea.querySelector(".card-left-actions")
            );
        }
      }
    },
    detail: {
      mainImageSelector: ".column-video-cover",
      customDetailAction: async (cont) => {
        const titleEl = document.querySelector("h2.title");
        const info = Utils.parseVideoId(titleEl?.textContent || "", location.href);
        if (info) {
          const img = cont.querySelector("img.video-cover");
          const actresses = Array.from(
            document.querySelectorAll('a[href*="/star/"], .value a[href*="/actresses/"]')
          ).map((a) => Utils.cleanActressName(a.textContent));
          let actress = actresses.find((a) => !!a);
          const { finalElement, linksContainer } = UIBuilder.createEnhancedCard({
            id: info.id,
            type: info.type,
            title: "",
            primaryImageUrl: img?.src || "",
            articleUrl: location.href,
            previewSlug: info.previewSlug ?? void 0
          });
          finalElement.classList.add("is-detail");
          Array.from(cont.children).forEach((child) => {
            if (child instanceof HTMLElement) child.style.display = "none";
          });
          cont.appendChild(finalElement);
          cont.style.maxWidth = "100%";
          const magnetLinks = Array.from(
            document.querySelectorAll('#magnets-content a[href^="magnet:?"]')
          );
          if (magnetLinks.length > 0) {
            CacheManager.set(info.id, magnetLinks[0].href);
            magnetLinks.slice(0, 3).forEach((m) => UIBuilder.addMagnetButton(linksContainer, m.href));
          } else {
            ScraperService.fetchMagnets([{ id: info.id, type: info.type }], async (_, url) => {
              await CacheManager.set(info.id, url);
              if (url && linksContainer) UIBuilder.addMagnetButton(linksContainer, url);
            });
          }
          if (info.type === "fc2") {
            UIBuilder.addPreviewButton(linksContainer, info.id);
            if (!actress) {
              actress = await ScraperService.fetchActressFromFD2(info.id);
              if (actress) {
                const infoArea = finalElement.querySelector(`.${Config.CLASSES.infoArea}`);
                if (infoArea) UIBuilder.addActressButton(infoArea, actress);
              }
            }
          }
          const bindNativeButton = (selector) => {
            const btn = document.querySelector(selector);
            if (btn && !btn.hasAttribute("data-hooked")) {
              btn.setAttribute("data-hooked", "true");
              btn.addEventListener("click", () => {
                setTimeout(() => HistoryManager.add(info.id), 500);
              });
            }
          };
          bindNativeButton('form.button_to[action*="/reviews/watched"] button');
          bindNativeButton("button.js-watched-video");
        }
      }
    }
  };
  const SiteRegistry = {
    fc2ppvdb,
    fd2ppv,
    supjav,
    missav,
    javdb
  };
  const SiteConfigs = SiteRegistry;
  const FormRow = (props) => {
    const { label, children, className = "" } = props;
    const childArray = Array.isArray(children) ? children : [children];
    return h(
      "div",
      { className: `fc2-enh-form-row ${className}` },
      label ? h("label", {}, label) : null,
      ...childArray
    );
  };
  const CheckboxRow = (props) => {
    const { id, label, checked, onChange } = props;
    return h(
      "div",
      { className: "fc2-enh-form-row checkbox" },
      h(
        "label",
        {},
        h("input", {
          type: "checkbox",
          id: `set-${id}`,
          checked,
          onchange: (e) => {
            onChange(e.target.checked);
          }
        }),
        ` ${label}`
      )
    );
  };
  const Button = (props) => {
    const { text, onClick, variant = "default", icon, disabled = false, className = "" } = props;
    const variantClass = variant === "primary" ? "primary" : variant === "danger" ? "danger" : "";
    return h(
      "button",
      {
        className: `fc2-enh-btn ${variantClass} ${className}`.trim(),
        onclick: onClick,
        disabled
      },
      icon || null,
      text
    );
  };
  const Select = (props) => {
    const { id, options, value, onChange } = props;
    return h(
      "select",
      {
        id: `set-${id}`,
        className: "fc2-select",
        onchange: (e) => {
          const newValue = e.target.value;
          if (onChange) {
            onChange(newValue);
          }
        }
      },
      ...options.map(
        (opt) => h("option", {
          value: opt.value,
          selected: opt.value === value
        }, opt.label)
      )
    );
  };
  const renderSettingsTab = () => {
    const mkIcon = (svg) => {
      const s = UIUtils.icon(svg);
      return s;
    };
    return h(
      "div",
      { className: "fc2-enh-tab-content active" },
      h(
        "div",
        { className: "fc2-enh-settings-group" },
        h("h3", {}, mkIcon(IconFilter), t("groupFilters")),
        CheckboxRow({
          id: "hideNoMagnet",
          label: t("optionHideNoMagnet"),
          checked: State.proxy.hideNoMagnet,
          onChange: (checked) => {
            State.proxy.hideNoMagnet = checked;
          }
        }),
        CheckboxRow({
          id: "hideCensored",
          label: t("optionHideCensored"),
          checked: State.proxy.hideCensored,
          onChange: (checked) => {
            State.proxy.hideCensored = checked;
          }
        }),
        CheckboxRow({
          id: "hideViewed",
          label: t("optionHideViewed"),
          checked: State.proxy.hideViewed,
          onChange: (checked) => {
            State.proxy.hideViewed = checked;
          }
        }),
        CheckboxRow({
          id: "hideBlocked",
          label: t("optionHideBlocked"),
          checked: State.proxy.hideBlocked,
          onChange: (checked) => {
            State.proxy.hideBlocked = checked;
          }
        })
      ),
      h(
        "div",
        { className: "fc2-enh-settings-group" },
        h("h3", {}, mkIcon(IconPalette), t("groupAppearance")),
        FormRow({
          label: t("labelPreviewMode"),
          children: Select({
            id: "previewMode",
            options: [
              { value: "static", label: t("previewModeStatic") },
              { value: "hover", label: t("previewModeHover") }
            ],
            value: State.proxy.previewMode,
            onChange: (value) => {
              State.proxy.previewMode = value;
            }
          })
        }),
        FormRow({
          label: t("labelGridColumns"),
          children: Select({
            id: "gridColumns",
            options: [0, 1, 2, 3, 4, 5, 6].map((i) => ({
              value: String(i),
              label: i === 0 ? t("labelDefault") : String(i)
            })),
            value: String(typeof GM_getValue !== "undefined" ? GM_getValue(STORAGE_KEYS.USER_GRID_COLUMNS, 0) : 0)
          })
        }),
        FormRow({
          label: t("labelLanguage"),
          children: Select({
            id: "language",
            options: [
              { value: "auto", label: t("langAuto") },
              { value: "zh", label: t("langZh") },
              { value: "en", label: t("langEn") }
            ],
            value: State.proxy.language,
            onChange: (value) => {
              State.proxy.language = value;
            }
          })
        })
      ),
      h(
        "div",
        { className: "fc2-enh-settings-group" },
        h("h3", {}, mkIcon(IconClockRotateLeft), t("groupDataHistory")),
        CheckboxRow({
          id: "enableMagnets",
          label: t("optionEnableMagnets"),
          checked: State.proxy.enableMagnets,
          onChange: (checked) => {
            State.proxy.enableMagnets = checked;
          }
        }),
        CheckboxRow({
          id: "enableExternalLinks",
          label: t("optionEnableExternalLinks"),
          checked: State.proxy.enableExternalLinks,
          onChange: (checked) => {
            State.proxy.enableExternalLinks = checked;
          }
        }),
        CheckboxRow({
          id: "enableActressName",
          label: t("optionEnableActressName"),
          checked: State.proxy.enableActressName,
          onChange: (checked) => {
            State.proxy.enableActressName = checked;
          }
        }),
        CheckboxRow({
          id: "replaceFc2Covers",
          label: t("optionReplaceFc2Covers"),
          checked: State.proxy.replaceFc2Covers,
          onChange: (checked) => {
            State.proxy.replaceFc2Covers = checked;
          }
        }),
        CheckboxRow({
          id: "enableHistory",
          label: t("optionEnableHistory"),
          checked: State.proxy.enableHistory,
          onChange: (checked) => {
            State.proxy.enableHistory = checked;
          }
        }),
        CheckboxRow({
          id: "loadExtraPreviews",
          label: t("optionLoadExtraPreviews"),
          checked: State.proxy.loadExtraPreviews,
          onChange: (checked) => {
            State.proxy.loadExtraPreviews = checked;
          }
        }),
        CheckboxRow({
          id: "enableQuickBar",
          label: t("optionEnableQuickBar"),
          checked: State.proxy.enableQuickBar,
          onChange: (checked) => {
            State.proxy.enableQuickBar = checked;
          }
        })
      )
    );
  };
  const Validator = {
isValidFC2Id(id) {
      return VALIDATION.FC2_ID_REGEX.test(id);
    },
isValidJAVId(id) {
      return VALIDATION.JAV_ID_REGEX.test(id);
    },
isValidVideoId(id) {
      if (this.isValidFC2Id(id)) {
        return { valid: true, type: "fc2" };
      }
      if (this.isValidJAVId(id)) {
        return { valid: true, type: "jav" };
      }
      return { valid: false };
    },
isValidUrl(url) {
      try {
        const parsed = new URL(url);
        return ["http:", "https:"].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
isValidEmail(email) {
      return VALIDATION.EMAIL_REGEX.test(email);
    },
validateWebDAVConfig(config) {
      const errors = [];
      const warnings = [];
      if (!config.url) {
        errors.push("WebDAV URL 不能为空");
      } else if (!this.isValidUrl(config.url)) {
        errors.push("WebDAV URL 格式无效");
      } else if (!config.url.startsWith("https://")) {
        warnings.push("建议使用 HTTPS 连接以保证安全");
      }
      if (!config.user) {
        errors.push("用户名不能为空");
      } else if (config.user.length < VALIDATION.USERNAME_MIN_LENGTH) {
        warnings.push("用户名过短");
      }
      if (!config.pass) {
        errors.push("密码不能为空");
      } else if (config.pass.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        warnings.push("密码过短,建议使用应用令牌");
      }
      if (!config.path) {
        errors.push("同步文件名不能为空");
      } else if (!config.path.endsWith(".json")) {
        errors.push("同步文件必须是 .json 格式");
      }
      return { valid: errors.length === 0, errors, warnings };
    },
validateSupabaseConfig(config) {
      const errors = [];
      if (!config.url) {
        errors.push("Supabase URL 不能为空");
      } else if (!config.url.includes(".supabase.co")) {
        errors.push("Supabase URL 格式无效");
      }
      if (!config.key) {
        errors.push("Supabase Key 不能为空");
      }
      if (config.email && !this.isValidEmail(config.email)) {
        errors.push("邮箱格式无效");
      }
      return { valid: errors.length === 0, errors };
    },
validateSyncData(data) {
      const errors = [];
      if (data.version === void 0) {
        errors.push("缺少 version 字段");
      } else if (typeof data.version !== "number") {
        errors.push("version 必须是数字");
      }
      if (!data.history) {
        errors.push("缺少 history 字段");
      } else if (!Array.isArray(data.history)) {
        errors.push("history 必须是数组");
      } else {
        data.history.forEach((item, index) => {
          if (!item.id) {
            errors.push(`history[${index}]: 缺少 id 字段`);
          }
          if (typeof item.timestamp !== "number") {
            errors.push(`history[${index}]: timestamp 必须是数字`);
          }
        });
      }
      return { valid: errors.length === 0, errors };
    },
sanitizeInput(input) {
      return input.trim().replace(/[<>"']/g, "").substring(0, VALIDATION.INPUT_MAX_LENGTH);
    },
sanitizeHTML(html) {
      const div = document.createElement("div");
      div.textContent = html;
      return div.innerHTML;
    },
isInRange(value, min, max) {
      return value >= min && value <= max;
    },
isValidLength(str, min, max) {
      return str.length >= min && str.length <= max;
    }
  };
  const BackupManager = {
async exportData() {
      const history2 = await Repository.history.getAll();
      const { syncStatus, ...persistentSettings } = State.proxy;
      const data = {
        appName: SCRIPT_INFO.NAME,
        version: 2,
        timestamp: Date.now(),
        settings: persistentSettings,
        history: history2
      };
      try {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const dateStr = ( new Date()).toISOString().slice(0, 10);
        a.href = url;
        a.download = `fc2_enhanced_backup_${dateStr}.json`;
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(url);
          a.remove();
        }, 100);
        Logger$1.success("Backup", "Data exported successfully");
        return true;
      } catch (err) {
        Logger$1.error("Backup", "Export failed", err);
        return false;
      }
    },
async importData(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const content = e.target?.result;
            const data = JSON.parse(content);
            if (!data.settings || !data.history) {
              Logger$1.error("Backup", "Invalid backup file format");
              resolve(false);
              return;
            }
            Logger$1.info("Backup", "Importing settings...");
            for (const [key, value] of Object.entries(data.settings)) {
              State.proxy[key] = value;
            }
            Logger$1.info("Backup", "Importing history...");
            if (Array.isArray(data.history)) {
              await Repository.db.transaction("rw", Repository.db.history, async () => {
                for (const item of data.history) {
                  await Repository.db.history.put(item);
                }
              });
            }
            Logger$1.success("Backup", `Imported ${data.history.length} history items`);
            resolve(true);
          } catch (err) {
            Logger$1.error("Backup", "Import failed during parsing/saving", err);
            resolve(false);
          }
        };
        reader.onerror = () => resolve(false);
        reader.readAsText(file);
      });
    }
  };
  const JavDBMigration = (() => {
    let isImporting = false;
    async function fetchPage(url) {
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          onload: (res) => resolve(res.responseText),
          onerror: () => resolve(null)
        });
      });
    }
    async function processList(baseUrl, typeName) {
      let page = 1;
      let totalAdded = 0;
      while (true) {
        const url = `${baseUrl}?page=${page}`;
        Logger$1.info("JavDBMigration", `Fetching ${typeName} page ${page}: ${url}`);
        const html = await fetchPage(url);
        if (!html) break;
        const doc = new DOMParser().parseFromString(html, "text/html");
        const items = doc.querySelectorAll(".movie-list .item");
        if (items.length === 0) break;
        let pageCount = 0;
        for (const item of Array.from(items)) {
          const titleEl = item.querySelector(".video-title strong");
          const link = item.querySelector("a.box");
          if (titleEl && link) {
            const info = Utils.parseVideoId(titleEl.textContent || "", link.href);
            if (info) {
              await HistoryManager.add(info.id);
              pageCount++;
              totalAdded++;
            }
          }
        }
        Logger$1.info("JavDBMigration", `Processed page ${page}, found ${pageCount} items`);
        const nextButton = doc.querySelector('.pagination-next, a[rel="next"]');
        if (!nextButton || pageCount === 0) break;
        page++;
        await new Promise((r) => setTimeout(r, 1e3));
      }
      return totalAdded;
    }
    return {
      async runImport() {
        if (isImporting) return;
        isImporting = true;
        Toast$1.show("Starting JavDB Import...", "info");
        try {
          const watchedCount = await processList("https://javdb.com/users/watched_videos", "Watched");
          Toast$1.show(`Import Complete! Added ${watchedCount} items.`, "success");
          Logger$1.success("JavDBMigration", `Imported ${watchedCount} watched items.`);
        } catch (e) {
          Logger$1.error("JavDBMigration", "Import failed", e);
          Toast$1.show("Import Failed. Check console for details.", "error");
        } finally {
          isImporting = false;
        }
      },
      isBusy() {
        return isImporting;
      }
    };
  })();
  const renderDataTab = (render, saveWebDAV) => {
    const jwt = typeof GM_getValue !== "undefined" ? GM_getValue(STORAGE_KEYS.SUPABASE_JWT) : null;
    const isLoggedIn = !!jwt;
    const lastSync = typeof GM_getValue !== "undefined" ? GM_getValue(STORAGE_KEYS.LAST_SYNC_TS, t("labelNever")) : t("labelNever");
    const currentLang = State.proxy.language === "auto" ? navigator.language.startsWith("zh") ? "zh" : "en" : State.proxy.language;
    const displayTime = lastSync !== t("labelNever") ? new Date(lastSync).toLocaleString(currentLang === "zh" ? "zh-CN" : "en-US", {
      timeZone: UI_CONSTANTS.TIME_ZONE,
      hour12: false
    }) : t("labelNever");
    const mkIcon = (svg) => {
      const s = UIUtils.icon(svg);
      Object.assign(s.style, { marginRight: UI_TOKENS.SPACING.XS });
      return s;
    };
    return h(
      "div",
      { className: "fc2-enh-tab-content active" },
      h(
        "div",
        { className: "fc2-enh-settings-group" },
        h("h3", {}, t("groupDataManagement")),
        h(
          "div",
          { className: "fc2-enh-form-row", style: { display: "flex", gap: UI_TOKENS.SPACING.SM, flexWrap: "wrap" } },
          Button({
            text: t("btnClearCache"),
            onClick: async () => {
              await Repository.cache.clear();
              Toast$1.show(t("alertCacheCleared"), "success");
            }
          }),
          Button({
            text: t("btnClearHistory"),
            onClick: async () => {
              await HistoryManager.clear();
              Toast$1.show(t("alertHistoryCleared"), "success");
            }
          }),
          Button({
            text: t("btnExportData"),
            icon: mkIcon(IconFileExport),
            onClick: () => BackupManager.exportData()
          }),
          Button({
            text: t("btnImportData"),
            icon: mkIcon(IconFileImport),
            onClick: () => {
              const input = h("input", { type: "file", accept: ".json" });
              input.onchange = async () => {
                if (input.files?.[0]) {
                  const success = await BackupManager.importData(input.files[0]);
                  if (success) {
                    Toast$1.show(t("alertImportSuccess"), "success");
                    setTimeout(() => location.reload(), 1500);
                  } else {
                    Toast$1.show(t("alertImportError"), "error");
                  }
                }
              };
              input.click();
            }
          })
        ),
        h(
          "div",
          { className: "fc2-enh-form-row" },
          h("label", {}, t("labelDebugMode")),
          h(
            "button",
            {
              className: `fc2-enh-btn ${Logger$1.enabled ? "primary" : ""}`,
              style: { width: "fit-content", minWidth: "100px" },
              onclick: () => {
                if (Logger$1.enabled) {
                  Logger$1.disable();
                  Toast$1.show(t("alertDebugOff"), "info");
                } else {
                  Logger$1.enable();
                  Toast$1.show(t("alertDebugOn"), "success");
                }
                render("data");
              }
            },
            Logger$1.enabled ? t("statusDebugOn") : t("statusDebugOff")
          )
        ),
        h(
          "div",
          { className: "fc2-enh-form-row" },
          h("label", {}, t("labelSyncMode")),
          h(
            "select",
            {
              id: "set-syncMode",
              onchange: (e) => {
                State.proxy.syncMode = e.target.value;
                render("data");
              }
            },
            h("option", { value: "none", selected: State.proxy.syncMode === "none" }, t("syncModeNone")),
            h("option", { value: "supabase", selected: State.proxy.syncMode === "supabase" }, t("syncModeSupabase")),
            h("option", { value: "webdav", selected: State.proxy.syncMode === "webdav" }, t("syncModeWebDAV"))
          )
        ),
        State.proxy.syncMode !== "none" ? h(
          "div",
          { className: "fc2-enh-form-row" },
          h("label", {}, t("labelSyncInterval")),
          h(
            "select",
            {
              id: "set-syncInterval",
              onchange: (e) => {
                State.proxy.syncInterval = parseInt(e.target.value, 10);
              }
            },
            h("option", { value: "0", selected: State.proxy.syncInterval === 0 }, t("syncInterval0")),
            h("option", { value: "2", selected: State.proxy.syncInterval === 2 }, t("syncInterval2")),
            h("option", { value: "5", selected: State.proxy.syncInterval === 5 }, t("syncInterval5")),
            h("option", { value: "10", selected: State.proxy.syncInterval === 10 }, t("syncInterval10")),
            h("option", { value: "30", selected: State.proxy.syncInterval === 30 }, t("syncInterval30")),
            h("option", { value: "-1", selected: State.proxy.syncInterval === -1 }, t("syncIntervalManual"))
          )
        ) : null
      ),
      h(
        "div",
        { className: "fc2-enh-settings-group" },
        h("h3", {}, t("groupExternalImport")),
        h(
          "div",
          { className: "fc2-enh-form-row" },
          h(
            "button",
            {
              className: `fc2-enh-btn ${JavDBMigration.isBusy() ? "loading" : ""}`,
              disabled: JavDBMigration.isBusy(),
              onclick: async () => {
                await JavDBMigration.runImport();
                render("data");
              }
            },
            mkIcon(IconMagnifyingGlass),
            t("btnImportFromJavDB")
          )
        )
      ),
      State.proxy.syncMode === "webdav" ? h(
        "div",
        { className: "fc2-enh-settings-group" },
        h("h3", {}, t("groupWebDAV")),
        h(
          "div",
          { className: "fc2-enh-form-row" },
          h("label", {}, t("labelWebDAVUrl")),
          h("input", {
            id: "set-webdavUrl",
            type: "text",
            value: State.proxy.webdavUrl,
            placeholder: "https://dav.jianguoyun.com/dav/",
            oninput: (e) => {
              const input = e.target;
              const value = input.value.trim();
              if (value && !value.match(/^https?:\/\/.+/)) {
                input.style.borderColor = UI_TOKENS.COLORS.ERROR;
                input.title = t("errorWebDAVUrl");
              } else {
                input.style.borderColor = "";
                input.title = "";
              }
            }
          })
        ),
        h(
          "div",
          { className: "fc2-enh-form-row" },
          h("label", {}, t("labelWebDAVUser")),
          h("input", { id: "set-webdavUser", type: "text", value: State.proxy.webdavUser })
        ),
        h(
          "div",
          { className: "fc2-enh-form-row" },
          h("label", {}, t("labelWebDAVPass")),
          h("input", { id: "set-webdavPass", type: "password", value: State.proxy.webdavPass })
        ),
        h(
          "div",
          { className: "fc2-enh-form-row" },
          h("label", {}, t("labelWebDAVPath")),
          h("input", {
            id: "set-webdavPath",
            type: "text",
            value: State.proxy.webdavPath || UI_CONSTANTS.DEFAULT_SYNC_FILENAME
          })
        ),
        h(
          "div",
          { className: "fc2-enh-form-row", style: { display: "flex", gap: UI_TOKENS.SPACING.SM } },
          h(
            "button",
            {
              className: "fc2-enh-btn",
              onclick: async () => {
                saveWebDAV();
                const config = {
                  url: State.proxy.webdavUrl,
                  user: State.proxy.webdavUser,
                  pass: State.proxy.webdavPass,
                  path: State.proxy.webdavPath
                };
                const validation = Validator.validateWebDAVConfig(config);
                if (!validation.valid) {
                  Toast$1.show(`${t("labelConfigError")}: ${validation.errors.join(", ")}`, "error");
                  return;
                }
                try {
                  await SyncManager.testWebDAV();
                  Toast$1.show(t("alertWebDAVSuccess"), "success");
                } catch (e) {
                  Toast$1.show(t("alertWebDAVError"), "error");
                }
              }
            },
            t("btnWebDAVTest")
          ),
          h(
            "button",
            {
              className: "fc2-enh-btn primary",
              onclick: () => {
                saveWebDAV();
                SyncManager.performSync(true);
              }
            },
            t("btnWebDAVSync")
          )
        )
      ) : null,
      State.proxy.syncMode === "supabase" ? h(
        "div",
        { className: "fc2-enh-settings-group" },
        h("h3", {}, t("labelSupabaseSync")),
        isLoggedIn ? h(
          "div",
          {},
          h("p", {}, `${t("labelUser")}: `, h("strong", {}, typeof GM_getValue !== "undefined" ? GM_getValue(STORAGE_KEYS.CURRENT_USER_EMAIL, "N/A") : "N/A")),
          h("p", { style: { fontSize: "0.8em", color: UI_TOKENS.COLORS.TEXT_DIM } }, `${t("labelLastSync")}: ${displayTime}`),
          h(
            "div",
            { className: "fc2-enh-form-row", style: { display: "flex", gap: UI_TOKENS.SPACING.SM, flexWrap: "wrap" } },
            h("button", { className: "fc2-enh-btn", onclick: () => SyncManager.performSync(true) }, t("btnPushPull")),
            h("button", { className: "fc2-enh-btn", onclick: () => SyncManager.logout() }, t("btnLogout"))
          )
        ) : h(
          "div",
          {},
          h("p", {}, t("labelNotLoggedIn"))
        )
      ) : null
    );
  };
  const renderAboutTab = () => {
    const mkSection = (title, contentHtml) => {
      return h(
        "div",
        { className: "fc2-settings-group" },
        h("div", { className: "fc2-settings-group-header" }, title),
        h(
          "div",
          { className: "fc2-settings-item" },
          h("div", {
            style: {
              lineHeight: "1.6",
              fontSize: "0.9em",
              color: UI_TOKENS.COLORS.TEXT_DIM,
              whiteSpace: "pre-line"
},
            innerHTML: contentHtml
          })
        )
      );
    };
    const mkDmcaSection = () => {
      return h(
        "div",
        { className: "fc2-settings-group" },
        h("div", { className: "fc2-settings-group-header", style: { color: UI_TOKENS.COLORS.ERROR } }, t("tabDmca")),
        h(
          "div",
          {
            className: "fc2-settings-item",
            style: { flexDirection: "column", alignItems: "flex-start", gap: UI_TOKENS.SPACING.SM }
          },
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: UI_TOKENS.SPACING.SM,
                color: UI_TOKENS.COLORS.WARN,
                fontWeight: "bold",
                fontSize: "1em"
              }
            },
            UIUtils.icon(IconTriangleExclamation),
            t("labelDisclaimer")
          ),
          h("div", {
            style: { lineHeight: "1.6", fontSize: "0.9em", color: UI_TOKENS.COLORS.TEXT_DIM },
            innerHTML: t("dmcaContent")
          })
        )
      );
    };
    return h(
      "div",
      { className: "fc2-settings-tab-content" },
h(
        "div",
        { style: { textAlign: "center", marginBottom: UI_TOKENS.SPACING.XL, padding: UI_TOKENS.SPACING.SM } },
        h("h3", { style: { margin: `0 0 ${UI_TOKENS.SPACING.SM} 0` } }, SCRIPT_INFO.NAME),
        h("div", { style: { fontSize: "0.85em", opacity: 0.7, marginBottom: UI_TOKENS.SPACING.SM } }, `${t("aboutVersion")} ${SCRIPT_INFO.VERSION}`),
        h("p", { style: { fontSize: "0.95em", color: UI_TOKENS.COLORS.WHITE } }, t("aboutDescription"))
      ),
mkSection(t("aboutHelpTitle"), t("aboutHelpContent")),
mkDmcaSection(),
h(
        "div",
        { style: { marginTop: UI_TOKENS.SPACING.XL, textAlign: "center", fontSize: "0.85em" } },
        h("a", { href: SCRIPT_INFO.GREASYFORK_URL, target: "_blank", style: { color: UI_TOKENS.COLORS.INFO, textDecoration: "none" } }, t("labelGreasyFork"))
      )
    );
  };
  const DebugTab = (() => {
    let container = null;
    let activeFilters = { error: true, warn: true, info: true, success: true };
    const createLogItem = (entry) => {
      const item = document.createElement("div");
      item.style.cssText = `
            font-family: monospace;
            font-size: 12px;
            padding: ${UI_TOKENS.SPACING.XS} ${UI_TOKENS.SPACING.SM};
            border-bottom: 1px solid ${UI_TOKENS.COLORS.BORDER_LIGHT};
            display: flex;
            gap: ${UI_TOKENS.SPACING.SM};
            word-break: break-all;
            background: ${entry.level === "error" ? UI_TOKENS.COLORS.ERROR_LIGHT : entry.level === "warn" ? UI_TOKENS.COLORS.WARN_LIGHT : entry.level === "success" ? UI_TOKENS.COLORS.SUCCESS_LIGHT : "transparent"};
        `;
      const time = document.createElement("span");
      time.style.color = UI_TOKENS.COLORS.TEXT_DIM;
      time.textContent = `[${entry.timestamp}]`;
      const level = document.createElement("span");
      level.style.fontWeight = "bold";
      level.style.color = entry.level === "error" ? UI_TOKENS.COLORS.ERROR : entry.level === "warn" ? UI_TOKENS.COLORS.WARN : entry.level === "success" ? UI_TOKENS.COLORS.SUCCESS : UI_TOKENS.COLORS.INFO;
      level.textContent = entry.level.toUpperCase();
      const module = document.createElement("span");
      module.style.color = UI_TOKENS.COLORS.TEXT_MUTED;
      module.style.fontWeight = "bold";
      module.textContent = `[${entry.module}]`;
      const msg = document.createElement("span");
      msg.style.color = "var(--fc2-enh-text)";
      msg.textContent = entry.message;
      item.appendChild(time);
      item.appendChild(level);
      item.appendChild(module);
      item.appendChild(msg);
      if (entry.data) {
        const dataToggle = document.createElement("button");
        dataToggle.style.cssText = "font-size: 10px; padding: 0 4px; border: 1px solid var(--fc2-enh-border); border-radius: 2px; background: var(--fc2-enh-bg); color: var(--fc2-enh-text); cursor: pointer;";
        dataToggle.textContent = t("btnLogData");
        dataToggle.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log(`[Log Detail][${entry.module}]`, entry.data);
          const modal = document.createElement("div");
          modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(${UI_TOKENS.BACKDROP.BLUR});
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: ${UI_CONSTANTS.Z_INDEX_OVERLAY};
                    padding: ${UI_TOKENS.SPACING.XL};
                `;
          const content = document.createElement("div");
          content.style.cssText = `
                    background: var(--fc2-enh-bg);
                    color: var(--fc2-enh-text);
                    padding: ${UI_TOKENS.SPACING.XL};
                    border-radius: ${UI_TOKENS.RADIUS.MD};
                    max-width: 800px;
                    max-height: 80vh;
                    overflow: auto;
                    box-shadow: ${UI_TOKENS.BACKDROP.SHADOW};
                `;
          const header = document.createElement("div");
          header.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;";
          const titleEl = document.createElement("h3");
          titleEl.textContent = `${t("labelLogData")} - ${entry.module}`;
          titleEl.style.margin = "0";
          const closeBtn = document.createElement("button");
          closeBtn.textContent = "✕";
          closeBtn.className = "fc2-btn";
          closeBtn.style.cssText = "padding: 4px 12px; cursor: pointer;";
          closeBtn.onclick = (e2) => {
            e2.stopPropagation();
            modal.remove();
          };
          header.appendChild(titleEl);
          header.appendChild(closeBtn);
          const pre = document.createElement("pre");
          pre.style.cssText = `
                    background: var(--fc2-enh-bg-secondary);
                    padding: 15px;
                    border-radius: 4px;
                    overflow: auto;
                    font-family: monospace;
                    font-size: 12px;
                    line-height: 1.5;
                    user-select: text;
                    cursor: text;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                `;
          pre.textContent = JSON.stringify(entry.data, null, 2);
          const copyBtn = document.createElement("button");
          copyBtn.className = "fc2-btn";
          copyBtn.textContent = t("btnCopy") || "复制";
          copyBtn.style.cssText = "margin-top: 10px; width: 100%;";
          copyBtn.onclick = (e2) => {
            e2.stopPropagation();
            navigator.clipboard.writeText(JSON.stringify(entry.data, null, 2));
            copyBtn.textContent = "✓ " + (t("alertLogsCopied") || "已复制");
            setTimeout(() => copyBtn.textContent = t("btnCopy") || "复制", 2e3);
          };
          content.appendChild(header);
          content.appendChild(pre);
          content.appendChild(copyBtn);
          modal.appendChild(content);
          modal.onclick = (e2) => {
            if (e2.target === modal) modal.remove();
          };
          document.body.appendChild(modal);
        };
        item.appendChild(dataToggle);
      }
      return item;
    };
    return {
      render() {
        container = document.createElement("div");
        container.className = "tab-content";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.height = "100%";
        const header = document.createElement("div");
        header.style.cssText = `padding: ${UI_TOKENS.SPACING.GUTTER}; border-bottom: 1px solid ${UI_TOKENS.COLORS.BORDER}; display: flex; justify-content: space-between; align-items: center;`;
        const title = document.createElement("h3");
        title.textContent = t("labelTechnicalLogs");
        title.style.margin = "0";
        const actions = document.createElement("div");
        actions.style.display = "flex";
        actions.style.gap = UI_TOKENS.SPACING.SM;
        const copyBtn = document.createElement("button");
        copyBtn.className = "fc2-btn";
        copyBtn.innerHTML = `${IconMagnifyingGlass} ${t("btnCopyAll")}`;
        copyBtn.style.cssText = "background: var(--fc2-enh-bg); color: var(--fc2-enh-text); border: 1px solid var(--fc2-enh-border);";
        copyBtn.onclick = () => {
          const text = Logger$1.history.map((e) => `[${e.timestamp}] [${e.level.toUpperCase()}] [${e.module}] ${e.message}`).join("\n");
          navigator.clipboard.writeText(text);
          alert(t("alertLogsCopied"));
        };
        const clearBtn = document.createElement("button");
        clearBtn.className = "fc2-btn btn-danger";
        clearBtn.textContent = t("btnClearLogs");
        clearBtn.style.cssText = `background: var(--fc2-enh-bg); color: ${UI_TOKENS.COLORS.ERROR}; border: 1px solid ${UI_TOKENS.COLORS.ERROR_LIGHT};`;
        clearBtn.onclick = () => {
          Logger$1.history = [];
          this.refresh();
        };
        actions.appendChild(copyBtn);
        actions.appendChild(clearBtn);
        const filters = document.createElement("div");
        filters.style.cssText = "display: flex; gap: 12px; align-items: center; margin-left: 20px;";
        const filterLabel = document.createElement("span");
        filterLabel.textContent = t("labelLogFilters") + ":";
        filterLabel.style.cssText = "font-size: 12px; color: var(--fc2-enh-text); opacity: 0.7;";
        filters.appendChild(filterLabel);
        ["error", "warn", "info", "success"].forEach((level) => {
          const label = document.createElement("label");
          label.style.cssText = "display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 12px;";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = activeFilters[level];
          checkbox.style.cssText = "cursor: pointer;";
          checkbox.onchange = () => {
            activeFilters[level] = checkbox.checked;
            this.refresh();
          };
          const text = document.createElement("span");
          text.textContent = level.toUpperCase();
          text.style.color = level === "error" ? UI_TOKENS.COLORS.ERROR : level === "warn" ? UI_TOKENS.COLORS.WARN : level === "success" ? UI_TOKENS.COLORS.SUCCESS : UI_TOKENS.COLORS.INFO;
          label.appendChild(checkbox);
          label.appendChild(text);
          filters.appendChild(label);
        });
        actions.appendChild(filters);
        header.appendChild(title);
        header.appendChild(actions);
        const list = document.createElement("div");
        list.id = DOM_IDS.LOG_LIST;
        list.style.cssText = `flex: 1; overflow-y: auto; padding: ${UI_TOKENS.SPACING.SM}; background: var(--fc2-enh-bg-secondary);`;
        container.appendChild(header);
        container.appendChild(list);
        this.refresh();
        return container;
      },
      refresh() {
        const list = container?.querySelector(`#${DOM_IDS.LOG_LIST}`);
        if (list) {
          list.innerHTML = "";
          const logs = [...Logger$1.history].reverse().filter(
            (entry) => activeFilters[entry.level]
          );
          logs.forEach((entry) => {
            list.appendChild(createLogItem(entry));
          });
        }
      }
    };
  })();
  const SettingsPanel = (() => {
    let host = null;
    let shadow = null;
    let styleSheet = null;
    const tabCache = new Map();
    const create = () => {
      if (host && host.isConnected) return;
      if (host) host.remove();
      host = h("div", {
        id: DOM_IDS.SETTINGS_HOST,
        style: {
          display: "none",
          position: "fixed",
          inset: "0",
          zIndex: String(UI_CONSTANTS.Z_INDEX_MAX)
        }
      });
      shadow = host.attachShadow({ mode: "open" });
      try {
        styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(`
                ${StyleManager.getCss()}
                :host { all: initial; }
                #${DOM_IDS.SETTINGS_CONTAINER} {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: ${UI_CONSTANTS.FONT_FAMILY};
                }
            `);
        shadow.adoptedStyleSheets = [styleSheet];
      } catch (e) {
        shadow.innerHTML = `
                <style>
                    ${StyleManager.getCss()}
                    :host { all: initial; }
                    #${DOM_IDS.SETTINGS_CONTAINER} {
                        position: absolute;
                        inset: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-family: ${UI_CONSTANTS.FONT_FAMILY};
                    }
                </style>
            `;
      }
      const container = h("div", { id: DOM_IDS.SETTINGS_CONTAINER });
      shadow.appendChild(container);
      document.body.appendChild(host);
    };
    const hide = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (host) {
        host.style.setProperty("display", "none", "important");
        document.body.classList.remove("fc2-settings-open");
      }
    };
    const saveWebDAVSettings = () => {
      const q = (id) => shadow.getElementById(`set-${id}`);
      ["webdavUrl", "webdavUser", "webdavPass", "webdavPath"].forEach((id) => {
        const el = q(id);
        if (el) State.proxy[id] = el.value.trim();
      });
    };
    const saveAndClose = () => {
      const q = (id) => shadow.getElementById(`set-${id}`);
      const colsEl = q("gridColumns");
      let needsReload = false;
      if (colsEl) {
        const cols = parseInt(colsEl.value || 0);
        const currentCols = typeof GM_getValue !== "undefined" ? GM_getValue(STORAGE_KEYS.USER_GRID_COLUMNS, 0) : 0;
        if (cols !== currentCols) {
          needsReload = true;
          if (typeof GM_setValue !== "undefined") {
            GM_setValue(STORAGE_KEYS.USER_GRID_COLUMNS, cols);
          }
          CoreEvents.emit(AppEvents.GRID_CHANGED, cols);
        }
      }
      saveWebDAVSettings();
      const langEl = q("language");
      if (langEl && langEl.value !== State.proxy.language) {
        needsReload = true;
      }
      const boolKeys = [
        "hideNoMagnet",
        "hideCensored",
        "hideViewed",
        "enableHistory",
        "enableQuickBar",
        "loadExtraPreviews",
        "enableMagnets",
        "enableExternalLinks",
        "enableActressName"
      ];
      boolKeys.forEach((id) => {
        const el = q(id);
        if (el) State.proxy[id] = el.checked;
      });
      ["previewMode", "syncMode", "language"].forEach((id) => {
        const el = q(id);
        if (el) State.proxy[id] = el.value;
      });
      Logger$1.success("SettingsPanel", "Settings saved successfully");
      Toast$1.show(t("alertSettingsSaved"), "success");
      if (needsReload) {
        const shouldReload = confirm(t("confirmReloadSettings"));
        if (shouldReload) {
          setTimeout(() => location.reload(), TIMING.DEBOUNCE_MS);
        }
      }
      hide();
    };
    const handleKeyDown = (e) => {
      if (!host || host.style.display === "none") return;
      if (e.key === "Escape") {
        e.preventDefault();
        hide();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveAndClose();
      }
    };
    const render = (activeTab = "settings") => {
      create();
      host.style.setProperty("display", "block", "important");
      document.body.classList.add("fc2-settings-open");
      const container = shadow.getElementById(DOM_IDS.SETTINGS_CONTAINER);
      if (container.children.length === 0) {
        const mkIcon = (svg) => {
          const s = h("span", { className: "fc2-icon" });
          s.innerHTML = svg;
          return s;
        };
        const closeIcon = mkIcon(IconXmark);
        const panel = h(
          "div",
          { className: "fc2-enh-settings-panel enh-modal-panel" },
          h(
            "div",
            {
              className: "fc2-enh-settings-header",
              style: {
                backdropFilter: `blur(${UI_TOKENS.BACKDROP.BLUR})`,
                background: UI_TOKENS.BACKDROP.COLOR,
                position: "sticky",
                top: 0,
                zIndex: 10
              }
            },
            h("h2", {}, SCRIPT_INFO.NAME),
            h("button", { className: "close-btn", onclick: hide }, closeIcon)
          ),
          h(
            "div",
            { className: "fc2-enh-settings-tabs", id: "tab-buttons" },
            h(
              "button",
              {
                className: "fc2-enh-tab-btn",
                "data-tab": "settings",
                onclick: () => switchTab("settings")
              },
              mkIcon(IconSliders),
              t("tabSettings")
            ),
            h(
              "button",
              {
                className: "fc2-enh-tab-btn",
                "data-tab": "data",
                onclick: () => switchTab("data")
              },
              mkIcon(IconDatabase),
              t("tabData")
            ),
            h(
              "button",
              {
                className: "fc2-enh-tab-btn",
                "data-tab": "debug",
                onclick: () => switchTab("debug")
              },
              mkIcon(IconBolt),
              t("tabDebug")
            ),
            h(
              "button",
              {
                className: "fc2-enh-tab-btn",
                "data-tab": "about",
                onclick: () => switchTab("about")
              },
              mkIcon(IconCircleInfo),
              t("tabAbout")
            )
          ),
          h("div", { className: "fc2-enh-settings-content", id: DOM_IDS.TAB_CONTENT }),
          h(
            "div",
            { className: "fc2-enh-settings-footer" },
            h("button", { className: "fc2-enh-btn", onclick: (e) => hide(e) }, t("btnCancel")),
            h("button", { className: "fc2-enh-btn primary", onclick: () => saveAndClose() }, t("btnSave"))
          )
        );
        const backdrop = h("div", { className: "enh-modal-backdrop", onclick: hide });
        container.append(backdrop, panel);
      }
      switchTab(activeTab);
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        const firstButton = shadow?.querySelector(".fc2-enh-tab-btn.active");
        firstButton?.focus();
      }, 100);
    };
    const switchTab = (tabName) => {
      const contentContainer = shadow.getElementById(DOM_IDS.TAB_CONTENT);
      const tabButtons = shadow.querySelectorAll(".fc2-enh-tab-btn");
      tabButtons.forEach((btn) => {
        if (btn.dataset.tab === tabName) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
      if (!tabCache.has(tabName)) {
        const tabContent = h("div", {
          className: "fc2-tab-content-wrapper",
          "data-tab": tabName
        });
        const content = tabName === "settings" ? renderSettingsTab() : tabName === "data" ? renderDataTab(render, saveWebDAVSettings) : tabName === "about" ? renderAboutTab() : DebugTab.render();
        tabContent.appendChild(content);
        tabCache.set(tabName, tabContent);
      }
      contentContainer.querySelectorAll(".fc2-tab-content-wrapper").forEach((tab) => {
        tab.style.display = "none";
      });
      const cachedTab = tabCache.get(tabName);
      if (!contentContainer.contains(cachedTab)) {
        contentContainer.appendChild(cachedTab);
      }
      cachedTab.style.display = "block";
    };
    const clearTabCache = () => {
      tabCache.clear();
    };
    return {
      show: () => render(),
      render,
      hide: () => {
        hide();
        document.removeEventListener("keydown", handleKeyDown);
      },
      clearCache: clearTabCache,
      switchTab
    };
  })();
  const MenuManager = {
    _menuIds: [],
    register() {
      this._menuIds.forEach((id) => GM_unregisterMenuCommand(id));
      this._menuIds = [];
      this._menuIds.push(GM_registerMenuCommand(t("menuOpenSettings"), () => SettingsPanel.show()));
    }
  };
  const QuickBar = (() => {
    let container = null;
    let _eventBound = false;
    const init = () => {
      if (container) container.remove();
      if (!State.proxy.enableQuickBar) return;
      const appState = State.proxy;
      if (!_eventBound) {
        CoreEvents.on(AppEvents.LANGUAGE_CHANGED, () => {
          MenuManager.register();
          init();
        });
        _eventBound = true;
      }
      container = h("div", { className: "fc2-fab-container" });
      const actions = h("div", { className: "fc2-fab-actions" });
      const mkBtn = (iconSvg, title, prop, onClick) => {
        const iconContainer = UIUtils.icon(iconSvg);
        const b = h(
          "button",
          {
            className: `fc2-fab-btn ${prop && appState[prop] ? "active" : ""}`,
            "data-title": title,
            "aria-label": title,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (prop) {
                appState[prop] = !appState[prop];
                const isActive = !!appState[prop];
                b.classList.toggle("active", isActive);
                const status = isActive ? t("statusOn") : t("statusOff");
                Toast$1.show(`${title}: ${status}`, isActive ? "success" : "info");
                const cards = document.querySelectorAll(`.${Config.CLASSES.cardRebuilt}`);
                cards.forEach((card) => {
                  if (prop === "hideCensored") {
                    UIUtils.applyCensoredFilter(card);
                  } else if (prop === "hideViewed") {
                    UIUtils.applyHistoryVisibility(card);
                  } else if (prop === "hideNoMagnet") {
                    const hasM = card.querySelector(`.${Config.CLASSES.btnMagnet}`) !== null;
                    UIUtils.applyCardVisibility(card, hasM);
                  }
                });
              } else if (onClick) onClick();
            }
          },
          iconContainer
        );
        return b;
      };
      actions.appendChild(mkBtn(IconArrowUp, t("btnBackToTop"), null, () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }));
      actions.appendChild(mkBtn(IconGear, t("tabSettings"), null, SettingsPanel.show));
      actions.appendChild(mkBtn(IconBan, t("optionHideCensored"), "hideCensored"));
      actions.appendChild(mkBtn(IconMagnet, t("optionHideNoMagnet"), "hideNoMagnet"));
      actions.appendChild(mkBtn(IconEyeSlash, t("optionHideViewed"), "hideViewed"));
      actions.appendChild(mkBtn(IconRotate, t("labelSyncing"), null, () => {
        SyncManager.onProgress = (progress) => {
          Toast$1.show(`${progress.phase} (${progress.percent}%)`, "info");
        };
        SyncManager.performSync(true).catch(() => {
        });
      }));
      const iconPlusContainer = UIUtils.icon(IconPlus);
      const trigger = h(
        "button",
        {
          className: "fc2-fab-trigger",
          "aria-label": t("btnMoreOptions") || "More options"
},
        iconPlusContainer,
        h("div", {
          className: `fc2-sync-dot ${appState.syncStatus}`,
          style: { display: appState.syncMode === "none" || appState.syncStatus === "idle" ? "none" : "block" }
        })
      );
      State.on((prop, val) => {
        const dot = trigger.querySelector(".fc2-sync-dot");
        if (!dot) return;
        if (prop === "syncStatus") {
          dot.className = `fc2-sync-dot ${val}`;
          dot.style.display = State.proxy.syncMode === "none" || val === "idle" ? "none" : "block";
        } else if (prop === "syncMode") {
          dot.style.display = val === "none" || State.proxy.syncStatus === "idle" ? "none" : "block";
        }
      });
      container.append(trigger, actions);
      document.body.appendChild(container);
      const savedConfig = typeof GM_getValue !== "undefined" ? GM_getValue("fab_pos_v2") : null;
      const applyAnchor = (config) => {
        if (!container) return;
        container.style.transition = "none";
        container.style.left = config.anchorX === "left" ? `${config.x}px` : "auto";
        container.style.right = config.anchorX === "right" ? `${config.x}px` : "auto";
        container.style.top = config.anchorY === "top" ? `${config.y}px` : "auto";
        container.style.bottom = config.anchorY === "bottom" ? `${config.y}px` : "auto";
      };
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          applyAnchor(config);
        } catch (e) {
        }
      } else {
        container.style.right = "20px";
        container.style.bottom = "40px";
      }
      let isDragging = false;
      let startX = 0, startY = 0;
      let startLeft = 0, startTop = 0;
      let hasMoved = false;
      const onDragStart = (e) => {
        if (e.button !== 0 && e.type !== "touchstart") return;
        isDragging = true;
        hasMoved = false;
        const clientX = e.clientX ?? e.touches[0].clientX;
        const clientY = e.clientY ?? e.touches[0].clientY;
        startX = clientX;
        startY = clientY;
        const rect = container.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        container.style.transition = "none";
        container.style.right = "auto";
        container.style.bottom = "auto";
        container.style.left = `${startLeft}px`;
        container.style.top = `${startTop}px`;
        e.stopPropagation();
      };
      const onDragMove = (e) => {
        if (!isDragging || !container) return;
        e.preventDefault();
        const clientX = e.clientX ?? e.touches[0].clientX;
        const clientY = e.clientY ?? e.touches[0].clientY;
        const dx = clientX - startX;
        const dy = clientY - startY;
        const threshold = e.type.startsWith("touch") ? 20 : 10;
        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) hasMoved = true;
        let newLeft = startLeft + dx;
        let newTop = startTop + dy;
        const maxLeft = window.innerWidth - container.offsetWidth;
        const maxTop = window.innerHeight - container.offsetHeight;
        newLeft = Math.min(maxLeft, Math.max(0, newLeft));
        newTop = Math.min(maxTop, Math.max(0, newTop));
        container.style.left = `${newLeft}px`;
        container.style.top = `${newTop}px`;
      };
      const onDragEnd = () => {
        if (!isDragging || !container) return;
        isDragging = false;
        if (hasMoved) {
          const rect = container.getBoundingClientRect();
          const viewportW = window.innerWidth;
          const viewportH = window.innerHeight;
          const centerX = rect.left + rect.width / 2;
          const isRight = centerX > viewportW / 2;
          const centerY = rect.top + rect.height / 2;
          const isBottom = centerY > viewportH / 2;
          const targetMargin = 20;
          const targetLeftPx = isRight ? viewportW - rect.width - targetMargin : targetMargin;
          let targetTopPx = rect.top;
          const maxTop = viewportH - rect.height - targetMargin;
          targetTopPx = Math.min(maxTop, Math.max(targetMargin, targetTopPx));
          container.style.transition = "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
          container.style.left = `${targetLeftPx}px`;
          container.style.top = `${targetTopPx}px`;
          const anchorX = isRight ? "right" : "left";
          const anchorY = isBottom ? "bottom" : "top";
          const valX = targetMargin;
          const valY = isBottom ? viewportH - targetTopPx - rect.height : targetTopPx;
          const config = { anchorX, x: valX, anchorY, y: valY };
          if (typeof GM_setValue !== "undefined") {
            GM_setValue("fab_pos_v2", JSON.stringify(config));
          }
          setTimeout(() => {
            applyAnchor(config);
          }, 300);
        } else {
          const vis = actions.classList.toggle("visible");
          trigger.classList.toggle("active", vis);
        }
      };
      trigger.addEventListener("mousedown", onDragStart);
      trigger.addEventListener("touchstart", onDragStart, { passive: false });
      document.addEventListener("mousemove", onDragMove, { passive: false });
      document.addEventListener("touchmove", onDragMove, { passive: false });
      document.addEventListener("mouseup", onDragEnd);
      document.addEventListener("touchend", onDragEnd);
      const closeFAB = (e) => {
        if (!isDragging && container && !container.contains(e.target) && actions.classList.contains("visible")) {
          actions.classList.remove("visible");
          trigger.classList.remove("active");
        }
      };
      document.addEventListener("click", closeFAB, true);
    };
    return { init };
  })();
  const GlobalErrorHandler = {
    init() {
      window.addEventListener("unhandledrejection", (event) => {
        Logger$1.error(
          "GlobalError",
          `Unhandled Promise rejection: ${event.reason?.message || "No message"}`,
          event.reason
        );
        event.preventDefault();
      });
      window.addEventListener("error", (event) => {
        if (event.filename?.startsWith("blob:")) return;
        if (event.message === "Script error.") return;
        if (event.message?.includes("s is not defined") && !event.error?.stack?.includes("FC2PPVDB")) return;
        const errorInfo = {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack || "No stack trace"
        };
        Logger$1.error("GlobalError", `Uncaught exception: ${event.message}`, event.error || errorInfo);
      });
      Logger$1.info("GlobalErrorHandler", "Initialized");
    }
  };
  const MigrationManager = {
    init() {
      CoreEvents.on(AppEvents.BOOTSTRAP, async () => {
        Logger$1.info("Migration", "Bootstrap event received, running migration");
        await this.run();
      });
    },
    async run() {
      const currentVersion = Storage.get("migration_version", 0);
      const TARGET_VERSION = 1;
      if (currentVersion >= TARGET_VERSION) {
        return;
      }
      Logger$1.group("Migration", `Migrating from v${currentVersion} to v${TARGET_VERSION}`);
      try {
        await this.migrateHistory();
        Storage.set("migration_version", TARGET_VERSION);
        Logger$1.success("Migration", "Migration completed successfully");
      } catch (e) {
        Logger$1.error("Migration", "Migration failed", e);
      } finally {
        Logger$1.groupEnd();
      }
    },
    async migrateHistory() {
      const oldKey = "history_v1";
      const oldDataStr = Storage.get(oldKey, null);
      if (!oldDataStr) {
        Logger$1.info("Migration", "No old history found");
        return;
      }
      try {
        let oldData = oldDataStr;
        if (typeof oldDataStr === "string") {
          try {
            oldData = JSON.parse(oldDataStr);
          } catch {
            Logger$1.warn("Migration", "Failed to parse history JSON, treating as raw string? Unlikely.");
          }
        }
        if (!Array.isArray(oldData)) {
          Logger$1.warn("Migration", "Invalid history data format (not array)", typeof oldData);
          return;
        }
        Logger$1.info("Migration", `Found ${oldData.length} raw history items`);
        const now = ( new Date()).toISOString();
        const validItemsMap = new Map();
        for (const item of oldData) {
          try {
            let id = "";
            let timestamp = Date.now();
            if (typeof item === "number") {
              id = String(item);
            } else if (typeof item === "string") {
              id = item.trim();
            } else if (typeof item === "object" && item !== null) {
              if (item.id) id = String(item.id).trim();
              if (typeof item.timestamp === "number" && !isNaN(item.timestamp) && item.timestamp > 0) {
                timestamp = item.timestamp;
              }
            }
            if (!id) continue;
            if (validItemsMap.has(id)) {
              const existing = validItemsMap.get(id);
              if (timestamp > existing.timestamp) {
                existing.timestamp = timestamp;
              }
            } else {
              validItemsMap.set(id, {
                id,
                timestamp,
                updated_at: now,
is_deleted: 0,
                sync_dirty: 1
              });
            }
          } catch (e) {
            Logger$1.warn("Migration", "Skipping malformed history item", item);
          }
        }
        const dbItems = Array.from(validItemsMap.values());
        if (dbItems.length > 0) {
          await Repository.db.history.bulkPut(dbItems);
          Logger$1.success("Migration", `Successfully migrated ${dbItems.length} unique history items`);
        }
      } catch (e) {
        Logger$1.error("Migration", "Critical error migrating history", e);
      }
    },
    async migrateCache() {
      const oldKey = "magnet_cache_v1";
      const oldDataStr = Storage.get(oldKey, null);
      if (!oldDataStr) {
        return;
      }
      try {
        let oldData = oldDataStr;
        if (typeof oldDataStr === "string") {
          try {
            oldData = JSON.parse(oldDataStr);
          } catch {
          }
        }
        if (typeof oldData !== "object" || oldData === null) return;
        const entries = Object.entries(oldData);
        Logger$1.info("Migration", `Found ${entries.length} cache items to migrate`);
        const validItems = [];
        const now = Date.now();
        for (const [key, val] of entries) {
          try {
            const id = String(key).trim();
            if (!id) continue;
            const valueObj = val;
            if (!valueObj || !valueObj.v || typeof valueObj.v !== "string") continue;
            const magnetUrl = valueObj.v;
            if (!magnetUrl.startsWith("magnet:?")) continue;
            let timestamp = now;
            if (typeof valueObj.t === "number" && !isNaN(valueObj.t) && valueObj.t > 0) {
              timestamp = valueObj.t;
            }
            validItems.push({
              id,
              value: magnetUrl,
              timestamp
            });
          } catch {
          }
        }
        if (validItems.length > 0) {
          await Repository.db.cache.bulkPut(validItems);
          Logger$1.success("Migration", `Successfully migrated ${validItems.length} cache items`);
        }
      } catch (e) {
        Logger$1.error("Migration", "Error migrating cache", e);
      }
    }
  };
  const main = async () => {
    const isCloudflareChallenge = () => {
      const doc = document;
      const title = doc.title;
      const indicators = [
        ...CLOUDFLARE_INDICATORS.map((ind) => title.includes(ind)),
        !!doc.querySelector("#cf-wrapper"),
        !!doc.querySelector(".cf-browser-verification"),
        !!doc.querySelector("#cf-content"),
        !!doc.querySelector("#trk_js_j"),
        !!doc.querySelector('iframe[src*="challenges.cloudflare.com"]'),
        !!doc.querySelector('form[action*="/_cf_chl_prog"]')
      ];
      return indicators.some(Boolean);
    };
    if (isCloudflareChallenge()) {
      Logger$1.warn("Main", "Cloudflare check detected, skipping initialization.");
      return;
    }
    try {
      GlobalErrorHandler.init();
      Logger$1.init();
      Logger$1.group("Main", `🚀 ${SCRIPT_INFO.NAME} Initializing`);
      Logger$1.time("Main.init");
      if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement("meta");
        viewport.name = "viewport";
        viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes";
        document.head.appendChild(viewport);
      }
      SyncManager.init();
      HistoryManager.init();
      MigrationManager.init?.();
      Logger$1.info("Main", "Emitting BOOTSTRAP...");
      CoreEvents.emit(AppEvents.BOOTSTRAP, {});
      Repository.runGC().catch((e) => Logger$1.error("Main", "GC Failed", e));
      StyleManager.init();
      const hostname = location.hostname;
      const uiDelay = hostname.includes("supjav") || hostname.includes("missav") ? 800 : 0;
      setTimeout(async () => {
        QuickBar.init();
        GridManager.init();
        MagnetManager.init();
        MenuManager.register();
        Logger$1.info("Main", "Emitting UI_READY...");
        CoreEvents.emit(AppEvents.UI_READY, {});
        SiteManager.registerAll(SiteConfigs);
        await SiteManager.bootstrap();
        Logger$1.timeEnd("Main.init");
        Logger$1.groupEnd();
        Logger$1.info("Main", "✅ Main workflow complete");
      }, uiDelay);
    } catch (error) {
      Logger$1.error("Main", "Fatal initialization error", error);
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
  var MessageType = ((MessageType2) => {
    MessageType2["SETTING_UPDATE"] = "SETTING_UPDATE";
    MessageType2["HISTORY_UPDATE"] = "HISTORY_UPDATE";
    MessageType2["UI_REFRESH"] = "UI_REFRESH";
    return MessageType2;
  })(MessageType || {});
  const MessagingService = (() => {
    const CHANNEL_NAME = SYSTEM_KEYS.MESSAGING_CHANNEL;
    const tabId = Math.random().toString(36).substring(2, 11);
    const channel = new BroadcastChannel(CHANNEL_NAME);
    const listeners = new Set();
    channel.onmessage = (event) => {
      const msg = event.data;
      if (msg.sourceTabId === tabId) return;
      Logger$1.info("MessagingService", `Received ${msg.type} from other tab`);
      listeners.forEach((l) => l(msg));
    };
    return {
      broadcast(type, payload) {
        const msg = {
          type,
          payload,
          sourceTabId: tabId
        };
        channel.postMessage(msg);
        Logger$1.info("MessagingService", `Broadcasted ${type}`);
      },
      onMessage(handler) {
        listeners.add(handler);
        return () => listeners.delete(handler);
      }
    };
  })();
  const MessagingService$1 = Object.freeze( Object.defineProperty({
    __proto__: null,
    MessageType,
    MessagingService
  }, Symbol.toStringTag, { value: "Module" }));

})(Dexie);