// ==UserScript==
// @name         Pixiv 强制替换为原图 (Original Image Replacer)
// @name:zh-CN   Pixiv 强制替换为原图
// @namespace    https://example.com/pixiv-original-user-script/
// @version      1.0
// @description  强制将 Pixiv 作品页的预览图替换为原图地址，方便直接查看和下载 4K/8K 高清大图。
// @description:zh-CN 强制替换 Pixiv 图片为高画质原图，支持自动监听加载。
// @author       Assistant
// @match        https://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @match        https://www.pixiv.net/member_illust.php?illust_id=*&mode=medium
// @match        https://www.pixiv.net/artworks/*
// @grant        none
// @compatible   firefox >=52
// @compatible   chrome >=55
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557880/Pixiv%20%E5%BC%BA%E5%88%B6%E6%9B%BF%E6%8D%A2%E4%B8%BA%E5%8E%9F%E5%9B%BE%20%28Original%20Image%20Replacer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557880/Pixiv%20%E5%BC%BA%E5%88%B6%E6%9B%BF%E6%8D%A2%E4%B8%BA%E5%8E%9F%E5%9B%BE%20%28Original%20Image%20Replacer%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 简单的元素选择器封装
     * @param {string} selector - CSS选择器
     * @returns {Element|null}
     */
    const $ = (selector) => document.querySelector(selector);

    /**
     * 获取元素列表并转换为数组
     * @param {string} selector - CSS选择器
     * @returns {Element[]}
     */
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    /**
     * 监听 DOM 变化（用于处理动态加载的图片，如点击展开更多）
     * @param {Function} callback - DOM变化时执行的回调函数
     */
    function onDomChange(callback) {
        new MutationObserver(() => {
            // 使用 setTimeout 防抖，避免频繁触发
            setTimeout(callback, 50);
        }).observe(document.body, { childList: true, subtree: true });
    }

    /**
     * 核心替换逻辑：将预览图替换为原图
     */
    function replaceImage() {
        // 选择包含图片的链接容器
        const imageLinks = $$('div[role="presentation"] a, .sc-bqWZRJ a, .img-container a');

        imageLinks.forEach(a => {
            const img = a.querySelector('img');
            if (!img) return;

            // 强制将图片源替换为链接地址（通常指向原图），并清空响应式集合
            img.src = a.href;
            img.srcset = "";
        });
    }

    // 初始化执行
    replaceImage();
    // 监听动态变化
    onDomChange(replaceImage);

    console.log('[Pixiv 原图脚本] 已加载并执行替换。');

})();