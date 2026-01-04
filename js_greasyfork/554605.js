// ==UserScript==
// @name         X 用户备注
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.1
// @description  为 X 用户添加自定义备注
// @license      MIT
// @icon         https://x.com/favicon.ico
// @author       SI Xiaolong
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/554605/X%20%E7%94%A8%E6%88%B7%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554605/X%20%E7%94%A8%E6%88%B7%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储用户备注
    const notes = {};

    // 加载所有备注
    function loadNotes() {
        const saved = GM_getValue('userNotes', '{}');
        Object.assign(notes, JSON.parse(saved));
    }

    // 保存备注
    function saveNote(username, note) {
        if (note.trim()) {
            notes[username] = note;
        } else {
            delete notes[username];
        }
        GM_setValue('userNotes', JSON.stringify(notes));
    }

    // 创建备注元素
    function createNoteElement(username, note) {
        const noteSpan = document.createElement('span');
        noteSpan.className = 'user-note-custom';
        noteSpan.style.cssText = `
            margin-left: 6px;
            padding: 2px 8px;
            background: #1d9bf0;
            color: white;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
        `;
        noteSpan.textContent = note;
        noteSpan.title = '点击编辑备注';

        noteSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            showEditDialog(username, note);
        });

        return noteSpan;
    }

    // 创建添加备注按钮
    function createAddButton(username) {
        const btn = document.createElement('button');
        btn.className = 'add-note-btn';
        btn.style.cssText = `
            margin-left: 6px;
            padding: 2px 8px;
            background: #eff3f4;
            color: #536471;
            border: none;
            border-radius: 12px;
            font-size: 13px;
            cursor: pointer;
            font-weight: 500;
        `;
        btn.textContent = '+ 备注';
        btn.title = '添加备注';

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            showEditDialog(username, '');
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#e7e9ea';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#eff3f4';
        });

        return btn;
    }

    // 显示编辑对话框
    function showEditDialog(username, currentNote) {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            background: white;
            padding: 24px;
            border-radius: 16px;
            width: 400px;
            max-width: 90%;
        `;

        box.innerHTML = `
            <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">
                为 @${username} 添加备注
            </h2>
            <input type="text" id="noteInput" value="${currentNote}"
                   style="width: 100%; padding: 12px; border: 1px solid #cfd9de;
                          border-radius: 8px; font-size: 15px; box-sizing: border-box;"
                   placeholder="输入备注内容" />
            <div style="margin-top: 16px; display: flex; gap: 12px; justify-content: flex-end;">
                <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #cfd9de;
                        background: white; border-radius: 20px; cursor: pointer; font-weight: 600;">
                    取消
                </button>
                <button id="deleteBtn" style="padding: 10px 20px; border: 1px solid #f4212e;
                        background: white; color: #f4212e; border-radius: 20px; cursor: pointer; font-weight: 600;">
                    删除备注
                </button>
                <button id="saveBtn" style="padding: 10px 20px; border: none;
                        background: #1d9bf0; color: white; border-radius: 20px; cursor: pointer; font-weight: 600;">
                    保存
                </button>
            </div>
        `;

        dialog.appendChild(box);
        document.body.appendChild(dialog);

        const input = box.querySelector('#noteInput');
        input.focus();
        input.select();

        const save = () => {
            saveNote(username, input.value);
            document.body.removeChild(dialog);
            updateAllNotes();
        };

        box.querySelector('#saveBtn').addEventListener('click', save);
        box.querySelector('#cancelBtn').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        box.querySelector('#deleteBtn').addEventListener('click', () => {
            saveNote(username, '');
            document.body.removeChild(dialog);
            updateAllNotes();
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') save();
        });

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                document.body.removeChild(dialog);
            }
        });
    }

    // 处理用户名元素
    function processUserElement(element) {
        if (element.hasAttribute('data-note-processed')) return;
        element.setAttribute('data-note-processed', 'true');

        const linkElement = element.querySelector('a[href^="/"]');
        if (!linkElement) return;

        const href = linkElement.getAttribute('href');
        const match = href.match(/^\/([^\/]+)/);
        if (!match) return;

        const username = match[1];
        if (!username || username === 'i' || username === 'home') return;

        const existingNote = element.querySelector('.user-note-custom');
        if (existingNote) existingNote.remove();

        const existingBtn = element.querySelector('.add-note-btn');
        if (existingBtn) existingBtn.remove();

        const note = notes[username];
        const targetElement = element.querySelector('[dir="ltr"]') || element;

        if (note) {
            targetElement.appendChild(createNoteElement(username, note));
        } else {
            targetElement.appendChild(createAddButton(username));
        }
    }

    // 更新所有备注
    function updateAllNotes() {
        document.querySelectorAll('[data-note-processed]').forEach(el => {
            el.removeAttribute('data-note-processed');
        });
        observeTimeline();
    }

    // 监听时间线变化
    function observeTimeline() {
        const selectors = [
            '[data-testid="User-Name"]',
            '[data-testid="UserName"]',
            '[data-testid="UserCell"]'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(processUserElement);
        });
    }

    // 初始化
    loadNotes();

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        observeTimeline();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始扫描
    setTimeout(observeTimeline, 1000);

    // 定期扫描
    setInterval(observeTimeline, 2000);
})();