// ==UserScript==
// @name         沐锦 API 价格统计工具
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @description  主页设置折扣，Dialog详情页自动识别货币。所有价格保留4位小数并向上取整(Ceil)，支持点击复制。
// @author       api.21zys.com & Gemini Optimized
// @match        http://*/pricing
// @match        https://*/pricing
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561395/%E6%B2%90%E9%94%A6%20API%20%E4%BB%B7%E6%A0%BC%E7%BB%9F%E8%AE%A1%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561395/%E6%B2%90%E9%94%A6%20API%20%E4%BB%B7%E6%A0%BC%E7%BB%9F%E8%AE%A1%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置常量 ---
    const STORAGE_KEY_PREFIX = 'api_pricing_discount_';

    // 输入框定位：主页面
    const MAIN_PAGE_ANCHOR_SELECTOR = 'div.pricing-search-row > div > div[role="combobox"]';

    // 表格定位：Dialog 弹窗
    const DIALOG_SELECTOR = 'div.semi-sidesheet > div[role="dialog"]';
    const DIALOG_TABLE_BODY_SELECTOR = '.semi-table-body';

    // --- 样式注入 ---
    const css = `
        /* 价格单元格容器 */
        .api-price-cell {
            display: flex;
            flex-direction: column;
            justify-content: center;
            line-height: 1.5;
        }

        /* 通用可点击样式 */
        .api-clickable-price {
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
            display: inline-block;
            font-family: monospace; /* 等宽字体对齐数字 */
            border-bottom: 1px dashed transparent;
        }

        /* 实付价 (主价格) */
        .api-stat-value {
            font-weight: 700; /* 加粗 */
            color: #1c1f23;   /* 深色 */
            border-bottom-color: #ccc;
        }
        .api-stat-value:hover {
            color: #1890ff;
            border-bottom-color: #1890ff;
            background-color: rgba(24, 144, 255, 0.1);
        }

        /* 原价 (辅助信息) */
        .api-original-price {
            font-size: 12px;
            color: #999;       /* 灰色 */
            font-weight: normal;
            margin-top: 1px;
            border-bottom-color: #e0e0e0;
        }
        .api-original-price:hover {
            color: #666;
            border-bottom-color: #999;
            background-color: rgba(0, 0, 0, 0.05);
        }

        .api-price-cell .api-original-price {
            display: inline-block;
        }

        /* 统计面板 */
        .api-price-stats-panel {
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
        }

        /* 提示信息 */
        .api-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 99999;
            pointer-events: none;
            animation: fadeInOut 2s ease-in-out forwards;
        }

        /* 输入框容器 */
        .api-discount-wrapper {
            display: flex;
            align-items: center;
            margin-right: 12px;
            background: #fff;
            padding: 0 8px;
            border-radius: 6px;
            border: 1px solid #d9d9d9;
            height: 32px;
            box-sizing: border-box;
        }
        .api-discount-input {
            width: 36px;
            padding: 0 2px;
            border: none;
            outline: none;
            margin: 0 4px;
            text-align: center;
            font-weight: bold;
            color: #1890ff;
            background: transparent;
            font-size: 14px;
        }
        .api-discount-input::-webkit-outer-spin-button,
        .api-discount-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
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

    // --- 辅助工具 ---

    function showToast(text) {
        const toast = document.createElement('div');
        toast.className = 'api-toast';
        toast.textContent = text;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function detectCurrencySymbol(text) {
        if (!text) return '';
        const match = text.match(/([^\d.\s]+)/);
        return match ? match[0] : '';
    }

    function copyToClipboard(text) {
        if (!text) return;
        // 复制纯数字
        const cleanText = text.replace(/[^\d.]/g, '');

        navigator.clipboard.writeText(cleanText).then(() => {
            showToast(`已复制: ${cleanText}`);
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = cleanText;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast(`已复制: ${cleanText}`);
        });
    }

    function parsePrice(text) {
        if (!text) return 0;
        const numStr = text.replace(/[^\d.]/g, '');
        return parseFloat(numStr) || 0;
    }

    /**
     * 核心格式化函数：保留4位小数，向上取整 (Ceil)
     * 1.23451 -> 1.2346
     * 1.23450 -> 1.2345
     */
    function formatPrice(num) {
        if (!num && num !== 0) return '0.0000';
        // 乘以10000，向上取整，再除以10000
        const ceiled = Math.ceil(num * 10000) / 10000;
        // 确保显示末尾的0
        return ceiled.toFixed(4);
    }

    function calculateAverage(arr) {
        if (arr.length === 0) return formatPrice(0);
        const sum = arr.reduce((a, b) => a + b, 0);
        return formatPrice(sum / arr.length);
    }

    function calculateMedian(arr) {
        if (arr.length === 0) return formatPrice(0);
        const sorted = [...arr].sort((a, b) => a - b);
        let val;
        if (sorted.length <= 3) {
            val = sorted[sorted.length - 1];
        } else {
            const mid = Math.floor(sorted.length / 2);
            val = sorted[mid];
        }
        return formatPrice(val);
    }

    function getDiscount() {
        const hostname = window.location.hostname;
        const stored = localStorage.getItem(STORAGE_KEY_PREFIX + hostname);
        return stored ? parseFloat(stored) : 100;
    }

    function setDiscount(val) {
        const hostname = window.location.hostname;
        localStorage.setItem(STORAGE_KEY_PREFIX + hostname, val);
    }

    // --- 核心逻辑 ---

    function injectDiscountInput() {
        if (document.querySelector('.api-discount-wrapper')) return;

        const combobox = document.querySelector(MAIN_PAGE_ANCHOR_SELECTOR);
        if (!combobox) return;

        const container = combobox.parentElement;
        if (!container) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'api-discount-wrapper';

        const labelBefore = document.createElement('span');
        labelBefore.innerText = '折扣:';
        labelBefore.style.fontSize = '13px';
        labelBefore.style.color = '#333';

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'api-discount-input';
        input.min = 1;
        input.max = 100;
        input.value = getDiscount();

        const labelAfter = document.createElement('span');
        labelAfter.innerText = '%';
        labelAfter.style.fontWeight = 'bold';
        labelAfter.style.color = '#666';

        wrapper.appendChild(labelBefore);
        wrapper.appendChild(input);
        wrapper.appendChild(labelAfter);

        container.insertBefore(wrapper, combobox);

        input.addEventListener('change', (e) => {
            let val = parseFloat(e.target.value);
            if (isNaN(val)) val = 100;
            if (val < 1) val = 1;
            if (val > 100) val = 100;
            e.target.value = val;
            setDiscount(val);

            const dialog = document.querySelector(DIALOG_SELECTOR);
            if (dialog) {
                processTable(dialog, true);
                showToast(`折扣 ${val}% 应用成功`);
            } else {
                showToast(`折扣已保存: ${val}%`);
            }
        });
    }

    function processTable(dialog, forceUpdate = false) {
        const tableBodyWrapper = dialog.querySelector(DIALOG_TABLE_BODY_SELECTOR);
        if (!tableBodyWrapper) return;

        if (tableBodyWrapper.dataset.apiProcessed === 'true' && !forceUpdate) return;

        const table = tableBodyWrapper.querySelector('table.semi-table');
        if (!table) return;
        const tbody = table.querySelector('tbody.semi-table-tbody');
        if (!tbody) return;

        const rows = Array.from(tbody.querySelectorAll('tr.semi-table-row'));
        if (rows.length === 0) return;

        const discountRate = getDiscount() / 100;
        let detectedSymbol = '';

        // 第一次遍历：缓存数据并探测货币符号
        rows.forEach(row => {
            if (!row.dataset.rawPrompt) {
                const pCell = row.querySelector('td[aria-colindex="3"] .font-semibold') || row.querySelector('td:nth-child(3) .font-semibold');
                const cCell = row.querySelector('td[aria-colindex="4"] .font-semibold') || row.querySelector('td:nth-child(4) .font-semibold');

                const pText = pCell ? pCell.innerText : (row.querySelector('td:nth-child(3)')?.innerText || '0');
                const cText = cCell ? cCell.innerText : (row.querySelector('td:nth-child(4)')?.innerText || '0');

                if (pText) row.dataset.rawPrompt = pText;
                if (cText) row.dataset.rawCompletion = cText;
            }

            if (!detectedSymbol) {
                const rawP = row.dataset.rawPrompt;
                const rawC = row.dataset.rawCompletion;
                if (rawP && /[0-9]/.test(rawP)) detectedSymbol = detectCurrencySymbol(rawP);
                if (!detectedSymbol && rawC && /[0-9]/.test(rawC)) detectedSymbol = detectCurrencySymbol(rawC);
            }
        });

        const currency = detectedSymbol || '';

        const rowData = rows.map(row => {
            const pText = row.dataset.rawPrompt || '0';
            const cText = row.dataset.rawCompletion || '0';

            const pPriceCurrent = parsePrice(pText);
            const cPriceCurrent = parsePrice(cText);

            // 计算原价
            const pPriceOriginal = discountRate > 0 ? (pPriceCurrent / discountRate) : pPriceCurrent;
            const cPriceOriginal = discountRate > 0 ? (cPriceCurrent / discountRate) : cPriceCurrent;

            // 格式化价格 (保留4位，向上取整)
            const pCurrStr = formatPrice(pPriceCurrent);
            const pOrigStr = formatPrice(pPriceOriginal);
            const cCurrStr = formatPrice(cPriceCurrent);
            const cOrigStr = formatPrice(cPriceOriginal);

            // 渲染单元格
            const renderCell = (idx, currStr, origStr) => {
                let cellWrapper = row.querySelector(`td:nth-child(${idx}) .font-semibold`);
                if (!cellWrapper) {
                     const td = row.querySelector(`td:nth-child(${idx})`);
                     if(!td) return;
                     if(!td.querySelector('.api-price-cell')) {
                         td.innerHTML = '';
                         cellWrapper = document.createElement('div');
                         td.appendChild(cellWrapper);
                     } else {
                         cellWrapper = td.querySelector('.api-price-cell');
                     }
                }

                let html = `<div class="api-price-cell">`;

                // 1. 实付价
                html += `<span class="api-clickable-price api-stat-value" data-value="${currStr}" title="点击复制实付价: ${currStr}">
                            ${currency}${currStr}
                         </span>`;

                // 2. 原价
                if (discountRate < 1) {
                    html += `<span class="api-clickable-price api-original-price" data-value="${origStr}" title="点击复制原价: ${origStr}">
                                原: ${currency}${origStr}
                             </span>`;
                }
                html += `</div>`;

                cellWrapper.innerHTML = html;
            };

            renderCell(3, pCurrStr, pOrigStr);
            renderCell(4, cCurrStr, cOrigStr);

            return {
                element: row,
                pCurr: pPriceCurrent,
                pOrig: pPriceOriginal,
                cCurr: cPriceCurrent,
                cOrig: cPriceOriginal
            };
        });

        // 排序 (基于数值排序，而非字符串)
        rowData.sort((a, b) => {
            if (a.pCurr !== b.pCurr) return a.pCurr - b.pCurr;
            return a.cCurr - b.cCurr;
        });

        rowData.forEach(item => tbody.appendChild(item.element));

        // 统计
        const stats = {
            pCurrAvg: calculateAverage(rowData.map(d => d.pCurr)),
            pCurrMed: calculateMedian(rowData.map(d => d.pCurr)),
            pOrigAvg: calculateAverage(rowData.map(d => d.pOrig)),
            pOrigMed: calculateMedian(rowData.map(d => d.pOrig)),

            cCurrAvg: calculateAverage(rowData.map(d => d.cCurr)),
            cCurrMed: calculateMedian(rowData.map(d => d.cCurr)),
            cOrigAvg: calculateAverage(rowData.map(d => d.cOrig)),
            cOrigMed: calculateMedian(rowData.map(d => d.cOrig))
        };

        renderStatsPanel(tableBodyWrapper, table, stats, discountRate, currency);

        tableBodyWrapper.dataset.apiProcessed = 'true';

        // 绑定点击事件
        if (!tableBodyWrapper.dataset.clickBound) {
            tbody.addEventListener('click', (e) => {
                const target = e.target.closest('.api-clickable-price');
                if (target) {
                    copyToClipboard(target.getAttribute('data-value'));
                    e.stopPropagation();
                }
            });
            tableBodyWrapper.dataset.clickBound = 'true';
        }
    }

    function renderStatsPanel(wrapper, table, stats, discountRate, currency) {
        const oldPanel = wrapper.querySelector('.api-price-stats-panel');
        if (oldPanel) oldPanel.remove();

        const panel = document.createElement('div');
        panel.className = 'api-price-stats-panel';

        const createStatBlock = (avg, med, isOriginal = false) => `
            <div style="margin: 3px 0; ${isOriginal ? 'color:#999; font-size:12px;' : ''}">
                <span style="display:inline-block; width:36px;">${isOriginal ? '原价' : '实付'}</span>
                均: <span class="api-clickable-price ${isOriginal ? 'api-original-price' : 'api-stat-value'}" data-value="${avg}">${currency}${avg}</span>
                <span style="margin:0 4px; opacity:0.3">|</span>
                中: <span class="api-clickable-price ${isOriginal ? 'api-original-price' : 'api-stat-value'}" data-value="${med}">${currency}${med}</span>
            </div>
        `;

        const renderColumn = (title, currAvg, currMed, origAvg, origMed) => `
            <div style="text-align:left;">
                <div style="font-weight:bold; color: var(--semi-color-warning, #ff9800); margin-bottom:6px; text-align:center;">${title}</div>
                ${createStatBlock(currAvg, currMed, false)}
                ${discountRate < 1 ? createStatBlock(origAvg, origMed, true) : ''}
            </div>
        `;

        panel.innerHTML = `
            ${renderColumn('提示 (Prompt)', stats.pCurrAvg, stats.pCurrMed, stats.pOrigAvg, stats.pOrigMed)}
            <div style="width: 1px; background: #eee; margin: 0 16px;"></div>
            ${renderColumn('补全 (Completion)', stats.cCurrAvg, stats.cCurrMed, stats.cOrigAvg, stats.cOrigMed)}
        `;

        panel.addEventListener('click', (e) => {
            const target = e.target.closest('.api-clickable-price');
            if (target) copyToClipboard(target.getAttribute('data-value'));
        });

        wrapper.insertBefore(panel, table);
    }

    // --- 监听器 ---

    let timeout = null;
    const observer = new MutationObserver((mutations) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            injectDiscountInput();

            const dialog = document.querySelector(DIALOG_SELECTOR);
            if (dialog) {
                const tableBody = dialog.querySelector(DIALOG_TABLE_BODY_SELECTOR);
                if (tableBody && tableBody.querySelectorAll('tr').length > 0) {
                    if (tableBody.dataset.apiProcessed !== 'true') {
                        processTable(dialog);
                    }
                }
            }
        }, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();