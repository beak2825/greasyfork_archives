// ==UserScript==
// @name         搜索引擎跳转助手
// @namespace    https://greasyfork.org/users/1546436-zasternight
// @version      2.0
// @description  智能识别搜索结果页 | 自动适配暗黑模式 | 完美防误触 | 支持Google/百度/Bing | 性能优化版
// @author       zasternight (optimized)
// @match        *://*.google.com/*
// @match        *://*.google.com.hk/*
// @match        *://*.google.co.jp/*
// @match        *://*.google.co.uk/*
// @match        *://*.google.de/*
// @match        *://*.google.fr/*
// @match        *://*.baidu.com/*
// @match        *://*.bing.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/558462/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558462/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置项 ====================
    const CONFIG = {
        barId: 'sej-bar-optimized-v2',
        styleId: 'sej-style-v2',
        storageKey: 'sej_bar_hidden',
        debounceDelay: 350,
        maxRetries: 10,
        retryInterval: 500,
        engines: [
            {
                name: "Google",
                url: "https://www.google.com/search?q=",
                icon: "https://www.google.com/favicon.ico",
                fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E"
            },
            {
                name: "百度",
                url: "https://www.baidu.com/s?wd=",
                icon: "https://www.baidu.com/favicon.ico",
                fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%232932E1'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-size='10' font-weight='bold'%3E百%3C/text%3E%3C/svg%3E"
            },
            {
                name: "Bing",
                // 根据用户当前位置智能选择
                url: null, // 动态生成
                icon: "https://www.bing.com/favicon.ico",
                fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23008373' d='M5 3v16.5l4 2.5v-6l6 3.5-4-2.5V7l-6-4z'/%3E%3C/svg%3E"
            }
        ]
    };

    // ==================== 工具函数 ====================
    const Utils = {
        /**
         * 防抖函数
         */
        debounce(fn, delay) {
            let timer = null;
            return function (...args) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        },

        /**
         * 安全获取存储值
         */
        getStorage(key, defaultValue) {
            try {
                if (typeof GM_getValue === 'function') {
                    return GM_getValue(key, defaultValue);
                }
                const val = localStorage.getItem(key);
                return val !== null ? JSON.parse(val) : defaultValue;
            } catch {
                return defaultValue;
            }
        },

        /**
         * 安全设置存储值
         */
        setStorage(key, value) {
            try {
                if (typeof GM_setValue === 'function') {
                    GM_setValue(key, value);
                } else {
                    localStorage.setItem(key, JSON.stringify(value));
                }
            } catch (e) {
                console.warn('SearchJumper: Storage failed', e);
            }
        },

        /**
         * 获取搜索关键词（优化版）
         */
        getKeyword() {
            try {
                // 方案1: 从URL参数获取
                const params = new URLSearchParams(location.search);
                const urlKey = params.get('q') || params.get('wd') || params.get('query');

                if (urlKey?.trim()) {
                    return encodeURIComponent(urlKey.trim());
                }

                // 方案2: 从输入框获取
                const selectors = [
                    'input[name="q"]',
                    'input[name="wd"]',
                    'input#kw',
                    'input#sb_form_q',
                    'textarea[name="q"]',
                    'input[type="search"]'
                ];

                for (const selector of selectors) {
                    const input = document.querySelector(selector);
                    if (input?.value?.trim()) {
                        return encodeURIComponent(input.value.trim());
                    }
                }

                return '';
            } catch (e) {
                console.warn('SearchJumper: getKeyword failed', e);
                return '';
            }
        },

        /**
         * 判断是否为真正的搜索结果页（增强版）
         */
        isRealSearchPage() {
            const { href: url, pathname: path, hostname: host } = location;

            try {
                // ===== Google =====
                if (host.includes('google')) {
                    // 排除非搜索页面
                    const excludePatterns = [
                        '/sorry/', '/accounts/', '/preferences',
                        '/advanced_search', '/setprefs', '/webhp'
                    ];
                    if (excludePatterns.some(p => url.includes(p))) return false;
                    if (path === '/' && !location.search.includes('q=')) return false;

                    // 检查验证码
                    if (document.querySelector('#captcha-form, #recaptcha, .g-recaptcha')) {
                        return false;
                    }

                    // 必须有搜索结果容器
                    const resultSelectors = '#search, #res, #rso, #center_col, [data-async-context]';
                    const inputSelectors = 'input[name="q"], textarea[name="q"]';

                    return !!(
                        document.querySelector(resultSelectors) &&
                        document.querySelector(inputSelectors)?.value
                    );
                }

                // ===== 百度 =====
                if (host.includes('baidu')) {
                    if (!url.includes('/s?') && !url.includes('/baidu?')) return false;

                    return !!(
                        document.querySelector('#content_left, #container, .result') &&
                        document.querySelector('#kw, input[name="wd"]')?.value
                    );
                }

                // ===== Bing =====
                if (host.includes('bing')) {
                    if (!url.includes('/search')) return false;

                    // 排除特殊页面
                    if (url.includes('/images/') || url.includes('/videos/') ||
                        url.includes('/maps/') || url.includes('/news/')) {
                        // 这些页面也可以显示，但需要确认有结果
                    }

                    return !!(
                        document.querySelector('#b_results, #b_content, .b_algo') &&
                        document.querySelector('#sb_form_q, input[name="q"]')?.value
                    );
                }

                return false;
            } catch (e) {
                console.warn('SearchJumper: isRealSearchPage check failed', e);
                return false;
            }
        },

        /**
         * 获取Bing URL（智能选择国际版或中国版）
         */
        getBingUrl() {
            const host = location.hostname;
            // 如果用户当前在中国版Bing，跳转也用中国版
            if (host.includes('cn.bing')) {
                return 'https://cn.bing.com/search?q=';
            }
            return 'https://www.bing.com/search?q=';
        },

        /**
         * 检测当前主题模式
         */
        isDarkMode() {
            // 检查系统偏好
            if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
                return true;
            }
            // 检查页面特征
            const body = document.body;
            const html = document.documentElement;
            return (
                body?.classList.contains('dark') ||
                body?.getAttribute('data-theme') === 'dark' ||
                html?.getAttribute('data-darkmode') === 'true' ||
                html?.classList.contains('dark')
            );
        }
    };

    // ==================== 样式管理 ====================
    const StyleManager = {
        inject() {
            if (document.getElementById(CONFIG.styleId)) return;

            const style = document.createElement('style');
            style.id = CONFIG.styleId;
            style.textContent = `
                /* 主容器 */
                #${CONFIG.barId} {
                    --sej-bg: rgba(255, 255, 255, 0.92);
                    --sej-border: rgba(0, 0, 0, 0.08);
                    --sej-shadow: rgba(0, 0, 0, 0.1);
                    --sej-text: #333;
                    --sej-hover: rgba(0, 0, 0, 0.06);
                    --sej-close-hover: rgba(0, 0, 0, 0.1);

                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                    padding: 8px 16px;
                    margin: 12px auto;
                    width: fit-content;
                    max-width: 95%;
                    background: var(--sej-bg);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-radius: 50px;
                    box-shadow: 0 2px 12px var(--sej-shadow);
                    border: 1px solid var(--sej-border);
                    z-index: 99999;
                    position: relative;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    transition: opacity 0.3s ease, transform 0.3s ease;box-sizing: border-box;
                }

                #${CONFIG.barId}.sej-hidden {
                    opacity: 0;
                    transform: translateY(-20px);
                    pointer-events: none;
                }

                /* 暗黑模式 */
                @media (prefers-color-scheme: dark) {
                    #${CONFIG.barId} {
                        --sej-bg: rgba(45, 45, 50, 0.92);
                        --sej-border: rgba(255, 255, 255, 0.1);
                        --sej-shadow: rgba(0, 0, 0, 0.3);
                        --sej-text: #e8eaed;
                        --sej-hover: rgba(255, 255, 255, 0.1);
                        --sej-close-hover: rgba(255, 255, 255, 0.15);
                    }
                }

                /* 强制暗黑适配 */
                html[data-darkmode="true"] #${CONFIG.barId},
                html.dark #${CONFIG.barId},
                body.dark #${CONFIG.barId},
                body[data-theme="dark"] #${CONFIG.barId} {
                    --sej-bg: rgba(45, 45, 50, 0.92);
                    --sej-border: rgba(255, 255, 255, 0.1);
                    --sej-shadow: rgba(0, 0, 0, 0.3);
                    --sej-text: #e8eaed;
                    --sej-hover: rgba(255, 255, 255, 0.1);
                    --sej-close-hover: rgba(255, 255, 255, 0.15);
                }

                /* 链接样式 */
                #${CONFIG.barId} .sej-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    text-decoration: none;
                    padding: 6px 12px;
                    border-radius: 20px;
                    transition: background 0.2s ease, transform 0.15s ease;
                    color: var(--sej-text);
                    white-space: nowrap;
                }

                #${CONFIG.barId} .sej-link:hover {
                    background: var(--sej-hover);
                    transform: translateY(-1px);
                }

                #${CONFIG.barId} .sej-link:active {
                    transform: translateY(0);
                }

                /* 当前引擎高亮 */
                #${CONFIG.barId} .sej-link.sej-current {
                    background: var(--sej-hover);
                    font-weight: 600;
                    cursor: default;
                    pointer-events: none;
                }

                /* 图标 */
                #${CONFIG.barId} .sej-icon {
                    width: 18px;
                    height: 18px;
                    border-radius: 4px;
                    object-fit: contain;
                    flex-shrink: 0;
                }

                /* 文字 */
                #${CONFIG.barId} .sej-name {
                    font-size: 13px;
                    font-weight: 500;
                    line-height: 1;
                }

                /* 关闭按钮 */
                #${CONFIG.barId} .sej-close {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    margin-left: 4px;
                    border: none;
                    background: transparent;
                    border-radius: 50%;
                    cursor: pointer;
                    color: var(--sej-text);
                    opacity: 0.6;
                    transition: opacity 0.2s, background 0.2s;
                    font-size: 16px;
                    line-height: 1;
                    padding: 0;
                }

                #${CONFIG.barId} .sej-close:hover {
                    opacity: 1;
                    background: var(--sej-close-hover);
                }

                /* 分隔线 */
                #${CONFIG.barId} .sej-divider {
                    width: 1px;
                    height: 20px;
                    background: var(--sej-border);
                    margin: 0 4px;
                }

                /* 响应式 */
                @media (max-width: 480px) {
                    #${CONFIG.barId} {
                        padding: 6px 12px;
                        gap: 4px;
                    }
                    #${CONFIG.barId} .sej-link {
                        padding: 5px 8px;
                    }
                    #${CONFIG.barId} .sej-name {
                        font-size: 12px;
                    }
                    #${CONFIG.barId} .sej-icon {
                        width: 16px;
                        height: 16px;
                    }
                }
            `;

            document.head.appendChild(style);
        }
    };

    // ==================== 主控制类 ====================
    class SearchJumper {
        constructor() {
            this.observer = null;
            this.retryCount = 0;
            this.init();
        }

        init() {
            // 检查是否被用户隐藏
            if (Utils.getStorage(CONFIG.storageKey, false)) {
                // 用户选择隐藏，但我们可以在下次搜索时重新显示
                // 这里选择每次新搜索都显示，用户可以再次关闭
            }

            // 首次尝试渲染
            this.tryRender();

            // 设置观察器（针对SPA和动态加载）
            this.setupObserver();

            // 监听URL变化（针对History API）
            this.setupUrlChangeListener();
        }

        setupObserver() {
            const debouncedRender = Utils.debounce(() => this.tryRender(), CONFIG.debounceDelay);

            this.observer = new MutationObserver((mutations) => {
                // 优化：只在有意义的变化时触发
                const shouldCheck = mutations.some(mutation => {
                    // 忽略我们自己的元素变化
                    if (mutation.target.id === CONFIG.barId ||
                        mutation.target.id === CONFIG.styleId) {
                        return false;
                    }
                    // 检查是否有节点添加
                    return mutation.addedNodes.length > 0;
                });

                if (shouldCheck) {
                    debouncedRender();
                }
            });

            // 选择性监听，减少性能开销
            const targetNode = document.querySelector('#main, #wrapper, #content, body');
            if (targetNode) {
                this.observer.observe(targetNode, {
                    childList: true,
                    subtree: true,
                    attributes: false,
                    characterData: false
                });
            }
        }

        setupUrlChangeListener() {
            // 监听 popstate（浏览器前进后退）
            window.addEventListener('popstate', () => {
                setTimeout(() => this.tryRender(), 100);
            });

            // 拦截 pushState 和 replaceState
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            const self = this;

            history.pushState = function (...args) {
                originalPushState.apply(this, args);
                setTimeout(() => self.tryRender(), 100);
            };

            history.replaceState = function (...args) {
                originalReplaceState.apply(this, args);
                setTimeout(() => self.tryRender(), 100);
            };
        }

        tryRender() {
            // 已存在则跳过
            if (document.getElementById(CONFIG.barId)) return;

            // 检查是否为有效搜索页
            if (!Utils.isRealSearchPage()) {
                // 可能页面还没加载完，设置重试
                if (this.retryCount < CONFIG.maxRetries) {
                    this.retryCount++;
                    setTimeout(() => this.tryRender(), CONFIG.retryInterval);
                }
                return;
            }

            // 重置重试计数
            this.retryCount = 0;

            // 获取关键词
            const keyword = Utils.getKeyword();
            if (!keyword) return;

            // 注入样式
            StyleManager.inject();

            // 创建并插入元素
            const bar = this.createBar(keyword);
            this.insertBar(bar);
        }

        createBar(keyword) {
            const container = document.createElement('div');
            container.id = CONFIG.barId;

            const currentHost = location.hostname;

            CONFIG.engines.forEach((engine, index) => {
                // 添加分隔线（除了第一个）
                if (index > 0) {
                    const divider = document.createElement('span');
                    divider.className = 'sej-divider';
                    container.appendChild(divider);
                }

                const link = document.createElement('a');
                link.className = 'sej-link';

                // 动态获取Bing URL
                const engineUrl = engine.url || Utils.getBingUrl();
                link.href = engineUrl + keyword;

                // 判断是否为当前引擎
                const isCurrent = (
                    (engine.name === 'Google' && currentHost.includes('google')) ||
                    (engine.name === '百度' && currentHost.includes('baidu')) ||
                    (engine.name === 'Bing' && currentHost.includes('bing'))
                );

                if (isCurrent) {
                    link.classList.add('sej-current');link.removeAttribute('href');
                }

                // 创建图标
                const icon = document.createElement('img');
                icon.className = 'sej-icon';
                icon.src = engine.icon;
                icon.alt = engine.name;
                icon.loading = 'lazy';

                // 图标加载失败时使用备用
                icon.onerror = () => {
                    icon.src = engine.fallbackIcon;
                    icon.onerror = null; // 防止无限循环
                };

                // 创建名称
                const name = document.createElement('span');
                name.className = 'sej-name';
                name.textContent = engine.name;

                link.appendChild(icon);
                link.appendChild(name);

                // 点击事件
                if (!isCurrent) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = link.href;
                    });
                }

                container.appendChild(link);
            });

            // 添加关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.className = 'sej-close';
            closeBtn.innerHTML = '×';
            closeBtn.title = '关闭跳转条';
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.hideBar();
            });

            container.appendChild(closeBtn);

            return container;
        }

        hideBar() {
            const bar = document.getElementById(CONFIG.barId);
            if (bar) {
                bar.classList.add('sej-hidden');
                setTimeout(() => bar.remove(), 300);
            }
            // 可选：记住用户选择（当前会话）
            // Utils.setStorage(CONFIG.storageKey, true);
        }

        insertBar(bar) {
            const host = location.hostname;

            // 定义各引擎的插入目标选择器（按优先级排序）
            const insertTargets = {
                google: [
                    '#appbar',
                    '#slim_appbar',
                    '#hdtb', // 工具栏
                    '#searchform',
                    '#main > div:first-child',
                    '#main'
                ],
                baidu: [
                    '#s_tab',
                    '#u',
                    '#head',
                    '#wrapper'
                ],
                bing: [
                    '.b_scopebar',
                    '#b_header',
                    '#est_switch',
                    '#b_content'
                ]
            };

            let targets = [];
            if (host.includes('google')) targets = insertTargets.google;
            else if (host.includes('baidu')) targets = insertTargets.baidu;
            else if (host.includes('bing')) targets = insertTargets.bing;

            // 尝试找到合适的插入位置
            for (const selector of targets) {
                const target = document.querySelector(selector);
                if (target) {
                    try {
                        target.insertAdjacentElement('afterend', bar);
                        return;
                    } catch (e) {
                        continue;
                    }
                }
            }

            // 兜底方案
            try {
                const main = document.querySelector('#main, #wrapper, #b_content, body');
                if (main) {
                    main.insertAdjacentElement('afterbegin', bar);
                } else {
                    document.body.prepend(bar);
                }
            } catch (e) {
                console.warn('SearchJumper: Insert failed', e);
            }
        }

        // 销毁方法（用于清理）
        destroy() {
            if (this.observer) {
                this.observer.disconnect();
            }
            const bar = document.getElementById(CONFIG.barId);
            const style = document.getElementById(CONFIG.styleId);
            bar?.remove();
            style?.remove();
        }
    }

    // ==================== 启动 ====================
    // 确保DOM准备就绪
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new SearchJumper());
    } else {
        new SearchJumper();
    }

})();
