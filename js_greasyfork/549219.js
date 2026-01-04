// ==UserScript==
// @name         馒头繁转简
// @namespace    http://tampermonkey.net/
// @version      2025.09.15
// @description  使用MutationObserver监听元素变动，处理动态数据的繁体中文内容，并支持标题转换。
// @author       myderr
// @match        https://m-team.cc/*
// @match        https://kp.m-team.cc/*
// @match        https://next.m-team.cc/*
// @match        https://wiki.m-team.cc/*
// @match        https://zp.m-team.io/*
// @match        https://ticket.m-team.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=m-team.cc
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/t2cn.js
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549219/%E9%A6%92%E5%A4%B4%E7%B9%81%E8%BD%AC%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/549219/%E9%A6%92%E5%A4%B4%E7%B9%81%E8%BD%AC%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // 1. 初始化转换器
    // =================================================================================
    const converter = OpenCC.Converter({ from: 'hk', to: 'cn' });
    const convertText = (text) => {
        if (!text || typeof text !== 'string') return text;
        return converter(text);
    };

    // =================================================================================
    // 2. 遍历和转换 DOM 节点的函数
    // =================================================================================
    function traverseAndConvert(node) {
        // 排除一些不需要转换的标签
        if (node.nodeType === 1 && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'TEXTAREA')) {
            return;
        }

        // 如果是文本节点并且包含中文字符，直接转换
        if (node.nodeType === 3 && /[\u4e00-\u9fa5]/.test(node.nodeValue)) {
            const originalText = node.nodeValue;
            const simplifiedText = convertText(originalText);
            if (originalText !== simplifiedText) {
                node.nodeValue = simplifiedText;
            }
        }

        // 如果是元素节点，遍历其所有子节点
        if (node.nodeType === 1) {
            node.childNodes.forEach(traverseAndConvert);
        }
    }

    // =================================================================================
    // 3. DOM 变更监视 (处理 Body 内的动态内容)
    // =================================================================================
    const bodyObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    traverseAndConvert(node);
                });
            }
        }
    });

    // =================================================================================
    // 4. 启动脚本 (核心逻辑)
    // =================================================================================
    window.addEventListener('DOMContentLoaded', () => {
        // --- 针对 Body 的处理 ---
        // 首次转换页面上已有的静态内容
        traverseAndConvert(document.body);
        // 开始监视 Body 未来的变化
        bodyObserver.observe(document.body, { childList: true, subtree: true });

        // --- 【新增】针对 Title 的处理 ---
        const titleElement = document.querySelector('head > title');
        if (titleElement) {
            // 首次转换页面标题
            document.title = convertText(document.title);

            // 创建一个专门监视 title 变化的观察者
            const titleObserver = new MutationObserver(() => {
                const newTitle = document.title;
                const convertedTitle = convertText(newTitle);
                if (newTitle !== convertedTitle) {
                    // 断开观察，防止修改标题触发无限循环
                    titleObserver.disconnect();
                    document.title = convertedTitle;
                    // 修改完毕后，重新开始观察
                    titleObserver.observe(titleElement, { childList: true });
                }
            });

            // 开始观察 title 元素内的子节点（即文本）变化
            titleObserver.observe(titleElement, { childList: true });
        }
    });

})();