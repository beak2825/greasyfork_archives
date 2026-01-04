// ==UserScript==
// @name         CC98 公式修复
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  全能修复：1. 修复被吞并的混合公式 (支持中文/英文/数字/标点) 2. 深度回溯修复被截断公式 3. 清理幽灵空段落 4. 强力去重 5. 增强型奇偶交替修复策略
// @author       shanxue
// @match        https://www.cc98.org/*
// @match        https://www.cc98.zju.edu.cn/*
// @match        https://webvpn.zju.edu.cn/https/77726476706e69737468656265737421e7e056d22433310830079bab/*
// @match        *.cc98.*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557730/CC98%20%E5%85%AC%E5%BC%8F%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/557730/CC98%20%E5%85%AC%E5%BC%8F%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置区域 ===
    const CONFIG = {
        globalMathScale: '120%',
        debug: false
    };

    function log(msg, ...args) {
        if (CONFIG.debug) console.log('[MathJax Fix] ' + msg, ...args);
    }

    // === 1. 注入全局 CSS ===
    function addGlobalStyle() {
        const styleId = 'gj-mathjax-global-style';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.type = 'text/css';
        style.innerHTML = `
            /* 统一放大 */
            mjx-container, .MathJax, .MathJax_Display {
                font-size: ${CONFIG.globalMathScale} !important;
            }
            /* 行间公式样式优化 */
            mjx-container[display="true"] {
                display: block !important;
                text-align: center !important;
                margin: 0.5em auto !important;
                max-width: 100% !important;
                overflow-x: auto !important;
                overflow-y: hidden !important;
            }
            /* 修复混合修复容器的样式 */
            .gj-math-mixed-fix {
                white-space: normal;
                word-break: break-all;
            }
        `;
        document.head.appendChild(style);
        log('Global style injected.');
    }

    // === 2. 渲染工具 ===
    function renderMathNode(latex, isDisplay) {
        if (!window.MathJax) return null;
        const options = {
            em: 16,
            ex: 8,
            display: isDisplay
        };
        let node = null;
        try {
            if (window.MathJax.tex2chtml) node = window.MathJax.tex2chtml(latex, options);
            else if (window.MathJax.tex2svg) node = window.MathJax.tex2svg(latex, options);
            else if (window.MathJax.startup && window.MathJax.startup.document && window.MathJax.startup.document.convert) {
                node = window.MathJax.startup.document.convert(latex, options);
            }
        } catch (e) {
            if (CONFIG.debug) console.error('[MathJax Fix] Render Error:', e);
        }
        return node;
    }

    // === 3. 核心修复逻辑 (包含回溯修复) ===
    function fixBrokenContainer() {
        const mathElements = document.querySelectorAll('mjx-math[data-latex]');

        mathElements.forEach(mathEl => {
            const latex = mathEl.getAttribute('data-latex');

            // 【关键修改】只要包含 $ 符号，就认为可能发生了吞并，不再强制要求包含中文
            // 排除掉转义的 \$ (虽然简单 split 可能会切错，但在 cc98 的 bug 场景下，几乎都是非转义的 $)
            if (latex && latex.includes('$')) {
                const container = mathEl.closest('mjx-container');
                if (!container || container.dataset.gjFixed) return;

                // --- Part A: 回溯修复前置节点 (处理开头被截断的情况) ---
                const prevNode = container.previousSibling;
                if (prevNode && prevNode.nodeType === Node.TEXT_NODE) {
                    const textVal = prevNode.nodeValue;
                    const lastDollarIdx = textVal.lastIndexOf('$');

                    // 检查是否存在 "孤儿" 开始符
                    if (lastDollarIdx !== -1 && textVal.indexOf('$', lastDollarIdx + 1) === -1) {
                        const textBefore = textVal.substring(0, lastDollarIdx);
                        const mathContent = textVal.substring(lastDollarIdx + 1);

                        if (mathContent.trim()) {
                            const fragment = document.createDocumentFragment();
                            if (textBefore) fragment.appendChild(document.createTextNode(textBefore));

                            const restoredMath = renderMathNode(mathContent, false);
                            if (restoredMath) {
                                restoredMath.style.margin = '0 2px';
                                fragment.appendChild(restoredMath);
                            } else {
                                fragment.appendChild(document.createTextNode('$' + mathContent + '$'));
                            }
                            prevNode.parentNode.replaceChild(fragment, prevNode);
                        }
                    }
                }

                // --- Part B: 修复当前 Container (处理中间被吞并的情况) ---
                // 使用 $ 分割
                const parts = latex.split('$');

                // 只有当至少分割出 2 部分以上才处理
                if (parts.length >= 2) {
                    const wrapper = document.createElement('span');
                    wrapper.className = 'gj-math-mixed-fix';

                    parts.forEach((part, index) => {
                        if (!part && index !== 0) return; // 空字符串处理，保留开头的空（如果有）

                        // 【核心逻辑变更】：奇偶交替原则
                        // index 0: 公式 (因为 data-latex 通常以公式内容开头)
                        // index 1: 文本 (被吞的间隔符，如 "123", "且", ",")
                        // index 2: 公式
                        // index 3: 文本
                        // ...
                        const isMathPart = (index % 2 === 0);

                        if (isMathPart) {
                            // 处理公式部分
                            if (part.trim() === '') return;
                            const mathNode = renderMathNode(part, false);
                            if (mathNode) {
                                mathNode.style.margin = '0 2px';
                                wrapper.appendChild(mathNode);
                            } else {
                                wrapper.appendChild(document.createTextNode('$' + part + '$'));
                            }
                        } else {
                            // 处理文本部分 (无论是中文、数字还是英文)
                            const textSpan = document.createElement('span');
                            textSpan.innerText = part;
                            textSpan.style.margin = '0 2px';
                            wrapper.appendChild(textSpan);
                        }
                    });

                    if (wrapper.hasChildNodes()) {
                        container.dataset.gjFixed = "true";
                        if (container.parentNode) container.parentNode.replaceChild(wrapper, container);
                    }
                }
            }
        });
    }

    // === 4. 扫描并修复纯文本公式 (智能处理空白) ===
    function scanAndFixRawText() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const nodesToProcess = [];

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const parentTag = node.parentNode.tagName;
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'PRE', 'CODE', 'MJ-MATH', 'MJX-CONTAINER'].includes(parentTag)) continue;
            if (node.parentNode.classList && node.parentNode.classList.contains('gj-math-mixed-fix')) continue;
            if (node.parentNode.isContentEditable) continue;

            if (node.nodeValue && /(\$\$[\s\S]+\$\$)|(\$[^\$]+\$)/.test(node.nodeValue)) {
                nodesToProcess.push(node);
            }
        }

        nodesToProcess.forEach(textNode => {
            const text = textNode.nodeValue;
            const regex = /(\$\$([\s\S]+?)\$\$)|(\$([\s\S]+?)\$)/g;

            let lastIndex = 0;
            let match;
            let fragment = null;
            let hasMatch = false;

            while ((match = regex.exec(text)) !== null) {
                if (!hasMatch) {
                    fragment = document.createDocumentFragment();
                    hasMatch = true;
                }

                const fullMatch = match[0];
                const isDisplay = !!match[1];
                const content = match[2] || match[4];

                // --- 处理公式前的文本 ---
                const textBefore = text.substring(lastIndex, match.index);
                if (textBefore) {
                    // 如果是行间公式且前文仅为空白，丢弃（防止空段落）
                    if (isDisplay && !textBefore.trim()) {
                        // pass
                    } else {
                        fragment.appendChild(document.createTextNode(textBefore));
                    }
                }

                // --- 处理公式本身 ---
                const mathNode = renderMathNode(content, isDisplay);
                if (mathNode) {
                    if (isDisplay) {
                        mathNode.setAttribute('display', 'true');
                        fragment.appendChild(mathNode);
                    } else {
                        mathNode.style.margin = '0 2px';
                        fragment.appendChild(mathNode);
                    }
                } else {
                    fragment.appendChild(document.createTextNode(fullMatch));
                }

                lastIndex = match.index + fullMatch.length;
            }

            if (hasMatch) {
                if (lastIndex < text.length) {
                    const textAfter = text.substring(lastIndex);
                    // 同样处理末尾空白
                    if (!textAfter.trim()) {
                        // pass
                    } else {
                        fragment.appendChild(document.createTextNode(textAfter));
                    }
                }
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }

    // === 5. [强力版] 移除无限重复渲染的公式 ===
    function removeDuplicates() {
        const displayContainers = document.querySelectorAll('mjx-container[display="true"]');

        displayContainers.forEach(current => {
            if (!current.parentNode) return;

            let next = current.nextSibling;

            while (next) {
                // 跳过空白文本
                if (next.nodeType === Node.TEXT_NODE && !next.nodeValue.trim()) {
                    next = next.nextSibling;
                    continue;
                }

                if (next.nodeType === Node.ELEMENT_NODE &&
                    next.tagName.toLowerCase() === 'mjx-container' &&
                    next.getAttribute('display') === 'true') {

                    const currMath = current.querySelector('mjx-math');
                    const nextMath = next.querySelector('mjx-math');

                    if (currMath && nextMath) {
                        const currLatex = currMath.getAttribute('data-latex');
                        const nextLatex = nextMath.getAttribute('data-latex');

                        if (currLatex && currLatex === nextLatex) {
                            log('Removing duplicate formula (N-kill):', currLatex);
                            const toRemove = next;
                            next = next.nextSibling;
                            toRemove.remove();
                            continue;
                        }
                    }
                }
                // 遇到不一样的，停止检查
                break;
            }
        });
    }

    function runMainFix() {
        if (!window.MathJax) return;
        addGlobalStyle();
        fixBrokenContainer();
        scanAndFixRawText();
        removeDuplicates();
    }

    let timer = null;
    const observer = new MutationObserver(() => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(runMainFix, 800);
    });

    function init() {
        let attempts = 0;
        const check = setInterval(() => {
            attempts++;
            if (window.MathJax && (window.MathJax.tex2chtml || window.MathJax.tex2svg || window.MathJax.startup)) {
                clearInterval(check);
                log('MathJax API ready.');
                runMainFix();
                observer.observe(document.body, { childList: true, subtree: true });
            }
            if (attempts > 50) clearInterval(check);
        }, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();