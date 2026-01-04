// ==UserScript==
// @name         NLP Part-of-Speech Highlighter (Structure-Preserving)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Highlights parts of speech while preserving the original HTML structure. Works on dynamic sites.
// @author       You
// @match        *://*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/compromise@14.14.4/builds/compromise.min.js
// @downloadURL https://update.greasyfork.org/scripts/549024/NLP%20Part-of-Speech%20Highlighter%20%28Structure-Preserving%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549024/NLP%20Part-of-Speech%20Highlighter%20%28Structure-Preserving%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof window.nlp === 'undefined') {
        console.error("❌ CRITICAL: compromise.js library failed to load.");
        return;
    }
    console.log("🚀 NLP Highlighter 脚本启动 (v3.0 - Structure-Preserving)");

    // 注入 CSS 样式 (保持不变)
    const style = document.createElement('style');
    style.textContent = `
        /* ... 你的 CSS 样式 ... */
        .tag-Noun { color: #007bff; font-weight: bold; }
        .tag-Verb { color: #28a745; }
        .tag-Adjective { color: #dc3545; }
        .tag-Adverb { color: #6f42c1; }
        .tag-Determiner { color: #fd7e14; }
        .tag-Preposition { color: #20c997; }
        .tag-Conjunction { color: #6c757d; }
        .tag-Value { color: #ffc107; }
        .tag-Pronoun { color: #17a2b8; }
        .tag-QuestionWord { border-bottom: 2px dotted #e83e8c; }
        .tag-Other { color: inherit; }
    `;
    document.head.appendChild(style);

    function processNode(node) {
    if (node.dataset.nlpProcessed === 'true') return;

    // 使用 .textContent 获取纯文本
    const text = node.textContent;

    if (!text || text.trim() === '') {
        node.dataset.nlpProcessed = 'true';
        return;
    }

    try {
        // 【最终修正】明确请求 offset 数据！
        const termData = window.nlp(text).terms().json({ offset: true });

        // 安全检查：如果 compromise 无法解析，则直接跳过
        if (!termData || termData.length === 0) {
            node.dataset.nlpProcessed = 'true';
            return;
        }

        let resultHTML = "";
        let lastIndex = 0;

        termData.forEach(dataItem => {
            const termInfo = dataItem.terms[0];
            // 现在 termInfo.offset 应该存在了
            if (!termInfo || !termInfo.offset) return;

            const { offset, tags = [] } = termInfo;
            const { start, length } = offset;

            // 从原始文本中提取单词，并转义HTML特殊字符
            const word = text.substr(start, length)
                           .replace(/&/g, '&amp;')
                           .replace(/</g, '&lt;')
                           .replace(/>/g, '&gt;');

            // 添加单词前的所有内容（空格、标点等），并转义
            resultHTML += text.slice(lastIndex, start)
                              .replace(/&/g, '&amp;')
                              .replace(/</g, '&lt;')
                              .replace(/>/g, '&gt;');

            // 添加带词性标签的 span
            const mainTag = tags[0] || 'Other';
            resultHTML += `<span class="tag-${mainTag}" title="Tags: ${tags.join(', ')}">${word}</span>`;
            lastIndex = start + length;
        });

        // 添加最后一个单词到结尾的所有内容，并转义
        resultHTML += text.slice(lastIndex)
                          .replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;');

        node.innerHTML = resultHTML;
        node.dataset.nlpProcessed = 'true';

    } catch (error) {
        console.error("❌ Error processing node:", node, error);
        node.dataset.nlpProcessed = 'true'; // 标记以避免因错误而无限重试
    }
}
    // 【关键改动】使用 TreeWalker 精确查找文本节点
    function scanAndProcess(rootNode) {
        // 创建一个 TreeWalker 来遍历 rootNode 下的所有 TEXT_NODE (文本节点)
        const treeWalker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 过滤掉 SCRIPT 和 STYLE 标签内的文本
                    if (node.parentElement.tagName === 'SCRIPT' || node.parentElement.tagName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 过滤掉纯空白的文本节点
                    if (!/\S/.test(node.nodeValue)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        let node;
        const nodesToProcess = new Set();
        // 遍历所有符合条件的文本节点
        while (node = treeWalker.nextNode()) {
            // 我们不直接处理文本节点，而是处理它们的父元素
            // 使用 Set 可以自动去重，避免多次处理同一个父元素
            nodesToProcess.add(node.parentElement);
        }

        // 现在，我们有了一个包含所有“叶子节点”的集合
        nodesToProcess.forEach(processNode);
    }

    // --- 启动逻辑 ---
    // 使用 MutationObserver 监视动态内容
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 只处理元素节点
                        scanAndProcess(node);
                    }
                });
            }
        }
    });

    // 1. 初始扫描
    console.log("🔍 正在进行初始页面扫描...");
    scanAndProcess(document.body);
    console.log("✅ 初始扫描完成。");

    // 2. 启动监视
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("👀 已启动 MutationObserver，监视页面动态变化。");

})();