// ==UserScript==
// @name         LMArena Chat Exporter Pro
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  导出 lmarena.ai 聊天记录为 Markdown 格式（完整支持代码块、标题等）
// @author       blipYou
// @match        https://lmarena.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558593/LMArena%20Chat%20Exporter%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/558593/LMArena%20Chat%20Exporter%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createExportButton() {
        const button = document.createElement('button');
        button.textContent = '📥 导出MD';
        button.style.cssText = `
            position: fixed;
            bottom: 98px;
            right: 1rem;
            z-index: 99999;
            padding: 5px 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: transform 0.2s;
        `;
        button.onmouseover = () => button.style.transform = 'scale(1.05)';
        button.onmouseout = () => button.style.transform = 'scale(1)';
        button.addEventListener('click', exportChat);
        document.body.appendChild(button);
    }

    // 解析内联元素（加粗、斜体、行内代码、链接等）
    function parseInline(el) {
        let result = '';

        el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();

                // 跳过 SVG 图标等
                if (tag === 'svg' || tag === 'button') return;

                if (tag === 'strong' || tag === 'b') {
                    result += `**${node.textContent}**`;
                } else if (tag === 'em' || tag === 'i') {
                    result += `*${node.textContent}*`;
                } else if (tag === 'code') {
                    result += `\`${node.textContent}\``;
                } else if (tag === 'a') {
                    const href = node.getAttribute('href') || '';
                    result += `[${node.textContent}](${href})`;
                } else if (tag === 'br') {
                    result += '\n';
                } else {
                    result += parseInline(node);
                }
            }
        });

        return result;
    }

    // 解析代码块
    function parseCodeBlock(preEl) {
        const codeBlock = preEl.querySelector('[data-code-block="true"]');
        if (!codeBlock) {
            // 普通 pre 标签
            return '```\n' + preEl.textContent.trim() + '\n```\n\n';
        }

        // 获取语言
        const langEl = codeBlock.querySelector('.text-sm.font-medium');
        const lang = langEl ? langEl.textContent.trim().toLowerCase() : '';

        // 获取代码内容
        const codeEl = codeBlock.querySelector('code');
        if (!codeEl) return '';

        const lines = codeEl.querySelectorAll('.line');
        let code = '';

        if (lines.length > 0) {
            lines.forEach(line => {
                code += line.textContent + '\n';
            });
        } else {
            code = codeEl.textContent;
        }

        return '```' + lang + '\n' + code.trimEnd() + '\n```\n\n';
    }

    // 解析列表
    function parseList(listEl, ordered = false) {
        let result = '';
        const items = listEl.querySelectorAll(':scope > li');

        items.forEach((li, index) => {
            const prefix = ordered ? `${index + 1}. ` : '- ';
            const content = parseInline(li).trim();
            result += prefix + content + '\n';
        });

        return result + '\n';
    }

    // 解析 .prose 容器内的内容
    function parseProseContent(proseEl) {
        let markdown = '';

        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) markdown += text + ' ';
                return;
            }

            if (node.nodeType !== Node.ELEMENT_NODE) return;

            const tag = node.tagName.toLowerCase();

            // 跳过不需要的元素
            if (['svg', 'button', 'style', 'script'].includes(tag)) return;
            if (node.classList.contains('not-prose')) {
                // not-prose 内部可能有代码块
                const pre = node.querySelector('pre');
                if (pre) {
                    markdown += parseCodeBlock(node);
                }
                return;
            }

            switch (tag) {
                case 'h1':
                    markdown += `# ${node.textContent.trim()}\n\n`;
                    break;
                case 'h2':
                    markdown += `## ${node.textContent.trim()}\n\n`;
                    break;
                case 'h3':
                    markdown += `### ${node.textContent.trim()}\n\n`;
                    break;
                case 'h4':
                    markdown += `#### ${node.textContent.trim()}\n\n`;
                    break;
                case 'h5':
                    markdown += `##### ${node.textContent.trim()}\n\n`;
                    break;
                case 'h6':
                    markdown += `###### ${node.textContent.trim()}\n\n`;
                    break;
                case 'p':
                    markdown += parseInline(node).trim() + '\n\n';
                    break;
                case 'pre':
                    markdown += parseCodeBlock(node);
                    break;
                case 'ol':
                    markdown += parseList(node, true);
                    break;
                case 'ul':
                    markdown += parseList(node, false);
                    break;
                case 'blockquote':
                    const lines = node.textContent.trim().split('\n');
                    lines.forEach(line => {
                        markdown += `> ${line.trim()}\n`;
                    });
                    markdown += '\n';
                    break;
                case 'hr':
                    markdown += '---\n\n';
                    break;
                case 'div':
                    // 递归处理 div
                    node.childNodes.forEach(child => processNode(child));
                    break;
                case 'table':
                    markdown += parseTable(node);
                    break;
                default:
                    // 其他标签递归处理
                    node.childNodes.forEach(child => processNode(child));
            }
        };

        proseEl.childNodes.forEach(child => processNode(child));

        return markdown;
    }

    // 解析表格
    function parseTable(tableEl) {
        let result = '';
        const rows = tableEl.querySelectorAll('tr');

        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('th, td');
            const cellContents = Array.from(cells).map(cell => cell.textContent.trim());
            result += '| ' + cellContents.join(' | ') + ' |\n';

            // 表头后添加分隔符
            if (rowIndex === 0 && row.querySelector('th')) {
                result += '| ' + cellContents.map(() => '---').join(' | ') + ' |\n';
            }
        });

        return result + '\n';
    }

    // 解析 AI 回复
    function parseAssistantMessage(container) {
        // 查找 .prose 容器
        const proseEl = container.querySelector('.prose');
        if (proseEl) {
            return parseProseContent(proseEl);
        }

        // 降级：直接获取文本
        return container.textContent.trim();
    }

    // 解析用户消息
    function parseUserMessage(container) {
        // 用户消息通常是纯文本
        const textEl = container.querySelector('p, span, div');
        if (textEl) {
            return textEl.textContent.trim();
        }
        return container.textContent.trim();
    }

    function exportChat() {
        // 获取 ol 容器
        const ol = document.querySelector('ol');
        if (!ol) {
            alert('❌ 未找到聊天容器 (ol)，请确保页面已加载完成');
            return;
        }

        const children = Array.from(ol.children);
        let messages = [];

        // 遍历 ol 的子元素
        children.forEach((item) => {
            const classList = item.className || '';

            if (classList.includes('bg-surface-primary')) {
                // AI 回复
                const content = parseAssistantMessage(item);
                if (content.trim()) {
                    messages.push({ role: 'assistant', content });
                }
            } else if (classList.includes('group')) {
                // 用户消息
                const content = parseUserMessage(item);
                if (content.trim()) {
                    messages.push({ role: 'user', content });
                }
            }
        });

        if (messages.length === 0) {
            alert('❌ 未找到聊天消息');
            return;
        }

        // 反转数组（因为 DOM 是倒序的）
        messages.reverse();
        // 获取页面标题
        const title = messages[0].content;

        let markdown = '';
        markdown += `> 导出时间: ${new Date().toLocaleString()}\n`;
        markdown += `> 来源: ${window.location.href}\n\n`;
        markdown += `---\n\n`;

        // 生成 Markdown
        let turnCount = 0;
        messages.forEach((msg) => {
            if (msg.role === 'user') {
                turnCount++;
                markdown += `# 对话 ${turnCount}\n\n`;
                markdown += `## 👨‍💻 用户\n\n`;
                markdown += `${msg.content}\n\n`;
            } else {
                markdown += `## 🤖 助手\n\n`;
                markdown += `${msg.content}\n`;
                markdown += `---\n\n`;
            }
        });

        // 统计信息
        const userCount = messages.filter(m => m.role === 'user').length;
        const aiCount = messages.filter(m => m.role === 'assistant').length;
        markdown += `\n**统计**: ${userCount} 条用户消息, ${aiCount} 条 AI 回复\n`;

        downloadMarkdown(markdown, title);
    }

    function downloadMarkdown(content, title) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const safeTitle = title
            .replace(/[\\/:*?"<>|]/g, '_')
            .replace(/\s+/g, '_')
            .slice(0, 50);
        a.download = `${safeTitle}.md`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('✅ 导出成功！');
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 99999;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 2500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(createExportButton, 1000));
    } else {
        setTimeout(createExportButton, 1000);
    }
})();