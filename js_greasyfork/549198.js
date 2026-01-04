// ==UserScript==
// @name         Markdown格式化工具
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在toolhelper.cn的Markdown编辑器中添加格式化功能按钮和快捷键（ctrl+shift+F）
// @author       damu
// @match        https://www.toolhelper.cn/Code/Markdown
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549198/Markdown%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/549198/Markdown%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 显示临时提示
    const showTemporaryMessage = (message, duration = 2000) => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, duration);
    };

    // 等待编辑器加载完成
    const waitForEditor = setInterval(() => {
        const toolbar = document.querySelector('.editormd-toolbar-container ul');
        if (!toolbar) return;

        clearInterval(waitForEditor);

        // 创建格式化按钮
        const formatBtn = document.createElement('li');
        formatBtn.innerHTML = `<a href="javascript:;" title="格式化Markdown (Alt+Shift+F)"><i class="fa fa-align-center" name="format-markdown"></i></a>`;
        toolbar.insertBefore(formatBtn, toolbar.querySelector('.divider'));

        // 获取编辑器内容
        const getEditorContent = () => {
            const cmEditor = document.querySelector('.CodeMirror')?.CodeMirror;
            if (cmEditor) return cmEditor.getValue();

            const editor = document.querySelector('.editormd-markdown-textarea');
            return editor ? editor.value : '';
        };

        // 设置编辑器内容
        const setEditorContent = (content) => {
            const cmEditor = document.querySelector('.CodeMirror')?.CodeMirror;
            if (cmEditor) {
                cmEditor.setValue(content);
                return;
            }

            const editor = document.querySelector('.editormd-markdown-textarea');
            if (editor) {
                editor.value = content;
                editor.dispatchEvent(new Event('input'));
            }
        };

        // 格式化表格行
        const formatTableLine = (line) => {
            const cells = line.split('|').map(cell => cell.trim());
            let result = '|';

            for (let i = 1; i < cells.length - 1; i++) {
                const content = cells[i] === '' ? '  ' : ` ${cells[i]} `;
                result += content + '|';
            }

            return result;
        };

        // 格式化分隔线
        const formatSeparatorLine = (line) => {
            const cells = line.split('|').map(cell => cell.trim());
            let result = '|';

            for (let i = 1; i < cells.length - 1; i++) {
                result += ' --- |';
            }

            return result;
        };

        // 表格格式化函数
        const formatTable = () => {
            const content = getEditorContent();
            if (!content) return;

            const lines = content.split('\n');
            let tableStart = -1;
            let tableEnd = -1;
            const tables = [];

            // 识别表格范围
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith('|') && line.endsWith('|')) {
                    if (tableStart === -1) {
                        tableStart = i;
                    }
                    tableEnd = i;
                } else if (tableStart !== -1) {
                    // 检查是否是分隔线
                    if (i === tableStart + 1 && line.includes('|') && line.replace(/[^|-]/g, '').length > 0) {
                        tableEnd = i;
                    } else {
                        // 表格结束
                        if (tableEnd - tableStart >= 1) {
                            tables.push({ start: tableStart, end: tableEnd });
                        }
                        tableStart = -1;
                        tableEnd = -1;
                    }
                }
            }

            // 捕获最后一个表格
            if (tableStart !== -1 && tableEnd - tableStart >= 1) {
                tables.push({ start: tableStart, end: tableEnd });
            }

            if (tables.length === 0) {
                showTemporaryMessage('未检测到Markdown表格');
                return;
            }

            // 格式化每个表格
            const newLines = [...lines];
            tables.forEach(({ start, end }) => {
                // 处理表头
                newLines[start] = formatTableLine(newLines[start]);

                // 处理分隔线
                if (start + 1 <= end) {
                    newLines[start + 1] = formatSeparatorLine(newLines[start + 1]);
                }

                // 处理表格内容
                for (let i = start + 2; i <= end; i++) {
                    newLines[i] = formatTableLine(newLines[i]);
                }
            });

            setEditorContent(newLines.join('\n'));
            showTemporaryMessage('表格格式化完成');
        };
        // Markdown格式化函数
        const formatMarkdown = () => {
            // 获取编辑器内容
            let content = getEditorContent();
            // 如果内容为空则直接返回
            if (!content) return;
            // 将内容按行分割进行进一步处理
            const lines = content.split(' ');
            // 存储上一个行数据
            let lastLines = '';
            // 存储格式化后的行数组
            const formattedLines = [];
            const summarizeWord = ["综上", "因此", "所以", "总之", "总结", "最终答案", "最终结果", "结论", "总结", "综上", "综上而言", "综上所述", "综上来看", "总的总结是", "核心总结为", "所以", "因此", "因而", "故此", "由此", "由此可见", "由此可得", "由此总结", "基于此", "综上可推出", "综上可得出", "总而言之", "总而言之一句话", "总的来说", "总的来讲", "总的看", "概括来说", "概括来讲", "简而言之", "简言之"];
            // 遍历每一行进行处理
            for (let i = 0; i < lines.length; i++) {
                // 去除行首尾空白字符
                const line = lines[i].trim();
                let len = formattedLines.length;
                const isVoidLine = (line === ''); // 空行
                const isVoidLastLine = (lastLines === ''); // 上一个是空行
                const isPunctuationAfter = (lastLines.match(/[。：！；]$/));// 特定标点符号后
                const isFirst = (len === 0) // 是第一行有效数据
                const isTitle = (line.match(/^#+$/)); // 标题
                const isTitleAfter = (lastLines.match(/^#+\s.+$/)); // 标题后一行
                const isOl = (line.match(/^\d+[.:、]$/));// 有序列表
                const isUl = (line.match(/^[\*\-\+]$/) && isPunctuationAfter); // 无序列表
                const isVerticalLine = (line.match(/^\|$/)); // 是竖线|
                const isEndVerticalLastLine = (lastLines.endsWith('\|')); // 上一个结尾是|
                const isSummarize = (isPunctuationAfter && summarizeWord.some(word => line.startsWith(word))); // 总结句

                if (isVoidLine) {
                    lastLines = line;
                } else if (isTitle || isSummarize || (isVerticalLine && !getLastLinesNotNull(lastLines, formattedLines)?.startsWith('\|'))) {
                    if (len !== 0) formattedLines.push(''); // 非第一行前添加空行
                    formattedLines.push(lastLines = line); // 换行
                } else if ((isVerticalLine && isEndVerticalLastLine) || (!isVerticalLine && (isTitleAfter || isOl || isUl || isPunctuationAfter || isVoidLastLine || isFirst))) {
                    formattedLines.push(lastLines = line); // 换行
                } else {
                    formattedLines[len - 1] = (lastLines = formattedLines[len - 1] + " " + line); // 默认情况下用空格连接，拼接到上一行后面
                }
            }

            // 将格式化后的行数组合并为字符串
            let finalContent = formattedLines.join('\n').trim();
            // 将格式化后的内容设置回编辑器
            setEditorContent(finalContent);
            // 显示操作完成提示
            showTemporaryMessage('Markdown格式化完成');

        };

        // 获取上一个非空的内容
        function getLastLinesNotNull(lastLines, formattedLines) {
            let lastLinesNotNull = lastLines;
            if (!lastLinesNotNull || lastLinesNotNull === '' || lastLinesNotNull === null) {
                for (let i = 0; i < formattedLines.length; i++) {
                    if (formattedLines[formattedLines.length - i] && formattedLines[formattedLines.length - i] !== '') {
                        lastLinesNotNull = formattedLines[formattedLines.length - i];
                        break;
                    }
                }
            }
            return lastLinesNotNull;
        }

        // 按钮点击事件
        formatBtn.querySelector('a').addEventListener('click', formatMarkdown);

        // 添加快捷键 Alt+Shift+F
        document.addEventListener('keydown', e => {
            if (e.altKey && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                formatMarkdown();
            }
        });

        // 添加表格格式化按钮
        const tableFormatBtn = document.createElement('li');
        tableFormatBtn.innerHTML = `<a href="javascript:;" title="仅格式化表格"><i class="fa fa-table" name="format-table-only"></i></a>`;
        toolbar.insertBefore(tableFormatBtn, formatBtn.nextSibling);

        tableFormatBtn.querySelector('a').addEventListener('click', formatTable);

    }, 100);
})();