// ==UserScript==
// @name         论坛屏蔽
// @version      1.4.4
// @description  通用的论坛贴子/用户屏蔽工具
// @author       Heavrnl
// @match        http://20.78.120.16/*
// @match        https://rain36-vip.japaneast.cloudapp.azure.com/*
// @match        https://36rain.vip/*
// @icon
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license       MIT
// @run-at       document-start
// @homepageURL  https://gf.qytechs.cn/zh-CN/scripts/547827-%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD
// @namespace https://greasyfork.org/users/1286771
// @downloadURL https://update.greasyfork.org/scripts/547827/%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/547827/%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
(function () {
  "use strict";
  if (window.top !== window.self) {
    return;
  }

  // 调试输出过滤：默认隐藏带有"[屏蔽插件调试]"标签的日志
  (function setupDebugLogFilter() {
    try {
      const originalLog = console.log.bind(console);
      console.log = function (...args) {
        try {
          const enabled =
            typeof GM_getValue === "function"
              ? GM_getValue("debugLogs", false)
              : false;
          if (
            !enabled &&
            args &&
            typeof args[0] === "string" &&
            args[0].includes("[屏蔽插件调试]")
          ) {
            return;
          }
        } catch (e) {
          // 忽略过滤过程中的异常，回退到原始输出
        }
        return originalLog(...args);
      };
    } catch (e) {
      // 忽略初始化失败
    }
  })();

  // 内置CSS（第1批）：设计令牌与主面板基础样式（保留外部样式，逐步迁移）
  try {
    const embeddedCss = `
/* ========================================
   通用论坛屏蔽插件 CSS 样式表
   ======================================== */

/* ========================================
   0. 设计令牌（CSS 变量，提供回退，不改变视觉）
   ======================================== */
:root {
  /* 主色（Material Blue） */
  --color-primary: #2196f3;
  --color-primary-600: #1e88e5;
  --color-primary-700: #1976d2;
  --color-primary-800: #1565c0;

  /* 强调色（面板主按钮） */
  --color-accent: #3498db;
  --color-accent-hover: #2980b9;

  /* 语义色 */
  --color-success: #4caf50;
  --color-warning: #ff9800;
  --color-warning-700: #f57c00;
  --color-danger: #f44336;
  --color-danger-700: #d32f2f;
  --color-magenta: #e91e63;
  --color-purple: #9c27b0;
  --color-deep-purple: #673ab7;
  --color-indigo: #3f51b5;
  --color-brown: #795548;
  --color-blue-grey: #607d8b;
  --color-teal: #00bcd4;

  /* 文本与中性色 */
  --color-text-main: #333;
  --color-text-sub: #666;
  --color-border: #eee;
  --color-border-strong: #ddd;
  --color-border-soft: #f0f0f0;
  --color-border-muted: #ccc;
  --color-bg-panel: #fff;
  --color-bg-muted: #f5f5f5;
  --color-bg-muted-2: #f8f9fa;

  /* 辅助（用于 rgba 拼接） */
  --color-primary-rgb: 33, 150, 243;

  /* 圆角与阴影 */
  --radius-2: 2px;
  --radius-3: 3px;
  --radius-4: 4px;
  --shadow-1: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-2: 0 3px 8px rgba(0, 0, 0, 0.2);
  --shadow-3: 0 0 10px rgba(0, 0, 0, 0.1);

  /* 分区主题（映射，不改变现有视觉） */
  --section-global-color: #2196f3;
  --section-keywords-color: #4caf50;
  --section-usernames-color: #ff9800;
  --section-data-interaction-color: #673ab7;
  --section-url-color: #9c27b0;
  --section-xpath-color: #e91e63;
  --section-sync-color: #00bcd4;
  --section-main-page-color: #3f51b5;
  --section-sub-page-color: #795548;
  --section-content-page-color: #607d8b;
  --section-domain-color: #607d8b;
}

/* ========================================
   1. 主面板基础样式
   ======================================== */

/* 主面板容器 */
#forum-filter-panel {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background: transparent;
  font-family: Arial, sans-serif;
  width: 50px;
  height: 50px;
  user-select: none;
  border: none;
  box-shadow: none;
  transition: all 0.3s ease-in-out;
}

/* 面板展开状态 - 点击模式 */
#forum-filter-panel.click-mode.expanded {
  transform: translate(-50%, -50%) !important;
  width: 400px;
  max-width: 33.33vw;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  left: 50% !important;
  max-height: 90vh;
  height: auto;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

/* 移动端面板展开状态 */
#forum-filter-panel.is-mobile.click-mode.expanded {
  width: 290px;
  max-width: 90vw;
}

/* 面板收起状态 */
#forum-filter-panel.click-mode:not(.expanded) {
  width: 50px;
  height: 50px;
  background: transparent;
  border: none;
  box-shadow: none;
  transform: translate(-50%, -50%) !important;
}

/* ========================================
   2. 面板内容控制
   ======================================== */

/* 面板内容显示状态 */
#forum-filter-panel.click-mode.expanded .panel-content {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition: opacity 0.35s cubic-bezier(0.25, 1, 0.5, 1),
    visibility 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  transition-delay: 0.15s;
}

/* 面板内容隐藏状态 */
#forum-filter-panel.click-mode:not(.expanded) .panel-content {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1),
    visibility 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}

/* ========================================
   3. 主按钮样式
   ======================================== */

/* 主按钮基础样式 */
.panel-tab {
  position: fixed;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10000;

  width: 44px;
  height: 44px;
  background: #3498db;
  background: var(--color-accent, #3498db);
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

  display: flex;
  justify-content: center;
  align-items: center;

  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1),
    opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1);

  white-space: nowrap;
  overflow: hidden;
  user-select: none;

  box-sizing: content-box !important;
  padding: 0;
}

/* 主按钮悬停效果 */
.panel-tab:hover {
  background: #2980b9;
  background: var(--color-accent-hover, #2980b9);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-52%);
}

/* 主按钮点击效果 */
.panel-tab:active {
  transform: translateY(-48%);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.1s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.1s cubic-bezier(0.25, 1, 0.5, 1);
}

/* 面板展开时隐藏主按钮 */
#forum-filter-panel.click-mode.expanded~.panel-tab,
#forum-filter-panel.click-mode.expanded .panel-tab {
  display: none !important;
}

/* 按钮隐藏类 - 优先级最高 */
.panel-tab.button-hidden {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* ========================================
   4. 控制按钮样式
   ======================================== */

/* 关闭按钮 */
.panel-close-btn {
  position: absolute !important;
  top: 10px !important;
  right: 10px !important;
  z-index: 10001 !important;

  width: 26px !important;
  height: 26px !important;
  background: rgba(255, 68, 68, 0.85) !important;
  border: none !important;
  border-radius: 50% !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  color: white !important;
  font-size: 16px !important;
  cursor: pointer !important;

  box-sizing: border-box !important;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1 !important;
}

/* 关闭按钮悬停效果 */
.panel-close-btn:hover {
  background: rgba(255, 51, 51, 0.95) !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15) !important;
}

/* 设置按钮 */
.panel-settings-btn {
  position: absolute !important;
  top: 40px !important;
  right: 10px !important;
  z-index: 10002 !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  padding: 6px 10px !important;
  background: #2196f3 !important;
  background: var(--color-primary, #2196f3) !important;
  border: none !important;
  border-radius: 4px !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;

  color: white !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  text-decoration: none !important;

  cursor: pointer !important;
  user-select: none !important;
}

.panel-settings-btn:hover {
  background: #1976d2 !important;
  background: var(--color-primary-700, #1976d2) !important;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15) !important;
}

.panel-settings-btn:active {
  background: #1565c0 !important;
  background: var(--color-primary-800, #1565c0) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.panel-settings-btn::before {
  margin-right: 6px !important;
  font-size: 16px !important;
}

/* ========================================
   5. 面板内容区域
   ======================================== */

/* 面板内容容器 */
.panel-content {
  position: relative;
  padding: 10px 15px;
  padding-top: 56px !important;
  max-height: calc(90vh - 60px);
  overflow-y: auto;

  background: #fff;
  border-radius: 4px;
}

/* 顶部按钮容器：水平排列 设置/关闭 */
.panel-actions {
  position: absolute !important;
  top: 10px !important;
  right: 10px !important;
  display: flex !important;
  gap: 8px !important;
  align-items: center !important;
  z-index: 10002 !important;
}

/* 在容器内由父元素管理定位 */
.panel-actions .panel-close-btn,
.panel-actions .panel-settings-btn {
  position: static !important;
}

/* 面板内容滚动条样式 */
.panel-content::-webkit-scrollbar {
  width: 8px;
}

.panel-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* 数据交互组头（标题 + 操作按钮） */
.di-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.di-group-header .di-group-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 窄屏或容器变窄时，按钮垂直堆叠 */
@media screen and (max-width: 480px) {
  .di-group-header {
    flex-wrap: wrap;
  }

  .di-group-header .di-group-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  .di-group-header .di-group-actions>button {
    width: 100%;
  }
}

/* ========================================
   6. 数组编辑器组件
   ======================================== */

/* 数组编辑器切换按钮 */
.array-editor-toggle {
  width: 100%;
  padding: 6px;
  margin-bottom: 6px;

  background: white;
  border: none;
  border-radius: 3px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;

  color: #000;
  font: bold 14px Arial, sans-serif !important;
  font-weight: 600;
  font-size: 14px;

  cursor: pointer;
}

.array-editor-toggle:hover {
  background: #eee;
}

/* ========================================
   8. 配置面板组件
   ======================================== */

/* 配置面板切换按钮 - 收起状态 */
#forum-filter-panel .config-section-toggle.collapsed {
  width: calc(100% - 6px);
  margin: 3px;
  padding: 4px 8px;

  background: #f9f9f9;
  border: none;

  text-align: left;
  cursor: pointer;
}

#forum-filter-panel .config-section-toggle.collapsed:hover {
  background: #e5e5e5;
}

/* ========================================
   9. 设置面板
   ======================================== */

/* 设置面板容器 */
#forum-filter-settings {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;

  min-width: 300px;
  max-width: 90%;
  max-height: 90vh;

  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  display: none;
  overflow-y: auto;
}

/* 设置面板显示状态 */
#forum-filter-settings.visible {
  display: block;
}

/* 设置面板标题 */
#forum-filter-settings h3 {
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;

  color: #333;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

/* 设置组容器 */
#forum-filter-settings .setting-group {
  margin-bottom: 20px;
  padding: 15px;

  background: #f8f9fa;
  border-radius: 6px;

  transition: all 0.2s ease;
}

#forum-filter-settings .setting-group:hover {
  background: #f0f2f5;
}

/* 设置面板表单控件 */
#forum-filter-settings .setting-group label {
  display: block;
  margin-bottom: 8px;

  color: #444;
  font-size: 14px;
  font-weight: 600;
}

#forum-filter-settings select {
  width: 100%;
  padding: 8px 12px;

  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;

  color: #333;
  font-size: 14px;

  cursor: pointer;
  transition: all 0.2s ease;
}

#forum-filter-settings select:hover {
  border-color: #2196f3;
  border-color: var(--color-primary, #2196f3);
}

#forum-filter-settings select:focus {
  border-color: #2196f3;
  border-color: var(--color-primary, #2196f3);
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 33, 150, 243), 0.1);
  outline: none;
}

/* ========================================
   10. 表单控件样式
   ======================================== */

/* 范围输入控件 */
#forum-filter-settings input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  margin: 15px 0;
  padding: 0;
  position: relative;

  background: #ddd;
  border-radius: 2px;
  outline: none;
}

#forum-filter-settings input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #2196f3;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: -7px;
}

#forum-filter-settings input[type="range"]::-webkit-slider-thumb:hover {
  background: #1976d2;
  transform: scale(1.1);
}

#forum-filter-settings input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #2196f3;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

#forum-filter-settings input[type="range"]::-moz-range-thumb:hover {
  background: #1976d2;
  transform: scale(1.1);
}

#forum-filter-settings input[type="range"]::-ms-thumb {
  width: 18px;
  height: 18px;
  background: #2196f3;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0;
}

#forum-filter-settings input[type="range"]::-ms-thumb:hover {
  background: #1976d2;
  transform: scale(1.1);
}

#forum-filter-settings input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  cursor: pointer;
  border: none;
}

#forum-filter-settings input[type="range"]::-moz-range-track {
  width: 100%;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  cursor: pointer;
  border: none;
}

#forum-filter-settings input[type="range"]::-ms-track {
  width: 100%;
  height: 4px;
  background: transparent;
  border-color: transparent;
  color: transparent;
  cursor: pointer;
}

#forum-filter-settings input[type="range"]::-ms-fill-lower {
  background: #2196f3;
  border-radius: 2px;
  border: none;
}

#forum-filter-settings input[type="range"]::-ms-fill-upper {
  background: #ddd;
  border-radius: 2px;
  border: none;
}

#forum-filter-settings input[type="range"]:hover::-webkit-slider-thumb,
#forum-filter-settings input[type="range"]:hover::-moz-range-thumb,
#forum-filter-settings input[type="range"]:hover::-ms-thumb {
  background: #1976d2;
  transform: scale(1.1);
}

#forum-filter-settings input[type="range"]:active::-webkit-slider-thumb,
#forum-filter-settings input[type="range"]:active::-moz-range-thumb,
#forum-filter-settings input[type="range"]:active::-ms-thumb {
  transform: scale(1.2);
}

/* ========================================
   11. 按钮样式
   ======================================== */

/* 设置面板按钮组 */
#forum-filter-settings .buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

/* 设置面板按钮 */
#forum-filter-settings .buttons button {
  padding: 8px 20px;

  background: transparent;
  border: none;
  border-radius: 4px;

  color: inherit;
  font-size: 14px;
  font-weight: 500;

  cursor: pointer;
  transition: all 0.2s ease;
}

#forum-filter-settings .buttons button#settings-cancel {
  background: #f5f5f5;
  color: #666;
}

#forum-filter-settings .buttons button#settings-cancel:hover {
  background: #e0e0e0;
  color: #333;
}

#forum-filter-settings .buttons button#settings-save {
  background: #2196f3;
  color: white;
}

#forum-filter-settings .buttons button#settings-save:hover {
  background: #1976d2;
}

/* ========================================
   12. 遮罩层
   ======================================== */

/* 设置面板遮罩层 */
#settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;

  background: rgba(0, 0, 0, 0.5);

  display: none;
}

/* 页面早期加载遮罩层（由脚本在 document-start 插入 DOM） */
#early-page-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(240, 248, 255, 0.9) 100%);
  backdrop-filter: blur(15px) saturate(200%);
  -webkit-backdrop-filter: blur(15px) saturate(200%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: all;
  opacity: 0;
  animation: fadeInOverlay 0.6s ease-out forwards;
}

#early-loading-indicator {
  width: 80px;
  height: 80px;
  position: relative;
  margin-bottom: 20px;
}

#early-loading-indicator:before {
  content: "";
  position: absolute;
  width: 80px;
  height: 80px;
  border: 3px solid rgba(33, 150, 243, 0.1);
  border-top: 3px solid #2196f3;
  border-radius: 50%;
  animation: smoothSpin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
  will-change: transform;
}

#early-loading-indicator:after {
  content: "";
  position: absolute;
  width: 50px;
  height: 50px;
  top: 15px;
  left: 15px;
  border: 2px solid rgba(33, 150, 243, 0.05);
  border-bottom: 2px solid #42a5f5;
  border-radius: 50%;
  animation: smoothSpin 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
  will-change: transform;
}

#early-loading-text {
  color: #2196f3;
  font-size: 14px;
  font-weight: 500;
  opacity: 0;
  animation: fadeInText 0.8s ease-out 0.3s forwards;
  text-align: center;
  letter-spacing: 0.5px;
}

#early-loading-progress {
  width: 200px;
  height: 3px;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 2px;
  margin-top: 15px;
  overflow: hidden;
  opacity: 0;
  animation: fadeInProgress 0.8s ease-out 0.5s forwards;
}

#early-loading-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2196f3, #42a5f5, #64b5f6);
  border-radius: 2px;
  width: 0%;
  animation: progressFill 2s ease-in-out infinite;
  will-change: width;
}

@keyframes fadeInOverlay {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeInText {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInProgress {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }

  100% {
    opacity: 1;
    transform: scaleX(1);
  }
}

@keyframes smoothSpin {
  0% {
    transform: rotate(0deg) scale(1);
  }

  50% {
    transform: rotate(180deg) scale(1.05);
  }

  100% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes progressFill {
  0% {
    width: 0%;
    transform: translateX(-100%);
  }

  50% {
    width: 70%;
    transform: translateX(0%);
  }

  100% {
    width: 100%;
    transform: translateX(0%);
  }
}

/* 隐藏动画 */
#early-page-loading-overlay.hiding {
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

#early-page-loading-overlay.hiding #early-loading-indicator {
  transform: scale(0.8);
  opacity: 0;
  transition: all 0.3s ease-in;
}

#early-page-loading-overlay.hiding #early-loading-text,
#early-page-loading-overlay.hiding #early-loading-progress {
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease-in;
}

/* ========================================
   13. 域信息组件
   ======================================== */

/* 域信息容器 */
.domain-info {
  position: relative !important;
  margin-bottom: 15px !important;
  padding: 12px !important;

  background: #f8f9fa !important;
  border-bottom: 1px solid #eee !important;
  border-radius: 4px !important;

  text-align: left !important;
}

/* 域信息标题 */
.domain-info h4 {
  margin: 0 0 8px 0 !important;

  color: #333 !important;
  font-size: 14px !important;
  font-weight: 600 !important;
}

/* 页面类型信息 */
.domain-info .page-type {
  margin-bottom: 10px !important;

  color: #666 !important;
  font-size: 13px !important;
}

.domain-info #page-type-value {
  color: #2196f3 !important;
  color: var(--color-primary, #2196f3) !important;
  font-weight: 600 !important;
}

/* 域启用行 */
.domain-enable-row {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 8px 12px !important;
  background: #f8f9fa !important;
  border-radius: 4px !important;
  margin: 10px 0 !important;
  border: 1px solid #e0e0e0 !important;
  transition: all 0.2s ease !important;
}

.domain-enable-row:hover {
  background: #f0f2f5 !important;
  border-color: #2196f3 !important;
  border-color: var(--color-primary, #2196f3) !important;
}

.domain-info .domain-enable-row label {
  flex: 1 !important;
  display: flex !important;
  align-items: center !important;
  margin: 0 !important;
  font-size: 13px !important;
  color: #333 !important;
  cursor: pointer !important;
  user-select: none !important;
  position: relative !important;
  padding-left: 32px !important;
  min-height: 24px !important;
  line-height: 24px !important;
  font-weight: 600 !important;
}

.domain-info .domain-enable-row input[type="checkbox"] {
  position: absolute !important;
  opacity: 0 !important;
  cursor: pointer !important;
  height: 0 !important;
  width: 0 !important;
}

.domain-info .domain-enable-row label:before {
  content: "" !important;
  position: absolute !important;
  left: 0 !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 22px !important;
  height: 22px !important;
  border: 2px solid #ccc !important;
  border-radius: 4px !important;
  background-color: #fff !important;
  box-sizing: border-box !important;
}

.domain-info .domain-enable-row label:after {
  content: "" !important;
  position: absolute !important;
  left: 7px !important;
  top: 50% !important;
  transform: translateY(-65%) rotate(45deg) !important;
  width: 8px !important;
  height: 12px !important;
  border: solid white !important;
  border-width: 0 2px 2px 0 !important;
  opacity: 0 !important;
}

.domain-info .domain-enable-row input[type="checkbox"]:checked+label:before {
  background-color: #4caf50 !important;
  border-color: #4caf50 !important;
}

.domain-info .domain-enable-row input[type="checkbox"]:checked+label:after {
  opacity: 1 !important;
}

.domain-info .domain-enable-row input[type="checkbox"]:focus+label:before {
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2) !important;
}

.domain-info .domain-enable-row label:hover:before {
  border-color: #4caf50 !important;
}

/* 配置部分 */
.config-section,
.config-section-toggle.collapsed {
  margin: 8px 0;
  padding: 6px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #eee;
  overflow: hidden !important;
}

.config-section>*,
.array-editor>*,
.button-group>* {
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
}

/* 配置部分颜色标识 */
.config-section[data-section="global"] {
  border-left: 4px solid #2196f3;
  --section-color: var(--section-global-color, #2196f3);
  border-left-color: var(--section-color, #2196f3);
}

.config-section[data-section="keywords"] {
  border-left: 4px solid #4caf50;
  --section-color: var(--section-keywords-color, #4caf50);
  border-left-color: var(--section-color, #4caf50);
}

.config-section[data-section="usernames"] {
  border-left: 4px solid #ff9800;
  --section-color: var(--section-usernames-color, #ff9800);
  border-left-color: var(--section-color, #ff9800);
}

.config-section[data-section="data-interaction"] {
  border-left: 4px solid #673ab7;
  --section-color: var(--section-data-interaction-color, #673ab7);
  border-left-color: var(--section-color, #673ab7);
}

.config-section[data-section="url"] {
  border-left: 4px solid #9c27b0;
  --section-color: var(--section-url-color, #9c27b0);
  border-left-color: var(--section-color, #9c27b0);
}

.config-section[data-section="xpath"] {
  border-left: 4px solid #e91e63;
  --section-color: var(--section-xpath-color, #e91e63);
  border-left-color: var(--section-color, #e91e63);
}

.config-section[data-section="sync"] {
  border-left: 4px solid #00bcd4;
  --section-color: var(--section-sync-color, #00bcd4);
  border-left-color: var(--section-color, #00bcd4);
}

.config-section[data-section="main-page"] {
  border-left: 4px solid #3f51b5;
  --section-color: var(--section-main-page-color, #3f51b5);
  border-left-color: var(--section-color, #3f51b5);
}

.config-section[data-section="sub-page"] {
  border-left: 4px solid #795548;
  --section-color: var(--section-sub-page-color, #795548);
  border-left-color: var(--section-color, #795548);
}

.config-section[data-section="content-page"] {
  border-left: 4px solid #607d8b;
  --section-color: var(--section-content-page-color, #607d8b);
  border-left-color: var(--section-color, #607d8b);
}

/* 域名配置部分 */
.config-section[data-section="domain"] {
  border-left: 4px solid #607d8b;
  --section-color: var(--section-domain-color, #607d8b);
  border-left-color: var(--section-color, #607d8b);
}

/* 动态分区样式已移除，只保留数据交互区域 */

.config-section[data-section="global"] .array-item {
  border-left-color: #2196f3 !important;
  border-left-color: var(--section-color, #2196f3) !important;
}

.config-section[data-section="keywords"] .array-item {
  border-left-color: #4caf50 !important;
  border-left-color: var(--section-color, #4caf50) !important;
}

.config-section[data-section="usernames"] .array-item {
  border-left-color: #ff9800 !important;
  border-left-color: var(--section-color, #ff9800) !important;
}

.config-section[data-section="url"] .array-item {
  border-left-color: #9c27b0 !important;
  border-left-color: var(--section-color, #9c27b0) !important;
}

.config-section[data-section="global"] .array-editor-toggle {
  color: #1565c0;
  color: var(--color-primary-800, #1565c0);
}

.config-section[data-section="keywords"] .array-editor-toggle {
  color: #2e7d32;
}

.config-section[data-section="usernames"] .array-editor-toggle {
  color: #e65100;
}

.config-section[data-section="url"] .array-editor-toggle {
  color: #6a1b9a;
}

.config-section[data-section="xpath"] .array-editor-toggle {
  color: #c2185b;
}

.config-section[data-section="global"] .config-section-toggle {
  background: #e3f2fd;
  color: #1565c0;
}

.config-section[data-section="keywords"] .config-section-toggle {
  background: #e8f5e9;
  color: #2e7d32;
}

.config-section[data-section="usernames"] .config-section-toggle {
  background: #fff3e0;
  color: #e65100;
}

.config-section[data-section="data-interaction"] .config-section-toggle {
  background: #f3e5f5;
  color: #4a148c;
}

.config-section[data-section="url"] .config-section-toggle {
  background: #f3e5f5;
  color: #6a1b9a;
}

.config-section[data-section="xpath"] .config-section-toggle {
  background: #fce4ec;
  color: #c2185b;
}

.config-section[data-section="sync"] .config-section-toggle {
  background: #e0f7fa;
  color: #0097a7;
}

.config-section[data-section="main-page"] .config-section-toggle {
  background: #e8eaf6;
  color: #303f9f;
}

.config-section[data-section="sub-page"] .config-section-toggle {
  background: #efebe9;
  color: #5d4037;
}

.config-section[data-section="content-page"] .config-section-toggle {
  background: #eceff1;
  color: #455a64;
}

.config-section[data-section="domain"] .config-section-toggle {
  background: #eceff1;
  color: #455a64;
}

/* 配置部分内容 */
.config-section-content {
  max-width: 100% !important;
  max-height: 300px;
  opacity: 1;
  overflow-y: auto;
  padding: 8px;
  margin-top: 5px;
  background: #fff;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.config-section-content::-webkit-scrollbar {
  width: 6px;
}

.config-section-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.config-section-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.config-section-content::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

.config-section-toggle.collapsed+.config-section-content {
  max-width: 100% !important;
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* ========================================
   14. 复选框组件
   ======================================== */

/* 复选框行容器 */
.checkbox-row {
  display: flex !important;
  justify-content: space-between !important;
  gap: 10px !important;
  margin-bottom: 8px !important;
}

/* 复选框标签 */
.checkbox-row label {
  flex: 1 !important;
  position: relative !important;
  display: flex !important;
  align-items: center !important;

  margin: 0 !important;
  padding-left: 28px !important;
  min-height: 20px !important;
  line-height: 20px !important;

  color: #333 !important;
  font-size: 13px !important;

  cursor: pointer !important;
  user-select: none !important;
}

.checkbox-row label {
  font-weight: unset !important;
}

.checkbox-row input[type="checkbox"] {
  padding: 0 !important;
  position: absolute !important;
  left: 0 !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
  width: 18px !important;
  height: 18px !important;
  cursor: pointer !important;
  opacity: 1 !important;
  z-index: 1 !important;
  border: 2px solid #ccc !important;
  border-radius: 3px !important;
  background-color: #fff !important;
  transition: all 0.2s ease-in-out !important;
  visibility: visible !important;
}

.checkbox-row input[type="checkbox"]::after {
  content: "" !important;
  border: solid transparent !important;
}

.checkbox-row input[type="checkbox"]:checked::after {
  background-color: transparent !important;
}

.checkbox-row input[type="checkbox"]:hover {
  border-color: #2196f3 !important;
  border-color: var(--color-primary, #2196f3) !important;
}

.checkbox-row input[type="checkbox"]:focus {
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2) !important;
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 33, 150, 243), 0.2) !important;
  outline: none !important;
}

.checkbox-row label:before {
  content: "" !important;
  position: absolute !important;
  left: 0 !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 18px !important;
  height: 18px !important;
  border: 2px solid #ccc !important;
  border-radius: 3px !important;
  background-color: #fff !important;
  box-sizing: border-box !important;
}

.checkbox-row label:after {
  content: "" !important;
  position: absolute !important;
  left: 6px !important;
  top: 50% !important;
  transform: translateY(-50%) rotate(45deg) !important;
  width: 6px !important;
  height: 10px !important;
  border: solid white !important;
  border-width: 0 2px 2px 0 !important;
  opacity: 0 !important;
  transition: all 0.2s ease-in-out !important;
}

.checkbox-row input[type="checkbox"]:checked+label:before {
  background-color: #2196f3 !important;
  border-color: #2196f3 !important;
  background-color: var(--color-primary, #2196f3) !important;
  border-color: var(--color-primary, #2196f3) !important;
}

.checkbox-row input[type="checkbox"]:checked+label:after {
  opacity: 1 !important;
}

.checkbox-row input[type="checkbox"]:focus+label:before {
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2) !important;
}

.checkbox-row label:hover:before {
  border-color: #2196f3 !important;
}

.config-section[data-section="global"] .checkbox-row input[type="checkbox"]:checked+label:before {
  background-color: #2196f3 !important;
  border-color: #2196f3 !important;
}

.config-section[data-section="keywords"] .checkbox-row input[type="checkbox"]:checked+label:before {
  background-color: #4caf50 !important;
  border-color: #4caf50 !important;
}

.config-section[data-section="usernames"] .checkbox-row input[type="checkbox"]:checked+label:before {
  background-color: #ff9800 !important;
  border-color: #ff9800 !important;
}

.config-section[data-section="url"] .checkbox-row input[type="checkbox"]:checked+label:before {
  background-color: #9c27b0 !important;
  border-color: #9c27b0 !important;
}

.config-section[data-section="xpath"] .checkbox-row input[type="checkbox"]:checked+label:before {
  background-color: #e91e63 !important;
  border-color: #e91e63 !important;
}

/* 按钮组 */
.button-group {
  margin-top: 15px !important;
  text-align: center !important;
  padding: 8px 0 !important;
  border-top: 1px solid #eee !important;
  display: flex !important;
  flex-direction: row !important;
  gap: 8px !important;
  width: 100% !important;
}

.button-group button {
  flex: 1 !important;
  align-items: center !important;
  text-align: center !important;
  justify-content: center !important;
  padding: 8px 15px !important;
  font-size: 13px !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  background: #f5f5f5 !important;
  transition: background 0.2s !important;
}

.button-group button:hover {
  background: #e0e0e0 !important;
}

.button-group button#export-config {
  background: #2196f3 !important;
  color: white !important;
  background: var(--color-primary, #2196f3) !important;
}

.button-group button#export-config:hover {
  background: #1e88e5 !important;
  background: var(--color-primary-600, #1e88e5) !important;
}

.button-group button#import-config {
  background: #ff9800 !important;
  color: white !important;
  background: var(--color-warning, #ff9800) !important;
}

.button-group button#import-config:hover {
  background: #f57c00 !important;
  background: var(--color-warning-700, #f57c00) !important;
}

.button-group button#reset-config {
  background: #f44336 !important;
  color: white !important;
  background: var(--color-danger, #f44336) !important;
}

.button-group button#reset-config:hover {
  background: #d32f2f !important;
  background: var(--color-danger-700, #d32f2f) !important;
}

/* ========================================
   15. 数组编辑器容器
   ======================================== */

/* 数组编辑器基础样式 */
.array-editor {
  margin: 4px 0;
  padding: 6px;

  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
}

/* 全局配置数组编辑器 */
.config-section[data-section="global"] .array-editor {
  border-width: 2px;
  border-color: #2196f3;
}

/* 其他配置数组编辑器 */
.config-section[data-section="keywords"] .array-editor,
.config-section[data-section="usernames"] .array-editor,
.config-section[data-section="url"] .array-editor,
.config-section[data-section="xpath"] .array-editor {
  border-width: 2px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 数组编辑器头部 */
.array-editor-header {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  margin-bottom: 6px !important;
  flex-wrap: wrap !important;
}

/* 数组编辑器头部输入框 */
.array-editor-header input[type="text"] {
  min-width: 10px !important;
  height: 28px !important;
  padding: 6px 8px !important;

  background: #fff;
  border: 1px solid #ddd !important;
  border-radius: 3px !important;

  color: #333;
  font-size: 13px !important;

  box-sizing: border-box !important;
}

/* 数组编辑器搜索输入框 */
.array-editor-search-input {
  width: 100% !important;
  margin: 4px 0 !important;
  background: #f5f5f5 !important;
}

.array-editor-search-input::placeholder {
  text-align: center !important;
}

/* 数组编辑器按钮组 */
.array-editor .button-group-inline button {
  background: white;
  color: #333;
  border: 1px solid #ddd;
  border-bottom-width: 3px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  outline: none;
  white-space: normal;
  word-break: break-word;
  line-height: 1.4 !important;
  font: 13px/1.4 Arial, sans-serif !important;
}

.config-section[data-section="global"] .array-editor .button-group-inline button {
  border-bottom-color: #42a5f5;
}

.config-section[data-section="global"] .array-editor .button-group-inline button:hover {
  border-bottom-color: #1e88e5;
}

.config-section[data-section="keywords"] .array-editor .button-group-inline button {
  border-bottom-color: #66bb6a;
}

.config-section[data-section="keywords"] .array-editor .button-group-inline button:hover {
  border-bottom-color: #43a047;
}

.config-section[data-section="usernames"] .array-editor .button-group-inline button {
  border-bottom-color: #fb8c00;
}

.config-section[data-section="usernames"] .array-editor .button-group-inline button:hover {
  border-bottom-color: #f57c00;
}

.config-section[data-section="url"] .array-editor .button-group-inline button {
  border-bottom-color: #ab47bc;
}

.config-section[data-section="url"] .array-editor .button-group-inline button:hover {
  border-bottom-color: #8e24aa;
}

.config-section[data-section="xpath"] .array-editor .button-group-inline button {
  border-bottom-color: #ec407a;
}

.config-section[data-section="xpath"] .array-editor .button-group-inline button:hover {
  border-bottom-color: #d81b60;
}

.array-editor .button-group-inline button:hover {
  background: #f5f5f5;
}

.array-editor .button-group-inline button:active {
  border-bottom-width: 2px;
}

/* 数组编辑器列表 */
.array-editor-list {
  max-height: 200px;
  margin: 4px 0;
  padding: 4px;

  background: #fff;
  border: 1px solid #eee;
  border-radius: 3px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);

  overflow-y: auto;
}

/* 空列表状态 */
.array-editor-list:empty {
  padding: 8px;
  text-align: center;
  color: #999;
}

.array-editor-list:empty::after {
  content: attr(data-empty);
  font-size: 12px;
}

.array-editor-list::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.array-editor-list::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 3px;
}

.array-editor-list::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
  transition: background 0.2s;
}

.array-editor-list::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

.array-editor-list::-webkit-scrollbar-corner {
  background: #f8f9fa;
}

/* 数组项 */
.array-item {
  display: flex !important;
  align-items: center !important;

  width: auto !important;
  margin: 2px 0 !important;
  padding: 8px !important;

  background: #f5f5f5 !important;
  border-left: 4px solid transparent !important;
  border-radius: 3px !important;
}

.array-item:hover {
  background: #f1f3f5 !important;
}

/* 数组项文本 */
.array-item span {
  flex: 1 !important;
  margin-right: 8px !important;

  color: #495057 !important;
  font-size: 13px !important;
  line-height: 1.4 !important;

  word-break: break-all !important;
  user-select: text !important;
  cursor: text !important;
}

/* 数组项按钮 */
.array-item button {
  width: 18px !important;
  height: 18px !important;
  min-width: 18px !important;
  padding: 0 !important;

  background: transparent !important;
  border: none !important;
  border-radius: 3px !important;

  color: #adb5bd !important;
  font-size: 14px !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  cursor: pointer !important;
  user-select: none !important;
  opacity: 0 !important;
}

/* 数组项按钮悬停状态 */
.array-item:hover button {
  opacity: 1 !important;
  color: #495057 !important;
}

.array-item button:hover {
  background: #e9ecef !important;
  color: #212529 !important;
}

/* 高亮标记 */
mark {
  background: #e9ecef;
  color: #495057;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 500;
}

/* 数组编辑器计数 */
.array-editor-count {
  background: #999;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: normal;
  line-height: 1.4 !important;
}

/* 数组编辑器内容 */
.array-editor-content {
  display: none;
}

.array-editor-content.expanded {
  display: block;
}

.array-editor .array-item button {
  background: rgba(0, 0, 0, 0.6) !important;
  color: white !important;
  border-radius: 50% !important;
  min-width: 20px !important;
  max-width: 20px !important;
  margin: 0 !important;
  flex-shrink: 0 !important;
  float: none !important;
  line-height: 0 !important;
  padding-bottom: 2px !important;
}

.array-editor .array-item button:hover {
  background: #000000 !important;
}

/* 配置组 */
.config-group {
  margin: 5px 0;
  padding: 0;
}

/* 配置部分切换 */
.config-section-toggle {
  width: 100%;
  padding: 8px 12px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 700;
  color: #333;
  font-size: 14px;
  font: bold 14px/1.4 Arial, sans-serif !important;
}

.config-section-toggle:hover {
  background: #e8e8e8;
}

.config-section-indicator {}

.config-section-toggle.collapsed .config-section-indicator {
  transform: rotate(-90deg);
}

/* 输入框样式 */
/* 输入框样式 - 实际使用中 */
.array-editor-additem-input,
.array-editor-additem-input-regex {
  flex: 1 1 50px !important;
  min-width: 10px !important;
  margin: 4px !important;
  padding: 6px 12px !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px !important;
  height: 32px !important;
  font-size: 14px !important;
  box-sizing: border-box !important;
  transition: all 0.2s ease !important;
  background-color: #fafafa !important;
  color: #333 !important;
}

.array-editor-additem-input:hover,
.array-editor-additem-input-regex:hover {
  border-color: #bdbdbd !important;
  background-color: #fff !important;
}

.array-editor-additem-input:focus,
.array-editor-additem-input-regex:focus {
  border-color: #2196f3 !important;
  background-color: #fff !important;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1) !important;
  outline: none !important;
}


/* 时间间隔选择 */
#time-interval {
  padding: 6px 8px !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px !important;
  height: 32px !important;
  font-size: 14px !important;
  background-color: #fafafa !important;
  color: #333 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  box-sizing: border-box !important;
  display: inline-flex !important;
  align-items: center !important;
  vertical-align: middle !important;
  margin: 0 !important;
  min-width: 70px !important;
  width: auto !important;
}

#time-interval:hover {
  border-color: #bdbdbd !important;
  background-color: #fff !important;
}

#time-interval:focus {
  border-color: #2196f3 !important;
  background-color: #fff !important;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1) !important;
  outline: none !important;
}

*/

/* 同步配置部分 */
.config-section[data-section="sync"] input {
  display: block !important;
  width: 100% !important;
  margin-bottom: 8px !important;
  padding: 6px 12px !important;
  border: 1px solid #ddd !important;
  border-radius: 4px !important;
  height: 32px !important;
  box-sizing: border-box !important;
}

.config-section[data-section="sync"] .config-section-content button {
  display: block !important;
  width: 100% !important;
  margin-bottom: 8px !important;
  padding: 6px 12px !important;
  border: 1px solid #ddd !important;
  border-radius: 4px !important;
  background-color: #fff !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
}

.config-section[data-section="sync"] button:hover {
  background-color: #f5f5f5 !important;
}

#sync-delete {
  color: #ff4444 !important;
  border-color: #ff4444 !important;
}

#sync-delete:hover {
  background-color: #fff5f5 !important;
}

#sync-status {
  margin-top: 8px !important;
  padding: 8px !important;
  border-radius: 4px !important;
  background-color: #f5f5f5 !important;
  min-height: 20px !important;
}

/* ========================================
   16. 响应式布局
   ======================================== */

/* 大屏幕设备 (≥1200px) */
@media screen and (min-width: 1200px) {

  #forum-filter-panel.click-mode.expanded {
    max-width: 33.33vw;
  }
}

/* 中屏幕设备 (992px-1199px) */
@media screen and (min-width: 992px) and (max-width: 1199px) {

  #forum-filter-panel.click-mode.expanded {
    max-width: 50vw;
  }
}

/* 平板设备 (768px-991px) */
@media screen and (min-width: 768px) and (max-width: 991px) {

  #forum-filter-panel.click-mode.expanded {
    max-width: 70vw;
    width: 70vw;
  }
}

/* 移动设备 (≤767px) */
@media screen and (max-width: 767px) {

  /* 移动端面板展开状态 */
  #forum-filter-panel.click-mode.expanded {
    width: 90vw;
    max-width: 90vw;
  }

  /* 移动端面板内容 */
  .panel-content {
    max-height: 70vh;
    padding: 8px 12px;
    padding-top: 56px !important;
  }

  /* 移动端关闭按钮 */
  .panel-close-btn {
    top: 8px !important;
    right: 8px !important;
    width: 26px !important;
    height: 26px !important;
    font-size: 16px !important;
    border-radius: 50% !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    line-height: 1 !important;
  }

  /* 移动端设置按钮 */
  .panel-settings-btn {
    top: 8px !important;
    right: 44px !important;
  }
}

/* 设置面板移动端适配 */
@media screen and (max-width: 768px) {
  #forum-filter-settings {
    width: 90vw;
    padding: 15px;
  }

  #forum-filter-settings .setting-group {
    padding: 10px;
  }
}



/* ========================================
   17. 侧边栏选项样式
   ======================================== */

/* 侧边栏主按钮选项 */
.byg-main-button-option {
  margin: 0 !important;
  padding: 0 !important;
  border-bottom: 1px solid #f0f0f0 !important;
}

.byg-main-button-option a {
  display: flex !important;
  align-items: center !important;
  padding: 12px 16px !important;
  color: #333 !important;
  text-decoration: none !important;
  transition: all 0.2s ease !important;
  border-radius: 0 !important;
  font-size: 14px !important;
  line-height: 1.4 !important;
}

.byg-main-button-option a:hover {
  background-color: #f5f5f5 !important;
  color: #2196f3 !important;
}

.byg-main-button-option img {
  width: 20px !important;
  height: 20px !important;
  margin-right: 12px !important;
  flex-shrink: 0 !important;
}

.byg-main-button-option .main-button-text {
  flex: 1 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* 侧边栏选项激活状态 */
.byg-main-button-option.active a {
  background-color: #e3f2fd !important;
  color: #1976d2 !important;
  font-weight: 500 !important;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .byg-main-button-option a {
    padding: 10px 12px !important;
    font-size: 13px !important;
  }

  .byg-main-button-option img {
    width: 18px !important;
    height: 18px !important;
    margin-right: 10px !important;
  }
}

`;
    if (typeof GM_addStyle === "function") {
      GM_addStyle(embeddedCss);
    }
  } catch (e) {}

  // 在DOM构建前立即创建遮罩层
  (function createEarlyLoadingOverlay() {
    // 样式已通过 @resource 注入到页面

    // 创建遮罩层元素
    const overlay = document.createElement("div");
    overlay.id = "early-page-loading-overlay";

    const indicator = document.createElement("div");
    indicator.id = "early-loading-indicator";

    const loadingText = document.createElement("div");
    loadingText.id = "early-loading-text";
    loadingText.textContent = "正在加载内容...";

    const progressContainer = document.createElement("div");
    progressContainer.id = "early-loading-progress";

    const progressBar = document.createElement("div");
    progressBar.id = "early-loading-progress-bar";

    progressContainer.appendChild(progressBar);

    overlay.appendChild(indicator);
    overlay.appendChild(loadingText);
    overlay.appendChild(progressContainer);
    document.documentElement.appendChild(overlay);

    // 记录已创建了早期遮罩
    window._earlyOverlayCreated = true;

    // 添加智能加载状态更新
    window.updateLoadingProgress = function (progress, text) {
      const overlay =
        document.getElementById("early-page-loading-overlay") ||
        document.getElementById("page-loading-overlay");
      if (!overlay) return;

      const progressBar = overlay.querySelector("#early-loading-progress-bar");
      const loadingText = overlay.querySelector("#early-loading-text");

      if (progressBar && typeof progress === "number") {
        progressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
      }

      if (loadingText && text) {
        loadingText.textContent = text;
      }
    };
  })();

  // 性能优化：缓存系统
  const CACHE = {
    // 正则表达式缓存，避免重复创建相同的正则表达式对象
    regex: new Map(),

    // XPath缓存，避免重复解析相同的XPath表达式
    xpath: new Map(),

    // 查询结果缓存，减少重复的DOM查询
    queryResults: new Map(),

    // 缓存生命周期控制
    lastClearTime: Date.now(),
    maxCacheAge: 10 * 60 * 1000, // 10分钟

    // 缓存大小限制
    maxCacheSize: 1000,

    // 缓存统计
    stats: {
      hits: 0,
      misses: 0,
      clears: 0,
    },

    // 清理缓存方法
    clear() {
      this.regex.clear();
      this.xpath.clear();
      this.queryResults.clear();
      this.lastClearTime = Date.now();
      this.stats.clears++;
    },

    // 自动清理检查
    checkCacheAge() {
      const now = Date.now();
      if (now - this.lastClearTime > this.maxCacheAge) {
        this.clear();
      }
    },

    // 检查缓存大小并清理
    checkCacheSize() {
      const totalSize =
        this.regex.size + this.xpath.size + this.queryResults.size;
      if (totalSize > this.maxCacheSize) {
        // 清理最旧的缓存项
        this.clearOldestEntries();
      }
    },

    // 清理最旧的缓存项
    clearOldestEntries() {
      const maps = [this.regex, this.xpath, this.queryResults];
      maps.forEach((map) => {
        if (map.size > 100) {
          const entries = Array.from(map.entries());
          const toDelete = entries.slice(0, Math.floor(map.size * 0.3)); // 删除30%的旧项
          toDelete.forEach(([key]) => map.delete(key));
        }
      });
    },

    // 获取缓存命中率
    getHitRate() {
      const total = this.stats.hits + this.stats.misses;
      return total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : "0.00";
    },
  };

  // 获取或创建正则表达式
  function getRegExp(pattern) {
    // 参数验证
    if (!pattern || typeof pattern !== "string") {
      console.warn("getRegExp: 无效的模式参数", pattern);
      return /(?!)/; // 永不匹配的正则表达式
    }

    // 检查缓存是否需要清理
    CACHE.checkCacheAge();
    CACHE.checkCacheSize();

    if (CACHE.regex.has(pattern)) {
      CACHE.stats.hits++;
      return CACHE.regex.get(pattern);
    }

    CACHE.stats.misses++;

    try {
      const regex = new RegExp(pattern);
      CACHE.regex.set(pattern, regex);
      return regex;
    } catch (e) {
      console.error("无效的正则表达式模式:", pattern, e);
      // 缓存错误结果，避免重复尝试
      const fallbackRegex = /(?!)/;
      CACHE.regex.set(pattern, fallbackRegex);
      return fallbackRegex;
    }
  }

  // 批量测试URL是否匹配任何模式
  function testUrlPatterns(patterns, url) {
    // 参数验证
    if (!patterns || !Array.isArray(patterns) || patterns.length === 0) {
      return false;
    }

    if (!url || typeof url !== "string") {
      console.warn("testUrlPatterns: 无效的URL参数", url);
      return false;
    }

    // 使用缓存的正则表达式，提前返回第一个匹配项
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      if (!pattern || typeof pattern !== "string") {
        continue; // 跳过无效模式
      }

      try {
        const regex = getRegExp(pattern);
        if (regex.test(url)) {
          return true;
        }
      } catch (e) {
        console.warn("testUrlPatterns: 模式测试失败", pattern, e);
        continue;
      }
    }
    return false;
  }

  // 优化XPath评估：缓存预编译的XPath表达式
  function evaluateXPath(
    xpath,
    contextNode = document,
    resultType = XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
  ) {
    // 参数验证
    if (!xpath || typeof xpath !== "string") {
      console.warn("evaluateXPath: 无效的XPath参数", xpath);
      return createEmptyXPathResult(resultType);
    }

    // 清理XPath表达式：移除末尾多余的斜杠
    let cleanXPath = xpath.trim();
    // 移除末尾的单个斜杠，但保留双斜杠（//）
    if (cleanXPath.endsWith("/") && !cleanXPath.endsWith("//")) {
      cleanXPath = cleanXPath.slice(0, -1);
      console.warn(
        "evaluateXPath: 清理了末尾多余的斜杠",
        xpath,
        "->",
        cleanXPath
      );
    }

    if (!contextNode || !document.contains(contextNode)) {
      console.warn("evaluateXPath: 无效的上下文节点", contextNode);
      contextNode = document;
    }

    // 检查缓存是否需要清理
    CACHE.checkCacheAge();
    CACHE.checkCacheSize();

    // 生成缓存键
    const cacheKey = `${cleanXPath}|${
      contextNode === document ? "doc" : "custom"
    }|${resultType}`;

    // 检查是否有缓存结果
    if (CACHE.queryResults.has(cacheKey)) {
      CACHE.stats.hits++;
      return CACHE.queryResults.get(cacheKey);
    }

    CACHE.stats.misses++;

    try {
      // 执行XPath评估
      const result = document.evaluate(
        cleanXPath,
        contextNode,
        null,
        resultType,
        null
      );

      // 缓存结果（仅缓存空结果或较小的结果集以避免内存问题）
      if (resultType === XPathResult.ORDERED_NODE_SNAPSHOT_TYPE) {
        if (result.snapshotLength === 0 || result.snapshotLength < 50) {
          CACHE.queryResults.set(cacheKey, result);
        }
      } else {
        CACHE.queryResults.set(cacheKey, result);
      }

      return result;
    } catch (e) {
      console.error("XPath评估错误:", cleanXPath, e);
      // 缓存错误结果，避免重复尝试
      const fallbackResult = createEmptyXPathResult(resultType);
      CACHE.queryResults.set(cacheKey, fallbackResult);
      return fallbackResult;
    }
  }

  // 创建空的XPath结果
  function createEmptyXPathResult(resultType) {
    try {
      return document.evaluate(
        "//node()[false]", // 永不匹配的XPath
        document,
        null,
        resultType,
        null
      );
    } catch (e) {
      console.error("创建空XPath结果失败:", e);
      return null;
    }
  }

  // 移除未使用的 panelVisible 变量
  let buttonVisible = true;

  // 读取保存的按钮可见性状态
  buttonVisible = GM_getValue("buttonVisible", true);

  GM_registerMenuCommand("显示/隐藏按钮", function () {
    buttonVisible = !buttonVisible;

    // 保存按钮可见性状态
    GM_setValue("buttonVisible", buttonVisible);

    const panel = document.getElementById("forum-filter-panel");
    if (!panel) return;

    // 如果隐藏按钮且交互页面已打开，先关闭交互页面
    if (!buttonVisible) {
      if (panel && panel.classList.contains("expanded")) {
        panel.classList.remove("expanded");
        panel.style.left = "10px";
        panel.style.transform = "translate(-50%, -50%)";
      }

      // 移除所有已存在的按钮
      const existingButtons = document.querySelectorAll(".panel-tab");
      existingButtons.forEach(
        (btn) => btn.parentNode && btn.parentNode.removeChild(btn)
      );
    } else {
      // 需要显示按钮 - 始终根据用户偏好创建悬浮按钮
      const tabButton = document.createElement("div");
      tabButton.className = "panel-tab";
      tabButton.textContent = "⚙";
      // 将按钮放在面板内部，保持与初始渲染一致
      try {
        panel.insertBefore(tabButton, panel.firstChild);
      } catch (e) {
        document.body.appendChild(tabButton);
      }

      // 为新创建的按钮添加点击事件（与 createControlPanel 中一致的交互）
      tabButton.addEventListener("click", function () {
        if (panel.classList.contains("click-mode")) {
          // 为点击添加缩放动画效果
          tabButton.style.transform = "translateY(-50%) scale(0.9)";
          setTimeout(() => {
            tabButton.style.transform = "translateY(-50%)";
          }, 100);

          panel.classList.toggle("expanded");

          // 使用 requestAnimationFrame 以获得更顺滑的过渡
          requestAnimationFrame(() => {
            if (panel.classList.contains("expanded")) {
              panel.style.left = "50%";
              panel.style.transform = "translate(-50%, -50%) scale(1)";

              if (isMobileDevice()) {
                panel.style.maxHeight = "80vh";
                document.body.style.overflow = "hidden";
              }
            } else {
              panel.style.transform = "translate(-50%, -50%) scale(0.95)";
              setTimeout(() => {
                panel.style.left = "10px";
                panel.style.transform = "translate(-50%, -50%)";
              }, 50);

              if (isMobileDevice()) {
                document.body.style.overflow = "";
              }
            }
          });
        }
      });
    }
  });
  // 移除未使用的面板可见性持久化变量（固定由按钮控制）

  // 外部CSS已提前注入

  const LANGUAGE_TEMPLATES = {
    "zh-CN": {
      settings_title: "面板设置",
      settings_language: "语言",

      settings_expand_click: "点击展开",

      settings_cancel: "取消",
      settings_save: "保存",
      panel_top_title: "通用论坛屏蔽",
      panel_top_current_domain: "当前域名：",
      panel_top_page_type: "当前页面类型：",
      panel_top_page_type_main: "主页",
      panel_top_page_type_content: "内容页",
      panel_top_page_type_unknown: "未匹配页面类型",
      panel_top_enable_domain: "启用此域名配置",
      panel_top_settings: "设置",
      panel_top_settings_title: "面板设置",
      panel_top_settings_button: "⚙ 设置",
      global_config_title: "全局配置",
      global_config_keywords: "全局关键词",
      global_config_usernames: "全局用户名",
      global_config_share_keywords: "主页/内容页共享关键词",
      global_config_share_usernames: "主页/内容页共享用户名",

      keywords_config_title: "关键词配置",
      keywords_config_keywords_list_title: "关键词列表",
      keywords_config_keywords_regex_title: "关键词正则表达式",
      usernames_config_title: "用户名配置",
      usernames_config_usernames_list_title: "用户名列表",
      usernames_config_usernames_regex_title: "用户名正则表达式",
      url_patterns_title: "URL 匹配模式",
      url_patterns_main_page_url_patterns_title: "主页URL模式",
      url_patterns_content_page_url_patterns_title: "内容页URL模式",
      xpath_config_title: "XPath 配置",
      xpath_config_main_and_sub_page_keywords_title: "主页/分页标题XPath",
      xpath_config_main_and_sub_page_usernames_title: "主页/分页用户XPath",
      xpath_config_content_page_keywords_title: "内容页关键词XPath",
      xpath_config_content_page_usernames_title: "内容页用户XPath",

      array_editor_add_item_input_placeholder: "请输入",
      array_editor_add_item_input_placeholder_regex: "请输入正则表达式",
      array_editor_add_item: "添加",
      array_editor_add_item_title: "添加新项目",
      array_editor_clear_allitem: "清空",
      array_editor_clear_allitem_title: "清空列表",
      array_editor_search_input_placeholder: "搜索...",
      array_editor_list_empty_placeholder: "暂无数据",
      array_editor_fileimport_input_button: "文件导入",
      array_editor_fileimport_input_button_title: "从文件导入列表",
      array_editor_export_button: "导出",
      array_editor_export_button_title: "导出列表到文件",
      panel_bottom_export_button: "导出配置",
      panel_bottom_import_button: "导入配置",
      panel_bottom_reset_button: "清空配置",
      panel_bottom_delete_button: "删除当前域名配置",
      panel_bottom_save_button: "保存",
      alert_delete_confirm: "确定要删除吗？此操作不可恢复。",
      alert_clear_confirm: "确定要清空整个列表吗？此操作不可恢复。",
      alert_invalid_file: "请选择有效的配置文件",
      alert_import_error: "导入配置失败",
      alert_list_empty: "列表已经是空的了",
      alert_url_exists: "该URL已存在！",
      alert_enter_url: "请输入有效的链接",
    },
  };

  let GLOBAL_CONFIG = {
    GLOBAL_KEYWORDS: true,
    GLOBAL_USERNAMES: true,

    LANGUAGE: navigator.language,

    CONFIG_SECTION_COLLAPSED: {
      global_SECTION_COLLAPSED: true,
      keywords_SECTION_COLLAPSED: true,
      usernames_SECTION_COLLAPSED: true,
      "data-interaction_SECTION_COLLAPSED": true,
    },
    EDITOR_STATES: {
      keywords: false,
      keywords_regex: false,
      usernames: false,
      usernames_regex: false,
      mainpage_url_patterns: false,

      contentpage_url_patterns: false,
      main_and_sub_page_title_xpath: false,
      main_and_sub_page_user_xpath: false,
      contentpage_title_xpath: false,
      contentpage_user_xpath: false,
    },
  };
  const SAMPLE_TEMPLATE = {
    domain: "",
    enabled: true,
    compatibilityMode: false,
    mainPageUrlPatterns: [],

    contentPageUrlPatterns: [],
    shareKeywordsAcrossPages: true,
    shareUsernamesAcrossPages: true,
    mainAndSubPageKeywords: {
      whitelistMode: false,
      xpath: [],
      keywords: [],
      regexPatterns: [],
    },
    mainAndSubPageUserKeywords: {
      whitelistMode: false,
      xpath: [],
      keywords: [],
      regexPatterns: [],
    },
    contentPageKeywords: {
      whitelistMode: false,
      xpath: [],
      keywords: [],
      regexPatterns: [],
    },
    contentPageUserKeywords: {
      whitelistMode: false,
      xpath: [],
      keywords: [],
      regexPatterns: [],
    },
  };
  const DEFAULT_CONFIG = [
    // 三十六雨论坛配置 - 使用共享配置
    {
      domain: "rain36-vip.japaneast.cloudapp.azure.com",
      enabled: true,
      compatibilityMode: false,
      sharedConfig: "20.78.120.16", // 指向共享配置的域名，包括URL模式
    },
    // 三十六雨论坛备用域名配置 - 使用共享配置
    {
      domain: "36rain.vip",
      enabled: true,
      compatibilityMode: false,
      sharedConfig: "20.78.120.16", // 指向共享配置的域名，包括URL模式
    },
  ];

  // 将外部JSON（如 universal-forum-block-config-*.json）中的结构规范化为内部结构
  function normalizeExternalUserConfigItem(rawItem) {
    if (!rawItem || typeof rawItem !== "object") return null;

    const normalized = JSON.parse(JSON.stringify(SAMPLE_TEMPLATE));

    // 域名可为字符串或数组：内部保留原样（字符串或数组），同时在运行时做匹配
    normalized.domain = rawItem.domain != null ? rawItem.domain : "";
    normalized.enabled = rawItem.enabled !== false;
    if (typeof rawItem.compatibilityMode === "boolean") {
      normalized.compatibilityMode = rawItem.compatibilityMode;
    }

    // 解析 urlPatterns → main/content 的正则与 XPath
    const urlPatterns = Array.isArray(rawItem.urlPatterns)
      ? rawItem.urlPatterns
      : [];
    // 保留统一的 urlPatterns，供自动匹配使用
    normalized.urlPatterns = urlPatterns;
    // 辅助：根据 name 或索引识别页面类型
    const matchType = (name, index) => {
      const n = String(name || "").toLowerCase();
      if (n.includes("主") || n.includes("main")) return "main";
      if (n.includes("内容") || n.includes("content")) return "content";
      return index === 0 ? "main" : index === 1 ? "content" : "unknown";
    };

    const mainPageUrlPatterns = [];
    const contentPageUrlPatterns = [];
    const mainTitleXPath = [];
    const mainUserXPath = [];
    const contentTitleXPath = [];
    const contentUserXPath = [];

    urlPatterns.forEach((entry, idx) => {
      const type = matchType(entry && entry.name, idx);
      const patterns = Array.isArray(entry && entry.patterns)
        ? entry.patterns
        : [];
      const xpath = (entry && entry.xpath) || {};
      const titleArr = Array.isArray(xpath.title) ? xpath.title : [];
      const userArr = Array.isArray(xpath.user) ? xpath.user : [];

      if (type === "main") {
        mainPageUrlPatterns.push(...patterns);
        mainTitleXPath.push(...titleArr);
        mainUserXPath.push(...userArr);
      } else if (type === "content") {
        contentPageUrlPatterns.push(...patterns);
        contentTitleXPath.push(...titleArr);
        contentUserXPath.push(...userArr);
      }
    });

    normalized.mainPageUrlPatterns = mainPageUrlPatterns;
    normalized.contentPageUrlPatterns = contentPageUrlPatterns;

    normalized.mainAndSubPageKeywords = normalized.mainAndSubPageKeywords || {};
    normalized.mainAndSubPageKeywords.xpath = mainTitleXPath;
    normalized.mainAndSubPageKeywords.keywords =
      normalized.mainAndSubPageKeywords.keywords || [];
    normalized.mainAndSubPageKeywords.regexPatterns =
      normalized.mainAndSubPageKeywords.regexPatterns || [];

    normalized.mainAndSubPageUserKeywords =
      normalized.mainAndSubPageUserKeywords || {};
    normalized.mainAndSubPageUserKeywords.xpath = mainUserXPath;
    normalized.mainAndSubPageUserKeywords.keywords =
      normalized.mainAndSubPageUserKeywords.keywords || [];
    normalized.mainAndSubPageUserKeywords.regexPatterns =
      normalized.mainAndSubPageUserKeywords.regexPatterns || [];

    normalized.contentPageKeywords = normalized.contentPageKeywords || {};
    normalized.contentPageKeywords.xpath = contentTitleXPath;
    normalized.contentPageKeywords.keywords =
      normalized.contentPageKeywords.keywords || [];
    normalized.contentPageKeywords.regexPatterns =
      normalized.contentPageKeywords.regexPatterns || [];

    normalized.contentPageUserKeywords =
      normalized.contentPageUserKeywords || {};
    normalized.contentPageUserKeywords.xpath = contentUserXPath;
    normalized.contentPageUserKeywords.keywords =
      normalized.contentPageUserKeywords.keywords || [];
    normalized.contentPageUserKeywords.regexPatterns =
      normalized.contentPageUserKeywords.regexPatterns || [];

    return normalized;
  }

  function loadUserConfig() {
    try {
      let userConfig = GM_getValue("userConfig");
      let globalConfig = GM_getValue("globalConfig");
      if (globalConfig) {
        const parsedConfig = JSON.parse(globalConfig);
        for (const key in parsedConfig) {
          if (key in GLOBAL_CONFIG) {
            GLOBAL_CONFIG[key] = parsedConfig[key];
          }
        }
        // 保留外部JSON中的全局关键字/用户名配置
        if (parsedConfig.globalKeywords) {
          GLOBAL_CONFIG.globalKeywords = parsedConfig.globalKeywords;
        }
        if (parsedConfig.globalUsernames) {
          GLOBAL_CONFIG.globalUsernames = parsedConfig.globalUsernames;
        }
      } else {
        GM_setValue("globalConfig", JSON.stringify(GLOBAL_CONFIG));
      }
      if (userConfig) {
        userConfig = JSON.parse(userConfig);
      }
      if (!userConfig || !Array.isArray(userConfig)) {
        userConfig = [];
      }
      let isNewConfig = false;
      DEFAULT_CONFIG.forEach((defaultItem) => {
        const existingConfig = userConfig.find(
          (config) => config.domain === defaultItem.domain
        );
        if (!existingConfig) {
          const newConfig = structuredClone(SAMPLE_TEMPLATE);
          Object.assign(newConfig, defaultItem);
          userConfig.push(newConfig);
          isNewConfig = true;
        }
      });
      if (isNewConfig) {
        saveUserConfig(userConfig);
      }
      return userConfig;
    } catch (error) {
      console.error("加载配置失败:", error);
      return DEFAULT_CONFIG;
    }
  }
  let isFirstLoad = true;
  let userConfig = loadUserConfig();
  function saveUserConfig(config) {
    try {
      GM_setValue("userConfig", JSON.stringify(config));
      if (isFirstLoad) {
        isFirstLoad = false;
      } else {
        updateUserConfig();
      }
    } catch (error) {
      console.error("保存配置失败:", error);
    }
  }
  function saveGlobalConfig() {
    try {
      GM_setValue("globalConfig", JSON.stringify(GLOBAL_CONFIG));
    } catch (error) {
      console.error("保存全局配置失败:", error);
    }
  }
  function updateUserConfig() {
    userConfig = loadUserConfig();
  }
  function getDomainConfig(domain) {
    // 支持 domain 为字符串或数组
    const config = userConfig.find((c) => {
      if (typeof c.domain === "string") return c.domain === domain;
      if (Array.isArray(c.domain)) return c.domain.includes(domain);
      return false;
    });

    // 如果找到配置且配置中有sharedConfig属性，则返回共享配置
    if (config && config.sharedConfig) {
      const sharedConfig = userConfig.find(
        (c) => c.domain === config.sharedConfig
      );
      if (sharedConfig) {
        // 完全共享配置：使用共享配置的所有内容，只保持当前域名
        return {
          ...sharedConfig,
          domain: domain, // 显示当前域名
        };
      }
    }

    // 若 config 的 domain 为数组，返回拷贝并替换为当前域名，便于 UI 显示
    if (config && Array.isArray(config.domain)) {
      return { ...config, domain: domain };
    }

    return config;
  }
  function addDomainConfig(configData) {
    if (!configData || !configData.domain) {
      console.error("添加配置失败: domain 是必填字段");
      return {
        success: false,
        message: "domain 是必填字段",
      };
    }
    // 检查是否与现有配置域名有重叠（支持字符串或数组）
    const hasOverlap = userConfig.some((c) => {
      const a = Array.isArray(c.domain) ? c.domain : [c.domain];
      const b = Array.isArray(configData.domain)
        ? configData.domain
        : [configData.domain];
      return a.some((d) => b.includes(d));
    });
    if (hasOverlap) {
      console.error("添加配置失败: 已存在相同domain的配置");
      return {
        success: false,
        message: "已存在相同domain的配置",
      };
    }
    const newConfig = JSON.parse(JSON.stringify(SAMPLE_TEMPLATE));
    Object.assign(newConfig, configData);
    userConfig.push(newConfig);
    saveUserConfig(userConfig);
    return {
      success: true,
      message: "配置添加成功",
      config: newConfig,
    };
  }

  // 根据域名重叠进行配置写入：如有重叠，先移除所有重叠项再写入（用于导入/覆盖场景）
  function upsertConfigByDomainOverlap(configData, override = false) {
    if (!configData || !configData.domain) return { success: false };
    const domainsNew = Array.isArray(configData.domain)
      ? configData.domain
      : [configData.domain];
    const overlapIndexes = [];
    userConfig.forEach((c, idx) => {
      const existing = Array.isArray(c.domain) ? c.domain : [c.domain];
      if (existing.some((d) => domainsNew.includes(d))) {
        overlapIndexes.push(idx);
      }
    });
    if (overlapIndexes.length === 0) {
      return addDomainConfig(configData);
    }
    // 覆盖策略：导入时优先覆盖，删除所有重叠项，写入新项
    // 注意：保持顺序，从后往前删
    for (let i = overlapIndexes.length - 1; i >= 0; i--) {
      userConfig.splice(overlapIndexes[i], 1);
    }
    const newConfig = JSON.parse(JSON.stringify(SAMPLE_TEMPLATE));
    Object.assign(newConfig, configData);
    userConfig.push(newConfig);
    saveUserConfig(userConfig);
    return { success: true, message: "配置覆盖写入成功", config: newConfig };
  }
  function removeDomainConfig(domain) {
    userConfig = userConfig.filter((config) => {
      if (typeof config.domain === "string") return config.domain !== domain;
      if (Array.isArray(config.domain)) return !config.domain.includes(domain);
      return true;
    });
    saveUserConfig(userConfig);
    return {
      success: true,
      message: "配置删除成功",
      config: userConfig,
    };
  }
  function updateDomainConfigOverride(domain, configData) {
    const index = userConfig.findIndex((config) => {
      if (typeof config.domain === "string") return config.domain === domain;
      if (Array.isArray(config.domain)) return config.domain.includes(domain);
      return false;
    });
    if (index !== -1) {
      userConfig[index] = configData;
      saveUserConfig(userConfig);
      return {
        success: true,
        message: "配置更新成功",
        config: userConfig[index],
      };
    }
  }
  function updateDomainConfig(domain, configData) {
    const index = userConfig.findIndex((config) => {
      if (typeof config.domain === "string") return config.domain === domain;
      if (Array.isArray(config.domain)) return config.domain.includes(domain);
      return false;
    });
    if (index !== -1) {
      const existingConfig = JSON.parse(JSON.stringify(userConfig[index]));
      for (const key in configData) {
        if (Array.isArray(configData[key])) {
          existingConfig[key] = [
            ...new Set([...(existingConfig[key] || []), ...configData[key]]),
          ];
        } else if (
          typeof configData[key] === "object" &&
          configData[key] !== null
        ) {
          existingConfig[key] = existingConfig[key] || {};
          for (const subKey in configData[key]) {
            if (Array.isArray(configData[key][subKey])) {
              existingConfig[key][subKey] = [
                ...new Set([
                  ...(existingConfig[key][subKey] || []),
                  ...configData[key][subKey],
                ]),
              ];
            } else {
              existingConfig[key][subKey] = configData[key][subKey];
            }
          }
        } else {
          existingConfig[key] = configData[key];
        }
      }
      userConfig[index] = existingConfig;
      saveUserConfig(userConfig);
      return {
        success: true,
        message: "配置更新成功",
        config: userConfig[index],
      };
    }
    return {
      success: false,
      message: "未找到指定域名的配置",
      config: null,
    };
  }

  // 数据交互配置写入辅助方法（支持 sharedConfig）
  function getEditableConfigForDomain(domain) {
    try {
      // 找到与当前域名匹配的配置索引
      let index = userConfig.findIndex((config) => {
        if (typeof config.domain === "string") return config.domain === domain;
        if (Array.isArray(config.domain)) return config.domain.includes(domain);
        return false;
      });

      if (index === -1) {
        return { index: -1, config: null };
      }

      // 若该配置指向 sharedConfig，则转向共享配置
      const cfg = userConfig[index];
      if (cfg && cfg.sharedConfig) {
        const sharedIndex = userConfig.findIndex(
          (c) => c.domain === cfg.sharedConfig
        );
        if (sharedIndex !== -1) {
          index = sharedIndex;
        }
      }

      return { index, config: userConfig[index] };
    } catch (e) {
      console.warn("getEditableConfigForDomain: 定位配置失败", e);
      return { index: -1, config: null };
    }
  }

  function ensureUrlPatternGroup(config, groupIndex) {
    if (!config) return null;
    if (!Array.isArray(config.urlPatterns)) {
      config.urlPatterns = [];
    }
    if (!config.urlPatterns[groupIndex]) {
      config.urlPatterns[groupIndex] = {
        name: `配置组 ${groupIndex + 1}`,
        patterns: [],
        xpath: { title: [], user: [] },
      };
    } else {
      const g = config.urlPatterns[groupIndex];
      if (!Array.isArray(g.patterns)) g.patterns = [];
      if (!g.xpath) g.xpath = {};
      if (!Array.isArray(g.xpath.title)) g.xpath.title = [];
      if (!Array.isArray(g.xpath.user)) g.xpath.user = [];
    }
    return config.urlPatterns[groupIndex];
  }

  // 统一的“数据交互列表”更新方法
  // key: 'patterns' | 'title' | 'user'
  // action: 'add' | 'delete' | 'clear' | 'bulkAdd'
  // 返回 { list: string[], added?: boolean, addedCount?: number }
  function mutateDIList(groupIndex, key, action, payload) {
    try {
      const domain = getCurrentDomain();
      const { index, config } = getEditableConfigForDomain(domain);
      if (index === -1 || !config) {
        return { list: [], added: false };
      }

      const group = ensureUrlPatternGroup(config, groupIndex);
      if (!group) return { list: [], added: false };

      let targetList = [];
      if (key === "patterns") targetList = group.patterns;
      else if (key === "title") targetList = group.xpath.title;
      else if (key === "user") targetList = group.xpath.user;
      else return { list: [], added: false };

      if (action === "add") {
        const beforeLen = targetList.length;
        const text = typeof payload === "string" ? payload.trim() : "";
        if (text && !targetList.includes(text)) {
          targetList.push(text);
        }
        saveUserConfig(userConfig);
        return {
          list: targetList.slice(),
          added: targetList.length > beforeLen,
        };
      }

      if (action === "delete") {
        if (
          typeof payload === "number" &&
          payload >= 0 &&
          payload < targetList.length
        ) {
          targetList.splice(payload, 1);
        }
        saveUserConfig(userConfig);
        return { list: targetList.slice(), added: false };
      }

      if (action === "clear") {
        targetList.length = 0;
        saveUserConfig(userConfig);
        return { list: [], added: false };
      }

      if (action === "bulkAdd" && Array.isArray(payload)) {
        let addedCount = 0;
        payload.forEach((item) => {
          const text = typeof item === "string" ? item.trim() : "";
          if (text && !targetList.includes(text)) {
            targetList.push(text);
            addedCount++;
          }
        });
        saveUserConfig(userConfig);
        return { list: targetList.slice(), addedCount };
      }

      return { list: targetList.slice(), added: false };
    } catch (e) {
      console.warn("mutateDIList: 更新失败", e);
      return { list: [], added: false };
    }
  }

  // 计算下一个“新增配置”默认名称
  function getNextDIGroupName() {
    try {
      const domain = getCurrentDomain();
      const { config } = getEditableConfigForDomain(domain);
      const list = Array.isArray(config && config.urlPatterns)
        ? config.urlPatterns
        : [];
      let maxSuffix = 0;
      list.forEach((g) => {
        const nm = g && g.name ? String(g.name) : "";
        const m = nm.match(/^新增配置(\d+)$/);
        if (m) {
          const n = parseInt(m[1], 10);
          if (!isNaN(n) && n > maxSuffix) maxSuffix = n;
        }
      });
      return `新增配置${maxSuffix + 1}`;
    } catch (e) {
      return "新增配置1";
    }
  }

  // 数据交互：新增配置组
  function addDIGroup(name) {
    try {
      const domain = getCurrentDomain();
      const { index, config } = getEditableConfigForDomain(domain);
      if (index === -1 || !config) return { success: false };
      if (!Array.isArray(config.urlPatterns)) config.urlPatterns = [];
      const newIndex = config.urlPatterns.length;
      const group = {
        name:
          name && String(name).trim()
            ? String(name).trim()
            : getNextDIGroupName(),
        patterns: [],
        xpath: { title: [], user: [] },
      };
      config.urlPatterns.push(group);
      saveUserConfig(userConfig);
      return { success: true, index: newIndex };
    } catch (e) {
      console.warn("addDIGroup: 失败", e);
      return { success: false };
    }
  }

  // 数据交互：删除配置组
  function removeDIGroup(groupIndex) {
    try {
      const domain = getCurrentDomain();
      const { index, config } = getEditableConfigForDomain(domain);
      if (index === -1 || !config) return { success: false };
      if (!Array.isArray(config.urlPatterns)) return { success: false };
      if (groupIndex < 0 || groupIndex >= config.urlPatterns.length)
        return { success: false };
      config.urlPatterns.splice(groupIndex, 1);
      saveUserConfig(userConfig);
      return { success: true };
    } catch (e) {
      console.warn("removeDIGroup: 失败", e);
      return { success: false };
    }
  }

  // 数据交互：重命名配置组
  function renameDIGroup(groupIndex, newName) {
    try {
      const domain = getCurrentDomain();
      const { index, config } = getEditableConfigForDomain(domain);
      if (index === -1 || !config) return { success: false };
      if (!Array.isArray(config.urlPatterns)) return { success: false };
      if (groupIndex < 0 || groupIndex >= config.urlPatterns.length)
        return { success: false };
      const name = String(newName || "").trim();
      config.urlPatterns[groupIndex].name = name || `配置组 ${groupIndex + 1}`;
      saveUserConfig(userConfig);
      return { success: true };
    } catch (e) {
      console.warn("renameDIGroup: 失败", e);
      return { success: false };
    }
  }

  //获取数组中的元素，支持负索引。
  function getArrayElement(array, index) {
    // 参数验证
    if (!Array.isArray(array)) {
      console.warn("getArrayElement: 第一个参数必须是数组", array);
      return null;
    }

    if (array.length === 0) {
      return null;
    }

    const numericIndex = Number(index);
    if (isNaN(numericIndex)) {
      console.warn("getArrayElement: 索引必须是有效的数字", index);
      return null;
    }

    const adjustedIndex =
      numericIndex < 0 ? array.length + numericIndex : numericIndex;

    if (adjustedIndex < 0 || adjustedIndex >= array.length) {
      console.warn("getArrayElement: 索引超出范围", {
        index,
        adjustedIndex,
        arrayLength: array.length,
      });
      return null;
    }

    return array[adjustedIndex];
  }
  function getElementsByText(
    xpath,
    searchText,
    useRegex = false,
    whitelistMode = false
  ) {
    console.log(`[屏蔽插件调试] getElementsByText 调用:`, {
      xpath: xpath,
      searchText: searchText,
      useRegex: useRegex,
      whitelistMode: whitelistMode,
    });

    // 参数验证
    if (!xpath || typeof xpath !== "string") {
      console.warn("getElementsByText: 无效的XPath参数", xpath);
      return [];
    }

    // 生成唯一的缓存键
    const cacheKey = `${xpath}|${searchText}|${useRegex}|${whitelistMode}`;

    // 检查结果缓存
    if (CACHE.queryResults.has(cacheKey)) {
      CACHE.stats.hits++;
      console.log(`[屏蔽插件调试] 使用缓存结果`);
      return CACHE.queryResults.get(cacheKey);
    }

    CACHE.stats.misses++;

    // 解析split配置
    const { cleanXPath, splitConfig } = parseSplitConfig(xpath);
    console.log(`[屏蔽插件调试] 解析后的XPath:`, cleanXPath);

    // 准备搜索模式
    const searchPattern = prepareSearchPattern(searchText, useRegex);
    console.log(`[屏蔽插件调试] 搜索模式:`, searchPattern);

    // 使用优化的XPath评估
    const result = evaluateXPath(
      cleanXPath,
      document,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
    );

    console.log(
      `[屏蔽插件调试] XPath查询结果数量:`,
      result?.snapshotLength || 0
    );

    if (!result || result.snapshotLength === 0) {
      // 缓存空结果
      CACHE.queryResults.set(cacheKey, []);
      console.log(`[屏蔽插件调试] 没有找到匹配的XPath结果`);
      return [];
    }

    // 处理元素匹配
    const elements = processElements(
      result,
      searchText,
      searchPattern,
      splitConfig,
      useRegex,
      whitelistMode
    );
    console.log(`[屏蔽插件调试] 处理后的元素数量:`, elements.length);

    // 缓存结果（如果元素数量不超过阈值）
    if (elements.length < 100) {
      CACHE.queryResults.set(cacheKey, elements);
    }

    return elements;
  }

  // 解析split配置
  function parseSplitConfig(xpath) {
    let cleanXPath = xpath;
    let splitConfig = null;

    if (xpath.includes("/split")) {
      const parts = xpath.split("/split");
      cleanXPath = parts[0]; // 实际XPath

      const regex = /\(([^)]+)\)/;
      const match = parts[1].match(regex);
      if (match) {
        const params = match[1]
          .split(",")
          .map((param) => param.trim().replace(/^['"]|['"]$/g, ""));
        if (params.length === 3) {
          splitConfig = {
            char: params[0],
            index: params[1],
            attrName: params[2],
            isAttrSplit: true,
          };
        }
      }
    }

    return { cleanXPath, splitConfig };
  }

  // 准备搜索模式
  function prepareSearchPattern(searchText, useRegex) {
    if (!searchText) return null;

    if (useRegex) {
      return getRegExp(searchText);
    }

    return typeof searchText === "string"
      ? searchText.toLowerCase()
      : searchText;
  }

  // 处理元素匹配
  function processElements(
    result,
    searchText,
    searchPattern,
    splitConfig,
    useRegex,
    whitelistMode
  ) {
    const elements = [];
    const snapshotLength = result.snapshotLength;

    // 如果没有搜索文本，直接返回所有元素
    if (!searchText) {
      elements.length = snapshotLength;
      for (let i = 0; i < snapshotLength; i++) {
        elements[i] = result.snapshotItem(i);
      }
      return elements;
    }

    // 处理每个元素
    for (let i = 0; i < snapshotLength; i++) {
      const element = result.snapshotItem(i);
      if (!element) continue;

      const isMatch = checkElementMatch(
        element,
        searchPattern,
        splitConfig,
        useRegex
      );

      // 根据白名单模式决定是否添加元素
      if (whitelistMode ? !isMatch : isMatch) {
        elements.push(element);
      }
    }

    return elements;
  }

  // 检查元素是否匹配
  function checkElementMatch(element, searchPattern, splitConfig, useRegex) {
    let elementText;

    try {
      if (splitConfig && splitConfig.isAttrSplit) {
        elementText = extractAttributeText(element, splitConfig);
      } else {
        elementText = element.textContent?.trim() || "";
      }

      if (!elementText) return false;

      if (useRegex) {
        return searchPattern && searchPattern.test(elementText);
      } else {
        return (
          typeof elementText === "string" &&
          typeof searchPattern === "string" &&
          elementText.toLowerCase().includes(searchPattern)
        );
      }
    } catch (e) {
      console.warn("checkElementMatch: 元素匹配检查失败", e);
      return false;
    }
  }

  // 提取属性文本
  function extractAttributeText(element, splitConfig) {
    const attrValue = element.getAttribute(splitConfig.attrName);
    if (!attrValue) return null;

    const args_array = attrValue.split(splitConfig.char);
    return getArrayElement(args_array, splitConfig.index);
  }
  function extractStrings(input) {
    const result = [];
    let temp = "";
    for (let i = 0; i < input.length; i++) {
      if (input[i] === "/") {
        if (temp) {
          result.push(temp);
          temp = "";
        }
        continue;
      }
      temp += input[i];
    }
    if (temp) result.push(temp);
    return result;
  }
  function findTargetAncestor(xpath, element) {
    let cleanXPath = xpath;
    if (!xpath.endsWith("/text()")) {
      cleanXPath = xpath.replace(/\/text\(\)$/, "");
    }
    if (cleanXPath.includes("/@")) {
      cleanXPath = cleanXPath.split("/@")[0];
    }
    const xpathParts = extractStrings(cleanXPath);
    if (xpathParts.length > 2) {
      let elementNode = element;
      if (element.nodeType === Node.TEXT_NODE) {
        elementNode = element.parentElement;
      } else if (element.nodeType === Node.ATTRIBUTE_NODE) {
        elementNode = element.ownerElement;
      }
      const intermediateSelector = parseXPathPart(xpathParts[1]);
      const intermediateElement = elementNode.closest(intermediateSelector);
      if (intermediateElement) {
        const rootSelector = parseXPathPart(xpathParts[0]);
        let targetElement = intermediateElement.closest(rootSelector);
        if (targetElement === intermediateElement) {
          targetElement =
            intermediateElement.parentElement.closest(rootSelector);
        }
        return {
          targetElement,
          firstElementInXPath: xpathParts[0],
        };
      }
    }
    const firstElementMatch = xpath.match(
      /\/+([a-zA-Z0-9_-]+(?:\[[^\]]+\])?)/
    )?.[1];
    if (!firstElementMatch) {
      return {
        targetElement: element,
        firstElementInXPath: null,
      };
    }
    let [elementType, attributeSelector] = firstElementMatch.includes("[")
      ? firstElementMatch.split("[")
      : [firstElementMatch, null];
    const cleanAttributeSelector = attributeSelector?.replace("]", "");
    let elementNode = element;
    if (element.nodeType === Node.TEXT_NODE) {
      elementNode = element.parentElement;
    } else if (element.nodeType === Node.ATTRIBUTE_NODE) {
      elementNode = element.ownerElement;
    }
    const cssSelector = cleanAttributeSelector
      ? `${elementType}[${cleanAttributeSelector.replace("@", "")}]`
      : elementType;
    const targetElement =
      elementType && elementNode
        ? elementNode.closest(cssSelector)
        : elementNode;
    return {
      targetElement,
      firstElementInXPath: firstElementMatch,
    };
  }
  function parseXPathPart(xpathPart) {
    const elementMatch = xpathPart.match(/([a-zA-Z0-9_-]+)(?:\[(.*?)\])?/);
    if (!elementMatch) return xpathPart;
    const [, tag, attribute] = elementMatch;
    if (!attribute) return tag;
    const attrMatch = attribute.match(
      /@([a-zA-Z0-9_-]+)(?:=['"]([^'"]+)['"])?/
    );
    if (!attrMatch) return tag;
    const [, attrName, attrValue] = attrMatch;
    return attrValue
      ? `${tag}[${attrName}="${attrValue}"]`
      : `${tag}[${attrName}]`;
  }

  function removeElementsByText(
    xpath,
    searchText,
    useRegex = false,
    whitelistMode = false
  ) {
    console.log(`[屏蔽插件调试] removeElementsByText 调用:`, {
      xpath: xpath,
      searchText: searchText,
      useRegex: useRegex,
      whitelistMode: whitelistMode,
    });

    // 参数验证
    if (!xpath || typeof xpath !== "string") {
      console.warn("removeElementsByText: 无效的XPath参数", xpath);
      return;
    }

    // 清理XPath
    const cleanXPath = xpath.endsWith("text()")
      ? xpath.replace(/\/text\(\)$/, "")
      : xpath;
    console.log(`[屏蔽插件调试] 清理后的XPath:`, cleanXPath);

    // 获取匹配元素
    const elements = getElementsByText(
      cleanXPath,
      searchText,
      useRegex,
      whitelistMode
    );

    console.log(`[屏蔽插件调试] 找到匹配元素数量:`, elements?.length || 0);
    if (elements && elements.length > 0) {
      console.log(`[屏蔽插件调试] 匹配的元素:`, elements);
    }

    if (!elements || elements.length === 0) {
      console.log(`[屏蔽插件调试] 没有找到匹配元素，跳过删除`);
      return;
    }

    // 批量处理元素以减少DOM重绘次数
    const elementsToRemove = collectElementsToRemove(elements, cleanXPath);
    console.log(`[屏蔽插件调试] 需要删除的元素数量:`, elementsToRemove.length);

    if (elementsToRemove.length === 0) {
      console.log(`[屏蔽插件调试] 没有需要删除的元素，跳过删除`);
      return;
    }

    // 批量删除元素，减少DOM重排次数
    console.log(`[屏蔽插件调试] 开始批量删除元素`);
    batchRemoveElements(elementsToRemove);
    console.log(`[屏蔽插件调试] 元素删除完成`);
  }

  // 收集需要删除的元素
  function collectElementsToRemove(elements, xpath) {
    const elementsToRemove = [];

    for (const element of elements) {
      if (!element) continue;

      try {
        const { targetElement } = findTargetAncestor(xpath, element);
        if (targetElement && targetElement.parentNode) {
          elementsToRemove.push(targetElement);
        }
      } catch (e) {
        console.warn("collectElementsToRemove: 处理元素失败", e);
        continue;
      }
    }

    return elementsToRemove;
  }

  // 批量删除元素
  function batchRemoveElements(elementsToRemove) {
    // 使用DocumentFragment进行批量操作
    const fragment = document.createDocumentFragment();
    const removedElements = [];

    for (const element of elementsToRemove) {
      try {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
          removedElements.push(element);
        }
      } catch (e) {
        console.warn("batchRemoveElements: 删除元素失败", e);
        continue;
      }
    }
  }

  // 批量按多关键词/正则移除（单次 XPath 评估，显著减小卡顿）
  function removeElementsByTerms(
    xpath,
    stringTerms = [],
    regexTerms = [],
    whitelistMode = false
  ) {
    try {
      if (!xpath || typeof xpath !== "string") return;

      const { cleanXPath, splitConfig } = parseSplitConfig(xpath);

      const normalizedStrings = Array.isArray(stringTerms)
        ? stringTerms
            .filter((s) => typeof s === "string" && s.trim())
            .map((s) => s.toLowerCase())
        : [];
      const compiledRegexes = Array.isArray(regexTerms)
        ? regexTerms
            .filter((s) => typeof s === "string" && s.trim())
            .map((p) => getRegExp(p))
        : [];

      if (normalizedStrings.length === 0 && compiledRegexes.length === 0) {
        return;
      }

      const result = evaluateXPath(
        cleanXPath,
        document,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
      );
      if (!result || result.snapshotLength === 0) return;

      const elementsToRemove = [];
      for (let i = 0; i < result.snapshotLength; i++) {
        const element = result.snapshotItem(i);
        if (!element) continue;

        let elementText = "";
        try {
          if (splitConfig && splitConfig.isAttrSplit) {
            elementText = extractAttributeText(element, splitConfig) || "";
          } else {
            elementText = element.textContent?.trim() || "";
          }
        } catch (e) {
          continue;
        }

        if (!elementText) continue;

        const lower = elementText.toLowerCase();
        let matched = false;

        // 字符串包含匹配
        for (let j = 0; j < normalizedStrings.length; j++) {
          const s = normalizedStrings[j];
          if (s && lower.includes(s)) {
            matched = true;
            break;
          }
        }

        // 正则匹配（仅在未命中字符串时）
        if (!matched) {
          for (let j = 0; j < compiledRegexes.length; j++) {
            const r = compiledRegexes[j];
            try {
              if (r && r.test(elementText)) {
                matched = true;
                break;
              }
            } catch (e) {}
          }
        }

        // 白名单模式：取反
        if (whitelistMode ? !matched : matched) {
          const { targetElement } = findTargetAncestor(cleanXPath, element);
          if (targetElement && targetElement.parentNode) {
            elementsToRemove.push(targetElement);
          }
        }
      }

      if (elementsToRemove.length > 0) {
        batchRemoveElements(elementsToRemove);
      }
    } catch (e) {
      console.warn("removeElementsByTerms: 处理失败", e);
    }
  }

  let PANEL_SETTINGS = GM_getValue("panelSettings", {
    expandMode: "click", // 固定为点击展开模式
  });

  function getCurrentDomain() {
    const currentUrl = new URL(window.location.href);
    const baseDomain = currentUrl.hostname.replace(/^www\./, "");
    return baseDomain;
  }

  // 全局状态管理，防止重复操作
  window._overlayState = window._overlayState || {
    isCreating: false,
    isRemoving: false,
    lastAction: null,
    lastActionTime: 0,
    actionCooldown: 500, // 操作冷却时间（毫秒）
    enabled: true,
  };

  // 创建页面加载遮罩层
  function createPageLoadingOverlay() {
    const now = Date.now();

    // 如果未启用遮罩创建，直接返回（若已有则返回已有遮罩）
    if (!window._overlayState.enabled) {
      return (
        document.getElementById("page-loading-overlay") ||
        document.getElementById("early-page-loading-overlay") ||
        null
      );
    }

    // 检查冷却时间
    if (
      now - window._overlayState.lastActionTime <
      window._overlayState.actionCooldown
    ) {
      return (
        document.getElementById("page-loading-overlay") ||
        document.getElementById("early-page-loading-overlay")
      );
    }

    // 防止重复创建
    if (window._overlayState.isCreating) {
      return (
        document.getElementById("page-loading-overlay") ||
        document.getElementById("early-page-loading-overlay")
      );
    }

    // 检查是否存在任何类型的遮罩层
    const existingOverlay =
      document.getElementById("page-loading-overlay") ||
      document.getElementById("early-page-loading-overlay");

    if (existingOverlay) {
      // 如果存在早期遮罩，将其ID改为常规ID
      if (existingOverlay.id === "early-page-loading-overlay") {
        existingOverlay.id = "page-loading-overlay";
        const earlyIndicator = document.getElementById(
          "early-loading-indicator"
        );
        if (earlyIndicator) {
          earlyIndicator.id = "loading-indicator";
        }
        // 如果早期遮罩不在body中，将其移动到body
        if (existingOverlay.parentNode !== document.body) {
          document.body.appendChild(existingOverlay);
        }
      }
      return existingOverlay;
    }

    // 设置创建状态
    window._overlayState.isCreating = true;
    window._overlayState.lastAction = "create";
    window._overlayState.lastActionTime = now;

    // 创建新的遮罩层
    const overlay = document.createElement("div");
    overlay.id = "page-loading-overlay";

    const loadingIndicator = document.createElement("div");
    loadingIndicator.id = "loading-indicator";

    overlay.appendChild(loadingIndicator);
    document.body.appendChild(overlay);

    // 重置创建状态
    window._overlayState.isCreating = false;

    return overlay;
  }

  // 移除页面加载遮罩层
  function removePageLoadingOverlay() {
    const now = Date.now();

    // 检查冷却时间
    if (
      now - window._overlayState.lastActionTime <
      window._overlayState.actionCooldown
    ) {
      return;
    }

    // 防止重复移除
    if (window._overlayState.isRemoving) {
      return;
    }

    // 检查两种可能的遮罩层ID
    const overlay =
      document.getElementById("page-loading-overlay") ||
      document.getElementById("early-page-loading-overlay");

    if (!overlay) return;

    // 如果已经在隐藏过程中，直接返回
    if (overlay.classList.contains("hiding")) {
      return;
    }

    // 设置移除状态
    window._overlayState.isRemoving = true;
    window._overlayState.lastAction = "remove";
    window._overlayState.lastActionTime = now;

    // 使用requestAnimationFrame确保动画流畅
    requestAnimationFrame(() => {
      // 添加淡出动画类
      overlay.classList.add("hiding");

      // 停止所有动画
      const indicator = overlay.querySelector(
        "#early-loading-indicator, #loading-indicator"
      );
      if (indicator) {
        indicator.style.animationPlayState = "paused";
      }

      const progressBar = overlay.querySelector("#early-loading-progress-bar");
      if (progressBar) {
        progressBar.style.animationPlayState = "paused";
      }

      // 监听过渡结束事件
      overlay.addEventListener(
        "transitionend",
        function handleTransitionEnd(e) {
          // 只处理opacity的过渡结束
          if (e.propertyName === "opacity") {
            // 移除事件监听
            overlay.removeEventListener("transitionend", handleTransitionEnd);
            // 移除元素
            if (overlay.parentNode) {
              overlay.parentNode.removeChild(overlay);
            }
            // 重置移除状态
            window._overlayState.isRemoving = false;
          }
        }
      );

      // 备用方案：如果过渡事件没有触发，确保在合理时间后移除
      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        // 重置移除状态
        window._overlayState.isRemoving = false;
      }, 800);
    });
  }

  function handleElements() {
    console.log("[屏蔽插件调试] handleElements 开始执行");

    // 防止在移除过程中重复执行
    if (window._overlayState.isRemoving) {
      console.log("[屏蔽插件调试] 正在移除遮罩，跳过执行");
      return;
    }

    const currentConfig = getDomainConfig(getCurrentDomain());
    console.log("[屏蔽插件调试] 当前配置:", currentConfig);

    if (!currentConfig || !currentConfig.enabled) {
      // 如果没有配置或禁用了，立即移除遮罩
      console.log("[屏蔽插件调试] 没有配置或已禁用，移除遮罩");
      removePageLoadingOverlay();
      return;
    }

    // 获取当前URL与匹配到的 XPath（统一模式，无页面类型区分）
    const currentUrl = getSplitUrl();
    const matchedXpaths = getMatchedXpathsFromUrlPatterns(
      currentConfig,
      currentUrl
    );
    console.log("[屏蔽插件调试] 当前URL与匹配到的XPath:", {
      currentUrl,
      matchedXpaths,
    });

    // 获取屏蔽规则
    const filterRules = getFilterRules(currentConfig, "unified");

    if (
      !filterRules.hasRules ||
      (matchedXpaths.titleXpaths.length === 0 &&
        matchedXpaths.userXpaths.length === 0)
    ) {
      // 没有规则或未匹配到可用 XPath，立即移除遮罩
      console.log("[屏蔽插件调试] 没有屏蔽规则或未匹配到XPath，移除遮罩");
      removePageLoadingOverlay();
      return;
    }

    // 创建遮罩层（只有在需要时才创建）
    createPageLoadingOverlay();

    // 执行屏蔽操作
    console.log("[屏蔽插件调试] 开始执行屏蔽规则（统一模式）");
    executeUnifiedFilter(currentConfig, filterRules, matchedXpaths);

    // 检查并添加侧边栏选项
    addSidebarOption();

    // 过滤已执行完，尽快移除遮罩，避免页面“已加载还等很久”的体感
    // 若 APP 仍在渐进初始化，会在后续阶段再次确认移除
    setTimeout(() => {
      try {
        removePageLoadingOverlay();
      } catch (e) {}
    }, 0);
  }

  // 添加侧边栏选项
  function addSidebarOption() {
    // 检测是否存在侧边栏
    const sidebar = document.querySelector(".byg_sidenav.show");
    if (!sidebar) return;

    // 检查是否已经添加过选项
    const existingOption = sidebar.querySelector(".byg-main-button-option");
    if (existingOption) {
      // 如果已存在，更新状态
      updateSidebarOptionState(existingOption);
      return;
    }

    // 获取菜单列表
    const menuList = sidebar.querySelector(".sidenav-menu");
    if (!menuList) return;

    // 创建新的菜单项
    const menuItem = document.createElement("li");
    menuItem.className = "byg-main-button-option";

    // 获取当前主按钮状态（仅根据用户偏好）
    const isMainButtonHidden = !buttonVisible;

    menuItem.innerHTML = `
            <a href="javascript:void(0);" class="sidebar-main-button-toggle">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPgo=" alt="主按钮">
                <span class="main-button-text">${
                  isMainButtonHidden ? "显示主按钮" : "隐藏主按钮"
                }</span>
            </a>
        `;

    // 添加事件监听器（避免重复绑定）
    const toggleLink = menuItem.querySelector(".sidebar-main-button-toggle");
    toggleLink.addEventListener("click", function (e) {
      e.preventDefault();
      toggleMainButtonFromSidebar();
    });

    // 将新菜单项添加到菜单列表的开头
    menuList.insertBefore(menuItem, menuList.firstChild);

    // 设置初始状态
    updateSidebarOptionState(menuItem);
  }

  // 更新侧边栏选项状态
  function updateSidebarOptionState(optionElement) {
    if (!optionElement) return;

    const isMainButtonHidden = !buttonVisible;
    const textElement = optionElement.querySelector(".main-button-text");
    const linkElement = optionElement.querySelector("a");

    if (textElement) {
      const desiredText = isMainButtonHidden ? "显示主按钮" : "隐藏主按钮";
      if (textElement.textContent !== desiredText) {
        textElement.textContent = desiredText;
      }
    }

    // 将 active 状态加在 li 上，匹配现有样式 `.byg-main-button-option.active a`
    const liElement = optionElement.closest("li") || optionElement;
    if (liElement) {
      const hasActive = liElement.classList.contains("active");
      if (isMainButtonHidden && !hasActive) {
        liElement.classList.add("active");
      } else if (!isMainButtonHidden && hasActive) {
        liElement.classList.remove("active");
      }
    }
  }

  // 从侧边栏切换主按钮状态
  function toggleMainButtonFromSidebar() {
    // 切换主按钮状态
    buttonVisible = !buttonVisible;

    // 保存按钮可见性状态
    GM_setValue("buttonVisible", buttonVisible);

    const panel = document.getElementById("forum-filter-panel");
    if (!panel) return;

    // 如果隐藏按钮且交互页面已打开，先关闭交互页面
    if (!buttonVisible) {
      if (panel && panel.classList.contains("expanded")) {
        panel.classList.remove("expanded");
        panel.style.left = "10px";
        panel.style.transform = "translate(-50%, -50%)";
      }
    }

    // 重新创建面板以应用新的按钮状态
    if (panel.parentNode) {
      panel.parentNode.removeChild(panel);
    }
    createControlPanel();

    // 更新侧边栏选项状态
    const sidebarOption = document.querySelector(".byg-main-button-option");
    if (sidebarOption) {
      updateSidebarOptionState(sidebarOption);
    }
  }

  // 监听侧边栏出现/显示状态变化，存在则自动添加对应选项
  function initSidebarOptionAutoAdd() {
    const safeAdd = debounce(() => {
      try {
        addSidebarOption();
      } catch (e) {}
    }, 100);

    const check = () => {
      try {
        const sidebar = document.querySelector(".byg_sidenav");
        if (
          sidebar &&
          sidebar.classList &&
          sidebar.classList.contains("show")
        ) {
          safeAdd();
        }
        // 同步悬浮按钮与用户偏好（不受侧边栏影响）
        syncFloatingButtonVisibilityWithSidebar();
      } catch (e) {}
    };

    // 初始检查（延迟一次，等待侧边栏 DOM 完整渲染）
    setTimeout(check, 0);

    // 如已有观察者，先断开
    try {
      if (
        APP &&
        APP.sidebarObserver &&
        typeof APP.sidebarObserver.disconnect === "function"
      ) {
        APP.sidebarObserver.disconnect();
      }
    } catch (e) {}

    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (m.type === "childList") {
          shouldCheck = true;
          break;
        }
        if (m.type === "attributes") {
          const t = m.target;
          if (
            t &&
            t.nodeType === 1 &&
            t.classList &&
            t.classList.contains("byg_sidenav")
          ) {
            shouldCheck = true;
            break;
          }
        }
      }
      if (shouldCheck) check();
    });

    try {
      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
      });
    } catch (e) {}

    try {
      if (typeof APP !== "undefined") {
        APP.sidebarObserver = observer;
      } else {
        window._sidebarObserver = observer;
      }
    } catch (e) {}
  }

  // 确定页面类型
  function determinePageType(currentConfig, currentUrl) {
    const isMainPage = testUrlPatterns(
      currentConfig.mainPageUrlPatterns || [],
      currentUrl
    );

    const isContentPage = testUrlPatterns(
      currentConfig.contentPageUrlPatterns || [],
      currentUrl
    );

    console.log("[屏蔽插件调试] 页面类型判断:", {
      currentUrl: currentUrl,
      isMainPage: isMainPage,
      isContentPage: isContentPage,
      mainPagePatterns: currentConfig.mainPageUrlPatterns,
      contentPagePatterns: currentConfig.contentPageUrlPatterns,
    });

    if (isMainPage) return "main";
    if (isContentPage) return "content";
    return "unknown";
  }

  // 基于统一的 urlPatterns 自动匹配并收集 XPath（无主页/内容页区分）
  function getMatchedXpathsFromUrlPatterns(currentConfig, currentUrl) {
    const result = { titleXpaths: [], userXpaths: [] };
    try {
      const patternsArr = Array.isArray(
        currentConfig && currentConfig.urlPatterns
      )
        ? currentConfig.urlPatterns
        : [];
      patternsArr.forEach((entry) => {
        const patterns = Array.isArray(entry && entry.patterns)
          ? entry.patterns
          : [];
        if (patterns.length === 0) return;
        if (testUrlPatterns(patterns, currentUrl)) {
          const xp = entry && entry.xpath ? entry.xpath : {};
          if (Array.isArray(xp.title)) {
            result.titleXpaths.push(...xp.title);
          }
          if (Array.isArray(xp.user)) {
            result.userXpaths.push(...xp.user);
          }
        }
      });
    } catch (e) {
      console.warn("getMatchedXpathsFromUrlPatterns: 解析失败", e);
    }
    return result;
  }

  // 获取第一个匹配当前URL的配置组名称
  function getFirstMatchedGroupName(currentConfig, currentUrl) {
    try {
      const patternsArr = Array.isArray(
        currentConfig && currentConfig.urlPatterns
      )
        ? currentConfig.urlPatterns
        : [];
      for (let i = 0; i < patternsArr.length; i++) {
        const entry = patternsArr[i];
        const patterns = Array.isArray(entry && entry.patterns)
          ? entry.patterns
          : [];
        if (patterns.length === 0) continue;
        if (testUrlPatterns(patterns, currentUrl)) {
          const n = entry && entry.name;
          return typeof n === "string" && n.trim()
            ? n.trim()
            : `配置组 ${i + 1}`;
        }
      }
    } catch (e) {
      console.warn("getFirstMatchedGroupName: 解析失败", e);
    }
    return "";
  }

  // 获取屏蔽规则
  function getFilterRules(currentConfig, pageType) {
    const rules = {
      keywords: [],
      keywords_regex: [],
      usernames: [],
      usernames_regex: [],
      hasRules: false,
    };

    // 获取关键词规则：优先使用全局，其次共享，最后页面特定
    const gk = getGlobalKeywords();
    const gkr = getGlobalKeywordsRegex();
    if ((gk && gk.length) || (gkr && gkr.length)) {
      rules.keywords = gk || [];
      rules.keywords_regex = gkr || [];
    } else if (currentConfig.shareKeywordsAcrossPages) {
      rules.keywords = getSharedKeywords(currentConfig);
      rules.keywords_regex = getSharedKeywordsRegex(currentConfig);
    } else {
      const pageKeywords = getPageSpecificKeywords(currentConfig, pageType);
      rules.keywords = pageKeywords.keywords;
      rules.keywords_regex = pageKeywords.regex;
    }

    // 获取用户名规则：优先使用全局，其次共享，最后页面特定
    const gu = getGlobalUsernames();
    const gur = getGlobalUsernamesRegex();
    if ((gu && gu.length) || (gur && gur.length)) {
      rules.usernames = gu || [];
      rules.usernames_regex = gur || [];
    } else if (currentConfig.shareUsernamesAcrossPages) {
      rules.usernames = getSharedUsernames(currentConfig);
      rules.usernames_regex = getSharedUsernamesRegex(currentConfig);
    } else {
      const pageUsernames = getPageSpecificUsernames(currentConfig, pageType);
      rules.usernames = pageUsernames.usernames;
      rules.usernames_regex = pageUsernames.regex;
    }

    rules.hasRules =
      rules.keywords.length > 0 ||
      rules.keywords_regex.length > 0 ||
      rules.usernames.length > 0 ||
      rules.usernames_regex.length > 0;

    console.log("[屏蔽插件调试] 屏蔽规则获取:", {
      pageType: pageType,
      globalUsernames: GLOBAL_CONFIG.GLOBAL_USERNAMES,
      shareUsernamesAcrossPages: currentConfig.shareUsernamesAcrossPages,
      usernames: rules.usernames,
      usernames_regex: rules.usernames_regex,
      hasRules: rules.hasRules,
      mainAndSubPageUserKeywords: currentConfig.mainAndSubPageUserKeywords,
      contentPageUserKeywords: currentConfig.contentPageUserKeywords,
    });

    return rules;
  }

  // 获取全局关键词
  function getGlobalKeywords() {
    // 优先使用外部JSON的 globalKeywords
    if (
      GLOBAL_CONFIG.globalKeywords &&
      Array.isArray(GLOBAL_CONFIG.globalKeywords.keywords)
    ) {
      return [...new Set(GLOBAL_CONFIG.globalKeywords.keywords)];
    }
    return [
      ...new Set(
        userConfig.reduce(
          (acc, config) => [
            ...acc,
            ...(config.mainAndSubPageKeywords?.keywords || []),
            ...(config.contentPageKeywords?.keywords || []),
          ],
          []
        )
      ),
    ];
  }

  // 获取全局关键词正则
  function getGlobalKeywordsRegex() {
    if (
      GLOBAL_CONFIG.globalKeywords &&
      Array.isArray(GLOBAL_CONFIG.globalKeywords.regexPatterns)
    ) {
      return [...new Set(GLOBAL_CONFIG.globalKeywords.regexPatterns)];
    }
    return [
      ...new Set(
        userConfig.reduce(
          (acc, config) => [
            ...acc,
            ...(config.mainAndSubPageKeywords?.regexPatterns || []),
            ...(config.contentPageKeywords?.regexPatterns || []),
          ],
          []
        )
      ),
    ];
  }

  // 获取共享关键词
  function getSharedKeywords(currentConfig) {
    // 优先使用主页的关键词，如果内容页有关键词则合并
    const mainKeywords = currentConfig.mainAndSubPageKeywords?.keywords || [];
    const contentKeywords = currentConfig.contentPageKeywords?.keywords || [];

    // 如果内容页没有关键词，直接使用主页的关键词
    if (contentKeywords.length === 0) {
      return mainKeywords;
    }

    // 如果内容页有关键词，则合并主页和内容页的关键词
    return [...new Set([...mainKeywords, ...contentKeywords])];
  }

  // 获取共享关键词正则
  function getSharedKeywordsRegex(currentConfig) {
    // 优先使用主页的关键词正则，如果内容页有正则则合并
    const mainRegex = currentConfig.mainAndSubPageKeywords?.regexPatterns || [];
    const contentRegex = currentConfig.contentPageKeywords?.regexPatterns || [];

    // 如果内容页没有正则，直接使用主页的正则
    if (contentRegex.length === 0) {
      return mainRegex;
    }

    // 如果内容页有正则，则合并主页和内容页的正则
    return [...new Set([...mainRegex, ...contentRegex])];
  }

  // 获取页面特定关键词
  function getPageSpecificKeywords(currentConfig, pageType) {
    if (pageType === "main") {
      return {
        keywords: currentConfig.mainAndSubPageKeywords?.keywords || [],
        regex: currentConfig.mainAndSubPageKeywords?.regexPatterns || [],
      };
    } else if (pageType === "content") {
      return {
        keywords: currentConfig.contentPageKeywords?.keywords || [],
        regex: currentConfig.contentPageKeywords?.regexPatterns || [],
      };
    }
    return { keywords: [], regex: [] };
  }

  // 获取全局用户名
  function getGlobalUsernames() {
    if (
      GLOBAL_CONFIG.globalUsernames &&
      Array.isArray(GLOBAL_CONFIG.globalUsernames.keywords)
    ) {
      return [...new Set(GLOBAL_CONFIG.globalUsernames.keywords)];
    }
    return [
      ...new Set(
        userConfig.reduce(
          (acc, config) => [
            ...acc,
            ...(config.mainAndSubPageUserKeywords?.keywords || []),
            ...(config.contentPageUserKeywords?.keywords || []),
          ],
          []
        )
      ),
    ];
  }

  // 获取全局用户名正则
  function getGlobalUsernamesRegex() {
    if (
      GLOBAL_CONFIG.globalUsernames &&
      Array.isArray(GLOBAL_CONFIG.globalUsernames.regexPatterns)
    ) {
      return [...new Set(GLOBAL_CONFIG.globalUsernames.regexPatterns)];
    }
    return [
      ...new Set(
        userConfig.reduce(
          (acc, config) => [
            ...acc,
            ...(config.mainAndSubPageUserKeywords?.regexPatterns || []),
            ...(config.contentPageUserKeywords?.regexPatterns || []),
          ],
          []
        )
      ),
    ];
  }

  // 获取共享用户名
  function getSharedUsernames(currentConfig) {
    // 优先使用主页的用户名，如果内容页有用户名则合并
    const mainUsernames =
      currentConfig.mainAndSubPageUserKeywords?.keywords || [];
    const contentUsernames =
      currentConfig.contentPageUserKeywords?.keywords || [];

    // 如果内容页没有用户名，直接使用主页的用户名
    if (contentUsernames.length === 0) {
      return mainUsernames;
    }

    // 如果内容页有用户名，则合并主页和内容页的用户名
    return [...new Set([...mainUsernames, ...contentUsernames])];
  }

  // 获取共享用户名正则
  function getSharedUsernamesRegex(currentConfig) {
    // 优先使用主页的用户名正则，如果内容页有正则则合并
    const mainRegex =
      currentConfig.mainAndSubPageUserKeywords?.regexPatterns || [];
    const contentRegex =
      currentConfig.contentPageUserKeywords?.regexPatterns || [];

    // 如果内容页没有正则，直接使用主页的正则
    if (contentRegex.length === 0) {
      return mainRegex;
    }

    // 如果内容页有正则，则合并主页和内容页的正则
    return [...new Set([...mainRegex, ...contentRegex])];
  }

  // 获取页面特定用户名
  function getPageSpecificUsernames(currentConfig, pageType) {
    if (pageType === "main") {
      return {
        usernames: currentConfig.mainAndSubPageUserKeywords?.keywords || [],
        regex: currentConfig.mainAndSubPageUserKeywords?.regexPatterns || [],
      };
    } else if (pageType === "content") {
      return {
        usernames: currentConfig.contentPageUserKeywords?.keywords || [],
        regex: currentConfig.contentPageUserKeywords?.regexPatterns || [],
      };
    }
    return { usernames: [], regex: [] };
  }

  // 执行屏蔽规则
  function executeFilterRules(filterRules, pageType, currentConfig) {
    const { keywords, keywords_regex, usernames, usernames_regex } =
      filterRules;

    console.log("[屏蔽插件调试] 执行屏蔽规则:", {
      pageType: pageType,
      usernames: usernames,
      usernames_regex: usernames_regex,
      shareUsernamesAcrossPages: currentConfig.shareUsernamesAcrossPages,
    });

    // 处理主页屏蔽
    if (pageType === "main") {
      console.log("[屏蔽插件调试] 执行主页屏蔽");
      executePageFilter(
        currentConfig.mainAndSubPageKeywords,
        keywords,
        keywords_regex
      );
      executePageFilter(
        currentConfig.mainAndSubPageUserKeywords,
        usernames,
        usernames_regex
      );
    }

    // 处理内容页屏蔽
    if (pageType === "content") {
      console.log("[屏蔽插件调试] 执行内容页屏蔽");
      executePageFilter(
        currentConfig.contentPageKeywords,
        keywords,
        keywords_regex
      );

      // 修复：内容页用户名屏蔽应该使用共享配置
      if (currentConfig.shareUsernamesAcrossPages) {
        console.log("[屏蔽插件调试] 使用共享用户名配置");
        // 使用主页的用户名XPath配置，但应用共享的用户名列表
        const sharedUserConfig = {
          xpath:
            currentConfig.contentPageUserKeywords?.xpath ||
            currentConfig.mainAndSubPageUserKeywords?.xpath ||
            [],
          keywords: usernames,
          regexPatterns: usernames_regex,
        };
        console.log("[屏蔽插件调试] 共享用户配置:", sharedUserConfig);
        executePageFilter(sharedUserConfig, usernames, usernames_regex);
      } else {
        console.log("[屏蔽插件调试] 使用内容页专用用户名配置");
        executePageFilter(
          currentConfig.contentPageUserKeywords,
          usernames,
          usernames_regex
        );
      }
    }
  }

  // 统一模式下执行过滤：根据匹配到的 XPath 执行（无主页/内容页区分）
  function executeUnifiedFilter(currentConfig, filterRules, matchedXpaths) {
    const { keywords, keywords_regex, usernames, usernames_regex } =
      filterRules;
    const titleXpaths = matchedXpaths.titleXpaths || [];
    const userXpaths = matchedXpaths.userXpaths || [];

    const run = (xpaths, list, listRegex) => {
      if (!xpaths || xpaths.length === 0) return;
      xpaths.forEach((xp) => {
        removeElementsByTerms(xp, list || [], listRegex || []);
      });
    };

    run(titleXpaths, keywords, keywords_regex);
    run(userXpaths, usernames, usernames_regex);
  }

  // 执行页面过滤
  function executePageFilter(pageConfig, keywords, keywords_regex) {
    console.log("[屏蔽插件调试] executePageFilter 调用:", {
      pageConfig: pageConfig,
      keywords: keywords,
      keywords_regex: keywords_regex,
      xpathLength: pageConfig?.xpath?.length || 0,
    });

    if (!pageConfig?.xpath?.length) {
      console.log("[屏蔽插件调试] 没有XPath配置，跳过执行");
      return;
    }

    pageConfig.xpath.forEach((xpath, index) => {
      console.log(`[屏蔽插件调试] 处理XPath ${index + 1}:`, xpath);

      // 处理普通关键词
      if (keywords?.length > 0) {
        console.log("[屏蔽插件调试] 处理普通关键词:", keywords);
        keywords.forEach((keyword) => {
          console.log(`[屏蔽插件调试] 屏蔽关键词: "${keyword}"`);
          removeElementsByText(xpath, keyword, false);
        });
      }

      // 处理正则关键词
      if (keywords_regex?.length > 0) {
        console.log("[屏蔽插件调试] 处理正则关键词:", keywords_regex);
        keywords_regex.forEach((pattern) => {
          console.log(`[屏蔽插件调试] 屏蔽正则: "${pattern}"`);
          removeElementsByText(xpath, pattern, true);
        });
      }
    });
  }
  function debounce(func, wait, immediate = false) {
    let timeout;
    let lastArgs;
    let lastThis;
    let result;
    let isExecuting = false;

    function later() {
      // 重置防抖定时器
      timeout = null;

      if (!immediate || isExecuting) {
        result = func.apply(lastThis, lastArgs);
        lastArgs = lastThis = null;
        isExecuting = false;
      }
    }

    // 返回闭包函数
    const debounced = function (...args) {
      lastArgs = args;
      lastThis = this;

      // 如果我们设置了立即执行，且不在执行中
      const callNow = immediate && !timeout && !isExecuting;

      // 重置之前的定时器
      clearTimeout(timeout);

      // 设置新的定时器
      timeout = setTimeout(later, wait);

      // 如果需要立即执行
      if (callNow) {
        isExecuting = true;
        result = func.apply(this, args);
        lastArgs = lastThis = null;
        isExecuting = false;
      }

      return result;
    };

    // 添加取消方法
    debounced.cancel = function () {
      clearTimeout(timeout);
      timeout = null;
      lastArgs = lastThis = null;
      isExecuting = false;
    };

    return debounced;
  }
  // 添加遮罩功能的防抖处理元素函数
  const debouncedHandleElements = debounce(() => {
    // 检查状态，避免在操作过程中重复执行
    if (
      window._overlayState &&
      (window._overlayState.isCreating || window._overlayState.isRemoving)
    ) {
      return;
    }
    // 直接执行屏蔽处理，避免重复创建遮罩层
    setTimeout(() => handleElements(), 10);
  }, 150);

  // 聚合当前页面信息，避免在多处重复计算域名、URL、页面类型与匹配组
  function getCurrentPageInfo() {
    const domain = getCurrentDomain();
    const currentConfig = getDomainConfig(domain) || SAMPLE_TEMPLATE;
    const currentUrl = getSplitUrl();

    const isMainPage = testUrlPatterns(
      currentConfig.mainPageUrlPatterns || [],
      currentUrl
    );
    const isContentPage = testUrlPatterns(
      currentConfig.contentPageUrlPatterns || [],
      currentUrl
    );

    const pageType = isMainPage
      ? "main"
      : isContentPage
      ? "content"
      : "unknown";
    const matchedGroupName = getFirstMatchedGroupName(
      currentConfig,
      currentUrl
    );

    return {
      domain,
      currentConfig,
      currentUrl,
      isMainPage,
      isContentPage,
      pageType,
      matchedGroupName,
    };
  }

  function getPageType() {
    const info = getCurrentPageInfo();
    return info.pageType;
  }
  function updatePanelContent() {
    const panel = document.getElementById("forum-filter-panel");
    if (!panel) return;

    const info = getCurrentPageInfo();
    const currentConfig = info.currentConfig;
    const isMainPage = info.isMainPage;
    const isContentPage = info.isContentPage;

    // 仅显示匹配到的配置组名称
    const matchedName = info.matchedGroupName || "";
    panel.querySelector("#page-type-value").textContent = matchedName;
    // 清空类型标签文本，避免出现前缀
    const pageTypeTextNode = panel.querySelector("#page-type-text");
    if (pageTypeTextNode) pageTypeTextNode.textContent = "";
    panel.querySelector("#domain-info-text").textContent = setTextfromTemplate(
      "panel_top_current_domain"
    );
    panel.querySelector("#domain-info-value").textContent = info.domain;

    // 数据交互区域 - 集中管理URL模式和XPath编辑器
    const dataInteractionContainer = panel.querySelector(
      "#data-interaction-container"
    );
    if (dataInteractionContainer) {
      dataInteractionContainer.innerHTML = "";

      // 顶部工具栏：新增配置组
      const toolbar = document.createElement("div");
      toolbar.style.cssText =
        "display:flex; gap:8px; align-items:center; margin: 0 0 10px 0;";
      const addGroupBtn = document.createElement("button");
      addGroupBtn.textContent = "新增配置组";
      addGroupBtn.style.cssText =
        "padding:6px 10px; background:#2196f3; color:#fff; border:none; border-radius:4px; cursor:pointer;";
      addGroupBtn.addEventListener("click", function () {
        const res = addDIGroup(null);
        if (res && res.success) {
          updatePanelContent();
          debouncedHandleElements();
        }
      });
      toolbar.appendChild(addGroupBtn);
      dataInteractionContainer.appendChild(toolbar);

      const urlPatterns = currentConfig.urlPatterns || [];
      urlPatterns.forEach((pattern, index) => {
        // 创建每个配置组的容器
        const groupDiv = document.createElement("div");
        groupDiv.className = "data-interaction-group";
        groupDiv.style.cssText =
          "margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px;";

        // 标题与操作行
        const headerRow = document.createElement("div");
        headerRow.className = "di-group-header";
        headerRow.style.cssText =
          "display:flex; align-items:center; gap:8px; margin: 0 0 10px 0;";

        const groupTitle = document.createElement("h4");
        groupTitle.textContent = `${pattern.name || `配置组 ${index + 1}`}`;
        groupTitle.style.cssText =
          "margin: 0; color: #333; font-size: 14px; flex:1 1 auto; padding:4px 6px; border:1px solid transparent; border-radius:4px; cursor:pointer;";
        headerRow.appendChild(groupTitle);

        // 可折叠内容容器（默认折叠）
        const groupContent = document.createElement("div");
        groupContent.className = "group-content";
        groupContent.style.cssText = "margin-top:8px; display:none;";

        const actions = document.createElement("div");
        actions.className = "di-group-actions";
        actions.style.cssText = "display:flex; gap:8px; align-items:center;";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "删除此组";
        deleteBtn.style.cssText =
          "padding:6px 10px; background:#f44336; color:#fff; border:none; border-radius:4px; cursor:pointer;";

        const renameBtn = document.createElement("button");
        renameBtn.textContent = "重命名";
        renameBtn.style.cssText =
          "padding:6px 10px; background:#1976d2; color:#fff; border:none; border-radius:4px; cursor:pointer;";

        // 点击标题折叠/展开内容，不记忆折叠状态（默认折叠）
        groupTitle.addEventListener("click", function () {
          const isHidden = groupContent.style.display === "none";
          groupContent.style.display = isHidden ? "" : "none";
        });

        deleteBtn.addEventListener("click", function () {
          if (!confirm("确定删除该配置组吗？此操作不可恢复")) return;
          const res = removeDIGroup(index);
          if (res && res.success) {
            updatePanelContent();
            debouncedHandleElements();
          }
        });

        renameBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          const currentName = (groupTitle.textContent || "").trim();
          const val = prompt("请输入新名称", currentName);
          if (val === null) return;
          const res = renameDIGroup(index, val);
          if (res && res.success) {
            updatePanelContent();
            debouncedHandleElements();
          }
        });

        actions.appendChild(renameBtn);
        actions.appendChild(deleteBtn);
        groupContent.appendChild(actions);
        groupDiv.appendChild(headerRow);
        groupDiv.appendChild(groupContent);

        // 按钮已移动到内容区域顶部

        // URL模式编辑器
        const patternsEditor = createArrayEditor(
          "URL匹配模式",
          pattern.patterns || [],
          (item) => {
            const res = mutateDIList(index, "patterns", "add", item);
            debouncedHandleElements();
            return res && Array.isArray(res.list) ? res.list : undefined;
          },
          (itemIndex) => {
            const res = mutateDIList(index, "patterns", "delete", itemIndex);
            debouncedHandleElements();
            return res && Array.isArray(res.list) ? res.list : undefined;
          },
          `patterns-editor-${index}`,
          true
        );
        groupContent.appendChild(patternsEditor);

        // XPath编辑器（如果存在）
        if (pattern.xpath) {
          if (pattern.xpath.title) {
            const titleEditor = createArrayEditor(
              "标题XPath",
              pattern.xpath.title || [],
              (item) => {
                const res = mutateDIList(index, "title", "add", item);
                debouncedHandleElements();
                return res && Array.isArray(res.list) ? res.list : undefined;
              },
              (itemIndex) => {
                const res = mutateDIList(index, "title", "delete", itemIndex);
                debouncedHandleElements();
                return res && Array.isArray(res.list) ? res.list : undefined;
              },
              `title-xpath-editor-${index}`
            );
            groupContent.appendChild(titleEditor);
          }

          if (pattern.xpath.user) {
            const userEditor = createArrayEditor(
              "用户XPath",
              pattern.xpath.user || [],
              (item) => {
                const res = mutateDIList(index, "user", "add", item);
                debouncedHandleElements();
                return res && Array.isArray(res.list) ? res.list : undefined;
              },
              (itemIndex) => {
                const res = mutateDIList(index, "user", "delete", itemIndex);
                debouncedHandleElements();
                return res && Array.isArray(res.list) ? res.list : undefined;
              },
              `user-xpath-editor-${index}`
            );
            groupContent.appendChild(userEditor);
          }
        }
        groupDiv.appendChild(groupContent);
        dataInteractionContainer.appendChild(groupDiv);
      });
    }

    // 不再处理动态分组显示，所有功能集中在数据交互区域
    const keywordsContainer = panel.querySelector("#keywords-container");
    const usernamesContainer = panel.querySelector("#usernames-container");
    keywordsContainer.innerHTML = "";
    usernamesContainer.innerHTML = "";
    // 显示可编辑的全局关键词列表
    if (GLOBAL_CONFIG.GLOBAL_KEYWORDS && GLOBAL_CONFIG.globalKeywords) {
      const gk = GLOBAL_CONFIG.globalKeywords || {};

      const globalKeywordsEditor = createArrayEditor(
        "全局关键词",
        Array.isArray(gk.keywords) ? gk.keywords : [],
        (item) => {
          if (!GLOBAL_CONFIG.globalKeywords.keywords) {
            GLOBAL_CONFIG.globalKeywords.keywords = [];
          }
          GLOBAL_CONFIG.globalKeywords.keywords.push(item);
          saveGlobalConfig();
          debouncedHandleElements();
        },
        (index) => {
          GLOBAL_CONFIG.globalKeywords.keywords.splice(index, 1);
          saveGlobalConfig();
          debouncedHandleElements();
        },
        "global-keywords-editor"
      );
      keywordsContainer.appendChild(globalKeywordsEditor);

      const globalKeywordsRegexEditor = createArrayEditor(
        "全局关键词正则",
        Array.isArray(gk.regexPatterns) ? gk.regexPatterns : [],
        (item) => {
          if (!GLOBAL_CONFIG.globalKeywords.regexPatterns) {
            GLOBAL_CONFIG.globalKeywords.regexPatterns = [];
          }
          GLOBAL_CONFIG.globalKeywords.regexPatterns.push(item);
          saveGlobalConfig();
          debouncedHandleElements();
        },
        (index) => {
          GLOBAL_CONFIG.globalKeywords.regexPatterns.splice(index, 1);
          saveGlobalConfig();
          debouncedHandleElements();
        },
        "global-keywords-regex-editor",
        true
      );
      keywordsContainer.appendChild(globalKeywordsRegexEditor);
    }

    // 显示可编辑的全局用户名列表
    if (GLOBAL_CONFIG.GLOBAL_USERNAMES && GLOBAL_CONFIG.globalUsernames) {
      const gu = GLOBAL_CONFIG.globalUsernames || {};

      const globalUsernamesEditor = createArrayEditor(
        "全局用户名",
        Array.isArray(gu.keywords) ? gu.keywords : [],
        (item) => {
          if (!GLOBAL_CONFIG.globalUsernames.keywords) {
            GLOBAL_CONFIG.globalUsernames.keywords = [];
          }
          GLOBAL_CONFIG.globalUsernames.keywords.push(item);
          saveGlobalConfig();
          debouncedHandleElements();
        },
        (index) => {
          GLOBAL_CONFIG.globalUsernames.keywords.splice(index, 1);
          saveGlobalConfig();
          debouncedHandleElements();
        },
        "global-usernames-editor"
      );
      usernamesContainer.appendChild(globalUsernamesEditor);

      const globalUsernamesRegexEditor = createArrayEditor(
        "全局用户名正则",
        Array.isArray(gu.regexPatterns) ? gu.regexPatterns : [],
        (item) => {
          if (!GLOBAL_CONFIG.globalUsernames.regexPatterns) {
            GLOBAL_CONFIG.globalUsernames.regexPatterns = [];
          }
          GLOBAL_CONFIG.globalUsernames.regexPatterns.push(item);
          saveGlobalConfig();
          debouncedHandleElements();
        },
        (index) => {
          GLOBAL_CONFIG.globalUsernames.regexPatterns.splice(index, 1);
          saveGlobalConfig();
          debouncedHandleElements();
        },
        "global-usernames-regex-editor",
        true
      );
      usernamesContainer.appendChild(globalUsernamesRegexEditor);
    }
    // 如果没有启用全局配置，则显示页面特定的关键词和用户名编辑器
    if (!GLOBAL_CONFIG.GLOBAL_KEYWORDS || !GLOBAL_CONFIG.globalKeywords) {
      if (isMainPage) {
        if (currentConfig.mainAndSubPageKeywords) {
          const mainPageKeywords = createArrayEditor(
            setTextfromTemplate("keywords_config_keywords_list_title"),
            currentConfig.mainAndSubPageKeywords.keywords || [],
            (item) => {
              if (!currentConfig.mainAndSubPageKeywords.keywords) {
                currentConfig.mainAndSubPageKeywords.keywords = [];
              }
              currentConfig.mainAndSubPageKeywords.keywords.push(item);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            (index) => {
              currentConfig.mainAndSubPageKeywords.keywords.splice(index, 1);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            "array-editor-keywords-list"
          );
          keywordsContainer.appendChild(mainPageKeywords);
          const mainPageKeywordsRegex = createArrayEditor(
            setTextfromTemplate("keywords_config_keywords_regex_title"),
            currentConfig.mainAndSubPageKeywords.regexPatterns || [],
            (item) => {
              if (!currentConfig.mainAndSubPageKeywords.regexPatterns) {
                currentConfig.mainAndSubPageKeywords.regexPatterns = [];
              }
              currentConfig.mainAndSubPageKeywords.regexPatterns.push(item);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            (index) => {
              currentConfig.mainAndSubPageKeywords.regexPatterns.splice(
                index,
                1
              );
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            "array-editor-keywords-regex",
            true
          );
          keywordsContainer.appendChild(mainPageKeywordsRegex);
        }
      } else if (isContentPage) {
        if (currentConfig.contentPageKeywords) {
          const contentPageKeywords = createArrayEditor(
            setTextfromTemplate("keywords_config_keywords_list_title"),
            currentConfig.contentPageKeywords.keywords || [],
            (item) => {
              if (!currentConfig.contentPageKeywords.keywords) {
                currentConfig.contentPageKeywords.keywords = [];
              }
              currentConfig.contentPageKeywords.keywords.push(item);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            (index) => {
              currentConfig.contentPageKeywords.keywords.splice(index, 1);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            "array-editor-keywords-list"
          );
          keywordsContainer.appendChild(contentPageKeywords);
          const contentPageKeywordsRegex = createArrayEditor(
            setTextfromTemplate("keywords_config_keywords_regex_title"),
            currentConfig.contentPageKeywords.regexPatterns || [],
            (item) => {
              if (!currentConfig.contentPageKeywords.regexPatterns) {
                currentConfig.contentPageKeywords.regexPatterns = [];
              }
              currentConfig.contentPageKeywords.regexPatterns.push(item);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            (index) => {
              currentConfig.contentPageKeywords.regexPatterns.splice(index, 1);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            "array-editor-keywords-regex",
            true
          );
          keywordsContainer.appendChild(contentPageKeywordsRegex);
        }
      } else {
        if (keywordsContainer.children.length === 0) {
          keywordsContainer.innerHTML =
            '<div style="padding: 10px; color: #666;">请先配置并匹配页面类型</div>';
        }
      }
    }

    if (!GLOBAL_CONFIG.GLOBAL_USERNAMES || !GLOBAL_CONFIG.globalUsernames) {
      if (isMainPage) {
        if (currentConfig.mainAndSubPageUserKeywords) {
          const mainPageUsernames = createArrayEditor(
            setTextfromTemplate("usernames_config_usernames_list_title"),
            currentConfig.mainAndSubPageUserKeywords.keywords || [],
            (item) => {
              if (!currentConfig.mainAndSubPageUserKeywords.keywords) {
                currentConfig.mainAndSubPageUserKeywords.keywords = [];
              }
              currentConfig.mainAndSubPageUserKeywords.keywords.push(item);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            (index) => {
              currentConfig.mainAndSubPageUserKeywords.keywords.splice(
                index,
                1
              );
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            "array-editor-usernames-list"
          );
          usernamesContainer.appendChild(mainPageUsernames);
          const mainPageUsernamesRegex = createArrayEditor(
            setTextfromTemplate("usernames_config_usernames_regex_title"),
            currentConfig.mainAndSubPageUserKeywords.regexPatterns || [],
            (item) => {
              if (!currentConfig.mainAndSubPageUserKeywords.regexPatterns) {
                currentConfig.mainAndSubPageUserKeywords.regexPatterns = [];
              }
              currentConfig.mainAndSubPageUserKeywords.regexPatterns.push(item);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            (index) => {
              currentConfig.mainAndSubPageUserKeywords.regexPatterns.splice(
                index,
                1
              );
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            "array-editor-usernames-regex",
            true
          );
          usernamesContainer.appendChild(mainPageUsernamesRegex);
        }
      } else if (isContentPage) {
        if (currentConfig.contentPageUserKeywords) {
          const contentPageUsernames = createArrayEditor(
            setTextfromTemplate("usernames_config_usernames_list_title"),
            currentConfig.contentPageUserKeywords.keywords || [],
            (item) => {
              if (!currentConfig.contentPageUserKeywords.keywords) {
                currentConfig.contentPageUserKeywords.keywords = [];
              }
              currentConfig.contentPageUserKeywords.keywords.push(item);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            (index) => {
              currentConfig.contentPageUserKeywords.keywords.splice(index, 1);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            "array-editor-usernames-list"
          );
          usernamesContainer.appendChild(contentPageUsernames);
          const contentPageUsernamesRegex = createArrayEditor(
            setTextfromTemplate("usernames_config_usernames_regex_title"),
            currentConfig.contentPageUserKeywords.regexPatterns || [],
            (item) => {
              if (!currentConfig.contentPageUserKeywords.regexPatterns) {
                currentConfig.contentPageUserKeywords.regexPatterns = [];
              }
              currentConfig.contentPageUserKeywords.regexPatterns.push(item);
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            (index) => {
              currentConfig.contentPageUserKeywords.regexPatterns.splice(
                index,
                1
              );
              saveUserConfig(userConfig);
              debouncedHandleElements();
            },
            "array-editor-usernames-regex",
            true
          );
          usernamesContainer.appendChild(contentPageUsernamesRegex);
        }
      } else {
        if (usernamesContainer.children.length === 0) {
          usernamesContainer.innerHTML =
            '<div style="padding: 10px; color: #666;">请先配置并匹配页面类型</div>';
        }
      }
    }
    // 处理固定分区的折叠状态
    ["keywords", "usernames", "data-interaction"].forEach((section) => {
      const toggle = panel.querySelector(`[data-section="${section}"]`);
      if (toggle) {
        const isCollapsed =
          GLOBAL_CONFIG.CONFIG_SECTION_COLLAPSED[
            `${section}_SECTION_COLLAPSED`
          ];
        toggle.classList[isCollapsed ? "add" : "remove"]("collapsed");
      }
    });
  }
  function listenUrlChange(callback) {
    // 使用WeakMap存储状态，避免内存泄漏
    const state = {
      lastUrl: window.location.href,
      observer: null,
      popstateHandler: null,
      debouncedCallback: debounce(
        () => {
          callback();
          updatePanelContent();
        },
        50,
        true
      ), // 使用改进后的debounce，添加立即执行选项
    };

    // 创建一个统一的URL变更处理函数
    const handleUrlChange = () => {
      const currentUrl = window.location.href;
      if (currentUrl !== state.lastUrl) {
        state.lastUrl = currentUrl;
        state.debouncedCallback();
      }
    };

    // 监听popstate事件
    state.popstateHandler = () => handleUrlChange();
    window.addEventListener("popstate", state.popstateHandler, {
      passive: true,
    });

    // 替换history方法
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // 使用性能更好的方式重写pushState
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleUrlChange();
    };

    // 使用性能更好的方式重写replaceState
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleUrlChange();
    };

    // 创建MutationObserver以处理单页应用中的URL变更
    // 这可以捕获那些不使用history API的URL变更
    state.observer = new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== state.lastUrl) {
        state.lastUrl = currentUrl;
        state.debouncedCallback();
      }
    });

    // 配置观察者
    try {
      state.observer.observe(document, {
        subtree: true,
        childList: true,
        attributes: false,
        characterData: false,
      });
    } catch (error) {
      console.error("设置URL变更观察器失败:", error);
    }

    // 返回清理函数，用于需要时释放资源
    return function cleanup() {
      if (state.observer) {
        state.observer.disconnect();
        state.observer = null;
      }

      if (state.popstateHandler) {
        window.removeEventListener("popstate", state.popstateHandler);
        state.popstateHandler = null;
      }

      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;

      state.debouncedCallback.cancel();
    };
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      handleElements();
      listenUrlChange(debouncedHandleElements);
      // 确保document.body存在后再设置观察器
      setupMutationObserver();
    });
  } else {
    handleElements();
    listenUrlChange(debouncedHandleElements);
    // 确保document.body存在后再设置观察器
    setupMutationObserver();
  }

  // 设置MutationObserver的函数
  function setupMutationObserver() {
    // 检查document.body是否存在
    if (!document.body) {
      console.warn("document.body不存在，延迟设置MutationObserver");
      // 如果body不存在，等待下一个事件循环再试
      setTimeout(setupMutationObserver, 10);
      return;
    }

    // 判断变更是否来自插件自身 UI，若是则忽略
    function isInPluginUI(node) {
      try {
        let el =
          node && node.nodeType === 1 ? node : node && node.parentElement;
        if (!el) return false;
        return !!(
          el.closest &&
          el.closest(
            "#forum-filter-panel, #settings-overlay, #early-page-loading-overlay, #page-loading-overlay"
          )
        );
      } catch (e) {
        return false;
      }
    }

    let lastMutationHandleTime = 0;
    const observer = new MutationObserver((mutationList) => {
      // 过滤掉来自插件 UI 的变更，减少无效触发
      let hasRelevantChange = false;
      for (let i = 0; i < mutationList.length; i++) {
        const m = mutationList[i];
        if (!isInPluginUI(m.target)) {
          hasRelevantChange = true;
          break;
        }
      }
      if (!hasRelevantChange) return;

      const now = Date.now();
      if (now - lastMutationHandleTime < 250) return; // 简单节流
      lastMutationHandleTime = now;

      debouncedHandleElements();
    });

    try {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } catch (error) {
      console.error("设置MutationObserver失败:", error);
    }
  }
  function importDomainConfig(file) {
    return new Promise((resolve) => {
      if (!file || !(file instanceof File)) {
        resolve({
          success: false,
          message: "请选择有效的配置文件",
          config: null,
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const importData = JSON.parse(event.target.result);
          if (!importData.config || !importData.config.domain) {
            resolve({
              success: false,
              message: "无效的配置文件格式",
              config: null,
            });
            return;
          }
          const existingConfig = getDomainConfig(importData.config.domain);
          if (existingConfig) {
            const updateResult = updateDomainConfig(
              importData.config.domain,
              importData.config
            );
            resolve({
              success: true,
              message: "配置已更新",
              config: updateResult.config,
            });
          } else {
            const addResult = addDomainConfig(importData.config);
            resolve({
              success: true,
              message: "配置已导入",
              config: addResult.config,
            });
          }
        } catch (error) {
          console.error("导入配置失败:", error);
          resolve({
            success: false,
            message: `导入配置失败: ${error.message}`,
            config: null,
          });
        }
      };
      reader.onerror = () => {
        resolve({
          success: false,
          message: "读取文件失败",
          config: null,
        });
      };
      reader.readAsText(file);
    });
  }
  function exportUserConfig() {
    try {
      // 1) 生成对外 globalConfig（与导入规范一致）
      const externalGlobal = {
        GLOBAL_KEYWORDS: !!GLOBAL_CONFIG.GLOBAL_KEYWORDS,
        GLOBAL_USERNAMES: !!GLOBAL_CONFIG.GLOBAL_USERNAMES,
        LANGUAGE: GLOBAL_CONFIG.LANGUAGE,
        globalKeywords: GLOBAL_CONFIG.globalKeywords || {
          whitelistMode: false,
          keywords: [],
          regexPatterns: [],
        },
        globalUsernames: GLOBAL_CONFIG.globalUsernames || {
          whitelistMode: false,
          keywords: [],
          regexPatterns: [],
        },
        CONFIG_SECTION_COLLAPSED: GLOBAL_CONFIG.CONFIG_SECTION_COLLAPSED || {},
        EDITOR_STATES: GLOBAL_CONFIG.EDITOR_STATES || {},
      };

      // 2) 内部结构 → 导入规范的 userConfig：合并 sharedConfig，仅输出 urlPatterns
      const rootKeyToRoot = new Map();
      const rootKeyToAliases = new Map();
      const seenRootConfigs = new Set();

      // 2.1 建立根配置索引（每个域名单独作为 key）
      userConfig.forEach((cfg) => {
        if (!cfg || typeof cfg !== "object") return;
        if (cfg.sharedConfig) return; // 非根
        const domains = Array.isArray(cfg.domain) ? cfg.domain : [cfg.domain];
        domains.filter(Boolean).forEach((d) => {
          if (!rootKeyToRoot.has(d)) rootKeyToRoot.set(d, cfg);
        });
      });

      // 2.2 收集别名域名（sharedConfig 指向根域名）
      userConfig.forEach((cfg) => {
        if (!cfg || typeof cfg !== "object" || !cfg.sharedConfig) return;
        const domains = Array.isArray(cfg.domain) ? cfg.domain : [cfg.domain];
        const rootKey = cfg.sharedConfig;
        if (!rootKeyToAliases.has(rootKey)) rootKeyToAliases.set(rootKey, []);
        rootKeyToAliases.get(rootKey).push(...domains.filter(Boolean));
      });

      // 2.3 生成对外 userConfig（按根配置合并导出）
      const externalUserConfig = [];

      // 根配置
      userConfig.forEach((cfg) => {
        if (!cfg || typeof cfg !== "object" || cfg.sharedConfig) return;
        if (seenRootConfigs.has(cfg)) return;
        seenRootConfigs.add(cfg);

        const rootDomains = Array.isArray(cfg.domain)
          ? cfg.domain.slice()
          : [cfg.domain];
        const aliasDomains = [];
        rootDomains.filter(Boolean).forEach((d) => {
          const arr = rootKeyToAliases.get(d);
          if (arr && arr.length) aliasDomains.push(...arr);
        });
        const combinedDomains = Array.from(
          new Set([...rootDomains, ...aliasDomains].filter(Boolean))
        );

        // urlPatterns：优先使用已存在的字段，否则从拆分字段还原
        let urlPatterns = Array.isArray(cfg.urlPatterns)
          ? structuredClone(cfg.urlPatterns)
          : null;
        if (!urlPatterns || urlPatterns.length === 0) {
          const mainPatterns = Array.isArray(cfg.mainPageUrlPatterns)
            ? cfg.mainPageUrlPatterns
            : [];
          const contentPatterns = Array.isArray(cfg.contentPageUrlPatterns)
            ? cfg.contentPageUrlPatterns
            : [];
          const mainTitle =
            cfg.mainAndSubPageKeywords &&
            Array.isArray(cfg.mainAndSubPageKeywords.xpath)
              ? cfg.mainAndSubPageKeywords.xpath
              : [];
          const mainUser =
            cfg.mainAndSubPageUserKeywords &&
            Array.isArray(cfg.mainAndSubPageUserKeywords.xpath)
              ? cfg.mainAndSubPageUserKeywords.xpath
              : [];
          const contentTitle =
            cfg.contentPageKeywords &&
            Array.isArray(cfg.contentPageKeywords.xpath)
              ? cfg.contentPageKeywords.xpath
              : [];
          const contentUser =
            cfg.contentPageUserKeywords &&
            Array.isArray(cfg.contentPageUserKeywords.xpath)
              ? cfg.contentPageUserKeywords.xpath
              : [];
          urlPatterns = [
            {
              name: "主页",
              patterns: mainPatterns.slice(),
              xpath: { title: mainTitle.slice(), user: mainUser.slice() },
            },
            {
              name: "内容页",
              patterns: contentPatterns.slice(),
              xpath: { title: contentTitle.slice(), user: contentUser.slice() },
            },
          ];
        }

        externalUserConfig.push({
          domain: combinedDomains,
          enabled: cfg.enabled !== false,
          compatibilityMode:
            typeof cfg.compatibilityMode === "boolean"
              ? cfg.compatibilityMode
              : false,
          urlPatterns: urlPatterns,
        });
      });

      // 孤立的 sharedConfig（未找到根）
      userConfig.forEach((cfg) => {
        if (!cfg || typeof cfg !== "object" || !cfg.sharedConfig) return;
        if (rootKeyToRoot.has(cfg.sharedConfig)) return; // 有根则已合并

        const domains = Array.isArray(cfg.domain) ? cfg.domain : [cfg.domain];
        let urlPatterns = Array.isArray(cfg.urlPatterns)
          ? structuredClone(cfg.urlPatterns)
          : null;
        if (!urlPatterns || urlPatterns.length === 0) {
          const mainPatterns = Array.isArray(cfg.mainPageUrlPatterns)
            ? cfg.mainPageUrlPatterns
            : [];
          const contentPatterns = Array.isArray(cfg.contentPageUrlPatterns)
            ? cfg.contentPageUrlPatterns
            : [];
          const mainTitle =
            cfg.mainAndSubPageKeywords &&
            Array.isArray(cfg.mainAndSubPageKeywords.xpath)
              ? cfg.mainAndSubPageKeywords.xpath
              : [];
          const mainUser =
            cfg.mainAndSubPageUserKeywords &&
            Array.isArray(cfg.mainAndSubPageUserKeywords.xpath)
              ? cfg.mainAndSubPageUserKeywords.xpath
              : [];
          const contentTitle =
            cfg.contentPageKeywords &&
            Array.isArray(cfg.contentPageKeywords.xpath)
              ? cfg.contentPageKeywords.xpath
              : [];
          const contentUser =
            cfg.contentPageUserKeywords &&
            Array.isArray(cfg.contentPageUserKeywords.xpath)
              ? cfg.contentPageUserKeywords.xpath
              : [];
          urlPatterns = [
            {
              name: "主页",
              patterns: mainPatterns.slice(),
              xpath: { title: mainTitle.slice(), user: mainUser.slice() },
            },
            {
              name: "内容页",
              patterns: contentPatterns.slice(),
              xpath: { title: contentTitle.slice(), user: contentUser.slice() },
            },
          ];
        }

        externalUserConfig.push({
          domain: Array.from(new Set(domains.filter(Boolean))),
          enabled: cfg.enabled !== false,
          compatibilityMode:
            typeof cfg.compatibilityMode === "boolean"
              ? cfg.compatibilityMode
              : false,
          urlPatterns: urlPatterns,
        });
      });

      const exportData = {
        globalConfig: externalGlobal,
        userConfig: externalUserConfig,
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = `universal-forum-block-config-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);

      return {
        success: true,
        message: "配置导出成功",
        config: exportData,
      };
    } catch (error) {
      console.error("导出配置失败:", error);
      return {
        success: false,
        message: `导出配置失败: ${error.message}`,
        config: null,
      };
    }
  }
  function importUserConfig(file) {
    return new Promise((resolve) => {
      if (!file || !(file instanceof File)) {
        resolve({
          success: false,
          message: "请选择有效的配置文件",
          config: null,
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const importData = JSON.parse(event.target.result);
          const configCopy = JSON.parse(JSON.stringify(importData));
          // 如果是外部 JSON 格式（包含 globalConfig/userConfig）则进行规范化
          if (configCopy && configCopy.userConfig && configCopy.globalConfig) {
            const normalized = { globalConfig: {}, userConfig: [] };
            // 透传 globalConfig
            normalized.globalConfig = configCopy.globalConfig || {};
            // 规范化 userConfig 列表
            const items = Array.isArray(configCopy.userConfig)
              ? configCopy.userConfig
              : [];
            items.forEach((raw) => {
              const n = normalizeExternalUserConfigItem(raw);
              if (n) normalized.userConfig.push(n);
            });
            saveConfig(normalized, false, true);
          } else if (Array.isArray(configCopy)) {
            // 兼容旧导出为纯数组的情况
            const normalizedArr = configCopy
              .map(normalizeExternalUserConfigItem)
              .filter(Boolean);
            saveConfig({ userConfig: normalizedArr }, false, true);
          } else if (
            configCopy &&
            (configCopy.domain || configCopy.urlPatterns)
          ) {
            const n = normalizeExternalUserConfigItem(configCopy);
            saveConfig({ userConfig: [n] }, false, true);
          } else {
            // 回退到原始流程
            saveConfig(configCopy);
          }
        } catch (error) {
          console.error("导入配置失败:", error);
          resolve({
            success: false,
            message: `导入配置失败: ${error.message}`,
            config: null,
          });
        }
      };
      reader.onerror = () => {
        resolve({
          success: false,
          message: "读取文件失败",
          config: null,
        });
      };
      reader.readAsText(file);
    });
  }
  function importUserConfigFromFile() {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async (event) => {
        const file = event.target.files[0];
        const result = await importUserConfig(file);
        resolve(result);
      };
      input.click();
    });
  }

  function resetUserConfig() {
    // 显示确认对话框
    const confirmed = confirm(
      '确定要清空所有配置并恢复出厂设置吗？\n\n此操作将：\n- 清空所有自定义的关键词和用户名配置\n- 清空所有自定义的URL模式和XPath配置\n- 重置所有面板设置\n- 此操作不可恢复！\n\n点击"确定"继续，点击"取消"放弃操作。'
    );

    if (!confirmed) {
      return {
        success: false,
        message: "用户取消了重置操作",
        config: null,
      };
    }

    try {
      // 清空所有用户配置，恢复为默认配置
      const resetConfig = [];
      DEFAULT_CONFIG.forEach((defaultItem) => {
        const newConfig = structuredClone(SAMPLE_TEMPLATE);
        Object.assign(newConfig, defaultItem);
        resetConfig.push(newConfig);
      });

      // 保存重置后的配置
      saveUserConfig(resetConfig);

      // 重置全局配置为默认值
      const defaultGlobalConfig = {
        GLOBAL_KEYWORDS: true,
        GLOBAL_USERNAMES: true,
        LANGUAGE: navigator.language,
        CONFIG_SECTION_COLLAPSED: {
          global_SECTION_COLLAPSED: true,
          keywords_SECTION_COLLAPSED: true,
          usernames_SECTION_COLLAPSED: true,
          "data-interaction_SECTION_COLLAPSED": true,
        },
        EDITOR_STATES: {
          keywords: false,
          keywords_regex: false,
          usernames: false,
          usernames_regex: false,
          mainpage_url_patterns: false,
          contentpage_url_patterns: false,
          main_and_sub_page_title_xpath: false,
          main_and_sub_page_user_xpath: false,
          contentpage_title_xpath: false,
          contentpage_user_xpath: false,
        },
      };

      // 更新全局配置
      Object.assign(GLOBAL_CONFIG, defaultGlobalConfig);
      saveGlobalConfig();

      // 重新加载配置
      userConfig = loadUserConfig();

      // 显示成功消息
      alert("配置已成功重置为出厂设置！\n页面将自动刷新以应用新配置。");

      // 刷新页面以应用新配置
      location.reload();

      return {
        success: true,
        message: "配置已重置为出厂设置",
        config: resetConfig,
      };
    } catch (error) {
      console.error("重置配置失败:", error);
      alert(`重置配置失败: ${error.message}`);
      return {
        success: false,
        message: `重置配置失败: ${error.message}`,
        config: null,
      };
    }
  }
  function savePanelSettings() {
    GM_setValue("panelSettings", PANEL_SETTINGS);
    applyPanelSettings();
    debouncedHandleElements();
  }
  function applyPanelSettings() {
    const panel = document.getElementById("forum-filter-panel");
    if (!panel) return;

    // 根据展开状态设置位置
    if (
      panel.classList.contains("click-mode") &&
      panel.classList.contains("expanded")
    ) {
      // 展开状态：居中显示
      // 使用requestAnimationFrame来确保在下一帧渲染前更新样式，使过渡效果更流畅
      requestAnimationFrame(() => {
        panel.style.left = "50%";
        panel.style.transform = "translate(-50%, -50%)";
      });
    } else {
      // 折叠状态：左侧显示
      requestAnimationFrame(() => {
        panel.style.left = "10px";
        panel.style.transform = "translate(-50%, -50%)";
      });
    }

    // 固定为点击展开模式
    panel.classList.add("click-mode");
  }
  function createSettingsPanel() {
    const settingsPanel = document.createElement("div");
    settingsPanel.id = "forum-filter-settings";
    settingsPanel.innerHTML = `
              <h3 id="js-settings-title">面板设置</h3>
              <!-- 添加语言选择下拉框 -->
              <div class="setting-group">
                  <label for="language-select">语言</label>
                  <select id="language-select">
                      <option value="zh-CN">简体中文</option>


                  </select>
              </div>




              <div class="buttons">
                  <button id="settings-cancel">取消</button>
                  <button id="settings-save">保存</button>
              </div>
          `;
    settingsPanel.querySelector("#js-settings-title").textContent =
      setTextfromTemplate("settings_title");
    settingsPanel.querySelector('label[for="language-select"]').textContent =
      setTextfromTemplate("settings_language");

    settingsPanel.querySelector("#settings-cancel").textContent =
      setTextfromTemplate("settings_cancel");
    settingsPanel.querySelector("#settings-save").textContent =
      setTextfromTemplate("settings_save");
    const overlay = document.createElement("div");
    overlay.id = "settings-overlay";
    overlay.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              z-index: 9999;
              display: none;
          `;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", function () {
      settingsPanel.classList.remove("visible");
      overlay.style.display = "none";
    });
    document.body.appendChild(settingsPanel);

    document
      .getElementById("settings-save")
      .addEventListener("click", function () {
        savePanelSettings();
        settingsPanel.classList.remove("visible");
        overlay.style.display = "none";
      });
    document
      .getElementById("settings-cancel")
      .addEventListener("click", function () {
        PANEL_SETTINGS = GM_getValue("panelSettings", {
          expandMode: "click",
        });
        applyPanelSettings();
        settingsPanel.classList.remove("visible");
        overlay.style.display = "none";
      });
    const languageSelect = document.getElementById("language-select");
    languageSelect.value = GLOBAL_CONFIG.LANGUAGE || "zh-CN";
    languageSelect.addEventListener("change", function (e) {
      const newLanguage = e.target.value;
      setLanguage(newLanguage);
    });

    return settingsPanel;
  }
  // 检测设备是否为移动设备
  function isMobileDevice() {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 767
    );
  }

  // 保留空实现，避免未来误用；当前逻辑不再依赖侧边栏可见性
  function isBygSidebarVisible() {
    return false;
  }

  // 根据侧边栏显示状态，同步悬浮主按钮的可见性
  function syncFloatingButtonVisibilityWithSidebar() {
    try {
      const sidebarVisible = isBygSidebarVisible();
      const panel = document.getElementById("forum-filter-panel");
      if (!panel) return;

      let tabButton = panel.querySelector(".panel-tab");

      if (sidebarVisible) {
        // 侧边栏显示时隐藏悬浮按钮（如存在）
        if (tabButton && !tabButton.classList.contains("button-hidden")) {
          tabButton.classList.add("button-hidden");
        }
      } else {
        // 侧边栏隐藏时，根据用户偏好显示/创建悬浮按钮
        if (buttonVisible) {
          if (!tabButton) {
            tabButton = document.createElement("div");
            tabButton.className = "panel-tab";
            tabButton.textContent = "⚙";
            try {
              panel.insertBefore(tabButton, panel.firstChild);
            } catch (e) {
              document.body.appendChild(tabButton);
            }

            // 绑定与 createControlPanel 相同的点击交互
            tabButton.addEventListener("click", function () {
              if (panel.classList.contains("click-mode")) {
                tabButton.style.transform = "translateY(-50%) scale(0.9)";
                setTimeout(() => {
                  tabButton.style.transform = "translateY(-50%)";
                }, 100);

                panel.classList.toggle("expanded");
                requestAnimationFrame(() => {
                  if (panel.classList.contains("expanded")) {
                    panel.style.left = "50%";
                    panel.style.transform = "translate(-50%, -50%) scale(1)";
                    if (isMobileDevice()) {
                      panel.style.maxHeight = "80vh";
                      document.body.style.overflow = "hidden";
                    }
                  } else {
                    panel.style.transform = "translate(-50%, -50%) scale(0.95)";
                    setTimeout(() => {
                      panel.style.left = "10px";
                      panel.style.transform = "translate(-50%, -50%)";
                    }, 50);
                    if (isMobileDevice()) {
                      document.body.style.overflow = "";
                    }
                  }
                });
              }
            });
          }
          if (tabButton.classList.contains("button-hidden")) {
            tabButton.classList.remove("button-hidden");
          }
        } else if (
          tabButton &&
          !tabButton.classList.contains("button-hidden")
        ) {
          // 用户偏好隐藏时，确保隐藏
          tabButton.classList.add("button-hidden");
        }
      }
    } catch (e) {}
  }

  function createControlPanel() {
    const panel = document.createElement("div");
    panel.id = "forum-filter-panel";
    panel.style.display = "block";

    // 检测并标记移动设备
    if (isMobileDevice()) {
      panel.classList.add("is-mobile");
    }

    // 仅根据按钮可见性状态决定是否创建主按钮（不受侧边栏影响）
    const panelTabHtml = buttonVisible ? '<div class="panel-tab">⚙</div>' : "";

    // 不再生成动态分组HTML，只保留数据交互区域

    panel.innerHTML = `
              ${panelTabHtml}
              <div class="panel-content">
                  <div class="panel-actions">
                      <button class="panel-settings-btn" title="面板设置">⚙设置</button>
                      <button class="panel-close-btn" title="关闭面板">×</button>
                  </div>
                  <div class="config-section" data-section="domain">
                      <button class="config-section-toggle" data-section="domain">
                          <span id="domain-config-title">域名配置</span>
                          <span class="config-section-indicator">▼</span>
                      </button>
                      <div class="config-section-content">
                          <div class="domain-info">
                              <h4><span id="domain-info-text">当前域名：</span><span id="domain-info-value"></span></h4>
                              <div class="page-type"><span id="page-type-text"></span><span id="page-type-value"></span></div>
                          </div>
                      </div>
                  </div>

                  <div class="config-section" data-section="keywords">
                      <button class="config-section-toggle" data-section="keywords">
                          <span id="keywords-config-title">关键词配置</span>
                          <span class="config-section-indicator">▼</span>
                      </button>
                      <div class="config-section-content">
                          <div id="keywords-container"></div>
                      </div>
                  </div>
                  <div class="config-section" data-section="usernames">
                      <button class="config-section-toggle" data-section="usernames">
                          <span id="usernames-config-title">用户名配置</span>
                          <span class="config-section-indicator">▼</span>
                      </button>
                      <div class="config-section-content">
                          <div id="usernames-container"></div>
                      </div>
                  </div>
                  <div class="config-section" data-section="data-interaction">
                      <button class="config-section-toggle" data-section="data-interaction">
                          <span id="data-interaction-title">数据交互配置</span>
                          <span class="config-section-indicator">▼</span>
                      </button>
                      <div class="config-section-content">
                          <div id="data-interaction-container"></div>
                      </div>
                  </div>

                  <div class="button-group">
                      <button id="export-config">导出配置</button>
                      <button id="import-config">导入配置</button>
                      <button id="reset-config">清空配置</button>
                  </div>
              </div>
          `;
    panel.querySelector("#page-type-text").textContent = setTextfromTemplate(
      "panel_top_page_type"
    );
    const domainConfigTitle = panel.querySelector("#domain-config-title");
    if (domainConfigTitle) domainConfigTitle.textContent = "域名配置";
    panel.querySelector(".panel-settings-btn").textContent =
      setTextfromTemplate("panel_top_settings_button");
    panel.querySelector(".panel-settings-btn").title = setTextfromTemplate(
      "panel_top_settings_title"
    );

    panel.querySelector("#keywords-config-title").textContent =
      setTextfromTemplate("keywords_config_title");
    panel.querySelector("#usernames-config-title").textContent =
      setTextfromTemplate("usernames_config_title");
    panel.querySelector("#data-interaction-title").textContent = "数据交互配置";

    panel.querySelector("#export-config").textContent = setTextfromTemplate(
      "panel_bottom_export_button"
    );
    panel.querySelector("#import-config").textContent = setTextfromTemplate(
      "panel_bottom_import_button"
    );
    panel.querySelector("#reset-config").textContent = setTextfromTemplate(
      "panel_bottom_reset_button"
    );

    // panel.querySelector('#sync-config-title').textContent = setTextfromTemplate('sync_config_title');
    // panel.querySelector('#sync-server-url').placeholder = setTextfromTemplate('sync_config_server_url');
    // panel.querySelector('#sync-user-key').placeholder = setTextfromTemplate('sync_config_user_key');
    // panel.querySelector('#sync-apply').textContent = setTextfromTemplate('sync_config_apply');
    // panel.querySelector('#sync-delete').textContent = setTextfromTemplate('sync_config_delete');
    // 处理固定分区的折叠状态
    ["keywords", "usernames", "data-interaction"].forEach((section) => {
      const toggle = panel.querySelector(`[data-section="${section}"]`);
      if (toggle) {
        const isCollapsed =
          GLOBAL_CONFIG.CONFIG_SECTION_COLLAPSED[
            `${section}_SECTION_COLLAPSED`
          ];
        toggle.classList[isCollapsed ? "add" : "remove"]("collapsed");
      }
    });
    panel
      .querySelector("#export-config")
      .addEventListener("click", exportUserConfig);
    panel
      .querySelector("#import-config")
      .addEventListener("click", importUserConfigFromFile);
    panel
      .querySelector("#reset-config")
      .addEventListener("click", resetUserConfig);

    // panel.querySelector('#sync-apply').addEventListener('click', handleSyncInput);
    // panel.querySelector('#sync-delete').addEventListener('click', deleteCloudConfig);
    // panel.querySelector('#sync-server-url').value = GLOBAL_CONFIG.SYNC_CONFIG.server_url || '';
    // panel.querySelector('#sync-user-key').value = GLOBAL_CONFIG.SYNC_CONFIG.user_key || '';
    panel.querySelectorAll(".config-section-toggle").forEach((toggle) => {
      toggle.addEventListener("click", function () {
        this.classList.toggle("collapsed");
        const content = this.nextElementSibling;
        if (content && content.classList.contains("config-section-content")) {
          if (this.classList.contains("collapsed")) {
            content.style.maxHeight = "0";
            content.style.opacity = "0";
            content.style.margin = "0";
            content.style.padding = "0";
          } else {
            content.style.maxHeight = "500px";
            content.style.opacity = "1";
            content.style.margin = "";
            content.style.padding = "";
          }
        }
        const section = this.getAttribute("data-section");
        GLOBAL_CONFIG.CONFIG_SECTION_COLLAPSED[`${section}_SECTION_COLLAPSED`] =
          this.classList.contains("collapsed");
        saveGlobalConfig();
      });
    });
    function restoreConfigSections() {
      panel.querySelectorAll(".config-section-toggle").forEach((toggle) => {
        const section = toggle.getAttribute("data-section");
        const isCollapsed =
          GLOBAL_CONFIG.CONFIG_SECTION_COLLAPSED[
            `${section}_SECTION_COLLAPSED`
          ];
        if (isCollapsed) {
          toggle.classList.add("collapsed");
          const content = toggle.nextElementSibling;
          if (content && content.classList.contains("config-section-content")) {
            content.style.maxHeight = "0";
            content.style.opacity = "0";
            content.style.margin = "0";
            content.style.padding = "0";
          }
        }
      });
    }
    document.body.appendChild(panel);

    applyPanelSettings();
    updatePanelContent();
    restoreConfigSections();
    // 同步一次悬浮按钮和侧边栏的显示状态
    try {
      syncFloatingButtonVisibilityWithSidebar();
    } catch (e) {}

    // 为通过HTML创建的按钮添加事件监听
    if (buttonVisible) {
      // 获取HTML创建的按钮
      const tabButton = panel.querySelector(".panel-tab");
      if (tabButton) {
        // 为按钮添加点击事件
        tabButton.addEventListener("click", function () {
          if (panel.classList.contains("click-mode")) {
            // 为点击添加缩放动画效果
            tabButton.style.transform = "translateY(-50%) scale(0.9)";
            setTimeout(() => {
              tabButton.style.transform = "translateY(-50%)";
            }, 100);

            panel.classList.toggle("expanded");

            // 使用requestAnimationFrame来确保在下一帧渲染前更新样式，使过渡效果更流畅
            requestAnimationFrame(() => {
              // 更新面板位置
              if (panel.classList.contains("expanded")) {
                panel.style.left = "50%";
                panel.style.transform = "translate(-50%, -50%) scale(1)";

                // 移动设备时调整宽度和滚动设置
                if (isMobileDevice()) {
                  panel.style.maxHeight = "80vh";
                  document.body.style.overflow = "hidden"; // 防止背景滚动
                }
              } else {
                // 添加缩放效果使面板收起更加丝滑
                panel.style.transform = "translate(-50%, -50%) scale(0.95)";
                setTimeout(() => {
                  panel.style.left = "10px";
                  panel.style.transform = "translate(-50%, -50%)";
                }, 50);

                // 恢复滚动
                if (isMobileDevice()) {
                  document.body.style.overflow = "";
                }
              }
            });
          }
        });
      }
    }
    panel
      .querySelector(".panel-settings-btn")
      .addEventListener("click", function () {
        const settingsPanel = document.getElementById("forum-filter-settings");
        const overlay = document.getElementById("settings-overlay");
        if (settingsPanel && overlay) {
          settingsPanel.classList.add("visible");
          overlay.style.display = "block";
        }
      });
    // 不再需要在这里查找和添加事件监听器，因为我们已经在创建按钮时添加了事件监听器

    // 添加关闭按钮事件
    panel
      .querySelector(".panel-close-btn")
      .addEventListener("click", function () {
        if (panel.classList.contains("click-mode")) {
          // 添加按钮点击缩放效果
          this.style.transform = "scale(0.9)";
          setTimeout(() => {
            this.style.transform = "";
          }, 100);

          panel.classList.remove("expanded");

          // 使用requestAnimationFrame来确保在下一帧渲染前更新样式，使过渡效果更流畅
          requestAnimationFrame(() => {
            // 先添加缩放效果
            panel.style.transform = "translate(-50%, -50%) scale(0.95)";

            setTimeout(() => {
              // 然后更新面板位置回到左侧
              panel.style.left = "10px";
              panel.style.transform = "translate(-50%, -50%)";
            }, 50);

            // 恢复滚动（移动设备）
            if (isMobileDevice()) {
              document.body.style.overflow = "";
            }
          });
        }
      });

    return panel;
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      createSettingsPanel();
      createControlPanel();
      // initCloudSync();
    });
  } else {
    createSettingsPanel();
    createControlPanel();
    // initCloudSync();
  }
  function getSplitUrl() {
    const currentUrl = new URL(window.location.href);
    return currentUrl.pathname + (currentUrl.search ? currentUrl.search : "");
  }
  function createArrayEditor(
    title,
    items,
    onAdd,
    onDelete,
    className = null,
    isRegex = false
  ) {
    const container = document.createElement("div");
    container.className = "array-editor";
    if (!Array.isArray(items)) {
      items = [];
    }
    const toggleButton = document.createElement("button");
    toggleButton.className = "array-editor-toggle";
    const titleSpan = document.createElement("span");
    titleSpan.textContent = title;
    if (className) {
      titleSpan.className = className;
    }
    const countSpan = document.createElement("span");
    countSpan.className = "array-editor-count";
    countSpan.textContent = `${items.length}`;
    toggleButton.appendChild(titleSpan);
    toggleButton.appendChild(countSpan);
    const content = document.createElement("div");
    content.className = "array-editor-content";
    let editorType;
    const currentLanguage = GLOBAL_CONFIG.LANGUAGE || "zh-CN";
    const templates = LANGUAGE_TEMPLATES[currentLanguage];
    if (title === templates.url_patterns_main_page_url_patterns_title) {
      editorType = "mainpage_url_patterns";
    } else if (
      title === templates.url_patterns_content_page_url_patterns_title
    ) {
      editorType = "contentpage_url_patterns";
    } else if (
      title === templates.xpath_config_main_and_sub_page_usernames_title
    ) {
      editorType = "main_and_sub_page_user_xpath";
    } else if (
      title === templates.xpath_config_main_and_sub_page_keywords_title
    ) {
      editorType = "main_and_sub_page_title_xpath";
    } else if (title === templates.xpath_config_content_page_usernames_title) {
      editorType = "contentpage_user_xpath";
    } else if (title === templates.xpath_config_content_page_keywords_title) {
      editorType = "contentpage_title_xpath";
    } else if (title === templates.keywords_config_keywords_regex_title) {
      editorType = "keywords_regex";
    } else if (title === templates.usernames_config_usernames_regex_title) {
      editorType = "usernames_regex";
    } else if (title === templates.usernames_config_usernames_list_title) {
      editorType = "usernames";
    } else if (title === templates.keywords_config_keywords_list_title) {
      editorType = "keywords";
    }
    if (GLOBAL_CONFIG.EDITOR_STATES[editorType]) {
      content.classList.add("expanded");
    }
    const header = document.createElement("div");
    const header2 = document.createElement("div");
    const header3 = document.createElement("div");
    header.className = "array-editor-header";
    header2.className = "array-editor-header";
    header3.className = "array-editor-header";
    const buttonGroup1 = document.createElement("div");
    buttonGroup1.className = "button-group-inline";
    const input = document.createElement("input");
    input.type = "text";
    if (isRegex) {
      input.placeholder = setTextfromTemplate(
        "array_editor_add_item_input_placeholder_regex"
      );
      input.className = "array-editor-additem-input-regex";
    } else {
      input.placeholder = setTextfromTemplate(
        "array_editor_add_item_input_placeholder"
      );
      input.className = "array-editor-additem-input";
    }
    const addButton = document.createElement("button");
    addButton.textContent = setTextfromTemplate("array_editor_add_item");
    addButton.title = setTextfromTemplate("array_editor_add_item_title");
    addButton.className = "array-editor-add-button";
    const deleteAllButton = document.createElement("button");
    deleteAllButton.textContent = setTextfromTemplate(
      "array_editor_clear_allitem"
    );
    deleteAllButton.title = setTextfromTemplate(
      "array_editor_clear_allitem_title"
    );
    deleteAllButton.className = "array-editor-delete-all-button";
    const buttonGroup2 = document.createElement("div");
    buttonGroup2.className = "button-group-inline";
    const exportButton = document.createElement("button");
    exportButton.textContent = setTextfromTemplate(
      "array_editor_export_button"
    );
    exportButton.title = setTextfromTemplate(
      "array_editor_export_button_title"
    );
    exportButton.className = "array-editor-export-button";
    const importButton = document.createElement("button");
    importButton.textContent = setTextfromTemplate(
      "array_editor_fileimport_input_button"
    );
    importButton.title = setTextfromTemplate(
      "array_editor_fileimport_input_button_title"
    );
    importButton.className = "array-editor-import-button";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt";
    fileInput.style.display = "none";
    const searchinput = document.createElement("input");
    searchinput.type = "text";
    searchinput.placeholder = setTextfromTemplate(
      "array_editor_search_input_placeholder"
    );
    searchinput.className = "array-editor-search-input";
    buttonGroup1.appendChild(addButton);
    buttonGroup1.appendChild(deleteAllButton);
    buttonGroup2.appendChild(importButton);
    buttonGroup2.appendChild(exportButton);
    header.appendChild(input);
    header.appendChild(buttonGroup1);
    header2.appendChild(buttonGroup2);
    header2.appendChild(fileInput);
    header3.appendChild(searchinput);
    const list = document.createElement("div");
    list.className = "array-editor-list";
    list.dataset.empty = setTextfromTemplate(
      "array_editor_list_empty_placeholder"
    );
    const updateList = (searchText = "") => {
      list.innerHTML = "";
      const filteredItems = searchText.trim()
        ? items.filter((item) =>
            typeof item === "string" && typeof searchText === "string"
              ? item.toLowerCase().includes(searchText.toLowerCase())
              : false
          )
        : items;
      filteredItems.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "array-item";
        let displayText = item;
        if (searchText.trim()) {
          const regex = new RegExp(`(${searchText})`, "gi");
          displayText = item.replace(regex, "<mark>$1</mark>");
        }
        itemElement.innerHTML = `
                      <span>${displayText}</span>
                      <button>×</button>
                  `;
        const originalIndex = items.indexOf(item);
        itemElement.querySelector("button").onclick = () => {
          const maybeNewItems = onDelete(originalIndex);
          if (Array.isArray(maybeNewItems)) {
            items = maybeNewItems;
          }
          updateList(searchText);
          countSpan.textContent = `${items.length}`;
        };
        list.appendChild(itemElement);
      });
      countSpan.textContent = `${items.length} ${
        searchText ? ` (${filteredItems.length})` : ""
      }`;
    };
    searchinput.addEventListener("input", (e) => {
      updateList(e.target.value);
    });
    searchinput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchinput.value = "";
        updateList("");
      }
    });
    const addNewItem = (value) => {
      if (value.trim()) {
        const newItem = value.trim();
        const isDuplicate = items.some((item) =>
          typeof item === "string" && typeof newItem === "string"
            ? item.toLowerCase() === newItem.toLowerCase()
            : false
        );
        if (isDuplicate) {
          return true;
        }
        const maybeNewItems = onAdd(newItem);
        if (Array.isArray(maybeNewItems)) {
          items = maybeNewItems;
        }
        updateList();
        countSpan.textContent = `${items.length}`;
        return true;
      }
      return false;
    };
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        if (addNewItem(input.value)) {
          input.value = "";
        }
      }
    });
    addButton.onclick = () => {
      if (input.value.trim()) {
        if (addNewItem(input.value)) {
          input.value = "";
        }
      }
    };
    deleteAllButton.onclick = () => {
      if (items.length === 0) {
        alert(setTextfromTemplate("alert_list_empty"));
        return;
      }
      if (confirm(setTextfromTemplate("alert_clear_confirm"))) {
        const currentConfig = getDomainConfig(getCurrentDomain());
        const isMainPage = currentConfig.mainPageUrlPatterns?.some((pattern) =>
          new RegExp(pattern).test(getSplitUrl())
        );
        const isContentPage = currentConfig.contentPageUrlPatterns?.some(
          (pattern) => new RegExp(pattern).test(getSplitUrl())
        );
        if (
          title ===
          setTextfromTemplate("url_patterns_main_page_url_patterns_title")
        ) {
          currentConfig.mainPageUrlPatterns = [];
          updateDomainConfig(getCurrentDomain(), currentConfig);
          updatePanelContent();
          debouncedHandleElements();
          return;
        } else if (
          title ===
          setTextfromTemplate("url_patterns_content_page_url_patterns_title")
        ) {
          currentConfig.contentPageUrlPatterns = [];
          updateDomainConfig(getCurrentDomain(), currentConfig);
          updatePanelContent();
          debouncedHandleElements();
          return;
        }
        // 数据交互区域：通过容器 ID 精确清空
        if (className && className.startsWith("patterns-editor-")) {
          const idx = parseInt(className.replace("patterns-editor-", ""));
          const res = mutateDIList(idx, "patterns", "clear");
          if (Array.isArray(res.list)) items = res.list;
          updateList("");
          debouncedHandleElements();
          return;
        }
        if (className && className.startsWith("title-xpath-editor-")) {
          const idx = parseInt(className.replace("title-xpath-editor-", ""));
          const res = mutateDIList(idx, "title", "clear");
          if (Array.isArray(res.list)) items = res.list;
          updateList("");
          debouncedHandleElements();
          return;
        }
        if (className && className.startsWith("user-xpath-editor-")) {
          const idx = parseInt(className.replace("user-xpath-editor-", ""));
          const res = mutateDIList(idx, "user", "clear");
          if (Array.isArray(res.list)) items = res.list;
          updateList("");
          debouncedHandleElements();
          return;
        }
        if (
          title ===
          setTextfromTemplate("xpath_config_main_and_sub_page_keywords_title")
        ) {
          if (!currentConfig.mainAndSubPageKeywords) {
            currentConfig.mainAndSubPageKeywords = {};
          }
          currentConfig.mainAndSubPageKeywords.xpath = [];
          updateDomainConfig(getCurrentDomain(), currentConfig);
          updatePanelContent();
          debouncedHandleElements();
          return;
        } else if (
          title ===
          setTextfromTemplate("xpath_config_main_and_sub_page_usernames_title")
        ) {
          if (!currentConfig.mainAndSubPageUserKeywords) {
            currentConfig.mainAndSubPageUserKeywords = {};
          }
          currentConfig.mainAndSubPageUserKeywords.xpath = [];
          updateDomainConfig(getCurrentDomain(), currentConfig);
          updatePanelContent();
          debouncedHandleElements();
          return;
        } else if (
          title ===
          setTextfromTemplate("xpath_config_content_page_keywords_title")
        ) {
          if (!currentConfig.contentPageKeywords) {
            currentConfig.contentPageKeywords = {};
          }
          currentConfig.contentPageKeywords.xpath = [];
          updateDomainConfig(getCurrentDomain(), currentConfig);
          updatePanelContent();
          debouncedHandleElements();
          return;
        } else if (
          title ===
          setTextfromTemplate("xpath_config_content_page_usernames_title")
        ) {
          if (!currentConfig.contentPageUserKeywords) {
            currentConfig.contentPageUserKeywords = {};
          }
          currentConfig.contentPageUserKeywords.xpath = [];
          updateDomainConfig(getCurrentDomain(), currentConfig);
          updatePanelContent();
          debouncedHandleElements();
          return;
        }
        if (
          title === setTextfromTemplate("keywords_config_keywords_list_title")
        ) {
          if (isMainPage) {
            if (!currentConfig.mainAndSubPageKeywords) {
              currentConfig.mainAndSubPageKeywords = {
                keywords: [],
                regexPatterns: [],
              };
            }
            currentConfig.mainAndSubPageKeywords.keywords = [];
          } else if (isContentPage) {
            if (!currentConfig.contentPageKeywords) {
              currentConfig.contentPageKeywords = {
                keywords: [],
                regexPatterns: [],
              };
            }
            currentConfig.contentPageKeywords.keywords = [];
          }
          updateDomainConfig(getCurrentDomain(), currentConfig);
          updatePanelContent();
          debouncedHandleElements();
          return;
        } else if (
          title === setTextfromTemplate("keywords_config_keywords_regex_title")
        ) {
          if (isMainPage) {
            if (!currentConfig.mainAndSubPageKeywords) {
              currentConfig.mainAndSubPageKeywords = {
                keywords: [],
                regexPatterns: [],
              };
            }
            currentConfig.mainAndSubPageKeywords.regexPatterns = [];
          } else if (isContentPage) {
            if (!currentConfig.contentPageKeywords) {
              currentConfig.contentPageKeywords = {
                keywords: [],
                regexPatterns: [],
              };
            }
            currentConfig.contentPageKeywords.regexPatterns = [];
          }
          updateDomainConfig(getCurrentDomain(), currentConfig);
          updatePanelContent();
          debouncedHandleElements();
          return;
        }
        if (
          title === setTextfromTemplate("usernames_config_usernames_list_title")
        ) {
          if (isMainPage) {
            if (!currentConfig.mainAndSubPageUserKeywords) {
              currentConfig.mainAndSubPageUserKeywords = {
                keywords: [],
                regexPatterns: [],
              };
            }
            currentConfig.mainAndSubPageUserKeywords.keywords = [];
          } else if (isContentPage) {
            if (!currentConfig.contentPageUserKeywords) {
              currentConfig.contentPageUserKeywords = {
                keywords: [],
                regexPatterns: [],
              };
            }
            currentConfig.contentPageUserKeywords.keywords = [];
          }
          updateDomainConfig(getCurrentDomain(), currentConfig);
          updatePanelContent();
          debouncedHandleElements();
          return;
        } else if (
          title ===
          setTextfromTemplate("usernames_config_usernames_regex_title")
        ) {
          if (isMainPage) {
            if (!currentConfig.mainAndSubPageUserKeywords) {
              currentConfig.mainAndSubPageUserKeywords = {
                keywords: [],
                regexPatterns: [],
              };
            }
            currentConfig.mainAndSubPageUserKeywords.regexPatterns = [];
          } else if (isContentPage) {
            if (!currentConfig.contentPageUserKeywords) {
              currentConfig.contentPageUserKeywords = {
                keywords: [],
                regexPatterns: [],
              };
            }
            currentConfig.contentPageUserKeywords.regexPatterns = [];
          }
          updateDomainConfig(getCurrentDomain(), currentConfig);
          updatePanelContent();
          debouncedHandleElements();
          return;
        }

        // 处理全局关键词和用户名的清空
        if (title === "全局关键词") {
          if (!GLOBAL_CONFIG.globalKeywords) {
            GLOBAL_CONFIG.globalKeywords = {
              keywords: [],
              regexPatterns: [],
            };
          }
          GLOBAL_CONFIG.globalKeywords.keywords = [];
          saveGlobalConfig();
          updatePanelContent();
          debouncedHandleElements();
          return;
        } else if (title === "全局关键词正则") {
          if (!GLOBAL_CONFIG.globalKeywords) {
            GLOBAL_CONFIG.globalKeywords = {
              keywords: [],
              regexPatterns: [],
            };
          }
          GLOBAL_CONFIG.globalKeywords.regexPatterns = [];
          saveGlobalConfig();
          updatePanelContent();
          debouncedHandleElements();
          return;
        } else if (title === "全局用户名") {
          if (!GLOBAL_CONFIG.globalUsernames) {
            GLOBAL_CONFIG.globalUsernames = {
              keywords: [],
              regexPatterns: [],
            };
          }
          GLOBAL_CONFIG.globalUsernames.keywords = [];
          saveGlobalConfig();
          updatePanelContent();
          debouncedHandleElements();
          return;
        } else if (title === "全局用户名正则") {
          if (!GLOBAL_CONFIG.globalUsernames) {
            GLOBAL_CONFIG.globalUsernames = {
              keywords: [],
              regexPatterns: [],
            };
          }
          GLOBAL_CONFIG.globalUsernames.regexPatterns = [];
          saveGlobalConfig();
          updatePanelContent();
          debouncedHandleElements();
          return;
        }

        // 处理数据交互配置的清空
        if (title === "URL匹配模式") {
          // 通过编辑器容器查找对应的索引
          let editorContainer = deleteAllButton.closest(".array-editor");
          if (editorContainer && editorContainer.id) {
            const match = editorContainer.id.match(/patterns-editor-(\d+)/);
            if (match) {
              const index = parseInt(match[1]);
              const currentConfig = getDomainConfig(getCurrentDomain());
              if (
                currentConfig.urlPatterns &&
                currentConfig.urlPatterns[index]
              ) {
                currentConfig.urlPatterns[index].patterns = [];
                updateDomainConfig(getCurrentDomain(), currentConfig);
                updatePanelContent();
                debouncedHandleElements();
                return;
              }
            }
          }
        } else if (title === "标题XPath") {
          // 通过编辑器容器查找对应的索引
          let editorContainer = deleteAllButton.closest(".array-editor");
          if (editorContainer && editorContainer.id) {
            const match = editorContainer.id.match(/title-xpath-editor-(\d+)/);
            if (match) {
              const index = parseInt(match[1]);
              const currentConfig = getDomainConfig(getCurrentDomain());
              if (
                currentConfig.urlPatterns &&
                currentConfig.urlPatterns[index] &&
                currentConfig.urlPatterns[index].xpath
              ) {
                currentConfig.urlPatterns[index].xpath.title = [];
                updateDomainConfig(getCurrentDomain(), currentConfig);
                updatePanelContent();
                debouncedHandleElements();
                return;
              }
            }
          }
        } else if (title === "用户XPath") {
          // 通过编辑器容器查找对应的索引
          let editorContainer = deleteAllButton.closest(".array-editor");
          if (editorContainer && editorContainer.id) {
            const match = editorContainer.id.match(/user-xpath-editor-(\d+)/);
            if (match) {
              const index = parseInt(match[1]);
              const currentConfig = getDomainConfig(getCurrentDomain());
              if (
                currentConfig.urlPatterns &&
                currentConfig.urlPatterns[index] &&
                currentConfig.urlPatterns[index].xpath
              ) {
                currentConfig.urlPatterns[index].xpath.user = [];
                updateDomainConfig(getCurrentDomain(), currentConfig);
                updatePanelContent();
                debouncedHandleElements();
                return;
              }
            }
          }
        }
      }
    };
    exportButton.onclick = () => {
      const blob = new Blob([items.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    importButton.onclick = () => {
      fileInput.click();
    };

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const newItems = content
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter((item) => item);
          const currentConfig = getDomainConfig(getCurrentDomain());
          let addedCount = 0;
          let duplicateCount = 0;
          if (
            title ===
            setTextfromTemplate("url_patterns_main_page_url_patterns_title")
          ) {
            newItems.forEach((item) => {
              if (!currentConfig.mainPageUrlPatterns.includes(item)) {
                currentConfig.mainPageUrlPatterns.push(item);
                addedCount++;
              } else {
                duplicateCount++;
              }
            });
            updateDomainConfig(getCurrentDomain(), currentConfig);
            updatePanelContent();
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          } else if (
            title ===
            setTextfromTemplate("url_patterns_content_page_url_patterns_title")
          ) {
            newItems.forEach((item) => {
              if (!currentConfig.contentPageUrlPatterns.includes(item)) {
                currentConfig.contentPageUrlPatterns.push(item);
                addedCount++;
              } else {
                duplicateCount++;
              }
            });
            updateDomainConfig(getCurrentDomain(), currentConfig);
            updatePanelContent();
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          }
          // 数据交互区域：批量导入
          if (className && className.startsWith("patterns-editor-")) {
            const idx = parseInt(className.replace("patterns-editor-", ""));
            const res = mutateDIList(idx, "patterns", "bulkAdd", newItems);
            if (res && Array.isArray(res.list)) {
              items = res.list;
              addedCount = res.addedCount || 0;
              duplicateCount = newItems.length - addedCount;
            }
            updateList("");
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          }
          if (className && className.startsWith("title-xpath-editor-")) {
            const idx = parseInt(className.replace("title-xpath-editor-", ""));
            const res = mutateDIList(idx, "title", "bulkAdd", newItems);
            if (res && Array.isArray(res.list)) {
              items = res.list;
              addedCount = res.addedCount || 0;
              duplicateCount = newItems.length - addedCount;
            }
            updateList("");
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          }
          if (className && className.startsWith("user-xpath-editor-")) {
            const idx = parseInt(className.replace("user-xpath-editor-", ""));
            const res = mutateDIList(idx, "user", "bulkAdd", newItems);
            if (res && Array.isArray(res.list)) {
              items = res.list;
              addedCount = res.addedCount || 0;
              duplicateCount = newItems.length - addedCount;
            }
            updateList("");
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          }
          if (
            title ===
            setTextfromTemplate("xpath_config_main_and_sub_page_keywords_title")
          ) {
            if (!currentConfig.mainAndSubPageKeywords) {
              currentConfig.mainAndSubPageKeywords = { xpath: [] };
            }
            newItems.forEach((item) => {
              if (!currentConfig.mainAndSubPageKeywords.xpath.includes(item)) {
                currentConfig.mainAndSubPageKeywords.xpath.push(item);
                addedCount++;
              } else {
                duplicateCount++;
              }
            });
            updateDomainConfig(getCurrentDomain(), currentConfig);
            updatePanelContent();
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          } else if (
            title ===
            setTextfromTemplate(
              "xpath_config_main_and_sub_page_usernames_title"
            )
          ) {
            if (!currentConfig.mainAndSubPageUserKeywords) {
              currentConfig.mainAndSubPageUserKeywords = { xpath: [] };
            }
            newItems.forEach((item) => {
              if (
                !currentConfig.mainAndSubPageUserKeywords.xpath.includes(item)
              ) {
                currentConfig.mainAndSubPageUserKeywords.xpath.push(item);
                addedCount++;
              } else {
                duplicateCount++;
              }
            });
            updateDomainConfig(getCurrentDomain(), currentConfig);
            updatePanelContent();
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          } else if (
            title ===
            setTextfromTemplate("xpath_config_content_page_keywords_title")
          ) {
            if (!currentConfig.contentPageKeywords) {
              currentConfig.contentPageKeywords = { xpath: [] };
            }
            newItems.forEach((item) => {
              if (!currentConfig.contentPageKeywords.xpath.includes(item)) {
                currentConfig.contentPageKeywords.xpath.push(item);
                addedCount++;
              } else {
                duplicateCount++;
              }
            });
            updateDomainConfig(getCurrentDomain(), currentConfig);
            updatePanelContent();
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          } else if (
            title ===
            setTextfromTemplate("xpath_config_content_page_usernames_title")
          ) {
            if (!currentConfig.contentPageUserKeywords) {
              currentConfig.contentPageUserKeywords = { xpath: [] };
            }
            newItems.forEach((item) => {
              if (!currentConfig.contentPageUserKeywords.xpath.includes(item)) {
                currentConfig.contentPageUserKeywords.xpath.push(item);
                addedCount++;
              } else {
                duplicateCount++;
              }
            });
            updateDomainConfig(getCurrentDomain(), currentConfig);
            updatePanelContent();
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          }
          const isMainPage = currentConfig.mainPageUrlPatterns?.some(
            (pattern) => new RegExp(pattern).test(getSplitUrl())
          );
          const isContentPage = currentConfig.contentPageUrlPatterns?.some(
            (pattern) => new RegExp(pattern).test(getSplitUrl())
          );
          if (
            title === setTextfromTemplate("keywords_config_keywords_list_title")
          ) {
            if (isMainPage) {
              if (!currentConfig.mainAndSubPageKeywords) {
                currentConfig.mainAndSubPageKeywords = {
                  keywords: [],
                  regexPatterns: [],
                };
              }
              newItems.forEach((item) => {
                if (
                  !currentConfig.mainAndSubPageKeywords.keywords.includes(item)
                ) {
                  currentConfig.mainAndSubPageKeywords.keywords.push(item);
                  addedCount++;
                } else {
                  duplicateCount++;
                }
              });
            } else if (isContentPage) {
              if (!currentConfig.contentPageKeywords) {
                currentConfig.contentPageKeywords = {
                  keywords: [],
                  regexPatterns: [],
                };
              }
              newItems.forEach((item) => {
                if (
                  !currentConfig.contentPageKeywords.keywords.includes(item)
                ) {
                  currentConfig.contentPageKeywords.keywords.push(item);
                  addedCount++;
                } else {
                  duplicateCount++;
                }
              });
            }
            updateDomainConfig(getCurrentDomain(), currentConfig);
            updatePanelContent();
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          } else if (
            title ===
            setTextfromTemplate("keywords_config_keywords_regex_title")
          ) {
            if (isMainPage) {
              if (!currentConfig.mainAndSubPageKeywords) {
                currentConfig.mainAndSubPageKeywords = {
                  keywords: [],
                  regexPatterns: [],
                };
              }
              newItems.forEach((item) => {
                if (
                  !currentConfig.mainAndSubPageKeywords.regexPatterns.includes(
                    item
                  )
                ) {
                  currentConfig.mainAndSubPageKeywords.regexPatterns.push(item);
                  addedCount++;
                } else {
                  duplicateCount++;
                }
              });
            } else if (isContentPage) {
              if (!currentConfig.contentPageKeywords) {
                currentConfig.contentPageKeywords = {
                  keywords: [],
                  regexPatterns: [],
                };
              }
              newItems.forEach((item) => {
                if (
                  !currentConfig.contentPageKeywords.regexPatterns.includes(
                    item
                  )
                ) {
                  currentConfig.contentPageKeywords.regexPatterns.push(item);
                  addedCount++;
                } else {
                  duplicateCount++;
                }
              });
            }
            updateDomainConfig(getCurrentDomain(), currentConfig);
            updatePanelContent();
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          }
          if (
            title ===
            setTextfromTemplate("usernames_config_usernames_list_title")
          ) {
            if (isMainPage) {
              if (!currentConfig.mainAndSubPageUserKeywords) {
                currentConfig.mainAndSubPageUserKeywords = {
                  keywords: [],
                  regexPatterns: [],
                };
              }
              newItems.forEach((item) => {
                if (
                  !currentConfig.mainAndSubPageUserKeywords.keywords.includes(
                    item
                  )
                ) {
                  currentConfig.mainAndSubPageUserKeywords.keywords.push(item);
                  addedCount++;
                } else {
                  duplicateCount++;
                }
              });
            } else if (isContentPage) {
              if (!currentConfig.contentPageUserKeywords) {
                currentConfig.contentPageUserKeywords = {
                  keywords: [],
                  regexPatterns: [],
                };
              }
              newItems.forEach((item) => {
                if (
                  !currentConfig.contentPageUserKeywords.keywords.includes(item)
                ) {
                  currentConfig.contentPageUserKeywords.keywords.push(item);
                  addedCount++;
                } else {
                  duplicateCount++;
                }
              });
            }
            updateDomainConfig(getCurrentDomain(), currentConfig);
            updatePanelContent();
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          } else if (
            title ===
            setTextfromTemplate("usernames_config_usernames_regex_title")
          ) {
            if (isMainPage) {
              if (!currentConfig.mainAndSubPageUserKeywords) {
                currentConfig.mainAndSubPageUserKeywords = {
                  keywords: [],
                  regexPatterns: [],
                };
              }
              newItems.forEach((item) => {
                if (
                  !currentConfig.mainAndSubPageUserKeywords.regexPatterns.includes(
                    item
                  )
                ) {
                  currentConfig.mainAndSubPageUserKeywords.regexPatterns.push(
                    item
                  );
                  addedCount++;
                } else {
                  duplicateCount++;
                }
              });
            } else if (isContentPage) {
              if (!currentConfig.contentPageUserKeywords) {
                currentConfig.contentPageUserKeywords = {
                  keywords: [],
                  regexPatterns: [],
                };
              }
              newItems.forEach((item) => {
                if (
                  !currentConfig.contentPageUserKeywords.regexPatterns.includes(
                    item
                  )
                ) {
                  currentConfig.contentPageUserKeywords.regexPatterns.push(
                    item
                  );
                  addedCount++;
                } else {
                  duplicateCount++;
                }
              });
            }
            updateDomainConfig(getCurrentDomain(), currentConfig);
            updatePanelContent();
            debouncedHandleElements();
            showImportResult(addedCount, duplicateCount);
            return;
          }
        };
        reader.readAsText(file);
        fileInput.value = "";
      }
    };
    function showImportResult(addedCount, duplicateCount) {
      const messages = {
        "zh-CN": `导入完成：\n成功导入 ${addedCount} 项\n重复项 ${duplicateCount} 项`,
      };
      alert(messages[GLOBAL_CONFIG.LANGUAGE] || messages["zh-CN"]);
    }
    toggleButton.onclick = () => {
      content.classList.toggle("expanded");
      GLOBAL_CONFIG.EDITOR_STATES[editorType] =
        content.classList.contains("expanded");
      saveGlobalConfig();
    };
    content.appendChild(header);
    content.appendChild(header3);
    content.appendChild(list);
    content.appendChild(header2);
    container.appendChild(toggleButton);
    container.appendChild(content);
    updateList();
    return container;
  }

  // 仅显示用途的静态列表（无增删控件）
  function createStaticList(title, items) {
    const container = document.createElement("div");
    container.className = "array-editor";
    const toggleButton = document.createElement("button");
    toggleButton.className = "array-editor-toggle";
    const titleSpan = document.createElement("span");
    titleSpan.textContent = title;
    const countSpan = document.createElement("span");
    countSpan.className = "array-editor-count";
    countSpan.textContent = `${Array.isArray(items) ? items.length : 0}`;
    toggleButton.appendChild(titleSpan);
    toggleButton.appendChild(countSpan);
    const content = document.createElement("div");
    content.className = "array-editor-content expanded";
    const list = document.createElement("div");
    list.className = "array-editor-list";
    list.dataset.empty = setTextfromTemplate(
      "array_editor_list_empty_placeholder"
    );
    (Array.isArray(items) ? items : []).forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "array-item";
      const span = document.createElement("span");
      span.textContent = item;
      itemElement.appendChild(span);
      list.appendChild(itemElement);
    });
    content.appendChild(list);
    container.appendChild(toggleButton);
    container.appendChild(content);
    toggleButton.onclick = () => {
      content.classList.toggle("expanded");
    };
    return container;
  }

  function setTextfromTemplate(args) {
    const currentLanguage = GLOBAL_CONFIG.LANGUAGE || "zh";
    return LANGUAGE_TEMPLATES[currentLanguage][args] || args;
  }
  function setLanguage(language) {
    if (!LANGUAGE_TEMPLATES[language]) {
      console.error(`Language ${language} not found in templates`);
      return;
    }
    GLOBAL_CONFIG.LANGUAGE = language;
    saveGlobalConfig();
    const templates = LANGUAGE_TEMPLATES[language];
    document.querySelector("#domain-info-text").textContent =
      templates.panel_top_current_domain;
    document.querySelector("#domain-info-value").textContent =
      getCurrentDomain();
    // 仅显示匹配组名：清空标签文本，保持由 updatePanelContent 赋值 name
    const pageTypeTextEl = document.querySelector("#page-type-text");
    if (pageTypeTextEl) pageTypeTextEl.textContent = "";
    const pageTypeValueEl = document.querySelector("#page-type-value");
    if (pageTypeValueEl)
      pageTypeValueEl.textContent = getCurrentPageInfo().matchedGroupName || "";
    document.querySelector(".panel-settings-btn").title =
      templates.panel_top_settings_title;
    document.querySelector(".panel-settings-btn").textContent =
      templates.panel_top_settings_button;

    document.querySelectorAll(".config-section-toggle").forEach((toggle) => {
      const section = toggle.getAttribute("data-section");
      const titleSpan = toggle.querySelector("span:first-child");
      switch (section) {
        case "keywords":
          titleSpan.textContent = templates.keywords_config_title;
          break;
        case "usernames":
          titleSpan.textContent = templates.usernames_config_title;
          break;
        case "domain":
          titleSpan.textContent = "域名配置";
          break;
        case "url":
          titleSpan.textContent = templates.url_patterns_title;
          break;
        case "xpath":
          titleSpan.textContent = templates.xpath_config_title;
          break;
      }
    });
    const globalCheckboxes = document.querySelectorAll(".checkbox-row label");
    globalCheckboxes[0].textContent = templates.global_config_keywords;
    globalCheckboxes[1].textContent = templates.global_config_usernames;
    globalCheckboxes[2].textContent = templates.global_config_share_keywords;
    globalCheckboxes[3].textContent = templates.global_config_share_usernames;

    document.querySelectorAll(".array-editor").forEach((editor) => {
      const addItemInput = editor.querySelector(".array-editor-additem-input");
      if (addItemInput) {
        addItemInput.placeholder =
          templates.array_editor_add_item_input_placeholder;
      }
      const addItemInputRegex = editor.querySelector(
        ".array-editor-additem-input-regex"
      );
      if (addItemInputRegex) {
        addItemInputRegex.placeholder =
          templates.array_editor_add_item_input_placeholder_regex;
      }
      const searchInput = editor.querySelector(".array-editor-search-input");
      if (searchInput) {
        searchInput.placeholder =
          templates.array_editor_search_input_placeholder;
      }

      const list = editor.querySelector(".array-editor-list");
      if (list) {
        list.dataset.empty = templates.array_editor_list_empty_placeholder;
      }
      const keywords_config_keywords_list_title = editor.querySelector(
        ".array-editor-keywords-list"
      );
      if (keywords_config_keywords_list_title) {
        keywords_config_keywords_list_title.textContent =
          templates.keywords_config_keywords_list_title;
      }
      const keywords_config_keywords_regex_title = editor.querySelector(
        ".array-editor-keywords-regex"
      );
      if (keywords_config_keywords_regex_title) {
        keywords_config_keywords_regex_title.textContent =
          templates.keywords_config_keywords_regex_title;
      }
      const usernames_config_usernames_list_title = editor.querySelector(
        ".array-editor-usernames-list"
      );
      if (usernames_config_usernames_list_title) {
        usernames_config_usernames_list_title.textContent =
          templates.usernames_config_usernames_list_title;
      }
      const usernames_config_usernames_regex_title = editor.querySelector(
        ".array-editor-usernames-regex"
      );
      if (usernames_config_usernames_regex_title) {
        usernames_config_usernames_regex_title.textContent =
          templates.usernames_config_usernames_regex_title;
      }
      const url_patterns_main_page_url_patterns_title = editor.querySelector(
        ".main-patterns-editor"
      );
      if (url_patterns_main_page_url_patterns_title) {
        url_patterns_main_page_url_patterns_title.textContent =
          templates.url_patterns_main_page_url_patterns_title;
      }
      const url_patterns_sub_page_url_patterns_title = editor.querySelector(
        ".sub-patterns-editor"
      );
      if (url_patterns_sub_page_url_patterns_title) {
        url_patterns_sub_page_url_patterns_title.textContent =
          templates.url_patterns_sub_page_url_patterns_title;
      }
      const url_patterns_content_page_url_patterns_title = editor.querySelector(
        ".content-patterns-editor"
      );
      if (url_patterns_content_page_url_patterns_title) {
        url_patterns_content_page_url_patterns_title.textContent =
          templates.url_patterns_content_page_url_patterns_title;
      }
      const xpath_config_main_and_sub_page_keywords_title =
        editor.querySelector(".title-xpath-editor");
      if (xpath_config_main_and_sub_page_keywords_title) {
        xpath_config_main_and_sub_page_keywords_title.textContent =
          templates.xpath_config_main_and_sub_page_keywords_title;
      }
      const xpath_config_main_and_sub_page_usernames_title =
        editor.querySelector(".user-xpath-editor");
      if (xpath_config_main_and_sub_page_usernames_title) {
        xpath_config_main_and_sub_page_usernames_title.textContent =
          templates.xpath_config_main_and_sub_page_usernames_title;
      }
      const xpath_config_content_page_keywords_title = editor.querySelector(
        ".content-title-xpath-editor"
      );
      if (xpath_config_content_page_keywords_title) {
        xpath_config_content_page_keywords_title.textContent =
          templates.xpath_config_content_page_keywords_title;
      }
      const xpath_config_content_page_usernames_title = editor.querySelector(
        ".content-user-xpath-editor"
      );
      if (xpath_config_content_page_usernames_title) {
        xpath_config_content_page_usernames_title.textContent =
          templates.xpath_config_content_page_usernames_title;
      }
      const buttons = editor.querySelectorAll(".button-group-inline button");
      buttons.forEach((button) => {
        if (button.className === "array-editor-add-button") {
          button.textContent = templates.array_editor_add_item;
        } else if (button.className === "array-editor-delete-all-button") {
          button.textContent = templates.array_editor_clear_allitem;
        } else if (button.className === "array-editor-import-button") {
          button.textContent = templates.array_editor_fileimport_input_button;
        } else if (button.className === "array-editor-export-button") {
          button.textContent = templates.array_editor_export_button;
        }
      });
    });
    document.querySelector("#export-config").textContent =
      templates.panel_bottom_export_button;
    document.querySelector("#import-config").textContent =
      templates.panel_bottom_import_button;

    document.querySelector("#js-settings-title").textContent =
      setTextfromTemplate("settings_title");
    document.querySelector('label[for="language-select"]').textContent =
      setTextfromTemplate("settings_language");

    document.querySelector("#settings-cancel").textContent =
      setTextfromTemplate("settings_cancel");
    document.querySelector("#settings-save").textContent =
      setTextfromTemplate("settings_save");
  }

  // 添加资源管理和性能监控
  const APP = {
    urlChangeCleanup: null,
    updateIntervalId: null,

    // 初始化应用
    init() {
      // 创建页面遮罩层，在屏蔽完成前阻止用户看到未屏蔽的内容
      createPageLoadingOverlay();

      // 使用渐进式加载，分阶段执行初始化
      this.progressiveInit();
    },

    // 渐进式初始化
    progressiveInit() {
      const startTime = performance.now();

      // 更新加载状态
      if (window.updateLoadingProgress) {
        window.updateLoadingProgress(20, "正在初始化过滤器...");
      }

      // 第一阶段：基础初始化
      requestAnimationFrame(() => {
        this.initFilters();

        if (window.updateLoadingProgress) {
          window.updateLoadingProgress(60, "正在设置监听器...");
        }

        // 第二阶段：设置监听器
        requestAnimationFrame(() => {
          this.setupResizeHandler();
          try {
            initSidebarOptionAutoAdd();
          } catch (e) {}

          if (window.updateLoadingProgress) {
            window.updateLoadingProgress(90, "正在完成初始化...");
          }

          // 第三阶段：完成初始化并移除遮罩
          requestAnimationFrame(() => {
            if (window.updateLoadingProgress) {
              window.updateLoadingProgress(100, "加载完成！");
            }

            // 延迟移除遮罩层，确保用户能看到完整的加载过程
            setTimeout(() => {
              removePageLoadingOverlay();
              // 完成后禁用后续遮罩创建，避免调试页频繁波动
              if (window._overlayState) window._overlayState.enabled = false;
            }, 500);
          });
        });
      });
    },

    // 设置窗口大小变化监听
    setupResizeHandler() {
      // 窗口大小变化处理函数，保存为实例方法以便可以移除
      this.handleResize = () => {
        const panel = document.getElementById("forum-filter-panel");
        if (panel) {
          if (isMobileDevice()) {
            panel.classList.add("is-mobile");

            // 如果面板已展开，调整样式
            if (panel.classList.contains("expanded")) {
              panel.style.maxHeight = "80vh";
            }
          } else {
            panel.classList.remove("is-mobile");
          }
        }
      };

      // 添加窗口大小变化监听
      window.addEventListener("resize", this.handleResize);

      // 初始执行一次
      this.handleResize();
    },

    // 初始化过滤器
    initFilters() {
      // 使用优化后的函数处理DOM
      handleElements();

      // 监听URL变化
      this.urlChangeCleanup = listenUrlChange(debouncedHandleElements);

      // 使用更高效的定时器检查更新
      this.setupUpdateChecker();
    },

    // 设置更新检查器
    setupUpdateChecker() {
      // 清除之前的间隔
      if (this.updateIntervalId) {
        clearInterval(this.updateIntervalId);
      }

      // 创建新的间隔，使用性能优化的检查方法
      this.updateIntervalId = setInterval(() => {}, 60000);

      // 立即执行一次更新时间检查
      GM_setValue("LAST_UPDATE_TIME", Date.now());
    },

    // 清理资源
    cleanup() {
      if (this.urlChangeCleanup) {
        this.urlChangeCleanup();
        this.urlChangeCleanup = null;
      }

      if (this.updateIntervalId) {
        clearInterval(this.updateIntervalId);
        this.updateIntervalId = null;
      }

      // 清除窗口大小变化监听
      window.removeEventListener("resize", this.handleResize);
    },
  };

  // 根据文档加载状态启动应用
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => APP.init());
  } else {
    APP.init();
  }

  // 处理页面卸载，清理资源
  window.addEventListener("unload", () => APP.cleanup(), { passive: true });
  function saveConfig(
    args_config = null,
    isglobalurl = false,
    isPushConfigUpdate = false
  ) {
    const panel = document.getElementById("forum-filter-panel");
    if (!panel) return;
    if (args_config) {
      if (args_config.globalConfig) {
        // 合并并保留外部JSON的 globalKeywords/globalUsernames
        for (const key in args_config.globalConfig) {
          if (args_config.globalConfig.hasOwnProperty(key)) {
            GLOBAL_CONFIG[key] = args_config.globalConfig[key];
          }
        }
        if (args_config.globalConfig.globalKeywords) {
          GLOBAL_CONFIG.globalKeywords =
            args_config.globalConfig.globalKeywords;
        }
        if (args_config.globalConfig.globalUsernames) {
          GLOBAL_CONFIG.globalUsernames =
            args_config.globalConfig.globalUsernames;
        }
        saveGlobalConfig();
      }
      if (args_config.userConfig && args_config.userConfig.length > 0) {
        args_config.userConfig.forEach((config) => {
          if (isPushConfigUpdate) {
            // 导入/推送更新：允许覆盖所有重叠域
            upsertConfigByDomainOverlap(config, true);
          } else {
            // 普通更新：保持原逻辑（以首域名为键）
            const keyDomain = Array.isArray(config.domain)
              ? config.domain[0]
              : config.domain;
            const existingConfig = getDomainConfig(keyDomain);
            if (existingConfig) {
              updateDomainConfig(keyDomain, config);
            } else {
              addDomainConfig(config);
            }
          }
        });
      }

      saveUserConfig(userConfig);
      debouncedHandleElements();
      updatePanelContent();
      return;
    }
    const currentConfig =
      getDomainConfig(getCurrentDomain()) || SAMPLE_TEMPLATE;
    const config = {
      domain: getCurrentDomain(),
      enabled: true,
      shareKeywordsAcrossPages: currentConfig.shareKeywordsAcrossPages || true,
      shareUsernamesAcrossPages:
        currentConfig.shareUsernamesAcrossPages || true,
      mainPageUrlPatterns: currentConfig.mainPageUrlPatterns || [],

      contentPageUrlPatterns: currentConfig.contentPageUrlPatterns || [],
      mainAndSubPageKeywords: {
        ...currentConfig.mainAndSubPageKeywords,
        xpath: currentConfig.mainAndSubPageKeywords?.xpath || [],
      },
      mainAndSubPageUserKeywords: {
        ...currentConfig.mainAndSubPageUserKeywords,
        xpath: currentConfig.mainAndSubPageUserKeywords?.xpath || [],
      },
      contentPageKeywords: {
        ...currentConfig.contentPageKeywords,
        xpath: currentConfig.contentPageKeywords?.xpath || [],
      },
      contentPageUserKeywords: {
        ...currentConfig.contentPageUserKeywords,
        xpath: currentConfig.contentPageUserKeywords?.xpath || [],
      },
    };
    saveGlobalConfig();
    const existingIndex = userConfig.findIndex(
      (c) => c.domain === getCurrentDomain()
    );
    if (existingIndex !== -1) {
      userConfig[existingIndex] = config;
    } else {
      userConfig.push(config);
    }

    saveUserConfig(userConfig);
    debouncedHandleElements();
    updatePanelContent();
    return config;
  }
})();
