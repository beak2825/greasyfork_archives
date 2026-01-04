// ==UserScript==
// @name         ZZULIOJ iOS Style Modernizer
// @namespace    https://acm.zzuli.edu.cn/
// @version      0.1.9
// @description  将 ZZULIOJ 界面美化为类 iOS 扁平圆角半透明风格，支持暗黑模式与快速切换
// @author       ShiYi
// @match        *://acm.zzuli.edu.cn/*
// @match        *://acm.zzuli.edu.cn/*?*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550164/ZZULIOJ%20iOS%20Style%20Modernizer.user.js
// @updateURL https://update.greasyfork.org/scripts/550164/ZZULIOJ%20iOS%20Style%20Modernizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LS_KEY_ENABLE = 'zzuli_ios_theme_enabled';
    const LS_KEY_DARK = 'zzuli_ios_theme_dark';
    const LS_KEY_AUTO = 'zzuli_ios_theme_auto';
    const STATE = {
        enabled: localStorage.getItem(LS_KEY_ENABLE) !== 'false',
        dark: localStorage.getItem(LS_KEY_DARK) === 'true',
        auto: localStorage.getItem(LS_KEY_AUTO) !== 'false',
    };

    // 如果跟随系统，则用 matchMedia
    const mqDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (STATE.auto) {
        STATE.dark = mqDark.matches;
    }

    function saveState() {
        localStorage.setItem(LS_KEY_ENABLE, STATE.enabled);
        localStorage.setItem(LS_KEY_DARK, STATE.dark);
        localStorage.setItem(LS_KEY_AUTO, STATE.auto);
        applyTheme();
    }

    function toggleEnabled() {
        STATE.enabled = !STATE.enabled;
        saveState();
    }

    function toggleDark() {
        STATE.auto = false;
        STATE.dark = !STATE.dark;
        saveState();
    }

    function toggleAuto() {
        STATE.auto = !STATE.auto;
        if (STATE.auto) {
            STATE.dark = mqDark.matches;
        }
        saveState();
    }

    mqDark.addEventListener('change', () => {
        if (STATE.auto) {
            STATE.dark = mqDark.matches;
            saveState();
        }
    });

    // 创建样式
    const styleTag = document.createElement('style');
    styleTag.id = 'zzuli-ios-theme-style';
    document.documentElement.appendChild(styleTag);

    const baseCSS = `
  :root {
    --ios-font-stack: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
    --ios-radius-s: 6px;
    --ios-radius: 12px;
    --ios-radius-l: 18px;
    --ios-border-separator-light: rgba(0,0,0,0.08);
    --ios-border-separator-dark: rgba(255,255,255,0.15);
    --ios-accent: #0A84FF;
    --ios-accent-rgb: 10,132,255;
    --ios-danger: #FF3B30;
    --ios-bg-light: #f5f6f7;
    --ios-bg-dark: #1c1c1e;
    --ios-card-light: rgba(255,255,255,0.72);
    --ios-card-dark: rgba(44,44,46,0.72);
    --ios-text-light: #1c1c1e;
    --ios-text-dark: #f5f5f7;
    --ios-muted-light: #6e6e73;
    --ios-muted-dark: #9d9da1;
    --ios-code-bg-light: #f2f2f7;
    --ios-code-bg-dark: #2c2c2e;
    --ios-shadow-light: 0 2px 6px rgba(0,0,0,0.08), 0 8px 24px -8px rgba(0,0,0,0.12);
    --ios-shadow-dark: 0 2px 6px rgba(0,0,0,0.6), 0 8px 24px -8px rgba(0,0,0,0.5);
    --ios-transition: 150ms cubic-bezier(.4,.2,.2,1);
  }

  html.zzuli-ios-theme {
    font-family: var(--ios-font-stack);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  html.zzuli-ios-theme body {
    background: var(--zzuli-bg) !important;
    color: var(--zzuli-text) !important;
    transition: background-color var(--ios-transition), color var(--ios-transition);
  }

  html.zzuli-ios-theme.zzuli-dark {
    --zzuli-bg: var(--ios-bg-dark);
    --zzuli-text: var(--ios-text-dark);
    --zzuli-muted: var(--ios-muted-dark);
    --zzuli-card: var(--ios-card-dark);
    --zzuli-separator: var(--ios-border-separator-dark);
    --zzuli-code-bg: var(--ios-code-bg-dark);
    --zzuli-shadow: var(--ios-shadow-dark);
  }
  html.zzuli-ios-theme:not(.zzuli-dark) {
    --zzuli-bg: var(--ios-bg-light);
    --zzuli-text: var(--ios-text-light);
    --zzuli-muted: var(--ios-muted-light);
    --zzuli-card: var(--ios-card-light);
    --zzuli-separator: var(--ios-border-separator-light);
    --zzuli-code-bg: var(--ios-code-bg-light);
    --zzuli-shadow: var(--ios-shadow-light);
  }

  html.zzuli-ios-theme ::selection {
    background: rgba(var(--ios-accent-rgb),0.25);
  }

  /* 顶部导航 */
  html.zzuli-ios-theme .navbar.navbar-default {
    background: var(--zzuli-card) !important;
    backdrop-filter: saturate(180%) blur(18px);
    -webkit-backdrop-filter: saturate(180%) blur(18px);
    border: none !important;
    box-shadow: var(--zzuli-shadow);
    margin-bottom: 20px;
    border-radius: var(--ios-radius-l);
    padding: 4px 20px;
  }
  html.zzuli-ios-theme .navbar.navbar-default .navbar-brand {
    font-weight: 600;
    font-size: 18px;
    color: var(--zzuli-text) !important;
  }
  html.zzuli-ios-theme .navbar-nav > li > a {
    color: var(--zzuli-text) !important;
    border-radius: 20px;
    padding: 8px 14px;
    margin: 4px 4px;
    font-weight: 500;
    line-height: 20px;
    position: relative;
    transition: background-color var(--ios-transition), color var(--ios-transition);
  }
  html.zzuli-ios-theme .navbar-nav > li.active > a,
  html.zzuli-ios-theme .navbar-nav > li > a:hover,
  html.zzuli-ios-theme .navbar-nav > li > a:focus {
    background: rgba(var(--ios-accent-rgb),0.12) !important;
    color: var(--ios-accent) !important;
  }

  html.zzuli-ios-theme .navbar-toggle {
    border: none;
    background: rgba(var(--ios-accent-rgb),0.12);
    border-radius: 10px;
  }
  html.zzuli-ios-theme .navbar-toggle .icon-bar {
    background: var(--ios-accent);
  }

  /* 下拉菜单 */
  html.zzuli-ios-theme .dropdown-menu {
    background: var(--zzuli-card);
    backdrop-filter: blur(18px);
    border: 1px solid var(--zzuli-separator);
    border-radius: var(--ios-radius);
    box-shadow: var(--zzuli-shadow);
    overflow: hidden;
  }
  html.zzuli-ios-theme .dropdown-menu > li > a {
    padding: 10px 16px;
    color: var(--zzuli-text) !important;
    transition: background-color var(--ios-transition), color var(--ios-transition);
  }
  html.zzuli-ios-theme .dropdown-menu > li > a:hover {
    background: rgba(var(--ios-accent-rgb),0.15);
    color: var(--ios-accent) !important;
  }

  /* 主体块 / jumbotron => 卡片 */
  html.zzuli-ios-theme .jumbotron {
    background: var(--zzuli-card) !important;
    border-radius: var(--ios-radius-l);
    padding: 30px 36px;
    box-shadow: var(--zzuli-shadow);
    border: 1px solid var(--zzuli-separator);
  }

  /* 表格 */
  html.zzuli-ios-theme table {
    width: 100%;
    border-collapse: collapse !important;
    background: var(--zzuli-card);
    border: 1px solid var(--zzuli-separator);
    border-radius: var(--ios-radius);
    overflow: hidden;
  }
  html.zzuli-ios-theme table[border],
  html.zzuli-ios-theme table td,
  html.zzuli-ios-theme table th {
    border: none !important;
  }
  html.zzuli-ios-theme table th {
    background: linear-gradient(to bottom, rgba(var(--ios-accent-rgb),0.10), rgba(var(--ios-accent-rgb),0.05));
    font-weight: 600;
    color: var(--zzuli-text);
    padding: 10px 12px;
  }
  html.zzuli-ios-theme table td {
    padding: 8px 12px;
    border-top: 1px solid var(--zzuli-separator);
  }
  html.zzuli-ios-theme table tr:hover td {
    background: rgba(var(--ios-accent-rgb),0.07);
  }

  /* 深色模式表格条纹与背景修复 */
  html.zzuli-ios-theme.zzuli-dark .table-striped > tbody > tr:nth-of-type(odd) {
    background: rgba(255,255,255,0.05) !important;
  }
  html.zzuli-ios-theme.zzuli-dark .table-striped > tbody > tr:nth-of-type(even) {
    background: transparent !important;
  }
  html.zzuli-ios-theme.zzuli-dark table tr,
  html.zzuli-ios-theme.zzuli-dark table tbody,
  html.zzuli-ios-theme.zzuli-dark table thead {
    background: transparent !important;
  }

  /* 分页组件 */
  html.zzuli-ios-theme .pagination > li > a,
  html.zzuli-ios-theme .pagination > li > span {
    background: var(--zzuli-card) !important;
    border: 1px solid var(--zzuli-separator) !important;
    color: var(--zzuli-text) !important;
    transition: background-color var(--ios-transition), color var(--ios-transition), border-color var(--ios-transition);
  }
  html.zzuli-ios-theme .pagination > li > a:hover,
  html.zzuli-ios-theme .pagination > li > span:hover {
    background: rgba(var(--ios-accent-rgb),0.18) !important;
    color: var(--ios-accent) !important;
  }
  html.zzuli-ios-theme .pagination > .active > a,
  html.zzuli-ios-theme .pagination > .active > span,
  html.zzuli-ios-theme .pagination > .active > a:focus,
  html.zzuli-ios-theme .pagination > .active > span:focus,
  html.zzuli-ios-theme .pagination > .active > a:hover,
  html.zzuli-ios-theme .pagination > .active > span:hover {
    background: var(--ios-accent) !important;
    border-color: var(--ios-accent) !important;
    color: #fff !important;
  }
  html.zzuli-ios-theme.zzuli-dark .pagination > li > a,
  html.zzuli-ios-theme.zzuli-dark .pagination > li > span {
    background: rgba(60,60,62,0.65) !important;
  }

  /* Panel / 列表块 修复默认白底 */
  html.zzuli-ios-theme .panel,
  html.zzuli-ios-theme .panel-default,
  html.zzuli-ios-theme .panel-heading,
  html.zzuli-ios-theme .panel-body,
  html.zzuli-ios-theme .list-group-item {
    background: var(--zzuli-card) !important;
    border-color: var(--zzuli-separator) !important;
    color: var(--zzuli-text) !important;
  }
  html.zzuli-ios-theme .list-group-item { border: 1px solid var(--zzuli-separator) !important; }
  html.zzuli-ios-theme .list-group-item:hover { background: rgba(var(--ios-accent-rgb),0.08) !important; }

  /* 按钮 */
  html.zzuli-ios-theme .btn,
  html.zzuli-ios-theme input[type=button],
  html.zzuli-ios-theme input[type=submit],
  html.zzuli-ios-theme button {
    border-radius: 22px !important;
    border: 1px solid rgba(var(--ios-accent-rgb),0.35) !important;
    background: linear-gradient(to bottom right, rgba(var(--ios-accent-rgb),0.15), rgba(var(--ios-accent-rgb),0.05)) !important;
    color: var(--ios-accent) !important;
    font-weight: 500;
    padding: 6px 18px;
    line-height: 20px;
    box-shadow: none !important;
    text-shadow: none !important;
    transition: background-color var(--ios-transition), border-color var(--ios-transition), color var(--ios-transition);
  }
  html.zzuli-ios-theme .btn:hover {
    background: rgba(var(--ios-accent-rgb),0.25) !important;
  }
  html.zzuli-ios-theme .btn-primary,
  html.zzuli-ios-theme .btn-success {
    background: var(--ios-accent) !important;
    color: #fff !important;
    border: 1px solid var(--ios-accent) !important;
  }
  html.zzuli-ios-theme .btn-primary:hover {
    background: rgba(var(--ios-accent-rgb),0.85) !important;
  }
  html.zzuli-ios-theme .btn-danger {
    background: #FF3B30 !important;
    border-color: #FF3B30 !important;
    color: #fff !important;
  }

  /* 链接 */
  html.zzuli-ios-theme a {
    color: var(--ios-accent);
    transition: color var(--ios-transition), background-color var(--ios-transition);
  }
  html.zzuli-ios-theme a:hover {
    color: rgba(var(--ios-accent-rgb),0.8);
    text-decoration: none;
  }

  /* 代码块 */
  html.zzuli-ios-theme pre,
  html.zzuli-ios-theme code,
  html.zzuli-ios-theme pre code {
    background: var(--zzuli-code-bg) !important;
    border: 1px solid var(--zzuli-separator) !important;
    color: var(--zzuli-text) !important;
    border-radius: var(--ios-radius);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
    padding: 10px 14px;
    overflow-x: auto;
  }
  html.zzuli-ios-theme pre {
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.03);
  }

  /* 代码编辑器 (提交代码页) 行号栏与暗色优化 */
  /* 通用容器与边框 */
  html.zzuli-ios-theme .CodeMirror,
  html.zzuli-ios-theme .ace_editor {
    background: var(--zzuli-code-bg) !important;
    border: 1px solid var(--zzuli-separator) !important;
    border-radius: var(--ios-radius);
  }
  /* CodeMirror 行号与 gutter */
  html.zzuli-ios-theme .CodeMirror-gutters,
  html.zzuli-ios-theme .CodeMirror-gutter { /* 兼容不同版本 */
    background: var(--zzuli-card) !important;
    border-right: 1px solid var(--zzuli-separator) !important;
  }
  html.zzuli-ios-theme .CodeMirror-linenumber { color: var(--zzuli-muted) !important; }
  html.zzuli-ios-theme .CodeMirror-activeline-background { background: rgba(var(--ios-accent-rgb),0.08) !important; }
  html.zzuli-ios-theme.zzuli-dark .CodeMirror-activeline-background { background: rgba(var(--ios-accent-rgb),0.18) !important; }
  html.zzuli-ios-theme.zzuli-dark .CodeMirror,
  html.zzuli-ios-theme.zzuli-dark .CodeMirror-gutters,
  html.zzuli-ios-theme.zzuli-dark .CodeMirror-gutter,
  html.zzuli-ios-theme.zzuli-dark .CodeMirror-linenumber { background: var(--zzuli-card) !important; color: var(--zzuli-muted) !important; }

  /* Ace Editor Gutter */
  html.zzuli-ios-theme .ace_gutter,
  html.zzuli-ios-theme .ace_gutter-layer,
  html.zzuli-ios-theme .ace_gutter-active-line,
  html.zzuli-ios-theme .ace_gutter-cell { background: var(--zzuli-card) !important; color: var(--zzuli-muted) !important; }
  html.zzuli-ios-theme .ace_gutter-active-line { background: rgba(var(--ios-accent-rgb),0.10) !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_gutter-active-line { background: rgba(var(--ios-accent-rgb),0.22) !important; }
  html.zzuli-ios-theme .ace_marker-layer .ace_active-line { background: rgba(var(--ios-accent-rgb),0.08) !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_marker-layer .ace_active-line { background: rgba(var(--ios-accent-rgb),0.16) !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_gutter,
  html.zzuli-ios-theme.zzuli-dark .ace_gutter-layer,
  html.zzuli-ios-theme.zzuli-dark .ace_gutter-cell { background: var(--zzuli-card) !important; color: var(--zzuli-muted) !important; }

  /* 通用/备用类名（可能的自定义行号容器） */
  html.zzuli-ios-theme .line-numbers,
  html.zzuli-ios-theme .line-numbers-rows,
  html.zzuli-ios-theme .linenums,
  html.zzuli-ios-theme .gutter,
  html.zzuli-ios-theme.zzuli-dark .line-numbers,
  html.zzuli-ios-theme.zzuli-dark .line-numbers-rows,
  html.zzuli-ios-theme.zzuli-dark .linenums,
  html.zzuli-ios-theme.zzuli-dark .gutter { background: var(--zzuli-card) !important; color: var(--zzuli-muted) !important; }
  html.zzuli-ios-theme .line-numbers-rows > span:before { color: var(--zzuli-muted); }
  html.zzuli-ios-theme.zzuli-dark .line-numbers-rows > span:before { color: var(--zzuli-muted); }

  /* 代码编辑器语法高亮与光标优化（深色模式） */
  html.zzuli-ios-theme.zzuli-dark .CodeMirror { color: #e7e9ef !important; }
  html.zzuli-ios-theme.zzuli-dark .CodeMirror-cursor { border-left: 2px solid #fff !important; }
  html.zzuli-ios-theme.zzuli-dark .CodeMirror-selected { background: rgba(var(--ios-accent-rgb),0.35) !important; }
  html.zzuli-ios-theme .CodeMirror-focused .CodeMirror-selected { background: rgba(var(--ios-accent-rgb),0.40) !important; }
  /* CodeMirror 5 token colors */
  html.zzuli-ios-theme.zzuli-dark .cm-keyword { color: #82AAFF !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-operator { color: #89DDFF !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-variable { color: #ECEFF4 !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-variable-2 { color: #C5E4FF !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-variable-3 { color: #F6C177 !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-def { color: #B3E5FC !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-string { color: #C3E88D !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-number { color: #F78C6C !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-comment { color: #6b7480 !important; font-style: italic; }
  html.zzuli-ios-theme.zzuli-dark .cm-meta { color: #FFCB6B !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-builtin { color: #FF9CAC !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-tag { color: #7FDBCA !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-attribute { color: #F6C177 !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-atom { color: #FFCB6B !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-error { background: #B00020 !important; color: #fff !important; }
  html.zzuli-ios-theme.zzuli-dark .CodeMirror-activeline-background { background: rgba(255,255,255,0.06) !important; }

  /* CodeMirror 6 (如果未来升级) */
  html.zzuli-ios-theme.zzuli-dark .cm-editor { color: #e7e9ef !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-editor .cm-content ::selection { background: rgba(var(--ios-accent-rgb),0.35); }
  html.zzuli-ios-theme.zzuli-dark .cm-activeLine { background: rgba(255,255,255,0.06) !important; }
  html.zzuli-ios-theme.zzuli-dark .cm-gutters { background: var(--zzuli-card) !important; color: #6b7480 !important; border-right: 1px solid var(--zzuli-separator) !important; }

  /* Ace Editor dark overrides */
  html.zzuli-ios-theme.zzuli-dark .ace_editor { color: #E7E9EF !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_cursor { color: #FFFFFF !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_marker-layer .ace_selection { background: rgba(var(--ios-accent-rgb),0.38) !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_marker-layer .ace_active-line { background: rgba(255,255,255,0.06) !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_gutter { color: #6b7480 !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_keyword,
  html.zzuli-ios-theme.zzuli-dark .ace_storage { color: #82AAFF !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_operator { color: #89DDFF !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_identifier,
  html.zzuli-ios-theme.zzuli-dark .ace_variable { color: #ECEFF4 !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_variable.ace_parameter { color: #C5E4FF !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_support.ace_function,
  html.zzuli-ios-theme.zzuli-dark .ace_entity.ace_name.ace_function { color: #B3E5FC !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_string { color: #C3E88D !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_numeric,
  html.zzuli-ios-theme.zzuli-dark .ace_constant.ace_numeric { color: #F78C6C !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_comment { color: #6b7480 !important; font-style: italic; }
  html.zzuli-ios-theme.zzuli-dark .ace_constant.ace_language,
  html.zzuli-ios-theme.zzuli-dark .ace_constant.ace_character { color: #FFCB6B !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_constant.ace_other { color: #FF9CAC !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_invalid { background: #B00020 !important; color: #fff !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_markup.ace_heading,
  html.zzuli-ios-theme.zzuli-dark .ace_entity.ace_other.ace_attribute-name { color: #F6C177 !important; }
  html.zzuli-ios-theme.zzuli-dark .ace_entity.ace_name.ace_tag { color: #7FDBCA !important; }

  /* 分割线 */
  html.zzuli-ios-theme hr {
    border: none;
    height: 1px;
    background: var(--zzuli-separator);
    margin: 24px 0;
  }

  /* 图片适配圆角 */
  html.zzuli-ios-theme img {
    border-radius: 8px;
  }

  /* 表单输入 */
  html.zzuli-ios-theme input[type=text],
  html.zzuli-ios-theme input[type=password],
  html.zzuli-ios-theme select,
  html.zzuli-ios-theme textarea {
    background: var(--zzuli-card);
    border: 1px solid var(--zzuli-separator);
    border-radius: 10px;
    padding: 6px 10px;
    box-shadow: none;
    color: var(--zzuli-text);
    transition: border-color var(--ios-transition), background-color var(--ios-transition);
  }
  html.zzuli-ios-theme input:focus,
  html.zzuli-ios-theme select:focus,
  html.zzuli-ios-theme textarea:focus {
    outline: none;
    border-color: var(--ios-accent);
  }

  /* 页脚 / 版权 */
  html.zzuli-ios-theme table[width="100%"][border="0"] {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }

  /* 适配较窄屏幕 */
  @media (max-width: 768px) {
    html.zzuli-ios-theme .navbar.navbar-default {
      border-radius: 0 0 20px 20px;
      margin: 0 0 16px 0;
    }
    html.zzuli-ios-theme .jumbotron {
      padding: 22px 20px;
    }
  }

  /* 控制面板 */
  #zzuli-ios-toggle-panel {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: var(--ios-font-stack);
  }
  #zzuli-ios-toggle-panel button {
    cursor: pointer;
    min-width: 140px;
    font-size: 13px;
  }
  #zzuli-ios-toggle-panel .zzuli-chip {
    background: var(--zzuli-card);
    border: 1px solid var(--zzuli-separator);
    border-radius: 14px;
    padding: 6px 12px;
    font-size: 12px;
    color: var(--zzuli-muted);
    text-align: center;
    backdrop-filter: blur(18px);
  }

  html:not(.zzuli-ios-theme) #zzuli-ios-toggle-panel .state-indicator {
    color: #999;
  }

  /* 关闭时隐藏效果 */
  html:not(.zzuli-ios-theme) .zzuli-ios-wrapped {
    all: unset;
  }

  /* ===== 追加：暗色模式下白块/条纹/底栏修复 ===== */
  /* 底部题目页面提交条 panel-footer 白底修复 */
  html.zzuli-ios-theme .panel-footer {
    background: var(--zzuli-card) !important;
    border-top: 1px solid var(--zzuli-separator) !important;
    color: var(--zzuli-text) !important;
    box-shadow: none !important;
  }
  html.zzuli-ios-theme.zzuli-dark .panel-footer a { color: var(--ios-accent) !important; }

  /* 题目详情页 center 容器可能残留白色 */
  html.zzuli-ios-theme.zzuli-dark center,
  html.zzuli-ios-theme.zzuli-dark center > div { background: transparent !important; }

  /* 自定义 evenrow / oddrow 条纹在暗色模式下统一风格 */
  html.zzuli-ios-theme.zzuli-dark tr.evenrow,
  html.zzuli-ios-theme.zzuli-dark tr.oddrow { background: transparent !important; }
  html.zzuli-ios-theme.zzuli-dark tr.evenrow td { background: rgba(255,255,255,0.04) !important; }
  html.zzuli-ios-theme.zzuli-dark tr.oddrow  td { background: rgba(255,255,255,0.02) !important; }
  html.zzuli-ios-theme.zzuli-dark tr.evenrow:hover td,
  html.zzuli-ios-theme.zzuli-dark tr.oddrow:hover td { background: rgba(var(--ios-accent-rgb),0.18) !important; }

  /* 兼容可能被写死的 header 背景 */
  html.zzuli-ios-theme.zzuli-dark th,
  html.zzuli-ios-theme.zzuli-dark thead td { background: rgba(255,255,255,0.05) !important; }

  /* select/option 在暗色模式下下拉白底修复 */
  html.zzuli-ios-theme.zzuli-dark select,
  html.zzuli-ios-theme.zzuli-dark option,
  html.zzuli-ios-theme.zzuli-dark select option { background: var(--zzuli-card) !important; color: var(--zzuli-text) !important; }

  /* 捕获仍然用内联 #fff/#FFF 的背景块（尽量温和） */
  html.zzuli-ios-theme.zzuli-dark [style*="background-color:#FFF"],
  html.zzuli-ios-theme.zzuli-dark [style*="background-color:#fff"],
  html.zzuli-ios-theme.zzuli-dark [style*="background:#FFF"],
  html.zzuli-ios-theme.zzuli-dark [style*="background:#fff"] {
    background: var(--zzuli-card) !important;
  }

  /* 某些内联 style 设为 white 的表格/td 修复 */
  html.zzuli-ios-theme.zzuli-dark td[bgcolor="white"],
  html.zzuli-ios-theme.zzuli-dark tr[bgcolor="white"],
  html.zzuli-ios-theme.zzuli-dark table[bgcolor="white"] { background: transparent !important; }

  /* Pie 图所在单元格白底强制透明 */
  html.zzuli-ios-theme.zzuli-dark #pie[bgcolor="white"],
  html.zzuli-ios-theme.zzuli-dark #pie { background: transparent !important; }

  /* 避免分页条在暗色模式出现突兀白底 */
  html.zzuli-ios-theme.zzuli-dark .pagination > li > a,
  html.zzuli-ios-theme.zzuli-dark .pagination > li > span { background: rgba(60,60,62,0.65) !important; }

  /* ===== 追加结束 ===== */

  /* ===== 题目详情页专属增强 ===== */
  html.zzuli-ios-theme .zzuli-problem-header {
    background: var(--zzuli-card);
    border: 1px solid var(--zzuli-separator);
    box-shadow: var(--zzuli-shadow);
    border-radius: 26px;
    padding: 32px 36px 28px 36px;
    margin-bottom: 26px;
    position: relative;
    overflow: hidden;
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    animation: zzuliProblemHeaderFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes zzuliProblemHeaderFadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  html.zzuli-ios-theme .zzuli-problem-header::before {
    content: '';
    position: absolute; 
    inset:0;
    background: radial-gradient(circle at 85% 15%, rgba(var(--ios-accent-rgb),0.20), transparent 60%),
                radial-gradient(circle at 20% 80%, rgba(var(--ios-accent-rgb),0.12), transparent 50%);
    pointer-events:none;
    animation: zzuliGradientPulse 8s ease-in-out infinite;
  }
  
  @keyframes zzuliGradientPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  html.zzuli-ios-theme.zzuli-dark .zzuli-problem-header::before {
    background: radial-gradient(circle at 82% 18%, rgba(var(--ios-accent-rgb),0.32), transparent 65%),
                radial-gradient(circle at 15% 85%, rgba(var(--ios-accent-rgb),0.18), transparent 55%);
  }
  
  html.zzuli-ios-theme .zzuli-problem-title {
    font-size: 32px; 
    font-weight: 800; 
    margin:0 0 18px 0; 
    letter-spacing: -0.5px;
    line-height: 1.2;
    background: linear-gradient(95deg, var(--ios-accent) 0%, rgba(var(--ios-accent-rgb),0.65) 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    animation: zzuliTitleSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes zzuliTitleSlideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  html.zzuli-ios-theme .zzuli-problem-meta { 
    display:flex; 
    flex-wrap:wrap; 
    gap:10px 14px; 
    margin-bottom:8px;
    animation: zzuliMetaFadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes zzuliMetaFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  html.zzuli-ios-theme .zzuli-chip-badge { 
    font-size:12.5px; 
    padding:6px 12px 7px; 
    line-height:1.2; 
    border-radius: 20px; 
    background: rgba(var(--ios-accent-rgb),0.12); 
    color: var(--ios-accent); 
    font-weight:600; 
    backdrop-filter: blur(10px); 
    -webkit-backdrop-filter: blur(10px); 
    border:1px solid rgba(var(--ios-accent-rgb),0.35);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px -2px rgba(var(--ios-accent-rgb), 0.25);
  }
  
  html.zzuli-ios-theme .zzuli-chip-badge:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 12px -2px rgba(var(--ios-accent-rgb), 0.4);
    background: rgba(var(--ios-accent-rgb),0.18);
  }
  
  html.zzuli-ios-theme.zzuli-dark .zzuli-chip-badge { 
    background: rgba(var(--ios-accent-rgb),0.25); 
    box-shadow: 0 2px 8px -2px rgba(var(--ios-accent-rgb), 0.35);
  }
  
  html.zzuli-ios-theme .zzuli_chip[data-kind="limit"] { 
    background: linear-gradient(135deg, rgba(var(--ios-accent-rgb),0.10), rgba(var(--ios-accent-rgb),0.05));
    border: 1px solid rgba(var(--ios-accent-rgb),0.25);
  }
  
  html.zzuli-ios-theme.zzuli-dark .zzuli_chip[data-kind="limit"] { 
    background: linear-gradient(135deg, rgba(var(--ios-accent-rgb),0.32), rgba(var(--ios-accent-rgb),0.18));
  }
  
  html.zzuli-ios-theme .zzuli-problem-actions-bar { 
    display:flex; 
    gap:14px; 
    margin-top:16px;
    animation: zzuliActionsFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes zzuliActionsFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  html.zzuli-ios-theme .zzuli-problem-actions-bar .zzuli-action-btn { 
    cursor:pointer; 
    border:none; 
    border-radius: 24px; 
    padding:12px 24px; 
    font-size:15px; 
    font-weight:600; 
    background: linear-gradient(135deg, var(--ios-accent) 0%, rgba(var(--ios-accent-rgb),0.85) 100%);
    color:#fff !important; 
    box-shadow: 0 4px 16px -4px rgba(var(--ios-accent-rgb),0.6), 0 2px 8px -2px rgba(var(--ios-accent-rgb),0.4);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration:none !important; 
    display:inline-flex; 
    align-items:center; 
    gap:8px;
    position: relative;
    overflow: hidden;
  }
  
  html.zzuli-ios-theme .zzuli-problem-actions-bar .zzuli-action-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  html.zzuli-ios-theme .zzuli-problem-actions-bar .zzuli-action-btn:hover::before {
    width: 300px;
    height: 300px;
  }
  
  html.zzuli-ios-theme .zzuli-problem-actions-bar .zzuli-action-btn:hover { 
    transform: translateY(-3px) scale(1.02); 
    box-shadow:0 8px 24px -6px rgba(var(--ios-accent-rgb),0.7), 0 4px 12px -2px rgba(var(--ios-accent-rgb),0.5);
  }
  
  html.zzuli-ios-theme .zzuli-problem-actions-bar .zzuli-action-btn:active {
    transform: translateY(-1px) scale(0.98);
  }
  
  html.zzuli-ios-theme .zzuli-problem-actions-bar .zzuli-action-btn.secondary { 
    background: linear-gradient(135deg, rgba(var(--ios-accent-rgb),0.22) 0%, rgba(var(--ios-accent-rgb),0.10) 100%);
    color: var(--ios-accent) !important; 
    box-shadow:0 2px 8px -2px rgba(var(--ios-accent-rgb),0.3);
    border:1px solid rgba(var(--ios-accent-rgb),0.4);
  }
  
  html.zzuli-ios-theme .zzuli-problem-actions-bar .zzuli-action-btn.secondary:hover { 
    background: linear-gradient(135deg, rgba(var(--ios-accent-rgb),0.35) 0%, rgba(var(--ios-accent-rgb),0.20) 100%);
    box-shadow:0 4px 16px -4px rgba(var(--ios-accent-rgb),0.5);
  }

  /* 小节 Panel 视觉强化 - 玻璃态卡片效果 */
  html.zzuli-ios-theme .panel.zzuli-problem-section { 
    position:relative; 
    border-radius:24px; 
    overflow:hidden;
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    box-shadow: var(--zzuli-shadow);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: zzuliSectionFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) backwards;
  }
  
  html.zzuli-ios-theme .panel.zzuli-problem-section:nth-child(1) { animation-delay: 0.1s; }
  html.zzuli-ios-theme .panel.zzuli-problem-section:nth-child(2) { animation-delay: 0.2s; }
  html.zzuli-ios-theme .panel.zzuli-problem-section:nth-child(3) { animation-delay: 0.3s; }
  html.zzuli-ios-theme .panel.zzuli-problem-section:nth-child(4) { animation-delay: 0.4s; }
  html.zzuli-ios-theme .panel.zzuli-problem-section:nth-child(5) { animation-delay: 0.5s; }
  
  @keyframes zzuliSectionFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  html.zzuli-ios-theme .panel.zzuli-problem-section:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px -8px rgba(var(--ios-accent-rgb), 0.25), var(--zzuli-shadow);
  }
  
  html.zzuli-ios-theme .panel.zzuli-problem-section::before { 
    content:''; 
    position:absolute; 
    left:0; 
    top:0; 
    bottom:0; 
    width:5px; 
    background: linear-gradient(180deg, var(--ios-accent) 0%, rgba(var(--ios-accent-rgb),0.5) 100%);
    box-shadow: 2px 0 8px rgba(var(--ios-accent-rgb), 0.3);
  }
  
  html.zzuli-ios-theme.zzuli-dark .panel.zzuli-problem-section::before { 
    background: linear-gradient(180deg, rgba(var(--ios-accent-rgb),0.95) 0%, rgba(var(--ios-accent-rgb),0.45) 100%);
  }
  
  html.zzuli-ios-theme .panel.zzuli-problem-section .panel-heading { 
    font-weight:700 !important; 
    font-size:17px !important; 
    background: linear-gradient(to right, rgba(var(--ios-accent-rgb),0.18) 0%, rgba(var(--ios-accent-rgb),0.08) 100%) !important;
    border-bottom:1px solid var(--zzuli-separator) !important;
    padding: 14px 18px 14px 22px !important;
    letter-spacing: 0.3px;
  }
  
  html.zzuli-ios-theme.zzuli-dark .panel.zzuli-problem-section .panel-heading { 
    background: linear-gradient(to right, rgba(var(--ios-accent-rgb),0.32) 0%, rgba(var(--ios-accent-rgb),0.12) 100%) !important;
  }
  
  html.zzuli-ios-theme .panel.zzuli-problem-section .panel-body {
    padding: 18px 22px !important;
    line-height: 1.7;
  }

  /* 样例区代码块微调 */
  html.zzuli-ios-theme pre.content { 
    font-size:13.5px; 
    line-height:1.6;
    box-shadow: inset 0 0 0 1px rgba(var(--ios-accent-rgb),0.08), var(--zzuli-shadow);
  }
  
  html.zzuli-ios-theme .sampledata { 
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    font-weight: 500;
  }

  /* Copy 按钮美化 */
  html.zzuli-ios-theme .panel-heading a[href*="Copy"] {
    float: right;
    margin-left: 12px;
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 600;
    background: rgba(var(--ios-accent-rgb),0.15);
    color: var(--ios-accent) !important;
    border-radius: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none !important;
    border: 1px solid rgba(var(--ios-accent-rgb),0.3);
  }
  
  html.zzuli-ios-theme .panel-heading a[href*="Copy"]:hover {
    background: var(--ios-accent);
    color: #fff !important;
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(var(--ios-accent-rgb), 0.4);
  }

  /* 底部 footer 中的旧方括号隐藏（仅在我们生成新按钮后附加类时生效） */
  html.zzuli-ios-theme .panel-footer.zzuli-clean-brackets { font-size:0; }
  html.zzuli-ios-theme .panel-footer.zzuli-clean-brackets a { font-size:14px; }

  /* 让原 footer 转为透明容器（我们另建按钮栏） */
  html.zzuli-ios-theme .panel-footer.zzuli-problem-footer { 
    background:transparent !important; 
    border:none !important; 
    box-shadow:none !important; 
    padding:0 !important; 
    margin-top:12px; 
  }
  
  /* 响应式优化 */
  @media (max-width: 768px) {
    html.zzuli-ios-theme .zzuli-problem-header {
      padding: 24px 20px 22px;
      border-radius: 20px;
    }
    html.zzuli-ios-theme .zzuli-problem-title {
      font-size: 24px;
    }
    html.zzuli-ios-theme .zzuli-problem-actions-bar {
      flex-wrap: wrap;
    }
    html.zzuli-ios-theme .zzuli-problem-actions-bar .zzuli-action-btn {
      flex: 1 1 auto;
      justify-content: center;
      padding: 10px 18px;
      font-size: 14px;
    }
  }

  /* ===== 题目详情页专属增强结束 ===== */

  /* ===== 提交代码页增强样式 ===== */
  html.zzuli-ios-theme .zzuli-submit-wrapper { background: var(--zzuli-card); border:1px solid var(--zzuli-separator); border-radius:28px; padding:32px 34px 28px; box-shadow: var(--zzuli-shadow); max-width:1200px; margin:0 auto 42px; position:relative; }
  html.zzuli-ios-theme .zzuli-submit-wrapper.zzuli-fullscreen { position:fixed; inset:16px; z-index:99990; overflow:auto; backdrop-filter:blur(22px) saturate(180%); -webkit-backdrop-filter:blur(22px) saturate(180%); animation:zzuliFadeIn .18s ease; }
  @keyframes zzuliFadeIn { from { opacity:0; transform:scale(.985);} to { opacity:1; transform:scale(1);} }
  html.zzuli-ios-theme .zzuli-submit-header { display:flex; flex-wrap:wrap; gap:18px; align-items:center; margin-bottom:18px; }
  html.zzuli-ios-theme .zzuli-submit-title { font-size:24px; font-weight:700; background:linear-gradient(92deg, var(--ios-accent), rgba(var(--ios-accent-rgb),0.55)); -webkit-background-clip:text; color:transparent; margin-right:auto; }
  html.zzuli-ios-theme .zzuli-lang-segment { display:inline-flex; background:rgba(var(--ios-accent-rgb),0.12); border:1px solid rgba(var(--ios-accent-rgb),0.35); border-radius:20px; padding:4px; gap:4px; }
  html.zzuli-ios-theme.zzuli-dark .zzuli-lang-segment { background:rgba(var(--ios-accent-rgb),0.25); }
  html.zzuli-ios-theme .zzuli-lang-segment button { border:none; background:transparent; padding:6px 14px; font-size:13px; font-weight:500; border-radius:14px; cursor:pointer; color:var(--ios-accent); transition: background var(--ios-transition), color var(--ios-transition); }
  html.zzuli-ios-theme .zzuli-lang-segment button.zzuli-active { background:var(--ios-accent); color:#fff; box-shadow:0 2px 6px -1px rgba(var(--ios-accent-rgb),0.55); }
  html.zzuli-ios-theme .zzuli-submit-toolbar { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom:10px; }
  html.zzuli-ios-theme .zzuli-chip-small { font-size:12px; padding:4px 10px; border-radius:14px; background:rgba(var(--ios-accent-rgb),0.10); color:var(--ios-accent); font-weight:500; border:1px solid rgba(var(--ios-accent-rgb),0.25); }
  html.zzuli-ios-theme.zzuli-dark .zzuli-chip-small { background:rgba(var(--ios-accent-rgb),0.22); }
  html.zzuli-ios-theme .zzuli-submit-actions { margin-left:auto; display:flex; gap:10px; }
  html.zzuli-ios-theme .zzuli-submit-fullscreen-btn { background:linear-gradient(to bottom right, rgba(var(--ios-accent-rgb),0.18), rgba(var(--ios-accent-rgb),0.05)); border:1px solid rgba(var(--ios-accent-rgb),0.4); color:var(--ios-accent); padding:6px 14px; font-size:12px; line-height:1; border-radius:18px; cursor:pointer; }
  html.zzuli-ios-theme .zzuli-submit-fullscreen-btn:hover { background:rgba(var(--ios-accent-rgb),0.30); color:#fff; }
  html.zzuli-ios-theme .zzuli-editor-container { position:relative; border-radius:18px; overflow:hidden; }
  html.zzuli-ios-theme .zzuli-editor-container .CodeMirror,
  html.zzuli-ios-theme .zzuli-editor-container .ace_editor,
  html.zzuli-ios-theme .zzuli-editor-container textarea { min-height:380px; font-size:13.5px; }
  html.zzuli-ios-theme .zzuli-code-overlay { position:absolute; right:10px; bottom:8px; font-size:11px; background:rgba(0,0,0,0.35); color:#fff; padding:4px 10px 5px; border-radius:14px; display:flex; gap:8px; align-items:center; backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); pointer-events:none; }
  html.zzuli-ios-theme.zzuli-dark .zzuli-code-overlay { background:rgba(255,255,255,0.15); }
  html.zzuli-ios-theme .zzuli-auto-saved { font-size:11px; color:var(--zzuli-muted); margin-left:4px; min-height:14px; }
  html.zzuli-ios-theme .zzuli-submit-footer { display:flex; justify-content:space-between; align-items:center; margin-top:18px; gap:12px; flex-wrap:wrap; }
  html.zzuli-ios-theme .zzuli-submit-footer .btn-primary { font-weight:600; padding:8px 26px; }
  html.zzuli-ios-theme .zzuli-warning-unsaved { color:#d35400; font-size:12px; font-weight:500; }
  html.zzuli-ios-theme.zzuli-dark .zzuli-warning-unsaved { color:#ffb347; }
  html.zzuli-ios-theme .zzuli-hidden { display:none !important; }
  html.zzuli-ios-theme .zzuli-lang-select-original { display:none !important; }
  @media (max-width: 768px){
    html.zzuli-ios-theme .zzuli-submit-wrapper { padding:24px 20px 26px; border-radius:22px; }
    html.zzuli-ios-theme .zzuli-submit-title { font-size:20px; }
    html.zzuli-ios-theme .zzuli-submit-fullscreen-btn { padding:6px 12px; }
    html.zzuli-ios-theme .zzuli-code-overlay { font-size:10px; right:6px; bottom:6px; }
  }
  /* ===== 提交代码页增强样式结束 ===== */

  /* ===== 代码补全 / 导入提示 iOS 风格 ===== */
  /* CodeMirror 5 show-hint */
  html.zzuli-ios-theme .CodeMirror-hints { position:absolute; z-index:999999 !important; padding:6px 0; margin:4px 0 0; list-style:none; background:var(--zzuli-card); backdrop-filter:blur(22px) saturate(180%); -webkit-backdrop-filter:blur(22px) saturate(180%); border:1px solid var(--zzuli-separator); border-radius:16px; font-size:13px; box-shadow:0 8px 28px -6px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08); max-height:320px; overflow-y:auto; scrollbar-width:thin; }
  html.zzuli-ios-theme.zzuli-dark .CodeMirror-hints { box-shadow:0 8px 28px -8px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.5); }
  html.zzuli-ios-theme .CodeMirror-hint { padding:6px 14px 6px 14px; cursor:pointer; white-space:nowrap; color:var(--zzuli-text); display:flex; align-items:center; gap:10px; position:relative; font-family:var(--ios-font-stack); }
  html.zzuli-ios-theme .CodeMirror-hint:hover { background:rgba(var(--ios-accent-rgb),0.10); }
  html.zzuli-ios-theme .CodeMirror-hint-active { background:linear-gradient(92deg, var(--ios-accent), rgba(var(--ios-accent-rgb),0.7)); color:#fff; border-radius:10px; }
  html.zzuli-ios-theme .CodeMirror-hint span.zzuli-hint-meta { margin-left:auto; font-size:11px; color:var(--zzuli-muted); font-weight:500; letter-spacing:.5px; }
  html.zzuli-ios-theme .CodeMirror-hint-active span.zzuli-hint-meta { color:rgba(255,255,255,0.9); }

  /* 右侧导入 / 来源 / 类型提示通用元信息容器（若存在） */
  html.zzuli-ios-theme .CodeMirror-hint .zzuli-hint-meta { margin-left:auto; font-size:11px; color:var(--zzuli-muted); font-weight:500; letter-spacing:.5px; }

  /* CodeMirror 6 自动补全 */
  html.zzuli-ios-theme .cm-tooltip.cm-tooltip-autocomplete { border:1px solid var(--zzuli-separator); background:var(--zzuli-card); backdrop-filter:blur(22px) saturate(180%); -webkit-backdrop-filter:blur(22px) saturate(180%); border-radius:18px; padding:6px 0; box-shadow:0 8px 28px -6px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08); }
  html.zzuli-ios-theme.zzuli-dark .cm-tooltip.cm-tooltip-autocomplete { box-shadow:0 8px 28px -8px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.5); }
  html.zzuli-ios-theme .cm-tooltip-autocomplete ul { padding:0; margin:0; }
  html.zzuli-ios-theme .cm-tooltip-autocomplete li { padding:6px 14px; font-size:13px; display:flex; align-items:center; gap:8px; }
  html.zzuli-ios-theme .cm-tooltip-autocomplete li[aria-selected="true"] { background:linear-gradient(92deg, var(--ios-accent), rgba(var(--ios-accent-rgb),0.7)); color:#fff; }
  html.zzuli-ios-theme .cm-completionDetail { margin-left:auto; font-size:11px; opacity:.75; }
  html.zzuli-ios-theme .cm-completionMatchedText { font-weight:600; color:var(--ios-accent); }
  html.zzuli-ios-theme.zzuli-dark .cm-tooltip-autocomplete li[aria-selected="true"] .cm-completionMatchedText { color:#fff; text-decoration:underline; }

  /* Ace Editor 自动补全 */
  html.zzuli-ios-theme .ace_autocomplete { background:var(--zzuli-card) !important; color:var(--zzuli-text) !important; border:1px solid var(--zzuli-separator) !important; border-radius:18px !important; box-shadow:0 8px 26px -6px rgba(0,0,0,0.18),0 2px 6px rgba(0,0,0,0.08) !important; padding:4px 0 6px !important; backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); }
  html.zzuli-ios-theme.zzuli-dark .ace_autocomplete { box-shadow:0 8px 28px -8px rgba(0,0,0,0.6),0 2px 6px rgba(0,0,0,0.5) !important; }
  html.zzuli-ios-theme .ace_autocomplete .ace_completion { padding:4px 14px 4px 14px !important; position:relative; }
  html.zzuli-ios-theme .ace_autocomplete .ace_completion:hover { background:rgba(var(--ios-accent-rgb),0.10) !important; }
  html.zzuli-ios-theme .ace_autocomplete .ace_selected { background:linear-gradient(92deg, var(--ios-accent), rgba(var(--ios-accent-rgb),0.75)) !important; color:#fff !important; border-radius:10px; }
  html.zzuli-ios-theme .ace_autocomplete .ace_completion.ace_selected .ace_rightAlignedText { color:rgba(255,255,255,0.85) !important; }
  html.zzuli-ios-theme .ace_autocomplete .ace_rightAlignedText { font-size:11px; color:var(--zzuli-muted) !important; font-weight:500; }
  html.zzuli-ios-theme .ace_doc-tooltip { background:var(--zzuli-card) !important; border:1px solid var(--zzuli-separator) !important; color:var(--zzuli-text) !important; border-radius:16px !important; box-shadow:0 10px 30px -8px rgba(0,0,0,0.25),0 2px 6px rgba(0,0,0,0.08) !important; max-width:420px; line-height:1.5; padding:10px 14px !important; font-size:12.5px; }
  html.zzuli-ios-theme.zzuli-dark .ace_doc-tooltip { box-shadow:0 10px 34px -10px rgba(0,0,0,0.65),0 2px 6px rgba(0,0,0,0.5) !important; }
  html.zzuli-ios-theme .ace_doc-tooltip code, html.zzuli-ios-theme .ace_doc-tooltip pre { background:rgba(var(--ios-accent-rgb),0.10); padding:2px 6px; border-radius:8px; }

  /* 滚动条微调 */
  html.zzuli-ios-theme .CodeMirror-hints::-webkit-scrollbar, html.zzuli-ios-theme .ace_autocomplete::-webkit-scrollbar { width:8px; }
  html.zzuli-ios-theme .CodeMirror-hints::-webkit-scrollbar-track, html.zzuli-ios-theme .ace_autocomplete::-webkit-scrollbar-track { background:transparent; }
  html.zzuli-ios-theme .CodeMirror-hints::-webkit-scrollbar-thumb, html.zzuli-ios-theme .ace_autocomplete::-webkit-scrollbar-thumb { background:rgba(var(--ios-accent-rgb),0.35); border-radius:20px; }
  html.zzuli-ios-theme.zzuli-dark .CodeMirror-hints::-webkit-scrollbar-thumb, html.zzuli-ios-theme.zzuli-dark .ace_autocomplete::-webkit-scrollbar-thumb { background:rgba(var(--ios-accent-rgb),0.55); }
  /* ===== 补全弹窗结束 ===== */

  /* ===== 统计页/题目页 legacy Pie 饼图（PieDiv）原样式重绘（严格参考原版） ===== */
  html.zzuli-ios-theme .zzuli-pie-root { position: relative !important; height: auto !important; width: auto !important; }
  html.zzuli-ios-theme .zzuli-pie-card { display: flex; align-items: center; gap: 10px; padding: 4px; border-radius: 14px; background: var(--zzuli-card); border: 1px solid var(--zzuli-separator); box-shadow: var(--zzuli-shadow); }
  html.zzuli-ios-theme .zzuli-pie-figure { width: 200px; height: 200px; flex: 0 0 auto; display: grid; place-items: center; position: relative; }
  html.zzuli-ios-theme .zzuli-pie-legend { display: grid; grid-auto-rows: minmax(0,auto); gap: 6px; font-size: 12px; color: var(--zzuli-text); }
  html.zzuli-ios-theme .zzuli-pie-legend .item { display: flex; align-items: center; gap: 8px; background: rgba(var(--ios-accent-rgb),0.06); border: 1px solid var(--zzuli-separator); padding: 6px 10px; border-radius: 12px; transition: all var(--ios-transition); }
  html.zzuli-ios-theme .zzuli-pie-legend .item:hover { background: rgba(var(--ios-accent-rgb),0.12); transform: translateX(2px); }
  html.zzuli-ios-theme.zzuli-dark .zzuli-pie-legend .item { background: rgba(255,255,255,0.06); }
  html.zzuli-ios-theme .zzuli-pie-legend .dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 0 1px rgba(0,0,0,0.1); }
  html.zzuli-ios-theme .zzuli-pie-legend .label { font-weight: 600; }
  html.zzuli-ios-theme .zzuli-pie-legend .val { margin-left: 4px; color: var(--zzuli-muted); }
  html.zzuli-ios-theme .zzuli-pie-center { position: absolute; text-align: center; font-size: 12px; color: var(--zzuli-text); }
  
  /* iOS 风格饼图扇形标签 */
  html.zzuli-ios-theme .zzuli-pie-label { 
    position: absolute; 
    font-size: 11px; 
    font-weight: 600; 
    color: #fff; 
    text-shadow: 0 1px 3px rgba(0,0,0,0.5), 0 0 8px rgba(0,0,0,0.3);
    pointer-events: none; 
    transform: translate(-50%, -50%);
    z-index: 10;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    padding: 2px 6px;
    border-radius: 6px;
    background: rgba(0,0,0,0.15);
    white-space: nowrap;
    opacity: 0;
    animation: zzuliPieLabelFadeIn 0.4s ease forwards;
  }
  
  @keyframes zzuliPieLabelFadeIn {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  
  /* 饼图扇形动画 */
  html.zzuli-ios-theme .zzuli-pie-segment {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }
  
  html.zzuli-ios-theme .zzuli-pie-segment:hover {
    filter: brightness(1.15) drop-shadow(0 2px 8px rgba(0,0,0,0.3));
    transform: scale(1.05);
  }
  
  /* 紧凑模式：用于窄单元格，隐藏图例，缩小圆环 */
  html.zzuli-ios-theme .zzuli-pie-card.compact { padding: 2px; }
  html.zzuli-ios-theme .zzuli-pie-card.compact .zzuli-pie-figure { width: 140px; height: 140px; }
  html.zzuli-ios-theme .zzuli-pie-card.compact .zzuli-pie-legend { display: none; }
   @media (max-width: 640px){
     html.zzuli-ios-theme .zzuli-pie-card { flex-direction: column; align-items: stretch; }
     html.zzuli-ios-theme .zzuli-pie-figure { margin: 0 auto; }
   }
   /* ===== 统计页/题目页 legacy Pie 饼图重绘结束 ===== */

  /* —— 原版 PieDiv 简洁布局（匹配原始 pie.js 的呈现） —— */
  html.zzuli-ios-theme .zzuli-pie-wrap { display: inline-flex; align-items: center; gap: 8px; }
  html.zzuli-ios-theme .zzuli-pie-wrap.compact .zzuli-pie-legend { display:none; }
  html.zzuli-ios-theme .zzuli-pie-figure { width: 200px; height: 200px; display: grid; place-items: center; position: relative; }
  html.zzuli-ios-theme .zzuli-pie-figure.compact { width: 140px; height: 140px; }
  html.zzuli-ios-theme .zzuli-pie-legend { display: grid; gap: 6px; font-size: 12px; color: var(--zzuli-text); }
  html.zzuli-ios-theme .zzuli-pie-legend .item { display: inline-flex; align-items: center; gap: 6px; }
  html.zzuli-ios-theme .zzuli-pie-legend .dot { width: 10px; height: 10px; border-radius: 0; }
  html.zzuli-ios-theme .zzuli-pie-legend .text { white-space: nowrap; }

  `;

    styleTag.textContent = baseCSS;

    function applyTheme() {
        const html = document.documentElement;
        if (STATE.enabled) {
            html.classList.add('zzuli-ios-theme');
            if (STATE.dark) {
                html.classList.add('zzuli-dark');
            } else {
                html.classList.remove('zzuli-dark');
            }
        } else {
            html.classList.remove('zzuli-ios-theme');
            html.classList.remove('zzuli-dark');
        }
        updatePanelText();
    }

    // 控制面板
    const panel = document.createElement('div');
    panel.id = 'zzuli-ios-toggle-panel';
    panel.innerHTML = `
     <div class="zzuli-chip state-indicator">iOS主题: <span id="zzuli-ios-state"></span></div>
     <button id="zzuli-ios-toggle" class="btn btn-sm">切换 iOS 主题</button>
     <button id="zzuli-ios-dark" class="btn btn-sm">切换深色模式</button>
     <button id="zzuli-ios-auto" class="btn btn-sm">跟随系统: <span id="zzuli-ios-auto-state"></span></button>
     <div class="zzuli-chip">快捷键: Ctrl/⌘ + Alt/⌥ + I</div>
  `;
    document.body.appendChild(panel);

    function updatePanelText() {
        const state = document.getElementById('zzuli-ios-state');
        const autoState = document.getElementById('zzuli-ios-auto-state');
        if (state) {
            state.textContent = STATE.enabled
                ? (STATE.dark ? '开启 (深色)' : '开启 (浅色)')
                : '关闭';
        }
        if (autoState) {
            autoState.textContent = STATE.auto ? '开' : '关';
        }
    }

    panel.querySelector('#zzuli-ios-toggle').addEventListener('click', toggleEnabled);
    panel.querySelector('#zzuli-ios-dark').addEventListener('click', toggleDark);
    panel.querySelector('#zzuli-ios-auto').addEventListener('click', toggleAuto);

    // 快捷键
    window.addEventListener('keydown', (e) => {
        const meta = navigator.platform.includes('Mac');
        const combo = meta ? e.metaKey && e.altKey : e.ctrlKey && e.altKey;
        if (combo && (e.key === 'i' || e.key === 'I')) {
            e.preventDefault();
            toggleEnabled();
        }
    });

    // 对已有元素做一次必要轻量包装（这里主要依赖纯 CSS 覆盖，不侵入 DOM）
    function initialAdjust() {
        // 移除可能影响的内联多余背景色 (扩展匹配 #FFF/#fff)
        document.querySelectorAll('[style*="background-color:#FFF"],[style*="background-color:#fff"],[style*="background:#FFF"],[style*="background:#fff"]').forEach(el => {
            if (!el.dataset._origInlineBg) {
                el.dataset._origInlineBg = el.getAttribute('style');
            }
            try { el.style.backgroundColor = 'transparent'; } catch(e) {}
        });
    }

    /* 题目详情页增强 */
    function enhanceProblemPage() {
        if (!document.documentElement.classList.contains('zzuli-ios-theme')) return;
        // URL 或特征匹配
        const isProblem = /problem\.php/i.test(location.href) || document.querySelector('center h3')?.textContent?.match(/^\d+:/);
        if (!isProblem) return;
        if (document.body.dataset.zzuliProblemEnhanced) return; // 避免重复
        document.body.dataset.zzuliProblemEnhanced = '1';

        const centerNode = document.querySelector('center h3')?.parentElement?.parentElement; // 依据结构往上两层
        if (centerNode) {
            // 构建新头部容器
            const header = document.createElement('div');
            header.className = 'zzuli-problem-header';

            // 题目标题
            const h3 = centerNode.querySelector('h3');
            if (h3) {
                const title = document.createElement('div');
                title.className = 'zzuli-problem-title';
                title.textContent = h3.textContent.trim();
                header.appendChild(title);
            }
            // Meta 信息
            const metaWrap = document.createElement('div');
            metaWrap.className = 'zzuli-problem-meta';
            // 时间限制
            const timeSpan = centerNode.querySelector('span[fd="time_limit"]');
            if (timeSpan) {
                const chip = document.createElement('span');
                chip.className = 'zzuli-chip-badge';
                chip.dataset.kind = 'limit';
                chip.textContent = '时间 ' + timeSpan.textContent.trim() + 's';
                metaWrap.appendChild(chip);
            }
            // 内存限制：直接用全文检索相邻含“内存限制”文本
            const memoryNode = Array.from(centerNode.childNodes).find(n => n.textContent && n.textContent.includes('内存限制'));
            if (memoryNode) {
                const match = memoryNode.textContent.match(/内存限制:\s*([^\s<]+)/);
                if (match) {
                    const chip = document.createElement('span');
                    chip.className = 'zzuli-chip-badge';
                    chip.dataset.kind = 'limit';
                    chip.textContent = '内存 ' + match[1];
                    metaWrap.appendChild(chip);
                }
            }
            // 提交 / 解决
            const statsText = centerNode.textContent;
            const submitMatch = statsText.match(/提交:\s*(\d+)/);
            const solveMatch = statsText.match(/解决:\s*(\d+)/);
            if (submitMatch) {
                const chip = document.createElement('span');
                chip.className = 'zzuli-chip-badge';
                chip.textContent = '提交 ' + submitMatch[1];
                metaWrap.appendChild(chip);
            }
            if (solveMatch) {
                const chip = document.createElement('span');
                chip.className = 'zzuli-chip-badge';
                chip.textContent = '解决 ' + solveMatch[1];
                metaWrap.appendChild(chip);
            }
            // 命题人
            const creator = centerNode.querySelector('#creator a');
            if (creator) {
                const chip = document.createElement('span');
                chip.className = 'zzuli-chip-badge';
                chip.textContent = '命题人 ' + creator.textContent.trim();
                metaWrap.appendChild(chip);
            }
            header.appendChild(metaWrap);

            // 动作按钮栏（提交 / 状态）
            const actionsBar = document.createElement('div');
            actionsBar.className = 'zzuli-problem-actions-bar';
            const submitLink = centerNode.querySelector('a[href*="submitpage.php"]');
            const statusLink = centerNode.querySelector('a[href*="problemstatus.php"]');
            if (submitLink) {
                const a = document.createElement('a');
                a.href = submitLink.href;
                a.className = 'zzuli-action-btn';
                a.textContent = '提交代码';
                actionsBar.appendChild(a);
            }
            if (statusLink) {
                const a2 = document.createElement('a');
                a2.href = statusLink.href;
                a2.className = 'zzuli-action-btn secondary';
                a2.textContent = '查看状态';
                actionsBar.appendChild(a2);
            }
            if (actionsBar.children.length) header.appendChild(actionsBar);

            // 插入到原 centerNode 前面
            centerNode.parentElement.insertBefore(header, centerNode);
        }

        // 面板强化
        document.querySelectorAll('.panel.panel-default').forEach(p => {
            p.classList.add('zzuli-problem-section');
        });

        // 底部 panel-footer 改造（如果存在）
        const footer = document.querySelector('center .panel-footer');
        if (footer) {
            // 移除旧括号并隐藏原文字结构
            footer.innerHTML = footer.innerHTML.replace(/[\[\]]/g, '');
            footer.classList.add('zzuli-problem-footer');
            // 如果我们已经有 header 中的动作按钮，就让 footer 更简洁；否则也复制按钮
            if (!document.querySelector('.zzuli-problem-actions-bar')) {
                const actionsBar = document.createElement('div');
                actionsBar.className = 'zzuli-problem-actions-bar';
                footer.querySelectorAll('a').forEach((a, idx) => {
                    a.classList.add('zzuli-action-btn');
                    if (idx === 1) a.classList.add('secondary');
                    a.textContent = a.textContent === '提交' ? '提交代码' : (a.textContent === '状态' ? '查看状态' : a.textContent);
                    actionsBar.appendChild(a);
                });
                footer.textContent = '';
                footer.appendChild(actionsBar);
            } else {
                // 已在上方生成；隐藏 footer
                footer.style.display = 'none';
            }
        }
    }

    // 提交代码页增强
    function enhanceSubmitPage(){
        if(!document.documentElement.classList.contains('zzuli-ios-theme')) return;
        if(!/submitpage\.php/i.test(location.href)) return;
        if(document.body.dataset.zzuliSubmitEnhanced) return;
        document.body.dataset.zzuliSubmitEnhanced = '1';

        const form = document.querySelector('form textarea, form .CodeMirror, form .ace_editor')?.closest('form');
        if(!form) return;

        const params = new URLSearchParams(location.search);
        const pid = params.get('id') || params.get('pid') || params.get('problem_id') || '未知';

        const langSelect = form.querySelector('select'); // 保留原生下拉框

        const wrapper = document.createElement('div');
        wrapper.className = 'zzuli-submit-wrapper';
        form.parentElement.insertBefore(wrapper, form);
        wrapper.appendChild(form);

        const header = document.createElement('div');
        header.className = 'zzuli-submit-header';
        const title = document.createElement('div');
        title.className = 'zzuli-submit-title';
        title.textContent = `提交代码 #${pid}`;
        header.appendChild(title);
        // 不再构建分段语言控件，保留原 select
        wrapper.insertBefore(header, form);

        const toolbar = document.createElement('div');
        toolbar.className = 'zzuli-submit-toolbar';
        const statsChip = document.createElement('div'); statsChip.className='zzuli-chip-small'; statsChip.textContent='长度: 0'; toolbar.appendChild(statsChip);
        const autoSaved = document.createElement('div'); autoSaved.className='zzuli-auto-saved'; toolbar.appendChild(autoSaved);
        wrapper.insertBefore(toolbar, form);

        const submitBtn = form.querySelector('input[type=submit],button[type=submit],input[name=submit]');
        const footer = document.createElement('div'); footer.className='zzuli-submit-footer';
        const leftInfo = document.createElement('div'); leftInfo.className='zzuli-warning-unsaved zzuli-hidden'; leftInfo.textContent='有未保存的更改';
        const rightActions = document.createElement('div'); rightActions.style.display='flex'; rightActions.style.gap='10px';
        if(submitBtn){ submitBtn.classList.add('btn','btn-primary'); rightActions.appendChild(submitBtn); }
        footer.appendChild(leftInfo); footer.appendChild(rightActions); form.appendChild(footer);

        const codeNode = form.querySelector('.CodeMirror, .ace_editor, textarea');
        if(codeNode){
            const container = document.createElement('div'); container.className='zzuli-editor-container';
            codeNode.parentElement.insertBefore(container, codeNode); container.appendChild(codeNode);
            const overlay = document.createElement('div'); overlay.className='zzuli-code-overlay'; overlay.textContent=''; container.appendChild(overlay);
            overlay.dataset.role='overlayStats';
        }

        const textarea = form.querySelector('textarea');

        function getCode(){
            const cmEl = form.querySelector('.CodeMirror'); if(cmEl && cmEl.CodeMirror) return cmEl.CodeMirror.getValue();
            const aceEl = form.querySelector('.ace_editor'); if(window.ace && aceEl && aceEl.env && aceEl.env.editor) return aceEl.env.editor.getValue();
            return textarea ? textarea.value : '';
        }
        function setCode(v){
            const cmEl = form.querySelector('.CodeMirror'); if(cmEl && cmEl.CodeMirror){ cmEl.CodeMirror.setValue(v); return; }
            const aceEl = form.querySelector('.ace_editor'); if(window.ace && aceEl && aceEl.env && aceEl.env.editor){ aceEl.env.editor.setValue(v,-1); return; }
            if(textarea) textarea.value = v;
        }
        function draftKey(){ const langIdx = langSelect ? langSelect.selectedIndex : 0; return `zzuli_draft_${pid}_lang${langIdx}`; }
        function loadDraftForLang(){ const saved = localStorage.getItem(draftKey()); if(saved!=null){ setCode(saved); lastSavedValue=saved; updateStats(); autoSaved.textContent='已载入草稿'; setTimeout(()=>{ if(autoSaved.textContent==='已载入草稿') autoSaved.textContent='';},1500);} else { updateStats(); } }

        let lastSavedValue = getCode();
        let debounceTimer = null;
        function scheduleAutosave(){
            if(debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(()=>{ if(getCode()!==lastSavedValue) performAutosave(); },1500);
        }
        function performAutosave(){
            const code = getCode(); localStorage.setItem(draftKey(), code); lastSavedValue=code; autoSaved.textContent='已自动保存';
            setTimeout(()=>{ if(autoSaved.textContent==='已自动保存') autoSaved.textContent=''; },1800); updateStats();
        }
        function updateStats(){
            const code = getCode(); const lines = code.length? code.split(/\n/).length : 0;
            statsChip.textContent = `长度: ${code.length} | 行: ${lines}`;
            leftInfo.classList.toggle('zzuli-hidden', code===lastSavedValue);
            const overlay = form.querySelector('.zzuli-code-overlay'); if(overlay){
                let lineInfo='';
                const cmEl = form.querySelector('.CodeMirror');
                if(cmEl && cmEl.CodeMirror){ const pos = cmEl.CodeMirror.getCursor(); lineInfo = `Ln ${pos.line+1}, Col ${pos.ch+1}`; }
                else { const aceEl = form.querySelector('.ace_editor'); if(window.ace && aceEl && aceEl.env && aceEl.env.editor){ const pos = aceEl.env.editor.getCursorPosition(); lineInfo = `Ln ${pos.row+1}, Col ${pos.column+1}`; } }
                overlay.textContent = `${lineInfo}${lineInfo? ' | ' : ''}Len ${code.length} Lns ${lines}`;
            }
        }

        if(textarea) textarea.addEventListener('input', ()=>{ updateStats(); scheduleAutosave(); });
        const cmEl = form.querySelector('.CodeMirror'); if(cmEl && cmEl.CodeMirror){ cmEl.CodeMirror.on('change', ()=>{ updateStats(); scheduleAutosave(); }); cmEl.CodeMirror.on('cursorActivity', updateStats); }
        const aceEl = form.querySelector('.ace_editor'); if(window.ace && aceEl && aceEl.env && aceEl.env.editor){ aceEl.env.editor.on('change', ()=>{ updateStats(); scheduleAutosave(); }); aceEl.env.editor.selection.on('changeCursor', updateStats); }
        if(langSelect){ langSelect.addEventListener('change', ()=>{ loadDraftForLang(); }); }

        if(submitBtn){ submitBtn.addEventListener('click', ()=>{ const k=draftKey(); setTimeout(()=>localStorage.removeItem(k),200); lastSavedValue=getCode(); updateStats(); }); }
        window.addEventListener('beforeunload', (e)=>{ if(getCode()!==lastSavedValue){ e.preventDefault(); e.returnValue=''; }});

        loadDraftForLang();
        updateStats();
    }

    /* ================= 用户信息页提交/正确图表修复与 iOS 风格重绘 ================= */
    function enhanceUserInfoChart(){
        // 仅在包含 #submission (Flot 图) 的用户信息页执行
        if(!/userinfo\.php/i.test(location.href)) return;
        const container = document.getElementById('submission');
        if(!container) return;
        if(container.dataset.zzuliChartUpgraded) return;

        // 尝试获取 Flot plot 对象（可能需要等待）
        let attempts = 0;
        const maxAttempts = 60; // ~30 秒 (500ms * 60)
        const timer = setInterval(()=>{
            attempts++;
            const $ = window.jQuery;
            if(!$){ if(attempts>=maxAttempts) clearInterval(timer); return; }
            const plot = $(container).data('plot');
            if(!plot){ if(attempts>=maxAttempts) clearInterval(timer); return; }
            try {
                clearInterval(timer);
                // 原数据
                const orig = plot.getData();
                if(!orig || orig.length<2) return;
                const submitSeries = orig[0].data || [];
                const acSeries = orig[1].data || [];

                function aggregate(series){
                    const map = Object.create(null);
                    for(let i=0;i<series.length;i++){
                        const p = series[i];
                        if(!p) continue;
                        let t = p[0];
                        const d = new Date(t); d.setHours(0,0,0,0); t = d.getTime();
                        map[t] = (map[t]||0) + p[1];
                    }
                    return Object.keys(map).map(k=>[+k,map[k]]).sort((a,b)=>a[0]-b[0]);
                }
                const d1 = aggregate(submitSeries);
                const d2 = aggregate(acSeries);
                const totalSubmit = d1.reduce((s,p)=>s+p[1],0);
                const totalAC = d2.reduce((s,p)=>s+p[1],0);
                const acRate = totalSubmit? (totalAC/totalSubmit*100).toFixed(1) : '0.0';

                // 移除原 legend
                const oldLegend = container.querySelector('.legend');
                if(oldLegend) oldLegend.remove();

                // 自定义样式一次性注入
                if(!document.getElementById('zzuli-userchart-ios-style')){
                    const style = document.createElement('style');
                    style.id='zzuli-userchart-ios-style';
                    style.textContent = `#submission-wrapper-ios{position:relative;}\n#submission{border-radius:18px !important; background:var(--zzuli-code-bg,#fff); box-shadow:0 2px 8px rgba(0,0,0,0.06),0 4px 18px -6px rgba(0,0,0,0.12); padding:4px 4px 0 4px;}\nhtml.zzuli-dark #submission{background:linear-gradient(145deg,#1f1f1f,#242424);}\n#submission-ios-legend{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;font-size:12px;font-family:var(--ios-font-stack,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC',Arial,sans-serif);color:var(--zzuli-text,#222);}\n#submission-ios-legend .item{display:flex;align-items:center;padding:6px 10px;border-radius:14px;background:rgba(255,255,255,0.58);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);gap:6px;line-height:1;font-weight:500;}\nhtml.zzuli-dark #submission-ios-legend .item{background:rgba(40,40,40,0.55);color:#e6e6e6;}\n#submission-ios-legend .dot{width:10px;height:10px;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,0.08);}\nhtml.zzuli-dark #submission-ios-legend .dot{box-shadow:0 0 0 1px rgba(255,255,255,0.10);}\n#submission-ios-stats{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px;font-size:12px;font-family:var(--ios-font-stack,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC',Arial,sans-serif);}\n#submission-ios-stats .stat{padding:6px 12px;border-radius:14px;background:#111;color:#fff;font-weight:500;}\n#submission-ios-stats .rate{background:#007aff;}\nhtml.zzuli-dark #submission-ios-stats .stat{background:#333;}\nhtml.zzuli-dark #submission-ios-stats .rate{background:#0a84ff;}\n#submission-tooltip-ios{position:absolute;padding:6px 10px;background:rgba(0,0,0,0.75);color:#fff;font-size:12px;border-radius:10px;pointer-events:none;z-index:50;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:none;}\n`;
                    document.head.appendChild(style);
                }

                // 包裹器
                if(!container.parentElement.id || container.parentElement.id!=='submission-wrapper-ios'){
                    const wrap = document.createElement('div');
                    wrap.id='submission-wrapper-ios';
                    container.parentElement.insertBefore(wrap, container);
                    wrap.appendChild(container);
                }

                // 重新绘制
                $.plot($(container), [
                    {label:'提交', data:d1, lines:{show:true,lineWidth:2}, color:'#ff9500', shadowSize:0},
                    {label:'正确', data:d2, bars:{show:true, barWidth:24*3600*1000*0.55, align:'center', fill:0.75, lineWidth:1}, color:'#34c759', shadowSize:0}
                ], {
                    legend:{show:false},
                    xaxis:{mode:'time', tickLength:0},
                    yaxis:{min:0, tickDecimals:0},
                    grid:{hoverable:true, clickable:true, borderWidth:0, color:(document.documentElement.classList.contains('zzuli-dark')?'#aaa':'#666'), backgroundColor:{colors:(document.documentElement.classList.contains('zzuli-dark')?['#1f1f1f','#242424']:['#ffffff','#f6f8fa'])}}
                });

                // 自定义 Legend + 统计
                const wrap = container.parentElement;
                // 清理旧
                wrap.querySelector('#submission-ios-legend')?.remove();
                wrap.querySelector('#submission-ios-stats')?.remove();
                const legend = document.createElement('div'); legend.id='submission-ios-legend';
                legend.innerHTML = `\n <div class="item"><span class="dot" style="background:#ff9500"></span>提交 <strong>${totalSubmit}</strong></div>\n <div class="item"><span class="dot" style="background:#34c759"></span>正确 <strong>${totalAC}</strong></div>`;
                const statsBar = document.createElement('div'); statsBar.id='submission-ios-stats';
                statsBar.innerHTML = `\n <div class="stat">合计 ${totalSubmit} 次</div>\n <div class="stat">通过 ${totalAC} 次</div>\n <div class="stat rate">通过率 ${acRate}%</div>`;
                wrap.appendChild(legend);
                wrap.appendChild(statsBar);

                // Tooltip
                let tooltip = document.getElementById('submission-tooltip-ios');
                if(!tooltip){ tooltip = document.createElement('div'); tooltip.id='submission-tooltip-ios'; container.parentElement.appendChild(tooltip); }
                $(container).off('plothover.zzuli').on('plothover.zzuli', function (e,pos,item){
                    if(item){
                        const date = new Date(item.datapoint[0]);
                        const dStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
                        tooltip.innerHTML = `<strong>${item.series.label}</strong><br>${dStr}: ${item.datapoint[1]}`;
                        const rect = container.getBoundingClientRect();
                        tooltip.style.left = (pos.pageX - rect.left + 12) + 'px';
                        tooltip.style.top = (pos.pageY - rect.top - 38) + 'px';
                        tooltip.style.display = 'block';
                    } else {
                        tooltip.style.display = 'none';
                    }
                });

                container.dataset.zzuliChartUpgraded = '1';
            } catch(err){ console.warn('[zzuli-ios] 图表增强失败', err); }
        }, 500);
    }
    /* ================= 图表修复结束 ================= */

    // 监听后续变化（若有异步加载）
    const observer = new MutationObserver(() => {
        if (!STATE.enabled) return;
        // 保留位置，后续可添加对动态节点的增强
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    // 初始化
    initialAdjust();
    applyTheme();
    updatePanelText();
    // 延迟执行题目增强与提交页增强与用户统计图增强
    setTimeout(()=>{ enhanceProblemPage(); enhanceSubmitPage(); enhanceUserInfoChart(); enhanceLegacyPieCharts(); },0);

    // ===== 补全提示后处理（拆分导入 / 来源 meta） =====
    const hintObserver = new MutationObserver((muts)=>{
        muts.forEach(m=>{
            if(!(m.addedNodes||m.removedNodes)) return;
            document.querySelectorAll('.CodeMirror-hints').forEach(ul=>{
                ul.querySelectorAll('li.CodeMirror-hint').forEach(li=>{
                    if(li.dataset.zzuliHintProcessed) return;
                    const txt = li.textContent || '';
                    // 匹配常见格式：identifier — source  / identifier - source / identifier · source / identifier (source)
                    let match, namePart, metaPart;
                    if((match = txt.match(/^(.+?)\s+[—\-·]\s+(.+?)$/))){
                        namePart = match[1]; metaPart = match[2];
                    } else if((match = txt.match(/^(.+?)\s+\(([^()]+)\)$/))){
                        namePart = match[1]; metaPart = match[2];
                    }
                    if(namePart && metaPart){
                        li.textContent = '';
                        const spanLeft = document.createElement('span'); spanLeft.textContent = namePart.trim();
                        const spanMeta = document.createElement('span'); spanMeta.textContent = metaPart.trim(); spanMeta.className='zzuli-hint-meta';
                        li.appendChild(spanLeft); li.appendChild(spanMeta);
                        li.dataset.zzuliHintProcessed = '1';
                    } else {
                        li.dataset.zzuliHintProcessed = '1';
                    }
                });
            });
        });
    });
    hintObserver.observe(document.body,{ childList:true, subtree:true });

    // 解析并重绘旧版 Pie 图
    function enhanceLegacyPieCharts(){
        const pieDivs = Array.from(document.querySelectorAll('#PieDiv'));
        if(!pieDivs.length) return;
        pieDivs.forEach(pieDiv => {
            const hostRow = pieDiv.closest('tr#pie') || pieDiv.closest('tr');
            if(!hostRow || pieDiv.dataset.zzuliPieUpgraded) return;

            const table = hostRow.closest('table');
            if(!table) return;
            const rows = Array.from(table.rows);
            const pieIndex = rows.indexOf(hostRow);
            if(pieIndex < 0) return;

            // 允许的判题项（中英文/简称）
            const VERDICT_ALLOW = [
                /^(正确|AC|Accepted)$/i,
                /^(答案错误|WA|Wrong\s*Answer)$/i,
                /^(编译错误|CE|Compile(ation)?\s*Error)$/i,
                /^(运行错误|RE|Runtime\s*Error)$/i,
                /^(时间超限|TLE|Time\s*Limit\s*Exceeded)$/i,
                /^(内存超限|MLE|Memory\s*Limit\s*Exceeded)$/i,
                /^(输出超限|OLE|Output\s*Limit\s*Exceeded)$/i,
                /^(格式错误|PE|Presentation\s*Error)$/i
            ];
            const EXCLUDE_KEYWORDS = /(名次|排名|比例|通过率|提交|解决|用户|统计|statistics)/i;

            const items = [];
            for(let i=0;i<pieIndex;i++){
                const tr = rows[i];
                const tds = tr?.cells || [];
                if(tds.length < 2) continue;
                // 跳过表头行（含 th）
                if(tr.querySelector('th')) continue;
                const nameRaw = (tds[0].innerText || tds[0].textContent || '').trim();
                if(!nameRaw) continue;
                if(EXCLUDE_KEYWORDS.test(nameRaw)) continue;
                const allowed = VERDICT_ALLOW.some(rx=> rx.test(nameRaw));
                if(!allowed) continue;
                const valText = (tds[1].innerText || tds[1].textContent || '').replace(/[^0-9]/g,'');
                if(!valText) continue;
                const val = parseInt(valText,10);
                if(!(val >= 0)) continue;
                items.push({ name: nameRaw, value: val });
            }
            if(!items.length) return;

            const total = items.reduce((s,it)=>s+it.value,0);
            if(total <= 0){ pieDiv.dataset.zzuliPieUpgraded = '1'; return; }

            // 使用原站色板（索引顺序）以确保认知稳定，添加渐变效果
            const colors = [];
            colors[0] = '#FF8080';
            colors[1] = '#8080FF';
            colors[2] = '#80bb80';
            colors[3] = '#FF0066';
            colors[4] = '#9900FF';
            colors[5] = '#996633';
            colors[6] = '#006633';
            colors[7] = '#000000';
            colors[8] = '#CCFFFF';
            colors[9] = '#0066FF';
            colors[10] = '#066600';
            colors[11] = '#666666';

            // 清空并构建容器（iOS 风格）
            pieDiv.classList.add('zzuli-pie-root');
            pieDiv.innerHTML = '';
            const wrap = document.createElement('div');
            wrap.className = 'zzuli-pie-wrap';
            const fig = document.createElement('div');
            fig.className = 'zzuli-pie-figure';
            const legend = document.createElement('div');
            legend.className = 'zzuli-pie-legend';
            wrap.appendChild(fig);
            wrap.appendChild(legend);
            pieDiv.appendChild(wrap);

            // 自动紧凑：窄单元格隐藏图例
            const cell = pieDiv.closest('td') || pieDiv;
            const w = Math.round((cell.getBoundingClientRect?.().width) || cell.clientWidth || 0);
            const isCompact = w && w <= 150;
            if(isCompact){
                wrap.classList.add('compact');
                fig.classList.add('compact');
            }

            // iOS 风格圆环 - 使用SVG path绘制扇形而不是圆环
            const size = isCompact ? 140 : 200;
            const cx = size / 2;
            const cy = size / 2;
            const radius = size * 0.35; // 外半径
            const innerRadius = size * 0.20; // 内半径（圆环）

            const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
            svg.setAttribute('width', String(size));
            svg.setAttribute('height', String(size));
            svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
            svg.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))';

            // 添加渐变定义
            const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
            items.forEach((it, idx) => {
                const gradId = `zzuli-pie-grad-${idx}-${Math.random().toString(36).substr(2,9)}`;
                const grad = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
                grad.setAttribute('id', gradId);
                grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
                grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '100%');

                const baseColor = colors[idx] || '#999';
                const stop1 = document.createElementNS('http://www.w3.org/2000/svg','stop');
                stop1.setAttribute('offset', '0%');
                stop1.setAttribute('stop-color', baseColor);
                stop1.setAttribute('stop-opacity', '1');

                const stop2 = document.createElementNS('http://www.w3.org/2000/svg','stop');
                stop2.setAttribute('offset', '100%');
                stop2.setAttribute('stop-color', baseColor);
                stop2.setAttribute('stop-opacity', '0.7');

                grad.appendChild(stop1);
                grad.appendChild(stop2);
                defs.appendChild(grad);
                it.gradId = gradId;
            });
            svg.appendChild(defs);

            const g = document.createElementNS('http://www.w3.org/2000/svg','g');
            g.setAttribute('transform', `translate(${cx},${cy})`);
            svg.appendChild(g);

            // 绘制扇形（带动画）
            let startAngle = -Math.PI / 2; // 从12点方向开始

            items.forEach((it, idx) => {
                const ratio = it.value / total;
                const angle = ratio * 2 * Math.PI;
                const endAngle = startAngle + angle;

                // 计算路径
                const x1 = Math.cos(startAngle) * radius;
                const y1 = Math.sin(startAngle) * radius;
                const x2 = Math.cos(endAngle) * radius;
                const y2 = Math.sin(endAngle) * radius;
                const x3 = Math.cos(endAngle) * innerRadius;
                const y3 = Math.sin(endAngle) * innerRadius;
                const x4 = Math.cos(startAngle) * innerRadius;
                const y4 = Math.sin(startAngle) * innerRadius;

                const largeArc = angle > Math.PI ? 1 : 0;

                // 创建扇形路径
                const path = document.createElementNS('http://www.w3.org/2000/svg','path');
                const d = [
                    `M ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                    `L ${x3} ${y3}`,
                    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
                    'Z'
                ].join(' ');

                path.setAttribute('d', d);
                path.setAttribute('fill', `url(#${it.gradId})`);
                path.setAttribute('stroke', 'rgba(255,255,255,0.3)');
                path.setAttribute('stroke-width', '1');
                path.classList.add('zzuli-pie-segment');

                // iOS 动画效果 - 逐个展开
                path.style.opacity = '0';
                path.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    path.style.transition = `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s`;
                    path.style.opacity = '1';
                    path.style.transform = 'scale(1)';
                }, 50);

                g.appendChild(path);

                // 计算标签位置（在扇形的中心）
                const midAngle = startAngle + angle / 2;
                const labelRadius = (radius + innerRadius) / 2;
                const labelX = Math.cos(midAngle) * labelRadius;
                const labelY = Math.sin(midAngle) * labelRadius;

                // 只在扇形足够大时显示标签
                const pct = Math.round(ratio * 100);
                if(pct >= 5 && !isCompact) {
                    const label = document.createElement('div');
                    label.className = 'zzuli-pie-label';
                    label.textContent = `${it.name}\n${pct}%`;
                    label.style.left = `${cx + labelX}px`;
                    label.style.top = `${cy + labelY}px`;
                    label.style.animationDelay = `${idx * 0.1 + 0.3}s`;
                    fig.appendChild(label);
                }

                startAngle = endAngle;
            });

            fig.appendChild(svg);

            // Legend（图例）
            if(!isCompact) {
                items.forEach((it, idx) => {
                    const pct = Math.round(100 * it.value / total);
                    const row = document.createElement('div');
                    row.className = 'item';
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(-10px)';
                    setTimeout(() => {
                        row.style.transition = `all 0.4s ease ${idx * 0.08 + 0.2}s`;
                        row.style.opacity = '1';
                        row.style.transform = 'translateX(0)';
                    }, 50);

                    const dot = document.createElement('span');
                    dot.className = 'dot';
                    dot.style.background = colors[idx] || '#999';

                    const text = document.createElement('span');
                    text.className = 'text';
                    text.textContent = `${it.name} ${pct}%`;

                    row.appendChild(dot);
                    row.appendChild(text);
                    legend.appendChild(row);
                });
            }

            pieDiv.dataset.zzuliPieUpgraded = '1';
        });
    }

})();

