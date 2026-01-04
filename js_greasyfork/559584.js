// ==UserScript==
// @name         同人站商品鼠标悬停预览（蜜瓜/虎穴）
// @name:zh-CN   同人站商品鼠标悬停预览（蜜瓜/虎穴）
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  在蜜瓜或虎穴的商品图片上悬停以显示高清原图预览。
// @author       陨石碎
// @match        *://*.melonbooks.co.jp/*
// @match        *://ec.toranoana.jp/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559584/%E5%90%8C%E4%BA%BA%E7%AB%99%E5%95%86%E5%93%81%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E9%A2%84%E8%A7%88%EF%BC%88%E8%9C%9C%E7%93%9C%E8%99%8E%E7%A9%B4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559584/%E5%90%8C%E4%BA%BA%E7%AB%99%E5%95%86%E5%93%81%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E9%A2%84%E8%A7%88%EF%BC%88%E8%9C%9C%E7%93%9C%E8%99%8E%E7%A9%B4%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const OFFSET_X = 15; // 预览图与鼠标的水平偏移量 (像素)
    const OFFSET_Y = 15; // 预览图与鼠标的垂直偏移量 (像素)
    const MAX_PREVIEW_WIDTH = 250; // 预览图最大宽度 (像素)
    const MAX_PREVIEW_HEIGHT_VH = 50; // 预览图最大高度 (占浏览器窗口高度的百分比, 90vh = 90%)
    // 合并两个网站的图片选择器，用逗号分隔
    const TARGET_SELECTOR = `
        img.lazyloaded,
        img[showmore-lazy]
    `.trim(/\s+/g, ' ');

    /**
     * @description 从缩略图 URL 中提取原图 URL，兼容多个网站。
     * @param {string} thumbnailUrl - 原始的图片 src 属性。
     * @returns {string} - 处理后的高清原图 URL。
     */
    function getOriginalImageUrl(thumbnailUrl) {
        // 规则 1: 虎穴
        if (thumbnailUrl.includes('_thumb.')) {
            return thumbnailUrl.replace('_thumb.', '.');
        }

        // 规则 2: 蜜瓜
        if (thumbnailUrl.includes('resize_image.php')) {
            try {
                const url = new URL(thumbnailUrl);
                const imageName = url.searchParams.get('image');
                if (imageName) {
                    return `${url.origin}${url.pathname}?image=${imageName}`;
                }
            } catch (error) {
                console.warn('Image Previewer: Invalid Melonbooks URL format.', thumbnailUrl, error);
            }
        }

        // 如果以上规则都不匹配，则返回原始 URL
        return thumbnailUrl;
    }


    // --- 样式注入 ---
    GM_addStyle(`
        #image-preview-container-v3 {
            position: fixed;
            display: none;
            z-index: 99999;
            pointer-events: none;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            border: 2px solid white;
            background-color: white;
            border-radius: 5px;
            transition: opacity 0.1s ease-in-out;
            opacity: 0;
        }
        #image-preview-container-v3.visible {
            display: block;
            opacity: 1;
        }
        #image-preview-container-v3 img {
            display: block;
            max-width: ${MAX_PREVIEW_WIDTH}px;
            max-height: ${MAX_PREVIEW_HEIGHT_VH}vh;
            border-radius: 3px;
        }
    `);

    // --- 创建预览元素 ---
    const previewContainer = document.createElement('div');
    previewContainer.id = 'image-preview-container-v3';
    const previewImage = document.createElement('img');
    previewContainer.appendChild(previewImage);
    document.body.appendChild(previewContainer);

    // --- 事件监听 ---
    // 鼠标移入目标图片
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.matches(TARGET_SELECTOR)) {
            const originalImageUrl = getOriginalImageUrl(e.target.src);
            previewImage.src = originalImageUrl;
            previewContainer.classList.add('visible');
        }
    });

    // 鼠标移出目标图片
    document.body.addEventListener('mouseout', (e) => {
        if (e.target.matches(TARGET_SELECTOR)) {
            previewContainer.classList.remove('visible');
            previewImage.src = '';
        }
    });

    // 鼠标在页面上移动，用于更新预览图位置
    document.addEventListener('mousemove', (e) => {
        if (!previewContainer.classList.contains('visible')) {
            return;
        }

        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const previewWidth = previewContainer.offsetWidth;
        const previewHeight = previewContainer.offsetHeight;

        let top = e.clientY + OFFSET_Y;
        let left = e.clientX + OFFSET_X;

        // 边缘检测
        if (left + previewWidth > winWidth) {
            left = e.clientX - previewWidth - OFFSET_X;
        }
        if (left < 0) left = 0;
        if (top < 0) top = 0;

        previewContainer.style.top = `${top}px`;
        previewContainer.style.left = `${left}px`;
    });
})();