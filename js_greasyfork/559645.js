// ==UserScript==
// @name         Supjav图片链接替换脚本
// @namespace    https://sleazyfork.org/zh-CN/users/14374-sweettalk
// @version      1.0
// @description  将supjav.com网站上的图片链接从带尺寸参数的格式替换为原始格式
// @author       sweettalk
// @match        *://*.supjav.com/*
// @grant        none
// @run-at       document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/559645/Supjav%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/559645/Supjav%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 正则表达式模式：匹配https://img.supjav.com/images/...格式的URL
    // 并移除!320x216.jpg这样的尺寸参数
    const IMAGE_URL_PATTERN = /(https:\/\/img\.supjav\.com\/images\/.*?)\!\d+x\d+\.jpg/g;

    /**
     * 替换图片链接的核心函数
     * @param {HTMLImageElement} img - 图片元素
     */
    function replaceImageUrl(img) {
        if (!img || !img.src) return;

        // 检查是否匹配目标URL格式
        if (img.src.match(IMAGE_URL_PATTERN)) {
            const originalUrl = img.src;
            const newUrl = img.src.replace(IMAGE_URL_PATTERN, '$1');

            // 只在URL确实发生变化时才替换
            if (newUrl !== originalUrl) {
                console.log(`替换图片链接: ${originalUrl} → ${newUrl}`);
                img.src = newUrl;

                // 同时更新srcset属性（如果存在）
                if (img.srcset) {
                    img.srcset = img.srcset.replace(IMAGE_URL_PATTERN, '$1');
                }
            }
        }
    }

    /**
     * 处理页面上所有图片元素
     */
    function processAllImages() {
        console.log('开始处理页面上的所有图片...');

        // 获取页面上所有图片元素
        const images = document.querySelectorAll('img');

        // 遍历并替换每个图片的URL
        images.forEach(img => {
            replaceImageUrl(img);
        });

        console.log(`已处理 ${images.length} 张图片`);
    }

    /**
     * 设置MutationObserver监控DOM变化
     * 用于处理动态加载的图片
     */
    function setupMutationObserver() {
        // 观察整个文档的变化
        const targetNode = document.body;

        // 观察配置：监听子节点变化和属性变化
        const config = {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['src', 'srcset']
        };

        // 回调函数处理DOM变化
        const callback = function(mutationsList) {
            mutationsList.forEach(mutation => {
                // 处理新增的子节点
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        // 如果是图片元素直接处理
                        if (node.tagName === 'IMG') {
                            replaceImageUrl(node);
                        }
                        // 如果是包含图片的容器，递归处理其中的所有图片
                        else if (node.querySelectorAll) {
                            const images = node.querySelectorAll('img');
                            images.forEach(img => replaceImageUrl(img));
                        }
                    });
                }
                // 处理属性变化（如src属性被动态修改）
                else if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') {
                    replaceImageUrl(mutation.target);
                }
            });
        };

        // 创建并启动观察者
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        console.log('已启动DOM变化监控器，将自动处理动态加载的图片');

        // 页面卸载时停止观察
        window.addEventListener('beforeunload', () => {
            observer.disconnect();
            console.log('DOM变化监控器已停止');
        });
    }

    /**
     * 处理延迟加载的图片（可能使用data-src等属性）
     */
    function handleLazyLoadedImages() {
        // 检查是否有使用data-src属性的延迟加载图片
        const lazyImages = document.querySelectorAll('img[data-src], img[data-original]');

        lazyImages.forEach(img => {
            const srcAttr = img.dataset.src || img.dataset.original;
            if (srcAttr && srcAttr.match(IMAGE_URL_PATTERN)) {
                const newSrc = srcAttr.replace(IMAGE_URL_PATTERN, '$1');

                // 更新data属性
                if (img.dataset.src) {
                    img.dataset.src = newSrc;
                }
                if (img.dataset.original) {
                    img.dataset.original = newSrc;
                }

                // 如果图片已经加载，也更新src属性
                if (img.src === srcAttr) {
                    img.src = newSrc;
                }
            }
        });
    }

    /**
     * 初始化函数
     */
    function init() {
        console.log('Supjav图片链接替换脚本已启动');

        // 立即处理页面上已有的图片
        processAllImages();

        // 处理延迟加载的图片
        handleLazyLoadedImages();

        // 设置监控器处理动态加载的图片
        setupMutationObserver();

        // 监听滚动事件，处理懒加载图片
        window.addEventListener('scroll', () => {
            handleLazyLoadedImages();
        });

        // 监听页面加载完成事件
        window.addEventListener('load', () => {
            console.log('页面完全加载完成，再次处理图片...');
            processAllImages();
        });
    }

    // 启动脚本
    init();

    // 提供调试接口
    window.supjavImageReplace = {
        processAllImages: processAllImages,
        replaceImageUrl: replaceImageUrl,
        version: '1.0'
    };

    console.log('Supjav图片链接替换脚本初始化完成');
})();
