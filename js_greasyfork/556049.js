// ==UserScript==
// @name         小幺鸡接口文档数据提取器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提取小幺鸡接口文档页面中的接口信息(添加到剪切板)
// @author       Lexin
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556049/%E5%B0%8F%E5%B9%BA%E9%B8%A1%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556049/%E5%B0%8F%E5%B9%BA%E9%B8%A1%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加悬浮按钮样式
    GM_addStyle(`
        .api-extractor-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: #409eff;
            color: white;
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .api-extractor-btn:hover {
            background: #66b1ff;
            transform: scale(1.1);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .api-extractor-result {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            padding: 20px;
            max-width: 800px;
            max-height: 600px;
            overflow-y: auto;
            z-index: 10000;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
        }

        .api-extractor-result h2 {
            margin-top: 0;
            color: #303133;
            border-bottom: 2px solid #409eff;
            padding-bottom: 10px;
        }

        .api-extractor-result pre {
            background: #f5f7fa;
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            padding: 15px;
            overflow-x: auto;
            font-size: 14px;
            line-height: 1.5;
        }

        .api-extractor-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #909399;
        }

        .api-extractor-close:hover {
            color: #409eff;
        }

        .api-extractor-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        }
        .api-extractor-toast {
            position: fixed;
            bottom: 90px;
            right: 20px;
            z-index: 10001;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 10px 14px;
            border-radius: 6px;
            font-size: 14px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
        }
    `);

    // 创建悬浮按钮
    function createButton() {
        const button = document.createElement('button');
        button.className = 'api-extractor-btn';
        button.innerHTML = '📋';
        button.title = '提取接口文档';
        button.addEventListener('click', extractApiData);
        document.body.appendChild(button);
    }

    // 提取表格数据
    function extractTableData(tableElement) {
        const data = [];
        const rows = tableElement.querySelectorAll('.tbody .tblock');

        rows.forEach(row => {
            const depth = parseInt(row.className.match(/depth(\d+)/)?.[1] || '0');
            const cells = row.querySelectorAll('.titem');

            if (cells.length >= 5) {
                // 提取必填字段 - 检查是否有true/false文本或图标
                let required = 'false';
                const requiredCell = cells[2];
                if (requiredCell) {
                    // 查找true/false文本
                    const textContent = requiredCell.textContent?.trim() || '';
                    if (textContent === 'true' || textContent === 'false') {
                        required = textContent;
                    } else {
                        // 检查是否有图标或其他标识
                        const icon = requiredCell.querySelector('.iconfont, i');
                        if (icon) {
                            required = 'true'; // 有图标通常表示必填
                        }
                    }
                }

                const rowData = {
                    depth: depth,
                    name: cells[0]?.textContent?.trim() || '',
                    type: cells[1]?.textContent?.trim() || '',
                    required: required,
                    default: cells[3]?.textContent?.trim() || '',
                    description: cells[4]?.textContent?.trim() || ''
                };
                data.push(rowData);
            }
        });

        return data;
    }

    // 构建树形结构
    function buildTreeStructure(data) {
        const result = [];
        const stack = [];

        data.forEach(item => {
            const node = {
                name: item.name,
                type: item.type,
                required: item.required === 'true',
                default: item.default,
                description: item.description,
                children: []
            };

            while (stack.length > item.depth) {
                stack.pop();
            }

            if (stack.length === 0) {
                result.push(node);
            } else {
                stack[stack.length - 1].children.push(node);
            }

            stack.push(node);
        });

        return result;
    }

    function flattenTree(nodes, parentPath = '') {
        const out = [];
        nodes.forEach(node => {
            const base = parentPath ? parentPath + '.' + node.name : node.name;
            const isArray = typeof node.type === 'string' && node.type.toLowerCase().includes('array');
            const currentPath = isArray ? base + '[]' : base;
            out.push({
                path: currentPath,
                name: node.name,
                type: node.type,
                required: !!node.required,
                default: node.default,
                description: node.description
            });
            if (node.children && node.children.length) {
                out.push(...flattenTree(node.children, currentPath));
            }
        });
        return out;
    }

    function showToast(message) {
        const el = document.createElement('div');
        el.className = 'api-extractor-toast';
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 2000);
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showToast('已复制到剪切板');
                })
                .catch(() => {
                    const ta = document.createElement('textarea');
                    ta.value = text;
                    ta.style.position = 'fixed';
                    ta.style.top = '-1000px';
                    document.body.appendChild(ta);
                    ta.focus();
                    ta.select();
                    try {
                        document.execCommand('copy');
                        showToast('已复制到剪切板');
                    } finally {
                        document.body.removeChild(ta);
                    }
                });
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.top = '-1000px';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            try {
                document.execCommand('copy');
                showToast('已复制到剪切板');
            } finally {
                document.body.removeChild(ta);
            }
        }
    }

    // 查找表格的安全方法
    function findTableAfterTitle(titleElement) {
        if (!titleElement) return null;

        // 方法1: 查找标题后面的兄弟元素
        let nextElement = titleElement.nextElementSibling;
        while (nextElement) {
            const table = nextElement.querySelector('.edit-table-container');
            if (table) return table;
            nextElement = nextElement.nextElementSibling;
        }

        // 方法2: 查找父元素的兄弟元素
        let parentElement = titleElement.parentElement;
        while (parentElement) {
            nextElement = parentElement.nextElementSibling;
            while (nextElement) {
                const table = nextElement.querySelector('.edit-table-container');
                if (table) return table;
                nextElement = nextElement.nextElementSibling;
            }
            parentElement = parentElement.parentElement;
        }

        // 方法3: 在整个文档中查找最近的表格
        const allTables = document.querySelectorAll('.edit-table-container');
        let closestTable = null;
        let minDistance = Infinity;

        allTables.forEach(table => {
            const distance = Math.abs(table.getBoundingClientRect().top - titleElement.getBoundingClientRect().top);
            if (distance < minDistance) {
                minDistance = distance;
                closestTable = table;
            }
        });

        return closestTable;
    }

    // 提取接口数据
    function extractApiData() {
        try {
            // 获取接口标题
            const titleElement = document.querySelector('.doc-title h1');
            const title = titleElement ? titleElement.textContent.trim() : '未知接口';

            // 获取请求方法和URL
            const methodElement = document.querySelector('.tag-method');
            const method = (methodElement ? methodElement.textContent.trim() : 'GET').toUpperCase();

            const urlElement = document.querySelector('.url-box pre code');
            const url = (urlElement ? urlElement.textContent.trim() : '').replace(/^`+|`+$/g, '');

            // 获取请求体数据
            const requestSection = Array.from(document.querySelectorAll('h2.title')).find(h2 =>
                h2.textContent.includes('请求体')
            );
            let requestData = [];
            if (requestSection) {
                const requestTable = findTableAfterTitle(requestSection);
                if (requestTable) {
                    const rawData = extractTableData(requestTable);
                    requestData = buildTreeStructure(rawData);
                }
            }

            // 获取响应数据
            const responseSection = Array.from(document.querySelectorAll('h2.title')).find(h2 =>
                h2.textContent.includes('响应数据')
            );
            let responseData = [];
            if (responseSection) {
                const responseTable = findTableAfterTitle(responseSection);
                if (responseTable) {
                    const rawData = extractTableData(responseTable);
                    responseData = buildTreeStructure(rawData);
                }
            }

            const result = {
                title: title,
                method: method,
                url: url,
                request: requestData,
                response: responseData,
                extractedAt: new Date().toLocaleString('zh-CN')
            };

            const aiData = {
                version: '1.0',
                api: { title: title, method: method, url: url },
                request: requestData,
                response: responseData
            };

            showResult(result, aiData);

        } catch (error) {
            alert('提取数据失败: ' + error.message);
            console.error('提取错误:', error);
        }
    }

    // 显示结果
    function showResult(data, aiData) {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'api-extractor-overlay';

        // 创建结果容器
        const container = document.createElement('div');
        container.className = 'api-extractor-result';

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'api-extractor-close';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(container);
        });

        // 创建内容
        const content = document.createElement('div');
        content.innerHTML = `
            <h2>完整JSON</h2>
            <pre>${JSON.stringify(aiData, null, 2)}</pre>
        `;

        container.appendChild(closeBtn);
        container.appendChild(content);
        document.body.appendChild(overlay);
        document.body.appendChild(container);
        copyToClipboard(JSON.stringify(aiData, null, 2));

        // 点击遮罩层关闭
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(container);
        });
    }

    // 页面加载完成后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createButton);
    } else {
        createButton();
    }
})();
