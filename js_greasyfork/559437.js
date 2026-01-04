// ==UserScript==
// @name         去他妈的 Coursera 反 AI Prompt
// @name:en      Fuck Coursera Anti-AI Prompt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 Coursera 页面渲染初期强行拦截并删除 AI 注入文本，防止 AI 辅助插件失效。
// @description:en Automatically removes the hidden AI-prevention text injection found on Coursera.
// @author       David
// @match        *://*.coursera.org/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559437/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%20Coursera%20%E5%8F%8D%20AI%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/559437/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%20Coursera%20%E5%8F%8D%20AI%20Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🛡️ Coursera 防护移除脚本已启动');

    // 1. 极速策略：注入 CSS 样式，强制隐藏相关元素 (防止脚本删除慢了被 AI 瞥见)
    // 许多 AI 插件会忽略 display:none 的元素，这是一个很好的双重保险
    const style = document.createElement('style');
    style.innerHTML = `
        [data-ai-instructions="true"],
        [data-testid="content-integrity-instructions"] {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    // 2. 核弹策略：使用 MutationObserver 监控每一个插入的节点，发现立即删除
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    // 检查节点本身
                    if (node.nodeType === 1) { // 元素节点
                        checkAndRemove(node);
                        // 检查子节点（防止藏在深层结构里）
                        const badKids = node.querySelectorAll ? node.querySelectorAll('[data-ai-instructions="true"], [data-testid="content-integrity-instructions"]') : [];
                        badKids.forEach(kid => kid.remove());
                    }
                });
            }
        });
    });

    function checkAndRemove(node) {
        if (node.matches && (node.matches('[data-ai-instructions="true"]') || node.matches('[data-testid="content-integrity-instructions"]'))) {
            node.remove();
            console.log('💀 已秒杀一个 AI 注入节点');
        }
    }

    // 从根节点开始监控
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 3. 清理策略：页面加载完成后再扫荡一遍，防止漏网之鱼
    window.addEventListener('load', () => {
        const leftovers = document.querySelectorAll('[data-ai-instructions="true"], [data-testid="content-integrity-instructions"]');
        leftovers.forEach(el => el.remove());
    });

})();