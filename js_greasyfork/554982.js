// ==UserScript==
// @name         AtCoder 题目打印工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 AtCoder 题目页面添加打印按钮，生成适合打印的页面
// @author       JJerry
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554982/AtCoder%20%E9%A2%98%E7%9B%AE%E6%89%93%E5%8D%B0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/554982/AtCoder%20%E9%A2%98%E7%9B%AE%E6%89%93%E5%8D%B0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    // 检查是否已存在按钮
    function injectButton() {
        if (document.getElementById('atcoder-print-btn')) {
            return;
        }

        // 创建按钮
        const button = document.createElement('button');
        button.id = 'atcoder-print-btn';
        button.textContent = '🖨️';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background: #4CAF50;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        button.onmouseover = function() {
            this.style.background = '#45a049';
            this.style.transform = 'scale(1.1)';
        };

        button.onmouseout = function() {
            this.style.background = '#4CAF50';
            this.style.transform = 'scale(1)';
        };

        // 按钮点击事件
        button.onclick = function() {
            generatePrintPage();
        };

        // 添加到页面
        document.body.appendChild(button);
        console.log('AtCoder 打印按钮已添加！');
    }

    // 生成打印页面
    function generatePrintPage() {
        // 提取标题 - 尝试多种选择器
        let title = '';
        const titleSelectors = [
            'h2.break-all',
            'h2',
            'h1',
            '.h2',
            '[class*="title"]',
            '.contest-title',
            'span[class*="title"]'
        ];

        for (const selector of titleSelectors) {
            const titleElement = document.querySelector(selector);
            if (titleElement && titleElement.textContent.trim()) {
                // 克隆标题元素以便移除按钮
                const clonedTitle = /** @type {HTMLElement} */ (titleElement.cloneNode(true));
                // 移除所有按钮元素
                const buttons = clonedTitle.querySelectorAll('.btn.btn-default.btn-sm, .btn');
                buttons.forEach(btn => btn.remove());
                const titleText = clonedTitle.textContent?.trim() || '';
                if (titleText) {
                    title = titleText;
                    break;
                }
            }
        }

        // 如果还是没找到，尝试从 URL 提取
        if (!title) {
            const urlParts = window.location.href.split('/');
            const taskId = urlParts[urlParts.length - 1] || '';
            title = taskId.toUpperCase() || '题目';
        }

        // 提取 task-statement 内容
        const taskStatement = document.getElementById('task-statement');
        if (!taskStatement) {
            alert('未找到 id="task-statement" 的元素！');
            return;
        }

        // 提取原页面中 code 元素的样式
        const originalCodeStyle = (function() {
            const sampleCode = taskStatement.querySelector('code');
            if (sampleCode) {
                const computedStyle = window.getComputedStyle(sampleCode);
                return {
                    fontFamily: computedStyle.fontFamily,
                    fontSize: computedStyle.fontSize,
                    fontWeight: computedStyle.fontWeight,
                    fontStyle: computedStyle.fontStyle,
                    color: computedStyle.color,
                    backgroundColor: computedStyle.backgroundColor,
                    padding: computedStyle.padding,
                    borderRadius: computedStyle.borderRadius,
                    border: computedStyle.border,
                    display: computedStyle.display,
                    lineHeight: computedStyle.lineHeight
                };
            }
            return null;
        })();

        // 克隆内容以便修改
        const clonedContent = /** @type {HTMLElement} */ (taskStatement.cloneNode(true));

        // 移除所有 katex-html 元素
        const katexHtmlElements = clonedContent.querySelectorAll('.katex-html');
        katexHtmlElements.forEach(el => el.remove());

        // 移除所有日文内容（保留英文）
        const japaneseSelectors = [
            '[lang="ja"]',
            '.lang-ja',
            'span.lang-ja',
            '.lang-ja span',
            'div[class*="lang-ja"]'
        ];
        japaneseSelectors.forEach(selector => {
            const japaneseElements = clonedContent.querySelectorAll(selector);
            japaneseElements.forEach(el => el.remove());
        });

        // 移除所有按钮元素（包括复制按钮）
        const buttonSelectors = [
            '.btn.btn-default.btn-sm.btn-copy.ml-1',
            '.btn-copy',
            '.btn.btn-default.btn-sm'
        ];
        buttonSelectors.forEach(selector => {
            const buttonElements = clonedContent.querySelectorAll(selector);
            buttonElements.forEach(el => el.remove());
        });

        // 移除所有 <hr> 元素（位于输入格式和输出格式的上下两侧）
        const hrElements = clonedContent.querySelectorAll('hr');
        hrElements.forEach(hr => hr.remove());

        // 翻译副标题为中文
        const titleTranslations = {
            'Problem Statement': '问题描述',
            'Constraints': '数据范围',
            'Input': '输入格式',
            'Output': '输出格式'
        };

        // 查找所有标题元素（h2, h3, h4）
        const headingElements = clonedContent.querySelectorAll('h2, h3, h4');
        headingElements.forEach(heading => {
            const text = heading.textContent.trim();

            // 精确匹配翻译
            if (titleTranslations[text]) {
                heading.textContent = titleTranslations[text];
                return;
            }

            // 处理通配符匹配：Sample Input * 和 Sample Output *
            const sampleInputMatch = text.match(/^Sample Input\s+(.+)$/i);
            if (sampleInputMatch) {
                heading.textContent = `输入样例${sampleInputMatch[1]}`;
                return;
            }

            const sampleOutputMatch = text.match(/^Sample Output\s+(.+)$/i);
            if (sampleOutputMatch) {
                heading.textContent = `输出样例${sampleOutputMatch[1]}`;
                return;
            }
        });

        // 创建打印页面
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('无法打开新窗口，请检查浏览器弹窗设置！');
            return;
        }
        const printContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 打印页面</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            color: #333;
            line-height: 1.3;
        }

        .title-section {
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 3px solid #333;
            text-align: center;
        }

        .title-section h1 {
            font-size: 32px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            text-align: center;
        }

        .task-statement-section {
            margin-top: 20px;
        }

        .task-statement-section * {
            font-size: 18px !important;
            line-height: 1.4 !important;
        }

        .task-statement-section h2,
        .task-statement-section h3,
        .task-statement-section h4 {
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        .task-statement-section h2 {
            font-size: 28px !important;
        }

        .task-statement-section h3 {
            font-size: 26px !important;
        }

        .task-statement-section h4 {
            font-size: 24px !important;
        }

        .task-statement-section p {
            margin-bottom: 8px;
        }

        .task-statement-section pre {
            font-size: 16px !important;
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 10px 0;
        }

        .task-statement-section code {
            ${originalCodeStyle ? `
            font-family: ${originalCodeStyle.fontFamily} !important;
            font-size: ${originalCodeStyle.fontSize} !important;
            font-weight: ${originalCodeStyle.fontWeight} !important;
            font-style: ${originalCodeStyle.fontStyle} !important;
            color: ${originalCodeStyle.color} !important;
            background-color: ${originalCodeStyle.backgroundColor} !important;
            padding: ${originalCodeStyle.padding} !important;
            border-radius: ${originalCodeStyle.borderRadius} !important;
            border: ${originalCodeStyle.border} !important;
            display: ${originalCodeStyle.display} !important;
            line-height: ${originalCodeStyle.lineHeight} !important;
            ` : `
            font-size: 16px !important;
            `}
        }

        .task-statement-section ul,
        .task-statement-section ol {
            margin-left: 30px;
            margin-bottom: 10px;
        }

        .task-statement-section li {
            margin-bottom: 5px;
        }

        .task-statement-section table {
            border-collapse: collapse;
            width: 100%;
            margin: 12px 0;
            font-size: 16px !important;
        }

        .task-statement-section table th,
        .task-statement-section table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }

        .task-statement-section table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }

        .task-statement-section img {
            max-width: 50% !important;
            height: auto !important;
            display: block;
            margin: 10px auto;
        }

        @media print {
            body {
                padding: 20px;
            }

            .title-section {
                page-break-after: avoid;
            }

            .task-statement-section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="title-section">
        <h1>${title}</h1>
    </div>

    <div class="task-statement-section">
        ${clonedContent.innerHTML}
    </div>
</body>
</html>`;

        printWindow.document.write(printContent);
        printWindow.document.close();

        console.log('打印页面已生成！');
    }

    // 等待页面加载完成后注入按钮
    waitForElement('body', () => {
        waitForElement('#task-statement', () => {
            injectButton();
        });
    });
})();

