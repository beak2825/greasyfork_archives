// ==UserScript==
// @name         一键中英翻译切换器（网页整页翻译）- 高速无残留版
// @namespace    http://tampermonkey.net/1554493
// @version      1.2
// @description  点击按钮将当前网页所有英文翻译成简体中文（高速、无残留分隔符）
// @author       飞翔的荷兰人269
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT  
// @downloadURL https://update.greasyfork.org/scripts/560927/%E4%B8%80%E9%94%AE%E4%B8%AD%E8%8B%B1%E7%BF%BB%E8%AF%91%E5%88%87%E6%8D%A2%E5%99%A8%EF%BC%88%E7%BD%91%E9%A1%B5%E6%95%B4%E9%A1%B5%E7%BF%BB%E8%AF%91%EF%BC%89-%20%E9%AB%98%E9%80%9F%E6%97%A0%E6%AE%8B%E7%95%99%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/560927/%E4%B8%80%E9%94%AE%E4%B8%AD%E8%8B%B1%E7%BF%BB%E8%AF%91%E5%88%87%E6%8D%A2%E5%99%A8%EF%BC%88%E7%BD%91%E9%A1%B5%E6%95%B4%E9%A1%B5%E7%BF%BB%E8%AF%91%EF%BC%89-%20%E9%AB%98%E9%80%9F%E6%97%A0%E6%AE%8B%E7%95%99%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isTranslated = false;
    let originalTexts = new Map();

    // 创建按钮（左下角）
    let button = document.createElement('button');
    button.innerText = '翻译为中文';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.left = '20px';
    button.style.zIndex = '999999';
    button.style.padding = '12px 18px';
    button.style.backgroundColor = '#4285f4';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '15px';
    button.style.fontWeight = 'bold';
    button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    button.style.transition = 'all 0.3s';
    document.body.appendChild(button);

    // Google 翻译 API
    async function translateText(text) {
        if (!text || !/[a-zA-Z]/.test(text)) return text;
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            return data[0].map(item => item[0]).join('');
        } catch (e) {
            console.error('翻译失败:', e);
            return text;
        }
    }

    // 判断节点是否需要翻译
    function shouldTranslate(node) {
        if (!node.parentElement) return false;
        const tag = node.parentElement.tagName;
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'HEADER', 'NAV', 'FOOTER'].includes(tag)) return false;
        const className = node.parentElement.className.toLowerCase();
        if (className.includes('menu') || className.includes('nav') || className.includes('header') || className.includes('footer')) return false;
        return true;
    }

    // 翻译整个页面（修复分隔符问题）
    async function translatePage() {
        const textsToTranslate = []; // {node, original: text, trimmed}

        function walk(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                const trimmed = text.trim();
                if (trimmed && /[a-zA-Z]/.test(trimmed) && shouldTranslate(node)) {
                    textsToTranslate.push({node, original: text, trimmed});
                    if (!originalTexts.has(node)) {
                        originalTexts.set(node, text);
                    }
                }
            } else {
                for (let child of node.childNodes) walk(child);
            }
        }
        walk(document.body);

        if (textsToTranslate.length === 0) {
            alert('页面没有需要翻译的英文内容');
            return;
        }

        button.innerText = `翻译中... (0/${textsToTranslate.length})`;
        button.disabled = true;

        // 分批翻译（每批50条，用 \n\n 分隔，Google 会保留并正确处理）
        const batchSize = 50;
        for (let i = 0; i < textsToTranslate.length; i += batchSize) {
            const batch = textsToTranslate.slice(i, i + batchSize);
            const combinedText = batch.map(item => item.trimmed).join('\n\n');

            const translatedCombined = await translateText(combinedText);
            // 按 \n\n 拆分，确保顺序一致
            const translatedParts = translatedCombined.split('\n\n');

            // 写回节点（如果拆分数量不匹配，用最后一个或原文兜底）
            batch.forEach((item, idx) => {
                let translated = translatedParts[idx] || translatedParts[translatedParts.length - 1] || item.trimmed;
                translated = translated.trim(); // 去除多余空格
                if (translated && translated !== item.trimmed) {
                    const leading = item.original.match(/^(\s*)/)[0];
                    const trailing = item.original.match(/(\s*)$/)[0];
                    item.node.textContent = leading + translated + trailing;
                }
            });

            button.innerText = `翻译中... (${Math.min(i + batchSize, textsToTranslate.length)}/${textsToTranslate.length})`;
        }

        button.innerText = '恢复原文';
        button.style.backgroundColor = '#db4437';
        button.disabled = false;
        isTranslated = true;
    }

    // 恢复原文
    function restorePage() {
        originalTexts.forEach((originalText, node) => {
            if (node.parentNode) node.textContent = originalText;
        });
        originalTexts.clear();
        button.innerText = '翻译为中文';
        button.style.backgroundColor = '#4285f4';
        isTranslated = false;
    }

    button.addEventListener('click', () => {
        if (isTranslated) {
            restorePage();
        } else {
            translatePage();
        }
    });

    console.log('高速无残留网页翻译器已加载（左下角按钮）');
})();