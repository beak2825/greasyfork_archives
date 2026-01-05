// ==UserScript==
// @name         Quicker C# Runner Bridge (Gemini Canvas Fix)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  优化按钮位置，避免挤占原有图标，使用闪电图标并增加 C# 过滤。
// @author       AI Assistant
// @match        https://aistudio.google.com/*
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getquicker.net
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/559313/Quicker%20C%20Runner%20Bridge%20%28Gemini%20Canvas%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559313/Quicker%20C%20Runner%20Bridge%20%28Gemini%20Canvas%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区 =================
    const QUICKER_ACTION_ID = "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d";
    // =========================================

    /**
     * 判断是否为 C# 代码块
     */
    function isCSharpBlock(container) {
        const editor = container.closest('xap-code-editor, .monaco-editor, code-immersive-panel');
        if (editor && (editor.getAttribute('data-mode-id') === 'csharp' || editor.querySelector('[data-mode-id="csharp"]'))) {
            return true;
        }

        const codeEl = container.closest('.code-block')?.querySelector('code') || container.querySelector('code');
        if (codeEl && (codeEl.classList.contains('language-csharp') || codeEl.classList.contains('lang-csharp') || codeEl.classList.contains('language-cs'))) {
            return true;
        }

        const headerText = container.closest('.code-block, code-immersive-panel')?.textContent || "";
        if (headerText.toLowerCase().includes('c#') || headerText.toLowerCase().includes('csharp')) {
            return true;
        }

        return false;
    }

    /**
     * 构建闪电图标的 SVG 元素
     */
    function createQuickerSvg() {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 32 32");
        svg.style.width = "20px";
        svg.style.height = "20px";
        svg.style.filter = "drop-shadow(0 0 2px rgba(0,0,0,0.3))";

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M19 2 L7 18 H15 L13 30 L25 12 H17 L19 2 Z");
        path.setAttribute("fill", "#0089FF");

        svg.appendChild(path);
        return svg;
    }

    /**
     * 构建运行按钮 (优化了布局样式)
     */
    function createMaterialButton() {
        const btn = document.createElement('button');
        // 移除部分冲突的 mat-class，使用更基础的类名
        btn.className = "mdc-icon-button quicker-run-btn";
        btn.setAttribute('mat-icon-button', '');
        btn.title = "在 Quicker 中运行 C#";

        // 核心布局修正样式
        btn.style.cssText = `
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            flex-shrink: 0 !important;
            margin-left: 8px !important;
            width: 40px !important;
            height: 40px !important;
            vertical-align: middle;
            background: transparent;
            border: none;
            cursor: pointer;
            position: relative;
        `;

        // 1. 波纹层
        const ripple = document.createElement('span');
        ripple.className = "mat-mdc-button-persistent-ripple mdc-icon-button__ripple";
        btn.appendChild(ripple);

        // 2. 插入 SVG
        btn.appendChild(createQuickerSvg());

        // 3. 辅助层
        const touch = document.createElement('span');
        touch.className = "mat-mdc-button-touch-target";
        btn.appendChild(touch);

        return btn;
    }

    const observer = new MutationObserver(() => {
        // 场景 1: Canvas 工具栏 (Versioning Buttons)
        const versionButtons = document.querySelectorAll('.versioning-buttons');
        versionButtons.forEach(container => {
            if (!container.querySelector('.quicker-run-btn')) {
                if (isCSharpBlock(container)) {
                    const btn = createMaterialButton();
                    btn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        runCode(e.currentTarget);
                    };
                    // 改为 appendChild，放在原生图标后面，防止挤占位置
                    container.appendChild(btn);
                }
            }
        });

        // 场景 2: 聊天记录
        const codeBlockHeaders = document.querySelectorAll('.code-block-header__actions, .code-block-decoration .buttons');
        codeBlockHeaders.forEach(container => {
            if (!container.querySelector('.quicker-run-btn')) {
                if (isCSharpBlock(container)) {
                    const btn = createMaterialButton();
                    btn.style.width = "32px";
                    btn.style.height = "32px";
                    btn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        runCode(e.currentTarget);
                    };
                    container.appendChild(btn);
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function runCode(triggerBtn) {
        let code = "";

        if (!isCSharpBlock(triggerBtn)) {
            showToast("非 C# 代码块，已取消操作", true);
            return;
        }

        try {
            const monaco = unsafeWindow.monaco;
            if (monaco && monaco.editor) {
                const models = monaco.editor.getModels();
                if (models && models.length > 0) {
                    const editorContainer = triggerBtn.closest('xap-code-editor, .monaco-editor, code-immersive-panel');
                    if (editorContainer) {
                        const uri = editorContainer.querySelector('.monaco-editor')?.getAttribute('data-uri');
                        const targetModel = models.find(m => m.uri.toString() === uri) || models[0];
                        code = targetModel.getValue();
                    } else {
                        code = models[0].getValue();
                    }
                }
            }
        } catch (e) {
            console.error("[QuickerBridge] Monaco API Error:", e);
        }

        if (!code) {
            const container = triggerBtn.closest('.code-block, code-immersive-panel, .monaco-editor');
            if (container) {
                const textarea = container.querySelector('textarea.monaco-mouse-cursor-text');
                if (textarea && textarea.value) {
                    code = textarea.value;
                } else {
                    const codeEl = container.querySelector('code, pre');
                    code = codeEl ? (codeEl.innerText || codeEl.textContent) : "";
                }
            }
        }

        if (code && code.trim().length > 0) {
            GM_setClipboard(code.trim());
            showToast(`已提取 C# 代码 (${code.trim().length} 字符)`);
            setTimeout(() => {
                window.location.href = `quicker:runaction:${QUICKER_ACTION_ID}`;
            }, 50);
        } else {
            showToast("提取失败，请确保编辑器已完全加载", true);
        }
    }

    function showToast(msg, isError = false) {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
            background: ${isError ? '#d32f2f' : '#388e3c'}; color: white;
            padding: 10px 20px; border-radius: 25px; z-index: 2147483647;
            font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            pointer-events: none; transition: opacity 0.3s;
        `;
        div.textContent = msg;
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 300);
        }, 3000);
    }
})();