// ==UserScript==
// @name         ChatGPT 对话记录导出/页面宽屏展示
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  在任意网页检测 ChatGPT 特征，提供对话导出及宽屏显示模式。
// @license      V：ChatGPT4V
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554399/ChatGPT%20%E5%AF%B9%E8%AF%9D%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA%E9%A1%B5%E9%9D%A2%E5%AE%BD%E5%B1%8F%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/554399/ChatGPT%20%E5%AF%B9%E8%AF%9D%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA%E9%A1%B5%E9%9D%A2%E5%AE%BD%E5%B1%8F%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FEATURE_SELECTORS = ['#thread', '[data-testid^="conversation-turn-"]', '[data-message-author-role]'];
    const WIDESCREEN_STORAGE_KEY = 'chatgpt_widescreen_state';

    function isChatGPTPage() {
        return FEATURE_SELECTORS.some(selector => document.querySelector(selector));
    }

    function injectStyles() {
        if (document.getElementById('chatgpt-helper-style')) return;
        const style = document.createElement('style');
        style.id = 'chatgpt-helper-style';
        style.textContent = `
            /* 强制放开中间对话区域的宽度限制 */
            .largescreen .mx-auto { max-width: 100% !important; }
            .largescreen .text-base { max-width: 100% !important; }

            /* 覆盖常见的 Tailwind 宽度限制类 (适配不同分辨率的 ChatGPT 布局) */
            .largescreen .md\\:max-w-3xl,
            .largescreen .lg\\:max-w-\\[40rem\\],
            .largescreen .xl\\:max-w-\\[48rem\\] {
                max-width: 100% !important;
            }

            /* 底部输入框宽度调整 */
            .largescreen form { max-width: 90% !important; margin: 0 auto !important; }
            .largescreen main form.w-full { max-width: 90% !important; }

            /* 按钮样式保持不变 */
            .custom-ai-btn {
                position: fixed; right: 20px; z-index: 9999;
                background-color: #10a37f; color: #fff; border: none;
                padding: 6px 10px; border-radius: 6px; font-size: 14px;
                cursor: pointer; font-family: sans-serif; font-weight: 600;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: background 0.2s;
            }
            .custom-ai-btn:hover { background-color: #0e8f6e; }
            .custom-ai-btn:disabled { background-color: #999; cursor: wait; }
            .ai-image-label { font-weight: bold; margin-bottom: 5px; color: #2c3e50; border-left: 4px solid #10a37f; padding-left: 8px; font-size: 14px; }
        `;
        document.head.appendChild(style);
    }

    function toggleWidescreen(enable) {
        const main = document.querySelector('main.w-full') || document.querySelector('main');
        if (!main) return;
        enable ? main.classList.add('largescreen') : main.classList.remove('largescreen');
        localStorage.setItem(WIDESCREEN_STORAGE_KEY, enable);
        const btn = document.getElementById('widescreen-toggle-btn');
        if (btn) btn.innerHTML = enable ? '❌ 退出大屏' : '📺 展示大屏';
    }

    function createButton(id, text, bottom, onClick) {
        if (document.getElementById(id)) return;
        const btn = document.createElement('button');
        btn.id = id;
        btn.className = 'custom-ai-btn';
        btn.innerHTML = text;
        btn.style.bottom = bottom;
        btn.onclick = onClick;
        document.body.appendChild(btn);
    }

    function getChatTitle() {
        let title = document.title || 'ChatGPT_对话记录';
        return title.replace(' - ChatGPT', '').trim();
    }

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    async function fetchImageBlob(url) {
        try {
            const response = await fetch(url, { cache: 'force-cache' });
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (err) {
                console.warn('Image fetch failed:', url, err);
                return null;
            }
        }
    }

    function generateFullHtml(bodyContent, title) {
        return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

<style>
    body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f7f7f8; padding: 20px; margin: 0; color: #333; }
    .container { max-width: 98%; margin: 0 auto; padding-bottom: 50px; }
    h2 { text-align: center; color: #333; margin-bottom: 15px; font-weight: 600; font-size: 24px; }
    .notice-box { text-align: center; font-size: 13px; color: #2e7d32; background-color: #e8f5e9; border: 1px solid #c8e6c9; padding: 10px; border-radius: 6px; margin-bottom: 30px; display: table; margin-left: auto; margin-right: auto; }
    .row { display: flex; margin-bottom: 25px; width: 100%; }
    .row-user { justify-content: flex-end; }
    .row-gpt { justify-content: flex-start; }
    .avatar { width: 36px; height: 36px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0; }
    .avatar-user { background: #999; color: white; margin-left: 10px; }
    .avatar-gpt { background: #10a37f; color: white; margin-right: 10px; }
    .bubble { padding: 12px 16px; border-radius: 8px; line-height: 1.6; position: relative; font-size: 15px; }
    .bubble-user { background: #95ec69; color: #000; border-top-right-radius: 2px; white-space: pre-wrap; max-width: 85%; }
    .bubble-gpt { background: #fff; border: 1px solid #e5e5e5; border-top-left-radius: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); white-space: normal; max-width: 100%; flex: 1; min-width: 0; overflow-x: auto; }
    .ai-image-label { font-weight: bold; margin-bottom: 8px; color: #2c3e50; border-left: 4px solid #10a37f; padding-left: 8px; font-size: 14px; }

    .code-wrapper { background: #282c34; border-radius: 6px; margin: 10px 0; overflow: hidden; font-family: Consolas, monospace; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .code-header { background: #21252b; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #abb2bf; border-bottom: 1px solid #181a1f; }
    .copy-btn { background: #3e4451; border: none; color: #abb2bf; border-radius: 4px; cursor: pointer; padding: 3px 8px; font-size: 11px; transition: background 0.2s; }
    .copy-btn:hover { background: #4b5263; color: #fff; }

    pre { margin: 0; padding: 0; overflow-x: auto; white-space: pre; background: transparent !important; }
    .hljs { background: transparent !important; padding: 12px !important; font-size: 14px; line-height: 1.5; }
    code { font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; }

    img { max-width: 100%; border-radius: 5px; margin: 5px 0; display: block; }
    table { border-collapse: collapse; width: 100%; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; font-size: 14px; }
    th { background: #f2f2f2; }
    .katex { font-size: 1.1em; }

    .chat-img-thumb { max-width: 300px; max-height: 300px; border-radius: 8px; cursor: zoom-in; transition: transform 0.2s; display: block; margin: 8px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1); background-color: #eee; }
    .chat-img-thumb:hover { transform: scale(1.02); }

    #lightbox { display: none; position: fixed; z-index: 10000; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); justify-content: center; align-items: center; cursor: zoom-out; opacity: 0; transition: opacity 0.3s; }
    #lightbox.active { display: flex; opacity: 1; }
    #lightbox img { max-width: 95%; max-height: 95%; border-radius: 4px; box-shadow: 0 0 30px rgba(0,0,0,0.5); cursor: default; transform: scale(0.9); transition: transform 0.3s; }
    #lightbox.active img { transform: scale(1); }
</style>
<script>
    document.addEventListener('DOMContentLoaded', (event) => {
        hljs.highlightAll();
    });

    function copyToClipboard(btn) {
        const text = btn.closest('.code-wrapper').querySelector('code').innerText;
        navigator.clipboard.writeText(text).then(() => {
            const original = btn.innerText;
            btn.innerText = '已复制! ✔';
            setTimeout(() => btn.innerText = original, 2000);
        });
    }

    function showLightbox(src) {
        const lb = document.getElementById('lightbox');
        document.getElementById('lightbox-img').src = src;
        lb.classList.add('active');
    }

    function hideLightbox() {
        const lb = document.getElementById('lightbox');
        lb.classList.remove('active');
        setTimeout(() => { if(!lb.classList.contains('active')) document.getElementById('lightbox-img').src = ''; }, 300);
    }
</script>
</head>
<body>
    <div class="container">
        <h2>${title}</h2>
        <div class="notice-box">提示：点击图片可放大查看，右键图片可直接“另存为”<br>注意⚠：文件类为动态地址无法提取，需自行下载保存</div>
        ${bodyContent}
    </div>
    <div id="lightbox" onclick="hideLightbox()">
        <img id="lightbox-img" src="" onclick="event.stopPropagation()">
    </div>
</body>
</html>`;
    }

    function isValidImage(img) {
        if (img.alt === 'User' || img.alt === 'ChatGPT') return false;
        if (img.src && (img.src.includes('files.oaiusercontent.com') || img.src.includes('backend-api'))) return true;
        if (img.alt && (img.alt.includes('已生成') || img.alt.includes('Generated'))) return true;

        const w = img.naturalWidth || img.width || img.clientWidth;
        if (w > 0 && w < 50) return false;
        return true;
    }

    function isGeneratedImage(img) {
        if (!img) return false;
        if (img.src && (img.src.includes('files.oaiusercontent.com') || img.src.includes('backend-api'))) return true;
        if (img.alt && (img.alt.includes('已生成') || img.alt.includes('Generated'))) return true;
        return false;
    }

    function createAiLabel() {
        const label = document.createElement('p');
        label.className = 'ai-image-label';
        label.textContent = '图片已创建·AI出图⬇️';
        return label;
    }

    async function startExport() {
        const btn = document.getElementById('optimize-export-btn');
        const originalBtnText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '⏳ 扫描中...';

        const turnList = document.querySelectorAll('[data-testid^="conversation-turn-"]');
        const nodesToProcess = turnList.length ? Array.from(turnList) : [document.body];

        if (!turnList.length && !document.querySelector('[data-message-author-role]')) {
            alert('未检测到对话内容');
            btn.disabled = false;
            btn.innerHTML = originalBtnText;
            return;
        }

        const uniqueImageUrls = new Set();
        for (const turn of nodesToProcess) {
            turn.querySelectorAll('img').forEach(img => {
                if (isValidImage(img) && img.src) uniqueImageUrls.add(img.src);
            });
        }

        const imageCache = new Map();
        const urls = Array.from(uniqueImageUrls);
        const total = urls.length;

        if (total > 0) {
            btn.innerHTML = `⏳ 下载图片 (0/${total})...`;
            let count = 0;
            // Promise.all 并发下载，cache: 'force-cache' 实现秒读
            await Promise.all(urls.map(async (url) => {
                const base64 = await fetchImageBlob(url);
                count++;
                btn.innerHTML = `⏳ 下载图片 (${count}/${total})...`;
                if (base64) imageCache.set(url, base64);
            }));
        }

        btn.innerHTML = '⏳ 生成代码...';

        let chatHtmlContent = '';

        for (const turn of nodesToProcess) {
            const processedUrlsInTurn = new Set();
            const messages = turn.querySelectorAll('[data-message-author-role]');

            for (const msg of messages) {
                const role = msg.getAttribute('data-message-author-role');
                const textNode = msg.querySelector('.markdown') || msg.querySelector('.whitespace-pre-wrap');

                const validImages = Array.from(msg.querySelectorAll('img')).filter(isValidImage);

                if (!textNode && validImages.length === 0) continue;

                const container = document.createElement('div');
                if (textNode) container.appendChild(textNode.cloneNode(true));

                if (validImages.length > 0) {
                    let hasAddedAiLabel = false;
                    validImages.forEach(img => {
                        if (processedUrlsInTurn.has(img.src)) return;
                        processedUrlsInTurn.add(img.src);

                        if (role !== 'user' && isGeneratedImage(img) && !hasAddedAiLabel) {
                            container.appendChild(createAiLabel());
                            hasAddedAiLabel = true;
                        }

                        const finalSrc = imageCache.get(img.src) || img.src;
                        const newImg = document.createElement('img');
                        newImg.src = finalSrc;
                        newImg.className = 'chat-img-thumb';
                        newImg.setAttribute('onclick', 'showLightbox(this.src)');
                        container.appendChild(newImg);
                    });
                }

                processContainerContent(container);

                const innerHtml = container.innerHTML;
                if (role === 'user') {
                    chatHtmlContent += `<div class="row row-user"><div class="bubble bubble-user">${innerHtml}</div><div class="avatar avatar-user">我</div></div>`;
                } else {
                    chatHtmlContent += `<div class="row row-gpt"><div class="avatar avatar-gpt">GPT</div><div class="bubble bubble-gpt">${innerHtml}</div></div>`;
                }
            }

            const allImagesInTurn = Array.from(turn.querySelectorAll('img')).filter(isValidImage);
            const orphanImages = [];
            allImagesInTurn.forEach(img => {
                if (!processedUrlsInTurn.has(img.src)) {
                    orphanImages.push(img);
                    processedUrlsInTurn.add(img.src);
                }
            });

            if (orphanImages.length > 0) {
                const container = document.createElement('div');
                if (orphanImages.some(isGeneratedImage)) {
                    container.appendChild(createAiLabel());
                }
                orphanImages.forEach(img => {
                    const finalSrc = imageCache.get(img.src) || img.src;
                    const newImg = document.createElement('img');
                    newImg.src = finalSrc;
                    newImg.className = 'chat-img-thumb';
                    newImg.setAttribute('onclick', 'showLightbox(this.src)');
                    container.appendChild(newImg);
                });
                const innerHtml = container.innerHTML;
                chatHtmlContent += `<div class="row row-gpt"><div class="avatar avatar-gpt">GPT</div><div class="bubble bubble-gpt">${innerHtml}</div></div>`;
            }
        }

        const currentTitle = getChatTitle();
        const fullHtml = generateFullHtml(chatHtmlContent, currentTitle);

        const blob = new Blob([fullHtml], { type: 'text/html' });
        const a = document.createElement('a');
        const safeTitle = currentTitle.replace(/[\\/:*?"<>|]/g, '_') || 'ChatGPT_Export';
        a.href = URL.createObjectURL(blob);
        a.download = `${safeTitle}.html`;
        a.click();
        URL.revokeObjectURL(a.href);

        btn.disabled = false;
        btn.innerHTML = originalBtnText;
    }

    function processContainerContent(container) {
        container.querySelectorAll('pre').forEach(pre => {
            const code = pre.querySelector('code');
            if (code) {
                const langClass = code.className || 'language-plaintext';
                let langName = langClass.replace('language-', '');
                if(!langName || langName === 'undefined') langName = 'Code';

                const newBlock = document.createElement('div');
                newBlock.className = 'code-wrapper';
                newBlock.innerHTML = `
                    <div class="code-header">
                        <span class="code-lang">${langName}</span>
                        <button class="copy-btn" onclick="copyToClipboard(this)">复制代码</button>
                    </div>
                    <pre><code class="${langClass}">${escapeHtml(code.innerText)}</code></pre>
                `;
                pre.replaceWith(newBlock);
            }
        });

        container.querySelectorAll('a').forEach(a => {
            if (a.classList.contains('img-link')) return;
            a.target = '_blank';
            a.style.cssText = 'color:#0066cc; text-decoration:underline;';
            if (a.innerText.includes('下载') || a.hasAttribute('download')) {
                a.style.fontWeight = 'bold';
                a.innerHTML = '📄 ' + a.innerHTML;
            }
        });

        container.querySelectorAll('button, .icon-md, .sr-only').forEach(el => !el.classList.contains('copy-btn') && el.remove());
    }

    setInterval(() => {
        if (!isChatGPTPage()) return;
        injectStyles();
        createButton('widescreen-toggle-btn', '📺 展示大屏', '20px', () => {
             toggleWidescreen(localStorage.getItem(WIDESCREEN_STORAGE_KEY) !== 'true');
        });
        createButton('optimize-export-btn', '📥 导出对话', '60px', startExport);

        const savedState = localStorage.getItem(WIDESCREEN_STORAGE_KEY) === 'true';
        const main = document.querySelector('main.w-full') || document.querySelector('main');
        if (main && savedState && !main.classList.contains('largescreen')) {
            toggleWidescreen(true);
        }
    }, 1000);
})();