// ==UserScript==
// @name         115云盘链接助手
// @namespace    https://greasyfork.org/zh-CN/users/1546436-zasternight
// @version      3.7
// @description  自动捕捉页面磁力链接和Ed2k链接并一键保存至115云盘，支持可视化选择自定义保存文件夹，顶部面板一键复制链接，支持批量下载，性能优化版
// @author       zasternight
// @license      MIT
// @match        *://*/*
// @connect      115.com
// @connect      webapi.115.com
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558484/115%E4%BA%91%E7%9B%98%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558484/115%E4%BA%91%E7%9B%98%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置常量 ====================
// ==================== 修改开始 ====================
const CONFIG = {
    STORAGE_KEY: '115_save_path_config_v2',
    SITE_STORAGE_KEY: '115_site_path_config',  // 新增：按网站存储的键
    DEFAULT_PATH: { cid: 0, name: '根目录' },
    TOAST_DURATION: 3000,
    SCAN_DEBOUNCE: 300,
    MAX_PANEL_LINKS: 3,
    REQUEST_TIMEOUT: 30000,
    MAX_RETRY: 2,
    VERSION: '3.5',  // 版本号更新
    PANEL_HEIGHT: 60
};
// ==================== 修改结束 ====================


    // 预编译正则表达式（性能优化）
    // 预编译正则表达式（性能优化）
    const REGEX = {
    // 磁力链接正则
    MAGNET: /magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,40}(?:&[^\s<>"']*)?/gi,
    // 【修复】ed2k链接正则
    // 标准格式: ed2k://|file|文件名|文件大小|MD4哈希(32位十六进制)|/
    // 可选: |h=AICH哈希| - AICH使用Base32编码(A-Z, 2-7)，这里放宽为字母数字
    // 可选: |p=分片哈希|
    ED2K: /ed2k:\/\/\|file\|[^|]+\|[0-9]+\|[a-fA-F0-9]{32}\|(?:h=[A-Za-z0-9]+\|)?(?:p=[a-fA-F0-9:]+\|)?\//gi,
    ED2K_NAME: /ed2k:\/\/\|file\|([^|]+)\|/i,
    MAGNET_DN: /&dn=([^&]+)/i
    };


    // 需要忽略的标签
    const IGNORED_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT', 'IFRAME']);

    // 需要扫描的代码块选择器
    const CODE_BLOCK_SELECTOR = '.blockcode, pre, code, .code, blockquote, .quote, .codemirror, .highlight';

    console.log(`115云盘链接助手 (v${CONFIG.VERSION}) 已加载`);

    // ==================== 样式注入 ====================
    GM_addStyle(`
        /* ===== 页面内容偏移（为顶部面板腾出空间） ===== */
        body.magnet-panel-active {
            transition: padding-top 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* ===== Toast 提示框 ===== */
        .magnet-toast-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background-color: rgba(0, 0, 0, 0.85);
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            z-index: 2147483647;
            pointer-events: none;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 80%;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        body.magnet-panel-active .magnet-toast-container {
            top: 80px;
        }
        .magnet-toast-container.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        .magnet-toast-container.success { background-color: rgba(46, 125, 50, 0.95); }
        .magnet-toast-container.error { background-color: rgba(211, 47, 47, 0.95); }
        .magnet-toast-container.warning { background-color: rgba(245, 124, 0, 0.95); }

        /* ===== 115 按钮通用样式 ===== */
        .magnet-btn-115 {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-width: 28px !important;
            height: 28px !important;
            background: linear-gradient(135deg, #2777F8 0%, #1e5fd8 100%) !important;
            border-radius: 14px !important;
            cursor: pointer !important;
            margin: 0 4px !important;
            color: #fff !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            line-height: 1 !important;
            border: none !important;
            padding: 0 8px !important;
            box-shadow: 0 2px 6px rgba(39, 119, 248, 0.3) !important;
            transition: all 0.2s ease !important;
            text-decoration: none !important;
            vertical-align: middle !important;}
        .magnet-btn-115:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(39, 119, 248, 0.4) !important;background: linear-gradient(135deg, #3085ff 0%, #2777F8 100%) !important;
        }
        .magnet-btn-115:active {
            transform: translateY(0) !important;
        }
        .magnet-btn-115.loading {
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%) !important;
            cursor: wait !important;
            pointer-events: none !important;
        }
        .magnet-btn-115.success {
            background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%) !important;
        }
        .magnet-btn-115.error {
            background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%) !important;
        }

        /* ===== 按钮包装器 ===== */
        .magnet-btn-wrapper {
            display: inline-flex !important;
            align-items: center !important;
            vertical-align: middle !important;
            margin: 0 2px !important;
        }

        /* ===== 顶部面板样式 ===== */
        #magnet-top-panel {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
            border-bottom: 1px solid #e0e0e0;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            z-index: 2147483646;
            padding: 10px 20px;
            display: none;
            flex-direction: column;
            gap: 8px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-sizing: border-box;max-height: 40vh;
            overflow-y: auto;
        }
        #magnet-top-panel.show {
            display: flex;
        }

        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
        }
        .panel-title {
            font-weight: 600;
            font-size: 14px;
            color: #333;
            white-space: nowrap;}
        .panel-actions-header {
            display: flex;
            gap: 8px;align-items: center;
            flex-wrap: wrap;
        }
        .panel-close {
            font-size: 20px;
            cursor: pointer;
            color: #999;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s;line-height: 1;
        }
        .panel-close:hover {
            background: #f0f0f0;
            color: #666;
        }

        .panel-links-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .panel-links-container.collapsed {
            display: none;
        }

        .panel-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
            color: #333;
            background: #fff;
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid #eee;
            transition: all 0.2s;
            flex-wrap: wrap;
            gap: 8px;
        }
        .panel-row:hover {
            border-color: #2777F8;
            box-shadow: 0 2px 8px rgba(39, 119, 248, 0.1);
        }
        .panel-link-info {
            flex: 1;
            overflow: hidden;
            min-width: 200px;
        }
        .panel-link-name {
            font-weight: 500;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 2px;
        }
        .panel-link-type {
            font-size: 11px;
            color: #999;
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
        }
        .panel-link-type .type-badge {
            background: #e3f2fd;
            color: #1976d2;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 500;
            flex-shrink: 0;
        }
        .panel-link-type .type-badge.ed2k {
            background: #fff3e0;
            color: #f57c00;
        }
        .panel-link-type .link-preview {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 300px;
        }
        .panel-row-actions {
            display: flex;
            gap: 6px;
            flex-shrink: 0;
        }
        .panel-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .panel-btn-copy {
            background: #f5f5f5;
            color: #666;
        }
        .panel-btn-copy:hover {
            background: #e0e0e0;
        }
        .panel-btn-download {
            background: linear-gradient(135deg, #2777F8 0%, #1e5fd8 100%);
            color: #fff;
        }
        .panel-btn-download:hover {
            background: linear-gradient(135deg, #3085ff 0%, #2777F8 100%);
        }
        .panel-btn-batch {
            background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
            color: #fff;
        }
        .panel-btn-batch:hover {
            background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
        }
        .panel-btn-toggle {
            background: #e3f2fd;
            color: #1976d2;
        }
        .panel-btn-toggle:hover {
            background: #bbdefb;
        }

        /* ===== 文件夹选择器样式 ===== */
        .folder-picker-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 2147483647;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            backdrop-filter: blur(4px);
        }
        .folder-picker-modal {
            width: 480px;
            max-width: 90vw;
            height: 520px;
            max-height: 80vh;
            background: #fff;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease;
        }
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .fp-header {
            padding: 16px 20px;
            border-bottom: 1px solid #eee;
            background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .fp-title {
            font-weight: 600;
            color: #333;
            font-size: 16px;
        }
        .fp-close {
            cursor: pointer;
            color: #999;
            font-size: 24px;
            line-height: 1;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        .fp-close:hover {
            background: #eee;
            color: #666;
        }

        .fp-breadcrumbs {
            padding: 12px 20px;
            background: #fff;
            border-bottom: 1px solid #eee;font-size: 13px;
            color: #666;
            white-space: nowrap;
            overflow-x: auto;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .fp-breadcrumbs::-webkit-scrollbar {
            height: 4px;
        }
        .fp-breadcrumbs::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 2px;
        }
        .fp-crumb-item {
            cursor: pointer;
            color: #2777F8;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .fp-crumb-item:hover {
            background: #e3f2fd;
        }
        .fp-crumb-sep {
            color: #ccc;
        }
        .fp-crumb-current {
            color: #333;
            font-weight: 600;
            padding: 4px 8px;}

        .fp-list {
            flex: 1;
            overflow-y: auto;
            padding: 8px 0;
        }
        .fp-list::-webkit-scrollbar {
            width: 6px;
        }
        .fp-list::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 3px;
        }

        .fp-item {
            padding: 12px 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: background 0.2s;
        }
        .fp-item:hover {
            background: #f5f9ff;
        }
        .fp-icon {
            margin-right: 12px;
            font-size: 20px;
        }
        .fp-name {
            flex: 1;
            font-size: 14px;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .fp-arrow {
            color: #ccc;
            font-size: 14px;
        }

        .fp-footer {
            padding: 16px 20px;
            border-top: 1px solid #eee;
            background: linear-gradient(180deg, #f5f5f5 0%, #fafafa 100%);display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .fp-current-path {
            font-size: 12px;
            color: #666;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 12px;
        }
        .fp-footer-actions {
            display: flex;
            gap: 10px;
        }
        .fp-btn {
            padding: 8px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }
        .fp-btn-cancel {
            background: #e0e0e0;
            color: #333;
        }
        .fp-btn-cancel:hover {
            background: #d0d0d0;
        }
        .fp-btn-save {
            background: linear-gradient(135deg, #2777F8 0%, #1e5fd8 100%);
            color: #fff;
        }
        .fp-btn-save:hover {
            background: linear-gradient(135deg, #3085ff 0%, #2777F8 100%);
        }

        .fp-loading, .fp-empty {
            text-align: center;
            padding: 40px 20px;
            color: #999;
            font-size: 14px;
        }
        .fp-loading::before {
            content: '';
            display: block;
            width: 32px;
            height: 32px;
            margin: 0 auto 12px;
            border: 3px solid #eee;
            border-top-color: #2777F8;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }`);

    // ==================== 状态管理 ====================
    const State = {
        links: new Map(),
        buttons: new Set(),
        panelElement: null,
        toastElement: null,
        toastTimeout: null,
        scanTimeout: null,
        isScanning: false,
        observer: null,
        linksCollapsed: false,
        panelClosed: false,
        originalBodyPaddingTop: null
    };

    // ==================== 工具函数 ====================
    const Utils = {
        debounce(fn, delay) {
            let timer = null;
            return function(...args) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        },

        extractFileName(link) {
            if (link.startsWith('ed2k://')) {
                const match = link.match(REGEX.ED2K_NAME);
                if (match) {
                    try {
                        return decodeURIComponent(match[1]);
                    } catch {
                        return match[1];
                    }
                }
            } else if (link.startsWith('magnet:')) {
                const match = link.match(REGEX.MAGNET_DN);
                if (match) {
                    try {
                        return decodeURIComponent(match[1].replace(/\+/g, ' '));
                    } catch {
                        return match[1];
                    }
                }
            }
            return null;
        },

        getLinkType(link) {
            if (link.startsWith('ed2k://')) return 'ed2k';
            if (link.startsWith('magnet:')) return 'magnet';
            return 'unknown';
        },

        truncate(text, maxLength = 50) {
            if (!text || text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        },

        safeJsonParse(text, defaultValue = null) {
            try {
                return JSON.parse(text);
            } catch {
                return defaultValue;
            }
        },

        // 【修复】改进的 isEditable 函数，增加节点类型检查
        isEditable(element) {
            if (!element) return false;

            // 如果是文本节点，获取其父元素
            if (element.nodeType === Node.TEXT_NODE) {
                element = element.parentElement;
                if (!element) return false;
            }

            // 确保是元素节点
            if (element.nodeType !== Node.ELEMENT_NODE) return false;

            const tagName = element.tagName;
            if (tagName === 'INPUT' || tagName === 'TEXTAREA') return true;
            if (element.isContentEditable) return true;

            // 安全调用 closest
            if (typeof element.closest === 'function') {
                if (element.closest('[contenteditable="true"]')) return true;
            }

            return false;
        },

        // 【修复】改进的 shouldIgnoreElement 函数
        shouldIgnoreElement(element) {
            if (!element) return true;

            // 如果是文本节点，获取其父元素进行检查
            let checkElement = element;
            if (element.nodeType === Node.TEXT_NODE) {
                checkElement = element.parentElement;
                if (!checkElement) return true;
            }

            // 确保是元素节点
            if (checkElement.nodeType !== Node.ELEMENT_NODE) return true;

            if (IGNORED_TAGS.has(checkElement.tagName)) return true;
            if (this.isEditable(checkElement)) return true;

            // 安全调用 closest
            if (typeof checkElement.closest === 'function') {
                if (checkElement.closest('#magnet-top-panel')) return true;
                if (checkElement.closest('.magnet-btn-wrapper')) return true;
                if (checkElement.closest('.folder-picker-overlay')) return true;if (checkElement.closest('.magnet-toast-container')) return true;
            }

            if (checkElement.classList?.contains('magnet-btn-115')) return true;

            return false;
        },

        // 获取元素的实际父元素（用于安全操作）
        getParentElement(node) {
            if (!node) return null;
            if (node.nodeType === Node.TEXT_NODE) {
                return node.parentElement;
            }
            return node.parentElement || node.parentNode;
        },

        // 【新增】清理和验证 ed2k 链接
        cleanEd2kLink(link) {
            if (!link || !link.startsWith('ed2k://')) return link;

            // ed2k 链接标准格式: ed2k://|file|文件名|文件大小|MD4哈希|/
            // 可选: |h=AICH哈希| 和 |p=分片哈希|
            // 确保链接以 |/ 结尾
            const endIndex = link.indexOf('|/');
            if (endIndex !== -1) {
                return link.substring(0, endIndex + 2);
            }
            return link;
        },

        // 【新增】清理和验证磁力链接
        cleanMagnetLink(link) {
            if (!link || !link.startsWith('magnet:')) return link;

            // 移除链接末尾可能的非法字符
            // 磁力链接应该只包含特定字符
            const validChars = /^magnet:\?xt=urn:btih:[a-zA-Z0-9]+(&[a-zA-Z0-9._%+-]+=[a-zA-Z0-9._%+-]*)*$/;

            // 尝试找到链接的有效结束位置
            let cleanLink = link;

            // 移除末尾的非URL字符
            cleanLink = cleanLink.replace(/[^\w\d%&=.:?+-]+$/, '');

            return cleanLink;
        }
    };

    // ==================== Toast 提示 ====================
    const Toast = {
        show(message, type = 'info') {
            if (!State.toastElement) {
                State.toastElement = document.createElement('div');
                State.toastElement.className = 'magnet-toast-container';document.body.appendChild(State.toastElement);
            }

            if (State.toastTimeout) {
                clearTimeout(State.toastTimeout);
            }

            State.toastElement.textContent = message;
            State.toastElement.className = `magnet-toast-container ${type}`;

            requestAnimationFrame(() => {
                State.toastElement.classList.add('show');
            });

            State.toastTimeout = setTimeout(() => {
                State.toastElement.classList.remove('show');
            }, CONFIG.TOAST_DURATION);
        },

        success(message) { this.show(message, 'success'); },
        error(message) { this.show(message, 'error'); },
        warning(message) { this.show(message, 'warning'); },
        info(message) { this.show(message, 'info'); }
    };

    // ==================== API 请求封装 ====================
// ==================== 替换开始位置：找到 const API = { 这一行 ====================
// ==================== 大约在原脚本第 280 行左右 ====================// ==================== API 请求封装 ====================
    const API = {
        request(options) {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('请求超时'));
                }, options.timeout || CONFIG.REQUEST_TIMEOUT);

                GM_xmlhttpRequest({
                    ...options,
                    headers: {
                        'User-Agent': navigator.userAgent,
                        ...options.headers
                    },
                    withCredentials: true,
                    onload(response) {
                        clearTimeout(timeout);
                        resolve(response);
                    },
                    onerror(error) {
                        clearTimeout(timeout);
                        reject(error);
                    },
                    ontimeout() {
                        clearTimeout(timeout);
                        reject(new Error('请求超时'));
                    }
                });
            });
        },

        async checkLogin() {
            try {
                const response = await this.request({
                    method: 'GET',
                    url: 'https://115.com/?ct=offline&ac=space'
                });
                const data = Utils.safeJsonParse(response.responseText);
                return data?.state || !!(data?.data?.sign);
            } catch {
                return false;
            }
        },

        // 【新增】打开登录窗口并等待登录完成
        loginWindow: null,
        loginCheckInterval: null,
        loginResolve: null,

        async openLoginAndWait() {
            return new Promise((resolve) => {
                // 如果已有登录窗口，先关闭
                if (this.loginWindow && !this.loginWindow.closed) {
                    this.loginWindow.focus();
                    resolve(false);
                    return;
                }

                // 清除之前的检测
                if (this.loginCheckInterval) {
                    clearInterval(this.loginCheckInterval);
                }

                this.loginResolve = resolve;

                // 打开115登录页面
                const width = 1000;
                const height = 800;
                const left = (screen.width - width) / 2;
                const top = (screen.height - height) / 2;

                this.loginWindow = window.open(
                    'https://115.com/?ct=login',
                    '115登录',
                    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
                );

                if (!this.loginWindow) {
                    Toast.error('无法打开登录窗口，请检查浏览器是否阻止了弹窗');
                    resolve(false);
                    return;
                }

                Toast.info('请在弹出窗口中完成登录，登录后将自动继续...');

                // 定期检测登录状态
                let checkCount = 0;
                const maxChecks = 120; // 最多检测2分钟

                this.loginCheckInterval = setInterval(async () => {
                    checkCount++;

                    // 检查窗口是否被关闭
                    if (this.loginWindow.closed) {
                        clearInterval(this.loginCheckInterval);
                        this.loginCheckInterval = null;

                        // 窗口关闭后再检测一次登录状态
                        const isLoggedIn = await this.checkLogin();
                        if (isLoggedIn) {
                            Toast.success('登录成功！');
                            resolve(true);
                        } else {
                            Toast.warning('登录窗口已关闭，请重试');
                            resolve(false);
                        }
                        return;
                    }

                    // 超时检测
                    if (checkCount >= maxChecks) {
                        clearInterval(this.loginCheckInterval);
                        this.loginCheckInterval = null;
                        if (this.loginWindow && !this.loginWindow.closed) {
                            this.loginWindow.close();
                        }
                        Toast.error('登录超时，请重试');
                        resolve(false);
                        return;
                    }

                    // 每秒检测一次登录状态
                    const isLoggedIn = await this.checkLogin();
                    if (isLoggedIn) {
                        clearInterval(this.loginCheckInterval);
                        this.loginCheckInterval = null;
                        if (this.loginWindow && !this.loginWindow.closed) {
                            this.loginWindow.close();
                        }
                        Toast.success('登录成功！正在继续操作...');
                        resolve(true);
                    }
                }, 1000);
            });
        },

        // 【新增】确保已登录，未登录则引导登录
        async ensureLogin() {
            const isLoggedIn = await this.checkLogin();
            if (isLoggedIn) {
                return true;
            }

            Toast.warning('检测到未登录115网盘，正在打开登录窗口...');

            // 等待用户登录
            const loginResult = await this.openLoginAndWait();
            return loginResult;
        },

        async getFolders(cid = 0) {
            const response = await this.request({
                method: 'GET',
                url: `https://webapi.115.com/files?aid=1&cid=${cid}&o=file_name&asc=1&offset=0&show_dir=1&limit=200&format=json`
            });
            return Utils.safeJsonParse(response.responseText);
        },

        async addTask(link, cid = 0, retry = 0) {
            try {
                const response = await this.request({
                    method: 'POST',
                    url: 'https://115.com/web/lixian/?ct=lixian&ac=add_task_url',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Origin': 'https://115.com'
                    },
                    data: `url=${encodeURIComponent(link)}&wp_path_id=${cid}`
                });

                const result = Utils.safeJsonParse(response.responseText);

                if (result?.state || result?.errcode === 10008) {
                    return { success: true, message: '添加成功' };
                }

                const noRetryErrors = [10004, 10008, 911];
                if (noRetryErrors.includes(result?.errcode)) {
                    return {
                        success: false,
                        message: result?.error_msg || '添加失败',
                        noRetry: true
                    };
                }

                throw new Error(result?.error_msg || '添加失败');
            } catch (error) {
                if (retry < CONFIG.MAX_RETRY && !error.noRetry) {
                    await new Promise(r => setTimeout(r, 1000 * (retry + 1)));
                    return this.addTask(link, cid, retry + 1);
                }
                return { success: false, message: error.message || '网络错误' };
            }
        }
    };

// ==================== 替换结束位置 ====================
    // ==================== 配置管理 ====================
// ==================== 修改开始 ====================
const ConfigManager = {
    // 获取当前网站的域名作为键
    getSiteKey() {
        try {
            return location.hostname.replace(/^www\./, '');
        } catch {
            return 'default';
        }
    },

    // 获取所有网站配置
    getAllSiteConfigs() {
        return GM_getValue(CONFIG.SITE_STORAGE_KEY, {});
    },

    // 保存所有网站配置
    setAllSiteConfigs(configs) {
        GM_setValue(CONFIG.SITE_STORAGE_KEY, configs);
    },

    // 获取全局默认配置
    getGlobalDefault() {
        return GM_getValue(CONFIG.STORAGE_KEY, CONFIG.DEFAULT_PATH);
    },

    // 设置全局默认配置
    setGlobalDefault(config) {
        GM_setValue(CONFIG.STORAGE_KEY, config);
    },

    // 获取当前网站的配置（优先网站配置，否则用全局默认）
    get() {
        const siteKey = this.getSiteKey();
        const siteConfigs = this.getAllSiteConfigs();

        if (siteConfigs[siteKey]) {
            return siteConfigs[siteKey];
        }
        return this.getGlobalDefault();
    },

    // 设置当前网站的配置
    set(config) {
        const siteKey = this.getSiteKey();
        const siteConfigs = this.getAllSiteConfigs();
        siteConfigs[siteKey] = config;
        this.setAllSiteConfigs(siteConfigs);
    },

    // 清除当前网站的配置（恢复使用全局默认）
    clearSiteConfig() {
        const siteKey = this.getSiteKey();
        const siteConfigs = this.getAllSiteConfigs();
        delete siteConfigs[siteKey];
        this.setAllSiteConfigs(siteConfigs);
    },

    // 检查当前网站是否有独立配置
    hasSiteConfig() {
        const siteKey = this.getSiteKey();
        const siteConfigs = this.getAllSiteConfigs();
        return !!siteConfigs[siteKey];
    },

    getTargetCid() {
        return this.get().cid;
    },

    getTargetName() {
        return this.get().name;
    }
};
// ==================== 修改结束 ====================


    // ==================== 文件夹选择器 ====================
    const FolderPicker = {
        element: null,
        history: [],
        currentCid: 0,

        async open() {
            Toast.info('正在检查登录状态...');

            const isLoggedIn = await API.checkLogin();
            if (!isLoggedIn) {
                Toast.error('请先登录 115 网盘');
                window.open('https://115.com/?ct=login', '_blank');
                return;
            }

            this.history = [{ cid: 0, name: '根目录' }];
            this.currentCid = 0;
            this.render();
            this.loadFolder(0);
        },

        close() {
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
        },

        render() {
            this.close();

            const overlay = document.createElement('div');
            overlay.className = 'folder-picker-overlay';
            overlay.innerHTML = `
                <div class="folder-picker-modal">
                    <div class="fp-header">
                        <div class="fp-title">📁 选择默认保存目录</div>
                        <div class="fp-close">×</div>
                    </div>
                    <div class="fp-breadcrumbs" id="fp-breadcrumbs"></div>
                    <div class="fp-list" id="fp-list"></div>
                    <div class="fp-footer">
                        <div class="fp-current-path" id="fp-current-path"></div>
                        <div class="fp-footer-actions">
                            <button class="fp-btn fp-btn-cancel">取消</button>
                            <button class="fp-btn fp-btn-save">选择此目录</button>
                        </div>
                    </div>
                </div>
            `;

            overlay.querySelector('.fp-close').onclick = () => this.close();
            overlay.querySelector('.fp-btn-cancel').onclick = () => this.close();
            overlay.querySelector('.fp-btn-save').onclick = () => this.save();
            overlay.onclick = (e) => {
                if (e.target === overlay) this.close();
            };

            this.element = overlay;
            document.body.appendChild(overlay);
        },

        renderBreadcrumbs() {
            const container = this.element.querySelector('#fp-breadcrumbs');
            if (!container) return;

            container.innerHTML = '';

            this.history.forEach((item, index) => {
                const isLast = index === this.history.length - 1;

                if (index > 0) {
                    const sep = document.createElement('span');
                    sep.className = 'fp-crumb-sep';
                    sep.textContent = '›';
                    container.appendChild(sep);
                }

                const span = document.createElement('span');
                span.textContent = item.name;

                if (isLast) {
                    span.className = 'fp-crumb-current';
                } else {
                    span.className = 'fp-crumb-item';
                    span.onclick = () => {
                        this.history = this.history.slice(0, index + 1);
                        this.currentCid = item.cid;
                        this.loadFolder(item.cid);
                    };
                }
                container.appendChild(span);
            });

            container.scrollLeft = container.scrollWidth;

            const pathDisplay = this.element.querySelector('#fp-current-path');
            if (pathDisplay) {
                const fullPath = this.history.map(h => h.name).join(' / ');
                pathDisplay.textContent = `当前: ${fullPath}`;
                pathDisplay.title = fullPath;
            }
        },

        async loadFolder(cid) {
            const listContainer = this.element.querySelector('#fp-list');
            if (!listContainer) return;

            listContainer.innerHTML = '<div class="fp-loading">正在加载...</div>';
            this.renderBreadcrumbs();

            try {
                const result = await API.getFolders(cid);

                if (!result?.state) {
                    listContainer.innerHTML = '<div class="fp-empty">加载失败，请重试</div>';
                    return;
                }

                const folders = (result.data || []).filter(item =>
                    (item.cid || item.category_id) && !item.fid
                );

                if (folders.length === 0) {
                    listContainer.innerHTML = '<div class="fp-empty">📂 此目录下没有子文件夹</div>';
                    return;
                }

                listContainer.innerHTML = '';
                folders.forEach(folder => {
                    const div = document.createElement('div');
                    div.className = 'fp-item';
                    div.innerHTML = `
                        <span class="fp-icon">📁</span>
                        <span class="fp-name">${folder.n || folder.name}</span>
                        <span class="fp-arrow">›</span>
                    `;
                    div.onclick = () => {
                        const folderCid = folder.cid;
                        const folderName = folder.n || folder.name;
                        this.history.push({ cid: folderCid, name: folderName });
                        this.currentCid = folderCid;
                        this.loadFolder(folderCid);
                    };
                    listContainer.appendChild(div);
                });

            } catch (error) {
                console.error('加载文件夹失败:', error);
                listContainer.innerHTML = '<div class="fp-empty">网络错误，请重试</div>';
            }
        },

        // ==================== 修改开始 ====================
save() {
    const currentItem = this.history[this.history.length - 1];
    const config = {
        cid: this.currentCid,
        name: currentItem.name
    };

    ConfigManager.set(config);
    const siteKey = ConfigManager.getSiteKey();
    Toast.success(`已设置 ${siteKey} 的保存目录: ${currentItem.name}`);
    this.close();

    registerMenu();
}
// ==================== 修改结束 ====================

    };

    // ==================== 下载功能 ====================
// ==================== 替换开始位置：找到 const Downloader = { 这一行 ====================
// ==================== 大约在原脚本第 380 行左右 ====================

    // ==================== 下载功能 ====================
    const Downloader = {
        async download(link, buttonElement) {
            if (buttonElement?.classList.contains('loading')) return;

            const originalText = buttonElement?.textContent || '115';

            if (buttonElement) {
                buttonElement.textContent = '...';
                buttonElement.classList.add('loading');
            }

            try {
                // 【修改】使用 ensureLogin 替代直接检查
                const isLoggedIn = await API.ensureLogin();
                if (!isLoggedIn) {
                    throw new Error('未登录');
                }

                const config = ConfigManager.get();
                const result = await API.addTask(link, config.cid);

                if (result.success) {
                    Toast.success(`已保存到: ${config.name}`);
                    if (buttonElement) {
                        buttonElement.classList.remove('loading');
                        buttonElement.classList.add('success');
                        buttonElement.textContent = '✓';
                        setTimeout(() => {
                            buttonElement.classList.remove('success');
                            buttonElement.textContent = originalText;
                        }, 2000);
                    }
                    return true;
                } else {
                    Toast.error(`添加失败: ${result.message}`);
                    throw new Error(result.message);
                }

            } catch (error) {
                if (buttonElement) {
                    buttonElement.classList.remove('loading');
                    buttonElement.classList.add('error');
                    buttonElement.textContent = '✗';
                    setTimeout(() => {
                        buttonElement.classList.remove('error');
                        buttonElement.textContent = originalText;
                    }, 2000);
                }
                return false;
            }
        },

        async batchDownload(links, buttonElement) {
            if (!links || links.length === 0) return;

            if (buttonElement?.classList.contains('loading')) return;

            const originalText = buttonElement?.textContent || '批量下载';

            if (buttonElement) {
                buttonElement.textContent = '检查中...';
                buttonElement.classList.add('loading');
            }

            // 【修改】使用 ensureLogin 替代直接检查
            const isLoggedIn = await API.ensureLogin();
            if (!isLoggedIn) {
                if (buttonElement) {
                    buttonElement.classList.remove('loading');
                    buttonElement.textContent = originalText;
                }
                return;
            }

            const config = ConfigManager.get();
            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < links.length; i++) {
                if (buttonElement) {
                    buttonElement.textContent = `${i + 1}/${links.length}`;
                }

                const result = await API.addTask(links[i], config.cid);

                if (result.success) {
                    successCount++;
                } else {
                    failCount++;
                }

                if (i < links.length - 1) {
                    await new Promise(r => setTimeout(r, 500));
                }
            }

            if (buttonElement) {
                buttonElement.classList.remove('loading');
                if (failCount === 0) {
                    buttonElement.classList.add('success');
                    buttonElement.textContent = '✓ 完成';
                } else {
                    buttonElement.classList.add('error');
                    buttonElement.textContent = `${successCount}成功`;
                }
                setTimeout(() => {
                    buttonElement.classList.remove('success', 'error');
                    buttonElement.textContent = originalText;
                }, 3000);
            }

            if (successCount > 0) {
                Toast.success(`批量添加完成: ${successCount}成功, ${failCount}失败`);
            } else {
                Toast.error('批量添加全部失败');
            }
        }
    };

    // ==================== 顶部面板 ====================
    const TopPanel = {
        updateBodyPadding() {
            if (!State.panelElement) return;
            const panel = State.panelElement;
            const isVisible = panel.classList.contains('show');

            if (isVisible) {
                if (State.originalBodyPaddingTop === null) {
                    State.originalBodyPaddingTop = window.getComputedStyle(document.body).paddingTop;
                }

                requestAnimationFrame(() => {
                    const panelHeight = panel.offsetHeight;
                    const originalPadding = parseInt(State.originalBodyPaddingTop) || 0;
                    document.body.style.paddingTop = (panelHeight + originalPadding) + 'px';
                    document.body.classList.add('magnet-panel-active');
                });
            } else {
                if (State.originalBodyPaddingTop !== null) {
                    document.body.style.paddingTop = State.originalBodyPaddingTop;
                } else {
                    document.body.style.paddingTop = '';
                }
                document.body.classList.remove('magnet-panel-active');
            }
        },

        update() {
            const links = Array.from(State.links.values());

            if (links.length === 0) {
                this.hide();
                return;
            }

            if (State.panelClosed) {
                return;
            }

            if (!State.panelElement) {
                this.create();
            }

            this.render(links);
            this.show();
        },

        create() {
            const panel = document.createElement('div');
            panel.id = 'magnet-top-panel';
            document.body.appendChild(panel);
            State.panelElement = panel;},

        render(links) {
            const panel = State.panelElement;
            if (!panel) return;

            const displayLinks = links.slice(0, CONFIG.MAX_PANEL_LINKS);
            const hasMore = links.length > CONFIG.MAX_PANEL_LINKS;

            panel.innerHTML = `
                <div class="panel-header">
                    <span class="panel-title">🔗 发现 ${links.length} 个下载链接</span>
                    <div class="panel-actions-header">
                        <button class="panel-btn panel-btn-toggle" id="panel-toggle-links">
                            ${State.linksCollapsed ? '显示链接' : '隐藏链接'}
                        </button>
                        ${links.length > 1 ? `
                            <button class="panel-btn panel-btn-batch" id="panel-batch-download">
                                批量下载全部
                            </button>
                        ` : ''}<button class="panel-btn panel-btn-copy" id="panel-copy-all">
                            复制全部
                        </button>
                        <span class="panel-close" id="panel-close">×</span>
                    </div>
                </div>
                <div class="panel-links-container ${State.linksCollapsed ? 'collapsed' : ''}" id="panel-links-container">
                </div>
            `;

            const linksContainer = panel.querySelector('#panel-links-container');

            displayLinks.forEach((item, index) => {
                const row = document.createElement('div');
                row.className = 'panel-row';

                const type = Utils.getLinkType(item.link);
                const displayName = item.name && item.name !== item.link
                    ? Utils.truncate(item.name, 60)
                    : Utils.truncate(item.link, 60);

                row.innerHTML = `
                    <div class="panel-link-info">
                        <div class="panel-link-name" title="${item.link}">${displayName}</div>
                        <div class="panel-link-type"><span class="type-badge ${type}">${type.toUpperCase()}</span><span class="link-preview">${Utils.truncate(item.link, 40)}</span>
                        </div>
                    </div>
                    <div class="panel-row-actions">
                        <button class="panel-btn panel-btn-copy" data-index="${index}">复制</button>
                        <button class="panel-btn panel-btn-download" data-index="${index}">下载到115</button>
                    </div>
                `;

                linksContainer.appendChild(row);
            });

            if (hasMore) {
                const moreRow = document.createElement('div');
                moreRow.className = 'panel-row';
                moreRow.style.cssText = 'justify-content: center; color: #999; font-size: 12px;';
                moreRow.textContent = `还有 ${links.length - CONFIG.MAX_PANEL_LINKS} 个链接未显示...`;
                linksContainer.appendChild(moreRow);
            }

            this.bindEvents(links);

            requestAnimationFrame(() => this.updateBodyPadding());
        },

        bindEvents(links) {
            const panel = State.panelElement;
            if (!panel) return;

            panel.querySelector('#panel-close')?.addEventListener('click', () => {
                this.hide();
                State.panelClosed = true;
            });

            panel.querySelector('#panel-toggle-links')?.addEventListener('click', (e) => {
                State.linksCollapsed = !State.linksCollapsed;
                const container = panel.querySelector('#panel-links-container');
                if (container) {
                    container.classList.toggle('collapsed', State.linksCollapsed);
                }
                e.target.textContent = State.linksCollapsed ? '显示链接' : '隐藏链接';

                requestAnimationFrame(() => this.updateBodyPadding());
            });

            panel.querySelector('#panel-copy-all')?.addEventListener('click', () => {
                const allLinks = links.map(l => l.link).join('\n');
                this.copyToClipboard(allLinks);
                Toast.success(`已复制 ${links.length} 个链接`);
            });

            panel.querySelector('#panel-batch-download')?.addEventListener('click', (e) => {
                const allLinks = links.map(l => l.link);
                Downloader.batchDownload(allLinks, e.target);
            });

            panel.querySelectorAll('.panel-btn-copy[data-index]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    if (links[index]) {
                        this.copyToClipboard(links[index].link);
                        Toast.success('链接已复制');
                    }
                });
            });

            panel.querySelectorAll('.panel-btn-download[data-index]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    if (links[index]) {
                        Downloader.download(links[index].link, btn);
                    }
                });
            });
        },

        copyToClipboard(text) {
            try {
                GM_setClipboard(text);} catch {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.cssText = 'position:fixed;left:-9999px;';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
            }
        },

        show() {
            if (State.panelElement) {
                State.panelElement.classList.add('show');
                requestAnimationFrame(() => this.updateBodyPadding());
            }
        },

        hide() {
            if (State.panelElement) {
                State.panelElement.classList.remove('show');
                this.updateBodyPadding();
            }
        }
    };

    // ==================== 链接扫描器 ====================
    const Scanner = {
        // 【新增】验证并清理链接
        validateAndCleanLink(link, type) {
            if (!link) return null;

            link = link.trim();

            if (type === 'ed2k') {
                // ed2k 链接必须以 |/ 结尾
                // 标准格式: ed2k://|file|文件名|文件大小|MD4哈希|/
                const ed2kEndIndex = link.indexOf('|/');
                if (ed2kEndIndex !== -1) {
                    // 截取到 |/ 为止（包含 |/）
                    return link.substring(0, ed2kEndIndex + 2);
                }
                // 如果没有找到 |/，检查是否是不完整的链接
                return null;
            } else if (type === 'magnet') {
                // 磁力链接清理
                // 移除末尾可能的非法字符（中文、特殊符号等）
                // 磁力链接只应包含: 字母、数字、%、&、=、.、:、?、+、-
                let cleanLink = link;

                // 找到第一个非法字符的位置
                const validPattern = /^magnet:\?[a-zA-Z0-9%&=.:?+\-_~]+/;
                const match = cleanLink.match(validPattern);
                if (match) {
                    cleanLink = match[0];
                }

                // 确保链接包含有效的 btih
                if (!/xt=urn:btih:[a-zA-Z0-9]{32,40}/i.test(cleanLink)) {
                    return null;
                }

                return cleanLink;
            }

            return link;
        },

        registerLink(link, name) {
            link = link.trim();
            if (!link) return;

            // 【修复】根据链接类型进行清理和验证
            const type = Utils.getLinkType(link);
            const cleanedLink = this.validateAndCleanLink(link, type);

            if (!cleanedLink) {
                console.warn('115云盘链接助手: 无效链接已忽略:', link);
                return;
            }

            if (State.links.has(cleanedLink)) {
                const existing = State.links.get(cleanedLink);
                if (name && name !== cleanedLink && (!existing.name || existing.name === cleanedLink)) {
                    State.links.set(cleanedLink, { link: cleanedLink, name });
                }
            } else {
                const extractedName = Utils.extractFileName(cleanedLink);
                const finalName = name && name !== cleanedLink ? name : (extractedName || cleanedLink);
                State.links.set(cleanedLink, { link: cleanedLink, name: finalName });
            }
        },

        createButton(link, element) {
            if (Utils.shouldIgnoreElement(element)) return;

            // 【修复】先清理链接
            const type = Utils.getLinkType(link);
            const cleanedLink = this.validateAndCleanLink(link, type);

            if (!cleanedLink) return;
            if (State.buttons.has(cleanedLink)) return;

            let linkName = cleanedLink;

            let actualElement = element;
            if (element.nodeType === Node.TEXT_NODE) {
                actualElement = element.parentElement;
            }

            if (actualElement && actualElement.tagName === 'A') {
                linkName = actualElement.innerText?.trim() || actualElement.textContent?.trim() || cleanedLink;
            }

            this.registerLink(cleanedLink, linkName);

            const wrapper = document.createElement('span');
            wrapper.className = 'magnet-btn-wrapper';
            wrapper.dataset.magnetLink = cleanedLink;

            const button = document.createElement('button');
            button.className = 'magnet-btn-115';
            button.textContent = '115';
            button.title = '保存到 115 网盘';

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();Downloader.download(cleanedLink, button);
            });

            wrapper.appendChild(button);

            try {
                if (element.nodeType === Node.TEXT_NODE) {
                    const text = element.textContent;
                    // 【修复】使用原始链接查找位置，但存储清理后的链接
                    const index = text.indexOf(link);
                    if (index !== -1 && element.parentNode) {
                        const range = document.createRange();
                        range.setStart(element, Math.min(index + link.length, text.length));
                        range.collapse(true);
                        range.insertNode(wrapper);
                    }
                } else if (actualElement && actualElement.tagName === 'A') {
                    actualElement.parentNode?.insertBefore(wrapper, actualElement.nextSibling);
                } else if (actualElement && ['LI', 'P', 'DIV', 'TD', 'DD', 'SPAN'].includes(actualElement.tagName)) {
                    actualElement.appendChild(wrapper);
                } else if (actualElement) {
                    actualElement.parentNode?.insertBefore(wrapper, actualElement.nextSibling);
                }

                State.buttons.add(cleanedLink);
            } catch (error) {
                console.warn('115云盘链接助手: 插入按钮失败:', error);
            }
        },

        scanAnchors() {
            document.querySelectorAll('a[href^="magnet:?"]').forEach(a => {
                if (!Utils.shouldIgnoreElement(a)) {
                    const cleanedLink = this.validateAndCleanLink(a.href, 'magnet');
                    if (cleanedLink) {
                        this.registerLink(cleanedLink, a.innerText);this.createButton(a.href, a);
                    }
                }
            });

            document.querySelectorAll('a[href^="ed2k://"]').forEach(a => {
                if (!Utils.shouldIgnoreElement(a)) {
                    const cleanedLink = this.validateAndCleanLink(a.href, 'ed2k');
                    if (cleanedLink) {
                        this.registerLink(cleanedLink, a.innerText);
                        this.createButton(a.href, a);
                    }
                }
            });
        },

        scanTextNodes() {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {
                        if (!node.parentElement) return NodeFilter.FILTER_REJECT;
                        if (Utils.shouldIgnoreElement(node.parentElement)) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        const text = node.textContent;
                        if (text.includes('magnet:?') || text.includes('ed2k://')) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        return NodeFilter.FILTER_SKIP;
                    }
                }
            );

            const nodesToProcess = [];
            while (walker.nextNode()) {
                nodesToProcess.push(walker.currentNode);
            }

            nodesToProcess.forEach(node => {
                const text = node.textContent;

                // 【修复】使用改进的正则匹配
                const magnetMatches = text.match(REGEX.MAGNET);
                magnetMatches?.forEach(link => {
                    const cleanedLink = this.validateAndCleanLink(link, 'magnet');
                    if (cleanedLink) {
                        this.registerLink(cleanedLink, cleanedLink);
                        this.createButton(link, node);
                    }
                });

                const ed2kMatches = text.match(REGEX.ED2K);
                ed2kMatches?.forEach(link => {
                    const cleanedLink = this.validateAndCleanLink(link, 'ed2k');
                    if (cleanedLink) {
                        this.registerLink(cleanedLink, cleanedLink);
                        this.createButton(link, node);
                    }
                });
            });
        },

        scanCodeBlocks() {
            document.querySelectorAll(CODE_BLOCK_SELECTOR).forEach(block => {
                if (Utils.shouldIgnoreElement(block)) return;

                const text = block.innerText || block.textContent;
                if (!text) return;

                const magnetMatches = text.match(REGEX.MAGNET);
                magnetMatches?.forEach(link => {
                    const cleanedLink = this.validateAndCleanLink(link, 'magnet');
                    if (cleanedLink) {
                        this.registerLink(cleanedLink, cleanedLink);
                    }
                });

                const ed2kMatches = text.match(REGEX.ED2K);
                ed2kMatches?.forEach(link => {
                    const cleanedLink = this.validateAndCleanLink(link, 'ed2k');
                    if (cleanedLink) {
                        this.registerLink(cleanedLink, cleanedLink);
                    }
                });
            });
        },

        clearAllButtons() {
            document.querySelectorAll('.magnet-btn-wrapper').forEach(wrapper => {
                wrapper.remove();
            });
            State.buttons.clear();
        },

        scan() {
            if (State.isScanning) return;
            State.isScanning = true;

            try {
                this.scanAnchors();
                this.scanTextNodes();
                this.scanCodeBlocks();
                TopPanel.update();
            } catch (error) {
                console.error('115云盘链接助手: 扫描出错:', error);
            } finally {
                State.isScanning = false;
            }
        },

        fullRescan() {
            this.clearAllButtons();
            State.links.clear();
            State.panelClosed = false;
            this.scan();
        },debouncedScan: null
    };

    Scanner.debouncedScan = Utils.debounce(() => Scanner.scan(), CONFIG.SCAN_DEBOUNCE);

    // ==================== 菜单注册 ====================
// ==================== 修改开始 ====================
function registerMenu() {
    const config = ConfigManager.get();
    const siteKey = ConfigManager.getSiteKey();
    const hasSiteConfig = ConfigManager.hasSiteConfig();

    // 显示当前网站的配置状态
    const menuLabel = hasSiteConfig
        ? `📂 本站目录: ${config.name}`
        : `📂 使用默认: ${config.name}`;

    GM_registerMenuCommand(
        menuLabel,
        () => FolderPicker.open()
    );

    // 如果当前网站有独立配置，提供清除选项
    if (hasSiteConfig) {
        GM_registerMenuCommand(
            '🗑️ 清除本站目录设置',
            () => {
                ConfigManager.clearSiteConfig();
                const globalDefault = ConfigManager.getGlobalDefault();
                Toast.success(`已清除本站设置，将使用默认目录: ${globalDefault.name}`);
                registerMenu();
            }
        );
    }

    GM_registerMenuCommand(
        `⚙️ 设置全局默认目录 [${ConfigManager.getGlobalDefault().name}]`,
        () => {
            // 临时修改保存逻辑为全局
            const originalSave = FolderPicker.save;
            FolderPicker.save = function() {
                const currentItem = this.history[this.history.length - 1];
                const config = {
                    cid: this.currentCid,
                    name: currentItem.name
                };
                ConfigManager.setGlobalDefault(config);
                Toast.success(`已设置全局默认目录: ${currentItem.name}`);
                this.close();
                FolderPicker.save = originalSave;
                registerMenu();
            };
            FolderPicker.open();
        }
    );

    GM_registerMenuCommand(
        '🔄 重新扫描页面',
        () => {
            Scanner.fullRescan();
            Toast.info('已重新扫描页面');
        }
    );

    GM_registerMenuCommand(
        '📋 复制所有链接',
        () => {
            const links = Array.from(State.links.values());
            if (links.length === 0) {
                Toast.warning('未发现任何链接');
                return;
            }
            const text = links.map(l => l.link).join('\n');
            TopPanel.copyToClipboard(text);
            Toast.success(`已复制 ${links.length} 个链接`);
        }
    );

    GM_registerMenuCommand(
        '👁️ 显示/隐藏链接面板',
        () => {
            if (State.links.size === 0) {
                Toast.warning('未发现任何链接');
                return;
            }
            if (State.panelElement?.classList.contains('show')) {
                TopPanel.hide();
                State.panelClosed = true;
            } else {
                State.panelClosed = false;
                TopPanel.update();
            }
        }
    );
}
// ==================== 修改结束 ====================


    // ==================== 初始化 ====================
    function init() {
        registerMenu();

        if (location.hostname.includes('115.com')) {
            console.log('115云盘链接助手: 在 115 官网，停止扫描');
            return;
        }

        Scanner.scan();

        State.observer = new MutationObserver((mutations) => {
            let hasRelevantChanges = false;

            for (const mutation of mutations) {
                const target = mutation.target;
                if (target && typeof target.closest === 'function') {
                    if (target.closest('#magnet-top-panel')) continue;
                    if (target.closest('.magnet-btn-wrapper')) continue;
                    if (target.closest('.folder-picker-overlay')) continue;
                    if (target.closest('.magnet-toast-container')) continue;
                } else if (target && target.parentElement && typeof target.parentElement.closest === 'function') {
                    if (target.parentElement.closest('#magnet-top-panel')) continue;
                    if (target.parentElement.closest('.magnet-btn-wrapper')) continue;
                    if (target.parentElement.closest('.folder-picker-overlay')) continue;
                    if (target.parentElement.closest('.magnet-toast-container')) continue;
                }

                if (mutation.addedNodes.length > 0) {
                    hasRelevantChanges = true;
                    break;
                }
            }

            if (hasRelevantChanges) {
                Scanner.debouncedScan();
            }
        });

        State.observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('115云盘链接助手: 初始化完成');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('unload', () => {
        if (State.observer) {
            State.observer.disconnect();
        }
        if (State.toastTimeout) {
            clearTimeout(State.toastTimeout);
        }if (State.scanTimeout) {
            clearTimeout(State.scanTimeout);
        }if (State.originalBodyPaddingTop !== null) {
            document.body.style.paddingTop = State.originalBodyPaddingTop;}
        document.body.classList.remove('magnet-panel-active');
    });

})();
