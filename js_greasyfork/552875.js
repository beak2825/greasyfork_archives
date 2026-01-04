// ==UserScript==
// @name         arXiv 笔记助手
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  在 arXiv 论文页面的右侧边栏添加一个与网站风格一致的笔记框，笔记会根据论文ID自动保存在本地。
// @author       haku
// @match        https://arxiv.org/abs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552875/arXiv%20%E7%AC%94%E8%AE%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552875/arXiv%20%E7%AC%94%E8%AE%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 从当前 URL 中提取论文 ID
     * @returns {string|null} 论文的唯一ID，如果找不到则返回 null
     */
    const getPaperId = () => {
        const pathParts = window.location.pathname.split('/');
        const potentialId = pathParts[pathParts.length - 1];
        if (potentialId && (potentialId.match(/^\d{4}\.\d{4,5}(v\d+)?$/) || potentialId.match(/^[a-z\-]+(\.[a-z\-]+)?\/\d{7}(v\d+)?$/))) {
            return potentialId;
        }
        return null;
    };

    const paperId = getPaperId();

    if (!paperId) {
        console.log("arXiv Note Taker: 未能从 URL 中识别出有效的论文 ID。");
        return;
    }

    const storageKey = `arxiv_note_${paperId}`;

    /**
     * 创建并注入笔记框的用户界面
     */
    const createNoteUI = () => {
        // 创建笔记区域的根容器，并使用 arXiv 的原生 CSS class 来统一风格
        const noteContainer = document.createElement('div');
        noteContainer.id = 'arxiv-note-container';
        // 使用 'extra-ref-cite' class 来模仿侧边栏其他区块的样式
        noteContainer.className = 'extra-ref-cite';

        // 创建标题，使用 h2 元素以匹配 "Access Paper" 的标题样式
        const title = document.createElement('h2');
        title.textContent = 'My Notes';
        // 移除标题的上边距以符合用户要求
        title.style.margin = '0';

        // 创建文本输入区域
        const noteTextarea = document.createElement('textarea');
        noteTextarea.id = 'arxiv-note-textarea';
        noteTextarea.placeholder = '在此处为这篇论文添加笔记...';
        noteTextarea.rows = 6;
        // 只保留功能性的 CSS，视觉样式由网站的 CSS 或浏览器默认值决定
        noteTextarea.style.cssText = `
            width: 100%;
            box-sizing: border-box;
            resize: vertical;
            margin-top: 0.5em; /* 在标题和输入框之间添加一点间距 */
        `;

        noteContainer.appendChild(title);
        noteContainer.appendChild(noteTextarea);

        // 将笔记框插入到 "Access Paper" (div.full-text) 模块的后面
        const fullTextElement = document.querySelector('div.full-text');
        if (fullTextElement) {
            // 使用 after 方法将其插入到目标元素之后
            fullTextElement.after(noteContainer);
        } else {
            console.error("arXiv Note Taker: 未能找到 'div.full-text' 容器。将尝试备用位置。");
            // 如果找不到目标位置，提供一个备用方案，避免脚本完全失效
            const extraServicesElement = document.querySelector('div.extra-services');
            if (extraServicesElement) {
                extraServicesElement.prepend(noteContainer);
            }
        }

        return noteTextarea;
    };

    /**
     * 从 localStorage 加载已保存的笔记
     * @param {HTMLTextAreaElement} textarea - 用于显示笔记的文本框元素
     */
    const loadNote = (textarea) => {
        const savedNote = localStorage.getItem(storageKey);
        if (savedNote) {
            textarea.value = savedNote;
        }
    };

    /**
     * 将当前笔记保存到 localStorage
     * @param {HTMLTextAreaElement} textarea - 包含笔记内容的文本框元素
     */
    const saveNote = (textarea) => {
        localStorage.setItem(storageKey, textarea.value);
    };


    // --- 脚本主程序 ---
    const noteTextarea = createNoteUI();
    loadNote(noteTextarea);
    noteTextarea.addEventListener('input', () => saveNote(noteTextarea));

})();

