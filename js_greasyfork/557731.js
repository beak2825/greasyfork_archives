// ==UserScript==
// @name         知乎去除内容下划线
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除知乎答案的下划线
// @match        *://*.zhihu.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557731/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%86%85%E5%AE%B9%E4%B8%8B%E5%88%92%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/557731/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%86%85%E5%AE%B9%E4%B8%8B%E5%88%92%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 核心处理函数：替换目标元素为其子节点
     */
    function processHighlightElements() {
        // 查找所有目标元素：带 highlight-wrap 类 或 带 data-highlight-id 属性
        const targetElements = document.querySelectorAll(
            '.highlight-wrap, [data-highlight-id]'
        );

        targetElements.forEach(element => {
            // 保存父节点和下一个兄弟节点（用于插入位置）
            const parent = element.parentNode;
            const nextSibling = element.nextSibling;

            // 把所有子节点移动到父节点中（保留内容结构）
            while (element.firstChild) {
                parent.insertBefore(element.firstChild, nextSibling);
            }

            // 移除原来的包裹元素
            parent.removeChild(element);
        });
    }

    // 1. 页面初始加载完成后，先处理一次静态内容
    processHighlightElements();

    // 2. 监听动态加载内容，处理知乎的异步渲染
    const observer = new MutationObserver((mutations) => {
        // 标记是否需要处理（避免重复执行）
        let needProcess = false;

        // 检查所有变动节点
        mutations.forEach(mutation => {
            // 新增节点或节点属性变化时，可能出现目标元素
            if (mutation.addedNodes.length > 0 || mutation.attributeName) {
                needProcess = true;
            }
        });

        if (needProcess) {
            processHighlightElements();
        }
    });

    // 配置监听选项：监听整个文档的子节点变化和属性变化
    observer.observe(document.body, {
        childList: true,        // 监听子节点增减
        attributes: true,       // 监听属性变化（防止动态添加 data-highlight-id）
        subtree: true,          // 深度监听所有子树
        attributeFilter: ['data-highlight-id'] // 只监听目标属性变化（优化性能）
    });

    // 可选：页面卸载时停止监听（避免内存泄漏）
    window.addEventListener('unload', () => {
        observer.disconnect();
    });
})();