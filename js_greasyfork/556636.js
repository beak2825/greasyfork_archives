// ==UserScript==
// @name         Gemini to Notion Exporter
// @namespace    http://tampermonkey.net/
// @version      13.9
// @license      MIT
// @description  Gemini 导出：智能图片去水印后归位 (支持 PicList/PicGo)+隐私开关+单个对话导出+多代码块列表修复
// @author       Wyih with Gemini Thought Partner
// @match        https://gemini.google.com/*
// @connect      api.notion.com
// @connect      127.0.0.1
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556636/Gemini%20to%20Notion%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/556636/Gemini%20to%20Notion%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 基础配置 ---
    const PICLIST_URL = "http://127.0.0.1:36677/upload";
    const ASSET_PLACEHOLDER_PREFIX = "PICLIST_WAITING::";
    const MAX_TEXT_LENGTH = 2000;
    // =========================================================================
    // 🧱 资源处理与去水印增强版 (内嵌资源版)
    // =========================================================================

    // --- 1. 内嵌遮罩资源 (Base64) ---
    // 请将下面的 "..." 替换为实际的 Base64 字符串
    const MASK_48_DATA = "data:image/png;base64,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";    
    const MASK_96_DATA = "data:image/png;base64,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";
    
    let maskCache = { 48: null, 96: null };

    // --- 2. 加载遮罩 (从 Base64 读取) ---
    function loadMask(size) {
        return new Promise((resolve, reject) => {
            if (maskCache[size]) return resolve(maskCache[size]);
            
            // 直接读取常量，不再发起网络请求
            const dataUri = size === 96 ? MASK_96_DATA : MASK_48_DATA;

            // fetch 支持 data: 协议，可以直接把 Base64 转为 Blob
            fetch(dataUri)
                .then(res => res.blob())
                .then(blob => createImageBitmap(blob))
                .then(bmp => {
                    const canvas = document.createElement('canvas');
                    canvas.width = size; canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(bmp, 0, 0);
                    
                    const data = ctx.getImageData(0, 0, size, size).data;
                    // 预处理 Alpha Map
                    const alphaMap = new Float32Array(data.length / 4);
                    for (let i = 0; i < alphaMap.length; i++) {
                        const r = data[i * 4];
                        const g = data[i * 4 + 1];
                        const b = data[i * 4 + 2];
                        alphaMap[i] = Math.max(r, g, b) / 255.0;
                    }
                    maskCache[size] = alphaMap;
                    resolve(alphaMap);
                })
                .catch(e => {
                    console.error("Mask Load Error:", e);
                    reject(e);
                });
        });
    }

    // ⚡️ 极速版：不再进行像素安全检查，默认传入的都是 Gemini 图片
    async function cleanGeminiWatermark(bufferObj) {
        if (!bufferObj.type || !bufferObj.type.startsWith('image/')) return bufferObj;
        try {
            const blob = new Blob([bufferObj.buffer], { type: bufferObj.type });
            const bitmap = await createImageBitmap(blob);
            const { width, height } = bitmap;

            if (width < 100 || height < 100) return bufferObj; // 太小的不可能有水印

            // 判断规格
            const isLarge = width > 1024 && height > 1024;
            const maskSize = isLarge ? 96 : 48;
            const margin = isLarge ? 64 : 32;

            const alphaMap = await loadMask(maskSize);
            const canvas = document.createElement('canvas');
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bitmap, 0, 0);

            const startX = width - maskSize - margin;
            const startY = height - maskSize - margin;
            if (startX < 0 || startY < 0) return bufferObj;

            const imageData = ctx.getImageData(startX, startY, maskSize, maskSize);
            const pixels = imageData.data;
            const LOGO_VALUE = 255;
            const MAX_ALPHA = 0.99;
            const ALPHA_THRESHOLD = 0.002;

            // ⚠️ Fix: 严格对齐参考脚本的反向混合逻辑
            for (let i = 0; i < alphaMap.length; i++) {
                let alpha = alphaMap[i];
                if (alpha < ALPHA_THRESHOLD) continue;
                
                alpha = Math.min(alpha, MAX_ALPHA);
                const oneMinusAlpha = 1 - alpha;
                const idx = i * 4;

                for (let c = 0; c < 3; c++) {
                    const watermarked = pixels[idx + c];
                    const original = (watermarked - alpha * LOGO_VALUE) / oneMinusAlpha;
                    // 限制范围 + 四舍五入 (Math.round 也是参考脚本的关键点)
                    pixels[idx + c] = Math.max(0, Math.min(255, Math.round(original)));
                }
            }
            ctx.putImageData(imageData, startX, startY);
            
            const newBlob = await new Promise(r => canvas.toBlob(r, bufferObj.type));
            return { buffer: await newBlob.arrayBuffer(), type: bufferObj.type };
        } catch (e) {
            console.error("Clean error:", e);
            return bufferObj;
        }
    }

    // ------------------- 0. 环境自检 -------------------
    function checkPicListConnection() {
        GM_xmlhttpRequest({
            method: "GET", url: "http://127.0.0.1:36677/heartbeat", timeout: 2000,
            onload: (res) => { if (res.status === 200) console.log("✅ PicList 连接正常"); },
            onerror: () => console.error("❌ 无法连接到 PicList")
        });
    }
    setTimeout(checkPicListConnection, 3000);

    // ------------------- 1. 配置管理 -------------------
    function getConfig() { return { token: GM_getValue('notion_token', ''), dbId: GM_getValue('notion_db_id', '') }; }
    function promptConfig() {
        const token = prompt('请输入 Notion Integration Secret:', GM_getValue('notion_token', ''));
        if (token) {
            const dbId = prompt('请输入 Notion Database ID:', GM_getValue('notion_db_id', ''));
            if (dbId) { GM_setValue('notion_token', token); GM_setValue('notion_db_id', dbId); alert('配置已保存'); }
        }
    }
    GM_registerMenuCommand("⚙️ 设置 Notion Token", promptConfig);

    // ------------------- 2. UI 样式 (全员 Sticky 版) -------------------
    GM_addStyle(`
        /* 全量导出按钮 */
        #gemini-saver-btn {
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            background-color: #0066CC; color: white; border: none; border-radius: 6px;
            padding: 10px 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: sans-serif; font-weight: 600; font-size: 14px; transition: all 0.2s;
        }
        #gemini-saver-btn:hover { background-color: #0052a3; transform: translateY(-2px); }
        #gemini-saver-btn.loading { background-color: #666; cursor: wait; }

        /* --- 视觉边界 --- */
        user-query:hover, model-response:hover {
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
            border-radius: 8px;
            background-color: rgba(66, 133, 244, 0.02);
        }

        /* --- 工具栏基础样式 --- */
        .gemini-tool-group {
            z-index: 9500;
            display: flex; gap: 6px;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            background: white;
            padding: 4px 6px; border-radius: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.15);
            border: 1px solid #e0e0e0;
        }
        user-query:hover .gemini-tool-group, model-response:hover .gemini-tool-group { opacity: 1; }
        .gemini-tool-group:has(.gemini-privacy-toggle[data-skip="true"]) { opacity: 1 !important; border-color: #fce8e6; background: #fff8f8; }

        /* =============================================
           🔥 全员 Sticky：双轨制解决方案
           ============================================= */

        /* 方案 A: AI 回复 (Model) - Block 布局 */
        model-response .gemini-tool-group {
            position: sticky;
            top: 14px;
            float: right;
            margin-left: 10px;
            margin-bottom: 10px;
        }

        /* 方案 B: 用户提问 (User) - Flex 布局 */
        user-query .gemini-tool-group {
            position: sticky;
            top: 14px;
            align-self: flex-start;
            margin-left: auto;
            margin-right: 10px;
            order: 100;
        }

        /* 图标样式 */
        .gemini-icon-btn {
            cursor: pointer; font-size: 16px; line-height: 24px; user-select: none;
            width: 26px; height: 26px; text-align: center;
            border-radius: 50%; transition: background 0.2s;
            display: flex; align-items: center; justify-content: center; color: #555;
        }
        .gemini-icon-btn:hover { background: rgba(0,0,0,0.08); color: #000; }
        .gemini-privacy-toggle[data-skip="true"] { color: #d93025; background: #fce8e6; }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .gemini-icon-btn.processing { cursor: wait; color: #1a73e8; background: #e8f0fe; }
        .gemini-icon-btn.processing span { display: block; animation: spin 1s linear infinite; }
        .gemini-icon-btn.success { color: #188038 !important; background: #e6f4ea; }
        .gemini-icon-btn.error { color: #d93025 !important; background: #fce8e6; }
    `);

    // ------------------- 3. UI 注入 -------------------
    function injectPageControls() {
        const bubbles = document.querySelectorAll('user-query, model-response');
        bubbles.forEach(bubble => {
            if (bubble.querySelector('.gemini-tool-group')) return;

            if (getComputedStyle(bubble).position === 'static') bubble.style.position = 'relative';

            const group = document.createElement('div');
            group.className = 'gemini-tool-group';

            // --- 隐私按钮 ---
            const privacyBtn = document.createElement('div');
            privacyBtn.className = 'gemini-icon-btn gemini-privacy-toggle';
            privacyBtn.title = "点击切换：是否导出此条内容";
            privacyBtn.setAttribute('data-skip', 'false');

            const privacyIcon = document.createElement('span');
            privacyIcon.textContent = '👁️';
            privacyBtn.appendChild(privacyIcon);

            privacyBtn.onclick = (e) => {
                e.stopPropagation();
                const isSkipping = privacyBtn.getAttribute('data-skip') === 'true';
                if (isSkipping) {
                    privacyBtn.setAttribute('data-skip', 'false'); privacyIcon.textContent = '👁️'; bubble.setAttribute('data-privacy-skip', 'false');
                } else {
                    privacyBtn.setAttribute('data-skip', 'true'); privacyIcon.textContent = '🚫'; bubble.setAttribute('data-privacy-skip', 'true');
                }
            };

            // --- 单条导出按钮 ---
            const singleExportBtn = document.createElement('div');
            singleExportBtn.className = 'gemini-icon-btn';
            singleExportBtn.title = "仅导出此条对话";

            const exportIcon = document.createElement('span');
            exportIcon.textContent = '📤';
            singleExportBtn.appendChild(exportIcon);

            singleExportBtn.onclick = (e) => {
                e.stopPropagation();
                handleSingleExport(bubble, singleExportBtn, exportIcon);
            };
            group.appendChild(privacyBtn);
            group.appendChild(singleExportBtn);

            if (bubble.tagName.toLowerCase() === 'user-query') {
                bubble.appendChild(group);
            } else {
                bubble.prepend(group);
            }
        });
    }

    // ------------------- 4. 资源处理 -------------------
    function convertBlobImageToBuffer(blobUrl) {
        return new Promise((resolve, reject) => {
            const img = document.querySelector(`img[src="${blobUrl}"]`);
            if (!img || !img.complete || img.naturalWidth === 0) return reject("图片加载失败");
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
                canvas.getContext('2d').drawImage(img, 0, 0);
                canvas.toBlob(b => b ? b.arrayBuffer().then(buf => resolve({ buffer: buf, type: b.type })) : reject("Canvas失败"), 'image/png');
            } catch (e) { reject(e.message); }
        });
    }

    function fetchAssetAsArrayBuffer(url) {
        return new Promise((resolve, reject) => {
            if (url.startsWith('blob:')) {
                convertBlobImageToBuffer(url).then(resolve).catch(() => {
                    GM_xmlhttpRequest({ method: "GET", url, responseType: 'arraybuffer', onload: r => r.status === 200 ? resolve({ buffer: r.response, type: 'application/octet-stream' }) : reject() });
                });
            } else {
                GM_xmlhttpRequest({
                    method: "GET", url, responseType: 'arraybuffer',
                    onload: r => {
                        if (r.status === 200) {
                            const m = r.responseHeaders.match(/content-type:\s*(.*)/i);
                            resolve({ buffer: r.response, type: m ? m[1] : undefined });
                        } else reject();
                    }
                });
            }
        });
    }

    function uploadToPicList(arrayBufferObj, filename) {
        return new Promise((resolve, reject) => {
            if (!arrayBufferObj.buffer) return reject("空文件");
            let finalFilename = filename.split('?')[0];
            const mime = (arrayBufferObj.type || '').split(';')[0].trim().toLowerCase();
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
            const boundary = "----GeminiSaverBoundary" + Math.random().toString(36).substring(2);
            const preData =
                `--${boundary}\r\n` +
                `Content-Disposition: form-data; name="file"; filename="${finalFilename.replace(/"/g, '')}"\r\n` +
                `Content-Type: ${mime || 'application/octet-stream'}\r\n\r\n`;
            const combinedBlob = new Blob([preData, arrayBufferObj.buffer, `\r\n--${boundary}--\r\n`]);

            GM_xmlhttpRequest({
                method: "POST", url: PICLIST_URL,
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
            } else if (b.type === 'file' && b.file?.external?.url?.startsWith(ASSET_PLACEHOLDER_PREFIX)) {
                urlObj = b.file.external;
            }

            if (urlObj) {
                const parts = urlObj.url.split('::');
                let isGeminiImg = false, name, realUrl;

                if (parts[1].startsWith('G=')) {
                    isGeminiImg = parts[1] === 'G=1';
                    name = parts[2];
                    realUrl = parts.slice(3).join('::'); 
                } else {
                    name = parts[1];
                    realUrl = parts.slice(2).join('::');
                }

                if (realUrl.startsWith('blob:') && b.type === 'file') {
                    b.type = "paragraph";
                    b.paragraph = { rich_text: [{ type: "text", text: { content: `📄 [本地文件未上传] ${name}` }, annotations: { color: "gray", italic: true } }] };
                    delete b.file; 
                    return;
                }


                let downloadUrl = realUrl;
                if (isGeminiImg && downloadUrl.match(/=s\d+/)) {
                    downloadUrl = downloadUrl.replace(/=s\d+(?:-c)?/g, '=s0');
                }


                // 使用替换后的 downloadUrl 来获取图片
                const task = fetchAssetAsArrayBuffer(downloadUrl)
                    .then(async (bufObj) => {
                        if (isGeminiImg && (b.type === 'image' || /\.(png|jpg|webp)$/i.test(name))) {
                            if (statusCallback) statusCallback(`🚿 Cleaning Gemini Img...`);
                            return await cleanGeminiWatermark(bufObj);
                        }
                        return bufObj;
                    })
                    .then(bufObj => {
                        return uploadToPicList(bufObj, name);
                    })
                    .then(u => ({ i, url: u, name, ok: true }))
                    .catch(e => ({ i, err: e, name, ok: false }));

                tasks.push(task); 
                map.set(i, b);
            }
        });

        if (tasks.length) {
            statusCallback(`⏳ Processing ${tasks.length} assets...`);
            const res = await Promise.all(tasks);
            
            res.forEach(r => {
                const blk = map.get(r.i);
                if (r.ok) {
                    if (blk.type === 'image') {
                        blk.image.external.url = r.url;
                    } else {
                        blk.file.external.url = r.url;
                        blk.file.name = r.name || "File";
                    }
                } else {
                    console.error(`Upload Fail: ${r.name}`, r.err);
                    blk.type = "paragraph";
                    blk.paragraph = {
                        rich_text: [{
                            type: "text",
                            text: { content: `⚠️ Upload Failed: ${r.name}` },
                            annotations: { color: "red" }
                        }]
                    };
                    delete blk.file; 
                    delete blk.image;
                }
            });
        }
        return blocks;
    }



    // ------------------- 5. DOM 解析 -------------------
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

    function detectLanguageRecursive(preNode) {
        let c = preNode;
        for (let i = 0; i < 3; i++) {
            if (!c) break;
            const h = c.previousElementSibling;
            if (h && NOTION_LANGUAGES.has(h.innerText.toLowerCase())) {
                return mapLanguageToNotion(h.innerText);
            }
            c = c.parentElement;
        }
        const code = preNode.querySelector('code');
        const m = code && code.className.match(/language-([\w-]+)/);
        return m ? mapLanguageToNotion(m[1]) : "plain text";
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
            if (splitIndex === -1) {
                splitIndex = MAX_TEXT_LENGTH;
            } else {
                splitIndex += 1;
            }
            chunks.push(remaining.slice(0, splitIndex));
            remaining = remaining.slice(splitIndex);
        }
        return chunks;
    }

    function parseInlineNodes(nodes) {
        const rt = [];
        function tr(n, s = {}) {
            // 文本节点
            if (n.nodeType === 3) {
                const fullText = n.textContent;
                if (!fullText) return;
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
            }
            // 元素节点
            else if (n.nodeType === 1) {
                // 行内公式：data-latex-source / data-math
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

    // ------------------- 6. 核心：块级解析（包含 UL/OL 修复版） -------------------
    // ⚠️ 修改了函数签名，增加 isGeminiSource 参数
    function processNodesToBlocks(nodes, isGeminiSource = false) {
        const blocks = [], buf = [];
        const flush = () => {
            if (buf.length) {
                const rt = parseInlineNodes(buf);
                if (rt.length) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: rt } });
                buf.length = 0;
            }
        };
        const fileExtRegex = /\.(pdf|zip|docx?|xlsx?|pptx?|csv|txt|md|html?|rar|7z|tar|gz|iso|exe|apk|dmg|json|xml|epub|R|Rmd|qmd)(\?|$)/i;

        Array.from(nodes).forEach(n => {
            if (['SCRIPT', 'STYLE', 'SVG'].includes(n.nodeName)) return;
            const isElement = n.nodeType === 1;

            // --- 公式块处理 (略，保持原样) ---
            if (isElement) {
                const isMathTag = n.hasAttribute('data-math') || n.hasAttribute('data-latex-source');
                const isBlockLayout = n.tagName === 'DIV' || n.classList.contains('math-block') || n.classList.contains('katex-display');
                if (isMathTag && isBlockLayout) {
                    const latex = n.getAttribute('data-latex-source') || n.getAttribute('data-math');
                    if (latex) {
                        flush();
                        blocks.push({ object: "block", type: "equation", equation: { expression: latex.trim() } });
                        return;
                    }
                }
            }

            if (isElement && (n.nodeName === 'RESPONSE-ELEMENT' || n.nodeName === 'LINK-BLOCK')) {
                // 修复：除了检查图片，也要检查是否包含表格 (table) 或 代码块 (pre)
                const shouldExpand = !!n.querySelector('img') || !!n.querySelector('table') || !!n.querySelector('pre'); 
                
                if (shouldExpand) {
                    flush();
                    // 递归处理内部结构，这样表格就会被当作 Block 处理，而不是纯文本
                    blocks.push(...processNodesToBlocks(n.childNodes, isGeminiSource));
                } else {
                    buf.push(n);
                }
                return;
            }

            // --- 行内元素缓冲 ---
            if (n.nodeType === 3 || ['B', 'I', 'CODE', 'SPAN', 'A', 'STRONG', 'EM', 'MAT-ICON'
            ].includes(n.nodeName)) {
                // 文件下载链接处理
                if (n.nodeName === 'A' && isElement && (n.hasAttribute('download') || n.href.includes('blob:') || fileExtRegex.test(n.href))) {
                    flush();
                    const fn = (n.innerText || 'file').trim();
                    // 标记：这里通常是文件，暂不打 Gemini 标记或设为 0
                    blocks.push({
                        object: "block", type: "file",
                        file: { type: "external", name: fn.slice(0, 60), external: { url: `${ASSET_PLACEHOLDER_PREFIX}G=0::${fn}::${n.href}` } }
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
                    // 递归传递 isGeminiSource
                    blocks.push(...processNodesToBlocks(n.childNodes, isGeminiSource));
                }
                else if (t === 'IMG' && !n.className.includes('avatar')) {
                    // ====== 1) 过滤掉装饰性 icon（比如 YouTube logo）======
                    const src = (n.src || "").toLowerCase();
                    const alt = (n.alt || "").toLowerCase();
                    const cls = (n.className || "").toLowerCase();
                    const title = (n.title || "").toLowerCase();

                    // 尺寸判断：用 DOM 尺寸 + natural 尺寸兜底
                    const w = n.naturalWidth || n.width || n.clientWidth || 0;
                    const h = n.naturalHeight || n.height || n.clientHeight || 0;

                    const looksLikeYoutube =
                        src.includes("youtube") || src.includes("ytimg") || alt.includes("youtube") || title.includes("youtube");

                    const looksLikeIcon =
                        w && h && (w <= 80 && h <= 80) && (
                            cls.includes("icon") || cls.includes("logo") ||
                            alt.includes("icon") || alt.includes("logo") ||
                            title.includes("icon") || title.includes("logo") ||
                            src.includes("logo") || src.includes("icon") || src.includes("favicon")
                        );

                    // 你要的：YouTube icon 不上传
                    if (looksLikeYoutube && (looksLikeIcon || (w <= 120 && h <= 120))) {
                        return;
                    }

                    // 也可以更激进：所有小图标都不要
                    // if (w && h && w <= 48 && h <= 48) return;

                    // ====== 2) 正常图片继续导出 ======
                    const flag = isGeminiSource ? "1" : "0";
                    blocks.push({
                        object: "block",
                        type: "image",
                        image: { type: "external", external: { url: `${ASSET_PLACEHOLDER_PREFIX}G=${flag}::image.png::${n.src}` } }
                    });
                }
                else if (t === 'PRE') { /* ...代码块处理保持原样... */
                    const fullCode = n.textContent;
                    const lang = detectLanguageRecursive(n);
                    const rawChunks = splitCodeSafe(fullCode);
                    const codeRichText = rawChunks.map(chunk => ({ type: "text", text: { content: chunk } }));
                    blocks.push({ object: "block", type: "code", code: { rich_text: codeRichText, language: lang } });
                }
                else if (/^H[1-6]$/.test(t)) { /* ...标题处理保持原样... */
                    const level = t[1] < 4 ? t[1] : 3;
                    blocks.push({ object: "block", type: `heading_${level}`, [`heading_${level}`]: { rich_text: parseInlineNodes(n.childNodes) } });
                }
                else if (t === 'BLOCKQUOTE') {
                    // 递归解析引用块内部的结构（p/ul/ol/...）
                    const innerBlocks = processNodesToBlocks(n.childNodes, isGeminiSource);

                    let richText = [{ type: "text", text: { content: "" } }];
                    let children = innerBlocks;

                    // 如果第一块是 paragraph，就用它做 quote 的正文，其余当 children
                    if (innerBlocks.length) {
                        const first = innerBlocks[0];
                        if (first.type === 'paragraph' && first.paragraph?.rich_text?.length) {
                            richText = first.paragraph.rich_text;
                            children = innerBlocks.slice(1);
                        }
                    }

                    const quoteBlock = { object: "block", type: "quote", quote: { rich_text: richText } };
                    if (children.length) quoteBlock.quote.children = children;

                    blocks.push(quoteBlock);
                }
                else if (t === 'UL' || t === 'OL') {
                    const tp = t === 'UL' ? 'bulleted_list_item' : 'numbered_list_item';
                    Array.from(n.children).forEach(li => {
                        if (li.tagName !== 'LI') return;
                        // 递归传递 isGeminiSource
                        const liBlocks = processNodesToBlocks(li.childNodes, isGeminiSource); 
                        if (!liBlocks.length) return;
                        let richText, children = [];
                        const first = liBlocks[0];
                        if (first.type === 'paragraph' && first.paragraph?.rich_text?.length) {
                            richText = first.paragraph.rich_text;
                            children = liBlocks.slice(1);
                        } else {
                            richText = parseInlineNodes(li.childNodes);
                            children = liBlocks;
                        }
                        const listBlock = { object: "block", type: tp, [tp]: { rich_text: richText } };
                        if (children.length) listBlock[tp].children = children;
                        blocks.push(listBlock);
                    });
                }
                else if (t === 'TABLE') { /* ...表格处理保持原样... */
                    const rows = Array.from(n.querySelectorAll('tr'));
                    if (rows.length) {
                        const tb = { object: "block", type: "table", table: { table_width: 1, children: [] } };
                        let max = 0;
                        rows.forEach(r => {
                            const cs = Array.from(r.querySelectorAll('td,th'));
                            max = Math.max(max, cs.length);
                            tb.table.children.push({ object: "block", type: "table_row", table_row: { cells: cs.map(c => parseInlineNodes(c.childNodes)) } });
                        });
                        tb.table.table_width = max;
                        blocks.push(tb);
                    }
                }
                else {
                    // 递归默认
                    blocks.push(...processNodesToBlocks(n.childNodes, isGeminiSource));
                }
            }
        });
        flush();
        return blocks;
    }


    // ------------------- 7. 抓取逻辑 -------------------
    function buildUploadedImageMap() {
        const map = new Map();
        const imgs = document.querySelectorAll('img[data-test-id="uploaded-img"], img.preview-image');
        const bubbles = Array.from(document.querySelectorAll('user-query'));
        imgs.forEach(img => {
            let p = img.parentElement;
            while (p && p !== document.body) {
                if (p.tagName === 'USER-QUERY' || p.querySelector('user-query')) break;
                p = p.parentElement;
            }
            const owner = p && (p.tagName === 'USER-QUERY' ? p : p.querySelector('user-query')) || bubbles[bubbles.length - 1];
            if (owner) {
                if (!map.has(owner)) map.set(owner, []);
                map.get(owner).push(img);
            }
        });
        return map;
    }

    function getChatBlocks(targetBubbles = null) {
        const allBubbles = document.querySelectorAll('user-query, model-response');
        const bubblesToProcess = targetBubbles || Array.from(allBubbles);
        const children = [];
        const uploadMap = buildUploadedImageMap();

        if (bubblesToProcess.length > 0) {
            bubblesToProcess.forEach(bubble => {
                const isUser = bubble.tagName.toLowerCase() === 'user-query';
                const role = isUser ? "User" : "Gemini";
                
                // 🔥 关键标识：如果是 Gemini，则为 True
                const isGeminiSource = !isUser; 

                if (bubble.getAttribute('data-privacy-skip') === 'true') {
                    /* ... 隐私跳过逻辑保持原样 ... */
                    children.push({ object: "block", type: "callout", callout: { rich_text: [{ type: "text", text: { content: `🚫 此 ${role} 内容已标记为隐私，未导出。` }, annotations: { color: "gray", italic: true } }], icon: { emoji: "🔒" }, color: "gray_background" } });
                    return;
                }

                children.push({ object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: role } }], color: isUser ? "default" : "blue_background" } });

                const clone = bubble.cloneNode(true);
                ['.gemini-tool-group', 'mat-icon', '.response-footer', '.message-actions'].forEach(s => clone.querySelectorAll(s).forEach(e => e.remove()));

                if (isUser && uploadMap.has(bubble)) {
                    const d = document.createElement("div");
                    uploadMap.get(bubble).forEach(img => d.appendChild(img.cloneNode(true)));
                    clone.appendChild(d);
                }

                // 🔥 传入 isGeminiSource
                children.push(...processNodesToBlocks(clone.childNodes, isGeminiSource));
                children.push({ object: "block", type: "divider", divider: {} });
            });
        }
        return children;
    }


    // ------------------- 8. Notion 上传 -------------------
    function getChatTitle(specificBubble = null) {
        if (specificBubble)
            return specificBubble.innerText.replace(/\n/g, ' ').slice(0, 50) + "...";
        const q = document.querySelector('user-query');
        return q ? q.innerText.replace(/\n/g, ' ').slice(0, 60) : "Gemini Chat";
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
                    statusCallback('❌ Fail');
                    alert(res.responseText);
                }
            },
            onerror: () => statusCallback('❌ Net Error')
        });
    }

    // ------------------- 9. 主逻辑 & 状态控制 -------------------
    async function executeExport(blocks, title, btnOrLabelUpdater, iconElem) {
        const { token, dbId } = getConfig();
        if (!token) return promptConfig();

        const updateStatus = (msg) => {
            // 单条导出按钮
            if (btnOrLabelUpdater.classList && btnOrLabelUpdater.classList.contains('gemini-icon-btn') && iconElem) {
                if (msg && msg.includes('Saved')) {
                    btnOrLabelUpdater.classList.remove('processing');
                    btnOrLabelUpdater.classList.add('success');
                    iconElem.textContent = '✅';
                    setTimeout(() => {
                        btnOrLabelUpdater.classList.remove('success');
                        iconElem.textContent = '📤';
                    }, 2500);
                } else if (msg && (msg.includes('Fail') || msg.includes('Error'))) {
                    btnOrLabelUpdater.classList.remove('processing');
                    btnOrLabelUpdater.classList.add('error');
                    iconElem.textContent = '❌';
                } else if (msg) {
                    btnOrLabelUpdater.classList.add('processing');
                    btnOrLabelUpdater.classList.remove('success', 'error');
                    iconElem.textContent = '⏳';
                }
            }
            // 全局按钮
            else if (btnOrLabelUpdater.id === 'gemini-saver-btn') {
                if (msg === null) btnOrLabelUpdater.textContent = '📥 Save to Notion';
                else btnOrLabelUpdater.textContent = msg;
            }
        };

        if (btnOrLabelUpdater.id === 'gemini-saver-btn') {
            btnOrLabelUpdater.classList.add('loading');
            btnOrLabelUpdater.textContent = '🕵️ Processing...';
        } else {
            updateStatus('Processing...');
        }

        try {
            blocks = await processAssets(blocks, updateStatus);
            if (btnOrLabelUpdater.id === 'gemini-saver-btn') btnOrLabelUpdater.textContent = '💾 Saving...';
            createPageAndUpload(title, blocks, token, dbId, updateStatus);
        } catch (e) {
            console.error(e);
            if (btnOrLabelUpdater.id === 'gemini-saver-btn') btnOrLabelUpdater.textContent = '❌ Error';
            updateStatus('❌ Fail');
            alert(e.message);
        } finally {
            if (btnOrLabelUpdater.id === 'gemini-saver-btn') btnOrLabelUpdater.classList.remove('loading');
        }
    }

    function handleFullExport() {
        const btn = document.getElementById('gemini-saver-btn');
        const blocks = getChatBlocks(null);
        executeExport(blocks, getChatTitle(), btn);
    }

    function handleSingleExport(bubble, iconBtn, iconElem) {
        const targets = [bubble];
        if (bubble.tagName.toLowerCase() === 'user-query') {
            const next = bubble.nextElementSibling;
            if (next && next.tagName.toLowerCase() === 'model-response' && next.getAttribute('data-privacy-skip') !== 'true') {
                targets.push(next);
            }
        }
        const blocks = getChatBlocks(targets);
        const title = getChatTitle(bubble);
        executeExport(blocks, title, iconBtn, iconElem);
    }

    function tryInit() {
        if (!document.getElementById('gemini-saver-btn')) {
            const btn = document.createElement('button');
            btn.id = 'gemini-saver-btn';
            btn.textContent = '📥 Save to Notion';
            btn.onclick = handleFullExport;
            document.body.appendChild(btn);
        }
        injectPageControls();
    }
    setInterval(tryInit, 1500);

})();