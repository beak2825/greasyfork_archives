// ==UserScript==
// @name         Gemini 效率增强助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gemini 网页版增强工具：支持 Markdown 批量导出/复制、对话收藏功能、代码块高亮优化、列表序号修复及沉浸式 Canvas 模式支持。集成对话侧边栏目录与元素审查工具。
// @author       Youkies
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558942/Gemini%20%E6%95%88%E7%8E%87%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558942/Gemini%20%E6%95%88%E7%8E%87%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // console.log("Gemini Enhancer: Script Loading...");

    const PREFIX = 'gemini-enhancer-v2';

    // SVG Paths
    const ICONS_PATHS = {
        arrowUp: 'M18 15l-6-6-6 6',
        arrowDown: 'M6 9l6 6 6-6',
        scrollToBottom: 'M5 11l7 7 7-7M5 21h14',
        scrollToTop: 'M19 13l-7-7-7 7M19 3H5',
        menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
        close: 'M18 6L6 18M6 6l12 12', // Stroke-based X
        download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
        copy: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
        bug: 'M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z',
        star: 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.01 4.38.38-3.32 2.88 1 4.28L12 15.4z',
        starFilled: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
    };

    const createSvgDataUri = (path) =>
        `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`)}`;
    const createFilledSvgDataUri = (path) =>
        `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="${path}"/></svg>`)}`;

    const ICONS = {
        menu: createFilledSvgDataUri(ICONS_PATHS.menu),
        arrowUp: createSvgDataUri(ICONS_PATHS.arrowUp),
        arrowDown: createSvgDataUri(ICONS_PATHS.arrowDown),
        top: createSvgDataUri(ICONS_PATHS.scrollToTop),
        bottom: createSvgDataUri(ICONS_PATHS.scrollToBottom),
        close: createSvgDataUri(ICONS_PATHS.close),
        download: createFilledSvgDataUri(ICONS_PATHS.download),
        copy: createFilledSvgDataUri(ICONS_PATHS.copy),
        bug: createFilledSvgDataUri(ICONS_PATHS.bug),
        star: createFilledSvgDataUri(ICONS_PATHS.star),
        starFilled: createFilledSvgDataUri(ICONS_PATHS.starFilled)
    };

    /**
     * Advanced HTML to Markdown Converter
     */
    const htmlToMarkdown = (node, listLevel = -1) => {
        if (!node) return '';
        if (node.nodeType === 3) return node.textContent;
        if (node.nodeType === 8) return '';
        if (node.nodeType === 1) {
            const tag = node.tagName.toLowerCase();

            // Formula/Citation Fix
            const dataMath = node.getAttribute('data-math');
            if (dataMath) {
                const content = dataMath.trim();

                // Helper to detect if node is followed by a unit (for distinguishing value "5 min" from citation "[5]")
                const isFollowedByUnit = (n) => {
                    let next = n.nextSibling;
                    while (next && next.nodeType === 3 && !next.textContent.trim()) {
                        next = next.nextSibling; // Skip empty text nodes
                    }
                    if (!next) return false;

                    let text = '';
                    if (next.nodeType === 3) text = next.textContent;
                    else if (next.nodeType === 1) text = next.textContent;

                    text = text.trim().toLowerCase();
                    // Common units whitelist (English & Chinese)
                    const units = [
                        'min', 's', 'sec', 'h', 'hr', 'd', 'day', 'wk', 'mo', 'yr',
                        'g', 'kg', 'mg', 'ug', 'μg', 'ng', 'lb', 'oz',
                        'l', 'ml', 'ul', 'μl', 'gal',
                        'm', 'cm', 'mm', 'nm', 'km', 'ft', 'in',
                        '%', '‰', 'v', 'mv', 'a', 'ma', 'w', 'kw', 'hz', 'khz', 'mhz',
                        'deg', '°', '℃', 'f', 'k', 'pa', 'kpa', 'mpa', 'atm', 'bar',
                        'mol', 'mm/h', 'rpm', 'g/l', 'g/g', 'h-1',
                        '分', '秒', '时', '天', '周', '月', '年',
                        '克', '升', '米', '度', '元', '个', '只', '次'
                    ];
                    // Check if text starts with any unit
                    return units.some(u => text.startsWith(u));
                };

                // Pattern 1: Comma-separated list of integers (e.g., "1, 2") -> Always Citation
                if (/^\d+(,\s*\d+)+$/.test(content)) {
                    return `[${content}]`;
                }

                // Pattern 2: Single integer (e.g., "5") -> citation OR value?
                if (/^\d+$/.test(content)) {
                    if (isFollowedByUnit(node)) {
                        return `$${content}$`; // Value with unit (e.g. 5 min)
                    } else {
                        return `[${content}]`; // Citation (e.g. [5])
                    }
                }

                if (node.classList.contains('math-block')) {
                    return `\n$$${dataMath}$$\n`;
                }
                return `$${dataMath}$`;
            }

            // Universal Attribute Check
            const potentialLatex = node.getAttribute('data-tex') ||
                node.getAttribute('data-latex') ||
                node.getAttribute('alt') ||
                node.getAttribute('aria-label');

            if (potentialLatex) {
                const isMathTag = (tag === 'math' || tag === 'img' || node.classList.contains('math'));
                if (isMathTag || /[\=\^\\_\{]/.test(potentialLatex) || potentialLatex.startsWith('Math formula')) {
                    let clean = potentialLatex.replace(/^Image of /, '').replace(/^Math formula: /, '');
                    if (!clean.startsWith('$')) { clean = `$${clean}$`; }
                    return clean;
                }
            }

            // Standard Logic
            if (tag === 'math') {
                const annotation = node.querySelector('annotation[encoding="application/x-tex"]');
                if (annotation) return `$${annotation.textContent.trim()}$`;
                return node.textContent;
            }
            if (node.classList.contains('katex-mathml')) {
                const annotation = node.querySelector('annotation');
                if (annotation) return `$${annotation.textContent}$`;
            }
            if (node.classList.contains('katex-html')) return '';

            if (tag === 'pre') {
                const code = node.querySelector('code');
                const content = code ? code.textContent : node.textContent;
                let lang = '';

                // Try to get language from code class
                if (code && code.className) {
                    const match = code.className.match(/language-(\w+)/);
                    if (match) lang = match[1];
                }

                // If no language found in code class, try data attributes or parent pre class
                if (!lang) {
                    const preClass = node.className || '';
                    const match = preClass.match(/language-(\w+)/) || preClass.match(/lang-(\w+)/);
                    if (match) lang = match[1];
                }

                // If the user's report is specifically MATLAB, and we see ".m" or "function" keywords and no language is set, heuristic?
                // But safer to rely on classes. If Gemini Canvas uses a specific class structure, we can handle it.
                // Assuming Gemini sometimes puts 'matlab' in class. 

                return `\n\n\`\`\`${lang}\n${content}\n\`\`\`\n\n`;
            }

            // Table Fix (Matrix-based Robustness)
            if (tag === 'table') {
                let md = '\n';
                let rows = Array.from(node.rows);
                if (rows.length === 0) rows = Array.from(node.querySelectorAll('tr'));

                // 1. Extract Data Matrix
                let matrix = rows.map(row => {
                    // Support th/td fallback
                    const cells = row.cells.length > 0 ? Array.from(row.cells) : Array.from(row.querySelectorAll('td, th'));
                    return cells.map(cell => {
                        // Recursively get markdown, flatten newlines, trim whitespace
                        return htmlToMarkdown(cell).replace(/(\r\n|\n|\r)/gm, " ").trim();
                    });
                });

                // 2. Remove Completely Empty Rows
                // A row is "empty" if all its cells are empty strings
                matrix = matrix.filter(row => row.some(cell => cell !== ''));

                if (matrix.length === 0) return '';

                // 3. Determine Table Dimensions
                const maxCols = matrix.reduce((max, row) => Math.max(max, row.length), 0);

                // 4. Prune Artifacts (Ghost Rows)
                // Heuristic: If first row has only 1 column (and is not empty, since we filtered those),
                // BUT the table clearly has multiple columns, it's likely a title/layout artifact.
                if (matrix.length > 1 && matrix[0].length === 1 && maxCols > 1) {
                    matrix.shift();
                }

                // 5. Build Markdown
                matrix.forEach((row, rIndex) => {
                    // Pad with empty cells to ensure rectangular shape
                    const currentCols = row.length;
                    const paddedRow = [...row];
                    for (let i = 0; i < maxCols - currentCols; i++) {
                        paddedRow.push('');
                    }

                    md += '| ' + paddedRow.join(' | ') + ' |\n';

                    // Separator after first row (Header)
                    if (rIndex === 0) {
                        md += '| ' + Array(maxCols).fill(':---').join(' | ') + ' |\n';
                    }
                });
                return md + '\n';
            }

            // List Indentation Fix
            let nextListLevel = listLevel;
            if (tag === 'ul' || tag === 'ol') {
                nextListLevel = listLevel + 1;
            }

            let childContent = '';
            node.childNodes.forEach(c => childContent += htmlToMarkdown(c, nextListLevel));

            switch (tag) {
                case 'h1': return `\n\n# ${childContent}\n\n`;
                case 'h2': return `\n\n## ${childContent}\n\n`;
                case 'h3': return `\n\n### ${childContent}\n\n`;
                case 'h4': return `\n\n#### ${childContent}\n\n`;
                case 'p': return `\n\n${childContent}\n\n`;
                case 'strong': case 'b': return `**${childContent}**`;
                case 'em': case 'i': return `*${childContent}*`;
                case 'code': return `\`${childContent}\``;
                case 'ul':
                case 'ol':
                    return `\n${childContent}\n`;
                case 'li':
                    const depth = Math.max(0, listLevel);
                    const indent = '  '.repeat(depth);
                    const parent = node.parentElement;
                    let prefix = '- ';
                    if (parent && parent.tagName.toLowerCase() === 'ol') {
                        // Calculate index for correct numbering (1., 2., 3...)
                        // instead of generic 1. (which users dislike in raw text)
                        const siblings = Array.from(parent.children).filter(n => n.tagName.toLowerCase() === 'li');
                        let index = siblings.indexOf(node) + 1;

                        // Respect 'start' attribute if present
                        const start = parseInt(parent.getAttribute('start'));
                        if (!isNaN(start)) {
                            index += (start - 1);
                        }

                        prefix = `${index}. `;
                    }
                    return `${indent}${prefix}${childContent.trim()}\n`;

                case 'a': return `[${childContent}](${node.href})`;
                case 'br': return '\n';
                case 'div':
                    if (!childContent.trim()) return '';
                    return `${childContent}\n`;
                case 'span': return childContent;
                default: return childContent;
            }
        }
        return '';
    };

    class StyleManager {
        constructor() { this.injectCSS(); }
        injectCSS() {
            const style = document.createElement('style');
            style.textContent = `
                /* CSS Remains same */
                #${PREFIX}-fab-container { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 12px; z-index: 2147483647; align-items: center; pointer-events: none; }
                .${PREFIX}-fab-btn { width: 40px; height: 40px; border-radius: 50%; background-color: var(--gemini-surface, #fff); box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: auto; color: #5f6368; }
                .${PREFIX}-fab-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); background-color: #f8f9fa; color: #202124; }
                .${PREFIX}-icon { width: 20px; height: 20px; background-color: currentColor; -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; }
                #${PREFIX}-sidebar { position: fixed; top: 64px; right: 0; width: 300px; max-height: calc(100vh - 100px); background-color: #fff; box-shadow: -4px 0 24px rgba(0,0,0,0.15); z-index: 2147483648; transform: translateX(110%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; border-radius: 16px 0 0 16px; overflow: hidden; font-family: 'Google Sans', Roboto, sans-serif; border: 1px solid #e0e0e0; }
                #${PREFIX}-sidebar.active { transform: translateX(0); }
                .${PREFIX}-sidebar-header { padding: 16px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; background: #fff; }
                .${PREFIX}-sidebar-content { flex: 1; overflow-y: auto; padding: 8px; background: #fafafa; }
                .${PREFIX}-list-item { padding: 10px 16px; border-radius: 8px; margin-bottom: 4px; cursor: pointer; font-size: 14px; color: #444746; border-left: 3px solid transparent; transition: background 0.1s; display: flex; align-items: center; gap: 8px; }
                .${PREFIX}-list-item:hover { background-color: rgba(0,0,0,0.05); }
                .${PREFIX}-list-item.active { background-color: #e8f0fe; color: #0b57d0; font-weight: 500; border-left-color: #0b57d0; }
                .${PREFIX}-fav-icon { min-width: 14px; width: 14px; height: 14px; background-color: #fbbc04; -webkit-mask-image: url('${ICONS.starFilled}'); mask-image: url('${ICONS.starFilled}'); -webkit-mask-size: contain; mask-size: contain; display: none; }
                .${PREFIX}-list-item.is-fav .${PREFIX}-fav-icon { display: block; }

                /* User Query Favorite Button */
                .${PREFIX}-query-fav-btn {
                    /* Match native mat-icon-button size (40px) for consistent hover area */
                    width: 40px; height: 40px; 
                    border-radius: 50%; /* Make it circular like native ripple targets */
                    cursor: pointer; 
                    margin-right: 4px; /* Space between star and bubble */
                    margin-left: -4px; /* Pull slightly left to sit closer to Edit button */
                    flex-shrink: 0;
                    color: var(--gemini-on-surface-variant, #444746);
                    display: inline-flex; align-items: center; justify-content: center;
                    transition: none; /* Instant appearance to match native buttons */
                    opacity: 0; 
                }
                /* Show on hover of the query content container */
                .query-content:hover .${PREFIX}-query-fav-btn,
                .user-query:hover .${PREFIX}-query-fav-btn,
                .${PREFIX}-query-fav-btn.is-fav { opacity: 1; }
                .${PREFIX}-query-fav-btn:hover { color: #fbbc04; }
                .${PREFIX}-query-fav-btn.is-fav { color: #fbbc04; opacity: 1; }
                
                /* Inline Button Styles - Default (Chat Mode) */
                .${PREFIX}-inline-wrapper { display: inline-flex; align-items: center; margin-left: 8px; vertical-align: middle; }
                .${PREFIX}-inline-btn { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: #5f6368; transition: background 0.2s; }
                .${PREFIX}-inline-btn:hover { background-color: rgba(60,64,67,0.08); color: #1a73e8; }
                .${PREFIX}-inline-btn.is-fav { color: #fbbc04; }
                
                /* Canvas (Immersive & Header) Specific Overrides - STRICT NATIVE MATCH */
                .immersive-editor-quick-actions .${PREFIX}-inline-btn,
                .action-buttons .${PREFIX}-inline-btn { 
                    width: 40px; height: 40px; /* Reduced to standard MD3 size */
                    margin: 0; /* Remove horizontal margin, trust flex gap or small specific margin */
                    margin-right: 4px; /* Slight spacing */
                    background: transparent; 
                    box-shadow: none; 
                    border-radius: 50%;
                    color: inherit; 
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .immersive-editor-quick-actions .${PREFIX}-inline-btn:hover,
                .action-buttons .${PREFIX}-inline-btn:hover { 
                    background-color: rgba(60,64,67,0.08); 
                    color: inherit;
                }
                .immersive-editor-quick-actions .${PREFIX}-icon,
                .action-buttons .${PREFIX}-icon {
                    width: 20px; height: 20px; /* Reduced to 20px */
                    background-color: #444746; 
                }

                .${PREFIX}-inspector-active * { cursor: crosshair !important; }
                .${PREFIX}-inspector-active *:hover { outline: 2px solid #ff0000; background-color: rgba(255, 0, 0, 0.1); }

                @media (prefers-color-scheme: dark), body[data-is-dark-mode="true"] {
                    .${PREFIX}-fab-btn { background-color: #303134; color: #e3e3e3; }
                    .${PREFIX}-fab-btn:hover { background-color: #3c4043; }
                    #${PREFIX}-sidebar { background-color: #1e1f20; border-color: #444746; }
                    .${PREFIX}-sidebar-header { background-color: #1e1f20; border-bottom-color: #444746; color: #e3e3e3; }
                    .${PREFIX}-sidebar-content { background-color: #131314; }
                    .${PREFIX}-list-item { color: #c4c7c5; }
                    .${PREFIX}-list-item:hover { background-color: rgba(255,255,255,0.1); }
                    .${PREFIX}-list-item.active { background-color: #414242; color: #a8c7fa; border-left-color: #a8c7fa; }
                    .${PREFIX}-inline-btn { color: #c4c7c5; }
                    .${PREFIX}-inline-btn:hover { background-color: rgba(255,255,255,0.1); color: #a8c7fa; }
                    .${PREFIX}-inline-btn.is-fav { color: #fbbc04; }
                    .${PREFIX}-query-fav-btn { color: #c4c7c5; }
                    .${PREFIX}-query-fav-btn:hover, .${PREFIX}-query-fav-btn.is-fav { color: #fbbc04; }
                    
                    /* Canvas Dark Mode */
                    .immersive-editor-quick-actions .${PREFIX}-inline-btn,
                    .action-buttons .${PREFIX}-inline-btn { 
                         background: transparent; border: none;
                    }
                    .immersive-editor-quick-actions .${PREFIX}-inline-btn:hover,
                    .action-buttons .${PREFIX}-inline-btn:hover { 
                         background: rgba(255,255,255,0.1); 
                    }
                    .immersive-editor-quick-actions .${PREFIX}-icon,
                    .action-buttons .${PREFIX}-icon {
                        background-color: #c4c7c5;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    class GeminiEnhancer {
        constructor() {
            this.questions = [];
            this.currentQuestionIndex = -1;
            this.inspectorMode = false;
            new StyleManager();
            this.initUI();

            this.observer = new MutationObserver(() => this.scan());
            this.observer.observe(document.body, { childList: true, subtree: true });

            let lastUrl = location.href;
            setInterval(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    setTimeout(() => this.scan(), 1000);
                }
            }, 1000);

            setTimeout(() => this.scan(), 1000);

            // Inspector Click Listener
            document.addEventListener('click', (e) => {
                if (!this.inspectorMode) return;
                e.preventDefault();
                e.stopPropagation();

                const target = e.target;
                const html = target.outerHTML;
                navigator.clipboard.writeText(html).then(() => {
                    this.showToast('✅ 元素 HTML 已复制！请发送给我。');
                    this.toggleInspector(false);
                }).catch(err => {
                    console.error('Inspector copy failed:', err);
                    this.showToast('❌ 复制失败，请重试');
                });
            }, true);
        }

        initUI() {
            this.sidebar = document.createElement('div');
            this.sidebar.id = `${PREFIX}-sidebar`;
            const header = document.createElement('div');
            header.className = `${PREFIX}-sidebar-header`;

            const titleSpan = document.createElement('span');
            titleSpan.style.fontWeight = 'bold';
            titleSpan.style.fontSize = '16px';
            titleSpan.textContent = '对话目录';
            header.appendChild(titleSpan);

            const closeBtn = document.createElement('div');
            closeBtn.className = `${PREFIX}-inline-btn`;
            closeBtn.style.margin = '0';
            const closeIcon = document.createElement('div');
            closeIcon.className = `${PREFIX}-icon`;
            closeIcon.style.webkitMaskImage = `url('${ICONS.close}')`;
            closeIcon.style.maskImage = `url('${ICONS.close}')`;
            closeBtn.appendChild(closeIcon);
            closeBtn.onclick = () => this.sidebar.classList.remove('active');
            header.appendChild(closeBtn);

            const content = document.createElement('div');
            content.className = `${PREFIX}-sidebar-content`;
            content.id = `${PREFIX}-list`;

            this.sidebar.appendChild(header);
            this.sidebar.appendChild(content);
            document.body.appendChild(this.sidebar);

            const fabContainer = document.createElement('div');
            fabContainer.id = `${PREFIX}-fab-container`;

            const addFab = (iconUrl, title, onClick, id) => {
                const btn = document.createElement('div');
                if (id) btn.id = id;
                btn.className = `${PREFIX}-fab-btn`;
                btn.title = title;
                const icon = document.createElement('div');
                icon.className = `${PREFIX}-icon`;
                icon.style.webkitMaskImage = `url('${iconUrl}')`;
                icon.style.maskImage = `url('${iconUrl}')`;
                btn.appendChild(icon);
                btn.onclick = (e) => { e.stopPropagation(); onClick(); };
                fabContainer.appendChild(btn);
                return btn;
            };

            addFab(ICONS.menu, "目录 / 刷新", () => {
                this.scan();
                this.sidebar.classList.toggle('active');
            });
            addFab(ICONS.top, "回到顶部", () => this.scroll(0));
            addFab(ICONS.arrowUp, "上一个提问", () => this.nav(-1));
            addFab(ICONS.arrowDown, "下一个提问", () => this.nav(1));
            addFab(ICONS.bottom, "滚动到底部", () => this.scroll(Infinity));
            // Debug button disabled for v1.0 release
            // this.inspectorBtn = addFab(ICONS.bug, "元素抓取 / 调试模式", () => this.toggleInspector(!this.inspectorMode), `${PREFIX}-inspector-btn`);

            document.body.appendChild(fabContainer);
        }

        toggleInspector(active) {
            this.inspectorMode = active;
            if (active) {
                document.body.classList.add(`${PREFIX}-inspector-active`);
                this.inspectorBtn.style.backgroundColor = '#f44336'; // Red
                this.inspectorBtn.style.color = '#fff';
                this.showToast('🐞 抓取模式已开启！请点击元素...');
            } else {
                document.body.classList.remove(`${PREFIX}-inspector-active`);
                this.inspectorBtn.style.backgroundColor = '';
                this.inspectorBtn.style.color = '';
            }
        }

        getScroller() {
            const explicit = document.querySelector('infinite-scroller[data-test-id="chat-history-container"]');
            if (explicit) return explicit;
            const scrollers = Array.from(document.querySelectorAll('infinite-scroller'));
            const candidates = scrollers.filter(el =>
                !el.closest('mat-sidenav') &&
                !el.closest('.sidenav-with-history-container')
            );
            if (candidates.length > 0) {
                candidates.sort((a, b) => b.clientWidth - a.clientWidth);
                return candidates[0];
            }
            return document.documentElement;
        }

        scroll(pos) {
            const scroller = this.getScroller();
            const targetPos = (pos === Infinity) ? scroller.scrollHeight : pos;
            if (scroller === document.documentElement || scroller === document.body) {
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            } else {
                scroller.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        }

        nav(dir) {
            this.scan();
            if (this.questions.length === 0) return;
            let next = this.currentQuestionIndex + dir;
            if (next < 0) next = 0;
            if (next >= this.questions.length) next = this.questions.length - 1;
            this.currentQuestionIndex = next;
            const target = this.questions[next].element;
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.renderList();
        }

        scan() {
            const selectors = ['user-query', '[data-test-id="user-query"]', '.user-query'];
            let rawElements = [];
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => rawElements.push(el));
            });
            rawElements = [...new Set(rawElements)];
            // Sort by document position
            rawElements.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);

            const newQuestions = rawElements.map((el, idx) => {
                const rawText = el.innerText || "";
                const title = rawText.split('\n').find(l => l.trim().length > 0) || `提问 ${idx + 1}`;

                // Find associated response to check favorite status
                let isFav = false;
                let responseEl = null;
                let next = el.nextElementSibling;
                while (next) {
                    // Check if 'next' is a model-response or contains one
                    if (next.tagName.toLowerCase() === 'model-response') responseEl = next;
                    else if (next.querySelector && next.querySelector('model-response')) responseEl = next.querySelector('model-response');

                    if (responseEl) {
                        isFav = (responseEl.dataset.isFavorite === 'true');
                        break;
                    }

                    // If we hit another user-query, stop searching for this item's response
                    if (next.matches && (next.matches('user-query') || next.matches('.user-query'))) break;
                    if (next.querySelector && (next.querySelector('user-query') || next.querySelector('.user-query'))) break;

                    next = next.nextElementSibling;
                }

                // Inject/Update User Query Favorite Button
                const bubble = el.querySelector('.user-query-bubble-with-background');
                if (bubble && responseEl) {
                    // Move Star to outside the bubble (alongside Copy/Edit buttons)
                    // Target parent .query-content
                    let container = bubble.parentElement;

                    // Fallback if structure is unexpected
                    if (!container) container = bubble;

                    // Cleanup legacy button inside bubble
                    const legacyBtn = bubble.querySelector(`.${PREFIX}-query-fav-btn`);
                    if (legacyBtn) legacyBtn.remove();

                    let queryBtn = container.querySelector(`.${PREFIX}-query-fav-btn`);
                    if (!queryBtn) {
                        queryBtn = document.createElement('div');
                        queryBtn.className = `${PREFIX}-query-fav-btn`;
                        queryBtn.title = isFav ? '取消收藏' : '收藏';

                        const icon = document.createElement('div');
                        icon.className = `${PREFIX}-icon`;
                        queryBtn.appendChild(icon);

                        queryBtn.onclick = (e) => {
                            e.stopPropagation();
                            const current = responseEl.dataset.isFavorite === 'true';
                            const newState = !current;
                            responseEl.dataset.isFavorite = newState ? 'true' : 'false';
                            this.scan(); // Refresh UI
                            this.showToast(newState ? '⭐ 已收藏' : '已取消收藏');
                        };

                        // Insert before the bubble (places it after existing buttons)
                        container.insertBefore(queryBtn, bubble);
                    }

                    // Update State
                    const iconDiv = queryBtn.querySelector(`.${PREFIX}-icon`);
                    if (isFav) {
                        queryBtn.classList.add('is-fav');
                        queryBtn.title = '取消收藏';
                        iconDiv.style.webkitMaskImage = `url('${ICONS.starFilled}')`;
                        iconDiv.style.maskImage = `url('${ICONS.starFilled}')`;
                    } else {
                        queryBtn.classList.remove('is-fav');
                        queryBtn.title = '收藏';
                        iconDiv.style.webkitMaskImage = `url('${ICONS.star}')`;
                        iconDiv.style.maskImage = `url('${ICONS.star}')`;
                    }
                }

                return { element: el, text: title.substring(0, 40), isFav: isFav };
            });

            // Use JSON stringify to compare, but exclude 'element' field to avoid circular structure issues and false negatives
            const simplified = q => ({ text: q.text, isFav: q.isFav });
            if (JSON.stringify(newQuestions.map(simplified)) !== JSON.stringify(this.questions.map(simplified))) {
                this.questions = newQuestions;
                if (Math.abs(this.questions.length - newQuestions.length) > 2) this.currentQuestionIndex = -1;
                this.renderList();
            }
            document.querySelectorAll('model-response').forEach(el => this.injectInline(el));
            this.scanCanvas();
        }

        scanCanvas() {
            const actionContainers = document.querySelectorAll('.action-buttons');
            actionContainers.forEach(container => {
                const printBtn = container.querySelector('print-button');
                if (printBtn) {
                    if (!container.querySelector(`.${PREFIX}-inline-btn`)) {
                        this.injectCanvasButtons(container, printBtn);
                    }
                }
            });
        }

        injectCanvasButtons(container, referenceNode) {
            const createBtn = (iconUrl, title, onClick) => {
                const btn = document.createElement('div');
                btn.className = `${PREFIX}-inline-btn`;
                btn.title = title;
                const icon = document.createElement('div');
                icon.className = `${PREFIX}-icon`;
                icon.style.webkitMaskImage = `url('${iconUrl}')`;
                icon.style.maskImage = `url('${iconUrl}')`;
                btn.appendChild(icon);
                btn.onclick = (e) => { e.stopPropagation(); onClick(); };
                container.insertBefore(btn, referenceNode);
            };

            const getContent = () => {
                const markdownEditor = document.querySelector('#extended-response-markdown-content');
                if (markdownEditor) return markdownEditor;
                const anyImmersive = document.querySelector('.immersive-editor.markdown');
                return anyImmersive;
            };

            createBtn(ICONS.download, "下载 Canvas 文档", () => {
                const el = getContent();
                if (el) this.download(el, 'gemini_canvas_export');
                else this.showToast('❌ 未找到文档内容');
            });

            createBtn(ICONS.copy, "复制 Canvas 文档", () => {
                const el = getContent();
                if (el) this.copyMarkdown(el);
                else this.showToast('❌ 未找到文档内容');
            });
        }

        renderList() {
            const list = document.getElementById(`${PREFIX}-list`);
            if (!list) return;
            while (list.firstChild) { list.removeChild(list.firstChild); }

            if (this.questions.length === 0) {
                const empty = document.createElement('div');
                empty.style.padding = '16px';
                empty.style.color = '#888';
                empty.textContent = '暂未发现提问';
                list.appendChild(empty);
                return;
            }
            this.questions.forEach((q, idx) => {
                const div = document.createElement('div');
                div.className = `${PREFIX}-list-item`;
                if (q.isFav) div.classList.add('is-fav');
                if (idx === this.currentQuestionIndex) div.classList.add('active');

                // Star Icon
                const star = document.createElement('div');
                star.className = `${PREFIX}-fav-icon`;
                div.appendChild(star);

                // Text
                const span = document.createElement('span');
                span.textContent = `${idx + 1}. ${q.text}`;
                span.style.flex = '1';
                span.style.overflow = 'hidden';
                span.style.textOverflow = 'ellipsis';
                span.style.whiteSpace = 'nowrap';
                div.appendChild(span);

                div.onclick = () => {
                    q.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    this.currentQuestionIndex = idx;
                    this.renderList();
                };
                list.appendChild(div);
            });
        }

        injectInline(responseEl) {
            const toolbar = responseEl.querySelector('.buttons-container-v2, .actions-container-v2, .buttons-container');
            if (!toolbar) return;
            // Only inject if wrapper doesn't exist
            let wrapper = toolbar.querySelector(`.${PREFIX}-inline-wrapper`);
            if (!wrapper) {
                wrapper = document.createElement('div');
                wrapper.className = `${PREFIX}-inline-wrapper`;
                toolbar.appendChild(wrapper);
            }

            // Check if buttons key exists. If so, iterate to find Fav button and update state.
            // If empty, create buttons.

            const updateFavBtn = (btn, isFav) => {
                const iconDiv = btn.querySelector(`.${PREFIX}-icon`);
                if (isFav) {
                    btn.classList.add('is-fav');
                    btn.title = '取消收藏';
                    iconDiv.style.webkitMaskImage = `url('${ICONS.starFilled}')`;
                    iconDiv.style.maskImage = `url('${ICONS.starFilled}')`;
                    iconDiv.style.backgroundColor = '#fbbc04'; // Yellow
                } else {
                    btn.classList.remove('is-fav');
                    btn.title = '收藏';
                    iconDiv.style.webkitMaskImage = `url('${ICONS.star}')`;
                    iconDiv.style.maskImage = `url('${ICONS.star}')`;
                    iconDiv.style.backgroundColor = ''; // Inherit default
                }
            };

            const isFav = responseEl.dataset.isFavorite === 'true';

            // 1. Try to find existing Fav Button
            let favBtn = wrapper.querySelector(`.${PREFIX}-inline-btn`); // Assuming first one is always fav due to creation order
            // Better selector loop
            if (wrapper.children.length === 0) {
                // CREATE MODE
                // 1. Favorite Button
                favBtn = document.createElement('div');
                favBtn.className = `${PREFIX}-inline-btn`;
                const favIcon = document.createElement('div');
                favIcon.className = `${PREFIX}-icon`;
                favBtn.appendChild(favIcon);

                favBtn.onclick = (e) => {
                    e.stopPropagation();
                    const current = responseEl.dataset.isFavorite === 'true';
                    const newState = !current;
                    responseEl.dataset.isFavorite = newState ? 'true' : 'false';
                    this.scan(); // Refresh UI
                    this.showToast(newState ? '⭐ 已收藏' : '已取消收藏');
                };
                wrapper.appendChild(favBtn);

                // Helper for other buttons
                const createBtn = (iconUrl, title, onClick) => {
                    const btn = document.createElement('div');
                    btn.className = `${PREFIX}-inline-btn`;
                    btn.title = title;
                    const icon = document.createElement('div');
                    icon.className = `${PREFIX}-icon`;
                    icon.style.webkitMaskImage = `url('${iconUrl}')`;
                    icon.style.maskImage = `url('${iconUrl}')`;
                    btn.appendChild(icon);
                    btn.onclick = (e) => { e.stopPropagation(); onClick(); };
                    wrapper.appendChild(btn);
                };

                createBtn(ICONS.download, "下载 Markdown", () => this.download(responseEl));
                createBtn(ICONS.copy, "复制 Markdown", () => this.copyMarkdown(responseEl));
            } else {
                // UPDATE MODE
                favBtn = wrapper.firstElementChild; // Fav btn is always first
            }

            // Sync State
            if (favBtn) updateFavBtn(favBtn, isFav);
        }

        getMarkdownContent(responseEl) {
            let mdContent = htmlToMarkdown(responseEl);

            // Robust Citation Merging Logic
            // Detects cases like: "Context\n[1, 2]\nPunctuation" or "Context\n[1, 2]\nText"
            // And merges them into "Context [1, 2]Punctuation" or "Context [1, 2] Text"
            // Regex captures: 1=LastChar, 2=Citation, 3=NextChar
            mdContent = mdContent.replace(/([^\n])\n+(\[[\d,\s\.]+\])\n+([^\n])/g, (match, prevChar, citation, nextChar) => {
                // 1. Separator before citation
                // Use a space generally.
                const sepBefore = ' ';

                // 2. Separator after citation
                // If next is full-width punctuation, NO SPACE. Else SPACE.
                const isNextPunctuation = /[。，；：！？\.,;:\!\?]/.test(nextChar);
                const sepAfter = isNextPunctuation ? '' : ' ';

                return `${prevChar}${sepBefore}${citation}${sepAfter}${nextChar}`;
            });

            // Fix broken Reference List items
            // Matches: "- [1]" (with optional whitespace) at end of line, merges with next line content
            mdContent = mdContent.replace(/^(\s*[-*]\s*\[\d+\])\s*\n/gm, '$1 ');

            // Post-process to repair broken tables (Canvas Mode <p> tags issue)
            mdContent = this.repairMarkdownTables(mdContent);

            return mdContent.replace(/\n{3,}/g, '\n\n').trim();
        }

        repairMarkdownTables(md) {
            const lines = md.split('\n');
            const result = [];
            let tableBuffer = [];

            const flushTable = () => {
                if (tableBuffer.length === 0) return;

                // 1. Parse buffer into matrix
                let matrix = tableBuffer.map(line => {
                    const content = line.trim();
                    if (!content.startsWith('|') || !content.endsWith('|')) return null;
                    const inner = content.substring(1, content.length - 1);
                    return inner.split('|').map(c => c.trim());
                }).filter(row => row !== null);

                // 2. Filter out completely empty rows (ghost rows)
                matrix = matrix.filter(row => row.some(cell => cell !== ''));

                if (matrix.length === 0) {
                    // Start over? No, if it was just ghost rows, discard.
                    tableBuffer = [];
                    return;
                }

                // 3. Statistics & Pruning
                const maxCols = matrix.reduce((max, row) => Math.max(max, row.length), 0);

                // Prune "Single Column" Artifacts if table is multi-column
                let filteredMatrix = matrix.filter(row => {
                    if (maxCols >= 2 && row.length === 1) {
                        // Likely a title row or artifact.
                        return false;
                    }
                    return true;
                });

                if (filteredMatrix.length === 0) return;

                // 4. Check/Inject Separator
                let hasSeparator = false;
                if (filteredMatrix.length >= 2) {
                    const secondRow = filteredMatrix[1];
                    const isSep = secondRow.every(cell => /^:?-+:?$/.test(cell));
                    if (isSep) hasSeparator = true;
                }

                // 5. Reconstruct
                filteredMatrix.forEach((row, idx) => {
                    while (row.length < maxCols) row.push('');

                    const line = '| ' + row.join(' | ') + ' |';
                    result.push(line);

                    if (idx === 0 && !hasSeparator) {
                        const separator = '| ' + Array(maxCols).fill(':---').join(' | ') + ' |';
                        result.push(separator);
                    }
                });

                tableBuffer = [];
            };

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith('|') && line.endsWith('|')) {
                    tableBuffer.push(lines[i]);
                } else {
                    flushTable();
                    result.push(lines[i]);
                }
            }
            flushTable();

            return result.join('\n');
        }

        download(responseEl, filenamePrefix = 'gemini_export') {
            const cleanMd = this.getMarkdownContent(responseEl);
            const blob = new Blob([cleanMd], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filenamePrefix}_${Date.now()}.md`;
            a.click();
            URL.revokeObjectURL(url);
        }

        copyMarkdown(responseEl) {
            const cleanMd = this.getMarkdownContent(responseEl);
            navigator.clipboard.writeText(cleanMd).then(() => {
                this.showToast('✅ Markdown 已复制到剪贴板');
            }).catch(err => {
                console.error('Copy failed:', err);
                this.showToast('❌ 复制失败，请查看控制台');
            });
        }

        showToast(message) {
            let toast = document.getElementById(`${PREFIX}-toast`);
            if (!toast) {
                toast = document.createElement('div');
                toast.id = `${PREFIX}-toast`;
                toast.style.cssText = `
                    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                    background: #323232; color: white; padding: 12px 24px; border-radius: 8px;
                    z-index: 2147483648; font-family: 'Google Sans', sans-serif; font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: opacity 0.3s; opacity: 0; pointer-events: none;
                `;
                document.body.appendChild(toast);
            }
            toast.textContent = message;
            toast.style.opacity = '1';
            setTimeout(() => { toast.style.opacity = '0'; }, 3000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new GeminiEnhancer());
    } else {
        new GeminiEnhancer();
    }
})();
