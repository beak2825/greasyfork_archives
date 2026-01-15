// ==UserScript==
// @name         网页文本替换工具
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  可以批量替换你的网页上文本
// @author       You
// @match        https://javaguide.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishpi.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562494/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/562494/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 替换规则配置 - 用户可以修改这里
    const replaceRules = [
        { from: '战斗', to: '蘸豆' }
    ];

    // 递归替换文本节点
    function replaceTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            replaceRules.forEach(rule => {
                const regex = new RegExp(rule.from, 'g');
                text = text.replace(regex, rule.to);
            });
            node.textContent = text;
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
            // 替换常见文本属性
            const textAttributes = ['aria-label', 'title', 'placeholder', 'alt', 'value'];
            textAttributes.forEach(attr => {
                if (node.hasAttribute(attr)) {
                    let value = node.getAttribute(attr);
                    replaceRules.forEach(rule => {
                        const regex = new RegExp(rule.from, 'g');
                        value = value.replace(regex, rule.to);
                    });
                    node.setAttribute(attr, value);
                }
            });
            for (const child of node.childNodes) {
                replaceTextNodes(child);
            }
        }
    }

    // 替换网页标题
    function replaceTitle() {
        let title = document.title;
        replaceRules.forEach(rule => {
            const regex = new RegExp(rule.from, 'g');
            title = title.replace(regex, rule.to);
        });
        document.title = title;
    }

    // 初始替换
    replaceTextNodes(document.body);
    replaceTitle();

    // 延迟替换，确保所有内容加载完成
    setTimeout(() => {
        replaceTextNodes(document.body);
    }, 1000);

    // 监听DOM变化，动态替换新内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    replaceTextNodes(node);
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();