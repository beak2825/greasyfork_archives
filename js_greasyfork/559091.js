// ==UserScript==
// @name         Google Scholar Author Highlighter & Metrics
// @name:zh-CN   Google Scholar 第一作者/通讯作者高亮 & 统计
// @namespace    https://github.com/Huangmp1996
// @version      3.6
// @description  Highlight papers where you are the first or last author on Google Scholar, and display a metrics panel (Papers, Citations, h-index) at the top of the article list.
// @description:zh-CN 高亮 Google Scholar 档案页中的第一作者和最后作者（通讯作者）论文，并在文章列表顶部显示统计面板（文章数、引用数、h-index、h10-index）。
// @author       Mingpan Huang
// @match        https://scholar.google.com/citations*
// @match        https://scholar.google.com.hk/citations*
// @match        https://scholar.google.cn/citations*
// @match        https://scholar.google.co.jp/citations*
// @match        https://scholar.google.co.uk/citations*
// @match        https://scholar.google.de/citations*
// @match        https://scholar.google.fr/citations*
// @match        https://scholar.google.ca/citations*
// @match        https://scholar.google.com.au/citations*
// @match        https://scholar.google.com.br/citations*
// @match        https://scholar.google.it/citations*
// @match        https://scholar.google.es/citations*
// @match        https://scholar.google.nl/citations*
// @match        https://scholar.google.ru/citations*
// @match        https://scholar.google.se/citations*
// @match        https://scholar.google.ch/citations*
// @match        https://scholar.google.com.tw/citations*
// @match        https://scholar.google.co.in/citations*
// @match        https://scholar.google.com.sg/citations*
// @match        https://scholar.google.co.kr/citations*
// @match        *://scholar.google.*/citations*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559091/Google%20Scholar%20Author%20Highlighter%20%20Metrics.user.js
// @updateURL https://update.greasyfork.org/scripts/559091/Google%20Scholar%20Author%20Highlighter%20%20Metrics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Scholar Script V3.5: Loaded...");

    // --- 1. 样式定义 ---
    GM_addStyle(`
        /* 高亮颜色定义 */

        /* 第一作者 & 独立作者 (浅蓝色) */
        .highlight-first-author, .highlight-solo-author {
            background-color: #e6f7ff !important;
            border-left: 5px solid #0984e3;
        }

        /* 最后作者/通讯作者 (浅黄色) */
        .highlight-last-author {
            background-color: #fffbea !important;
            border-left: 5px solid #fdcb6e;
        }

        /* 统计面板 - 顶部横幅模式 */
        .metrics-panel-banner {
            background: #f8f9fa;
            border: 1px solid #ddd;
            padding: 12px 20px;
            margin: 0 0 20px 0; /* 底部留白 */
            border-radius: 8px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            font-family: Arial, sans-serif;
        }

        /* 横幅内的布局 */
        .metrics-panel-banner .metric-item {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .metrics-panel-banner .metric-val {
            font-size: 20px;
            font-weight: bold;
            color: #1a0dab;
        }
        .metrics-panel-banner .metric-lbl {
            font-size: 12px;
            color: #5f6368;
            margin-top: 4px;
        }

        /* 标题样式 */
        .metrics-header {
            font-weight: bold;
            color: #202124;
            margin-right: 20px;
            font-size: 14px;
        }
    `);

    // --- 2. 工具函数 ---
    function calculateHIndex(citations) {
        citations.sort((a, b) => b - a);
        let h = 0;
        for (let i = 0; i < citations.length; i++) {
            if (citations[i] >= i + 1) h = i + 1;
            else break;
        }
        return h;
    }

    // --- 3. 核心：精准匹配逻辑 ---
    function isAuthorMatch(authorName, targetLast, targetInitial) {
        const name = authorName.toUpperCase();
        if (!name.includes(targetLast)) return false;
        if (targetInitial) {
            const firstChar = name.charAt(0);
            if (firstChar !== targetInitial) {
                return false;
            }
        }
        return true;
    }

    // --- 4. 渲染面板 (仅横幅模式) ---
    function renderDashboard(stats) {
        // 直接寻找文章列表的主容器
        const mainContent = document.getElementById('gsc_art');
        if (!mainContent) return;

        let panel = document.getElementById('gs-custom-stats-panel');

        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'gs-custom-stats-panel';
            panel.className = 'metrics-panel-banner';
            // 插入到文章列表的最上方
            mainContent.prepend(panel);
        }

        // --- 关键修改：检查是否按年份排序 ---
        const urlParams = new URLSearchParams(window.location.search);
        const isSortedByDate = urlParams.get('sortby') === 'pubdate';

        // 只有在按年份排序且有数据时才显示 Since 20XX，否则为空
        const yearDisplay = (isSortedByDate && stats.minYear) ? `Since ${stats.minYear}` : '';

        // 渲染横幅 HTML
        panel.innerHTML = `
            <div class="metrics-header">
                <div>Highlight Metrics</div>
                <div style="font-size:11px; color:#d93025; font-weight:normal; height:13px;">${yearDisplay}</div>
            </div>
            <div class="metric-item"><span class="metric-val">${stats.count}</span><span class="metric-lbl">Papers</span></div>
            <div class="metric-item"><span class="metric-val">${stats.citations}</span><span class="metric-lbl">Citations</span></div>
            <div class="metric-item"><span class="metric-val">${stats.hIndex}</span><span class="metric-lbl">h-index</span></div>
            <div class="metric-item"><span class="metric-val">${stats.h10Index}</span><span class="metric-lbl">h10-index</span></div>
        `;
    }

    // --- 5. 主程序 ---
    function runScript() {
        const profileNameEl = document.getElementById('gsc_prf_in');
        if (!profileNameEl) return;

        // --- A. 解析当前学者姓名 ---
        const fullName = profileNameEl.innerText.trim();
        const nameParts = fullName.split(' ');

        let targetLast = "";
        let targetInitial = "";

        if (nameParts.length > 0) {
            targetLast = nameParts[nameParts.length - 1].toUpperCase();
            targetInitial = nameParts[0].charAt(0).toUpperCase();
        }

        // --- B. 遍历行 ---
        const rows = document.querySelectorAll('.gsc_a_tr');
        rows.forEach(row => {
            if (row.getAttribute('data-gs-processed')) return;

            const authorDiv = row.querySelector('.gs_gray');
            if (!authorDiv) return;

            const authorsText = authorDiv.innerText.replace('...', '');
            const authors = authorsText.split(',').map(s => s.trim()).filter(s => s);

            if (authors.length === 0) return;

            const fAuth = authors[0];
            const lAuth = authors[authors.length - 1];

            row.setAttribute('data-gs-processed', 'true');

            const isFirst = isAuthorMatch(fAuth, targetLast, targetInitial);
            const isLast = isAuthorMatch(lAuth, targetLast, targetInitial);

            // CSS类名已统一颜色
            if (isFirst && authors.length === 1) row.classList.add('highlight-solo-author');
            else if (isFirst) row.classList.add('highlight-first-author');
            else if (isLast) row.classList.add('highlight-last-author');
        });

        // --- C. 统计 ---
        setTimeout(() => {
            const targets = document.querySelectorAll('.highlight-first-author, .highlight-last-author, .highlight-solo-author');
            const citations = [];
            const years = [];

            targets.forEach(row => {
                const citeEl = row.querySelector('.gsc_a_ac');
                if (citeEl) {
                    const txt = citeEl.innerText.trim();
                    if (txt && txt !== '*') {
                        const num = parseInt(txt, 10);
                        if (!isNaN(num)) citations.push(num);
                    } else citations.push(0);
                }
                const yearEl = row.querySelector('.gsc_a_y');
                if (yearEl) {
                    const y = parseInt(yearEl.innerText.trim(), 10);
                    if (!isNaN(y) && y > 1900) years.push(y);
                }
            });

            const minYear = years.length ? Math.min(...years) : null;

            renderDashboard({
                count: targets.length,
                citations: citations.reduce((a,b)=>a+b, 0),
                hIndex: calculateHIndex(citations),
                h10Index: citations.filter(c=>c>=10).length,
                minYear: minYear
            });
        }, 100);
    }

    // --- 6. 启动 ---
    window.addEventListener('load', runScript);

    let attempts = 0;
    const initTimer = setInterval(() => {
        runScript();
        attempts++;
        if (attempts > 5) clearInterval(initTimer);
    }, 1000);

    const tableBody = document.getElementById('gsc_a_b');
    if (tableBody) {
        new MutationObserver((ms) => {
            if (ms.some(m => m.addedNodes.length > 0)) runScript();
        }).observe(tableBody, { childList: true, subtree: true });
    }

})();