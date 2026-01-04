// ==UserScript==
// @name         种子大小筛选器（自动分页筛选版）
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  根据大小筛选种子列表，浮窗回显输入值，分页刷新后自动筛选，保证内容完整
// @author       ChatGPT
// @match        *://*/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553811/%E7%A7%8D%E5%AD%90%E5%A4%A7%E5%B0%8F%E7%AD%9B%E9%80%89%E5%99%A8%EF%BC%88%E8%87%AA%E5%8A%A8%E5%88%86%E9%A1%B5%E7%AD%9B%E9%80%89%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553811/%E7%A7%8D%E5%AD%90%E5%A4%A7%E5%B0%8F%E7%AD%9B%E9%80%89%E5%99%A8%EF%BC%88%E8%87%AA%E5%8A%A8%E5%88%86%E9%A1%B5%E7%AD%9B%E9%80%89%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 创建浮窗 ---
    const floatDiv = document.createElement('div');
    floatDiv.style.position = 'fixed';
    floatDiv.style.top = '50px';
    floatDiv.style.right = '20px';
    floatDiv.style.width = '260px';
    floatDiv.style.padding = '10px';
    floatDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    floatDiv.style.border = '1px solid #ccc';
    floatDiv.style.borderRadius = '8px';
    floatDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    floatDiv.style.zIndex = 9999;
    floatDiv.style.fontSize = '14px';
    floatDiv.style.fontFamily = 'Arial, sans-serif';
    floatDiv.style.lineHeight = '1.5em';

    floatDiv.innerHTML = `
        <div style="margin-bottom: 5px;">
            <label>最小大小 (GB): </label>
            <input type="number" id="minSize" style="width: 60px;" placeholder="0">
        </div>
        <div style="margin-bottom: 5px;">
            <label>最大大小 (GB): </label>
            <input type="number" id="maxSize" style="width: 60px;" placeholder="1000">
        </div>
        <div style="margin-bottom: 5px;">
            <button id="filterBtn" style="margin-right: 5px;">筛选</button>
            <button id="resetBtn">重置</button>
        </div>
        <div id="resultCount" style="margin-top: 5px; font-weight: bold;">查询到: 0 个种子</div>
    `;
    document.body.appendChild(floatDiv);

    const filterBtn = document.getElementById('filterBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultCount = document.getElementById('resultCount');

    // --- 工具函数 ---
    function parseSize(sizeStr) {
        if (!sizeStr) return 0;
        sizeStr = sizeStr.trim();
        let value = parseFloat(sizeStr);
        if (sizeStr.toUpperCase().endsWith('GB')) return value;
        if (sizeStr.toUpperCase().endsWith('MB')) return value / 1024;
        if (sizeStr.toUpperCase().endsWith('KB')) return value / (1024 * 1024);
        return value;
    }

    function getRows() {
        const table = document.getElementById('torrenttable');
        if (!table) return [];
        // 返回最外层 tr
        return Array.from(table.querySelectorAll('tbody > tr'))
                    .filter(r => r.querySelector('td.rowfollow'));
    }

    // --- 筛选函数（只控制最外层 tr 显隐） ---
    function filterRows() {
        const min = parseFloat(document.getElementById('minSize').value) || 0;
        const max = parseFloat(document.getElementById('maxSize').value) || Infinity;

        // 保存输入框值到 localStorage
        localStorage.setItem('torrent_minSize', min);
        localStorage.setItem('torrent_maxSize', max);

        const rows = getRows();
        let count = 0;

        rows.forEach(row => {
            const sizeCell = row.querySelector('td:nth-child(5)');
            const sizeValue = parseSize(sizeCell?.innerText);
            if (sizeValue >= min && sizeValue <= max) {
                row.style.display = '';
                count++;
            } else {
                row.style.display = 'none';
            }
        });

        resultCount.textContent = `查询到: ${count} 个种子`;
    }

    function resetFilter() {
        document.getElementById('minSize').value = '';
        document.getElementById('maxSize').value = '';
        const rows = getRows();
        rows.forEach(row => row.style.display = '');
        resultCount.textContent = `查询到: ${rows.length} 个种子`;

        localStorage.removeItem('torrent_minSize');
        localStorage.removeItem('torrent_maxSize');
    }

    filterBtn.addEventListener('click', filterRows);
    resetBtn.addEventListener('click', resetFilter);

    // --- 页面加载后回显输入框值 ---
    window.addEventListener('load', () => {
        const savedMin = localStorage.getItem('torrent_minSize');
        const savedMax = localStorage.getItem('torrent_maxSize');

        if (savedMin !== null) document.getElementById('minSize').value = savedMin;
        if (savedMax !== null) document.getElementById('maxSize').value = savedMax;

        // 如果有值则自动筛选
        if (savedMin !== null || savedMax !== null) {
            filterRows();
        }
    });

    // --- 监听 tbody 内容变化（分页刷新后自动筛选） ---
    const tableBody = document.querySelector('#torrenttable tbody');
    if (tableBody) {
        const observer = new MutationObserver(() => {
            const savedMin = localStorage.getItem('torrent_minSize');
            const savedMax = localStorage.getItem('torrent_maxSize');
            if (savedMin !== null || savedMax !== null) {
                filterRows();
            }
        });
        observer.observe(tableBody, { childList: true, subtree: true });
    }

})();
