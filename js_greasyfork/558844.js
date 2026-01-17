// ==UserScript==
// @name         豆瓣书名号转搜索链接
// @namespace    http://tampermonkey.net/
// @version      1.2
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
                    // 检查父元素是否已经是链接（但允许处理新展开的内容）
                    const closestLink = parent.closest("a");
                    if (closestLink && closestLink.href && closestLink.href.includes("douban.com/search")) {
                        // 如果已经是我们创建的搜索链接，跳过
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
    function debounceProcess(container, immediate = false) {
        if (immediate) {
            // 立即处理，不使用防抖
            processContainer(container);
            return;
        }
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

    // 处理新增或变化的节点
    function handleNodeChanges(mutations) {
        // 如果正在处理中，忽略观察事件
        if (isProcessing) {
            return;
        }

        // 收集所有需要处理的节点
        const nodesToProcess = new Set();

        mutations.forEach(function (mutation) {
            // 处理新增的节点
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    nodesToProcess.add(node);
                } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                    nodesToProcess.add(node.parentElement);
                }
            });

            // 处理属性变化（只处理可能表示内容展开的 class 变化）
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
                const target = mutation.target;
                // 只处理明确的展开相关 class，避免过度触发
                if (
                    target.classList.contains("expanded") ||
                    target.classList.contains("show-all") ||
                    target.classList.contains("full-content")
                ) {
                    nodesToProcess.add(target);
                    if (target.parentElement) {
                        nodesToProcess.add(target.parentElement);
                    }
                }
            }

            // 处理文本内容变化
            if (mutation.type === "characterData" && mutation.target.parentElement) {
                nodesToProcess.add(mutation.target.parentElement);
            }
        });

        // 对每个需要处理的节点进行处理
        nodesToProcess.forEach((node) => {
            if (node && node.nodeType === Node.ELEMENT_NODE) {
                debounceProcess(node);
            } else if (node && node.nodeType === Node.TEXT_NODE) {
                processTextNode(node);
            }
        });
    }

    // 使用 MutationObserver 监听 DOM 变化，处理动态加载的内容
    const observer = new MutationObserver(function (mutations) {
        handleNodeChanges(mutations);
    });

    // 开始观察
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class"], // 只监听 class 变化（用于检测展开状态）
            characterData: true, // 监听文本内容变化
        });
    }

    // 监听点击事件，处理展开操作
    // 使用更智能的方式：监听点击后立即开始监控容器变化
    document.addEventListener(
        "click",
        function (event) {
            const target = event.target;
            if (!target) return;

            // 快速检查：先检查文本内容（最常见的展开按钮）
            const buttonText = target.textContent?.trim() || "";
            const hasExpandText =
                buttonText.includes("展开") ||
                buttonText.includes("显示全部") ||
                buttonText.includes("查看全部") ||
                buttonText.includes("全文") ||
                buttonText.includes("更多");

            // 如果文本不匹配，再检查 class（避免不必要的 DOM 查询）
            const hasExpandClass =
                !hasExpandText &&
                (target.classList.contains("expand") ||
                    target.classList.contains("toggle") ||
                    target.closest(".expand") ||
                    target.closest(".toggle") ||
                    target.closest("a[href*='expand']") ||
                    target.closest(".more") ||
                    target.closest("[class*='expand']") ||
                    target.closest("[class*='toggle']"));

            if (!hasExpandText && !hasExpandClass) {
                return; // 提前返回，不处理非展开按钮的点击
            }

            // 找到被展开的容器（尝试多种选择器）
            const container =
                target.closest(
                    ".review-item, .comment-item, .review, .comment, [class*='review'], [class*='comment'], [class*='Review'], [class*='Comment'], [id*='review'], [id*='comment']"
                ) ||
                target.parentElement?.parentElement?.parentElement ||
                target.parentElement?.parentElement ||
                target.parentElement;

            if (!container || container === document.body) {
                return; // 如果找不到合适的容器，不处理
            }

            // 记录点击前的容器状态
            const initialHeight = container.offsetHeight;
            const initialTextLength = container.textContent.length;

            // 使用 requestAnimationFrame 快速检测内容变化
            let checkCount = 0;
            const maxChecks = 20; // 减少到20次（约0.33秒），通常足够

            function checkAndProcess() {
                checkCount++;
                const currentHeight = container.offsetHeight;
                const currentTextLength = container.textContent.length;

                // 如果容器高度或文本长度增加了，说明内容已展开
                if (
                    currentHeight > initialHeight ||
                    currentTextLength > initialTextLength ||
                    checkCount >= maxChecks
                ) {
                    // 立即处理
                    debounceProcess(container, true);
                    // 如果内容还在变化且未达到最大次数，继续检查一次
                    if (
                        checkCount < maxChecks &&
                        (currentHeight > initialHeight || currentTextLength > initialTextLength)
                    ) {
                        requestAnimationFrame(checkAndProcess);
                    }
                } else {
                    // 内容还没展开，继续检查
                    requestAnimationFrame(checkAndProcess);
                }
            }

            // 立即开始第一次检查
            requestAnimationFrame(checkAndProcess);
        },
        true // 使用捕获阶段，确保能捕获到事件
    );

})();
