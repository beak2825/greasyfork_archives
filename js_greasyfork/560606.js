// ==UserScript==
// @name         Gemini_表格列-特殊複製 1.3
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在指定表格的「發布時間」列旁加入一鍵複製按鈕，將該列資料以換行格式複製，方便貼入 Excel 跨儲存格。
// @author       BUTTST                                     // 作者資訊
// @license      MIT; https://opensource.org/licenses/MIT   // 開放源碼許可證
// @match        *://*/*
// @run-at       document-end
// @icon         data:image/jpeg;base64,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
// @downloadURL https://update.greasyfork.org/scripts/560606/Gemini_%E8%A1%A8%E6%A0%BC%E5%88%97-%E7%89%B9%E6%AE%8A%E8%A4%87%E8%A3%BD%2013.user.js
// @updateURL https://update.greasyfork.org/scripts/560606/Gemini_%E8%A1%A8%E6%A0%BC%E5%88%97-%E7%89%B9%E6%AE%8A%E8%A4%87%E8%A3%BD%2013.meta.js
// ==/UserScript==

/*
 * 版本號: 1.3
 * 更新時間: 2025/12/16 12:00
 *
 * 功能說明:
 * 1. 偵測 .horizontal-scroll-wrapper 內的表格，尋找包含「發布時間」的欄位。
 * 2. 在「發布時間」表頭旁插入複製按鈕，將該欄資料以換行分隔複製到剪貼簿。
 * 3. 方便在 Excel 中跨儲存格貼上（使用換行分隔）。
 * 4. 將內容中的「-」轉換為空白行，確保貼上至 Excel 時為純空值。
 *
 * 參考來源: GSMArena_快速複製-佈局優化_3.js 的複製流程與提示。
 */

(function() {
    'use strict';

    const TARGET_WRAPPER_SELECTOR = '.horizontal-scroll-wrapper';
    const COLUMN_KEYWORD = '發布時間';
    const BUTTON_CLASS = 'gemini-copy-launch-col-btn';

    /**
     * 將文字複製到剪貼簿
     * @param {string} text
     */
    function copyText(text) {
        const val = (text || '').toString();
        if (!val) {
            showToast('沒有可複製的內容');
            return;
        }
        const ta = document.createElement('textarea');
        ta.value = val;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showToast('發布時間列已複製');
        } catch (e) {
            console.error('複製失敗', e);
            showToast('複製失敗，請再試一次', '#d9534f');
        }
        document.body.removeChild(ta);
    }

    /**
     * 顯示提示訊息
     * @param {string} msg
     * @param {string} bg
     */
    function showToast(msg, bg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bg || '#4CAF50'};
            color: #fff;
            padding: 10px 16px;
            border-radius: 4px;
            z-index: 99999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-size: 13px;
            user-select: none;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 350);
        }, 1400);
    }

    /**
     * 取得欄位索引
     * @param {HTMLTableRowElement} headerRow
     * @returns {number} index or -1
     */
    function findColumnIndex(headerRow) {
        if (!headerRow) return -1;
        const cells = Array.from(headerRow.cells || []);
        return cells.findIndex(td => (td.textContent || '').trim().includes(COLUMN_KEYWORD));
    }

    /**
     * 收集欄位資料 (不含表頭)
     * @param {HTMLTableElement} table
     * @param {number} colIndex
     */
    function collectColumnValues(table, colIndex) {
        const values = [];
        const rows = Array.from(table.rows);
        rows.slice(1).forEach(row => {
            const cell = row.cells[colIndex];
            if (cell) {
                const txt = (cell.textContent || '').trim();
                // 將「-」轉換為空白行，確保 Excel 貼上時為空值
                if (txt === '-') {
                    values.push('');
                } else if (txt) {
                    values.push(txt);
                } else {
                    // 空值也加入，保持行數一致
                    values.push('');
                }
            } else {
                // 沒有 cell 也加入空白行
                values.push('');
            }
        });
        return values;
    }

    /**
     * 為表格安裝複製按鈕
     * @param {HTMLTableElement} table
     */
    function installButton(table) {
        if (!table || table.dataset.geminiInstalled === '1') return;

        const headerRow = table.tHead ? table.tHead.rows[0] : table.rows[0];
        const colIdx = findColumnIndex(headerRow);
        if (colIdx < 0) return;

        const targetHeaderCell = headerRow.cells[colIdx];
        if (!targetHeaderCell || targetHeaderCell.querySelector(`.${BUTTON_CLASS}`)) return;

        const btn = document.createElement('button');
        btn.textContent = '📋'; // 原文字: 複製發布時間(縱向)
        btn.className = BUTTON_CLASS;
        btn.style.cssText = `
            margin-left: 8px;
            padding: 6px 10px;
            font-size: 12px;
            border: 1px solid #d0d0d0;
            border-radius: 6px;
            background: #ffffff;
            color: #222;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            line-height: 1.2;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
            position: relative;
            z-index: 5;
            white-space: nowrap;
        `;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const values = collectColumnValues(table, colIdx);
            copyText(values.join('\n'));
        });

        targetHeaderCell.appendChild(btn);
        table.dataset.geminiInstalled = '1';
    }

    /**
     * 掃描頁面
     */
    function scan() {
        const wrappers = document.querySelectorAll(TARGET_WRAPPER_SELECTOR);
        wrappers.forEach(wrapper => {
            const tables = wrapper.querySelectorAll('table');
            tables.forEach(installButton);
        });
    }

    /**
     * 觀察 DOM 變化，避免動態載入漏掉
     */
    function observe() {
        const ob = new MutationObserver(() => scan());
        ob.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        scan();
        observe();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


