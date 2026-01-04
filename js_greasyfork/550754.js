// ==UserScript==
// @name         有道云笔记导出为markdown
// @name:en      Youdao Note Exporter to Markdown
// @namespace    https://github.com/your-username/youdao-note-exporter
// @version      3.0
// @description  在有道云笔记分享页面添加一个按钮，用于将笔记内容导出为Markdown文件。智能识别富文本和Markdown两种页面类型并进行相应处理。
// @description:en Add a button on Youdao Note share pages to export content as a Markdown file. Intelligently handles both rich text and Markdown note types.
// @author       SkyForever
// @match        https://share.note.youdao.com/*
// @match        https://note.youdao.com/ynoteshare/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550754/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E5%AF%BC%E5%87%BA%E4%B8%BAmarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/550754/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E5%AF%BC%E5%87%BA%E4%B8%BAmarkdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 富文本解析模块 (旧版页面) ---
    const richTextParser = {
        parseNode: function(node) {
            if (node.nodeType === 3) return node.textContent;
            if (node.nodeType !== 1) return '';

            let innerMarkdown = Array.from(node.childNodes).map(child => this.parseNode(child)).join('');
            const isBold = node.style.fontWeight === 'bold' || node.classList.contains('bold');
            if (isBold && innerMarkdown.trim() !== '') {
                if (!innerMarkdown.startsWith('**') && !innerMarkdown.endsWith('**')) {
                    innerMarkdown = `**${innerMarkdown}**`;
                }
            }
            if (node.tagName.toLowerCase() === 'a' && node.hasAttribute('href')) {
                return `[${innerMarkdown}](${node.getAttribute('href')})`;
            }
            if (node.tagName.toLowerCase() === 'br') {
                return '\n';
            }
            return innerMarkdown;
        },

        convertHeading: function(block) {
            const level = parseInt(block.dataset.headingLevel.replace('h', ''), 10);
            return `${'#'.repeat(level)} ${this.parseNode(block).trim()}`;
        },

        convertParagraph: function(block) {
            const text = this.parseNode(block).trim();
            return (text === '' && (block.innerHTML.includes('&nbsp;') || block.textContent.trim() === '')) ? '' : text;
        },

        convertImage: function(block) {
            const img = block.querySelector('img');
            return img ? `![image](${img.getAttribute('src')})` : '';
        },

        convertListItem: function(block) {
            const li = block.querySelector('li');
            if (!li) return null;
            const text = this.parseNode(li).trim();
            let prefix = '* ';
            const placeholder = block.querySelector('.item-list-placeholder');
            let indent = '';
            if (placeholder && placeholder.style.left) {
                const left = parseInt(placeholder.style.left, 10);
                if (left > 0) indent = '    '.repeat(Math.round(left / 28));
            }
            if (block.hasAttribute('start')) {
                prefix = `${placeholder ? placeholder.textContent.trim() : '1.'} `;
            }
            return `${indent}${prefix}${text}`;
        },

        convertCodeBlock: function(block) {
            const langElement = block.querySelector('.change-language .css-u30aqu');
            const lang = langElement ? langElement.textContent.trim().toLowerCase() : '';
            const codeLines = Array.from(block.querySelectorAll('pre[data-block-type="code-line"]')).map(pre => pre.textContent);
            return `\`\`\`${lang}\n${codeLines.join('\n')}\n\`\`\``;
        },

        run: function(editor) {
            const blocks = Array.from(editor.children);
            const markdownLines = [];
            blocks.forEach(block => {
                let mdLine = null;
                const blockType = block.dataset.blockType;
                if (block.tagName.toLowerCase() === 'ul' && blockType === 'list-item') {
                    mdLine = this.convertListItem(block);
                } else {
                    switch (blockType) {
                        case 'heading': mdLine = this.convertHeading(block); break;
                        case 'paragraph': mdLine = this.convertParagraph(block); break;
                        case 'image': mdLine = this.convertImage(block); break;
                        case 'code': mdLine = this.convertCodeBlock(block); break;
                        default:
                            if (block.textContent && block.textContent.trim()) {
                                mdLine = this.parseNode(block);
                            }
                            break;
                    }
                }
                if (mdLine !== null) markdownLines.push(mdLine);
            });
            return formatMarkdownOutput(markdownLines);
        }
    };

    // --- Markdown 原生页面解析模块 (新版页面) ---
    const markdownParser = {
        // 由于是原生Markdown渲染，直接从HTML标签转换
        run: function(editor) {
            const TurndownService = window.TurndownService || (function() {
                // 内联一个简化的turndown版本或提示用户安装
                alert('Turndown library not found. Please add `@require https://unpkg.com/turndown/dist/turndown.js` to the script header.');
                return function() { this.turndown = text => text; };
            })();
            const turndownService = new TurndownService({ codeBlockStyle: 'fenced' });
            return turndownService.turndown(editor.innerHTML);
        }
    };

    /**
     * 格式化Markdown输出，处理换行
     */
    function formatMarkdownOutput(lines) {
        let fullMarkdown = '';
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '' && (i === 0 || lines[i - 1].trim() === '')) continue;
            fullMarkdown += lines[i];
            const isCurrentList = /^((\s*[-*]|\s*\d+\.)\s)/.test(lines[i]);
            const isNextList = (i + 1 < lines.length) && /^((\s*[-*]|\s*\d+\.)\s)/.test(lines[i + 1]);
            fullMarkdown += (isCurrentList && isNextList) ? '\n' : '\n\n';
        }
        return fullMarkdown.trim();
    }

    /**
     * 主导出函数
     */
    function exportToMarkdown() {
        const iframe = document.getElementById('content-body');
        if (!iframe) {
            alert('错误：未找到笔记内容的iframe框架！');
            return;
        }

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDoc) {
            alert('错误：无法访问iframe的文档内容！');
            return;
        }

        let markdownContent = '';
        const noteTitle = document.querySelector('.file-name')?.title || 'youdao-note';

        // 判断页面类型
        if (iframeDoc.querySelector('.bulb-editor-inner')) { // 旧版富文本
            console.log("检测到富文本笔记，使用富文本解析器。");
            const editor = iframeDoc.querySelector('.bulb-editor-inner');
            markdownContent = richTextParser.run(editor);
        } else if (iframeDoc.querySelector('.markdown-body')) { // 新版Markdown
            console.log("检测到Markdown笔记，使用Turndown解析器。");
            // 动态加载turndown库
            loadScript('https://unpkg.com/turndown/dist/turndown.js', () => {
                const editor = iframeDoc.querySelector('.markdown-body');
                markdownContent = markdownParser.run(editor);
                downloadMarkdown(markdownContent, noteTitle);
            });
            return; // 异步执行，直接返回
        } else {
            alert('错误：未识别的笔记类型或内容未加载！');
            return;
        }

        downloadMarkdown(markdownContent, noteTitle);
    }

    /**
     * 统一的下载处理函数
     */
    function downloadMarkdown(content, title) {
        const safeFilename = title.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, '_') || 'youdao-note';
        downloadFile(content, `${safeFilename}.md`);
    }

    /**
     * 下载文件工具函数
     */
    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 动态加载外部JS脚本
     */
    function loadScript(url, callback) {
        if (window.TurndownService) { // 如果已加载，直接回调
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        script.onerror = () => alert('加载Turndown库失败，请检查网络连接或脚本设置。');
        document.head.appendChild(script);
    }


    /**
     * 在页面上创建并添加导出按钮
     */
    function addExportButton() {
        if (document.getElementById('export-md-button')) return;

        const button = document.createElement('button');
        button.id = 'export-md-button';
        button.textContent = '导出为MD';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        button.addEventListener('mouseover', () => button.style.backgroundColor = '#45a049');
        button.addEventListener('mouseout', () => button.style.backgroundColor = '#4CAF50');
        button.addEventListener('click', exportToMarkdown);

        document.body.appendChild(button);
    }

    // 使用MutationObserver来监控DOM变化，确保iframe加载后能及时添加按钮
    const observer = new MutationObserver((mutations, obs) => {
        const iframe = document.getElementById('content-body');
        if (iframe) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc && (iframeDoc.querySelector('.bulb-editor-inner') || iframeDoc.querySelector('.markdown-body'))) {
                addExportButton();
                obs.disconnect(); // 找到后停止观察
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();