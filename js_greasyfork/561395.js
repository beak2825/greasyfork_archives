// ==UserScript==
// @name         沐锦 API 价格统计与排序工具
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  计算提示和补全价格的平均值、中值（<=3行取最大值，>3行取中间偏后），按价格排序。点击数字可复制。
// @author       api.21zys.com
// @match        http://*/pricing
// @match        https://*/pricing
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561395/%E6%B2%90%E9%94%A6%20API%20%E4%BB%B7%E6%A0%BC%E7%BB%9F%E8%AE%A1%E4%B8%8E%E6%8E%92%E5%BA%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561395/%E6%B2%90%E9%94%A6%20API%20%E4%BB%B7%E6%A0%BC%E7%BB%9F%E8%AE%A1%E4%B8%8E%E6%8E%92%E5%BA%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 样式注入 ---
    const css = `
        .api-stat-value {
            cursor: pointer;
            border-bottom: 1px dashed #999;
            transition: all 0.2s;
            position: relative;
            display: inline-block;
        }
        .api-stat-value:hover {
            color: #1890ff;
            border-bottom-color: #1890ff;
            background-color: rgba(24, 144, 255, 0.1);
        }
        .api-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
            animation: fadeInOut 2s ease-in-out forwards;
        }
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -10px); }
            10% { opacity: 1; transform: translate(-50%, 0); }
            80% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -10px); }
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // --- 辅助函数 ---

    function showToast(text) {
        const toast = document.createElement('div');
        toast.className = 'api-toast';
        toast.textContent = text;
        document.body.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 2000);
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(`已复制: ${text}`);
            }).catch(err => {
                console.error('复制失败', err);
            });
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast(`已复制: ${text}`);
        }
    }

    function parsePrice(text) {
        if (!text) return 0;
        const numStr = text.replace(/[^\d.]/g, '');
        return parseFloat(numStr) || 0;
    }

    function calculateAverage(arr) {
        if (arr.length === 0) return 0;
        const sum = arr.reduce((a, b) => a + b, 0);
        return (sum / arr.length).toFixed(5);
    }

    // --- 修改后的中值逻辑 ---
    // 1. 排序
    // 2. 如果数量 <= 3，直接取最后一个（最大值）
    // 3. 如果数量 > 3，取中间位置（偶数取高位）
    function calculateMedian(arr) {
        if (arr.length === 0) return 0;

        // 从小到大排序
        const sorted = [...arr].sort((a, b) => a - b);

        // 特殊逻辑：行数 <= 3 时，取最后一个
        if (sorted.length <= 3) {
            return sorted[sorted.length - 1].toFixed(5);
        }

        // 常规逻辑
        const mid = Math.floor(sorted.length / 2);
        return sorted[mid].toFixed(5);
    }

    function wrapCellContent(element, price) {
        if (!element) return;
        if (element.querySelector('.api-stat-value')) return;

        const originalText = element.innerText;
        element.innerHTML = `<span class="api-stat-value"
                                   title="点击复制纯数字: ${price}"
                                   data-value="${price}">${originalText}</span>`;
    }

    // --- 核心逻辑 ---

    function processTable(tableBodyWrapper) {
        const table = tableBodyWrapper.querySelector('table.semi-table');
        if (!table) return;
        const tbody = table.querySelector('tbody.semi-table-tbody');
        if (!tbody) return;

        // 事件委托
        tbody.addEventListener('click', (e) => {
            const target = e.target.closest('.api-stat-value');
            if (target) {
                const val = target.getAttribute('data-value');
                if (val) {
                    copyToClipboard(val);
                    e.stopPropagation();
                }
            }
        });

        const rows = Array.from(tbody.querySelectorAll('tr.semi-table-row'));
        if (rows.length === 0) return;

        const rowData = rows.map(row => {
            const promptCell = row.querySelector('td[aria-colindex="3"] .font-semibold') || row.querySelector('td:nth-child(3) .font-semibold');
            const completionCell = row.querySelector('td[aria-colindex="4"] .font-semibold') || row.querySelector('td:nth-child(4) .font-semibold');

            const pPrice = promptCell ? parsePrice(promptCell.innerText) : 0;
            const cPrice = completionCell ? parsePrice(completionCell.innerText) : 0;

            if (promptCell) wrapCellContent(promptCell, pPrice);
            if (completionCell) wrapCellContent(completionCell, cPrice);

            return { element: row, promptPrice: pPrice, completionPrice: cPrice };
        });

        const promptPrices = rowData.map(d => d.promptPrice);
        const completionPrices = rowData.map(d => d.completionPrice);
        const stats = {
            promptAvg: calculateAverage(promptPrices),
            promptMed: calculateMedian(promptPrices),
            compAvg: calculateAverage(completionPrices),
            compMed: calculateMedian(completionPrices)
        };

        rowData.sort((a, b) => {
            if (a.promptPrice !== b.promptPrice) return a.promptPrice - b.promptPrice;
            return a.completionPrice - b.completionPrice;
        });

        rowData.forEach(item => tbody.appendChild(item.element));

        const statsDiv = document.createElement('div');
        statsDiv.className = 'api-price-stats-panel';
        statsDiv.style.cssText = `
            background: #fcfcfc;
            border: 1px solid #e1e3e5;
            border-radius: 8px;
            padding: 12px 15px;
            margin-bottom: 12px;
            font-size: 13px;
            color: #333;
            display: flex;
            justify-content: space-around;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
            user-select: none;
        `;

        const createItem = (label, val) => `
            <div style="margin: 3px 0;">
                ${label}:
                <span class="api-stat-value"
                      title="点击复制纯数字: ${val}"
                      data-value="${val}"
                      style="font-family: monospace; font-weight: bold;">
                   ¥${val}
                </span>
            </div>
        `;

        statsDiv.innerHTML = `
            <div style="text-align:center;">
                <div style="font-weight:bold; color: var(--semi-color-warning, #ff9800); margin-bottom:4px;">提示 (Prompt)</div>
                ${createItem('平均', stats.promptAvg)}
                ${createItem('中值', stats.promptMed)}
            </div>
            <div style="width: 1px; background: #eee;"></div>
            <div style="text-align:center;">
                <div style="font-weight:bold; color: var(--semi-color-warning, #ff9800); margin-bottom:4px;">补全 (Completion)</div>
                ${createItem('平均', stats.compAvg)}
                ${createItem('中值', stats.compMed)}
            </div>
        `;

        statsDiv.addEventListener('click', (e) => {
            const target = e.target.closest('.api-stat-value');
            if (target) {
                const val = target.getAttribute('data-value');
                if (val) copyToClipboard(val);
            }
        });

        tableBodyWrapper.insertBefore(statsDiv, table);
    }

    // --- 监听器 ---

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const targets = document.querySelectorAll('.semi-table-body');
                targets.forEach(target => {
                    if (target.dataset.priceProcessed === 'true') return;

                    const hasRows = target.querySelectorAll('tr.semi-table-row').length > 0;
                    if (hasRows) {
                        target.dataset.priceProcessed = 'true';
                        setTimeout(() => processTable(target), 50);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();