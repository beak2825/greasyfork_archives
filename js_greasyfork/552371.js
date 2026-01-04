// ==UserScript==
// @name         Kimi K2 聊天记录导出器
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  🚀 专为Kimi K2版本设计的聊天记录导出工具，支持Markdown格式导出，包含丰富的图标和格式化内容
// @author       AI Assistant
// @match        https://www.kimi.com/chat/*
// @match        https://kimi.com/chat/*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QjZCIi8+Cjwvc3ZnPgo=
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552371/Kimi%20K2%20%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552371/Kimi%20K2%20%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🎨 配置常量
    const CONFIG = {
        EXPORT_BUTTON_TEXT: '📥 导出聊天记录',
        EXPORTING_TEXT: '⏳ 正在导出...',
        SUCCESS_TEXT: '✅ 导出成功',
        ERROR_TEXT: '❌ 导出失败',
        BUTTON_POSITION: 'fixed',
        BUTTON_Z_INDEX: '9999',
        BUTTON_BG_COLOR: '#10a37f',
        BUTTON_HOVER_COLOR: '#0d8c6d',
        MARKDOWN_THEME: 'github',
        INCLUDE_TIMESTAMP: true,
        INCLUDE_METADATA: true
    };

    // 📝 图标和样式定义
    const ICONS = {
        USER: '👤',
        ASSISTANT: '🤖',
        KIMI: '🌙',
        TIME: '⏰',
        LINK: '🔗',
        CODE: '💻',
        QUOTE: '📖',
        LIST: '📋',
        WARNING: '⚠️',
        SUCCESS: '✅',
        ERROR: '❌',
        INFO: 'ℹ️',
        EXPORT: '📥',
        DOWNLOAD: '💾',
        COPY: '📋',
        SETTINGS: '⚙️',
        HELP: '❓',
        IMAGE: '🖼️',
        HEADING: '📝'
    };

    // 🔍 选择器定义
    const SELECTORS = {
        CHAT_CONTAINER: '.chat-content-list',
        MESSAGE_ITEM: '.chat-content-item',
        USER_MESSAGE: '.chat-content-item-user',
        ASSISTANT_MESSAGE: '.chat-content-item-assistant',
        MESSAGE_CONTENT: '.segment-content',
        MESSAGE_TIME: '.segment-time',
        CHAT_TITLE: '.chat-header-content h2',
        SIDEBAR: '.sidebar-nav',
        EXPORT_BUTTON: '.kimi-export-btn',
        TOOLBAR: '.chat-action'
    };

    // 🛠️ 工具函数
    const Utils = {
        // 等待元素出现
        waitForElement(selector, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                const observer = new MutationObserver(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        observer.disconnect();
                        resolve(element);
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`元素 ${selector} 未找到`));
                }, timeout);
            });
        },

        // 格式化时间戳
        formatTimestamp(date) {
            const now = new Date();
            const diff = now - date;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) return '刚刚';
            if (minutes < 60) return `${minutes}分钟前`;
            if (hours < 24) return `${hours}小时前`;
            if (days < 7) return `${days}天前`;
            
            return date.toLocaleString('zh-CN');
        },

        // 转义Markdown特殊字符
        escapeMarkdown(text) {
            return text.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
        },

        // 检测代码块
        isCodeBlock(text) {
            const codeIndicators = [
                'function', 'const ', 'let ', 'var ', 'if(', 'for(', 'while(',
                'import ', 'export ', 'class ', 'def ', '```', '{', '}'
            ];
            return codeIndicators.some(indicator => text.includes(indicator));
        },

        // 检测链接
        extractLinks(text) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.match(urlRegex) || [];
        },

        // 生成唯一文件名
        generateFileName(chatTitle) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const safeTitle = chatTitle.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50);
            return `kimi-chat-${safeTitle}-${timestamp}.md`;
        },

        // 显示通知
        showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `kimi-notification kimi-notification-${type}`;
            notification.innerHTML = `
                <div class="kimi-notification-content">
                    <span class="kimi-notification-icon">${type === 'success' ? ICONS.SUCCESS : ICONS.ERROR}</span>
                    <span class="kimi-notification-text">${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // 添加动画样式
            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // 🎨 样式管理器
    const StyleManager = {
        init() {
            const style = document.createElement('style');
            style.textContent = `
                /* 导出按钮样式 */
                .kimi-export-btn {
                    position: ${CONFIG.BUTTON_POSITION};
                    top: 20px;
                    right: 20px;
                    z-index: ${CONFIG.BUTTON_Z_INDEX};
                    background: ${CONFIG.BUTTON_BG_COLOR};
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(16, 163, 127, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .kimi-export-btn:hover {
                    background: ${CONFIG.BUTTON_HOVER_COLOR};
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(16, 163, 127, 0.4);
                }

                .kimi-export-btn:active {
                    transform: translateY(0);
                }

                .kimi-export-btn.exporting {
                    background: #6c757d;
                    cursor: not-allowed;
                }

                /* 通知样式 */
                .kimi-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    padding: 16px 20px;
                    z-index: 10000;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    max-width: 300px;
                }

                .kimi-notification.show {
                    transform: translateX(0);
                }

                .kimi-notification-success {
                    border-left: 4px solid #28a745;
                }

                .kimi-notification-error {
                    border-left: 4px solid #dc3545;
                }

                .kimi-notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .kimi-notification-icon {
                    font-size: 18px;
                }

                .kimi-notification-text {
                    font-size: 14px;
                    color: #333;
                }

                /* 导出选项面板 */
                .kimi-export-panel {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    padding: 24px;
                    z-index: 10001;
                    max-width: 400px;
                    width: 90%;
                }

                .kimi-export-panel h3 {
                    margin: 0 0 20px 0;
                    color: #333;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .kimi-export-options {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .kimi-export-option {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .kimi-export-option input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    accent-color: #10a37f;
                }

                .kimi-export-option label {
                    font-size: 14px;
                    color: #555;
                    cursor: pointer;
                }

                .kimi-export-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .kimi-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .kimi-btn-primary {
                    background: #10a37f;
                    color: white;
                }

                .kimi-btn-secondary {
                    background: #f8f9fa;
                    color: #6c757d;
                    border: 1px solid #dee2e6;
                }

                .kimi-btn:hover {
                    transform: translateY(-1px);
                }

                /* 遮罩层 */
                .kimi-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                }

                /* 加载动画 */
                .kimi-loading {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    border-top-color: transparent;
                    animation: kimi-spin 1s ease-in-out infinite;
                }

                @keyframes kimi-spin {
                    to { transform: rotate(360deg); }
                }

                /* 响应式设计 */
                @media (max-width: 768px) {
                    .kimi-export-btn {
                        top: auto;
                        bottom: 20px;
                        right: 20px;
                        padding: 10px 16px;
                        font-size: 12px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // 📊 数据提取器
    const DataExtractor = {
        // 提取聊天消息（改进版，支持富文本格式）
        extractMessages() {
            const messages = [];
            const messageElements = document.querySelectorAll(SELECTORS.MESSAGE_ITEM);

            messageElements.forEach((element, index) => {
                try {
                    const isUser = element.classList.contains('chat-content-item-user');
                    const isAssistant = element.classList.contains('chat-content-item-assistant');
                    
                    // 提取富文本内容，保留格式
                    const content = this.extractRichContent(element);
                    
                    if (content && content.trim()) {
                        messages.push({
                            id: `msg-${index}`,
                            role: isUser ? 'user' : 'assistant',
                            content: content.trim(),
                            timestamp: this.extractTimestamp(element),
                            type: this.detectRichContentType(element),
                            metadata: this.extractRichMetadata(element)
                        });
                    }
                } catch (error) {
                    console.warn('提取消息失败:', error);
                }
            });

            return messages;
        },

        // 提取富文本内容（改进版）
        extractRichContent(element) {
            const contentElement = element.querySelector(SELECTORS.MESSAGE_CONTENT);
            if (!contentElement) return '';

            // 克隆元素以避免修改原始DOM
            const clone = contentElement.cloneNode(true);
            
            // 处理不同类型的内容
            let content = '';

            // 1. 处理代码块
            const codeBlocks = clone.querySelectorAll('pre');
            codeBlocks.forEach(codeBlock => {
                const codeContent = codeBlock.textContent;
                const language = this.detectCodeLanguage(codeBlock);
                const codeMarkdown = `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n`;
                
                // 用占位符替换代码块，避免重复处理
                const placeholder = `__CODE_BLOCK_${Math.random().toString(36).substr(2, 9)}__`;
                codeBlock.outerHTML = placeholder;
                content = content || clone.innerHTML;
                content = content.replace(placeholder, codeMarkdown);
            });

            // 2. 处理表格
            const tables = clone.querySelectorAll('table');
            tables.forEach(table => {
                const tableMarkdown = this.convertTableToMarkdown(table);
                const placeholder = `__TABLE_${Math.random().toString(36).substr(2, 9)}__`;
                table.outerHTML = placeholder;
                content = content || clone.innerHTML;
                content = content.replace(placeholder, tableMarkdown);
            });

            // 3. 处理引用块
            const quotes = clone.querySelectorAll('blockquote');
            quotes.forEach(quote => {
                const quoteContent = this.cleanHtmlAndConvertInlineFormat(quote.innerHTML);
                const quotedLines = quoteContent.split('\n').map(line => `> ${line}`).join('\n');
                const placeholder = `__QUOTE_${Math.random().toString(36).substr(2, 9)}__`;
                quote.outerHTML = placeholder;
                content = content || clone.innerHTML;
                content = content.replace(placeholder, `\n\n${quotedLines}\n\n`);
            });

            // 4. 处理列表
            const lists = clone.querySelectorAll('ol, ul');
            lists.forEach(list => {
                const listMarkdown = this.convertListToMarkdown(list);
                const placeholder = `__LIST_${Math.random().toString(36).substr(2, 9)}__`;
                list.outerHTML = placeholder;
                content = content || clone.innerHTML;
                content = content.replace(placeholder, listMarkdown);
            });

            // 5. 处理图片
            const images = clone.querySelectorAll('img');
            images.forEach(img => {
                const alt = img.alt || '';
                const src = img.src || '';
                const title = img.title || '';
                const imageMarkdown = title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`;
                const placeholder = `__IMAGE_${Math.random().toString(36).substr(2, 9)}__`;
                img.outerHTML = placeholder;
                content = content || clone.innerHTML;
                content = content.replace(placeholder, `\n\n${imageMarkdown}\n\n`);
            });

            // 6. 处理剩余内容
            if (!content) {
                content = clone.innerHTML;
            }

            // 7. 清理HTML标签并转换内联格式
            content = this.cleanHtmlAndConvertInlineFormat(content);

            return content.trim();
        },

        // 检测代码语言
        detectCodeLanguage(codeBlock) {
            const codeElement = codeBlock.querySelector('code');
            if (!codeElement) return '';

            // 检查class属性
            const classes = codeElement.className.split(' ');
            for (const cls of classes) {
                if (cls.startsWith('language-')) {
                    return cls.replace('language-', '');
                }
            }

            // 常见的代码语言关键词检测
            const codeText = codeElement.textContent;
            const languagePatterns = {
                'javascript': /\b(function|const|let|var|if|else|for|while|return)\b/,
                'python': /\b(def|class|import|from|if __name__|print)\b/,
                'java': /\b(public|private|class|void|static|String)\b/,
                'cpp': /\b(#include|int main|std::|cout|cin)\b/,
                'html': /\<\/?(div|span|p|a|img|html|head|body)/,
                'css': /\{[^}]*:[^;]*;/,
                'sql': /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/i,
                'bash': /\b(echo|cd|ls|mkdir|sudo|#!\/bin\/bash)\b/,
                'json': /^\s*[\{\[]/,
                'xml': /\<\?xml/,
                'markdown': /\[.*\]\(.*\)|#{1,6}\s|\*\*.*\*\*/
            };

            for (const [lang, pattern] of Object.entries(languagePatterns)) {
                if (pattern.test(codeText)) {
                    return lang;
                }
            }

            return '';
        },

        // 转换表格为Markdown
        convertTableToMarkdown(table) {
            const rows = table.querySelectorAll('tr');
            if (rows.length === 0) return '';

            let markdown = '\n';
            const maxCols = Math.max(...Array.from(rows).map(row => row.querySelectorAll('th, td').length));

            rows.forEach((row, rowIndex) => {
                const cells = Array.from(row.querySelectorAll('th, td'));
                const cellContents = cells.map(cell => cell.textContent.trim());
                
                // 补齐缺失的单元格
                while (cellContents.length < maxCols) {
                    cellContents.push('');
                }

                markdown += '| ' + cellContents.join(' | ') + ' |\n';

                // 表头分隔线
                if (rowIndex === 0) {
                    markdown += '|' + Array(maxCols).fill('---').join('|') + '|\n';
                }
            });

            return markdown + '\n';
        },

        // 转换列表为Markdown（改进版，支持嵌套）
        convertListToMarkdown(list, level = 0) {
            const items = list.querySelectorAll(':scope > li');
            if (items.length === 0) return '';

            const isOrdered = list.tagName.toLowerCase() === 'ol';
            let markdown = '\n';
            
            const indent = '  '.repeat(level);

            items.forEach((item, index) => {
                const prefix = isOrdered ? `${index + 1}.` : '-';
                const content = this.cleanHtmlAndConvertInlineFormat(item.innerHTML);
                const cleanContent = content.replace(/\n/g, ' ').trim();
                
                markdown += `${indent}${prefix} ${cleanContent}\n`;
                
                // 处理嵌套列表
                const nestedLists = item.querySelectorAll(':scope > ul, :scope > ol');
                nestedLists.forEach(nestedList => {
                    const nestedMarkdown = this.convertListToMarkdown(nestedList, level + 1);
                    markdown += nestedMarkdown;
                });
            });

            return markdown + '\n';
        },

        // 清理HTML并转换内联格式（改进版）
        cleanHtmlAndConvertInlineFormat(content) {
            // 先处理链接，保留文本内容
            content = this.processLinksInContent(content);
            
            // 处理图片
            content = this.processImagesInContent(content);
            
            // 转换内联格式
            const replacements = {
                '<strong>': '**', '</strong>': '**',
                '<b>': '**', '</b>': '**',
                '<em>': '*', '</em>': '*',
                '<i>': '*', '</i>': '*',
                '<code>': '`', '</code>': '`',
                '<br>': '\n',
                '<br/>': '\n',
                '<p>': '\n\n',
                '</p>': '\n\n',
                '<h1>': '# ', '</h1>': '\n\n',
                '<h2>': '## ', '</h2>': '\n\n',
                '<h3>': '### ', '</h3>': '\n\n',
                '<h4>': '#### ', '</h4>': '\n\n',
                '<h5>': '##### ', '</h5>': '\n\n',
                '<h6>': '###### ', '</h6>': '\n\n',
                '<div>': '\n', '</div>': '\n',
                '<span>': '', '</span>': ''
            };

            let cleaned = content;
            for (const [html, markdown] of Object.entries(replacements)) {
                const escaped = html.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escaped, 'g');
                cleaned = cleaned.replace(regex, markdown);
            }

            // 清理剩余的HTML标签，但保留实体
            cleaned = cleaned.replace(/<[^>]*>/g, '');
            
            // 转换HTML实体
            const entities = {
                '&nbsp;': ' ',
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&apos;': "'",
                '&#39;': "'",
                '&hellip;': '...',
                '&mdash;': '—',
                '&ndash;': '–'
            };
            
            for (const [entity, char] of Object.entries(entities)) {
                cleaned = cleaned.replace(new RegExp(entity, 'g'), char);
            }
            
            // 清理多余的空行和空格
            cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
            cleaned = cleaned.replace(/[ \t]+/g, ' ');
            cleaned = cleaned.replace(/^\s+|\s+$/g, '');
            
            return cleaned.trim();
        },

        // 处理内容中的链接
        processLinksInContent(content) {
            // 匹配完整的<a>标签
            const linkRegex = /<a\s+href="([^"]*)"(?:\s+title="([^"]*)")?[^>]*>(.*?)<\/a>/gi;
            
            return content.replace(linkRegex, (match, href, title, linkText) => {
                // 清理链接文本中的HTML标签
                const cleanText = linkText.replace(/<[^>]*>/g, '').trim();
                const linkTitle = title ? ` "${title}"` : '';
                return `[${cleanText}](${href}${linkTitle})`;
            });
        },

        // 处理内容中的图片
        processImagesInContent(content) {
            // 匹配完整的<img>标签
            const imgRegex = /<img\s+src="([^"]*)"(?:\s+alt="([^"]*)")?(?:\s+title="([^"]*)")?[^>]*>/gi;
            
            return content.replace(imgRegex, (match, src, alt, title) => {
                const imgAlt = alt || '';
                const imgTitle = title ? ` "${title}"` : '';
                return `![${imgAlt}](${src}${imgTitle})`;
            });
        },

        // 提取时间戳
        extractTimestamp(element) {
            const timeElement = element.querySelector(SELECTORS.MESSAGE_TIME);
            if (timeElement) {
                return new Date(timeElement.textContent.trim());
            }
            
            // 尝试从其他属性获取
            const timeAttr = element.getAttribute('data-time') || 
                           element.getAttribute('data-timestamp');
            if (timeAttr) {
                return new Date(parseInt(timeAttr));
            }
            
            return new Date();
        },

        // 检测富文本内容类型（改进版）
        detectRichContentType(element) {
            const contentElement = element.querySelector(SELECTORS.MESSAGE_CONTENT);
            if (!contentElement) return 'text';

            // 统计不同类型的元素数量
            const codeBlocks = contentElement.querySelectorAll('pre').length;
            const inlineCodes = contentElement.querySelectorAll('code:not(pre code)').length;
            const tables = contentElement.querySelectorAll('table').length;
            const quotes = contentElement.querySelectorAll('blockquote').length;
            const orderedLists = contentElement.querySelectorAll('ol').length;
            const unorderedLists = contentElement.querySelectorAll('ul').length;
            const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
            const images = contentElement.querySelectorAll('img').length;
            const links = contentElement.querySelectorAll('a').length;

            // 根据主要特征确定类型
            if (codeBlocks > 0) return 'code-block';
            if (tables > 0) return 'table';
            if (quotes > 0) return 'quote';
            if (orderedLists > 0) return 'ordered-list';
            if (unorderedLists > 0) return 'unordered-list';
            
            // 混合内容类型
            if (headings > 0) return 'with-headings';
            if (images > 0) return 'with-images';
            if (links > 0) return 'with-links';
            if (inlineCodes > 0) return 'inline-code';
            
            return 'text';
        },

        // 提取富文本元数据
        extractRichMetadata(element) {
            const metadata = {};
            const contentElement = element.querySelector(SELECTORS.MESSAGE_CONTENT);
            if (!contentElement) return metadata;
            
            // 提取代码语言（如果有代码块）
            const codeBlock = contentElement.querySelector('pre code');
            if (codeBlock) {
                metadata.language = this.detectCodeLanguage(codeBlock.closest('pre'));
            }
            
            // 提取表格结构（如果有表格）
            const table = contentElement.querySelector('table');
            if (table) {
                metadata.hasTable = true;
                metadata.tableRows = table.querySelectorAll('tr').length;
                metadata.tableCols = Math.max(...Array.from(table.querySelectorAll('tr')).map(row => row.querySelectorAll('th, td').length));
            }
            
            // 提取链接信息
            const links = contentElement.querySelectorAll('a[href]');
            if (links.length > 0) {
                metadata.links = Array.from(links).map(link => ({
                    text: link.textContent.trim(),
                    url: link.href,
                    title: link.title || ''
                }));
            }
            
            // 提取图片信息
                const images = contentElement.querySelectorAll('img[src]');
                if (images.length > 0) {
                    metadata.images = Array.from(images).map(img => ({
                        alt: img.alt || '',
                        src: img.src,
                        title: img.title || '',
                        placeholder: `__IMAGE_${Math.random().toString(36).substr(2, 9)}__`
                    }));
                }
            
            // 提取引用信息
            const quotes = contentElement.querySelectorAll('blockquote');
            if (quotes.length > 0) {
                metadata.quotes = quotes.length;
            }
            
            // 提取列表信息
            const lists = contentElement.querySelectorAll('ol, ul');
            if (lists.length > 0) {
                metadata.lists = lists.length;
                metadata.listItems = Array.from(lists).reduce((total, list) => total + list.querySelectorAll('li').length, 0);
            }
            
            // 提取标题信息
            const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
            if (headings.length > 0) {
                metadata.headings = Array.from(headings).map(h => ({
                    level: parseInt(h.tagName.charAt(1)),
                    text: h.textContent.trim()
                }));
            }
            
            return metadata;
        },

        // 提取聊天标题
        extractChatTitle() {
            const titleElement = document.querySelector(SELECTORS.CHAT_TITLE);
            return titleElement ? titleElement.textContent.trim() : 'Kimi 聊天记录';
        },

        // 提取用户信息
        extractUserInfo() {
            const userInfo = {
                name: '用户',
                avatar: null
            };
            
            // 尝试从localStorage获取用户信息
            try {
                const userData = localStorage.getItem('user_info');
                if (userData) {
                    const parsed = JSON.parse(userData);
                    if (parsed.name) userInfo.name = parsed.name;
                    if (parsed.avatar) userInfo.avatar = parsed.avatar;
                }
            } catch (error) {
                console.warn('无法解析用户信息:', error);
            }
            
            return userInfo;
        }
    };

    // 📝 Markdown生成器
    const MarkdownGenerator = {
        // 生成Markdown文档
        generate(messages, chatTitle, userInfo, options = {}) {
            const { includeTimestamp = true, includeMetadata = true } = options;
            
            let markdown = '';
            
            // 文档头部
            markdown += this.generateHeader(chatTitle);
            
            // 元数据信息
            if (includeMetadata) {
                markdown += this.generateMetadata(chatTitle, userInfo, messages.length);
            }
            
            // 目录
            markdown += this.generateTableOfContents(messages);
            
            // 消息内容
            markdown += this.generateMessages(messages, includeTimestamp);
            
            // 文档尾部
            markdown += this.generateFooter();
            
            return markdown;
        },

        // 生成文档头部
        generateHeader(title) {
            return `# ${ICONS.KIMI} ${title}

> ${ICONS.INFO} 本文档由 Kimi K2 聊天记录导出器生成
> 
> 生成时间：${new Date().toLocaleString('zh-CN')}

---

`;
        },

        // 生成元数据
        generateMetadata(chatTitle, userInfo, messageCount) {
            return `## ${ICONS.INFO} 会话信息

| 项目 | 内容 |
|------|------|
| ${ICONS.KIMI} 会话标题 | ${chatTitle} |
| ${ICONS.USER} 用户 | ${userInfo.name} |
| ${ICONS.TIME} 消息总数 | ${messageCount} 条 |
| ${ICONS.TIME} 导出时间 | ${new Date().toLocaleString('zh-CN')} |

---

`;
        },

        // 生成目录
        generateTableOfContents(messages) {
            let toc = `## ${ICONS.LIST} 目录\n\n`;
            
            messages.forEach((message, index) => {
                const roleIcon = message.role === 'user' ? ICONS.USER : ICONS.ASSISTANT;
                const preview = message.content.substring(0, 30).replace(/\n/g, ' ');
                const suffix = message.content.length > 30 ? '...' : '';
                
                toc += `${index + 1}. [${roleIcon} ${message.role === 'user' ? '用户' : 'Kimi'}: ${preview}${suffix}](#message-${index + 1})\n`;
            });
            
            return toc + '\n---\n\n';
        },

        // 生成消息内容（改进版，显示内容类型）
        generateMessages(messages, includeTimestamp) {
            let content = `## ${ICONS.KIMI} 对话内容\n\n`;
            
            messages.forEach((message, index) => {
                const roleIcon = message.role === 'user' ? ICONS.USER : ICONS.ASSISTANT;
                const roleName = message.role === 'user' ? '用户' : 'Kimi';
                const contentTypeIcon = this.getContentTypeIcon(message.type);
                const contentTypeDesc = this.getContentTypeDescription(message.type);
                
                content += `### <span id="message-${index + 1}">${roleIcon} ${roleName}</span>\n\n`;
                
                // 显示内容类型信息
                if (message.type !== 'text') {
                    content += `> ${contentTypeIcon} **内容类型**: ${contentTypeDesc}\n`;
                    
                    // 显示元数据信息
                    if (message.metadata) {
                        if (message.metadata.language) {
                            content += `> ${ICONS.CODE} **代码语言**: \`${message.metadata.language}\`\n`;
                        }
                        if (message.metadata.hasTable) {
                            content += `> ${ICONS.TABLE} **表格**: ${message.metadata.tableRows}行 × ${message.metadata.tableCols}列\n`;
                        }
                        if (message.metadata.quotes) {
                            content += `> ${ICONS.QUOTE} **引用块**: ${message.metadata.quotes}个\n`;
                        }
                        if (message.metadata.lists) {
                            content += `> ${ICONS.LIST} **列表**: ${message.metadata.lists}个列表，共${message.metadata.listItems}项\n`;
                        }
                        if (message.metadata.headings) {
                            content += `> ${ICONS.HEADING} **标题**: ${message.metadata.headings.length}个\n`;
                        }
                        if (message.metadata.images) {
                            content += `> ${ICONS.IMAGE} **图片**: ${message.metadata.images.length}张\n`;
                        }
                        if (message.metadata.links) {
                            content += `> ${ICONS.LINK} **链接**: ${message.metadata.links.length}个\n`;
                        }
                    }
                    content += '\n';
                }
                
                if (includeTimestamp && message.timestamp) {
                    content += `> ${ICONS.TIME} ${Utils.formatTimestamp(message.timestamp)}\n\n`;
                }
                
                // 根据消息类型格式化内容
                content += this.formatMessageContent(message);
                
                content += '\n---\n\n';
            });
            
            return content;
        },

        // 获取内容类型图标
        getContentTypeIcon(type) {
            const iconMap = {
                'code-block': ICONS.CODE,
                'inline-code': '💻',
                'table': ICONS.TABLE,
                'quote': ICONS.QUOTE,
                'ordered-list': '📋',
                'unordered-list': '•',
                'with-headings': ICONS.HEADING,
                'with-images': ICONS.IMAGE,
                'with-links': ICONS.LINK,
                'text': '📝'
            };
            return iconMap[type] || '📝';
        },

        // 获取内容类型描述
        getContentTypeDescription(type) {
            const descMap = {
                'code-block': '代码块',
                'inline-code': '内联代码',
                'table': '表格',
                'quote': '引用',
                'ordered-list': '有序列表',
                'unordered-list': '无序列表',
                'with-headings': '包含标题',
                'with-images': '包含图片',
                'with-links': '包含链接',
                'text': '普通文本'
            };
            return descMap[type] || '普通文本';
        },

        // 格式化消息内容（改进版）
        formatMessageContent(message) {
            let content = message.content;
            
            // 根据消息类型进行格式化
            switch (message.type) {
                case 'code-block':
                    // 代码块已经在新提取器中处理过了，直接返回
                    return content + '\n';
                    
                case 'table':
                    // 表格已经在新提取器中处理过了，直接返回
                    return content + '\n';
                    
                case 'quote':
                    // 引用已经在新提取器中处理过了，直接返回
                    return content + '\n';
                    
                case 'ordered-list':
                case 'unordered-list':
                    // 列表已经在新提取器中处理过了，直接返回
                    return content + '\n';
                    
                case 'with-headings':
                    // 标题已经在提取器中转换为Markdown格式
                    return content + '\n';
                    
                case 'with-images':
                    // 处理图片 - 使用元数据中保存的占位符
                    if (message.metadata?.images) {
                        message.metadata.images.forEach(img => {
                            const imgMarkdown = `![${img.alt}](${img.src})`;
                            if (img.placeholder) {
                                // 使用保存的占位符进行替换
                                content = content.replace(new RegExp(img.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), imgMarkdown);
                            }
                        });
                    }
                    return content + '\n';
                    
                case 'with-links':
                    // 链接已经在提取器中处理过了
                    return content + '\n';
                    
                case 'inline-code':
                    // 内联代码已经在提取器中处理过了
                    return content + '\n';
                    
                default:
                    // 普通文本，按段落处理
                    return content.split('\n\n').map(paragraph => {
                        return paragraph.replace(/\n/g, '  \n');
                    }).join('\n\n') + '\n';
            }
        },

        // 生成文档尾部
        generateFooter() {
            return `---

## ${ICONS.HELP} 使用说明

- 📋 **复制代码**：点击代码块右上角的复制按钮
- 🔗 **打开链接**：直接点击文档中的链接
- 📖 **导航**：使用文档开头的目录快速跳转到指定消息
- 💾 **保存**：建议将本文档保存为本地文件以便长期保存

---

<div align="center">

**${ICONS.KIMI} 本文档由 Kimi K2 聊天记录导出器自动生成**

*生成时间：${new Date().toLocaleString('zh-CN')}*

</div>
`;
        }
    };

    // 🎛️ 导出管理器
    const ExportManager = {
        isExporting: false,

        // 初始化导出功能
        async init() {
            try {
                await Utils.waitForElement(SELECTORS.CHAT_CONTAINER);
                this.createExportButton();
                this.setupEventListeners();
                console.log('🚀 Kimi K2 导出器已初始化');
            } catch (error) {
                console.error('❌ 初始化导出器失败:', error);
            }
        },

        // 创建导出按钮
        createExportButton() {
            const button = document.createElement('button');
            button.className = 'kimi-export-btn';
            button.innerHTML = `
                <span class="kimi-export-icon">${ICONS.EXPORT}</span>
                <span class="kimi-export-text">${CONFIG.EXPORT_BUTTON_TEXT}</span>
            `;
            
            // 添加到页面
            document.body.appendChild(button);
            
            // 保存按钮引用
            this.exportButton = button;
        },

        // 设置事件监听器
        setupEventListeners() {
            this.exportButton.addEventListener('click', () => {
                this.showExportPanel();
            });

            // 监听聊天内容变化
            this.observeChatChanges();
        },

        // 观察聊天内容变化
        observeChatChanges() {
            const observer = new MutationObserver(() => {
                // 聊天内容发生变化时的处理
                console.log('📊 检测到聊天内容变化');
            });

            const chatContainer = document.querySelector(SELECTORS.CHAT_CONTAINER);
            if (chatContainer) {
                observer.observe(chatContainer, {
                    childList: true,
                    subtree: true
                });
            }
        },

        // 显示导出面板
        showExportPanel() {
            const overlay = document.createElement('div');
            overlay.className = 'kimi-overlay';
            
            const panel = document.createElement('div');
            panel.className = 'kimi-export-panel';
            panel.innerHTML = `
                <h3>${ICONS.EXPORT} 导出选项</h3>
                <div class="kimi-export-options">
                    <div class="kimi-export-option">
                        <input type="checkbox" id="include-timestamp" checked>
                        <label for="include-timestamp">${ICONS.TIME} 包含时间戳</label>
                    </div>
                    <div class="kimi-export-option">
                        <input type="checkbox" id="include-metadata" checked>
                        <label for="include-metadata">${ICONS.INFO} 包含元数据</label>
                    </div>
                    <div class="kimi-export-option">
                        <input type="checkbox" id="include-toc" checked>
                        <label for="include-toc">${ICONS.LIST} 包含目录</label>
                    </div>
                </div>
                <div class="kimi-export-actions">
                    <button class="kimi-btn kimi-btn-secondary" id="cancel-export">
                        取消
                    </button>
                    <button class="kimi-btn kimi-btn-primary" id="confirm-export">
                        ${ICONS.DOWNLOAD} 开始导出
                    </button>
                </div>
            `;
            
            overlay.appendChild(panel);
            document.body.appendChild(overlay);
            
            // 设置事件监听器
            this.setupPanelListeners(overlay, panel);
        },

        // 设置面板事件监听器
        setupPanelListeners(overlay, panel) {
            const cancelBtn = panel.querySelector('#cancel-export');
            const confirmBtn = panel.querySelector('#confirm-export');
            
            cancelBtn.addEventListener('click', () => {
                overlay.remove();
            });
            
            confirmBtn.addEventListener('click', () => {
                const options = {
                    includeTimestamp: panel.querySelector('#include-timestamp').checked,
                    includeMetadata: panel.querySelector('#include-metadata').checked,
                    includeToc: panel.querySelector('#include-toc').checked
                };
                
                overlay.remove();
                this.performExport(options);
            });
            
            // 点击遮罩关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });
        },

        // 执行导出
        async performExport(options) {
            if (this.isExporting) return;
            
            this.isExporting = true;
            this.updateButtonState(true);
            
            try {
                console.log('🚀 开始导出聊天记录...');
                
                // 提取数据
                const messages = DataExtractor.extractMessages();
                const chatTitle = DataExtractor.extractChatTitle();
                const userInfo = DataExtractor.extractUserInfo();
                
                console.log(`📊 提取到 ${messages.length} 条消息`);
                
                if (messages.length === 0) {
                    throw new Error('未找到聊天消息');
                }
                
                // 生成Markdown
                const markdown = MarkdownGenerator.generate(messages, chatTitle, userInfo, options);
                
                // 下载文件
                const fileName = Utils.generateFileName(chatTitle);
                this.downloadFile(markdown, fileName);
                
                // 显示成功通知
                Utils.showNotification(CONFIG.SUCCESS_TEXT, 'success');
                
                console.log(`✅ 导出成功: ${fileName}`);
                
            } catch (error) {
                console.error('❌ 导出失败:', error);
                Utils.showNotification(`${CONFIG.ERROR_TEXT}: ${error.message}`, 'error');
            } finally {
                this.isExporting = false;
                this.updateButtonState(false);
            }
        },

        // 更新按钮状态
        updateButtonState(isExporting) {
            if (isExporting) {
                this.exportButton.classList.add('exporting');
                this.exportButton.innerHTML = `
                    <span class="kimi-loading"></span>
                    <span class="kimi-export-text">${CONFIG.EXPORTING_TEXT}</span>
                `;
                this.exportButton.disabled = true;
            } else {
                this.exportButton.classList.remove('exporting');
                this.exportButton.innerHTML = `
                    <span class="kimi-export-icon">${ICONS.EXPORT}</span>
                    <span class="kimi-export-text">${CONFIG.EXPORT_BUTTON_TEXT}</span>
                `;
                this.exportButton.disabled = false;
            }
        },

        // 下载文件
        downloadFile(content, fileName) {
            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
        }
    };

    // 🚀 主程序
    class KimiK2Exporter {
        constructor() {
            this.version = '2.0.0';
            this.initialized = false;
        }

        async init() {
            try {
                console.log(`🚀 初始化 Kimi K2 聊天记录导出器 v${this.version}`);
                
                // 初始化样式
                StyleManager.init();
                
                // 等待页面加载完成
                await this.waitForPageLoad();
                
                // 初始化导出管理器
                await ExportManager.init();
                
                this.initialized = true;
                console.log('✅ Kimi K2 导出器初始化完成');
                
                // 显示欢迎通知
                setTimeout(() => {
                    Utils.showNotification('🎉 Kimi K2 聊天记录导出器已就绪！', 'success');
                }, 1000);
                
            } catch (error) {
                console.error('❌ 初始化失败:', error);
                Utils.showNotification('初始化失败，请刷新页面重试', 'error');
            }
        }

        // 等待页面加载完成
        async waitForPageLoad() {
            return new Promise((resolve) => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve);
                }
            });
        }

        // 获取版本信息
        getVersion() {
            return this.version;
        }

        // 检查是否已初始化
        isInitialized() {
            return this.initialized;
        }
    }

    // 🎯 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const exporter = new KimiK2Exporter();
            exporter.init();
            
            // 将导出器实例挂载到全局，便于调试
            window.__kimiK2Exporter = exporter;
        });
    } else {
        const exporter = new KimiK2Exporter();
        exporter.init();
        window.__kimiK2Exporter = exporter;
    }

    console.log('🌟 Kimi K2 聊天记录导出器脚本已加载');

})();