// ==UserScript==
// @name         Danbooru General Tags Copier with Textbox
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  快速复制Danbooru General类别下的所有标签，并在文本框中显示
// @author       You
// @match        https://danbooru.donmai.us/posts/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/554089/Danbooru%20General%20Tags%20Copier%20with%20Textbox.user.js
// @updateURL https://update.greasyfork.org/scripts/554089/Danbooru%20General%20Tags%20Copier%20with%20Textbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tagsModal = null;
    let tagsTextarea = null;

    // 创建复制按钮
    function createCopyButton() {
        // 检查是否已存在按钮，避免重复创建
        if (document.getElementById('danbooru-copy-button')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'danbooru-copy-button';
        button.innerHTML = '复制General标签';
        button.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;

        button.addEventListener('mouseenter', () => {
            button.style.background = '#45a049';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#4CAF50';
        });

        button.addEventListener('click', showTagsModal);

        document.body.appendChild(button);
    }

    // 创建标签显示模态框
    function createTagsModal() {
        tagsModal = document.createElement('div');
        tagsModal.id = 'danbooru-tags-modal';
        tagsModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            padding: 20px;
            display: none;
        `;

        const title = document.createElement('h3');
        title.textContent = 'General标签';
        title.style.cssText = `
            margin-top: 0;
            margin-bottom: 15px;
            color: #333;
        `;

        tagsTextarea = document.createElement('textarea');
        tagsTextarea.id = 'danbooru-tags-textarea';
        tagsTextarea.style.cssText = `
            width: 100%;
            height: 200px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
            font-family: monospace;
            font-size: 14px;
        `;
        tagsTextarea.readOnly = true;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
        `;

        const copyButton = document.createElement('button');
        copyButton.textContent = '复制到剪贴板';
        copyButton.style.cssText = `
            padding: 8px 16px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        copyButton.addEventListener('click', copyTagsToClipboard);

        const selectAllButton = document.createElement('button');
        selectAllButton.textContent = '全选';
        selectAllButton.style.cssText = `
            padding: 8px 16px;
            background: #FF9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        selectAllButton.addEventListener('click', () => {
            tagsTextarea.select();
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = `
            padding: 8px 16px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        closeButton.addEventListener('click', () => {
            tagsModal.style.display = 'none';
            overlay.style.display = 'none';
        });

        // 创建模态框背景遮罩
        const overlay = document.createElement('div');
        overlay.id = 'danbooru-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
        `;
        overlay.addEventListener('click', () => {
            tagsModal.style.display = 'none';
            overlay.style.display = 'none';
        });

        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(selectAllButton);
        buttonContainer.appendChild(closeButton);

        tagsModal.appendChild(title);
        tagsModal.appendChild(tagsTextarea);
        tagsModal.appendChild(buttonContainer);

        document.body.appendChild(overlay);
        document.body.appendChild(tagsModal);

        // 点击模态框内部不会关闭
        tagsModal.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 获取General标签 - 修复版本
    function getGeneralTags() {
        const generalTags = [];

        // 多种选择器尝试，确保能找到General标签
        const selectors = [
            'ul.general-tag-list',
            '.general-tag-list ul',
            '#tag-list .general-tag-list',
            '[class*="general-tag-list"]'
        ];

        let generalSection = null;
        for (const selector of selectors) {
            generalSection = document.querySelector(selector);
            if (generalSection) break;
        }

        if (!generalSection) {
            console.log('未找到General标签区域');
            // 调试：输出页面中所有可能的标签区域
            const allLists = document.querySelectorAll('ul');
            console.log('页面中的所有ul元素:', allLists);
            return generalTags;
        }

        console.log('找到General标签区域:', generalSection);

        // 查找标签链接
        const tagLinks = generalSection.querySelectorAll('a.search-tag');
        console.log('找到的标签链接数量:', tagLinks.length);

        tagLinks.forEach((link, index) => {
            const tagName = link.textContent.trim();
            console.log(`标签 ${index + 1}:`, tagName);

            // 过滤掉数字（帖子数量）和特殊字符
            if (tagName &&
                !/^\d+$/.test(tagName) &&
                !tagName.includes('k') &&
                !tagName.includes('M') &&
                !tagName.includes('»') &&
                tagName.length > 1) {
                generalTags.push(tagName);
            }
        });

        console.log('最终提取的标签:', generalTags);
        return generalTags;
    }

    // 显示标签模态框
    function showTagsModal() {
        const generalTags = getGeneralTags();

        if (generalTags.length > 0) {
            // 用逗号分隔标签
            const tagsString = generalTags.join(', ');
            tagsTextarea.value = tagsString;

            // 显示模态框和遮罩
            const overlay = document.getElementById('danbooru-modal-overlay');
            tagsModal.style.display = 'block';
            overlay.style.display = 'block';

            // 自动选择文本
            setTimeout(() => {
                tagsTextarea.select();
            }, 100);
        } else {
            showNotification('未找到General标签，请查看控制台获取详细信息');
            console.log('页面结构分析:');
            console.log('所有包含"general"的元素:', document.querySelectorAll('*[class*="general"]'));
            console.log('所有h3元素:', document.querySelectorAll('h3'));
        }
    }

    // 复制标签到剪贴板
    async function copyTagsToClipboard() {
        const tagsString = tagsTextarea.value;

        if (!tagsString) {
            showNotification('没有内容可复制');
            return;
        }

        try {
            // 方法1: 使用GM_setClipboard
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(tagsString, 'text');
                showNotification(`已复制 ${tagsString.split(',').length} 个标签到剪贴板`);
                return;
            }

            // 方法2: 使用navigator.clipboard
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(tagsString);
                showNotification(`已复制 ${tagsString.split(',').length} 个标签到剪贴板`);
                return;
            }

            // 方法3: 使用execCommand
            tagsTextarea.select();
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification(`已复制 ${tagsString.split(',').length} 个标签到剪贴板`);
            } else {
                showNotification('复制失败，请手动复制文本框中的内容');
            }
        } catch (error) {
            console.error('复制失败:', error);
            showNotification('复制失败，请手动复制文本框中的内容');
        }
    }

    // 显示通知
    function showNotification(message) {
        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                text: message,
                title: 'Danbooru标签复制',
                timeout: 3000
            });
        } else {
            // 创建简单的通知
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 150px;
                right: 20px;
                background: #333;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 10002;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 3000);
        }
    }

    // 等待页面完全加载
    function waitForPageLoad() {
        // 如果页面已经加载完成
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initializeScript();
        } else {
            document.addEventListener('DOMContentLoaded', initializeScript);
            // 备用：如果DOMContentLoaded已经触发
            setTimeout(initializeScript, 2000);
        }
    }

    // 初始化脚本
    function initializeScript() {
        console.log('Danbooru标签复制脚本初始化...');

        // 创建模态框
        createTagsModal();

        // 创建按钮
        createCopyButton();

        // 检查是否找到了General标签
        setTimeout(() => {
            const generalTags = getGeneralTags();
            if (generalTags.length === 0) {
                console.warn('脚本初始化时未找到General标签');
            } else {
                console.log('脚本初始化成功，找到', generalTags.length, '个General标签');
            }
        }, 1000);
    }

    // 启动脚本
    waitForPageLoad();
})();