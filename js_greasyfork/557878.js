// ==UserScript==
// @name         Gemini Web Markdown Bold Fixer
// @name:zh-CN   Gemini 网页端加粗修复
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fixes Markdown bold rendering issues on Google Gemini Web
// @description:zh-CN  修复 Gemini 网页端 Markdown 加粗渲染问题
// @author       You
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557878/Gemini%20Web%20Markdown%20Bold%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/557878/Gemini%20Web%20Markdown%20Bold%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        containerSelector: 'message-content',
        paragraphSelector: 'p',
        fixedTag: 'strong'
    };

    // --- Trusted Types 策略 (必须保留，否则报错) ---
    let htmlPolicy;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            htmlPolicy = window.trustedTypes.createPolicy('gemini-fixer-policy', {
                createHTML: (string) => string
            });
        } catch (e) {
            console.warn('Policy creation failed, possibly already exists:', e);
        }
    }

    function setSafeHTML(element, htmlString) {
        if (htmlPolicy) {
            element.innerHTML = htmlPolicy.createHTML(htmlString);
        } else {
            element.innerHTML = htmlString;
        }
    }

    function fixMarkdownRendering() {
        // 1. 扩大搜索范围：查找所有位于 message-content 下的 p 标签
        // 不再预先筛选 b 标签，因为可能只有 ** 而没有 b
        const paragraphs = document.querySelectorAll(`${CONFIG.containerSelector} ${CONFIG.paragraphSelector}`);

        paragraphs.forEach(p => {
            let html = p.innerHTML;

            // 性能优化：如果既没有 <b> 也没有 **，直接跳过
            // 注意：这里简单检查 '**' 字符串，不使用正则以节省性能
            if (!html.includes('<b') && !html.includes('**')) return;

            // --- 步骤 1: 保护 <code> 标签内容 ---
            // 我们用一个数组暂存代码块，原位置放占位符
            const codeBlocks = [];
            // 正则：匹配 <code 及其属性 ... > 内容 </code>
            // [\s\S]*? 非贪婪匹配中间所有字符
            const protectedHtml = html.replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi, (match) => {
                codeBlocks.push(match);
                return `###GEMINI_FIXER_CODE_${codeBlocks.length - 1}###`;
            });

            // 如果替换后内容没变，且没有需要处理的加粗标记，也可以提前结束（视情况）

            // --- 步骤 2: 将 <b>text</b> 统一还原为 **text** ---
            // 此时 protectedHtml 中的 code 内容已被挖走，不会误伤
            let processedHtml = protectedHtml.replace(/<b\b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**");

            // --- 步骤 3: 将 **text** 渲染为 <strong>text</strong> ---
            // 正则：匹配成对的 **
            processedHtml = processedHtml.replace(/\*\*([\s\S]+?)\*\*/g, `<${CONFIG.fixedTag}>$1</${CONFIG.fixedTag}>`);

            // --- 步骤 4: 恢复 <code> 标签内容 ---
            const finalHtml = processedHtml.replace(/###GEMINI_FIXER_CODE_(\d+)###/g, (match, index) => {
                return codeBlocks[index]; // 还原对应的代码块
            });

            // 只有当内容发生实质变化时才更新 DOM
            if (html !== finalHtml) {
                setSafeHTML(p, finalHtml);
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        fixMarkdownRendering();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    fixMarkdownRendering();

})();