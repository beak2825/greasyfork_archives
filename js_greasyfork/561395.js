// ==UserScript==
// @name         沐锦 API 价格统计工具
// @namespace    http://tampermonkey.net/
// @version      2.6.3
// @description  主页设置折扣，Dialog详情页自动识别货币。所有价格保留4位小数并向上取整(Ceil)，支持点击复制。适配倒数第1、第2列为价格列。
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
    const MAIN_PAGE_ANCHOR_SELECTOR = 'div.pricing-search-header div[class~="semi-divider"]';

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

    function autoClickSearch() {
        // 修改点：增加了 :not(.api-copy-btn) 排除掉我们自己添加的复制按钮
        const btnSelector = 'div.pricing-search-header button:not([disabled]):not(.api-copy-btn)';
        const btn = document.querySelector(btnSelector);

        // 如果按钮存在，且没有被我们自动点击过
        if (btn && !btn.dataset.hasAutoClicked) {
            btn.click();
            btn.dataset.hasAutoClicked = 'true'; // 标记已点击，防止死循环
        }
    }

function injectDiscountInput() {
        if (document.querySelector('.api-discount-wrapper')) return;

        const combobox = document.querySelector(MAIN_PAGE_ANCHOR_SELECTOR);
        if (!combobox) return;

        const container = combobox.parentElement;
        if (!container) return;

        // 1. 创建折扣输入框容器
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

        input.addEventListener('change', (e) => {
            let val = parseFloat(e.target.value);
            if (isNaN(val)) val = 100;
            if (val < 1) val = 1;
            if (val > 100) val = 100;
            e.target.value = val;
            setDiscount(val);

            // 折扣改变时，尝试刷新表格数据（兼容性处理）
            const dialog = document.querySelector(DIALOG_SELECTOR);
            if (dialog) {
                processTable(dialog, true);
                showToast(`折扣 ${val}% 应用成功`);
            } else {
                showToast(`折扣已保存: ${val}%`);
            }
        });

        // 2. 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.innerText = '复制模型';
        copyBtn.className = 'api-copy-btn'; // 保留类名，防止自动搜索误点
        copyBtn.style.cssText = `
            margin-right: 8px;
            height: 32px;
            padding: 0 12px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            background: #fff;
            cursor: pointer;
            font-size: 13px;
            color: #333;
            font-weight: 600;
            transition: all 0.2s;
        `;

        copyBtn.onmouseover = () => { copyBtn.style.color = '#1890ff'; copyBtn.style.borderColor = '#1890ff'; };
        copyBtn.onmouseout = () => { copyBtn.style.color = '#333'; copyBtn.style.borderColor = '#d9d9d9'; };

        // --- 核心修改部分：直接定位表格容器 ---
        copyBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 直接在 document 全局查找 table body，忽略外层 Dialog 结构
            // 只要页面上有 .semi-table-body，就认为有数据
            const tableBodyWrapper = document.querySelector(DIALOG_TABLE_BODY_SELECTOR);

            if (!tableBodyWrapper) {
                showToast('未检测到表格数据，请先点击搜索');
                return;
            }

            // 在该容器下查找所有行
            const rows = tableBodyWrapper.querySelectorAll('tr.semi-table-row');

            if (rows.length === 0) {
                 showToast('表格中没有数据行');
                 return;
            }

            const models = [];

            rows.forEach(row => {
                // 1. 优先使用 aria-colindex="2" (你的 HTML 结构显示模型在第2列)
                let cell = row.querySelector('td[aria-colindex="2"]');

                // 2. 兜底方案：使用 nth-child(2)
                if (!cell) cell = row.querySelector('td:nth-child(2)');

                if (cell) {
                    // 获取 .semi-tag-content 的内容 (去除 Tag 图标和前缀)
                    const contentDiv = cell.querySelector('.semi-tag-content');
                    const text = contentDiv ? contentDiv.innerText : cell.innerText;

                    if (text && text.trim()) {
                        models.push(text.trim());
                    }
                }
            });

            if (models.length > 0) {
                const result = models.join(',');

                // 写入剪贴板
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(result).then(() => {
                        showToast(`已复制 ${models.length} 个模型`);
                    }).catch(() => fallbackCopy(result));
                } else {
                    fallbackCopy(result);
                }
            } else {
                showToast('当前表格未解析到模型名称');
            }
        };

        function fallbackCopy(text) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast(`已复制 (兼容模式)`);
        }

        // 3. 插入元素
        container.insertBefore(wrapper, combobox);
        container.insertBefore(copyBtn, wrapper);
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
                // 修改点 1：使用 nth-last-child 定位倒数两列
                // 倒数第2列 (Prompt)
                const pCell = row.querySelector('td:nth-last-child(2) .font-semibold');
                const pTd = row.querySelector('td:nth-last-child(2)');

                // 倒数第1列 (Completion)
                const cCell = row.querySelector('td:nth-last-child(1) .font-semibold');
                const cTd = row.querySelector('td:nth-last-child(1)');

                const pText = pCell ? pCell.innerText : (pTd?.innerText || '0');
                const cText = cCell ? cCell.innerText : (cTd?.innerText || '0');

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
            // 修改点 2：cssSelector 接收 CSS 选择器字符串，而非数字索引
            const renderCell = (cssSelector, currStr, origStr) => {
                let cellWrapper = row.querySelector(`td:${cssSelector} .font-semibold`);

                if (!cellWrapper) {
                     // 使用 CSS 选择器查找 TD
                     const td = row.querySelector(`td:${cssSelector}`);
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

            // 修改点 3：调用时传入 nth-last-child 选择器
            renderCell('nth-last-child(2)', pCurrStr, pOrigStr); // Prompt
            renderCell('nth-last-child(1)', cCurrStr, cOrigStr); // Completion

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
            autoClickSearch();

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