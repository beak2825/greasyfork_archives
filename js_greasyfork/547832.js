// ==UserScript==
// @name         图片预览 - Image Preview
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  按空格键预览图片，类似 macOS Quick Look
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547832/%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%20-%20Image%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/547832/%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%20-%20Image%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isPreviewMode = false;
    let currentElement = null;
    let previewContainer = null;
    let previewContent = null;
    let loadingIndicator = null;

    // 创建预览容器
    function createPreviewContainer() {
        previewContainer = document.createElement('div');
        previewContainer.id = 'image-preview-container';
        previewContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            z-index: 999999;
            display: none;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(10px);
            cursor: pointer;
        `;

        previewContent = document.createElement('div');
        previewContent.style.cssText = `
            max-width: 95vw;
            max-height: 90vh;
            position: relative;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
            cursor: auto;
        `;

        loadingIndicator = document.createElement('div');
        loadingIndicator.innerHTML = '加载中...';
        loadingIndicator.style.cssText = `
            color: white;
            font-size: 18px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        previewContainer.appendChild(previewContent);
        document.body.appendChild(previewContainer);

        // 点击背景关闭预览
        previewContainer.addEventListener('click', function(e) {
            if (e.target === previewContainer) {
                closePreview();
            }
        });
    }

    // 获取当前鼠标悬停的图片元素
    function getCurrentHoverImage() {
        const images = document.querySelectorAll('img');
        let hoveredImage = null;

        images.forEach(img => {
            if (img.matches(':hover')) {
                hoveredImage = img;
            }
        });

        // 如果没有悬停图片，尝试获取焦点图片
        if (!hoveredImage) {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.tagName === 'IMG') {
                hoveredImage = focusedElement;
            }
        }

        return hoveredImage;
    }

    // 预览图片
    function previewImage(src, alt = '') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;

        img.onload = function() {
            // 获取图片原始尺寸
            const originalWidth = img.naturalWidth;
            const originalHeight = img.naturalHeight;

            // 获取屏幕尺寸
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const maxWidth = screenWidth * 0.9;
            const maxHeight = screenHeight * 0.9;

            // 计算智能缩放比例
            let scale = 1;
            const minDimension = Math.min(originalWidth, originalHeight);

            if (minDimension < 200) {
                // 小图片：放大3-5倍
                scale = Math.min(5, Math.max(3, 800 / minDimension));
            } else if (minDimension < 400) {
                // 中等图片：放大1.5-3倍
                scale = Math.min(3, Math.max(1.5, 600 / minDimension));
            } else if (minDimension < 800) {
                // 较大图片：放大1-2倍
                scale = Math.min(2, Math.max(1, 800 / minDimension));
            } else {
                // 大图片：按需缩小或保持原大小
                scale = Math.min(1, Math.min(maxWidth / originalWidth, maxHeight / originalHeight));
            }

            const targetWidth = Math.min(originalWidth * scale, maxWidth);
            const targetHeight = Math.min(originalHeight * scale, maxHeight);

            img.style.cssText = `
                width: ${targetWidth}px;
                height: ${targetHeight}px;
                object-fit: contain;
                border-radius: 10px;
                max-width: 90vw;
                max-height: 90vh;
            `;

            previewContent.innerHTML = '';
            previewContent.appendChild(img);
        };

        img.onerror = function() {
            previewContent.innerHTML = '<div style="color: white; padding: 20px; text-align: center;">图片加载失败</div>';
        };

        previewContent.appendChild(loadingIndicator);
    }

    // 显示预览
    function showPreview() {
        if (!previewContainer) {
            createPreviewContainer();
        }

        previewContainer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        isPreviewMode = true;
    }

    // 关闭预览
    function closePreview() {
        if (previewContainer) {
            // 清空预览内容
            if (previewContent) {
                previewContent.innerHTML = '';
            }

            previewContainer.style.display = 'none';
        }
        document.body.style.overflow = '';
        isPreviewMode = false;
        currentElement = null;

        // 强制垃圾回收（如果浏览器支持）
        if (window.gc) {
            window.gc();
        }
    }

    // 处理图片预览
    function handleImagePreview(img) {
        currentElement = img;
        showPreview();
        previewImage(img.src, img.alt);
    }

    // 键盘事件处理
    document.addEventListener('keydown', function(e) {
        // 屏蔽空格键的默认行为（翻页）
        if (e.code === 'Space') {
            // 如果当前在输入框中，不拦截
            const activeElement = document.activeElement;
            const isInputField = activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.contentEditable === 'true'
            );

            if (isInputField) {
                return;
            }

            e.preventDefault();

            if (isPreviewMode) {
                closePreview();
            } else {
                const img = getCurrentHoverImage();
                if (img && img.tagName === 'IMG') {
                    handleImagePreview(img);
                }
            }
        }

        // ESC键关闭预览
        if (e.key === 'Escape' && isPreviewMode) {
            closePreview();
        }
    });

    // 鼠标移动时更新当前图片
    document.addEventListener('mousemove', function(e) {
        if (isPreviewMode) return;

        const element = e.target;
        if (element && element.tagName === 'IMG') {
            // 添加视觉提示
            element.style.outline = '2px solid rgba(0, 122, 255, 0.5)';
            element.style.outlineOffset = '2px';

            // 清除其他图片的提示
            document.querySelectorAll('img').forEach(img => {
                if (img !== element) {
                    img.style.outline = '';
                    img.style.outlineOffset = '';
                }
            });
        } else {
            // 清除所有提示
            document.querySelectorAll('img').forEach(img => {
                img.style.outline = '';
                img.style.outlineOffset = '';
            });
        }
    });

    console.log('图片预览脚本已加载');
})();