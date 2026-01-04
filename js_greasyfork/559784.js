// ==UserScript==
// @name         Gemini Web Markdown Bold Fixer (Optimized)网页端加粗修复 (性能优化版)
// @name:zh-CN   Gemini 网页端加粗修复 (性能优化版)
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixes Markdown bold rendering issues on Google Gemini Web with performance improvements
// @description:zh-CN 修复 Gemini 网页端 Markdown 加粗渲染问题，已优化性能避免卡顿
// @author       You
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559784/Gemini%20Web%20Markdown%20Bold%20Fixer%20%28Optimized%29%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%8A%A0%E7%B2%97%E4%BF%AE%E5%A4%8D%20%28%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559784/Gemini%20Web%20Markdown%20Bold%20Fixer%20%28Optimized%29%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%8A%A0%E7%B2%97%E4%BF%AE%E5%A4%8D%20%28%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        containerSelector: 'message-content',
        paragraphSelector: 'p',
        fixedTag: 'strong',
        debounceTime: 200 // 防抖时间(ms)，越大越流畅，但修复会有轻微延迟
    };

    // --- Trusted Types 策略 ---
    let htmlPolicy;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            htmlPolicy = window.trustedTypes.createPolicy('gemini-fixer-policy', {
                createHTML: (string) => string
            });
        } catch (e) {
            // Policy already exists
        }
    }

    function setSafeHTML(element, htmlString) {
        if (htmlPolicy) {
            element.innerHTML = htmlPolicy.createHTML(htmlString);
        } else {
            element.innerHTML = htmlString;
        }
    }

    // 预编译正则，提升性能
    const REGEX_CODE_BLOCK = /<code\b[^>]*>[\s\S]*?<\/code>/gi;
    const REGEX_BOLD_TAG = /<b\b[^>]*>([\s\S]*?)<\/b>/gi;
    const REGEX_MD_BOLD = /\*\*([\s\S]+?)\*\*/g;
    const REGEX_PLACEHOLDER = /###GEMINI_FIXER_CODE_(\d+)###/g;

    function fixMarkdownRendering() {
        // 1. 获取所有段落
        const paragraphs = document.querySelectorAll(`${CONFIG.containerSelector} ${CONFIG.paragraphSelector}`);

        paragraphs.forEach(p => {
            const currentHtml = p.innerHTML;

            // --- 性能优化核心 ---
            // 检查标记：如果该段落已经被处理过，且长度没有变化，说明是静态内容，直接跳过
            // 这避免了对历史对话的重复计算
            if (p.dataset.fixerHash === String(currentHtml.length)) {
                return;
            }

            // 快速检查：如果既没有 <b> 也没有 **，肯定不需要修复，标记并跳过
            if (!currentHtml.includes('<b') && !currentHtml.includes('**')) {
                p.dataset.fixerHash = String(currentHtml.length);
                return;
            }

            // --- 核心处理逻辑 ---

            // 步骤 1: 保护 Code 块
            const codeBlocks = [];
            let protectedHtml = currentHtml.replace(REGEX_CODE_BLOCK, (match) => {
                codeBlocks.push(match);
                return `###GEMINI_FIXER_CODE_${codeBlocks.length - 1}###`;
            });

            // 步骤 2: 将 <b> 统一转为 ** (标准化)
            let processedHtml = protectedHtml.replace(REGEX_BOLD_TAG, "**$1**");

            // 步骤 3: 将 ** 转为 <strong>
            let hasChanges = false;
            processedHtml = processedHtml.replace(REGEX_MD_BOLD, (match, content) => {
                hasChanges = true;
                return `<${CONFIG.fixedTag}>${content}</${CONFIG.fixedTag}>`;
            });

            // 只有当真正发生了 "** -> strong" 的替换时，才进行后续操作
            // 避免无关的重绘
            if (hasChanges) {
                // 步骤 4: 恢复 Code 块
                const finalHtml = processedHtml.replace(REGEX_PLACEHOLDER, (match, index) => {
                    return codeBlocks[index];
                });

                // 更新 DOM
                if (currentHtml !== finalHtml) {
                    setSafeHTML(p, finalHtml);
                }
            }

            // 更新 hash 标记，表示该状态已处理
            // 注意：重新获取 p.innerHTML 的长度，因为内容可能变了
            p.dataset.fixerHash = String(p.innerHTML.length);
        });
    }

    // --- 防抖机制 (Debounce) ---
    // 只有当 DOM 停止变化一定时间后，才执行处理函数
    let timeoutId = null;
    const observer = new MutationObserver((mutations) => {
        // 简单检查 mutation 类型，如果只是属性变化且是我们自己加的 hash，则忽略
        // 防止无限循环
        let needsUpdate = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || 
               (mutation.type === 'characterData') ||
               (mutation.type === 'attributes' && mutation.attributeName !== 'data-fixer-hash')) {
                needsUpdate = true;
                break;
            }
        }

        if (needsUpdate) {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fixMarkdownRendering();
                timeoutId = null;
            }, CONFIG.debounceTime);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true, // 监听属性变化以处理某些动态类名
        attributeFilter: ['class'], // 但只关心 class 变化
        characterData: true // 监听文本内容变化
    });

    // 初始执行一次
    setTimeout(fixMarkdownRendering, 1000);

})();