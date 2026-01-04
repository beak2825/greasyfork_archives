// ==UserScript==
// @name         本地开发跨域助手 (可视化版)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  拦截所有跨域请求，适用于本地开发环境，带可视化请求监控面板
// @author       chobitsX
// @include      http://localhost:*/*
// @include      http://127.0.0.1:*/*
// @include      http://192.168.*.*:*/*
// @include      http://10.*.*.*:*/*
// @include      https://localhost:*/*
// @include      https://127.0.0.1:*/*
// @include      https://192.168.*.*:*/*
// @include      https://10.*.*.*:*/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @connect      *
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560076/%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E8%B7%A8%E5%9F%9F%E5%8A%A9%E6%89%8B%20%28%E5%8F%AF%E8%A7%86%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560076/%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E8%B7%A8%E5%9F%9F%E5%8A%A9%E6%89%8B%20%28%E5%8F%AF%E8%A7%86%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('%c[CORS Helper] 可视化跨域脚本已启动 v2.0', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; font-size: 14px; padding: 8px 16px; border-radius: 4px;');

    const realWindow = unsafeWindow;
    const currentOrigin = realWindow.location.origin;

    // 请求记录存储
    const requestRecords = [];
    let recordIdCounter = 0;

    // 判断是否为跨域请求
    function isCrossOrigin(url) {
        try {
            const urlObj = new URL(url, currentOrigin);
            return urlObj.origin !== currentOrigin;
        } catch {
            return false;
        }
    }

    // 格式化文件大小
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 格式化时间
    function formatTime(ms) {
        if (ms < 1000) return ms.toFixed(0) + ' ms';
        return (ms / 1000).toFixed(2) + ' s';
    }

    // 格式化日期时间
    function formatDateTime(date) {
        return date.toLocaleTimeString('zh-CN', { hour12: false }) + '.' + date.getMilliseconds().toString().padStart(3, '0');
    }

    // 尝试解析JSON并美化（纯文本版本，保留兼容性）
    function tryParseJSON(str) {
        try {
            const parsed = JSON.parse(str);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return str;
        }
    }

    // 生成可折叠的 JSON 树 HTML
    function renderCollapsibleJSON(str, defaultCollapsed = true) {
        let parsed;
        try {
            parsed = JSON.parse(str);
        } catch {
            // 如果不是有效的 JSON，返回纯文本
            return `<span class="cors-json-string">${escapeHtml(str)}</span>`;
        }
        return renderJSONValue(parsed, '', defaultCollapsed, 0);
    }

    // 转义 HTML 特殊字符
    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // 递归渲染 JSON 值
    function renderJSONValue(value, key, defaultCollapsed, depth) {
        const keyHtml = key !== '' ? `<span class="cors-json-key">"${escapeHtml(key)}"</span><span class="cors-json-colon">: </span>` : '';
        
        if (value === null) {
            return `${keyHtml}<span class="cors-json-null">null</span>`;
        }
        
        if (typeof value === 'boolean') {
            return `${keyHtml}<span class="cors-json-boolean">${value}</span>`;
        }
        
        if (typeof value === 'number') {
            return `${keyHtml}<span class="cors-json-number">${value}</span>`;
        }
        
        if (typeof value === 'string') {
            // 长字符串截断显示
            const displayStr = value.length > 100 ? value.substring(0, 100) + '...' : value;
            return `${keyHtml}<span class="cors-json-string">"${escapeHtml(displayStr)}"</span>`;
        }
        
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return `${keyHtml}<span class="cors-json-bracket">[]</span>`;
            }
            const collapsedClass = depth >= 1 ? 'collapsed' : '';
            const items = value.map((item, index) => {
                return `<div class="cors-json-item">${renderJSONValue(item, '', defaultCollapsed, depth + 1)}${index < value.length - 1 ? ',' : ''}</div>`;
            }).join('');
            return `${keyHtml}<span class="cors-json-toggle ${collapsedClass}" onclick="this.classList.toggle('collapsed')"><span class="cors-json-bracket">[</span><span class="cors-json-preview">Array(${value.length})</span></span><div class="cors-json-children">${items}</div><span class="cors-json-bracket">]</span>`;
        }
        
        if (typeof value === 'object') {
            const keys = Object.keys(value);
            if (keys.length === 0) {
                return `${keyHtml}<span class="cors-json-bracket">{}</span>`;
            }
            const collapsedClass = depth >= 1 ? 'collapsed' : '';
            const items = keys.map((k, index) => {
                return `<div class="cors-json-item">${renderJSONValue(value[k], k, defaultCollapsed, depth + 1)}${index < keys.length - 1 ? ',' : ''}</div>`;
            }).join('');
            return `${keyHtml}<span class="cors-json-toggle ${collapsedClass}" onclick="this.classList.toggle('collapsed')"><span class="cors-json-bracket">{</span><span class="cors-json-preview">Object(${keys.length})</span></span><div class="cors-json-children">${items}</div><span class="cors-json-bracket">}</span>`;
        }
        
        return `${keyHtml}<span class="cors-json-unknown">${escapeHtml(String(value))}</span>`;
    }

    // 获取状态码颜色
    function getStatusColor(status) {
        if (status >= 200 && status < 300) return '#10b981';
        if (status >= 300 && status < 400) return '#f59e0b';
        if (status >= 400 && status < 500) return '#ef4444';
        if (status >= 500) return '#dc2626';
        return '#6b7280';
    }

    // 获取方法颜色
    function getMethodColor(method) {
        const colors = {
            'GET': '#22c55e',
            'POST': '#3b82f6',
            'PUT': '#f59e0b',
            'DELETE': '#ef4444',
            'PATCH': '#8b5cf6',
            'OPTIONS': '#6b7280'
        };
        return colors[method.toUpperCase()] || '#6b7280';
    }

    // 添加样式
    function injectStyles() {
        const styles = `
            @keyframes corsHelperFadeIn {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes corsHelperSlideIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes corsHelperPulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
                50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
            }
            @keyframes corsHelperSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            #cors-helper-float-btn {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 56px;
                height: 56px;
                border-radius: 16px;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.18);
                cursor: pointer;
                z-index: 2147483646;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #cors-helper-float-btn:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5), 0 6px 16px rgba(0, 0, 0, 0.2);
            }
            #cors-helper-float-btn:active {
                transform: translateY(0) scale(0.98);
            }
            #cors-helper-float-btn.has-pending {
                animation: corsHelperPulse 2s infinite;
            }
            #cors-helper-float-btn svg {
                width: 28px;
                height: 28px;
                fill: white;
            }
            #cors-helper-badge {
                position: absolute;
                top: -6px;
                right: -6px;
                min-width: 22px;
                height: 22px;
                padding: 0 6px;
                background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
                color: white;
                font-size: 12px;
                font-weight: 600;
                border-radius: 11px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(244, 63, 94, 0.4);
            }

            #cors-helper-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: min(1200px, 90vw);
                height: min(800px, 85vh);
                background: linear-gradient(180deg, rgba(30, 30, 46, 0.92) 0%, rgba(24, 24, 37, 0.95) 100%);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 20px;
                z-index: 2147483647;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.12);
                border: 1px solid rgba(255, 255, 255, 0.08);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'SF Mono', Consolas, monospace;
                visibility: hidden;
                opacity: 0;
                pointer-events: none;
            }
            #cors-helper-panel.visible {
                visibility: visible;
                opacity: 1;
                pointer-events: auto;
                animation: corsHelperFadeIn 0.3s ease-out;
            }

            .cors-helper-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 24px;
                background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }
            .cors-helper-header-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .cors-helper-logo {
                width: 36px;
                height: 36px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cors-helper-logo svg {
                width: 20px;
                height: 20px;
                fill: white;
            }
            .cors-helper-title {
                font-size: 18px;
                font-weight: 600;
                color: #e2e8f0;
                letter-spacing: -0.02em;
            }
            .cors-helper-subtitle {
                font-size: 12px;
                color: #64748b;
                margin-top: 2px;
            }
            .cors-helper-header-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .cors-helper-btn {
                padding: 8px 16px;
                border-radius: 10px;
                border: none;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .cors-helper-btn-secondary {
                background: rgba(255, 255, 255, 0.08);
                color: #94a3b8;
            }
            .cors-helper-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.12);
                color: #e2e8f0;
            }
            .cors-helper-btn-danger {
                background: rgba(239, 68, 68, 0.15);
                color: #f87171;
            }
            .cors-helper-btn-danger:hover {
                background: rgba(239, 68, 68, 0.25);
            }
            .cors-helper-btn-close {
                width: 36px;
                height: 36px;
                padding: 0;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.06);
                color: #64748b;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cors-helper-btn-close:hover {
                background: rgba(239, 68, 68, 0.2);
                color: #f87171;
            }
            .cors-helper-btn svg {
                width: 16px;
                height: 16px;
                fill: currentColor;
            }

            .cors-helper-toolbar {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 24px;
                background: rgba(0, 0, 0, 0.2);
                border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            }
            .cors-helper-search {
                flex: 1;
                max-width: 400px;
                position: relative;
            }
            .cors-helper-search input {
                width: 100%;
                padding: 10px 16px 10px 40px;
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 10px;
                color: #e2e8f0;
                font-size: 13px;
                outline: none;
                transition: all 0.2s ease;
            }
            .cors-helper-search input:focus {
                background: rgba(255, 255, 255, 0.08);
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
            }
            .cors-helper-search input::placeholder {
                color: #64748b;
            }
            .cors-helper-search-icon {
                position: absolute;
                left: 14px;
                top: 50%;
                transform: translateY(-50%);
                width: 16px;
                height: 16px;
                fill: #64748b;
            }
            .cors-helper-filter-tags {
                display: flex;
                gap: 6px;
            }
            .cors-helper-filter-tag {
                padding: 6px 12px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                background: rgba(255, 255, 255, 0.06);
                color: #94a3b8;
                border: 1px solid transparent;
            }
            .cors-helper-filter-tag:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            .cors-helper-filter-tag.active {
                background: rgba(102, 126, 234, 0.2);
                color: #a5b4fc;
                border-color: rgba(102, 126, 234, 0.3);
            }
            .cors-helper-stats {
                display: flex;
                gap: 16px;
                margin-left: auto;
                font-size: 12px;
                color: #64748b;
                align-items: center;
            }
            .cors-helper-sort-btn {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 6px 10px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.08);
                color: #94a3b8;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .cors-helper-sort-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #e2e8f0;
            }
            .cors-helper-sort-btn svg {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }
            .cors-helper-sort-btn .cors-helper-sort-arrow {
                transition: transform 0.2s ease;
            }
            .cors-helper-sort-btn.asc .cors-helper-sort-arrow {
                transform: rotate(180deg);
            }
            .cors-helper-stat {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .cors-helper-stat-value {
                color: #e2e8f0;
                font-weight: 600;
            }

            .cors-helper-content {
                display: flex;
                flex: 1;
                overflow: hidden;
            }

            .cors-helper-list {
                width: 45%;
                min-width: 400px;
                overflow-y: auto;
                border-right: 1px solid rgba(255, 255, 255, 0.06);
            }
            .cors-helper-list::-webkit-scrollbar {
                width: 8px;
            }
            .cors-helper-list::-webkit-scrollbar-track {
                background: transparent;
            }
            .cors-helper-list::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            .cors-helper-list::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .cors-helper-empty {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #64748b;
                text-align: center;
                padding: 40px;
            }
            .cors-helper-empty-icon {
                width: 80px;
                height: 80px;
                margin-bottom: 20px;
                opacity: 0.5;
            }
            .cors-helper-empty-title {
                font-size: 16px;
                font-weight: 600;
                color: #94a3b8;
                margin-bottom: 8px;
            }
            .cors-helper-empty-desc {
                font-size: 13px;
                line-height: 1.6;
            }

            .cors-helper-request-item {
                display: flex;
                align-items: center;
                padding: 14px 20px;
                cursor: pointer;
                transition: all 0.15s ease;
                border-bottom: 1px solid rgba(255, 255, 255, 0.04);
                animation: corsHelperSlideIn 0.3s ease-out;
            }
            .cors-helper-request-item:hover {
                background: rgba(255, 255, 255, 0.04);
            }
            .cors-helper-request-item.selected {
                background: rgba(102, 126, 234, 0.15);
                border-left: 3px solid #667eea;
            }
            .cors-helper-request-item.pending {
                opacity: 0.7;
            }
            .cors-helper-request-item.error {
                background: rgba(239, 68, 68, 0.08);
            }

            .cors-helper-request-status {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 14px;
                flex-shrink: 0;
            }
            .cors-helper-request-status.pending {
                border: 2px solid #64748b;
                border-top-color: transparent;
                animation: corsHelperSpin 1s linear infinite;
            }
            .cors-helper-request-info {
                flex: 1;
                min-width: 0;
                margin-right: 16px;
            }
            .cors-helper-request-method {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 5px;
                font-size: 11px;
                font-weight: 600;
                margin-right: 10px;
            }
            .cors-helper-request-url {
                color: #cbd5e1;
                font-size: 13px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: block;
                margin-top: 4px;
            }
            .cors-helper-request-path {
                color: #94a3b8;
                font-size: 12px;
                margin-top: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .cors-helper-request-meta {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 4px;
                flex-shrink: 0;
            }
            .cors-helper-request-code {
                font-size: 13px;
                font-weight: 600;
            }
            .cors-helper-request-time {
                font-size: 11px;
                color: #64748b;
            }
            .cors-helper-request-size {
                font-size: 11px;
                color: #64748b;
            }

            .cors-helper-detail {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .cors-helper-detail-empty {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #64748b;
                font-size: 14px;
            }
            .cors-helper-detail-tabs {
                display: flex;
                padding: 0 20px;
                background: rgba(0, 0, 0, 0.2);
                border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            }
            .cors-helper-detail-tab {
                padding: 14px 20px;
                font-size: 13px;
                font-weight: 500;
                color: #64748b;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }
            .cors-helper-detail-tab:hover {
                color: #94a3b8;
            }
            .cors-helper-detail-tab.active {
                color: #a5b4fc;
                border-bottom-color: #667eea;
            }
            .cors-helper-detail-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }
            .cors-helper-detail-content::-webkit-scrollbar {
                width: 8px;
            }
            .cors-helper-detail-content::-webkit-scrollbar-track {
                background: transparent;
            }
            .cors-helper-detail-content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }

            .cors-helper-section {
                margin-bottom: 24px;
            }
            .cors-helper-section-title {
                font-size: 12px;
                font-weight: 600;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .cors-helper-section-title::after {
                content: '';
                flex: 1;
                height: 1px;
                background: rgba(255, 255, 255, 0.08);
            }
            .cors-helper-kv-list {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                overflow: hidden;
            }
            .cors-helper-kv-item {
                display: flex;
                padding: 10px 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            }
            .cors-helper-kv-item:last-child {
                border-bottom: none;
            }
            .cors-helper-kv-key {
                width: 160px;
                flex-shrink: 0;
                color: #a5b4fc;
                font-size: 12px;
                font-weight: 500;
            }
            .cors-helper-kv-value {
                flex: 1;
                color: #e2e8f0;
                font-size: 12px;
                word-break: break-all;
            }

            .cors-helper-code-block {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                padding: 16px;
                overflow-x: auto;
            }
            .cors-helper-code-block pre {
                margin: 0;
                color: #e2e8f0;
                font-size: 12px;
                font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
                line-height: 1.6;
                white-space: pre-wrap;
                word-break: break-word;
            }

            .cors-helper-copy-btn {
                padding: 6px 12px;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.08);
                color: #94a3b8;
                font-size: 11px;
                border: none;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .cors-helper-copy-btn:hover {
                background: rgba(255, 255, 255, 0.12);
                color: #e2e8f0;
            }

            .cors-helper-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
                z-index: 2147483646;
                display: none;
            }
            .cors-helper-overlay.visible {
                display: block;
            }

            /* 可折叠 JSON 树样式 */
            .cors-json-tree {
                font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
                font-size: 12px;
                line-height: 1.6;
                color: #e2e8f0;
            }
            .cors-json-key {
                color: #a5b4fc;
            }
            .cors-json-colon {
                color: #64748b;
            }
            .cors-json-string {
                color: #86efac;
            }
            .cors-json-number {
                color: #fbbf24;
            }
            .cors-json-boolean {
                color: #f472b6;
            }
            .cors-json-null {
                color: #94a3b8;
                font-style: italic;
            }
            .cors-json-bracket {
                color: #64748b;
            }
            .cors-json-toggle {
                cursor: pointer;
                position: relative;
                padding-left: 16px;
                display: inline;
            }
            .cors-json-toggle::before {
                content: '▼';
                position: absolute;
                left: 0;
                top: 0;
                font-size: 10px;
                color: #64748b;
                transition: transform 0.15s ease;
            }
            .cors-json-toggle.collapsed::before {
                transform: rotate(-90deg);
            }
            .cors-json-toggle.collapsed + .cors-json-children {
                display: none;
            }
            .cors-json-toggle.collapsed + .cors-json-children + .cors-json-bracket {
                display: none;
            }
            .cors-json-toggle .cors-json-preview {
                display: none;
                color: #64748b;
                font-style: italic;
                margin-left: 4px;
            }
            .cors-json-toggle.collapsed .cors-json-preview {
                display: inline;
            }
            .cors-json-toggle.collapsed .cors-json-bracket {
                display: inline;
            }
            .cors-json-children {
                padding-left: 20px;
                border-left: 1px solid rgba(255, 255, 255, 0.08);
                margin-left: 4px;
            }
            .cors-json-item {
                position: relative;
            }
            .cors-json-item:hover {
                background: rgba(255, 255, 255, 0.03);
            }
        `;
        
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(styles);
        } else {
            const styleEl = document.createElement('style');
            styleEl.textContent = styles;
            (document.head || document.documentElement).appendChild(styleEl);
        }
    }

    // 创建UI元素
    function createUI() {
        // 悬浮按钮
        const floatBtn = document.createElement('button');
        floatBtn.id = 'cors-helper-float-btn';
        floatBtn.innerHTML = `
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            <span id="cors-helper-badge" style="display: none;">0</span>
        `;

        // 遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'cors-helper-overlay';
        overlay.className = 'cors-helper-overlay';

        // 面板
        const panel = document.createElement('div');
        panel.id = 'cors-helper-panel';
        panel.innerHTML = `
            <div class="cors-helper-header">
                <div class="cors-helper-header-left">
                    <div class="cors-helper-logo">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    </div>
                    <div>
                        <div class="cors-helper-title">CORS Network Monitor</div>
                        <div class="cors-helper-subtitle">跨域请求监控面板</div>
                    </div>
                </div>
                <div class="cors-helper-header-actions">
                    <button class="cors-helper-btn cors-helper-btn-danger" id="cors-helper-clear">
                        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                        清空
                    </button>
                    <button class="cors-helper-btn cors-helper-btn-close" id="cors-helper-close">
                        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </button>
                </div>
            </div>
            <div class="cors-helper-toolbar">
                <div class="cors-helper-search">
                    <svg class="cors-helper-search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <input type="text" placeholder="搜索 URL、方法或状态码..." id="cors-helper-search-input">
                </div>
                <button class="cors-helper-sort-btn" id="cors-helper-sort-btn" title="按时间排序">
                    <svg viewBox="0 0 24 24"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/></svg>
                    <span id="cors-helper-sort-label">最新</span>
                    <svg class="cors-helper-sort-arrow" id="cors-helper-sort-arrow" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
                </button>
                <div class="cors-helper-filter-tags">
                    <span class="cors-helper-filter-tag active" data-filter="all">全部</span>
                    <span class="cors-helper-filter-tag" data-filter="pending">进行中</span>
                    <span class="cors-helper-filter-tag" data-filter="success">成功</span>
                    <span class="cors-helper-filter-tag" data-filter="error">错误</span>
                </div>
                <div class="cors-helper-stats">
                    <div class="cors-helper-stat">
                        <span>请求数:</span>
                        <span class="cors-helper-stat-value" id="cors-helper-stat-total">0</span>
                    </div>
                    <div class="cors-helper-stat">
                        <span>传输:</span>
                        <span class="cors-helper-stat-value" id="cors-helper-stat-size">0 B</span>
                    </div>
                </div>
            </div>
            <div class="cors-helper-content">
                <div class="cors-helper-list" id="cors-helper-list">
                    <div class="cors-helper-empty">
                        <svg class="cors-helper-empty-icon" viewBox="0 0 24 24" fill="#64748b"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        <div class="cors-helper-empty-title">暂无跨域请求</div>
                        <div class="cors-helper-empty-desc">当前页面发起的跨域请求将会显示在这里<br>仅拦截通过 fetch API 发起的跨域请求</div>
                    </div>
                </div>
                <div class="cors-helper-detail" id="cors-helper-detail">
                    <div class="cors-helper-detail-empty">
                        <span>← 选择一个请求查看详情</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(floatBtn);
        document.body.appendChild(panel);

        // 事件绑定
        floatBtn.addEventListener('click', () => togglePanel(true));
        overlay.addEventListener('click', () => togglePanel(false));
        document.getElementById('cors-helper-close').addEventListener('click', () => togglePanel(false));
        document.getElementById('cors-helper-clear').addEventListener('click', clearRecords);
        document.getElementById('cors-helper-search-input').addEventListener('input', filterRequests);
        
        document.querySelectorAll('.cors-helper-filter-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                document.querySelectorAll('.cors-helper-filter-tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                filterRequests();
            });
        });

        // 排序按钮事件
        document.getElementById('cors-helper-sort-btn').addEventListener('click', () => {
            const btn = document.getElementById('cors-helper-sort-btn');
            const label = document.getElementById('cors-helper-sort-label');
            if (sortOrder === 'desc') {
                sortOrder = 'asc';
                label.textContent = '最早';
                btn.classList.add('asc');
            } else {
                sortOrder = 'desc';
                label.textContent = '最新';
                btn.classList.remove('asc');
            }
            renderRequestList();
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('visible')) {
                togglePanel(false);
            }
        });
    }

    function togglePanel(show) {
        const panel = document.getElementById('cors-helper-panel');
        const overlay = document.getElementById('cors-helper-overlay');
        if (show) {
            panel.classList.add('visible');
            overlay.classList.add('visible');
        } else {
            panel.classList.remove('visible');
            overlay.classList.remove('visible');
        }
    }

    function clearRecords() {
        requestRecords.length = 0;
        selectedRecordId = null;
        renderRequestList();
        renderDetail(null);
        updateStats();
    }

    function filterRequests() {
        renderRequestList();
    }

    // 排序状态: 'desc' 倒序（最新在前）, 'asc' 正序（最早在前）
    let sortOrder = 'desc';

    let selectedRecordId = null;

    function renderRequestList() {
        const list = document.getElementById('cors-helper-list');
        const searchInput = document.getElementById('cors-helper-search-input');
        const activeFilter = document.querySelector('.cors-helper-filter-tag.active');
        
        const searchTerm = searchInput.value.toLowerCase();
        const filterType = activeFilter.dataset.filter;

        const filtered = requestRecords.filter(record => {
            // 搜索过滤
            const matchSearch = !searchTerm || 
                record.url.toLowerCase().includes(searchTerm) ||
                record.method.toLowerCase().includes(searchTerm) ||
                (record.status && record.status.toString().includes(searchTerm));

            // 状态过滤
            let matchFilter = true;
            if (filterType === 'pending') {
                matchFilter = record.status === null;
            } else if (filterType === 'success') {
                matchFilter = record.status >= 200 && record.status < 400;
            } else if (filterType === 'error') {
                matchFilter = record.status >= 400 || record.error;
            }

            return matchSearch && matchFilter;
        });

        // 按时间排序
        filtered.sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.startTime - a.startTime; // 倒序：最新在前
            } else {
                return a.startTime - b.startTime; // 正序：最早在前
            }
        });

        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="cors-helper-empty">
                    <svg class="cors-helper-empty-icon" viewBox="0 0 24 24" fill="#64748b"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    <div class="cors-helper-empty-title">${searchTerm || filterType !== 'all' ? '没有匹配的请求' : '暂无跨域请求'}</div>
                    <div class="cors-helper-empty-desc">${searchTerm || filterType !== 'all' ? '尝试调整搜索条件' : '当前页面发起的跨域请求将会显示在这里'}</div>
                </div>
            `;
            return;
        }

        list.innerHTML = filtered.map(record => {
            const urlObj = new URL(record.url);
            const isSelected = record.id === selectedRecordId;
            const isPending = record.status === null;
            const isError = record.status >= 400 || record.error;
            
            return `
                <div class="cors-helper-request-item ${isSelected ? 'selected' : ''} ${isPending ? 'pending' : ''} ${isError ? 'error' : ''}" data-id="${record.id}">
                    <div class="cors-helper-request-status ${isPending ? 'pending' : ''}" style="${!isPending ? `background: ${getStatusColor(record.status)}` : ''}"></div>
                    <div class="cors-helper-request-info">
                        <span class="cors-helper-request-method" style="background: ${getMethodColor(record.method)}20; color: ${getMethodColor(record.method)}">${record.method}</span>
                        <span class="cors-helper-request-url">${urlObj.host}</span>
                        <span class="cors-helper-request-path">${urlObj.pathname}${urlObj.search}</span>
                    </div>
                    <div class="cors-helper-request-meta">
                        <span class="cors-helper-request-code" style="color: ${getStatusColor(record.status)}">${isPending ? '...' : record.status}</span>
                        <span class="cors-helper-request-time">${record.duration ? formatTime(record.duration) : '...'}</span>
                        <span class="cors-helper-request-size">${record.responseSize ? formatBytes(record.responseSize) : ''}</span>
                    </div>
                </div>
            `;
        }).join('');

        // 绑定点击事件
        list.querySelectorAll('.cors-helper-request-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                selectedRecordId = id;
                renderRequestList();
                const record = requestRecords.find(r => r.id === id);
                renderDetail(record);
            });
        });
    }

    function renderDetail(record) {
        const detail = document.getElementById('cors-helper-detail');
        
        if (!record) {
            detail.innerHTML = `
                <div class="cors-helper-detail-empty">
                    <span>← 选择一个请求查看详情</span>
                </div>
            `;
            return;
        }

        const tabs = ['Headers', 'Payload', 'Response', 'Timing'];
        const activeTab = detail.dataset.activeTab || 'Headers';

        detail.innerHTML = `
            <div class="cors-helper-detail-tabs">
                ${tabs.map(tab => `
                    <div class="cors-helper-detail-tab ${tab === activeTab ? 'active' : ''}" data-tab="${tab}">${tab}</div>
                `).join('')}
            </div>
            <div class="cors-helper-detail-content" id="cors-helper-detail-body"></div>
        `;

        detail.querySelectorAll('.cors-helper-detail-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                detail.dataset.activeTab = tab.dataset.tab;
                renderDetail(record);
            });
        });

        const body = document.getElementById('cors-helper-detail-body');
        
        switch (activeTab) {
            case 'Headers':
                body.innerHTML = `
                    <div class="cors-helper-section">
                        <div class="cors-helper-section-title">通用信息</div>
                        <div class="cors-helper-kv-list">
                            <div class="cors-helper-kv-item">
                                <span class="cors-helper-kv-key">Request URL</span>
                                <span class="cors-helper-kv-value">${record.url}</span>
                            </div>
                            <div class="cors-helper-kv-item">
                                <span class="cors-helper-kv-key">Request Method</span>
                                <span class="cors-helper-kv-value">${record.method}</span>
                            </div>
                            <div class="cors-helper-kv-item">
                                <span class="cors-helper-kv-key">Status Code</span>
                                <span class="cors-helper-kv-value" style="color: ${getStatusColor(record.status)}">${record.status || 'Pending'} ${record.statusText || ''}</span>
                            </div>
                        </div>
                    </div>
                    ${record.requestHeaders && Object.keys(record.requestHeaders).length > 0 ? `
                        <div class="cors-helper-section">
                            <div class="cors-helper-section-title">请求头</div>
                            <div class="cors-helper-kv-list">
                                ${Object.entries(record.requestHeaders).map(([k, v]) => `
                                    <div class="cors-helper-kv-item">
                                        <span class="cors-helper-kv-key">${k}</span>
                                        <span class="cors-helper-kv-value">${v}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${record.responseHeaders && Object.keys(record.responseHeaders).length > 0 ? `
                        <div class="cors-helper-section">
                            <div class="cors-helper-section-title">响应头</div>
                            <div class="cors-helper-kv-list">
                                ${Object.entries(record.responseHeaders).map(([k, v]) => `
                                    <div class="cors-helper-kv-item">
                                        <span class="cors-helper-kv-key">${k}</span>
                                        <span class="cors-helper-kv-value">${v}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                `;
                break;
            case 'Payload':
                body.innerHTML = `
                    <div class="cors-helper-section">
                        <div class="cors-helper-section-title">
                            请求体
                            ${record.requestBody ? `<button class="cors-helper-copy-btn" onclick="navigator.clipboard.writeText(\`${encodeURIComponent(record.requestBody)}\`.replace(/%[0-9A-F]{2}/g, m => String.fromCharCode(parseInt(m.slice(1), 16))))">复制</button>` : ''}
                        </div>
                        ${record.requestBody ? `
                            <div class="cors-helper-code-block cors-json-tree">
                                ${renderCollapsibleJSON(record.requestBody)}
                            </div>
                        ` : '<div style="color: #64748b; font-size: 13px;">无请求体</div>'}
                    </div>
                `;
                break;
            case 'Response':
                body.innerHTML = `
                    <div class="cors-helper-section">
                        <div class="cors-helper-section-title">
                            响应体
                            ${record.responseBody ? `<button class="cors-helper-copy-btn" onclick="navigator.clipboard.writeText(\`${encodeURIComponent(record.responseBody)}\`.replace(/%[0-9A-F]{2}/g, m => String.fromCharCode(parseInt(m.slice(1), 16))))">复制</button>` : ''}
                        </div>
                        ${record.responseBody ? `
                            <div class="cors-helper-code-block cors-json-tree">
                                ${renderCollapsibleJSON(record.responseBody)}
                            </div>
                        ` : `<div style="color: #64748b; font-size: 13px;">${record.status === null ? '请求进行中...' : (record.error ? '请求失败' : '无响应体')}</div>`}
                    </div>
                `;
                break;
            case 'Timing':
                body.innerHTML = `
                    <div class="cors-helper-section">
                        <div class="cors-helper-section-title">时间信息</div>
                        <div class="cors-helper-kv-list">
                            <div class="cors-helper-kv-item">
                                <span class="cors-helper-kv-key">请求开始时间</span>
                                <span class="cors-helper-kv-value">${formatDateTime(new Date(record.startTime))}</span>
                            </div>
                            ${record.endTime ? `
                                <div class="cors-helper-kv-item">
                                    <span class="cors-helper-kv-key">请求结束时间</span>
                                    <span class="cors-helper-kv-value">${formatDateTime(new Date(record.endTime))}</span>
                                </div>
                                <div class="cors-helper-kv-item">
                                    <span class="cors-helper-kv-key">总耗时</span>
                                    <span class="cors-helper-kv-value" style="color: ${record.duration > 3000 ? '#f59e0b' : '#10b981'}">${formatTime(record.duration)}</span>
                                </div>
                            ` : `
                                <div class="cors-helper-kv-item">
                                    <span class="cors-helper-kv-key">状态</span>
                                    <span class="cors-helper-kv-value" style="color: #64748b;">请求进行中...</span>
                                </div>
                            `}
                        </div>
                    </div>
                `;
                break;
        }
    }

    function updateStats() {
        const totalEl = document.getElementById('cors-helper-stat-total');
        const sizeEl = document.getElementById('cors-helper-stat-size');
        
        if (totalEl) {
            totalEl.textContent = requestRecords.length;
        }
        if (sizeEl) {
            const totalSize = requestRecords.reduce((sum, r) => sum + (r.responseSize || 0), 0);
            sizeEl.textContent = formatBytes(totalSize);
        }

        // 更新徽章
        const badge = document.getElementById('cors-helper-badge');
        const pendingCount = requestRecords.filter(r => r.status === null).length;
        if (badge) {
            if (pendingCount > 0) {
                badge.style.display = 'flex';
                badge.textContent = pendingCount;
                document.getElementById('cors-helper-float-btn').classList.add('has-pending');
            } else {
                badge.style.display = requestRecords.length > 0 ? 'flex' : 'none';
                badge.textContent = requestRecords.length;
                document.getElementById('cors-helper-float-btn').classList.remove('has-pending');
            }
        }
    }

    // 记录请求
    function recordRequest(url, options) {
        const record = {
            id: ++recordIdCounter,
            url: url,
            method: (options.method || 'GET').toUpperCase(),
            requestHeaders: options.headers || {},
            requestBody: options.body || null,
            status: null,
            statusText: null,
            responseHeaders: {},
            responseBody: null,
            responseSize: 0,
            startTime: Date.now(),
            endTime: null,
            duration: null,
            error: null
        };
        requestRecords.unshift(record);
        renderRequestList();
        updateStats();
        return record;
    }

    function updateRecord(record, response, error) {
        record.endTime = Date.now();
        record.duration = record.endTime - record.startTime;
        
        if (error) {
            record.error = error;
            record.status = 0;
        } else {
            record.status = response.status;
            record.statusText = response.statusText;
            record.responseHeaders = response.headers;
            record.responseBody = response.body;
            record.responseSize = response.body ? new Blob([response.body]).size : 0;
        }
        
        renderRequestList();
        if (selectedRecordId === record.id) {
            renderDetail(record);
        }
        updateStats();
    }

    // 拦截 fetch
    const originFetch = realWindow.fetch;
    realWindow.fetch = function(url, options = {}) {
        const urlStr = (typeof url === 'string') ? url : (url.url || '');
        if (isCrossOrigin(urlStr)) {
            return gmRequestToFetchResponse(urlStr, options);
        }
        return originFetch.apply(this, arguments);
    };

    function gmRequestToFetchResponse(url, options) {
        const record = recordRequest(url, options);
        
        return new Promise((resolve, reject) => {
            const headers = {};
            if (options.headers) {
                if (options.headers instanceof Headers) {
                    options.headers.forEach((v, k) => headers[k] = v);
                } else {
                    Object.assign(headers, options.headers);
                }
            }
            record.requestHeaders = headers;

            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: headers,
                data: options.body,
                onload: (res) => {
                    const responseHeaders = parseHeaders(res.responseHeaders);
                    updateRecord(record, {
                        status: res.status,
                        statusText: res.statusText,
                        headers: responseHeaders,
                        body: res.responseText
                    }, null);
                    
                    resolve(new Response(res.responseText, {
                        status: res.status,
                        statusText: res.statusText,
                        headers: new Headers(responseHeaders)
                    }));
                },
                onerror: (err) => {
                    console.error('[CORS Helper] 请求失败:', err);
                    updateRecord(record, null, err);
                    reject(err);
                }
            });
        });
    }

    function parseHeaders(s) {
        const h = {};
        if (!s) return h;
        s.split('\r\n').forEach(l => {
            const i = l.indexOf(': ');
            if (i > 0) h[l.substring(0, i)] = l.substring(i + 2);
        });
        return h;
    }

    // 等待DOM加载后创建UI
    if (document.body) {
        injectStyles();
        createUI();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            injectStyles();
            createUI();
        });
    }

})();