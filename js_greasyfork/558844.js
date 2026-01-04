// ==UserScript==
// @name         豆瓣书名号转搜索链接
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将豆瓣网站上的书名号《》中的内容转换为可点击的搜索链接，就像豆瓣 App 一样！点击书名号内的文字即可快速搜索，无需手动复制粘贴。
// @author       You
// @license      MIT
// @icon         https://img1.doubanio.com/favicon.ico
// @match        https://*.douban.com/*
// @match        http://*.douban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558844/%E8%B1%86%E7%93%A3%E4%B9%A6%E5%90%8D%E5%8F%B7%E8%BD%AC%E6%90%9C%E7%B4%A2%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/558844/%E8%B1%86%E7%93%A3%E4%B9%A6%E5%90%8D%E5%8F%B7%E8%BD%AC%E6%90%9C%E7%B4%A2%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

/**
 * 豆瓣书名号转搜索链接
 * 
 * 功能说明：
 * - 自动识别页面中所有书名号《》中的内容
 * - 将书名号内的文字转换为可点击的豆瓣搜索链接
 * - 点击书名号内的文字即可快速跳转到豆瓣搜索页面
 * - 就像豆瓣 App 一样便捷！无需手动复制粘贴书名进行搜索
 * 
 * 特性：
 * - 支持动态加载的内容（自动处理 AJAX 加载的新内容）
 * - 性能优化，不会造成页面卡顿
 * - 只处理书名号内的内容，书名号本身保持原样
 * - 自动跳过已经是链接的内容，避免重复处理
 */

(function () {
    "use strict";

    // 标记已处理的元素，避免重复处理
    const processedElements = new WeakSet();

    // 标志位：是否正在处理中，避免在处理时触发观察事件
    let isProcessing = false;

    // 使用正则表达式匹配书名号《》中的内容
    const titleMarkRegex = /《([^《》]+)》/g;

    // 检查元素是否应该被跳过
    function shouldSkipElement(element) {
        if (!element) return true;

        const tagName = element.tagName;
        if (
            tagName === "SCRIPT" ||
            tagName === "STYLE" ||
            tagName === "A" ||
            tagName === "NOSCRIPT" ||
            tagName === "IFRAME"
        ) {
            return true;
        }

        // 跳过已处理的元素
        if (processedElements.has(element)) {
            return true;
        }

        return false;
    }

    // 处理单个文本节点
    function processTextNode(textNode) {
        const parent = textNode.parentElement;
        if (!parent || shouldSkipElement(parent)) {
            return false;
        }

        const text = textNode.textContent;
        // 检查是否包含书名号
        if (!titleMarkRegex.test(text)) {
            return false;
        }

        // 重置正则表达式
        titleMarkRegex.lastIndex = 0;

        const newHTML = text.replace(titleMarkRegex, (match, content) => {
            // 对搜索内容进行 URL 编码
            const encodedContent = encodeURIComponent(content);
            const searchUrl = `https://www.douban.com/search?q=${encodedContent}`;
            return `《<a href="${searchUrl}" target="_blank" style="color: #007722; text-decoration: none;">${content}</a>》`;
        });

        // 如果内容被替换了，创建新的 DOM 结构
        if (newHTML !== text) {
            isProcessing = true;

            const wrapper = document.createElement("span");
            wrapper.innerHTML = newHTML;
            parent.replaceChild(wrapper, textNode);

            // 标记已处理
            processedElements.add(wrapper);

            // 使用 setTimeout 确保 DOM 更新完成后再重置标志
            setTimeout(() => {
                isProcessing = false;
            }, 0);

            return true;
        }

        return false;
    }

    // 处理指定容器内的文本节点（只处理新增的内容）
    function processContainer(container) {
        if (shouldSkipElement(container)) {
            return;
        }

        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    const parent = node.parentElement;
                    if (!parent || shouldSkipElement(parent)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 检查父元素是否已经是链接
                    if (parent.closest("a")) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 只处理包含书名号的文本节点
                    if (titleMarkRegex.test(node.textContent)) {
                        titleMarkRegex.lastIndex = 0;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                },
            },
            false
        );

        const textNodes = [];
        let node;
        while ((node = walker.nextNode())) {
            textNodes.push(node);
        }

        // 处理每个文本节点
        textNodes.forEach((textNode) => {
            processTextNode(textNode);
        });
    }

    // 防抖函数
    let debounceTimer = null;
    function debounceProcess(container) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            processContainer(container);
        }, 200);
    }

    // 初始执行（只执行一次，延迟执行避免阻塞页面加载）
    function initProcess() {
        if (document.body) {
            // 使用 setTimeout 延迟执行，让页面先渲染
            setTimeout(() => {
                processContainer(document.body);
            }, 500);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initProcess);
    } else {
        initProcess();
    }

    // 使用 MutationObserver 监听 DOM 变化，处理动态加载的内容
    const observer = new MutationObserver(function (mutations) {
        // 如果正在处理中，忽略观察事件
        if (isProcessing) {
            return;
        }

        // 收集所有新增的节点
        const addedNodes = new Set();

        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                // 只处理元素节点和文本节点
                if (node.nodeType === Node.ELEMENT_NODE) {
                    addedNodes.add(node);
                } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                    addedNodes.add(node.parentElement);
                }
            });
        });

        // 对每个新增的节点进行处理
        addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                debounceProcess(node);
            } else if (node.nodeType === Node.TEXT_NODE) {
                processTextNode(node);
            }
        });
    });

    // 开始观察
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
})();
