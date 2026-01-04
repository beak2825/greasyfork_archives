// ==UserScript==
// @name         NSDF 助手
// @namespace    https://www.deepflood.com/
// @version      0.2.2
// @description  DeepFlood & NodeSeek 论坛增强脚本（基于 NSaide 改造）
// @author       zen1zi
// @license      GPL-3.0
// @match        https://www.deepflood.com/*
// @match        https://deepflood.com/*
// @match        https://www.nodeseek.com/*
// @match        https://nodeseek.com/*
// @icon         https://www.deepflood.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_listValues
// @grant        GM_info
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552402/NSDF%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552402/NSDF%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
  "use strict";

  console.log("[DF助手] 脚本开始加载");

  const HOST_SITE_MAP = {
    "www.deepflood.com": { id: "deepflood", name: "DeepFlood" },
    "deepflood.com": { id: "deepflood", name: "DeepFlood" },
    "www.nodeseek.com": { id: "nodeseek", name: "NodeSeek" },
    "nodeseek.com": { id: "nodeseek", name: "NodeSeek" },
  };

  const currentHost = window.location.host;
  const siteMeta = HOST_SITE_MAP[currentHost] || {
    id: "unknown",
    name: currentHost,
  };
  const siteInfo = Object.freeze({
    ...siteMeta,
    host: currentHost,
    origin: window.location.origin,
    isDeepFlood: siteMeta.id === "deepflood",
    isNodeSeek: siteMeta.id === "nodeseek",
  });

  if (siteInfo.id === "unknown") {
    console.warn("[DF助手] 检测到未配置站点，尝试按当前域名加载");
  } else {
    console.log(`[DF助手] 当前站点: ${siteInfo.name} (${siteInfo.host})`);
  }

  const CONFIG_URL =
    "https://raw.githubusercontent.com/zen1zi/NSDF_Plus/main/modules/config.json";
  const CACHE_EXPIRY = 30 * 60 * 1000;
  const CACHE_KEY_PREFIX = "df_module_cache_";
  const CONFIG_CACHE_KEY = "df_config_cache";
  const MODULE_ENABLED_KEY_PREFIX = "df_MODULE_ENABLED_";
  const LEGACY_MODULE_ENABLED_KEY_PREFIX = "module_";
  const LEGACY_MODULE_ENABLED_KEY_SUFFIX = "_enabled";

  const normalizeModuleIdForKey = (id) => {
    if (typeof id !== "string") {
      return "";
    }

    return id
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      .replace(/[^a-z0-9]/gi, "_")
      .toUpperCase();
  };

  const getCachedData = (key) => {
    const cached = GM_getValue(key);
    if (typeof cached !== "string" || cached.length === 0) {
      console.log(`[DF助手] 缓存未命中: ${key}`);
      return null;
    }

    try {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      if (age > CACHE_EXPIRY) {
        console.log(
          `[DF助手] 缓存已过期: ${key} (${Math.round(age / 1000)}s 前)`,
        );
        deleteCachedData(key, { silent: true });
        return null;
      }
      console.log(`[DF助手] 缓存命中: ${key} (${Math.round(age / 1000)}s 前)`);
      return data;
    } catch (error) {
      console.warn(`[DF助手] 缓存数据解析失败: ${key}`, error);
      deleteCachedData(key, { silent: true });
      return null;
    }
  };

  const setCachedData = (key, data) => {
    try {
      GM_setValue(
        key,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        }),
      );
      console.log(`[DF助手] 缓存已保存: ${key}`);
    } catch (error) {
      console.error(`[DF助手] 缓存保存失败: ${key}`, error);
    }
  };

  const deleteCachedData = (key, { silent = false } = {}) => {
    try {
      GM_deleteValue(key);
      if (!silent) {
        console.log(`[DF助手] 缓存已清理: ${key}`);
      }
    } catch (error) {
      console.error(`[DF助手] 缓存清理失败: ${key}`, error);
    }
  };

  const fetchWithCache = (url, cacheKey, retryCount = 3) => {
    return new Promise((resolve, reject) => {
      const cached = getCachedData(cacheKey);
      if (cached) {
        resolve(cached);
        return;
      }

      console.log(`[DF助手] 开始远程获取: ${url}`);

      const attemptFetch = (attempt) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: `${url}?t=${Date.now()}`,
          timeout: 10000,
          nocache: true,
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          onload: (response) => {
            if (response.status === 200) {
              try {
                const data = response.responseText;
                setCachedData(cacheKey, data);
                console.log(`[DF助手] 远程获取成功: ${url}`);
                resolve(data);
              } catch (error) {
                console.error(`[DF助手] 数据处理失败: ${url}`, error);
                reject(error);
              }
            } else {
              const error = new Error(
                `HTTP ${response.status}: ${response.statusText}`,
              );
              if (attempt < retryCount) {
                console.warn(
                  `[DF助手] 请求失败，重试 ${attempt}/${retryCount}: ${url}`,
                  error.message,
                );
                setTimeout(() => attemptFetch(attempt + 1), 1000 * attempt);
              } else {
                console.error(`[DF助手] 请求最终失败: ${url}`, error);
                reject(error);
              }
            }
          },
          onerror: (error) => {
            if (attempt < retryCount) {
              console.warn(
                `[DF助手] 网络错误，重试 ${attempt}/${retryCount}: ${url}`,
                error,
              );
              setTimeout(() => attemptFetch(attempt + 1), 1000 * attempt);
            } else {
              console.error(`[DF助手] 网络错误最终失败: ${url}`, error);
              reject(error);
            }
          },
          ontimeout: () => {
            const error = new Error("请求超时");
            if (attempt < retryCount) {
              console.warn(
                `[DF助手] 请求超时，重试 ${attempt}/${retryCount}: ${url}`,
              );
              setTimeout(() => attemptFetch(attempt + 1), 1000 * attempt);
            } else {
              console.error(`[DF助手] 请求超时最终失败: ${url}`);
              reject(error);
            }
          },
        });
      };

      attemptFetch(1);
    });
  };

  const loadConfig = async () => {
    try {
      const configText = await fetchWithCache(CONFIG_URL, CONFIG_CACHE_KEY);
      return JSON.parse(configText);
    } catch (error) {
      console.error("[DF助手] 配置加载失败:", error);
      throw error;
    }
  };

  const loadModule = async (moduleInfo) => {
    const cacheKey = `${CACHE_KEY_PREFIX}${moduleInfo.id}`;
    const loadStartTime = Date.now();

    try {
      console.log(`[DF助手] 开始加载模块: ${moduleInfo.name}`);
      const moduleCode = await fetchWithCache(moduleInfo.url, cacheKey);

      // 检查模块代码安全性 - 简单的恶意代码检测
      if (
        moduleCode.includes("eval(") &&
        !moduleCode.includes("// Safe eval")
      ) {
        console.warn(`[DF助手] 模块 ${moduleInfo.name} 包含可疑代码，跳过加载`);
        return;
      }

      eval(moduleCode);
      const loadTime = Date.now() - loadStartTime;
      console.log(`[DF助手] 模块加载成功: ${moduleInfo.name} (${loadTime}ms)`);

      // 记录模块加载性能
      window.DF.dev.moduleLoadTimes = window.DF.dev.moduleLoadTimes || {};
      window.DF.dev.moduleLoadTimes[moduleInfo.id] = loadTime;
    } catch (error) {
      console.error(`[DF助手] 模块 ${moduleInfo.name} 加载失败:`, error);

      // 尝试从缓存中清除损坏的模块
      deleteCachedData(cacheKey, { silent: true });
      console.log(`[DF助手] 已清理损坏的模块缓存: ${moduleInfo.id}`);

      throw error;
    }
  };

  const createDF = () => {
    window.DF = {
      version: GM_info.script.version,
      modules: new Map(),
      isReady: false,
      site: siteInfo,

      registerModule(moduleDefinition) {
        if (!moduleDefinition || !moduleDefinition.id || !moduleDefinition.init)
          return;

        const normalizedId = normalizeModuleIdForKey(moduleDefinition.id);
        const enabledKey = `${MODULE_ENABLED_KEY_PREFIX}${normalizedId}`;
        let enabled = GM_getValue(enabledKey);

        if (typeof enabled === "undefined") {
          const legacyKey = `${LEGACY_MODULE_ENABLED_KEY_PREFIX}${moduleDefinition.id}${LEGACY_MODULE_ENABLED_KEY_SUFFIX}`;
          const legacyValue = GM_getValue(legacyKey);

          if (typeof legacyValue !== "undefined") {
            enabled = legacyValue;
            try {
              GM_setValue(enabledKey, legacyValue);
              GM_deleteValue(legacyKey);
              console.log(
                `[DF助手] 已迁移模块启用状态: ${moduleDefinition.id}`,
              );
            } catch (migrationError) {
              console.warn(
                `[DF助手] 模块启用状态迁移失败: ${moduleDefinition.id}`,
                migrationError,
              );
            }
          } else {
            enabled = true;
            try {
              GM_setValue(enabledKey, enabled);
            } catch (error) {
              console.warn(
                `[DF助手] 默认写入模块启用状态失败: ${moduleDefinition.id}`,
                error,
              );
            }
          }
        }

        if (typeof enabled === "string") {
          enabled = enabled.toLowerCase() === "true";
        } else {
          enabled = Boolean(enabled);
        }

        const module = {
          ...moduleDefinition,
          enabled: enabled,
          enabledStorageKey: enabledKey,
        };

        this.modules.set(moduleDefinition.id, module);
        console.log(`[DF助手] 模块已注册: ${module.name}`);
      },

      init() {
        if (this.isReady) return;

        const enabledModules = Array.from(this.modules.values()).filter(
          (m) => m.enabled,
        );
        console.log(
          `[DF助手] 开始初始化 ${enabledModules.length} 个已启用模块`,
        );

        Promise.all(
          enabledModules.map(
            (module) =>
              new Promise((resolve) => {
                try {
                  module.init();
                  console.log(`[DF助手] 模块初始化成功: ${module.name}`);
                  resolve();
                } catch (error) {
                  console.error(
                    `[DF助手] 模块 ${module.name} 初始化失败:`,
                    error,
                  );
                  resolve();
                }
              }),
          ),
        ).then(() => {
          this.isReady = true;
          console.log("[DF助手] 所有模块初始化完成");
        });
      },
    };

    window.DF.getSiteUrl = (path = "") => {
      if (typeof path !== "string" || path.length === 0) {
        return window.DF.site.origin;
      }

      if (/^https?:\/\//i.test(path)) {
        return path;
      }

      const normalizedPath = path.startsWith("/") ? path : `/${path}`;
      return `${window.DF.site.origin}${normalizedPath}`;
    };

    window.DFRegisterModule = (moduleDefinition) => {
      window.DF.registerModule(moduleDefinition);
    };

    // 缓存工具 - 可供模块使用
    window.DF.cache = {
      get: getCachedData,
      set: setCachedData,
      delete: deleteCachedData,
      fetch: fetchWithCache,
      expiry: CACHE_EXPIRY,
      keyPrefix: CACHE_KEY_PREFIX,
    };

    // 开发者工具
    window.DF.dev = {
      clearCache() {
        const removedKeys = [];

        try {
          const storedKeys = GM_listValues();
          storedKeys.forEach((key) => {
            if (key === CONFIG_CACHE_KEY || key.startsWith(CACHE_KEY_PREFIX)) {
              deleteCachedData(key, { silent: true });
              removedKeys.push(key);
            }
          });
        } catch (error) {
          console.error("[DF助手] 遍历缓存键失败:", error);
        }

        console.log(`[DF助手] 已清理缓存: ${removedKeys.length} 项`);
        return removedKeys;
      },
      getCacheInfo() {
        const info = {};
        let storedKeys = [];

        try {
          storedKeys = GM_listValues();
        } catch (error) {
          console.error("[DF助手] 获取缓存信息失败:", error);
        }

        const storedSet = new Set(storedKeys);
        info.config = storedSet.has(CONFIG_CACHE_KEY) ? "已缓存" : "未缓存";
        window.DF.modules.forEach((module, id) => {
          const moduleCacheKey = `${CACHE_KEY_PREFIX}${id}`;
          info[id] = storedSet.has(moduleCacheKey) ? "已缓存" : "未缓存";
        });
        return info;
      },
      getModuleHealth() {
        const health = {};
        window.DF.modules.forEach((module, id) => {
          health[id] = {
            id: module.id,
            name: module.name,
            enabled: module.enabled,
            loaded: !!module.init,
            cached: typeof GM_getValue(`${CACHE_KEY_PREFIX}${id}`) === "string",
          };
        });
        return health;
      },
    };
  };

  const initializeModules = async () => {
    const initStartTime = Date.now();

    try {
      console.log("[DF助手] 开始初始化模块系统");
      createDF();

      const config = await loadConfig();
      console.log(
        `[DF助手] 配置加载成功，发现 ${config.modules.length} 个模块`,
      );

      // 并行加载模块，但容错处理
      const moduleLoadPromises = config.modules.map(async (moduleInfo) => {
        try {
          await loadModule(moduleInfo);
          return { success: true, module: moduleInfo.id };
        } catch (error) {
          console.error(`[DF助手] 模块 ${moduleInfo.id} 加载失败:`, error);
          return { success: false, module: moduleInfo.id, error };
        }
      });

      const results = await Promise.all(moduleLoadPromises);
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success);

      console.log(
        `[DF助手] 模块加载完成: ${successful}/${config.modules.length} 成功`,
      );

      if (failed.length > 0) {
        console.warn(
          "[DF助手] 加载失败的模块:",
          failed.map((f) => f.module),
        );
      }

      if (window.DF.modules.size > 0) {
        window.DF.init();
        const initTime = Date.now() - initStartTime;
        console.log(
          `[DF助手] 初始化完成 (${initTime}ms)，已加载 ${window.DF.modules.size} 个模块`,
        );

        // 注册菜单命令
        GM_registerMenuCommand("⚙️ 清理缓存", () => {
          window.DF.dev.clearCache();
          alert("缓存已清理，请刷新页面");
        });
      } else {
        console.warn("[DF助手] 没有模块成功加载");
      }
    } catch (error) {
      console.error("[DF助手] 初始化失败:", error);

      // 降级处理：尝试只加载设置模块
      try {
        console.log("[DF助手] 尝试降级启动...");
        const fallbackConfig = {
          modules: [
            {
              id: "settings",
              name: "设置面板",
              url: "https://raw.githubusercontent.com/zen1zi/NSDF_Plus/main/modules/settings/index.js",
            },
          ],
        };

        await loadModule(fallbackConfig.modules[0]);
        if (window.DF.modules.size > 0) {
          window.DF.init();
          console.log("[DF助手] 降级启动成功");
        }
      } catch (fallbackError) {
        console.error("[DF助手] 降级启动也失败:", fallbackError);
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeModules);
  } else {
    initializeModules();
  }
})();
