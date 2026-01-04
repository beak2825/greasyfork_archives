// ==UserScript==
// @name         Mask Numbers
// @namespace    http://tampermonkey.net/
// @version      2025-09-28
// @description  将页面中所有数字内容替换为****，快捷键ctrl+shift+alt+M触发
// @author       Archimon@zhihu
// @match        https:*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551032/Mask%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/551032/Mask%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 开始替换页面中的数字内容...');

    // 替换文本节点中的数字
    function replaceNumbersInTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // 匹配数字（包括整数、小数、科学计数法）
            const numberRegex = /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/gi;
            if (numberRegex.test(node.textContent)) {
                node.textContent = node.textContent.replace(numberRegex, '****');
            }
        } else {
            // 递归处理子节点
            for (const child of node.childNodes) {
                replaceNumbersInTextNodes(child);
            }
        }
    }

    // 替换属性中的数字
    function replaceNumbersInAttributes(node) {
        const attributes = node.attributes;
        if (attributes) {
            for (const attr of attributes) {
                // 检查属性值是否包含数字
                if (/\d/.test(attr.value)) {
                    // 替换属性值中的数字
                    attr.value = attr.value.replace(/\d+/g, '****');
                }
            }
        }

        // 递归处理子节点
        for (const child of node.children) {
            replaceNumbersInAttributes(child);
        }
    }

    // 初始替换
    function initialReplace() {
        console.log('执行初始数字替换...');
        replaceNumbersInTextNodes(document.body);
        // replaceNumbersInAttributes(document.body);
    }

    // 监听DOM变化，对新添加的内容也进行替换
    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            replaceNumbersInTextNodes(node);
                            // replaceNumbersInAttributes(node);
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('开始监听DOM变化...');
    }

    // 等待页面加载完成后执行
    //if (document.readyState === 'loading') {
    //    document.addEventListener('DOMContentLoaded', () => {
    //        initialReplace();
    //        observeChanges();
    //    });
    //} else {
    //    initialReplace();
    //    observeChanges();
    //}

    // 添加键盘快捷键来重新应用替换（Ctrl+Shift+M）
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'M') {
            e.preventDefault();
            console.log('手动触发数字替换...');
            initialReplace();
        }
    });

    console.log('✅ 数字替换脚本已加载，使用 Ctrl+Shift+M 手动触发替换');
})();
