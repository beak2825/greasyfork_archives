// ==UserScript==
// @name         Imgur圖片使用duckduckgo代理
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  使用proxy.duckduckgo.com 代理重定向 Imgur 圖片，並防止頁面重新聚焦時 src 被還原
// @author       shanlan
// @match        *://*/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @downloadURL https://update.greasyfork.org/scripts/551411/Imgur%E5%9C%96%E7%89%87%E4%BD%BF%E7%94%A8duckduckgo%E4%BB%A3%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/551411/Imgur%E5%9C%96%E7%89%87%E4%BD%BF%E7%94%A8duckduckgo%E4%BB%A3%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                const node = mutation.target;
                if (node.nodeName === 'IMG') {
                    redirectImg(node);
                }
            }
            for (const node of mutation.addedNodes) {
                walk(node);
            }
        }
    });

    function walk(root) {
        if (!root.ownerDocument) return;

        const walker = root.ownerDocument.createNodeIterator(
            root,
            NodeFilter.SHOW_ELEMENT,
            (node) => {
                if (node.nodeName === 'IMG') return NodeFilter.FILTER_ACCEPT;
                if (node.nodeType === Node.ELEMENT_NODE && node.shadowRoot) return NodeFilter.FILTER_ACCEPT;
                if (node.nodeName === 'STYLE' || node.nodeName === 'SCRIPT') return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_SKIP;
            }
        );

        let node;
        while ((node = walker.nextNode())) {
            if (node.shadowRoot) {
                for (const child of node.shadowRoot.children) {
                    if (child.nodeName !== 'STYLE' && child.nodeName !== 'SCRIPT') {
                        walk(child);
                    }
                }
                observer.observe(node.shadowRoot, observerConfig);
                continue;
            }

            if (node.nodeName === 'IMG') {
                redirectImg(node);
            }
        }
    }

    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
    };

    const redirectImg = (elem) => {
        const src = elem.src;
        if (src.startsWith('https://proxy.duckduckgo.com/iu/?u=')) return;

        if (/https?:\/\/(\w+\.)?imgur\.com\/(\w*)+(\.[a-zA-Z]{3,4})/.test(src)) {
            elem.src = 'https://proxy.duckduckgo.com/iu/?u=' + encodeURIComponent(src);
        }
    };

    walk(document.body);
    observer.observe(document.body, observerConfig);
})();