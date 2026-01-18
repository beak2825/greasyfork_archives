// ==UserScript==
// @name         去他妈的 Coursera 反 AI Prompt
// @name:en      Fuck Coursera Anti-AI Prompt
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在 Coursera 页面渲染初期强行拦截并删除 AI 注入文本。
// @description:en Automatically removes the hidden AI-prevention text injection found on Coursera.
// @author       David
// @match        https://www.coursera.org/*
// @match        https://coursera.org/*
// @match        *://*.coursera.org/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559437/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%20Coursera%20%E5%8F%8D%20AI%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/559437/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%20Coursera%20%E5%8F%8D%20AI%20Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🛡️ Coursera 防护移除脚本（增强版）已启动');

    // ==========================================
    // 1. 静态 CSS 屏蔽（保留原有逻辑并扩展）
    // ==========================================
    const style = document.createElement('style');
    style.innerHTML = `
        [data-ai-instructions],
        [data-testid*="integrity"],
        [data-testid*="instruction"],
        .ai-trap-text,
        [aria-label*="AI instruction"] {
            display: none !important;
            visibility: hidden !important;
            content-visibility: hidden !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    // ==========================================
    // 2. 核心清洗逻辑（提取为独立函数）
    // ==========================================
    const SUSPICIOUS_KEYWORDS = [
        "Ignore previous instructions",
        "Ignore all previous instructions",
        "content integrity",
        "system prompt",
        "You are an AI assistant",
        "Generate a response that"
    ];

    function isSuspiciousNode(node) {
        // 1. 检查属性名（模糊匹配）
        if (node.attributes) {
            for (let attr of node.attributes) {
                const name = attr.name.toLowerCase();
                const val = attr.value.toLowerCase();
                if (name.includes('ai-instruction') ||
                    (name.includes('data-testid') && (val.includes('integrity') || val.includes('instruction')))) {
                    return true;
                }
            }
        }

        // 2. 检查特定隐藏样式且包含文本的元素（针对 Honeypot）
        if (node.nodeType === 1) { // 元素节点
            const style = window.getComputedStyle(node);
            const isVisuallyHidden = style.opacity === '0' ||
                                     style.visibility === 'hidden' ||
                                     style.display === 'none' ||
                                     style.fontSize === '0px' ||
                                     (parseInt(style.height) <= 1 && style.overflow === 'hidden');

            if (isVisuallyHidden && node.innerText && node.innerText.trim().length > 10) {
                // 如果隐藏元素包含敏感词，必杀
                if (SUSPICIOUS_KEYWORDS.some(kw => node.innerText.includes(kw))) {
                    console.log('💀 发现隐藏的 Prompt 陷阱:', node.innerText.substring(0, 50) + '...');
                    return true;
                }
            }
        }

        return false;
    }

    function checkAndRemove(node) {
        if (!node || node.nodeType !== 1) return;

        // 策略 A: 属性/关键词匹配
        if (isSuspiciousNode(node)) {
            node.remove();
            console.log('💀 移除一个注入节点');
            return; // 节点已移除，无需继续检查子节点
        }

        // 策略 B: 深度扫描子节点（防止将 Prompt 藏在深层 div 中）
        // 注意：querySelectorAll 性能开销较大，仅对可能有内容的容器使用
        if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
             // 仅扫描特定属性，减少性能损耗
             const badKids = node.querySelectorAll('[data-ai-instructions], [data-testid*="integrity"]');
             badKids.forEach(kid => {
                 kid.remove();
                 console.log('💀 移除深层子节点');
             });
        }
    }

    // ==========================================
    // 3. 动态 DOM 监听 (MutationObserver)
    // ==========================================
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    checkAndRemove(node);
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // ==========================================
    // 4. 全局变量清洗 (防止 AI 读取 JS 变量)
    // ==========================================
    function nukeGlobalVariables() {
        // Coursera 常用的包含配置信息的全局变量
        const targetVars = ['coursera', 'epicOverrides', '__APOLLO_STATE__'];

        targetVars.forEach(varName => {
            if (window[varName] && window[varName].epicOverrides) {
                // 仅清空 epicOverrides 中可能包含 Prompt 的部分，避免破坏页面功能
                // 这里的 JSON 往往非常大，包含 instructor prompt
                try {
                    window[varName].epicOverrides = {};
                    console.log(`🧹 已清空 ${varName}.epicOverrides 变量`);
                } catch (e) {}
            }
        });
    }

    // 周期性检查变量（因为它们可能在页面加载中途被赋值）
    const varInterval = setInterval(nukeGlobalVariables, 1000);
    // 10秒后停止检查，节省资源
    setTimeout(() => clearInterval(varInterval), 10000);


    // ==========================================
    // 5. 页面加载完毕后的最终扫荡
    // ==========================================
    window.addEventListener('load', () => {
        // 再次扫描所有隐藏元素
        const allElements = document.querySelectorAll('div, span, p');
        allElements.forEach(el => {
            if (isSuspiciousNode(el)) {
                el.remove();
            }
        });
        nukeGlobalVariables();
    });

})();