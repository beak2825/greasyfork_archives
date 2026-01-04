// ==UserScript==
// @name         NGA 论坛阅读进度记忆（记住看到第几页）
// @namespace    https://example.com/
// @version      1.1
// @description  自动记录并高亮你看过的 NGA 帖子最远页数，下次打开会提示是否跳转到上次位置
// @match        https://bbs.nga.cn/read.php?tid=*
// @match        https://nga.178.com/read.php?tid=*
// @match        https://ngabbs.com/read.php?tid=*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558039/NGA%20%E8%AE%BA%E5%9D%9B%E9%98%85%E8%AF%BB%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BF%86%EF%BC%88%E8%AE%B0%E4%BD%8F%E7%9C%8B%E5%88%B0%E7%AC%AC%E5%87%A0%E9%A1%B5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558039/NGA%20%E8%AE%BA%E5%9D%9B%E9%98%85%E8%AF%BB%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BF%86%EF%BC%88%E8%AE%B0%E4%BD%8F%E7%9C%8B%E5%88%B0%E7%AC%AC%E5%87%A0%E9%A1%B5%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(location.href);

    // tid
    const tid = url.searchParams.get("tid");
    if (!tid) return;

    // --- 关键修复：第一页没有 page 参数，强制视为 1 ---
    const pageParam = url.searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    // -------------------------------------------------------

    const storageKey = "nga_read_progress_" + tid;

    // 读取记录
    const savedPage = parseInt(localStorage.getItem(storageKey) || "0", 10);

    // 打开帖子时如果有更远记录 → 询问跳转
    if (savedPage > page) {
        const wantJump = confirm(`你上次看到第 ${savedPage} 页，是否跳转？`);
        if (wantJump) {
            url.searchParams.set("page", savedPage);
            location.href = url.toString();
            return;
        }
    }

    // 更新记录
    if (page > savedPage) {
        localStorage.setItem(storageKey, String(page));
    }

    // 页面顶部提示条
    addProgressIndicator(savedPage);

    function addProgressIndicator(savedPage) {
        const bar = document.createElement("div");
        bar.textContent = savedPage
            ? `📘 已阅读至：第 ${savedPage} 页`
            : `📘 本帖未有阅读记录`;

        bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #0078ff;
            color: white;
            font-size: 14px;
            padding: 6px 12px;
            z-index: 99999;
            box-shadow: 0 2px 5px rgba(0,0,0,.3);
        `;
        document.body.appendChild(bar);

        // 避免遮挡正文
        document.body.style.marginTop = "34px";
    }

})();
