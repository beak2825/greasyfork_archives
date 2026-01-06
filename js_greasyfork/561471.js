// ==UserScript==
// @name          linuxdo-shadcn
// @namespace     http://tampermonkey.net/
// @version       0.2.0
// @description   LinuxDo / Discourse 主题列表布局增强：分栏/瀑布流 + 设置面板
// @author        @Loveyless https://github.com/Loveyless/linuxdo-shadcn
// @homepageURL   https://github.com/Loveyless/linuxdo-shadcn
// @supportURL    https://github.com/Loveyless/linuxdo-shadcn/issues
// @match         *://*.linux.do/*
// @match         *://*.idcflare.com/*
// @match         *://*.nodeloc.com/*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/561471/linuxdo-shadcn.user.js
// @updateURL https://update.greasyfork.org/scripts/561471/linuxdo-shadcn.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEFAULT_CONFIG = {
    TOPIC_LIST_LAYOUT_ENABLED: true,
    TWO_COLUMN_LAYOUT: 2,
    TOPIC_LIST_WATERFALL: false,
  };

  const SCRIPT_CONSTANTS = {
    INIT_THROTTLE_MS: 300,
    SETTINGS_CLOSE_DELAY_MS: 300,
    DIALOG_CLOSE_ANIMATION_MS: 200,
  };

  function getConfig(key) {
    return GM_getValue(key, DEFAULT_CONFIG[key]);
  }

  function setConfig(key, value) {
    GM_setValue(key, value);
  }

  const CONFIG = new Proxy({}, {
    get(_target, prop) {
      return getConfig(String(prop));
    },
    set(_target, prop, value) {
      setConfig(String(prop), value);
      return true;
    }
  });

  const STYLE_TEXT = /* css */ `
    /* 设置界面样式 - shadcn 风格（简约） */
    .linuxdo-settings-dialog {
        /* 优先使用 Discourse 主题变量，自动适配深浅色；无变量时回退到浅色 */
        --ld-bg: var(--secondary, #ffffff);
        --ld-fg: var(--primary, #0f172a);
        --ld-muted: var(--primary-very-low, #f1f5f9);
        --ld-muted-fg: var(--primary-medium, #64748b);
        --ld-card: var(--secondary, #ffffff);
        --ld-border: var(--content-border-color, rgba(15, 23, 42, 0.12));
        --ld-ring: var(--tertiary-low, rgba(59, 130, 246, 0.45));
        --ld-primary: var(--primary, #0f172a);
        --ld-primary-fg: var(--secondary, #ffffff);

        border: none;
        padding: 0;
        width: min(720px, calc(100vw - 24px));
        max-height: min(85vh, 760px);
        background: transparent;
        overflow: visible;
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
    }

    .linuxdo-settings-dialog,
    .linuxdo-settings-dialog * {
        box-sizing: border-box;
    }

    html[style*="color-scheme: dark"] .linuxdo-settings-dialog,
    html.dark .linuxdo-settings-dialog {
        /* 深色模式兜底：仅当站点未提供主题变量时生效 */
        --ld-bg: var(--secondary, #0b1220);
        --ld-fg: var(--primary, #e2e8f0);
        --ld-muted: var(--primary-very-low, rgba(148, 163, 184, 0.12));
        --ld-muted-fg: var(--primary-medium, #94a3b8);
        --ld-card: var(--secondary, #0f172a);
        --ld-border: var(--content-border-color, rgba(148, 163, 184, 0.18));
        --ld-ring: var(--tertiary-low, rgba(59, 130, 246, 0.55));
        --ld-primary: var(--primary, #e2e8f0);
        --ld-primary-fg: var(--secondary, #0b1220);
    }

    .linuxdo-settings-dialog::backdrop {
        background: rgba(2, 6, 23, 0.65);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }

    .linuxdo-settings-content {
        background: var(--ld-bg);
        color: var(--ld-fg);
        border: 1px solid var(--ld-border);
        border-radius: 12px;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
        display: flex;
        flex-direction: column;
        max-height: inherit;
        overflow: hidden;
    }

    .linuxdo-settings-dialog[closing] .linuxdo-settings-content {
        animation: ldDialogOut 0.16s ease-in forwards;
    }

    @keyframes ldDialogOut {
        to { opacity: 0; transform: translateY(6px) scale(0.985); }
    }

    .linuxdo-settings-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 18px;
        border-bottom: 1px solid var(--ld-border);
        background: var(--ld-bg);
        flex-shrink: 0;
    }

    .linuxdo-settings-title {
        font-size: 16px;
        font-weight: 600;
        line-height: 1.25;
        margin: 0;
        letter-spacing: -0.01em;
    }

    .linuxdo-settings-subtitle {
        margin: 6px 0 0;
        font-size: 12px;
        color: var(--ld-muted-fg);
        line-height: 1.3;
    }

    .linuxdo-settings-close {
        appearance: none;
        border: 1px solid var(--ld-border);
        background: transparent;
        color: var(--ld-muted-fg);
        border-radius: 10px;
        width: 34px;
        height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
        flex-shrink: 0;
        line-height: 1;
    }

    .linuxdo-settings-close:hover {
        background: var(--ld-muted);
        color: var(--ld-fg);
    }

    .linuxdo-settings-close:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px var(--ld-ring);
    }

    .linuxdo-settings-form {
        padding: 18px;
        overflow-y: auto;
        flex: 1;
    }

    .linuxdo-settings-section + .linuxdo-settings-section {
        margin-top: 18px;
    }

    .linuxdo-settings-section-header {
        margin-bottom: 10px;
    }

    .linuxdo-settings-section-title {
        font-size: 12px;
        font-weight: 600;
        color: var(--ld-muted-fg);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin: 0 0 4px;
    }

    .linuxdo-settings-section-desc {
        margin: 0;
        font-size: 12px;
        color: var(--ld-muted-fg);
    }

    .linuxdo-settings-card {
        border: 1px solid var(--ld-border);
        border-radius: 12px;
        background: var(--ld-card);
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .linuxdo-settings-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
    }

    .linuxdo-settings-item-text {
        min-width: 0;
        flex: 1;
    }

    .linuxdo-settings-item-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: var(--ld-fg);
        margin: 0;
    }

    .linuxdo-settings-description {
        font-size: 12px;
        color: var(--ld-muted-fg);
        margin-top: 6px;
        line-height: 1.4;
    }

    .linuxdo-settings-separator {
        height: 1px;
        width: 100%;
        background: var(--ld-border);
    }

    .linuxdo-settings-control {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
    }

    .linuxdo-settings-input {
        width: 100%;
        border: 1px solid var(--ld-border);
        background: var(--ld-bg);
        color: var(--ld-fg);
        border-radius: 9px;
        padding: 7px 9px;
        font-size: 11px;
        line-height: 1.4;
        font-family: inherit;
        outline: none;
        transition: box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease;
    }

    .linuxdo-settings-input.small {
        width: 68px;
        text-align: center;
        padding: 6px 8px;
    }

    .linuxdo-settings-unit {
        font-size: 11px;
        color: var(--ld-muted-fg);
        line-height: 1;
    }

    .linuxdo-settings-input::placeholder {
        color: var(--ld-muted-fg);
    }

    .linuxdo-settings-input:focus-visible {
        box-shadow: 0 0 0 3px var(--ld-ring);
        border-color: rgba(59, 130, 246, 0.65);
    }

    /* Switch */
    .linuxdo-settings-switch {
        position: relative;
        width: 44px;
        height: 24px;
        flex-shrink: 0;
    }

    .linuxdo-settings-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .linuxdo-settings-switch-slider {
        position: absolute;
        inset: 0;
        border-radius: 999px;
        border: 1px solid var(--ld-border);
        background: var(--ld-muted);
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .linuxdo-settings-switch-slider:before {
        position: absolute;
        content: "";
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        border-radius: 999px;
        background: var(--ld-bg);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
        transition: transform 0.15s ease, background 0.15s ease;
    }

    .linuxdo-settings-switch input:checked + .linuxdo-settings-switch-slider {
        background: var(--ld-primary);
        border-color: var(--ld-primary);
    }

    .linuxdo-settings-switch input:checked + .linuxdo-settings-switch-slider:before {
        transform: translateX(20px);
        background: var(--ld-primary-fg);
    }

    .linuxdo-settings-switch input:focus-visible + .linuxdo-settings-switch-slider {
        box-shadow: 0 0 0 3px var(--ld-ring);
    }

    .linuxdo-settings-footer {
        display: flex;
        gap: 10px;
        padding: 14px 18px;
        padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
        border-top: 1px solid var(--ld-border);
        background: var(--ld-bg);
        flex-shrink: 0;
    }

    .linuxdo-settings-button {
        flex: 1;
        padding: 10px 14px;
        border-radius: 10px;
        border: 1px solid var(--ld-border);
        background: transparent;
        color: var(--ld-fg);
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        font-family: inherit;
        transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
    }

    .linuxdo-settings-button:hover {
        background: var(--ld-muted);
    }

    .linuxdo-settings-button:active {
        transform: translateY(1px);
    }

    .linuxdo-settings-button:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px var(--ld-ring);
    }

    .linuxdo-settings-button.primary {
        background: var(--ld-primary);
        border-color: var(--ld-primary);
        color: var(--ld-primary-fg);
    }

    .linuxdo-settings-button.primary:hover {
        filter: brightness(0.98);
    }

    /* 顶部搜索栏右侧：设置入口按钮 */
    .linuxdo-shadcn-settings-trigger {
        margin-left: 8px;
        flex-shrink: 0;
    }

    @media (max-width: 520px) {
        .linuxdo-settings-dialog {
            width: calc(100vw - 16px);
            max-height: 92vh;
        }

        .linuxdo-settings-form {
            padding: 14px;
        }

        .linuxdo-settings-header,
        .linuxdo-settings-footer {
            padding-left: 14px;
            padding-right: 14px;
        }
    }


    /* 主题列表两栏布局 */
    html.linuxdo-two-column-layout {
        /* 颜色尽量复用 Discourse 的 CSS 变量，自动适配深浅色主题 */
        --ld-list-bg: var(--d-content-background, var(--secondary, #ffffff));
        --ld-list-fg: var(--primary, #0f172a);
        --ld-list-muted: var(--metadata-color, var(--primary-medium, #64748b));
        --ld-list-border: var(--content-border-color, rgba(15, 23, 42, 0.12));
        --ld-list-card: var(--topic-list-item-background-color, var(--secondary, #ffffff));
        --ld-list-ring: var(--tertiary-low, rgba(59, 130, 246, 0.18));
    }

    html.linuxdo-two-column-layout .linuxdo-topic-meta-item.linuxdo-topic-meta-count-warn {
        color: var(--highlight-high, #fbbf24);
        font-weight: 600;
    }

    html.linuxdo-two-column-layout .linuxdo-topic-meta-item.linuxdo-topic-meta-count-hot {
        /* 来自 Discourse topic list 的 heatmap-high 颜色 */
        color: #fe7a15;
        font-weight: 700;
    }

    html.linuxdo-two-column-layout table.topic-list {
        display: block !important;
        width: 100% !important;
        background: transparent !important;
    }

    html.linuxdo-two-column-layout table.topic-list thead {
        display: block !important;
        padding: 0 0 8px;
    }

    html.linuxdo-two-column-layout table.topic-list thead tr {
        display: block !important;
    }

    html.linuxdo-two-column-layout table.topic-list thead th {
        display: block !important;
        border: none !important;
        padding: 0 2px 10px !important;
        color: var(--ld-list-muted) !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    html.linuxdo-two-column-layout table.topic-list thead th.posters,
    html.linuxdo-two-column-layout table.topic-list thead th.num,
    html.linuxdo-two-column-layout table.topic-list thead th.posts,
    html.linuxdo-two-column-layout table.topic-list thead th.views,
    html.linuxdo-two-column-layout table.topic-list thead th.activity,
    html.linuxdo-two-column-layout table.topic-list thead th.age {
        display: none !important;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body {
        display: grid !important;
        grid-template-columns: repeat(var(--ld-topic-columns, 2), minmax(0, 1fr));
        gap: 12px;
        padding: 0 !important;
        border-top: none !important;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr:not(.topic-list-item) {
        grid-column: 1 / -1;
    }

    /* 瀑布流（Masonry）：使用多列布局模拟 */
    html.linuxdo-two-column-layout.linuxdo-topic-waterfall tbody.topic-list-body {
        display: block !important;
        column-count: var(--ld-topic-columns, 2);
        column-gap: 12px;
    }

    html.linuxdo-two-column-layout.linuxdo-topic-waterfall tbody.topic-list-body > tr.topic-list-item {
        break-inside: avoid;
        margin-bottom: 12px !important;
    }

    html.linuxdo-two-column-layout.linuxdo-topic-waterfall tbody.topic-list-body > tr:not(.topic-list-item) {
        column-span: all;
        break-inside: avoid;
        margin-bottom: 12px;
    }

    @media (max-width: 900px) {
        html.linuxdo-two-column-layout tbody.topic-list-body {
            grid-template-columns: 1fr;
        }

        html.linuxdo-two-column-layout.linuxdo-topic-waterfall tbody.topic-list-body {
            column-count: 1;
        }
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item {
        display: flex !important;
        flex-direction: column;
        background: var(--ld-list-card);
        border: 1px solid var(--ld-list-border);
        border-radius: 12px;
        padding: 12px 12px 10px;
        margin: 0 !important;
        overflow: hidden;
        transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.05s ease;
    }

    /* 禁用 Discourse 的 selected 高亮效果（两栏模式） */
    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item.selected,
    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item.selected > td {
        background: var(--ld-list-card) !important;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item.selected {
        border-color: var(--ld-list-border) !important;
        box-shadow: none !important;
        outline: none !important;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item.selected:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 0 0 3px var(--ld-list-ring);
    }

    html[style*="color-scheme: dark"].linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item.selected:hover,
    html.dark.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item.selected:hover {
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35), 0 0 0 3px var(--ld-list-ring);
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 0 0 3px var(--ld-list-ring);
    }

    html[style*="color-scheme: dark"].linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item:hover,
    html.dark.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item:hover {
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35), 0 0 0 3px var(--ld-list-ring);
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item > td {
        display: block !important;
        width: 100% !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item > td:not(.main-link) {
        display: none !important;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item td.main-link {
        min-width: 0;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item td.main-link.topic-list-data {
        box-shadow: none !important;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item td.main-link .link-top-line {
        display: block;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item td.main-link a.raw-topic-link {
        color: var(--ld-list-fg) !important;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.35;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-decoration: none;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item td.main-link a.raw-topic-link:hover {
        text-decoration: underline;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item td.main-link .link-bottom-line {
        margin-top: 8px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item td.main-link .link-bottom-line .discourse-tags {
        display: contents;
    }

    html.linuxdo-two-column-layout tbody.topic-list-body > tr.topic-list-item td.main-link .link-bottom-line .discourse-tags__tag-separator {
        display: none !important;
    }

    html.linuxdo-two-column-layout .linuxdo-topic-meta {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--ld-list-border);
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--ld-list-muted);
        font-size: 12px;
        line-height: 1.2;
        white-space: nowrap;
    }

    html.linuxdo-two-column-layout .linuxdo-topic-meta-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 999px;
        overflow: hidden;
        flex-shrink: 0;
        border: 1px solid var(--ld-list-border);
        background: var(--ld-list-bg);
    }

    html.linuxdo-two-column-layout .linuxdo-topic-meta-avatar img {
        width: 22px;
        height: 22px;
        display: block;
    }

    html.linuxdo-two-column-layout .linuxdo-topic-meta-item {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
    }

    html.linuxdo-two-column-layout .linuxdo-topic-meta-item + .linuxdo-topic-meta-item::before {
        content: "·";
        margin: 0 6px 0 0;
        color: var(--ld-list-muted);
    }

    html.linuxdo-two-column-layout .linuxdo-topic-meta .topic-post-badges {
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    html.linuxdo-two-column-layout .linuxdo-topic-meta .topic-post-badges a {
        display: inline-flex;
        align-items: center;
    }

    html.linuxdo-two-column-layout .linuxdo-topic-meta .linuxdo-topic-meta-item + .topic-post-badges::before {
        content: "·";
        margin: 0 6px 0 0;
        color: var(--ld-list-muted);
    }

  `;

  function addStyle(cssText) {
    if (typeof GM_addStyle !== 'undefined') {
      GM_addStyle(cssText);
      return;
    }
    const styleNode = document.createElement('style');
    styleNode.appendChild(document.createTextNode(cssText));
    (document.head || document.documentElement).appendChild(styleNode);
  }

  // ==========================================================
  // 工具函数
  // ==========================================================

  /**
   * 创建一个节流函数，在 wait 毫秒内最多执行 func 一次。
   */
  function throttleInit(func, wait, options = {}) {
    let timeout = null;
    let lastArgs = null;
    let lastThis = null;
    let result;
    let previous = 0;

    const { leading = true, trailing = true } = options;

    if (wait <= 0) {
      return function (...args) {
        return func.apply(this, args);
      };
    }

    function later() {
      previous = leading === false ? 0 : Date.now();
      timeout = null;

      if (lastArgs) {
        result = func.apply(lastThis, lastArgs);
        if (!timeout) {
          lastThis = lastArgs = null;
        }
      }
    }

    function throttled(...args) {
      const now = Date.now();

      if (!previous && leading === false) {
        previous = now;
      }

      const remaining = wait - (now - previous);
      lastArgs = args;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      lastThis = this;

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(lastThis, lastArgs);
        if (!timeout) {
          lastThis = lastArgs = null;
        }
      } else if (!timeout && trailing !== false) {
        timeout = setTimeout(later, remaining);
      }

      return result;
    }

    throttled.cancel = () => {
      clearTimeout(timeout);
      previous = 0;
      timeout = lastThis = lastArgs = null;
    };

    return throttled;
  }

  // ==========================================================
  // 主题列表布局
  // ==========================================================

  function normalizeTopicBadgesWhitespace(badges) {
    if (!badges) return;
    badges.childNodes.forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const cleaned = String(node.textContent || '').replace(/\u00A0/g, '').trim();
      if (!cleaned) node.remove();
    });
  }

  function parseTopicMetricNumber(text) {
    const raw = String(text || '').trim().toLowerCase().replace(/,/g, '');
    if (!raw) return 0;
    const match = raw.match(/^(\d+(?:\.\d+)?)([km]?)$/);
    if (match) {
      const base = Number.parseFloat(match[1]);
      if (!Number.isFinite(base)) return 0;
      const unit = match[2];
      if (unit === 'k') return base * 1000;
      if (unit === 'm') return base * 1000000;
      return base;
    }
    const fallback = Number.parseFloat(raw);
    return Number.isFinite(fallback) ? fallback : 0;
  }

  function appendTopicMetaItem(meta, text, title) {
    const value = (text || '').trim();
    if (!value) return;
    const span = document.createElement('span');
    span.className = 'linuxdo-topic-meta-item';
    span.textContent = value;
    if (title) span.title = title;
    meta.appendChild(span);
  }

  function appendTopicMetaCountItem(meta, text, title) {
    const value = (text || '').trim();
    if (!value) return;
    const span = document.createElement('span');
    span.className = 'linuxdo-topic-meta-item';
    span.textContent = value;
    if (title) span.title = title;

    const numericValue = parseTopicMetricNumber(value);
    if (numericValue >= 500) {
      span.classList.add('linuxdo-topic-meta-count-hot');
    } else if (numericValue >= 100) {
      span.classList.add('linuxdo-topic-meta-count-warn');
    }

    meta.appendChild(span);
  }

  /**
   * 清理两栏布局的增强 DOM，恢复为默认样式。
   */
  function cleanupTwoColumnLayout() {
    document.documentElement.classList.remove('linuxdo-two-column-layout', 'linuxdo-topic-waterfall');
    document.documentElement.style.removeProperty('--ld-topic-columns');

    document.querySelectorAll('.linuxdo-topic-meta').forEach((meta) => {
      const badges = meta.querySelector('.topic-post-badges');
      if (badges) {
        const mainLinkCell = meta.closest('td.main-link');
        const linkTopLine = mainLinkCell ? mainLinkCell.querySelector('.link-top-line') : null;
        if (linkTopLine) {
          linkTopLine.appendChild(badges);
        } else if (mainLinkCell) {
          mainLinkCell.appendChild(badges);
        }
      }
      meta.remove();
    });

    document.querySelectorAll('tr.topic-list-item[data-linuxdo-two-column-enhanced="1"]').forEach((tr) => {
      tr.removeAttribute('data-linuxdo-two-column-enhanced');
    });
  }

  /**
   * 是否启用主题列表分栏布局。
   * @returns {boolean}
   */
  function isTopicListLayoutEnabled() {
    const rawValue = CONFIG.TOPIC_LIST_LAYOUT_ENABLED;
    if (rawValue === true || rawValue === false) return rawValue;
    if (rawValue === 1 || rawValue === '1' || rawValue === 'true') return true;
    if (rawValue === 0 || rawValue === '0' || rawValue === 'false') return false;
    return true;
  }

  /**
   * 获取主题列表分栏数（兼容旧版 boolean 配置）。
   * @returns {number} 1~5。
   */
  function getTopicListColumns() {
    const rawValue = CONFIG.TWO_COLUMN_LAYOUT;

    if (typeof rawValue === 'boolean') {
      return rawValue ? 2 : DEFAULT_CONFIG.TWO_COLUMN_LAYOUT;
    }

    const parsed = Number.parseInt(String(rawValue || '').trim(), 10);
    if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_CONFIG.TWO_COLUMN_LAYOUT;
    return Math.min(parsed, 5);
  }

  /**
   * 在主题列表页启用/刷新分栏布局。
   * 将回复/浏览/活动/发帖人收纳到标题下方，避免挤压标题区域。
   */
  function applyTwoColumnLayoutToTopicLists() {
    if (!isTopicListLayoutEnabled()) {
      cleanupTwoColumnLayout();
      return;
    }

    const columns = getTopicListColumns();

    const topicListBodies = document.querySelectorAll('tbody.topic-list-body');
    if (!topicListBodies || topicListBodies.length === 0) {
      cleanupTwoColumnLayout();
      return;
    }

    document.documentElement.classList.add('linuxdo-two-column-layout');
    document.documentElement.style.setProperty('--ld-topic-columns', String(columns));
    if (CONFIG.TOPIC_LIST_WATERFALL) {
      document.documentElement.classList.add('linuxdo-topic-waterfall');
    } else {
      document.documentElement.classList.remove('linuxdo-topic-waterfall');
    }

    topicListBodies.forEach((tbody) => {
      const rows = tbody.querySelectorAll('tr.topic-list-item');
      if (!rows || rows.length === 0) return;

      rows.forEach((row) => {
        const mainLinkCell = row.querySelector('td.main-link');
        if (!mainLinkCell) return;

        const existingMeta = mainLinkCell.querySelector('.linuxdo-topic-meta');
        if (row.getAttribute('data-linuxdo-two-column-enhanced') === '1' && existingMeta) {
          const badges = mainLinkCell.querySelector('.topic-post-badges');
          if (badges && !existingMeta.contains(badges)) {
            normalizeTopicBadgesWhitespace(badges);
            existingMeta.appendChild(badges);
          }
          return;
        }

        const meta = document.createElement('div');
        meta.className = 'linuxdo-topic-meta';

        // a: 发帖人头像（取 posters 列的第一个 a）
        const avatarAnchor = row.querySelector('td.posters a');
        const avatarImg = avatarAnchor ? avatarAnchor.querySelector('img') : null;
        if (avatarAnchor && avatarImg) {
          const avatar = document.createElement('a');
          avatar.className = 'linuxdo-topic-meta-avatar';
          avatar.href = avatarAnchor.getAttribute('href') || '#';
          avatar.setAttribute('aria-label', '发帖人');
          const title = avatarAnchor.getAttribute('title');
          if (title) avatar.title = title;
          avatar.appendChild(avatarImg.cloneNode(true));
          meta.appendChild(avatar);
        }

        // b: 回复数（posts-map 列的第一个 a）
        const repliesEl = row.querySelector('td.num.posts-map a.badge-posts .number') || row.querySelector('td.num.posts-map .number');
        appendTopicMetaCountItem(meta, repliesEl ? repliesEl.textContent : '', '回复');

        // c: 浏览量
        const viewsEl = row.querySelector('td.num.views .number') || row.querySelector('td.views .number');
        appendTopicMetaCountItem(meta, viewsEl ? viewsEl.textContent : '', '浏览');

        // 活动时间（relative-date）
        const activityEl = row.querySelector('td.activity .relative-date') || row.querySelector('td.age .relative-date');
        appendTopicMetaItem(meta, activityEl ? activityEl.textContent : '', '活动');

        const badges = mainLinkCell.querySelector('.topic-post-badges');
        if (badges) {
          normalizeTopicBadgesWhitespace(badges);
          meta.appendChild(badges);
        }

        if (!meta.firstChild) return;

        // 插入到主列底部（category/tags 下方）
        const bottomLine = mainLinkCell.querySelector('.link-bottom-line');
        if (bottomLine && bottomLine.parentNode) {
          bottomLine.parentNode.insertBefore(meta, bottomLine.nextSibling);
        } else {
          mainLinkCell.appendChild(meta);
        }

        row.setAttribute('data-linuxdo-two-column-enhanced', '1');
      });
    });
  }

  // ==========================================================
  // 设置界面
  // ==========================================================

  function createSettingsModal() {
    const dialog = document.createElement('dialog');
    dialog.className = 'linuxdo-settings-dialog';
    const topicListLayoutEnabled = isTopicListLayoutEnabled();
    const topicListColumns = getTopicListColumns();
    const topicListColumnsInputValue = String(topicListColumns);

    dialog.innerHTML = `
      <div class="linuxdo-settings-content">
        <div class="linuxdo-settings-header">
          <div>
            <h2 class="linuxdo-settings-title">布局设置</h2>
            <p class="linuxdo-settings-subtitle">linuxdo-shadcn（仅主题列表布局：分栏/瀑布流）</p>
          </div>
          <button class="linuxdo-settings-close" type="button" aria-label="关闭">×</button>
        </div>
        <form class="linuxdo-settings-form" method="dialog">
          <section class="linuxdo-settings-section">
            <div class="linuxdo-settings-section-header">
              <h3 class="linuxdo-settings-section-title">列表布局</h3>
              <p class="linuxdo-settings-section-desc">仅影响主题列表页（最新 / 分类 / 标签等）</p>
            </div>
            <div class="linuxdo-settings-card">
              <div class="linuxdo-settings-item">
                <div class="linuxdo-settings-item-text">
                  <label class="linuxdo-settings-item-label" for="topicListLayoutEnabled">启用分栏布局</label>
                  <div class="linuxdo-settings-description">默认开启；关闭后恢复站点原生列表样式</div>
                </div>
                <label class="linuxdo-settings-switch">
                  <input type="checkbox" id="topicListLayoutEnabled" ${topicListLayoutEnabled ? 'checked' : ''}>
                  <span class="linuxdo-settings-switch-slider"></span>
                </label>
              </div>

              <div class="linuxdo-settings-separator"></div>

              <div class="linuxdo-settings-item" id="topicListColumnsRow" style="${topicListLayoutEnabled ? '' : 'display:none;'}">
                <div class="linuxdo-settings-item-text">
                  <label class="linuxdo-settings-item-label" for="twoColumnLayout">分栏数</label>
                  <div class="linuxdo-settings-description">范围 1-5；默认 2。开启后列表以卡片展示，并将发帖人/回复/浏览/活动信息收纳到标题下方</div>
                </div>
                <div class="linuxdo-settings-control">
                  <input type="number" id="twoColumnLayout" class="linuxdo-settings-input small" value="${topicListColumnsInputValue}" placeholder="2" min="1" max="5" step="1" inputmode="numeric">
                  <span class="linuxdo-settings-unit">列</span>
                </div>
              </div>

              <div class="linuxdo-settings-separator" id="topicListWaterfallSeparator" style="${topicListLayoutEnabled ? '' : 'display:none;'}"></div>

              <div class="linuxdo-settings-item" id="topicListWaterfallRow" style="${topicListLayoutEnabled ? '' : 'display:none;'}">
                <div class="linuxdo-settings-item-text">
                  <label class="linuxdo-settings-item-label" for="topicListWaterfall">瀑布流</label>
                  <div class="linuxdo-settings-description">开启后以瀑布流方式排列卡片</div>
                </div>
                <label class="linuxdo-settings-switch">
                  <input type="checkbox" id="topicListWaterfall" ${CONFIG.TOPIC_LIST_WATERFALL ? 'checked' : ''}>
                  <span class="linuxdo-settings-switch-slider"></span>
                </label>
              </div>
            </div>
          </section>
        </form>
        <div class="linuxdo-settings-footer">
          <button type="button" class="linuxdo-settings-button" id="cancelSettings">取消</button>
          <button type="button" class="linuxdo-settings-button primary" id="saveSettings">保存</button>
        </div>
      </div>
    `;

    return dialog;
  }

  function bindSettingsEvents(dialog) {
    const closeBtn = dialog.querySelector('.linuxdo-settings-close');
    const cancelBtn = dialog.querySelector('#cancelSettings');
    const saveBtn = dialog.querySelector('#saveSettings');

    const topicListLayoutEnabledInput = dialog.querySelector('#topicListLayoutEnabled');
    const topicListColumnsRow = dialog.querySelector('#topicListColumnsRow');
    const twoColumnLayoutInput = dialog.querySelector('#twoColumnLayout');
    const topicListWaterfallSeparator = dialog.querySelector('#topicListWaterfallSeparator');
    const topicListWaterfallRow = dialog.querySelector('#topicListWaterfallRow');
    const topicListWaterfallInput = dialog.querySelector('#topicListWaterfall');

    const updateTopicListLayoutVisibility = () => {
      const enabled = topicListLayoutEnabledInput ? !!topicListLayoutEnabledInput.checked : true;
      if (topicListColumnsRow) topicListColumnsRow.style.display = enabled ? '' : 'none';
      if (twoColumnLayoutInput) twoColumnLayoutInput.disabled = !enabled;
      if (topicListWaterfallSeparator) topicListWaterfallSeparator.style.display = enabled ? '' : 'none';
      if (topicListWaterfallRow) topicListWaterfallRow.style.display = enabled ? '' : 'none';
      if (topicListWaterfallInput) topicListWaterfallInput.disabled = !enabled;
    };

    if (topicListLayoutEnabledInput) {
      topicListLayoutEnabledInput.addEventListener('change', updateTopicListLayoutVisibility);
      updateTopicListLayoutVisibility();
    }

    const closeDialog = () => {
      if (typeof dialog.close === 'function') {
        dialog.setAttribute('closing', '');
        setTimeout(() => {
          dialog.close();
          dialog.remove();
        }, SCRIPT_CONSTANTS.DIALOG_CLOSE_ANIMATION_MS);
      } else {
        dialog.remove();
        const backdrop = document.querySelector('.dialog-backdrop-fallback');
        if (backdrop) backdrop.remove();
      }
    };

    closeBtn.addEventListener('click', closeDialog);
    cancelBtn.addEventListener('click', closeDialog);

    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeDialog();
    });

    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const topicListLayoutEnabled = !!dialog.querySelector('#topicListLayoutEnabled').checked;
      const twoColumnLayoutRaw = dialog.querySelector('#twoColumnLayout').value;
      let twoColumnLayout = Number.parseInt(String(twoColumnLayoutRaw || '').trim(), 10);
      if (!Number.isFinite(twoColumnLayout) || twoColumnLayout < 1) twoColumnLayout = DEFAULT_CONFIG.TWO_COLUMN_LAYOUT;
      if (twoColumnLayout > 5) twoColumnLayout = 5;

      let topicListWaterfall = false;
      if (topicListWaterfallInput) topicListWaterfall = !!topicListWaterfallInput.checked;

      setConfig('TOPIC_LIST_LAYOUT_ENABLED', topicListLayoutEnabled);
      setConfig('TWO_COLUMN_LAYOUT', twoColumnLayout);
      setConfig('TOPIC_LIST_WATERFALL', topicListWaterfall);

      applyTwoColumnLayoutToTopicLists();

      saveBtn.textContent = '已保存';
      saveBtn.disabled = true;

      setTimeout(() => {
        closeDialog();
      }, SCRIPT_CONSTANTS.SETTINGS_CLOSE_DELAY_MS);
    });
  }

  function showSettingsModal() {
    if (window !== window.top) {
      console.debug('在 iframe 中，跳过显示设置界面');
      return;
    }

    const existingDialog = document.querySelector('.linuxdo-settings-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }
    const existingBackdrop = document.querySelector('.dialog-backdrop-fallback');
    if (existingBackdrop) {
      existingBackdrop.remove();
    }

    const dialog = createSettingsModal();
    document.body.appendChild(dialog);

    bindSettingsEvents(dialog);

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      return;
    }

    dialog.style.display = 'block';
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.zIndex = '10000';

    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 9999;
    `;
    backdrop.className = 'dialog-backdrop-fallback';
    document.body.appendChild(backdrop);

    console.warn('浏览器不支持 dialog 元素，使用降级方案');
  }

  function ensureSettingsTriggerButton() {
    if (document.querySelector('button.linuxdo-shadcn-settings-trigger')) return;

    const searchMenu = document.querySelector('.floating-search-input-wrapper .search-menu');
    if (!searchMenu) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn no-text btn-icon btn-transparent linuxdo-shadcn-settings-trigger';
    btn.title = '布局设置';
    btn.setAttribute('aria-label', '布局设置');
    btn.innerHTML = `
      <svg class="fa d-icon d-icon-sliders svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#sliders"></use></svg>
      <span aria-hidden="true">&ZeroWidthSpace;</span>
    `.trim();
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showSettingsModal();
    });

    const searchMenuContainer = searchMenu.querySelector('.search-menu-container');
    searchMenu.insertBefore(btn, searchMenuContainer ? searchMenuContainer.nextSibling : null);
  }

  function initializeScript() {
    if (window !== window.top) return;
    ensureSettingsTriggerButton();
    applyTwoColumnLayoutToTopicLists();
  }

  if (window === window.top) {
    const throttledInitialize = throttleInit(initializeScript, SCRIPT_CONSTANTS.INIT_THROTTLE_MS);

    addStyle(STYLE_TEXT);
    GM_registerMenuCommand('布局设置', showSettingsModal);

    const observer = new MutationObserver(() => {
      throttledInitialize();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', throttledInitialize);
    } else {
      throttledInitialize();
    }
  }
})();
