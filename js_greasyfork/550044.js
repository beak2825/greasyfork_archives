// ==UserScript==
// @name         GitHub镜像站增强工具
// @namespace    https://github.com/GamblerIX/
// @description  汉化GitHub镜像站界面、加速下载、自动跳转到镜像站
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @version      3.0.3
// @author       GamblerIX
// @license      MIT
// @homepage     https://github.com/GamblerIX/GithubProxy
// @supportURL   https://github.com/GamblerIX/GithubProxy/issues
// @match        https://github.com/*
// @match        https://hub.mihoyo.online/*
// @match        https://skills.github.com/*
// @match        https://gist.github.com/*
// @match        https://gist.mihoyo.online/*
// @match        https://education.github.com/*
// @match        https://www.githubstatus.com/*
// @require      https://update.greasyfork.org/scripts/461072/1661491/GitHub%20%E4%B8%AD%E6%96%87.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        window.onurlchange
// @connect      fanyi.iflyrec.com
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/550044/GitHub%E9%95%9C%E5%83%8F%E7%AB%99%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/550044/GitHub%E9%95%9C%E5%83%8F%E7%AB%99%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置常量 ====================
    const CONFIG = {
        VERSION: '3.0.3',
        LANG: 'zh-CN',

        // 存储键名
        STORAGE_KEYS: {
            AUTO_REDIRECT: 'auto_redirect',
            ENABLE_TRANSLATION: 'enable_translation',
            RAW_FAST_INDEX: 'xiu2_menu_raw_fast',
            RAW_DOWN_LINK: 'menu_rawDownLink',
            GIT_CLONE: 'menu_gitClone',
        },

        // 性能配置
        PERFORMANCE: {
            MAX_TEXT_LENGTH: 500,
            DEBOUNCE_DELAY: 300,
            CACHE_EXPIRE_TIME: 5 * 60 * 1000,
            REQUEST_TIMEOUT: 10000,
        },

        // CSS选择器
        SELECTORS: {
            RELEASE_FOOTER: '.Box-footer',
            RAW_BUTTON: 'a[data-testid="raw-button"]',
            FILE_ICONS: 'div.Box-row svg.octicon.octicon-file, .react-directory-filename-column>svg.color-fg-muted',
        },

        // CSS类名
        CSS_CLASSES: {
            XIU2_RS: 'XIU2-RS',
            XIU2_RF: 'XIU2-RF',
            FILE_DOWNLOAD_LINK: 'fileDownLink',
            TRANSLATE_BUTTON: 'translate-me',
        }
    };

    // ==================== 下载源配置 ====================
    const DOWNLOAD_SOURCES = {
        release: [
            ['https://releases.mihoyo.online/https://github.com', '自建', 'CF CDN - 自建加速源'],
            ['https://github.com', '官方', 'GitHub 官方源']
        ],
        clone: [
            ['https://gitclone.com', 'GitClone', '大陆推荐，首次慢，缓存后较快'],
            ['https://github.com', '官方', 'GitHub 官方源']
        ],
        ssh: [
            ['ssh://git@ssh.github.com:443/', '官方SSH', 'GitHub 官方 SSH 443端口']
        ],
        raw: [
            ['https://raw.mihoyo.online', '自建', 'CF CDN - 自建加速源'],
            ['https://raw.githubusercontent.com', '官方', 'GitHub 官方源']
        ]
    };

    // ==================== 工具函数 ====================
    const Utils = {
        // 防抖函数
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // 安全DOM查询
        safeQuerySelector(selector, parent = document) {
            try {
                return parent.querySelector(selector);
            } catch (error) {
                console.warn(`[GitHub增强] 查询选择器失败: ${selector}`, error);
                return null;
            }
        },

        // 安全DOM查询（多个）
        safeQuerySelectorAll(selector, parent = document) {
            try {
                return parent.querySelectorAll(selector);
            } catch (error) {
                console.warn(`[GitHub增强] 查询选择器失败: ${selector}`, error);
                return [];
            }
        },

        // 创建元素
        createElement(tag, attributes = {}, textContent = '') {
            const element = document.createElement(tag);
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else {
                    element.setAttribute(key, value);
                }
            });
            if (textContent) element.textContent = textContent;
            return element;
        },

        // 获取嵌套属性
        getNestedProperty(obj, path) {
            return path.split('.').reduce((acc, part) => {
                const match = part.match(/(\w+)(?:\[(\d+)\])?/);
                if (!match) return undefined;
                const key = match[1];
                const index = match[2];
                if (acc && acc[key] !== undefined) {
                    return index !== undefined ? acc[key][index] : acc[key];
                }
                return undefined;
            }, obj);
        }
    };

    // ==================== 存储管理 ====================
    const Storage = {
        get(key, defaultValue = null) {
            try {
                return GM_getValue(key, defaultValue);
            } catch (error) {
                console.warn(`[GitHub增强] 获取存储失败: ${key}`, error);
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                GM_setValue(key, value);
                return true;
            } catch (error) {
                console.warn(`[GitHub增强] 设置存储失败: ${key}`, error);
                return false;
            }
        }
    };

    // ==================== 缓存管理 ====================
    class SimpleCache {
        constructor() {
            this.cache = new Map();
            this.expireTime = CONFIG.PERFORMANCE.CACHE_EXPIRE_TIME;
        }

        set(key, value) {
            this.cache.set(key, {
                value,
                expire: Date.now() + this.expireTime
            });
        }

        get(key) {
            const item = this.cache.get(key);
            if (!item) return null;

            if (Date.now() > item.expire) {
                this.cache.delete(key);
                return null;
            }

            return item.value;
        }

        clear() {
            this.cache.clear();
        }
    }

    // ==================== 主应用类 ====================
    class GitHubEnhancer {
        constructor() {
            this.cache = new SimpleCache();
            this.pageConfig = {};
            this.rawFastIndex = Storage.get(CONFIG.STORAGE_KEYS.RAW_FAST_INDEX, 0);

            // 初始化默认设置
            this.initDefaultSettings();
        }

        // 初始化默认设置
        initDefaultSettings() {
            const defaults = {
                [CONFIG.STORAGE_KEYS.AUTO_REDIRECT]: true,
                [CONFIG.STORAGE_KEYS.ENABLE_TRANSLATION]: true,
                [CONFIG.STORAGE_KEYS.RAW_FAST_INDEX]: 0,
                [CONFIG.STORAGE_KEYS.RAW_DOWN_LINK]: true,
                [CONFIG.STORAGE_KEYS.GIT_CLONE]: true,
            };

            Object.entries(defaults).forEach(([key, defaultValue]) => {
                if (Storage.get(key) === null) {
                    Storage.set(key, defaultValue);
                }
            });
        }

        // 初始化应用
        async init() {
            try {
                console.log(`[GitHub增强] v${CONFIG.VERSION} 开始初始化...`);

                // 检查自动跳转
                if (this.shouldRedirect()) {
                    this.performRedirect();
                    return;
                }

                // 检查依赖
                if (!this.checkDependencies()) {
                    return;
                }

                // 初始化功能
                this.setupLanguageEnvironment();
                this.updatePageConfig();
                this.setupEventListeners();
                this.registerMenuCommands();
                this.setupColorMode();

                // 延迟执行的功能
                setTimeout(() => this.addRawFile(), 1000);
                setTimeout(() => this.addRawDownLink(), 2000);

                // 检查Release页面
                if (location.pathname.indexOf('/releases') > -1) {
                    setTimeout(() => this.addRelease(), 1500);
                }

                // 执行初始翻译
                this.performInitialTranslation();

                console.log(`[GitHub增强] 初始化完成`);

            } catch (error) {
                console.error('[GitHub增强] 初始化失败:', error);
                this.showNotification('初始化失败，请刷新页面重试');
            }
        }

        // 检查是否需要重定向
        shouldRedirect() {
            return Storage.get(CONFIG.STORAGE_KEYS.AUTO_REDIRECT) && window.location.host === 'github.com';
        }

        // 执行重定向
        performRedirect() {
            const newUrl = window.location.href.replace('https://github.com', 'https://hub.mihoyo.online');
            console.log(`[GitHub增强] 重定向到: ${newUrl}`);
            window.location.replace(newUrl);
        }

        // 检查依赖
        checkDependencies() {
            if (typeof I18N === 'undefined') {
                this.showNotification('词库文件未加载，脚本无法运行！');
                return false;
            }
            console.log('[GitHub增强] 词库文件已加载');
            return true;
        }

        // 设置语言环境
        setupLanguageEnvironment() {
            document.documentElement.lang = CONFIG.LANG;

            new MutationObserver(() => {
                if (document.documentElement.lang === "en") {
                    document.documentElement.lang = CONFIG.LANG;
                }
            }).observe(document.documentElement, { attributeFilter: ['lang'] });
        }

        // 更新页面配置
        updatePageConfig() {
            const pageType = this.detectPageType();
            if (pageType) {
                this.pageConfig = this.buildPageConfig(pageType);
            }
        }

        // 检测页面类型
        detectPageType() {
            try {
                const url = new URL(window.location.href);
                const { hostname, pathname } = url;

                const pageMap = {
                    'gist.github.com': 'gist1',
                    'www.githubstatus.com': 'status',
                    'skills.github.com': 'skills',
                    'education.github.com': 'education',
                    'gist.mihoyo.online': 'gist2',
                };

                const site = pageMap[hostname] || 'github';
                const specialSites = ['gist1', 'status', 'skills', 'education', 'gist2'];

                if (specialSites.includes(site)) {
                    return site;
                }

                // 简化的页面类型检测
                if (pathname === '/') {
                    return document.body?.classList.contains("logged-in") ? 'dashboard' : 'homepage';
                } else if (pathname.includes('/releases')) {
                    return 'repository';
                } else {
                    return 'repository'; // 默认为仓库页面
                }

            } catch (error) {
                console.warn('[GitHub增强] 页面类型检测失败:', error);
                return 'repository';
            }
        }

        // 构建页面配置
        buildPageConfig(pageType) {
            try {
                return {
                    currentPageType: pageType,
                    staticDict: {
                        ...I18N[CONFIG.LANG].public.static,
                        ...(I18N[CONFIG.LANG][pageType]?.static || {})
                    },
                    regexpRules: [
                        ...(I18N[CONFIG.LANG][pageType]?.regexp || []),
                        ...I18N[CONFIG.LANG].public.regexp
                    ]
                };
            } catch (error) {
                console.warn('[GitHub增强] 构建页面配置失败:', error);
                return { currentPageType: pageType };
            }
        }

        // 设置事件监听
        setupEventListeners() {
            // URL变化监听
            if (window.onurlchange === undefined) {
                this.addUrlChangeEvent();
            }

            window.addEventListener('urlchange', () => {
                this.setupColorMode();
                if (location.pathname.indexOf('/releases') > -1) {
                    this.addRelease();
                }
                setTimeout(() => this.addRawFile(), 1000);
                setTimeout(() => this.addRawDownLink(), 2000);
            });

            // Turbo事件监听
            document.addEventListener('turbo:load', () => {
                this.translateTitle();
            });

            // 设置DOM变化监听器
            this.setupMutationObserver();
        }

        // 设置DOM变化监听器
        setupMutationObserver() {
            const observer = new MutationObserver((mutations) => {
                this.handleMutations(mutations);
            });

            const config = {
                childList: true,
                subtree: true,
                characterData: true
            };

            if (document.body) {
                observer.observe(document.body, config);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    if (document.body) {
                        observer.observe(document.body, config);
                    }
                });
            }
        }

        // 处理DOM变化
        handleMutations(mutations) {
            // 处理Release页面的动态加载
            if (location.pathname.indexOf('/releases') > -1) {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'DIV' &&
                                node.dataset &&
                                node.dataset.viewComponent === 'true' &&
                                node.classList &&
                                node.classList.contains('Box')) {
                                setTimeout(() => this.addRelease(), 100);
                                break;
                            }
                        }
                    }
                }
            }

            // 处理仓库页面的Git Clone等功能
            if (Utils.safeQuerySelector('#repository-container-header:not([hidden])')) {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV') {
                            if (node.parentElement && node.parentElement.id === '__primerPortalRoot__') {
                                // 这里可以添加Git Clone相关的处理
                                setTimeout(() => {
                                    this.addDownloadZIP(node);
                                    this.addGitClone(node);
                                }, 100);
                            }
                        }
                    }
                }
            }

            // 处理翻译
            if (Storage.get(CONFIG.STORAGE_KEYS.ENABLE_TRANSLATION)) {
                const nodesToTranslate = mutations.flatMap(({ addedNodes, type }) => {
                    if (type === 'childList' && addedNodes.length > 0) {
                        return [...addedNodes].filter(node =>
                            node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE
                        );
                    }
                    return [];
                });

                nodesToTranslate.forEach(node => {
                    this.traverseNode(node);
                });
            }
        }

        // 添加URL变化事件
        addUrlChangeEvent() {
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function (...args) {
                const result = originalPushState.apply(this, args);
                window.dispatchEvent(new Event('urlchange'));
                return result;
            };

            history.replaceState = function (...args) {
                const result = originalReplaceState.apply(this, args);
                window.dispatchEvent(new Event('urlchange'));
                return result;
            };

            window.addEventListener('popstate', () => {
                window.dispatchEvent(new Event('urlchange'));
            });
        }

        // 执行初始翻译
        performInitialTranslation() {
            if (Storage.get(CONFIG.STORAGE_KEYS.ENABLE_TRANSLATION)) {
                this.translateTitle();
                this.traverseNode(document.body);
            }
        }

        // 翻译页面标题
        translateTitle() {
            if (!Storage.get(CONFIG.STORAGE_KEYS.ENABLE_TRANSLATION)) return;

            try {
                const text = document.title;
                const cacheKey = `title_${text}`;

                let translatedText = this.cache.get(cacheKey);
                if (translatedText) {
                    document.title = translatedText;
                    return;
                }

                translatedText = I18N[CONFIG.LANG]['title']['static'][text] || '';

                if (!translatedText) {
                    const rules = I18N[CONFIG.LANG]['title'].regexp || [];
                    for (const [pattern, replacement] of rules) {
                        translatedText = text.replace(pattern, replacement);
                        if (translatedText !== text) break;
                    }
                }

                if (translatedText && translatedText !== text) {
                    document.title = translatedText;
                    this.cache.set(cacheKey, translatedText);
                }
            } catch (error) {
                console.warn('[GitHub增强] 标题翻译失败:', error);
            }
        }

        // 遍历并翻译节点
        traverseNode(rootNode) {
            if (!Storage.get(CONFIG.STORAGE_KEYS.ENABLE_TRANSLATION) || !rootNode) return;

            try {
                if (rootNode.nodeType === Node.TEXT_NODE) {
                    this.translateTextNode(rootNode);
                    return;
                }

                const walker = document.createTreeWalker(
                    rootNode,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );

                let node;
                while (node = walker.nextNode()) {
                    this.translateTextNode(node);
                }
            } catch (error) {
                console.warn('[GitHub增强] 节点遍历失败:', error);
            }
        }

        // 翻译文本节点
        translateTextNode(node) {
            if (!node.textContent || node.textContent.length > CONFIG.PERFORMANCE.MAX_TEXT_LENGTH) return;

            const text = node.textContent.trim();
            if (!text || /^[\s0-9]*$/.test(text) || /^[\u4e00-\u9fa5]+$/.test(text)) return;

            const translatedText = this.translateText(text);
            if (translatedText && translatedText !== text) {
                node.textContent = node.textContent.replace(text, translatedText);
            }
        }

        // 翻译文本
        translateText(text) {
            if (!this.pageConfig.staticDict) return false;

            const cacheKey = `text_${text}`;
            let translatedText = this.cache.get(cacheKey);
            if (translatedText) return translatedText;

            // 静态翻译
            translatedText = this.pageConfig.staticDict[text];
            if (typeof translatedText === 'string') {
                this.cache.set(cacheKey, translatedText);
                return translatedText;
            }

            // 正则翻译
            if (this.pageConfig.regexpRules) {
                for (const [pattern, replacement] of this.pageConfig.regexpRules) {
                    try {
                        translatedText = text.replace(pattern, replacement);
                        if (translatedText !== text) {
                            this.cache.set(cacheKey, translatedText);
                            return translatedText;
                        }
                    } catch (error) {
                        console.warn('[GitHub增强] 正则翻译失败:', error);
                    }
                }
            }

            return false;
        }

        // 设置颜色模式
        setupColorMode() {
            try {
                let styleElement = document.getElementById('XIU2-Github');
                if (!styleElement) {
                    styleElement = Utils.createElement('style', {
                        id: 'XIU2-Github',
                        type: 'text/css'
                    });
                    document.head.appendChild(styleElement);
                }

                let backColor = '#ffffff', fontColor = '#888888';
                const rootElement = document.documentElement;

                if (rootElement.dataset.colorMode === 'dark') {
                    if (rootElement.dataset.darkTheme === 'dark_dimmed') {
                        backColor = '#272e37';
                        fontColor = '#768390';
                    } else {
                        backColor = '#161a21';
                        fontColor = '#97a0aa';
                    }
                }

                styleElement.textContent = `.XIU2-RS a {--XIU2-background-color: ${backColor}; --XIU2-font-color: ${fontColor};}`;
            } catch (error) {
                console.warn('[GitHub增强] 颜色模式设置失败:', error);
            }
        }

        // 添加Release加速下载
        addRelease() {
            try {
                console.log('[GitHub增强] 尝试添加Release加速下载...');

                const footers = Utils.safeQuerySelectorAll(CONFIG.SELECTORS.RELEASE_FOOTER);
                console.log(`[GitHub增强] 找到 ${footers.length} 个 footer 元素`);

                if (footers.length === 0) {
                    console.log('[GitHub增强] 未找到Release页面的footer元素');
                    return;
                }

                if (location.pathname.indexOf('/releases') === -1) {
                    console.log('[GitHub增强] 当前不在Release页面');
                    return;
                }

                const downloadSources = DOWNLOAD_SOURCES.release;
                const divDisplay = document.documentElement.clientWidth > 755
                    ? 'margin-top: -3px;margin-left: 8px;display: inherit;'
                    : 'margin-left: -90px;';

                // 添加样式（如果不存在）
                if (!document.querySelector('#XIU2-release-style')) {
                    const style = Utils.createElement('style', { id: 'XIU2-release-style' });
                    style.textContent = '@media (min-width: 768px) {.Box-footer li.Box-row>div>span.color-fg-muted {min-width: 27px !important;}}';
                    document.head.appendChild(style);
                }

                let addedCount = 0;
                footers.forEach(footer => {
                    if (footer.querySelector(`.${CONFIG.CSS_CLASSES.XIU2_RS}`)) {
                        console.log('[GitHub增强] 该footer已存在加速按钮，跳过');
                        return;
                    }

                    const links = Utils.safeQuerySelectorAll('li.Box-row a', footer);
                    console.log(`[GitHub增强] 在footer中找到 ${links.length} 个下载链接`);

                    links.forEach(link => {
                        const href = link.href.split(location.host);
                        if (href.length < 2) return;

                        let html = `<div class="${CONFIG.CSS_CLASSES.XIU2_RS}" style="${divDisplay}">`;

                        downloadSources.forEach(([sourceUrl, sourceName, sourceDesc]) => {
                            const url = sourceUrl + href[1];
                            const buttonStyle = 'padding:0 6px; margin-right: -1px; border-radius: 2px; background-color: var(--XIU2-background-color); border-color: var(--borderColor-default); font-size: 11px; color: var(--XIU2-font-color);';
                            html += `<a style="${buttonStyle}" class="btn" href="${url}" target="_blank" title="${sourceDesc}" rel="noreferrer noopener nofollow">${sourceName}</a>`;
                        });

                        html += '</div>';

                        const nextElement = link.parentElement.nextElementSibling;
                        if (nextElement) {
                            nextElement.insertAdjacentHTML('beforeend', html);
                            addedCount++;
                        }
                    });
                });

                console.log(`[GitHub增强] 成功添加了 ${addedCount} 个Release加速按钮`);

            } catch (error) {
                console.warn('[GitHub增强] Release加速添加失败:', error);
            }
        }

        // 添加Raw文件加速
        addRawFile() {
            try {
                const rawButton = Utils.safeQuerySelector(CONFIG.SELECTORS.RAW_BUTTON);
                if (!rawButton) return;

                Utils.safeQuerySelectorAll(`.${CONFIG.CSS_CLASSES.XIU2_RF}`).forEach(el => el.remove());

                const href = location.href.replace(`https://${location.host}`, '');
                const href2 = href.replace('/blob/', '/');
                let html = '';

                for (let i = 1; i < DOWNLOAD_SOURCES.raw.length; i++) {
                    const [sourceUrl, sourceName, sourceDesc] = DOWNLOAD_SOURCES.raw[i];
                    const url = sourceUrl + href2;
                    html += `<a href="${url}" title="${sourceDesc}" target="_blank" role="button" rel="noreferrer noopener nofollow" data-size="small" data-variant="default" class="${rawButton.className} ${CONFIG.CSS_CLASSES.XIU2_RF}" style="border-radius: 0;margin-left: -1px;">${sourceName}</a>`;
                }

                rawButton.insertAdjacentHTML('afterend', html);

            } catch (error) {
                console.warn('[GitHub增强] Raw文件加速添加失败:', error);
            }
        }

        // 添加Raw文件下载链接
        addRawDownLink() {
            if (!Storage.get(CONFIG.STORAGE_KEYS.RAW_DOWN_LINK)) return;

            try {
                const files = Utils.safeQuerySelectorAll(CONFIG.SELECTORS.FILE_ICONS);
                if (files.length === 0 || location.pathname.indexOf('/tags') > -1) return;

                if (Utils.safeQuerySelectorAll(`.${CONFIG.CSS_CLASSES.FILE_DOWNLOAD_LINK}`).length > 0) return;

                const mouseOverHandler = (evt) => {
                    const elem = evt.currentTarget;
                    const downloadLinks = Utils.safeQuerySelectorAll(`.${CONFIG.CSS_CLASSES.FILE_DOWNLOAD_LINK}`, elem);
                    const fileIcons = Utils.safeQuerySelectorAll('svg.octicon.octicon-file, svg.color-fg-muted', elem);

                    downloadLinks.forEach(el => el.style.display = 'inline');
                    fileIcons.forEach(el => el.style.display = 'none');
                };

                const mouseOutHandler = (evt) => {
                    const elem = evt.currentTarget;
                    const downloadLinks = Utils.safeQuerySelectorAll(`.${CONFIG.CSS_CLASSES.FILE_DOWNLOAD_LINK}`, elem);
                    const fileIcons = Utils.safeQuerySelectorAll('svg.octicon.octicon-file, svg.color-fg-muted', elem);

                    downloadLinks.forEach(el => el.style.display = 'none');
                    fileIcons.forEach(el => el.style.display = 'inline');
                };

                files.forEach(fileIcon => {
                    const row = fileIcon.parentNode?.parentNode;
                    if (!row) return;

                    const linkElement = Utils.safeQuerySelector('[role="rowheader"] > .css-truncate.css-truncate-target.d-block.width-fit > a, .react-directory-truncate>a', row);
                    if (!linkElement) return;

                    const fileName = linkElement.innerText;
                    const href = linkElement.getAttribute('href');
                    if (!href) return;

                    const href2 = href.replace('/blob/', '/');
                    const currentSource = DOWNLOAD_SOURCES.raw[this.rawFastIndex];
                    const url = currentSource[0] + href2;

                    const svgIcon = '<svg class="octicon octicon-cloud-download" aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M9 12h2l-3 3-3-3h2V7h2v5zm3-8c0-.44-.91-3-4.5-3C5.08 1 3 2.92 3 5 1.02 5 0 6.52 0 8c0 1.53 1 3 3 3h3V9.7H3C1.38 9.7 1.3 8.28 1.3 8c0-.17.05-1.7 1.7-1.7h1.3V5c0-1.39 1.56-2.7 3.2-2.7 2.55 0 3.13 1.55 3.2 1.8v1.2H12c.81 0 2.7.22 2.7 2.2 0 2.09-2.25 2.2-2.7 2.2h-2V11h2c2.08 0 4-1.16 4-3.5C16 5.06 14.08 4 12 4z"></path></svg>';

                    fileIcon.insertAdjacentHTML('afterend',
                        `<a href="${url}" download="${fileName}" target="_blank" rel="noreferrer noopener nofollow" class="${CONFIG.CSS_CLASSES.FILE_DOWNLOAD_LINK}" style="display: none;" title="「${currentSource[1]}」加速下载">${svgIcon}</a>`
                    );

                    row.addEventListener('mouseover', mouseOverHandler);
                    row.addEventListener('mouseout', mouseOutHandler);
                });

            } catch (error) {
                console.warn('[GitHub增强] Raw下载链接添加失败:', error);
            }
        }

        // 切换Raw加速源
        toggleRawSource() {
            try {
                if (this.rawFastIndex >= DOWNLOAD_SOURCES.raw.length - 1) {
                    this.rawFastIndex = 0;
                } else {
                    this.rawFastIndex += 1;
                }

                Storage.set(CONFIG.STORAGE_KEYS.RAW_FAST_INDEX, this.rawFastIndex);

                // 移除旧的下载链接
                Utils.safeQuerySelectorAll(`.${CONFIG.CSS_CLASSES.FILE_DOWNLOAD_LINK}`).forEach(el => el.remove());

                setTimeout(() => this.addRawDownLink(), 100);

                const currentSource = DOWNLOAD_SOURCES.raw[this.rawFastIndex];
                this.showNotification(`已切换加速源为：${currentSource[1]}`);

            } catch (error) {
                console.warn('[GitHub增强] 切换加速源失败:', error);
            }
        }

        // 注册菜单命令
        registerMenuCommands() {
            const menuConfigs = [
                {
                    label: "所有翻译",
                    key: CONFIG.STORAGE_KEYS.ENABLE_TRANSLATION,
                    callback: (newState) => {
                        if (newState) {
                            this.traverseNode(document.body);
                        }
                    }
                },
                {
                    label: "自动跳转",
                    key: CONFIG.STORAGE_KEYS.AUTO_REDIRECT,
                    callback: (newState) => {
                        this.showNotification(`自动跳转已${newState ? '启用' : '禁用'}，刷新页面生效`);
                    }
                }
            ];

            menuConfigs.forEach(config => this.createMenuCommand(config));

            GM_registerMenuCommand("切换加速源", () => {
                this.toggleRawSource();
            });
        }

        // 创建菜单命令
        createMenuCommand({ label, key, callback }) {
            let menuId;

            const getMenuLabel = (label, isEnabled) => `${isEnabled ? "禁用" : "启用"} ${label}`;

            const toggle = () => {
                const currentState = Storage.get(key);
                const newState = !currentState;

                Storage.set(key, newState);
                this.showNotification(`${label}已${newState ? '启用' : '禁用'}`);

                if (callback) callback(newState);

                GM_unregisterMenuCommand(menuId);
                menuId = GM_registerMenuCommand(getMenuLabel(label, newState), toggle);
            };

            const currentState = Storage.get(key);
            menuId = GM_registerMenuCommand(getMenuLabel(label, currentState), toggle);
        }

        // 添加Download ZIP加速
        addDownloadZIP(target) {
            try {
                const html = Utils.safeQuerySelector('ul[class^=prc-ActionList-ActionList-]>li:last-child', target);
                if (!html) return;

                const scriptElement = Utils.safeQuerySelector('react-partial[partial-name=repos-overview]>script[data-target="react-partial.embeddedData"]');
                if (!scriptElement) return;

                const scriptContent = scriptElement.textContent;
                const zipUrlStart = scriptContent.indexOf('"zipballUrl":"');
                if (zipUrlStart === -1) return;

                const zipUrlSlice = scriptContent.slice(zipUrlStart + 14);
                const zipUrlEnd = zipUrlSlice.indexOf('"');
                if (zipUrlEnd === -1) return;

                const href = zipUrlSlice.slice(0, zipUrlEnd);
                const downloadSources = DOWNLOAD_SOURCES.release;
                let htmlContent = '';

                downloadSources.forEach(([sourceUrl, sourceName, sourceDesc]) => {
                    const clonedElement = html.cloneNode(true);
                    const linkElement = Utils.safeQuerySelector('a[href$=".zip"]', clonedElement);
                    const spanElement = Utils.safeQuerySelector('span[id]', clonedElement);

                    if (linkElement && spanElement) {
                        const url = sourceUrl + href;
                        linkElement.href = url;
                        linkElement.setAttribute('title', sourceDesc);
                        linkElement.setAttribute('target', '_blank');
                        linkElement.setAttribute('rel', 'noreferrer noopener nofollow');
                        spanElement.textContent = `Download ZIP ${sourceName}`;
                        htmlContent += clonedElement.outerHTML;
                    }
                });

                if (htmlContent) {
                    html.insertAdjacentHTML('afterend', htmlContent);
                }

            } catch (error) {
                console.warn('[GitHub增强] Download ZIP加速添加失败:', error);
            }
        }

        // 添加Git Clone加速
        addGitClone(target) {
            try {
                const html = Utils.safeQuerySelector('input[value^="https:"]:not([title])', target);
                if (!html) return;

                // 将镜像站URL替换为官方URL
                const originalUrl = html.value.replace('https://hub.mihoyo.online/', 'https://github.com/');
                const hrefSplit = originalUrl.split('https://github.com')[1];
                if (!hrefSplit) return;

                const htmlParent = `<div style="margin-top: 4px;" class="XIU2-GC ${html.parentElement.className}">`;
                let htmlContent = '';
                let gitClonePrefix = '';

                if (html.nextElementSibling) {
                    html.nextElementSibling.hidden = true;
                }

                if (html.parentElement.nextElementSibling && html.parentElement.nextElementSibling.tagName === 'SPAN') {
                    html.parentElement.nextElementSibling.textContent += ' (↑点击上面文字可复制)';
                }

                if (Storage.get(CONFIG.STORAGE_KEYS.GIT_CLONE)) {
                    gitClonePrefix = 'git clone ';
                    html.value = gitClonePrefix + html.value;
                    html.setAttribute('value', html.value);
                }

                DOWNLOAD_SOURCES.clone.forEach(([sourceUrl, sourceName, sourceDesc]) => {
                    const clonedInput = html.cloneNode(true);
                    let url;

                    if (sourceUrl === 'https://gitclone.com') {
                        url = sourceUrl + '/github.com' + hrefSplit;
                    } else {
                        url = sourceUrl + hrefSplit;
                    }

                    clonedInput.title = `${url}\n\n${sourceDesc}\n\n提示：点击文字可直接复制`;
                    clonedInput.setAttribute('value', gitClonePrefix + url);
                    htmlContent += htmlParent + clonedInput.outerHTML + '</div>';
                });

                if (htmlContent) {
                    html.parentElement.insertAdjacentHTML('afterend', htmlContent);

                    // 添加复制功能
                    if (!html.parentElement.parentElement.classList.contains('XIU2-GCP')) {
                        html.parentElement.parentElement.classList.add('XIU2-GCP');
                        html.parentElement.parentElement.addEventListener('click', (e) => {
                            if (e.target.tagName === 'INPUT') {
                                try {
                                    GM_setClipboard(e.target.value);
                                    this.showNotification('已复制到剪贴板');
                                } catch (error) {
                                    console.warn('[GitHub增强] 复制失败:', error);
                                }
                            }
                        });
                    }
                }

            } catch (error) {
                console.warn('[GitHub增强] Git Clone加速添加失败:', error);
            }
        }

        // 显示通知
        showNotification(message) {
            try {
                GM_notification({
                    text: `[GitHub增强] ${message}`,
                    timeout: 3000
                });
            } catch (error) {
                console.log(`[GitHub增强] ${message}`);
            }
        }
    }

    // ==================== 应用启动 ====================

    const app = new GitHubEnhancer();

    const startApp = async () => {
        try {
            await app.init();
        } catch (error) {
            console.error('[GitHub增强] 应用启动失败:', error);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApp);
    } else {
        startApp();
    }

    // 导出到全局作用域（用于调试）
    if (typeof window !== 'undefined') {
        window.GitHubEnhancer = app;
    }

})();