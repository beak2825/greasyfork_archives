// ==UserScript==
// @name         网页转Markdown保存 (深度链接修复版)
// @namespace    ?
// @license      CC-BY-4.0
// @match        *://*/*
// @grant        none
// @version      1.2
// @author       -
// @description  深度递归处理，修复标题、粗体内的链接丢失问题，保留完整网页结构
// @downloadURL https://update.greasyfork.org/scripts/560845/%E7%BD%91%E9%A1%B5%E8%BD%ACMarkdown%E4%BF%9D%E5%AD%98%20%28%E6%B7%B1%E5%BA%A6%E9%93%BE%E6%8E%A5%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560845/%E7%BD%91%E9%A1%B5%E8%BD%ACMarkdown%E4%BF%9D%E5%AD%98%20%28%E6%B7%B1%E5%BA%A6%E9%93%BE%E6%8E%A5%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- UI 部分 ---
    const button = document.createElement('button');
    button.textContent = '📥 保存为MD';
    button.style.cssText = `
        position: fixed; top: 15px; right: 15px; z-index: 2147483647;
        padding: 8px 12px; background: #2c3e50; color: #ecf0f1;
        border: 1px solid #34495e; border-radius: 4px; cursor: pointer;
        font-family: sans-serif; font-size: 13px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    button.onclick = saveAsMarkdown;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(button));
    } else {
        document.body.appendChild(button);
    }

    // --- 核心逻辑 ---

    function saveAsMarkdown() {
        const title = document.title || 'Untitled';
        let content = extractContent();

        let markdown = `# ${title}\n\n`;
        markdown += `> 原始链接: [${window.location.href}](${window.location.href})\n`;
        markdown += `> 抓取时间: ${new Date().toLocaleString()}\n\n`;
        markdown += `---\n\n`;
        markdown += content;

        downloadMarkdown(markdown, sanitizeFilename(title));
    }

    function extractContent() {
        // 智能识别内容区域
        const contentSelectors = [
            'article', 'main', '[role="main"]', '.article', '.post',
            '.content', '.markdown-body', '#content', '#main', 'body'
        ];

        let mainElement = null;
        for (let selector of contentSelectors) {
            // 排除太小的区域，避免抓到侧边栏
            const els = document.querySelectorAll(selector);
            for (let el of els) {
                if (el.innerText && el.innerText.length > 200) {
                    mainElement = el;
                    break;
                }
            }
            if (mainElement) break;
        }
        if (!mainElement) mainElement = document.body;

        // 克隆节点以防破坏页面
        const clone = mainElement.cloneNode(true);
        return htmlToMarkdown(clone);
    }

    function htmlToMarkdown(rootElement) {
        // 清理垃圾标签
        const ignoreSelectors = [
            'script', 'style', 'nav', 'header', 'footer', 'noscript',
            'iframe:not([src*="youtube"]):not([src*="bilibili"])', // 保留视频iframe
            '.ad', '.advertisement', '.sidebar', '.share-buttons', '.comment-area',
            'svg', 'input', 'button', 'form'
        ];
        rootElement.querySelectorAll(ignoreSelectors.join(',')).forEach(el => el.remove());

        // 递归转换函数
        function processNode(node) {
            // 1. 文本节点处理
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.textContent;
                // 如果父级不是代码块，压缩多余空白
                if (!isInPre(node)) {
                    text = text.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ');
                }
                return text;
            }

            // 2. 元素节点处理
            if (node.nodeType !== Node.ELEMENT_NODE) return '';

            // 不可见元素跳过
            if (node.style && (node.style.display === 'none' || node.style.visibility === 'hidden')) return '';

            const tag = node.tagName.toLowerCase();
            let childrenMd = '';

            // 预处理子节点 (除了特殊标签如 code/pre 以外，通常都需要先拿到子节点的MD)
            if (tag !== 'code' && tag !== 'pre' && tag !== 'script') {
                childrenMd = Array.from(node.childNodes)
                    .map(child => processNode(child))
                    .join('');
            }

            switch(tag) {
                // --- 标题 (修复重点：保留childrenMd中的链接) ---
                case 'h1': return `\n\n# ${childrenMd.trim()}\n\n`;
                case 'h2': return `\n\n## ${childrenMd.trim()}\n\n`;
                case 'h3': return `\n\n### ${childrenMd.trim()}\n\n`;
                case 'h4': return `\n\n#### ${childrenMd.trim()}\n\n`;
                case 'h5': return `\n\n##### ${childrenMd.trim()}\n\n`;
                case 'h6': return `\n\n###### ${childrenMd.trim()}\n\n`;

                // --- 段落与容器 ---
                case 'p':
                case 'div':
                case 'section':
                case 'article':
                    // 只有当内容不为空时才添加换行
                    return childrenMd.trim() ? `\n\n${childrenMd.trim()}\n\n` : '';

                case 'br': return '  \n';
                case 'hr': return '\n\n---\n\n';

                // --- 文本格式 (修复重点：允许内部嵌套链接) ---
                case 'b':
                case 'strong':
                    return childrenMd.trim() ? `**${childrenMd.trim()}**` : '';
                case 'i':
                case 'em':
                    return childrenMd.trim() ? `*${childrenMd.trim()}*` : '';
                case 's':
                case 'del':
                    return childrenMd.trim() ? `~~${childrenMd.trim()}~~` : '';

                // --- 链接 (核心) ---
                case 'a':
                    const href = node.href; // 使用绝对路径
                    // 如果是锚点或JS链接，只返回文字
                    if (!href || href.startsWith('javascript') || href.includes('#')) {
                        return childrenMd;
                    }
                    // 如果内部是图片，格式已经是 markdown，直接包裹
                    // 否则清理文字空白
                    let linkText = childrenMd.trim();
                    if (!linkText) linkText = node.title || 'Link';
                    return `[${linkText}](${href})`;

                // --- 图片 ---
                case 'img':
                    const src = node.src;
                    const alt = node.alt || '';
                    if (!src || src.startsWith('data:')) return ''; // 跳过base64大图
                    return `![${alt}](${src})`;

                // --- 代码 ---
                case 'code':
                    if (isInPre(node)) return node.textContent; // 代码块内部交给 pre 处理
                    return `\`${node.textContent}\``;

                case 'pre':
                    // 尝试获取语言
                    const langMatch = node.className.match(/lang(?:uage)?-([a-z0-9]+)/i);
                    const lang = langMatch ? langMatch[1] : '';
                    return `\n\n\`\`\`${lang}\n${node.textContent.trim()}\n\`\`\`\n\n`;

                // --- 列表 ---
                case 'ul':
                case 'ol':
                    return '\n\n' + Array.from(node.children).map((li, idx) => {
                        if (li.tagName.toLowerCase() !== 'li') return '';
                        // 处理 LI 内部的子节点
                        const liContent = Array.from(li.childNodes).map(c => processNode(c)).join('').trim();
                        const prefix = tag === 'ul' ? '-' : `${idx + 1}.`;
                        return `${prefix} ${liContent}`;
                    }).join('\n') + '\n\n';

                case 'blockquote':
                    return `\n\n> ${childrenMd.trim().replace(/\n/g, '\n> ')}\n\n`;

                // --- 表格 ---
                case 'table':
                    return '\n\n' + processTable(node) + '\n\n';

                // --- 默认 ---
                default:
                    return childrenMd;
            }
        }

        function isInPre(node) {
            let p = node.parentNode;
            while(p) {
                if (p.tagName === 'PRE') return true;
                if (p === rootElement) return false;
                p = p.parentNode;
            }
            return false;
        }

        function processTable(table) {
            const rows = Array.from(table.querySelectorAll('tr'));
            let md = '';
            rows.forEach((row, i) => {
                const cells = Array.from(row.querySelectorAll('th, td'));
                const cellMds = cells.map(c => {
                    // 单元格内不能有换行
                    return Array.from(c.childNodes).map(n => processNode(n)).join('').replace(/[\r\n]+/g, ' ').trim();
                });
                if (cellMds.length === 0) return;
                md += '| ' + cellMds.join(' | ') + ' |\n';
                if (i === 0) md += '| ' + cellMds.map(() => '---').join(' | ') + ' |\n';
            });
            return md;
        }

        let finalMd = processNode(rootElement);
        // 最终清理：把连续3个以上的换行变成2个
        return finalMd.replace(/\n{3,}/g, '\n\n').trim();
    }

    function sanitizeFilename(name) {
        return name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 50);
    }

    function downloadMarkdown(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
})();