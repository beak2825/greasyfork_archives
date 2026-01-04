// ==UserScript==
// @name         更好的网页文本链接转换器
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  动态识别网页文本中的真实URL，转换为浅蓝色可点击字符链接，精准过滤伪链接，支持动态内容加载
// @author       粥
// @match        *://*/*
// @grant        
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560517/%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560517/%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlRegex = /\b(?:(?:https?|ftp):\/\/(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\:[0-9]{1,5})?(?:\/[^\s<>]*)?)|(?:www\.(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\/[^\s<>]*)?))\b/gi;

    const style = document.createElement('style');
    style.innerHTML = `
        .gm-linkified {
            color: #66B2FF !important;
            text-decoration: none !important;
            background: none !important;
            border: none !important;
            font-weight: normal !important;
            padding: 0 !important;
            margin: 0 !important;
            cursor: pointer !important;
            transition: color 0.2s !important;
        }
        .gm-linkified:hover {
            color: #3399FF !important;
        }
    `;
    document.head.appendChild(style);

    function linkifyNode(node) {
        if (!node.textContent || !urlRegex.test(node.textContent)) return;
        
        const ignoreTags = ['A', 'SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'INPUT', 'NOSCRIPT'];
        if (node.parentElement?.closest(ignoreTags.join(','))) return;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        urlRegex.lastIndex = 0;

        while ((match = urlRegex.exec(node.textContent)) !== null) {
            fragment.appendChild(document.createTextNode(node.textContent.substring(lastIndex, match.index)));
            
            const url = match[0];
            const link = document.createElement('a');
            link.href = url.startsWith('www.') ? 'http://' + url : url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'gm-linkified';
            link.textContent = url;
            
            fragment.appendChild(link);
            lastIndex = match.index + match[0].length;
        }

        fragment.appendChild(document.createTextNode(node.textContent.substring(lastIndex)));
        
        if (node.parentNode) {
            node.parentNode.replaceChild(fragment, node);
        }
    }

    function walk(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: node => 
                node.parentElement?.closest('A,SCRIPT,STYLE,CODE') 
                    ? NodeFilter.FILTER_REJECT 
                    : NodeFilter.FILTER_ACCEPT
        });

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(linkifyNode);
    }

    walk(document.body);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) walk(node);
                else if (node.nodeType === 3) linkifyNode(node);
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();