// ==UserScript==
// @name         网页自动展开（迭代增强版）
// @version      2.2.0
// @description  智能展开折叠内容；策略分级、SPA支持、防冲突、防误杀、高性能
// @namespace    KiwiFruit
// @match        *://*/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552576/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%EF%BC%88%E8%BF%AD%E4%BB%A3%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552576/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%EF%BC%88%E8%BF%AD%E4%BB%A3%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 命名空间隔离
    const AE_PREFIX = 'ae_';
    const AE_DATA_PREFIX = 'data-ae-';

    // 样式注入
    GM_addStyle(`
        .ae-hidden {
            display: none !important;
        }

        .ae-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            border-radius: 8px;
            padding: 12px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
            min-width: 220px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            user-select: none;
        }

        .ae-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin: 3px;
            font-size: 12px;
            transition: background 0.2s;
        }

        .ae-btn:hover {
            background: #45a049;
        }

        .ae-btn-danger {
            background: #f44336;
        }

        .ae-btn-danger:hover {
            background: #d32f2f;
        }

        .ae-status {
            margin: 5px 0;
            font-size: 11px;
            opacity: 0.8;
            word-break: break-all;
        }

        .ae-select {
            padding: 4px;
            border-radius: 4px;
            border: 1px solid #ccc;
            width: 100%;
            box-sizing: border-box;
        }
    `);

    // 配置管理
    const Config = {
        values: {
            enabled: true,
            strategyLevel: 'standard', // conservative, standard, aggressive
            maxMutationsBeforeDisconnect: 200, // 参考expand-everything，达到此数量后断开Observer
            maxRetries: 3,
            excludeHosts: [],
            siteOverrides: {}, // 站点独立设置 { 'example.com': { strategy: 'conservative' } }
            expandSelectors: [
                '[class*="expand"]',
                '[class*="more"]',
                '[class*="show"]',
                '.read-more',
                '.expand',
                '.more-content',
                '.show-more',
                '[aria-expanded="false"]',
                'details:not([open])',
                '.collapsed',
                '.hidden-content',
                '.fold'
            ],
            excludeSelectors: [
                '[class*="modal"]',
                '[class*="dialog"]',
                '[role="dialog"]',
                '[aria-modal="true"]',
                '.advertisement',
                '.ads',
                '.popup'
            ]
        },

        init() {
            this.values.enabled = this.get('enabled', true);
            this.values.strategyLevel = this.get('strategyLevel', 'standard');
            this.values.maxMutationsBeforeDisconnect = this.get('maxMutationsBeforeDisconnect', 200);
            this.values.maxRetries = this.get('maxRetries', 3);
            this.values.excludeHosts = this.get('excludeHosts', []);
            this.values.siteOverrides = this.get('siteOverrides', {});
            this.values.expandSelectors = this.get('expandSelectors', this.values.expandSelectors);
            this.values.excludeSelectors = this.get('excludeSelectors', this.values.excludeSelectors);
        },

        get(key, defaultValue) {
            const value = GM_getValue(`${AE_PREFIX}${key}`);
            return value !== undefined ? value : defaultValue;
        },

        set(key, value) {
            GM_setValue(`${AE_PREFIX}${key}`, value);
            this.values[key] = value;
        },

        getSiteStrategy(hostname) {
            // 检查是否有站点覆盖
            if (this.values.siteOverrides[hostname] && this.values.siteOverrides[hostname].strategy) {
                return this.values.siteOverrides[hostname].strategy;
            }
            return this.values.strategyLevel;
        },

        isExcludedHost() {
            const hostname = window.location.hostname;
            return this.values.excludeHosts.some((excludedHost) => hostname.includes(excludedHost));
        }
    };

    // 状态管理
    const State = {
        expandedElements: new WeakSet(),
        clickedElements: new WeakSet(),
        processedElements: new WeakSet(),
        observers: [],
        isActive: true,
        retryCount: 0,
        mutationCount: 0, // 新增：Mutation计数器
        lastUrl: location.href, // 新增：用于检测SPA跳转
        stats: {
            totalExpanded: 0,
            lastExpanded: 0
        },

        reset() {
            this.expandedElements = new WeakSet();
            this.clickedElements = new WeakSet();
            this.processedElements = new WeakSet();
            this.retryCount = 0;
            this.mutationCount = 0;
            this.stats.totalExpanded = 0;
            this.stats.lastExpanded = 0;
        }
    };

    // 工具函数
    const Utils = {
        debounce(func, wait) {
            let timeout = null;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle(func, limit) {
            let inThrottle = false;
            return function executedFunction(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => {
                        inThrottle = false;
                    }, limit);
                }
            };
        },

        safeQuerySelectorAll(selector, root = document) {
            try {
                return Array.from(root.querySelectorAll(selector));
            } catch (error) {
                console.warn(`无效的选择器 "${selector}":`, error);
                return [];
            }
        },

        isElementVisible(element) {
            if (!element || !(element instanceof Element)) {
                return false;
            }

            const rect = element.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                return false;
            }

            const style = window.getComputedStyle(element);
            return style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   style.opacity !== '0' &&
                   !element.classList.contains('ae-hidden');
        },

        isElementInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top < window.innerHeight &&
                rect.left < window.innerWidth &&
                rect.bottom > 0 &&
                rect.right > 0
            );
        },

        shouldExcludeElement(element) {
            if (!element) {
                return true;
            }

            // 检查元素是否在排除选择器中
            for (const selector of Config.values.excludeSelectors) {
                if (element.matches(selector) || element.closest(selector)) {
                    return true;
                }
            }

            // 检查自定义属性
            if (element.hasAttribute(`${AE_DATA_PREFIX}exclude`)) {
                return true;
            }

            return false;
        }
    };

    // 核心逻辑
    const Core = {
        mainObserver: null, // 保存主Observer引用以便断开

        init() {
            // 初始化配置
            Config.init();

            // 检查是否被排除的域名
            if (Config.isExcludedHost()) {
                console.log('当前域名在排除列表中，脚本已禁用');
                return;
            }

            // 检测冲突
            if (this.detectConflicts()) {
                console.warn('检测到可能的冲突，脚本已禁用');
                return;
            }

            // 初始化观察者
            this.initObservers();

            // 初始扫描
            this.initialScan();

            // 添加控制面板
            UI.createControlPanel();

            console.log('自动展开脚本已启用');
        },

        detectConflicts() {
            const conflictSelectors = [
                '[data-auto-expand]',
                '[data-expand-script]',
                '.auto-expand-active'
            ];

            for (const selector of conflictSelectors) {
                if (document.querySelector(selector)) {
                    console.warn(`检测到冲突元素: ${selector}`);
                    return true;
                }
            }

            if (window.autoExpandScript || window.AE_AutoExpand) {
                console.warn('检测到冲突的全局变量');
                return true;
            }

            return false;
        },

        initObservers() {
            // 1. 主DOM变化观察器 (增加断开机制)
            if (this.mainObserver) {
                this.mainObserver.disconnect();
            }

            this.mainObserver = new MutationObserver(Utils.throttle((mutations) => {
                if (!State.isActive) return;

                State.mutationCount += mutations.length;

                // 借鉴expand-everything：达到阈值后断开，避免长期拖慢页面
                if (State.mutationCount > Config.values.maxMutationsBeforeDisconnect) {
                    this.disconnectObserver();
                    return;
                }

                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                this.scanElement(node);
                            }
                        });
                    }
                }
            }, 500));

            this.mainObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            State.observers.push(this.mainObserver);

            // 2. SPA路由变化监听 (监听document.title变化是检测SPA跳转的轻量方案)
            const titleObserver = new MutationObserver(() => {
                if (location.href !== State.lastUrl) {
                    this.handleUrlChange();
                }
            });

            titleObserver.observe(document.querySelector('title'), { subtree: true, characterData: true, childList: true });

            // 同时也监听popstate
            window.addEventListener('popstate', () => this.handleUrlChange());
            // 拦截pushState和replaceState (可选，较为hack，这里主要依靠title变化)

            // 3. 滚动时扫描可视区域
            const scrollHandler = Utils.throttle(() => {
                if (State.isActive) {
                    this.scanVisibleArea();
                }
            }, 200);

            window.addEventListener('scroll', scrollHandler, { passive: true });
        },

        disconnectObserver() {
            if (this.mainObserver) {
                this.mainObserver.disconnect();
                console.log(`Observer disconnected after ${State.mutationCount} mutations.`);
            }
        },

        reconnectObserver() {
            if (!this.mainObserver) return;
            try {
                this.mainObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                console.log('Observer reconnected.');
            } catch (e) {
                // ignore
            }
        },

        handleUrlChange() {
            const currentUrl = location.href;
            if (currentUrl === State.lastUrl) return;

            console.log(`URL changed from ${State.lastUrl} to ${currentUrl}`);
            State.lastUrl = currentUrl;

            // SPA跳转后重置状态并重新激活
            State.mutationCount = 0;
            this.reconnectObserver();

            // 延迟一点等待新DOM渲染
            setTimeout(() => {
                this.reset(); // 清空处理记录
                this.scanElement(document.body);
            }, 500);
        },

        initialScan() {
            this.scanElement(document.body);

            setTimeout(() => {
                this.scanElement(document.body);
            }, 1000);

            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.scanElement(document.body);
                }, 500);
            });
        },

        scanElement(rootElement) {
            if (!State.isActive || !rootElement || !(rootElement instanceof Element)) {
                return;
            }

            if (Utils.shouldExcludeElement(rootElement)) {
                return;
            }

            const elementsToExpand = [];
            const currentHostname = window.location.hostname;
            const currentStrategy = Config.getSiteStrategy(currentHostname);

            for (const selector of Config.values.expandSelectors) {
                try {
                    const elements = Utils.safeQuerySelectorAll(selector, rootElement);
                    elements.forEach((element) => {
                        if (!State.processedElements.has(element) &&
                            !Utils.shouldExcludeElement(element) &&
                            Utils.isElementVisible(element)) {
                            elementsToExpand.push(element);
                            State.processedElements.add(element);
                        }
                    });
                } catch (error) {
                    console.warn(`选择器 ${selector} 执行失败:`, error);
                }
            }

            elementsToExpand.forEach((element) => {
                this.expandElement(element, currentStrategy);
            });
        },

        scanVisibleArea() {
            if (!State.isActive) return;

            const viewportElements = [];
            const currentHostname = window.location.hostname;
            const currentStrategy = Config.getSiteStrategy(currentHostname);

            for (const selector of Config.values.expandSelectors) {
                try {
                    const elements = Utils.safeQuerySelectorAll(selector);
                    elements.forEach((element) => {
                        if (Utils.isElementVisible(element) &&
                            Utils.isElementInViewport(element) &&
                            !State.expandedElements.has(element) &&
                            !State.processedElements.has(element)) {
                            viewportElements.push(element);
                            State.processedElements.add(element);
                        }
                    });
                } catch (error) {
                    console.warn(`可视区域扫描失败:`, error);
                }
            }

            viewportElements.forEach((element) => {
                this.expandElement(element, currentStrategy);
            });
        },

        expandElement(element, strategy) {
            if (!element || State.expandedElements.has(element)) {
                return false;
            }

            if (Utils.shouldExcludeElement(element)) {
                return false;
            }

            let expanded = false;

            // 策略分级逻辑
            // 保守: 仅点击按钮和展开details
            // 标准: 点击 + details + 移除隐藏类
            // 激进: 上述所有 + 强制修改样式 + 更多文本匹配

            // 方法1: 尝试点击展开按钮 (所有策略均尝试)
            expanded = this.clickExpandButtons(element, strategy);

            // 方法2: 尝试展开details元素 (所有策略均尝试)
            if (!expanded && element.tagName.toLowerCase() === 'details') {
                expanded = this.expandDetailsElement(element);
            }

            // 方法3: 尝试移除隐藏类/属性 (保守模式不执行)
            if (!expanded && strategy !== 'conservative') {
                expanded = this.removeHiddenAttributes(element, strategy);
            }

            // 方法4: 尝试修改显示样式 (仅激进模式执行)
            if (!expanded && strategy === 'aggressive') {
                expanded = this.modifyDisplayStyle(element);
            }

            if (expanded) {
                State.expandedElements.add(element);
                State.stats.totalExpanded += 1;
                State.stats.lastExpanded = Date.now();

                element.setAttribute(`${AE_DATA_PREFIX}expanded`, 'true');
                this.dispatchExpandedEvent(element);
                // console.log('已展开元素:', element);
            }

            return expanded;
        },

        clickExpandButtons(element, strategy) {
            const buttonSelectors = [
                'button',
                '[role="button"]',
                'a',
                '.btn',
                '.button',
                '[onclick]'
            ];

            let clicked = false;

            // 检查元素本身
            for (const selector of buttonSelectors) {
                if (element.matches(selector)) {
                    const text = element.textContent.toLowerCase();
                    if (this.isExpandButtonText(text, strategy) && !State.clickedElements.has(element)) {
                        clicked = this.safeClick(element);
                        if (clicked) return true;
                    }
                }
            }

            // 检查子元素
            for (const selector of buttonSelectors) {
                const buttons = Utils.safeQuerySelectorAll(selector, element);
                for (const button of buttons) {
                    if (State.clickedElements.has(button)) continue;

                    const text = button.textContent.toLowerCase();
                    if (this.isExpandButtonText(text, strategy)) {
                        clicked = this.safeClick(button);
                        if (clicked) return true;
                    }
                }
            }

            return false;
        },

        isExpandButtonText(text, strategy) {
            let keywords = [
                '展开', '显示更多', '查看更多', '阅读更多', '全文', '下一页',
                'expand', 'show more', 'read more', 'view more',
                '»', '›', '▶', '▸'
            ];

            // 激进模式下增加更多模糊匹配符号
            if (strategy === 'aggressive') {
                keywords.push('+', 'more', '...', 'v');
            }

            const cleanText = text.replace(/\s+/g, '');
            return keywords.some((keyword) =>
                text.includes(keyword) || cleanText.includes(keyword)
            );
        },

        safeClick(element) {
            try {
                if (!element || element.disabled || element.style.pointerEvents === 'none') {
                    return false;
                }

                element.click();
                State.clickedElements.add(element);

                // 视觉反馈 (仅当元素可见时)
                if (element.offsetParent !== null) {
                    const originalBackground = element.style.backgroundColor;
                    element.style.backgroundColor = '#e8f5e8';
                    setTimeout(() => {
                        element.style.backgroundColor = originalBackground;
                    }, 300);
                }

                return true;
            } catch (error) {
                console.warn('点击元素失败:', error);
                return false;
            }
        },

        expandDetailsElement(details) {
            try {
                if (details.open) return false;
                details.open = true;
                return true;
            } catch (error) {
                console.warn('展开details元素失败:', error);
                return false;
            }
        },

        removeHiddenAttributes(element, strategy) {
            let modified = false;

            const hiddenClasses = [
                'hidden', 'collapse', 'collapsed', 'hide'
            ];

            // 激进模式下增加更多类名
            if (strategy === 'aggressive') {
                hiddenClasses.push('fold', 'folded', 'truncate', 'ellipsis', 'line-clamp');
            }

            hiddenClasses.forEach((className) => {
                if (element.classList.contains(className)) {
                    element.classList.remove(className);
                    modified = true;
                }
            });

            if (element.style.display === 'none' ||
                element.style.visibility === 'hidden' ||
                (strategy === 'aggressive' && element.style.opacity === '0')) {
                element.style.display = '';
                element.style.visibility = '';
                if (strategy === 'aggressive') {
                    element.style.opacity = '';
                }
                modified = true;
            }

            if (strategy === 'aggressive' && element.getAttribute('aria-hidden') === 'true') {
                element.setAttribute('aria-hidden', 'false');
                modified = true;
            }

            return modified;
        },

        modifyDisplayStyle(element) {
            const style = window.getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden') {
                try {
                    element.style.setProperty('display', 'block', 'important');
                    element.style.setProperty('visibility', 'visible', 'important');
                    return true;
                } catch (error) {
                    return false;
                }
            }
            return false;
        },

        dispatchExpandedEvent(element) {
            try {
                const event = new CustomEvent('ae-element-expanded', {
                    detail: { element },
                    bubbles: true,
                    cancelable: true
                });
                element.dispatchEvent(event);
            } catch (error) {
                // 忽略事件派发错误
            }
        },

        pause() {
            State.isActive = false;
            console.log('自动展开已暂停');
        },

        resume() {
            State.isActive = true;
            console.log('自动展开已恢复');
        },

        reset() {
            State.reset();
            this.scanElement(document.body);
        }
    };

    // 用户界面
    const UI = {
        createControlPanel() {
            const existingPanel = document.getElementById('ae-control-panel');
            if (existingPanel) {
                existingPanel.remove();
            }

            const panel = document.createElement('div');
            panel.id = 'ae-control-panel';
            panel.className = 'ae-panel';

            const currentHostname = window.location.hostname;
            const currentStrategy = Config.getSiteStrategy(currentHostname);

            panel.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px;">自动展开控制</div>
                <div class="ae-status" id="ae-status">状态: 运行中</div>
                <div class="ae-status">策略: <span id="ae-strategy-display">${currentStrategy}</span></div>
                <div class="ae-status">已展开: <span id="ae-count">0</span></div>
                <div style="margin-top: 10px;">
                    <button class="ae-btn" id="ae-toggle">暂停脚本</button>
                    <button class="ae-btn" id="ae-rescan">重新扫描</button>
                    <button class="ae-btn" id="ae-config">配置</button>
                </div>
            `;

            document.body.appendChild(panel);

            panel.querySelector('#ae-toggle').addEventListener('click', () => {
                this.toggleScript();
            });

            panel.querySelector('#ae-rescan').addEventListener('click', () => {
                Core.reset();
                UI.showNotification('已重新扫描页面');
            });

            panel.querySelector('#ae-config').addEventListener('click', () => {
                this.showConfigDialog();
            });

            this.makeDraggable(panel);

            this.updateStats();

            setInterval(() => {
                this.updateStats();
            }, 2000);
        },

        makeDraggable(element) {
            let isDragging = false;
            let offset = { x: 0, y: 0 };

            const startDrag = (e) => {
                isDragging = true;
                offset = {
                    x: element.offsetLeft - e.clientX,
                    y: element.offsetTop - e.clientY
                };
                element.style.cursor = 'grabbing';
            };

            const stopDrag = () => {
                isDragging = false;
                element.style.cursor = 'grab';
            };

            const doDrag = (e) => {
                if (isDragging) {
                    element.style.left = `${e.clientX + offset.x}px`;
                    element.style.top = `${e.clientY + offset.y}px`;
                }
            };

            element.style.cursor = 'grab';
            element.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        },

        updateStats() {
            const statusElement = document.getElementById('ae-status');
            const countElement = document.getElementById('ae-count');
            const toggleButton = document.getElementById('ae-toggle');
            const strategyDisplay = document.getElementById('ae-strategy-display');

            if (statusElement && countElement && toggleButton) {
                statusElement.textContent = `状态: ${State.isActive ? '运行中' : '已暂停'}`;
                countElement.textContent = State.stats.totalExpanded;
                toggleButton.textContent = State.isActive ? '暂停脚本' : '恢复脚本';
                toggleButton.className = State.isActive ? 'ae-btn ae-btn-danger' : 'ae-btn';

                if (strategyDisplay) {
                    const hostname = window.location.hostname;
                    strategyDisplay.textContent = Config.getSiteStrategy(hostname);
                }
            }
        },

        toggleScript() {
            if (State.isActive) {
                Core.pause();
            } else {
                Core.resume();
            }
            this.updateStats();
        },

        showConfigDialog() {
            const dialog = document.createElement('div');
            dialog.id = 'ae-config-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                color: #333;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10001;
                min-width: 400px;
                max-width: 90vw;
                max-height: 80vh;
                overflow-y: auto;
            `;

            const currentHostname = window.location.hostname;
            const currentSiteConfig = Config.values.siteOverrides[currentHostname] || {};

            dialog.innerHTML = `
                <h3 style="margin-top: 0;">自动展开配置</h3>

                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="ae-config-enabled" ${Config.values.enabled ? 'checked' : ''}>
                        启用自动展开
                    </label>
                </div>

                <div style="margin-bottom: 15px;">
                    <label>全局策略等级:</label>
                    <select id="ae-config-strategy" class="ae-select" style="margin-top:5px;">
                        <option value="conservative" ${Config.values.strategyLevel === 'conservative' ? 'selected' : ''}>保守 (仅点击按钮)</option>
                        <option value="standard" ${Config.values.strategyLevel === 'standard' ? 'selected' : ''}>标准 (点击 + 移除隐藏类)</option>
                        <option value="aggressive" ${Config.values.strategyLevel === 'aggressive' ? 'selected' : ''}>激进 (强力展开)</option>
                    </select>
                </div>

                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">

                <div style="margin-bottom: 15px;">
                    <label style="font-weight:bold; color:#4CAF50;">当前站点设置 (${currentHostname})</label>
                    <div style="margin-top:5px;">
                        <label style="display:block; margin-bottom:5px;">
                            <input type="radio" name="ae-site-strategy" value="inherit" ${!currentSiteConfig.strategy ? 'checked' : ''}> 继承全局策略
                        </label>
                        <label style="display:block; margin-bottom:5px;">
                            <input type="radio" name="ae-site-strategy" value="conservative" ${currentSiteConfig.strategy === 'conservative' ? 'checked' : ''}> 保守
                        </label>
                         <label style="display:block; margin-bottom:5px;">
                            <input type="radio" name="ae-site-strategy" value="standard" ${currentSiteConfig.strategy === 'standard' ? 'checked' : ''}> 标准
                        </label>
                         <label style="display:block; margin-bottom:5px;">
                            <input type="radio" name="ae-site-strategy" value="aggressive" ${currentSiteConfig.strategy === 'aggressive' ? 'checked' : ''}> 激进
                        </label>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label>Observer断开阈值 (0为不限):</label>
                    <input type="number" id="ae-config-mutations" value="${Config.values.maxMutationsBeforeDisconnect}" min="0" style="width: 80px; margin-left: 10px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label>排除的域名(逗号分隔):</label>
                    <textarea id="ae-config-exclude-hosts" class="ae-select" style="height: 60px; margin-top: 5px;">${Config.values.excludeHosts.join(', ')}</textarea>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <button class="ae-btn" id="ae-config-save">保存</button>
                    <button class="ae-btn ae-btn-danger" id="ae-config-cancel">取消</button>
                </div>
            `;

            document.body.appendChild(dialog);

            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
            `;
            document.body.appendChild(overlay);

            const closeDialog = () => {
                dialog.remove();
                overlay.remove();
            };

            dialog.querySelector('#ae-config-save').addEventListener('click', () => {
                Config.set('enabled', dialog.querySelector('#ae-config-enabled').checked);

                // 保存全局策略
                const globalStrategy = dialog.querySelector('#ae-config-strategy').value;
                Config.set('strategyLevel', globalStrategy);

                // 保存断开阈值
                const mutationLimit = parseInt(dialog.querySelector('#ae-config-mutations').value, 10);
                Config.set('maxMutationsBeforeDisconnect', mutationLimit);

                // 保存站点特定策略
                const siteRadios = document.getElementsByName('ae-site-strategy');
                let siteStrategy = null;
                for (const radio of siteRadios) {
                    if (radio.checked && radio.value !== 'inherit') {
                        siteStrategy = radio.value;
                        break;
                    }
                }

                if (siteStrategy) {
                    const newOverrides = Config.values.siteOverrides;
                    newOverrides[currentHostname] = { strategy: siteStrategy };
                    Config.set('siteOverrides', newOverrides);
                } else {
                    const newOverrides = Config.values.siteOverrides;
                    delete newOverrides[currentHostname];
                    Config.set('siteOverrides', newOverrides);
                }

                const excludeHostsText = dialog.querySelector('#ae-config-exclude-hosts').value;
                const excludeHosts = excludeHostsText.split(',').map((host) => host.trim()).filter(Boolean);
                Config.set('excludeHosts', excludeHosts);

                Config.init();
                closeDialog();
                UI.showNotification('配置已保存');
                UI.updateStats(); // 更新面板上的策略显示
            });

            dialog.querySelector('#ae-config-cancel').addEventListener('click', closeDialog);
            overlay.addEventListener('click', closeDialog);
        },

        showNotification(message) {
            GM_notification({
                text: message,
                title: '自动展开',
                timeout: 3000,
                silent: true
            });
        }
    };

    // 菜单命令
    GM_registerMenuCommand('⚙️ 自动展开配置', () => {
        UI.showConfigDialog();
    });

    GM_registerMenuCommand('🔍 重新扫描页面', () => {
        Core.reset();
        UI.showNotification('已重新扫描页面');
    });

    GM_registerMenuCommand('⏸️ 暂停/恢复脚本', () => {
        UI.toggleScript();
        UI.showNotification(State.isActive ? '脚本已恢复' : '脚本已暂停');
    });

    // 初始化脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => Core.init(), 100);
        });
    } else {
        setTimeout(() => Core.init(), 100);
    }

    // 导出到全局对象（用于调试）
    window.AE_AutoExpand = {
        config: Config,
        core: Core,
        ui: UI,
        utils: Utils,
        state: State
    };
})();
