// ==UserScript==
// @name         FormulaCopier
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.5.1
// @description  Copy LaTeX formulas when copying text on Zhihu, Wikipedia, OpenReview and ChatGPT.
// @author       Yuhang Chen(github.com/yuhangchen0), Dramwig(github.com/Dramwig)
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://*.wikipedia.org/*
// @match        https://openreview.net/*
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555614/FormulaCopier.user.js
// @updateURL https://update.greasyfork.org/scripts/555614/FormulaCopier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('copy', function(event) {
        // ⭐ ChatGPT 特殊处理：复制前先把 LaTeX 写到 data-latex 上
        if (window.location.hostname.includes('chatgpt.com')) {
            cacheChatGPTLatex();
        }

        let selectedHtml = getSelectionHtml();

        if (window.location.hostname.includes('zhihu.com')) {
            handleZhihu(selectedHtml, event);
        } else if (window.location.hostname.includes('wikipedia.org')) {
            handleWiki(selectedHtml, event);
        } else if (window.location.hostname.includes('openreview.net')) {
            handleOpenReview(selectedHtml, event);
        } else if (window.location.hostname.includes('chatgpt.com')) {
            handleChatGPT(selectedHtml, event);
        }
    });

    document.addEventListener('selectionchange', function() {
        let formulaSelector = null;

        if (window.location.hostname.includes('zhihu.com')) {
            formulaSelector = '.ztext-math';
        } else if (window.location.hostname.includes('wikipedia.org')) {
            formulaSelector = '.mwe-math-element';
        } else if (window.location.hostname.includes('openreview.net')) {
            formulaSelector = 'mjx-container';
        } else if (window.location.hostname.includes('chatgpt.com')) {
            formulaSelector = '.katex';
        }

        if (!formulaSelector) {
            return;
        }

        const allFormulas = document.querySelectorAll(formulaSelector);
        allFormulas.forEach(removeHighlightStyle);

        const sel = window.getSelection();
        if (!sel.rangeCount) {
            return;
        }

        for (let i = 0; i < sel.rangeCount; i++) {
            const range = sel.getRangeAt(i);
            allFormulas.forEach(formula => {
                if (range.intersectsNode(formula)) {
                    applyHighlightStyle(formula);
                }
            });
        }
    });

    function cacheChatGPTLatex() {
        const formulas = document.querySelectorAll('.katex');
        formulas.forEach(formula => {
            if (!formula.hasAttribute('data-latex')) {
                const annotation = formula.querySelector('annotation[encoding="application/x-tex"]');
                if (annotation) {
                    formula.setAttribute('data-latex', annotation.textContent.trim());
                }
            }
        });
    }


    function handleZhihu(selectedHtml, event) {
        if (selectedHtml.includes('data-tex')) {
            const container = document.createElement('div');
            container.innerHTML = selectedHtml;
            replaceZhihuFormulas(container);
            setClipboardData(event, container.textContent);
        }
    }

    function handleWiki(selectedHtml, event) {
        if (selectedHtml.includes('mwe-math-element')) {
            const container = document.createElement('div');
            container.innerHTML = selectedHtml;
            replaceWikipediaFormulas(container);
            setClipboardData(event, container.textContent);
        }
    }

    function handleOpenReview(selectedHtml, event) {
        if (selectedHtml.includes('mjx-container')) {
            const container = document.createElement('div');
            container.innerHTML = selectedHtml;
            replaceOpenReviewFormulas(container);
            setClipboardData(event, container.textContent);
        }
    }

    function handleChatGPT(selectedHtml, event) {
        if (selectedHtml.includes('katex')) {
            const container = document.createElement('div');
            container.innerHTML = selectedHtml;
            replaceChatGPTFormulas(container);
            setClipboardData(event, container.textContent);
        }
    }

    function applyHighlightStyle(formula) {
        const mathJaxSVG = formula.querySelector('.MathJax_SVG');
        if (mathJaxSVG && mathJaxSVG.style) {
            mathJaxSVG.style.backgroundColor = 'lightblue';
            return;
        }

        const mathJaxCHTML = formula.querySelector('mjx-math');
        if (mathJaxCHTML && mathJaxCHTML.style) {
            mathJaxCHTML.style.backgroundColor = 'lightblue';
            return;
        }

        const katexHtml = formula.querySelector('.katex-html');
        if (katexHtml && katexHtml.style) {
            katexHtml.style.backgroundColor = 'lightblue';
            return;
        }

        if (formula && formula.style) {
            formula.style.backgroundColor = 'lightblue';
        }
    }

    function removeHighlightStyle(formula) {
        const mathJaxSVG = formula.querySelector('.MathJax_SVG');
        if (mathJaxSVG && mathJaxSVG.style) {
            mathJaxSVG.style.backgroundColor = '';
        }

        const mathJaxCHTML = formula.querySelector('mjx-math');
        if (mathJaxCHTML && mathJaxCHTML.style) {
            mathJaxCHTML.style.backgroundColor = '';
        }

        const katexHtml = formula.querySelector('.katex-html');
        if (katexHtml && katexHtml.style) {
            katexHtml.style.backgroundColor = '';
        }

        if (formula && formula.style) {
            formula.style.backgroundColor = '';
        }
    }

    function getLatexFromMjxContainer(container) {
        if (!window.MathJax?.startup?.document) return null;

        const counter = container.getAttribute('ctxtmenu_counter');
        const target = counter
            ? document.querySelector(`mjx-container[ctxtmenu_counter="${counter}"]`) || container
            : container;

        const mathItems = MathJax.startup.document.getMathItemsWithin(target);
        const math = mathItems[0]?.math;
        return typeof math === 'string' ? math.trim() : null;
    }

    function replaceOpenReviewFormulas(container) {
        container.querySelectorAll('mjx-container').forEach(formula => {
            const texCode = getLatexFromMjxContainer(formula);
            if (texCode) {
                formula.replaceWith(document.createTextNode('$' + texCode + '$'));
            }
        });
    }

    function replaceWikipediaFormulas(container) {
        const formulas = container.querySelectorAll('.mwe-math-element');
        formulas.forEach(formula => {
            const annotation = formula.querySelector('annotation[encoding="application/x-tex"]');
            if (annotation) {
                const texCode = annotation.textContent;
                const texNode = document.createTextNode('$' + texCode + '$');
                formula.replaceWith(texNode);
            }
        });
    }

    function replaceChatGPTFormulas(container) {
        container.querySelectorAll('.katex').forEach(formula => {
            // ⭐ 优先使用复制前缓存好的 data-latex
            let texCode = formula.getAttribute('data-latex');

            // 兼容：如果选区里恰好带了 annotation，也可以直接用
            if (!texCode) {
                const annotation = formula.querySelector('annotation[encoding="application/x-tex"]');
                if (annotation) {
                    texCode = annotation.textContent.trim();
                }
            }

            if (texCode) {
                formula.replaceWith(document.createTextNode('$' + texCode + '$'));
            }
            // 如果依然拿不到 texCode，就不动这个节点，退回原生复制行为
        });
    }


    function replaceZhihuFormulas(container) {
        const formulas = container.querySelectorAll('.ztext-math');
        formulas.forEach(formula => {
            const texCode = formula.getAttribute('data-tex');
            const texNode = document.createTextNode('$' + texCode + '$');
            formula.replaceWith(texNode);
        });
    }

    function setClipboardData(event, text) {
        event.clipboardData.setData('text/plain', text);
        event.preventDefault();
    }

    function convertLineBreaks(node) {
        if (node.nodeName === 'BR') {
            node.parentNode.replaceChild(document.createTextNode('\n'), node);
        } else if (node.nodeName === 'P' && node.nextElementSibling) {
            // Add a newline after the section
            node.appendChild(document.createTextNode('\n\n'));
        } else {
            const children = Array.from(node.childNodes);
            for (let child of children) {
                convertLineBreaks(child);
            }
        }
    }

    function getSelectionHtml() {
        const sel = window.getSelection();
        if (sel.rangeCount) {
            const container = document.createElement('div');
            for (let i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }

            // Keep newline
            convertLineBreaks(container);
            return container.innerHTML;
        }
        return '';
    }
})();