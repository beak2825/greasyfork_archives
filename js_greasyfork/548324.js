// ==UserScript==
// @name         Gemini Table to Markdown Copier
// @name:zh-CN   Gemini 表格 Markdown 复制器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to tables on gemini.google.com to copy them as Markdown format.
// @description:zh-CN 在 gemini.google.com 的表格上添加一个按钮，以 Markdown 格式复制它们。
// @author       reakuragho
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @downloadURL https://update.greasyfork.org/scripts/548324/Gemini%20Table%20to%20Markdown%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/548324/Gemini%20Table%20to%20Markdown%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 样式定义 ---
    // 为复制按钮和其容器添加 CSS 样式
    GM_addStyle(`
        .markdown-copy-wrapper {
            position: relative; /* 相对定位，作为按钮定位的基准 */
        }
        .copy-markdown-button {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 999;
            padding: 5px 10px;
            font-size: 12px;
            font-family: sans-serif;
            background-color: #444746; /* Gemini 风格的深灰色 */
            color: #e3e3e3;
            border: 1px solid #5c5f5e;
            border-radius: 8px;
            cursor: pointer;
            opacity: 0; /* 默认隐藏 */
            transition: opacity 0.3s ease, background-color 0.3s ease;
            visibility: hidden; /* 默认不可见 */
        }
        /* 当鼠标悬停在表格包装器上时，显示按钮 */
        .markdown-copy-wrapper:hover .copy-markdown-button {
            opacity: 0.9;
            visibility: visible;
        }
        .copy-markdown-button:hover {
            background-color: #5c5f5e; /* 悬停时加深背景色 */
            opacity: 1;
        }
    `);

    // --- 核心功能 ---

    /**
     * 将 HTML table 元素转换为 Markdown 格式的字符串
     * @param {HTMLTableElement} tableElement - 需要转换的表格元素
     * @returns {string} - Markdown 格式的表格字符串
     */
    function tableToMarkdown(tableElement) {
        let markdown = '';
        const rows = Array.from(tableElement.querySelectorAll('tr'));
        if (rows.length === 0) return '';

        // 辅助函数，用于清理单元格文本
        const cleanCellText = (cell) => {
            // 移除多余的空白并转义 Markdown 中的管道符 |
            return cell.textContent.trim().replace(/\|/g, '\\|');
        };

        // 1. 处理表头 (thead > tr > th/td 或 tbody > tr:first-child > th/td)
        const headerRow = rows[0];
        const headerCells = Array.from(headerRow.querySelectorAll('th, td')).map(cleanCellText);
        markdown += `| ${headerCells.join(' | ')} |\n`;

        // 2. 创建分隔线
        const separator = headerCells.map(() => '---').join(' | ');
        markdown += `| ${separator} |\n`;

        // 3. 处理表格主体数据
        // 如果第一行是表头，则从第二行开始遍历
        const bodyRows = rows.slice(1);
        bodyRows.forEach(row => {
            const bodyCells = Array.from(row.querySelectorAll('td')).map(cleanCellText);
            // 确保数据行和表头列数一致，不一致时用空字符串填充
            while (bodyCells.length < headerCells.length) {
                bodyCells.push('');
            }
            markdown += `| ${bodyCells.join(' | ')} |\n`;
        });

        return markdown;
    }

    /**
     * 为找到的表格添加“复制”按钮
     * @param {HTMLTableElement} table - 目标表格元素
     */
    function addCopyButtonToTable(table) {
        // 如果表格已经处理过，则跳过
        if (table.closest('.markdown-copy-wrapper')) {
            return;
        }

        // 1. 创建一个包装器 div，用于相对定位按钮
        const wrapper = document.createElement('div');
        wrapper.className = 'markdown-copy-wrapper';

        // 2. 将表格移动到包装器内部
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);

        // 3. 创建复制按钮
        const button = document.createElement('button');
        button.textContent = 'Copy Markdown';
        button.className = 'copy-markdown-button';

        // 4. 添加点击事件
        button.onclick = async (e) => {
            e.stopPropagation(); // 防止触发其他事件
            const markdownText = tableToMarkdown(table);

            try {
                // 使用现代的 Clipboard API 复制文本
                await navigator.clipboard.writeText(markdownText);
                button.textContent = 'Copied!';
            } catch (err) {
                console.error('Failed to copy markdown table: ', err);
                button.textContent = 'Error!';
            } finally {
                // 2秒后恢复按钮文本
                setTimeout(() => {
                    button.textContent = 'Copy Markdown';
                }, 2000);
            }
        };

        // 5. 将按钮添加到包装器中
        wrapper.appendChild(button);
    }

    /**
     * 扫描整个文档，为所有未处理的表格添加按钮
     */
    function processAllTables() {
        document.querySelectorAll('table').forEach(addCopyButtonToTable);
    }

    // --- 动态内容监控 ---

    // Gemini 是动态加载内容的，所以需要监控 DOM 变化
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 当有新节点添加时，检查其中是否包含表格
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查节点本身是否是表格
                        if (node.tagName === 'TABLE') {
                            addCopyButtonToTable(node);
                        }
                        // 检查节点的子元素中是否包含表格
                        node.querySelectorAll('table').forEach(addCopyButtonToTable);
                    }
                });
            }
        }
    });

    // --- 启动脚本 ---

    // 初始加载时先处理一次页面上已有的表格
    processAllTables();

    // 开始监控整个文档的子节点变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();