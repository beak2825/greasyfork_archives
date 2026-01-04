// ==UserScript==
// @name         CTF Flag FinderX
// @version      1.0
// @description  自动检测 flag、敏感信息和注释并显示在独立可移动悬浮窗中（带复制按钮）
// @author       D0ubleD
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
// @namespace https://greasyfork.org/users/1527314
// @downloadURL https://update.greasyfork.org/scripts/552758/CTF%20Flag%20FinderX.user.js
// @updateURL https://update.greasyfork.org/scripts/552758/CTF%20Flag%20FinderX.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 配置部分 ===
    const DETECT_RULES = [
        { name: "CTF Flag", regex: /\b(?:ctfshow|dasctf|flag|CnHongKe)\s*\{[^}]*\}/gi },
        { name: "FLAG", regex: /FLAG\s*[:=]\s*[A-Za-z0-9_\-{}]+/gi },
        { name: "UUID", regex: /\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/gi },
        { name: "字符串", regex: /[A-Za-z0-9+/]{20,}={0,2}/g },
        { name: "花括号", regex: /(?<=\{)[^}]+(?=\})/g},
    ];

    // === 函数：查找匹配项 ===
    function findAllMatches(text) {
        const results = [];
        for (const { name, regex } of DETECT_RULES) {
            let match;
            while ((match = regex.exec(text)) !== null) {
                results.push({ type: name, value: match[0] });
            }
        }
        return results;
    }

    // === 函数：提取 HTML 注释 ===
    //function extractHtmlComments(html) {
        //const regex = /<!--([\s\S]*?)-->/g;
        ////const regex = /<!--([\s\S]*?)-->|\/\/[^\n\r]*|\/\*[\s\S]*?\*\//g;
        ////const regex = /<!--([\s\S]*?)-->|\/\*([\s\S]*?)\*\/|\/\/[^\n]*/g;
        //const comments = [];
        //let match;
        //while ((match = regex.exec(html)) !== null) {
        //    comments.push(match[1].trim());
        //}
        //return comments;
    //}
    function extractHtmlComments(html) {
        const htmlRegex = /<!--([\s\S]*?)-->/g;
        const jsRegex = /\/\/([^\n\r]*)/g;
        const comments = [];
        let match;
        // 匹配 HTML 注释
        while ((match = htmlRegex.exec(html)) !== null) {
            const content = match[1].trim();
            if (content) comments.push(content);
        }
        // 匹配 JS 注释
        while ((match = jsRegex.exec(html)) !== null) {
            const content = match[1].trim();
            if (content) comments.push(content);
        }
        return comments;
    }
    // === 函数：创建可复制的列表项 ===
    function createListItem(text, type) {
        const li = document.createElement('li');
        li.innerHTML = `<span class="type">[${type}]</span> <span class="value">${escapeHtml(text)}</span> <button class="copy-btn">复制</button>`;
        li.querySelector('.copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(text);
            li.querySelector('.copy-btn').textContent = '✅';
            setTimeout(() => (li.querySelector('.copy-btn').textContent = '复制'), 800);
        });
        return li;
    }

    // === 函数：转义 HTML ===
    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, s => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[s]));
    }

    // === 函数：创建悬浮窗 ===
    function createFloatingPanel(matches, comments) {
        const panel = document.createElement('div');
        panel.id = 'ctf-flag-finder-panel';
        panel.innerHTML = `
            <div class="header">
                🕵️‍♂️ CTF FinderX
                <div class="buttons">
                    <button class="rescan">重新扫描</button>
                    <button class="toggle">▲</button>
                </div>
            </div>
            <div class="content">
                <h4>匹配结果 (${matches.length})</h4>
                <ul class="matches"></ul>
                <hr>
                <h4>注释 (${comments.length})</h4>
                <ul class="comments"></ul>
            </div>
        `;

        document.body.appendChild(panel);

        const matchList = panel.querySelector('.matches');
        const commentList = panel.querySelector('.comments');

        if (matches.length) matches.forEach(m => matchList.appendChild(createListItem(m.value, m.type)));
        else matchList.innerHTML = '<li class="empty">未找到匹配项</li>';

        if (comments.length) comments.forEach(c => commentList.appendChild(createListItem(c, "HTML注释")));
        else commentList.innerHTML = '<li class="empty">无注释</li>';

        // 折叠逻辑
        const toggleBtn = panel.querySelector('.toggle');
        toggleBtn.addEventListener('click', () => {
            panel.classList.toggle('collapsed');
            toggleBtn.textContent = panel.classList.contains('collapsed') ? '▼' : '▲';
        });

        // 重新扫描逻辑
        panel.querySelector('.rescan').addEventListener('click', () => {
            panel.remove();
            main();
        });

        // 可拖动逻辑
        let isDragging = false;
        let offsetX, offsetY;
        panel.querySelector('.header').addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            panel.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = e.clientX - offsetX + 'px';
                panel.style.top = e.clientY - offsetY + 'px';
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.transition = '';
        });
    }

    // === 样式隔离 ===
    GM_addStyle(`
        #ctf-flag-finder-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            max-height: 65vh;
            background: #1e1e1e !important;
            color: #f1f1f1 !important;
            font-family: monospace !important;
            font-size: 12px !important;
            border: 1px solid #444 !important;
            border-radius: 10px !important;
            box-shadow: 0 0 10px rgba(0,0,0,0.6) !important;
            z-index: 999999 !important;
            overflow: hidden !important;
        }
        #ctf-flag-finder-panel .header {
            background: #333 !important;
            padding: 6px 8px !important;
            cursor: move !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            font-weight: bold !important;
        }
        #ctf-flag-finder-panel button {
            background: #555 !important;
            color: #eee !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 2px 6px !important;
            margin-left: 4px !important;
            cursor: pointer !important;
        }
        #ctf-flag-finder-panel button:hover {
            background: #777 !important;
        }
        #ctf-flag-finder-panel .content {
            padding: 6px 10px !important;
            overflow-y: auto !important;
            max-height: 55vh !important;
        }
        #ctf-flag-finder-panel.collapsed .content {
            display: none !important;
        }
        #ctf-flag-finder-panel ul {
            margin: 5px 0 !important;
            padding-left: 15px !important;
            list-style-type: disc !important;
        }
        #ctf-flag-finder-panel li {
            margin-bottom: 4px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 4px !important;
        }
        #ctf-flag-finder-panel li .type {
            color: #4FC3F7 !important;
        }
        #ctf-flag-finder-panel li .value {
            flex: 1 !important;
            color: #FFD54F !important;
            word-break: break-all !important;
        }
        #ctf-flag-finder-panel li .copy-btn {
            flex-shrink: 0 !important;
        }
        #ctf-flag-finder-panel li.empty {
            color: #999 !important;
            font-style: italic !important;
        }
        hr { border: 0; border-top: 1px solid #444 !important; margin: 8px 0 !important; }
    `);

    // === 主函数 ===
    function main() {
        const html = document.documentElement.outerHTML;
        const matches = findAllMatches(html);
        const comments = extractHtmlComments(html);
        if (matches.length > 0 || comments.length > 0) {
            createFloatingPanel(matches, comments);
        }
    }

    main();
})();