// ==UserScript==
// @name         Discord 图片助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在Discord图片旁边添加"保存原图"和"复制链接"按钮，提升图片处理效率
// @author       Your Name
// @match        https://discord.com/*
// @match        https://*.discord.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559682/Discord%20%E5%9B%BE%E7%89%87%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559682/Discord%20%E5%9B%BE%E7%89%87%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 样式定义 ====================
    const style = document.createElement('style');
    style.textContent = `
        .discord-img-helper-container {
            display: flex;
            gap: 8px;
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(30, 30, 30, 0.92);
            padding: 6px 10px;
            border-radius: 6px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
            z-index: 9999;
            backdrop-filter: blur(5px);
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .discord-img-helper-parent:hover .discord-img-helper-container {
            opacity: 1;
        }

        .discord-img-helper-btn {
            padding: 6px 14px;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            outline: none;
        }

        .discord-img-helper-btn.save {
            background: #43b581;
        }

        .discord-img-helper-btn.save:hover {
            background: #3ca374;
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(67, 181, 129, 0.4);
        }

        .discord-img-helper-btn.save:active {
            transform: translateY(0);
        }

        .discord-img-helper-btn.copy {
            background: #7289da;
        }

        .discord-img-helper-btn.copy:hover {
            background: #677bc4;
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(114, 137, 218, 0.4);
        }

        .discord-img-helper-btn.copy:active {
            transform: translateY(0);
        }

        .discord-img-helper-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .discord-img-helper-btn.error {
            background: #f04747 !important;
        }

        .discord-img-helper-btn.success {
            background: #43b581 !important;
        }
    `;
    document.head.appendChild(style);

    // ==================== 配置和状态 ====================
    const processedImages = new WeakSet();
    const processedContainers = new WeakSet();

    // Discord 图片选择器（只选择消息附件图片）
    const imageSelectors = [
        '[class*="imageWrapper"] img',
        '[class*="messageAttachment"] img',
        '[class*="embedImage"] img',
        '[class*="imageContent"] img',
        '[class*="clickableWrapper"] img',
        '[class*="originalLink"] img'
    ];

    // 需要排除的选择器（头像、表情等）
    const excludeSelectors = [
        '[class*="avatar"]',
        '[class*="emoji"]',
        '[class*="reaction"]',
        '[class*="icon"]',
        '[class*="status"]',
        '[class*="badge"]',
        '[class*="decoration"]',
        '[class*="Banner"]',
        '[role="img"]'
    ];

    // ==================== 工具函数 ====================

    // 检查元素是否应该被排除
    function shouldExcludeElement(element) {
        // 检查元素本身及其父级
        let current = element;
        for (let i = 0; i < 5 && current; i++) {
            const classList = current.className;
            if (typeof classList === 'string') {
                const lowerClass = classList.toLowerCase();
                // 排除头像、表情、图标等
                if (lowerClass.includes('avatar') ||
                    lowerClass.includes('emoji') ||
                    lowerClass.includes('reaction') ||
                    lowerClass.includes('icon') ||
                    lowerClass.includes('status') ||
                    lowerClass.includes('badge') ||
                    lowerClass.includes('decoration') ||
                    lowerClass.includes('banner')) {
                    return true;
                }
            }
            current = current.parentElement;
        }

        // 检查是否匹配排除选择器
        for (const selector of excludeSelectors) {
            if (element.matches(selector) || element.closest(selector)) {
                return true;
            }
        }

        return false;
    }

    // 获取图片URL
    function getImageUrl(element) {
        if (element.tagName === 'IMG') {
            return element.src || element.getAttribute('src');
        }
        
        const img = element.querySelector('img');
        if (img) {
            return img.src || img.getAttribute('src');
        }

        if (element.tagName === 'A' && element.href) {
            return element.href;
        }

        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match) return match[1];
        }

        return null;
    }

    // 获取原图链接（移除Discord的压缩参数）
    function getOriginalImageUrl(url) {
        if (!url) return null;
        
        try {
            const urlObj = new URL(url);
            
            // 移除Discord CDN的尺寸限制参数
            urlObj.searchParams.delete('width');
            urlObj.searchParams.delete('height');
            urlObj.searchParams.delete('size');
            urlObj.searchParams.delete('format');
            urlObj.searchParams.delete('quality');
            
            return urlObj.toString();
        } catch (e) {
            console.error('解析URL失败:', e);
            return url;
        }
    }

    // 从URL获取文件名
    function getFilenameFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            let filename = pathname.substring(pathname.lastIndexOf('/') + 1);
            
            // 如果文件名为空或太短，使用默认名称
            if (!filename || filename.length < 3) {
                filename = `discord-image-${Date.now()}.png`;
            }
            
            return decodeURIComponent(filename);
        } catch (e) {
            return `discord-image-${Date.now()}.png`;
        }
    }

    // 下载图片
    async function downloadImage(url, button) {
        const originalText = button.textContent;
        button.textContent = '下载中...';
        button.disabled = true;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const filename = getFilenameFromUrl(url);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            }, 100);

            button.textContent = '成功！';
            button.classList.add('success');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.classList.remove('success');
            }, 2000);
        } catch (error) {
            console.error('下载图片失败:', error);
            button.textContent = '失败！';
            button.classList.add('error');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.classList.remove('error');
            }, 2000);
        }
    }

    // 复制链接到剪贴板
    async function copyToClipboard(text, button) {
        const originalText = button.textContent;
        
        try {
            await navigator.clipboard.writeText(text);
            button.textContent = '已复制！';
            button.classList.add('success');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('success');
            }, 1500);
        } catch (error) {
            console.error('复制失败:', error);
            
            // 降级方案：使用传统方法复制
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                button.textContent = '已复制！';
                button.classList.add('success');
            } catch (e) {
                button.textContent = '失败！';
                button.classList.add('error');
            }
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('success', 'error');
            }, 1500);
        }
    }

    // ==================== 主要功能 ====================

    // 添加按钮到图片
    function addButtonsToImage(imgElement) {
        if (processedImages.has(imgElement)) {
            return;
        }

        // 检查是否应该排除此元素
        if (shouldExcludeElement(imgElement)) {
            return;
        }

        const imageUrl = getImageUrl(imgElement);
        if (!imageUrl) return;

        // 只处理Discord CDN的图片
        if (!imageUrl.includes('cdn.discordapp.com') && 
            !imageUrl.includes('media.discordapp.net')) {
            return;
        }

        // 过滤掉表情符号和小图标（提高阈值到80px）
        let width, height;
        if (imgElement.tagName === 'IMG') {
            width = imgElement.naturalWidth || imgElement.width || imgElement.offsetWidth;
            height = imgElement.naturalHeight || imgElement.height || imgElement.offsetHeight;
        } else {
            width = imgElement.offsetWidth;
            height = imgElement.offsetHeight;
        }

        if (width <= 80 || height <= 80) {
            return;
        }

        // 检查元素是否可见
        if (imgElement.offsetParent === null) {
            return;
        }

        // 标记为已处理
        processedImages.add(imgElement);

        // 查找合适的容器（只查找图片相关容器，不包括头像容器）
        let container = imgElement.closest('[class*="imageWrapper"]') ||
                       imgElement.closest('[class*="messageAttachment"]') ||
                       imgElement.closest('[class*="embedImage"]') ||
                       imgElement.closest('[class*="imageContent"]') ||
                       imgElement.closest('[class*="clickableWrapper"]');

        // 如果没有找到合适的容器，不添加按钮
        if (!container) {
            return;
        }

        // 再次检查容器是否包含排除的类
        if (shouldExcludeElement(container)) {
            return;
        }

        if (processedContainers.has(container)) {
            return;
        }

        processedContainers.add(container);

        // 设置容器样式
        const containerPosition = window.getComputedStyle(container).position;
        if (containerPosition === 'static') {
            container.style.position = 'relative';
        }
        
        container.classList.add('discord-img-helper-parent');

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'discord-img-helper-container';

        // 保存原图按钮
        const saveButton = document.createElement('button');
        saveButton.className = 'discord-img-helper-btn save';
        saveButton.textContent = '保存原图';
        saveButton.title = '下载图片原始版本';
        saveButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const originalUrl = getOriginalImageUrl(imageUrl);
            downloadImage(originalUrl, saveButton);
        };

        // 复制链接按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'discord-img-helper-btn copy';
        copyButton.textContent = '复制链接';
        copyButton.title = '复制图片CDN链接';
        copyButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const originalUrl = getOriginalImageUrl(imageUrl);
            copyToClipboard(originalUrl, copyButton);
        };

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(copyButton);
        container.appendChild(buttonContainer);
    }

    // 扫描页面图片
    function scanImages() {
        const selector = imageSelectors.join(', ');
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            try {
                addButtonsToImage(element);
            } catch (e) {
                console.error('处理图片时出错:', e);
            }
        });
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ==================== 初始化 ====================

    const debouncedScan = debounce(scanImages, 300);

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldScan = true;
                break;
            }
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'src' || 
                 mutation.attributeName === 'href' ||
                 mutation.attributeName === 'class')) {
                shouldScan = true;
                break;
            }
        }
        
        if (shouldScan) {
            debouncedScan();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'class']
    });

    // 初始加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(scanImages, 500);
        });
    } else {
        setTimeout(scanImages, 500);
    }

    // 定期扫描（确保不遗漏）
    setInterval(scanImages, 5000);

    // 页面滚动时扫描新内容
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(scanImages, 500);
    }, { passive: true });

    console.log('✅ Discord 图片助手已启动');
})();
