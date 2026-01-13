// ==UserScript==
// @name         WordPress 后台管理助手
// @namespace    https://weiruan.com/
// @version      1.3.0
// @description  WordPress后台快捷管理工具：发布文章、查看访客数据、网站设置等
// @author       Weiruan
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562429/WordPress%20%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562429/WordPress%20%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置管理 ====================
    const Config = {
        get: (key, defaultValue = null) => {
            try {
                return GM_getValue(key, defaultValue);
            } catch(e) {
                const val = localStorage.getItem('wp_admin_' + key);
                return val ? JSON.parse(val) : defaultValue;
            }
        },
        set: (key, value) => {
            try {
                GM_setValue(key, value);
            } catch(e) {
                localStorage.setItem('wp_admin_' + key, JSON.stringify(value));
            }
        }
    };

    // ==================== 样式注入 ====================
    const styles = `
        /* ==================== CSS Reset for Panel ==================== */
        .wp-admin-panel *, .wp-admin-panel *::before, .wp-admin-panel *::after,
        .wp-admin-trigger *, .wp-config-overlay * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        /* ==================== CSS Variables ==================== */
        :root {
            --wp-primary: #0073aa;
            --wp-primary-dark: #005a87;
            --wp-success: #46b450;
            --wp-warning: #ffb900;
            --wp-danger: #dc3232;
            --wp-bg: #ffffff;
            --wp-bg-alt: #f6f7f7;
            --wp-text: #1e1e1e;
            --wp-text-light: #646970;
            --wp-border: #dcdcde;
            --wp-radius: 8px;
        }

        .wp-admin-panel.dark-theme {
            --wp-primary: #3582c4;
            --wp-bg: #1e1e1e;
            --wp-bg-alt: #2c2c2c;
            --wp-text: #ffffff;
            --wp-text-light: #a0a0a0;
            --wp-border: #3c3c3c;
        }

        /* ==================== Trigger Button ==================== */
        .wp-admin-trigger {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, var(--wp-primary) 0%, var(--wp-primary-dark) 100%);
            border-radius: 50%;
            cursor: pointer;
            z-index: 999998;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,115,170,0.4);
            transition: all 0.3s ease;
            border: none;
        }
        .wp-admin-trigger:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,115,170,0.5);
        }
        .wp-admin-trigger svg {
            width: 28px;
            height: 28px;
            fill: white;
        }

        /* ==================== Main Panel ==================== */
        .wp-admin-panel {
            position: fixed;
            right: 20px;
            bottom: 90px;
            width: 400px;
            max-height: 70vh;
            background: var(--wp-bg);
            border-radius: var(--wp-radius);
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 999999;
            display: none;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            color: var(--wp-text);
        }
        .wp-admin-panel.active {
            display: flex;
            animation: wpSlideIn 0.3s ease;
        }
        @keyframes wpSlideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* ==================== Panel Header ==================== */
        .wp-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            background: linear-gradient(135deg, var(--wp-primary) 0%, var(--wp-primary-dark) 100%);
            color: white;
            border-radius: var(--wp-radius) var(--wp-radius) 0 0;
        }
        .wp-panel-header h3 {
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .wp-panel-header h3 svg {
            width: 22px;
            height: 22px;
            fill: currentColor;
        }
        .wp-panel-header-actions {
            display: flex;
            gap: 6px;
        }
        .wp-panel-header-btn {
            width: 30px;
            height: 30px;
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: background 0.2s;
        }
        .wp-panel-header-btn:hover {
            background: rgba(255,255,255,0.3);
        }
        .wp-panel-header-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        /* ==================== Connection Status ==================== */
        .wp-connection-status {
            padding: 8px 16px;
            font-size: 12px;
            border-bottom: 1px solid var(--wp-border);
        }
        .wp-connection-status.connected {
            background: #d4edda;
            color: #155724;
        }
        .wp-connection-status.disconnected {
            background: #f8d7da;
            color: #721c24;
        }

        /* ==================== Tabs ==================== */
        .wp-panel-tabs {
            display: flex;
            background: var(--wp-bg-alt);
            border-bottom: 1px solid var(--wp-border);
        }
        .wp-panel-tab {
            flex: 1;
            padding: 10px 6px;
            text-align: center;
            cursor: pointer;
            border: none;
            background: transparent;
            color: var(--wp-text-light);
            font-size: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            transition: all 0.2s;
        }
        .wp-panel-tab:hover {
            background: var(--wp-bg);
            color: var(--wp-primary);
        }
        .wp-panel-tab.active {
            background: var(--wp-bg);
            color: var(--wp-primary);
            box-shadow: inset 0 -2px 0 var(--wp-primary);
        }
        .wp-panel-tab svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        /* ==================== Content Area ==================== */
        .wp-panel-content {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            max-height: calc(70vh - 140px);
        }
        .wp-panel-section {
            display: none;
        }
        .wp-panel-section.active {
            display: block;
        }

        /* ==================== Form Elements ==================== */
        .wp-form-group {
            margin-bottom: 14px;
        }
        .wp-form-label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: var(--wp-text);
            font-size: 13px;
        }
        .wp-form-input,
        .wp-form-select,
        .wp-form-textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--wp-border);
            border-radius: 6px;
            font-size: 14px;
            background: var(--wp-bg);
            color: var(--wp-text);
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .wp-form-input:focus,
        .wp-form-select:focus,
        .wp-form-textarea:focus {
            outline: none;
            border-color: var(--wp-primary);
            box-shadow: 0 0 0 3px rgba(0,115,170,0.1);
        }
        .wp-form-textarea {
            min-height: 100px;
            resize: vertical;
        }

        /* ==================== Editor ==================== */
        .wp-editor-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            padding: 8px;
            background: var(--wp-bg-alt);
            border: 1px solid var(--wp-border);
            border-bottom: none;
            border-radius: 6px 6px 0 0;
        }
        .wp-editor-btn {
            width: 30px;
            height: 30px;
            border: none;
            background: var(--wp-bg);
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--wp-text);
            transition: all 0.2s;
        }
        .wp-editor-btn:hover {
            background: var(--wp-primary);
            color: white;
        }
        .wp-editor-btn svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }
        .wp-editor-content {
            min-height: 150px;
            max-height: 200px;
            overflow-y: auto;
            padding: 12px;
            border: 1px solid var(--wp-border);
            border-radius: 0 0 6px 6px;
            background: var(--wp-bg);
            outline: none;
        }
        .wp-editor-content:focus {
            border-color: var(--wp-primary);
        }
        .wp-editor-content:empty:before {
            content: attr(data-placeholder);
            color: var(--wp-text-light);
        }

        /* ==================== Buttons ==================== */
        .wp-btn {
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.2s;
        }
        .wp-btn-primary {
            background: var(--wp-primary);
            color: white;
        }
        .wp-btn-primary:hover {
            background: var(--wp-primary-dark);
        }
        .wp-btn-primary:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .wp-btn-secondary {
            background: var(--wp-bg-alt);
            color: var(--wp-text);
            border: 1px solid var(--wp-border);
        }
        .wp-btn-secondary:hover {
            background: var(--wp-border);
        }
        .wp-btn-danger {
            background: var(--wp-danger);
            color: white;
        }
        .wp-btn-block {
            width: 100%;
        }
        .wp-btn-group {
            display: flex;
            gap: 8px;
        }
        .wp-btn svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        /* ==================== Stats Grid ==================== */
        .wp-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 16px;
        }
        .wp-stat-card {
            padding: 14px;
            background: var(--wp-bg-alt);
            border-radius: 8px;
            text-align: center;
        }
        .wp-stat-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--wp-primary);
            margin-bottom: 4px;
        }
        .wp-stat-label {
            font-size: 11px;
            color: var(--wp-text-light);
        }

        /* ==================== List Items ==================== */
        .wp-list-item {
            padding: 10px;
            border-bottom: 1px solid var(--wp-border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }
        .wp-list-item:last-child {
            border-bottom: none;
        }
        .wp-list-item-title {
            font-weight: 500;
            font-size: 13px;
            margin-bottom: 2px;
        }
        .wp-list-item-meta {
            font-size: 11px;
            color: var(--wp-text-light);
        }

        /* ==================== Post Items ==================== */
        .wp-post-item {
            padding: 12px;
            border: 1px solid var(--wp-border);
            border-radius: 6px;
            margin-bottom: 8px;
            background: var(--wp-bg);
        }
        .wp-post-item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 6px;
            gap: 8px;
        }
        .wp-post-item-title {
            font-weight: 600;
            font-size: 13px;
            color: var(--wp-text);
            flex: 1;
            line-height: 1.4;
        }
        .wp-post-item-status {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            background: var(--wp-bg-alt);
            white-space: nowrap;
        }
        .wp-post-item-status.publish { background: #d4edda; color: #155724; }
        .wp-post-item-status.draft { background: #fff3cd; color: #856404; }
        .wp-post-item-actions {
            display: flex;
            gap: 6px;
            margin-top: 8px;
        }
        .wp-post-item-btn {
            padding: 4px 10px;
            font-size: 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: var(--wp-bg-alt);
            color: var(--wp-text);
            transition: all 0.2s;
        }
        .wp-post-item-btn:hover {
            background: var(--wp-border);
        }
        .wp-post-item-btn.wp-btn-danger {
            background: var(--wp-danger);
            color: white;
        }

        /* ==================== Settings ==================== */
        .wp-settings-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid var(--wp-border);
        }
        .wp-settings-item:last-child {
            border-bottom: none;
        }
        .wp-toggle {
            position: relative;
            width: 44px;
            height: 24px;
            background: var(--wp-border);
            border-radius: 12px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .wp-toggle.active {
            background: var(--wp-success);
        }
        .wp-toggle::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: transform 0.3s;
        }
        .wp-toggle.active::after {
            transform: translateX(20px);
        }

        /* ==================== Quick Actions ==================== */
        .wp-quick-actions {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }
        .wp-quick-action {
            padding: 14px 8px;
            background: var(--wp-bg-alt);
            border: 1px solid var(--wp-border);
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            color: var(--wp-text);
        }
        .wp-quick-action:hover {
            border-color: var(--wp-primary);
            transform: translateY(-2px);
        }
        .wp-quick-action svg {
            width: 22px;
            height: 22px;
            margin-bottom: 6px;
            fill: var(--wp-primary);
        }
        .wp-quick-action-label {
            font-size: 11px;
            font-weight: 500;
        }

        /* ==================== Charts ==================== */
        .wp-chart-container {
            padding: 14px;
            background: var(--wp-bg-alt);
            border-radius: 8px;
            margin-bottom: 14px;
        }
        .wp-chart-title {
            font-weight: 600;
            font-size: 13px;
            margin-bottom: 10px;
        }
        .wp-chart-bar {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            gap: 8px;
        }
        .wp-chart-bar-label {
            width: 70px;
            font-size: 11px;
            color: var(--wp-text-light);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .wp-chart-bar-track {
            flex: 1;
            height: 18px;
            background: var(--wp-bg);
            border-radius: 4px;
            overflow: hidden;
        }
        .wp-chart-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--wp-primary), #00a0d2);
            border-radius: 4px;
            transition: width 0.5s ease;
        }
        .wp-chart-bar-value {
            width: 45px;
            text-align: right;
            font-size: 11px;
            font-weight: 600;
        }

        /* ==================== Info Box ==================== */
        .wp-info-box {
            padding: 10px 12px;
            background: #e7f3ff;
            border: 1px solid #b3d7ff;
            border-radius: 6px;
            margin-bottom: 14px;
            font-size: 12px;
            color: #0056b3;
            line-height: 1.5;
        }

        /* ==================== Empty State ==================== */
        .wp-empty {
            text-align: center;
            padding: 30px 16px;
            color: var(--wp-text-light);
        }
        .wp-empty svg {
            width: 40px;
            height: 40px;
            margin-bottom: 10px;
            opacity: 0.5;
            fill: currentColor;
        }
        .wp-empty p {
            margin: 0;
            font-size: 13px;
        }

        /* ==================== Toast ==================== */
        .wp-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 18px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 1000000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: wpToastIn 0.3s ease;
            color: #333;
            font-size: 14px;
        }
        .wp-toast.success { border-left: 4px solid var(--wp-success); }
        .wp-toast.error { border-left: 4px solid var(--wp-danger); }
        .wp-toast.warning { border-left: 4px solid var(--wp-warning); }
        @keyframes wpToastIn {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }

        /* ==================== Loading ==================== */
        .wp-loading {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid var(--wp-border);
            border-top-color: var(--wp-primary);
            border-radius: 50%;
            animation: wpSpin 0.8s linear infinite;
        }
        @keyframes wpSpin {
            to { transform: rotate(360deg); }
        }

        /* ==================== Config Modal ==================== */
        .wp-config-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .wp-config-modal {
            width: 90%;
            max-width: 450px;
            background: white;
            border-radius: var(--wp-radius);
            padding: 20px;
            max-height: 80vh;
            overflow-y: auto;
            color: #333;
        }
        .wp-config-modal h3 {
            margin: 0 0 16px;
            font-size: 18px;
        }

        /* ==================== Section Titles ==================== */
        .wp-section-title {
            font-size: 13px;
            font-weight: 600;
            margin: 16px 0 10px;
            color: var(--wp-text);
        }
        .wp-section-title:first-child {
            margin-top: 0;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(styles);
    } else {
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    // ==================== 图标库 ====================
    const Icons = {
        wordpress: `<svg viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 19c-4.963 0-9-4.037-9-9s4.037-9 9-9 9 4.037 9 9-4.037 9-9 9z"/><path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/></svg>`,
        edit: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
        chart: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h2v8H3v-8zm4-6h2v14H7V7zm4 3h2v11h-2V10zm4-6h2v17h-2V4zm4 9h2v8h-2v-8z"/></svg>`,
        settings: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
        more: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>`,
        close: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
        config: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
        moon: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/></svg>`,
        bold: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>`,
        italic: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>`,
        underline: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>`,
        list: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>`,
        link: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`,
        image: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`,
        heading: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 4v3h5.5v12h3V7H19V4z"/></svg>`,
        quote: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>`,
        posts: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`,
        comments: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>`,
        users: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
        theme: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`,
        plugin: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/></svg>`,
        refresh: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
        view: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
        delete: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
        check: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
    };

    // ==================== API 封装 (使用 GM_xmlhttpRequest) ====================
    class WordPressAPI {
        constructor(siteUrl, username = '', appPassword = '') {
            this.siteUrl = siteUrl.replace(/\/$/, '');
            this.apiBase = `${this.siteUrl}/wp-json/wp/v2`;
            this.username = username;
            this.appPassword = appPassword;
            this.useRestRoute = false; // 某些站点需要使用 ?rest_route= 格式
        }

        // 使用 GM_xmlhttpRequest 进行跨域请求
        request(endpoint, options = {}) {
            return new Promise((resolve, reject) => {
                const url = endpoint.startsWith('http') ? endpoint : `${this.apiBase}${endpoint}`;
                const method = options.method || 'GET';
                const headers = {
                    'Content-Type': 'application/json',
                    ...options.headers
                };

                // 添加认证头
                if (this.username && this.appPassword) {
                    // 应用密码可能包含空格，需要保留
                    const credentials = `${this.username}:${this.appPassword}`;
                    const auth = btoa(unescape(encodeURIComponent(credentials)));
                    headers['Authorization'] = `Basic ${auth}`;
                    console.log('[WP Admin] 认证用户:', this.username, '| 密码长度:', this.appPassword.length);
                } else {
                    console.warn('[WP Admin] 警告: 未设置认证信息! username:', !!this.username, 'appPassword:', !!this.appPassword);
                }

                console.log('[WP Admin] 请求:', method, url);
                console.log('[WP Admin] 有Authorization头:', 'Authorization' in headers);

                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    headers: headers,
                    data: options.body || null,
                    onload: (response) => {
                        console.log('[WP Admin] 响应:', response.status, response.finalUrl || url);
                        if (response.status === 401 || response.status === 403) {
                            console.error('[WP Admin] 认证失败! 请检查用户名和应用密码');
                        }
                        try {
                            if (response.status >= 200 && response.status < 300) {
                                // 检查是否是JSON
                                const contentType = response.responseHeaders?.toLowerCase() || '';
                                if (response.responseText.trim().startsWith('<')) {
                                    console.error('[WP Admin] 返回了HTML而非JSON:', response.responseText.substring(0, 200));
                                    reject(new Error('服务器返回HTML而非JSON，URL可能不正确: ' + url));
                                    return;
                                }
                                const data = JSON.parse(response.responseText);
                                resolve(data);
                            } else {
                                let errorMsg = `HTTP ${response.status}`;
                                let errorCode = '';
                                try {
                                    const errData = JSON.parse(response.responseText);
                                    errorMsg = errData.message || errorMsg;
                                    errorCode = errData.code || '';
                                    console.error('[WP Admin] API错误:', errData);
                                } catch(e) {
                                    // 如果不是JSON，可能是HTML错误页
                                    if (response.responseText.includes('<')) {
                                        errorMsg += ' (返回了HTML页面)';
                                    }
                                }
                                // 特殊处理认证错误
                                if (errorCode === 'rest_cannot_create' || errorCode === 'rest_cannot_edit') {
                                    errorMsg += '\n\n请检查：\n1. 用户名是否正确\n2. 应用密码是否有效\n3. 用户是否有发布权限';
                                }
                                reject(new Error(errorMsg));
                            }
                        } catch (e) {
                            reject(new Error('解析响应失败: ' + e.message + ' | URL: ' + url));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error('网络请求失败，请检查站点地址是否正确'));
                    },
                    ontimeout: () => {
                        reject(new Error('请求超时'));
                    }
                });
            });
        }

        // 测试连接 - 尝试多个端点
        async testConnection() {
            const endpoints = [
                `${this.siteUrl}/wp-json/wp/v2/posts?per_page=1`,
                `${this.siteUrl}/wp-json`,
                `${this.siteUrl}/index.php?rest_route=/wp/v2/posts&per_page=1`,
                `${this.siteUrl}/?rest_route=/wp/v2/posts&per_page=1`,
                `${this.siteUrl}/index.php?rest_route=/`,
                `${this.siteUrl}/?rest_route=/`
            ];

            for (const endpoint of endpoints) {
                try {
                    console.log('[WP Admin] 测试端点:', endpoint);
                    const result = await this.request(endpoint);
                    // 检测是否是WordPress REST API响应
                    if (result && (Array.isArray(result) || result.name || result.namespaces)) {
                        // 检测使用的模式
                        if (endpoint.includes('index.php?rest_route')) {
                            this.useRestRoute = true;
                            this.restRoutePrefix = '/index.php';
                            console.log('[WP Admin] 使用 index.php?rest_route 模式');
                        } else if (endpoint.includes('?rest_route')) {
                            this.useRestRoute = true;
                            this.restRoutePrefix = '';
                            console.log('[WP Admin] 使用 ?rest_route 模式');
                        } else {
                            this.useRestRoute = false;
                            console.log('[WP Admin] 使用标准 /wp-json 模式');
                        }

                        // 尝试获取当前用户信息
                        try {
                            const user = await this.getCurrentUser();
                            if (user && user.id) {
                                this.currentUserId = user.id;
                                console.log('[WP Admin] 当前用户ID:', user.id, '用户名:', user.name);
                            }
                        } catch (userError) {
                            console.log('[WP Admin] 无法获取用户信息（可能需要认证）:', userError.message);
                        }

                        return { success: true };
                    }
                } catch (error) {
                    console.log('[WP Admin] 端点失败:', endpoint, error.message);
                    continue;
                }
            }

            return {
                success: false,
                error: 'REST API不可用。请检查：\n1. 站点地址是否正确\n2. WordPress版本是否≥4.7\n3. REST API是否被插件禁用\n4. 是否有插件干扰首页输出'
            };
        }

        // 构建API URL
        buildUrl(endpoint) {
            // 移除开头的 /wp/v2 如果存在
            const cleanEndpoint = endpoint.replace(/^\/wp\/v2/, '');
            let finalUrl;

            if (this.useRestRoute) {
                const prefix = this.restRoutePrefix || '';
                // 使用 ?rest_route= 格式
                // 需要处理查询参数：/posts?per_page=10 -> rest_route=/wp/v2/posts&per_page=10
                if (cleanEndpoint.includes('?')) {
                    const [path, query] = cleanEndpoint.split('?');
                    finalUrl = `${this.siteUrl}${prefix}?rest_route=/wp/v2${path}&${query}`;
                } else {
                    finalUrl = `${this.siteUrl}${prefix}?rest_route=/wp/v2${cleanEndpoint}`;
                }
            } else {
                finalUrl = `${this.apiBase}${cleanEndpoint}`;
            }

            console.log('[WP Admin] buildUrl:', endpoint, '->', finalUrl, '| useRestRoute:', this.useRestRoute);
            return finalUrl;
        }

        // 文章相关
        async getPosts(params = {}) {
            const query = new URLSearchParams({ per_page: 10, ...params }).toString();
            return this.request(this.buildUrl(`/wp/v2/posts?${query}`));
        }

        async createPost(data) {
            return this.request(this.buildUrl('/wp/v2/posts'), {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }

        async updatePost(id, data) {
            return this.request(this.buildUrl(`/wp/v2/posts/${id}`), {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }

        async deletePost(id) {
            return this.request(this.buildUrl(`/wp/v2/posts/${id}?force=true`), {
                method: 'DELETE'
            });
        }

        // 分类和标签
        async getCategories() {
            return this.request(this.buildUrl('/wp/v2/categories?per_page=100'));
        }

        async getTags() {
            return this.request(this.buildUrl('/wp/v2/tags?per_page=100'));
        }

        // 评论
        async getComments(params = {}) {
            const query = new URLSearchParams({ per_page: 10, ...params }).toString();
            return this.request(this.buildUrl(`/wp/v2/comments?${query}`));
        }

        // 用户信息
        async getCurrentUser() {
            return this.request(this.buildUrl('/wp/v2/users/me'));
        }

        // 获取当前用户ID（带缓存）
        async getCurrentUserId() {
            if (this.currentUserId) return this.currentUserId;
            try {
                const user = await this.getCurrentUser();
                this.currentUserId = user.id;
                return user.id;
            } catch (e) {
                console.error('[WP Admin] 获取用户ID失败:', e);
                return null;
            }
        }

        // 站点信息
        async getSiteInfo() {
            return this.request(this.buildUrl('/'));
        }

        // 获取统计数据 - 基于文章数据
        async getStats() {
            try {
                // 获取所有已发布文章
                const allPosts = await this.request(this.buildUrl('/wp/v2/posts?per_page=100&status=publish'));
                const totalPosts = allPosts.length;

                // 计算时间范围内的文章
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

                let todayPosts = 0, weekPosts = 0, monthPosts = 0;
                const postStats = [];

                allPosts.forEach(post => {
                    const postDate = new Date(post.date);
                    if (postDate >= today) todayPosts++;
                    if (postDate >= weekAgo) weekPosts++;
                    if (postDate >= monthAgo) monthPosts++;

                    postStats.push({
                        id: post.id,
                        title: post.title.rendered.replace(/<[^>]*>/g, ''),
                        date: post.date,
                        link: post.link,
                        views: post.post_views_count || post.views || 0 // Post Views Counter 插件
                    });
                });

                // 获取评论数
                const comments = await this.request(this.buildUrl('/wp/v2/comments?per_page=100'));
                const totalComments = comments.length;

                return {
                    posts: {
                        total: totalPosts,
                        today: todayPosts,
                        week: weekPosts,
                        month: monthPosts
                    },
                    comments: totalComments,
                    recentPosts: postStats.slice(0, 5),
                    popularPosts: [...postStats].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)
                };
            } catch (error) {
                console.error('获取统计失败:', error);
                throw error;
            }
        }

        // 尝试获取访客统计数据
        async getVisitorStats() {
            const result = {
                available: false,
                plugin: null,
                today: 0,
                week: 0,
                month: 0,
                total: 0,
                visitors: { today: 0, total: 0 }
            };

            // 尝试 WP Statistics 插件
            try {
                const wpStatsUrl = this.useRestRoute
                    ? `${this.siteUrl}${this.restRoutePrefix || ''}?rest_route=/wp-statistics/v2/hit`
                    : `${this.siteUrl}/wp-json/wp-statistics/v2/hit`;
                const wpStats = await this.request(wpStatsUrl);
                if (wpStats) {
                    result.available = true;
                    result.plugin = 'WP Statistics';
                    console.log('[WP Admin] WP Statistics 数据:', wpStats);
                    return result;
                }
            } catch (e) {
                console.log('[WP Admin] WP Statistics 不可用');
            }

            // 尝试 Jetpack Stats
            try {
                const jetpackUrl = this.useRestRoute
                    ? `${this.siteUrl}${this.restRoutePrefix || ''}?rest_route=/jetpack/v4/module/stats`
                    : `${this.siteUrl}/wp-json/jetpack/v4/module/stats`;
                const jetpack = await this.request(jetpackUrl);
                if (jetpack) {
                    result.available = true;
                    result.plugin = 'Jetpack Stats';
                    console.log('[WP Admin] Jetpack Stats 数据:', jetpack);
                    return result;
                }
            } catch (e) {
                console.log('[WP Admin] Jetpack Stats 不可用');
            }

            // 尝试 Koko Analytics
            try {
                const kokoUrl = this.useRestRoute
                    ? `${this.siteUrl}${this.restRoutePrefix || ''}?rest_route=/koko-analytics/v1/stats`
                    : `${this.siteUrl}/wp-json/koko-analytics/v1/stats`;
                const koko = await this.request(kokoUrl);
                if (koko) {
                    result.available = true;
                    result.plugin = 'Koko Analytics';
                    result.today = koko.pageviews?.today || 0;
                    result.total = koko.pageviews?.total || 0;
                    result.visitors.today = koko.visitors?.today || 0;
                    result.visitors.total = koko.visitors?.total || 0;
                    console.log('[WP Admin] Koko Analytics 数据:', koko);
                    return result;
                }
            } catch (e) {
                console.log('[WP Admin] Koko Analytics 不可用');
            }

            // 尝试自定义统计端点 (通用格式)
            try {
                const customUrl = this.useRestRoute
                    ? `${this.siteUrl}${this.restRoutePrefix || ''}?rest_route=/wp-site-stats/v1/stats`
                    : `${this.siteUrl}/wp-json/wp-site-stats/v1/stats`;
                const custom = await this.request(customUrl);
                if (custom) {
                    result.available = true;
                    result.plugin = 'Site Stats';
                    result.today = custom.views?.today || custom.today || 0;
                    result.week = custom.views?.week || custom.week || 0;
                    result.month = custom.views?.month || custom.month || 0;
                    result.total = custom.views?.total || custom.total || 0;
                    return result;
                }
            } catch (e) {
                console.log('[WP Admin] 自定义统计端点不可用');
            }

            // 尝试从文章中提取 Post Views Counter 数据
            try {
                const posts = await this.request(this.buildUrl('/wp/v2/posts?per_page=100&status=publish'));
                let totalViews = 0;
                let hasViewsData = false;

                posts.forEach(post => {
                    const views = post.post_views_count || post.views || post.meta?.post_views_count || 0;
                    if (views > 0) {
                        hasViewsData = true;
                        totalViews += parseInt(views) || 0;
                    }
                });

                if (hasViewsData) {
                    result.available = true;
                    result.plugin = 'Post Views Counter';
                    result.total = totalViews;
                    // 估算其他数据（无法精确获取）
                    result.today = Math.round(totalViews / 100) || 0;
                    result.week = Math.round(totalViews / 15) || 0;
                    result.month = Math.round(totalViews / 4) || 0;
                    return result;
                }
            } catch (e) {
                console.log('[WP Admin] Post Views Counter 不可用');
            }

            return result;
        }
    }

    // ==================== 主应用 ====================
    class WPAdminPanel {
        constructor() {
            this.api = null;
            this.siteUrl = Config.get('siteUrl', '');
            this.username = Config.get('username', '');
            this.appPassword = Config.get('appPassword', '');
            this.darkMode = Config.get('darkMode', false);
            this.connected = false;
            this.categories = [];
            this.init();
        }

        init() {
            this.createUI();
            this.bindEvents();
            this.registerMenuCommand();

            console.log('[WP Admin] 初始化 - siteUrl:', this.siteUrl, 'username:', this.username, 'hasPassword:', !!this.appPassword);

            if (this.siteUrl && this.username && this.appPassword) {
                this.api = new WordPressAPI(this.siteUrl, this.username, this.appPassword);
                // 恢复保存的useRestRoute状态
                this.api.useRestRoute = Config.get('useRestRoute', false);
                this.api.restRoutePrefix = Config.get('restRoutePrefix', '');
                console.log('[WP Admin] API已创建 - useRestRoute:', this.api.useRestRoute);
                this.testAndLoad();
            }
        }

        async testAndLoad() {
            // 重新测试连接，确保useRestRoute状态正确
            const result = await this.api.testConnection();
            this.connected = result.success;
            // 保存检测到的模式
            if (this.connected) {
                Config.set('useRestRoute', this.api.useRestRoute);
            }
            this.updateConnectionStatus();
            if (this.connected) {
                this.loadInitialData();
            }
        }

        updateConnectionStatus() {
            const statusEl = this.panel.querySelector('#wp-connection-status');
            if (statusEl) {
                if (this.connected) {
                    statusEl.className = 'wp-connection-status connected';
                    statusEl.textContent = '✓ 已连接到 ' + this.siteUrl;
                } else {
                    statusEl.className = 'wp-connection-status disconnected';
                    statusEl.textContent = '✗ 未连接 - 请配置站点';
                }
            }
        }

        registerMenuCommand() {
            if (typeof GM_registerMenuCommand !== 'undefined') {
                GM_registerMenuCommand('配置WordPress站点', () => this.showConfigModal());
                GM_registerMenuCommand('发布新文章', () => this.openPanel('publish'));
                GM_registerMenuCommand('查看统计', () => this.openPanel('stats'));
            }
        }

        createUI() {
            const trigger = document.createElement('button');
            trigger.className = 'wp-admin-trigger';
            trigger.innerHTML = Icons.wordpress;
            trigger.title = 'WordPress 管理助手';
            document.body.appendChild(trigger);
            this.trigger = trigger;

            const panel = document.createElement('div');
            panel.className = `wp-admin-panel ${this.darkMode ? 'dark-theme' : ''}`;
            panel.innerHTML = this.getPanelHTML();
            document.body.appendChild(panel);
            this.panel = panel;
        }

        getPanelHTML() {
            return `
                <div class="wp-panel-header">
                    <h3>${Icons.wordpress} WP管理助手</h3>
                    <div class="wp-panel-header-actions">
                        <button class="wp-panel-header-btn" id="wp-toggle-theme" title="切换主题">${Icons.moon}</button>
                        <button class="wp-panel-header-btn" id="wp-config-btn" title="配置">${Icons.config}</button>
                        <button class="wp-panel-header-btn" id="wp-close-btn" title="关闭">${Icons.close}</button>
                    </div>
                </div>

                <div id="wp-connection-status" class="wp-connection-status disconnected">✗ 未连接 - 请配置站点</div>

                <div class="wp-panel-tabs">
                    <button class="wp-panel-tab active" data-tab="publish">${Icons.edit}<span>发布</span></button>
                    <button class="wp-panel-tab" data-tab="stats">${Icons.chart}<span>统计</span></button>
                    <button class="wp-panel-tab" data-tab="settings">${Icons.settings}<span>设置</span></button>
                    <button class="wp-panel-tab" data-tab="more">${Icons.more}<span>更多</span></button>
                </div>

                <div class="wp-panel-content">
                    <div class="wp-panel-section active" id="section-publish">${this.getPublishHTML()}</div>
                    <div class="wp-panel-section" id="section-stats">${this.getStatsHTML()}</div>
                    <div class="wp-panel-section" id="section-settings">${this.getSettingsHTML()}</div>
                    <div class="wp-panel-section" id="section-more">${this.getMoreHTML()}</div>
                </div>
            `;
        }

        getPublishHTML() {
            return `
                <div class="wp-form-group">
                    <label class="wp-form-label">文章标题</label>
                    <input type="text" class="wp-form-input" id="wp-post-title" placeholder="输入文章标题...">
                </div>
                <div class="wp-form-group">
                    <label class="wp-form-label">文章内容</label>
                    <div class="wp-editor-toolbar">
                        <button class="wp-editor-btn" data-cmd="bold" title="粗体">${Icons.bold}</button>
                        <button class="wp-editor-btn" data-cmd="italic" title="斜体">${Icons.italic}</button>
                        <button class="wp-editor-btn" data-cmd="underline" title="下划线">${Icons.underline}</button>
                        <button class="wp-editor-btn" data-cmd="insertUnorderedList" title="列表">${Icons.list}</button>
                        <button class="wp-editor-btn" data-cmd="formatBlock:H2" title="标题">${Icons.heading}</button>
                        <button class="wp-editor-btn" data-cmd="formatBlock:BLOCKQUOTE" title="引用">${Icons.quote}</button>
                        <button class="wp-editor-btn" data-cmd="createLink" title="链接">${Icons.link}</button>
                        <button class="wp-editor-btn" id="wp-insert-image" title="图片">${Icons.image}</button>
                    </div>
                    <div class="wp-editor-content" id="wp-post-content" contenteditable="true" data-placeholder="开始写作..."></div>
                </div>
                <div class="wp-form-group">
                    <label class="wp-form-label">分类目录</label>
                    <select class="wp-form-select" id="wp-post-category"><option value="">选择分类...</option></select>
                </div>
                <div class="wp-form-group">
                    <label class="wp-form-label">标签</label>
                    <input type="text" class="wp-form-input" id="wp-post-tags" placeholder="用逗号分隔多个标签">
                </div>
                <div class="wp-form-group">
                    <label class="wp-form-label">文章状态</label>
                    <select class="wp-form-select" id="wp-post-status">
                        <option value="publish">立即发布</option>
                        <option value="draft">保存草稿</option>
                        <option value="pending">待审核</option>
                    </select>
                </div>
                <div class="wp-btn-group">
                    <button class="wp-btn wp-btn-primary wp-btn-block" id="wp-publish-btn">发布文章</button>
                </div>
                <h4 class="wp-section-title">最近文章</h4>
                <div id="wp-recent-posts"><div class="wp-empty">${Icons.posts}<p>请先配置站点</p></div></div>
            `;
        }

        getStatsHTML() {
            return `
                <div class="wp-info-box" id="wp-stats-info">正在检测统计插件...</div>
                <h4 class="wp-section-title">访问统计</h4>
                <div class="wp-stats-grid" id="wp-visitor-stats">
                    <div class="wp-stat-card">
                        <div class="wp-stat-value" id="stat-today-views">--</div>
                        <div class="wp-stat-label">今日访问</div>
                    </div>
                    <div class="wp-stat-card">
                        <div class="wp-stat-value" id="stat-week-views">--</div>
                        <div class="wp-stat-label">本周访问</div>
                    </div>
                    <div class="wp-stat-card">
                        <div class="wp-stat-value" id="stat-month-views">--</div>
                        <div class="wp-stat-label">本月访问</div>
                    </div>
                    <div class="wp-stat-card">
                        <div class="wp-stat-value" id="stat-total-views">--</div>
                        <div class="wp-stat-label">总访问量</div>
                    </div>
                </div>
                <h4 class="wp-section-title">内容统计</h4>
                <div class="wp-stats-grid" id="wp-stats-overview">
                    <div class="wp-stat-card">
                        <div class="wp-stat-value" id="stat-total-posts">--</div>
                        <div class="wp-stat-label">总文章数</div>
                    </div>
                    <div class="wp-stat-card">
                        <div class="wp-stat-value" id="stat-month-posts">--</div>
                        <div class="wp-stat-label">本月发布</div>
                    </div>
                    <div class="wp-stat-card">
                        <div class="wp-stat-value" id="stat-week-posts">--</div>
                        <div class="wp-stat-label">本周发布</div>
                    </div>
                    <div class="wp-stat-card">
                        <div class="wp-stat-value" id="stat-comments">--</div>
                        <div class="wp-stat-label">总评论数</div>
                    </div>
                </div>
                <div class="wp-chart-container">
                    <div class="wp-chart-title">热门文章 (按访问量)</div>
                    <div id="wp-popular-posts"><div class="wp-empty">暂无数据</div></div>
                </div>
                <div class="wp-chart-container">
                    <div class="wp-chart-title">最近文章</div>
                    <div id="wp-recent-posts-stats"><div class="wp-empty">暂无数据</div></div>
                </div>
                <button class="wp-btn wp-btn-secondary wp-btn-block" id="wp-refresh-stats">${Icons.refresh} 刷新数据</button>
            `;
        }

        getSettingsHTML() {
            return `
                <div class="wp-settings-item">
                    <div>
                        <div class="wp-list-item-title">站点地址</div>
                        <div class="wp-list-item-meta" id="wp-site-url-display">${this.siteUrl || '未配置'}</div>
                    </div>
                    <button class="wp-btn wp-btn-secondary" id="wp-edit-config">配置</button>
                </div>
                <div class="wp-settings-item">
                    <div>
                        <div class="wp-list-item-title">深色模式</div>
                        <div class="wp-list-item-meta">切换面板主题</div>
                    </div>
                    <div class="wp-toggle ${this.darkMode ? 'active' : ''}" id="wp-dark-toggle"></div>
                </div>
                <h4 class="wp-section-title">快捷链接</h4>
                <div class="wp-quick-actions" id="wp-quick-links">
                    <a class="wp-quick-action" href="#" data-link="wp-admin">${Icons.settings}<div class="wp-quick-action-label">仪表盘</div></a>
                    <a class="wp-quick-action" href="#" data-link="wp-admin/edit.php">${Icons.posts}<div class="wp-quick-action-label">所有文章</div></a>
                    <a class="wp-quick-action" href="#" data-link="wp-admin/edit-comments.php">${Icons.comments}<div class="wp-quick-action-label">评论</div></a>
                    <a class="wp-quick-action" href="#" data-link="wp-admin/users.php">${Icons.users}<div class="wp-quick-action-label">用户</div></a>
                    <a class="wp-quick-action" href="#" data-link="wp-admin/themes.php">${Icons.theme}<div class="wp-quick-action-label">主题</div></a>
                    <a class="wp-quick-action" href="#" data-link="wp-admin/plugins.php">${Icons.plugin}<div class="wp-quick-action-label">插件</div></a>
                </div>
            `;
        }

        getMoreHTML() {
            return `
                <h4 class="wp-section-title" style="margin-top:0;">文章管理</h4>
                <div id="wp-posts-list"><div class="wp-empty">${Icons.posts}<p>请先配置站点</p></div></div>
                <h4 class="wp-section-title">最新评论</h4>
                <div id="wp-comments-list"><div class="wp-empty">${Icons.comments}<p>请先配置站点</p></div></div>
                <h4 class="wp-section-title">快捷操作</h4>
                <div class="wp-quick-actions">
                    <button class="wp-quick-action" id="wp-view-site">${Icons.view}<div class="wp-quick-action-label">查看网站</div></button>
                    <button class="wp-quick-action" id="wp-refresh-all">${Icons.refresh}<div class="wp-quick-action-label">刷新数据</div></button>
                </div>
            `;
        }

        bindEvents() {
            this.trigger.addEventListener('click', () => this.togglePanel());
            this.panel.querySelector('#wp-close-btn').addEventListener('click', () => this.closePanel());
            this.panel.querySelector('#wp-config-btn').addEventListener('click', () => this.showConfigModal());
            this.panel.querySelector('#wp-toggle-theme').addEventListener('click', () => this.toggleTheme());
            this.panel.querySelector('#wp-dark-toggle').addEventListener('click', () => this.toggleTheme());
            this.panel.querySelector('#wp-edit-config')?.addEventListener('click', () => this.showConfigModal());

            this.panel.querySelectorAll('.wp-panel-tab').forEach(tab => {
                tab.addEventListener('click', (e) => this.switchTab(e.currentTarget.dataset.tab));
            });

            this.panel.querySelectorAll('.wp-editor-btn[data-cmd]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const cmd = btn.dataset.cmd;
                    const editor = this.panel.querySelector('#wp-post-content');
                    editor.focus();
                    if (cmd.includes(':')) {
                        const [command, value] = cmd.split(':');
                        document.execCommand(command, false, value);
                    } else if (cmd === 'createLink') {
                        const url = prompt('输入链接地址:');
                        if (url) document.execCommand(cmd, false, url);
                    } else {
                        document.execCommand(cmd, false, null);
                    }
                });
            });

            this.panel.querySelector('#wp-insert-image').addEventListener('click', (e) => {
                e.preventDefault();
                const url = prompt('输入图片地址:');
                if (url) {
                    const editor = this.panel.querySelector('#wp-post-content');
                    editor.focus();
                    document.execCommand('insertImage', false, url);
                }
            });

            this.panel.querySelector('#wp-publish-btn').addEventListener('click', () => this.publishPost());
            this.panel.querySelector('#wp-refresh-stats').addEventListener('click', () => this.loadStats());
            this.panel.querySelector('#wp-refresh-all')?.addEventListener('click', () => this.loadMoreData());

            this.panel.querySelectorAll('[data-link]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const path = e.currentTarget.dataset.link;
                    if (this.siteUrl) {
                        window.open(`${this.siteUrl}/${path}`, '_blank');
                    } else {
                        this.showToast('请先配置站点地址', 'warning');
                    }
                });
            });

            this.panel.querySelector('#wp-view-site')?.addEventListener('click', () => {
                if (this.siteUrl) {
                    window.open(this.siteUrl, '_blank');
                } else {
                    this.showToast('请先配置站点地址', 'warning');
                }
            });

            document.addEventListener('click', (e) => {
                if (!this.panel.contains(e.target) && !this.trigger.contains(e.target) && this.panel.classList.contains('active')) {
                    if (e.target.closest('.wp-config-overlay')) return;
                    this.closePanel();
                }
            });
        }

        togglePanel() { this.panel.classList.toggle('active'); }
        closePanel() { this.panel.classList.remove('active'); }
        openPanel(tab = 'publish') {
            this.panel.classList.add('active');
            this.switchTab(tab);
        }

        switchTab(tabId) {
            this.panel.querySelectorAll('.wp-panel-tab').forEach(t => t.classList.remove('active'));
            this.panel.querySelectorAll('.wp-panel-section').forEach(s => s.classList.remove('active'));
            this.panel.querySelector(`.wp-panel-tab[data-tab="${tabId}"]`).classList.add('active');
            this.panel.querySelector(`#section-${tabId}`).classList.add('active');
            if (tabId === 'stats') this.loadStats();
            if (tabId === 'more') this.loadMoreData();
        }

        toggleTheme() {
            this.darkMode = !this.darkMode;
            this.panel.classList.toggle('dark-theme', this.darkMode);
            this.panel.querySelector('#wp-dark-toggle').classList.toggle('active', this.darkMode);
            Config.set('darkMode', this.darkMode);
        }

        showConfigModal() {
            const overlay = document.createElement('div');
            overlay.className = 'wp-config-overlay';
            overlay.innerHTML = `
                <div class="wp-config-modal">
                    <h3>配置WordPress站点</h3>
                    <div class="wp-info-box">
                        <strong>配置步骤：</strong><br>
                        1. 输入WordPress站点完整地址（如 https://example.com）<br>
                        2. 输入WordPress管理员用户名<br>
                        3. 在WordPress后台创建应用密码：<br>
                        &nbsp;&nbsp;&nbsp;用户 → 个人资料 → 应用程序密码<br>
                        4. 点击"测试连接"验证配置
                    </div>
                    <div class="wp-form-group">
                        <label class="wp-form-label">站点地址</label>
                        <input type="url" class="wp-form-input" id="wp-cfg-url" placeholder="https://your-site.com" value="${this.siteUrl}">
                    </div>
                    <div class="wp-form-group">
                        <label class="wp-form-label">用户名</label>
                        <input type="text" class="wp-form-input" id="wp-cfg-user" placeholder="WordPress用户名" value="${this.username}">
                    </div>
                    <div class="wp-form-group">
                        <label class="wp-form-label">应用密码</label>
                        <input type="password" class="wp-form-input" id="wp-cfg-pass" placeholder="应用程序密码 (带空格)" value="${this.appPassword}">
                        <small style="color:#666;font-size:12px;margin-top:4px;display:block;">格式如: xxxx xxxx xxxx xxxx xxxx xxxx</small>
                    </div>
                    <div class="wp-btn-group" style="margin-top: 20px;">
                        <button class="wp-btn wp-btn-secondary" id="wp-cfg-test">测试连接</button>
                        <button class="wp-btn wp-btn-secondary" id="wp-cfg-cancel">取消</button>
                        <button class="wp-btn wp-btn-primary" id="wp-cfg-save">保存</button>
                    </div>
                    <div id="wp-cfg-result" style="margin-top:12px;"></div>
                </div>
            `;
            document.body.appendChild(overlay);

            const testBtn = overlay.querySelector('#wp-cfg-test');
            const saveBtn = overlay.querySelector('#wp-cfg-save');
            const cancelBtn = overlay.querySelector('#wp-cfg-cancel');
            const resultDiv = overlay.querySelector('#wp-cfg-result');

            testBtn.addEventListener('click', async () => {
                const url = overlay.querySelector('#wp-cfg-url').value.trim().replace(/\/$/, '');
                const user = overlay.querySelector('#wp-cfg-user').value.trim();
                const pass = overlay.querySelector('#wp-cfg-pass').value.trim();

                if (!url) {
                    resultDiv.innerHTML = '<span style="color:red;">请输入站点地址</span>';
                    return;
                }

                // 验证URL格式
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    resultDiv.innerHTML = '<span style="color:red;">站点地址必须以 http:// 或 https:// 开头</span>';
                    return;
                }

                resultDiv.innerHTML = '<span class="wp-loading"></span> 测试连接中...';
                const testApi = new WordPressAPI(url, user, pass);
                const result = await testApi.testConnection();

                if (result.success) {
                    const mode = testApi.useRestRoute ? '(使用rest_route模式)' : '';
                    resultDiv.innerHTML = `<span style="color:green;">✓ 连接成功！${mode}</span>`;
                } else {
                    resultDiv.innerHTML = `<div style="color:red;">✗ 连接失败<br><small style="white-space:pre-wrap;">${result.error}</small></div>`;
                }
            });

            saveBtn.addEventListener('click', async () => {
                const url = overlay.querySelector('#wp-cfg-url').value.trim().replace(/\/$/, '');
                const user = overlay.querySelector('#wp-cfg-user').value.trim();
                const pass = overlay.querySelector('#wp-cfg-pass').value.trim();

                if (!url || !user || !pass) {
                    resultDiv.innerHTML = '<span style="color:red;">请填写所有字段</span>';
                    return;
                }

                resultDiv.innerHTML = '<span class="wp-loading"></span> 保存并测试中...';

                // 先测试连接
                const testApi = new WordPressAPI(url, user, pass);
                const result = await testApi.testConnection();

                if (!result.success) {
                    resultDiv.innerHTML = `<div style="color:red;">✗ 连接失败，无法保存<br><small>${result.error}</small></div>`;
                    return;
                }

                this.siteUrl = url;
                this.username = user;
                this.appPassword = pass;

                Config.set('siteUrl', this.siteUrl);
                Config.set('username', this.username);
                Config.set('appPassword', this.appPassword);
                Config.set('useRestRoute', testApi.useRestRoute);
                Config.set('restRoutePrefix', testApi.restRoutePrefix || '');

                // 使用已测试成功的API实例
                this.api = testApi;
                console.log('[WP Admin] 配置已保存 - API用户:', this.api.username, '有密码:', !!this.api.appPassword);
                this.connected = true;
                this.updateConnectionStatus();
                this.loadInitialData();

                this.panel.querySelector('#wp-site-url-display').textContent = this.siteUrl;
                this.showToast('配置已保存', 'success');
                overlay.remove();
            });

            cancelBtn.addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.remove();
            });
        }

        async loadInitialData() {
            if (!this.api || !this.connected) return;

            try {
                this.categories = await this.api.getCategories();
                const categorySelect = this.panel.querySelector('#wp-post-category');
                categorySelect.innerHTML = '<option value="">选择分类...</option>' +
                    this.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

                const posts = await this.api.getPosts({ per_page: 5 });
                this.renderRecentPosts(posts);
            } catch (error) {
                console.error('加载数据失败:', error);
                this.showToast('加载数据失败: ' + error.message, 'error');
            }
        }

        renderRecentPosts(posts) {
            const container = this.panel.querySelector('#wp-recent-posts');
            if (!posts || !posts.length) {
                container.innerHTML = `<div class="wp-empty">${Icons.posts}<p>暂无文章</p></div>`;
                return;
            }

            container.innerHTML = posts.map(post => `
                <div class="wp-post-item">
                    <div class="wp-post-item-header">
                        <div class="wp-post-item-title">${post.title.rendered || '无标题'}</div>
                        <span class="wp-post-item-status ${post.status}">${post.status === 'publish' ? '已发布' : '草稿'}</span>
                    </div>
                    <div class="wp-post-item-actions">
                        <button class="wp-post-item-btn wp-btn-secondary" onclick="window.open('${post.link}', '_blank')">查看</button>
                        <button class="wp-post-item-btn wp-btn-secondary" onclick="window.open('${this.siteUrl}/wp-admin/post.php?post=${post.id}&action=edit', '_blank')">编辑</button>
                    </div>
                </div>
            `).join('');
        }

        async publishPost() {
            if (!this.api || !this.connected) {
                this.showToast('请先配置并连接站点', 'warning');
                return;
            }

            const title = this.panel.querySelector('#wp-post-title').value.trim();
            const content = this.panel.querySelector('#wp-post-content').innerHTML;
            const category = this.panel.querySelector('#wp-post-category').value;
            const tags = this.panel.querySelector('#wp-post-tags').value;
            const status = this.panel.querySelector('#wp-post-status').value;

            if (!title) {
                this.showToast('请输入文章标题', 'warning');
                return;
            }

            if (!content || content === '<br>' || content.trim() === '') {
                this.showToast('请输入文章内容', 'warning');
                return;
            }

            const btn = this.panel.querySelector('#wp-publish-btn');
            btn.innerHTML = '<span class="wp-loading"></span> 发布中...';
            btn.disabled = true;

            try {
                const postData = {
                    title: title,
                    content: content,
                    status: status
                };

                // 尝试获取当前用户ID
                const authorId = this.api.currentUserId || await this.api.getCurrentUserId();
                if (authorId) {
                    postData.author = authorId;
                    console.log('[WP Admin] 使用作者ID:', authorId);
                } else {
                    console.log('[WP Admin] 未获取到用户ID，使用默认作者');
                }

                if (category) {
                    postData.categories = [parseInt(category)];
                }

                await this.api.createPost(postData);
                this.showToast('文章发布成功！', 'success');

                this.panel.querySelector('#wp-post-title').value = '';
                this.panel.querySelector('#wp-post-content').innerHTML = '';
                this.panel.querySelector('#wp-post-tags').value = '';

                const posts = await this.api.getPosts({ per_page: 5 });
                this.renderRecentPosts(posts);

            } catch (error) {
                this.showToast('发布失败: ' + error.message, 'error');
            } finally {
                btn.innerHTML = '发布文章';
                btn.disabled = false;
            }
        }

        async loadStats() {
            if (!this.api || !this.connected) {
                this.showToast('请先配置并连接站点', 'warning');
                return;
            }

            const infoBox = this.panel.querySelector('#wp-stats-info');
            infoBox.innerHTML = '正在加载统计数据...';

            try {
                // 并行加载文章统计和访客统计
                const [stats, visitorStats] = await Promise.all([
                    this.api.getStats(),
                    this.api.getVisitorStats()
                ]);

                // 更新文章统计
                this.panel.querySelector('#stat-total-posts').textContent = stats.posts.total;
                this.panel.querySelector('#stat-month-posts').textContent = stats.posts.month;
                this.panel.querySelector('#stat-week-posts').textContent = stats.posts.week;
                this.panel.querySelector('#stat-comments').textContent = stats.comments;

                // 更新访客统计
                if (visitorStats.available) {
                    infoBox.innerHTML = `使用 <strong>${visitorStats.plugin}</strong> 插件获取访客数据`;
                    infoBox.style.background = '#d4edda';
                    infoBox.style.borderColor = '#c3e6cb';
                    infoBox.style.color = '#155724';

                    this.panel.querySelector('#stat-today-views').textContent = this.formatNumber(visitorStats.today);
                    this.panel.querySelector('#stat-week-views').textContent = this.formatNumber(visitorStats.week);
                    this.panel.querySelector('#stat-month-views').textContent = this.formatNumber(visitorStats.month);
                    this.panel.querySelector('#stat-total-views').textContent = this.formatNumber(visitorStats.total);
                } else {
                    infoBox.innerHTML = `
                        <strong>未检测到访客统计插件</strong><br>
                        <small>建议安装以下插件之一来启用访客统计：<br>
                        • WP Statistics（推荐）<br>
                        • Jetpack Stats<br>
                        • Koko Analytics<br>
                        • Post Views Counter</small>
                    `;
                    infoBox.style.background = '#fff3cd';
                    infoBox.style.borderColor = '#ffc107';
                    infoBox.style.color = '#856404';

                    this.panel.querySelector('#stat-today-views').textContent = '--';
                    this.panel.querySelector('#stat-week-views').textContent = '--';
                    this.panel.querySelector('#stat-month-views').textContent = '--';
                    this.panel.querySelector('#stat-total-views').textContent = '--';
                }

                // 热门文章
                const popularContainer = this.panel.querySelector('#wp-popular-posts');
                if (stats.popularPosts && stats.popularPosts.length && stats.popularPosts.some(p => p.views > 0)) {
                    const maxViews = Math.max(...stats.popularPosts.map(p => p.views || 0));
                    popularContainer.innerHTML = stats.popularPosts.filter(p => p.views > 0).map(p => `
                        <div class="wp-chart-bar">
                            <div class="wp-chart-bar-label" title="${p.title}">${p.title.slice(0, 10)}${p.title.length > 10 ? '...' : ''}</div>
                            <div class="wp-chart-bar-track">
                                <div class="wp-chart-bar-fill" style="width: ${maxViews ? (p.views / maxViews * 100) : 0}%"></div>
                            </div>
                            <div class="wp-chart-bar-value">${this.formatNumber(p.views)}</div>
                        </div>
                    `).join('') || '<div class="wp-empty">暂无访问数据</div>';
                } else {
                    popularContainer.innerHTML = '<div class="wp-empty" style="padding:12px;font-size:12px;">暂无访问量数据（需安装统计插件）</div>';
                }

                // 最近文章
                const recentContainer = this.panel.querySelector('#wp-recent-posts-stats');
                if (stats.recentPosts && stats.recentPosts.length) {
                    recentContainer.innerHTML = stats.recentPosts.map(p => `
                        <div class="wp-list-item">
                            <div style="flex:1;overflow:hidden;">
                                <div class="wp-list-item-title" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</div>
                                <div class="wp-list-item-meta">${new Date(p.date).toLocaleDateString()}${p.views > 0 ? ` · ${this.formatNumber(p.views)} 次浏览` : ''}</div>
                            </div>
                            <a href="${p.link}" target="_blank" class="wp-btn wp-btn-secondary" style="padding:4px 8px;font-size:12px;">查看</a>
                        </div>
                    `).join('');
                } else {
                    recentContainer.innerHTML = '<div class="wp-empty">暂无文章</div>';
                }

            } catch (error) {
                console.error('加载统计失败:', error);
                infoBox.innerHTML = '加载统计数据失败';
                infoBox.style.background = '#f8d7da';
                infoBox.style.borderColor = '#f5c6cb';
                infoBox.style.color = '#721c24';
                this.showToast('加载统计失败: ' + error.message, 'error');
            }
        }

        formatNumber(num) {
            if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'k';
            }
            return num.toString();
        }

        async loadMoreData() {
            if (!this.api || !this.connected) return;

            try {
                const posts = await this.api.getPosts({ per_page: 10 });
                const postsContainer = this.panel.querySelector('#wp-posts-list');

                if (posts && posts.length) {
                    postsContainer.innerHTML = posts.map(post => `
                        <div class="wp-post-item">
                            <div class="wp-post-item-header">
                                <div class="wp-post-item-title">${post.title.rendered || '无标题'}</div>
                                <span class="wp-post-item-status ${post.status}">${post.status === 'publish' ? '已发布' : '草稿'}</span>
                            </div>
                            <div class="wp-list-item-meta">${new Date(post.date).toLocaleDateString()}</div>
                            <div class="wp-post-item-actions" style="margin-top: 8px;">
                                <button class="wp-post-item-btn wp-btn-secondary" onclick="window.open('${post.link}', '_blank')">查看</button>
                                <button class="wp-post-item-btn wp-btn-secondary" onclick="window.open('${this.siteUrl}/wp-admin/post.php?post=${post.id}&action=edit', '_blank')">编辑</button>
                                <button class="wp-post-item-btn wp-btn-danger" data-delete="${post.id}">删除</button>
                            </div>
                        </div>
                    `).join('');

                    postsContainer.querySelectorAll('[data-delete]').forEach(btn => {
                        btn.addEventListener('click', () => this.deletePost(btn.dataset.delete));
                    });
                } else {
                    postsContainer.innerHTML = `<div class="wp-empty">${Icons.posts}<p>暂无文章</p></div>`;
                }

                const comments = await this.api.getComments({ per_page: 5 });
                const commentsContainer = this.panel.querySelector('#wp-comments-list');

                if (comments && comments.length) {
                    commentsContainer.innerHTML = comments.map(comment => `
                        <div class="wp-list-item" style="flex-direction: column; align-items: flex-start;">
                            <div class="wp-list-item-title">${comment.author_name}</div>
                            <div class="wp-list-item-meta" style="margin-top: 4px;">${(comment.content.rendered || '').replace(/<[^>]*>/g, '').slice(0, 100)}...</div>
                        </div>
                    `).join('');
                } else {
                    commentsContainer.innerHTML = `<div class="wp-empty">${Icons.comments}<p>暂无评论</p></div>`;
                }

            } catch (error) {
                console.error('加载数据失败:', error);
            }
        }

        async deletePost(id) {
            if (!confirm('确定要删除这篇文章吗？此操作不可恢复！')) return;

            try {
                await this.api.deletePost(id);
                this.showToast('文章已删除', 'success');
                this.loadMoreData();
            } catch (error) {
                this.showToast('删除失败: ' + error.message, 'error');
            }
        }

        showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `wp-toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'wpToastIn 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }

    // ==================== 初始化 ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new WPAdminPanel());
    } else {
        new WPAdminPanel();
    }

})();