// ==UserScript==
// @name         Gemini 提示词模板助手 (智能深色模式版)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在 Gemini 网页端输入框旁添加提示词模板按钮，自动适配网页深色模式。
// @author       You
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557964/Gemini%20%E6%8F%90%E7%A4%BA%E8%AF%8D%E6%A8%A1%E6%9D%BF%E5%8A%A9%E6%89%8B%20%28%E6%99%BA%E8%83%BD%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557964/Gemini%20%E6%8F%90%E7%A4%BA%E8%AF%8D%E6%A8%A1%E6%9D%BF%E5%8A%A9%E6%89%8B%20%28%E6%99%BA%E8%83%BD%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'gemini_custom_prompts';
    const BTN_ID = 'gm-template-btn';
    const PANEL_ID = 'gm-template-panel';

    // --- 样式定义 ---
    const cssContent = `
        /* 基础样式 (默认浅色) */
        #${BTN_ID} {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: transparent;
            cursor: pointer;
            color: var(--mat-sys-on-surface-variant, #444746);
            margin-left: 8px;
            font-size: 18px;
            transition: background 0.2s;
        }
        #${BTN_ID}:hover {
            background-color: rgba(60, 64, 67, 0.08);
        }

        #${PANEL_ID} {
            position: fixed;
            width: 300px;
            max-height: 400px;
            background: #ffffff; /* 默认白底 */
            color: #1f1f1f;      /* 默认黑字 */
            border: 1px solid #ccc;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 99999;
            display: none;
            flex-direction: column;
            overflow: hidden;
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
            font-size: 14px;
        }

        /* --- 强制深色模式样式 (通过 JS 添加 class) --- */
        #${PANEL_ID}.gm-force-dark {
            background: #1e1f20 !important;
            border-color: #444746 !important;
            color: #e3e3e3 !important;
        }
        #${PANEL_ID}.gm-force-dark .gm-panel-header {
            background: rgba(255,255,255,0.05) !important;
            border-bottom-color: #444746 !important;
        }
        #${PANEL_ID}.gm-force-dark .gm-panel-footer {
            border-top-color: #444746 !important;
        }
        #${PANEL_ID}.gm-force-dark .gm-item:hover {
            background-color: rgba(255,255,255,0.1) !important;
        }
        #${PANEL_ID}.gm-force-dark .gm-del-btn {
            color: #ff8b8b !important; 
        }
        #${PANEL_ID}.gm-force-dark #gm-new-input {
            border-color: #555 !important;
            color: #fff !important;
        }
        #${BTN_ID}.gm-force-dark-btn {
            color: #c4c7c5 !important;
        }
        #${BTN_ID}.gm-force-dark-btn:hover {
            background-color: rgba(255, 255, 255, 0.08) !important;
        }
        /* ------------------------------------- */

        .gm-panel-header {
            padding: 12px;
            background: rgba(0,0,0,0.03);
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .gm-close-btn {
            cursor: pointer;
            padding: 0 5px;
            font-size: 18px;
            line-height: 1;
            opacity: 0.6;
        }
        .gm-close-btn:hover { opacity: 1; }
        
        .gm-panel-body {
            flex: 1;
            overflow-y: auto;
            max-height: 300px;
        }
        .gm-panel-footer {
            padding: 10px;
            border-top: 1px solid rgba(0,0,0,0.1);
            display: flex;
            gap: 5px;
        }

        .gm-item {
            padding: 10px 12px;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .gm-item:hover {
            background-color: rgba(0,0,0,0.05);
        }
        .gm-item-text {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 10px;
        }
        .gm-del-btn {
            color: #d93025;
            cursor: pointer;
            font-weight: bold;
            padding: 2px 6px;
        }
        
        #gm-new-input {
            flex: 1;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            background: transparent;
            color: inherit;
        }
        #gm-add-btn {
            padding: 6px 12px;
            background: #0b57d0;
            color: white;
            border: none;
            border-radius: 18px;
            cursor: pointer;
        }
        #gm-add-btn:hover { background: #0842a0; }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = cssContent;
    document.head.appendChild(styleEl);

    // --- 辅助功能：检测页面实际背景亮度 ---
    function isPageDark() {
        // 获取 body 的背景色
        const bgColor = window.getComputedStyle(document.body).backgroundColor;
        // 提取 RGB 值
        const rgb = bgColor.match(/\d+/g);
        if (!rgb) return false;
        
        // 计算亮度 (简单的平均值算法)
        const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;
        
        // 如果亮度低于 100 (255是纯白)，认为是深色模式
        return brightness < 100;
    }

    // --- 核心逻辑 ---

    function getTemplates() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }

    function saveTemplates(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function insertToEditor(text) {
        const editor = document.querySelector('.ql-editor') || 
                       document.querySelector('div[contenteditable="true"]') ||
                       document.querySelector('rich-textarea div[contenteditable]');
        
        if (!editor) {
            alert('找不到输入框，请先点击一下输入框。');
            return;
        }
        editor.focus();
        const success = document.execCommand('insertText', false, text);
        if (!success) {
            editor.textContent += text;
        }
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        togglePanel(false);
    }

    function createEl(tag, className, text) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text) el.textContent = text;
        return el;
    }

    function renderList() {
        const list = getTemplates();
        let container = document.querySelector('.gm-panel-body');
        if (!container) return;

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        if (list.length === 0) {
            const empty = createEl('div', '', '暂无模板');
            empty.style.padding = '15px';
            empty.style.textAlign = 'center';
            empty.style.opacity = '0.6';
            container.appendChild(empty);
            return;
        }

        list.forEach((text, index) => {
            const item = createEl('div', 'gm-item');
            
            const textSpan = createEl('span', 'gm-item-text', text);
            textSpan.title = text;
            textSpan.onclick = () => insertToEditor(text);

            const delBtn = createEl('span', 'gm-del-btn', '×');
            delBtn.onclick = (e) => {
                e.stopPropagation();
                const newList = getTemplates();
                newList.splice(index, 1);
                saveTemplates(newList);
                renderList();
            };

            item.appendChild(textSpan);
            item.appendChild(delBtn);
            container.appendChild(item);
        });
    }

    function togglePanel(show) {
        let panel = document.getElementById(PANEL_ID);
        const btn = document.getElementById(BTN_ID);

        if (!panel) {
            panel = createEl('div', '');
            panel.id = PANEL_ID;

            const header = createEl('div', 'gm-panel-header');
            header.appendChild(createEl('span', '', '提示词模板'));
            const closeBtn = createEl('span', 'gm-close-btn', '×');
            closeBtn.onclick = () => panel.style.display = 'none';
            header.appendChild(closeBtn);
            panel.appendChild(header);

            const body = createEl('div', 'gm-panel-body');
            panel.appendChild(body);

            const footer = createEl('div', 'gm-panel-footer');
            const input = createEl('input', '');
            input.id = 'gm-new-input';
            input.placeholder = '输入新提示词...';
            input.type = 'text';
            
            const addBtn = createEl('button', '', '添加');
            addBtn.id = 'gm-add-btn';
            
            const handleAdd = () => {
                const val = input.value.trim();
                if (val) {
                    const list = getTemplates();
                    list.push(val);
                    saveTemplates(list);
                    input.value = '';
                    renderList();
                }
            };
            addBtn.onclick = handleAdd;
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleAdd();
            });

            footer.appendChild(input);
            footer.appendChild(addBtn);
            panel.appendChild(footer);

            document.body.appendChild(panel);
        }

        if (show === false) {
            panel.style.display = 'none';
            return;
        }

        if (panel.style.display === 'flex') {
            panel.style.display = 'none';
        } else {
            // --- 核心修复：打开时检测页面颜色 ---
            if (isPageDark()) {
                panel.classList.add('gm-force-dark');
            } else {
                panel.classList.remove('gm-force-dark');
            }
            // --------------------------------

            if (btn) {
                const rect = btn.getBoundingClientRect();
                panel.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
                panel.style.right = (window.innerWidth - rect.right) + 'px';
            }
            
            panel.style.display = 'flex';
            renderList();
            setTimeout(() => document.getElementById('gm-new-input')?.focus(), 50);
        }
    }

    function init() {
        if (document.getElementById(BTN_ID)) return;

        const toolbar = document.querySelector('.input-area-container .right-buttons-container') 
                     || document.querySelector('.run-button-container')?.parentElement
                     || document.querySelector('button[aria-label*="Send"]')?.parentElement?.parentElement
                     || document.querySelector('button[aria-label*="发送"]')?.parentElement?.parentElement;

        if (toolbar) {
            const btn = document.createElement('button');
            btn.id = BTN_ID;
            btn.textContent = '📝'; 
            btn.title = "常用提示词模板";
            btn.type = "button";
            
            // 按钮颜色也适配一下
            if (isPageDark()) btn.classList.add('gm-force-dark-btn');

            toolbar.insertBefore(btn, toolbar.firstChild);

            btn.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                togglePanel();
            };
            
            document.addEventListener('click', (e) => {
                const panel = document.getElementById(PANEL_ID);
                const btnEl = document.getElementById(BTN_ID);
                if (panel && panel.style.display === 'flex') {
                    if (!panel.contains(e.target) && !btnEl.contains(e.target)) {
                        togglePanel(false);
                    }
                }
            });
        }
    }

    const observer = new MutationObserver((mutations) => {
        if (!document.getElementById(BTN_ID)) {
            init();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(init, 1500);

})();