// ==UserScript==
// @name         1024magnet_highlight
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  在当前页面自动高亮指定的关键字列表，纯原生JS实现
// @author       You
// @match        *://*/thread0806*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557872/1024magnet_highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/557872/1024magnet_highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================

    // 1. 在这里定义你想高亮的关键字列表
    const keywordList = [
        "内射","无套","大胸","巨乳","大奶","D奶","D胸","D杯","流出","白浆","丰满","熟","丰乳","女上","上位","骑乘"
    ];

    // 2. 定义高亮的样式 (CSS)
    const highlightStyle = "background-color: #FFFF00; color: red; font-weight: bold; padding: 2px; border-radius: 2px;";

    // ===========================================

    // 主逻辑函数
    function highlightKeywords() {
        if (keywordList.length === 0) return;

        // 转义正则特殊字符 (防止关键字包含 . ? * 等导致报错)
        const safeKeywords = keywordList.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

        // 创建正则，'g' 全局匹配，'i' 忽略大小写
        const regex = new RegExp(`(${safeKeywords.join('|')})`, 'gi');

        // 使用 TreeWalker 遍历 DOM 中的所有文本节点
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToReplace = [];

        // 遍历并筛选需要处理的节点
        while (walker.nextNode()) {
            const node = walker.currentNode;

            // 跳过无需高亮的父级标签 (如脚本、样式、输入框)
            const parentTag = node.parentNode.tagName;
            const skipTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT', 'CODE', 'PRE'];

            if (skipTags.includes(parentTag)) continue;

            // 跳过仅包含空白的节点
            if (!node.nodeValue.trim()) continue;

            // 如果节点包含关键字
            if (regex.test(node.nodeValue)) {
                nodesToReplace.push(node);
            }
        }

        // 执行替换 (必须在遍历结束后进行，否则会打乱 TreeWalker)
        nodesToReplace.forEach(node => {
            const span = document.createElement('span');
            // 将文本替换为带有样式的 HTML
            // 注意：这里简单使用 innerHTML，如果原文本包含 < > 等符号可能会有渲染差异，通常情况下是安全的
            span.innerHTML = node.nodeValue.replace(regex, `<span style="${highlightStyle}">$1</span>`);

            // 用新的 span 替换旧的文本节点
            node.parentNode.replaceChild(span, node);
        });
    }

    // 页面加载完成后执行
    highlightKeywords();

    // 可选：如果你浏览的是动态加载内容的网页(如单页应用)，可以取消下面注释来监听变化
    /*
    const observer = new MutationObserver(() => {
        // 使用防抖或简单限制，防止过于频繁执行
        // 这里只是简单演示，实际建议加上防抖逻辑
        highlightKeywords();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    */

})();