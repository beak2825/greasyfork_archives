// ==UserScript==
// @name         Gemini 自动添加Prompt (V8.5 极光玻璃版)
// @namespace    http://tampermonkey.net/
// @version      8.5
// @description  双击空格追加提示词，光标保持在原输入位置 | 界面全面升级：毛玻璃特效、大圆角、自动暗黑模式适配
// @author       GeminiUser & AI Assistant
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548790/Gemini%20%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0Prompt%20%28V85%20%E6%9E%81%E5%85%89%E7%8E%BB%E7%92%83%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548790/Gemini%20%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0Prompt%20%28V85%20%E6%9E%81%E5%85%89%E7%8E%BB%E7%92%83%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 核心配置 ===
    const DUPLICATE_MARKER = "【系统最高权限提示词】";
    const STORAGE_KEY_DATA = 'gemini_prompt_data_v1';
    const DOUBLE_SPACE_THRESHOLD = 300;

    // === 默认模板数据 ===
    const DEFAULT_TEMPLATES = [
        {
            name: "严谨编程 (默认)",
            content: [
                "\n",
                "分析上述内容,并必须严格遵守以下规则",
                "严谨验证：所有内容必须有出处或经得起推敲。不确定的内容我会加粗并标注 ⚠️。",
                "绝不阉割：绝不使用\"代码同上\"、\"此处省略\"或\"...\"等占位符。无论代码多长，我都会完整输出。",
                "完整方案：输出完整的文件内容，确保您可以直接复制使用，无需二次填补。",
                "精准修改：只修改您指出的部分，其余部分保持原样，不随意发挥。",
                "简体中文：全程使用简体中文【系统最高权限提示词】。"
            ].join("\n"),
            active: true
        },
        {
            name: "简洁解释",
            content: "\n\n请用通俗易懂的语言解释上述内容，适合初学者理解，不要使用过于专业的术语。",
            active: false
        },
        {
            name: "英文润色",
            content: "\n\nPlease rewrite the text above to make it more natural, professional, and concise. Fix any grammar issues.",
            active: false
        }
    ];

    // === 状态管理 ===
    let promptData = loadData();
    let isProcessing = false;
    let lastSpaceTime = 0;
    let domCache = {};

    // === DOM 辅助函数 ===
    function el(tag, attrs = {}, children = []) {
        const element = document.createElement(tag);
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') element.className = value;
            else if (key === 'style' && typeof value === 'object') Object.assign(element.style, value);
            else if (key.startsWith('on') && typeof value === 'function') element.addEventListener(key.substring(2).toLowerCase(), value);
            else if (value !== null && value !== undefined) element.setAttribute(key, value);
        });
        if (!Array.isArray(children)) children = [children];
        children.forEach(child => {
            if (typeof child === 'string' || typeof child === 'number') element.textContent = child;
            else if (child instanceof Node) element.appendChild(child);
        });
        return element;
    }

    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_DATA);
            return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));
        } catch (e) {
            return JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));
        }
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(promptData));
    }

    function getActiveContent() {
        const active = promptData.find(t => t.active);
        return active ? active.content : "";
    }

    // === 极光玻璃 UI 样式 (核心升级) ===
    function createStyles() {
        if (document.getElementById('gpp-style')) return;
        const style = document.createElement('style');
        style.id = 'gpp-style';
        style.textContent = `
            :root {
                --gpp-primary: #4facfe;
                --gpp-primary-grad: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                --gpp-bg-glass: rgba(255, 255, 255, 0.75);
                --gpp-border: 1px solid rgba(255, 255, 255, 0.6);
                --gpp-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                --gpp-text: #2d3436;
                --gpp-text-sec: #636e72;
                --gpp-hover: rgba(0, 0, 0, 0.04);
                --gpp-input-bg: rgba(255, 255, 255, 0.6);
            }

            /* 暗黑模式变量 */
            .gpp-dark-mode {
                --gpp-primary: #74b9ff;
                --gpp-primary-grad: linear-gradient(135deg, #0984e3 0%, #74b9ff 100%);
                --gpp-bg-glass: rgba(30, 30, 35, 0.85);
                --gpp-border: 1px solid rgba(255, 255, 255, 0.08);
                --gpp-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
                --gpp-text: #dfe6e9;
                --gpp-text-sec: #b2bec3;
                --gpp-hover: rgba(255, 255, 255, 0.08);
                --gpp-input-bg: rgba(0, 0, 0, 0.2);
            }

            /* 悬浮按钮 (Glassmorphism) */
            #gemini-prompt-toggle {
                position: fixed; bottom: 30px; right: 30px;
                width: 48px; height: 48px;
                background: var(--gpp-primary-grad);
                color: white; border-radius: 24px;
                text-align: center; line-height: 48px;
                font-size: 20px; font-weight: bold; cursor: pointer;
                z-index: 99999;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                backdrop-filter: blur(4px);
                user-select: none;
            }
            #gemini-prompt-toggle:hover { transform: scale(1.1) rotate(90deg); }

            /* 主面板 (Glassmorphism) */
            #gemini-prompt-panel {
                position: fixed; bottom: 90px; right: 30px;
                width: 340px;
                background: var(--gpp-bg-glass);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border-radius: 20px;
                border: var(--gpp-border);
                box-shadow: var(--gpp-shadow);
                z-index: 99999; display: none; flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                overflow: hidden;
                color: var(--gpp-text);
                opacity: 0; transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
            }
            #gemini-prompt-panel.active { opacity: 1; transform: translateY(0); }

            .gpp-header {
                padding: 16px 20px;
                border-bottom: var(--gpp-border);
                display: flex; justify-content: space-between; align-items: center;
                font-weight: 700; font-size: 15px; letter-spacing: 0.5px;
            }

            .gpp-content { max-height: 320px; overflow-y: auto; padding: 10px; }

            /* 列表项 */
            .gpp-item {
                display: flex; align-items: center; padding: 10px 12px;
                margin-bottom: 6px; border-radius: 12px;
                cursor: pointer; transition: background 0.2s;
            }
            .gpp-item:hover { background: var(--gpp-hover); }

            /* 单选框美化 */
            .gpp-radio {
                appearance: none; width: 16px; height: 16px;
                border: 2px solid var(--gpp-text-sec); border-radius: 50%;
                margin-right: 12px; position: relative; cursor: pointer;
            }
            .gpp-radio:checked { border-color: var(--gpp-primary); }
            .gpp-radio:checked::after {
                content: ''; position: absolute; top: 3px; left: 3px;
                width: 6px; height: 6px; background: var(--gpp-primary); border-radius: 50%;
            }

            .gpp-name { flex: 1; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }

            /* 操作按钮 */
            .gpp-btn {
                border: none; background: transparent; cursor: pointer;
                color: var(--gpp-text-sec); padding: 6px; border-radius: 8px;
                opacity: 0.6; transition: all 0.2s; font-size: 14px;
            }
            .gpp-btn:hover { opacity: 1; background: var(--gpp-hover); color: var(--gpp-primary); }

            /* 编辑区域 */
            .gpp-editor {
                padding: 15px; border-top: var(--gpp-border);
                background: rgba(0,0,0,0.02); display: none;
            }
            .gpp-input, .gpp-textarea {
                width: 100%; border: none;
                background: var(--gpp-input-bg);
                color: var(--gpp-text);
                padding: 10px 12px; border-radius: 10px;
                font-family: inherit; font-size: 13px;
                box-sizing: border-box; outline: none;
                transition: box-shadow 0.2s;
            }
            .gpp-input:focus, .gpp-textarea:focus {
                box-shadow: 0 0 0 2px var(--gpp-primary);
            }
            .gpp-input { margin-bottom: 10px; font-weight: 600; }
            .gpp-textarea { height: 100px; resize: none; line-height: 1.5; }

            /* 底部按钮区 */
            .gpp-add-container { padding: 12px; text-align: center; border-top: var(--gpp-border); }
            .gpp-actions { margin-top: 12px; display: flex; gap: 10px; justify-content: flex-end; }

            .gpp-primary-btn, .gpp-secondary-btn {
                padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: none;
            }
            .gpp-primary-btn {
                background: var(--gpp-primary-grad); color: white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .gpp-primary-btn:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.25); }

            .gpp-secondary-btn {
                background: var(--gpp-input-bg); color: var(--gpp-text);
                width: 100%; transition: background 0.2s;
            }
            .gpp-secondary-btn:hover { background: var(--gpp-hover); }
            .gpp-actions .gpp-secondary-btn { width: auto; }

            /* 提示条 */
            #gpp-toast {
                position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px);
                background: rgba(0,0,0,0.8); color: white; padding: 10px 20px;
                border-radius: 30px; font-size: 13px; z-index: 100000;
                backdrop-filter: blur(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                opacity: 0; transition: all 0.3s; pointer-events: none;
            }
            #gpp-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

            /* 滚动条美化 */
            .gpp-content::-webkit-scrollbar { width: 4px; }
            .gpp-content::-webkit-scrollbar-track { background: transparent; }
            .gpp-content::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.3); border-radius: 4px; }
        `;
        document.head.appendChild(style);
    }

    // === UI 构建 ===
    function createUI() {
        if (document.getElementById('gemini-prompt-toggle')) return;

        const toggleBtn = el('div', { id: 'gemini-prompt-toggle', title: '配置 Prompt', onclick: togglePanel }, '灵');
        document.body.appendChild(toggleBtn);
        const toast = el('div', { id: 'gpp-toast' }, '');
        document.body.appendChild(toast);

        const closeBtn = el('span', { style: { cursor: 'pointer', fontSize: '20px', opacity: '0.6' }, onclick: hidePanel }, '×');
        const header = el('div', { className: 'gpp-header' }, [ el('span', {}, '✨ 灵感快捷键'), closeBtn ]);
        const listContainer = el('div', { className: 'gpp-content', id: 'gpp-list' });

        const addBtn = el('button', { className: 'gpp-secondary-btn', onclick: () => openEditor(-1) }, '+ 添加新模板');
        const addContainer = el('div', { className: 'gpp-add-container' }, addBtn);

        const nameInput = el('input', { type: 'text', className: 'gpp-input', placeholder: '给模板起个名字...', id: 'gpp-edit-name' });
        const contentInput = el('textarea', { className: 'gpp-textarea', placeholder: '在这里输入提示词内容...', id: 'gpp-edit-content' });
        const cancelBtn = el('button', { className: 'gpp-secondary-btn', onclick: closeEditor }, '取消');
        const saveBtn = el('button', { className: 'gpp-primary-btn', onclick: saveEditor }, '保存模板');
        const actions = el('div', { className: 'gpp-actions' }, [cancelBtn, saveBtn]);
        const editorDiv = el('div', { className: 'gpp-editor', id: 'gpp-editor' }, [ nameInput, contentInput, actions ]);

        const panel = el('div', { id: 'gemini-prompt-panel' }, [ header, listContainer, addContainer, editorDiv ]);
        document.body.appendChild(panel);

        domCache = { panel, listContainer, editorDiv, nameInput, contentInput, toast };
    }

    // === 主题检测 ===
    function updateTheme() {
        const panel = document.getElementById('gemini-prompt-panel');
        if (!panel) return;

        // 检测 Gemini 的深色模式类名 (通常在 body 或 html 上)
        const isDark = document.body.classList.contains('dark') ||
                       document.body.getAttribute('data-theme') === 'dark' ||
                       window.getComputedStyle(document.body).backgroundColor === 'rgb(19, 19, 20)' ||
                       window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (isDark) {
            panel.classList.add('gpp-dark-mode');
        } else {
            panel.classList.remove('gpp-dark-mode');
        }
    }

    function showToast(message) {
        domCache.toast.textContent = message;
        domCache.toast.classList.add('show');
        setTimeout(() => { domCache.toast.classList.remove('show'); }, 2000);
    }

    function togglePanel() {
        const panel = domCache.panel;
        const isHidden = panel.style.display === 'none' || panel.style.display === '';

        updateTheme(); // 每次打开时检测主题

        if (isHidden) {
            panel.style.display = 'flex';
            // 强制重绘以触发 transition
            requestAnimationFrame(() => panel.classList.add('active'));
            renderList();
        } else {
            hidePanel();
        }
    }

    function hidePanel() {
        const panel = domCache.panel;
        panel.classList.remove('active');
        setTimeout(() => { panel.style.display = 'none'; }, 300); // 等待动画结束
    }

    function renderList() {
        const container = domCache.listContainer;
        while (container.firstChild) container.removeChild(container.firstChild);

        promptData.forEach((item, index) => {
            const radio = el('input', {
                type: 'radio', name: 'gpp-active', className: 'gpp-radio',
                checked: item.active ? 'checked' : null,
                onclick: (e) => { e.stopPropagation(); setActive(index); }
            });
            radio.checked = item.active;

            const nameSpan = el('span', { className: 'gpp-name', title: item.content }, item.name);

            // 使用 SVG 图标提升质感
            const editBtn = el('button', { className: 'gpp-btn', title: '编辑', onclick: (e) => { e.stopPropagation(); openEditor(index); } }, '✎');
            const delBtn = el('button', { className: 'gpp-btn', title: '删除', onclick: (e) => { e.stopPropagation(); deleteItem(index); } }, '✕');

            const row = el('div', { className: 'gpp-item', onclick: () => setActive(index) }, [radio, nameSpan, editBtn, delBtn]);
            container.appendChild(row);
        });
    }

    function setActive(index) {
        promptData.forEach(p => p.active = false);
        promptData[index].active = true;
        saveData();
        renderList();
    }

    function deleteItem(index) {
        if (confirm(`确定要删除 "${promptData[index].name}" 吗?`)) {
            promptData.splice(index, 1);
            if (promptData.length === 0) promptData.push({name: "默认", content: "", active: true});
            else if (!promptData.some(p=>p.active)) promptData[0].active = true;
            saveData();
            renderList();
        }
    }

    let currentEditIndex = -1;
    function openEditor(index) {
        currentEditIndex = index;
        const item = index === -1 ? {name:'', content:''} : promptData[index];
        domCache.nameInput.value = item.name;
        domCache.contentInput.value = item.content;

        // 滑动显示编辑器
        domCache.editorDiv.style.display = 'block';
        domCache.listContainer.style.display = 'none';
        domCache.panel.querySelector('.gpp-add-container').style.display = 'none';

        domCache.nameInput.focus();
    }

    function closeEditor() {
        domCache.editorDiv.style.display = 'none';
        domCache.listContainer.style.display = 'block';
        domCache.panel.querySelector('.gpp-add-container').style.display = 'block';
    }

    function saveEditor() {
        const name = domCache.nameInput.value.trim() || "未命名模板";
        const content = domCache.contentInput.value;
        if (currentEditIndex === -1) {
            promptData.push({ name, content, active: promptData.length === 0 });
        } else {
            promptData[currentEditIndex].name = name;
            promptData[currentEditIndex].content = content;
        }
        saveData();
        closeEditor();
        renderList();
    }

    // === 核心逻辑：智能插入与光标控制 (保持 V8.4 的稳健逻辑) ===
    function getEditor() {
        const active = document.activeElement;
        if (active && (active.isContentEditable || active.tagName === 'TEXTAREA' || active.getAttribute('role') === 'textbox')) {
            return active;
        }
        return document.querySelector('.ql-editor, [contenteditable="true"], textarea');
    }

    function insertPrompt(editor) {
        if (isProcessing) return;
        isProcessing = true;

        const content = getActiveContent();
        if (!content) { isProcessing = false; return; }

        const currentText = editor.textContent || editor.value || "";
        if (currentText.includes(DUPLICATE_MARKER)) {
            showToast("✨ 提示词已存在，无需重复添加");
            isProcessing = false;
            return;
        }

        try {
            editor.focus();
            const selection = window.getSelection();
            let savedRange = null;
            if (selection.rangeCount > 0) savedRange = selection.getRangeAt(0).cloneRange();

            // 1. 将光标移到末尾追加内容
            const endRange = document.createRange();
            endRange.selectNodeContents(editor);
            endRange.collapse(false);
            selection.removeAllRanges();
            selection.addRange(endRange);

            const success = document.execCommand('insertText', false, content);
            if (!success) {
                editor.textContent += content;
                editor.dispatchEvent(new Event('input', { bubbles: true }));
            }

            // 2. 恢复光标到原来的位置
            if (savedRange) {
                setTimeout(() => {
                    selection.removeAllRanges();
                    selection.addRange(savedRange);
                }, 0);
            }
            showToast("✨ 提示词已智能植入");
        } catch (e) {
            console.error("Gemini Prompt Error:", e);
        } finally {
            setTimeout(() => isProcessing = false, 200);
        }
    }

    function onKeyDown(e) {
        if (e.key !== ' ' && e.code !== 'Space') {
            lastSpaceTime = 0;
            return;
        }
        const editor = getEditor();
        if (!editor) return;

        const now = Date.now();
        if (now - lastSpaceTime < DOUBLE_SPACE_THRESHOLD) {
            e.preventDefault();
            e.stopImmediatePropagation();
            setTimeout(() => insertPrompt(editor), 10);
            lastSpaceTime = 0;
        } else {
            lastSpaceTime = now;
        }
    }

    function init() {
        createStyles();
        createUI();
        document.removeEventListener('keydown', onKeyDown, true);
        document.addEventListener('keydown', onKeyDown, { capture: true, passive: false });

        // 监控主题变化
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    // 兜底机制：防止页面动态加载导致按钮消失
    setInterval(() => {
        if (!document.getElementById('gemini-prompt-toggle')) init();
    }, 2000);

})();