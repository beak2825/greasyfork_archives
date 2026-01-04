// ==UserScript==
// @name         知乎实体词链接转文本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将知乎文章/回答中带图标的“实体词”链接（如“管培生”）转换为普通文本，并持续监听动态加载的内容。
// @author       Gemini
// @match        https://www.zhihu.com/*
// @grant        none
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553662/%E7%9F%A5%E4%B9%8E%E5%AE%9E%E4%BD%93%E8%AF%8D%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553662/%E7%9F%A5%E4%B9%8E%E5%AE%9E%E4%BD%93%E8%AF%8D%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 核心处理函数
     * 接收一个 <a> 元素列表，将其父 <span> 替换为纯文本
     * @param {NodeListOf<Element>} links - 查找到的 <a> 元素列表
     */
    function processEntityLinks(links) {
        if (!links || links.length === 0) {
            return;
        }

        links.forEach(anchorElement => {
            // 查找父级 <span> 元素
            const spanElement = anchorElement.parentElement;

            // 验证结构是否为：<span><a ...>TEXT<svg>...</a></span>
            if (spanElement && spanElement.tagName === 'SPAN' &&
                anchorElement.classList.contains('RichContent-EntityWord') &&
                anchorElement.firstChild && anchorElement.firstChild.nodeType === Node.TEXT_NODE) {

                // 获取 <a> 标签内的第一个文本节点（即 "管培生"）
                const text = anchorElement.firstChild.nodeValue;

                // 创建一个新的纯文本节点
                const textNode = document.createTextNode(text);

                // 用这个纯文本节点 替换 整个 <span> 标签
                if (spanElement.parentNode) {
                    spanElement.parentNode.replaceChild(textNode, spanElement);
                }
            }
        });
    }

    /**
     * 扫描整个文档，处理所有已存在的实体词
     */
    function initialScan() {
        const existingLinks = document.querySelectorAll('a.RichContent-EntityWord');
        processEntityLinks(existingLinks);
    }

    // --- 监听 DOM 变化 ---

    // 1. 创建一个 MutationObserver 实例
    const observer = new MutationObserver(mutations => {
        // 遍历所有发生的DOM变化
        mutations.forEach(mutation => {
            // 检查是否有新节点被添加到 DOM 中
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // 我们只关心元素节点
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 在新添加的节点内部查找匹配的链接
                        const newLinks = node.querySelectorAll('a.RichContent-EntityWord');
                        if (newLinks.length > 0) {
                            processEntityLinks(newLinks);
                        }
                    }
                });
            }
        });
    });

    // 2. 配置观察器：观察 body 及其所有子树，只关心子节点的增删
    const config = {
        childList: true,
        subtree: true
    };

    // 3. 启动观察器
    // @run-at document-body 保证了 body 此时一定存在
    observer.observe(document.body, config);

    // 4. 立即执行一次初始扫描
    // 处理在脚本运行前已经加载好的内容
    initialScan();

})();