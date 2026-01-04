// ==UserScript==
// @name         NexusMods: Force Links to Open in New Tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制 NexusMods 所有链接在新标签页打开
// @match        https://www.nexusmods.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549478/NexusMods%3A%20Force%20Links%20to%20Open%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/549478/NexusMods%3A%20Force%20Links%20to%20Open%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function forceLinksNewTab(root=document) {
        const links = root.querySelectorAll('a[href]');
        for (const a of links) {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer'); // 安全最佳实践
        }
    }

    // 初始化处理页面已有链接
    forceLinksNewTab();

    // 监听后续 DOM 变化，处理动态生成的链接
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) { // element
                    if (node.matches?.('a[href]')) {
                        node.setAttribute('target', '_blank');
                        node.setAttribute('rel', 'noopener noreferrer');
                    }
                    // 如果新增的是一个容器，里面可能有多个 a
                    forceLinksNewTab(node);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
