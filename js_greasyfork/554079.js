// ==UserScript==
// @name 亚马逊店铺图片链接清理（自用）
// @version 1.0.0
// @description 自动清理亚马逊平台图片链接中的配置参数，显示原始图片URL，看高清原图
// @author Your Name
// @match *://*.amazon.*./*
// @grant none
// @run-at document-end
// @license MIT
// @namespace https://greasyfork.org/users/1005301
// @downloadURL https://update.greasyfork.org/scripts/554079/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%BA%97%E9%93%BA%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%B8%85%E7%90%86%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554079/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%BA%97%E9%93%BA%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%B8%85%E7%90%86%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 亚马逊图片URL模式
    const AMAZON_IMAGE_PATTERN = /https:\/\/(?:m|images)\.media-amazon\.com\/images\/S\/([^.]+)\.(?:_[^.]+)?\.(png|jpg|jpeg|gif)/i;

    // 清理亚马逊图片URL的函数
    function cleanAmazonImageUrl(url) {
        if (!url) return url;

        const match = url.match(AMAZON_IMAGE_PATTERN);
        if (match) {
            const imageId = match[1];
            const extension = match[2];
            return `https://m.media-amazon.com/images/S/${imageId}.${extension}`;
        }

        return url;
    }

    // 处理单个图片元素
    function processImage(img) {
        if (!img || !img.src) return;

        const originalUrl = img.src;
        const cleanedUrl = cleanAmazonImageUrl(originalUrl);

        if (cleanedUrl !== originalUrl) {
            console.log(`清理图片URL: ${originalUrl} -> ${cleanedUrl}`);
            img.src = cleanedUrl;

            // 同时更新srcset属性（如果存在）
            if (img.srcset) {
                const cleanedSrcset = img.srcset.split(',').map(srcSetItem => {
                    const parts = srcSetItem.trim().split(' ');
                    const src = parts[0];
                    const descriptor = parts.slice(1).join(' ');
                    return `${cleanAmazonImageUrl(src)} ${descriptor}`;
                }).join(', ');

                img.srcset = cleanedSrcset;
            }
        }
    }

    // 处理页面上所有图片
    function processAllImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => processImage(img));
    }

    // 监控DOM变化，处理动态加载的图片
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        // 如果添加的是图片元素
                        if (node.tagName === 'IMG') {
                            processImage(node);
                        }
                        // 如果添加的是包含图片的容器
                        else if (node.nodeType === 1) { // 元素节点
                            const imagesInNode = node.querySelectorAll('img');
                            imagesInNode.forEach(img => processImage(img));
                        }
                    });
                }
            });
        });

        // 开始监控整个文档
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'srcset']
        });

        return observer;
    }

    // 初始化函数
    function init() {
        console.log('亚马逊图片链接清理器已启动');

        // 处理当前页面已有的图片
        processAllImages();

        // 监控动态加载的图片
        const observer = observeDOMChanges();

        // 监听页面滚动和加载事件，确保新图片被处理
        window.addEventListener('scroll', processAllImages);
        window.addEventListener('load', processAllImages);

        // 监听AJAX请求完成事件（针对单页应用）
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args).then((response) => {
                setTimeout(processAllImages, 100);
                return response;
            });
        };

        console.log('亚马逊图片链接清理器初始化完成');
    }

    // 启动脚本
    init();
})();