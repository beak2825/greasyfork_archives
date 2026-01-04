// ==UserScript==
// @name         Google Gemini/AI Studio 公式复制
// @version      0.72
// @description  在Google Gemini/AI Studio中点击公式，即可复制MathML，可以直接粘贴到word中。
// @author       Riverstar
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @icon         https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg
// @require      https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/899678
// @downloadURL https://update.greasyfork.org/scripts/556971/Google%20GeminiAI%20Studio%20%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/556971/Google%20GeminiAI%20Studio%20%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ttPolicy = null;

    function initTrustedTypes() {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            try {
                if (!window.trustedTypes.defaultPolicy) {
                    window.trustedTypes.createPolicy('default', {
                        createHTML: (string) => string,
                        createScript: (string) => string,
                        createScriptURL: (string) => string,
                    });
                }
            } catch (e) {
                console.warn(e);
            }

            try {
                ttPolicy = window.trustedTypes.createPolicy('gemini-math-copy-' + Math.random().toString(36).substring(2), {
                    createHTML: (string) => string,
                });
            } catch (e) {
                console.warn(e);
            }
        }
    }

    function getTrustedHTML(htmlString) {
        if (window.trustedTypes) {
            if (window.trustedTypes.defaultPolicy) {
                return htmlString;
            }
            if (ttPolicy) {
                return ttPolicy.createHTML(htmlString);
            }
        }
        return htmlString;
    }

    initTrustedTypes();

    if (typeof MathJax !== 'undefined') {
        MathJax.config = MathJax.config || {};
        MathJax.config.startup = MathJax.config.startup || {};
        MathJax.config.startup.typeset = false;
    }

    const LARGE_OPS = new Set(['∑', '∏', '∐', '⋃', '⋂', '⨁', '⨂', '∫', '∮', '∬', '∭', '⨌']);
    const ACCENT_CHARS = new Set(['~', '˜', '^', 'ˆ', '¯', '˙', '¨', '→', '⇀', '↔', 'ˇ', '˘']);
    const NS_MATHML = 'http://www.w3.org/1998/Math/MathML';

    const SELECTOR_BASE = '.math-block, .math-inline, ms-katex';
    const SELECTOR_HOVER = '.math-block:hover, .math-inline:hover, ms-katex:hover';

    GM_addStyle(`
        ${SELECTOR_BASE} {
            cursor: pointer !important;
            border-radius: 4px;
            transition: background-color 0.1s ease, box-shadow 0.1s ease;
        }
        ${SELECTOR_HOVER} {
            background-color: rgba(26, 115, 232, 0.15) !important;
            box-shadow: 0 0 0 2px #1a73e8 !important;
            z-index: 10;
            position: relative;
        }
        #gas-toast-container { position: fixed; bottom: 24px; left: 24px; z-index: 99999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
        .gas-toast { pointer-events: auto; background: white; color: #3c4043; padding: 12px 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px; font-family: Roboto, sans-serif; font-size: 14px; animation: toast-in 0.3s cubic-bezier(0,0,0.2,1); min-width: 300px; border: 1px solid rgba(0,0,0,0.05); }
        .gas-toast.leaving { animation: toast-out 0.2s forwards; }
        .gas-toast .icon { font-size: 20px; }
        .gas-toast .close-btn { margin-left: auto; cursor: pointer; color: #5f6368; display: flex; align-items: center; border: none; background: none; }
        @keyframes toast-in { from { opacity: 0; transform: translateY(20px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes toast-out { to { opacity: 0; transform: scale(0.9); } }
    `);

    const $el = (tag, { cls, text, style, ...attrs } = {}, children = []) => {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (text) el.textContent = text;
        if (style) Object.assign(el.style, style);
        Object.entries(attrs).forEach(([key, val]) => {
            if (key.startsWith('on') && typeof val === 'function') el.addEventListener(key.substring(2).toLowerCase(), val);
            else el.setAttribute(key, val);
        });
        children.forEach(child => el.append(typeof child === 'string' ? document.createTextNode(child) : child));
        return el;
    };

    const UI = {
        container: null,
        getContainer() {
            if (!this.container) {
                this.container = $el('div', { id: 'gas-toast-container' });
                document.body.appendChild(this.container);
            }
            return this.container;
        },
        showToast(msg, type = 'success') {
            const isSuccess = type === 'success';
            const toast = $el('div', { cls: 'gas-toast' }, [
                $el('span', { cls: 'icon', style: { color: isSuccess ? '#137333' : '#d93025' }, text: isSuccess ? '✔' : 'ℹ' }),
                $el('span', { text: msg }),
                $el('button', { cls: 'close-btn', type: 'button', onClick: () => this.remove(toast) }, [$el('span', { text: '✕' })])
            ]);
            this.getContainer().appendChild(toast);
            setTimeout(() => this.remove(toast), 3000);
        },
        remove(el) {
            if (!el || el.classList.contains('leaving')) return;
            el.classList.add('leaving');
            el.addEventListener('animationend', () => el.remove(), { once: true });
        }
    };

    function createSpacingNode() {
        const mrow = document.createElementNS(NS_MATHML, 'mrow');
        const mo = document.createElementNS(NS_MATHML, 'mo');
        mo.textContent = '\u200A';
        mrow.appendChild(mo);
        return mrow;
    }

    function processMathML(mathRoot) {
        const operators = mathRoot.querySelectorAll('mo');
        operators.forEach(mo => {
            const opText = mo.textContent.trim();
            if (LARGE_OPS.has(opText)) {
                mo.setAttribute('data-mjx-texclass', 'OP');
                if (opText !== '∫' && opText !== '∮') mo.setAttribute('movablelimits', 'false');

                let parentBlock = mo.parentElement;
                while (parentBlock && parentBlock !== mathRoot) {
                    const tag = parentBlock.tagName.toLowerCase();
                    if (['munderover', 'munder', 'mover', 'msubsup', 'msub', 'msup'].includes(tag)) break;
                    parentBlock = parentBlock.parentElement;
                }

                if (parentBlock && parentBlock.parentElement) {
                    const nextSibling = parentBlock.nextElementSibling;
                    const isSpacingAlready = nextSibling && nextSibling.textContent === '\u200A';
                    if (!isSpacingAlready) {
                        const spacer = createSpacingNode();
                        parentBlock.parentElement.insertBefore(spacer, parentBlock.nextSibling);
                    }
                }
            }
        });

        const movers = mathRoot.querySelectorAll('mover');
        movers.forEach(mover => {
            if (mover.children.length >= 2) {
                const overscript = mover.children[1];
                const mo = overscript.tagName.toLowerCase() === 'mo' ? overscript : overscript.querySelector('mo');
                
                if (mo) {
                    const text = mo.textContent.trim();
                    if (ACCENT_CHARS.has(text)) {
                        mover.setAttribute('accent', 'true');
                        mover.setAttribute('accentunder', 'false');
                    }
                }
            }
        });
        return mathRoot;
    }

    async function ensureMathJaxReady() {
        if (typeof MathJax === 'undefined') throw new Error("MathJax 库未加载");
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("MathJax 加载超时")), 5000));
        const ready = MathJax.startup && MathJax.startup.promise ? MathJax.startup.promise : Promise.resolve();
        await Promise.race([ready, timeout]);
    }

    async function handleCopy(element) {
        try {
            await ensureMathJaxReady();

            let latexSource = null;
            if (element.dataset.math) {
                latexSource = element.dataset.math;
            } else {
                const annotation = element.querySelector('annotation[encoding="application/x-tex"]');
                if (annotation) latexSource = annotation.textContent;
            }
            if (!latexSource) {
                 const inner = element.querySelector('[data-math]');
                 if (inner) latexSource = inner.dataset.math;
            }

            if (!latexSource) throw new Error("无法提取 LaTeX 源码");

            const rawMml = MathJax.tex2mml(latexSource, { display: true });

            const parser = new DOMParser();
            const trustedHtml = getTrustedHTML(rawMml);
            const doc = parser.parseFromString(trustedHtml, "text/xml");

            if (doc.querySelector("parsererror")) {
                throw new Error("Parser Error");
            }

            const processedMath = processMathML(doc.querySelector('math'));
            const finalMathML = processedMath.outerHTML;

            const htmlWrapper = `<!DOCTYPE html>
<html xmlns:m="http://schemas.microsoft.com/office/2004/12/omml">
<head><meta charset="utf-8"></head>
<body>${finalMathML}</body>
</html>`;

            const blobHtml = new Blob([htmlWrapper], { type: "text/html" });
            const blobText = new Blob([finalMathML], { type: "text/plain" });

            await navigator.clipboard.write([
                new ClipboardItem({ "text/html": blobHtml, "text/plain": blobText })
            ]);

            UI.showToast("公式已复制", "success");

        } catch (e) {
            console.error(e);
            UI.showToast("复制失败: " + e.message, "error");
        }
    }

    function initGlobalListener() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest(SELECTOR_BASE);

            if (target) {
                e.stopPropagation();
                e.preventDefault();
                handleCopy(target);
            }
        }, true);
    }

    initGlobalListener();

})();