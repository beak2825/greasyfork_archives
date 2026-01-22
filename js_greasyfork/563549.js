// ==UserScript==
// @name         YouTube 搜索：上传日期
// @namespace    https://greasyfork.org/users/yourusername
// @version      1.0
// @description  在 YouTube 搜索栏添加“上传日期”按钮，点击即可按上传日期筛选搜索结果。
// @author       NTNK
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563549/YouTube%20%E6%90%9C%E7%B4%A2%EF%BC%9A%E4%B8%8A%E4%BC%A0%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/563549/YouTube%20%E6%90%9C%E7%B4%A2%EF%BC%9A%E4%B8%8A%E4%BC%A0%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addButton() {
        // 找话筒按钮
        const micBtn = document.querySelector('#voice-search-button');
        if (!micBtn) return;

        // 防重复
        if (document.getElementById('yt-upload-date-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'yt-upload-date-btn';
        btn.textContent = '上传日期';

        // 样式（原生风 + 深浅色自适配）
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
            outline: none;
        `;

        // hover
        btn.addEventListener('mouseenter', () => {
            btn.style.background =
                'var(--yt-spec-badge-chip-hover-background)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background =
                'var(--yt-spec-badge-chip-background)';
        });

        // focus（键盘导航）
        btn.addEventListener('focus', () => {
            btn.style.boxShadow =
                '0 0 0 2px var(--yt-spec-outline)';
        });
        btn.addEventListener('blur', () => {
            btn.style.boxShadow = 'none';
        });

        btn.onclick = () => {
            const url = new URL(location.href);
            if (!url.searchParams.has('search_query')) return;

            // YouTube 搜索参数 sp=CAI= 表示按“上传日期”排序
            url.searchParams.set('sp', 'CAI=');
            location.assign(url.toString());
        };

        // 插到话筒按钮右边
        micBtn.insertAdjacentElement('afterend', btn);
    }

    // 初次加载
    addButton();

    // SPA 路由变化
    window.addEventListener('yt-navigate-finish', addButton);
})();

