// ==UserScript==
// @name         Plunet Simple Suite - Production
// @namespace    https://github.com/langlink-localization
// @version      1.25.3
// @author       LangLink
// @description  Simplified automation suite with basic modules + Price List Creator (prod server)
// @license      MIT
// @match        *://demo77.plunet.com/*
// @match        *://bms.langlinking.com/*
// @match        *://langlink-plunet.taila1464b.ts.net/*
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/561943/Plunet%20Simple%20Suite%20-%20Production.user.js
// @updateURL https://update.greasyfork.org/scripts/561943/Plunet%20Simple%20Suite%20-%20Production.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SCRIPT_VERSION$3 = "1.0.0";
  const SCRIPT_ID$3 = "plunet-simple-suite";
  const I18N$3 = {
    en: {
      panelTitle: "Plunet Simple Suite",
      versionLabel: "v{version}",
      toggleTitle: "Open Plunet Simple Suite",
      toggleButtonLabel: "Suite",
      minimizeTitle: "Minimize",
      minimizeButtonLabel: "-",
      featuresTitle: "Features",
      refreshButtonLabel: "Refresh",
      statusReady: "Select a feature to open.",
      statusUnavailable: "{feature} is not available on this page.",
      statusOpened: "{feature} opened.",
      featureReady: "Ready",
      featureUnavailable: "Unavailable",
      featureUnknown: "Checking...",
      openFeature: "Open",
      showFeature: "Show",
      hideFeature: "Close",
      minimizeTooltip: "Minimize to dock",
      closeTooltip: "Close",
categoryCreator: "Creator",
      categoryCreatorDesc: "Single price list creation wizard",
      categoryBasic: "Basic",
      categoryBasicDesc: "Single-page batch operations",
featurePriceListCreator: "Price List Creator",
      featureLangPairRate: "Language Pair Rate",
      featurePricelistBatchAdd: "Price Unit Batch Add",
featurePriceListCreatorDesc: "Create a complete price list with wizard",
      featureLangPairRateDesc: "Add language pairs and set unit rates",
      featurePricelistBatchAddDesc: "Batch add price units on current page"
    },
    zh: {
      panelTitle: "Plunet 简易套件",
      versionLabel: "v{version}",
      toggleTitle: "打开 Plunet 简易套件",
      toggleButtonLabel: "简易",
      minimizeTitle: "最小化",
      minimizeButtonLabel: "-",
      featuresTitle: "功能模块",
      refreshButtonLabel: "刷新",
      statusReady: "选择一个功能模块来打开",
      statusUnavailable: "{feature} 在当前页面不可用",
      statusOpened: "{feature} 已打开",
      featureReady: "就绪",
      featureUnavailable: "不可用",
      featureUnknown: "检测中...",
      openFeature: "打开",
      showFeature: "显示",
      hideFeature: "关闭",
      minimizeTooltip: "最小化到停靠栏",
      closeTooltip: "关闭",
categoryCreator: "创建器",
      categoryCreatorDesc: "单个价格表创建向导",
      categoryBasic: "基础模块",
      categoryBasicDesc: "单页面批量操作",
featurePriceListCreator: "价格表创建器",
      featureLangPairRate: "语言对费率",
      featurePricelistBatchAdd: "价格单位批量添加",
featurePriceListCreatorDesc: "通过向导创建完整的价格表",
      featureLangPairRateDesc: "添加语言对并设置单价",
      featurePricelistBatchAddDesc: "在当前页面批量添加价格单位"
    }
  };
  I18N$3["zh-cn"] = I18N$3.zh;
  const DEFAULT_LOCALE$3 = "en";
  const ACTIVE_LOCALE$2 = (() => {
    const raw = (navigator.language || DEFAULT_LOCALE$3).toLowerCase();
    if (I18N$3[raw]) return raw;
    const base = raw.split("-")[0];
    if (I18N$3[base]) return base;
    return DEFAULT_LOCALE$3;
  })();
  function t$3(key, vars = null) {
    const template = I18N$3[ACTIVE_LOCALE$2]?.[key] || I18N$3[DEFAULT_LOCALE$3]?.[key] || key;
    if (!vars || typeof vars !== "object") return template;
    return template.replace(/\{(\w+)\}/g, (_, token) => {
      if (Object.prototype.hasOwnProperty.call(vars, token)) {
        return String(vars[token]);
      }
      return "";
    });
  }
  const THEME_ID = "plunet-automation-theme";
  const THEME_VARIABLES = `
  --pa-ink: #1b2a33;
  --pa-muted: #54606b;
  --pa-accent: #0b6aa6;
  --pa-accent-strong: #084f7c;
  --pa-accent-light: rgba(11, 106, 166, 0.12);
  --pa-success: #1f8a50;
  --pa-success-light: rgba(31, 138, 80, 0.12);
  --pa-danger: #c23d3d;
  --pa-danger-light: rgba(194, 61, 61, 0.12);
  --pa-warning: #c98a12;
  --pa-warning-light: rgba(201, 138, 18, 0.12);
  --pa-border: rgba(27, 42, 51, 0.16);
  --pa-border-dashed: rgba(27, 42, 51, 0.12);
  --pa-surface: rgba(255, 255, 255, 0.8);
  --pa-surface-solid: #ffffff;
  --pa-panel-bg: linear-gradient(135deg, rgba(241, 246, 255, 0.85) 0%, rgba(255, 244, 235, 0.85) 50%, rgba(243, 251, 246, 0.85) 100%);
  --pa-header-bg: linear-gradient(120deg, rgba(11, 106, 166, 0.15), rgba(255, 179, 112, 0.24));
  --pa-log-bg: #141a1f;
  --pa-log-ink: #d9e6f1;
  --pa-shadow: 0 8px 20px rgba(22, 31, 38, 0.16), 0 2px 5px rgba(22, 31, 38, 0.1);
  --pa-shadow-light: 0 2px 8px rgba(22, 31, 38, 0.1);
  --pa-radius: 10px;
  --pa-radius-sm: 7px;
  --pa-radius-xs: 4px;
  --pa-font: "Fira Sans", "IBM Plex Sans", "Noto Sans", sans-serif;
  --pa-font-mono: "Fira Mono", "IBM Plex Mono", "SF Mono", monospace;
`;
  const PANEL_BASE_STYLES = `
.pa-panel {
  ${THEME_VARIABLES}
  font-family: var(--pa-font);
  font-size: 12px;
  color: var(--pa-ink);
  background: var(--pa-panel-bg);
  border: 1px solid var(--pa-border);
  border-radius: var(--pa-radius);
  box-shadow: var(--pa-shadow);
  overflow: hidden;
  backdrop-filter: blur(6px);
  animation: pa-panel-in 240ms ease-out;
}
.pa-panel * {
  box-sizing: border-box;
}
.pa-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(140px 80px at 12% 0%, rgba(11, 106, 166, 0.18), transparent 60%),
    radial-gradient(160px 110px at 88% 8%, rgba(255, 179, 112, 0.28), transparent 68%),
    radial-gradient(220px 120px at 28% 100%, rgba(106, 205, 176, 0.2), transparent 62%);
  opacity: 0.7;
  pointer-events: none;
}
.pa-panel > * {
  position: relative;
  z-index: 1;
}
@keyframes pa-panel-in {
  from { opacity: 0; transform: translateY(8px) scale(0.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`;
  const HEADER_STYLES = `
.pa-header {
  background: var(--pa-header-bg);
  border-bottom: 1px solid var(--pa-border);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: move;
  user-select: none;
}
.pa-header:active {
  cursor: grabbing;
}
.pa-header-title {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.pa-header-title-text {
  font-weight: 600;
  font-size: 13px;
}
.pa-header-version {
  font-size: 10px;
  color: var(--pa-muted);
  font-weight: 500;
}
.pa-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
`;
  const BUTTON_STYLES = `
.pa-btn {
  font-family: var(--pa-font);
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--pa-radius-sm);
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  transition: background 0.15s, opacity 0.15s;
}
.pa-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pa-btn-primary {
  background: var(--pa-accent);
  color: white;
  box-shadow: 0 2px 0 rgba(16, 24, 32, 0.12);
}
.pa-btn-primary:hover:not(:disabled) {
  background: var(--pa-accent-strong);
}
.pa-btn-ghost {
  background: rgba(255, 255, 255, 0.7);
  color: var(--pa-muted);
  border: 1px solid var(--pa-border);
  box-shadow: none;
}
.pa-btn-ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.92);
  color: var(--pa-ink);
}
.pa-btn-success {
  background: var(--pa-success);
  color: white;
  box-shadow: 0 2px 0 rgba(16, 24, 32, 0.12);
}
.pa-btn-success:hover:not(:disabled) {
  background: #177a45;
}
.pa-btn-danger {
  background: var(--pa-danger);
  color: white;
  box-shadow: 0 2px 0 rgba(16, 24, 32, 0.12);
}
.pa-btn-danger:hover:not(:disabled) {
  background: #a83535;
}
.pa-btn-warning {
  background: var(--pa-warning);
  color: white;
  box-shadow: 0 2px 0 rgba(16, 24, 32, 0.12);
}
.pa-btn-warning:hover:not(:disabled) {
  background: #b07a0f;
}
.pa-btn-sm {
  font-size: 10px;
  padding: 3px 8px;
}
.pa-btn-icon {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 2px 6px;
  font-size: 14px;
  color: var(--pa-muted);
}
.pa-btn-icon:hover:not(:disabled) {
  color: var(--pa-ink);
}
`;
  const TOGGLE_STYLES = `
.pa-toggle {
  position: fixed;
  right: 0;
  width: 38px;
  height: 38px;
  border-radius: 19px 0 0 19px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-right: none;
  background: linear-gradient(135deg, var(--pa-accent) 0%, var(--pa-accent-strong) 100%);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(11, 106, 166, 0.5), 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  ${THEME_VARIABLES}
}
.pa-toggle:hover {
  background: linear-gradient(135deg, var(--pa-accent-strong) 0%, #063d5f 100%);
  box-shadow: 0 4px 16px rgba(11, 106, 166, 0.6), 0 2px 6px rgba(0, 0, 0, 0.25);
}
`;
  const INPUT_STYLES = `
.pa-input,
.pa-select,
.pa-textarea {
  font-family: var(--pa-font);
  font-size: 11px;
  color: var(--pa-ink);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--pa-border);
  border-radius: var(--pa-radius-sm);
  padding: 6px 8px;
}
.pa-input:focus,
.pa-select:focus,
.pa-textarea:focus {
  outline: none;
  border-color: var(--pa-accent);
  box-shadow: 0 0 0 2px var(--pa-accent-light);
}
.pa-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: var(--pa-font-mono);
}
.pa-checkbox {
  accent-color: var(--pa-accent);
}
.pa-label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  font-size: 11px;
}
`;
  const STATUS_STYLES = `
.pa-status {
  padding: 8px 10px;
  background: var(--pa-surface);
  border: 1px solid var(--pa-border);
  border-radius: var(--pa-radius-sm);
  font-size: 11px;
}
.pa-status-success {
  background: var(--pa-success-light);
  border-color: var(--pa-success);
  color: var(--pa-success);
}
.pa-status-danger {
  background: var(--pa-danger-light);
  border-color: var(--pa-danger);
  color: var(--pa-danger);
}
.pa-status-warning {
  background: var(--pa-warning-light);
  border-color: var(--pa-warning);
  color: var(--pa-warning);
}
.pa-progress-container {
  background: var(--pa-surface);
  border: 1px solid var(--pa-border);
  border-radius: var(--pa-radius-sm);
  padding: 8px;
}
.pa-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 6px;
}
.pa-progress-subtitle {
  font-size: 10px;
  color: var(--pa-muted);
  font-weight: 500;
}
`;
  const STEPS_STYLES = `
.pa-steps-container {
  border: 1px dashed var(--pa-border-dashed);
  border-radius: var(--pa-radius-xs);
  padding: 4px;
}
.pa-step-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 6px;
  font-size: 11px;
  border-bottom: 1px dashed var(--pa-border-dashed);
  animation: pa-step-in 280ms ease-out both;
}
.pa-step-item:last-child {
  border-bottom: none;
}
.pa-step-item.current {
  background: var(--pa-accent-light);
  font-weight: 600;
}
.pa-step-icon {
  width: 14px;
  height: 14px;
  text-align: center;
  font-size: 10px;
}
.pa-step-item.pending .pa-step-icon { color: var(--pa-muted); }
.pa-step-item.in_progress .pa-step-icon { color: var(--pa-warning); }
.pa-step-item.completed .pa-step-icon { color: var(--pa-success); }
.pa-step-item.failed .pa-step-icon { color: var(--pa-danger); }
.pa-step-item.skipped .pa-step-icon { color: var(--pa-muted); }
@keyframes pa-step-in {
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: translateX(0); }
}
`;
  const LOG_STYLES = `
.pa-log-details summary {
  cursor: pointer;
  user-select: none;
  font-size: 11px;
  color: var(--pa-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 0;
}
.pa-log-details summary::-webkit-details-marker {
  display: none;
}
.pa-log-details summary::before {
  content: "\\25B8 ";
  font-size: 10px;
  color: var(--pa-muted);
}
.pa-log-details[open] summary::before {
  content: "\\25BE ";
}
.pa-log-details[open] summary {
  margin-bottom: 6px;
}
.pa-log-box {
  margin: 0;
  padding: 6px 8px;
  max-height: 220px;
  min-height: 60px;
  overflow: auto;
  background: var(--pa-log-bg);
  color: var(--pa-log-ink);
  font-size: 10px;
  font-family: var(--pa-font-mono);
  line-height: 1.4;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  white-space: pre-wrap;
  word-break: break-word;
}
`;
  const CONTROLS_STYLES = `
.pa-controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.pa-controls-row {
  display: flex;
  gap: 8px;
  flex: 1;
  min-width: 0;
}
`;
  const FEATURE_STYLES = `
.pa-feature-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--pa-border-dashed);
}
.pa-feature-row:last-child {
  border-bottom: none;
}
.pa-feature-name {
  font-weight: 600;
  font-size: 12px;
}
.pa-feature-status {
  font-size: 10px;
  color: var(--pa-muted);
}
`;
  const SECTION_STYLES = `
.pa-section {
  margin-bottom: 12px;
}
.pa-section:last-child {
  margin-bottom: 0;
}
.pa-section-title {
  font-size: 11px;
  color: var(--pa-muted);
  margin-bottom: 6px;
  font-weight: 500;
}
.pa-body {
  padding: 12px;
}
`;
  const FULL_THEME = `
${PANEL_BASE_STYLES}
${HEADER_STYLES}
${BUTTON_STYLES}
${TOGGLE_STYLES}
${INPUT_STYLES}
${STATUS_STYLES}
${STEPS_STYLES}
${LOG_STYLES}
${CONTROLS_STYLES}
${FEATURE_STYLES}
${SECTION_STYLES}
`;
  function injectTheme(doc = document) {
    const existing = doc.getElementById(THEME_ID);
    if (existing) return existing;
    const style = doc.createElement("style");
    style.id = THEME_ID;
    style.textContent = FULL_THEME;
    doc.head.appendChild(style);
    return style;
  }
  const SUITE_STYLES = `
/* Hide individual module toggle buttons when suite is active */
#plunet-lang-pair-rate-toggle,
#plunet-price-unit-batch-add-toggle,
#plunet-price-list-creator-toggle {
  display: none !important;
}

/* Suite panel specific overrides */
#${SCRIPT_ID$3}-panel {
  ${THEME_VARIABLES}
  font-family: var(--pa-font);
  font-size: 12px;
  color: var(--pa-ink);
  background: var(--pa-panel-bg);
  border: 1px solid var(--pa-border);
  border-radius: var(--pa-radius);
  box-shadow: var(--pa-shadow);
  overflow: hidden;
  backdrop-filter: blur(6px);
  width: min(320px, calc(100vw - 24px));
}
#${SCRIPT_ID$3}-panel * {
  box-sizing: border-box;
}
#${SCRIPT_ID$3}-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(140px 80px at 12% 0%, rgba(46, 125, 50, 0.18), transparent 60%),
    radial-gradient(160px 110px at 88% 8%, rgba(255, 179, 112, 0.28), transparent 68%),
    radial-gradient(220px 120px at 28% 100%, rgba(106, 205, 176, 0.2), transparent 62%);
  opacity: 0.7;
  pointer-events: none;
}
#${SCRIPT_ID$3}-panel > * {
  position: relative;
  z-index: 1;
}
#${SCRIPT_ID$3}-panel-header {
  background: var(--pa-header-bg);
  border-bottom: 1px solid var(--pa-border);
  cursor: move;
  user-select: none;
}
#${SCRIPT_ID$3}-panel-header:active {
  cursor: grabbing;
}
#${SCRIPT_ID$3}-panel button {
  font-family: var(--pa-font);
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--pa-radius-sm);
  border: 1px solid var(--pa-border);
  box-shadow: 0 2px 0 rgba(16, 24, 32, 0.12);
  cursor: pointer;
}
#${SCRIPT_ID$3}-panel .ps-ghost-btn {
  background: rgba(255, 255, 255, 0.95);
  color: var(--pa-ink);
  border: 1px solid var(--pa-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
#${SCRIPT_ID$3}-panel .ps-ghost-btn:hover {
  background: #ffffff;
  color: var(--pa-accent);
  border-color: var(--pa-accent);
}
#${SCRIPT_ID$3}-panel .ps-primary-btn {
  background: #2e7d32;
  color: #ffffff;
  border: none;
}
#${SCRIPT_ID$3}-panel .ps-primary-btn:hover {
  background: #1b5e20;
}
#${SCRIPT_ID$3}-toggle {
  ${THEME_VARIABLES}
  position: fixed;
  top: 60px;
  right: 0;
  width: 38px;
  height: 38px;
  border-radius: 19px 0 0 19px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-right: none;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  z-index: 999997;
  box-shadow: 0 4px 14px rgba(46, 125, 50, 0.5), 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
#${SCRIPT_ID$3}-toggle:hover {
  background: linear-gradient(135deg, #1b5e20 0%, #0d3d14 100%);
  box-shadow: 0 4px 16px rgba(46, 125, 50, 0.6), 0 2px 6px rgba(0, 0, 0, 0.25);
}
.ps-feature-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--pa-border-dashed);
}
.ps-feature-row:last-child {
  border-bottom: none;
}
.ps-feature-name {
  font-weight: 600;
  font-size: 12px;
}
.ps-feature-status {
  font-size: 10px;
  color: var(--pa-muted);
}
.ps-status {
  margin-top: 8px;
  padding: 6px 8px;
  background: var(--pa-surface);
  border-radius: var(--pa-radius-sm);
  font-size: 11px;
  border: 1px solid var(--pa-border);
}
`;
  function injectSuiteStyles() {
    injectTheme();
    if (document.getElementById(`${SCRIPT_ID$3}-style`)) return;
    const style = document.createElement("style");
    style.id = `${SCRIPT_ID$3}-style`;
    style.textContent = SUITE_STYLES;
    document.head.appendChild(style);
  }
  function createStatusElement() {
    const status = document.createElement("div");
    status.className = "ps-status";
    status.textContent = t$3("statusReady");
    return status;
  }
  function makeDraggable(element, handle, { ignoreSelector = "", onDragEnd } = {}) {
    if (!element || !handle) return;
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    handle.addEventListener("mousedown", (event) => {
      if (event.button !== 0) return;
      if (ignoreSelector && event.target?.closest(ignoreSelector)) return;
      isDragging = true;
      offsetX = event.clientX - element.offsetLeft;
      offsetY = event.clientY - element.offsetTop;
      handle.style.cursor = "grabbing";
    });
    document.addEventListener("mousemove", (event) => {
      if (!isDragging) return;
      event.preventDefault();
      element.style.left = `${Math.max(0, event.clientX - offsetX)}px`;
      element.style.top = `${Math.max(0, event.clientY - offsetY)}px`;
      element.style.right = "auto";
      element.style.bottom = "auto";
    });
    document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      handle.style.cursor = "move";
      if (typeof onDragEnd === "function") {
        onDragEnd({
          left: element.offsetLeft,
          top: element.offsetTop
        });
      }
    });
  }
  function restorePosition(element, position) {
    if (!element || !position) return;
    const { left, top } = position;
    const maxLeft = window.innerWidth - 50;
    const maxTop = window.innerHeight - 50;
    const validLeft = Math.max(0, Math.min(left, maxLeft));
    const validTop = Math.max(0, Math.min(top, maxTop));
    element.style.left = `${validLeft}px`;
    element.style.top = `${validTop}px`;
    element.style.right = "auto";
    element.style.bottom = "auto";
  }
  const MODULE_CATEGORIES = {
    creator: {
      id: "creator",
      labelKey: "categoryCreator",
      descriptionKey: "categoryCreatorDesc",
      icon: "✨"
    },
    basic: {
      id: "basic",
      labelKey: "categoryBasic",
      descriptionKey: "categoryBasicDesc",
      icon: "📋"
    }
  };
  const MODULE_REGISTRY = [
{
      id: "price-list-creator",
      category: "creator",
      labelKey: "featurePriceListCreator",
      descriptionKey: "featurePriceListCreatorDesc",
      panelId: "plunet-price-list-creator-panel",
      toggleId: "plunet-price-list-creator-toggle",
      iconLabel: "PLC",
      iconColor: "#2e7d32",
      headerSelector: "#plunet-price-list-creator-panel-header",
      features: ["wizard", "single-page", "creator"]
    },
{
      id: "lang-pair-rate",
      category: "basic",
      labelKey: "featureLangPairRate",
      descriptionKey: "featureLangPairRateDesc",
      panelId: "plunet-lang-pair-rate-panel",
      toggleId: "plunet-lang-pair-rate-toggle",
      iconLabel: "LPR",
      iconColor: "#0b6aa6",
      headerSelector: "#plunet-lang-pair-rate-panel-header",
      features: ["text-input", "csv-import", "single-page"]
    },
    {
      id: "price-unit-batch-add",
      category: "basic",
      labelKey: "featurePricelistBatchAdd",
      descriptionKey: "featurePricelistBatchAddDesc",
      panelId: "plunet-price-unit-batch-add-panel",
      toggleId: "plunet-price-unit-batch-add-toggle",
      iconLabel: "PUBA",
      iconColor: "#e65100",
      headerSelector: "#plunet-price-unit-batch-add-panel-header",
      features: ["single-page", "batch-add"]
    }
  ];
  function getModulesByCategory(categoryId) {
    return MODULE_REGISTRY.filter((m) => m.category === categoryId);
  }
  function getCategorizedModules() {
    return Object.values(MODULE_CATEGORIES).map((category) => ({
      category,
      modules: getModulesByCategory(category.id)
    }));
  }
  const SERVICES = {
    "AIPE-Base": 72,
    "APB": 72,
    "AIPE-Full": 70,
    "APF": 70,
    "AIPE-Light": 71,
    "APL": 71,
    "Adapt": 40,
    "ADP": 40,
    "Consultation Service": 80,
    "CST": 80,
    "Copy Adaptation": 50,
    "CPA": 50,
    "Copywriting": 52,
    "CPW": 52,
    "Desktop Publishing": 5,
    "DTP": 5,
    "Editing": 37,
    "EDT": 37,
    "Feedback Implement": 54,
    "FBK": 54,
    "File Preparation": 47,
    "FPR": 47,
    "File Preparation & Editing": 57,
    "FED": 57,
    "Full Post-Editing": 58,
    "FPE": 58,
    "Game Script Polishing": 53,
    "GSP": 53,
    "Glossary Creation": 59,
    "GLC": 59,
    "In-Game LQA": 65,
    "IGL": 65,
    "In-Game LQA Project Management": 84,
    "LPM": 84,
    "Interpreting": 78,
    "ITP": 78,
    "LQA Lead": 66,
    "LQL": 66,
    "Language Sign-Off": 35,
    "LSO": 35,
    "Large Language Model": 86,
    "LLM": 86,
    "Light Post-Editing": 64,
    "LPE": 64,
    "Linguistic Hour": 39,
    "LHR": 39,
    "Linguistic Lead": 32,
    "LLD": 32,
    "Linguistic Quality Assurance": 45,
    "LQA": 45,
    "Linguistic Quality Evaluation": 61,
    "LQE": 61,
    "MTPE & Review": 85,
    "MPR": 85,
    "MTPE-Full": 73,
    "MPF": 73,
    "MTPE-Light": 74,
    "MPL": 74,
    "Multidimensional Quality Metrics": 43,
    "MQM": 43,
    "Others": 55,
    "OTH": 55,
    "Paraphrase": 81,
    "PRP": 81,
    "Project Management": 56,
    "PMG": 56,
    "Proofreading": 6,
    "PRF": 6,
    "Quality Assurance Support": 44,
    "QSP": 44,
    "Rating": 76,
    "RAT": 76,
    "Review": 21,
    "REV": 21,
    "SG Creation": 75,
    "SGC": 75,
    "Simultaneous Interpretation": 77,
    "SIT": 77,
    "Software Development": 79,
    "DEV": 79,
    "Subtitling": 62,
    "SUB": 62,
    "Test Lead": 82,
    "TSL": 82,
    "Testing": 33,
    "TES": 33,
    "Transcreation": 51,
    "TCR": 51,
    "Translation": 3,
    "TRA": 3,
    "Translation & Editing": 38,
    "TED": 38,
    "Translation & Editing & Proofreading": 27,
    "TEP": 27,
    "Voice-Over": 49,
    "VOV": 49
  };
  const LANGUAGES = {
    "Abkhazian": 516,
    "ab": 516,
    "Afrikaans": 517,
    "af": 517,
    "Albanian": 518,
    "sq": 518,
    "Arabic": 522,
    "ar": 522,
    "Arabic (Bahrain)": 521,
    "ar-BH": 521,
    "Arabic (Egypt)": 293,
    "ar-EG": 293,
    "Arabic (Iraq)": 346,
    "ar-IQ": 346,
    "Arabic (Jordan)": 348,
    "ar-JO": 348,
    "Arabic (Kuwait)": 349,
    "ar-KW": 349,
    "Arabic (Lebanon)": 350,
    "ar-LB": 350,
    "Arabic (Libya)": 351,
    "ar-LY": 351,
    "Arabic (Morocco)": 352,
    "ar-MA": 352,
    "Arabic (Oman)": 353,
    "ar-OM": 353,
    "Arabic (Saudi Arabia)": 354,
    "ar-SA": 354,
    "Arabic (Syria)": 355,
    "ar-SY": 355,
    "Arabic (Tunisia)": 356,
    "ar-TN": 356,
    "Arabic (U.A.E.)": 357,
    "ar-AE": 357,
    "Arabic (Yemen)": 358,
    "ar-YE": 358,
    "Armenian": 359,
    "hy": 359,
    "Assamese": 360,
    "as": 360,
    "Asturian": 519,
    "AST": 519,
    "Aymara": 361,
    "ay": 361,
    "Azerbaijani (Cyrillic)": 503,
    "az-Cyrl": 503,
    "Azerbaijani (Latin)": 504,
    "az-Latn": 504,
    "Bashkir": 363,
    "ba": 363,
    "Basque": 364,
    "eu": 364,
    "Belarusian": 365,
    "be": 365,
    "Bengali": 366,
    "bn": 366,
    "Bengali (India)": 367,
    "bn-IN": 367,
    "Bihari": 368,
    "BIH": 368,
    "Bislama": 369,
    "bi": 369,
    "Breton": 370,
    "br": 370,
    "Bulgarian": 320,
    "bg": 320,
    "Burmese": 505,
    "my": 505,
    "Cantonese (Hong Kong S.A.R.)": 524,
    "yue-hk": 524,
    "Carolinian": 515,
    "CAL": 515,
    "Catalan": 371,
    "ca": 371,
    "Chamorro": 372,
    "ch": 372,
    "Chinese": 345,
    "zh": 345,
    "Chinese (Macao)": 525,
    "zh-MO": 525,
    "Chinese (Malaysia)": 506,
    "zh-MY": 506,
    "Chinese (Simplified)": 60,
    "zh-Hans": 60,
    "Chinese (Simplified, China)": 342,
    "zh-CN": 342,
    "Chinese (Singapore)": 374,
    "zh-SG": 374,
    "Chinese (Traditional)": 59,
    "zh-Hant": 59,
    "Chinese (Traditional, Hong Kong S.A.R.)": 338,
    "zh-HK": 338,
    "Chinese (Traditional, Taiwan)": 340,
    "zh-TW": 340,
    "Chinese (United States)": 508,
    "zh-US": 508,
    "Croatian": 170,
    "hr": 170,
    "Czech": 280,
    "cs": 280,
    "Danish": 322,
    "da": 322,
    "Dari (Afghan Persian)": 375,
    "prs-AF": 375,
    "Dutch": 203,
    "nl": 203,
    "Dutch (Netherlands)": 376,
    "nl-NL": 376,
    "English": 344,
    "en": 344,
    "English (Australia)": 377,
    "en-AU": 377,
    "English (Belize)": 378,
    "en-BZ": 378,
    "English (Canada)": 379,
    "en-CA": 379,
    "English (Caribbean)": 380,
    "en-029": 380,
    "English (Ireland)": 381,
    "en-IE": 381,
    "English (Jamaica)": 382,
    "en-JM": 382,
    "English (Philippines)": 373,
    "en-PH": 373,
    "English (Singapore)": 526,
    "en-SG": 526,
    "English (South Africa)": 383,
    "en-ZA": 383,
    "English (United Kingdom)": 341,
    "en-GB": 341,
    "English (United States)": 339,
    "en-US": 339,
    "English (Zimbabwe)": 384,
    "en-ZW": 384,
    "Estonian": 385,
    "et": 385,
    "Farsi": 335,
    "fa": 335,
    "Farsi (Persian)": 386,
    "fa-IR": 386,
    "Fijian": 387,
    "fj": 387,
    "Filipino": 362,
    "fil": 362,
    "Finnish": 325,
    "fi": 325,
    "Flemish": 388,
    "nl-BE": 388,
    "French": 389,
    "fr": 389,
    "French (Belgium)": 390,
    "fr-BE": 390,
    "French (Canada)": 333,
    "fr-CA": 333,
    "French (France)": 326,
    "fr-FR": 326,
    "French (Luxembourg)": 391,
    "fr-LU": 391,
    "French (Monaco)": 392,
    "fr-MC": 392,
    "French (Switzerland)": 393,
    "fr-CH": 393,
    "Frisian": 394,
    "fy": 394,
    "Gaelic (Scotland)": 395,
    "gd-GB": 395,
    "Galician": 397,
    "gl": 397,
    "Georgian": 398,
    "ka": 398,
    "German": 399,
    "de": 399,
    "German (Austria)": 400,
    "de-AT": 400,
    "German (Germany)": 323,
    "de-DE": 323,
    "German (Luxembourg)": 401,
    "de-LU": 401,
    "Greek": 126,
    "el-GR": 126,
    "Greenlandic": 402,
    "kl": 402,
    "Gujarati": 403,
    "gu": 403,
    "Haitian Creole": 329,
    "ha": 329,
    "Hebrew": 404,
    "he": 404,
    "Hindi": 134,
    "hi": 134,
    "Hmong Dô (Vietnam)": 529,
    "hmv": 529,
    "Hmong, Mong (China, Laos)": 520,
    "hmn": 520,
    "Hungarian": 288,
    "hu": 288,
    "Igbo": 405,
    "ig": 405,
    "Indonesian": 523,
    "id": 523,
    "Interlingua": 406,
    "INA": 406,
    "Interlingue": 407,
    "ILE": 407,
    "Inuktitut": 408,
    "iu": 408,
    "Inupiak": 409,
    "IPK": 409,
    "Irish": 410,
    "ga": 410,
    "Italian": 141,
    "it": 141,
    "Italian (Italy)": 411,
    "it-IT": 411,
    "Italian (Switzerland)": 412,
    "it-CH": 412,
    "Japanese": 142,
    "ja": 142,
    "Javanese": 413,
    "jv-Latn": 413,
    "Kannada": 414,
    "kn": 414,
    "Kashmiri": 415,
    "CAS": 415,
    "Kazakh": 416,
    "kk": 416,
    "Khmer": 528,
    "km": 528,
    "Kinyarwanda": 417,
    "rw": 417,
    "Konkani": 418,
    "kok": 418,
    "Korean": 290,
    "ko": 290,
    "Kurdish": 419,
    "KUR": 419,
    "Lao": 330,
    "lo": 330,
    "Lao (Laothian)": 420,
    "lo-LA": 420,
    "Latin": 422,
    "la": 422,
    "Latvian": 179,
    "lv": 179,
    "Lingala": 423,
    "ln": 423,
    "Lithuanian": 181,
    "lt-LT": 181,
    "Luxembourgish": 424,
    "lb": 424,
    "Macedonian": 425,
    "mk": 425,
    "Malagasy": 512,
    "mg": 512,
    "Malay": 511,
    "ms": 511,
    "Malayalam": 426,
    "ml": 426,
    "Maltese": 427,
    "mt": 427,
    "Maori": 428,
    "mi-NZ": 428,
    "Marathi": 429,
    "mr": 429,
    "Marshallese": 421,
    "MAH": 421,
    "Mongolian": 430,
    "mn": 430,
    "Nauru": 431,
    "NAU": 431,
    "Ndebele": 432,
    "nd-ZW": 432,
    "Nepali": 433,
    "ne": 433,
    "Northern Sotho": 434,
    "nso-ZA": 434,
    "Norwegian": 435,
    "no": 435,
    "Norwegian (Bokmål)": 308,
    "nb": 308,
    "Norwegian (Nynorsk)": 437,
    "nn": 437,
    "Occitan": 438,
    "oc": 438,
    "Oriya": 439,
    "or-IN": 439,
    "Oromo": 440,
    "om-ET": 440,
    "Palauan": 441,
    "PAU": 441,
    "Pashto": 442,
    "ps": 442,
    "Polish": 289,
    "pl": 289,
    "Portuguese": 444,
    "pt": 444,
    "Portuguese (Brazil)": 218,
    "pt-BR": 218,
    "Portuguese (Portugal)": 219,
    "pt-PT": 219,
    "Punjabi": 445,
    "pa": 445,
    "Quechua": 443,
    "quz": 443,
    "Rhaeto-Romance": 446,
    "rm-CH": 446,
    "Romanian": 447,
    "ro": 447,
    "Rundi": 396,
    "RUN": 396,
    "Russian": 224,
    "ru": 224,
    "Samoan": 448,
    "SMO": 448,
    "Sangho": 449,
    "SAG": 449,
    "Sanskrit": 450,
    "sa": 450,
    "Serbian": 451,
    "sr": 451,
    "Serbian (Cyrillic)": 312,
    "sr-Cyrl": 312,
    "Serbian (Latin)": 313,
    "sr-Latn": 313,
    "Sesotho": 452,
    "SOT": 452,
    "Sindhi": 453,
    "sd-Arab": 453,
    "Sinhalese": 454,
    "si-LK": 454,
    "Slovak": 240,
    "sk-SK": 240,
    "Slovene": 241,
    "sl-SI": 241,
    "Slovenian": 455,
    "sl": 455,
    "Somali": 331,
    "so": 331,
    "Somali (Djibouti)": 456,
    "so-DJ": 456,
    "Somali (Ethiopia)": 457,
    "so-ET": 457,
    "Somali (Kenya)": 458,
    "so-KE": 458,
    "Somali (Somalia)": 459,
    "so-SO": 459,
    "Sorbian (Upper)": 460,
    "hsb-DE": 460,
    "Spanish": 527,
    "es": 527,
    "Spanish (Argentina) ": 328,
    "es-AR": 328,
    "Spanish (Bolivia)": 461,
    "es-BO": 461,
    "Spanish (Colombia)": 462,
    "es-CO": 462,
    "Spanish (Cuba)": 463,
    "es-CU": 463,
    "Spanish (Dominican Republic)": 464,
    "es-DO": 464,
    "Spanish (Ecuador)": 465,
    "es-EC": 465,
    "Spanish (El Salvador)": 467,
    "es-SV": 467,
    "Spanish (Europe)": 507,
    "es-150": 507,
    "Spanish (Guatemala)": 468,
    "es-GT": 468,
    "Spanish (Honduras)": 469,
    "es-HN": 469,
    "Spanish (Latin America)": 509,
    "es-419": 509,
    "Spanish (Mexico)": 327,
    "es-MX": 327,
    "Spanish (Nicaragua)": 470,
    "es-NI": 470,
    "Spanish (Panama)": 471,
    "es-PA": 471,
    "Spanish (Paraguay)": 472,
    "es-PY": 472,
    "Spanish (Peru)": 473,
    "es-PE": 473,
    "Spanish (Puerto Rico)": 474,
    "es-PR": 474,
    "Spanish (Spain)": 292,
    "es-ES": 292,
    "Spanish (USA)": 332,
    "es-US": 332,
    "Spanish (Uruguay)": 475,
    "es-UY": 475,
    "Spanish (Venezuela)": 476,
    "es-VE": 476,
    "Sundanese": 477,
    "SUN": 477,
    "Swahili": 478,
    "sw-KE": 478,
    "Swati": 466,
    "SSW": 466,
    "Swedish": 227,
    "sv": 227,
    "Swedish (Finland)": 479,
    "sv-FI": 479,
    "Swedish (Sweden)": 480,
    "sv-SE": 480,
    "Syriac": 481,
    "syr": 481,
    "Tagalog": 482,
    "TGL": 482,
    "Tajik": 483,
    "TGK": 483,
    "Tamil": 484,
    "ta": 484,
    "Tatar": 485,
    "tt": 485,
    "Telugu": 486,
    "te": 486,
    "Thai": 487,
    "th": 487,
    "Tibetan": 514,
    "bo": 514,
    "Tigrinya": 488,
    "TIR": 488,
    "Tonga": 489,
    "to": 489,
    "Tsonga": 490,
    "ts-ZA": 490,
    "Tswana (Botswana)": 491,
    "tn-BW": 491,
    "Tswana (South Africa)": 492,
    "tn-ZA": 492,
    "Turkish": 284,
    "tr": 284,
    "Turkmen": 493,
    "tk": 493,
    "Twi": 494,
    "TWI": 494,
    "Ukrainian": 336,
    "uk": 336,
    "Urdu": 337,
    "ur": 337,
    "Uyghur": 510,
    "ug": 510,
    "Uzbek": 495,
    "UZB": 495,
    "Vietnamese": 496,
    "vi": 496,
    "Volapuk": 497,
    "VOL": 497,
    "Welsh": 498,
    "cy": 498,
    "Wolof": 499,
    "wo": 499,
    "Yiddish": 500,
    "YID": 500,
    "Yoruba": 501,
    "yo": 501,
    "Zhuang": 513,
    "ZHA": 513,
    "Zulu": 502,
    "zu": 502
  };
  const SCRIPT_VERSION$2 = "1.1.0";
  const SCRIPT_ID$2 = "plunet-price-list-creator";
  const CONFIG$2 = {
    WAIT_AFTER_CLICK: 500,
    WAIT_AFTER_INPUT: 600,
    WAIT_FOR_ELEMENT: 8e3
  };
  const DEFAULTS = {
    jobtype: "TRA",
    calcbasis: "Words",
    currency: "USD"
  };
  const CALC_BASIS_OPTIONS = [
    { value: "Words", label: "Words", basePrefix: "Words" },
    { value: "Chars", label: "Chars", basePrefix: "Chars" },
    { value: "Hours", label: "Hours", basePrefix: "Hour(s)" },
    { value: "Jobs", label: "Jobs", basePrefix: "Job(s)" }
  ];
  const CURRENCY_OPTIONS = ["USD", "EUR", "CNY", "GBP", "JPY"];
  const FUZZY_INTERVALS$1 = [
    { id: "reps", label: "Repetitions", suffix: "Repetitions", defaultValue: 15 },
    { id: "101", label: "101% Match", suffix: "101% Match", defaultValue: 0 },
    { id: "100", label: "100% Match", suffix: "100% Match", defaultValue: 15 },
    { id: "95-99", label: "95-99% Match", suffix: "95-99% Match", defaultValue: 25 },
    { id: "85-94", label: "85-94% Match", suffix: "85-94% Match", defaultValue: 40 },
    { id: "75-84", label: "75-84% Match", suffix: "75-84% Match", defaultValue: 50 },
    { id: "50-74", label: "50-74% Match", suffix: "50-74% Match", defaultValue: 100 },
    { id: "new-discount", label: "New Discount", suffix: "New Discount", defaultValue: 90 }
  ];
  const WEIGHTED_SUFFIXES$1 = [
    "Repetitions",
    "101% Match",
    "100% Match",
    "95-99% Match",
    "85-94% Match",
    "75-84% Match",
    "50-74% Match"
  ];
  function buildJobTypeOptions() {
    const abbrevToId = new Map();
    const idToFull = new Map();
    for (const [key, id] of Object.entries(SERVICES)) {
      if (key === key.toUpperCase() && key.length <= 3) {
        abbrevToId.set(key, id);
      }
    }
    for (const [key, id] of Object.entries(SERVICES)) {
      if (key !== key.toUpperCase() && !idToFull.has(id)) {
        idToFull.set(id, key);
      }
    }
    const options = [];
    for (const [abbrev, id] of abbrevToId.entries()) {
      const fullName = idToFull.get(id) || abbrev;
      options.push({
        value: abbrev,
        label: `${fullName} (${abbrev})`,
        fullName
      });
    }
    options.sort((a, b) => a.fullName.localeCompare(b.fullName));
    return options;
  }
  const JOB_TYPE_OPTIONS = buildJobTypeOptions();
  const I18N$2 = {
    en: {
      scriptName: "Price List Creator",
      versionLabel: "v{version}",
step1Label: "Price List Settings",
      prefixLabel: "Prefix",
      prefixPlaceholder: "e.g. Client-A",
      jobtypeLabel: "Job Type",
      calcbasisLabel: "Calc Basis",
      currencyLabel: "Currency",
      generatedNameLabel: "Price List Name",
step2LangLabel: "Language Pairs & Rates",
      step2LangPlaceholder: "English	French (France)	0.075\nEnglish	German	0.08",
      step2LangHelp: "Tab-separated: Source  Target  Rate",
step4Label: "Fuzzy Settings",
      newDiscountCheckbox: "Include New Discount",
      fuzzyPercentLabel: "Fuzzy Percentages",
executeBtn: "Create & Execute",
      stopBtn: "Stop",
      clearBtn: "Clear",
statusReady: "Ready to create price list",
      statusNoData: "No language pairs entered",
      statusCreating: "Creating price list...",
      statusExecuting: "Executing step {current}/{total}: {step}",
      statusCompleted: "Price list created successfully",
      statusStopped: "Stopped at step {current}/{total}",
      statusError: "Error: {message}",
warningLangNotFound: "Language not found: {lang}",
logLabel: "Log",
fontSizeLabel: "Font",
      fontSizeSmall: "S",
      fontSizeMedium: "M",
      fontSizeLarge: "L"
    },
    zh: {
      scriptName: "价格表创建器",
      versionLabel: "v{version}",
step1Label: "价格表设置",
      prefixLabel: "前缀",
      prefixPlaceholder: "例如 Client-A",
      jobtypeLabel: "服务类型",
      calcbasisLabel: "计价单位",
      currencyLabel: "货币",
      generatedNameLabel: "价格表名称",
step2LangLabel: "语言对和价格",
      step2LangPlaceholder: "English	French (France)	0.075\nEnglish	German	0.08",
      step2LangHelp: "Tab分隔: 源语言  目标语言  价格",
step4Label: "模糊区间设置",
      newDiscountCheckbox: "包含 New Discount",
      fuzzyPercentLabel: "模糊区间百分比",
executeBtn: "创建并执行",
      stopBtn: "停止",
      clearBtn: "清空",
statusReady: "准备创建价格表",
      statusNoData: "未输入语言对",
      statusCreating: "正在创建价格表...",
      statusExecuting: "执行步骤 {current}/{total}: {step}",
      statusCompleted: "价格表创建成功",
      statusStopped: "已停止于步骤 {current}/{total}",
      statusError: "错误: {message}",
warningLangNotFound: "未找到语言: {lang}",
logLabel: "日志",
fontSizeLabel: "字体",
      fontSizeSmall: "小",
      fontSizeMedium: "中",
      fontSizeLarge: "大"
    }
  };
  I18N$2["zh-cn"] = I18N$2.zh;
  const DEFAULT_LOCALE$2 = "en";
  const ACTIVE_LOCALE$1 = (() => {
    const raw = (navigator.language || DEFAULT_LOCALE$2).toLowerCase();
    if (I18N$2[raw]) return raw;
    const base = raw.split("-")[0];
    if (I18N$2[base]) return base;
    return DEFAULT_LOCALE$2;
  })();
  function t$2(key, vars = null) {
    const template = I18N$2[ACTIVE_LOCALE$1]?.[key] || I18N$2[DEFAULT_LOCALE$2]?.[key] || key;
    if (!vars || typeof vars !== "object") return template;
    return template.replace(/\{(\w+)\}/g, (_, token) => {
      if (Object.prototype.hasOwnProperty.call(vars, token)) {
        return String(vars[token]);
      }
      return "";
    });
  }
  const FONT_SIZE_KEY = `${SCRIPT_ID$2}-font-size`;
  function buildFuzzyRowsHtml$1() {
    return FUZZY_INTERVALS$1.map((interval) => {
      const isNewDiscount = interval.id === "new-discount";
      return `
      <div class="plc-fuzzy-row${isNewDiscount ? " plc-new-discount-row" : ""}" data-interval="${interval.id}">
        <label class="plc-fuzzy-label">${interval.label}</label>
        <div class="plc-fuzzy-input-wrap">
          <input type="number"
            id="plc-fuzzy-${interval.id}"
            class="plc-fuzzy-input pa-input"
            value="${interval.defaultValue}"
            min="0"
            max="100"
            step="1"
          />
          <span class="plc-fuzzy-suffix">%</span>
        </div>
      </div>
    `;
    }).join("");
  }
  function buildJobTypeOptionsHtml(selected) {
    return JOB_TYPE_OPTIONS.map(
      (opt) => `<option value="${opt.value}"${opt.value === selected ? " selected" : ""}>${opt.label}</option>`
    ).join("");
  }
  function buildCalcBasisOptionsHtml(selected) {
    return CALC_BASIS_OPTIONS.map(
      (opt) => `<option value="${opt.value}"${opt.value === selected ? " selected" : ""}>${opt.label}</option>`
    ).join("");
  }
  function buildCurrencyOptionsHtml(selected) {
    return CURRENCY_OPTIONS.map(
      (opt) => `<option value="${opt}"${opt === selected ? " selected" : ""}>${opt}</option>`
    ).join("");
  }
  const PANEL_STYLES = `
  #${SCRIPT_ID$2}-panel {
    ${THEME_VARIABLES}
    position: fixed;
    top: 60px;
    right: 50px;
    width: min(420px, calc(100vw - 24px));
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    background: var(--pa-panel-bg);
    border: 1px solid var(--pa-border);
    border-radius: var(--pa-radius);
    box-shadow: var(--pa-shadow);
    font-family: var(--pa-font);
    font-size: var(--plc-font-base, 11px);
    color: var(--pa-ink);
    z-index: 99999;
    display: none;
  }

  /* Font size presets */
  #${SCRIPT_ID$2}-panel.font-small {
    --plc-font-base: 11px;
    --plc-font-input: 11px;
    --plc-font-label: 10px;
    --plc-font-header: 12px;
  }

  #${SCRIPT_ID$2}-panel.font-medium {
    --plc-font-base: 13px;
    --plc-font-input: 13px;
    --plc-font-label: 11px;
    --plc-font-header: 14px;
  }

  #${SCRIPT_ID$2}-panel.font-large {
    --plc-font-base: 15px;
    --plc-font-input: 15px;
    --plc-font-label: 13px;
    --plc-font-header: 16px;
  }

  #${SCRIPT_ID$2}-panel.visible {
    display: block;
  }

  /* Header */
  #${SCRIPT_ID$2}-panel-header {
    background: var(--pa-header-bg);
    padding: 10px 14px;
    border-bottom: 1px solid var(--pa-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
    user-select: none;
    border-radius: var(--pa-radius) var(--pa-radius) 0 0;
  }

  #${SCRIPT_ID$2}-panel-header .plc-title {
    font-weight: 600;
    font-size: var(--plc-font-header, 12px);
    color: var(--pa-ink);
  }

  #${SCRIPT_ID$2}-panel-header .plc-version {
    font-size: calc(var(--plc-font-label, 10px) - 1px);
    color: var(--pa-muted);
    margin-left: 8px;
  }

  /* Font size selector */
  .plc-font-size-selector {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-right: 8px;
  }

  .plc-font-size-btn {
    background: transparent;
    border: 1px solid var(--pa-border);
    border-radius: 3px;
    cursor: pointer;
    color: var(--pa-muted);
    padding: 2px 5px;
    font-size: 10px;
    line-height: 1;
    min-width: 18px;
  }

  .plc-font-size-btn:hover {
    background: var(--pa-surface);
    color: var(--pa-ink);
  }

  .plc-font-size-btn.active {
    background: var(--pa-accent);
    border-color: var(--pa-accent);
    color: #fff;
  }

  .plc-header-right {
    display: flex;
    align-items: center;
  }

  #${SCRIPT_ID$2}-panel-header .plc-close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--pa-muted);
    font-size: 18px;
    line-height: 1;
    padding: 2px 6px;
    border-radius: 4px;
  }

  #${SCRIPT_ID$2}-panel-header .plc-close-btn:hover {
    background: rgba(0,0,0,0.1);
    color: var(--pa-ink);
  }

  /* Body */
  #${SCRIPT_ID$2}-panel-body {
    padding: 14px;
  }

  /* Sections */
  .plc-section {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px dashed var(--pa-border-dashed);
  }

  .plc-section:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .plc-section-label {
    font-weight: 600;
    color: var(--pa-ink);
    margin-bottom: 8px;
    font-size: var(--plc-font-base, 11px);
  }

  .plc-help-text {
    font-size: var(--plc-font-label, 10px);
    color: var(--pa-muted);
    margin-top: 4px;
  }

  /* Prefix row */
  .plc-prefix-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .plc-prefix-label {
    font-size: var(--plc-font-label, 10px);
    color: var(--pa-muted);
    white-space: nowrap;
    min-width: 40px;
  }

  .plc-prefix-input {
    flex: 1;
  }

  /* Settings row - 3 items */
  .plc-settings-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  .plc-settings-item {
    flex: 1;
    min-width: 0;
  }

  .plc-settings-label {
    font-size: var(--plc-font-label, 10px);
    color: var(--pa-muted);
    margin-bottom: 4px;
  }

  /* Generated name preview */
  .plc-generated-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: var(--pa-surface);
    border-radius: var(--pa-radius-sm);
    border: 1px solid var(--pa-border);
  }

  .plc-generated-name-label {
    font-size: var(--plc-font-label, 10px);
    color: var(--pa-muted);
    white-space: nowrap;
  }

  .plc-generated-name {
    font-size: var(--plc-font-base, 11px);
    font-weight: 600;
    color: var(--pa-ink);
    word-break: break-all;
  }

  /* Inputs */
  .plc-input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--pa-border);
    border-radius: var(--pa-radius-sm);
    font-family: var(--pa-font);
    font-size: var(--plc-font-input, 11px);
    background: var(--pa-surface-solid);
    color: var(--pa-ink);
    box-sizing: border-box;
  }

  .plc-input:focus {
    outline: none;
    border-color: var(--pa-accent);
  }

  .plc-textarea {
    min-height: 70px;
    resize: vertical;
    font-family: var(--pa-font-mono);
    font-size: var(--plc-font-input, 11px);
  }

  .plc-select {
    width: 100%;
    padding: 5px 6px;
    border: 1px solid var(--pa-border);
    border-radius: var(--pa-radius-sm);
    font-family: var(--pa-font);
    font-size: var(--plc-font-input, 11px);
    background: var(--pa-surface-solid);
    color: var(--pa-ink);
    cursor: pointer;
  }

  /* Fuzzy settings */
  .plc-fuzzy-section {
    margin-top: 12px;
  }

  .plc-fuzzy-section.hidden {
    display: none;
  }

  .plc-checkbox-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .plc-checkbox-row input[type="checkbox"] {
    cursor: pointer;
  }

  .plc-checkbox-row label {
    cursor: pointer;
    font-size: var(--plc-font-base, 11px);
  }

  .plc-fuzzy-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--pa-surface);
    padding: 12px;
    border-radius: var(--pa-radius-sm);
    border: 1px solid var(--pa-border);
  }

  .plc-fuzzy-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .plc-fuzzy-row.plc-new-discount-row {
    display: none;
  }

  .plc-fuzzy-row.plc-new-discount-row.visible {
    display: flex;
  }

  .plc-fuzzy-label {
    flex: 1;
    font-size: var(--plc-font-base, 11px);
    color: var(--pa-ink);
  }

  .plc-fuzzy-input-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .plc-fuzzy-input {
    width: 55px;
    padding: 3px 5px;
    text-align: right;
    font-size: var(--plc-font-input, 11px);
  }

  .plc-fuzzy-suffix {
    font-size: var(--plc-font-label, 10px);
    color: var(--pa-muted);
  }

  /* Buttons */
  .plc-button-row {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .plc-btn {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: var(--pa-radius-sm);
    font-family: var(--pa-font);
    font-size: var(--plc-font-base, 11px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .plc-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .plc-btn-primary {
    background: var(--pa-accent);
    color: #fff;
  }

  .plc-btn-primary:hover:not(:disabled) {
    background: var(--pa-accent-strong);
  }

  .plc-btn-danger {
    background: var(--pa-danger);
    color: #fff;
  }

  .plc-btn-danger:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  .plc-btn-ghost {
    background: transparent;
    color: var(--pa-muted);
    border: 1px solid var(--pa-border);
  }

  .plc-btn-ghost:hover:not(:disabled) {
    background: var(--pa-surface);
    color: var(--pa-ink);
  }

  /* Status */
  .plc-status {
    margin-top: 10px;
    padding: 6px 10px;
    border-radius: var(--pa-radius-sm);
    font-size: var(--plc-font-label, 10px);
    background: var(--pa-surface);
    color: var(--pa-muted);
  }

  .plc-status.success {
    background: rgba(31, 138, 80, 0.1);
    color: var(--pa-success);
  }

  .plc-status.error {
    background: rgba(194, 61, 61, 0.1);
    color: var(--pa-danger);
  }

  /* Log */
  .plc-log-section {
    margin-top: 16px;
  }

  .plc-log-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: var(--plc-font-label, 10px);
    color: var(--pa-muted);
    user-select: none;
  }

  .plc-log-toggle:hover {
    color: var(--pa-ink);
  }

  .plc-log-toggle .plc-arrow {
    transition: transform 0.2s;
  }

  .plc-log-toggle.expanded .plc-arrow {
    transform: rotate(90deg);
  }

  .plc-log-box {
    display: none;
    margin-top: 8px;
    padding: 6px;
    background: #1e1e1e;
    border-radius: var(--pa-radius-sm);
    font-family: var(--pa-font-mono);
    font-size: calc(var(--plc-font-label, 10px) - 1px);
    color: #d4d4d4;
    max-height: 120px;
    overflow-y: auto;
  }

  .plc-log-box.visible {
    display: block;
  }

  .plc-log-line {
    padding: 1px 0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .plc-log-line.warn {
    color: #dcdcaa;
  }

  .plc-log-line.error {
    color: #f48771;
  }

  .plc-log-line.success {
    color: #89d185;
  }
`;
  function createPriceListCreatorPanel() {
    if (!document.getElementById(`${SCRIPT_ID$2}-styles`)) {
      const styleEl = document.createElement("style");
      styleEl.id = `${SCRIPT_ID$2}-styles`;
      styleEl.textContent = PANEL_STYLES;
      document.head.appendChild(styleEl);
    }
    const panelHtml = `
    <div id="${SCRIPT_ID$2}-panel" class="font-small">
      <div id="${SCRIPT_ID$2}-panel-header">
        <div>
          <span class="plc-title">${t$2("scriptName")}</span>
          <span class="plc-version">${t$2("versionLabel", { version: SCRIPT_VERSION$2 })}</span>
        </div>
        <div class="plc-header-right">
          <div class="plc-font-size-selector">
            <button class="plc-font-size-btn active" data-size="small" title="${t$2("fontSizeSmall")}">${t$2("fontSizeSmall")}</button>
            <button class="plc-font-size-btn" data-size="medium" title="${t$2("fontSizeMedium")}">${t$2("fontSizeMedium")}</button>
            <button class="plc-font-size-btn" data-size="large" title="${t$2("fontSizeLarge")}">${t$2("fontSizeLarge")}</button>
          </div>
          <button class="plc-close-btn" title="Minimize">&times;</button>
        </div>
      </div>
      <div id="${SCRIPT_ID$2}-panel-body">
        <!-- Step 1: Price List Settings -->
        <div class="plc-section">
          <div class="plc-section-label">${t$2("step1Label")}</div>

          <!-- Row 1: Prefix input -->
          <div class="plc-prefix-row">
            <label class="plc-prefix-label" for="plc-prefix-input">${t$2("prefixLabel")}</label>
            <input type="text"
              id="plc-prefix-input"
              class="plc-input plc-prefix-input"
              placeholder="${t$2("prefixPlaceholder")}"
            />
          </div>

          <!-- Row 2: Job Type, Calc Basis, Currency -->
          <div class="plc-settings-row">
            <div class="plc-settings-item">
              <div class="plc-settings-label">${t$2("jobtypeLabel")}</div>
              <select id="plc-jobtype" class="plc-select">
                ${buildJobTypeOptionsHtml(DEFAULTS.jobtype)}
              </select>
            </div>
            <div class="plc-settings-item">
              <div class="plc-settings-label">${t$2("calcbasisLabel")}</div>
              <select id="plc-calcbasis" class="plc-select">
                ${buildCalcBasisOptionsHtml(DEFAULTS.calcbasis)}
              </select>
            </div>
            <div class="plc-settings-item">
              <div class="plc-settings-label">${t$2("currencyLabel")}</div>
              <select id="plc-currency" class="plc-select">
                ${buildCurrencyOptionsHtml(DEFAULTS.currency)}
              </select>
            </div>
          </div>

          <!-- Row 3: Generated Name Preview -->
          <div class="plc-generated-name-row">
            <span class="plc-generated-name-label">${t$2("generatedNameLabel")}:</span>
            <span id="plc-generated-name" class="plc-generated-name">-</span>
          </div>
        </div>

        <!-- Step 2: Language Pairs & Rates -->
        <div class="plc-section">
          <div class="plc-section-label">${t$2("step2LangLabel")}</div>
          <textarea
            id="plc-langpairs-input"
            class="plc-input plc-textarea"
            placeholder="${t$2("step2LangPlaceholder")}"
          ></textarea>
          <div class="plc-help-text">${t$2("step2LangHelp")}</div>
        </div>

        <!-- Step 3: Fuzzy Settings (Words/Chars only) -->
        <div id="plc-fuzzy-section" class="plc-section plc-fuzzy-section">
          <div class="plc-section-label">${t$2("step4Label")}</div>

          <div class="plc-checkbox-row">
            <input type="checkbox" id="plc-new-discount-checkbox" />
            <label for="plc-new-discount-checkbox">${t$2("newDiscountCheckbox")}</label>
          </div>

          <div class="plc-fuzzy-grid">
            ${buildFuzzyRowsHtml$1()}
          </div>
        </div>

        <!-- Buttons -->
        <div class="plc-button-row">
          <button id="plc-execute-btn" class="plc-btn plc-btn-primary">${t$2("executeBtn")}</button>
          <button id="plc-stop-btn" class="plc-btn plc-btn-danger" disabled>${t$2("stopBtn")}</button>
          <button id="plc-clear-btn" class="plc-btn plc-btn-ghost">${t$2("clearBtn")}</button>
        </div>

        <!-- Status -->
        <div id="plc-status" class="plc-status">${t$2("statusReady")}</div>

        <!-- Log -->
        <div class="plc-log-section">
          <div id="plc-log-toggle" class="plc-log-toggle">
            <span class="plc-arrow">&#9654;</span>
            <span>${t$2("logLabel")}</span>
          </div>
          <div id="plc-log-box" class="plc-log-box"></div>
        </div>
      </div>
    </div>
  `;
    const container = document.createElement("div");
    container.innerHTML = panelHtml;
    document.body.appendChild(container.firstElementChild);
    const panel = document.getElementById(`${SCRIPT_ID$2}-panel`);
    const header = document.getElementById(`${SCRIPT_ID$2}-panel-header`);
    const closeBtn = header.querySelector(".plc-close-btn");
    const fontSizeBtns = header.querySelectorAll(".plc-font-size-btn");
    const prefixInput = document.getElementById("plc-prefix-input");
    const jobtypeSelect = document.getElementById("plc-jobtype");
    const calcbasisSelect = document.getElementById("plc-calcbasis");
    const currencySelect = document.getElementById("plc-currency");
    const generatedNameSpan = document.getElementById("plc-generated-name");
    const langpairsInput = document.getElementById("plc-langpairs-input");
    const fuzzySection = document.getElementById("plc-fuzzy-section");
    const newDiscountCheckbox = document.getElementById("plc-new-discount-checkbox");
    const executeBtn = document.getElementById("plc-execute-btn");
    const stopBtn = document.getElementById("plc-stop-btn");
    const clearBtn = document.getElementById("plc-clear-btn");
    const statusDiv = document.getElementById("plc-status");
    const logToggle = document.getElementById("plc-log-toggle");
    const logBox = document.getElementById("plc-log-box");
    const ui = {
      panel,
      prefixInput,
      jobtypeSelect,
      calcbasisSelect,
      currencySelect,
      generatedNameSpan,
      langpairsInput,
      fuzzySection,
      newDiscountCheckbox,
      executeBtn,
      stopBtn,
      clearBtn,
      statusDiv,
      logBox,
show() {
        panel.classList.add("visible");
      },
hide() {
        panel.classList.remove("visible");
      },
toggle() {
        panel.classList.toggle("visible");
      },
getPrefix() {
        return prefixInput.value.trim();
      },
generateName() {
        const prefix = this.getPrefix();
        const jobtypeFullName = this.getJobTypeFullName();
        const calcbasis = this.getCalcBasis();
        const currency = this.getCurrency();
        if (!prefix) return "";
        return `${prefix}_${jobtypeFullName}_${calcbasis}_${currency}`;
      },
getJobTypeFullName() {
        const value = jobtypeSelect.value;
        const opt = JOB_TYPE_OPTIONS.find((o) => o.value === value);
        return opt ? opt.fullName : value;
      },
updateGeneratedName() {
        const name = this.generateName();
        generatedNameSpan.textContent = name || "-";
      },
getName() {
        return this.generateName();
      },
getJobType() {
        return jobtypeSelect.value;
      },
getCalcBasis() {
        return calcbasisSelect.value;
      },
getCurrency() {
        return currencySelect.value;
      },
isWordsChars() {
        const calcbasis = this.getCalcBasis();
        return calcbasis === "Words" || calcbasis === "Chars";
      },
getLangPairsText() {
        return langpairsInput.value;
      },
includeNewDiscount() {
        return newDiscountCheckbox.checked;
      },
getFuzzyValues(includeNewDiscount = false) {
        const values = [];
        FUZZY_INTERVALS$1.forEach((interval) => {
          if (interval.id === "new-discount" && !includeNewDiscount) return;
          const input = document.getElementById(`plc-fuzzy-${interval.id}`);
          const val = input?.value ? parseFloat(input.value) : null;
          if (val != null && !isNaN(val)) {
            values.push({ id: interval.id, suffix: interval.suffix, percentage: val });
          }
        });
        return values;
      },
getBasePricePrefix() {
        const calcbasis = this.getCalcBasis();
        const opt = CALC_BASIS_OPTIONS.find((o) => o.value === calcbasis);
        return opt ? opt.basePrefix : calcbasis;
      },
setStatus(message, type = "") {
        statusDiv.textContent = message;
        statusDiv.className = "plc-status";
        if (type) statusDiv.classList.add(type);
      },
addLog(message, type = "") {
        const line = document.createElement("div");
        line.className = "plc-log-line";
        if (type) line.classList.add(type);
        line.textContent = `[${( new Date()).toLocaleTimeString()}] ${message}`;
        logBox.appendChild(line);
        logBox.scrollTop = logBox.scrollHeight;
      },
clearLog() {
        logBox.innerHTML = "";
      },
syncButtonState(state) {
        const { isRunning } = state;
        const hasPrefix = prefixInput.value.trim().length > 0;
        const hasLangPairs = langpairsInput.value.trim().length > 0;
        executeBtn.disabled = isRunning || !hasPrefix || !hasLangPairs;
        stopBtn.disabled = !isRunning;
        clearBtn.disabled = isRunning;
        prefixInput.disabled = isRunning;
        langpairsInput.disabled = isRunning;
        jobtypeSelect.disabled = isRunning;
        calcbasisSelect.disabled = isRunning;
        currencySelect.disabled = isRunning;
        newDiscountCheckbox.disabled = isRunning;
      },
clear() {
        prefixInput.value = "";
        langpairsInput.value = "";
        jobtypeSelect.value = DEFAULTS.jobtype;
        calcbasisSelect.value = DEFAULTS.calcbasis;
        currencySelect.value = DEFAULTS.currency;
        newDiscountCheckbox.checked = false;
        this.updateGeneratedName();
        this.toggleFuzzySection(this.isWordsChars());
        this.toggleNewDiscountRow(false);
        FUZZY_INTERVALS$1.forEach((interval) => {
          const input = document.getElementById(`plc-fuzzy-${interval.id}`);
          if (input) input.value = interval.defaultValue;
        });
      },
toggleFuzzySection(visible) {
        if (visible) {
          fuzzySection.classList.remove("hidden");
        } else {
          fuzzySection.classList.add("hidden");
        }
      },
toggleNewDiscountRow(visible) {
        const row = fuzzySection.querySelector(".plc-new-discount-row");
        if (row) {
          if (visible) {
            row.classList.add("visible");
          } else {
            row.classList.remove("visible");
          }
        }
      },
setFontSize(size) {
        if (!["small", "medium", "large"].includes(size)) return;
        panel.classList.remove("font-small", "font-medium", "font-large");
        panel.classList.add(`font-${size}`);
        fontSizeBtns.forEach((btn) => {
          btn.classList.toggle("active", btn.dataset.size === size);
        });
        try {
          localStorage.setItem(FONT_SIZE_KEY, size);
        } catch (e) {
        }
      },
getFontSize() {
        for (const btn of fontSizeBtns) {
          if (btn.classList.contains("active")) {
            return btn.dataset.size;
          }
        }
        return "small";
      }
    };
    try {
      const savedSize = localStorage.getItem(FONT_SIZE_KEY);
      if (savedSize && ["small", "medium", "large"].includes(savedSize)) {
        ui.setFontSize(savedSize);
      }
    } catch (e) {
    }
    fontSizeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        ui.setFontSize(btn.dataset.size);
      });
    });
    closeBtn.addEventListener("click", () => {
      ui.hide();
    });
    logToggle.addEventListener("click", () => {
      logToggle.classList.toggle("expanded");
      logBox.classList.toggle("visible");
    });
    prefixInput.addEventListener("input", () => {
      ui.updateGeneratedName();
    });
    jobtypeSelect.addEventListener("change", () => {
      ui.updateGeneratedName();
    });
    calcbasisSelect.addEventListener("change", () => {
      ui.updateGeneratedName();
      ui.toggleFuzzySection(ui.isWordsChars());
    });
    currencySelect.addEventListener("change", () => {
      ui.updateGeneratedName();
    });
    ui.updateGeneratedName();
    ui.toggleFuzzySection(ui.isWordsChars());
    newDiscountCheckbox.addEventListener("change", () => {
      ui.toggleNewDiscountRow(newDiscountCheckbox.checked);
    });
    return ui;
  }
  function buildAbbrevToFullMap() {
    const map = {};
    const abbrevToId = new Map();
    for (const [key, id] of Object.entries(SERVICES)) {
      if (key === key.toUpperCase() && key.length <= 3) {
        abbrevToId.set(key, id);
      }
    }
    for (const [abbrev, id] of abbrevToId.entries()) {
      for (const [key, keyId] of Object.entries(SERVICES)) {
        if (keyId === id && key !== abbrev && key !== key.toUpperCase()) {
          map[abbrev] = key;
          break;
        }
      }
    }
    return map;
  }
  const ABBREV_TO_FULL_MAP = buildAbbrevToFullMap();
  function getJobTypeFullName(abbrev) {
    if (!abbrev) return abbrev;
    return ABBREV_TO_FULL_MAP[abbrev.toUpperCase()] || abbrev;
  }
  function isWordsOrCharsBasis(calcbasis) {
    const s = String(calcbasis || "").toLowerCase();
    return s === "words" || s === "chars" || s === "characters";
  }
  function isHourlyBasis$1(calcbasis) {
    const s = String(calcbasis || "").toLowerCase();
    return s === "hours" || s.includes("hour") || s === "hr" || s === "hrs";
  }
  const CONFIG$1 = {
    DEFAULT_CONTACT_TYPE: "resources",
ENABLE_ON_URL_INCLUDES: "/ui/",

IGNORED_COLUMNS: ["pricelistID"],
SAVE_EACH_LANGUAGE_PAIR: false,
    DEBUG: true,
STOP_AFTER_JOBTYPE: false,
ONLY_PROCESS_FIRST_CSV_ENTRY: false,
MAX_STEP_RETRIES: 3,
    RETRY_DELAYS_MS: [2500, 2e3, 1500],


BATCH: {
      ENABLED: true,
GROUP_BY: "contactId",
DELAY_MS: 3e3,
LOG_BATCH_START: true
},

FINE_GRAINED_SAVE: {
      ENABLED: true,
LOG_CHECKPOINTS: false
},
WAIT_AFTER_CLICK: 500,
    WAIT_AFTER_INPUT: 600,
    WAIT_AFTER_SELECT: 1100,
    WAIT_AFTER_SAVE: 3900,
    WAIT_FOR_PAGE_LOAD: 25e3,
WAIT_FOR_DROPDOWN: 1e4,

LANG_LABEL_MAP: {
      "EN": "English",
      "ZH-TW": "Chinese (Traditional, Taiwan)",
      "ZH-CN": "Chinese (Simplified, China)",
      "JA": "Japanese",
      "KO": "Korean",
      "DE": "German",
      "FR": "French",
      "ES": "Spanish",
      "IT": "Italian",
      "PT": "Portuguese"
    },
    MAP_LANG_CODES: false
};
  function sleep$2(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function candidateDocs$2() {
    const docs = [document];
    for (const iframe of document.querySelectorAll("iframe")) {
      try {
        if (iframe.contentDocument) {
          docs.push(iframe.contentDocument);
        }
      } catch (e) {
      }
    }
    return docs;
  }
  function qsAny$2(selector) {
    if (!selector) return null;
    const selectors = Array.isArray(selector) ? selector : [selector];
    for (const sel of selectors) {
      const s = String(sel);
      for (const doc of candidateDocs$2()) {
        let node = null;
        if (s.startsWith("css=")) {
          node = doc.querySelector(s.slice(4));
        } else if (s.startsWith("text=")) {
          const text = s.slice(5).trim();
          const all = doc.querySelectorAll("button, a, span, div, label");
          node = Array.from(all).find((n) => n.textContent?.trim().includes(text));
        } else if (s.startsWith("xpath=")) {
          const xp = s.slice(6);
          const result = doc.evaluate(xp, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          node = result.singleNodeValue;
        } else {
          node = doc.querySelector(s);
        }
        if (node && node.nodeType === 1) return node;
      }
    }
    return null;
  }
  function qx$1(xpath) {
    for (const doc of candidateDocs$2()) {
      const result = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const node = result.singleNodeValue;
      if (node && node.nodeType === 1) return node;
    }
    return null;
  }
  function qxAll$1(xpath) {
    const out = [];
    for (const doc of candidateDocs$2()) {
      const result = doc.evaluate(xpath, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0; i < result.snapshotLength; i++) {
        const node = result.snapshotItem(i);
        if (node && node.nodeType === 1) {
          out.push(node);
        }
      }
    }
    return out;
  }
  function isVisible$1(node) {
    if (!node || node.nodeType !== 1) return false;
    const view = node.ownerDocument?.defaultView || window;
    const style = view.getComputedStyle(node);
    if (style.visibility === "hidden" || style.display === "none") return false;
    return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
  }
  function setNativeValue$1(input, value) {
    if (!input) return;
    const view = input.ownerDocument?.defaultView || window;
    const setter = Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, "value")?.set;
    if (setter) {
      setter.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new view.Event("input", { bubbles: true }));
    input.dispatchEvent(new view.Event("change", { bubbles: true }));
  }
  async function typeIntoInput$1(input, text, delayPerChar = 30) {
    if (!input) return;
    const view = input.ownerDocument?.defaultView || window;
    input.value = "";
    input.dispatchEvent(new view.Event("input", { bubbles: true }));
    input.focus();
    for (const char of text) {
      input.value += char;
      input.dispatchEvent(new view.KeyboardEvent("keydown", { key: char, bubbles: true, cancelable: true }));
      input.dispatchEvent(new view.KeyboardEvent("keypress", { key: char, bubbles: true, cancelable: true }));
      input.dispatchEvent(new view.Event("input", { bubbles: true }));
      input.dispatchEvent(new view.KeyboardEvent("keyup", { key: char, bubbles: true, cancelable: true }));
      await sleep$2(delayPerChar);
    }
  }
  function setSelectValue$1(selectEl, value) {
    if (!selectEl || selectEl.tagName !== "SELECT") return false;
    const want = String(value || "").trim();
    if (!want) return false;
    const wantLc = want.toLowerCase();
    const opts = Array.from(selectEl.options);
    const norm = (s) => String(s || "").trim();
    const match = opts.find((o) => norm(o.label) === want) || opts.find((o) => norm(o.value) === want) || opts.find((o) => norm(o.text) === want) || opts.find((o) => norm(o.label).toLowerCase() === wantLc) || opts.find((o) => norm(o.value).toLowerCase() === wantLc) || opts.find((o) => norm(o.text).toLowerCase() === wantLc) ||
opts.find((o) => norm(o.label).toLowerCase().includes(wantLc)) || opts.find((o) => norm(o.text).toLowerCase().includes(wantLc)) || opts.find((o) => norm(o.value).toLowerCase().includes(wantLc));
    if (!match) return false;
    selectEl.value = match.value;
    const idx = opts.indexOf(match);
    if (idx >= 0) selectEl.selectedIndex = idx;
    const view = selectEl.ownerDocument?.defaultView || window;
    selectEl.dispatchEvent(new view.Event("change", { bubbles: true }));
    selectEl.dispatchEvent(new view.Event("input", { bubbles: true }));
    return true;
  }
  function getSelectSelectedText(selectEl) {
    if (!selectEl || selectEl.tagName !== "SELECT") return "";
    const opt = selectEl.options?.[selectEl.selectedIndex];
    return String(opt?.text || opt?.label || opt?.value || "").trim();
  }
  function describeEl$2(node) {
    if (!node) return "null";
    if (typeof node !== "object") return `Invalid(${typeof node})`;
    if (!node.nodeType) {
      return `Node(type=${node.nodeType}, name=${node.nodeName}, constructor=${node.constructor?.name})`;
    }
    if (node.nodeType !== 1) {
      return `Node(type=${node.nodeType}, name=${node.nodeName})`;
    }
    const id = node.id ? `#${node.id}` : "";
    const cls = node.className ? `.${String(node.className).trim().replace(/\s+/g, ".")}` : "";
    const text = node.textContent?.trim().slice(0, 30) || "";
    return `${node.tagName}${id}${cls}${text ? `[${text}]` : ""}`;
  }
  function debug$1(log, msg) {
    {
      console.log(`[PlunetImport] ${msg}`);
      log?.(`DEBUG: ${msg}`);
    }
  }
  async function closeUnexpectedModals() {
    for (const doc of candidateDocs$2()) {
      const propertyModal = doc.querySelector('#NeueEigenschaftModal01, [id^="NeueEigenschaftModal"]');
      if (propertyModal && propertyModal.offsetParent !== null) {
        const closeBtn = propertyModal.querySelector(".close-modal, [close-modal], .icon-cross");
        if (closeBtn) {
          console.log("[PlunetImport] Closing unexpected Properties modal");
          closeBtn.click();
          await sleep$2(400);
          continue;
        }
        const cancelBtn = propertyModal.querySelector('.abort-btn, button[onclick*="close"]');
        if (cancelBtn) {
          console.log("[PlunetImport] Closing unexpected Properties modal via Cancel");
          cancelBtn.click();
          await sleep$2(400);
        }
      }
      const modalBackdrop = doc.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        const visibleModal = doc.querySelector('.modal.in, .modal[style*="display: block"]');
        if (visibleModal) {
          const closeBtn = visibleModal.querySelector(".close-modal, [close-modal], .icon-cross");
          if (closeBtn) {
            console.log("[PlunetImport] Closing unexpected modal");
            closeBtn.click();
            await sleep$2(400);
          }
        }
      }
    }
  }
  async function click$1(selectorOrEl) {
    const element = typeof selectorOrEl === "string" ? qsAny$2(selectorOrEl) : selectorOrEl;
    if (!element) {
      const selectorDesc = typeof selectorOrEl === "string" ? selectorOrEl : "element object";
      throw new Error(`Element not found: ${selectorDesc}`);
    }
    if (typeof element !== "object" || element === null) {
      throw new Error(`Invalid element type: ${typeof element}, expected object`);
    }
    if (!element.nodeType || element.nodeType !== 1) {
      throw new Error(`Invalid element node (nodeType=${element.nodeType}, expected 1): ${describeEl$2(element)}`);
    }
    if (typeof element.scrollIntoView !== "function") {
      throw new Error(`Element does not support scrollIntoView: ${describeEl$2(element)}`);
    }
    element.scrollIntoView({ block: "center", inline: "nearest" });
    await sleep$2(200);
    const view = element.ownerDocument?.defaultView || window;
    element.dispatchEvent(new view.MouseEvent("mousedown", { bubbles: true, cancelable: true, view }));
    element.dispatchEvent(new view.MouseEvent("mouseup", { bubbles: true, cancelable: true, view }));
    element.dispatchEvent(new view.MouseEvent("click", { bubbles: true, cancelable: true, view }));
    await sleep$2(CONFIG$1.WAIT_AFTER_CLICK);
    await closeUnexpectedModals();
    return element;
  }
  async function waitFor$1(check, timeoutMs = 2e4, stepMs = 200, label = "") {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const v = check();
        if (v) return v;
      } catch (e) {
        if (label) {
          console.warn(`waitFor(${label}) check error:`, e.message);
        }
      }
      await sleep$2(stepMs);
    }
    throw new Error(`Timeout waiting for: ${label || "condition"}`);
  }
  const PAGE_TYPE = {
    CUSTOMER: "customers",
    RESOURCE: "resources"
  };
  const ID_SUFFIX = {
    [PAGE_TYPE.CUSTOMER]: "1",
    [PAGE_TYPE.RESOURCE]: "2"
  };
  let _cachedPageType = null;
  let _cachedSuffix = null;
  function detectPageType() {
    const url = window.location.href;
    if (url.includes("/contacts/customers/") || url.includes("/customer/")) {
      return PAGE_TYPE.CUSTOMER;
    }
    if (url.includes("/contacts/resources/") || url.includes("/resource/") || url.includes("partner_mitarbeiter")) {
      return PAGE_TYPE.RESOURCE;
    }
    if (typeof document !== "undefined") {
      const pageTitle = document.title?.toLowerCase() || "";
      const h1Text = document.querySelector("h1")?.textContent?.toLowerCase() || "";
      if (pageTitle.includes("customer") || h1Text.includes("customer")) {
        return PAGE_TYPE.CUSTOMER;
      }
      if (pageTitle.includes("resource") || h1Text.includes("resource")) {
        return PAGE_TYPE.RESOURCE;
      }
    }
    return PAGE_TYPE.RESOURCE;
  }
  function getIdSuffix$1() {
    if (_cachedSuffix !== null) {
      return _cachedSuffix;
    }
    const pageType = getPageType();
    _cachedSuffix = ID_SUFFIX[pageType] || "2";
    return _cachedSuffix;
  }
  function getPageType() {
    if (_cachedPageType !== null) {
      return _cachedPageType;
    }
    _cachedPageType = detectPageType();
    return _cachedPageType;
  }
  function getTagBoxKeys() {
    const suffix = getIdSuffix$1();
    return {
      JOB_TYPE: `PLLR09${suffix}`,
      SRC_LANG: `OutPPS14${suffix}`,
      TGT_LANG: `OutPPS15${suffix}`,
      BASE_PRICE: `OutPPS30${suffix}`,
      BASE_PRICE_OK: `OutPPS32${suffix}`
    };
  }
  function buildSelectors(suffix) {
    return {
priceListsHeading: [
        "xpath=//h3[contains(translate(normalize-space(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'price') and contains(translate(normalize-space(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'list')]",
        "xpath=//*[contains(@class,'jumpNavTarget')][contains(translate(normalize-space(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'price')]"
      ],
createDropdownTrigger: [
        "xpath=//button[.//span[contains(@class,'icon-arrow-down')]][ancestor::*[contains(@class,'flyingWindowActivationContainer')]]",
        "xpath=//div[contains(@class,'flyingWindowActivationContainer')]//button[.//span[contains(@class,'icon-arrow-down')]]"
      ],
createPlusBtn: [
        "xpath=//button[@data-tooltip='Create new price list'][.//span[contains(@class,'icon-plus')]]",
        "xpath=//button[@aria-label='Add'][@data-tooltip='Create new price list']",
        "xpath=//div[contains(@class,'flyingWindow')]//button[.//span[contains(@class,'icon-plus')]]"
      ],
nameInput: [
        `xpath=//input[@id='+inp+PLLA02${suffix}']`,
        "xpath=//input[contains(@id,'PLLA02') or contains(@name,'PLLA02')]",
        "xpath=//td[contains(.,'Change name') or contains(.,'name of price')]/following::input[1]"
      ],
currency: [
        `xpath=//select[@id='PLLR02${suffix}']`,
        "xpath=//select[starts-with(@id,'PLLR02')]"
      ],
calculationBasis: [
        `xpath=//select[@id='PLLR03${suffix}']`,
        "xpath=//select[starts-with(@id,'PLLR03')]"
      ],
property: [
        `xpath=//select[@id='PLLR08${suffix}']`,
        "xpath=//select[starts-with(@id,'PLLR08')]"
      ],
jobTypeTagBox: [
        `xpath=//pl-tag-box[@id='ATagBox08PLLR09${suffix}']`,
        `xpath=//div[@id='ATagBox10PLLR09${suffix}']`,
"xpath=//pl-tag-box[starts-with(@id,'ATagBox08PLLR09')]",
        "xpath=//div[starts-with(@id,'ATagBox10PLLR09')]"
      ],
jobTypeDropdown: [
        `xpath=//button[@id='TagBoxDropDownPLLR09${suffix}']`,
        `xpath=//pl-tag-box[@id='ATagBox08PLLR09${suffix}']//div[contains(@class,'fakeSelect')]`,
        `xpath=//div[@id='ATagBox10PLLR09${suffix}']//div[contains(@class,'fakeSelect')]`,
"xpath=//button[starts-with(@id,'TagBoxDropDownPLLR09')]",
        "xpath=//pl-tag-box[starts-with(@id,'ATagBox08PLLR09')]//div[contains(@class,'fakeSelect')]"
      ],
jobTypeSearchInput: [
        `xpath=//input[@id='ATagBox01PLLR09${suffix}']`,
        "xpath=//input[starts-with(@id,'ATagBox01PLLR09')]"
      ],
jobTypeAddBtn: "css=button#PLLR15",
priceFactor: [
        `xpath=//select[@id='OutPPS45${suffix}']`,
        "xpath=//select[starts-with(@id,'OutPPS45')]"
      ],
addLangPairBtn: [
        "xpath=//button[contains(@onclick,'OutPPS42')]",
        "css=button[onclick*='OutPPS42']",
        "xpath=//div[contains(@class,'component-group') and .//label[contains(text(),'Source')]]//button[contains(@class,'btncol-primary')]"
      ],
basePriceDropdown: [
        `xpath=//pl-tag-box[starts-with(@id,'ATagBox08OutPPS30${suffix}')]//div[contains(@class,'fakeSelect')]`,
        `xpath=//button[starts-with(@id,'TagBoxDropDownOutPPS30${suffix}')]`,
"xpath=//pl-tag-box[starts-with(@id,'ATagBox08OutPPS30')]//div[contains(@class,'fakeSelect')]",
        "xpath=//button[starts-with(@id,'TagBoxDropDownOutPPS30')]",
        "xpath=//div[starts-with(@id,'ATagBox05OutPPS30')]"
      ],
      basePriceSearchInput: [
        `xpath=//input[@id='ATagBox01OutPPS30${suffix}']`,
        "xpath=//input[starts-with(@id,'ATagBox01OutPPS30')]"
      ],
      basePriceOkBtn: [
        `xpath=//button[@id='OutPPS32${suffix}']`,
        "xpath=//button[starts-with(@id,'OutPPS32')][.//span[normalize-space()='OK']]"
      ],

minChargeInput: [
        `xpath=//input[@id='+inp+PLLR10${suffix}']`,
        `xpath=//input[@name='+inp+PLLR10${suffix}']`,
        "xpath=//input[contains(@id,'PLLR10') and contains(@id,'+inp+')]"
      ],
saveBtn: [
        "xpath=//button[.//span[normalize-space()='Save']]",
        "xpath=//button[normalize-space()='Save']",
        "text=Save"
      ],
catInterfaceTab: [
        "xpath=//a[.//b[normalize-space()='CAT interface'] or normalize-space()='CAT interface']",
        "xpath=//td[contains(@class,'InnerTab') or contains(@class,'InnerTabSelected')]//a[normalize-space()='CAT interface']",
        "xpath=//table[.//td[contains(@class,'InnerTab') or contains(@class,'InnerTabSelected')]]//a[.//b[normalize-space()='CAT interface']]",
        "xpath=//table[.//td[contains(@class,'InnerTab') or contains(@class,'InnerTabSelected')]]//b[normalize-space()='CAT interface']",
        "text=CAT interface"
      ],
      pricesTab: [
        "xpath=//a[.//b[normalize-space()='Prices'] or normalize-space()='Prices']",
        "xpath=//td[contains(@class,'InnerTab') or contains(@class,'InnerTabSelected')]//a[normalize-space()='Prices']",
        "xpath=//table[.//td[contains(@class,'InnerTab') or contains(@class,'InnerTabSelected')]]//a[.//b[normalize-space()='Prices']]",
        "xpath=//table[.//td[contains(@class,'InnerTab') or contains(@class,'InnerTabSelected')]]//b[normalize-space()='Prices']",
        "text=Prices"
      ],
      memoQManagerBtn: [
        "xpath=//button[.//span[normalize-space()='memoQManager']]",
        "xpath=//span[normalize-space()='memoQManager']/ancestor::button[1]"
      ]
    };
  }
  function getSEL() {
    return buildSelectors(getIdSuffix$1());
  }
  class BaseInteraction {
constructor(config) {
      if (!config.selector) {
        throw new Error("BaseInteraction: selector is required");
      }
      if (!config.label) {
        throw new Error("BaseInteraction: label is required");
      }
      this.selector = config.selector;
      this.label = config.label;
      this.timeout = config.timeout ?? 5e3;
      this.waitAfter = config.waitAfter ?? 500;
    }
getElement() {
      return qsAny$2(this.selector);
    }
async waitForElement() {
      return waitFor$1(
        () => this.getElement(),
        this.timeout,
        300,
        this.label
      );
    }
shouldSkip(value) {
      return value == null || value === "";
    }
async execute(value, log) {
      throw new Error("Subclass must implement execute()");
    }
async verify(value, log) {
      return true;
    }
async executeWithRetry(value, log, options = {}) {
      const maxRetries = options.maxRetries ?? CONFIG$1.MAX_STEP_RETRIES ?? 3;
      const retryDelays = options.retryDelays ?? [2500, 2e3, 1500];
      let lastError = null;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const result = await this.execute(value, log);
          const verified = await this.verify(value, log);
          if (!verified) {
            throw new Error(`${this.label}: verification failed`);
          }
          return { ...result, success: true, retries: attempt - 1 };
        } catch (error) {
          lastError = error;
          log?.(`${this.label}: attempt ${attempt}/${maxRetries} failed: ${error.message}`);
          if (attempt < maxRetries) {
            const delay = retryDelays[attempt - 1] ?? 2e3;
            await sleep$2(delay);
          }
        }
      }
      return {
        success: false,
        value,
        retries: maxRetries,
        error: lastError?.message
      };
    }
  }
  class SimpleSelect extends BaseInteraction {
constructor(config) {
      super(config);
      this.waitAfter = config.waitAfter ?? CONFIG$1.WAIT_AFTER_SELECT;
    }
async execute(value, log) {
      if (this.shouldSkip(value)) {
        log?.(`Skipping ${this.label}: no value provided`);
        return { success: true, value: null, skipped: true };
      }
      const el = await this.waitForElement();
      if (!el) {
        throw new Error(`${this.label}: element not found`);
      }
      if (el.tagName !== "SELECT") {
        throw new Error(`${this.label}: expected <select> element, got <${el.tagName.toLowerCase()}>`);
      }
      const success = setSelectValue$1(el, value);
      if (!success) {
        const availableOptions = Array.from(el.options).map((o) => o.text.trim()).join(", ");
        throw new Error(`${this.label}: failed to set value "${value}". Available: ${availableOptions}`);
      }
      await sleep$2(this.waitAfter);
      log?.(`Set ${this.label}: ${value}`);
      return { success: true, value };
    }
async verify(value, log) {
      if (value == null) return true;
      const el = this.getElement();
      if (!el) return false;
      const selectedOption = el.options?.[el.selectedIndex];
      if (!selectedOption) return false;
      const selectedText = selectedOption.text?.trim() || "";
      const selectedValue = selectedOption.value?.trim() || "";
      const normalizedValue = String(value).trim().toLowerCase();
      const matches = selectedText.toLowerCase() === normalizedValue || selectedText.toLowerCase().includes(normalizedValue) || selectedValue.toLowerCase() === normalizedValue;
      if (!matches) {
        log?.(`${this.label}: verification failed. Expected "${value}", got "${selectedText}"`);
      }
      return matches;
    }
getCurrentValue() {
      const el = this.getElement();
      if (!el) return null;
      const selectedOption = el.options?.[el.selectedIndex];
      if (!selectedOption) return null;
      return {
        text: selectedOption.text?.trim() || "",
        value: selectedOption.value || ""
      };
    }
  }
  function getServiceId(name) {
    if (!name) return null;
    const key = String(name).trim();
    return SERVICES[key] ?? SERVICES[key.toUpperCase()] ?? null;
  }
  function getLanguageId(name) {
    if (!name) return null;
    const key = String(name).trim();
    if (LANGUAGES[key] != null) return LANGUAGES[key];
    const keyLower = key.toLowerCase();
    const keyUpper = key.toUpperCase();
    if (LANGUAGES[keyLower] != null) return LANGUAGES[keyLower];
    if (LANGUAGES[keyUpper] != null) return LANGUAGES[keyUpper];
    for (const [langKey, id] of Object.entries(LANGUAGES)) {
      if (langKey.toLowerCase() === keyLower) return id;
    }
    return null;
  }
  async function typeWithEvents(input, text, delayPerChar = 50) {
    if (!input) return;
    const doc = input.ownerDocument;
    const win = doc.defaultView || window;
    input.focus();
    input.value = "";
    input.dispatchEvent(new win.Event("input", { bubbles: true }));
    for (const char of text) {
      input.dispatchEvent(new win.KeyboardEvent("keydown", {
        key: char,
        code: `Key${char.toUpperCase()}`,
        bubbles: true,
        cancelable: true
      }));
      input.dispatchEvent(new win.KeyboardEvent("keypress", {
        key: char,
        code: `Key${char.toUpperCase()}`,
        bubbles: true,
        cancelable: true
      }));
      input.value += char;
      input.dispatchEvent(new win.InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: char
      }));
      input.dispatchEvent(new win.KeyboardEvent("keyup", {
        key: char,
        code: `Key${char.toUpperCase()}`,
        bubbles: true,
        cancelable: true
      }));
      await sleep$2(delayPerChar);
    }
  }
  function qxInDoc(doc, xpath) {
    const result = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const node = result.singleNodeValue;
    return node && node.nodeType === 1 ? node : null;
  }
  function getDocsToSearch(primaryDoc) {
    const docs = [primaryDoc];
    if (document !== primaryDoc) docs.push(document);
    for (const d of candidateDocs$2()) {
      if (!docs.includes(d)) docs.push(d);
    }
    return docs;
  }
  async function selectTagBoxById$1({ triggerEl, tagBoxKey, targetId, searchText, log }) {
    const logFn = log || (() => {
    });
    if (!triggerEl) {
      return { success: false, error: "Trigger element not found" };
    }
    const doc = triggerEl.ownerDocument || document;
    const win = doc.defaultView || window;
    const docsToSearch = getDocsToSearch(doc);
    const findInDocs = (xpath) => {
      for (const d of docsToSearch) {
        const node = qxInDoc(d, xpath);
        if (node) return node;
      }
      return null;
    };
    const clickTrigger = () => {
      triggerEl.dispatchEvent(new win.MouseEvent("mousedown", { bubbles: true, cancelable: true, view: win }));
      triggerEl.dispatchEvent(new win.MouseEvent("mouseup", { bubbles: true, cancelable: true, view: win }));
      triggerEl.dispatchEvent(new win.MouseEvent("click", { bubbles: true, cancelable: true, view: win }));
    };
    const inputXpath = `//input[@id='ATagBox01${tagBoxKey}']`;
    const retryDelays = [2500, 2e3, 1500];
    const maxAttempts = 3;
    let searchInput = null;
    for (let attempt = 1; attempt <= maxAttempts && !searchInput; attempt++) {
      logFn(`Opening TagBox dropdown (key: ${tagBoxKey})${attempt > 1 ? ` (attempt ${attempt}/${maxAttempts})` : ""}`);
      clickTrigger();
      const waitTime = retryDelays[attempt - 1] || 3e3;
      const startTime = Date.now();
      while (!searchInput && Date.now() - startTime < waitTime) {
        await sleep$2(300);
        searchInput = findInDocs(inputXpath);
      }
      if (!searchInput && attempt < maxAttempts) {
        logFn(`Search input not found after ${waitTime / 1e3}s, retrying...`);
      }
    }
    if (searchInput && searchText) {
      const charCount = Math.max(3, Math.ceil(searchText.length * 0.6));
      const shortSearch = searchText.slice(0, charCount);
      logFn(`Typing "${shortSearch}" (${charCount}/${searchText.length} chars) to filter`);
      await typeWithEvents(searchInput, shortSearch, 50);
      await sleep$2(600);
    } else if (searchText) {
      logFn(`Search input not found, proceeding without filter`);
      await sleep$2(400);
    }
    const optionPatterns = [
      `//div[@id='ATagBox02#${tagBoxKey}#${targetId}']`,
      `//div[@id='ATagBox09#${tagBoxKey}#${targetId}']`,
      `//*[@id='ATagBox02#${tagBoxKey}#${targetId}' or @id='ATagBox09#${tagBoxKey}#${targetId}']`
    ];
    let option = null;
    for (const pattern of optionPatterns) {
      option = findInDocs(pattern);
      if (option) break;
    }
    if (option) {
      logFn(`Found option by ID: ${option.id} - "${option.textContent?.trim()}"`);
      const optDoc = option.ownerDocument;
      const optWin = optDoc.defaultView || window;
      option.scrollIntoView({ block: "center" });
      await sleep$2(200);
      option.dispatchEvent(new optWin.MouseEvent("mousedown", { bubbles: true, cancelable: true, view: optWin }));
      option.dispatchEvent(new optWin.MouseEvent("mouseup", { bubbles: true, cancelable: true, view: optWin }));
      option.dispatchEvent(new optWin.MouseEvent("click", { bubbles: true, cancelable: true, view: optWin }));
      await sleep$2(400);
      return { success: true, option };
    }
    logFn(`Option with ID ${targetId} not found in TagBox ${tagBoxKey}`);
    doc.body?.click?.();
    return { success: false, error: `Option ID ${targetId} not found` };
  }
  function extractTagBoxKey(el) {
    const id = el?.id || "";
    if (id.startsWith("ATagBox08")) return id.slice("ATagBox08".length);
    if (id.startsWith("ATagBox10")) return id.slice("ATagBox10".length);
    if (id.startsWith("ATagBox05")) return id.slice("ATagBox05".length);
    if (id.startsWith("TagBoxDropDown")) return id.slice("TagBoxDropDown".length);
    return id;
  }
  function recordFailure({ key, expected, actual, error }) {
  }
  function readTagBoxValue(key) {
    if (!key) return null;
    for (const doc of candidateDocs$2()) {
      const sel = doc.querySelector(`select#${CSS.escape(key)}`) || doc.querySelector(`select[name='${CSS.escape(key)}']`);
      if (!sel) continue;
      const selectedOpts = Array.from(sel.options).filter((o) => o.selected);
      if (selectedOpts.length === 0) {
        return { value: "", text: "", values: [], texts: [] };
      }
      if (sel.multiple || selectedOpts.length > 1) {
        return {
          value: selectedOpts[0]?.value || "",
          text: selectedOpts[0]?.text?.trim() || "",
          values: selectedOpts.map((o) => o.value),
          texts: selectedOpts.map((o) => o.text?.trim() || "")
        };
      }
      return {
        value: selectedOpts[0]?.value || "",
        text: selectedOpts[0]?.text?.trim() || ""
      };
    }
    return null;
  }
  function verifyTagBoxSelection(key, expected, options = {}) {
    const current = readTagBoxValue(key);
    if (!current) {
      return { success: false, actual: null, expected, match: "none" };
    }
    const normalize = (s) => String(s || "").trim().toLowerCase();
    if (typeof expected === "string") {
      const expectedNorm = normalize(expected);
      const actualNorm = normalize(current.text);
      if (actualNorm === expectedNorm) {
        return { success: true, actual: current.text, expected, match: "exact" };
      }
      if (options.partial && (actualNorm.includes(expectedNorm) || expectedNorm.includes(actualNorm))) {
        return { success: true, actual: current.text, expected, match: "partial" };
      }
      return { success: false, actual: current.text, expected, match: "none" };
    }
    if (Array.isArray(expected)) {
      const expectedSet = new Set(expected.map(normalize));
      const actualTexts = current.texts || [current.text];
      const actualSet = new Set(actualTexts.map(normalize));
      let allMatch = true;
      let partialMatch = false;
      for (const exp of expectedSet) {
        const exactMatch = actualSet.has(exp);
        const partial = options.partial && [...actualSet].some((a) => a.includes(exp) || exp.includes(a));
        if (!exactMatch && !partial) {
          allMatch = false;
        } else if (partial && !exactMatch) {
          partialMatch = true;
        }
      }
      if (allMatch) {
        return {
          success: true,
          actual: actualTexts,
          expected,
          match: partialMatch ? "partial" : "exact"
        };
      }
      return { success: false, actual: actualTexts, expected, match: "none" };
    }
    return { success: false, actual: current.text, expected, match: "none" };
  }
  function waitForDOMChange(target, condition, timeout = 3e3) {
    return new Promise((resolve) => {
      if (condition()) {
        resolve(true);
        return;
      }
      let resolved = false;
      const observer = new MutationObserver(() => {
        if (!resolved && condition()) {
          resolved = true;
          observer.disconnect();
          resolve(true);
        }
      });
      observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          observer.disconnect();
          resolve(condition());
        }
      }, timeout);
    });
  }
  function verifyOptionUniqueness(matches, searchText) {
    if (!matches || matches.length === 0) {
      return { unique: false, count: 0 };
    }
    const normalized = searchText.trim().toLowerCase();
    const exactMatches = matches.filter((el) => {
      const text = (el.textContent || "").trim().toLowerCase();
      return text === normalized;
    });
    if (exactMatches.length === 1) {
      return { unique: true, count: exactMatches.length, exactMatch: exactMatches[0] };
    }
    if (exactMatches.length > 1) {
      return { unique: false, count: exactMatches.length, exactMatch: exactMatches[0] };
    }
    if (matches.length === 1) {
      return { unique: true, count: 1, exactMatch: matches[0] };
    }
    return { unique: false, count: matches.length };
  }
  function readTagBoxUISelectedValues(wrapper) {
    if (!wrapper) return [];
    const valuesSet = new Set();
    wrapper.querySelectorAll(".selectedTag .ellipsis, .selectedTag > span").forEach((el) => {
      const text = (el.textContent || "").trim();
      if (text && !text.includes("Please select")) {
        valuesSet.add(text);
      }
    });
    wrapper.querySelectorAll('[id^="ATagBox06#"]').forEach((el) => {
      const text = (el.textContent || "").trim();
      if (text && !text.includes("Please select")) {
        valuesSet.add(text);
      }
    });
    if (valuesSet.size === 0) {
      const fakeSelect = wrapper.querySelector(".fakeSelect");
      if (fakeSelect) {
        const ellipsis = fakeSelect.querySelector(".ellipsis:not(.hinweistext)");
        if (ellipsis) {
          const text = (ellipsis.textContent || "").trim();
          if (text && !text.includes("Please select")) {
            valuesSet.add(text);
          }
        }
      }
    }
    return Array.from(valuesSet);
  }
  function verifyUISelection(wrapper, expected, options = {}) {
    const actual = readTagBoxUISelectedValues(wrapper);
    const expectedArr = Array.isArray(expected) ? expected : [expected];
    const isSingleSelect = options.singleSelect ?? expectedArr.length === 1;
    const normalize = (s) => String(s || "").trim().toLowerCase();
    const actualNorm = actual.map(normalize);
    const expectedNorm = expectedArr.map(normalize);
    const countMatch = isSingleSelect ? actual.length === 1 : actual.length === expectedArr.length;
    let allFound = true;
    for (const exp of expectedNorm) {
      const found = actualNorm.some((a) => {
        if (a === exp) return true;
        if (options.partial) {
          return a.includes(exp) || exp.includes(a);
        }
        return false;
      });
      if (!found) {
        allFound = false;
        break;
      }
    }
    const success = allFound && (options.partial || countMatch);
    return {
      success,
      actual,
      expected: expectedArr,
      countMatch
    };
  }
  function findTagBoxByLabel(labelText) {
    const want = String(labelText || "").trim();
    if (!want) return null;
    const candidates = [];
    for (const doc of candidateDocs$2()) {
      const labels = Array.from(doc.querySelectorAll("label"));
      const matchingLabels = labels.filter((l) => (l.textContent || "").trim() === want);
      for (const label of matchingLabels) {
        const forAttr = label?.getAttribute("for");
        if (forAttr) {
          const btn = doc.querySelector(`#TagBoxDropDown${CSS.escape(forAttr)}`);
          if (btn) {
            const wrapper = doc.querySelector(`#ATagBox10${CSS.escape(forAttr)}`);
            const wrapperVisible = wrapper?.offsetParent !== null;
            candidates.push({ btn, wrapperVisible });
          }
        }
      }
    }
    const visible = candidates.find((c) => c.wrapperVisible);
    if (visible) return visible.btn;
    return candidates[0]?.btn || null;
  }
  function trySelectViaHiddenSelect$1({ docsToSearch, key, optionText, log }) {
    if (!key) return false;
    for (const d of docsToSearch) {
      const selectEl = d.querySelector(`select#${CSS.escape(key)}, select[name='${CSS.escape(key)}']`);
      if (!selectEl) continue;
      const ok = setSelectValue$1(selectEl, optionText);
      if (ok) {
        debug$1(log, `TagBox fallback: selected via hidden <select>#${key}`);
        return true;
      }
    }
    return false;
  }
  async function selectOneFromTagBox$1({ dropBtnSel, searchInputSel, listIdPrefix, optionText, log }) {
    debug$1(log, `TagBox selectOne: ${optionText}`);
    if (!dropBtnSel) {
      throw new Error("dropBtnSel is required for selectOneFromTagBox");
    }
    let element = dropBtnSel;
    if (typeof dropBtnSel === "string") {
      element = qsAny$2(dropBtnSel);
      if (!element) {
        throw new Error(`TagBox trigger not found: ${dropBtnSel}`);
      }
    }
    debug$1(log, `TagBox trigger element: ${describeEl$2(element)}`);
    const doc = element.ownerDocument || document;
    const docsToSearch = (() => {
      const docs = [doc];
      if (document !== doc) docs.push(document);
      for (const d of candidateDocs$2()) {
        if (!docs.includes(d)) docs.push(d);
      }
      return docs;
    })();
    const qxDocs = (xpath) => {
      for (const d of docsToSearch) {
        const result = d.evaluate(xpath, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const node = result.singleNodeValue;
        if (node && node.nodeType === 1) return node;
      }
      return null;
    };
    const triggerEl = element.closest?.(
      "button[id^='TagBoxDropDown'], div[id^='ATagBox05'], div[name^='ATagBox05'], div[id^='ATagBox10'], div[name^='ATagBox10'], div[id^='ATagBox08'], pl-tag-box[id^='ATagBox08']"
    ) || element;
    let key = "";
    const id = triggerEl.id || "";
    const name = triggerEl.getAttribute?.("name") || "";
    if (id.startsWith("TagBoxDropDown")) key = id.slice("TagBoxDropDown".length);
    else if (id.startsWith("ATagBox05")) key = id.slice("ATagBox05".length);
    else if (id.startsWith("ATagBox10")) key = id.slice("ATagBox10".length);
    else if (id.startsWith("ATagBox08")) key = id.slice("ATagBox08".length);
    else if (name.startsWith("ATagBox05")) key = name.slice("ATagBox05".length);
    else if (name.startsWith("ATagBox10")) key = name.slice("ATagBox10".length);
    if (!key) {
      const inputs = Array.from(doc.querySelectorAll("input[id^='ATagBox01']")).filter(isVisible$1);
      if (inputs.length === 1) {
        key = inputs[0].id.slice("ATagBox01".length);
      }
    }
    debug$1(log, `TagBox key: ${key}`);
    const keyVariants = (() => {
      const out = [];
      if (key) out.push(key);
      if (key && /\\d$/.test(key)) out.push(key.slice(0, -1));
      return Array.from(new Set(out.filter(Boolean)));
    })();
    const fakeSelect = triggerEl.querySelector?.(".fakeSelect") || (keyVariants.length ? docsToSearch.map((d) => keyVariants.map((k) => d.querySelector(`pl-tag-box#ATagBox08${CSS.escape(k)} .fakeSelect`)).find((x) => x)).find((b) => b) : null);
    const openBtn = triggerEl.querySelector?.("button[id^='TagBoxDropDown']") || (keyVariants.length ? docsToSearch.map((d) => keyVariants.map((k) => d.querySelector(`#TagBoxDropDown${CSS.escape(k)}`)).find((x) => x)).find((b) => b) : null);
    const placeholderText = key ? docsToSearch.map((d) => d.querySelector(`div[name='ATagBox05${CSS.escape(key)}'] .hinweistext.ellipsis`)).find((b) => b && isVisible$1(b)) : null;
    const placeholder = placeholderText?.closest?.(".fakeSelect") || placeholderText;
    const openEl = openBtn || fakeSelect || placeholder || element;
    debug$1(log, `TagBox open element: ${describeEl$2(openEl)}`);
    await click$1(openEl);
    await sleep$2(CONFIG$1.WAIT_AFTER_CLICK);
    let inferredSearch = searchInputSel || (keyVariants.length ? keyVariants.map((k) => `css=input#ATagBox01${k}`) : null);
    let inferredPrefix = listIdPrefix || (key ? `ATagBox02#${key}#` : null);
    if (!inferredSearch || !inferredPrefix) {
      throw new Error(`TagBox cannot infer selectors`);
    }
    const optXpathExact = `//div[starts-with(@id,'${inferredPrefix}')]//div[contains(@class,'ellipsis') and normalize-space()=${JSON.stringify(optionText)}]/ancestor::div[starts-with(@id,'${inferredPrefix}')][1]`;
    const optXpathContains = `//div[starts-with(@id,'${inferredPrefix}')]//div[contains(@class,'ellipsis') and contains(normalize-space(),${JSON.stringify(optionText)})]/ancestor::div[starts-with(@id,'${inferredPrefix}')][1]`;
    const optXpathTagExact = `//div[starts-with(@id,'${inferredPrefix}') and contains(@class,'tag') and normalize-space()=${JSON.stringify(optionText)}]`;
    const optXpathTagContains = `//div[starts-with(@id,'${inferredPrefix}') and contains(@class,'tag') and contains(normalize-space(),${JSON.stringify(optionText)})]`;
    const optXpathFallbackExact = `//*[(contains(concat(' ',@class,' '),' tag ') or @class='tag') and contains(@id,'#') and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper')) and not(contains(@class,'fakeSelect')) and normalize-space()=${JSON.stringify(optionText)}] | //div[contains(@class,'ellipsis') and contains(@id,'#') and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper')) and not(contains(@class,'fakeSelect')) and normalize-space()=${JSON.stringify(optionText)}]/ancestor::*[self::div or self::li][contains(@id,'#') and not(contains(@class,'fakeSelect')) and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper'))][1]`;
    const optXpathFallbackContains = `//*[(contains(concat(' ',@class,' '),' tag ') or @class='tag') and contains(@id,'#') and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper')) and not(contains(@class,'fakeSelect')) and contains(normalize-space(),${JSON.stringify(optionText)})] | //div[contains(@class,'ellipsis') and contains(@id,'#') and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper')) and not(contains(@class,'fakeSelect')) and contains(normalize-space(),${JSON.stringify(optionText)})]/ancestor::*[self::div or self::li][contains(@id,'#') and not(contains(@class,'fakeSelect')) and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper'))][1]`;
    const optXpathATagBox09Exact = key ? `//div[starts-with(@id,'ATagBox09#${key}#') and contains(@class,'tag') and normalize-space()=${JSON.stringify(optionText)}]` : "";
    const optXpathATagBox09Contains = key ? `//div[starts-with(@id,'ATagBox09#${key}#') and contains(@class,'tag') and contains(normalize-space(),${JSON.stringify(optionText)})]` : "";
    const findOptNow = () => (optXpathATagBox09Exact ? qxDocs(optXpathATagBox09Exact) : null) || (optXpathATagBox09Contains ? qxDocs(optXpathATagBox09Contains) : null) || qxDocs(optXpathTagExact) || qxDocs(optXpathTagContains) || qxDocs(optXpathExact) || qxDocs(optXpathContains) || qxDocs(optXpathFallbackExact) || qxDocs(optXpathFallbackContains);
    if (trySelectViaHiddenSelect$1({ docsToSearch, key, optionText, log })) {
      return;
    }
    const openTimeoutMs = key && /^OutPPS30/.test(key) ? 8800 : CONFIG$1.WAIT_FOR_DROPDOWN;
    let ready;
    try {
      ready = await waitFor$1(() => {
        const sels = Array.isArray(inferredSearch) ? inferredSearch : [inferredSearch];
        let n = null;
        for (const s0 of sels) {
          const sel = String(s0);
          const queryCss = (css) => docsToSearch.map((d) => d.querySelector(css)).find((x) => x);
          if (sel.startsWith("css=")) {
            n = queryCss(sel.slice(4));
          } else if (sel.startsWith("xpath=")) {
            n = qxDocs(sel.slice(6));
          } else {
            n = queryCss(sel);
          }
          if (n && isVisible$1(n)) break;
        }
        if (n) {
          if (!listIdPrefix && n.id?.startsWith("ATagBox01")) {
            inferredPrefix = `ATagBox02#${n.id.slice("ATagBox01".length)}#`;
          }
          const visible = isVisible$1(n);
          if (!visible && CONFIG$1.DEBUG) {
            debug$1(log, `TagBox input found but not visible: ${describeEl$2(n)}`);
          }
          return { kind: "input", el: n };
        }
        const opt2 = findOptNow();
        if (opt2) return { kind: "opt", el: opt2 };
        const view2 = doc.defaultView || window;
        const reopenTarget = openBtn && openBtn !== openEl ? openBtn : openEl || element;
        try {
          reopenTarget.scrollIntoView?.({ block: "center" });
        } catch {
        }
        reopenTarget.dispatchEvent?.(new view2.MouseEvent("mousedown", { bubbles: true, cancelable: true }));
        reopenTarget.dispatchEvent?.(new view2.MouseEvent("mouseup", { bubbles: true, cancelable: true }));
        reopenTarget.dispatchEvent?.(new view2.MouseEvent("click", { bubbles: true, cancelable: true }));
        if (CONFIG$1.DEBUG && key) {
          reopenTarget.__plunetDebugTick = (reopenTarget.__plunetDebugTick || 0) + 1;
          const mod = /^OutPPS30/.test(key) ? 20 : 10;
          if (reopenTarget.__plunetDebugTick % mod === 0) {
            const allInputs = docsToSearch.flatMap((d) => Array.from(d.querySelectorAll(`input#ATagBox01${CSS.escape(key)}`)));
            const anyOpt = findOptNow();
            debug$1(log, `TagBox debug: inputs=${allInputs.length}, anyOpt=${anyOpt ? "yes" : "no"}`);
          }
        }
        return null;
      }, openTimeoutMs, 150, "TagBox input or list");
    } catch (e) {
      if (trySelectViaHiddenSelect$1({ docsToSearch, key, optionText, log })) {
        return;
      }
      throw e;
    }
    if (ready.kind === "opt") {
      debug$1(log, `TagBox option found (no input): ${describeEl$2(ready.el)}`);
      ready.el.click();
      await sleep$2(CONFIG$1.WAIT_AFTER_CLICK);
      doc.body?.click?.();
      await sleep$2(600);
      return;
    }
    const input = ready.el;
    debug$1(log, `TagBox input: ${describeEl$2(input)}`);
    const view = input.ownerDocument?.defaultView || window;
    input.focus();
    await sleep$2(50);
    input.dispatchEvent(new view.KeyboardEvent("keydown", { key: "a", code: "KeyA", ctrlKey: true, bubbles: true }));
    input.dispatchEvent(new view.KeyboardEvent("keyup", { key: "a", code: "KeyA", ctrlKey: true, bubbles: true }));
    await sleep$2(30);
    input.dispatchEvent(new view.KeyboardEvent("keydown", { key: "Backspace", code: "Backspace", bubbles: true }));
    input.dispatchEvent(new view.KeyboardEvent("keyup", { key: "Backspace", code: "Backspace", bubbles: true }));
    await sleep$2(100);
    try {
      input.value = "";
      input.dispatchEvent(new view.Event("input", { bubbles: true }));
      input.dispatchEvent(new view.Event("change", { bubbles: true }));
    } catch (e) {
    }
    await sleep$2(150);
    const isBasePriceTagBox = key && /^OutPPS30/.test(key);
    const fullText = String(optionText).trim();
    const words = fullText.split(/\s+/);
    const partialText = isBasePriceTagBox ? words.slice(0, 2).join(" ").length <= 15 ? words.slice(0, 2).join(" ") : fullText.slice(0, 12) : fullText;
    debug$1(log, `Typing search text: "${partialText}" (full: "${fullText}")`);
    await typeIntoInput$1(input, partialText);
    await sleep$2(CONFIG$1.WAIT_AFTER_INPUT);
    if (isBasePriceTagBox) {
      const anyOptXpath = `//div[starts-with(@id,'ATagBox02#') or starts-with(@id,'ATagBox09#')][contains(@class,'tag')]`;
      const anyOpt = await waitFor$1(() => qxDocs(anyOptXpath), 3e3, 150, "Any TagBox option").catch(() => null);
      if (anyOpt) {
        debug$1(log, "Dropdown populated, looking for specific option...");
      } else {
        debug$1(log, "WARN: No options appeared in dropdown after typing");
      }
    }
    const opt = await waitFor$1(() => {
      return findOptNow();
    }, CONFIG$1.WAIT_FOR_DROPDOWN, 250, `TagBox option: ${optionText}`);
    debug$1(log, `TagBox option found: ${describeEl$2(opt)}`);
    opt.click();
    await sleep$2(CONFIG$1.WAIT_AFTER_CLICK);
    doc.body?.click?.();
    await sleep$2(600);
  }
  async function selectTagBoxByIdWithFallback({ triggerEl, tagBoxKey, optionText, entityType, log }) {
    const logFn = (msg) => {
      debug$1(log, msg);
      log?.(msg);
    };
    let element = triggerEl;
    if (typeof triggerEl === "string") {
      element = qsAny$2(triggerEl);
    }
    if (!element) {
      return { success: false, method: "text", error: "Trigger element not found" };
    }
    let key = tagBoxKey;
    if (!key) {
      key = extractTagBoxKey(element) || inferTagBoxKey(element);
    }
    let targetId = null;
    {
      targetId = getServiceId(optionText);
    }
    if (key && targetId != null) {
      logFn(`Trying ID-based selection: key=${key}, id=${targetId}, text="${optionText}"`);
      const result = await selectTagBoxById$1({
        triggerEl: element,
        tagBoxKey: key,
        targetId,
        searchText: optionText,
        log: logFn
      });
      if (result.success) {
        logFn(`ID-based selection succeeded for "${optionText}" (id=${targetId})`);
        return { success: true, method: "id" };
      }
      logFn(`ID-based selection failed, falling back to text-based: ${result.error}`);
    } else {
      if (!key) logFn(`TagBox key not found, using text-based selection`);
      if (targetId == null) logFn(`No ID mapping for "${optionText}" (${entityType}), using text-based selection`);
    }
    try {
      await selectOneFromTagBox$1({
        dropBtnSel: element,
        searchInputSel: key ? `css=input#ATagBox01${key}` : null,
        optionText,
        log
      });
      return { success: true, method: "text" };
    } catch (e) {
      return { success: false, method: "text", error: e.message };
    }
  }
  async function selectManyFromTagBox$1({ openBtnEl, searchInputPrefix, listIdPrefix, optionTexts, okBtnEl, log }) {
    debug$1(log, `TagBox selectMany: ${optionTexts.length} items`);
    const doc = openBtnEl.ownerDocument || document;
    const triggerEl = openBtnEl.closest?.(
      "button[id^='TagBoxDropDown'], pl-tag-box[id^='ATagBox08'], div[id^='ATagBox05'], div[id^='ATagBox10']"
    ) || openBtnEl;
    const id = triggerEl.id || "";
    let key = "";
    if (id.startsWith("TagBoxDropDown")) key = id.slice("TagBoxDropDown".length);
    else if (id.startsWith("ATagBox08")) key = id.slice("ATagBox08".length);
    else if (id.startsWith("ATagBox05")) key = id.slice("ATagBox05".length);
    else if (id.startsWith("ATagBox10")) key = id.slice("ATagBox10".length);
    const docsToSearch = (() => {
      const docs = [doc];
      if (document !== doc) docs.push(document);
      for (const d of candidateDocs$2()) {
        if (!docs.includes(d)) docs.push(d);
      }
      return docs;
    })();
    const openBtn = key ? docsToSearch.map((d) => d.querySelector(`button#TagBoxDropDown${CSS.escape(key)}`)).find((b) => b) : null;
    const fakeSelect = key ? docsToSearch.map((d) => d.querySelector(`pl-tag-box#ATagBox08${CSS.escape(key)} .fakeSelect`)).find((b) => b) : null;
    const openEl = openBtn || fakeSelect || openBtnEl;
    debug$1(log, `TagBox multi-select key: ${key}`);
    debug$1(log, `TagBox multi-select open element: ${describeEl$2(openEl)}`);
    await click$1(openEl);
    const findWrapper10 = () => key ? docsToSearch.map((d) => d.querySelector(`div#ATagBox10${CSS.escape(key)}`)).find((b) => b) : null;
    const findInputNow = () => {
      const all = [];
      if (key) {
        for (const d of docsToSearch) {
          all.push(...Array.from(d.querySelectorAll(`input#ATagBox01${CSS.escape(key)}`)));
        }
      }
      if (searchInputPrefix) {
        for (const d of docsToSearch) {
          all.push(...Array.from(d.querySelectorAll(`input[id^='${searchInputPrefix}']`)));
        }
      }
      return all.find((x) => isVisible$1(x)) || all[0] || null;
    };
    const findAnyTagNow = () => {
      const w10 = findWrapper10();
      if (!w10 || !key) return null;
      return w10.querySelector(`div[id^='ATagBox02#${CSS.escape(key)}#']`);
    };
    let tick = 0;
    const ready = await waitFor$1(() => {
      tick++;
      const input2 = findInputNow();
      if (input2) return { input: input2 };
      const anyTag = findAnyTagNow();
      if (anyTag) return { input: null };
      const reopenTarget = openBtn || openEl;
      reopenTarget.dispatchEvent?.(
        new (doc.defaultView || window).MouseEvent("click", { bubbles: true, cancelable: true })
      );
      if (CONFIG$1.DEBUG && tick % 6 === 0 && key) {
        const w10 = findWrapper10();
        const style = w10?.querySelector?.(".fakeDropDown")?.getAttribute?.("style") || "";
        debug$1(log, `TagBox multi-select wait: input=${input2 ? "yes" : "no"}, tag=${anyTag ? "yes" : "no"}, dd=${style}`);
      }
      return null;
    }, 2e4, 250, "TagBox multi-select input");
    const input = ready.input;
    if (input && !isVisible$1(input)) {
      debug$1(log, `TagBox multi-select input found but not visible: ${describeEl$2(input)}`);
    }
    if (input) debug$1(log, `TagBox multi-select input: ${describeEl$2(input)}`);
    const wrapper10 = findWrapper10();
    if (!wrapper10) {
      throw new Error(`Weighted price dropdown wrapper not found for key=${key}`);
    }
    const tagSel = key ? `div[id^='ATagBox02#${CSS.escape(key)}#']` : null;
    const clearFilter = async (inp) => {
      if (!inp) return;
      const view = inp.ownerDocument?.defaultView || window;
      inp.value = "";
      inp.dispatchEvent(new view.Event("input", { bubbles: true }));
      inp.dispatchEvent(new view.Event("change", { bubbles: true }));
      await sleep$2(200);
    };
    const ensureOpen = async () => {
      const target = openBtn || openEl;
      await click$1(target);
      return await waitFor$1(() => {
        const w10 = findWrapper10();
        const inp = findInputNow();
        const ddStyle = w10?.querySelector?.(".fakeDropDown")?.getAttribute?.("style") || "";
        const anyTag = tagSel ? w10?.querySelector?.(tagSel) : null;
        const open = /display\\s*:\\s*block/i.test(ddStyle) || !!anyTag;
        if (open && (inp || anyTag)) return { w10, inp };
        return null;
      }, 8800, 200, "Weighted dropdown open");
    };
    const findTagByText = (w10, text) => {
      if (!w10 || !tagSel) return null;
      const tags = Array.from(w10.querySelectorAll(tagSel));
      return tags.find((t2) => (t2.textContent || "").includes(text)) || null;
    };
    for (const text of optionTexts) {
      debug$1(log, `  Adding: ${text}`);
      const { w10, inp } = await ensureOpen();
      await clearFilter(inp);
      const parts = String(text).trim().split(/\\s+/);
      const shortText = parts.length > 2 ? parts.slice(2).join(" ") : parts.slice(1).join(" ");
      let tag = findTagByText(w10, text) || findTagByText(w10, shortText);
      if (!tag && inp) {
        await typeIntoInput$1(inp, shortText);
        await sleep$2(CONFIG$1.WAIT_AFTER_INPUT);
        tag = findTagByText(w10, text) || findTagByText(w10, shortText);
      }
      if (!tag) {
        const tags = tagSel ? Array.from(w10.querySelectorAll(tagSel)).map((t2) => (t2.textContent || "").trim().replace(/\\s+/g, " ")).filter(Boolean) : [];
        debug$1(log, `Weighted dropdown first tags: ${tags.slice(0, 12).join(" | ")}`);
        debug$1(log, `Weighted input value: ${inp ? JSON.stringify(inp.value) : "(no input)"}`);
        throw new Error(`Weighted price option not found: ${text}`);
      }
      tag.click();
      await sleep$2(600);
      await clearFilter(inp);
    }
    await click$1(okBtnEl);
    await sleep$2(CONFIG$1.WAIT_AFTER_SELECT);
  }
  function inferTagBoxKey(el) {
    const triggerEl = el?.closest?.(
      "button[id^='TagBoxDropDown'], div[id^='ATagBox05'], div[name^='ATagBox05'], div[id^='ATagBox10'], div[name^='ATagBox10'], div[id^='ATagBox08'], pl-tag-box[id^='ATagBox08']"
    ) || el;
    const id = triggerEl?.id || "";
    const name = triggerEl?.getAttribute?.("name") || "";
    if (id.startsWith("TagBoxDropDown")) return id.slice("TagBoxDropDown".length);
    if (id.startsWith("ATagBox05")) return id.slice("ATagBox05".length);
    if (id.startsWith("ATagBox10")) return id.slice("ATagBox10".length);
    if (id.startsWith("ATagBox08")) return id.slice("ATagBox08".length);
    if (name.startsWith("ATagBox05")) return name.slice("ATagBox05".length);
    if (name.startsWith("ATagBox10")) return name.slice("ATagBox10".length);
    return "";
  }
  function docsToSearchFromEl(el) {
    const doc = el?.ownerDocument || document;
    const docs = [doc];
    if (document !== doc) docs.push(document);
    for (const d of candidateDocs$2()) {
      if (!docs.includes(d)) docs.push(d);
    }
    return docs;
  }
  function tagBoxOptionIsSelected(el) {
    if (!el) return false;
    const cls = String(el.className || "").toLowerCase();
    if (cls.includes("selected") || cls.includes("active") || cls.includes("checked")) return true;
    const aria = String(el.getAttribute?.("aria-selected") || "").toLowerCase();
    if (aria === "true") return true;
    return false;
  }
  function normText(s) {
    return String(s || "").trim().replace(/\\s+/g, " ");
  }
  function isDropdownOpen(wrapper, doc) {
    if (!wrapper) return false;
    const fakeDropDown = wrapper.querySelector(".fakeDropDown");
    if (!fakeDropDown) return false;
    if (fakeDropDown.style.display !== "none" && fakeDropDown.style.display !== "") {
      return true;
    }
    const computedStyle = (doc?.defaultView || window).getComputedStyle(fakeDropDown);
    if (computedStyle.display !== "none" && fakeDropDown.offsetHeight > 0) {
      return true;
    }
    const hasOptions = fakeDropDown.querySelector('.tag, [id^="ATagBox02#"], [id^="ATagBox09#"]');
    return !!hasOptions;
  }
  async function closeOtherDropdowns(exceptKey, docsToSearch) {
    for (const doc of docsToSearch) {
      const allWrappers = doc.querySelectorAll('div[id^="ATagBox10"]');
      for (const wrapper of allWrappers) {
        const wrapperKey = wrapper.id.replace("ATagBox10", "");
        if (wrapperKey === exceptKey) continue;
        if (isDropdownOpen(wrapper, doc)) {
          doc.body?.click?.();
          await sleep$2(200);
          break;
        }
      }
    }
  }
  async function openTagBoxDropdown(btn, log) {
    const doc = btn?.ownerDocument || document;
    const docsToSearch = docsToSearchFromEl(btn);
    const key = inferTagBoxKey(btn);
    await closeOtherDropdowns(key, docsToSearch);
    const openBtn = key ? docsToSearch.map((d) => d.querySelector(`button#TagBoxDropDown${CSS.escape(key)}`)).find((b) => b) : null;
    const openEl = openBtn || btn;
    const wrapper = await waitFor$1(() => {
      return key ? docsToSearch.map((d) => d.querySelector(`div#ATagBox10${CSS.escape(key)}`)).find((w) => w) : null;
    }, 15e3, 200, `TagBox wrapper: ${key}`);
    const alreadyOpen = isDropdownOpen(wrapper, doc);
    if (!alreadyOpen) {
      await click$1(openEl);
    }
    let opened = false;
    for (let attempt = 0; attempt < 3 && !opened; attempt++) {
      opened = await waitFor$1(() => isDropdownOpen(wrapper, doc), 2e3, 100, null).catch(() => false);
      if (!opened && attempt < 2) {
        debug$1(log, `Dropdown not open after click, retrying... (attempt ${attempt + 2})`);
        await sleep$2(300);
        await click$1(openEl);
      }
    }
    if (!opened) {
      throw new Error(`Timeout waiting for: TagBox dropdown open: ${key}`);
    }
    const input = key ? docsToSearch.map((d) => d.querySelector(`input#ATagBox01${CSS.escape(key)}`)).find((x) => x && isVisible$1(x)) || docsToSearch.map((d) => d.querySelector(`input#ATagBox01${CSS.escape(key)}`)).find((x) => x) || wrapper.querySelector("input[id^='ATagBox01']") : null;
    await sleep$2(600);
    return { key, docsToSearch, wrapper, input, doc };
  }
  function findTagBoxOptionsInWrapper(wrapper, key) {
    if (!wrapper || !key) return [];
    const sel = `div[id^='ATagBox02#${CSS.escape(key)}#'], div[id^='ATagBox09#${CSS.escape(key)}#']`;
    return Array.from(wrapper.querySelectorAll(sel)).filter((el) => normText(el.textContent));
  }
  async function clearAllTagBoxSelections({ btn, log }) {
    const wrapper = btn?.closest?.(".tagBox, .tagBoxWrapper, .tagbox-wrapper") || btn?.parentElement?.closest?.(".tagBox, .tagBoxWrapper, .tagbox-wrapper");
    if (!wrapper) {
      const { wrapper: dropWrapper } = await openTagBoxDropdown(btn, log);
      const opts = findTagBoxOptionsInWrapper(dropWrapper, "");
      const selected = opts.filter(tagBoxOptionIsSelected);
      for (const el of selected) {
        el.click();
        await sleep$2(200);
      }
      dropWrapper.ownerDocument?.body?.click?.();
      await sleep$2(600);
      return;
    }
    const selectedTags = wrapper.querySelectorAll('.selectedTag, .fakeSelect .ellipsis[id^="ATagBox06"]');
    let clearedAny = false;
    for (const tag of selectedTags) {
      if (tag.classList.contains("hinweistext")) continue;
      const deleteBtn = tag.querySelector(".deleteButton, .icon-cross-small, .icon-o-cross");
      if (deleteBtn) {
        deleteBtn.click();
        clearedAny = true;
        await sleep$2(200);
      } else {
        tag.click();
        clearedAny = true;
        await sleep$2(200);
      }
    }
    if (clearedAny) {
      await sleep$2(600);
    }
    const hiddenSelect = wrapper.querySelector("select[multiple]");
    if (hiddenSelect) {
      const options = hiddenSelect.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          options[i].selected = false;
        }
      }
      const view = hiddenSelect.ownerDocument?.defaultView || window;
      hiddenSelect.dispatchEvent(new view.Event("change", { bubbles: true }));
      await sleep$2(200);
    }
  }
  async function selectSingleTagBoxByClick({ btn, value, log, maxRetries = 3 }) {
    const key = inferTagBoxKey(btn);
    debug$1(log, `2PC TagBox 单选: key=${key}, value="${value}"`);
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        debug$1(log, `[${attempt}/${maxRetries}] Phase 1: 执行选择操作`);
        await clearAllTagBoxSelections({ btn, log });
        const { key: openedKey, wrapper, input, doc } = await openTagBoxDropdown(btn, log);
        const optionsReady = await waitForDOMChange(
          wrapper,
          () => findTagBoxOptionsInWrapper(wrapper, openedKey).length > 0 || wrapper.querySelector(".tag, .ellipsis, [role='option']"),
          CONFIG$1.WAIT_FOR_DROPDOWN
        );
        if (!optionsReady) {
          debug$1(log, `选项列表未渲染，重试...`);
          doc.body?.click?.();
          await sleep$2(300);
          continue;
        }
        if (input) {
          const short = normText(value).split(/\s+/).slice(0, 2).join(" ");
          await typeIntoInput$1(input, short);
          await waitForDOMChange(wrapper, () => {
            const opts = findTagBoxOptionsInWrapper(wrapper, openedKey);
            return opts.some((o) => normText(o.textContent).toLowerCase().includes(short.toLowerCase()));
          }, CONFIG$1.WAIT_AFTER_INPUT + 500);
        }
        const allMatches = findTagBoxOptionsInWrapper(wrapper, openedKey).filter((o) => normText(o.textContent).toLowerCase().includes(normText(value).toLowerCase()));
        const uniqueness = verifyOptionUniqueness(allMatches, value);
        if (uniqueness.count === 0) {
          debug$1(log, `未找到匹配 "${value}" 的选项`);
          doc.body?.click?.();
          await sleep$2(300);
          continue;
        }
        if (!uniqueness.unique && uniqueness.count > 1) {
          debug$1(log, `警告: 找到 ${uniqueness.count} 个匹配项，使用精确匹配`);
        }
        const targetOpt = uniqueness.exactMatch || allMatches[0];
        debug$1(log, `点击选项: "${normText(targetOpt.textContent)}" (id=${targetOpt.id})`);
        if (!tagBoxOptionIsSelected(targetOpt)) {
          targetOpt.click();
        }
        doc.body?.click?.();
        debug$1(log, `[${attempt}/${maxRetries}] Phase 2: 验证选择结果`);
        const uiUpdated = await waitForDOMChange(
          wrapper,
          () => {
            const uiVerify2 = verifyUISelection(wrapper, value, { partial: true });
            return uiVerify2.success;
          },
          2e3
        );
        const uiVerify = verifyUISelection(wrapper, value, { partial: true });
        const selectVerify = verifyTagBoxSelection(openedKey || key, value, { partial: true });
        if (uiVerify.success) {
          debug$1(log, `✅ 验证通过 (UI): "${uiVerify.actual.join(", ")}"`);
          return { success: true, retries: attempt - 1, method: "ui" };
        }
        if (selectVerify.success) {
          debug$1(log, `⚠️ 验证通过 (hidden-select, UI未确认): "${selectVerify.actual}"`);
          return { success: true, retries: attempt - 1, method: "hidden-select-only" };
        }
        debug$1(log, `❌ 验证失败: 期望="${value}", UI="${uiVerify.actual.join(", ")}", select="${selectVerify.actual}"`);
        if (attempt < maxRetries) {
          await sleep$2(500);
        }
      } catch (e) {
        debug$1(log, `操作异常: ${e.message}`);
        if (attempt < maxRetries) {
          await sleep$2(500);
        }
      }
    }
    recordFailure({
      key: key || "unknown",
      expected: value,
      actual: readTagBoxValue(key)?.text || "unknown",
      error: `Failed after ${maxRetries} attempts`
    });
    return { success: false, retries: maxRetries, method: "failed" };
  }
  async function selectManyTagBoxByClick({ btn, values, log, maxRetries = 3 }) {
    const key = inferTagBoxKey(btn);
    debug$1(log, `2PC TagBox 多选: key=${key}, values=[${values.join(", ")}]`);
    await clearAllTagBoxSelections({ btn, log });
    const failedValues = [];
    let successCount = 0;
    const { key: openedKey, wrapper, input, doc } = await openTagBoxDropdown(btn, log);
    await waitForDOMChange(
      wrapper,
      () => findTagBoxOptionsInWrapper(wrapper, openedKey).length > 0,
      CONFIG$1.WAIT_FOR_DROPDOWN
    );
    const clearFilter = async () => {
      if (!input) return;
      const view = input.ownerDocument?.defaultView || window;
      input.value = "";
      input.dispatchEvent(new view.Event("input", { bubbles: true }));
      input.dispatchEvent(new view.Event("change", { bubbles: true }));
      await waitForDOMChange(wrapper, () => true, 200);
    };
    for (const v of values) {
      let valueSuccess = false;
      for (let attempt = 1; attempt <= maxRetries && !valueSuccess; attempt++) {
        try {
          debug$1(log, `[${attempt}/${maxRetries}] 选择: "${v}"`);
          await clearFilter();
          if (input) {
            const short = normText(v).split(/\s+/).slice(0, 2).join(" ");
            await typeIntoInput$1(input, short);
            await waitForDOMChange(wrapper, () => {
              const opts = findTagBoxOptionsInWrapper(wrapper, openedKey);
              return opts.some((o) => normText(o.textContent).toLowerCase().includes(short.toLowerCase()));
            }, CONFIG$1.WAIT_AFTER_INPUT + 500);
          }
          const allMatches = findTagBoxOptionsInWrapper(wrapper, openedKey).filter((o) => normText(o.textContent).toLowerCase().includes(normText(v).toLowerCase()));
          const uniqueness = verifyOptionUniqueness(allMatches, v);
          if (uniqueness.count === 0) {
            debug$1(log, `未找到 "${v}"`);
            continue;
          }
          const targetOpt = uniqueness.exactMatch || allMatches[0];
          if (!tagBoxOptionIsSelected(targetOpt)) {
            targetOpt.click();
          }
          await waitForDOMChange(wrapper, () => {
            const uiValues2 = readTagBoxUISelectedValues(wrapper);
            return uiValues2.some(
              (uv) => uv.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(uv.toLowerCase())
            );
          }, 1500);
          const uiValues = readTagBoxUISelectedValues(wrapper);
          const uiFound = uiValues.some(
            (uv) => uv.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(uv.toLowerCase())
          );
          const current = readTagBoxValue(openedKey || key);
          const texts = current?.texts || [current?.text];
          const selectFound = texts.some(
            (t2) => t2 && (t2.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(t2.toLowerCase()))
          );
          if (uiFound) {
            debug$1(log, `✅ "${v}" 验证通过 (UI)`);
            valueSuccess = true;
            successCount++;
          } else if (selectFound) {
            debug$1(log, `⚠️ "${v}" 验证通过 (hidden-select, UI未确认)`);
            valueSuccess = true;
            successCount++;
          } else {
            debug$1(log, `❌ "${v}" 验证失败，UI=[${uiValues.join(", ")}], select=[${texts.join(", ")}]`);
          }
        } catch (e) {
          debug$1(log, `"${v}" 异常: ${e.message}`);
        }
      }
      if (!valueSuccess) {
        failedValues.push(v);
        recordFailure({
          key: openedKey || key || "unknown",
          expected: v,
          actual: readTagBoxValue(openedKey || key)?.texts?.join(", ") || "unknown",
          error: `Failed after ${maxRetries} attempts`
        });
      }
    }
    doc.body?.click?.();
    await sleep$2(300);
    const success = failedValues.length === 0;
    if (!success) {
      debug$1(log, `多选完成: ${successCount}/${values.length} 成功，失败: [${failedValues.join(", ")}]`);
    } else {
      debug$1(log, `✅ 多选全部成功: ${successCount}/${values.length}`);
    }
    return { success, successCount, failedValues };
  }
  function sleep$1(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function candidateDocs$1() {
    const docs = [document];
    for (const iframe of document.querySelectorAll("iframe")) {
      try {
        if (iframe.contentDocument) {
          docs.push(iframe.contentDocument);
        }
      } catch {
      }
    }
    return docs;
  }
  function qsAny$1(selector) {
    if (!selector) return null;
    const selectors = Array.isArray(selector) ? selector : [selector];
    for (const sel of selectors) {
      const s = String(sel);
      for (const doc of candidateDocs$1()) {
        let node = null;
        if (s.startsWith("css=")) {
          node = doc.querySelector(s.slice(4));
        } else if (s.startsWith("text=")) {
          const text = s.slice(5).trim();
          const all = doc.querySelectorAll("button, a, span, div, label");
          node = Array.from(all).find((n) => n.textContent?.trim().includes(text));
        } else if (s.startsWith("xpath=")) {
          const xp = s.slice(6);
          const result = doc.evaluate(xp, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          node = result.singleNodeValue;
        } else {
          node = doc.querySelector(s);
        }
        if (node && node.nodeType === 1) return node;
      }
    }
    return null;
  }
  function describeEl$1(node) {
    if (!node) return "null";
    if (typeof node !== "object") return `Invalid(${typeof node})`;
    if (!node.nodeType) {
      return `Node(type=${node.nodeType}, name=${node.nodeName}, constructor=${node.constructor?.name})`;
    }
    if (node.nodeType !== 1) {
      return `Node(type=${node.nodeType}, name=${node.nodeName})`;
    }
    const id = node.id ? `#${node.id}` : "";
    const cls = node.className ? `.${String(node.className).trim().replace(/\s+/g, ".")}` : "";
    const text = node.textContent?.trim().slice(0, 30) || "";
    return `${node.tagName}${id}${cls}${text ? `[${text}]` : ""}`;
  }
  async function clickElement(selectorOrEl, { waitAfterClick = 300 } = {}) {
    const element = typeof selectorOrEl === "string" ? qsAny$1(selectorOrEl) : selectorOrEl;
    if (!element) {
      const selectorDesc = typeof selectorOrEl === "string" ? selectorOrEl : "element object";
      throw new Error(`Element not found: ${selectorDesc}`);
    }
    if (typeof element !== "object" || element === null) {
      throw new Error(`Invalid element type: ${typeof element}, expected object`);
    }
    if (!element.nodeType || element.nodeType !== 1) {
      throw new Error(`Invalid element node (nodeType=${element.nodeType}, expected 1): ${describeEl$1(element)}`);
    }
    if (typeof element.scrollIntoView === "function") {
      element.scrollIntoView({ block: "center", inline: "nearest" });
    }
    await sleep$1(200);
    const view = element.ownerDocument?.defaultView || window;
    element.dispatchEvent(new view.MouseEvent("mousedown", { bubbles: true, cancelable: true, view }));
    element.dispatchEvent(new view.MouseEvent("mouseup", { bubbles: true, cancelable: true, view }));
    element.dispatchEvent(new view.MouseEvent("click", { bubbles: true, cancelable: true, view }));
    await sleep$1(waitAfterClick);
    return element;
  }
  async function waitForCondition(check, timeoutMs = 2e4, stepMs = 200, label = "") {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const v = check();
        if (v) return v;
      } catch {
      }
      await sleep$1(stepMs);
    }
    throw new Error(`Timeout waiting for: ${label || "condition"}`);
  }
  function findInnerTabAnchor$1(labelText) {
    const want = String(labelText).trim();
    if (!want) return null;
    for (const doc of candidateDocs$1()) {
      const cells = Array.from(doc.querySelectorAll("td.InnerTab, td.InnerTabSelected"));
      for (const cell of cells) {
        const b = cell.querySelector("b");
        if (!b) continue;
        if ((b.textContent || "").trim().toLowerCase() !== want.toLowerCase()) continue;
        const link = cell.querySelector("a");
        if (link) return link;
      }
    }
    return null;
  }
  async function selectInnerTab$1(labelText, { waitAfterClick = 300, log } = {}) {
    const link = await waitForCondition(
      () => findInnerTabAnchor$1(labelText),
      2e4,
      300,
      `${labelText} tab`
    );
    const cell = link.closest("td");
    if (cell?.className?.includes("InnerTabSelected")) return;
    log?.(`Switching to ${labelText} tab...`);
    const onclick = link.getAttribute("onclick") || "";
    const m = onclick.match(/SelectTabelle\('([^']+)'\)/);
    const tabId = m?.[1];
    const doc = link.ownerDocument;
    const view = doc?.defaultView || window;
    const checkXYZ = doc?.form1?.CheckXYZ;
    if (checkXYZ?.value === "Send") {
      checkXYZ.value = "";
    }
    if (tabId && typeof view.SelectTabelle === "function") {
      view.SelectTabelle(tabId);
    } else {
      await clickElement(link, { waitAfterClick });
    }
    await sleep$1(600);
    await waitForCondition(() => {
      const newLink = findInnerTabAnchor$1(labelText);
      if (!newLink) return false;
      const newCell = newLink.closest("td");
      return newCell?.className?.includes("InnerTabSelected");
    }, 4e3, 200, `${labelText} tab selected`).catch(() => null);
    await sleep$1(600);
  }
  function getIframeContext(element) {
    if (!element) return null;
    const iframe = Array.from(document.querySelectorAll("iframe")).find((f) => {
      try {
        return f.contentDocument?.contains(element);
      } catch {
        return false;
      }
    });
    if (!iframe) return null;
    return {
      iframe,
      window: iframe.contentWindow,
      document: iframe.contentDocument,
      form: iframe.contentDocument?.forms?.["form1"] || null
    };
  }
  function resetCheckXYZ(formOrDoc) {
    let form = formOrDoc;
    if (formOrDoc?.forms) {
      form = formOrDoc.forms["form1"];
    }
    if (form?.CheckXYZ) {
      form.CheckXYZ.value = "";
      return true;
    }
    return false;
  }
  function getDoEditFn(viewOrDoc) {
    const view = viewOrDoc?.defaultView || viewOrDoc;
    if (!view) return null;
    return view.DoEdit || view.DoEdit2 || view.DoEdit3 || null;
  }
  async function submitViaDoEdit(element, fieldId, { log, fallbackFn } = {}) {
    const ctx = getIframeContext(element);
    if (!ctx) {
      log?.("submitViaDoEdit: element not in iframe");
      return false;
    }
    resetCheckXYZ(ctx.form);
    const doFn = getDoEditFn(ctx.window);
    if (typeof doFn === "function") {
      log?.(`Calling ${doFn.name || "DoEdit*"}('${fieldId}')...`);
      doFn.call(ctx.window, fieldId);
      return true;
    }
    if (fallbackFn) {
      log?.("DoEdit not found, trying fallback...");
      await fallbackFn(ctx);
      return true;
    }
    if (typeof ctx.form?.submit === "function") {
      log?.("DoEdit not found, falling back to form.submit()");
      ctx.form.submit();
      return true;
    }
    log?.("WARN: No submission method available");
    return false;
  }
  function findJobTypeTrigger(sel, tagBoxKeys, allowFallback = false) {
    const jobTypeKey = tagBoxKeys.JOB_TYPE;
    let trigger = qx$1(`//button[@id='TagBoxDropDown${jobTypeKey}']`) || qx$1(`//pl-tag-box[@id='ATagBox08${jobTypeKey}']//div[contains(@class,'fakeSelect')]`) || qx$1(`//div[@id='ATagBox10${jobTypeKey}']//div[contains(@class,'fakeSelect')]`);
    if (!trigger) {
      trigger = qsAny$2(sel.jobTypeDropdown);
    }
    if (!trigger && allowFallback) {
      const propSelect = qsAny$2(sel.property);
      if (propSelect) {
        const parentTable = propSelect.closest("table");
        if (parentTable) {
          trigger = parentTable.querySelector(
            `button[id^='TagBoxDropDown${jobTypeKey}'], div[id^='ATagBox10${jobTypeKey}']`
          );
          if (!trigger) {
            trigger = parentTable.querySelector(
              "pl-tag-box[id^='ATagBox08PLLR09'] div.fakeSelect, button[id^='TagBoxDropDownPLLR09']"
            );
          }
        }
      }
    }
    return trigger;
  }
  async function setPropertyToJobType(context, sel, tagBoxKeys) {
    const { log } = context;
    const existingTrigger = await waitFor$1(
      () => findJobTypeTrigger(sel, tagBoxKeys),
      2e3,
      200,
      "Job Type TagBox"
    ).catch(() => null);
    if (existingTrigger) {
      debug$1(log, "Job Type TagBox already visible, skipping Property setup");
      return false;
    }
    const propertySelect = await waitFor$1(
      () => qsAny$2(sel.property),
      5500,
      400,
      "Property select"
    ).catch(() => null);
    if (!propertySelect) {
      debug$1(log, "Property select not found");
      return false;
    }
    debug$1(log, "Setting property to Job Type...");
    const jobTypeOpt = Array.from(propertySelect.options).find(
      (o) => o.text.trim() === "Job Type" || o.value === "Job Type"
    );
    if (!jobTypeOpt) {
      debug$1(log, "Job Type option not found in Property select");
      return false;
    }
    const ctx = getIframeContext(propertySelect);
    if (!ctx) {
      debug$1(log, "Warning: Could not find iframe for Property select");
      return false;
    }
    propertySelect.selectedIndex = Array.from(propertySelect.options).indexOf(jobTypeOpt);
    debug$1(log, `Property value set to: ${propertySelect.value}`);
    debug$1(log, "Submitting Property change...");
    try {
      propertySelect.dispatchEvent(new ctx.window.Event("change", { bubbles: true }));
      propertySelect.dispatchEvent(new ctx.window.Event("input", { bubbles: true }));
    } catch {
    }
    const propertyId = `PLLR08${getIdSuffix$1()}`;
    await submitViaDoEdit(propertySelect, propertyId, {
      log: (msg) => debug$1(log, msg),
      fallbackFn: async (iframeCtx) => {
        const onchange = String(propertySelect.getAttribute("onchange") || "");
        const js = onchange.replace(/^javascript:/i, "").trim();
        if (js && typeof iframeCtx.window?.eval === "function") {
          debug$1(log, "Evaluating onchange handler...");
          try {
            iframeCtx.window.eval(js);
          } catch (e) {
            debug$1(log, `WARN: eval(onchange) failed: ${e.message}`);
          }
        }
      }
    });
    const jobTypeKey = tagBoxKeys.JOB_TYPE;
    try {
      await waitFor$1(() => {
        const doc = ctx.iframe.contentDocument;
        return doc?.querySelector(`#TagBoxDropDown${jobTypeKey}`) || doc?.querySelector(`#ATagBox10${jobTypeKey}`);
      }, 15e3, 500, `Job Type TagBox (${jobTypeKey}) after form submit`);
      debug$1(log, "Job Type TagBox appeared after form reload");
    } catch (e) {
      debug$1(log, `Warning: Job Type TagBox not found after Property change: ${e.message}`);
    }
    await sleep$2(600);
    return true;
  }
  async function selectJobTypeValue(context, jobType, sel, tagBoxKeys) {
    const { log } = context;
    const jobTypeKey = tagBoxKeys.JOB_TYPE;
    debug$1(log, `Selecting job type: ${jobType}`);
    let jobTypeTrigger = findJobTypeTrigger(sel, tagBoxKeys, true);
    if (!jobTypeTrigger) {
      jobTypeTrigger = await waitFor$1(
        () => qsAny$2(sel.jobTypeDropdown),
        CONFIG$1.WAIT_FOR_DROPDOWN,
        400,
        "Job type trigger"
      );
    }
    if (!jobTypeTrigger) {
      throw new Error("Job type trigger not found after trying all strategies");
    }
    debug$1(log, `Job type trigger found: ${describeEl$2(jobTypeTrigger)}`);
    const jobTypeResult = await selectTagBoxByIdWithFallback({
      triggerEl: jobTypeTrigger,
      tagBoxKey: jobTypeKey,
      optionText: jobType,
      entityType: "service",
      log
    });
    if (!jobTypeResult.success) {
      throw new Error(`Job type selection failed: ${jobTypeResult.error}`);
    }
    debug$1(log, `Job type selected via ${jobTypeResult.method} method`);
    debug$1(log, "Clicking Job Type Add button...");
    const jobTypeAddBtn = qsAny$2(sel.jobTypeAddBtn);
    if (!jobTypeAddBtn) {
      throw new Error("Job type Add button not found");
    }
    debug$1(log, `Job type Add button: ${describeEl$2(jobTypeAddBtn)}`);
    await click$1(jobTypeAddBtn);
    await sleep$2(600);
  }
  async function selectJobType(group, log) {
    const sel = getSEL();
    const tagBoxKeys = getTagBoxKeys();
    const context = { log };
    await setPropertyToJobType(context, sel, tagBoxKeys);
    if (group.jobtype) {
      await selectJobTypeValue(context, group.jobtype, sel, tagBoxKeys);
    }
  }
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];
      if (inQuotes) {
        if (ch === '"' && next === '"') {
          cur += '"';
          i++;
          continue;
        }
        if (ch === '"') {
          inQuotes = false;
          continue;
        }
        cur += ch;
        continue;
      }
      if (ch === '"') {
        inQuotes = true;
        continue;
      }
      if (ch === ",") {
        row.push(cur);
        cur = "";
        continue;
      }
      if (ch === "\n") {
        row.push(cur);
        cur = "";
        if (row.some((x) => x.trim().length > 0)) {
          rows.push(row);
        }
        row = [];
        continue;
      }
      if (ch === "\r") continue;
      cur += ch;
    }
    row.push(cur);
    if (row.some((x) => x.trim().length > 0)) {
      rows.push(row);
    }
    return rows;
  }
  function langLabel$1(code) {
    return String(code || "").trim();
  }
  function createJsonStore(key, { defaultValue = null } = {}) {
    return {
      load() {
        try {
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : defaultValue;
        } catch {
          return defaultValue;
        }
      },
      save(value) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch {
        }
      },
      clear() {
        try {
          localStorage.removeItem(key);
        } catch {
        }
      }
    };
  }
  function createTextStore(key, {
    defaultValue = "",
    maxChars = null,
    truncatePrefix = "... (truncated)\n"
  } = {}) {
    return {
      load() {
        try {
          const raw = localStorage.getItem(key);
          return raw || defaultValue;
        } catch {
          return defaultValue;
        }
      },
      save(text) {
        if (typeof text !== "string") return;
        let next = text;
        if (Number.isFinite(maxChars) && maxChars > 0 && next.length > maxChars) {
          next = next.slice(next.length - maxChars);
          next = `${truncatePrefix}${next}`;
          if (next.length > maxChars) {
            next = next.slice(next.length - maxChars);
          }
        }
        try {
          localStorage.setItem(key, next);
        } catch {
        }
      },
      clear() {
        try {
          localStorage.removeItem(key);
        } catch {
        }
      }
    };
  }
  const SESSION_KEY = "plunetPriceImportSessionV5";
  const PROGRESS_KEY = "plunetPriceImportProgressV1";
  const REPORT_KEY = "plunetPriceImportReportV1";
  createJsonStore(SESSION_KEY);
  createJsonStore(PROGRESS_KEY);
  createJsonStore(REPORT_KEY);
  class SearchSelect extends BaseInteraction {
constructor(config) {
      const isElement = config.selector instanceof Element || config.selector && typeof config.selector === "object" && config.selector.nodeType === 1;
      if (isElement) {
        super({ ...config, selector: "element-provided" });
        this._element = config.selector;
      } else {
        super(config);
        this._element = null;
      }
      this.multiSelect = config.multiSelect ?? false;
      this.submitButtonSelector = config.submitButtonSelector;
      this.verifySelector = config.verifySelector;
      this.use2PC = config.use2PC ?? true;
      this.searchInputPrefix = config.searchInputPrefix;
      this.listIdPrefix = config.listIdPrefix;
      this.entityType = config.entityType;
    }
getElement() {
      if (this._element) {
        return this._element;
      }
      return super.getElement();
    }
async execute(values, log) {
      const valueArray = this.normalizeValues(values);
      if (valueArray.length === 0) {
        log?.(`Skipping ${this.label}: no values provided`);
        return { success: true, values: [], selected: 0, skipped: true };
      }
      const triggerEl = await this.waitForElement();
      if (!triggerEl) {
        throw new Error(`${this.label}: trigger element not found`);
      }
      log?.(`Selecting ${this.label}: ${valueArray.join(", ")}`);
      let selectedCount = 0;
      if (this.use2PC) {
        selectedCount = await this.executeWith2PC(triggerEl, valueArray, log);
      } else {
        selectedCount = await this.executeStandard(triggerEl, valueArray, log);
      }
      if (this.submitButtonSelector) {
        await this.clickSubmitButton(log);
      }
      log?.(`${this.label}: selected ${selectedCount}/${valueArray.length} items`);
      return {
        success: selectedCount > 0,
        values: valueArray,
        selected: selectedCount
      };
    }
async executeWith2PC(triggerEl, values, log) {
      let selectedCount = 0;
      if (this.multiSelect) {
        const result = await selectManyTagBoxByClick({
          btn: triggerEl,
          values,
          log
        });
        selectedCount = result?.selected ?? values.length;
      } else {
        for (const value of values) {
          try {
            await selectSingleTagBoxByClick({
              btn: triggerEl,
              value,
              log
            });
            selectedCount++;
          } catch (e) {
            log?.(`${this.label}: failed to select "${value}": ${e.message}`);
          }
        }
      }
      return selectedCount;
    }
async executeStandard(triggerEl, values, log) {
      let selectedCount = 0;
      if (this.multiSelect && this.searchInputPrefix && this.listIdPrefix) {
        let okBtnEl = null;
        if (this.submitButtonSelector instanceof Element || this.submitButtonSelector && typeof this.submitButtonSelector === "object" && this.submitButtonSelector.nodeType === 1) {
          okBtnEl = this.submitButtonSelector;
        } else if (this.submitButtonSelector) {
          okBtnEl = qsAny$2(this.submitButtonSelector);
        }
        await selectManyFromTagBox$1({
          openBtnEl: triggerEl,
          searchInputPrefix: this.searchInputPrefix,
          listIdPrefix: this.listIdPrefix,
          optionTexts: values,
          okBtnEl,
          log
        });
        selectedCount = values.length;
      } else {
        for (const value of values) {
          try {
            await selectOneFromTagBox$1({
              dropBtnSel: triggerEl,
              optionText: value,
              entityType: this.entityType,
              log
            });
            selectedCount++;
          } catch (e) {
            log?.(`${this.label}: failed to select "${value}": ${e.message}`);
          }
        }
      }
      return selectedCount;
    }
async clickSubmitButton(log) {
      let submitBtn = null;
      if (this.submitButtonSelector instanceof Element || this.submitButtonSelector && typeof this.submitButtonSelector === "object" && this.submitButtonSelector.nodeType === 1) {
        submitBtn = this.submitButtonSelector;
      } else if (this.submitButtonSelector) {
        submitBtn = qsAny$2(this.submitButtonSelector);
      }
      if (submitBtn) {
        log?.(`${this.label}: clicking submit button...`);
        await click$1(submitBtn);
        await sleep$2(CONFIG$1.WAIT_AFTER_CLICK);
      } else {
        log?.(`${this.label}: submit button not found`);
      }
    }
normalizeValues(values) {
      if (values == null) return [];
      if (Array.isArray(values)) return values.filter((v) => v != null && v !== "");
      return [values].filter((v) => v != null && v !== "");
    }
async verify(values, log) {
      if (!this.verifySelector) return true;
      const valueArray = this.normalizeValues(values);
      let allFound = true;
      for (const value of valueArray) {
        const selector = this.verifySelector.replace("{value}", value);
        const found = qsAny$2(selector);
        if (!found) {
          log?.(`${this.label}: verification failed for "${value}"`);
          allFound = false;
        }
      }
      return allFound;
    }
async waitForSelection(value, timeout) {
      if (!this.verifySelector) return null;
      const selector = this.verifySelector.replace("{value}", value);
      try {
        return await waitFor$1(
          () => qsAny$2(selector),
          timeout ?? this.timeout,
          300,
          `${this.label}: ${value}`
        );
      } catch (e) {
        return null;
      }
    }
  }
  class SimpleInput extends BaseInteraction {
constructor(config) {
      super(config);
      this.waitAfter = config.waitAfter ?? CONFIG$1.WAIT_AFTER_INPUT;
      this.clearFirst = config.clearFirst ?? true;
      this.formatValue = config.formatValue;
      this.handleModals = config.handleModals ?? true;
      this.inputType = config.inputType ?? "text";
    }
shouldSkip(value) {
      if (value == null) return true;
      if (typeof value === "number") return !Number.isFinite(value);
      if (typeof value === "string") return value.trim() === "";
      return false;
    }
async execute(value, log) {
      if (this.shouldSkip(value)) {
        log?.(`Skipping ${this.label}: no value provided`);
        return { success: true, value: null, skipped: true };
      }
      if (this.handleModals) {
        await closeUnexpectedModals();
      }
      const el = await this.waitForElement();
      if (!el) {
        throw new Error(`${this.label}: input element not found`);
      }
      if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") {
        throw new Error(`${this.label}: expected <input> or <textarea>, got <${el.tagName.toLowerCase()}>`);
      }
      let formattedValue = value;
      if (this.formatValue) {
        formattedValue = this.formatValue(value);
      }
      const stringValue = String(formattedValue);
      if (this.clearFirst) {
        el.value = "";
      }
      setNativeValue$1(el, stringValue);
      await sleep$2(this.waitAfter);
      if (this.handleModals) {
        await closeUnexpectedModals();
      }
      log?.(`Set ${this.label}: ${stringValue}`);
      return { success: true, value: stringValue };
    }
async verify(value, log) {
      if (this.shouldSkip(value)) return true;
      const el = this.getElement();
      if (!el) {
        log?.(`${this.label}: element not found for verification`);
        return false;
      }
      let expectedValue = value;
      if (this.formatValue) {
        expectedValue = this.formatValue(value);
      }
      const expectedString = String(expectedValue);
      const actualValue = el.value?.trim() || "";
      if (typeof value === "number") {
        const actualNum = parseFloat(actualValue);
        const expectedNum = parseFloat(expectedString);
        if (Number.isFinite(actualNum) && Number.isFinite(expectedNum)) {
          const matches2 = Math.abs(actualNum - expectedNum) < 1e-3;
          if (!matches2) {
            log?.(`${this.label}: verification failed. Expected ${expectedNum}, got ${actualNum}`);
          }
          return matches2;
        }
      }
      const matches = actualValue === expectedString;
      if (!matches) {
        log?.(`${this.label}: verification failed. Expected "${expectedString}", got "${actualValue}"`);
      }
      return matches;
    }
getCurrentValue() {
      const el = this.getElement();
      return el?.value ?? null;
    }
getCurrentNumericValue() {
      const value = this.getCurrentValue();
      if (value == null) return null;
      const num = parseFloat(value);
      return Number.isFinite(num) ? num : null;
    }
isEmpty() {
      const value = this.getCurrentValue();
      return value == null || value.trim() === "";
    }
  }
  function isWordBasis(calculationbasis) {
    const s = String(calculationbasis || "").toLowerCase();
    return s === "words" || s === "characters" || s === "word" || s === "character" || s === "chars" || s === "char";
  }
  function buildBasePriceRowXpath(basePriceName) {
    const qName = JSON.stringify(basePriceName);
    return `//tr[(.//div[contains(@class,'ellipsis') and (normalize-space()=${qName} or contains(normalize-space(),${qName}))] or .//*[@aria-label=${qName}] or .//span[@aria-label=${qName}]) and .//input[contains(@id,'OutPPS28')]]`;
  }
  function buildWeightedRowXpath(weightedName) {
    const qW = JSON.stringify(weightedName);
    return `//tr[.//div[contains(@class,'ellipsis') and (normalize-space()=${qW} or contains(normalize-space(),${qW}))] or .//*[@aria-label=${qW}]]`;
  }
  function findWeightedControls(baseRowXpath) {
    const rows = qxAll$1(baseRowXpath);
    for (const row of rows) {
      const dropBtn = row.querySelector("button[id^='TagBoxDropDownOutPPS29']") || row.querySelector("div[id^='ATagBox05OutPPS29']") || row.querySelector("div[id^='ATagBox05OutPPS29'] .fakeSelect");
      const okBtn = row.querySelector("button[id^='OutPPS31']");
      if (dropBtn && okBtn) return { dropBtn, okBtn };
    }
    return null;
  }
  function isWeightedPriceInTable(weightedName) {
    const xpath = buildWeightedRowXpath(weightedName);
    return !!qx$1(xpath);
  }
  async function addWeightedPricesForBasePrice(bp, log, options = {}) {
    const weightedNames = Array.isArray(bp.weightedPriceNames) ? bp.weightedPriceNames : [];
    if (!isWordBasis(bp.calculationbasis)) {
      debug$1(log, `Skipping weighted prices for "${bp.basePriceName}": not word-based`);
      return { added: 0, skipped: weightedNames.length, reason: "not_word_basis" };
    }
    if (weightedNames.length === 0) {
      return { added: 0, skipped: 0, reason: "no_weighted_names" };
    }
    log(`Adding ${weightedNames.length} weighted price(s) for: ${bp.basePriceName}`);
    const baseRowXpath = options.baseRowXpath || buildBasePriceRowXpath(bp.basePriceName);
    await waitFor$1(
      () => qx$1(baseRowXpath),
      CONFIG$1.WAIT_FOR_DROPDOWN,
      300,
      `Base price row: ${bp.basePriceName}`
    );
    await sleep$2(900);
    const baseRows = qxAll$1(baseRowXpath);
    if (baseRows.length === 0) {
      debug$1(log, `WARN: Base price row not found: ${bp.basePriceName}`);
      return { added: 0, skipped: weightedNames.length, reason: "base_row_not_found" };
    }
    const controls = findWeightedControls(baseRowXpath) || await waitFor$1(
      () => findWeightedControls(baseRowXpath),
      6600,
      400,
      "Weighted price controls"
    ).catch(() => null);
    if (!controls?.dropBtn || !controls?.okBtn) {
      debug$1(log, `WARN: Weighted price controls not found for: ${bp.basePriceName}`);
      return { added: 0, skipped: weightedNames.length, reason: "controls_not_found" };
    }
    const existingNames = weightedNames.filter((name) => isWeightedPriceInTable(name));
    const namesToAdd = weightedNames.filter((name) => !isWeightedPriceInTable(name));
    if (existingNames.length > 0) {
      debug$1(log, `Skipping existing weighted prices: ${existingNames.join(", ")}`);
    }
    if (namesToAdd.length === 0) {
      debug$1(log, `All weighted prices already exist for: ${bp.basePriceName}`);
      return { added: 0, skipped: weightedNames.length, reason: "all_exist" };
    }
    const weightedSelect = new SearchSelect({
      selector: controls.dropBtn,
      label: "Weighted Prices",
      multiSelect: true,
      submitButtonSelector: controls.okBtn,
      searchInputPrefix: "ATagBox01OutPPS29",
      listIdPrefix: "ATagBox02#OutPPS29#",
      use2PC: false
});
    await weightedSelect.execute(namesToAdd, (msg) => debug$1(log, msg));
    let verifiedCount = 0;
    for (const name of namesToAdd) {
      const rowXpath = buildWeightedRowXpath(name);
      const found = await waitFor$1(
        () => qx$1(rowXpath),
        CONFIG$1.WAIT_FOR_DROPDOWN,
        300,
        `Weighted row: ${name}`
      ).catch(() => null);
      if (found) {
        verifiedCount++;
        debug$1(log, `✓ Added weighted price: ${name}`);
      } else {
        debug$1(log, `WARN: Could not verify weighted price: ${name}`);
      }
    }
    return {
      added: verifiedCount,
      skipped: existingNames.length,
      requested: weightedNames.length
    };
  }
  function isHourlyBasis(calculationbasis) {
    const s = String(calculationbasis || "").toLowerCase();
    return s.includes("hour") || s.includes("hours") || s.includes("stunde") || s.includes("std") || s.includes("hr");
  }
  async function setPriceFactor(basis, log) {
    const sel = getSEL();
    const wantFactor = isHourlyBasis(basis) ? "Hours" : "Default";
    const priceFactorInteraction = new SimpleSelect({
      selector: sel.priceFactor,
      label: "Price Factor",
      timeout: 1e4,
      waitAfter: 1500
});
    const priceFactorSelect = priceFactorInteraction.getElement();
    if (!priceFactorSelect) {
      try {
        await priceFactorInteraction.waitForElement();
      } catch (e) {
        if (isHourlyBasis(basis)) {
          log("WARN: Price factor select not found for hourly basis");
        }
        return false;
      }
    }
    const curFactor = getSelectSelectedText(priceFactorInteraction.getElement());
    if (curFactor === wantFactor) {
      debug$1(log, `Price factor already correct: ${wantFactor}`);
      return false;
    }
    try {
      await priceFactorInteraction.execute(wantFactor, (msg) => debug$1(log, msg));
      return true;
    } catch (e) {
      debug$1(log, `Price factor select failed: ${e.message}`);
      return false;
    }
  }
  function isBasePriceAlreadyInTable(basePriceName) {
    const qName = JSON.stringify(basePriceName);
    const xpath = `//tr[(.//div[contains(@class,'ellipsis') and (normalize-space()=${qName} or contains(normalize-space(),${qName}))] or .//*[@aria-label=${qName}] or .//span[@aria-label=${qName}]) and .//input[contains(@id,'OutPPS28')]]`;
    return !!qx$1(xpath);
  }
  async function addSingleBasePrice(bp, { isAllLanguages, allLanguagesRate, log, sel, save }) {
    log(`Adding base price: ${bp.basePriceName} (basis: ${bp.calculationbasis || "n/a"})`);
    if (isBasePriceAlreadyInTable(bp.basePriceName)) {
      debug$1(log, `✓ Base price "${bp.basePriceName}" already in table, updating only`);
    } else {
      await setPriceFactor(bp.calculationbasis, log);
      const basePriceDropdown = await waitFor$1(
        () => qsAny$2(sel.basePriceDropdown),
        CONFIG$1.WAIT_FOR_DROPDOWN,
        500,
        "Base price dropdown"
      );
      if (!basePriceDropdown) {
        throw new Error("Base price dropdown not found");
      }
      const basePriceSelect = new SearchSelect({
        selector: basePriceDropdown,
        label: "Base Price",
        multiSelect: false,
        submitButtonSelector: sel.basePriceOkBtn,
        use2PC: false
});
      debug$1(log, `Selecting Base Price: ${bp.basePriceName}`);
      await basePriceSelect.execute(bp.basePriceName, (msg) => debug$1(log, msg));
    }
    const baseRowXpath = buildBasePriceRowXpath(bp.basePriceName);
    await waitFor$1(() => qx$1(baseRowXpath), CONFIG$1.WAIT_FOR_DROPDOWN, 300, `Base price row: ${bp.basePriceName}`);
    await sleep$2(1400);
    const unitPriceValue = Number.isFinite(allLanguagesRate) ? String(allLanguagesRate) : "1";
    const baseUnitInputsXpath = `${baseRowXpath}//input[starts-with(@id,'+inp+OutPPS28')]`;
    const baseUnitInputs = qxAll$1(baseUnitInputsXpath);
    debug$1(log, `Setting base price unit value: ${unitPriceValue}`);
    for (const inp of baseUnitInputs) {
      setNativeValue$1(inp, unitPriceValue);
      await sleep$2(60);
    }
    await addWeightedPricesForBasePrice(bp, log, { baseRowXpath });
  }
  async function checkAllLanguagesCheckbox(log) {
    for (const doc of candidateDocs$2()) {
      const checkbox = doc.querySelector("input#OutPPS432");
      if (checkbox) {
        if (checkbox.checked) {
          log('"All languages" already checked.');
          return true;
        }
        const span = doc.querySelector('span[for="OutPPS432"]');
        if (span) {
          span.click();
          await sleep$2(CONFIG$1.WAIT_AFTER_CLICK);
          if (checkbox.checked) {
            log('"All languages" checkbox checked via span.');
            return true;
          }
        }
        checkbox.click();
        await sleep$2(CONFIG$1.WAIT_AFTER_CLICK);
        if (checkbox.checked) {
          log('"All languages" checkbox checked.');
          return true;
        }
      }
    }
    const fallback = qsAny$2('input#OutPPS432, input[name="OutPPS432"]');
    if (fallback && !fallback.checked) {
      const span = fallback.ownerDocument?.querySelector('span[for="OutPPS432"]');
      if (span) {
        span.click();
      } else {
        fallback.click();
      }
      await sleep$2(CONFIG$1.WAIT_AFTER_CLICK);
      if (fallback.checked) {
        log('"All languages" checkbox checked (fallback).');
        return true;
      }
    }
    log('WARN: Could not find or check "All languages" checkbox.');
    return false;
  }
  async function addLanguagePairsBatch(pairs, log) {
    if (!pairs || pairs.length === 0) return;
    const missing = pairs.filter((p) => {
      const aria = `${langLabel$1(p.srcLang)} > ${langLabel$1(p.tgtLang)}`;
      return !qx$1(`//span[@aria-label=${JSON.stringify(aria)}]`);
    });
    if (missing.length === 0) {
      log("Language pairs already exist; skipping add.");
      return;
    }
    const bySrc = new Map();
    for (const p of missing) {
      const src = langLabel$1(p.srcLang);
      const tgt = langLabel$1(p.tgtLang);
      if (!bySrc.has(src)) bySrc.set(src, new Set());
      bySrc.get(src).add(tgt);
    }
    const srcBtn = await waitFor$1(
      () => findTagBoxByLabel("Source language"),
      CONFIG$1.WAIT_FOR_DROPDOWN,
      500,
      "Source language button"
    );
    const tgtBtn = await waitFor$1(
      () => findTagBoxByLabel("Target language"),
      CONFIG$1.WAIT_FOR_DROPDOWN,
      500,
      "Target language button"
    );
    const sel = getSEL();
    const addBtn = await waitFor$1(
      () => qsAny$2(sel.addLangPairBtn),
      CONFIG$1.WAIT_FOR_DROPDOWN,
      500,
      "Add language pair button"
    );
    if (!addBtn) throw new Error("Add language pair button not found");
    const srcLangSelect = new SearchSelect({
      selector: srcBtn,
label: "Source Language",
      multiSelect: false,
      use2PC: true
    });
    const tgtLangSelect = new SearchSelect({
      selector: tgtBtn,
label: "Target Language",
      multiSelect: true,
      use2PC: true
    });
    for (const [src, tgtSet] of bySrc.entries()) {
      const tgts = Array.from(tgtSet.values());
      log(`Adding language pairs: ${src} → (${tgts.length} targets)`);
      await srcLangSelect.execute(src, log);
      await tgtLangSelect.execute(tgts, log);
      await click$1(addBtn);
      for (const tgt of tgts) {
        const aria = `${src} > ${tgt}`;
        await waitFor$1(
          () => qx$1(`//span[@aria-label=${JSON.stringify(aria)}]`),
          5500,
          300,
          `Language pair row: ${aria}`
        );
      }
      await sleep$2(600);
    }
  }
  async function setLanguagePairRate(pair, log, { saveAfter = false, save } = {}) {
    const src = langLabel$1(pair.srcLang);
    const tgt = langLabel$1(pair.tgtLang);
    const aria = `${src} > ${tgt}`;
    const langPairPriceXpath = `xpath=//span[@aria-label=${JSON.stringify(aria)}]/ancestor::tr[1]//input[starts-with(@id,'+inp+OutPPS04')]`;
    const fallbackXpath = `xpath=//input[starts-with(@id,'+inp+OutPPS04')]`;
    let selector = langPairPriceXpath;
    if (!qx$1(langPairPriceXpath.replace("xpath=", ""))) {
      selector = fallbackXpath;
    }
    const rateInput = new SimpleInput({
      selector,
      label: `Rate (${aria})`,
      handleModals: true
});
    try {
      await rateInput.execute(pair.rate, (msg) => debug$1(log, msg));
    } catch (e) {
      debug$1(log, `WARN: Rate input not found for: ${aria}`);
    }
    if (saveAfter && save) {
      await save();
    }
  }
  async function setPercentageForRow(weightedName, percentage, log) {
    const qW = JSON.stringify(weightedName);
    const rowXpath = `//tr[.//div[contains(@class,'ellipsis') and (normalize-space()=${qW} or contains(normalize-space(),${qW}))] or .//*[@aria-label=${qW}] or .//span[@aria-label=${qW}]]`;
    await waitFor$1(() => qx$1(rowXpath), CONFIG$1.WAIT_FOR_DROPDOWN, 300, `Weighted row: ${weightedName}`).catch(() => null);
    const rows = qxAll$1(rowXpath);
    const inputs = [];
    for (const row of rows) {
      const inps = row.querySelectorAll("input[id^='+inp+OutPPS26']");
      if (inps.length === 1) inputs.push(inps[0]);
    }
    if (inputs.length === 0) {
      debug$1(log, `WARN: Weighting input not found for: ${weightedName}`);
      return false;
    }
    debug$1(log, `Set Percentage (${weightedName}): ${percentage}% (${inputs.length} inputs)`);
    for (const inp of inputs) {
      try {
        inp.focus();
      } catch {
      }
      setNativeValue$1(inp, String(percentage));
      try {
        inp.blur();
      } catch {
      }
      await sleep$2(20);
    }
    await sleep$2(Math.min(CONFIG$1.WAIT_AFTER_INPUT, 180));
    return true;
  }
  function findCatInterfaceTable() {
    for (const doc of candidateDocs$1()) {
      const tables = Array.from(doc.querySelectorAll("table"));
      for (const table of tables) {
        const text = table.textContent || "";
        if (text.includes("X-Translated") && text.includes("Not translated") && text.includes("100%")) {
          return table;
        }
      }
    }
    return null;
  }
  function extractPriceNameFromRowText(text) {
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
    const match = normalized.match(/per\s+1\s+(.+?)(?:\s*\(Base price:|$)/i);
    return match ? match[1].trim() : normalized;
  }
  function buildCatInterfaceRows(table) {
    const rows = Array.from(table.querySelectorAll("tr"));
    const out = [];
    for (const row of rows) {
      const inputs = Array.from(row.querySelectorAll("input[id^='MEMQZ']"));
      if (inputs.length === 0) continue;
      const byCol = {};
      for (const input of inputs) {
        const m = String(input.id || "").match(/^MEMQZ0?(\d+)_/i);
        if (m) {
          byCol[Number(m[1])] = input;
        }
      }
      const tds = row.querySelectorAll("td");
      const lastTd = tds[tds.length - 1];
      const rowText = String(lastTd?.textContent || row.textContent || "").trim();
      const priceName = extractPriceNameFromRowText(rowText);
      out.push({ row, byCol, rowText, priceName });
    }
    return out;
  }
  function getCatColumnsForName(name, { isBase } = {}) {
    const n = String(name || "").toLowerCase();
    if (isBase || /\bnew\b/.test(n)) {
      return [1, 2];
    }
    if (n.includes("repetitions")) return [9];
    if (n.includes("101%")) return [8, 10];
    if (n.includes("100%")) return [7];
    if (n.includes("95-99")) return [6];
    if (n.includes("85-94")) return [5];
    if (n.includes("75-84")) return [4];
    if (n.includes("50-74")) return [3];
    if (n.includes("not translated")) return [1];
    if (n.includes("fragments")) return [2];
    return [];
  }
  async function ensureCheckboxChecked(input, log) {
    if (!input) return;
    if (input.checked) return;
    if (input.disabled) {
      log?.(`WARN: Checkbox disabled: ${input.id}`);
      return;
    }
    const escaped = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(input.id) : input.id;
    const span = input.closest("label")?.querySelector(`span[for='${escaped}']`);
    await clickElement(span || input);
    await sleep$1(300);
  }
  async function openCatInterfaceTab(log) {
    await selectInnerTab$1("CAT interface", { log });
  }
  async function ensureMemoQManagerSelected({ memoQBtnSelector, log }) {
    const btn = await waitForCondition(
      () => qsAny$1(memoQBtnSelector),
      2e4,
      300,
      "memoQManager button"
    );
    if (!btn) return;
    if (!btn.classList.contains("active")) {
      log?.("Selecting memoQManager...");
      await clickElement(btn);
      await sleep$1(600);
    }
  }
  function isNewBasePriceOnly(name) {
    const n = String(name || "").toLowerCase();
    return /\bnew\b/i.test(n) && !/\bnew\s+discount\b/i.test(n);
  }
  function isNewDiscountPrice(name) {
    const n = String(name || "").toLowerCase();
    return /\bnew\s+discount\b/i.test(n);
  }
  async function mapAllCatInterfaceRows({ memoQBtnSelector, log, skipNewWhenNewDiscount = false }) {
    await openCatInterfaceTab(log);
    await ensureMemoQManagerSelected({ memoQBtnSelector, log });
    const table = await waitForCondition(
      () => findCatInterfaceTable(),
      2e4,
      300,
      "CAT interface matrix"
    );
    const rows = buildCatInterfaceRows(table);
    log?.(`Found ${rows.length} CAT rows`);
    let mappedCount = 0;
    let skippedNew = 0;
    for (const rowData of rows) {
      const name = rowData.priceName;
      if (skipNewWhenNewDiscount && isNewBasePriceOnly(name)) {
        skippedNew++;
        continue;
      }
      const isBase = isNewBasePriceOnly(name) || isNewDiscountPrice(name);
      const cols = getCatColumnsForName(name, { isBase });
      if (cols.length === 0) {
        continue;
      }
      for (const col of cols) {
        const checkbox = rowData.byCol[col];
        if (checkbox && !checkbox.checked) {
          await ensureCheckboxChecked(checkbox, log);
          mappedCount++;
        }
      }
    }
    if (skippedNew > 0) {
      log?.(`Skipped ${skippedNew} "New" rows (using New Discount instead)`);
    }
    log?.(`Mapped ${mappedCount} checkboxes`);
    return mappedCount;
  }
  function findInnerTabAnchor(labelText) {
    const want = String(labelText).trim();
    if (!want) return null;
    for (const doc of candidateDocs$2()) {
      const cells = Array.from(doc.querySelectorAll("td.InnerTab, td.InnerTabSelected"));
      for (const cell of cells) {
        const b = cell.querySelector("b");
        if (!b) continue;
        if ((b.textContent || "").trim() !== want) continue;
        const link = cell.querySelector("a");
        if (link) return link;
      }
    }
    return null;
  }
  async function selectInnerTab(labelText, log) {
    const link = await waitFor$1(() => findInnerTabAnchor(labelText), 2e4, 300, `${labelText} tab`);
    const cell = link.closest("td");
    if (cell?.className?.includes("InnerTabSelected")) return;
    debug$1(log, `Switching to ${labelText} tab...`);
    const onclick = link.getAttribute("onclick") || "";
    const m = onclick.match(/SelectTabelle\('([^']+)'\)/);
    const tabId = m?.[1];
    const doc = link.ownerDocument;
    const view = doc?.defaultView || window;
    const checkXYZ = doc?.form1?.CheckXYZ;
    if (checkXYZ && checkXYZ.value === "Send") {
      checkXYZ.value = "";
    }
    if (tabId && typeof view.SelectTabelle === "function") {
      view.SelectTabelle(tabId);
    } else {
      await click$1(link);
    }
    await sleep$2(600);
    await waitFor$1(() => {
      const newLink = findInnerTabAnchor(labelText);
      if (!newLink) return false;
      const newCell = newLink.closest("td");
      return newCell?.className?.includes("InnerTabSelected");
    }, 4e3, 200, `${labelText} tab selected`).catch(() => null);
    await sleep$2(600);
  }
  async function openPricesTab(log) {
    await selectInnerTab("Prices", log);
  }
  const LOG_MAX_CHARS = 12e4;
  function createSessionManager({
    moduleId,
    sessionVersion = "v1",
    onStateChange = null
  }) {
    const sessionKey = `${moduleId}-session-${sessionVersion}`;
    const progressKey = `${moduleId}-progress-${sessionVersion}`;
    const logKey = `${moduleId}-logs-${sessionVersion}`;
    const reportKey = `${moduleId}-report-${sessionVersion}`;
    const sessionStore = createJsonStore(sessionKey);
    const progressStore = createJsonStore(progressKey);
    const logStore = createTextStore(logKey, { maxChars: LOG_MAX_CHARS });
    const reportStore = createJsonStore(reportKey);
    let session = null;
    let progress = null;
    function createSession(data = {}) {
      return {
        status: "idle",
        currentIndex: 0,
        totalItems: 0,
        currentStep: null,
        data,
        lastUpdated: Date.now()
      };
    }
    function createProgress(totalGroups = 0) {
      return {
        currentGroupIndex: 0,
        totalGroups,
        currentGroupName: "",
        currentStep: null,
        groups: [],
        lastError: null,
        failedStep: null
      };
    }
    function initGroupProgress(group, stepIds) {
      const steps = {};
      for (const id of stepIds) {
        steps[id] = "pending";
      }
      return {
        name: group.name || group.pricelistName || "Group",
        status: "pending",
        steps,
        error: null,
        rowCount: group.rowCount ?? null,
        rowStart: group.rowStart ?? null,
        rowEnd: group.rowEnd ?? null
      };
    }
    function loadSession() {
      session = sessionStore.load();
      return session;
    }
    function saveSession() {
      if (session) {
        session.lastUpdated = Date.now();
        sessionStore.save(session);
        if (onStateChange) onStateChange("session", session);
      }
    }
    function clearSession() {
      session = null;
      sessionStore.clear();
      clearProgress();
    }
    function loadProgress() {
      progress = progressStore.load();
      return progress;
    }
    function saveProgress() {
      if (progress) {
        progressStore.save(progress);
        if (onStateChange) onStateChange("progress", progress);
      }
    }
    function clearProgress() {
      progress = null;
      progressStore.clear();
    }
    function setStatus(status) {
      if (!session) session = createSession();
      session.status = status;
      saveSession();
    }
    function updateStep(stepId, status, error = null) {
      if (!progress) return;
      const group = progress.groups[progress.currentGroupIndex];
      if (group) {
        group.steps[stepId] = status;
        if (error) {
          group.error = error;
          progress.lastError = error;
          progress.failedStep = stepId;
        }
        if (status === "failed") {
          group.status = "failed";
        }
      }
      progress.currentStep = stepId;
      saveProgress();
    }
    function completeGroup() {
      if (!progress) return;
      const group = progress.groups[progress.currentGroupIndex];
      if (group) {
        group.status = "completed";
      }
      saveProgress();
    }
    function nextGroup() {
      if (!progress) return false;
      if (progress.currentGroupIndex < progress.totalGroups - 1) {
        progress.currentGroupIndex++;
        progress.currentGroupName = progress.groups[progress.currentGroupIndex]?.name || "";
        progress.currentStep = null;
        saveProgress();
        return true;
      }
      return false;
    }
    function resetFromStep(stepId, stepIds) {
      if (!progress) return;
      const group = progress.groups[progress.currentGroupIndex];
      if (!group) return;
      let found = false;
      for (const id of stepIds) {
        if (id === stepId) found = true;
        if (found) {
          group.steps[id] = "pending";
        }
      }
      group.status = "in_progress";
      group.error = null;
      progress.failedStep = null;
      progress.lastError = null;
      progress.currentStep = stepId;
      saveProgress();
    }
    function loadLog() {
      return logStore.load();
    }
    function saveLog(text) {
      logStore.save(text);
    }
    function clearLog() {
      logStore.clear();
    }
    function loadReport() {
      return reportStore.load();
    }
    function saveReport(data) {
      reportStore.save(data);
    }
    function clearReport() {
      reportStore.clear();
    }
    function canResume() {
      const s = loadSession();
      return s && (s.status === "running" || s.status === "paused");
    }
    function getResumeInfo() {
      const s = loadSession();
      const p = loadProgress();
      if (!s || !canResume()) return null;
      return {
        session: s,
        progress: p,
        currentIndex: p?.currentGroupIndex ?? s.currentIndex,
        totalItems: p?.totalGroups ?? s.totalItems,
        currentName: p?.currentGroupName ?? "",
        currentStep: p?.currentStep ?? s.currentStep,
        lastError: p?.lastError ?? null
      };
    }
    function clearAll() {
      clearSession();
      clearProgress();
      clearLog();
      clearReport();
    }
    return {
createSession,
      loadSession,
      saveSession,
      clearSession,
      setStatus,
      get session() {
        return session;
      },
      set session(val) {
        session = val;
      },
createProgress,
      initGroupProgress,
      loadProgress,
      saveProgress,
      clearProgress,
      updateStep,
      completeGroup,
      nextGroup,
      resetFromStep,
      get progress() {
        return progress;
      },
      set progress(val) {
        progress = val;
      },
loadLog,
      saveLog,
      clearLog,
loadReport,
      saveReport,
      clearReport,
canResume,
      getResumeInfo,
clearAll
    };
  }
  const STEPS = [
    { id: "create", label: "Create price list" },
    { id: "setName", label: "Set name" },
    { id: "setCurrency", label: "Set currency" },
    { id: "setCalcUnit", label: "Set calculation unit" },
    { id: "setJobType", label: "Set job type" },
    { id: "ensurePricesView", label: "Ensure prices view" },
    { id: "setPriceFactor", label: "Set price factor" },
    { id: "addLangPairs", label: "Add language pairs" },
    { id: "setLangRates", label: "Set language pair rates" },
    { id: "addBasePrice", label: "Add base price" },
    { id: "setBasePriceValue", label: "Set base price value" },
{ id: "addWeightedPrices", label: "Add weighted prices", wordsCharsOnly: true },
    { id: "setWeightedValues", label: "Set weighted values", wordsCharsOnly: true },
    { id: "mapCatInterface", label: "Map CAT interface", wordsCharsOnly: true },
    { id: "save", label: "Save" }
  ];
  const sessionManager = createSessionManager({
    moduleId: SCRIPT_ID$2,
    sessionVersion: "v1"
  });
  class PriceListCreatorExecutor {
    constructor(options) {
      this.config = options.config;
      this.log = options.log;
      this.onProgress = options.onProgress || (() => {
      });
      this.onResume = options.onResume || null;
      this.isRunning = false;
      this.currentStep = 0;
      this.totalSteps = 0;
      this.sessionManager = sessionManager;
    }
static checkResume() {
      return sessionManager.getResumeInfo();
    }
static clearSession() {
      sessionManager.clearAll();
    }
getApplicableSteps() {
      const isWordsChars = isWordsOrCharsBasis(this.config.calcbasis);
      return STEPS.filter((step) => {
        if (step.wordsCharsOnly && !isWordsChars) return false;
        return true;
      });
    }
async execute(options = {}) {
      const { startStepIndex = 0 } = options;
      this.isRunning = true;
      const steps = this.getApplicableSteps();
      this.totalSteps = steps.length;
      this.sessionManager.session = this.sessionManager.createSession({
        config: this.config,
        startStepIndex
      });
      this.sessionManager.setStatus("running");
      const stepIds = steps.map((s) => s.id);
      this.sessionManager.progress = this.sessionManager.createProgress(1);
      this.sessionManager.progress.groups = [
        this.sessionManager.initGroupProgress(
          { name: this.config.name || "Price List" },
          stepIds
        )
      ];
      this.sessionManager.saveProgress();
      try {
        for (let i = startStepIndex; i < steps.length; i++) {
          if (!this.isRunning) {
            this.log(`Stopped at step ${i + 1}/${this.totalSteps}`, "warn");
            this.sessionManager.setStatus("paused");
            this.sessionManager.session.data.lastStepIndex = i;
            this.sessionManager.saveSession();
            return false;
          }
          this.currentStep = i + 1;
          const step = steps[i];
          this.onProgress({
            current: this.currentStep,
            total: this.totalSteps,
            step: step.label
          });
          this.log(`Step ${this.currentStep}/${this.totalSteps}: ${step.label}`);
          this.sessionManager.updateStep(step.id, "in_progress");
          try {
            await this.executeStep(step.id);
            this.sessionManager.updateStep(step.id, "completed");
          } catch (stepErr) {
            this.sessionManager.updateStep(step.id, "failed", stepErr.message);
            throw stepErr;
          }
          this.sessionManager.session.data.lastStepIndex = i + 1;
          this.sessionManager.session.currentStep = step.id;
          this.sessionManager.saveSession();
          await sleep$2(300);
        }
        this.log("Price list created successfully!", "success");
        this.sessionManager.completeGroup();
        this.sessionManager.setStatus("completed");
        return true;
      } catch (err) {
        this.log(`Error: ${err.message}`, "error");
        this.sessionManager.setStatus("failed");
        throw err;
      } finally {
        this.isRunning = false;
      }
    }
async resume() {
      const resumeInfo = this.sessionManager.getResumeInfo();
      if (!resumeInfo) {
        this.log("No session to resume", "warn");
        return false;
      }
      const lastStepIndex = resumeInfo.session?.data?.lastStepIndex || 0;
      this.config = resumeInfo.session?.data?.config || this.config;
      this.log(`Resuming from step ${lastStepIndex + 1}...`);
      return this.execute({ startStepIndex: lastStepIndex });
    }
stop() {
      this.isRunning = false;
    }
async executeStep(stepId) {
      const sel = getSEL();
      switch (stepId) {
        case "create":
          await this.stepCreatePriceList(sel);
          break;
        case "setName":
          await this.stepSetName(sel);
          break;
        case "setCurrency":
          await this.stepSetCurrency(sel);
          break;
        case "setCalcUnit":
          await this.stepSetCalcUnit(sel);
          break;
        case "setJobType":
          await this.stepSetJobType();
          break;
        case "ensurePricesView":
          await this.stepEnsurePricesView();
          break;
        case "setPriceFactor":
          await this.stepSetPriceFactor(sel);
          break;
        case "addLangPairs":
          await this.stepAddLangPairs();
          break;
        case "setLangRates":
          await this.stepSetLangRates();
          break;
        case "addBasePrice":
          await this.stepAddBasePrice(sel);
          break;
        case "setBasePriceValue":
          await this.stepSetBasePriceValue(sel);
          break;
        case "addWeightedPrices":
          await this.stepAddWeightedPrices(sel);
          break;
        case "setWeightedValues":
          await this.stepSetWeightedValues(sel);
          break;
        case "mapCatInterface":
          await this.stepMapCatInterface();
          break;
        case "save":
          await this.stepSave(sel);
          break;
        default:
          this.log(`Unknown step: ${stepId}`, "warn");
      }
    }
async stepCreatePriceList(sel) {
      const createTrigger = await waitFor$1(
        () => qsAny$2(sel.createDropdownTrigger),
        CONFIG$2.WAIT_FOR_ELEMENT,
        300,
        "Create dropdown trigger"
      );
      if (createTrigger) {
        createTrigger.click();
        await sleep$2(CONFIG$2.WAIT_AFTER_CLICK);
      }
      const createBtn = await waitFor$1(
        () => qsAny$2(sel.createPlusBtn),
        CONFIG$2.WAIT_FOR_ELEMENT,
        300,
        "Create plus button"
      );
      if (createBtn) {
        createBtn.click();
        await sleep$2(CONFIG$2.WAIT_AFTER_CLICK);
      }
      await waitFor$1(
        () => qsAny$2(sel.nameInput),
        CONFIG$2.WAIT_FOR_ELEMENT,
        300,
        "Price list name input"
      );
    }
async stepSetName(sel) {
      const nameInput = await waitFor$1(
        () => qsAny$2(sel.nameInput),
        CONFIG$2.WAIT_FOR_ELEMENT,
        300,
        "Name input"
      );
      if (nameInput) {
        setNativeValue$1(nameInput, this.config.name);
        await sleep$2(CONFIG$2.WAIT_AFTER_INPUT);
      }
    }
async stepSetCurrency(sel) {
      if (!this.config.currency) return;
      const currencySelect = new SimpleSelect({
        selector: sel.currency,
        label: "Currency"
      });
      await currencySelect.execute(this.config.currency, (msg) => this.log(msg));
    }
async stepSetCalcUnit(sel) {
      const calcBasisSelect = new SimpleSelect({
        selector: sel.calculationBasis,
        label: "Calculation Basis"
      });
      await calcBasisSelect.execute("Words", (msg) => this.log(msg));
    }
async stepSetJobType() {
      if (!this.config.jobtype) return;
      const jobtypeFullName = this.config.jobtypeFullName || getJobTypeFullName(this.config.jobtype);
      this.log(`Selecting job type: ${this.config.jobtype} -> ${jobtypeFullName}`);
      await selectJobType(
        { jobtype: jobtypeFullName },
        (msg) => this.log(msg)
      );
    }
async stepEnsurePricesView() {
      await openPricesTab((msg) => this.log(msg));
    }
async stepSetPriceFactor(sel) {
      const isHourly = isHourlyBasis$1(this.config.calcbasis);
      await setPriceFactor(
        isHourly ? "Hours" : "Default",
        (msg) => this.log(msg)
      );
    }
async stepAddLangPairs() {
      if (!this.config.langPairs || this.config.langPairs.length === 0) {
        this.log("No language pairs to add", "warn");
        return;
      }
      await addLanguagePairsBatch(
        this.config.langPairs,
        (msg) => this.log(msg)
      );
    }
async stepSetLangRates() {
      if (!this.config.langPairs || this.config.langPairs.length === 0) return;
      for (let i = 0; i < this.config.langPairs.length; i++) {
        if (!this.isRunning) break;
        const pair = this.config.langPairs[i];
        this.log(`Setting rate [${i + 1}/${this.config.langPairs.length}]: ${pair.srcLang} > ${pair.tgtLang} = ${pair.rate}`);
        await setLanguagePairRate(pair, (msg) => this.log(msg));
        await sleep$2(300);
      }
    }
async stepAddBasePrice(sel) {
      const basePriceName = this.generateBasePriceName();
      this.log(`Adding base price: ${basePriceName}`);
      const isWordsChars = isWordsOrCharsBasis(this.config.calcbasis);
      const weightedPriceNames = isWordsChars ? this.generateWeightedNames() : [];
      const bp = {
        basePriceName,
        calculationbasis: this.config.calcbasis,
        weightedPriceNames
      };
      const allLanguagesRate = 1;
      await addSingleBasePrice(bp, {
        isAllLanguages: true,
        allLanguagesRate,
        log: (msg) => this.log(msg),
        sel,
        save: null
});
      this.basePriceName = basePriceName;
      this.weightedPriceNames = weightedPriceNames;
    }
async stepSetBasePriceValue(sel) {
      const isWordsChars = isWordsOrCharsBasis(this.config.calcbasis);
      if (!isWordsChars) {
        this.log("Setting base price value to 1");
        await sleep$2(CONFIG$2.WAIT_AFTER_INPUT);
      }
    }
async stepAddWeightedPrices(sel) {
      if (!this.weightedPriceNames || this.weightedPriceNames.length === 0) {
        this.log("No weighted prices to add (not Words/Chars basis)");
        return;
      }
      this.log(`Verifying weighted prices: ${this.weightedPriceNames.length} items`);
      let verifiedCount = 0;
      for (const name of this.weightedPriceNames) {
        const qW = JSON.stringify(name);
        const rowXpath = `//tr[.//div[contains(@class,'ellipsis') and (normalize-space()=${qW} or contains(normalize-space(),${qW}))] or .//*[@aria-label=${qW}]]`;
        const row = qx$1(rowXpath);
        if (row) {
          verifiedCount++;
        } else {
          this.log(`WARN: Weighted price not found: ${name}`);
        }
      }
      this.log(`Verified ${verifiedCount}/${this.weightedPriceNames.length} weighted prices`);
    }
async stepSetWeightedValues(sel) {
      if (!this.config.fuzzyValues || this.config.fuzzyValues.length === 0) {
        this.log("No fuzzy values to set");
        return;
      }
      this.log("Setting fuzzy percentage values");
      const calcBasis = this.getBasePriceCalcBasis(this.config.calcbasis || "Words");
      const jobType = this.config.jobtype || "TRA";
      for (const fuzzy of this.config.fuzzyValues) {
        const weightedName = `${calcBasis} ${jobType} ${fuzzy.suffix}`;
        const success = await setPercentageForRow(weightedName, fuzzy.percentage, (msg) => this.log(msg));
        if (success) {
          this.log(`  ${fuzzy.suffix}: ${fuzzy.percentage}%`);
        } else {
          this.log(`  ${fuzzy.suffix}: ${fuzzy.percentage}% (WARN: row not found)`);
        }
      }
    }
async stepMapCatInterface() {
      const sel = getSEL();
      const includeNewDiscount = this.config.includeNewDiscount || false;
      await mapAllCatInterfaceRows({
        memoQBtnSelector: sel.memoQManagerBtn,
        skipNewWhenNewDiscount: includeNewDiscount,
        log: (msg) => this.log(msg)
      });
    }
async stepSave(sel) {
      const saveBtn = qsAny$2(sel.saveBtn);
      if (saveBtn) {
        saveBtn.click();
        await sleep$2(CONFIG$2.WAIT_AFTER_CLICK);
      }
    }
getBasePriceCalcBasis(calcBasis) {
      if (this.config.basePricePrefix) {
        return this.config.basePricePrefix;
      }
      const mapping = {
        "Words": "Words",
        "Chars": "Chars",
        "Hours": "Hour(s)",
        "Jobs": "Job(s)",
"Characters": "Chars",
        "characters": "Chars",
        "hours": "Hour(s)",
        "jobs": "Job(s)"
      };
      return mapping[calcBasis] || calcBasis;
    }
generateBasePriceName() {
      const calcBasis = this.getBasePriceCalcBasis(this.config.calcbasis || "Words");
      const jobType = this.config.jobtype || "TRA";
      const isWordsChars = isWordsOrCharsBasis(this.config.calcbasis);
      return isWordsChars ? `${calcBasis} ${jobType} New` : `${calcBasis} ${jobType}`;
    }
generateWeightedNames() {
      const calcBasis = this.getBasePriceCalcBasis(this.config.calcbasis || "Words");
      const jobType = this.config.jobtype || "TRA";
      const suffixes = this.config.includeNewDiscount ? [...WEIGHTED_SUFFIXES$1, "New Discount"] : WEIGHTED_SUFFIXES$1;
      return suffixes.map((suffix) => `${calcBasis} ${jobType} ${suffix}`);
    }
  }
  function parseLangPairCsv(csvText) {
    const rows = parseCsv(csvText);
    const errors = [];
    const pairs = [];
    if (rows.length < 2) {
      return { pairs: [], errors: ["CSV must have header row and at least one data row"] };
    }
    const header = rows[0].map((h) => h.trim().toLowerCase());
    const srcIdx = header.findIndex(
      (h) => h === "srclang" || h === "src_lang" || h === "source" || h === "sourcelang" || h === "source_lang"
    );
    const tgtIdx = header.findIndex(
      (h) => h === "tgtlang" || h === "tgt_lang" || h === "target" || h === "targetlang" || h === "target_lang"
    );
    const rateIdx = header.findIndex(
      (h) => h === "rate" || h === "price" || h === "unit_price" || h === "unitprice"
    );
    if (srcIdx < 0) errors.push("Missing required column: srcLang");
    if (tgtIdx < 0) errors.push("Missing required column: tgtLang");
    if (rateIdx < 0) errors.push("Missing required column: rate");
    if (errors.length > 0) {
      return { pairs, errors };
    }
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const srcLang = String(row[srcIdx] || "").trim();
      const tgtLang = String(row[tgtIdx] || "").trim();
      const rateStr = String(row[rateIdx] || "").trim();
      const rate = parseFloat(rateStr);
      if (!srcLang || !tgtLang) {
        errors.push(`Row ${i + 1}: Missing srcLang or tgtLang`);
        continue;
      }
      if (!Number.isFinite(rate)) {
        errors.push(`Row ${i + 1}: Invalid rate "${rateStr}"`);
        continue;
      }
      pairs.push({ srcLang, tgtLang, rate });
    }
    return { pairs, errors };
  }
  function parseManualInput(text) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const pairs = [];
    const errors = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith("#")) continue;
      let parts;
      if (line.includes("	")) {
        parts = line.split("	").map((p) => p.trim());
      } else {
        parts = line.split(",").map((p) => p.trim());
      }
      parts = parts.filter((p) => p.length > 0);
      if (parts.length < 3) {
        errors.push(`Line ${i + 1}: Expected 3 values (srcLang, tgtLang, rate), got ${parts.length}`);
        continue;
      }
      const [srcLang, tgtLang, rateStr] = parts;
      const rate = parseFloat(rateStr);
      if (!srcLang || !tgtLang) {
        errors.push(`Line ${i + 1}: Missing srcLang or tgtLang`);
        continue;
      }
      if (!Number.isFinite(rate)) {
        errors.push(`Line ${i + 1}: Invalid rate "${rateStr}"`);
        continue;
      }
      pairs.push({ srcLang, tgtLang, rate });
    }
    return { pairs, errors };
  }
  class PriceListCreatorTool {
    constructor() {
      this.ui = null;
      this.executor = null;
      this.state = {
        isRunning: false,
        langPairs: []
      };
    }
init() {
      this.ui = createPriceListCreatorPanel();
      const header = document.getElementById(`${SCRIPT_ID$2}-panel-header`);
      if (header) {
        makeDraggable(this.ui.panel, header);
      }
      this.bindEvents();
      this.checkResume();
      this.ui.show();
      this.log("Price List Creator initialized");
    }
checkResume() {
      const resumeInfo = PriceListCreatorExecutor.checkResume();
      if (!resumeInfo) return;
      const { session, progress } = resumeInfo;
      const config = session?.data?.config;
      const lastStepIndex = session?.data?.lastStepIndex || 0;
      if (!config?.name) return;
      this.log(`Found interrupted session: ${config.name}`);
      this.log(`  Last step: ${lastStepIndex + 1}, Status: ${session.status}`);
      const resumeConfirm = confirm(
        `Found interrupted price list creation:
Name: ${config.name}
Last step: ${lastStepIndex + 1}

Do you want to resume?`
      );
      if (resumeConfirm) {
        this.resumeExecution(resumeInfo);
      } else {
        PriceListCreatorExecutor.clearSession();
        this.log("Previous session cleared");
      }
    }
async resumeExecution(resumeInfo) {
      const { session } = resumeInfo;
      const config = session?.data?.config;
      if (!config) {
        this.log("Cannot resume: invalid session data", "error");
        return;
      }
      if (config.name) {
        const parts = config.name.split("_");
        if (parts.length >= 1) {
          this.ui.prefixInput.value = parts[0];
        }
      }
      if (config.jobtype) this.ui.jobtypeSelect.value = config.jobtype;
      if (config.calcbasis) this.ui.calcbasisSelect.value = config.calcbasis;
      if (config.currency) this.ui.currencySelect.value = config.currency;
      this.ui.updateGeneratedName();
      this.ui.toggleFuzzySection(this.ui.isWordsChars());
      if (config.fuzzyValues) {
        config.fuzzyValues.forEach((fv) => {
          const input = document.getElementById(`plc-fuzzy-${fv.id}`);
          if (input) input.value = fv.percentage;
        });
      }
      if (config.langPairs && config.langPairs.length > 0) {
        const langPairText = config.langPairs.map((lp) => `${lp.srcLang}	${lp.tgtLang}	${lp.rate}`).join("\n");
        this.ui.langpairsInput.value = langPairText;
        this.state.langPairs = config.langPairs;
      }
      this.executor = new PriceListCreatorExecutor({
        config,
        log: (msg, type) => this.log(msg, type),
        onProgress: ({ current, total, step }) => {
          this.ui.setStatus(t$2("statusExecuting", { current, total, step }));
        }
      });
      this.state.isRunning = true;
      this.ui.syncButtonState(this.state);
      this.log("Resuming execution...");
      try {
        const success = await this.executor.resume();
        if (success) {
          this.ui.setStatus(t$2("statusCompleted"), "success");
        } else {
          this.ui.setStatus(t$2("statusStopped", {
            current: this.executor.currentStep,
            total: this.executor.totalSteps
          }));
        }
      } catch (err) {
        this.ui.setStatus(t$2("statusError", { message: err.message }), "error");
        this.log(`Resume error: ${err.message}`, "error");
      } finally {
        this.state.isRunning = false;
        this.ui.syncButtonState(this.state);
      }
    }
bindEvents() {
      this.ui.prefixInput.addEventListener("input", () => {
        this.ui.syncButtonState(this.state);
      });
      this.ui.langpairsInput.addEventListener("input", () => {
        this.parseLangPairs();
        this.ui.syncButtonState(this.state);
      });
      this.ui.executeBtn.addEventListener("click", () => {
        this.execute();
      });
      this.ui.stopBtn.addEventListener("click", () => {
        this.stop();
      });
      this.ui.clearBtn.addEventListener("click", () => {
        this.clear();
      });
    }
parseLangPairs() {
      const text = this.ui.getLangPairsText();
      if (!text.trim()) {
        this.state.langPairs = [];
        return;
      }
      const { pairs, errors } = parseManualInput(text);
      const validPairs = [];
      const warnings = [];
      for (const pair of pairs) {
        const srcId = getLanguageId(pair.srcLang);
        const tgtId = getLanguageId(pair.tgtLang);
        if (srcId == null) {
          warnings.push(t$2("warningLangNotFound", { lang: pair.srcLang }));
          continue;
        }
        if (tgtId == null) {
          warnings.push(t$2("warningLangNotFound", { lang: pair.tgtLang }));
          continue;
        }
        validPairs.push(pair);
      }
      this.state.langPairs = validPairs;
      errors.forEach((e) => this.log(e, "warn"));
      warnings.forEach((w) => this.log(w, "warn"));
    }
async execute() {
      this.parseLangPairs();
      if (this.state.langPairs.length === 0) {
        this.ui.setStatus(t$2("statusNoData"), "error");
        return;
      }
      const config = {
        name: this.ui.getName(),
        jobtype: this.ui.getJobType(),
        jobtypeFullName: getJobTypeFullName(this.ui.getJobType()),
        calcbasis: this.ui.getCalcBasis(),
        currency: this.ui.getCurrency(),
        basePricePrefix: this.ui.getBasePricePrefix(),
        isWordsChars: this.ui.isWordsChars(),
        langPairs: this.state.langPairs,
        includeNewDiscount: this.ui.includeNewDiscount(),
        fuzzyValues: this.ui.getFuzzyValues(this.ui.includeNewDiscount())
      };
      this.log(`Creating price list: ${config.name}`);
      this.log(`  Job Type: ${config.jobtypeFullName} (${config.jobtype})`);
      this.log(`  Calc Basis: ${config.calcbasis}`);
      this.log(`  Currency: ${config.currency}`);
      this.log(`  Base Price Prefix: ${config.basePricePrefix}`);
      this.log(`  Language Pairs: ${config.langPairs.length}`);
      this.executor = new PriceListCreatorExecutor({
        config,
        log: (msg, type) => this.log(msg, type),
        onProgress: ({ current, total, step }) => {
          this.ui.setStatus(t$2("statusExecuting", { current, total, step }));
        }
      });
      this.state.isRunning = true;
      this.ui.syncButtonState(this.state);
      this.ui.setStatus(t$2("statusCreating"));
      try {
        const success = await this.executor.execute();
        if (success) {
          this.ui.setStatus(t$2("statusCompleted"), "success");
          PriceListCreatorExecutor.clearSession();
        } else {
          this.ui.setStatus(t$2("statusStopped", {
            current: this.executor.currentStep,
            total: this.executor.totalSteps
          }));
        }
      } catch (err) {
        this.ui.setStatus(t$2("statusError", { message: err.message }), "error");
        this.log(`Error: ${err.message}`, "error");
      } finally {
        this.state.isRunning = false;
        this.ui.syncButtonState(this.state);
      }
    }
stop() {
      if (this.executor) {
        this.executor.stop();
      }
      this.state.isRunning = false;
      this.ui.syncButtonState(this.state);
    }
clear() {
      this.ui.clear();
      this.ui.clearLog();
      this.state.langPairs = [];
      this.ui.setStatus(t$2("statusReady"));
      this.ui.syncButtonState(this.state);
      PriceListCreatorExecutor.clearSession();
    }
log(message, type = "") {
      this.ui.addLog(message, type);
      if (console && typeof console.log === "function") {
        const prefix = "[PriceListCreator]";
        if (type === "error") {
          console.error(prefix, message);
        } else if (type === "warn") {
          console.warn(prefix, message);
        } else {
          console.log(prefix, message);
        }
      }
    }
  }
  function init() {
    if (window.self !== window.top) return;
    if (document.getElementById(`${SCRIPT_ID$2}-panel`)) return;
    const tool = new PriceListCreatorTool();
    tool.init();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  const SCRIPT_VERSION$1 = "1.0.0";
  const SCRIPT_ID$1 = "plunet-lang-pair-rate";
  const LANG_LABEL_MAP = {
    "EN": "English",
    "ZH-TW": "Chinese (Traditional, Taiwan)",
    "ZH-CN": "Chinese (Simplified, China)",
    "JA": "Japanese",
    "KO": "Korean",
    "DE": "German",
    "FR": "French",
    "ES": "Spanish",
    "IT": "Italian",
    "PT": "Portuguese",
    "RU": "Russian",
    "AR": "Arabic",
    "NL": "Dutch",
    "PL": "Polish",
    "TR": "Turkish",
    "VI": "Vietnamese",
    "TH": "Thai",
    "ID": "Indonesian",
    "MS": "Malay"
  };
  const I18N$1 = {
    en: {
      scriptName: "Language Pair Rate Tool",
      versionLabel: "v{version}",
inputModeLabel: "Input Mode",
      inputModeManual: "Manual Input",
      inputModeCsv: "CSV Import",
manualInputLabel: "Language Pairs & Rates",
      manualInputPlaceholder: "English,German,0.10\nEnglish,French,0.12\nEnglish,Spanish,0.08",
      manualInputHelp: "Use full language names from Plunet system",
csvInputLabel: "CSV File",
      csvInputHelp: "Required columns: srcLang, tgtLang, rate",
      csvPreviewLabel: "Preview",
      csvRowCount: "{count} rows loaded",
addPairsBtn: "Add Language Pairs",
      setRatesBtn: "Set Rates",
      runAllBtn: "Run All",
      stopBtn: "Stop",
      clearBtn: "Clear",
allLanguagesLabel: "All Languages Mode",
      allLanguagesHelp: 'Check "All languages" instead of adding specific pairs',
statusReady: "Ready",
      statusNoData: "No data to process",
      statusAdding: "Adding language pairs...",
      statusAddingPair: "Adding: {src} -> {tgt}",
      statusSettingRates: "Setting rates...",
      statusSettingRate: "Setting rate [{current}/{total}]: {pair}",
      statusCompleted: "Completed ({total} items)",
      statusStopped: "Stopped at {current}/{total}",
      statusError: "Error: {message}"
    },
    zh: {
      scriptName: "语言对费率工具",
      versionLabel: "v{version}",
inputModeLabel: "输入方式",
      inputModeManual: "手动输入",
      inputModeCsv: "CSV 导入",
manualInputLabel: "语言对和费率",
      manualInputPlaceholder: "English,German,0.10\nEnglish,French,0.12\nEnglish,Spanish,0.08",
      manualInputHelp: "使用 Plunet 系统中的完整语言名称",
csvInputLabel: "CSV 文件",
      csvInputHelp: "必需列: srcLang, tgtLang, rate",
      csvPreviewLabel: "预览",
      csvRowCount: "已加载 {count} 行",
addPairsBtn: "添加语言对",
      setRatesBtn: "设置费率",
      runAllBtn: "全部执行",
      stopBtn: "停止",
      clearBtn: "清空",
allLanguagesLabel: "所有语言模式",
      allLanguagesHelp: '勾选"所有语言"而非添加特定语言对',
statusReady: "就绪",
      statusNoData: "没有数据可处理",
      statusAdding: "正在添加语言对...",
      statusAddingPair: "添加中: {src} -> {tgt}",
      statusSettingRates: "正在设置费率...",
      statusSettingRate: "设置费率 [{current}/{total}]: {pair}",
      statusCompleted: "完成 ({total} 项)",
      statusStopped: "已停止 {current}/{total}",
      statusError: "错误: {message}"
    }
  };
  const DEFAULT_LOCALE$1 = "en";
  function t$1(key, vars = null) {
    const rawLocale = (navigator.language || DEFAULT_LOCALE$1).toLowerCase();
    const baseLocale = rawLocale.split("-")[0];
    const template = I18N$1[rawLocale]?.[key] || I18N$1[baseLocale]?.[key] || I18N$1[DEFAULT_LOCALE$1]?.[key] || key;
    if (!vars || typeof vars !== "object") return template;
    return template.replace(/\{(\w+)\}/g, (_, token) => {
      if (Object.prototype.hasOwnProperty.call(vars, token)) {
        return String(vars[token]);
      }
      return "";
    });
  }
  function langLabel(code) {
    const c = String(code || "").trim().toUpperCase();
    return LANG_LABEL_MAP[c] || code;
  }
  const LOG_LEVELS = {
    debug: { prefix: "DEBUG", color: "#888" },
    info: { prefix: "INFO", color: "#333" },
    warn: { prefix: "WARN", color: "#b86800" },
    error: { prefix: "ERROR", color: "#c00" },
    success: { prefix: "OK", color: "#2e7d32" }
  };
  function formatTimestamp(date = new Date()) {
    return `[${date.toLocaleTimeString()}]`;
  }
  function formatLogEntry(message, options = {}) {
    const { withTimestamp = true, level, moduleId } = options;
    const parts = [];
    if (withTimestamp) {
      parts.push(formatTimestamp());
    }
    if (moduleId) {
      parts.push(`[${moduleId}]`);
    }
    if (level && LOG_LEVELS[level]) {
      parts.push(`${LOG_LEVELS[level].prefix}:`);
    }
    parts.push(message);
    return parts.join(" ");
  }
  function createLogger(config = {}) {
    const {
      moduleId,
      withTimestamp = true,
      getLogBox,
      storage,
      autoScroll = true,
      onLog
    } = config;
    let buffer = [];
    let isBuffering = true;
    function appendToLogBox(text) {
      const logBox = getLogBox?.();
      if (!logBox) {
        buffer.push(text);
        return;
      }
      if (isBuffering && buffer.length > 0) {
        logBox.textContent += buffer.join("\n") + "\n";
        buffer = [];
        isBuffering = false;
      }
      logBox.textContent += text + "\n";
      if (autoScroll) {
        logBox.scrollTop = logBox.scrollHeight;
      }
      if (storage?.save) {
        storage.save(logBox.textContent);
      }
    }
    function log(message, level) {
      const formatted = formatLogEntry(message, {
        withTimestamp,
        level,
        moduleId
      });
      appendToLogBox(formatted);
      if (onLog) {
        onLog({ message, level, formatted, timestamp: new Date() });
      }
    }
    function logIndent(message, indent = 2) {
      const prefix = " ".repeat(indent);
      appendToLogBox(`${prefix}${message}`);
    }
    function clear() {
      buffer = [];
      const logBox = getLogBox?.();
      if (logBox) {
        logBox.textContent = "";
      }
      if (storage?.clear) {
        storage.clear();
      }
    }
    function getContent() {
      const logBox = getLogBox?.();
      return logBox?.textContent || buffer.join("\n");
    }
    function restore(content) {
      if (!content) return;
      const logBox = getLogBox?.();
      if (logBox) {
        logBox.textContent = content;
        if (autoScroll) {
          logBox.scrollTop = logBox.scrollHeight;
        }
      } else {
        buffer = content.split("\n");
      }
    }
    async function copyToClipboard() {
      const content = getContent();
      if (!content) return false;
      try {
        await navigator.clipboard.writeText(content);
        return true;
      } catch {
        return false;
      }
    }
    function download(filename) {
      const content = getContent();
      if (!content) return;
      const name = filename || `${moduleId || "module"}-log-${Date.now()}.txt`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    }
    return {
log: (msg) => log(msg),
      debug: (msg) => log(msg, "debug"),
      info: (msg) => log(msg, "info"),
      warn: (msg) => log(msg, "warn"),
      error: (msg) => log(msg, "error"),
      success: (msg) => log(msg, "success"),
      indent: logIndent,
clear,
      getContent,
      restore,
      copyToClipboard,
      download,
appender: (msg) => log(msg)
    };
  }
  function createSessionStorageAdapter(key) {
    return {
      save: (text) => {
        try {
          sessionStorage.setItem(key, text);
        } catch {
        }
      },
      load: () => {
        try {
          return sessionStorage.getItem(key) || "";
        } catch {
          return "";
        }
      },
      clear: () => {
        try {
          sessionStorage.removeItem(key);
        } catch {
        }
      }
    };
  }
  function createLogSection(config = {}) {
    const {
      id,
      prefix = "pa",
      open = true,
      title = "Log",
      showCopy = true,
      showClear = true,
      showDownload = false,
      storageKey,
      moduleId,
      maxHeight = 200
    } = config;
    const storage = storageKey ? createSessionStorageAdapter(storageKey) : null;
    const container = document.createElement("details");
    container.id = id ? `${id}-log-details` : void 0;
    container.className = `${prefix}-log-details`;
    if (open) container.open = true;
    const summary = document.createElement("summary");
    summary.className = `${prefix}-log-summary`;
    summary.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 6px 0;
    font-size: 11px;
    font-weight: 600;
    color: var(--${prefix}-ink, #333);
    user-select: none;
  `;
    const titleEl = document.createElement("span");
    titleEl.textContent = title;
    const actions = document.createElement("div");
    actions.className = `${prefix}-log-actions`;
    actions.style.cssText = "display: flex; gap: 4px;";
    const logBox = document.createElement("pre");
    logBox.id = id ? `${id}-log` : void 0;
    logBox.className = `${prefix}-log-box`;
    logBox.style.cssText = `
    margin: 0;
    padding: 8px;
    background: var(--${prefix}-surface, #f8f9fa);
    border: 1px solid var(--${prefix}-border, #dee2e6);
    border-radius: var(--${prefix}-radius-sm, 6px);
    font-family: 'SF Mono', 'Consolas', monospace;
    font-size: 10px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-all;
    overflow-y: auto;
    max-height: ${maxHeight}px;
    color: var(--${prefix}-ink, #333);
  `;
    const logger = createLogger({
      moduleId,
      getLogBox: () => logBox,
      storage,
      autoScroll: true
    });
    let copyBtn = null;
    if (showCopy) {
      copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = `${prefix}-btn ${prefix}-btn-sm ${prefix}-btn-ghost`;
      copyBtn.textContent = "Copy";
      copyBtn.style.cssText = `
      padding: 2px 8px;
      font-size: 10px;
      border-radius: 4px;
    `;
      copyBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const success = await logger.copyToClipboard();
        if (success) {
          const orig = copyBtn.textContent;
          copyBtn.textContent = "Copied!";
          setTimeout(() => {
            copyBtn.textContent = orig;
          }, 1500);
        }
      });
      actions.appendChild(copyBtn);
    }
    let clearBtn = null;
    if (showClear) {
      clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = `${prefix}-btn ${prefix}-btn-sm ${prefix}-btn-ghost`;
      clearBtn.textContent = "Clear";
      clearBtn.style.cssText = `
      padding: 2px 8px;
      font-size: 10px;
      border-radius: 4px;
    `;
      clearBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        logger.clear();
      });
      actions.appendChild(clearBtn);
    }
    let downloadBtn = null;
    if (showDownload) {
      downloadBtn = document.createElement("button");
      downloadBtn.type = "button";
      downloadBtn.className = `${prefix}-btn ${prefix}-btn-sm ${prefix}-btn-ghost`;
      downloadBtn.textContent = "Download";
      downloadBtn.style.cssText = `
      padding: 2px 8px;
      font-size: 10px;
      border-radius: 4px;
    `;
      downloadBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        logger.download();
      });
      actions.appendChild(downloadBtn);
    }
    summary.appendChild(titleEl);
    summary.appendChild(actions);
    container.appendChild(summary);
    container.appendChild(logBox);
    if (storage) {
      const saved = storage.load();
      if (saved) {
        logger.restore(saved);
      }
    }
    return {
      container,
      logBox,
      logger,
log: logger.log,
      info: logger.info,
      warn: logger.warn,
      error: logger.error,
      success: logger.success,
      indent: logger.indent,
      clear: logger.clear,
      getContent: logger.getContent,
      restore: logger.restore,
toggle: () => {
        container.open = !container.open;
      },
      expand: () => {
        container.open = true;
      },
      collapse: () => {
        container.open = false;
      }
    };
  }
  function createModulePanel(config) {
    const {
      id,
      title,
      version,
      prefix = "pa",
      accentColor,
      width = "340px",
      position = { top: "60px", right: "50px" },
      hasLog = true,
      logOpen = true,
      onClose,
      onMinimize
    } = config;
    injectTheme();
    const panel = document.createElement("div");
    panel.id = `${id}-panel`;
    panel.className = `pa-panel ${prefix}-panel`;
    panel.style.cssText = `
    position: fixed;
    ${position.top ? `top: ${position.top};` : ""}
    ${position.right ? `right: ${position.right};` : ""}
    ${position.bottom ? `bottom: ${position.bottom};` : ""}
    ${position.left ? `left: ${position.left};` : ""}
    width: min(${width}, calc(100vw - 24px));
    z-index: 999999;
    display: none;
    ${accentColor ? `--pa-accent: ${accentColor};` : ""}
    ${THEME_VARIABLES}
  `;
    const header = document.createElement("div");
    header.id = `${id}-panel-header`;
    header.className = `pa-header ${prefix}-header`;
    const titleWrap = document.createElement("div");
    titleWrap.className = "pa-header-title";
    const titleText = document.createElement("span");
    titleText.className = "pa-header-title-text";
    titleText.textContent = title;
    const versionText = document.createElement("span");
    versionText.className = "pa-header-version";
    versionText.textContent = version;
    titleWrap.appendChild(titleText);
    titleWrap.appendChild(versionText);
    const headerActions = document.createElement("div");
    headerActions.className = "pa-header-actions";
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "pa-btn-icon";
    closeBtn.innerHTML = "&times;";
    closeBtn.title = "Close";
    closeBtn.addEventListener("click", () => {
      hide();
      if (onClose) onClose();
    });
    headerActions.appendChild(closeBtn);
    header.appendChild(titleWrap);
    header.appendChild(headerActions);
    const body = document.createElement("div");
    body.className = `pa-body ${prefix}-body`;
    body.style.cssText = `
    max-height: 70vh;
    overflow-y: auto;
  `;
    const statusSection = document.createElement("div");
    statusSection.className = "pa-section";
    const statusEl = document.createElement("div");
    statusEl.id = `${id}-status`;
    statusEl.className = `pa-status ${prefix}-status`;
    statusEl.textContent = "Ready";
    statusSection.appendChild(statusEl);
    const actionsEl = document.createElement("div");
    actionsEl.id = `${id}-actions`;
    actionsEl.className = `pa-controls ${prefix}-actions`;
    let logSection = null;
    let logBox = null;
    let logDetails = null;
    if (hasLog) {
      logSection = createLogSection({
        id: `${id}-log`,
        prefix,
        open: logOpen,
        title: "Log",
        showCopy: true,
        showClear: true,
        showDownload: false,
        moduleId: id
      });
      logDetails = logSection.container;
      logBox = logSection.logBox;
    }
    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);
    makeDraggable(panel, header, {
      ignoreSelector: "button, .pa-header-actions"
    });
    function show() {
      panel.style.display = "block";
    }
    function hide() {
      panel.style.display = "none";
    }
    function destroy() {
      panel.remove();
    }
    function setStatus(message, variant = "") {
      statusEl.textContent = message;
      statusEl.className = `pa-status ${prefix}-status`;
      if (variant) {
        statusEl.classList.add(`pa-status-${variant}`);
      }
    }
    function log(message) {
      if (!logSection) return;
      logSection.log(message);
    }
    function clearLog() {
      if (logSection) {
        logSection.clear();
      }
    }
    function addSection({ title: sectionTitle, id: sectionId, content } = {}) {
      const section = document.createElement("div");
      section.className = `pa-section ${prefix}-section`;
      if (sectionId) section.id = sectionId;
      if (sectionTitle) {
        const titleEl = document.createElement("label");
        titleEl.className = `pa-label ${prefix}-label`;
        titleEl.textContent = sectionTitle;
        section.appendChild(titleEl);
      }
      if (content) {
        if (typeof content === "string") {
          section.insertAdjacentHTML("beforeend", content);
        } else {
          section.appendChild(content);
        }
      }
      body.insertBefore(section, statusSection);
      return section;
    }
    function addActions(buttons) {
      actionsEl.innerHTML = "";
      buttons.forEach((btn) => {
        const button = document.createElement("button");
        button.type = "button";
        button.id = btn.id || "";
        button.className = `pa-btn ${prefix}-btn pa-btn-${btn.variant || "primary"}`;
        button.textContent = btn.label;
        button.disabled = btn.disabled || false;
        if (btn.style) {
          Object.assign(button.style, btn.style);
        }
        if (btn.onClick) {
          button.addEventListener("click", btn.onClick);
        }
        actionsEl.appendChild(button);
      });
      return actionsEl;
    }
    function getButton(btnId) {
      return actionsEl.querySelector(`#${btnId}`);
    }
    function setButtonStates(states) {
      Object.entries(states).forEach(([btnId, disabled]) => {
        const btn = getButton(btnId);
        if (btn) btn.disabled = disabled;
      });
    }
    function setElementStates(states) {
      Object.entries(states).forEach(([elId, disabled]) => {
        const el = panel.querySelector(`#${elId}`);
        if (el) el.disabled = disabled;
      });
    }
    function setDisabled(selector, disabled) {
      panel.querySelectorAll(selector).forEach((el) => {
        el.disabled = disabled;
      });
    }
    body.appendChild(statusSection);
    body.appendChild(actionsEl);
    if (logDetails) {
      body.appendChild(logDetails);
    }
    return {
      panel,
      header,
      body,
      headerActions,
      statusEl,
      logBox,
      actionsEl,
      logDetails,
      logSection,

show,
      hide,
      destroy,
      setStatus,
      log,
      clearLog,
      addSection,
      addActions,
      getButton,
      setButtonStates,
      setElementStates,
      setDisabled
    };
  }
  const MODULE_SPECIFIC_STYLES$1 = `
/* Language Pair Rate uses blue accent */
#${SCRIPT_ID$1}-panel {
  --pa-accent: #0b6aa6;
  --pa-accent-strong: #085a8c;
  --pa-accent-light: rgba(11, 106, 166, 0.12);
}

.lpr-input-mode-section {
  margin-bottom: 8px;
}

.lpr-mode-options {
  display: flex;
  gap: 16px;
}

.lpr-mode-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.lpr-manual-section,
.lpr-csv-section {
  transition: opacity 0.2s, max-height 0.3s;
}

.lpr-section-hidden {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  margin: 0 !important;
  padding: 0 !important;
}

.lpr-preview-table {
  width: 100%;
  font-size: 10px;
  border-collapse: collapse;
  margin-top: 8px;
}

.lpr-preview-table th,
.lpr-preview-table td {
  padding: 4px 6px;
  border: 1px solid var(--pa-border);
  text-align: left;
}

.lpr-preview-table th {
  background: var(--pa-accent-light);
  font-weight: 600;
}

.lpr-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.lpr-actions-grid .full-width {
  grid-column: span 2;
}

.lpr-option-section {
  padding: 8px 0;
}

.lpr-option-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.lpr-help-text {
  margin-top: 4px;
  font-size: 10px;
  color: var(--pa-muted);
}
`;
  let stylesInjected$1 = false;
  function injectStyles$1() {
    if (stylesInjected$1) return;
    injectTheme();
    const styleId = `${SCRIPT_ID$1}-style`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = MODULE_SPECIFIC_STYLES$1;
      document.head.appendChild(style);
    }
    stylesInjected$1 = true;
  }
  function createLangPairRatePanel(callbacks = {}) {
    injectStyles$1();
    const panel = createModulePanel({
      id: SCRIPT_ID$1,
      title: t$1("scriptName"),
      version: t$1("versionLabel", { version: SCRIPT_VERSION$1 }),
      prefix: "lpr",
      width: "380px",
      position: { top: "60px", right: "50px" },
      hasLog: true,
      logOpen: false,
      onClose: callbacks.onClose
    });
    panel.addSection({
      id: "lpr-input-mode",
      title: t$1("inputModeLabel"),
      content: `
      <div class="lpr-input-mode-section">
        <div class="lpr-mode-options">
          <label class="lpr-mode-option">
            <input type="radio" name="lpr-input-mode" value="manual" checked class="pa-checkbox">
            <span>${t$1("inputModeManual")}</span>
          </label>
          <label class="lpr-mode-option">
            <input type="radio" name="lpr-input-mode" value="csv" class="pa-checkbox">
            <span>${t$1("inputModeCsv")}</span>
          </label>
        </div>
      </div>
    `
    });
    const manualSection = panel.addSection({
      id: "lpr-manual-section",
      title: t$1("manualInputLabel"),
      content: `
      <textarea
        class="pa-textarea"
        id="lpr-manual-input"
        placeholder="${t$1("manualInputPlaceholder")}"
        style="width:100%;min-height:100px;font-family:var(--pa-font-mono);"
      ></textarea>
      <div class="lpr-help-text">${t$1("manualInputHelp")}</div>
    `
    });
    manualSection.classList.add("lpr-manual-section");
    const csvSection = panel.addSection({
      id: "lpr-csv-section",
      title: t$1("csvInputLabel"),
      content: `
      <input type="file" id="lpr-csv-file" accept=".csv,.txt" class="pa-input" style="width:100%;">
      <div class="lpr-help-text">${t$1("csvInputHelp")}</div>
      <div id="lpr-csv-preview"></div>
    `
    });
    csvSection.classList.add("lpr-csv-section", "lpr-section-hidden");
    panel.addSection({
      id: "lpr-options",
      content: `
      <div class="lpr-option-section">
        <label class="lpr-option-label">
          <input type="checkbox" id="lpr-all-languages" class="pa-checkbox">
          <span>${t$1("allLanguagesLabel")}</span>
        </label>
        <div class="lpr-help-text">${t$1("allLanguagesHelp")}</div>
      </div>
    `
    });
    panel.addSection({
      id: "lpr-actions",
      content: `
      <div class="lpr-actions-grid">
        <button type="button" class="pa-btn pa-btn-primary" id="lpr-add-pairs">${t$1("addPairsBtn")}</button>
        <button type="button" class="pa-btn pa-btn-secondary" id="lpr-set-rates">${t$1("setRatesBtn")}</button>
        <button type="button" class="pa-btn pa-btn-accent full-width" id="lpr-run-all">${t$1("runAllBtn")}</button>
        <button type="button" class="pa-btn pa-btn-danger" id="lpr-stop" disabled>${t$1("stopBtn")}</button>
        <button type="button" class="pa-btn pa-btn-ghost" id="lpr-clear">${t$1("clearBtn")}</button>
      </div>
    `
    });
    const getEl = (sel) => panel.panel.querySelector(sel);
    const elements = {
      manualInput: getEl("#lpr-manual-input"),
      csvFile: getEl("#lpr-csv-file"),
      csvPreview: getEl("#lpr-csv-preview"),
      allLanguagesCheckbox: getEl("#lpr-all-languages"),
      addPairsBtn: getEl("#lpr-add-pairs"),
      setRatesBtn: getEl("#lpr-set-rates"),
      runAllBtn: getEl("#lpr-run-all"),
      stopBtn: getEl("#lpr-stop"),
      clearBtn: getEl("#lpr-clear"),
      manualSectionEl: getEl("#lpr-manual-section"),
      csvSectionEl: getEl("#lpr-csv-section")
    };
    const modeRadios = panel.panel.querySelectorAll('input[name="lpr-input-mode"]');
    modeRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        const isManual = radio.value === "manual";
        elements.manualSectionEl.classList.toggle("lpr-section-hidden", !isManual);
        elements.csvSectionEl.classList.toggle("lpr-section-hidden", isManual);
        callbacks.onModeChange?.(radio.value);
      });
    });
    if (callbacks.onAddPairs) elements.addPairsBtn.addEventListener("click", callbacks.onAddPairs);
    if (callbacks.onSetRates) elements.setRatesBtn.addEventListener("click", callbacks.onSetRates);
    if (callbacks.onRunAll) elements.runAllBtn.addEventListener("click", callbacks.onRunAll);
    if (callbacks.onStop) elements.stopBtn.addEventListener("click", callbacks.onStop);
    if (callbacks.onClear) elements.clearBtn.addEventListener("click", callbacks.onClear);
    if (callbacks.onCsvLoad) elements.csvFile.addEventListener("change", callbacks.onCsvLoad);
    return {
      ...panel,
      ...elements,
getInputMode: () => {
        const checked = panel.panel.querySelector('input[name="lpr-input-mode"]:checked');
        return checked?.value || "manual";
      },
isAllLanguagesMode: () => elements.allLanguagesCheckbox.checked,
showCsvPreview: (pairs, errorCount = 0) => {
        if (pairs.length === 0) {
          elements.csvPreview.innerHTML = "";
          return;
        }
        const preview = pairs.slice(0, 5);
        const html = `
        <div style="font-size:11px;color:var(--pa-muted);margin-bottom:4px;">
          ${t$1("csvRowCount", { count: pairs.length })}${errorCount > 0 ? ` (${errorCount} errors)` : ""}
        </div>
        <table class="lpr-preview-table">
          <thead><tr><th>srcLang</th><th>tgtLang</th><th>rate</th></tr></thead>
          <tbody>
            ${preview.map((p) => `<tr><td>${p.srcLang}</td><td>${p.tgtLang}</td><td>${p.rate}</td></tr>`).join("")}
            ${pairs.length > 5 ? `<tr><td colspan="3" style="text-align:center;color:var(--pa-muted);">... ${pairs.length - 5} more</td></tr>` : ""}
          </tbody>
        </table>
      `;
        elements.csvPreview.innerHTML = html;
      },
syncButtonState: (state) => {
        const { isRunning, pairs } = state;
        const hasPairs = pairs && pairs.length > 0;
        elements.addPairsBtn.disabled = isRunning || !hasPairs;
        elements.setRatesBtn.disabled = isRunning || !hasPairs;
        elements.runAllBtn.disabled = isRunning || !hasPairs;
        elements.stopBtn.disabled = !isRunning;
        elements.clearBtn.disabled = isRunning;
        elements.manualInput.disabled = isRunning;
        elements.csvFile.disabled = isRunning;
        elements.allLanguagesCheckbox.disabled = isRunning;
      }
    };
  }
  class LangPairRateTool {
    constructor() {
      this.ui = null;
      this.state = {
        pairs: [],
        isRunning: false,
        currentIndex: 0,
        inputMode: "manual"
      };
      this.init();
    }
    init() {
      if (window.self !== window.top) return;
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.createUI());
      } else {
        this.createUI();
      }
    }
    createUI() {
      if (document.getElementById(`${SCRIPT_ID$1}-panel`)) return;
      this.ui = createLangPairRatePanel({
        onAddPairs: () => this.addLanguagePairs(),
        onSetRates: () => this.setRates(),
        onRunAll: () => this.runAll(),
        onStop: () => this.stop(),
        onClear: () => this.clear(),
        onModeChange: (mode) => this.onModeChange(mode),
        onCsvLoad: (e) => this.onCsvLoad(e),
        onClose: () => {
        }
      });
      this.ui.manualInput.addEventListener("input", () => {
        if (this.state.isRunning) return;
        this.parseCurrentInput();
      });
      this.ui.setStatus(t$1("statusReady"));
      this.ui.syncButtonState(this.state);
    }
log(msg) {
      this.ui?.log?.(msg);
      {
        console.log(`[${SCRIPT_ID$1}] ${msg}`);
      }
    }
parseCurrentInput() {
      const mode = this.ui.getInputMode();
      if (mode === "manual") {
        const text = this.ui.manualInput.value;
        const { pairs, errors } = parseManualInput(text);
        this.state.pairs = pairs;
        if (errors.length > 0) {
          errors.forEach((e) => this.log(`WARN: ${e}`));
        }
      }
      this.ui.syncButtonState(this.state);
      if (this.state.pairs.length === 0) {
        this.ui.setStatus(t$1("statusNoData"));
      } else {
        this.ui.setStatus(t$1("statusReady"));
      }
    }
onModeChange(mode) {
      this.state.inputMode = mode;
      this.state.pairs = [];
      this.ui.syncButtonState(this.state);
      this.ui.setStatus(t$1("statusReady"));
    }
onCsvLoad(event) {
      const file = event.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (!text) return;
        const { pairs, errors } = parseLangPairCsv(text);
        this.state.pairs = pairs;
        this.ui.showCsvPreview(pairs, errors.length);
        if (errors.length > 0) {
          errors.slice(0, 5).forEach((e2) => this.log(`WARN: ${e2}`));
          if (errors.length > 5) {
            this.log(`WARN: ... and ${errors.length - 5} more errors`);
          }
        }
        this.ui.syncButtonState(this.state);
        this.log(`Loaded ${pairs.length} language pairs from CSV`);
      };
      reader.readAsText(file);
    }
stop() {
      if (!this.state.isRunning) return;
      this.state.isRunning = false;
      this.log("Stop requested");
      this.ui.syncButtonState(this.state);
    }
clear() {
      this.state.pairs = [];
      this.state.currentIndex = 0;
      this.ui.manualInput.value = "";
      this.ui.csvFile.value = "";
      this.ui.showCsvPreview([]);
      this.ui.clearLog?.();
      this.ui.setStatus(t$1("statusReady"));
      this.ui.syncButtonState(this.state);
    }
async addLanguagePairs() {
      if (this.state.isRunning) return;
      this.parseCurrentInput();
      if (this.ui.isAllLanguagesMode()) {
        this.state.isRunning = true;
        this.ui.syncButtonState(this.state);
        try {
          this.log("All languages mode enabled");
          this.ui.setStatus(t$1("statusAdding"));
          const success = await checkAllLanguagesCheckbox(this.log.bind(this));
          if (success) {
            this.ui.setStatus(t$1("statusCompleted", { total: 1 }), "success");
          } else {
            this.ui.setStatus(t$1("statusError", { message: 'Failed to check "All languages"' }));
          }
        } catch (err) {
          this.log(`ERROR: ${err.message}`);
          this.ui.setStatus(t$1("statusError", { message: err.message }));
        }
        this.state.isRunning = false;
        this.ui.syncButtonState(this.state);
        return;
      }
      if (this.state.pairs.length === 0) {
        this.ui.setStatus(t$1("statusNoData"));
        return;
      }
      this.state.isRunning = true;
      this.ui.syncButtonState(this.state);
      try {
        this.ui.setStatus(t$1("statusAdding"));
        const pairs = this.state.pairs.map((p) => ({
          srcLang: p.srcLang,
          tgtLang: p.tgtLang
        }));
        await addLanguagePairsBatch(pairs, this.log.bind(this));
        this.ui.setStatus(t$1("statusCompleted", { total: this.state.pairs.length }), "success");
      } catch (err) {
        this.log(`ERROR: ${err.message}`);
        this.ui.setStatus(t$1("statusError", { message: err.message }));
      }
      this.state.isRunning = false;
      this.ui.syncButtonState(this.state);
    }
async setRates() {
      if (this.state.isRunning) return;
      this.parseCurrentInput();
      if (this.state.pairs.length === 0) {
        this.ui.setStatus(t$1("statusNoData"));
        return;
      }
      this.state.isRunning = true;
      this.state.currentIndex = 0;
      this.ui.syncButtonState(this.state);
      try {
        this.ui.setStatus(t$1("statusSettingRates"));
        for (let i = 0; i < this.state.pairs.length; i++) {
          if (!this.state.isRunning) break;
          const pair = this.state.pairs[i];
          this.state.currentIndex = i + 1;
          const pairLabel = `${langLabel(pair.srcLang)} > ${langLabel(pair.tgtLang)}`;
          this.ui.setStatus(t$1("statusSettingRate", {
            current: i + 1,
            total: this.state.pairs.length,
            pair: pairLabel
          }));
          this.log(`Setting rate [${i + 1}/${this.state.pairs.length}]: ${pairLabel} = ${pair.rate}`);
          await setLanguagePairRate(pair, this.log.bind(this));
          await sleep$2(300);
        }
        if (this.state.isRunning) {
          this.ui.setStatus(t$1("statusCompleted", { total: this.state.pairs.length }), "success");
        } else {
          this.ui.setStatus(t$1("statusStopped", {
            current: this.state.currentIndex,
            total: this.state.pairs.length
          }));
        }
      } catch (err) {
        this.log(`ERROR: ${err.message}`);
        this.ui.setStatus(t$1("statusError", { message: err.message }));
      }
      this.state.isRunning = false;
      this.ui.syncButtonState(this.state);
    }
async runAll() {
      if (this.state.isRunning) return;
      await this.addLanguagePairs();
      if (!this.state.isRunning && this.state.pairs.length > 0 && !this.ui.isAllLanguagesMode()) {
        await sleep$2(1e3);
        await this.setRates();
      }
    }
  }
  new LangPairRateTool();
  const SCRIPT_VERSION = "1.2.0";
  const SCRIPT_ID = "plunet-price-unit-batch-add";
  const CONFIG = {
    DEBUG: true,
    WAIT_AFTER_CLICK: 500,
    WAIT_AFTER_INPUT: 600,
    WAIT_AFTER_SELECT: 1100,
    WAIT_FOR_DROPDOWN: 1e4,
    WAIT_FOR_ELEMENT: 15e3
  };
  const WEIGHTED_SUFFIXES = [
    "Repetitions",
    "101% Match",
    "100% Match",
    "95-99% Match",
    "85-94% Match",
    "75-84% Match",
    "50-74% Match"
  ];
  const FUZZY_INTERVALS = [
    { id: "reps", label: "Repetitions", suffix: "Repetitions", defaultValue: 15 },
    { id: "101", label: "101% Match", suffix: "101% Match", defaultValue: 0 },
    { id: "100", label: "100% Match", suffix: "100% Match", defaultValue: 15 },
    { id: "95-99", label: "95-99% Match", suffix: "95-99% Match", defaultValue: 25 },
    { id: "85-94", label: "85-94% Match", suffix: "85-94% Match", defaultValue: 40 },
    { id: "75-84", label: "75-84% Match", suffix: "75-84% Match", defaultValue: 50 },
    { id: "50-74", label: "50-74% Match", suffix: "50-74% Match", defaultValue: 100 },
    { id: "new-discount", label: "New Discount", suffix: "New Discount", defaultValue: 90 }
  ];
  const PRICE_UNITS = {
"Words TRA New": 62,
    "Words TRA Repetitions": 52,
    "Words TRA 101% Match": 61,
    "Words TRA 100% Match": 51,
    "Words TRA 95-99% Match": 60,
    "Words TRA 85-94% Match": 59,
    "Words TRA 75-84% Match": 58,
    "Words TRA 50-74% Match": 57,
"Words REV New": 70,
    "Words REV Repetitions": 132,
    "Words REV 101% Match": 131,
    "Words REV 100% Match": 130,
    "Words REV 95-99% Match": 129,
    "Words REV 85-94% Match": 128,
    "Words REV 75-84% Match": 127,
    "Words REV 50-74% Match": 126,
"Words TEP New": 69,
    "Words TEP Repetitions": 125,
    "Words TEP 101% Match": 124,
    "Words TEP 100% Match": 123,
    "Words TEP 95-99% Match": 122,
    "Words TEP 85-94% Match": 121,
    "Words TEP 75-84% Match": 120,
    "Words TEP 50-74% Match": 119,
"Words TED New": 68,
    "Words TED Repetitions": 118,
    "Words TED 101% Match": 117,
    "Words TED 100% Match": 116,
    "Words TED 95-99% Match": 115,
    "Words TED 85-94% Match": 114,
    "Words TED 75-84% Match": 113,
    "Words TED 50-74% Match": 112,
"Words EDT New": 67,
    "Words EDT Repetitions": 111,
    "Words EDT 101% Match": 110,
    "Words EDT 100% Match": 109,
    "Words EDT 95-99% Match": 108,
    "Words EDT 85-94% Match": 107,
    "Words EDT 75-84% Match": 106,
    "Words EDT 50-74% Match": 105,
"Words PRF New": 71,
    "Words PRF Repetitions": 139,
    "Words PRF 101% Match": 138,
    "Words PRF 100% Match": 137,
    "Words PRF 95-99% Match": 136,
    "Words PRF 85-94% Match": 135,
    "Words PRF 75-84% Match": 134,
    "Words PRF 50-74% Match": 133,
"Words LPE New": 145,
    "Words LPE Repetitions": 152,
    "Words LPE 101% Match": 151,
    "Words LPE 100% Match": 150,
    "Words LPE 95-99% Match": 149,
    "Words LPE 85-94% Match": 148,
    "Words LPE 75-84% Match": 147,
    "Words LPE 50-74% Match": 146,
"Words FPE New": 153,
    "Words FPE Repetitions": 160,
    "Words FPE 101% Match": 159,
    "Words FPE 100% Match": 158,
    "Words FPE 95-99% Match": 157,
    "Words FPE 85-94% Match": 156,
    "Words FPE 75-84% Match": 155,
    "Words FPE 50-74% Match": 154,
"Words LQA New": 161,
    "Words LQA Repetitions": 168,
    "Words LQA 101% Match": 167,
    "Words LQA 100% Match": 166,
    "Words LQA 95-99% Match": 165,
    "Words LQA 85-94% Match": 164,
    "Words LQA 75-84% Match": 163,
    "Words LQA 50-74% Match": 162,
"Words LLD New": 73,
    "Words LLD Repetitions": 104,
    "Words LLD 101% Match": 103,
    "Words LLD 100% Match": 102,
    "Words LLD 95-99% Match": 101,
    "Words LLD 85-94% Match": 100,
    "Words LLD 75-84% Match": 99,
    "Words LLD 50-74% Match": 98,
"Words ADP New": 72,
    "Words ADP Repetitions": 97,
    "Words ADP 101% Match": 96,
    "Words ADP 100% Match": 95,
    "Words ADP 95-99% Match": 94,
    "Words ADP 85-94% Match": 93,
    "Words ADP 75-84% Match": 92,
    "Words ADP 50-74% Match": 91,
"Words TCR New": 140,
    "Words TCR Repetitions": 256,
    "Words TCR 101% Match": 255,
    "Words TCR 100% Match": 254,
    "Words TCR 95-99% Match": 253,
    "Words TCR 85-94% Match": 252,
    "Words TCR 75-84% Match": 251,
    "Words TCR 50-74% Match": 250,
"Words CPA New": 141,
    "Words CPA Repetitions": 263,
    "Words CPA 101% Match": 262,
    "Words CPA 100% Match": 261,
    "Words CPA 95-99% Match": 260,
    "Words CPA 85-94% Match": 259,
    "Words CPA 75-84% Match": 258,
    "Words CPA 50-74% Match": 257,
"Words CPW New": 142,
    "Words CPW Repetitions": 270,
    "Words CPW 101% Match": 269,
    "Words CPW 100% Match": 268,
    "Words CPW 95-99% Match": 267,
    "Words CPW 85-94% Match": 266,
    "Words CPW 75-84% Match": 265,
    "Words CPW 50-74% Match": 264,
"Words GSP New": 143,
    "Words GSP Repetitions": 277,
    "Words GSP 101% Match": 276,
    "Words GSP 100% Match": 275,
    "Words GSP 95-99% Match": 274,
    "Words GSP 85-94% Match": 273,
    "Words GSP 75-84% Match": 272,
    "Words GSP 50-74% Match": 271,
"Words FBK New": 144,
    "Words FBK Repetitions": 284,
    "Words FBK 101% Match": 283,
    "Words FBK 100% Match": 282,
    "Words FBK 95-99% Match": 281,
    "Words FBK 85-94% Match": 280,
    "Words FBK 75-84% Match": 279,
    "Words FBK 50-74% Match": 278,
"Words MQM New": 169,
    "Words MQM Repetitions": 176,
    "Words MQM 101% Match": 175,
    "Words MQM 100% Match": 174,
    "Words MQM 95-99% Match": 173,
    "Words MQM 85-94% Match": 172,
    "Words MQM 75-84% Match": 171,
    "Words MQM 50-74% Match": 170,
"Words QSP New": 177,
    "Words QSP Repetitions": 184,
    "Words QSP 101% Match": 183,
    "Words QSP 100% Match": 182,
    "Words QSP 95-99% Match": 181,
    "Words QSP 85-94% Match": 180,
    "Words QSP 75-84% Match": 179,
    "Words QSP 50-74% Match": 178,
"Words LSO New": 185,
    "Words LSO Repetitions": 192,
    "Words LSO 101% Match": 191,
    "Words LSO 100% Match": 190,
    "Words LSO 95-99% Match": 189,
    "Words LSO 85-94% Match": 188,
    "Words LSO 75-84% Match": 187,
    "Words LSO 50-74% Match": 186,
"Words LQE New": 193,
    "Words LQE Repetitions": 200,
    "Words LQE 101% Match": 199,
    "Words LQE 100% Match": 198,
    "Words LQE 95-99% Match": 197,
    "Words LQE 85-94% Match": 196,
    "Words LQE 75-84% Match": 195,
    "Words LQE 50-74% Match": 194,
"Words MPF New": 209,
    "Words MPF Repetitions": 216,
    "Words MPF 101% Match": 215,
    "Words MPF 100% Match": 214,
    "Words MPF 95-99% Match": 213,
    "Words MPF 85-94% Match": 212,
    "Words MPF 75-84% Match": 211,
    "Words MPF 50-74% Match": 210,
"Words MPL New": 217,
    "Words MPL Repetitions": 224,
    "Words MPL 101% Match": 223,
    "Words MPL 100% Match": 222,
    "Words MPL 95-99% Match": 221,
    "Words MPL 85-94% Match": 220,
    "Words MPL 75-84% Match": 219,
    "Words MPL 50-74% Match": 218,
"Words APF New": 225,
    "Words APF Repetitions": 232,
    "Words APF 101% Match": 231,
    "Words APF 100% Match": 230,
    "Words APF 95-99% Match": 229,
    "Words APF 85-94% Match": 228,
    "Words APF 75-84% Match": 227,
    "Words APF 50-74% Match": 226,
"Words APL New": 233,
    "Words APL Repetitions": 240,
    "Words APL 101% Match": 239,
    "Words APL 100% Match": 238,
    "Words APL 95-99% Match": 237,
    "Words APL 85-94% Match": 236,
    "Words APL 75-84% Match": 235,
    "Words APL 50-74% Match": 234,
"Words APB New": 241,
    "Words APB Repetitions": 248,
    "Words APB 101% Match": 247,
    "Words APB 100% Match": 246,
    "Words APB 95-99% Match": 245,
    "Words APB 85-94% Match": 244,
    "Words APB 75-84% Match": 243,
    "Words APB 50-74% Match": 242,
"Words MPR New": 313,
    "Words MPR Repetitions": 320,
    "Words MPR 101% Match": 319,
    "Words MPR 100% Match": 318,
    "Words MPR 95-99% Match": 317,
    "Words MPR 85-94% Match": 316,
    "Words MPR 75-84% Match": 315,
    "Words MPR 50-74% Match": 314,
"Words PRP New": 297,
    "Words PRP Repetitions": 304,
    "Words PRP 101% Match": 303,
    "Words PRP 100% Match": 302,
    "Words PRP 95-99% Match": 301,
    "Words PRP 85-94% Match": 300,
    "Words PRP 75-84% Match": 299,
    "Words PRP 50-74% Match": 298,
"Words LLM New": 321,
    "Words LLM Repetitions": 328,
    "Words LLM 101% Match": 327,
    "Words LLM 100% Match": 326,
    "Words LLM 95-99% Match": 325,
    "Words LLM 85-94% Match": 324,
    "Words LLM 75-84% Match": 323,
    "Words LLM 50-74% Match": 322,
"Characters TRA New": 66,
    "Characters TRA Repetitions": 56,
    "Characters TRA 101% Match": 65,
    "Characters TRA 100% Match": 55,
    "Characters TRA 95-99% Match": 64,
    "Characters TRA 85-94% Match": 63,
    "Characters TRA 75-84% Match": 84,
    "Characters TRA 50-74% Match": 83,
"Characters REV New": 78,
    "Characters REV Repetitions": 90,
    "Characters REV 101% Match": 89,
    "Characters REV 100% Match": 88,
    "Characters REV 95-99% Match": 87,
    "Characters REV 85-94% Match": 86,
    "Characters REV 75-84% Match": 85,
    "Characters REV 50-74% Match": 201,
"Characters TEP New": 77,
    "Characters TEP Repetitions": 208,
    "Characters TEP 101% Match": 207,
    "Characters TEP 100% Match": 206,
    "Characters TEP 95-99% Match": 205,
    "Characters TEP 85-94% Match": 204,
    "Characters TEP 75-84% Match": 203,
    "Characters TEP 50-74% Match": 202,
"Characters TED New": 76,
    "Characters TED Repetitions": 296,
    "Characters TED 101% Match": 295,
    "Characters TED 100% Match": 294,
    "Characters TED 95-99% Match": 293,
    "Characters TED 85-94% Match": 292,
    "Characters TED 75-84% Match": 291,
    "Characters TED 50-74% Match": 290,
"Characters EDT New": 75,
    "Characters EDT Repetitions": 289,
    "Characters EDT 101% Match": 288,
    "Characters EDT 100% Match": 287,
    "Characters EDT 95-99% Match": 286,
    "Characters EDT 85-94% Match": 285,
    "Characters EDT 75-84% Match": 312,
    "Characters EDT 50-74% Match": 311,
"Hours TRA New": 74,
    "Hours REV New": 80,
    "Hours TEP New": 79,
    "Hours TED New": 305,
    "Hours EDT New": 306,
    "Hours PRF New": 307,
    "Hours TES New": 81,
    "Hours LLD New": 82,
    "Hours DTP New": 54,
    "Hours LHR New": 53,
    "Hours LQA New": 308,
    "Hours FPR New": 309,
    "Hours FED New": 310,
    "Hours PMG New": 249,
    "Hours OTH New": 329,
    "Hours SGC New": 330,
    "Hours RAT New": 331,
    "Hours ITP New": 332,
    "Hours SIT New": 333,
    "Hours DEV New": 334,
    "Hours CST New": 335,
    "Hours TSL New": 336,
    "Hours IGL New": 337,
    "Hours LQL New": 338,
    "Hours LPM New": 339,
"Jobs DTP New": 50,
    "Jobs SUB New": 340,
    "Jobs VOV New": 341,
    "Jobs GLC New": 342
  };
  function getPriceUnitId(description) {
    if (!description) return null;
    const key = String(description).trim();
    return PRICE_UNITS[key] ?? null;
  }
  const I18N = {
    en: {
      scriptName: "Price Unit Batch Add",
      versionLabel: "v{version}",
      toggleTitle: "Open Price Unit Batch Add",
      toggleButtonLabel: "PU",
      closeTitle: "Minimize",
      closeButtonLabel: "x",
      dataLabel: "Data",
      dataPlaceholder: "TRA\nREV\nTEP",
      dataHelp: "Each line is a base price name. Weighted prices will be generated automatically.",
      dataHelpWordsChars: "One code per line (e.g., TRA, REV)",
      dataHelpOther: "Full name per line (e.g., Hours TRA New)",
      statusReady: "Ready. Paste base price names and click action.",
      statusNoData: "No data. Add at least one line.",
      statusRunning: "Processing: {current}/{total}",
      statusCompleted: "Done. {total} items processed.",
      statusStopped: "Stopped at {current}/{total}.",
      statusError: "Error: {message}",
modeLabel: "Mode",
      modeWordsChars: "Words/Chars",
      modeOther: "Other",
      wordsOption: "Words",
      charsOption: "Chars",
      newDiscountCheckbox: "Include New Discount",
      fuzzyPercentLabel: "Fuzzy Percentages",
addBasePricesBtn: "Add Base",
      addWeightedBtn: "Add Weighted",
      setPercentBtn: "Set %",
      mapCatBtn: "Map CAT",
      runAllBtn: "Run All",
      stopButton: "Stop",
phaseAddingBase: "Adding base price: {name}",
      phaseAddingWeighted: "Adding weighted prices for: {name}",
      phaseSettingUnitPrice: "Setting unit price: {name}",
      phaseSettingPercentages: "Setting %: {name}",
      phaseMappingCat: "Mapping CAT interface..."
    },
    zh: {
      scriptName: "价格单位批量添加",
      versionLabel: "v{version}",
      toggleTitle: "打开价格单位批量添加",
      toggleButtonLabel: "PU",
      closeTitle: "最小化",
      closeButtonLabel: "x",
      dataLabel: "数据",
      dataPlaceholder: "TRA\nREV\nTEP",
      dataHelp: "每行是一个基准价名称。加权价格将自动生成。",
      dataHelpWordsChars: "每行一个代码 (如 TRA, REV)",
      dataHelpOther: "每行完整名称 (如 Hours TRA New)",
      statusReady: "就绪。粘贴基准价名称后点击操作。",
      statusNoData: "没有数据，请至少填写一行。",
      statusRunning: "处理中: {current}/{total}",
      statusCompleted: "完成。已处理 {total} 项。",
      statusStopped: "已停止: {current}/{total}。",
      statusError: "错误: {message}",
modeLabel: "模式",
      modeWordsChars: "Words/Chars",
      modeOther: "其他",
      wordsOption: "Words",
      charsOption: "Chars",
      newDiscountCheckbox: "包含 New Discount",
      fuzzyPercentLabel: "模糊区间百分比",
addBasePricesBtn: "添加基准价",
      addWeightedBtn: "添加加权价",
      setPercentBtn: "设置%",
      mapCatBtn: "映射CAT",
      runAllBtn: "一键执行",
      stopButton: "停止",
phaseAddingBase: "添加基准价: {name}",
      phaseAddingWeighted: "添加加权价: {name}",
      phaseSettingUnitPrice: "设置单价: {name}",
      phaseSettingPercentages: "设置百分比: {name}",
      phaseMappingCat: "映射 CAT 区间..."
    }
  };
  I18N["zh-cn"] = I18N.zh;
  const DEFAULT_LOCALE = "en";
  const ACTIVE_LOCALE = (() => {
    const raw = (navigator.language || DEFAULT_LOCALE).toLowerCase();
    if (I18N[raw]) return raw;
    const base = raw.split("-")[0];
    if (I18N[base]) return base;
    return DEFAULT_LOCALE;
  })();
  function t(key, vars = {}) {
    const template = I18N[ACTIVE_LOCALE]?.[key] || I18N[DEFAULT_LOCALE]?.[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, token) => {
      if (Object.prototype.hasOwnProperty.call(vars, token)) {
        return String(vars[token]);
      }
      return "";
    });
  }
  function buildFuzzyRowsHtml() {
    return FUZZY_INTERVALS.map((interval) => `
    <div class="plba-fuzzy-row" data-interval="${interval.id}">
      <span class="plba-fuzzy-label">${interval.label}</span>
      <input type="number" id="plba-fuzzy-${interval.id}"
             class="plba-fuzzy-input" min="0" max="100" placeholder="%"
             value="${interval.defaultValue}">
      <span class="plba-fuzzy-unit">%</span>
    </div>
  `).join("");
  }
  const MODULE_SPECIFIC_STYLES = `
/* Price Unit uses purple accent */
#${SCRIPT_ID}-panel {
  --pa-accent: #6b5b95;
  --pa-accent-strong: #524475;
  --pa-accent-light: rgba(107, 91, 149, 0.12);
}

/* Mode section */
.plba-mode-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 6px 0;
}

.plba-mode-section label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 12px;
}

/* Words/Chars sub-options */
.plba-submode {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  background: var(--pa-surface);
  border: 1px solid var(--pa-border);
  border-radius: var(--pa-radius-sm);
  margin-bottom: 8px;
}

.plba-submode label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 11px;
}

.plba-new-discount {
  margin-left: auto;
  font-weight: 500;
  color: var(--pa-accent);
}

/* Two column layout */
.plba-two-column {
  display: flex;
  gap: 12px;
}

.plba-column {
  flex: 1;
  min-width: 0;
}

.plba-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--pa-muted);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Fuzzy config (adapted from src-pricelist-misc-batch/ui.js) */
.plba-fuzzy-config {
  background: var(--pa-surface);
  border: 1px solid var(--pa-border);
  border-radius: var(--pa-radius-sm);
  padding: 6px 8px;
}

.plba-fuzzy-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
}

.plba-fuzzy-label {
  flex: 1;
  font-size: 11px;
}

.plba-fuzzy-input {
  width: 50px;
  padding: 3px 5px;
  border: 1px solid var(--pa-border);
  border-radius: var(--pa-radius-xs);
  font-size: 11px;
  text-align: right;
  background: #fff;
}

.plba-fuzzy-input:focus {
  outline: none;
  border-color: var(--pa-accent);
}

.plba-fuzzy-unit {
  font-size: 10px;
  color: var(--pa-muted);
  width: 12px;
}

/* New Discount row hidden by default */
.plba-fuzzy-row[data-interval="new-discount"] {
  display: none;
}
.plba-fuzzy-row[data-interval="new-discount"].visible {
  display: flex;
}

/* Hidden section helper */
.plba-section-hidden {
  display: none !important;
}

/* Button rows */
.plba-button-row {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.plba-button-row .wide {
  flex: 1;
}

/* Button color variants */
.plba-btn-secondary {
  background: var(--pa-success) !important;
}
.plba-btn-secondary:hover:not(:disabled) {
  background: #177a45 !important;
}
.plba-btn-info {
  background: #5b8def !important;
}
.plba-btn-info:hover:not(:disabled) {
  background: #4a7bd9 !important;
}
.plba-btn-warning {
  background: var(--pa-warning) !important;
}
.plba-btn-warning:hover:not(:disabled) {
  background: #b07a0f !important;
}

/* Data help text */
.plba-data-help {
  margin-top: 4px;
  font-size: 10px;
  color: var(--pa-muted);
}
`;
  let stylesInjected = false;
  function injectStyles() {
    if (stylesInjected) return;
    injectTheme();
    const styleId = `${SCRIPT_ID}-style`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = MODULE_SPECIFIC_STYLES;
      document.head.appendChild(style);
    }
    stylesInjected = true;
  }
  function createPriceUnitPanel(callbacks = {}) {
    injectStyles();
    const panel = createModulePanel({
      id: SCRIPT_ID,
      title: t("scriptName"),
      version: t("versionLabel", { version: SCRIPT_VERSION }),
      prefix: "plba",
      width: "520px",
      position: { top: "60px", right: "50px" },
      hasLog: false,
      onClose: callbacks.onClose
    });
    const getElement = (selector) => panel.panel.querySelector(selector);
    panel.addSection({
      id: "plba-mode-section",
      content: `
      <div class="plba-mode-section">
        <span style="font-weight:500;">${t("modeLabel")}:</span>
        <label><input type="radio" name="plba-mode" value="words-chars" checked> ${t("modeWordsChars")}</label>
        <label><input type="radio" name="plba-mode" value="other"> ${t("modeOther")}</label>
      </div>
    `
    });
    panel.addSection({
      id: "plba-wc-options",
      content: `
      <div class="plba-submode" id="plba-wc-submode">
        <label><input type="radio" name="plba-unit-type" value="words" checked> ${t("wordsOption")}</label>
        <label><input type="radio" name="plba-unit-type" value="chars"> ${t("charsOption")}</label>
        <label class="plba-new-discount">
          <input type="checkbox" id="plba-new-discount"> ${t("newDiscountCheckbox")}
        </label>
      </div>
    `
    });
    panel.addSection({
      id: "plba-main-content",
      content: `
      <div class="plba-two-column" id="plba-two-column">
        <div class="plba-column">
          <div class="plba-section-title">${t("dataLabel")}</div>
          <textarea class="pa-textarea" id="plba-values"
            placeholder="${t("dataPlaceholder")}"
            style="width:100%;min-height:170px;font-family:var(--pa-font-mono);"></textarea>
          <div class="plba-data-help" id="plba-data-help">${t("dataHelpWordsChars")}</div>
        </div>
        <div class="plba-column" id="plba-fuzzy-column">
          <div class="plba-section-title">${t("fuzzyPercentLabel")}</div>
          <div class="plba-fuzzy-config">
            ${buildFuzzyRowsHtml()}
          </div>
        </div>
      </div>
    `
    });
    panel.addSection({
      id: "plba-wc-buttons",
      content: `
      <div class="plba-button-row" id="plba-wc-btn-row1">
        <button type="button" class="pa-btn pa-btn-primary" id="plba-add-base">${t("addBasePricesBtn")}</button>
        <button type="button" class="pa-btn plba-btn-secondary" id="plba-add-weighted">${t("addWeightedBtn")}</button>
        <button type="button" class="pa-btn plba-btn-info" id="plba-set-percent">${t("setPercentBtn")}</button>
        <button type="button" class="pa-btn plba-btn-warning" id="plba-map-cat">${t("mapCatBtn")}</button>
      </div>
      <div class="plba-button-row" id="plba-wc-btn-row2">
        <button type="button" class="pa-btn pa-btn-primary wide" id="plba-run-all">${t("runAllBtn")}</button>
        <button type="button" class="pa-btn pa-btn-danger" id="plba-stop" disabled>${t("stopButton")}</button>
      </div>
    `
    });
    panel.addSection({
      id: "plba-other-buttons",
      content: `
      <div class="plba-button-row plba-section-hidden" id="plba-other-btn-row">
        <button type="button" class="pa-btn pa-btn-primary wide" id="plba-add-base-other">${t("addBasePricesBtn")}</button>
        <button type="button" class="pa-btn pa-btn-danger" id="plba-stop-other" disabled>${t("stopButton")}</button>
      </div>
    `
    });
    const addBaseBtn = getElement("#plba-add-base");
    const addWeightedBtn = getElement("#plba-add-weighted");
    const setPercentBtn = getElement("#plba-set-percent");
    const mapCatBtn = getElement("#plba-map-cat");
    const runAllBtn = getElement("#plba-run-all");
    const stopBtn = getElement("#plba-stop");
    const addBaseOtherBtn = getElement("#plba-add-base-other");
    const stopOtherBtn = getElement("#plba-stop-other");
    const newDiscountCheckbox = getElement("#plba-new-discount");
    if (addBaseBtn && callbacks.onAddBase) {
      addBaseBtn.addEventListener("click", callbacks.onAddBase);
    }
    if (addWeightedBtn && callbacks.onAddWeighted) {
      addWeightedBtn.addEventListener("click", callbacks.onAddWeighted);
    }
    if (setPercentBtn && callbacks.onSetPercent) {
      setPercentBtn.addEventListener("click", callbacks.onSetPercent);
    }
    if (mapCatBtn && callbacks.onMapCat) {
      mapCatBtn.addEventListener("click", callbacks.onMapCat);
    }
    if (runAllBtn && callbacks.onRunAll) {
      runAllBtn.addEventListener("click", callbacks.onRunAll);
    }
    if (stopBtn && callbacks.onStop) {
      stopBtn.addEventListener("click", callbacks.onStop);
    }
    if (addBaseOtherBtn && callbacks.onAddBaseOther) {
      addBaseOtherBtn.addEventListener("click", callbacks.onAddBaseOther);
    }
    if (stopOtherBtn && callbacks.onStop) {
      stopOtherBtn.addEventListener("click", callbacks.onStop);
    }
    return {
      ...panel,
valuesInput: getElement("#plba-values"),
      newDiscountCheckbox,
addBaseBtn,
      addWeightedBtn,
      setPercentBtn,
      mapCatBtn,
      runAllBtn,
      stopBtn,
      addBaseOtherBtn,
      stopOtherBtn,
getFuzzyValues(includeNewDiscount = false) {
        const values = [];
        FUZZY_INTERVALS.forEach((interval) => {
          if (interval.id === "new-discount" && !includeNewDiscount) return;
          const input = getElement(`#plba-fuzzy-${interval.id}`);
          const val = input?.value ? parseFloat(input.value) : null;
          if (val != null && !isNaN(val)) {
            values.push({ suffix: interval.suffix, percentage: val });
          }
        });
        return values;
      },
toggleNewDiscountRow(visible) {
        const row = getElement('.plba-fuzzy-row[data-interval="new-discount"]');
        if (row) {
          row.classList.toggle("visible", visible);
        }
      },
toggleMode(mode) {
        const wcSubmode = getElement("#plba-wc-submode");
        const fuzzyColumn = getElement("#plba-fuzzy-column");
        const wcBtnRow1 = getElement("#plba-wc-btn-row1");
        const wcBtnRow2 = getElement("#plba-wc-btn-row2");
        const otherBtnRow = getElement("#plba-other-btn-row");
        const dataHelp = getElement("#plba-data-help");
        if (mode === "words-chars") {
          wcSubmode?.classList.remove("plba-section-hidden");
          fuzzyColumn?.classList.remove("plba-section-hidden");
          wcBtnRow1?.classList.remove("plba-section-hidden");
          wcBtnRow2?.classList.remove("plba-section-hidden");
          otherBtnRow?.classList.add("plba-section-hidden");
          if (dataHelp) dataHelp.textContent = t("dataHelpWordsChars");
        } else {
          wcSubmode?.classList.add("plba-section-hidden");
          fuzzyColumn?.classList.add("plba-section-hidden");
          wcBtnRow1?.classList.add("plba-section-hidden");
          wcBtnRow2?.classList.add("plba-section-hidden");
          otherBtnRow?.classList.remove("plba-section-hidden");
          if (dataHelp) dataHelp.textContent = t("dataHelpOther");
        }
      },
syncButtonState: (state) => {
        const { isRunning, items } = state;
        const hasItems = items.length > 0;
        panel.setElementStates({
"plba-add-base": isRunning || !hasItems,
          "plba-add-weighted": isRunning || !hasItems,
          "plba-set-percent": isRunning || !hasItems,
          "plba-map-cat": isRunning,
          "plba-run-all": isRunning || !hasItems,
          "plba-stop": !isRunning,
"plba-add-base-other": isRunning || !hasItems,
          "plba-stop-other": !isRunning,
"plba-values": isRunning,
          "plba-new-discount": isRunning
        });
        panel.setDisabled('input[name="plba-mode"]', isRunning);
        panel.setDisabled('input[name="plba-unit-type"]', isRunning);
      }
    };
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function debug(log, msg) {
    {
      console.log(`[${SCRIPT_ID}] ${msg}`);
      log?.(`DEBUG: ${msg}`);
    }
  }
  function candidateDocs() {
    const docs = [document];
    for (const iframe of document.querySelectorAll("iframe")) {
      try {
        if (iframe.contentDocument) {
          docs.push(iframe.contentDocument);
        }
      } catch {
      }
    }
    return docs;
  }
  function qsAny(selector) {
    if (!selector) return null;
    const selectors = Array.isArray(selector) ? selector : [selector];
    for (const sel of selectors) {
      const s = String(sel);
      for (const doc of candidateDocs()) {
        let node = null;
        if (s.startsWith("css=")) {
          node = doc.querySelector(s.slice(4));
        } else if (s.startsWith("text=")) {
          const text = s.slice(5).trim();
          const all = doc.querySelectorAll("button, a, span, div, label");
          node = Array.from(all).find((n) => n.textContent?.trim().includes(text));
        } else if (s.startsWith("xpath=")) {
          const xp = s.slice(6);
          const result = doc.evaluate(xp, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          node = result.singleNodeValue;
        } else {
          node = doc.querySelector(s);
        }
        if (node && node.nodeType === 1) return node;
      }
    }
    return null;
  }
  function qx(xpath) {
    for (const doc of candidateDocs()) {
      const result = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const node = result.singleNodeValue;
      if (node && node.nodeType === 1) return node;
    }
    return null;
  }
  function qxAll(xpath) {
    const out = [];
    for (const doc of candidateDocs()) {
      const result = doc.evaluate(xpath, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0; i < result.snapshotLength; i++) {
        const node = result.snapshotItem(i);
        if (node && node.nodeType === 1) {
          out.push(node);
        }
      }
    }
    return out;
  }
  function isVisible(node) {
    if (!node || node.nodeType !== 1) return false;
    const view = node.ownerDocument?.defaultView || window;
    const style = view.getComputedStyle(node);
    if (style.visibility === "hidden" || style.display === "none") return false;
    return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
  }
  function setNativeValue(input, value) {
    if (!input) return;
    const view = input.ownerDocument?.defaultView || window;
    const setter = Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, "value")?.set;
    if (setter) {
      setter.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new view.Event("input", { bubbles: true }));
    input.dispatchEvent(new view.Event("change", { bubbles: true }));
  }
  async function typeIntoInput(input, text, delayPerChar = 30) {
    if (!input) return;
    const view = input.ownerDocument?.defaultView || window;
    input.value = "";
    input.dispatchEvent(new view.Event("input", { bubbles: true }));
    input.focus();
    for (const char of text) {
      input.value += char;
      input.dispatchEvent(new view.KeyboardEvent("keydown", { key: char, bubbles: true, cancelable: true }));
      input.dispatchEvent(new view.KeyboardEvent("keypress", { key: char, bubbles: true, cancelable: true }));
      input.dispatchEvent(new view.Event("input", { bubbles: true }));
      input.dispatchEvent(new view.KeyboardEvent("keyup", { key: char, bubbles: true, cancelable: true }));
      await sleep(delayPerChar);
    }
  }
  function setSelectValue(selectEl, value) {
    if (!selectEl || selectEl.tagName !== "SELECT") return false;
    const want = String(value || "").trim();
    if (!want) return false;
    const wantLc = want.toLowerCase();
    const opts = Array.from(selectEl.options);
    const norm = (s) => String(s || "").trim();
    const match = opts.find((o) => norm(o.label) === want) || opts.find((o) => norm(o.value) === want) || opts.find((o) => norm(o.text) === want) || opts.find((o) => norm(o.label).toLowerCase() === wantLc) || opts.find((o) => norm(o.value).toLowerCase() === wantLc) || opts.find((o) => norm(o.text).toLowerCase() === wantLc) || opts.find((o) => norm(o.label).toLowerCase().includes(wantLc)) || opts.find((o) => norm(o.text).toLowerCase().includes(wantLc)) || opts.find((o) => norm(o.value).toLowerCase().includes(wantLc));
    if (!match) return false;
    selectEl.value = match.value;
    const idx = opts.indexOf(match);
    if (idx >= 0) selectEl.selectedIndex = idx;
    const view = selectEl.ownerDocument?.defaultView || window;
    selectEl.dispatchEvent(new view.Event("change", { bubbles: true }));
    selectEl.dispatchEvent(new view.Event("input", { bubbles: true }));
    return true;
  }
  function describeEl(node) {
    if (!node) return "null";
    if (typeof node !== "object") return `Invalid(${typeof node})`;
    if (!node.nodeType) {
      return `Node(type=${node.nodeType}, name=${node.nodeName}, constructor=${node.constructor?.name})`;
    }
    if (node.nodeType !== 1) {
      return `Node(type=${node.nodeType}, name=${node.nodeName})`;
    }
    const id = node.id ? `#${node.id}` : "";
    const cls = node.className ? `.${String(node.className).trim().replace(/\s+/g, ".")}` : "";
    const text = node.textContent?.trim().slice(0, 30) || "";
    return `${node.tagName}${id}${cls}${text ? `[${text}]` : ""}`;
  }
  async function waitFor(check, timeoutMs = 2e4, stepMs = 200, label = "") {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const v = check();
        if (v) return v;
      } catch (e) {
        if (label) {
          console.warn(`waitFor(${label}) check error:`, e.message);
        }
      }
      await sleep(stepMs);
    }
    throw new Error(`Timeout waiting for: ${label || "condition"}`);
  }
  async function click(selectorOrEl) {
    const element = typeof selectorOrEl === "string" ? qsAny(selectorOrEl) : selectorOrEl;
    if (!element) {
      const selectorDesc = typeof selectorOrEl === "string" ? selectorOrEl : "element object";
      throw new Error(`Element not found: ${selectorDesc}`);
    }
    if (typeof element !== "object" || element === null) {
      throw new Error(`Invalid element type: ${typeof element}, expected object`);
    }
    if (!element.nodeType || element.nodeType !== 1) {
      throw new Error(`Invalid element node (nodeType=${element.nodeType}, expected 1): ${describeEl(element)}`);
    }
    if (typeof element.scrollIntoView === "function") {
      element.scrollIntoView({ block: "center", inline: "nearest" });
    }
    await sleep(200);
    const view = element.ownerDocument?.defaultView || window;
    element.dispatchEvent(new view.MouseEvent("mousedown", { bubbles: true, cancelable: true, view }));
    element.dispatchEvent(new view.MouseEvent("mouseup", { bubbles: true, cancelable: true, view }));
    element.dispatchEvent(new view.MouseEvent("click", { bubbles: true, cancelable: true, view }));
    await sleep(CONFIG.WAIT_AFTER_CLICK);
    return element;
  }
  function getIdSuffix() {
    return getIdSuffix$1();
  }
  function getSelectors() {
    const suffix = getIdSuffix();
    return {
      basePriceDropdown: [
        `xpath=//pl-tag-box[starts-with(@id,'ATagBox08OutPPS30${suffix}')]//div[contains(@class,'fakeSelect')]`,
        `xpath=//button[starts-with(@id,'TagBoxDropDownOutPPS30${suffix}')]`,
        "xpath=//pl-tag-box[starts-with(@id,'ATagBox08OutPPS30')]//div[contains(@class,'fakeSelect')]",
        "xpath=//button[starts-with(@id,'TagBoxDropDownOutPPS30')]"
      ],
      basePriceSearchInput: [
        `xpath=//input[@id='ATagBox01OutPPS30${suffix}']`,
        "xpath=//input[starts-with(@id,'ATagBox01OutPPS30')]"
      ],
      basePriceOkBtn: [
        `xpath=//button[@id='OutPPS32${suffix}']`,
        "xpath=//button[starts-with(@id,'OutPPS32')][.//span[normalize-space()='OK']]"
      ],
      catInterfaceTab: [
        "xpath=//a[.//b[normalize-space()='CAT interface'] or normalize-space()='CAT interface']",
        "xpath=//td[contains(@class,'InnerTab') or contains(@class,'InnerTabSelected')]//a[normalize-space()='CAT interface']",
        "text=CAT interface"
      ],
      pricesTab: [
        "xpath=//a[.//b[normalize-space()='Prices'] or normalize-space()='Prices']",
        "xpath=//td[contains(@class,'InnerTab') or contains(@class,'InnerTabSelected')]//a[normalize-space()='Prices']",
        "text=Prices"
      ],
      memoQManagerBtn: [
        "xpath=//button[.//span[normalize-space()='memoQManager']]",
        "xpath=//span[normalize-space()='memoQManager']/ancestor::button[1]"
      ]
    };
  }
  function trySelectViaHiddenSelect({ docsToSearch, key, optionText, log }) {
    if (!key) return false;
    for (const d of docsToSearch) {
      const selectEl = d.querySelector(`select#${CSS.escape(key)}, select[name='${CSS.escape(key)}']`);
      if (!selectEl) continue;
      const ok = setSelectValue(selectEl, optionText);
      if (ok) {
        debug(log, `TagBox fallback: selected via hidden <select>#${key}`);
        return true;
      }
    }
    return false;
  }
  async function selectTagBoxById({ triggerEl, tagBoxKey, targetId, searchText, log }) {
    const logFn = (msg) => debug(log, msg);
    if (!triggerEl) {
      return { success: false, error: "Trigger element not found" };
    }
    const doc = triggerEl.ownerDocument || document;
    const win = doc.defaultView || window;
    const docsToSearch = (() => {
      const docs = [doc];
      if (document !== doc) docs.push(document);
      for (const d of candidateDocs()) {
        if (!docs.includes(d)) docs.push(d);
      }
      return docs;
    })();
    const findInDocs = (xpath) => {
      for (const d of docsToSearch) {
        const result = d.evaluate(xpath, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const node = result.singleNodeValue;
        if (node && node.nodeType === 1) return node;
      }
      return null;
    };
    const clickTrigger = () => {
      triggerEl.dispatchEvent(new win.MouseEvent("mousedown", { bubbles: true, cancelable: true, view: win }));
      triggerEl.dispatchEvent(new win.MouseEvent("mouseup", { bubbles: true, cancelable: true, view: win }));
      triggerEl.dispatchEvent(new win.MouseEvent("click", { bubbles: true, cancelable: true, view: win }));
    };
    const inputXpath = `//input[@id='ATagBox01${tagBoxKey}']`;
    const retryDelays = [2500, 2e3, 1500];
    const maxAttempts = 3;
    let searchInput = null;
    for (let attempt = 1; attempt <= maxAttempts && !searchInput; attempt++) {
      logFn(`Opening TagBox by ID (key: ${tagBoxKey}, id: ${targetId})${attempt > 1 ? ` (attempt ${attempt})` : ""}`);
      clickTrigger();
      const waitTime = retryDelays[attempt - 1] || 3e3;
      const startTime = Date.now();
      while (!searchInput && Date.now() - startTime < waitTime) {
        await sleep(300);
        searchInput = findInDocs(inputXpath);
      }
    }
    if (searchInput && searchText) {
      const charCount = Math.max(3, Math.ceil(searchText.length * 0.6));
      const shortSearch = searchText.slice(0, charCount);
      logFn(`Typing "${shortSearch}" to filter`);
      await typeIntoInput(searchInput, shortSearch);
      await sleep(600);
    } else if (searchText) {
      logFn(`Search input not found, proceeding without filter`);
      await sleep(400);
    }
    const optionPatterns = [
      `//div[@id='ATagBox02#${tagBoxKey}#${targetId}']`,
      `//div[@id='ATagBox09#${tagBoxKey}#${targetId}']`,
      `//*[@id='ATagBox02#${tagBoxKey}#${targetId}' or @id='ATagBox09#${tagBoxKey}#${targetId}']`
    ];
    let option = null;
    for (const pattern of optionPatterns) {
      option = findInDocs(pattern);
      if (option) break;
    }
    if (option) {
      logFn(`Found option by ID: ${option.id} - "${option.textContent?.trim()}"`);
      const optDoc = option.ownerDocument;
      const optWin = optDoc.defaultView || window;
      option.scrollIntoView({ block: "center" });
      await sleep(200);
      option.dispatchEvent(new optWin.MouseEvent("mousedown", { bubbles: true, cancelable: true, view: optWin }));
      option.dispatchEvent(new optWin.MouseEvent("mouseup", { bubbles: true, cancelable: true, view: optWin }));
      option.dispatchEvent(new optWin.MouseEvent("click", { bubbles: true, cancelable: true, view: optWin }));
      await sleep(400);
      return { success: true, option };
    }
    logFn(`Option with ID ${targetId} not found in TagBox ${tagBoxKey}`);
    doc.body?.click?.();
    return { success: false, error: `Option ID ${targetId} not found` };
  }
  async function selectOneFromTagBox({ dropBtnSel, searchInputSel, listIdPrefix, optionText, log }) {
    debug(log, `TagBox selectOne: ${optionText}`);
    if (!dropBtnSel) {
      throw new Error("dropBtnSel is required for selectOneFromTagBox");
    }
    let element = dropBtnSel;
    if (typeof dropBtnSel === "string") {
      element = qsAny(dropBtnSel);
      if (!element) {
        throw new Error(`TagBox trigger not found: ${dropBtnSel}`);
      }
    } else if (Array.isArray(dropBtnSel)) {
      element = qsAny(dropBtnSel);
      if (!element) {
        throw new Error(`TagBox trigger not found from selectors`);
      }
    }
    debug(log, `TagBox trigger element: ${describeEl(element)}`);
    const priceUnitId = getPriceUnitId(optionText);
    if (priceUnitId != null) {
      const suffix = getIdSuffix();
      const tagBoxKey = `OutPPS30${suffix}`;
      debug(log, `Trying ID-based selection: ${optionText} -> ID ${priceUnitId} (key: ${tagBoxKey})`);
      const result = await selectTagBoxById({
        triggerEl: element,
        tagBoxKey,
        targetId: priceUnitId,
        searchText: optionText,
        log
      });
      if (result.success) {
        debug(log, `ID-based selection succeeded for: ${optionText}`);
        return;
      }
      debug(log, `ID-based selection failed, falling back to text-based selection`);
    }
    const doc = element.ownerDocument || document;
    const docsToSearch = (() => {
      const docs = [doc];
      if (document !== doc) docs.push(document);
      for (const d of candidateDocs()) {
        if (!docs.includes(d)) docs.push(d);
      }
      return docs;
    })();
    const qxDocs = (xpath) => {
      for (const d of docsToSearch) {
        const result = d.evaluate(xpath, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const node = result.singleNodeValue;
        if (node && node.nodeType === 1) return node;
      }
      return null;
    };
    const triggerEl = element.closest?.(
      "button[id^='TagBoxDropDown'], div[id^='ATagBox05'], div[name^='ATagBox05'], div[id^='ATagBox10'], div[name^='ATagBox10'], div[id^='ATagBox08'], pl-tag-box[id^='ATagBox08']"
    ) || element;
    let key = "";
    const id = triggerEl.id || "";
    const name = triggerEl.getAttribute?.("name") || "";
    if (id.startsWith("TagBoxDropDown")) key = id.slice("TagBoxDropDown".length);
    else if (id.startsWith("ATagBox05")) key = id.slice("ATagBox05".length);
    else if (id.startsWith("ATagBox10")) key = id.slice("ATagBox10".length);
    else if (id.startsWith("ATagBox08")) key = id.slice("ATagBox08".length);
    else if (name.startsWith("ATagBox05")) key = name.slice("ATagBox05".length);
    else if (name.startsWith("ATagBox10")) key = name.slice("ATagBox10".length);
    if (!key) {
      const inputs = Array.from(doc.querySelectorAll("input[id^='ATagBox01']")).filter(isVisible);
      if (inputs.length === 1) {
        key = inputs[0].id.slice("ATagBox01".length);
      }
    }
    debug(log, `TagBox key: ${key}`);
    const keyVariants = (() => {
      const out = [];
      if (key) out.push(key);
      if (key && /\d$/.test(key)) out.push(key.slice(0, -1));
      return Array.from(new Set(out.filter(Boolean)));
    })();
    const fakeSelect = triggerEl.querySelector?.(".fakeSelect") || (keyVariants.length ? docsToSearch.map((d) => keyVariants.map((k) => d.querySelector(`pl-tag-box#ATagBox08${CSS.escape(k)} .fakeSelect`)).find((x) => x)).find((b) => b) : null);
    const openBtn = triggerEl.querySelector?.("button[id^='TagBoxDropDown']") || (keyVariants.length ? docsToSearch.map((d) => keyVariants.map((k) => d.querySelector(`#TagBoxDropDown${CSS.escape(k)}`)).find((x) => x)).find((b) => b) : null);
    const placeholderText = key ? docsToSearch.map((d) => d.querySelector(`div[name='ATagBox05${CSS.escape(key)}'] .hinweistext.ellipsis`)).find((b) => b && isVisible(b)) : null;
    const placeholder = placeholderText?.closest?.(".fakeSelect") || placeholderText;
    const openEl = openBtn || fakeSelect || placeholder || element;
    debug(log, `TagBox open element: ${describeEl(openEl)}`);
    await click(openEl);
    await sleep(CONFIG.WAIT_AFTER_CLICK);
    let inferredSearch = searchInputSel || (keyVariants.length ? keyVariants.map((k) => `css=input#ATagBox01${k}`) : null);
    let inferredPrefix = listIdPrefix || (key ? `ATagBox02#${key}#` : null);
    if (!inferredSearch || !inferredPrefix) {
      throw new Error(`TagBox cannot infer selectors`);
    }
    const optXpathExact = `//div[starts-with(@id,'${inferredPrefix}')]//div[contains(@class,'ellipsis') and normalize-space()=${JSON.stringify(optionText)}]/ancestor::div[starts-with(@id,'${inferredPrefix}')][1]`;
    const optXpathContains = `//div[starts-with(@id,'${inferredPrefix}')]//div[contains(@class,'ellipsis') and contains(normalize-space(),${JSON.stringify(optionText)})]/ancestor::div[starts-with(@id,'${inferredPrefix}')][1]`;
    const optXpathTagExact = `//div[starts-with(@id,'${inferredPrefix}') and contains(@class,'tag') and normalize-space()=${JSON.stringify(optionText)}]`;
    const optXpathTagContains = `//div[starts-with(@id,'${inferredPrefix}') and contains(@class,'tag') and contains(normalize-space(),${JSON.stringify(optionText)})]`;
    const optXpathFallbackExact = `//*[(contains(concat(' ',@class,' '),' tag ') or @class='tag') and contains(@id,'#') and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper')) and not(contains(@class,'fakeSelect')) and normalize-space()=${JSON.stringify(optionText)}] | //div[contains(@class,'ellipsis') and contains(@id,'#') and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper')) and not(contains(@class,'fakeSelect')) and normalize-space()=${JSON.stringify(optionText)}]/ancestor::*[self::div or self::li][contains(@id,'#') and not(contains(@class,'fakeSelect')) and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper'))][1]`;
    const optXpathFallbackContains = `//*[(contains(concat(' ',@class,' '),' tag ') or @class='tag') and contains(@id,'#') and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper')) and not(contains(@class,'fakeSelect')) and contains(normalize-space(),${JSON.stringify(optionText)})] | //div[contains(@class,'ellipsis') and contains(@id,'#') and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper')) and not(contains(@class,'fakeSelect')) and contains(normalize-space(),${JSON.stringify(optionText)})]/ancestor::*[self::div or self::li][contains(@id,'#') and not(contains(@class,'fakeSelect')) and not(contains(@class,'wrapper')) and not(contains(@class,'Wrapper'))][1]`;
    const optXpathATagBox09Exact = key ? `//div[starts-with(@id,'ATagBox09#${key}#') and contains(@class,'tag') and normalize-space()=${JSON.stringify(optionText)}]` : "";
    const optXpathATagBox09Contains = key ? `//div[starts-with(@id,'ATagBox09#${key}#') and contains(@class,'tag') and contains(normalize-space(),${JSON.stringify(optionText)})]` : "";
    const findOptNow = () => (optXpathATagBox09Exact ? qxDocs(optXpathATagBox09Exact) : null) || (optXpathATagBox09Contains ? qxDocs(optXpathATagBox09Contains) : null) || qxDocs(optXpathTagExact) || qxDocs(optXpathTagContains) || qxDocs(optXpathExact) || qxDocs(optXpathContains) || qxDocs(optXpathFallbackExact) || qxDocs(optXpathFallbackContains);
    if (trySelectViaHiddenSelect({ docsToSearch, key, optionText, log })) {
      return;
    }
    const openTimeoutMs = key && /^OutPPS30/.test(key) ? 8800 : CONFIG.WAIT_FOR_DROPDOWN;
    let ready;
    try {
      ready = await waitFor(() => {
        const sels = Array.isArray(inferredSearch) ? inferredSearch : [inferredSearch];
        let n = null;
        for (const s0 of sels) {
          const sel = String(s0);
          const queryCss = (css) => docsToSearch.map((d) => d.querySelector(css)).find((x) => x);
          if (sel.startsWith("css=")) {
            n = queryCss(sel.slice(4));
          } else if (sel.startsWith("xpath=")) {
            n = qxDocs(sel.slice(6));
          } else {
            n = queryCss(sel);
          }
          if (n && isVisible(n)) break;
        }
        if (n) {
          if (!listIdPrefix && n.id?.startsWith("ATagBox01")) {
            inferredPrefix = `ATagBox02#${n.id.slice("ATagBox01".length)}#`;
          }
          const visible = isVisible(n);
          if (!visible && CONFIG.DEBUG) {
            debug(log, `TagBox input found but not visible: ${describeEl(n)}`);
          }
          return { kind: "input", el: n };
        }
        const opt2 = findOptNow();
        if (opt2) return { kind: "opt", el: opt2 };
        const view = doc.defaultView || window;
        const reopenTarget = openBtn && openBtn !== openEl ? openBtn : openEl || element;
        try {
          reopenTarget.scrollIntoView?.({ block: "center" });
        } catch {
        }
        reopenTarget.dispatchEvent?.(new view.MouseEvent("mousedown", { bubbles: true, cancelable: true }));
        reopenTarget.dispatchEvent?.(new view.MouseEvent("mouseup", { bubbles: true, cancelable: true }));
        reopenTarget.dispatchEvent?.(new view.MouseEvent("click", { bubbles: true, cancelable: true }));
        if (CONFIG.DEBUG && key) {
          reopenTarget.__plunetDebugTick = (reopenTarget.__plunetDebugTick || 0) + 1;
          const mod = /^OutPPS30/.test(key) ? 20 : 10;
          if (reopenTarget.__plunetDebugTick % mod === 0) {
            const allInputs = docsToSearch.flatMap((d) => Array.from(d.querySelectorAll(`input#ATagBox01${CSS.escape(key)}`)));
            const anyOpt = findOptNow();
            debug(log, `TagBox debug: inputs=${allInputs.length}, anyOpt=${anyOpt ? "yes" : "no"}`);
          }
        }
        return null;
      }, openTimeoutMs, 150, "TagBox input or list");
    } catch (e) {
      if (trySelectViaHiddenSelect({ docsToSearch, key, optionText, log })) {
        return;
      }
      throw e;
    }
    if (ready.kind === "opt") {
      debug(log, `TagBox option found (no input): ${describeEl(ready.el)}`);
      ready.el.click();
      await sleep(CONFIG.WAIT_AFTER_CLICK);
      doc.body?.click?.();
      await sleep(600);
      return;
    }
    const input = ready.el;
    debug(log, `TagBox input: ${describeEl(input)}`);
    const fastText = key && /^OutPPS30/.test(key) ? String(optionText).trim().split(/\s+/).slice(0, 2).join(" ") : optionText;
    await typeIntoInput(input, fastText);
    await sleep(CONFIG.WAIT_AFTER_INPUT);
    const opt = await waitFor(() => {
      return findOptNow();
    }, CONFIG.WAIT_FOR_DROPDOWN, 250, `TagBox option: ${optionText}`);
    debug(log, `TagBox option found: ${describeEl(opt)}`);
    opt.click();
    await sleep(CONFIG.WAIT_AFTER_CLICK);
    doc.body?.click?.();
    await sleep(600);
  }
  async function selectManyFromTagBox({ openBtnEl, searchInputPrefix, listIdPrefix, optionTexts, okBtnEl, log }) {
    debug(log, `TagBox selectMany: ${optionTexts.length} items`);
    const doc = openBtnEl.ownerDocument || document;
    const triggerEl = openBtnEl.closest?.(
      "button[id^='TagBoxDropDown'], pl-tag-box[id^='ATagBox08'], div[id^='ATagBox05'], div[id^='ATagBox10']"
    ) || openBtnEl;
    const id = triggerEl.id || "";
    let key = "";
    if (id.startsWith("TagBoxDropDown")) key = id.slice("TagBoxDropDown".length);
    else if (id.startsWith("ATagBox08")) key = id.slice("ATagBox08".length);
    else if (id.startsWith("ATagBox05")) key = id.slice("ATagBox05".length);
    else if (id.startsWith("ATagBox10")) key = id.slice("ATagBox10".length);
    const docsToSearch = (() => {
      const docs = [doc];
      if (document !== doc) docs.push(document);
      for (const d of candidateDocs()) {
        if (!docs.includes(d)) docs.push(d);
      }
      return docs;
    })();
    const openBtn = key ? docsToSearch.map((d) => d.querySelector(`button#TagBoxDropDown${CSS.escape(key)}`)).find((b) => b) : null;
    const fakeSelect = key ? docsToSearch.map((d) => d.querySelector(`pl-tag-box#ATagBox08${CSS.escape(key)} .fakeSelect`)).find((b) => b) : null;
    const openEl = openBtn || fakeSelect || openBtnEl;
    debug(log, `TagBox multi-select key: ${key}`);
    debug(log, `TagBox multi-select open element: ${describeEl(openEl)}`);
    await click(openEl);
    const findWrapper10 = () => key ? docsToSearch.map((d) => d.querySelector(`div#ATagBox10${CSS.escape(key)}`)).find((b) => b) : null;
    const findInputNow = () => {
      const all = [];
      if (key) {
        for (const d of docsToSearch) {
          all.push(...Array.from(d.querySelectorAll(`input#ATagBox01${CSS.escape(key)}`)));
        }
      }
      if (searchInputPrefix) {
        for (const d of docsToSearch) {
          all.push(...Array.from(d.querySelectorAll(`input[id^='${searchInputPrefix}']`)));
        }
      }
      return all.find((x) => isVisible(x)) || all[0] || null;
    };
    const findAnyTagNow = () => {
      const w10 = findWrapper10();
      if (!w10 || !key) return null;
      return w10.querySelector(`div[id^='ATagBox02#${CSS.escape(key)}#']`);
    };
    let tick = 0;
    const ready = await waitFor(() => {
      tick++;
      const input2 = findInputNow();
      if (input2) return { input: input2 };
      const anyTag = findAnyTagNow();
      if (anyTag) return { input: null };
      const reopenTarget = openBtn || openEl;
      reopenTarget.dispatchEvent?.(
        new (doc.defaultView || window).MouseEvent("click", { bubbles: true, cancelable: true })
      );
      if (CONFIG.DEBUG && tick % 6 === 0 && key) {
        const w10 = findWrapper10();
        const style = w10?.querySelector?.(".fakeDropDown")?.getAttribute?.("style") || "";
        debug(log, `TagBox multi-select wait: input=${input2 ? "yes" : "no"}, tag=${anyTag ? "yes" : "no"}, dd=${style}`);
      }
      return null;
    }, 2e4, 250, "TagBox multi-select input");
    const input = ready.input;
    if (input && !isVisible(input)) {
      debug(log, `TagBox multi-select input found but not visible: ${describeEl(input)}`);
    }
    if (input) debug(log, `TagBox multi-select input: ${describeEl(input)}`);
    const wrapper10 = findWrapper10();
    if (!wrapper10) {
      throw new Error(`Weighted price dropdown wrapper not found for key=${key}`);
    }
    const tagSel = key ? `div[id^='ATagBox02#${CSS.escape(key)}#']` : null;
    const clearFilter = async (inp) => {
      if (!inp) return;
      const view = inp.ownerDocument?.defaultView || window;
      inp.value = "";
      inp.dispatchEvent(new view.Event("input", { bubbles: true }));
      inp.dispatchEvent(new view.Event("change", { bubbles: true }));
      await sleep(200);
    };
    const ensureOpen = async () => {
      const target = openBtn || openEl;
      await click(target);
      return await waitFor(() => {
        const w10 = findWrapper10();
        const inp = findInputNow();
        const ddStyle = w10?.querySelector?.(".fakeDropDown")?.getAttribute?.("style") || "";
        const anyTag = tagSel ? w10?.querySelector?.(tagSel) : null;
        const open = /display\s*:\s*block/i.test(ddStyle) || !!anyTag;
        if (open && (inp || anyTag)) return { w10, inp };
        return null;
      }, 8800, 200, "Weighted dropdown open");
    };
    const findTagByText = (w10, text) => {
      if (!w10 || !tagSel) return null;
      const tags = Array.from(w10.querySelectorAll(tagSel));
      return tags.find((t2) => (t2.textContent || "").includes(text)) || null;
    };
    for (const text of optionTexts) {
      debug(log, `  Adding: ${text}`);
      const { w10, inp } = await ensureOpen();
      await clearFilter(inp);
      const parts = String(text).trim().split(/\s+/);
      const shortText = parts.length > 2 ? parts.slice(2).join(" ") : parts.slice(1).join(" ");
      let tag = findTagByText(w10, text) || findTagByText(w10, shortText);
      if (!tag && inp) {
        await typeIntoInput(inp, shortText);
        await sleep(CONFIG.WAIT_AFTER_INPUT);
        tag = findTagByText(w10, text) || findTagByText(w10, shortText);
      }
      if (!tag) {
        const tags = tagSel ? Array.from(w10.querySelectorAll(tagSel)).map((t2) => (t2.textContent || "").trim().replace(/\s+/g, " ")).filter(Boolean) : [];
        debug(log, `Weighted dropdown first tags: ${tags.slice(0, 12).join(" | ")}`);
        debug(log, `Weighted input value: ${inp ? JSON.stringify(inp.value) : "(no input)"}`);
        throw new Error(`Weighted price option not found: ${text}`);
      }
      tag.click();
      await sleep(600);
      await clearFilter(inp);
    }
    if (okBtnEl) {
      await click(okBtnEl);
      await sleep(CONFIG.WAIT_AFTER_SELECT);
    }
  }
  class PriceUnitBatchAddTool {
    constructor() {
      this.ui = null;
      this.state = {
        items: [],
        isRunning: false,
        currentIndex: 0,
        mode: "words-chars",
unitType: "words"
};
      this.init();
    }
    init() {
      if (window.self !== window.top) return;
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.createUI());
      } else {
        this.createUI();
      }
    }
    createUI() {
      if (document.getElementById(`${SCRIPT_ID}-panel`)) return;
      this.ui = createPriceUnitPanel({
        onAddBase: () => this.addBasePrices(),
        onAddWeighted: () => this.addWeightedPrices(),
        onSetPercent: () => this.setPercentages(),
        onMapCat: () => this.mapCatInterface(),
        onRunAll: () => this.runAll(),
        onAddBaseOther: () => this.addBasePricesOther(),
        onStop: () => this.stop(),
        onClose: () => {
        }
      });
      this.attachEvents();
      this.ui.setStatus(t("statusReady"));
      this.ui.syncButtonState(this.state);
    }
    attachEvents() {
      this.ui.valuesInput.addEventListener("input", () => {
        if (this.state.isRunning) return;
        this.refreshItems();
      });
      this.ui.panel.querySelectorAll('input[name="plba-mode"]').forEach((radio) => {
        radio.addEventListener("change", (e) => {
          this.state.mode = e.target.value;
          this.ui.toggleMode(this.state.mode);
          this.refreshItems();
        });
      });
      this.ui.panel.querySelectorAll('input[name="plba-unit-type"]').forEach((radio) => {
        radio.addEventListener("change", (e) => {
          this.state.unitType = e.target.value;
          this.refreshItems();
        });
      });
      if (this.ui.newDiscountCheckbox) {
        this.ui.newDiscountCheckbox.addEventListener("change", () => {
          this.ui.toggleNewDiscountRow(this.ui.newDiscountCheckbox.checked);
        });
      }
    }
    refreshItems() {
      this.state.items = this.parseItems(this.ui.valuesInput.value);
      this.ui.syncButtonState(this.state);
      if (this.state.items.length === 0) {
        this.ui.setStatus(t("statusNoData"));
      } else {
        this.ui.setStatus(t("statusReady"));
      }
    }
buildFullPriceName(code) {
      const prefix = this.state.unitType === "words" ? "Words" : "Chars";
      return `${prefix} ${code.trim()} New`;
    }
    parseItems(text) {
      const lines = text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
      if (this.state.mode === "words-chars") {
        return lines.map((code) => this.buildFullPriceName(code));
      }
      return lines;
    }
    stop() {
      if (!this.state.isRunning) return;
      this.state.isRunning = false;
      this.ui.syncButtonState(this.state);
    }
    generateWeightedNames(basePriceName, includeNewDiscount = false) {
      const suffixes = includeNewDiscount ? [...WEIGHTED_SUFFIXES, "New Discount"] : WEIGHTED_SUFFIXES;
      return suffixes.map(
        (suffix) => basePriceName.replace(/\bNew\b/gi, suffix)
      );
    }
    async addBasePrices() {
      if (this.state.isRunning) return;
      this.state.items = this.parseItems(this.ui.valuesInput.value || "");
      if (this.state.items.length === 0) {
        this.ui.setStatus(t("statusNoData"));
        return;
      }
      this.state.isRunning = true;
      this.state.currentIndex = 0;
      this.ui.syncButtonState(this.state);
      const sel = getSelectors();
      for (let i = 0; i < this.state.items.length; i++) {
        if (!this.state.isRunning) break;
        const basePriceName = this.state.items[i];
        this.state.currentIndex = i + 1;
        this.ui.setStatus(t("phaseAddingBase", { name: basePriceName }));
        try {
          const basePriceDropdown = await waitFor(
            () => qsAny(sel.basePriceDropdown),
            CONFIG.WAIT_FOR_DROPDOWN,
            500,
            "Base price dropdown"
          );
          if (!basePriceDropdown) {
            throw new Error("Base price dropdown not found");
          }
          await selectOneFromTagBox({
            dropBtnSel: basePriceDropdown,
            searchInputSel: sel.basePriceSearchInput,
            optionText: basePriceName,
            log: (msg) => debug(null, msg)
          });
          const okBtn = await waitFor(
            () => qsAny(sel.basePriceOkBtn),
            CONFIG.WAIT_FOR_DROPDOWN,
            500,
            "Base price OK button"
          );
          if (okBtn) {
            await click(okBtn);
            await sleep(1e3);
          }
          debug(null, `Added base price: ${basePriceName}`);
        } catch (err) {
          debug(null, `Error adding base price: ${basePriceName} ${err}`);
          this.ui.setStatus(t("statusError", { message: err.message }));
          this.state.isRunning = false;
          break;
        }
      }
      if (this.state.isRunning) {
        this.ui.setStatus(t("statusCompleted", { total: this.state.items.length }), "success");
      } else if (this.state.currentIndex > 0) {
        this.ui.setStatus(t("statusStopped", { current: this.state.currentIndex, total: this.state.items.length }));
      }
      this.state.isRunning = false;
      this.ui.syncButtonState(this.state);
    }
    async addWeightedPrices() {
      if (this.state.isRunning) return;
      this.state.items = this.parseItems(this.ui.valuesInput.value || "");
      if (this.state.items.length === 0) {
        this.ui.setStatus(t("statusNoData"));
        return;
      }
      this.state.isRunning = true;
      this.state.currentIndex = 0;
      this.ui.syncButtonState(this.state);
      for (let i = 0; i < this.state.items.length; i++) {
        if (!this.state.isRunning) break;
        const basePriceName = this.state.items[i];
        this.state.currentIndex = i + 1;
        this.ui.setStatus(t("phaseAddingWeighted", { name: basePriceName }));
        try {
          const qName = JSON.stringify(basePriceName);
          const baseRowXpath = `//tr[.//div[contains(@class,'ellipsis') and (normalize-space()=${qName} or contains(normalize-space(),${qName}))] or .//*[@aria-label=${qName}] or .//span[@aria-label=${qName}]]`;
          const baseRow = await waitFor(
            () => qx(baseRowXpath),
            CONFIG.WAIT_FOR_ELEMENT,
            300,
            `Base price row: ${basePriceName}`
          );
          if (!baseRow) {
            debug(null, `Base price row not found: ${basePriceName}`);
            continue;
          }
          const findWeightedControls2 = () => {
            const docs = typeof candidateDocs === "function" ? candidateDocs() : [document];
            for (const doc of docs) {
              const tables = doc.querySelectorAll("table");
              for (const table of tables) {
                const allRows = Array.from(table.querySelectorAll("tr"));
                let baseRowIndex = -1;
                for (let i2 = 0; i2 < allRows.length; i2++) {
                  const row = allRows[i2];
                  const ellipsisDiv = row.querySelector("div.ellipsis");
                  const boldSpan = row.querySelector("span.bold, td.bold, span[aria-label]");
                  const rowText = (ellipsisDiv?.textContent || boldSpan?.textContent || "").trim();
                  if (rowText === basePriceName) {
                    baseRowIndex = i2;
                    debug(null, `Found exact base row "${basePriceName}" at index ${i2} in table with ${allRows.length} rows`);
                    break;
                  }
                }
                if (baseRowIndex === -1) continue;
                for (let i2 = baseRowIndex + 1; i2 < allRows.length; i2++) {
                  const row = allRows[i2];
                  const dropBtn = row.querySelector("button[id^='TagBoxDropDownOutPPS29']") || row.querySelector("div[id^='ATagBox05OutPPS29'] .fakeSelect") || row.querySelector("pl-tag-box[id^='ATagBox08OutPPS29'] .fakeSelect");
                  const okBtn = row.querySelector("button[id^='OutPPS31']");
                  if (dropBtn && okBtn) {
                    debug(null, `Found controls at row ${i2}: dropBtn=${dropBtn.id}, okBtn=${okBtn.id}`);
                    return { dropBtn, okBtn };
                  }
                  const isBoldRow = row.classList?.contains("bold");
                  const ellipsisDiv = row.querySelector("div.ellipsis");
                  const cellText = (ellipsisDiv?.textContent || row.textContent || "").trim();
                  if (isBoldRow || cellText.endsWith("New") && cellText !== basePriceName) {
                    if (cellText !== basePriceName && cellText.endsWith("New")) {
                      debug(null, `Hit next base price "${cellText}" at row ${i2}, stopping`);
                      break;
                    }
                  }
                }
              }
            }
            debug(null, `No control row found for: ${basePriceName}`);
            return null;
          };
          const controls = await waitFor(findWeightedControls2, 8e3, 400, "Weighted price controls");
          if (!controls?.dropBtn || !controls?.okBtn) {
            debug(null, `Weighted price controls not found for: ${basePriceName}`);
            continue;
          }
          const dropBtnId = controls.dropBtn.id || "";
          let tagBoxKey = "";
          if (dropBtnId.startsWith("TagBoxDropDown")) {
            tagBoxKey = dropBtnId.slice("TagBoxDropDown".length);
          } else if (dropBtnId.startsWith("ATagBox05")) {
            tagBoxKey = dropBtnId.slice("ATagBox05".length);
          } else if (dropBtnId.startsWith("ATagBox08")) {
            tagBoxKey = dropBtnId.slice("ATagBox08".length);
          } else {
            tagBoxKey = dropBtnId.replace(/^(TagBoxDropDown|ATagBox\d+)/, "");
          }
          debug(null, `Extracted TagBox key: ${tagBoxKey}`);
          const includeNewDiscount = this.ui.newDiscountCheckbox?.checked || false;
          const weightedNames = this.generateWeightedNames(basePriceName, includeNewDiscount);
          debug(null, `Weighted names: ${weightedNames.join(", ")}`);
          await selectManyFromTagBox({
            openBtnEl: controls.dropBtn,
            searchInputPrefix: `ATagBox01${tagBoxKey}`,
            listIdPrefix: `ATagBox02#${tagBoxKey}#`,
            optionTexts: weightedNames,
            okBtnEl: controls.okBtn,
            log: (msg) => debug(null, msg)
          });
          await sleep(800);
          debug(null, `Added weighted prices for: ${basePriceName}`);
          this.ui.setStatus(t("phaseSettingUnitPrice", { name: basePriceName }));
          await this.setUnitPriceForNew(basePriceName);
        } catch (err) {
          debug(null, `Error adding weighted prices: ${basePriceName} ${err}`);
        }
      }
      if (this.state.isRunning) {
        this.ui.setStatus(t("statusCompleted", { total: this.state.items.length }), "success");
      } else {
        this.ui.setStatus(t("statusStopped", { current: this.state.currentIndex, total: this.state.items.length }));
      }
      this.state.isRunning = false;
      this.ui.syncButtonState(this.state);
    }
    async mapCatInterface() {
      if (this.state.isRunning) return;
      this.state.isRunning = true;
      this.ui.syncButtonState(this.state);
      this.ui.setStatus(t("phaseMappingCat"));
      try {
        const sel = getSelectors();
        const includeNewDiscount = this.ui.newDiscountCheckbox?.checked || false;
        const mappedCount = await mapAllCatInterfaceRows({
          memoQBtnSelector: sel.memoQManagerBtn,
          log: (msg) => debug(null, msg),
          skipNewWhenNewDiscount: includeNewDiscount
        });
        this.ui.setStatus(t("statusCompleted", { total: mappedCount }), "success");
      } catch (err) {
        debug(null, `Error mapping CAT interface: ${err}`);
        this.ui.setStatus(t("statusError", { message: err.message }));
      }
      this.state.isRunning = false;
      this.ui.syncButtonState(this.state);
    }
async setUnitPriceForNew(basePriceName) {
      const qName = JSON.stringify(basePriceName);
      const baseRowXpath = `//tr[(.//div[contains(@class,'ellipsis') and
      (normalize-space()=${qName} or contains(normalize-space(),${qName}))]
      or .//*[@aria-label=${qName}])
      and .//input[contains(@id,'OutPPS28')]]`;
      try {
        const baseRow = await waitFor(() => qx(baseRowXpath), CONFIG.WAIT_FOR_ELEMENT, 300);
        if (!baseRow) {
          debug(null, `Unit price row not found for: ${basePriceName}`);
          return false;
        }
        const unitInputs = baseRow.querySelectorAll("input[id^='+inp+OutPPS28']");
        for (const inp of unitInputs) {
          setNativeValue(inp, "1");
          await sleep(60);
        }
        debug(null, `Set unit price to 1 for: ${basePriceName}`);
        return true;
      } catch (err) {
        debug(null, `Error setting unit price for ${basePriceName}: ${err}`);
        return false;
      }
    }
async setPercentageForRow(weightedName, percentage) {
      const qW = JSON.stringify(weightedName);
      const rowXpath = `//tr[.//div[contains(@class,'ellipsis') and
      (normalize-space()=${qW} or contains(normalize-space(),${qW}))]
      or .//*[@aria-label=${qW}] or .//span[@aria-label=${qW}]]`;
      await waitFor(() => qx(rowXpath), CONFIG.WAIT_FOR_DROPDOWN, 300, `Weighted row: ${weightedName}`).catch(() => null);
      const rows = qxAll(rowXpath);
      const inputs = [];
      for (const row of rows) {
        const inps = row.querySelectorAll("input[id^='+inp+OutPPS26']");
        if (inps.length === 1) {
          inputs.push(inps[0]);
        }
      }
      if (inputs.length === 0) {
        debug(null, `WARN: Weighting input not found for: ${weightedName}`);
        return false;
      }
      for (const inp of inputs) {
        try {
          inp.focus();
        } catch {
        }
        setNativeValue(inp, String(percentage));
        try {
          inp.blur();
        } catch {
        }
        await sleep(20);
      }
      await sleep(180);
      debug(null, `Set ${percentage}% for: ${weightedName}`);
      return true;
    }
async setPercentages() {
      if (this.state.isRunning) return;
      this.state.items = this.parseItems(this.ui.valuesInput.value || "");
      if (this.state.items.length === 0) {
        this.ui.setStatus(t("statusNoData"));
        return;
      }
      this.state.isRunning = true;
      this.ui.syncButtonState(this.state);
      const includeNewDiscount = this.ui.newDiscountCheckbox?.checked || false;
      const fuzzyValues = this.ui.getFuzzyValues(includeNewDiscount);
      if (fuzzyValues.length === 0) {
        this.ui.setStatus(t("statusNoData"));
        this.state.isRunning = false;
        this.ui.syncButtonState(this.state);
        return;
      }
      for (const basePriceName of this.state.items) {
        if (!this.state.isRunning) break;
        for (const { suffix, percentage } of fuzzyValues) {
          if (!this.state.isRunning) break;
          const weightedName = basePriceName.replace(/\bNew\b/gi, suffix);
          this.ui.setStatus(t("phaseSettingPercentages", { name: weightedName }));
          await this.setPercentageForRow(weightedName, percentage);
        }
      }
      if (this.state.isRunning) {
        this.ui.setStatus(t("statusCompleted", { total: this.state.items.length }), "success");
      }
      this.state.isRunning = false;
      this.ui.syncButtonState(this.state);
    }
async runAll() {
      if (this.state.isRunning) return;
      this.state.items = this.parseItems(this.ui.valuesInput.value || "");
      if (this.state.items.length === 0) {
        this.ui.setStatus(t("statusNoData"));
        return;
      }
      this.state.isRunning = true;
      this.ui.syncButtonState(this.state);
      try {
        await this.addBasePricesInternal();
        if (!this.state.isRunning) return;
        await this.addWeightedPricesInternal();
        if (!this.state.isRunning) return;
        await this.setPercentagesInternal();
        if (!this.state.isRunning) return;
        await this.mapCatInterfaceInternal();
        this.ui.setStatus(t("statusCompleted", { total: this.state.items.length }), "success");
      } catch (err) {
        debug(null, `Error in runAll: ${err}`);
        this.ui.setStatus(t("statusError", { message: err.message }));
      }
      this.state.isRunning = false;
      this.ui.syncButtonState(this.state);
    }
async addBasePricesOther() {
      if (this.state.isRunning) return;
      this.state.items = this.parseItems(this.ui.valuesInput.value || "");
      if (this.state.items.length === 0) {
        this.ui.setStatus(t("statusNoData"));
        return;
      }
      this.state.isRunning = true;
      this.state.currentIndex = 0;
      this.ui.syncButtonState(this.state);
      const sel = getSelectors();
      for (let i = 0; i < this.state.items.length; i++) {
        if (!this.state.isRunning) break;
        const basePriceName = this.state.items[i];
        this.state.currentIndex = i + 1;
        this.ui.setStatus(t("phaseAddingBase", { name: basePriceName }));
        try {
          const basePriceDropdown = await waitFor(
            () => qsAny(sel.basePriceDropdown),
            CONFIG.WAIT_FOR_DROPDOWN,
            500,
            "Base price dropdown"
          );
          if (!basePriceDropdown) {
            throw new Error("Base price dropdown not found");
          }
          await selectOneFromTagBox({
            dropBtnSel: basePriceDropdown,
            searchInputSel: sel.basePriceSearchInput,
            optionText: basePriceName,
            log: (msg) => debug(null, msg)
          });
          const okBtn = await waitFor(
            () => qsAny(sel.basePriceOkBtn),
            CONFIG.WAIT_FOR_DROPDOWN,
            500,
            "Base price OK button"
          );
          if (okBtn) {
            await click(okBtn);
            await sleep(1e3);
          }
          debug(null, `Added base price: ${basePriceName}`);
          this.ui.setStatus(t("phaseSettingUnitPrice", { name: basePriceName }));
          await this.setUnitPriceForNew(basePriceName);
        } catch (err) {
          debug(null, `Error adding base price: ${basePriceName} ${err}`);
          this.ui.setStatus(t("statusError", { message: err.message }));
          this.state.isRunning = false;
          break;
        }
      }
      if (this.state.isRunning) {
        this.ui.setStatus(t("statusCompleted", { total: this.state.items.length }), "success");
      } else if (this.state.currentIndex > 0) {
        this.ui.setStatus(t("statusStopped", { current: this.state.currentIndex, total: this.state.items.length }));
      }
      this.state.isRunning = false;
      this.ui.syncButtonState(this.state);
    }
async addBasePricesInternal() {
      const sel = getSelectors();
      for (let i = 0; i < this.state.items.length; i++) {
        if (!this.state.isRunning) break;
        const basePriceName = this.state.items[i];
        this.state.currentIndex = i + 1;
        this.ui.setStatus(t("phaseAddingBase", { name: basePriceName }));
        const basePriceDropdown = await waitFor(
          () => qsAny(sel.basePriceDropdown),
          CONFIG.WAIT_FOR_DROPDOWN,
          500,
          "Base price dropdown"
        );
        if (!basePriceDropdown) {
          throw new Error("Base price dropdown not found");
        }
        await selectOneFromTagBox({
          dropBtnSel: basePriceDropdown,
          searchInputSel: sel.basePriceSearchInput,
          optionText: basePriceName,
          log: (msg) => debug(null, msg)
        });
        const okBtn = await waitFor(
          () => qsAny(sel.basePriceOkBtn),
          CONFIG.WAIT_FOR_DROPDOWN,
          500,
          "Base price OK button"
        );
        if (okBtn) {
          await click(okBtn);
          await sleep(1e3);
        }
        debug(null, `Added base price: ${basePriceName}`);
      }
    }
    async addWeightedPricesInternal() {
      for (let i = 0; i < this.state.items.length; i++) {
        if (!this.state.isRunning) break;
        const basePriceName = this.state.items[i];
        this.state.currentIndex = i + 1;
        this.ui.setStatus(t("phaseAddingWeighted", { name: basePriceName }));
        const qName = JSON.stringify(basePriceName);
        const baseRowXpath = `//tr[.//div[contains(@class,'ellipsis') and (normalize-space()=${qName} or contains(normalize-space(),${qName}))] or .//*[@aria-label=${qName}] or .//span[@aria-label=${qName}]]`;
        const baseRow = await waitFor(
          () => qx(baseRowXpath),
          CONFIG.WAIT_FOR_ELEMENT,
          300,
          `Base price row: ${basePriceName}`
        );
        if (!baseRow) {
          debug(null, `Base price row not found: ${basePriceName}`);
          continue;
        }
        const findWeightedControls2 = () => {
          const docs = typeof candidateDocs === "function" ? candidateDocs() : [document];
          for (const doc of docs) {
            const tables = doc.querySelectorAll("table");
            for (const table of tables) {
              const allRows = Array.from(table.querySelectorAll("tr"));
              let baseRowIndex = -1;
              for (let i2 = 0; i2 < allRows.length; i2++) {
                const row = allRows[i2];
                const ellipsisDiv = row.querySelector("div.ellipsis");
                const boldSpan = row.querySelector("span.bold, td.bold, span[aria-label]");
                const rowText = (ellipsisDiv?.textContent || boldSpan?.textContent || "").trim();
                if (rowText === basePriceName) {
                  baseRowIndex = i2;
                  break;
                }
              }
              if (baseRowIndex === -1) continue;
              for (let i2 = baseRowIndex + 1; i2 < allRows.length; i2++) {
                const row = allRows[i2];
                const dropBtn = row.querySelector("button[id^='TagBoxDropDownOutPPS29']") || row.querySelector("div[id^='ATagBox05OutPPS29'] .fakeSelect") || row.querySelector("pl-tag-box[id^='ATagBox08OutPPS29'] .fakeSelect");
                const okBtn = row.querySelector("button[id^='OutPPS31']");
                if (dropBtn && okBtn) {
                  return { dropBtn, okBtn };
                }
                const ellipsisDiv = row.querySelector("div.ellipsis");
                const cellText = (ellipsisDiv?.textContent || row.textContent || "").trim();
                if (cellText.endsWith("New") && cellText !== basePriceName) {
                  break;
                }
              }
            }
          }
          return null;
        };
        const controls = await waitFor(findWeightedControls2, 8e3, 400, "Weighted price controls");
        if (!controls?.dropBtn || !controls?.okBtn) {
          debug(null, `Weighted price controls not found for: ${basePriceName}`);
          continue;
        }
        const dropBtnId = controls.dropBtn.id || "";
        let tagBoxKey = "";
        if (dropBtnId.startsWith("TagBoxDropDown")) {
          tagBoxKey = dropBtnId.slice("TagBoxDropDown".length);
        } else if (dropBtnId.startsWith("ATagBox05")) {
          tagBoxKey = dropBtnId.slice("ATagBox05".length);
        } else if (dropBtnId.startsWith("ATagBox08")) {
          tagBoxKey = dropBtnId.slice("ATagBox08".length);
        } else {
          tagBoxKey = dropBtnId.replace(/^(TagBoxDropDown|ATagBox\d+)/, "");
        }
        const includeNewDiscount = this.ui.newDiscountCheckbox?.checked || false;
        const weightedNames = this.generateWeightedNames(basePriceName, includeNewDiscount);
        await selectManyFromTagBox({
          openBtnEl: controls.dropBtn,
          searchInputPrefix: `ATagBox01${tagBoxKey}`,
          listIdPrefix: `ATagBox02#${tagBoxKey}#`,
          optionTexts: weightedNames,
          okBtnEl: controls.okBtn,
          log: (msg) => debug(null, msg)
        });
        await sleep(800);
        this.ui.setStatus(t("phaseSettingUnitPrice", { name: basePriceName }));
        await this.setUnitPriceForNew(basePriceName);
      }
    }
    async setPercentagesInternal() {
      const includeNewDiscount = this.ui.newDiscountCheckbox?.checked || false;
      const fuzzyValues = this.ui.getFuzzyValues(includeNewDiscount);
      for (const basePriceName of this.state.items) {
        if (!this.state.isRunning) break;
        for (const { suffix, percentage } of fuzzyValues) {
          if (!this.state.isRunning) break;
          const weightedName = basePriceName.replace(/\bNew\b/gi, suffix);
          this.ui.setStatus(t("phaseSettingPercentages", { name: weightedName }));
          await this.setPercentageForRow(weightedName, percentage);
        }
      }
      await sleep(500);
    }
    async mapCatInterfaceInternal() {
      this.ui.setStatus(t("phaseMappingCat"));
      const sel = getSelectors();
      const includeNewDiscount = this.ui.newDiscountCheckbox?.checked || false;
      await mapAllCatInterfaceRows({
        memoQBtnSelector: sel.memoQManagerBtn,
        log: (msg) => debug(null, msg),
        skipNewWhenNewDiscount: includeNewDiscount
      });
    }
  }
  new PriceUnitBatchAddTool();
  const FEATURE_DEFS = MODULE_REGISTRY;
  const DOCK_ICON_SIZE = 32;
  const DOCK_ICON_GAP = 6;
  const DOCK_TOP_OFFSET = 105;
  const STORAGE_KEY_PREFIX = "plunet-simple-suite";
  const STORAGE_KEY_ACTIVE_MODULES = `${STORAGE_KEY_PREFIX}-active-modules`;
  const STORAGE_KEY_PANEL_POSITIONS = `${STORAGE_KEY_PREFIX}-panel-positions`;
  const STORAGE_KEY_MODULE_STATES = `${STORAGE_KEY_PREFIX}-module-states`;
  const RESTORE_ATTEMPTS = 12;
  const SUITE_CONTROL_BTN_STYLE = `
  background: transparent;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
`;
  function getStoredActiveModules() {
    try {
      const data = window.localStorage?.getItem(STORAGE_KEY_ACTIVE_MODULES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
  function setStoredActiveModules(moduleIds) {
    try {
      window.localStorage?.setItem(STORAGE_KEY_ACTIVE_MODULES, JSON.stringify(moduleIds));
    } catch {
    }
  }
  function getStoredPanelPositions() {
    try {
      const data = window.localStorage?.getItem(STORAGE_KEY_PANEL_POSITIONS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }
  function setStoredPanelPosition(panelId, position) {
    try {
      const positions = getStoredPanelPositions();
      positions[panelId] = position;
      window.localStorage?.setItem(STORAGE_KEY_PANEL_POSITIONS, JSON.stringify(positions));
    } catch {
    }
  }
  function getStoredModuleStates() {
    try {
      const data = window.localStorage?.getItem(STORAGE_KEY_MODULE_STATES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }
  function setStoredModuleState(moduleId, state) {
    try {
      const states = getStoredModuleStates();
      if (state === "closed") {
        delete states[moduleId];
      } else {
        states[moduleId] = state;
      }
      window.localStorage?.setItem(STORAGE_KEY_MODULE_STATES, JSON.stringify(states));
    } catch {
    }
  }
  function adjustColor(hex, amount) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, (num >> 8 & 255) + amount));
    const b = Math.min(255, Math.max(0, (num & 255) + amount));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
  }
  function mountSuite() {
    if (window.self !== window.top) return;
    if (document.getElementById(`${SCRIPT_ID$3}-panel`)) return;
    injectSuiteStyles();
    const activeModules = new Set(getStoredActiveModules());
    let frontModuleId = null;
    const injectedPanels = new Set();
    const dockContainer = document.createElement("div");
    dockContainer.id = `${SCRIPT_ID$3}-dock`;
    dockContainer.style.cssText = `
    position: fixed;
    top: ${DOCK_TOP_OFFSET}px;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: ${DOCK_ICON_GAP}px;
    z-index: 999996;
  `;
    const dockIcons = new Map();
    FEATURE_DEFS.forEach((feature) => {
      const icon = document.createElement("button");
      icon.id = `${SCRIPT_ID$3}-dock-${feature.id}`;
      icon.title = t$3(feature.labelKey);
      icon.textContent = feature.iconLabel;
      icon.style.cssText = `
      width: ${DOCK_ICON_SIZE}px;
      height: ${DOCK_ICON_SIZE}px;
      border-radius: ${DOCK_ICON_SIZE / 2}px 0 0 ${DOCK_ICON_SIZE / 2}px;
      border: none;
      background: linear-gradient(135deg, ${feature.iconColor} 0%, ${adjustColor(feature.iconColor, -30)} 100%);
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: transform 0.15s, box-shadow 0.15s;
    `;
      icon.addEventListener("mouseenter", () => {
        icon.style.transform = "translateX(-3px)";
      });
      icon.addEventListener("mouseleave", () => {
        icon.style.transform = "translateX(0)";
      });
      dockContainer.appendChild(icon);
      dockIcons.set(feature.id, icon);
    });
    const toggleBtn = document.createElement("button");
    toggleBtn.id = `${SCRIPT_ID$3}-toggle`;
    toggleBtn.title = t$3("toggleTitle");
    toggleBtn.textContent = t$3("toggleButtonLabel");
    const panel = document.createElement("div");
    panel.id = `${SCRIPT_ID$3}-panel`;
    panel.style.position = "fixed";
    panel.style.right = "50px";
    panel.style.bottom = "clamp(12px, 2vw, 18px)";
    panel.style.zIndex = "999998";
    panel.style.padding = "10px";
    const minimizeBtn = document.createElement("button");
    minimizeBtn.type = "button";
    minimizeBtn.title = t$3("minimizeTitle");
    minimizeBtn.className = "ps-ghost-btn";
    minimizeBtn.textContent = t$3("minimizeButtonLabel");
    minimizeBtn.style.fontSize = "13px";
    minimizeBtn.style.lineHeight = "1";
    minimizeBtn.style.padding = "1px 7px";
    minimizeBtn.style.borderRadius = "7px";
    const refreshBtn = document.createElement("button");
    refreshBtn.type = "button";
    refreshBtn.className = "ps-ghost-btn";
    refreshBtn.textContent = t$3("refreshButtonLabel");
    refreshBtn.style.fontSize = "10px";
    refreshBtn.style.padding = "3px 8px";
    const header = document.createElement("div");
    header.id = `${SCRIPT_ID$3}-panel-header`;
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.gap = "8px";
    header.style.fontWeight = "600";
    header.style.fontSize = "13px";
    header.style.margin = "-10px -10px 8px";
    header.style.padding = "8px 10px";
    header.style.borderRadius = "9px 9px 7px 7px";
    const titleWrap = document.createElement("div");
    titleWrap.style.display = "flex";
    titleWrap.style.alignItems = "baseline";
    titleWrap.style.gap = "6px";
    titleWrap.appendChild(document.createTextNode(t$3("panelTitle")));
    const versionLabel = document.createElement("span");
    versionLabel.style.fontWeight = "500";
    versionLabel.style.fontSize = "10px";
    versionLabel.style.color = "var(--ps-muted)";
    versionLabel.textContent = t$3("versionLabel", { version: SCRIPT_VERSION$3 });
    titleWrap.appendChild(versionLabel);
    const headerActions = document.createElement("div");
    headerActions.style.display = "flex";
    headerActions.style.alignItems = "center";
    headerActions.style.gap = "6px";
    headerActions.appendChild(refreshBtn);
    headerActions.appendChild(minimizeBtn);
    header.appendChild(titleWrap);
    header.appendChild(headerActions);
    const body = document.createElement("div");
    const statusEl = createStatusElement();
    const featureRows = new Map();
    const categorizedModules = getCategorizedModules();
    categorizedModules.forEach(({ category, modules }) => {
      if (modules.length === 0) return;
      const categoryHeader = document.createElement("div");
      categoryHeader.className = "ps-category-header";
      categoryHeader.style.cssText = `
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 10px 0 6px 0;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--pa-border);
    `;
      const categoryIcon = document.createElement("span");
      categoryIcon.textContent = category.icon;
      categoryIcon.style.fontSize = "14px";
      const categoryTitle = document.createElement("span");
      categoryTitle.className = "ps-category-title";
      categoryTitle.style.cssText = `
      font-weight: 600;
      font-size: 11px;
      color: var(--pa-ink);
    `;
      categoryTitle.textContent = t$3(category.labelKey);
      const categoryDesc = document.createElement("span");
      categoryDesc.className = "ps-category-desc";
      categoryDesc.style.cssText = `
      font-size: 10px;
      color: var(--pa-muted);
      margin-left: auto;
    `;
      categoryDesc.textContent = t$3(category.descriptionKey);
      categoryHeader.appendChild(categoryIcon);
      categoryHeader.appendChild(categoryTitle);
      categoryHeader.appendChild(categoryDesc);
      body.appendChild(categoryHeader);
      const moduleList = document.createElement("div");
      moduleList.className = "ps-module-list";
      moduleList.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: 8px;
    `;
      modules.forEach((feature) => {
        const row = document.createElement("div");
        row.className = "ps-feature-row";
        row.dataset.featureId = feature.id;
        row.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 5px 0;
        border-bottom: 1px dashed var(--pa-border-dashed);
      `;
        const meta = document.createElement("div");
        meta.style.cssText = "flex: 1; min-width: 0;";
        const nameRow = document.createElement("div");
        nameRow.style.cssText = "display: flex; align-items: center; gap: 6px;";
        const iconBadge = document.createElement("span");
        iconBadge.className = "ps-module-icon";
        iconBadge.textContent = feature.iconLabel;
        iconBadge.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 4px;
        background: ${feature.iconColor};
        color: #fff;
        font-size: 9px;
        font-weight: 700;
        flex-shrink: 0;
      `;
        const name = document.createElement("div");
        name.className = "ps-feature-name";
        name.style.cssText = "font-weight: 600; font-size: 12px;";
        name.textContent = t$3(feature.labelKey);
        nameRow.appendChild(iconBadge);
        nameRow.appendChild(name);
        const featureStatus = document.createElement("div");
        featureStatus.className = "ps-feature-status";
        featureStatus.style.cssText = "font-size: 10px; color: var(--pa-muted);";
        featureStatus.textContent = t$3("featureUnknown");
        meta.appendChild(nameRow);
        meta.appendChild(featureStatus);
        const actionBtn = document.createElement("button");
        actionBtn.type = "button";
        actionBtn.className = "ps-primary-btn";
        actionBtn.textContent = t$3("openFeature");
        actionBtn.style.padding = "4px 10px";
        row.appendChild(meta);
        row.appendChild(actionBtn);
        moduleList.appendChild(row);
        featureRows.set(feature.id, { statusEl: featureStatus, button: actionBtn, def: feature });
      });
      body.appendChild(moduleList);
    });
    body.appendChild(statusEl);
    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);
    document.body.appendChild(dockContainer);
    panel.style.display = "none";
    toggleBtn.style.display = "flex";
    minimizeBtn.addEventListener("click", () => {
      panel.style.display = "none";
      toggleBtn.style.display = "flex";
    });
    toggleBtn.addEventListener("click", () => {
      panel.style.display = "block";
      toggleBtn.style.display = "none";
      refreshAvailability();
    });
    makeDraggable(panel, header, { ignoreSelector: "button" });
    function setSuiteStatus(message) {
      statusEl.textContent = message;
    }
    function updateDock() {
      FEATURE_DEFS.forEach((feature) => {
        const icon = dockIcons.get(feature.id);
        if (!icon) return;
        const isActive = activeModules.has(feature.id);
        const isFront = frontModuleId === feature.id;
        if (isActive) {
          icon.style.display = "flex";
          if (isFront) {
            icon.style.opacity = "1";
            icon.style.boxShadow = `0 0 0 2px #fff, 0 2px 8px rgba(0, 0, 0, 0.35)`;
          } else {
            icon.style.opacity = "0.7";
            icon.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.25)";
          }
        } else {
          icon.style.display = "none";
        }
      });
      setStoredActiveModules([...activeModules]);
    }
    function minimizeModule(featureId) {
      const feature = FEATURE_DEFS.find((f) => f.id === featureId);
      if (!feature) return;
      const panelEl = document.getElementById(feature.panelId);
      if (panelEl) {
        panelEl.style.display = "none";
      }
      setStoredModuleState(featureId, "minimized");
      if (frontModuleId === featureId) {
        frontModuleId = null;
        const otherActive = [...activeModules].filter((id) => id !== featureId);
        if (otherActive.length > 0) {
          bringToFront(otherActive[otherActive.length - 1]);
        }
      }
      updateDock();
      refreshAvailability();
    }
    function closeModule(featureId) {
      const feature = FEATURE_DEFS.find((f) => f.id === featureId);
      if (!feature) return;
      const panelEl = document.getElementById(feature.panelId);
      if (panelEl) {
        panelEl.style.display = "none";
      }
      activeModules.delete(featureId);
      setStoredModuleState(featureId, "closed");
      if (frontModuleId === featureId) {
        frontModuleId = null;
        if (activeModules.size > 0) {
          const nextId = [...activeModules][activeModules.size - 1];
          bringToFront(nextId);
        }
      }
      updateDock();
      setSuiteStatus(t$3("statusReady"));
      refreshAvailability();
    }
    function injectSuiteControls(feature) {
      if (injectedPanels.has(feature.id)) return;
      const panelEl = document.getElementById(feature.panelId);
      if (!panelEl) return;
      const headerEl = panelEl.querySelector(feature.headerSelector);
      if (!headerEl) return;
      makeDraggable(panelEl, headerEl, {
        ignoreSelector: "button, .suite-controls",
        onDragEnd: (position) => {
          setStoredPanelPosition(feature.panelId, position);
        }
      });
      const savedPositions = getStoredPanelPositions();
      if (savedPositions[feature.panelId]) {
        restorePosition(panelEl, savedPositions[feature.panelId]);
      }
      let actionsContainer = headerEl.querySelector(".suite-controls");
      if (!actionsContainer) {
        const existingClose = headerEl.querySelector("button");
        if (existingClose) {
          actionsContainer = existingClose.parentElement;
        } else {
          actionsContainer = document.createElement("div");
          actionsContainer.style.cssText = "display: flex; align-items: center; gap: 4px; margin-left: auto;";
          headerEl.appendChild(actionsContainer);
        }
      }
      const existingButtons = actionsContainer.querySelectorAll("button");
      existingButtons.forEach((btn) => {
        if (btn.dataset.size) return;
        if (btn.closest(".plc-font-size-selector")) return;
        btn.style.display = "none";
      });
      const suiteControls = document.createElement("div");
      suiteControls.className = "suite-controls";
      suiteControls.style.cssText = "display: flex; align-items: center; gap: 2px;";
      const minBtn = document.createElement("button");
      minBtn.type = "button";
      minBtn.title = t$3("minimizeTooltip") || "Minimize to dock";
      minBtn.innerHTML = "&#x2013;";
      minBtn.style.cssText = SUITE_CONTROL_BTN_STYLE;
      minBtn.addEventListener("mouseenter", () => {
        minBtn.style.background = "rgba(0,0,0,0.08)";
      });
      minBtn.addEventListener("mouseleave", () => {
        minBtn.style.background = "transparent";
      });
      minBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        minimizeModule(feature.id);
      });
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.title = t$3("closeTooltip") || "Close";
      closeBtn.innerHTML = "&times;";
      closeBtn.style.cssText = SUITE_CONTROL_BTN_STYLE;
      closeBtn.addEventListener("mouseenter", () => {
        closeBtn.style.background = "rgba(200,0,0,0.1)";
        closeBtn.style.color = "#c00";
      });
      closeBtn.addEventListener("mouseleave", () => {
        closeBtn.style.background = "transparent";
        closeBtn.style.color = "#666";
      });
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeModule(feature.id);
      });
      suiteControls.appendChild(minBtn);
      suiteControls.appendChild(closeBtn);
      actionsContainer.appendChild(suiteControls);
      injectedPanels.add(feature.id);
    }
    function bringToFront(featureId) {
      const feature = FEATURE_DEFS.find((f) => f.id === featureId);
      if (!feature) return;
      const panelEl = document.getElementById(feature.panelId);
      if (!panelEl) return;
      injectSuiteControls(feature);
      FEATURE_DEFS.forEach((f) => {
        if (f.id !== featureId && activeModules.has(f.id)) {
          const p = document.getElementById(f.panelId);
          if (p && p.style.display !== "none") {
            p.style.display = "none";
            setStoredModuleState(f.id, "minimized");
          }
        }
      });
      panelEl.style.display = "block";
      frontModuleId = featureId;
      setStoredModuleState(featureId, "open");
      updateDock();
      refreshAvailability();
    }
    function openFeature(feature) {
      const panelEl = document.getElementById(feature.panelId);
      if (!panelEl) {
        setSuiteStatus(t$3("statusUnavailable", { feature: t$3(feature.labelKey) }));
        return;
      }
      activeModules.add(feature.id);
      bringToFront(feature.id);
      setSuiteStatus(t$3("statusOpened", { feature: t$3(feature.labelKey) }));
      panel.style.display = "none";
      toggleBtn.style.display = "flex";
    }
    function toggleFeature(feature) {
      const panelEl = document.getElementById(feature.panelId);
      if (!panelEl) {
        setSuiteStatus(t$3("statusUnavailable", { feature: t$3(feature.labelKey) }));
        return;
      }
      if (activeModules.has(feature.id) && frontModuleId === feature.id) {
        closeModule(feature.id);
      } else if (activeModules.has(feature.id)) {
        bringToFront(feature.id);
        panel.style.display = "none";
        toggleBtn.style.display = "flex";
      } else {
        openFeature(feature);
      }
    }
    dockIcons.forEach((icon, featureId) => {
      icon.addEventListener("click", () => {
        bringToFront(featureId);
      });
    });
    function tryRestoreModuleStates(attempt = 0) {
      const storedStates = getStoredModuleStates();
      const moduleIds = Object.keys(storedStates);
      if (moduleIds.length === 0) {
        if (attempt < RESTORE_ATTEMPTS) {
          window.setTimeout(() => tryRestoreModuleStates(attempt + 1), 500);
        }
        return;
      }
      let allPanelsReady = true;
      let openModuleId = null;
      for (const moduleId of moduleIds) {
        const def = FEATURE_DEFS.find((f) => f.id === moduleId);
        if (!def) continue;
        const panelEl = document.getElementById(def.panelId);
        if (!panelEl) {
          allPanelsReady = false;
          break;
        }
      }
      if (!allPanelsReady) {
        if (attempt < RESTORE_ATTEMPTS) {
          window.setTimeout(() => tryRestoreModuleStates(attempt + 1), 500);
        }
        return;
      }
      for (const moduleId of moduleIds) {
        const state = storedStates[moduleId];
        const def = FEATURE_DEFS.find((f) => f.id === moduleId);
        if (!def) continue;
        const panelEl = document.getElementById(def.panelId);
        if (!panelEl) continue;
        activeModules.add(moduleId);
        injectSuiteControls(def);
        if (state === "open") {
          openModuleId = moduleId;
        }
      }
      if (openModuleId) {
        bringToFront(openModuleId);
      }
      updateDock();
      refreshAvailability();
    }
    function refreshAvailability() {
      FEATURE_DEFS.forEach((feature) => {
        const row = featureRows.get(feature.id);
        if (!row) return;
        const panelEl = document.getElementById(feature.panelId);
        if (!panelEl) {
          row.statusEl.textContent = t$3("featureUnavailable");
          row.button.disabled = true;
          row.button.textContent = t$3("openFeature");
          return;
        }
        injectSuiteControls(feature);
        const isActive = activeModules.has(feature.id);
        const isFront = frontModuleId === feature.id;
        row.statusEl.textContent = t$3("featureReady");
        row.button.disabled = false;
        if (isActive && isFront) {
          row.button.textContent = t$3("hideFeature");
        } else if (isActive) {
          row.button.textContent = t$3("showFeature") || "Show";
        } else {
          row.button.textContent = t$3("openFeature");
        }
      });
    }
    featureRows.forEach((row) => {
      row.button.addEventListener("click", () => {
        toggleFeature(row.def);
      });
    });
    refreshBtn.addEventListener("click", () => {
      refreshAvailability();
      setSuiteStatus(t$3("statusReady"));
    });
    window.addEventListener("hashchange", () => {
      refreshAvailability();
    });
    setTimeout(() => {
      refreshAvailability();
      tryRestoreModuleStates();
      updateDock();
    }, 600);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountSuite);
  } else {
    mountSuite();
  }

})();