// ==UserScript==
// @license MIT
// @name         Danbooru Tag Copier（Danbooru网站图片tag一键复制）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在Danbooru网站上添加一键复制图片标签的功能
// @author       Your Name
// @match        https://danbooru.donmai.us/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554334/Danbooru%20Tag%20Copier%EF%BC%88Danbooru%E7%BD%91%E7%AB%99%E5%9B%BE%E7%89%87tag%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554334/Danbooru%20Tag%20Copier%EF%BC%88Danbooru%E7%BD%91%E7%AB%99%E5%9B%BE%E7%89%87tag%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试模式 - 设置为true可以在控制台查看日志
    const DEBUG = false;

    // 存储已处理的元素，防止重复添加按钮
    const processedElements = new WeakSet();

    // 存储已添加按钮的元素ID
    const processedElementIds = new Set();

    // 控制定时器的变量
    let checkIntervalId = null;

    // 防抖计时器
    let debounceTimer = null;

    // 缓存常用选择器结果
    const selectorCache = new Map();

    // 日志函数
    function log(...args) {
        if (DEBUG) {
            console.log('[Danbooru Tag Copier]', ...args);
        }
    }

    // 样式 - 预先定义样式以加快显示
    const style = document.createElement('style');
    style.textContent = `
        .tag-copy-button {
            background-color: #0075ff;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 4px 10px;
            margin: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            display: block;
            width: auto;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            z-index: 9999;
        }
        .tag-copy-button:hover {
            background-color: #0056b3;
        }
        .tag-copy-success {
            background-color: #28a745 !important;
        }

        /* 预先定义悬停窗口样式，避免闪烁 */
        .processed-tooltip .tag-copy-button {
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;

    // 主函数
    function init() {
        log('脚本初始化');

        // 立即添加样式，不等待DOM加载完成
        if (document.head) {
            document.head.appendChild(style);
        } else {
            // 如果head还不存在，等待它创建
            const headObserver = new MutationObserver(() => {
                if (document.head) {
                    document.head.appendChild(style);
                    headObserver.disconnect();
                }
            });
            headObserver.observe(document.documentElement, { childList: true });
        }

        // 监听DOM变化，处理动态加载的悬停窗口
        const observer = new MutationObserver(function(mutations) {
            // 使用更短的防抖时间
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                let nodesToProcess = [];

                // 快速收集需要处理的节点
                for (const mutation of mutations) {
                    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        for (let i = 0; i < mutation.addedNodes.length; i++) {
                            const node = mutation.addedNodes[i];
                            if (node.nodeType === 1) { // 元素节点
                                if (isRelevantNode(node)) {
                                    nodesToProcess.push(node);
                                } else {
                                    // 检查子元素
                                    const relevantChildren = node.querySelectorAll(TOOLTIP_SELECTORS);
                                    if (relevantChildren.length > 0) {
                                        nodesToProcess.push(...relevantChildren);
                                    }
                                }
                            }
                        }
                    }
                }

                // 批量处理收集到的节点
                if (nodesToProcess.length > 0) {
                    nodesToProcess.forEach(processTooltip);
                }
            }, 50); // 减少到50ms防抖
        });

        // 定义常量选择器，避免重复创建
        const TOOLTIP_SELECTORS = '.tooltip, .post-tooltip, .ui-tooltip-content, .tag-list, .tag-container, .tags, #tag-list, #tag-box';

        // 只观察与悬停窗口相关的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true, // 添加属性监听，因为有些悬停窗口是通过修改属性显示的
            attributeFilter: ['class', 'style', 'data-visible'] // 只监听这些属性变化
        });

        // 初始处理一次
        processRelevantTooltips();

        // 更频繁地检查悬停窗口，但使用requestAnimationFrame优化性能
        function checkTooltips() {
            processRelevantTooltips();
            requestAnimationFrame(() => {
                setTimeout(checkTooltips, 1000); // 每秒检查一次
            });
        }

        // 启动检查
        checkTooltips();

        // 添加鼠标移动监听，更快地响应悬停
        document.addEventListener('mouseover', (e) => {
            // 检查鼠标悬停的元素是否是图片或可能触发悬停窗口的元素
            const target = e.target;
            if (target.tagName === 'IMG' ||
                target.classList.contains('post-preview') ||
                target.classList.contains('thumbnail')) {
                // 短暂延迟后检查是否出现了悬停窗口
                setTimeout(processRelevantTooltips, 100);
            }
        });

        // 页面卸载时清理
        window.addEventListener('unload', () => {
            observer.disconnect();
        });
    }

    // 检查节点是否与悬停窗口相关 - 优化性能
    function isRelevantNode(node) {
        if (!node || !node.classList) return false;

        // 使用更简单的检查方式
        return (
            node.classList.contains('tooltip') ||
            node.classList.contains('post-tooltip') ||
            node.classList.contains('ui-tooltip-content') ||
            node.classList.contains('tag-list') ||
            node.classList.contains('tag-container') ||
            node.classList.contains('tags') ||
            node.id === 'tag-list' ||
            node.id === 'tag-box'
        );
    }

    // 直接处理单个悬停窗口
    function processTooltip(element) {
        // 避免重复处理
        if (processedElements.has(element) ||
            element.classList.contains('processed-tooltip') ||
            (element.id && processedElementIds.has(element.id))) {
            return;
        }

        // 标记为已处理
        element.classList.add('processed-tooltip');
        processedElements.add(element);
        if (element.id) {
            processedElementIds.add(element.id);
        }

        // 快速检查是否包含标签元素
        if (containsTagElements(element)) {
            addCopyButton(element);
        }
    }

    // 处理相关的悬停窗口 - 优化性能
    function processRelevantTooltips() {
        // 使用单个选择器，减少DOM查询次数
        const tooltips = document.querySelectorAll('.tooltip:not(.processed-tooltip), .post-tooltip:not(.processed-tooltip), .ui-tooltip-content:not(.processed-tooltip), .tag-list:not(.processed-tooltip), .tag-container:not(.processed-tooltip), .tags:not(.processed-tooltip), #tag-list:not(.processed-tooltip), #tag-box:not(.processed-tooltip)');

        // 先移除页面上所有重复的按钮
        removeExcessButtons();

        if (tooltips.length > 0) {
            tooltips.forEach(processTooltip);
        }
    }

    // 移除多余的按钮
    function removeExcessButtons() {
        // 获取页面上所有的标签区域
        const tagSections = document.querySelectorAll('.tag-list, #tag-list, .tags');

        // 对每个标签区域，确保只有一个复制按钮
        tagSections.forEach(section => {
            const buttons = section.querySelectorAll('.tag-copy-button');
            // 如果有多个按钮，保留第一个，删除其余的
            if (buttons.length > 1) {
                for (let i = 1; i < buttons.length; i++) {
                    buttons[i].remove();
                }
            }
        });

        // 特别处理页面左侧的标签区域
        const sidebarTags = document.querySelector('#tags, .sidebar .tags');
        if (sidebarTags) {
            const sidebarButtons = sidebarTags.querySelectorAll('.tag-copy-button');
            // 如果侧边栏有多个按钮，只保留一个
            if (sidebarButtons.length > 1) {
                // 保留第一个按钮，删除其余的
                for (let i = 1; i < sidebarButtons.length; i++) {
                    sidebarButtons[i].remove();
                }
            }
        }
    }

    // 检查元素是否包含标签元素 - 优化性能
    function containsTagElements(element) {
        // 使用缓存避免重复查询
        if (selectorCache.has(element)) {
            return selectorCache.get(element);
        }

        // 快速检查常见标签类型
        if (element.querySelector('.tag-type-1, .tag-type-3, .tag-type-4, .tag-type-0, .tag, .search-tag, .tag-link, a[href*="tags="], [data-tag], [data-tag-name], [data-tag-id]')) {
            selectorCache.set(element, true);
            return true;
        }

        // 检查data-tags属性
        const hasDataTags = element.dataset && element.dataset.tags;
        selectorCache.set(element, hasDataTags);
        return hasDataTags;
    }

    // 添加复制按钮到悬停窗口 - 优化性能
    function addCopyButton(tooltipElement) {
        // 1. 检查元素本身是否已有按钮
        if (tooltipElement.querySelector('.tag-copy-button')) {
            return;
        }

        // 2. 查找标签容器 - 简化查找逻辑
        let tagContainer = tooltipElement;
        const container = tooltipElement.querySelector('.tags, .tag-list, .tag-container, .tag-list-container, #tag-list, #tag-box');
        if (container) {
            tagContainer = container;
        }

        // 3. 检查标签容器是否已有按钮
        if (tagContainer.querySelector('.tag-copy-button')) {
            return;
        }

        // 4. 检查是否是页面左侧的标签区域
        const isSidebar = tagContainer.closest('.sidebar') ||
                         tagContainer.id === 'tags' ||
                         tagContainer.parentElement.id === 'tags';

        // 如果是侧边栏，检查是否已经有按钮
        if (isSidebar) {
            const existingButtons = document.querySelectorAll('.sidebar .tag-copy-button, #tags .tag-copy-button');
            if (existingButtons.length > 0) {
                return; // 侧边栏已有按钮，不再添加
            }
        }

        // 5. 生成唯一ID - 使用更可靠的方式
        const buttonId = 'tag-copy-button-' + (isSidebar ? 'sidebar' : Math.random().toString(36).substr(2, 9));

        // 6. 检查是否已存在相同ID的按钮
        if (document.getElementById(buttonId)) {
            return;
        }

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'tag-copy-button';
        copyButton.id = buttonId;
        copyButton.textContent = '复制全部tag';
        copyButton.dataset.container = isSidebar ? 'sidebar' : 'tooltip';

        // 添加点击事件
        copyButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // 提取所有标签
            const tags = extractTags(tagContainer);

            // 复制到剪贴板
            if (tags) {
                copyToClipboard(tags);

                // 显示成功状态
                copyButton.classList.add('tag-copy-success');
                copyButton.textContent = '复制成功!';

                setTimeout(() => {
                    copyButton.classList.remove('tag-copy-success');
                    copyButton.textContent = '复制全部tag';
                }, 1500);
            }
        });

        // 添加按钮到悬停窗口
        try {
            // 尝试添加到标签容器前面
            tagContainer.insertAdjacentElement('beforebegin', copyButton);
            log('按钮已添加: ' + buttonId);
        } catch (e) {
            try {
                // 如果失败，尝试添加到容器内部
                tagContainer.prepend(copyButton);
                log('按钮已添加(内部): ' + buttonId);
            } catch (e2) {
                log('添加按钮失败');
            }
        }
    }

    // 从标签容器中提取所有标签 - 优化性能
    function extractTags(tagContainer) {
        if (!tagContainer) return '';

        // 使用单个选择器查询所有可能的标签元素，减少DOM查询次数
        const tagElements = tagContainer.querySelectorAll('.tag-type-1, .tag-type-3, .tag-type-4, .tag-type-0, .tag, .search-tag, .tag-link, a[href*="tags="], [data-tag], [data-tag-name], [data-tag-id]');

        let tags = [];

        if (tagElements.length > 0) {
            tagElements.forEach(tag => {
                // 优先从data属性中提取
                let tagName = tag.dataset.tag || tag.dataset.tagName || '';

                // 如果没有data属性，尝试从href中提取
                if (!tagName && tag.href && tag.href.includes('tags=')) {
                    const match = tag.href.match(/tags=([^&]+)/);
                    if (match && match[1]) {
                        tagName = decodeURIComponent(match[1]);
                    }
                }

                // 如果还是没有，使用文本内容
                if (!tagName) {
                    tagName = tag.textContent.trim();
                }

                // 添加到标签列表
                if (tagName && !tags.includes(tagName)) {
                    tags.push(tagName);
                }
            });
        } else if (tagContainer.dataset && tagContainer.dataset.tags) {
            // 如果没有找到标签元素，尝试从data-tags属性中提取
            tags = tagContainer.dataset.tags.split(' ');
        }

        return tags.join(',');
    }

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        if (!text) return;

        // 使用现代的Clipboard API (如果可用)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    log('复制成功');
                })
                .catch(() => {
                    fallbackCopy(text);
                });
        } else {
            // 回退到传统方法
            fallbackCopy(text);
        }
    }

    // 传统的复制方法
    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);

        try {
            textarea.select();
            document.execCommand('copy');
        } catch (err) {
            log('复制错误');
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // 尽早初始化，不等待DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 添加调试信息
    log('脚本加载完成，版本 0.4');
})();