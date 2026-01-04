// ==UserScript==
// @name         VSThouse 搜索结果合并全部页并时间倒序
// @namespace    https://example.com
// @version      2.1
// @description  自动抓取 1-10 页结果，合并后按发布时间倒序
// @author       Ginkoro with Kimi K2
// @match        https://vsthouse.ru/search/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548164/VSThouse%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%90%88%E5%B9%B6%E5%85%A8%E9%83%A8%E9%A1%B5%E5%B9%B6%E6%97%B6%E9%97%B4%E5%80%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/548164/VSThouse%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%90%88%E5%B9%B6%E5%85%A8%E9%83%A8%E9%A1%B5%E5%B9%B6%E6%97%B6%E9%97%B4%E5%80%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- 工具函数 ---------- */
    const parseDate = str => new Date(str.replace(' ', 'T') + 'Z').getTime();

    const getTimeFromBlock = block => {
        const d = block.querySelector('.eDetails');
        if (!d) return 0;
        const m = d.textContent.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
        return m ? parseDate(m[0]) : 0;
    };

    const htmlToDoc = html => new DOMParser().parseFromString(html, 'text/html');

    /* ---------- 从提示文字里算出真实页数 ---------- */
    /* ---------- 稳定提取总条数 ---------- */
    function getTotalPages() {
        // 目标 div 是 .content-padding 下第二个 div
        const infoDiv = document.querySelector('.content-padding > div:nth-child(2)');
        if (!infoDiv) return 1;

        // 提取 “из <b>20065</b>” 中的数字
        const m = infoDiv.innerHTML.match(/из\s*<b>(\d+)<\/b>/i);
        const total = m ? parseInt(m[1], 10) : 0;

        return Math.min(10, Math.max(1, Math.ceil(total / 100)));
    }

    /* ---------- 主流程 ---------- */
    async function run() {
        const container = document.querySelector('.content-padding');
        if (!container) return;

        /* 1. 直接用已加载的第 1 页算页数 */
        const totalPages = getTotalPages();

        /* 2. 构建剩余页链接（保留所有查询参数，只改 p） */
        const pagesToFetch = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        const baseURL = new URL(location.href);
        baseURL.searchParams.delete('p');
        // 先删掉旧 p，后面再设

        const tasks = pagesToFetch.map(p => {
            const u = new URL(baseURL);
            u.searchParams.set('p', p);
            return fetch(u.href, { credentials: 'include' })
                   .then(r => r.text())
                   .then(html => Array.from(htmlToDoc(html).querySelectorAll('table.eBlock')));
        });

        /* 3. 第 1 页结果直接复用 */
        const firstPageBlocks = Array.from(document.querySelectorAll('table.eBlock'));
        const otherBlocks = (await Promise.all(tasks)).flat();
        const allBlocks = [...firstPageBlocks, ...otherBlocks];

        /* 4. 排序 */
        allBlocks.sort((a, b) => getTimeFromBlock(b) - getTimeFromBlock(a));

        /* 5. 一次性清空并插入 */
        const pager = container.querySelector('div[align="center"]');
        container.querySelectorAll('table.eBlock, br').forEach(n => n.remove());

        allBlocks.forEach((block, idx) => {
            container.appendChild(block);
            if (idx < allBlocks.length - 1) container.appendChild(document.createElement('br'));
        });
        if (pager) container.appendChild(pager);
    }

    run().catch(console.error);
})();