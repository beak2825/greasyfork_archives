// ==UserScript==
// @name            FC2PPVDB Enhanced
// @name:en         FC2PPVDB Enhanced
// @namespace       https://greasyfork.org/zh-CN/scripts/552583-fc2ppvdb-enhanced
// @version         2.0.0
// @author          Icarusle
// @description     提供极速磁力搜索、高清预览、连拍图集、跨端历史同步与自定义过滤，重塑卡片布局丰富交互体验。极致性能，优雅动效。
// @description:en  Magnet search, HD preview, multi-shot gallery, sync history, and more. Modern UI with smooth animations.
// @license         MIT
// @icon            https://fc2ppvdb.com/favicon.ico
// @match           https://fc2ppvdb.com/*
// @match           https://fd2ppv.cc/*
// @match           https://supjav.com/*
// @match           https://missav.ws/*
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
// @grant           GM_registerMenuCommand
// @grant           GM_setClipboard
// @grant           GM_setValue
// @grant           GM_unregisterMenuCommand
// @grant           GM_xmlhttpRequest
// @grant           unsafeWindow
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/552583/FC2PPVDB%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/552583/FC2PPVDB%20Enhanced.meta.js
// ==/UserScript==

(function (Dexie) {
  'use strict';

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
    VERSION: 1
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
    /排行榜/,
    /导航/,
    /菜单/,
    /更多/,
    /全部/,
    /^[\d\s]+$/
  ];
  const Config = {
    EXTERNAL_URLS,
    SCRAPER_URLS,
    SCRAPER_CONFIG,
    STORAGE_KEYS: { SETTINGS: "settings_v1", CACHE: "magnet_cache_v1", HISTORY: "history_v1" },
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
      hideViewed: "hide-viewed"
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
    extractFC2Id: (url) => url?.match(/articles\/(\d+)/)?.[1] ?? null,
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
      const jav = input.match(/([A-Z]{1,10})-?(\d{2,8})/);
      if (jav) {
        const prefix = jav[1];
        const blacklist = JAV_PREFIX_BLACKLIST;
        if (!blacklist.includes(prefix)) {
          return { id: `${prefix}-${jav[2]}`, type: "jav" };
        }
      }
      const fc2Raw = text.match(/(\d{5,10})/);
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
    }
  };
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
language: Storage.get("language", "auto") || "auto",
      lastSyncTs: "1970-01-01T00:00:00.000Z",
      supabaseUrl: Storage.get("supabase_url", "") || "",
      supabaseKey: Storage.get("supabase_key", "") || "",
      webdavUrl: Storage.get("webdav_url", "") || "",
      webdavUser: Storage.get("webdav_user", "") || "",
      webdavPass: Storage.get("webdav_pass", "") || "",
      webdavPath: Storage.get("webdav_path", "fc2_enhanced_sync.json") || "fc2_enhanced_sync.json",
      syncMode: Storage.get("sync_mode", "none") || "none",
      syncStatus: "idle"
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
      "enableActressName"
    ];
    boolKeys.forEach((key) => {
      if (stored[key] !== void 0 && typeof stored[key] !== "boolean") {
        stored[key] = Boolean(stored[key]);
      }
    });
    const rawState = { ...defaults, ...stored };
    const listeners = new Set();
    const saveState = (data) => {
      const { syncStatus: _syncStatus, ...toSave } = data;
      Storage.set(Config.STORAGE_KEYS.SETTINGS, toSave);
    };
    const store = new Proxy(rawState, {
      set(target, prop, value) {
        target[prop] = value;
        if (prop !== "syncStatus") {
          saveState(target);
        }
        listeners.forEach((cb) => cb(prop, value));
        return true;
      }
    });
    return {
      proxy: store,
      on: (cb) => listeners.add(cb)
    };
  })();
  const DEBUG_KEY = "fc2_enhanced_debug";
  const Logger$1 = {
init() {
      if (this.enabled) {
        console.log(
          "%c FC2PPVDB Enhanced %c v2.1.0 %c\n%c https://greasyfork.org/scripts/552583 ",
          "background: #3b82f6; color: white; padding: 2px 4px; border-radius: 3px 0 0 3px; font-weight: bold;",
          "background: #353535; color: white; padding: 2px 4px; border-radius: 0 3px 3px 0;",
          "",
          "color: #9ca3af; font-size: 11px; margin-top: 4px;"
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
log(module, message, data) {
      if (this.enabled) {
        const timestamp = ( new Date()).toLocaleTimeString();
        console.log(`%c[FC2 Enhanced] %c[${timestamp}] [${module}]`, "color: #3b82f6; font-weight: bold;", "color: #9ca3af;", message, data || "");
      }
    },
info(module, message, data) {
      if (this.enabled) {
        const timestamp = ( new Date()).toLocaleTimeString();
        console.info(`%c[FC2 Enhanced] %c[${timestamp}] [${module}] ℹ️`, "color: #3b82f6; font-weight: bold;", "color: #9ca3af;", message, data || "");
      }
    },
success(module, message, data) {
      if (this.enabled) {
        const timestamp = ( new Date()).toLocaleTimeString();
        console.log(`%c[FC2 Enhanced] %c[${timestamp}] [${module}] ✅`, "color: #10b981; font-weight: bold;", "color: #9ca3af;", message, data || "");
      }
    },
warn(module, message, data) {
      if (this.enabled) {
        const timestamp = ( new Date()).toLocaleTimeString();
        console.warn(`%c[FC2 Enhanced] %c[${timestamp}] [${module}] ⚠️`, "color: #f59e0b; font-weight: bold;", "color: #9ca3af;", message, data || "");
      }
    },
error(module, message, error) {
      const timestamp = ( new Date()).toLocaleTimeString();
      console.error(`%c[FC2 Enhanced] %c[${timestamp}] [${module}] ❌`, "color: #ef4444; font-weight: bold;", "color: #9ca3af;", message, error || "");
    },
time(label) {
      if (this.enabled) {
        console.time(`[FC2 Enhanced] ${label}`);
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
      this.version(3).stores({
        history: "&id, timestamp, updated_at, is_deleted, sync_dirty, [is_deleted+timestamp], [sync_dirty+updated_at]",
        cache: "&id, timestamp, [timestamp+id]",
        itemDetails: "&id, lastAccessed, [lastAccessed+id]"
      }).upgrade(async (_tx) => {
        Logger$1.info("Database", "Upgrading to version 3 - Adding composite indexes");
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
      async add(id) {
        Logger$1.time("History.add");
        const now = ( new Date()).toISOString();
        const item = {
          id: String(id),
          timestamp: Date.now(),
          updated_at: now,
          is_deleted: 0,
          sync_dirty: 1
        };
        await db.history.put(item);
        qCache.invalidate();
        Logger$1.success("History", `Added: ${id}`, item);
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
  const translations = {
    zh: {
      settingsTitle: "FC2PPVDB Enhanced",
      tabSettings: "偏好设置",
      tabStatistics: "统计与分析",
      tabData: "数据管理",
      tabAbout: "关于",
      tabDmca: "免责声明",
      groupFilters: "内容过滤",
      optionHideNoMagnet: "过滤无磁力资源",
      optionHideCensored: "过滤有码作品 (Free)",
      optionHideViewed: "过滤已阅作品",
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
      labelCacheManagement: "存储维护",
      btnClearCache: "清空磁力缓存",
      labelHistoryManagement: "历史记录",
      btnClearHistory: "清空浏览历史",
      btnSaveAndApply: "保存设置",
      alertSettingsSaved: "设置已保存并生效",
      alertCacheCleared: "磁力缓存已释放",
      alertHistoryCleared: "浏览历史已清空",
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
      tooltipClickToCopy: "点击复制",
      btnCancel: "取消",
      btnSave: "保存更改",
      btnBackToTop: "顶部",
      labelDebugMode: "调试模式",
      statusDebugOn: "调试中",
      statusDebugOff: "正常",
      alertDebugOn: "已开启调试日志",
      alertDebugOff: "已关闭调试日志",
      alertMarkedViewed: "已标记",
      tooltipCopyId: "复制番号",
      verifyCF: "点击验证 CF",
      dmcaContent: "本脚本仅为辅助工具，<b>不存储任何视频或图片文件</b>。所有内容（包括图片、磁力链接等）均来自第三方公开网站。使用者需自行承担因使用本工具产生的一切法律后果。如果本工具展示的内容侵犯了您的权利，请直接联系内容来源网站进行删除。"
    },
    en: {
      settingsTitle: "FC2PPVDB Enhanced",
      tabSettings: "Preferences",
      tabStatistics: "Analytics",
      tabData: "Data & Sync",
      tabAbout: "About",
      tabDmca: "Disclaimer",
      groupFilters: "Filters",
      optionHideNoMagnet: "Filter No-Magnet",
      optionHideCensored: "Filter Censored",
      optionHideViewed: "Filter Viewed",
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
      tooltipMarkAsUnviewed: "Unmark",
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
      tooltipClickToCopy: "Copy",
      btnCancel: "Cancel",
      btnSave: "Save",
      btnBackToTop: "Top",
      labelDebugMode: "Debug",
      statusDebugOn: "Debug ON",
      statusDebugOff: "Normal",
      alertDebugOn: "Debug Enabled",
      alertDebugOff: "Debug Disabled",
      alertMarkedViewed: "Marked",
      tooltipCopyId: "Copy ID",
      verifyCF: "Verify CF",
      dmcaContent: "This script is a utility tool and <b>does NOT host any video or image files</b>. All content (including images, magnet links) is provided by third-party public public websites. Users assume full responsibility for using this tool. If content displayed by this tool infringes your rights, please contact the source website directly for removal."
    }
  };
  const Localization = {
    _translations: translations,
    t(key) {
      const lang = State.proxy.language === "auto" ? navigator.language.startsWith("zh") ? "zh" : "en" : State.proxy.language;
      const currentLangSet = this._translations[lang] || this._translations.en;
      return currentLangSet[key] || this._translations.en[key] || key;
    }
  };
  const t = Localization.t.bind(Localization);
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
    markViewed: (id, el, applyHistoryVisibility) => {
      if (!State.proxy.enableHistory) return;
      HistoryManager.add(id);
      const c = el.closest(`.${Config.CLASSES.processedCard}`);
      if (c) {
        c.classList.add(Config.CLASSES.isViewed);
        const vBtn = c.querySelector(".btn-toggle-view");
        if (vBtn) vBtn.classList.add("is-viewed");
        const oc = c.closest(`.${Config.CLASSES.cardRebuilt}`);
        if (oc) {
          oc.classList.add(Config.CLASSES.isViewed);
          applyHistoryVisibility(oc);
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
    applyHistoryVisibility: (c) => c?.classList.toggle(
      Config.CLASSES.hideViewed,
      State.proxy.hideViewed && c.classList.contains(Config.CLASSES.isViewed)
    )
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
        success: "#10b981",
        error: "#ef4444",
        warn: "#f59e0b",
        info: "#3b82f6"
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
        style: {
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.4)",
          cursor: "pointer",
          padding: "0 4px",
          fontSize: "14px",
          marginLeft: "8px",
          transition: "color 0.2s",
          display: "flex",
          alignItems: "center"
        },
        onclick: (e) => {
          e.stopPropagation();
          this.remove(el);
        },
        onmouseenter: (e) => e.target.style.color = "#fff",
        onmouseleave: (e) => e.target.style.color = "rgba(255,255,255,0.4)"
      }, closeIcon) : null;
      const mainIconContainer = UIUtils.icon(iconSvg);
      Object.assign(mainIconContainer.style, {
        color,
        fontSize: "18px",
        marginRight: "12px",
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
            padding: "12px 16px",
            marginBottom: "10px",
            borderRadius: "8px",
            background: "rgba(20, 20, 25, 0.95)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
            color: "#fff",
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
    const logout = (silent = false) => {
      ["sync_user_id", "supabase_jwt", "supabase_refresh_token", "current_user_email", "last_sync_ts"].forEach(
        (k) => GM_deleteValue(k)
      );
      if (!silent) {
        Toast$1.show(t("langZh") === "简体中文" ? "已退出登录" : "Logged out", "success");
        setTimeout(() => location.reload(), 800);
      }
    };
    const api = (method, endpoint, body = null, headers = {}) => {
      const url = GM_getValue("supabase_url") || "";
      const key = GM_getValue("supabase_key") || "";
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
    const getToken = async () => {
      if (!GM_getValue("supabase_url") || !GM_getValue("supabase_key")) return null;
      const jwt = GM_getValue("supabase_jwt");
      if (jwt) {
        try {
          if (JSON.parse(atob(jwt.split(".")[1])).exp * 1e3 > Date.now() + 6e4) return jwt;
        } catch (e) {
        }
      }
      const refresh = GM_getValue("supabase_refresh_token");
      if (!refresh) return null;
      try {
        const data = await api("POST", "/auth/v1/token?grant_type=refresh_token", { refresh_token: refresh });
        if (data.access_token) {
          GM_setValue("sync_user_id", data.user.id);
          GM_setValue("supabase_jwt", data.access_token);
          GM_setValue("supabase_refresh_token", data.refresh_token);
          GM_setValue("current_user_email", data.user.email);
          return data.access_token;
        }
      } catch (e) {
        logout(true);
      }
      return null;
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
        const data = await api("POST", "/auth/v1/token?grant_type=password", { email, password });
        if (data.access_token) {
          GM_setValue("sync_user_id", data.user.id);
          GM_setValue("supabase_jwt", data.access_token);
          GM_setValue("supabase_refresh_token", data.refresh_token);
          GM_setValue("current_user_email", data.user.email);
          GM_setValue("last_sync_ts", "1970-01-01T00:00:00.000Z");
          Logger$1.success("Supabase", `Login successful: ${email}`);
          return data.user;
        }
        throw new Error("Login failed");
      },
      async signup(email, password) {
        return await api("POST", "/auth/v1/signup", { email, password });
      },
      logout,
      async performSync(isManual = false) {
        if (isSyncing) {
          needsRetry = true;
          return;
        }
        State.proxy.syncStatus = "syncing";
        const runSync = async () => {
          Logger$1.group("Supabase", "🔄 Starting Supabase sync");
          Logger$1.time("Supabase.sync");
          isSyncing = true;
          if (isManual) Toast$1.show(t("labelSyncing"), "info");
          try {
            const jwt = await getToken();
            if (!jwt) {
              Logger$1.error("Supabase", "No valid JWT token");
              if (isManual) Toast$1.show(t("alertWebDAVSyncError") + "Login required", "error");
              isSyncing = false;
              State.proxy.syncStatus = "error";
              Logger$1.groupEnd();
              return;
            }
            let lastSync = GM_getValue("last_sync_ts", "1970-01-01T00:00:00.000Z");
            const localCount = await Repository.db.history.count();
            if (localCount === 0 && lastSync !== "1970-01-01T00:00:00.000Z") {
              lastSync = "1970-01-01T00:00:00.000Z";
            }
            const dirtyRecords = await Repository.db.history.where("sync_dirty").equals(1).limit(200).toArray();
            if (dirtyRecords.length > 0) {
              Logger$1.info("Supabase", `Pushing ${dirtyRecords.length} dirty records`);
              const userId = GM_getValue("sync_user_id");
              if (!userId) {
                Logger$1.error("Supabase", "User ID missing");
                if (isManual) Toast$1.show("Sync failed: User ID missing. Please login again.", "error");
                isSyncing = false;
                State.proxy.syncStatus = "error";
                Logger$1.groupEnd();
                return;
              }
              if (_onProgress) _onProgress({ phase: "Pushing local data", percent: 30 });
              const payload = dirtyRecords.map((r) => ({
                fc2_id: isNaN(Number(r.id)) ? r.id : parseInt(r.id, 10),
                last_watched_at: new Date(r.timestamp).toISOString(),
                is_deleted: !!r.is_deleted,
                user_id: userId
              }));
              await api("POST", "/rest/v1/user_history", payload, {
                Authorization: `Bearer ${jwt}`,
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
              const remoteData = await api(
                "GET",
                `/rest/v1/user_history?updated_at=gt.${encodeURIComponent(
                lastSync
              )}&select=fc2_id,last_watched_at,is_deleted,updated_at&order=updated_at.asc`,
                null,
                {
                  Authorization: `Bearer ${jwt}`,
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
            if (pulledCount > 0 || dirtyRecords.length > 0) {
              GM_setValue("last_sync_ts", maxTs);
              await HistoryManager.load();
              Logger$1.success(
                "Supabase",
                `Sync complete - Pulled: ${pulledCount}, Pushed: ${dirtyRecords.length}`
              );
              if (isManual)
                Toast$1.show(
                  `Sync completed. Pulled: ${pulledCount}, Pushed: ${dirtyRecords.length}`,
                  "success"
                );
            } else if (isManual) {
              Logger$1.info("Supabase", "Already up to date");
              Toast$1.show("Already up to date.", "info");
            }
            State.proxy.syncStatus = "success";
            Logger$1.timeEnd("Supabase.sync");
            Logger$1.groupEnd();
          } catch (e) {
            Logger$1.error("Supabase", "Sync failed", e);
            State.proxy.syncStatus = "error";
            if (isManual) Toast$1.show(`Sync failed: ${e.statusText || e.message || "Network Error"}`, "error");
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
    const request = async (method, url, body = null, headers = {}) => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method,
          url,
          headers: { Authorization: getAuthHeader(), ...headers },
          data: body,
          responseType: "text",
          onload: resolve,
          onerror: reject
        });
      });
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
              resolve({ data: JSON.parse(res.responseText), etag });
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
    const runSync = async (isManual = false, forceRefresh = false) => {
      if (isSyncing) return;
      const { webdavUrl, webdavPath } = State.proxy;
      if (!webdavUrl || !webdavPath) return;
      Logger$1.group("WebDAV", "🔄 Starting WebDAV sync");
      Logger$1.time("WebDAV.sync");
      isSyncing = true;
      State.proxy.syncStatus = "syncing";
      if (isManual) Toast$1.show(t("labelSyncing"), "info");
      try {
        const remote = await fetchFull();
        const remoteData = remote?.data;
        const remoteETag = remote?.etag;
        const lastEtag = GM_getValue("webdav_last_etag");
        if (!forceRefresh && lastEtag && remoteETag && lastEtag !== remoteETag) {
          Logger$1.warn("WebDAV", "ETag conflict detected", { lastEtag, remoteETag });
          State.proxy.syncStatus = "conflict";
          if (isManual) Toast$1.show(t("alertSyncConflict"), "error");
          isSyncing = false;
          Logger$1.groupEnd();
          return;
        }
        const localRecords = await Repository.db.history.toArray();
        const finalMap = new Map();
        if (remoteData?.history) {
          remoteData.history.forEach((r) => finalMap.set(r.id, r));
        }
        localRecords.forEach((l) => {
          const r = finalMap.get(l.id);
          if (!r || l.timestamp > r.timestamp) {
            finalMap.set(l.id, { id: l.id, timestamp: l.timestamp, is_deleted: l.is_deleted });
          }
        });
        const payload = {
          version: 2,
          updated_at: ( new Date()).toISOString(),
          history: Array.from(finalMap.values())
        };
        Logger$1.info(
          "WebDAV",
          `Syncing ${payload.history.length} items (${localRecords.length} local, ${remoteData?.history?.length || 0} remote)`
        );
        const url = webdavUrl.replace(/\/$/, "") + "/" + webdavPath;
        const putHeaders = { "Content-Type": "application/json" };
        if (remoteETag) putHeaders["If-Match"] = remoteETag.includes('"') ? remoteETag : `"${remoteETag}"`;
        const res = await request("PUT", url, JSON.stringify(payload, null, 2), putHeaders);
        if (res.status >= 200 && res.status < 300) {
          const newEtag = res.responseHeaders.match(/etag:\s*(.*)/i)?.[1]?.replace(/"/g, "").trim() || remoteETag;
          if (newEtag) GM_setValue("webdav_last_etag", newEtag);
          await Repository.db.transaction("rw", Repository.db.history, async () => {
            await Repository.db.history.bulkPut(payload.history.map((h2) => ({ ...h2, sync_dirty: 0 })));
          });
          await HistoryManager.load();
          State.proxy.syncStatus = "success";
          Logger$1.success("WebDAV", `Sync complete - ${payload.history.length} items synced`);
          Logger$1.timeEnd("WebDAV.sync");
          Logger$1.groupEnd();
          if (isManual) Toast$1.show(t("alertWebDAVSyncSuccess"), "success");
        } else if (res.status === 412) {
          State.proxy.syncStatus = "conflict";
          if (isManual) Toast$1.show(t("alertSyncConflict"), "error");
        } else {
          throw new Error(`WebDAV Error: ${res.status}`);
        }
      } catch (e) {
        Logger$1.error("WebDAV", "Sync failed", e);
        State.proxy.syncStatus = "error";
        const msg = e.statusText || e.message || (e.status ? `Status ${e.status}` : "Network Error");
        if (isManual) Toast$1.show(t("alertWebDAVSyncError") + msg, "error");
        Logger$1.timeEnd("WebDAV.sync");
        Logger$1.groupEnd();
        throw e;
      } finally {
        isSyncing = false;
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
      set onProgress(val) {
        SupabaseProvider.onProgress = val;
      },
      async login(email, password) {
        return await SupabaseProvider.login(email, password);
      },
      async signup(email, password) {
        return await SupabaseProvider.signup(email, password);
      },
      logout(silent = false) {
        SupabaseProvider.logout(silent);
      },
      async testWebDAV() {
        return await WebDAVProvider.test();
      },
      requestSync: () => {
        Logger$1.info("SyncManager", "Sync requested, will execute in 2s");
        if (syncTimer) clearTimeout(syncTimer);
        syncTimer = setTimeout(() => SyncManager.performSync(), 2e3);
      },
      async performSync(isManual = false) {
        const provider = getProvider();
        if (!provider) return;
        try {
          const result = await provider.performSync(isManual);
          setTimeout(() => {
            State.proxy.syncStatus = "idle";
          }, 5e3);
          return result;
        } catch (e) {
          Logger$1.error("SyncManager", "Sync failed globally", e);
          State.proxy.syncStatus = "error";
          setTimeout(() => {
            State.proxy.syncStatus = "idle";
          }, 5e3);
        }
      },
      async forceFullSync() {
        if (!confirm(t("alertPushAllQuery"))) return;
        await Repository.db.history.toCollection().modify({ sync_dirty: 1 });
        GM_setValue("last_sync_ts", "1970-01-01T00:00:00.000Z");
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
    HISTORY_CLEARED: "history:cleared"
  };
  const HistoryManager = (() => {
    const historyCache = new Set();
    return {
      async load() {
        Logger$1.time("HistoryManager.load");
        if (!State.proxy.enableHistory) {
          historyCache.clear();
          Logger$1.warn("HistoryManager", "History disabled, cache cleared");
          return;
        }
        try {
          const ids = await Repository.history.getKeys();
          ids.forEach((id) => historyCache.add(id));
          Logger$1.success("HistoryManager", `Loaded ${ids.length} history items`);
        } catch (e) {
          Logger$1.error("HistoryManager", "Failed to load history", e);
          historyCache.clear();
        }
        Logger$1.timeEnd("HistoryManager.load");
      },
      async add(id) {
        if (!State.proxy.enableHistory || !id) return;
        historyCache.add(String(id));
        await Repository.history.add(id);
        eventBus.emit(Events.HISTORY_ADDED, id);
        Logger$1.info("HistoryManager", `Added to history: ${id}`);
        SyncManager.requestSync();
      },
      async remove(id) {
        if (!State.proxy.enableHistory || !id) return;
        historyCache.delete(String(id));
        await Repository.history.remove(id);
        eventBus.emit(Events.HISTORY_REMOVED, id);
        Logger$1.info("HistoryManager", `Removed from history: ${id}`);
        SyncManager.requestSync();
      },
      async clear() {
        const count = historyCache.size;
        historyCache.clear();
        await Repository.history.clear();
        eventBus.emit(Events.HISTORY_CLEARED, count);
        Logger$1.warn("HistoryManager", `Cleared ${count} history items`);
        SyncManager.requestSync();
      },
      has(id) {
        return State.proxy.enableHistory && historyCache.has(String(id));
      }
    };
  })();
  const tokens = `
    :root {
        --fc2-bg: #050505;
        --fc2-surface: rgba(18, 18, 20, 0.9);
        --fc2-text: #f0f0f0;
        --fc2-text-dim: #a1a1aa;
        --fc2-border: rgba(255, 255, 255, 0.1);
        --fc2-primary: #ffffff;
        --fc2-success: #4ade80;
        --fc2-danger: #f87171;
        --fc2-accent: #e4e4e7;
        --fc2-accent-grad: linear-gradient(135deg, #3f3f46, #18181b);
        --fc2-magnet-grad: linear-gradient(135deg, #52525b, #27272a);
        --fc2-radius: 16px;
        --fc2-btn-radius: 10px;
        --fc2-blur: blur(20px);
        --fc2-shadow: 0 12px 48px rgba(0, 0, 0, 0.8);
        --fc2-font: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    }
`;
  const animations = `
    /* --- Animations --- */
    @keyframes fc2-fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fc2-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes fc2-pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); } }
    @keyframes fc2-copy-success { 0% { transform: scale(1); } 50% { transform: scale(1.1); background: var(--fc2-success); } 100% { transform: scale(1); } }
    @keyframes fc2-magnet-in { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes popIn { from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
    @keyframes fc2-pulse-sync { 0% { transform: scale(0.8); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.6; } }
    @keyframes fc2-dropdown-in {
        from { opacity: 0; transform: translateY(-10px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fc2-tab-slide {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fc2-pulse-once {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); filter: brightness(1.2); }
        100% { transform: scale(1); }
    }
    .pulse-once { animation: fc2-pulse-once 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
`;
  const getBaseStyles = (C) => `
    /* --- Typography --- */
    .fc2-enh-settings-panel,
    .fc2-fab-container,
    .fc2-toast-container,
    .enh-modal-panel,
    .${C.cardRebuilt},
    .fc2-enh-settings-panel *,
    .enh-modal-panel * {
        font-family: var(--fc2-font) !important;
    }

    /* --- Core Utility --- */
    .${C.hideNoMagnet}, .${C.hideCensored}, .${C.hideViewed} { display: none !important; }

    /* --- Scrollbar --- */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

    /* --- Skeleton --- */
    .fc2-skeleton {
        background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
        background-size: 200% 100%;
        animation: fc2-shimmer 1.5s infinite linear;
        border-radius: 4px;
    }
`;
  const getComponentStyles = (C) => `
    *, ::before, ::after { box-sizing: border-box; }
    .fc2-icon { display: inline-flex; align-items: center; justify-content: center; width: 1em; height: 1em; vertical-align: -0.125em; }
    .fc2-icon svg { width: 100%; height: 100%; fill: currentColor; }

    /* --- Toast --- */
    .fc2-toast-container { position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
    .fc2-toast-item { background: var(--fc2-surface); color: #fff; padding: 10px 16px; border-radius: 8px; box-shadow: var(--fc2-shadow); display: flex; align-items: center; font-size: 13px; transform: translateX(100%); transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); opacity: 0; pointer-events: auto; backdrop-filter: blur(8px); border-left: 3px solid var(--fc2-primary); }
    .fc2-toast-item.show { transform: translateX(0); opacity: 1; }

    /* --- Elegant FAB (Unified) --- */
    .fc2-fab-container { position: fixed; bottom: 40px; right: 40px; z-index: 2000000000; display: flex; flex-direction: column-reverse; align-items: center; gap: 12px; pointer-events: none; }
    .fc2-fab-trigger, .fc2-fab-actions { pointer-events: auto; }
    .fc2-fab-trigger {
        width: 48px; height: 48px; border-radius: 50%;
        background: var(--fc2-accent-grad); color: #fff; border: none;
        box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        touch-action: none; -webkit-tap-highlight-color: transparent;
    }
    .fc2-fab-trigger:hover { transform: scale(1.1); box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3); }
    .fc2-fab-trigger.active { transform: rotate(135deg); background: #eee; color: #111; }
    .fc2-fab-trigger.active:hover { transform: scale(1.1) rotate(135deg); }

    .fc2-fab-actions {
        display: flex;
        flex-direction: column-reverse;
        gap: 12px;
        opacity: 0;
        transform: translateY(20px) scale(0.8);
        pointer-events: none;
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .fc2-fab-actions.visible { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

    .fc2-fab-btn {
        width: 40px; height: 40px; border-radius: 50%;
        background: var(--fc2-surface); color: var(--fc2-text-dim);
        border: 1px solid var(--fc2-border); backdrop-filter: var(--fc2-blur);
        display: flex; align-items: center; justify-content: center;
        font-size: 16px; cursor: pointer; transition: all 0.2s;
        box-shadow: var(--fc2-shadow); position: relative;
        -webkit-tap-highlight-color: transparent;
    }
    .fc2-fab-btn:hover { background: var(--fc2-primary); color: #111; border-color: transparent; transform: scale(1.1); }
    .fc2-fab-btn.active { background: var(--fc2-primary); color: #111; box-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
    .fc2-fab-btn::before {
        content: attr(data-title); position: absolute; right: 52px; top: 50%;
        transform: translateY(-50%) translateX(5px); background: rgba(0,0,0,0.85);
        color: #fff; padding: 5px 10px; border-radius: 6px; font-size: 12px;
        white-space: nowrap; opacity: 0; pointer-events: none; transition: all 0.2s;
        visibility: hidden; backdrop-filter: blur(4px);
    }
    .fc2-fab-btn:hover::before { opacity: 1; visibility: visible; transform: translateY(-50%) translateX(0); }

    .fc2-sync-dot {
        position: absolute; top: -2px; right: -2px; width: 10px; height: 10px;
        border-radius: 50%; border: 2px solid var(--fc2-bg);
        background: #666; transition: all 0.3s;
    }
    .fc2-sync-dot.syncing { background: #89b4fa; animation: fc2-pulse-sync 1.5s infinite; }
    .fc2-sync-dot.success { background: #a6e3a1; }
    .fc2-sync-dot.error { background: #f38ba8; }
    .fc2-sync-dot.conflict { background: #fab387; }

    /* --- Card & UI --- */
    .${C.cardRebuilt} {
        position: relative;
        border-radius: var(--fc2-radius);
        background: var(--fc2-surface);
        border: 1px solid var(--fc2-border);
        backdrop-filter: var(--fc2-blur);
        -webkit-backdrop-filter: var(--fc2-blur);
        transform: translateZ(0);
        will-change: transform;
        animation: fc2-fade-in 0.4s ease-out backwards;
    }
    .${C.cardRebuilt}.has-active-dropdown { z-index: 100 !important; }
    body.searching .${C.cardRebuilt}:not(.search-match) { display: none !important; }

    .${C.processedCard} {
        position: relative;
        border-radius: var(--fc2-radius);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        background: var(--fc2-surface);
        border: 1px solid var(--fc2-border);
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: visible;
    }
    .${C.processedCard}:hover { transform: translateY(-4px); box-shadow: var(--fc2-shadow); z-index: 5; }
    .${C.processedCard}.has-active-dropdown { z-index: 100 !important; }
    .${C.processedCard}.${C.isViewed} { border-color: var(--fc2-accent); }

    /* Detail Page Poster Style (Vertical) */
    .${C.processedCard}.is-detail { width: 100% !important; max-width: none !important; height: auto !important; }
    .${C.processedCard}.is-detail .${C.videoPreviewContainer} { aspect-ratio: auto !important; height: auto !important; background: transparent !important; }
    .${C.processedCard}.is-detail .${C.videoPreviewContainer} img { position: static !important; height: auto !important; width: 100% !important; display: block !important; }
    .${C.processedCard}.is-detail .${C.infoArea} { margin-top: 0 !important; padding: 10px 12px !important; }
    .${C.processedCard}.is-detail .${C.resourceLinksContainer} { margin-top: 0 !important; }

    .${C.videoPreviewContainer} { 
        position: relative; 
        width: 100%; 
        aspect-ratio: 16 / 9; 
        background: #0f1015; 
        overflow: hidden; 
        border-top-left-radius: var(--fc2-radius);
        border-top-right-radius: var(--fc2-radius);
    }
    .${C.videoPreviewContainer} video, .${C.videoPreviewContainer} img.${C.staticPreview} { 
        width: 100%; 
        height: 100%; 
        object-fit: contain; 
        transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; 
    }
    .${C.processedCard}:hover .${C.videoPreviewContainer} video, .${C.processedCard}:hover .${C.videoPreviewContainer} img.${C.staticPreview} { transform: scale(1.05); }
    .${C.previewElement} { position: absolute; top: 0; left: 0; transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1); opacity: 1; }
    .${C.previewElement}.${C.hidden} { opacity: 0; pointer-events: none; }

    /* --- Unified Button System --- */
    .card-top-right-controls { position: absolute; top: 8px; right: 8px; z-index: 10; display: flex; gap: 6px; align-items: center; }

    .${C.resourceBtn}, .card-top-right-controls > *, .verify-cf-btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: var(--fc2-btn-radius);
        background: rgba(0, 0, 0, 0.25);
        color: rgba(255, 255, 255, 0.9);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-size: 13px;
        font-weight: 500;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }
    .${C.resourceBtn} *, .fc2-fab-btn *, .fc2-fab-trigger *, .close-btn *, .verify-cf-btn * { pointer-events: none !important; }
    .${C.resourceBtn}:hover, .card-top-right-controls > *:hover {
        background: var(--fc2-magnet-grad);
        color: #fff;
        border-color: transparent;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255,255,255,0.1);
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

    /* Size Classes */
    .card-top-right-controls > * { height: 26px; padding: 0 8px; font-size: 11px; }
    .${C.resourceBtn} { height: 32px; padding: 0 12px; }

    /* Specialized Buttons */
    .${C.resourceBtn}.${C.btnMagnet} {
        /* Inherits glass style from .resourceBtn, just override specific animations if needed */
        font-weight: 600;
        border: 1px solid rgba(255, 255, 255, 0.15); /* Re-apply border as previous rule set it to none */
        background: rgba(0, 0, 0, 0.25); /* Reset to glass */
        animation: fc2-magnet-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .${C.resourceBtn}.${C.btnMagnet}:hover {
        background: var(--fc2-magnet-grad);
        color: #fff;
        border-color: transparent;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255,255,255,0.1);
    }

    .btn-toggle-view.is-viewed { color: var(--fc2-primary); border-color: var(--fc2-primary); }
    .btn-toggle-view .icon-viewed { display: none; }
    .btn-toggle-view.is-viewed .icon-viewed { display: inline-block; }
    .btn-toggle-view.is-viewed .icon-unviewed { display: none; }

    .btn-actress {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 4px auto;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(0, 0, 0, 0.25);
        padding: 4px 12px;
        border-radius: var(--fc2-btn-radius);
        line-height: normal;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
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
        font-weight: 700 !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        backdrop-filter: var(--fc2-blur) !important;
        -webkit-backdrop-filter: var(--fc2-blur) !important;
        letter-spacing: 0.5px;
    }
    .${C.fc2IdBadge}.${C.badgeCopied} {
        background: var(--fc2-success) !important;
        color: #111 !important;
        border-color: var(--fc2-success);
        animation: fc2-copy-success 0.4s ease;
    }

    .${C.infoArea} {
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        flex-grow: 1;
        border-top: 1px solid var(--fc2-border);
        border-bottom-left-radius: var(--fc2-radius);
        border-bottom-right-radius: var(--fc2-radius);
    }
    .${C.customTitle} {
        color: var(--fc2-text) !important;
        font-size: 13px;
        font-weight: 600 !important;
        line-height: 1.5;
        margin: 0 0 10px;
        height: 38px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-decoration: none !important;
        text-shadow: none;
        transition: color 0.2s;
    }
    .${C.customTitle}:hover { color: var(--fc2-primary) !important; text-decoration: none !important; }
    .${C.resourceLinksContainer} { display: flex; gap: 8px; align-items: center; margin-top: auto; justify-content: flex-end; }

    /* --- Link Dropdown --- */
    .enh-dropdown { position: relative; display: inline-flex; }
    .enh-dropdown-content {
        display: none;
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        padding: 8px;
        flex-direction: column;
        gap: 6px;
        z-index: 1000;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
        min-width: 140px;
        animation: fc2-dropdown-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .enh-dropdown.active .enh-dropdown-content { display: flex; }
    .enh-dropdown-content .resource-btn { width: 100%; justify-content: flex-start; padding: 0 10px; height: 36px; }
    .enh-dropdown-content .resource-btn .${C.buttonText} { display: inline-block; margin-left: 8px; }
    .enh-dropdown-content .resource-btn .${C.tooltip} { display: none !important; }

    .${C.buttonText} { display: none; }

    .${C.resourceBtn}.${C.btnLoading} {
        cursor: wait;
        border-color: var(--fc2-primary);
        opacity: 0.7;
    }
    .${C.resourceBtn}.${C.btnLoading} .fc2-icon { animation: spin 1s linear infinite; }

    .${C.resourceBtn} .${C.tooltip} { position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%) scale(0.9); background: rgba(0, 0, 0, 0.85); color: #fff; padding: 5px 8px; border-radius: 6px; font-size: 11px; white-space: nowrap; opacity: 0; visibility: hidden; transition: opacity 0.2s; pointer-events: none; z-index: 1000; backdrop-filter: blur(4px); }
    .${C.resourceBtn}:hover .${C.tooltip} { opacity: 1; visibility: visible; transform: translateX(-50%) scale(1); }
    .${C.cardRebuilt}.${C.hideNoMagnet}, .${C.cardRebuilt}.${C.isCensored}.${C.hideCensored}, .${C.cardRebuilt}.${C.isViewed}.${C.hideViewed} { display: none !important; }

    /* --- Detail Toolbar --- */
    .enh-toolbar {
        margin: 15px 0 !important; padding: 0 !important;
        height: 52px !important; min-height: 52px !important;
        background: var(--fc2-surface) !important;
        backdrop-filter: var(--fc2-blur) !important;
        -webkit-backdrop-filter: var(--fc2-blur) !important;
        border: 1px solid var(--fc2-border) !important;
        border-radius: var(--fc2-radius) !important;
        box-shadow: var(--fc2-shadow);
        width: 100% !important;
        display: flex !important; align-items: center !important;
        overflow: visible !important;
    }
    .enh-toolbar .info-area {
        display: grid !important;
        grid-template-columns: 1fr auto 1fr !important;
        width: 100% !important; height: 100% !important;
        align-items: center !important;
        padding: 0 12px !important; margin: 0 !important; background: transparent !important;
        border: none !important;
        overflow: visible !important;
    }
    .enh-toolbar .card-top-right-controls {
        position: static !important;
        display: flex !important; justify-content: flex-start !important;
        gap: 6px !important;
    }
    .enh-toolbar .btn-actress {
        grid-column: 2 !important; justify-self: center !important;
        margin: 0 !important;
    }
    .enh-toolbar .resource-links-container {
        grid-column: 3 !important; justify-self: flex-end !important;
        margin: 0 !important; display: flex !important; gap: 6px !important;
        align-items: center !important;
        overflow: visible !important;
    }
    .enh-toolbar .resource-links-container .resource-btn .button-text { display: none !important; }
    .enh-toolbar .resource-links-container .resource-btn {
        width: 34px !important;
        padding: 0 !important;
        flex-shrink: 0 !important;
        justify-content: center !important;
    }
    /* 工具栏中的下拉菜单特殊处理 */
    .enh-toolbar .enh-dropdown { position: static !important; }
    .enh-toolbar .enh-dropdown-trigger { width: 34px !important; }
    .enh-toolbar .enh-dropdown-content {
        position: fixed !important;
        top: auto !important;
        right: auto !important;
        transform: translateY(8px);
    }
    /* 下拉菜单内的按钮需要显示文字 */
    .enh-toolbar .enh-dropdown-content .resource-btn {
        width: 100% !important;
        justify-content: flex-start !important;
        padding: 0 10px !important;
    }
    .enh-toolbar .enh-dropdown-content .resource-btn .button-text {
        display: inline-block !important;
    }
    .enh-toolbar .resource-btn, .enh-toolbar .card-top-right-controls > * {
        height: 34px !important;
        padding: 0 15px !important;
        font-size: 13px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        line-height: normal !important;
    }

    /* Settings Panel Refined */
    .enh-modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); z-index: 2147483640; transition: all 0.3s; }
    .enh-modal-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(26, 27, 38, 0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); color: #a9b1d6; border-radius: 16px; box-shadow: 0 40px 80px rgba(0,0,0,0.6); border: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; z-index: 2147483647; animation: popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; }
    
    .fc2-enh-settings-panel { width: min(95%, 700px); max-height: 85vh; display: flex; flex-direction: column; }
    .fc2-enh-settings-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); }
    .fc2-enh-settings-header h2 { font-size: 1.25rem; margin: 0; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
    .close-btn { background: none; border: none; color: #565f89; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; }
    .close-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
    
    .fc2-enh-settings-tabs { display: flex; padding: 0 1rem; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.05); }
    .fc2-enh-tab-btn { background: none; border: none; color: #565f89; padding: 1rem 1.5rem; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 500; transition: all 0.2s; border-bottom: 2px solid transparent; font-size: 0.95rem; }
    .fc2-enh-tab-btn .fc2-icon { font-size: 1rem; }
    .fc2-enh-tab-btn:hover { color: #cfc9c2; background: rgba(255,255,255,0.02); }
    .fc2-enh-tab-btn.active { color: var(--fc2-primary); border-bottom-color: var(--fc2-primary); background: rgba(122,162,247,0.05); }
    
    .fc2-enh-settings-content { position: relative; padding: 2rem; overflow-y: auto; flex-grow: 1; background: transparent; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
    .fc2-enh-settings-content::-webkit-scrollbar { width: 6px; }
    .fc2-enh-settings-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    
    .fc2-tab-content-wrapper { animation: fc2-tab-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

    .fc2-enh-settings-group { margin-bottom: 2.5rem; }
    .fc2-enh-settings-group h3 { margin-top: 0; margin-bottom: 1.25rem; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #565f89; display: flex; align-items: center; border-bottom: none; }
    
    .fc2-enh-form-row { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; }
    .fc2-enh-form-row.checkbox { flex-direction: row; align-items: center; gap: 0; cursor: pointer; padding: 4px 0; }
    .fc2-enh-form-row label { font-size: 0.95rem; color: #cfc9c2; display: flex; align-items: center; cursor: inherit; }
    
    .fc2-enh-form-row select, 
    .fc2-enh-form-row input[type="text"], 
    .fc2-enh-form-row input[type="password"] { 
        width: 100%; background: #16161e; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 0.7rem 1rem; color: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-size: 0.9rem;
    }
    .fc2-enh-form-row select:focus, 
    .fc2-enh-form-row input:focus { border-color: var(--fc2-primary); box-shadow: 0 0 0 2px rgba(122,162,247,0.2); }
    
    input[type="checkbox"] { 
        appearance: none; -webkit-appearance: none; width: 1.2rem; height: 1.2rem; background: #16161e; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; margin-right: 0.8rem; cursor: pointer; position: relative; transition: all 0.2s; 
    }
    input[type="checkbox"]:checked { background: var(--fc2-primary); border-color: var(--fc2-primary); }
    input[type="checkbox"]:checked::after { content: "✔"; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: #111; font-size: 0.8rem; font-weight: bold; }
    
    .fc2-enh-settings-footer { padding: 1rem 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: flex-end; gap: 0.75rem; background: rgba(0, 0, 0, 0.2); }
    .fc2-enh-btn { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.08); color: #cfc9c2; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 500; font-size: 0.9rem; transition: all 0.2s; }
    .fc2-enh-btn:hover { background: rgba(255, 255, 255, 0.08); color: #fff; border-color: rgba(255,255,255,0.15); }
    .fc2-enh-btn.primary { background: var(--fc2-primary); border: none; color: #111; font-weight: 600; }
    .fc2-enh-btn.primary:hover { background: #89b4fa; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(122,162,247,0.3); }
    .fc2-enh-btn.danger { border-color: rgba(243, 139, 168, 0.2); color: #f38ba8; }
    .fc2-enh-btn.danger:hover { background: rgba(243, 139, 168, 0.1); border-color: #f38ba8; }

    /* Gallery Modal */
    .enh-gallery-panel { width: 95vw; height: 90vh; max-width: 1200px; padding: 0; }
    .enh-gallery-content { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
    .enh-gallery-header { padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .enh-gallery-body { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-content: flex-start; }
    .enh-gallery-body img, .enh-gallery-body video { max-width: calc(33% - 10px); height: auto; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.2s; cursor: pointer; }
    .enh-gallery-body img:hover { transform: scale(1.02); }

    /* Large Viewer */
    .enh-viewer-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.95); z-index: 10000; display: flex; flex-direction: column; animation: fc2-fade-in 0.2s ease; }
    .enh-viewer-stage { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .enh-viewer-stage img, .enh-viewer-stage video { width: 100%; height: 100%; max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 0 40px rgba(0,0,0,0.5); border-radius: 4px; }
    .enh-viewer-nav { position: absolute; top: 0; bottom: 0; width: 15%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,0.3); font-size: 50px; transition: all 0.2s; user-select: none; z-index: 10001; }
    .enh-viewer-nav:hover { background: rgba(255,255,255,0.05); color: #fff; }
    .enh-viewer-nav.prev { left: 0; }
    .enh-viewer-nav.next { right: 0; }
    .enh-viewer-close { position: absolute; top: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 30px; cursor: pointer; z-index: 10002; transition: all 0.2s; }
    .enh-viewer-close:hover { background: rgba(255,255,255,0.2); transform: rotate(90deg); }
    .enh-viewer-counter { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 14px; backdrop-filter: blur(10px); z-index: 10002; }

    @keyframes fc2-toast-shrink {
        from { width: 100%; }
        to { width: 0%; }
    }
`;
  const getMobileStyles = (C) => `
    /* --- Mobile Touch Optimizations --- */
    @media (max-width: 768px) {
        * {
            /* Prevent double-tap zoom on mobile */
            touch-action: manipulation;
        }
        
        /* Smooth scrolling on mobile */
        body {
            -webkit-overflow-scrolling: touch;
        }
        
        /* Ensure buttons have adequate touch targets (44x44px minimum) */
        button, a, .${C.resourceBtn}, .card-top-right-controls > * {
            min-height: 44px;
            min-width: 44px;
        }
        
        /* Improve touch feedback */
        .${C.resourceBtn}:active,
        .card-top-right-controls > *:active,
        .fc2-fab-btn:active,
        .fc2-fab-trigger:active {
            opacity: 0.7;
            transform: scale(0.95);
        }
        
        /* Performance optimizations */
        .${C.processedCard},
        .${C.cardRebuilt},
        .${C.resourceBtn},
        .fc2-fab-btn,
        .fc2-fab-trigger {
            /* Enable hardware acceleration */
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            will-change: transform;
        }
        
        /* Disable hover effects on touch devices to prevent sticky hover */
        @media (hover: none) {
            .${C.resourceBtn}:hover,
            .card-top-right-controls > *:hover,
            .fc2-fab-btn:hover,
            .fc2-fab-trigger:hover,
            .${C.processedCard}:hover {
                transform: none;
                box-shadow: none;
            }
        }
        
        /* Reduce animations for better performance */
        * {
            animation-duration: 0.2s !important;
            transition-duration: 0.2s !important;
        }

        /* Settings Panel */
        .fc2-enh-settings-panel { 
            width: 95% !important; 
            max-height: 90vh !important; 
            max-height: 90svh !important; 
            border-radius: 16px !important; 
        }
        .fc2-enh-settings-content { padding: 1rem !important; }
        .fc2-enh-settings-tabs { flex-wrap: wrap !important; }
        .fc2-enh-tab-btn { padding: 0.75rem 1rem !important; flex: 1; justify-content: center; }
        
        /* Data tab buttons wrap */
        .fc2-enh-form-row { flex-wrap: wrap !important; }
        
        /* Global resets for mobile width */
        html, body {
            overflow-x: hidden !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        *, ::before, ::after {
            box-sizing: border-box !important;
        }

        /* List Layout - Force single column and full width */
        div.grid, div.posts, div.flex-wrap, .movie-list, .work-list, .tile-images { 
            grid-template-columns: 1fr !important; 
            display: grid !important; 
            gap: 12px !important; 
            padding: 10px !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            margin: 0 !important;
        }

        /* Target common site wrapper classes */
        .container, .main-content, #main, #content {
            width: 100% !important;
            max-width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }
        
        /* Card Container */
        .${C.cardRebuilt} {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
        }
        
        /* Larger Touch Targets */
        .card-top-right-controls { 
            top: 12px !important; 
            right: 12px !important; 
            gap: 10px !important; 
        }
        .card-top-right-controls > * { 
            height: 36px !important; 
            min-width: 36px !important; 
            padding: 0 12px !important; 
            font-size: 14px !important; 
        }
        .${C.resourceBtn} { 
            height: 44px !important; 
            padding: 0 16px !important; 
            font-size: 14px !important; 
        }
        .btn-actress { 
            padding: 8px 16px !important; 
            font-size: 15px !important; 
            width: 90% !important; 
            margin: 8px auto !important; 
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
        
        /* Toolbar Optimization */
        .enh-toolbar { 
            height: auto !important; 
            min-height: 60px !important; 
            border-radius: 12px !important; 
            margin: 10px 0 !important; 
        }
        .enh-toolbar .info-area { 
            display: flex !important; 
            flex-direction: column !important; 
            height: auto !important; 
            padding: 12px !important; 
            gap: 12px !important;
            grid-template-columns: 1fr !important;
        }
        .enh-toolbar .card-top-right-controls,
        .enh-toolbar .btn-actress,
        .enh-toolbar .resource-links-container { 
            width: 100% !important; 
            justify-content: center !important; 
            grid-column: auto !important;
            margin: 0 !important;
        }
        .enh-toolbar .resource-links-container { 
            flex-wrap: wrap !important; 
            gap: 10px !important; 
        }
        .enh-toolbar .resource-links-container .resource-btn { 
            width: auto !important; 
            flex: 1 !important; 
            min-width: 80px !important; 
        }
        
        /* Dropdown Menu */
        .enh-dropdown-content {
            min-width: 160px !important;
            max-width: 90vw !important;
        }
        .enh-dropdown-content .resource-btn {
            height: 44px !important;
            font-size: 14px !important;
        }
        
        /* Gallery Mobile */
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
        
        /* Modal Panels */
        .enh-modal-panel {
            width: 95% !important;
            max-width: 95% !important;
            max-height: 90vh !important;
        }
        
        /* FAB Container - safely above bottom bar */
        .fc2-fab-container {
            bottom: 80px !important;
            right: 20px !important;
        }
    }
`;
  const enhancementStyles = `
    /* ===== 微交互动画 ===== */
    
    /* 按钮悬浮效果 */
    .resource-btn,
    .fc2-fab-btn,
    .fc2-enh-btn {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .resource-btn:hover,
    .fc2-fab-btn:hover,
    .fc2-enh-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
    }
    
    .resource-btn:active,
    .fc2-fab-btn:active,
    .fc2-enh-btn:active {
        transform: translateY(0);
        transition-duration: 0.1s;
    }
    
    /* 卡片悬浮效果 */
    .processed-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .processed-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    
    /* ===== 加载动画 ===== */
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
    }
    
    /* 脉冲环动画 */
    @keyframes pulse-ring {
        0% {
            transform: scale(0.8);
            opacity: 1;
        }
        100% {
            transform: scale(1.2);
            opacity: 0;
        }
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
        animation: pulse-ring 1.5s ease-out infinite;
    }
    
    /* ===== 骨架屏 ===== */
    
    .skeleton-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
    }
    
    .skeleton-card {
        background: var(--fc2-surface);
        border-radius: var(--fc2-radius);
        overflow: hidden;
        padding: 16px;
    }
    
    .skeleton-image {
        width: 100%;
        height: 150px;
        background: linear-gradient(
            90deg,
            rgba(255,255,255,0.05) 0%,
            rgba(255,255,255,0.1) 50%,
            rgba(255,255,255,0.05) 100%
        );
        background-size: 1000px 100%;
        animation: shimmer 2s infinite;
        border-radius: calc(var(--fc2-radius) / 2);
        margin-bottom: 12px;
    }
    
    .skeleton-text {
        height: 16px;
        background: linear-gradient(
            90deg,
            rgba(255,255,255,0.05) 0%,
            rgba(255,255,255,0.1) 50%,
            rgba(255,255,255,0.05) 100%
        );
        background-size: 1000px 100%;
        animation: shimmer 2s infinite;
        border-radius: 4px;
        margin-bottom: 8px;
    }
    
    .skeleton-text.short {
        width: 60%;
    }
    
    /* ===== 进度条 ===== */
    
    .progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        overflow: hidden;
        position: relative;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(
            90deg,
            var(--fc2-primary) 0%,
            var(--fc2-accent) 100%
        );
        transition: width 0.3s ease;
        position: relative;
    }
    
    .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.3) 50%,
            transparent 100%
        );
        animation: shimmer 2s infinite;
    }
    
    /* ===== 智能提示 ===== */
    
    .smart-tooltip {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        letter-spacing: 0.3px;
    }
    
    .smart-tooltip::before {
        content: '';
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-bottom-color: rgba(0, 0, 0, 0.9);
    }
    
    /* ===== 上下文菜单 ===== */
    
    .context-menu {
        animation: fadeInScale 0.2s ease-out;
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .context-menu-item {
        transition: all 0.2s;
        border-radius: 4px;
    }
    
    .context-menu-item:hover {
        background: var(--fc2-hover);
        transform: translateX(4px);
    }
    
    /* ===== 预览加载状态 ===== */
    
    .preview-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    
    .preview-spinner {
        animation: spin 0.8s linear infinite;
    }
    
    .preview-progress {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 500;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    
    .preview-error {
        animation: shake 0.5s;
    }
    
    @keyframes shake {
        0%, 100% { transform: translate(-50%, -50%) translateX(0); }
        25% { transform: translate(-50%, -50%) translateX(-10px); }
        75% { transform: translate(-50%, -50%) translateX(10px); }
    }
    
    /* ===== 同步状态指示 ===== */
    
    .fc2-sync-dot {
        position: relative;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--sync-color, #10b981);
        transition: all 0.3s;
    }
    
    .fc2-sync-dot.syncing {
        --sync-color: #3b82f6;
        animation: pulse 1.5s infinite;
    }
    
    .fc2-sync-dot.error {
        --sync-color: #ef4444;
    }
    
    .fc2-sync-dot.success {
        --sync-color: #10b981;
    }
    
    /* 同步进度环 */
    .fc2-sync-dot::before {
        content: '';
        position: absolute;
        inset: -4px;
        border: 2px solid var(--sync-color);
        border-radius: 50%;
        opacity: 0;
    }
    
    .fc2-sync-dot.syncing::before {
        opacity: 1;
        animation: pulse-ring 1.5s ease-out infinite;
    }
    
    /* ===== 淡入淡出动画 ===== */
    
    .fade-in {
        animation: fadeIn 0.3s ease-out;
    }
    
    .fade-out {
        animation: fadeOut 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    /* ===== 滑动动画 ===== */
    
    .slide-in-up {
        animation: slideInUp 0.3s ease-out;
    }
    
    .slide-out-down {
        animation: slideOutDown 0.3s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
    
    /* ===== 响应式优化 ===== */
    
    @media (max-width: 768px) {
        /* 移动端禁用悬浮效果 */
        .resource-btn:hover,
        .fc2-fab-btn:hover,
        .fc2-enh-btn:hover,
        .processed-card:hover {
            transform: none;
            box-shadow: none;
        }
        
        /* 移动端优化骨架屏 */
        .skeleton-container {
            grid-template-columns: 1fr;
        }
        
        /* 移动端上下文菜单 */
        .context-menu {
            bottom: 20px;
            left: 50% !important;
            top: auto !important;
            transform: translateX(-50%);
            width: 90%;
            max-width: 300px;
        }
    }
    
    /* ===== 性能优化 ===== */
    
    .no-magnet {
        filter: grayscale(0.8) opacity(0.5);
        transition: all 0.5s ease;
    }
    
    .no-magnet:hover {
        filter: grayscale(0.4) opacity(0.8);
    }
    
    /* 使用GPU加速 */
    .resource-btn,
    .fc2-fab-btn,
    .processed-card,
    .smart-tooltip,
    .context-menu {
        will-change: transform;
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
    }
    
    /* 减少重绘 */
    .preview-loading,
    .skeleton-card,
    .progress-bar {
        contain: layout style paint;
    }

    @keyframes fc2-toast-shrink {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
    }

    .pulse-once {
        animation: fc2-pulse-once 0.4s ease-out;
    }

    @keyframes fc2-pulse-once {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); background: var(--fc2-primary); color: #111; }
        100% { transform: scale(1); }
    }
`;
  const getConsolidatedCss = () => {
    const C = Config.CLASSES;
    const performanceFix = location.hostname.includes("missav") || location.hostname.includes("supjav") ? `
        .${C.processedCard}:nth-child(n+51) { content-visibility: auto; contain-intrinsic-size: 320px 280px; }
    ` : "";
    return `
        ${tokens}
        ${animations}
        ${getBaseStyles(C)}
        ${getComponentStyles(C)}
        ${performanceFix}
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
      },
      getCss
    };
  })();
  const GridManager = (() => {
    let styleEl;
    return {
      apply(cols) {
        const hn = location.hostname;
        if (hn === "missav.ws") {
          const path = location.pathname;
          if (/\/(cn\/|en\/|ja\/)?(fc2-ppv-|[a-z]{2,5}-)\d+/i.test(path)) return;
          if (path === "/" || /^\/([a-z]{2}(\/|$))?/.test(path) || path.includes("/dm")) {
            if (!path.includes("/search") && !path.includes("/new") && !path.includes("/release")) return;
          }
        }
        if (!styleEl) {
          styleEl = document.createElement("style");
          document.head.appendChild(styleEl);
        }
        const sel = hn.includes("fc2ppvdb.com") ? { cont: ".flex.flex-wrap.-m-4.py-4", card: `> .${Config.CLASSES.cardRebuilt}` } : hn.includes("fd2ppv.cc") ? {
          cont: ".flex.flex-wrap, .work-list, .container .grid, .other-works-grid",
          card: `> .${Config.CLASSES.cardRebuilt}`
        } : hn.includes("supjav.com") ? { cont: ".posts.clearfix:not(:has(.swiper-wrapper))", card: `> .${Config.CLASSES.cardRebuilt}` } : hn.includes("missav.ws") ? { cont: 'div.grid[class*="grid-cols-"]', card: `> .${Config.CLASSES.cardRebuilt}` } : hn.includes("javdb") ? { cont: ".movie-list, .tile-images.tile-small", card: `> .${Config.CLASSES.cardRebuilt}` } : null;
        if (!sel || cols <= 0) {
          styleEl.innerHTML = "";
          return;
        }
        const cardCss = sel.card ? `${sel.cont} ${sel.card} { padding: 0 !important; margin: 0 !important; width: 100% !important; box-sizing: border-box !important; }` : "";
        styleEl.innerHTML = `${sel.cont} { display: grid !important; grid-template-columns: repeat(${cols === 2 ? 2 : 1}, 1fr) !important; gap: 1rem !important; margin: 0 !important; padding: 1rem 10px !important; width: 100% !important; max-width: none !important; box-sizing: border-box !important; } ${cardCss} ${sel.cont} .inner { padding: 0 !important; } @media (min-width: 768px) { ${sel.cont} { grid-template-columns: repeat(${cols}, 1fr) !important; padding: 1rem 0 !important; } }`;
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
        const iconContainer = btn.querySelector(".fc2-icon");
        if (!iconContainer) return;
        const originalSvg = iconContainer.innerHTML;
        iconContainer.innerHTML = IconSpinner;
        btn.classList.add(Config.CLASSES.btnLoading);
        const res = await ScraperService.fetchExtraPreviews(id);
        iconContainer.innerHTML = originalSvg;
        btn.classList.remove(Config.CLASSES.btnLoading);
        if (res?.length) openGallery(id, res);
        else Toast$1.show(t("alertNoPreview"), "info");
      });
      previewBtn.classList.add("btn-gallery");
      cont.appendChild(previewBtn);
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
      const links = cont.querySelector(`.${Config.CLASSES.resourceLinksContainer}`);
      if (links) cont.insertBefore(actBtn, links);
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
        const isViewed = HistoryManager.has(id);
        const vBtn = h(
          "a",
          {
            href: "javascript:;",
            className: `resource-btn btn-toggle-view ${isViewed ? "is-viewed" : ""}`,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              const c = vBtn.closest(`.${C.processedCard}`), oc = c?.closest(`.${C.cardRebuilt}`);
              if (!c) return;
              const newState = !c.classList.contains(C.isViewed);
              if (newState) HistoryManager.add(id);
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
            const isInToolbar = dropdown.closest(".enh-toolbar");
            if (isInToolbar) {
              const rect = trigger.getBoundingClientRect();
              dropdownContent.style.right = `${window.innerWidth - rect.right}px`;
              dropdownContent.style.left = "auto";
              dropdownContent.style.top = `${rect.bottom + 8}px`;
            }
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
          info.appendChild(UIButtons.btn("", actress, "javascript:void(0);", (e) => {
            e.preventDefault();
            e.stopPropagation();
            UIUtils.copyButtonBehavior(e.currentTarget, actress, t("tooltipCopied"));
          }));
        }
      }
      info.appendChild(links);
      const card = h(
        "div",
        {
          className: `${C.processedCard} ${type}-card ${customClass || ""}`,
          dataset: { id, type, previewSlug: previewSlug || "" }
        },
        previewLink,
        info
      );
      if (preservedIconsHTML && preservedIconsHTML.includes("color_free0")) card.classList.add(C.isCensored);
      if (State.proxy.enableHistory && HistoryManager.has(id)) card.classList.add(C.isViewed);
      return { finalElement: card, linksContainer: links, newCard: card };
    }
  };
  const UIToolbar = {
    createDetailToolbar: (data, markViewed, addPreviewButton) => {
      const { id, type, title, actress, previewSlug } = data;
      const { finalElement, linksContainer } = UICard.createEnhancedCard({
        id,
        type,
        title,
        articleUrl: location.href,
        primaryImageUrl: type === "fc2" ? `https://wumaobi.com/fc2daily/data/FC2-PPV-${id}/cover.jpg` : void 0,
        actress,
        previewSlug
      }, markViewed);
      finalElement.classList.add("enh-toolbar");
      const preview = finalElement.querySelector(`.${Config.CLASSES.videoPreviewContainer}`);
      const ctrls = finalElement.querySelector(".card-top-right-controls");
      const infoArea = finalElement.querySelector(`.${Config.CLASSES.infoArea}`);
      if (preview && ctrls && infoArea) {
        infoArea.prepend(ctrls);
        preview.remove();
      }
      if (actress && infoArea) UIButtons.addActressButton(infoArea, actress);
      infoArea?.querySelector(`.${Config.CLASSES.customTitle}`)?.remove();
      ScraperService.fetchMagnets([{ id, type }], async (_, url) => {
        await CacheManager.set(id, url);
        if (url) UIButtons.addMagnetButton(linksContainer, url);
      });
      if (type === "fc2" && linksContainer) addPreviewButton(linksContainer, id);
      return finalElement;
    }
  };
  const UIBuilder = {
    createElement: UIUtils.h,
    markViewed: (id, el) => UIUtils.markViewed(id, el, UIUtils.applyHistoryVisibility),
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
    maxCacheSize: 10,
preloadQueue: new Set(),
    isPreloading: false,
_loadVideoProgressive(card) {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const cont = card.querySelector(`.${Config.CLASSES.videoPreviewContainer}`);
      const img = cont?.querySelector(`img.${Config.CLASSES.staticPreview}`);
      if (!cont || !img || cont.querySelector("video")) return;
      const { id, type, previewSlug } = card.dataset;
      const url = this._getPreviewUrl(id, type, previewSlug);
      this._showLoadingIndicator(cont);
      const video = this._createVideoElement(url);
      cont.appendChild(video);
      let isStillHovered = true;
      if (isTouch) {
        this._cachePreview(id, video);
      } else {
        const cleanup = () => {
          isStillHovered = false;
          if (video.isConnected) {
            video.pause();
            video.remove();
          }
          img.classList.remove(Config.CLASSES.hidden);
          this._hideLoadingIndicator(cont);
        };
        card.addEventListener("mouseleave", cleanup, { once: true });
      }
      this._attachLoadingEventsWithCheck(video, cont, img, () => isStillHovered);
      Logger$1.log("PreviewManager", `Loading preview for ${id}`);
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
_attachLoadingEventsWithCheck(video, cont, img, checkHover) {
      video.addEventListener("progress", () => {
        if (video.buffered.length > 0 && checkHover()) {
          const percent = video.buffered.end(0) / video.duration * 100;
          this._updateLoadingProgress(cont, percent);
        }
      });
      video.addEventListener("playing", () => {
        if (!checkHover()) {
          video.pause();
          video.remove();
          return;
        }
        requestAnimationFrame(() => {
          if (checkHover()) {
            video.classList.remove(Config.CLASSES.hidden);
            img.classList.add(Config.CLASSES.hidden);
            this._hideLoadingIndicator(cont);
          } else {
            video.pause();
            video.remove();
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
      Logger$1.log("PreviewManager", `Preloading ${id}`);
    },
_cachePreview(id, element) {
      if (this.cache.size >= this.maxCacheSize) {
        const oldest = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
        if (oldest) {
          this.cache.delete(oldest[0]);
        }
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
  const EnhancedMagnetManager = {
queue: new Map(),
activeSearches: new Set(),
maxConcurrency: 4,
onProgress: null,
flushTimer: null,
async fetchMagnet(id, type) {
      const cached = await CacheManager.get(id);
      if (cached) return cached;
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
        this.queue.set(id, {
          id,
          type: type || "fc2",
          resolve,
          retryCount: 0,
          status: "pending",
          startTime: Date.now()
        });
        this._requestProcess();
      });
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
            this._onTaskFailed(task);
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
      this._notifyUI(task.id, "found");
    },
_onTaskFailed(task) {
      const maxRetries = 2;
      if (task.retryCount < maxRetries) {
        task.retryCount++;
        task.status = "pending";
        task.startTime = Date.now() + Math.pow(2, task.retryCount) * 1e3;
        Logger$1.warn("MagnetManager", `Retrying ${task.id} (${task.retryCount}/${maxRetries})`);
      } else {
        task.status = "failed";
        task.resolve(null);
        this.queue.delete(task.id);
        this._notifyUI(task.id, "failed");
      }
      this._updateStatus();
    },
_notifyUI(id, status) {
      const cards = document.querySelectorAll(`[data-id="${id}"]`);
      cards.forEach((card) => {
        const container = card.querySelector(`.${Config.CLASSES.resourceLinksContainer}`);
        if (container) {
          if (status === "failed") {
            card.classList.add("no-magnet");
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
        if (this.queue.size < 12) {
          this.fetchMagnet(id, type);
        }
      }
    },
init() {
      Logger$1.info("MagnetManager", "Enhanced Magnet Manager Initialized");
    }
  };
  const MagnetManager = EnhancedMagnetManager;
  class SiteEngine {
    constructor(config) {
      this.config = config;
    }
async processCard(card) {
      const startTime = performance.now();
      try {
        if (card.hasAttribute("data-enh-processed") || !this.config.list) return null;
        const list = this.config.list;
        let data = list.extractor(card);
        if (data instanceof Promise) data = await data;
        if (!data) {
          card.removeAttribute("data-enh-rebuilding");
          return null;
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
        if (newCard.classList.contains(Config.CLASSES.isCensored)) card.classList.add(Config.CLASSES.isCensored);
        if (newCard.classList.contains(Config.CLASSES.isViewed)) card.classList.add(Config.CLASSES.isViewed);
        UIBuilder.applyCensoredFilter(card);
        UIBuilder.applyHistoryVisibility(card);
        await this.handleMagnet(data.id, data.type, linksContainer);
        const duration = performance.now() - startTime;
        if (duration > 100) {
          console.log(`[FC2 Enhanced] processCard took ${duration.toFixed(2)}ms`);
        }
        return null;
      } catch (error) {
        console.error("[FC2 Enhanced] processCard failed:", error);
        return null;
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
      UIBuilder.toggleLoading(container, true);
      try {
        const url = await MagnetManager.fetchMagnet(id, type);
        UIBuilder.toggleLoading(container, false);
        if (url) {
          UIBuilder.addMagnetButton(container, url);
        }
        UIBuilder.applyCardVisibility(container.closest(`.${Config.CLASSES.cardRebuilt}`), !!url);
      } catch (_e) {
        UIBuilder.toggleLoading(container, false);
      }
    }
    init() {
      PreviewManager.init(document.body, `.${Config.CLASSES.processedCard}`);
      if (this.config.list) {
        const list = this.config.list;
        const processCards = (nodes) => {
          nodes.forEach((c) => {
            if (list.containerSelector && !c.closest(list.containerSelector)) return;
            if (!c.classList.contains(Config.CLASSES.cardRebuilt)) {
              c.setAttribute("data-enh-rebuilding", "true");
              this.processCard(c);
            }
          });
        };
        processCards(Array.from(document.querySelectorAll(list.cardSelector)));
        const globalObs = new MutationObserver((muts) => {
          const added = [];
          for (const m of muts) {
            Array.from(m.addedNodes).forEach((n) => {
              if (n.nodeType !== 1) return;
              const el = n;
              if (el.matches(list.cardSelector)) added.push(el);
              else el.querySelectorAll(list.cardSelector).forEach((c) => added.push(c));
            });
          }
          if (added.length) processCards(added);
        });
        globalObs.observe(document.body, { childList: true, subtree: true });
      }
      if (this.config.detail) {
        const detail = this.config.detail;
        const obs = new MutationObserver(() => {
          const target = document.querySelector(detail.triggerSelector || detail.mainImageSelector || "");
          if (target && !target.hasAttribute("data-enh-processed")) {
            target.setAttribute("data-enh-processed", "true");
            if (detail.customDetailAction) {
              Promise.resolve(detail.customDetailAction(target, obs)).catch((err) => {
                console.error("[FC2 Enhanced] Detail action failed:", err);
                target.removeAttribute("data-enh-processed");
              });
            }
          }
        });
        obs.observe(document.body, { childList: true, subtree: true });
      }
      if (this.config.customInit) this.config.customInit();
    }
  }
  const SiteConfigs = {
    fc2ppvdb: {
      list: {
        containerSelector: "#actress-articles, .container .flex.flex-wrap",
        cardSelector: 'div[class*="p-4"]:not(.card-rebuilt)',
        extractor: (card) => {
          const id = Utils.extractFC2Id(
            card.querySelector('a[href^="/articles/"]')?.href || ""
          );
          return id ? {
            id,
            type: "fc2",
            title: card.querySelector("div.mt-1 a.text-white")?.textContent?.trim() || `FC2-PPV-${id}`,
            primaryImageUrl: `https://wumaobi.com/fc2daily/data/FC2-PPV-${id}/cover.jpg`,
            articleUrl: `/articles/${id}`
          } : null;
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
          const { finalElement, linksContainer } = UIBuilder.createEnhancedCard({
            id,
            type: "fc2",
            primaryImageUrl: `https://wumaobi.com/fc2daily/data/FC2-PPV-${id}/cover.jpg`
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
    },
    "fd2ppv.cc": {
      list: {
        containerSelector: ".work-list, .flex.flex-wrap, .container .grid, .other-works-grid",
        cardSelector: ".artist-card:not(.card-rebuilt)",
        extractor: (card) => {
          const link = card.querySelector(
            'a[href*="/articles/"], .other-work-title a, a.block'
          );
          const id = Utils.extractFC2Id(link?.href || "");
          const img = card.querySelector("img");
          return id ? {
            id,
            type: "fc2",
            title: (card.querySelector(".other-work-title, .work-title, p, h3, .mt-1")?.textContent || `FC2-PPV-${id}`).trim(),
            primaryImageUrl: img?.dataset?.src || img?.src,
            articleUrl: link?.href || `/articles/${id}`
          } : null;
        },
        getExtraUi: (card) => ({
          preservedIconsHTML: Array.from(card.querySelectorAll(".float .icon, .badges span")).map((n) => n.outerHTML).join("")
        })
      },
      detail: {
        mainImageSelector: ".work-image-large",
        customDetailAction: (cont) => {
          const id = Utils.extractFC2Id(location.href);
          if (!id) return;
          const actressRaw = document.querySelector(".artist-name a")?.textContent;
          const actress = Utils.cleanActressName(actressRaw);
          if (actress) CacheManager.set(`actress_${id}`, actress);
          const img = cont.querySelector("img");
          const { finalElement, linksContainer } = UIBuilder.createEnhancedCard({
            id,
            type: "fc2",
            primaryImageUrl: img?.src || `https://wumaobi.com/fc2daily/data/FC2-PPV-${id}/cover.jpg`
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
    },
    supjav: {
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
            imageUrl: img?.dataset?.original || img?.getAttribute("data-original") || img?.src,
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
                infoArea.querySelector(`.${C.resourceLinksContainer}`)
              );
          }
        }
      },
      detail: {
        triggerSelector: ".archive-title h1",
        customDetailAction: async (titleEl) => {
          const video = document.querySelector("#dz_video");
          const info = Utils.parseVideoId(titleEl.textContent || "", location.href);
          if (!video || !info) return;
          let actress = null;
          if (info.type === "jav") {
            const actresses = Array.from(document.querySelectorAll('div.post-meta a[href*="/star/"]')).map(
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
          video.after(toolbar);
          if (info.type === "fc2") {
            actress = await ScraperService.fetchActressFromFD2(info.id);
            if (actress) {
              const infoArea = toolbar.querySelector(`.${Config.CLASSES.infoArea}`);
              if (infoArea) UIBuilder.addActressButton(infoArea, actress);
            }
          }
        }
      }
    },
    missav: {
      list: {
        containerSelector: 'div.grid[class*="grid-cols-"], .sm\\:container .grid',
        cardSelector: "div.thumbnail:not(.card-rebuilt)",
        extractor: (card) => {
          const tLink = card.querySelector("div.my-2 a, a.text-secondary");
          const img = card.querySelector("img");
          if (!tLink || !tLink.getAttribute("href") || tLink.getAttribute("href") === "#" || !tLink.textContent?.trim())
            return null;
          const info = Utils.parseVideoId(tLink.textContent || "", tLink.href || "");
          if (!info) return null;
          const videoTag = card.querySelector("video.preview");
          const previewSlug = videoTag?.dataset.src?.match(/fourhoi\.com\/([^/]+)\/preview\.mp4/)?.[1] || info.previewSlug || null;
          return {
            ...info,
            title: tLink.textContent?.trim() || "",
            imageUrl: img?.dataset.src || img?.getAttribute("data-src") || img?.src,
            articleUrl: tLink.href,
            previewSlug
          };
        },
        postProcess: (card) => {
          card.removeAttribute("x-data");
          card.addEventListener("mouseenter", (e) => e.stopPropagation(), true);
        }
      },
      detail: {
        triggerSelector: 'div[x-data*="baseUrl"]',
        customDetailAction: async (el, obs) => {
          const info = Utils.parseVideoId(document.title, el.getAttribute("x-data") || "");
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
            document.title,
            actress ?? void 0,
            info.previewSlug ?? void 0
          );
          el.insertAdjacentElement("afterend", toolbar);
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
    },
    javdb: {
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
                infoArea.querySelector(`.${Config.CLASSES.resourceLinksContainer}`)
              );
            if (meta)
              infoArea.insertBefore(
                meta.cloneNode(true),
                infoArea.querySelector(`.${Config.CLASSES.resourceLinksContainer}`)
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
              actress: actress ?? void 0,
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
          }
        }
      }
    }
  };
  const renderSelect = (id, label, options) => {
    const val = State.proxy[id];
    return h(
      "div",
      { className: "fc2-enh-form-row" },
      h("label", {}, label),
      h(
        "select",
        {
          id: `set-${id}`,
          onchange: (e) => {
            State.proxy[id] = e.target.value;
          }
        },
        ...options.map(([v, t2]) => h("option", { value: v, selected: val === v }, t2))
      )
    );
  };
  const renderCheckbox = (id, label) => {
    return h(
      "div",
      { className: "fc2-enh-form-row checkbox" },
      h(
        "label",
        {},
        h("input", {
          type: "checkbox",
          id: `set-${id}`,
          checked: State.proxy[id],
          onchange: (e) => {
            State.proxy[id] = e.target.checked;
          }
        }),
        ` ${label}`
      )
    );
  };
  const renderSettingsTab = () => {
    const mkIcon = (svg) => {
      const s = UIUtils.icon(svg);
      Object.assign(s.style, { marginRight: "10px", color: "var(--fc2-primary)" });
      return s;
    };
    return h(
      "div",
      { className: "fc2-enh-tab-content active" },
      h(
        "div",
        { className: "fc2-enh-settings-group" },
        h("h3", {}, mkIcon(IconFilter), t("groupFilters")),
        renderCheckbox("hideNoMagnet", t("optionHideNoMagnet")),
        renderCheckbox("hideCensored", t("optionHideCensored")),
        renderCheckbox("hideViewed", t("optionHideViewed"))
      ),
      h(
        "div",
        { className: "fc2-enh-settings-group" },
        h("h3", {}, mkIcon(IconPalette), t("groupAppearance")),
        renderSelect("previewMode", t("labelPreviewMode"), [
          ["static", t("previewModeStatic")],
          ["hover", t("previewModeHover")]
        ]),
        h(
          "div",
          { className: "fc2-enh-form-row" },
          h("label", {}, t("labelGridColumns")),
          h(
            "select",
            { id: "set-gridColumns" },
            ...[0, 1, 2, 3, 4, 5, 6].map(
              (i) => h(
                "option",
                {
                  value: i,
                  selected: (typeof GM_getValue !== "undefined" ? GM_getValue("user_grid_columns_preference", 0) : 0) === i
                },
                i || t("labelDefault")
              )
            )
          )
        ),
        renderSelect("language", t("labelLanguage"), [
          ["auto", t("langAuto")],
          ["zh", t("langZh")],
          ["en", t("langEn")]
        ])
      ),
      h(
        "div",
        { className: "fc2-enh-settings-group" },
        h("h3", {}, mkIcon(IconClockRotateLeft), t("groupDataHistory")),
        renderCheckbox("enableMagnets", t("optionEnableMagnets")),
        renderCheckbox("enableExternalLinks", t("optionEnableExternalLinks")),
        renderCheckbox("enableActressName", t("optionEnableActressName")),
        renderCheckbox("enableHistory", t("optionEnableHistory")),
        renderCheckbox("loadExtraPreviews", t("optionLoadExtraPreviews")),
        renderCheckbox("enableQuickBar", t("optionEnableQuickBar"))
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
      Logger$1.info("Backup", "Preparing data for export...");
      const history = await Repository.history.getAll();
      const { syncStatus, ...persistentSettings } = State.proxy;
      const data = {
        appName: "FC2PPVDB Enhanced",
        version: 2,
        timestamp: Date.now(),
        settings: persistentSettings,
        history
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
  const renderDataTab = (render, saveWebDAV) => {
    const jwt = typeof GM_getValue !== "undefined" ? GM_getValue("supabase_jwt") : null;
    const isLoggedIn = !!jwt;
    const lastSync = typeof GM_getValue !== "undefined" ? GM_getValue("last_sync_ts", "Never") : "Never";
    const currentLang = State.proxy.language === "auto" ? navigator.language.startsWith("zh") ? "zh" : "en" : State.proxy.language;
    const displayTime = lastSync !== "Never" ? new Date(lastSync).toLocaleString(currentLang === "zh" ? "zh-CN" : "en-US", {
      timeZone: "Asia/Shanghai",
      hour12: false
    }) : t("labelNever");
    const mkIcon = (svg) => {
      const s = UIUtils.icon(svg);
      Object.assign(s.style, { marginRight: "4px" });
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
          { className: "fc2-enh-form-row", style: { display: "flex", gap: "0.5rem", flexWrap: "wrap" } },
          h(
            "button",
            {
              className: "fc2-enh-btn",
              onclick: async () => {
                await Repository.cache.clear();
                Toast$1.show(t("alertCacheCleared"), "success");
              }
            },
            t("btnClearCache")
          ),
          h(
            "button",
            {
              className: "fc2-enh-btn",
              onclick: async () => {
                await HistoryManager.clear();
                Toast$1.show(t("alertHistoryCleared"), "success");
              }
            },
            t("btnClearHistory")
          ),
          h(
            "button",
            {
              className: `fc2-enh-btn ${Logger$1.enabled ? "primary" : ""}`,
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
          ),
          h(
            "button",
            {
              className: "fc2-enh-btn",
              onclick: () => BackupManager.exportData()
            },
            mkIcon(IconFileExport),
            t("btnExportData")
          ),
          h(
            "button",
            {
              className: "fc2-enh-btn",
              onclick: () => {
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
            },
            mkIcon(IconFileImport),
            t("btnImportData")
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
            placeholder: "https://dav.jianguoyun.com/dav/"
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
            value: State.proxy.webdavPath || "fc2_enhanced_sync.json"
          })
        ),
        h(
          "div",
          { className: "fc2-enh-form-row", style: { display: "flex", gap: "0.5rem" } },
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
          h("p", {}, `${t("labelUser")}: `, h("strong", {}, typeof GM_getValue !== "undefined" ? GM_getValue("current_user_email", "N/A") : "N/A")),
          h("p", { style: { fontSize: "0.8em", color: "var(--fc2-text-dim)" } }, `${t("labelLastSync")}: ${displayTime}`),
          h(
            "div",
            { className: "fc2-enh-form-row", style: { display: "flex", gap: "0.5rem", flexWrap: "wrap" } },
            h("button", { className: "fc2-enh-btn", onclick: () => SyncManager.performSync(true) }, "Push/Pull"),
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
              color: "#ccc",
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
        h("div", { className: "fc2-settings-group-header", style: { color: "#ff5252" } }, t("tabDmca")),
        h(
          "div",
          {
            className: "fc2-settings-item",
            style: { flexDirection: "column", alignItems: "flex-start", gap: "10px" }
          },
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffc107",
                fontWeight: "bold",
                fontSize: "1em"
              }
            },
            UIUtils.icon(IconTriangleExclamation),
            "Disclaimer"
          ),
          h("div", {
            style: { lineHeight: "1.6", fontSize: "0.9em", color: "#ccc" },
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
        { style: { textAlign: "center", marginBottom: "20px", padding: "10px" } },
        h("h3", { style: { margin: "0 0 10px 0" } }, "FC2PPVDB Enhanced"),
        h("div", { style: { fontSize: "0.85em", opacity: 0.7, marginBottom: "10px" } }, `${t("aboutVersion")} 2.0.0`),
        h("p", { style: { fontSize: "0.95em", color: "#eee" } }, t("aboutDescription"))
      ),
mkSection(t("aboutHelpTitle"), t("aboutHelpContent")),
mkDmcaSection(),
h(
        "div",
        { style: { marginTop: "20px", textAlign: "center", fontSize: "0.85em" } },
        h("a", { href: "https://greasyfork.org/zh-CN/scripts/552583-fc2ppvdb-enhanced", target: "_blank", style: { color: "#646cff", textDecoration: "none" } }, "Greasy Fork")
      )
    );
  };
  const SettingsPanel = (() => {
    let host = null;
    let shadow = null;
    const create = () => {
      if (host && host.isConnected) return;
      if (host) host.remove();
      host = h("div", {
        id: "fc2-enh-settings-host",
        style: {
          display: "none",
          position: "fixed",
          inset: "0",
          zIndex: "2147483647"
        }
      });
      shadow = host.attachShadow({ mode: "open" });
      shadow.innerHTML = `
            <style>
                ${StyleManager.getCss()}
                :host { all: initial; }
                #fc2-enh-settings-container {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
                }
            </style>
            <div id="fc2-enh-settings-container"></div>
        `;
      document.body.appendChild(host);
      Logger$1.info("SettingsPanel", "Settings host created and resources preloaded");
    };
    const hide = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      Logger$1.info("SettingsPanel", "Hiding settings panel");
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
      if (colsEl) {
        const cols = parseInt(colsEl.value || 0);
        if (typeof GM_setValue !== "undefined") {
          GM_setValue("user_grid_columns_preference", cols);
        }
        GridManager.apply(cols);
      }
      saveWebDAVSettings();
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
      setTimeout(() => location.reload(), 500);
      hide();
    };
    const render = (activeTab = "settings") => {
      create();
      host.style.setProperty("display", "block", "important");
      document.body.classList.add("fc2-settings-open");
      const container = shadow.getElementById("fc2-enh-settings-container");
      container.innerHTML = "";
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
              backdropFilter: "blur(20px)",
              background: "rgba(30,30,30,0.8)",
              position: "sticky",
              top: 0,
              zIndex: 10
            }
          },
          h("h2", {}, "FC2PPVDB Enhanced"),
          h("button", { className: "close-btn", onclick: hide }, closeIcon)
        ),
        h(
          "div",
          { className: "fc2-enh-settings-tabs" },
          h(
            "button",
            {
              className: `fc2-enh-tab-btn ${activeTab === "settings" ? "active" : ""}`,
              onclick: () => render("settings")
            },
            mkIcon(IconSliders),
            t("tabSettings")
          ),
          h(
            "button",
            {
              className: `fc2-enh-tab-btn ${activeTab === "data" ? "active" : ""}`,
              onclick: () => render("data")
            },
            mkIcon(IconDatabase),
            t("tabData")
          ),
          h(
            "button",
            {
              className: `fc2-enh-tab-btn ${activeTab === "about" ? "active" : ""}`,
              onclick: () => render("about")
            },
            mkIcon(IconCircleInfo),
            t("tabAbout")
          )
        ),
        h(
          "div",
          { className: "fc2-enh-settings-content" },
          h(
            "div",
            { className: "fc2-tab-content-wrapper", key: activeTab },
            activeTab === "settings" ? renderSettingsTab() : activeTab === "data" ? renderDataTab(render, saveWebDAVSettings) : renderAboutTab()
          )
        ),
        h(
          "div",
          { className: "fc2-enh-settings-footer" },
          h("button", { className: "fc2-enh-btn", onclick: (e) => hide(e) }, t("btnCancel")),
          h("button", { className: "fc2-enh-btn primary", onclick: () => saveAndClose() }, t("btnSave"))
        )
      );
      const backdrop = h("div", { className: "enh-modal-backdrop", onclick: hide });
      container.append(backdrop, panel);
    };
    return { show: () => render(), render };
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
    const render = () => {
      if (container) container.remove();
      if (!State.proxy.enableQuickBar) return;
      const appState = State.proxy;
      container = h("div", { className: "fc2-fab-container" });
      const actions = h("div", { className: "fc2-fab-actions" });
      const mkBtn = (iconSvg, title, prop, onClick) => {
        const iconContainer = UIUtils.icon(iconSvg);
        const b = h(
          "button",
          {
            className: `fc2-fab-btn ${prop && appState[prop] ? "active" : ""}`,
            "data-title": title,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (prop) {
                appState[prop] = !appState[prop];
                const isActive = !!appState[prop];
                b.classList.toggle("active", isActive);
                const status = isActive ? t("statusOn") : t("statusOff");
                Toast$1.show(`${title}: ${status}`, isActive ? "success" : "info");
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
          className: "fc2-fab-trigger"
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
    return { init: render };
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
  const MobileDebug = {
isMobile() {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      return isMobileUA || isTouchDevice && isSmallScreen;
    },
getDeviceInfo() {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        touchPoints: navigator.maxTouchPoints,
        isTouchDevice: "ontouchstart" in window,
        orientation: window.screen.orientation?.type || "unknown",
        isMobile: this.isMobile()
      };
    },
logTouchEvent(eventType, event) {
      if (!Logger$1.enabled) return;
      const touch = event.touches[0] || event.changedTouches[0];
      Logger$1.log("MobileDebug", `Touch ${eventType}`, {
        x: touch?.clientX,
        y: touch?.clientY,
        target: event.target?.className,
        touches: event.touches.length
      });
    },
enableTouchIndicators() {
      if (typeof document === "undefined") return;
      const style = document.createElement("style");
      style.textContent = `
            .touch-indicator {
                position: fixed;
                width: 40px;
                height: 40px;
                border: 2px solid #ff0000;
                border-radius: 50%;
                pointer-events: none;
                z-index: 999999;
                transform: translate(-50%, -50%);
                animation: touch-fade 0.5s ease-out forwards;
            }
            @keyframes touch-fade {
                from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                to { opacity: 0; transform: translate(-50%, -50%) scale(2); }
            }
        `;
      document.head.appendChild(style);
      const addIndicator = (x, y) => {
        const indicator = document.createElement("div");
        indicator.className = "touch-indicator";
        indicator.style.left = `${x}px`;
        indicator.style.top = `${y}px`;
        document.body.appendChild(indicator);
        setTimeout(() => indicator.remove(), 500);
      };
      document.addEventListener("touchstart", (e) => {
        Array.from(e.touches).forEach((touch) => {
          addIndicator(touch.clientX, touch.clientY);
        });
      }, { passive: true });
      Logger$1.info("MobileDebug", "Touch indicators enabled");
    },
showDebugPanel() {
      const info = this.getDeviceInfo();
      const panel = document.createElement("div");
      panel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: #0f0;
            padding: 10px;
            font-family: monospace;
            font-size: 10px;
            z-index: 999999;
            max-width: 300px;
            border-radius: 5px;
            line-height: 1.4;
        `;
      panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">📱 Mobile Debug Info</div>
            <div>Device: ${info.isMobile ? "✅ Mobile" : "❌ Desktop"}</div>
            <div>Screen: ${info.screenWidth}x${info.screenHeight}</div>
            <div>Window: ${info.windowWidth}x${info.windowHeight}</div>
            <div>DPR: ${info.devicePixelRatio}</div>
            <div>Touch: ${info.isTouchDevice ? "✅" : "❌"} (${info.touchPoints} points)</div>
            <div>Orientation: ${info.orientation}</div>
            <div>Platform: ${info.platform}</div>
            <div style="margin-top: 5px; font-size: 9px; opacity: 0.7;">
                Tap to close
            </div>
        `;
      panel.onclick = () => panel.remove();
      document.body.appendChild(panel);
      Logger$1.info("MobileDebug", "Debug panel shown", info);
    },
testTouchEvents() {
      const buttons = document.querySelectorAll("button, a.resource-btn, .fc2-fab-btn");
      let tested = 0;
      buttons.forEach((btn) => {
        const hasClick = !!btn.onclick;
        const hasTouch = !!btn.ontouchend;
        if (!hasClick && !hasTouch) {
          Logger$1.warn("MobileDebug", "Button without events", {
            element: btn.className,
            text: btn.textContent?.trim()
          });
        } else {
          tested++;
        }
      });
      Logger$1.success("MobileDebug", `Tested ${tested}/${buttons.length} buttons`);
      return { total: buttons.length, withEvents: tested };
    },
init() {
      if (!this.isMobile()) {
        Logger$1.info("MobileDebug", "Not a mobile device, skipping mobile debug init");
        return;
      }
      Logger$1.info("MobileDebug", "Mobile device detected", this.getDeviceInfo());
      if (typeof window !== "undefined") {
        window.MobileDebug = {
          info: () => this.showDebugPanel(),
          indicators: () => this.enableTouchIndicators(),
          test: () => this.testTouchEvents(),
          device: () => {
            console.table(this.getDeviceInfo());
            return this.getDeviceInfo();
          }
        };
        Logger$1.success("MobileDebug", "Mobile debug tools available via window.MobileDebug");
      }
    }
  };
  const KeyboardShortcuts = {
    shortcuts: new Map(),
    enabled: true,
    init() {
      document.addEventListener("keydown", (e) => {
        if (!this.enabled) return;
        const target = e.target;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
          return;
        }
        const key = this.getKeyCombo(e);
        const shortcut = this.shortcuts.get(key);
        if (shortcut) {
          e.preventDefault();
          shortcut.handler();
          Logger$1.log("Shortcuts", `Triggered: ${key}`);
        }
      });
      this.registerDefaults();
      Logger$1.info("Shortcuts", "Keyboard shortcuts initialized");
    },
    getKeyCombo(e) {
      const parts = [];
      if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
      if (e.altKey) parts.push("Alt");
      if (e.shiftKey) parts.push("Shift");
      parts.push(e.key.toUpperCase());
      return parts.join("+");
    },
    register(key, description, handler) {
      this.shortcuts.set(key, { description, handler });
    },
    registerDefaults() {
      this.register("/", "聚焦搜索", () => {
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      });
      this.register("Ctrl+S", "打开设置", () => {
        SettingsPanel.show();
      });
      this.register("H", "切换隐藏已看", () => {
        State.proxy.hideViewed = !State.proxy.hideViewed;
        Toast$1.show(
          `已看内容: ${State.proxy.hideViewed ? "隐藏" : "显示"}`,
          State.proxy.hideViewed ? "info" : "success"
        );
      });
      this.register("M", "切换隐藏无磁力", () => {
        State.proxy.hideNoMagnet = !State.proxy.hideNoMagnet;
        Toast$1.show(
          `无磁力内容: ${State.proxy.hideNoMagnet ? "隐藏" : "显示"}`,
          State.proxy.hideNoMagnet ? "info" : "success"
        );
      });
      this.register("C", "切换隐藏有码", () => {
        State.proxy.hideCensored = !State.proxy.hideCensored;
        Toast$1.show(
          `有码内容: ${State.proxy.hideCensored ? "隐藏" : "显示"}`,
          State.proxy.hideCensored ? "info" : "success"
        );
      });
      this.register("R", "刷新页面", () => {
        location.reload();
      });
      this.register("?", "显示快捷键帮助", () => {
        this.showHelp();
      });
      this.register("ESCAPE", "关闭模态窗口", () => {
        const modal = document.querySelector(".enh-modal-backdrop");
        if (modal) {
          modal.remove();
        }
      });
    },
    showHelp() {
      const shortcuts = Array.from(this.shortcuts.entries()).map(([key, { description }]) => ({ key, description }));
      const modal = h(
        "div",
        {
          className: "enh-modal-backdrop",
          onclick: (e) => {
            if (e.target === modal) modal.remove();
          }
        },
        h(
          "div",
          {
            className: "enh-modal-panel",
            style: "width: 500px; max-width: 90%;",
            onclick: (e) => e.stopPropagation()
          },
          h(
            "div",
            { className: "fc2-enh-settings-header" },
            h("h2", {}, "⌨️ 键盘快捷键"),
            h("button", {
              className: "close-btn",
              onclick: () => modal.remove()
            }, "×")
          ),
          h(
            "div",
            {
              className: "fc2-enh-settings-content",
              style: "max-height: 60vh; overflow-y: auto;"
            },
            h(
              "table",
              {
                style: "width: 100%; border-collapse: collapse;"
              },
              h(
                "thead",
                {},
                h(
                  "tr",
                  {},
                  h("th", { style: "text-align: left; padding: 10px; border-bottom: 1px solid var(--fc2-border);" }, "快捷键"),
                  h("th", { style: "text-align: left; padding: 10px; border-bottom: 1px solid var(--fc2-border);" }, "功能")
                )
              ),
              h(
                "tbody",
                {},
                ...shortcuts.map(
                  ({ key, description }) => h(
                    "tr",
                    {},
                    h(
                      "td",
                      {
                        style: "padding: 10px; border-bottom: 1px solid var(--fc2-border);"
                      },
                      h("kbd", {
                        style: `
                                                background: var(--fc2-surface);
                                                padding: 4px 8px;
                                                border-radius: 4px;
                                                border: 1px solid var(--fc2-border);
                                                font-family: monospace;
                                                font-size: 12px;
                                            `
                      }, key.replace(/\+/g, " + "))
                    ),
                    h("td", {
                      style: "padding: 10px; border-bottom: 1px solid var(--fc2-border);"
                    }, description)
                  )
                )
              )
            )
          )
        )
      );
      document.body.appendChild(modal);
    }
  };
  const SmartTooltips = {
    currentTooltip: null,
    hideTimeout: null,
    init() {
      document.addEventListener("mouseenter", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        const tooltipText = target.getAttribute("data-tooltip") || target.title;
        if (tooltipText && this.shouldShowTooltip(target)) {
          this.show(target, tooltipText);
        }
      }, true);
      document.addEventListener("mouseleave", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        if (target.hasAttribute("data-tooltip") || target.title) {
          this.hide();
        }
      }, true);
      Logger$1.info("Tooltips", "Smart tooltips initialized");
    },
    shouldShowTooltip(element) {
      if ("ontouchstart" in window) return false;
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") return false;
      return true;
    },
    show(element, text) {
      this.hide();
      const tooltip = h("div", {
        className: "smart-tooltip",
        style: `
                position: fixed;
                background: rgba(0, 0, 0, 0.9);
                color: #fff;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 999999;
                pointer-events: none;
                white-space: nowrap;
                max-width: 300px;
                backdrop-filter: blur(8px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: opacity 0.2s;
            `
      }, text);
      document.body.appendChild(tooltip);
      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      let top = rect.bottom + 8;
      let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      if (left < 8) left = 8;
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }
      if (top + tooltipRect.height > window.innerHeight - 8) {
        top = rect.top - tooltipRect.height - 8;
      }
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      requestAnimationFrame(() => {
        tooltip.style.opacity = "1";
      });
      this.currentTooltip = tooltip;
    },
    hide() {
      if (this.currentTooltip) {
        this.currentTooltip.style.opacity = "0";
        setTimeout(() => {
          if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
          }
        }, 200);
      }
    }
  };
  const GestureSupport = {
    init() {
      Logger$1.info("Gestures", "Gesture support initialized (long-press disabled)");
    },
    showContextMenu(element, x, y) {
      const card = element.closest(".processed-card");
      if (!card) return;
      const { id } = card.dataset;
      if (!id) return;
      const menu = h(
        "div",
        {
          className: "context-menu",
          style: `
                position: fixed;
                top: ${y}px;
                left: ${x}px;
                background: var(--fc2-surface);
                border: 1px solid var(--fc2-border);
                border-radius: 8px;
                padding: 8px;
                z-index: 999999;
                box-shadow: var(--fc2-shadow);
                min-width: 150px;
            `,
          onclick: (e) => e.stopPropagation()
        },
        h("div", {
          className: "context-menu-item",
          style: "padding: 8px 12px; cursor: pointer;",
          onclick: () => {
            navigator.clipboard.writeText(id);
            Toast$1.show(t("tooltipCopied"), "success");
            menu.remove();
          }
        }, `📋 ${t("tooltipCopyId") || "Copy ID"}`),
        h("div", {
          className: "context-menu-item",
          style: "padding: 8px 12px; cursor: pointer;",
          onclick: () => {
            HistoryManager.add(id);
            card.classList.add(Config.CLASSES.isViewed);
            Toast$1.show(t("alertMarkedViewed"), "success");
            menu.remove();
          }
        }, `👁️ ${t("tooltipMarkAsViewed")}`)
      );
      document.body.appendChild(menu);
      const closeMenu = () => {
        menu.remove();
        document.removeEventListener("click", closeMenu);
      };
      setTimeout(() => {
        document.addEventListener("click", closeMenu);
      }, 100);
    }
  };
  const initUIEnhancements = () => {
    KeyboardShortcuts.init();
    SmartTooltips.init();
    GestureSupport.init();
    Logger$1.success("UI/UX", "All UI enhancements initialized");
  };
  const MigrationManager = {
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
        title.includes("Just a moment..."),
        title.includes("Checking your browser"),
        title.includes("Attention Required!"),
        title.includes("Cloudflare"),
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
      const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
      GlobalErrorHandler.init();
      Logger$1.init();
      Logger$1.group("Main", "🚀 FC2PPVDB Enhanced Initializing");
      Logger$1.time("Main.init");
      if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement("meta");
        viewport.name = "viewport";
        viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes";
        document.head.appendChild(viewport);
        Logger$1.info("Main", "Added viewport meta tag for mobile support");
      }
      Logger$1.info("Main", "Running database GC...");
      await Repository.runGC().catch((e) => Logger$1.error("Main", "GC Failed", e));
      State.on((key, _value) => {
        Logger$1.log("State", `State changed: ${key} = ${_value}`);
        const C = Config.CLASSES;
        if (key === "language") {
          MenuManager.register();
          QuickBar.init();
        } else if (["enableMagnets", "enableExternalLinks", "enableActressName"].includes(key)) {
          location.reload();
        } else if (key === "hideNoMagnet") {
          document.querySelectorAll(`.${C.cardRebuilt}`).forEach(
            (c) => UIBuilder.applyCardVisibility(c, !!c.querySelector(`.${C.btnMagnet}`))
          );
        } else if (key === "hideCensored") {
          document.querySelectorAll(`.${C.cardRebuilt}`).forEach((c) => UIBuilder.applyCensoredFilter(c));
        } else if (key === "hideViewed") {
          document.querySelectorAll(`.${C.cardRebuilt}`).forEach((c) => UIBuilder.applyHistoryVisibility(c));
        }
      });
      const hostname = location.hostname;
      const initDelay = hostname.includes("supjav") || hostname.includes("missav") ? 800 : 0;
      setTimeout(async () => {
        SyncManager.performSync(false).catch(() => {
        });
        await MigrationManager.run();
        Logger$1.info("Main", "Loading history...");
        await HistoryManager.load();
        Logger$1.info("Main", "Injecting styles...");
        StyleManager.init();
        if (Logger$1.enabled) {
          MobileDebug.init();
        }
        initUIEnhancements();
        MagnetManager.init();
        const cols = typeof GM_getValue !== "undefined" ? GM_getValue("user_grid_columns_preference", 0) : 0;
        Logger$1.info("Main", `Applying grid: ${cols || "auto"} columns`);
        GridManager.apply(cols);
        MenuManager.register();
        QuickBar.init();
        const configKey = Object.keys(SiteConfigs).find((k) => hostname.includes(k));
        const config = configKey ? SiteConfigs[configKey] : null;
        if (config) {
          Logger$1.success("Main", `Site detected: ${configKey}`);
          new SiteEngine(config).init();
        } else {
          Logger$1.warn("Main", `No config for: ${hostname}`);
        }
        Logger$1.timeEnd("Main.init");
        Logger$1.groupEnd();
        Logger$1.info("Main", "✅ Initialization complete");
      }, initDelay);
    } catch (error) {
      Logger$1.error("Main", "Fatal initialization error", error);
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }

})(Dexie);