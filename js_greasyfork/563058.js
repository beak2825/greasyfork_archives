// ==UserScript==
// @name         Linux Do 自定义类别
// @namespace    ddc/linux-do-custom-categories
// @version      0.0.7
// @author       DDC(NaiveMagic)
// @description  Linux Do Custom Categories
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iMTI4IiBjeT0iMTI4IiByPSIxMjgiIGZpbGw9IiNGMkYyRjIiLz4KICAKICA8cGF0aCBkPSJNNDAgNzAgSDExMCBMMTMwIDkwIEgyMTYgVjIwMCBINDAgWiIgZmlsbD0iIzFEMUQxQiIvPgogIAogIDxwYXRoIGQ9Ik00MCAxMDAgSDIxNiBWMjAwIEg0MCBaIiBmaWxsPSIjRUFCMTI2Ii8+CiAgCiAgPHJlY3QgeD0iMTE4IiB5PSIxMjUiIHdpZHRoPSIyMCIgaGVpZ2h0PSI1MCIgcng9IjQiIGZpbGw9IiMxRDFEMUIiLz4KICA8cmVjdCB4PSIxMDMiIHk9IjE0MCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iIzFEMUQxQiIvPgo8L3N2Zz4K
// @homepage     https://github.com/zilewang7/linux-do-custom-categories
// @match        https://linux.do/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/563058/Linux%20Do%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B1%BB%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/563058/Linux%20Do%20%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B1%BB%E5%88%AB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_unregisterMenuCommand = (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
  const STORAGE_KEY = "categoryGroups";
  const CATEGORY_METADATA_KEY = "categoryMetadataCache";
  const CATEGORY_PATH_KEY = "categoryPathCache";
  const TAG_ICON_CACHE_KEY = "tagIconCache";
  const EMOJI_CACHE_KEY = "emojiCache";
  const REQUEST_CONTROL_KEY = "requestControlSettings";
  const OPEN_TOPIC_NEW_TAB_KEY = "customTopicOpenInNewTab";
  const DEFAULT_REQUEST_CONTROL_SETTINGS = {
    concurrency: 5,
    requestDelayMs: 200,
    maxRetryAttempts: 3
  };
  function normalizeInteger(value, fallback, minValue) {
    const numeric = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return Math.max(minValue, Math.round(numeric));
  }
  function normalizeRequestControlSettings(input) {
    const base = input ?? DEFAULT_REQUEST_CONTROL_SETTINGS;
    return {
      concurrency: normalizeInteger(
        base.concurrency,
        DEFAULT_REQUEST_CONTROL_SETTINGS.concurrency,
        1
      ),
      requestDelayMs: normalizeInteger(
        base.requestDelayMs,
        DEFAULT_REQUEST_CONTROL_SETTINGS.requestDelayMs,
        0
      ),
      maxRetryAttempts: normalizeInteger(
        base.maxRetryAttempts,
        DEFAULT_REQUEST_CONTROL_SETTINGS.maxRetryAttempts,
        -1
      )
    };
  }
  function getCategoryGroups() {
    return _GM_getValue(STORAGE_KEY, []);
  }
  function saveCategoryGroups(groups) {
    _GM_setValue(STORAGE_KEY, groups);
  }
  function addCategoryGroup(group) {
    const groups = getCategoryGroups();
    groups.push(group);
    saveCategoryGroups(groups);
  }
  function updateCategoryGroup(group) {
    const groups = getCategoryGroups();
    const index = groups.findIndex((g) => g.id === group.id);
    if (index !== -1) {
      groups[index] = group;
      saveCategoryGroups(groups);
    }
  }
  function deleteCategoryGroup(id) {
    const groups = getCategoryGroups().filter((g) => g.id !== id);
    saveCategoryGroups(groups);
  }
  function getCategoryMetadataCache() {
    return _GM_getValue(CATEGORY_METADATA_KEY, null);
  }
  function saveCategoryMetadataCache(cache) {
    _GM_setValue(CATEGORY_METADATA_KEY, cache);
  }
  function getTagIconCache() {
    return _GM_getValue(TAG_ICON_CACHE_KEY, null);
  }
  function saveTagIconCache(cache) {
    _GM_setValue(TAG_ICON_CACHE_KEY, cache);
  }
  function getEmojiCache() {
    return _GM_getValue(EMOJI_CACHE_KEY, null);
  }
  function saveEmojiCache(cache) {
    _GM_setValue(EMOJI_CACHE_KEY, cache);
  }
  function getCategoryPathCache() {
    return _GM_getValue(CATEGORY_PATH_KEY, null);
  }
  function saveCategoryPathCache(cache) {
    _GM_setValue(CATEGORY_PATH_KEY, cache);
  }
  function getRequestControlSettings() {
    const stored = _GM_getValue(REQUEST_CONTROL_KEY, null);
    return normalizeRequestControlSettings(stored);
  }
  function saveRequestControlSettings(settings) {
    const normalized = normalizeRequestControlSettings(settings);
    _GM_setValue(REQUEST_CONTROL_KEY, normalized);
    return normalized;
  }
  function resetRequestControlSettings() {
    _GM_setValue(REQUEST_CONTROL_KEY, DEFAULT_REQUEST_CONTROL_SETTINGS);
  }
  function getOpenTopicInNewTab() {
    return _GM_getValue(OPEN_TOPIC_NEW_TAB_KEY, true) === true;
  }
  function setOpenTopicInNewTab(value) {
    _GM_setValue(OPEN_TOPIC_NEW_TAB_KEY, value);
  }
  function waitForElement(selector, timeout = 1e4) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) {
        resolve(el);
        return;
      }
      const observer = new MutationObserver(() => {
        const el2 = document.querySelector(selector);
        if (el2) {
          observer.disconnect();
          resolve(el2);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout waiting for ${selector}`));
      }, timeout);
    });
  }
  function createEl(tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    }
    if (children) {
      el.append(...children);
    }
    return el;
  }
  const PROGRESS_STYLE_ID = "custom-category-fetch-progress-style";
  const PROGRESS_ID = "custom-category-fetch-progress";
  const VISIBLE_CLASS = "custom-category-fetch-progress--visible";
  const ERROR_CLASS = "custom-category-fetch-progress--error";
  const SUCCESS_CLASS = "custom-category-fetch-progress--success";
  const HIDE_DELAY_MS = 2400;
  const HIDE_DELAY_MS_FAILURE = 5e3;
  const NOOP_TRACKER = {
    markSuccess: () => void 0,
    markFailure: () => void 0,
    finish: () => void 0
  };
  let hideTimeoutId = null;
  function clearHideTimeout() {
    if (hideTimeoutId === null) {
      return;
    }
    window.clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  function ensureProgressStyles() {
    if (document.getElementById(PROGRESS_STYLE_ID)) {
      return;
    }
    const styles = `
    #${PROGRESS_ID} {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 1100;
      max-width: calc(100vw - 24px);
      padding: 6px 10px;
      border-radius: 8px;
      background: rgba(20, 20, 20, 0.45);
      color: #f5f5f5;
      font-size: 12px;
      line-height: 1.4;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16);
      opacity: 0;
      transform: translateY(-6px);
      transition: opacity 0.2s ease, transform 0.2s ease, background 0.2s ease;
      pointer-events: none;
    }

    #${PROGRESS_ID}.${VISIBLE_CLASS} {
      opacity: 1;
      transform: translateY(0);
    }

    #${PROGRESS_ID}.${ERROR_CLASS} {
      background: rgba(230, 80, 80, 0.22);
      color: #4b1717;
      box-shadow: 0 6px 16px rgba(230, 80, 80, 0.12);
    }

    #${PROGRESS_ID}.${SUCCESS_CLASS} {
      background: rgba(70, 170, 110, 0.22);
      color: #10341f;
      box-shadow: 0 6px 16px rgba(70, 170, 110, 0.12);
    }
  `;
    const styleEl = createEl("style", { id: PROGRESS_STYLE_ID }, [styles]);
    document.head.appendChild(styleEl);
  }
  function ensureProgressElement() {
    ensureProgressStyles();
    const existing = document.getElementById(PROGRESS_ID);
    if (existing instanceof HTMLDivElement) {
      return existing;
    }
    const el = createEl("div", {
      id: PROGRESS_ID,
      role: "status",
      "aria-live": "polite"
    });
    document.body.appendChild(el);
    return el;
  }
  function updateProgressText(element, state2) {
    element.textContent = `拉取中 ${state2.success}/${state2.total}`;
  }
  function updateFinalText(element, state2) {
    if (state2.failed > 0) {
      element.textContent = `拉取到 ${state2.success}/${state2.total} 种类别，${state2.failed} 条失败`;
      return;
    }
    element.textContent = `拉取完成，共 ${state2.success} 种类别`;
  }
  function showProgress(element) {
    element.classList.add(VISIBLE_CLASS);
  }
  function hideProgress(element) {
    element.classList.remove(VISIBLE_CLASS);
  }
  function clampToTotal(value, total) {
    if (value < 0) {
      return 0;
    }
    return Math.min(value, total);
  }
  function startFetchProgress(total) {
    if (total <= 0) {
      return NOOP_TRACKER;
    }
    const state2 = {
      total,
      success: 0,
      failed: 0,
      done: false
    };
    const element = ensureProgressElement();
    clearHideTimeout();
    element.classList.remove(ERROR_CLASS);
    element.classList.remove(SUCCESS_CLASS);
    updateProgressText(element, state2);
    showProgress(element);
    const advance = (failed) => {
      if (state2.done) {
        return;
      }
      if (failed) {
        state2.failed = clampToTotal(state2.failed + 1, state2.total);
      } else {
        state2.success = clampToTotal(state2.success + 1, state2.total);
      }
      updateProgressText(element, state2);
      showProgress(element);
    };
    return {
      markSuccess: () => advance(false),
      markFailure: () => advance(true),
      finish: (options) => {
        if (state2.done) {
          return;
        }
        state2.done = true;
        clearHideTimeout();
        if (options?.aborted) {
          hideProgress(element);
          element.classList.remove(ERROR_CLASS);
          element.classList.remove(SUCCESS_CLASS);
          return;
        }
        const hasFailed = state2.failed > 0;
        if (hasFailed) {
          element.classList.add(ERROR_CLASS);
          element.classList.remove(SUCCESS_CLASS);
        } else {
          element.classList.remove(ERROR_CLASS);
          element.classList.add(SUCCESS_CLASS);
        }
        updateFinalText(element, state2);
        showProgress(element);
        hideTimeoutId = window.setTimeout(
          () => {
            hideProgress(element);
          },
          hasFailed ? HIDE_DELAY_MS_FAILURE : HIDE_DELAY_MS
        );
      }
    };
  }
  const RETRY_BASE_DELAY_MS = 600;
  const HIERARCHICAL_CATEGORY_ENDPOINT = "https://linux.do/categories/hierarchical_search?term=";
  const HIERARCHICAL_CATEGORY_BATCH_SIZE = 4;
  const CATEGORY_PREFETCH_DELAY_MS = 3e3;
  const UTC_MINUS_8_OFFSET_MS = -8 * 60 * 60 * 1e3;
  const REFRESH_HOUR_UTC_MINUS_8 = 4;
  let hierarchicalCategoryCache = null;
  let hierarchicalCategoryPromise = null;
  let hierarchicalCategoryCacheUpdatedAt = null;
  let prefetchTimeoutId = null;
  const categoryPathCache = new Map();
  let categoryPathCacheLoaded = false;
  function createAbortError() {
    return new DOMException("Aborted", "AbortError");
  }
  function isAbortError$1(error) {
    return error instanceof DOMException && error.name === "AbortError";
  }
  function delay(ms, signal) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(createAbortError());
        return;
      }
      const timerId = window.setTimeout(() => {
        if (signal) {
          signal.removeEventListener("abort", handleAbort);
        }
        resolve();
      }, ms);
      const handleAbort = () => {
        window.clearTimeout(timerId);
        if (signal) {
          signal.removeEventListener("abort", handleAbort);
        }
        reject(createAbortError());
      };
      if (signal) {
        signal.addEventListener("abort", handleAbort, { once: true });
      }
    });
  }
  function parseRetryAfter(headerValue) {
    if (!headerValue) {
      return null;
    }
    const seconds = Number(headerValue);
    if (Number.isFinite(seconds) && seconds > 0) {
      return seconds * 1e3;
    }
    return null;
  }
  function isRetryableStatus(status) {
    return status === 429 || status === 403;
  }
  function canRetry(attempt, maxRetryAttempts) {
    return maxRetryAttempts < 0 || attempt < maxRetryAttempts;
  }
  function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.content ?? null;
  }
  function buildCategoryMap(categories) {
    const map = new Map();
    categories.forEach((category) => {
      map.set(category.id, category);
    });
    return map;
  }
  function loadCategoryPathCache() {
    if (categoryPathCacheLoaded) {
      return;
    }
    categoryPathCacheLoaded = true;
    const stored = getCategoryPathCache();
    if (!stored || typeof stored.updatedAt !== "number" || !stored.paths) {
      return;
    }
    Object.entries(stored.paths).forEach(([key, value]) => {
      const id = Number(key);
      if (Number.isFinite(id) && value) {
        categoryPathCache.set(id, value);
      }
    });
  }
  function persistCategoryPathCache() {
    const paths = {};
    categoryPathCache.forEach((value, key) => {
      paths[String(key)] = value;
    });
    const updatedAt = Date.now();
    saveCategoryPathCache({ updatedAt, paths });
  }
  function extractCategoryBasePath(url, categoryId) {
    try {
      const parsed = new URL(url, window.location.origin);
      const path = parsed.pathname;
      if (!path.startsWith("/c/")) {
        return null;
      }
      const match = path.match(/\/(\d+)(?:\.json)?$/);
      if (!match) {
        return null;
      }
      if (Number(match[1]) !== categoryId) {
        return null;
      }
      return path.replace(/\.json$/, "");
    } catch (error) {
      return null;
    }
  }
  function updateCategoryPathCache(categoryId, url) {
    const resolvedPath = extractCategoryBasePath(url, categoryId);
    if (!resolvedPath) {
      return;
    }
    const current = categoryPathCache.get(categoryId);
    if (current !== resolvedPath) {
      categoryPathCache.set(categoryId, resolvedPath);
      persistCategoryPathCache();
    }
  }
  function buildCategoryTopicsUrl(categoryId, page) {
    loadCategoryPathCache();
    const cachedPath = categoryPathCache.get(categoryId);
    const basePath = cachedPath ?? `/c/${categoryId}`;
    const suffix = page === 0 ? "" : `?page=${page}`;
    return `${window.location.origin}${basePath}.json${suffix}`;
  }
  function loadCategoryMetadataCache() {
    if (hierarchicalCategoryCache) {
      return {
        map: hierarchicalCategoryCache,
        updatedAt: hierarchicalCategoryCacheUpdatedAt
      };
    }
    const cached = getCategoryMetadataCache();
    if (!cached || !Array.isArray(cached.categories) || typeof cached.updatedAt !== "number") {
      return { map: null, updatedAt: null };
    }
    const map = buildCategoryMap(cached.categories);
    hierarchicalCategoryCache = map;
    hierarchicalCategoryCacheUpdatedAt = cached.updatedAt;
    return { map, updatedAt: cached.updatedAt };
  }
  function persistCategoryMetadataCache(map, updatedAt) {
    hierarchicalCategoryCache = map;
    hierarchicalCategoryCacheUpdatedAt = updatedAt;
    saveCategoryMetadataCache({
      updatedAt,
      categories: Array.from(map.values())
    });
  }
  function getUtcMinus8StartOfDay(dateMs) {
    const shifted = new Date(dateMs + UTC_MINUS_8_OFFSET_MS);
    const year = shifted.getUTCFullYear();
    const month = shifted.getUTCMonth();
    const day = shifted.getUTCDate();
    return Date.UTC(year, month, day) - UTC_MINUS_8_OFFSET_MS;
  }
  function getLatestRefreshTimestamp(nowMs) {
    const startOfDay = getUtcMinus8StartOfDay(nowMs);
    const refreshTime = startOfDay + REFRESH_HOUR_UTC_MINUS_8 * 60 * 60 * 1e3;
    if (nowMs >= refreshTime) {
      return refreshTime;
    }
    return refreshTime - 24 * 60 * 60 * 1e3;
  }
  function shouldRefreshCategoryMetadata(updatedAt, nowMs) {
    if (!Number.isFinite(updatedAt)) {
      return true;
    }
    const latestRefresh = getLatestRefreshTimestamp(nowMs);
    return updatedAt < latestRefresh;
  }
  function hasMissingCategories(cachedMap, missingCategoryIds) {
    if (!missingCategoryIds || missingCategoryIds.length === 0) {
      return false;
    }
    if (!cachedMap) {
      return true;
    }
    return missingCategoryIds.some((id) => !cachedMap.has(id));
  }
  function collectMissingCategoryIds(topics, categories, cachedMap) {
    const missing = new Set();
    const check = (id) => {
      if (typeof id !== "number") {
        return;
      }
      if (!cachedMap || !cachedMap.has(id)) {
        missing.add(id);
      }
    };
    topics.forEach((topic) => {
      check(topic.category_id);
      const category = categories.get(topic.category_id);
      if (category?.parent_category_id !== void 0) {
        check(category.parent_category_id ?? null);
      }
    });
    return Array.from(missing);
  }
  function mergeCategoryInfo(base, incoming) {
    if (!base) {
      return incoming;
    }
    return {
      id: base.id,
      name: incoming.name ?? base.name,
      slug: incoming.slug ?? base.slug,
      color: incoming.color ?? base.color,
      text_color: incoming.text_color ?? base.text_color,
      style_type: incoming.style_type ?? base.style_type,
      icon: incoming.icon ?? base.icon,
      emoji: incoming.emoji ?? base.emoji,
      parent_category_id: incoming.parent_category_id ?? base.parent_category_id,
      read_restricted: incoming.read_restricted ?? base.read_restricted,
      description: incoming.description ?? base.description,
      description_text: incoming.description_text ?? base.description_text
    };
  }
  async function fetchHierarchicalCategoryPage(page, signal, maxRetryAttempts = getRequestControlSettings().maxRetryAttempts) {
    const url = `${HIERARCHICAL_CATEGORY_ENDPOINT}&page=${page}`;
    const headers = {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest"
    };
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    let attempt = 0;
    while (true) {
      if (signal?.aborted) {
        throw createAbortError();
      }
      try {
        const response = await fetch(url, {
          signal,
          headers,
          credentials: "same-origin"
        });
        if (response.ok) {
          const data = await response.json();
          return data.categories ?? [];
        }
        if (!isRetryableStatus(response.status) || !canRetry(attempt, maxRetryAttempts)) {
          console.warn(`Failed to fetch hierarchical categories: ${response.status}`);
          return [];
        }
        const retryAfter = parseRetryAfter(response.headers.get("Retry-After"));
        const backoffMs = retryAfter ?? RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        attempt += 1;
        await delay(backoffMs, signal);
      } catch (error) {
        if (isAbortError$1(error)) {
          throw error;
        }
        if (!canRetry(attempt, maxRetryAttempts)) {
          console.warn("Failed to fetch hierarchical categories:", error);
          return [];
        }
        const backoffMs = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        attempt += 1;
        await delay(backoffMs, signal);
      }
    }
  }
  async function fetchHierarchicalCategories(signal, options) {
    const cached = loadCategoryMetadataCache();
    const maxRetryAttempts = getRequestControlSettings().maxRetryAttempts;
    const nowMs = Date.now();
    const hasCache = cached.map && cached.updatedAt !== null;
    const updatedAt = cached.updatedAt ?? 0;
    const isStale = hasCache ? shouldRefreshCategoryMetadata(updatedAt, nowMs) : true;
    const needsFetch = options?.forceRefresh === true || !hasCache || isStale || hasMissingCategories(cached.map, options?.missingCategoryIds);
    if (!needsFetch && cached.map) {
      return cached.map;
    }
    if (hierarchicalCategoryPromise) {
      return hierarchicalCategoryPromise;
    }
    const fetchPromise = (async () => {
      const categories = new Map();
      let page = 1;
      while (true) {
        if (signal?.aborted) {
          throw createAbortError();
        }
        const pages = Array.from(
          { length: HIERARCHICAL_CATEGORY_BATCH_SIZE },
          (_, index) => page + index
        );
        const results = await Promise.all(
          pages.map(
            (targetPage) => fetchHierarchicalCategoryPage(targetPage, signal, maxRetryAttempts)
          )
        );
        let shouldStop = false;
        results.forEach((list) => {
          if (list.length === 0) {
            shouldStop = true;
            return;
          }
          list.forEach((category) => {
            categories.set(category.id, category);
          });
        });
        if (shouldStop) {
          break;
        }
        page += HIERARCHICAL_CATEGORY_BATCH_SIZE;
      }
      if (categories.size > 0) {
        persistCategoryMetadataCache(categories, Date.now());
        return categories;
      }
      return cached.map ?? categories;
    })();
    hierarchicalCategoryPromise = fetchPromise;
    try {
      return await fetchPromise;
    } catch (error) {
      if (isAbortError$1(error)) {
        throw error;
      }
      console.warn("Failed to fetch hierarchical categories:", error);
      return cached.map ?? new Map();
    } finally {
      if (hierarchicalCategoryPromise === fetchPromise) {
        hierarchicalCategoryPromise = null;
      }
    }
  }
  function scheduleCategoryMetadataPrefetch() {
    const schedule = () => {
      if (prefetchTimeoutId !== null) {
        return;
      }
      const cached = loadCategoryMetadataCache();
      const updatedAt = cached.updatedAt;
      const shouldFetch = !cached.map || updatedAt === null || shouldRefreshCategoryMetadata(updatedAt, Date.now());
      if (!shouldFetch) {
        return;
      }
      prefetchTimeoutId = window.setTimeout(() => {
        prefetchTimeoutId = null;
        const latestCached = loadCategoryMetadataCache();
        const latestUpdatedAt = latestCached.updatedAt;
        const shouldFetchNow = !latestCached.map || latestUpdatedAt === null || shouldRefreshCategoryMetadata(latestUpdatedAt, Date.now());
        if (!shouldFetchNow) {
          return;
        }
        fetchHierarchicalCategories(void 0, { forceRefresh: true }).catch(
          (error) => {
            if (!isAbortError$1(error)) {
              console.warn("Failed to prefetch category metadata:", error);
            }
          }
        );
      }, CATEGORY_PREFETCH_DELAY_MS);
    };
    if (document.readyState === "complete" || document.readyState === "interactive") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }
  }
  async function fetchCategoryTopics(categoryId, page = 0, signal, maxRetryAttempts = getRequestControlSettings().maxRetryAttempts) {
    const url = buildCategoryTopicsUrl(categoryId, page);
    let attempt = 0;
    while (true) {
      if (signal?.aborted) {
        throw createAbortError();
      }
      try {
        const response = await fetch(url, { signal });
        if (response.redirected) {
          updateCategoryPathCache(categoryId, response.url);
        }
        if (response.ok) {
          return response.json();
        }
        if (!isRetryableStatus(response.status) || !canRetry(attempt, maxRetryAttempts)) {
          console.warn(`Failed to fetch category ${categoryId}: ${response.status}`);
          return null;
        }
        const retryAfter = parseRetryAfter(response.headers.get("Retry-After"));
        const backoffMs = retryAfter ?? RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        attempt += 1;
        await delay(backoffMs, signal);
      } catch (error) {
        if (isAbortError$1(error)) {
          throw error;
        }
        if (!canRetry(attempt, maxRetryAttempts)) {
          console.warn(`Failed to fetch category ${categoryId}:`, error);
          return null;
        }
        const backoffMs = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        attempt += 1;
        await delay(backoffMs, signal);
      }
    }
  }
  async function fetchMergedTopics(categoryIds, pageOffsets = new Map(), signal) {
    const users = new Map();
    const allTopics = [];
    let hasMore = false;
    const newOffsets = new Map(pageOffsets);
    const categories = new Map();
    const cachedMetadata = loadCategoryMetadataCache();
    const requestSettings = getRequestControlSettings();
    const requestDelayMs = requestSettings.requestDelayMs;
    const maxRetryAttempts = requestSettings.maxRetryAttempts;
    const progress = startFetchProgress(categoryIds.length);
    let nextIndex = 0;
    const worker = async () => {
      while (true) {
        if (signal?.aborted) {
          throw createAbortError();
        }
        const index = nextIndex;
        if (index >= categoryIds.length) {
          return;
        }
        nextIndex += 1;
        const categoryId = categoryIds[index];
        const page = pageOffsets.get(categoryId) ?? 0;
        let response = null;
        try {
          response = await fetchCategoryTopics(categoryId, page, signal, maxRetryAttempts);
        } catch (error) {
          if (isAbortError$1(error)) {
            throw error;
          }
          console.warn(`Failed to fetch category ${categoryId}:`, error);
        }
        if (response) {
          response.users.forEach((u) => users.set(u.id, u));
          allTopics.push(...response.topic_list.topics);
          if (response.category) {
            categories.set(
              response.category.id,
              mergeCategoryInfo(categories.get(response.category.id), response.category)
            );
          }
          if (response.category_list?.categories) {
            response.category_list.categories.forEach((category) => {
              categories.set(
                category.id,
                mergeCategoryInfo(categories.get(category.id), category)
              );
            });
          }
          if (response.topic_list.more_topics_url) {
            hasMore = true;
            newOffsets.set(categoryId, page + 1);
          }
          progress.markSuccess();
        } else {
          progress.markFailure();
        }
        if (requestDelayMs > 0) {
          await delay(requestDelayMs, signal);
        }
      }
    };
    const concurrency = Math.min(requestSettings.concurrency, categoryIds.length);
    const workers = Array.from({ length: concurrency }, () => worker());
    try {
      await Promise.all(workers);
    } catch (error) {
      if (isAbortError$1(error)) {
        progress.finish({ aborted: true });
        throw error;
      }
      progress.finish();
      throw error;
    }
    progress.finish();
    if (cachedMetadata.map) {
      cachedMetadata.map.forEach((category, id) => {
        categories.set(id, mergeCategoryInfo(categories.get(id), category));
      });
    }
    const missingCategoryIds = collectMissingCategoryIds(
      allTopics,
      categories,
      cachedMetadata.map
    );
    const shouldRefresh = cachedMetadata.updatedAt === null || cachedMetadata.updatedAt !== null && shouldRefreshCategoryMetadata(cachedMetadata.updatedAt, Date.now());
    const shouldFetchHierarchy = !cachedMetadata.map || shouldRefresh || missingCategoryIds.length > 0;
    if (shouldFetchHierarchy) {
      const hierarchyCategories = await fetchHierarchicalCategories(signal, {
        forceRefresh: shouldRefresh || !cachedMetadata.map,
        missingCategoryIds
      });
      hierarchyCategories.forEach((category, id) => {
        categories.set(id, mergeCategoryInfo(categories.get(id), category));
      });
    }
    const seen = new Set();
    const topics = allTopics.sort((a, b) => new Date(b.bumped_at).getTime() - new Date(a.bumped_at).getTime()).filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
    return { topics, users, hasMore, pageOffsets: newOffsets, categories };
  }
  const TAG_ICON_LIST_REGEX = /tag_icon_list\s*:\s*["']([^"']*)["']/;
  const TAG_PREFETCH_DELAY_MS = 3e3;
  let tagIconMap = null;
  let tagIconPromise = null;
  let tagPrefetchTimeoutId = null;
  function normalizeTagName(tag) {
    return tag.trim().toLowerCase();
  }
  function buildTagIconMap(entries) {
    const map = new Map();
    entries.forEach((entry) => {
      const key = normalizeTagName(entry.tag);
      if (!key || !entry.icon) {
        return;
      }
      map.set(key, { icon: entry.icon, color: entry.color ?? null });
    });
    return map;
  }
  function loadCachedTagIconMap() {
    if (tagIconMap) {
      return tagIconMap;
    }
    const cache = getTagIconCache();
    if (!cache || !Array.isArray(cache.entries)) {
      return null;
    }
    tagIconMap = buildTagIconMap(cache.entries);
    return tagIconMap;
  }
  function persistTagIconMap(map) {
    tagIconMap = map;
    const entries = [];
    map.forEach((value, key) => {
      entries.push({
        tag: key,
        icon: value.icon,
        color: value.color ?? null
      });
    });
    const cache = {
      updatedAt: Date.now(),
      entries
    };
    saveTagIconCache(cache);
  }
  function decodeTagIconList(raw) {
    try {
      return JSON.parse(`"${raw.replace(/"/g, '\\"')}"`);
    } catch {
      return raw.replace(/\\"/g, '"');
    }
  }
  function parseTagIconList(raw) {
    const map = new Map();
    const normalizedRaw = decodeTagIconList(raw);
    normalizedRaw.split("|").forEach((item) => {
      const [tag, icon, color] = item.split(",").map((value) => value.trim());
      if (!tag || !icon) {
        return;
      }
      map.set(normalizeTagName(tag), {
        icon,
        color: color || null
      });
    });
    return map;
  }
  function getLinkThemeJavascriptUrls() {
    const urls = new Set();
    document.querySelectorAll('link[href*="theme-javascripts"]').forEach((link) => {
      if (link.href) {
        urls.add(link.href);
      }
    });
    return Array.from(urls);
  }
  function getResourceThemeJavascriptUrls() {
    if (typeof performance === "undefined" || !performance.getEntriesByType) {
      return [];
    }
    const urls = new Set();
    performance.getEntriesByType("resource").forEach((entry) => {
      if (typeof entry.name === "string" && entry.name.includes("theme-javascripts")) {
        urls.add(entry.name);
      }
    });
    return Array.from(urls);
  }
  function findThemeJavascriptUrls() {
    const urls = new Set();
    document.querySelectorAll('script[src*="theme-javascripts"]').forEach((script) => {
      if (script.src) {
        urls.add(script.src);
      }
    });
    getLinkThemeJavascriptUrls().forEach((url) => urls.add(url));
    getResourceThemeJavascriptUrls().forEach((url) => urls.add(url));
    return Array.from(urls);
  }
  async function fetchTagIconListFromTheme(signal) {
    const urls = findThemeJavascriptUrls();
    for (const url of urls) {
      const response = await fetch(url, {
        signal,
        credentials: "same-origin"
      });
      if (!response.ok) {
        continue;
      }
      const text = await response.text();
      const match = text.match(TAG_ICON_LIST_REGEX);
      if (match?.[1]) {
        return match[1];
      }
    }
    return null;
  }
  function getCachedTagIconMap() {
    return loadCachedTagIconMap();
  }
  async function ensureTagIconMap(signal) {
    const cached = loadCachedTagIconMap();
    if (cached && cached.size > 0) {
      return cached;
    }
    if (tagIconPromise) {
      return tagIconPromise;
    }
    const fetchPromise = (async () => {
      const list = await fetchTagIconListFromTheme(signal);
      if (!list) {
        return cached ?? null;
      }
      const map = parseTagIconList(list);
      if (map.size > 0) {
        persistTagIconMap(map);
        return map;
      }
      return cached ?? null;
    })();
    tagIconPromise = fetchPromise;
    try {
      return await fetchPromise;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
      console.warn("Failed to fetch tag icons:", error);
      return cached ?? null;
    } finally {
      if (tagIconPromise === fetchPromise) {
        tagIconPromise = null;
      }
    }
  }
  function scheduleTagIconPrefetch() {
    const cached = loadCachedTagIconMap();
    if (cached && cached.size > 0) {
      return;
    }
    if (tagPrefetchTimeoutId !== null) {
      return;
    }
    const schedule = () => {
      tagPrefetchTimeoutId = window.setTimeout(() => {
        tagPrefetchTimeoutId = null;
        ensureTagIconMap().catch((error) => {
          if (!(error instanceof DOMException && error.name === "AbortError")) {
            console.warn("Failed to prefetch tag icons:", error);
          }
        });
      }, TAG_PREFETCH_DELAY_MS);
    };
    if (document.readyState === "complete" || document.readyState === "interactive") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }
  }
  const ADD_BTN_ID = "custom-category-add-btn";
  const TITLE_TEXT_CLASS = "custom-category-title-text";
  const CUSTOM_CHECKBOX_CLASS = "custom-category-checkbox";
  const NAME_INPUT_BOUND_ATTR = "data-custom-name-input-bound";
  const EDIT_PANEL_BOUND_ATTR = "data-custom-category-edit-panel";
  function generateId() {
    return Math.random().toString(36).slice(2, 10);
  }
  const state = {
    isAddMode: false,
    selectedCategoryIds: new Set(),
    originalTitle: "",
    originalDesc: "",
    originalSaveText: "",
    editingGroupId: null,
    nameInputValue: "",
    nameInput: null,
    cleanup: null
  };
  let pendingEditGroup = null;
  function requestEditGroup(group) {
    pendingEditGroup = group;
  }
  function resetState() {
    state.isAddMode = false;
    state.selectedCategoryIds.clear();
    state.editingGroupId = null;
    state.nameInputValue = "";
    state.nameInput = null;
    if (state.cleanup) {
      state.cleanup();
      state.cleanup = null;
    }
  }
  function closeModal(modal) {
    const root = modal.closest(".d-modal") ?? modal;
    const closeBtn = root.querySelector(
      '.d-modal__close, .d-modal__dismiss, button[aria-label="关闭"], button[aria-label="close"], button[data-dismiss="modal"]'
    );
    if (closeBtn) {
      closeBtn.click();
      return;
    }
    const backdrop = root.querySelector(".d-modal__backdrop, .d-modal__overlay, .modal-backdrop");
    if (backdrop) {
      backdrop.click();
      return;
    }
    const keydownEvent = new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true });
    const keyupEvent = new KeyboardEvent("keyup", { key: "Escape", code: "Escape", bubbles: true });
    root.dispatchEvent(keydownEvent);
    document.dispatchEvent(keydownEvent);
    window.dispatchEvent(keydownEvent);
    root.dispatchEvent(keyupEvent);
    document.dispatchEvent(keyupEvent);
    window.dispatchEvent(keyupEvent);
  }
  function getTitleTextElement(titleEl) {
    const existing = titleEl.querySelector(`.${TITLE_TEXT_CLASS}`);
    if (existing) {
      return existing;
    }
    const wrapper = createEl("span", { class: TITLE_TEXT_CLASS });
    while (titleEl.firstChild) {
      wrapper.appendChild(titleEl.firstChild);
    }
    titleEl.appendChild(wrapper);
    return wrapper;
  }
  function getAddButtonHost(container) {
    const modalTitle = container.querySelector(".d-modal__title-text");
    if (modalTitle) {
      return modalTitle;
    }
    const panelTitle = container.querySelector(
      ".sidebar__edit-navigation-menu__title, .sidebar__edit-navigation-menu__header"
    );
    if (panelTitle) {
      return panelTitle;
    }
    return container.querySelector(".sidebar__edit-navigation-menu");
  }
  function enterAddMode(modal, onSave, options) {
    const editingGroup = options?.group ?? null;
    state.isAddMode = true;
    state.selectedCategoryIds.clear();
    if (editingGroup) {
      editingGroup.categoryIds.forEach((id) => state.selectedCategoryIds.add(id));
    }
    state.editingGroupId = editingGroup?.id ?? null;
    state.nameInputValue = editingGroup?.name ?? "";
    const titleEl = modal.querySelector(
      ".d-modal__title-text, .sidebar__edit-navigation-menu__title"
    );
    const titleTextEl = titleEl ? getTitleTextElement(titleEl) : null;
    const descEl = modal.querySelector(".sidebar__edit-navigation-menu__deselect-wrapper");
    const saveBtn = modal.querySelector(".sidebar__edit-navigation-menu__save-button");
    const addBtn = modal.querySelector(`#${ADD_BTN_ID}`);
    const resetButtonSelector = ".sidebar__edit-navigation-menu__reset-defaults-button, .sidebar__edit-navigation-menu__deselect-button";
    const resetButtonText = "清除选中";
    if (titleTextEl) {
      state.originalTitle = titleTextEl.textContent ?? "";
      titleTextEl.textContent = editingGroup ? "编辑自定义类别" : "自定义类别添加";
    }
    if (descEl) {
      state.originalDesc = descEl.textContent ?? "";
      descEl.textContent = "组合多个类别以自定义";
    }
    if (saveBtn) {
      state.originalSaveText = saveBtn.textContent ?? "";
      saveBtn.textContent = editingGroup ? "保存自定义类别" : "添加自定义类别";
    }
    if (addBtn) {
      addBtn.style.display = "none";
    }
    const bindNameInput = (input) => {
      if (input.getAttribute(NAME_INPUT_BOUND_ATTR) === "true") {
        return;
      }
      input.setAttribute(NAME_INPUT_BOUND_ATTR, "true");
      input.addEventListener("input", () => {
        state.nameInputValue = input.value;
      });
    };
    const ensureNameInput = () => {
      const currentDescEl = modal.querySelector(".sidebar__edit-navigation-menu__deselect-wrapper");
      if (!currentDescEl) {
        return;
      }
      const existingNameInput = modal.querySelector("#custom-category-name-wrapper input");
      if (existingNameInput) {
        state.nameInput = existingNameInput;
        bindNameInput(existingNameInput);
        if (existingNameInput.value !== state.nameInputValue) {
          existingNameInput.value = state.nameInputValue;
        }
        return;
      }
      const inputWrapper = createEl("div", {
        id: "custom-category-name-wrapper",
        style: "margin-top: 12px; display: flex; align-items: center; gap: 8px;"
      }, [
        createEl("label", { style: "font-weight: 500;" }, ["自定义类别名:"])
      ]);
      const nameInput = createEl("input", {
        type: "text",
        placeholder: "输入名称",
        style: "flex: 1; padding: 6px 10px; border: 1px solid var(--primary-low); border-radius: 4px;"
      });
      nameInput.value = state.nameInputValue;
      bindNameInput(nameInput);
      inputWrapper.appendChild(nameInput);
      state.nameInput = nameInput;
      currentDescEl.after(inputWrapper);
    };
    const removeFilterDropdown = () => {
      modal.querySelectorAll(".sidebar__edit-navigation-menu__filter-dropdown-wrapper").forEach((node) => {
        node.remove();
      });
    };
    const getResetButton = () => modal.querySelector(resetButtonSelector);
    const updateResetText = () => {
      const resetBtn = getResetButton();
      if (!resetBtn) {
        return;
      }
      const label = resetBtn.querySelector(".d-button-label");
      if (label) {
        const currentText = label.textContent?.trim() ?? "";
        if (currentText !== resetButtonText) {
          label.textContent = resetButtonText;
        }
        return;
      }
      if (resetBtn.textContent?.includes(resetButtonText)) {
        return;
      }
      const fallbackLabel = createEl("span", { class: "d-button-label" }, [resetButtonText]);
      resetBtn.appendChild(fallbackLabel);
    };
    const getForm = () => modal.querySelector(".sidebar-categories-form");
    const parseCategoryId = (rawId) => {
      if (!rawId) {
        return null;
      }
      const id = Number(rawId);
      return Number.isNaN(id) ? null : id;
    };
    const getCategoryIdFromElement = (element) => {
      const row = element?.closest("[data-category-id]");
      if (!row) {
        return null;
      }
      return parseCategoryId(row.dataset.categoryId);
    };
    const syncCustomCheckboxes = () => {
      const form = getForm();
      if (!form) {
        return;
      }
      form.querySelectorAll(`.${CUSTOM_CHECKBOX_CLASS}`).forEach((input) => {
        const id = getCategoryIdFromElement(input);
        if (id === null) {
          return;
        }
        const shouldCheck = state.selectedCategoryIds.has(id);
        if (input.checked !== shouldCheck) {
          input.checked = shouldCheck;
        }
      });
    };
    const ensureCustomCheckboxes = () => {
      const form = getForm();
      if (!form) {
        return;
      }
      form.querySelectorAll("[data-category-id]").forEach((row) => {
        const label = row.querySelector("label.sidebar-categories-form__category-label");
        const originalInput = row.querySelector(".sidebar-categories-form__input");
        if (!label || !originalInput) {
          return;
        }
        const categoryId = getCategoryIdFromElement(row);
        if (categoryId === null) {
          return;
        }
        const customInputId = `custom-category-input--${categoryId}`;
        let customInput = label.querySelector(`#${customInputId}`);
        originalInput.checked = false;
        originalInput.style.display = "none";
        originalInput.setAttribute("aria-hidden", "true");
        originalInput.tabIndex = -1;
        if (!label.dataset.customOriginalFor) {
          label.dataset.customOriginalFor = label.getAttribute("for") ?? "";
        }
        label.setAttribute("for", customInputId);
        if (!customInput) {
          customInput = createEl("input", {
            id: customInputId,
            type: "checkbox",
            class: CUSTOM_CHECKBOX_CLASS,
            style: "margin-left: 8px; display: inline-block; opacity: 1; position: static; pointer-events: auto; appearance: auto; -webkit-appearance: auto;",
            "data-category-id": String(categoryId)
          });
          originalInput.after(customInput);
        }
        if (!customInput.dataset.customCheckboxBound) {
          customInput.dataset.customCheckboxBound = "true";
          customInput.addEventListener("change", (e) => {
            if (!state.isAddMode) return;
            e.stopPropagation();
            const id = getCategoryIdFromElement(customInput);
            if (id === null) {
              return;
            }
            if (customInput.checked) {
              state.selectedCategoryIds.add(id);
            } else {
              state.selectedCategoryIds.delete(id);
            }
          });
        }
      });
      syncCustomCheckboxes();
    };
    const clearSelections = () => {
      state.selectedCategoryIds.clear();
      syncCustomCheckboxes();
    };
    const applyAddModeDecorations = () => {
      if (!state.isAddMode) {
        return;
      }
      removeFilterDropdown();
      ensureNameInput();
      ensureCustomCheckboxes();
      updateResetText();
    };
    const formObserver = new MutationObserver(() => {
      applyAddModeDecorations();
    });
    formObserver.observe(modal, { childList: true, subtree: true });
    applyAddModeDecorations();
    if (editingGroup) {
      syncCustomCheckboxes();
    } else {
      clearSelections();
    }
    const formCleanup = state.cleanup;
    state.cleanup = () => {
      formCleanup?.();
      formObserver.disconnect();
    };
    const handleReset = (e) => {
      if (!state.isAddMode) return;
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const resetBtn = target.closest(resetButtonSelector);
      if (!resetBtn) return;
      e.preventDefault();
      e.stopPropagation();
      clearSelections();
    };
    modal.addEventListener("click", handleReset, true);
    const resetCleanup = () => {
      modal.removeEventListener("click", handleReset, true);
    };
    const originalCleanup = state.cleanup;
    state.cleanup = () => {
      originalCleanup?.();
      resetCleanup();
    };
    if (saveBtn) {
      const handleSave = (e) => {
        if (!state.isAddMode) return;
        e.preventDefault();
        e.stopPropagation();
        const name = (state.nameInputValue || state.nameInput?.value || "").trim();
        if (!name) {
          alert("请输入自定义类别名");
          return;
        }
        if (state.selectedCategoryIds.size === 0) {
          alert("请至少选择一个类别");
          return;
        }
        const categoryIds = Array.from(state.selectedCategoryIds);
        if (state.editingGroupId) {
          const updatedGroup = {
            id: state.editingGroupId,
            name,
            categoryIds
          };
          updateCategoryGroup(updatedGroup);
        } else {
          const newGroup = {
            id: generateId(),
            name,
            categoryIds
          };
          addCategoryGroup(newGroup);
        }
        closeModal(modal);
        onSave();
      };
      saveBtn.addEventListener("click", handleSave, true);
      const originalCleanup2 = state.cleanup;
      state.cleanup = () => {
        originalCleanup2?.();
        saveBtn.removeEventListener("click", handleSave, true);
      };
    }
  }
  function injectAddButton(modal, onSave) {
    if (modal.querySelector(`#${ADD_BTN_ID}`)) return;
    const host = getAddButtonHost(modal);
    if (!host) return;
    if (host.classList.contains("d-modal__title-text")) {
      getTitleTextElement(host);
    }
    const btn = createEl("button", {
      id: ADD_BTN_ID,
      class: "btn btn-small btn-primary",
      style: "margin-left: 12px; font-size: 12px; white-space: nowrap; vertical-align: middle;",
      type: "button"
    }, ["添加自定义类别"]);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      enterAddMode(modal, onSave);
    });
    host.appendChild(btn);
  }
  function initModalObserver(onSave) {
    const enhancePanel = (container) => {
      if (!getAddButtonHost(container)) {
        return;
      }
      if (container.getAttribute(EDIT_PANEL_BOUND_ATTR) === "true") {
        return;
      }
      container.setAttribute(EDIT_PANEL_BOUND_ATTR, "true");
      injectAddButton(container, onSave);
      if (pendingEditGroup) {
        const group = pendingEditGroup;
        pendingEditGroup = null;
        enterAddMode(container, onSave, { group });
      }
    };
    const findEditPanelContainer = (node) => {
      if (node.matches(".d-modal__container") && node.querySelector(".sidebar-categories-form")) {
        return node;
      }
      const modal = node.querySelector(".d-modal__container");
      if (modal && modal.querySelector(".sidebar-categories-form")) {
        return modal;
      }
      if (node.matches(".sidebar__edit-navigation-menu") && node.querySelector(".sidebar-categories-form")) {
        return node;
      }
      const panel = node.querySelector(".sidebar__edit-navigation-menu");
      if (panel && panel.querySelector(".sidebar-categories-form")) {
        return panel;
      }
      if (node.matches(".sidebar-categories-form")) {
        return node.closest(".sidebar__edit-navigation-menu") ?? node.closest(".d-modal__container") ?? node.parentElement;
      }
      const form = node.querySelector(".sidebar-categories-form");
      if (form) {
        return form.closest(".sidebar__edit-navigation-menu") ?? form.closest(".d-modal__container") ?? form.parentElement;
      }
      return null;
    };
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          const container = findEditPanelContainer(node);
          if (container) {
            enhancePanel(container);
          }
        }
        for (const node of mutation.removedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.getAttribute(EDIT_PANEL_BOUND_ATTR) === "true" || node.querySelector?.(`[${EDIT_PANEL_BOUND_ATTR}="true"]`)) {
            resetState();
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const initialPanels = document.querySelectorAll(
      ".d-modal__container, .sidebar__edit-navigation-menu"
    );
    initialPanels.forEach((panel) => {
      if (panel.querySelector(".sidebar-categories-form")) {
        enhancePanel(panel);
      }
    });
  }
  const CATEGORY_LIST_SELECTOR$2 = "#sidebar-section-content-categories";
  const CATEGORY_SECTION_SELECTOR = '[data-section-name="categories"]';
  const CUSTOM_ITEM_CLASS = "custom-category-group-item";
  const CUSTOM_ACTIONS_CLASS = "custom-category-group-actions";
  const CUSTOM_ACTION_CLASS = "custom-category-action";
  const CUSTOM_STYLE_ID = "custom-category-group-style";
  const ACTIVE_CLASS = "active";
  const LISTENER_ATTACHED_ATTR = "data-custom-group-listener";
  const DRAG_LISTENER_ATTR = "data-custom-group-dnd";
  const CUSTOM_DRAG_HANDLE_CLASS = "custom-category-drag-handle";
  const CUSTOM_DRAGGING_CLASS = "custom-category-dragging";
  const CUSTOM_DROP_TARGET_CLASS = "custom-category-drop-target";
  const DROP_POSITION_ATTR = "data-drop-position";
  let activeGroupId = null;
  let draggingGroupId = null;
  let dropTargetId = null;
  let isDragging = false;
  let dropPosition = "before";
  let activePointerId = null;
  let activeTouchId = null;
  function buildCustomGroupHref(name) {
    const trimmed = name.trim();
    if (!trimmed) {
      return "#";
    }
    return `${CUSTOM_URL_PREFIX}${encodeURIComponent(trimmed)}`;
  }
  function clearActiveLinks(list) {
    list.querySelectorAll(".sidebar-section-link.active").forEach((link) => {
      link.classList.remove(ACTIVE_CLASS);
      link.removeAttribute("aria-current");
    });
  }
  function clearActiveCustomLinks(list) {
    list.querySelectorAll(
      `a.sidebar-section-link[data-custom-group-id].${ACTIVE_CLASS}`
    ).forEach((link) => {
      link.classList.remove(ACTIVE_CLASS);
      link.removeAttribute("aria-current");
    });
  }
  function ensureListListener(list) {
    if (list.getAttribute(LISTENER_ATTACHED_ATTR) === "true") {
      return;
    }
    list.setAttribute(LISTENER_ATTACHED_ATTR, "true");
    list.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : event.target instanceof Node ? event.target.parentElement : null;
      if (!target) {
        return;
      }
      const link = target.closest("a.sidebar-section-link");
      if (!link || link.getAttribute("data-custom-group-id")) {
        return;
      }
      activeGroupId = null;
      clearActiveCustomLinks(list);
    });
  }
  function applyActiveGroup(list) {
    if (!activeGroupId) {
      return;
    }
    const link = list.querySelector(
      `a.sidebar-section-link[data-custom-group-id="${activeGroupId}"]`
    );
    if (!link) {
      activeGroupId = null;
      return;
    }
    clearActiveLinks(list);
    link.classList.add(ACTIVE_CLASS);
    link.setAttribute("aria-current", "page");
  }
  function setActiveCustomGroup(groupId) {
    activeGroupId = groupId;
    const list = document.querySelector(CATEGORY_LIST_SELECTOR$2);
    if (!list) {
      return;
    }
    const link = list.querySelector(
      `a.sidebar-section-link[data-custom-group-id="${groupId}"]`
    );
    if (!link) {
      return;
    }
    clearActiveLinks(list);
    link.classList.add(ACTIVE_CLASS);
    link.setAttribute("aria-current", "page");
  }
  function clearActiveCustomGroup() {
    activeGroupId = null;
    const list = document.querySelector(CATEGORY_LIST_SELECTOR$2);
    if (!list) {
      return;
    }
    clearActiveCustomLinks(list);
  }
  function ensureCustomStyles() {
    if (document.getElementById(CUSTOM_STYLE_ID)) {
      return;
    }
    const styles = `
    .${CUSTOM_ITEM_CLASS} .${CUSTOM_ACTIONS_CLASS} {
      opacity: 0;
      pointer-events: none;
      margin-left: auto;
      display: inline-flex;
      gap: 6px;
      transition: opacity 0.15s ease;
    }

    .${CUSTOM_ITEM_CLASS}:hover .${CUSTOM_ACTIONS_CLASS},
    .${CUSTOM_ITEM_CLASS}:focus-within .${CUSTOM_ACTIONS_CLASS} {
      opacity: 1;
      pointer-events: auto;
    }

    .${CUSTOM_ITEM_CLASS} .${CUSTOM_ACTION_CLASS} {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      cursor: pointer;
    }

    .${CUSTOM_ITEM_CLASS} .${CUSTOM_ACTION_CLASS}:hover {
      background: var(--primary-low, rgba(0, 0, 0, 0.08));
    }

    .${CUSTOM_ITEM_CLASS} .${CUSTOM_DRAG_HANDLE_CLASS} {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      opacity: 0;
      pointer-events: none;
      color: var(--primary-medium, #888);
      cursor: grab;
      touch-action: none;
      transition: opacity 0.15s ease;
    }

    .mobile-view .${CUSTOM_ITEM_CLASS} .${CUSTOM_DRAG_HANDLE_CLASS} {
      opacity: 1;
      pointer-events: auto;
    }

    .${CUSTOM_ITEM_CLASS}:hover .${CUSTOM_DRAG_HANDLE_CLASS} {
      opacity: 1;
      pointer-events: auto;
    }

    .${CUSTOM_ITEM_CLASS}.${CUSTOM_DRAGGING_CLASS} {
      opacity: 0.6;
    }

    .${CUSTOM_ITEM_CLASS}.${CUSTOM_DROP_TARGET_CLASS} {
      background: var(--primary-low, rgba(0, 0, 0, 0.06));
      border-radius: 6px;
    }

    .${CUSTOM_ITEM_CLASS}.${CUSTOM_DROP_TARGET_CLASS}[${DROP_POSITION_ATTR}="before"] {
      box-shadow: inset 0 2px 0 var(--primary-medium, rgba(0, 0, 0, 0.2));
    }

    .${CUSTOM_ITEM_CLASS}.${CUSTOM_DROP_TARGET_CLASS}[${DROP_POSITION_ATTR}="after"] {
      box-shadow: inset 0 -2px 0 var(--primary-medium, rgba(0, 0, 0, 0.2));
    }
  `;
    const styleEl = createEl("style", { id: CUSTOM_STYLE_ID }, [styles]);
    document.head.appendChild(styleEl);
  }
  function createIconSvg(icon) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute(
      "class",
      `fa d-icon d-icon-${icon} svg-icon fa-width-auto svg-string`
    );
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#${icon}`);
    svg.appendChild(use);
    return svg;
  }
  function createAction(label, icon, onActivate) {
    const action = createEl("span", {
      class: CUSTOM_ACTION_CLASS,
      role: "button",
      tabindex: "0",
      title: label,
      "aria-label": label
    });
    action.appendChild(createIconSvg(icon));
    const handleActivate = (event) => {
      event.preventDefault();
      event.stopPropagation();
      onActivate();
    };
    action.addEventListener("click", handleActivate);
    action.addEventListener("keydown", (event) => {
      if (!(event instanceof KeyboardEvent)) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        handleActivate(event);
      }
    });
    return action;
  }
  function createDragHandle() {
    const handle = createEl("span", {
      class: CUSTOM_DRAG_HANDLE_CLASS,
      draggable: "true",
      role: "button",
      tabindex: "0",
      title: "拖拽排序",
      "aria-label": "拖拽排序"
    });
    handle.appendChild(createIconSvg("grip-lines"));
    handle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    return handle;
  }
  function openCategoryEditModal() {
    const editButton = document.querySelector(
      `${CATEGORY_SECTION_SELECTOR} .sidebar-section-header-button`
    );
    editButton?.click();
  }
  function createCustomItem(group, onGroupClick, onRefresh) {
    const actions = createEl("span", {
      class: `sidebar-section-link-suffix ${CUSTOM_ACTIONS_CLASS}`
    });
    const handleEdit = () => {
      requestEditGroup(group);
      openCategoryEditModal();
    };
    const handleDelete = () => {
      const confirmed = confirm(`确认删除自定义类别“${group.name}”？`);
      if (!confirmed) {
        return;
      }
      deleteCategoryGroup(group.id);
      onRefresh();
    };
    actions.append(
      createAction("编辑", "pencil", handleEdit),
      createAction("删除", "trash-can", handleDelete)
    );
    const link = createEl(
      "a",
      {
        class: "sidebar-section-link sidebar-row",
        href: buildCustomGroupHref(group.name),
        draggable: "false",
        "data-custom-group-id": group.id
      },
      [
        createEl("span", { class: "sidebar-section-link-prefix icon" }, [
          createDragHandle()
        ]),
        createEl("span", { class: "sidebar-section-link-content-text" }, [
          group.name
        ]),
        actions
      ]
    );
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (isDragging) {
        return;
      }
      onGroupClick(group);
    });
    const li = createEl("li", {
      class: `sidebar-section-link-wrapper ${CUSTOM_ITEM_CLASS}`,
      "data-custom-group-id": group.id
    });
    li.appendChild(link);
    return li;
  }
  function getCustomItemFromTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    if (!element) {
      return null;
    }
    const item = element.closest(
      `.${CUSTOM_ITEM_CLASS}[data-custom-group-id]`
    );
    return item ?? null;
  }
  function clearDropTarget(list) {
    if (!dropTargetId) {
      return;
    }
    const current = list.querySelector(
      `.${CUSTOM_ITEM_CLASS}[data-custom-group-id="${dropTargetId}"]`
    );
    current?.classList.remove(CUSTOM_DROP_TARGET_CLASS);
    if (current) {
      delete current.dataset.dropPosition;
    }
    dropTargetId = null;
    dropPosition = "before";
  }
  function setDropTarget(list, groupId, position) {
    if (dropTargetId === groupId && dropPosition === position) {
      return;
    }
    clearDropTarget(list);
    const next = list.querySelector(
      `.${CUSTOM_ITEM_CLASS}[data-custom-group-id="${groupId}"]`
    );
    if (next) {
      next.classList.add(CUSTOM_DROP_TARGET_CLASS);
      next.dataset.dropPosition = position;
      dropTargetId = groupId;
      dropPosition = position;
    }
  }
  function reorderGroups(sourceId, targetId, position) {
    if (sourceId === targetId) {
      return false;
    }
    const groups = getCategoryGroups();
    const fromIndex = groups.findIndex((group) => group.id === sourceId);
    const toIndex = groups.findIndex((group) => group.id === targetId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
      return false;
    }
    const nextGroups = [...groups];
    const [moved] = nextGroups.splice(fromIndex, 1);
    let insertIndex = position === "after" ? toIndex + 1 : toIndex;
    if (fromIndex < insertIndex) {
      insertIndex -= 1;
    }
    insertIndex = Math.max(0, Math.min(insertIndex, nextGroups.length));
    nextGroups.splice(insertIndex, 0, moved);
    saveCategoryGroups(nextGroups);
    return true;
  }
  function resolveDropPosition(item, clientY) {
    const rect = item.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    return clientY > midpoint ? "after" : "before";
  }
  function startDragging(item, groupId) {
    draggingGroupId = groupId;
    isDragging = true;
    item.classList.add(CUSTOM_DRAGGING_CLASS);
  }
  function finishDragging(list) {
    if (draggingGroupId) {
      const item = list.querySelector(
        `.${CUSTOM_ITEM_CLASS}[data-custom-group-id="${draggingGroupId}"]`
      );
      item?.classList.remove(CUSTOM_DRAGGING_CLASS);
    }
    draggingGroupId = null;
    isDragging = false;
    clearDropTarget(list);
  }
  function applyDropIfNeeded(onRefresh) {
    if (!draggingGroupId || !dropTargetId) {
      return;
    }
    const didMove = reorderGroups(draggingGroupId, dropTargetId, dropPosition);
    if (didMove) {
      onRefresh();
    }
  }
  function updateDropTargetFromPoint(list, clientX, clientY) {
    if (!draggingGroupId) {
      return;
    }
    const element = document.elementFromPoint(clientX, clientY);
    const item = getCustomItemFromTarget(element);
    if (!item) {
      clearDropTarget(list);
      return;
    }
    const groupId = item.getAttribute("data-custom-group-id");
    if (!groupId || groupId === draggingGroupId) {
      clearDropTarget(list);
      return;
    }
    const position = resolveDropPosition(item, clientY);
    setDropTarget(list, groupId, position);
  }
  function findTouchById(touches, id) {
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches.item(i);
      if (touch && touch.identifier === id) {
        return touch;
      }
    }
    return null;
  }
  function ensureDragAndDrop(list, onRefresh) {
    if (list.getAttribute(DRAG_LISTENER_ATTR) === "true") {
      return;
    }
    list.setAttribute(DRAG_LISTENER_ATTR, "true");
    list.addEventListener("dragstart", (event) => {
      const target = event.target;
      const handle = target instanceof Element ? target.closest(`.${CUSTOM_DRAG_HANDLE_CLASS}`) : null;
      if (!handle) {
        return;
      }
      const item = handle.closest(
        `.${CUSTOM_ITEM_CLASS}[data-custom-group-id]`
      );
      if (!item) {
        return;
      }
      const groupId = item.getAttribute("data-custom-group-id");
      if (!groupId) {
        return;
      }
      startDragging(item, groupId);
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", groupId);
      }
    });
    list.addEventListener("dragend", () => {
      finishDragging(list);
    });
    list.addEventListener("dragover", (event) => {
      if (!draggingGroupId) {
        return;
      }
      const item = getCustomItemFromTarget(event.target);
      if (!item) {
        clearDropTarget(list);
        return;
      }
      const groupId = item.getAttribute("data-custom-group-id");
      if (!groupId || groupId === draggingGroupId) {
        clearDropTarget(list);
        return;
      }
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
      const position = resolveDropPosition(item, event.clientY);
      setDropTarget(list, groupId, position);
    });
    list.addEventListener("drop", (event) => {
      if (!draggingGroupId) {
        return;
      }
      const item = getCustomItemFromTarget(event.target);
      if (!item) {
        return;
      }
      const groupId = item.getAttribute("data-custom-group-id");
      if (!groupId || groupId === draggingGroupId) {
        return;
      }
      event.preventDefault();
      applyDropIfNeeded(onRefresh);
      finishDragging(list);
    });
    const supportsPointer = "PointerEvent" in window;
    if (supportsPointer) {
      list.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "touch") {
          return;
        }
        const target = event.target;
        const handle = target instanceof Element ? target.closest(`.${CUSTOM_DRAG_HANDLE_CLASS}`) : null;
        if (!handle) {
          return;
        }
        const item = handle.closest(
          `.${CUSTOM_ITEM_CLASS}[data-custom-group-id]`
        );
        if (!item) {
          return;
        }
        const groupId = item.getAttribute("data-custom-group-id");
        if (!groupId) {
          return;
        }
        event.preventDefault();
        activePointerId = event.pointerId;
        startDragging(item, groupId);
        if (handle instanceof HTMLElement) {
          handle.setPointerCapture(event.pointerId);
        }
        updateDropTargetFromPoint(list, event.clientX, event.clientY);
      });
      list.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "touch") {
          return;
        }
        if (!draggingGroupId || activePointerId !== event.pointerId) {
          return;
        }
        event.preventDefault();
        updateDropTargetFromPoint(list, event.clientX, event.clientY);
      });
      const handlePointerEnd = (event) => {
        if (event.pointerType !== "touch") {
          return;
        }
        if (!draggingGroupId || activePointerId !== event.pointerId) {
          return;
        }
        event.preventDefault();
        applyDropIfNeeded(onRefresh);
        activePointerId = null;
        finishDragging(list);
      };
      list.addEventListener("pointerup", handlePointerEnd);
      list.addEventListener("pointercancel", handlePointerEnd);
      return;
    }
    list.addEventListener(
      "touchstart",
      (event) => {
        const target = event.target;
        const handle = target instanceof Element ? target.closest(`.${CUSTOM_DRAG_HANDLE_CLASS}`) : null;
        if (!handle) {
          return;
        }
        const item = handle.closest(
          `.${CUSTOM_ITEM_CLASS}[data-custom-group-id]`
        );
        if (!item) {
          return;
        }
        const groupId = item.getAttribute("data-custom-group-id");
        if (!groupId) {
          return;
        }
        const touch = event.touches.item(0);
        if (!touch) {
          return;
        }
        activeTouchId = touch.identifier;
        startDragging(item, groupId);
        updateDropTargetFromPoint(list, touch.clientX, touch.clientY);
        event.preventDefault();
      },
      { passive: false }
    );
    list.addEventListener(
      "touchmove",
      (event) => {
        if (!draggingGroupId || activeTouchId === null) {
          return;
        }
        const touch = findTouchById(event.touches, activeTouchId);
        if (!touch) {
          return;
        }
        updateDropTargetFromPoint(list, touch.clientX, touch.clientY);
        event.preventDefault();
      },
      { passive: false }
    );
    const handleTouchEnd = (event) => {
      if (!draggingGroupId || activeTouchId === null) {
        return;
      }
      const endedTouch = findTouchById(event.changedTouches, activeTouchId);
      if (!endedTouch) {
        return;
      }
      applyDropIfNeeded(onRefresh);
      activeTouchId = null;
      finishDragging(list);
    };
    list.addEventListener("touchend", handleTouchEnd);
    list.addEventListener("touchcancel", handleTouchEnd);
  }
  function renderCustomGroups(list, onGroupClick) {
    ensureCustomStyles();
    ensureListListener(list);
    ensureDragAndDrop(list, () => refreshSidebar(onGroupClick));
    list.querySelectorAll(`.${CUSTOM_ITEM_CLASS}`).forEach((item) => item.remove());
    const groups = getCategoryGroups();
    if (groups.length === 0) {
      return;
    }
    const fragment = document.createDocumentFragment();
    const refresh = () => refreshSidebar(onGroupClick);
    groups.forEach((group) => {
      fragment.appendChild(createCustomItem(group, onGroupClick, refresh));
    });
    list.insertBefore(fragment, list.firstChild);
    applyActiveGroup(list);
  }
  async function injectSidebar(onGroupClick) {
    const list = await waitForElement(CATEGORY_LIST_SELECTOR$2);
    renderCustomGroups(list, onGroupClick);
  }
  function refreshSidebar(onGroupClick) {
    const list = document.querySelector(CATEGORY_LIST_SELECTOR$2);
    if (!list) {
      return;
    }
    renderCustomGroups(list, onGroupClick);
  }
  const EMOJI_ENDPOINT = `${window.location.origin}/emojis.json`;
  const CUSTOM_LIST_CONTAINER_ID$1 = "custom-topic-list-container";
  const EMOJI_TEXT_ATTR = "data-emoji-text";
  const EMOJI_RENDERED_ATTR = "data-emoji-rendered";
  const EMOJI_IMAGE_CLASS = "emoji";
  const EMOJI_PATTERN = /:([a-zA-Z0-9_+-]+):/g;
  let emojiMap = null;
  let emojiPromise = null;
  function buildEmojiMap(entries) {
    const map = new Map();
    entries.forEach((entry) => {
      if (!entry.name || !entry.url) {
        return;
      }
      map.set(entry.name, entry.url);
    });
    return map;
  }
  function loadEmojiCache() {
    if (emojiMap) {
      return emojiMap;
    }
    const cache = getEmojiCache();
    if (!cache || !Array.isArray(cache.entries) || typeof cache.updatedAt !== "number") {
      return null;
    }
    emojiMap = buildEmojiMap(cache.entries);
    return emojiMap;
  }
  function persistEmojiCache(map) {
    emojiMap = map;
    const entries = [];
    map.forEach((url, name) => {
      entries.push({ name, url });
    });
    const cache = {
      updatedAt: Date.now(),
      entries
    };
    saveEmojiCache(cache);
  }
  function normalizeEmojiUrl(url) {
    try {
      return new URL(url, window.location.origin).href;
    } catch (error) {
      return url;
    }
  }
  function parseEmojiResponse(data) {
    const entries = [];
    Object.values(data).forEach((groupList) => {
      if (!Array.isArray(groupList)) {
        return;
      }
      groupList.forEach((entry) => {
        if (!entry?.name || !entry.url) {
          return;
        }
        entries.push({
          name: entry.name,
          url: normalizeEmojiUrl(entry.url)
        });
      });
    });
    return buildEmojiMap(entries);
  }
  async function fetchEmojiMap(signal) {
    const response = await fetch(EMOJI_ENDPOINT, {
      signal,
      credentials: "same-origin"
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    const map = parseEmojiResponse(data);
    return map.size > 0 ? map : null;
  }
  function extractEmojiNames(text) {
    const names = [];
    EMOJI_PATTERN.lastIndex = 0;
    let match;
    while (match = EMOJI_PATTERN.exec(text)) {
      names.push(match[1]);
    }
    return names;
  }
  function markEmojiText(span, text) {
    const names = extractEmojiNames(text);
    if (names.length === 0) {
      return;
    }
    span.setAttribute(EMOJI_TEXT_ATTR, text);
  }
  function findMissingEmojiNames(texts, map) {
    const missing = new Set();
    for (const text of texts) {
      const names = extractEmojiNames(text);
      names.forEach((name) => {
        if (!map || !map.has(name)) {
          missing.add(name);
        }
      });
    }
    return Array.from(missing);
  }
  function getCachedEmojiMap() {
    return loadEmojiCache();
  }
  function hasMissingEmojis(map, names) {
    if (names.length === 0) {
      return map === null;
    }
    if (!map) {
      return true;
    }
    return names.some((name) => !map.has(name));
  }
  async function ensureEmojiMap(signal, missingNames = []) {
    const cached = loadEmojiCache();
    const shouldFetch = hasMissingEmojis(cached, missingNames);
    if (!shouldFetch && cached) {
      return cached;
    }
    if (emojiPromise) {
      return emojiPromise;
    }
    const fetchPromise = (async () => {
      const map = await fetchEmojiMap(signal);
      if (map && map.size > 0) {
        persistEmojiCache(map);
        return map;
      }
      return cached ?? null;
    })();
    emojiPromise = fetchPromise;
    try {
      return await fetchPromise;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
      console.warn("Failed to fetch emojis:", error);
      return cached ?? null;
    } finally {
      if (emojiPromise === fetchPromise) {
        emojiPromise = null;
      }
    }
  }
  function buildEmojiNodes(text, map) {
    const nodes = [];
    let lastIndex = 0;
    let match;
    EMOJI_PATTERN.lastIndex = 0;
    while (match = EMOJI_PATTERN.exec(text)) {
      const start = match.index;
      if (start > lastIndex) {
        nodes.push(document.createTextNode(text.slice(lastIndex, start)));
      }
      const name = match[1];
      const url = map.get(name);
      if (url) {
        const img = document.createElement("img");
        img.src = url;
        img.width = 20;
        img.height = 20;
        img.alt = name;
        img.title = name;
        img.className = EMOJI_IMAGE_CLASS;
        nodes.push(img);
      } else {
        nodes.push(document.createTextNode(match[0]));
      }
      lastIndex = start + match[0].length;
    }
    if (lastIndex < text.length) {
      nodes.push(document.createTextNode(text.slice(lastIndex)));
    }
    return nodes;
  }
  function applyEmojiToCustomList(map) {
    const container = document.getElementById(CUSTOM_LIST_CONTAINER_ID$1);
    if (!container) {
      return;
    }
    container.querySelectorAll(`span[${EMOJI_TEXT_ATTR}]`).forEach((span) => {
      const rawText = span.getAttribute(EMOJI_TEXT_ATTR);
      if (!rawText) {
        return;
      }
      if (span.getAttribute(EMOJI_RENDERED_ATTR) === rawText) {
        return;
      }
      const nodes = buildEmojiNodes(rawText, map);
      span.textContent = "";
      span.append(...nodes);
      span.setAttribute(EMOJI_RENDERED_ATTR, rawText);
    });
  }
  const LOADING_INDICATOR_SELECTOR = ".loading-indicator-container";
  const LOADING_STATE_CLASSES = ["ready", "loading", "done"];
  const LOADING_READY_DELAY_MS = 400;
  let readyTimeoutId = null;
  const CUSTOM_VIEW_CLASS = "custom-category-view-active";
  const CUSTOM_VIEW_STYLE_ID = "custom-category-view-style";
  const LIST_CONTROLS_SELECTOR = ".list-controls";
  const HEADER_LIST_ID = "header-list-area";
  const SHOW_MORE_SELECTOR = ".contents .show-more.has-topics";
  const LIST_AREA_SELECTOR$1 = "#list-area";
  const CONTENTS_SELECTOR = "#list-area .contents";
  const CUSTOM_LIST_CONTAINER_ID = "custom-topic-list-container";
  const CUSTOM_LIST_CONTAINER_CLASS = "custom-topic-list-container";
  const CUSTOM_LIST_BODY_ID = "custom-topic-list-body";
  const CATEGORY_LIST_SELECTOR$1 = "#sidebar-section-content-categories";
  const ACTIVE_CATEGORY_SELECTOR = `${CATEGORY_LIST_SELECTOR$1} a.sidebar-section-link.active:not([data-custom-group-id])`;
  let customViewObserver = null;
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const CATEGORY_ICON_CACHE = new Map();
  const TOPIC_LINK_REL = "noopener noreferrer";
  let isTagIconFetchPending = false;
  let isEmojiFetchPending = false;
  let heatSettingsCache = null;
  function isMobileView() {
    return document.documentElement.classList.contains("mobile-view");
  }
  function applyTopicLinkTarget(link) {
    if (!getOpenTopicInNewTab()) {
      return link;
    }
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", TOPIC_LINK_REL);
    return link;
  }
  function getLoadingIndicator() {
    return document.querySelector(LOADING_INDICATOR_SELECTOR);
  }
  function setLoadingState(state2) {
    const indicator = getLoadingIndicator();
    if (!indicator) {
      return;
    }
    LOADING_STATE_CLASSES.forEach((value) => indicator.classList.remove(value));
    indicator.classList.add(state2);
  }
  function clearReadyTimeout() {
    if (readyTimeoutId === null) {
      return;
    }
    window.clearTimeout(readyTimeoutId);
    readyTimeoutId = null;
  }
  function ensureCustomViewStyles() {
    if (document.getElementById(CUSTOM_VIEW_STYLE_ID)) {
      return;
    }
    const styles = `
    #${CUSTOM_LIST_CONTAINER_ID} {
      display: none;
    }

    .${CUSTOM_VIEW_CLASS} #${CUSTOM_LIST_CONTAINER_ID} {
      display: block;
    }

    .${CUSTOM_VIEW_CLASS} ${CONTENTS_SELECTOR}:not(#${CUSTOM_LIST_CONTAINER_ID}) {
      display: none !important;
    }

    .${CUSTOM_VIEW_CLASS} ${LIST_CONTROLS_SELECTOR},
    .${CUSTOM_VIEW_CLASS} #${HEADER_LIST_ID},
    .${CUSTOM_VIEW_CLASS} ${SHOW_MORE_SELECTOR} {
      display: none !important;
    }

    .mobile-view.${CUSTOM_VIEW_CLASS} #${CUSTOM_LIST_CONTAINER_ID} {
      padding: 0 8px;
    }

    .mobile-view.${CUSTOM_VIEW_CLASS} #${CUSTOM_LIST_CONTAINER_ID} .topic-list {
      width: 100%;
    }

    .mobile-view.${CUSTOM_VIEW_CLASS} #${CUSTOM_LIST_CONTAINER_ID} .topic-list-data {
      padding-left: 0;
      padding-right: 0;
    }

    .mobile-view.${CUSTOM_VIEW_CLASS} #${CUSTOM_LIST_CONTAINER_ID} .topic-item-metadata {
      width: 100%;
    }
  `;
    const styleEl = createEl("style", { id: CUSTOM_VIEW_STYLE_ID }, [styles]);
    document.head.appendChild(styleEl);
  }
  function clearActiveCategorySelection() {
    document.querySelectorAll(ACTIVE_CATEGORY_SELECTOR).forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });
  }
  function cloneTopicListHeader() {
    const existingHeader = document.querySelector(".topic-list thead");
    if (!(existingHeader instanceof HTMLTableSectionElement)) {
      return null;
    }
    const cloned = existingHeader.cloneNode(true);
    if (cloned instanceof HTMLTableSectionElement) {
      return cloned;
    }
    return null;
  }
  function cloneTopicListCaption() {
    const existingCaption = document.querySelector(".topic-list caption");
    if (!(existingCaption instanceof HTMLTableCaptionElement)) {
      return null;
    }
    const cloned = existingCaption.cloneNode(true);
    if (cloned instanceof HTMLTableCaptionElement) {
      return cloned;
    }
    return null;
  }
  function getTopicListTableAttributes() {
    const table = document.querySelector(".topic-list");
    const attrs = {};
    if (table?.className) {
      attrs.class = table.className;
    } else {
      attrs.class = "topic-list";
    }
    const ariaLabelledBy = table?.getAttribute("aria-labelledby");
    if (ariaLabelledBy) {
      attrs["aria-labelledby"] = ariaLabelledBy;
    }
    return attrs;
  }
  function ensureCustomListContainer() {
    const existing = document.getElementById(CUSTOM_LIST_CONTAINER_ID);
    const listArea = document.querySelector(LIST_AREA_SELECTOR$1);
    if (existing) {
      if (!(existing instanceof HTMLDivElement)) {
        return null;
      }
      if (!listArea) {
        return existing.isConnected ? existing : null;
      }
      if (listArea.contains(existing)) {
        return existing;
      }
      try {
        listArea.appendChild(existing);
      } catch (error) {
        console.warn("Failed to reattach custom list container:", error);
      }
      return existing;
    }
    if (!listArea) {
      return null;
    }
    const container = createEl("div", {
      id: CUSTOM_LIST_CONTAINER_ID,
      class: `${CUSTOM_LIST_CONTAINER_CLASS} contents`
    });
    const table = createEl("table", getTopicListTableAttributes());
    const caption = cloneTopicListCaption();
    if (caption) {
      table.appendChild(caption);
    }
    const header = cloneTopicListHeader();
    if (header) {
      table.appendChild(header);
    }
    const tbody = createEl("tbody", {
      id: CUSTOM_LIST_BODY_ID,
      class: "topic-list-body"
    });
    table.appendChild(tbody);
    container.appendChild(table);
    try {
      listArea.appendChild(container);
    } catch (error) {
      console.warn("Failed to insert custom list container:", error);
    }
    return container;
  }
  function setCustomListViewActive(active) {
    ensureCustomViewStyles();
    const body = document.body;
    if (!body) {
      return;
    }
    if (active) {
      body.classList.add(CUSTOM_VIEW_CLASS);
      ensureCustomListContainer();
      clearActiveCategorySelection();
      if (!customViewObserver) {
        customViewObserver = new MutationObserver(() => {
          clearActiveCategorySelection();
          if (!document.getElementById(CUSTOM_LIST_CONTAINER_ID)) {
            ensureCustomListContainer();
          }
        });
        customViewObserver.observe(body, { childList: true, subtree: true });
      }
    } else {
      body.classList.remove(CUSTOM_VIEW_CLASS);
      if (customViewObserver) {
        customViewObserver.disconnect();
        customViewObserver = null;
      }
    }
  }
  function isCustomListViewActive() {
    return document.body?.classList.contains(CUSTOM_VIEW_CLASS) ?? false;
  }
  function stripHtml(html) {
    const container = document.createElement("div");
    container.innerHTML = html;
    return container.textContent?.trim() ?? "";
  }
  function isRecord(value) {
    return typeof value === "object" && value !== null;
  }
  function getSiteSettingsRecord() {
    const win = window;
    const maybeDiscourse = win["Discourse"];
    if (isRecord(maybeDiscourse)) {
      const siteSettings = maybeDiscourse["SiteSettings"];
      if (isRecord(siteSettings)) {
        return siteSettings;
      }
    }
    const maybeSettings = win["siteSettings"];
    if (isRecord(maybeSettings)) {
      return maybeSettings;
    }
    return {};
  }
  function parseNumberSetting(settings, key) {
    const value = settings[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return null;
  }
  function getHeatSettings() {
    const settings = getSiteSettingsRecord();
    if (heatSettingsCache) {
      return heatSettingsCache;
    }
    const viewsLow = parseNumberSetting(settings, "topic_views_heat_low");
    const viewsMedium = parseNumberSetting(settings, "topic_views_heat_medium");
    const viewsHigh = parseNumberSetting(settings, "topic_views_heat_high");
    const likeLow = parseNumberSetting(settings, "topic_post_like_heat_low");
    const likeMedium = parseNumberSetting(settings, "topic_post_like_heat_medium");
    const likeHigh = parseNumberSetting(settings, "topic_post_like_heat_high");
    if (viewsLow === null || viewsMedium === null || viewsHigh === null || likeLow === null || likeMedium === null || likeHigh === null) {
      return null;
    }
    const resolved = {
      topicViews: {
        low: viewsLow,
        medium: viewsMedium,
        high: viewsHigh
      },
      topicPostLike: {
        low: likeLow,
        medium: likeMedium,
        high: likeHigh
      }
    };
    heatSettingsCache = resolved;
    return resolved;
  }
  function pad2(value) {
    return value < 10 ? `0${value}` : String(value);
  }
  function formatDateTimeTitle(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = pad2(date.getHours());
    const minutes = pad2(date.getMinutes());
    return `${year} 年 ${month}月 ${day} 日 ${hours}:${minutes}`;
  }
  function buildActivityTitle(createdAt, lastPostedAt, bumpedAt) {
    const lines = [];
    if (createdAt) {
      lines.push(`创建日期：${formatDateTimeTitle(createdAt)}`);
    }
    const latest = lastPostedAt ?? bumpedAt;
    if (latest) {
      lines.push(`最新：${formatDateTimeTitle(latest)}`);
    }
    if (lines.length === 0) {
      return null;
    }
    return lines.join("\n");
  }
  function formatRelativeTimeTiny(dateStr) {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    if (!Number.isFinite(diffMs)) {
      return "";
    }
    if (diffMs < 6e4) {
      return "刚刚";
    }
    const minutes = Math.floor(diffMs / 6e4);
    if (minutes < 60) {
      return `${minutes} 分钟`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} 小时`;
    }
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} 天`;
    }
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} 月`;
    }
    const years = Math.floor(months / 12);
    return `${years} 年`;
  }
  function formatCompactNumber(value) {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return String(value);
  }
  function formatFullNumber(value) {
    return new Intl.NumberFormat("zh-CN").format(value);
  }
  function normalizeColor(color) {
    if (!color) {
      return null;
    }
    return color.startsWith("#") ? color : `#${color}`;
  }
  function buildCategoryStyle(category, parentCategory) {
    const styleParts = [];
    const color = normalizeColor(category.color);
    const textColor = normalizeColor(category.text_color);
    if (color) {
      styleParts.push(`--category-badge-color: ${color};`);
    }
    if (textColor) {
      styleParts.push(`--category-badge-text-color: ${textColor};`);
    }
    if (parentCategory) {
      const parentColor = normalizeColor(parentCategory.color);
      const parentTextColor = normalizeColor(parentCategory.text_color);
      if (parentColor) {
        styleParts.push(`--parent-category-badge-color: ${parentColor};`);
      }
      if (parentTextColor) {
        styleParts.push(`--parent-category-badge-text-color: ${parentTextColor};`);
      }
    }
    return styleParts.length > 0 ? styleParts.join("") : null;
  }
  function buildCategoryHref(category, parentCategory) {
    if (parentCategory) {
      return `/c/${parentCategory.slug}/${category.slug}/${category.id}`;
    }
    return `/c/${category.slug}/${category.id}`;
  }
  function getCategoryDisplayName(category) {
    return category.name;
  }
  function normalizeTagClass(tag) {
    return tag.trim().replace(/\s+/g, "-");
  }
  function buildCategoryRowClass(category, parentCategory) {
    if (!category) {
      return null;
    }
    if (parentCategory) {
      return `category-${parentCategory.slug}-${category.slug}`;
    }
    return `category-${category.slug}`;
  }
  function normalizeTagKey(tag) {
    return tag.trim().toLowerCase();
  }
  function buildTopicRowClass(topic, category, parentCategory) {
    const classes = ["topic-list-item"];
    const categoryClass = buildCategoryRowClass(category, parentCategory);
    if (categoryClass) {
      classes.push(categoryClass);
    }
    if (topic.unseen) {
      classes.push("unseen-topic");
    }
    if (topic.pinned || topic.pinned_globally) {
      classes.push("pinned");
    }
    if (topic.has_accepted_answer) {
      classes.push("status-solved");
    }
    if (topic.excerpt) {
      classes.push("has-excerpt", "excerpt-expanded");
    }
    if (topic.tags) {
      topic.tags.forEach((tag) => {
        classes.push(`tag-${normalizeTagClass(tag)}`);
      });
    }
    return classes.join(" ");
  }
  function buildAvatarUrl(user) {
    const template = user.avatar_template.replace("{size}", "48");
    if (template.startsWith("http")) {
      return template;
    }
    return `https://linux.do${template}`;
  }
  function buildIconClass(iconId) {
    return `fa d-icon d-icon-${iconId} svg-icon fa-width-auto svg-string`;
  }
  function createSvgIcon(iconId, className) {
    const svg = document.createElementNS(SVG_NAMESPACE, "svg");
    svg.setAttribute("class", buildIconClass(iconId));
    svg.setAttribute("width", "1em");
    svg.setAttribute("height", "1em");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("xmlns", SVG_NAMESPACE);
    const use = document.createElementNS(SVG_NAMESPACE, "use");
    use.setAttribute("href", `#${iconId}`);
    svg.appendChild(use);
    return svg;
  }
  function createEmojiIcon(emoji) {
    return createEl("span", { class: "emoji", role: "img", "aria-label": emoji }, [emoji]);
  }
  function createTagIconSpan(tagIcon) {
    const attrs = { class: "tag-icon" };
    if (tagIcon.color) {
      attrs.style = `color: ${tagIcon.color}`;
    }
    const span = createEl("span", attrs);
    span.appendChild(createSvgIcon(tagIcon.icon));
    return span;
  }
  function resolveCategoryIconId(category) {
    if (CATEGORY_ICON_CACHE.has(category.id)) {
      return CATEGORY_ICON_CACHE.get(category.id) ?? null;
    }
    const useEl = document.querySelector(
      `[data-category-id="${category.id}"] svg use`
    );
    if (!useEl) {
      CATEGORY_ICON_CACHE.set(category.id, null);
      return null;
    }
    const href = useEl.getAttribute("href") ?? useEl.getAttribute("xlink:href");
    if (!href) {
      CATEGORY_ICON_CACHE.set(category.id, null);
      return null;
    }
    const iconId = href.startsWith("#") ? href.slice(1) : href;
    CATEGORY_ICON_CACHE.set(category.id, iconId);
    return iconId;
  }
  function resolveCategoryVisual(category, parentCategory) {
    if (category.style_type === "emoji" && category.emoji) {
      return { type: "emoji", value: category.emoji };
    }
    if (parentCategory?.style_type === "emoji" && parentCategory.emoji) {
      return { type: "emoji", value: parentCategory.emoji };
    }
    const iconId = category.icon ?? parentCategory?.icon;
    if (iconId) {
      return { type: "icon", value: iconId };
    }
    const domIcon = resolveCategoryIconId(category) ?? (parentCategory ? resolveCategoryIconId(parentCategory) : null);
    if (domIcon) {
      return { type: "icon", value: domIcon };
    }
    return null;
  }
  function getTopicTitle(topic) {
    if (topic.fancy_title) {
      const title = stripHtml(topic.fancy_title);
      if (title) {
        return title;
      }
    }
    return topic.title;
  }
  function createPinnedStatus(topic) {
    const title = topic.pinned_globally ? "此话题已对您置顶；它将显示在所有类别的顶部" : "此话题已对您置顶；它将显示在所属类别的顶部";
    const link = createEl("a", {
      href: `/t/${topic.slug}/${topic.id}`,
      title,
      class: "topic-status --pinned pin-toggle-button"
    });
    link.appendChild(createSvgIcon("thumbtack"));
    return applyTopicLinkTarget(link);
  }
  function createStatusIcon(iconId, className, title) {
    const status = createEl("span", { class: className, title });
    status.appendChild(createSvgIcon(iconId));
    return status;
  }
  function createTopicStatuses(topic) {
    const statuses = createEl("span", { class: "topic-statuses" });
    if (topic.pinned || topic.pinned_globally) {
      statuses.appendChild(createPinnedStatus(topic));
    }
    if (topic.has_accepted_answer) {
      statuses.appendChild(
        createStatusIcon("far-square-check", "topic-status --solved", "此话题有解决方案")
      );
    } else if (topic.can_have_answer) {
      statuses.appendChild(
        createStatusIcon("far-square", "topic-status --unsolved", "此话题尚无解决方案")
      );
    }
    if (topic.closed) {
      statuses.appendChild(
        createStatusIcon("lock", "topic-status --closed", "此话题已关闭")
      );
    }
    if (topic.archived) {
      statuses.appendChild(
        createStatusIcon("archive", "topic-status --archived", "此话题已归档")
      );
    }
    return statuses;
  }
  function createTopicBadges(topic) {
    const badges = createEl("span", { class: "topic-post-badges" });
    if (topic.unseen) {
      badges.append(" ");
      const badge = createEl("a", {
        href: `/t/${topic.slug}/${topic.id}/1`,
        title: "新话题",
        class: "badge badge-notification new-topic"
      });
      badges.appendChild(applyTopicLinkTarget(badge));
    }
    return badges;
  }
  function createTopicTitleLink(topic) {
    const titleText = getTopicTitle(topic);
    const titleSpan = createEl("span", { dir: "auto" }, [titleText]);
    markEmojiText(titleSpan, titleText);
    const link = createEl(
      "a",
      {
        href: `/t/${topic.slug}/${topic.id}`,
        "data-topic-id": String(topic.id),
        class: "title raw-link raw-topic-link"
      },
      [titleSpan]
    );
    return applyTopicLinkTarget(link);
  }
  function createTopicExcerpt(topic) {
    if (!topic.excerpt) {
      return null;
    }
    const excerptText = stripHtml(topic.excerpt);
    if (!excerptText) {
      return null;
    }
    const excerptSpan = createEl("span", { dir: "auto" }, [excerptText]);
    const link = createEl(
      "a",
      { href: `/t/${topic.slug}/${topic.id}`, class: "topic-excerpt" },
      [excerptSpan]
    );
    return applyTopicLinkTarget(link);
  }
  function createCategoryBadge(category, categories) {
    const parentCategory = category.parent_category_id ? categories.get(category.parent_category_id) : void 0;
    const badgeClasses = ["badge-category"];
    if (category.read_restricted) {
      badgeClasses.push("restricted");
    }
    if (parentCategory) {
      badgeClasses.push("--has-parent");
    }
    const visual = resolveCategoryVisual(category, parentCategory);
    if (visual || category.read_restricted) {
      badgeClasses.push("--style-icon");
    }
    if (visual?.type === "emoji") {
      badgeClasses.push("--style-emoji");
    }
    const titleText = category.description_text ?? category.description;
    const badgeAttrs = {
      class: badgeClasses.join(" "),
      "data-category-id": String(category.id),
      "data-drop-close": "true"
    };
    if (parentCategory) {
      badgeAttrs["data-parent-category-id"] = String(parentCategory.id);
    }
    if (titleText) {
      badgeAttrs.title = stripHtml(titleText);
    }
    const badge = createEl("span", badgeAttrs);
    if (visual?.type === "icon") {
      badge.appendChild(createSvgIcon(visual.value));
    } else if (visual?.type === "emoji") {
      badge.appendChild(createEmojiIcon(visual.value));
    }
    if (category.read_restricted) {
      badge.appendChild(createSvgIcon("lock"));
    }
    const nameSpan = createEl("span", { class: "badge-category__name", dir: "auto" }, [
      getCategoryDisplayName(category)
    ]);
    badge.appendChild(nameSpan);
    const wrapperAttrs = {
      href: buildCategoryHref(category, parentCategory),
      class: "badge-category__wrapper "
    };
    const style = buildCategoryStyle(category, parentCategory);
    if (style) {
      wrapperAttrs.style = style;
    }
    return createEl("a", wrapperAttrs, [badge]);
  }
  function createTagsList(tags) {
    if (!tags || tags.length === 0) {
      return null;
    }
    const list = createEl("div", {
      class: "discourse-tags",
      role: "list",
      "aria-label": "标签"
    });
    tags.forEach((tag, index) => {
      if (index > 0) {
        list.appendChild(
          createEl("span", { class: "discourse-tags__tag-separator" }, [","])
        );
      }
      const tagKey = normalizeTagKey(tag);
      const tagIconMap2 = getCachedTagIconMap();
      const tagIcon = tagIconMap2?.get(tagKey) ?? null;
      const tagLink = createEl("a", {
        href: `/tag/${tag}`,
        "data-tag-name": tag,
        class: "discourse-tag box"
      });
      if (tagIcon) {
        tagLink.appendChild(createTagIconSpan(tagIcon));
      }
      tagLink.append(tag);
      list.appendChild(tagLink);
    });
    return list;
  }
  function parsePosterExtras(extras) {
    if (!extras) {
      return [];
    }
    return extras.split(" ").filter((value) => value.length > 0);
  }
  function buildPosterTitle(user, poster) {
    const displayName = user.name ?? user.username;
    if (poster.description) {
      return `${displayName} - ${poster.description}`;
    }
    return displayName;
  }
  function createPosterLink(poster, user) {
    if (!user) {
      return null;
    }
    const extras = parsePosterExtras(poster.extras);
    const classes = extras.filter((value) => value === "latest" || value === "single");
    const anchorAttrs = {
      href: `/u/${user.username}`,
      "data-user-card": user.username,
      "aria-label": `${user.username} 的个人资料`,
      tabindex: "0"
    };
    if (classes.length > 0) {
      anchorAttrs.class = classes.join(" ");
    }
    const imgClasses = ["avatar", ...classes].join(" ");
    const img = createEl("img", {
      alt: "",
      width: "24",
      height: "24",
      loading: "lazy",
      src: buildAvatarUrl(user),
      class: imgClasses,
      title: buildPosterTitle(user, poster)
    });
    return createEl("a", anchorAttrs, [img]);
  }
  function createPostersCell(topic, users) {
    const postersTd = createEl("td", { class: "posters topic-list-data" });
    topic.posters.forEach((poster) => {
      const user = users.get(poster.user_id);
      const link = createPosterLink(poster, user);
      if (link) {
        postersTd.appendChild(link);
      }
    });
    return postersTd;
  }
  function getReplyCount(topic) {
    const postCount = topic.posts_count;
    if (typeof postCount === "number" && Number.isFinite(postCount)) {
      return Math.max(0, postCount - 1);
    }
    return 0;
  }
  function getHeatLevelByValue(value, low, medium, high) {
    if (value >= high) {
      return "high";
    }
    if (value >= medium) {
      return "med";
    }
    if (value >= low) {
      return "low";
    }
    return null;
  }
  function getViewsHeatClass(views) {
    const settings = getHeatSettings();
    if (!settings) {
      return null;
    }
    const level = getHeatLevelByValue(
      views,
      settings.topicViews.low,
      settings.topicViews.medium,
      settings.topicViews.high
    );
    return level ? `heatmap-${level}` : null;
  }
  function getLikesHeatClass(topic) {
    const settings = getHeatSettings();
    if (!settings) {
      return null;
    }
    const postCount = topic.posts_count ?? 0;
    if (postCount < 10) {
      return null;
    }
    const likeCount = topic.like_count ?? 0;
    const ratio = likeCount / postCount;
    const likeSettings = settings.topicPostLike;
    if (ratio > likeSettings.high) {
      return "heatmap-high";
    }
    if (ratio > likeSettings.medium) {
      return "heatmap-med";
    }
    if (ratio > likeSettings.low) {
      return "heatmap-low";
    }
    return null;
  }
  function applyTagIconsToCustomList(tagIconMap2) {
    const container = document.getElementById(CUSTOM_LIST_CONTAINER_ID);
    const scope = container ?? document;
    scope.querySelectorAll(".discourse-tag").forEach((link) => {
      if (link.querySelector(".tag-icon")) {
        return;
      }
      const tagName = link.getAttribute("data-tag-name") ?? link.textContent ?? "";
      const tagKey = normalizeTagKey(tagName);
      const tagIcon = tagIconMap2.get(tagKey);
      if (!tagIcon) {
        return;
      }
      link.insertBefore(createTagIconSpan(tagIcon), link.firstChild);
    });
  }
  function updateTagIconsIfNeeded() {
    const cached = getCachedTagIconMap();
    if (cached) {
      applyTagIconsToCustomList(cached);
      return;
    }
    if (isTagIconFetchPending) {
      return;
    }
    isTagIconFetchPending = true;
    ensureTagIconMap().then((map) => {
      if (map) {
        applyTagIconsToCustomList(map);
      }
    }).catch((error) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.warn("Failed to load tag icons:", error);
      }
    }).finally(() => {
      isTagIconFetchPending = false;
    });
  }
  function collectEmojiTexts() {
    const container = document.getElementById(CUSTOM_LIST_CONTAINER_ID);
    if (!container) {
      return [];
    }
    const texts = [];
    container.querySelectorAll("span[data-emoji-text]").forEach((span) => {
      const value = span.getAttribute("data-emoji-text");
      if (value) {
        texts.push(value);
      }
    });
    return texts;
  }
  function updateEmojisIfNeeded() {
    const texts = collectEmojiTexts();
    if (texts.length === 0) {
      return;
    }
    const cached = getCachedEmojiMap();
    const missing = findMissingEmojiNames(texts, cached);
    if (missing.length === 0 && cached) {
      applyEmojiToCustomList(cached);
      return;
    }
    if (isEmojiFetchPending) {
      return;
    }
    isEmojiFetchPending = true;
    ensureEmojiMap(void 0, missing).then((map) => {
      if (map) {
        applyEmojiToCustomList(map);
      }
    }).catch((error) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.warn("Failed to load emojis:", error);
      }
    }).finally(() => {
      isEmojiFetchPending = false;
    });
  }
  function createRepliesCell(topic) {
    const replies = getReplyCount(topic);
    const link = createEl("a", {
      href: `/t/${topic.slug}/${topic.id}/1`,
      class: "badge-posts",
      "aria-label": `${replies} 条回复，跳转到第一个帖子`
    });
    link.appendChild(createEl("span", { class: "number" }, [String(replies)]));
    const classes = ["num", "posts-map", "posts", "topic-list-data"];
    const likesHeat = getLikesHeatClass(topic);
    if (likesHeat) {
      classes.push(likesHeat);
    }
    return createEl("td", { class: classes.join(" ") }, [applyTopicLinkTarget(link)]);
  }
  function createRepliesBadgeBlock(topic) {
    const replies = getReplyCount(topic);
    const link = createEl("a", {
      href: `/t/${topic.slug}/${topic.id}/1`,
      class: "badge-posts",
      "aria-label": `${replies} 条回复，跳转到第一个帖子`
    });
    link.appendChild(createEl("span", { class: "number" }, [String(replies)]));
    const classes = ["num", "posts-map", "posts", "topic-list-data"];
    const likesHeat = getLikesHeatClass(topic);
    if (likesHeat) {
      classes.push(likesHeat);
    }
    return createEl("div", { class: classes.join(" ") }, [applyTopicLinkTarget(link)]);
  }
  function createViewsCell(topic) {
    const views = topic.views ?? 0;
    const viewsText = formatCompactNumber(views);
    const span = createEl("span", {
      class: "number",
      title: `此话题已被浏览 ${formatFullNumber(views)} 次`
    }, [viewsText]);
    const classes = ["num", "views", "topic-list-data"];
    const viewsHeat = getViewsHeatClass(views);
    if (viewsHeat) {
      classes.push(viewsHeat);
    }
    return createEl("td", { class: classes.join(" ") }, [span]);
  }
  function getLastPostNumber(topic) {
    return topic.highest_post_number ?? topic.posts_count ?? 1;
  }
  function createActivityCell(topic) {
    const activityTitle = buildActivityTitle(topic.created_at, topic.last_posted_at, topic.bumped_at);
    const activityAttrs = {
      class: "activity num topic-list-data age"
    };
    if (activityTitle) {
      activityAttrs.title = activityTitle;
    }
    const lastPostNumber = getLastPostNumber(topic);
    const link = createEl("a", {
      href: `/t/${topic.slug}/${topic.id}/${lastPostNumber}`,
      class: "post-activity"
    });
    const relativeDate = createEl("span", {
      class: "relative-date",
      "data-time": String(new Date(topic.bumped_at).getTime()),
      "data-format": "tiny"
    }, [formatRelativeTimeTiny(topic.bumped_at)]);
    link.appendChild(relativeDate);
    return createEl("td", activityAttrs, [applyTopicLinkTarget(link)]);
  }
  function createMobileAvatar(topic, users) {
    const poster = topic.posters[0];
    if (!poster) {
      return null;
    }
    const user = users.get(poster.user_id);
    if (!user) {
      return null;
    }
    const lastPostNumber = getLastPostNumber(topic);
    const link = createEl("a", {
      href: `/t/${topic.slug}/${topic.id}/${lastPostNumber}`,
      "data-user-card": user.username
    });
    const img = createEl("img", {
      alt: "",
      width: "48",
      height: "48",
      loading: "lazy",
      src: buildAvatarUrl(user),
      class: "avatar",
      title: buildPosterTitle(user, poster)
    });
    link.appendChild(img);
    const wrapper = createEl("div", { class: "pull-left" }, [applyTopicLinkTarget(link)]);
    return wrapper;
  }
  function createMobileActivityBlock(topic) {
    const activityTitle = buildActivityTitle(topic.created_at, topic.last_posted_at, topic.bumped_at);
    const spanAttrs = { class: "age activity" };
    if (activityTitle) {
      spanAttrs.title = activityTitle;
    }
    const lastPostNumber = getLastPostNumber(topic);
    const link = createEl("a", {
      href: `/t/${topic.slug}/${topic.id}/${lastPostNumber}`
    });
    const relativeDate = createEl("span", {
      class: "relative-date",
      "data-time": String(new Date(topic.bumped_at).getTime()),
      "data-format": "tiny"
    }, [formatRelativeTimeTiny(topic.bumped_at)]);
    link.appendChild(relativeDate);
    const span = createEl("span", spanAttrs, [applyTopicLinkTarget(link)]);
    return createEl("div", { class: "num activity last" }, [span]);
  }
  function createTopicRowMobile(topic, users, categories) {
    const category = categories.get(topic.category_id);
    const parentCategory = category?.parent_category_id ? categories.get(category.parent_category_id) : void 0;
    const tr = createEl("tr", {
      class: buildTopicRowClass(topic, category, parentCategory),
      "data-topic-id": String(topic.id)
    });
    const td = createEl("td", { class: "topic-list-data" });
    const avatar = createMobileAvatar(topic, users);
    if (avatar) {
      td.appendChild(avatar);
    }
    const metadata = createEl("div", { class: "topic-item-metadata right" });
    const mainLink = createEl("div", { class: "main-link" });
    mainLink.appendChild(createTopicStatuses(topic));
    mainLink.appendChild(createTopicTitleLink(topic));
    mainLink.appendChild(createTopicBadges(topic));
    metadata.appendChild(mainLink);
    const pullRight = createEl("div", { class: "pull-right" }, [
      createRepliesBadgeBlock(topic)
    ]);
    metadata.appendChild(pullRight);
    const stats = createEl("div", { class: "topic-item-stats clearfix" });
    const categoryTags = createEl("span", { class: "topic-item-stats__category-tags" });
    if (category) {
      categoryTags.appendChild(createCategoryBadge(category, categories));
    }
    const tagsList = createTagsList(topic.tags);
    if (tagsList) {
      categoryTags.appendChild(tagsList);
    }
    stats.appendChild(categoryTags);
    stats.appendChild(createMobileActivityBlock(topic));
    metadata.appendChild(stats);
    td.appendChild(metadata);
    tr.appendChild(td);
    return tr;
  }
  function createTopicRow(topic, users, categories) {
    if (isMobileView()) {
      return createTopicRowMobile(topic, users, categories);
    }
    const category = categories.get(topic.category_id);
    const parentCategory = category?.parent_category_id ? categories.get(category.parent_category_id) : void 0;
    const tr = createEl("tr", {
      class: buildTopicRowClass(topic, category, parentCategory),
      "data-topic-id": String(topic.id)
    });
    const mainTd = createEl("td", {
      class: "main-link topic-list-data",
      colspan: "1"
    });
    const linkTopLine = createEl("span", {
      class: "link-top-line",
      role: "heading",
      "aria-level": "2"
    });
    linkTopLine.appendChild(createTopicStatuses(topic));
    linkTopLine.appendChild(createTopicTitleLink(topic));
    linkTopLine.appendChild(createTopicBadges(topic));
    mainTd.appendChild(linkTopLine);
    const linkBottomLine = createEl("div", { class: "link-bottom-line" });
    if (category) {
      linkBottomLine.appendChild(createCategoryBadge(category, categories));
    }
    const tagsList = createTagsList(topic.tags);
    if (tagsList) {
      linkBottomLine.appendChild(tagsList);
    }
    if (linkBottomLine.childNodes.length > 0) {
      mainTd.appendChild(linkBottomLine);
    }
    const excerpt = createTopicExcerpt(topic);
    if (excerpt) {
      mainTd.appendChild(excerpt);
    }
    tr.appendChild(mainTd);
    tr.appendChild(createPostersCell(topic, users));
    tr.appendChild(createRepliesCell(topic));
    tr.appendChild(createViewsCell(topic));
    tr.appendChild(createActivityCell(topic));
    return tr;
  }
  function renderTopicList(data, append = false) {
    const container = ensureCustomListContainer();
    const tbody = container?.querySelector(`#${CUSTOM_LIST_BODY_ID}`);
    if (!tbody) {
      return;
    }
    if (!append) {
      tbody.innerHTML = "";
    }
    data.topics.forEach((topic) => {
      const row = createTopicRow(topic, data.users, data.categories);
      tbody.appendChild(row);
    });
    updateTagIconsIfNeeded();
    updateEmojisIfNeeded();
  }
  function getLoadingAnchor() {
    const body = document.body;
    if (body?.classList.contains(CUSTOM_VIEW_CLASS)) {
      const container = document.getElementById(CUSTOM_LIST_CONTAINER_ID);
      if (container) {
        const table = container.querySelector("table");
        if (table) {
          return table;
        }
      }
    }
    return document.querySelector(".topic-list");
  }
  function showLoading() {
    const indicator = getLoadingIndicator();
    if (indicator) {
      clearReadyTimeout();
      setLoadingState("loading");
    }
    const container = getLoadingAnchor();
    if (!container || indicator) {
      const fallback = document.getElementById("custom-loading");
      if (fallback) {
        fallback.style.display = "none";
      }
      return;
    }
    let loading = document.getElementById("custom-loading");
    if (!loading) {
      loading = createEl(
        "div",
        {
          id: "custom-loading",
          style: "text-align: center; padding: 20px; color: #666;"
        },
        ["加载中..."]
      );
      container.parentElement?.insertBefore(loading, container.nextSibling);
    }
    loading.style.display = "block";
  }
  function hideLoading() {
    const indicator = getLoadingIndicator();
    if (indicator) {
      clearReadyTimeout();
      setLoadingState("done");
      readyTimeoutId = window.setTimeout(() => {
        setLoadingState("ready");
        readyTimeoutId = null;
      }, LOADING_READY_DELAY_MS);
    }
    const loading = document.getElementById("custom-loading");
    if (loading) {
      loading.style.display = "none";
    }
  }
  const MENU_IDS = {
    concurrency: "custom-category-request-concurrency",
    delay: "custom-category-request-delay",
    retry: "custom-category-request-retry",
    openTopicInNewTab: "custom-category-topic-open-new-tab",
    reset: "custom-category-request-reset"
  };
  function unregisterMenuCommand(id) {
    try {
      _GM_unregisterMenuCommand(id);
    } catch (error) {
    }
  }
  function promptForNumber(label, currentValue, minValue) {
    const input = window.prompt(
      `${label} (>= ${minValue})`,
      String(currentValue)
    );
    if (input === null) {
      return null;
    }
    const trimmed = input.trim();
    if (!trimmed) {
      window.alert("请输入有效数字");
      return null;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) {
      window.alert("请输入有效数字");
      return null;
    }
    return Math.max(minValue, Math.round(parsed));
  }
  function promptForRetryAttempts(label, currentValue) {
    const input = window.prompt(`${label} (-1 表示无限)`, String(currentValue));
    if (input === null) {
      return null;
    }
    const trimmed = input.trim();
    if (!trimmed) {
      window.alert("请输入有效数字");
      return null;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) {
      window.alert("请输入有效数字");
      return null;
    }
    const rounded = Math.round(parsed);
    if (rounded < -1) {
      window.alert("请输入 -1 或非负整数");
      return null;
    }
    return rounded;
  }
  function formatRetryAttempts(value) {
    return value < 0 ? "无限" : String(value);
  }
  function formatToggle(value) {
    return value ? "开" : "关";
  }
  function refreshMenuCommands() {
    Object.values(MENU_IDS).forEach((id) => unregisterMenuCommand(id));
    const settings = getRequestControlSettings();
    const openInNewTab = getOpenTopicInNewTab();
    _GM_registerMenuCommand(
      `设置并发请求数量 (当前: ${settings.concurrency})`,
      () => {
        const currentSettings = getRequestControlSettings();
        const nextValue = promptForNumber(
          "请输入并发请求数量",
          currentSettings.concurrency,
          1
        );
        if (nextValue === null || nextValue === currentSettings.concurrency) {
          return;
        }
        saveRequestControlSettings({
          ...currentSettings,
          concurrency: nextValue
        });
        refreshMenuCommands();
      },
      {
        id: MENU_IDS.concurrency,
        title: "控制同时发起的请求数量"
      }
    );
    _GM_registerMenuCommand(
      `设置请求间隔 (当前: ${settings.requestDelayMs} ms)`,
      () => {
        const currentSettings = getRequestControlSettings();
        const nextValue = promptForNumber(
          "请输入请求间隔 (毫秒)",
          currentSettings.requestDelayMs,
          0
        );
        if (nextValue === null || nextValue === currentSettings.requestDelayMs) {
          return;
        }
        saveRequestControlSettings({
          ...currentSettings,
          requestDelayMs: nextValue
        });
        refreshMenuCommands();
      },
      {
        id: MENU_IDS.delay,
        title: "每次请求完成后的等待时间"
      }
    );
    _GM_registerMenuCommand(
      `设置最大重试次数 (当前: ${formatRetryAttempts(settings.maxRetryAttempts)})`,
      () => {
        const currentSettings = getRequestControlSettings();
        const nextValue = promptForRetryAttempts(
          "请输入最大重试次数",
          currentSettings.maxRetryAttempts
        );
        if (nextValue === null || nextValue === currentSettings.maxRetryAttempts) {
          return;
        }
        saveRequestControlSettings({
          ...currentSettings,
          maxRetryAttempts: nextValue
        });
        refreshMenuCommands();
      },
      {
        id: MENU_IDS.retry,
        title: "设置失败重试上限，-1 表示无限重试"
      }
    );
    _GM_registerMenuCommand(
      "重置请求设置",
      () => {
        resetRequestControlSettings();
        refreshMenuCommands();
      },
      {
        id: MENU_IDS.reset,
        title: `恢复默认：并发 ${DEFAULT_REQUEST_CONTROL_SETTINGS.concurrency}，间隔 ${DEFAULT_REQUEST_CONTROL_SETTINGS.requestDelayMs} ms，重试 ${formatRetryAttempts(DEFAULT_REQUEST_CONTROL_SETTINGS.maxRetryAttempts)}`
      }
    );
    _GM_registerMenuCommand(
      `自定义类别帖子新标签页打开 (当前: ${formatToggle(openInNewTab)})`,
      () => {
        const nextValue = !getOpenTopicInNewTab();
        setOpenTopicInNewTab(nextValue);
        refreshMenuCommands();
      },
      {
        id: MENU_IDS.openTopicInNewTab,
        title: "控制自定义类别话题链接默认打开方式"
      }
    );
  }
  function initMenu() {
    refreshMenuCommands();
  }
  let currentGroup = null;
  let currentData = null;
  let isLoading = false;
  let activeRequestController = null;
  let activeRequestId = null;
  let requestCounter = 0;
  let activeCustomUrl = null;
  let previousCategoryHref = null;
  const CUSTOM_URL_PREFIX = "/custom-c/";
  const CATEGORY_LIST_SELECTOR = "#sidebar-section-content-categories";
  const CATEGORY_LINK_SELECTOR = "a.sidebar-section-link";
  const CUSTOM_GROUP_ATTR = "data-custom-group-id";
  const CUSTOM_LISTENER_ATTR = "data-custom-category-listener";
  const LOGO_LISTENER_ATTR = "data-custom-logo-listener";
  const LIST_AREA_SELECTOR = "#list-area";
  const PENDING_CUSTOM_GROUP_KEY = "custom-category-pending-group";
  function buildCustomUrl(name) {
    const encodedName = encodeURIComponent(name.trim());
    return `${window.location.origin}${CUSTOM_URL_PREFIX}${encodedName}`;
  }
  function updateUrlToCustom(name) {
    const targetUrl = buildCustomUrl(name);
    activeCustomUrl = targetUrl;
    if (window.location.href === targetUrl) {
      return;
    }
    window.history.replaceState(window.history.state, document.title, targetUrl);
  }
  function navigateWithHistory(url) {
    const targetUrl = new URL(url, window.location.origin);
    const intermediateUrl = new URL("/", window.location.origin);
    const fallbackUrl = new URL("/latest", window.location.origin);
    const hopUrl = intermediateUrl.href === targetUrl.href ? fallbackUrl : intermediateUrl;
    window.history.pushState(window.history.state, document.title, hopUrl.href);
    window.dispatchEvent(
      new PopStateEvent("popstate", { state: window.history.state })
    );
    window.setTimeout(() => {
      window.history.pushState(
        window.history.state,
        document.title,
        targetUrl.href
      );
      window.dispatchEvent(
        new PopStateEvent("popstate", { state: window.history.state })
      );
    }, 0);
  }
  function getCustomGroupNameFromPath(pathname) {
    if (!pathname.startsWith(CUSTOM_URL_PREFIX)) {
      return null;
    }
    const rawName = pathname.slice(CUSTOM_URL_PREFIX.length);
    if (!rawName) {
      return null;
    }
    try {
      const decodedName = decodeURIComponent(rawName);
      const trimmedName = decodedName.trim();
      return trimmedName.length > 0 ? trimmedName : null;
    } catch (error) {
      return null;
    }
  }
  function findCustomGroupByName(name) {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return null;
    }
    const groups = getCategoryGroups();
    const match = groups.find((group) => group.name.trim() === trimmedName);
    return match ?? null;
  }
  function storePendingCustomGroup(name) {
    try {
      window.sessionStorage.setItem(PENDING_CUSTOM_GROUP_KEY, name);
      return true;
    } catch (error) {
      return false;
    }
  }
  function consumePendingCustomGroup() {
    try {
      const value = window.sessionStorage.getItem(PENDING_CUSTOM_GROUP_KEY);
      if (!value) {
        return null;
      }
      window.sessionStorage.removeItem(PENDING_CUSTOM_GROUP_KEY);
      return value;
    } catch (error) {
      return null;
    }
  }
  function isAllowedCustomGroupUrl(url) {
    if (url.origin !== window.location.origin) {
      return false;
    }
    const path = url.pathname;
    if (path === "/" || path === "/c" || path === "/c/") {
      return true;
    }
    if (path.startsWith("/c/")) {
      return true;
    }
    if (path.startsWith("/tag/")) {
      return true;
    }
    if (path.startsWith(CUSTOM_URL_PREFIX)) {
      return true;
    }
    return false;
  }
  function isHomeLink(link) {
    const href = link.getAttribute("href");
    if (!href) {
      return false;
    }
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin && url.pathname === "/";
    } catch (error) {
      return false;
    }
  }
  function isLogoLink(link) {
    if (link.querySelector("#site-logo")) {
      return true;
    }
    return link.closest(".title") !== null;
  }
  function resetUrlToHomeIfCustom() {
    if (!window.location.pathname.startsWith(CUSTOM_URL_PREFIX)) {
      return;
    }
    const homeUrl = new URL("/", window.location.origin);
    window.history.replaceState(window.history.state, document.title, homeUrl.href);
  }
  function redirectFromCustomUrlIfNeeded() {
    const customName = getCustomGroupNameFromPath(window.location.pathname);
    if (!customName) {
      return false;
    }
    if (isCustomListViewActive()) {
      return false;
    }
    const group = findCustomGroupByName(customName);
    if (!group) {
      return false;
    }
    if (!storePendingCustomGroup(group.name)) {
      return false;
    }
    window.location.replace(`${window.location.origin}/`);
    return true;
  }
  async function restoreCustomGroupFromPending() {
    const pendingName = consumePendingCustomGroup();
    if (!pendingName) {
      return;
    }
    if (!isAllowedCustomGroupUrl(new URL(window.location.href))) {
      storePendingCustomGroup(pendingName);
      window.location.replace(`${window.location.origin}/`);
      return;
    }
    if (isCustomListViewActive()) {
      return;
    }
    const group = findCustomGroupByName(pendingName);
    if (!group) {
      return;
    }
    try {
      await waitForElement(LIST_AREA_SELECTOR);
    } catch (error) {
      console.warn("Timeout waiting for list area, skip restore:", error);
      return;
    }
    await handleGroupClick(group);
  }
  function isAbortError(error) {
    return error instanceof DOMException && error.name === "AbortError";
  }
  function startRequest() {
    if (activeRequestController) {
      activeRequestController.abort();
    }
    const controller = new AbortController();
    activeRequestController = controller;
    const requestId = requestCounter + 1;
    requestCounter = requestId;
    activeRequestId = requestId;
    isLoading = true;
    return { controller, requestId };
  }
  function finishRequest(requestId) {
    if (activeRequestId !== requestId) {
      return;
    }
    hideLoading();
    isLoading = false;
    activeRequestController = null;
  }
  function cancelActiveOperation() {
    if (activeRequestController) {
      activeRequestController.abort();
    }
    activeRequestController = null;
    activeRequestId = null;
    isLoading = false;
    currentGroup = null;
    currentData = null;
    activeCustomUrl = null;
    previousCategoryHref = null;
    clearActiveCustomGroup();
    setCustomListViewActive(false);
    hideLoading();
  }
  function handleLocationChange() {
    if (redirectFromCustomUrlIfNeeded()) {
      return;
    }
    if (!activeCustomUrl) {
      return;
    }
    if (window.location.href !== activeCustomUrl) {
      cancelActiveOperation();
    }
  }
  function initLocationObserver() {
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);
    const wrapHistoryMethod = (method) => {
      return (...args) => {
        method(...args);
        handleLocationChange();
      };
    };
    history.pushState = wrapHistoryMethod(originalPushState);
    history.replaceState = wrapHistoryMethod(originalReplaceState);
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
  }
  async function handleGroupClick(group) {
    if (!isAllowedCustomGroupUrl(new URL(window.location.href))) {
      storePendingCustomGroup(group.name);
      window.location.replace(`${window.location.origin}/`);
      return;
    }
    const { controller, requestId } = startRequest();
    currentGroup = group;
    previousCategoryHref = getActiveCategoryHref();
    setActiveCustomGroup(group.id);
    setCustomListViewActive(true);
    updateUrlToCustom(group.name);
    showLoading();
    try {
      const data = await fetchMergedTopics(
        group.categoryIds,
new Map(),
        controller.signal
      );
      if (activeRequestId !== requestId || controller.signal.aborted) {
        return;
      }
      currentData = data;
      renderTopicList(data);
    } catch (error) {
      if (!isAbortError(error)) {
        console.error("Failed to fetch topics:", error);
      }
    } finally {
      finishRequest(requestId);
    }
  }
  async function loadMore() {
    if (!currentGroup || !currentData || !currentData.hasMore || isLoading)
      return;
    const { controller, requestId } = startRequest();
    showLoading();
    try {
      const data = await fetchMergedTopics(
        currentGroup.categoryIds,
        currentData.pageOffsets,
        controller.signal
      );
      if (activeRequestId !== requestId || controller.signal.aborted) {
        return;
      }
      currentData.topics.push(...data.topics);
      data.users.forEach((u, id) => currentData.users.set(id, u));
      data.categories.forEach(
        (category, id) => currentData.categories.set(id, category)
      );
      currentData.hasMore = data.hasMore;
      currentData.pageOffsets = data.pageOffsets;
      data.categories = currentData.categories;
      renderTopicList(data, true);
    } catch (error) {
      if (!isAbortError(error)) {
        console.error("Failed to load more:", error);
      }
    } finally {
      finishRequest(requestId);
    }
  }
  function handleScroll() {
    if (!currentGroup || !currentData?.hasMore) return;
    const scrollBottom = window.innerHeight + window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    if (docHeight - scrollBottom < 500) {
      loadMore();
    }
  }
  function getActiveCategoryHref() {
    const activeLink = document.querySelector(
      `${CATEGORY_LIST_SELECTOR} a.sidebar-section-link.active:not([${CUSTOM_GROUP_ATTR}])`
    );
    return activeLink?.href ?? null;
  }
  function initCategoryClickListener() {
    const body = document.body;
    if (!body || body.getAttribute(CUSTOM_LISTENER_ATTR) === "true") {
      return;
    }
    body.setAttribute(CUSTOM_LISTENER_ATTR, "true");
    body.addEventListener(
      "click",
      (event) => {
        if (!activeCustomUrl) {
          return;
        }
        const target = event.target instanceof Element ? event.target : event.target instanceof Node ? event.target.parentElement : null;
        if (!target) {
          return;
        }
        const link = target.closest(CATEGORY_LINK_SELECTOR);
        if (!link || link.getAttribute(CUSTOM_GROUP_ATTR)) {
          return;
        }
        if (!link.closest(CATEGORY_LIST_SELECTOR)) {
          return;
        }
        const shouldForceReload = previousCategoryHref !== null && link.href === previousCategoryHref;
        cancelActiveOperation();
        if (shouldForceReload) {
          event.preventDefault();
          event.stopPropagation();
          navigateWithHistory(link.href);
        }
      },
      true
    );
  }
  function initLogoClickListener() {
    const body = document.body;
    if (!body || body.getAttribute(LOGO_LISTENER_ATTR) === "true") {
      return;
    }
    body.setAttribute(LOGO_LISTENER_ATTR, "true");
    body.addEventListener(
      "click",
      (event) => {
        if (!activeCustomUrl) {
          return;
        }
        const target = event.target instanceof Element ? event.target : event.target instanceof Node ? event.target.parentElement : null;
        if (!target) {
          return;
        }
        const link = target.closest("a[href]");
        if (!link) {
          return;
        }
        if (!isLogoLink(link) || !isHomeLink(link)) {
          return;
        }
        cancelActiveOperation();
        resetUrlToHomeIfCustom();
      },
      true
    );
  }
  function handleRefresh() {
    refreshSidebar(handleGroupClick);
  }
  async function init() {
    if (redirectFromCustomUrlIfNeeded()) {
      return;
    }
    void injectSidebar(handleGroupClick).catch((error) => {
      console.warn("Sidebar not ready yet, will retry on DOM changes:", error);
    });
    initModalObserver(handleRefresh);
    initMenu();
    initLocationObserver();
    initCategoryClickListener();
    initLogoClickListener();
    window.addEventListener("scroll", handleScroll);
    scheduleCategoryMetadataPrefetch();
    scheduleTagIconPrefetch();
    void restoreCustomGroupFromPending();
    const observer = new MutationObserver(() => {
      const list = document.querySelector("#sidebar-section-content-categories");
      const hasCustomGroups = getCategoryGroups().length > 0;
      if (list instanceof HTMLUListElement && hasCustomGroups) {
        const hasCustomItems = list.querySelector("[data-custom-group-id]");
        if (!hasCustomItems) {
          refreshSidebar(handleGroupClick);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  init();

})();