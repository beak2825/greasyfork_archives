// ==UserScript==
// @name         Coomer高清原图
// @name:zh-CN   Coomer: 自动加载高清原图
// @name:zh-TW   Coomer: 自動加載高清原圖 Auto-Load High-Res Images
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically replace thumbnails with high-resolution original images on Coomer websites. Works with scroll loading.
// @description:zh-CN 自动将Coomer网站的缩略图替换为高清原图。支持滚动动态加载，无需手动点击。
// @description:zh-TW 自動將Coomer網站的縮略圖替換為高清原圖。支持滾動動態加載，無需手動點擊。
// @author       Bennieqin
// @license      MIT
// @match        *://coomer.st/*
// @match        *://coomer.su/*
// @match        *://coomer.party/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coomer.su
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560060/Coomer%E9%AB%98%E6%B8%85%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/560060/Coomer%E9%AB%98%E6%B8%85%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置：是否将图片最大宽度设置为100%，防止大图撑破页面
    const FIT_SCREEN = true;

    function replaceImages() {
        // 查找所有可能的缩略图容器
        // 常见的结构是: <div class="post__thumbnail"> <a href="full_img.jpg"> <img src="thumb.jpg"> </a> </div>
        // 或者直接在 .post__files 或 .post__body 中的链接
        const selector = 'div.post__thumbnail a, a.fileThumb, .post__attachment-link';
        const anchors = document.querySelectorAll(selector);

        anchors.forEach(anchor => {
            const img = anchor.querySelector('img');

            // 确保找到了图片，且链接指向的是图片文件（简单的后缀检查）
            if (img && anchor.href && /\.(jpg|jpeg|png|gif|webp)$/i.test(anchor.href)) {

                // 只有当当前图片src和高清链接href不一致时才替换，避免重复操作
                if (img.src !== anchor.href) {
                    // console.log('Replacing:', img.src, 'with', anchor.href); // 调试用

                    // 替换图片源
                    img.src = anchor.href;

                    // 移除srcset属性，防止浏览器根据屏幕自动切回小图
                    if (img.hasAttribute('srcset')) {
                        img.removeAttribute('srcset');
                    }

                    // 样式调整：让图片自适应宽度，避免过大
                    if (FIT_SCREEN) {
                        img.style.maxWidth = '100%';
                        img.style.height = 'auto';
                        img.style.display = 'block';
                    }

                    // 可选：替换后阻止点击链接跳转（因为已经看到大图了）
                    // anchor.onclick = (e) => e.preventDefault();
                    // anchor.style.pointerEvents = 'none'; // 如果你想完全禁止点击
                }
            }
        });
    }

    // 1. 页面加载完成后立即执行一次
    replaceImages();

    // 2. 使用 MutationObserver 监听网页变化（针对瀑布流或动态加载的内容）
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                shouldUpdate = true;
            }
        });
        if (shouldUpdate) {
            replaceImages();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();