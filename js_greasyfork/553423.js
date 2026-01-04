// ==UserScript==
// @name         ITDog 测速结果通用排序
// @version      2.0
// @description  为 itdog.cn 网站的多种测速结果表格添加客户端排序功能。
// @match        *://*.itdog.cn/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.itdog.cn/favicon.ico
// @namespace https://greasyfork.org/users/1526786
// @downloadURL https://update.greasyfork.org/scripts/553423/ITDog%20%E6%B5%8B%E9%80%9F%E7%BB%93%E6%9E%9C%E9%80%9A%E7%94%A8%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/553423/ITDog%20%E6%B5%8B%E9%80%9F%E7%BB%93%E6%9E%9C%E9%80%9A%E7%94%A8%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationsList, obs) => {
        const table = document.querySelector('#pingres, #simpletable');
        if (table && table.querySelector('tbody tr.node_tr')) {
            initializeSorter(table);
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function initializeSorter(table) {
        const headers = table.querySelectorAll('thead th');
        const SORTABLE_COLUMN_NAMES = ['响应时间', '总耗时', '解析', '连接', '下载'];
        const activeSortableColumns = {};

        headers.forEach((th, index) => {
            const headerText = th.textContent.trim();
            if (SORTABLE_COLUMN_NAMES.includes(headerText)) {
                activeSortableColumns[headerText] = index;
            }
        });

        if (Object.keys(activeSortableColumns).length === 0) return;

        const style = document.createElement('style');
        style.innerHTML = `
            .sortable-header { cursor: pointer; position: relative; user-select: none; }
            .sort-icon::after { content: ''; display: inline-block; margin-left: 5px; opacity: 0.4; font-size: 0.8em; }
            .sortable-header[data-sort-direction="asc"] .sort-icon::after { content: '▲'; opacity: 1; }
            .sortable-header[data-sort-direction="desc"] .sort-icon::after { content: '▼'; opacity: 1; }
        `;
        document.head.appendChild(style);

        headers.forEach((th, index) => {
            if (Object.values(activeSortableColumns).includes(index)) {
                th.classList.add('sortable-header');
                const iconSpan = document.createElement('span');
                iconSpan.className = 'sort-icon';
                th.appendChild(iconSpan);
                th.addEventListener('click', () => sortTableByColumn(table, index));
            }
        });
    }

    /**
     * **核心修改点**
     * 将单元格文本转换为可比较的数值。
     * - "超时" 或无效文本被视为无穷大 (Infinity)，排在最后。
     * - "<1ms" 被视为 0，排在最前。
     * - 其他情况正常提取数值。
     * @param {string} text - 单元格的文本内容
     * @returns {number} - 用于排序的数值
     */
    function parseTimeValue(text) {
        const trimmedText = text.trim();

        // “超时”应排在最后
        if (trimmedText.includes('超时')) {
            return Infinity;
        }

        // “<1ms”应被视为一个非常小的值，这里用0来代表，确保它排在最前面
        if (trimmedText.startsWith('<')) {
            return 0;
        }

        // 尝试正常解析数值
        const numericValue = parseFloat(trimmedText);

        // 如果解析失败（比如单元格内容是"--"），也视为无穷大
        return isNaN(numericValue) ? Infinity : numericValue;
    }

    function sortTableByColumn(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const header = table.querySelector(`thead th:nth-child(${columnIndex + 1})`);
        const currentDirection = header.dataset.sortDirection;
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

        table.querySelectorAll('thead th.sortable-header').forEach(th => {
            if (th !== header) th.removeAttribute('data-sort-direction');
        });
        header.dataset.sortDirection = newDirection;

        const allNodeRows = Array.from(tbody.querySelectorAll('tr.node_tr'));
        const rowPairs = allNodeRows.map(row => {
            const nodeId = row.getAttribute('node');
            const infoRow = document.getElementById(`head_show_${nodeId}`);
            return { nodeRow: row, infoRow };
        });

        // 执行排序
        rowPairs.sort((a, b) => {
            const cellA = a.nodeRow.cells[columnIndex];
            const cellB = b.nodeRow.cells[columnIndex];

            const textA = cellA.querySelector('font')?.textContent || cellA.textContent;
            const textB = cellB.querySelector('font')?.textContent || cellB.textContent;

            // 使用新的解析函数
            const valA = parseTimeValue(textA);
            const valB = parseTimeValue(textB);

            if (valA === valB) return 0;

            return newDirection === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        const fragment = document.createDocumentFragment();
        rowPairs.forEach(pair => {
            fragment.appendChild(pair.nodeRow);
            if (pair.infoRow) fragment.appendChild(pair.infoRow);
        });

        tbody.innerHTML = '';
        tbody.appendChild(fragment);
    }
})();