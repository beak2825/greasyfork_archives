// ==UserScript==
// @name         X Media Saver
// @name:zh-CN   X 媒体保存器
// @name:zh-TW   X 媒體保存器
// @name:ja      X メディアセーバー
// @name:ko      X 미디어 세이버
// @name:es      X Media Saver
// @name:fr      X Media Saver
// @name:de      X Media Saver
// @name:ru      X Media Saver

// @description         Download videos, images and GIFs from X.com. Copy to clipboard supported. GIFs are saved as real .gif format.
// @description:zh-CN   从 X.com 下载视频、图片和GIF。支持复制到剪贴板。GIF保存为真正的.gif格式。
// @description:zh-TW   從 X.com 下載影片、圖片和GIF。支援複製到剪貼簿。GIF儲存為真正的.gif格式。
// @description:ja      X.comから動画、画像、GIFをダウンロード。クリップボードへのコピー対応。GIFは本物の.gif形式で保存。
// @description:ko      X.com에서 비디오, 이미지, GIF 다운로드. 클립보드 복사 지원. GIF는 실제 .gif 형식으로 저장.
// @description:es      Descarga videos, imágenes y GIFs de X.com. Copia al portapapeles. Los GIFs se guardan en formato .gif real.
// @description:fr      Téléchargez des vidéos, images et GIFs depuis X.com. Copie dans le presse-papiers. Les GIFs sont enregistrés au format .gif réel.
// @description:de      Videos, Bilder und GIFs von X.com herunterladen. In Zwischenablage kopieren. GIFs werden im echten .gif-Format gespeichert.
// @description:ru      Скачивайте видео, изображения и GIF с X.com. Копирование в буфер обмена. GIF сохраняются в реальном формате .gif.

// @namespace    https://github.com/DomeenoH/x-media-saver
// @version      1.0.0
// @author       DomeenoH
// @license      MIT
// @homepageURL  https://github.com/DomeenoH/x-media-saver
// @supportURL   https://github.com/DomeenoH/x-media-saver/issues
// @icon         https://x.com/favicon.ico

// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      video.twimg.com
// @connect      pbs.twimg.com
// @connect      cdn.jsdelivr.net
// @resource     GIFWORKER https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js
// @require      https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561683/X%20Media%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/561683/X%20Media%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const workerScript = GM_getResourceText('GIFWORKER');
    const workerBlob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(workerBlob);

    GM_addStyle(`
        .xmd-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 36px;
            min-height: 36px;
            padding: 0 8px;
            border: none;
            background: transparent;
            border-radius: 9999px;
            cursor: pointer;
            transition: background-color 0.2s;
            color: rgb(113, 118, 123);
        }
        .xmd-action-btn:hover {
            background-color: rgba(29, 155, 240, 0.1);
            color: rgb(29, 155, 240);
        }
        .xmd-action-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .xmd-action-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }
        .xmd-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 99999;
            font-size: 14px;
        }
        .xmd-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 99999;
        }
        .xmd-modal img {
            max-width: 90%;
            max-height: 80%;
            border-radius: 8px;
        }
        .xmd-modal-tip {
            color: white;
            margin-top: 16px;
            font-size: 14px;
        }
        .xmd-modal-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 32px;
            cursor: pointer;
        }
    `);

    function showToast(msg, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'xmd-toast';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    function getMediaIdFromUrl(url) {
        const match = url.match(/\/([A-Za-z0-9_-]+)\.(mp4|jpg|png|gif)/);
        return match ? match[1] : Date.now().toString();
    }

    function getTweetInfo(article) {
        let username = 'unknown';
        const userLink = article.querySelector('a[href*="/status/"]');
        if (userLink) {
            const match = userLink.href.match(/twitter\.com\/([^/]+)\/|x\.com\/([^/]+)\//);
            if (match) username = match[1] || match[2];
        }

        let dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const timeEl = article.querySelector('time');
        if (timeEl && timeEl.dateTime) {
            dateStr = timeEl.dateTime.slice(0, 10).replace(/-/g, '');
        }

        return { username, dateStr };
    }

    function buildFilename(article, mediaId, ext) {
        const { username, dateStr } = getTweetInfo(article);
        return `${username}_${dateStr}_${mediaId}.${ext}`;
    }

    function fetchBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: (res) => resolve(res.response),
                onerror: reject
            });
        });
    }

    async function copyImageToClipboard(blob) {
        try {
            const item = new ClipboardItem({ [blob.type]: blob });
            await navigator.clipboard.write([item]);
            showToast('已复制到剪贴板');
        } catch (e) {
            showToast('复制失败: ' + e.message);
        }
    }

    async function copyGifAsHtml(gifBlob) {
        const reader = new FileReader();
        const dataUrl = await new Promise(r => {
            reader.onload = () => r(reader.result);
            reader.readAsDataURL(gifBlob);
        });

        const html = `<img src="${dataUrl}" />`;
        const htmlBlob = new Blob([html], { type: 'text/html' });
        const textBlob = new Blob([dataUrl], { type: 'text/plain' });

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': htmlBlob,
                    'text/plain': textBlob
                })
            ]);
            showToast('已复制GIF (粘贴到支持HTML的应用)');
        } catch (e) {
            showToast('复制失败: ' + e.message);
        }
    }

    function showGifModal(gifBlob) {
        const modal = document.createElement('div');
        modal.className = 'xmd-modal';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'xmd-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => modal.remove();

        const img = document.createElement('img');
        img.src = URL.createObjectURL(gifBlob);

        const tip = document.createElement('div');
        tip.className = 'xmd-modal-tip';
        tip.textContent = '右键点击图片 → 复制图像';

        modal.appendChild(closeBtn);
        modal.appendChild(img);
        modal.appendChild(tip);

        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        document.addEventListener('keydown', function esc(e) {
            if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', esc); }
        });

        document.body.appendChild(modal);
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        showToast('下载开始: ' + filename);
    }

    async function convertMp4ToGif(videoUrl, onProgress) {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.playsInline = true;

        const blob = await fetchBlob(videoUrl);
        video.src = URL.createObjectURL(blob);

        await new Promise((resolve) => {
            video.onloadedmetadata = resolve;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: canvas.width,
            height: canvas.height,
            workerScript: workerUrl
        });

        const fps = 15;
        const duration = video.duration;
        const frameInterval = 1 / fps;
        const frameDelay = Math.round(1000 / fps);

        for (let time = 0; time < duration; time += frameInterval) {
            video.currentTime = time;
            await new Promise(r => video.onseeked = r);
            ctx.drawImage(video, 0, 0);
            gif.addFrame(ctx, { copy: true, delay: frameDelay });
            if (onProgress) onProgress(Math.round((time / duration) * 100));
        }

        URL.revokeObjectURL(video.src);

        return new Promise((resolve) => {
            gif.on('finished', (blob) => resolve(blob));
            gif.render();
        });
    }

    function detectMediaType(article) {
        const videoEl = article.querySelector('video');
        if (videoEl) {
            const src = videoEl.src || videoEl.querySelector('source')?.src || '';
            if (src.includes('tweet_video')) {
                return { type: 'gif', url: src };
            }
            return { type: 'video', url: src };
        }

        const imgEl = article.querySelector('img[src*="pbs.twimg.com/media"]');
        if (imgEl) {
            let url = imgEl.src;
            url = url.replace(/&name=\w+/, '&name=orig').replace(/\?format=/, '?format=');
            if (!url.includes('name=')) url += '&name=orig';
            return { type: 'image', url: url };
        }

        return null;
    }

    function createButtons(article, media) {
        if (article.querySelector('.xmd-action-btn')) return;

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'xmd-action-btn';
        downloadBtn.title = '下载';
        downloadBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2a1 1 0 0 1 1 1v10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V3a1 1 0 0 1 1-1zM5 20a1 1 0 1 1 0 2h14a1 1 0 1 1 0-2H5z"/></svg>';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'xmd-action-btn';
        copyBtn.title = '复制';
        copyBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>';

        const mediaId = getMediaIdFromUrl(media.url);

        downloadBtn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadBtn.disabled = true;

            try {
                if (media.type === 'gif') {
                    downloadBtn.innerHTML = '⏳';
                    const gifBlob = await convertMp4ToGif(media.url, (p) => {
                        downloadBtn.innerHTML = `${p}%`;
                    });
                    downloadBlob(gifBlob, buildFilename(article, mediaId, 'gif'));
                } else if (media.type === 'video') {
                    const blob = await fetchBlob(media.url);
                    downloadBlob(blob, buildFilename(article, mediaId, 'mp4'));
                } else {
                    const blob = await fetchBlob(media.url);
                    const ext = media.url.includes('format=png') ? 'png' : 'jpg';
                    downloadBlob(blob, buildFilename(article, mediaId, ext));
                }
            } catch (err) {
                showToast('下载失败: ' + err.message);
            }

            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2a1 1 0 0 1 1 1v10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V3a1 1 0 0 1 1-1zM5 20a1 1 0 1 1 0 2h14a1 1 0 1 1 0-2H5z"/></svg>';
        };

        copyBtn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            copyBtn.disabled = true;

            try {
                if (media.type === 'gif') {
                    copyBtn.innerHTML = '⏳';
                    const gifBlob = await convertMp4ToGif(media.url, (p) => {
                        copyBtn.innerHTML = `${p}%`;
                    });
                    showGifModal(gifBlob);
                } else if (media.type === 'image') {
                    const blob = await fetchBlob(media.url);
                    const pngBlob = await convertToPng(blob);
                    await copyImageToClipboard(pngBlob);
                } else {
                    showToast('视频不支持复制到剪贴板');
                }
            } catch (err) {
                showToast('复制失败: ' + err.message);
            }

            copyBtn.disabled = false;
            copyBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>';
        };

        const actionBar = article.querySelector('[role="group"]');
        if (actionBar) {
            actionBar.appendChild(downloadBtn);
            if (media.type !== 'video') {
                actionBar.appendChild(copyBtn);
            }
        }
    }

    async function convertToPng(blob) {
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        await new Promise(r => img.onload = r);

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        URL.revokeObjectURL(img.src);

        return new Promise(r => canvas.toBlob(r, 'image/png'));
    }

    async function extractFirstFrameAsPng(videoUrl) {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.muted = true;

        const blob = await fetchBlob(videoUrl);
        video.src = URL.createObjectURL(blob);

        await new Promise(r => video.onloadedmetadata = r);
        video.currentTime = 0;
        await new Promise(r => video.onseeked = r);

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        URL.revokeObjectURL(video.src);

        return new Promise(r => canvas.toBlob(r, 'image/png'));
    }

    function scanAndAddButtons() {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            const media = detectMediaType(article);
            if (media) {
                createButtons(article, media);
            }
        });
    }

    const observer = new MutationObserver(() => {
        scanAndAddButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    scanAndAddButtons();

})();
