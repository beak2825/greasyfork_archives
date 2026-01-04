// ==UserScript==
// @name WTR LAB Novel Image Generator
// @description A powerful userscript to enhance web novel reading on WTR-LAB.COM. Select text to generate AI-powered images using multiple providers (Pollinations, AI Horde, Google Imagen, OpenAI). Features Gemini-enhanced prompts, 100+ art styles, a modern UI, history, and robust configuration options. Built with Webpack for modularity and maintainability.
// @version 6.1.0
// @author MasuRii
// @supportURL https://github.com/MasuRii/wtr-lab-novel-image-generator/issues
// @match https://wtr-lab.com/en/novel/*/*/*
// @connect *
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @icon https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/553073/WTR%20LAB%20Novel%20Image%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/553073/WTR%20LAB%20Novel%20Image%20Generator.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 72:
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 92:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Modern Utilities Tab === */
.nig-utilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--nig-space-xl);
  margin-top: var(--nig-space-xl);
}

.nig-utility-card {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-xl);
  transition: all var(--nig-transition-normal);
}

.nig-utility-card:hover {
  border-color: var(--nig-color-border-light);
  box-shadow: var(--nig-shadow-md);
  transform: translateY(-2px);
}

.nig-utility-card h4 {
  margin: 0 0 var(--nig-space-md) 0;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-lg);
  font-weight: 600;
}

.nig-utility-card p {
  margin: 0 0 var(--nig-space-lg) 0;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  line-height: 1.5;
}

.nig-utility-card .nig-save-btn {
  width: 100%;
  justify-content: center;
}

/* === Enhanced Utility Card Structure === */
.nig-card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--nig-space-md);
  margin-bottom: var(--nig-space-lg);
}

.nig-card-title {
  flex: 1;
  min-width: 0;
}

.nig-card-title h4 {
  margin: 0 0 var(--nig-space-sm) 0;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-lg);
  font-weight: 600;
  line-height: 1.3;
}

.nig-card-title p {
  margin: 0;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  line-height: 1.5;
}

.nig-card-actions {
  margin-bottom: var(--nig-space-lg);
}

.nig-card-secondary-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--nig-space-sm);
  margin-bottom: var(--nig-space-lg);
}

.nig-card-footer {
  padding-top: var(--nig-space-md);
  border-top: 1px solid var(--nig-color-border);
  margin-top: auto;
}

/* === Modern Button Variants === */
.nig-btn-primary {
  width: 100%;
  background: var(--nig-color-accent-warning);
  color: white;
  border: none;
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-md) var(--nig-space-lg);
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--nig-space-sm);
  transition: all var(--nig-transition-normal);
  box-shadow: var(--nig-shadow-sm);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.nig-btn-primary:hover {
  background: var(--nig-color-hover-error);
  transform: translateY(-1px);
  box-shadow: var(--nig-shadow-md);
}

.nig-btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--nig-shadow-sm);
}

.nig-btn-secondary {
  background: var(--nig-color-accent-primary);
  color: white;
  border: none;
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-xs) var(--nig-space-sm);
  font-size: var(--nig-font-size-xs);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--nig-space-xs);
  transition: all var(--nig-transition-normal);
  box-shadow: var(--nig-shadow-sm);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  min-height: 36px;
}

.nig-btn-secondary:hover {
  background: var(--nig-color-hover-primary);
  transform: translateY(-1px);
  box-shadow: var(--nig-shadow-md);
}

.nig-btn-secondary:active {
  transform: translateY(0);
  box-shadow: var(--nig-shadow-sm);
}

.nig-btn-secondary.nig-btn-error {
  background: var(--nig-color-accent-error);
  color: white;
}

.nig-btn-secondary.nig-btn-error:hover {
  background: var(--nig-color-hover-error);
  transform: translateY(-1px);
  box-shadow: var(--nig-shadow-md);
}

.nig-btn-secondary .material-symbols-outlined {
  font-size: var(--nig-font-size-xs);
}

.nig-btn-primary .material-symbols-outlined {
  font-size: var(--nig-font-size-sm);
}

/* === Status Widget === */
.nig-status-widget {
  position: fixed;
  bottom: var(--nig-space-xl);
  left: var(--nig-space-xl);
  z-index: 1020;
  background: var(--nig-color-bg-secondary);
  color: var(--nig-color-text-primary);
  padding: var(--nig-space-md) var(--nig-space-lg);
  border-radius: var(--nig-radius-lg);
  box-shadow: var(--nig-shadow-xl);
  display: none;
  align-items: center;
  gap: var(--nig-space-md);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  transition: all var(--nig-transition-normal);
  border: 1px solid var(--nig-color-border);
  backdrop-filter: blur(10px);
}

.nig-status-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nig-status-widget.loading .nig-status-icon {
  box-sizing: border-box;
  border: 2px solid var(--nig-color-text-muted);
  border-top-color: var(--nig-color-accent-primary);
  border-radius: 50%;
  animation: nig-spin 1s linear infinite;
}

.nig-status-widget.success {
  background: var(--nig-color-accent-success);
  color: white;
  cursor: pointer;
  border-color: var(--nig-color-accent-success);
}

.nig-status-widget.success:hover {
  background: var(--nig-color-hover-success);
  transform: translateY(-2px);
  box-shadow: var(--nig-shadow-lg);
}

.nig-status-widget.error {
  background: var(--nig-color-accent-error);
  border-color: var(--nig-color-accent-error);
}

@keyframes nig-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* === Loading Animations === */
.nig-image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 50%);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.nig-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgb(255 255 255 / 30%);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: nig-spin 1s linear infinite;
}

/* === Enhancement Status & Priority Utilities === */
.nig-enhancement-status {
  display: inline-flex;
  align-items: center;
  gap: var(--nig-space-sm);
  padding: var(--nig-space-xs) var(--nig-space-sm);
  border-radius: var(--nig-radius-md);
  font-size: var(--nig-font-size-xs);
  font-weight: 500;
  margin-left: var(--nig-space-md);
}

.nig-enhancement-status.provider-priority {
  background: var(--nig-color-accent-warning);
  color: white;
}

.nig-enhancement-status.external-ai {
  background: var(--nig-color-accent-primary);
  color: white;
}

.nig-enhancement-status.disabled {
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-muted);
}

.nig-status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4af028;
  opacity: 0.8;
}

/* === Enhancement Settings States === */
.nig-enhancement-settings {
  transition: all var(--nig-transition-normal);
}

.nig-enhancement-settings.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.nig-enhancement-settings.disabled .nig-form-group input,
.nig-enhancement-settings.disabled .nig-form-group select,
.nig-enhancement-settings.disabled .nig-form-group textarea {
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-muted);
  cursor: not-allowed;
}

/* === Modal Overlay Z-Index Hierarchy === */

/* Config Panel - Lower z-index */
#nig-config-panel.nig-modal-overlay {
  z-index: 99998;
}

/* Image Viewer - Higher z-index than config panel */
#nig-image-viewer.nig-modal-overlay {
  z-index: 99999;
}

/* Navigation Tabs - Higher than status widget, lower than modals */
.nig-tabs {
  z-index: 1000;
  position: relative;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 103:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $f: () => (/* binding */ getEnhancementLogHistory),
/* harmony export */   JE: () => (/* binding */ logWarn),
/* harmony export */   MD: () => (/* binding */ logDebug),
/* harmony export */   RJ: () => (/* binding */ updateLoggingStatus),
/* harmony export */   Rm: () => (/* binding */ log),
/* harmony export */   X: () => (/* binding */ clearEnhancementLogs),
/* harmony export */   fH: () => (/* binding */ logInfo),
/* harmony export */   vV: () => (/* binding */ logError),
/* harmony export */   xx: () => (/* binding */ loadEnhancementLogHistory)
/* harmony export */ });
/* unused harmony export formatLogEntry */
/* harmony import */ var _storage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(715);


let loggingEnabled = false;
let enhancementLogHistory = [];

/**
 * Updates the logging status from storage. Should be called on init.
 */
async function updateLoggingStatus() {
  loggingEnabled = await (0,_storage_js__WEBPACK_IMPORTED_MODULE_0__/* .getConfigValue */ .Ct)("loggingEnabled");
}

/**
 * The core logging function.
 * @param {'info'|'debug'|'warn'|'error'} level - The log level.
 * @param {string} category - The category of the log (e.g., 'UI', 'API').
 * @param {string} message - The log message.
 * @param {any} [data=null] - Optional data to log.
 */
function log(level, category, message, data = null) {
  const normalizedLevel = (level || "").toLowerCase();

  // Always log critical errors and warnings, regardless of toggle state
  const isCritical =
    normalizedLevel === "error" ||
    normalizedLevel === "warn" ||
    category === "SECURITY" ||
    category === "ERROR" ||
    category === "APP" ||
    category === "CONFIG_IMPORT";

  if (!loggingEnabled && !isCritical) {
    // When logging is disabled, completely suppress debug/info and non-critical logs
    return;
  }

  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: normalizedLevel,
    category,
    message,
    data,
  };

  const prefix = `[NIG-${normalizedLevel.toUpperCase()}]`;
  const categoryPrefix = `[${category}]`;
  const style = {
    error: "color: #ef4444",
    warn: "color: #f59e0b",
    debug: "color: #8b5cf6",
    info: "color: #6366f1",
  }[normalizedLevel];

  // Route to appropriate console method, ensuring critical visibility
  const consoleMethod = (() => {
    if (normalizedLevel === "error") {
      return console.error;
    }
    if (normalizedLevel === "warn") {
      return console.warn;
    }
    if (normalizedLevel === "info") {
      return console.info;
    }
    if (normalizedLevel === "debug") {
      return console.debug || console.log;
    }
    return console.log;
  })();

  if (data !== null && data !== undefined) {
    consoleMethod(`%c${prefix}`, style, categoryPrefix, message, data);
  } else {
    consoleMethod(`%c${prefix}`, style, categoryPrefix, message);
  }

  // Persist enhancement-related logs for history when logging is enabled
  if (loggingEnabled && category === "ENHANCEMENT") {
    enhancementLogHistory.unshift(logEntry);
    if (enhancementLogHistory.length > 50) {
      enhancementLogHistory = enhancementLogHistory.slice(0, 50);
    }
    GM_setValue(
      "enhancementLogHistory",
      JSON.stringify(enhancementLogHistory.slice(0, 20)),
    );
  }
}

// Convenience methods for different log levels
const logInfo = (category, message, data) =>
  log("info", category, message, data);
const logDebug = (category, message, data) =>
  log("debug", category, message, data);
const logWarn = (category, message, data) =>
  log("warn", category, message, data);
const logError = (category, message, data) =>
  log("error", category, message, data);

/**
 * Loads enhancement log history from storage.
 */
async function loadEnhancementLogHistory() {
  try {
    const stored = await GM_getValue("enhancementLogHistory", "[]");
    if (typeof stored === "string" && stored.trim()) {
      enhancementLogHistory = JSON.parse(stored);
    } else if (Array.isArray(stored)) {
      enhancementLogHistory = stored;
    } else {
      enhancementLogHistory = [];
    }
    logDebug(
      "LOG",
      `Loaded ${enhancementLogHistory.length} enhancement log entries from storage`,
    );
  } catch (e) {
    logError("LOG", "Failed to load enhancement log history", e);
    enhancementLogHistory = [];
    // Clear corrupted data
    try {
      await GM_setValue("enhancementLogHistory", "[]");
    } catch (clearError) {
      logError(
        "LOG",
        "Failed to clear corrupted enhancement log history",
        clearError,
      );
    }
  }
}

async function getEnhancementLogHistory() {
  await loadEnhancementLogHistory();
  return enhancementLogHistory;
}

function clearEnhancementLogs() {
  enhancementLogHistory = [];
  GM_setValue("enhancementLogHistory", "[]");
  logInfo("LOG", "Enhancement logs cleared by user");
}

function formatLogEntry(entry) {
  const time = new Date(entry.timestamp).toLocaleString();
  const levelColors = {
    ERROR: "#ef4444",
    WARN: "#f59e0b",
    INFO: "#6366f1",
    DEBUG: "#8b5cf6",
  };
  const color = levelColors[entry.level.toUpperCase()] || "#6366f1";

  return {
    time,
    level: entry.level,
    category: entry.category,
    message: entry.message,
    color,
    data: entry.data,
  };
}


/***/ }),

/***/ 113:
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ 168:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bh: () => (/* binding */ setCachedOpenAICompatModels),
/* harmony export */   Hg: () => (/* binding */ setCachedModels),
/* harmony export */   WN: () => (/* binding */ clearCachedModels),
/* harmony export */   bu: () => (/* binding */ getCachedModelsForProvider),
/* harmony export */   tb: () => (/* binding */ getCachedOpenAICompatModels)
/* harmony export */ });
/* unused harmony exports CACHE_EXPIRATION_MS, getCachedModels, clearCachedOpenAICompatModels */
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(103);


const CACHE_EXPIRATION_MS = (/* unused pure expression or super */ null && (24 * 60 * 60 * 1000)); // 24 hours

async function getCachedModels() {
  try {
    const cachedData = await GM_getValue("cachedModels", "{}");
    if (typeof cachedData === "string" && cachedData.trim()) {
      return JSON.parse(cachedData);
    } else if (typeof cachedData === "object" && cachedData !== null) {
      return cachedData;
    } else {
      // Invalid or empty data, return empty object
      return {};
    }
  } catch (error) {
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)(
      "error",
      "CACHE",
      "Failed to parse cached models data, resetting cache",
      { error: error.message },
    );
    // Clear the corrupted cache and return empty object
    await GM_setValue("cachedModels", "{}");
    return {};
  }
}

/**
 * Gets cached models for a specific provider
 * @param {string} provider - The provider name (e.g., 'pollinations', 'aiHorde')
 * @returns {Promise<Array|null>} Array of cached models or null if not found
 */
async function getCachedModelsForProvider(provider) {
  try {
    const cache = await getCachedModels();
    return cache[provider] || null;
  } catch (error) {
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", `Failed to get cached models for ${provider}`, {
      error: error.message,
    });
    return null;
  }
}

async function setCachedModels(provider, models) {
  try {
    const cache = await getCachedModels();
    cache[provider] = models;
    await GM_setValue("cachedModels", JSON.stringify(cache));
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("info", "CACHE", `Cached models for ${provider}`);
  } catch (error) {
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to cache models", {
      provider,
      error: error.message,
    });
    // Try to reset the cache and retry once
    await GM_setValue("cachedModels", "{}");
    try {
      const resetCache = await getCachedModels();
      resetCache[provider] = models;
      await GM_setValue("cachedModels", JSON.stringify(resetCache));
      (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("info", "CACHE", `Cached models for ${provider} after cache reset`);
    } catch (retryError) {
      (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to cache models even after reset", {
        provider,
        error: retryError.message,
      });
    }
  }
}

async function clearCachedModels(provider = null) {
  try {
    if (provider) {
      const cache = await getCachedModels();
      delete cache[provider];
      await GM_setValue("cachedModels", JSON.stringify(cache));
      (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .logInfo */ .fH)("CACHE", `Cleared cached models for ${provider}.`);
    } else {
      // Only clear the cached models, preserve all profile data
      // The profiles contain important user data like base URLs and API keys
      // that should not be affected by cache clearing
      await clearCachedOpenAICompatModels();

      // Also clear the main cached models (Pollinations, AI Horde, etc.)
      await GM_setValue("cachedModels", "{}");

      (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .logInfo */ .fH)(
        "CACHE",
        "Cleared all cached models and reset OpenAI Compatible model selections.",
      );
      alert(
        "All cached models have been cleared. They will be re-fetched when you next open the settings.",
      );
    }
  } catch (error) {
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to clear cached models", {
      provider,
      error: error.message,
    });
    // Force reset cache as fallback
    try {
      await GM_setValue("cachedModels", "{}");
      // Only reset the models cache, preserve profile data
      (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("info", "CACHE", "Force reset cache data as fallback");
    } catch (fallbackError) {
      (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to force reset cache", {
        error: fallbackError.message,
      });
    }
  }
}

// --- OpenAI Compatible Provider Caching Functions ---

/**
 * Gets cached models for a specific OpenAI compatible profile URL
 * @param {string} profileUrl - The base URL of the OpenAI compatible provider
 * @returns {Promise<Array>} Array of cached model objects or empty array
 */
async function getCachedOpenAICompatModels(profileUrl) {
  try {
    const cacheKey = `openAICompatModels_${profileUrl}`;
    const cachedData = await GM_getValue(cacheKey, "[]");
    if (typeof cachedData === "string" && cachedData.trim()) {
      return JSON.parse(cachedData);
    } else if (Array.isArray(cachedData)) {
      return cachedData;
    } else {
      return [];
    }
  } catch (error) {
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to parse OpenAI compatible models cache", {
      profileUrl,
      error: error.message,
    });
    return [];
  }
}

/**
 * Sets cached models for a specific OpenAI compatible profile URL
 * @param {string} profileUrl - The base URL of the OpenAI compatible provider
 * @param {Array} models - Array of model objects to cache
 */
async function setCachedOpenAICompatModels(profileUrl, models) {
  try {
    const cacheKey = `openAICompatModels_${profileUrl}`;
    await GM_setValue(cacheKey, JSON.stringify(models));
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)(
      "info",
      "CACHE",
      `Cached models for OpenAI compatible provider: ${profileUrl}`,
    );
  } catch (error) {
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to cache OpenAI compatible models", {
      profileUrl,
      error: error.message,
    });
  }
}

/**
 * Clears cached models for all OpenAI compatible providers
 */
async function clearCachedOpenAICompatModels() {
  try {
    // Get the profiles to know which cache keys to clear
    let profiles = {};
    try {
      const profilesData = await GM_getValue("openAICompatProfiles", "{}");
      if (typeof profilesData === "string" && profilesData.trim()) {
        profiles = JSON.parse(profilesData);
      } else if (typeof profilesData === "object" && profilesData !== null) {
        profiles = profilesData;
      }
    } catch (error) {
      (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)(
        "error",
        "CACHE",
        "Failed to get OpenAI profiles for cache clearing",
        { error: error.message },
      );
      return;
    }

    // Clear cache for each known profile
    for (const profileUrl of Object.keys(profiles)) {
      const cacheKey = `openAICompatModels_${profileUrl}`;
      await GM_setValue(cacheKey, "[]");
    }

    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .logInfo */ .fH)(
      "CACHE",
      "Cleared cached models for all OpenAI compatible providers.",
    );
  } catch (error) {
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to clear OpenAI compatible model caches", {
      error: error.message,
    });
  }
}


/***/ }),

/***/ 189:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  CB: () => (/* binding */ deleteSelectedOpenAIProfile),
  cG: () => (/* binding */ fetchGoogleModels),
  VM: () => (/* binding */ fetchOpenAICompatModels),
  YE: () => (/* binding */ loadCachedGoogleModels),
  tH: () => (/* binding */ loadSelectedOpenAIProfile),
  populateProviderForms: () => (/* binding */ populateProviderForms),
  Yl: () => (/* binding */ saveProviderConfigs)
});

// UNUSED EXPORTS: fetchAIHordeModels, fetchPollinationsModels, loadCachedOpenAICompatModels, loadOpenAIProfiles

;// ./src/config/models.js
const TOP_MODELS = [
  { name: "Deliberate", desc: "Versatile, high-quality realism and detail." },
  { name: "Anything Diffusion", desc: "Anime-style specialist." },
  {
    name: "ICBINP - I Can't Believe It's Not Photography",
    desc: "Photorealistic focus; excels in lifelike portraits.",
  },
  {
    name: "stable_diffusion",
    desc: "The classic base model; reliable all-rounder.",
  },
  {
    name: "AlbedoBase XL (SDXL)",
    desc: "SDXL variant; strong for high-res, detailed scenes.",
  },
  {
    name: "Nova Anime XL",
    desc: "Anime and illustration; vibrant, dynamic characters.",
  },
  {
    name: "Dreamshaper",
    desc: "Creative and dreamy outputs; good for artistic concepts.",
  },
  { name: "Hentai Diffusion", desc: "NSFW/anime erotica specialist." },
  { name: "CyberRealistic Pony", desc: "Realistic with a cyberpunk twist." },
  {
    name: "Flux.1-Schnell fp8 (Compact)",
    desc: "Newer, fast-generation model for quick results.",
  },
];

// EXTERNAL MODULE: ./src/utils/cache.js
var cache = __webpack_require__(168);
// EXTERNAL MODULE: ./src/utils/storage.js + 1 modules
var storage = __webpack_require__(715);
// EXTERNAL MODULE: ./src/utils/logger.js
var logger = __webpack_require__(103);
;// ./src/api/models.js
// --- IMPORTS ---





// --- PUBLIC FUNCTIONS ---

/**
 * Fetches Google models from the API
 * @param {string} apiKey - The Google API Key
 * @returns {Promise<Array>} - The list of models
 */
async function fetchGoogleModels(apiKey) {
  return new Promise((resolve, reject) => {
    logger/* logInfo */.fH("NETWORK", "Fetching Google models from API");
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      onload: async (response) => {
        try {
          const data = JSON.parse(response.responseText);
          if (!data.models) {
            throw new Error("Invalid response format from Google API");
          }

          const legacyIds = [
            "imagegeneration@006",
            "imagen-3.0-generate-002",
            "imagen-4.0-generate-001",
            "imagen-4.0-ultra-generate-001",
            "imagen-4.0-fast-generate-001",
            "gemini-2.5-flash-image",
            "gemini-3-pro-image-preview",
          ];

          const filteredModels = data.models.filter((model) => {
            const name = (model.displayName || model.name).toLowerCase();
            const id = model.name.split("/").pop(); // model.name is usually "models/some-id"
            return name.includes("image") || legacyIds.includes(id);
          });

          const models = filteredModels.map((model) => ({
            id: model.name.split("/").pop(),
            name: model.displayName || model.name,
          }));

          // Sort models: Prefer those starting with "imagen" or "gemini"
          models.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (aName.includes("imagen") && !bName.includes("imagen")) {
              return -1;
            }
            if (!aName.includes("imagen") && bName.includes("imagen")) {
              return 1;
            }
            return aName.localeCompare(bName);
          });

          await cache/* setCachedModels */.Hg("google", models);
          logger/* logInfo */.fH("NETWORK", "Fetched and cached Google models", {
            count: models.length,
          });
          resolve(models);
        } catch (e) {
          logger/* logError */.vV("NETWORK", "Failed to parse Google models", {
            error: e.message,
          });
          reject(e);
        }
      },
      onerror: (error) => {
        logger/* logError */.vV("NETWORK", "Failed to fetch Google models", {
          error: error,
        });
        reject(error);
      },
    });
  });
}

/**
 * Loads cached Google models
 * @returns {Promise<Array|null>} - The list of cached models or null
 */
async function loadCachedGoogleModels() {
  return await cache/* getCachedModelsForProvider */.bu("google");
}

/**
 * Fetches Pollinations models and populates the dropdown
 */
async function fetchPollinationsModels(selectedModel) {
  const select = document.getElementById("nig-pollinations-model");
  select.innerHTML = "<option>Loading models...</option>";

  try {
    const cachedModels = await cache/* getCachedModelsForProvider */.bu("pollinations");
    if (cachedModels && cachedModels.length > 0) {
      logger/* logInfo */.fH("CACHE", "Loading Pollinations models from cache");
      populatePollinationsSelect(select, cachedModels, selectedModel);
      return;
    }
  } catch (error) {
    logger/* logError */.vV("CACHE", "Failed to get cached Pollinations models", {
      error: error.message,
    });
  }

  logger/* logInfo */.fH("NETWORK", "Fetching Pollinations models from API");
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://image.pollinations.ai/models",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
    onload: async (response) => {
      try {
        const models = JSON.parse(response.responseText);
        await cache/* setCachedModels */.Hg("pollinations", models);
        logger/* logInfo */.fH("NETWORK", "Fetched and cached Pollinations models", {
          count: models.length,
        });
        populatePollinationsSelect(select, models, selectedModel);
      } catch (e) {
        logger/* logError */.vV("NETWORK", "Failed to parse Pollinations models", {
          error: e.message,
        });
        select.innerHTML = "<option>flux</option>";
        select.value = "flux";
      }
    },
    onerror: (error) => {
      logger/* logError */.vV("NETWORK", "Failed to fetch Pollinations models", {
        error: error,
      });
      select.innerHTML = "<option>flux</option>";
      select.value = "flux";
    },
  });
}

/**
 * Populates the Pollinations model dropdown
 */
function populatePollinationsSelect(select, models, selectedModel) {
  select.innerHTML = "";
  models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    let textContent = model;
    if (model === "gptimage") {
      textContent += " (Recommended: Quality)";
    } else if (model === "flux") {
      textContent += " (Default: Speed)";
    }
    option.textContent = textContent;
    select.appendChild(option);
  });
  if (models.includes(selectedModel)) {
    select.value = selectedModel;
  } else {
    select.value = "flux";
  }
}

/**
 * Fetches AI Horde models and populates the dropdown
 */
async function fetchAIHordeModels(selectedModel) {
  const select = document.getElementById("nig-horde-model");
  select.innerHTML = "<option>Loading models...</option>";

  try {
    const cachedModels = await cache/* getCachedModelsForProvider */.bu("aiHorde");
    if (cachedModels && cachedModels.length > 0) {
      logger/* logInfo */.fH("CACHE", "Loading AI Horde models from cache");
      populateAIHordeSelect(select, cachedModels, selectedModel);
      return;
    }
  } catch (error) {
    logger/* logError */.vV("CACHE", "Failed to get cached AI Horde models", {
      error: error.message,
    });
  }

  logger/* logInfo */.fH("NETWORK", "Fetching AI Horde models from API");
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://aihorde.net/api/v2/status/models?type=image",
    onload: async (response) => {
      try {
        const apiModels = JSON.parse(response.responseText);
        await cache/* setCachedModels */.Hg("aiHorde", apiModels);
        logger/* logInfo */.fH("NETWORK", "Fetched and cached AI Horde models", {
          count: apiModels.length,
        });
        populateAIHordeSelect(select, apiModels, selectedModel);
      } catch (e) {
        logger/* logError */.vV("NETWORK", "Failed to parse AI Horde models", {
          error: e.message,
        });
        select.innerHTML = "<option>Stable Diffusion</option>";
        select.value = "Stable Diffusion";
      }
    },
    onerror: (error) => {
      logger/* logError */.vV("NETWORK", "Failed to fetch AI Horde models", {
        error: error,
      });
      select.innerHTML = "<option>Stable Diffusion</option>";
      select.value = "Stable Diffusion";
    },
  });
}

/**
 * Populates the AI Horde model dropdown
 */
function populateAIHordeSelect(select, models, selectedModel) {
  select.innerHTML = "";

  const apiModelMap = new Map(models.map((m) => [m.name, m]));
  const topModelNames = new Set(TOP_MODELS.map((m) => m.name));

  const topGroup = document.createElement("optgroup");
  topGroup.label = "Top 10 Popular Models";

  const otherGroup = document.createElement("optgroup");
  otherGroup.label = "Other Models";

  // Add top models first
  TOP_MODELS.forEach((topModel) => {
    if (apiModelMap.has(topModel.name)) {
      const apiData = apiModelMap.get(topModel.name);
      const option = document.createElement("option");
      option.value = topModel.name;
      option.textContent = `${topModel.name} - ${topModel.desc} (${apiData.count} workers)`;
      topGroup.appendChild(option);
    }
  });

  // Add other models
  const otherModels = models
    .filter((m) => !topModelNames.has(m.name))
    .sort((a, b) => b.count - a.count);
  otherModels.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.name;
    option.textContent = `${model.name} (${model.count} workers)`;
    otherGroup.appendChild(option);
  });

  select.appendChild(topGroup);
  select.appendChild(otherGroup);

  if (Array.from(select.options).some((opt) => opt.value === selectedModel)) {
    select.value = selectedModel;
  } else {
    select.value = models[0]?.name || "Stable Diffusion";
  }
}

/**
 * Checks if a model is free to use, based primarily on plan_requirements.
 *
 * New rules:
 * - FREE if plan_requirements contains "free"
 * - PAID if plan_requirements does NOT contain "free" but contains "basic" or any higher tier
 * - Ignore intermediate tiers as separate categories; only free vs paid matters
 *
 * Robust handling:
 * - If plan_requirements missing/empty/malformed → fall back to legacy fields for backward compatibility
 *
 * @param {object} model
 * @returns {boolean} true if classified as free, false otherwise
 */
function isModelFree(model) {
  if (!model || typeof model !== "object") {
    // Malformed data - safe default is paid
    return false;
  }

  const tiersPriority = {
    free: 0,
    economy: 1,
    basic: 2,
    premium: 3,
    pro: 4,
    ultra: 5,
    enterprise: 6,
    admin: 7,
  };

  const hasValidPlanRequirements =
    Object.prototype.hasOwnProperty.call(model, "plan_requirements") &&
    Array.isArray(model.plan_requirements);

  if (hasValidPlanRequirements) {
    const normalized = model.plan_requirements
      .filter((t) => typeof t === "string")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t);

    if (normalized.length > 0) {
      if (normalized.includes("free")) {
        return true;
      }

      // Detect if any basic-or-higher tier is present.
      const hasBasicOrHigher = normalized.some((t) => {
        const rank = tiersPriority[t];
        return typeof rank === "number" && rank >= tiersPriority.basic;
      });

      if (hasBasicOrHigher) {
        return false;
      }

      // If we reach here, plan_requirements existed but only contained unknown/low tiers
      // that are not explicitly "free" and not mapped as paid → safe default is paid.
      return false;
    }
    // If it's an array but empty, fall through to legacy logic.
  }

  // Legacy / backward-compatible behavior:
  if (typeof model.is_free === "boolean") {
    return model.is_free;
  }
  if (typeof model.premium_model === "boolean") {
    return !model.premium_model;
  }
  if (Array.isArray(model.tiers)) {
    const normalizedTiers = model.tiers
      .filter((t) => typeof t === "string")
      .map((t) => t.trim().toLowerCase());
    if (normalizedTiers.includes("free")) {
      return true;
    }
  }

  // Default safe behavior when nothing else is conclusive: treat as paid.
  return false;
}

/**
 * Populates the OpenAI compatible model dropdown
 */
function populateOpenAICompatSelect(select, models, selectedModel) {
  select.innerHTML = "";
  const freeGroup = document.createElement("optgroup");
  freeGroup.label = "Free Models";
  const paidGroup = document.createElement("optgroup");
  paidGroup.label = "Paid Models";

  models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.id;
    option.textContent = model.id;
    if (isModelFree(model)) {
      freeGroup.appendChild(option);
    } else {
      paidGroup.appendChild(option);
    }
  });

  if (freeGroup.childElementCount > 0) {
    select.appendChild(freeGroup);
  }
  if (paidGroup.childElementCount > 0) {
    select.appendChild(paidGroup);
  }

  if (models.some((m) => m.id === selectedModel)) {
    select.value = selectedModel;
  }
}

/**
 * Fetches OpenAI compatible models
 */
async function fetchOpenAICompatModels() {
  const baseUrl = document
    .getElementById("nig-openai-compat-base-url")
    .value.trim();
  const apiKey = document
    .getElementById("nig-openai-compat-api-key")
    .value.trim();

  if (!baseUrl) {
    alert("Please enter a Base URL first.");
    return;
  }

  const select = document.getElementById("nig-openai-compat-model");
  select.innerHTML = "<option>Fetching models...</option>";

  logger/* logInfo */.fH(
    "NETWORK",
    `Fetching OpenAI compatible models from ${baseUrl}`,
  );

  GM_xmlhttpRequest({
    method: "GET",
    url: `${baseUrl}/models`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    onload: async (response) => {
      try {
        const data = JSON.parse(response.responseText);
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error("Invalid model list format received.");
        }

        let imageModels = [];
        if (data.data.some((m) => m.endpoint || m.endpoints)) {
          imageModels = data.data.filter(
            (model) =>
              model.endpoint === "/v1/images/generations" ||
              model.endpoints?.includes("/v1/images/generations"),
          );
        } else if (data.data.some((m) => m.type === "images.generations")) {
          imageModels = data.data.filter(
            (model) => model.type === "images.generations",
          );
        } else {
          // If no explicit image models found, try to identify them by name patterns
          imageModels = data.data.filter((model) => {
            const modelId = model.id.toLowerCase();
            return (
              modelId.includes("dall-e") ||
              modelId.includes("dalle") ||
              modelId.includes("image") ||
              modelId.includes("midjourney") ||
              modelId.includes("stable diffusion") ||
              modelId.includes("flux") ||
              modelId.includes("imagen")
            );
          });
        }

        imageModels.sort((a, b) => {
          const aIsFree = isModelFree(a);
          const bIsFree = isModelFree(b);
          if (aIsFree && !bIsFree) {
            return -1;
          }
          if (!aIsFree && bIsFree) {
            return 1;
          }
          return a.id.localeCompare(b.id);
        });

        if (imageModels.length === 0) {
          throw new Error(
            "No image generation models found. This provider may not support image generation.",
          );
        }

        populateOpenAICompatSelect(select, imageModels);

        // Cache the models for this profile
        await cache/* setCachedOpenAICompatModels */.Bh(baseUrl, imageModels);
        logger/* logInfo */.fH(
          "NETWORK",
          `Successfully fetched and cached ${imageModels.length} models for ${baseUrl}`,
        );
      } catch (error) {
        logger/* logError */.vV("NETWORK", "Failed to parse OpenAI compatible models", {
          error: error.message,
        });
        select.innerHTML = "<option>Failed to fetch models</option>";
        alert(
          `Failed to fetch models. Check the Base URL and API Key. You can enter the model name manually. Error: ${error.message}`,
        );

        // Switch to manual input mode
        document.getElementById(
          "nig-openai-model-container-select",
        ).style.display = "none";
        document.getElementById(
          "nig-openai-model-container-manual",
        ).style.display = "block";
      }
    },
    onerror: (error) => {
      logger/* logError */.vV("NETWORK", "Failed to fetch OpenAI compatible models", {
        error,
      });
      select.innerHTML = "<option>Failed to fetch models</option>";
      alert(
        "Failed to fetch models. Check your network connection and the Base URL. Switching to manual input.",
      );

      // Switch to manual input mode
      document.getElementById(
        "nig-openai-model-container-select",
      ).style.display = "none";
      document.getElementById(
        "nig-openai-model-container-manual",
      ).style.display = "block";
    },
  });
}

/**
 * Loads cached OpenAI compatible models for a profile
 */
async function loadCachedOpenAICompatModels(profileUrl, selectedModel) {
  const select = document.getElementById("nig-openai-compat-model");
  const cachedModels = await cache/* getCachedOpenAICompatModels */.tb(profileUrl);

  if (cachedModels && cachedModels.length > 0) {
    populateOpenAICompatSelect(select, cachedModels, selectedModel);
  } else {
    // No cached models, show fetch prompt
    select.innerHTML =
      "<option>No cached models. Click Fetch to get models.</option>";
  }
}

/**
 * Loads OpenAI profiles and populates the dropdown
 */
async function loadOpenAIProfiles() {
  const select = document.getElementById("nig-openai-compat-profile-select");
  const config = await storage/* getConfig */.zj();
  const profiles = config.openAICompatProfiles || {};
  const activeUrl = config.openAICompatActiveProfileUrl;

  select.innerHTML = "";

  Object.keys(profiles).forEach((url) => {
    const option = document.createElement("option");
    option.value = url;
    option.textContent = url;
    select.appendChild(option);
  });

  const newOption = document.createElement("option");
  newOption.value = "__new__";
  newOption.textContent = "— Add or Edit Profile —";
  select.appendChild(newOption);

  if (activeUrl && profiles[activeUrl]) {
    select.value = activeUrl;
  } else {
    select.value = "__new__";
  }
  loadSelectedOpenAIProfile();
}

/**
 * Loads the selected OpenAI profile
 */
async function loadSelectedOpenAIProfile() {
  const select = document.getElementById("nig-openai-compat-profile-select");
  const config = await storage/* getConfig */.zj();
  const profiles = config.openAICompatProfiles || {};
  const selectedUrl = select.value;

  if (selectedUrl && profiles[selectedUrl]) {
    const profile = profiles[selectedUrl];
    document.getElementById("nig-openai-compat-base-url").value = selectedUrl;
    document.getElementById("nig-openai-compat-api-key").value = profile.apiKey;

    if (config.openAICompatModelManualInput) {
      document.getElementById("nig-openai-compat-model-manual").value =
        profile.model;
    } else {
      document.getElementById("nig-openai-compat-model").value = profile.model;
      // Load cached models for this profile, if available
      loadCachedOpenAICompatModels(selectedUrl, profile.model);
    }
  } else {
    // New profile mode - clear the model selection
    document.getElementById("nig-openai-compat-base-url").value = "";
    document.getElementById("nig-openai-compat-api-key").value = "";
    document.getElementById("nig-openai-compat-model").innerHTML =
      "<option>Enter URL/Key and fetch...</option>";
  }
}

/**
 * Deletes the selected OpenAI profile
 */
async function deleteSelectedOpenAIProfile() {
  const select = document.getElementById("nig-openai-compat-profile-select");
  const selectedUrl = select.value;

  if (selectedUrl === "__new__") {
    alert("You can't delete the 'Add New' option.");
    return;
  }

  if (confirm(`Delete profile for "${selectedUrl}"?`)) {
    const config = await storage/* getConfig */.zj();
    const profiles = config.openAICompatProfiles || {};
    delete profiles[selectedUrl];
    await storage/* setConfigValue */.yJ("openAICompatProfiles", profiles);

    // Clear form fields
    document.getElementById("nig-openai-compat-base-url").value = "";
    document.getElementById("nig-openai-compat-api-key").value = "";
    document.getElementById("nig-openai-compat-model").innerHTML =
      "<option>Enter URL/Key and fetch...</option>";
    document.getElementById("nig-openai-compat-model-manual").value = "";

    await loadOpenAIProfiles();
  }
}

/**
 * Saves provider-specific configuration to storage
 */
async function saveProviderConfigs() {
  // Pollinations configuration
  await storage/* setConfigValue */.yJ(
    "pollinationsModel",
    document.getElementById("nig-pollinations-model").value,
  );
  await storage/* setConfigValue */.yJ(
    "pollinationsWidth",
    document.getElementById("nig-pollinations-width").value,
  );
  await storage/* setConfigValue */.yJ(
    "pollinationsHeight",
    document.getElementById("nig-pollinations-height").value,
  );
  await storage/* setConfigValue */.yJ(
    "pollinationsSeed",
    document.getElementById("nig-pollinations-seed").value.trim(),
  );
  await storage/* setConfigValue */.yJ(
    "pollinationsEnhance",
    document.getElementById("nig-pollinations-enhance").checked,
  );
  await storage/* setConfigValue */.yJ(
    "pollinationsSafe",
    document.getElementById("nig-pollinations-safe").checked,
  );
  await storage/* setConfigValue */.yJ(
    "pollinationsNologo",
    document.getElementById("nig-pollinations-nologo").checked,
  );
  await storage/* setConfigValue */.yJ(
    "pollinationsPrivate",
    document.getElementById("nig-pollinations-private").checked,
  );
  await storage/* setConfigValue */.yJ(
    "pollinationsToken",
    document.getElementById("nig-pollinations-token").value.trim(),
  );

  // AI Horde configuration
  await storage/* setConfigValue */.yJ(
    "aiHordeApiKey",
    document.getElementById("nig-horde-api-key").value.trim() || "0000000000",
  );
  await storage/* setConfigValue */.yJ(
    "aiHordeModel",
    document.getElementById("nig-horde-model").value,
  );
  await storage/* setConfigValue */.yJ(
    "aiHordeSampler",
    document.getElementById("nig-horde-sampler").value,
  );
  await storage/* setConfigValue */.yJ(
    "aiHordeSteps",
    document.getElementById("nig-horde-steps").value,
  );
  await storage/* setConfigValue */.yJ(
    "aiHordeCfgScale",
    document.getElementById("nig-horde-cfg").value,
  );
  await storage/* setConfigValue */.yJ(
    "aiHordeWidth",
    document.getElementById("nig-horde-width").value,
  );
  await storage/* setConfigValue */.yJ(
    "aiHordeHeight",
    document.getElementById("nig-horde-height").value,
  );
  await storage/* setConfigValue */.yJ(
    "aiHordeSeed",
    document.getElementById("nig-horde-seed").value.trim(),
  );
  const postProcessing = Array.from(
    document.querySelectorAll('input[name="nig-horde-post"]:checked'),
  ).map((cb) => cb.value);
  await storage/* setConfigValue */.yJ("aiHordePostProcessing", postProcessing);

  // Google configuration
  await storage/* setConfigValue */.yJ(
    "googleApiKey",
    document.getElementById("nig-google-api-key").value.trim(),
  );
  await storage/* setConfigValue */.yJ(
    "model",
    document.getElementById("nig-model").value,
  );
  await storage/* setConfigValue */.yJ(
    "numberOfImages",
    document.getElementById("nig-num-images").value,
  );
  await storage/* setConfigValue */.yJ(
    "imageSize",
    document.getElementById("nig-image-size").value,
  );
  await storage/* setConfigValue */.yJ(
    "aspectRatio",
    document.getElementById("nig-aspect-ratio").value,
  );
  await storage/* setConfigValue */.yJ(
    "personGeneration",
    document.getElementById("nig-person-gen").value,
  );

  // OpenAI Compatible configuration
  const baseUrl = document
    .getElementById("nig-openai-compat-base-url")
    .value.trim();
  if (baseUrl) {
    const profiles = await storage/* getConfigValue */.Ct("openAICompatProfiles");
    const isManualMode =
      document.getElementById("nig-openai-model-container-manual").style
        .display !== "none";
    const model = isManualMode
      ? document.getElementById("nig-openai-compat-model-manual").value.trim()
      : document.getElementById("nig-openai-compat-model").value;

    profiles[baseUrl] = {
      apiKey: document.getElementById("nig-openai-compat-api-key").value.trim(),
      model: model,
    };
    await storage/* setConfigValue */.yJ("openAICompatProfiles", profiles);
    await storage/* setConfigValue */.yJ("openAICompatActiveProfileUrl", baseUrl);
    await storage/* setConfigValue */.yJ("openAICompatModelManualInput", isManualMode);

    // Refresh the OpenAI profiles dropdown to show the newly saved profile
    await loadOpenAIProfiles();
  }
}

/**
 * Populates provider-specific form fields
 */
async function populateProviderForms(config) {
  // Pollinations settings
  document.getElementById("nig-pollinations-width").value =
    config.pollinationsWidth;
  document.getElementById("nig-pollinations-height").value =
    config.pollinationsHeight;
  document.getElementById("nig-pollinations-seed").value =
    config.pollinationsSeed;
  document.getElementById("nig-pollinations-enhance").checked =
    config.pollinationsEnhance;
  document.getElementById("nig-pollinations-safe").checked =
    config.pollinationsSafe;
  document.getElementById("nig-pollinations-nologo").checked =
    config.pollinationsNologo;
  document.getElementById("nig-pollinations-private").checked =
    config.pollinationsPrivate;
  document.getElementById("nig-pollinations-token").value =
    config.pollinationsToken;
  fetchPollinationsModels(config.pollinationsModel);

  // AI Horde settings
  document.getElementById("nig-horde-api-key").value = config.aiHordeApiKey;
  document.getElementById("nig-horde-sampler").value = config.aiHordeSampler;
  document.getElementById("nig-horde-steps").value = config.aiHordeSteps;
  document.getElementById("nig-horde-cfg").value = config.aiHordeCfgScale;
  document.getElementById("nig-horde-width").value = config.aiHordeWidth;
  document.getElementById("nig-horde-height").value = config.aiHordeHeight;
  document.getElementById("nig-horde-seed").value = config.aiHordeSeed;
  document.querySelectorAll('input[name="nig-horde-post"]').forEach((cb) => {
    cb.checked = config.aiHordePostProcessing.includes(cb.value);
  });
  fetchAIHordeModels(config.aiHordeModel);

  // Google settings
  document.getElementById("nig-google-api-key").value = config.googleApiKey;
  document.getElementById("nig-model").value = config.model;
  document.getElementById("nig-num-images").value = config.numberOfImages;
  document.getElementById("nig-image-size").value = config.imageSize;
  document.getElementById("nig-aspect-ratio").value = config.aspectRatio;
  document.getElementById("nig-person-gen").value = config.personGeneration;

  // OpenAI Compatible settings
  await loadOpenAIProfiles();
  if (config.openAICompatModelManualInput) {
    document.getElementById("nig-openai-model-container-select").style.display =
      "none";
    document.getElementById("nig-openai-model-container-manual").style.display =
      "block";
  } else {
    document.getElementById("nig-openai-model-container-select").style.display =
      "block";
    document.getElementById("nig-openai-model-container-manual").style.display =
      "none";
  }
}


/***/ }),

/***/ 249:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(565);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(754);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_utilities_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(92);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_layout_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(784);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(484);
// Imports







var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_css__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_utilities_css__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_layout_css__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Novel Image Generator - Main CSS Module ===
 * This file imports all CSS modules to maintain functionality
 * while providing better organization and maintainability.
 */

/* Import all CSS modules in proper order for cascade and specificity */

/* CSS Modules Structure:
 * - base.css: CSS custom properties, typography, fonts, and base styles
 * - components.css: UI components like buttons, modals, forms, and interactive elements
 * - utilities.css: Utility classes, status widgets, and helper functions
 * - layout.css: Layout systems, grids, tabs, image gallery, and responsive grids
 * - themes.css: Responsive design, media queries, and theme-specific styles
 */
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 314:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 322:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ downloadFile),
/* harmony export */   t: () => (/* binding */ getScriptName)
/* harmony export */ });
function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getScriptName() {
  const scriptName = "WTR LAB Novel Image Generator";
  return scriptName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
}


/***/ }),

/***/ 484:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Responsive Design === */

/* Mobile First Base (up to 767px) */
@media (width <= 767px) {
  .nig-modal-content {
    margin: var(--nig-space-md);
    padding: var(--nig-space-xl);
    max-height: 95vh;
    border-radius: var(--nig-radius-lg);
  }

  .nig-modal-overlay {
    padding: var(--nig-space-sm);
  }

  .nig-button {
    position: fixed;
    bottom: var(--nig-space-3xl);
    left: 50% !important;
    transform: translateX(-50%);
    top: auto !important;
    padding: var(--nig-space-sm) var(--nig-space-lg);
    font-size: var(--nig-font-size-sm);
    z-index: 100001;
    min-height: 44px; /* Touch target */
    border-radius: var(--nig-radius-lg);
  }

  .nig-button:hover {
    /* Prevent hover movement on mobile - maintain centering */
    transform: translateX(-50%);
    background: var(--nig-color-hover-primary);
  }

  .nig-tabs {
    margin: 0 calc(-1 * var(--nig-space-xl)) var(--nig-space-xl)
      calc(-1 * var(--nig-space-xl));
    padding: 0 var(--nig-space-xl);
  }

  .nig-tab {
    padding: var(--nig-space-md) var(--nig-space-lg);
    font-size: var(--nig-font-size-xs);
  }

  .nig-form-group-inline {
    grid-template-columns: 1fr;
    gap: var(--nig-space-md);
  }

  .nig-checkbox-group {
    flex-direction: column;
    gap: var(--nig-space-sm);
  }

  .nig-checkbox-group label {
    justify-content: flex-start;
  }

  .nig-utilities-grid {
    grid-template-columns: 1fr;
    gap: var(--nig-space-lg);
  }

  .nig-utility-card {
    padding: var(--nig-space-lg);
  }

  .nig-card-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--nig-space-sm);
  }

  .nig-card-secondary-actions {
    grid-template-columns: 1fr;
    gap: var(--nig-space-sm);
  }

  .nig-card-footer {
    text-align: center;
  }

  .nig-history-cleanup {
    flex-direction: column;
    align-items: stretch;
    gap: var(--nig-space-md);
  }

  .nig-history-cleanup input[type="number"] {
    width: 100%;
  }

  .nig-status-widget {
    bottom: var(--nig-space-lg);
    left: var(--nig-space-md);
    padding: var(--nig-space-md);
    font-size: var(--nig-font-size-xs);
  }

  .nig-image-gallery {
    grid-template-columns: 1fr;
    gap: var(--nig-space-lg);
  }

  .nig-modal-content h2 {
    font-size: var(--nig-font-size-xl);
    padding-right: 48px; /* Space for close button */
  }

  /* Mobile Enhancement Styles */
  .nig-preview-container {
    grid-template-columns: 1fr;
    gap: var(--nig-space-md);
  }

  .nig-preview-arrow {
    transform: rotate(90deg);
    justify-self: center;
  }

  .nig-enhancement-status {
    margin-left: 0;
    margin-top: var(--nig-space-sm);
    align-self: flex-start;
  }
}

/* Tablet (768px to 1023px) */
@media (width >= 768px) and (width <= 1023px) {
  .nig-modal-content {
    max-width: 700px;
  }

  .nig-utilities-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .nig-image-gallery {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .nig-config-grid {
    grid-template-columns: 1fr;
  }

  .nig-provider-controls {
    grid-template-columns: repeat(2, 1fr);
  }

  .nig-form-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .nig-style-grid {
    grid-template-columns: 1fr;
  }

  .nig-cleanup-controls {
    justify-content: flex-start;
  }
}

/* Desktop (1024px and up) */
@media (width >= 1024px) {
  .nig-modal-content {
    max-width: 1000px;
  }

  .nig-utilities-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .nig-image-gallery {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .nig-form-group-inline {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .nig-config-grid {
    grid-template-columns: 1fr;
  }

  .nig-provider-controls {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .nig-form-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .nig-style-grid {
    grid-template-columns: 1fr;
  }

  .nig-provider-settings:hover {
    transform: translateY(-2px);
    box-shadow: var(--nig-shadow-md);
  }

  /* Enhanced hover states for desktop */
  .nig-tab:hover {
    background: var(--nig-color-bg-tertiary);
  }

  .nig-history-item:hover {
    transform: translateY(-1px);
  }
}

/* Large Desktop (1280px and up) */
@media (width >= 1280px) {
  .nig-modal-content {
    max-width: 1200px;
  }

  .nig-utilities-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }

  .nig-config-grid {
    grid-template-columns: 1fr;
  }

  .nig-provider-controls {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .nig-style-grid {
    grid-template-columns: 1fr;
  }

  .nig-styling-container {
    grid-template-columns: 1fr;
  }
}

/* === Error Modal === */
#nig-error-reason {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  padding: var(--nig-space-lg);
  border-radius: var(--nig-radius-md);
  margin-top: var(--nig-space-sm);
  max-height: 150px;
  overflow-y: auto;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-family: "Fira Code", Monaco, Consolas, monospace;
  color: var(--nig-color-text-primary);
  line-height: 1.5;
}

.nig-error-prompt {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  padding: var(--nig-space-lg);
  border-radius: var(--nig-radius-md);
  margin-top: var(--nig-space-lg);
  max-height: 200px;
  overflow-y: auto;
  overflow-wrap: break-word;
  font-family: "Fira Code", Monaco, Consolas, monospace;
  width: 100%;
  resize: vertical;
  min-height: 80px;
  color: var(--nig-color-text-primary);
  line-height: 1.5;
}

.nig-error-actions {
  margin-top: var(--nig-space-xl);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 540:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 565:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap);"]);
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Base Typography and Font Loading === */

/* === CSS Custom Properties (Design Tokens) === */
:root {
  /* Color Palette - Modern Dark Theme */
  --nig-color-bg-primary: #1a1a1e;
  --nig-color-bg-secondary: #2d2d32;
  --nig-color-bg-tertiary: #3a3a40;
  --nig-color-bg-elevated: #404046;
  --nig-color-text-primary: #f0f0f0;
  --nig-color-text-secondary: #b4b4b8;
  --nig-color-text-muted: #8a8a8e;
  --nig-color-border: #55555a;
  --nig-color-border-light: #6a6a6e;

  /* Accent Colors */
  --nig-color-accent-primary: #6366f1;
  --nig-color-accent-secondary: #8b5cf6;
  --nig-color-accent-success: #10b981;
  --nig-color-accent-warning: #f59e0b;
  --nig-color-accent-error: #ef4444;

  /* Interactive States */
  --nig-color-hover-primary: #5855eb;
  --nig-color-hover-secondary: #7c3aed;
  --nig-color-hover-success: #059669;
  --nig-color-hover-error: #dc2626;

  /* Spacing Scale */
  --nig-space-xs: 0.25rem;
  --nig-space-sm: 0.5rem;
  --nig-space-md: 0.75rem;
  --nig-space-lg: 1rem;
  --nig-space-xl: 1.5rem;
  --nig-space-2xl: 2rem;
  --nig-space-3xl: 3rem;

  /* Typography Scale */
  --nig-font-size-xs: 0.75rem;
  --nig-font-size-sm: 0.875rem;
  --nig-font-size-base: 1rem;
  --nig-font-size-lg: 1.125rem;
  --nig-font-size-xl: 1.25rem;
  --nig-font-size-2xl: 1.5rem;
  --nig-font-size-3xl: 1.875rem;

  /* Border Radius */
  --nig-radius-sm: 0.375rem;
  --nig-radius-md: 0.5rem;
  --nig-radius-lg: 0.75rem;
  --nig-radius-xl: 1rem;

  /* Shadows */
  --nig-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 30%);
  --nig-shadow-md:
    0 4px 6px -1px rgb(0 0 0 / 40%), 0 2px 4px -1px rgb(0 0 0 / 30%);
  --nig-shadow-lg:
    0 10px 15px -3px rgb(0 0 0 / 50%), 0 4px 6px -2px rgb(0 0 0 / 40%);
  --nig-shadow-xl:
    0 20px 25px -5px rgb(0 0 0 / 60%), 0 10px 10px -5px rgb(0 0 0 / 50%);

  /* Transitions */
  --nig-transition-fast: 0.15s ease-out;
  --nig-transition-normal: 0.2s ease-out;
  --nig-transition-slow: 0.3s ease-out;

  /* Breakpoints */
  --nig-breakpoint-sm: 640px;
  --nig-breakpoint-md: 768px;
  --nig-breakpoint-lg: 1024px;
  --nig-breakpoint-xl: 1280px;
}

/* === Print Styles === */
@media print {
  .nig-modal-overlay,
  .nig-status-widget,
  .nig-button {
    display: none !important;
  }

  .nig-modal-content {
    box-shadow: none;
    border: 1px solid #000;
    background: white;
    color: black;
  }
}

/* === High Contrast Mode Support ===
 * Use prefers-contrast: more for standards-aligned high contrast enhancement.
 */
@media (prefers-contrast: more) {
  :root {
    --nig-color-bg-primary: #000;
    --nig-color-bg-secondary: #1a1a1a;
    --nig-color-bg-tertiary: #2a2a2a;
    --nig-color-text-primary: #fff;
    --nig-color-border: #666;
  }
}

/* === Reduced Motion Support === */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* === Material Symbols Import === */
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
  font-size: 18px;
}

/* === File Input Styling === */
input[type="file"] {
  border: 2px dashed var(--nig-color-border);
  background: var(--nig-color-bg-primary);
  padding: var(--nig-space-xl);
  border-radius: var(--nig-radius-lg);
  color: var(--nig-color-text-secondary);
  transition: all var(--nig-transition-normal);
  cursor: pointer;
}

input[type="file"]:hover {
  border-color: var(--nig-color-accent-primary);
  background: var(--nig-color-bg-elevated);
}

input[type="file"]:focus {
  outline: none;
  border-color: var(--nig-color-accent-primary);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 10%);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 601:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 642:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   show: () => (/* binding */ show),
/* harmony export */   v: () => (/* binding */ create)
/* harmony export */ });
/* unused harmony export initialize */
/* harmony import */ var _utils_file_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(322);
// Image Viewer Component


/**
 * Helper function to determine if an image URL is base64 encoded
 * @param {string} url - The image URL to check
 * @returns {boolean} - True if the image is base64 encoded
 */
function isBase64Image(url) {
  return url.startsWith("data:");
}

/**
 * Helper function to validate if a URL is properly formatted
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if the URL is valid
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function create() {
  if (document.getElementById("nig-image-viewer")) {
    return;
  }

  const imageViewer = document.createElement("div");
  imageViewer.id = "nig-image-viewer";
  imageViewer.className = "nig-modal-overlay";
  imageViewer.style.display = "none";
  imageViewer.innerHTML = `
		<div class="nig-modal-content">
			<span class="nig-close-btn">&times;</span>
			<div id="nig-prompt-container" class="nig-prompt-container">
				<div class="nig-prompt-header"><span>Generated Image Prompt</span></div>
				<p id="nig-prompt-text" class="nig-prompt-text"></p>
			</div>
			<div id="nig-image-gallery" class="nig-image-gallery"></div>
		</div>`;
  document.body.appendChild(imageViewer);
  imageViewer.querySelector(".nig-close-btn").addEventListener("click", () => {
    imageViewer.style.display = "none";
    // Import updateSystemStatus dynamically to avoid circular dependency
    Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 867)).then((module) => {
      if (typeof module.updateSystemStatus === "function") {
        // This will be handled by the main application
      }
    });
  });
  const promptContainer = imageViewer.querySelector("#nig-prompt-container");
  promptContainer.addEventListener("click", () => {
    promptContainer.classList.toggle("expanded");
  });
}

function show(imageUrls, prompt, provider, model = "Unknown") {
  if (!document.getElementById("nig-image-viewer")) {
    create();
  }
  const imageViewer = document.getElementById("nig-image-viewer");
  const gallery = imageViewer.querySelector("#nig-image-gallery");
  gallery.innerHTML = "";
  const promptContainer = imageViewer.querySelector("#nig-prompt-container");
  const promptText = imageViewer.querySelector("#nig-prompt-text");
  promptText.textContent = prompt;
  promptContainer.classList.remove("expanded");
  const extension =
    provider === "Pollinations" || provider === "OpenAICompat" ? "jpg" : "png";

  imageUrls.forEach((url, index) => {
    const container = document.createElement("div");
    container.className = "nig-image-container";
    const img = document.createElement("img");
    img.src = url;

    // Add loading state for URL images
    if (!isBase64Image(url)) {
      img.loading = "lazy";
      img.alt = "Generated image";

      // Add error handling for URL images
      img.onerror = () => {
        img.src =
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+";
        img.alt = "Image not available";
      };

      // Add loading indicator
      const loadingDiv = document.createElement("div");
      loadingDiv.className = "nig-image-loading";
      loadingDiv.innerHTML = '<div class="nig-spinner"></div>';
      container.appendChild(loadingDiv);

      img.onload = () => {
        loadingDiv.remove();
      };
    }

    const actions = document.createElement("div");
    actions.className = "nig-image-actions";

    // Download button
    const downloadBtn = document.createElement("button");
    downloadBtn.innerHTML =
      '<span class="material-symbols-outlined">download</span>';
    downloadBtn.title = "Download Image";
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = url;
      const scriptName = (0,_utils_file_js__WEBPACK_IMPORTED_MODULE_0__/* .getScriptName */ .t)();
      const providerName = provider
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_");
      const modelName = model.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
      const promptSnippet = prompt
        .substring(0, 15)
        .replace(/\s/g, "_")
        .replace(/[^\w_]/g, "");
      a.download = `${scriptName}_${providerName}_${modelName}_${promptSnippet}_${index + 1}.${extension}`;
      a.click();
    };

    // Fullscreen button
    const fullscreenBtn = document.createElement("button");
    fullscreenBtn.innerHTML =
      '<span class="material-symbols-outlined">fullscreen</span>';
    fullscreenBtn.title = "View Fullscreen";
    fullscreenBtn.onclick = () => {
      if (img.requestFullscreen) {
        img.requestFullscreen();
      }
    };

    // URL link button (only for URL images)
    const urlLinkBtn = document.createElement("button");
    if (!isBase64Image(url) && isValidUrl(url)) {
      urlLinkBtn.innerHTML =
        '<span class="material-symbols-outlined">link</span>';
      urlLinkBtn.title = "Open Image URL";
      urlLinkBtn.onclick = () => {
        window.open(url, "_blank");
      };
      actions.appendChild(urlLinkBtn);
    }

    actions.appendChild(downloadBtn);
    actions.appendChild(fullscreenBtn);
    container.appendChild(img);
    container.appendChild(actions);
    gallery.appendChild(container);
  });
  imageViewer.style.display = "flex";
}

function initialize() {
  create();
}


/***/ }),

/***/ 659:
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 715:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Pc: () => (/* binding */ addToHistory),
  qg: () => (/* binding */ cleanHistoryEnhanced),
  j5: () => (/* binding */ cleanOldHistory),
  zj: () => (/* binding */ getConfig),
  Ct: () => (/* binding */ getConfigValue),
  A5: () => (/* binding */ getFilteredHistory),
  Iy: () => (/* binding */ getHistoryDays),
  yJ: () => (/* binding */ setConfigValue),
  qH: () => (/* binding */ setHistoryDays)
});

// UNUSED EXPORTS: getHistory

// EXTERNAL MODULE: ./src/config/defaults.js
var defaults = __webpack_require__(753);
;// ./src/utils/linkValidator.js
/**
 * Link validation utility for checking image URL accessibility
 */

/**
 * Checks if an image URL is accessible and valid
 * @param {string} url - The image URL to validate
 * @param {number} timeout - Request timeout in milliseconds (default: 5000)
 * @returns {Promise<Object>} Result object with status and accessibility info
 */
async function validateImageLink(url, timeout = 5000) {
  // Skip validation for data URLs (base64 images)
  if (url.startsWith("data:")) {
    return {
      isAccessible: true,
      status: "valid",
      error: null,
      method: "data-url",
    };
  }

  // Skip validation for blob URLs
  if (url.startsWith("blob:")) {
    return {
      isAccessible: true,
      status: "valid",
      error: null,
      method: "blob-url",
    };
  }

  try {
    // Try HEAD request first (more efficient)
    const headController = new AbortController();
    const headTimeoutId = setTimeout(() => headController.abort(), timeout);

    const headResponse = await fetch(url, {
      method: "HEAD",
      mode: "cors",
      signal: headController.signal,
      cache: "no-cache",
    });

    clearTimeout(headTimeoutId);

    if (headResponse.ok) {
      return {
        isAccessible: true,
        status: headResponse.status,
        statusText: headResponse.statusText,
        error: null,
        method: "head",
      };
    }

    // If HEAD fails with certain status codes, try GET
    if (headResponse.status === 405 || headResponse.status === 501) {
      // Method Not Allowed or Not Implemented - try GET
      const getController = new AbortController();
      const getTimeoutId = setTimeout(() => getController.abort(), timeout);

      const getResponse = await fetch(url, {
        method: "GET",
        mode: "cors",
        signal: getController.signal,
        cache: "no-cache",
      });

      clearTimeout(getTimeoutId);

      return {
        isAccessible: getResponse.ok,
        status: getResponse.status,
        statusText: getResponse.statusText,
        error: getResponse.ok
          ? null
          : new Error(`HTTP ${getResponse.status}: ${getResponse.statusText}`),
        method: "get",
      };
    }

    // For other error status codes (403, 404, 500, etc.)
    return {
      isAccessible: false,
      status: headResponse.status,
      statusText: headResponse.statusText,
      error: new Error(
        `HTTP ${headResponse.status}: ${headResponse.statusText}`,
      ),
      method: "head",
    };
  } catch (error) {
    // Handle network errors, CORS issues, timeouts, etc.
    if (error.name === "AbortError") {
      return {
        isAccessible: false,
        status: "timeout",
        statusText: "Request timeout",
        error: new Error("Request timeout"),
        method: "timeout",
      };
    }

    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      return {
        isAccessible: false,
        status: "network-error",
        statusText: "Network error or CORS blocked",
        error: new Error("Network error or CORS blocked"),
        method: "network-error",
      };
    }

    return {
      isAccessible: false,
      status: "unknown-error",
      statusText: "Unknown error",
      error: error,
      method: "error",
    };
  }
}

/**
 * Validates multiple image links concurrently with progress callback
 * @param {Array<string>} urls - Array of image URLs to validate
 * @param {Function} progressCallback - Callback function for progress updates
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<Array<Object>>} Array of validation results
 */
async function validateImageLinks(
  urls,
  progressCallback = null,
  timeout = 5000,
) {
  const results = [];
  const total = urls.length;

  // Process URLs in batches to avoid overwhelming the network
  const batchSize = 3;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);

    const batchPromises = batch.map(async (url, _index) => {
      const result = await validateImageLink(url, timeout);
      result.url = url;
      return result;
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Update progress
    if (progressCallback) {
      progressCallback({
        current: Math.min(i + batchSize, total),
        total: total,
        completed: results.length,
        failed: results.filter((r) => !r.isAccessible).length,
      });
    }

    // Small delay between batches to be respectful to servers
    if (i + batchSize < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Filters history entries to remove expired/broken links
 * @param {Array<Object>} history - History entries to filter
 * @param {Function} progressCallback - Optional progress callback
 * @returns {Promise<Object>} Object with filtered history and statistics
 */
async function filterExpiredLinks(history, progressCallback = null) {
  const urlsToCheck = history
    .filter(
      (entry) =>
        entry.url &&
        !entry.url.startsWith("data:") &&
        !entry.url.startsWith("blob:"),
    )
    .map((entry) => entry.url);

  if (urlsToCheck.length === 0) {
    return {
      filteredHistory: history,
      expiredLinksCount: 0,
      totalLinksChecked: 0,
      results: [],
    };
  }

  const validationResults = await validateImageLinks(
    urlsToCheck,
    progressCallback,
  );
  const expiredUrls = validationResults
    .filter((result) => !result.isAccessible)
    .map((result) => result.url);

  const validEntries = history.filter((entry) => {
    if (
      !entry.url ||
      entry.url.startsWith("data:") ||
      entry.url.startsWith("blob:")
    ) {
      return true; // Always keep data URLs and blob URLs
    }
    return !expiredUrls.includes(entry.url);
  });

  return {
    filteredHistory: validEntries,
    expiredLinksCount: expiredUrls.length,
    totalLinksChecked: urlsToCheck.length,
    results: validationResults,
  };
}

;// ./src/utils/storage.js



/**
 * Retrieves a single configuration value from storage.
 * @param {string} key - The key of the config value to retrieve.
 * @returns {Promise<any>} The value from storage or the default value.
 */
async function getConfigValue(key) {
  return await GM_getValue(key, defaults/* DEFAULTS */.z[key]);
}

/**
 * Retrieves the entire configuration object from storage.
 * @returns {Promise<object>} The complete configuration object.
 */
async function getConfig() {
  const config = {};
  for (const key in defaults/* DEFAULTS */.z) {
    config[key] = await GM_getValue(key, defaults/* DEFAULTS */.z[key]);
  }
  return config;
}

/**
 * Sets a configuration value in storage.
 * @param {string} key - The key of the config value to set.
 * @param {any} value - The value to store.
 */
async function setConfigValue(key, value) {
  await GM_setValue(key, value);
}

/**
 * Retrieves the generation history from storage.
 * @returns {Promise<Array<object>>} The history array.
 */
async function getHistory() {
  try {
    const historyData = await GM_getValue("history", "[]");
    if (typeof historyData === "string" && historyData.trim()) {
      return JSON.parse(historyData);
    } else if (Array.isArray(historyData)) {
      return historyData;
    } else {
      // Invalid or empty data, return empty array
      return [];
    }
  } catch (error) {
    console.error("Failed to parse history data, resetting", error);
    // Clear the corrupted history and return empty array
    await GM_setValue("history", "[]");
    return [];
  }
}

/**
 * Adds a new item to the generation history.
 * @param {object} item - The history item to add.
 */
async function addToHistory(item) {
  const history = await getHistory();
  history.unshift(item);
  // Limit history to the last 100 entries
  if (history.length > 100) {
    history.pop();
  }
  await GM_setValue("history", JSON.stringify(history));
}

/**
 * Retrieves the history days setting from storage.
 * @returns {Promise<number>} The number of days for history retention.
 */
async function getHistoryDays() {
  try {
    const days = await GM_getValue("historyDays", defaults/* DEFAULTS */.z.historyDays);
    // Validate and ensure the value is a positive number
    const parsedDays = parseInt(days);
    if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
      console.warn("Invalid historyDays value, using default:", days);
      await setHistoryDays(defaults/* DEFAULTS */.z.historyDays);
      return defaults/* DEFAULTS */.z.historyDays;
    }
    return parsedDays;
  } catch (error) {
    console.error("Failed to get historyDays setting:", error);
    return defaults/* DEFAULTS */.z.historyDays;
  }
}

/**
 * Sets the history days setting in storage.
 * @param {number} days - The number of days to retain history.
 */
async function setHistoryDays(days) {
  try {
    // Validate the input
    const parsedDays = parseInt(days);
    if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
      throw new Error(
        `Invalid historyDays value: ${days}. Must be between 1 and 365.`,
      );
    }
    await GM_setValue("historyDays", parsedDays);
    return true;
  } catch (error) {
    console.error("Failed to set historyDays:", error);
    throw error;
  }
}

/**
 * Gets filtered history based on the configured days setting.
 * @returns {Promise<Array<object>>} The filtered history array.
 */
async function getFilteredHistory() {
  try {
    const history = await getHistory();
    const historyDays = await getHistoryDays();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - historyDays);

    return history.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate > cutoffDate;
    });
  } catch (error) {
    console.error("Failed to get filtered history:", error);
    return await getHistory(); // Fallback to unfiltered history
  }
}

/**
 * Cleans old history entries based on the configured days setting.
 * @returns {Promise<number>} The number of entries removed.
 */
async function cleanOldHistory() {
  try {
    const history = await getHistory();
    const historyDays = await getHistoryDays();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - historyDays);

    const filteredHistory = history.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate > cutoffDate;
    });

    const removedCount = history.length - filteredHistory.length;

    if (removedCount > 0) {
      await GM_setValue("history", JSON.stringify(filteredHistory));
    }

    return removedCount;
  } catch (error) {
    console.error("Failed to clean old history:", error);
    throw error;
  }
}

/**
 * Enhanced cleaning function that removes both expired links and old entries.
 * @param {Function} progressCallback - Optional callback for progress updates during link validation
 * @returns {Promise<Object>} Object containing cleaning statistics.
 */
async function cleanHistoryEnhanced(progressCallback = null) {
  try {
    const history = await getHistory();
    const historyDays = await getHistoryDays();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - historyDays);

    // Step 1: Filter out old entries based on age
    const ageFilteredHistory = history.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate > cutoffDate;
    });

    const oldEntriesRemoved = history.length - ageFilteredHistory.length;

    // Step 2: Filter out entries with broken/expired links
    const linkValidationResult = await filterExpiredLinks(
      ageFilteredHistory,
      progressCallback,
    );
    const expiredLinksRemoved = linkValidationResult.expiredLinksCount;
    const finalFilteredHistory = linkValidationResult.filteredHistory;

    // Step 3: Save the cleaned history
    const totalRemoved = oldEntriesRemoved + expiredLinksRemoved;
    if (totalRemoved > 0) {
      await GM_setValue("history", JSON.stringify(finalFilteredHistory));
    }

    return {
      totalRemoved: totalRemoved,
      oldEntriesRemoved: oldEntriesRemoved,
      expiredLinksRemoved: expiredLinksRemoved,
      totalLinksChecked: linkValidationResult.totalLinksChecked,
      finalHistoryCount: finalFilteredHistory.length,
    };
  } catch (error) {
    console.error("Failed to clean history with enhanced method:", error);
    throw error;
  }
}


/***/ }),

/***/ 753:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: () => (/* binding */ DEFAULTS)
/* harmony export */ });
const DEFAULTS = {
  selectedProvider: "Pollinations",
  loggingEnabled: false,
  // Prompt Styling
  mainPromptStyle: "None",
  subPromptStyle: "none",
  customStyleEnabled: false,
  customStyleText: "",
  // AI Prompt Enhancement
  enhancementEnabled: false,
  enhancementProvider: "gemini", // 'gemini', 'disabled'
  enhancementApiKey: "",
  enhancementModel: "models/gemini-2.5-pro",
  // Default enhancement behavior is driven by the selected preset.
  // This base template is aligned with the "Standard Enhancement" preset.
  enhancementTemplate:
    "Extract visual elements from this text and craft a concise, image-ready prompt as a flowing paragraph. Focus on: clear subjects, setting and environment, lighting/mood/color palette, and artistic style/composition/framing. Omit narrative, dialogue, text overlays, and non-visual details. Use vivid, concrete descriptors separated by commas or short phrases. End with quality boosters such as highly detailed, sharp focus, high resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene and mood, then add style and technical details.",
  enhancementTemplateSelected: "standard",
  enhancementOverrideProvider: false,
  enhancementLastStatus: "disabled",
  // Enhancement Retry and Fallback Configuration
  enhancementMaxRetriesPerModel: 2,
  enhancementRetryDelay: 1000,
  enhancementModelsFallback: [
    "models/gemini-2.5-pro",
    "models/gemini-flash-latest",
    "models/gemini-flash-lite-latest",
    "models/gemini-2.5-flash",
    "models/gemini-2.5-flash-lite",
  ],
  enhancementLogLevel: "info", // 'debug', 'info', 'warn', 'error'
  enhancementAlwaysFallback: true,
  // Preset Enhancement Prompts
  // Default enhancement presets (top 5 only). User presets are stored separately.
  enhancementPresets: {
    standard: {
      name: "Standard Enhancement",
      description: "Default enhancement that improves prompt quality",
      template:
        'Extract visual elements from this text and craft a concise image generation prompt as a flowing paragraph. Focus on: characters and their appearances/actions/expressions, setting and environment, lighting/mood/color palette, artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, specific descriptors separated by commas or short phrases for clarity. End with quality boosters like "highly detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene/mood, then style/technicals:',
    },
    safety: {
      name: "Safety Enhancement",
      description:
        "Enhances prompts while removing harmful or inappropriate content",
      template:
        'Extract visual elements from this text and craft a safe, concise image generation prompt as a flowing paragraph while removing harmful, inappropriate, or policy-violating elements. Focus on: positive and suitable characters and their appropriate appearances/actions/expressions, safe setting and environment, wholesome lighting/mood/color palette, appropriate artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, specific descriptors separated by commas or short phrases for clarity. End with safety-focused quality boosters like "appropriate content, family-friendly, positive imagery, safe, well-balanced, detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with safe core subjects, layer in safe scene/mood, then appropriate style/technicals:',
    },
    artistic: {
      name: "Artistic Enhancement",
      description: "Focuses on artistic and creative elements",
      template:
        'Extract visual elements from this text and craft an artistic image generation prompt as a flowing paragraph with emphasis on creative elements and visual aesthetics. Focus on: characters and their creative appearances/actions/expressions with artistic flair, artistic setting and environment, vibrant lighting/mood/color palette, artistic style/composition/framing with emphasis on artistic techniques. Omit narrative, dialogue, text, or non-visual details. Use vivid, artistic descriptors separated by commas or short phrases for clarity. End with artistic quality boosters like "artistic masterpiece, creative composition, vibrant colors, detailed artwork, museum quality, fine art, highly detailed, sharp focus, 8K resolution. Generated Prompt Structure: Start with artistic core subjects, layer in creative scene/mood, then artistic style/technicals:',
    },
    technical: {
      name: "Technical Enhancement",
      description: "Emphasizes technical accuracy and detail",
      template:
        'Extract visual elements from this text and craft a technically-precise image generation prompt as a flowing paragraph with emphasis on technical accuracy and realistic elements. Focus on: characters with technically accurate appearances/actions/expressions, realistic setting and environment, precise lighting/mood/color palette, technical artistic style/composition/framing with photorealistic qualities. Omit narrative, dialogue, text, or non-visual details. Use precise, technical descriptors separated by commas or short phrases for clarity. End with technical quality boosters like "photorealistic, technical precision, accurate details, high resolution, professional photography, sharp focus, 8K detail, masterpiece. Generated Prompt Structure: Start with technically accurate core subjects, layer in realistic scene/mood, then technical style/technicals:',
    },
    character: {
      name: "Character Enhancement",
      description: "Focuses on character development and description",
      template:
        'Extract visual elements from this text and craft a character-focused image generation prompt as a flowing paragraph with emphasis on character details and development. Focus on: detailed character appearances/actions/expressions with rich personality traits, character-centric setting and environment, character-appropriate lighting/mood/color palette, character-driven artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, character-specific descriptors separated by commas or short phrases for clarity. End with character-focused quality boosters like "detailed character, expressive features, well-defined personality, professional portrait, masterpiece character study, highly detailed, sharp focus, 8K resolution. Generated Prompt Structure: Start with compelling core characters, layer in character-appropriate scene/mood, then character-focused style/technicals:',
    },
  },
  /**
   * User-defined enhancement presets (schema v1).
   * Stored separately from enhancementPresets to preserve default set across updates.
   *
   * Shape:
   * {
   *   "<id>": {
   *     id: string,
   *     name: string,
   *     description?: string,
   *     template: string,
   *     createdAt?: string,
   *     updatedAt?: string,
   *     version?: 1
   *   },
   *   ...
   * }
   *
   * Backward compatibility:
   * - If existing stored value is an array or legacy map without id, migration logic
   *   in the UI/loader should normalize it into this keyed-object shape.
   */
  enhancementUserPresets: {},
  // Global Negative Prompting
  enableNegPrompt: true,
  globalNegPrompt:
    "ugly, blurry, deformed, disfigured, poor details, bad anatomy, low quality",
  // Google
  googleApiKey: "",
  model: "imagen-4.0-generate-001",
  numberOfImages: 1,
  imageSize: "1024",
  aspectRatio: "1:1",
  personGeneration: "allow_adult",
  // AI Horde
  aiHordeApiKey: "0000000000",
  aiHordeModel: "AlbedoBase XL (SDXL)",
  aiHordeSampler: "k_dpmpp_2m",
  aiHordeSteps: 25,
  aiHordeCfgScale: 7,
  aiHordeWidth: 512,
  aiHordeHeight: 512,
  aiHordePostProcessing: [],
  aiHordeSeed: "",
  // Pollinations.ai
  pollinationsModel: "flux",
  pollinationsWidth: 512,
  pollinationsHeight: 512,
  pollinationsSeed: "",
  pollinationsEnhance: true,
  pollinationsNologo: false,
  pollinationsPrivate: false,
  pollinationsSafe: true,
  pollinationsToken: "",
  // OpenAI Compatible
  openAICompatProfiles: {},
  openAICompatActiveProfileUrl: "",
  openAICompatModelManualInput: false,
  // History Management
  historyDays: 30,
};


/***/ }),

/***/ 754:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Base Components === */
.nig-button {
  position: absolute;
  z-index: 99998;
  background: var(--nig-color-accent-primary);
  color: white;
  border: none;
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-sm) var(--nig-space-md);
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--nig-shadow-md);
  display: none;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  transition: all var(--nig-transition-normal);
  transform: translateY(0);
}

.nig-button:hover {
  background: var(--nig-color-hover-primary);
  transform: translateY(-1px);
  box-shadow: var(--nig-shadow-lg);
}

.nig-button:active {
  transform: translateY(0);
  box-shadow: var(--nig-shadow-sm);
}

/* === Modal Components === */
.nig-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 70%);
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--nig-space-lg);
}

.nig-modal-content {
  background: var(--nig-color-bg-secondary);
  color: var(--nig-color-text-primary);
  padding: var(--nig-space-2xl);
  border-radius: var(--nig-radius-xl);
  box-shadow: var(--nig-shadow-xl);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  border: 1px solid var(--nig-color-border);
  animation: nig-modal-appear 0.2s ease-out;
}

@keyframes nig-modal-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.nig-modal-content li {
  margin-bottom: var(--nig-space-md);
}

.nig-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  font-size: var(--nig-font-size-2xl);
  font-weight: 300;
  cursor: pointer;
  color: var(--nig-color-text-muted);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--nig-radius-md);
  transition: all var(--nig-transition-fast);
}

.nig-close-btn:hover {
  color: var(--nig-color-text-primary);
  background: var(--nig-color-bg-tertiary);
}

.nig-modal-content h2 {
  margin-top: 0;
  border-bottom: 1px solid var(--nig-color-border);
  padding-bottom: var(--nig-space-lg);
  font-size: var(--nig-font-size-2xl);
  font-weight: 600;
  letter-spacing: -0.025em;
}

/* === Form Elements === */
.nig-form-group {
  margin-bottom: var(--nig-space-xl);
}

.nig-form-group label {
  display: block;
  margin-bottom: var(--nig-space-sm);
  font-weight: 500;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-sm);
}

.nig-form-group small.nig-hint {
  color: var(--nig-color-text-muted);
  font-weight: normal;
  display: block;
  margin-top: var(--nig-space-sm);
  margin-bottom: var(--nig-space-sm);
  min-height: 1.2em;
  font-size: var(--nig-font-size-xs);
  line-height: 1.4;
}

.nig-form-group input,
.nig-form-group select,
.nig-form-group textarea {
  width: 100%;
  padding: var(--nig-space-sm) var(--nig-space-md);
  border-radius: var(--nig-radius-md);
  border: 1px solid var(--nig-color-border);
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-sm);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  transition: all var(--nig-transition-fast);
  outline: none;
}

.nig-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--nig-space-lg);
}

.nig-checkbox-group label {
  display: flex;
  align-items: center;
  margin-right: 0;
  font-weight: normal;
  cursor: pointer;
  color: var(--nig-color-text-secondary);
}

.nig-checkbox-group input[type="checkbox"] {
  width: auto;
  margin-right: var(--nig-space-sm);
  margin-bottom: 0;
  transform: scale(1.1);
}

.nig-form-group input:focus {
  border-color: var(--nig-color-accent-primary);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 10%);
  background: var(--nig-color-bg-elevated);
}

.nig-form-group textarea:focus {
  border-color: var(--nig-color-accent-primary);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 10%);
  background: var(--nig-color-bg-elevated);
}

.nig-form-group select:disabled {
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-muted);
  cursor: not-allowed;
}

.nig-form-group-inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--nig-space-lg);
  align-items: end;
}

.nig-form-group-inline label {
  margin-bottom: var(--nig-space-sm);
}

/* Password / API key visibility wrapper */
.nig-password-wrapper {
  display: flex;
  align-items: center;
  gap: var(--nig-space-sm);
}

.nig-password-wrapper input[type="password"],
.nig-password-wrapper input[type="text"] {
  flex: 1;
}

.nig-password-toggle {
  border: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--nig-color-text-muted);
  transition:
    color var(--nig-transition-fast),
    transform var(--nig-transition-fast);
}

.nig-password-toggle:hover,
.nig-password-toggle:focus-visible {
  color: var(--nig-color-accent-primary);
  transform: scale(1.05);
  outline: none;
}

.nig-password-toggle .material-symbols-outlined {
  font-size: 20px;
}

/* === Button Components === */
.nig-save-btn {
  background: var(--nig-color-accent-success);
  color: white;
  padding: var(--nig-space-md) var(--nig-space-xl);
  border: none;
  border-radius: var(--nig-radius-md);
  cursor: pointer;
  font-size: var(--nig-font-size-base);
  font-weight: 500;
  transition: all var(--nig-transition-normal);
  box-shadow: var(--nig-shadow-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--nig-space-sm);
}

.nig-save-btn:hover {
  background: var(--nig-color-hover-success);
  transform: translateY(-1px);
  box-shadow: var(--nig-shadow-md);
}

.nig-fetch-models-btn {
  padding: var(--nig-space-sm) var(--nig-space-md);
  margin-left: 0;
  border-radius: var(--nig-radius-md);
  border: 1px solid var(--nig-color-border);
  background: var(--nig-color-accent-primary);
  color: white;
  cursor: pointer;
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  transition: all var(--nig-transition-normal);
}

.nig-fetch-models-btn:hover {
  background: var(--nig-color-hover-primary);
  transform: translateY(-1px);
}

.nig-delete-btn {
  padding: var(--nig-space-sm) var(--nig-space-md);
  margin-left: 0;
  border-radius: var(--nig-radius-md);
  border: 1px solid var(--nig-color-border);
  background: var(--nig-color-accent-error);
  color: white;
  cursor: pointer;
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  transition: all var(--nig-transition-normal);
}

.nig-delete-btn:hover {
  background: var(--nig-color-hover-error);
  transform: translateY(-1px);
}

.nig-history-cleanup-btn {
  background: var(--nig-color-accent-error);
  color: white;
  padding: var(--nig-space-sm) var(--nig-space-md);
  border: none;
  border-radius: var(--nig-radius-md);
  cursor: pointer;
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  transition: all var(--nig-transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--nig-space-sm);
}

.nig-history-cleanup-btn:hover {
  background: var(--nig-color-hover-error);
  transform: translateY(-1px);
}

.nig-retry-btn {
  background: var(--nig-color-accent-primary);
  color: white;
  padding: var(--nig-space-md) var(--nig-space-xl);
  border: none;
  border-radius: var(--nig-radius-md);
  cursor: pointer;
  font-size: var(--nig-font-size-base);
  font-weight: 500;
  transition: all var(--nig-transition-normal);
  box-shadow: var(--nig-shadow-sm);
}

.nig-retry-btn:hover {
  background: var(--nig-color-hover-primary);
  transform: translateY(-1px);
  box-shadow: var(--nig-shadow-md);
}

.nig-override-btn {
  background: var(--nig-color-accent-primary);
  color: white;
  border: none;
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-sm) var(--nig-space-md);
  font-size: var(--nig-font-size-sm);
  cursor: pointer;
  transition: all var(--nig-transition-normal);
  align-self: flex-start;
}

.nig-override-btn:hover {
  background: var(--nig-color-hover-primary);
  transform: translateY(-1px);
}

.nig-test-enhancement-btn {
  background: var(--nig-color-accent-primary);
  color: white;
  border: none;
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-sm) var(--nig-space-lg);
  font-size: var(--nig-font-size-sm);
  cursor: pointer;
  transition: all var(--nig-transition-normal);
  display: flex;
  align-items: center;
  gap: var(--nig-space-sm);
  width: 100%;
  justify-content: center;
}

.nig-test-enhancement-btn:disabled {
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-muted);
  cursor: not-allowed;
  transform: none;
}

.nig-test-enhancement-btn:hover:not(:disabled) {
  background: var(--nig-color-hover-primary);
  transform: translateY(-1px);
}

.nig-template-btn {
  background: var(--nig-color-bg-elevated);
  border: 1px solid var(--nig-color-border);
  color: var(--nig-color-text-secondary);
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-xs) var(--nig-space-sm);
  font-size: var(--nig-font-size-xs);
  cursor: pointer;
  transition: all var(--nig-transition-fast);
}

.nig-template-btn:hover {
  background: var(--nig-color-accent-primary);
  color: white;
  border-color: var(--nig-color-accent-primary);
}

/* === Button Footer === */
.nig-button-footer {
  margin-top: var(--nig-space-3xl);
  padding-top: var(--nig-space-xl);
  border-top: 1px solid var(--nig-color-border);
  text-align: center;
}

/* === Enhancement Preview Layout === */
.nig-preview-container {
  display: flex;
  align-items: stretch;
  gap: var(--nig-space-md);
  margin-top: var(--nig-space-sm);
}

.nig-preview-section {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: var(--nig-space-xs);
}

.nig-preview-section h5 {
  margin: 0 0 var(--nig-space-xs) 0;
  font-size: var(--nig-font-size-sm);
  font-weight: 600;
  color: var(--nig-color-text-secondary);
}

/* Ensure both original and enhanced prompt areas share consistent sizing */
#nig-original-prompt,
#nig-enhanced-prompt,
.nig-prompt-display {
  width: 100%;
  box-sizing: border-box;
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-md);
  font-family: var(--nig-font-family-mono, "Fira Code", monospace);
  font-size: var(--nig-font-size-sm);
  color: var(--nig-color-text-primary);
  min-height: 120px;
  max-height: 260px;
  line-height: 1.5;
  overflow-y: auto;
}

/* Editable textarea (original) */
#nig-original-prompt {
  resize: vertical;
}

/* Read-only enhanced prompt display */
#nig-enhanced-prompt {
  resize: none;
}

/* Center the arrow between the two sections */
.nig-preview-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--nig-space-xs);
  color: var(--nig-color-text-muted);
}

.nig-preview-arrow .material-symbols-outlined {
  font-size: 28px;
}

/* Responsive layout: stack vertically on small screens */
@media (width <= 600px) {
  .nig-preview-container {
    flex-direction: column;
    align-items: stretch;
  }

  .nig-preview-arrow {
    padding: var(--nig-space-xs) 0;
    transform: rotate(90deg);
  }
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 784:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Tab System === */
.nig-tabs {
  display: flex;
  border-bottom: 1px solid var(--nig-color-border);
  margin-bottom: var(--nig-space-xl);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nig-tabs::-webkit-scrollbar {
  display: none;
}

.nig-tab {
  padding: var(--nig-space-md) var(--nig-space-xl);
  cursor: pointer;
  border-radius: var(--nig-radius-md) var(--nig-radius-md) 0 0;
  background: transparent;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  transition: all var(--nig-transition-fast);
  white-space: nowrap;
  border: 1px solid transparent;
  border-bottom: none;
}

.nig-tab:hover {
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-primary);
}

.nig-tab.active {
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-primary);
  border: 1px solid var(--nig-color-border);
  border-bottom: 1px solid var(--nig-color-bg-tertiary);
  box-shadow: 0 -2px 0 var(--nig-color-accent-primary) inset;
}

.nig-tab-content {
  display: none;
  animation: nig-content-fade 0.2s ease-out;
}

.nig-tab-content.active {
  display: block;
}

@keyframes nig-content-fade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === Image Gallery === */
.nig-image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--nig-space-xl);
  margin-top: var(--nig-space-xl);
}

.nig-image-container {
  position: relative;
  border-radius: var(--nig-radius-lg);
  overflow: hidden;
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  transition: all var(--nig-transition-normal);
}

.nig-image-container:hover {
  box-shadow: var(--nig-shadow-lg);
  transform: translateY(-2px);
}

.nig-image-container img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform var(--nig-transition-slow);
}

.nig-image-container:hover img {
  transform: scale(1.02);
}

.nig-image-actions {
  position: absolute;
  top: var(--nig-space-md);
  right: var(--nig-space-md);
  display: flex;
  gap: var(--nig-space-sm);
  background: rgb(0 0 0 / 70%);
  backdrop-filter: blur(10px);
  padding: var(--nig-space-sm);
  border-radius: var(--nig-radius-md);
  opacity: 0;
  transition: opacity var(--nig-transition-normal);
}

.nig-image-container:hover .nig-image-actions {
  opacity: 1;
}

.nig-image-actions button {
  background: rgb(0 0 0 / 80%);
  border: none;
  border-radius: var(--nig-radius-md);
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--nig-font-size-base);
  color: white;
  transition: all var(--nig-transition-fast);
}

.nig-image-actions button:hover {
  background: white;
  transform: scale(1.1);
}

/* === URL Link Button Styling === */
.nig-image-actions button[title="Open Image URL"] {
  background: rgb(99 102 241 / 90%);
}

.nig-image-actions button[title="Open Image URL"]:hover {
  background: var(--nig-color-accent-primary);
}

/* === History System === */
.nig-history-list {
  list-style: none;
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
}

.nig-history-item {
  background: var(--nig-color-bg-tertiary);
  padding: var(--nig-space-lg);
  border-radius: var(--nig-radius-md);
  margin-bottom: var(--nig-space-md);
  border: 1px solid var(--nig-color-border);
  transition: all var(--nig-transition-fast);
}

.nig-history-item:hover {
  border-color: var(--nig-color-border-light);
  box-shadow: var(--nig-shadow-sm);
}

.nig-history-item small {
  display: block;
  color: var(--nig-color-text-muted);
  margin-bottom: var(--nig-space-sm);
  font-size: var(--nig-font-size-xs);
}

.nig-history-item a {
  color: var(--nig-color-accent-primary);
  text-decoration: none;
  word-break: break-all;
  font-weight: 500;
  transition: color var(--nig-transition-fast);
}

/* History prompt: use up to 2 lines, full width, then ellipsis */
.nig-history-prompt {
  margin-bottom: var(--nig-space-xs);
  font-size: var(--nig-font-size-sm);

  /* Use a dedicated dark color specific to history prompts only */
  color: #d0d0d0a6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  line-height: 1.4;
}

.nig-history-prompt-empty {
  color: var(--nig-color-text-muted);
  font-style: italic;
}

.nig-history-item a:hover {
  color: var(--nig-color-hover-primary);
}

/* === Panel Configuration Grid Layout === */
.nig-config-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--nig-space-xl);
}

.nig-config-section {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-xl);
}

.nig-provider-container {
  display: grid;
  gap: var(--nig-space-lg);
}

.nig-provider-header {
  margin-bottom: var(--nig-space-lg);
  padding-bottom: var(--nig-space-lg);
  border-bottom: 1px solid var(--nig-color-border);
}

.nig-provider-header h3 {
  margin: 0 0 var(--nig-space-sm) 0;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-lg);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--nig-space-sm);
}

.nig-provider-header p {
  margin: 0;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  line-height: 1.5;
}

.nig-provider-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--nig-space-lg);
  margin-bottom: var(--nig-space-lg);
}

.nig-provider-settings {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-xl);
  transition: all var(--nig-transition-normal);
}

.nig-provider-settings:hover {
  border-color: var(--nig-color-border-light);
  box-shadow: var(--nig-shadow-sm);
}

.nig-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--nig-space-lg);
  margin-bottom: var(--nig-space-lg);
}

/* === Styling Tab Layout === */
.nig-styling-container {
  display: grid;
  gap: var(--nig-space-xl);
}

.nig-styling-intro {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-lg);
  margin-bottom: var(--nig-space-lg);
}

.nig-styling-intro p {
  margin: 0;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  line-height: 1.6;
}

.nig-style-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--nig-space-xl);
}

.nig-style-section {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-xl);
}

.nig-section-header {
  margin-bottom: var(--nig-space-lg);
  padding-bottom: var(--nig-space-lg);
  border-bottom: 1px solid var(--nig-color-border);
}

.nig-section-header h4 {
  margin: 0;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-lg);
  font-weight: 600;
}

/* === History Tab Layout === */
.nig-history-container {
  display: grid;
  gap: var(--nig-space-xl);
}

.nig-history-cleanup {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-xl);
  display: grid;
  gap: var(--nig-space-lg);
}

.nig-cleanup-info h4 {
  margin: 0 0 var(--nig-space-sm) 0;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-lg);
  font-weight: 600;
}

.nig-cleanup-info p {
  margin: 0;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  line-height: 1.5;
}

.nig-cleanup-controls {
  display: flex;
  align-items: center;
  gap: var(--nig-space-md);
}

.nig-cleanup-controls label {
  color: var(--nig-color-text-primary);
  font-weight: 500;
  font-size: var(--nig-font-size-sm);
}

.nig-cleanup-controls input[type="number"] {
  width: 80px;
  padding: var(--nig-space-sm);
  background: var(--nig-color-bg-primary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-md);
  color: var(--nig-color-text-primary);
}

/* === Provider Priority Info === */
.nig-provider-priority-info {
  background: var(--nig-color-bg-primary);
  border: 1px solid var(--nig-color-accent-warning);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-lg);
  margin-bottom: var(--nig-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--nig-space-md);
}

.nig-priority-header {
  display: flex;
  align-items: center;
  gap: var(--nig-space-sm);
  color: var(--nig-color-accent-warning);
  font-weight: 600;
  font-size: var(--nig-font-size-sm);
}

/* === Enhancement Preview Layout === */
.nig-enhancement-preview {
  background: var(--nig-color-bg-primary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-lg);
  margin-top: var(--nig-space-lg);
}

.nig-preview-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--nig-space-lg);
  align-items: start;
  margin-bottom: var(--nig-space-lg);
}

.nig-preview-section {
  display: flex;
  flex-direction: column;
  gap: var(--nig-space-sm);
}

.nig-preview-section h5 {
  margin: 0;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.nig-preview-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--nig-color-accent-primary);
  padding: var(--nig-space-sm);
}

.nig-prompt-display {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-md);
  font-family: "Fira Code", Monaco, Consolas, monospace;
  font-size: var(--nig-font-size-xs);
  line-height: 1.4;
  color: var(--nig-color-text-secondary);
  max-height: 120px;
  overflow-y: auto;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

/* === Prompt Container === */
.nig-prompt-container {
  background: var(--nig-color-bg-tertiary);
  border-radius: var(--nig-radius-md);
  margin-bottom: var(--nig-space-lg);
  border: 1px solid var(--nig-color-border);
  transition: all var(--nig-transition-normal);
  overflow: hidden;
}

.nig-prompt-header {
  padding: var(--nig-space-lg);
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  user-select: none;
  color: var(--nig-color-text-primary);
  transition: all var(--nig-transition-fast);
  position: relative;
  z-index: 1;
}

.nig-prompt-header:hover {
  color: var(--nig-color-accent-primary);
  background: var(--nig-color-bg-primary);
}

.nig-prompt-header::before {
  content: "▸";
  margin-right: var(--nig-space-md);
  transition: all var(--nig-transition-normal);
  color: var(--nig-color-text-muted);
  font-size: 14px;
  display: inline-block;
}

.nig-prompt-container.expanded .nig-prompt-header::before {
  transform: rotate(90deg);
  color: var(--nig-color-accent-primary);
}

.nig-prompt-text {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  padding: 0 var(--nig-space-lg);
  border-top: 1px solid transparent;
  overflow-wrap: break-word;
  color: var(--nig-color-text-secondary);
  line-height: 1.6;
  transition: all var(--nig-transition-normal);
}

/* When expanded, show full prompt inside a scrollable area.
 * - Uses a fixed max-height with overflow-y: auto to avoid truncation.
 * - Keeps existing look-and-feel and arrow behavior.
 * - Allows mouse wheel, touch, and keyboard scrolling within the prompt area.
 */
.nig-prompt-container.expanded .nig-prompt-text {
  max-height: 260px;
  opacity: 1;
  padding: var(--nig-space-lg);
  border-top-color: var(--nig-color-border);
  overflow-y: auto;
}

/* Ensure prompt text uses pre-wrap so multi-line prompts (with newlines) are preserved,
 * and that very long tokens still wrap without breaking layout.
 */
#nig-prompt-text.nig-prompt-text {
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

@keyframes nig-expand {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    max-height: 300px;
    transform: translateY(0);
  }
}

/* === Additional Layout Utilities === */

.nig-api-prompt-link {
  color: var(--nig-color-accent-primary);
  text-decoration: none;
  transition: color var(--nig-transition-fast);
}

.nig-api-prompt-link:hover {
  color: var(--nig-color-hover-primary);
  text-decoration: underline;
}

/* Override for History Tab Cleaner number input width on mobile.
   Ensures #nig-history-clean-days remains compact even if external CSS applies width: 100%. */
@media (width <= 767px) {
  .nig-history-cleanup input[type="number"]#nig-history-clean-days {
    width: 80px;
  }
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 825:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 867:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: () => (/* binding */ create),
/* harmony export */   y: () => (/* binding */ update)
/* harmony export */ });
let widgetElement = null;

/**
 * Creates the status widget DOM element and appends it to the body.
 * This should only be called once during initialization.
 */
function create() {
  if (widgetElement) {
    return;
  }

  widgetElement = document.createElement("div");
  widgetElement.id = "nig-status-widget";
  widgetElement.className = "nig-status-widget";
  widgetElement.innerHTML = `<div class="nig-status-icon"></div><span class="nig-status-text"></span>`;
  document.body.appendChild(widgetElement);
}

/**
 * Updates the state and content of the status widget.
 * @param {'hidden'|'loading'|'success'|'error'} state - The visual state of the widget.
 * @param {string} text - The text to display.
 * @param {function|null} [onClickHandler=null] - An optional click handler for the widget.
 */
function update(state, text, onClickHandler = null) {
  if (!widgetElement) {
    return;
  }

  widgetElement.classList.remove("loading", "success", "error");
  widgetElement.onclick = onClickHandler;

  if (state === "hidden") {
    widgetElement.style.display = "none";
    return;
  }

  widgetElement.style.display = "flex";
  widgetElement.querySelector(".nig-status-text").textContent = text;
  widgetElement.classList.add(state);

  const icon = widgetElement.querySelector(".nig-status-icon");
  icon.innerHTML = ""; // Clear previous icon
  if (state === "success") {
    icon.innerHTML = "✅";
  } else if (state === "error") {
    icon.innerHTML = "❌";
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/styles/main.css
var main = __webpack_require__(249);
;// ./src/styles/main.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(main/* default */.A, options);




       /* harmony default export */ const styles_main = (main/* default */.A && main/* default */.A.locals ? main/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./src/utils/logger.js
var logger = __webpack_require__(103);
// EXTERNAL MODULE: ./src/utils/storage.js + 1 modules
var storage = __webpack_require__(715);
;// ./src/utils/error.js
/**
 * Parses a raw error string into a user-friendly message and a retryable status.
 * @param {string} errorString - The raw error message from the API.
 * @param {string|null} provider - The name of the provider that failed.
 * @param {string|null} providerProfileUrl - The URL of the OpenAI compatible profile, if applicable.
 * @returns {{message: string, retryable: boolean}}
 */
function parseErrorMessage(
  errorString,
  provider = null,
  providerProfileUrl = null,
) {
  const messageContent = String(errorString);
  const lowerCaseContent = messageContent.toLowerCase();

  if (
    lowerCaseContent.includes("error code: 524") ||
    lowerCaseContent.includes("timed out") ||
    lowerCaseContent.includes("502 bad gateway") ||
    lowerCaseContent.includes("unable to reach the origin service")
  ) {
    return {
      message:
        "The generation service is temporarily unavailable or busy (e.g., 502 Bad Gateway). This is usually a temporary issue. Please try again in a few minutes.",
      retryable: true,
    };
  }

  // Check for specific OpenAI Compatible provider false positive error
  if (
    provider === "OpenAICompat" &&
    providerProfileUrl?.includes("api.mnnai.ru")
  ) {
    try {
      const errorJson = JSON.parse(
        messageContent.substring(messageContent.indexOf("{")),
      );
      if (
        errorJson.error ===
        "Sorry, there's been some kind of mistake, please use a different model"
      ) {
        return {
          message:
            "Temporary service error detected. The same prompt typically works on retry. This error will be automatically retried.",
          retryable: true,
        };
      }
    } catch (e) {
      /* Fall through */
    }
  }

  if (
    lowerCaseContent.includes("unsafe content") ||
    lowerCaseContent.includes("safety system") ||
    lowerCaseContent.includes("moderation_blocked")
  ) {
    return {
      message:
        "The prompt was rejected by the safety system for containing potentially unsafe content.",
      retryable: false,
    };
  }

  // Check for OpenAI-compatible provider model access / tier restriction errors
  if (
    provider === "OpenAICompat" &&
    (lowerCaseContent.includes("access denied for model") ||
      lowerCaseContent.includes("not available for free users") ||
      lowerCaseContent.includes("premium model requires a subscription") ||
      lowerCaseContent.includes('"code":402') ||
      lowerCaseContent.includes("requires a subscription") ||
      lowerCaseContent.includes("your plan does not have access to model"))
  ) {
    return {
      message:
        "The selected model is not available for your current plan. You may switch to a free model, choose a supported provider, or upgrade your account according to your provider’s tiers.",
      // Keep this retryable so the UI allows switching provider/model and retrying.
      retryable: true,
      errorType: "model_access",
      isNonRetryable: false,
    };
  }

  // Check for AIHorde specific API key validation errors
  if (
    provider === "AIHorde" &&
    lowerCaseContent.includes("no user matching sent api key")
  ) {
    return {
      message:
        "AIHorde API key validation failed. Please check your API key configuration and ensure you have registered at https://stablehorde.net/register. You can try a different provider or update your API key in settings.",
      retryable: true,
      errorType: "api_key_validation",
      isNonRetryable: false,
    };
  }

  // Check for OpenAI Compatible provider specific errors
  if (provider === "OpenAICompat") {
    // Check for authentication errors (non-retryable)
    if (
      lowerCaseContent.includes("invalid api key") ||
      lowerCaseContent.includes("authentication failed") ||
      lowerCaseContent.includes("unauthorized")
    ) {
      return {
        message:
          "Authentication failed. Please check your API key configuration and ensure it is valid for this OpenAI-compatible provider.",
        retryable: false,
        errorType: "authentication",
        isNonRetryable: true,
      };
    }

    // Check for IP address mismatch errors (retryable)
    if (lowerCaseContent.includes("ip address mismatch")) {
      return {
        message:
          "IP Address Mismatch: Your current IP doesn't match your account. Try the /user resetip command in the Discord server or upgrade to premium for multi-IP support.",
        retryable: true,
        errorType: "ip_mismatch",
        isNonRetryable: false,
        discordLink: "https://discord.gg/zukijourney",
        resetipCommand: "/user resetip",
      };
    }

    // Check for image conversion errors
    if (
      lowerCaseContent.includes("failed to convert image to base64") ||
      lowerCaseContent.includes("base64") ||
      lowerCaseContent.includes("image conversion")
    ) {
      return {
        message:
          "Image conversion failed. The provider returned image data that could not be properly converted. This may be a temporary issue with the provider.",
        retryable: true,
        errorType: "image_conversion",
        isNonRetryable: false,
      };
    }

    // Check for JSON parsing errors
    if (
      lowerCaseContent.includes("html response instead of json") ||
      lowerCaseContent.includes("unexpected token '<'") ||
      lowerCaseContent.includes("received html")
    ) {
      return {
        message:
          "The API endpoint returned an HTML page instead of JSON data. This usually indicates endpoint configuration issues, authentication problems, or an invalid API endpoint URL. Please check your OpenAI-compatible provider configuration.",
        retryable: false,
        errorType: "html_response",
        isNonRetryable: true,
        endpointIssue: true,
      };
    }

    // Check for malformed JSON errors
    if (
      lowerCaseContent.includes("json parsing failed") ||
      lowerCaseContent.includes("malformed json") ||
      lowerCaseContent.includes("unexpected character at line 1 column 1")
    ) {
      return {
        message:
          "The API returned malformed or invalid JSON data. This may indicate server issues with the OpenAI-compatible provider. Please try again later or contact the provider support.",
        retryable: true,
        errorType: "malformed_json",
        isNonRetryable: false,
        serverIssue: true,
      };
    }

    // Check for generic JSON parse errors
    if (
      lowerCaseContent.includes("json parse error") ||
      lowerCaseContent.includes("json parsing error") ||
      lowerCaseContent.includes("invalid json")
    ) {
      return {
        message:
          "JSON parsing failed for the API response. This may indicate server issues or malformed response from the OpenAI-compatible provider.",
        retryable: true,
        errorType: "json_parse_error",
        isNonRetryable: false,
      };
    }
  }

  try {
    const errorJson = JSON.parse(
      messageContent.substring(messageContent.indexOf("{")),
    );
    const message =
      errorJson.message ||
      (errorJson.error ? errorJson.error.message : null) ||
      JSON.stringify(errorJson);
    return {
      message: typeof message === "object" ? JSON.stringify(message) : message,
      retryable: false,
    };
  } catch (e) {
    return {
      message: messageContent || "An unknown error occurred.",
      retryable: false,
    };
  }
}

;// ./src/utils/promptUtils.js
/**
 * Prompt Utilities for cleaning and formatting prompts
 * Provides functionality to clean prompts for API transmission while preserving display formatting
 */

/**
 * Cleans excessive newline characters from prompts for API transmission
 * Removes 3+ consecutive newlines and reduces to 2 newlines maximum
 * Removes leading/trailing newlines and trims whitespace
 * @param {string} prompt - The prompt to clean
 * @returns {string} - The cleaned prompt suitable for API transmission
 */
function cleanPromptForApi(prompt) {
  if (!prompt || typeof prompt !== "string") {
    return prompt;
  }

  return prompt
    .replace(/\n{3,}/g, "\n\n") // Replace 3+ newlines with 2 newlines
    .replace(/^\n+|\n+$/g, "") // Remove leading and trailing newlines
    .trim();
}

/**
 * Preserves display formatting by normalizing newlines to consistent format
 * Ensures consistent newline representation for display purposes
 * @param {string} prompt - The prompt to normalize for display
 * @returns {string} - The prompt with normalized newlines for display
 */
function preserveDisplayFormatting(prompt) {
  if (!prompt || typeof prompt !== "string") {
    return prompt;
  }

  return prompt
    .replace(/\r\n/g, "\n") // Convert Windows newlines to Unix newlines
    .replace(/\r/g, "\n") // Convert Mac newlines to Unix newlines
    .replace(/[ \t]+\n/g, "\n") // Remove trailing spaces/tabs before newlines
    .replace(/\n{3,}/g, "\n\n\n") // Ensure at most 3 newlines for display
    .trim();
}

/**
 * Validates and sanitizes a prompt
 * @param {string} prompt - The prompt to validate
 * @returns {boolean} - True if prompt is valid
 */
function isValidPrompt(prompt) {
  if (!prompt || typeof prompt !== "string") {
    return false;
  }

  // Check for minimum length
  if (prompt.trim().length === 0) {
    return false;
  }

  // Check for maximum length (reasonable limit for API calls)
  if (prompt.length > 32000) {
    // 32K character limit
    return false;
  }

  return true;
}

/**
 * Logs prompt cleaning information for debugging
 * @param {string} originalPrompt - The original prompt
 * @param {string} cleanedPrompt - The cleaned prompt
 * @param {string} context - Context where cleaning occurred
 */
function logPromptCleaning(_originalPrompt, _cleanedPrompt, _context) {
  // Intentionally a no-op placeholder:
  // - Callers may treat this as a debug hook.
  // - Using underscored params keeps ESLint satisfied and documents intent.
}

/**
 * Main function to get a prompt ready for API transmission
 * Combines validation, cleaning, and logging
 * @param {string} prompt - The prompt to process
 * @param {string} context - Context for logging (e.g., 'generate', 'enhance')
 * @returns {string} - The cleaned prompt
 */
function getApiReadyPrompt(prompt, context = "api") {
  if (!isValidPrompt(prompt)) {
    return prompt || "";
  }

  const originalPrompt = prompt;
  const cleanedPrompt = cleanPromptForApi(prompt);

  // Log if prompt was actually cleaned
  if (originalPrompt !== cleanedPrompt) {
    logPromptCleaning(originalPrompt, cleanedPrompt, context);
  }

  return cleanedPrompt;
}

/**
 * Main function to get a prompt ready for display
 * Preserves user formatting while normalizing newlines
 * @param {string} prompt - The prompt to process for display
 * @returns {string} - The display-ready prompt
 */
function getDisplayReadyPrompt(prompt) {
  if (!isValidPrompt(prompt)) {
    return prompt || "";
  }

  return preserveDisplayFormatting(prompt);
}

/**
 * Processes prompt for specific use case
 * @param {string} prompt - The prompt to process
 * @param {string} useCase - 'api', 'display', or 'both'
 * @param {string} context - Context for logging
 * @returns {object} - Object containing original, cleaned, and display versions
 */
function processPrompt(prompt, useCase = "both", context = "general") {
  const originalPrompt = prompt || "";

  if (!isValidPrompt(originalPrompt)) {
    return {
      original: originalPrompt,
      cleaned: originalPrompt,
      display: originalPrompt,
    };
  }

  const cleaned = getApiReadyPrompt(originalPrompt, context);
  const display = getDisplayReadyPrompt(originalPrompt);

  return {
    original: originalPrompt,
    cleaned: useCase === "display" ? originalPrompt : cleaned,
    display: useCase === "api" ? cleaned : display,
  };
}

;// ./src/api/gemini.js



/**
 * Determines if the selected provider's built-in enhancement should be used.
 * @param {string} provider - The name of the image generation provider.
 * @param {object} config - The current script configuration.
 * @returns {boolean} - True if provider enhancement should be used.
 */
function shouldUseProviderEnhancement(provider, config) {
  (0,logger/* logDebug */.MD)("ENHANCEMENT", "Checking provider priority for enhancement", {
    provider,
    config,
  });

  const shouldUse = (() => {
    if (provider === "Pollinations") {
      const result = config.pollinationsEnhance;
      (0,logger/* logInfo */.fH)(
        "ENHANCEMENT",
        `Provider ${provider} has built-in enhancement: ${result}`,
      );
      return result;
    }
    (0,logger/* logInfo */.fH)(
      "ENHANCEMENT",
      `Provider ${provider} does not have built-in enhancement`,
    );
    return false;
  })();

  (0,logger/* logDebug */.MD)("ENHANCEMENT", "Provider priority decision completed", {
    shouldUseProviderEnhancement: shouldUse,
    willUseExternalAI:
      config.enhancementEnabled &&
      config.enhancementApiKey &&
      (!shouldUse || config.enhancementOverrideProvider),
  });

  return shouldUse;
}

/**
 * Enhances a given prompt using the Google Gemini API with robust retry and fallback logic.
 * @param {string} originalPrompt - The user's original prompt.
 * @param {object} config - The current script configuration.
 * @returns {Promise<string>} The enhanced prompt.
 */
async function enhancePromptWithGemini(originalPrompt, config) {
  const startTime = Date.now();

  // Resolve effective enhancement instruction that RESPECTS user style/main/sub-style
  const {
    enhancementApiKey: apiKey,
    enhancementModel: rawModel,
    enhancementTemplate: userTemplateOverride,
    // enhancementTemplateSelected,
    mainPromptStyle,
    subPromptStyle,
    customStyleEnabled,
    customStyleText,
    enhancementMaxRetriesPerModel = 2,
    enhancementRetryDelay = 1000,
    enhancementModelsFallback = [
      "models/gemini-2.5-pro",
      "models/gemini-flash-latest",
      "models/gemini-flash-lite-latest",
      "models/gemini-2.5-flash",
      "models/gemini-2.5-flash-lite",
    ],
    _enhancementLogLevel = "info",
    enhancementAlwaysFallback = true,
  } = config;

  // Build a style-respecting instruction layer:
  // - If custom style is enabled, explicitly tell Gemini to preserve and reinforce it.
  // - Else if main/sub styles are set, tell Gemini to keep them.
  // - Otherwise, no extra constraint.
  const styleDirectives = (() => {
    if (
      customStyleEnabled &&
      customStyleText &&
      customStyleText.trim().length > 0
    ) {
      return [
        `The user has explicitly chosen this style: "${customStyleText.trim()}".`,
        `You MUST preserve and honor this exact style and aesthetic.`,
        `Do NOT replace it with "photorealistic", "professional photography", or any other conflicting medium unless the user text itself asks for that.`,
        `All enhancements must be consistent with this declared style.`,
      ].join(" ");
    }

    if (mainPromptStyle && mainPromptStyle !== "None") {
      if (subPromptStyle && subPromptStyle !== "none") {
        return [
          `The user has selected main style "${mainPromptStyle}" and sub-style "${subPromptStyle}".`,
          `You MUST preserve and honor these styles as the primary aesthetic.`,
          `Do NOT override them with photorealistic/technical photography language unless these styles explicitly imply it.`,
          `All enhancements must be consistent with these selected styles.`,
        ].join(" ");
      }
      return [
        `The user has selected main style "${mainPromptStyle}".`,
        `You MUST preserve and honor this style as the primary aesthetic.`,
        `Do NOT override it with photorealistic/technical photography language unless this style explicitly implies it.`,
        `All enhancements must be consistent with this selected style.`,
      ].join(" ");
    }

    return "";
  })();

  // Base template to use:
  // - Prefer userTemplateOverride when provided (from UI textarea).
  // - Otherwise, derive from presets (standard/safety/artistic/technical/character) via DEFAULTS.enhancementTemplate in config.
  //   (config should already contain the selected preset mapping.)
  const baseTemplate =
    userTemplateOverride && userTemplateOverride.trim().length > 0
      ? userTemplateOverride.trim()
      : (config.enhancementTemplate || "").trim();

  // Merge base template and style directives into final template sent to Gemini.
  const mergedTemplate = [
    baseTemplate ||
      "Extract visual, image-ready elements from the text without changing its intended style.",
    styleDirectives,
  ]
    .filter(Boolean)
    .join(" ");

  if (!apiKey) {
    throw new Error("Gemini API key is required for prompt enhancement.");
  }

  // Build model list with primary model first, followed by fallbacks
  const modelsList = [
    rawModel,
    ...enhancementModelsFallback.filter((m) => m !== rawModel),
  ];

  // High-level enhancement start: informational and toggle-controlled.
  (0,logger/* logInfo */.fH)("ENHANCEMENT", "Starting robust prompt enhancement with Gemini AI", {
    originalLength: originalPrompt.length,
    primaryModel: rawModel,
    fallbackModels: enhancementModelsFallback,
    totalModels: modelsList.length,
    maxRetriesPerModel: enhancementMaxRetriesPerModel,
    apiKeyPresent: Boolean(apiKey),
  });

  let lastError = null;

  // Try each model in the list
  for (let modelIndex = 0; modelIndex < modelsList.length; modelIndex++) {
    const modelWithPrefix = modelsList[modelIndex];
    const model = modelWithPrefix.startsWith("models/")
      ? modelWithPrefix.substring(7)
      : modelWithPrefix;
    const isPrimaryModel = modelIndex === 0;

    (0,logger/* logInfo */.fH)("ENHANCEMENT", `Attempting enhancement with model: ${model}`, {
      modelIndex: modelIndex + 1,
      totalModels: modelsList.length,
      isPrimaryModel,
      modelName: model,
    });

    let attemptsForThisModel = 0;

    // Retry logic for each model
    while (attemptsForThisModel < enhancementMaxRetriesPerModel) {
      attemptsForThisModel++;

      try {
        const enhancedText = await attemptEnhancementWithModel(
          originalPrompt,
          model,
          mergedTemplate,
          apiKey,
          isPrimaryModel,
          attemptsForThisModel,
          enhancementMaxRetriesPerModel,
        );

        const duration = Date.now() - startTime;
        (0,logger/* logInfo */.fH)("ENHANCEMENT", "Prompt enhancement successful", {
          model,
          attempts: attemptsForThisModel,
          duration,
          totalModelsTried: modelIndex + 1,
        });

        return enhancedText;
      } catch (error) {
        lastError = error;
        // Routine enhancement attempt failure for a specific model/attempt.
        // Use non-critical level so it respects the logging toggle while still being captured in enhancement logs when enabled.
        (0,logger/* logInfo */.fH)(
          "ENHANCEMENT",
          `Enhancement failed for model ${model} (attempt ${attemptsForThisModel}/${enhancementMaxRetriesPerModel})`,
          {
            model,
            attemptNumber: attemptsForThisModel,
            error: error.message,
            isPrimaryModel,
          },
        );

        // If this is not the last retry for this model, wait before retrying
        if (attemptsForThisModel < enhancementMaxRetriesPerModel) {
          (0,logger/* logInfo */.fH)("ENHANCEMENT", `Retrying model ${model} after delay`, {
            retryDelay: enhancementRetryDelay,
            nextAttempt: attemptsForThisModel + 1,
          });
          await sleep(enhancementRetryDelay);
        }
      }
    }

    // If we exhausted retries for this model, try the next one.
    // This is expected operational behavior, so keep it toggle-controlled.
    (0,logger/* logInfo */.fH)(
      "ENHANCEMENT",
      `Exhausted retries for model ${model}, switching to next model`,
      {
        model,
        attemptsMade: attemptsForThisModel,
        maxRetries: enhancementMaxRetriesPerModel,
        nextModelIndex: modelIndex + 1,
        remainingModels: modelsList.length - modelIndex - 1,
      },
    );
  }

  // All models failed
  const duration = Date.now() - startTime;
  (0,logger/* logError */.vV)(
    "ENHANCEMENT",
    "All models and retries exhausted for prompt enhancement",
    {
      totalModelsTried: modelsList.length,
      duration,
      lastError: lastError?.message,
      originalPrompt:
        originalPrompt.substring(0, 100) +
        (originalPrompt.length > 100 ? "..." : ""),
    },
  );

  // Enhanced fallback behavior
  if (enhancementAlwaysFallback) {
    const fallbackPrompt = createBasicEnhancementFallback(originalPrompt);
    (0,logger/* logInfo */.fH)("ENHANCEMENT", "Providing basic enhancement fallback", {
      fallbackType: "basic_enhancement",
      originalLength: originalPrompt.length,
      fallbackLength: fallbackPrompt.length,
    });
    return fallbackPrompt;
  }

  throw new Error(
    `All enhancement models failed. Last error: ${lastError?.message || "Unknown error"}`,
  );
}

/**
 * Attempts enhancement with a specific model
 */
async function attemptEnhancementWithModel(
  originalPrompt,
  model,
  template,
  apiKey,
  isPrimaryModel,
  _attemptNumber,
  _maxRetries,
) {
  // Apply prompt cleaning as a safety measure (main app already sends clean prompts)
  const cleanPrompt = getApiReadyPrompt(originalPrompt, "gemini_enhancement");

  const enhancementPrompt = template
    ? `${template}\n\nOriginal prompt: "${cleanPrompt}"\n\nEnhanced prompt:`
    : `Convert this text into a focused visual description for image generation... \n\n"${cleanPrompt}"\n\nEnhanced version:`;

  const requestData = {
    contents: [{ parts: [{ text: enhancementPrompt }] }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 65536,
    },
  };

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  return new Promise((resolve, reject) => {
    // Use shorter timeout for fallback models to speed up switching
    const timeout = isPrimaryModel ? 45000 : 30000;

    GM_xmlhttpRequest({
      method: "POST",
      url: apiUrl,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(requestData),
      timeout: timeout,
      onload: (response) => {
        try {
          if (!response.responseText) {
            throw new Error("Empty response received from Gemini API");
          }
          const data = JSON.parse(response.responseText);

          if (data.error) {
            throw new Error(data.error.message || "Gemini API error");
          }

          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            const enhancedText =
              data.candidates[0].content.parts[0].text.trim();
            const cleanedText = enhancedText.replace(/^["']|["']$/g, "");
            resolve(cleanedText);
          } else {
            throw new Error("No enhancement result received from Gemini API");
          }
        } catch (e) {
          reject(e);
        }
      },
      onerror: () => {
        reject(new Error("Network error during enhancement request."));
      },
      ontimeout: () => {
        reject(
          new Error(
            `Enhancement request timed out after ${timeout / 1000} seconds.`,
          ),
        );
      },
    });
  });
}

/**
 * Creates a basic enhancement fallback when all models fail
 */
function createBasicEnhancementFallback(originalPrompt) {
  // Simple heuristic-based enhancement
  let enhanced = originalPrompt;

  // Add common quality boosters if not already present
  const qualityBoosters = [
    "highly detailed",
    "sharp focus",
    "8K resolution",
    "masterpiece",
  ];

  const hasQualityTerms = qualityBoosters.some((term) =>
    enhanced.toLowerCase().includes(term.toLowerCase()),
  );

  if (!hasQualityTerms) {
    enhanced += ", " + qualityBoosters.join(", ");
  }

  // Clean up any double commas
  enhanced = enhanced.replace(/,+/g, ",").replace(/,\s*$/, "");

  return enhanced;
}

/**
 * Utility function to sleep for a given number of milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

;// ./src/api/google.js




/**
 * Generates an image using the Google Imagen API.
 * @param {string} prompt - The generation prompt.
 * @param {object} callbacks - An object containing onSuccess and onFailure callbacks.
 */
async function generate(prompt, { onSuccess, onFailure }) {
  const config = await (0,storage/* getConfig */.zj)();
  const {
    model,
    googleApiKey,
    numberOfImages,
    aspectRatio,
    personGeneration,
    imageSize,
    enableNegPrompt,
    globalNegPrompt,
  } = config;

  const basePositive = typeof prompt === "string" ? prompt : "";

  const negEnabled = Boolean(enableNegPrompt);
  const negText = (globalNegPrompt || "").trim();
  const hasValidNegative = negEnabled && negText.length > 0;

  // For non-AI Horde providers:
  // FinalPrompt = (StyledPrompt or EnhancedPrompt) + ", negative prompt: " + globalNegPrompt
  // when enabled and non-empty.
  const finalPrompt = hasValidNegative
    ? `${basePositive}, negative prompt: ${negText}`
    : basePositive;

  // Apply prompt cleaning on the fully-formed FinalPrompt
  const cleanPrompt = getApiReadyPrompt(finalPrompt, "google_api_final");

  // Debug-only diagnostics respecting the global logging toggle
  (0,logger/* logDebug */.MD)("GOOGLE", "Prompt construction", {
    path: "non-horde inline negative",
    basePositivePromptLength: basePositive.length,
    hasNegativePrompt: hasValidNegative,
    enableNegPrompt: negEnabled,
    negativePromptLength: hasValidNegative ? negText.length : 0,
    finalPromptLength: cleanPrompt.length,
    finalPromptPreview:
      cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
  });

  if (model.startsWith("gemini-")) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const payload = {
      contents: [{ parts: [{ text: cleanPrompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE"],
        candidateCount: parseInt(numberOfImages, 10),
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    };

    GM_xmlhttpRequest({
      method: "POST",
      url,
      headers: {
        "x-goog-api-key": googleApiKey,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
      onload: (response) => {
        try {
          const data = JSON.parse(response.responseText);
          if (data.error) {
            throw new Error(JSON.stringify(data.error));
          }
          if (
            !data.candidates ||
            !data.candidates[0] ||
            !data.candidates[0].content ||
            !data.candidates[0].content.parts
          ) {
            throw new Error("No image data found in response");
          }
          const imageUrls = data.candidates[0].content.parts
            .filter((p) => p.inlineData && p.inlineData.data)
            .map(
              (p) =>
                `data:${p.inlineData.mimeType || "image/png"};base64,${p.inlineData.data}`,
            );
          onSuccess(imageUrls, cleanPrompt, "Google", model);
        } catch (e) {
          onFailure(e.message, prompt, "Google");
        }
      },
      onerror: (error) => onFailure(JSON.stringify(error), prompt, "Google"),
    });
  } else {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict`;
    const parameters = {
      sampleCount: parseInt(numberOfImages, 10),
      aspectRatio,
      personGeneration,
    };

    const isNewImagen =
      model.startsWith("imagen-3") || model.startsWith("imagen-4");

    if (model.includes("fast")) {
      // Fast models don't support imageSize
    } else if (isNewImagen) {
      // New Standard/Ultra models require string "1K" or "2K"
      const sizeNum = parseInt(imageSize, 10);
      parameters.imageSize = sizeNum >= 2048 ? "2K" : "1K";
    } else {
      // Legacy models expect number
      parameters.imageSize = parseInt(imageSize, 10);
    }

    GM_xmlhttpRequest({
      method: "POST",
      url,
      headers: {
        "x-goog-api-key": googleApiKey,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        instances: [{ prompt: cleanPrompt }],
        parameters,
      }),
      onload: (response) => {
        try {
          const data = JSON.parse(response.responseText);
          if (data.error) {
            throw new Error(JSON.stringify(data.error));
          }
          const imageUrls = data.predictions.map(
            (p) => `data:image/png;base64,${p.bytesB64Encoded}`,
          );
          // Pass the exact FinalPrompt string used for the API to the viewer/history
          onSuccess(imageUrls, cleanPrompt, "Google", model);
        } catch (e) {
          onFailure(e.message, prompt, "Google");
        }
      },
      onerror: (error) => onFailure(JSON.stringify(error), prompt, "Google"),
    });
  }
}

// EXTERNAL MODULE: ./src/utils/cache.js
var cache = __webpack_require__(168);
;// ./src/api/pollinations.js





/**
 * Generates an image using the Pollinations.ai API.
 * @param {string} prompt - The generation prompt.
 * @param {object} callbacks - An object containing onSuccess, onFailure, and onAuthFailure callbacks.
 */
async function pollinations_generate(
  prompt,
  { onSuccess, onFailure, onAuthFailure },
) {
  const config = await (0,storage/* getConfig */.zj)();
  const {
    pollinationsModel: model,
    pollinationsToken,
    pollinationsWidth,
    pollinationsHeight,
    pollinationsSeed,
    pollinationsEnhance,
    pollinationsSafe,
    pollinationsNologo,
    pollinationsPrivate,
    enableNegPrompt,
    globalNegPrompt,
  } = config;

  // Base positive prompt from queue (StyledPrompt or EnhancedPrompt)
  const basePositive = typeof prompt === "string" ? prompt : "";

  const negEnabled = Boolean(enableNegPrompt);
  const negText = (globalNegPrompt || "").trim();
  const hasValidNegative = negEnabled && negText.length > 0;

  // For Pollinations and other non-AI Horde providers:
  // FinalPrompt = (StyledPrompt or EnhancedPrompt) + ", negative prompt: " + globalNegPrompt
  // when enabled and non-empty.
  const finalPrompt = hasValidNegative
    ? `${basePositive}, negative prompt: ${negText}`
    : basePositive;

  // Apply prompt cleaning as a safety measure (on the fully formed FinalPrompt)
  const cleanPrompt = getApiReadyPrompt(finalPrompt, "pollinations_api_final");

  // Use the configured model (includes kontext which can do text-to-image)
  const finalModel = model || "flux";

  // Debug logging to track model configuration and prompt construction
  (0,logger/* logDebug */.MD)("POLLINATIONS", "Model configuration", {
    originalModel: model,
    finalModel: finalModel,
  });
  (0,logger/* logDebug */.MD)("POLLINATIONS", "Prompt construction", {
    path: "non-horde inline negative",
    basePositivePromptLength: basePositive.length,
    hasNegativePrompt: hasValidNegative,
    enableNegPrompt: negEnabled,
    negativePromptLength: hasValidNegative ? negText.length : 0,
    finalPromptLength: cleanPrompt.length,
    finalPromptPreview:
      cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
  });

  const params = new URLSearchParams();
  if (pollinationsToken) {
    params.append("token", pollinationsToken);
  }
  if (finalModel && finalModel !== "flux") {
    params.append("model", finalModel);
  }
  if (pollinationsWidth && pollinationsWidth > 0) {
    params.append("width", pollinationsWidth);
  }
  if (pollinationsHeight && pollinationsHeight > 0) {
    params.append("height", pollinationsHeight);
  }
  if (pollinationsSeed) {
    params.append("seed", pollinationsSeed);
  }
  if (pollinationsEnhance) {
    params.append("enhance", "true");
  }
  if (pollinationsSafe) {
    params.append("safe", "true");
  }
  if (pollinationsNologo) {
    params.append("nologo", "true");
  }
  if (pollinationsPrivate) {
    params.append("private", "true");
  }

  const paramString = params.toString();
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}${paramString ? "?" + paramString : ""}`;

  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    responseType: "blob",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
    onload: async (response) => {
      if (response.status >= 200 && response.status < 300) {
        const blobUrl = URL.createObjectURL(response.response);
        // Pass the exact FinalPrompt string used for the API to the viewer/history
        onSuccess([blobUrl], cleanPrompt, "Pollinations", finalModel, [url]);
      } else {
        const text = await response.response.text();
        if (text.toLowerCase().includes("model not found")) {
          onFailure(
            `Model error: ${text}. Refreshing model list.`,
            prompt,
            "Pollinations",
            finalModel,
          );
          (0,cache/* clearCachedModels */.WN)("pollinations");
          return;
        }

        // Check for authentication requirements in any status code
        // kontext model returns 500 status codes when auth is required
        // gptimage model returns 403 status codes when auth is required
        if (
          (response.status === 403 && text.includes("auth.pollinations.ai")) ||
          (text.toLowerCase().includes("authentication") &&
            text.toLowerCase().includes("auth.pollinations.ai"))
        ) {
          try {
            const errorData = JSON.parse(text);
            onAuthFailure(errorData.message || errorData.error || text, prompt);
            return;
          } catch (e) {
            // If JSON parsing fails, still trigger auth modal
            onAuthFailure(text, prompt);
            return;
          }
        }

        onFailure(
          `Error ${response.status}: ${text}`,
          prompt,
          "Pollinations",
          finalModel,
        );
      }
    },
    onerror: (error) =>
      onFailure(JSON.stringify(error), prompt, "Pollinations", finalModel),
  });
}

;// ./src/api/aiHorde.js





function checkStatus(
  id,
  prompt,
  startTime,
  model,
  { onSuccess, onFailure, updateStatus },
) {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;

  (0,logger/* logDebug */.MD)("AIHORDE", "Checking AI Horde generation status", {
    generationId: id,
    elapsedTimeMs: elapsedTime,
    promptPreview:
      prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
  });

  GM_xmlhttpRequest({
    method: "GET",
    url: `https://aihorde.net/api/v2/generate/status/${id}`,
    onload: (response) => {
      try {
        const data = JSON.parse(response.responseText);
        (0,logger/* logDebug */.MD)("AIHORDE", "AI Horde status response received", {
          generationId: id,
          responseData: data,
          isDone: data.done,
          queuePosition: data.queue_position,
          processing: data.processing,
          waitTime: data.wait_time,
        });

        if (data.done) {
          const finalElapsedTime = Date.now() - startTime;
          (0,logger/* logInfo */.fH)("AIHORDE", "AI Horde generation completed successfully", {
            generationId: id,
            imagesGenerated: data.generations ? data.generations.length : 0,
            totalElapsedTime: finalElapsedTime,
          });

          if (!data.generations || data.generations.length === 0) {
            (0,logger/* logError */.vV)("AIHORDE", "Generation completed but no images returned", {
              generationId: id,
              data: data,
            });
            onFailure(
              "Generation completed but no images were returned",
              prompt,
              "AIHorde",
            );
            return;
          }

          // Clear the status text when completing to prevent stale status
          updateStatus("Completed!");

          const imageUrls = data.generations.map((gen) => gen.img);
          onSuccess(imageUrls, prompt, "AIHorde", model);
        } else {
          let statusText = "Waiting for worker...";
          if (data.queue_position > 0) {
            statusText = `Queue: ${data.queue_position}. Est: ${data.wait_time}s.`;
            (0,logger/* logInfo */.fH)("AIHORDE", "AI Horde generation waiting in queue", {
              generationId: id,
              queuePosition: data.queue_position,
              estimatedWaitTime: data.wait_time,
              statusText: statusText,
            });
          } else if (data.processing > 0) {
            // More user-friendly status with elapsed time
            const elapsedSeconds = Math.floor(elapsedTime / 1000);
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            const timeStr =
              minutes > 0
                ? `${minutes}:${seconds.toString().padStart(2, "0")}`
                : `${seconds}s`;

            statusText = `AI Horde: Generating... (${timeStr})`;
            (0,logger/* logInfo */.fH)("AIHORDE", "AI Horde generation actively processing", {
              generationId: id,
              processingWorkers: data.processing,
              elapsedTime: timeStr,
              statusText: statusText,
            });
          } else {
            (0,logger/* logInfo */.fH)("AIHORDE", "AI Horde generation waiting for worker", {
              generationId: id,
              statusText: statusText,
            });
          }

          // Call updateStatus with the detailed status information
          // This ensures the status widget shows the specific AI Horde status
          (0,logger/* logDebug */.MD)("AIHORDE", "Calling updateStatus callback", {
            generationId: id,
            statusText: statusText,
            elapsedTimeMs: elapsedTime,
          });

          updateStatus(statusText);

          setTimeout(
            () =>
              checkStatus(id, prompt, startTime, model, {
                onSuccess,
                onFailure,
                updateStatus,
              }),
            5000,
          );
        }
      } catch (e) {
        (0,logger/* logError */.vV)("AIHORDE", "Error checking AI Horde status", {
          generationId: id,
          error: e.message,
          responseText: response.responseText,
        });
        onFailure(`Error checking status: ${e.message}`, prompt, "AIHorde");
      }
    },
    onerror: (error) => {
      (0,logger/* logError */.vV)("AIHORDE", "Failed to get status from AI Horde", {
        generationId: id,
        error: error,
      });
      onFailure("Failed to get status from AI Horde.", prompt, "AIHorde");
    },
  });
}

async function aiHorde_generate(prompt, { onSuccess, onFailure, updateStatus }) {
  const config = await (0,storage/* getConfig */.zj)();
  const {
    aiHordeApiKey,
    aiHordeModel,
    aiHordeSampler,
    aiHordeCfgScale,
    aiHordeSteps,
    aiHordeWidth,
    aiHordeHeight,
    aiHordeSeed,
    aiHordePostProcessing,
    enableNegPrompt,
    globalNegPrompt,
  } = config;

  // Apply prompt cleaning as a safety measure (main app already sends clean prompts)
  // For AI Horde, "prompt" must remain strictly the positive prompt (Styled/Enhanced).
  const cleanPrompt = getApiReadyPrompt(prompt, "aihorde_api_positive_only");

  const negEnabled = Boolean(enableNegPrompt);
  const negText = (globalNegPrompt || "").trim();
  const hasValidNegative = negEnabled && negText.length > 0;

  (0,logger/* logInfo */.fH)("AIHORDE", "Starting AI Horde generation", {
    promptConstructionPath: "AIHorde: positive_only + separate_negative_field",
    positivePromptLength: cleanPrompt.length,
    positivePromptPreview:
      cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
    model: aiHordeModel,
    apiKeyProvided: Boolean(aiHordeApiKey),
    enableNegPrompt: negEnabled,
    hasNegativePromptText: hasValidNegative,
    negativePromptLength: hasValidNegative ? negText.length : 0,
  });

  const params = {
    sampler_name: aiHordeSampler,
    cfg_scale: parseFloat(aiHordeCfgScale),
    steps: parseInt(aiHordeSteps, 10),
    width: parseInt(aiHordeWidth, 10),
    height: parseInt(aiHordeHeight, 10),
  };
  if (aiHordeSeed) {
    params.seed = aiHordeSeed;
  }
  if (aiHordePostProcessing.length > 0) {
    params.post_processing = aiHordePostProcessing;
  }

  const payload = { prompt: cleanPrompt, params, models: [aiHordeModel] };
  if (hasValidNegative) {
    payload.negative_prompt = negText;
  }

  (0,logger/* logDebug */.MD)("AIHORDE", "Sending generation request to AI Horde", {
    url: "https://aihorde.net/api/v2/generate/async",
    model: aiHordeModel,
    params,
    usesNegativePromptField: Boolean(payload.negative_prompt),
    negativePromptLength: payload.negative_prompt
      ? payload.negative_prompt.length
      : 0,
    negativePromptPreview: payload.negative_prompt
      ? payload.negative_prompt.substring(0, 200) +
        (payload.negative_prompt.length > 200 ? "..." : "")
      : null,
  });

  updateStatus("Requesting...");

  GM_xmlhttpRequest({
    method: "POST",
    url: "https://aihorde.net/api/v2/generate/async",
    headers: {
      "Content-Type": "application/json",
      apikey: aiHordeApiKey || "0000000000",
    },
    data: JSON.stringify(payload),
    onload: (response) => {
      try {
        const data = JSON.parse(response.responseText);
        (0,logger/* logDebug */.MD)("AIHORDE", "AI Horde API response received", {
          status: response.status,
          hasGenerationId: Boolean(data.id),
          message: data.message,
          error: data.error,
        });

        if (data.id) {
          (0,logger/* logInfo */.fH)("AIHORDE", "AI Horde generation request accepted", {
            generationId: data.id,
            model: aiHordeModel,
          });

          updateStatus("Waiting for status...");
          checkStatus(data.id, prompt, Date.now(), aiHordeModel, {
            onSuccess,
            onFailure,
            updateStatus,
          });
        } else {
          if (data.message && data.message.toLowerCase().includes("model")) {
            (0,logger/* logError */.vV)("AIHORDE", "Model error from AI Horde API", {
              error: data.message,
              willRefreshModels: true,
            });
            onFailure(
              `Model error: ${data.message}. Refreshing model list.`,
              prompt,
              "AIHorde",
            );
            (0,cache/* clearCachedModels */.WN)("aiHorde");
            return;
          }
          (0,logger/* logError */.vV)("AIHORDE", "Failed to initiate generation", {
            error: data.message || "Unknown error",
            responseData: data,
          });
          throw new Error(data.message || "Failed to initiate generation.");
        }
      } catch (e) {
        (0,logger/* logError */.vV)("AIHORDE", "Error processing AI Horde response", {
          error: e.message,
          responseText: response.responseText,
        });
        onFailure(e.message, prompt, "AIHorde");
      }
    },
    onerror: (error) => {
      (0,logger/* logError */.vV)("AIHORDE", "Network error during AI Horde request", {
        error: error,
      });
      onFailure(JSON.stringify(error), prompt, "AIHorde");
    },
  });
}

;// ./src/api/openAI.js




/**
 * Detects if response content is HTML instead of JSON
 * @param {string} responseText - The response text to check
 * @returns {boolean} - True if content appears to be HTML
 */
function isHtmlResponse(responseText) {
  const trimmed = responseText.trim().toLowerCase();
  return (
    trimmed.startsWith("<!doctype") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("<!doctype") ||
    trimmed.includes("<html>") ||
    trimmed.startsWith("<!") ||
    trimmed.startsWith("<head>") ||
    trimmed.includes("<title>")
  );
}

/**
 * Safely parses JSON with enhanced error handling
 * @param {string} responseText - The response text to parse
 * @param {string} endpointUrl - The endpoint URL for context in error messages
 * @returns {object|null} - Parsed JSON object or throws enhanced error
 */
function safeJsonParse(responseText, endpointUrl) {
  try {
    return JSON.parse(responseText);
  } catch (e) {
    // Check if this is an HTML response
    if (isHtmlResponse(responseText)) {
      throw {
        isHtmlResponse: true,
        originalError: e,
        message: `Received HTML response instead of JSON from ${endpointUrl}. This usually indicates endpoint configuration issues or authentication problems.`,
      };
    }
    // Check for specific JSON parsing error patterns
    const errorMessage = e.message.toLowerCase();
    if (
      errorMessage.includes("unexpected token '<'") &&
      responseText.trim().startsWith("<!")
    ) {
      throw {
        isHtmlResponse: true,
        originalError: e,
        message: `Received HTML response instead of JSON from ${endpointUrl}. This usually indicates endpoint configuration issues or authentication problems.`,
      };
    }
    if (errorMessage.includes("unexpected character at line 1 column 1")) {
      throw {
        isMalformedJson: true,
        originalError: e,
        message: `JSON parsing failed at the first character. This may indicate server issues or malformed response from ${endpointUrl}`,
      };
    }
    // Re-throw as generic parsing error
    throw {
      isJsonParseError: true,
      originalError: e,
      message: `JSON parsing error: ${e.message}. This may indicate server issues or malformed response.`,
    };
  }
}

async function openAI_generate(
  prompt,
  providerProfileUrl,
  { onSuccess, onFailure },
) {
  const config = await (0,storage/* getConfig */.zj)();
  const activeUrl = providerProfileUrl || config.openAICompatActiveProfileUrl;
  const activeProfile = config.openAICompatProfiles[activeUrl];

  if (!activeProfile) {
    onFailure(
      `No active or valid Openai Compatible profile found for URL: ${activeUrl}`,
      prompt,
      "OpenAICompat",
    );
    return;
  }

  const { enableNegPrompt, globalNegPrompt } = config;

  const basePositive = typeof prompt === "string" ? prompt : "";

  const negEnabled = Boolean(enableNegPrompt);
  const negText = (globalNegPrompt || "").trim();
  const hasValidNegative = negEnabled && negText.length > 0;

  // For non-AI Horde providers:
  // FinalPrompt = (StyledPrompt or EnhancedPrompt) + ", negative prompt: " + globalNegPrompt
  // when enabled and non-empty.
  const finalPrompt = hasValidNegative
    ? `${basePositive}, negative prompt: ${negText}`
    : basePositive;

  // Apply prompt cleaning as a safety measure on the fully-formed FinalPrompt
  const cleanPrompt = getApiReadyPrompt(finalPrompt, "openai_api_final");

  // Respect global logging toggle for debug-level diagnostics
  (0,logger/* logDebug */.MD)("OPENAI-COMPAT", "Prompt construction", {
    path: "non-horde inline negative",
    basePositivePromptLength: basePositive.length,
    hasNegativePrompt: hasValidNegative,
    enableNegPrompt: negEnabled,
    negativePromptLength: hasValidNegative ? negText.length : 0,
    finalPromptLength: cleanPrompt.length,
    finalPromptPreview:
      cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
  });

  const url = `${activeUrl}/images/generations`;
  const payload = {
    model: activeProfile.model,
    prompt: cleanPrompt,
    n: 1,
    size: "1024x1024",
    response_format: "b64_json",
  };

  GM_xmlhttpRequest({
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${activeProfile.apiKey}`,
    },
    data: JSON.stringify(payload),
    onload: (response) => {
      try {
        const data = safeJsonParse(response.responseText, activeUrl);

        // Check for authentication errors first
        if (
          data?.Error &&
          data.Error.toLowerCase().includes("invalid api key")
        ) {
          onFailure(data.Error, prompt, "OpenAICompat", activeUrl, {
            errorType: "authentication",
            isNonRetryable: true,
          });
          return;
        }

        // Check for IP address mismatch errors
        if (
          data?.Error &&
          data.Error.toLowerCase().includes("ip address mismatch")
        ) {
          onFailure(data.Error, prompt, "OpenAICompat", activeUrl, {
            errorType: "ip_mismatch",
            isNonRetryable: false,
            retryable: true,
          });
          return;
        }

        if (data?.data?.[0]) {
          try {
            const imageUrls = data.data
              .map((item) => {
                if (item.b64_json) {
                  try {
                    // Validate base64 data
                    if (
                      typeof item.b64_json === "string" &&
                      item.b64_json.length > 0
                    ) {
                      return `data:image/png;base64,${item.b64_json}`;
                    } else {
                      throw new Error("Invalid base64 data");
                    }
                  } catch (conversionError) {
                    throw new Error(
                      `Failed to convert image to base64: ${conversionError.message}`,
                    );
                  }
                } else if (item.url) {
                  return item.url;
                }
                return null;
              })
              .filter(Boolean);

            if (imageUrls.length > 0) {
              // Pass the exact FinalPrompt string used for the API to the viewer/history
              onSuccess(
                imageUrls,
                cleanPrompt,
                "OpenAICompat",
                activeProfile.model,
              );
            } else {
              throw new Error(
                "API response did not contain usable image data.",
              );
            }
          } catch (conversionError) {
            onFailure(
              conversionError.message,
              prompt,
              "OpenAICompat",
              activeUrl,
              {
                errorType: "image_conversion",
                isNonRetryable: false,
              },
            );
          }
        } else {
          throw new Error(JSON.stringify(data));
        }
      } catch (e) {
        // Handle enhanced error types from safeJsonParse
        if (e.isHtmlResponse) {
          onFailure(e.message, prompt, "OpenAICompat", activeUrl, {
            errorType: "html_response",
            isNonRetryable: false,
            endpointIssue: true,
          });
        } else if (e.isMalformedJson) {
          onFailure(e.message, prompt, "OpenAICompat", activeUrl, {
            errorType: "malformed_json",
            isNonRetryable: false,
            serverIssue: true,
          });
        } else if (e.isJsonParseError) {
          onFailure(e.message, prompt, "OpenAICompat", activeUrl, {
            errorType: "json_parse_error",
            isNonRetryable: false,
          });
        } else {
          // Fallback for generic errors
          onFailure(e.message, prompt, "OpenAICompat", activeUrl);
        }
      }
    },
    onerror: (error) =>
      onFailure(JSON.stringify(error), prompt, "OpenAICompat", activeUrl),
  });
}

// EXTERNAL MODULE: ./src/components/statusWidget.js
var statusWidget = __webpack_require__(867);
// EXTERNAL MODULE: ./src/components/imageViewer.js
var imageViewer = __webpack_require__(642);
;// ./src/components/errorModal.js



let modalElement = null;
let retryCallback = () => {};
let dismissCallback = () => {};

/**
 * Initializes the error modal with callbacks for retry and dismiss actions.
 * @param {object} callbacks - An object containing the retry and dismiss functions.
 * @param {function} callbacks.onRetry - Function to call when the user clicks retry.
 * @param {function} callbacks.onDismiss - Function to call when the user dismisses the modal.
 */
function errorModal_init({ onRetry, onDismiss }) {
  retryCallback = onRetry;
  dismissCallback = onDismiss;
}

/**
 * Creates the error modal DOM element and appends it to the body.
 */
function create() {
  if (modalElement) {
    return;
  }

  modalElement = document.createElement("div");
  modalElement.id = "nig-error-modal";
  modalElement.className = "nig-modal-overlay";
  modalElement.style.display = "none";
  modalElement.innerHTML = `
        <div class="nig-modal-content">
            <span class="nig-close-btn">&times;</span>
            <h2>Generation Failed</h2>
            <p>The image could not be generated. Please review the reason below and adjust your prompt if necessary.</p>
            <p><strong>Reason:</strong></p>
            <div id="nig-error-reason"></div>
            <p><strong>Your Prompt:</strong></p>
            <textarea id="nig-error-prompt" class="nig-error-prompt"></textarea>
            <div class="nig-form-group" style="margin-top: 15px;">
                <label for="nig-retry-provider-select">Retry with Provider:</label>
                <select id="nig-retry-provider-select"></select>
            </div>
            <div id="nig-error-actions" class="nig-error-actions"></div>
        </div>`;
  document.body.appendChild(modalElement);

  modalElement
    .querySelector(".nig-close-btn")
    .addEventListener("click", () => hide());
}

/**
 * Hides the error modal and calls the dismiss callback.
 */
function hide() {
  if (modalElement) {
    modalElement.style.display = "none";
  }

  // Call the dismiss callback if provided
  if (typeof dismissCallback === "function") {
    dismissCallback();
  }
}

/**
 * Shows and populates the error modal with details from a failed generation.
 * @param {object} errorDetails - The details of the error.
 */
async function show(errorDetails) {
  if (!modalElement) {
    create();
  }

  const reasonContainer = document.getElementById("nig-error-reason");
  const promptTextarea = document.getElementById("nig-error-prompt");
  promptTextarea.value = errorDetails.prompt;

  const providerSelect = document.getElementById("nig-retry-provider-select");
  providerSelect.innerHTML = "";
  const config = await (0,storage/* getConfig */.zj)();
  const providers = ["Pollinations", "AIHorde", "Google"];
  providers.forEach((p) => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    providerSelect.appendChild(option);
  });
  Object.keys(config.openAICompatProfiles).forEach((url) => {
    const option = document.createElement("option");
    option.value = `OpenAICompat::${url}`;
    option.textContent = `OpenAI: ${url.replace("https://", "").split("/")[0]}`;
    providerSelect.appendChild(option);
  });

  let failedProviderValue = errorDetails.provider;
  if (
    errorDetails.provider === "OpenAICompat" &&
    errorDetails.providerProfileUrl
  ) {
    failedProviderValue = `OpenAICompat::${errorDetails.providerProfileUrl}`;
  }
  if (
    Array.from(providerSelect.options).some(
      (opt) => opt.value === failedProviderValue,
    )
  ) {
    providerSelect.value = failedProviderValue;
  }

  // Defensive normalization for backward compatibility and robustness
  const reason = errorDetails && errorDetails.reason ? errorDetails.reason : {};
  const baseMessage =
    typeof reason.message === "string" && reason.message.trim().length > 0
      ? reason.message.trim()
      : "An unknown error occurred during image generation. Please review your configuration and try again.";

  const errorType = reason.errorType || null;

  // Build a single coherent Reason block with structured guidance
  const reasonParts = [];

  // Always start with the base parsed message
  reasonParts.push(baseMessage);

  // Append structured guidance based on errorType while avoiding duplication
  if (errorType === "authentication") {
    reasonParts.push(
      "Authentication Issue: Please check your API key configuration for this OpenAI-compatible provider. Ensure the key is valid, correctly scoped, and not expired before retrying.",
    );
  } else if (errorType === "api_key_validation") {
    reasonParts.push(
      "API Key Validation Issue: For AIHorde or the relevant provider, verify that your API key is correctly configured and that you have completed any required registration. You may try a different provider or update your API key in settings.",
    );
  } else if (errorType === "model_access") {
    // Avoid repeating essentially the same provider/tier guidance text; keep this concise and generic.
    if (
      !baseMessage.toLowerCase().includes("model") &&
      !baseMessage.toLowerCase().includes("plan") &&
      !baseMessage.toLowerCase().includes("tier") &&
      !baseMessage.toLowerCase().includes("subscription")
    ) {
      reasonParts.push(
        "Model Access Restriction: The selected model is not available for your current plan. Switch to a supported model or upgrade your account according to your provider’s tier documentation.",
      );
    }
  } else if (errorType === "image_conversion") {
    reasonParts.push(
      "Image Conversion Issue: The provider returned image data that could not be converted. This is often a temporary provider issue. You can try again or switch to a different provider.",
    );
  } else if (errorType === "ip_mismatch") {
    const discordLink = reason.discordLink || "https://discord.gg/zukijourney";
    const resetipCommand = reason.resetipCommand || "/user resetip";
    reasonParts.push(
      "IP Address Mismatch: Your current IP does not match the one registered to your account. " +
        "To resolve this, join the provider’s Discord server at " +
        discordLink +
        ', run the command "' +
        resetipCommand +
        '", or upgrade to a plan that supports multiple IPs. ' +
        "You can retry generation after the IP lock is reset.",
    );
  } else if (errorType === "html_response") {
    reasonParts.push(
      "Endpoint Configuration Issue: The API endpoint returned HTML instead of JSON. This usually indicates an incorrect endpoint URL, an authentication problem, or an endpoint that does not support the requested operation. " +
        "Check your OpenAI-compatible provider Base URL, path, and API key configuration.",
    );
  } else if (errorType === "malformed_json") {
    reasonParts.push(
      "Server Response Issue: The API returned malformed or invalid JSON data. This is typically a temporary server-side issue. " +
        "You can try again later or switch to another provider if the problem persists.",
    );
  } else if (errorType === "json_parse_error") {
    reasonParts.push(
      "JSON Parsing Error: The response from the provider could not be parsed. This may indicate an intermittent server issue or unexpected response format. " +
        "You can retry the request or use a different provider.",
    );
  }

  // In case multiple signals exist, ensure uniqueness and readability
  const uniqueReasonParts = Array.from(new Set(reasonParts.filter(Boolean)));
  reasonContainer.innerHTML = uniqueReasonParts
    .map((part) => `<p>${part}</p>`)
    .join("");

  // Reset prompt text
  promptTextarea.value =
    errorDetails && typeof errorDetails.prompt === "string"
      ? errorDetails.prompt
      : errorDetails && errorDetails.prompt !== undefined
        ? String(errorDetails.prompt)
        : "";

  const actionsContainer = document.getElementById("nig-error-actions");
  actionsContainer.innerHTML = "";

  // Check if this is a non-retryable error (authentication errors or explicitly marked as non-retryable)
  const isNonRetryableError =
    Boolean(reason.isNonRetryable) ||
    errorType === "authentication" ||
    (!reason.retryable && !errorType);

  // Create retry button
  const retryBtn = document.createElement("button");
  retryBtn.textContent = "Retry Generation";
  retryBtn.className = "nig-retry-btn";
  retryBtn.onclick = () => {
    const editedPrompt = promptTextarea.value.trim();
    if (!editedPrompt) {
      alert("Prompt cannot be empty.");
      return;
    }

    const selectedProviderValue = providerSelect.value;
    let provider;
    let providerProfileUrl;
    if (
      selectedProviderValue &&
      selectedProviderValue.startsWith("OpenAICompat::")
    ) {
      provider = "OpenAICompat";
      providerProfileUrl = selectedProviderValue.split("::")[1] || null;
    } else {
      provider = selectedProviderValue || errorDetails.provider || null;
      providerProfileUrl = null;
    }

    try {
      retryCallback(editedPrompt, provider, providerProfileUrl);
    } catch (e) {
      // Fail gracefully without breaking the modal
      logger/* logError */.vV("ERROR_MODAL", "Retry callback threw an error", {
        error: e && e.message,
      });
    }
    hide();
  };

  // Handle retry button visibility based on error type
  if (!isNonRetryableError) {
    if (reason.retryable) {
      // Show retry button immediately for retryable errors
      actionsContainer.appendChild(retryBtn);
    } else {
      // For non-retryable errors, only show retry if user modifies prompt or changes provider
      const showRetryButton = () => {
        if (!actionsContainer.contains(retryBtn)) {
          actionsContainer.appendChild(retryBtn);
        }
      };
      promptTextarea.oninput = showRetryButton;
      providerSelect.onchange = showRetryButton;
    }
  }

  modalElement.style.display = "flex";
}

;// ./src/components/googleApiPrompt.js


let promptElement = null;

/**
 * Shows a modal prompting the user for their Google API key.
 */
function googleApiPrompt_show() {
  if (document.getElementById("nig-google-api-prompt")) {
    return;
  }

  promptElement = document.createElement("div");
  promptElement.id = "nig-google-api-prompt";
  promptElement.className = "nig-modal-overlay";
  promptElement.innerHTML = `
        <div class="nig-modal-content">
            <span class="nig-close-btn">&times;</span>
            <h2>Google API Key Required</h2>
            <p>Please provide your Google AI Gemini API key. You can get one from <a href="https://aistudio.google.com/api-keys" target="_blank" class="nig-api-prompt-link">Google AI Studio</a>.</p>
            <div class="nig-form-group">
                <label for="nig-prompt-api-key">Gemini API Key</label>
                <div class="nig-password-wrapper">
                    <input type="password" id="nig-prompt-api-key">
                    <button
                        type="button"
                        class="nig-password-toggle"
                        data-target="nig-prompt-api-key"
                        aria-label="Show Gemini API key"
                        aria-pressed="false"
                    >
                        <span class="material-symbols-outlined" aria-hidden="true">visibility_off</span>
                    </button>
                </div>
            </div>
            <button id="nig-prompt-save-btn" class="nig-save-btn">Save Key</button>
        </div>`;
  document.body.appendChild(promptElement);

  const close = () => promptElement.remove();

  promptElement
    .querySelector(".nig-close-btn")
    .addEventListener("click", close);
  promptElement
    .querySelector("#nig-prompt-save-btn")
    .addEventListener("click", async () => {
      const key = promptElement
        .querySelector("#nig-prompt-api-key")
        .value.trim();
      if (key) {
        await (0,storage/* setConfigValue */.yJ)("googleApiKey", key);
        alert("API Key saved. You can now generate an image.");
        close();
      } else {
        alert("API Key cannot be empty.");
      }
    });
}

;// ./src/components/pollinationsAuthPrompt.js


let pollinationsAuthPrompt_promptElement = null;

/**
 * Shows a modal for Pollinations.ai authentication.
 * @param {string} errorMessage - The error message from the API.
 * @param {string} failedPrompt - The prompt that failed.
 * @param {function} onRetry - The callback function to execute on retry.
 */
function pollinationsAuthPrompt_show(errorMessage, failedPrompt, onRetry) {
  if (document.getElementById("nig-pollinations-auth-prompt")) {
    return;
  }

  pollinationsAuthPrompt_promptElement = document.createElement("div");
  pollinationsAuthPrompt_promptElement.id = "nig-pollinations-auth-prompt";
  pollinationsAuthPrompt_promptElement.className = "nig-modal-overlay";
  pollinationsAuthPrompt_promptElement.innerHTML = `
        <div class="nig-modal-content">
            <span class="nig-close-btn">&times;</span>
            <h2>Authentication Required</h2>
            <p>The Pollinations.ai model you selected requires authentication. You can get free access by registering.</p>
            <p><strong>Error Message:</strong> <em>${errorMessage}</em></p>
            <p>Please visit <a href="https://auth.pollinations.ai" target="_blank" class="nig-api-prompt-link">auth.pollinations.ai</a> to continue. You can either:</p>
            <ul>
                <li><strong>Register the Referrer:</strong> The easiest method. Just register the domain <code>wtr-lab.com</code>. This links your usage to your account without needing a token.</li>
                <li><strong>Use a Token:</strong> Get an API token and enter it below.</li>
            </ul>
            <div class="nig-form-group">
                <label for="nig-prompt-pollinations-token">Pollinations API Token</label>
                <input type="password" id="nig-prompt-pollinations-token">
            </div>
            <button id="nig-prompt-save-token-btn" class="nig-save-btn">Save Token & Retry</button>
        </div>`;
  document.body.appendChild(pollinationsAuthPrompt_promptElement);

  const close = () => pollinationsAuthPrompt_promptElement.remove();

  pollinationsAuthPrompt_promptElement
    .querySelector(".nig-close-btn")
    .addEventListener("click", close);
  pollinationsAuthPrompt_promptElement
    .querySelector("#nig-prompt-save-token-btn")
    .addEventListener("click", async () => {
      const token = pollinationsAuthPrompt_promptElement
        .querySelector("#nig-prompt-pollinations-token")
        .value.trim();
      if (token) {
        await (0,storage/* setConfigValue */.yJ)("pollinationsToken", token);
        pollinationsAuthPrompt_promptElement.remove();
        alert("Token saved. Retrying generation...");
        onRetry(failedPrompt, "Pollinations");
      } else {
        alert("Token cannot be empty.");
      }
    });
}

// EXTERNAL MODULE: ./src/utils/file.js
var file = __webpack_require__(322);
// EXTERNAL MODULE: ./src/config/defaults.js
var defaults = __webpack_require__(753);
;// ./src/components/enhancementPanel.js
// --- IMPORTS ---




// --- PUBLIC FUNCTIONS ---

/**
 * Toggles the enhancement settings UI based on whether enhancement is enabled
 */
function toggleEnhancementSettings(enabled) {
  const enhancementSettings = document.getElementById(
    "nig-enhancement-settings",
  );
  if (enhancementSettings) {
    if (enabled) {
      enhancementSettings.classList.remove("disabled");
    } else {
      enhancementSettings.classList.add("disabled");
    }
  }
}

/**
 * Updates the enhancement UI based on provider and configuration
 */
function updateEnhancementUI(provider, config) {
  const enhancementEnabled = config.enhancementEnabled;
  const hasApiKey =
    config.enhancementApiKey && config.enhancementApiKey.trim().length > 0;
  const shouldUseProviderEnh = shouldUseProviderEnhancement(
    provider,
    config,
  );
  const providerPriorityInfo = document.getElementById(
    "nig-provider-priority-info",
  );
  const statusIndicator = document.getElementById("nig-status-indicator");
  const statusText = document.getElementById("nig-status-text");
  const overrideProviderBtn = document.getElementById("nig-override-provider");

  if (
    enhancementEnabled &&
    shouldUseProviderEnh &&
    !config.enhancementOverrideProvider
  ) {
    providerPriorityInfo.style.display = "block";
    statusIndicator.className = "nig-status-indicator provider-active";
    statusText.textContent = "Provider Enhancement Active";
    if (overrideProviderBtn) {
      overrideProviderBtn.style.display = "inline-block";
    }
  } else {
    providerPriorityInfo.style.display = "none";
    if (enhancementEnabled && hasApiKey) {
      statusIndicator.className = "nig-status-indicator external-active";
      statusText.textContent = "External AI Enhancement Active";
    } else if (enhancementEnabled) {
      statusIndicator.className = "nig-status-indicator disabled";
      statusText.textContent = "Enhancement Enabled (No API Key)";
    } else {
      statusIndicator.className = "nig-status-indicator disabled";
      statusText.textContent = "Enhancement Disabled";
    }
    if (overrideProviderBtn) {
      overrideProviderBtn.style.display = "none";
    }
  }
}

/**
 * Handles enhancement template selection and updates UI accordingly
 */
/**
 * Load and normalize user presets from config.
 * Ensures backward compatibility with potential legacy shapes.
 */
function getNormalizedUserPresets(config) {
  const raw = config.enhancementUserPresets;
  const normalized = {};

  try {
    if (!raw) {
      return normalized;
    }

    // If already an object map of id -> preset
    if (typeof raw === "object" && !Array.isArray(raw)) {
      Object.entries(raw).forEach(([id, value]) => {
        if (value && typeof value.template === "string") {
          const presetId = value.id || id;
          normalized[presetId] = {
            id: presetId,
            name: value.name || presetId,
            description:
              typeof value.description === "string" ? value.description : "",
            template: value.template,
            createdAt: value.createdAt || null,
            updatedAt: value.updatedAt || null,
            version: value.version || 1,
          };
        }
      });
      return normalized;
    }

    // If legacy array: [{ name, template, ... }]
    if (Array.isArray(raw)) {
      raw.forEach((p, index) => {
        if (p && typeof p.template === "string") {
          const safeName =
            p.name && typeof p.name === "string"
              ? p.name.trim()
              : `Preset ${index + 1}`;
          const id =
            p.id ||
            safeName
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-_]/g, "") ||
            `preset-${index + 1}`;
          if (!normalized[id]) {
            normalized[id] = {
              id,
              name: safeName,
              description:
                typeof p.description === "string" ? p.description : "",
              template: p.template,
              createdAt: p.createdAt || null,
              updatedAt: p.updatedAt || null,
              version: 1,
            };
          }
        }
      });
      return normalized;
    }
  } catch (e) {
    console.error(
      "[NIG] Failed to normalize enhancementUserPresets, clearing corrupted data",
      e,
    );
  }

  return normalized;
}

/**
 * Persist normalized user presets back to storage.
 */
async function saveUserPresetsToStorage(userPresetsMap) {
  try {
    await storage/* setConfigValue */.yJ(
      "enhancementUserPresets",
      userPresetsMap || {},
    );
  } catch (e) {
    console.error("[NIG] Failed to save enhancementUserPresets", e);
    alert("Failed to save enhancement preset. See console for details.");
  }
}

/**
 * Populate the Enhancement Template select with grouped user + default presets,
 * ensuring "User Presets" group appears above "Default Presets".
 */
function populateEnhancementTemplateSelect(
  templateSelect,
  userPresetsMap,
  selectedKey,
) {
  const defaultPresets = defaults/* DEFAULTS */.z.enhancementPresets || {};

  // Clear existing options while preserving optgroup structure from template
  templateSelect.innerHTML = "";

  // User Presets group
  const userOptgroup = document.createElement("optgroup");
  userOptgroup.label = "User Presets";
  userOptgroup.dataset.group = "user-presets";

  const userPresetEntries = Object.values(userPresetsMap || {});
  if (userPresetEntries.length === 0) {
    const emptyOption = document.createElement("option");
    emptyOption.disabled = true;
    emptyOption.textContent = "No user presets saved yet";
    userOptgroup.appendChild(emptyOption);
  } else {
    userPresetEntries.forEach((preset) => {
      const option = document.createElement("option");
      option.value = `user:${preset.id}`;
      option.textContent = preset.name || preset.id;
      option.title = preset.description || preset.template || "";
      userOptgroup.appendChild(option);
    });
  }

  // Default Presets group (top 5 only per DEFAULTS)
  const defaultOptgroup = document.createElement("optgroup");
  defaultOptgroup.label = "Default Presets";
  defaultOptgroup.dataset.group = "default-presets";

  Object.entries(defaultPresets).forEach(([key, preset]) => {
    if (!preset || typeof preset.template !== "string") {
      return;
    }
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${preset.name} - ${preset.description}`;
    option.title = preset.template;
    defaultOptgroup.appendChild(option);
  });

  // Append groups in required order
  templateSelect.appendChild(userOptgroup);
  templateSelect.appendChild(defaultOptgroup);

  // Custom one-off entry at bottom (not part of any optgroup)
  const customOption = document.createElement("option");
  customOption.value = "custom";
  customOption.textContent = "Custom (one-off)";
  templateSelect.appendChild(customOption);

  // Resolve selection
  if (
    selectedKey &&
    templateSelect.querySelector(`option[value="${selectedKey}"]`)
  ) {
    templateSelect.value = selectedKey;
  } else if (selectedKey && defaultPresets[selectedKey]) {
    templateSelect.value = selectedKey;
  } else if (selectedKey === "custom") {
    templateSelect.value = "custom";
  } else {
    // Fallback to standard if available
    if (defaultPresets.standard) {
      templateSelect.value = "standard";
    } else {
      templateSelect.value = "custom";
    }
  }
}

/**
 * Handle initial enhancement template selection, including user presets.
 */
async function handleEnhancementTemplateSelection(config) {
  const templateSelect = document.getElementById(
    "nig-enhancement-template-select",
  );
  const templateTextarea = document.getElementById("nig-enhancement-template");

  if (!templateSelect || !templateTextarea) {
    return;
  }

  const defaultPresets = defaults/* DEFAULTS */.z.enhancementPresets || {};
  const userPresets = getNormalizedUserPresets(config);

  const storedSelected = config.enhancementTemplateSelected;
  const storedTemplate =
    typeof config.enhancementTemplate === "string"
      ? config.enhancementTemplate
      : "";

  // Try to resolve selection:
  // - user:<id> for user presets
  // - default preset keys
  // - 'custom'
  let resolvedKey = null;

  if (storedSelected && typeof storedSelected === "string") {
    if (storedSelected === "custom") {
      resolvedKey = "custom";
    } else if (storedSelected.startsWith("user:")) {
      const id = storedSelected.replace(/^user:/, "");
      if (userPresets[id]) {
        resolvedKey = `user:${id}`;
      }
    } else if (defaultPresets[storedSelected]) {
      resolvedKey = storedSelected;
    }
  }

  // If no direct match, attempt to infer from stored template content
  if (!resolvedKey && storedTemplate) {
    // Check user presets
    for (const preset of Object.values(userPresets)) {
      if (preset.template === storedTemplate) {
        resolvedKey = `user:${preset.id}`;
        break;
      }
    }

    // Check default presets if still not resolved
    if (!resolvedKey) {
      for (const [key, preset] of Object.entries(defaultPresets)) {
        if (
          preset &&
          typeof preset === "object" &&
          preset.template === storedTemplate
        ) {
          resolvedKey = key;
          break;
        }
      }
    }

    // Fallback: treat as custom if we have content
    if (!resolvedKey) {
      resolvedKey = "custom";
    }
  }

  // Final fallback to standard if nothing else
  if (!resolvedKey) {
    resolvedKey = defaultPresets.standard ? "standard" : "custom";
  }

  // Populate select with grouped options
  populateEnhancementTemplateSelect(templateSelect, userPresets, resolvedKey);

  // Populate textarea and readonly/editable state
  if (resolvedKey === "custom") {
    templateTextarea.value = storedTemplate || "";
    templateTextarea.disabled = false;
  } else if (resolvedKey.startsWith("user:")) {
    const id = resolvedKey.replace(/^user:/, "");
    const preset = userPresets[id];
    if (preset) {
      templateTextarea.value = preset.template;
      templateTextarea.disabled = true;
    } else {
      // Missing user preset -> fallback to custom with storedTemplate
      templateTextarea.value = storedTemplate || "";
      templateTextarea.disabled = false;
      templateSelect.value = "custom";
    }
  } else {
    const preset = defaultPresets[resolvedKey];
    if (preset) {
      templateTextarea.value = preset.template;
      templateTextarea.disabled = true;
    } else {
      templateTextarea.value = storedTemplate || "";
      templateTextarea.disabled = false;
      templateSelect.value = "custom";
    }
  }
}

/**
 * Tests the enhancement functionality with a sample prompt
 */
async function testEnhancement(prompt, config) {
  try {
    const result = await enhancePromptWithGemini(prompt, config);
    return {
      original: prompt,
      enhanced: result,
    };
  } catch (error) {
    throw new Error(`Enhancement failed: ${error.message}`);
  }
}

/**
 * Populates enhancement settings in the form
 */
async function populateEnhancementSettings(config) {
  // Handle enhancement template selection
  await handleEnhancementTemplateSelection(config);
  toggleEnhancementSettings(config.enhancementEnabled);
  updateEnhancementUI(config.selectedProvider, config);

  if (config.enhancementApiKey.trim().length > 0) {
    document.getElementById("nig-enhancement-preview").style.display = "block";
  }
}

/**
 * Saves enhancement configuration to storage
 */
async function saveEnhancementConfig() {
  await storage/* setConfigValue */.yJ(
    "enhancementEnabled",
    document.getElementById("nig-enhancement-enabled").checked,
  );
  await storage/* setConfigValue */.yJ(
    "enhancementApiKey",
    document.getElementById("nig-gemini-api-key").value.trim(),
  );
  await storage/* setConfigValue */.yJ(
    "enhancementModel",
    document.getElementById("nig-enhancement-model").value,
  );
  await storage/* setConfigValue */.yJ(
    "enhancementTemplate",
    document.getElementById("nig-enhancement-template").value.trim(),
  );
  await storage/* setConfigValue */.yJ(
    "enhancementTemplateSelected",
    document.getElementById("nig-enhancement-template-select").value,
  );
  await storage/* setConfigValue */.yJ("enhancementOverrideProvider", false); // Reset override on save
}

/**
 * Sets up enhancement event listeners
 */
function setupEnhancementEventListeners(panelElement) {
  const enhancementEnabled = panelElement.querySelector(
    "#nig-enhancement-enabled",
  );
  const overrideProviderBtn = panelElement.querySelector(
    "#nig-override-provider",
  );
  const templateSelect = panelElement.querySelector(
    "#nig-enhancement-template-select",
  );
  const templateResetBtn = panelElement.querySelector("#nig-template-reset");
  const templateSavePresetBtn = panelElement.querySelector(
    "#nig-template-save-preset",
  );
  const templateDeletePresetBtn = panelElement.querySelector(
    "#nig-template-delete-preset",
  );
  const templateExampleBtn = panelElement.querySelector(
    "#nig-template-example",
  );
  const testEnhancementBtn = panelElement.querySelector(
    "#nig-test-enhancement",
  );
  const geminiApiKeyInput = panelElement.querySelector("#nig-gemini-api-key");

  // Enhancement Template Selection Handler
  templateSelect.addEventListener("change", async (e) => {
    const selectedValue = e.target.value;
    const templateTextarea = panelElement.querySelector(
      "#nig-enhancement-template",
    );
    const defaultPresets = defaults/* DEFAULTS */.z.enhancementPresets || {};
    const config = await storage/* getConfig */.zj();
    const userPresets = getNormalizedUserPresets(config);

    if (selectedValue === "custom") {
      // Custom one-off: textarea editable, not bound to a named preset.
      templateTextarea.disabled = false;
      await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
    } else if (selectedValue.startsWith("user:")) {
      const id = selectedValue.replace(/^user:/, "");
      const preset = userPresets[id];
      if (preset) {
        templateTextarea.value = preset.template;
        templateTextarea.disabled = true;
        await storage/* setConfigValue */.yJ("enhancementTemplate", preset.template);
        await storage/* setConfigValue */.yJ(
          "enhancementTemplateSelected",
          `user:${id}`,
        );
      } else {
        // Missing user preset -> treat as custom to avoid data loss.
        templateTextarea.disabled = false;
        await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
      }
    } else {
      // Default preset
      const preset = defaultPresets[selectedValue];
      if (preset) {
        templateTextarea.value = preset.template;
        templateTextarea.disabled = true;
        await storage/* setConfigValue */.yJ("enhancementTemplate", preset.template);
        await storage/* setConfigValue */.yJ(
          "enhancementTemplateSelected",
          selectedValue,
        );
      } else {
        // Unknown key: fallback to custom
        templateTextarea.disabled = false;
        await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
      }
    }
  });

  // Save as Preset Button
  if (templateSavePresetBtn) {
    templateSavePresetBtn.addEventListener("click", async () => {
      try {
        const templateTextarea = panelElement.querySelector(
          "#nig-enhancement-template",
        );
        const templateSelectEl = panelElement.querySelector(
          "#nig-enhancement-template-select",
        );
        const rawText = (templateTextarea.value || "").trim();

        if (!rawText) {
          alert("Cannot save an empty enhancement preset.");
          return;
        }

        const name = prompt("Enter a name for this enhancement preset:", "");
        if (!name) {
          return;
        }

        const trimmedName = name.trim();
        if (!trimmedName) {
          alert("Preset name cannot be empty.");
          return;
        }

        const config = await storage/* getConfig */.zj();
        const existing = getNormalizedUserPresets(config);

        // Generate stable id from name
        const baseId =
          trimmedName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-_]/g, "")
            .substring(0, 64) || "preset";

        let id = baseId;
        let suffix = 1;
        while (existing[id] && existing[id].name !== trimmedName) {
          id = `${baseId}-${suffix++}`;
        }

        const nowIso = new Date().toISOString();
        existing[id] = {
          id,
          name: trimmedName,
          description: "",
          template: rawText,
          createdAt: existing[id]?.createdAt || nowIso,
          updatedAt: nowIso,
          version: 1,
        };

        await saveUserPresetsToStorage(existing);

        // Refresh select with new user preset list
        populateEnhancementTemplateSelect(
          templateSelectEl,
          existing,
          `user:${id}`,
        );

        // Lock textarea for the saved preset
        templateTextarea.value = rawText;
        templateTextarea.disabled = true;

        await storage/* setConfigValue */.yJ("enhancementTemplate", rawText);
        await storage/* setConfigValue */.yJ(
          "enhancementTemplateSelected",
          `user:${id}`,
        );

        alert(`Enhancement preset "${trimmedName}" saved under User Presets.`);
      } catch (e) {
        console.error("[NIG] Failed to save enhancement preset", e);
        alert(
          "Failed to save enhancement preset. Please check the console for details.",
        );
      }
    });
  }

  // Delete selected user preset
  if (templateDeletePresetBtn) {
    templateDeletePresetBtn.addEventListener("click", async () => {
      try {
        const templateSelectEl = panelElement.querySelector(
          "#nig-enhancement-template-select",
        );
        const templateTextarea = panelElement.querySelector(
          "#nig-enhancement-template",
        );
        const selected = templateSelectEl ? templateSelectEl.value : "";

        if (!selected || !selected.startsWith("user:")) {
          alert(
            'Please select a User Preset from the "User Presets" group to delete.',
          );
          return;
        }

        const id = selected.replace(/^user:/, "");
        const config = await storage/* getConfig */.zj();
        const existing = getNormalizedUserPresets(config);

        if (!existing[id]) {
          alert("The selected user preset no longer exists or is invalid.");
          return;
        }

        const confirmMessage = `Delete user preset "${existing[id].name || id}"? This action cannot be undone.`;
        if (!confirm(confirmMessage)) {
          return;
        }

        // Remove preset and persist
        delete existing[id];
        await saveUserPresetsToStorage(existing);

        // Rebuild the select; default to "standard" if available or "custom"
        const fallbackKey = defaults/* DEFAULTS */.z.enhancementPresets?.standard
          ? "standard"
          : "custom";
        populateEnhancementTemplateSelect(
          templateSelectEl,
          existing,
          fallbackKey,
        );

        // If we deleted the active preset, update textarea and selection accordingly
        if (selected === config.enhancementTemplateSelected) {
          if (fallbackKey === "custom") {
            templateTextarea.value = (config.enhancementTemplate || "").trim();
            templateTextarea.disabled = false;
            await storage/* setConfigValue */.yJ(
              "enhancementTemplateSelected",
              "custom",
            );
          } else {
            const fallbackPreset = defaults/* DEFAULTS */.z.enhancementPresets[fallbackKey];
            templateTextarea.value = fallbackPreset?.template || "";
            templateTextarea.disabled = Boolean(fallbackPreset);
            if (fallbackPreset) {
              await storage/* setConfigValue */.yJ(
                "enhancementTemplate",
                fallbackPreset.template,
              );
            }
            await storage/* setConfigValue */.yJ(
              "enhancementTemplateSelected",
              fallbackKey,
            );
          }
        }

        alert("User preset deleted.");
      } catch (e) {
        console.error("[NIG] Failed to delete enhancement user preset", e);
        alert(
          "Failed to delete user preset. Please check the console for details.",
        );
      }
    });
  }

  // Reset to Preset Button
  templateResetBtn.addEventListener("click", async () => {
    const selectedValue = templateSelect.value;
    const templateTextarea = panelElement.querySelector(
      "#nig-enhancement-template",
    );
    const defaultPresets = defaults/* DEFAULTS */.z.enhancementPresets || {};
    const config = await storage/* getConfig */.zj();
    const userPresets = getNormalizedUserPresets(config);

    if (selectedValue !== "custom") {
      if (selectedValue.startsWith("user:")) {
        const id = selectedValue.replace(/^user:/, "");
        const preset = userPresets[id];
        if (preset) {
          templateTextarea.value = preset.template;
          templateTextarea.disabled = true;
          await storage/* setConfigValue */.yJ("enhancementTemplate", preset.template);
          await storage/* setConfigValue */.yJ(
            "enhancementTemplateSelected",
            `user:${id}`,
          );
        }
      } else {
        const preset = defaultPresets[selectedValue];
        if (preset) {
          templateTextarea.value = preset.template;
          templateTextarea.disabled = true;
          await storage/* setConfigValue */.yJ("enhancementTemplate", preset.template);
          await storage/* setConfigValue */.yJ(
            "enhancementTemplateSelected",
            selectedValue,
          );
        }
      }
    } else {
      // If "custom" is selected, reset should restore stored custom text if any.
      const cfg = await storage/* getConfig */.zj();
      const customTemplate =
        typeof cfg.enhancementTemplate === "string"
          ? cfg.enhancementTemplate
          : "";
      templateTextarea.value = customTemplate;
      templateTextarea.disabled = false;
      await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
    }
  });

  // Load Example Button
  templateExampleBtn.addEventListener("click", async () => {
    const exampleTemplate =
      'Extract visual elements from this text and craft a concise image generation prompt as a flowing paragraph. Focus on: characters and their appearances/actions/expressions, setting and environment, lighting/mood/color palette, artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, specific descriptors separated by commas or short phrases for clarity. End with quality boosters like "highly detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene/mood, then style/technicals:';
    const templateTextarea = panelElement.querySelector(
      "#nig-enhancement-template",
    );
    const templateSelect = panelElement.querySelector(
      "#nig-enhancement-template-select",
    );

    // Treat example as an explicit template choice: store it and mark as custom.
    templateTextarea.value = exampleTemplate;
    templateTextarea.disabled = false;
    if (templateSelect) {
      templateSelect.value = "custom";
    }
    await storage/* setConfigValue */.yJ("enhancementTemplate", exampleTemplate);
    await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
  });

  // Enhancement enabled toggle
  enhancementEnabled.addEventListener("change", async (e) => {
    const newState = e.target.checked;
    const config = await storage/* getConfig */.zj();
    config.enhancementEnabled = newState;
    await storage/* setConfigValue */.yJ("enhancementEnabled", newState);
    toggleEnhancementSettings(newState);
    const provider = document.getElementById("nig-provider").value;
    updateEnhancementUI(provider, config);
  });

  // Override provider enhancement
  overrideProviderBtn.addEventListener("click", async () => {
    const provider = document.getElementById("nig-provider").value;
    await storage/* setConfigValue */.yJ("enhancementOverrideProvider", true);
    const config = await storage/* getConfig */.zj();
    updateEnhancementUI(provider, config);
  });

  // API key input handling
  geminiApiKeyInput.addEventListener("input", async (e) => {
    const hasApiKey = e.target.value.trim().length > 0;
    if (hasApiKey) {
      panelElement.querySelector("#nig-enhancement-preview").style.display =
        "block";
    } else {
      panelElement.querySelector("#nig-enhancement-preview").style.display =
        "none";
    }
  });

  // Track manual edits to enhancement template:
  // Always persist latest raw text for resilience.
  const templateTextareaForInput = panelElement.querySelector(
    "#nig-enhancement-template",
  );
  const templateSelectForInput = panelElement.querySelector(
    "#nig-enhancement-template-select",
  );
  if (templateTextareaForInput && templateSelectForInput) {
    templateTextareaForInput.addEventListener("input", async () => {
      const value = templateTextareaForInput.value;
      const currentSelect = templateSelectForInput.value;

      await storage/* setConfigValue */.yJ("enhancementTemplate", value);

      // Only mark as custom when explicitly in custom mode
      if (currentSelect === "custom") {
        await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
      }
    });
  }

  // Test enhancement button
  testEnhancementBtn.addEventListener("click", async () => {
    const config = await storage/* getConfig */.zj();
    const maxTestLength = 4000;
    const defaultPrompt =
      "As dusk settles over the glass-domed city of Aurelia, bioluminescent vines unfurl along the skybridges, " +
      "casting soft teal and amethyst reflections across the rain-slick streets below. A lone archivist in a " +
      "weathered indigo cloak pauses at the edge of the highest promenade, holographic pages circling her like " +
      "gentle fireflies, each fragment revealing glimpses of forgotten constellations and outlawed legends. " +
      "Far beneath, maglev trams weave through layers of suspended gardens, mirrored water channels, and rising " +
      "plumes of golden steam as hidden market stalls ignite with warm lantern light. In the distance, an ancient " +
      "stone observatory fused with gleaming chrome spires pierces the cloudline, its rotating rings aligning " +
      "slowly with an eclipse of twin moons. The air shimmers with drifting petals, neon signage in lost languages, " +
      "and faint auroras bending around colossal statues half-consumed by ivy and circuitry.";

    const originalPromptEl = document.getElementById("nig-original-prompt");
    let testPrompt = originalPromptEl
      ? (originalPromptEl.value || originalPromptEl.textContent || "").trim()
      : "";

    // If no user-provided prompt in the editable field, fallback to default narrative prompt
    if (!testPrompt) {
      testPrompt = defaultPrompt;
      if (originalPromptEl) {
        // Populate the editable area so the user can see/modify what was used
        if ("value" in originalPromptEl) {
          originalPromptEl.value = defaultPrompt;
        } else {
          originalPromptEl.textContent = defaultPrompt;
        }
      }
    }

    // Enforce a reasonable length limit for preview requests
    if (testPrompt.length > maxTestLength) {
      alert(
        "Test prompt is too long. Please use 4000 characters or fewer for preview.",
      );
      return;
    }

    testEnhancementBtn.disabled = true;
    const originalContent = testEnhancementBtn.innerHTML;
    testEnhancementBtn.innerHTML =
      '<span class="material-symbols-outlined">hourglass_empty</span>Testing...';

    try {
      const result = await testEnhancement(testPrompt, config);
      const originalEl = document.getElementById("nig-original-prompt");
      const enhancedEl = document.getElementById("nig-enhanced-prompt");

      // Reflect the exact original prompt used for enhancement in the editable field
      if (originalEl) {
        if ("value" in originalEl) {
          originalEl.value = result.original || "";
        } else {
          originalEl.textContent = result.original || "";
        }
      }

      if (enhancedEl) {
        enhancedEl.textContent = result.enhanced || "";
      }
    } catch (error) {
      console.error("[NIG] Enhancement test failed", error);
      const message =
        error && error.message
          ? error.message
          : "Unknown error occurred while requesting enhancement.";
      alert(`Enhancement test failed: ${message}`);
    } finally {
      testEnhancementBtn.disabled = false;
      testEnhancementBtn.innerHTML = originalContent;
    }
  });
}

// EXTERNAL MODULE: ./src/api/models.js + 1 modules
var models = __webpack_require__(189);
;// ./src/config/styles.js
const PROMPT_CATEGORIES = [
  {
    name: "None",
    description: "No additional styling will be added to your prompt.",
    subStyles: [],
  },
  {
    name: "Anime",
    description:
      "Blends Japanese animation with global twists. Sub-styles often mix eras, genres, or crossovers for dynamic outputs.",
    subStyles: [
      {
        name: "None",
        value: "none",
        description:
          'Use only the main style name as a prefix (e.g., "Anime style, ...").',
      },
      {
        name: "Studio Ghibli-Inspired",
        description:
          "Whimsical, nature-focused fantasy with soft lines and emotional depth.",
        value: "Studio Ghibli style, ",
      },
      {
        name: "Cyberpunk Anime",
        description:
          "Neon-lit dystopias with high-tech mechs and gritty urban vibes.",
        value: "Cyberpunk anime style, ",
      },
      {
        name: "Semi-Realistic Anime",
        description:
          "Blends lifelike proportions with expressive anime eyes and shading.",
        value: "Semi-realistic anime style, ",
      },
      {
        name: "Mecha",
        description: "Giant robots and mechanical suits in epic battles.",
        value: "Mecha anime style, ",
      },
      {
        name: "Dynamic Action",
        description:
          "High-energy movements with power effects and intense expressions.",
        value: "Dynamic action anime style, ",
      },
      {
        name: "Soft Romantic",
        description:
          "Emotional interactions with gentle colors and sparkling accents.",
        value: "Soft romantic anime style, ",
      },
      {
        name: "Dark Fantasy Anime",
        description: "Grim, horror-tinged worlds with demons and shadows.",
        value: "Dark fantasy anime style, ",
      },
      {
        name: "Retro 80s Anime",
        description: "Vintage cel-shaded look with bold lines and synth vibes.",
        value: "80s retro anime style, ",
      },
      {
        name: "Portal Fantasy",
        description:
          "World-crossing elements with magical adaptations and RPG motifs.",
        value: "Portal fantasy anime style, ",
      },
      {
        name: "Slice-of-Life",
        description:
          "Everyday moments with relatable characters and cozy vibes.",
        value: "Slice-of-life anime style, ",
      },
      {
        name: "Serialized Narrative",
        description: "Panel-like compositions for ongoing story flows.",
        value: "Serialized narrative anime style, ",
      },
      {
        name: "Group Dynamic",
        description:
          "Interactions among multiple characters with balanced focus.",
        value: "Group dynamic anime style, ",
      },
    ],
  },
  {
    name: "Realism/Photorealism",
    description:
      "Excels in portraits and scenes mimicking photography, with sub-styles varying by subject or technique.",
    subStyles: [
      {
        name: "None",
        value: "none",
        description:
          'Use only the main style name as a prefix (e.g., "Realism/Photorealism style, ...").',
      },
      {
        name: "Hyperrealism",
        description: "Ultra-detailed, almost tangible textures and lighting.",
        value: "Hyperrealistic, ",
      },
      {
        name: "Cinematic Realism",
        description: "Film-like depth with dramatic angles and color grading.",
        value: "Cinematic realism, ",
      },
      {
        name: "Portrait Photorealism",
        description: "Human faces with natural skin, eyes, and expressions.",
        value: "Portrait photorealism, ",
      },
      {
        name: "Architectural Realism",
        description: "Precise building renders with environmental details.",
        value: "Architectural realism, ",
      },
      {
        name: "Nature Photorealism",
        description: "Verdant landscapes with dew and foliage intricacies.",
        value: "Nature photorealism, ",
      },
      {
        name: "Close-Up Detail",
        description: "Intimate views highlighting textures and fine elements.",
        value: "Close-up realistic style, ",
      },
      {
        name: "Historical Realism",
        description: "Period-accurate clothing and settings with grit.",
        value: "Historical realism, ",
      },
      {
        name: "Urban Realism",
        description: "Bustling city life with crowds and neon realism.",
        value: "Urban realism, ",
      },
      {
        name: "Stylized Realism",
        description: "Subtle artistic tweaks on photoreal bases.",
        value: "Stylized realism, ",
      },
      {
        name: "Documentary Style",
        description: "Raw, unpolished scenes like news photography.",
        value: "Documentary photo style, ",
      },
      {
        name: "Object Focus Realism",
        description: "Clear, highlighted items with neutral lighting.",
        value: "Object-focused realism, ",
      },
      {
        name: "Wildlife Realism",
        description: "Animals in habitats with fur and feather fidelity.",
        value: "Wildlife realism, ",
      },
      {
        name: "Detailed Portrait",
        description: "Lifelike faces with expressive features.",
        value: "Detailed portrait realism, ",
      },
      {
        name: "Environmental Immersion",
        description: "Rich settings enveloping subjects.",
        value: "Environmental immersion realism, ",
      },
    ],
  },
  {
    name: "Fantasy",
    description:
      "Epic worlds of magic and myth, with sub-styles spanning tones from whimsical to grim.",
    subStyles: [
      {
        name: "None",
        value: "none",
        description:
          'Use only the main style name as a prefix (e.g., "Fantasy style, ...").',
      },
      {
        name: "High Fantasy",
        description: "Medieval realms with elves, dragons, and quests.",
        value: "High fantasy art, ",
      },
      {
        name: "Dark Fantasy",
        description: "Grimdark horror with undead and moral ambiguity.",
        value: "Dark fantasy art, ",
      },
      {
        name: "Urban Fantasy",
        description: "Magic in modern cities, like hidden witches.",
        value: "Urban fantasy art, ",
      },
      {
        name: "Steampunk Fantasy",
        description: "Victorian tech with gears and airships.",
        value: "Steampunk fantasy style, ",
      },
      {
        name: "Fairy Tale",
        description: "Whimsical tales with enchanted woods and creatures.",
        value: "Fairy tale illustration style, ",
      },
      {
        name: "Heroic Adventure",
        description: "Bold explorers with raw magic and ancient relics.",
        value: "Heroic adventure fantasy art, ",
      },
      {
        name: "Creature Emphasis",
        description: "Fantastical beings in natural or enchanted environments.",
        value: "Creature-focused fantasy art, ",
      },
      {
        name: "Ethereal Grace",
        description: "Elegant figures in luminous, forested settings.",
        value: "Ethereal grace fantasy style, ",
      },
      {
        name: "Rugged Craftsmanship",
        description: "Stout builders in forged, underground realms.",
        value: "Rugged craftsmanship fantasy style, ",
      },
      {
        name: "Gothic Fantasy",
        description: "Haunted castles with vampires and storms.",
        value: "Gothic fantasy art, ",
      },
      {
        name: "Beast Majesty",
        description: "Powerful scaled creatures in dramatic poses.",
        value: "Majestic beast fantasy art, ",
      },
      {
        name: "Celestial Fantasy",
        description: "Starry realms with gods and floating islands.",
        value: "Celestial fantasy art, ",
      },
      {
        name: "Oriental Myth",
        description: "Asian folklore elements with harmonious nature.",
        value: "Oriental myth fantasy style, ",
      },
      {
        name: "Treasure Hunt Vibe",
        description: "Exploratory scenes with hidden wonders.",
        value: "Treasure hunt fantasy art, ",
      },
    ],
  },
  {
    name: "Sci-Fi",
    description:
      "Futuristic visions from gritty cyber worlds to cosmic explorations.",
    subStyles: [
      {
        name: "None",
        value: "none",
        description:
          'Use only the main style name as a prefix (e.g., "Sci-Fi style, ...").',
      },
      {
        name: "Cyberpunk",
        description: "Neon dystopias with hackers and megacorps.",
        value: "Cyberpunk style, ",
      },
      {
        name: "Retro-Futurism",
        description: "1950s optimism with ray guns and chrome.",
        value: "Retro-futurism, ",
      },
      {
        name: "Biopunk",
        description: "Organic tech with genetic mutations.",
        value: "Biopunk sci-fi style, ",
      },
      {
        name: "Interstellar Epic",
        description: "Vast cosmic tales with diverse species and ships.",
        value: "Interstellar epic sci-fi art, ",
      },
      {
        name: "Mechanical Suit",
        description: "Armored machines in high-tech conflicts.",
        value: "Mechanical suit sci-fi style, ",
      },
      {
        name: "Post-Human",
        description: "Cyborgs and AI in evolved societies.",
        value: "Post-human sci-fi art, ",
      },
      {
        name: "Hard Sci-Fi",
        description: "Physics-based realism with tech schematics.",
        value: "Hard sci-fi illustration, ",
      },
      {
        name: "Dieselpunk",
        description: "1930s grit with riveted machines.",
        value: "Dieselpunk style, ",
      },
      {
        name: "Astro-Mythology",
        description: "Space gods and cosmic myths.",
        value: "Astro-mythology art, ",
      },
      {
        name: "Eco-Sci-Fi",
        description: "Post-apocalypse with bio-domes.",
        value: "Eco-sci-fi art, ",
      },
      {
        name: "Survival Wasteland",
        description: "Harsh, ruined landscapes with resilient figures.",
        value: "Survival wasteland sci-fi style, ",
      },
      {
        name: "Cosmic Discovery",
        description: "Unknown worlds with exploratory tech.",
        value: "Cosmic discovery sci-fi art, ",
      },
    ],
  },
  {
    name: "Retro/Vintage",
    description:
      "Nostalgic aesthetics from bygone eras, revived with AI flair.",
    subStyles: [
      {
        name: "None",
        value: "none",
        description:
          'Use only the main style name as a prefix (e.g., "Retro/Vintage style, ...").',
      },
      {
        name: "Art Deco",
        description: "Geometric luxury with gold and symmetry.",
        value: "Art Deco style, ",
      },
      {
        name: "Art Nouveau",
        description: "Flowing organic lines and floral motifs.",
        value: "Art Nouveau style, ",
      },
      {
        name: "Vintage Poster",
        description: "Bold typography and illustrative ads.",
        value: "Vintage poster style, ",
      },
      {
        name: "Chromolithography",
        description: "Vibrant, printed color layers from 1900s.",
        value: "Chromolithography, ",
      },
      {
        name: "Baroque",
        description: "Ornate drama with rich drapery.",
        value: "Baroque painting style, ",
      },
      {
        name: "Ukiyo-e",
        description: "Japanese woodblock prints with flat colors.",
        value: "Ukiyo-e style, ",
      },
      {
        name: "1950s Retro",
        description: "Atomic age optimism with pastels.",
        value: "1950s retro style, ",
      },
      {
        name: "Playful Figure",
        description: "Charming, stylized poses with vintage flair.",
        value: "Playful vintage figure style, ",
      },
      {
        name: "Edwardian",
        description: "Lacy elegance with soft pastels.",
        value: "Edwardian era style, ",
      },
      {
        name: "Mid-Century Modern",
        description: "Clean lines and bold geometrics.",
        value: "Mid-century modern style, ",
      },
      {
        name: "Ink Scroll",
        description: "Brush-like lines evoking ancient manuscripts.",
        value: "Ink scroll vintage style, ",
      },
    ],
  },
  {
    name: "Surrealism",
    description:
      "Dreamlike distortions challenging reality, inspired by masters.",
    subStyles: [
      {
        name: "None",
        value: "none",
        description:
          'Use only the main style name as a prefix (e.g., "Surrealism style, ...").',
      },
      {
        name: "Fluid Distortion",
        description: "Melting forms and impossible blends.",
        value: "Fluid distortion surrealism, ",
      },
      {
        name: "Paradoxical Objects",
        description: "Everyday items in illogical arrangements.",
        value: "Paradoxical object surrealism, ",
      },
      {
        name: "Ernst Collage Surreal",
        description: "Layered fragments for uncanny narratives.",
        value: "Ernst collage surrealism, ",
      },
      {
        name: "Kahlo Autobiographical",
        description: "Personal symbolism with thorny motifs.",
        value: "Frida Kahlo style surrealism, ",
      },
      {
        name: "Biomorphic Surreal",
        description: "Organic, creature-like hybrids.",
        value: "Biomorphic surrealism, ",
      },
      {
        name: "Dreamlike Landscapes",
        description: "Floating islands and inverted gravity.",
        value: "Dreamlike surreal landscape, ",
      },
      {
        name: "Freudian Symbolic",
        description: "Subconscious icons like eyes and stairs.",
        value: "Freudian symbolic surrealism, ",
      },
      {
        name: "Pop Surrealism",
        description: "Whimsical grotesquery with candy colors.",
        value: "Pop surrealism, lowbrow art, ",
      },
      {
        name: "Hyper-Surreal",
        description: "Exaggerated distortions in vivid detail.",
        value: "Hyper-surrealism, ",
      },
      {
        name: "Eco-Surreal",
        description: "Nature twisted with human elements.",
        value: "Eco-surrealism, ",
      },
      {
        name: "Mechanical Surreal",
        description: "Machines fused with flesh.",
        value: "Mechanical surrealism, ",
      },
      {
        name: "Inner Vision",
        description: "Symbolic inner thoughts with blended realities.",
        value: "Inner vision surrealism, ",
      },
    ],
  },
  {
    name: "Cartoon/Illustration",
    description:
      "Exaggerated, narrative-driven visuals for fun and storytelling.",
    subStyles: [
      {
        name: "None",
        value: "none",
        description:
          'Use only the main style name as a prefix (e.g., "Cartoon/Illustration style, ...").',
      },
      {
        name: "Pixar 3D",
        description: "Polished, expressive CG with emotional arcs.",
        value: "Pixar 3D animation style, ",
      },
      {
        name: "Disney Classic",
        description: "Hand-drawn whimsy with fluid animation.",
        value: "Classic Disney animation style, ",
      },
      {
        name: "DreamWorks",
        description: "Edgy humor with detailed backgrounds.",
        value: "DreamWorks animation style, ",
      },
      {
        name: "Adventure Time",
        description: "Surreal candy lands with bold shapes.",
        value: "Adventure Time cartoon style, ",
      },
      {
        name: "Simpsons",
        description: "Yellow-skinned satire with clean outlines.",
        value: "The Simpsons cartoon style, ",
      },
      {
        name: "Rick and Morty",
        description: "Sci-fi absurdity with warped perspectives.",
        value: "Rick and Morty cartoon style, ",
      },
      {
        name: "Narrative Panel",
        description: "Sequential art with shaded storytelling.",
        value: "Narrative panel illustration style, ",
      },
      {
        name: "Whimsical Illustration",
        description: "Gentle, colorful drawings for light-hearted scenes.",
        value: "Whimsical illustration style, ",
      },
      {
        name: "Webtoon",
        description: "Vertical scroll with vibrant digital ink.",
        value: "Webtoon style, ",
      },
      {
        name: "Manhua Flow",
        description: "Dynamic lines and vibrant digital shading.",
        value: "Manhua flow illustration style, ",
      },
      {
        name: "Cover Art Focus",
        description: "Striking compositions for thematic highlights.",
        value: "Cover art illustration, ",
      },
    ],
  },
  {
    name: "Traditional Painting",
    description:
      "Emulates historical mediums like oils and watercolors for timeless appeal.",
    subStyles: [
      {
        name: "None",
        value: "none",
        description:
          'Use only the main style name as a prefix (e.g., "Traditional Painting style, ...").',
      },
      {
        name: "Impressionism",
        description: "Loose brushstrokes capturing light moments.",
        value: "Impressionist painting, ",
      },
      {
        name: "Renaissance",
        description: "Balanced compositions with chiaroscuro.",
        value: "Renaissance painting style, ",
      },
      {
        name: "Oil Painting",
        description: "Rich, layered textures with glazing.",
        value: "Oil painting, ",
      },
      {
        name: "Watercolor",
        description: "Translucent washes for ethereal softness.",
        value: "Watercolor painting, ",
      },
      {
        name: "Baroque",
        description: "Dramatic tenebrism and opulent details.",
        value: "Baroque painting, ",
      },
      {
        name: "Romanticism",
        description: "Emotional storms and heroic figures.",
        value: "Romanticism painting, ",
      },
      {
        name: "Pointillism",
        description: "Dot-based color mixing for vibrancy.",
        value: "Pointillism style, ",
      },
      {
        name: "Fresco",
        description: "Mural-like with aged plaster effects.",
        value: "Fresco painting style, ",
      },
      {
        name: "Encaustic",
        description: "Waxy, heated layers for luminous depth.",
        value: "Encaustic painting, ",
      },
      {
        name: "Acrylic",
        description: "Bold, matte finishes with quick drying.",
        value: "Acrylic painting, ",
      },
      {
        name: "Gouache",
        description: "Opaque vibrancy like matte poster paint.",
        value: "Gouache painting, ",
      },
      {
        name: "Sumi-e",
        description: "Minimalist ink washes for Zen simplicity.",
        value: "Sumi-e ink wash painting, ",
      },
      {
        name: "Oriental Brushwork",
        description: "Minimalist inks for balanced compositions.",
        value: "Oriental brushwork style, ",
      },
      {
        name: "Era Line Art",
        description: "Detailed etchings for historical depth.",
        value: "Era line art traditional, ",
      },
    ],
  },
  {
    name: "Digital Art",
    description: "Modern, tech-infused creations from pixels to vectors.",
    subStyles: [
      {
        name: "None",
        value: "none",
        description:
          'Use only the main style name as a prefix (e.g., "Digital Art style, ...").',
      },
      {
        name: "Vector Illustration",
        description: "Scalable, flat colors with clean paths.",
        value: "Vector illustration, ",
      },
      {
        name: "Blended Landscape",
        description: "Layered digital environments for immersive backdrops.",
        value: "Blended digital landscape, ",
      },
      {
        name: "Neon Glow",
        description: "Vibrant outlines with electric luminescence.",
        value: "Neon glow digital art, ",
      },
      {
        name: "Holographic",
        description: "Shimmering, 3D projections with refractions.",
        value: "Holographic style, ",
      },
      {
        name: "World-Building Sketch",
        description: "Conceptual layers for expansive scenes.",
        value: "World-building digital sketch, ",
      },
      {
        name: "Community Render",
        description: "Polished digital interpretations of characters.",
        value: "Community render digital style, ",
      },
    ],
  },
  {
    name: "Wuxia/Xianxia",
    description:
      "Eastern-inspired martial and spiritual themes with energy flows, ancient motifs, and harmonious or intense atmospheres.",
    subStyles: [
      {
        name: "None",
        value: "none",
        description:
          'Use only the main style name as a prefix (e.g., "Wuxia/Xianxia style, ...").',
      },
      {
        name: "Qi Energy Flow",
        description: "Subtle auras and internal power visualizations.",
        value: "Qi energy flow style, ",
      },
      {
        name: "Martial Grace",
        description: "Fluid poses and disciplined movements.",
        value: "Martial grace style, ",
      },
      {
        name: "Spiritual Realm",
        description: "Misty, elevated worlds with ethereal elements.",
        value: "Spiritual realm style, ",
      },
      {
        name: "Ancient Sect Aesthetic",
        description: "Traditional architecture and robed figures.",
        value: "Ancient sect aesthetic, ",
      },
      {
        name: "Demonic Shadow",
        description: "Darkened energies and mysterious silhouettes.",
        value: "Demonic shadow style, ",
      },
      {
        name: "Dynasty Elegance",
        description: "Silk textures and jade accents in historical tones.",
        value: "Dynasty elegance style, ",
      },
    ],
  },
  {
    name: "Romance",
    description:
      "Tender or passionate human connections with soft lighting, expressions, and atmospheric details.",
    subStyles: [
      {
        name: "None",
        value: "none",
        description:
          'Use only the main style name as a prefix (e.g., "Romance style, ...").',
      },
      {
        name: "Gentle Intimacy",
        description: "Close, affectionate moments with warm hues.",
        value: "Gentle intimacy romance style, ",
      },
      {
        name: "Urban Affection",
        description: "Modern settings with subtle romantic gestures.",
        value: "Urban affection style, ",
      },
      {
        name: "Enchanted Bond",
        description: "Magical elements enhancing emotional ties.",
        value: "Enchanted bond romance style, ",
      },
      {
        name: "Tension Build",
        description: "Subtle conflicts leading to connection.",
        value: "Tension build romance style, ",
      },
      {
        name: "Blushing Softness",
        description: "Delicate emotions with pastel accents.",
        value: "Blushing softness style, ",
      },
      {
        name: "Melancholic Yearning",
        description: "Poignant separations with evocative moods.",
        value: "Melancholic yearning romance art, ",
      },
    ],
  },
];

;// ./src/config/configManager.js
// --- IMPORTS ---







// --- INTERNAL HELPERS ---

/**
 * Normalize imported configuration for compatibility between legacy and current schemas.
 * Goals:
 * - Safely consume older exports (5.x / early 6.x) and newer variants
 * - Start from DEFAULTS as baseline
 * - Overlay imported configuration while:
 *      - Preserving valid known fields (including presets, negative prompts, enhancements)
 *      - Preserving unknown fields for forward compatibility
 *      - Avoiding invalid type overwrites
 * - Apply targeted fixes for:
 *      - Nested payloads (e.g. { config: { ... }, meta: { ... } })
 *      - Legacy/renamed keys
 *      - String vs number coercions for numeric settings
 * - Preserve sensitive values (API keys, tokens) when present and valid
 * @param {object} importedConfigRaw
 * @returns {object} normalized configuration object
 */
function normalizeImportedConfig(importedConfigRaw = {}) {
  try {
    let importedConfig = importedConfigRaw;

    // --- Support nested payloads: { config: { ... }, meta: { ... } } ---
    if (
      importedConfig &&
      typeof importedConfig === "object" &&
      !Array.isArray(importedConfig)
    ) {
      if (
        importedConfig.config &&
        typeof importedConfig.config === "object" &&
        !Array.isArray(importedConfig.config)
      ) {
        importedConfig = importedConfig.config;
      }
    }

    // Guard against non-object payloads after unwrapping
    if (
      !importedConfig ||
      typeof importedConfig !== "object" ||
      Array.isArray(importedConfig)
    ) {
      logger/* logError */.vV(
        "CONFIG_IMPORT",
        "Invalid configuration format after normalization; using DEFAULTS",
        {
          importedType: typeof importedConfig,
        },
      );
      return { ...defaults/* DEFAULTS */.z };
    }

    // Start from defaults (shallow clone - structure is flat enough for our use)
    const normalized = { ...defaults/* DEFAULTS */.z };

    // --- Overlay imported config with cautious merging ---
    // We:
    //  - Apply values for known keys when types are compatible or coercible
    //  - Keep unknown keys as-is for forward compatibility
    //  - Avoid breaking core structure with obviously invalid types

    const _coerceNumber = (value) => {
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
      }
      return undefined;
    };

    const _isBoolean = (value) => typeof value === "boolean";
    const isNonEmptyString = (v) =>
      typeof v === "string" && v.trim().length > 0;

    // First copy all keys from importedConfig, then selectively clean/fix known ones.
    Object.assign(normalized, importedConfig);

    // --- Backward compatibility and field normalization ---

    // Detect legacy enhancement template selection:
    // If enhancementTemplateSelected missing but enhancementTemplate present:
    if (!("enhancementTemplateSelected" in importedConfig)) {
      const importedTemplate = importedConfig.enhancementTemplate;
      let matchedKey = null;

      if (
        importedTemplate &&
        typeof importedTemplate === "string" &&
        defaults/* DEFAULTS */.z.enhancementPresets
      ) {
        for (const [key, preset] of Object.entries(
          defaults/* DEFAULTS */.z.enhancementPresets,
        )) {
          if (
            preset &&
            typeof preset === "object" &&
            preset.template === importedTemplate
          ) {
            matchedKey = key;
            break;
          }
        }
      }

      if (matchedKey) {
        normalized.enhancementTemplateSelected = matchedKey;
      } else {
        // Default to custom while preserving enhancementTemplate content
        normalized.enhancementTemplateSelected = "custom";
      }
    } else {
      // Validate enhancementTemplateSelected if present
      const sel = normalized.enhancementTemplateSelected;
      const presets = defaults/* DEFAULTS */.z.enhancementPresets || {};
      if (!sel || (sel !== "custom" && !presets[sel])) {
        normalized.enhancementTemplateSelected =
          defaults/* DEFAULTS */.z.enhancementTemplateSelected || "standard";
      }
    }

    // Ensure enhancement-related new tuning fields are populated when missing/invalid
    const ensureNumber = (value, fallback) =>
      typeof value === "number" && !isNaN(value) && value >= 0
        ? value
        : fallback;

    const ensureArray = (value, fallback) =>
      Array.isArray(value) ? value : fallback;

    const ensureLogLevel = (value, fallback) => {
      const allowed = ["debug", "info", "warn", "error"];
      return allowed.includes(value) ? value : fallback;
    };

    // enhancementMaxRetriesPerModel
    normalized.enhancementMaxRetriesPerModel = ensureNumber(
      importedConfig.enhancementMaxRetriesPerModel,
      defaults/* DEFAULTS */.z.enhancementMaxRetriesPerModel,
    );

    // enhancementRetryDelay
    normalized.enhancementRetryDelay = ensureNumber(
      importedConfig.enhancementRetryDelay,
      defaults/* DEFAULTS */.z.enhancementRetryDelay,
    );

    // enhancementModelsFallback
    normalized.enhancementModelsFallback = ensureArray(
      importedConfig.enhancementModelsFallback,
      defaults/* DEFAULTS */.z.enhancementModelsFallback,
    );

    // enhancementLogLevel
    normalized.enhancementLogLevel = ensureLogLevel(
      importedConfig.enhancementLogLevel,
      defaults/* DEFAULTS */.z.enhancementLogLevel,
    );

    // enhancementAlwaysFallback
    if (typeof importedConfig.enhancementAlwaysFallback === "boolean") {
      normalized.enhancementAlwaysFallback =
        importedConfig.enhancementAlwaysFallback;
    } else {
      normalized.enhancementAlwaysFallback = defaults/* DEFAULTS */.z.enhancementAlwaysFallback;
    }

    // enhancementPresets: if missing or invalid, fill from defaults
    if (
      !importedConfig.enhancementPresets ||
      typeof importedConfig.enhancementPresets !== "object"
    ) {
      normalized.enhancementPresets = defaults/* DEFAULTS */.z.enhancementPresets;
    }

    // --- Enhancement Template Selection & Legacy Preset Handling ---

    /**
     * Resolve a possibly legacy or invalid enhancement template key
     * to a safe, supported key.
     *
     * Rules:
     * - Allow 'standard', 'safety', 'artistic', 'technical', 'character', 'custom'
     * - Map legacy/removed defaults:
     *     - 'clean' -> 'safety'
     *     - 'environment' -> 'standard'
     *     - 'composition' -> 'technical'
     * - For any other unknown/non-string value, fall back to DEFAULTS.enhancementTemplateSelected or 'standard'
     */
    const resolveEnhancementTemplateKey = (rawKey) => {
      const validKeys = [
        "standard",
        "safety",
        "artistic",
        "technical",
        "character",
        "custom",
      ];
      if (typeof rawKey === "string" && rawKey.trim().length > 0) {
        const key = rawKey.trim();
        if (validKeys.includes(key)) {
          return key;
        }
        switch (key) {
          case "clean":
            return "safety";
          case "environment":
            return "standard";
          case "composition":
            return "technical";
          default:
            break;
        }
      }
      return defaults/* DEFAULTS */.z.enhancementTemplateSelected || "standard";
    };

    // Ensure enhancementTemplateSelected is normalized using resolver
    normalized.enhancementTemplateSelected = resolveEnhancementTemplateKey(
      normalized.enhancementTemplateSelected ||
        importedConfig.enhancementTemplateSelected,
    );

    // historyDays: default only when missing/invalid
    if (!("historyDays" in importedConfig)) {
      normalized.historyDays = defaults/* DEFAULTS */.z.historyDays ?? 30;
    } else {
      const parsedDays = parseInt(importedConfig.historyDays, 10);
      if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
        normalized.historyDays = defaults/* DEFAULTS */.z.historyDays ?? 30;
      } else {
        normalized.historyDays = parsedDays;
      }
    }

    // --- Sensitive / critical fields preservation ---

    // Direct provider API keys / tokens
    if (isNonEmptyString(importedConfig.aiHordeApiKey)) {
      normalized.aiHordeApiKey = importedConfig.aiHordeApiKey;
    }

    if (isNonEmptyString(importedConfig.pollinationsToken)) {
      normalized.pollinationsToken = importedConfig.pollinationsToken;
    }

    if (isNonEmptyString(importedConfig.enhancementApiKey)) {
      normalized.enhancementApiKey = importedConfig.enhancementApiKey;
    }

    if (isNonEmptyString(importedConfig.googleApiKey)) {
      normalized.googleApiKey = importedConfig.googleApiKey;
    }

    // OpenAI-compatible profiles: ensure structure and preserve apiKey-like fields
    if (
      importedConfig.openAICompatProfiles &&
      typeof importedConfig.openAICompatProfiles === "object"
    ) {
      const normalizedProfiles = {};
      for (const [url, profile] of Object.entries(
        importedConfig.openAICompatProfiles,
      )) {
        if (profile && typeof profile === "object") {
          const cloned = { ...profile };
          if (isNonEmptyString(profile.apiKey)) {
            cloned.apiKey = profile.apiKey;
          }
          normalizedProfiles[url] = cloned;
        }
      }
      normalized.openAICompatProfiles = normalizedProfiles;
    } else if (defaults/* DEFAULTS */.z.openAICompatProfiles) {
      normalized.openAICompatProfiles = defaults/* DEFAULTS */.z.openAICompatProfiles;
    }

    // Preserve active profile URL if valid string, otherwise use default
    if (isNonEmptyString(importedConfig.openAICompatActiveProfileUrl)) {
      normalized.openAICompatActiveProfileUrl =
        importedConfig.openAICompatActiveProfileUrl;
    } else {
      normalized.openAICompatActiveProfileUrl =
        defaults/* DEFAULTS */.z.openAICompatActiveProfileUrl;
    }

    // Preserve openAICompatModelManualInput boolean
    if (typeof importedConfig.openAICompatModelManualInput === "boolean") {
      normalized.openAICompatModelManualInput =
        importedConfig.openAICompatModelManualInput;
    } else if (typeof normalized.openAICompatModelManualInput !== "boolean") {
      normalized.openAICompatModelManualInput =
        defaults/* DEFAULTS */.z.openAICompatModelManualInput;
    }

    // Ensure we do not overwrite valid sensitive values with empty defaults
    // If normalized has empty string but imported had non-empty, restore imported
    const sensitiveKeys = [
      "aiHordeApiKey",
      "pollinationsToken",
      "enhancementApiKey",
      "googleApiKey",
    ];
    for (const key of sensitiveKeys) {
      if (
        isNonEmptyString(importedConfig[key]) &&
        !isNonEmptyString(normalized[key])
      ) {
        normalized[key] = importedConfig[key];
      }
    }

    return normalized;
  } catch (error) {
    logger/* logError */.vV("CONFIG_IMPORT", "Failed to normalize imported config", {
      error: error.message,
    });
    // On failure, fall back to DEFAULTS merged with raw imported config to avoid total breakage.
    try {
      const safeImported =
        importedConfigRaw &&
        typeof importedConfigRaw === "object" &&
        !Array.isArray(importedConfigRaw)
          ? importedConfigRaw
          : {};
      return { ...defaults/* DEFAULTS */.z, ...safeImported };
    } catch {
      return { ...defaults/* DEFAULTS */.z };
    }
  }
}

// --- PUBLIC FUNCTIONS ---

/**
 * Updates which provider settings are visible based on selected provider
 */
function updateVisibleSettings() {
  const provider = document.getElementById("nig-provider").value;
  document
    .querySelectorAll(".nig-provider-settings")
    .forEach((el) => (el.style.display = "none"));
  const settingsEl = document.getElementById(`nig-provider-${provider}`);
  if (settingsEl) {
    settingsEl.style.display = "block";
  }
}

/**
 * Updates sub-styles dropdown based on main style selection
 */
function updateSubStyles(mainStyleName) {
  const subStyleSelect = document.getElementById("nig-sub-style");
  const mainStyleDesc = document.getElementById("nig-main-style-desc");
  const subStyleDesc = document.getElementById("nig-sub-style-desc");

  const selectedCategory = PROMPT_CATEGORIES.find(
    (cat) => cat.name === mainStyleName,
  );
  mainStyleDesc.textContent = selectedCategory
    ? selectedCategory.description
    : "";
  subStyleSelect.innerHTML = "";

  if (selectedCategory && selectedCategory.subStyles.length > 0) {
    subStyleSelect.disabled = false;
    selectedCategory.subStyles.forEach((sub) => {
      const option = document.createElement("option");
      option.value = sub.value;
      option.textContent = sub.name;
      subStyleSelect.appendChild(option);
    });
    subStyleSelect.dispatchEvent(new Event("change"));
  } else {
    subStyleSelect.disabled = true;
    subStyleDesc.textContent = "";
  }
}

/**
 * Populates the configuration form with current settings
 */
async function populateConfigForm() {
  const config = await storage/* getConfig */.zj();

  // Provider selection
  document.getElementById("nig-provider").value = config.selectedProvider;

  // Style settings
  const mainStyleSelect = document.getElementById("nig-main-style");
  mainStyleSelect.innerHTML = "";
  PROMPT_CATEGORIES.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name;
    mainStyleSelect.appendChild(option);
  });
  mainStyleSelect.value = config.mainPromptStyle;
  updateSubStyles(config.mainPromptStyle);
  document.getElementById("nig-sub-style").value = config.subPromptStyle;
  document.getElementById("nig-sub-style").dispatchEvent(new Event("change"));

  // Custom style settings
  const customStyleEnable = document.getElementById("nig-custom-style-enable");
  const customStyleText = document.getElementById("nig-custom-style-text");
  customStyleEnable.checked = config.customStyleEnabled;
  customStyleText.value = config.customStyleText;
  customStyleText.disabled = !config.customStyleEnabled;

  // Enhancement settings
  document.getElementById("nig-enhancement-enabled").checked =
    config.enhancementEnabled;
  document.getElementById("nig-gemini-api-key").value =
    config.enhancementApiKey;
  document.getElementById("nig-enhancement-model").value =
    config.enhancementModel;

  // Enhancement template selection will be handled by enhancementPanel.js

  // Negative prompt settings
  document.getElementById("nig-enable-neg-prompt").checked =
    config.enableNegPrompt;
  document.getElementById("nig-global-neg-prompt").value =
    config.globalNegPrompt;

  // Provider-specific settings will be handled by models.js
  // This will be called after the provider forms are populated

  // History days setting
  const historyDays = await storage/* getHistoryDays */.Iy();
  document.getElementById("nig-history-clean-days").value = historyDays;

  updateVisibleSettings();
}

/**
 * Populates provider-specific form sections
 */
async function populateProviderForms(config) {
  // Import and call the populateProviderForms from models.js
  const { populateProviderForms: populateProviderFormsModels } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 189));
  await populateProviderFormsModels(config);
}

/**
 * Saves configuration from form to storage
 */
async function saveConfig() {
  // Style configuration
  await storage/* setConfigValue */.yJ(
    "mainPromptStyle",
    document.getElementById("nig-main-style").value,
  );
  await storage/* setConfigValue */.yJ(
    "subPromptStyle",
    document.getElementById("nig-sub-style").value,
  );
  await storage/* setConfigValue */.yJ(
    "customStyleEnabled",
    document.getElementById("nig-custom-style-enable").checked,
  );
  await storage/* setConfigValue */.yJ(
    "customStyleText",
    document.getElementById("nig-custom-style-text").value.trim(),
  );

  // Enhancement configuration (will be handled by enhancementPanel.js)
  await storage/* setConfigValue */.yJ(
    "enhancementEnabled",
    document.getElementById("nig-enhancement-enabled").checked,
  );
  await storage/* setConfigValue */.yJ(
    "enhancementApiKey",
    document.getElementById("nig-gemini-api-key").value.trim(),
  );
  await storage/* setConfigValue */.yJ(
    "enhancementModel",
    document.getElementById("nig-enhancement-model").value,
  );
  await storage/* setConfigValue */.yJ(
    "enhancementTemplate",
    document.getElementById("nig-enhancement-template").value.trim(),
  );
  await storage/* setConfigValue */.yJ(
    "enhancementTemplateSelected",
    document.getElementById("nig-enhancement-template-select").value,
  );

  // Negative prompt configuration
  await storage/* setConfigValue */.yJ(
    "enableNegPrompt",
    document.getElementById("nig-enable-neg-prompt").checked,
  );
  await storage/* setConfigValue */.yJ(
    "globalNegPrompt",
    document.getElementById("nig-global-neg-prompt").value.trim(),
  );

  // Provider selection
  await storage/* setConfigValue */.yJ(
    "selectedProvider",
    document.getElementById("nig-provider").value,
  );

  // Provider-specific configurations will be saved by their respective modules
  // (models.js for Pollinations, AI Horde, Google, and OpenAI compatible)

  // Alert will be handled by the main saveConfig function in configPanel.js
}

/**
 * Exports configuration to a JSON file
 */
async function exportConfig() {
  // Export the current normalized configuration.
  // storage.getConfig() already merges stored values over DEFAULTS to produce a flat config.
  const config = await storage/* getConfig */.zj();
  const configData = JSON.stringify(config, null, 2);
  const filename = `wtr-lab-image-generator-config-${new Date().toISOString().split("T")[0]}.json`;
  file/* downloadFile */.P(filename, configData, "application/json");
}

/**
 * Imports configuration from a JSON file
 */
async function handleImportFile(event) {
  const selectedFile = event.target.files[0];
  if (!selectedFile) {
    return;
  }

  try {
    const text = await selectedFile.text();
    const importedConfig = JSON.parse(text);

    if (
      !importedConfig ||
      typeof importedConfig !== "object" ||
      Array.isArray(importedConfig)
    ) {
      throw new Error("Invalid configuration format: root must be an object.");
    }

    if (confirm("This will overwrite all current settings. Continue?")) {
      const normalizedConfig = normalizeImportedConfig(importedConfig);

      try {
        // Persist all normalized keys to storage
        await Promise.all(
          Object.keys(normalizedConfig).map((key) =>
            storage/* setConfigValue */.yJ(key, normalizedConfig[key]),
          ),
        );

        // Retrieve the fully merged config (storage over DEFAULTS)
        const updatedConfig = await storage/* getConfig */.zj();

        // --- Reactive UI synchronization (no panel reopen required) ---

        // 1) Core config + styling + history
        try {
          await populateConfigForm();
        } catch (uiError) {
          logger/* logError */.vV(
            "CONFIG_IMPORT",
            "Failed to update core configuration form after import",
            {
              error: uiError?.message || uiError,
            },
          );
        }

        // 2) Provider-specific sections (Pollinations, AI Horde, Google, OpenAICompat)
        try {
          await (0,models.populateProviderForms)(updatedConfig);
        } catch (uiError) {
          logger/* logError */.vV(
            "CONFIG_IMPORT",
            "Failed to update provider configuration forms after import",
            {
              error: uiError?.message || uiError,
            },
          );
        }

        // 3) Enhancement panel (Gemini / enhancement settings)
        try {
          if (typeof populateEnhancementSettings === "function") {
            await populateEnhancementSettings(updatedConfig);
          }
        } catch (uiError) {
          logger/* logError */.vV(
            "CONFIG_IMPORT",
            "Failed to update enhancement settings after import",
            {
              error: uiError?.message || uiError,
            },
          );
        }

        // 4) Enhancement UI state in styling tab (provider-aware)
        try {
          if (typeof updateEnhancementUI === "function") {
            const provider =
              updatedConfig.selectedProvider || defaults/* DEFAULTS */.z.selectedProvider;
            updateEnhancementUI(provider, updatedConfig);
          }
        } catch (uiError) {
          logger/* logError */.vV(
            "CONFIG_IMPORT",
            "Failed to update enhancement UI state after import",
            {
              error: uiError?.message || uiError,
            },
          );
        }

        alert(
          "Configuration imported successfully! All visible settings have been updated.",
        );
      } catch (persistError) {
        // If persisting or UI sync fails in a critical way, surface a clear error
        logger/* logError */.vV(
          "CONFIG_IMPORT",
          "Failed during configuration import application",
          {
            error: persistError?.message || persistError,
          },
        );
        alert(
          "Configuration import failed while applying settings. " +
            "Your previous configuration is still in effect. " +
            `Details: ${persistError?.message || persistError}`,
        );
      }
    }
  } catch (error) {
    // Robust error handling for:
    // - Invalid JSON
    // - Non-object / malformed structures
    // - Unexpected runtime errors
    logger/* logError */.vV("CONFIG_IMPORT", "Failed to import configuration", {
      error: error?.message || error,
    });
    alert(`Failed to import configuration: ${error?.message || error}`);
  } finally {
    // Always clear file input to allow re-import attempts
    event.target.value = "";
  }
}

;// ./src/components/historyManager.js
// --- IMPORTS ---

// import { filterExpiredLinks } from "../utils/linkValidator.js"; // Not currently used

// --- PUBLIC FUNCTIONS ---

/**
 * Populates the history tab with the user's generation history
 */
async function populateHistoryTab() {
  const historyList = document.getElementById("nig-history-list");
  // Use the new getFilteredHistory function to respect the configured days setting
  const history = await storage/* getFilteredHistory */.A5();

  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = "<li>No history yet.</li>";
    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");
    li.className = "nig-history-item";

    const safePrompt =
      typeof item.prompt === "string"
        ? item.prompt
        : item && typeof item === "object" && typeof item.prompt === "string"
          ? item.prompt
          : "";

    const providerInfo =
      item && item.provider ? `<strong>${item.provider}</strong>` : "";
    const modelInfo = item && item.model ? `(${item.model})` : "";

    const metaText = new Date(item.date).toLocaleString();
    const metaHtml = `<div class="nig-history-meta"><small>${metaText} - ${providerInfo} ${modelInfo}</small></div>`;

    // Prompt display: up to 2 lines, full available width, ellipsis beyond 2 lines.
    const promptHtml = safePrompt
      ? `<div class="nig-history-prompt" title="${safePrompt.replace(/"/g, '"')}">${safePrompt}</div>`
      : '<div class="nig-history-prompt nig-history-prompt-empty">No prompt available</div>';

    li.innerHTML = `
            ${metaHtml}
            ${promptHtml}
        `;

    // Create the link element separately to add the event listener
    const viewLink = document.createElement("a");
    viewLink.href = "#"; // Use a non-navigating href
    viewLink.textContent = "View Generated Image";

    viewLink.addEventListener("click", (e) => {
      e.preventDefault();
      // Use unified modal for all image types (both base64 and URL)
      Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 642)).then((module) => {
        if (typeof module.show === "function") {
          module.show(
            [item.url],
            safePrompt || "No prompt available",
            item.provider,
            item.model,
          );
        }
      });
    });

    li.appendChild(viewLink);
    historyList.appendChild(li);
  });
}

/**
 * Cleans up old history entries based on the specified number of days
 */
async function cleanHistory() {
  const daysInput = document.getElementById("nig-history-clean-days").value;
  const days = parseInt(daysInput);

  // Validate the input
  if (isNaN(days) || days < 1 || days > 365) {
    alert("Please enter a valid number of days (1-365).");
    return;
  }

  // Show loading state
  const cleanButton = document.getElementById("nig-history-clean-btn");

  if (cleanButton) {
    // Store the original innerHTML to preserve the icon structure
    const originalContent = cleanButton.innerHTML;
    cleanButton.disabled = true;
    cleanButton.innerHTML = "Cleaning...";

    try {
      // Save the days setting
      await storage/* setHistoryDays */.qH(days);

      // Create progress callback for link validation
      const progressCallback = (progress) => {
        cleanButton.innerHTML = `<span class="material-symbols-outlined">cleaning_services</span> Cleaning... (${progress.completed}/${progress.total} links checked)`;
      };

      // Use the enhanced cleanHistoryEnhanced function
      const result = await storage/* cleanHistoryEnhanced */.qg(progressCallback);

      // Show detailed feedback
      let message = "History cleaned successfully!\n\n";

      if (result.expiredLinksRemoved > 0) {
        message += `• Removed ${result.expiredLinksRemoved} expired/broken image links\n`;
      }

      if (result.oldEntriesRemoved > 0) {
        message += `• Removed ${result.oldEntriesRemoved} old entries\n`;
      }

      if (result.expiredLinksRemoved === 0 && result.oldEntriesRemoved === 0) {
        message += "• No items needed to be removed";
      }

      if (result.totalLinksChecked > 0) {
        message += `\n\nChecked ${result.totalLinksChecked} image links for validity.`;
      }

      message += `\n\nTotal removed: ${result.totalRemoved} items`;
      message += `\nRemaining entries: ${result.finalHistoryCount}`;

      alert(message);

      await populateHistoryTab();
    } catch (error) {
      console.error("Failed to clean history:", error);
      alert("Failed to clean history. Please try again.");
    } finally {
      // Restore button state - restore the complete original structure
      cleanButton.disabled = false;
      cleanButton.innerHTML = originalContent;
    }
  }
}

/**
 * Auto-saves history days setting when the input changes
 */
async function handleHistoryDaysChange(event) {
  const days = parseInt(event.target.value);
  if (!isNaN(days) && days >= 1 && days <= 365) {
    try {
      await storage/* setHistoryDays */.qH(days);
      // History days saved; no console output to respect logging toggle
      // Refresh the history tab to reflect the new setting
      const panelElement = document.getElementById("nig-config-panel");
      if (
        panelElement &&
        panelElement
          .querySelector('.nig-tab[data-tab="history"]')
          .classList.contains("active")
      ) {
        await populateHistoryTab();
      }
    } catch (error) {
      console.error("Failed to auto-save history days setting:", error);
    }
  }
}

;// ./src/components/configPanelEvents.js
// --- IMPORTS ---










/**
 * Initialize show/hide toggles for all password-like API key fields.
 * This is UI-only and does not affect storage, validation, or submission behavior.
 */
function initializePasswordVisibilityToggles(panelElement) {
  try {
    const toggles = panelElement.querySelectorAll(".nig-password-toggle");
    if (!toggles || toggles.length === 0) {
      // Graceful no-op: ensure keys remain hidden by default.
      return;
    }

    toggles.forEach((toggleBtn) => {
      // Avoid double-binding if panel is re-initialized.
      if (toggleBtn.dataset.nigToggleBound === "true") {
        return;
      }
      toggleBtn.dataset.nigToggleBound = "true";

      toggleBtn.addEventListener("click", (event) => {
        try {
          event.preventDefault();
          event.stopPropagation();

          const targetId = toggleBtn.getAttribute("data-target");
          if (!targetId) {
            return;
          }

          const input = panelElement.querySelector(`#${CSS.escape(targetId)}`);
          if (!input) {
            return;
          }

          const isCurrentlyHidden = input.type === "password";
          input.type = isCurrentlyHidden ? "text" : "password";

          const icon = toggleBtn.querySelector(".material-symbols-outlined");
          if (icon) {
            icon.textContent = isCurrentlyHidden
              ? "visibility"
              : "visibility_off";
          }

          toggleBtn.setAttribute(
            "aria-pressed",
            isCurrentlyHidden ? "true" : "false",
          );
          toggleBtn.setAttribute(
            "aria-label",
            isCurrentlyHidden ? "Hide API key" : "Show API key",
          );
        } catch (err) {
          // Safety: log but do not break other behaviors.
          try {
            logger/* logError */.vV("UI", "Failed to toggle API key visibility", {
              error: err.message,
            });
          } catch (_) {
            // Swallow if logger itself is unavailable in this context.
          }
        }
      });
    });
  } catch (error) {
    // If anything unexpected happens, API keys remain masked by default.
    try {
      logger/* logError */.vV("UI", "Failed to initialize API key visibility toggles", {
        error: error.message,
      });
    } catch (_) {
      // Swallow secondary errors.
    }
  }
}

// --- PUBLIC FUNCTIONS ---

/**
 * Sets up all the tab functionality event listeners
 */
function setupTabEventListeners(panelElement) {
  // Initialize password visibility toggles once panel DOM is ready
  initializePasswordVisibilityToggles(panelElement);

  panelElement.querySelectorAll(".nig-tab").forEach((tab) => {
    tab.addEventListener("click", async () => {
      panelElement
        .querySelectorAll(".nig-tab, .nig-tab-content")
        .forEach((el) => el.classList.remove("active"));
      tab.classList.add("active");
      panelElement
        .querySelector(`#nig-${tab.dataset.tab}-tab`)
        .classList.add("active");
      if (tab.dataset.tab === "history") {
        await populateHistoryTab();
        panelElement.querySelector("#nig-save-btn").style.display = "none";
      } else {
        panelElement.querySelector("#nig-save-btn").style.display = "block";
      }
    });
  });
}

/**
 * Sets up provider settings event listeners
 */
function setupProviderEventListeners(panelElement) {
  // Provider selection change
  panelElement
    .querySelector("#nig-provider")
    .addEventListener("change", (_e) => {
      updateVisibleSettings();
    });

  // Google fetch models
  panelElement
    .querySelector("#nig-google-fetch-models")
    .addEventListener("click", async () => {
      const apiKey = document.getElementById("nig-google-api-key").value.trim();
      if (!apiKey) {
        alert("Please enter a Gemini API Key first.");
        return;
      }

      const btn = document.getElementById("nig-google-fetch-models");
      const originalText = btn.textContent;
      btn.textContent = "Fetching...";
      btn.disabled = true;

      try {
        const fetchedModels = await models/* fetchGoogleModels */.cG(apiKey);
        populateGoogleModelsSelect(fetchedModels);
        alert(`Successfully fetched ${fetchedModels.length} models.`);
      } catch (error) {
        alert(`Failed to fetch models: ${error.message}`);
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
}

/**
 * Sets up OpenAI Compatible functionality event listeners
 */
function setupOpenAIEventListeners(panelElement) {
  // OpenAI Compatible fetch models
  panelElement
    .querySelector("#nig-openai-compat-fetch-models")
    .addEventListener("click", () => {
      models/* fetchOpenAICompatModels */.VM();
    });

  // OpenAI Compatible profile selection
  panelElement
    .querySelector("#nig-openai-compat-profile-select")
    .addEventListener("change", models/* loadSelectedOpenAIProfile */.tH);

  // OpenAI Compatible delete profile
  panelElement
    .querySelector("#nig-openai-compat-delete-profile")
    .addEventListener("click", models/* deleteSelectedOpenAIProfile */.CB);

  // Switch to manual input mode
  panelElement
    .querySelector("#nig-openai-compat-switch-to-manual")
    .addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(
        "nig-openai-model-container-select",
      ).style.display = "none";
      document.getElementById(
        "nig-openai-model-container-manual",
      ).style.display = "block";
    });

  // Switch back to select mode
  panelElement
    .querySelector("#nig-openai-compat-switch-to-select")
    .addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(
        "nig-openai-model-container-select",
      ).style.display = "block";
      document.getElementById(
        "nig-openai-model-container-manual",
      ).style.display = "none";
    });
}

/**
 * Sets up utility function event listeners
 */
function setupUtilityEventListeners(panelElement) {
  // Export configuration
  panelElement
    .querySelector("#nig-export-btn")
    .addEventListener("click", exportConfig);

  // Import configuration
  panelElement
    .querySelector("#nig-import-file")
    .addEventListener("change", handleImportFile);

  // History cleanup
  panelElement
    .querySelector("#nig-history-clean-btn")
    .addEventListener("click", cleanHistory);

  // Auto-save history days setting when input changes
  panelElement
    .querySelector("#nig-history-clean-days")
    .addEventListener("change", handleHistoryDaysChange);

  // Clear cache
  panelElement
    .querySelector("#nig-clear-cache-btn")
    .addEventListener("click", () => cache/* clearCachedModels */.WN());
}

/**
 * Sets up logging functionality event listeners
 */
function setupLoggingEventListeners(panelElement) {
  // Toggle console logging and enhancement logs
  panelElement
    .querySelector("#nig-toggle-logging-btn")
    .addEventListener("click", async () => {
      const currentState = await storage/* getConfigValue */.Ct("loggingEnabled");
      const newState = !currentState;
      await storage/* setConfigValue */.yJ("loggingEnabled", newState);
      await logger/* updateLoggingStatus */.RJ();
      await logger/* loadEnhancementLogHistory */.xx();
      alert(
        `Debug Console & Enhancement Logs are now ${newState ? "ENABLED" : "DISABLED"}.`,
      );
    });

  // View enhancement logs
  panelElement
    .querySelector("#nig-view-enhancement-logs-btn")
    .addEventListener("click", async () => {
      const logs = await logger/* getEnhancementLogHistory */.$f();
      if (logs.length === 0) {
        alert(
          "No enhancement logs found. Enhancement logging is disabled or no enhancement operations have been performed yet.",
        );
        return;
      }
      // Create logs modal
      const logModal = document.createElement("div");
      logModal.className = "nig-modal-overlay";
      logModal.innerHTML = `
            <div class="nig-modal-content">
                <span class="nig-close-btn">&times;</span>
                <h2>Enhancement Operation Logs</h2>
                <p>Detailed logs of prompt enhancement operations with timestamps and performance data.</p>
                <div style="max-height: 400px; overflow-y: auto; background: var(--nig-color-bg-tertiary); border-radius: var(--nig-radius-md); padding: var(--nig-space-lg); margin: var(--nig-space-lg) 0;">
                    <div id="nig-enhancement-logs-display"></div>
                </div>
            </div>
        `;
      document.body.appendChild(logModal);

      const logsDisplay = logModal.querySelector(
        "#nig-enhancement-logs-display",
      );
      logs.slice(0, 50).forEach((log) => {
        // Format the log entry similar to the original formatLogEntry function
        const time = new Date(log.timestamp || log.time).toLocaleString();
        const levelColors = {
          ERROR: "#ef4444",
          WARN: "#f59e0b",
          INFO: "#6366f1",
          DEBUG: "#8b5cf6",
        };
        const color = levelColors[log.level?.toUpperCase()] || "#6366f1";

        const logEntry = document.createElement("div");
        logEntry.style.cssText = `
                padding: var(--nig-space-sm) 0;
                border-bottom: 1px solid var(--nig-color-border);
                font-family: 'Fira Code', monospace;
                font-size: var(--nig-font-size-xs);
            `;
        logEntry.innerHTML = `
                <div style="display: flex; align-items: center; gap: var(--nig-space-sm); margin-bottom: var(--nig-space-xs);">
                    <span style="color: ${color}; font-weight: 600;">[${log.level?.toUpperCase() || "INFO"}]</span>
                    <span style="color: var(--nig-color-text-muted); font-size: var(--nig-font-size-xs);">${time}</span>
                    <span style="color: var(--nig-color-accent-primary); font-weight: 500;">[${log.category || "LOG"}]</span>
                </div>
                <div style="color: var(--nig-color-text-primary); margin-bottom: var(--nig-space-xs);">${log.message || "No message"}</div>
                ${log.data ? `<pre style="color: var(--nig-color-text-secondary); font-size: var(--nig-font-size-xs); background: var(--nig-color-bg-primary); padding: var(--nig-space-sm); border-radius: var(--nig-radius-sm); margin: 0; overflow-x: auto;">${JSON.stringify(log.data, null, 2)}</pre>` : ""}
            `;
        logsDisplay.appendChild(logEntry);
      });

      logModal
        .querySelector(".nig-close-btn")
        .addEventListener("click", () => logModal.remove());
    });

  // Clear enhancement logs
  panelElement
    .querySelector("#nig-clear-enhancement-logs-btn")
    .addEventListener("click", async () => {
      const logs = await logger/* getEnhancementLogHistory */.$f();
      if (logs.length === 0) {
        alert("No enhancement logs to clear.");
        return;
      }
      if (
        confirm(
          `Are you sure you want to clear all ${logs.length} enhancement logs? This action cannot be undone.`,
        )
      ) {
        logger/* clearEnhancementLogs */.X();
        alert("All enhancement logs have been cleared.");
      }
    });
}

/**
 * Sets up style functionality event listeners
 */
function setupStyleEventListeners(panelElement) {
  // Main style change
  panelElement
    .querySelector("#nig-main-style")
    .addEventListener("change", (e) => {
      updateSubStyles(e.target.value);
    });

  // Sub style change
  panelElement
    .querySelector("#nig-sub-style")
    .addEventListener("change", () => {
      const subStyle = panelElement.querySelector("#nig-sub-style").value;
      const subStyleDesc = document.getElementById("nig-sub-style-desc");
      const selectedCategory = PROMPT_CATEGORIES.find(
        (cat) =>
          cat.name === panelElement.querySelector("#nig-main-style").value,
      );
      const selectedSubStyle = selectedCategory
        ? selectedCategory.subStyles.find((sub) => sub.value === subStyle)
        : null;
      subStyleDesc.textContent = selectedSubStyle
        ? selectedSubStyle.description
        : "";
    });
}

/**
 * Sets up custom style toggle event listeners
 */
function setupCustomStyleEventListeners(panelElement) {
  const customStyleEnable = panelElement.querySelector(
    "#nig-custom-style-enable",
  );
  const customStyleText = panelElement.querySelector("#nig-custom-style-text");

  customStyleEnable.addEventListener("change", () => {
    customStyleText.disabled = !customStyleEnable.checked;
  });
}

/**
 * Sets up provider change listener for enhancement UI
 */
function setupProviderEnhancementListener(panelElement) {
  panelElement
    .querySelector("#nig-provider")
    .addEventListener("change", async (e) => {
      const newProvider = e.target.value;
      const config = await storage/* getConfig */.zj();
      updateEnhancementUI(newProvider, config);
    });
}

;// ./src/components/configPanelTemplate.js
// --- PUBLIC FUNCTIONS ---

/**
 * Gets the complete HTML template for the configuration panel
 */
function getConfigPanelHTML() {
  return `
        <div class="nig-modal-content">
            <span class="nig-close-btn">&times;</span>
            <h2>Image Generator Configuration</h2>
            <div class="nig-tabs">
                <div class="nig-tab active" data-tab="config">Configuration</div>
                <div class="nig-tab" data-tab="styling">Prompt Styling</div>
                <div class="nig-tab" data-tab="history">History</div>
                <div class="nig-tab" data-tab="utilities">Utilities</div>
            </div>
            <div id="nig-config-tab" class="nig-tab-content active">
                <div class="nig-config-grid">
                    <div class="nig-config-section">
                        <div class="nig-form-group">
                            <label for="nig-provider">Image Provider</label>
                            <select id="nig-provider">
                                <option value="Pollinations">Pollinations.ai (Free, Simple)</option>
                                <option value="AIHorde">AI Horde (Free, Advanced)</option>
                                <option value="OpenAICompat">OpenAI Compatible (Custom)</option>
                                <option value="Google">Google Imagen (Requires Billed Account)</option>
                            </select>
                        </div>
                    </div>

                    <div class="nig-provider-container">
                        <div id="nig-provider-Pollinations" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3><img src="https://raw.githubusercontent.com/pollinations/pollinations/eea264f608e9393e69631eea5e00e9ecf6e1836e/shared/assets/logo.svg" alt="Pollinations" style="height: 20px; width: 20px; vertical-align: middle; margin-right: 8px;"> Pollinations.ai Settings</h3>
                                <p>Fast, simple image generation with advanced model options</p>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-pollinations-model">Model</label>
                                <select id="nig-pollinations-model">
                                    <option>Loading models...</option>
                                </select>
                            </div>
                            <div class="nig-form-group nig-form-group-inline">
                                <label>Dimensions (Width × Height)</label>
                                <div>
                                    <label for="nig-pollinations-width">Width</label>
                                    <input type="number" id="nig-pollinations-width" min="64" max="2048" step="64">
                                </div>
                                <div>
                                    <label for="nig-pollinations-height">Height</label>
                                    <input type="number" id="nig-pollinations-height" min="64" max="2048" step="64">
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-pollinations-seed">Seed (optional)</label>
                                <input type="text" id="nig-pollinations-seed" placeholder="Leave blank for random">
                            </div>
                            <div class="nig-form-group">
                                <label>Options</label>
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" id="nig-pollinations-enhance">Enhance Prompt</label>
                                    <label><input type="checkbox" id="nig-pollinations-safe">Safe Mode (NSFW Filter)</label>
                                    <label><input type="checkbox" id="nig-pollinations-nologo">No Logo (Registered Users)</label>
                                    <label><input type="checkbox" id="nig-pollinations-private">Private (Won't appear in feed)</label>
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-pollinations-token">API Token (Optional)</label>
                                <div class="nig-password-wrapper">
                                    <input type="password" id="nig-pollinations-token" placeholder="Enter token for premium models">
                                    <button
                                        type="button"
                                        class="nig-password-toggle"
                                        data-target="nig-pollinations-token"
                                        aria-label="Show API token"
                                        aria-pressed="false"
                                    >
                                        <span class="material-symbols-outlined" aria-hidden="true">visibility_off</span>
                                    </button>
                                </div>
                                <small class="nig-hint">Get a token from <a href="https://auth.pollinations.ai" target="_blank" class="nig-api-prompt-link">auth.pollinations.ai</a> for higher rate limits and access to restricted models.</small>
                            </div>
                        </div>

                        <div id="nig-provider-AIHorde" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3><img src="https://stablehorde.net/assets/img/logo.png" alt="AI Horde" style="height: 20px; width: 20px; vertical-align: middle; margin-right: 8px;"> AI Horde Settings</h3>
                                <p>Community-powered generation with extensive customization</p>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-horde-api-key">AI Horde API Key</label>
                                <div class="nig-password-wrapper">
                                    <input type="password" id="nig-horde-api-key" placeholder="Defaults to '0000000000'">
                                    <button
                                        type="button"
                                        class="nig-password-toggle"
                                        data-target="nig-horde-api-key"
                                        aria-label="Show AI Horde API key"
                                        aria-pressed="false"
                                    >
                                        <span class="material-symbols-outlined" aria-hidden="true">visibility_off</span>
                                    </button>
                                </div>
                                <small>Use anonymous key or get your own from <a href="https://aihorde.net/" target="_blank" class="nig-api-prompt-link">AI Horde</a> for higher priority.</small>
                            </div>
                            <div class="nig-provider-controls">
                                <div class="nig-form-group">
                                    <label for="nig-horde-model">Model</label>
                                    <select id="nig-horde-model">
                                        <option>Loading models...</option>
                                    </select>
                                </div>
                                <div class="nig-form-group">
                                    <label for="nig-horde-sampler">Sampler</label>
                                    <select id="nig-horde-sampler">
                                        <option value="k_dpmpp_2m">DPM++ 2M</option>
                                        <option value="k_euler_a">Euler A</option>
                                        <option value="k_euler">Euler</option>
                                        <option value="k_lms">LMS</option>
                                        <option value="k_heun">Heun</option>
                                        <option value="k_dpm_2">DPM 2</option>
                                        <option value="k_dpm_2_a">DPM 2 A</option>
                                        <option value="k_dpmpp_2s_a">DPM++ 2S A</option>
                                        <option value="k_dpmpp_sde">DPM++ SDE</option>
                                    </select>
                                </div>
                            </div>
                            <div class="nig-form-grid">
                                <div class="nig-form-group">
                                    <label for="nig-horde-steps">Steps</label>
                                    <input type="number" id="nig-horde-steps" min="10" max="50" step="1">
                                    <small class="nig-hint">More steps = more detail, but slower.</small>
                                </div>
                                <div class="nig-form-group">
                                    <label for="nig-horde-cfg">CFG Scale</label>
                                    <input type="number" id="nig-horde-cfg" min="1" max="20" step="0.5">
                                    <small class="nig-hint">How strictly to follow the prompt.</small>
                                </div>
                            </div>
                            <div class="nig-form-grid">
                                <div class="nig-form-group">
                                    <label for="nig-horde-width">Width</label>
                                    <input type="number" id="nig-horde-width" min="64" max="2048" step="64">
                                </div>
                                <div class="nig-form-group">
                                    <label for="nig-horde-height">Height</label>
                                    <input type="number" id="nig-horde-height" min="64" max="2048" step="64">
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-horde-seed">Seed (optional)</label>
                                <input type="text" id="nig-horde-seed" placeholder="Leave blank for random">
                            </div>
                            <div class="nig-form-group">
                                <label>Post-Processing</label>
                                <small class="nig-hint">Improves faces. Use only if generating people.</small>
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" name="nig-horde-post" value="GFPGAN">GFPGAN</label>
                                    <label><input type="checkbox" name="nig-horde-post" value="CodeFormers">CodeFormers</label>
                                </div>
                            </div>
                        </div>

                        <div id="nig-provider-Google" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3><img src="https://upload.wikimedia.org/wikipedia/commons/1/1d/Google_Gemini_icon_2025.svg" alt="Google Imagen" style="height: 20px; width: 20px; vertical-align: middle; margin-right: 8px;"> Google Imagen Settings</h3>
                                <p>High-quality generation powered by Google's advanced AI</p>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-google-api-key">Gemini API Key</label>
                                <div class="nig-password-wrapper">
                                    <input type="password" id="nig-google-api-key">
                                    <button
                                        type="button"
                                        class="nig-password-toggle"
                                        data-target="nig-google-api-key"
                                        aria-label="Show Gemini API key"
                                        aria-pressed="false"
                                    >
                                        <span class="material-symbols-outlined" aria-hidden="true">visibility_off</span>
                                    </button>
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-model">Imagen Model</label>
                                <div class="nig-form-group-inline">
                                    <select id="nig-model" style="width: 100%;">
                                        <option value="">Enter API Key and fetch...</option>
                                    </select>
                                    <button id="nig-google-fetch-models" class="nig-fetch-models-btn">Fetch</button>
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-num-images">Number of Images (1-4)</label>
                                <input type="number" id="nig-num-images" min="1" max="4" step="1">
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-image-size">Image Size</label>
                                <select id="nig-image-size">
                                    <option value="1024">1K</option>
                                    <option value="2048">2K</option>
                                </select>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-aspect-ratio">Aspect Ratio</label>
                                <select id="nig-aspect-ratio">
                                    <option value="1:1">1:1</option>
                                    <option value="3:4">3:4</option>
                                    <option value="4:3">4:3</option>
                                    <option value="9:16">9:16</option>
                                    <option value="16:9">16:9</option>
                                </select>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-person-gen">Person Generation</label>
                                <select id="nig-person-gen">
                                    <option value="dont_allow">Don't Allow</option>
                                    <option value="allow_adult">Allow Adults</option>
                                    <option value="allow_all">Allow All</option>
                                </select>
                            </div>
                        </div>

                        <div id="nig-provider-OpenAICompat" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg" alt="OpenAI" style="height: 20px; width: 20px; vertical-align: middle; margin-right: 8px;"> OpenAI Compatible Settings</h3>
                                <p>Connect to any OpenAI-compatible API endpoint</p>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-profile-select">Saved Profiles</label>
                                <div class="nig-form-group-inline">
                                    <select id="nig-openai-compat-profile-select"></select>
                                    <button id="nig-openai-compat-delete-profile" class="nig-delete-btn">Delete</button>
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-base-url">Base URL</label>
                                <input type="text" id="nig-openai-compat-base-url" placeholder="e.g., https://api.example.com/v1">
                                <small class="nig-hint">For a list of free public providers, check out the <a href="https://github.com/zukixa/cool-ai-stuff" target="_blank" class="nig-api-prompt-link">cool-ai-stuff</a> repository.</small>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-api-key">API Key</label>
                                <div class="nig-password-wrapper">
                                    <input type="password" id="nig-openai-compat-api-key">
                                    <button
                                        type="button"
                                        class="nig-password-toggle"
                                        data-target="nig-openai-compat-api-key"
                                        aria-label="Show OpenAI compatible API key"
                                        aria-pressed="false"
                                    >
                                        <span class="material-symbols-outlined" aria-hidden="true">visibility_off</span>
                                    </button>
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-model">Model</label>
                                <div id="nig-openai-model-container-select">
                                    <div class="nig-form-group-inline">
                                        <select id="nig-openai-compat-model" style="width: 100%;">
                                            <option>Enter URL/Key and fetch...</option>
                                        </select>
                                        <button id="nig-openai-compat-fetch-models" class="nig-fetch-models-btn">Fetch</button>
                                    </div>
                                    <small class=" nig-hint">If fetching fails or your model isn't listed, <a href="#" id="nig-openai-compat-switch-to-manual" class="nig-api-prompt-link">switch to manual input</a>.</small>
                                </div>
                                <div id="nig-openai-model-container-manual" style="display: none;">
                                    <input type="text" id="nig-openai-compat-model-manual" placeholder="e.g., dall-e-3">
                                    <small class=" nig-hint">Manually enter the model name. <a href="#" id="nig-openai-compat-switch-to-select" class="nig-api-prompt-link">Switch back to fetched list</a>.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="nig-styling-tab" class="nig-tab-content">
                <div class="nig-styling-container">
                    <div class="nig-styling-intro">
                        <p>Select a style to automatically add it to the beginning of every prompt. This helps maintain a consistent look across all providers.</p>
                    </div>

                    <div class="nig-style-grid">
                        <div class="nig-style-section">
                            <div class="nig-form-group">
                                <label for="nig-main-style">Main Style</label>
                                <select id="nig-main-style"></select>
                                <small id="nig-main-style-desc" class="nig-hint"></small>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-sub-style">Sub-Style</label>
                                <select id="nig-sub-style"></select>
                                <small id="nig-sub-style-desc" class="nig-hint"></small>
                            </div>
                        </div>

                        <div class="nig-style-section">
                            <div class="nig-section-header">
                                <h4>
                                    <span class="material-symbols-outlined">auto_awesome</span>
                                    AI Prompt Enhancement
                                    <span class="nig-enhancement-status" id="nig-enhancement-status">
                                        <span class="nig-status-indicator" id="nig-status-indicator"></span>
                                        <span id="nig-status-text">Enhancement Disabled</span>
                                    </span>
                                </h4>
                            </div>

                            <div class="nig-enhancement-content">
                                <div class="nig-form-group">
                                    <div class="nig-checkbox-group">
                                        <label><input type="checkbox" id="nig-enhancement-enabled">Enable AI Prompt Enhancement</label>
                                    </div>
                                    <small class="nig-hint">Uses AI to automatically enhance prompts for better results. Provider enhancement takes priority when available.</small>
                                </div>

                                <div class="nig-provider-priority-info" id="nig-provider-priority-info" style="display: none;">
                                    <div class="nig-priority-header">
                                        <span class="material-symbols-outlined">priority_high</span>
                                        Provider Enhancement Active
                                    </div>
                                    <p id="nig-priority-message">Pollinations AI enhancement is enabled and will be used instead of external AI enhancement.</p>
                                    <button class="nig-override-btn" id="nig-override-provider">Force Use External AI</button>
                                </div>

                                <div class="nig-enhancement-settings disabled" id="nig-enhancement-settings">
                                    <div class="nig-form-group">
                                        <label for="nig-gemini-api-key">Gemini API Key</label>
                                        <div class="nig-password-wrapper">
                                            <input type="password" id="nig-gemini-api-key" placeholder="Enter your Google Gemini API key">
                                            <button
                                                type="button"
                                                class="nig-password-toggle"
                                                data-target="nig-gemini-api-key"
                                                aria-label="Show Gemini API key for enhancement"
                                                aria-pressed="false"
                                            >
                                                <span class="material-symbols-outlined" aria-hidden="true">visibility_off</span>
                                            </button>
                                        </div>
                                        <small class="nig-hint">Get a free API key from <a href="https://aistudio.google.com/api-keys" target="_blank" class="nig-api-prompt-link">Google AI Studio</a></small>
                                    </div>

                                    <div class="nig-form-group">
                                        <label for="nig-enhancement-model">Enhancement Model</label>
                                        <select id="nig-enhancement-model">
                                            <option value="models/gemini-2.5-pro">Gemini 2.5 Pro (High Quality)</option>
                                            <option value="models/gemini-flash-latest">Gemini Flash Latest (Fast)</option>
                                            <option value="models/gemini-flash-lite-latest">Gemini Flash Lite (Ultra Fast)</option>
                                            <option value="models/gemini-2.5-flash">Gemini 2.5 Flash (Balanced)</option>
                                            <option value="models/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite (Efficient)</option>
                                        </select>
                                        <small class="nig-hint">Choose model based on your needs: quality vs speed</small>
                                    </div>

                                    <div class="nig-form-group">
                                        <label for="nig-enhancement-template">Custom Enhancement Prompt</label>
                                        <div class="nig-enhancement-template-section">
                                            <div class="nig-form-group">
                                                <label for="nig-enhancement-template-select">Enhancement Template</label>
                                                <select id="nig-enhancement-template-select">
                                                    <optgroup label="User Presets" data-group="user-presets"></optgroup>
                                                    <optgroup label="Default Presets" data-group="default-presets">
                                                        <option value="standard">Standard Enhancement - General-purpose, balanced enhancement</option>
                                                        <option value="safety">Safety Enhancement - Safe, policy-aligned enhancement</option>
                                                        <option value="artistic">Artistic Enhancement - Emphasizes creative visual style</option>
                                                        <option value="technical">Technical Enhancement - Emphasizes realism and technical detail</option>
                                                        <option value="character">Character Enhancement - Focuses on character detail and personality</option>
                                                    </optgroup>
                                                    <option value="custom">Custom (one-off)</option>
                                                </select>
                                                <small class="nig-hint">
                                                    Select from your saved presets or the curated defaults.
                                                    "Custom (one-off)" uses the current text without saving as a preset.
                                                    Legacy preset selections remain supported and are mapped safely.
                                                </small>
                                            </div>
                                            <textarea id="nig-enhancement-template" rows="3" placeholder="Enter enhancement instructions to save as a preset or use ad-hoc."></textarea>
                                            <div class="nig-form-group-inline">
                                                <button class="nig-template-btn" id="nig-template-save-preset">Save as Preset</button>
                                                <button class="nig-template-btn nig-btn-danger" id="nig-template-delete-preset">Delete Selected User Preset</button>
                                                <button class="nig-template-btn" id="nig-template-reset">Reset to Selected Preset</button>
                                                <button class="nig-template-btn" id="nig-template-example">Load Example</button>
                                            </div>
                                            <small class="nig-hint">
                                                Saved presets appear under "User Presets" and persist via Tampermonkey storage.
                                                Default presets remain under "Default Presets" and are stable across updates.
                                                Use "Delete Selected User Preset" to remove a user-defined preset (only works for entries under User Presets).
                                            </small>
                                        </div>
                                    </div>

                                    <div class="nig-enhancement-preview" id="nig-enhancement-preview" style="display: none;">
                                        <div class="nig-preview-container">
                                            <div class="nig-preview-section">
                                                <h5>Original Prompt</h5>
                                                <textarea id="nig-original-prompt" class="nig-prompt-display" rows="4" placeholder="A rich narrative-style prompt will appear here for testing. You can edit or replace it with your own text before running Test Enhancement."></textarea>
                                            </div>
                                            <div class="nig-preview-arrow">
                                                <span class="material-symbols-outlined">arrow_forward</span>
                                            </div>
                                            <div class="nig-preview-section">
                                                <h5>Enhanced Prompt</h5>
                                                <div class="nig-prompt-display" id="nig-enhanced-prompt"></div>
                                            </div>
                                        </div>
                                        <button class="nig-test-enhancement-btn" id="nig-test-enhancement">
                                            <span class="material-symbols-outlined">auto_awesome</span>
                                            Test Enhancement
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="nig-style-section">
                            <div class="nig-section-header">
                                <h4>Custom Style</h4>
                            </div>
                            <div class="nig-form-group">
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" id="nig-custom-style-enable">Enable Custom Style</label>
                                </div>
                                <small class="nig-hint">Overrides the Main/Sub-style dropdowns with your own text.</small>
                                <textarea id="nig-custom-style-text" placeholder="e.g., In the style of Van Gogh, oil painting, ..."></textarea>
                            </div>
                        </div>

                        <div class="nig-style-section">
                            <div class="nig-section-header">
                                <h4>Negative Prompting (Global)</h4>
                            </div>
                            <div class="nig-form-group">
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" id="nig-enable-neg-prompt">Enable Negative Prompting</label>
                                </div>
                                <small class="nig-hint">This negative prompt will be applied to all providers when enabled.</small>
                                <textarea id="nig-global-neg-prompt" placeholder="e.g., ugly, blurry, deformed, disfigured, poor details, bad anatomy, low quality"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="nig-history-tab" class="nig-tab-content">
                <div class="nig-history-container">
                    <div class="nig-history-cleanup">
                        <div class="nig-cleanup-info">
                            <h4>History Management</h4>
                            <p>Clean up old history entries to free up space and improve performance.</p>
                        </div>
                        <div class="nig-cleanup-controls">
                            <label>Delete history older than</label>
                            <input type="number" id="nig-history-clean-days" min="1" max="365" value="30">
                            <label>days</label>
                            <button id="nig-history-clean-btn" class="nig-history-cleanup-btn">
                                <span class="material-symbols-outlined">cleaning_services</span>
                                Clean
                            </button>
                        </div>
                    </div>
                    <ul id="nig-history-list" class="nig-history-list"></ul>
                </div>
            </div>

            <div id="nig-utilities-tab" class="nig-tab-content">
                <div class="nig-utilities-grid">
                    <div class="nig-utility-card">
                        <h4>Import/Export Settings</h4>
                        <p>Backup and restore your configuration settings for seamless setup across different sessions or devices.</p>
                        <div class="nig-form-group">
                            <button id="nig-export-btn" class="nig-save-btn" style="background-color: var(--nig-color-accent-primary);">
                                <span class="material-symbols-outlined">download</span>
                                Download Configuration
                            </button>
                            <small class="nig-hint">Downloads the current configuration as a JSON file.</small>
                        </div>
                        <div class="nig-form-group">
                            <label for="nig-import-file">Import Configuration</label>
                            <input type="file" id="nig-import-file" accept=".json" style="border: 2px dashed var(--nig-color-border); background: var(--nig-color-bg-primary);">
                            <small class=" nig-hint">Uploading a JSON file will overwrite all current settings.</small>
                        </div>
                    </div>

                    <div class="nig-utility-card">
                        <h4>Cache Management</h4>
                        <p>Clear cached model lists and force fresh data fetching for accurate, up-to-date information.</p>
                        <button id="nig-clear-cache-btn" class="nig-save-btn" style="background-color: var(--nig-color-accent-error);">
                            <span class="material-symbols-outlined">clear_all</span>
                            Clear Cached Models
                        </button>
                        <small class="nig-hint">Removes all cached model lists forcing a fresh fetch.</small>
                    </div>

                    <div class="nig-utility-card">
                        <div class="nig-card-header">
                            <div class="nig-card-title">
                                <h4>Debug Console & Logs</h4>
                                <p>Enable detailed console logging and view enhancement operation logs to troubleshoot issues and monitor system behavior during development.</p>
                            </div>
                        </div>

                        <div class="nig-card-actions">
                            <button id="nig-toggle-logging-btn" class="nig-btn-primary">
                                <span class="material-symbols-outlined">bug_report</span>
                                Toggle Console Logging & Enhancement Logs
                            </button>
                        </div>

                        <div class="nig-card-secondary-actions">
                            <button id="nig-view-enhancement-logs-btn" class="nig-btn-secondary">
                                <span class="material-symbols-outlined">list</span>
                                View Enhancement Logs
                            </button>
                            <button id="nig-clear-enhancement-logs-btn" class="nig-btn-secondary nig-btn-error">
                                <span class="material-symbols-outlined">clear_all</span>
                                Clear Logs
                            </button>
                        </div>

                        <div class="nig-card-footer">
                            <small class="nig-hint">Toggles detailed console logging and provides access to enhancement operation logs.</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="nig-button-footer">
                <button id="nig-save-btn" class="nig-save-btn">Save Configuration</button>
            </div>
        </div>
    `;
}

/**
 * Creates the panel element with the template
 */
function createPanelElement() {
  const panelElement = document.createElement("div");
  panelElement.id = "nig-config-panel";
  panelElement.className = "nig-modal-overlay";
  panelElement.style.display = "none";
  panelElement.innerHTML = getConfigPanelHTML();

  return panelElement;
}

;// ./src/components/configPanel.js
// --- IMPORTS ---







// --- MODULE STATE ---
let panelElement = null;
let initializeCallbacks = {};

// --- EXPORTED FUNCTIONS ---

/**
 * Creates the config panel DOM element and attaches all its internal event listeners.
 */
function configPanel_create() {
  if (panelElement) {
    return;
  }

  // Create the panel using the template module
  panelElement = createPanelElement();
  document.body.appendChild(panelElement);

  // --- ATTACH ALL EVENT LISTENERS ---

  // Basic panel functionality
  panelElement
    .querySelector(".nig-close-btn")
    .addEventListener("click", () => (panelElement.style.display = "none"));
  panelElement
    .querySelector("#nig-save-btn")
    .addEventListener("click", configPanel_saveConfig);

  // Set up all event listener groups
  setupTabEventListeners(panelElement);
  setupProviderEventListeners(panelElement);
  setupOpenAIEventListeners(panelElement);
  setupUtilityEventListeners(panelElement);
  setupLoggingEventListeners(panelElement);
  setupStyleEventListeners(panelElement);
  setupCustomStyleEventListeners(panelElement);
  setupProviderEnhancementListener(panelElement);

  // Set up enhancement event listeners
  setupEnhancementEventListeners(panelElement);
}

/**
 * Shows the config panel, populating it with the latest data from storage.
 */
async function configPanel_show() {
  if (!panelElement) {
    configPanel_create();
  }

  // Reset to the main config tab
  panelElement
    .querySelectorAll(".nig-tab, .nig-tab-content")
    .forEach((el) => el.classList.remove("active"));
  panelElement
    .querySelector('.nig-tab[data-tab="config"]')
    .classList.add("active");
  panelElement.querySelector("#nig-config-tab").classList.add("active");
  panelElement.querySelector("#nig-save-btn").style.display = "block";

  // Populate all form sections
  const config = await storage/* getConfig */.zj();

  // Populate basic configuration
  await populateConfigForm();

  await populateGoogleModels();

  // Populate provider-specific forms
  await (0,models.populateProviderForms)(config);

  // Populate enhancement settings
  await populateEnhancementSettings(config);

  panelElement.style.display = "flex";
}

/**
 * Initializes the config panel with callbacks from the main application.
 */
function initialize(callbacks = {}) {
  initializeCallbacks = callbacks;
}

/**
 * Enhanced save configuration that coordinates saving across all modules
 */
async function configPanel_saveConfig() {
  // Save basic configuration
  await saveConfig();

  // Save enhancement configuration
  await saveEnhancementConfig();

  // Save provider-specific configurations
  await (0,models/* saveProviderConfigs */.Yl)();

  // Trigger any initialization callbacks
  if (initializeCallbacks.onConfigSaved) {
    initializeCallbacks.onConfigSaved();
  }

  alert("Configuration saved!");
}

/**
 * Populates the Google Imagen model dropdown from config/cache
 */
async function populateGoogleModels() {
  const select = document.getElementById("nig-model");
  if (!select) {
    return;
  }

  const cachedModels = await (0,models/* loadCachedGoogleModels */.YE)();
  if (cachedModels && cachedModels.length > 0) {
    populateGoogleModelsSelect(cachedModels);
  }
}

/**
 * Populates the Google Models select element
 * @param {Array} models - List of models
 */
function populateGoogleModelsSelect(models) {
  const select = document.getElementById("nig-model");
  if (!select) {
    return;
  }

  select.innerHTML = "";
  models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.id;
    option.textContent = model.name;
    select.appendChild(option);
  });
}

;// ./src/index.js
// Import styles


// Import utility modules





// Import API modules






// Import Component modules







(function () {
  "use strict";

  // --- STATE MANAGEMENT ---
  const generationQueue = [];
  const completedQueue = [];
  const errorQueue = [];
  let isGenerating = false;
  let currentGenerationStatusText = "";
  let enhancementInFlightCount = 0;
  let isErrorModalVisible = false;
  let currentSelection = "";
  let generateBtn;

  // --- CORE LOGIC ---

  function handleGenerationSuccess(
    displayUrls,
    prompt,
    provider,
    model,
    persistentUrls = null,
  ) {
    logger/* logInfo */.fH("GENERATION", "Generation completed successfully", {
      provider,
      model,
      promptLength: prompt.length,
      promptPreview:
        prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
      imagesGenerated: displayUrls.length,
      hasPersistentUrls: Boolean(persistentUrls),
    });

    completedQueue.push({ imageUrls: displayUrls, prompt, provider, model });
    const historyUrls = persistentUrls || displayUrls;
    historyUrls.forEach((url) =>
      storage/* addToHistory */.Pc({
        date: new Date().toISOString(),
        prompt,
        url,
        provider,
        model,
      }),
    );
    isGenerating = false;
    updateSystemStatus();
    processQueue();
  }

  function handleGenerationFailure(
    errorMessage,
    prompt = "Unknown",
    provider,
    providerProfileUrl = null,
    errorMetadata = null,
  ) {
    logger/* logError */.vV("GENERATION", `Generation Failed`, {
      prompt,
      provider,
      errorMessage,
      errorMetadata,
    });

    // If error metadata is provided (e.g., from OpenAI provider), use it to enhance error parsing
    const friendlyError = parseErrorMessage(
      errorMessage,
      provider,
      providerProfileUrl,
    );

    // If metadata provides explicit error type and retryability, use that
    if (errorMetadata) {
      if (errorMetadata.errorType) {
        friendlyError.errorType = errorMetadata.errorType;
      }
      if (typeof errorMetadata.isNonRetryable === "boolean") {
        friendlyError.retryable = !errorMetadata.isNonRetryable;
        friendlyError.isNonRetryable = errorMetadata.isNonRetryable;
      }
    }

    errorQueue.push({
      reason: friendlyError,
      prompt,
      provider,
      providerProfileUrl,
    });
    showNextError();

    // Don't auto-continue queue - wait for user action
    statusWidget/* update */.y("error", "Generation Failed.");
    isGenerating = false;

    // Update status but don't auto-process queue
    updateSystemStatus();

    logger/* logInfo */.fH(
      "GENERATION",
      "Generation failed - waiting for user action",
      {
        errorQueueLength: errorQueue.length,
        generationQueueLength: generationQueue.length,
        willWaitForUser: true,
        errorType: friendlyError.errorType || "unknown",
        isNonRetryable: friendlyError.isNonRetryable || false,
      },
    );
  }

  function showNextError() {
    if (isErrorModalVisible || errorQueue.length === 0) {
      return;
    }
    const errorToShow = errorQueue.shift();
    isErrorModalVisible = true;
    show(errorToShow);

    logger/* logInfo */.fH("ERROR", "Showing error modal to user", {
      errorReason: errorToShow.reason.message,
      provider: errorToShow.provider,
      remainingErrorQueue: errorQueue.length,
    });

    // The error modal will hide itself, we don't need to manage its closing state here
  }

  function handleErrorModalDismiss() {
    logger/* logInfo */.fH("ERROR", "Error modal dismissed by user", {
      errorQueueLength: errorQueue.length,
      generationQueueLength: generationQueue.length,
      isGenerating,
    });

    isErrorModalVisible = false;
    updateSystemStatus();

    // Resume queue processing if there are more items
    if (generationQueue.length > 0 && !isGenerating) {
      logger/* logInfo */.fH(
        "ERROR",
        "Resuming queue processing after error modal dismissal",
      );
      processQueue();
    } else {
      logger/* logInfo */.fH("ERROR", "No more items to process, queue paused");
    }
  }

  function retryGeneration(
    basePositivePrompt,
    provider,
    providerProfileUrl = null,
  ) {
    const queueEntry = {
      basePositivePrompt,
      provider,
      providerProfileUrl,
    };
    generationQueue.unshift(queueEntry);

    logger/* logInfo */.fH(
      "GENERATION",
      "Added retry generation to queue (LIFO - Priority)",
      {
        provider,
        basePositivePromptLength: basePositivePrompt.length,
        queueLength: generationQueue.length,
        queuePosition: 1,
        basePositivePromptPreview:
          basePositivePrompt.substring(0, 100) +
          (basePositivePrompt.length > 100 ? "..." : ""),
      },
    );

    isGenerating = false;
    hide();
    isErrorModalVisible = false;
    updateSystemStatus();
    processQueue();
    showNextError(); // Check if there are other errors in the queue
  }

  function addToGenerationQueue(
    basePositivePrompt,
    provider,
    providerProfileUrl = null,
  ) {
    generationQueue.push({
      basePositivePrompt,
      provider,
      providerProfileUrl,
    });

    logger/* logInfo */.fH("GENERATION", "Added generation to queue (FIFO)", {
      provider,
      basePositivePromptLength: basePositivePrompt.length,
      queueLength: generationQueue.length,
      queuePosition: generationQueue.length,
      basePositivePromptPreview:
        basePositivePrompt.substring(0, 100) +
        (basePositivePrompt.length > 100 ? "..." : ""),
    });

    updateSystemStatus();

    if (!isGenerating) {
      processQueue();
    }
  }

  function updateSystemStatus() {
    logger/* logDebug */.MD("SYSTEM", "Updating system status", {
      completedQueueLength: completedQueue.length,
      isGenerating,
      generationQueueLength: generationQueue.length,
      currentStatusText: currentGenerationStatusText,
    });

    if (completedQueue.length > 0) {
      const text =
        completedQueue.length === 1
          ? "1 Image Ready!"
          : `${completedQueue.length} Images Ready!`;
      statusWidget/* update */.y("success", `${text} Click to view.`, () => {
        const result = completedQueue.shift();
        if (result) {
          // Ensure viewer sees the exact main prompt string sent to provider:
          // - For AI Horde: positive-only prompt.
          // - For others: fully concatenated prompt with inline negative when applicable.
          imageViewer.show(
            result.imageUrls,
            result.prompt,
            result.provider,
            result.model,
          );
        }
        updateSystemStatus();
      });
    } else if (isGenerating || generationQueue.length > 0) {
      // Only show queue indicator if there are items actually waiting (generationQueue.length > 0)
      // This prevents showing "Queue: 1" when only the current item is being processed
      const queueText =
        generationQueue.length > 0 ? ` (Queue: ${generationQueue.length})` : "";
      statusWidget/* update */.y(
        "loading",
        `${currentGenerationStatusText}${queueText}`,
      );
    } else {
      statusWidget/* update */.y("hidden", "");
    }
  }

  async function processQueue() {
    if (isGenerating || generationQueue.length === 0) {
      logger/* logDebug */.MD("QUEUE", "Queue processing skipped", {
        reason: isGenerating ? "Currently generating" : "Queue is empty",
        isGenerating,
        queueLength: generationQueue.length,
      });
      return;
    }

    isGenerating = true;
    const request = generationQueue.shift();
    currentGenerationStatusText = "Requesting...";

    const provider = request.provider;
    const basePositivePrompt = request.basePositivePrompt;

    const apiPrompt = getApiReadyPrompt(basePositivePrompt, "queue_dispatch");
    const displayPrompt = basePositivePrompt;

    logger/* logInfo */.fH("QUEUE", "Starting queue processing", {
      provider,
      basePositivePromptLength: basePositivePrompt.length,
      basePositivePromptPreview:
        basePositivePrompt.substring(0, 100) +
        (basePositivePrompt.length > 100 ? "..." : ""),
      remainingQueueLength: generationQueue.length,
      currentStatus: currentGenerationStatusText,
    });

    updateSystemStatus();

    const callbacks = {
      onSuccess: handleGenerationSuccess,
      onFailure: handleGenerationFailure,
      onAuthFailure: (msg, p) => {
        logger/* logInfo */.fH("AUTH", "Authentication required", {
          provider: p,
          message: msg,
        });
        pollinationsAuthPrompt_show(msg, p, retryGeneration);
        isGenerating = false;
        // Don't auto-resume - wait for user action
        statusWidget/* update */.y("error", "Authentication needed.");
        updateSystemStatus();

        logger/* logInfo */.fH(
          "AUTH",
          "Queue paused due to authentication requirement",
          {
            generationQueueLength: generationQueue.length,
            willWaitForUser: true,
          },
        );
      },
      updateStatus: (text) => {
        currentGenerationStatusText = text;
        logger/* logDebug */.MD("SYSTEM", "Status updated by provider", {
          provider: request.provider,
          newStatusText: text,
          isGenerating,
          generationQueueLength: generationQueue.length,
        });
        updateSystemStatus();
      },
    };

    // Provider-specific final/negative prompt handling
    switch (provider) {
      case "AIHorde": {
        // For AI Horde:
        // - apiPrompt is strictly the positive prompt (StyledPrompt or EnhancedPrompt)
        // - negative prompt is sent separately inside api/aiHorde.js based on config
        logger/* logInfo */.fH("QUEUE", "Using AI Horde prompt construction path", {
          provider: "AIHorde",
          positivePromptLength: apiPrompt.length,
          positivePromptPreview:
            apiPrompt.substring(0, 200) + (apiPrompt.length > 200 ? "..." : ""),
        });

        logger/* logDebug */.MD(
          "QUEUE",
          "Dispatching to AIHorde provider with positive-only prompt",
          {
            provider: "AIHorde",
            prompt:
              apiPrompt.substring(0, 200) +
              (apiPrompt.length > 200 ? "..." : ""),
          },
        );

        aiHorde_generate(apiPrompt, callbacks);
        break;
      }

      case "Pollinations":
      case "Google":
      case "OpenAICompat": {
        // For all non-AI Horde providers:
        // - Append negative prompt inline when enabled and non-empty
        const useCase =
          provider === "Pollinations"
            ? "pollinations_inline_negative"
            : provider === "Google"
              ? "google_inline_negative"
              : "openai_compat_inline_negative";

        logger/* logInfo */.fH("QUEUE", "Using non-AI Horde prompt construction path", {
          provider,
          basePositivePromptLength: apiPrompt.length,
          basePositivePromptPreview:
            apiPrompt.substring(0, 200) + (apiPrompt.length > 200 ? "..." : ""),
        });

        // Negative prompt is resolved in each provider based on config, but for
        // backward compatibility with 5.7.0 behavior we construct the exact
        // main prompt string here before dispatch.
        // Note:
        // The actual negative string and enabled flag are read in each provider via getConfig().
        // Those modules MUST:
        //   - For Pollinations/Google/OpenAICompat: build FinalPrompt =
        //       (StyledPrompt or EnhancedPrompt) + ", negative prompt: " + globalNegPrompt
        //     when enabled and non-empty, and send that as the single prompt string.
        //   - Respect empty/whitespace-only negatives by NOT appending anything.

        if (provider === "Pollinations") {
          logger/* logDebug */.MD("QUEUE", "Dispatching to Pollinations provider", {
            prompt:
              apiPrompt.substring(0, 200) +
              (apiPrompt.length > 200 ? "..." : ""),
            path: useCase,
          });
          pollinations_generate(apiPrompt, callbacks);
        } else {
          if (provider === "Google") {
            logger/* logDebug */.MD("QUEUE", "Dispatching to Google provider", {
              prompt:
                apiPrompt.substring(0, 200) +
                (apiPrompt.length > 200 ? "..." : ""),
              path: useCase,
            });
            generate(apiPrompt, callbacks);
          } else if (provider === "OpenAICompat") {
            logger/* logDebug */.MD("QUEUE", "Dispatching to OpenAICompat provider", {
              prompt:
                apiPrompt.substring(0, 200) +
                (apiPrompt.length > 200 ? "..." : ""),
              providerProfileUrl: request.providerProfileUrl,
              path: useCase,
            });
            openAI_generate(
              apiPrompt,
              request.providerProfileUrl,
              callbacks,
            );
          }
        }
        break;
      }

      default:
        handleGenerationFailure(
          `Unknown provider: ${provider}`,
          displayPrompt,
          "System",
        );
    }
  }

  // --- EVENT HANDLERS & UI TRIGGERS ---

  async function onGenerateClick() {
    generateBtn.style.display = "none";
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    if (!currentSelection) {
      logger/* logWarn */.JE("GENERATION", "No text selected for generation");
      return;
    }

    logger/* logInfo */.fH("GENERATION", "User initiated image generation", {
      selectionLength: currentSelection.length,
      selectionPreview:
        currentSelection.substring(0, 100) +
        (currentSelection.length > 100 ? "..." : ""),
    });

    const config = await storage/* getConfig */.zj();

    if (config.selectedProvider === "Google" && !config.googleApiKey) {
      logger/* logWarn */.JE(
        "GENERATION",
        "Google provider selected but no API key provided",
      );
      googleApiPrompt_show();
      return;
    }

    let finalPrompt = currentSelection;
    let prefix = "";

    // StyledPrompt = StylePrefix + SelectedText
    if (config.customStyleEnabled && config.customStyleText) {
      prefix = config.customStyleText.trim();
      if (prefix && !prefix.endsWith(", ")) {
        prefix += ", ";
      }
    } else if (config.mainPromptStyle !== "None") {
      prefix =
        config.subPromptStyle && config.subPromptStyle !== "none"
          ? config.subPromptStyle
          : `${config.mainPromptStyle} style, `;
    }
    finalPrompt = prefix + finalPrompt;

    // If AI Enhancement is enabled and used, it operates on StyledPrompt and becomes EnhancedPrompt.
    if (config.enhancementEnabled) {
      const shouldUseProviderEnh = shouldUseProviderEnhancement(
        config.selectedProvider,
        config,
      );
      const hasApiKey = (config.enhancementApiKey || "").trim().length > 0;
      const shouldUseExternalEnhancement =
        (!shouldUseProviderEnh || config.enhancementOverrideProvider) &&
        hasApiKey;

      if (shouldUseExternalEnhancement) {
        enhancementInFlightCount++;
        const startQueueText =
          enhancementInFlightCount > 1
            ? ` (Queue: ${enhancementInFlightCount})`
            : "";
        statusWidget/* update */.y("loading", `Enhancing prompt...${startQueueText}`);
        try {
          // Clean prompt for enhancement API call
          // IMPORTANT: Enhancement must ONLY see the positive prompt (style + user text), never global negatives
          const cleanPromptForEnhancement = getApiReadyPrompt(
            finalPrompt,
            "enhancement_positive_only",
          );
          finalPrompt = await enhancePromptWithGemini(
            cleanPromptForEnhancement,
            config,
          );
          enhancementInFlightCount = Math.max(0, enhancementInFlightCount - 1);
          const successQueueText =
            enhancementInFlightCount > 0
              ? ` (Queue: ${enhancementInFlightCount})`
              : "";
          statusWidget/* update */.y("success", `Prompt enhanced!${successQueueText}`);
          setTimeout(() => updateSystemStatus(), 2000);
        } catch (error) {
          enhancementInFlightCount = Math.max(0, enhancementInFlightCount - 1);
          const errorQueueText =
            enhancementInFlightCount > 0
              ? ` (Queue: ${enhancementInFlightCount})`
              : "";
          // External enhancement failure is expected to gracefully fall back.
          // Log as non-critical ENHANCEMENT info so it respects the logging toggle.
          logger/* logInfo */.fH(
            "ENHANCEMENT",
            "External AI enhancement failed, falling back to original",
            { error: error.message },
          );
          statusWidget/* update */.y(
            "error",
            `Enhancement failed, using original prompt${errorQueueText}`,
          );
          setTimeout(() => updateSystemStatus(), 3000);
        }
      }
    }

    // NOTE (Objective 4):
    // Global negative prompt is applied ONLY at provider dispatch time for providers that explicitly support it.
    // Do NOT concatenate globalNegPrompt into finalPrompt here.

    logger/* logInfo */.fH(
      "GENERATION",
      "Prompt preparation completed, adding to queue",
      {
        provider: config.selectedProvider,
        basePositivePromptLength: finalPrompt.length,
        basePositivePromptPreview:
          finalPrompt.substring(0, 200) +
          (finalPrompt.length > 200 ? "..." : ""),
        queueSystem: "FIFO",
      },
    );

    // finalPrompt is now StyledPrompt or EnhancedPrompt (positive-only).
    // Provider-specific negative behavior is applied later at dispatch/API modules.
    addToGenerationQueue(
      finalPrompt,
      config.selectedProvider,
      config.openAICompatActiveProfileUrl,
    );
  }

  function handleSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      if (generateBtn) {
        generateBtn.style.display = "none";
      }
      return;
    }
    const selectedText = selection.toString().trim();

    if (selectedText.length > 5) {
      currentSelection = selectedText;
      const range = selection.getRangeAt(0);
      const rects = range.getClientRects();
      if (rects.length === 0) {
        generateBtn.style.display = "none";
        return;
      }
      const firstRect = rects[0];
      generateBtn.style.display = "block";
      const buttonHeight = generateBtn.offsetHeight || 30;
      let topPosition = window.scrollY + firstRect.top - buttonHeight - 5;
      if (topPosition < window.scrollY) {
        const lastRect = rects[rects.length - 1];
        topPosition = window.scrollY + lastRect.bottom + 5;
      }
      generateBtn.style.top = `${topPosition}px`;
      generateBtn.style.left = `${window.scrollX + firstRect.left}px`;
    } else {
      if (generateBtn) {
        generateBtn.style.display = "none";
      }
    }
  }

  // --- INITIALIZATION ---
  async function init() {
    await logger/* updateLoggingStatus */.RJ();

    // Clean old history entries on startup to maintain data integrity
    try {
      const removedCount = await storage/* cleanOldHistory */.j5();
      if (removedCount > 0) {
        logger/* logInfo */.fH(
          "INIT",
          `Cleaned ${removedCount} old history entries on startup`,
        );
      }
    } catch (error) {
      logger/* logError */.vV(
        "INIT",
        "Failed to clean old history entries on startup",
        { error: error.message },
      );
    }

    // Create the main UI button
    const materialSymbolsLink = document.createElement("link");
    materialSymbolsLink.rel = "stylesheet";
    materialSymbolsLink.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";
    document.head.appendChild(materialSymbolsLink);
    generateBtn = document.createElement("button");
    generateBtn.className = "nig-button";
    generateBtn.innerHTML = "🎨 Generate Image";
    generateBtn.addEventListener("click", onGenerateClick);
    document.body.appendChild(generateBtn);

    // Create and initialize all components
    statusWidget/* create */.v();
    imageViewer/* create */.v();
    create();
    configPanel_create();
    errorModal_init({
      onRetry: retryGeneration,
      onDismiss: handleErrorModalDismiss,
    });

    // Register global event listeners
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("selectionchange", handleSelection);
    GM_registerMenuCommand("Image Generator Settings", configPanel_show);

    logger/* logInfo */.fH(
      "INIT",
      "WTR LAB Novel Image Generator initialized successfully",
      {
        config: await storage/* getConfig */.zj(),
      },
    );
  }

  init();
})();

/******/ })()
;