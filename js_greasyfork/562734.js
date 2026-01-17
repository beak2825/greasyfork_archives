// ==UserScript==
// @name         BanG Dream官网图片修复
// @version      1.2.4
// @description  修复BanG Dream官网使用的失效AWS S3端点(s3-ap-northeast-1.amazonaws.com)的资源url，替换为有效端点(s3.ap-northeast-1.amazonaws.com)，以解决官网图片无法加载的问题。
// @author       白金石勒喀@bilibili
// @license      MIT
// @match        *://*bang-dream.com/*
// @match        *://*.bang-dream.com/*
// @match        *://*bushiroad.com/*
// @match        *://*.bushiroad.com/*
// @grant        none
// @run-at       document-start
// @icon         https://bang-dream.com/favicon.ico
// @namespace https://greasyfork.org/users/1560574
// @downloadURL https://update.greasyfork.org/scripts/562734/BanG%20Dream%E5%AE%98%E7%BD%91%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/562734/BanG%20Dream%E5%AE%98%E7%BD%91%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 用户配置区 ====================
    const USER_CONFIG = {
        // 是否启用控制台日志
        enableLogging: false,
        // 防抖延迟（毫秒）
        debounceDelay: 128,
        // 自动重载修复后的失败资源
        autoReloadFixedResources: true,
        // 调试模式（输出详细日志）
        debugMode: false
    };

    // ==================== 核心配置 ====================
    const ENDPOINT_FIXES = [
        // BanG Dream S3修复规则
        {
            name: 'bang-dream-portal-fix',
            pattern: /https?:\/\/s3-ap-northeast-1\.amazonaws\.com\/bang-dream-portal\/([^"'<\s]*)/gi,
            replacement: 'https://bang-dream-portal.s3.ap-northeast-1.amazonaws.com/$1'
        },
        // 兜底通用S3修复规则
        {
            name: 'general-ap-northeast-1-fix',
            pattern: /https?:\/\/s3-ap-northeast-1\.amazonaws\.com\/([^"'<\s]*)/gi,
            replacement: 'https://s3.ap-northeast-1.amazonaws.com/$1'
        }
    ];

    // ==================== 私有变量 ====================
    let fixCount = 0;
    let s3FixTimeout = null;
    let mutationObserver = null;
    let scriptEnabled = true; // 新增：脚本启用状态

    // ==================== 工具函数 ====================
    function log(message, isDebug = false) {
        if (!USER_CONFIG.enableLogging) return;
        if (isDebug && !USER_CONFIG.debugMode) return;
        console.log(`[S3修复] ${message}`);
    }

    function errorLog(message, error) {
        console.error(`[S3修复] ${message}`, error);
    }

    // ==================== URL修复核心 ====================
    function fixUrl(url) {
        if (!scriptEnabled) return url; // 新增：检查启用状态
        if (!url || typeof url !== 'string') return url;
        let fixedUrl = url;
        for (const fix of ENDPOINT_FIXES) {
            const newUrl = fixedUrl.replace(fix.pattern, fix.replacement);
            if (newUrl !== fixedUrl) {
                log(`URL修复: ${url} → ${newUrl}`);
                return newUrl;
            }
        }
        return fixedUrl;
    }

    function isS3Url(url) {
        return url && url.includes('s3-ap-northeast-1.amazonaws.com');
    }

    // ==================== DOM元素处理 ====================
    function safeSetAttribute(element, attrName, value) {
        try {
            element.setAttribute(attrName, value);
        } catch (error) {
            errorLog(`设置属性失败: ${attrName}`, error);
        }
    }

    function fixElementAttribute(element, attrName) {
        if (!scriptEnabled) return false; // 新增：检查启用状态
        try {
            const originalValue = element.getAttribute(attrName);
            if (!originalValue) return false;

            // 特殊处理srcset属性
            if (attrName === 'srcset') {
                const fixedSrcset = originalValue.replace(/(https?:\/\/[^,\s]+)/g, (match) => fixUrl(match));
                if (fixedSrcset !== originalValue) {
                    safeSetAttribute(element, attrName, fixedSrcset);
                    return true;
                }
                return false;
            }

            // 普通属性
            const fixedValue = fixUrl(originalValue);
            if (fixedValue !== originalValue) {
                safeSetAttribute(element, attrName, fixedValue);
                return true;
            }
            return false;
        } catch (error) {
            errorLog(`修复元素属性失败: ${attrName}`, error);
            return false;
        }
    }

    function fixElementStyle(element) {
        if (!scriptEnabled) return false; // 新增：检查启用状态
        try {
            const style = element.getAttribute('style');
            if (!style) return false;

            // 改进的正则表达式，更好地匹配CSS url()
            const fixedStyle = style.replace(/url\((['"]?)([^'")]*)['"]?\)/gi, (match, quote, url) => {
                const fixedUrl = fixUrl(url);
                return fixedUrl !== url ? `url(${quote || ''}${fixedUrl}${quote || ''})` : match;
            });

            if (fixedStyle !== style) {
                safeSetAttribute(element, 'style', fixedStyle);
                return true;
            }
            return false;
        } catch (error) {
            errorLog(`修复样式失败`, error);
            return false;
        }
    }

    function fixStyleTag(styleTag) {
        if (!scriptEnabled) return false; // 新增：检查启用状态
        try {
            // 尝试使用现代CSSStyleSheet API
            if (styleTag.sheet && styleTag.sheet.cssRules) {
                let hasChanges = false;
                Array.from(styleTag.sheet.cssRules).forEach(rule => {
                    if (rule.style && rule.style.backgroundImage) {
                        const original = rule.style.backgroundImage;
                        const fixed = fixUrl(original);
                        if (fixed !== original) {
                            rule.style.backgroundImage = fixed;
                            hasChanges = true;
                        }
                    }
                });
                return hasChanges;
            }

            // 回退到文本替换 - 改进版
            const originalContent = styleTag.textContent;
            if (!originalContent) return false;

            // 改进的CSS URL匹配，支持url()和@import
            const cssUrlRegex = /(url\(['"]?|@import\s+['"])([^'")]+)(['"]?\)|['"])/gi;
            let fixedContent = originalContent.replace(cssUrlRegex, (match, prefix, url, suffix) => {
                const fixedUrl = fixUrl(url);
                return fixedUrl !== url ? prefix + fixedUrl + suffix : match;
            });

            if (fixedContent !== originalContent) {
                styleTag.textContent = fixedContent;
                return true;
            }
            return false;
        } catch (error) {
            // 跨域样式表会抛出安全错误，静默处理
            return false;
        }
    }

    // ==================== 增量DOM处理 ====================
    function fixElementAndChildren(rootElement) {
        if (!scriptEnabled) return 0; // 新增：检查启用状态
        const elementsToCheck = [
            { selector: 'img', attrs: ['src', 'srcset'] },
            { selector: 'script[src]', attrs: ['src'] },
            { selector: 'link[rel="stylesheet"][href], link[rel="preload"][href], link[rel="prefetch"][href]', attrs: ['href'] },
            { selector: 'source[src], video[src], audio[src]', attrs: ['src', 'srcset'] },
            { selector: 'iframe[src]', attrs: ['src'] },
            { selector: 'object[data], embed[src]', attrs: ['data', 'src'] },
            { selector: '[style*="background"]', attrs: [] } // 特殊处理
        ];

        let localFixCount = 0;

        elementsToCheck.forEach(({ selector, attrs }) => {
            try {
                const elements = rootElement.matches && rootElement.matches(selector)
                    ? [rootElement]
                    : Array.from(rootElement.querySelectorAll(selector));

                elements.forEach(element => {
                    if (selector.includes('style*="background"')) {
                        if (fixElementStyle(element)) localFixCount++;
                    } else if (selector === 'style') {
                        if (fixStyleTag(element)) localFixCount++;
                    } else {
                        attrs.forEach(attr => {
                            if (fixElementAttribute(element, attr)) localFixCount++;
                        });
                    }
                });
            } catch (error) {
                errorLog(`处理选择器失败: ${selector}`, error);
            }
        });

        // 处理style标签
        if (rootElement.tagName === 'STYLE') {
            if (fixStyleTag(rootElement)) localFixCount++;
        } else {
            const styleTags = rootElement.querySelectorAll ? rootElement.querySelectorAll('style') : [];
            Array.from(styleTags).forEach(tag => {
                if (fixStyleTag(tag)) localFixCount++;
            });
        }

        fixCount += localFixCount;
        return localFixCount;
    }

    // ==================== 网络请求拦截 ====================
    function interceptXHR() {
        try {
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                if (scriptEnabled && url && typeof url === 'string' && isS3Url(url)) { // 新增：检查启用状态
                    const fixedUrl = fixUrl(url);
                    if (fixedUrl !== url) {
                        log(`拦截XHR: ${url} → ${fixedUrl}`, true);
                        url = fixedUrl;
                    }
                }
                return originalOpen.apply(this, [method, url, ...args]);
            };
            log('XHR拦截已启用', true);
        } catch (error) {
            errorLog('XHR拦截初始化失败', error);
        }
    }

    function interceptFetch() {
        try {
            const originalFetch = window.fetch;
            window.fetch = function(input, init) {
                let fixedInput = input;
                if (scriptEnabled) { // 新增：检查启用状态
                    if (typeof input === 'string' && isS3Url(input)) {
                        fixedInput = fixUrl(input);
                    } else if (input instanceof Request) {
                        const url = input.url;
                        if (isS3Url(url)) {
                            const fixedUrl = fixUrl(url);
                            if (fixedUrl !== url) {
                                log(`拦截Fetch: ${url} → ${fixedUrl}`, true);
                                fixedInput = new Request(fixedUrl, input);
                            }
                        }
                    }
                }
                return originalFetch.call(this, fixedInput, init);
            };
            log('Fetch拦截已启用', true);
        } catch (error) {
            errorLog('Fetch拦截初始化失败', error);
        }
    }

    // ==================== MutationObserver ====================
    function initMutationObserver() {
        try {
            const observer = new MutationObserver((mutations) => {
                if (!scriptEnabled) return; // 新增：检查启用状态
                let needsFix = false;
                const elementsToFix = new Set();
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                elementsToFix.add(node);
                                needsFix = true;
                            }
                        });
                    }
                    if (mutation.type === 'attributes' &&
                        ['src', 'href', 'srcset', 'style', 'data'].includes(mutation.attributeName)) {
                        elementsToFix.add(mutation.target);
                        needsFix = true;
                    }
                }

                if (needsFix) {
                    clearTimeout(s3FixTimeout);
                    s3FixTimeout = setTimeout(() => {
                        elementsToFix.forEach(element => {
                            fixElementAndChildren(element);
                        });
                        log(`动态修复完成，当前总计修复: ${fixCount} 个资源`, true);
                    }, USER_CONFIG.debounceDelay);
                }
            });

            // 等待DOM就绪后启动观察 - 修复：添加最大重试限制
            let retryCount = 0;
            const MAX_RETRIES = 10; // 最大重试10次（约1秒）
            function startObserving() {
                if (document.documentElement) {
                    observer.observe(document.documentElement, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['src', 'href', 'srcset', 'style', 'data']
                    });
                    mutationObserver = observer;
                    log('MutationObserver已启动', true);
                } else {
                    retryCount++;
                    if (retryCount < MAX_RETRIES) {
                        setTimeout(startObserving, 10);
                    } else {
                        errorLog('MutationObserver启动失败：document.documentElement 未在1秒内出现');
                    }
                }
            }
            startObserving();
        } catch (error) {
            errorLog('MutationObserver初始化失败', error);
        }
    }

    // ==================== 错误资源重载 ====================
    function initErrorHandler() {
        window.addEventListener('error', (event) => {
            if (!scriptEnabled || !USER_CONFIG.autoReloadFixedResources) return; // 新增：检查启用状态
            const target = event.target;
            if (!target) return;

            const isValidTarget = ['IMG', 'SCRIPT', 'LINK', 'SOURCE', 'VIDEO', 'AUDIO', 'IFRAME'].includes(target.tagName);
            if (!isValidTarget) return;

            const src = target.src || target.href;
            if (src && isS3Url(src)) {
                const fixedSrc = fixUrl(src);
                if (fixedSrc !== src) {
                    log(`检测到错误资源，尝试重载: ${fixedSrc}`);
                    // 克隆并替换元素以强制重载 - 修复：移除 getEventListeners
                    try {
                        const newElement = target.cloneNode(true);
                        if (target.src) newElement.src = fixedSrc;
                        if (target.href) newElement.href = fixedSrc;
                        // 复制 on* 属性的事件处理程序（替代 getEventListeners）
                        for (const prop in target) {
                            if (prop.startsWith('on') && typeof target[prop] === 'function') {
                                newElement[prop] = target[prop];
                            }
                        }
                        target.parentNode.insertBefore(newElement, target);
                        target.remove();
                        fixCount++;
                    } catch (error) {
                        errorLog('资源重载失败', error);
                    }
                }
            }
        }, true);
    }

    // ==================== 初始化 ====================
    function init() {
        log('脚本加载成功，开始初始化...');

        // 1. 拦截网络请求
        interceptXHR();
        interceptFetch();

        // 2. 初始化错误处理
        initErrorHandler();

        // 3. 启动MutationObserver（立即执行）
        initMutationObserver();

        // 4. 修复已存在的DOM元素
        function performInitialFix() {
            try {
                const initialCount = fixCount;
                // 使用document.body或document.documentElement
                const root = document.body || document.documentElement;
                if (root) {
                    fixElementAndChildren(root);
                }
                log(`初始修复完成，修复了 ${fixCount - initialCount} 个资源，总计: ${fixCount}`);
            } catch (error) {
                errorLog('初始修复失败', error);
            }
        }

        // 根据文档状态执行初始修复
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', performInitialFix);
        } else {
            performInitialFix();
        }

        // 5. 暴露控制接口
        window.S3Fixer = {
            version: '1.2.0',
            enabled: true,
            getStats: () => ({
                totalFixed: fixCount,
                config: USER_CONFIG,
                observerActive: !!mutationObserver
            }),
            pause: () => {
                scriptEnabled = false; // 修复：更新内部状态
                window.S3Fixer.enabled = false;
                log('脚本已暂停');
            },
            resume: () => {
                scriptEnabled = true; // 修复：更新内部状态
                window.S3Fixer.enabled = true;
                log('脚本已恢复');
            },
            testUrl: (url) => fixUrl(url),
            fixElement: (element) => fixElementAndChildren(element)
        };

        log('初始化完成！控制台输入 S3Fixer 查看控制接口', true);
    }

    // ==================== 启动脚本 ====================
    // 等待页面上下文准备就绪
    if (typeof window !== 'undefined') {
        init();
    } else {
        errorLog('无法访问window对象，脚本终止');
    }

})();
