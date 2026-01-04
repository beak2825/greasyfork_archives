// ==UserScript==
// @name         表格数据快速复制工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  快速复制网页表格数据到剪贴板
// @author       xx99czj
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fastmoss.com
// @downloadURL https://update.greasyfork.org/scripts/553524/%E8%A1%A8%E6%A0%BC%E6%95%B0%E6%8D%AE%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/553524/%E8%A1%A8%E6%A0%BC%E6%95%B0%E6%8D%AE%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建浮动按钮
    function createCopyButton() {
        const button = document.createElement('button');
        button.innerHTML = '📋 复制表格';
        button.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.background = '#45a049';
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#4CAF50';
            button.style.transform = 'scale(1)';
        });

        return button;
    }

    // 获取页面中的所有表格
    function getAllTables() {
        return Array.from(document.querySelectorAll('table'));
    }

    // 提取表格数据
    function extractTableData(table) {
        const data = [];
        const rows = table.querySelectorAll('tr');

        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('th, td');

            cells.forEach(cell => {
                // 获取单元格文本，去除多余空格
                let text = cell.textContent.trim();
                // 移除换行符和多余空格
                text = text.replace(/\s+/g, ' ');
                rowData.push(text);
            });

            if (rowData.length > 0) {
                data.push(rowData);
            }
        });

        return data;
    }

    // 将表格数据转换为文本格式
    function formatTableData(data, format = 'csv') {
        switch (format) {
            case 'csv':
                return data.map(row =>
                    row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
                ).join('\n');

            case 'tsv':
                return data.map(row => row.join('\t')).join('\n');

            case 'markdown':
                if (data.length < 2) return data.map(row => `| ${row.join(' | ')} |`).join('\n');

                const header = `| ${data[0].join(' | ')} |`;
                const separator = `| ${data[0].map(() => '---').join(' | ')} |`;
                const body = data.slice(1).map(row => `| ${row.join(' | ')} |`).join('\n');

                return `${header}\n${separator}\n${body}`;

            default:
                return data.map(row => row.join('\t')).join('\n');
        }
    }

    // 显示表格选择界面
    function showTableSelector() {
        const tables = getAllTables();

        if (tables.length === 0) {
            GM_notification({
                text: '未找到表格',
                title: '表格复制工具',
                timeout: 2000
            });
            return;
        }

        // 创建模态框
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 90%;
            max-height: 80%;
            overflow-y: auto;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
        `;

        content.innerHTML = `
            <h3>选择要复制的表格 (共${tables.length}个)</h3>
            <div style="margin: 15px 0;">
                <label>输出格式: </label>
                <select id="format-selector">
                    <option value="csv">CSV</option>
                    <option value="tsv">TSV (Tab分隔)</option>
                    <option value="markdown">Markdown</option>
                </select>
            </div>
            <div style="max-height: 300px; overflow-y: auto;">
                ${tables.map((table, index) => `
                    <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        <label>
                            <input type="radio" name="table-select" value="${index}" ${index === 0 ? 'checked' : ''}>
                            <strong>表格 ${index + 1}</strong>
                            <span style="color: #666; font-size: 12px;">
                                (${table.rows.length}行 × ${table.rows[0] ? table.rows[0].cells.length : 0}列)
                            </span>
                        </label>
                        <div style="margin-top: 5px; max-height: 100px; overflow: auto; background: #f5f5f5; padding: 5px; border-radius: 3px;">
                            <pre style="margin: 0; font-size: 10px;">${table.outerHTML.substring(0, 200)}...</pre>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 20px; text-align: right;">
                <button id="cancel-btn" style="margin-right: 10px; padding: 8px 15px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">取消</button>
                <button id="copy-btn" style="padding: 8px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">复制表格</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // 事件处理
        document.getElementById('cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('copy-btn').addEventListener('click', () => {
            const selected = document.querySelector('input[name="table-select"]:checked');
            const format = document.getElementById('format-selector').value;

            if (selected) {
                const tableIndex = parseInt(selected.value);
                const table = tables[tableIndex];
                const data = extractTableData(table);
                const formattedData = formatTableData(data, format);

                GM_setClipboard(formattedData);

                GM_notification({
                    text: `表格已复制到剪贴板 (${data.length}行${data[0] ? ' × ' + data[0].length + '列' : ''})`,
                    title: '复制成功',
                    timeout: 3000
                });

                document.body.removeChild(modal);
            }
        });

        // 点击模态框背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // 初始化
    function init() {
        const button = createCopyButton();
        button.addEventListener('click', showTableSelector);
        document.body.appendChild(button);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();