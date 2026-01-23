// ==UserScript==
// @name         YouTube 搜索：按上传日期排序
// @namespace    https://greasyfork.org/users/yourusername
// @version      1.0
// @description  在 YouTube 搜索栏添加“上传日期”按钮，点击即可让搜索结果按上传日期排序。
// @author       NTNK
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563549/YouTube%20%E6%90%9C%E7%B4%A2%EF%BC%9A%E6%8C%89%E4%B8%8A%E4%BC%A0%E6%97%A5%E6%9C%9F%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/563549/YouTube%20%E6%90%9C%E7%B4%A2%EF%BC%9A%E6%8C%89%E4%B8%8A%E4%BC%A0%E6%97%A5%E6%9C%9F%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addButton() {
        const micBtn = document.querySelector('#voice-search-button');
        if (!micBtn) return;

        if (document.getElementById('yt-upload-date-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'yt-upload-date-btn';
        btn.textContent = '上传日期';

        btn.style.cssText = `
            margin-left: 8px;
            padding: 0 12px;
            height: 32px;
            border-radius: 16px;
            border: none;
            background: var(--yt-spec-badge-chip-background);
            color: var(--yt-spec-text-primary);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        `;

        btn.onclick = () => {
            const input = document.querySelector('input[name="search_query"]');
            if (!input) return;

            const query = input.value.trim();
            if (!query) return;

            const url =
                '/results?search_query=' +
                encodeURIComponent(query) +
                '&sp=CAI=';

            // 强制真实导航，绕过 SPA
            window.location.href = url;
        };

        micBtn.insertAdjacentElement('afterend', btn);
    }

    // 初次 + SPA
    addButton();
    window.addEventListener('yt-navigate-finish', addButton);
})();

