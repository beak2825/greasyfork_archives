// ==UserScript==
// @name         Gemini Super Previewer (All-in-One)
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  超级增强Gemini：为代码块添加HTML/Mermaid预览按钮，并为Gemini原生Canvas预览面板添加全屏切换功能。
// @author       You & Claude
// @match        https://gemini.google.com/app/*
// @match        https://www.codeinword.com/htmlpreview
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.open
// @run-at       document-idle
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE2LjU5IDE1LjQxTDIwIDEyTDE2LjU5IDguNTlMMTggNiAyNCAxMkwxOCAxOEwxNi4U5IDE1LjQxWk03LjQxIDE1LjQxTDIwIDEyTDcuNDEgOC41OUw2IDZMDBIDEyTDYgMThMNy44MSAxNS44MVoiLz48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/559708/Gemini%20Super%20Previewer%20%28All-in-One%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559708/Gemini%20Super%20Previewer%20%28All-in-One%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    //  逻辑 1: 如果当前页面是 Gemini
    // =================================================================================
    if (window.location.hostname.includes('gemini.google.com')) {
        console.log('Gemini Super Previewer: Script loaded!');

        // --- 1. 合并所有CSS样式 ---
        GM_addStyle(`
            /* --- 样式来自 "Code Block Previewer" --- */
            .preview-button {
                color: white; padding: 4px 8px; margin-left: 12px;
                border: none; border-radius: 4px; cursor: pointer;
                font-size: 12px; font-weight: bold; z-index: 9999;
            }
            .html-preview-btn { background-color: #007bff; }
            .html-preview-btn:hover { background-color: #0056b3; }
            .mermaid-preview-btn { background-color: #8a2be2; }
            .mermaid-preview-btn:hover { background-color: #7324bf; }

            /* --- 样式来自 "Canvas Fullscreen" --- */
            .gemini-canvas-fullscreen-mode {
                position: fixed !important; top: 0 !important; left: 0 !important;
                width: 100vw !important; height: 100vh !important;
                z-index: 9999 !important;
                background-color:black;
                display: flex !important; flex-direction: column !important;
                padding: 0 !important; margin: 0 !importan
                t; border-radius: 0 !important;
            }
            .gemini-canvas-fullscreen-mode > web-preview { flex: 1; height: 100%; }
            #gemini-canvas-fullscreen-btn {
                display: inline-flex; align-items: center; justify-content: center;
                background: transparent; border: none; cursor: pointer;
                padding: 8px; border-radius: 50%;
                color: var(--gem-sys-color-on-surface-variant, #444746);
                transition: background-color 0.2s; margin-left: 8px;
            }
            #gemini-canvas-fullscreen-btn:hover { background-color: rgba(68, 71, 70, 0.08); }
        `);

        // --- 2. 整合所有功能函数 ---

        // 功能 A: 来自 "Canvas Fullscreen"
        const FULLSCREEN_CLASS = 'gemini-canvas-fullscreen-mode';
        const BTN_ID = 'gemini-canvas-fullscreen-btn';
        const PATH_ENTER = "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z";
        const PATH_EXIT = "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-14v3h3v2h-5V5z";

        function createIcon(pathData) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.style.width = '20px'; svg.style.height = '20px'; svg.style.fill = 'currentColor';
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            svg.appendChild(path);
            return svg;
        }

        function toggleImmersiveFullscreen() {
            const container = document.querySelector('code-immersive-panel');
            if (!container) return;
            const isFullscreen = container.classList.toggle(FULLSCREEN_CLASS);
            const btn = document.getElementById(BTN_ID);
            if (btn) {
                btn.textContent = ''; // Clear content safely
                btn.appendChild(createIcon(isFullscreen ? PATH_EXIT : PATH_ENTER));
                btn.title = isFullscreen ? "退出全屏" : "全屏";
            }
        }

        function injectImmersivePanelButton() {
            if (document.getElementById(BTN_ID)) return;
            const panel = document.querySelector('code-immersive-panel');
            if (!panel) return;
            const toolbar = panel.querySelector('toolbar') || panel.querySelector('[data-test-id="toolbar"]');
            if (!toolbar) return;
            const toolbarActionButtons = toolbar.querySelector('.action-buttons');
            if (!toolbarActionButtons) return;

            const closeBtn = toolbarActionButtons.querySelector('button[data-test-id="close-button"]');
            const btn = document.createElement('button');
            btn.id = BTN_ID;
            btn.className = "mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-unthemed";
            btn.style.marginLeft = "8px";
            btn.appendChild(createIcon(PATH_ENTER));
            btn.title = "全屏";
            btn.onclick = toggleImmersiveFullscreen;

            if (closeBtn && closeBtn.parentNode) {
                closeBtn.parentNode.insertBefore(btn, closeBtn);
            } else {
                toolbarActionButtons.appendChild(btn);
            }
        }

        // 功能 B: 来自 "Code Block Previewer"
        function addCodeBlockButtons() {
            document.querySelectorAll('div.code-block-decoration').forEach(header => {
                const langSpan = header.querySelector('span');
                const container = header.closest('.code-block');
                const codeElement = container?.querySelector('code[data-test-id="code-content"]');
                if (!langSpan || !codeElement) return;

                const codeText = codeElement.innerText.trim();
                const lang = langSpan.textContent.trim().toLowerCase();

                // HTML 按钮
                if (lang === 'html' && !header.querySelector('.html-preview-btn')) {
                    const button = document.createElement('button');
                    button.textContent = '网页预览';
                    button.className = 'preview-button html-preview-btn';
                    button.onclick = (e) => {
                        e.stopPropagation();
                        GM_setValue('html_to_preview', codeElement.innerText);
                        window.open('https://www.codeinword.com/htmlpreview', '_blank');
                    };
                    const buttonBar = header.querySelector('.buttons');
                    if (buttonBar) buttonBar.appendChild(button);
                }

                // Mermaid 按钮
                const isMermaid = /^\s*(graph|sequenceDiagram|gantt|classDiagram|stateDiagram|pie|erDiagram|journey|flowchart)/.test(codeText);
                if (isMermaid && !header.querySelector('.mermaid-preview-btn')) {
                    const button = document.createElement('button');
                    button.textContent = '查看图表';
                    button.className = 'preview-button mermaid-preview-btn';
                    button.onclick = (e) => {
                        e.stopPropagation();
                        const compressed = pako.deflate(codeText, { level: 9 });
                        const binaryString = String.fromCharCode.apply(null, compressed);
                        const base64 = btoa(binaryString);
                        const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
                        const url = `https://mermaid.live/edit#pako:${urlSafeBase64}`;
                        window.open(url, '_blank');
                    };
                    const buttonBar = header.querySelector('.buttons');
                    if (buttonBar) buttonBar.appendChild(button);
                }
            });
        }

        // --- 3. 统一的观察者和事件监听 ---
        const observer = new MutationObserver(() => {
            addCodeBlockButtons();
            injectImmersivePanelButton();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // ESC 键退出全屏
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const fullscreenElement = document.querySelector('.' + FULLSCREEN_CLASS);
                if (fullscreenElement) {
                    toggleImmersiveFullscreen();
                }
            }
        });
    }

    // =================================================================================
    //  逻辑 2: 在 codeinword.com 页面 (保持不变)
    // =================================================================================
    if (window.location.hostname.includes('codeinword.com')) {
        window.onload = async () => {
            const htmlContent = await GM_getValue('html_to_preview', null);
            if (!htmlContent) return;
            const editorTextarea = document.getElementById('html-editor');
            const runButton = document.querySelector('button[title="Run"]');
            if (editorTextarea && runButton) {
                editorTextarea.value = htmlContent;
                editorTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                GM_setValue('html_to_preview', '');
                runButton.click();
                const interval = setInterval(() => {
                    const previewFrame = document.querySelector('.preview-iframe');
                    if (previewFrame) {
                        clearInterval(interval);
                        Object.assign(previewFrame.style, {
                            position: 'fixed', top: '0', left: '0',
                            width: '100vw', height: '100vh',
                            zIndex: '999999', border: 'none', backgroundColor: '#fff'
                        });
                    }
                }, 100);
            }
        };
    }
})();
