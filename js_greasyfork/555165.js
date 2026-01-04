// ==UserScript==
// @name         GitHub -> zread.ai 左侧按钮
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  在 GitHub 仓库页面添加风格一致的 zread.ai 按钮，放在左侧，使用 base64 SVG 图标。
// @author       DBinK
// @match        https://github.com/*/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555165/GitHub%20-%3E%20zreadai%20%E5%B7%A6%E4%BE%A7%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/555165/GitHub%20-%3E%20zreadai%20%E5%B7%A6%E4%BE%A7%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 解析 owner 和 repo
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) return;
    const owner = pathParts[0];
    const repo = pathParts[1];
    const zreadUrl = `https://zread.ai/${owner}/${repo}`;

    // 创建按钮
    function createButton() {
        const ul = document.querySelector('ul.pagehead-actions');
        if (!ul) return;

        if (document.getElementById('open-on-zread-ai-btn')) return;

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = zreadUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.id = 'open-on-zread-ai-btn';
        a.className = 'btn-sm btn';
        a.title = `在 zread.ai 打开 ${owner}/${repo}`;

        // 使用 base64 SVG 图标
        const svgBase64 = "PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K";

        a.innerHTML = `
            <img src="data:image/svg+xml;base64,${svgBase64}" width="16" height="16" style="margin-right:4px; vertical-align:text-bottom;">
            <span>zread.ai</span>
        `;

        li.appendChild(a);
        ul.insertBefore(li, ul.firstChild);
    }

    // 监听 DOM 变化确保按钮存在
    function watchAndInsert() {
        createButton();

        const observer = new MutationObserver(() => {
            if (!document.getElementById('open-on-zread-ai-btn')) {
                createButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    watchAndInsert();
})();
