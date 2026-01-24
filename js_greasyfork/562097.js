// ==UserScript==
// @name         DeepSeek Think 自动收起
// @name:en      DeepSeek Auto Collapse Think
// @name:zh-CN   DeepSeek Think 自动收起
// @name:zh-TW   DeepSeek Think 自動收起
// @namespace    https://github.com/hza2002/deepseek-collapse-think
// @version      2.5
// @description  自动收起 DeepSeek 对话中的 Think 思考过程部分，支持切换对话自动收起，节省屏幕空间。⚠️ 注意：本脚本依赖 DeepSeek 网站的 CSS 类名，官网更新后可能失效，届时请更新脚本或手动修改选择器。
// @description:en  Automatically collapse the Think/Reasoning section in DeepSeek chat to save screen space. ⚠️ Note: This script relies on DeepSeek's CSS class names, which may change after website updates. Please update the script or manually modify selectors if it stops working.
// @description:zh-CN  自动收起 DeepSeek 对话中的 Think 思考过程部分，支持切换对话自动收起，节省屏幕空间。⚠️ 注意：本脚本依赖 DeepSeek 网站的 CSS 类名，官网更新后可能失效，届时请更新脚本或手动修改选择器。
// @description:zh-TW  自動收起 DeepSeek 對話中的 Think 思考過程部分，支援切換對話自動收起，節省螢幕空間。⚠️ 注意：本腳本依賴 DeepSeek 網站的 CSS 類名，官網更新後可能失效，届時請更新腳本或手動修改選擇器。
// @author       hza2002
// @license      MIT
// @match        https://chat.deepseek.com/*
// @icon         https://chat.deepseek.com/favicon.svg
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @supportURL   https://github.com/hza2002/deepseek-collapse-think/issues
// @homepageURL  https://github.com/hza2002/deepseek-collapse-think
// @downloadURL https://update.greasyfork.org/scripts/562097/DeepSeek%20Think%20%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/562097/DeepSeek%20Think%20%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置项 ====================
    const DEFAULT_CONFIG = {
        // 是否启用自动收起功能
        enabled: true,
        // 是否在控制台输出调试信息
        debug: false,
        // 收起延迟（毫秒），给页面渲染留出时间
        collapseDelay: 100,
        // 切换对话后的收起延迟（毫秒），需要更长时间等待内容加载
        navigationDelay: 500,
        // 用户手动操作后的冷却时间（毫秒），在此期间不自动收起
        userInteractionCooldown: 1000
    };

    // 从存储中读取配置，如果没有则使用默认值
    const CONFIG = {
        get enabled() {
            return typeof GM_getValue !== 'undefined' ? GM_getValue('enabled', DEFAULT_CONFIG.enabled) : DEFAULT_CONFIG.enabled;
        },
        set enabled(value) {
            if (typeof GM_setValue !== 'undefined') GM_setValue('enabled', value);
        },
        debug: DEFAULT_CONFIG.debug,
        collapseDelay: DEFAULT_CONFIG.collapseDelay,
        navigationDelay: DEFAULT_CONFIG.navigationDelay,
        userInteractionCooldown: DEFAULT_CONFIG.userInteractionCooldown
    };

    // ==================== 类名选择器（网站更新后可能需要修改这里）====================
    const SELECTORS = {
        // think 块的容器 class
        thinkBlockContainer: '_74c0879',
        // 收起状态的标记 class（展开时没有这个类，收起时有）
        collapsedStateClass: 'e47135bc',
        // 可点击的标题区域 class（点击这里切换展开/收起）
        toggleButton: '_5ab5d64',
        // think 内容区域 class（非混淆类名，较稳定）
        thinkContent: 'ds-think-content'
    };

    // ==================== 以下为脚本逻辑，一般无需修改 ====================

    // 注册油猴菜单命令
    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand === 'undefined') return;

        const statusText = CONFIG.enabled ? '✅ 已启用' : '❌ 已禁用';
        GM_registerMenuCommand(`${statusText} - 点击切换`, () => {
            CONFIG.enabled = !CONFIG.enabled;
            const newStatus = CONFIG.enabled ? '已启用' : '已禁用';
            alert(`DeepSeek Think 自动收起: ${newStatus}\n\n刷新页面后生效`);
            location.reload();
        });
    }

    // 记录当前 URL，用于检测对话切换
    let currentUrl = location.href;

    // 记录用户最后一次手动操作的时间
    let lastUserInteraction = 0;

    // 记录已处理过的 think 块（使用 WeakSet 避免内存泄漏）
    const processedThinkBlocks = new WeakSet();

    function log(...args) {
        if (CONFIG.debug) {
            console.log('[DeepSeek Think Collapse]', ...args);
        }
    }

    // 检查是否在用户操作冷却期内
    function isInCooldown() {
        return Date.now() - lastUserInteraction < CONFIG.userInteractionCooldown;
    }

    // 收起所有展开的 think 部分
    function collapseAllThinkBlocks(force = false) {
        // 如果功能被禁用，直接返回
        if (!CONFIG.enabled) {
            return 0;
        }

        // 如果在用户操作冷却期内，且不是强制执行，则跳过
        if (!force && isInCooldown()) {
            log('在冷却期内，跳过自动收起');
            return 0;
        }

        // 构建选择器：有容器类但没有收起状态类的元素
        const selector = `.${SELECTORS.thinkBlockContainer}:not(.${SELECTORS.collapsedStateClass})`;
        const expandedThinkBlocks = document.querySelectorAll(selector);

        let collapsedCount = 0;

        expandedThinkBlocks.forEach(block => {
            // 找到可点击的标题区域
            const toggleButton = block.querySelector(`.${SELECTORS.toggleButton}`);
            if (toggleButton) {
                toggleButton.click();
                collapsedCount++;
                // 标记为已处理
                processedThinkBlocks.add(block);
                log('已收起一个 think 块');
            }
        });

        if (collapsedCount > 0) {
            log(`共收起 ${collapsedCount} 个 think 块`);
        }

        return collapsedCount;
    }

    // 监听用户对 think 区域的点击
    function setupUserInteractionListener() {
        document.addEventListener('click', (event) => {
            // 检查点击是否发生在 think 块的标题区域
            const toggleButton = event.target.closest(`.${SELECTORS.toggleButton}`);
            if (toggleButton) {
                // 记录用户操作时间
                lastUserInteraction = Date.now();
                log('检测到用户手动操作，进入冷却期');
            }
        }, true); // 使用捕获阶段，确保先于其他处理

        log('用户交互监听器已启动');
    }

    // 监听 URL 变化（SPA 路由切换）
    function setupUrlChangeListener() {
        // 保存原始的 pushState 和 replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        // 包装 pushState
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            onUrlChange();
        };

        // 包装 replaceState
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            onUrlChange();
        };

        // 监听浏览器的前进/后退
        window.addEventListener('popstate', onUrlChange);

        log('URL 变化监听器已启动');
    }

    // URL 变化时的处理函数
    function onUrlChange() {
        const newUrl = location.href;

        if (newUrl !== currentUrl) {
            log(`URL 变化: ${currentUrl} -> ${newUrl}`);
            currentUrl = newUrl;

            // 检查是否是对话页面
            if (newUrl.includes('/a/chat/')) {
                // 延迟执行，等待新对话内容加载完成
                setTimeout(() => {
                    collapseAllThinkBlocks();
                    // 可能需要多次尝试，因为内容可能异步加载
                    setTimeout(collapseAllThinkBlocks, CONFIG.navigationDelay);
                    setTimeout(collapseAllThinkBlocks, CONFIG.navigationDelay * 2);
                }, CONFIG.navigationDelay);
            }
        }
    }

    // 使用 MutationObserver 监听 DOM 变化
    function setupObserver() {
        let timeoutId = null;

        const observer = new MutationObserver((mutations) => {
            // 检查是否有新的 think 块被添加
            let hasNewThinkBlock = false;

            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查新添加的节点是否是 think 块或包含 think 块
                        if (node.classList?.contains(SELECTORS.thinkBlockContainer) ||
                            node.querySelector?.(`.${SELECTORS.thinkBlockContainer}`)) {
                            hasNewThinkBlock = true;
                            break;
                        }
                        // 也检查 think 内容区域
                        if (node.classList?.contains(SELECTORS.thinkContent) ||
                            node.querySelector?.(`.${SELECTORS.thinkContent}`)) {
                            hasNewThinkBlock = true;
                            break;
                        }
                    }
                }
                if (hasNewThinkBlock) break;
            }

            if (hasNewThinkBlock) {
                // 使用防抖，避免频繁触发
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(() => {
                    collapseAllThinkBlocks();
                    timeoutId = null;
                }, CONFIG.collapseDelay);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        log('MutationObserver 已启动');
    }

    // 初始化
    function init() {
        log('脚本已加载');

        // 注册油猴菜单命令
        registerMenuCommands();

        // 如果功能被禁用，只注册菜单，不执行其他操作
        if (!CONFIG.enabled) {
            log('功能已禁用');
            return;
        }

        // 设置用户交互监听器（检测手动操作）
        setupUserInteractionListener();

        // 设置 URL 变化监听器（处理对话切换）
        setupUrlChangeListener();

        // 设置 DOM 观察器（处理新增的 think 块）
        setupObserver();

        // 首次执行，收起已有的 think 块
        setTimeout(collapseAllThinkBlocks, CONFIG.navigationDelay);
    }

    // 等待页面加载完成
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
