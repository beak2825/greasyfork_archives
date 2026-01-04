// ==UserScript==
// @name         对GitHub项目中README文件的图片预览
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 GitHub README 中点击图片时显示浮层预览
// @author       0x1cc4
// @match        https://github.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550035/%E5%AF%B9GitHub%E9%A1%B9%E7%9B%AE%E4%B8%ADREADME%E6%96%87%E4%BB%B6%E7%9A%84%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/550035/%E5%AF%B9GitHub%E9%A1%B9%E7%9B%AE%E4%B8%ADREADME%E6%96%87%E4%BB%B6%E7%9A%84%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 禁用所有 README 中图片的点击跳转并添加预览功能
    const disableImageLinks = () => {
        const article = document.querySelector('article');
        if (!article) return;

        const imageLinks = article.querySelectorAll('a:has(img)');
        imageLinks.forEach(link => {
            link.style.cursor = 'zoom-in';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const img = link.querySelector('img');
                if (img) {
                    showPreview(img);
                }
                return false;
            }, true);

            // 处理图片的点击事件
            const img = link.querySelector('img');
            if (img) {
                img.style.cursor = 'zoom-in';
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showPreview(img);
                }, true);
            }
        });
    };

    // 监听 DOM 变化，处理动态加载的内容
    const observeDOM = () => {
        const observer = new MutationObserver((mutations) => {
            if (document.querySelector('article')) {
                disableImageLinks();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // 创建浮层元素
    const createOverlay = () => {
        const overlay = document.createElement('div');
        overlay.id = 'github-image-preview-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            cursor: pointer;
        `;
        document.body.appendChild(overlay);
        return overlay;
    };

    // 创建图片预览元素
    const createPreviewImage = () => {
        const img = document.createElement('img');
        img.id = 'github-image-preview';
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 4px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        `;
        return img;
    };

    // 初始化浮层和预览图片
    const overlay = createOverlay();
    const previewImage = createPreviewImage();
    overlay.appendChild(previewImage);

    // 显示图片预览
    const showPreview = (imgElement) => {
        // 获取最佳质量的图片 URL
        let imageUrl = imgElement.src;
        // 如果是 GitHub 的图片链接，尝试获取原始大小的图片
        if (imageUrl.includes('github.com') && imageUrl.includes('?')) {
            imageUrl = imageUrl.split('?')[0];
        }

        previewImage.src = imageUrl;
        overlay.style.display = 'flex';
    };

    // 监听其他可能的图片点击事件（以防万一）
    const handleImageClick = (e) => {
        const imgElement = e.target;
        if (imgElement.tagName === 'IMG' && imgElement.closest('article')) {
            e.preventDefault();
            e.stopPropagation();
            showPreview(imgElement);
            return false;
        }
    };

    // 点击浮层关闭预览
    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // 监听 document 的点击事件，以捕获动态加载的图片
    document.addEventListener('click', handleImageClick);

    // 添加键盘事件监听，按 ESC 键关闭预览
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            overlay.style.display = 'none';
        }
    });

    // 初始化时禁用图片链接
    disableImageLinks();
    // 监听 DOM 变化
    observeDOM();
})();