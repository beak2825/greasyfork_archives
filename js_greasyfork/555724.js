// ==UserScript==
// @name         Twitter/X Emoji Fix
// @icon         https://twitter.com/favicon.ico
// @namespace    https://github.com/1zero224
// @version      1.1
// @description  Replace Twitter web's image emoji with native emoji for easier tweet content copying
// @description:zh-CN  将 Twitter 网页端的图片 emoji 替换为原生 emoji，方便复制推文内容
// @author       1zero
// @include      https://x.com/*
// @include      https://twitter.com/*
// @include      https://mobile.twitter.com/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555724/TwitterX%20Emoji%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/555724/TwitterX%20Emoji%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 从 Twitter emoji SVG URL 中提取 Unicode 码点并转换为 emoji 字符
     * @param {string} src - SVG 图片的 URL
     * @returns {string|null} - 转换后的 emoji 字符，失败返回 null
     */
    function extractEmojiFromUrl(src) {
        // 匹配类似 "/emoji/v2/svg/1f3ac.svg" 的 URL
        const match = src.match(/\/emoji\/v2\/svg\/([0-9a-f-]+)\.svg/i);
        if (!match) return null;

        const codePoints = match[1].split('-');
        let emojiChar = String.fromCodePoint(
            ...codePoints.map(cp => parseInt(cp, 16))
        );

        // 如果是单码点且不含变体选择器 (FE0F)，添加 emoji 变体选择器
        // 这确保像 ⚠ (U+26A0) 这样的字符以彩色 emoji 样式显示，而非黑白文本样式
        if (codePoints.length === 1 && !match[1].toLowerCase().includes('fe0f')) {
            emojiChar += '\uFE0F';
        }

        return emojiChar;
    }

    /**
     * 替换单个 emoji 图片元素
     * @param {HTMLImageElement} img - emoji 图片元素
     */
    function replaceEmojiImage(img) {
        // 检查是否已经处理过
        if (img.dataset.emojiReplaced) return;

        const src = img.src || img.getAttribute('src');
        if (!src) return;

        const emoji = extractEmojiFromUrl(src);
        if (!emoji) return;

        // 创建 span 元素替代 img
        const span = document.createElement('span');
        span.textContent = emoji;
        span.className = img.className;
        span.style.fontSize = 'inherit';
        span.style.lineHeight = 'inherit';
        span.style.verticalAlign = 'baseline';
        span.title = img.title || img.alt;
        span.dataset.originalEmoji = emoji;

        // 替换元素
        img.replaceWith(span);
    }

    /**
     * 扫描并替换页面中所有的 emoji 图片
     */
    function replaceAllEmojis() {
        // 查找所有 Twitter emoji 图片
        const emojiImages = document.querySelectorAll('img[src*="/emoji/v2/svg/"]');
        emojiImages.forEach(img => replaceEmojiImage(img));
    }

    /**
     * 使用 MutationObserver 监听 DOM 变化
     * Twitter 使用 SPA 架构，内容动态加载
     */
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查新增节点本身
                        if (node.tagName === 'IMG' && node.src && node.src.includes('/emoji/v2/svg/')) {
                            replaceEmojiImage(node);
                        }
                        // 检查新增节点内的 emoji 图片
                        const imgs = node.querySelectorAll ? node.querySelectorAll('img[src*="/emoji/v2/svg/"]') : [];
                        imgs.forEach(img => replaceEmojiImage(img));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    // 初始化：替换当前页面的 emoji
    console.log('[Twitter Emoji Fix] 脚本已加载，开始替换 emoji...');
    replaceAllEmojis();

    // 启动监听器
    observeDOMChanges();

    // 使用防抖处理滚动和其他事件
    let debounceTimer;
    function debouncedReplace() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(replaceAllEmojis, 500);
    }

    // 监听滚动事件（懒加载内容）
    window.addEventListener('scroll', debouncedReplace, { passive: true });

    console.log('[Twitter Emoji Fix] 监听器已启动，自动处理新内容');
})();