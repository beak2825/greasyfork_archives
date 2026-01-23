// ==UserScript==
// @name         抖音视频跳过助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  适用抖音网页版，根据关键词自动跳过视频
// @author       LarryNeil
// @match        *://*.douyin.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563572/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563572/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEYWORDS = ["三角洲", "中医",  "金庸", "公开课"];
    const processedVideos = new WeakSet();

    /**
     * 直接提取 div 下所有 span 的文本并拼接
     */
    function extractFullDescription(descEl) {
        const spans = descEl.querySelectorAll('span');
        return Array.from(spans)
            .map(span => span.textContent.trim())
            .join('');
    }

    function containsKeyword(description) {
        return KEYWORDS.some(kw => description.includes(kw));
    }

function scrollNextVideo() {
    if (window.__isAutoScrolling) return;
    window.__isAutoScrolling = true;

    console.log('[抖音脚本] 正在模拟 ↓ 方向键...');

    // 创建并派发 keydown 事件（向下箭头）
    const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        which: 40,
        bubbles: true,
        cancelable: true
    });

    // 必须派发到 document（抖音监听 document 的 keydown）
    document.dispatchEvent(event);

    // 释放锁
    setTimeout(() => {
        window.__isAutoScrolling = false;
    }, 800);
}

    function processVideoElement(descEl, label = '') {
        if (processedVideos.has(descEl)) return;
        processedVideos.add(descEl);

        const fullDesc = extractFullDescription(descEl);
        console.log(`[抖音脚本] ${label} - 视频描述:`, fullDesc);

        if (fullDesc && containsKeyword(fullDesc)) {
            console.log(`[抖音脚本] ⚠️ 检测到关键词，${label} 视频将被跳过！`);
            scrollNextVideo();
        }
    }

    function getVideoDescElements() {
        return document.querySelectorAll('div.title.cursorPointer[data-e2e="video-desc"]');
    }

    // 初始加载
    let hasHandledInitial = false;
    function handleInitialLoad() {
        const elements = getVideoDescElements();
        if (elements.length >= 2 && !hasHandledInitial) {
            processVideoElement(elements[0], '首次加载 - 第一个视频');
            hasHandledInitial = true;
        }
    }

    // 滚动监听
    window.addEventListener('wheel', () => {
        clearTimeout(window.__scrollDebounceTimer);
        window.__scrollDebounceTimer = setTimeout(() => {
            const elements = getVideoDescElements();
            if (elements.length >= 3) {
                const middleIndex = Math.floor(elements.length / 2);
                processVideoElement(elements[middleIndex], `滚动后 - 中间视频（第${middleIndex + 1}个）`);
            }
        }, 500);
    }, { passive: true });

    // 等待内容加载
    const observer = new MutationObserver(() => {
        if (!hasHandledInitial) handleInitialLoad();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(handleInitial, 1000);
})();