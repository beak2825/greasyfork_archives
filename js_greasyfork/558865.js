// ==UserScript==
// @name         Google 搜索真无限滚动（拼接结果 + 页数显示）
// @namespace    https://tampermonkey.net/
// @version      2.0
// @description  鼠标滚动到底部时加载并拼接 Google 搜索下一页结果，右下角显示已加载页数
// @author       pianha
// @match        https://www.google.com/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558865/Google%20%E6%90%9C%E7%B4%A2%E7%9C%9F%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%EF%BC%88%E6%8B%BC%E6%8E%A5%E7%BB%93%E6%9E%9C%20%2B%20%E9%A1%B5%E6%95%B0%E6%98%BE%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558865/Google%20%E6%90%9C%E7%B4%A2%E7%9C%9F%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%EF%BC%88%E6%8B%BC%E6%8E%A5%E7%BB%93%E6%9E%9C%20%2B%20%E9%A1%B5%E6%95%B0%E6%98%BE%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let loading = false;
    let pageCount = 1;
    let lastWheelTime = 0;

    /* ================= 工具函数 ================= */

    function isAtBottom() {
        return window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 120;
    }

    function getNextPageUrl() {
        const link =
            document.querySelector('a#pnnext') ||
            document.querySelector('a[aria-label="Next page"]') ||
            document.querySelector('a[aria-label="下一页"]');

        return link ? link.href : null;
    }

    function getResultContainer(doc = document) {
        // Google 主搜索结果区
        return doc.querySelector('#search');
    }

    /* ================= UI：页数角标 ================= */

    const badge = document.createElement('div');
    badge.style.cssText = `
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 9999;
        background: rgba(0,0,0,0.75);
        color: #fff;
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 13px;
        font-family: system-ui;
        box-shadow: 0 4px 12px rgba(0,0,0,.25);
        user-select: none;
    `;
    badge.textContent = `已加载第 ${pageCount} 页`;
    document.body.appendChild(badge);

    function updateBadge() {
        badge.textContent = `已加载第 ${pageCount} 页`;
    }

    /* ================= 核心：加载并拼接 ================= */

    async function loadNextPage() {
        if (loading) return;

        const nextUrl = getNextPageUrl();
        if (!nextUrl) return;

        loading = true;

        try {
            const res = await fetch(nextUrl, {
                credentials: 'same-origin'
            });
            const html = await res.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const newResults = getResultContainer(doc);
            const currentResults = getResultContainer(document);

            if (!newResults || !currentResults) return;

            // 只追加搜索结果节点
            Array.from(newResults.children).forEach(node => {
                currentResults.appendChild(node);
            });

            // 更新“下一页”链接（关键）
            const newNext =
                doc.querySelector('a#pnnext') ||
                doc.querySelector('a[aria-label="Next page"]') ||
                doc.querySelector('a[aria-label="下一页"]');

            const oldNext =
                document.querySelector('a#pnnext') ||
                document.querySelector('a[aria-label="Next page"]') ||
                document.querySelector('a[aria-label="下一页"]');

            if (oldNext && newNext) {
                oldNext.href = newNext.href;
            }

            pageCount++;
            updateBadge();

        } catch (e) {
            console.error('加载下一页失败', e);
        } finally {
            loading = false;
        }
    }

    /* ================= 只监听鼠标滚轮 ================= */

    window.addEventListener(
        'wheel',
        () => {
            const now = Date.now();
            if (now - lastWheelTime < 250) return;
            lastWheelTime = now;

            if (isAtBottom()) {
                loadNextPage();
            }
        },
        { passive: true }
    );
})();
