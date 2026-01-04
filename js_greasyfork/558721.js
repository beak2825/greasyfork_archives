// ==UserScript==
// @name         Perplexity to Notion Exporter
// @namespace    http://tampermonkey.net/
// @version      2.9
// @license      MIT
// @description  Perplexity 导出至 Notion：智能图片归位 (支持 PicList/PicGo)+隐私开关+单个对话导出+多代码块列表修复
// @author       Wyih
// @match        https://www.perplexity.ai/*
// @connect      api.notion.com
// @connect      127.0.0.1
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558721/Perplexity%20to%20Notion%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/558721/Perplexity%20to%20Notion%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 基础配置 ---
    const PICLIST_URL = "http://127.0.0.1:36677/upload";
    const ASSET_PLACEHOLDER_PREFIX = "PICLIST_WAITING::";
    const MAX_TEXT_LENGTH = 2000;

    // 全局图片去重集合
    let processedImageUrls = new Set();

    // ------------------- 0. 环境自检 -------------------
    function checkPicListConnection() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://127.0.0.1:36677/heartbeat",
            timeout: 2000,
            onload: (res) => {
                if (res.status === 200) console.log("✅ PicList 连接正常");
            },
            onerror: () => console.error("❌ 无法连接到 PicList")
        });
    }
    setTimeout(checkPicListConnection, 3000);

    // ------------------- 1. 配置管理 -------------------
    function getConfig() {
        return {
            token: GM_getValue('notion_token', ''),
            dbId: GM_getValue('notion_db_id', '')
        };
    }
    function promptConfig() {
        const token = prompt('请输入 Notion Integration Secret:', GM_getValue('notion_token', ''));
        if (token) {
            const dbId = prompt('请输入 Notion Database ID:', GM_getValue('notion_db_id', ''));
            if (dbId) {
                GM_setValue('notion_token', token);
                GM_setValue('notion_db_id', dbId);
                alert('配置已保存');
            }
        }
    }
    GM_registerMenuCommand("⚙️ 设置 Notion Token", promptConfig);

    // ------------------- 2. UI 样式（Sticky + 灰显标识） -------------------
    GM_addStyle(`
    #perp-saver-btn {
      position: fixed; bottom: 20px; right: 20px; z-index: 9999;
      background-color: #20808D; color: white; border: none; border-radius: 6px;
      padding: 10px 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: sans-serif; font-weight: 600; font-size: 14px; transition: all 0.2s;
    }
    #perp-saver-btn:hover { background-color: #176570; transform: translateY(-2px); }
    #perp-saver-btn.loading { background-color: #666; cursor: wait; }

    .perp-tool-group-sticky {
      z-index: 9500;
      display: inline-flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      background: #fff;
      padding: 4px 8px;
      border-radius: 999px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.12);
      border: 1px solid #e5e7eb;
    }

    .perp-icon-btn {
      cursor: pointer;
      font-size: 16px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4b5563;
      transition: all 0.2s;
      user-select: none;
    }
    .perp-icon-btn:hover { background: rgba(0,0,0,0.06); color: #000; }
    .perp-privacy-toggle[data-skip="true"] { color: #dc2626; background: #fee2e2; }

    .perp-icon-btn.processing span { display: block; animation: spin 1s linear infinite; }
    .perp-icon-btn.success { color: #16a34a !important; background: #dcfce7; }
    .perp-icon-btn.error { color: #dc2626 !important; background: #fee2e2; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    /* hover 时显示工具条；标记隐藏时工具条常显 */
    .perp-query-bubble:hover .perp-tool-group-sticky,
    .perp-prose-wrap:hover .perp-tool-group-sticky,
    [data-skip-export="true"] .perp-tool-group-sticky { opacity: 1 !important; }

    /* sticky：问与答都采用同样定位 */
    .perp-query-bubble .perp-tool-group-sticky,
    .perp-prose-wrap .perp-tool-group-sticky {
      position: sticky;
      top: 14px;
      float: right;
      margin-left: 10px;
      margin-bottom: 10px;
    }

    /* 隐藏状态灰显 */
    [data-skip-export="true"] {
      opacity: 0.55;
      filter: grayscale(0.2);
    }
  `);

    // ------------------- 3. 资源处理（PicList 上传） -------------------
    function convertBlobImageToBuffer(blobUrl) {
        return new Promise((resolve, reject) => {
            const img = document.querySelector(`img[src="${blobUrl}"]`);
            if (!img || !img.complete || img.naturalWidth === 0) return reject("图片加载失败");
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                canvas.getContext('2d').drawImage(img, 0, 0);
                canvas.toBlob(b => b
                    ? b.arrayBuffer().then(buf => resolve({ buffer: buf, type: b.type }))
                    : reject("Canvas失败"),
                    'image/png'
                );
            } catch (e) {
                reject(e.message);
            }
        });
    }

    function fetchAssetAsArrayBuffer(url) {
        return new Promise((resolve, reject) => {
            if (url.startsWith('blob:')) {
                convertBlobImageToBuffer(url).then(resolve).catch(() => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url,
                        responseType: 'arraybuffer',
                        onload: r => r.status === 200
                            ? resolve({ buffer: r.response, type: 'application/octet-stream' })
                            : reject()
                    });
                });
                return;
            }
            GM_xmlhttpRequest({
                method: "GET",
                url,
                responseType: 'arraybuffer',
                onload: r => {
                    if (r.status === 200) {
                        const m = r.responseHeaders.match(/content-type:\s*(.*)/i);
                        resolve({ buffer: r.response, type: m ? m[1] : undefined });
                    } else reject();
                },
                onerror: () => reject()
            });
        });
    }

    function uploadToPicList(arrayBufferObj, filename) {
        return new Promise((resolve, reject) => {
            if (!arrayBufferObj.buffer) return reject("空文件");
            let finalFilename = filename.split('?')[0];
            const mime = (arrayBufferObj.type || '').split(';')[0].trim().toLowerCase();
            if (!finalFilename.includes('.') || finalFilename.length - finalFilename.lastIndexOf('.') > 6) {
                const mimeMap = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp' };
                if (mimeMap[mime]) finalFilename += mimeMap[mime];
            }
            const boundary = "----PerpSaverBoundary" + Math.random().toString(36).substring(2);
            const preData =
                `--${boundary}\r\n` +
                `Content-Disposition: form-data; name="file"; filename="${finalFilename.replace(/"/g, '')}"\r\n` +
                `Content-Type: ${mime || 'application/octet-stream'}\r\n\r\n`;
            const combinedBlob = new Blob([preData, arrayBufferObj.buffer, `\r\n--${boundary}--\r\n`]);

            GM_xmlhttpRequest({
                method: "POST",
                url: PICLIST_URL,
                headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
                data: combinedBlob,
                onload: (res) => {
                    try {
                        const r = JSON.parse(res.responseText);
                        r.success ? resolve(r.result[0]) : reject(r.message);
                    } catch (e) { reject(e.message); }
                },
                onerror: () => reject("网络错误")
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
            }
            if (urlObj) {
                const [_, name, realUrl] = urlObj.url.split('::');
                const task = fetchAssetAsArrayBuffer(realUrl)
                    .then(buf => uploadToPicList(buf, name))
                    .then(u => ({ i, url: u, name, ok: true }))
                    .catch(e => ({ i, err: e, name, ok: false }));
                tasks.push(task);
                map.set(i, b);
            }
        });

        if (tasks.length) {
            statusCallback(`⏳ Uploading ${tasks.length} images...`);
            const res = await Promise.all(tasks);
            res.forEach(r => {
                const blk = map.get(r.i);
                if (r.ok) {
                    blk.image.external.url = r.url;
                } else {
                    blk.type = "paragraph";
                    blk.paragraph = {
                        rich_text: [{
                            type: "text",
                            text: { content: `⚠️ Image Upload Failed: ${r.name}` },
                            annotations: { color: "red" }
                        }]
                    };
                    delete blk.image;
                }
            });
        }
        return blocks;
    }

    // ------------------- 4. DOM → Notion Blocks 解析（原逻辑保留） -------------------
    const NOTION_LANGUAGES = new Set([
        "bash", "c", "c++", "css", "go", "html", "java", "javascript", "json",
        "kotlin", "markdown", "php", "python", "ruby", "rust", "shell", "sql",
        "swift", "typescript", "yaml", "r", "plain text"
    ]);

    function mapLanguageToNotion(lang) {
        if (!lang) return "plain text";
        lang = lang.toLowerCase().trim();
        if (lang === "js") return "javascript";
        if (lang === "py") return "python";
        if (NOTION_LANGUAGES.has(lang)) return lang;
        return "plain text";
    }

    function splitCodeSafe(code) {
        const chunks = [];
        let remaining = code;
        while (remaining.length > 0) {
            if (remaining.length <= MAX_TEXT_LENGTH) {
                chunks.push(remaining);
                break;
            }
            let splitIndex = remaining.lastIndexOf('\n', MAX_TEXT_LENGTH - 1);
            if (splitIndex === -1) splitIndex = MAX_TEXT_LENGTH;
            else splitIndex += 1;
            chunks.push(remaining.slice(0, splitIndex));
            remaining = remaining.slice(splitIndex);
        }
        return chunks;
    }

    function parseInlineNodes(nodes) {
        const rt = [];
        function tr(n, s = {}) {
            if (n.nodeType === 3) { // Text
                const fullText = n.textContent;
                if (!fullText) return;

                if (/^[\s\uFEFF\xA0]+$/.test(fullText)) return;
                if (/^\[\d+\]$/.test(fullText.trim())) return;

                for (let i = 0; i < fullText.length; i += MAX_TEXT_LENGTH) {
                    rt.push({
                        type: "text",
                        text: { content: fullText.slice(i, i + MAX_TEXT_LENGTH), link: s.link },
                        annotations: {
                            bold: !!s.bold,
                            italic: !!s.italic,
                            code: !!s.code,
                            color: "default"
                        }
                    });
                }
            } else if (n.nodeType === 1) { // Element
                if (n.classList.contains('katex-mathml') || n.tagName === 'MJX-CONTAINER') return;
                if (n.classList.contains('katex-html')) {
                    n.childNodes.forEach(c => tr(c, s));
                    return;
                }

                const latex = n.getAttribute('data-latex-source') || n.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
                if (latex) {
                    rt.push({ type: "equation", equation: { expression: latex.trim() } });
                    return;
                }

                const ns = { ...s };
                if (['B', 'STRONG'].includes(n.tagName) || n.style.fontWeight > 500) ns.bold = true;
                if (['I', 'EM'].includes(n.tagName)) ns.italic = true;
                if (n.tagName === 'CODE') ns.code = true;
                if (n.tagName === 'A' && n.href) ns.link = { url: n.href };
                n.childNodes.forEach(c => tr(c, ns));
            }
        }
        nodes.forEach(n => tr(n));
        return rt;
    }

    function isEmptyRichText(rt) {
        if (!rt || rt.length === 0) return true;
        const allText = rt.map(t => t.text?.content || '').join('');
        return allText.replace(/[\s\uFEFF\xA0]+/g, '').length === 0;
    }

    function processNodesToBlocks(nodes) {
        const blocks = [], buf = [];
        const flush = () => {
            if (buf.length) {
                const rt = parseInlineNodes(buf);
                if (rt.length && !isEmptyRichText(rt)) {
                    blocks.push({
                        object: "block",
                        type: "paragraph",
                        paragraph: { rich_text: rt }
                    });
                }
                buf.length = 0;
            }
        };

        Array.from(nodes).forEach(n => {
            if (['SCRIPT', 'STYLE', 'SVG', 'NOSCRIPT'].includes(n.nodeName)) return;

            // 忽略 Sources / Related 区域
            if (n.nodeType === 1 && (
                (n.textContent || '').startsWith('Sources') ||
                (n.textContent || '').startsWith('Related') ||
                n.classList.contains('grid-cols-2')
            )) return;

            const isElement = n.nodeType === 1;

            // 块级公式
            if (isElement && (n.classList.contains('katex-display') || n.classList.contains('math-display'))) {
                const tex = n.querySelector('annotation[encoding="application/x-tex"]');
                if (tex) {
                    flush();
                    blocks.push({
                        object: "block",
                        type: "equation",
                        equation: { expression: tex.textContent.trim() }
                    });
                    return;
                }
            }

            // 行内内容缓冲
            if (n.nodeType === 3 || ['B', 'I', 'CODE', 'SPAN', 'A', 'STRONG', 'EM'].includes(n.nodeName)) {
                buf.push(n);
                return;
            }

            if (isElement) {
                flush();
                const t = n.tagName;

                // 空占位过滤
                if ((t === 'DIV' || t === 'P') && (n.innerText || '').trim().length === 0 && !n.querySelector('img')) {
                    return;
                }

                if (t === 'P' || t === 'DIV') {
                    if (n.querySelector('pre')) {
                        blocks.push(...processNodesToBlocks(n.childNodes));
                    } else {
                        const hasBlockChild = Array.from(n.children).some(c =>
                            ['P', 'DIV', 'UL', 'OL', 'H1', 'H2', 'H3', 'PRE', 'TABLE'].includes(c.tagName)
                        );
                        if (hasBlockChild) {
                            blocks.push(...processNodesToBlocks(n.childNodes));
                        } else {
                            const rt = parseInlineNodes(n.childNodes);
                            if (rt.length && !isEmptyRichText(rt)) {
                                blocks.push({
                                    object: "block",
                                    type: "paragraph",
                                    paragraph: { rich_text: rt }
                                });
                            }
                        }
                    }
                } else if (t === 'IMG') {
                    if (n.src && !n.src.includes('data:image/svg')) {
                        if (!processedImageUrls.has(n.src)) {
                            processedImageUrls.add(n.src);
                            blocks.push({
                                object: "block",
                                type: "image",
                                image: {
                                    type: "external",
                                    external: { url: `${ASSET_PLACEHOLDER_PREFIX}image.png::${n.src}` }
                                }
                            });
                        }
                    }
                } else if (t === 'PRE') {
                    const codeEl = n.querySelector('code');
                    const langMatch = (codeEl?.className || '').match(/language-([a-zA-Z0-9]+)/);
                    const language = mapLanguageToNotion(langMatch ? langMatch[1] : 'plain text');
                    const fullCode = n.textContent;
                    const rawChunks = splitCodeSafe(fullCode);
                    const codeRichText = rawChunks.map(c => ({ type: "text", text: { content: c } }));
                    blocks.push({
                        object: "block",
                        type: "code",
                        code: { rich_text: codeRichText, language }
                    });
                } else if (/^H[1-6]$/.test(t)) {
                    const level = t[1] < 4 ? t[1] : 3;
                    const hrt = parseInlineNodes(n.childNodes);
                    if (!isEmptyRichText(hrt)) {
                        blocks.push({
                            object: "block",
                            type: `heading_${level}`,
                            [`heading_${level}`]: { rich_text: hrt }
                        });
                    }
                } else if (t === 'UL' || t === 'OL') {
                    const tp = t === 'UL' ? 'bulleted_list_item' : 'numbered_list_item';
                    Array.from(n.children).forEach(li => {
                        if (li.tagName !== 'LI') return;
                        const liRT = parseInlineNodes(li.childNodes);
                        if (liRT.length && !isEmptyRichText(liRT)) {
                            blocks.push({
                                object: "block",
                                type: tp,
                                [tp]: { rich_text: liRT }
                            });
                        }
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
                                table_row: { cells: cs.map(c => parseInlineNodes(c.childNodes)) }
                            });
                        });
                        tb.table.table_width = max || 1;
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

    // ------------------- 5. 关键修复：以 prose 为锚点配对问答 -------------------

    function getThreadRootFromAny(el = null) {
        const candidates = [
            el?.closest?.('div.isolate'),
            el?.closest?.('div.max-w-threadContentWidth'),
            document.querySelector('div.isolate'),
            document.querySelector('div.max-w-threadContentWidth'),
            document.body
        ].filter(Boolean);

        for (const c of candidates) {
            try {
                if (c.querySelector('.group\\/query') && c.querySelector('.prose')) return c;
            } catch (_) { }
        }
        return document.body;
    }

    function getAllQueryAnchors(root) {
        return Array.from(root.querySelectorAll('.group\\/query'))
            .filter(el => (el.innerText || el.textContent || '').trim().length > 0);
    }

    function getQueryTextFromAnchor(queryAnchor) {
        if (!queryAnchor) return '';
        const t = queryAnchor.querySelector('.select-text');
        const raw = (t?.innerText || queryAnchor.innerText || queryAnchor.textContent || '').trim();
        return raw.replace(/Ask a follow up.*/i, '').trim();
    }

    function getAllProse(root) {
        return Array.from(root.querySelectorAll('.prose'));
    }

    function findNearestQueryBeforeProse(root, proseEl) {
        const queries = getAllQueryAnchors(root);
        let best = null;
        for (const q of queries) {
            const pos = q.compareDocumentPosition(proseEl);
            if (pos & Node.DOCUMENT_POSITION_FOLLOWING) best = q;
        }
        return best;
    }

    function findFirstProseAfterQuery(root, queryAnchor) {
        const proseList = getAllProse(root);
        for (const p of proseList) {
            const pos = queryAnchor.compareDocumentPosition(p);
            if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return p;
        }
        return null;
    }

    function notionCalloutUserHidden() {
        return {
            object: "block",
            type: "callout",
            callout: {
                rich_text: [{ type: "text", text: { content: "🔒 User 已隐藏（未导出）" } }],
                icon: { emoji: "🔒" },
                color: "gray_background"
            }
        };
    }

    function blocksFromUserText(text) {
        const blocks = [];
        if (!text) return blocks;
        blocks.push({
            object: "block",
            type: "heading_3",
            heading_3: {
                rich_text: [{ type: "text", text: { content: "User" } }],
                color: "default"
            }
        });
        blocks.push({
            object: "block",
            type: "paragraph",
            paragraph: { rich_text: [{ type: "text", text: { content: text } }] }
        });
        return blocks;
    }

    function blocksFromProse(proseEl) {
        const blocks = [];
        blocks.push({
            object: "block",
            type: "heading_3",
            heading_3: {
                rich_text: [{ type: "text", text: { content: "Perplexity" } }],
                color: "blue_background"
            }
        });
        const clone = proseEl.cloneNode(true);
        clone.querySelectorAll('.perp-tool-group-sticky, button, .grid.gap-2, .mt-4.grid').forEach(s => s.remove());
        blocks.push(...processNodesToBlocks(clone.childNodes));
        return blocks;
    }

    // 全量导出：遍历 prose；答隐藏直接跳过；问隐藏写 callout
    function getChatBlocksFull() {
        processedImageUrls = new Set();
        const blocks = [];
        const root = getThreadRootFromAny(null);

        const proseList = getAllProse(root);
        proseList.forEach(prose => {
            // 答案隐藏：全量跳过
            if (prose.getAttribute('data-skip-export') === 'true') return;

            const q = findNearestQueryBeforeProse(root, prose);
            const userSkipped = !!(q && q.getAttribute('data-skip-export') === 'true');
            const userText = (!userSkipped && q) ? getQueryTextFromAnchor(q) : '';

            // User 区块：未隐藏输出正文；隐藏输出 callout
            blocks.push({
                object: "block",
                type: "heading_3",
                heading_3: {
                    rich_text: [{ type: "text", text: { content: "User" } }],
                    color: "default"
                }
            });
            if (userSkipped) blocks.push(notionCalloutUserHidden());
            else if (userText) blocks.push(...blocksFromUserText(userText).slice(1)); // 复用 paragraph，仅跳过 heading

            // Perplexity 区块
            blocks.push(...blocksFromProse(prose));
            blocks.push({ object: "block", type: "divider", divider: {} });
        });

        return blocks;
    }

    // 单条导出：点答（prose）→ 前序问 + 当前答；问隐藏写 callout；答隐藏不导出
    function getChatBlocksSingleFromProse(proseEl) {
        processedImageUrls = new Set();
        const blocks = [];
        if (!proseEl) return blocks;
        if (proseEl.getAttribute('data-skip-export') === 'true') return blocks;

        const root = getThreadRootFromAny(proseEl);
        const q = findNearestQueryBeforeProse(root, proseEl);
        const userSkipped = !!(q && q.getAttribute('data-skip-export') === 'true');
        const userText = (!userSkipped && q) ? getQueryTextFromAnchor(q) : '';

        blocks.push({
            object: "block",
            type: "heading_3",
            heading_3: { rich_text: [{ type: "text", text: { content: "User" } }], color: "default" }
        });
        if (userSkipped) blocks.push(notionCalloutUserHidden());
        else if (userText) blocks.push({
            object: "block",
            type: "paragraph",
            paragraph: { rich_text: [{ type: "text", text: { content: userText } }] }
        });

        blocks.push(...blocksFromProse(proseEl));
        blocks.push({ object: "block", type: "divider", divider: {} });
        return blocks;
    }

    // 单条导出：点问（query）→ 当前问 + 后续第一个答；若答隐藏则只导出问
    function getChatBlocksSingleFromQueryAnchor(queryAnchor) {
        processedImageUrls = new Set();
        const blocks = [];
        if (!queryAnchor) return blocks;

        const root = getThreadRootFromAny(queryAnchor);
        const userText = getQueryTextFromAnchor(queryAnchor);
        const p = findFirstProseAfterQuery(root, queryAnchor);

        blocks.push(...blocksFromUserText(userText));

        if (p && p.getAttribute('data-skip-export') !== 'true') {
            blocks.push(...blocksFromProse(p));
        }

        blocks.push({ object: "block", type: "divider", divider: {} });
        return blocks;
    }

    // ------------------- 6. Sticky 工具条（问/答独立开关 + 单条导出触发） -------------------
    function makeToolGroup({ onTogglePrivacy, onSingleExport }) {
        const group = document.createElement('div');
        group.className = 'perp-tool-group-sticky';

        const privacyBtn = document.createElement('div');
        privacyBtn.className = 'perp-icon-btn perp-privacy-toggle';
        privacyBtn.title = "切换：是否导出此条内容";
        privacyBtn.setAttribute('data-skip', 'false');
        const privacyIcon = document.createElement('span');
        privacyIcon.textContent = '👁️';
        privacyBtn.appendChild(privacyIcon);

        privacyBtn.onclick = (e) => {
            e.stopPropagation();
            const isSkipping = privacyBtn.getAttribute('data-skip') === 'true';
            if (isSkipping) {
                privacyBtn.setAttribute('data-skip', 'false');
                privacyIcon.textContent = '👁️';
                onTogglePrivacy(false);
            } else {
                privacyBtn.setAttribute('data-skip', 'true');
                privacyIcon.textContent = '🚫';
                onTogglePrivacy(true);
            }
        };

        const singleExportBtn = document.createElement('div');
        singleExportBtn.className = 'perp-icon-btn';
        singleExportBtn.title = "单条导出";
        const exportIcon = document.createElement('span');
        exportIcon.textContent = '📤';
        singleExportBtn.appendChild(exportIcon);

        singleExportBtn.onclick = (e) => {
            e.stopPropagation();
            onSingleExport(singleExportBtn, exportIcon);
        };

        group.appendChild(privacyBtn);
        group.appendChild(singleExportBtn);
        return group;
    }

    function injectForAnswers() {
        const proseList = document.querySelectorAll('.prose');
        proseList.forEach((prose) => {
            const existingWrap = prose.closest('.perp-prose-wrap');
            if (existingWrap && existingWrap.querySelector('.perp-tool-group-sticky')) return;

            const wrap = document.createElement('div');
            wrap.className = 'perp-prose-wrap';
            wrap.style.position = 'relative';

            const parent = prose.parentNode;
            if (!parent) return;
            parent.insertBefore(wrap, prose);
            wrap.appendChild(prose);

            const group = makeToolGroup({
                onTogglePrivacy: (skip) => {
                    prose.setAttribute('data-skip-export', skip ? 'true' : 'false');
                    wrap.setAttribute('data-skip-export', skip ? 'true' : 'false');
                },
                onSingleExport: (iconBtn, iconElem) => {
                    handleSingleExportFromProse(prose, iconBtn, iconElem);
                }
            });

            wrap.prepend(group);
        });
    }

    function injectForQueries() {
        const queryAnchors = document.querySelectorAll('.group\\/query');
        queryAnchors.forEach((qa) => {
            const bubble = qa.querySelector('div.rounded-2xl') || qa;
            if (!bubble) return;

            if (bubble.querySelector('.perp-tool-group-sticky')) return;

            bubble.classList.add('perp-query-bubble');
            if (getComputedStyle(bubble).position === 'static') bubble.style.position = 'relative';

            const group = makeToolGroup({
                onTogglePrivacy: (skip) => {
                    qa.setAttribute('data-skip-export', skip ? 'true' : 'false');
                    bubble.setAttribute('data-skip-export', skip ? 'true' : 'false');
                },
                onSingleExport: (iconBtn, iconElem) => {
                    handleSingleExportFromQueryAnchor(qa, iconBtn, iconElem);
                }
            });

            bubble.appendChild(group);
        });
    }

    function injectPageControls() {
        injectForAnswers();
        injectForQueries();
    }

    // ------------------- 7. Notion 上传 -------------------
    function getPageTitle() {
        return document.title.replace(' - Perplexity', '') || "Perplexity Chat";
    }

    function appendBlocksBatch(pageId, blocks, token, statusCallback) {
        if (!blocks.length) {
            statusCallback('✅ Saved!');
            setTimeout(() => statusCallback(null), 3000);
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
            data: JSON.stringify({ children: blocks.slice(0, 90) }),
            onload: (res) => {
                if (res.status === 200) {
                    appendBlocksBatch(pageId, blocks.slice(90), token, statusCallback);
                } else {
                    console.error(res.responseText);
                    statusCallback('❌ Fail');
                }
            }
        });
    }

    function createPageAndUpload(title, blocks, token, dbId, statusCallback) {
        const props = {
            "Name": { title: [{ text: { content: title } }] },
            "Date": { date: { start: new Date().toISOString() } },
            "URL": { url: location.href }
        };

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
                properties: props,
                children: blocks.slice(0, 90)
            }),
            onload: (res) => {
                if (res.status === 200) {
                    const pageId = JSON.parse(res.responseText).id;
                    appendBlocksBatch(pageId, blocks.slice(90), token, statusCallback);
                } else {
                    statusCallback('❌ Fail');
                    alert(`Notion Error: ${res.responseText}`);
                }
            },
            onerror: () => statusCallback('❌ Net Error')
        });
    }

    // ------------------- 8. 导出主逻辑 -------------------
    async function executeExport(blocks, title, btnOrLabelUpdater, iconElem) {
        const { token, dbId } = getConfig();
        if (!token) return promptConfig();

        const updateStatus = (msg) => {
            if (btnOrLabelUpdater?.classList?.contains('perp-icon-btn') && iconElem) {
                if (msg?.includes('Saved')) {
                    btnOrLabelUpdater.classList.remove('processing');
                    btnOrLabelUpdater.classList.add('success');
                    iconElem.textContent = '✅';
                    setTimeout(() => {
                        btnOrLabelUpdater.classList.remove('success');
                        iconElem.textContent = '📤';
                    }, 2500);
                } else if (msg?.includes('Fail')) {
                    btnOrLabelUpdater.classList.remove('processing');
                    btnOrLabelUpdater.classList.add('error');
                    iconElem.textContent = '❌';
                } else if (msg) {
                    btnOrLabelUpdater.classList.add('processing');
                    iconElem.textContent = '⏳';
                }
            } else if (btnOrLabelUpdater?.id === 'perp-saver-btn') {
                btnOrLabelUpdater.textContent = msg === null ? '📥 Save to Notion' : msg;
            }
        };

        if (btnOrLabelUpdater?.id === 'perp-saver-btn') {
            btnOrLabelUpdater.classList.add('loading');
            btnOrLabelUpdater.textContent = '🕵️ Processing...';
        } else {
            updateStatus('Processing...');
        }

        try {
            blocks = await processAssets(blocks, updateStatus);
            if (btnOrLabelUpdater?.id === 'perp-saver-btn') btnOrLabelUpdater.textContent = '💾 Saving...';
            createPageAndUpload(title, blocks, token, dbId, updateStatus);
        } catch (e) {
            console.error(e);
            updateStatus('❌ Fail');
            alert(e.message);
        } finally {
            if (btnOrLabelUpdater?.id === 'perp-saver-btn') {
                btnOrLabelUpdater.classList.remove('loading');
            }
        }
    }

    function handleFullExport() {
        const btn = document.getElementById('perp-saver-btn');
        const blocks = getChatBlocksFull();

        let title = getPageTitle();
        try {
            const root = getThreadRootFromAny(null);
            const qs = getAllQueryAnchors(root);
            const first = qs.length ? getQueryTextFromAnchor(qs[0]) : '';
            if (first) title = first.slice(0, 50).replace(/\n/g, ' ') + "...";
        } catch (_) { }

        executeExport(blocks, title, btn);
    }

    function handleSingleExportFromProse(proseEl, iconBtn, iconElem) {
        if (!proseEl) return;
        if (proseEl.getAttribute('data-skip-export') === 'true') {
            alert('该回答已标记为不导出。');
            return;
        }
        const blocks = getChatBlocksSingleFromProse(proseEl);

        let title = getPageTitle();
        try {
            const root = getThreadRootFromAny(proseEl);
            const q = findNearestQueryBeforeProse(root, proseEl);
            const t = q ? getQueryTextFromAnchor(q) : '';
            if (t) title = t.slice(0, 50).replace(/\n/g, ' ') + "...";
        } catch (_) { }

        executeExport(blocks, title, iconBtn, iconElem);
    }

    function handleSingleExportFromQueryAnchor(queryAnchor, iconBtn, iconElem) {
        if (!queryAnchor) return;
        const blocks = getChatBlocksSingleFromQueryAnchor(queryAnchor);
        const t = getQueryTextFromAnchor(queryAnchor);
        const title = (t || getPageTitle()).slice(0, 50).replace(/\n/g, ' ') + "...";
        executeExport(blocks, title, iconBtn, iconElem);
    }

    // ------------------- 9. 初始化（定时注入） -------------------
    function tryInit() {
        if (!document.getElementById('perp-saver-btn')) {
            const btn = document.createElement('button');
            btn.id = 'perp-saver-btn';
            btn.textContent = '📥 Save to Notion';
            btn.onclick = handleFullExport;
            document.body.appendChild(btn);
        }
        injectPageControls();
    }

    setInterval(tryInit, 1200);

})();