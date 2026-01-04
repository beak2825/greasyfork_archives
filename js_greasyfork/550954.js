// ==UserScript==
// @name         123网盘链接检测助手
// @namespace    https://pan1.me
// @version      1.4.0
// @description  极速多链接并发检测，智能状态持久化显示，自动提取码填充，实时回复检测，
// @author       绘梦
// @license      CC BY-NC-ND 4.0
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMxODc1ZmYiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTggNGg4YzEuMSAwIDIgLjkgMiAydjEyYzAgMS4xLS45IDItMiAySDhjLTEuMSAwLTItLjktMi0yVjZjMC0xLjEuOS0yIDItMnoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiA4djgiIHN0cm9rZT0iIzE4NzVmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHN2ZyB4PSIxOCIgeT0iMTgiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHZpZXdCb3g9IjAgMCA4IDgiPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMyIgZmlsbD0iIzEwYjk4MSIvPgo8L3N2Zz4KPC9zdmc+Cjwvc3ZnPg==
// @match        *//*/*
// @match        https://pan1.me/*
// @match        https://123panfx.com/*
// @match        https://*.123pan.com/*
// @match        https://*.123865.com/*
// @match        https://*.123684.com/*
// @match        https://*.123yunpan.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      123pan.com
// @connect      123865.com
// @connect      123684.com
// @connect      123yunpan.com
// @connect      *
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550954/123%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E6%A3%80%E6%B5%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550954/123%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E6%A3%80%E6%B5%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
 * 123网盘链接检测助手 v1.4.0
 *
 * 版权所有 (c) 2025 绘梦
 *
 * 本作品采用知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议进行许可。
 * 要查看该许可协议，可访问 http://creativecommons.org/licenses/by-nc-nd/4.0/
 *
 * 许可协议要点：
 * ✅ 署名 - 您必须给出适当的署名
 * ❌ 非商业性使用 - 您不得将本作品用于商业目的
 * ❌ 禁止演绎 - 您不得修改、转换或以此为基础创作
 *
 * 警告：未经授权的修改、商业使用或再分发将构成侵权行为
 */

(function() {
    'use strict';

    // 配置参数 - 极速检测版
    const CONFIG = {
        // 高速链接检测模式
        linkPattern: /https?:\/\/(?:www\.)?[a-z0-9]*123[a-z0-9]*\.com\/s\/[A-Za-z0-9\-_]+/g,
        extractCodeRegex: /(?:提取码|密码|pwd)[:：=\s]*([A-Za-z0-9]{4,8})/i,
        maxConcurrentChecks: Infinity, // 无限并发，极速处理所有链接
        requestTimeout: 500,    // 缩短超时时间
        retryAttempts: 0,        // 取消重试，直接失败
        // 缓存配置（24小时缓存）
        cacheExpireTime: 24 * 60 * 60 * 1000,
        // 同域检测配置
        sameDomainDetection: true,
        realtimeDetection: true,
        detectionInterval: 2000  // 减少实时检测频率，避免资源浪费
    };

    // 状态标记样式
    const STATUS_STYLES = {
        valid: 'color: #28a745; font-weight: bold; background: #d4edda; padding: 2px 6px; border-radius: 3px;',
        invalid: 'color: #dc3545; text-decoration: line-through; background: #f8d7da; padding: 2px 6px; border-radius: 3px;',
        processing: 'color: #fd7e14; background: #fff3cd; padding: 2px 6px; border-radius: 3px;',
        encrypted: 'color: #6f42c1; background: #e2e3f0; padding: 2px 6px; border-radius: 3px;',
        error: 'color: #868e96; background: #f8f9fa; padding: 2px 6px; border-radius: 3px;',
        unknown: 'color: #6c757d; background: #e9ecef; padding: 2px 6px; border-radius: 3px;'
    };

    // 用户代理列表（随机化）
    const USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
    ];

    // 统一的全局状态管理（避免变量分散）
    const GlobalState = {
        // 链接检测状态
        checkedLinks: new Set(),
        linkStatusMap: new Map(),
        isScanning: false,
        activeRequests: 0,

        // 同域检测状态
        sameDomainDetector: null,
        detectionTimer: null,

        // 回复功能状态
        replyState: { tried: false, inProgress: false },

        // 缓存状态
        pageContentCache: null,
        lastContentCheck: 0,

        // 智能缓存系统（24小时有效）
        linkCache: new Map(),

        // 分组管理状态
        activeGroupCount: 0,
        pendingLinksInGroup: 0,


        // 调试模式
        debugMode: false,

        // 重置所有状态
        reset() {
            this.checkedLinks.clear();
            this.linkStatusMap.clear();
            this.linkCache.clear();
            this.isScanning = false;
            this.activeRequests = 0;
            this.replyState = { tried: false, inProgress: false };
            this.pageContentCache = null;
            this.lastContentCheck = 0;
        },

        // 缓存管理方法
        getCachedResult(url) {
            const cached = this.linkCache.get(url);
            if (cached && (Date.now() - cached.timestamp < CONFIG.cacheExpireTime)) {
                return cached;
            }
            return null;
        },

        setCachedResult(url, status, method = 'unknown') {
            this.linkCache.set(url, {
                status: status,
                method: method,
                timestamp: Date.now()
            });

            // 限制缓存大小（最多100个）
            if (this.linkCache.size > 100) {
                const oldestKey = this.linkCache.keys().next().value;
                this.linkCache.delete(oldestKey);
            }
        }
    };


    // 核心功能立即启动（不依赖控制面板）
    function init() {
        // 启动手动回复按钮检测
        initManualReplyButton();

        // 启动定期清理机制（防内存泄漏）
        startPeriodicCleanup();

        // 立即启动核心检测功能 - 统一检测系统
        try {
            // 启动统一的实时检测系统（合并所有检测逻辑）
            startUnifiedDetection();

            // 立即扫描现有链接（仅执行一次）- 极速模式
            const existingLinks = findPanLinks();
            if (existingLinks.length > 0) {
                console.groupCollapsed(`发现 ${existingLinks.length} 个链接，极速检测启动`);
                GlobalState.pendingLinksInGroup = existingLinks.length;
                GlobalState.activeGroupCount++;
                // 全部链接立即并发检测，无延迟
                existingLinks.forEach(checkLink);
            }

            if (isOn123PanSite()) {
                initAutoFillExtractCode();
                if (CONFIG.sameDomainDetection) {
                    initSameDomainDetection();
                }
            }

        } catch (error) {
            // 静默处理错误
        }

    }

    // 彻底修复的链接查找（防重复识别）
    function findPanLinks() {
        const links = [];
        const foundUrls = new Set(); // 严格去重

        // 1. 优先查找a标签链接
        const aLinks = document.querySelectorAll('a[href]');
        aLinks.forEach(link => {
            if (isPanLink(link.href)) {
                const normalizedUrl = normalizeUrl(link.href);
                if (!foundUrls.has(normalizedUrl)) {
                    foundUrls.add(normalizedUrl);

                    // 为现有a标签链接也自动附加提取码
                    enhanceExistingLink(link);

                    links.push(link);
                }
            }
        });

        // 2. 查找并转换纯文本链接为可点击链接
        const textNodes = getTextNodes(document.body);
        textNodes.forEach(node => {
            // 检查文本节点是否在a标签内
            if (node.parentElement && node.parentElement.closest('a[href]')) {
                return; // 跳过已在a标签中的文本
            }

            const matches = node.textContent.match(CONFIG.linkPattern);
            if (matches) {
                matches.forEach(url => {
                    const normalizedUrl = normalizeUrl(url);
                    if (!foundUrls.has(normalizedUrl)) {
                        foundUrls.add(normalizedUrl);

                        // 创建真实的可点击a标签
                        const clickableLink = createClickableLink(url, node);
                        if (clickableLink) {
                            links.push(clickableLink);
                        }
                    }
                });
            }
        });

        return links;
    }

    // URL标准化（去除参数差异）
    function normalizeUrl(url) {
        try {
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
        } catch (e) {
            return url.split('?')[0]; // 简单去参数
        }
    }

    // 创建可点击的链接（替换纯文本，自动附加提取码）
    function createClickableLink(url, textNode) {
        try {
            const parent = textNode.parentElement;
            if (!parent) return null;

            // 查找周围的提取码
            const extractCode = findExtractCodeNearElement(textNode);

            // 如果找到提取码且URL中没有密码参数，则自动附加
            let finalUrl = url;
            if (extractCode && !url.includes('pwd=')) {
                const separator = url.includes('?') ? '&' : '?';
                finalUrl = `${url}${separator}pwd=${extractCode}`;
            }

            // 创建可点击的a标签
            const linkElement = document.createElement('a');
            linkElement.href = finalUrl;
            linkElement.textContent = url; // 显示原始URL，但实际跳转带提取码
            linkElement.target = '_blank'; // 新标签页打开
            linkElement.rel = 'noopener noreferrer'; // 安全性
            linkElement.style.cssText = `
                color: #007bff;
                text-decoration: underline;
                cursor: pointer;
                word-break: break-all;
                padding: 2px 4px;
                border-radius: 3px;
                background-color: rgba(0, 123, 255, 0.1);
                transition: background-color 0.2s ease;
            `;

            // 添加悬停效果
            linkElement.addEventListener('mouseenter', () => {
                linkElement.style.backgroundColor = 'rgba(0, 123, 255, 0.2)';
            });

            linkElement.addEventListener('mouseleave', () => {
                linkElement.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
            });

            // 替换文本节点中的URL为可点击链接
            const textContent = textNode.textContent;
            const urlIndex = textContent.indexOf(url);

            if (urlIndex !== -1) {
                // 分割文本：前部分 + 链接 + 后部分
                const beforeText = textContent.substring(0, urlIndex);
                const afterText = textContent.substring(urlIndex + url.length);

                // 创建文档片段
                const fragment = document.createDocumentFragment();

                // 添加前部分文本
                if (beforeText) {
                    fragment.appendChild(document.createTextNode(beforeText));
                }

                // 添加可点击链接
                fragment.appendChild(linkElement);

                // 添加后部分文本
                if (afterText) {
                    fragment.appendChild(document.createTextNode(afterText));
                }

                // 替换原文本节点
                parent.replaceChild(fragment, textNode);

                return linkElement;
            }

            return null;
        } catch (e) {
            console.warn('创建可点击链接失败:', e);
            return null;
        }
    }

    // 获取所有文本节点
    function getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 跳过script、style等标签
                    const parent = node.parentElement;
                    if (parent && ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 只处理包含123链接的文本节点
                    if (CONFIG.linkPattern.test(node.textContent)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        return textNodes;
    }

    // 精简的链接验证
    function isPanLink(url) {
        return CONFIG.linkPattern.test(url);
    }

    // 检测是否在123网盘站点
    function isOn123PanSite() {
        const hostname = window.location.hostname.toLowerCase();
        return /123[a-z0-9]*\.com$/.test(hostname);
    }

    // ==================== 一比一复刻的专业检测系统 ====================

    // 同域检测配置（完全复刻参考脚本）
    const SAME_ORIGIN_CONFIG = {
        // 123网盘相关域名（扩展支持更多子域名）
        domains: [
            '123pan.com',      // 官方主域名
            '123865.com',      // 常见子域名
            '123684.com',      // 常见子域名
            '123912.com',      // 新发现的子域名
            '123yunpan.com',   // 云盘子域名
            '123netdisk.com',  // 网盘子域名
            '123disk.com',     // 磁盘子域名
            '123file.com',     // 文件子域名
            '123share.com'     // 分享子域名
        ],
        // 支持同域检测的页面路径
        supportedPaths: ['/s/', '/share/', '/home/share/']
    };

    // 精简日志管理器（防重复版）
    const Log = {
        _lastMessages: new Map(),
        _maxCacheSize: 50,

        // 智能防重复日志输出
        _logWithDedupe(level, icon, ...args) {
            const message = args.join(' ');
            const now = Date.now();

            // 对于包含数字的消息（如"发现 X 个链接"），使用特殊处理
            if (/发现\s+\d+\s+个/.test(message) || /检测完成/.test(message)) {
                // 多链接相关日志允许更频繁输出
                const key = `${level}:${message.replace(/\d+/g, 'N')}`;
                if (this._lastMessages.has(key)) {
                    const lastTime = this._lastMessages.get(key);
                    if (now - lastTime < 2000) return; // 2秒内不重复
                }
                this._lastMessages.set(key, now);
            } else {
                // 其他日志保持5秒去重
                const key = `${level}:${message}`;
                if (this._lastMessages.has(key)) {
                    const lastTime = this._lastMessages.get(key);
                    if (now - lastTime < 5000) return;
                }
                this._lastMessages.set(key, now);
            }

            // 限制缓存大小
            if (this._lastMessages.size > this._maxCacheSize) {
                const oldestKey = this._lastMessages.keys().next().value;
                this._lastMessages.delete(oldestKey);
            }

            console.log(icon, ...args);
        },

        info: (...args) => Log._logWithDedupe('info', 'ℹ️', ...args),
        success: (...args) => Log._logWithDedupe('success', '✅', ...args),
        warn: (...args) => Log._logWithDedupe('warn', '⚠️', ...args),
        error: (...args) => Log._logWithDedupe('error', '❌', ...args),
        debug: (...args) => GlobalState.debugMode && Log._logWithDedupe('debug', '🔍', ...args),

        // 分组日志（减少使用）
        group: (name, collapsed = true) => GlobalState.debugMode && console[collapsed ? 'groupCollapsed' : 'group'](`🔍 [${name}]`),
        groupEnd: () => GlobalState.debugMode && console.groupEnd()
    };

    // 专业的123网盘页面状态检测器（一比一复刻）
    function detectPanPageStatus(doc) {
        const body = doc.body;
        const text = body.textContent;
        const detectedElements = [];

        // 检测元素可见性
        function checkElementVisibility(element) {
            if (!element) return false;
            const style = doc.defaultView.getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                return false;
            }
            return true;
        }

        // 1. 优先检测"提取文件"按钮（最可靠的有效页面标志）
        const buttons = body.querySelectorAll('button');
        for (const button of buttons) {
            const buttonText = button.textContent || '';
            if ((buttonText.includes('提取文件') || buttonText.includes('取文件') || buttonText.includes('extract')) && checkElementVisibility(button)) {
                detectedElements.push('提取文件按钮');
                return {
                    status: '有效页面（提取文件）',
                    isValid: true,
                    needsPassword: false,
                    confidence: 0.98,
                    detectedElements
                };
            }
        }

        // 1.5. 检测下载按钮和保存按钮（高置信度有效特征）
        for (const button of buttons) {
            const buttonText = button.textContent || '';
            if ((buttonText.includes('下载') || buttonText.includes('保存至云盘') || buttonText.includes('浏览器下载')) && checkElementVisibility(button)) {
                detectedElements.push('下载/保存按钮');
                return {
                    status: '有效页面（下载）',
                    isValid: true,
                    needsPassword: false,
                    confidence: 0.96,
                    detectedElements
                };
            }
        }

        // 2. 检测失效页面特征（增强版）
        const invalidTextPatterns = [
            '分享链接已失效', '分享链接不存在', '分享已过期', '链接已失效',
            '文件不存在', '文件已被删除', '分享不存在', '资源不存在',
            'share not found', 'file not found', 'link expired'
        ];

        for (const pattern of invalidTextPatterns) {
            if (text.includes(pattern)) {
                detectedElements.push(`失效文本: ${pattern}`);
                return {
                    status: '失效页面',
                    isValid: false,
                    needsPassword: false,
                    confidence: 0.95,
                    detectedElements
                };
            }
        }

        // 检测失效页面的CSS类名和元素
        const invalidSelectors = ['.shareWeb404', '.error-page', '.not-found', '.expired'];
        for (const selector of invalidSelectors) {
            const element = body.querySelector(selector);
            if (element && checkElementVisibility(element)) {
                detectedElements.push(`失效元素: ${selector}`);
                return {
                    status: '失效页面',
                    isValid: false,
                    needsPassword: false,
                    confidence: 0.95,
                    detectedElements
                };
            }
        }

        // 3. 检测提取码输入页面
        const passwordInput = body.querySelector('input[type="password"]');
        if (passwordInput && checkElementVisibility(passwordInput)) {
            detectedElements.push('密码输入框');
            return {
                status: '提取码输入页面',
                isValid: true,
                needsPassword: true,
                confidence: 0.92,
                detectedElements
            };
        }

        if (text.includes('请输入提取码')) {
            detectedElements.push('提取码提示文本');
            return {
                status: '提取码输入页面',
                isValid: true,
                needsPassword: true,
                confidence: 0.90,
                detectedElements
            };
        }

        // 4. 检测文件列表页面（多重特征评分）
        let fileListScore = 0;
        const fileListFeatures = [
            { selector: '.file-list', score: 0.4, name: 'file-list元素' },
            { selector: '.ant-table', score: 0.4, name: 'ant-table元素' },
            { selector: '.ant-table-wrapper', score: 0.4, name: 'ant-table-wrapper元素' },
            { selector: '.file-item', score: 0.3, name: 'file-item元素' },
            { text: '文件大小', score: 0.3, name: '文件大小文本' },
            { text: '修改时间', score: 0.3, name: '修改时间文本' },
            { text: '下载', score: 0.2, name: '下载文本' },
            { text: '预览', score: 0.2, name: '预览文本' },
            { text: '保存至云盘', score: 0.3, name: '保存至云盘文本' },
            { text: '浏览器下载', score: 0.3, name: '浏览器下载文本' },
            { text: '文件列表', score: 0.3, name: '文件列表文本' }
        ];

        for (const feature of fileListFeatures) {
            if (feature.selector) {
                const element = body.querySelector(feature.selector);
                if (element && checkElementVisibility(element)) {
                    fileListScore += feature.score;
                    detectedElements.push(feature.name);
                }
            } else if (feature.text && text.includes(feature.text)) {
                fileListScore += feature.score;
                detectedElements.push(feature.name);
            }
        }

        if (fileListScore >= 0.6) {
            return {
                status: '文件列表页面',
                isValid: true,
                needsPassword: false,
                confidence: Math.min(0.95, 0.7 + fileListScore * 0.2),
                detectedElements
            };
        }

        // 5. 检测其他有效页面特征
        const contentLayoutPage = body.querySelector('.content-layout-page');
        if (contentLayoutPage && checkElementVisibility(contentLayoutPage)) {
            detectedElements.push('content-layout-page元素');
            return {
                status: '有效页面（布局）',
                isValid: true,
                needsPassword: false,
                confidence: 0.85,
                detectedElements
            };
        }

        // 6. 默认状态
        return {
            status: '未知状态',
            isValid: false,
            needsPassword: false,
            confidence: 0.3,
            detectedElements: ['无关键元素']
        };
    }

    // 增强页面分析 - 高精度多层检测（优化版）
    function enhancedPageAnalysis(html, doc) {
        const htmlLower = html.toLowerCase();
        const textContent = doc.body ? doc.body.textContent : '';
        const detectedElements = [];


        // 1. 优先检测最明确的有效页面特征（提升精度）

        // 检测"提取文件"按钮 - 最可靠的有效标志
        if (htmlLower.includes('提取文件') || htmlLower.includes('extract') || htmlLower.includes('取文件')) {
            detectedElements.push('提取文件按钮文本');
            return {
                status: '有效页面（提取文件）',
                isValid: true,
                needsPassword: false,
                confidence: 0.98,
                detectedElements
            };
        }

        // 2. 检测失效页面的明确特征（扩展模式）
        const invalidPatterns = [
            '分享链接已失效', '分享链接不存在', '链接已失效', '文件不存在',
            '分享已过期', 'share not found', 'file not found', '404'
        ];

        for (const pattern of invalidPatterns) {
            if (htmlLower.includes(pattern.toLowerCase())) {
                detectedElements.push(`失效特征: ${pattern}`);
                return {
                    status: '失效页面',
                    isValid: false,
                    needsPassword: false,
                    confidence: 0.95,
                    detectedElements
                };
            }
        }

        // 3. 检测密码输入页面（增强精度）
        const passwordPatterns = [
            '请输入提取码', '输入提取码', '提取码', 'access code', 'password'
        ];

        for (const pattern of passwordPatterns) {
            if (htmlLower.includes(pattern.toLowerCase())) {
                detectedElements.push(`密码特征: ${pattern}`);
                return {
                    status: '提取码输入页面',
                    isValid: true,
                    needsPassword: true,
                    confidence: 0.92,
                    detectedElements
                };
            }
        }

        // 4. 检测文件列表页面的多重特征（评分系统）
        let fileListScore = 0;
        const fileListPatterns = [
            { pattern: '文件大小', score: 0.3 },
            { pattern: '修改时间', score: 0.3 },
            { pattern: 'file-list', score: 0.4 },
            { pattern: 'ant-table', score: 0.3 },
            { pattern: '下载', score: 0.2 },
            { pattern: '预览', score: 0.2 },
            { pattern: '保存至云盘', score: 0.3 },
            { pattern: 'content-layout-page', score: 0.3 }
        ];

        for (const { pattern, score } of fileListPatterns) {
            if (htmlLower.includes(pattern.toLowerCase())) {
                fileListScore += score;
                detectedElements.push(`文件列表特征: ${pattern}`);
            }
        }

        if (fileListScore >= 0.6) {
            return {
                status: '文件列表页面',
                isValid: true,
                needsPassword: false,
                confidence: Math.min(0.95, 0.7 + fileListScore * 0.2),
                detectedElements
            };
        }

        // 5. 检测其他有效页面特征
        const validPatterns = [
            '分享文件', '共享文件', '文件分享', 'shared file', 'file share'
        ];

        for (const pattern of validPatterns) {
            if (htmlLower.includes(pattern.toLowerCase())) {
                detectedElements.push(`有效特征: ${pattern}`);
                return {
                    status: '有效页面（分享）',
                    isValid: true,
                    needsPassword: false,
                    confidence: 0.85,
                    detectedElements
                };
            }
        }

        // 6. 如果没有明确特征，返回null让专业检测器处理
        return null;
    }

    // 同域检测函数（一比一复刻）
    async function checkLinkBySameOrigin(shareUrl, extractCode = '') {
        return new Promise((resolve) => {
            let resolved = false;

            // 设置3秒超时（极速模式）
            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(null);
                }
            }, 3000);

            const targetUrl = extractCode ? `${shareUrl}?pwd=${extractCode}` : shareUrl;

            GM_xmlhttpRequest({
                method: 'GET',
                url: targetUrl,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Referer': 'https://www.123pan.com/'
                },
                timeout: 3000,
                onload: function(response) {
                    if (resolved) return;
                    clearTimeout(timeout);
                    resolved = true;

                    try {
                        if (response.status !== 200) {
                            resolve(null);
                            return;
                        }

                        const html = response.responseText;

                        // 检查HTML内容是否足够
                        if (html.length < 100) {
                            resolve(null);
                            return;
                        }

                        // 创建虚拟DOM进行分析
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');

                        // 增强HTML分析 - 模拟实时检测器逻辑
                        const enhancedResult = enhancedPageAnalysis(html, doc);

                        // 如果增强分析有结果，使用增强结果；否则使用专业检测器
                        const detectionResult = enhancedResult || detectPanPageStatus(doc);

                        let isValid = detectionResult.isValid;
                        let needsPassword = detectionResult.needsPassword;
                        let confidence = detectionResult.confidence;

                        const result = {
                            isValid,
                            needsPassword,
                            confidence,
                            source: 'same_origin_xhr'
                        };

                        resolve(result);

                    } catch (error) {
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    if (!resolved) {
                        clearTimeout(timeout);
                        resolved = true;
                        resolve(null);
                    }
                },
                ontimeout: function() {
                    if (!resolved) {
                        clearTimeout(timeout);
                        resolved = true;
                        resolve(null);
                    }
                }
            });
        });
    }

    // 判断是否为同域链接
    function isSameOriginLink(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();

            // 检查是否为123网盘域名
            return SAME_ORIGIN_CONFIG.domains.some(domain => hostname.includes(domain));
        } catch (e) {
            return false;
        }
    }

    // 智能检测策略：综合多种方案（一比一复刻核心逻辑）
    async function smartDetectLink(shareUrl, extractCode = '') {
        try {
            // 精简检测策略，同域优先
            const strategies = [];

            // 优先级1: 同域检测（123网盘链接可尝试）
            if (isSameOriginLink(shareUrl)) {
                strategies.push({ name: 'same_origin', func: checkLinkBySameOrigin });
            }

            // 优先级2: 传统页面检测作为兜底
            strategies.push({ name: 'traditional', func: checkLinkByTraditional });

            // 依次执行检测策略
            for (const strategy of strategies) {
                try {
                    const result = await strategy.func(shareUrl, extractCode);
                    if (result && result.confidence > 0.5) {
                        return result;
                    }
                } catch (error) {
                    // 继续下一个策略
                }
            }

            // 所有策略都失败
            return {
                isValid: false,
                needsPassword: false,
                confidence: 0.1,
                source: 'fallback'
            };

        } catch (error) {
            return null;
        }
    }

    // 传统检测方法（增强准确性）
    async function checkLinkByTraditional(shareUrl, extractCode = '') {
        return new Promise((resolve) => {
            const fullUrl = extractCode ? `${shareUrl}?pwd=${extractCode}` : shareUrl;

            GM_xmlhttpRequest({
                method: 'GET',
                url: fullUrl,
                timeout: 3000, // 极速3秒超时
                headers: {
                    'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Referer': 'https://www.123pan.com/'
                },
                onload: function(response) {
                    try {

                        if (response.status !== 200) {
                            resolve({
                                isValid: false,
                                needsPassword: false,
                                confidence: 0.8,
                                source: 'traditional_xhr_error'
                            });
                            return;
                        }

                        const html = response.responseText;

                        // 使用增强页面分析
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const enhancedResult = enhancedPageAnalysis(html, doc);

                        if (enhancedResult) {
                            resolve({
                                isValid: enhancedResult.isValid,
                                needsPassword: enhancedResult.needsPassword,
                                confidence: Math.max(0.6, enhancedResult.confidence - 0.1), // 略降置信度
                                source: 'traditional_enhanced'
                            });
                        } else {
                            // 回退到基础分析
                            const status = analyzePageStatus(html, response.status, true);
                            resolve({
                                isValid: status === 'valid',
                                needsPassword: status === 'encrypted',
                                confidence: status === 'valid' ? 0.7 : (status === 'invalid' ? 0.8 : 0.3),
                                source: 'traditional_basic'
                            });
                        }
                    } catch (error) {
                        resolve(null);
                    }
                },
                onerror: () => {
                    resolve(null);
                },
                ontimeout: () => {
                    resolve(null);
                }
            });
        });
    }

    // ==================== 同域检测功能模块 ====================

    // 初始化同域检测
    function initSameDomainDetection() {

        // 创建同域检测器
        GlobalState.sameDomainDetector = new SameDomainDetector();

        // 实时检测已在startUnifiedDetection中启动，无需重复

    }

    // 同域检测器类
    class SameDomainDetector {
        constructor() {
            this.detectedLinks = new Map();
            this.isDetecting = false;
        }

        // 检测单个链接（供外部调用）
        async detectSingleLink(linkElement) {
            if (!linkElement) return;

            const linkInfo = {
                url: linkElement.href,
                element: linkElement,
                isCurrentPage: linkElement.href === window.location.href
            };

            await this.detectLink(linkInfo);
        }

        // 检测当前页面状态（实时页面元素检测）
        detectCurrentPageStatus() {

            // 直接分析当前页面DOM元素
            const currentStatus = this.analyzeCurrentPage();

            // 更新当前页面状态显示
            this.updateCurrentPageStatus(currentStatus);

            return currentStatus;
        }

        // 更新当前页面状态显示
        updateCurrentPageStatus(status) {
            // 隐藏页面状态指示器
            let indicator = document.querySelector('.current-page-status');
            if (indicator) {
                indicator.style.display = 'none';
            }
        }

        // 检测链接是否需要同域处理
        shouldUseSameDomainDetection(url) {
            try {
                const urlObj = new URL(url);
                const currentHost = window.location.hostname.toLowerCase();
                const targetHost = urlObj.hostname.toLowerCase();

                // 同域且都是123网盘域名
                return currentHost === targetHost && /123[a-z0-9]*\.com$/.test(currentHost);
            } catch (e) {
                return false;
            }
        }

        // 检测单个链接（同域优化版）
        async detectLink(linkInfo) {
            const { url, element, isCurrentPage } = linkInfo;

            try {

                // 同域链接直接分析当前页面DOM
                if (this.shouldUseSameDomainDetection(url)) {
                    const status = this.analyzeCurrentPage();
                    this.updateLinkStatus(url, status, element);
                    return;
                }

                // 非同域链接标记为需要跨域检测
                this.updateLinkStatus(url, 'unknown', element);

            } catch (error) {
                this.updateLinkStatus(url, 'error', element);
            }
        }

        // 分析当前页面状态
        analyzeCurrentPage() {
            const bodyText = document.body.textContent;
            return analyzePageStatus(bodyText, 200, true);
        }


        // 更新链接状态
        updateLinkStatus(url, status, element) {
            this.detectedLinks.set(url, status);

            if (element) {
                // 为链接添加状态标记
                this.addStatusIndicator(element, status);
            }

        }

        // 添加状态指示器
        addStatusIndicator(element, status) {
            // 移除现有状态指示器
            const existing = element.parentNode.querySelector('.same-domain-status');
            if (existing) {
                existing.remove();
            }

            // 创建新的状态指示器
            const indicator = document.createElement('span');
            indicator.className = 'same-domain-status';
            indicator.textContent = this.getStatusText(status);
            indicator.style.cssText = `
                margin-left: 6px; font-size: 10px; padding: 1px 4px; border-radius: 2px;
                ${this.getStatusStyle(status)}
            `;
            indicator.title = `同域检测: ${this.getStatusTitle(status)}`;

            element.parentNode.insertBefore(indicator, element.nextSibling);
        }

        // 获取状态文本
        getStatusText(status) {
            const statusMap = {
                'valid': '✓同域有效',
                'invalid': '✗同域失效',
                'encrypted': '🔒同域加密',
                'error': '⚠同域错误',
                'timeout': '⏱同域超时',
                'unknown': '❓同域未知'
            };
            return statusMap[status] || '❓';
        }

        // 获取状态样式
        getStatusStyle(status) {
            const styleMap = {
                'valid': 'color: #28a745; background: #d4edda;',
                'invalid': 'color: #dc3545; background: #f8d7da;',
                'encrypted': 'color: #6f42c1; background: #e2e3f0;',
                'error': 'color: #868e96; background: #f8f9fa;',
                'timeout': 'color: #fd7e14; background: #fff3cd;',
                'unknown': 'color: #6c757d; background: #f8f9fa;'
            };
            return styleMap[status] || 'color: #6c757d; background: #f8f9fa;';
        }

        // 获取状态标题
        getStatusTitle(status) {
            const titleMap = {
                'valid': '同域检测有效',
                'invalid': '同域检测失效',
                'encrypted': '同域检测需要密码',
                'error': '同域检测错误',
                'timeout': '同域检测超时',
                'unknown': '同域检测未知状态'
            };
            return titleMap[status] || '未知状态';
        }


        // 延迟函数
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // 统一的检测系统（合并所有检测逻辑，避免重复）
    function startUnifiedDetection() {
        if (GlobalState.detectionTimer) {
            clearInterval(GlobalState.detectionTimer);
        }


        // 统一检测循环（合并实时检测、DOM监控、同域检测）
        GlobalState.detectionTimer = setInterval(() => {
            try {
                // 扫描新出现的链接（防重复）
                const currentLinks = findPanLinks();
                const newLinks = currentLinks.filter(link =>
                    !GlobalState.checkedLinks.has(normalizeUrl(link.href))
                );

                if (newLinks.length > 0) {
                    console.groupCollapsed(`发现 ${newLinks.length} 个新链接，极速检测启动`);
                    GlobalState.pendingLinksInGroup = newLinks.length;
                    GlobalState.activeGroupCount++;
                    // 极速模式：立即并发检测所有新链接
                    newLinks.forEach(checkLink);
                }

                // 同域页面状态检测（仅在123网盘）
                if (GlobalState.sameDomainDetector && isOn123PanSite()) {
                    GlobalState.sameDomainDetector.detectCurrentPageStatus();
                }
            } catch (error) {
                // 静默处理错误
            }
        }, CONFIG.detectionInterval);

        // 同时启动DOM变化监听（替代多个观察器）
        startDOMChangeObserver();

    }

    // 统一的DOM变化观察器（替代多个分散的观察器）
    function startDOMChangeObserver() {
        let lastScanTime = 0;
        const SCAN_COOLDOWN = 1000; // 1秒冷却时间，适合多链接页面

        const unifiedObserver = new MutationObserver((mutations) => {
            // 检查变化是否由脚本自身引起 - 修复误判逻辑
            const isScriptChange = mutations.some(mutation => {
                return Array.from(mutation.addedNodes).some(node => {
                    return node.nodeType === 1 &&
                           (node.classList?.contains('link-status') ||
                            node.classList?.contains('same-domain-status') ||
                            node.classList?.contains('current-page-status'));
                });
            });

            // 检查链接删除，同步清理状态标记
            mutations.forEach(mutation => {
                Array.from(mutation.removedNodes).forEach(node => {
                    if (node.nodeType === 1) {
                        // 如果删除的是链接，清理对应状态标记
                        if (node.tagName === 'A' && isPanLink(node.href)) {
                            const normalizedUrl = normalizeUrl(node.href);
                            clearLinkStatus(normalizedUrl);
                            GlobalState.checkedLinks.delete(normalizedUrl);
                        }
                        // 检查删除节点的子链接
                        const innerLinks = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
                        innerLinks.forEach(link => {
                            if (isPanLink(link.href)) {
                                const normalizedUrl = normalizeUrl(link.href);
                                clearLinkStatus(normalizedUrl);
                                GlobalState.checkedLinks.delete(normalizedUrl);
                            }
                        });
                    }
                });
            });

            if (isScriptChange) return;

            // 冷却时间检查
            const now = Date.now();
            if (now - lastScanTime < SCAN_COOLDOWN) return;

            // 检查新增的链接
            const newLinks = [];
            mutations.forEach(mutation => {
                Array.from(mutation.addedNodes).forEach(node => {
                    if (node.nodeType === 1) {
                        // 检查节点本身是否是链接
                        if (node.tagName === 'A' && isPanLink(node.href)) {
                            const normalizedUrl = normalizeUrl(node.href);
                            if (!GlobalState.checkedLinks.has(normalizedUrl)) {
                                newLinks.push(node);
                            }
                        }
                        // 检查节点内部的链接
                        const innerLinks = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
                        innerLinks.forEach(link => {
                            if (isPanLink(link.href)) {
                                const normalizedUrl = normalizeUrl(link.href);
                                if (!GlobalState.checkedLinks.has(normalizedUrl)) {
                                    newLinks.push(link);
                                }
                            }
                        });
                        // 检查文本节点中的链接 - 极速处理
                        const text = node.textContent || '';
                        if (CONFIG.linkPattern.test(text)) {
                            // 立即处理，无延迟
                            const textNodes = getTextNodes(node);
                            textNodes.forEach(textNode => {
                                const matches = textNode.textContent.match(CONFIG.linkPattern);
                                if (matches) {
                                    matches.forEach(url => {
                                        const normalizedUrl = normalizeUrl(url);
                                        if (!GlobalState.checkedLinks.has(normalizedUrl)) {
                                            const clickableLink = createClickableLink(url, textNode);
                                            if (clickableLink) {
                                                newLinks.push(clickableLink);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            });

            // 批量检测新发现的链接
            if (newLinks.length > 0) {
                lastScanTime = now;
                console.groupCollapsed(`DOM变化发现 ${newLinks.length} 个新链接，极速检测启动`);
                GlobalState.pendingLinksInGroup = newLinks.length;
                GlobalState.activeGroupCount++;
                // 极速模式：立即检测所有新链接，无延迟
                newLinks.forEach(checkLink);
            }
        });

        unifiedObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

    }

    // 定期清理机制（防内存泄漏）- 改为智能清理
    function startPeriodicCleanup() {
        setInterval(() => {
            try {
                // 清理过期的日志缓存
                if (Log._lastMessages && Log._lastMessages.size > 30) {
                    const now = Date.now();
                    for (const [key, timestamp] of Log._lastMessages.entries()) {
                        if (now - timestamp > 300000) { // 5分钟过期
                            Log._lastMessages.delete(key);
                        }
                    }
                }

                // 清理过期的链接缓存
                const now = Date.now();
                let cleanedCount = 0;
                for (const [url, cache] of GlobalState.linkCache.entries()) {
                    if (now - cache.timestamp > CONFIG.cacheExpireTime) {
                        GlobalState.linkCache.delete(url);
                        cleanedCount++;
                    }
                }

                // 智能清理孤立的状态标记（与链接生命周期同步）
                clearOrphanedStatus();

            } catch (error) {
                // 静默处理错误
            }
        }, 60000); // 1分钟清理一次，频率提高以保持同步

    }

    // 停止实时检测（已集成到cleanup中，此函数保留备用）
    function stopRealtimeDetection() {
        if (GlobalState.detectionTimer) {
            clearInterval(GlobalState.detectionTimer);
            GlobalState.detectionTimer = null;
        }
    }


    // 统一的提取码查找函数（消除重复逻辑）
    function findExtractCodeNearElement(element) {
        try {
            // 1. 从元素本身查找
            if (element.textContent) {
                const match = element.textContent.match(CONFIG.extractCodeRegex);
                if (match && match[1]) {
                    return match[1];
                }
            }

            // 2. 从父元素查找
            const parent = element.parentElement;
            if (parent) {
                const parentText = parent.textContent;
                const match = parentText.match(CONFIG.extractCodeRegex);
                    if (match && match[1]) {
                        return match[1];
                    }
                }

            // 3. 从祖先元素查找
            let ancestor = parent;
            for (let i = 0; i < 3 && ancestor; i++) {
                ancestor = ancestor.parentElement;
                if (ancestor) {
                    const ancestorText = ancestor.textContent;
                    const match = ancestorText.match(CONFIG.extractCodeRegex);
                    if (match && match[1]) {
                        return match[1];
                    }
                }
            }

            // 4. 查找相邻元素（仅对文本节点）
            if (element.nodeType === Node.TEXT_NODE && parent) {
                const siblings = Array.from(parent.childNodes || []);
                const nodeIndex = siblings.indexOf(element);

                for (let i = Math.max(0, nodeIndex - 2); i <= Math.min(siblings.length - 1, nodeIndex + 2); i++) {
                    const sibling = siblings[i];
                    if (sibling && sibling.nodeType === Node.TEXT_NODE && sibling !== element) {
                        const match = sibling.textContent.match(CONFIG.extractCodeRegex);
                        if (match && match[1]) {
                            return match[1];
                        }
                    }
                }
            }

            return null;
        } catch (e) {
            console.warn('查找提取码时出错:', e);
            return null;
        }
    }

    // 增强现有的a标签链接，自动附加提取码
    function enhanceExistingLink(linkElement) {
        try {
            const originalUrl = linkElement.href;

            // 如果链接已经包含密码参数，跳过
            if (originalUrl.includes('pwd=')) {
                return;
            }

            // 查找周围的提取码
            const extractCode = findExtractCodeNearElement(linkElement);

            if (extractCode) {
                const separator = originalUrl.includes('?') ? '&' : '?';
                const enhancedUrl = `${originalUrl}${separator}pwd=${extractCode}`;

                // 更新链接href
                linkElement.href = enhancedUrl;

                // 添加视觉提示
                linkElement.title = `链接已自动附加提取码: ${extractCode}`;
                linkElement.style.borderBottom = '2px dotted #28a745';
            }
        } catch (e) {
            console.warn('增强链接时出错:', e);
        }
    }




    // 智能清理孤立状态标记（只清理没有对应链接的标记）
    function clearOrphanedStatus() {
        const existingLinks = new Set();
        // 收集所有存在的链接
        document.querySelectorAll('a[href]').forEach(link => {
            if (isPanLink(link.href)) {
                existingLinks.add(normalizeUrl(link.href));
            }
        });

        // 清理没有对应链接的状态标记
        let cleanedCount = 0;
        GlobalState.linkStatusMap.forEach((element, url) => {
            if (!existingLinks.has(url)) {
                if (element && element.parentNode) {
                    element.remove();
                }
                GlobalState.linkStatusMap.delete(url);
                GlobalState.checkedLinks.delete(url);
                cleanedCount++;
            }
        });

    }

    // 精简的独立扫描函数（不依赖控制面板）
    function scanLinks() {
        if (GlobalState.isScanning) {
            return;
        }

        GlobalState.isScanning = true;

        try {
            // 在123网盘站点优先使用同域检测
            if (isOn123PanSite() && GlobalState.sameDomainDetector) {
                GlobalState.sameDomainDetector.detectCurrentPageStatus();
                GlobalState.isScanning = false;
                return;
            }

            // 查找所有链接
            const links = findPanLinks();
            const newLinks = links.filter(link => !GlobalState.checkedLinks.has(normalizeUrl(link.href)));

            if (newLinks.length === 0) {
                GlobalState.isScanning = false;
                return;
            }

            console.groupCollapsed(`发现 ${newLinks.length} 个新链接，极速检测启动`);
            GlobalState.pendingLinksInGroup = newLinks.length;
            GlobalState.activeGroupCount++;

            // 极速模式：立即并发检测所有新链接
            newLinks.forEach(checkLink);

        } catch (error) {
            GlobalState.isScanning = false;
        }
    }

    // 极速检测函数 - 缓存优先 + 无限并发
    async function checkLink(linkElement) {
        // 无限并发模式：移除并发限制，所有链接立即处理

        const linkUrl = linkElement.href;
        const normalizedUrl = normalizeUrl(linkUrl);

        // 防重复检测
        if (GlobalState.checkedLinks.has(normalizedUrl)) {
            return;
        }

        // 🎯 优先检查缓存
        const cached = GlobalState.getCachedResult(normalizedUrl);
        if (cached) {
            updateLinkStatus(linkElement, cached.status);
            GlobalState.checkedLinks.add(normalizedUrl);

            // 按用户要求格式显示缓存结果
            const statusText = getStatusText(cached.status).replace(/[✔✖⏳🔒⚠❓]/g, '').trim();
            console.log(`链接：${linkUrl}`);
            console.log(`方式：缓存命中 (${cached.method})`);
            console.log(`原因：之前检测过的结果`);
            console.log(`状态：${statusText}`);
            console.log('>>>');
            onLinkDetectionComplete();
            return;
        }

        GlobalState.checkedLinks.add(normalizedUrl);
        updateLinkStatus(linkElement, 'processing');
        // 无限并发模式：不需要计数activeRequests

        try {
            // 获取提取码
            const extractCode = getExtractCode(linkElement);

            // 使用智能检测系统
            const result = await smartDetectLink(linkUrl, extractCode);

            if (result) {
                // 转换检测结果为状态
                let status;
                if (result.isValid) {
                    status = result.needsPassword ? 'encrypted' : 'valid';
                } else {
                    status = 'invalid';
                }

                // 💾 缓存高置信度结果
                if (result.confidence >= 0.7) {
                    GlobalState.setCachedResult(normalizedUrl, status, result.source || 'smart');
                }

                // 按要求格式显示检测结果
                logLinkDetectionResult(linkUrl, result, status);
                updateLinkStatus(linkElement, status);
                onLinkDetectionComplete();
            } else {
                // 按用户要求格式显示检测失败
                console.log(`链接：${linkUrl}`);
                console.log('方式：智能检测失败');
                console.log('原因：所有检测策略都无法确定状态');
                console.log('状态：错误');
                console.log('>>>');
                updateLinkStatus(linkElement, 'error');
                onLinkDetectionComplete();
            }
        } catch (error) {
            // 按用户要求格式显示检测出错
            console.log(`链接：${linkUrl}`);
            console.log('方式：检测异常');
            console.log(`原因：${error.message}`);
            console.log('状态：错误');
            console.log('>>>');
            updateLinkStatus(linkElement, 'error');
            onLinkDetectionComplete();
        }
        // 无限并发模式：不需要减少activeRequests计数

        // 检查扫描是否完成
        checkScanComplete();
    }

    // 检测完成后减少计数并检查是否需要结束分组
    function onLinkDetectionComplete() {
        GlobalState.pendingLinksInGroup--;
        if (GlobalState.pendingLinksInGroup <= 0 && GlobalState.activeGroupCount > 0) {
            console.groupEnd();
            GlobalState.activeGroupCount--;
            GlobalState.pendingLinksInGroup = 0;
        }
    }

    // 按用户要求格式显示检测结果
    function logLinkDetectionResult(url, result, status) {
        const statusText = getStatusText(status).replace(/[✔✖⏳🔒⚠❓]/g, '').trim();

        // 获取检测方式和原因
        let method = '';
        let reason = '';

        if (result) {
            if (result.source === 'same_origin_xhr') {
                method = '同域检测 + GM_xmlhttpRequest + 专业检测器工作正常!';
                // 根据检测结果推断原因
                if (status === 'valid') {
                    reason = '有效页面（提取文件）';
                } else if (status === 'invalid') {
                    reason = '分享链接已失效';
                } else if (status === 'encrypted') {
                    reason = '需要输入提取码';
                } else {
                    reason = '页面状态未知';
                }
            } else if (result.source === 'traditional_enhanced') {
                method = '传统增强检测';
                reason = result.needsPassword ? '需要输入提取码' : (result.isValid ? '页面内容有效' : '页面内容失效');
            } else if (result.source === 'traditional_basic') {
                method = '传统基础检测';
                reason = '基础页面分析完成';
            } else {
                method = result.source || '智能检测';
                reason = `置信度: ${(result.confidence * 100).toFixed(0)}%`;
            }
        } else {
            method = '检测失败';
            reason = '无法获取页面信息';
        }

        // 按用户要求格式输出
        console.log(`链接：${url}`);
        console.log(`方式：${method}`);
        console.log(`原因：${reason}`);
        console.log(`状态：${statusText}`);
        console.log('>>>');
    }

    // 检查扫描是否完成（无限并发版）
    function checkScanComplete() {
        // 无限并发模式：扫描完成由其他逻辑控制，这里只记录统计信息
        const totalChecked = GlobalState.checkedLinks.size;
        const cacheHits = GlobalState.linkCache.size;
    }

    // 统一的页面状态分析函数（消除重复逻辑）
    function analyzePageStatus(content, statusCode = 200, isTextContent = true) {
        const text = isTextContent ? content.toLowerCase() : content;

        // 检测有效标识
        if (text.includes('content-layout-page') ||
            text.includes('file-list-container') ||
            text.includes('ant-table-wrapper') ||
            text.includes('保存至云盘') ||
            text.includes('浏览器下载') ||
            text.includes('文件列表')) {
            return 'valid';
        }

        // 检测文件信息标识
        if ((text.includes('修改时间') && text.includes('大小')) ||
            (text.includes('共') && text.includes('项') && !text.includes('共0项'))) {
            return 'valid';
        }

        // 检测明确的失效标识
        if (text.includes('分享链接已失效') ||
            text.includes('分享页面不存在') ||
            text.includes('sharewebloading') ||
            text.includes('文件已被删除') ||
            text.includes('分享已过期') ||
            text.includes('链接失效') ||
            text.includes('链接已失效') ||
            text.includes('分享不存在') ||
            text.includes('资源不存在')) {
            return 'invalid';
        }

        // 检测加密状态
        if (text.includes('请输入提取码') ||
            text.includes('提取码错误') ||
            text.includes('密码错误')) {
            return 'encrypted';
        }

        // 基于内容长度和结构判断（仅对文本内容）
        if (isTextContent && statusCode === 200) {
            if (text.length > 15000 || text.includes('ant-table')) {
                return 'valid';
            }
            if (text.length < 3000) {
                return 'invalid';
            }
            // 中等长度内容，尝试更多特征检测
            if (text.includes('123pan') || text.includes('网盘') || text.includes('分享')) {
                return 'valid';
            }
        }

        // HTTP错误状态
        if (statusCode >= 400) {
            return 'invalid';
        }

        return 'valid'; // 默认为有效，避免过多unknown状态
    }



    // 统一的状态显示（确保唯一标记）
    function updateLinkStatus(linkElement, status) {
        const normalizedUrl = normalizeUrl(linkElement.href);

        // 检查是否已有状态标记
        if (GlobalState.linkStatusMap.has(normalizedUrl)) {
            const existingElement = GlobalState.linkStatusMap.get(normalizedUrl);
            if (existingElement && existingElement.parentNode) {
                // 直接更新现有标记
                existingElement.textContent = getStatusText(status);
                existingElement.style.cssText = `margin-right: 6px; font-size: 11px; ${STATUS_STYLES[status]}`;
                existingElement.title = getStatusTitle(status);
                return;
            }
            // 清理无效引用
            GlobalState.linkStatusMap.delete(normalizedUrl);
        }

        // 彻底清除该URL的所有状态标记
        clearLinkStatus(normalizedUrl);

        // 创建新的状态标记
        const statusElement = document.createElement('span');
        statusElement.className = 'link-status';
        statusElement.style.cssText = `margin-right: 6px; font-size: 11px; ${STATUS_STYLES[status]}`;
        statusElement.textContent = getStatusText(status);
        statusElement.title = getStatusTitle(status);
        statusElement.dataset.normalizedUrl = normalizedUrl;

        // 统一插入位置：链接最前方（现在都是真实a标签）
        if (linkElement.parentNode) {
            linkElement.parentNode.insertBefore(statusElement, linkElement);
        }

        // 记录状态元素
        GlobalState.linkStatusMap.set(normalizedUrl, statusElement);
    }

    // 清除指定URL的所有状态标记（使用标准化URL）
    function clearLinkStatus(normalizedUrl) {
        // 清除记录中的状态
        if (GlobalState.linkStatusMap.has(normalizedUrl)) {
            const element = GlobalState.linkStatusMap.get(normalizedUrl);
            if (element && element.parentNode) {
                element.remove();
            }
            GlobalState.linkStatusMap.delete(normalizedUrl);
        }

        // 清除页面中所有相关状态标记
        document.querySelectorAll('.link-status').forEach(el => {
            if (el.dataset.normalizedUrl === normalizedUrl) {
                el.remove();
            }
        });
    }


    // 精简的状态文本
    function getStatusText(status) {
        const statusMap = {
            'valid': '✔ 有效',
            'invalid': '✖ 失效',
            'processing': '⏳ 检测中',
            'encrypted': '🔒 需密码',
            'error': '⚠ 错误',
            'unknown': '❓ 未知'
        };
        return statusMap[status] || '❓ 未知';
    }

    function getStatusTitle(status) {
        const titleMap = {
            'valid': '链接有效',
            'invalid': '链接失效',
            'processing': '检测中...',
            'encrypted': '需要提取码',
            'error': '检测错误',
            'unknown': '状态未知'
        };
        return titleMap[status] || '未知状态';
    }

    // 精简的提取码获取
    function getExtractCode(linkElement) {
        // 从URL参数获取
        try {
            const url = new URL(linkElement.href);
            if (url.searchParams.has('pwd')) {
                return url.searchParams.get('pwd');
            }
        } catch (e) {}

        // 从周围文本获取
        const parent = linkElement.closest('div') || linkElement.parentElement;
        if (parent) {
            const match = parent.textContent.match(CONFIG.extractCodeRegex);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }

    // 自动填充提取码功能
    function initAutoFillExtractCode() {

        // 查找密码输入框
        const passwordInput = findPasswordInput();
        if (!passwordInput) {
            setTimeout(initAutoFillExtractCode, 5000);
            return;
        }

        // 查找提取码
        const extractCode = findExtractCodeFromPage();
        if (!extractCode) {
            return;
        }

        // 自动填充
        autoFillPassword(passwordInput, extractCode);
    }

    // 查找密码输入框
    function findPasswordInput() {
        // 常见的密码输入框选择器
        const selectors = [
            'input[type="password"]',
            'input[placeholder*="密码"]',
            'input[placeholder*="提取码"]',
            'input[placeholder*="访问密码"]',
            '.ant-input[type="password"]',
            '.password-input',
            '#password',
            '.pwd-input'
        ];

        for (const selector of selectors) {
            const input = document.querySelector(selector);
            if (input && input.offsetParent !== null) { // 确保元素可见
                return input;
            }
        }

        return null;
    }

    // 从页面查找提取码
    function findExtractCodeFromPage() {
        // 从当前页面URL获取
        try {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('pwd')) {
                const code = urlParams.get('pwd');
                return code;
            }
        } catch (e) {}

        // 从页面文本中提取
        const pageText = document.body.textContent || '';
        const match = pageText.match(CONFIG.extractCodeRegex);
        if (match && match[1]) {
            return match[1];
        }

        // 从来源页面获取（通过document.referrer）
        if (document.referrer) {
            try {
                const referrerUrl = new URL(document.referrer);
                if (referrerUrl.hostname.includes('pan1.me')) {
                    // 如果是从pan1.me跳转来的，尝试从referrer获取提取码
                    return null; // 这里可以进一步扩展
                }
            } catch (e) {}
        }

        return null;
    }

    // 自动填充密码
    function autoFillPassword(input, password) {

        try {
            // 聚焦输入框
            input.focus();

            // 清空现有内容
            input.value = '';

            // 填充密码
            input.value = password;

            // 触发输入事件（兼容React等框架）
            const events = ['input', 'change', 'keyup'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                input.dispatchEvent(event);
            });


            // 查找并点击确认按钮
            setTimeout(() => {
                const submitButton = findSubmitButton();
                if (submitButton) {
                    submitButton.click();
                }
            }, 500);

        } catch (error) {
        }
    }

    // 查找提交按钮
    function findSubmitButton() {
        const selectors = [
            'button[type="submit"]',
            'button:contains("确认")',
            'button:contains("提交")',
            'button:contains("访问")',
            '.ant-btn-primary',
            '.submit-btn',
            '.confirm-btn'
        ];

        for (const selector of selectors) {
            const button = document.querySelector(selector);
            if (button && button.offsetParent !== null) {
                return button;
            }
        }

        // 通过按钮文本查找
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            const text = button.textContent.trim();
            if (['确认', '提交', '访问', '确定', '进入'].includes(text)) {
                return button;
            }
        }

        return null;
    }


    // ==================== 自动回复功能模块 ====================

    // 精简回复文案库（减少内存占用）
    const REPLY_TEXTS = [
        "感谢楼主分享，内容很实用，收藏了~",
        "这个资源看起来很棒，谢谢分享！",
        "刚好需要这类内容，太及时了，感谢！",
        "楼主辛苦啦，内容很有价值，支持一下",
        "之前一直在找类似的，谢谢分享👍",
        "内容不错，已保存，感谢整理～",
        "很实用的分享，感谢楼主的用心",
        "这个很有帮助，谢谢啦！",
        "支持一下，内容很精彩",
        "感谢分享，学到了不少",
        "楼主太给力了，谢谢分享资源",
        "内容很优质，感谢分享出来",
        "刚好能用上，感谢楼主的分享",
        "收藏了，慢慢研究，谢谢～",
        "很赞的分享，感谢付出！",
        "这份分享太及时了，谢谢楼主",
        "内容很丰富，感谢整理和分享",
        "支持原创分享，谢谢楼主",
        "找了好久终于遇到了，感谢分享",
        "内容对我很有帮助，谢谢！"
    ];

    // 核心检测关键词
    const REPLY_TRIGGER = '您好，本帖含有特定内容，请回复后再查看';

    // 极速内容检测（最优化）
    function needsReply() {
        // 使用innerHTML是最快的文本搜索方式
        return document.body.innerHTML.includes('本帖含有特定内容，请回复后再查看');
    }

    // 手动回复按钮初始化系统
    function initManualReplyButton() {
        // 立即检测一次
        if (needsReply()) {
            addManualReplyButton();
        }

        // DOM变化监听器 - 监听新出现的回复提示
        const buttonObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const text = node.textContent || '';
                            if (text.includes('本帖含有特定内容，请回复后再查看') && !document.querySelector('.manual-reply-btn')) {
                                addManualReplyButton();
                            }
                        }
                    });
                }
            });
        });

        // 开始监听DOM变化
        buttonObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 添加手动回复按钮
    function addManualReplyButton() {
        // 查找alert-warning元素
        const alertElement = document.querySelector('.alert.alert-warning');
        if (!alertElement) {
            return;
        }

        // 检查是否已存在按钮
        if (alertElement.querySelector('.manual-reply-btn')) {
            return;
        }

        // 创建按钮
        const replyButton = document.createElement('button');
        replyButton.className = 'manual-reply-btn';
        replyButton.textContent = '一键回复';
        replyButton.style.cssText = `
            margin-left: 10px;
            padding: 4px 12px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        `;

        // 添加悬停效果
        replyButton.addEventListener('mouseenter', () => {
            replyButton.style.backgroundColor = '#0056b3';
        });

        replyButton.addEventListener('mouseleave', () => {
            replyButton.style.backgroundColor = '#007bff';
        });

        // 添加点击事件（事件隔离）
        replyButton.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();

            // 禁用按钮防止重复点击
            replyButton.disabled = true;
            replyButton.textContent = '回复中...';
            replyButton.style.backgroundColor = '#6c757d';

            // 执行回复
            executeManualReply(replyButton);
        }, true); // 使用捕获阶段确保事件隔离

        // 将按钮添加到alert元素末尾
        alertElement.appendChild(replyButton);
    }

    // 执行手动回复
    function executeManualReply(buttonElement) {
        try {
            const { replyBox, submitBtn, isQuickReply } = findReplyElements();

            if (!replyBox || !submitBtn) {
                resetButton(buttonElement, '回复失败');
                return;
            }

            // 执行回复
            performReply(replyBox, submitBtn, isQuickReply);

            // 更新按钮状态
            buttonElement.textContent = '回复成功';
            buttonElement.style.backgroundColor = '#28a745';

            // 3秒后移除按钮
            setTimeout(() => {
                if (buttonElement.parentNode) {
                    buttonElement.remove();
                }
            }, 3000);

        } catch (error) {
            resetButton(buttonElement, '回复失败');
        }
    }

    // 重置按钮状态
    function resetButton(buttonElement, text) {
        buttonElement.disabled = false;
        buttonElement.textContent = text || '一键回复';
        buttonElement.style.backgroundColor = text === '回复失败' ? '#dc3545' : '#007bff';

        if (text === '回复失败') {
            setTimeout(() => {
                resetButton(buttonElement, '一键回复');
            }, 2000);
        }
    }

    // 精简的快速回复初始化（保留供测试使用）
    function initAutoReply() {
        if (GlobalState.replyState.tried || GlobalState.replyState.inProgress) return;

        if (!needsReply()) {
            GlobalState.replyState.tried = true;
            return;
        }

        console.log('⚡ 即时回复启动');
        GlobalState.replyState.tried = true;
        GlobalState.replyState.inProgress = true;

        // 立即执行
        executeAutoReply();
    }

    // 精简的回复元素查找
    function findReplyElements() {
        let replyBox, submitBtn;

        // 常见回复元素选择器（按优先级排序）
        const replySelectors = [
            'select[name="quick_reply_message"]',
            'textarea[name="message"]',
            'textarea[name="content"]',
            'textarea'
        ];

        const submitSelectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button[value="提交"]',
            'button[value="回复"]'
        ];

        // 查找回复框
        for (const selector of replySelectors) {
            replyBox = document.querySelector(selector);
            if (replyBox && replyBox.offsetParent !== null) break;
        }

        // 查找提交按钮
        for (const selector of submitSelectors) {
            submitBtn = document.querySelector(selector);
            if (submitBtn && submitBtn.offsetParent !== null) break;
        }

        // 如果没找到，尝试通过文本查找按钮
        if (!submitBtn) {
            const buttons = document.querySelectorAll('button');
            for (const btn of buttons) {
                if (/回复|发表|提交/i.test(btn.textContent) && btn.offsetParent !== null) {
                    submitBtn = btn;
                    break;
                }
            }
        }

        const isQuickReply = replyBox && replyBox.tagName === 'SELECT';
        return { replyBox, submitBtn, isQuickReply };
    }

    // 快速执行自动回复（移除冗余检测）
    function executeAutoReply() {
        const { replyBox, submitBtn, isQuickReply } = findReplyElements();

        if (!replyBox || !submitBtn) {
            GlobalState.replyState.inProgress = false;
            return;
        }

        performReply(replyBox, submitBtn, isQuickReply);
    }

    // 高速回复操作（50%几率使用快速回复，50%几率使用自定义文案）
    function performReply(replyBox, submitBtn, isQuickReply = false) {
        try {
            // 随机决定使用哪种回复方式（50% vs 50%）
            const useCustomText = Math.random() < 0.5;

            if (isQuickReply && replyBox.tagName === 'SELECT' && !useCustomText) {
                // 50%几率：使用快速回复选项
                const options = replyBox.options;
                const availableOptions = [];

                // 收集所有可用选项（跳过空值和默认选项）
                for (let i = 1; i < options.length; i++) {
                    const option = options[i];
                    if (option.value && option.text && option.text.trim() !== '') {
                        availableOptions.push(i);
                    }
                }

                if (availableOptions.length > 0) {
                    // 随机选择一个可用选项
                    const randomIndex = availableOptions[Math.floor(Math.random() * availableOptions.length)];
                    replyBox.selectedIndex = randomIndex;

                    replyBox.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    // 如果没有可用的快速回复选项，强制使用自定义文案
                    useCustomTextReply(replyBox);
                }
            } else {
                // 50%几率：使用自定义文案库（或者是传统文本框）
                useCustomTextReply(replyBox);
            }

            // 内部函数：使用自定义文案回复
            function useCustomTextReply(replyElement) {
                const replyText = REPLY_TEXTS[Math.floor(Math.random() * REPLY_TEXTS.length)];

                if (replyElement.tagName === 'SELECT') {
                    // 对于SELECT元素，尝试找到一个文本输入框，或者创建自定义选项
                    const textInputs = document.querySelectorAll('textarea, input[type="text"]');
                    let textBox = null;

                    for (const input of textInputs) {
                        if (input.offsetParent !== null &&
                            (input.placeholder?.includes('回复') ||
                             input.placeholder?.includes('评论') ||
                             input.name?.includes('message') ||
                             input.name?.includes('content'))) {
                            textBox = input;
                            break;
                        }
                    }

                    if (textBox) {
                        textBox.value = replyText;
                        textBox.dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                        // 如果找不到文本框，回退到快速回复
                        const options = replyElement.options;
                        if (options.length > 1) {
                            const availableOptions = [];
                            for (let i = 1; i < options.length; i++) {
                                const option = options[i];
                                if (option.value && option.text && option.text.trim() !== '') {
                                    availableOptions.push(i);
                                }
                            }
                            if (availableOptions.length > 0) {
                                const randomIndex = availableOptions[Math.floor(Math.random() * availableOptions.length)];
                                replyElement.selectedIndex = randomIndex;
                                replyElement.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        }
                    }
                } else {
                    // 对于文本框直接设置值
                    replyElement.value = replyText;
                    replyElement.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }

            // 立即提交（移除延迟）
            submitBtn.click();

            // 重置状态
            GlobalState.replyState.inProgress = false;

        } catch (error) {
            GlobalState.replyState.inProgress = false;
        }
    }

    // 温和的资源清理函数（只清理内存，保留DOM状态）
    function cleanup() {
        // 停止检测定时器
        if (GlobalState.detectionTimer) {
            clearInterval(GlobalState.detectionTimer);
            GlobalState.detectionTimer = null;
        }

        // 清理同域检测器
        if (GlobalState.sameDomainDetector) {
            GlobalState.sameDomainDetector.isDetecting = false;
            GlobalState.sameDomainDetector = null;
        }

        // 清理Log缓存
        if (Log._lastMessages) {
            Log._lastMessages.clear();
        }

        // 只清理内部状态，保留DOM元素和状态映射
        GlobalState.isScanning = false;
        // 无限并发模式：不需要重置activeRequests
        GlobalState.replyState = { tried: false, inProgress: false };

        // 注意：不调用GlobalState.reset()，避免清空linkStatusMap和checkedLinks
        // 这样状态标记可以继续显示直到链接真正消失
    }

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', cleanup);

    // 早期回复按钮检测（脚本加载时立即执行）
    (function immediateButtonDetection() {
        // 脚本加载时立即检测并添加按钮
        if (document.readyState !== 'loading' && needsReply()) {
            setTimeout(addManualReplyButton, 100); // 稍微延迟确保DOM完全加载
        }
    })();

    // 初始化其他功能
    init();

})();