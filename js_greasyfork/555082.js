// ==UserScript==
// @name         YouTubeStudio语言选择过滤器
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  只保留中文（简体、繁体等）和英语选项，隐藏其他语言
// @author       You
// @match        https://studio.youtube.com/video/*/translations
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555082/YouTubeStudio%E8%AF%AD%E8%A8%80%E9%80%89%E6%8B%A9%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555082/YouTubeStudio%E8%AF%AD%E8%A8%80%E9%80%89%E6%8B%A9%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 需要保留的语言关键词
    const allowedLanguages = [
        '中文',
        '英语',
        '日语'
    ];

    // 检查文本是否包含允许的语言
    function isAllowedLanguage(text) {
        return allowedLanguages.some(lang => text.includes(lang));
    }

    // 过滤语言选项
    function filterLanguageOptions() {
        // 查找所有语言选项项
        const items = document.querySelectorAll('tp-yt-paper-item.selectable-item');

        items.forEach(item => {
            // 获取语言文本
            const textElement = item.querySelector('yt-formatted-string.item-text');

            if (textElement) {
                const languageText = textElement.textContent.trim();

                // 如果不是允许的语言，隐藏该选项
                if (!isAllowedLanguage(languageText)) {
                    item.style.display = 'none';
                } else {
                    item.style.display = ''; // 确保允许的语言显示
                }
            }
        });
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                filterLanguageOptions();
            }
        });
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行一次
    setTimeout(filterLanguageOptions, 1000);

    // 定期检查（以防万一）
    // setInterval(filterLanguageOptions, 2000);

    console.log('YouTube语言过滤器已启动 - 只显示中文和英语选项');
})();
