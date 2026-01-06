// ==UserScript==
// @name         Xiaomi MiMo Studio 去水印
// @namespace    https://github.com/wang93wei/Xiaomi-MiMo-Studio-Watermark-Remover
// @version      1.3.8
// @description  自动检测并移除 Xiaomi MiMo Studio 页面中的水印内容（动态获取水印）
// @author       AlanWang
// @license      MIT
// @homepageURL  https://github.com/wang93wei/Xiaomi-MiMo-Studio-Watermark-Remover
// @supportURL   https://github.com/wang93wei/Xiaomi-MiMo-Studio-Watermark-Remover/issues
// @match        https://aistudio.xiaomimimo.com/*
// @match        https://aistudio.xiaomimimo.com/#/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559263/Xiaomi%20MiMo%20Studio%20%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559263/Xiaomi%20MiMo%20Studio%20%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置选项 ==========
    // 日志开关（设置为 true 启用日志，false 关闭日志）
    const ENABLE_LOG = false;

    // 配置常量
    const CONFIG = {
        // DOM 遍历配置
        MAX_DEPTH: 12,              // 最大遍历深度，防止调用栈溢出
        MAX_NODES: 10000,           // 最大处理节点数，防止性能问题

        // 轮询配置
        MAX_POLL_COUNT: 20,         // 最大轮询次数
        POLL_INTERVAL: 500,         // 轮询间隔（毫秒）

        // 重试配置
        MAX_RETRIES: 5,             // API 请求最大重试次数
        RETRY_DELAY: 1000,          // 初始重试延迟（毫秒）
        RETRY_BACKOFF: 1.5,         // 重试退避倍数

        // 超时配置
        FETCH_TIMEOUT: 10000,       // API 请求超时（毫秒）
        REGEX_TIMEOUT: 100,         // 正则替换超时（毫秒）

        // 水印文本限制
        MAX_WATERMARK_LENGTH: 500,  // 水印文本最大长度
        MIN_WATERMARK_LENGTH: 1,    // 水印文本最小长度

        // 防抖配置
        OBSERVER_DEBOUNCE: 50,      // MutationObserver 防抖延迟（毫秒）
        RESIZE_DEBOUNCE: 300,       // resize 事件防抖延迟（毫秒）

        // 原型链拦截配置
        ENABLE_CANVAS_INTERCEPT: true,   // 启用 Canvas 拦截
        ENABLE_CSS_INTERCEPT: false,     // 启用 CSS 拦截（默认关闭，可能影响页面功能）
        ENABLE_APPEND_CHILD_INTERCEPT: false,  // 启用 appendChild 拦截（默认关闭，可能影响页面功能）

        // 水印检测阈值配置
        VIEWPORT_COVERAGE_THRESHOLD: 0.9,  // 视口覆盖阈值（90%），用于判断元素是否覆盖大部分视口
        BASE64_MATCH_MAX_LENGTH: 50,      // Base64 匹配长度上限，用于从页面检测水印
        PAGE_LOAD_WAIT_TIME: 2000,        // 页面加载后等待时间（毫秒）

        // 样式检测阈值配置
        HIGH_ZINDEX_THRESHOLD: 100,       // 高z-index阈值，用于判断元素是否在顶层
        LOW_OPACITY_THRESHOLD: 1,         // 低透明度阈值，用于判断元素是否半透明

        // 性能优化配置
        USE_TREE_WALKER: false,           // 使用 TreeWalker API 进行 DOM 遍历（实验性功能）
    };

    // 错误统计
    const errorStats = {
        fetchErrors: 0,
        domErrors: 0,
        canvasErrors: 0,
        styleErrors: 0
    };

    // ========== 日志函数 ==========
    const logger = {
        log: (...args) => {
            if (ENABLE_LOG) {
                console.log('[去水印脚本]', ...args);
            }
        },
        warn: (...args) => {
            if (ENABLE_LOG) {
                console.warn('[去水印脚本]', ...args);
            }
        },
        error: (...args) => {
            // 错误信息始终输出，即使日志关闭
            console.error('[去水印脚本]', ...args);
        },
        stat: (type) => {
            if (errorStats.hasOwnProperty(type)) {
                errorStats[type]++;
            }
        },
        getStats: () => {
            return { ...errorStats };
        }
    };

    // 水印内容（将从 API 动态获取）
    let WATERMARK_TEXT = null;
    let WATERMARK_TEXT_CANDIDATES = [];
    
    // API 端点
    const USER_API_URL = 'https://aistudio.xiaomimimo.com/open-apis/user/mi/get';
    
    // 已处理的元素缓存，避免重复处理
    const processedElements = new WeakSet();

    // 样式缓存，避免频繁调用 getComputedStyle
    const styleCache = new WeakMap();

    // 正则表达式缓存，避免重复编译
    const watermarkRegexCache = new Map();

    // 获取缓存的样式
    function getCachedStyle(element) {
        if (!element) return null;

        // 检查缓存
        let style = styleCache.get(element);
        if (style) return style;

        try {
            style = window.getComputedStyle(element);
            styleCache.set(element, style);
            return style;
        } catch (e) {
            logger.warn('获取元素样式失败:', e);
            logger.stat('domErrors');
            return null;
        }
    }

    // 优化的样式缓存清理函数
    function clearStyleCacheForNode(node, mutationType = 'default') {
        if (!node) return;

        // 清理当前节点的缓存
        if (node.nodeType === Node.ELEMENT_NODE) {
            styleCache.delete(node);
        }

        // 根据mutation类型选择性清理子节点
        switch (mutationType) {
            case 'attribute':
                // 属性变化：只清理当前节点，不清理子节点
                // 子节点的样式不会因为父节点的属性变化而改变
                break;

            case 'childList':
                // 子节点添加：清理新添加的子节点缓存
                // 只清理第一层子节点，避免深度遍历
                if (node.nodeType === Node.ELEMENT_NODE && node.children) {
                    Array.from(node.children).forEach(child => {
                        if (child.nodeType === Node.ELEMENT_NODE) {
                            styleCache.delete(child);
                        }
                    });
                }
                break;

            default:
                // 默认：清理当前节点及其直接子节点
                if (node.nodeType === Node.ELEMENT_NODE && node.children) {
                    Array.from(node.children).forEach(child => {
                        if (child.nodeType === Node.ELEMENT_NODE) {
                            styleCache.delete(child);
                        }
                    });
                }
                // 处理Shadow DOM
                if (node.nodeType === Node.ELEMENT_NODE && node.shadowRoot) {
                    const shadowChildren = node.shadowRoot.querySelectorAll ? node.shadowRoot.querySelectorAll('*') : [];
                    shadowChildren.forEach(el => styleCache.delete(el));
                }
                break;
        }
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 获取缓存的水印正则表达式
    function getWatermarkRegex(watermarkText) {
        if (!watermarkText || typeof watermarkText !== 'string') return null;

        // 严格验证水印文本
        if (!isSafeWatermarkText(watermarkText)) {
            logger.warn('水印文本不安全，拒绝创建正则表达式');
            return null;
        }

        // 检查长度，防止过长的文本导致性能问题
        if (watermarkText.length > 100) {
            logger.warn('水印文本过长，拒绝创建正则表达式');
            return null;
        }

        if (watermarkRegexCache.has(watermarkText)) {
            return watermarkRegexCache.get(watermarkText);
        }

        try {
            const escaped = watermarkText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'g');
            watermarkRegexCache.set(watermarkText, regex);
            return regex;
        } catch (e) {
            logger.warn('创建正则表达式失败:', e);
            return null;
        }
    }

    // 格式化错误上下文信息
    function formatErrorContext(error, additionalContext = {}) {
        return {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...additionalContext
        };
    }

    // 验证配置对象
    function validateConfig(config) {
        const errors = [];

        // 验证 DOM 遍历配置
        if (config.MAX_DEPTH < 1 || config.MAX_DEPTH > 20) {
            errors.push('MAX_DEPTH must be between 1 and 20');
        }
        if (config.MAX_NODES < 100 || config.MAX_NODES > 100000) {
            errors.push('MAX_NODES must be between 100 and 100000');
        }

        // 验证轮询配置
        if (config.MAX_POLL_COUNT < 1 || config.MAX_POLL_COUNT > 100) {
            errors.push('MAX_POLL_COUNT must be between 1 and 100');
        }
        if (config.POLL_INTERVAL < 100 || config.POLL_INTERVAL > 10000) {
            errors.push('POLL_INTERVAL must be between 100 and 10000');
        }

        // 验证重试配置
        if (config.MAX_RETRIES < 0 || config.MAX_RETRIES > 10) {
            errors.push('MAX_RETRIES must be between 0 and 10');
        }
        if (config.RETRY_DELAY < 100 || config.RETRY_DELAY > 60000) {
            errors.push('RETRY_DELAY must be between 100 and 60000');
        }
        if (config.RETRY_BACKOFF < 1 || config.RETRY_BACKOFF > 3) {
            errors.push('RETRY_BACKOFF must be between 1 and 3');
        }

        // 验证超时配置
        if (config.FETCH_TIMEOUT < 1000 || config.FETCH_TIMEOUT > 60000) {
            errors.push('FETCH_TIMEOUT must be between 1000 and 60000');
        }
        if (config.REGEX_TIMEOUT < 10 || config.REGEX_TIMEOUT > 10000) {
            errors.push('REGEX_TIMEOUT must be between 10 and 10000');
        }

        // 验证水印文本限制
        if (config.MAX_WATERMARK_LENGTH < 1 || config.MAX_WATERMARK_LENGTH > 10000) {
            errors.push('MAX_WATERMARK_LENGTH must be between 1 and 10000');
        }
        if (config.MIN_WATERMARK_LENGTH < 1 || config.MIN_WATERMARK_LENGTH > config.MAX_WATERMARK_LENGTH) {
            errors.push('MIN_WATERMARK_LENGTH must be between 1 and MAX_WATERMARK_LENGTH');
        }

        // 验证防抖配置
        if (config.OBSERVER_DEBOUNCE < 10 || config.OBSERVER_DEBOUNCE > 1000) {
            errors.push('OBSERVER_DEBOUNCE must be between 10 and 1000');
        }
        if (config.RESIZE_DEBOUNCE < 100 || config.RESIZE_DEBOUNCE > 5000) {
            errors.push('RESIZE_DEBOUNCE must be between 100 and 5000');
        }

        // 验证水印检测阈值配置
        if (config.VIEWPORT_COVERAGE_THRESHOLD < 0.5 || config.VIEWPORT_COVERAGE_THRESHOLD > 1) {
            errors.push('VIEWPORT_COVERAGE_THRESHOLD must be between 0.5 and 1');
        }
        if (config.BASE64_MATCH_MAX_LENGTH < 10 || config.BASE64_MATCH_MAX_LENGTH > 1000) {
            errors.push('BASE64_MATCH_MAX_LENGTH must be between 10 and 1000');
        }
        if (config.PAGE_LOAD_WAIT_TIME < 1000 || config.PAGE_LOAD_WAIT_TIME > 10000) {
            errors.push('PAGE_LOAD_WAIT_TIME must be between 1000 and 10000');
        }

        // 验证性能优化配置
        if (typeof config.USE_TREE_WALKER !== 'boolean') {
            errors.push('USE_TREE_WALKER must be a boolean');
        }

        if (errors.length > 0) {
            logger.error('配置验证失败:', errors);
            throw new Error('Invalid configuration: ' + errors.join(', '));
        }

        logger.log('配置验证通过');
    }

    // 检查文本内容是否包含水印
    function containsWatermark(text) {
        // 添加输入验证
        if (text === null || text === undefined) return false;
        if (typeof text !== 'string') return false;
        if (!Array.isArray(WATERMARK_TEXT_CANDIDATES) || WATERMARK_TEXT_CANDIDATES.length === 0) return false;

        // 候选列表已在 rebuildWatermarkCandidates 中预过滤，直接使用
        return WATERMARK_TEXT_CANDIDATES.some((candidate) => text.includes(candidate));
    }

    // 检查水印文本是否安全，防止正则表达式拒绝服务攻击
    function isSafeWatermarkText(text) {
        if (!text || typeof text !== 'string') return false;
        if (text.length === 0 || text.length > CONFIG.MAX_WATERMARK_LENGTH) return false;

        // 检查是否包含可能导致 ReDoS 的模式
        const dangerousPatterns = [
            /(.+)\1{10,}/, // 重复字符
            /(.+?)(\1+){5,}/, // 重复子串
            /[\(\)\[\]\{\}]{20,}/, // 过多嵌套
        ];

        return !dangerousPatterns.some(pattern => pattern.test(text));
    }

    function rebuildWatermarkCandidates() {
        const candidates = [];

        // 验证 WATERMARK_TEXT
        if (!WATERMARK_TEXT || typeof WATERMARK_TEXT !== 'string') {
            WATERMARK_TEXT_CANDIDATES = [];
            logger.warn('WATERMARK_TEXT 无效，清空候选列表');
            return;
        }

        candidates.push(WATERMARK_TEXT);

        try {
            // 尝试 Base64 解码
            const decoded = atob(WATERMARK_TEXT);
            if (decoded && typeof decoded === 'string') {
                candidates.push(decoded);

                // 尝试 UTF-8 解码（处理多字节字符）
                try {
                    const bytes = new Uint8Array(decoded.length);
                    for (let i = 0; i < decoded.length; i++) {
                        bytes[i] = decoded.charCodeAt(i);
                    }
                    const utf8 = new TextDecoder('utf-8').decode(bytes);
                    if (utf8 && typeof utf8 === 'string' && utf8 !== decoded) {
                        candidates.push(utf8);
                    }
                } catch (_) {
                    // UTF-8 解码失败，忽略
                }
            }
        } catch (_) {
            // Base64 解码失败，忽略
        }

        // 预过滤候选列表，只保留有效的字符串
        WATERMARK_TEXT_CANDIDATES = Array.from(new Set(
            candidates.filter(c => c && typeof c === 'string' && c.length > 0)
        ));
        logger.log('水印匹配候选:', WATERMARK_TEXT_CANDIDATES);
    }

    // 检查元素是否是有效的水印候选元素（Canvas 或容器元素）
    function isValidWatermarkElement(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
        const tag = element.tagName;
        const isCanvas = tag === 'CANVAS';
        const isDivLike = tag === 'DIV' || tag === 'SECTION' || tag === 'MAIN' || tag === 'ASIDE';
        return isCanvas || isDivLike;
    }

    // 检查元素是否设置了 pointer-events: none
    function hasPointerEventsNone(element) {
        // 快速检查：内联样式
        if (element.style && element.style.pointerEvents === 'auto') return false;

        const style = getCachedStyle(element);
        if (!style) return false;
        return style.pointerEvents === 'none';
    }

    // 检查元素是否有高 z-index
    function hasHighZIndex(element) {
        const style = getCachedStyle(element);
        if (!style) return false;

        const zIndexStr = style.zIndex;
        if (zIndexStr && zIndexStr !== 'auto') {
            const zIndex = Number(zIndexStr);
            return Number.isFinite(zIndex) && zIndex >= CONFIG.HIGH_ZINDEX_THRESHOLD;
        }
        return false;
    }

    // 检查元素是否有低透明度
    function hasLowOpacity(element) {
        const style = getCachedStyle(element);
        if (!style) return false;

        const opacityStr = style.opacity;
        if (opacityStr && opacityStr !== 'auto') {
            const opacity = Number(opacityStr);
            return Number.isFinite(opacity) && opacity < CONFIG.LOW_OPACITY_THRESHOLD;
        }
        return false;
    }

    // 检查元素是否有绝对定位（fixed 或 absolute）
    function hasAbsolutePosition(element) {
        const style = getCachedStyle(element);
        if (!style) return false;
        return style.position === 'fixed' || style.position === 'absolute';
    }

    // 检查元素是否有背景图片
    function hasBackgroundImage(element) {
        const style = getCachedStyle(element);
        if (!style) return false;

        const bgImage = style.backgroundImage;
        return bgImage && bgImage !== 'none';
    }

    // 检查元素是否覆盖大部分视口
    function coversMostViewport(element) {
        let rect;
        try {
            rect = element.getBoundingClientRect();
        } catch (e) {
            logger.warn('获取元素尺寸失败:', e);
            logger.stat('domErrors');
            return false;
        }

        // 处理视口尺寸为 0 的情况（如在 iframe 中）
        const vw = window.innerWidth || document.documentElement.clientWidth || 0;
        const vh = window.innerHeight || document.documentElement.clientHeight || 0;

        // 如果视口尺寸为 0，使用文档尺寸
        const useDocWidth = vw === 0;
        const useDocHeight = vh === 0;
        const docWidth = useDocWidth ? document.documentElement.scrollWidth : vw;
        const docHeight = useDocHeight ? document.documentElement.scrollHeight : vh;

        return (docWidth > 0 && docHeight > 0) &&
               (rect.width >= docWidth * CONFIG.VIEWPORT_COVERAGE_THRESHOLD && 
                rect.height >= docHeight * CONFIG.VIEWPORT_COVERAGE_THRESHOLD);
    }

    /**
     * 检查元素是否可能是水印覆盖层
     * @param {HTMLElement} element - 要检查的DOM元素
     * @returns {boolean} 如果元素可能是水印覆盖层返回true，否则返回false
     *
     * 判断标准:
     * 1. 元素是Canvas或容器元素(DIV/SECTION/MAIN/ASIDE)
     * 2. 设置了pointer-events: none
     * 3. 有背景图片或是Canvas
     * 4. 覆盖大部分视口(>=90%)
     * 5. 至少满足以下条件之一: 高z-index、低透明度、绝对定位
     */
    function isLikelyWatermarkOverlay(element) {
        if (!isValidWatermarkElement(element)) return false;
        if (!hasPointerEventsNone(element)) return false;

        const isCanvas = element.tagName === 'CANVAS';
        if (!hasBackgroundImage(element) && !isCanvas) return false;

        if (!coversMostViewport(element)) return false;

        // 至少满足以下条件之一：高 z-index、低透明度、绝对定位
        const hasStyleLikely = hasHighZIndex(element) || hasLowOpacity(element) || hasAbsolutePosition(element);
        if (!hasStyleLikely) return false;

        return true;
    }

    function hideOverlayElement(element) {
        if (!element || processedElements.has(element)) return;
        try {
            if (element.style) {
                element.style.backgroundImage = 'none';
                element.style.background = 'none';
                element.style.opacity = '0';
                element.style.visibility = 'hidden';
                element.style.display = 'none';
            }
            processedElements.add(element);
        } catch (e) {
            logger.warn('隐藏元素时出错:', e);
        }
    }

    // 初始化遍历栈
    function initializeTraversalStack(root) {
        return [{ node: root, depth: 0 }];
    }

    // 处理单个元素节点
    function processElementNode(node) {
        if (processedElements.has(node)) return false;

        // 优先检测并隐藏水印覆盖层
        if (isLikelyWatermarkOverlay(node)) {
            hideOverlayElement(node);
            return true;
        }

        // 检查当前节点是否包含水印文本或图片
        if (WATERMARK_TEXT && (elementContainsWatermark(node) || imageContainsWatermark(node))) {
            removeWatermark(node);
            return true;
        }

        return false;
    }

    // 处理子节点
    function processChildNodes(node, stack, depth) {
        if (!node.childNodes || !node.childNodes.length) return;

        // 反向遍历，保持处理顺序
        for (let i = node.childNodes.length - 1; i >= 0; i--) {
            const child = node.childNodes[i];
            if (child.nodeType === Node.TEXT_NODE) {
                // 检查并移除文本节点中的水印
                const textContent = child.textContent || '';
                if (WATERMARK_TEXT && containsWatermark(textContent)) {
                    child.remove();
                }
            } else if (child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                stack.push({ node: child, depth: depth + 1 });
            }
        }
    }

    // 处理 Shadow Root
    function processShadowRoot(node, stack, depth) {
        if (node.nodeType === Node.ELEMENT_NODE && node.shadowRoot) {
            stack.push({ node: node.shadowRoot, depth: depth + 1 });
        }
    }

    // 检查处理限制
    function checkProcessingLimit(processedNodes, maxNodes) {
        if (processedNodes >= maxNodes) {
            logger.warn('已达到最大节点处理限制，停止遍历');
            return false;
        }
        return true;
    }

    // 使用 TreeWalker API 进行水印检测（性能优化版本）
    function detectAndRemoveWatermarksWithTreeWalker(root = document.body, maxNodes = CONFIG.MAX_NODES) {
        if (!root) return;

        let processedNodes = 0;

        try {
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_DOCUMENT_FRAGMENT,
                {
                    acceptNode: (node) => {
                        if (processedNodes >= maxNodes) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            let node;
            while ((node = walker.nextNode()) && processedNodes < maxNodes) {
                processedNodes++;

                try {
                    // 处理元素节点
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (processedElements.has(node)) continue;

                        // 优先检测并隐藏水印覆盖层
                        if (isLikelyWatermarkOverlay(node)) {
                            hideOverlayElement(node);
                            continue;
                        }

                        // 检查当前节点是否包含水印文本或图片
                        if (WATERMARK_TEXT && (elementContainsWatermark(node) || imageContainsWatermark(node))) {
                            removeWatermark(node);
                            continue;
                        }
                    }

                    // 处理文本节点
                    if (node.nodeType === Node.TEXT_NODE) {
                        const textContent = node.textContent || '';
                        if (WATERMARK_TEXT && containsWatermark(textContent)) {
                            node.remove();
                        }
                    }

                    // 处理 Document Fragment (如 Shadow Root)
                    // 注意：TreeWalker 会自动遍历 Shadow Root，不需要递归调用
                } catch (e) {
                    logger.warn('检测水印时出错:', formatErrorContext(e, {
                        nodeType: node?.nodeType,
                        tagName: node?.tagName
                    }));
                }
            }

            checkProcessingLimit(processedNodes, maxNodes);
        } catch (e) {
            logger.error('TreeWalker 遍历失败，回退到普通遍历:', e);
            // 回退到普通遍历
            detectAndRemoveWatermarks(root);
        }
    }

    // 统一的水印检测和移除函数
    function detectAndRemoveWatermarks(root = document.body) {
        if (!root) return;

        // 根据配置选择遍历方式
        if (CONFIG.USE_TREE_WALKER) {
            detectAndRemoveWatermarksWithTreeWalker(root);
            return;
        }

        const maxDepth = CONFIG.MAX_DEPTH;
        const maxNodes = CONFIG.MAX_NODES;
        let processedNodes = 0;

        // 使用迭代代替递归，防止调用栈溢出
        const stack = initializeTraversalStack(root);

        while (stack.length > 0 && processedNodes < maxNodes) {
            const { node, depth } = stack.pop();

            if (!node || depth > maxDepth) continue;

            processedNodes++;

            try {
                // 处理元素节点
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const handled = processElementNode(node);
                    if (handled) continue;
                }

                // 遍历子节点
                processChildNodes(node, stack, depth);

                // 处理 Shadow Root
                processShadowRoot(node, stack, depth);
            } catch (e) {
                logger.warn('检测水印时出错:', formatErrorContext(e, {
                    nodeType: node?.nodeType,
                    tagName: node?.tagName,
                    depth: depth
                }));
            }
        }

        checkProcessingLimit(processedNodes, maxNodes);
    }

    // 检查元素是否包含水印文本
    function elementContainsWatermark(element) {
        if (!element || processedElements.has(element)) return false;
        
        // 检查 textContent
        if (containsWatermark(element.textContent)) return true;
        
        // 检查 innerText
        if (containsWatermark(element.innerText)) return true;
        
        // 检查 innerHTML
        if (containsWatermark(element.innerHTML)) return true;
        
        // 检查 value 属性（用于 input、textarea 等）
        if (element.value && containsWatermark(element.value)) return true;
        
        // 检查所有属性值
        if (element.attributes) {
            for (let attr of element.attributes) {
                if (containsWatermark(attr.value)) return true;
            }
        }
        
        return false;
    }

    // 检查图片是否包含水印
    function imageContainsWatermark(element) {
        if (!element) return false;

        // 检查 img src
        if (element.tagName === 'IMG' && element.src) {
            if (containsWatermark(element.src)) return true;
        }

        // 检查背景图片（使用缓存）
        const style = getCachedStyle(element);
        if (style) {
            const bgImage = style.backgroundImage;
            if (bgImage && bgImage !== 'none' && containsWatermark(bgImage)) {
                return true;
            }
        }

        // 检查内联样式
        if (element.style && element.style.backgroundImage) {
            if (containsWatermark(element.style.backgroundImage)) return true;
        }

        return false;
    }

    /**
     * 移除水印元素
     * @param {HTMLElement} element - 要移除水印的DOM元素
     * @returns {void}
     *
     * 功能说明:
     * - 如果元素只包含水印文本，直接移除元素
     * - 如果元素包含其他内容，尝试移除水印文本部分
     * - 如果是图片水印，清除背景图片或隐藏元素
     * - 使用安全的正则表达式替换，避免XSS攻击
     */
    function removeWatermark(element) {
        if (!element || processedElements.has(element)) return;

        try {
            // 标记为已处理
            processedElements.add(element);

            // 如果是图片水印，尝试清除背景或移除元素
            if (imageContainsWatermark(element)) {
                // 尝试清除背景图片
                if (element.style) {
                    element.style.backgroundImage = 'none';
                    element.style.background = 'none';
                }
                // 如果是 img 标签，隐藏或移除
                if (element.tagName === 'IMG') {
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.remove();
                    return;
                }
            }

            // 检查是否是文本水印
            if (elementContainsWatermark(element)) {
                // 如果元素只包含水印文本，直接移除
                const text = element.textContent || element.innerText || '';
                if (WATERMARK_TEXT && (text.trim() === WATERMARK_TEXT || text.includes(WATERMARK_TEXT))) {
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.remove();
                    return;
                }

                // 如果元素包含其他内容，尝试移除水印文本部分
                // 使用更安全的正则表达式转义，并添加安全验证
                if (WATERMARK_TEXT && isSafeWatermarkText(WATERMARK_TEXT)) {
                    try {
                        const watermarkRegex = getWatermarkRegex(WATERMARK_TEXT);
                        if (!watermarkRegex) {
                            logger.warn('无法获取水印正则表达式，跳过');
                            return;
                        }

                        // 添加超时保护，在整个操作前后检查
                        const startTime = Date.now();
                        const maxTime = CONFIG.REGEX_TIMEOUT;

                        // 检查是否超时
                        if (Date.now() - startTime > maxTime) {
                            logger.warn('正则替换超时，跳过');
                            return;
                        }

                        if (element.textContent) {
                            element.textContent = element.textContent.replace(watermarkRegex, '');
                        }
                        if (element.innerText) {
                            element.innerText = element.innerText.replace(watermarkRegex, '');
                        }
                        // 处理innerHTML中的水印（包括属性值）
                        // 注意：水印文本已通过isSafeWatermarkText()验证，直接替换是安全的
                        if (element.innerHTML) {
                            element.innerHTML = element.innerHTML.replace(watermarkRegex, '');
                        }

                        // 最终超时检查
                        if (Date.now() - startTime > maxTime) {
                            logger.warn('正则替换超时，部分替换可能未完成');
                        }
                    } catch (e) {
                        logger.warn('正则表达式替换失败:', e);
                    }
                } else if (WATERMARK_TEXT && !isSafeWatermarkText(WATERMARK_TEXT)) {
                    logger.warn('水印文本不安全，跳过正则替换');
                }

                // 如果移除文本后元素为空，则移除元素
                if (!element.textContent || element.textContent.trim() === '') {
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.remove();
                }
            }
        } catch (e) {
            logger.warn('移除水印时出错:', formatErrorContext(e, {
                tagName: element?.tagName,
                hasWatermarkText: !!WATERMARK_TEXT
            }));
        }
    }

    // 初始化检测
    function init() {
        // 等待 DOM 加载完成
        if (document.body) {
            detectAndRemoveWatermarks();
        } else {
            // 如果 body 还未加载，等待 DOMContentLoaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    detectAndRemoveWatermarks();
                });
            }
        }
    }

    // 创建 MutationObserver 监听 DOM 变化（仅处理发生变化的局部节点，降低 CPU 占用）
    function setupObserver() {
        const scheduleLocalScan = debounce((nodes, mutationType = 'default') => {
            try {
                nodes.forEach((node) => {
                    if (!node) return;

                    // 使用精细的缓存清理策略
                    clearStyleCacheForNode(node, mutationType);

                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                        detectAndRemoveWatermarks(node);
                    }
                });
            } catch (e) {
                logger.warn('局部扫描时出错:', e);
            }
        }, CONFIG.OBSERVER_DEBOUNCE);

        const observer = new MutationObserver((mutations) => {
            // 更新变化计数，用于智能轮询
            mutationCount += mutations.length;

            const nodesToScan = { childList: [], attribute: [] };

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // 子节点添加，使用 childList 策略清理缓存
                    const addedNodes = Array.from(mutation.addedNodes);
                    nodesToScan.childList.push(...addedNodes);
                }

                if (mutation.type === 'attributes') {
                    const attrName = mutation.attributeName;
                    // 监听 style、src、class 属性变化
                    if (attrName === 'style' || attrName === 'src' || attrName === 'class') {
                        if (mutation.target) {
                            // 属性变化，使用 attribute 策略清理缓存
                            nodesToScan.attribute.push(mutation.target);
                        }
                    }
                }
            });

            // 分别处理不同类型的节点
            if (nodesToScan.childList.length > 0) {
                scheduleLocalScan(nodesToScan.childList, 'childList');
            }
            if (nodesToScan.attribute.length > 0) {
                scheduleLocalScan(nodesToScan.attribute, 'attribute');
            }
        });

        // 配置观察选项
        const config = {
            childList: true,      // 监听子节点的添加和删除
            subtree: true,         // 监听所有后代节点
            attributes: true,     // 监听属性变化
            attributeFilter: ['style', 'src', 'class'] // 只监听特定属性
        };

        // 开始观察
        if (document.body) {
            globalObserver = observer;
            observer.observe(document.body, config);
        } else {
            // 等待 body 加载后再开始观察
            const bodyObserver = new MutationObserver((mutations, obs) => {
                if (document.body) {
                    globalObserver = observer;
                    observer.observe(document.body, config);
                    obs.disconnect();
                }
            });
            bodyObserver.observe(document.documentElement, { childList: true });
        }

        // 在页面卸载时清理observer
        window.addEventListener('unload', () => {
            if (globalObserver) {
                globalObserver.disconnect();
                globalObserver = null;
            }
        });
    }

    // Canvas 水印检测（拦截 Canvas 绘制操作）
    function interceptCanvas() {
        // 检查配置开关
        if (!CONFIG.ENABLE_CANVAS_INTERCEPT) {
            logger.log('Canvas 拦截已禁用，跳过');
            return;
        }

        // 添加标记，避免重复修改原型
        if (CanvasRenderingContext2D.prototype._watermarkIntercepted) {
            logger.log('Canvas 拦截器已安装，跳过重复安装');
            return;
        }

        try {
            const originalFillText = CanvasRenderingContext2D.prototype.fillText;
            const originalStrokeText = CanvasRenderingContext2D.prototype.strokeText;
            const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;

            // 使用 Object.defineProperty 确保属性不可枚举，减少对第三方代码的影响
            Object.defineProperty(CanvasRenderingContext2D.prototype, 'fillText', {
                value: function(...args) {
                    try {
                        const text = args[0];
                        if (text && containsWatermark(String(text))) {
                            return; // 不绘制包含水印的文本
                        }
                        return originalFillText.apply(this, args);
                    } catch (e) {
                        // 发生错误时回退到原始实现
                        logger.warn('fillText 拦截出错，使用原始实现:', e);
                        logger.stat('canvasErrors');
                        return originalFillText.apply(this, args);
                    }
                },
                writable: true,
                configurable: true
            });

            Object.defineProperty(CanvasRenderingContext2D.prototype, 'strokeText', {
                value: function(...args) {
                    try {
                        const text = args[0];
                        if (text && containsWatermark(String(text))) {
                            return; // 不绘制包含水印的文本
                        }
                        return originalStrokeText.apply(this, args);
                    } catch (e) {
                        logger.warn('strokeText 拦截出错，使用原始实现:', e);
                        logger.stat('canvasErrors');
                        return originalStrokeText.apply(this, args);
                    }
                },
                writable: true,
                configurable: true
            });

            Object.defineProperty(CanvasRenderingContext2D.prototype, 'drawImage', {
                value: function(...args) {
                    try {
                        // 检查图片源是否包含水印
                        const image = args[0];
                        if (image && image.src && containsWatermark(image.src)) {
                            return; // 不绘制包含水印的图片
                        }
                        return originalDrawImage.apply(this, args);
                    } catch (e) {
                        logger.warn('drawImage 拦截出错，使用原始实现:', e);
                        logger.stat('canvasErrors');
                        return originalDrawImage.apply(this, args);
                    }
                },
                writable: true,
                configurable: true
            });

            // 标记已拦截
            Object.defineProperty(CanvasRenderingContext2D.prototype, '_watermarkIntercepted', {
                value: true,
                writable: true,
                configurable: true
            });
        } catch (e) {
            logger.error('拦截 CanvasRenderingContext2D 失败:', e);
            logger.stat('canvasErrors');
        }

        try {
            if (typeof OffscreenCanvasRenderingContext2D !== 'undefined' &&
                !OffscreenCanvasRenderingContext2D.prototype._watermarkIntercepted) {
                const offscreenOriginalFillText = OffscreenCanvasRenderingContext2D.prototype.fillText;
                const offscreenOriginalStrokeText = OffscreenCanvasRenderingContext2D.prototype.strokeText;
                const offscreenOriginalDrawImage = OffscreenCanvasRenderingContext2D.prototype.drawImage;

                Object.defineProperty(OffscreenCanvasRenderingContext2D.prototype, 'fillText', {
                    value: function(...args) {
                        try {
                            const text = args[0];
                            if (text && containsWatermark(String(text))) return;
                            return offscreenOriginalFillText.apply(this, args);
                        } catch (e) {
                            logger.warn('OffscreenCanvas fillText 拦截出错，使用原始实现:', e);
                            logger.stat('canvasErrors');
                            return offscreenOriginalFillText.apply(this, args);
                        }
                    },
                    writable: true,
                    configurable: true
                });

                Object.defineProperty(OffscreenCanvasRenderingContext2D.prototype, 'strokeText', {
                    value: function(...args) {
                        try {
                            const text = args[0];
                            if (text && containsWatermark(String(text))) return;
                            return offscreenOriginalStrokeText.apply(this, args);
                        } catch (e) {
                            logger.warn('OffscreenCanvas strokeText 拦截出错，使用原始实现:', e);
                            logger.stat('canvasErrors');
                            return offscreenOriginalStrokeText.apply(this, args);
                        }
                    },
                    writable: true,
                    configurable: true
                });

                Object.defineProperty(OffscreenCanvasRenderingContext2D.prototype, 'drawImage', {
                    value: function(...args) {
                        try {
                            const image = args[0];
                            if (image && image.src && containsWatermark(image.src)) return;
                            return offscreenOriginalDrawImage.apply(this, args);
                        } catch (e) {
                            logger.warn('OffscreenCanvas drawImage 拦截出错，使用原始实现:', e);
                            logger.stat('canvasErrors');
                            return offscreenOriginalDrawImage.apply(this, args);
                        }
                    },
                    writable: true,
                    configurable: true
                });

                // 标记已拦截
                Object.defineProperty(OffscreenCanvasRenderingContext2D.prototype, '_watermarkIntercepted', {
                    value: true,
                    writable: true,
                    configurable: true
                });
            }
        } catch (e) {
            logger.warn('拦截 OffscreenCanvas 失败:', e);
            logger.stat('canvasErrors');
        }
    }

    function clearSuspectedWatermarkCanvases() {
        const canvases = document.querySelectorAll('canvas');
        if (!canvases || canvases.length === 0) return;

        canvases.forEach((canvas) => {
            if (!canvas || processedElements.has(canvas)) return;

            try {
                const style = getCachedStyle(canvas);
                if (!style) return;

                const positionLikely = style.position === 'fixed' || style.position === 'absolute';
                const pointerEventsNone = style.pointerEvents === 'none';

                const rect = canvas.getBoundingClientRect();
                const vw = window.innerWidth || 0;
                const vh = window.innerHeight || 0;
                const coversMostViewport = vw > 0 && vh > 0 && 
                    rect.width >= vw * CONFIG.VIEWPORT_COVERAGE_THRESHOLD && 
                    rect.height >= vh * CONFIG.VIEWPORT_COVERAGE_THRESHOLD;

                if (coversMostViewport && (positionLikely || pointerEventsNone)) {
                    const ctx2d = canvas.getContext('2d');
                    if (ctx2d) {
                        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
                    }
                    hideOverlayElement(canvas);
                }
            } catch (e) {
                logger.warn('清理Canvas水印时出错:', e);
            }
        });
    }

    function forceRepaint() {
        try {
            const el = document.documentElement;
            if (!el) return;

            const prevTransform = el.style.transform;
            el.style.transform = prevTransform ? prevTransform + ' translateZ(0)' : 'translateZ(0)';
            void el.offsetHeight;
            el.style.transform = prevTransform;

            window.dispatchEvent(new Event('resize'));
        } catch (e) {
            logger.warn('强制重绘时出错:', e);
        }
    }

    // 拦截 CSS 样式（检查伪元素）
    function interceptStyles() {
        // 检查配置开关
        if (!CONFIG.ENABLE_CSS_INTERCEPT && !CONFIG.ENABLE_APPEND_CHILD_INTERCEPT) {
            logger.log('CSS 拦截已禁用，跳过');
            return;
        }

        // 添加标记，避免重复修改原型
        if (CSSStyleSheet.prototype._watermarkIntercepted) {
            logger.log('CSS 拦截器已安装，跳过重复安装');
            return;
        }

        try {
            // 拦截 styleSheet 的插入
            if (CONFIG.ENABLE_CSS_INTERCEPT) {
                const originalInsertRule = CSSStyleSheet.prototype.insertRule;
                CSSStyleSheet.prototype.insertRule = function(rule, index) {
                    try {
                        if (rule && WATERMARK_TEXT && containsWatermark(rule)) {
                            return -1; // 不插入包含水印的规则
                        }
                        return originalInsertRule.call(this, rule, index);
                    } catch (e) {
                        logger.warn('insertRule 拦截出错，使用原始实现:', e);
                        logger.stat('styleErrors');
                        return originalInsertRule.call(this, rule, index);
                    }
                };
            }

            // 标记已拦截
            Object.defineProperty(CSSStyleSheet.prototype, '_watermarkIntercepted', {
                value: true,
                writable: true,
                configurable: true
            });
        } catch (e) {
            logger.error('拦截 CSSStyleSheet 失败:', e);
            logger.stat('styleErrors');
        }

        try {
            // 拦截 style 元素的文本内容
            if (CONFIG.ENABLE_APPEND_CHILD_INTERCEPT) {
                const originalAppendChild = Node.prototype.appendChild;
                Node.prototype.appendChild = function(child) {
                    try {
                        if (child && child.tagName === 'STYLE' && WATERMARK_TEXT) {
                            if (child.textContent && containsWatermark(child.textContent)) {
                                // 添加长度限制，避免处理过长的水印文本
                                if (WATERMARK_TEXT.length < CONFIG.MAX_WATERMARK_LENGTH) {
                                    const watermarkRegex = getWatermarkRegex(WATERMARK_TEXT);
                                    if (watermarkRegex) {
                                        child.textContent = child.textContent.replace(watermarkRegex, '');
                                    }
                                }
                            }
                        }
                        return originalAppendChild.call(this, child);
                    } catch (e) {
                        logger.warn('appendChild 拦截出错，使用原始实现:', e);
                        logger.stat('styleErrors');
                        return originalAppendChild.call(this, child);
                    }
                };
            }

            // 标记已拦截
            Object.defineProperty(Node.prototype, '_watermarkIntercepted', {
                value: true,
                writable: true,
                configurable: true
            });
        } catch (e) {
            logger.error('拦截 Node.appendChild 失败:', e);
            logger.stat('styleErrors');
        }
    }

    // 从 API 获取用户信息和水印内容
    async function fetchWatermark() {
        try {
            logger.log('开始获取水印内容...');
            const browserTimeZone = (typeof Intl !== 'undefined' && Intl.DateTimeFormat)
                ? (Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai')
                : 'Asia/Shanghai';

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);

            let response;
            try {
                response = await fetch(USER_API_URL, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json',
                        'x-timezone': browserTimeZone,
                    },
                    credentials: 'include',
                    signal: controller.signal
                });
            } catch (networkError) {
                clearTimeout(timeoutId);

                const errorContext = formatErrorContext(networkError, {
                    url: USER_API_URL,
                    timeout: CONFIG.FETCH_TIMEOUT
                });

                if (networkError.name === 'AbortError') {
                    logger.error('获取水印请求超时', errorContext);
                    // 可以考虑降级方案：从页面检测水印
                } else if (networkError.name === 'TypeError') {
                    logger.error('网络错误，请检查网络连接', errorContext);
                    // 可以提示用户检查网络
                } else if (networkError.name === 'SecurityError') {
                    logger.error('安全错误，可能是跨域问题', errorContext);
                    // 可以尝试从页面检测
                } else {
                    logger.error('网络请求失败', errorContext);
                }
                logger.stat('fetchErrors');
                return false;
            } finally {
                clearTimeout(timeoutId);
            }

            if (!response.ok) {
                logger.error(`HTTP error! status: ${response.status}`);
                logger.stat('fetchErrors');
                return false;
            }

            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                try {
                    const responseText = await response.text();
                    logger.error('解析 API 响应失败:', jsonError, '响应内容:', responseText);
                } catch (textError) {
                    logger.error('无法读取响应内容:', textError);
                }
                logger.stat('fetchErrors');
                return false;
            }
            logger.log('API 响应:', result);

            // 验证响应结构
            if (!result || typeof result !== 'object') {
                logger.warn('API 响应格式无效');
                return false;
            }

            if (typeof result.code !== 'number') {
                logger.warn('API 响应缺少 code 字段');
                return false;
            }

            if (result.code !== 0) {
                logger.warn('API 返回错误码:', result.code);
                return false;
            }

            if (!result.data || typeof result.data !== 'object') {
                logger.warn('API 响应缺少 data 字段');
                return false;
            }

            if (!result.data.watermark || typeof result.data.watermark !== 'string') {
                logger.warn('API 响应缺少 watermark 字段');
                return false;
            }

            WATERMARK_TEXT = result.data.watermark;
            rebuildWatermarkCandidates();
            logger.log('成功获取水印内容:', WATERMARK_TEXT);
            return true;
        } catch (error) {
            logger.error('获取水印内容时发生未知错误:', formatErrorContext(error));
            logger.stat('fetchErrors');
            return false;
        }
    }

    // 从页面中检测水印（备选方案）
    function detectWatermarkFromPage() {
        try {
            if (WATERMARK_TEXT) return true;

            logger.log('尝试从页面中检测水印...');

            if (!document.body) return false;

            const base64Pattern = /[A-Za-z0-9+/]{20,}={0,2}/g;
            const allText = document.body.innerText || '';
            const matches = allText.match(base64Pattern);

            if (matches && matches.length > 0) {
                for (let match of matches) {
                    if (match.length >= CONFIG.MIN_WATERMARK_LENGTH && 
                        match.length <= CONFIG.BASE64_MATCH_MAX_LENGTH) {
                        const walker = document.createTreeWalker(
                            document.body,
                            NodeFilter.SHOW_TEXT,
                            null
                        );

                        let node;
                        while ((node = walker.nextNode())) {
                            const textContent = node.textContent || '';
                            if (textContent.includes(match)) {
                                WATERMARK_TEXT = match;
                                rebuildWatermarkCandidates();
                                logger.log('从页面检测到水印:', WATERMARK_TEXT);
                                return true;
                            }
                        }
                    }
                }
            }

            return false;
        } catch (error) {
            logger.error('从页面检测水印时出错:', formatErrorContext(error));
            return false;
        }
    }

    // 带重试的获取水印函数
    async function fetchWatermarkWithRetry(maxRetries = CONFIG.MAX_RETRIES, delay = CONFIG.RETRY_DELAY) {
        for (let i = 0; i < maxRetries; i++) {
            logger.log(`尝试获取水印 (${i + 1}/${maxRetries})...`);

            const success = await fetchWatermark();
            if (success && WATERMARK_TEXT) {
                return true;
            }

            // 如果不是最后一次尝试，等待后重试
            if (i < maxRetries - 1) {
                logger.log(`等待 ${delay}ms 后重试...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= CONFIG.RETRY_BACKOFF; // 指数退避
            }
        }

        // 如果 API 获取失败，尝试从页面检测
        logger.log('API 获取失败，尝试从页面检测水印...');
        if (detectWatermarkFromPage()) {
            return true;
        }

        logger.error('无法获取水印内容，脚本将无法正常工作');
        return false;
    }

    // 启动检测和移除功能

    // 全局变量存储定时器和事件监听器引用，防止内存泄漏
    let pollTimer = null;
    let resizeHandler = null;
    let globalObserver = null;
    let mutationCount = 0; // 用于跟踪DOM变化，优化轮询性能

    // 清理函数，用于清理定时器和事件监听器
    function cleanup() {
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
        if (resizeHandler) {
            window.removeEventListener('resize', resizeHandler);
            resizeHandler = null;
        }
        if (globalObserver) {
            globalObserver.disconnect();
            globalObserver = null;
        }
    }

    function startWatermarkRemoval() {
        if (!WATERMARK_TEXT) {
            logger.warn('水印内容为空，无法启动移除功能');
            return false;
        }

        logger.log('启动水印移除功能，水印内容:', WATERMARK_TEXT);

        try {
            interceptCanvas();
            interceptStyles();
            setupObserver();
            detectAndRemoveWatermarks();
            clearSuspectedWatermarkCanvases();
        } catch (error) {
            logger.error('启动水印移除功能时出错:', error);
            return false;
        }

        // 清理旧的定时器和事件监听器，防止重复注册
        cleanup();

        // 添加定期轮询检测，确保捕获动态生成的水印
        let pollCount = 0;
        const maxPollCount = CONFIG.MAX_POLL_COUNT;
        const pollInterval = CONFIG.POLL_INTERVAL;

        // 使用智能轮询:前3次总是执行检测，之后只在有变化时执行
        pollTimer = setInterval(() => {
            pollCount++;
            if (pollCount > maxPollCount) {
                clearInterval(pollTimer);
                pollTimer = null;
                logger.log('轮询检测完成');
                return;
            }

            // 前3次轮询总是执行检测，确保初始加载时的水印能被移除
            // 之后只在有DOM变化时执行，提高性能
            if (pollCount <= 3 || mutationCount > 0) {
                mutationCount = 0; // 重置计数器
                detectAndRemoveWatermarks();
                clearSuspectedWatermarkCanvases();
            }
        }, pollInterval);

        // 监听窗口 resize 事件，确保布局变化时重新检测
        resizeHandler = debounce(() => {
            logger.log('窗口大小改变，重新检测水印');
            detectAndRemoveWatermarks();
            clearSuspectedWatermarkCanvases();
        }, CONFIG.RESIZE_DEBOUNCE);
        window.addEventListener('resize', resizeHandler);

        return true;
    }

    // 主函数
    async function main() {
        logger.log('脚本开始运行...');

        // 验证配置
        try {
            validateConfig(CONFIG);
        } catch (e) {
            logger.error('配置验证失败，脚本无法启动:', e);
            return;
        }

        // 首先尝试获取水印内容（带重试）
        const watermarkFetched = await fetchWatermarkWithRetry(CONFIG.MAX_RETRIES, CONFIG.RETRY_DELAY);

        // 如果成功获取水印，启动移除功能（startWatermarkRemoval 会执行初始检测）
        if (watermarkFetched && WATERMARK_TEXT) {
            startWatermarkRemoval();
        } else {
            // 如果仍然失败，等待页面完全加载后再试一次
            logger.log('等待页面完全加载后重试...');
            window.addEventListener('load', async () => {
                await new Promise(resolve => setTimeout(resolve, CONFIG.PAGE_LOAD_WAIT_TIME));
                const retrySuccess = await fetchWatermarkWithRetry(3, CONFIG.RETRY_DELAY * 2);
                if (retrySuccess && WATERMARK_TEXT) {
                    startWatermarkRemoval();
                } else {
                    // 最后尝试从页面检测
                    if (detectWatermarkFromPage()) {
                        startWatermarkRemoval();
                    }
                }
            });
        }

        // 输出错误统计
        const stats = logger.getStats();
        const totalErrors = stats.fetchErrors + stats.domErrors + stats.canvasErrors + stats.styleErrors;
        if (totalErrors > 0) {
            console.warn('[去水印脚本] 错误统计:', stats);
        }
    }

    // 运行主函数
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();

