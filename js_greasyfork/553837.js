// ==UserScript==
// @name         文字和谐处理脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  替换网页中的敏感词汇为和谐内容
// @author       401
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553837/%E6%96%87%E5%AD%97%E5%92%8C%E8%B0%90%E5%A4%84%E7%90%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553837/%E6%96%87%E5%AD%97%E5%92%8C%E8%B0%90%E5%A4%84%E7%90%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 敏感词列表（键：需要替换的词，值：替换后的内容）
    const sensitiveWords = {
        '满足': '***',
        'b': '###',
        '测试词': '[已和谐]', // 用于测试的词汇
        // 可添加更多词汇
    };

    // 构建替换正则（取消单词边界\b，避免因特殊字符导致漏匹配；保留i忽略大小写）
    const sensitiveKeys = Object.keys(sensitiveWords).map(word =>
        // 转义特殊字符（如.、*、+等），避免正则语法错误
        word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const regexPattern = new RegExp(`(${sensitiveKeys.join('|')})`, 'gi');

    // 替换文本节点函数
    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let originalText = node.textContent;
            if (!originalText) return; // 空文本直接跳过

            // 执行替换
            const replacedText = originalText.replace(regexPattern, match => {
                // 忽略大小写查找对应替换值
                const lowerMatch = match.toLowerCase();
                for (const [word, replacement] of Object.entries(sensitiveWords)) {
                    if (word.toLowerCase() === lowerMatch) {
                        console.log(`替换成功："${match}" → "${replacement}"`); // 调试日志
                        return replacement;
                    }
                }
                return match; // 未匹配到则保持原样
            });

            // 只有内容变化时才更新，避免不必要的DOM操作
            if (replacedText !== originalText) {
                node.textContent = replacedText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 跳过脚本、样式、输入框等特殊标签
            const tagName = node.tagName.toUpperCase();
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(tagName)) {
                return;
            }
            // 递归处理子节点
            Array.from(node.childNodes).forEach(child => replaceText(child));
        }
    }

    // 初始加载时处理页面
    replaceText(document.body);
    console.log('初始内容处理完成');

    // 监听动态内容变化（如AJAX加载、动态生成的内容）
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                    replaceText(node);
                }
            });
        });
    });

    // 启动观察者，监控整个页面的DOM变化
    observer.observe(document.body, {
        childList: true,   // 监控子节点增减
        subtree: true,    // 深入监控所有子树
        characterData: true // 监控文本内容变化
    });

})();