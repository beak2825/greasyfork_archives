// ==UserScript==
// @name         知乎记忆“评论发布到想法”状态
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  保存“同时发布到想法”状态
// @author       wzj042&Gemini
// @match        *://*.zhihu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/562549/%E7%9F%A5%E4%B9%8E%E8%AE%B0%E5%BF%86%E2%80%9C%E8%AF%84%E8%AE%BA%E5%8F%91%E5%B8%83%E5%88%B0%E6%83%B3%E6%B3%95%E2%80%9D%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/562549/%E7%9F%A5%E4%B9%8E%E8%AE%B0%E5%BF%86%E2%80%9C%E8%AF%84%E8%AE%BA%E5%8F%91%E5%B8%83%E5%88%B0%E6%83%B3%E6%B3%95%E2%80%9D%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "sync_to_thought_state";
    const COLOR_ACTIVE = "rgb(23, 114, 246)"; // #1772F6 的 RGB 形式
    const COLOR_INACTIVE = "rgb(145, 150, 161)"; // #9196a1 的 RGB 形式

    /**
     * 获取当前 UI 的选中状态
     * 判定逻辑：寻找容器内的 SVG 颜色
     */
    function getUIStatus(container) {
        const svg = container.querySelector('svg');
        if (!svg) return false;

        // 优先检查直接颜色属性，其次检查计算后的样式
        const color = svg.getAttribute('color') || window.getComputedStyle(svg).color;

        if (color.includes("246") || color.toLowerCase() === '#1772f6') return true; // 蓝色-选中
        if (color.includes("145") || color.toLowerCase() === '#9196a1') return false; // 灰色-未选中

        // Fallback: 如果颜色抓不到，尝试类名匹配（最后的手段）
        return !!container.querySelector('[class*="CheckCircleFill"], [class*="RadioButtonOn"]');
    }

    /**
     * 处理逻辑
     */
    function processSyncOption(container) {
        if (container.dataset.processed === 'true') return;

        const savedState = GM_getValue(STORAGE_KEY, false);
        const currentState = getUIStatus(container);

        // 状态同步
        if (currentState !== savedState) {
            console.log(`[知乎助手] 状态同步: ${currentState} -> ${savedState}`);
            container.click();
        }

        // 监听点击以保存状态
        container.addEventListener('click', () => {
            // 延迟获取点击后的新状态
            setTimeout(() => {
                const newState = getUIStatus(container);
                GM_setValue(STORAGE_KEY, newState);
                console.log(`[知乎助手] 状态已记录: ${newState}`);
            }, 100);
        });

        container.dataset.processed = 'true';
    }

    /**
     * 健壮的选择器：定位“同时发布到想法”的容器
     */
    function findContainer() {
        // 1. 使用 XPath 寻找包含特定文本的元素，不受 class 影响
        const xpath = "//span[contains(text(), '同时发布到想法')]";
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const textNode = result.singleNodeValue;

        if (textNode) {
            // 2. 向上寻找最近的、包含 SVG 的可点击容器
            // 通常是 div 或 span
            let container = textNode.parentElement;
            while (container && container !== document.body) {
                if (container.querySelector('svg')) {
                    processSyncOption(container);
                    break;
                }
                container = container.parentElement;
            }
        }
    }

    // --- 观察器配置 ---
    const observer = new MutationObserver((mutations) => {
        // 性能优化：只有当有新节点增加时才查找
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                findContainer();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    findContainer();
})();