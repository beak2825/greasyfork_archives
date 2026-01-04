// ==UserScript==
// @name         ChatGPT Backup 100%
// @namespace    @reinaldyalaratte
// @version      1.1
// @description  ChatGPT backup history chat become HTML in local storage (Include video, image, pdf etc.)
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @icon         https://static.vecteezy.com/system/resources/previews/021/059/825/non_2x/chatgpt-logo-chat-gpt-icon-on-green-background-free-vector.jpg
// @license      CC-BY-NC
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/558073/ChatGPT%20Backup%20100%25.user.js
// @updateURL https://update.greasyfork.org/scripts/558073/ChatGPT%20Backup%20100%25.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const dataUrlCache = new Map();

    GM_registerMenuCommand('Backup chat ini (ChatGPT)', () => {
        backupChat().catch(e => {
            console.error('Error backup:', e);
            alert('Terjadi error saat backup. Lihat console (F12).');
        });
    });

    async function backupChat() {
        const pageUrl = location.href;
        const pageTitle = document.title || 'ChatGPT Conversation';
        const timestamp = new Date().toISOString();

        const anchorNodes = Array.from(document.querySelectorAll('[data-message-author-role]'));
        if (anchorNodes.length === 0) {
            alert('Tidak ditemukan pesan di halaman ini.');
            return;
        }

        const anchorInfos = anchorNodes.map((a) => {
            const role = (a.dataset && a.dataset.messageAuthorRole
                ? a.dataset.messageAuthorRole
                : 'unknown').toLowerCase();

            const root =
                a.closest('div[data-testid="conversation-turn"]') ||
                a.closest('article') ||
                a.parentElement ||
                a;

            return { anchor: a, root, role };
        });

        const anchorInfoByNode = new Map(anchorInfos.map(info => [info.anchor, info]));

        const gptImgSelector =
            'img[alt="Gambar yang dibuat"], img[alt="Image generated"], img[alt="Generated image"]';

        const streamNodes = Array.from(
            document.querySelectorAll('[data-message-author-role], ' + gptImgSelector)
        );

        const messages = [];
        const gallery = [];
        const gallerySeen = new Set();

        let userCount = 0;
        let assistantCount = 0;
        let systemCount = 0;

        const GPT_ALT_SET = new Set([
            'Gambar yang dibuat',
            'Image generated',
            'Generated image'
        ]);

        function shouldSkipImageSrc(src, alt) {
            if (src && src.startsWith('data:image') && (!alt || !alt.trim())) {
                return true;
            }
            return false;
        }

        async function addImageToMessage(msg, embedded, alt) {
            if (!msg) return;
            if (!embedded) return;
            if (shouldSkipImageSrc(embedded, alt)) return;

            if (!msg.images.some(i => i.src === embedded)) {
                msg.images.push({ src: embedded, alt });
            }
            if (!gallerySeen.has(embedded)) {
                gallerySeen.add(embedded);
                gallery.push({ src: embedded, alt });
            }
        }

        function findContainingMessage(messagesArr, node) {
            for (let i = messagesArr.length - 1; i >= 0; i--) {
                if (messagesArr[i]._root && messagesArr[i]._root.contains(node)) {
                    return messagesArr[i];
                }
            }
            return null;
        }
        for (const node of streamNodes) {
            if (node.hasAttribute && node.hasAttribute('data-message-author-role')) {
                const info = anchorInfoByNode.get(node);
                if (!info) continue;

                const role = info.role;
                let displayIndex;
                if (role === 'user') {
                    userCount += 1;
                    displayIndex = userCount;
                } else if (role === 'assistant') {
                    assistantCount += 1;
                    displayIndex = assistantCount;
                } else {
                    systemCount += 1;
                    displayIndex = systemCount;
                }

                const text = extractText(info.root);
                const attachments = await extractAttachments(info.root);

                const msg = {
                    role,
                    displayIndex,
                    text,
                    images: [],
                    attachments,
                    _root: info.root
                };
                const imgs = Array.from(info.root.querySelectorAll('img'));
                const seenSrc = new Set();
                for (const img of imgs) {
                    if (!img.src) continue;
                    if (seenSrc.has(img.src)) continue;
                    seenSrc.add(img.src);

                    const alt = img.alt || '';
                    if (GPT_ALT_SET.has(alt)) continue;

                    if (shouldSkipImageSrc(img.src, alt)) continue;
                    const embedded = await toEmbeddedSrc(img.src);
                    await addImageToMessage(msg, embedded, alt);
                }

                messages.push(msg);
            } else if (node.tagName && node.tagName.toLowerCase() === 'img') {
                const alt = node.alt || '';
                if (!GPT_ALT_SET.has(alt)) continue;
                if (node.src && node.src.startsWith('data:image')) {
                    continue;
                }

                if (shouldSkipImageSrc(node.src, alt)) continue;

                const embedded = await toEmbeddedSrc(node.src);
                if (!embedded || shouldSkipImageSrc(embedded, alt)) continue;
                let targetMsg = findContainingMessage(messages, node);
                if (!targetMsg) {
                    const last = messages[messages.length - 1];
                    if (last && last.role === 'assistant') {
                        targetMsg = last;
                    }
                }
                if (!targetMsg) {
                    assistantCount += 1;
                    targetMsg = {
                        role: 'assistant',
                        displayIndex: assistantCount,
                        text: '',
                        images: [],
                        attachments: [],
                        _root: null
                    };
                    messages.push(targetMsg);
                }
                await addImageToMessage(targetMsg, embedded, alt);
            }
        }

        messages.forEach(m => { delete m._root; });

        const html = buildHtml({
            meta: {
                title: pageTitle,
                url: pageUrl,
                exported_at: timestamp
            },
            messages,
            galleryImages: gallery
        });

        const filename = `chatgpt_backup_${timestamp.replace(/[:.]/g, '-')}.html`;
        downloadHtml(html, filename);
    }

    function extractText(root) {
        const clone = root.cloneNode(true);
        clone.querySelectorAll('button,input,textarea,svg,nav,header,footer,[role="button"]').forEach(el => el.remove());
        return (clone.innerText || clone.textContent || '').trim();
    }

    async function extractAttachments(root) {
        const links = Array.from(root.querySelectorAll('a[href]'));
        const out = [];
        const seen = new Set();

        for (const a of links) {
            let href = a.getAttribute('href');
            if (!href) continue;
            const lower = href.toLowerCase();
            const isFileLike =
                a.hasAttribute('download') ||
                /\.(zip|rar|7z|pdf|docx?|xlsx?|pptx?|csv|txt|json|mp4|mov|avi|mkv|webm|mp3|wav|flac|ogg)$/i.test(lower) ||
                lower.startsWith('blob:') ||
                lower.includes('files.openai.com');

            if (!isFileLike) continue;
            if (seen.has(href)) continue;
            seen.add(href);

            const nameFromAttr = a.getAttribute('download');
            const nameFromUrl = href.split(/[?#]/)[0].split('/').pop() || 'file';
            const filename = nameFromAttr || nameFromUrl;

            const src = await toEmbeddedSrc(href);
            out.push({ name: filename, src });
        }

        return out;
    }

    async function toEmbeddedSrc(url) {
        try {
            if (url.startsWith('data:')) return url;
            if (dataUrlCache.has(url)) return dataUrlCache.get(url);

            const res = await fetch(url);
            const blob = await res.blob();
            const dataUrl = await new Promise((resolve, reject) => {
                const r = new FileReader();
                r.onloadend = () => resolve(r.result);
                r.onerror = reject;
                r.readAsDataURL(blob);
            });

            dataUrlCache.set(url, dataUrl);
            return dataUrl;
        } catch (e) {
            console.warn('Gagal embed resource, pakai URL asli:', url, e);
            return url;
        }
    }

    function downloadHtml(html, filename) {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
    function buildHtml(data) {
        const { meta, messages, galleryImages } = data;
        return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>Backup ChatGPT - ${escapeHtml(meta.title)}</title>
<style>
    body {
        font-family: Cambria, "Times New Roman", serif;
        background: #f0f0f0;
        margin: 0;
        padding: 20px;
    }
    .container {
        max-width: 960px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 10px;
        padding: 20px 24px 28px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
        font-size: 28px;
        margin-top: 0;
        margin-bottom: 10px;
    }
    .meta {
        font-size: 13px;
        margin-bottom: 20px;
    }
    .meta b { font-weight: 600; }
    .msg {
        border-radius: 6px;
        padding: 10px 14px;
        margin-bottom: 12px;
        border-left: 4px solid #777;
        background: #f9f9f9;
    }
    .msg.user {
        border-left-color: #1976d2;
        background: #e6f2ff;
    }
    .msg.assistant {
        border-left-color: #43a047;
        background: #e8f6ea;
    }
    .msg.system {
        border-left-color: #757575;
        background: #f0f0f0;
    }
    .msg-header {
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 4px;
    }
    .msg-body {
        white-space: pre-wrap;
        font-size: 14px;
    }
    .msg-images {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    .msg-images img {
        max-width: 260px;
        max-height: 260px;
        border-radius: 4px;
        border: 1px solid #ccc;
        object-fit: contain;
        background: #fff;
    }
    .msg-files {
        margin-top: 6px;
        font-size: 13px;
        padding-left: 18px;
    }
    .msg-files li {
        margin-bottom: 2px;
    }
    .gallery-title {
        margin-top: 30px;
        font-size: 18px;
        font-weight: 600;
        border-top: 1px solid #ddd;
        padding-top: 14px;
    }
    .gallery {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    .gallery img {
        max-width: 220px;
        max-height: 220px;
        border-radius: 4px;
        border: 1px solid #ccc;
        object-fit: contain;
        background: #fff;
    }
        .ig-watermark {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 8px;
    }
    .ig-watermark a {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        text-decoration: none;
        color: #555;
    }
    .ig-watermark a:hover {
        color: #e1306c;
    }
    .ig-watermark-logo {
        width: 18px;
        height: 18px;
    }

</style>
</head>
<body>
<div class="container">
    <div class="ig-watermark">
        <a href="https://www.instagram.com/reinaldyalaratte/" target="_blank" rel="noopener noreferrer">
            <svg class="ig-watermark-logo" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="#E1306C"></rect>
                <circle cx="12" cy="12" r="5" fill="white"></circle>
                <circle cx="12" cy="12" r="3.2" fill="#E1306C"></circle>
                <circle cx="17" cy="7" r="1.2" fill="white"></circle>
            </svg>
            <span>@reinaldyalaratte</span>
        </a>
    </div>
    <h1>ChatGPT Backup 100%</h1>
    <div class="meta">

        <div><b>Tittle:</b> ${escapeHtml(meta.title)}</div>
        <div><b>URL:</b> <a href="${escapeHtml(meta.url)}" target="_blank">${escapeHtml(meta.url)}</a></div>
        <div><b>Date & Times:</b> ${escapeHtml(meta.exported_at)}</div>
        <div><b>Total Messages:</b> ${messages.length}</div>
    </div>

    ${messages.map(m => `
        <div class="msg ${escapeHtml(m.role)}">
            <div class="msg-header">[${m.role.toUpperCase()} #${m.displayIndex}]</div>
            <div class="msg-body">${escapeHtml(m.text || '')}</div>
            ${m.images && m.images.length ? `
                <div class="msg-images">
                    ${m.images.map(img => `
                        <img src="${img.src}" alt="${escapeHtml(img.alt || '')}" loading="lazy">
                    `).join('')}
                </div>
            ` : ''}
            ${m.attachments && m.attachments.length ? `
                <ul class="msg-files">
                    ${m.attachments.map(att => `
                        <li><a href="${att.src}" download="${escapeHtml(att.name)}">${escapeHtml(att.name)}</a></li>
                    `).join('')}
                </ul>
            ` : ''}
        </div>
    `).join('')}

    ${galleryImages && galleryImages.length ? `
        <div class="gallery-title">Complete Image</div>
        <div class="gallery">
            ${galleryImages.map(img => `
                <img src="${img.src}" alt="${escapeHtml(img.alt || '')}" loading="lazy">
            `).join('')}
        </div>
    ` : ''}
</div>
</body>
</html>`;
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

})();
