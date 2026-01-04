// ==UserScript==
// @name         AI 助手转 Word 
// @namespace    http://tampermonkey.net/
// @version      22.0
// @description  从chatgpt复制文本和公式粘贴word不乱码
// @author       YourName
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://claude.ai/*
// @match        https://chat.deepseek.com/*
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @grant        GM_setClipboard
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560644/AI%20%E5%8A%A9%E6%89%8B%E8%BD%AC%20Word.user.js
// @updateURL https://update.greasyfork.org/scripts/560644/AI%20%E5%8A%A9%E6%89%8B%E8%BD%AC%20Word.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // ============================
    // 1. 静态配置
    // ============================
    const CONFIG = {
        fontEn: "Times New Roman",
        fontCn: "SimSun",
        fontCnName: "宋体",
        fontSize: "12.0pt"
    };

    // ============================
    // 2. 安全的样式注入
    // ============================
    const cssText = `
        /* 按钮基础样式 */
        .ai-word-btn {
            display: inline-flex; align-items: center; justify-content: center;
            background: transparent; border: 1px solid transparent; cursor: pointer;
            padding: 4px; border-radius: 4px; color: inherit; opacity: 0.7;
            transition: all 0.2s; margin-right: 8px; height: 100%; min-height: 24px; min-width: 24px;
        }
        .ai-word-btn:hover { background: rgba(100,100,100,0.1); opacity: 1; color: #000; }

        @media (prefers-color-scheme: dark) {
            .ai-word-btn:hover { color: #fff; background: rgba(255,255,255,0.15); }
        }

        /* 公式交互 */
        .katex, .MathJax, math, .math-inline, .math-block {
            cursor: pointer !important;
            transition: background 0.2s;
            border-radius: 3px;
            padding: 2px 4px;
        }
        .katex:hover, .MathJax:hover, math:hover, .math-inline:hover, .math-block:hover {
            background-color: rgba(43, 87, 154, 0.15);
        }
    `;
    const styleNode = document.createElement('style');
    styleNode.textContent = cssText;
    document.head.appendChild(styleNode);

    // ============================
    // 3. 网站适配器
    // ============================
    function getAdapter() {
        const host = window.location.hostname;

        // --- Google Gemini ---
        if (host.includes("gemini.google.com")) {
            return {
                getContent: (btn) => {
                    // 适配 Gemini DOM 结构
                    const container = btn.closest('message-content') || btn.closest('.response-container');
                    return container ? container.querySelector('.markdown') : null;
                },
                btnSelector: "share-button, span[data-test-id='copy-button'], [aria-label='Copy'], [aria-label='复制']",
                // Gemini 的公式经常包裹在 .math-inline 或 .math-block 中，且核心类是 .katex
                formula: ".katex, .MathJax",
                math: "math"
            };
        }

        // --- DeepSeek ---
        if (host.includes("deepseek.com")) {
            return {
                getContent: (btn) => {
                    const container = btn.closest('.ds-message-block') || btn.closest('.f6004764');
                    return container ? container.querySelector('.ds-markdown, .markdown') : null;
                },
                btnSelector: ".ds-icon-button, [aria-label='复制']",
                formula: ".katex",
                math: "math"
            };
        }

        // --- ChatGPT ---
        if (host.includes("chatgpt.com") || host.includes("openai.com")) {
            return {
                getContent: (btn) => {
                    const article = btn.closest('article');
                    return article ? article.querySelector(".markdown, [data-message-author-role='assistant']") : null;
                },
                btnSelector: "button[data-testid='copy-turn-action-button'], button[aria-label='Copy']",
                formula: ".katex",
                math: "math"
            };
        }

        // --- Claude ---
        if (host.includes("claude.ai")) {
            return {
                getContent: (btn) => {
                    const msgDiv = btn.closest('.font-claude-message');
                    return msgDiv || (btn.closest('.grid') ? btn.closest('.grid').querySelector('.font-claude-message') : null);
                },
                btnSelector: "button:has(svg):not(.ai-word-btn)",
                isCopyBtn: (btn) => {
                    return btn.parentElement && btn.parentElement.classList.contains('flex');
                },
                formula: ".katex",
                math: "math"
            };
        }

        // --- Google AI Studio ---
        if (host.includes("aistudio.google.com")) {
            return {
                getContent: (btn) => {
                    const container = btn.closest('.ms-chat-turn') || btn.closest('.chat-turn');
                    return container ? container.querySelector('.markdown-content') : null;
                },
                btnSelector: "button[aria-label='Copy text'], mat-icon[data-mat-icon-name='content_copy']",
                formula: ".katex, .MathJax",
                math: "math"
            };
        }

        return null;
    }

    const ADAPTER = getAdapter();

    // ============================
    // 4. 核心功能：DOM 清洗与转换
    // ============================

    function formatText(text) {
        if (!text) return "";
        text = text.replace(/[\u200B-\u200D\uFEFF]/g, "");
        const parts = text.split(/([^\x00-\x7F]+)/g);
        return parts.map(part => {
            if (!part) return "";
            if (/[^\x00-\x7F]/.test(part)) {
                return `<span style="font-family:'${CONFIG.fontCn}','${CONFIG.fontCnName}'; mso-ascii-font-family:'${CONFIG.fontEn}';">${part}</span>`;
            } else {
                return `<span style="font-family:'${CONFIG.fontEn}', serif; mso-farast-font-family:'${CONFIG.fontCnName}';">${part}</span>`;
            }
        }).join("");
    }

    // [关键更新] 获取公式数据
    // 优先找 <math> 标签，找不到则找 data-math 属性并封装成 Word 可识别的 XML
    function getEquationHTML(node) {
        try {
            // 1. 尝试获取标准 MathML (ChatGPT/DeepSeek/Claude)
            let mathNode = node.querySelector('math');
            if (!mathNode && node.tagName.toLowerCase().includes('mathjax')) {
                mathNode = node.querySelector('math');
            }

            if (mathNode) {
                const clone = mathNode.cloneNode(true);
                const badTags = clone.querySelectorAll('annotation, annotation-xml, script, style');
                badTags.forEach(el => el.remove());
                clone.removeAttribute('alttext');
                clone.removeAttribute('display');
                return clone.outerHTML;
            }

            // 2. 尝试获取 LaTeX 源码 (Gemini 专用)
            // Gemini 的 LaTeX 存在于 .math-inline 或 .math-block 的 data-math 属性中
            // node 可能是内部的 .katex 元素，所以需要 closest
            const container = node.closest('[data-math]');
            if (container) {
                const latex = container.getAttribute('data-math');
                if (latex) {
                    // 构造一个 Word 能识别的带有 LaTeX 注解的 MathML 包裹层
                    // 这样 Word 粘贴后虽然可能先显示源码，但通常能作为公式对象处理
                    return `
                        <math xmlns="http://www.w3.org/1998/Math/MathML">
                            <semantics>
                                <mrow><mtext>${latex.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</mtext></mrow>
                                <annotation encoding="application/x-tex">${latex}</annotation>
                            </semantics>
                        </math>
                    `;
                }
            }

            return null;
        } catch (e) {
            console.error("Formula parsing error:", e);
            return null;
        }
    }

    function processNode(node) {
        if (!node) return "";
        let html = "";
        const children = node.childNodes;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (child.nodeType === Node.TEXT_NODE) {
                html += formatText(child.textContent);
            }
            else if (child.nodeType === Node.ELEMENT_NODE) {
                const tag = child.tagName.toLowerCase();
                const style = window.getComputedStyle(child);

                if (['button', 'svg', 'style', 'script', 'noscript'].includes(tag)) continue;
                if (child.getAttribute('aria-hidden') === 'true') continue;

                // --- 公式识别 ---
                // 增加对 .math-inline / .math-block 的检测 (Gemini)
                if (child.matches(ADAPTER.formula) || tag === 'math' || child.hasAttribute('data-math')) {
                    const mathHTML = getEquationHTML(child);
                    if (mathHTML) {
                        const isBlock = child.textContent.includes('$$') ||
                                        child.classList.contains('katex-display') ||
                                        child.classList.contains('math-block') || // Gemini block
                                        child.tagName.toLowerCase() === 'div' || // block container
                                        style.display === 'block' || style.display === 'flex';

                        if (isBlock) {
                            html += `<div style="display:block; text-align:center; margin:12px 0;">${mathHTML}</div>`;
                        } else {
                            html += mathHTML;
                        }
                    } else {
                        // 如果公式解析失败，尝试只输出文本
                        html += formatText(child.textContent);
                    }
                    continue;
                }

                let inner = processNode(child);

                switch(tag) {
                    case 'p':
                    case 'div':
                        if (tag === 'div' && !child.querySelector('p')) {
                            html += `<p style="margin-bottom:10px;">${inner}</p>`;
                        } else if (tag === 'p') {
                            html += `<p style="margin-bottom:10px;">${inner}</p>`;
                        } else {
                            html += inner;
                        }
                        break;
                    case 'h1': case 'h2': case 'h3': case 'h4':
                        html += `<${tag} style="margin-top:15px; margin-bottom:10px;"><b>${inner}</b></${tag}>`;
                        break;
                    case 'ul': html += `<ul>${inner}</ul>`; break;
                    case 'ol': html += `<ol>${inner}</ol>`; break;
                    case 'li': html += `<li>${inner}</li>`; break;
                    case 'pre':
                        html += `<div style="background:#f0f0f0; padding:10px; border:1px solid #ddd; margin:10px 0; white-space:pre-wrap; font-family:Consolas, monospace;">${child.innerText}</div>`;
                        break;
                    case 'code':
                        html += `<span style="background:#f0f0f0; padding:2px 4px; font-family:Consolas, monospace;">${child.innerText}</span>`;
                        break;
                    case 'br': html += '<br>'; break;
                    case 'b': case 'strong': html += `<b>${inner}</b>`; break;
                    case 'i': case 'em': html += `<i>${inner}</i>`; break;
                    case 'table':
                        html += `<table border="1" cellspacing="0" cellpadding="5" style="border-collapse:collapse; width:100%; margin:10px 0;">${inner}</table>`;
                        break;
                    case 'tr': html += `<tr>${inner}</tr>`; break;
                    case 'td': html += `<td>${inner}</td>`; break;
                    case 'th': html += `<th style="background:#eee;"><b>${inner}</b></th>`; break;
                    default: html += inner;
                }
            }
        }
        return html;
    }

    // ============================
    // 5. 复制逻辑
    // ============================
    async function copyToWord(html, plainText, type) {
        const fullHtml = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
            <head><meta charset='utf-8'><title>Export</title>
            <style>
                body { font-family: '${CONFIG.fontEn}', '${CONFIG.fontCnName}', serif; font-size: ${CONFIG.fontSize}; }
                p { margin: 0 0 10px 0; line-height: 1.5; text-align: justify; }
            </style>
            </head>
            <body>${html}</body></html>
        `;

        try {
            const blobHtml = new Blob([fullHtml], { type: "text/html" });
            const blobText = new Blob([plainText], { type: "text/plain" });
            const data = [new ClipboardItem({ "text/html": blobHtml, "text/plain": blobText })];
            await navigator.clipboard.write(data);
            showToast(`✅ ${type}已复制 (Word格式)`);
        } catch (e) {
            try {
                GM_setClipboard(fullHtml, "html");
                showToast(`✅ ${type}已复制 (兼容模式)`);
            } catch (ex) {
                showToast("⚠️ 复制失败，请检查浏览器权限");
            }
        }
    }

    // ============================
    // 6. 界面注入
    // ============================
    function showToast(msg) {
        const div = document.createElement('div');
        div.textContent = msg;
        div.style.cssText = "position:fixed;top:10%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#fff;padding:10px 16px;border-radius:6px;z-index:99999;font-size:14px;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,0.2);";
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 2500);
    }

    function addButtons() {
        if (!ADAPTER) return;

        // 注入复制按钮
        const btns = document.querySelectorAll(ADAPTER.btnSelector);
        btns.forEach(btn => {
            const parent = btn.parentElement;
            if (!parent || parent.dataset.hasWordBtn === "true") return;

            if (ADAPTER.isCopyBtn && !ADAPTER.isCopyBtn(btn)) return;

            parent.dataset.hasWordBtn = "true";

            const newBtn = document.createElement('button');
            newBtn.className = 'ai-word-btn';
            newBtn.title = "复制为 Word 格式";
            newBtn.type = "button";

            const span = document.createElement('span');
            span.style.cssText = "font-weight:bold; font-family:serif; font-size:14px;";
            span.textContent = "W";
            newBtn.appendChild(span);

            newBtn.onclick = async (e) => {
                e.stopPropagation();
                const content = ADAPTER.getContent(btn);
                if (content) {
                    const originalText = span.textContent;
                    span.textContent = "⏳";
                    await new Promise(r => setTimeout(r, 50));

                    const html = processNode(content);
                    await copyToWord(html, content.innerText, "全文");

                    span.textContent = originalText;
                } else {
                    showToast("⚠️ 未找到正文内容");
                }
            };
            parent.insertBefore(newBtn, btn);
        });

        // 绑定公式点击
        const formulas = document.querySelectorAll(ADAPTER.formula);
        formulas.forEach(f => {
            if (f.dataset.hasWordClick) return;
            f.dataset.hasWordClick = "true";
            f.title = "点击复制公式";
            f.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                // 尝试解析公式
                const cleanHTML = getEquationHTML(f);
                if (cleanHTML) {
                    await copyToWord(cleanHTML, f.textContent, "公式");
                } else {
                    showToast("⚠️ 无法解析此公式 (无 MathML 或 data-math)");
                }
            });
        });
    }

    if (ADAPTER) {
        setInterval(addButtons, 1500);
        setTimeout(addButtons, 1000);
    } else {
        console.log("❌ 不支持当前域名");
    }

})();