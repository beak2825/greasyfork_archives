// ==UserScript==
// @name         ChatGPT to Notion Exporter
// @namespace    http://tampermonkey.net/
// @version      2.16
// @license      MIT
// @description  ChatGPT 导出到 Notion：智能图片归位 (支持 PicList/PicGo)+隐私开关+单个对话导出
// @author       Wyih
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @connect      api.notion.com
// @connect      127.0.0.1
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557605/ChatGPT%20to%20Notion%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/557605/ChatGPT%20to%20Notion%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[ChatGPT→Notion v2.13] script loaded');

    // --- 基础配置 ---
    const PICLIST_URL = "http://127.0.0.1:36677/upload";
    const ASSET_PLACEHOLDER_PREFIX = "PICLIST_WAITING::";
    const MAX_TEXT_LENGTH = 2000;

    // 🌟 稳定性配置 (平衡速度与稳定性)
    const NOTION_BLOCK_BATCH_SIZE = 90;
    const NOTION_RATE_LIMIT_DELAY = 300; // 300ms 比较均衡，如果不稳可改为 500
    const IMAGE_CONCURRENCY = 3;

    // ------------------- 0. PicList 环境自检 -------------------
    function checkPicListConnection() {
        GM_xmlhttpRequest({
            method: "GET", url: "http://127.0.0.1:36677/heartbeat", timeout: 2000,
            onload: (res) => { if (res.status === 200) console.log("✅ PicList 连接正常"); },
            onerror: () => console.warn("⚠️ PicList 未连接")
        });
    }
    setTimeout(checkPicListConnection, 3000);

    // ------------------- 1. Notion 配置管理 -------------------
    function getConfig() { return { token: GM_getValue('notion_token', ''), dbId: GM_getValue('notion_db_id', '') }; }
    function promptConfig() {
        const token = prompt('请输入 Notion Integration Secret:', GM_getValue('notion_token', ''));
        if (token) {
            const dbId = prompt('请输入 Notion Database ID:', GM_getValue('notion_db_id', ''));
            if (dbId) { GM_setValue('notion_token', token); GM_setValue('notion_db_id', dbId); alert('配置已保存'); }
        }
    }
    GM_registerMenuCommand('⚙️ 设置 Notion Token', promptConfig);

    // ------------------- 2. UI 样式 -------------------
    GM_addStyle(`
        #chatgpt-saver-btn {
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            background-color: #10A37F; color: white; border: none; border-radius: 6px;
            padding: 10px 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: system-ui, sans-serif; font-weight: 600; font-size: 14px; transition: all 0.2s;
        }
        #chatgpt-saver-btn:hover { background-color: #0d8465; transform: translateY(-2px); }
        #chatgpt-saver-btn.loading { background-color: #666; cursor: wait; }
        .cgpt-turn { position: relative; transition: background 0.2s; }
        .cgpt-turn:hover { box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.2); border-radius: 8px; background-color: rgba(16, 163, 127, 0.02); }
        .cgpt-tool-group { z-index: 9500; display: flex; gap: 6px; opacity: 0; transition: opacity 0.2s ease-in-out; background: white; padding: 4px 6px; border-radius: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.15); border: 1px solid #e0e0e0; }
        .cgpt-turn:hover .cgpt-tool-group { opacity: 1; }
        .cgpt-tool-group:has(.cgpt-privacy-toggle[data-skip="true"]) { opacity: 1 !important; border-color: #fce8e6; background: #fff8f8; }
        .cgpt-turn[data-role="assistant"] { display: block !important; }
        .cgpt-turn[data-role="assistant"] .cgpt-tool-group { position: sticky; top: 10px; float: right; margin-left: 10px; margin-bottom: 10px; z-index: 100; }
        .cgpt-turn[data-role="user"] { display: flex !important; flex-direction: column !important; }
        .cgpt-turn[data-role="user"] .cgpt-tool-group { position: sticky; top: 10px; align-self: flex-end; margin-bottom: -34px; z-index: 100; order: -1; }
        .cgpt-icon-btn { cursor: pointer; font-size: 16px; line-height: 24px; user-select: none; width: 26px; height: 26px; text-align: center; border-radius: 50%; transition: background 0.2s; display: flex; align-items: center; justify-content: center; color: #555; }
        .cgpt-icon-btn:hover { background: rgba(0,0,0,0.08); color: #000; }
        .cgpt-privacy-toggle[data-skip="true"] { color: #d93025; background: #fce8e6; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .cgpt-icon-btn.processing { cursor: wait; color: #1a73e8; background: #e8f0fe; }
        .cgpt-icon-btn.processing span { display: block; animation: spin 1s linear infinite; }
        .cgpt-icon-btn.success { color: #188038 !important; background: #e6f4ea; }
        .cgpt-icon-btn.error { color: #d93025 !important; background: #fce8e6; }
    `);

    // ------------------- 3. 气泡定位 -------------------
    function getTurnWrappers() {
        const uniqueNodes = new Set();
        document.querySelectorAll('div[data-testid="conversation-turn"]').forEach(el => uniqueNodes.add(el));
        document.querySelectorAll('[data-message-author-role]').forEach(el => uniqueNodes.add(el));
        document.querySelectorAll('.agent-turn').forEach(el => uniqueNodes.add(el));

        let sorted = Array.from(uniqueNodes);
        sorted.sort((a, b) => {
            if (a === b) return 0;
            return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
        });

        const finalNodes = [];
        for (const node of sorted) {
            const isChild = finalNodes.some(parent => parent.contains(node));
            if (!isChild) finalNodes.push(node);
        }
        return finalNodes;
    }

    function getRoleFromWrapper(wrapper) {
        let role = wrapper.getAttribute('data-message-author-role');
        if (role) return role;
        const inner = wrapper.querySelector('[data-message-author-role]');
        if (inner) return inner.getAttribute('data-message-author-role');
        if (wrapper.classList.contains('agent-turn')) return 'assistant';
        if (wrapper.querySelector('div[class*="user"]')) return 'user';
        return 'assistant';
    }

    function injectPerTurnControls() {
        const turns = getTurnWrappers();
        turns.forEach(turn => {
            if (turn.querySelector('.cgpt-tool-group')) return;
            const role = getRoleFromWrapper(turn);
            turn.classList.add('cgpt-turn');
            turn.setAttribute('data-role', role);

            const group = document.createElement('div');
            group.className = 'cgpt-tool-group';

            const privacyBtn = document.createElement('div');
            privacyBtn.className = 'cgpt-icon-btn cgpt-privacy-toggle';
            privacyBtn.title = '切换隐私';
            privacyBtn.setAttribute('data-skip', 'false');
            const privacyIcon = document.createElement('span');
            privacyIcon.textContent = '👁️';
            privacyBtn.appendChild(privacyIcon);
            privacyBtn.onclick = (e) => {
                e.stopPropagation();
                const isSkipping = privacyBtn.getAttribute('data-skip') === 'true';
                if (isSkipping) {
                    privacyBtn.setAttribute('data-skip', 'false'); privacyIcon.textContent = '👁️'; turn.setAttribute('data-privacy-skip', 'false');
                } else {
                    privacyBtn.setAttribute('data-skip', 'true'); privacyIcon.textContent = '🚫'; turn.setAttribute('data-privacy-skip', 'true');
                }
            };

            const singleBtn = document.createElement('div');
            singleBtn.className = 'cgpt-icon-btn';
            singleBtn.title = '单条导出';
            const exportIcon = document.createElement('span');
            exportIcon.textContent = '📤';
            singleBtn.appendChild(exportIcon);
            singleBtn.onclick = (e) => {
                e.stopPropagation();
                handleSingleExport(turn, singleBtn, exportIcon);
            };

            group.appendChild(privacyBtn);
            group.appendChild(singleBtn);

            if (turn.firstChild) turn.insertBefore(group, turn.firstChild);
            else turn.appendChild(group);
        });
    }

    // ------------------- 4. 资源处理 -------------------
    async function fetchUrlAsArrayBuffer(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            const buffer = await blob.arrayBuffer();
            return { buffer, type: blob.type };
        } catch (e) {
            // Fallback for user blobs if fetch fails
            return new Promise((resolve, reject) => {
                const img = document.querySelector(`img[src="${url}"]`);
                if (!img || !img.complete || img.naturalWidth === 0) return reject("Fetch & Canvas failed");
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    canvas.toBlob(b => {
                        if (!b) return reject("Canvas Blob failed");
                        b.arrayBuffer().then(buf => resolve({ buffer: buf, type: b.type }));
                    }, 'image/png');
                } catch (err) { reject(err.message); }
            });
        }
    }

    function uploadToPicList(arrayBufferObj, filename) {
        return new Promise((resolve, reject) => {
            if (!arrayBufferObj.buffer) return reject("空数据");
            let finalFilename = filename.split('?')[0];
            const mime = (arrayBufferObj.type || '').split(';')[0].trim().toLowerCase();
            const mimeMap = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp' };
            if (!finalFilename.includes('.')) {
                if (mimeMap[mime]) finalFilename += mimeMap[mime]; else finalFilename += '.png';
            }
            const boundary = "----ChatGPTBoundary" + Math.random().toString(36).substring(2);
            const preData = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${finalFilename.replace(/"/g, '')}"\r\nContent-Type: ${mime || 'application/octet-stream'}\r\n\r\n`;
            const combinedBlob = new Blob([preData, arrayBufferObj.buffer, `\r\n--${boundary}--\r\n`]);
            GM_xmlhttpRequest({
                method: "POST", url: PICLIST_URL, headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` }, data: combinedBlob,
                onload: (res) => { try { const r = JSON.parse(res.responseText); if (r.success && r.result) resolve(r.result[0]); else reject(r.message || "上传失败"); } catch (e) { reject(e.message); } },
                onerror: () => reject("PicList 连接失败")
            });
        });
    }

    async function processAssets(blocks, statusCallback) {
        const tasks = [];
        const map = new Map();

        blocks.forEach((b, i) => {
            let urlObj = null;
            if (b.type === 'image' && b.image?.external?.url?.startsWith(ASSET_PLACEHOLDER_PREFIX)) urlObj = b.image.external;
            else if (b.type === 'file' && b.file?.external?.url?.startsWith(ASSET_PLACEHOLDER_PREFIX)) urlObj = b.file.external;

            if (urlObj) {
                const [_, name, realUrl] = urlObj.url.split('::');
                if (realUrl.startsWith('blob:') && b.type === 'file') {
                    b.type = "paragraph";
                    b.paragraph = { rich_text: [{ type: "text", text: { content: `📄 [本地文件] ${name}` }, annotations: { color: "gray", italic: true } }] };
                    delete b.file; return;
                }
                tasks.push({ i, name, realUrl });
                map.set(i, b);
            }
        });

        if (tasks.length === 0) return blocks;

        let completed = 0;
        const total = tasks.length;
        const results = [];

        const runTask = async (task) => {
            try {
                const buf = await fetchUrlAsArrayBuffer(task.realUrl);
                const url = await uploadToPicList(buf, task.name);
                return { i: task.i, url, ok: true };
            } catch (e) {
                return { i: task.i, err: e, name: task.name, ok: false };
            } finally {
                completed++;
                statusCallback(`⏳ Images: ${completed}/${total}`);
            }
        };

        for (let i = 0; i < tasks.length; i += IMAGE_CONCURRENCY) {
            const chunk = tasks.slice(i, i + IMAGE_CONCURRENCY);
            const chunkResults = await Promise.all(chunk.map(runTask));
            results.push(...chunkResults);
        }

        results.forEach(r => {
            const blk = map.get(r.i);
            if (!blk) return;
            if (r.ok) {
                if (blk.type === 'image') blk.image.external.url = r.url;
                else if (blk.type === 'file') { blk.file.external.url = r.url; blk.file.name = r.name; }
            } else {
                blk.type = "paragraph";
                blk.paragraph = { rich_text: [{ type: "text", text: { content: `⚠️ 图片导出失败: ${r.name}` }, annotations: { color: "red" } }] };
                delete blk.file; delete blk.image;
            }
        });
        return blocks;
    }

    // ------------------- 5. DOM 转 Blocks -------------------
    const NOTION_LANGUAGES = new Set([
        "abap", "arduino", "bash", "basic", "c", "clojure", "coffeescript", "c++", "c#", "css", "dart", "diff", "docker", "elixir", "elm", "erlang", "flow", "fortran", "f#", "gherkin", "glsl", "go", "graphql", "groovy", "haskell", "html", "java", "javascript", "json", "julia", "kotlin", "latex", "less", "lisp", "livescript", "lua", "makefile", "markdown", "markup", "matlab", "mermaid", "nix", "objective-c", "ocaml", "pascal", "perl", "php", "plain text", "powershell", "prolog", "protobuf", "python", "r", "reason", "ruby", "rust", "sass", "scala", "scheme", "scss", "shell", "solidity", "sql", "swift", "typescript", "vb.net", "verilog", "vhdl", "visual basic", "webassembly", "xml", "yaml", "java/c/c++/c#"
    ]);

    function mapLanguageToNotion(lang) {
        if (!lang) return "plain text";
        lang = lang.toLowerCase().trim();
        if (lang === "js") return "javascript";
        if (lang === "py") return "python";
        if (lang === "ts") return "typescript";
        if (lang === "sh") return "shell";
        if (lang === "cpp") return "c++";
        if (lang === "cs") return "c#";
        if (NOTION_LANGUAGES.has(lang)) return lang;
        return "plain text";
    }

    function detectLanguageRecursive(preNode) {
        let c = preNode;
        for (let i = 0; i < 3; i++) {
            if (!c) break;
            const h = c.previousElementSibling;
            if (h && NOTION_LANGUAGES.has(h.innerText.toLowerCase())) return h.innerText.toLowerCase();
            c = c.parentElement;
        }
        const code = preNode.querySelector('code');
        if (code && code.className.match(/language-([\w-]+)/)) {
            const raw = code.className.match(/language-([\w-]+)/)[1];
            return mapLanguageToNotion(raw);
        }
        return "plain text";
    }

    function splitCodeSafe(code) {
        const chunks = [];
        let remaining = code;
        while (remaining.length > 0) {
            if (remaining.length <= MAX_TEXT_LENGTH) { chunks.push(remaining); break; }
            let splitIndex = remaining.lastIndexOf('\n', MAX_TEXT_LENGTH - 1);
            if (splitIndex === -1) splitIndex = MAX_TEXT_LENGTH; else splitIndex += 1;
            chunks.push(remaining.slice(0, splitIndex));
            remaining = remaining.slice(splitIndex);
        }
        return chunks;
    }

    // ------------------- 5. DOM 转 Blocks (修复公式版) -------------------

    // 1. 修改 parseInlineNodes 以支持行内公式
    // ------------------- 5. DOM 转 Blocks (修复公式+去空行版) -------------------

    // 1. 解析行内节点 (Text & Inline Equation)
    function parseInlineNodes(nodes) {
        const rt = [];
        function tr(n, s = {}) {
            // [公式修复] 检查是否为 KaTeX 行内公式 (有 data-latex-source 且不是 display 模式)
            if (n.nodeType === 1 && n.hasAttribute('data-latex-source')) {
                const latex = n.getAttribute('data-latex-source');
                // 排除掉 block 模式的 (Block 模式由 processNodesToBlocks 处理)
                if (!n.closest('.katex-display')) {
                    rt.push({
                        type: "equation",
                        equation: { expression: latex }
                    });
                    return; // 停止递归子节点
                }
            }

            // [公式修复] 忽略 KaTeX 的渲染杂项，防止乱码
            if (n.nodeType === 1 && (n.classList.contains('katex-html') || n.classList.contains('katex-mathml'))) {
                return;
            }

            if (n.nodeType === 3) {
                const fullText = n.textContent;
                // [空白行修复] 恢复原本的 trim() 判断，忽略纯空白/换行符节点
                if (!fullText || !fullText.trim()) return;

                for (let i = 0; i < fullText.length; i += MAX_TEXT_LENGTH) {
                    rt.push({
                        type: "text", text: { content: fullText.slice(i, i + MAX_TEXT_LENGTH), link: s.link },
                        annotations: { bold: !!s.bold, italic: !!s.italic, code: !!s.code, color: "default" }
                    });
                }
            } else if (n.nodeType === 1) {
                const ns = { ...s };
                if (['B', 'STRONG'].includes(n.tagName)) ns.bold = true;
                if (['I', 'EM'].includes(n.tagName)) ns.italic = true;
                if (n.tagName === 'CODE') ns.code = true;
                if (n.tagName === 'A' && n.href && n.href.trim() !== '') {
                    ns.link = { url: n.href };
                }
                n.childNodes.forEach(c => tr(c, ns));
            }
        }
        nodes.forEach(n => tr(n));
        return rt;
    }

    // 2. 递归处理块级节点 (Block Equation & Structure)
    function processNodesToBlocks(nodes, seenImages = new Set()) {
        const blocks = [];
        const buf = [];

        // === [FIX] Table support (keep inline equations inside cells) ===
        const processedTables = new WeakSet();

        function toNonEmptyCellRichText(rt) {
            // Notion table_row.cells expects arrays; keep empty cell stable
            return (rt && rt.length) ? rt : [{ type: "text", text: { content: "" } }];
        }

        function tableElementToNotionBlock(tableEl) {
            // Collect rows in visual order
            const rows = Array.from(tableEl.querySelectorAll('tr'));
            if (!rows.length) return null;

            const firstRowCells = Array.from(rows[0].children || []).filter(el => el && (el.nodeName === 'TD' || el.nodeName === 'TH'));
            const hasColumnHeader = firstRowCells.some(c => c.nodeName === 'TH');
            const hasRowHeader = rows.some(r => {
                const first = Array.from(r.children || []).find(el => el && (el.nodeName === 'TD' || el.nodeName === 'TH'));
                return first && first.nodeName === 'TH';
            });

            const rowBlocks = rows.map(r => {
                const cells = Array.from(r.children || []).filter(el => el && (el.nodeName === 'TD' || el.nodeName === 'TH'));
                const richCells = cells.map(cell => toNonEmptyCellRichText(parseInlineNodes(Array.from(cell.childNodes))));
                return {
                    object: "block",
                    type: "table_row",
                    table_row: { cells: richCells }
                };
            });

            const tableWidth = Math.max(1, ...rowBlocks.map(rb => rb.table_row.cells.length));

            return {
                object: "block",
                type: "table",
                table: {
                    table_width: tableWidth,
                    has_column_header: !!hasColumnHeader,
                    has_row_header: !!hasRowHeader,
                    children: rowBlocks
                }
            };
        }

        const flush = () => {
            if (!buf.length) return;
            const rt = parseInlineNodes(buf);
            // 如果 rt 为空 (比如buf里全是空格被过滤掉了)，则不生成 block，防止空行
            if (!rt.length) { buf.length = 0; return; }

            for (let i = 0; i < rt.length; i += 90) {
                blocks.push({
                    object: "block",
                    type: "paragraph",
                    paragraph: { rich_text: rt.slice(i, i + 90) }
                });
            }
            buf.length = 0;
        };

        Array.from(nodes).forEach(n => {
            if (['SCRIPT', 'STYLE', 'SVG'].includes(n.nodeName)) return;

            // [FIX] Convert tables as a single Notion table block
            if (n.nodeType === 1 && ['TABLE', 'TBODY', 'THEAD', 'TFOOT'].includes(n.nodeName)) {
                const tableEl = (n.nodeName === 'TABLE') ? n : (n.closest && n.closest('table'));
                if (tableEl && !processedTables.has(tableEl)) {
                    processedTables.add(tableEl);
                    flush();
                    const tblk = tableElementToNotionBlock(tableEl);
                    if (tblk) blocks.push(tblk);
                    return; // don't recurse into table children
                }
            }

            // [公式修复] 忽略 KaTeX 辅助元素
            if (n.classList && (n.classList.contains('katex-mathml') || n.classList.contains('katex-html'))) return;

            // [公式修复] 检测块级公式 (Block Equation)
            if (n.classList && n.classList.contains('katex-display')) {
                flush(); // 之前的文本存为一段
                const sourceNode = n.hasAttribute('data-latex-source') ? n : n.querySelector('[data-latex-source]');
                const latex = sourceNode ? sourceNode.getAttribute('data-latex-source') : null;

                if (latex) {
                    blocks.push({
                        object: "block",
                        type: "equation",
                        equation: { expression: latex }
                    });
                    return; // 跳过内部细节
                }
            }

            if (n.nodeType === 3 || ['B', 'I', 'CODE', 'SPAN', 'A', 'STRONG', 'EM'].includes(n.nodeName)) {
                // [公式修复] 如果是行内公式容器，推入 buf 交给 parseInlineNodes
                if (n.nodeName === 'SPAN' && n.hasAttribute('data-latex-source') && !n.classList.contains('katex-display')) {
                    buf.push(n);
                    return;
                }

                if (n.nodeName === 'A' && (n.hasAttribute('download') || n.href.includes('blob:'))) {
                    flush();
                    const fn = (n.innerText || 'file').trim();
                    blocks.push({ object: "block", type: "file", file: { type: "external", name: fn.slice(0, 60), external: { url: `${ASSET_PLACEHOLDER_PREFIX}${fn}::${n.href}` } } });
                    return;
                }
                buf.push(n);
                return;
            }

            if (n.nodeType === 1) {
                const t = n.tagName;
                if (t === 'P' || t === 'DIV' || t === 'BUTTON') {
                    flush();
                    blocks.push(...processNodesToBlocks(n.childNodes, seenImages));
                } else if (t === 'IMG') {
                    flush();
                    if (!n.className.includes('avatar') && n.src) {
                        if (n.src.startsWith('http')) {
                            if (!seenImages.has(n.src)) {
                                seenImages.add(n.src);
                                blocks.push({ object: "block", type: "image", image: { type: "external", external: { url: `${ASSET_PLACEHOLDER_PREFIX}image.png::${n.src}` } } });
                            }
                        } else {
                            blocks.push({ object: "block", type: "image", image: { type: "external", external: { url: `${ASSET_PLACEHOLDER_PREFIX}image.png::${n.src}` } } });
                        }
                    }
                } else if (t === 'PRE') {
                    flush();
                    const codeEl = n.querySelector('code');
                    const fullCode = codeEl ? codeEl.textContent : (n.textContent || "");

                    if (!fullCode.trim()) return;
                    const lang = detectLanguageRecursive(n);
                    const chunks = splitCodeSafe(fullCode);
                    const rt = chunks.map(c => ({ type: "text", text: { content: c } }));
                    blocks.push({ object: "block", type: "code", code: { rich_text: rt, language: lang } });
                } else if (/^H[1-6]$/.test(t)) {
                    flush();
                    const rich = parseInlineNodes(n.childNodes);
                    if (!rich.length) return;
                    const hLevel = t[1] < 4 ? t[1] : 3;
                    const hType = `heading_${hLevel}`;
                    blocks.push({ object: "block", type: hType, [hType]: { rich_text: rich } });
                } else if (t === 'BLOCKQUOTE') {
                    flush();
                    const rich = parseInlineNodes(n.childNodes);
                    if (!rich.length) return;
                    for (let i = 0; i < rich.length; i += 90) {
                        blocks.push({ object: "block", type: "quote", quote: { rich_text: rich.slice(i, i + 90) } });
                    }
                } else if (t === 'HR') {
                    flush();
                    blocks.push({ object: "block", type: "divider", divider: {} });
                } else if (t === 'UL' || t === 'OL') {
                    flush();
                    const tp = t === 'UL' ? 'bulleted_list_item' : 'numbered_list_item';
                    Array.from(n.children).forEach(li => {
                        if (li.tagName === 'LI') {
                            const rich = parseInlineNodes(li.childNodes);
                            if (!rich.length) return;
                            for (let i = 0; i < rich.length; i += 90) {
                                blocks.push({ object: "block", type: tp, [tp]: { rich_text: rich.slice(i, i + 90) } });
                            }
                        }
                    });
                } else if (t === 'TABLE') {
                    flush();
                    const rows = Array.from(n.querySelectorAll('tr'));
                    if (rows.length) {
                        const tb = { object: "block", type: "table", table: { table_width: 1, children: [] } };
                        let max = 0;
                        rows.forEach(r => {
                            const cs = Array.from(r.querySelectorAll('td,th'));
                            max = Math.max(max, cs.length);
                            const cells = cs.map(c => {
                                return [{ type: "text", text: { content: c.innerText.trim().slice(0, 1000) } }];
                            });
                            tb.table.children.push({
                                object: "block", type: "table_row",
                                table_row: { cells: cells }
                            });
                        });
                        tb.table.table_width = max;
                        blocks.push(tb);
                    }
                } else {
                    blocks.push(...processNodesToBlocks(n.childNodes, seenImages));
                }
            }
        });
        flush();
        return blocks;
    }

    // ------------------- 6. 导出 -------------------
    function getChatBlocks(targetTurns = null) {
        let turnsToProcess;
        if (targetTurns) {
            turnsToProcess = targetTurns;
        } else {
            turnsToProcess = getTurnWrappers();
        }

        const children = [];

        turnsToProcess.forEach(turn => {
            const role = getRoleFromWrapper(turn);
            const isUser = role === 'user';
            const label = isUser ? 'User' : 'ChatGPT';

            if (turn.getAttribute('data-privacy-skip') === 'true') {
                children.push({
                    object: "block", type: "callout",
                    callout: {
                        rich_text: [{ type: "text", text: { content: `🚫 此 ${label} 内容已标记为隐私，未导出。` }, annotations: { color: "gray", italic: true } }],
                        icon: { emoji: "🔒" }, color: "gray_background"
                    }
                });
                return;
            }

            children.push({
                object: "block", type: "heading_3",
                heading_3: { rich_text: [{ type: "text", text: { content: label } }], color: isUser ? "default" : "blue_background" }
            });

            const clone = turn.cloneNode(true);
            clone.querySelectorAll('.cgpt-tool-group').forEach(el => el.remove());

            children.push(...processNodesToBlocks(clone.childNodes, new Set()));
            children.push({ object: "block", type: "divider", divider: {} });
        });
        return children;
    }

    function getChatTitle(specificTurn = null) {
        const all = getTurnWrappers();
        const el = specificTurn || (all.find(t => getRoleFromWrapper(t) === 'user') || all[0]);
        return el ? el.innerText.replace(/\n/g, ' ').trim().slice(0, 60) : 'ChatGPT Chat';
    }

    function appendBlocksBatch(pageId, blocks, token, statusCallback, totalBlocks, sentBlocks) {
        if (!blocks.length) {
            statusCallback('✅ Saved!');
            setTimeout(() => statusCallback(null), 3000);
            return;
        }

        const batch = blocks.slice(0, NOTION_BLOCK_BATCH_SIZE);
        const remaining = blocks.slice(NOTION_BLOCK_BATCH_SIZE);
        const currentProgress = Math.round(((sentBlocks + batch.length) / totalBlocks) * 100);

        statusCallback(`💾 ${currentProgress}%...`);

        GM_xmlhttpRequest({
            method: 'PATCH',
            url: `https://api.notion.com/v1/blocks/${pageId}/children`,
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28' },
            data: JSON.stringify({ children: batch }),
            onload: (res) => {
                if (res.status === 200) {
                    setTimeout(() => {
                        appendBlocksBatch(pageId, remaining, token, statusCallback, totalBlocks, sentBlocks + batch.length);
                    }, NOTION_RATE_LIMIT_DELAY);
                } else {
                    console.error("Notion API Error:", res.responseText);
                    statusCallback(`❌ Error ${res.status}`);
                    alert(`Notion 写入失败: ${res.status}\n${res.responseText}`);
                }
            },
            onerror: () => {
                statusCallback('❌ Net Error');
                alert("网络请求失败");
            }
        });
    }

    function createPageAndUpload(title, blocks, token, dbId, statusCallback) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.notion.com/v1/pages',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28' },
            data: JSON.stringify({
                parent: { database_id: dbId },
                properties: {
                    'Name': { title: [{ text: { content: title } }] },
                    'Date': { date: { start: new Date().toISOString() } },
                    'URL': { url: location.href }
                },
                children: blocks.slice(0, NOTION_BLOCK_BATCH_SIZE)
            }),
            onload: (res) => {
                if (res.status === 200) {
                    const page = JSON.parse(res.responseText);
                    const remaining = blocks.slice(NOTION_BLOCK_BATCH_SIZE);
                    if (remaining.length > 0) {
                        setTimeout(() => {
                            appendBlocksBatch(page.id, remaining, token, statusCallback, blocks.length, NOTION_BLOCK_BATCH_SIZE);
                        }, NOTION_RATE_LIMIT_DELAY);
                    } else {
                        statusCallback('✅ Saved!');
                        setTimeout(() => statusCallback(null), 3000);
                    }
                } else {
                    statusCallback('❌ Fail'); alert(res.responseText);
                }
            },
            onerror: () => statusCallback('❌ Net Error')
        });
    }

    async function executeExport(blocks, title, btnOrLabel, iconElem) {
        const { token, dbId } = getConfig();
        if (!token || !dbId) { promptConfig(); return; }

        const updateStatus = (msg) => {
            if (btnOrLabel.classList && btnOrLabel.classList.contains('cgpt-icon-btn') && iconElem) {
                if (msg && msg.includes('Saved')) {
                    btnOrLabel.classList.remove('processing'); btnOrLabel.classList.add('success'); iconElem.textContent = '✅';
                    setTimeout(() => { btnOrLabel.classList.remove('success'); iconElem.textContent = '📤'; }, 2500);
                } else if (msg && (msg.includes('Fail') || msg.includes('Error'))) {
                    btnOrLabel.classList.remove('processing'); btnOrLabel.classList.add('error'); iconElem.textContent = '❌';
                } else if (msg) {
                    btnOrLabel.classList.add('processing'); btnOrLabel.classList.remove('success', 'error'); iconElem.textContent = '⏳';
                }
            } else if (btnOrLabel.id === 'chatgpt-saver-btn') {
                btnOrLabel.textContent = msg || '📥 Save to Notion';
            }
        };

        if (btnOrLabel.id === 'chatgpt-saver-btn') {
            btnOrLabel.classList.add('loading'); btnOrLabel.textContent = '🕵️ Processing...';
        } else updateStatus('Processing...');

        try {
            blocks = await processAssets(blocks, updateStatus);
            if (btnOrLabel.id === 'chatgpt-saver-btn') btnOrLabel.textContent = '💾 Saving...';
            createPageAndUpload(title, blocks, token, dbId, updateStatus);
        } catch (e) {
            console.error(e);
            if (btnOrLabel.id === 'chatgpt-saver-btn') btnOrLabel.textContent = '❌ Error';
            updateStatus('❌ Fail'); alert(e.message);
        } finally {
            if (btnOrLabel.id === 'chatgpt-saver-btn') btnOrLabel.classList.remove('loading');
        }
    }

    function handleFullExport() {
        const btn = document.getElementById('chatgpt-saver-btn');
        const blocks = getChatBlocks(null);
        if (!blocks.length) return alert('空对话');
        executeExport(blocks, getChatTitle(), btn);
    }

    function handleSingleExport(turnWrapper, iconBtn, iconElem) {
        const all = getTurnWrappers();
        const idx = all.indexOf(turnWrapper);
        if (idx === -1) return alert('未找到气泡');

        const targets = [turnWrapper];
        const role = getRoleFromWrapper(turnWrapper);

        if (role === 'user') {
            for (let i = idx + 1; i < all.length; i++) {
                const r = getRoleFromWrapper(all[i]);
                if (r === 'assistant') {
                    if (all[i].getAttribute('data-privacy-skip') !== 'true') targets.push(all[i]);
                    break;
                }
                if (r === 'user') break;
            }
        }
        const blocks = getChatBlocks(targets);
        if (!blocks.length) return alert('空内容');
        const title = getChatTitle(turnWrapper);
        executeExport(blocks, title, iconBtn, iconElem);
    }

    function tryInit() {
        if (!document.body) return;
        if (!document.getElementById('chatgpt-saver-btn')) {
            const btn = document.createElement('button');
            btn.id = 'chatgpt-saver-btn'; btn.textContent = '📥 Save to Notion'; btn.onclick = handleFullExport;
            document.body.appendChild(btn);
        }
        injectPerTurnControls();
    }
    setInterval(tryInit, 1500);
})();