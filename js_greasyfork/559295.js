// ==UserScript==
// @name         Remove Twitter's "Recommended for You" Tab.
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  移除 X/Twitter 的算法推荐标签页，强制锁定"正在关注"。包含方案自省与多语言支持。
// @author       Gemini 3 Pro
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.ico
// @license MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559295/Remove%20Twitter%27s%20%22Recommended%20for%20You%22%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/559295/Remove%20Twitter%27s%20%22Recommended%20for%20You%22%20Tab.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 添加样式标签
    const style = document.createElement('style');
    // 默认隐藏所有 Tab 容器的第一个子元素 (通常是"为你推荐")
    // 注意：这是一种激进策略，假设"为你推荐"永远在第一个
    style.innerHTML = `
      div[role="tablist"] > div[role="presentation"]:first-child {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

     /**
     * 配置中心：定义多语言支持与轮询参数
     * 这是"方案自省"的基础，脚本需知道它在寻找什么。
     */
    const CONFIG = {
        // "正在关注"的关键词库 - 用于识别安全港湾
        safeKeywords:['跟隨中','跟随中','关注'],
        // "为你推荐"的关键词库 - 用于识别打击目标
        targetKeywords:['為你推薦','为你推荐','For you'],
        // 轮询间隔 (ms) - 平衡性能与响应速度
        interval: 500,
        // 是否开启调试日志
        debug: true
    };

    /**
     * 日志工具：用于输出自省信息
     */
    const Logger = {
        log: (msg) => CONFIG.debug && console.log(`[X-Cleaner] ℹ️ ${msg}`),
        warn: (msg) => CONFIG.debug && console.warn(`[X-Cleaner] ⚠️ ${msg}`),
        error: (msg) => CONFIG.debug && console.error(`[X-Cleaner] ❌ ${msg}`)
    };

    /**
     * 核心功能：DOM 扫描与决策引擎
     */
    function performCleanup() {
        // 1. 环境自省：检查当前路由
        // 只有在主页 (/home) 才有这两个 Tab。
        const path = window.location.pathname;
        if (path!== '/home' && path!== '/') {
            // Logger.log("非主页环境，脚本休眠。");
            return;
        }

        // 2. 锚点定位：寻找标签栏容器
        // 优先使用 role="tablist"，备选 data-testid="ScrollSnap-List"
        const tabList = document.querySelector('[role="tablist"]');
        if (!tabList) return; // DOM 尚未加载完毕

        // 3. 元素提取：获取所有标签
        const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
        if (tabs.length < 2) return; // 标签数量不足，无需处理

        // 4. 语义识别：区分"为你推荐"与"正在关注"
        let safeTab = null;
        let targetTab = null;

        tabs.forEach(tab => {
            const text = tab.innerText || "";

            // 匹配安全关键词
            if (CONFIG.safeKeywords.some(k => text.includes(k))) {
                safeTab = tab;
            }
            // 匹配目标关键词
            else if (CONFIG.targetKeywords.some(k => text.includes(k))) {
                targetTab = tab;
            }
        });

        // 5. 完整性自省：确保找到了必要的元素
        if (!safeTab) {
            // 如果找不到"正在关注"按钮，说明可能语言不匹配，或者布局剧烈变化。
            // 此时应停止操作，避免误点其他按钮。
            // Logger.warn("自省失败：无法定位'正在关注'按钮，请检查语言设置。");
            return;
        }

        // 容错逻辑：如果找到了 safeTab 但没找到 targetTab，假设另一个就是 targetTab
        if (!targetTab) {
            targetTab = tabs.find(t => t!== safeTab);
        }

        // 6. 状态机执行
        const isTargetActive = targetTab.getAttribute('aria-selected') === 'true';
        const isSafeActive = safeTab.getAttribute('aria-selected') === 'true';

        // 场景 A：用户正处于"为你推荐"（危险状态）
        if (isTargetActive) {
            Logger.log("检测到处于'为你推荐'视图，正在执行紧急切换...");
            safeTab.click();
            // 点击后不立即隐藏，等待下一次轮询确认状态切换成功，防止 UI 闪烁或逻辑死锁
        }
        // 场景 B：用户正处于"正在关注"（安全状态）
        else if (isSafeActive) {
            // 检查目标是否已经被隐藏
            if (targetTab.style.display!== 'none') {
                Logger.log("确认处于'正在关注'视图，执行移除操作。");

                // 显式隐藏目标 Tab
                targetTab.style.display = 'none';

                // 深度清理：隐藏其父级容器（如果是 flex 布局，可能需要隐藏父级以去除空白）
                // 在 React Native Web 中，a 标签外层通常包裹着 div[role="presentation"]
                const parent = targetTab.closest('[role="presentation"]');
                if (parent) {
                    parent.style.display = 'none';
                }
            }
        }
    }

    // 启动引擎：使用 setInterval 而非 MutationObserver
    // 原因：X 的 DOM 变动极其频繁（时间流滚动），MutationObserver 开销过大且逻辑复杂。
    // 500ms 的轮询对性能影响微乎其微，且能稳定捕获 React 的渲染周期。
    Logger.log("脚本已加载，开始监控 DOM...");
    setInterval(performCleanup, CONFIG.interval);

})();