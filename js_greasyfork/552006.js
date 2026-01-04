// ==UserScript==
// @name         CNB Issue 网页内容收藏工具
// @namespace    https://cnb.cool/IIIStudio/Greasemonkey/CNBIssue/
// @version      1.3.5
// @description  在任意网页上选择页面区域，一键将选中内容从 HTML 转为 Markdown，按“页面信息 + 选择的内容”的格式展示，并可直接通过 CNB 接口创建 Issue。支持链接、图片、代码块/行内代码、标题、列表、表格、引用等常见结构的 Markdown 转换。
// @author       IIIStudio
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.cnb.cool
// @connect      cnb.cool
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552006/CNB%20Issue%20%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%94%B6%E8%97%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/552006/CNB%20Issue%20%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%94%B6%E8%97%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 内存与样式注入防重、窗口/观察者单例
    const __CNB_FLAGS = Object.create(null);
    function addStyleOnce(key, cssText) {
        try {
            if (__CNB_FLAGS[key]) return;
            if (typeof GM_addStyle === 'function') GM_addStyle(cssText);
            __CNB_FLAGS[key] = 1;
        } catch (_) {}
    }
    let __CNB_CLIP_DIALOG = null;
    let __CNB_SETTINGS_DIALOG = null, __CNB_SETTINGS_OVERLAY = null;
    let __CNB_ISSUE_DIALOG = null, __CNB_ISSUE_OVERLAY = null;
    let __CNB_MO = null;
    let __CNB_UNLOAD_BOUND = false;

    // 配置信息
    const CONFIG = {
        apiBase: 'https://api.cnb.cool',
        repoPath: '',
        accessToken: '',
        issueEndpoint: '/-/issues'
    };
    let SAVED_TAGS = [];
    // 选择模式快捷键（可在设置中修改），规范格式如：Shift+E
    let START_HOTKEY = 'Shift+E';
    let HOTKEY_ENABLED = false;

    // 添加自定义样式
    GM_addStyle(`
        .cnb-issue-floating-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #0366d6;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        .cnb-issue-floating-btn:hover {
            background: #0256b9;
            transform: scale(1.1);
        }
        .cnb-issue-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            min-width: 500px;
            max-width: 90vw;
            max-height: 80vh;
            overflow: auto;
            max-width: 450px;
        }
        .cnb-issue-dialog h3 {
            margin: 0 0 15px 0;
            color: #333;
        }
        .cnb-issue-dialog textarea {
            width: 100%;
            height: 300px;
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            resize: vertical;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 12px;
            line-height: 1.4;
        }
        .cnb-issue-dialog input {
            width: 100%;
            margin: 10px 0;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .cnb-issue-dialog-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 15px;
        }
        /* 仅底部操作按钮生效，避免影响设置区的小按钮与“×” */
        .cnb-issue-dialog .cnb-issue-dialog-buttons > button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color .15s ease, box-shadow .15s ease, transform .02s ease;
        }
        .cnb-issue-btn-confirm {
            background: #0366d6;
            color: white;
        }
        .cnb-issue-btn-cancel {
            background: #6c757d;
            color: white;
        }
        .cnb-issue-btn-confirm:hover {
            background: #0256b9;
        }
        .cnb-issue-btn-cancel:hover {
            background: #5a6268;
        }
        /* 新增：创建完成Issue 按钮样式（绿色） */
        .cnb-issue-btn-done {
            background: #28a745;
            color: white;
        }
        .cnb-issue-btn-done:hover {
            background: #218838;
        }
        .cnb-issue-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        }
        .cnb-issue-loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #0366d6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }

        /* 区域选择模式样式 */
        .cnb-selection-mode * {
            cursor: crosshair !important;
        }
        .cnb-selection-hover {
            outline: 2px solid #0366d6 !important;
            background-color: rgba(3, 102, 214, 0.1) !important;
        }
        .cnb-selection-selected {
            outline: 3px solid #28a745 !important;
            background-color: rgba(40, 167, 69, 0.15) !important;
        }
        .cnb-selection-tooltip {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10002;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .cnb-selection-tooltip button {
            margin-left: 10px;
            padding: 4px 8px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `);

    /* 左侧贴边 Dock 控制栏（自动隐藏，悬停显示） */
    GM_addStyle(`
        .cnb-dock {
            position: fixed;
            left: 0;
            top: 40%;
            transform: translateX(-88%);
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 8px 8px 8px 12px; /* 左侧保留把手可点区域 */
            background: rgba(255,255,255,0.95);
            border: 1px solid #d0d7de;
            border-left: none;
            border-radius: 0 8px 8px 0;
            box-shadow: 0 4px 16px rgba(0,0,0,0.12);
            z-index: 10002;
            transition: transform .2s ease, opacity .2s ease;
            opacity: 0;
        }
        .cnb-dock:hover,
        .cnb-dock.cnb-dock--visible {
            transform: translateX(0);
            opacity: 1;
        }
        .cnb-dock .cnb-dock-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 72px;
            height: 32px;
            padding: 0 10px;
            font-size: 13px;
            color: #24292f;
            background: #f6f8fa;
            border: 1px solid #d0d7de;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color .15s ease, box-shadow .15s ease, transform .02s ease;
        }
        .cnb-dock .cnb-dock-btn:hover {
            background: #eef2f6;
            box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        }
        .cnb-dock .cnb-dock-btn:active {
            transform: translateY(1px);
            box-shadow: 0 1px 3px rgba(0,0,0,0.18);
        }
        /* 左侧把手提示条 */
        .cnb-dock::before {
            content: '';
            position: absolute;
            left: 0;
            top: 12px;
            width: 10px;
            height: calc(100% - 24px);
            background: linear-gradient(180deg, #e9ecef, #dde2e7);
            border-right: 1px solid #d0d7de;
            border-radius: 0 6px 6px 0;
        }
    `);

    // 追加设置按钮样式
    GM_addStyle(`
        .cnb-issue-settings-btn {
            position: fixed;
            z-index: 10000;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.25);
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        .cnb-issue-settings-btn:hover {
            background: #5a6268;
            transform: scale(1.05);
        }
    `);

    /* 强制隔离并统一控件样式，避免继承站点样式 */
    GM_addStyle(`
        .cnb-issue-dialog input.cnb-control,
        .cnb-issue-dialog textarea.cnb-control {
            box-sizing: border-box !important;
            width: 100% !important;
            margin: 4px 0 !important;
            padding: 4px 10px !important;
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            background: #fff !important;
            color: #222 !important;
            font: normal 14px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Helvetica,Arial,"PingFang SC","Microsoft Yahei",sans-serif !important;
            outline: none !important;
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
        }
        .cnb-issue-dialog textarea.cnb-control {
            min-height: 300px !important;
            resize: vertical !important;
            font-family: 'Monaco','Menlo','Ubuntu Mono',monospace !important;
            font-size: 12px !important;
            line-height: 1.4 !important;
        }
        /* 仅底部操作按钮生效，避免影响设置区的小按钮与“×”
           不设置背景和颜色，让各自类（confirm/cancel）决定配色与 hover */
        .cnb-issue-dialog .cnb-issue-dialog-buttons > button {
            padding: 8px 16px !important;
            border: none !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            transition: background-color .15s ease, box-shadow .15s ease, transform .02s ease !important;
        }
        .cnb-issue-btn-confirm { background: #0366d6 !important; color: #fff !important; }
        .cnb-issue-btn-confirm:hover { background: #0256b9 !important; box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important; }
        .cnb-issue-btn-cancel { background: #6c757d !important; color: #fff !important; }
        .cnb-issue-btn-cancel:hover { background: #5a6268 !important; box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important; }
        /* 新增：创建完成Issue 按钮（绿色） */
        .cnb-issue-btn-done { background: #28a745 !important; color: #fff !important; }
        .cnb-issue-btn-done:hover { background: #218838 !important; box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important; }
        .cnb-issue-btn-confirm:active, .cnb-issue-btn-cancel:active, .cnb-issue-btn-done:active { transform: translateY(1px) scale(0.98) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important; }

        /* 标签选择按钮 */
        #cnb-issue-tags { margin-top: 6px !important; }
        .cnb-tag-btn {
            margin: 4px !important;
            padding: 4px 10px !important;
            border: 1px solid #ccc !important;
            border-radius: 16px !important;
            background: #f8f9fa !important;
            color: #222 !important;
            font-size: 13px !important;
            cursor: pointer !important;
        }
        .cnb-tag-btn.active {
            background: #0366d6 !important;
            border-color: #0256b9 !important;
            color: #fff !important;
        }

        /* 设置页：标签胶囊与删除按钮 */
        .cnb-tags-list { margin-top: 8px !important; }
        .cnb-tag-pill {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            margin: 4px !important;
            padding: 4px 10px !important;
            border: 1px solid #d0d7de !important;
            border-radius: 9999px !important;
            background: #fff !important;
            color: #24292f !important;
            font-size: 13px !important;
            line-height: 1.2 !important;
            white-space: nowrap !important;
            vertical-align: middle !important;
            box-shadow: 0 1px 0 rgba(27,31,36,0.04) !important;
            transition: background-color .15s ease, border-color .15s ease, box-shadow .15s ease !important;
            user-select: none !important;
        }
        .cnb-tag-delbtn {
            /* 与通用按钮样式彻底隔离，保持小矩形，仅比“×”略大 */
            margin-left: 4px !important;
            border: none !important;
            background: transparent !important;
            cursor: pointer !important;
            color: #666 !important;
            font-size: 14px !important;

            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;

            height: 20px !important;
            padding: 0 6px !important;
            line-height: 20px !important;
            border-radius: 4px !important;

            box-sizing: border-box !important;
            white-space: nowrap !important;
            min-width: 0 !important; /* 防止被通用按钮样式撑宽 */
        }
        .cnb-tag-pill:hover {
            background: #f6f8fa !important;
            border-color: #afb8c1 !important;
            box-shadow: 0 1px 0 rgba(27,31,36,0.06) !important;
        }
        .cnb-tag-delbtn:hover {
            color: #cf222e !important;
            background: #ffeef0 !important;
        }
        .cnb-tag-delbtn:active {
            background: #ffdce0 !important;
        }

        /* 设置页：输入与按钮排列 */
        .cnb-flex {
            display: flex !important;
            gap: 8px !important;
            align-items: center !important;
            flex-wrap: nowrap !important;          /* 一行展示，禁止换行 */
        }
        .cnb-tag-addbtn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            white-space: nowrap !important;

            height: 36px !important;          /* 与输入框等高 */
            padding: 0 12px !important;
            box-sizing: border-box !important;

            border-radius: 4px !important;
            border: none !important;
            background: #28a745 !important;
            color: #fff !important;
            cursor: pointer !important;
            font-size: 14px !important;

            flex: 0 0 auto !important;        /* 按钮不被压缩，不换行 */
            min-width: max-content !important; /* 宽度随文字自适应，避免“添加标/签” */
        }
        .cnb-tag-addbtn:hover { background: #218838 !important; }

        /* 让输入框可伸缩并等高 */
        .cnb-flex .cnb-control#cnb-setting-newtag {
            height: 36px !important;
            flex: 1 1 auto !important;
        }

        /* 提示文本 */
        .cnb-hint {
            color: #666 !important;
            font-size: 12px !important;
        }

        /* 开关样式（无文字，仅图形） */
        .cnb-switch {
            position: relative !important;
            display: inline-block !important;
            width: 42px !important;
            height: 22px !important;
            vertical-align: middle !important;
        }
        .cnb-switch input {
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
        }
        .cnb-switch-slider {
            position: absolute !important;
            inset: 0 !important;
            background: #c7ccd1 !important;
            border-radius: 9999px !important;
            transition: background-color .15s ease !important;
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06) !important;
            cursor: pointer !important;
        }
        .cnb-switch-slider::before {
            content: '' !important;
            position: absolute !important;
            left: 2px !important;
            top: 2px !important;
            width: 18px !important;
            height: 18px !important;
            background: #fff !important;
            border-radius: 50% !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
            transition: transform .15s ease !important;
        }
        .cnb-switch input:checked + .cnb-switch-slider {
            background: #28a745 !important;
        }
        .cnb-switch input:checked + .cnb-switch-slider::before {
            transform: translateX(20px) !important;
        }
    `);

    let isSelecting = false;
    let selectedElement = null;
    // 多选集合与最近一次选择的元素
    let selectedElements = new Set();
    let lastSelectedElement = null;

    // HTML转Markdown的转换器
    const htmlToMarkdown = {
        // 转换入口函数
        convert: function(html) {
            // 创建临时容器
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // 清理不需要的元素
            this.cleanUnwantedElements(tempDiv);

            // 递归转换
            return this.processNode(tempDiv).trim();
        },

        // 清理不需要的元素
        cleanUnwantedElements: function(element) {
            const unwantedSelectors = [
                'script', 'style', 'noscript', 'link', 'meta',
                // 广告相关（更安全的选择器，避免误伤 heading/markdown/header 等）
                '.ads', '.advertisement', '[class*="advert"]', '[id*="advert"]', '[id^="ad-"]', '[id^="ads-"]',
                // 隐藏元素
                '.hidden', '[style*="display:none"]', '[style*="display: none"]'
            ];

            unwantedSelectors.forEach(selector => {
                const elements = element.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });
        },

        // 处理节点
        processNode: function(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return this.escapeText(node.textContent || '');
            }

            if (node.nodeType !== Node.ELEMENT_NODE) {
                return '';
            }

            const tagName = node.tagName.toLowerCase();
            const children = Array.from(node.childNodes);
            const childrenContent = children.map(child => this.processNode(child)).join('');

            switch (tagName) {
                case 'h1':
                    return `# ${childrenContent}\n\n`;
                case 'h2':
                    return `## ${childrenContent}\n\n`;
                case 'h3':
                    return `### ${childrenContent}\n\n`;
                case 'h4':
                    return `#### ${childrenContent}\n\n`;
                case 'h5':
                    return `##### ${childrenContent}\n\n`;
                case 'h6':
                    return `###### ${childrenContent}\n\n`;
                case 'p':
                    return `${childrenContent}\n\n`;
                case 'br':
                    return '\n';
                case 'hr':
                    return '---\n\n';
                case 'strong':
                case 'b':
                    return `**${childrenContent}**`;
                case 'em':
                case 'i':
                    return `*${childrenContent}*`;
                case 'code':
                    if (node.parentElement.tagName.toLowerCase() === 'pre') {
                        return childrenContent;
                    }
                    return `\`${childrenContent}\``;
                case 'pre':
                    const language = node.querySelector('code')?.className?.replace('language-', '') || '';
                    const raw = node.textContent || '';
                    return `\`\`\`${language}\n${raw}\n\`\`\`\n\n`;
                case 'a':
                    const href = node.getAttribute('href') || '';
                    // 提取可见文本（去掉空白）
                    const visibleText = (childrenContent || '').replace(/\s+/g, '');
                    // 规则：
                    // 1) 如果 href 为空：仅返回子内容（可能有内嵌 strong/img 等）
                    // 2) 如果 href 以 '#' 开头且无可见文本（通常是锚点图标/空链接）：丢弃该链接，仅返回子内容，避免生成 [](#...)
                    // 3) 其他情况：按 [text](href) 输出。
                    if (!href) {
                        return childrenContent;
                    }
                    if (href.startsWith('#') && visibleText.length === 0) {
                        return '';
                    }
                    return `[${childrenContent}](${href})`;
                case 'img':
                    const src = node.getAttribute('src') || '';
                    const alt = node.getAttribute('alt') || '';
                    return `![${alt}](${src})`;
                case 'ul':
                    return `${childrenContent}\n`;
                case 'ol':
                    return `${childrenContent}\n`;
                case 'li':
                    const parentTag = node.parentElement.tagName.toLowerCase();
                    if (parentTag === 'ol') {
                        const index = Array.from(node.parentElement.children).indexOf(node) + 1;
                        return `${index}. ${childrenContent}\n`;
                    } else {
                        return `- ${childrenContent}\n`;
                    }
                case 'blockquote':
                    return `> ${childrenContent.split('\n').join('\n> ')}\n\n`;
                case 'table':
                    const rows = node.querySelectorAll('tr');
                    let tableContent = '';

                    // 表头
                    const headerCells = rows[0]?.querySelectorAll('th, td') || [];
                    if (headerCells.length > 0) {
                        tableContent += '| ' + Array.from(headerCells).map(cell => this.processNode(cell).replace(/\n/g, ' ').trim()).join(' | ') + ' |\n';
                        tableContent += '| ' + Array.from(headerCells).map(() => '---').join(' | ') + ' |\n';
                    }

                    // 数据行
                    for (let i = 1; i < rows.length; i++) {
                        const cells = rows[i].querySelectorAll('td');
                        if (cells.length > 0) {
                            tableContent += '| ' + Array.from(cells).map(cell => this.processNode(cell).replace(/\n/g, ' ').trim()).join(' | ') + ' |\n';
                        }
                    }

                    return tableContent + '\n';
                case 'div':
                case 'section':
                case 'article':
                case 'main':
                case 'header':
                case 'footer':
                case 'nav':
                case 'aside':
                    // 当容器中含有标题元素时，确保子内容以换行分隔，避免标题不在行首而无法识别
                    try {
                        const hasHeading = typeof node.querySelector === 'function' && node.querySelector('h1, h2, h3, h4, h5, h6');
                        if (hasHeading) {
                            const joined = children.map(child => this.processNode(child)).join('\n');
                            return `\n${joined}\n`;
                        }
                    } catch (_) {}
                    return `${childrenContent}\n`;
                default:
                    return childrenContent;
            }
        },

        // 转义文本
        escapeText: function(text) {
            return text
                .replace(/\*/g, '\\*')
                .replace(/_/g, '\\_')
                .replace(/`/g, '\\`')
                .replace(/\[/g, '\\[')
                .replace(/\]/g, '\\]')
                .replace(/\(/g, '\\(')
                .replace(/\)/g, '\\)')
                .replace(/#/g, '\\#')
                .replace(/\+/g, '\\+')
                .replace(/-/g, '\\-')
                .replace(/!/g, '\\!')
                .replace(/\|/g, '\\|')
                .replace(/\n\s*\n/g, '\n\n')
                .replace(/[ \t]+/g, ' ')
                .trim();
        }
    };

    // 热键工具：规范化与匹配
    function normalizeHotkeyString(s) {
        if (!s) return '';
        return s.split('+').map(p => p.trim()).filter(Boolean).map(p => {
            const up = p.toLowerCase();
            if (up === 'ctrl') return 'Control';
            if (up === 'control') return 'Control';
            if (up === 'meta' || up === 'cmd' || up === 'command') return 'Meta';
            if (up === 'alt' || up === 'option') return 'Alt';
            if (up === 'shift') return 'Shift';
            if (up.length === 1) return up.toUpperCase();
            // 常见功能键统一首字母大写
            return p[0].toUpperCase() + p.slice(1);
        }).join('+');
    }
    function toDisplayHotkeyString(s) {
        if (!s) return '';
        return s.replace(/\bControl\b/g, 'Ctrl');
    }
    function eventToHotkeyString(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('Control');
        if (e.shiftKey) parts.push('Shift');
        if (e.altKey) parts.push('Alt');
        if (e.metaKey) parts.push('Meta');
        let key = e.key;
        if (!key) return parts.join('+');
        // 忽略纯修饰键
        if (['Control','Shift','Alt','Meta'].includes(key)) key = '';
        // 统一字母为大写，功能键保持名称
        if (key && key.length === 1) key = key.toUpperCase();
        if (key === ' ') key = 'Space';
        if (key === 'Esc') key = 'Escape';
        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
            // 保持不变
        }
        return parts.concat(key ? [key] : []).join('+');
    }
    function matchesHotkey(e, hotkeyStr) {
        const want = normalizeHotkeyString(hotkeyStr);
        const got = eventToHotkeyString(e);
        return want && got === want;
    }
    function isEditableTarget(el) {
        if (!el) return false;
        const tag = el.tagName ? el.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
        if (el.isContentEditable) return true;
        return false;
    }
    function globalHotkeyHandler(e) {
        // 避免在输入编辑时触发；对话框/遮罩存在时也不触发
        if (!HOTKEY_ENABLED) return;
        if (isEditableTarget(e.target)) return;
        if (document.querySelector('.cnb-issue-dialog') || document.querySelector('.cnb-issue-overlay')) return;
        if (!isSelecting && matchesHotkey(e, START_HOTKEY)) {
            e.preventDefault();
            startAreaSelection();
        }
    }

    // 创建左侧 Dock（去除拖动，仅点击）
    function createFloatingButton() {
        const dock = document.createElement('div');
        dock.className = 'cnb-dock';
        dock.title = '悬停展开，移开隐藏';

        const btnSelect = document.createElement('button');
        btnSelect.className = 'cnb-dock-btn';
        btnSelect.textContent = '选择';
        btnSelect.addEventListener('click', (e) => {
            e.preventDefault();
            startAreaSelection();
        });

        const btnSettings = document.createElement('button');
        btnSettings.className = 'cnb-dock-btn';
        btnSettings.textContent = '设置';
        btnSettings.addEventListener('click', (e) => {
            e.preventDefault();
            openSettingsDialog();
        });

        dock.appendChild(btnSelect);
        dock.appendChild(btnSettings);
        const btnList = document.createElement('button');
        btnList.className = 'cnb-dock-btn';
        btnList.textContent = '列表';
        btnList.addEventListener('click', (e) => {
            e.preventDefault();
            openIssueList();
        });
        dock.appendChild(btnList);

        // 剪贴板（根据设置的“剪贴板位置”是否为空来决定是否显示）
        let __cnbClipCfg = '';
        try { if (typeof GM_getValue === 'function') { const v = GM_getValue('cnbClipboardIssue', ''); __cnbClipCfg = String(v || '').trim(); } } catch (_) {}
        if (__cnbClipCfg) {
            const btnClipboard = document.createElement('button');
            btnClipboard.id = 'cnb-btn-clipboard';
            btnClipboard.className = 'cnb-dock-btn';
            btnClipboard.textContent = '剪贴板';
            btnClipboard.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof openClipboardWindow === 'function') {
                    openClipboardWindow();
                }
            });
            dock.appendChild(btnClipboard);
        }

        document.body.appendChild(dock);



        return dock;
    }

    // 开始区域选择模式
    function startAreaSelection() {
        if (isSelecting) return;

        isSelecting = true;
        document.body.classList.add('cnb-selection-mode');

        // 创建提示工具条
        const tooltip = document.createElement('div');
        tooltip.className = 'cnb-selection-tooltip';
        tooltip.innerHTML = `
            请点击选择页面区域 (将转换为Markdown格式)
            <button id="cnb-confirm-selection">确认选择</button>
            <button id="cnb-cancel-selection">取消</button>
        `;
        tooltip.id = 'cnb-selection-tooltip';
        document.body.appendChild(tooltip);

        // 添加事件监听
        const confirmBtn = tooltip.querySelector('#cnb-confirm-selection');
        const cancelBtn = tooltip.querySelector('#cnb-cancel-selection');

        confirmBtn.addEventListener('click', () => {
            if (selectedElements && selectedElements.size > 0) {
                showIssueDialog(Array.from(selectedElements));
            } else {
                GM_notification({
                    text: '请先选择区域（支持 Ctrl+点击多选）',
                    title: 'CNB Issue工具',
                    timeout: 3000
                });
            }
        });

        cancelBtn.addEventListener('click', stopAreaSelection);

        // 添加鼠标移动和点击事件
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('click', handleElementClick);

        // ESC键取消选择
        document.addEventListener('keydown', handleKeyDown);
    }

    // 停止区域选择模式
    function stopAreaSelection() {
        isSelecting = false;
        document.body.classList.remove('cnb-selection-mode');

        // 移除提示工具条
        const tooltip = document.getElementById('cnb-selection-tooltip');
        if (tooltip) {
            document.body.removeChild(tooltip);
        }

        // 移除样式（包含已选与悬停高亮）
        if (selectedElement) {
            selectedElement.classList.remove('cnb-selection-selected');
        }
        const toClear = document.querySelectorAll('.cnb-selection-hover, .cnb-selection-selected');
        toClear.forEach(el => {
            el.classList.remove('cnb-selection-hover');
            el.classList.remove('cnb-selection-selected');
        });
        selectedElements = new Set();
        lastSelectedElement = null;
        selectedElement = null;

        // 移除事件监听
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('click', handleElementClick);
        document.removeEventListener('keydown', handleKeyDown);
    }

    // 处理鼠标悬停
    function handleMouseOver(e) {
        if (!isSelecting) return;

        const element = e.target;
        if (!selectedElements.has(element) && !element.closest('.cnb-dock')) {
            // 移除之前的高亮
            const previousHighlight = document.querySelector('.cnb-selection-hover');
            if (previousHighlight) {
                previousHighlight.classList.remove('cnb-selection-hover');
            }

            // 高亮当前元素
            element.classList.add('cnb-selection-hover');
        }
    }

    // 处理鼠标移出
    function handleMouseOut(e) {
        if (!isSelecting) return;

        const element = e.target;
        if (!selectedElements.has(element) && element.classList.contains('cnb-selection-hover')) {
            element.classList.remove('cnb-selection-hover');
        }
    }

    // 处理元素点击
    function handleElementClick(e) {
        if (!isSelecting) return;

        e.preventDefault();
        e.stopPropagation();

        const element = e.target;

        // Ctrl 多选：切换该元素选中状态；否则保持单选
        if (e.ctrlKey === true) {
            element.classList.remove('cnb-selection-hover');
            if (selectedElements.has(element)) {
                element.classList.remove('cnb-selection-selected');
                selectedElements.delete(element);
            } else {
                element.classList.add('cnb-selection-selected');
                selectedElements.add(element);
                lastSelectedElement = element;
            }
        } else {
            selectedElements.forEach(el => el.classList.remove('cnb-selection-selected'));
            selectedElements.clear();
            selectedElement = element;
            selectedElement.classList.remove('cnb-selection-hover');
            selectedElement.classList.add('cnb-selection-selected');
            selectedElements.add(selectedElement);
            lastSelectedElement = selectedElement;
        }

        // 更新提示信息
        const tooltip = document.getElementById('cnb-selection-tooltip');
        if (tooltip) {
            const tagName = element.tagName.toLowerCase();
            const className = element.className ? ` class="${element.className.split(' ')[0]}"` : '';
            tooltip.innerHTML = `
                已选择: &lt;${tagName}${className}&gt; (将转换为Markdown)
                <button id="cnb-confirm-selection">确认选择</button>
                <button id="cnb-cancel-selection">取消</button>
            `;

            // 重新绑定事件
            const confirmBtn = tooltip.querySelector('#cnb-confirm-selection');
            const cancelBtn = tooltip.querySelector('#cnb-cancel-selection');

            confirmBtn.addEventListener('click', () => {
                if (selectedElements && selectedElements.size > 0) {
                    showIssueDialog(Array.from(selectedElements));
                } else if (typeof GM_notification === 'function') {
                    GM_notification({
                        text: '请先选择区域（支持 Ctrl+点击多选）',
                        title: 'CNB Issue工具',
                        timeout: 3000
                    });
                }
            });

            cancelBtn.addEventListener('click', stopAreaSelection);
        }
    }

    // 处理按键
    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            stopAreaSelection();
        } else if (e.key === 'Enter' || e.key === 'NumpadEnter') {
            if (isSelecting && selectedElements && selectedElements.size > 0) {
                e.preventDefault();
                showIssueDialog(Array.from(selectedElements));
            }
        }
    }

    // 显示创建Issue的对话框
    function showIssueDialog(selected) {
        stopAreaSelection(); // 先退出选择模式

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'cnb-issue-overlay';

        // 创建对话框
        const dialog = document.createElement('div');
        dialog.className = 'cnb-issue-dialog';

        // 强化筛选容器为 flex 并固定 5px 间距（避免被站点样式覆盖）
        GM_addStyle(`
            .cnb-issue-dialog .cnb-issue-filter {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 5px !important;
            }
        `);

        // 强化筛选标签按钮样式（避免被站点样式覆盖，统一为胶囊风格）
        GM_addStyle(`
            .cnb-issue-dialog .cnb-issue-filter { display:flex !important; flex-wrap:wrap !important; gap:5px !important; }
            .cnb-issue-dialog .cnb-issue-filter .cnb-issue-filter-btn {
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
                padding: 4px 10px !important;
                border: 1px solid #d0d7de !important;
                border-radius: 9999px !important;
                background: #fff !important;
                color: #24292f !important;
                font-size: 13px !important;
                line-height: 1.2 !important;
                white-space: nowrap !important;
                vertical-align: middle !important;
                box-shadow: 0 1px 0 rgba(27,31,36,0.04) !important;
                transition: background-color .15s ease, border-color .15s ease, box-shadow .15s ease, transform .02s ease !important;
                cursor: pointer !important;
                user-select: none !important;
            }
            .cnb-issue-dialog .cnb-issue-filter .cnb-issue-filter-btn:hover {
                background: #f6f8fa !important;
                border-color: #afb8c1 !important;
                box-shadow: 0 1px 0 rgba(27,31,36,0.06) !important;
            }
            .cnb-issue-dialog .cnb-issue-filter .cnb-issue-filter-btn.active {
                background: #0366d6 !important;
                border-color: #0256b9 !important;
                color: #fff !important;
                box-shadow: 0 1px 0 rgba(27,31,36,0.05) !important;
            }
            .cnb-issue-dialog .cnb-issue-filter .cnb-issue-filter-btn.pressed {
                transform: translateY(1px) scale(0.98) !important;
                box-shadow: 0 1px 0 rgba(27,31,36,0.08) !important;
            }
        `);

        // 获取选择的内容并转换为Markdown（支持多选）
        const elements = Array.isArray(selected) ? selected : (selected ? [selected] : []);
        const parts = elements.map(el => (getSelectedContentAsMarkdown(el) || '').trim()).filter(Boolean);
        const joined = parts.join(`

---


`);
        const selectedContent = (parts.length > 1 ? `
` : '') + joined;
        const pageTitle = document.title;
        const pageUrl = window.location.href;

        dialog.innerHTML = `
            <h3>创建 CNB Issue (Markdown格式)</h3>
            <div>
                <label>标题:</label>
                <input class="cnb-control" type="text" id="cnb-issue-title" value="${escapeHtml(pageTitle)}" placeholder="输入Issue标题">
            </div>
            <div>
                <label>Markdown内容:</label>
                <textarea class="cnb-control" id="cnb-issue-content" placeholder="Markdown内容将自动生成">## 出处
**URL:** ${escapeHtml(pageUrl)}
**选择时间:** ${new Date().toLocaleString()}

${escapeHtml(selectedContent)}</textarea>
            </div>
            <div>
                <label>标签:</label>
                <div id="cnb-issue-tags"></div>
            </div>
            <div class="cnb-issue-dialog-buttons">
                <button class="cnb-issue-btn-cancel">取消</button>
                <button class="cnb-issue-btn-done">创建完成Issue</button>
                <button class="cnb-issue-btn-confirm">创建Issue</button>
            </div>
        `;

        // 添加事件监听
        // 渲染标签为可选按钮
        const tagsContainer = dialog.querySelector('#cnb-issue-tags');
        let selectedTags = [];
        if (tagsContainer) {
            tagsContainer.innerHTML = '';
            const tags = Array.isArray(SAVED_TAGS) ? SAVED_TAGS : [];
            if (tags.length === 0) {
                const hint = document.createElement('div');
                hint.className = 'cnb-hint';
                hint.textContent = '在设置中添加标签后可在此选择';
                tagsContainer.appendChild(hint);
            } else {
                tags.forEach(tag => {
                    const btnTag = document.createElement('button');
                    btnTag.type = 'button';
                    btnTag.className = 'cnb-tag-btn';
                    btnTag.textContent = tag;
                    btnTag.addEventListener('click', () => {
                        const idx = selectedTags.indexOf(tag);
                        if (idx >= 0) {
                            selectedTags.splice(idx, 1);
                            btnTag.classList.remove('active');
                        } else {
                            selectedTags.push(tag);
                            btnTag.classList.add('active');
                        }
                    });
                    tagsContainer.appendChild(btnTag);
                });
            }
        }
        const cancelBtn = dialog.querySelector('.cnb-issue-btn-cancel');
        const confirmBtn = dialog.querySelector('.cnb-issue-btn-confirm');
        const doneBtn = dialog.querySelector('.cnb-issue-btn-done');

        const closeDialog = () => {
            if (document.body.contains(overlay)) document.body.removeChild(overlay);
            if (document.body.contains(dialog)) document.body.removeChild(dialog);
        };

        overlay.addEventListener('click', closeDialog);
        cancelBtn.addEventListener('click', closeDialog);

        confirmBtn.addEventListener('click', () => {
            const title = dialog.querySelector('#cnb-issue-title').value;
            const content = dialog.querySelector('#cnb-issue-content').value;

            const labels = Array.isArray(selectedTags) ? selectedTags.slice() : [];

            // 禁用按钮并显示加载状态
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<div class="cnb-issue-loading"></div>创建中...';

            createIssue(title, content, labels, (success) => {
                if (success) {
                    closeDialog();
                } else {
                    // 重新启用按钮
                    confirmBtn.disabled = false;
                    confirmBtn.innerHTML = '创建Issue';
                }
            });
        });

        if (doneBtn) {
            doneBtn.addEventListener('click', () => {
                const title = dialog.querySelector('#cnb-issue-title').value;
                const content = dialog.querySelector('#cnb-issue-content').value;
                const labels = Array.isArray(selectedTags) ? selectedTags.slice() : [];

                doneBtn.disabled = true;
                confirmBtn.disabled = true;
                doneBtn.innerHTML = '<div class="cnb-issue-loading"></div>创建并完成中...';

                createIssue(title, content, labels, (success, issueId) => {
                    if (success && issueId != null) {
                        closeIssue(issueId, 'completed', (ok) => {
                            if (!ok) {
                                doneBtn.disabled = false;
                                confirmBtn.disabled = false;
                                doneBtn.innerHTML = '创建完成Issue';
                                return;
                            }
                            if (typeof GM_notification === 'function') {
                                GM_notification({
                                    text: 'Issue已标记为已完成（closed: completed）',
                                    title: 'CNB Issue工具',
                                    timeout: 3000
                                });
                            }
                            if (document.body.contains(overlay)) document.body.removeChild(overlay);
                            if (document.body.contains(dialog)) document.body.removeChild(dialog);
                        });
                    } else {
                        doneBtn.disabled = false;
                        confirmBtn.disabled = false;
                        doneBtn.innerHTML = '创建完成Issue';
                    }
                });
            });
        }

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        // 自动聚焦到标题输入框
        dialog.querySelector('#cnb-issue-title').focus();
        dialog.querySelector('#cnb-issue-title').select();
    }

    // 获取选择区域的内容并转换为Markdown
    function getSelectedContentAsMarkdown(element) {
        if (!element) return '';

        try {
            // 获取元素的HTML内容
            const htmlContent = element.innerHTML;

            // 转换为Markdown
            const markdownContent = htmlToMarkdown.convert(htmlContent);

            // 清理和格式化
            return cleanMarkdownContent(markdownContent);
        } catch (error) {
            console.error('转换Markdown失败:', error);
            // 如果转换失败，回退到纯文本
            return element.textContent || element.innerText || '';
        }
    }

    // 清理Markdown内容
    function cleanMarkdownContent(markdown) {
        return markdown
            // 删除表情图片（以 ![:grimacing:] 格式）
            .replace(/!\[:[^\]]+\]\([^)]+\)/g, '')
            // 将复杂图片链接格式转换为纯图片格式
            .replace(/\[!\[([^\]]*)\]\(([^)]+)\)[^\]]*\]\([^)]+\)/g, '![$1]($2)')
            .replace(/\n{3,}/g, '\n\n') // 多个空行合并为两个

            .replace(/^\s+|\s+$/g, ''); // 去除首尾空白
    }

    // 轻量 Markdown 转 HTML（基础语法）
    function markdownToHtml(md) {
        if (!md) return '';
        let placeholders = [];
        // 保护代码块 ```lang\n...\n```
        md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, function(_, lang, code) {
            const idx = placeholders.length;
            const esc = (s)=>String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>');
            placeholders.push(`<pre><code class="language-${lang||''}">${esc(code)}</code></pre>`);
            return `\u0000BLOCK${idx}\u0000`;
        });
        // 保护行内代码 `code`
        md = md.replace(/`([^`\n]+)`/g, function(_, code){
            const idx = placeholders.length;
            const esc = (s)=>String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>');
            placeholders.push(`<code>${esc(code)}</code>`);
            return `\u0000INLINE${idx}\u0000`;
        });
        // 先整体转义，避免 HTML 注入
        md = md.replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>');
        // 图片与链接
        md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
        md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        // 粗体/斜体
        md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        md = md.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        // 标题
        md = md.replace(/^(#{6})\s+(.+)$/gm, '<h6>$2</h6>')
               .replace(/^(#{5})\s+(.+)$/gm, '<h5>$2</h5>')
               .replace(/^(#{4})\s+(.+)$/gm, '<h4>$2</h4>')
               .replace(/^(#{3})\s+(.+)$/gm, '<h3>$2</h3>')
               .replace(/^(#{2})\s+(.+)$/gm, '<h2>$2</h2>')
               .replace(/^(#{1})\s+(.+)$/gm, '<h1>$2</h1>');
        // 水平线
        md = md.replace(/^\s*[-*_]{3,}\s*$/gm, '<hr>');
        // 引用
        md = md.replace(/^(?:>\s?(.*))$/gm, '<blockquote><p>$1</p></blockquote>');
        // 列表（连续项聚合）
        md = md.replace(/(?:^(?:\s*-\s+.+)\n?)+/gm, function(block){
            const items = block.trim().split(/\n/).map(l => l.replace(/^\s*-\s+/, '').trim());
            return '<ul>' + items.map(i=>`<li>${i}</li>`).join('') + '</ul>';
        });
        md = md.replace(/(?:^(?:\s*\d+\.\s+.+)\n?)+/gm, function(block){
            const items = block.trim().split(/\n/).map(l => l.replace(/^\s*\d+\.\s+/, '').trim());
            return '<ol>' + items.map(i=>`<li>${i}</li>`).join('') + '</ol>';
        });
        // 段落：双换行分段，避免已是块级元素再次包裹
        const blocks = md.split(/\n{2,}/).map(seg=>{
            if (/^\s*<(h\d|ul|ol|li|pre|blockquote|hr)/i.test(seg)) return seg;
            return '<p>' + seg.replace(/\n/g, '<br>') + '</p>';
        });
        let html = blocks.join('\n');
        // 还原占位
        html = html.replace(/\u0000(INLINE|BLOCK)(\d+)\u0000/g, (_, type, i) => placeholders[Number(i)] || '');
        return html;
    }

    // HTML转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 设置弹窗
    function openSettingsDialog() {
        // 单例：若已存在，先移除旧实例
        try {
            if (__CNB_SETTINGS_OVERLAY && __CNB_SETTINGS_OVERLAY.parentNode) __CNB_SETTINGS_OVERLAY.remove();
            if (__CNB_SETTINGS_DIALOG && __CNB_SETTINGS_DIALOG.parentNode) __CNB_SETTINGS_DIALOG.remove();
        } catch (_) {}
        const overlay = document.createElement('div');
        overlay.className = 'cnb-issue-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'cnb-issue-dialog';
        __CNB_SETTINGS_OVERLAY = overlay;
        __CNB_SETTINGS_DIALOG = dialog;

        const currentRepo = CONFIG.repoPath || '';
        const currentToken = CONFIG.accessToken || '';
        const currentHotkey = START_HOTKEY || '';
        const currentHotkeyEnabled = !!HOTKEY_ENABLED;
        let currentClipIssue = '';
        try {
            if (typeof GM_getValue === 'function') {
                const v = GM_getValue('cnbClipboardIssue', '');
                currentClipIssue = (v == null) ? '' : String(v);
            }
        } catch (_) {}

        dialog.innerHTML = `
            <h3>CNB 设置</h3>
            <div>
                <label>仓库路径 (owner/repo):</label>
                <input class="cnb-control" type="text" id="cnb-setting-repo" placeholder="例如: IIIStudio/Demo" value="${escapeHtml(currentRepo)}">
            </div>
            <div>
                <label>访问令牌 (accessToken):</label>
                <input class="cnb-control" type="password" id="cnb-setting-token" placeholder="输入访问令牌" value="${escapeHtml(currentToken)}">
            </div>
            <div>
                <label>剪贴板位置（Issue编号）:</label>
                <input class="cnb-control" type="text" id="cnb-setting-clip-issue" placeholder="例如: 25（留空则隐藏剪贴板按钮）" value="${escapeHtml(currentClipIssue)}">
            </div>
            <div>
                <div class="cnb-flex" style="justify-content: space-between;">
                    <label>快捷键（开启选择模式）:</label>
                    <label class="cnb-switch" for="cnb-setting-hotkey-enabled" title="启用快捷键">
                        <input type="checkbox" id="cnb-setting-hotkey-enabled" ${currentHotkeyEnabled ? 'checked' : ''}>
                        <span class="cnb-switch-slider"></span>
                    </label>
                </div>
                <div class="cnb-flex">
                    <input class="cnb-control" type="text" id="cnb-setting-hotkey" placeholder="例如: Ctrl+Shift+Y" value="${escapeHtml(toDisplayHotkeyString(currentHotkey))}">
                </div>
            </div>
            <div>
                <label>标签管理:</label>
                <div class="cnb-flex">
                    <input class="cnb-control" type="text" id="cnb-setting-newtag" placeholder="输入新标签名称">
                    <button class="cnb-tag-addbtn" id="cnb-setting-addtag" type="button">添加标签</button>
                </div>
                <div id="cnb-setting-tags-list" class="cnb-tags-list"></div>
            </div>
            <div class="cnb-issue-dialog-buttons">
                <button class="cnb-issue-btn-cancel">取消</button>
                <button class="cnb-issue-btn-confirm">保存</button>
            </div>
        `;

        // 渲染与管理标签
        const tagsList = dialog.querySelector('#cnb-setting-tags-list');
        const newTagInput = dialog.querySelector('#cnb-setting-newtag');
        const addTagBtn = dialog.querySelector('#cnb-setting-addtag');
        const hotkeyInput = dialog.querySelector('#cnb-setting-hotkey');
        const hotkeyEnabledInput = dialog.querySelector('#cnb-setting-hotkey-enabled');
        if (hotkeyEnabledInput) {
            hotkeyEnabledInput.addEventListener('change', () => {
                HOTKEY_ENABLED = !!hotkeyEnabledInput.checked;
                if (typeof GM_setValue === 'function') GM_setValue('cnbHotkeyEnabled', HOTKEY_ENABLED);
            });
        }
        // 录制快捷键：在输入框中按组合键即生成规范字符串
        if (hotkeyInput) {
            hotkeyInput.addEventListener('keydown', (e) => {
                e.preventDefault();
                const str = eventToHotkeyString(e);
                hotkeyInput.value = toDisplayHotkeyString(normalizeHotkeyString(str));
            });
        }
        // 回车键添加标签
        newTagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTagBtn.click();
            }
        });

        function renderTagsList() {
            tagsList.innerHTML = '';
            const tags = Array.isArray(SAVED_TAGS) ? SAVED_TAGS : [];
            if (tags.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'cnb-hint';
                empty.textContent = '暂无标签';
                tagsList.appendChild(empty);
                return;
            }
            tags.forEach((tag, idx) => {
                const item = document.createElement('span');
                item.textContent = tag;
                item.className = 'cnb-tag-pill';

                const del = document.createElement('button');
                del.type = 'button';
                del.textContent = '×';
                del.title = '删除';
                del.className = 'cnb-tag-delbtn';
                del.addEventListener('click', () => {
                    SAVED_TAGS.splice(idx, 1);
                    if (typeof GM_setValue === 'function') GM_setValue('cnbTags', SAVED_TAGS);
                    renderTagsList();
                });

                item.appendChild(del);
                tagsList.appendChild(item);
            });
        }

        renderTagsList();

        addTagBtn.addEventListener('click', () => {
            const t = (newTagInput.value || '').trim();
            if (!t) return;
            if (!Array.isArray(SAVED_TAGS)) SAVED_TAGS = [];
            if (!SAVED_TAGS.includes(t)) {
                SAVED_TAGS.push(t);
                if (typeof GM_setValue === 'function') GM_setValue('cnbTags', SAVED_TAGS);
                renderTagsList();
                newTagInput.value = '';
                if (typeof GM_notification === 'function') {
                    GM_notification({ text: '标签已添加', title: 'CNB Issue工具', timeout: 1500 });
                }
            }
        });

        const close = () => {
            if (document.body.contains(overlay)) document.body.removeChild(overlay);
            if (document.body.contains(dialog)) document.body.removeChild(dialog);
            __CNB_SETTINGS_OVERLAY = null;
            __CNB_SETTINGS_DIALOG = null;
        };

        dialog.querySelector('.cnb-issue-btn-cancel').addEventListener('click', close);
        overlay.addEventListener('click', close);
        dialog.querySelector('.cnb-issue-btn-confirm').addEventListener('click', () => {
            const repo = dialog.querySelector('#cnb-setting-repo').value.trim();
            const token = dialog.querySelector('#cnb-setting-token').value.trim();
            const hotkey = (dialog.querySelector('#cnb-setting-hotkey')?.value || '').trim();
            const hotkeyEnabled = !!(dialog.querySelector('#cnb-setting-hotkey-enabled')?.checked);
            if (repo) {
                CONFIG.repoPath = repo;
                if (typeof GM_setValue === 'function') GM_setValue('repoPath', repo);
            }
            if (token) {
                CONFIG.accessToken = token;
                if (typeof GM_setValue === 'function') GM_setValue('accessToken', token);
            }
            if (hotkey) {
                START_HOTKEY = normalizeHotkeyString(hotkey);
                if (typeof GM_setValue === 'function') GM_setValue('cnbHotkey', START_HOTKEY);
            }
            HOTKEY_ENABLED = hotkeyEnabled;
            if (typeof GM_setValue === 'function') GM_setValue('cnbHotkeyEnabled', HOTKEY_ENABLED);
            // 保存剪贴板位置（允许留空，留空则隐藏剪贴板按钮）
            try {
                const clipIssue = (dialog.querySelector('#cnb-setting-clip-issue')?.value || '').trim();
                if (typeof GM_setValue === 'function') GM_setValue('cnbClipboardIssue', clipIssue);
                // 即时生效：根据是否有值来动态增删“剪贴板”按钮
                const dock = document.querySelector('.cnb-dock');
                if (dock) {
                    let btn = dock.querySelector('#cnb-btn-clipboard');
                    if (clipIssue) {
                        if (!btn) {
                            const btnClipboard = document.createElement('button');
                            btnClipboard.id = 'cnb-btn-clipboard';
                            btnClipboard.className = 'cnb-dock-btn';
                            btnClipboard.textContent = '剪贴板';
                            btnClipboard.addEventListener('click', (e) => {
                                e.preventDefault();
                                if (typeof openClipboardWindow === 'function') {
                                    openClipboardWindow();
                                }
                            });
                            dock.appendChild(btnClipboard);
                        }
                    } else {
                        if (btn) btn.remove();
                    }
                }
            } catch (_) {}
            if (typeof GM_notification === 'function') {
                GM_notification({
                    text: '设置已保存',
                    title: 'CNB Issue工具',
                    timeout: 2000
                });
            }
            close();
        });

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // Issue 列表弹窗
    function openIssueList() {
        // 单例：若已存在，先移除旧实例
        try {
            if (__CNB_ISSUE_OVERLAY && __CNB_ISSUE_OVERLAY.parentNode) __CNB_ISSUE_OVERLAY.remove();
            if (__CNB_ISSUE_DIALOG && __CNB_ISSUE_DIALOG.parentNode) __CNB_ISSUE_DIALOG.remove();
        } catch (_) {}
        if (!CONFIG.repoPath || !CONFIG.accessToken) {
            if (typeof GM_notification === 'function') {
                GM_notification({ text: '请先在设置中配置仓库路径与访问令牌', title: 'CNB Issue工具', timeout: 3000 });
            }
            if (typeof openSettingsDialog === 'function') openSettingsDialog();
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'cnb-issue-overlay';
        __CNB_ISSUE_OVERLAY = overlay;

        const dialog = document.createElement('div');
        dialog.className = 'cnb-issue-dialog';
        __CNB_ISSUE_DIALOG = dialog;

        dialog.innerHTML = `
            <button class="cnb-dialog-close" title="关闭" style="position:absolute; right:12px; top:12px; border:none; background:transparent; color:#666; font-size:18px; line-height:1; cursor:pointer;">×</button>
            <h3>Issue 列表</h3>
            <div class="cnb-hint" style="margin-bottom:8px;">显示 state=closed 的最近 100 条</div>
            <div id="cnb-issue-filter" class="cnb-issue-filter" style="margin:8px 0;"></div>
            <div id="cnb-issue-list" style="height:60vh; overflow:auto; border:1px solid #e5e7eb; border-radius:6px;"></div>
        `;

        // 固定对话框尺寸，防止点击筛选按钮时窗口抖动
        dialog.style.width = '840px';
        dialog.style.maxWidth = '840px';

        // 补充：筛选按钮按压态样式
        GM_addStyle(`
            .cnb-issue-filter-btn.pressed {
                transform: translateY(1px) scale(0.98);
                box-shadow: 0 1px 0 rgba(27,31,36,0.08);
            }
            .cnb-issue-filter-btn {
                transition: background-color .15s ease, border-color .15s ease, box-shadow .15s ease, transform .02s ease;
            }
        `);

        const listEl = dialog.querySelector('#cnb-issue-list');
        const closeBtn = dialog.querySelector('.cnb-dialog-close');

        // 行内标签（Issue 列表中的 labels）胶囊样式
        GM_addStyle(`
            .cnb-issue-chip {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 2px 8px;
                border: 1px solid #d0d7de;
                border-radius: 9999px;
                background: #fff;
                color: #24292f;
                font-size: 12px;
                line-height: 1.2;
                white-space: nowrap;
                vertical-align: middle;
                box-shadow: 0 1px 0 rgba(27,31,36,0.04);
                transition: background-color .15s ease, border-color .15s ease, box-shadow .15s ease, transform .02s ease;
                user-select: none;
            }
            .cnb-issue-chip:hover {
                background: #f6f8fa;
                border-color: #afb8c1;
                box-shadow: 0 1px 0 rgba(27,31,36,0.06);
            }
        `);
        const close = () => {
            if (document.body.contains(overlay)) document.body.removeChild(overlay);
            if (document.body.contains(dialog)) document.body.removeChild(dialog);
            document.removeEventListener('keydown', onEsc, true);
            __CNB_ISSUE_OVERLAY = null;
            __CNB_ISSUE_DIALOG = null;
        };
        overlay.addEventListener('click', close);
        if (closeBtn) closeBtn.addEventListener('click', close);

        // ESC 关闭
        const onEsc = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
            }
        };
        document.addEventListener('keydown', onEsc, true);

        // 初始加载中
        listEl.innerHTML = `<div style="padding:12px;color:#666;">加载中...</div>`;

        const url = `${CONFIG.apiBase}/${CONFIG.repoPath}${CONFIG.issueEndpoint}?page=1&page_size=100&state=closed`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: url.replace(/&/g, '&'),
            headers: {
                'accept': 'application/json',
                'Authorization': `${CONFIG.accessToken}`
            },
            responseType: 'json',
            onload: function(res) {
                try {
                    const data = typeof res.response === 'object' && res.response !== null
                        ? res.response
                        : JSON.parse(res.responseText || '[]');
                    const items = Array.isArray(data) ? data : (Array.isArray(data.items) ? data.items : []);
                    if (!items.length) {
                        listEl.innerHTML = `<div style="padding:12px;color:#666;">暂无数据</div>`;
                        return;
                    }
                    // 渲染 + 筛选
                    const allItems = Array.isArray(items) ? items : [];
                    const filterEl = dialog.querySelector('#cnb-issue-filter');
                    // 行内样式强制为 flex 并设置 5px 间距，避免被站点覆盖
                    if (filterEl) {
                        const s = filterEl.style;
                        s.setProperty('display', 'flex', 'important');
                        s.setProperty('flex-wrap', 'wrap', 'important');
                        s.setProperty('gap', '5px', 'important');
                    }

                    function render(filterLabel) {
                        const frag = document.createDocumentFragment();
                        const filtered = !filterLabel ? allItems : allItems.filter(it => {
                            const names = Array.isArray(it.labels) ? it.labels.map(l => l.name) : [];
                            return names.includes(filterLabel);
                        });

                        filtered.forEach(it => {
                            const number = it.number ?? it.id ?? it.iid ?? '';
                            const title = it.title ?? '';
                            const createdAt = it.created_at ?? '';
                            const labelNames = Array.isArray(it.labels) ? it.labels.map(l => l.name) : [];

                            const row = document.createElement('div');
                            row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #eef2f6;';

                            const left = document.createElement('div');
                            left.style.cssText = 'min-width:0;flex:1;font-size:14px;color:#24292f;display:flex;gap:5px !important;align-items:center;';

                            const prefix = document.createElement('span');
                            prefix.textContent = `#${number}`;

                            const a = document.createElement('a');
                            a.href = `https://cnb.cool/${CONFIG.repoPath}/-/issues/${number}`;
                            a.target = '_blank';
                            a.rel = 'noopener noreferrer';
                            const fullTitle = String(title || '');
                            const truncated = fullTitle.length > 40 ? fullTitle.slice(0, 40) + '…' : fullTitle;
                            a.textContent = truncated;
                            a.title = fullTitle;
                            a.style.cssText = 'color:#0969da;text-decoration:none;word-break:break-all;';
                            a.addEventListener('mouseover', () => a.style.textDecoration = 'underline');
                            a.addEventListener('mouseout', () => a.style.textDecoration = 'none');

                            left.appendChild(prefix);
                            left.appendChild(a);

                            // 复制按钮：关闭 Issue(完成) 并复制 title + body(清理为Markdown) 到剪贴板
                            const btnCopy = document.createElement('button');
                            btnCopy.type = 'button';
                            btnCopy.textContent = '📋';
                            btnCopy.title = '复制到剪贴板';
                            btnCopy.style.cssText = 'margin-left:6px;display:inline-flex;align-items:center;justify-content:center;padding:0;border:none;background:transparent;color:#57606a;font-size:12px;cursor:pointer;line-height:1;';
                            btnCopy.addEventListener('mouseover', () => btnCopy.style.opacity = '0.75');
                            btnCopy.addEventListener('mouseout', () => btnCopy.style.opacity = '1');
                            btnCopy.addEventListener('click', () => {
                                if (btnCopy.disabled) return;
                                btnCopy.disabled = true;
                                const oldText = btnCopy.textContent;
                                btnCopy.textContent = '…';
                                const urlPatch = `${CONFIG.apiBase}/${CONFIG.repoPath}${CONFIG.issueEndpoint}/${number}`;
                                GM_xmlhttpRequest({
                                    method: 'PATCH',
                                    url: urlPatch,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `${CONFIG.accessToken}`,
                                        'Accept': 'application/json'
                                    },
                                    data: JSON.stringify({ state: 'closed', state_reason: 'completed' }),
                                    responseType: 'json',
                                    onload: function(res) {
                                        try {
                                            if (res.status >= 200 && res.status < 300) {
                                                let obj = null;
                                                try {
                                                    obj = (typeof res.response === 'object' && res.response !== null)
                                                        ? res.response
                                                        : JSON.parse(res.responseText || '{}');
                                                } catch(_) {}
                                                const t = (obj && obj.title) ? obj.title : title;
                                                const b = (obj && typeof obj.body === 'string') ? obj.body : '';
                                                const md = cleanMarkdownContent(String(b || ''));
                                                if (typeof GM_setClipboard === 'function') {
                                                    GM_setClipboard(`${t}

${md}`, 'text');
                                                }
                                                if (typeof GM_notification === 'function') {
                                                    GM_notification({ text: '已关闭并复制到剪贴板', title: 'CNB Issue工具', timeout: 3000 });
                                                }
                                            } else {
                                                if (typeof GM_notification === 'function') {
                                                    GM_notification({ text: '操作失败: HTTP ' + res.status, title: 'CNB Issue工具', timeout: 5000 });
                                                }
                                            }
                                        } finally {
                                            btnCopy.disabled = false;
                                            btnCopy.textContent = oldText;
                                        }
                                    },
                                    onerror: function() {
                                        if (typeof GM_notification === 'function') {
                                            GM_notification({ text: '网络请求失败', title: 'CNB Issue工具', timeout: 5000 });
                                        }
                                        btnCopy.disabled = false;
                                        btnCopy.textContent = oldText;
                                    }
                                });
                            });
                            left.appendChild(btnCopy);

                            const right = document.createElement('div');
                            right.style.cssText = 'flex:0 0 auto;color:#57606a;font-size:12px;text-align:right;display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end;';

                            // 标签胶囊容器
                            const labelsWrap = document.createElement('div');
                            labelsWrap.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;';

                            const labelObjs = Array.isArray(it.labels) ? it.labels : [];
                            labelObjs.forEach(l => {
                                const chip = document.createElement('span');
                                chip.className = 'cnb-issue-chip';
                                chip.textContent = l?.name ?? '';
                                // 若有颜色，应用为背景，并适当设置边框与前景色
                                const color = (l && typeof l.color === 'string' && l.color) ? l.color : '';
                                if (color) {
                                    chip.style.background = color;
                                    // 根据背景亮度调整文字与边框（简单阈值）
                                    try {
                                        const hex = color.replace('#','');
                                        const r = parseInt(hex.substring(0,2),16);
                                        const g = parseInt(hex.substring(2,4),16);
                                        const b = parseInt(hex.substring(4,6),16);
                                        const lum = 0.2126*r + 0.7152*g + 0.0722*b;
                                        chip.style.color = lum < 140 ? '#fff' : '#24292f';
                                        chip.style.borderColor = lum < 140 ? 'rgba(255,255,255,0.35)' : '#d0d7de';
                                    } catch(_) {}
                                }
                                labelsWrap.appendChild(chip);
                            });

                            const dateSpan = document.createElement('span');
                            dateSpan.textContent = createdAt;
                            dateSpan.style.cssText = 'color:#57606a;';

                            right.appendChild(labelsWrap);
                            right.appendChild(dateSpan);

                            row.appendChild(left);
                            row.appendChild(right);
                            frag.appendChild(row);
                        });

                        listEl.innerHTML = '';
                        listEl.appendChild(frag);
                    }

                    // 渲染筛选按钮
                    if (filterEl) {
                        filterEl.innerHTML = '';
                        const allBtn = document.createElement('button');
                        allBtn.className = 'cnb-issue-filter-btn active';
                        allBtn.textContent = '全部';
                        applyFilterButtonStyles(allBtn);
                        applyFilterButtonActive(allBtn);
                        addPressEffect(allBtn);
                        allBtn.addEventListener('click', () => {
                            setActive(allBtn);
                            render(null);
                        });
                        filterEl.appendChild(allBtn);

                        const tagList = Array.isArray(SAVED_TAGS) ? SAVED_TAGS : [];
                        tagList.forEach(tag => {
                            const b = document.createElement('button');
                            b.className = 'cnb-issue-filter-btn';
                            b.textContent = tag;
                            applyFilterButtonStyles(b);
                            addPressEffect(b);
                            b.addEventListener('click', () => {
                                setActive(b);
                                render(tag);
                            });
                            filterEl.appendChild(b);
                        });

                        function setActive(btn) {
                            const buttons = filterEl.querySelectorAll('button');
                            buttons.forEach(x => {
                                x.classList.remove('active');
                                applyFilterButtonDefault(x);
                            });
                            btn.classList.add('active');
                            applyFilterButtonActive(btn);
                        }

                        // 行内样式（带 !important）确保胶囊风格不被站点覆盖
                        function applyFilterButtonStyles(btn) {
                            const s = btn.style;
                            s.setProperty('display', 'inline-flex', 'important');
                            s.setProperty('align-items', 'center', 'important');
                            s.setProperty('gap', '6px', 'important');
                            s.setProperty('padding', '4px 10px', 'important');
                            s.setProperty('border', '1px solid #d0d7de', 'important');
                            s.setProperty('border-radius', '9999px', 'important');
                            s.setProperty('background', '#fff', 'important');
                            s.setProperty('color', '#24292f', 'important');
                            s.setProperty('font-size', '13px', 'important');
                            s.setProperty('line-height', '1.2', 'important');
                            s.setProperty('white-space', 'nowrap', 'important');
                            s.setProperty('vertical-align', 'middle', 'important');
                            s.setProperty('box-shadow', '0 1px 0 rgba(27,31,36,0.04)', 'important');
                            s.setProperty('transition', 'background-color .15s ease, border-color .15s ease, box-shadow .15s ease, transform .02s ease', 'important');
                            s.setProperty('cursor', 'pointer', 'important');
                            s.setProperty('user-select', 'none', 'important');
                            // 关键：移除按钮自身外边距，确保由容器 gap 控制间距
                            s.setProperty('margin', '0', 'important');
                        }
                        function applyFilterButtonDefault(btn) {
                            const s = btn.style;
                            s.setProperty('background', '#fff', 'important');
                            s.setProperty('border-color', '#d0d7de', 'important');
                            s.setProperty('color', '#24292f', 'important');
                            s.setProperty('box-shadow', '0 1px 0 rgba(27,31,36,0.04)', 'important');
                        }
                        function applyFilterButtonActive(btn) {
                            const s = btn.style;
                            s.setProperty('background', '#0366d6', 'important');
                            s.setProperty('border-color', '#0256b9', 'important');
                            s.setProperty('color', '#fff', 'important');
                            s.setProperty('box-shadow', '0 1px 0 rgba(27,31,36,0.05)', 'important');
                        }

                        // 为筛选按钮添加按压反馈
                        function addPressEffect(btn) {
                            btn.addEventListener('mousedown', () => btn.classList.add('pressed'));
                            btn.addEventListener('mouseup', () => btn.classList.remove('pressed'));
                            btn.addEventListener('mouseleave', () => btn.classList.remove('pressed'));
                            btn.addEventListener('touchstart', () => btn.classList.add('pressed'), { passive: true });
                            btn.addEventListener('touchend', () => btn.classList.remove('pressed'));
                            btn.addEventListener('touchcancel', () => btn.classList.remove('pressed'));
                            btn.addEventListener('blur', () => btn.classList.remove('pressed'));
                        }
                    }

                    // 初次渲染全部
                    render(null);
                } catch (e) {
                    listEl.innerHTML = `<div style="padding:12px;color:#d32f2f;">解析失败</div>`;
                }
            },
            onerror: function() {
                listEl.innerHTML = `<div style="padding:12px;color:#d32f2f;">网络请求失败</div>`;
            }
        });

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // 剪贴板弹窗（独立样式），展示 Issue #25
    function openClipboardWindow() {
        // 单例：若已存在旧窗口，先移除
        try { if (__CNB_CLIP_DIALOG && __CNB_CLIP_DIALOG.parentNode) __CNB_CLIP_DIALOG.remove(); } catch (_) {}
        try {
            // 注入独立样式（不复用 .cnb-issue-dialog），无遮罩，默认居中，可拖动
            addStyleOnce('clipwin-base', `
                .cnb-clipwin {
                    position: fixed;
                    left: 50%; top: 50%;
                    transform: translate(-50%, -50%);
                    width: min(320px, 92vw);
                    max-height: 80vh;
                    display: flex; flex-direction: column;
                    background: #ffffff;
                    border: 1px solid #d0d7de;
                    border-radius: 12px;
                    box-shadow: 0 12px 32px rgba(0,0,0,0.18);
                    z-index: 10010;
                    overflow: hidden;
                    font: 14px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Helvetica,Arial,"PingFang SC","Microsoft Yahei",sans-serif;
                    color: #24292f;
                }
                .cnb-clipwin-header {
                    position: relative;
                    height: 30px;
                    border-bottom: 1px solid #eaeef2;
                    background: linear-gradient(180deg, #fbfdff, #f6f8fa);
                    cursor: move; /* 拖动条 */
                }
                .cnb-clipwin-close {
                    position: absolute;
                    right: 40px; top: 3px;
                    border: none; background: transparent;
                    color: #57606a; font-size: 18px; line-height: 1;
                    cursor: pointer;
                }
                .cnb-clipwin-pin {
                    position: absolute;
                    right: 6px; top: 6px;
                    border: none; background: transparent;
                    color: #57606a; line-height: 1;
                    cursor: pointer;
                    padding: 2px;
                }
                /* 左上角标题 */
                .cnb-clipwin-title {
                    position: absolute;
                    left: 8px; top: 8px;
                    border: none; background: transparent;
                    color: #24292f; line-height: 1; font-size: 12.5px; font-weight: 600;
                    pointer-events: none;
                }
                .cnb-clipwin-close:hover, .cnb-clipwin-pin:hover { color: #24292f; }
                .menuBar-Btn_Icon-pin.isActive { fill: #0366d6; }
                .cnb-clipwin-content {
                    padding: 8px 12px;
                    overflow: auto;
                    flex: 1 1 auto;
                }
                .cnb-clipwin-body {
                    margin: 0;
                    padding: 10px;
                    background: #f6f8fa;
                    border: 1px solid #d0d7de;
                    border-radius: 8px;
                    white-space: pre-wrap;
                    word-break: break-word;
                    font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
                    font-size: 12px;
                    max-height: 60vh;
                    overflow: auto;
                }
                .cnb-clipwin-actions {
                    border-top: 1px solid #eaeef2;
                    padding: 10px 16px;
                    display: flex; gap: 8px; justify-content: flex-end;
                    background: #fff;
                }
                .cnb-clipwin-btn {
                    display: inline-flex; align-items: center; justify-content: center;
                    height: 32px; padding: 0 12px; border-radius: 8px;
                    border: 1px solid #d0d7de; background: #f6f8fa; color: #24292f;
                    cursor: pointer; transition: background-color .15s ease, box-shadow .15s ease, transform .02s ease;
                }
                .cnb-clipwin-btn:hover { background: #eef2f6; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
                .cnb-clipwin-btn:active { transform: translateY(1px); box-shadow: 0 1px 3px rgba(0,0,0,0.18); }
            `);
        } catch (_) {}

        // 覆盖剪贴板窗口内容样式，适配 HTML 渲染
        try {
            addStyleOnce('clipwin-body', `
                .cnb-clipwin-body {
                    margin: 0;
                    padding: 12px;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    word-break: break-word;
                    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Helvetica,Arial,"PingFang SC","Microsoft Yahei",sans-serif;
                    font-size: 13px;
                    line-height: 1.55;
                    color: #24292f;
                    max-height: 65vh;
                    overflow: auto;
                }
                .cnb-clipwin-body h1 { font-size: 1.75em; margin: .4em 0; }
                .cnb-clipwin-body h2 { font-size: 1.5em; margin: .6em 0 .4em; }
                .cnb-clipwin-body h3 { font-size: 1.25em; margin: .6em 0 .4em; }
                .cnb-clipwin-body p  { margin: .4em 0; }
                .cnb-clipwin-body ul, .cnb-clipwin-body ol { padding-left: 1.5em; margin: .4em 0; }
                .cnb-clipwin-body blockquote {
                    margin: .6em 0; padding: .4em .8em; color:#57606a; background:#f6f8fa; border-left: 4px solid #d0d7de; border-radius: 4px;
                }
                .cnb-clipwin-body hr { border: none; border-top: 1px solid #e5e7eb; margin: .8em 0; }
                .cnb-clipwin-body code {
                    background: #f6f8fa; border: 1px solid #e5e7eb; border-radius: 4px; padding: .1em .35em; font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace; font-size: .92em;
                }
                .cnb-clipwin-body pre {
                    background: #0b1021; color: #e6edf3; border-radius: 8px; padding: 8px 0px 8px 8px; overflow-x: hidden; overflow-y: auto;
                }
                .cnb-clipwin-body pre code { background: transparent; border: none; padding: 0; color: inherit; font-size: .92em; white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere; }
                .cnb-clipwin-body a { color: #0969da; text-decoration: none; }
                .cnb-clipwin-body a:hover { text-decoration: underline; }
            `);
        } catch (_) {}
        /* 剪贴板窗口滚动条样式：细黑条（仅作用于剪贴板窗口） */
        try {
            GM_addStyle(`
                /* Firefox */
                .cnb-clipwin, .cnb-clipwin-content, .cnb-clipwin-body, .cnb-clipwin-body pre {
                    scrollbar-width: thin;
                    scrollbar-color: #000 transparent;
                }
                /* WebKit */
                .cnb-clipwin::-webkit-scrollbar,
                .cnb-clipwin-content::-webkit-scrollbar,
                .cnb-clipwin-body::-webkit-scrollbar,
                .cnb-clipwin-body pre::-webkit-scrollbar {
                    width: 3px;
                    height: 3px;
                }
                .cnb-clipwin::-webkit-scrollbar-track,
                .cnb-clipwin-content::-webkit-scrollbar-track,
                .cnb-clipwin-body::-webkit-scrollbar-track,
                .cnb-clipwin-body pre::-webkit-scrollbar-track {
                    background: transparent;
                }
                .cnb-clipwin::-webkit-scrollbar-thumb,
                .cnb-clipwin-content::-webkit-scrollbar-thumb,
                .cnb-clipwin-body::-webkit-scrollbar-thumb,
                .cnb-clipwin-body pre::-webkit-scrollbar-thumb {
                    background: #000000;
                    border-radius: 2px;
                }
                .cnb-clipwin::-webkit-scrollbar-thumb:hover,
                .cnb-clipwin-content::-webkit-scrollbar-thumb:hover,
                .cnb-clipwin-body::-webkit-scrollbar-thumb:hover,
                .cnb-clipwin-body pre::-webkit-scrollbar-thumb:hover {
                    background: #000000;
                }
            `);
        } catch (_) {}

        if (!CONFIG.repoPath || !CONFIG.accessToken) {
            if (typeof GM_notification === 'function') {
                GM_notification({ text: '请先在设置中配置仓库路径与访问令牌', title: 'CNB Issue工具', timeout: 3000 });
            }
            if (typeof openSettingsDialog === 'function') openSettingsDialog();
            return;
        }

        // 仅创建窗口（无遮罩）
        const dialog = document.createElement('div');
        dialog.className = 'cnb-clipwin';
        __CNB_CLIP_DIALOG = dialog;
        dialog.innerHTML = `
            <div class="cnb-clipwin-header">
                <div class="cnb-clipwin-title">剪贴板</div>
                <button class="cnb-clipwin-pin" title="固定/取消固定">
                    <svg class="menuBar-Btn_Icon" width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53.011 53.011">
                        <path class="menuBar-Btn_Icon-pin" d="M52.963 21.297c-.068-.33-.297-.603-.61-.727-8.573-3.416-16.172-.665-18.36.288L19.113 8.2C19.634 3.632 17.17.508 17.06.372c-.18-.22-.442-.356-.725-.372-.282-.006-.56.09-.76.292L.32 15.546c-.202.2-.308.48-.29.765.015.285.152.55.375.727 2.775 2.202 6.35 2.167 7.726 2.055l12.722 14.953c-.868 2.23-3.52 10.27-.307 18.337.124.313.397.54.727.61.067.013.135.02.202.02.263 0 .518-.104.707-.293l14.57-14.57 13.57 13.57c.196.194.452.292.708.292s.512-.098.707-.293c.39-.392.39-1.024 0-1.415l-13.57-13.57 14.527-14.528c.237-.238.34-.58.27-.91zm-17.65 15.458L21.89 50.18c-2.437-8.005.993-15.827 1.03-15.91.158-.352.1-.764-.15-1.058L9.31 17.39c-.19-.225-.473-.352-.764-.352-.05 0-.103.004-.154.013-.036.007-3.173.473-5.794-.954l13.5-13.5c.604 1.156 1.39 3.26.964 5.848-.058。346。07。697。338。924l15.785 13.43c.31。262。748。31 1.105。128。077-.04 7.378-3.695 15.87-1.017L35.313 36.754z"></path>
                    </svg>
                </button>
            </div>
            <div class="cnb-clipwin-content">
                <pre id="cnb-clipwin-body" class="cnb-clipwin-body">加载中…</pre>
            </div>

        `;

        let pinned = false;

        function cleanup() {
            document.removeEventListener('mousedown', onDocDown, true);
            document.removeEventListener('mouseup', onDocUp, true);
            document.removeEventListener('mousemove', onDocMove, true);
            document.removeEventListener('click', onOutsideClick, true);
        }
        function close() {
            cleanup();
            try { dialog.remove(); } catch (_) {}
            try { if (__CNB_CLIP_DIALOG === dialog) __CNB_CLIP_DIALOG = null; } catch (_) {}
        }

        const btnPin = dialog.querySelector('.cnb-clipwin-pin');
        if (btnPin) btnPin.addEventListener('click', () => {
            pinned = !pinned;
            const path = btnPin.querySelector('.menuBar-Btn_Icon-pin');
            if (path) {
                if (pinned) path.classList.add('isActive');
                else path.classList.remove('isActive');
            }
        });
        // 复制按钮：复制窗口内容（优先原始 Markdown）
        const btnCopy = dialog.querySelector('.cnb-clipwin-copy');
        if (btnCopy) btnCopy.addEventListener('click', async () => {
            try {
                const body = dialog.querySelector('#cnb-clipwin-body');
                const text = (body && body.dataset && body.dataset.mdraw) ? body.dataset.mdraw : (body ? body.textContent : '');
                if (typeof GM_setClipboard === 'function') {
                    GM_setClipboard(String(text || ''), 'text');
                } else if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(String(text || ''));
                }
                if (typeof GM_notification === 'function') {
                    GM_notification({ text: '已复制到剪贴板', title: 'CNB 剪贴板', timeout: 2000 });
                }
            } catch (_) {}
        });

        // 点击窗口外关闭（未固定时）
        function onOutsideClick(e) {
            if (pinned) return;
            if (!dialog.contains(e.target)) close();
        }
        document.addEventListener('click', onOutsideClick, true);

        // 拖动逻辑（拖拽 header）
        const header = dialog.querySelector('.cnb-clipwin-header');
        let dragging = false;
        let startX = 0, startY = 0, boxX = 0, boxY = 0;

        function onDocDown(e) {
            if (header && header.contains(e.target)) {
                dragging = true;
                const rect = dialog.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                boxX = rect.left;
                boxY = rect.top;
                // 拖动时改为绝对定位并去掉居中 transform
                dialog.style.left = rect.left + 'px';
                dialog.style.top = rect.top + 'px';
                dialog.style.transform = 'none';
            }
        }
        function onDocUp() {
            dragging = false;
        }
        function onDocMove(e) {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            dialog.style.left = (boxX + dx) + 'px';
            dialog.style.top = (boxY + dy) + 'px';
        }
        document.addEventListener('mousedown', onDocDown, true);
        document.addEventListener('mouseup', onDocUp, true);
        document.addEventListener('mousemove', onDocMove, true);

        document.body.appendChild(dialog);

        const bodyEl = dialog.querySelector('#cnb-clipwin-body');

        // 读取剪贴板位置（Issue编号）
        let __clipIssueNum = '';
        try {
            if (typeof GM_getValue === 'function') {
                const v = GM_getValue('cnbClipboardIssue', '');
                __clipIssueNum = String(v || '').trim();
            }
        } catch (_) {}
        if (!__clipIssueNum) {
            if (bodyEl) bodyEl.textContent = '未配置剪贴板位置';
            return;
        }
        const url = `${CONFIG.apiBase}/${CONFIG.repoPath}${CONFIG.issueEndpoint}/${encodeURIComponent(__clipIssueNum)}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: {
                'Accept': 'application/json',
                'Authorization': `${CONFIG.accessToken}`
            },
            responseType: 'json',
            onload: function(res) {
                try {
                    if (res.status >= 200 && res.status < 300) {
                        let data = null;
                        try {
                            data = (typeof res.response === 'object' && res.response !== null)
                                ? res.response
                                : JSON.parse(res.responseText || '{}');
                        } catch (_) {}

                        const rawBody = typeof data?.body === 'string' ? data.body : '';
                        const md = typeof cleanMarkdownContent === 'function'
                            ? cleanMarkdownContent(String(rawBody || ''))
                            : String(rawBody || '');
                        if (bodyEl) {
                            bodyEl.dataset.mdraw = md;
                            bodyEl.innerHTML = (typeof markdownToHtml === 'function') ? markdownToHtml(md) : md;
                            // 移除所有 <br>，避免用换行标签作为分隔
                            try { bodyEl.querySelectorAll('br').forEach(br => br.remove()); } catch (_) {}
                            // 设置标题文本（优先 Issue 标题）
                            const titleEl = dialog.querySelector('.cnb-clipwin-title');
                            const t = (data && typeof data.title === 'string' && data.title) ? data.title : '剪贴板';
                            if (titleEl) titleEl.textContent = t;
                            // 为每个代码块注入右上角复制按钮，并设置布局
                            const pres = bodyEl.querySelectorAll('pre');
                            pres.forEach(pre => {
                                try {
                                    pre.style.marginTop = '5px';
                                    pre.style.marginBottom = '5px';
                                    pre.style.position = 'relative';
                                    if (!pre.style.paddingRight) pre.style.paddingRight = '36px';
                                    if (!pre.querySelector('.cnb-codecopy-inline')) {
                                        // 确保右上角控制容器（同一父容器，便于排列“展开”与“复制”）
                                        let controls = pre.querySelector('.cnb-code-controls');
                                        if (!controls) {
                                            controls = document.createElement('div');
                                            controls.className = 'cnb-code-controls';
                                            pre.appendChild(controls);
                                        }
                                        const btn = document.createElement('button');
                                        btn.className = 'cnb-codecopy-inline';
                                        btn.type = 'button';
                                        btn.title = '复制代码';
                                        btn.setAttribute('aria-label', '复制代码');
                                        // 样式由 .cnb-code-controls 统一提供
                                        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
                                        btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(255,255,255,0.18)'; btn.style.opacity = '0.95'; });
                                        btn.addEventListener('mouseleave', () => { btn.style.background = 'rgba(255,255,255,0.10)'; btn.style.opacity = ''; });
                                        btn.addEventListener('click', async (e) => {
                                            e.stopPropagation();
                                            const codeEl = pre.querySelector('code');
                                            const text = codeEl ? codeEl.textContent : pre.textContent;
                                            try {
                                                if (typeof GM_setClipboard === 'function') {
                                                    GM_setClipboard(String(text || ''), 'text');
                                                } else if (navigator.clipboard && navigator.clipboard.writeText) {
                                                    await navigator.clipboard.writeText(String(text || ''));
                                                }
                                                if (typeof GM_notification === 'function') {
                                                    GM_notification({ text: '代码已复制', title: 'CNB 剪贴板', timeout: 1500 });
                                                }
                                                // 点击反馈动画：对勾+变色+轻微放大，随后恢复
                                                try {
                                                    const prevHTML = btn.innerHTML;
                                                    const prevBg = btn.style.background;
                                                    const prevTransform = btn.style.transform;
                                                    // 增强过渡，加入缩放动画
                                                    const prevTransition = btn.style.transition;
                                                    btn.style.transition = prevTransition ? (prevTransition + ', transform .12s ease') : 'transform .12s ease, background-color .15s ease, opacity .15s ease';
                                                    // 切换对勾图标与高亮
                                                    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20.3 7.7l-1.4-1.4z"/></svg>';
                                                    btn.style.background = 'rgba(46,160,67,0.35)'; // 绿色反馈
                                                    btn.style.transform = 'scale(1.08)';
                                                    setTimeout(() => {
                                                        btn.style.transform = prevTransform || '';
                                                        btn.style.background = prevBg || 'rgba(255,255,255,0.10)';
                                                        btn.innerHTML = prevHTML;
                                                        // 恢复原 transition（若有）
                                                        if (prevTransition !== undefined) btn.style.transition = prevTransition;
                                                    }, 700);
                                                } catch (_) {}
                                            } catch (_) {}
                                        });
                                        controls.appendChild(btn);
                                    }
                                } catch (_) {}
                            });
                        }
                        // 行为增强：为每个代码块提供“两行预览 + 展开/收起”，复制仍复制全文
                        try {
                          if (typeof GM_addStyle === 'function') {
                            addStyleOnce('clipwin-pre-controls', `
                              .cnb-pre-collapsed {
                                max-height: 3.2em; /* 约两行 */
                                overflow: hidden;
                                position: relative;
                              }
                              .cnb-pre-collapsed::after {
                                content: '';
                                position: absolute;
                                left: 0; right: 0; bottom: 0;
                                height: 28px;
                                background: linear-gradient(to bottom, rgba(11,16,33,0), rgba(11,16,33,0.85));
                                pointer-events: none;
                              }
                              /* 顶部右侧控制容器：右为复制，左为展开 */
                              .cnb-code-controls {
                                position: absolute;
                                top: 4px;
                                right: 6px;
                                display: inline-flex;
                                align-items: center;
                                gap: 6px;
                              }
                              .cnb-code-controls .cnb-codecopy-inline,
                              .cnb-code-controls .cnb-code-toggle {
                                border: none;
                                background: rgba(255,255,255,0.10);
                                color: #e6edf3;
                                padding: 4px 6px;
                                border-radius: 6px;
                                cursor: pointer;
                                line-height: 1;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 12px;
                              }
                              .cnb-code-controls .cnb-codecopy-inline:hover,
                              .cnb-code-controls .cnb-code-toggle:hover {
                                background: rgba(255,255,255,0.18);
                              }
                            `);
                          }
                        } catch (_) {}
                        try {
                          const pres2 = bodyEl ? bodyEl.querySelectorAll('pre') : [];
                          pres2.forEach(pre => {
                            try {
                              const codeEl = pre.querySelector('code') || pre;
                              const text = codeEl ? (codeEl.textContent || '') : (pre.textContent || '');
                              const lines = String(text || '').split('\n');
                              if (lines.length <= 2) return;
                              // 初始折叠为两行
                              pre.classList.add('cnb-pre-collapsed');
                              // 若不存在展开按钮则添加
                              /* 将展开按钮插入到右上角控制容器中，位于复制按钮左侧 */
                              // 确保控制容器存在
                              let __controls = pre.querySelector('.cnb-code-controls');
                              if (!__controls) {
                                __controls = document.createElement('div');
                                __controls.className = 'cnb-code-controls';
                                pre.appendChild(__controls);
                              }
                              if (!pre.querySelector('.cnb-code-toggle')) {
                                const tbtn = document.createElement('button');
                                tbtn.type = 'button';
                                tbtn.className = 'cnb-code-toggle';
                                tbtn.textContent = '展开';
                                tbtn.title = '展开/收起';
                                tbtn.addEventListener('click', (e) => {
                                  e.stopPropagation();
                                  const collapsed = pre.classList.toggle('cnb-pre-collapsed');
                                  tbtn.textContent = collapsed ? '展开' : '收起';
                                });
                                const copyBtn = __controls.querySelector('.cnb-codecopy-inline');
                                if (copyBtn) __controls.insertBefore(tbtn, copyBtn);
                                else __controls.appendChild(tbtn);
                              }
                            } catch (_) {}
                          });
                        } catch (_) {}

                        // 基于 h2 构建章节按键并切换显示
                        try {
                          const contentDiv = dialog.querySelector('.cnb-clipwin-content');
                          if (contentDiv && bodyEl) {
                            const h2s = Array.from(bodyEl.querySelectorAll('h2'));
                            if (h2s.length) {
                              const sections = [];
                              for (let i = 0; i < h2s.length; i++) {
                                const h = h2s[i];
                                const sec = document.createElement('div');
                                sec.className = 'cnb-sec';
                                // 将 h2 及其之后内容（直到下一个 h2）打包进 section
                                h.parentNode.insertBefore(sec, h);
                                sec.appendChild(h);
                                let next = sec.nextSibling;
                                while (next && !(next.nodeType === 1 && next.tagName && next.tagName.toLowerCase() === 'h2')) {
                                  const move = next;
                                  next = next.nextSibling;
                                  sec.appendChild(move);
                                }
                                sections.push(sec);
                              }
                              // 在正文之前插入 tabs 容器（注入样式）
                              try {
                                if (typeof GM_addStyle === 'function') {
                                  GM_addStyle(`
                                    .cnb-clipwin-tabs {
                                      display: flex;
                                      flex-wrap: wrap;
                                      gap: 6px;
                                      margin: 6px 0 8px;
                                    }
                                    .cnb-tab {
                                      appearance: none;
                                      border: 1px solid #d0d7de;
                                      border-radius: 9999px;
                                      padding: 4px 10px;
                                      background: #fff;
                                      color: #24292f;
                                      cursor: pointer;
                                      font-size: 12px;
                                      line-height: 1.2;
                                      transition: background-color .15s ease, color .15s ease, border-color .15s ease, box-shadow .15s ease;
                                    }
                                    .cnb-tab:hover {
                                      background: #f6f8fa;
                                      border-color: #b9c2cc;
                                    }
                                    .cnb-tab.active {
                                      background: #0366d6;
                                      color: #fff;
                                      border-color: #0256b9;
                                      box-shadow: 0 1px 2px rgba(2, 86, 185, .15);
                                    }
                                    .cnb-tab:focus {
                                      outline: none;
                                      box-shadow: 0 0 0 2px rgba(3,102,214,.25);
                                    }
                                  `);
                                }
                              } catch (_) {}
                              let tabs = contentDiv.querySelector('.cnb-clipwin-tabs');
                              if (!tabs) {
                                tabs = document.createElement('div');
                                tabs.className = 'cnb-clipwin-tabs';
                                contentDiv.insertBefore(tabs, bodyEl);
                              } else {
                                tabs.innerHTML = '';
                              }
                              h2s.forEach((h, idx) => {
                                const btn = document.createElement('button');
                                btn.type = 'button';
                                btn.textContent = (h.textContent || '').trim() || ('Section ' + (idx + 1));
                                btn.className = 'cnb-tab';
                                btn.addEventListener('click', () => {
                                  sections.forEach((s, j) => { s.style.display = (j === idx) ? '' : 'none'; });
                                  Array.from(tabs.children).forEach((b, i) => {
                                    b.classList.toggle('active', i === idx);
                                  });
                                });
                                tabs.appendChild(btn);
                              });
                              // 默认激活第一个
                              if (tabs.firstElementChild) tabs.firstElementChild.click();
                            }
                          }
                        } catch (_) {}
                        // 渲染后隐藏 h2，并收紧 pre 间距与清理多余换行
                        try {
                            if (bodyEl) {
                                // 隐藏所有 h2，去除占位
                                bodyEl.querySelectorAll('h2').forEach(h => {
                                    h.style.display = 'none';
                                    h.style.margin = '0';
                                    h.style.padding = '0';
                                });
                                // 移除所有 <br> 与空段落，避免形成额外间隙
                                bodyEl.querySelectorAll('br').forEach(br => br.remove());
                                bodyEl.querySelectorAll('p').forEach(p => {
                                    const txt = (p.textContent || '').trim();
                                    const onlyBr = p.children.length === 1 && p.firstElementChild && p.firstElementChild.tagName.toLowerCase() === 'br';
                                    if (!txt || onlyBr) p.remove();
                                });
                                // 统一设置代码块上下间距与内边距
                                bodyEl.querySelectorAll('pre').forEach(pre => {
                                    pre.style.marginTop = '-17.5px';
                                    pre.style.marginBottom = '2.5px';
                                    pre.style.paddingTop = '6px';
                                    pre.style.paddingBottom = '6px';
                                });
                                // 额外收紧：取消段落与分段容器的默认间距
                                bodyEl.querySelectorAll('p').forEach(p => {
                                    p.style.marginTop = '0';
                                    p.style.marginBottom = '0';
                                });
                                bodyEl.querySelectorAll('.cnb-sec').forEach(sec => {
                                    sec.style.margin = '0';
                                    sec.style.padding = '0';
                                });
                            }
                        } catch (_) {}
                    } else {
                        if (bodyEl) bodyEl.textContent = `加载失败: HTTP ${res.status}`;
                    }
                } catch (_) {
                    if (bodyEl) bodyEl.textContent = '解析失败';
                }
            },
            onerror: function() {
                if (bodyEl) bodyEl.textContent = '网络请求失败，请稍后重试';
            }
        });
    }

    // 创建Issue
    function createIssue(title, content, labels = [], callback) {
        if (!CONFIG.repoPath || !CONFIG.accessToken) {
            if (typeof GM_notification === 'function') {
                GM_notification({ text: '请先在设置中配置仓库路径与访问令牌', title: 'CNB Issue工具', timeout: 3000 });
            }
            if (typeof openSettingsDialog === 'function') openSettingsDialog();
            if (typeof callback === 'function') callback(false);
            return;
        }
        const issueData = {
            repoId: CONFIG.repoPath,
            title: title,
            body: content,
            labels: labels,
            assignees: []
        };

        const apiUrl = `${CONFIG.apiBase}/${CONFIG.repoPath}${CONFIG.issueEndpoint}`;



        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${CONFIG.accessToken}`,
                'Accept': 'application/json'
            },
            data: JSON.stringify(issueData),
            responseType: 'json',
            onload: function(response) {
                if (response.status === 200 || response.status === 201) {
                    // 解析返回，取 issueId（兼容不同字段）
                    let respObj = null;
                    try {
                        respObj = typeof response.response === 'object' && response.response !== null
                          ? response.response
                          : JSON.parse(response.responseText || '{}');
                    } catch (_) {
                        respObj = null;
                    }
                    const issueId = respObj?.id ?? respObj?.number ?? respObj?.iid ?? respObj?.issue_id;

                    const notifySuccess = () => {
                        GM_notification({
                            text: `Issue创建成功！`,
                            title: 'CNB Issue工具',
                            timeout: 3000
                        });
                        if (callback) callback(true, issueId);
                    };

                    // 若有标签，则单独 PUT 标签
                    if (Array.isArray(labels) && labels.length > 0 && issueId != null) {
                        const labelsUrl = `${CONFIG.apiBase}/${CONFIG.repoPath}${CONFIG.issueEndpoint}/${issueId}/labels`;
                        GM_xmlhttpRequest({
                            method: 'PUT',
                            url: labelsUrl,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `${CONFIG.accessToken}`,
                                'Accept': 'application/json'
                            },
                            data: JSON.stringify({ labels }),
                            responseType: 'json',
                            onload: function(res2) {
                                if (res2.status >= 200 && res2.status < 300) {
                                    notifySuccess();
                                } else {
                                    let msg = `HTTP ${res2.status}`;
                                    try {
                                        const err = typeof res2.response === 'string'
                                          ? JSON.parse(res2.response) : res2.response;
                                        if (err?.message) msg = err.message;
                                    } catch (_) {}
                                    GM_notification({
                                        text: `Issue已创建，但设置标签失败：${msg}`,
                                        title: 'CNB Issue工具',
                                        timeout: 5000
                                    });
                                    if (callback) callback(true, issueId);
                                }
                            },
                            onerror: function() {
                                GM_notification({
                                    text: `Issue已创建，但设置标签时网络错误`,
                                    title: 'CNB Issue工具',
                                    timeout: 5000
                                });
                                if (callback) callback(true, issueId);
                            }
                        });
                    } else {
                        // 无标签或无法解析 issueId，直接成功
                        notifySuccess();
                    }
                } else {
                    let errorMsg = `HTTP ${response.status}`;
                    try {
                        const errorData = typeof response.response === 'string' ?
                            JSON.parse(response.response) : response.response;
                        if (errorData && errorData.message) {
                            errorMsg = errorData.message;
                        }
                    } catch (e) {}

                    GM_notification({
                        text: `创建失败: ${errorMsg}`,
                        title: 'CNB Issue工具',
                        timeout: 5000
                    });
                    if (callback) callback(false);
                }
            },
            onerror: function(error) {
                GM_notification({
                    text: `网络请求失败`,
                    title: 'CNB Issue工具',
                    timeout: 5000
                });
                if (callback) callback(false);
            }
        });
    }

    // 关闭Issue（设置为 closed，state_reason=completed）
    function closeIssue(issueId, stateReason = 'completed', callback) {
        if (issueId == null) {
            if (typeof callback === 'function') callback(false);
            return;
        }
        const url = `${CONFIG.apiBase}/${CONFIG.repoPath}${CONFIG.issueEndpoint}/${issueId}`;
        GM_xmlhttpRequest({
            method: 'PATCH',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${CONFIG.accessToken}`,
                'Accept': 'application/json'
            },
            data: JSON.stringify({
                state: 'closed',
                state_reason: stateReason
            }),
            responseType: 'json',
            onload: function(res) {
                if (res.status >= 200 && res.status < 300) {
                    if (typeof callback === 'function') callback(true);
                } else {
                    let msg = `HTTP ${res.status}`;
                    try {
                        const err = typeof res.response === 'string' ? JSON.parse(res.response) : res.response;
                        if (err?.message) msg = err.message;
                    } catch (_) {}
                    if (typeof GM_notification === 'function') {
                        GM_notification({
                            text: `标记完成失败：${msg}`,
                            title: 'CNB Issue工具',
                            timeout: 5000
                        });
                    }
                    if (typeof callback === 'function') callback(false);
                }
            },
            onerror: function() {
                if (typeof GM_notification === 'function') {
                    GM_notification({
                        text: `网络请求失败（关闭Issue）`,
                        title: 'CNB Issue工具',
                        timeout: 5000
                    });
                }
                if (typeof callback === 'function') callback(false);
            }
        });
    }

    // 直达目标解码：获取 cnb.cool /数字?url= 的目标地址
    function getCnbGotoTarget(urlLike) {
        try {
            const u = new URL(urlLike, location.href);
            const raw = u.searchParams.get('url') || '';
            if (!raw) return '';
            // 解码 1-2 次，兼容已编码/双重编码
            let t = decodeURIComponent(raw);
            try {
                // 如果仍是百分号编码痕迹，再解一次
                if (/%[0-9A-Fa-f]{2}/.test(t)) t = decodeURIComponent(t);
            } catch (_) {}
            // 只允许 http/https
            if (!/^https?:\/\//i.test(t)) return '';
            return t;
        } catch (_) {
            return '';
        }
    }

    // 若当前位于 cnb.cool 的数字跳转页，立即重定向到真实目标
    function handleCnbGotoPage() {
        const isCNB = /\b(^|\.)cnb\.cool$/i.test(location.hostname);
        if (!isCNB) return;

        // 匹配路径为 /数字 的格式
        const pathMatch = location.pathname.match(/^\/(\d+)$/);
        if (pathMatch && location.search.includes('url=')) {
            const target = getCnbGotoTarget(location.href);
            if (target) {
                // 不留历史记录
                location.replace(target);
            }
        }
    }

    // 将页面内所有 数字?url= 链接批量改写为直链
    function rewriteCnbGotoLinks(root = document) {
        try {
            const isCNB = /\b(^|\.)cnb\.cool$/i.test(location.hostname);
            if (!isCNB) return;

            // 匹配包含数字路径和url参数的链接
            const list = root.querySelectorAll('a[href*="?url="]');
            list.forEach(a => {
                try {
                    const href = a.getAttribute('href') || '';
                    const absUrl = new URL(href, location.href).href;

                    // 检查是否符合数字路径+url参数的模式
                    if (absUrl.includes('cnb.cool/') && /\/(\d+)\?url=/i.test(absUrl)) {
                        const t = getCnbGotoTarget(absUrl);
                        if (t) a.href = t;
                    }
                } catch (_) {}
            });
        } catch (_) {}
    }

    // 事件委托兜底：拦截点击数字跳转链接并直接打开目标
    function cnbGotoClickHandler(e) {
        const isCNB = /\b(^|\.)cnb\.cool$/i.test(location.hostname);
        if (!isCNB) return;

        // 仅关心主按钮/中键点击到 <a>
        let el = e.target;
        while (el && el !== document && !(el instanceof HTMLAnchorElement)) {
            el = el.parentElement;
        }
        if (!(el instanceof HTMLAnchorElement)) return;

        const href = el.getAttribute('href') || '';
        // 使用绝对地址判断
        const abs = (new URL(href, location.href)).href;

        // 匹配数字路径+url参数的模式
        if (!/\/(\d+)\?url=/i.test(abs)) return;

        const target = getCnbGotoTarget(abs);
        if (!target) return;

        // 阻止站内跳转页
        e.preventDefault();
        e.stopPropagation();

        // 兼容中键或带修饰键的新开方式
        const newTab = e.button === 1 || e.ctrlKey || e.metaKey;
        if (newTab) {
            window.open(target, '_blank', 'noopener');
        } else {
            location.href = target;
        }
    }

    // 初始化
    function init() {
        // 读取持久化配置
        try {
            if (typeof GM_getValue === 'function') {
                const repo = GM_getValue('repoPath', CONFIG.repoPath);
                const token = GM_getValue('accessToken', CONFIG.accessToken);
                CONFIG.repoPath = repo || CONFIG.repoPath;
                CONFIG.accessToken = token || CONFIG.accessToken;
                const tags = GM_getValue('cnbTags', []);
                SAVED_TAGS = Array.isArray(tags) ? tags : [];
                const hk = GM_getValue('cnbHotkey', START_HOTKEY);
                if (hk) START_HOTKEY = normalizeHotkeyString(hk);
                const hkEnabled = GM_getValue('cnbHotkeyEnabled', HOTKEY_ENABLED);
                HOTKEY_ENABLED = !!hkEnabled;
            }
        } catch (_) {}

        createFloatingButton();

        // cnb.cool 跳转页直达与站内直链化
        handleCnbGotoPage();
        if (/\b(^|\.)cnb\.cool$/i.test(location.hostname)) {
            // 首次批量改写
            rewriteCnbGotoLinks(document);
            // 事件委托拦截兜底
            document.addEventListener('click', cnbGotoClickHandler, true);
            // 监听后续动态内容
            try {
                __CNB_MO = new MutationObserver(mutations => {
                    for (const m of mutations) {
                        m.addedNodes && m.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                rewriteCnbGotoLinks(node);
                            }
                        });
                    }
                });
                __CNB_MO.observe(document.documentElement || document.body, { childList: true, subtree: true });
                try {
                    if (!__CNB_UNLOAD_BOUND) {
                        window.addEventListener('beforeunload', () => {
                            try { if (__CNB_MO) { __CNB_MO.disconnect(); __CNB_MO = null; } } catch (_) {}
                            try { if (__CNB_CLIP_DIALOG && __CNB_CLIP_DIALOG.parentNode) { __CNB_CLIP_DIALOG.remove(); __CNB_CLIP_DIALOG = null; } } catch (_) {}
                        }, { once: true });
                        __CNB_UNLOAD_BOUND = true;
                    }
                } catch (_) {}
            } catch (_) {}
        }

        // 注册全局快捷键
        document.addEventListener('keydown', globalHotkeyHandler, true);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();