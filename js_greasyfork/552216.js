// ==UserScript==
// @name         常用内容提示
// @namespace    https://yourname.example/snippets
// @version      1.0
// @description  点击按钮编辑内容，不自动选中文本，支持多行输入和快捷保存
// @author       You
// @match        https://pss-system.cponline.cnipa.gov.cn/seniorSearch
// @match        *://*.example.com/*   // ←←← 修改为你自己的网站，可以进行多个match匹配
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/552216/%E5%B8%B8%E7%94%A8%E5%86%85%E5%AE%B9%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552216/%E5%B8%B8%E7%94%A8%E5%86%85%E5%AE%B9%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'simple_snippet_content'; // 存储键名

    // 从 Tampermonkey 存储中读取内容
    async function loadContent() {
        return await GM_getValue(STORAGE_KEY, '');
    }

    // 保存内容到 Tampermonkey 存储
    async function saveContent(text) {
        await GM_setValue(STORAGE_KEY, text);
    }

    // 创建按钮元素
    const button = document.createElement('button');
    button.id = 'simple-snippet-button';
    button.textContent = '📋常用内容';
    button.style.cssText = `
        position: fixed;
        top: 20%;
        right: 20px;
        transform: translateY(-50%);
        z-index: 9999999;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px 10px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        transition: background 0.3s;
    `;

    button.onmouseover = () => {
        button.style.background = '#45a049';
    };

    button.onmouseout = () => {
        button.style.background = '#4CAF50';
    };

    // 创建文本框元素（初始隐藏）
    const textbox = document.createElement('textarea');
    textbox.id = 'simple-snippet-textbox';
    textbox.style.cssText = `
        position: fixed;
        top: 30%;
        right: 20px;
        transform: translateY(-50%);
        z-index: 9999998;
        width: 300px;
        height: 200px;
        padding: 10px;
        font-size: 14px;
        border: 2px solid #4CAF50;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        resize: both;
        display: none; /* 初始隐藏 */
    `;

    // 将按钮和文本框添加到页面
    document.body.appendChild(button);
    document.body.appendChild(textbox);

    // 显示文本框并加载内容
    button.onclick = async () => {
        const content = await loadContent();
        textbox.value = content;

        button.style.display = 'none';
        textbox.style.display = 'block';
        textbox.focus();
        // 不再自动选中全部文本，光标默认在末尾
        textbox.setSelectionRange(textbox.value.length, textbox.value.length);
    };

    // 当文本框失去焦点时，保存内容并恢复按钮
    textbox.onblur = async () => {
        const newContent = textbox.value;
        await saveContent(newContent);

        textbox.style.display = 'none';
        button.style.display = 'block';
    };

    // 按 Ctrl+Enter 或 Cmd+Enter 时保存并恢复
    textbox.onkeydown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault(); // 防止默认行为
            textbox.blur(); // 触发保存和恢复
        }
        // 其他按键（包括普通回车）不做处理，允许正常输入和换行
    };
})();



