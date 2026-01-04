// ==UserScript==
// @name         Komiic漫画跳转修改器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将Komiic.com的漫画卡片跳转链接修改为manhuagui.com
// @author       You
// @match        https://komiic.com/*
// @icon         https://public.komiic.com/comics/e1918ad5624f6379ec198c716a1617ad/cover.jpg
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/554312/Komiic%E6%BC%AB%E7%94%BB%E8%B7%B3%E8%BD%AC%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554312/Komiic%E6%BC%AB%E7%94%BB%E8%B7%B3%E8%BD%AC%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从存储中获取用户设置，默认为启用状态
    let redirectEnabled = GM_getValue('redirectEnabled', true);

    // 显示当前状态的辅助函数
    function showCurrentStatus() {
        alert(`漫画跳转当前状态: ${redirectEnabled ? "已启用" : "已禁用"}`);
    }

    // 注册单一切换菜单
    GM_registerMenuCommand("切换漫画跳转状态", () => {
        redirectEnabled = !redirectEnabled;
        GM_setValue('redirectEnabled', redirectEnabled);
        showCurrentStatus();
    });


    /**
     * 修改漫画卡片的跳转链接
     */
    function modifyComicLinks() {
        // 如果未启用跳转功能，则直接返回
        if (!redirectEnabled) return;

        // 获取所有漫画卡片元素
        const comicCards = document.querySelectorAll('.ComicCard');

        comicCards.forEach(card => {
            // 查找标题元素
            const titleElement = card.querySelector('.text-subtitle-2');
            if (titleElement) {
                // 获取并清理标题文本
                const title = titleElement.textContent.trim();
                // 对标题进行URL编码
                // 将空格替换为连字符，移除特殊字符并转为小写，适配manhuagui URL格式
                const encodedTitle = title
                    .replace(/\s+/g, '-')       // 空格替换为连字符
                    .toLowerCase();             // 转为小写
                // 构建新的跳转链接
                const newHref = `https://m.manhuagui.com/s/${encodedTitle}.html`;

                // 只在链接不同时才修改，避免不必要的DOM操作
                if (card.href !== newHref) {
                    card.href = newHref;
                    // 可选：添加数据属性标记已处理的卡片
                    card.dataset.redirectModified = "true";
                }
            }
        });
    }

    // 每秒执行一次链接修改操作，处理动态加载的内容
    setInterval(modifyComicLinks, 1000);

    // 初始加载时立即执行一次
    modifyComicLinks();

    // 监听页面滚动事件，优化动态加载内容的处理
    window.addEventListener('scroll', () => {
        // 使用防抖处理，避免滚动时过于频繁执行
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(modifyComicLinks, 300);
    });
})();