// ==UserScript==
// @name         沐锦 API 价格统计工具
// @namespace    http://tampermonkey.net/
// @version      2.6.1
// @description  增加一键复制模型名称功能（逗号分割），自动识别货币。
// @author       api.21zys.com
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
    const MAIN_PAGE_ANCHOR_SELECTOR = 'div.pricing-search-row > div > div[role="combobox"]';
    const DIALOG_SELECTOR = 'div.semi-sidesheet > div[role="dialog"]';
    const DIALOG_TABLE_BODY_SELECTOR = '.semi-table-body';

    // --- 样式注入 ---
    const css = `
        .api-copy-models-btn {
            margin-right: 12px;
            padding: 0 12px;
            height: 32px;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
        }
        .api-copy-models-btn:hover { background-color: #40a9ff; }
        .api-copy-models-btn:active { background-color: #096dd9; }

        .api-price-cell { display: flex; flex-direction: column; justify-content: center; line-height: 1.5; }
        .api-clickable-price { cursor: pointer; transition: all 0.2s; position: relative; display: inline-block; font-family: monospace; border-bottom: 1px dashed transparent; }
        .api-stat-value { font-weight: 700; color: #1c1f23; border-bottom-color: #ccc; }
        .api-stat-value:hover { color: #1890ff; border-bottom-color: #1890ff; background-color: rgba(24, 144, 255, 0.1); }
        .api-original-price { font-size: 12px; color: #999; font-weight: normal; margin-top: 1px; border-bottom-color: #e0e0e0; }
        .api-original-price:hover { color: #666; border-bottom-color: #999; background-color: rgba(0, 0, 0, 0.05); }

        .api-price-stats-panel {
            background: #fcfcfc; border: 1px solid #e1e3e5; border-radius: 8px; padding: 12px 15px; margin-bottom: 12px;
            font-size: 13px; color: #333; display: flex; justify-content: space-around; box-shadow: 0 2px 6px rgba(0,0,0,0.04); user-select: none;
        }

        .api-toast {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: rgba(0, 0, 0, 0.85);
            color: white; padding: 8px 16px; border-radius: 4px; font-size: 14px; z-index: 99999; pointer-events: none;
            animation: fadeInOut 2s ease-in-out forwards;
        }

        .api-discount-wrapper {
            display: flex; align-items: center; margin-right: 12px; background: #fff; padding: 0 8px;
            border-radius: 6px; border: 1px solid #d9d9d9; height: 32px; box-sizing: border-box;
        }
        .api-discount-input {
            width: 36px; padding: 0 2px; border: none; outline: none; margin: 0 4px;
            text-align: center; font-weight: bold; color: #1890ff; background: transparent; font-size: 14px;
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

    function copyToClipboard(text, msg = '已复制') {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            showToast(`${msg}`);
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast(`${msg}`);
        });
    }

    // --- 修改：逗号分割提取逻辑 ---
    function copyModelNames() {
        const container = document.querySelector('.pricing-view-container');
        if (!container) {
            showToast('未找到价格列表容器');
            return;
        }

        // 定位模型名称：表格第二列中的 tag 内容
        const modelElements = container.querySelectorAll('tbody.semi-table-tbody tr td:nth-child(2) .semi-tag-content');
        
        if (modelElements.length === 0) {
            showToast('未找到任何模型名称');
            return;
        }

        const modelNames = Array.from(modelElements)
            .map(el => el.innerText.trim())
            .filter(name => name !== '')
            .join(', '); // 使用英文逗号+空格分割

        copyToClipboard(modelNames, `已复制 ${modelElements.length} 个名称 (逗号分割)`);
    }

    function detectCurrencySymbol(text) {
        if (!text) return '';
        const match = text.match(/([^\d.\s]+)/);
        return match ? match[0] : '';
    }

    function parsePrice(text) {
        if (!text) return 0;
        const numStr = text.replace(/[^\d.]/g, '');
        return parseFloat(numStr) || 0;
    }

    function formatPrice(num) {
        if (!num && num !== 0) return '0.0000';
        const ceiled = Math.ceil(num * 10000) / 10000;
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

        // 创建折扣 wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'api-discount-wrapper';

        const labelBefore = document.createElement('span');
        labelBefore.innerText = '折扣:';
        labelBefore.style.fontSize = '13px';

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'api-discount-input';
        input.min = 1;
        input.max = 100;
        input.value = getDiscount();

        const labelAfter = document.createElement('span');
        labelAfter.innerText = '%';

        wrapper.appendChild(labelBefore);
        wrapper.appendChild(input);
        wrapper.appendChild(labelAfter);

        // 创建复制模型按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'api-copy-models-btn';
        copyBtn.innerText = '复制模型';
        copyBtn.onclick = copyModelNames;

        // 插入位置：[复制按钮] [折扣框] [原始搜索框]
        container.insertBefore(wrapper, combobox);
        container.insertBefore(copyBtn, wrapper);

        input.addEventListener('change', (e) => {
            let val = parseFloat(e.target.value);
            if (isNaN(val)) val = 100;
            if (val < 1) val = 1;
            if (val > 100) val = 100;
            e.target.value = val;
            setDiscount(val);

            const dialog = document.querySelector(DIALOG_SELECTOR);
            if (dialog) processTable(dialog, true);
            showToast(`折扣 ${val}% 已保存`);
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

        rows.forEach(row => {
            if (!row.dataset.rawPrompt) {
                const pCell = row.querySelector('td[aria-colindex="3"] .font-semibold') || row.querySelector('td:nth-child(3) .font-semibold');
                const cCell = row.querySelector('td[aria-colindex="4"] .font-semibold') || row.querySelector('td:nth-child(4) .font-semibold');
                const pText = pCell ? pCell.innerText : (row.querySelector('td:nth-child(3)')?.innerText || '0');
                const cText = cCell ? cCell.innerText : (row.querySelector('td:nth-child(4)')?.innerText || '0');
                row.dataset.rawPrompt = pText;
                row.dataset.rawCompletion = cText;
            }
            if (!detectedSymbol) {
                const rawP = row.dataset.rawPrompt;
                if (rawP && /[0-9]/.test(rawP)) detectedSymbol = detectCurrencySymbol(rawP);
            }
        });

        const currency = detectedSymbol || '';
        const rowData = rows.map(row => {
            const pPriceCurrent = parsePrice(row.dataset.rawPrompt);
            const cPriceCurrent = parsePrice(row.dataset.rawCompletion);
            const pPriceOriginal = discountRate > 0 ? (pPriceCurrent / discountRate) : pPriceCurrent;
            const cPriceOriginal = discountRate > 0 ? (cPriceCurrent / discountRate) : cPriceCurrent;

            const pCurrStr = formatPrice(pPriceCurrent);
            const pOrigStr = formatPrice(pPriceOriginal);
            const cCurrStr = formatPrice(cPriceCurrent);
            const cOrigStr = formatPrice(cPriceOriginal);

            const renderCell = (idx, currStr, origStr) => {
                let cellWrapper = row.querySelector(`td:nth-child(${idx}) .font-semibold`) || row.querySelector(`td:nth-child(${idx})`);
                if (!cellWrapper) return;
                
                let html = `<div class="api-price-cell">
                    <span class="api-clickable-price api-stat-value" data-value="${currStr}">${currency}${currStr}</span>`;
                if (discountRate < 1) {
                    html += `<span class="api-clickable-price api-original-price" data-value="${origStr}">原: ${currency}${origStr}</span>`;
                }
                html += `</div>`;
                cellWrapper.innerHTML = html;
            };

            renderCell(3, pCurrStr, pOrigStr);
            renderCell(4, cCurrStr, cOrigStr);
            return { element: row, pCurr: pPriceCurrent, cCurr: cPriceCurrent };
        });

        rowData.sort((a, b) => a.pCurr - b.pCurr);
        rowData.forEach(item => tbody.appendChild(item.element));
        tableBodyWrapper.dataset.apiProcessed = 'true';

        if (!tableBodyWrapper.dataset.clickBound) {
            tbody.addEventListener('click', (e) => {
                const target = e.target.closest('.api-clickable-price');
                if (target) {
                    const val = target.getAttribute('data-value');
                    copyToClipboard(val, `已复制: ${val}`);
                    e.stopPropagation();
                }
            });
            tableBodyWrapper.dataset.clickBound = 'true';
        }
    }

    // --- 监听器 ---
    let timeout = null;
    const observer = new MutationObserver(() => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            injectDiscountInput();
            const dialog = document.querySelector(DIALOG_SELECTOR);
            if (dialog) {
                const tableBody = dialog.querySelector(DIALOG_TABLE_BODY_SELECTOR);
                if (tableBody && tableBody.dataset.apiProcessed !== 'true') processTable(dialog);
            }
        }, 150);
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();