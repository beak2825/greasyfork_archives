// ==UserScript==
// @name         Gemini to Markdown Copier (Fix Inline Code)
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Export Gemini chat to Markdown with LaTeX support, Dark Mode Preview, Round Selection & Export Mode.
// @author       Gemini & You
// @match        https://gemini.google.com/*
// @icon         https://www.gstatic.com/images/branding/product/1x/gemini_gradient_icon_48dp.png
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561103/Gemini%20to%20Markdown%20Copier%20%28Fix%20Inline%20Code%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561103/Gemini%20to%20Markdown%20Copier%20%28Fix%20Inline%20Code%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 全局配置 ===
    let selectedRoundOption = '1';
    let exportMode = 'full';

    // === 1. 样式表 (保持不变) ===
    const STYLES = `
        #gemini-md-toolbar {
            position: fixed; bottom: 20px; right: 20px; z-index: 9990;
            display: flex; gap: 8px; font-family: 'Google Sans', sans-serif;
            align-items: center; background: rgba(30, 30, 30, 0.85);
            padding: 8px 12px; border-radius: 30px; backdrop-filter: blur(5px);
            border: 1px solid #444; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: opacity 0.3s;
        }
        .gmd-btn {
            background-color: #1a73e8; color: white; border: none; border-radius: 20px;
            padding: 6px 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); cursor: pointer;
            font-size: 13px; font-weight: 500; transition: all 0.2s ease;
            display: flex; align-items: center; gap: 5px; white-space: nowrap;
        }
        .gmd-btn:hover { background-color: #1557b0; transform: translateY(-1px); }
        .gmd-btn.secondary { background-color: #2d2e30; color: #8ab4f8; border: 1px solid #5f6368; }
        .gmd-btn.secondary:hover { background-color: #3c4043; border-color: #8ab4f8; }
        .gmd-select {
            background-color: #2d2e30; color: #e1e1e1; border: 1px solid #5f6368;
            border-radius: 16px; padding: 6px 10px; font-size: 12px; outline: none;
            cursor: pointer; transition: border 0.2s, background 0.2s;
            appearance: none; text-align: center; min-width: 80px;
        }
        .gmd-select:hover { border-color: #8ab4f8; background-color: #3c4043; }
        .gmd-select option { background-color: #2d2e30; color: #fff; text-align: left;}
        .gmd-divider { width: 1px; height: 18px; background: #555; margin: 0 2px; }
        .gmd-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); z-index: 9998; display: flex;
            justify-content: center; align-items: center; backdrop-filter: blur(4px);
        }
        .gmd-modal {
            background: #1e1e1e; width: 80%; max-width: 900px; height: 85%;
            border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: flex; flex-direction: column; overflow: hidden;
            border: 1px solid #444; animation: gmdFadeIn 0.2s ease-out; color: #d4d4d4;
        }
        .gmd-header { padding: 15px 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; background: #252526; }
        .gmd-title { font-weight: bold; color: #e1e1e1; font-size: 16px; }
        .gmd-close { cursor: pointer; font-size: 22px; color: #aaa; padding: 0 8px; user-select: none; }
        .gmd-close:hover { color: #fff; }
        .gmd-body { flex: 1; padding: 0; position: relative; }
        .gmd-textarea {
            width: 100%; height: 100%; border: none; padding: 20px;
            font-family: 'Consolas', 'Monaco', 'Fira Code', monospace;
            font-size: 14px; line-height: 1.6; resize: none; outline: none;
            box-sizing: border-box; background: #1e1e1e; color: #d4d4d4; color-scheme: dark;
        }
        .gmd-footer { padding: 15px 20px; border-top: 1px solid #333; display: flex; justify-content: flex-end; gap: 10px; align-items: center; background: #252526; }
        .gmd-toast {
            position: fixed; bottom: 80px; right: 20px; background: #333; color: #fff;
            padding: 10px 20px; border-radius: 8px; font-size: 14px; z-index: 10000;
            opacity: 0; transition: opacity 0.3s; pointer-events: none; border: 1px solid #555;
        }
        .gmd-toast.show { opacity: 1; }
        @keyframes gmdFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(STYLES);
    } else {
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);
    }

    // === 2. 内容解析器 ===
    function parseContent(element) {
        if (!element) return '';
        try {
            const clone = element.cloneNode(true);

            // 2.1 垃圾清理
            const selectorsToRemove = [
                '.export-sheets-button-container',
                '.buttons',
                'button',
                '.action-button',
                '.sources-list',
                '.file-preview-container',
                'sensitive-memories-banner',
                'gap-container'
            ];
            selectorsToRemove.forEach(sel => Array.from(clone.querySelectorAll(sel)).forEach(e => e.remove()));

            const replaceWithText = (nodes, formatFn) => {
                Array.from(nodes).forEach(el => el.replaceWith(document.createTextNode(formatFn(el))));
            };

            // 2.2 优先处理复杂块

            // 代码块
            Array.from(clone.querySelectorAll('code-block')).forEach(block => {
                const langSpan = block.querySelector('.code-block-decoration span');
                const lang = langSpan ? langSpan.innerText.trim() : '';
                const codeElem = block.querySelector('pre code');
                let codeText = codeElem ? codeElem.innerText : block.innerText.replace(lang, '').trim();
                codeText = codeText.replace(/\s+$/, '');
                block.replaceWith(document.createTextNode(`\n\n\`\`\`${lang}\n${codeText}\n\`\`\`\n`));
            });

            // 残留 Pre
            Array.from(clone.querySelectorAll('pre')).forEach(pre => {
                if (pre.closest('code-block')) return;
                let preText = pre.innerText.replace(/\s+$/, '');
                pre.replaceWith(document.createTextNode(`\n\n\`\`\`\n${preText}\n\`\`\`\n`));
            });

            // 表格
            Array.from(clone.querySelectorAll('table')).forEach(table => {
                let mdTable = '\n\n';
                const rows = Array.from(table.querySelectorAll('tr'));
                rows.forEach((row, rowIndex) => {
                    const cells = Array.from(row.querySelectorAll('th, td'));
                    const rowContent = cells.map(c => c.innerText.trim().replace(/\n/g, '<br>').replace(/\|/g, '\\|')).join(' | ');
                    mdTable += `| ${rowContent} |\n`;
                    if (rowIndex === 0) {
                        mdTable += `| ${cells.map(() => '---').join(' | ')} |\n`;
                    }
                });
                mdTable += '\n';
                table.replaceWith(document.createTextNode(mdTable));
            });

            // 2.3 数学公式
            // 行内公式
            replaceWithText(clone.querySelectorAll('.math-inline[data-math]'), el => `$${el.getAttribute('data-math')}$`);

            // 块级公式：检测是否在列表内
            Array.from(clone.querySelectorAll('.math-block[data-math]')).forEach(el => {
                const math = el.getAttribute('data-math');
                const isInsideList = el.closest('li');

                if (isInsideList) {
                    el.replaceWith(document.createTextNode(` $$${math}$$ `));
                } else {
                    el.replaceWith(document.createTextNode(`\n\n$$${math}$$\n\n`));
                }
            });

            // 2.4 行内元素
            Array.from(clone.querySelectorAll('a')).forEach(el => {
                if (el.href && !el.href.startsWith('javascript:') && !el.innerText.includes('http')) {
                    el.replaceWith(document.createTextNode(`[${el.innerText}](${el.href})`));
                }
            });
            replaceWithText(clone.querySelectorAll('b, strong'), el => ` **${el.innerText.trim()}** `);
            replaceWithText(clone.querySelectorAll('i, em'), el => ` *${el.innerText.trim()}* `);

            // [Fix V3.6: 新增] 行内代码 (Inline Code) 支持
            // 注意：必须在 code-block 和 pre 处理完之后运行，以免误伤块级代码
            replaceWithText(clone.querySelectorAll('code'), el => ` \`${el.innerText}\` `);

            // 2.5 块级元素
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag, idx) => {
                replaceWithText(clone.querySelectorAll(tag), el => `\n\n${'#'.repeat(idx + 1)} ${el.innerText.trim()}\n\n`);
            });

            Array.from(clone.querySelectorAll('p')).forEach(p => {
                const text = p.innerText.trim();
                if (p.closest('li')) {
                    p.replaceWith(document.createTextNode(text));
                } else {
                    p.replaceWith(document.createTextNode(`\n\n${text}\n\n`));
                }
            });

            // 2.6 列表处理
            const listItems = Array.from(clone.querySelectorAll('li'));
            const getDepth = (el) => {
                let depth = 0;
                let p = el.parentElement;
                while (p && p !== clone) {
                    if (p.tagName === 'UL' || p.tagName === 'OL') depth++;
                    p = p.parentElement;
                }
                return depth;
            };
            listItems.sort((a, b) => getDepth(b) - getDepth(a));

            listItems.forEach(li => {
                const depth = getDepth(li);
                const indent = '    '.repeat(Math.max(0, depth - 1));
                const parent = li.parentElement;
                const isOrdered = parent && parent.tagName === 'OL';
                let marker = '-';

                if (isOrdered) {
                    let idx = 1;
                    let sib = li.previousElementSibling;
                    while (sib) {
                        if (sib.tagName === 'LI') idx++;
                        sib = sib.previousElementSibling;
                    }
                    marker = `${idx}.`;
                }

                let content = li.innerText.trim();
                if (content.includes('\n')) {
                     const lines = content.split('\n');
                     content = lines.map((line, i) => i === 0 ? line.trim() : `    ${line.trim()}`).join('\n');
                }

                li.replaceWith(document.createTextNode(`\n${indent}${marker} ${content}`));
            });

            Array.from(clone.querySelectorAll('ul, ol')).forEach(list => {
                list.replaceWith(document.createTextNode(list.innerText));
            });

            // 2.7 最终清洗
            let text = clone.innerText;
            text = text.replace(/([：:]) *-(?!\s)/g, '$1\n\n-');
            text = text.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
            text = text.replace(/\n{3,}/g, '\n\n');

            return text.split('\n').map(line => line.replace(/\s+$/, '')).join('\n').trim();

        } catch (e) {
            console.error("Gemini Copier Parse Error:", e);
            return "[Parse Error]";
        }
    }

    // === 3. 生成 Markdown (保持不变) ===
    function generateMarkdown() {
        let allMessages = Array.from(document.querySelectorAll('user-query, model-response'));
        if (allMessages.length === 0) return null;

        let messagesToProcess = allMessages;
        if (selectedRoundOption !== 'all') {
            const rounds = parseInt(selectedRoundOption, 10);
            const sliceCount = rounds * 2;
            const startIndex = Math.max(0, allMessages.length - sliceCount);
            messagesToProcess = allMessages.slice(startIndex);
        }

        const mdOutput = [];
        let validMsgCount = 0;

        messagesToProcess.forEach(msg => {
            let role = 'Unknown';
            let textElement = null;

            if (msg.tagName.toLowerCase() === 'user-query') {
                role = 'User';
                textElement = msg.querySelector('.query-text') || msg;
            } else if (msg.tagName.toLowerCase() === 'model-response') {
                role = 'Gemini';
                textElement = msg.querySelector('.markdown') || msg.querySelector('.model-response-text') || msg;
            }

            if (exportMode === 'ai_only' && role === 'User') return;

            const content = parseContent(textElement);
            if (content) {
                if (exportMode === 'ai_only') {
                    mdOutput.push(`${content}\n\n---\n`);
                } else {
                    mdOutput.push(`## ${role}\n\n${content}\n\n---\n`);
                }
                validMsgCount++;
            }
        });

        return { text: mdOutput.join('\n'), count: validMsgCount };
    }

    // === 4. UI 交互 (保持不变) ===
    function showToast(message) {
        let toast = document.getElementById('gmd-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'gmd-toast';
            toast.className = 'gmd-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    function createButton(text, icon, className, onClick) {
        const btn = document.createElement('button');
        btn.className = className;
        const iconSpan = document.createElement('span');
        iconSpan.textContent = icon;
        btn.appendChild(iconSpan);
        btn.appendChild(document.createTextNode(' ' + text));
        btn.onclick = onClick;
        return btn;
    }

    function showPreviewModal(mdText) {
        const oldOverlay = document.querySelector('.gmd-modal-overlay');
        if (oldOverlay) oldOverlay.remove();
        const overlay = document.createElement('div');
        overlay.className = 'gmd-modal-overlay';
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        const modal = document.createElement('div');
        modal.className = 'gmd-modal';

        const header = document.createElement('div');
        header.className = 'gmd-header';
        const title = document.createElement('span');
        header.append(title, (() => {
            const btn = document.createElement('span');
            btn.className = 'gmd-close';
            btn.textContent = '×';
            btn.onclick = () => overlay.remove();
            return btn;
        })());
        title.className = 'gmd-title';
        title.textContent = 'Markdown 预览';

        const body = document.createElement('div');
        body.className = 'gmd-body';
        const textarea = document.createElement('textarea');
        textarea.className = 'gmd-textarea';
        textarea.spellcheck = false;
        textarea.value = mdText;
        body.appendChild(textarea);

        const footer = document.createElement('div');
        footer.className = 'gmd-footer';
        const copyBtn = createButton('复制', '', 'gmd-btn secondary', () => {
            GM_setClipboard(textarea.value, 'text');
            showToast('✅ 内容已复制');
        });
        const closeFooterBtn = createButton('关闭', '', 'gmd-btn', () => overlay.remove());
        footer.append(copyBtn, closeFooterBtn);
        modal.append(header, body, footer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        textarea.select();
    }

    function handleExport(mode = 'copy') {
        requestAnimationFrame(() => {
            const result = generateMarkdown();
            if (!result || result.text.length === 0) {
                showToast('⚠️ 未检测到内容');
                return;
            }
            if (mode === 'copy') {
                GM_setClipboard(result.text, 'text');
                showToast(`✅ 已复制 (共 ${result.count} 条消息)`);
            } else if (mode === 'preview') {
                showPreviewModal(result.text);
            }
        });
    }

    function createRoundSelect() {
        const select = document.createElement('select');
        select.className = 'gmd-select';
        select.title = "选择要导出的对话轮数";
        const options = [
            { val: '1', text: '最近 1 轮' },
            { val: '2', text: '最近 2 轮' },
            { val: '3', text: '最近 3 轮' },
            { val: '5', text: '最近 5 轮' },
            { val: 'all', text: '全部对话' }
        ];
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.val;
            option.textContent = opt.text;
            if (opt.val === selectedRoundOption) option.selected = true;
            select.appendChild(option);
        });
        select.onchange = (e) => {
            selectedRoundOption = e.target.value;
            showToast(`范围: ${e.target.options[e.target.selectedIndex].text}`);
        };
        return select;
    }

    function createModeSelect() {
        const select = document.createElement('select');
        select.className = 'gmd-select';
        select.title = "选择导出内容模式";
        const options = [
            { val: 'full', text: '双人 (User+AI)' },
            { val: 'ai_only', text: '仅 AI 回复' }
        ];
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.val;
            option.textContent = opt.text;
            if (opt.val === exportMode) option.selected = true;
            select.appendChild(option);
        });
        select.onchange = (e) => {
            exportMode = e.target.value;
            showToast(`模式: ${e.target.options[e.target.selectedIndex].text}`);
        };
        return select;
    }

    function initToolbar() {
        if (document.getElementById('gemini-md-toolbar')) return;

        const toolbar = document.createElement('div');
        toolbar.id = 'gemini-md-toolbar';

        toolbar.appendChild(createRoundSelect());
        toolbar.appendChild(createModeSelect());

        const divider = document.createElement('div');
        divider.className = 'gmd-divider';
        toolbar.appendChild(divider);

        const btnPreview = createButton('预览', '👁️', 'gmd-btn secondary', () => handleExport('preview'));
        const btnCopy = createButton('复制', '📋', 'gmd-btn', () => handleExport('copy'));

        toolbar.appendChild(btnPreview);
        toolbar.appendChild(btnCopy);

        document.body.appendChild(toolbar);
    }

    function startScheduler() {
        setInterval(() => {
            const chatExists = document.querySelector('user-query, model-response');
            const toolbar = document.getElementById('gemini-md-toolbar');

            if (chatExists) {
                if (!toolbar) {
                    initToolbar();
                } else if (toolbar.style.display === 'none') {
                    toolbar.style.display = 'flex';
                }
            } else {
                if (toolbar) {
                    toolbar.style.display = 'none';
                }
            }
        }, 1000);
    }

    startScheduler();
    GM_registerMenuCommand("复制 Markdown (当前设置)", () => handleExport('copy'));

})();