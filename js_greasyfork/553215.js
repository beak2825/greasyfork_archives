// ==UserScript==
// @name         Gemini 对照渲染公式
// @name:en      Gemini Formula Renderer (Source + Rendered)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  对照渲染Gemini网页对话中未被渲染的公式，支持$, $$, begin/end环境。已排除输入框和用户提示。
// @description:en  Finds unrendered formulas on Gemini web ($$, $, begin/end), and displays both the original source code and the rendered formula. Excludes the input area and user prompts.
// @author       iah
// @match        https://gemini.google.com/*
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js
// @resource     KATEX_CSS https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553215/Gemini%20%E5%AF%B9%E7%85%A7%E6%B8%B2%E6%9F%93%E5%85%AC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/553215/Gemini%20%E5%AF%B9%E7%85%A7%E6%B8%B2%E6%9F%93%E5%85%AC%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function renderMathInTextNode(textNode) {
        const parent = textNode.parentNode;

        // --- 关键改动：在这里添加了 'input-container' 和 'user-query' 作为排除项 ---
        if (!parent || parent.closest('pre, code, .code-block, .latex-translation-block, input-container, user-query')) {
            return;
        }

        // 正则表达式
        const regex = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$|(\\begin\{[a-zA-Z0-9*]+\}[\s\S]+?\\end\{[a-zA-Z0-9*]+\})/g;

        const textContent = textNode.textContent;

        if (!regex.test(textContent)) {
            return;
        }

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        regex.lastIndex = 0;

        while ((match = regex.exec(textContent)) !== null) {
            const [fullMatch, displayMath, inlineMath, envBlock] = match;
            const textBefore = textContent.slice(lastIndex, match.index);
            if (textBefore) {
                fragment.appendChild(document.createTextNode(textBefore));
            }

            const translationBlock = document.createElement('span');
            translationBlock.className = 'latex-translation-block';

            const sourceCodeElem = document.createElement('code');
            sourceCodeElem.className = 'latex-source-code';
            sourceCodeElem.textContent = fullMatch;
            translationBlock.appendChild(sourceCodeElem);

            const renderedOutputElem = document.createElement('span');
            renderedOutputElem.className = 'latex-rendered-output';

            // 判断显示模式
            const isDisplayMode = !!(displayMath || envBlock);
            // 提取需要给 KaTeX 渲染的源码
            const mathSource = (displayMath || inlineMath || envBlock).trim();

            try {
                katex.render(mathSource, renderedOutputElem, {
                    throwOnError: false,
                    displayMode: isDisplayMode,
                });
            } catch (e) {
                console.error("KaTeX rendering error:", e);
                renderedOutputElem.textContent = 'Error rendering LaTeX';
            }
            translationBlock.appendChild(renderedOutputElem);
            fragment.appendChild(fragment.appendChild(translationBlock));
            lastIndex = regex.lastIndex;
        }

        const textAfter = textContent.slice(lastIndex);
        if (textAfter) {
            fragment.appendChild(document.createTextNode(textAfter));
        }

        parent.replaceChild(fragment, textNode);
    }

    function scanAndRender(element) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const nodesToProcess = [];
        let node;
        while (node = walker.nextNode()) {
            nodesToProcess.push(node);
        }
        for (let i = nodesToProcess.length - 1; i >= 0; i--) {
            renderMathInTextNode(nodesToProcess[i]);
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        scanAndRender(node);
                    }
                });
            }
        }
    });

    function startObserver() {
        const targetNode = document.querySelector('main');
        if (targetNode) {
            console.log('Gemini Renderer Extension is active (v1.3 with exclusions).');
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
            scanAndRender(targetNode);
        } else {
            setTimeout(startObserver, 500);
        }
    }

    startObserver();
})();