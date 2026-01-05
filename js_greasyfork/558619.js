// ==UserScript==
// @name         Poe to Notion Exporter (with PicList)
// @namespace    https://github.com/wyih/poe-to-notion
// @version      0.1
// @description  导出 poe.com 聊天到 Notion，支持图片上传(PicList)+隐私开关+单条导出
// @author       Wyih
// @match        https://poe.com/*
// @connect      api.notion.com
// @connect      127.0.0.1
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558619/Poe%20to%20Notion%20Exporter%20%28with%20PicList%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558619/Poe%20to%20Notion%20Exporter%20%28with%20PicList%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============ 基本配置 ============
    const PICLIST_URL = "http://127.0.0.1:36677/upload";
    const ASSET_PLACEHOLDER_PREFIX = "PICLIST_WAITING::";
    const MAX_TEXT_LENGTH = 2000;

    // 简单语言判断
    const isZH = (navigator.language || navigator.userLanguage || '').startsWith('zh');
    const LABEL = isZH ? {
        saveAll: '📥 保存到 Notion',
        processing: '🕵️ 处理中...',
        saving: '💾 保存中...',
        done: '✅ 已保存',
        error: '❌ 出错',
        user: 'User',
        bot: 'Assistant',
        privacyOn: '👁️',
        privacyOff: '🚫',
        singleExportTitle: '仅导出此条对话（含紧随其后的回复）',
        configMenu: '⚙️ 设置 Notion Token/DB',
        privacyHint: '点击切换：是否导出此条内容',
    } : {
        saveAll: '📥 Save to Notion',
        processing: '🕵️ Processing...',
        saving: '💾 Saving...',
        done: '✅ Saved',
        error: '❌ Error',
        user: 'User',
        bot: 'Assistant',
        privacyOn: '👁️',
        privacyOff: '🚫',
        singleExportTitle: 'Export only this message (and following reply)',
        configMenu: '⚙️ Config Notion Token/DB',
        privacyHint: 'Toggle: export or skip this message',
    };

    // ============ 0. PicList 心跳检测 ============
    function checkPicListConnection() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://127.0.0.1:36677/heartbeat",
            timeout: 2000,
            onload: (res) => {
                if (res.status === 200) console.log("✅ PicList 连接正常");
            },
            onerror: () => console.warn("❌ PicList 未连接（可忽略，仅影响图片上传）")
        });
    }
    setTimeout(checkPicListConnection, 3000);

    // ============ 1. Notion 配置 ============
    function getConfig() {
        return {
            token: GM_getValue('poe_notion_token', ''),
            dbId: GM_getValue('poe_notion_db_id', '')
        };
    }

    function promptConfig() {
        const token = prompt('请输入 Notion Integration Secret:', GM_getValue('poe_notion_token', ''));
        if (token) {
            const dbId = prompt('请输入 Notion Database ID:', GM_getValue('poe_notion_db_id', ''));
            if (dbId) {
                GM_setValue('poe_notion_token', token);
                GM_setValue('poe_notion_db_id', dbId);
                alert('配置已保存 ✅');
            }
        }
    }
    GM_registerMenuCommand(LABEL.configMenu, promptConfig);

    // ============ 2. 样式 ============
    GM_addStyle(`
        #poe-notion-saver-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background-color: #0066CC;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 16px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: sans-serif;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
        }
        #poe-notion-saver-btn:hover { background-color: #0052a3; transform: translateY(-2px); }
        #poe-notion-saver-btn.loading { background-color: #666; cursor: wait; }

        .poe-message-bubble {
            position: relative; /* 确保绝对定位的工具条以气泡为参照 */
        }

        .poe-tool-group {
            z-index: 9500;
            display: flex;
            gap: 6px;
            opacity: 0;
            transition: opacity 0.15s ease-in-out;
            background: #fff;
            padding: 4px 6px;
            border-radius: 999px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.18);
            border: 1px solid rgba(0,0,0,0.06);
            position: absolute;
            top: -10px;   /* 稍微顶出气泡一点 */
            right: 8px;   /* 一律贴右上角 */
        }

        .poe-message-bubble:hover .poe-tool-group {
            opacity: 1;
        }

        .poe-tool-group .poe-icon-btn {
            cursor: pointer;
            font-size: 16px;
            line-height: 24px;
            user-select: none;
            width: 26px;
            height: 26px;
            text-align: center;
            border-radius: 50%;
            transition: background 0.15s, color 0.15s, transform 0.1s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #555;
        }
        .poe-tool-group .poe-icon-btn:hover {
            background: rgba(0,0,0,0.06);
            color: #000;
            transform: translateY(-1px);
        }
        .poe-tool-group .poe-privacy-toggle[data-skip="true"] {
            color: #d93025;
            background: #fce8e6;
        }
        .poe-icon-btn.processing { cursor: wait; color: #1a73e8; background: #e8f0fe; }
        .poe-icon-btn.success { color: #188038 !important; background: #e6f4ea; }
        .poe-icon-btn.error { color: #d93025 !important; background: #fce8e6; }
        .poe-tool-group .poe-icon-btn {
            cursor: pointer;
            font-size: 16px;
            line-height: 24px;
            user-select: none;
            width: 26px;
            height: 26px;
            text-align: center;
            border-radius: 50%;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #555;
        }
        .poe-tool-group .poe-icon-btn:hover {
            background: rgba(0,0,0,0.08);
            color: #000;
        }
        .poe-tool-group .poe-privacy-toggle[data-skip="true"] {
            color: #d93025;
            background: #fce8e6;
        }
        .poe-icon-btn.processing { cursor: wait; color: #1a73e8; background: #e8f0fe; }
        .poe-icon-btn.processing span { display: block; animation: spin 1s linear infinite; }
        .poe-icon-btn.success { color: #188038 !important; background: #e6f4ea; }
        .poe-icon-btn.error { color: #d93025 !important; background: #fce8e6; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `);

    // ============ 3. DOM 工具 & UI 注入 ============

    function injectMessageTools() {
        // 找到所有 Markdown 容器，再往上找“气泡”
        const markdownContainers = document.querySelectorAll('[class^="Markdown_markdownContainer"]');
        markdownContainers.forEach(container => {
            let bubble = container;
            while (bubble && !bubble.className.includes('MessageBubble')) {
                bubble = bubble.parentElement;
            }
            if (!bubble) return;

            // 标记方便样式控制
            if (!bubble.classList.contains('poe-message-bubble')) {
                bubble.classList.add('poe-message-bubble');
            }

            // 已经有工具栏就跳过
            if (bubble.querySelector('.poe-tool-group')) return;

            const group = document.createElement('div');
            group.className = 'poe-tool-group';

            // 隐私按钮
            const privacyBtn = document.createElement('div');
            privacyBtn.className = 'poe-icon-btn poe-privacy-toggle';
            privacyBtn.title = LABEL.privacyHint;
            privacyBtn.setAttribute('data-skip', 'false');
            const privacyIcon = document.createElement('span');
            privacyIcon.textContent = LABEL.privacyOn;
            privacyBtn.appendChild(privacyIcon);
            privacyBtn.onclick = (e) => {
                e.stopPropagation();
                const isSkipping = privacyBtn.getAttribute('data-skip') === 'true';
                if (isSkipping) {
                    privacyBtn.setAttribute('data-skip', 'false');
                    privacyIcon.textContent = LABEL.privacyOn;
                    bubble.setAttribute('data-privacy-skip', 'false');
                } else {
                    privacyBtn.setAttribute('data-skip', 'true');
                    privacyIcon.textContent = LABEL.privacyOff;
                    bubble.setAttribute('data-privacy-skip', 'true');
                }
            };

            // 单条导出按钮
            const singleBtn = document.createElement('div');
            singleBtn.className = 'poe-icon-btn';
            singleBtn.title = LABEL.singleExportTitle;
            const exportIcon = document.createElement('span');
            exportIcon.textContent = '📤';
            singleBtn.appendChild(exportIcon);
            singleBtn.onclick = (e) => {
                e.stopPropagation();
                handleSingleExport(bubble, singleBtn, exportIcon);
            };

            group.appendChild(privacyBtn);
            group.appendChild(singleBtn);

            // 插在 bubble 顶部
            bubble.insertBefore(group, bubble.firstChild);
        });
    }

    // ============ 4. 资源处理（PicList 上传） ============

    function convertBlobImageToBuffer(blobUrl) {
        return new Promise((resolve, reject) => {
            const img = document.querySelector(`img[src="${blobUrl}"]`);
            if (!img || !img.complete || img.naturalWidth === 0) return reject("图片加载失败");
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                canvas.getContext('2d').drawImage(img, 0, 0);
                canvas.toBlob(b => {
                    if (!b) return reject("Canvas 失败");
                    b.arrayBuffer().then(buf => resolve({ buffer: buf, type: b.type }));
                }, 'image/png');
            } catch (e) { reject(e.message); }
        });
    }

    function fetchAssetAsArrayBuffer(url) {
        return new Promise((resolve, reject) => {
            if (url.startsWith('blob:')) {
                convertBlobImageToBuffer(url)
                    .then(resolve)
                    .catch(() => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url,
                            responseType: 'arraybuffer',
                            onload: r => {
                                if (r.status === 200) {
                                    resolve({
                                        buffer: r.response,
                                        type: 'application/octet-stream'
                                    });
                                } else reject("blob fetch fail");
                            }
                        });
                    });
            } else {
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    responseType: 'arraybuffer',
                    onload: r => {
                        if (r.status === 200) {
                            const m = r.responseHeaders.match(/content-type:\s*(.*)/i);
                            resolve({ buffer: r.response, type: m ? m[1] : undefined });
                        } else reject("http fetch fail");
                    }
                });
            }
        });
    }

    function uploadToPicList(obj, filename) {
        return new Promise((resolve, reject) => {
            if (!obj.buffer) return reject("空文件");
            let finalFilename = filename.split('?')[0];
            const mime = (obj.type || '').split(';')[0].trim().toLowerCase();
            if (!finalFilename.includes('.') || finalFilename.length - finalFilename.lastIndexOf('.') > 6) {
                const mimeMap = {
                    'application/pdf': '.pdf',
                    'application/msword': '.doc',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
                    'image/png': '.png',
                    'image/jpeg': '.jpg',
                    'image/webp': '.webp'
                };
                if (mimeMap[mime]) finalFilename += mimeMap[mime];
            }
            const boundary = "----PoeNotionBoundary" + Math.random().toString(36).substring(2);
            const preData =
                `--${boundary}\r\n` +
                `Content-Disposition: form-data; name="file"; filename="${finalFilename.replace(/"/g, '')}"\r\n` +
                `Content-Type: ${mime || 'application/octet-stream'}\r\n\r\n`;
            const blob = new Blob([preData, obj.buffer, `\r\n--${boundary}--\r\n`]);

            GM_xmlhttpRequest({
                method: "POST",
                url: PICLIST_URL,
                headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
                data: blob,
                onload: (res) => {
                    try {
                        const r = JSON.parse(res.responseText);
                        if (r.success && r.result && r.result[0]) resolve(r.result[0]);
                        else reject(r.message || 'PicList error');
                    } catch (e) { reject(e.message); }
                },
                onerror: () => reject("PicList 网络错误")
            });
        });
    }

    async function processAssets(blocks, statusCallback) {
        const tasks = [];
        const map = new Map();

        blocks.forEach((b, i) => {
            let urlObj = null;
            if (b.type === 'image' && b.image?.external?.url?.startsWith(ASSET_PLACEHOLDER_PREFIX)) {
                urlObj = b.image.external;
            } else if (b.type === 'file' && b.file?.external?.url?.startsWith(ASSET_PLACEHOLDER_PREFIX)) {
                urlObj = b.file.external;
            }
            if (!urlObj) return;

            const [_, name, realUrl] = urlObj.url.split('::');

            if (realUrl.startsWith('blob:') && b.type === 'file') {
                // 文件 + blob：放弃上传，改为文本提示
                b.type = "paragraph";
                b.paragraph = {
                    rich_text: [{
                        type: "text",
                        text: { content: `📄 [本地文件未上传] ${name}` },
                        annotations: { color: "gray", italic: true }
                    }]
                };
                delete b.file;
                return;
            }

            const task = fetchAssetAsArrayBuffer(realUrl)
                .then(buf => uploadToPicList(buf, name))
                .then(u => ({ i, url: u, name, ok: true }))
                .catch(e => ({ i, err: e, name, ok: false }));

            tasks.push(task);
            map.set(i, b);
        });

        if (tasks.length) {
            statusCallback(`⏳ Uploading ${tasks.length}...`);
            const res = await Promise.all(tasks);
            res.forEach(r => {
                const blk = map.get(r.i);
                if (!blk) return;
                if (r.ok) {
                    if (blk.type === 'image') {
                        blk.image.external.url = r.url;
                    } else if (blk.type === 'file') {
                        blk.file.external.url = r.url;
                        blk.file.name = r.name || "File";
                    }
                } else {
                    console.error('Upload fail', r.name, r.err);
                    blk.type = "paragraph";
                    blk.paragraph = {
                        rich_text: [{
                            type: "text",
                            text: { content: `⚠️ Upload Failed: ${r.name}` },
                            annotations: { color: "red" }
                        }]
                    };
                    delete blk.image;
                    delete blk.file;
                }
            });
        }
        return blocks;
    }

    // ============ 5. DOM→Notion 解析 ============

    const NOTION_LANGUAGES = new Set([
        "bash", "c", "c++", "css", "go", "html", "java", "javascript",
        "json", "kotlin", "markdown", "php", "python", "ruby", "rust",
        "shell", "sql", "swift", "typescript", "yaml", "r", "plain text"
    ]);

    function mapLanguageToNotion(lang) {
        if (!lang) return "plain text";
        lang = lang.toLowerCase().trim();
        if (lang === "js") return "javascript";
        if (lang === "py") return "python";
        if (NOTION_LANGUAGES.has(lang)) return lang;
        return "plain text";
    }

    function detectLanguageFromPre(preNode) {
        const code = preNode.querySelector('code');
        if (code && code.className) {
            const m = code.className.match(/language-([\w-]+)/);
            if (m) return mapLanguageToNotion(m[1]);
        }
        return "plain text";
    }

    function splitTextSafe(text) {
        const chunks = [];
        let remaining = text;
        while (remaining.length > 0) {
            if (remaining.length <= MAX_TEXT_LENGTH) {
                chunks.push(remaining);
                break;
            }
            let idx = remaining.lastIndexOf('\n', MAX_TEXT_LENGTH - 1);
            if (idx === -1) idx = MAX_TEXT_LENGTH;
            else idx += 1;
            chunks.push(remaining.slice(0, idx));
            remaining = remaining.slice(idx);
        }
        return chunks;
    }

    function parseInlineNodes(nodes) {
        const rt = [];
        function tr(n, s = {}) {
            if (n.nodeType === 3) {
                const full = n.textContent;
                if (!full) return;
                for (let i = 0; i < full.length; i += MAX_TEXT_LENGTH) {
                    rt.push({
                        type: "text",
                        text: { content: full.slice(i, i + MAX_TEXT_LENGTH), link: s.link },
                        annotations: {
                            bold: !!s.bold,
                            italic: !!s.italic,
                            code: !!s.code,
                            color: "default"
                        }
                    });
                }
            } else if (n.nodeType === 1) {
                const latex = n.getAttribute('data-latex-source') || n.getAttribute('data-math');
                if (latex) {
                    rt.push({
                        type: "equation",
                        equation: { expression: latex.trim() }
                    });
                    return;
                }
                const ns = { ...s };
                if (['B', 'STRONG'].includes(n.tagName)) ns.bold = true;
                if (['I', 'EM'].includes(n.tagName)) ns.italic = true;
                if (n.tagName === 'CODE') ns.code = true;
                if (n.tagName === 'A') ns.link = { url: n.href };
                n.childNodes.forEach(c => tr(c, ns));
            }
        }
        nodes.forEach(n => tr(n));
        return rt;
    }

    function processNodesToBlocks(nodes) {
        const blocks = [];
        const buf = [];

        const flush = () => {
            if (!buf.length) return;
            const rt = parseInlineNodes(buf);
            if (rt.length) {
                blocks.push({
                    object: "block",
                    type: "paragraph",
                    paragraph: { rich_text: rt }
                });
            }
            buf.length = 0;
        };

        const fileExtRegex = /\.(pdf|zip|docx?|xlsx?|pptx?|csv|txt|md|html?|rar|7z|tar|gz|iso|exe|apk|dmg|json|xml|epub|R|Rmd|qmd)(\?|$)/i;

        Array.from(nodes).forEach(n => {
            if (['SCRIPT', 'STYLE', 'SVG'].includes(n.nodeName)) return;

            const isElement = n.nodeType === 1;

            // 块级公式
            if (isElement) {
                const isMathTag = n.hasAttribute('data-math') || n.hasAttribute('data-latex-source');
                const isBlockLayout =
                    n.tagName === 'DIV' ||
                    n.classList.contains('math-block') ||
                    n.classList.contains('katex-display');

                if (isMathTag && isBlockLayout) {
                    const latex = n.getAttribute('data-latex-source') || n.getAttribute('data-math');
                    if (latex) {
                        flush();
                        blocks.push({
                            object: "block",
                            type: "equation",
                            equation: { expression: latex.trim() }
                        });
                        return;
                    }
                }
            }

            // 行内缓冲
            if (
                n.nodeType === 3 ||
                ['B', 'I', 'CODE', 'SPAN', 'A', 'STRONG', 'EM'].includes(n.nodeName)
            ) {
                if (
                    isElement &&
                    n.tagName === 'A' &&
                    (n.hasAttribute('download') ||
                        (n.href && (n.href.includes('blob:') || fileExtRegex.test(n.href))))
                ) {
                    flush();
                    const fn = (n.innerText || 'file').trim();
                    blocks.push({
                        object: "block",
                        type: "file",
                        file: {
                            type: "external",
                            name: fn.slice(0, 60),
                            external: { url: `${ASSET_PLACEHOLDER_PREFIX}${fn}::${n.href}` }
                        }
                    });
                    return;
                }
                buf.push(n);
                return;
            }

            if (isElement) {
                flush();
                const t = n.tagName;

                if (t === 'P') {
                    blocks.push(...processNodesToBlocks(n.childNodes));
                } else if (t === 'IMG') {
                    if (n.src) {
                        blocks.push({
                            object: "block",
                            type: "image",
                            image: {
                                type: "external",
                                external: {
                                    url: `${ASSET_PLACEHOLDER_PREFIX}image.png::${n.src}`
                                }
                            }
                        });
                    }
                } else if (t === 'PRE') {
                    const codeText = n.textContent || '';
                    const lang = detectLanguageFromPre(n);
                    const chunks = splitTextSafe(codeText);
                    const rich = chunks.map(c => ({
                        type: "text",
                        text: { content: c }
                    }));
                    blocks.push({
                        object: "block",
                        type: "code",
                        code: { rich_text: rich, language: lang }
                    });
                } else if (/^H[1-6]$/.test(t)) {
                    const level = t[1] < 4 ? t[1] : 3;
                    blocks.push({
                        object: "block",
                        type: `heading_${level}`,
                        [`heading_${level}`]: { rich_text: parseInlineNodes(n.childNodes) }
                    });
                } else if (t === 'BLOCKQUOTE') {
                    blocks.push({
                        object: "block",
                        type: "quote",
                        quote: { rich_text: parseInlineNodes(n.childNodes) }
                    });
                } else if (t === 'UL' || t === 'OL') {
                    const tp = t === 'UL' ? 'bulleted_list_item' : 'numbered_list_item';
                    Array.from(n.children).forEach(li => {
                        if (li.tagName !== 'LI') return;
                        const liBlocks = processNodesToBlocks(li.childNodes);
                        if (!liBlocks.length) return;

                        let richText;
                        let children = [];
                        const first = liBlocks[0];

                        if (first.type === 'paragraph' && first.paragraph?.rich_text?.length) {
                            richText = first.paragraph.rich_text;
                            children = liBlocks.slice(1);
                        } else {
                            richText = parseInlineNodes(li.childNodes);
                            children = liBlocks;
                        }

                        const listBlock = {
                            object: "block",
                            type: tp,
                            [tp]: { rich_text: richText }
                        };
                        if (children.length) {
                            listBlock[tp].children = children;
                        }
                        blocks.push(listBlock);
                    });
                } else if (t === 'TABLE') {
                    const rows = Array.from(n.querySelectorAll('tr'));
                    if (rows.length) {
                        const tb = {
                            object: "block",
                            type: "table",
                            table: { table_width: 1, children: [] }
                        };
                        let max = 0;
                        rows.forEach(r => {
                            const cs = Array.from(r.querySelectorAll('td,th'));
                            max = Math.max(max, cs.length);
                            tb.table.children.push({
                                object: "block",
                                type: "table_row",
                                table_row: {
                                    cells: cs.map(c => parseInlineNodes(c.childNodes))
                                }
                            });
                        });
                        tb.table.table_width = max;
                        blocks.push(tb);
                    }
                } else {
                    blocks.push(...processNodesToBlocks(n.childNodes));
                }
            }
        });

        flush();
        return blocks;
    }

    // ============ 6. 从 Poe 抓取消息 → Notion blocks ============

    function getRoleFromBubble(bubble) {
        // 沿用你原 exporter 的逻辑：看 leftSide/rightSide
        let p = bubble;
        while (p && p !== document.body) {
            if (p.className && p.className.includes('leftSide')) return LABEL.bot;
            if (p.className && p.className.includes('rightSide')) return LABEL.user;
            p = p.parentElement;
        }
        // 兜底：如果包含 right/left 文本
        const cls = bubble.className || '';
        if (cls.includes('right')) return LABEL.user;
        return LABEL.bot;
    }

    function getAllMessageBubbles() {
        const list = [];
        const markdownContainers = document.querySelectorAll('[class^="Markdown_markdownContainer"]');
        markdownContainers.forEach(container => {
            let bubble = container;
            while (bubble && !bubble.className.includes('MessageBubble')) {
                bubble = bubble.parentElement;
            }
            if (!bubble) return;
            if (!list.includes(bubble)) list.push(bubble);
        });
        return list;
    }

    function getChatBlocksFromBubbles(targetBubbles = null) {
        const bubbles = targetBubbles || getAllMessageBubbles();
        const blocks = [];

        bubbles.forEach(bubble => {
            const skip = bubble.getAttribute('data-privacy-skip') === 'true';
            const role = getRoleFromBubble(bubble);

            // 隐私：直接放一个 callout + divider
            if (skip) {
                blocks.push({
                    object: "block",
                    type: "callout",
                    callout: {
                        rich_text: [{
                            type: "text",
                            text: {
                                content: (isZH
                                    ? `🚫 此 ${role} 内容已标记为隐私，未导出。`
                                    : `🚫 This ${role} message is marked as private and not exported.`)
                            },
                            annotations: { color: "gray", italic: true }
                        }],
                        icon: { emoji: "🔒" },
                        color: "gray_background"
                    }
                });
                blocks.push({ object: "block", type: "divider", divider: {} });
                return;
            }

            // 1) 角色标题（User / Assistant）
            blocks.push({
                object: "block",
                type: "heading_3",
                heading_3: {
                    rich_text: [{ type: "text", text: { content: role } }]
                }
            });

            // 2) 文本部分（markdown）
            const container = bubble.querySelector('[class^="Markdown_markdownContainer"]');
            if (container) {
                const clone = container.cloneNode(true);
                // 防守：清理我们自己的工具条（虽然一般不在这里）
                clone.querySelectorAll('.poe-tool-group').forEach(e => e.remove());
                blocks.push(...processNodesToBlocks(clone.childNodes));
            } else {
                const text = bubble.innerText || '';
                if (text.trim()) {
                    blocks.push({
                        object: "block",
                        type: "paragraph",
                        paragraph: {
                            rich_text: [{
                                type: "text",
                                text: { content: text.slice(0, MAX_TEXT_LENGTH) }
                            }]
                        }
                    });
                }
            }

            // 3) markdown 内嵌图片（包括 GPT-Image / Seedream 生成的图）
            // 说明：因为我们在 processNodesToBlocks 里把 SPAN 当作“行内节点”，
            // 不会往下递归到 <img>，所以这里额外扫一次 markdown 里的 img。
            const markdownImgs = bubble.querySelectorAll(
                '.Markdown_markdownContainer__Tz3HQ img'
            );
            markdownImgs.forEach(img => {
                const url = img.src;
                if (!url) return;

                let name = 'image.png';
                try {
                    const u = new URL(url);
                    const pathname = u.pathname || '';
                    const base = pathname.split('/').pop() || '';
                    if (base) {
                        const qIdx = base.indexOf('.');
                        name = qIdx > -1 ? base.slice(0, qIdx) + base.slice(qIdx) : base;
                    }
                } catch (_) {}

                blocks.push({
                    object: "block",
                    type: "image",
                    image: {
                        type: "external",
                        external: {
                            url: `${ASSET_PLACEHOLDER_PREFIX}${name || 'image.png'}::${url}`
                        }
                    }
                });
            });

            // 4) 附件图片（用户上传的 Attachments_attachments__x_H2Q）
            const attachmentImgs = bubble.querySelectorAll('.Attachments_attachments__x_H2Q img');
            attachmentImgs.forEach(img => {
                const url = img.src;
                if (!url) return;

                let name = 'image.png';
                try {
                    const u = new URL(url);
                    const pathname = u.pathname || '';
                    const base = pathname.split('/').pop() || '';
                    if (base) {
                        const qIdx = base.indexOf('.');
                        name = qIdx > -1 ? base.slice(0, qIdx) + base.slice(qIdx) : base;
                    }
                } catch (_) {}

                blocks.push({
                    object: "block",
                    type: "image",
                    image: {
                        type: "external",
                        external: {
                            url: `${ASSET_PLACEHOLDER_PREFIX}${name || 'image.png'}::${url}`
                        }
                    }
                });
            });

            // 5) 每条气泡之后加 divider
            blocks.push({ object: "block", type: "divider", divider: {} });
        });

        return blocks;
    }

    function getChatTitleFromFirstBubble() {
        const bubbles = getAllMessageBubbles();
        if (!bubbles.length) return 'Poe Chat';
        const first = bubbles[0];
        const text = (first.innerText || '').replace(/\s+/g, ' ').trim();
        return text ? text.slice(0, 60) : 'Poe Chat';
    }

    // ============ 7. Notion 上传 ============

    function appendBlocksBatch(pageId, blocks, token, statusCallback) {
        if (!blocks.length) {
            statusCallback(LABEL.done);
            setTimeout(() => statusCallback(null), 2500);
            return;
        }
        GM_xmlhttpRequest({
            method: "PATCH",
            url: `https://api.notion.com/v1/blocks/${pageId}/children`,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Notion-Version": "2022-06-28"
            },
            data: JSON.stringify({
                children: blocks.slice(0, 90)
            }),
            onload: (res) => {
                if (res.status === 200) {
                    appendBlocksBatch(pageId, blocks.slice(90), token, statusCallback);
                } else {
                    console.error(res.responseText);
                    statusCallback(LABEL.error);
                }
            },
            onerror: () => statusCallback(LABEL.error)
        });
    }

    function createPageAndUpload(title, blocks, token, dbId, statusCallback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.notion.com/v1/pages",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Notion-Version": "2022-06-28"
            },
            data: JSON.stringify({
                parent: { database_id: dbId },
                properties: {
                    "Name": { title: [{ text: { content: title } }] },
                    "Date": { date: { start: new Date().toISOString() } },
                    "URL": { url: location.href }
                },
                children: blocks.slice(0, 90)
            }),
            onload: (res) => {
                if (res.status === 200) {
                    const pageId = JSON.parse(res.responseText).id;
                    appendBlocksBatch(pageId, blocks.slice(90), token, statusCallback);
                } else {
                    console.error(res.responseText);
                    statusCallback(LABEL.error);
                    alert(res.responseText);
                }
            },
            onerror: () => statusCallback(LABEL.error)
        });
    }

    // ============ 8. 导出主逻辑 ============

    async function executeExport(blocks, title, btnOrLabelUpdater, iconElem) {
        const { token, dbId } = getConfig();
        if (!token || !dbId) {
            promptConfig();
            return;
        }

        const isGlobalBtn = btnOrLabelUpdater && btnOrLabelUpdater.id === 'poe-notion-saver-btn';

        const updateStatus = (msg) => {
            if (!btnOrLabelUpdater) return;

            if (btnOrLabelUpdater.classList && btnOrLabelUpdater.classList.contains('poe-icon-btn') && iconElem) {
                if (msg && msg.includes('Saved')) {
                    btnOrLabelUpdater.classList.remove('processing');
                    btnOrLabelUpdater.classList.add('success');
                    iconElem.textContent = '✅';
                    setTimeout(() => {
                        btnOrLabelUpdater.classList.remove('success');
                        iconElem.textContent = '📤';
                    }, 2000);
                } else if (msg && (msg.includes('Fail') || msg.includes('Error') || msg.includes('错'))) {
                    btnOrLabelUpdater.classList.remove('processing');
                    btnOrLabelUpdater.classList.add('error');
                    iconElem.textContent = '❌';
                } else if (msg) {
                    btnOrLabelUpdater.classList.add('processing');
                    btnOrLabelUpdater.classList.remove('success', 'error');
                    iconElem.textContent = '⏳';
                }
            } else if (isGlobalBtn) {
                if (msg === null) btnOrLabelUpdater.textContent = LABEL.saveAll;
                else btnOrLabelUpdater.textContent = msg;
            }
        };

        if (isGlobalBtn) {
            btnOrLabelUpdater.classList.add('loading');
            btnOrLabelUpdater.textContent = LABEL.processing;
        } else if (btnOrLabelUpdater && iconElem) {
            updateStatus('Processing...');
        }

        try {
            blocks = await processAssets(blocks, updateStatus);
            if (isGlobalBtn) btnOrLabelUpdater.textContent = LABEL.saving;
            createPageAndUpload(title, blocks, token, dbId, updateStatus);
        } catch (e) {
            console.error(e);
            if (isGlobalBtn) btnOrLabelUpdater.textContent = LABEL.error;
            if (btnOrLabelUpdater && iconElem) updateStatus(LABEL.error);
            alert(e.message || e);
        } finally {
            if (isGlobalBtn) btnOrLabelUpdater.classList.remove('loading');
        }
    }

    function handleFullExport() {
        const btn = document.getElementById('poe-notion-saver-btn');
        const blocks = getChatBlocksFromBubbles(null);
        executeExport(blocks, getChatTitleFromFirstBubble(), btn);
    }

    function handleSingleExport(bubble, iconBtn, iconElem) {
        const bubbles = getAllMessageBubbles();
        const idx = bubbles.indexOf(bubble);
        const targets = [];
        if (idx >= 0) {
            targets.push(bubble);
            // 如果下一条是对方的回复，也一起导出（类似 Gemini 逻辑）
            if (idx + 1 < bubbles.length) {
                const next = bubbles[idx + 1];
                if (next.getAttribute('data-privacy-skip') !== 'true') {
                    targets.push(next);
                }
            }
        } else {
            targets.push(bubble);
        }
        const blocks = getChatBlocksFromBubbles(targets);
        const title = (bubble.innerText || '').replace(/\s+/g, ' ').slice(0, 60) || getChatTitleFromFirstBubble();
        executeExport(blocks, title, iconBtn, iconElem);
    }

    function tryInit() {
        if (!document.getElementById('poe-notion-saver-btn')) {
            const btn = document.createElement('button');
            btn.id = 'poe-notion-saver-btn';
            btn.textContent = LABEL.saveAll;
            btn.onclick = handleFullExport;
            document.body.appendChild(btn);
        }
        injectMessageTools();
    }

    setInterval(tryInit, 1500);

})();